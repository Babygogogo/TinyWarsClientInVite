import {
    type BaseWar_Model_BwTypes,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type BaseWar_Interface_IBwCommonSettingManager,
    type BaseWar_Interface_IBwCursor,
    type BaseWar_Interface_IBwDrawVoteManager,
    type BaseWar_Interface_IBwExecutedOperationManager,
    type BaseWar_Interface_IBwGridVisualEffect,
    type BaseWar_Interface_IBwRandomNumberManager,
    type BaseWar_Interface_IBwWarEventManager,
    type BaseWar_Interface_IBwWarStatisticsManager,
    type BaseWar_Interface_IBwWarView,
    type Fields_IField,
    type FogMaps_IFogMap,
    type Weathers_IManager,
    type Players_IPlayer,
    type Players_IPlayerManager,
    type TaskObjectives_ITaskObjectiveManager,
    type Tiles_TileMap,
    type Turns_ITurnManager,
    type Units_Unit,
    type Units_UnitMap,
    type Turns_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    type WarTypes_Constants,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { MovingUnitAndPath } from "../../proto/schema/CommonProto/Structure/MovingUnitAndPath.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface IBwWar {
    init(data: SerialWar, gcData: GameConfigs_GameConfig.GameConfig): void;
    getNormalMapId(): number | null;
    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getPlayerManager(): Players_IPlayerManager.IPlayerManager;
    getWarStatisticsManager(): BaseWar_Interface_IBwWarStatisticsManager.IBwWarStatisticsManager;
    getField(): Fields_IField.IField;
    getCommonSettingManager(): BaseWar_Interface_IBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager;
    getBootRestTime(playerIndex: number): number | null;
    getSettingsBootTimerParams(): number[];
    getIsExecuteActionsWithExtraData(): boolean;
    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    fastLoadState(warData: SerialWar): void;

    getView(): BaseWar_Interface_IBwWarView.IBwWarView;

    serializeForCreateSfw(): SerialWar;
    serializeForCreateMfr(): SerialWar;
    serializeForMap(): Promise<MapRawData>;

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

    getWarType(): WarTypes_Constants.WarTypeId;

    getGcData(): GameConfigs_GameConfig.GameConfig;

    getDamagePreviewSettings(): BaseWar_Model_BwTypes.DamagePreviewSettings;

    getInstanceWarRule(): InstanceWarRule;

    getPlayersCountUnneutral(): number;
    getPlayer(playerIndex: number): Players_IPlayer.IPlayer;
    getPlayerInTurn(): Players_IPlayer.IPlayer;
    getPlayerIndexInTurn(): number;
    checkIsHumanInTurn(): boolean;

    getTurnManager(): Turns_ITurnManager.ITurnManager;
    getFogMap(): FogMaps_IFogMap.IFogMap;
    getUnitMap(): Units_UnitMap.UnitMap;
    getTileMap(): Tiles_TileMap.TileMap;
    getActionPlanner(): ActionPlanners_IActionPlanner.IActionPlanner;
    getGridVisualEffect(): BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect;
    getCursor(): BaseWar_Interface_IBwCursor.IBwCursor;

    getEnterTurnTime(): number;
    getTurnPhaseCode(): Turns_Constants.PhaseCode;

    getWeatherManager(): Weathers_IManager.IManager;
    getDrawVoteManager(): BaseWar_Interface_IBwDrawVoteManager.IBwDrawVoteManager;
    getRandomNumberManager(): BaseWar_Interface_IBwRandomNumberManager.IBwRandomNumberManager;
    getExecutedOperationManager(): BaseWar_Interface_IBwExecutedOperationManager.IBwExecutedOperationManager;
    getTaskObjectiveManager(): TaskObjectives_ITaskObjectiveManager.ITaskObjectiveManager;

    moveUnit({ pathNodes, launchUnitId, fuelConsumption }: {
        pathNodes       : AuxiliaryTypes_GridIndex.GridIndex[];
        launchUnitId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
        fuelConsumption : number;
    }): void;
    moveExtraUnit({ movingUnitAndPath, aiming, deleteViewAfterMoving }: {
        movingUnitAndPath       : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MovingUnitAndPath>;
        aiming                  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex>;
        deleteViewAfterMoving   : boolean;
    }): Promise<Units_Unit.Unit | null>;

    checkCanProduceUnitByOpaAndRule(playerIndex: number, unitType: number): boolean;

    getIdleBuildingGridIndex(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex>;
    getIdleUnitGridIndex(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex>;

    getHintForEndTurn(): string;
}
