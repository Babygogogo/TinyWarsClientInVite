import * as AutoTourneysMainsProvider from "./Provider.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtCreateTourneyS from "../../proto/schema/CommonProto/NetMessage/MsgAtCreateTourney/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtDeleteLastTourneyS from "../../proto/schema/CommonProto/NetMessage/MsgAtDeleteLastTourney/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtDeleteUserS from "../../proto/schema/CommonProto/NetMessage/MsgAtDeleteUser/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetFullBracketInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetFullBracketInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetFullMapInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetFullMapInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetGlobalSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetGlobalSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetPhaseInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetPhaseInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetRegistrationInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetRegistrationInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetTourneyInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetTourneyInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetUserArrayS from "../../proto/schema/CommonProto/NetMessage/MsgAtGetUserArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtRegisterS from "../../proto/schema/CommonProto/NetMessage/MsgAtRegister/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetAdjustmentDurationS from "../../proto/schema/CommonProto/NetMessage/MsgAtSetAdjustmentDuration/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetBootTimerS from "../../proto/schema/CommonProto/NetMessage/MsgAtSetBootTimer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetGlobalSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgAtSetGlobalSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetInitialBracketsInitialBracket from "../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/InitialBracket.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetInitialBracketsS from "../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetMapPoolS from "../../proto/schema/CommonProto/NetMessage/MsgAtSetMapPool/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetMapPoolSimpleMapInfo from "../../proto/schema/CommonProto/NetMessage/MsgAtSetMapPool/SimpleMapInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetNameS from "../../proto/schema/CommonProto/NetMessage/MsgAtSetName/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtSetRegistrationDurationS from "../../proto/schema/CommonProto/NetMessage/MsgAtSetRegistrationDuration/S.ts";
import type * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtGetGlobalSettings,          callback: _onMsgAtGetGlobalSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtSetGlobalSettings,          callback: _onMsgAtSetGlobalSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtCreateTourney,              callback: _onMsgAtCreateTourney },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtDeleteLastTourney,          callback: _onMsgAtDeleteLastTourney },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtSetRegistrationDuration,    callback: _onMsgAtSetRegistrationDuration },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtSetAdjustmentDuration,      callback: _onMsgAtSetAdjustmentDuration },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtSetInitialBrackets,         callback: _onMsgAtSetInitialBrackets },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtDeleteUser,                 callback: _onMsgAtDeleteUser },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtSetMapPool,                 callback: _onMsgAtSetMapPool },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtSetName,                    callback: _onMsgAtSetName },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtSetBootTimer,               callback: _onMsgAtSetBootTimer },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtGetPhaseInfo,               callback: _onMsgAtGetPhaseInfo, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtGetRegistrationInfo,        callback: _onMsgAtGetRegistrationInfo, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtGetTourneyInfo,             callback: _onMsgAtGetTourneyInfo, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtGetFullMapInfo,             callback: _onMsgAtGetFullMapInfo, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtGetFullBracketInfo,         callback: _onMsgAtGetFullBracketInfo, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtGetUserArray,               callback: _onMsgAtGetUserArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtRegister,                   callback: _onMsgAtRegister, },
    ]);
}

export function reqAtGetGlobalSettings(): void {
    NetworksManager.send({
        MsgAtGetGlobalSettings: { c: {
        } },
    });
}
function _onMsgAtGetGlobalSettings(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetGlobalSettingsS.S;
    if (!data.getErrorCode()) {
        AutoTourneysMainsProvider.updateOnMsgAtGetGlobalSettings(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtGetGlobalSettings, data);
    }
}

export function reqAtSetGlobalSettings(isEnabled: boolean, interval: number): void {
    NetworksManager.send({
        MsgAtSetGlobalSettings: { c: {
            globalSettings  : {
                isEnabled   : isEnabled,
                interval    : interval,
            },
        } },
    });
}
function _onMsgAtSetGlobalSettings(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetGlobalSettingsS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtSetGlobalSettings, data);
    }
}

export function reqAtCreateTourney(): void {
    NetworksManager.send({
        MsgAtCreateTourney: { c: {
        } },
    });
}
function _onMsgAtCreateTourney(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtCreateTourneyS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtCreateTourney, data);
    }
}

export function reqAtDeleteLastTourney(): void {
    NetworksManager.send({
        MsgAtDeleteLastTourney: { c: {
        } },
    });
}
function _onMsgAtDeleteLastTourney(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtDeleteLastTourneyS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtDeleteLastTourney, data);
    }
}

export function reqAtSetRegistrationDuration(tourneyId: number, duration: number): void {
    NetworksManager.send({
        MsgAtSetRegistrationDuration: { c: {
            tourneyId   : tourneyId,
            duration    : duration,
        } },
    });
}
function _onMsgAtSetRegistrationDuration(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetRegistrationDurationS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtSetRegistrationDuration, data);
    }
}

export function reqAtSetAdjustmentDuration(tourneyId: number, duration: number): void {
    NetworksManager.send({
        MsgAtSetAdjustmentDuration: { c: {
            tourneyId   : tourneyId,
            duration    : duration,
        } },
    });
}
function _onMsgAtSetAdjustmentDuration(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetAdjustmentDurationS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtSetAdjustmentDuration, data);
    }
}

export function reqAtSetInitialBrackets(tourneyId: number, bracketArray: ProtoSchemaCommonProtoNetMessageMsgAtSetInitialBracketsInitialBracket.InitialBracket[]): void {
    NetworksManager.send({
        MsgAtSetInitialBrackets: { c: {
            tourneyId           : tourneyId,
            initialBracketArray : bracketArray.map(v => v.toJson()),
        } },
    });
}
function _onMsgAtSetInitialBrackets(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetInitialBracketsS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtSetInitialBrackets, data);
    }
}

export function reqAtDeleteUser(tourneyId: number, userIdArray: number[]): void {
    NetworksManager.send({
        MsgAtDeleteUser: { c: {
            tourneyId   : tourneyId,
            userIdArray : userIdArray,
        } },
    });
}
function _onMsgAtDeleteUser(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtDeleteUserS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtDeleteUser, data);
    }
}

export function reqAtSetMapPool(tourneyId: number, mapInfoArray: ProtoSchemaCommonProtoNetMessageMsgAtSetMapPoolSimpleMapInfo.SimpleMapInfo[]): void {
    NetworksManager.send({
        MsgAtSetMapPool: { c: {
            tourneyId           : tourneyId,
            simpleMapInfoArray  : mapInfoArray.map(v => v.toJson()),
        } },
    });
}
function _onMsgAtSetMapPool(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetMapPoolS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtSetMapPool, data);
    }
}

export function reqAtSetName(tourneyId: number, nameArray: ProtoSchemaCommonProtoStructureLanguageText.LanguageText[]): void {
    NetworksManager.send({ MsgAtSetName: { c: {
        tourneyId   : tourneyId,
        nameArray   : nameArray.map(v => v.toJson()),
    } } });
}
async function _onMsgAtSetName(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetNameS.S;
    if (!data.getErrorCode()) {
        await AutoTourneysMainsProvider.updateOnMsgAtSetName(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtSetName, data);
    }
}

export function reqAtSetBootTimer(tourneyId: number, bootTimerParams: number[]): void {
    NetworksManager.send({ MsgAtSetBootTimer: { c: {
        tourneyId       : tourneyId,
        bootTimerParams : bootTimerParams,
    } } });
}
async function _onMsgAtSetBootTimer(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtSetBootTimerS.S;
    if (!data.getErrorCode()) {
        await AutoTourneysMainsProvider.updateOnMsgAtSetBootTimer(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtSetBootTimer, data);
    }
}

export function reqAtGetPhaseInfo(): void {
    NetworksManager.send({
        MsgAtGetPhaseInfo: { c: {
        } },
    });
}
function _onMsgAtGetPhaseInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetPhaseInfoS.S;
    if (!data.getErrorCode()) {
        AutoTourneysMainsProvider.updateOnMsgAtGetPhaseInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtGetPhaseInfo, data);
    }
}

export function reqAtGetRegistrationInfo(tourneyId: number): void {
    NetworksManager.send({
        MsgAtGetRegistrationInfo: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetRegistrationInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetRegistrationInfoS.S;
    if (!data.getErrorCode()) {
        AutoTourneysMainsProvider.updateOnMsgAtGetRegistrationInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtGetRegistrationInfo, data);
    }
}

export function reqAtGetTourneyInfo(tourneyId: number): void {
    NetworksManager.send({
        MsgAtGetTourneyInfo: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetTourneyInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetTourneyInfoS.S;
    if (!data.getErrorCode()) {
        AutoTourneysMainsProvider.setAtTourneyInfo(data.getTourneyId() ?? 0, data.getTourneyInfo() ?? null);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtGetTourneyInfo, data);
    }
}

export function reqAtGetFullMapInfo(tourneyId: number): void {
    NetworksManager.send({
        MsgAtGetFullMapInfo: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetFullMapInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetFullMapInfoS.S;
    if (!data.getErrorCode()) {
        AutoTourneysMainsProvider.setAtFullMapInfo(data.getTourneyId() ?? 0, data.getFullMapInfo() ?? null);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtGetFullMapInfo, data);
    }
}

export function reqAtGetFullBracketInfo(tourneyId: number): void {
    NetworksManager.send({
        MsgAtGetFullBracketInfo: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetFullBracketInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetFullBracketInfoS.S;
    if (!data.getErrorCode()) {
        AutoTourneysMainsProvider.setAtFullBracketInfo(data.getTourneyId() ?? 0, data.getFullBracketInfo() ?? null);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtGetFullBracketInfo, data);
    }
}

export function reqAtGetUserArray(tourneyId: number): void {
    NetworksManager.send({
        MsgAtGetUserArray: { c: {
            tourneyId   : tourneyId,
        } },
    });
}
function _onMsgAtGetUserArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetUserArrayS.S;
    if (!data.getErrorCode()) {
        AutoTourneysMainsProvider.setAtUserArray(data.getTourneyId() ?? 0, data.getUserIdArray() ?? null);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtGetUserArray, data);
    }
}

export function reqAtRegister(tourneyId: number, isRegister: boolean): void {
    NetworksManager.send({
        MsgAtRegister: { c: {
            tourneyId   : tourneyId,
            isRegister  : isRegister,
        } },
    });
}
function _onMsgAtRegister(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtRegisterS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtRegister, data);
    }
}
