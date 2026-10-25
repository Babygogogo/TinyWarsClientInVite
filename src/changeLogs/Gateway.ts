
import { addListeners, send } from "../networks/Manager.ts";
import { MessageCodes } from "../networks/MessageCodes.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { S } from "../proto/schema/CommonProto/NetMessage/MsgChangeLogAddMessage/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgChangeLogGetMessageListS,
} from "../proto/schema/CommonProto/NetMessage/MsgChangeLogGetMessageList/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgChangeLogModifyMessageS,
} from "../proto/schema/CommonProto/NetMessage/MsgChangeLogModifyMessage/S.ts";
import type { LanguageText as ProtoSchemaCommonProtoStructureLanguageText } from "../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { Event } from "../vendor/egret/Egret.ts";
import { setAllMessageList } from "./Provider.ts";

type LanguageText       = ProtoSchemaCommonProtoStructureLanguageText;

export function init(): void {
    addListeners([
        { msgCode : MessageCodes.MsgChangeLogAddMessage,         callback : _onMsgChangeLogAddMessage },
        { msgCode : MessageCodes.MsgChangeLogModifyMessage,      callback : _onMsgChangeLogModifyMessage },
        { msgCode : MessageCodes.MsgChangeLogGetMessageList,     callback : _onMsgChangeLogGetMessageList, },
    ], null);
}

export function reqChangeLogAddMessage(textList: LanguageText[]): void {
    send({
        MsgChangeLogAddMessage : {
            c : {
                textList : textList.map(v => v.toJson()),
            }
        },
    });
}
function _onMsgChangeLogAddMessage(e: Event): void {
    const data = e.data as S;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgChangeLogAddMessage, data);
    }
}

export function reqChangeLogModifyMessage(messageId: number, textList: LanguageText[]): void {
    send({
        MsgChangeLogModifyMessage : {
            c : {
                messageId : messageId,
                textList  : textList.map(v => v.toJson()),
            }
        },
    });
}
function _onMsgChangeLogModifyMessage(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChangeLogModifyMessageS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgChangeLogModifyMessage, data);
    }
}

export function reqChangeLogGetMessageList(): void {
    send({
        MsgChangeLogGetMessageList : {
            c : {
            }
        },
    });
}
function _onMsgChangeLogGetMessageList(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChangeLogGetMessageListS;
    if (!data.getErrorCode()) {
        setAllMessageList(data.getMessageList());
        dispatch(TypeId.MsgChangeLogGetMessageList, data);
    }
}
