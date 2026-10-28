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
import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgAtCreateTourney/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtDeleteLastTourneyS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtDeleteLastTourney/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgAtDeleteUserS } from "../../proto/schema/CommonProto/NetMessage/MsgAtDeleteUser/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtGetFullBracketInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtGetFullBracketInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtGetFullMapInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtGetFullMapInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtGetGlobalSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtGetGlobalSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtGetPhaseInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtGetPhaseInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtGetRegistrationInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtGetRegistrationInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtGetTourneyInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtGetTourneyInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtGetUserArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtGetUserArray/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgAtRegisterS } from "../../proto/schema/CommonProto/NetMessage/MsgAtRegister/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtSetAdjustmentDurationS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtSetAdjustmentDuration/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtSetBootTimerS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtSetBootTimer/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtSetGlobalSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtSetGlobalSettings/S.ts";
import type { InitialBracket } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/InitialBracket.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtSetInitialBracketsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgAtSetMapPoolS } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetMapPool/S.ts";
import type { SimpleMapInfo } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetMapPool/SimpleMapInfo.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgAtSetNameS } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetName/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtSetRegistrationDurationS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtSetRegistrationDuration/S.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetGlobalSettingsS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetGlobalSettingsS;
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
    const data = e.data as S;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtDeleteLastTourneyS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetRegistrationDurationS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetAdjustmentDurationS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetInitialBracketsS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtDeleteUserS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetMapPoolS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetNameS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetBootTimerS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetPhaseInfoS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetRegistrationInfoS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetTourneyInfoS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetFullMapInfoS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetFullBracketInfoS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetUserArrayS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtRegisterS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgAtRegister, data);
    }
}
