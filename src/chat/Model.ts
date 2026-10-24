import * as ChatConstants from "./Constants.ts";
import * as FloatText2 from "../FloatText.ts";
import * as GamePanelsDict from "../gamePanels/Dict.ts";
import * as GamePanelsManager from "../gamePanels/Manager.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as Logger2 from "../Logger.ts";
import type * as ProtoSchemaCommonProtoChatChatMessage from "../proto/schema/CommonProto/Chat/ChatMessage.ts";
import type * as ProtoSchemaCommonProtoChatChatReadProgress from "../proto/schema/CommonProto/Chat/ChatReadProgress.ts";
import * as UsersModel from "../users/Model.ts";

type MessageDict                    = Map<number, ProtoSchemaCommonProtoChatChatMessage.ChatMessage[]>;
const _allMessageDict               = new Map<ChatConstants.ToCategoryId, MessageDict>();
const _allProgressDict              = new Map<ChatConstants.ToCategoryId, Map<number, number>>();
let _timestampForNextSetAllMessages = 0;

export function setAllMessages(msgList: ProtoSchemaCommonProtoChatChatMessage.ChatMessage[]): void {
    _allMessageDict.clear();

    for (const msg of msgList || []) {
        updateOnAddMessage(msg, false);
    }
}

export function getMessage(messageId: number): ProtoSchemaCommonProtoChatChatMessage.ChatMessage | null {
    for (const [, dict] of _allMessageDict) {
        for (const [, messageArray] of dict) {
            for (const message of messageArray) {
                if (message.getMessageId() === messageId) {
                    return message;
                }
            }
        }
    }
    return null;
}

export function setTimestampForNextReqAllMessages(timestamp: number): void {
    _timestampForNextSetAllMessages = timestamp;
}
export function getTimestampForNextReqAllMessages(): number {
    return _timestampForNextSetAllMessages;
}

export function updateOnAddMessage(msg: ProtoSchemaCommonProtoChatChatMessage.ChatMessage, showFloatText: boolean): void {
    const fromUserId = msg.getFromUserId();
    if (fromUserId == null) {
        Logger2.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
    } else {
        const msgToCategory = msg.getToCategory();
        const msgToTarget   = HelpersMisc.getExisted(msg.getToTarget());
        const msgContent    = msg.getContent();
        const isSentBySelf  = UsersModel.getSelfUserId() === fromUserId;

        if (msgToCategory === ChatConstants.ToCategoryId.PublicChannel) {
            addMessage(ChatConstants.ToCategoryId.PublicChannel, msg, msgToTarget);

        } else if (msgToCategory === ChatConstants.ToCategoryId.WarAndTeam) {
            addMessage(ChatConstants.ToCategoryId.WarAndTeam, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().ChatPanel))) {
                UsersModel.getUserNickname(fromUserId).then(name => FloatText2.show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === ChatConstants.ToCategoryId.WarAndSelf) {
            addMessage(ChatConstants.ToCategoryId.WarAndSelf, msg, msgToTarget);

        } else if (msgToCategory === ChatConstants.ToCategoryId.Private) {
            if (isSentBySelf) {
                addMessage(ChatConstants.ToCategoryId.Private, msg, msgToTarget);
            } else {
                addMessage(ChatConstants.ToCategoryId.Private, msg, fromUserId);
                if ((showFloatText) && (!GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().ChatPanel))) {
                    UsersModel.getUserNickname(fromUserId).then(name => FloatText2.show(`💬${name}: ${msgContent}`));
                }
            }

        } else if (msgToCategory === ChatConstants.ToCategoryId.McrRoom) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().ChatPanel))) {
                UsersModel.getUserNickname(fromUserId).then(name => FloatText2.show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === ChatConstants.ToCategoryId.MfrRoom) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().ChatPanel))) {
                UsersModel.getUserNickname(fromUserId).then(name => FloatText2.show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === ChatConstants.ToCategoryId.CcrRoom) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().ChatPanel))) {
                UsersModel.getUserNickname(fromUserId).then(name => FloatText2.show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === ChatConstants.ToCategoryId.MapReview) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().ChatPanel))) {
                UsersModel.getUserNickname(fromUserId).then(name => FloatText2.show(`💬${name}: ${msgContent}`));
            }

        } else {
            Logger2.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
        }
    }
}

export function updateOnDeleteMessage(messageId: number): void {
    for (const [, messageDict] of _allMessageDict) {
        for (const [, messageArray] of messageDict) {
            const index = messageArray.findIndex(v => v.getMessageId() === messageId);
            (index >= 0) && (messageArray.splice(index, 1));
        }
    }
}

export function getMessagesForCategory(toCategory: ChatConstants.ToCategoryId): MessageDict {
    if (!_allMessageDict.has(toCategory)) {
        _allMessageDict.set(toCategory, new Map());
    }
    return HelpersMisc.getExisted(_allMessageDict.get(toCategory));
}
export function getLatestMessageTimestamp(toCategory: ChatConstants.ToCategoryId, toTarget: number): number {
    const messageList = getMessagesForCategory(toCategory).get(toTarget) || [];
    return messageList[messageList.length - 1]?.getTimestamp() ?? 0;
}

export function resetAllReadProgress(list: ProtoSchemaCommonProtoChatChatReadProgress.ChatReadProgress[]): void {
    _allProgressDict.clear();
    for (const p of list || []) {
        setReadProgress(p);
    }
}
export function setReadProgress(progress: ProtoSchemaCommonProtoChatChatReadProgress.ChatReadProgress): void {
    const toCategory    = HelpersMisc.getExisted(progress.getToCategory());
    const toTarget      = HelpersMisc.getExisted(progress.getToTarget());
    const timestamp     = HelpersMisc.getExisted(progress.getTimestamp());
    const subDict       = _allProgressDict.get(toCategory);
    if (subDict) {
        subDict.set(toTarget, timestamp);
    } else {
        _allProgressDict.set(toCategory, new Map<number, number>([[toTarget, timestamp]]));
    }
}
export function getReadProgressTimestamp(toCategory: ChatConstants.ToCategoryId, toTarget: number): number {
    const subDict = _allProgressDict.get(toCategory);
    return subDict
        ? subDict.get(toTarget) || 0
        : 0;
}

export function checkHasUnreadMessage(): boolean {
    for (const [toCategory, dict] of _allMessageDict) {
        for (const [toTarget, ] of dict) {
            if (checkHasUnreadMessageForTarget(toCategory, toTarget)) {
                return true;
            }
        }
    }
    return false;
}
export function checkHasUnreadMessageForTarget(toCategory: ChatConstants.ToCategoryId, toTarget: number): boolean {
    const messages  = getMessagesForCategory(toCategory).get(toTarget) || [];
    const length    = messages.length;
    if (!length) {
        return false;
    } else {
        return getReadProgressTimestamp(toCategory, toTarget) < HelpersMisc.getExisted(messages[length - 1].getTimestamp());
    }
}
export function checkHasUnreadMessageForMainCategory(mainCategory: ChatConstants.MainCategoryId): boolean {
    if (mainCategory === ChatConstants.MainCategoryId.PublicChannel) {
        return checkHasUnreadMessageForChatCategory(ChatConstants.ToCategoryId.PublicChannel, null);

    } else if (mainCategory === ChatConstants.MainCategoryId.War) {
        return checkHasUnreadMessageForChatCategory(ChatConstants.ToCategoryId.WarAndTeam, null);

    } else if (mainCategory === ChatConstants.MainCategoryId.Room) {
        return (checkHasUnreadMessageForChatCategory(ChatConstants.ToCategoryId.CcrRoom, null))
            || (checkHasUnreadMessageForChatCategory(ChatConstants.ToCategoryId.McrRoom, null))
            || (checkHasUnreadMessageForChatCategory(ChatConstants.ToCategoryId.MfrRoom, null));

    } else if (mainCategory === ChatConstants.MainCategoryId.Following) {
        return checkHasUnreadMessageForChatCategory(ChatConstants.ToCategoryId.Private, toTarget => UsersModel.checkIsFollowingUser(toTarget));

    } else if (mainCategory === ChatConstants.MainCategoryId.Stranger) {
        return checkHasUnreadMessageForChatCategory(ChatConstants.ToCategoryId.Private, toTarget => !UsersModel.checkIsFollowingUser(toTarget));

    } else if (mainCategory === ChatConstants.MainCategoryId.MapReview) {
        return checkHasUnreadMessageForChatCategory(ChatConstants.ToCategoryId.MapReview, null);

    } else {
        throw HelpersMisc.newError(`Invalid mainCategory: ${mainCategory}`);
    }
}
function checkHasUnreadMessageForChatCategory(category: ChatConstants.ToCategoryId, predicate: ((toTarget: number) => boolean) | null): boolean {
    for (const [toTarget] of getMessagesForCategory(category)) {
        if (((predicate == null) || (predicate(toTarget)))      &&
            (checkHasUnreadMessageForTarget(category, toTarget))
        ) {
            return true;
        }
    }

    return false;
}

function addMessage(toCategory: ChatConstants.ToCategoryId, msg: ProtoSchemaCommonProtoChatChatMessage.ChatMessage, toTarget: number): void {
    const dict = _allMessageDict.get(toCategory);
    if (!dict) {
        _allMessageDict.set(toCategory, new Map<number, ProtoSchemaCommonProtoChatChatMessage.ChatMessage[]>([[toTarget, [msg]]]));
    } else {
        if (dict.has(toTarget)) {
            HelpersMisc.getExisted(dict.get(toTarget)).push(msg);
        } else {
            dict.set(toTarget, [msg]);
        }
    }
}
