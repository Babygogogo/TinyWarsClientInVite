import { EnergyHardLimit, CoId } from "./Constants.ts";
import { pickRandomElement } from "../helpers/Collection.ts";
import { getValueInRange } from "../numbers/Utils.ts";
import type { CoBasicCfg } from "../proto/schema/CommonProto/Config/CoBasicCfg.ts";

export function checkIsValidEnergy(energy: number): boolean {
    return (energy === Math.floor(energy))
        && (energy >= EnergyHardLimit.Min)
        && (energy <= EnergyHardLimit.Max);
}
export function getValidEnergy(energy: number): number {
    return getValueInRange({
        minValue    : EnergyHardLimit.Min,
        maxValue    : EnergyHardLimit.Max,
        rawValue    : Math.floor(energy),
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
        return CoId.Empty;
    } else {
        if (coIdList.length <= 1) {
            return coIdList[0];
        } else {
            return pickRandomElement(coIdList.filter(v => v !== CoId.Empty));
        }
    }
}
