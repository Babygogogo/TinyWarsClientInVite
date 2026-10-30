import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import {
    updateOnFailedMsgMeGetAllMapDataTimestamps,
    updateOnMsgMeGetAllMapDataTimestamps,
    updateOnMsgMeGetMapDataArray,
    updateOnMsgMeGetMapDataTimestamp,
    updateOnFailedMsgMeGetMapData,
    updateOnMsgMeGetMapData,
    updateOnMsgMeDeleteSlot,
} from "./MeModel.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { S as MeDeleteSlotResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeDeleteSlot/S.ts";
import type { S as MeGetAllMapDataTimestampsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeGetAllMapDataTimestamps/S.ts";
import type { S as MeGetMapDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapData/S.ts";
import type { S as MeGetMapDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapDataArray/S.ts";
import type { S as MeGetMapDataTimestampResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapDataTimestamp/S.ts";
import type { S as MeSubmitNormalMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import type { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgMeGetAllMapDataTimestamps,    callback: _onMsgMeGetAllMapDataTimestamps },
        { msgCode: MessageCodes.MsgMeGetMapDataTimestamp,        callback: _onMsgMeGetMapDataTimestamp },
        { msgCode: MessageCodes.MsgMeGetMapData,                 callback: _onMsgMeGetMapData },
        { msgCode: MessageCodes.MsgMeGetMapDataArray,            callback: _onMsgMeGetMapDataArray },
        { msgCode: MessageCodes.MsgMeSubmitNormalMap,            callback: _onMsgMeSubmitNormalMap },
        { msgCode: MessageCodes.MsgMeDeleteSlot,                 callback: _onMsgMeDeleteSlot },
    ], null);
}

export function reqMeGetAllMapDataTimestamps(): void {
    send({ MsgMeGetAllMapDataTimestamps: { c: {
    } }, });
}
async function _onMsgMeGetAllMapDataTimestamps(e: Event): Promise<void> {
    const data = e.data as MeGetAllMapDataTimestampsResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgMeGetAllMapDataTimestamps(data);
    } else {
        await updateOnMsgMeGetAllMapDataTimestamps(data);
        dispatch(TypeId.MsgMeGetAllMapDataTimestamps, data);
    }
}

export function reqMeGetMapDataArray(slotIndexArray: number[]): void {
    send({ MsgMeGetMapDataArray: { c:{
        slotIndexArray  : slotIndexArray,
    } } });
}
async function _onMsgMeGetMapDataArray(e: Event): Promise<void> {
    const data = e.data as MeGetMapDataArrayResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMeGetMapDataArray(data);
        dispatch(TypeId.MsgMeGetMapDataArray, data);
    }
}

export function reqMeGetMapDataTimestamp(slotIndex: number): void {
    send({ MsgMeGetMapDataTimestamp: { c: {
        slotIndex   : slotIndex,
    } } });
}
async function _onMsgMeGetMapDataTimestamp(e: Event): Promise<void> {
    const data = e.data as MeGetMapDataTimestampResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMeGetMapDataTimestamp(data);
        dispatch(TypeId.MsgMeGetMapDataTimestamp, data);
    }
}

export function reqMeGetMapData(slotIndex: number): void {
    send({ MsgMeGetMapData: { c: {
        slotIndex   : slotIndex,
    }, } });
}
async function _onMsgMeGetMapData(e: Event): Promise<void> {
    const data = e.data as MeGetMapDataResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgMeGetMapData(data);
    } else {
        await updateOnMsgMeGetMapData(data);
        dispatch(TypeId.MsgMeGetMapData, data);
    }
}

export function reqMeSubmitNormalMap({ slotIndex, mapRawData, needReview, srcNormalMapIdForAddEvent, gridMarkData }: {
    slotIndex                   : number;
    mapRawData                  : MapRawData;
    needReview                  : boolean;
    srcNormalMapIdForAddEvent   : number | null;
    gridMarkData                : Undefinable<GridMarkData>;
}): void {
    send({
        MsgMeSubmitNormalMap: { c: {
            slotIndex                   : slotIndex,
            needReview                  : needReview,
            mapRawData                  : mapRawData.toJson(),
            srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
            gridMarkData                : gridMarkData?.toJson(),
        }, }
    });
}
function _onMsgMeSubmitNormalMap(e: Event): void {
    const data = e.data as MeSubmitNormalMapResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMeSubmitNormalMap, data);
    }
}

export function reqMeDeleteSlot(slotIndex: number): void {
    send({
        MsgMeDeleteSlot: { c: {
            slotIndex,
        } },
    });
}
async function _onMsgMeDeleteSlot(e: Event): Promise<void> {
    const data = e.data as MeDeleteSlotResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMeDeleteSlot(data);
        dispatch(TypeId.MsgMeDeleteSlot, data);
    }
}
