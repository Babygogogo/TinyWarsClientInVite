import {
    Cos_Constants,
    Numbers_Utils,
    Helpers_Collection,
} from "../internal.ts";
import type { CoBasicCfg } from "../proto/schema/CommonProto/Config/CoBasicCfg.ts";

export function checkIsValidEnergy(energy: number): boolean {
    return (energy === Math.floor(energy))
        && (energy >= Cos_Constants.EnergyHardLimit.Min)
        && (energy <= Cos_Constants.EnergyHardLimit.Max);
}
export function getValidEnergy(energy: number): number {
    return Numbers_Utils.getValueInRange({
        minValue : Cos_Constants.EnergyHardLimit.Min,
        maxValue : Cos_Constants.EnergyHardLimit.Max,
        rawValue : Math.floor(energy),
    });
}

export function getCoMaxEnergy(coConfig: CoBasicCfg): number {
    const expansionArray = coConfig.getZoneExpansionEnergyList();
    return Math.max(
        expansionArray[expansionArray.length - 1] ?? 0,
        coConfig.getPowerEnergyList()[1] ?? 0,
    );
}

export function pickRandomCo(coIdList: number[]): number {
    if ((coIdList == null) || (coIdList.length <= 0)) {
        // throw Helpers.Misc.newError(`Empty coIdList.`, ClientErrorCode.WarRuleHelpers_GetRandomCoIdWithCoIdList_00);
        return Cos_Constants.CoId.Empty;
    } else {
        if (coIdList.length <= 1) {
            return coIdList[0];
        } else {
            return Helpers_Collection.pickRandomElement(coIdList.filter(v => v !== Cos_Constants.CoId.Empty));
        }
    }
}
