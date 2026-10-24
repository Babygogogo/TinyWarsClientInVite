import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiPlayerWarModelMpwModel from "./MpwModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonBroadcastGameStartS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonBroadcastGameStart/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonContinueWarS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonContinueWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetHalfwayReplayDataS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetHalfwayReplayData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetJoinedMpwIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetJoinedMpwIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarProgressInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarProgressInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarTimestampS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarTimestamp/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonHandleBootS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonHandleBoot/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonMarkGridS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonMarkGrid/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetGridMarkListS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetGridMarkList/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetHiddenGridMarkTypeIdListS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetHiddenGridMarkTypeIdList/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSyncWarS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSyncWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwExecuteWarOperationS from "../../proto/schema/CommonProto/NetMessage/MsgMpwExecuteWarOperation/S.ts";
import type * as ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId from "../../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonGetJoinedMpwIdArray,         callback: _onMsgMpwCommonGetJoinedMpwIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonGetWarTimestamp,             callback: _onMsgMpwCommonGetWarTimestamp },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonBroadcastGameStart,          callback: _onMsgMpwCommonBroadcastGameStart },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonHandleBoot,                  callback: _onMsgMpwCommonHandleBoot },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonContinueWar,                 callback: _onMsgMpwCommonContinueWar },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonSyncWar,                     callback: _onMsgMpwCommonSyncWar },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonGetWarSettings,              callback: _onMsgMpwCommonGetWarSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonGetWarProgressInfo,          callback: _onMsgMpwCommonGetWarProgressInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonMarkGrid,                    callback: _onMsgMpwCommonMarkGrid },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonSetHiddenGridMarkTypeIdList, callback: _onMsgMpwCommonSetHiddenGridMarkTypeIdList },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonSetGridMarkList,             callback: _onMsgMpwCommonSetGridMarkList },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonGetHalfwayReplayData,        callback: _onMsgMpwCommonGetHalfwayReplayData },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwCommonGetUnitStatistics,           callback: _onMsgMpwCommonGetUnitStatistics },

        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwExecuteWarOperation,               callback: _onMsgMpwExecuteWarOperation },
    ], null);
}

export function reqMpwCommonGetJoinedMpwIdArray(): void {
    NetworksManager.send({ MsgMpwCommonGetJoinedMpwIdArray: { c: {
    } }, });
}
function _onMsgMpwCommonGetJoinedMpwIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetJoinedMpwIdArrayS.S;
    if (!data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonGetJoinedMpwIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonGetJoinedMpwIdArray, data);
    }
}

export function reqMpwCommonGetWarTimestamp(warId: number): void {
    NetworksManager.send({ MsgMpwCommonGetWarTimestamp: { c: {
        warId   : warId,
    } } });
}
function _onMsgMpwCommonGetWarTimestamp(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarTimestampS.S;
    if (data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnFailedMsgMpwCommonGetWarTimestamp(data);
    } else {
        MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonGetWarTimestamp(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonGetWarTimestamp, data);
    }
}

async function _onMsgMpwCommonBroadcastGameStart(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonBroadcastGameStartS.S;
    await MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonBroadcastGameStart(data);
}

export function reqMpwCommonContinueWar(warId: number): void {
    NetworksManager.send({ MsgMpwCommonContinueWar: { c: {
        warId   : warId,
    }, }, });
}
async function _onMsgMpwCommonContinueWar(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonContinueWarS.S;
    if (data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnFailedMsgMpwCommonContinueWar(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonContinueWarFailed, data);
    } else {
        await MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonContinueWar(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonContinueWar, data);
    }
}

export function reqMpwCommonSyncWar(war: BaseWarInterfaceIBwWar.IBwWar, requestType: GameConfigGcWar.SyncRequestType): void {
    NetworksManager.send({
        MsgMpwCommonSyncWar: { c: {
            warId               : war.getWarId(),
            executedActionsCount: war.getExecutedOperationManager().getExecutedOperationsCount(),
            requestType,
        }, }
    });
}
function _onMsgMpwCommonSyncWar(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSyncWarS.S;
    if (!data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnPlayerSyncWar(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonSyncWar);
    }
}

export function reqMpwCommonGetWarSettings(warId: number): void {
    NetworksManager.send({
        MsgMpwCommonGetWarSettings: { c: {
            warId
        } },
    });
}
async function _onMsgMpwCommonGetWarSettings(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarSettingsS.S;
    if (data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnFailedMsgMpwCommonGetWarSettings(data);
    } else {
        await MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonGetWarSettings(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonGetWarSettings, data);
    }
}

export function reqMpwCommonGetWarProgressInfo(warId: number): void {
    NetworksManager.send({
        MsgMpwCommonGetWarProgressInfo: { c: {
            warId
        } },
    });
}
async function _onMsgMpwCommonGetWarProgressInfo(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarProgressInfoS.S;
    if (data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnFailedMsgMpwCommonGetWarProgressInfo(data);
    } else {
        await MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonGetWarProgressInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonGetWarProgressInfo, data);
    }
}

export function reqMpwCommonMarkGrid(warId: number, gridIdArrayForAddMark: number[], gridIdArrayForDeleteMark: number[], markTypeId: number): void {
    NetworksManager.send({
        MsgMpwCommonMarkGrid: { c: {
            warId                       : warId,
            gridIdArrayForAddMark       : gridIdArrayForAddMark,
            gridIdArrayForDeleteMark    : gridIdArrayForDeleteMark,
            markTypeId                  : markTypeId,
        } },
    });
}
function _onMsgMpwCommonMarkGrid(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonMarkGridS.S;
    if (!data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonMarkGrid(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonMarkTile, data);
    }
}

export function reqMpwCommonSetHiddenGridMarkTypeIdList(warId: number, hiddenGridMarkTypeIdList: number[]): void {
    NetworksManager.send({
        MsgMpwCommonSetHiddenGridMarkTypeIdList: { c: {
            warId                       : warId,
            hiddenGridMarkTypeIdList    : hiddenGridMarkTypeIdList,
        } },
    });
}
function _onMsgMpwCommonSetHiddenGridMarkTypeIdList(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetHiddenGridMarkTypeIdListS.S;
    if (!data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonSetHiddenGridMarkTypeIdList(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonSetPlayerIndexesForShowMarkedGrid, data);
    }
}

export function reqMpwCommonSetGridMarkList(warId: number, list: ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId.GridIdAndMarkTypeId[]): void {
    NetworksManager.send({
        MsgMpwCommonSetGridMarkList: { c: {
            warId           : warId,
            gridMarkList    : list.map(v => v.toJson()),
        } },
    });
}
function _onMsgMpwCommonSetGridMarkList(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetGridMarkListS.S;
    if (!data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonSetGridMarkList(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonSetGridMarkList, data);
    }
}

export function reqMpwCommonGetHalfwayReplayData(warId: number): void {
    NetworksManager.send({
        MsgMpwCommonGetHalfwayReplayData: { c: {
            warId,
        } },
    });
}
async function _onMsgMpwCommonGetHalfwayReplayData(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetHalfwayReplayDataS.S;
    if (data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnFailedMsgMpwCommonGetHalfwayReplayData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwGetHalfwayReplayDataFailed, data);
    } else {
        await MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonGetHalfwayReplayData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwGetHalfwayReplayData, data);
    }
}

export function reqMpwCommonGetUnitStatistics(warId: number): void {
    NetworksManager.send({ MsgMpwCommonGetUnitStatistics: { c: {
        warId   : warId,
    } } });
}
async function _onMsgMpwCommonGetUnitStatistics(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS.S;
    if (data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnFailedMsgMpwCommonGetUnitStatistics(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonGetUnitStatisticsFailed, data);
    } else {
        await MultiPlayerWarModelMpwModel.updateOnMsgMpwCommonGetUnitStatistics(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonGetUnitStatistics, data);
    }
}

export function reqMpwCommonHandleBoot(warId: number): void {
    NetworksManager.send({
        MsgMpwCommonHandleBoot: { c: {
            warId,
        }, },
    });
}
function _onMsgMpwCommonHandleBoot(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonHandleBootS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwCommonHandleBoot, data);
    }
}

export function reqMpwExecuteWarOperation(war: BaseWarInterfaceIBwWar.IBwWar, actionContainer: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer): void {
    NetworksManager.send({
        MsgMpwExecuteWarOperation: { c: {
            warId           : war.getWarId(),
            actionContainer : actionContainer.toJson(),
        }, },
    });
}
function _onMsgMpwExecuteWarOperation(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwExecuteWarOperationS.S;
    if (!data.getErrorCode()) {
        MultiPlayerWarModelMpwModel.updateOnMsgMpwExecuteWarOperation(HelpersMisc.getExisted(data.getActionContainer()), HelpersMisc.getExisted(data.getWarId()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwExecuteWarOperation, data);
    }
}
