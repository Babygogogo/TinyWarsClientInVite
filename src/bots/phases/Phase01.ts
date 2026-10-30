import {
    Units_Constants,
    Bots_Utils,
    Timer_TimerModel,
    Utils_ClientErrorCode,
    Cos_Constants,
    Helpers_Misc,
    CoSkills_Constants,
    type Bots_CommonParams,
    type Units_IUnit,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getActionForPhase01(commonParams: Bots_CommonParams.CommonParams): Promise<WoContainer | null> {
    const war               = commonParams.getWar();
    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const player            = war.getPlayer(playerIndexInTurn);
    const coEnergyType      = player.getCoEnergyType();

    if (coEnergyType === Cos_Constants.EnergyTypeId.Trilogy) {
        const unitsInfo         = Helpers_Misc.getExisted(commonParams.getUnitsInfoDict().get(playerIndexInTurn), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetActionForPhase1_00);
        const allUnitsCount     = unitsInfo.allCountOnMap;
        const idleUnitsCount    = unitsInfo.idleCountOnMap;
        const gameConfig        = war.getGcData();
        if (player.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.SuperPower)) {
            const unitTypeSetForCoSkillSetUnitIdle = Bots_Utils.getUnitTypeSetForCoSkillSetUnitIdle(player, CoSkills_Constants.SkillTypeId.SuperPower, gameConfig);
            if (unitTypeSetForCoSkillSetUnitIdle.size > 0) {
                const targetUnits = war.getUnitMap().getAllUnitsOnMap(v => (v.getPlayerIndex() === playerIndexInTurn) && (unitTypeSetForCoSkillSetUnitIdle.has(v.getUnitType())));
                if ((!targetUnits.length)                                                                               ||
                    (targetUnits.some(v => (v.getActionState() === Units_Constants.ActionStateId.Idle) && (v.checkCanAiDoAction())))
                ) {
                    return null;
                }

            } else {
                if (idleUnitsCount < allUnitsCount * 0.85) {
                    return null;
                }
            }

            return WoContainer.fromJson({
                WoPlayerUseCoSkill : {
                    skillType            : CoSkills_Constants.SkillTypeId.SuperPower,
                    targetGridIndexArray : Bots_Utils.getCoPowerSkillTargetGridIndexArray(commonParams, player, CoSkills_Constants.SkillTypeId.SuperPower)?.map(v => v.toProto().toJson()) ?? [],
                },
            });

        } else if (player.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.Power)) {
            if (player.getCoCurrentEnergy() > Helpers_Misc.getExisted(player.getCoPowerEnergy(), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetActionForPhase1_01) * 1.1) {
                return null;
            }

            const unitTypeSetForCoSkillSetUnitIdle = Bots_Utils.getUnitTypeSetForCoSkillSetUnitIdle(player, CoSkills_Constants.SkillTypeId.Power, gameConfig);
            if (unitTypeSetForCoSkillSetUnitIdle.size > 0) {
                const targetUnits = war.getUnitMap().getAllUnitsOnMap(v => (v.getPlayerIndex() === playerIndexInTurn) && (unitTypeSetForCoSkillSetUnitIdle.has(v.getUnitType())));
                if ((!targetUnits.length)                                                                               ||
                    (targetUnits.some(v => (v.getActionState() === Units_Constants.ActionStateId.Idle) && (v.checkCanAiDoAction())))
                ) {
                    return null;
                }

            } else {
                if (idleUnitsCount < allUnitsCount * 0.85) {
                    return null;
                }
            }

            return WoContainer.fromJson({
                WoPlayerUseCoSkill : {
                    skillType            : CoSkills_Constants.SkillTypeId.Power,
                    targetGridIndexArray : Bots_Utils.getCoPowerSkillTargetGridIndexArray(commonParams, player, CoSkills_Constants.SkillTypeId.Power)?.map(v => v.toProto().toJson()) ?? [],
                },
            });

        } else {
            return null;
        }
    }

    if (coEnergyType === Cos_Constants.EnergyTypeId.Dor) {
        for (const unit of await getCandidateUnitsForPhase1(commonParams)) {
            const action = (await Bots_Utils.getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
            if (action) {
                return action;
            }
        }

        return null;
    }

    return null;
}

async function getCandidateUnitsForPhase1(commonParams: Bots_CommonParams.CommonParams): Promise<Units_IUnit.IUnit[]> {
    await Timer_TimerModel.checkAndCallLater();

    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const unitMap           = commonParams.getWar().getUnitMap();
    const units             : Units_IUnit.IUnit[] = [];
    for (const unit of unitMap.getAllUnitsOnMap()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)                                                       &&
            (unit.getActionState() === Units_Constants.ActionStateId.Idle)                                                    &&
            (unit.checkCanAiDoAction())                                                                         &&
            ((unit.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.Power) || (unit.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.SuperPower))))
        ) {
            units.push(unit);
        }
    }
    for (const unit of unitMap.getAllUnitsLoaded()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)                                                       &&
            (unit.getActionState() === Units_Constants.ActionStateId.Idle)                                                    &&
            (unit.checkCanAiDoAction())                                                                         &&
            ((unit.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.Power) || (unit.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.SuperPower))))
        ) {
            const loaderUnit = unit.getLoaderUnit();
            if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
                (loaderUnit.getActionState() === Units_Constants.ActionStateId.Idle)          &&
                (loaderUnit.checkCanAiDoAction())                               &&
                (loaderUnit.checkCanLaunchLoadedUnit())                         &&
                (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
            ) {
                units.push(unit);
            }
        }
    }

    return units.sort(Bots_Utils.candidateUnitSorter).slice(0, 10);
}
