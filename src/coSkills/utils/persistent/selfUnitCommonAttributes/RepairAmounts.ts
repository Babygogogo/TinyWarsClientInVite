import {
    type AuxiliaryTypes_GridIndex,
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions,
    type GameConfigs_GameConfig,
} from "../../../../internal.ts";
import type { SelfUnitCommonAttributes } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes.ts";

export function getOffset({
    cfg,
    ...context
}: {
    cfg                         : SelfUnitCommonAttributes | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    tileTypeId                  : number;
    weatherTypeId               : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): number | null {
    const amountEffect = cfg?.getRepairAmounts();
    if ((amountEffect == null) ||
        (!amountEffect.checkHasOffset()) ||
        (!CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeet({
            ...context,
            conditions               : cfg?.getConditions(),
            isInCozByPreviewSettings : false,
        }))
    ) {
        return null;
    }

    return amountEffect.getOffset();
}
