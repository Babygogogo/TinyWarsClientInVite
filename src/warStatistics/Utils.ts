import type { WsUnitStatistics } from "../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkCanMerge(data1: WsUnitStatistics, data2: WsUnitStatistics): boolean {
    return ((data1.getUnitType()) === (data2.getUnitType()))
        && ((data1.getDstPlayerIndex()) === (data2.getDstPlayerIndex()))
        && ((data1.getGroupedObserverTeamIndexes()) === (data2.getGroupedObserverTeamIndexes()));
}
export function checkAndMergeTo(src: WsUnitStatistics, dst: WsUnitStatistics): boolean {
    if (!checkCanMerge(src, dst)) {
        return false;
    }

    dst.setUnitGain((dst.getUnitGain()) + (src.getUnitGain()));
    dst.setUnitLoss((dst.getUnitLoss()) + (src.getUnitLoss()));
    dst.setNormalizedHpGain((dst.getNormalizedHpGain()) + (src.getNormalizedHpGain()));
    dst.setNormalizedHpLoss((dst.getNormalizedHpLoss()) + (src.getNormalizedHpLoss()));

    return true;
}
