import {
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { Info } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/Info.ts";
import type { SerialWarStatisticsManager } from "../../proto/schema/CommonProto/WarSerialization/SerialWarStatisticsManager.ts";
import type { WsUnitStatistics } from "../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export interface IBwWarStatisticsManager {
    init({ data, playersCountUnneutral, currentTurnIndex, gameConfiguration }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWarStatisticsManager>;
        playersCountUnneutral   : number;
        currentTurnIndex        : number;
        gameConfiguration       : GameConfigs_GameConfig.GameConfig;
    }): void;
    fastInit(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWarStatisticsManager>): void;
    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;

    serialize(): SerialWarStatisticsManager;
    serializeForCreateSfw(): SerialWarStatisticsManager;
    serializeForCreateMfr(): SerialWarStatisticsManager;

    getUnitStatisticsArray(): WsUnitStatistics[];
    getUnitStatisticsInfoArrayForFullReplay(): Info[];
    addUnitStatistics(data: WsUnitStatistics): void;

    tickPlayerManualActionsCount(turnIndex: number, playerIndex: number): void;
    getManualActionsCount(turnIndex: number, playerIndex: number): number;
    getManualActionsCountForPlayerInTurn(): number;
    getManualActionsCountForPlayersInRecentTurns(playerIndexSet: Set<number>, recentTurnsCount: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): number;
}
