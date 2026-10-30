import {
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { SerialPlayerManager } from "../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface IPlayerManager {
    getWatcherTeamIndexesForSelf(): Set<number>;

    init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayerManager>, gameConfig: GameConfigs_GameConfig.GameConfig): void;
    fastInit(data: SerialPlayerManager, gameConfig: GameConfigs_GameConfig.GameConfig): void;
    initWatcherTeamIndexesForHrw(warData: SerialWar): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;

    serialize(): SerialPlayerManager;
    serializeForCreateSfw(): SerialPlayerManager;
    serializeForCreateMfr(): SerialPlayerManager;

    ////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////
    checkHasPlayer(playerIndex: number): boolean;
    getPlayer(playerIndex: number): Players_IPlayer.IPlayer;
    getAllPlayersDict(): Map<number, Players_IPlayer.IPlayer>;
    /** 返回结果已按playerIndex排序 */
    getAllPlayers(includeNeutral?: boolean): Players_IPlayer.IPlayer[];

    getPlayerByUserId(userId: number): Players_IPlayer.IPlayer | null;

    getPlayerInTurn(): Players_IPlayer.IPlayer;

    getHumanPlayers(): Players_IPlayer.IPlayer[];

    getPlayerLoggedIn(): Players_IPlayer.IPlayer | null;
    getPlayerIndexLoggedIn(): number | null;

    getTeamIndex(playerIndex: number): number;
    getTeamIndexSet(playerIndexArray: number[]): Set<number>;
    getAllTeamIndexSet(): Set<number>;

    getPlayerIndexesInTeam(teamIndex: number): number[];
    getPlayerIndexesInTeams(teamIndexes: Set<number>): Set<number>;

    getTotalPlayersCount(includeNeutral: boolean): number;
    getPlayerIndexArray(startingPlayerIndex: number, includeNeutral: boolean): number[];

    getAlivePlayersCount(includeNeutral: boolean): number;

    getAliveOrDyingTeamsCount(includeNeutral: boolean): number;

    getAliveTeamIndexes(includeNeutral: boolean, ignoredPlayerIndex?: number): Set<number>;

    checkIsSameTeam(playerIndex1: number, playerIndex2: number): boolean;

    forEachPlayer(includeNeutral: boolean, func: (p: Players_IPlayer.IPlayer) => void): void;

    checkHasAliveWatcherTeam(watcherUserId: number): boolean;
}
