import type { IActionPlanner } from "../../actionPlanners/IActionPlanner.ts";
import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwCommonSettingManager } from "./IBwCommonSettingManager.ts";
import type { IBwCursor } from "./IBwCursor.ts";
import type { IBwDrawVoteManager } from "./IBwDrawVoteManager.ts";
import type { IBwExecutedOperationManager } from "./IBwExecutedOperationManager.ts";
import type { IBwGridVisualEffect } from "./IBwGridVisualEffect.ts";
import type { IBwRandomNumberManager } from "./IBwRandomNumberManager.ts";
import type { IBwWarEventManager } from "./IBwWarEventManager.ts";
import type { IBwWarStatisticsManager } from "./IBwWarStatisticsManager.ts";
import type { IBwWarView } from "./IBwWarView.ts";
import type { DamagePreviewSettings } from "../model/BwTypes.ts";
import type { IField } from "../../fields/IField.ts";
import type { IFogMap } from "../../fogMaps/IFogMap.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import type { IPlayer } from "../../players/IPlayer.ts";
import type { IPlayerManager } from "../../players/IPlayerManager.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { MovingUnitAndPath } from "../../proto/schema/CommonProto/Structure/MovingUnitAndPath.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { ITaskObjectiveManager } from "../../taskObjectives/ITaskObjectiveManager.ts";
import type { ITileMap } from "../../tiles/ITileMap.ts";
import type { PhaseCode } from "../../turns/Constants.ts";
import type { ITurnManager } from "../../turns/ITurnManager.ts";
import type { IUnit } from "../../units/IUnit.ts";
import type { IUnitMap } from "../../units/IUnitMap.ts";
import type { WarTypeId } from "../../warTypes/Constants.ts";
import type { IManager } from "../../weathers/IManager.ts";

type WarType            = WarTypeId;
export interface IBwWar {
    init(data: SerialWar, gcData: GcData): void;
    getNormalMapId(): number | null;
    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getPlayerManager(): IPlayerManager;
    getWarStatisticsManager(): IBwWarStatisticsManager;
    getField(): IField;
    getCommonSettingManager(): IBwCommonSettingManager;
    getWarEventManager(): IBwWarEventManager;
    getBootRestTime(playerIndex: number): number | null;
    getSettingsBootTimerParams(): number[];
    getIsExecuteActionsWithExtraData(): boolean;
    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    fastLoadState(warData: SerialWar): void;

    getView(): IBwWarView;

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

    getWarType(): WarType;

    getGcData(): GcData;

    getDamagePreviewSettings(): DamagePreviewSettings;

    getInstanceWarRule(): InstanceWarRule;

    getPlayersCountUnneutral(): number;
    getPlayer(playerIndex: number): IPlayer;
    getPlayerInTurn(): IPlayer;
    getPlayerIndexInTurn(): number;
    checkIsHumanInTurn(): boolean;

    getTurnManager(): ITurnManager;
    getFogMap(): IFogMap;
    getUnitMap(): IUnitMap;
    getTileMap(): ITileMap;
    getActionPlanner(): IActionPlanner;
    getGridVisualEffect(): IBwGridVisualEffect;
    getCursor(): IBwCursor;

    getEnterTurnTime(): number;
    getTurnPhaseCode(): PhaseCode;

    getWeatherManager(): IManager;
    getDrawVoteManager(): IBwDrawVoteManager;
    getRandomNumberManager(): IBwRandomNumberManager;
    getExecutedOperationManager(): IBwExecutedOperationManager;
    getTaskObjectiveManager(): ITaskObjectiveManager;

    moveUnit({ pathNodes, launchUnitId, fuelConsumption }: {
        pathNodes       : GridIndex[];
        launchUnitId    : Undefinable<number>;
        fuelConsumption : number;
    }): void;
    moveExtraUnit({ movingUnitAndPath, aiming, deleteViewAfterMoving }: {
        movingUnitAndPath       : Undefinable<MovingUnitAndPath>;
        aiming                  : Undefinable<GridIndex>;
        deleteViewAfterMoving   : boolean;
    }): Promise<IUnit | null>;

    checkCanProduceUnitByOpaAndRule(playerIndex: number, unitType: number): boolean;

    getIdleBuildingGridIndex(): Undefinable<GridIndex>;
    getIdleUnitGridIndex(): Undefinable<GridIndex>;

    getHintForEndTurn(): string;
}
