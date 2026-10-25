import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwDrawVoteManager } from "../interface/IBwDrawVoteManager.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { newError, getExisted } from "../../helpers/Misc.ts";
import { checkIsValidPlayerIndexSubset } from "../../players/utils/Common.ts";
import type { SerialDrawVoteManager } from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import type {
    SerialPlayerManager as ProtoSchemaCommonProtoWarSerializationSerialPlayerManager,
} from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

type SerialPlayerManager        = ProtoSchemaCommonProtoWarSerializationSerialPlayerManager;

export class BwDrawVoteManager implements IBwDrawVoteManager {
    private _remainingVotes     : Undefinable<number>;
    private _drawVoteData       : Undefinable<SerialDrawVoteManager>;
    private _war?               : IBwWar;

    public init(
        playerManagerData   : Undefinable<SerialPlayerManager>,
        remainingVotes      : Undefinable<number>,
        drawVoteManagerData : Undefinable<SerialDrawVoteManager>,
    ): void {
        const totalPlayersCount = playerManagerData?.getPlayers()?.length ?? 0;
        if (remainingVotes == null) {
            if ((drawVoteManagerData != null)                                                                                           &&
                (!checkIsValidPlayerIndexSubset(drawVoteManagerData.getAgreedPlayerIndexArray(), totalPlayersCount - 1))
            ) {
                throw newError(`Invalid agreedPlayerIndexArray.`, ClientErrorCode.BwDrawVoteManager_Init_00);
            }

        } else {
            if (remainingVotes >= totalPlayersCount) {
                throw newError(`remainingVotes >= maxVotes.`, ClientErrorCode.BwDrawVoteManager_Init_01);
            }
            if (drawVoteManagerData != null) {
                throw newError(`Invalid data.`, ClientErrorCode.BwDrawVoteManager_Init_02);
            }
        }

        this._setRemainingVotes(remainingVotes);
        this._setDrawVoteData(drawVoteManagerData);
    }
    public fastInit(
        remainingVotes      : Undefinable<number>,
        drawVoteManagerData : Undefinable<SerialDrawVoteManager>,
    ): void {
        this._setRemainingVotes(remainingVotes);
        this._setDrawVoteData(drawVoteManagerData);
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
    }

    public getRemainingVotes(): Undefinable<number> {
        return this._remainingVotes;
    }
    private _setRemainingVotes(votes: Undefinable<number>): void {
        this._remainingVotes = votes;
    }

    public getDrawVoteData(): Undefinable<SerialDrawVoteManager> {
        return this._drawVoteData;
    }
    private _setDrawVoteData(data: Undefinable<SerialDrawVoteManager>) {
        this._drawVoteData = data;
    }

    public checkIsDraw(): boolean {
        const data = this.getDrawVoteData();
        if (data != null) {
            return data.getAgreedPlayerIndexArray().length === this._getMaxVotes();
        } else {
            return this.getRemainingVotes() === 0;
        }
    }
    public checkHasOngoingVote(): boolean {
        const data = this.getDrawVoteData();
        if (data != null) {
            return !!data.getAgreedPlayerIndexArray().length;
        } else {
            return !!this.getRemainingVotes();
        }
    }
    public checkNeedVoteBeforeEndTurn(playerIndex: number): boolean {
        const war = this._getWar();
        if (war.getPlayerIndexInTurn() !== playerIndex) {
            return false;
        }

        const data = this.getDrawVoteData();
        if (data != null) {
            const arr = data.getAgreedPlayerIndexArray();
            return (!!arr.length) && (!arr.includes(playerIndex));
        } else {
            return (this.getRemainingVotes() != null) && (!war.getPlayer(playerIndex).getHasVotedForDraw());
        }
    }
    public checkCanVote(playerIndex: number, isAgree: boolean): boolean {
        const data = this.getDrawVoteData();
        if (data != null) {
            const arr = data.getAgreedPlayerIndexArray();
            if (!arr.length) {
                return (!data.getIsProposedInCurrentTurn()) && (isAgree);
            } else {
                return !arr.includes(playerIndex);
            }
        } else {
            const war = this._getWar();
            return (war.getPlayerIndexInTurn() === playerIndex)
                && (!war.getPlayer(playerIndex).getHasVotedForDraw())
                && ((this.getRemainingVotes() != null) || (isAgree));
        }
    }

    public handleVote(playerIndex: number, isAgree: boolean): void {
        const data = this.getDrawVoteData();
        if (data != null) {
            if (!isAgree) {
                data.setAgreedPlayerIndexArray([]);
            } else {
                const arr = data.getAgreedPlayerIndexArray();
                if (!arr.length) {
                    data.setIsProposedInCurrentTurn(true);
                }
                arr.push(playerIndex);
            }
        } else {
            if (!isAgree) {
                this._setRemainingVotes(null);
            } else {
                this._setRemainingVotes((this.getRemainingVotes() || this._getMaxVotes()) - 1);
            }
            this._getWar().getPlayer(playerIndex).setHasVotedForDraw(true);
        }
    }
    public handlePlayerForceDestruction(): void {
        const data = this.getDrawVoteData();
        if (data != null) {
            data.setAgreedPlayerIndexArray([]);
        } else {
            this._setRemainingVotes(null);
        }
    }
    public handleTurnPhaseResetVotesForDraw(): void {
        const data = this.getDrawVoteData();
        if (data != null) {
            data.setIsProposedInCurrentTurn(null);
        } else {
            this._getWar().getPlayerInTurn().setHasVotedForDraw(false);
        }
    }

    public clearAllVotes(): void {
        const data = this.getDrawVoteData();
        if (data) {
            data.setAgreedPlayerIndexArray([]);
            data.setIsProposedInCurrentTurn(null);
        } else {
            this._setRemainingVotes(null);
        }
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    private _getWar(): IBwWar {
        return getExisted(this._war);
    }

    private _getMaxVotes(): number {
        return this._getWar().getPlayerManager().getTotalPlayersCount(true);
    }
}
