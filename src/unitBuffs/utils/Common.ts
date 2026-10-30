import {
    UnitBuffs_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { UnitBuff } from "../../proto/schema/CommonProto/Structure/UnitBuff.ts";

export function checkIsValidModificationEndPlayerIndex(playerIndex: number): boolean {
    return (playerIndex >= UnitBuffs_Constants.EndTimeModification.MinEndPlayerIndex)
        && (playerIndex <= UnitBuffs_Constants.EndTimeModification.MaxEndPlayerIndex);
}
export function checkIsValidModificationEndTurnIndex(turnIndex: number): boolean {
    return (turnIndex >= UnitBuffs_Constants.EndTimeModification.MinEndTurnIndex)
        && (turnIndex <= UnitBuffs_Constants.EndTimeModification.MaxEndTurnIndex);
}

export function create({ buffTypeId, expiringTurnIndex, expiringPlayerIndex, extraParams, }: {
    buffTypeId          : number;
    expiringTurnIndex   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    expiringPlayerIndex : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    extraParams         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>;
}): UnitBuff {
    const data = new UnitBuff();
    data.setBuffTypeId(buffTypeId);
    data.setExpiringTurnIndex(expiringTurnIndex);
    data.setExpiringPlayerIndex(expiringPlayerIndex);
    data.setExtraParamArray(extraParams ?? []);

    return data;
}

export function checkIsValidTypeId(buffTypeId: number): boolean {
    return UnitBuffs_Constants.AllBuffTypeIdArray.includes(buffTypeId);
}
export function checkIsValidTypeIdSubset(buffTypeIdArray: number[]): boolean {
    return (buffTypeIdArray.length === new Set(buffTypeIdArray).size)
        && (buffTypeIdArray.every(v => checkIsValidTypeId(v)));
}

export function getIsExtraParamSupported(buffTypeId: number): boolean {
    switch (buffTypeId) {
        case UnitBuffs_Constants.BuffTypeId.Fire        : return false;
        case UnitBuffs_Constants.BuffTypeId.Disease     : return false;
        case UnitBuffs_Constants.BuffTypeId.Custom      : return false;
        default                     : throw Helpers_Misc.newError(`Invalid buffType: ${buffTypeId}`);
    }
}
export function checkIsValidExtraParams(buffType: number, extraParams: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>): boolean {
    const count = extraParams?.length ?? 0;
    if (buffType === UnitBuffs_Constants.BuffTypeId.Fire) {
        return count === 0;
    } else if (buffType === UnitBuffs_Constants.BuffTypeId.Disease) {
        return count === 0;
    } else if (buffType === UnitBuffs_Constants.BuffTypeId.Custom) {
        return count === 0;
    } else {
        return false;
    }
}

export function checkIsValid(data: UnitBuff): boolean {
    return getErrorCode(data) === Utils_ClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: UnitBuff): Utils_ClientErrorCode.ClientErrorCode {
    const buffTypeId = data.getBuffTypeId();
    if ((buffTypeId == null) || (!checkIsValidTypeId(buffTypeId))) {
        return Utils_ClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_00;
    }

    const expiringTurnIndex     = data.getExpiringTurnIndex();
    const expiringPlayerIndex   = data.getExpiringPlayerIndex();
    if ((expiringTurnIndex != null) != (expiringPlayerIndex != null)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_01;
    }
    if ((expiringTurnIndex != null) && (expiringTurnIndex < 0)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_02;
    }
    if ((expiringPlayerIndex != null) && (expiringPlayerIndex < 0)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_03;
    }
    if (!checkIsValidExtraParams(buffTypeId, data.getExtraParamArray())) {
        return Utils_ClientErrorCode.ClientErrorCode.PhUnitBuff_GetErrorCode_04;
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function checkIsExpired(data: UnitBuff, turnIndex: number, playerIndex: number): boolean {
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

export function checkIsEverlasting(data: UnitBuff): boolean {
    return (data.getExpiringTurnIndex() == null)
        || (data.getExpiringPlayerIndex() == null);
}
