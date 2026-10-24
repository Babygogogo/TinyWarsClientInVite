import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "./IBwWar.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsInfo from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/Info.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager from "../../proto/schema/CommonProto/WarSerialization/SerialWarStatisticsManager.ts";
import type * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

type SerialWarStatisticsManager = ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager;
type UnitStatistics             = ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics;

export interface IBwWarStatisticsManager {
    init({ data, playersCountUnneutral, currentTurnIndex, gameConfiguration }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialWarStatisticsManager>;
        playersCountUnneutral   : number;
        currentTurnIndex        : number;
        gameConfiguration       : GameConfigGcData.GcData;
    }): void;
    fastInit(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialWarStatisticsManager>): void;
    startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void;

    serialize(): SerialWarStatisticsManager;
    serializeForCreateSfw(): SerialWarStatisticsManager;
    serializeForCreateMfr(): SerialWarStatisticsManager;

    getUnitStatisticsArray(): UnitStatistics[];
    getUnitStatisticsInfoArrayForFullReplay(): ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsInfo.Info[];
    addUnitStatistics(data: UnitStatistics): void;

    tickPlayerManualActionsCount(turnIndex: number, playerIndex: number): void;
    getManualActionsCount(turnIndex: number, playerIndex: number): number;
    getManualActionsCountForPlayerInTurn(): number;
    getManualActionsCountForPlayersInRecentTurns(playerIndexSet: Set<number>, recentTurnsCount: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): number;
}
