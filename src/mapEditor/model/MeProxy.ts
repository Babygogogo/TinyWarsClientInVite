import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    MapEditor_Model_MeModel,
    type Egret_Egret,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { S as MeDeleteSlotResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeDeleteSlot/S.ts";
import type { S as MeGetAllMapDataTimestampsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeGetAllMapDataTimestamps/S.ts";
import type { S as MeGetMapDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapData/S.ts";
import type { S as MeGetMapDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapDataArray/S.ts";
import type { S as MeGetMapDataTimestampResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapDataTimestamp/S.ts";
import type { S as MeSubmitNormalMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import type { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMeGetAllMapDataTimestamps,    callback : _onMsgMeGetAllMapDataTimestamps },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMeGetMapDataTimestamp,        callback : _onMsgMeGetMapDataTimestamp },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMeGetMapData,                 callback : _onMsgMeGetMapData },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMeGetMapDataArray,            callback : _onMsgMeGetMapDataArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMeSubmitNormalMap,            callback : _onMsgMeSubmitNormalMap },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMeDeleteSlot,                 callback : _onMsgMeDeleteSlot },
    ], null);
}

export function reqMeGetAllMapDataTimestamps(): void {
    Networks_Manager.send({
        MsgMeGetAllMapDataTimestamps : {
            c : {
            }, 
        }, 
    });
}
async function _onMsgMeGetAllMapDataTimestamps(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMeGetAllMapDataTimestamps"]>): Promise<void> {
    const data = e.data as MeGetAllMapDataTimestampsResponse;
    if (data.getErrorCode()) {
        MapEditor_Model_MeModel.updateOnFailedMsgMeGetAllMapDataTimestamps(data);
    } else {
        await MapEditor_Model_MeModel.updateOnMsgMeGetAllMapDataTimestamps(data);
        Notifications_Dispatcher.dispatch("MsgMeGetAllMapDataTimestamps", { msg: data });
    }
}

export function reqMeGetMapDataArray(slotIndexArray: number[]): void {
    Networks_Manager.send({
        MsgMeGetMapDataArray : {
            c : {
                slotIndexArray : slotIndexArray,
            }, 
        }, 
    });
}
async function _onMsgMeGetMapDataArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMeGetMapDataArray"]>): Promise<void> {
    const data = e.data as MeGetMapDataArrayResponse;
    if (!data.getErrorCode()) {
        await MapEditor_Model_MeModel.updateOnMsgMeGetMapDataArray(data);
        Notifications_Dispatcher.dispatch("MsgMeGetMapDataArray", { msg: data });
    }
}

export function reqMeGetMapDataTimestamp(slotIndex: number): void {
    Networks_Manager.send({
        MsgMeGetMapDataTimestamp : {
            c : {
                slotIndex : slotIndex,
            }, 
        }, 
    });
}
async function _onMsgMeGetMapDataTimestamp(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMeGetMapDataTimestamp"]>): Promise<void> {
    const data = e.data as MeGetMapDataTimestampResponse;
    if (!data.getErrorCode()) {
        await MapEditor_Model_MeModel.updateOnMsgMeGetMapDataTimestamp(data);
        Notifications_Dispatcher.dispatch("MsgMeGetMapDataTimestamp", { msg: data });
    }
}

export function reqMeGetMapData(slotIndex: number): void {
    Networks_Manager.send({
        MsgMeGetMapData : {
            c : {
                slotIndex : slotIndex,
            }, 
        }, 
    });
}
async function _onMsgMeGetMapData(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMeGetMapData"]>): Promise<void> {
    const data = e.data as MeGetMapDataResponse;
    if (data.getErrorCode()) {
        MapEditor_Model_MeModel.updateOnFailedMsgMeGetMapData(data);
    } else {
        await MapEditor_Model_MeModel.updateOnMsgMeGetMapData(data);
        Notifications_Dispatcher.dispatch("MsgMeGetMapData", { msg: data });
    }
}

export function reqMeSubmitNormalMap({ slotIndex, mapRawData, needReview, srcNormalMapIdForAddEvent, gridMarkData }: {
    slotIndex                   : number;
    mapRawData                  : MapRawData;
    needReview                  : boolean;
    srcNormalMapIdForAddEvent   : number | null;
    gridMarkData                : AuxiliaryTypes_AuxiliaryTypes.Undefinable<GridMarkData>;
}): void {
    Networks_Manager.send({
        MsgMeSubmitNormalMap : {
            c : {
                slotIndex                 : slotIndex,
                needReview                : needReview,
                mapRawData                : mapRawData.toJson(),
                srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                gridMarkData              : gridMarkData?.toJson(),
            }, 
        },
    });
}
function _onMsgMeSubmitNormalMap(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMeSubmitNormalMap"]>): void {
    const data = e.data as MeSubmitNormalMapResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMeSubmitNormalMap", { msg: data });
    }
}

export function reqMeDeleteSlot(slotIndex: number): void {
    Networks_Manager.send({
        MsgMeDeleteSlot : {
            c : {
                slotIndex,
            }, 
        },
    });
}
async function _onMsgMeDeleteSlot(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMeDeleteSlot"]>): Promise<void> {
    const data = e.data as MeDeleteSlotResponse;
    if (!data.getErrorCode()) {
        await MapEditor_Model_MeModel.updateOnMsgMeDeleteSlot(data);
        Notifications_Dispatcher.dispatch("MsgMeDeleteSlot", { msg: data });
    }
}
