import {
    Lang_Utils,
    Utils_ClientErrorCode,
    Units_Constants,
} from "../../internal.ts";
import type { UnitCustomName } from "../../proto/schema/CommonProto/Structure/UnitCustomName.ts";

export function checkIsValid(data: UnitCustomName): boolean {
    return getErrorCode(data) === Utils_ClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: UnitCustomName): Utils_ClientErrorCode.ClientErrorCode {
    {
        const nameId = data.getNameId();
        if ((nameId > Units_Constants.CustomName.MaxId) ||
            (nameId < Units_Constants.CustomName.MinId)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomName_00;
        }
    }

    {
        if (!Lang_Utils.checkIsValidLanguageTextArray({
            list          : data.getNameTextArray(),
            minTextLength : Units_Constants.CustomName.MinLength,
            maxTextLength : Units_Constants.CustomName.MaxLength,
            minTextCount  : 1,
        })) {
            return Utils_ClientErrorCode.ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomName_01;
        }
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function getErrorCodeForUnitCustomNameArray(names: UnitCustomName[]): Utils_ClientErrorCode.ClientErrorCode {
    const idSet = new Set<number>();
    for (const nameData of names) {
        if (!checkIsValid(nameData)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomNameArray_00;
        }

        const nameId = nameData.getNameId();
        if (idSet.has(nameId)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomNameArray_01;
        }
        idSet.add(nameId);
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function checkIsValidCustomNameId(nameId: number): boolean {
    return (nameId >= Units_Constants.CustomName.MinId)
        && (nameId <= Units_Constants.CustomName.MaxId);
}
