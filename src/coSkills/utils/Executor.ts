import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    CoSkills_Utils_InstantManual_ChangeWeather,
    CoSkills_Utils_InstantManual_EnemyEnergy,
    CoSkills_Utils_InstantManual_EnemyFuelGain,
    CoSkills_Utils_InstantManual_EnemyHpGain,
    CoSkills_Utils_InstantManual_EnemyMaterialGain,
    CoSkills_Utils_InstantManual_EnemyPrimaryAmmoGain,
    CoSkills_Utils_InstantManual_EnemyUnitBuffGain,
    CoSkills_Utils_InstantManual_FixedAreaDamage,
    CoSkills_Utils_InstantManual_SelfAddUnit,
    CoSkills_Utils_InstantManual_SelfCoOnboard,
    CoSkills_Utils_InstantManual_SelfFlareAmmoGain,
    CoSkills_Utils_InstantManual_SelfFuelGain,
    CoSkills_Utils_InstantManual_SelfFund,
    CoSkills_Utils_InstantManual_SelfHpGain,
    CoSkills_Utils_InstantManual_SelfMaterialGain,
    CoSkills_Utils_InstantManual_SelfPrimaryAmmoGain,
    CoSkills_Utils_InstantManual_SelfPromotionGain,
    CoSkills_Utils_InstantManual_SelfUnitActionState,
    CoSkills_Utils_InstantManual_SelfUnitBuffGain,
    Helpers_Misc,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Players_Player,
} from "../../internal.ts";

import type { DataForUseCoSkill } from "../../proto/schema/CommonProto/Structure/DataForUseCoSkill.ts";
import type { GridIndex as ProtoGridIndex } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";

export function executeInstantSkillWithExtraData({ player, skillId, skillData, targetGridIndexes, isFastExecute }: {
    player              : Players_Player.Player;
    skillId             : number;
    skillData           : DataForUseCoSkill;
    targetGridIndexes   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ProtoGridIndex[]>;
    isFastExecute       : boolean;
}): void {
    const war       = player.getWar();
    const skillCfg  = Helpers_Misc.getExisted(war.getGcData().getCoSkillCfg(skillId));

    CoSkills_Utils_InstantManual_SelfFund.exeSelfFundWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyEnergy.exeEnemyEnergyWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfAddUnit.exeSelfAddUnitWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfHpGain.exeSelfHpGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyHpGain.exeEnemyHpGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfFuelGain.exeSelfFuelGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyFuelGain.exeEnemyFuelGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfMaterialGain.exeSelfMaterialGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyMaterialGain.exeEnemyMaterialGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfPrimaryAmmoGain.exeSelfPrimaryAmmoGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyPrimaryAmmoGain.exeEnemyPrimaryAmmoGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfUnitBuffGain.exeSelfUnitBuffGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyUnitBuffGain.exeEnemyUnitBuffGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_FixedAreaDamage.exeFixedAreaDamageWithExtraData({
        skillCfg          : skillCfg,
        player            : player,
        skillData         : skillData,
        targetGridIndexes : targetGridIndexes,
        isFastExecute     : isFastExecute,
    });
    CoSkills_Utils_InstantManual_SelfPromotionGain.exeSelfPromotionGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfUnitActionState.exeSelfUnitActionStateWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfFlareAmmoGain.exeSelfFlareAmmoGainWithExtraData({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_ChangeWeather.exeChangeWeatherWithExtraData({
        skillCfg      : skillCfg,
        player        : player,
        skillData     : skillData,
        isFastExecute : isFastExecute,
    });
    CoSkills_Utils_InstantManual_SelfCoOnboard.exeSelfCoOnboardWithExtraData({ isFastExecute : isFastExecute });
}

export function executeInstantSkillWithoutExtraData({ player, skillId, dataForUseCoSkill, targetGridIndexes, isFastExecute }: {
    player              : Players_Player.Player;
    skillId             : number;
    dataForUseCoSkill   : DataForUseCoSkill;
    targetGridIndexes   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ProtoGridIndex[]>;
    isFastExecute       : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war               = player.getWar();
    const skillCfg          = Helpers_Misc.getExisted(war.getGcData().getCoSkillCfg(skillId));
    const coGridIndexList   = player.getCoGridIndexListOnMap();
    const changedThings     = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    changedThings
        .mergeFrom(CoSkills_Utils_InstantManual_SelfFund.exeSelfFundWithoutExtraData({
            skillCfg      : skillCfg,
            player        : player,
            isFastExecute : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyEnergy.exeEnemyEnergyWithoutExtraData({
            skillCfg      : skillCfg,
            player        : player,
            isFastExecute : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfAddUnit.exeSelfAddUnitWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfHpGain.exeSelfHpGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyHpGain.exeEnemyHpGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfFuelGain.exeSelfFuelGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyFuelGain.exeEnemyFuelGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfMaterialGain.exeSelfMaterialGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyMaterialGain.exeEnemyMaterialGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfPrimaryAmmoGain.exeSelfPrimaryAmmoGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyPrimaryAmmoGain.exeEnemyPrimaryAmmoGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfUnitBuffGain.exeSelfUnitBuffGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyUnitBuffGain.exeEnemyUnitBuffGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_FixedAreaDamage.exeFixedAreaDamageWithoutExtraData({
            skillCfg          : skillCfg,
            player            : player,
            skillData         : dataForUseCoSkill,
            targetGridIndexes : targetGridIndexes,
            isFastExecute     : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfPromotionGain.exeSelfPromotionGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfUnitActionState.exeSelfUnitActionStateWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfFlareAmmoGain.exeSelfFlareAmmoGainWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_ChangeWeather.exeChangeWeatherWithoutExtraData({
            skillCfg      : skillCfg,
            player        : player,
            skillData     : dataForUseCoSkill,
            isFastExecute : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfCoOnboard.exeSelfCoOnboardWithoutExtraData({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }));

    return changedThings;
}
