import { getExisted } from "../../helpers/Misc.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import {
    setMapTag,
    updateOnMsgNormalMapGetAllEnabledBriefDataVersions,
    updateOnFailedMsgNormalMapGetBriefData,
    updateOnMsgNormalMapGetBriefData,
    updateOnMsgNormalMapGetBriefDataArray,
    updateOnFailedMsgNormalMapGetBriefDataVersion,
    updateOnMsgNormalMapGetBriefDataVersion,
    updateOnFailedMsgMapGetRawData,
    updateOnMsgMapGetRawData,
    updateOnMsgMmSetWarRuleAvailability,
    updateOnMsgMmGetReviewingMaps,
    updateOnMsgMmSetMapTagIdFlags,
    updateOnMsgMmSetMapName,
    updateOnMsgMmAddWarRule,
    updateOnMsgMmDeleteWarRule,
    updateOnMsgMmSetWarRuleName,
    updateOnMsgMmSetWarRuleFixedTileTheme,
} from "./NormalMapModel.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
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
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgMapGetMapTag,                             callback: _onMsgMapGetMapTag },
        { msgCode: MessageCodes.MsgNormalMapGetAllEnabledBriefDataVersions,  callback: _onMsgNormalMapGetAllEnabledBriefDataVersions },
        { msgCode: MessageCodes.MsgNormalMapGetBriefDataVersion,             callback: _onMsgNormalMapGetBriefDataVersion },
        { msgCode: MessageCodes.MsgNormalMapGetBriefData,                    callback: _onMsgNormalMapGetBriefData },
        { msgCode: MessageCodes.MsgNormalMapGetBriefDataArray,               callback: _onMsgNormalMapGetBriefDataArray },
        { msgCode: MessageCodes.MsgMapGetRawData,                            callback: _onMsgMapGetRawData },
        { msgCode: MessageCodes.MsgMmAddIgnoredReviewingMap,                 callback: _onMsgMmAddIgnoredReviewingMap },
        { msgCode: MessageCodes.MsgMmSetWarRuleAvailability,                 callback: _onMsgMmSetWarRuleAvailability },
        { msgCode: MessageCodes.MsgMmSetMapEnabled,                          callback: _onMsgMmSetMapEnabled },
        { msgCode: MessageCodes.MsgMmGetReviewingMaps,                       callback: _onMsgMmGetReviewingMaps },
        { msgCode: MessageCodes.MsgMmReviewMap,                              callback: _onMsgMmReviewMap },
        { msgCode: MessageCodes.MsgMmSetMapTagIdFlags,                       callback: _onMsgMmSetMapTagIdFlags },
        { msgCode: MessageCodes.MsgMmSetMapName,                             callback: _onMsgMmSetMapName },
        { msgCode: MessageCodes.MsgMmAddWarRule,                             callback: _onMsgMmAddWarRule },
        { msgCode: MessageCodes.MsgMmAddWarEvent,                            callback: _onMsgMmAddWarEvent },
        { msgCode: MessageCodes.MsgMmSubmitMapSimpleDialogue,                callback: _onMsgMmSubmitMapSimpleDialogue },
        { msgCode: MessageCodes.MsgMmDeleteRedundantWarEvent,                callback: _onMsgMmDeleteRedundantWarEvent },
        { msgCode: MessageCodes.MsgMmDeleteWarRule,                          callback: _onMsgMmDeleteWarRule },
        { msgCode: MessageCodes.MsgMmSetWarRuleName,                         callback: _onMsgMmSetWarRuleName },
        { msgCode: MessageCodes.MsgMmSetWarRuleFixedTileTheme,               callback: _onMsgMmSetWarRuleFixedTileTheme },
        { msgCode: MessageCodes.MsgMmSetMapTagSingleData,                    callback: _onMsgMmSetMapTagSingleData },
    ], null);
}

export function reqMapGetMapTag(): void {
    send({
        MsgMapGetMapTag: { c: {
        } }
    });
}
function _onMsgMapGetMapTag(e: Event): void {
    const data = e.data as MapGetMapTagResponse;
    if (!data.getErrorCode()) {
        setMapTag(getExisted(data.getMapTag()));
        dispatch(TypeId.MsgMapGetMapTag, data);
    }
}

export function reqNormalMapGetAllEnabledBriefDataVersions(): void {
    send({ MsgNormalMapGetAllEnabledBriefDataVersions: { c: {
    } } });
}
async function _onMsgNormalMapGetAllEnabledBriefDataVersions(e: Event): Promise<void> {
    const data = e.data as NormalMapGetAllEnabledBriefDataVersionsResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgNormalMapGetAllEnabledBriefDataVersions(data);
        dispatch(TypeId.MsgNormalMapGetAllEnabledBriefDataVersions, data);
    }
}

export function reqNormalMapGetBriefData(normalMapId: number): void {
    send({ MsgNormalMapGetBriefData: { c: {
        normalMapId : normalMapId,
    }, }, });
}
async function _onMsgNormalMapGetBriefData(e: Event): Promise<void> {
    const data  = e.data as NormalMapGetBriefDataResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgNormalMapGetBriefData(data);
    } else {
        await updateOnMsgNormalMapGetBriefData(data);
        dispatch(TypeId.MsgNormalMapGetBriefData, data);
    }
}

export function reqNormalMapGetBriefDataArray(normalMapIdArray: number[]): void {
    send({ MsgNormalMapGetBriefDataArray: { c: {
        normalMapIdArray : normalMapIdArray,
    }, }, });
}
async function _onMsgNormalMapGetBriefDataArray(e: Event): Promise<void> {
    const data  = e.data as NormalMapGetBriefDataArrayResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgNormalMapGetBriefDataArray(data);
        dispatch(TypeId.MsgNormalMapGetBriefDataArray, data);
    }
}

export function reqNormalMapGetBriefDataVersion(normalMapId: number): void {
    send({ MsgNormalMapGetBriefDataVersion: { c: {
        normalMapId : normalMapId,
    }, }, });
}
async function _onMsgNormalMapGetBriefDataVersion(e: Event): Promise<void> {
    const data  = e.data as NormalMapGetBriefDataVersionResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgNormalMapGetBriefDataVersion(data);
    } else {
        await updateOnMsgNormalMapGetBriefDataVersion(data);
        dispatch(TypeId.MsgNormalMapGetBriefDataVersion, data);
    }
}

export function reqGetMapRawData(normalMapId: number): void {
    send({ MsgMapGetRawData: { c: {
        normalMapId: normalMapId,
    }, }, });
}
async function _onMsgMapGetRawData(e: Event): Promise<void> {
    const data = e.data as MapGetRawDataResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgMapGetRawData(data);
    } else {
        await updateOnMsgMapGetRawData(data);
        dispatch(TypeId.MsgMapGetRawData, data);
    }
}

export function reqMmAddIgnoredReviewingMap(designerUserId: number, slotIndex: number, dataTimestamp: number): void {
    send({
        MsgMmAddIgnoredReviewingMap: { c: {
            designerUserId  : designerUserId,
            slotIndex       : slotIndex,
            dataTimestamp   : dataTimestamp,
        }, }
    });
}
function _onMsgMmAddIgnoredReviewingMap(e: Event): void {
    const data = e.data as MmAddIgnoredReviewingMapResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMmAddIgnoredReviewingMap, data);
    }
}

export function reqMmSetWarRuleAvailability({ normalMapId, ruleId, availability }: {
    normalMapId     : number;
    ruleId          : number;
    availability    : RuleAvailability;
}): void {
    send({
        MsgMmSetWarRuleAvailability: { c: {
            normalMapId     : normalMapId,
            ruleId          : ruleId,
            availability    : availability.toJson(),
        }, },
    });
}
async function _onMsgMmSetWarRuleAvailability(e: Event): Promise<void> {
    const data = e.data as MmSetWarRuleAvailabilityResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMmSetWarRuleAvailability(data);
        dispatch(TypeId.MsgMmSetWarRuleAvailability, data);
    }
}

export function reqMmSetMapEnabled(normalMapId: number, isEnabled: boolean): void {
    send({
        MsgMmSetMapEnabled: { c: {
            normalMapId : normalMapId,
            isEnabled   : isEnabled,
        }, }
    });
}
function _onMsgMmSetMapEnabled(e: Event): void {
    const data = e.data as MmSetMapEnabledResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMmSetMapEnabled, data);
    }
}

export function reqMmGetReviewingMaps(): void {
    send({
        MsgMmGetReviewingMaps: { c: {} },
    });
}
function _onMsgMmGetReviewingMaps(e: Event): void {
    const data = e.data as MmGetReviewingMapsResponse;
    if (!data.getErrorCode()) {
        updateOnMsgMmGetReviewingMaps(data.getMaps());
        dispatch(TypeId.MsgMmGetReviewingMaps, data);
    }
}

export function reqMmReviewMap({ designerUserId, slotIndex, modifiedTime, isAccept, reviewComment }: {
    designerUserId  : number;
    slotIndex       : number;
    modifiedTime    : number;
    isAccept        : boolean;
    reviewComment   : string | null;
}): void {
    send({
        MsgMmReviewMap: { c: {
            designerUserId,
            slotIndex,
            modifiedTime,
            isAccept,
            reviewComment,
        }, },
    });
}
function _onMsgMmReviewMap(e: Event): void {
    const data = e.data as MmReviewMapResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMmReviewMap, data);
    }
}

export function reqMmSetMapTagIdFlags(normalMapId: number, mapTagIdFlags: number): void {
    send({ MsgMmSetMapTagIdFlags: { c: {
        normalMapId     : normalMapId,
        mapTagIdFlags,
    } } });
}
async function _onMsgMmSetMapTagIdFlags(e: Event): Promise<void> {
    const data = e.data as MmSetMapTagIdFlagsResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMmSetMapTagIdFlags(data);
        dispatch(TypeId.MsgMmSetMapTagIdFlags, data);
    }
}

export function reqMmSetMapName(normalMapId: number, mapNameArray: LanguageText[]): void {
    send({ MsgMmSetMapName: { c: {
        normalMapId     : normalMapId,
        mapNameArray    : mapNameArray.map(v => v.toJson()),
    } } });
}
async function _onMsgMmSetMapName(e: Event): Promise<void> {
    const data = e.data as MmSetMapNameResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMmSetMapName(data);
        dispatch(TypeId.MsgMmSetMapName, data);
    }
}

export function reqMmAddWarRule(normalMapId: number, templateWarRule: TemplateWarRule): void {
    send({
        MsgMmAddWarRule: { c: {
            normalMapId     : normalMapId,
            templateWarRule : templateWarRule.toJson(),
        } },
    });
}
async function _onMsgMmAddWarRule(e: Event): Promise<void> {
    const data = e.data as MmAddWarRuleResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMmAddWarRule(data);
        dispatch(TypeId.MsgMmAddWarRule, data);
    }
}

export function reqMmAddWarEvent(normalMapId: number, incrementalWarEventFullData: WarEventFullData): void {
    send({
        MsgMmAddWarEvent: { c: {
            normalMapId                     : normalMapId,
            incrementalWarEventFullData     : incrementalWarEventFullData.toJson(),
        } },
    });
}
async function _onMsgMmAddWarEvent(e: Event): Promise<void> {
    const data = e.data as MmAddWarEventResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMmAddWarEvent, data);
    }
}

export function reqMmSubmitMapSimpleDialogue(
    normalMapId                 : number,
    mapSimpleDialogueArray      : MapSimpleDialogue[],
    warRuleDialogueInfoArray    : WarRuleDialogueInfo[],
): void {
    send({
        MsgMmSubmitMapSimpleDialogue: { c: {
            normalMapId                 : normalMapId,
            mapSimpleDialogueArray      : mapSimpleDialogueArray.map(v => v.toJson()),
            warRuleDialogueInfoArray    : warRuleDialogueInfoArray.map(v => v.toJson()),
        } },
    });
}
function _onMsgMmSubmitMapSimpleDialogue(e: Event): void {
    const data = e.data as MmSubmitMapSimpleDialogueResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMmSubmitMapSimpleDialogue, data);
    }
}

export function reqMmDeleteRedundantWarEvent(normalMapId: number): void {
    send({
        MsgMmDeleteRedundantWarEvent: { c: {
            normalMapId : normalMapId,
        } },
    });
}
async function _onMsgMmDeleteRedundantWarEvent(e: Event): Promise<void> {
    const data = e.data as MmDeleteRedundantWarEventResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMmDeleteRedundantWarEvent, data);
    }
}

export function reqMmDeleteWarRule(normalMapId: number, ruleId: number): void {
    send({
        MsgMmDeleteWarRule: { c: {
            normalMapId : normalMapId,
            ruleId,
        } },
    });
}
async function _onMsgMmDeleteWarRule(e: Event): Promise<void> {
    const data = e.data as MmDeleteWarRuleResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMmDeleteWarRule(data);
        dispatch(TypeId.MsgMmDeleteWarRule, data);
    }
}

export function reqMmSetWarRuleName(normalMapId: number, ruleId: number, ruleNameArray: LanguageText[]): void {
    send({
        MsgMmSetWarRuleName : { c: {
            normalMapId     : normalMapId,
            ruleId          : ruleId,
            ruleNameArray   : ruleNameArray.map(v => v.toJson()),
        } },
    });
}
async function _onMsgMmSetWarRuleName(e: Event): Promise<void> {
    const data = e.data as MmSetWarRuleNameResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMmSetWarRuleName(data);
        dispatch(TypeId.MsgMmSetWarRuleName, data);
    }
}

export function reqMmSetWarRuleFixedTileTheme(normalMapId: number, ruleId: number, tileTheme: number | null): void {
    send({
        MsgMmSetWarRuleFixedTileTheme : { c: {
            normalMapId : normalMapId,
            ruleId      : ruleId,
            tileTheme   : tileTheme,
        } },
    });
}
async function _onMsgMmSetWarRuleFixedTileTheme(e: Event): Promise<void> {
    const data = e.data as MmSetWarRuleFixedTileThemeResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMmSetWarRuleFixedTileTheme(data);
        dispatch(TypeId.MsgMmSetWarRuleFixedTileTheme, data);
    }
}

export function reqMmSetMapTagSingleData(data: MapTagSingleData): void {
    send({
        MsgMmSetMapTagSingleData: { c: {
            data: data.toJson(),
        } },
    });
}
function _onMsgMmSetMapTagSingleData(e: Event): void {
    const data = e.data as MmSetMapTagSingleDataResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMmSetMapTagSingleData, data);
    }
}
