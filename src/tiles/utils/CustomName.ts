import * as LangUtils from "../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureTileCustomName from "../../proto/schema/CommonProto/Structure/TileCustomName.ts";
import * as TilesConstantsCommon from "../constants/Common.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type TileCustomNameSchema   = ProtoSchemaCommonProtoStructureTileCustomName.TileCustomName;

export function checkIsValid(data: TileCustomNameSchema): boolean {
    return getErrorCode(data) === UtilsClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: TileCustomNameSchema): UtilsClientErrorCode.ClientErrorCode {
    {
        const nameId = data.getNameId() ?? 0;
        if ((nameId > TilesConstantsCommon.CustomName.MaxId) ||
            (nameId < TilesConstantsCommon.CustomName.MinId)
        ) {
            return UtilsClientErrorCode.ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomName_00;
        }
    }

    {
        if (!LangUtils.checkIsValidLanguageTextArray({
            list            : data.getNameTextArray(),
            minTextLength   : TilesConstantsCommon.CustomName.MinLength,
            maxTextLength   : TilesConstantsCommon.CustomName.MaxLength,
            minTextCount    : 1
        })) {
            return UtilsClientErrorCode.ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomName_01;
        }
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}

export function getErrorCodeForTileCustomNameArray(names: TileCustomNameSchema[]): UtilsClientErrorCode.ClientErrorCode {
    const idSet = new Set<number>();
    for (const nameData of names) {
        if (!checkIsValid(nameData)) {
            return UtilsClientErrorCode.ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomNameArray_00;
        }

        const nameId = nameData.getNameId() ?? 0;
        if (idSet.has(nameId)) {
            return UtilsClientErrorCode.ClientErrorCode.PhStructureTileCustomNames_GetErrorCodeForTileCustomNameArray_01;
        }
        idSet.add(nameId);
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}
