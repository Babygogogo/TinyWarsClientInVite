import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as CoSkillsConstants from "../../../coSkills/Constants.ts";
import * as CoSkillsUtilsDataGeneratorForUseCoSkill from "../../../coSkills/utils/DataGeneratorForUseCoSkill.ts";
import * as CoSkillsUtilsExecutor from "../../../coSkills/utils/Executor.ts";
import * as HelpersCollection from "../../../helpers/Collection.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerUseCoSkill from "../../../proto/schema/CommonProto/WarOperation/WoPlayerUseCoSkill.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoPlayerUseCoSkill     = ProtoSchemaCommonProtoWarOperationWoPlayerUseCoSkill.WoPlayerUseCoSkill;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

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
        const skillType         = HelpersMisc.getExisted(actionExtraData.getSkillType(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_00);
        const skillIdArray      = playerInTurn.getCoSkills(skillType);
        const skillDataArray    = HelpersMisc.getExisted(actionExtraData.getSkillDataArray(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_01);
        for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
            CoSkillsUtilsExecutor.executeInstantSkill({
                player              : playerInTurn,
                skillId             : skillIdArray[skillIndex],
                skillData           : HelpersMisc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_02),
                targetGridIndexes   : action.getTargetGridIndexArray(),
                hasExtraData        : true,
                isFastExecute       : true,
            });
        }

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_03),
            isFastExecute   : true,
        });

    } else {
        const unitMap           = war.getUnitMap();
        const playerManager     = war.getPlayerManager();
        const playerIndexArray  = HelpersCollection.createRange(PlayersConstants.PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
        const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
        const skillType         = HelpersMisc.getExisted(action.getSkillType(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_04);
        const skillIdArray      = playerInTurn.getCoSkills(skillType);
        playerInTurn.updateOnUseCoSkill(skillType);

        for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
            CoSkillsUtilsExecutor.executeInstantSkill({
                player              : playerInTurn,
                skillId             : skillIdArray[skillIndex],
                skillData           : CoSkillsUtilsDataGeneratorForUseCoSkill.generate({
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
            if ((player.getAliveState() != PlayersConstants.AliveStateId.Dead) && (!unitMap.checkHasUnitForPlayer(playerIndex))) {
                player.setAliveState(PlayersConstants.AliveStateId.Dying);
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
        const skillType         = HelpersMisc.getExisted(actionExtraData.getSkillType(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_00);
        const skillDataArray    = HelpersMisc.getExisted(actionExtraData.getSkillDataArray(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_01);
        const skillIdArray      = playerInTurn.getCoSkills(skillType);
        for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
            CoSkillsUtilsExecutor.executeInstantSkill({
                player              : playerInTurn,
                skillId             : skillIdArray[skillIndex],
                skillData           : HelpersMisc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_02),
                targetGridIndexes   : action.getTargetGridIndexArray(),
                hasExtraData        : true,
                isFastExecute       : false,
            });
        }

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_03),
            isFastExecute   : false,
        });

        for (const unit of unitMap.getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                unit.updateView();

                if (skillType === CoSkillsConstants.SkillTypeId.Power) {
                    gridVisualEffect.showEffectCoPowerActivation(unit.getGridIndex());
                } else {
                    gridVisualEffect.showEffectCoSuperPowerActivation(unit.getGridIndex());
                }
            }
        }

    } else {
        const playerManager     = war.getPlayerManager();
        const playerIndexArray  = HelpersCollection.createRange(PlayersConstants.PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
        const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
        const skillType         = HelpersMisc.getExisted(action.getSkillType(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_04);
        playerInTurn.updateOnUseCoSkill(skillType);

        const skillIdArray = playerInTurn.getCoSkills(skillType);
        for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
            CoSkillsUtilsExecutor.executeInstantSkill({
                player              : playerInTurn,
                skillId             : skillIdArray[skillIndex],
                skillData           : CoSkillsUtilsDataGeneratorForUseCoSkill.generate({
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
            if ((player.getAliveState() != PlayersConstants.AliveStateId.Dead) && (!unitMap.checkHasUnitForPlayer(i))) {
                player.setAliveState(PlayersConstants.AliveStateId.Dying);
            }
        }

        for (const unit of unitMap.getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                unit.updateView();

                if (skillType === CoSkillsConstants.SkillTypeId.Power) {
                    gridVisualEffect.showEffectCoPowerActivation(unit.getGridIndex());
                } else {
                    gridVisualEffect.showEffectCoSuperPowerActivation(unit.getGridIndex());
                }
            }
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
