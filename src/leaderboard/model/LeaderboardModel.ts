import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LeaderboardModelLeaderboardProxy from "./LeaderboardProxy.ts";
import type * as ProtoSchemaCommonProtoLeaderboardLbSpmOverall from "../../proto/schema/CommonProto/Leaderboard/LbSpmOverall.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgLbMrwGetRankIndexS from "../../proto/schema/CommonProto/NetMessage/MsgLbMrwGetRankIndex/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetRankInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetTopDataArrayS from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetTopDataArray/S.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

type SpmOverallRankInfo = {
    rankIndex   : number | null;
    score       : number | null;
};

const _spmOverallTopDataArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<string, ProtoSchemaCommonProtoLeaderboardLbSpmOverall.LbSpmOverall>({
    reqData: (configVersion: string) => LeaderboardModelLeaderboardProxy.reqLbSpmOverallGetTopDataArray(configVersion),
});
const _spmOverallRankInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, SpmOverallRankInfo>({
    reqData: (userId: number) => LeaderboardModelLeaderboardProxy.reqLbSpmOverallGetRankInfo(userId),
});
const _mrwStdRankIndexAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, number>({
    reqData: (userId: number) => LeaderboardModelLeaderboardProxy.reqLbMrwGetRankIndex(WarTypesConstants.WarTypeId.MrwStd, 2, userId),
});
const _mrwFogRankIndexAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, number>({
    reqData: (userId: number) => LeaderboardModelLeaderboardProxy.reqLbMrwGetRankIndex(WarTypesConstants.WarTypeId.MrwFog, 2, userId),
});

export function getSpmOverallTopDataArray(configVersion: string): Promise<Undefinable<ProtoSchemaCommonProtoLeaderboardLbSpmOverall.LbSpmOverall>> {
    return _spmOverallTopDataArrayAccessor.getData(configVersion);
}

export function getSpmOverallRankInfo(userId: number): Promise<Undefinable<SpmOverallRankInfo>> {
    return _spmOverallRankInfoAccessor.getData(userId);
}
function setSpmOverallRankInfo(userId: number, data: SpmOverallRankInfo | null): void {
    _spmOverallRankInfoAccessor.setData(userId, data);
}

export function getMrwRankIndex(warType: WarTypesConstants.WarTypeId, userId: number): Promise<Undefinable<number>> {
    if (warType === WarTypesConstants.WarTypeId.MrwStd) {
        return _mrwStdRankIndexAccessor.getData(userId);
    } else if (warType === WarTypesConstants.WarTypeId.MrwFog) {
        return _mrwFogRankIndexAccessor.getData(userId);
    } else {
        throw HelpersMisc.newError(`Invalid warType: ${warType}`);
    }
}

export function updateOnMsgLbMrwGetRankIndex(data: ProtoSchemaCommonProtoNetMessageMsgLbMrwGetRankIndexS.S): void {
    const userId    = HelpersMisc.getExisted(data.getUserId());
    const warType   = data.getWarType();
    const rankIndex = data.getRankIndex() ?? null;
    if (warType === WarTypesConstants.WarTypeId.MrwStd) {
        _mrwStdRankIndexAccessor.setData(userId, rankIndex);
    } else if (warType === WarTypesConstants.WarTypeId.MrwFog) {
        _mrwFogRankIndexAccessor.setData(userId, rankIndex);
    } else {
        throw HelpersMisc.newError(`Invalid warType: ${warType}`);
    }
}
export function updateOnFailedMsgLbMrwGetRankIndex(data: ProtoSchemaCommonProtoNetMessageMsgLbMrwGetRankIndexS.S): void {
    const warType               = data.getWarType();
    const userId                = data.getUserId();
    const playersCountUnneutral = data.getPlayersCountUnneutral();
    if ((warType == null) || (userId == null) || (playersCountUnneutral == null)) {
        return;
    }

    if (playersCountUnneutral === 2) {
        if (warType === WarTypesConstants.WarTypeId.MrwStd) {
            _mrwStdRankIndexAccessor.updateOnRequestFailed(userId);
        } else if (warType === WarTypesConstants.WarTypeId.MrwFog) {
            _mrwFogRankIndexAccessor.updateOnRequestFailed(userId);
        }
    }
}

export function updateOnMsgLbSpmOverallGetTopDataArray(data: ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetTopDataArrayS.S): void {
    _spmOverallTopDataArrayAccessor.setData(HelpersMisc.getExisted(data.getConfigVersion()), data.getLeaderboard() ?? null);
}

export function updateOnMsgLbSpmOverallGetRankInfo(data: ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS.S): void {
    setSpmOverallRankInfo(
        data.getUserId() ?? 0,
        {
            rankIndex   : data.getRankIndex() ?? null,
            score       : data.getScore() ?? null,
        },
    );
}
export function updateOnFailedMsgLbSpmOverallGetRankInfo(data: ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS.S): void {
    const userId = data.getUserId();
    if (userId != null) {
        _spmOverallRankInfoAccessor.updateOnRequestFailed(userId);
    }
}
