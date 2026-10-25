import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../auxiliaryTypes/CachedDataAccessor.ts";
import { reqBroadcastGetMessageData } from "./Gateway.ts";
import { getNonNullElements } from "../helpers/Collection.ts";
import { getExisted } from "../helpers/Misc.ts";
import type {
    BroadcastMessage as ProtoSchemaCommonProtoBroadcastBroadcastMessage,
} from "../proto/schema/CommonProto/Broadcast/BroadcastMessage.ts";
import type { S } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastGetMessageData/S.ts";
import { getServerTimestamp } from "../timer/TimerModel.ts";

type BroadcastMessage   = ProtoSchemaCommonProtoBroadcastBroadcastMessage;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

const _allMessageIdArray    : number[] = [];
const _messageDataAccessor  = new CachedDataAccessor<number, BroadcastMessage>({
    reqData : (messageId: number) => reqBroadcastGetMessageData(messageId),
});

export function setAllMessageIdArray(messageIdArray: number[]): void {
    _allMessageIdArray.length = 0;
    _allMessageIdArray.push(...messageIdArray);
}
export function getAllMessageIdArray(): number[] {
    return _allMessageIdArray;
}

export function getMessageData(messageId: number): Promise<Undefinable<BroadcastMessage>> {
    return _messageDataAccessor.getData(messageId);
}
function setMessageData(messageId: number, messageData: Undefinable<BroadcastMessage>): void {
    _messageDataAccessor.setData(messageId, messageData);
}

export async function getOngoingMessageIdArray(): Promise<number[]> {
    const currTime      = getServerTimestamp();
    const promiseArray  : Promise<number | null>[] = [];
    for (const messageId of getAllMessageIdArray()) {
        promiseArray.push((async () => {
            const messageData = await getMessageData(messageId);
            if ((messageData)                                                           &&
                (getExisted(messageData.getStartTime()) <= currTime)   &&
                (getExisted(messageData.getEndTime()) >= currTime)
            ) {
                return messageId;
            } else {
                return null;
            }
        })());
    }
    return getNonNullElements(await Promise.all(promiseArray));
}

export function updateOnMsgBroadcastGetMessageData(data: S): void {
    setMessageData(data.getMessageId() ?? 0, data.getMessageData() ?? null);
}
export function updateOnFailedMsgBroadcastGetMessageData(data: S): void {
    const messageId = data.getMessageId();
    if (messageId != null) {
        _messageDataAccessor.updateOnRequestFailed(messageId);
    }
}
