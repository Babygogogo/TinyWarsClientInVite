import type * as ActionPlannersIActionPlanner from "../../actionPlanners/IActionPlanner.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwCommonSettingManager from "./IBwCommonSettingManager.ts";
import type * as BaseWarInterfaceIBwCursor from "./IBwCursor.ts";
import type * as BaseWarInterfaceIBwDrawVoteManager from "./IBwDrawVoteManager.ts";
import type * as BaseWarInterfaceIBwExecutedOperationManager from "./IBwExecutedOperationManager.ts";
import type * as BaseWarInterfaceIBwGridVisualEffect from "./IBwGridVisualEffect.ts";
import type * as BaseWarInterfaceIBwRandomNumberManager from "./IBwRandomNumberManager.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "./IBwWarEventManager.ts";
import type * as BaseWarInterfaceIBwWarStatisticsManager from "./IBwWarStatisticsManager.ts";
import type * as BaseWarInterfaceIBwWarView from "./IBwWarView.ts";
import type * as BaseWarModelBwTypes from "../model/BwTypes.ts";
import type * as FieldsIField from "../../fields/IField.ts";
import type * as FogMapsIFogMap from "../../fogMaps/IFogMap.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import type * as PlayersIPlayerManager from "../../players/IPlayerManager.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoStructureMovingUnitAndPath from "../../proto/schema/CommonProto/Structure/MovingUnitAndPath.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as TaskObjectivesITaskObjectiveManager from "../../taskObjectives/ITaskObjectiveManager.ts";
import type * as TilesITileMap from "../../tiles/ITileMap.ts";
import type * as TurnsConstants from "../../turns/Constants.ts";
import type * as TurnsITurnManager from "../../turns/ITurnManager.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import type * as UnitsIUnitMap from "../../units/IUnitMap.ts";
import type * as WarTypesConstants from "../../warTypes/Constants.ts";
import type * as WeathersIManager from "../../weathers/IManager.ts";

type WarType            = WarTypesConstants.WarTypeId;
type GcData             = GameConfigGcData.GcData;
type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type IFogMap            = FogMapsIFogMap.IFogMap;
type IPlayerManager     = PlayersIPlayerManager.IPlayerManager;
type IPlayer            = PlayersIPlayer.IPlayer;
type ITileMap           = TilesITileMap.ITileMap;

export interface IBwWar {
    init(data: SerialWar, gcData: GcData): void;
    getNormalMapId(): number | null;
    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getPlayerManager(): IPlayerManager;
    getWarStatisticsManager(): BaseWarInterfaceIBwWarStatisticsManager.IBwWarStatisticsManager;
    getField(): FieldsIField.IField;
    getCommonSettingManager(): BaseWarInterfaceIBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager;
    getBootRestTime(playerIndex: number): number | null;
    getSettingsBootTimerParams(): number[];
    getIsExecuteActionsWithExtraData(): boolean;
    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    fastLoadState(warData: SerialWar): void;

    getView(): BaseWarInterfaceIBwWarView.IBwWarView;

    serializeForCreateSfw(): SerialWar;
    serializeForCreateMfr(): SerialWar;
    serializeForMap(): Promise<ProtoSchemaCommonProtoMapMapRawData.MapRawData>;

    startRunning(): IBwWar;
    startRunningView(): IBwWar;
    stopRunning(): IBwWar;

    getIsRunning(): boolean;
    getIsExecutingAction(): boolean;
    setIsExecutingAction(isExecuting: boolean): void;

    checkCanEnd(): boolean;
    setIsEnded(ended: boolean): void;
    getIsEnded(): boolean;

    checkIsBoot(): boolean;

    getIsViewingWarInfo(): boolean;
    setIsViewingWarInfo(isViewing: boolean): void;

    getOverridingBgmCode(): number | null;
    setOverridingBgmCode(code: number | null): void;

    checkIsExceedTurnsOrWarOperationsLimit(): boolean;

    getWarId(): number | null;

    getWarType(): WarType;

    getGcData(): GcData;

    getDamagePreviewSettings(): BaseWarModelBwTypes.DamagePreviewSettings;

    getInstanceWarRule(): ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule;

    getPlayersCountUnneutral(): number;
    getPlayer(playerIndex: number): IPlayer;
    getPlayerInTurn(): IPlayer;
    getPlayerIndexInTurn(): number;
    checkIsHumanInTurn(): boolean;

    getTurnManager(): TurnsITurnManager.ITurnManager;
    getFogMap(): IFogMap;
    getUnitMap(): UnitsIUnitMap.IUnitMap;
    getTileMap(): ITileMap;
    getActionPlanner(): ActionPlannersIActionPlanner.IActionPlanner;
    getGridVisualEffect(): BaseWarInterfaceIBwGridVisualEffect.IBwGridVisualEffect;
    getCursor(): BaseWarInterfaceIBwCursor.IBwCursor;

    getEnterTurnTime(): number;
    getTurnPhaseCode(): TurnsConstants.PhaseCode;

    getWeatherManager(): WeathersIManager.IManager;
    getDrawVoteManager(): BaseWarInterfaceIBwDrawVoteManager.IBwDrawVoteManager;
    getRandomNumberManager(): BaseWarInterfaceIBwRandomNumberManager.IBwRandomNumberManager;
    getExecutedOperationManager(): BaseWarInterfaceIBwExecutedOperationManager.IBwExecutedOperationManager;
    getTaskObjectiveManager(): TaskObjectivesITaskObjectiveManager.ITaskObjectiveManager;

    moveUnit({ pathNodes, launchUnitId, fuelConsumption }: {
        pathNodes       : AuxiliaryTypesGridIndex.GridIndex[];
        launchUnitId    : Undefinable<number>;
        fuelConsumption : number;
    }): void;
    moveExtraUnit({ movingUnitAndPath, aiming, deleteViewAfterMoving }: {
        movingUnitAndPath       : Undefinable<ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath>;
        aiming                  : Undefinable<AuxiliaryTypesGridIndex.GridIndex>;
        deleteViewAfterMoving   : boolean;
    }): Promise<UnitsIUnit.IUnit | null>;

    checkCanProduceUnitByOpaAndRule(playerIndex: number, unitType: number): boolean;

    getIdleBuildingGridIndex(): Undefinable<AuxiliaryTypesGridIndex.GridIndex>;
    getIdleUnitGridIndex(): Undefinable<AuxiliaryTypesGridIndex.GridIndex>;

    getHintForEndTurn(): string;
}
