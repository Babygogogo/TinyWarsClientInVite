import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MailModelMailModel from "./MailModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMailDeleteMailS from "../../proto/schema/CommonProto/NetMessage/MsgMailDeleteMail/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMailGetAllMailArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMailGetAllMailArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMailGetMailS from "../../proto/schema/CommonProto/NetMessage/MsgMailGetMail/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS from "../../proto/schema/CommonProto/NetMessage/MsgMailSetIsNew/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMailGetAllMailArray,  callback: _onMsgMailGetAllMailArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMailGetMail,          callback: _onMsgMailGetMail },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMailDeleteMail,       callback: _onMsgMailDeleteMail },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMailSetIsNew,         callback: _onMsgMailSetIsNew },
    ], null);
}

function _onMsgMailGetAllMailArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMailGetAllMailArrayS.S;
    MailModelMailModel.resetAllMailDataArray(data.getMailFullDataArray());
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMailGetAllMailArray, data);
}

function _onMsgMailGetMail(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMailGetMailS.S;
    MailModelMailModel.updateOnMsgMailGetMail(HelpersMisc.getExisted(data.getMailFullData()));
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMailGetMail, data);
}

export function reqMailDeleteMail(mailId: number): void {
    NetworksManager.send({ MsgMailDeleteMail: { c: {
        mailId  : mailId,
    } }, });
}
function _onMsgMailDeleteMail(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMailDeleteMailS.S;
    if (!data.getErrorCode()) {
        MailModelMailModel.updateOnMsgMailDeleteMail(HelpersMisc.getExisted(data.getMailId()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMailDeleteMail, data);
    }
}

export function reqMailSetIsNew(mailId: number, isNew: boolean): void {
    NetworksManager.send({ MsgMailSetIsNew: { c: {
        mailId  : mailId,
        isNew   : isNew,
    }}});
}
function _onMsgMailSetIsNew(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS.S;
    if (!data.getErrorCode()) {
        MailModelMailModel.updateOnMsgMailSetIsNew(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMailSetIsNew, data);
    }
}
