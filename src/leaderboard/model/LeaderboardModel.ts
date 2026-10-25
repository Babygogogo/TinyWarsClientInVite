import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import { newError, getExisted } from "../../helpers/Misc.ts";
import { reqLbSpmOverallGetTopDataArray, reqLbSpmOverallGetRankInfo, reqLbMrwGetRankIndex } from "./LeaderboardProxy.ts";
import type { LbSpmOverall } from "../../proto/schema/CommonProto/Leaderboard/LbSpmOverall.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgLbMrwGetRankIndex/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetRankInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetTopDataArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetTopDataArray/S.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

type SpmOverallRankInfo = {
    rankIndex   : number | null;
    score       : number | null;
};

const _spmOverallTopDataArrayAccessor = new CachedDataAccessor<string, LbSpmOverall>({
    reqData: (configVersion: string) => reqLbSpmOverallGetTopDataArray(configVersion),
});
const _spmOverallRankInfoAccessor = new CachedDataAccessor<number, SpmOverallRankInfo>({
    reqData: (userId: number) => reqLbSpmOverallGetRankInfo(userId),
});
const _mrwStdRankIndexAccessor = new CachedDataAccessor<number, number>({
    reqData: (userId: number) => reqLbMrwGetRankIndex(WarTypeId.MrwStd, 2, userId),
});
const _mrwFogRankIndexAccessor = new CachedDataAccessor<number, number>({
    reqData: (userId: number) => reqLbMrwGetRankIndex(WarTypeId.MrwFog, 2, userId),
});

export function getSpmOverallTopDataArray(configVersion: string): Promise<Undefinable<LbSpmOverall>> {
    return _spmOverallTopDataArrayAccessor.getData(configVersion);
}

export function getSpmOverallRankInfo(userId: number): Promise<Undefinable<SpmOverallRankInfo>> {
    return _spmOverallRankInfoAccessor.getData(userId);
}
function setSpmOverallRankInfo(userId: number, data: SpmOverallRankInfo | null): void {
    _spmOverallRankInfoAccessor.setData(userId, data);
}

export function getMrwRankIndex(warType: WarTypeId, userId: number): Promise<Undefinable<number>> {
    if (warType === WarTypeId.MrwStd) {
        return _mrwStdRankIndexAccessor.getData(userId);
    } else if (warType === WarTypeId.MrwFog) {
        return _mrwFogRankIndexAccessor.getData(userId);
    } else {
        throw newError(`Invalid warType: ${warType}`);
    }
}

export function updateOnMsgLbMrwGetRankIndex(data: S): void {
    const userId    = getExisted(data.getUserId());
    const warType   = data.getWarType();
    const rankIndex = data.getRankIndex() ?? null;
    if (warType === WarTypeId.MrwStd) {
        _mrwStdRankIndexAccessor.setData(userId, rankIndex);
    } else if (warType === WarTypeId.MrwFog) {
        _mrwFogRankIndexAccessor.setData(userId, rankIndex);
    } else {
        throw newError(`Invalid warType: ${warType}`);
    }
}
export function updateOnFailedMsgLbMrwGetRankIndex(data: S): void {
    const warType               = data.getWarType();
    const userId                = data.getUserId();
    const playersCountUnneutral = data.getPlayersCountUnneutral();
    if ((warType == null) || (userId == null) || (playersCountUnneutral == null)) {
        return;
    }

    if (playersCountUnneutral === 2) {
        if (warType === WarTypeId.MrwStd) {
            _mrwStdRankIndexAccessor.updateOnRequestFailed(userId);
        } else if (warType === WarTypeId.MrwFog) {
            _mrwFogRankIndexAccessor.updateOnRequestFailed(userId);
        }
    }
}

export function updateOnMsgLbSpmOverallGetTopDataArray(data: ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetTopDataArrayS): void {
    _spmOverallTopDataArrayAccessor.setData(getExisted(data.getConfigVersion()), data.getLeaderboard() ?? null);
}

export function updateOnMsgLbSpmOverallGetRankInfo(data: ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS): void {
    setSpmOverallRankInfo(
        data.getUserId() ?? 0,
        {
            rankIndex   : data.getRankIndex() ?? null,
            score       : data.getScore() ?? null,
        },
    );
}
export function updateOnFailedMsgLbSpmOverallGetRankInfo(data: ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS): void {
    const userId = data.getUserId();
    if (userId != null) {
        _spmOverallRankInfoAccessor.updateOnRequestFailed(userId);
    }
}
