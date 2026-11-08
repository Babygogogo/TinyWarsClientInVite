import {
    AuxiliaryTypes_CachedDataAccessor,
    Helpers_Collection,
    Timer_TimerModel,
    Broadcasts_Gateway,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { BroadcastMessage } from "../proto/schema/CommonProto/Broadcast/BroadcastMessage.ts";
import type { S as BroadcastGetMessageDataResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastGetMessageData/S.ts";

const _allMessageIdArray    : number[] = [];
const _messageDataAccessor  = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, BroadcastMessage>({
    reqData : (messageId: number) => Broadcasts_Gateway.reqBroadcastGetMessageData(messageId),
});

export function setAllMessageIdArray(messageIdArray: number[]): void {
    _allMessageIdArray.length = 0;
    _allMessageIdArray.push(...messageIdArray);
}
export function getAllMessageIdArray(): number[] {
    return _allMessageIdArray;
}

export function getMessageData(messageId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<BroadcastMessage>> {
    return _messageDataAccessor.getData(messageId);
}
function setMessageData(messageId: number, messageData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<BroadcastMessage>): void {
    _messageDataAccessor.setData(messageId, messageData);
}

export async function getOngoingMessageIdArray(): Promise<number[]> {
    const currTime      = Timer_TimerModel.getServerTimestamp();
    const promiseArray  : Promise<number | null>[] = [];
    for (const messageId of getAllMessageIdArray()) {
        promiseArray.push((async () => {
            const messageData = await getMessageData(messageId);
            if ((messageData)                                                           &&
                (messageData.getStartTime() <= currTime)   &&
                (messageData.getEndTime() >= currTime)
            ) {
                return messageId;
            } else {
                return null;
            }
        })());
    }
    return Helpers_Collection.getNonNullElements(await Promise.all(promiseArray));
}

export function updateOnMsgBroadcastGetMessageData(data: BroadcastGetMessageDataResponse): void {
    setMessageData(data.getMessageId() ?? 0, data.getMessageData() ?? null);
}
export function updateOnFailedMsgBroadcastGetMessageData(data: BroadcastGetMessageDataResponse): void {
    const messageId = data.getMessageId();
    if (messageId != null) {
        _messageDataAccessor.updateOnRequestFailed(messageId);
    }
}
