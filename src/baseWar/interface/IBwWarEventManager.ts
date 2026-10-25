import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "./IBwWar.ts";
import type { WarEvent } from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WoSystemCallWarEvent } from "../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import type { SerialWarEventManager } from "../../proto/schema/CommonProto/WarSerialization/SerialWarEventManager.ts";
import type { IUnit } from "../../units/IUnit.ts";
import type { WarEventIdAndDataIndex } from "../../warEvents/Types.ts";

export interface IBwWarEventManager {
    init(data: Undefinable<SerialWarEventManager>, warEventFullData: Undefinable<WarEventFullData>): void;
    fastInit(data: SerialWarEventManager): void;

    serialize(): SerialWarEventManager;
    serializeForCreateSfw(): SerialWarEventManager;
    serializeForCreateMfr(): SerialWarEventManager;

    startRunning(war: IBwWar): void;

    getWarEventFullData(): WarEventFullData | null;
    setWarEventFullData(data: WarEventFullData | null): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for called counts.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    updateWarEventCalledCountOnCall(eventId: number): void;
    updateWarEventCalledCountOnPlayerTurnSwitched(): void;
    getWarEventCalledCountTotal(eventId: number): number;
    getWarEventCalledCountInPlayerTurn(eventId: number): number;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for custom counters.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    setCustomCounter(counterId: number, counterValue: number): void;
    getCustomCounter(counterId: number): number;

    checkIsCustomCounterRelevant(): boolean;

    handleEscapeText(rawText: string): string;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for persistent actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getOpaIdArray(): number[];
    getAllPersistentActionIdArray(): number[];

    updateOpaIdArrayOnExecuteAction(actionId: number): void;
    updateOpaIdArrayOnDeleteAction(actionIdArray: number[]): void;

    checkOpaCanActivateCoSkill(playerIndex: number): boolean | null;
    checkOpaCanProduceUnit(playerIndex: number, unitType: number): boolean | null;

    getOpaEnergyGrowthMultiplierModifier(playerIndex: number): number;
    getOpaAiUnitProductionBonusScore(playerIndex: number, unitTypeId: number, gridIndex: GridIndex): number;
    getOpaCoZoneRadiusModifier(playerIndex: number): number;
    getOpaAttackPowerModifier(unit: IUnit, gridIndex: GridIndex): number;
    getOpaDefenseModifier(unit: IUnit, gridIndex: GridIndex): number;
    getOpaMoveRangeModifier(unit: IUnit): number;
    getOpaMaxAttackRangeModifier(unit: IUnit): number;
    getOpaCanAttackAfterMoving(unit: IUnit): boolean | null;
    getOpaUnitVisionRangeModifier(unit: IUnit, gridIndex: GridIndex): number;
    getOpaIsPenetratingVision(unit: IUnit): boolean | null;
    getOpaLuckLowerLimitModifier(unit: IUnit, gridIndex: GridIndex): number;
    getOpaLuckUpperLimitModifier(unit: IUnit, gridIndex: GridIndex): number;
    getOpaFlareRadiusModifier(unit: IUnit, gridIndex: GridIndex): number;
    getOpaFlareRangeModifier(unit: IUnit, gridIndex: GridIndex): number;

    getOpaBgmCode(): number | null;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for calling events.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    callWarEvent(action: WoSystemCallWarEvent, isFastExecute: boolean): Promise<void>;

    getCallableWarEventIdAndDataIndex(): WarEventIdAndDataIndex | null;

    getWarEvent(warEventId: number): WarEvent;
    getWarEventAction(actionId: number): WarEventAction;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // misc
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getCalledDialogueActionIdArray(): number[]
}
