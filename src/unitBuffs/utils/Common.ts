import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoStructureUnitBuff from "../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import * as UnitBuffsConstants from "../Constants.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export function checkIsValidModificationEndPlayerIndex(playerIndex: number): boolean {
    return (playerIndex >= UnitBuffsConstants.EndTimeModification.MinEndPlayerIndex)
        && (playerIndex <= UnitBuffsConstants.EndTimeModification.MaxEndPlayerIndex);
}
export function checkIsValidModificationEndTurnIndex(turnIndex: number): boolean {
    return (turnIndex >= UnitBuffsConstants.EndTimeModification.MinEndTurnIndex)
        && (turnIndex <= UnitBuffsConstants.EndTimeModification.MaxEndTurnIndex);
}

export function create({ buffTypeId, expiringTurnIndex, expiringPlayerIndex, extraParams, }: {
    buffTypeId          : number;
    expiringTurnIndex   : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    expiringPlayerIndex : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    extraParams         : AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>;
}): ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff {
    const data = new ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff();
    data.setBuffTypeId(buffTypeId);
    data.setExpiringTurnIndex(expiringTurnIndex);
    data.setExpiringPlayerIndex(expiringPlayerIndex);
    data.setExtraParamArray(extraParams ?? []);

    return data;
}

export function checkIsValidTypeId(buffTypeId: number): boolean {
    return UnitBuffsConstants.AllBuffTypeIdArray.includes(buffTypeId);
}
export function checkIsValidTypeIdSubset(buffTypeIdArray: number[]): boolean {
    return (buffTypeIdArray.length === new Set(buffTypeIdArray).size)
        && (buffTypeIdArray.every(v => checkIsValidTypeId(v)));
}

export function getIsExtraParamSupported(buffTypeId: number): boolean {
    switch (buffTypeId) {
        case UnitBuffsConstants.BuffTypeId.Fire        : return false;
        case UnitBuffsConstants.BuffTypeId.Disease     : return false;
        case UnitBuffsConstants.BuffTypeId.Custom      : return false;
        default                     : throw HelpersMisc.newError(`Invalid buffType: ${buffTypeId}`);
    }
}
export function checkIsValidExtraParams(buffType: number, extraParams: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>): boolean {
    const count = extraParams?.length ?? 0;
    if (buffType === UnitBuffsConstants.BuffTypeId.Fire) {
        return count === 0;
    } else if (buffType === UnitBuffsConstants.BuffTypeId.Disease) {
        return count === 0;
    } else if (buffType === UnitBuffsConstants.BuffTypeId.Custom) {
        return count === 0;
    } else {
        return false;
    }
}

export function checkIsValid(data: ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff): boolean {
    return getErrorCode(data) === UtilsClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff): UtilsClientErrorCode.ClientErrorCode {
    const buffTypeId = data.getBuffTypeId();
    if ((buffTypeId == null) || (!checkIsValidTypeId(buffTypeId))) {
        return UtilsClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_00;
    }

    const expiringTurnIndex     = data.getExpiringTurnIndex();
    const expiringPlayerIndex   = data.getExpiringPlayerIndex();
    if ((expiringTurnIndex != null) != (expiringPlayerIndex != null)) {
        return UtilsClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_01;
    }
    if ((expiringTurnIndex != null) && (expiringTurnIndex < 0)) {
        return UtilsClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_02;
    }
    if ((expiringPlayerIndex != null) && (expiringPlayerIndex < 0)) {
        return UtilsClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_03;
    }
    if (!checkIsValidExtraParams(buffTypeId, data.getExtraParamArray())) {
        return UtilsClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_04;
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}

export function checkIsExpired(data: ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff, turnIndex: number, playerIndex: number): boolean {
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

export function checkIsEverlasting(data: ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff): boolean {
    return (data.getExpiringTurnIndex() == null)
        || (data.getExpiringPlayerIndex() == null);
}
