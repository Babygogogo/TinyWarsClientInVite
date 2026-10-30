import type { CommonParams } from "../CommonParams.ts";
import {
    getUnitTypeSetForCoSkillSetUnitIdle,
    getCoPowerSkillTargetGridIndexArray,
    getBestScoreAndActionForCandidateUnit,
    candidateUnitSorter,
} from "../Utils.ts";
import { EnergyTypeId } from "../../cos/Constants.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import { ActionStateId } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export async function getActionForPhase01(commonParams: CommonParams): Promise<WoContainer | null> {
    const war               = commonParams.getWar();
    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const player            = war.getPlayer(playerIndexInTurn);
    const coEnergyType      = player.getCoEnergyType();

    if (coEnergyType === EnergyTypeId.Trilogy) {
        const unitsInfo         = getExisted(commonParams.getUnitsInfoDict().get(playerIndexInTurn), ClientErrorCode.SpwRobot_GetActionForPhase1_00);
        const allUnitsCount     = unitsInfo.allCountOnMap;
        const idleUnitsCount    = unitsInfo.idleCountOnMap;
        const gameConfig        = war.getGcData();
        if (player.checkCanUseCoSkill(SkillTypeId.SuperPower)) {
            const unitTypeSetForCoSkillSetUnitIdle = getUnitTypeSetForCoSkillSetUnitIdle(player, SkillTypeId.SuperPower, gameConfig);
            if (unitTypeSetForCoSkillSetUnitIdle.size > 0) {
                const targetUnits = war.getUnitMap().getAllUnitsOnMap(v => (v.getPlayerIndex() === playerIndexInTurn) && (unitTypeSetForCoSkillSetUnitIdle.has(v.getUnitType())));
                if ((!targetUnits.length)                                                                               ||
                    (targetUnits.some(v => (v.getActionState() === ActionStateId.Idle) && (v.checkCanAiDoAction())))
                ) {
                    return null;
                }

            } else {
                if (idleUnitsCount < allUnitsCount * 0.85) {
                    return null;
                }
            }

            return WoContainer.fromJson({
                WoPlayerUseCoSkill: {
                    skillType               : SkillTypeId.SuperPower,
                    targetGridIndexArray    : getCoPowerSkillTargetGridIndexArray(commonParams, player, SkillTypeId.SuperPower)?.map(v => v.toProto().toJson()) ?? [],
                },
            });

        } else if (player.checkCanUseCoSkill(SkillTypeId.Power)) {
            if (player.getCoCurrentEnergy() > getExisted(player.getCoPowerEnergy(), ClientErrorCode.SpwRobot_GetActionForPhase1_01) * 1.1) {
                return null;
            }

            const unitTypeSetForCoSkillSetUnitIdle = getUnitTypeSetForCoSkillSetUnitIdle(player, SkillTypeId.Power, gameConfig);
            if (unitTypeSetForCoSkillSetUnitIdle.size > 0) {
                const targetUnits = war.getUnitMap().getAllUnitsOnMap(v => (v.getPlayerIndex() === playerIndexInTurn) && (unitTypeSetForCoSkillSetUnitIdle.has(v.getUnitType())));
                if ((!targetUnits.length)                                                                               ||
                    (targetUnits.some(v => (v.getActionState() === ActionStateId.Idle) && (v.checkCanAiDoAction())))
                ) {
                    return null;
                }

            } else {
                if (idleUnitsCount < allUnitsCount * 0.85) {
                    return null;
                }
            }

            return WoContainer.fromJson({
                WoPlayerUseCoSkill: {
                    skillType               : SkillTypeId.Power,
                    targetGridIndexArray    : getCoPowerSkillTargetGridIndexArray(commonParams, player, SkillTypeId.Power)?.map(v => v.toProto().toJson()) ?? [],
                },
            });

        } else {
            return null;
        }
    }

    if (coEnergyType === EnergyTypeId.Dor) {
        for (const unit of await getCandidateUnitsForPhase1(commonParams)) {
            const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
            if (action) {
                return action;
            }
        }

        return null;
    }

    return null;
}

async function getCandidateUnitsForPhase1(commonParams: CommonParams): Promise<IUnit[]> {
    await checkAndCallLater();

    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const unitMap           = commonParams.getWar().getUnitMap();
    const units             : IUnit[] = [];
    for (const unit of unitMap.getAllUnitsOnMap()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)                                                       &&
            (unit.getActionState() === ActionStateId.Idle)                                                    &&
            (unit.checkCanAiDoAction())                                                                         &&
            ((unit.checkCanUseCoSkill(SkillTypeId.Power) || (unit.checkCanUseCoSkill(SkillTypeId.SuperPower))))
        ) {
            units.push(unit);
        }
    }
    for (const unit of unitMap.getAllUnitsLoaded()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)                                                       &&
            (unit.getActionState() === ActionStateId.Idle)                                                    &&
            (unit.checkCanAiDoAction())                                                                         &&
            ((unit.checkCanUseCoSkill(SkillTypeId.Power) || (unit.checkCanUseCoSkill(SkillTypeId.SuperPower))))
        ) {
            const loaderUnit = unit.getLoaderUnit();
            if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
                (loaderUnit.getActionState() === ActionStateId.Idle)          &&
                (loaderUnit.checkCanAiDoAction())                               &&
                (loaderUnit.checkCanLaunchLoadedUnit())                         &&
                (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
            ) {
                units.push(unit);
            }
        }
    }

    return units.sort(candidateUnitSorter).slice(0, 10);
}
