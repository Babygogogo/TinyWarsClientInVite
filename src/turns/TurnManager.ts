import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { newError, getExisted } from "../helpers/Misc.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { PlayerIndex, AliveStateId } from "../players/Constants.ts";
import type { WoPlayerEndTurn } from "../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type { WoSystemBeginTurn } from "../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import { SerialTurnManager } from "../proto/schema/CommonProto/WarSerialization/SerialTurnManager.ts";
import { PhaseCode } from "./Constants.ts";
import type { ITurnManager } from "./ITurnManager.ts";
import { endPhaseStandby, endPhaseMain } from "./phaseHandlers/WithExtraData.ts";
import {
    endPhaseStandby as TurnsPhaseHandlersWithoutExtraDataEndPhaseStandby,
    endPhaseMain as TurnsPhaseHandlersWithoutExtraDataEndPhaseMain,
} from "./phaseHandlers/WithoutExtraData.ts";
import type { TurnAndPlayerIndex } from "./Types.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";

export class TurnManager implements ITurnManager {
    private _turnIndex?             : number;
    private _playerIndexInTurn?     : number;
    private _phaseCode?             : PhaseCode;
    private _enterTurnTime?         : number;

    private _war?                   : IBwWar;
    private _hasUnitOnBeginningTurn = false;

    public init(data: SerialTurnManager, playersCountUnneutral: number): void {
        const playerIndex = data.getPlayerIndex();
        if ((playerIndex < PlayerIndex.Neutral)   ||
            (playerIndex > playersCountUnneutral)
        ) {
            throw newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwTurnManager_Init_01);
        }

        const turnPhaseCode = data.getTurnPhaseCode();
        if ((turnPhaseCode !== PhaseCode.Main)          &&
            (turnPhaseCode !== PhaseCode.WaitBeginTurn)
        ) {
            throw newError(`Invalid turnPhaseCode: ${turnPhaseCode}`, ClientErrorCode.BwTurnManager_Init_02);
        }

        this.setTurnIndex(data.getTurnIndex());
        this.setPlayerIndexInTurn(playerIndex);
        this.setPhaseCode(turnPhaseCode);
        this.setEnterTurnTime(data.getEnterTurnTime() ?? 0);
    }
    public fastInit(data: SerialTurnManager, playersCountUnneutral: number): void {
        this.init(data, playersCountUnneutral);
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
    }

    public serialize(): SerialTurnManager {
        return SerialTurnManager.fromJson({
            turnIndex       : this.getTurnIndex(),
            playerIndex     : this.getPlayerIndexInTurn(),
            turnPhaseCode   : this.getPhaseCode(),
            enterTurnTime   : this.getEnterTurnTime(),
        });
    }
    public serializeForCreateSfw(): SerialTurnManager {
        return this.serialize();
    }
    public serializeForCreateMfr(): SerialTurnManager {
        return this.serializeForCreateSfw();
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return getExisted(this._war);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The functions for running turn.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public endPhaseStandby(action: WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
        return this.getWar().getIsExecuteActionsWithExtraData()
            ? endPhaseStandby(this, action, isFastExecute)
            : TurnsPhaseHandlersWithoutExtraDataEndPhaseStandby(this, isFastExecute);
    }

    public endPhaseMain(action: WoPlayerEndTurn, isFastExecute: boolean): void {
        this.getWar().getIsExecuteActionsWithExtraData()
            ? endPhaseMain(this, action, isFastExecute)
            : TurnsPhaseHandlersWithoutExtraDataEndPhaseMain(this, isFastExecute);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getTurnIndex(): number {
        return getExisted(this._turnIndex);
    }
    public setTurnIndex(index: number): void {
        if (this._turnIndex !== index){
            this._turnIndex = index;
            dispatch(TypeId.BwTurnIndexChanged);
        }
    }

    public getPlayerIndexInTurn(): number {
        return getExisted(this._playerIndexInTurn);
    }
    public setPlayerIndexInTurn(index: number): void {
        if (this._playerIndexInTurn !== index) {
            this._playerIndexInTurn = index;
            dispatch(TypeId.BwPlayerIndexInTurnChanged);
        }
    }
    public getPreviousAlivePlayerIndex(playerIndex: number, includeNeutral = false): number {
        const playerIndex1  = this._getPreviousAlivePlayerIndex(playerIndex);
        if ((playerIndex1 !== PlayerIndex.Neutral) || (includeNeutral)) {
            return playerIndex1;
        } else {
            return this._getPreviousAlivePlayerIndex(playerIndex1);
        }
    }
    public getNextAlivePlayerIndex(playerIndex: number, includeNeutral = false): number {
        const data          = this._getNextAliveTurnAndPlayerIndex(null, playerIndex);
        const playerIndex1  = data.playerIndex;
        if ((playerIndex1 !== PlayerIndex.Neutral) || (includeNeutral)) {
            return playerIndex1;
        } else {
            const nextData = this._getNextAliveTurnAndPlayerIndex(data.turnIndex, playerIndex1);
            return nextData.playerIndex;
        }
    }

    public getPhaseCode(): PhaseCode {
        return getExisted(this._phaseCode);
    }
    public setPhaseCode(code: PhaseCode): void {
        if (this._phaseCode !== code) {
            this._phaseCode = code;
            dispatch(TypeId.BwTurnPhaseCodeChanged);
        }
    }

    public getEnterTurnTime(): number {
        return getExisted(this._enterTurnTime);
    }
    public setEnterTurnTime(time: number): void {
        this._enterTurnTime = time;
    }

    private _getPreviousAlivePlayerIndex(currPlayerIndex = this.getPlayerIndexInTurn()): number {
        const playerManager = this.getWar().getPlayerManager();
        const playersCount  = playerManager.getTotalPlayersCount(true);
        let previousPlayerIndex = currPlayerIndex - 1;
        for (;;) {
            if (previousPlayerIndex < 0) {
                previousPlayerIndex = playersCount - 1;
            }

            const player = playerManager.getPlayer(previousPlayerIndex);
            if (player.getAliveState() !== AliveStateId.Dead) {
                return previousPlayerIndex;
            } else {
                --previousPlayerIndex;
            }
        }
    }
    public getNextTurnAndPlayerIndex(
        currTurnIndex   = this.getTurnIndex(),
        currPlayerIndex = this.getPlayerIndexInTurn(),
    ): TurnAndPlayerIndex {
        if (currPlayerIndex < this.getWar().getPlayerManager().getTotalPlayersCount(false)) {
            return {
                turnIndex   : currTurnIndex,
                playerIndex : currPlayerIndex + 1,
            };
        } else {
            return {
                turnIndex   : currTurnIndex + 1,
                playerIndex : PlayerIndex.Neutral,
            };
        }
    }
    private _getNextAliveTurnAndPlayerIndex(
        currTurnIndex   : number | null,
        currPlayerIndex = this.getPlayerIndexInTurn(),
    ): TurnAndPlayerIndex {
        const war           = this.getWar();
        currTurnIndex       = currTurnIndex ?? this.getTurnIndex();
        const playerManager = war.getPlayerManager();
        const playersCount  = playerManager.getTotalPlayersCount(true);
        let nextTurnIndex   = currTurnIndex;
        let nextPlayerIndex = currPlayerIndex + 1;
        for (;;) {
            if (nextPlayerIndex >= playersCount) {
                nextPlayerIndex = 0;
                nextTurnIndex   += 1;
            }

            const player = playerManager.getPlayer(nextPlayerIndex);
            if (player.getAliveState() !== AliveStateId.Dead) {
                return {
                    turnIndex   : nextTurnIndex,
                    playerIndex : nextPlayerIndex
                };
            } else {
                ++nextPlayerIndex;
            }
        }
    }

    public getHasUnitOnBeginningTurn(): boolean {
        return this._hasUnitOnBeginningTurn;
    }
    public setHasUnitOnBeginningTurn(hasUnit: boolean): void {
        this._hasUnitOnBeginningTurn = hasUnit;
    }
}
