import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaStopPersistentAction from "../../../proto/schema/CommonProto/WarEvent/WeaStopPersistentAction.ts";

type WeaStopPersistentAction    = ProtoSchemaCommonProtoWarEventWeaStopPersistentAction.WeaStopPersistentAction;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaStopPersistentAction>): boolean {
    if (action == null) {
        return false;
    }

    const actionIdArray = action.getActionIdArray();
    if ((actionIdArray == null)                                 ||
        (actionIdArray.length !== new Set(actionIdArray).size)
    ) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaStopPersistentAction>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0130, data.getActionIdArray()?.map(v => `A${v}`).join(`/`) || `--`);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaStopPersistentAction>): string | null {
    return getBriefDesc(data);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getErrorTip(data: WeaStopPersistentAction, fullData: ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData): string | null {
    const actionIdArray = data.getActionIdArray();
    if ((actionIdArray == null) || (actionIdArray.length === 0)) {
        return LangUtils.getText(LangConstants.TextType.A0305);
    }

    if (actionIdArray.length !== new Set(actionIdArray).size) {
        return LangUtils.getText(LangConstants.TextType.A0306);
    }

    return null;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaStopPersistentAction, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    war.getWarEventManager().updateOpaIdArrayOnDeleteAction(action.getActionIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaStopPersistentAction, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    war.getWarEventManager().updateOpaIdArrayOnDeleteAction(action.getActionIdArray());
}
