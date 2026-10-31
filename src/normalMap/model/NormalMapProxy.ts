import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    NormalMap_Model_NormalMapModel,
    type Egret_Egret,
} from "../../internal.ts";
import type { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type { MapTagSingleData } from "../../proto/schema/CommonProto/Map/MapTag/MapTagSingleData.ts";
import type { WarRuleDialogueInfo } from "../../proto/schema/CommonProto/NetMessage/MsgMmSubmitMapSimpleDialogue/WarRuleDialogueInfo.ts";
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
function _onMsgMapGetMapTag(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMapGetMapTag"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.setMapTag(Helpers_Misc.getExisted(data.getMapTag()));
        Notifications_Dispatcher.dispatch("MsgMapGetMapTag", { msg: data });
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
async function _onMsgNormalMapGetAllEnabledBriefDataVersions(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgNormalMapGetAllEnabledBriefDataVersions"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgNormalMapGetAllEnabledBriefDataVersions(data);
        Notifications_Dispatcher.dispatch("MsgNormalMapGetAllEnabledBriefDataVersions", { msg: data });
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
async function _onMsgNormalMapGetBriefData(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgNormalMapGetBriefData"]>): Promise<void> {
    const data  = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.updateOnFailedMsgNormalMapGetBriefData(data);
    } else {
        await NormalMap_Model_NormalMapModel.updateOnMsgNormalMapGetBriefData(data);
        Notifications_Dispatcher.dispatch("MsgNormalMapGetBriefData", { msg: data });
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
async function _onMsgNormalMapGetBriefDataArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgNormalMapGetBriefDataArray"]>): Promise<void> {
    const data  = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgNormalMapGetBriefDataArray(data);
        Notifications_Dispatcher.dispatch("MsgNormalMapGetBriefDataArray", { msg: data });
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
async function _onMsgNormalMapGetBriefDataVersion(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgNormalMapGetBriefDataVersion"]>): Promise<void> {
    const data  = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.updateOnFailedMsgNormalMapGetBriefDataVersion(data);
    } else {
        await NormalMap_Model_NormalMapModel.updateOnMsgNormalMapGetBriefDataVersion(data);
        Notifications_Dispatcher.dispatch("MsgNormalMapGetBriefDataVersion", { msg: data });
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
async function _onMsgMapGetRawData(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMapGetRawData"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.updateOnFailedMsgMapGetRawData(data);
    } else {
        await NormalMap_Model_NormalMapModel.updateOnMsgMapGetRawData(data);
        Notifications_Dispatcher.dispatch("MsgMapGetRawData", { msg: data });
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
function _onMsgMmAddIgnoredReviewingMap(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmAddIgnoredReviewingMap"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMmAddIgnoredReviewingMap", { msg: data });
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
async function _onMsgMmSetWarRuleAvailability(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmSetWarRuleAvailability"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetWarRuleAvailability(data);
        Notifications_Dispatcher.dispatch("MsgMmSetWarRuleAvailability", { msg: data });
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
function _onMsgMmSetMapEnabled(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmSetMapEnabled"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMmSetMapEnabled", { msg: data });
    }
}

export function reqMmGetReviewingMaps(): void {
    Networks_Manager.send({
        MsgMmGetReviewingMaps : { c : {} },
    });
}
function _onMsgMmGetReviewingMaps(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmGetReviewingMaps"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        NormalMap_Model_NormalMapModel.updateOnMsgMmGetReviewingMaps(data.getMaps());
        Notifications_Dispatcher.dispatch("MsgMmGetReviewingMaps", { msg: data });
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
function _onMsgMmReviewMap(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmReviewMap"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMmReviewMap", { msg: data });
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
async function _onMsgMmSetMapTagIdFlags(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmSetMapTagIdFlags"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetMapTagIdFlags(data);
        Notifications_Dispatcher.dispatch("MsgMmSetMapTagIdFlags", { msg: data });
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
async function _onMsgMmSetMapName(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmSetMapName"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetMapName(data);
        Notifications_Dispatcher.dispatch("MsgMmSetMapName", { msg: data });
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
async function _onMsgMmAddWarRule(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmAddWarRule"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmAddWarRule(data);
        Notifications_Dispatcher.dispatch("MsgMmAddWarRule", { msg: data });
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
async function _onMsgMmAddWarEvent(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmAddWarEvent"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMmAddWarEvent", { msg: data });
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
function _onMsgMmSubmitMapSimpleDialogue(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmSubmitMapSimpleDialogue"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMmSubmitMapSimpleDialogue", { msg: data });
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
async function _onMsgMmDeleteRedundantWarEvent(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmDeleteRedundantWarEvent"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMmDeleteRedundantWarEvent", { msg: data });
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
async function _onMsgMmDeleteWarRule(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmDeleteWarRule"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmDeleteWarRule(data);
        Notifications_Dispatcher.dispatch("MsgMmDeleteWarRule", { msg: data });
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
async function _onMsgMmSetWarRuleName(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmSetWarRuleName"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetWarRuleName(data);
        Notifications_Dispatcher.dispatch("MsgMmSetWarRuleName", { msg: data });
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
async function _onMsgMmSetWarRuleFixedTileTheme(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmSetWarRuleFixedTileTheme"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await NormalMap_Model_NormalMapModel.updateOnMsgMmSetWarRuleFixedTileTheme(data);
        Notifications_Dispatcher.dispatch("MsgMmSetWarRuleFixedTileTheme", { msg: data });
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
function _onMsgMmSetMapTagSingleData(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmSetMapTagSingleData"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMmSetMapTagSingleData", { msg: data });
    }
}
