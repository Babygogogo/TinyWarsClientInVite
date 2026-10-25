import { getExisted } from "../../helpers/Misc.ts";
import { resetAllMailDataArray, updateOnMsgMailGetMail, updateOnMsgMailDeleteMail, updateOnMsgMailSetIsNew } from "./MailModel.ts";
import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMailDeleteMail/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMailGetAllMailArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMailGetAllMailArray/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMailGetMailS } from "../../proto/schema/CommonProto/NetMessage/MsgMailGetMail/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS } from "../../proto/schema/CommonProto/NetMessage/MsgMailSetIsNew/S.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgMailGetAllMailArray,  callback: _onMsgMailGetAllMailArray },
        { msgCode: MessageCodes.MsgMailGetMail,          callback: _onMsgMailGetMail },
        { msgCode: MessageCodes.MsgMailDeleteMail,       callback: _onMsgMailDeleteMail },
        { msgCode: MessageCodes.MsgMailSetIsNew,         callback: _onMsgMailSetIsNew },
    ], null);
}

function _onMsgMailGetAllMailArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMailGetAllMailArrayS;
    resetAllMailDataArray(data.getMailFullDataArray());
    dispatch(TypeId.MsgMailGetAllMailArray, data);
}

function _onMsgMailGetMail(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMailGetMailS;
    updateOnMsgMailGetMail(getExisted(data.getMailFullData()));
    dispatch(TypeId.MsgMailGetMail, data);
}

export function reqMailDeleteMail(mailId: number): void {
    send({ MsgMailDeleteMail: { c: {
        mailId  : mailId,
    } }, });
}
function _onMsgMailDeleteMail(e: Event): void {
    const data = e.data as S;
    if (!data.getErrorCode()) {
        updateOnMsgMailDeleteMail(getExisted(data.getMailId()));
        dispatch(TypeId.MsgMailDeleteMail, data);
    }
}

export function reqMailSetIsNew(mailId: number, isNew: boolean): void {
    send({ MsgMailSetIsNew: { c: {
        mailId  : mailId,
        isNew   : isNew,
    }}});
}
function _onMsgMailSetIsNew(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS;
    if (!data.getErrorCode()) {
        updateOnMsgMailSetIsNew(data);
        dispatch(TypeId.MsgMailSetIsNew, data);
    }
}
