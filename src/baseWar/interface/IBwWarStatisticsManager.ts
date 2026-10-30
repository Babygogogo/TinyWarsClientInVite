import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "./IBwWar.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import type { Info } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/Info.ts";
import type { SerialWarStatisticsManager } from "../../proto/schema/CommonProto/WarSerialization/SerialWarStatisticsManager.ts";
import type { WsUnitStatistics } from "../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export interface IBwWarStatisticsManager {
    init({ data, playersCountUnneutral, currentTurnIndex, gameConfiguration }: {
        data                    : Undefinable<SerialWarStatisticsManager>;
        playersCountUnneutral   : number;
        currentTurnIndex        : number;
        gameConfiguration       : GameConfig;
    }): void;
    fastInit(data: Undefinable<SerialWarStatisticsManager>): void;
    startRunning(war: IBwWar): void;

    serialize(): SerialWarStatisticsManager;
    serializeForCreateSfw(): SerialWarStatisticsManager;
    serializeForCreateMfr(): SerialWarStatisticsManager;

    getUnitStatisticsArray(): WsUnitStatistics[];
    getUnitStatisticsInfoArrayForFullReplay(): Info[];
    addUnitStatistics(data: WsUnitStatistics): void;

    tickPlayerManualActionsCount(turnIndex: number, playerIndex: number): void;
    getManualActionsCount(turnIndex: number, playerIndex: number): number;
    getManualActionsCountForPlayerInTurn(): number;
    getManualActionsCountForPlayersInRecentTurns(playerIndexSet: Set<number>, recentTurnsCount: Undefinable<number>): number;
}
