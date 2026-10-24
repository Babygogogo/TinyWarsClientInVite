import * as CosConstants from "./Constants.ts";
import * as HelpersCollection from "../helpers/Collection.ts";
import * as NumbersUtils from "../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoConfigCoBasicCfg from "../proto/schema/CommonProto/Config/CoBasicCfg.ts";

type CoBasicCfg         = ProtoSchemaCommonProtoConfigCoBasicCfg.CoBasicCfg;

export function checkIsValidEnergy(energy: number): boolean {
    return (energy === Math.floor(energy))
        && (energy >= CosConstants.EnergyHardLimit.Min)
        && (energy <= CosConstants.EnergyHardLimit.Max);
}
export function getValidEnergy(energy: number): number {
    return NumbersUtils.getValueInRange({
        minValue    : CosConstants.EnergyHardLimit.Min,
        maxValue    : CosConstants.EnergyHardLimit.Max,
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
        return CosConstants.CoId.Empty;
    } else {
        if (coIdList.length <= 1) {
            return coIdList[0];
        } else {
            return HelpersCollection.pickRandomElement(coIdList.filter(v => v !== CosConstants.CoId.Empty));
        }
    }
}
