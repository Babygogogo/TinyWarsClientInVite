import {
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { SerialDrawVoteManager } from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import type { SerialPlayerManager } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";

export interface IBwDrawVoteManager {
    init(
        playerManagerData   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayerManager>,
        remainingVotes      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>,
        drawVoteManagerData : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialDrawVoteManager>,
    ): void;
    fastInit(
        remainingVotes      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>,
        drawVoteManagerData : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialDrawVoteManager>,
    ): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;

    getRemainingVotes(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    getDrawVoteData(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialDrawVoteManager>;

    checkIsDraw(): boolean;
    checkHasOngoingVote(): boolean;
    checkNeedVoteBeforeEndTurn(playerIndex: number): boolean;
    checkCanVote(playerIndex: number, isAgree: boolean): boolean;

    handleVote(playerIndex: number, isAgree: boolean): void;
    handlePlayerForceDestruction(): void;
    handleTurnPhaseResetVotesForDraw(): void;

    clearAllVotes(): void;
}
