import type * as ActionPlannersIActionPlanner from "../../actionPlanners/IActionPlanner.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwCommonSettingManager from "../interface/IBwCommonSettingManager.ts";
import type * as BaseWarInterfaceIBwCursor from "../interface/IBwCursor.ts";
import type * as BaseWarInterfaceIBwDrawVoteManager from "../interface/IBwDrawVoteManager.ts";
import type * as BaseWarInterfaceIBwExecutedOperationManager from "../interface/IBwExecutedOperationManager.ts";
import type * as BaseWarInterfaceIBwGridVisualEffect from "../interface/IBwGridVisualEffect.ts";
import type * as BaseWarInterfaceIBwRandomNumberManager from "../interface/IBwRandomNumberManager.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "../interface/IBwWarEventManager.ts";
import type * as BaseWarInterfaceIBwWarStatisticsManager from "../interface/IBwWarStatisticsManager.ts";
import type * as BaseWarInterfaceIBwWarView from "../interface/IBwWarView.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as FieldsIField from "../../fields/IField.ts";
import type * as FogMapsIFogMap from "../../fogMaps/IFogMap.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import type * as PlayersIPlayerManager from "../../players/IPlayerManager.ts";
import * as PlayersUtilsCommon from "../../players/utils/Common.ts";
import * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoStructureMovingUnitAndPath from "../../proto/schema/CommonProto/Structure/MovingUnitAndPath.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import type * as TaskObjectivesITaskObjectiveManager from "../../taskObjectives/ITaskObjectiveManager.ts";
import type * as TilesITileMap from "../../tiles/ITileMap.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as TurnsConstants from "../../turns/Constants.ts";
import type * as TurnsITurnManager from "../../turns/ITurnManager.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import type * as UnitsIUnitMap from "../../units/IUnitMap.ts";
import * as UnitsUtilsCommon from "../../units/utils/Common.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UsersUtils from "../../users/Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";
import type * as WeathersIManager from "../../weathers/IManager.ts";

type GcData                 = GameConfigGcData.GcData;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type IPlayerManager         = PlayersIPlayerManager.IPlayerManager;
type IPlayer                = PlayersIPlayer.IPlayer;
type ITileMap               = TilesITileMap.ITileMap;

type DamagePreviewSettings = {
    isEnabled   : boolean;
    settings    : {
        playerIndex             : number;
        isForcedInCoZone        : boolean;
        extraCommandTowerCount  : number;
    }[];
};

export abstract class BwWar implements BaseWarInterfaceIBwWar.IBwWar {
    private readonly _weatherManager        = new (GameHelpersGhFactory.getBwWeatherManagerClass())();
    private readonly _turnManager           = new (GameHelpersGhFactory.getTurnManagerClass())();
    private readonly _executedActionManager = new (GameHelpersGhFactory.getBwExecutedOperationManagerClass())();
    private readonly _randomNumberManager   = new (GameHelpersGhFactory.getBwRandomNumberManagerClass())();
    private readonly _drawVoteManager       = new (GameHelpersGhFactory.getBwDrawVoteManagerClass())();
    private readonly _taskObjectiveManager  = new (GameHelpersGhFactory.getTaskObjectiveManagerClass())();
    private readonly _field                 = new (GameHelpersGhFactory.getFieldClass())();
    private readonly _warStatisticsManager  = new (GameHelpersGhFactory.getBwWarStatisticsManagerClass())();
    private readonly _commonSettingManager  = new (GameHelpersGhFactory.getBwCommonSettingManagerClass())();
    private readonly _playerManager         = new (GameHelpersGhFactory.getPlayerManagerClass())();
    private readonly _view                  = new (GameHelpersGhFactory.getBwWarViewClass())();

    private _gameConfig             : GcData | null = null;
    private _warId                  : number | null = null;
    private _warType                = WarTypesConstants.WarTypeId.Undefined;
    private _isRunning              = false;
    private _isExecutingAction      = false;
    private _isEnded                = false;
    private _isViewingWarInfo       = false;
    private _overridingBgmCode      : number | null = null;

    private _damagePreviewSettings  : DamagePreviewSettings = {
        isEnabled   : false,
        settings    : [],
    };

    public abstract init(data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData): void;
    public abstract getNormalMapId(): number | null;
    public abstract getIsNeedExecutedOperations(): boolean;
    public abstract getIsNeedSeedRandom(): boolean;
    public abstract getCanCheat(): boolean;
    public abstract getShouldSerializeFullInfoForFreeModeGames(): boolean;
    public abstract getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager;
    public abstract getBootRestTime(playerIndex: number): number | null;
    public abstract getSettingsBootTimerParams(): number[];
    public abstract getIsExecuteActionsWithExtraData(): boolean;
    public abstract updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    protected _baseInit(data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData, warType: WarTypesConstants.WarTypeId): void {
        const settingsForCommon = HelpersMisc.getExisted(data.getSettingsForCommon(), UtilsClientErrorCode.ClientErrorCode.BwWar_BaseInit_00);
        const configVersion     = HelpersMisc.getExisted(settingsForCommon.getConfigVersion(), UtilsClientErrorCode.ClientErrorCode.BwWar_BaseInit_01);
        if (configVersion !== gameConfig.getVersion()) {
            throw HelpersMisc.newError(`Invalid configVersion: ${configVersion}`, UtilsClientErrorCode.ClientErrorCode.BwWar_BaseInit_02);
        }

        this._setGameConfig(gameConfig);
        this.getWeatherManager().init(data.getWeatherManager());
        this.getDrawVoteManager().init(data.getPlayerManager(), data.getRemainingVotesForDraw(), data.getDrawVoteManager());

        const mapSize = AuxiliaryTypesMapSize.MapSize.createWithSerialTileMap(data.getField()?.getTileMap());
        if (!mapSize.checkIsValid()) {
            throw HelpersMisc.newError(`Invalid mapSize: ${JSON.stringify(mapSize)}`, UtilsClientErrorCode.ClientErrorCode.BwWar_BaseInit_03);
        }

        if (warType === WarTypesConstants.WarTypeId.Undefined) {
            throw HelpersMisc.newError(`Invalid warType: ${warType}`, UtilsClientErrorCode.ClientErrorCode.BwWar_BaseInit_04);
        }

        this._setWarType(warType);
        this.getCommonSettingManager().init({
            settings                : settingsForCommon,
            warType                 : warType,
            mapSize                 : mapSize,
            playersCountUnneutral   : PlayersUtilsCommon.getPlayersCountUnneutral(data.getPlayerManager()),
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
        const turnManagerData       = HelpersMisc.getExisted(data.getTurnManager(), UtilsClientErrorCode.ClientErrorCode.BwWar_BaseInit_05);
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

    public fastLoadState(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar): void {
        this.stopRunning();

        const gameConfig            = this.getGcData();
        const playerManager         = this.getPlayerManager();
        const playersCountUnneutral = playerManager.getTotalPlayersCount(false);
        this.getWeatherManager().fastInit(warData.getWeatherManager());
        playerManager.fastInit(HelpersMisc.getExisted(warData.getPlayerManager()), gameConfig);
        this.getTurnManager().fastInit(HelpersMisc.getExisted(warData.getTurnManager()), playersCountUnneutral);
        this.getWarEventManager().fastInit(HelpersMisc.getExisted(warData.getWarEventManager()));
        this.getField().fastInit({
            data                    : HelpersMisc.getExisted(warData.getField()),
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

        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : this,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(this.getPlayerInTurn().getCoCategoryId()),
        });
    }

    protected _initView(): void {
        this.getView().init(this);
    }
    protected _fastInitView(): void {
        this.getView().fastInit(this);
    }
    public getView(): BaseWarInterfaceIBwWarView.IBwWarView {
        return this._view;
    }

    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar {
        return ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
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
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar {
        return ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
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
    public async serializeForMap(): Promise<ProtoSchemaCommonProtoMapMapRawData.MapRawData> {
        const normalMapId               = this.getNormalMapId();
        const mapRawData                = normalMapId == null ? null : await NormalMapModelNormalMapModel.getRawData(normalMapId);
        const tileMap                   = this.getTileMap();
        const mapSize                   = tileMap.getMapSize();
        const serialTileMap             = tileMap.serialize();
        const serialUnitMap             = this.getUnitMap().serialize();
        const instanceWarRule           = this.getInstanceWarRule();
        const warEventFullData          = instanceWarRule.getWarEventFullData();
        const mapSimpleDialogueArray    = instanceWarRule.getMapSimpleDialogueArray();
        const timestamp                 = TimerTimerModel.getServerTimestamp();

        return ProtoSchemaCommonProtoMapMapRawData.MapRawData.fromJson({
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

    public startRunning(): BaseWarInterfaceIBwWar.IBwWar {
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
    public startRunningView(): BaseWarInterfaceIBwWar.IBwWar {
        this.getView().startRunningView();
        this.getField().startRunningView();
        this.getWeatherManager().startRunningView();

        return this;
    }
    public stopRunning(): BaseWarInterfaceIBwWar.IBwWar {
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
            if ((player.checkIsNeutral()) || (player.getAliveState() === PlayersConstants.AliveStateId.Dead)) {
                continue;
            }

            aliveTeamIndexSet.add(player.getTeamIndex());
            if (player.getUserId() != null) {
                hasAliveHumanPlayer = true;
            }
        }

        return ((!hasAliveHumanPlayer) && (!(this instanceof GameHelpersGhFactory.getScwWarClass())) && (!(this instanceof GameHelpersGhFactory.getSfwWarClass())))
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
        return (bootTimeParams[0] !== BootTimersConstants.TimerTypeId.NoBoot)
            && (player.getUserId() != null)
            && (player.getAliveState() === PlayersConstants.AliveStateId.Alive)
            && (!player.checkIsNeutral())
            && (TimerTimerModel.getServerTimestamp() > enterTurnTime + restTimeToBoot);
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

    private _setWarType(warType: WarTypesConstants.WarTypeId): void {
        this._warType = warType;
    }
    public getWarType(): WarTypesConstants.WarTypeId {
        return this._warType;
    }

    public getGcData(): GcData {
        return HelpersMisc.getExisted(this._gameConfig);
    }
    private _setGameConfig(gameConfig: GcData): void {
        this._gameConfig = gameConfig;
    }

    public getDamagePreviewSettings(): DamagePreviewSettings {
        return this._damagePreviewSettings;
    }

    public getInstanceWarRule(): ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule {
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
        return (userId != null) && (!UsersUtils.checkIsDummy(userId));
    }

    public getTurnManager(): TurnsITurnManager.ITurnManager {
        return this._turnManager;
    }
    public getFogMap(): FogMapsIFogMap.IFogMap {
        return this.getField().getFogMap();
    }
    public getUnitMap(): UnitsIUnitMap.IUnitMap {
        return this.getField().getUnitMap();
    }
    public getTileMap(): ITileMap {
        return this.getField().getTileMap();
    }
    public getActionPlanner(): ActionPlannersIActionPlanner.IActionPlanner {
        return this.getField().getActionPlanner();
    }
    public getGridVisualEffect(): BaseWarInterfaceIBwGridVisualEffect.IBwGridVisualEffect {
        return this.getField().getGridVisualEffect();
    }
    public getCursor(): BaseWarInterfaceIBwCursor.IBwCursor {
        return this.getField().getCursor();
    }

    public getEnterTurnTime(): number {
        return this.getTurnManager().getEnterTurnTime();
    }
    public getTurnPhaseCode(): TurnsConstants.PhaseCode {
        return this.getTurnManager().getPhaseCode();
    }

    public getWeatherManager(): WeathersIManager.IManager {
        return this._weatherManager;
    }
    public getDrawVoteManager(): BaseWarInterfaceIBwDrawVoteManager.IBwDrawVoteManager {
        return this._drawVoteManager;
    }
    public getRandomNumberManager(): BaseWarInterfaceIBwRandomNumberManager.IBwRandomNumberManager {
        return this._randomNumberManager;
    }
    public getExecutedOperationManager(): BaseWarInterfaceIBwExecutedOperationManager.IBwExecutedOperationManager {
        return this._executedActionManager;
    }
    public getTaskObjectiveManager(): TaskObjectivesITaskObjectiveManager.ITaskObjectiveManager {
        return this._taskObjectiveManager;
    }
    public getField(): FieldsIField.IField {
        return this._field;
    }
    public getWarStatisticsManager(): BaseWarInterfaceIBwWarStatisticsManager.IBwWarStatisticsManager {
        return this._warStatisticsManager;
    }
    public getCommonSettingManager(): BaseWarInterfaceIBwCommonSettingManager.IBwCommonSettingManager {
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
        pathNodes       : AuxiliaryTypesGridIndex.GridIndex[];
        launchUnitId    : Undefinable<number>;
        fuelConsumption : number;
    }): void {
        const unitMap               = this.getUnitMap();
        const beginningGridIndex    = pathNodes[0];
        const focusUnit             = HelpersMisc.getExisted(unitMap.getUnit(beginningGridIndex, launchUnitId));

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
        movingUnitAndPath       : Undefinable<ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath>;
        aiming                  : Undefinable<AuxiliaryTypesGridIndex.GridIndex>;
        deleteViewAfterMoving   : boolean;
    }): Promise<UnitsIUnit.IUnit | null> {
        if (movingUnitAndPath == null) {
            return null;
        }

        const movingUnitData = movingUnitAndPath.getUnit();
        if (movingUnitData == null) {
            return null;
        }

        const movingPath = movingUnitAndPath.getPath();
        if (movingPath == null) {
            throw HelpersMisc.newError(`Empty movingPath.`, UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_MoveExtraUnit_00);
        }

        const unitMap           = this.getUnitMap();
        const unitMapView       = unitMap.getView();
        const movingUnitView    = unitMap.getUnitById(movingUnitData.getUnitId())?.getView();
        (movingUnitView) && (unitMapView.removeUnit(movingUnitView));

        const virtualUnit = new (GameHelpersGhFactory.getUnitClass())();
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

    public getIdleBuildingGridIndex(): Undefinable<AuxiliaryTypesGridIndex.GridIndex> {
        const playerIndex               = this.getPlayerIndexInTurn();
        const field                     = this.getField();
        const tileMap                   = field.getTileMap();
        const unitMap                   = field.getUnitMap();
        const currGridIndex             = field.getCursor().getGridIndex();
        const currX                     = currGridIndex.getX();
        const currY                     = currGridIndex.getY();
        const { width, height}          = tileMap.getMapSize().getWH();
        const checkIsIdle               = (gridIndex: AuxiliaryTypesGridIndex.GridIndex): boolean => {
            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit)                                                                                      &&
                ((unit.getActionState() !== UnitsConstants.ActionStateId.Idle) || (unit.getPlayerIndex() !== playerIndex))
            ) {
                return false;
            }
            return tileMap.getTile(gridIndex).checkIsUnitProducerForPlayer(playerIndex);
        };

        for (let y = currY; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y > currY) || (x > currX)) {
                    const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        for (let y = 0; y <= currY; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y < currY) || (x <= currX)) {
                    const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        return null;
    }
    public getIdleUnitGridIndex(): Undefinable<AuxiliaryTypesGridIndex.GridIndex> {
        const playerIndex               = this.getPlayerIndexInTurn();
        const field                     = this.getField();
        const unitMap                   = field.getUnitMap();
        const { x: currX, y: currY }    = field.getCursor().getGridIndex().getXY();
        const { width, height}          = unitMap.getMapSize().getWH();
        const checkIsIdle               = (gridIndex: AuxiliaryTypesGridIndex.GridIndex): boolean => {
            const unit = unitMap.getUnitOnMap(gridIndex);
            return (unit?.getPlayerIndex() === playerIndex) && (unit.getActionState() === UnitsConstants.ActionStateId.Idle);
        };

        for (let y = currY; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y > currY) || (x > currX)) {
                    const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(x, y);
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        for (let y = 0; y <= currY; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y < currY) || (x <= currX)) {
                    const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(x, y);
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
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getActionState() === UnitsConstants.ActionStateId.Idle)) {
                    ++idleUnitsCount;
                }
            }
            (idleUnitsCount) && (hints.push(LangUtils.getFormattedText(LangConstants.TextType.F0006, idleUnitsCount)));
        }

        {
            const player            = this.getPlayer(playerIndex);
            const idleBuildingsDict = new Map<number, AuxiliaryTypesGridIndex.GridIndex[]>();
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
                const minNormalizedHp   = effectiveCoSkill ? UnitsUtilsCommon.getNormalizedHp(effectiveCoSkill.getHpUpperLimit() ?? 0) : UnitsUtilsCommon.getNormalizedHp(UnitsConstants.Hp.MaxHp);
                for (const unitType of unitTypeArray) {
                    const costModifier  = player.getUnitCostModifier(unitType);
                    const cfgCost       = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost());
                    const minCost       = effectiveCoSkill
                        ? Math.floor(cfgCost * costModifier * minNormalizedHp * (effectiveCoSkill.getCostMultiplierPct() ?? 0) / UnitsConstants.Hp.Normalizer / 100)
                        : Math.floor(cfgCost * costModifier);
                    if (minCost <= currentFund) {
                        const tileType = tile.getTileTypeId();
                        if (!idleBuildingsDict.has(tileType)) {
                            idleBuildingsDict.set(tileType, [gridIndex]);
                        } else {
                            HelpersMisc.getExisted(idleBuildingsDict.get(tileType)).push(gridIndex);
                        }
                        break;
                    }
                }
            }

            const textArrayForBuildings: string[] = [];
            for (const [tileType, gridIndexArray] of idleBuildingsDict) {
                textArrayForBuildings.push(LangUtils.getFormattedText(
                    LangConstants.TextType.F0007, gridIndexArray.length,
                    LangUtils.getTileName(tileType, gameConfig),
                    gridIndexArray.map(v => `(${v.getX()}, ${v.getY()})`).join(`, `)),
                );
            }
            (textArrayForBuildings.length) && (hints.push(textArrayForBuildings.join(`\n`)));
        }

        hints.push(LangUtils.getText(LangConstants.TextType.A0024));
        return hints.join(`\n\n`);
    }
}
