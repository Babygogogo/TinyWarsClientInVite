import * as LangUtils from "../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureUnitCustomName from "../../proto/schema/CommonProto/Structure/UnitCustomName.ts";
import * as UnitsConstants from "../Constants.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type ProtoUnitCustomName    = ProtoSchemaCommonProtoStructureUnitCustomName.UnitCustomName;

export function checkIsValid(data: ProtoUnitCustomName): boolean {
    return getErrorCode(data) === UtilsClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: ProtoUnitCustomName): UtilsClientErrorCode.ClientErrorCode {
    {
        const nameId = data.getNameId() ?? 0;
        if ((nameId > UnitsConstants.CustomName.MaxId) ||
            (nameId < UnitsConstants.CustomName.MinId)
        ) {
            return UtilsClientErrorCode.ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomName_00;
        }
    }

    {
        if (!LangUtils.checkIsValidLanguageTextArray({
            list            : data.getNameTextArray(),
            minTextLength   : UnitsConstants.CustomName.MinLength,
            maxTextLength   : UnitsConstants.CustomName.MaxLength,
            minTextCount    : 1
        })) {
            return UtilsClientErrorCode.ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomName_01;
        }
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}

export function getErrorCodeForUnitCustomNameArray(names: ProtoUnitCustomName[]): UtilsClientErrorCode.ClientErrorCode {
    const idSet = new Set<number>();
    for (const nameData of names) {
        if (!checkIsValid(nameData)) {
            return UtilsClientErrorCode.ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomNameArray_00;
        }

        const nameId = nameData.getNameId() ?? 0;
        if (idSet.has(nameId)) {
            return UtilsClientErrorCode.ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomNameArray_01;
        }
        idSet.add(nameId);
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}

export function checkIsValidCustomNameId(nameId: number): boolean {
    return (nameId >= UnitsConstants.CustomName.MinId)
        && (nameId <= UnitsConstants.CustomName.MaxId);
}
