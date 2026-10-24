import type * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

type WsUnitStatistics  = ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics;

export function checkCanMerge(data1: WsUnitStatistics, data2: WsUnitStatistics): boolean {
    return ((data1.getUnitType() ?? 0) === (data2.getUnitType() ?? 0))
        && ((data1.getDstPlayerIndex() ?? 0) === (data2.getDstPlayerIndex() ?? 0))
        && ((data1.getGroupedObserverTeamIndexes() ?? 0) === (data2.getGroupedObserverTeamIndexes() ?? 0));
}
export function checkAndMergeTo(src: WsUnitStatistics, dst: WsUnitStatistics): boolean {
    if (!checkCanMerge(src, dst)) {
        return false;
    }

    dst.setUnitGain((dst.getUnitGain() ?? 0) + (src.getUnitGain() ?? 0));
    dst.setUnitLoss((dst.getUnitLoss() ?? 0) + (src.getUnitLoss() ?? 0));
    dst.setNormalizedHpGain((dst.getNormalizedHpGain() ?? 0) + (src.getNormalizedHpGain() ?? 0));
    dst.setNormalizedHpLoss((dst.getNormalizedHpLoss() ?? 0) + (src.getNormalizedHpLoss() ?? 0));

    return true;
}
