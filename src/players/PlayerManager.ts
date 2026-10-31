import {
    HalfwayReplayWar_Model_HrwWar,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    Players_Player,
    ReplayWar_Model_RwWar,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Players_Constants,
    Utils_ClientErrorCode,
    MapEditor_Model_MeHelpers,
    Helpers_Misc,
    Users_Model,
    type Players_IPlayer,
    type Players_IPlayerManager,
} from "../internal.ts";

import type { SerialPlayer } from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import { SerialPlayerManager } from "../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export class PlayerManager implements Players_IPlayerManager.IPlayerManager {
    private readonly _players                    = new Map<number, Players_IPlayer.IPlayer>();
    private _war?                       : BaseWar_Interface_IBwWar.IBwWar;
    private _watcherTeamIndexesForHrw?  : Set<number>;

    public init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayerManager>, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        if (data == null) {
            throw Helpers_Misc.newError(`Empty data.`, Utils_ClientErrorCode.ClientErrorCode.BwPlayerManager_Init_00);
        }

        const playerArray = data.getPlayers();
        if ((!playerArray)                                              ||
            (playerArray.length < 3)                                    ||
            (playerArray.length > Players_Constants.PlayerIndex.Max + 1)
        ) {
            throw Helpers_Misc.newError(`Invalid playerArray.`, Utils_ClientErrorCode.ClientErrorCode.BwPlayerManager_Init_01);
        }

        const newPlayerMap  = new Map<number, Players_IPlayer.IPlayer>();
        const skinIdSet     = new Set<number>();
        for (const playerData of playerArray) {
            const playerIndex = playerData.getPlayerIndex();
            if (newPlayerMap.has(playerIndex)) {
                throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwPlayerManager_Init_02);
            }

            const skinId = playerData.getUnitAndTileSkinId();
            if (skinIdSet.has(skinId)) {
                throw Helpers_Misc.newError(`Invalid skinId: ${skinId}`, Utils_ClientErrorCode.ClientErrorCode.BwPlayerManager_Init_03);
            }
            skinIdSet.add(skinId);

            const player = new Players_Player.Player();
            player.init(playerData, gameConfig);

            newPlayerMap.set(playerIndex, player);
        }

        if (!newPlayerMap.has(Players_Constants.PlayerIndex.Neutral)) {
            throw Helpers_Misc.newError(`No WarNeutralPlayerIndex.`, Utils_ClientErrorCode.ClientErrorCode.BwPlayerManager_Init_04);
        }

        for (const [playerIndex] of newPlayerMap) {
            if ((playerIndex > Players_Constants.PlayerIndex.Neutral) && (!newPlayerMap.has(playerIndex - 1))) {
                throw Helpers_Misc.newError(`Non-continuous`, Utils_ClientErrorCode.ClientErrorCode.BwPlayerManager_Init_05);
            }
        }

        if ((newPlayerMap.size < 3) || (newPlayerMap.size > Players_Constants.PlayerIndex.Max + 1)) {
            throw Helpers_Misc.newError(`Invalid playersCount: ${newPlayerMap.size}`, Utils_ClientErrorCode.ClientErrorCode.BwPlayerManager_Init_06);
        }

        const playerMap = this.getAllPlayersDict();
        playerMap.clear();
        for (const [playerIndex, player] of newPlayerMap) {
            playerMap.set(playerIndex, player);
        }
    }
    public fastInit(data: SerialPlayerManager, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        for (const playerData of data ? data.getPlayers() : []) {
            const playerIndex   = playerData.getPlayerIndex();
            const player        = this.getPlayer(playerIndex);
            player.init(playerData, gameConfig);
        }
    }
    public initWatcherTeamIndexesForHrw(warData: SerialWar): void {
        const teamIndexes = new Set<number>();
        for (const data of warData.getExecutedOperationManager()?.getHalfwayReplayOperationArray() ?? []) {
            teamIndexes.add(data.getTeamIndex());
        }
        this._watcherTeamIndexesForHrw = teamIndexes;
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
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
        if (war instanceof MapEditor_Model_MeWar.MeWar) {
            const maxPlayerIndex    = war.getField().getMaxPlayerIndex();
            const players           : SerialPlayer[] = [];
            for (let playerIndex = Players_Constants.PlayerIndex.Neutral; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push(MapEditor_Model_MeHelpers.createDefaultISerialPlayer(playerIndex));
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
        if (war instanceof MapEditor_Model_MeWar.MeWar) {
            const maxPlayerIndex    = war.getField().getMaxPlayerIndex();
            const players           : SerialPlayer[] = [];
            for (let playerIndex = Players_Constants.PlayerIndex.Neutral; playerIndex <= maxPlayerIndex; ++playerIndex) {
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

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    protected _getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // The other public functions.
    ////////////////////////////////////////////////////////////////////////////////
    public checkHasPlayer(playerIndex: number): boolean {
        return this._players.has(playerIndex);
    }
    public getPlayer(playerIndex: number): Players_IPlayer.IPlayer {
        return Helpers_Misc.getExisted(this._players.get(playerIndex));
    }
    public getAllPlayersDict(): Map<number, Players_IPlayer.IPlayer> {
        return this._players;
    }
    /** 返回结果已按playerIndex排序 */
    public getAllPlayers(includeNeutral = true): Players_IPlayer.IPlayer[] {
        const players: Players_IPlayer.IPlayer[] = [];
        for (const [playerIndex, player] of this.getAllPlayersDict()) {
            if ((includeNeutral) || (playerIndex !== Players_Constants.PlayerIndex.Neutral)) {
                players.push(player);
            }
        }
        return players.sort((v1, v2) => v1.getPlayerIndex() - v2.getPlayerIndex());
    }

    public getPlayerByUserId(userId: number): Players_IPlayer.IPlayer | null {
        for (const [, player] of this._players) {
            if (player.getUserId() === userId) {
                return player;
            }
        }
        return null;
    }

    public getPlayerLoggedIn(): Players_IPlayer.IPlayer | null {
        const userId = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
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

    public getPlayerInTurn(): Players_IPlayer.IPlayer {
        return this.getPlayer(this._getWar().getPlayerIndexInTurn());
    }

    public getHumanPlayers(): Players_IPlayer.IPlayer[] {
        const players: Players_IPlayer.IPlayer[] = [];
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
        for (let playerIndex = Math.max(startingPlayerIndex, includeNeutral ? Players_Constants.PlayerIndex.Neutral : Players_Constants.PlayerIndex.First); playerIndex <= playersCountUnneutral; ++playerIndex) {
            playerIndexList.push(playerIndex);
        }
        for (let playerIndex = includeNeutral ? Players_Constants.PlayerIndex.Neutral : Players_Constants.PlayerIndex.First; playerIndex < startingPlayerIndex; ++playerIndex) {
            playerIndexList.push(playerIndex);
        }

        return playerIndexList;
    }

    public getAlivePlayersCount(includeNeutral: boolean): number {
        let count = 0;
        for (const [playerIndex, player] of this._players) {
            if ((player.getAliveState() !== Players_Constants.AliveStateId.Dead)                          &&
                ((includeNeutral) || (playerIndex !== Players_Constants.PlayerIndex.Neutral))
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
            if (((aliveState === Players_Constants.AliveStateId.Alive) || (aliveState === Players_Constants.AliveStateId.Dying))   &&
                ((includeNeutral) || (playerIndex !== Players_Constants.PlayerIndex.Neutral))
            ) {
                teamIndexes.add(player.getTeamIndex());
            }
        }
        return teamIndexes.size;
    }

    public getAliveTeamIndexes(includeNeutral: boolean, ignoredPlayerIndex?: number): Set<number> {
        const indexes = new Set<number>();
        for (const [playerIndex, player] of this._players) {
            if ((player.getAliveState() !== Players_Constants.AliveStateId.Dead)  &&
                (playerIndex !== ignoredPlayerIndex)                &&
                ((includeNeutral) || (playerIndex !== 0))
            ) {
                const teamIndex = player.getTeamIndex();
                if (teamIndex == null) {
                    throw Helpers_Misc.newError(`BwPlayerManager.getAliveTeamIndexes() empty teamIndex.`);
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

    public forEachPlayer(includeNeutral: boolean, func: (p: Players_IPlayer.IPlayer) => void): void {
        for (const [playerIndex, player] of this._players) {
            ((includeNeutral) || (playerIndex !== 0)) && (func(player));
        }
    }

    public checkHasAliveWatcherTeam(watcherUserId: number): boolean {
        for (const [playerIndex, player] of this._players) {
            if ((playerIndex !== Players_Constants.PlayerIndex.Neutral) &&
                (player.getAliveState() !== Players_Constants.AliveStateId.Dead)
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
        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            return Helpers_Misc.getExisted(this._watcherTeamIndexesForHrw, Utils_ClientErrorCode.ClientErrorCode.HrwPlayerManager_GetAliveWatcherTeamIndexesForSelf_00);

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            return this.getAliveTeamIndexes(false);

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const watcherUserId = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
            const indexes       = new Set<number>();
            this.forEachPlayer(false, player => {
                if ((player.getUserId() === watcherUserId)                  ||
                    (player.getWatchOngoingSrcUserIds().has(watcherUserId))
                ) {
                    indexes.add(player.getTeamIndex());
                }
            });

            return indexes;

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            return this.getAliveTeamIndexes(false);

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
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

        } else if (war instanceof TestWar_Model_TwWar.TwWar) {
            return new Set();

        } else {
            throw Helpers_Misc.newError(`Invalid war.`);
        }
    }
}
