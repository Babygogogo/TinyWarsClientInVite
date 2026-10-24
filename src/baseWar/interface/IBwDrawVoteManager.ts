import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "./IBwWar.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialDrawVoteManager from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayerManager from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";

type SerialPlayerManager    = ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager;
type SerialDrawVoteManager  = ProtoSchemaCommonProtoWarSerializationSerialDrawVoteManager.SerialDrawVoteManager;

export interface IBwDrawVoteManager {
    init(
        playerManagerData   : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayerManager>,
        remainingVotes      : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>,
        drawVoteManagerData : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialDrawVoteManager>,
    ): void;
    fastInit(
        remainingVotes      : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>,
        drawVoteManagerData : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialDrawVoteManager>,
    ): void;

    startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void;

    getRemainingVotes(): AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;

    getDrawVoteData(): AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialDrawVoteManager>;

    checkIsDraw(): boolean;
    checkHasOngoingVote(): boolean;
    checkNeedVoteBeforeEndTurn(playerIndex: number): boolean;
    checkCanVote(playerIndex: number, isAgree: boolean): boolean;

    handleVote(playerIndex: number, isAgree: boolean): void;
    handlePlayerForceDestruction(): void;
    handleTurnPhaseResetVotesForDraw(): void;

    clearAllVotes(): void;
}
