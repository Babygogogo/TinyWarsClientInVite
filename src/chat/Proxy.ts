import type { ToCategoryId } from "./Constants.ts";
import { updateOnAddMessage, setAllMessages, setReadProgress, resetAllReadProgress, updateOnDeleteMessage } from "./Model.ts";
import { getExisted } from "../helpers/Misc.ts";
import { addListeners, send } from "../networks/Manager.ts";
import { MessageCodes } from "../networks/MessageCodes.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { S } from "../proto/schema/CommonProto/NetMessage/MsgChatAddMessage/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgChatDeleteMessageS,
} from "../proto/schema/CommonProto/NetMessage/MsgChatDeleteMessage/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgChatGetAllMessagesS,
} from "../proto/schema/CommonProto/NetMessage/MsgChatGetAllMessages/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgChatGetAllReadProgressListS,
} from "../proto/schema/CommonProto/NetMessage/MsgChatGetAllReadProgressList/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgChatUpdateReadProgressS,
} from "../proto/schema/CommonProto/NetMessage/MsgChatUpdateReadProgress/S.ts";
import { getServerTimestamp } from "../timer/TimerModel.ts";
import type { Event } from "../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgChatAddMessage,               callback: _onMsgChatAddMessage },
        { msgCode: MessageCodes.MsgChatGetAllMessages,           callback: _onMsgChatGetAllMessages },
        { msgCode: MessageCodes.MsgChatUpdateReadProgress,       callback: _onMsgChatUpdateReadProgress },
        { msgCode: MessageCodes.MsgChatGetAllReadProgressList,   callback: _onMsgChatGetAllReadProgressList },
        { msgCode: MessageCodes.MsgChatDeleteMessage,            callback: _onMsgChatDeleteMessage },
    ], null);
}

export function reqChatAddMessage(
    content     : string,
    toCategory  : ToCategoryId,
    toTarget    : number,
): void {
    send({ MsgChatAddMessage: { c: {
        toCategory,
        toTarget,
        content,
    }, } });
}
function _onMsgChatAddMessage(e: Event): void {
    const data = e.data as S;
    if (!data.getErrorCode()) {
        updateOnAddMessage(getExisted(data.getMessage()), true);
        dispatch(TypeId.MsgChatAddMessage, data);
    }
}

export function reqGetAllMessages(): void {
    send({ MsgChatGetAllMessages: { c: {} } });
}
function _onMsgChatGetAllMessages(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChatGetAllMessagesS;
    if (!data.getErrorCode()) {
        setAllMessages(data.getMessageList());
        dispatch(TypeId.MsgChatGetAllMessages, data);
    }
}

export function reqUpdateReadProgress(
    toCategory  : ToCategoryId,
    toTarget    : number,
    timestamp   = getServerTimestamp(),
): void {
    send({ MsgChatUpdateReadProgress: { c: {
        progress: {
            toCategory,
            toTarget,
            timestamp,
        }, }
    } });
}
function _onMsgChatUpdateReadProgress(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChatUpdateReadProgressS;
    if (!data.getErrorCode()) {
        setReadProgress(getExisted(data.getProgress()));
        dispatch(TypeId.MsgChatUpdateReadProgress, data);
    }
}

export function reqGetAllReadProgressList(): void {
    send({ MsgChatGetAllReadProgressList: { c: {} } });
}
function _onMsgChatGetAllReadProgressList(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChatGetAllReadProgressListS;
    if (!data.getErrorCode()) {
        resetAllReadProgress(data.getList());
        dispatch(TypeId.MsgChatGetAllReadProgressList, data);
    }
}

export function reqChatDeleteMessage(messageId: number): void {
    send({ MsgChatDeleteMessage: { c: { messageId } } });
}
function _onMsgChatDeleteMessage(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChatDeleteMessageS;
    if (!data.getErrorCode()) {
        updateOnDeleteMessage(getExisted(data.getMessageId()));
        dispatch(TypeId.MsgChatDeleteMessage, data);
    }
}
