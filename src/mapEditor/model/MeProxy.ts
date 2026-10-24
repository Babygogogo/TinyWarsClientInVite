import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as MapEditorModelMeModel from "./MeModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeDeleteSlotS from "../../proto/schema/CommonProto/NetMessage/MsgMeDeleteSlot/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeGetAllMapDataTimestampsS from "../../proto/schema/CommonProto/NetMessage/MsgMeGetAllMapDataTimestamps/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataS from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapDataArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataTimestampS from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapDataTimestamp/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import type * as ProtoSchemaCommonProtoStructureGridMarkData from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type GridMarkData       = ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData;

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMeGetAllMapDataTimestamps,    callback: _onMsgMeGetAllMapDataTimestamps },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMeGetMapDataTimestamp,        callback: _onMsgMeGetMapDataTimestamp },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMeGetMapData,                 callback: _onMsgMeGetMapData },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMeGetMapDataArray,            callback: _onMsgMeGetMapDataArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMeSubmitNormalMap,            callback: _onMsgMeSubmitNormalMap },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMeDeleteSlot,                 callback: _onMsgMeDeleteSlot },
    ], null);
}

export function reqMeGetAllMapDataTimestamps(): void {
    NetworksManager.send({ MsgMeGetAllMapDataTimestamps: { c: {
    } }, });
}
async function _onMsgMeGetAllMapDataTimestamps(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMeGetAllMapDataTimestampsS.S;
    if (data.getErrorCode()) {
        MapEditorModelMeModel.updateOnFailedMsgMeGetAllMapDataTimestamps(data);
    } else {
        await MapEditorModelMeModel.updateOnMsgMeGetAllMapDataTimestamps(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMeGetAllMapDataTimestamps, data);
    }
}

export function reqMeGetMapDataArray(slotIndexArray: number[]): void {
    NetworksManager.send({ MsgMeGetMapDataArray: { c:{
        slotIndexArray  : slotIndexArray,
    } } });
}
async function _onMsgMeGetMapDataArray(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataArrayS.S;
    if (!data.getErrorCode()) {
        await MapEditorModelMeModel.updateOnMsgMeGetMapDataArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMeGetMapDataArray, data);
    }
}

export function reqMeGetMapDataTimestamp(slotIndex: number): void {
    NetworksManager.send({ MsgMeGetMapDataTimestamp: { c: {
        slotIndex   : slotIndex,
    } } });
}
async function _onMsgMeGetMapDataTimestamp(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataTimestampS.S;
    if (!data.getErrorCode()) {
        await MapEditorModelMeModel.updateOnMsgMeGetMapDataTimestamp(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMeGetMapDataTimestamp, data);
    }
}

export function reqMeGetMapData(slotIndex: number): void {
    NetworksManager.send({ MsgMeGetMapData: { c: {
        slotIndex   : slotIndex,
    }, } });
}
async function _onMsgMeGetMapData(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataS.S;
    if (data.getErrorCode()) {
        MapEditorModelMeModel.updateOnFailedMsgMeGetMapData(data);
    } else {
        await MapEditorModelMeModel.updateOnMsgMeGetMapData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMeGetMapData, data);
    }
}

export function reqMeSubmitNormalMap({ slotIndex, mapRawData, needReview, srcNormalMapIdForAddEvent, gridMarkData }: {
    slotIndex                   : number;
    mapRawData                  : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
    needReview                  : boolean;
    srcNormalMapIdForAddEvent   : number | null;
    gridMarkData                : AuxiliaryTypesAuxiliaryTypes.Undefinable<GridMarkData>;
}): void {
    NetworksManager.send({
        MsgMeSubmitNormalMap: { c: {
            slotIndex                   : slotIndex,
            needReview                  : needReview,
            mapRawData                  : mapRawData.toJson(),
            srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
            gridMarkData                : gridMarkData?.toJson(),
        }, }
    });
}
function _onMsgMeSubmitNormalMap(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMeSubmitNormalMap, data);
    }
}

export function reqMeDeleteSlot(slotIndex: number): void {
    NetworksManager.send({
        MsgMeDeleteSlot: { c: {
            slotIndex,
        } },
    });
}
async function _onMsgMeDeleteSlot(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMeDeleteSlotS.S;
    if (!data.getErrorCode()) {
        await MapEditorModelMeModel.updateOnMsgMeDeleteSlot(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMeDeleteSlot, data);
    }
}
