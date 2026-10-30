import {
    AuxiliaryTypes_CachedDataAccessor,
    Helpers_Misc,
    Leaderboard_Model_LeaderboardProxy,
    WarTypes_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { LbSpmOverall } from "../../proto/schema/CommonProto/Leaderboard/LbSpmOverall.ts";
import type { S as LbMrwGetRankIndexResponse } from "../../proto/schema/CommonProto/NetMessage/MsgLbMrwGetRankIndex/S.ts";
import type { S as LbSpmOverallGetRankInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetRankInfo/S.ts";
import type { S as LbSpmOverallGetTopDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetTopDataArray/S.ts";

type SpmOverallRankInfo = {
    rankIndex   : number | null;
    score       : number | null;
};

const _spmOverallTopDataArrayAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<string, LbSpmOverall>({
    reqData : (configVersion: string) => Leaderboard_Model_LeaderboardProxy.reqLbSpmOverallGetTopDataArray(configVersion),
});
const _spmOverallRankInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, SpmOverallRankInfo>({
    reqData : (userId: number) => Leaderboard_Model_LeaderboardProxy.reqLbSpmOverallGetRankInfo(userId),
});
const _mrwStdRankIndexAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, number>({
    reqData : (userId: number) => Leaderboard_Model_LeaderboardProxy.reqLbMrwGetRankIndex(WarTypes_Constants.WarTypeId.MrwStd, 2, userId),
});
const _mrwFogRankIndexAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, number>({
    reqData : (userId: number) => Leaderboard_Model_LeaderboardProxy.reqLbMrwGetRankIndex(WarTypes_Constants.WarTypeId.MrwFog, 2, userId),
});

export function getSpmOverallTopDataArray(configVersion: string): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<LbSpmOverall>> {
    return _spmOverallTopDataArrayAccessor.getData(configVersion);
}

export function getSpmOverallRankInfo(userId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<SpmOverallRankInfo>> {
    return _spmOverallRankInfoAccessor.getData(userId);
}
function setSpmOverallRankInfo(userId: number, data: SpmOverallRankInfo | null): void {
    _spmOverallRankInfoAccessor.setData(userId, data);
}

export function getMrwRankIndex(warType: WarTypes_Constants.WarTypeId, userId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>> {
    if (warType === WarTypes_Constants.WarTypeId.MrwStd) {
        return _mrwStdRankIndexAccessor.getData(userId);
    } else if (warType === WarTypes_Constants.WarTypeId.MrwFog) {
        return _mrwFogRankIndexAccessor.getData(userId);
    } else {
        throw Helpers_Misc.newError(`Invalid warType: ${warType}`);
    }
}

export function updateOnMsgLbMrwGetRankIndex(data: LbMrwGetRankIndexResponse): void {
    const userId    = Helpers_Misc.getExisted(data.getUserId());
    const warType   = data.getWarType();
    const rankIndex = data.getRankIndex() ?? null;
    if (warType === WarTypes_Constants.WarTypeId.MrwStd) {
        _mrwStdRankIndexAccessor.setData(userId, rankIndex);
    } else if (warType === WarTypes_Constants.WarTypeId.MrwFog) {
        _mrwFogRankIndexAccessor.setData(userId, rankIndex);
    } else {
        throw Helpers_Misc.newError(`Invalid warType: ${warType}`);
    }
}
export function updateOnFailedMsgLbMrwGetRankIndex(data: LbMrwGetRankIndexResponse): void {
    const warType               = data.getWarType();
    const userId                = data.getUserId();
    const playersCountUnneutral = data.getPlayersCountUnneutral();
    if ((warType == null) || (userId == null) || (playersCountUnneutral == null)) {
        return;
    }

    if (playersCountUnneutral === 2) {
        if (warType === WarTypes_Constants.WarTypeId.MrwStd) {
            _mrwStdRankIndexAccessor.updateOnRequestFailed(userId);
        } else if (warType === WarTypes_Constants.WarTypeId.MrwFog) {
            _mrwFogRankIndexAccessor.updateOnRequestFailed(userId);
        }
    }
}

export function updateOnMsgLbSpmOverallGetTopDataArray(data: LbSpmOverallGetTopDataArrayResponse): void {
    _spmOverallTopDataArrayAccessor.setData(Helpers_Misc.getExisted(data.getConfigVersion()), data.getLeaderboard() ?? null);
}

export function updateOnMsgLbSpmOverallGetRankInfo(data: LbSpmOverallGetRankInfoResponse): void {
    setSpmOverallRankInfo(
        data.getUserId() ?? 0,
        {
            rankIndex : data.getRankIndex() ?? null,
            score     : data.getScore() ?? null,
        },
    );
}
export function updateOnFailedMsgLbSpmOverallGetRankInfo(data: LbSpmOverallGetRankInfoResponse): void {
    const userId = data.getUserId();
    if (userId != null) {
        _spmOverallRankInfoAccessor.updateOnRequestFailed(userId);
    }
}
