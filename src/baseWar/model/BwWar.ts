import {
    BaseWar_Model_BwCommonSettingManager,
    BaseWar_Model_BwDrawVoteManager,
    BaseWar_Model_BwExecutedOperationManager,
    BaseWar_Model_BwRandomNumberManager,
    BaseWar_Model_BwWarStatisticsManager,
    BaseWar_View_BwWarView,
    Fields_Field,
    AuxiliaryTypes_GridIndex,
    Weathers_Manager,
    AuxiliaryTypes_MapSize,
    Players_PlayerManager,
    SingleCustomWar_Model_ScwWar,
    SingleFreeWar_Model_SfwWar,
    TaskObjectives_TaskObjectiveManager,
    BootTimers_Constants,
    Turns_TurnManager,
    Units_Unit,
    type GameConfigs_GameConfig,
    type ActionPlanners_IActionPlanner,
    type BaseWar_Interface_IBwCommonSettingManager,
    type BaseWar_Interface_IBwCursor,
    type BaseWar_Interface_IBwDrawVoteManager,
    type BaseWar_Interface_IBwExecutedOperationManager,
    type BaseWar_Interface_IBwGridVisualEffect,
    type BaseWar_Interface_IBwRandomNumberManager,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Interface_IBwWarEventManager,
    type BaseWar_Interface_IBwWarStatisticsManager,
    type BaseWar_Interface_IBwWarView,
    type Fields_IField,
    type FogMaps_IFogMap,
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Constants,
    Players_Constants,
    Users_Utils,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Lang_Utils,
    Units_Utils_Common,
    Players_Utils_Common,
    NormalMap_Model_NormalMapModel,
    Users_Model,
    Timer_TimerModel,
    Sounds_SoundPlayer,
    Lang_Constants,
    WarTypes_Constants,
    type Weathers_IManager,
    type Players_IPlayer,
    type Players_IPlayerManager,
    type TaskObjectives_ITaskObjectiveManager,
    type Tiles_ITileMap,
    type Turns_ITurnManager,
    type Units_IUnit,
    type Units_IUnitMap,
    type Turns_Constants,
} from "../../internal.ts";

import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { MovingUnitAndPath } from "../../proto/schema/CommonProto/Structure/MovingUnitAndPath.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

type DamagePreviewSettings = {
    isEnabled   : boolean;
    settings    : {
        playerIndex             : number;
        isForcedInCoZone        : boolean;
        extraCommandTowerCount  : number;
    }[];
};

export abstract class BwWar implements BaseWar_Interface_IBwWar.IBwWar {
    private readonly _weatherManager        = new Weathers_Manager.Manager();
    private readonly _turnManager           = new Turns_TurnManager.TurnManager();
    private readonly _executedActionManager = new BaseWar_Model_BwExecutedOperationManager.BwExecutedOperationManager();
    private readonly _randomNumberManager   = new BaseWar_Model_BwRandomNumberManager.BwRandomNumberManager();
    private readonly _drawVoteManager       = new BaseWar_Model_BwDrawVoteManager.BwDrawVoteManager();
    private readonly _taskObjectiveManager  = new TaskObjectives_TaskObjectiveManager.TaskObjectiveManager();
    private readonly _field                 = new Fields_Field.Field();
    private readonly _warStatisticsManager  = new BaseWar_Model_BwWarStatisticsManager.BwWarStatisticsManager();
    private readonly _commonSettingManager  = new BaseWar_Model_BwCommonSettingManager.BwCommonSettingManager();
    private readonly _playerManager         = new Players_PlayerManager.PlayerManager();
    private readonly _view                  = new BaseWar_View_BwWarView.BwWarView();

    private _gameConfig             : GameConfigs_GameConfig.GameConfig | null = null;
    private _warId                  : number | null = null;
    private _warType                = WarTypes_Constants.WarTypeId.Undefined;
    private _isRunning              = false;
    private _isExecutingAction      = false;
    private _isEnded                = false;
    private _isViewingWarInfo       = false;
    private _overridingBgmCode      : number | null = null;

    private _damagePreviewSettings  : DamagePreviewSettings = {
        isEnabled   : false,
        settings    : [],
    };

    public abstract init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void;
    public abstract getNormalMapId(): number | null;
    public abstract getIsNeedExecutedOperations(): boolean;
    public abstract getIsNeedSeedRandom(): boolean;
    public abstract getCanCheat(): boolean;
    public abstract getShouldSerializeFullInfoForFreeModeGames(): boolean;
    public abstract getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager;
    public abstract getBootRestTime(playerIndex: number): number | null;
    public abstract getSettingsBootTimerParams(): number[];
    public abstract getIsExecuteActionsWithExtraData(): boolean;
    public abstract updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    protected _baseInit(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig, warType: WarTypes_Constants.WarTypeId): void {
        const settingsForCommon = Helpers_Misc.getExisted(data.getSettingsForCommon(), Utils_ClientErrorCode.ClientErrorCode.BwWar_BaseInit_00);
        const configVersion     = Helpers_Misc.getExisted(settingsForCommon.getConfigVersion(), Utils_ClientErrorCode.ClientErrorCode.BwWar_BaseInit_01);
        if (configVersion !== gameConfig.getVersion()) {
            throw Helpers_Misc.newError(`Invalid configVersion: ${configVersion}`, Utils_ClientErrorCode.ClientErrorCode.BwWar_BaseInit_02);
        }

        this._setGameConfig(gameConfig);
        this.getWeatherManager().init(data.getWeatherManager());
        this.getDrawVoteManager().init(data.getPlayerManager(), data.getRemainingVotesForDraw(), data.getDrawVoteManager());

        const mapSize = AuxiliaryTypes_MapSize.MapSize.createWithSerialTileMap(data.getField()?.getTileMap());
        if (!mapSize.checkIsValid()) {
            throw Helpers_Misc.newError(`Invalid mapSize: ${JSON.stringify(mapSize)}`, Utils_ClientErrorCode.ClientErrorCode.BwWar_BaseInit_03);
        }

        if (warType === WarTypes_Constants.WarTypeId.Undefined) {
            throw Helpers_Misc.newError(`Invalid warType: ${warType}`, Utils_ClientErrorCode.ClientErrorCode.BwWar_BaseInit_04);
        }

        this._setWarType(warType);
        this.getCommonSettingManager().init({
            settings                : settingsForCommon,
            warType                 : warType,
            mapSize                 : mapSize,
            playersCountUnneutral   : Players_Utils_Common.getPlayersCountUnneutral(data.getPlayerManager()),
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
        const turnManagerData       = Helpers_Misc.getExisted(data.getTurnManager(), Utils_ClientErrorCode.ClientErrorCode.BwWar_BaseInit_05);
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
        playerManager.fastInit(Helpers_Misc.getExisted(warData.getPlayerManager()), gameConfig);
        this.getTurnManager().fastInit(Helpers_Misc.getExisted(warData.getTurnManager()), playersCountUnneutral);
        this.getWarEventManager().fastInit(Helpers_Misc.getExisted(warData.getWarEventManager()));
        this.getField().fastInit({
            data                    : Helpers_Misc.getExisted(warData.getField()),
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

        Sounds_SoundPlayer.playCoBgmWithWar({
            war                             : this,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : Users_Model.getSelfSettingsCoBgmCodeArray(this.getPlayerInTurn().getCoCategoryId()),
        });
    }

    protected _initView(): void {
        this.getView().init(this);
    }
    protected _fastInitView(): void {
        this.getView().fastInit(this);
    }
    public getView(): BaseWar_Interface_IBwWarView.IBwWarView {
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
        const mapRawData                = normalMapId == null ? null : await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        const tileMap                   = this.getTileMap();
        const mapSize                   = tileMap.getMapSize();
        const serialTileMap             = tileMap.serialize();
        const serialUnitMap             = this.getUnitMap().serialize();
        const instanceWarRule           = this.getInstanceWarRule();
        const warEventFullData          = instanceWarRule.getWarEventFullData();
        const mapSimpleDialogueArray    = instanceWarRule.getMapSimpleDialogueArray();
        const timestamp                 = Timer_TimerModel.getServerTimestamp();

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
                warEventIdArray             : warEventFullData?.getEventArray()?.map(v => v.getEventId()) ?? [],
                ruleAvailability            : null,
                ruleId                      : 0,
                warRuleCommonData           : instanceWarRule.getWarRuleCommonData()?.toJson(),
                ruleNameArray               : instanceWarRule.getRuleNameArray().map(v => v.toJson()),
                lastModifiedTimestamp       : timestamp,
                mapSimpleDialogueIdArray    : mapSimpleDialogueArray?.map(v => v.getDialogueId()),
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

    public startRunning(): BaseWar_Interface_IBwWar.IBwWar {
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
    public startRunningView(): BaseWar_Interface_IBwWar.IBwWar {
        this.getView().startRunningView();
        this.getField().startRunningView();
        this.getWeatherManager().startRunningView();

        return this;
    }
    public stopRunning(): BaseWar_Interface_IBwWar.IBwWar {
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
            if ((player.checkIsNeutral()) || (player.getAliveState() === Players_Constants.AliveStateId.Dead)) {
                continue;
            }

            aliveTeamIndexSet.add(player.getTeamIndex());
            if (player.getUserId() != null) {
                hasAliveHumanPlayer = true;
            }
        }

        return ((!hasAliveHumanPlayer) && (!(this instanceof SingleCustomWar_Model_ScwWar.ScwWar)) && (!(this instanceof SingleFreeWar_Model_SfwWar.SfwWar)))
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
        return (bootTimeParams[0] !== BootTimers_Constants.TimerTypeId.NoBoot)
            && (player.getUserId() != null)
            && (player.getAliveState() === Players_Constants.AliveStateId.Alive)
            && (!player.checkIsNeutral())
            && (Timer_TimerModel.getServerTimestamp() > enterTurnTime + restTimeToBoot);
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

    private _setWarType(warType: WarTypes_Constants.WarTypeId): void {
        this._warType = warType;
    }
    public getWarType(): WarTypes_Constants.WarTypeId {
        return this._warType;
    }

    public getGcData(): GameConfigs_GameConfig.GameConfig {
        return Helpers_Misc.getExisted(this._gameConfig);
    }
    private _setGameConfig(gameConfig: GameConfigs_GameConfig.GameConfig): void {
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
    public getPlayer(playerIndex: number): Players_IPlayer.IPlayer {
        return this.getPlayerManager().getPlayer(playerIndex);
    }
    public getPlayerInTurn(): Players_IPlayer.IPlayer {
        return this.getPlayerManager().getPlayerInTurn();
    }
    public getPlayerIndexInTurn(): number {
        return this.getTurnManager().getPlayerIndexInTurn();
    }
    public checkIsHumanInTurn(): boolean {
        const userId = this.getPlayerInTurn().getUserId();
        return (userId != null) && (!Users_Utils.checkIsDummy(userId));
    }

    public getTurnManager(): Turns_ITurnManager.ITurnManager {
        return this._turnManager;
    }
    public getFogMap(): FogMaps_IFogMap.IFogMap {
        return this.getField().getFogMap();
    }
    public getUnitMap(): Units_IUnitMap.IUnitMap {
        return this.getField().getUnitMap();
    }
    public getTileMap(): Tiles_ITileMap.ITileMap {
        return this.getField().getTileMap();
    }
    public getActionPlanner(): ActionPlanners_IActionPlanner.IActionPlanner {
        return this.getField().getActionPlanner();
    }
    public getGridVisualEffect(): BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect {
        return this.getField().getGridVisualEffect();
    }
    public getCursor(): BaseWar_Interface_IBwCursor.IBwCursor {
        return this.getField().getCursor();
    }

    public getEnterTurnTime(): number {
        return this.getTurnManager().getEnterTurnTime();
    }
    public getTurnPhaseCode(): Turns_Constants.PhaseCode {
        return this.getTurnManager().getPhaseCode();
    }

    public getWeatherManager(): Weathers_IManager.IManager {
        return this._weatherManager;
    }
    public getDrawVoteManager(): BaseWar_Interface_IBwDrawVoteManager.IBwDrawVoteManager {
        return this._drawVoteManager;
    }
    public getRandomNumberManager(): BaseWar_Interface_IBwRandomNumberManager.IBwRandomNumberManager {
        return this._randomNumberManager;
    }
    public getExecutedOperationManager(): BaseWar_Interface_IBwExecutedOperationManager.IBwExecutedOperationManager {
        return this._executedActionManager;
    }
    public getTaskObjectiveManager(): TaskObjectives_ITaskObjectiveManager.ITaskObjectiveManager {
        return this._taskObjectiveManager;
    }
    public getField(): Fields_IField.IField {
        return this._field;
    }
    public getWarStatisticsManager(): BaseWar_Interface_IBwWarStatisticsManager.IBwWarStatisticsManager {
        return this._warStatisticsManager;
    }
    public getCommonSettingManager(): BaseWar_Interface_IBwCommonSettingManager.IBwCommonSettingManager {
        return this._commonSettingManager;
    }
    public getPlayerManager(): Players_IPlayerManager.IPlayerManager {
        return this._playerManager;
    }

    /**
     * The unit is dangling after moving!
     * You must call unitMap.addUnitOnMap() or unitMap.addUnitLoaded() after calling this function.
     */
    public moveUnit({ pathNodes, launchUnitId, fuelConsumption }: {
        pathNodes       : AuxiliaryTypes_GridIndex.GridIndex[];
        launchUnitId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
        fuelConsumption : number;
    }): void {
        const unitMap               = this.getUnitMap();
        const beginningGridIndex    = pathNodes[0];
        const focusUnit             = Helpers_Misc.getExisted(unitMap.getUnit(beginningGridIndex, launchUnitId));

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
        movingUnitAndPath       : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MovingUnitAndPath>;
        aiming                  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex>;
        deleteViewAfterMoving   : boolean;
    }): Promise<Units_IUnit.IUnit | null> {
        if (movingUnitAndPath == null) {
            return null;
        }

        const movingUnitData = movingUnitAndPath.getUnit();
        if (movingUnitData == null) {
            return null;
        }

        const movingPath = movingUnitAndPath.getPath();
        if (movingPath == null) {
            throw Helpers_Misc.newError(`Empty movingPath.`, Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_MoveExtraUnit_00);
        }

        const unitMap           = this.getUnitMap();
        const unitMapView       = unitMap.getView();
        const movingUnitView    = unitMap.getUnitById(movingUnitData.getUnitId())?.getView();
        (movingUnitView) && (unitMapView.removeUnit(movingUnitView));

        const virtualUnit = new Units_Unit.Unit();
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

    public getIdleBuildingGridIndex(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex> {
        const playerIndex               = this.getPlayerIndexInTurn();
        const field                     = this.getField();
        const tileMap                   = field.getTileMap();
        const unitMap                   = field.getUnitMap();
        const currGridIndex             = field.getCursor().getGridIndex();
        const currX                     = currGridIndex.getX();
        const currY                     = currGridIndex.getY();
        const { width, height}          = tileMap.getMapSize().getWH();
        const checkIsIdle               = (gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean => {
            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit)                                                                                      &&
                ((unit.getActionState() !== Units_Constants.ActionStateId.Idle) || (unit.getPlayerIndex() !== playerIndex))
            ) {
                return false;
            }
            return tileMap.getTile(gridIndex).checkIsUnitProducerForPlayer(playerIndex);
        };

        for (let y = currY; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y > currY) || (x > currX)) {
                    const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        for (let y = 0; y <= currY; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y < currY) || (x <= currX)) {
                    const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        return null;
    }
    public getIdleUnitGridIndex(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex> {
        const playerIndex               = this.getPlayerIndexInTurn();
        const field                     = this.getField();
        const unitMap                   = field.getUnitMap();
        const { x: currX, y: currY }    = field.getCursor().getGridIndex().getXY();
        const { width, height}          = unitMap.getMapSize().getWH();
        const checkIsIdle               = (gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean => {
            const unit = unitMap.getUnitOnMap(gridIndex);
            return (unit?.getPlayerIndex() === playerIndex) && (unit.getActionState() === Units_Constants.ActionStateId.Idle);
        };

        for (let y = currY; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y > currY) || (x > currX)) {
                    const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        for (let y = 0; y <= currY; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y < currY) || (x <= currX)) {
                    const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
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
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getActionState() === Units_Constants.ActionStateId.Idle)) {
                    ++idleUnitsCount;
                }
            }
            (idleUnitsCount) && (hints.push(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0006, idleUnitsCount)));
        }

        {
            const player            = this.getPlayer(playerIndex);
            const idleBuildingsDict = new Map<number, AuxiliaryTypes_GridIndex.GridIndex[]>();
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
                const minNormalizedHp   = effectiveCoSkill ? Units_Utils_Common.getNormalizedHp(effectiveCoSkill.getHpUpperLimit()) : Units_Utils_Common.getNormalizedHp(Units_Constants.Hp.MaxHp);
                for (const unitType of unitTypeArray) {
                    const costModifier  = player.getUnitCostModifier(unitType);
                    const cfgCost       = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost());
                    const minCost       = effectiveCoSkill
                        ? Math.floor(cfgCost * costModifier * minNormalizedHp * (effectiveCoSkill.getCostMultiplierPct()) / Units_Constants.Hp.Normalizer / 100)
                        : Math.floor(cfgCost * costModifier);
                    if (minCost <= currentFund) {
                        const tileType = tile.getTileTypeId();
                        if (!idleBuildingsDict.has(tileType)) {
                            idleBuildingsDict.set(tileType, [gridIndex]);
                        } else {
                            Helpers_Misc.getExisted(idleBuildingsDict.get(tileType)).push(gridIndex);
                        }
                        break;
                    }
                }
            }

            const textArrayForBuildings: string[] = [];
            for (const [tileType, gridIndexArray] of idleBuildingsDict) {
                textArrayForBuildings.push(Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0007, gridIndexArray.length,
                    Lang_Utils.getTileName(tileType, gameConfig),
                    gridIndexArray.map(v => `(${v.getX()}, ${v.getY()})`).join(`, `)),
                );
            }
            (textArrayForBuildings.length) && (hints.push(textArrayForBuildings.join(`\n`)));
        }

        hints.push(Lang_Utils.getText(Lang_Constants.TextType.A0024));
        return hints.join(`\n\n`);
    }
}
