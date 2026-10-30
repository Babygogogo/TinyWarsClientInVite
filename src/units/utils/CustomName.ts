import { checkIsValidLanguageTextArray } from "../../lang/Utils.ts";
import type { UnitCustomName } from "../../proto/schema/CommonProto/Structure/UnitCustomName.ts";
import { CustomName } from "../Constants.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export function checkIsValid(data: UnitCustomName): boolean {
    return getErrorCode(data) === ClientErrorCode.NoError;
}
export function getErrorCode(data: UnitCustomName): ClientErrorCode {
    {
        const nameId = data.getNameId();
        if ((nameId > CustomName.MaxId) ||
            (nameId < CustomName.MinId)
        ) {
            return ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomName_00;
        }
    }

    {
        if (!checkIsValidLanguageTextArray({
            list            : data.getNameTextArray(),
            minTextLength   : CustomName.MinLength,
            maxTextLength   : CustomName.MaxLength,
            minTextCount    : 1
        })) {
            return ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomName_01;
        }
    }

    return ClientErrorCode.NoError;
}

export function getErrorCodeForUnitCustomNameArray(names: UnitCustomName[]): ClientErrorCode {
    const idSet = new Set<number>();
    for (const nameData of names) {
        if (!checkIsValid(nameData)) {
            return ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomNameArray_00;
        }

        const nameId = nameData.getNameId();
        if (idSet.has(nameId)) {
            return ClientErrorCode.PhStructureUnitCustomNames_GetErrorCodeForUnitCustomNameArray_01;
        }
        idSet.add(nameId);
    }

    return ClientErrorCode.NoError;
}

export function checkIsValidCustomNameId(nameId: number): boolean {
    return (nameId >= CustomName.MinId)
        && (nameId <= CustomName.MaxId);
}
