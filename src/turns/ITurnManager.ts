import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { WoPlayerEndTurn } from "../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type { WoSystemBeginTurn } from "../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import type { WoSystemEndTurn } from "../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";
import type { SerialTurnManager } from "../proto/schema/CommonProto/WarSerialization/SerialTurnManager.ts";
import type { PhaseCode } from "./Constants.ts";
import type { TurnAndPlayerIndex } from "./Types.ts";

type TurnPhaseCode      = PhaseCode;
export interface ITurnManager {
    init(data: Undefinable<SerialTurnManager>, playersCountUnneutral: number): void;
    fastInit(data: SerialTurnManager, playersCountUnneutral: number): void;

    startRunning(war: IBwWar): void;

    serialize(): SerialTurnManager;
    serializeForCreateSfw(): SerialTurnManager;
    serializeForCreateMfr(): SerialTurnManager;

    getWar(): IBwWar;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The functions for running turn.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    endPhaseStandby(action: WoSystemBeginTurn, isFastExecute: boolean): Promise<void>;

    endPhaseMain(action: WoPlayerEndTurn | WoSystemEndTurn, isFastExecute: boolean): void;

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
