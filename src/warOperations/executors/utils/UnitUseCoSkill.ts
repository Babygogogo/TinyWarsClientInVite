import {
    CoSkills_Utils_Executor,
    CoSkills_Utils_DataGeneratorForUseCoSkill,
    MapEditor_Model_MeWar,
    AuxiliaryTypes_MovePath,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    CoSkills_Constants,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Constants,
    Players_Constants,
    Utils_ClientErrorCode,
    Helpers_Collection,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoUnitUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitUseCoSkill, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitUseCoSkill(war, action);
    } else {
        await normalExeUnitUseCoSkill(war, action);
    }
}

function fastExeUnitUseCoSkill(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitUseCoSkill): void {
    const playerInTurn      = war.getPlayerInTurn();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const skillType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<CoSkills_Constants.SkillTypeId> = actionExtraData.getSkillType();
        if (skillType != null) {
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            const skillDataArray    = actionExtraData.getSkillDataArray();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                CoSkills_Utils_Executor.executeInstantSkill({
                    player              : playerInTurn,
                    skillId             : skillIdArray[skillIndex],
                    skillData           : Helpers_Misc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_01),
                    targetGridIndexes   : action.getTargetGridIndexArray(),
                    hasExtraData        : true,
                    isFastExecute       : true,
                });
            }
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_02),
            isFastExecute   : true,
        });

    } else {
        const unitMap           = war.getUnitMap();
        const playerManager     = war.getPlayerManager();
        const playerIndexArray  = Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
        const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
        const revisedPath       = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const pathNodes         = revisedPath.nodes;
        const launchUnitId      = action.getLaunchUnitId();
        const focusUnit         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_03);
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (!revisedPath.isBlocked) {
            const skillType = Helpers_Misc.getExisted(action.getSkillType());
            playerInTurn.updateOnUseCoSkill(skillType);

            const skillIdArray = playerInTurn.getCoCurrentSkills();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                const dataForUseCoSkill = CoSkills_Utils_DataGeneratorForUseCoSkill.generate({
                    war         : war,
                    player      : playerInTurn,
                    skillType   : skillType,
                    skillIndex  : skillIndex,
                });
                CoSkills_Utils_Executor.executeInstantSkill({
                    player              : playerInTurn,
                    skillId             : skillIdArray[skillIndex],
                    skillData           : dataForUseCoSkill,
                    targetGridIndexes   : action.getTargetGridIndexArray(),
                    hasExtraData        : false,
                    isFastExecute       : true,
                });
            }

            if (playerInTurn.getUserId() == null) {
                const playerIndex = playerInTurn.getPlayerIndex();
                for (const unit of war.getUnitMap().getAllUnits()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.checkAndUpdateAiMode();
                    }
                }
            }

            for (const playerIndex of playerIndexArray) {
                if (!oldHasUnitFlags[playerIndex - 1]) {
                    continue;
                }

                const player = playerManager.getPlayer(playerIndex);
                if ((player.getAliveState() != Players_Constants.AliveStateId.Dead) && (!unitMap.checkHasUnitForPlayer(playerIndex))) {
                    player.setAliveState(Players_Constants.AliveStateId.Dying);
                }
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitUseCoSkill(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitUseCoSkill): Promise<void> {
    const unitMap           = war.getUnitMap();
    const gridVisualEffect  = war.getGridVisualEffect();
    const playerInTurn      = war.getPlayerInTurn();
    const playerIndex       = playerInTurn.getPlayerIndex();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        const skillType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<CoSkills_Constants.SkillTypeId> = actionExtraData.getSkillType();
        if (skillType != null) {
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            const skillDataArray    = actionExtraData.getSkillDataArray();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                CoSkills_Utils_Executor.executeInstantSkill({
                    player              : playerInTurn,
                    skillId             : skillIdArray[skillIndex],
                    skillData           : Helpers_Misc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_02),
                    targetGridIndexes   : action.getTargetGridIndexArray(),
                    hasExtraData        : true,
                    isFastExecute       : false,
                });
            }
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

        if (skillType != null) {
            for (const unit of unitMap.getAllUnitsOnMap()) {
                if (unit.getPlayerIndex() === playerIndex) {
                    unit.updateView();

                    if (skillType === CoSkills_Constants.SkillTypeId.Power) {
                        gridVisualEffect.showEffectCoPowerActivation(unit.getGridIndex());
                    } else {
                        gridVisualEffect.showEffectCoSuperPowerActivation(unit.getGridIndex());
                    }
                }
            }
        }

    } else {
        const revisedPath       = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const pathNodes         = revisedPath.nodes;
        const launchUnitId      = action.getLaunchUnitId();
        const focusUnit         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_03);
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : revisedPath.isBlocked,
            aiming              : null,
            updateViewAfterMove : true,
        });

        if (!revisedPath.isBlocked) {
            const playerManager     = war.getPlayerManager();
            const playerIndexArray  = Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
            const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
            const skillType         = Helpers_Misc.getExisted(action.getSkillType());
            playerInTurn.updateOnUseCoSkill(skillType);

            const skillIdArray = playerInTurn.getCoCurrentSkills();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                CoSkills_Utils_Executor.executeInstantSkill({
                    player              : playerInTurn,
                    skillId             : skillIdArray[skillIndex],
                    skillData           : CoSkills_Utils_DataGeneratorForUseCoSkill.generate({
                        war         : war,
                        player      : playerInTurn,
                        skillType   : skillType,
                        skillIndex  : skillIndex,
                    }),
                    targetGridIndexes   : action.getTargetGridIndexArray(),
                    hasExtraData        : false,
                    isFastExecute       : false,
                });
            }

            if (playerInTurn.getUserId() == null) {
                for (const unit of war.getUnitMap().getAllUnits()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.checkAndUpdateAiMode();
                    }
                }
            }

            for (const i of playerIndexArray) {
                if (!oldHasUnitFlags[i - 1]) {
                    continue;
                }

                const player = playerManager.getPlayer(i);
                if ((player.getAliveState() != Players_Constants.AliveStateId.Dead) && (!unitMap.checkHasUnitForPlayer(i))) {
                    player.setAliveState(Players_Constants.AliveStateId.Dying);
                }
            }

            for (const unit of unitMap.getAllUnitsOnMap()) {
                if (unit.getPlayerIndex() === playerIndex) {
                    unit.updateView();

                    if (skillType === CoSkills_Constants.SkillTypeId.Power) {
                        gridVisualEffect.showEffectCoPowerActivation(unit.getGridIndex());
                    } else {
                        gridVisualEffect.showEffectCoSuperPowerActivation(unit.getGridIndex());
                    }
                }
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitUseCoSkill): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0142)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
