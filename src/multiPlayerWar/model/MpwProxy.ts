import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { SyncRequestType } from "../../gameConfig/GcWar.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    updateOnMsgMpwCommonGetJoinedMpwIdArray,
    updateOnFailedMsgMpwCommonGetWarTimestamp,
    updateOnMsgMpwCommonGetWarTimestamp,
    updateOnMsgMpwCommonBroadcastGameStart,
    updateOnFailedMsgMpwCommonContinueWar,
    updateOnMsgMpwCommonContinueWar,
    updateOnPlayerSyncWar,
    updateOnFailedMsgMpwCommonGetWarSettings,
    updateOnMsgMpwCommonGetWarSettings,
    updateOnFailedMsgMpwCommonGetWarProgressInfo,
    updateOnMsgMpwCommonGetWarProgressInfo,
    updateOnMsgMpwCommonMarkGrid,
    updateOnMsgMpwCommonSetHiddenGridMarkTypeIdList,
    updateOnMsgMpwCommonSetGridMarkList,
    updateOnFailedMsgMpwCommonGetHalfwayReplayData,
    updateOnMsgMpwCommonGetHalfwayReplayData,
    updateOnFailedMsgMpwCommonGetUnitStatistics,
    updateOnMsgMpwCommonGetUnitStatistics,
    updateOnMsgMpwExecuteWarOperation,
} from "./MpwModel.ts";
import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonBroadcastGameStart/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonContinueWarS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonContinueWar/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetHalfwayReplayDataS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetHalfwayReplayData/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetJoinedMpwIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetJoinedMpwIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarProgressInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarProgressInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarTimestampS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarTimestamp/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonHandleBootS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonHandleBoot/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonMarkGridS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonMarkGrid/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetGridMarkListS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetGridMarkList/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetHiddenGridMarkTypeIdListS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetHiddenGridMarkTypeIdList/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSyncWarS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSyncWar/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwExecuteWarOperationS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwExecuteWarOperation/S.ts";
import type { GridIdAndMarkTypeId } from "../../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgMpwCommonGetJoinedMpwIdArray,         callback: _onMsgMpwCommonGetJoinedMpwIdArray },
        { msgCode: MessageCodes.MsgMpwCommonGetWarTimestamp,             callback: _onMsgMpwCommonGetWarTimestamp },
        { msgCode: MessageCodes.MsgMpwCommonBroadcastGameStart,          callback: _onMsgMpwCommonBroadcastGameStart },
        { msgCode: MessageCodes.MsgMpwCommonHandleBoot,                  callback: _onMsgMpwCommonHandleBoot },
        { msgCode: MessageCodes.MsgMpwCommonContinueWar,                 callback: _onMsgMpwCommonContinueWar },
        { msgCode: MessageCodes.MsgMpwCommonSyncWar,                     callback: _onMsgMpwCommonSyncWar },
        { msgCode: MessageCodes.MsgMpwCommonGetWarSettings,              callback: _onMsgMpwCommonGetWarSettings },
        { msgCode: MessageCodes.MsgMpwCommonGetWarProgressInfo,          callback: _onMsgMpwCommonGetWarProgressInfo },
        { msgCode: MessageCodes.MsgMpwCommonMarkGrid,                    callback: _onMsgMpwCommonMarkGrid },
        { msgCode: MessageCodes.MsgMpwCommonSetHiddenGridMarkTypeIdList, callback: _onMsgMpwCommonSetHiddenGridMarkTypeIdList },
        { msgCode: MessageCodes.MsgMpwCommonSetGridMarkList,             callback: _onMsgMpwCommonSetGridMarkList },
        { msgCode: MessageCodes.MsgMpwCommonGetHalfwayReplayData,        callback: _onMsgMpwCommonGetHalfwayReplayData },
        { msgCode: MessageCodes.MsgMpwCommonGetUnitStatistics,           callback: _onMsgMpwCommonGetUnitStatistics },

        { msgCode: MessageCodes.MsgMpwExecuteWarOperation,               callback: _onMsgMpwExecuteWarOperation },
    ], null);
}

export function reqMpwCommonGetJoinedMpwIdArray(): void {
    send({ MsgMpwCommonGetJoinedMpwIdArray: { c: {
    } }, });
}
function _onMsgMpwCommonGetJoinedMpwIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetJoinedMpwIdArrayS;
    if (!data.getErrorCode()) {
        updateOnMsgMpwCommonGetJoinedMpwIdArray(data);
        dispatch(TypeId.MsgMpwCommonGetJoinedMpwIdArray, data);
    }
}

export function reqMpwCommonGetWarTimestamp(warId: number): void {
    send({ MsgMpwCommonGetWarTimestamp: { c: {
        warId   : warId,
    } } });
}
function _onMsgMpwCommonGetWarTimestamp(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarTimestampS;
    if (data.getErrorCode()) {
        updateOnFailedMsgMpwCommonGetWarTimestamp(data);
    } else {
        updateOnMsgMpwCommonGetWarTimestamp(data);
        dispatch(TypeId.MsgMpwCommonGetWarTimestamp, data);
    }
}

async function _onMsgMpwCommonBroadcastGameStart(e: Event): Promise<void> {
    const data = e.data as S;
    await updateOnMsgMpwCommonBroadcastGameStart(data);
}

export function reqMpwCommonContinueWar(warId: number): void {
    send({ MsgMpwCommonContinueWar: { c: {
        warId   : warId,
    }, }, });
}
async function _onMsgMpwCommonContinueWar(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonContinueWarS;
    if (data.getErrorCode()) {
        updateOnFailedMsgMpwCommonContinueWar(data);
        dispatch(TypeId.MsgMpwCommonContinueWarFailed, data);
    } else {
        await updateOnMsgMpwCommonContinueWar(data);
        dispatch(TypeId.MsgMpwCommonContinueWar, data);
    }
}

export function reqMpwCommonSyncWar(war: IBwWar, requestType: SyncRequestType): void {
    send({
        MsgMpwCommonSyncWar: { c: {
            warId               : war.getWarId(),
            executedActionsCount: war.getExecutedOperationManager().getExecutedOperationsCount(),
            requestType,
        }, }
    });
}
function _onMsgMpwCommonSyncWar(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSyncWarS;
    if (!data.getErrorCode()) {
        updateOnPlayerSyncWar(data);
        dispatch(TypeId.MsgMpwCommonSyncWar);
    }
}

export function reqMpwCommonGetWarSettings(warId: number): void {
    send({
        MsgMpwCommonGetWarSettings: { c: {
            warId
        } },
    });
}
async function _onMsgMpwCommonGetWarSettings(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarSettingsS;
    if (data.getErrorCode()) {
        updateOnFailedMsgMpwCommonGetWarSettings(data);
    } else {
        await updateOnMsgMpwCommonGetWarSettings(data);
        dispatch(TypeId.MsgMpwCommonGetWarSettings, data);
    }
}

export function reqMpwCommonGetWarProgressInfo(warId: number): void {
    send({
        MsgMpwCommonGetWarProgressInfo: { c: {
            warId
        } },
    });
}
async function _onMsgMpwCommonGetWarProgressInfo(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarProgressInfoS;
    if (data.getErrorCode()) {
        updateOnFailedMsgMpwCommonGetWarProgressInfo(data);
    } else {
        await updateOnMsgMpwCommonGetWarProgressInfo(data);
        dispatch(TypeId.MsgMpwCommonGetWarProgressInfo, data);
    }
}

export function reqMpwCommonMarkGrid(warId: number, gridIdArrayForAddMark: number[], gridIdArrayForDeleteMark: number[], markTypeId: number): void {
    send({
        MsgMpwCommonMarkGrid: { c: {
            warId                       : warId,
            gridIdArrayForAddMark       : gridIdArrayForAddMark,
            gridIdArrayForDeleteMark    : gridIdArrayForDeleteMark,
            markTypeId                  : markTypeId,
        } },
    });
}
function _onMsgMpwCommonMarkGrid(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonMarkGridS;
    if (!data.getErrorCode()) {
        updateOnMsgMpwCommonMarkGrid(data);
        dispatch(TypeId.MsgMpwCommonMarkTile, data);
    }
}

export function reqMpwCommonSetHiddenGridMarkTypeIdList(warId: number, hiddenGridMarkTypeIdList: number[]): void {
    send({
        MsgMpwCommonSetHiddenGridMarkTypeIdList: { c: {
            warId                       : warId,
            hiddenGridMarkTypeIdList    : hiddenGridMarkTypeIdList,
        } },
    });
}
function _onMsgMpwCommonSetHiddenGridMarkTypeIdList(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetHiddenGridMarkTypeIdListS;
    if (!data.getErrorCode()) {
        updateOnMsgMpwCommonSetHiddenGridMarkTypeIdList(data);
        dispatch(TypeId.MsgMpwCommonSetPlayerIndexesForShowMarkedGrid, data);
    }
}

export function reqMpwCommonSetGridMarkList(warId: number, list: GridIdAndMarkTypeId[]): void {
    send({
        MsgMpwCommonSetGridMarkList: { c: {
            warId           : warId,
            gridMarkList    : list.map(v => v.toJson()),
        } },
    });
}
function _onMsgMpwCommonSetGridMarkList(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetGridMarkListS;
    if (!data.getErrorCode()) {
        updateOnMsgMpwCommonSetGridMarkList(data);
        dispatch(TypeId.MsgMpwCommonSetGridMarkList, data);
    }
}

export function reqMpwCommonGetHalfwayReplayData(warId: number): void {
    send({
        MsgMpwCommonGetHalfwayReplayData: { c: {
            warId,
        } },
    });
}
async function _onMsgMpwCommonGetHalfwayReplayData(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetHalfwayReplayDataS;
    if (data.getErrorCode()) {
        updateOnFailedMsgMpwCommonGetHalfwayReplayData(data);
        dispatch(TypeId.MsgMpwGetHalfwayReplayDataFailed, data);
    } else {
        await updateOnMsgMpwCommonGetHalfwayReplayData(data);
        dispatch(TypeId.MsgMpwGetHalfwayReplayData, data);
    }
}

export function reqMpwCommonGetUnitStatistics(warId: number): void {
    send({ MsgMpwCommonGetUnitStatistics: { c: {
        warId   : warId,
    } } });
}
async function _onMsgMpwCommonGetUnitStatistics(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS;
    if (data.getErrorCode()) {
        updateOnFailedMsgMpwCommonGetUnitStatistics(data);
        dispatch(TypeId.MsgMpwCommonGetUnitStatisticsFailed, data);
    } else {
        await updateOnMsgMpwCommonGetUnitStatistics(data);
        dispatch(TypeId.MsgMpwCommonGetUnitStatistics, data);
    }
}

export function reqMpwCommonHandleBoot(warId: number): void {
    send({
        MsgMpwCommonHandleBoot: { c: {
            warId,
        }, },
    });
}
function _onMsgMpwCommonHandleBoot(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonHandleBootS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMpwCommonHandleBoot, data);
    }
}

export function reqMpwExecuteWarOperation(war: IBwWar, actionContainer: WoContainer): void {
    send({
        MsgMpwExecuteWarOperation: { c: {
            warId           : war.getWarId(),
            actionContainer : actionContainer.toJson(),
        }, },
    });
}
function _onMsgMpwExecuteWarOperation(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwExecuteWarOperationS;
    if (!data.getErrorCode()) {
        updateOnMsgMpwExecuteWarOperation(getExisted(data.getActionContainer()), getExisted(data.getWarId()));
        dispatch(TypeId.MsgMpwExecuteWarOperation, data);
    }
}
