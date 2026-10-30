import {
    TileBuffs_Constants,
    Helpers_Collection,
    Utils_ClientErrorCode,
    Helpers_Misc,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { TileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";

export function checkIsValidModificationEndPlayerIndex(playerIndex: number): boolean {
    return (playerIndex >= TileBuffs_Constants.EndTimeModification.MinEndPlayerIndex)
        && (playerIndex <= TileBuffs_Constants.EndTimeModification.MaxEndPlayerIndex);
}
export function checkIsValidModificationEndTurnIndex(turnIndex: number): boolean {
    return (turnIndex >= TileBuffs_Constants.EndTimeModification.MinEndTurnIndex)
        && (turnIndex <= TileBuffs_Constants.EndTimeModification.MaxEndTurnIndex);
}

export function create({ buffTypeId, expiringTurnIndex, expiringPlayerIndex, extraParams, }: {
    buffTypeId          : number;
    expiringTurnIndex   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    expiringPlayerIndex : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    extraParams         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>;
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
        && (Helpers_Collection.checkIsSameList(data1.getExtraParamArray(), data2.getExtraParamArray()));
}

export function checkIsValidTypeId(buffType: number): boolean {
    return TileBuffs_Constants.AllBuffTypeIdArray.includes(buffType);
}
export function checkIsValidTypeIdSubset(buffTypeIdArray: number[]): boolean {
    return (buffTypeIdArray.length === new Set(buffTypeIdArray).size)
        && (buffTypeIdArray.every(v => checkIsValidTypeId(v)));
}

export function checkIsExtraParamSupported(buffTypeId: number): boolean {
    switch (buffTypeId) {
        case TileBuffs_Constants.BuffTypeId.NoProduction    : return false;
        case TileBuffs_Constants.BuffTypeId.NoIncome        : return false;
        case TileBuffs_Constants.BuffTypeId.Custom          : return false;
        default                         : throw Helpers_Misc.newError(`Invalid buffType: ${buffTypeId}`);
    }
}
export function checkIsValidExtraParams(buffTypeId: number, extraParams: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>): boolean {
    const count = extraParams?.length ?? 0;
    if (buffTypeId === TileBuffs_Constants.BuffTypeId.NoProduction) {
        return count === 0;
    } else if (buffTypeId === TileBuffs_Constants.BuffTypeId.NoIncome) {
        return count === 0;
    } else if (buffTypeId === TileBuffs_Constants.BuffTypeId.Custom) {
        return count === 0;
    } else {
        throw Helpers_Misc.newError(`Invalid buffTypeId: ${buffTypeId}`);
    }
}

export function checkIsValid(data: TileBuff): boolean {
    return getErrorCode(data) === Utils_ClientErrorCode.ClientErrorCode.NoError;
}
export function getErrorCode(data: TileBuff): Utils_ClientErrorCode.ClientErrorCode {
    const buffTypeId = data.getBuffTypeId();
    if ((buffTypeId == null) || (!checkIsValidTypeId(buffTypeId))) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_00;
    }

    const expiringTurnIndex     = data.getExpiringTurnIndex();
    const expiringPlayerIndex   = data.getExpiringPlayerIndex();
    if ((expiringTurnIndex != null) != (expiringPlayerIndex != null)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_01;
    }
    if ((expiringTurnIndex != null) && (expiringTurnIndex < 0)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_02;
    }
    if ((expiringPlayerIndex != null) && (expiringPlayerIndex < 0)) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_03;
    }
    if (!checkIsValidExtraParams(buffTypeId, data.getExtraParamArray())) {
        return Utils_ClientErrorCode.ClientErrorCode.PhTileBuff_GetErrorCode_04;
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
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
