import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWecOngoingPersistentActionPresence from "../../../proto/schema/CommonProto/WarEvent/WecOngoingPersistentActionPresence.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";
import * as WarEventsActionsUtilsCommon from "../../actions/utils/Common.ts";

type WecOngoingPersistentActionPresence = ProtoSchemaCommonProtoWarEventWecOngoingPersistentActionPresence.WecOngoingPersistentActionPresence;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecOngoingPersistentActionPresence>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0135,
        LangUtils.getComparatorName(HelpersMisc.getExisted(data.getOngoingActionsCountComparator())),
        data.getOngoingActionsCount() ?? LangConstants.UndefinedError,
    );
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecOngoingPersistentActionPresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const actionIdArray = data.getOngoingActionIdArray();
        if (actionIdArray?.length) {
            subTextArray.push(`- ${LangUtils.getFormattedText(
                LangConstants.TextType.F0226,
                actionIdArray.join(` ${LangUtils.getText(LangConstants.TextType.Or)} `)
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(LangUtils.getText(LangConstants.TextType.A0944));
    }

    return [
        LangUtils.getFormattedText(
            LangConstants.TextType.F0225,
            LangUtils.getComparatorName(HelpersMisc.getExisted(data.getOngoingActionsCountComparator())),
            data.getOngoingActionsCount() ?? LangConstants.UndefinedError,
        ),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecOngoingPersistentActionPresence): string | null {
    if (data.getOngoingActionsCount() == null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0902));
    }

    {
        const comparator = data.getOngoingActionsCountComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    {
        const actionIdArray = data.getOngoingActionIdArray();
        if ((actionIdArray) && (!WarEventsActionsUtilsCommon.checkIsValidWarEventActionIdSubset(actionIdArray))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0889));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecOngoingPersistentActionPresence>): boolean {
    if (condition == null) {
        return false;
    }

    {
        const actionIdArray = condition.getOngoingActionIdArray();
        if ((actionIdArray) && (!WarEventsActionsUtilsCommon.checkIsValidWarEventActionIdSubset(actionIdArray))) {
            return false;
        }
    }

    if (condition.getOngoingActionsCount() == null) {
        return false;
    }

    {
        const comparator = condition.getOngoingActionsCountComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecOngoingPersistentActionPresence, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    const conActionIdArray  = condition.getOngoingActionIdArray();
    const opaIdArray        = war.getWarEventManager().getOpaIdArray();
    let counter                 = 0;
    if (!conActionIdArray?.length) {
        counter = opaIdArray.length;
    } else {
        const opaIdSet = new Set(opaIdArray);
        for (const actionId of conActionIdArray) {
            if (opaIdSet.has(actionId)) {
                ++counter;
            }
        }
    }

    return ValueAndComparatorsUtils.checkIsMeet1({
        comparator  : HelpersMisc.getExisted(condition.getOngoingActionsCountComparator(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConOngoingPersistentActionPresence_00),
        targetValue : HelpersMisc.getExisted(condition.getOngoingActionsCount(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConOngoingPersistentActionPresence_01),
        actualValue : counter,
    });
}
