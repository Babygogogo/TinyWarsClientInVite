import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { checkIsSameList } from "../../helpers/Collection.ts";
import { newError } from "../../helpers/Misc.ts";
import { TileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import { EndTimeModification, AllBuffTypeIdArray, BuffTypeId } from "../Constants.ts";
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
}): TileBuff {
    const data = new TileBuff();
    data.setBuffTypeId(buffTypeId);
    data.setExpiringTurnIndex(expiringTurnIndex);
    data.setExpiringPlayerIndex(expiringPlayerIndex);
    data.setExtraParamArray(extraParams ?? []);

    return data;
}
export function checkIsSame(data1: TileBuff, data2: TileBuff): boolean {
    return (data1.getBuffTypeId()            == data2.getBuffTypeId())
        && (data1.getExpiringTurnIndex()     == data2.getExpiringTurnIndex())
        && (data1.getExpiringPlayerIndex()   == data2.getExpiringPlayerIndex())
        && (checkIsSameList(data1.getExtraParamArray(), data2.getExtraParamArray()));
}

export function checkIsValidTypeId(buffType: number): boolean {
    return AllBuffTypeIdArray.includes(buffType);
}
export function checkIsValidTypeIdSubset(buffTypeIdArray: number[]): boolean {
    return (buffTypeIdArray.length === new Set(buffTypeIdArray).size)
        && (buffTypeIdArray.every(v => checkIsValidTypeId(v)));
}

export function checkIsExtraParamSupported(buffTypeId: number): boolean {
    switch (buffTypeId) {
        case BuffTypeId.NoProduction    : return false;
        case BuffTypeId.NoIncome        : return false;
        case BuffTypeId.Custom          : return false;
        default                         : throw newError(`Invalid buffType: ${buffTypeId}`);
    }
}
export function checkIsValidExtraParams(buffTypeId: number, extraParams: Undefinable<number[]>): boolean {
    const count = extraParams?.length ?? 0;
    if (buffTypeId === BuffTypeId.NoProduction) {
        return count === 0;
    } else if (buffTypeId === BuffTypeId.NoIncome) {
        return count === 0;
    } else if (buffTypeId === BuffTypeId.Custom) {
        return count === 0;
    } else {
        throw newError(`Invalid buffTypeId: ${buffTypeId}`);
    }
}

export function checkIsValid(data: TileBuff): boolean {
    return getErrorCode(data) === ClientErrorCode.NoError;
}
export function getErrorCode(data: TileBuff): ClientErrorCode {
    const buffTypeId = data.getBuffTypeId();
    if ((buffTypeId == null) || (!checkIsValidTypeId(buffTypeId))) {
        return ClientErrorCode.PhTileBuff_GetErrorCode_00;
    }

    const expiringTurnIndex     = data.getExpiringTurnIndex();
    const expiringPlayerIndex   = data.getExpiringPlayerIndex();
    if ((expiringTurnIndex != null) != (expiringPlayerIndex != null)) {
        return ClientErrorCode.PhTileBuff_GetErrorCode_01;
    }
    if ((expiringTurnIndex != null) && (expiringTurnIndex < 0)) {
        return ClientErrorCode.PhTileBuff_GetErrorCode_02;
    }
    if ((expiringPlayerIndex != null) && (expiringPlayerIndex < 0)) {
        return ClientErrorCode.PhTileBuff_GetErrorCode_03;
    }
    if (!checkIsValidExtraParams(buffTypeId, data.getExtraParamArray())) {
        return ClientErrorCode.PhTileBuff_GetErrorCode_04;
    }

    return ClientErrorCode.NoError;
}

export function checkIsExpired(data: TileBuff, turnIndex: number, playerIndex: number): boolean {
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

export function checkIsEverlasting(data: TileBuff): boolean {
    return (data.getExpiringTurnIndex() == null)
        || (data.getExpiringPlayerIndex() == null);
}
