import * as HelpersGzip from "../../helpers/Gzip.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwC from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/C.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSfw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwC from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/C.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmDeleteWarSaveSlotS from "../../proto/schema/CommonProto/NetMessage/MsgSpmDeleteWarSaveSlot/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetAllWarSaveSlotTimestamps/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetRankList/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetReplayData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataArrayS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullDataArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmSaveScwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveScw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSfwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSfw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSrwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSrw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmValidateSrwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmValidateSrw/S.ts";
import type * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as SinglePlayerModeModelSpmModel from "./SpmModel.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../singlePlayerWar/interface/ISpwWar.ts";
import type * as SingleRankWarInterfaceISrwWar from "../../singleRankWar/interface/ISrwWar.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmCreateScw,                     callback: _onMsgSpmCreateScw },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmCreateSfw,                     callback: _onMsgSpmCreateSfw },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmCreateSrw,                     callback: _onMsgSpmCreateSrw },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmGetAllWarSaveSlotTimestamps,   callback: _onMsgSpmGetAllWarSaveSlotTimestamps },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmGetWarSaveSlotFullData,        callback: _onMsgSpmGetWarSaveSlotFullData },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmGetWarSaveSlotFullDataArray,   callback: _onMsgSpmGetWarSaveSlotFullDataArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmDeleteWarSaveSlot,             callback: _onMsgSpmDeleteWarSaveSlot },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmSaveScw,                       callback: _onMsgSpmSaveScw },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmSaveSfw,                       callback: _onMsgSpmSaveSfw },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmSaveSrw,                       callback: _onMsgSpmSaveSrw },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmGetRankList,                   callback: _onMsgSpmGetRankList },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmValidateSrw,                   callback: _onMsgSpmValidateSrw },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgSpmGetReplayData,                 callback: _onMsgSpmGetReplayData },
    ], null);
}

export function reqSpmGetAllWarSaveSlotTimestamps(): void {
    NetworksManager.send({ MsgSpmGetAllWarSaveSlotTimestamps: { c: {
    } } });
}
function _onMsgSpmGetAllWarSaveSlotTimestamps(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS.S;
    if (data.getErrorCode()) {
        SinglePlayerModeModelSpmModel.updateOnFailedMsgSpmGetAllWarSaveSlotTimestamps(data);
    } else {
        SinglePlayerModeModelSpmModel.updateOnMsgSpmGetAllWarSaveSlotTimestamps(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmGetAllWarSaveSlotTimestamps, data);
    }
}

export function reqSpmGetWarSaveSlotFullDataArray(slotIndexArray: number[]): void {
    NetworksManager.send({ MsgSpmGetWarSaveSlotFullDataArray: { c: {
        slotIndexArray: slotIndexArray,
    }, }, });
}
async function _onMsgSpmGetWarSaveSlotFullDataArray(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataArrayS.S;
    if (!data.getErrorCode()) {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmGetWarSaveSlotFullDataArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmGetWarSaveFullDataArray, data);
    }
}

export function reqSpmGetWarSaveSlotFullData(slotIndex: number): void {
    NetworksManager.send({
        MsgSpmGetWarSaveSlotFullData: { c: {
            slotIndex,
        }, },
    });
}
async function _onMsgSpmGetWarSaveSlotFullData(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS.S;
    if (data.getErrorCode()) {
        SinglePlayerModeModelSpmModel.updateOnFailedMsgSpmGetWarSaveSlotFullData(data);
    } else {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmGetWarSaveSlotFullData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmGetWarSaveFullData, data);
    }
}

export function reqSpmCreateScw(param: ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwC.C): void {
    NetworksManager.send({
        MsgSpmCreateScw: { c: param.toJson() },
    });
}
async function _onMsgSpmCreateScw(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwS.S;
    if (!data.getErrorCode()) {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmCreateScw(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmCreateScw, data);
    }
}

export function reqSpmCreateSfw({ slotIndex, slotExtraData, warData }: {
    slotIndex       : number;
    slotExtraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData;
    warData         : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
}): void {
    NetworksManager.send({
        MsgSpmCreateSfw: { c: {
            slotIndex       : slotIndex,
            slotExtraData   : slotExtraData.toJson(),
            warData         : warData.toJson(),
        }, },
    });
}
async function _onMsgSpmCreateSfw(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS.S;
    if (!data.getErrorCode()) {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmCreateSfw(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmCreateSfw, data);
    }
}

export function reqSpmCreateSrw(data: ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwC.C): void {
    NetworksManager.send({
        MsgSpmCreateSrw: { c: data.toJson() },
    });
}
async function _onMsgSpmCreateSrw(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwS.S;
    if (!data.getErrorCode()) {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmCreateSrw(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmCreateSrw, data);
    }
}

export function reqSpmSaveScw(war: SinglePlayerWarInterfaceISpwWar.ISpwWar): void {
    NetworksManager.send({
        MsgSpmSaveScw: { c: {
            slotIndex           : war.getSaveSlotIndex(),
            slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
            compressedWarData   : HelpersGzip.compress(war.serialize().encode()),
        }, },
    });
}
async function _onMsgSpmSaveScw(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmSaveScwS.S;
    if (!data.getErrorCode()) {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmSaveScw(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmSaveScw, data);
    }
}

export function reqSpmSaveSfw(war: SinglePlayerWarInterfaceISpwWar.ISpwWar): void {
    NetworksManager.send({
        MsgSpmSaveSfw: { c: {
            slotIndex           : war.getSaveSlotIndex(),
            slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
            compressedWarData   : HelpersGzip.compress(war.serialize().encode()),
        }, },
    });
}
async function _onMsgSpmSaveSfw(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSfwS.S;
    if (!data.getErrorCode()) {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmSaveSfw(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmSaveSfw, data);
    }
}

export function reqSpmSaveSrw(war: SinglePlayerWarInterfaceISpwWar.ISpwWar): void {
    NetworksManager.send({
        MsgSpmSaveSrw: { c: {
            slotIndex           : war.getSaveSlotIndex(),
            slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
            compressedWarData   : HelpersGzip.compress(war.serialize().encode()),
        }, },
    });
}
async function _onMsgSpmSaveSrw(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSrwS.S;
    if (!data.getErrorCode()) {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmSaveSrw(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmSaveSrw, data);
    }
}

export function reqSpmDeleteWarSaveSlot(slotIndex: number): void {
    NetworksManager.send({
        MsgSpmDeleteWarSaveSlot: { c: {
            slotIndex,
        } },
    });
}
async function _onMsgSpmDeleteWarSaveSlot(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmDeleteWarSaveSlotS.S;
    if (!data.getErrorCode()) {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmDeleteWarSaveSlot(HelpersMisc.getExisted(data.getSlotIndex()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmDeleteWarSaveSlot, data);
    }
}

export function reqSpmGetRankList(normalMapId: number): void {
    NetworksManager.send({
        MsgSpmGetRankList: { c: {
            normalMapId,
        } },
    });
}
function _onMsgSpmGetRankList(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListS.S;
    if (!data.getErrorCode()) {
        SinglePlayerModeModelSpmModel.updateOnMsgSpmGetRankList(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmGetRankList, data);
    }
}

export function reqSpmValidateSrw(war: SingleRankWarInterfaceISrwWar.ISrwWar): void {
    NetworksManager.send({
        MsgSpmValidateSrw: { c: {
            warData     : war.serializeForValidation().toJson(),
        } },
    });
}
function _onMsgSpmValidateSrw(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmValidateSrwS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmValidateSrw, data);
    }
}

export function reqSpmGetReplayData(rankId: number): void {
    NetworksManager.send({
        MsgSpmGetReplayData: { c: {
            rankId,
        } },
    });
}
async function _onMsgSpmGetReplayData(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS.S;
    if (data.getErrorCode()) {
        SinglePlayerModeModelSpmModel.updateOnFailedMsgSpmGetReplayData(data);
    } else {
        await SinglePlayerModeModelSpmModel.updateOnMsgSpmGetReplayData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgSpmGetReplayData, data);
    }
}
