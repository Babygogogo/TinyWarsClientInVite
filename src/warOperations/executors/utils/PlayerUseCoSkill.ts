import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    CoSkills_Constants,
    CoSkills_Utils_DataGeneratorForUseCoSkill,
    CoSkills_Utils_Executor,
    Helpers_Collection,
    Helpers_Misc,
    Players_Constants,
    SinglePlayerWars_War,
    Utils_ClientErrorCode,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import type { DataForUseCoSkill } from "../../../proto/schema/CommonProto/Structure/DataForUseCoSkill.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerUseCoSkill.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsOuterWar(war: BaseWar_Model_War.War, action: WoPlayerUseCoSkill, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExecuteAsOuterWar(war, action);
    } else {
        await normalExecuteAsOuterWar(war, action);
    }
}

function fastExecuteAsOuterWar(war: BaseWar_Model_War.War, action: WoPlayerUseCoSkill): void {
    const playerInTurn      = war.getPlayerInTurn();
    const actionExtraData   = Helpers_Misc.getExisted(action.getExtraData());
    const skillType         = Helpers_Misc.getExisted(actionExtraData.getSkillType(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_00);
    const skillIdArray      = playerInTurn.getCoSkills(skillType);
    const skillDataArray    = actionExtraData.getSkillDataArray();
    for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
        CoSkills_Utils_Executor.executeInstantSkillAsOuterWar({
            player            : playerInTurn,
            skillId           : skillIdArray[skillIndex],
            skillData         : Helpers_Misc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_02),
            targetGridIndexes : action.getTargetGridIndexArray(),
            isFastExecute     : true,
        });
    }

    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : war,
        commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_03),
        isFastExecute   : true,
    });

    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

function normalExecuteAsOuterWar(war: BaseWar_Model_War.War, action: WoPlayerUseCoSkill): void {
    const gridVisualEffect  = war.getGridVisualEffect();
    const unitMap           = war.getUnitMap();
    const playerInTurn      = war.getPlayerInTurn();
    const actionExtraData   = Helpers_Misc.getExisted(action.getExtraData());
    const playerIndex       = playerInTurn.getPlayerIndex();
    const skillType         = Helpers_Misc.getExisted(actionExtraData.getSkillType(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_00);
    const skillDataArray    = actionExtraData.getSkillDataArray();
    const skillIdArray      = playerInTurn.getCoSkills(skillType);
    for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
        CoSkills_Utils_Executor.executeInstantSkillAsOuterWar({
            player            : playerInTurn,
            skillId           : skillIdArray[skillIndex],
            skillData         : Helpers_Misc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_02),
            targetGridIndexes : action.getTargetGridIndexArray(),
            isFastExecute     : false,
        });
    }

    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : war,
        commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_03),
        isFastExecute   : false,
    });

    for (const unit of unitMap.getAllUnitsOnMap()) {
        if (unit.getPlayerIndex() === playerIndex) {
            unit.flushDataToView();

            if (skillType === CoSkills_Constants.SkillTypeId.Power) {
                gridVisualEffect?.showEffectCoPowerActivation(unit.getGridIndex());
            } else {
                gridVisualEffect?.showEffectCoSuperPowerActivation(unit.getGridIndex());
            }
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoPlayerUseCoSkill): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                               = war.getUnitMap();
    const playerManager                         = war.getPlayerManager();
    const playerIndexArray                      = Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, playerManager.getTotalPlayersCount(false) + 1, 1);
    const oldHasUnitFlags                       = playerIndexArray.map(unitMap.checkHasUnitForPlayer);
    const allTileAppearanceInfosBeforeAction    = war.getTileMap().generateAllTileAppearanceInfos();
    const playerInTurn                          = war.getPlayerInTurn();
    const visibleThingsForEachTeamBeforeAction  = war.getVisibleThingsForEachTeam();
    const skillType                             = Helpers_Misc.getExisted(operation.getSkillType());
    const targetGridIndexes                     = operation.getTargetGridIndexArray();
    const changedThings                         = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    playerInTurn.updateOnUseCoSkill(skillType, false);
    changedThings.addPlayer(playerInTurn);

    const skillDataArray : DataForUseCoSkill[] = [];
    const skillIdList    = playerInTurn.getCoCurrentSkills();
    for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
        const dataForUseCoSkill = CoSkills_Utils_DataGeneratorForUseCoSkill.generate({
            war        : war,
            player     : playerInTurn,
            skillType  : skillType,
            skillIndex : skillIndex,
        });
        changedThings.mergeFrom(CoSkills_Utils_Executor.executeInstantSkillAsInnerWar({
            player            : playerInTurn,
            targetGridIndexes : targetGridIndexes,
            skillId           : skillIdList[skillIndex],
            dataForUseCoSkill : dataForUseCoSkill,
        }));
        skillDataArray.push(dataForUseCoSkill);
    }

    if (playerInTurn.getUserId() == null) {
        const playerIndex = playerInTurn.getPlayerIndex();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if (unit.getPlayerIndex() == playerIndex) {
                if (unit.checkAndUpdateAiMode()) {
                    changedThings.addUnit(unit);
                }
            }
        }
    }

    for (const playerIndex of playerIndexArray) {
        if (!oldHasUnitFlags[playerIndex - 1]) {
            continue;
        }

        const player = playerManager.getPlayer(playerIndex);
        if ((player.getAliveState() != Players_Constants.AliveStateId.Dead) &&
            (!unitMap.checkHasUnitForPlayer(playerIndex))
        ) {
            player.setAliveState(Players_Constants.AliveStateId.Dying);
            changedThings.addPlayer(player);
        }
    }

    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : undefined,
        changedThings                        : changedThings.mergeFrom(extraChangedThings),
        thingsForMovePath                    : undefined,
        createMessage                        : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);

            const actionData = woContainer.createIfNotExistsWoPlayerUseCoSkill();
            actionData.setTargetGridIndexArray(targetGridIndexes);

            const extraData = actionData.createIfNotExistsExtraData();
            extraData.setCommonExtraData(commonExtraData);
            extraData.setSkillType(skillType);
            extraData.setSkillDataArray(skillDataArray);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoPlayerUseCoSkill, isFast: boolean): Promise<void> {
    const gridVisualEffect  = isFast ? undefined : war.getGridVisualEffect();
    const unitMap           = war.getUnitMap();
    const playerInTurn      = war.getPlayerInTurn();
    const playerIndex       = playerInTurn.getPlayerIndex();
    const playerManager     = war.getPlayerManager();
    const playerIndexArray  = Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
    const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
    const skillType         = Helpers_Misc.getExisted(action.getSkillType(), isFast ? Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerUseCoSkill_04 : Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerUseCoSkill_04);
    const skillIdArrayBeforeActivation = isFast ? playerInTurn.getCoSkills(skillType) : undefined;
    playerInTurn.updateOnUseCoSkill(skillType, !isFast);

    const skillIdArray = skillIdArrayBeforeActivation ?? playerInTurn.getCoSkills(skillType);
    for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
        CoSkills_Utils_Executor.executeInstantSkillAsUnifiedWar({
            player            : playerInTurn,
            skillId           : skillIdArray[skillIndex],
            dataForUseCoSkill : CoSkills_Utils_DataGeneratorForUseCoSkill.generate({
                war        : war,
                player     : playerInTurn,
                skillType  : skillType,
                skillIndex : skillIndex,
            }),
            targetGridIndexes : action.getTargetGridIndexArray(),
            isFastExecute     : isFast,
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

    if (!isFast) {
        for (const unit of unitMap.getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                unit.flushDataToView();

                if (skillType === CoSkills_Constants.SkillTypeId.Power) {
                    gridVisualEffect?.showEffectCoPowerActivation(unit.getGridIndex());
                } else {
                    gridVisualEffect?.showEffectCoSuperPowerActivation(unit.getGridIndex());
                }
            }
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(isFast);
}
