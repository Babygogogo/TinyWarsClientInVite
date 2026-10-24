import * as CoSkillsConstants from "../../Constants.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgInstantMiscSelfFundAfterBattle from "../../../proto/schema/CommonProto/Config/CoSkillCfg/InstantMisc/SelfFundAfterBattle.ts";

export function getTotalOffset({
    cfg,
    gameConfig,
    selfUnitTypeId,
    isSelfInCoZone,
    enemyUnitTypeId,
    enemyNormalizedMaxHp,
    enemyNormalizedLostHp,
    enemyFinalProductionCost,
}: {
    cfg                         : ProtoSchemaCommonProtoConfigCoSkillCfgInstantMiscSelfFundAfterBattle.SelfFundAfterBattle | null | undefined;
    gameConfig                  : GameConfigGcData.GcData;
    selfUnitTypeId              : number;
    isSelfInCoZone              : boolean;
    enemyUnitTypeId             : number;
    enemyNormalizedMaxHp        : number;
    enemyNormalizedLostHp       : number;
    enemyFinalProductionCost    : number;
}): number {
    if ((cfg == null) || (enemyNormalizedLostHp === 0) || (enemyFinalProductionCost === 0)) {
        return 0;
    }
    if ((!isSelfInCoZone) && ((cfg.getCoSkillAreaTypeId() ?? 0) !== CoSkillsConstants.AreaTypeId.Halo)) {
        return 0;
    }

    {
        const selfUnitCategoryId = cfg.getSelfUnitCategoryId();
        if ((selfUnitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(selfUnitTypeId, selfUnitCategoryId))) {
            return 0;
        }
    }

    {
        const enemyUnitCategoryId = cfg.getEnemyUnitCategoryId();
        if ((enemyUnitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(enemyUnitTypeId, enemyUnitCategoryId))) {
            return 0;
        }
    }

    return enemyFinalProductionCost / enemyNormalizedMaxHp * enemyNormalizedLostHp * (cfg.getConversionPctFromDamageDealt() ?? 0) / 100;
}
