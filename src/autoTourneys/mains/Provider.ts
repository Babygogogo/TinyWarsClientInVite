import {
    AuxiliaryTypes_CachedDataAccessor,
    LocalData_Storage,
    AutoTourneys_Constants,
    AutoTourneys_Mains_Gateway,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { FullBracketInfo } from "../../proto/schema/CommonProto/AutoTourney/FullBracketInfo.ts";
import type { FullMapInfo } from "../../proto/schema/CommonProto/AutoTourney/FullMapInfo.ts";
import type { SinglePhaseInfo } from "../../proto/schema/CommonProto/AutoTourney/SinglePhaseInfo.ts";
import type { TourneyInfo } from "../../proto/schema/CommonProto/AutoTourney/TourneyInfo.ts";
import type { S as AtGetGlobalSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetGlobalSettings/S.ts";
import type { S as AtGetPhaseInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetPhaseInfo/S.ts";
import type { S as AtGetRegistrationInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetRegistrationInfo/S.ts";
import type { S as AtSetBootTimerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetBootTimer/S.ts";
import type { S as AtSetNameResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetName/S.ts";

type GlobalSettings = {
    isEnabled               : boolean;
    interval                : number;
    lastCreateTimestamp     : number;
};
type PhaseInfo = {
    infoArray   : SinglePhaseInfo[];
};
type RegistrationInfo = {
    tourneyId       : number;
    isRegistered    : boolean;
    playersCount    : number;
    endTimestamp    : number;
};

const _globalSettingsAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, GlobalSettings>({
    reqData : () => AutoTourneys_Mains_Gateway.reqAtGetGlobalSettings(),
});
const _phaseInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, PhaseInfo>({
    reqData : () => AutoTourneys_Mains_Gateway.reqAtGetPhaseInfo(),
});
const _registrationInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, RegistrationInfo>({
    reqData : tourneyId => AutoTourneys_Mains_Gateway.reqAtGetRegistrationInfo(tourneyId),
});
const _tourneyInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, TourneyInfo>({
    reqData : tourneyId => AutoTourneys_Mains_Gateway.reqAtGetTourneyInfo(tourneyId),
});
const _fullMapInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, FullMapInfo>({
    reqData : tourneyId => AutoTourneys_Mains_Gateway.reqAtGetFullMapInfo(tourneyId),
});
const _fullBracketInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, FullBracketInfo>({
    reqData : tourneyId => AutoTourneys_Mains_Gateway.reqAtGetFullBracketInfo(tourneyId),
});
const _userArrayAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, number[]>({
    reqData        : tourneyId => AutoTourneys_Mains_Gateway.reqAtGetUserArray(tourneyId),
    dataExpireTime : 30,
});

export function getGlobalSettings(): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<GlobalSettings>> {
    return _globalSettingsAccessor.getData(null);
}

export function getAtPhaseInfo(): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<PhaseInfo>> {
    return _phaseInfoAccessor.getData(null);
}
export async function getSinglePhaseInfoArrayForPhase(phase: number): Promise<SinglePhaseInfo[]> {
    return (await getAtPhaseInfo())?.infoArray.filter(v => (v.getPhase()) === phase) ?? [];
}
export async function getAllTourneyIdArray(): Promise<number[]> {
    const phaseInfo = await getAtPhaseInfo();
    return phaseInfo?.infoArray.map(v => v.getTourneyId()) ?? [];
}
export async function getLastTourneyId(): Promise<number | null> {
    const tourneyIdArray = await getAllTourneyIdArray();
    return tourneyIdArray.length > 1
        ? Math.max(...tourneyIdArray)
        : (tourneyIdArray[0] ?? null);
}

export function getAtRegistrationInfo(tourneyId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<RegistrationInfo>> {
    return _registrationInfoAccessor.getData(tourneyId);
}

export function getAtTourneyInfo(tourneyId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<TourneyInfo>> {
    return _tourneyInfoAccessor.getData(tourneyId);
}
export function setAtTourneyInfo(tourneyId: number, info: TourneyInfo | null): void {
    _tourneyInfoAccessor.setData(tourneyId, info);
}

export function getAtFullMapInfo(tourneyId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<FullMapInfo>> {
    return _fullMapInfoAccessor.getData(tourneyId);
}
export function setAtFullMapInfo(tourneyId: number, info: FullMapInfo | null): void {
    _fullMapInfoAccessor.setData(tourneyId, info);
}

export function getAtFullBracketInfo(tourneyId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<FullBracketInfo>> {
    return _fullBracketInfoAccessor.getData(tourneyId);
}
export function setAtFullBracketInfo(tourneyId: number, info: FullBracketInfo | null): void {
    _fullBracketInfoAccessor.setData(tourneyId, info);
}

export function getAtUserArray(tourneyId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>> {
    return _userArrayAccessor.getData(tourneyId);
}
export function setAtUserArray(tourneyId: number, userIdArray: number[] | null): void {
    _userArrayAccessor.setData(tourneyId, userIdArray);
}

export function getIsNotifiedForRegistration(tourneyId: number): boolean {
    return LocalData_Storage.getIsAutoTourneyNotified(tourneyId);
}
export function setIsNotifiedForRegistration(tourneyId: number, isNotified: boolean): void {
    LocalData_Storage.setIsAutoTourneyNotified(tourneyId, isNotified);
}

export function updateOnMsgAtGetGlobalSettings(msg: AtGetGlobalSettingsResponse): void {
    const globalSettings = msg.getGlobalSettings();
    _globalSettingsAccessor.setData(null, {
        isEnabled           : !!globalSettings?.getIsEnabled(),
        interval            : globalSettings?.getInterval() ?? 0,
        lastCreateTimestamp : msg.getLastCreateTimestamp() ?? 0,
    });
}
export async function updateOnMsgAtSetName(msg: AtSetNameResponse): Promise<void> {
    const tourneyInfo = await getAtTourneyInfo(msg.getTourneyId() ?? 0);
    if (tourneyInfo) {
        tourneyInfo.setNameArray(msg.getNameArray());
    }
}
export async function updateOnMsgAtSetBootTimer(msg: AtSetBootTimerResponse): Promise<void> {
    const tourneyInfo = await getAtTourneyInfo(msg.getTourneyId() ?? 0);
    if (tourneyInfo) {
        tourneyInfo.setBootTimerParams(msg.getBootTimerParams());
    }
}
export function updateOnMsgAtGetPhaseInfo(msg: AtGetPhaseInfoResponse): void {
    _phaseInfoAccessor.setData(null, {
        infoArray : msg.getSinglePhaseInfoArray(),
    });
}
export function updateOnMsgAtGetRegistrationInfo(msg: AtGetRegistrationInfoResponse): void {
    const tourneyId = msg.getTourneyId() ?? 0;
    _registrationInfoAccessor.setData(tourneyId, {
        isRegistered : !!msg.getIsRegistered(),
        tourneyId    : tourneyId,
        playersCount : msg.getPlayersCount() ?? 0,
        endTimestamp : msg.getEndTimestamp() ?? 0,
    });
}

export function checkHasFog(tourneyId: number): boolean {
    return tourneyId % 2 == 1;
}

export function getTourneyInfoPhase(tourneyInfo: TourneyInfo): number {
    if (tourneyInfo.getEndTimestamp() != null) {
        return AutoTourneys_Constants.PhaseId.End;
    } else if (tourneyInfo.getBattleTimestamp() != null) {
        return AutoTourneys_Constants.PhaseId.Battle;
    } else if (tourneyInfo.getAdjustmentTimestamp() != null) {
        return AutoTourneys_Constants.PhaseId.Adjustment;
    } else {
        return AutoTourneys_Constants.PhaseId.Registration;
    }
}

export async function checkIsRedForRegistration(): Promise<boolean> {
    const tourneyIdArray = (await getAtPhaseInfo())?.infoArray.filter(v => v.getPhase() === AutoTourneys_Constants.PhaseId.Registration).map(v => v.getTourneyId()) ?? [];
    return tourneyIdArray.some(v => !getIsNotifiedForRegistration(v));
}
