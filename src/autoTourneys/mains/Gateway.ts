import {
    updateOnMsgAtGetGlobalSettings,
    updateOnMsgAtSetName,
    updateOnMsgAtSetBootTimer,
    updateOnMsgAtGetPhaseInfo,
    updateOnMsgAtGetRegistrationInfo,
    setAtTourneyInfo,
    setAtFullMapInfo,
    setAtFullBracketInfo,
    setAtUserArray,
} from "./Provider.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as AtCreateTourneyResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtCreateTourney/S.ts";
import type { S as AtDeleteLastTourneyResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtDeleteLastTourney/S.ts";
import type { S as AtDeleteUserResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtDeleteUser/S.ts";
import type { S as AtGetFullBracketInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetFullBracketInfo/S.ts";
import type { S as AtGetFullMapInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetFullMapInfo/S.ts";
import type { S as AtGetGlobalSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetGlobalSettings/S.ts";
import type { S as AtGetPhaseInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetPhaseInfo/S.ts";
import type { S as AtGetRegistrationInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetRegistrationInfo/S.ts";
import type { S as AtGetTourneyInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetTourneyInfo/S.ts";
import type { S as AtGetUserArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtGetUserArray/S.ts";
import type { S as AtRegisterResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtRegister/S.ts";
import type { S as AtSetAdjustmentDurationResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetAdjustmentDuration/S.ts";
import type { S as AtSetBootTimerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetBootTimer/S.ts";
import type { S as AtSetGlobalSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetGlobalSettings/S.ts";
import type { InitialBracket } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/InitialBracket.ts";
import type { S as AtSetInitialBracketsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/S.ts";
import type { S as AtSetMapPoolResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetMapPool/S.ts";
import type { SimpleMapInfo } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetMapPool/SimpleMapInfo.ts";
import type { S as AtSetNameResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetName/S.ts";
import type { S as AtSetRegistrationDurationResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetRegistrationDuration/S.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { Event } from "../../egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgAtGetGlobalSettings,          callback: _onMsgAtGetGlobalSettings },
        { msgCode: MessageCodes.MsgAtSetGlobalSettings,          callback: _onMsgAtSetGlobalSettings },
        { msgCode: MessageCodes.MsgAtCreateTourney,              callback: _onMsgAtCreateTourney },
        { msgCode: MessageCodes.MsgAtDeleteLastTourney,          callback: _onMsgAtDeleteLastTourney },
        { msgCode: MessageCodes.MsgAtSetRegistrationDuration,    callback: _onMsgAtSetRegistrationDuration },
        { msgCode: MessageCodes.MsgAtSetAdjustmentDuration,      callback: _onMsgAtSetAdjustmentDuration },
        { msgCode: MessageCodes.MsgAtSetInitialBrackets,         callback: _onMsgAtSetInitialBrackets },
        { msgCode: MessageCodes.MsgAtDeleteUser,                 callback: _onMsgAtDeleteUser },
        { msgCode: MessageCodes.MsgAtSetMapPool,                 callback: _onMsgAtSetMapPool },
        { msgCode: MessageCodes.MsgAtSetName,                    callback: _onMsgAtSetName },
        { msgCode: MessageCodes.MsgAtSetBootTimer,               callback: _onMsgAtSetBootTimer },
        { msgCode: MessageCodes.MsgAtGetPhaseInfo,               callback: _onMsgAtGetPhaseInfo, },
        { msgCode: MessageCodes.MsgAtGetRegistrationInfo,        callback: _onMsgAtGetRegistrationInfo, },
        { msgCode: MessageCodes.MsgAtGetTourneyInfo,             callback: _onMsgAtGetTourneyInfo, },
        { msgCode: MessageCodes.MsgAtGetFullMapInfo,             callback: _onMsgAtGetFullMapInfo, },
        { msgCode: MessageCodes.MsgAtGetFullBracketInfo,         callback: _onMsgAtGetFullBracketInfo, },
        { msgCode: MessageCodes.MsgAtGetUserArray,               callback: _onMsgAtGetUserArray },
        { msgCode: MessageCodes.MsgAtRegister,                   callback: _onMsgAtRegister, },
    ]);
}

export function reqAtGetGlobalSettings(): void {
    send({
        MsgAtGetGlobalSettings: { c: {
        } },
    });
}
function _onMsgAtGetGlobalSettings(e: Event): void {
    const data = e.data as AtGetGlobalSettingsResponse;
    if (!data.getErrorCode()) {
        updateOnMsgAtGetGlobalSettings(data);
        dispatch(TypeId.MsgAtGetGlobalSettings, data);
    }
}

export function reqAtSetGlobalSettings(isEnabled: boolean, interval: number): void {
    send({
        MsgAtSetGlobalSettings: { c: {
            globalSettings  : {
                isEnabled   : isEnabled,
                interval    : interval,
            },
        } },
    });
}
function _onMsgAtSetGlobalSettings(e: Event): void {
    const data = e.data as AtSetGlobalSettingsResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtSetGlobalSettings, data);
    }
}

export function reqAtCreateTourney(): void {
    send({
        MsgAtCreateTourney: { c: {
        } },
    });
}
function _onMsgAtCreateTourney(e: Event): void {
    const data = e.data as AtCreateTourneyResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtCreateTourney, data);
    }
}

export function reqAtDeleteLastTourney(): void {
    send({
        MsgAtDeleteLastTourney: { c: {
        } },
    });
}
function _onMsgAtDeleteLastTourney(e: Event): void {
    const data = e.data as AtDeleteLastTourneyResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtDeleteLastTourney, data);
    }
}

export function reqAtSetRegistrationDuration(tourneyId: number, duration: number): void {
    send({
        MsgAtSetRegistrationDuration: { c: {
            tourneyId   : tourneyId,
            duration    : duration,
        } },
    });
}
function _onMsgAtSetRegistrationDuration(e: Event): void {
    const data = e.data as AtSetRegistrationDurationResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtSetRegistrationDuration, data);
    }
}

export function reqAtSetAdjustmentDuration(tourneyId: number, duration: number): void {
    send({
        MsgAtSetAdjustmentDuration: { c: {
            tourneyId   : tourneyId,
            duration    : duration,
        } },
    });
}
function _onMsgAtSetAdjustmentDuration(e: Event): void {
    const data = e.data as AtSetAdjustmentDurationResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtSetAdjustmentDuration, data);
    }
}

export function reqAtSetInitialBrackets(tourneyId: number, bracketArray: InitialBracket[]): void {
    send({
        MsgAtSetInitialBrackets: { c: {
            tourneyId           : tourneyId,
            initialBracketArray : bracketArray.map(v => v.toJson()),
        } },
    });
}
function _onMsgAtSetInitialBrackets(e: Event): void {
    const data = e.data as AtSetInitialBracketsResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtSetInitialBrackets, data);
    }
}

export function reqAtDeleteUser(tourneyId: number, userIdArray: number[]): void {
    send({
        MsgAtDeleteUser: { c: {
            tourneyId   : tourneyId,
            userIdArray : userIdArray,
        } },
    });
}
function _onMsgAtDeleteUser(e: Event): void {
    const data = e.data as AtDeleteUserResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtDeleteUser, data);
    }
}

export function reqAtSetMapPool(tourneyId: number, mapInfoArray: SimpleMapInfo[]): void {
    send({
        MsgAtSetMapPool: { c: {
            tourneyId           : tourneyId,
            simpleMapInfoArray  : mapInfoArray.map(v => v.toJson()),
        } },
    });
}
function _onMsgAtSetMapPool(e: Event): void {
    const data = e.data as AtSetMapPoolResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtSetMapPool, data);
    }
}

export function reqAtSetName(tourneyId: number, nameArray: LanguageText[]): void {
    send({ MsgAtSetName: { c: {
        tourneyId   : tourneyId,
        nameArray   : nameArray.map(v => v.toJson()),
    } } });
}
async function _onMsgAtSetName(e: Event): Promise<void> {
    const data = e.data as AtSetNameResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgAtSetName(data);
        dispatch(TypeId.MsgAtSetName, data);
    }
}

export function reqAtSetBootTimer(tourneyId: number, bootTimerParams: number[]): void {
    send({ MsgAtSetBootTimer: { c: {
        tourneyId       : tourneyId,
        bootTimerParams : bootTimerParams,
    } } });
}
async function _onMsgAtSetBootTimer(e: Event): Promise<void> {
    const data = e.data as AtSetBootTimerResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgAtSetBootTimer(data);
        dispatch(TypeId.MsgAtSetBootTimer, data);
    }
}

export function reqAtGetPhaseInfo(): void {
    send({
        MsgAtGetPhaseInfo: { c: {
        } },
    });
}
function _onMsgAtGetPhaseInfo(e: Event): void {
    const data = e.data as AtGetPhaseInfoResponse;
    if (!data.getErrorCode()) {
        updateOnMsgAtGetPhaseInfo(data);
        dispatch(TypeId.MsgAtGetPhaseInfo, data);
    }
}

export function reqAtGetRegistrationInfo(tourneyId: number): void {
    send({
        MsgAtGetRegistrationInfo: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetRegistrationInfo(e: Event): void {
    const data = e.data as AtGetRegistrationInfoResponse;
    if (!data.getErrorCode()) {
        updateOnMsgAtGetRegistrationInfo(data);
        dispatch(TypeId.MsgAtGetRegistrationInfo, data);
    }
}

export function reqAtGetTourneyInfo(tourneyId: number): void {
    send({
        MsgAtGetTourneyInfo: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetTourneyInfo(e: Event): void {
    const data = e.data as AtGetTourneyInfoResponse;
    if (!data.getErrorCode()) {
        setAtTourneyInfo(data.getTourneyId() ?? 0, data.getTourneyInfo() ?? null);
        dispatch(TypeId.MsgAtGetTourneyInfo, data);
    }
}

export function reqAtGetFullMapInfo(tourneyId: number): void {
    send({
        MsgAtGetFullMapInfo: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetFullMapInfo(e: Event): void {
    const data = e.data as AtGetFullMapInfoResponse;
    if (!data.getErrorCode()) {
        setAtFullMapInfo(data.getTourneyId() ?? 0, data.getFullMapInfo() ?? null);
        dispatch(TypeId.MsgAtGetFullMapInfo, data);
    }
}

export function reqAtGetFullBracketInfo(tourneyId: number): void {
    send({
        MsgAtGetFullBracketInfo: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetFullBracketInfo(e: Event): void {
    const data = e.data as AtGetFullBracketInfoResponse;
    if (!data.getErrorCode()) {
        setAtFullBracketInfo(data.getTourneyId() ?? 0, data.getFullBracketInfo() ?? null);
        dispatch(TypeId.MsgAtGetFullBracketInfo, data);
    }
}

export function reqAtGetUserArray(tourneyId: number): void {
    send({
        MsgAtGetUserArray: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetUserArray(e: Event): void {
    const data = e.data as AtGetUserArrayResponse;
    if (!data.getErrorCode()) {
        setAtUserArray(data.getTourneyId() ?? 0, data.getUserIdArray());
        dispatch(TypeId.MsgAtGetUserArray, data);
    }
}

export function reqAtRegister(tourneyId: number, isRegister: boolean): void {
    send({
        MsgAtRegister: { c: {
            tourneyId   : tourneyId,
            isRegister  : isRegister,
        } },
    });
}
function _onMsgAtRegister(e: Event): void {
    const data = e.data as AtRegisterResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtRegister, data);
    }
}
