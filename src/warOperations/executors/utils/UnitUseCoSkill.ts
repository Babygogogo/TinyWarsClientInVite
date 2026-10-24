import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as CoSkillsConstants from "../../../coSkills/Constants.ts";
import * as CoSkillsUtilsDataGeneratorForUseCoSkill from "../../../coSkills/utils/DataGeneratorForUseCoSkill.ts";
import * as CoSkillsUtilsExecutor from "../../../coSkills/utils/Executor.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersCollection from "../../../helpers/Collection.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitUseCoSkill from "../../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitUseCoSkill       = ProtoSchemaCommonProtoWarOperationWoUnitUseCoSkill.WoUnitUseCoSkill;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitUseCoSkill, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitUseCoSkill(war, action);
    } else {
        await normalExeUnitUseCoSkill(war, action);
    }
}

function fastExeUnitUseCoSkill(war: IBwWar, action: WoUnitUseCoSkill): void {
    const playerInTurn      = war.getPlayerInTurn();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const skillType: AuxiliaryTypesAuxiliaryTypes.Undefinable<CoSkillsConstants.SkillTypeId> = actionExtraData.getSkillType();
        if (skillType != null) {
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            const skillDataArray    = HelpersMisc.getExisted(actionExtraData.getSkillDataArray(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_00);
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                CoSkillsUtilsExecutor.executeInstantSkill({
                    player              : playerInTurn,
                    skillId             : skillIdArray[skillIndex],
                    skillData           : HelpersMisc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_01),
                    targetGridIndexes   : action.getTargetGridIndexArray(),
                    hasExtraData        : true,
                    isFastExecute       : true,
                });
            }
        }

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_02),
            isFastExecute   : true,
        });

    } else {
        const unitMap           = war.getUnitMap();
        const playerManager     = war.getPlayerManager();
        const playerIndexArray  = HelpersCollection.createRange(PlayersConstants.PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
        const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
        const revisedPath       = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const pathNodes         = revisedPath.nodes;
        const launchUnitId      = action.getLaunchUnitId();
        const focusUnit         = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_03);
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        if (!revisedPath.isBlocked) {
            const skillType = HelpersMisc.getExisted(action.getSkillType());
            playerInTurn.updateOnUseCoSkill(skillType);

            const skillIdArray = playerInTurn.getCoCurrentSkills();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                const dataForUseCoSkill = CoSkillsUtilsDataGeneratorForUseCoSkill.generate({
                    war         : war,
                    player      : playerInTurn,
                    skillType   : skillType,
                    skillIndex  : skillIndex,
                });
                CoSkillsUtilsExecutor.executeInstantSkill({
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
                if ((player.getAliveState() != PlayersConstants.AliveStateId.Dead) && (!unitMap.checkHasUnitForPlayer(playerIndex))) {
                    player.setAliveState(PlayersConstants.AliveStateId.Dying);
                }
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitUseCoSkill(war: IBwWar, action: WoUnitUseCoSkill): Promise<void> {
    const unitMap           = war.getUnitMap();
    const gridVisualEffect  = war.getGridVisualEffect();
    const playerInTurn      = war.getPlayerInTurn();
    const playerIndex       = playerInTurn.getPlayerIndex();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        const skillType: AuxiliaryTypesAuxiliaryTypes.Undefinable<CoSkillsConstants.SkillTypeId> = actionExtraData.getSkillType();
        if (skillType != null) {
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            const skillDataArray    = HelpersMisc.getExisted(actionExtraData.getSkillDataArray(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_01);
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                CoSkillsUtilsExecutor.executeInstantSkill({
                    player              : playerInTurn,
                    skillId             : skillIdArray[skillIndex],
                    skillData           : HelpersMisc.getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_02),
                    targetGridIndexes   : action.getTargetGridIndexArray(),
                    hasExtraData        : true,
                    isFastExecute       : false,
                });
            }
        }

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

        if (skillType != null) {
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

    } else {
        const revisedPath       = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const pathNodes         = revisedPath.nodes;
        const launchUnitId      = action.getLaunchUnitId();
        const focusUnit         = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_03);
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : revisedPath.isBlocked,
            aiming              : null,
            updateViewAfterMove : true,
        });

        if (!revisedPath.isBlocked) {
            const playerManager     = war.getPlayerManager();
            const playerIndexArray  = HelpersCollection.createRange(PlayersConstants.PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
            const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
            const skillType         = HelpersMisc.getExisted(action.getSkillType());
            playerInTurn.updateOnUseCoSkill(skillType);

            const skillIdArray = playerInTurn.getCoCurrentSkills();
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

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitUseCoSkill): Promise<string | null> {
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0142)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
