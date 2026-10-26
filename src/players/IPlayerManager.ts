import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { GcData } from "../gameConfigs/GcData.ts";
import type { IPlayer } from "./IPlayer.ts";
import type { SerialPlayerManager } from "../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface IPlayerManager {
    getWatcherTeamIndexesForSelf(): Set<number>;

    init(data: Undefinable<SerialPlayerManager>, gameConfig: GcData): void;
    fastInit(data: SerialPlayerManager, gameConfig: GcData): void;
    initWatcherTeamIndexesForHrw(warData: SerialWar): void;

    startRunning(war: IBwWar): void;

    serialize(): SerialPlayerManager;
    serializeForCreateSfw(): SerialPlayerManager;
    serializeForCreateMfr(): SerialPlayerManager;

    ////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////
    checkHasPlayer(playerIndex: number): boolean;
    getPlayer(playerIndex: number): IPlayer;
    getAllPlayersDict(): Map<number, IPlayer>;
    /** 返回结果已按playerIndex排序 */
    getAllPlayers(includeNeutral?: boolean): IPlayer[];

    getPlayerByUserId(userId: number): IPlayer | null;

    getPlayerInTurn(): IPlayer;

    getHumanPlayers(): IPlayer[];

    getPlayerLoggedIn(): IPlayer | null;
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

    forEachPlayer(includeNeutral: boolean, func: (p: IPlayer) => void): void;

    checkHasAliveWatcherTeam(watcherUserId: number): boolean;
}
