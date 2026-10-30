import {
    type BaseWar_Interface_IBwWar,
    type Turns_Constants,
    type Turns_Types,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { WoPlayerEndTurn } from "../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type { WoSystemBeginTurn } from "../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import type { WoSystemEndTurn } from "../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";
import type { SerialTurnManager } from "../proto/schema/CommonProto/WarSerialization/SerialTurnManager.ts";

export interface ITurnManager {
    init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTurnManager>, playersCountUnneutral: number): void;
    fastInit(data: SerialTurnManager, playersCountUnneutral: number): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;

    serialize(): SerialTurnManager;
    serializeForCreateSfw(): SerialTurnManager;
    serializeForCreateMfr(): SerialTurnManager;

    getWar(): BaseWar_Interface_IBwWar.IBwWar;

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
    getNextTurnAndPlayerIndex(currTurnIndex?: number, currPlayerIndex?: number): Turns_Types.TurnAndPlayerIndex;

    getPhaseCode(): Turns_Constants.PhaseCode;
    setPhaseCode(phaseCode: Turns_Constants.PhaseCode): void;

    getEnterTurnTime(): number;
    setEnterTurnTime(enterTurnTime: number): void;

    getHasUnitOnBeginningTurn(): boolean;
    setHasUnitOnBeginningTurn(hasUnit: boolean): void;
}
