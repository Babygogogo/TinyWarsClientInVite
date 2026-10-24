import * as AutoTourneysConstants from "../Constants.ts";
import * as AutoTourneysMainsGateway from "./Gateway.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import type * as ProtoSchemaCommonProtoAutoTourneyFullBracketInfo from "../../proto/schema/CommonProto/AutoTourney/FullBracketInfo.ts";
import type * as ProtoSchemaCommonProtoAutoTourneyFullMapInfo from "../../proto/schema/CommonProto/AutoTourney/FullMapInfo.ts";
import type * as ProtoSchemaCommonProtoAutoTourneySinglePhaseInfo from "../../proto/schema/CommonProto/AutoTourney/SinglePhaseInfo.ts";
import type * as ProtoSchemaCommonProtoAutoTourneyTourneyInfo from "../../proto/schema/CommonProto/AutoTourney/TourneyInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetGlobalSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetGlobalSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetPhaseInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetPhaseInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetRegistrationInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetRegistrationInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetBootTimerS from "../../proto/schema/CommonProto/NetMessage/MsgAtSetBootTimer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetNameS from "../../proto/schema/CommonProto/NetMessage/MsgAtSetName/S.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

type GlobalSettings = {
    isEnabled               : boolean;
    interval                : number;
    lastCreateTimestamp     : number;
};
type PhaseInfo = {
    infoArray   : ProtoSchemaCommonProtoAutoTourneySinglePhaseInfo.SinglePhaseInfo[];
};
type RegistrationInfo = {
    tourneyId       : number;
    isRegistered    : boolean;
    playersCount    : number;
    endTimestamp    : number;
};

const _globalSettingsAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, GlobalSettings>({
    reqData     : () => AutoTourneysMainsGateway.reqAtGetGlobalSettings(),
});
const _phaseInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, PhaseInfo>({
    reqData     : () => AutoTourneysMainsGateway.reqAtGetPhaseInfo(),
});
const _registrationInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, RegistrationInfo>({
    reqData     : tourneyId => AutoTourneysMainsGateway.reqAtGetRegistrationInfo(tourneyId),
});
const _tourneyInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoAutoTourneyTourneyInfo.TourneyInfo>({
    reqData     : tourneyId => AutoTourneysMainsGateway.reqAtGetTourneyInfo(tourneyId),
});
const _fullMapInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoAutoTourneyFullMapInfo.FullMapInfo>({
    reqData     : tourneyId => AutoTourneysMainsGateway.reqAtGetFullMapInfo(tourneyId),
});
const _fullBracketInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoAutoTourneyFullBracketInfo.FullBracketInfo>({
    reqData     : tourneyId => AutoTourneysMainsGateway.reqAtGetFullBracketInfo(tourneyId),
});
const _userArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, number[]>({
    reqData         : tourneyId => AutoTourneysMainsGateway.reqAtGetUserArray(tourneyId),
    dataExpireTime  : 30,
});

export function getGlobalSettings(): Promise<Undefinable<GlobalSettings>> {
    return _globalSettingsAccessor.getData(null);
}

export function getAtPhaseInfo(): Promise<Undefinable<PhaseInfo>> {
    return _phaseInfoAccessor.getData(null);
}
export async function getSinglePhaseInfoArrayForPhase(phase: number): Promise<ProtoSchemaCommonProtoAutoTourneySinglePhaseInfo.SinglePhaseInfo[]> {
    return (await getAtPhaseInfo())?.infoArray.filter(v => (v.getPhase() ?? 0) === phase) ?? [];
}
export async function getAllTourneyIdArray(): Promise<number[]> {
    const phaseInfo = await getAtPhaseInfo();
    return phaseInfo?.infoArray.map(v => v.getTourneyId() ?? 0) ?? [];
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

export function getAtTourneyInfo(tourneyId: number): Promise<Undefinable<ProtoSchemaCommonProtoAutoTourneyTourneyInfo.TourneyInfo>> {
    return _tourneyInfoAccessor.getData(tourneyId);
}
export function setAtTourneyInfo(tourneyId: number, info: ProtoSchemaCommonProtoAutoTourneyTourneyInfo.TourneyInfo | null): void {
    _tourneyInfoAccessor.setData(tourneyId, info);
}

export function getAtFullMapInfo(tourneyId: number): Promise<Undefinable<ProtoSchemaCommonProtoAutoTourneyFullMapInfo.FullMapInfo>> {
    return _fullMapInfoAccessor.getData(tourneyId);
}
export function setAtFullMapInfo(tourneyId: number, info: ProtoSchemaCommonProtoAutoTourneyFullMapInfo.FullMapInfo | null): void {
    _fullMapInfoAccessor.setData(tourneyId, info);
}

export function getAtFullBracketInfo(tourneyId: number): Promise<Undefinable<ProtoSchemaCommonProtoAutoTourneyFullBracketInfo.FullBracketInfo>> {
    return _fullBracketInfoAccessor.getData(tourneyId);
}
export function setAtFullBracketInfo(tourneyId: number, info: ProtoSchemaCommonProtoAutoTourneyFullBracketInfo.FullBracketInfo | null): void {
    _fullBracketInfoAccessor.setData(tourneyId, info);
}

export function getAtUserArray(tourneyId: number): Promise<Undefinable<number[]>> {
    return _userArrayAccessor.getData(tourneyId);
}
export function setAtUserArray(tourneyId: number, userIdArray: number[] | null): void {
    _userArrayAccessor.setData(tourneyId, userIdArray);
}

export function getIsNotifiedForRegistration(tourneyId: number): boolean {
    return LocalDataStorage2.getIsAutoTourneyNotified(tourneyId);
}
export function setIsNotifiedForRegistration(tourneyId: number, isNotified: boolean): void {
    LocalDataStorage2.setIsAutoTourneyNotified(tourneyId, isNotified);
}

export function updateOnMsgAtGetGlobalSettings(msg: ProtoSchemaCommonProtoNetMessageMsgAtGetGlobalSettingsS.S): void {
    const globalSettings = msg.getGlobalSettings();
    _globalSettingsAccessor.setData(null, {
        isEnabled               : !!globalSettings?.getIsEnabled(),
        interval                : globalSettings?.getInterval() ?? 0,
        lastCreateTimestamp     : msg.getLastCreateTimestamp() ?? 0,
    });
}
export async function updateOnMsgAtSetName(msg: ProtoSchemaCommonProtoNetMessageMsgAtSetNameS.S): Promise<void> {
    const tourneyInfo = await getAtTourneyInfo(msg.getTourneyId() ?? 0);
    if (tourneyInfo) {
        tourneyInfo.setNameArray(msg.getNameArray());
    }
}
export async function updateOnMsgAtSetBootTimer(msg: ProtoSchemaCommonProtoNetMessageMsgAtSetBootTimerS.S): Promise<void> {
    const tourneyInfo = await getAtTourneyInfo(msg.getTourneyId() ?? 0);
    if (tourneyInfo) {
        tourneyInfo.setBootTimerParams(msg.getBootTimerParams());
    }
}
export function updateOnMsgAtGetPhaseInfo(msg: ProtoSchemaCommonProtoNetMessageMsgAtGetPhaseInfoS.S): void {
    _phaseInfoAccessor.setData(null, {
        infoArray   : msg.getSinglePhaseInfoArray(),
    });
}
export function updateOnMsgAtGetRegistrationInfo(msg: ProtoSchemaCommonProtoNetMessageMsgAtGetRegistrationInfoS.S): void {
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

export function getTourneyInfoPhase(tourneyInfo: ProtoSchemaCommonProtoAutoTourneyTourneyInfo.TourneyInfo): number {
    if (tourneyInfo.getEndTimestamp() != null) {
        return AutoTourneysConstants.PhaseId.End;
    } else if (tourneyInfo.getBattleTimestamp() != null) {
        return AutoTourneysConstants.PhaseId.Battle;
    } else if (tourneyInfo.getAdjustmentTimestamp() != null) {
        return AutoTourneysConstants.PhaseId.Adjustment;
    } else {
        return AutoTourneysConstants.PhaseId.Registration;
    }
}

export async function checkIsRedForRegistration(): Promise<boolean> {
    const tourneyIdArray = (await getAtPhaseInfo())?.infoArray.filter(v => v.getPhase() === AutoTourneysConstants.PhaseId.Registration).map(v => v.getTourneyId() ?? 0) ?? [];
    return tourneyIdArray.some(v => !getIsNotifiedForRegistration(v)) ?? false;
}
