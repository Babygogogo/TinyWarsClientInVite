import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import { getUnitTypeSetForCoSkillSetUnitIdle, getCoPowerSkillTargetGridIndexArray } from "../Utils.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import { ActionStateId } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

type IBwUnit            = IUnit;
type GrScoreAndAction   = ScoreAndAction;

export async function getScoreAndActionUnitUseCoSkill(commonParams: CommonParams, unit: IBwUnit, pathNodes: MovePathNode[]): Promise<GrScoreAndAction | null> {
    await checkAndCallLater();

    const war               = commonParams.getWar();
    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const unitsInfo         = getExisted(commonParams.getUnitsInfoDict().get(playerIndexInTurn), ClientErrorCode.SpwRobot_GetScoreAndActionUnitUseCoSkill_00);
    const player            = war.getPlayer(playerIndexInTurn);
    const idleUnitsCount    = unitsInfo.idleCountOnMap;
    const allUnitsCount     = unitsInfo.allCountOnMap;
    const gameConfig        = war.getGcData();

    if (unit.checkCanUseCoSkill(SkillTypeId.SuperPower)) {
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

        return {
            score   : await getScoreForActionUnitUseCoSkill(),
            action  : WoContainer.fromJson({ WoUnitUseCoSkill: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId            : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                skillType               : SkillTypeId.SuperPower,
                targetGridIndexArray    : getCoPowerSkillTargetGridIndexArray(commonParams, player, SkillTypeId.SuperPower)?.map(v => v.toProto().toJson()) ?? [],
            } }),
        };
    }

    if (unit.checkCanUseCoSkill(SkillTypeId.Power)) {
        if (player.getCoCurrentEnergy() > getExisted(player.getCoPowerEnergy(), ClientErrorCode.SpwRobot_GetScoreAndActionUnitUseCoSkill_01) * 1.1) {
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

        return {
            score   : await getScoreForActionUnitUseCoSkill(),
            action  : WoContainer.fromJson({ WoUnitUseCoSkill: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId            : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                skillType               : SkillTypeId.Power,
                targetGridIndexArray    : getCoPowerSkillTargetGridIndexArray(commonParams, player, SkillTypeId.Power)?.map(v => v.toProto().toJson()) ?? [],
            } }),
        };
    }

    return null;
}

async function getScoreForActionUnitUseCoSkill(): Promise<number> {
    await checkAndCallLater();

    return 999999999;
}
