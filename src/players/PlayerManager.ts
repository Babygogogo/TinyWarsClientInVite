import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../gameConfigs/GameConfig.ts";
import {
    getPlayerClass,
    getMeWarClass,
    getHrwWarClass,
    getMpwWarClass,
    getRwWarClass,
    getSpwWarClass,
    getTwWarClass,
} from "../gameHelpers/GhFactory.ts";
import { newError, getExisted } from "../helpers/Misc.ts";
import { createDefaultISerialPlayer } from "../mapEditor/model/MeHelpers.ts";
import { PlayerIndex, AliveStateId } from "./Constants.ts";
import type { IPlayer } from "./IPlayer.ts";
import type { IPlayerManager } from "./IPlayerManager.ts";
import type { SerialPlayer } from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import { SerialPlayerManager } from "../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { getSelfUserId } from "../users/Model.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";

export class PlayerManager implements IPlayerManager {
    private _players                    = new Map<number, IPlayer>();
    private _war?                       : IBwWar;
    private _watcherTeamIndexesForHrw?  : Set<number>;

    public init(data: Undefinable<SerialPlayerManager>, gameConfig: GameConfig): void {
        if (data == null) {
            throw newError(`Empty data.`, ClientErrorCode.BwPlayerManager_Init_00);
        }

        const playerArray = data.getPlayers();
        if ((!playerArray)                                              ||
            (playerArray.length < 3)                                    ||
            (playerArray.length > PlayerIndex.Max + 1)
        ) {
            throw newError(`Invalid playerArray.`, ClientErrorCode.BwPlayerManager_Init_01);
        }

        const newPlayerMap  = new Map<number, IPlayer>();
        const skinIdSet     = new Set<number>();
        for (const playerData of playerArray) {
            const playerIndex = playerData.getPlayerIndex();
            if (newPlayerMap.has(playerIndex)) {
                throw newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwPlayerManager_Init_02);
            }

            const skinId = playerData.getUnitAndTileSkinId();
            if (skinIdSet.has(skinId)) {
                throw newError(`Invalid skinId: ${skinId}`, ClientErrorCode.BwPlayerManager_Init_03);
            }
            skinIdSet.add(skinId);

            const player = new (getPlayerClass())();
            player.init(playerData, gameConfig);

            newPlayerMap.set(playerIndex, player);
        }

        if (!newPlayerMap.has(PlayerIndex.Neutral)) {
            throw newError(`No WarNeutralPlayerIndex.`, ClientErrorCode.BwPlayerManager_Init_04);
        }

        for (const [playerIndex] of newPlayerMap) {
            if ((playerIndex > PlayerIndex.Neutral) && (!newPlayerMap.has(playerIndex - 1))) {
                throw newError(`Non-continuous`, ClientErrorCode.BwPlayerManager_Init_05);
            }
        }

        if ((newPlayerMap.size < 3) || (newPlayerMap.size > PlayerIndex.Max + 1)) {
            throw newError(`Invalid playersCount: ${newPlayerMap.size}`, ClientErrorCode.BwPlayerManager_Init_06);
        }

        const playerMap = this.getAllPlayersDict();
        playerMap.clear();
        for (const [playerIndex, player] of newPlayerMap) {
            playerMap.set(playerIndex, player);
        }
    }
    public fastInit(data: SerialPlayerManager, gameConfig: GameConfig): void {
        for (const playerData of data ? data.getPlayers() : []) {
            const playerIndex   = playerData.getPlayerIndex();
            const player        = getExisted(this.getPlayer(playerIndex), ClientErrorCode.BwPlayerManager_FastInit_01);
            player.init(playerData, gameConfig);
        }
    }
    public initWatcherTeamIndexesForHrw(warData: SerialWar): void {
        const teamIndexes = new Set<number>();
        for (const data of warData.getExecutedOperationManager()?.getHalfwayReplayOperationArray() ?? []) {
            teamIndexes.add(getExisted(data.getTeamIndex(), ClientErrorCode.HrwPlayerManager_InitWatcherTeamIndexes_00));
        }
        this._watcherTeamIndexesForHrw = teamIndexes;
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
        for (const [, player] of this._players) {
            player.startRunning(war);
        }
    }

    public serialize(): SerialPlayerManager {
        const players: SerialPlayer[] = [];
        for (const [, player] of this.getAllPlayersDict()) {
            players.push(player.serialize());
        }

        return SerialPlayerManager.fromJson({
            players : players.map(v => v.toJson()),
        });
    }
    public serializeForCreateSfw(): SerialPlayerManager {
        const war = this._getWar();
        if (war instanceof getMeWarClass()) {
            const maxPlayerIndex    = war.getField().getMaxPlayerIndex();
            const players           : SerialPlayer[] = [];
            for (let playerIndex = PlayerIndex.Neutral; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push(createDefaultISerialPlayer(playerIndex));
            }

            return SerialPlayerManager.fromJson({
                players : players.map(v => v.toJson()),
            });

        } else {
            const players: SerialPlayer[] = [];
            for (const [, player] of this.getAllPlayersDict()) {
                players.push(player.serializeForCreateSfw());
            }

            return SerialPlayerManager.fromJson({
                players : players.map(v => v.toJson()),
            });
        }
    }
    public serializeForCreateMfr(): SerialPlayerManager {
        const war = this._getWar();
        if (war instanceof getMeWarClass()) {
            const maxPlayerIndex    = war.getField().getMaxPlayerIndex();
            const players           : SerialPlayer[] = [];
            for (let playerIndex = PlayerIndex.Neutral; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push(this.getPlayer(playerIndex).serializeForCreateMfr());
            }

            return SerialPlayerManager.fromJson({
                players : players.map(v => v.toJson()),
            });

        } else {
            const players: SerialPlayer[] = [];
            for (const [, player] of this.getAllPlayersDict()) {
                players.push(player.serializeForCreateMfr());
            }

            return SerialPlayerManager.fromJson({
                players : players.map(v => v.toJson()),
            });
        }
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    protected _getWar(): IBwWar {
        return getExisted(this._war);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // The other public functions.
    ////////////////////////////////////////////////////////////////////////////////
    public checkHasPlayer(playerIndex: number): boolean {
        return this._players.has(playerIndex);
    }
    public getPlayer(playerIndex: number): IPlayer {
        return getExisted(this._players.get(playerIndex));
    }
    public getAllPlayersDict(): Map<number, IPlayer> {
        return this._players;
    }
    /** 返回结果已按playerIndex排序 */
    public getAllPlayers(includeNeutral = true): IPlayer[] {
        const players: IPlayer[] = [];
        for (const [playerIndex, player] of this.getAllPlayersDict()) {
            if ((includeNeutral) || (playerIndex !== PlayerIndex.Neutral)) {
                players.push(player);
            }
        }
        return players.sort((v1, v2) => v1.getPlayerIndex() - v2.getPlayerIndex());
    }

    public getPlayerByUserId(userId: number): IPlayer | null {
        for (const [, player] of this._players) {
            if (player.getUserId() === userId) {
                return player;
            }
        }
        return null;
    }

    public getPlayerLoggedIn(): IPlayer | null {
        const userId = getExisted(getSelfUserId());
        for (const [, player] of this.getAllPlayersDict()) {
            if (player.getUserId() === userId) {
                return player;
            }
        }

        return null;
    }
    public getPlayerIndexLoggedIn(): number | null {
        return this.getPlayerLoggedIn()?.getPlayerIndex() ?? null;
    }

    public getPlayerInTurn(): IPlayer {
        return this.getPlayer(this._getWar().getPlayerIndexInTurn());
    }

    public getHumanPlayers(): IPlayer[] {
        const players: IPlayer[] = [];
        for (const [, player] of this.getAllPlayersDict()) {
            if (player.getUserId() != null) {
                players.push(player);
            }
        }
        return players;
    }

    public getTeamIndex(playerIndex: number): number {
        return this.getPlayer(playerIndex).getTeamIndex();
    }
    public getTeamIndexSet(playerIndexArray: number[]): Set<number> {
        return new Set(playerIndexArray.map(v => this.getTeamIndex(v)));
    }
    public getAllTeamIndexSet(): Set<number> {
        return new Set([...this._players.values()].map(v => v.getTeamIndex()));
    }

    public getPlayerIndexesInTeam(teamIndex: number): number[] {
        const playerIndexes: number[] = [];
        for (const [playerIndex, player] of this._players) {
            if (player.getTeamIndex() === teamIndex) {
                playerIndexes.push(playerIndex);
            }
        }
        return playerIndexes;
    }
    public getPlayerIndexesInTeams(teamIndexes: Set<number>): Set<number> {
        const playerIndexes = new Set<number>();
        for (const [playerIndex, player] of this._players) {
            if (teamIndexes.has(player.getTeamIndex())) {
                playerIndexes.add(playerIndex);
            }
        }
        return playerIndexes;
    }

    public getTotalPlayersCount(includeNeutral: boolean): number {
        return includeNeutral ? this._players.size : this._players.size - 1;
    }
    public getPlayerIndexArray(startingPlayerIndex: number, includeNeutral: boolean): number[] {
        const playersCountUnneutral = this.getTotalPlayersCount(false);
        const playerIndexList       : number[] = [];
        for (let playerIndex = Math.max(startingPlayerIndex, includeNeutral ? PlayerIndex.Neutral : PlayerIndex.First); playerIndex <= playersCountUnneutral; ++playerIndex) {
            playerIndexList.push(playerIndex);
        }
        for (let playerIndex = includeNeutral ? PlayerIndex.Neutral : PlayerIndex.First; playerIndex < startingPlayerIndex; ++playerIndex) {
            playerIndexList.push(playerIndex);
        }

        return playerIndexList;
    }

    public getAlivePlayersCount(includeNeutral: boolean): number {
        let count = 0;
        for (const [playerIndex, player] of this._players) {
            if ((player.getAliveState() !== AliveStateId.Dead)                          &&
                ((includeNeutral) || (playerIndex !== PlayerIndex.Neutral))
            ) {
                ++count;
            }
        }
        return count;
    }

    public getAliveOrDyingTeamsCount(includeNeutral: boolean): number {
        const teamIndexes = new Set<number>();
        for (const [playerIndex, player] of this._players) {
            const aliveState = player.getAliveState();
            if (((aliveState === AliveStateId.Alive) || (aliveState === AliveStateId.Dying))   &&
                ((includeNeutral) || (playerIndex !== PlayerIndex.Neutral))
            ) {
                teamIndexes.add(player.getTeamIndex());
            }
        }
        return teamIndexes.size;
    }

    public getAliveTeamIndexes(includeNeutral: boolean, ignoredPlayerIndex?: number): Set<number> {
        const indexes = new Set<number>();
        for (const [playerIndex, player] of this._players) {
            if ((player.getAliveState() !== AliveStateId.Dead)  &&
                (playerIndex !== ignoredPlayerIndex)                &&
                ((includeNeutral) || (playerIndex !== 0))
            ) {
                const teamIndex = player.getTeamIndex();
                if (teamIndex == null) {
                    throw newError(`BwPlayerManager.getAliveTeamIndexes() empty teamIndex.`);
                } else {
                    indexes.add(teamIndex);
                }
            }
        }
        return indexes;
    }

    public checkIsSameTeam(playerIndex1: number, playerIndex2: number): boolean {
        const p1 = this._players.get(playerIndex1);
        const p2 = this._players.get(playerIndex2);
        return (p1 != null) && (p2 != null) && (p1.getTeamIndex() === p2.getTeamIndex());
    }

    public forEachPlayer(includeNeutral: boolean, func: (p: IPlayer) => void): void {
        for (const [playerIndex, player] of this._players) {
            ((includeNeutral) || (playerIndex !== 0)) && (func(player));
        }
    }

    public checkHasAliveWatcherTeam(watcherUserId: number): boolean {
        for (const [playerIndex, player] of this._players) {
            if ((playerIndex !== PlayerIndex.Neutral) &&
                (player.getAliveState() !== AliveStateId.Dead)
            ) {
                if ((player.getUserId() === watcherUserId) || (player.getWatchOngoingSrcUserIds().has(watcherUserId))) {
                    return true;
                }
            }
        }
        return false;
    }

    public getWatcherTeamIndexesForSelf(): Set<number> {
        const war = this._getWar();
        if (war instanceof getHrwWarClass()) {
            return getExisted(this._watcherTeamIndexesForHrw, ClientErrorCode.HrwPlayerManager_GetAliveWatcherTeamIndexesForSelf_00);

        } else if (war instanceof getMeWarClass()) {
            return this.getAliveTeamIndexes(false);

        } else if (war instanceof getMpwWarClass()) {
            const watcherUserId = getExisted(getSelfUserId());
            const indexes       = new Set<number>();
            this.forEachPlayer(false, player => {
                if ((player.getUserId() === watcherUserId)                  ||
                    (player.getWatchOngoingSrcUserIds().has(watcherUserId))
                ) {
                    indexes.add(player.getTeamIndex());
                }
            });

            return indexes;

        } else if (war instanceof getRwWarClass()) {
            return this.getAliveTeamIndexes(false);

        } else if (war instanceof getSpwWarClass()) {
            const humanPlayers = this.getHumanPlayers();
            if (!humanPlayers.length) {
                return this.getAliveTeamIndexes(false);
            } else {
                // return this.getAliveWatcherTeamIndexes(UserModel.getSelfUserId());
                const player = this.getPlayerInTurn();
                if (player.getUserId() != null) {
                    return new Set<number>([player.getTeamIndex()]);
                } else {
                    const teamIndexes = new Set<number>();
                    for (const p of humanPlayers) {
                        const teamIndex = p.getTeamIndex();
                        teamIndexes.add(teamIndex);
                    }
                    if (teamIndexes.size <= 1) {
                        return teamIndexes;
                    } else {
                        return new Set<number>();
                    }
                }
            }

        } else if (war instanceof getTwWarClass()) {
            return new Set();

        } else {
            throw newError(`Invalid war.`);
        }
    }
}
