import {
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type Units_Unit,
    type AuxiliaryTypes_AuxiliaryTypes,
    type WarEvents_Types,
} from "../../internal.ts";
import type { WarEvent } from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WoSystemCallWarEvent } from "../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import type { SerialWarEventManager } from "../../proto/schema/CommonProto/WarSerialization/SerialWarEventManager.ts";

export interface IBwWarEventManager {
    init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWarEventManager>, warEventFullData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WarEventFullData>): void;
    fastInit(data: SerialWarEventManager): void;

    serialize(): SerialWarEventManager;
    serializeForCreateSfw(): SerialWarEventManager;
    serializeForCreateMfr(): SerialWarEventManager;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;

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
    getOpaAiUnitProductionBonusScore(playerIndex: number, unitTypeId: number, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;
    getOpaCoZoneRadiusModifier(playerIndex: number): number;
    getOpaAttackPowerModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;
    getOpaDefenseModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;
    getOpaMoveRangeModifier(unit: Units_Unit.Unit): number;
    getOpaMaxAttackRangeModifier(unit: Units_Unit.Unit): number;
    getOpaCanAttackAfterMoving(unit: Units_Unit.Unit): boolean | null;
    getOpaUnitVisionRangeModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;
    getOpaIsPenetratingVision(unit: Units_Unit.Unit): boolean | null;
    getOpaLuckLowerLimitModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;
    getOpaLuckUpperLimitModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;
    getOpaFlareRadiusModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;
    getOpaFlareRangeModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;

    getOpaBgmCode(): number | null;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for calling events.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    callWarEvent(action: WoSystemCallWarEvent, isFastExecute: boolean): Promise<void>;

    getCallableWarEventIdAndDataIndex(): WarEvents_Types.WarEventIdAndDataIndex | null;

    getWarEvent(warEventId: number): WarEvent;
    getWarEventAction(actionId: number): WarEventAction;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // misc
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getCalledDialogueActionIdArray(): number[]
}
