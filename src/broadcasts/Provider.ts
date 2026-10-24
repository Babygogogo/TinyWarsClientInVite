import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../auxiliaryTypes/CachedDataAccessor.ts";
import * as BroadcastsGateway from "./Gateway.ts";
import * as HelpersCollection from "../helpers/Collection.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoBroadcastBroadcastMessage from "../proto/schema/CommonProto/Broadcast/BroadcastMessage.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgBroadcastGetMessageDataS from "../proto/schema/CommonProto/NetMessage/MsgBroadcastGetMessageData/S.ts";
import * as TimerTimerModel from "../timer/TimerModel.ts";

type BroadcastMessage   = ProtoSchemaCommonProtoBroadcastBroadcastMessage.BroadcastMessage;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

const _allMessageIdArray    : number[] = [];
const _messageDataAccessor  = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, BroadcastMessage>({
    reqData : (messageId: number) => BroadcastsGateway.reqBroadcastGetMessageData(messageId),
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
    const currTime      = TimerTimerModel.getServerTimestamp();
    const promiseArray  : Promise<number | null>[] = [];
    for (const messageId of getAllMessageIdArray()) {
        promiseArray.push((async () => {
            const messageData = await getMessageData(messageId);
            if ((messageData)                                                           &&
                (HelpersMisc.getExisted(messageData.getStartTime()) <= currTime)   &&
                (HelpersMisc.getExisted(messageData.getEndTime()) >= currTime)
            ) {
                return messageId;
            } else {
                return null;
            }
        })());
    }
    return HelpersCollection.getNonNullElements(await Promise.all(promiseArray));
}

export function updateOnMsgBroadcastGetMessageData(data: ProtoSchemaCommonProtoNetMessageMsgBroadcastGetMessageDataS.S): void {
    setMessageData(data.getMessageId() ?? 0, data.getMessageData() ?? null);
}
export function updateOnFailedMsgBroadcastGetMessageData(data: ProtoSchemaCommonProtoNetMessageMsgBroadcastGetMessageDataS.S): void {
    const messageId = data.getMessageId();
    if (messageId != null) {
        _messageDataAccessor.updateOnRequestFailed(messageId);
    }
}
