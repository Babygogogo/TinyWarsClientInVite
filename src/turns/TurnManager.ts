import {
    Players_Constants,
    Utils_ClientErrorCode,
    Notifications_Dispatcher,
    Helpers_Misc,
    Turns_Constants,
    Notifications_TypeId,
    Turns_PhaseHandlers_WithExtraData,
    Turns_PhaseHandlers_WithoutExtraData,
    type BaseWar_Interface_IBwWar,
    type Turns_ITurnManager,
    type Turns_Types,
} from "../internal.ts";
import type { WoPlayerEndTurn } from "../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type { WoSystemBeginTurn } from "../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import { SerialTurnManager } from "../proto/schema/CommonProto/WarSerialization/SerialTurnManager.ts";

export class TurnManager implements Turns_ITurnManager.ITurnManager {
    private _turnIndex?             : number;
    private _playerIndexInTurn?     : number;
    private _phaseCode?             : Turns_Constants.PhaseCode;
    private _enterTurnTime?         : number;

    private _war?                   : BaseWar_Interface_IBwWar.IBwWar;
    private _hasUnitOnBeginningTurn = false;

    public init(data: SerialTurnManager, playersCountUnneutral: number): void {
        const playerIndex = data.getPlayerIndex();
        if ((playerIndex < Players_Constants.PlayerIndex.Neutral)   ||
            (playerIndex > playersCountUnneutral)
        ) {
            throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_Init_01);
        }

        const turnPhaseCode = data.getTurnPhaseCode();
        if ((turnPhaseCode !== Turns_Constants.PhaseCode.Main)          &&
            (turnPhaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn)
        ) {
            throw Helpers_Misc.newError(`Invalid turnPhaseCode: ${turnPhaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_Init_02);
        }

        this.setTurnIndex(data.getTurnIndex());
        this.setPlayerIndexInTurn(playerIndex);
        this.setPhaseCode(turnPhaseCode);
        this.setEnterTurnTime(data.getEnterTurnTime());
    }
    public fastInit(data: SerialTurnManager, playersCountUnneutral: number): void {
        this.init(data, playersCountUnneutral);
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
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

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    public getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The functions for running turn.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public endPhaseStandby(action: WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
        return this.getWar().getIsExecuteActionsWithExtraData()
            ? Turns_PhaseHandlers_WithExtraData.endPhaseStandby(this, action, isFastExecute)
            : Turns_PhaseHandlers_WithoutExtraData.endPhaseStandby(this, isFastExecute);
    }

    public endPhaseMain(action: WoPlayerEndTurn, isFastExecute: boolean): void {
        this.getWar().getIsExecuteActionsWithExtraData()
            ? Turns_PhaseHandlers_WithExtraData.endPhaseMain(this, action, isFastExecute)
            : Turns_PhaseHandlers_WithoutExtraData.endPhaseMain(this, isFastExecute);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getTurnIndex(): number {
        return Helpers_Misc.getExisted(this._turnIndex);
    }
    public setTurnIndex(index: number): void {
        if (this._turnIndex !== index){
            this._turnIndex = index;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTurnIndexChanged);
        }
    }

    public getPlayerIndexInTurn(): number {
        return Helpers_Misc.getExisted(this._playerIndexInTurn);
    }
    public setPlayerIndexInTurn(index: number): void {
        if (this._playerIndexInTurn !== index) {
            this._playerIndexInTurn = index;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwPlayerIndexInTurnChanged);
        }
    }
    public getPreviousAlivePlayerIndex(playerIndex: number, includeNeutral = false): number {
        const playerIndex1  = this._getPreviousAlivePlayerIndex(playerIndex);
        if ((playerIndex1 !== Players_Constants.PlayerIndex.Neutral) || (includeNeutral)) {
            return playerIndex1;
        } else {
            return this._getPreviousAlivePlayerIndex(playerIndex1);
        }
    }
    public getNextAlivePlayerIndex(playerIndex: number, includeNeutral = false): number {
        const data          = this._getNextAliveTurnAndPlayerIndex(null, playerIndex);
        const playerIndex1  = data.playerIndex;
        if ((playerIndex1 !== Players_Constants.PlayerIndex.Neutral) || (includeNeutral)) {
            return playerIndex1;
        } else {
            const nextData = this._getNextAliveTurnAndPlayerIndex(data.turnIndex, playerIndex1);
            return nextData.playerIndex;
        }
    }

    public getPhaseCode(): Turns_Constants.PhaseCode {
        return Helpers_Misc.getExisted(this._phaseCode);
    }
    public setPhaseCode(code: Turns_Constants.PhaseCode): void {
        if (this._phaseCode !== code) {
            this._phaseCode = code;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTurnPhaseCodeChanged);
        }
    }

    public getEnterTurnTime(): number {
        return Helpers_Misc.getExisted(this._enterTurnTime);
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
            if (player.getAliveState() !== Players_Constants.AliveStateId.Dead) {
                return previousPlayerIndex;
            } else {
                --previousPlayerIndex;
            }
        }
    }
    public getNextTurnAndPlayerIndex(
        currTurnIndex   = this.getTurnIndex(),
        currPlayerIndex = this.getPlayerIndexInTurn(),
    ): Turns_Types.TurnAndPlayerIndex {
        if (currPlayerIndex < this.getWar().getPlayerManager().getTotalPlayersCount(false)) {
            return {
                turnIndex   : currTurnIndex,
                playerIndex : currPlayerIndex + 1,
            };
        } else {
            return {
                turnIndex   : currTurnIndex + 1,
                playerIndex : Players_Constants.PlayerIndex.Neutral,
            };
        }
    }
    private _getNextAliveTurnAndPlayerIndex(
        currTurnIndex   : number | null,
        currPlayerIndex = this.getPlayerIndexInTurn(),
    ): Turns_Types.TurnAndPlayerIndex {
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
            if (player.getAliveState() !== Players_Constants.AliveStateId.Dead) {
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
