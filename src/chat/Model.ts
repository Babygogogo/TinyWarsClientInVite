import {
    Users_Model,
    GamePanels_Dict,
    Helpers_Misc,
    GamePanels_Manager,
    Chat_Constants,
    FloatText,
    Logger,
} from "../internal.ts";
import type { ChatMessage } from "../proto/schema/CommonProto/Chat/ChatMessage.ts";
import type { ChatReadProgress } from "../proto/schema/CommonProto/Chat/ChatReadProgress.ts";

type MessageDict                    = Map<number, ChatMessage[]>;
const _allMessageDict               = new Map<Chat_Constants.ToCategoryId, MessageDict>();
const _allProgressDict              = new Map<Chat_Constants.ToCategoryId, Map<number, number>>();
let _timestampForNextSetAllMessages = 0;

export function setAllMessages(msgList: ChatMessage[]): void {
    _allMessageDict.clear();

    for (const msg of msgList || []) {
        updateOnAddMessage(msg, false);
    }
}

export function getMessage(messageId: number): ChatMessage | null {
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

export function updateOnAddMessage(msg: ChatMessage, showFloatText: boolean): void {
    const fromUserId = msg.getFromUserId();
    if (fromUserId == null) {
        Logger.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
    } else {
        const msgToCategory = msg.getToCategory();
        const msgToTarget   = msg.getToTarget();
        const msgContent    = msg.getContent();
        const isSentBySelf  = Users_Model.getSelfUserId() === fromUserId;

        if (msgToCategory === Chat_Constants.ToCategoryId.PublicChannel) {
            addMessage(Chat_Constants.ToCategoryId.PublicChannel, msg, msgToTarget);

        } else if (msgToCategory === Chat_Constants.ToCategoryId.WarAndTeam) {
            addMessage(Chat_Constants.ToCategoryId.WarAndTeam, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().ChatPanel))) {
                Users_Model.getUserNickname(fromUserId).then(name => FloatText.show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === Chat_Constants.ToCategoryId.WarAndSelf) {
            addMessage(Chat_Constants.ToCategoryId.WarAndSelf, msg, msgToTarget);

        } else if (msgToCategory === Chat_Constants.ToCategoryId.Private) {
            if (isSentBySelf) {
                addMessage(Chat_Constants.ToCategoryId.Private, msg, msgToTarget);
            } else {
                addMessage(Chat_Constants.ToCategoryId.Private, msg, fromUserId);
                if ((showFloatText) && (!GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().ChatPanel))) {
                    Users_Model.getUserNickname(fromUserId).then(name => FloatText.show(`💬${name}: ${msgContent}`));
                }
            }

        } else if (msgToCategory === Chat_Constants.ToCategoryId.McrRoom) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().ChatPanel))) {
                Users_Model.getUserNickname(fromUserId).then(name => FloatText.show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === Chat_Constants.ToCategoryId.MfrRoom) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().ChatPanel))) {
                Users_Model.getUserNickname(fromUserId).then(name => FloatText.show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === Chat_Constants.ToCategoryId.CcrRoom) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().ChatPanel))) {
                Users_Model.getUserNickname(fromUserId).then(name => FloatText.show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === Chat_Constants.ToCategoryId.MapReview) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().ChatPanel))) {
                Users_Model.getUserNickname(fromUserId).then(name => FloatText.show(`💬${name}: ${msgContent}`));
            }

        } else {
            Logger.warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
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

export function getMessagesForCategory(toCategory: Chat_Constants.ToCategoryId): MessageDict {
    if (!_allMessageDict.has(toCategory)) {
        _allMessageDict.set(toCategory, new Map());
    }
    return Helpers_Misc.getExisted(_allMessageDict.get(toCategory));
}
export function getLatestMessageTimestamp(toCategory: Chat_Constants.ToCategoryId, toTarget: number): number {
    const messageList = getMessagesForCategory(toCategory).get(toTarget) || [];
    return messageList[messageList.length - 1]?.getTimestamp() ?? 0;
}

export function resetAllReadProgress(list: ChatReadProgress[]): void {
    _allProgressDict.clear();
    for (const p of list || []) {
        setReadProgress(p);
    }
}
export function setReadProgress(progress: ChatReadProgress): void {
    const toCategory    = progress.getToCategory();
    const toTarget      = progress.getToTarget();
    const timestamp     = progress.getTimestamp();
    const subDict       = _allProgressDict.get(toCategory);
    if (subDict) {
        subDict.set(toTarget, timestamp);
    } else {
        _allProgressDict.set(toCategory, new Map<number, number>([[toTarget, timestamp]]));
    }
}
export function getReadProgressTimestamp(toCategory: Chat_Constants.ToCategoryId, toTarget: number): number {
    const subDict = _allProgressDict.get(toCategory);
    return subDict
        ? subDict.get(toTarget) || 0
        : 0;
}

export function checkHasUnreadMessage(): boolean {
    for (const [toCategory, dict] of _allMessageDict) {
        for (const [toTarget ] of dict) {
            if (checkHasUnreadMessageForTarget(toCategory, toTarget)) {
                return true;
            }
        }
    }
    return false;
}
export function checkHasUnreadMessageForTarget(toCategory: Chat_Constants.ToCategoryId, toTarget: number): boolean {
    const messages  = getMessagesForCategory(toCategory).get(toTarget) || [];
    const length    = messages.length;
    if (!length) {
        return false;
    } else {
        return getReadProgressTimestamp(toCategory, toTarget) < messages[length - 1].getTimestamp();
    }
}
export function checkHasUnreadMessageForMainCategory(mainCategory: Chat_Constants.MainCategoryId): boolean {
    if (mainCategory === Chat_Constants.MainCategoryId.PublicChannel) {
        return checkHasUnreadMessageForChatCategory(Chat_Constants.ToCategoryId.PublicChannel, null);

    } else if (mainCategory === Chat_Constants.MainCategoryId.War) {
        return checkHasUnreadMessageForChatCategory(Chat_Constants.ToCategoryId.WarAndTeam, null);

    } else if (mainCategory === Chat_Constants.MainCategoryId.Room) {
        return (checkHasUnreadMessageForChatCategory(Chat_Constants.ToCategoryId.CcrRoom, null))
            || (checkHasUnreadMessageForChatCategory(Chat_Constants.ToCategoryId.McrRoom, null))
            || (checkHasUnreadMessageForChatCategory(Chat_Constants.ToCategoryId.MfrRoom, null));

    } else if (mainCategory === Chat_Constants.MainCategoryId.Following) {
        return checkHasUnreadMessageForChatCategory(Chat_Constants.ToCategoryId.Private, toTarget => Users_Model.checkIsFollowingUser(toTarget));

    } else if (mainCategory === Chat_Constants.MainCategoryId.Stranger) {
        return checkHasUnreadMessageForChatCategory(Chat_Constants.ToCategoryId.Private, toTarget => !Users_Model.checkIsFollowingUser(toTarget));

    } else if (mainCategory === Chat_Constants.MainCategoryId.MapReview) {
        return checkHasUnreadMessageForChatCategory(Chat_Constants.ToCategoryId.MapReview, null);

    } else {
        throw Helpers_Misc.newError(`Invalid mainCategory: ${mainCategory}`);
    }
}
function checkHasUnreadMessageForChatCategory(category: Chat_Constants.ToCategoryId, predicate: ((toTarget: number) => boolean) | null): boolean {
    for (const [toTarget] of getMessagesForCategory(category)) {
        if (((predicate == null) || (predicate(toTarget)))      &&
            (checkHasUnreadMessageForTarget(category, toTarget))
        ) {
            return true;
        }
    }

    return false;
}

function addMessage(toCategory: Chat_Constants.ToCategoryId, msg: ChatMessage, toTarget: number): void {
    const dict = _allMessageDict.get(toCategory);
    if (!dict) {
        _allMessageDict.set(toCategory, new Map<number, ChatMessage[]>([[toTarget, [msg]]]));
    } else {
        if (dict.has(toTarget)) {
            Helpers_Misc.getExisted(dict.get(toTarget)).push(msg);
        } else {
            dict.set(toTarget, [msg]);
        }
    }
}
