import {
    Units_Constants,
    Timer_TimerModel,
    Utils_ClientErrorCode,
    Bots_Utils,
    Helpers_Misc,
    CoSkills_Constants,
    type Bots_CommonParams,
    type Units_IUnit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitUseCoSkill(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

    const war               = commonParams.getWar();
    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    const unitsInfo         = Helpers_Misc.getExisted(commonParams.getUnitsInfoDict().get(playerIndexInTurn), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreAndActionUnitUseCoSkill_00);
    const player            = war.getPlayer(playerIndexInTurn);
    const idleUnitsCount    = unitsInfo.idleCountOnMap;
    const allUnitsCount     = unitsInfo.allCountOnMap;
    const gameConfig        = war.getGcData();

    if (unit.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.SuperPower)) {
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

        return {
            score   : await getScoreForActionUnitUseCoSkill(),
            action  : WoContainer.fromJson({ WoUnitUseCoSkill: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId            : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                skillType               : CoSkills_Constants.SkillTypeId.SuperPower,
                targetGridIndexArray    : Bots_Utils.getCoPowerSkillTargetGridIndexArray(commonParams, player, CoSkills_Constants.SkillTypeId.SuperPower)?.map(v => v.toProto().toJson()) ?? [],
            } }),
        };
    }

    if (unit.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.Power)) {
        if (player.getCoCurrentEnergy() > Helpers_Misc.getExisted(player.getCoPowerEnergy(), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreAndActionUnitUseCoSkill_01) * 1.1) {
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

        return {
            score   : await getScoreForActionUnitUseCoSkill(),
            action  : WoContainer.fromJson({ WoUnitUseCoSkill: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId            : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                skillType               : CoSkills_Constants.SkillTypeId.Power,
                targetGridIndexArray    : Bots_Utils.getCoPowerSkillTargetGridIndexArray(commonParams, player, CoSkills_Constants.SkillTypeId.Power)?.map(v => v.toProto().toJson()) ?? [],
            } }),
        };
    }

    return null;
}

async function getScoreForActionUnitUseCoSkill(): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

    return 999999999;
}
