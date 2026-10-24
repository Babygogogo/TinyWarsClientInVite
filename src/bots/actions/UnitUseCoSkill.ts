import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as BotsUtils from "../Utils.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitUseCoSkill(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

    const war               = commonParams.getWar();
    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const unitsInfo         = HelpersMisc.getExisted(commonParams.getUnitsInfoDict().get(playerIndexInTurn), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreAndActionUnitUseCoSkill_00);
    const player            = war.getPlayer(playerIndexInTurn);
    const idleUnitsCount    = unitsInfo.idleCountOnMap;
    const allUnitsCount     = unitsInfo.allCountOnMap;
    const gameConfig        = war.getGcData();

    if (unit.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.SuperPower)) {
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

        return {
            score   : await getScoreForActionUnitUseCoSkill(),
            action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitUseCoSkill: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId            : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                skillType               : CoSkillsConstants.SkillTypeId.SuperPower,
                targetGridIndexArray    : BotsUtils.getCoPowerSkillTargetGridIndexArray(commonParams, player, CoSkillsConstants.SkillTypeId.SuperPower)?.map(v => v.toProto().toJson()) ?? [],
            } }),
        };
    }

    if (unit.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.Power)) {
        if (player.getCoCurrentEnergy() > HelpersMisc.getExisted(player.getCoPowerEnergy(), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreAndActionUnitUseCoSkill_01) * 1.1) {
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

        return {
            score   : await getScoreForActionUnitUseCoSkill(),
            action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitUseCoSkill: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId            : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                skillType               : CoSkillsConstants.SkillTypeId.Power,
                targetGridIndexArray    : BotsUtils.getCoPowerSkillTargetGridIndexArray(commonParams, player, CoSkillsConstants.SkillTypeId.Power)?.map(v => v.toProto().toJson()) ?? [],
            } }),
        };
    }

    return null;
}

async function getScoreForActionUnitUseCoSkill(): Promise<number> {
    await TimerTimerModel.checkAndCallLater();

    return 999999999;
}
