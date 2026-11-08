
import type { ChangeLogMessage } from "../proto/schema/CommonProto/ChangeLog/ChangeLogMessage.ts";

let _messageList: ChangeLogMessage[] | null = null;

export function setAllMessageList(messageList: ChangeLogMessage[]): void {
    _messageList = (messageList || []).sort((v1, v2) => {
        const id1 = v1.getMessageId();
        const id2 = v2.getMessageId();
        if (id1 == null) {
            return 1;
        } else if (id2 == null) {
            return -1;
        } else {
            return id2 - id1;
        }
    });
}
export function getAllMessageList(): ChangeLogMessage[] | null {
    return _messageList;
}
export function getMessage(messageId: number): ChangeLogMessage | null {
    return getAllMessageList()?.find(v => v.getMessageId() === messageId) ?? null;
}
