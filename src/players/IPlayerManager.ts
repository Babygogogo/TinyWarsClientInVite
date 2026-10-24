import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import type * as PlayersIPlayer from "./IPlayer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayerManager from "../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

type SerialPlayerManager    = ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager;
type GcData                 = GameConfigGcData.GcData;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export interface IPlayerManager {
    getWatcherTeamIndexesForSelf(): Set<number>;

    init(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayerManager>, gameConfig: GcData): void;
    fastInit(data: SerialPlayerManager, gameConfig: GcData): void;
    initWatcherTeamIndexesForHrw(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar): void;

    startRunning(war: IBwWar): void;

    serialize(): SerialPlayerManager;
    serializeForCreateSfw(): SerialPlayerManager;
    serializeForCreateMfr(): SerialPlayerManager;

    ////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////
    checkHasPlayer(playerIndex: number): boolean;
    getPlayer(playerIndex: number): PlayersIPlayer.IPlayer;
    getAllPlayersDict(): Map<number, PlayersIPlayer.IPlayer>;
    /** 返回结果已按playerIndex排序 */
    getAllPlayers(includeNeutral?: boolean): PlayersIPlayer.IPlayer[];

    getPlayerByUserId(userId: number): PlayersIPlayer.IPlayer | null;

    getPlayerInTurn(): PlayersIPlayer.IPlayer;

    getHumanPlayers(): PlayersIPlayer.IPlayer[];

    getPlayerLoggedIn(): PlayersIPlayer.IPlayer | null;
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

    forEachPlayer(includeNeutral: boolean, func: (p: PlayersIPlayer.IPlayer) => void): void;

    checkHasAliveWatcherTeam(watcherUserId: number): boolean;
}
