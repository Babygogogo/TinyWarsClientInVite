import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as MapEditorModelMeHelpers from "../mapEditor/model/MeHelpers.ts";
import * as PlayersConstants from "./Constants.ts";
import type * as PlayersIPlayer from "./IPlayer.ts";
import type * as PlayersIPlayerManager from "./IPlayerManager.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayer from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialPlayerManager from "../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as UsersModel from "../users/Model.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export class PlayerManager implements PlayersIPlayerManager.IPlayerManager {
    private _players                    = new Map<number, PlayersIPlayer.IPlayer>();
    private _war?                       : IBwWar;
    private _watcherTeamIndexesForHrw?  : Set<number>;

    public init(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager>, gameConfig: GameConfigGcData.GcData): void {
        if (data == null) {
            throw HelpersMisc.newError(`Empty data.`, UtilsClientErrorCode.ClientErrorCode.BwPlayerManager_Init_00);
        }

        const playerArray = data.getPlayers();
        if ((!playerArray)                                              ||
            (playerArray.length < 3)                                    ||
            (playerArray.length > PlayersConstants.PlayerIndex.Max + 1)
        ) {
            throw HelpersMisc.newError(`Invalid playerArray.`, UtilsClientErrorCode.ClientErrorCode.BwPlayerManager_Init_01);
        }

        const newPlayerMap  = new Map<number, PlayersIPlayer.IPlayer>();
        const skinIdSet     = new Set<number>();
        for (const playerData of playerArray) {
            const playerIndex = playerData.getPlayerIndex();
            if (newPlayerMap.has(playerIndex)) {
                throw HelpersMisc.newError(`Invalid playerIndex: ${playerIndex}`, UtilsClientErrorCode.ClientErrorCode.BwPlayerManager_Init_02);
            }

            const skinId = playerData.getUnitAndTileSkinId();
            if (skinIdSet.has(skinId)) {
                throw HelpersMisc.newError(`Invalid skinId: ${skinId}`, UtilsClientErrorCode.ClientErrorCode.BwPlayerManager_Init_03);
            }
            skinIdSet.add(skinId);

            const player = new (GameHelpersGhFactory.getPlayerClass())();
            player.init(playerData, gameConfig);

            newPlayerMap.set(playerIndex, player);
        }

        if (!newPlayerMap.has(PlayersConstants.PlayerIndex.Neutral)) {
            throw HelpersMisc.newError(`No WarNeutralPlayerIndex.`, UtilsClientErrorCode.ClientErrorCode.BwPlayerManager_Init_04);
        }

        for (const [playerIndex] of newPlayerMap) {
            if ((playerIndex > PlayersConstants.PlayerIndex.Neutral) && (!newPlayerMap.has(playerIndex - 1))) {
                throw HelpersMisc.newError(`Non-continuous`, UtilsClientErrorCode.ClientErrorCode.BwPlayerManager_Init_05);
            }
        }

        if ((newPlayerMap.size < 3) || (newPlayerMap.size > PlayersConstants.PlayerIndex.Max + 1)) {
            throw HelpersMisc.newError(`Invalid playersCount: ${newPlayerMap.size}`, UtilsClientErrorCode.ClientErrorCode.BwPlayerManager_Init_06);
        }

        const playerMap = this.getAllPlayersDict();
        playerMap.clear();
        for (const [playerIndex, player] of newPlayerMap) {
            playerMap.set(playerIndex, player);
        }
    }
    public fastInit(data: ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager, gameConfig: GameConfigGcData.GcData): void {
        for (const playerData of data ? data.getPlayers() : []) {
            const playerIndex   = playerData.getPlayerIndex();
            const player        = HelpersMisc.getExisted(this.getPlayer(playerIndex), UtilsClientErrorCode.ClientErrorCode.BwPlayerManager_FastInit_01);
            player.init(playerData, gameConfig);
        }
    }
    public initWatcherTeamIndexesForHrw(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar): void {
        const teamIndexes = new Set<number>();
        for (const data of warData.getExecutedOperationManager()?.getHalfwayReplayOperationArray() ?? []) {
            teamIndexes.add(HelpersMisc.getExisted(data.getTeamIndex(), UtilsClientErrorCode.ClientErrorCode.HrwPlayerManager_InitWatcherTeamIndexes_00));
        }
        this._watcherTeamIndexesForHrw = teamIndexes;
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
        for (const [, player] of this._players) {
            player.startRunning(war);
        }
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager {
        const players: ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[] = [];
        for (const [, player] of this.getAllPlayersDict()) {
            players.push(player.serialize());
        }

        return ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager.fromJson({
            players : players.map(v => v.toJson()),
        });
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager {
        const war = this._getWar();
        if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            const maxPlayerIndex    = war.getField().getMaxPlayerIndex();
            const players           : ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[] = [];
            for (let playerIndex = PlayersConstants.PlayerIndex.Neutral; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push(MapEditorModelMeHelpers.createDefaultISerialPlayer(playerIndex));
            }

            return ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager.fromJson({
                players : players.map(v => v.toJson()),
            });

        } else {
            const players: ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[] = [];
            for (const [, player] of this.getAllPlayersDict()) {
                players.push(player.serializeForCreateSfw());
            }

            return ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager.fromJson({
                players : players.map(v => v.toJson()),
            });
        }
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager {
        const war = this._getWar();
        if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            const maxPlayerIndex    = war.getField().getMaxPlayerIndex();
            const players           : ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[] = [];
            for (let playerIndex = PlayersConstants.PlayerIndex.Neutral; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push(this.getPlayer(playerIndex).serializeForCreateMfr());
            }

            return ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager.fromJson({
                players : players.map(v => v.toJson()),
            });

        } else {
            const players: ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[] = [];
            for (const [, player] of this.getAllPlayersDict()) {
                players.push(player.serializeForCreateMfr());
            }

            return ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager.fromJson({
                players : players.map(v => v.toJson()),
            });
        }
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    protected _getWar(): IBwWar {
        return HelpersMisc.getExisted(this._war);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // The other public functions.
    ////////////////////////////////////////////////////////////////////////////////
    public checkHasPlayer(playerIndex: number): boolean {
        return this._players.has(playerIndex);
    }
    public getPlayer(playerIndex: number): PlayersIPlayer.IPlayer {
        return HelpersMisc.getExisted(this._players.get(playerIndex));
    }
    public getAllPlayersDict(): Map<number, PlayersIPlayer.IPlayer> {
        return this._players;
    }
    /** 返回结果已按playerIndex排序 */
    public getAllPlayers(includeNeutral = true): PlayersIPlayer.IPlayer[] {
        const players: PlayersIPlayer.IPlayer[] = [];
        for (const [playerIndex, player] of this.getAllPlayersDict()) {
            if ((includeNeutral) || (playerIndex !== PlayersConstants.PlayerIndex.Neutral)) {
                players.push(player);
            }
        }
        return players.sort((v1, v2) => v1.getPlayerIndex() - v2.getPlayerIndex());
    }

    public getPlayerByUserId(userId: number): PlayersIPlayer.IPlayer | null {
        for (const [, player] of this._players) {
            if (player.getUserId() === userId) {
                return player;
            }
        }
        return null;
    }

    public getPlayerLoggedIn(): PlayersIPlayer.IPlayer | null {
        const userId = HelpersMisc.getExisted(UsersModel.getSelfUserId());
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

    public getPlayerInTurn(): PlayersIPlayer.IPlayer {
        return this.getPlayer(this._getWar().getPlayerIndexInTurn());
    }

    public getHumanPlayers(): PlayersIPlayer.IPlayer[] {
        const players: PlayersIPlayer.IPlayer[] = [];
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
        for (let playerIndex = Math.max(startingPlayerIndex, includeNeutral ? PlayersConstants.PlayerIndex.Neutral : PlayersConstants.PlayerIndex.First); playerIndex <= playersCountUnneutral; ++playerIndex) {
            playerIndexList.push(playerIndex);
        }
        for (let playerIndex = includeNeutral ? PlayersConstants.PlayerIndex.Neutral : PlayersConstants.PlayerIndex.First; playerIndex < startingPlayerIndex; ++playerIndex) {
            playerIndexList.push(playerIndex);
        }

        return playerIndexList;
    }

    public getAlivePlayersCount(includeNeutral: boolean): number {
        let count = 0;
        for (const [playerIndex, player] of this._players) {
            if ((player.getAliveState() !== PlayersConstants.AliveStateId.Dead)                          &&
                ((includeNeutral) || (playerIndex !== PlayersConstants.PlayerIndex.Neutral))
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
            if (((aliveState === PlayersConstants.AliveStateId.Alive) || (aliveState === PlayersConstants.AliveStateId.Dying))   &&
                ((includeNeutral) || (playerIndex !== PlayersConstants.PlayerIndex.Neutral))
            ) {
                teamIndexes.add(player.getTeamIndex());
            }
        }
        return teamIndexes.size;
    }

    public getAliveTeamIndexes(includeNeutral: boolean, ignoredPlayerIndex?: number): Set<number> {
        const indexes = new Set<number>();
        for (const [playerIndex, player] of this._players) {
            if ((player.getAliveState() !== PlayersConstants.AliveStateId.Dead)  &&
                (playerIndex !== ignoredPlayerIndex)                &&
                ((includeNeutral) || (playerIndex !== 0))
            ) {
                const teamIndex = player.getTeamIndex();
                if (teamIndex == null) {
                    throw HelpersMisc.newError(`BwPlayerManager.getAliveTeamIndexes() empty teamIndex.`);
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

    public forEachPlayer(includeNeutral: boolean, func: (p: PlayersIPlayer.IPlayer) => void): void {
        for (const [playerIndex, player] of this._players) {
            ((includeNeutral) || (playerIndex !== 0)) && (func(player));
        }
    }

    public checkHasAliveWatcherTeam(watcherUserId: number): boolean {
        for (const [playerIndex, player] of this._players) {
            if ((playerIndex !== PlayersConstants.PlayerIndex.Neutral) &&
                (player.getAliveState() !== PlayersConstants.AliveStateId.Dead)
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
        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            return HelpersMisc.getExisted(this._watcherTeamIndexesForHrw, UtilsClientErrorCode.ClientErrorCode.HrwPlayerManager_GetAliveWatcherTeamIndexesForSelf_00);

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            return this.getAliveTeamIndexes(false);

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const watcherUserId = HelpersMisc.getExisted(UsersModel.getSelfUserId());
            const indexes       = new Set<number>();
            this.forEachPlayer(false, player => {
                if ((player.getUserId() === watcherUserId)                  ||
                    (player.getWatchOngoingSrcUserIds().has(watcherUserId))
                ) {
                    indexes.add(player.getTeamIndex());
                }
            });

            return indexes;

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            return this.getAliveTeamIndexes(false);

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
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

        } else if (war instanceof GameHelpersGhFactory.getTwWarClass()) {
            return new Set();

        } else {
            throw HelpersMisc.newError(`Invalid war.`);
        }
    }
}
