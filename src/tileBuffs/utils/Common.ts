import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoStructureTileBuff from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import * as TileBuffsConstants from "../Constants.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export function checkIsValidModificationEndPlayerIndex(playerIndex: number): boolean {
    return (playerIndex >= TileBuffsConstants.EndTimeModification.MinEndPlayerIndex)
        && (playerIndex <= TileBuffsConstants.EndTimeModification.MaxEndPlayerIndex);
}
export function checkIsValidModificationEndTurnIndex(turnIndex: number): boolean {
    return (turnIndex >= TileBuffsConstants.EndTimeModification.MinEndTurnIndex)
        && (turnIndex <= TileBuffsConstants.EndTimeModification.MaxEndTurnIndex);
}

export function create({ buffTypeId, expiringTurnIndex, expiringPlayerIndex, extraParams, }: {
    buffTypeId          : number;
    expiringTurnIndex   : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    expiringPlayerIndex : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    extraParams         : AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>;
}): ProtoSchemaCommonProtoStructureTileBuff.TileBuff {
    const data = new ProtoSchemaCommonProtoStructureTileBuff.TileBuff();
    data.setBuffTypeId(buffTypeId);
    data.setExpiringTurnIndex(expiringTurnIndex);
    data.setExpiringPlayerIndex(expiringPlayerIndex);
    data.setExtraParamArray(extraParams ?? []);

    return data;
}
export function checkIsSame(data1: ProtoSchemaCommonProtoStructureTileBuff.TileBuff, data2: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): boolean {
    return (data1.getBuffTypeId()            == data2.getBuffTypeId())
        && (data1.getExpiringTurnIndex()     == data2.getExpiringTurnIndex())
        && (data1.getExpiringPlayerIndex()   == data2.getExpiringPlayerIndex())
        && (HelpersCollection.checkIsSameList(data1.getExtraParamArray(), data2.getExtraParamArray()));
}

export function checkIsValidTypeId(buffType: number): boolean {
    return TileBuffsConstants.AllBuffTypeIdArray.includes(buffType);
}
export function checkIsValidTypeIdSubset(buffTypeIdArray: number[]): boolean {
    return (buffTypeIdArray.length === new Set(buffTypeIdArray).size)
        && (buffTypeIdArray.every(v => checkIsValidTypeId(v)));
}

export function checkIsExtraParamSupported(buffTypeId: number): boolean {
    switch (buffTypeId) {
        case TileBuffsConstants.BuffTypeId.NoProduction    : return false;
        case TileBuffsConstants.BuffTypeId.NoIncome        : return false;
        case TileBuffsConstants.BuffTypeId.Custom          : return false;
        default                         : throw HelpersMisc.newError(`Invalid buffType: ${buffTypeId}`);
    }
}
export function checkIsValidExtraParams(buffTypeId: number, extraParams: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>): boolean {
    const count = extraParams?.length ?? 0;
    if (buffTypeId === TileBuffsConstants.BuffTypeId.NoProduction) {
        return count === 0;
    } else if (buffTypeId === TileBuffsConstants.BuffTypeId.NoIncome) {
        return count === 0;
    } else if (buffTypeId === TileBuffsConstants.BuffTypeId.Custom) {
        return count === 0;
    } else {
        throw HelpersMisc.newError(`Invalid buffTypeId: ${buffTypeId}`);
    }
}

export function checkIsValid(data: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): boolean {
    return getErrorCode(data) === UtilsClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): UtilsClientErrorCode.ClientErrorCode {
    const buffTypeId = data.getBuffTypeId();
    if ((buffTypeId == null) || (!checkIsValidTypeId(buffTypeId))) {
        return UtilsClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_00;
    }

    const expiringTurnIndex     = data.getExpiringTurnIndex();
    const expiringPlayerIndex   = data.getExpiringPlayerIndex();
    if ((expiringTurnIndex != null) != (expiringPlayerIndex != null)) {
        return UtilsClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_01;
    }
    if ((expiringTurnIndex != null) && (expiringTurnIndex < 0)) {
        return UtilsClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_02;
    }
    if ((expiringPlayerIndex != null) && (expiringPlayerIndex < 0)) {
        return UtilsClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_03;
    }
    if (!checkIsValidExtraParams(buffTypeId, data.getExtraParamArray())) {
        return UtilsClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_04;
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}

export function checkIsExpired(data: ProtoSchemaCommonProtoStructureTileBuff.TileBuff, turnIndex: number, playerIndex: number): boolean {
    const expiringTurnIndex = data.getExpiringTurnIndex();
    if (expiringTurnIndex == null) {
        return false;
    }

    const expiringPlayerIndex = data.getExpiringPlayerIndex();
    if (expiringPlayerIndex == null) {
        return false;
    }

    return (expiringTurnIndex < turnIndex)
        || ((expiringTurnIndex == turnIndex) && (expiringPlayerIndex <= playerIndex));
}

export function checkIsEverlasting(data: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): boolean {
    return (data.getExpiringTurnIndex() == null)
        || (data.getExpiringPlayerIndex() == null);
}
