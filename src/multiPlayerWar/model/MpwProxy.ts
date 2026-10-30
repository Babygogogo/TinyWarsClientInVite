import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    Wars_Constants,
    Notifications_TypeId,
    MultiPlayerWar_Model_MpwModel,
    type Egret_Egret,
    type BaseWar_Interface_IBwWar,
} from "../../internal.ts";
import type { S as MpwCommonBroadcastGameStartResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonBroadcastGameStart/S.ts";
import type { S as MpwCommonContinueWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonContinueWar/S.ts";
import type { S as MpwCommonGetHalfwayReplayDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetHalfwayReplayData/S.ts";
import type { S as MpwCommonGetJoinedMpwIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetJoinedMpwIdArray/S.ts";
import type { S as MpwCommonGetUnitStatisticsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/S.ts";
import type { S as MpwCommonGetWarProgressInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarProgressInfo/S.ts";
import type { S as MpwCommonGetWarSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarSettings/S.ts";
import type { S as MpwCommonGetWarTimestampResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarTimestamp/S.ts";
import type { S as MpwCommonHandleBootResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonHandleBoot/S.ts";
import type { S as MpwCommonMarkGridResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonMarkGrid/S.ts";
import type { S as MpwCommonSetGridMarkListResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetGridMarkList/S.ts";
import type { S as MpwCommonSetHiddenGridMarkTypeIdListResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetHiddenGridMarkTypeIdList/S.ts";
import type { S as MpwCommonSyncWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSyncWar/S.ts";
import type { S as MpwExecuteWarOperationResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwExecuteWarOperation/S.ts";
import type { GridIdAndMarkTypeId } from "../../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonGetJoinedMpwIdArray,         callback : _onMsgMpwCommonGetJoinedMpwIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonGetWarTimestamp,             callback : _onMsgMpwCommonGetWarTimestamp },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonBroadcastGameStart,          callback : _onMsgMpwCommonBroadcastGameStart },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonHandleBoot,                  callback : _onMsgMpwCommonHandleBoot },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonContinueWar,                 callback : _onMsgMpwCommonContinueWar },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonSyncWar,                     callback : _onMsgMpwCommonSyncWar },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonGetWarSettings,              callback : _onMsgMpwCommonGetWarSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonGetWarProgressInfo,          callback : _onMsgMpwCommonGetWarProgressInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonMarkGrid,                    callback : _onMsgMpwCommonMarkGrid },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonSetHiddenGridMarkTypeIdList, callback : _onMsgMpwCommonSetHiddenGridMarkTypeIdList },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonSetGridMarkList,             callback : _onMsgMpwCommonSetGridMarkList },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonGetHalfwayReplayData,        callback : _onMsgMpwCommonGetHalfwayReplayData },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwCommonGetUnitStatistics,           callback : _onMsgMpwCommonGetUnitStatistics },

        { msgCode : Networks_MessageCodes.MessageCodes.MsgMpwExecuteWarOperation,               callback : _onMsgMpwExecuteWarOperation },
    ], null);
}

export function reqMpwCommonGetJoinedMpwIdArray(): void {
    Networks_Manager.send({
        MsgMpwCommonGetJoinedMpwIdArray : {
            c : {
            }, 
        }, 
    });
}
function _onMsgMpwCommonGetJoinedMpwIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MpwCommonGetJoinedMpwIdArrayResponse;
    if (!data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonGetJoinedMpwIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonGetJoinedMpwIdArray, data);
    }
}

export function reqMpwCommonGetWarTimestamp(warId: number): void {
    Networks_Manager.send({
        MsgMpwCommonGetWarTimestamp : {
            c : {
                warId : warId,
            }, 
        }, 
    });
}
function _onMsgMpwCommonGetWarTimestamp(e: Egret_Egret.Event): void {
    const data = e.data as MpwCommonGetWarTimestampResponse;
    if (data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnFailedMsgMpwCommonGetWarTimestamp(data);
    } else {
        MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonGetWarTimestamp(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonGetWarTimestamp, data);
    }
}

async function _onMsgMpwCommonBroadcastGameStart(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MpwCommonBroadcastGameStartResponse;
    await MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonBroadcastGameStart(data);
}

export function reqMpwCommonContinueWar(warId: number): void {
    Networks_Manager.send({
        MsgMpwCommonContinueWar : {
            c : {
                warId : warId,
            }, 
        }, 
    });
}
async function _onMsgMpwCommonContinueWar(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MpwCommonContinueWarResponse;
    if (data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnFailedMsgMpwCommonContinueWar(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonContinueWarFailed, data);
    } else {
        await MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonContinueWar(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonContinueWar, data);
    }
}

export function reqMpwCommonSyncWar(war: BaseWar_Interface_IBwWar.IBwWar, requestType: Wars_Constants.SyncRequestTypeId): void {
    Networks_Manager.send({
        MsgMpwCommonSyncWar : {
            c : {
                warId                : war.getWarId(),
                executedActionsCount : war.getExecutedOperationManager().getExecutedOperationsCount(),
                requestType,
            }, 
        },
    });
}
function _onMsgMpwCommonSyncWar(e: Egret_Egret.Event): void {
    const data = e.data as MpwCommonSyncWarResponse;
    if (!data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnPlayerSyncWar(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonSyncWar);
    }
}

export function reqMpwCommonGetWarSettings(warId: number): void {
    Networks_Manager.send({
        MsgMpwCommonGetWarSettings : {
            c : {
                warId,
            }, 
        },
    });
}
async function _onMsgMpwCommonGetWarSettings(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MpwCommonGetWarSettingsResponse;
    if (data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnFailedMsgMpwCommonGetWarSettings(data);
    } else {
        await MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonGetWarSettings(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonGetWarSettings, data);
    }
}

export function reqMpwCommonGetWarProgressInfo(warId: number): void {
    Networks_Manager.send({
        MsgMpwCommonGetWarProgressInfo : {
            c : {
                warId,
            }, 
        },
    });
}
async function _onMsgMpwCommonGetWarProgressInfo(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MpwCommonGetWarProgressInfoResponse;
    if (data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnFailedMsgMpwCommonGetWarProgressInfo(data);
    } else {
        await MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonGetWarProgressInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonGetWarProgressInfo, data);
    }
}

export function reqMpwCommonMarkGrid(warId: number, gridIdArrayForAddMark: number[], gridIdArrayForDeleteMark: number[], markTypeId: number): void {
    Networks_Manager.send({
        MsgMpwCommonMarkGrid : {
            c : {
                warId                    : warId,
                gridIdArrayForAddMark    : gridIdArrayForAddMark,
                gridIdArrayForDeleteMark : gridIdArrayForDeleteMark,
                markTypeId               : markTypeId,
            }, 
        },
    });
}
function _onMsgMpwCommonMarkGrid(e: Egret_Egret.Event): void {
    const data = e.data as MpwCommonMarkGridResponse;
    if (!data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonMarkGrid(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonMarkTile, data);
    }
}

export function reqMpwCommonSetHiddenGridMarkTypeIdList(warId: number, hiddenGridMarkTypeIdList: number[]): void {
    Networks_Manager.send({
        MsgMpwCommonSetHiddenGridMarkTypeIdList : {
            c : {
                warId                    : warId,
                hiddenGridMarkTypeIdList : hiddenGridMarkTypeIdList,
            }, 
        },
    });
}
function _onMsgMpwCommonSetHiddenGridMarkTypeIdList(e: Egret_Egret.Event): void {
    const data = e.data as MpwCommonSetHiddenGridMarkTypeIdListResponse;
    if (!data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonSetHiddenGridMarkTypeIdList(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonSetPlayerIndexesForShowMarkedGrid, data);
    }
}

export function reqMpwCommonSetGridMarkList(warId: number, list: GridIdAndMarkTypeId[]): void {
    Networks_Manager.send({
        MsgMpwCommonSetGridMarkList : {
            c : {
                warId        : warId,
                gridMarkList : list.map(v => v.toJson()),
            }, 
        },
    });
}
function _onMsgMpwCommonSetGridMarkList(e: Egret_Egret.Event): void {
    const data = e.data as MpwCommonSetGridMarkListResponse;
    if (!data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonSetGridMarkList(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonSetGridMarkList, data);
    }
}

export function reqMpwCommonGetHalfwayReplayData(warId: number): void {
    Networks_Manager.send({
        MsgMpwCommonGetHalfwayReplayData : {
            c : {
                warId,
            }, 
        },
    });
}
async function _onMsgMpwCommonGetHalfwayReplayData(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MpwCommonGetHalfwayReplayDataResponse;
    if (data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnFailedMsgMpwCommonGetHalfwayReplayData(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwGetHalfwayReplayDataFailed, data);
    } else {
        await MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonGetHalfwayReplayData(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwGetHalfwayReplayData, data);
    }
}

export function reqMpwCommonGetUnitStatistics(warId: number): void {
    Networks_Manager.send({
        MsgMpwCommonGetUnitStatistics : {
            c : {
                warId : warId,
            }, 
        }, 
    });
}
async function _onMsgMpwCommonGetUnitStatistics(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MpwCommonGetUnitStatisticsResponse;
    if (data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnFailedMsgMpwCommonGetUnitStatistics(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonGetUnitStatisticsFailed, data);
    } else {
        await MultiPlayerWar_Model_MpwModel.updateOnMsgMpwCommonGetUnitStatistics(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonGetUnitStatistics, data);
    }
}

export function reqMpwCommonHandleBoot(warId: number): void {
    Networks_Manager.send({
        MsgMpwCommonHandleBoot : {
            c : {
                warId,
            }, 
        },
    });
}
function _onMsgMpwCommonHandleBoot(e: Egret_Egret.Event): void {
    const data = e.data as MpwCommonHandleBootResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwCommonHandleBoot, data);
    }
}

export function reqMpwExecuteWarOperation(war: BaseWar_Interface_IBwWar.IBwWar, actionContainer: WoContainer): void {
    Networks_Manager.send({
        MsgMpwExecuteWarOperation : {
            c : {
                warId           : war.getWarId(),
                actionContainer : actionContainer.toJson(),
            }, 
        },
    });
}
function _onMsgMpwExecuteWarOperation(e: Egret_Egret.Event): void {
    const data = e.data as MpwExecuteWarOperationResponse;
    if (!data.getErrorCode()) {
        MultiPlayerWar_Model_MpwModel.updateOnMsgMpwExecuteWarOperation(Helpers_Misc.getExisted(data.getActionContainer()), Helpers_Misc.getExisted(data.getWarId()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwExecuteWarOperation, data);
    }
}
