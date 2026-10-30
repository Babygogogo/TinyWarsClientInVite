import { checkIsValidLanguageTextArray } from "../../lang/Utils.ts";
import type { TileCustomName } from "../../proto/schema/CommonProto/Structure/TileCustomName.ts";
import { CustomName } from "../constants/Common.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export function checkIsValid(data: TileCustomName): boolean {
    return getErrorCode(data) === ClientErrorCode.NoError;
}
export function getErrorCode(data: TileCustomName): ClientErrorCode {
    {
        const nameId = data.getNameId();
        if ((nameId > CustomName.MaxId) ||
            (nameId < CustomName.MinId)
        ) {
            return ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomName_00;
        }
    }

    {
        if (!checkIsValidLanguageTextArray({
            list            : data.getNameTextArray(),
            minTextLength   : CustomName.MinLength,
            maxTextLength   : CustomName.MaxLength,
            minTextCount    : 1
        })) {
            return ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomName_01;
        }
    }

    return ClientErrorCode.NoError;
}

export function getErrorCodeForTileCustomNameArray(names: TileCustomName[]): ClientErrorCode {
    const idSet = new Set<number>();
    for (const nameData of names) {
        if (!checkIsValid(nameData)) {
            return ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomNameArray_00;
        }

        const nameId = nameData.getNameId();
        if (idSet.has(nameId)) {
            return ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomNameArray_01;
        }
        idSet.add(nameId);
    }

    return ClientErrorCode.NoError;
}
