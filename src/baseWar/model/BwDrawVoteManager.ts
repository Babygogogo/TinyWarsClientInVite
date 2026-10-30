import {
    Players_Utils_Common,
    Utils_ClientErrorCode,
    Helpers_Misc,
    type BaseWar_Interface_IBwDrawVoteManager,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { SerialDrawVoteManager } from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import type { SerialPlayerManager } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";

export class BwDrawVoteManager implements BaseWar_Interface_IBwDrawVoteManager.IBwDrawVoteManager {
    private _remainingVotes     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private _drawVoteData       : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialDrawVoteManager>;
    private _war?               : BaseWar_Interface_IBwWar.IBwWar;

    public init(
        playerManagerData   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayerManager>,
        remainingVotes      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>,
        drawVoteManagerData : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialDrawVoteManager>,
    ): void {
        const totalPlayersCount = playerManagerData?.getPlayers()?.length ?? 0;
        if (remainingVotes == null) {
            if ((drawVoteManagerData != null)                                                                                           &&
                (!Players_Utils_Common.checkIsValidPlayerIndexSubset(drawVoteManagerData.getAgreedPlayerIndexArray(), totalPlayersCount - 1))
            ) {
                throw Helpers_Misc.newError(`Invalid agreedPlayerIndexArray.`, Utils_ClientErrorCode.ClientErrorCode.BwDrawVoteManager_Init_00);
            }

        } else {
            if (remainingVotes >= totalPlayersCount) {
                throw Helpers_Misc.newError(`remainingVotes >= maxVotes.`, Utils_ClientErrorCode.ClientErrorCode.BwDrawVoteManager_Init_01);
            }
            if (drawVoteManagerData != null) {
                throw Helpers_Misc.newError(`Invalid data.`, Utils_ClientErrorCode.ClientErrorCode.BwDrawVoteManager_Init_02);
            }
        }

        this._setRemainingVotes(remainingVotes);
        this._setDrawVoteData(drawVoteManagerData);
    }
    public fastInit(
        remainingVotes      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>,
        drawVoteManagerData : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialDrawVoteManager>,
    ): void {
        this._setRemainingVotes(remainingVotes);
        this._setDrawVoteData(drawVoteManagerData);
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._setWar(war);
    }

    public getRemainingVotes(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return this._remainingVotes;
    }
    private _setRemainingVotes(votes: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void {
        this._remainingVotes = votes;
    }

    public getDrawVoteData(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialDrawVoteManager> {
        return this._drawVoteData;
    }
    private _setDrawVoteData(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialDrawVoteManager>) {
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

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    private _getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    private _getMaxVotes(): number {
        return this._getWar().getPlayerManager().getTotalPlayersCount(true);
    }
}
