import type { IActionPlanner } from "../../actionPlanners/IActionPlanner.ts";
import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { IBwCommonSettingManager } from "../interface/IBwCommonSettingManager.ts";
import type { IBwCursor } from "../interface/IBwCursor.ts";
import type { IBwDrawVoteManager } from "../interface/IBwDrawVoteManager.ts";
import type { IBwExecutedOperationManager } from "../interface/IBwExecutedOperationManager.ts";
import type { IBwGridVisualEffect } from "../interface/IBwGridVisualEffect.ts";
import type { IBwRandomNumberManager } from "../interface/IBwRandomNumberManager.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import type { IBwWarEventManager } from "../interface/IBwWarEventManager.ts";
import type { IBwWarStatisticsManager } from "../interface/IBwWarStatisticsManager.ts";
import type { IBwWarView } from "../interface/IBwWarView.ts";
import { TimerTypeId } from "../../bootTimers/Constants.ts";
import type { IField } from "../../fields/IField.ts";
import type { IFogMap } from "../../fogMaps/IFogMap.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import {
    getBwWeatherManagerClass,
    getTurnManagerClass,
    getBwExecutedOperationManagerClass,
    getBwRandomNumberManagerClass,
    getBwDrawVoteManagerClass,
    getTaskObjectiveManagerClass,
    getFieldClass,
    getBwWarStatisticsManagerClass,
    getBwCommonSettingManagerClass,
    getPlayerManagerClass,
    getBwWarViewClass,
    getScwWarClass,
    getSfwWarClass,
    getUnitClass,
} from "../../gameHelpers/GhFactory.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText, getTileName, getText } from "../../lang/Utils.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { AliveStateId } from "../../players/Constants.ts";
import type { IPlayer } from "../../players/IPlayer.ts";
import type { IPlayerManager } from "../../players/IPlayerManager.ts";
import { getPlayersCountUnneutral } from "../../players/utils/Common.ts";
import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { MovingUnitAndPath } from "../../proto/schema/CommonProto/Structure/MovingUnitAndPath.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { playCoBgmWithWar } from "../../sounds/SoundPlayer.ts";
import type { ITaskObjectiveManager } from "../../taskObjectives/ITaskObjectiveManager.ts";
import type { ITileMap } from "../../tiles/ITileMap.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import type { PhaseCode } from "../../turns/Constants.ts";
import type { ITurnManager } from "../../turns/ITurnManager.ts";
import { ActionStateId, Hp } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import type { IUnitMap } from "../../units/IUnitMap.ts";
import { getNormalizedHp } from "../../units/utils/Common.ts";
import { getSelfSettingsCoBgmCodeArray } from "../../users/Model.ts";
import { checkIsDummy } from "../../users/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";
import type { IManager } from "../../weathers/IManager.ts";

type DamagePreviewSettings = {
    isEnabled   : boolean;
    settings    : {
        playerIndex             : number;
        isForcedInCoZone        : boolean;
        extraCommandTowerCount  : number;
    }[];
};

export abstract class BwWar implements IBwWar {
    private readonly _weatherManager        = new (getBwWeatherManagerClass())();
    private readonly _turnManager           = new (getTurnManagerClass())();
    private readonly _executedActionManager = new (getBwExecutedOperationManagerClass())();
    private readonly _randomNumberManager   = new (getBwRandomNumberManagerClass())();
    private readonly _drawVoteManager       = new (getBwDrawVoteManagerClass())();
    private readonly _taskObjectiveManager  = new (getTaskObjectiveManagerClass())();
    private readonly _field                 = new (getFieldClass())();
    private readonly _warStatisticsManager  = new (getBwWarStatisticsManagerClass())();
    private readonly _commonSettingManager  = new (getBwCommonSettingManagerClass())();
    private readonly _playerManager         = new (getPlayerManagerClass())();
    private readonly _view                  = new (getBwWarViewClass())();

    private _gameConfig             : GcData | null = null;
    private _warId                  : number | null = null;
    private _warType                = WarTypeId.Undefined;
    private _isRunning              = false;
    private _isExecutingAction      = false;
    private _isEnded                = false;
    private _isViewingWarInfo       = false;
    private _overridingBgmCode      : number | null = null;

    private _damagePreviewSettings  : DamagePreviewSettings = {
        isEnabled   : false,
        settings    : [],
    };

    public abstract init(data: SerialWar, gameConfig: GcData): void;
    public abstract getNormalMapId(): number | null;
    public abstract getIsNeedExecutedOperations(): boolean;
    public abstract getIsNeedSeedRandom(): boolean;
    public abstract getCanCheat(): boolean;
    public abstract getShouldSerializeFullInfoForFreeModeGames(): boolean;
    public abstract getWarEventManager(): IBwWarEventManager;
    public abstract getBootRestTime(playerIndex: number): number | null;
    public abstract getSettingsBootTimerParams(): number[];
    public abstract getIsExecuteActionsWithExtraData(): boolean;
    public abstract updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    protected _baseInit(data: SerialWar, gameConfig: GcData, warType: WarTypeId): void {
        const settingsForCommon = getExisted(data.getSettingsForCommon(), ClientErrorCode.BwWar_BaseInit_00);
        const configVersion     = getExisted(settingsForCommon.getConfigVersion(), ClientErrorCode.BwWar_BaseInit_01);
        if (configVersion !== gameConfig.getVersion()) {
            throw newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.BwWar_BaseInit_02);
        }

        this._setGameConfig(gameConfig);
        this.getWeatherManager().init(data.getWeatherManager());
        this.getDrawVoteManager().init(data.getPlayerManager(), data.getRemainingVotesForDraw(), data.getDrawVoteManager());

        const mapSize = MapSize.createWithSerialTileMap(data.getField()?.getTileMap());
        if (!mapSize.checkIsValid()) {
            throw newError(`Invalid mapSize: ${JSON.stringify(mapSize)}`, ClientErrorCode.BwWar_BaseInit_03);
        }

        if (warType === WarTypeId.Undefined) {
            throw newError(`Invalid warType: ${warType}`, ClientErrorCode.BwWar_BaseInit_04);
        }

        this._setWarType(warType);
        this.getCommonSettingManager().init({
            settings                : settingsForCommon,
            warType                 : warType,
            mapSize                 : mapSize,
            playersCountUnneutral   : getPlayersCountUnneutral(data.getPlayerManager()),
            gameConfig              : gameConfig,
        });

        const instanceWarRule = settingsForCommon.getInstanceWarRule();
        this.getWarEventManager().init(data.getWarEventManager(), instanceWarRule?.getWarEventFullData());
        this.getRandomNumberManager().init({
            isNeedSeedRandom: this.getIsNeedSeedRandom(),
            initialState    : data.getSeedRandomInitialState(),
            currentState    : data.getSeedRandomCurrentState(),
        });
        this.getExecutedOperationManager().init({
            isNeedExecutedOperations    : this.getIsNeedExecutedOperations(),
            data                        : data.getExecutedOperationManager(),
        });

        const playerManager = this.getPlayerManager();
        playerManager.init(data.getPlayerManager(), gameConfig);

        const playersCountUnneutral = playerManager.getTotalPlayersCount(false);
        const turnManagerData       = getExisted(data.getTurnManager(), ClientErrorCode.BwWar_BaseInit_05);
        this.getTurnManager().init(turnManagerData, playersCountUnneutral);
        this.getField().init({
            data                    : data.getField(),
            gameConfig              : gameConfig,
            playersCountUnneutral   : playersCountUnneutral,
        });
        this.getWarStatisticsManager().init({
            data                    : data.getWarStatisticsManager(),
            playersCountUnneutral   : playersCountUnneutral,
            currentTurnIndex        : turnManagerData.getTurnIndex(),
            gameConfiguration       : gameConfig,
        });
        this.getTaskObjectiveManager().init(data.getTaskObjectiveManager(), instanceWarRule?.getTaskObjectiveFullData());

        this._setWarId(data.getWarId() ?? null);
        this.setIsEnded(!!data.getIsEnded());
    }

    public fastLoadState(warData: SerialWar): void {
        this.stopRunning();

        const gameConfig            = this.getGcData();
        const playerManager         = this.getPlayerManager();
        const playersCountUnneutral = playerManager.getTotalPlayersCount(false);
        this.getWeatherManager().fastInit(warData.getWeatherManager());
        playerManager.fastInit(getExisted(warData.getPlayerManager()), gameConfig);
        this.getTurnManager().fastInit(getExisted(warData.getTurnManager()), playersCountUnneutral);
        this.getWarEventManager().fastInit(getExisted(warData.getWarEventManager()));
        this.getField().fastInit({
            data                    : getExisted(warData.getField()),
            gameConfig              : gameConfig,
            playersCountUnneutral   : playersCountUnneutral,
        });
        this.getDrawVoteManager().fastInit(
            warData.getRemainingVotesForDraw(),
            warData.getDrawVoteManager(),
        );
        this.getRandomNumberManager().init({
            isNeedSeedRandom    : this.getIsNeedSeedRandom(),
            initialState        : warData.getSeedRandomInitialState(),
            currentState        : warData.getSeedRandomCurrentState(),
        });
        this.getWarStatisticsManager().fastInit(warData.getWarStatisticsManager());
        this.getTaskObjectiveManager().fastInit(warData.getTaskObjectiveManager());
        this.getExecutedOperationManager().fastInit(warData.getExecutedOperationManager());
        this.setIsEnded(!!warData.getIsEnded());

        const warView = this.getView();
        warView.fastInit(this);
        this.startRunning().startRunningView();
        this.updateTilesAndUnitsOnVisibilityChanged(false);
        warView.updatePersistentText();

        playCoBgmWithWar({
            war                             : this,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(this.getPlayerInTurn().getCoCategoryId()),
        });
    }

    protected _initView(): void {
        this.getView().init(this);
    }
    protected _fastInitView(): void {
        this.getView().fastInit(this);
    }
    public getView(): IBwWarView {
        return this._view;
    }

    public serializeForCreateSfw(): SerialWar {
        return SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().serializeForCreateSfw().toJson(),
            settingsForMcw              : null,
            settingsForMrw              : null,
            settingsForMmw              : null,
            settingsForAtw              : null,
            settingsForMfw              : null,
            settingsForCcw              : null,
            settingsForScw              : null,
            settingsForSfw              : null,

            warId                       : this.getWarId(),
            isEnded                     : false,
            seedRandomInitialState      : null,
            seedRandomCurrentState      : null,
            executedOperationManager    : null,
            remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
            drawVoteManager             : this.getDrawVoteManager().getDrawVoteData()?.toJson(),
            weatherManager              : this.getWeatherManager().serializeForCreateSfw().toJson(),
            warEventManager             : this.getWarEventManager().serializeForCreateSfw().toJson(),
            playerManager               : this.getPlayerManager().serializeForCreateSfw().toJson(),
            turnManager                 : this.getTurnManager().serializeForCreateSfw().toJson(),
            field                       : this.getField().serializeForCreateSfw().toJson(),
            warStatisticsManager        : this.getWarStatisticsManager().serializeForCreateSfw().toJson(),
            taskObjectiveManager        : this.getTaskObjectiveManager().serializeForCreateSfw().toJson(),
        });
    }
    public serializeForCreateMfr(): SerialWar {
        return SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().serializeForCreateMfr().toJson(),
            settingsForMcw              : null,
            settingsForMrw              : null,
            settingsForMmw              : null,
            settingsForAtw              : null,
            settingsForMfw              : null,
            settingsForCcw              : null,
            settingsForScw              : null,
            settingsForSfw              : null,

            warId                       : this.getWarId(),
            isEnded                     : false,
            seedRandomInitialState      : null,
            seedRandomCurrentState      : null,
            executedOperationManager    : null,
            remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
            drawVoteManager             : this.getDrawVoteManager().getDrawVoteData()?.toJson(),
            weatherManager              : this.getWeatherManager().serializeForCreateMfr().toJson(),
            warEventManager             : this.getWarEventManager().serializeForCreateMfr().toJson(),
            playerManager               : this.getPlayerManager().serializeForCreateMfr().toJson(),
            turnManager                 : this.getTurnManager().serializeForCreateMfr().toJson(),
            field                       : this.getField().serializeForCreateMfr().toJson(),
            warStatisticsManager        : this.getWarStatisticsManager().serializeForCreateMfr().toJson(),
            taskObjectiveManager        : this.getTaskObjectiveManager().serializeForCreateMfr().toJson(),
        });
    }
    public async serializeForMap(): Promise<MapRawData> {
        const normalMapId               = this.getNormalMapId();
        const mapRawData                = normalMapId == null ? null : await getRawData(normalMapId);
        const tileMap                   = this.getTileMap();
        const mapSize                   = tileMap.getMapSize();
        const serialTileMap             = tileMap.serialize();
        const serialUnitMap             = this.getUnitMap().serialize();
        const instanceWarRule           = this.getInstanceWarRule();
        const warEventFullData          = instanceWarRule.getWarEventFullData();
        const mapSimpleDialogueArray    = instanceWarRule.getMapSimpleDialogueArray();
        const timestamp                 = getServerTimestamp();

        return MapRawData.fromJson({
            normalMapId             : null,
            designerName            : mapRawData?.getDesignerName(),
            designerUserId          : mapRawData?.getDesignerUserId(),
            mapNameArray            : mapRawData?.getMapNameArray().map(v => v.toJson()) ?? [],
            mapWidth                : mapSize.getWidth(),
            mapHeight               : mapSize.getHeight(),
            playersCountUnneutral   : this.getPlayerManager().getTotalPlayersCount(false),
            modifiedTime            : timestamp,
            campaignMapData         : null,
            tileDataArray           : serialTileMap.getTiles().map(v => v.toJson()),
            unitDataArray           : serialUnitMap.getUnits().map(v => v.toJson()),
            templateWarRuleArray    : [{
                warEventIdArray             : warEventFullData?.getEventArray()?.map(v => v.getEventId() ?? 0) ?? [],
                ruleAvailability            : null,
                ruleId                      : 0,
                warRuleCommonData           : instanceWarRule.getWarRuleCommonData()?.toJson(),
                ruleNameArray               : instanceWarRule.getRuleNameArray().map(v => v.toJson()),
                lastModifiedTimestamp       : timestamp,
                mapSimpleDialogueIdArray    : mapSimpleDialogueArray?.map(v => v.getDialogueId() ?? 0),
                taskObjectiveIdArray        : [],
            }],
            warEventFullData        : warEventFullData?.toJson(),
            taskObjectiveFullData   : instanceWarRule.getTaskObjectiveFullData()?.toJson(),
            mapExtraText            : mapRawData?.getMapExtraText()?.toJson(),
            mapTagIdFlags           : mapRawData?.getMapTagIdFlags(),
            mapSimpleDialogueArray  : mapSimpleDialogueArray.map(v => v.toJson()),
            tileCustomNameArray     : serialTileMap.getTileCustomNameArray().map(v => v.toJson()),
            unitCustomNameArray     : serialUnitMap.getUnitCustomNameArray().map(v => v.toJson()),
        });
    }

    public startRunning(): IBwWar {
        this.getCommonSettingManager().startRunning(this);
        this.getWeatherManager().startRunning(this);
        this.getWarEventManager().startRunning(this);
        this.getDrawVoteManager().startRunning(this);
        this.getTurnManager().startRunning(this);
        this.getPlayerManager().startRunning(this);
        this.getField().startRunning(this);
        this.getWarStatisticsManager().startRunning(this);
        this.getTaskObjectiveManager().startRunning(this);

        this._setIsRunning(true);

        return this;
    }
    public startRunningView(): IBwWar {
        this.getView().startRunningView();
        this.getField().startRunningView();
        this.getWeatherManager().startRunningView();

        return this;
    }
    public stopRunning(): IBwWar {
        this.getField().stopRunning();
        this.getView().stopRunning();
        this.getWeatherManager().stopRunning();

        this._setIsRunning(false);

        return this;
    }

    private _setIsRunning(isRunning: boolean): void {
        this._isRunning = isRunning;
    }
    public getIsRunning(): boolean {
        return this._isRunning;
    }
    public getIsExecutingAction(): boolean {
        return this._isExecutingAction;
    }
    public setIsExecutingAction(isExecuting: boolean): void {
        this._isExecutingAction = isExecuting;
    }

    public checkCanEnd(): boolean {
        if (this.getWarEventManager().getCallableWarEventIdAndDataIndex() != null) {
            return false;
        }

        const aliveTeamIndexSet = new Set<number>();
        let hasAliveHumanPlayer = false;
        for (const [, player] of this.getPlayerManager().getAllPlayersDict()) {
            if ((player.checkIsNeutral()) || (player.getAliveState() === AliveStateId.Dead)) {
                continue;
            }

            aliveTeamIndexSet.add(player.getTeamIndex());
            if (player.getUserId() != null) {
                hasAliveHumanPlayer = true;
            }
        }

        return ((!hasAliveHumanPlayer) && (!(this instanceof getScwWarClass())) && (!(this instanceof getSfwWarClass())))
            || (aliveTeamIndexSet.size <= 1)
            || (this.getDrawVoteManager().checkIsDraw());
    }
    public setIsEnded(ended: boolean): void {
        this._isEnded = ended;
    }
    public getIsEnded(): boolean {
        return this._isEnded;
    }

    public checkIsBoot(): boolean {
        if (this.getIsEnded()) {
            return false;
        }

        const player            = this.getPlayerInTurn();
        const restTimeToBoot    = player.getRestTimeToBoot();
        const enterTurnTime     = this.getEnterTurnTime();
        const bootTimeParams    = this.getSettingsBootTimerParams();
        return (bootTimeParams[0] !== TimerTypeId.NoBoot)
            && (player.getUserId() != null)
            && (player.getAliveState() === AliveStateId.Alive)
            && (!player.checkIsNeutral())
            && (getServerTimestamp() > enterTurnTime + restTimeToBoot);
    }

    public getIsViewingWarInfo(): boolean {
        return this._isViewingWarInfo;
    }
    public setIsViewingWarInfo(isViewing: boolean): void {
        this._isViewingWarInfo = isViewing;
    }

    public getOverridingBgmCode(): number | null {
        return this._overridingBgmCode;
    }
    public setOverridingBgmCode(code: number | null): void {
        this._overridingBgmCode = code;
    }

    public checkIsExceedTurnsOrWarOperationsLimit(): boolean {
        const commonSettingManager = this.getCommonSettingManager();
        return (this.getTurnManager().getTurnIndex() > commonSettingManager.getTurnsLimit())
            || (this.getExecutedOperationManager().getExecutedOperationsCount() > commonSettingManager.getWarOperationsLimit());
    }

    private _setWarId(warId: number | null): void {
        this._warId = warId;
    }
    public getWarId(): number | null{
        return this._warId;
    }

    private _setWarType(warType: WarTypeId): void {
        this._warType = warType;
    }
    public getWarType(): WarTypeId {
        return this._warType;
    }

    public getGcData(): GcData {
        return getExisted(this._gameConfig);
    }
    private _setGameConfig(gameConfig: GcData): void {
        this._gameConfig = gameConfig;
    }

    public getDamagePreviewSettings(): DamagePreviewSettings {
        return this._damagePreviewSettings;
    }

    public getInstanceWarRule(): InstanceWarRule {
        return this.getCommonSettingManager().getInstanceWarRule();
    }

    public getPlayersCountUnneutral(): number {
        return this.getPlayerManager().getTotalPlayersCount(false);
    }
    public getPlayer(playerIndex: number): IPlayer {
        return this.getPlayerManager().getPlayer(playerIndex);
    }
    public getPlayerInTurn(): IPlayer {
        return this.getPlayerManager().getPlayerInTurn();
    }
    public getPlayerIndexInTurn(): number {
        return this.getTurnManager().getPlayerIndexInTurn();
    }
    public checkIsHumanInTurn(): boolean {
        const userId = this.getPlayerInTurn().getUserId();
        return (userId != null) && (!checkIsDummy(userId));
    }

    public getTurnManager(): ITurnManager {
        return this._turnManager;
    }
    public getFogMap(): IFogMap {
        return this.getField().getFogMap();
    }
    public getUnitMap(): IUnitMap {
        return this.getField().getUnitMap();
    }
    public getTileMap(): ITileMap {
        return this.getField().getTileMap();
    }
    public getActionPlanner(): IActionPlanner {
        return this.getField().getActionPlanner();
    }
    public getGridVisualEffect(): IBwGridVisualEffect {
        return this.getField().getGridVisualEffect();
    }
    public getCursor(): IBwCursor {
        return this.getField().getCursor();
    }

    public getEnterTurnTime(): number {
        return this.getTurnManager().getEnterTurnTime();
    }
    public getTurnPhaseCode(): PhaseCode {
        return this.getTurnManager().getPhaseCode();
    }

    public getWeatherManager(): IManager {
        return this._weatherManager;
    }
    public getDrawVoteManager(): IBwDrawVoteManager {
        return this._drawVoteManager;
    }
    public getRandomNumberManager(): IBwRandomNumberManager {
        return this._randomNumberManager;
    }
    public getExecutedOperationManager(): IBwExecutedOperationManager {
        return this._executedActionManager;
    }
    public getTaskObjectiveManager(): ITaskObjectiveManager {
        return this._taskObjectiveManager;
    }
    public getField(): IField {
        return this._field;
    }
    public getWarStatisticsManager(): IBwWarStatisticsManager {
        return this._warStatisticsManager;
    }
    public getCommonSettingManager(): IBwCommonSettingManager {
        return this._commonSettingManager;
    }
    public getPlayerManager(): IPlayerManager {
        return this._playerManager;
    }

    /**
     * The unit is dangling after moving!
     * You must call unitMap.addUnitOnMap() or unitMap.addUnitLoaded() after calling this function.
     */
    public moveUnit({ pathNodes, launchUnitId, fuelConsumption }: {
        pathNodes       : GridIndex[];
        launchUnitId    : Undefinable<number>;
        fuelConsumption : number;
    }): void {
        const unitMap               = this.getUnitMap();
        const beginningGridIndex    = pathNodes[0];
        const focusUnit             = getExisted(unitMap.getUnit(beginningGridIndex, launchUnitId));

        if (this.getGcData().getSystemCfg().getIsPathVisionEnabled()) {
            this.getFogMap().updateMapFromPathsByUnitAndPath({
                unit            : focusUnit,
                unitVisionInfo  : focusUnit.getVisionInfo(),
                path            : pathNodes
            });
        }

        focusUnit.setCurrentFuel(focusUnit.getCurrentFuel() - fuelConsumption);
        if (launchUnitId == null) {
            unitMap.removeUnitOnMap(beginningGridIndex, false);
        } else {
            unitMap.removeUnitLoaded(launchUnitId);
        }

        if (pathNodes.length > 1) {
            const endingGridIndex = pathNodes[pathNodes.length - 1];
            focusUnit.setLoaderUnitId(null);
            focusUnit.setGridIndex(endingGridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(focusUnit, true)) {
                unit.setGridIndex(endingGridIndex);
            }

            if (launchUnitId == null) {
                this.getTileMap().getTile(beginningGridIndex).updateOnUnitLeave();
            }
        }
    }
    public async moveExtraUnit({ movingUnitAndPath, aiming, deleteViewAfterMoving }: {
        movingUnitAndPath       : Undefinable<MovingUnitAndPath>;
        aiming                  : Undefinable<GridIndex>;
        deleteViewAfterMoving   : boolean;
    }): Promise<IUnit | null> {
        if (movingUnitAndPath == null) {
            return null;
        }

        const movingUnitData = movingUnitAndPath.getUnit();
        if (movingUnitData == null) {
            return null;
        }

        const movingPath = movingUnitAndPath.getPath();
        if (movingPath == null) {
            throw newError(`Empty movingPath.`, ClientErrorCode.WarCommonHelpers_MoveExtraUnit_00);
        }

        const unitMap           = this.getUnitMap();
        const unitMapView       = unitMap.getView();
        const movingUnitView    = unitMap.getUnitById(movingUnitData.getUnitId())?.getView();
        (movingUnitView) && (unitMapView.removeUnit(movingUnitView));

        const virtualUnit = new (getUnitClass())();
        virtualUnit.init(movingUnitData, this.getGcData());
        virtualUnit.startRunning(this);
        virtualUnit.startRunningView();

        const virtualUnitView = virtualUnit.getView();
        unitMapView.addUnit(virtualUnitView, true);
        await virtualUnitView.moveAlongExtraPath({
            path                    : movingPath,
            aiming                  : aiming,
            deleteViewAfterMoving   : deleteViewAfterMoving,
        });
        if (deleteViewAfterMoving) {
            virtualUnit.stopRunning();
        }

        return virtualUnit;
    }

    public checkCanProduceUnitByOpaAndRule(playerIndex: number, unitType: number): boolean {
        const canProduce = this.getWarEventManager().checkOpaCanProduceUnit(playerIndex, unitType);
        if (canProduce === false) {
            return false;
        } else if (canProduce == null) {
            if (this.getCommonSettingManager().getPlayerRule(playerIndex).getBannedUnitTypeArray().includes(unitType)) {
                return false;
            }
        }

        return true;
    }

    public getIdleBuildingGridIndex(): Undefinable<GridIndex> {
        const playerIndex               = this.getPlayerIndexInTurn();
        const field                     = this.getField();
        const tileMap                   = field.getTileMap();
        const unitMap                   = field.getUnitMap();
        const currGridIndex             = field.getCursor().getGridIndex();
        const currX                     = currGridIndex.getX();
        const currY                     = currGridIndex.getY();
        const { width, height}          = tileMap.getMapSize().getWH();
        const checkIsIdle               = (gridIndex: GridIndex): boolean => {
            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit)                                                                                      &&
                ((unit.getActionState() !== ActionStateId.Idle) || (unit.getPlayerIndex() !== playerIndex))
            ) {
                return false;
            }
            return tileMap.getTile(gridIndex).checkIsUnitProducerForPlayer(playerIndex);
        };

        for (let y = currY; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y > currY) || (x > currX)) {
                    const gridIndex = new GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        for (let y = 0; y <= currY; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y < currY) || (x <= currX)) {
                    const gridIndex = new GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        return null;
    }
    public getIdleUnitGridIndex(): Undefinable<GridIndex> {
        const playerIndex               = this.getPlayerIndexInTurn();
        const field                     = this.getField();
        const unitMap                   = field.getUnitMap();
        const { x: currX, y: currY }    = field.getCursor().getGridIndex().getXY();
        const { width, height}          = unitMap.getMapSize().getWH();
        const checkIsIdle               = (gridIndex: GridIndex): boolean => {
            const unit = unitMap.getUnitOnMap(gridIndex);
            return (unit?.getPlayerIndex() === playerIndex) && (unit.getActionState() === ActionStateId.Idle);
        };

        for (let y = currY; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y > currY) || (x > currX)) {
                    const gridIndex = new GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        for (let y = 0; y <= currY; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y < currY) || (x <= currX)) {
                    const gridIndex = new GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        return null;
    }

    public getHintForEndTurn(): string {
        const playerIndex   = this.getPlayerIndexInTurn();
        const unitMap       = this.getUnitMap();
        const hints         = new Array<string>();
        {
            let idleUnitsCount = 0;
            for (const unit of unitMap.getAllUnitsOnMap()) {
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getActionState() === ActionStateId.Idle)) {
                    ++idleUnitsCount;
                }
            }
            (idleUnitsCount) && (hints.push(getFormattedText(TextType.F0006, idleUnitsCount)));
        }

        {
            const player            = this.getPlayer(playerIndex);
            const idleBuildingsDict = new Map<number, GridIndex[]>();
            const gameConfig        = this.getGcData();
            const currentFund       = player.getFund();
            for (const tile of this.getTileMap().getAllTiles()) {
                const gridIndex = tile.getGridIndex();
                if (unitMap.getUnitOnMap(gridIndex)) {
                    continue;
                }

                const unitTypeArray = tile.getProducibleUnitTypeArrayForPlayer(playerIndex);
                if (!unitTypeArray?.length) {
                    continue;
                }

                const effectiveCoSkill  = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
                const minNormalizedHp   = effectiveCoSkill ? getNormalizedHp(effectiveCoSkill.getHpUpperLimit() ?? 0) : getNormalizedHp(Hp.MaxHp);
                for (const unitType of unitTypeArray) {
                    const costModifier  = player.getUnitCostModifier(unitType);
                    const cfgCost       = getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost());
                    const minCost       = effectiveCoSkill
                        ? Math.floor(cfgCost * costModifier * minNormalizedHp * (effectiveCoSkill.getCostMultiplierPct() ?? 0) / Hp.Normalizer / 100)
                        : Math.floor(cfgCost * costModifier);
                    if (minCost <= currentFund) {
                        const tileType = tile.getTileTypeId();
                        if (!idleBuildingsDict.has(tileType)) {
                            idleBuildingsDict.set(tileType, [gridIndex]);
                        } else {
                            getExisted(idleBuildingsDict.get(tileType)).push(gridIndex);
                        }
                        break;
                    }
                }
            }

            const textArrayForBuildings: string[] = [];
            for (const [tileType, gridIndexArray] of idleBuildingsDict) {
                textArrayForBuildings.push(getFormattedText(
                    TextType.F0007, gridIndexArray.length,
                    getTileName(tileType, gameConfig),
                    gridIndexArray.map(v => `(${v.getX()}, ${v.getY()})`).join(`, `)),
                );
            }
            (textArrayForBuildings.length) && (hints.push(textArrayForBuildings.join(`\n`)));
        }

        hints.push(getText(TextType.A0024));
        return hints.join(`\n\n`);
    }
}
