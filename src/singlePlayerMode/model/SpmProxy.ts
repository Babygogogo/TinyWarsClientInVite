import { compress } from "../../helpers/Gzip.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { C } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/C.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSfw/S.ts";
import type { C as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwC } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/C.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmDeleteWarSaveSlotS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmDeleteWarSaveSlot/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetAllWarSaveSlotTimestamps/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetRankList/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetReplayData/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullData/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullDataArray/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmSaveScwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveScw/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSfwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSfw/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSrwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSrw/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmValidateSrwS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmValidateSrw/S.ts";
import type { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import {
    updateOnFailedMsgSpmGetAllWarSaveSlotTimestamps,
    updateOnMsgSpmGetAllWarSaveSlotTimestamps,
    updateOnMsgSpmGetWarSaveSlotFullDataArray,
    updateOnFailedMsgSpmGetWarSaveSlotFullData,
    updateOnMsgSpmGetWarSaveSlotFullData,
    updateOnMsgSpmCreateScw,
    updateOnMsgSpmCreateSfw,
    updateOnMsgSpmCreateSrw,
    updateOnMsgSpmSaveScw,
    updateOnMsgSpmSaveSfw,
    updateOnMsgSpmSaveSrw,
    updateOnMsgSpmDeleteWarSaveSlot,
    updateOnMsgSpmGetRankList,
    updateOnFailedMsgSpmGetReplayData,
    updateOnMsgSpmGetReplayData,
} from "./SpmModel.ts";
import type { ISpwWar } from "../../singlePlayerWar/interface/ISpwWar.ts";
import type { ISrwWar } from "../../singleRankWar/interface/ISrwWar.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgSpmCreateScw,                     callback: _onMsgSpmCreateScw },
        { msgCode: MessageCodes.MsgSpmCreateSfw,                     callback: _onMsgSpmCreateSfw },
        { msgCode: MessageCodes.MsgSpmCreateSrw,                     callback: _onMsgSpmCreateSrw },
        { msgCode: MessageCodes.MsgSpmGetAllWarSaveSlotTimestamps,   callback: _onMsgSpmGetAllWarSaveSlotTimestamps },
        { msgCode: MessageCodes.MsgSpmGetWarSaveSlotFullData,        callback: _onMsgSpmGetWarSaveSlotFullData },
        { msgCode: MessageCodes.MsgSpmGetWarSaveSlotFullDataArray,   callback: _onMsgSpmGetWarSaveSlotFullDataArray },
        { msgCode: MessageCodes.MsgSpmDeleteWarSaveSlot,             callback: _onMsgSpmDeleteWarSaveSlot },
        { msgCode: MessageCodes.MsgSpmSaveScw,                       callback: _onMsgSpmSaveScw },
        { msgCode: MessageCodes.MsgSpmSaveSfw,                       callback: _onMsgSpmSaveSfw },
        { msgCode: MessageCodes.MsgSpmSaveSrw,                       callback: _onMsgSpmSaveSrw },
        { msgCode: MessageCodes.MsgSpmGetRankList,                   callback: _onMsgSpmGetRankList },
        { msgCode: MessageCodes.MsgSpmValidateSrw,                   callback: _onMsgSpmValidateSrw },
        { msgCode: MessageCodes.MsgSpmGetReplayData,                 callback: _onMsgSpmGetReplayData },
    ], null);
}

export function reqSpmGetAllWarSaveSlotTimestamps(): void {
    send({ MsgSpmGetAllWarSaveSlotTimestamps: { c: {
    } } });
}
function _onMsgSpmGetAllWarSaveSlotTimestamps(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS;
    if (data.getErrorCode()) {
        updateOnFailedMsgSpmGetAllWarSaveSlotTimestamps(data);
    } else {
        updateOnMsgSpmGetAllWarSaveSlotTimestamps(data);
        dispatch(TypeId.MsgSpmGetAllWarSaveSlotTimestamps, data);
    }
}

export function reqSpmGetWarSaveSlotFullDataArray(slotIndexArray: number[]): void {
    send({ MsgSpmGetWarSaveSlotFullDataArray: { c: {
        slotIndexArray: slotIndexArray,
    }, }, });
}
async function _onMsgSpmGetWarSaveSlotFullDataArray(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataArrayS;
    if (!data.getErrorCode()) {
        await updateOnMsgSpmGetWarSaveSlotFullDataArray(data);
        dispatch(TypeId.MsgSpmGetWarSaveFullDataArray, data);
    }
}

export function reqSpmGetWarSaveSlotFullData(slotIndex: number): void {
    send({
        MsgSpmGetWarSaveSlotFullData: { c: {
            slotIndex,
        }, },
    });
}
async function _onMsgSpmGetWarSaveSlotFullData(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS;
    if (data.getErrorCode()) {
        updateOnFailedMsgSpmGetWarSaveSlotFullData(data);
    } else {
        await updateOnMsgSpmGetWarSaveSlotFullData(data);
        dispatch(TypeId.MsgSpmGetWarSaveFullData, data);
    }
}

export function reqSpmCreateScw(param: C): void {
    send({
        MsgSpmCreateScw: { c: param.toJson() },
    });
}
async function _onMsgSpmCreateScw(e: Event): Promise<void> {
    const data = e.data as S;
    if (!data.getErrorCode()) {
        await updateOnMsgSpmCreateScw(data);
        dispatch(TypeId.MsgSpmCreateScw, data);
    }
}

export function reqSpmCreateSfw({ slotIndex, slotExtraData, warData }: {
    slotIndex       : number;
    slotExtraData   : SpmWarSaveSlotExtraData;
    warData         : SerialWar;
}): void {
    send({
        MsgSpmCreateSfw: { c: {
            slotIndex       : slotIndex,
            slotExtraData   : slotExtraData.toJson(),
            warData         : warData.toJson(),
        }, },
    });
}
async function _onMsgSpmCreateSfw(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS;
    if (!data.getErrorCode()) {
        await updateOnMsgSpmCreateSfw(data);
        dispatch(TypeId.MsgSpmCreateSfw, data);
    }
}

export function reqSpmCreateSrw(data: ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwC): void {
    send({
        MsgSpmCreateSrw: { c: data.toJson() },
    });
}
async function _onMsgSpmCreateSrw(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwS;
    if (!data.getErrorCode()) {
        await updateOnMsgSpmCreateSrw(data);
        dispatch(TypeId.MsgSpmCreateSrw, data);
    }
}

export function reqSpmSaveScw(war: ISpwWar): void {
    send({
        MsgSpmSaveScw: { c: {
            slotIndex           : war.getSaveSlotIndex(),
            slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
            compressedWarData   : compress(war.serialize().encode()),
        }, },
    });
}
async function _onMsgSpmSaveScw(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmSaveScwS;
    if (!data.getErrorCode()) {
        await updateOnMsgSpmSaveScw(data);
        dispatch(TypeId.MsgSpmSaveScw, data);
    }
}

export function reqSpmSaveSfw(war: ISpwWar): void {
    send({
        MsgSpmSaveSfw: { c: {
            slotIndex           : war.getSaveSlotIndex(),
            slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
            compressedWarData   : compress(war.serialize().encode()),
        }, },
    });
}
async function _onMsgSpmSaveSfw(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSfwS;
    if (!data.getErrorCode()) {
        await updateOnMsgSpmSaveSfw(data);
        dispatch(TypeId.MsgSpmSaveSfw, data);
    }
}

export function reqSpmSaveSrw(war: ISpwWar): void {
    send({
        MsgSpmSaveSrw: { c: {
            slotIndex           : war.getSaveSlotIndex(),
            slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
            compressedWarData   : compress(war.serialize().encode()),
        }, },
    });
}
async function _onMsgSpmSaveSrw(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSrwS;
    if (!data.getErrorCode()) {
        await updateOnMsgSpmSaveSrw(data);
        dispatch(TypeId.MsgSpmSaveSrw, data);
    }
}

export function reqSpmDeleteWarSaveSlot(slotIndex: number): void {
    send({
        MsgSpmDeleteWarSaveSlot: { c: {
            slotIndex,
        } },
    });
}
async function _onMsgSpmDeleteWarSaveSlot(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmDeleteWarSaveSlotS;
    if (!data.getErrorCode()) {
        await updateOnMsgSpmDeleteWarSaveSlot(getExisted(data.getSlotIndex()));
        dispatch(TypeId.MsgSpmDeleteWarSaveSlot, data);
    }
}

export function reqSpmGetRankList(normalMapId: number): void {
    send({
        MsgSpmGetRankList: { c: {
            normalMapId,
        } },
    });
}
function _onMsgSpmGetRankList(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListS;
    if (!data.getErrorCode()) {
        updateOnMsgSpmGetRankList(data);
        dispatch(TypeId.MsgSpmGetRankList, data);
    }
}

export function reqSpmValidateSrw(war: ISrwWar): void {
    send({
        MsgSpmValidateSrw: { c: {
            warData     : war.serializeForValidation().toJson(),
        } },
    });
}
function _onMsgSpmValidateSrw(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmValidateSrwS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgSpmValidateSrw, data);
    }
}

export function reqSpmGetReplayData(rankId: number): void {
    send({
        MsgSpmGetReplayData: { c: {
            rankId,
        } },
    });
}
async function _onMsgSpmGetReplayData(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS;
    if (data.getErrorCode()) {
        updateOnFailedMsgSpmGetReplayData(data);
    } else {
        await updateOnMsgSpmGetReplayData(data);
        dispatch(TypeId.MsgSpmGetReplayData, data);
    }
}
