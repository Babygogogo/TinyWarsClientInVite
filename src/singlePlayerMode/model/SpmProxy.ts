import {
    Networks_Manager,
    Helpers_Gzip,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    Notifications_TypeId,
    SinglePlayerMode_Model_SpmModel,
    type Egret_Egret,
    type SinglePlayerWar_Interface_ISpwWar,
    type SingleRankWar_Interface_ISrwWar,
} from "../../internal.ts";
import type { C as SpmCreateScwRequest } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/C.ts";
import type { S as SpmCreateScwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/S.ts";
import type { S as SpmCreateSfwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSfw/S.ts";
import type { C as SpmCreateSrwRequest } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/C.ts";
import type { S as SpmCreateSrwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/S.ts";
import type { S as SpmDeleteWarSaveSlotResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmDeleteWarSaveSlot/S.ts";
import type { S as SpmGetAllWarSaveSlotTimestampsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetAllWarSaveSlotTimestamps/S.ts";
import type { S as SpmGetRankListResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetRankList/S.ts";
import type { S as SpmGetReplayDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetReplayData/S.ts";
import type { S as SpmGetWarSaveSlotFullDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullData/S.ts";
import type { S as SpmGetWarSaveSlotFullDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullDataArray/S.ts";
import type { S as SpmSaveScwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveScw/S.ts";
import type { S as SpmSaveSfwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSfw/S.ts";
import type { S as SpmSaveSrwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSrw/S.ts";
import type { S as SpmValidateSrwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmValidateSrw/S.ts";
import type { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmCreateScw,                     callback: _onMsgSpmCreateScw },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmCreateSfw,                     callback: _onMsgSpmCreateSfw },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmCreateSrw,                     callback: _onMsgSpmCreateSrw },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmGetAllWarSaveSlotTimestamps,   callback: _onMsgSpmGetAllWarSaveSlotTimestamps },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmGetWarSaveSlotFullData,        callback: _onMsgSpmGetWarSaveSlotFullData },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmGetWarSaveSlotFullDataArray,   callback: _onMsgSpmGetWarSaveSlotFullDataArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmDeleteWarSaveSlot,             callback: _onMsgSpmDeleteWarSaveSlot },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmSaveScw,                       callback: _onMsgSpmSaveScw },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmSaveSfw,                       callback: _onMsgSpmSaveSfw },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmSaveSrw,                       callback: _onMsgSpmSaveSrw },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmGetRankList,                   callback: _onMsgSpmGetRankList },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmValidateSrw,                   callback: _onMsgSpmValidateSrw },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgSpmGetReplayData,                 callback: _onMsgSpmGetReplayData },
    ], null);
}

export function reqSpmGetAllWarSaveSlotTimestamps(): void {
    Networks_Manager.send({ MsgSpmGetAllWarSaveSlotTimestamps: { c: {
    } } });
}
function _onMsgSpmGetAllWarSaveSlotTimestamps(e: Egret_Egret.Event): void {
    const data = e.data as SpmGetAllWarSaveSlotTimestampsResponse;
    if (data.getErrorCode()) {
        SinglePlayerMode_Model_SpmModel.updateOnFailedMsgSpmGetAllWarSaveSlotTimestamps(data);
    } else {
        SinglePlayerMode_Model_SpmModel.updateOnMsgSpmGetAllWarSaveSlotTimestamps(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmGetAllWarSaveSlotTimestamps, data);
    }
}

export function reqSpmGetWarSaveSlotFullDataArray(slotIndexArray: number[]): void {
    Networks_Manager.send({ MsgSpmGetWarSaveSlotFullDataArray: { c: {
        slotIndexArray: slotIndexArray,
    }, }, });
}
async function _onMsgSpmGetWarSaveSlotFullDataArray(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmGetWarSaveSlotFullDataArrayResponse;
    if (!data.getErrorCode()) {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmGetWarSaveSlotFullDataArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmGetWarSaveFullDataArray, data);
    }
}

export function reqSpmGetWarSaveSlotFullData(slotIndex: number): void {
    Networks_Manager.send({
        MsgSpmGetWarSaveSlotFullData: { c: {
            slotIndex,
        }, },
    });
}
async function _onMsgSpmGetWarSaveSlotFullData(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmGetWarSaveSlotFullDataResponse;
    if (data.getErrorCode()) {
        SinglePlayerMode_Model_SpmModel.updateOnFailedMsgSpmGetWarSaveSlotFullData(data);
    } else {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmGetWarSaveSlotFullData(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmGetWarSaveFullData, data);
    }
}

export function reqSpmCreateScw(param: SpmCreateScwRequest): void {
    Networks_Manager.send({
        MsgSpmCreateScw: { c: param.toJson() },
    });
}
async function _onMsgSpmCreateScw(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmCreateScwResponse;
    if (!data.getErrorCode()) {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmCreateScw(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmCreateScw, data);
    }
}

export function reqSpmCreateSfw({ slotIndex, slotExtraData, warData }: {
    slotIndex       : number;
    slotExtraData   : SpmWarSaveSlotExtraData;
    warData         : SerialWar;
}): void {
    Networks_Manager.send({
        MsgSpmCreateSfw: { c: {
            slotIndex       : slotIndex,
            slotExtraData   : slotExtraData.toJson(),
            warData         : warData.toJson(),
        }, },
    });
}
async function _onMsgSpmCreateSfw(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmCreateSfwResponse;
    if (!data.getErrorCode()) {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmCreateSfw(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmCreateSfw, data);
    }
}

export function reqSpmCreateSrw(data: SpmCreateSrwRequest): void {
    Networks_Manager.send({
        MsgSpmCreateSrw: { c: data.toJson() },
    });
}
async function _onMsgSpmCreateSrw(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmCreateSrwResponse;
    if (!data.getErrorCode()) {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmCreateSrw(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmCreateSrw, data);
    }
}

export function reqSpmSaveScw(war: SinglePlayerWar_Interface_ISpwWar.ISpwWar): void {
    Networks_Manager.send({
        MsgSpmSaveScw: { c: {
            slotIndex           : war.getSaveSlotIndex(),
            slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
            compressedWarData   : Helpers_Gzip.compress(war.serialize().encode()),
        }, },
    });
}
async function _onMsgSpmSaveScw(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmSaveScwResponse;
    if (!data.getErrorCode()) {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmSaveScw(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmSaveScw, data);
    }
}

export function reqSpmSaveSfw(war: SinglePlayerWar_Interface_ISpwWar.ISpwWar): void {
    Networks_Manager.send({
        MsgSpmSaveSfw: { c: {
            slotIndex           : war.getSaveSlotIndex(),
            slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
            compressedWarData   : Helpers_Gzip.compress(war.serialize().encode()),
        }, },
    });
}
async function _onMsgSpmSaveSfw(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmSaveSfwResponse;
    if (!data.getErrorCode()) {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmSaveSfw(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmSaveSfw, data);
    }
}

export function reqSpmSaveSrw(war: SinglePlayerWar_Interface_ISpwWar.ISpwWar): void {
    Networks_Manager.send({
        MsgSpmSaveSrw: { c: {
            slotIndex           : war.getSaveSlotIndex(),
            slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
            compressedWarData   : Helpers_Gzip.compress(war.serialize().encode()),
        }, },
    });
}
async function _onMsgSpmSaveSrw(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmSaveSrwResponse;
    if (!data.getErrorCode()) {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmSaveSrw(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmSaveSrw, data);
    }
}

export function reqSpmDeleteWarSaveSlot(slotIndex: number): void {
    Networks_Manager.send({
        MsgSpmDeleteWarSaveSlot: { c: {
            slotIndex,
        } },
    });
}
async function _onMsgSpmDeleteWarSaveSlot(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmDeleteWarSaveSlotResponse;
    if (!data.getErrorCode()) {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmDeleteWarSaveSlot(Helpers_Misc.getExisted(data.getSlotIndex()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmDeleteWarSaveSlot, data);
    }
}

export function reqSpmGetRankList(normalMapId: number): void {
    Networks_Manager.send({
        MsgSpmGetRankList: { c: {
            normalMapId,
        } },
    });
}
function _onMsgSpmGetRankList(e: Egret_Egret.Event): void {
    const data = e.data as SpmGetRankListResponse;
    if (!data.getErrorCode()) {
        SinglePlayerMode_Model_SpmModel.updateOnMsgSpmGetRankList(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmGetRankList, data);
    }
}

export function reqSpmValidateSrw(war: SingleRankWar_Interface_ISrwWar.ISrwWar): void {
    Networks_Manager.send({
        MsgSpmValidateSrw: { c: {
            warData     : war.serializeForValidation().toJson(),
        } },
    });
}
function _onMsgSpmValidateSrw(e: Egret_Egret.Event): void {
    const data = e.data as SpmValidateSrwResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmValidateSrw, data);
    }
}

export function reqSpmGetReplayData(rankId: number): void {
    Networks_Manager.send({
        MsgSpmGetReplayData: { c: {
            rankId,
        } },
    });
}
async function _onMsgSpmGetReplayData(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as SpmGetReplayDataResponse;
    if (data.getErrorCode()) {
        SinglePlayerMode_Model_SpmModel.updateOnFailedMsgSpmGetReplayData(data);
    } else {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgSpmGetReplayData(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgSpmGetReplayData, data);
    }
}
