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
    CoSkills_Utils_InstantManual_SelfHp,
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

export function executeInstantSkillAsOuterWar({ player, skillId, skillData, targetGridIndexes, isFastExecute }: {
    player              : Players_Player.Player;
    skillId             : number;
    // HACK: skillData本应必定非空，但由于重构CO技能配置时给部分CO新增了技能而没有相应修改进行中的对局，导致局内回放出错，因此改为允许为空
    // 为空时，相关技能将可能不会被执行；若以后发现相关对局的完整回放可以正常播放，或者直接删除相关数据，就可以改回必定非空
    skillData           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<DataForUseCoSkill>;
    targetGridIndexes   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ProtoGridIndex[]>;
    isFastExecute       : boolean;
}): void {
    const war       = player.getWar();
    const skillCfg  = Helpers_Misc.getExisted(war.getGcData().getCoSkillCfg(skillId));

    CoSkills_Utils_InstantManual_SelfFund.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyEnergy.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfAddUnit.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfHp.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyHpGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfFuelGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyFuelGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfMaterialGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyMaterialGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfPrimaryAmmoGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyPrimaryAmmoGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfUnitBuffGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_EnemyUnitBuffGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_FixedAreaDamage.executeAsOuterWar({
        skillCfg          : skillCfg,
        player            : player,
        skillData         : skillData,
        targetGridIndexes : targetGridIndexes,
        isFastExecute     : isFastExecute,
    });
    CoSkills_Utils_InstantManual_SelfPromotionGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfUnitActionState.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_SelfFlareAmmoGain.executeAsOuterWar({ isFastExecute : isFastExecute });
    CoSkills_Utils_InstantManual_ChangeWeather.executeAsOuterWar({
        skillCfg      : skillCfg,
        player        : player,
        skillData     : skillData,
        isFastExecute : isFastExecute,
    });
    CoSkills_Utils_InstantManual_SelfCoOnboard.executeAsOuterWar({ isFastExecute : isFastExecute });
}

export function executeInstantSkillAsInnerWar({ player, skillId, dataForUseCoSkill, targetGridIndexes }: {
    player              : Players_Player.Player;
    skillId             : number;
    dataForUseCoSkill   : DataForUseCoSkill;
    targetGridIndexes   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ProtoGridIndex[]>;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return executeInstantSkillAsLocalWar({
        player            : player,
        skillId           : skillId,
        dataForUseCoSkill : dataForUseCoSkill,
        targetGridIndexes : targetGridIndexes,
        isFastExecute     : true,
    });
}

export function executeInstantSkillAsUnifiedWar({ player, skillId, dataForUseCoSkill, targetGridIndexes, isFastExecute }: {
    player              : Players_Player.Player;
    skillId             : number;
    dataForUseCoSkill   : DataForUseCoSkill;
    targetGridIndexes   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ProtoGridIndex[]>;
    isFastExecute       : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return executeInstantSkillAsLocalWar({
        player            : player,
        skillId           : skillId,
        dataForUseCoSkill : dataForUseCoSkill,
        targetGridIndexes : targetGridIndexes,
        isFastExecute     : isFastExecute,
    });
}

export function executeInstantSkillAsLocalWar({ player, skillId, dataForUseCoSkill, targetGridIndexes, isFastExecute }: {
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
        .mergeFrom(CoSkills_Utils_InstantManual_SelfFund.executeAsLocalWar({
            skillCfg      : skillCfg,
            player        : player,
            isFastExecute : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyEnergy.executeAsLocalWar({
            skillCfg      : skillCfg,
            player        : player,
            isFastExecute : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfAddUnit.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfHp.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyHpGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfFuelGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyFuelGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfMaterialGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyMaterialGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfPrimaryAmmoGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyPrimaryAmmoGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfUnitBuffGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_EnemyUnitBuffGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_FixedAreaDamage.executeAsLocalWar({
            skillCfg          : skillCfg,
            player            : player,
            skillData         : dataForUseCoSkill,
            targetGridIndexes : targetGridIndexes,
            isFastExecute     : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfPromotionGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfUnitActionState.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfFlareAmmoGain.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_ChangeWeather.executeAsLocalWar({
            skillCfg      : skillCfg,
            player        : player,
            skillData     : dataForUseCoSkill,
            isFastExecute : isFastExecute,
        }))
        .mergeFrom(CoSkills_Utils_InstantManual_SelfCoOnboard.executeAsLocalWar({
            skillCfg        : skillCfg,
            player          : player,
            coGridIndexList : coGridIndexList,
            isFastExecute   : isFastExecute,
        }));

    return changedThings;
}
