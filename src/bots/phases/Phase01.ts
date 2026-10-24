import type * as BotsCommonParams from "../CommonParams.ts";
import * as BotsUtils from "../Utils.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IBwUnit            = UnitsIUnit.IUnit;

export async function getActionForPhase01(commonParams: BotsCommonParams.CommonParams): Promise<ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer | null> {
    const war               = commonParams.getWar();
    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const player            = war.getPlayer(playerIndexInTurn);
    const coEnergyType      = player.getCoEnergyType();

    if (coEnergyType === CosConstants.EnergyTypeId.Trilogy) {
        const unitsInfo         = HelpersMisc.getExisted(commonParams.getUnitsInfoDict().get(playerIndexInTurn), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetActionForPhase1_00);
        const allUnitsCount     = unitsInfo.allCountOnMap;
        const idleUnitsCount    = unitsInfo.idleCountOnMap;
        const gameConfig        = war.getGcData();
        if (player.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.SuperPower)) {
            const unitTypeSetForCoSkillSetUnitIdle = BotsUtils.getUnitTypeSetForCoSkillSetUnitIdle(player, CoSkillsConstants.SkillTypeId.SuperPower, gameConfig);
            if (unitTypeSetForCoSkillSetUnitIdle.size > 0) {
                const targetUnits = war.getUnitMap().getAllUnitsOnMap(v => (v.getPlayerIndex() === playerIndexInTurn) && (unitTypeSetForCoSkillSetUnitIdle.has(v.getUnitType())));
                if ((!targetUnits.length)                                                                               ||
                    (targetUnits.some(v => (v.getActionState() === UnitsConstants.ActionStateId.Idle) && (v.checkCanAiDoAction())))
                ) {
                    return null;
                }

            } else {
                if (idleUnitsCount < allUnitsCount * 0.85) {
                    return null;
                }
            }

            return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
                WoPlayerUseCoSkill: {
                    skillType               : CoSkillsConstants.SkillTypeId.SuperPower,
                    targetGridIndexArray    : BotsUtils.getCoPowerSkillTargetGridIndexArray(commonParams, player, CoSkillsConstants.SkillTypeId.SuperPower)?.map(v => v.toProto().toJson()) ?? [],
                },
            });

        } else if (player.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.Power)) {
            if (player.getCoCurrentEnergy() > HelpersMisc.getExisted(player.getCoPowerEnergy(), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetActionForPhase1_01) * 1.1) {
                return null;
            }

            const unitTypeSetForCoSkillSetUnitIdle = BotsUtils.getUnitTypeSetForCoSkillSetUnitIdle(player, CoSkillsConstants.SkillTypeId.Power, gameConfig);
            if (unitTypeSetForCoSkillSetUnitIdle.size > 0) {
                const targetUnits = war.getUnitMap().getAllUnitsOnMap(v => (v.getPlayerIndex() === playerIndexInTurn) && (unitTypeSetForCoSkillSetUnitIdle.has(v.getUnitType())));
                if ((!targetUnits.length)                                                                               ||
                    (targetUnits.some(v => (v.getActionState() === UnitsConstants.ActionStateId.Idle) && (v.checkCanAiDoAction())))
                ) {
                    return null;
                }

            } else {
                if (idleUnitsCount < allUnitsCount * 0.85) {
                    return null;
                }
            }

            return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
                WoPlayerUseCoSkill: {
                    skillType               : CoSkillsConstants.SkillTypeId.Power,
                    targetGridIndexArray    : BotsUtils.getCoPowerSkillTargetGridIndexArray(commonParams, player, CoSkillsConstants.SkillTypeId.Power)?.map(v => v.toProto().toJson()) ?? [],
                },
            });

        } else {
            return null;
        }
    }

    if (coEnergyType === CosConstants.EnergyTypeId.Dor) {
        for (const unit of await getCandidateUnitsForPhase1(commonParams)) {
            const action = (await BotsUtils.getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
            if (action) {
                return action;
            }
        }

        return null;
    }

    return null;
}

async function getCandidateUnitsForPhase1(commonParams: BotsCommonParams.CommonParams): Promise<IBwUnit[]> {
    await TimerTimerModel.checkAndCallLater();

    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const unitMap           = commonParams.getWar().getUnitMap();
    const units             : IBwUnit[] = [];
    for (const unit of unitMap.getAllUnitsOnMap()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)                                                       &&
            (unit.getActionState() === UnitsConstants.ActionStateId.Idle)                                                    &&
            (unit.checkCanAiDoAction())                                                                         &&
            ((unit.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.Power) || (unit.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.SuperPower))))
        ) {
            units.push(unit);
        }
    }
    for (const unit of unitMap.getAllUnitsLoaded()) {
        if ((unit.getPlayerIndex() === playerIndexInTurn)                                                       &&
            (unit.getActionState() === UnitsConstants.ActionStateId.Idle)                                                    &&
            (unit.checkCanAiDoAction())                                                                         &&
            ((unit.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.Power) || (unit.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.SuperPower))))
        ) {
            const loaderUnit = unit.getLoaderUnit();
            if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
                (loaderUnit.getActionState() === UnitsConstants.ActionStateId.Idle)          &&
                (loaderUnit.checkCanAiDoAction())                               &&
                (loaderUnit.checkCanLaunchLoadedUnit())                         &&
                (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
            ) {
                units.push(unit);
            }
        }
    }

    return units.sort(BotsUtils.candidateUnitSorter).slice(0, 10);
}
