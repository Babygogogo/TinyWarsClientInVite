import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "./IBwWar.ts";
import type { SerialDrawVoteManager } from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import type { SerialPlayerManager } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";

export interface IBwDrawVoteManager {
    init(
        playerManagerData   : Undefinable<SerialPlayerManager>,
        remainingVotes      : Undefinable<number>,
        drawVoteManagerData : Undefinable<SerialDrawVoteManager>,
    ): void;
    fastInit(
        remainingVotes      : Undefinable<number>,
        drawVoteManagerData : Undefinable<SerialDrawVoteManager>,
    ): void;

    startRunning(war: IBwWar): void;

    getRemainingVotes(): Undefinable<number>;

    getDrawVoteData(): Undefinable<SerialDrawVoteManager>;

    checkIsDraw(): boolean;
    checkHasOngoingVote(): boolean;
    checkNeedVoteBeforeEndTurn(playerIndex: number): boolean;
    checkCanVote(playerIndex: number, isAgree: boolean): boolean;

    handleVote(playerIndex: number, isAgree: boolean): void;
    handlePlayerForceDestruction(): void;
    handleTurnPhaseResetVotesForDraw(): void;

    clearAllVotes(): void;
}
