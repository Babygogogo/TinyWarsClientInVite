import * as HelpersMisc from "../../helpers/Misc.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NormalMapModelNormalMapModel from "./NormalMapModel.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type * as ProtoSchemaCommonProtoMapMapTagMapTagSingleData from "../../proto/schema/CommonProto/Map/MapTag/MapTagSingleData.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMapGetMapTagS from "../../proto/schema/CommonProto/NetMessage/MsgMapGetMapTag/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMapGetRawDataS from "../../proto/schema/CommonProto/NetMessage/MsgMapGetRawData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmAddIgnoredReviewingMapS from "../../proto/schema/CommonProto/NetMessage/MsgMmAddIgnoredReviewingMap/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmAddWarEventS from "../../proto/schema/CommonProto/NetMessage/MsgMmAddWarEvent/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmAddWarRuleS from "../../proto/schema/CommonProto/NetMessage/MsgMmAddWarRule/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmDeleteRedundantWarEventS from "../../proto/schema/CommonProto/NetMessage/MsgMmDeleteRedundantWarEvent/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmDeleteWarRuleS from "../../proto/schema/CommonProto/NetMessage/MsgMmDeleteWarRule/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmGetReviewingMapsS from "../../proto/schema/CommonProto/NetMessage/MsgMmGetReviewingMaps/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmReviewMapS from "../../proto/schema/CommonProto/NetMessage/MsgMmReviewMap/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetMapEnabledS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapEnabled/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetMapNameS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapName/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetMapTagIdFlagsS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapTagIdFlags/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetMapTagSingleDataS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapTagSingleData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleAvailabilityS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleAvailability/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleFixedTileThemeS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleFixedTileTheme/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleNameS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleName/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSubmitMapSimpleDialogueS from "../../proto/schema/CommonProto/NetMessage/MsgMmSubmitMapSimpleDialogue/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSubmitMapSimpleDialogueWarRuleDialogueInfo from "../../proto/schema/CommonProto/NetMessage/MsgMmSubmitMapSimpleDialogue/WarRuleDialogueInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetAllEnabledBriefDataVersionsS from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetAllEnabledBriefDataVersions/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataS from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataArrayS from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefDataArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataVersionS from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefDataVersion/S.ts";
import type * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarRuleRuleAvailability from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMapGetMapTag,                             callback: _onMsgMapGetMapTag },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgNormalMapGetAllEnabledBriefDataVersions,  callback: _onMsgNormalMapGetAllEnabledBriefDataVersions },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgNormalMapGetBriefDataVersion,             callback: _onMsgNormalMapGetBriefDataVersion },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgNormalMapGetBriefData,                    callback: _onMsgNormalMapGetBriefData },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgNormalMapGetBriefDataArray,               callback: _onMsgNormalMapGetBriefDataArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMapGetRawData,                            callback: _onMsgMapGetRawData },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmAddIgnoredReviewingMap,                 callback: _onMsgMmAddIgnoredReviewingMap },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmSetWarRuleAvailability,                 callback: _onMsgMmSetWarRuleAvailability },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmSetMapEnabled,                          callback: _onMsgMmSetMapEnabled },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmGetReviewingMaps,                       callback: _onMsgMmGetReviewingMaps },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmReviewMap,                              callback: _onMsgMmReviewMap },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmSetMapTagIdFlags,                       callback: _onMsgMmSetMapTagIdFlags },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmSetMapName,                             callback: _onMsgMmSetMapName },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmAddWarRule,                             callback: _onMsgMmAddWarRule },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmAddWarEvent,                            callback: _onMsgMmAddWarEvent },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmSubmitMapSimpleDialogue,                callback: _onMsgMmSubmitMapSimpleDialogue },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmDeleteRedundantWarEvent,                callback: _onMsgMmDeleteRedundantWarEvent },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmDeleteWarRule,                          callback: _onMsgMmDeleteWarRule },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmSetWarRuleName,                         callback: _onMsgMmSetWarRuleName },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmSetWarRuleFixedTileTheme,               callback: _onMsgMmSetWarRuleFixedTileTheme },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmSetMapTagSingleData,                    callback: _onMsgMmSetMapTagSingleData },
    ], null);
}

export function reqMapGetMapTag(): void {
    NetworksManager.send({
        MsgMapGetMapTag: { c: {
        } }
    });
}
function _onMsgMapGetMapTag(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMapGetMapTagS.S;
    if (!data.getErrorCode()) {
        NormalMapModelNormalMapModel.setMapTag(HelpersMisc.getExisted(data.getMapTag()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMapGetMapTag, data);
    }
}

export function reqNormalMapGetAllEnabledBriefDataVersions(): void {
    NetworksManager.send({ MsgNormalMapGetAllEnabledBriefDataVersions: { c: {
    } } });
}
async function _onMsgNormalMapGetAllEnabledBriefDataVersions(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetAllEnabledBriefDataVersionsS.S;
    if (!data.getErrorCode()) {
        await NormalMapModelNormalMapModel.updateOnMsgNormalMapGetAllEnabledBriefDataVersions(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgNormalMapGetAllEnabledBriefDataVersions, data);
    }
}

export function reqNormalMapGetBriefData(normalMapId: number): void {
    NetworksManager.send({ MsgNormalMapGetBriefData: { c: {
        normalMapId : normalMapId,
    }, }, });
}
async function _onMsgNormalMapGetBriefData(e: VendorEgretEgret.Event): Promise<void> {
    const data  = e.data as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataS.S;
    if (data.getErrorCode()) {
        NormalMapModelNormalMapModel.updateOnFailedMsgNormalMapGetBriefData(data);
    } else {
        await NormalMapModelNormalMapModel.updateOnMsgNormalMapGetBriefData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgNormalMapGetBriefData, data);
    }
}

export function reqNormalMapGetBriefDataArray(normalMapIdArray: number[]): void {
    NetworksManager.send({ MsgNormalMapGetBriefDataArray: { c: {
        normalMapIdArray : normalMapIdArray,
    }, }, });
}
async function _onMsgNormalMapGetBriefDataArray(e: VendorEgretEgret.Event): Promise<void> {
    const data  = e.data as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataArrayS.S;
    if (!data.getErrorCode()) {
        await NormalMapModelNormalMapModel.updateOnMsgNormalMapGetBriefDataArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgNormalMapGetBriefDataArray, data);
    }
}

export function reqNormalMapGetBriefDataVersion(normalMapId: number): void {
    NetworksManager.send({ MsgNormalMapGetBriefDataVersion: { c: {
        normalMapId : normalMapId,
    }, }, });
}
async function _onMsgNormalMapGetBriefDataVersion(e: VendorEgretEgret.Event): Promise<void> {
    const data  = e.data as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataVersionS.S;
    if (data.getErrorCode()) {
        NormalMapModelNormalMapModel.updateOnFailedMsgNormalMapGetBriefDataVersion(data);
    } else {
        await NormalMapModelNormalMapModel.updateOnMsgNormalMapGetBriefDataVersion(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgNormalMapGetBriefDataVersion, data);
    }
}

export function reqGetMapRawData(normalMapId: number): void {
    NetworksManager.send({ MsgMapGetRawData: { c: {
        normalMapId: normalMapId,
    }, }, });
}
async function _onMsgMapGetRawData(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMapGetRawDataS.S;
    if (data.getErrorCode()) {
        NormalMapModelNormalMapModel.updateOnFailedMsgMapGetRawData(data);
    } else {
        await NormalMapModelNormalMapModel.updateOnMsgMapGetRawData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMapGetRawData, data);
    }
}

export function reqMmAddIgnoredReviewingMap(designerUserId: number, slotIndex: number, dataTimestamp: number): void {
    NetworksManager.send({
        MsgMmAddIgnoredReviewingMap: { c: {
            designerUserId  : designerUserId,
            slotIndex       : slotIndex,
            dataTimestamp   : dataTimestamp,
        }, }
    });
}
function _onMsgMmAddIgnoredReviewingMap(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmAddIgnoredReviewingMapS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmAddIgnoredReviewingMap, data);
    }
}

export function reqMmSetWarRuleAvailability({ normalMapId, ruleId, availability }: {
    normalMapId     : number;
    ruleId          : number;
    availability    : ProtoSchemaCommonProtoWarRuleRuleAvailability.RuleAvailability;
}): void {
    NetworksManager.send({
        MsgMmSetWarRuleAvailability: { c: {
            normalMapId     : normalMapId,
            ruleId          : ruleId,
            availability    : availability.toJson(),
        }, },
    });
}
async function _onMsgMmSetWarRuleAvailability(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleAvailabilityS.S;
    if (!data.getErrorCode()) {
        await NormalMapModelNormalMapModel.updateOnMsgMmSetWarRuleAvailability(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmSetWarRuleAvailability, data);
    }
}

export function reqMmSetMapEnabled(normalMapId: number, isEnabled: boolean): void {
    NetworksManager.send({
        MsgMmSetMapEnabled: { c: {
            normalMapId : normalMapId,
            isEnabled   : isEnabled,
        }, }
    });
}
function _onMsgMmSetMapEnabled(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmSetMapEnabledS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmSetMapEnabled, data);
    }
}

export function reqMmGetReviewingMaps(): void {
    NetworksManager.send({
        MsgMmGetReviewingMaps: { c: {} },
    });
}
function _onMsgMmGetReviewingMaps(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmGetReviewingMapsS.S;
    if (!data.getErrorCode()) {
        NormalMapModelNormalMapModel.updateOnMsgMmGetReviewingMaps(data.getMaps());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmGetReviewingMaps, data);
    }
}

export function reqMmReviewMap({ designerUserId, slotIndex, modifiedTime, isAccept, reviewComment }: {
    designerUserId  : number;
    slotIndex       : number;
    modifiedTime    : number;
    isAccept        : boolean;
    reviewComment   : string | null;
}): void {
    NetworksManager.send({
        MsgMmReviewMap: { c: {
            designerUserId,
            slotIndex,
            modifiedTime,
            isAccept,
            reviewComment,
        }, },
    });
}
function _onMsgMmReviewMap(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmReviewMapS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmReviewMap, data);
    }
}

export function reqMmSetMapTagIdFlags(normalMapId: number, mapTagIdFlags: number): void {
    NetworksManager.send({ MsgMmSetMapTagIdFlags: { c: {
        normalMapId     : normalMapId,
        mapTagIdFlags,
    } } });
}
async function _onMsgMmSetMapTagIdFlags(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmSetMapTagIdFlagsS.S;
    if (!data.getErrorCode()) {
        await NormalMapModelNormalMapModel.updateOnMsgMmSetMapTagIdFlags(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmSetMapTagIdFlags, data);
    }
}

export function reqMmSetMapName(normalMapId: number, mapNameArray: ProtoSchemaCommonProtoStructureLanguageText.LanguageText[]): void {
    NetworksManager.send({ MsgMmSetMapName: { c: {
        normalMapId     : normalMapId,
        mapNameArray    : mapNameArray.map(v => v.toJson()),
    } } });
}
async function _onMsgMmSetMapName(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmSetMapNameS.S;
    if (!data.getErrorCode()) {
        await NormalMapModelNormalMapModel.updateOnMsgMmSetMapName(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmSetMapName, data);
    }
}

export function reqMmAddWarRule(normalMapId: number, templateWarRule: ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule): void {
    NetworksManager.send({
        MsgMmAddWarRule: { c: {
            normalMapId     : normalMapId,
            templateWarRule : templateWarRule.toJson(),
        } },
    });
}
async function _onMsgMmAddWarRule(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmAddWarRuleS.S;
    if (!data.getErrorCode()) {
        await NormalMapModelNormalMapModel.updateOnMsgMmAddWarRule(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmAddWarRule, data);
    }
}

export function reqMmAddWarEvent(normalMapId: number, incrementalWarEventFullData: ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData): void {
    NetworksManager.send({
        MsgMmAddWarEvent: { c: {
            normalMapId                     : normalMapId,
            incrementalWarEventFullData     : incrementalWarEventFullData.toJson(),
        } },
    });
}
async function _onMsgMmAddWarEvent(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmAddWarEventS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmAddWarEvent, data);
    }
}

export function reqMmSubmitMapSimpleDialogue(
    normalMapId                 : number,
    mapSimpleDialogueArray      : ProtoSchemaCommonProtoMapMapSimpleDialogue.MapSimpleDialogue[],
    warRuleDialogueInfoArray    : ProtoSchemaCommonProtoNetMessageMsgMmSubmitMapSimpleDialogueWarRuleDialogueInfo.WarRuleDialogueInfo[],
): void {
    NetworksManager.send({
        MsgMmSubmitMapSimpleDialogue: { c: {
            normalMapId                 : normalMapId,
            mapSimpleDialogueArray      : mapSimpleDialogueArray.map(v => v.toJson()),
            warRuleDialogueInfoArray    : warRuleDialogueInfoArray.map(v => v.toJson()),
        } },
    });
}
function _onMsgMmSubmitMapSimpleDialogue(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmSubmitMapSimpleDialogueS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmSubmitMapSimpleDialogue, data);
    }
}

export function reqMmDeleteRedundantWarEvent(normalMapId: number): void {
    NetworksManager.send({
        MsgMmDeleteRedundantWarEvent: { c: {
            normalMapId : normalMapId,
        } },
    });
}
async function _onMsgMmDeleteRedundantWarEvent(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmDeleteRedundantWarEventS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmDeleteRedundantWarEvent, data);
    }
}

export function reqMmDeleteWarRule(normalMapId: number, ruleId: number): void {
    NetworksManager.send({
        MsgMmDeleteWarRule: { c: {
            normalMapId : normalMapId,
            ruleId,
        } },
    });
}
async function _onMsgMmDeleteWarRule(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmDeleteWarRuleS.S;
    if (!data.getErrorCode()) {
        await NormalMapModelNormalMapModel.updateOnMsgMmDeleteWarRule(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmDeleteWarRule, data);
    }
}

export function reqMmSetWarRuleName(normalMapId: number, ruleId: number, ruleNameArray: ProtoSchemaCommonProtoStructureLanguageText.LanguageText[]): void {
    NetworksManager.send({
        MsgMmSetWarRuleName : { c: {
            normalMapId     : normalMapId,
            ruleId          : ruleId,
            ruleNameArray   : ruleNameArray.map(v => v.toJson()),
        } },
    });
}
async function _onMsgMmSetWarRuleName(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleNameS.S;
    if (!data.getErrorCode()) {
        await NormalMapModelNormalMapModel.updateOnMsgMmSetWarRuleName(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmSetWarRuleName, data);
    }
}

export function reqMmSetWarRuleFixedTileTheme(normalMapId: number, ruleId: number, tileTheme: number | null): void {
    NetworksManager.send({
        MsgMmSetWarRuleFixedTileTheme : { c: {
            normalMapId : normalMapId,
            ruleId      : ruleId,
            tileTheme   : tileTheme,
        } },
    });
}
async function _onMsgMmSetWarRuleFixedTileTheme(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleFixedTileThemeS.S;
    if (!data.getErrorCode()) {
        await NormalMapModelNormalMapModel.updateOnMsgMmSetWarRuleFixedTileTheme(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmSetWarRuleFixedTileTheme, data);
    }
}

export function reqMmSetMapTagSingleData(data: ProtoSchemaCommonProtoMapMapTagMapTagSingleData.MapTagSingleData): void {
    NetworksManager.send({
        MsgMmSetMapTagSingleData: { c: {
            data: data.toJson(),
        } },
    });
}
function _onMsgMmSetMapTagSingleData(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmSetMapTagSingleDataS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmSetMapTagSingleData, data);
    }
}
