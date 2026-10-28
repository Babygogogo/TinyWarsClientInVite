import { ToCategoryId, MainCategoryId } from "./Constants.ts";
import { show } from "../FloatText.ts";
import { getDict } from "../gamePanels/Dict.ts";
import { getRunningPanel } from "../gamePanels/Manager.ts";
import { getExisted, newError } from "../helpers/Misc.ts";
import { warn } from "../Logger.ts";
import type { ChatMessage } from "../proto/schema/CommonProto/Chat/ChatMessage.ts";
import type { ChatReadProgress } from "../proto/schema/CommonProto/Chat/ChatReadProgress.ts";
import { getSelfUserId, getUserNickname, checkIsFollowingUser } from "../users/Model.ts";

type MessageDict                    = Map<number, ChatMessage[]>;
const _allMessageDict               = new Map<ToCategoryId, MessageDict>();
const _allProgressDict              = new Map<ToCategoryId, Map<number, number>>();
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
        warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
    } else {
        const msgToCategory = msg.getToCategory();
        const msgToTarget   = msg.getToTarget();
        const msgContent    = msg.getContent();
        const isSentBySelf  = getSelfUserId() === fromUserId;

        if (msgToCategory === ToCategoryId.PublicChannel) {
            addMessage(ToCategoryId.PublicChannel, msg, msgToTarget);

        } else if (msgToCategory === ToCategoryId.WarAndTeam) {
            addMessage(ToCategoryId.WarAndTeam, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!getRunningPanel(getDict().ChatPanel))) {
                getUserNickname(fromUserId).then(name => show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === ToCategoryId.WarAndSelf) {
            addMessage(ToCategoryId.WarAndSelf, msg, msgToTarget);

        } else if (msgToCategory === ToCategoryId.Private) {
            if (isSentBySelf) {
                addMessage(ToCategoryId.Private, msg, msgToTarget);
            } else {
                addMessage(ToCategoryId.Private, msg, fromUserId);
                if ((showFloatText) && (!getRunningPanel(getDict().ChatPanel))) {
                    getUserNickname(fromUserId).then(name => show(`💬${name}: ${msgContent}`));
                }
            }

        } else if (msgToCategory === ToCategoryId.McrRoom) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!getRunningPanel(getDict().ChatPanel))) {
                getUserNickname(fromUserId).then(name => show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === ToCategoryId.MfrRoom) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!getRunningPanel(getDict().ChatPanel))) {
                getUserNickname(fromUserId).then(name => show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === ToCategoryId.CcrRoom) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!getRunningPanel(getDict().ChatPanel))) {
                getUserNickname(fromUserId).then(name => show(`💬${name}: ${msgContent}`));
            }

        } else if (msgToCategory === ToCategoryId.MapReview) {
            addMessage(msgToCategory, msg, msgToTarget);
            if ((!isSentBySelf) && (showFloatText) && (!getRunningPanel(getDict().ChatPanel))) {
                getUserNickname(fromUserId).then(name => show(`💬${name}: ${msgContent}`));
            }

        } else {
            warn(`ChatModel.updateOnAddMessage() invalid msg!`, msg);
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

export function getMessagesForCategory(toCategory: ToCategoryId): MessageDict {
    if (!_allMessageDict.has(toCategory)) {
        _allMessageDict.set(toCategory, new Map());
    }
    return getExisted(_allMessageDict.get(toCategory));
}
export function getLatestMessageTimestamp(toCategory: ToCategoryId, toTarget: number): number {
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
export function getReadProgressTimestamp(toCategory: ToCategoryId, toTarget: number): number {
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
export function checkHasUnreadMessageForTarget(toCategory: ToCategoryId, toTarget: number): boolean {
    const messages  = getMessagesForCategory(toCategory).get(toTarget) || [];
    const length    = messages.length;
    if (!length) {
        return false;
    } else {
        return getReadProgressTimestamp(toCategory, toTarget) < messages[length - 1].getTimestamp();
    }
}
export function checkHasUnreadMessageForMainCategory(mainCategory: MainCategoryId): boolean {
    if (mainCategory === MainCategoryId.PublicChannel) {
        return checkHasUnreadMessageForChatCategory(ToCategoryId.PublicChannel, null);

    } else if (mainCategory === MainCategoryId.War) {
        return checkHasUnreadMessageForChatCategory(ToCategoryId.WarAndTeam, null);

    } else if (mainCategory === MainCategoryId.Room) {
        return (checkHasUnreadMessageForChatCategory(ToCategoryId.CcrRoom, null))
            || (checkHasUnreadMessageForChatCategory(ToCategoryId.McrRoom, null))
            || (checkHasUnreadMessageForChatCategory(ToCategoryId.MfrRoom, null));

    } else if (mainCategory === MainCategoryId.Following) {
        return checkHasUnreadMessageForChatCategory(ToCategoryId.Private, toTarget => checkIsFollowingUser(toTarget));

    } else if (mainCategory === MainCategoryId.Stranger) {
        return checkHasUnreadMessageForChatCategory(ToCategoryId.Private, toTarget => !checkIsFollowingUser(toTarget));

    } else if (mainCategory === MainCategoryId.MapReview) {
        return checkHasUnreadMessageForChatCategory(ToCategoryId.MapReview, null);

    } else {
        throw newError(`Invalid mainCategory: ${mainCategory}`);
    }
}
function checkHasUnreadMessageForChatCategory(category: ToCategoryId, predicate: ((toTarget: number) => boolean) | null): boolean {
    for (const [toTarget] of getMessagesForCategory(category)) {
        if (((predicate == null) || (predicate(toTarget)))      &&
            (checkHasUnreadMessageForTarget(category, toTarget))
        ) {
            return true;
        }
    }

    return false;
}

function addMessage(toCategory: ToCategoryId, msg: ChatMessage, toTarget: number): void {
    const dict = _allMessageDict.get(toCategory);
    if (!dict) {
        _allMessageDict.set(toCategory, new Map<number, ChatMessage[]>([[toTarget, [msg]]]));
    } else {
        if (dict.has(toTarget)) {
            getExisted(dict.get(toTarget)).push(msg);
        } else {
            dict.set(toTarget, [msg]);
        }
    }
}
