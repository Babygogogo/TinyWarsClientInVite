import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    NormalMap_Model_NormalMapModel,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
import type { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type { MapTagSingleData } from "../../proto/schema/CommonProto/Map/MapTag/MapTagSingleData.ts";
import type { S as MapGetMapTagResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMapGetMapTag/S.ts";
import type { S as MapGetRawDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMapGetRawData/S.ts";
import type { S as MmAddIgnoredReviewingMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmAddIgnoredReviewingMap/S.ts";
import type { S as MmAddWarEventResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmAddWarEvent/S.ts";
import type { S as MmAddWarRuleResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmAddWarRule/S.ts";
import type { S as MmDeleteRedundantWarEventResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmDeleteRedundantWarEvent/S.ts";
import type { S as MmDeleteWarRuleResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmDeleteWarRule/S.ts";
import type { S as MmGetReviewingMapsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmGetReviewingMaps/S.ts";
import type { S as MmReviewMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmReviewMap/S.ts";
import type { S as MmSetMapEnabledResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapEnabled/S.ts";
import type { S as MmSetMapNameResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapName/S.ts";
import type { S as MmSetMapTagIdFlagsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapTagIdFlags/S.ts";
import type { S as MmSetMapTagSingleDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapTagSingleData/S.ts";
import type { S as MmSetWarRuleAvailabilityResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleAvailability/S.ts";
import type { S as MmSetWarRuleFixedTileThemeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleFixedTileTheme/S.ts";
import type { S as MmSetWarRuleNameResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleName/S.ts";
import type { S as MmSubmitMapSimpleDialogueResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSubmitMapSimpleDialogue/S.ts";
import type { WarRuleDialogueInfo } from "../../proto/schema/CommonProto/NetMessage/MsgMmSubmitMapSimpleDialogue/WarRuleDialogueInfo.ts";
import type { S as NormalMapGetAllEnabledBriefDataVersionsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetAllEnabledBriefDataVersions/S.ts";
import type { S as NormalMapGetBriefDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefData/S.ts";
import type { S as NormalMapGetBriefDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefDataArray/S.ts";
import type { S as NormalMapGetBriefDataVersionResponse } from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefDataVersion/S.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMapGetMapTag,                             callback : _onMsgMapGetMapTag },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgNormalMapGetAllEnabledBriefDataVersions,  callback : _onMsgNormalMapGetAllEnabledBriefDataVersions },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgNormalMapGetBriefDataVersion,             callback : _onMsgNormalMapGetBriefDataVersion },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgNormalMapGetBriefData,                    callback : _onMsgNormalMapGetBriefData },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgNormalMapGetBriefDataArray,               callback : _onMsgNormalMapGetBriefDataArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMapGetRawData,                            callback : _onMsgMapGetRawData },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmAddIgnoredReviewingMap,                 callback : _onMsgMmAddIgnoredReviewingMap },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmSetWarRuleAvailability,                 callback : _onMsgMmSetWarRuleAvailability },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmSetMapEnabled,                          callback : _onMsgMmSetMapEnabled },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmGetReviewingMaps,                       callback : _onMsgMmGetReviewingMaps },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmReviewMap,                              callback : _onMsgMmReviewMap },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmSetMapTagIdFlags,                       callback : _onMsgMmSetMapTagIdFlags },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmSetMapName,                             callback : _onMsgMmSetMapName },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmAddWarRule,                             callback : _onMsgMmAddWarRule },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmAddWarEvent,                            callback : _onMsgMmAddWarEvent },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmSubmitMapSimpleDialogue,                callback : _onMsgMmSubmitMapSimpleDialogue },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmDeleteRedundantWarEvent,                callback : _onMsgMmDeleteRedundantWarEvent },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmDeleteWarRule,                          callback : _onMsgMmDeleteWarRule },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmSetWarRuleName,                         callback : _onMsgMmSetWarRuleName },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmSetWarRuleFixedTileTheme,               callback : _onMsgMmSetWarRuleFixedTileTheme },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmSetMapTagSingleData,                    callback : _onMsgMmSetMapTagSingleData },
    ], null);
}

export function reqMapGetMapTag(): void {
    Networks_Manager.send({
        MsgMapGetMapTag : {
            c : {
            }, 
        },
    });
}
function _onMsgMapGetMapTag(e: Egret_Egret.Event): void {
    const data = e.data as MapGetMapTagResponse;
    if (!data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.setMapTag(Helpers_Misc.getExisted(data.getMapTag()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMapGetMapTag, data);
    }
}

export function reqNormalMapGetAllEnabledBriefDataVersions(): void {
    Networks_Manager.send({
        MsgNormalMapGetAllEnabledBriefDataVersions : {
            c : {
            }, 
        }, 
    });
}
async function _onMsgNormalMapGetAllEnabledBriefDataVersions(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as NormalMapGetAllEnabledBriefDataVersionsResponse;
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgNormalMapGetAllEnabledBriefDataVersions(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgNormalMapGetAllEnabledBriefDataVersions, data);
    }
}

export function reqNormalMapGetBriefData(normalMapId: number): void {
    Networks_Manager.send({
        MsgNormalMapGetBriefData : {
            c : {
                normalMapId : normalMapId,
            }, 
        }, 
    });
}
async function _onMsgNormalMapGetBriefData(e: Egret_Egret.Event): Promise<void> {
    const data  = e.data as NormalMapGetBriefDataResponse;
    if (data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.updateOnFailedMsgNormalMapGetBriefData(data);
    } else {
        await NormalMap_Model_NormalMapModel.updateOnMsgNormalMapGetBriefData(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgNormalMapGetBriefData, data);
    }
}

export function reqNormalMapGetBriefDataArray(normalMapIdArray: number[]): void {
    Networks_Manager.send({
        MsgNormalMapGetBriefDataArray : {
            c : {
                normalMapIdArray : normalMapIdArray,
            }, 
        }, 
    });
}
async function _onMsgNormalMapGetBriefDataArray(e: Egret_Egret.Event): Promise<void> {
    const data  = e.data as NormalMapGetBriefDataArrayResponse;
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgNormalMapGetBriefDataArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgNormalMapGetBriefDataArray, data);
    }
}

export function reqNormalMapGetBriefDataVersion(normalMapId: number): void {
    Networks_Manager.send({
        MsgNormalMapGetBriefDataVersion : {
            c : {
                normalMapId : normalMapId,
            }, 
        }, 
    });
}
async function _onMsgNormalMapGetBriefDataVersion(e: Egret_Egret.Event): Promise<void> {
    const data  = e.data as NormalMapGetBriefDataVersionResponse;
    if (data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.updateOnFailedMsgNormalMapGetBriefDataVersion(data);
    } else {
        await NormalMap_Model_NormalMapModel.updateOnMsgNormalMapGetBriefDataVersion(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgNormalMapGetBriefDataVersion, data);
    }
}

export function reqGetMapRawData(normalMapId: number): void {
    Networks_Manager.send({
        MsgMapGetRawData : {
            c : {
                normalMapId : normalMapId,
            }, 
        }, 
    });
}
async function _onMsgMapGetRawData(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MapGetRawDataResponse;
    if (data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.updateOnFailedMsgMapGetRawData(data);
    } else {
        await NormalMap_Model_NormalMapModel.updateOnMsgMapGetRawData(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMapGetRawData, data);
    }
}

export function reqMmAddIgnoredReviewingMap(designerUserId: number, slotIndex: number, dataTimestamp: number): void {
    Networks_Manager.send({
        MsgMmAddIgnoredReviewingMap : {
            c : {
                designerUserId : designerUserId,
                slotIndex      : slotIndex,
                dataTimestamp  : dataTimestamp,
            }, 
        },
    });
}
function _onMsgMmAddIgnoredReviewingMap(e: Egret_Egret.Event): void {
    const data = e.data as MmAddIgnoredReviewingMapResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmAddIgnoredReviewingMap, data);
    }
}

export function reqMmSetWarRuleAvailability({ normalMapId, ruleId, availability }: {
    normalMapId     : number;
    ruleId          : number;
    availability    : RuleAvailability;
}): void {
    Networks_Manager.send({
        MsgMmSetWarRuleAvailability : {
            c : {
                normalMapId  : normalMapId,
                ruleId       : ruleId,
                availability : availability.toJson(),
            }, 
        },
    });
}
async function _onMsgMmSetWarRuleAvailability(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmSetWarRuleAvailabilityResponse;
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetWarRuleAvailability(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmSetWarRuleAvailability, data);
    }
}

export function reqMmSetMapEnabled(normalMapId: number, isEnabled: boolean): void {
    Networks_Manager.send({
        MsgMmSetMapEnabled : {
            c : {
                normalMapId : normalMapId,
                isEnabled   : isEnabled,
            }, 
        },
    });
}
function _onMsgMmSetMapEnabled(e: Egret_Egret.Event): void {
    const data = e.data as MmSetMapEnabledResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmSetMapEnabled, data);
    }
}

export function reqMmGetReviewingMaps(): void {
    Networks_Manager.send({
        MsgMmGetReviewingMaps : { c : {} },
    });
}
function _onMsgMmGetReviewingMaps(e: Egret_Egret.Event): void {
    const data = e.data as MmGetReviewingMapsResponse;
    if (!data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.updateOnMsgMmGetReviewingMaps(data.getMaps());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmGetReviewingMaps, data);
    }
}

export function reqMmReviewMap({ designerUserId, slotIndex, modifiedTime, isAccept, reviewComment }: {
    designerUserId  : number;
    slotIndex       : number;
    modifiedTime    : number;
    isAccept        : boolean;
    reviewComment   : string | null;
}): void {
    Networks_Manager.send({
        MsgMmReviewMap : {
            c : {
                designerUserId,
                slotIndex,
                modifiedTime,
                isAccept,
                reviewComment,
            }, 
        },
    });
}
function _onMsgMmReviewMap(e: Egret_Egret.Event): void {
    const data = e.data as MmReviewMapResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmReviewMap, data);
    }
}

export function reqMmSetMapTagIdFlags(normalMapId: number, mapTagIdFlags: number): void {
    Networks_Manager.send({
        MsgMmSetMapTagIdFlags : {
            c : {
                normalMapId : normalMapId,
                mapTagIdFlags,
            }, 
        }, 
    });
}
async function _onMsgMmSetMapTagIdFlags(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmSetMapTagIdFlagsResponse;
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetMapTagIdFlags(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmSetMapTagIdFlags, data);
    }
}

export function reqMmSetMapName(normalMapId: number, mapNameArray: LanguageText[]): void {
    Networks_Manager.send({
        MsgMmSetMapName : {
            c : {
                normalMapId  : normalMapId,
                mapNameArray : mapNameArray.map(v => v.toJson()),
            }, 
        }, 
    });
}
async function _onMsgMmSetMapName(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmSetMapNameResponse;
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetMapName(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmSetMapName, data);
    }
}

export function reqMmAddWarRule(normalMapId: number, templateWarRule: TemplateWarRule): void {
    Networks_Manager.send({
        MsgMmAddWarRule : {
            c : {
                normalMapId     : normalMapId,
                templateWarRule : templateWarRule.toJson(),
            }, 
        },
    });
}
async function _onMsgMmAddWarRule(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmAddWarRuleResponse;
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmAddWarRule(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmAddWarRule, data);
    }
}

export function reqMmAddWarEvent(normalMapId: number, incrementalWarEventFullData: WarEventFullData): void {
    Networks_Manager.send({
        MsgMmAddWarEvent : {
            c : {
                normalMapId                 : normalMapId,
                incrementalWarEventFullData : incrementalWarEventFullData.toJson(),
            }, 
        },
    });
}
async function _onMsgMmAddWarEvent(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmAddWarEventResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmAddWarEvent, data);
    }
}

export function reqMmSubmitMapSimpleDialogue(
    normalMapId                 : number,
    mapSimpleDialogueArray      : MapSimpleDialogue[],
    warRuleDialogueInfoArray    : WarRuleDialogueInfo[],
): void {
    Networks_Manager.send({
        MsgMmSubmitMapSimpleDialogue : {
            c : {
                normalMapId              : normalMapId,
                mapSimpleDialogueArray   : mapSimpleDialogueArray.map(v => v.toJson()),
                warRuleDialogueInfoArray : warRuleDialogueInfoArray.map(v => v.toJson()),
            }, 
        },
    });
}
function _onMsgMmSubmitMapSimpleDialogue(e: Egret_Egret.Event): void {
    const data = e.data as MmSubmitMapSimpleDialogueResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmSubmitMapSimpleDialogue, data);
    }
}

export function reqMmDeleteRedundantWarEvent(normalMapId: number): void {
    Networks_Manager.send({
        MsgMmDeleteRedundantWarEvent : {
            c : {
                normalMapId : normalMapId,
            }, 
        },
    });
}
async function _onMsgMmDeleteRedundantWarEvent(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmDeleteRedundantWarEventResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmDeleteRedundantWarEvent, data);
    }
}

export function reqMmDeleteWarRule(normalMapId: number, ruleId: number): void {
    Networks_Manager.send({
        MsgMmDeleteWarRule : {
            c : {
                normalMapId : normalMapId,
                ruleId,
            }, 
        },
    });
}
async function _onMsgMmDeleteWarRule(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmDeleteWarRuleResponse;
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmDeleteWarRule(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmDeleteWarRule, data);
    }
}

export function reqMmSetWarRuleName(normalMapId: number, ruleId: number, ruleNameArray: LanguageText[]): void {
    Networks_Manager.send({
        MsgMmSetWarRuleName : {
            c : {
                normalMapId   : normalMapId,
                ruleId        : ruleId,
                ruleNameArray : ruleNameArray.map(v => v.toJson()),
            }, 
        },
    });
}
async function _onMsgMmSetWarRuleName(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmSetWarRuleNameResponse;
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetWarRuleName(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmSetWarRuleName, data);
    }
}

export function reqMmSetWarRuleFixedTileTheme(normalMapId: number, ruleId: number, tileTheme: number | null): void {
    Networks_Manager.send({
        MsgMmSetWarRuleFixedTileTheme : {
            c : {
                normalMapId : normalMapId,
                ruleId      : ruleId,
                tileTheme   : tileTheme,
            }, 
        },
    });
}
async function _onMsgMmSetWarRuleFixedTileTheme(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmSetWarRuleFixedTileThemeResponse;
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetWarRuleFixedTileTheme(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmSetWarRuleFixedTileTheme, data);
    }
}

export function reqMmSetMapTagSingleData(data: MapTagSingleData): void {
    Networks_Manager.send({
        MsgMmSetMapTagSingleData : {
            c : {
                data : data.toJson(),
            }, 
        },
    });
}
function _onMsgMmSetMapTagSingleData(e: Egret_Egret.Event): void {
    const data = e.data as MmSetMapTagSingleDataResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmSetMapTagSingleData, data);
    }
}
