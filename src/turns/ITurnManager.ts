import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn from "../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn from "../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemEndTurn from "../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTurnManager from "../proto/schema/CommonProto/WarSerialization/SerialTurnManager.ts";
import type * as TurnsConstants from "./Constants.ts";
import type * as TurnsTypes from "./Types.ts";

type TurnPhaseCode      = TurnsConstants.PhaseCode;
type SerialTurnManager  = ProtoSchemaCommonProtoWarSerializationSerialTurnManager.SerialTurnManager;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;
type TurnAndPlayerIndex = TurnsTypes.TurnAndPlayerIndex;

export interface ITurnManager {
    init(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialTurnManager>, playersCountUnneutral: number): void;
    fastInit(data: SerialTurnManager, playersCountUnneutral: number): void;

    startRunning(war: IBwWar): void;

    serialize(): SerialTurnManager;
    serializeForCreateSfw(): SerialTurnManager;
    serializeForCreateMfr(): SerialTurnManager;

    getWar(): IBwWar;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The functions for running turn.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    endPhaseStandby(action: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): Promise<void>;

    endPhaseMain(action: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn | ProtoSchemaCommonProtoWarOperationWoSystemEndTurn.WoSystemEndTurn, isFastExecute: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getTurnIndex(): number;
    setTurnIndex(turnIndex: number): void;

    getPlayerIndexInTurn(): number;
    setPlayerIndexInTurn(playerIndex: number): void;

    getPreviousAlivePlayerIndex(playerIndex: number, includeNeutral?: boolean): number;
    getNextAlivePlayerIndex(playerIndex: number, includeNeutral?: boolean): number;
    getNextTurnAndPlayerIndex(currTurnIndex?: number, currPlayerIndex?: number): TurnAndPlayerIndex;

    getPhaseCode(): TurnPhaseCode;
    setPhaseCode(phaseCode: TurnPhaseCode): void;

    getEnterTurnTime(): number;
    setEnterTurnTime(enterTurnTime: number): void;

    getHasUnitOnBeginningTurn(): boolean;
    setHasUnitOnBeginningTurn(hasUnit: boolean): void;
}
