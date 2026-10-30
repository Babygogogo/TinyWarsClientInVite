import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { newError } from "../../helpers/Misc.ts";
import { UnitBuff } from "../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import {
    EndTimeModification,
    AllBuffTypeIdArray,
    BuffTypeId,
} from "../Constants.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export function checkIsValidModificationEndPlayerIndex(playerIndex: number): boolean {
    return (playerIndex >= EndTimeModification.MinEndPlayerIndex)
        && (playerIndex <= EndTimeModification.MaxEndPlayerIndex);
}
export function checkIsValidModificationEndTurnIndex(turnIndex: number): boolean {
    return (turnIndex >= EndTimeModification.MinEndTurnIndex)
        && (turnIndex <= EndTimeModification.MaxEndTurnIndex);
}

export function create({ buffTypeId, expiringTurnIndex, expiringPlayerIndex, extraParams, }: {
    buffTypeId          : number;
    expiringTurnIndex   : Undefinable<number>;
    expiringPlayerIndex : Undefinable<number>;
    extraParams         : Undefinable<number[]>;
}): UnitBuff {
    const data = new UnitBuff();
    data.setBuffTypeId(buffTypeId);
    data.setExpiringTurnIndex(expiringTurnIndex);
    data.setExpiringPlayerIndex(expiringPlayerIndex);
    data.setExtraParamArray(extraParams ?? []);

    return data;
}

export function checkIsValidTypeId(buffTypeId: number): boolean {
    return AllBuffTypeIdArray.includes(buffTypeId);
}
export function checkIsValidTypeIdSubset(buffTypeIdArray: number[]): boolean {
    return (buffTypeIdArray.length === new Set(buffTypeIdArray).size)
        && (buffTypeIdArray.every(v => checkIsValidTypeId(v)));
}

export function getIsExtraParamSupported(buffTypeId: number): boolean {
    switch (buffTypeId) {
        case BuffTypeId.Fire        : return false;
        case BuffTypeId.Disease     : return false;
        case BuffTypeId.Custom      : return false;
        default                     : throw newError(`Invalid buffType: ${buffTypeId}`);
    }
}
export function checkIsValidExtraParams(buffType: number, extraParams: Undefinable<number[]>): boolean {
    const count = extraParams?.length ?? 0;
    if (buffType === BuffTypeId.Fire) {
        return count === 0;
    } else if (buffType === BuffTypeId.Disease) {
        return count === 0;
    } else if (buffType === BuffTypeId.Custom) {
        return count === 0;
    } else {
        return false;
    }
}

export function checkIsValid(data: UnitBuff): boolean {
    return getErrorCode(data) === ClientErrorCode.NoError;
}
export function getErrorCode(data: UnitBuff): ClientErrorCode {
    const buffTypeId = data.getBuffTypeId();
    if ((buffTypeId == null) || (!checkIsValidTypeId(buffTypeId))) {
        return ClientErrorCode.PhUnitBuff_GetErrorCode_00;
    }

    const expiringTurnIndex     = data.getExpiringTurnIndex();
    const expiringPlayerIndex   = data.getExpiringPlayerIndex();
    if ((expiringTurnIndex != null) != (expiringPlayerIndex != null)) {
        return ClientErrorCode.PhUnitBuff_GetErrorCode_01;
    }
    if ((expiringTurnIndex != null) && (expiringTurnIndex < 0)) {
        return ClientErrorCode.PhUnitBuff_GetErrorCode_02;
    }
    if ((expiringPlayerIndex != null) && (expiringPlayerIndex < 0)) {
        return ClientErrorCode.PhUnitBuff_GetErrorCode_03;
    }
    if (!checkIsValidExtraParams(buffTypeId, data.getExtraParamArray())) {
        return ClientErrorCode.PhUnitBuff_GetErrorCode_04;
    }

    return ClientErrorCode.NoError;
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
