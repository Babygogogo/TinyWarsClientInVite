import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_ThingsForMovePath,
    CoSkills_Constants,
    CoSkills_Utils_DataGeneratorForUseCoSkill,
    CoSkills_Utils_Executor,
    Helpers_Collection,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    Players_Constants,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    WarOperations_Executors_Utils_Common,
    WarOperations_Executors_Types,
    type AuxiliaryTypes_MovePath,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import type { DataForUseCoSkill } from "../../../proto/schema/CommonProto/Structure/DataForUseCoSkill.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

import type { WoUnitUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitUseCoSkill, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitUseCoSkill(war, action);
    } else {
        await normalExeUnitUseCoSkill(war, action);
    }
}

function fastExeUnitUseCoSkill(war: BaseWar_Model_War.War, action: WoUnitUseCoSkill): void {
    const playerInTurn      = war.getPlayerInTurn();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const skillType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<CoSkills_Constants.SkillTypeId> = actionExtraData.getSkillType();
        if (skillType != null) {
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            const skillDataArray    = actionExtraData.getSkillDataArray();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                CoSkills_Utils_Executor.executeInstantSkillWithExtraData({
                    player            : playerInTurn,
                    skillId           : skillIdArray[skillIndex],
                    skillData         : Helpers_Misc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_01),
                    targetGridIndexes : action.getTargetGridIndexArray(),
                    isFastExecute     : true,
                });
            }
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_02),
            isFastExecute   : true,
        });

    } else {
        const unitMap           = war.getUnitMap();
        const playerManager     = war.getPlayerManager();
        const playerIndexArray  = Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
        const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
        const path              = Helpers_Misc.getExisted(action.getPath());
        const pathNodes         = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId      = action.getLaunchUnitId();
        const focusUnit         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_03);
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (!path.getIsBlocked()) {
            const skillType = Helpers_Misc.getExisted(action.getSkillType());
            playerInTurn.updateOnUseCoSkill(skillType);

            const skillIdArray = playerInTurn.getCoCurrentSkills();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                const dataForUseCoSkill = CoSkills_Utils_DataGeneratorForUseCoSkill.generate({
                    war        : war,
                    player     : playerInTurn,
                    skillType  : skillType,
                    skillIndex : skillIndex,
                });
                CoSkills_Utils_Executor.executeInstantSkillWithoutExtraData({
                    player            : playerInTurn,
                    skillId           : skillIdArray[skillIndex],
                    dataForUseCoSkill : dataForUseCoSkill,
                    targetGridIndexes : action.getTargetGridIndexArray(),
                    isFastExecute     : true,
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

async function normalExeUnitUseCoSkill(war: BaseWar_Model_War.War, action: WoUnitUseCoSkill): Promise<void> {
    const unitMap           = war.getUnitMap();
    const gridVisualEffect  = war.getGridVisualEffect();
    const playerInTurn      = war.getPlayerInTurn();
    const playerIndex       = playerInTurn.getPlayerIndex();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_00);
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });

        const skillType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<CoSkills_Constants.SkillTypeId> = actionExtraData.getSkillType();
        if (skillType != null) {
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            const skillDataArray    = actionExtraData.getSkillDataArray();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                CoSkills_Utils_Executor.executeInstantSkillWithExtraData({
                    player            : playerInTurn,
                    skillId           : skillIdArray[skillIndex],
                    skillData         : Helpers_Misc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_02),
                    targetGridIndexes : action.getTargetGridIndexArray(),
                    isFastExecute     : false,
                });
            }
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

        if (skillType != null) {
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

    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_03);
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : path.getIsBlocked(),
            aiming              : null,
            updateViewAfterMove : true,
        });

        if (!path.getIsBlocked()) {
            const playerManager     = war.getPlayerManager();
            const playerIndexArray  = Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
            const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
            const skillType         = Helpers_Misc.getExisted(action.getSkillType());
            playerInTurn.updateOnUseCoSkill(skillType);

            const skillIdArray = playerInTurn.getCoCurrentSkills();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                CoSkills_Utils_Executor.executeInstantSkillWithoutExtraData({
                    player            : playerInTurn,
                    skillId           : skillIdArray[skillIndex],
                    dataForUseCoSkill : CoSkills_Utils_DataGeneratorForUseCoSkill.generate({
                        war        : war,
                        player     : playerInTurn,
                        skillType  : skillType,
                        skillIndex : skillIndex,
                    }),
                    targetGridIndexes : action.getTargetGridIndexArray(),
                    isFastExecute     : false,
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
                    unit.flushDataToView();

                    if (skillType === CoSkills_Constants.SkillTypeId.Power) {
                        gridVisualEffect?.showEffectCoPowerActivation(unit.getGridIndex());
                    } else {
                        gridVisualEffect?.showEffectCoSuperPowerActivation(unit.getGridIndex());
                    }
                }
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitUseCoSkill, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                              = war.getUnitMap();
    const pathNodes                            = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                         = revisedPath.getLaunchUnitId();
    const focusUnit                            = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const focusUnitDataBeforeAction            = focusUnit.serialize();
    const player                              = focusUnit.getPlayer();
    const skillType                           = Helpers_Misc.getExisted(operation.getSkillType());
    const targetGridIndexes                   = operation.getTargetGridIndexArray();
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const unitGridIdsForEachTeamBeforeAction   = unitMap.getUnitGridIdArrayForEachTeam();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();

    if (revisedPath.getIsBlocked()) {
        const changedThings = war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : revisedPath.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        changedThings.mergeFrom(WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true));

        return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
            war                                  : war,
            allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
            visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
            visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
            changedThings                        : changedThings.mergeFrom(extraChangedThings),
            thingsForMovePath                    : new AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath(unitGridIdsForEachTeamBeforeAction, focusUnitDataBeforeAction, revisedPath, undefined),
            createMessage                        : commonExtraData => {
                const woContainer = new WoContainer();
                woContainer.setOperationId(operationId);
                woContainer.createIfNotExistsWoUnitUseCoSkill().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

                return woContainer;
            },
        });

    } else {
        const playerManager    = war.getPlayerManager();
        const playerIndexArray = Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, playerManager.getTotalPlayersCount(false) + 1, 1);
        const oldHasUnitFlags  = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
        const changedThings   = war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : revisedPath.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        player.updateOnUseCoSkill(skillType);
        changedThings.addPlayer(player);

        const skillDataArray: DataForUseCoSkill[] = [];
        const skillIdArray = player.getCoCurrentSkills();
        for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
            const dataForUseCoSkill = CoSkills_Utils_DataGeneratorForUseCoSkill.generate({
                war        : war,
                player     : player,
                skillType  : skillType,
                skillIndex : skillIndex,
            });
            changedThings.mergeFrom(CoSkills_Utils_Executor.executeInstantSkillWithoutExtraData({
                player            : player,
                skillId           : skillIdArray[skillIndex],
                targetGridIndexes : targetGridIndexes,
                dataForUseCoSkill : dataForUseCoSkill,
                isFastExecute     : true,
            }));
            skillDataArray.push(dataForUseCoSkill);
        }

        if (player.getUserId() == null) {
            const playerIndex = player.getPlayerIndex();
            for (const unit of unitMap.getAllUnits()) {
                if (unit.getPlayerIndex() === playerIndex) {
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
            const targetPlayer = playerManager.getPlayer(playerIndex);
            if ((targetPlayer.getAliveState() !== Players_Constants.AliveStateId.Dead) && !unitMap.checkHasUnitForPlayer(playerIndex)) {
                targetPlayer.setAliveState(Players_Constants.AliveStateId.Dying);
                changedThings.addPlayer(targetPlayer);
            }
        }
        changedThings.mergeFrom(WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true));

        return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
            war                                  : war,
            allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
            visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
            visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
            changedThings                        : changedThings.mergeFrom(extraChangedThings),
            thingsForMovePath                    : new AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath(unitGridIdsForEachTeamBeforeAction, focusUnitDataBeforeAction, revisedPath, undefined),
            createMessage                        : commonExtraData => {
                const woContainer = new WoContainer();
                woContainer.setOperationId(operationId);

                const action = woContainer.createIfNotExistsWoUnitUseCoSkill();
                action.setTargetGridIndexArray(targetGridIndexes);

                const extraData = action.createIfNotExistsExtraData();
                extraData.setCommonExtraData(commonExtraData);
                extraData.setSkillType(skillType);
                extraData.setSkillDataArray(skillDataArray);

                return woContainer;
            },
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitUseCoSkill): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0142)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
