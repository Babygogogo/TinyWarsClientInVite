import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import * as PlayersConstants from "../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn from "../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn from "../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialTurnManager from "../proto/schema/CommonProto/WarSerialization/SerialTurnManager.ts";
import * as TurnsConstants from "./Constants.ts";
import type * as TurnsITurnManager from "./ITurnManager.ts";
import * as TurnsPhaseHandlersWithExtraData from "./phaseHandlers/WithExtraData.ts";
import * as TurnsPhaseHandlersWithoutExtraData from "./phaseHandlers/WithoutExtraData.ts";
import type * as TurnsTypes from "./Types.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

type IBwWar                         = BaseWarInterfaceIBwWar.IBwWar;
type TurnAndPlayerIndex             = TurnsTypes.TurnAndPlayerIndex;

export class TurnManager implements TurnsITurnManager.ITurnManager {
    private _turnIndex?             : number;
    private _playerIndexInTurn?     : number;
    private _phaseCode?             : TurnsConstants.PhaseCode;
    private _enterTurnTime?         : number;

    private _war?                   : IBwWar;
    private _hasUnitOnBeginningTurn = false;

    public init(data: ProtoSchemaCommonProtoWarSerializationSerialTurnManager.SerialTurnManager, playersCountUnneutral: number): void {
        const playerIndex = data.getPlayerIndex();
        if ((playerIndex < PlayersConstants.PlayerIndex.Neutral)   ||
            (playerIndex > playersCountUnneutral)
        ) {
            throw HelpersMisc.newError(`Invalid playerIndex: ${playerIndex}`, UtilsClientErrorCode.ClientErrorCode.BwTurnManager_Init_01);
        }

        const turnPhaseCode = data.getTurnPhaseCode();
        if ((turnPhaseCode !== TurnsConstants.PhaseCode.Main)          &&
            (turnPhaseCode !== TurnsConstants.PhaseCode.WaitBeginTurn)
        ) {
            throw HelpersMisc.newError(`Invalid turnPhaseCode: ${turnPhaseCode}`, UtilsClientErrorCode.ClientErrorCode.BwTurnManager_Init_02);
        }

        this.setTurnIndex(data.getTurnIndex());
        this.setPlayerIndexInTurn(playerIndex);
        this.setPhaseCode(turnPhaseCode);
        this.setEnterTurnTime(data.getEnterTurnTime() ?? 0);
    }
    public fastInit(data: ProtoSchemaCommonProtoWarSerializationSerialTurnManager.SerialTurnManager, playersCountUnneutral: number): void {
        this.init(data, playersCountUnneutral);
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialTurnManager.SerialTurnManager {
        return ProtoSchemaCommonProtoWarSerializationSerialTurnManager.SerialTurnManager.fromJson({
            turnIndex       : this.getTurnIndex(),
            playerIndex     : this.getPlayerIndexInTurn(),
            turnPhaseCode   : this.getPhaseCode(),
            enterTurnTime   : this.getEnterTurnTime(),
        });
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialTurnManager.SerialTurnManager {
        return this.serialize();
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialTurnManager.SerialTurnManager {
        return this.serializeForCreateSfw();
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return HelpersMisc.getExisted(this._war);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The functions for running turn.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public endPhaseStandby(action: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
        return this.getWar().getIsExecuteActionsWithExtraData()
            ? TurnsPhaseHandlersWithExtraData.endPhaseStandby(this, action, isFastExecute)
            : TurnsPhaseHandlersWithoutExtraData.endPhaseStandby(this, isFastExecute);
    }

    public endPhaseMain(action: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
        this.getWar().getIsExecuteActionsWithExtraData()
            ? TurnsPhaseHandlersWithExtraData.endPhaseMain(this, action, isFastExecute)
            : TurnsPhaseHandlersWithoutExtraData.endPhaseMain(this, isFastExecute);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getTurnIndex(): number {
        return HelpersMisc.getExisted(this._turnIndex);
    }
    public setTurnIndex(index: number): void {
        if (this._turnIndex !== index){
            this._turnIndex = index;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTurnIndexChanged);
        }
    }

    public getPlayerIndexInTurn(): number {
        return HelpersMisc.getExisted(this._playerIndexInTurn);
    }
    public setPlayerIndexInTurn(index: number): void {
        if (this._playerIndexInTurn !== index) {
            this._playerIndexInTurn = index;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwPlayerIndexInTurnChanged);
        }
    }
    public getPreviousAlivePlayerIndex(playerIndex: number, includeNeutral = false): number {
        const playerIndex1  = this._getPreviousAlivePlayerIndex(playerIndex);
        if ((playerIndex1 !== PlayersConstants.PlayerIndex.Neutral) || (includeNeutral)) {
            return playerIndex1;
        } else {
            return this._getPreviousAlivePlayerIndex(playerIndex1);
        }
    }
    public getNextAlivePlayerIndex(playerIndex: number, includeNeutral = false): number {
        const data          = this._getNextAliveTurnAndPlayerIndex(null, playerIndex);
        const playerIndex1  = data.playerIndex;
        if ((playerIndex1 !== PlayersConstants.PlayerIndex.Neutral) || (includeNeutral)) {
            return playerIndex1;
        } else {
            const nextData = this._getNextAliveTurnAndPlayerIndex(data.turnIndex, playerIndex1);
            return nextData.playerIndex;
        }
    }

    public getPhaseCode(): TurnsConstants.PhaseCode {
        return HelpersMisc.getExisted(this._phaseCode);
    }
    public setPhaseCode(code: TurnsConstants.PhaseCode): void {
        if (this._phaseCode !== code) {
            this._phaseCode = code;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTurnPhaseCodeChanged);
        }
    }

    public getEnterTurnTime(): number {
        return HelpersMisc.getExisted(this._enterTurnTime);
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
            if (player.getAliveState() !== PlayersConstants.AliveStateId.Dead) {
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
                playerIndex : PlayersConstants.PlayerIndex.Neutral,
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
            if (player.getAliveState() !== PlayersConstants.AliveStateId.Dead) {
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
