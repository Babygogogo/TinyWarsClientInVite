import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { SkillTypeId } from "../../../coSkills/Constants.ts";
import { generate } from "../../../coSkills/utils/DataGeneratorForUseCoSkill.ts";
import { executeInstantSkill } from "../../../coSkills/utils/Executor.ts";
import { createRange } from "../../../helpers/Collection.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { PlayerIndex, AliveStateId } from "../../../players/Constants.ts";
import type { WoPlayerUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerUseCoSkill.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData } from "./Common.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoPlayerUseCoSkill, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerUseCoSkill(war, action);
    } else {
        await normalExePlayerUseCoSkill(war, action);
    }
}

function fastExePlayerUseCoSkill(war: IBwWar, action: WoPlayerUseCoSkill): void {
    const playerInTurn      = war.getPlayerInTurn();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const skillType         = getExisted(actionExtraData.getSkillType(), ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_00);
        const skillIdArray      = playerInTurn.getCoSkills(skillType);
        const skillDataArray    = actionExtraData.getSkillDataArray();
        for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
            executeInstantSkill({
                player              : playerInTurn,
                skillId             : skillIdArray[skillIndex],
                skillData           : getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_02),
                targetGridIndexes   : action.getTargetGridIndexArray(),
                hasExtraData        : true,
                isFastExecute       : true,
            });
        }

        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_03),
            isFastExecute   : true,
        });

    } else {
        const unitMap           = war.getUnitMap();
        const playerManager     = war.getPlayerManager();
        const playerIndexArray  = createRange(PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
        const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
        const skillType         = getExisted(action.getSkillType(), ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_04);
        const skillIdArray      = playerInTurn.getCoSkills(skillType);
        playerInTurn.updateOnUseCoSkill(skillType);

        for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
            executeInstantSkill({
                player              : playerInTurn,
                skillId             : skillIdArray[skillIndex],
                skillData           : generate({
                    war         : war,
                    player      : playerInTurn,
                    skillType   : skillType,
                    skillIndex  : skillIndex,
                }),
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
            if ((player.getAliveState() != AliveStateId.Dead) && (!unitMap.checkHasUnitForPlayer(playerIndex))) {
                player.setAliveState(AliveStateId.Dying);
            }
        }
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

function normalExePlayerUseCoSkill(war: IBwWar, action: WoPlayerUseCoSkill): void {
    const gridVisualEffect  = war.getGridVisualEffect();
    const unitMap           = war.getUnitMap();
    const playerInTurn      = war.getPlayerInTurn();
    const actionExtraData   = action.getExtraData();
    const playerIndex       = playerInTurn.getPlayerIndex();
    if (actionExtraData) {
        const skillType         = getExisted(actionExtraData.getSkillType(), ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_00);
        const skillDataArray    = actionExtraData.getSkillDataArray();
        const skillIdArray      = playerInTurn.getCoSkills(skillType);
        for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
            executeInstantSkill({
                player              : playerInTurn,
                skillId             : skillIdArray[skillIndex],
                skillData           : getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_02),
                targetGridIndexes   : action.getTargetGridIndexArray(),
                hasExtraData        : true,
                isFastExecute       : false,
            });
        }

        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_03),
            isFastExecute   : false,
        });

        for (const unit of unitMap.getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                unit.updateView();

                if (skillType === SkillTypeId.Power) {
                    gridVisualEffect.showEffectCoPowerActivation(unit.getGridIndex());
                } else {
                    gridVisualEffect.showEffectCoSuperPowerActivation(unit.getGridIndex());
                }
            }
        }

    } else {
        const playerManager     = war.getPlayerManager();
        const playerIndexArray  = createRange(PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
        const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
        const skillType         = getExisted(action.getSkillType(), ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_04);
        playerInTurn.updateOnUseCoSkill(skillType);

        const skillIdArray = playerInTurn.getCoSkills(skillType);
        for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
            executeInstantSkill({
                player              : playerInTurn,
                skillId             : skillIdArray[skillIndex],
                skillData           : generate({
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
            if ((player.getAliveState() != AliveStateId.Dead) && (!unitMap.checkHasUnitForPlayer(i))) {
                player.setAliveState(AliveStateId.Dying);
            }
        }

        for (const unit of unitMap.getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                unit.updateView();

                if (skillType === SkillTypeId.Power) {
                    gridVisualEffect.showEffectCoPowerActivation(unit.getGridIndex());
                } else {
                    gridVisualEffect.showEffectCoSuperPowerActivation(unit.getGridIndex());
                }
            }
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
