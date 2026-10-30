import { PhaseId } from "../Constants.ts";
import {
    reqAtGetGlobalSettings,
    reqAtGetPhaseInfo,
    reqAtGetRegistrationInfo,
    reqAtGetTourneyInfo,
    reqAtGetFullMapInfo,
    reqAtGetFullBracketInfo,
    reqAtGetUserArray,
} from "./Gateway.ts";
import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import {
    getIsAutoTourneyNotified,
    setIsAutoTourneyNotified,
} from "../../localData/Storage.ts";
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

const _globalSettingsAccessor = new CachedDataAccessor<null, GlobalSettings>({
    reqData     : () => reqAtGetGlobalSettings(),
});
const _phaseInfoAccessor = new CachedDataAccessor<null, PhaseInfo>({
    reqData     : () => reqAtGetPhaseInfo(),
});
const _registrationInfoAccessor = new CachedDataAccessor<number, RegistrationInfo>({
    reqData     : tourneyId => reqAtGetRegistrationInfo(tourneyId),
});
const _tourneyInfoAccessor = new CachedDataAccessor<number, TourneyInfo>({
    reqData     : tourneyId => reqAtGetTourneyInfo(tourneyId),
});
const _fullMapInfoAccessor = new CachedDataAccessor<number, FullMapInfo>({
    reqData     : tourneyId => reqAtGetFullMapInfo(tourneyId),
});
const _fullBracketInfoAccessor = new CachedDataAccessor<number, FullBracketInfo>({
    reqData     : tourneyId => reqAtGetFullBracketInfo(tourneyId),
});
const _userArrayAccessor = new CachedDataAccessor<number, number[]>({
    reqData         : tourneyId => reqAtGetUserArray(tourneyId),
    dataExpireTime  : 30,
});

export function getGlobalSettings(): Promise<Undefinable<GlobalSettings>> {
    return _globalSettingsAccessor.getData(null);
}

export function getAtPhaseInfo(): Promise<Undefinable<PhaseInfo>> {
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

export function getAtRegistrationInfo(tourneyId: number): Promise<Undefinable<RegistrationInfo>> {
    return _registrationInfoAccessor.getData(tourneyId);
}

export function getAtTourneyInfo(tourneyId: number): Promise<Undefinable<TourneyInfo>> {
    return _tourneyInfoAccessor.getData(tourneyId);
}
export function setAtTourneyInfo(tourneyId: number, info: TourneyInfo | null): void {
    _tourneyInfoAccessor.setData(tourneyId, info);
}

export function getAtFullMapInfo(tourneyId: number): Promise<Undefinable<FullMapInfo>> {
    return _fullMapInfoAccessor.getData(tourneyId);
}
export function setAtFullMapInfo(tourneyId: number, info: FullMapInfo | null): void {
    _fullMapInfoAccessor.setData(tourneyId, info);
}

export function getAtFullBracketInfo(tourneyId: number): Promise<Undefinable<FullBracketInfo>> {
    return _fullBracketInfoAccessor.getData(tourneyId);
}
export function setAtFullBracketInfo(tourneyId: number, info: FullBracketInfo | null): void {
    _fullBracketInfoAccessor.setData(tourneyId, info);
}

export function getAtUserArray(tourneyId: number): Promise<Undefinable<number[]>> {
    return _userArrayAccessor.getData(tourneyId);
}
export function setAtUserArray(tourneyId: number, userIdArray: number[] | null): void {
    _userArrayAccessor.setData(tourneyId, userIdArray);
}

export function getIsNotifiedForRegistration(tourneyId: number): boolean {
    return getIsAutoTourneyNotified(tourneyId);
}
export function setIsNotifiedForRegistration(tourneyId: number, isNotified: boolean): void {
    setIsAutoTourneyNotified(tourneyId, isNotified);
}

export function updateOnMsgAtGetGlobalSettings(msg: AtGetGlobalSettingsResponse): void {
    const globalSettings = msg.getGlobalSettings();
    _globalSettingsAccessor.setData(null, {
        isEnabled               : !!globalSettings?.getIsEnabled(),
        interval                : globalSettings?.getInterval() ?? 0,
        lastCreateTimestamp     : msg.getLastCreateTimestamp() ?? 0,
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
        infoArray   : msg.getSinglePhaseInfoArray(),
    });
}
export function updateOnMsgAtGetRegistrationInfo(msg: AtGetRegistrationInfoResponse): void {
    const tourneyId = msg.getTourneyId() ?? 0;
    _registrationInfoAccessor.setData(tourneyId, {
        isRegistered    : !!msg.getIsRegistered(),
        tourneyId       : tourneyId,
        playersCount    : msg.getPlayersCount() ?? 0,
        endTimestamp    : msg.getEndTimestamp() ?? 0,
    });
}

export function checkHasFog(tourneyId: number): boolean {
    return tourneyId % 2 == 1;
}

export function getTourneyInfoPhase(tourneyInfo: TourneyInfo): number {
    if (tourneyInfo.getEndTimestamp() != null) {
        return PhaseId.End;
    } else if (tourneyInfo.getBattleTimestamp() != null) {
        return PhaseId.Battle;
    } else if (tourneyInfo.getAdjustmentTimestamp() != null) {
        return PhaseId.Adjustment;
    } else {
        return PhaseId.Registration;
    }
}

export async function checkIsRedForRegistration(): Promise<boolean> {
    const tourneyIdArray = (await getAtPhaseInfo())?.infoArray.filter(v => v.getPhase() === PhaseId.Registration).map(v => v.getTourneyId()) ?? [];
    return tourneyIdArray.some(v => !getIsNotifiedForRegistration(v));
}
