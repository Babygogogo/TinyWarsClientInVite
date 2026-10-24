import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "./IBwWar.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEvent from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent from "../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWarEventManager from "../../proto/schema/CommonProto/WarSerialization/SerialWarEventManager.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import type * as WarEventsTypes from "../../warEvents/Types.ts";

type GridIndex              = AuxiliaryTypesGridIndex.GridIndex;
type SerialWarEventManager  = ProtoSchemaCommonProtoWarSerializationSerialWarEventManager.SerialWarEventManager;
type IUnit                  = UnitsIUnit.IUnit;
type WarEventIdAndDataIndex = WarEventsTypes.WarEventIdAndDataIndex;

export interface IBwWarEventManager {
    init(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialWarEventManager>, warEventFullData: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData>): void;
    fastInit(data: SerialWarEventManager): void;

    serialize(): SerialWarEventManager;
    serializeForCreateSfw(): SerialWarEventManager;
    serializeForCreateMfr(): SerialWarEventManager;

    startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void;

    getWarEventFullData(): ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData | null;
    setWarEventFullData(data: ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData | null): void;

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
    callWarEvent(action: ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent.WoSystemCallWarEvent, isFastExecute: boolean): Promise<void>;

    getCallableWarEventIdAndDataIndex(): WarEventIdAndDataIndex | null;

    getWarEvent(warEventId: number): ProtoSchemaCommonProtoWarEventWarEvent.WarEvent;
    getWarEventAction(actionId: number): ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // misc
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getCalledDialogueActionIdArray(): number[]
}
