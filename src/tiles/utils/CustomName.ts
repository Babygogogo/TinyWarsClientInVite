import {
    Lang_Utils,
    Utils_ClientErrorCode,
    Tiles_Constants_Common,
} from "../../internal.ts";
import type { TileCustomName } from "../../proto/schema/CommonProto/Structure/TileCustomName.ts";

export function checkIsValid(data: TileCustomName): boolean {
    return getErrorCode(data) === Utils_ClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: TileCustomName): Utils_ClientErrorCode.ClientErrorCode {
    {
        const nameId = data.getNameId();
        if ((nameId > Tiles_Constants_Common.CustomName.MaxId) ||
            (nameId < Tiles_Constants_Common.CustomName.MinId)
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomName_00;
        }
    }

    {
        if (!Lang_Utils.checkIsValidLanguageTextArray({
            list            : data.getNameTextArray(),
            minTextLength   : Tiles_Constants_Common.CustomName.MinLength,
            maxTextLength   : Tiles_Constants_Common.CustomName.MaxLength,
            minTextCount    : 1
        })) {
            return Utils_ClientErrorCode.ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomName_01;
        }
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function getErrorCodeForTileCustomNameArray(names: TileCustomName[]): Utils_ClientErrorCode.ClientErrorCode {
    const idSet = new Set<number>();
    for (const nameData of names) {
        if (!checkIsValid(nameData)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomNameArray_00;
        }

        const nameId = nameData.getNameId();
        if (idSet.has(nameId)) {
            return Utils_ClientErrorCode.ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomNameArray_01;
        }
        idSet.add(nameId);
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
