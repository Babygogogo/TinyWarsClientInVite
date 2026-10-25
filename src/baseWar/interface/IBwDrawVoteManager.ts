import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "./IBwWar.ts";
import type {
    SerialDrawVoteManager as ProtoSchemaCommonProtoWarSerializationSerialDrawVoteManager,
} from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import type {
    SerialPlayerManager as ProtoSchemaCommonProtoWarSerializationSerialPlayerManager,
} from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";

type SerialPlayerManager    = ProtoSchemaCommonProtoWarSerializationSerialPlayerManager;
type SerialDrawVoteManager  = ProtoSchemaCommonProtoWarSerializationSerialDrawVoteManager;

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
