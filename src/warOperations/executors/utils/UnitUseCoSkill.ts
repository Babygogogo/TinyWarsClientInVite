import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { SkillTypeId } from "../../../coSkills/Constants.ts";
import { generate } from "../../../coSkills/utils/DataGeneratorForUseCoSkill.ts";
import { executeInstantSkill } from "../../../coSkills/utils/Executor.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { createRange } from "../../../helpers/Collection.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import { PlayerIndex, AliveStateId } from "../../../players/Constants.ts";
import type { WoUnitUseCoSkill } from "../../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

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
        const skillType: Undefinable<SkillTypeId> = actionExtraData.getSkillType();
        if (skillType != null) {
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            const skillDataArray    = getExisted(actionExtraData.getSkillDataArray(), ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_00);
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                executeInstantSkill({
                    player              : playerInTurn,
                    skillId             : skillIdArray[skillIndex],
                    skillData           : getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_01),
                    targetGridIndexes   : action.getTargetGridIndexArray(),
                    hasExtraData        : true,
                    isFastExecute       : true,
                });
            }
        }

        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_02),
            isFastExecute   : true,
        });

    } else {
        const unitMap           = war.getUnitMap();
        const playerManager     = war.getPlayerManager();
        const playerIndexArray  = createRange(PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
        const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
        const revisedPath       = MovePath.create(getExisted(action.getPath()));
        const pathNodes         = revisedPath.nodes;
        const launchUnitId      = action.getLaunchUnitId();
        const focusUnit         = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), ClientErrorCode.WarOperationExecutor_FastExeUnitUseCoSkill_03);
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        if (!revisedPath.isBlocked) {
            const skillType = getExisted(action.getSkillType());
            playerInTurn.updateOnUseCoSkill(skillType);

            const skillIdArray = playerInTurn.getCoCurrentSkills();
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                const dataForUseCoSkill = generate({
                    war         : war,
                    player      : playerInTurn,
                    skillType   : skillType,
                    skillIndex  : skillIndex,
                });
                executeInstantSkill({
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
                if ((player.getAliveState() != AliveStateId.Dead) && (!unitMap.checkHasUnitForPlayer(playerIndex))) {
                    player.setAliveState(AliveStateId.Dying);
                }
            }
        }

        handlePostOperationPlunder(focusUnit, true);
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
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        const skillType: Undefinable<SkillTypeId> = actionExtraData.getSkillType();
        if (skillType != null) {
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            const skillDataArray    = getExisted(actionExtraData.getSkillDataArray(), ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_01);
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                executeInstantSkill({
                    player              : playerInTurn,
                    skillId             : skillIdArray[skillIndex],
                    skillData           : getExisted(skillDataArray.find(v => v.getSkillIndex() === skillIndex), ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_02),
                    targetGridIndexes   : action.getTargetGridIndexArray(),
                    hasExtraData        : true,
                    isFastExecute       : false,
                });
            }
        }

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

        if (skillType != null) {
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

    } else {
        const revisedPath       = MovePath.create(getExisted(action.getPath()));
        const pathNodes         = revisedPath.nodes;
        const launchUnitId      = action.getLaunchUnitId();
        const focusUnit         = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), ClientErrorCode.WarOperationExecutor_NormalExeUnitUseCoSkill_03);
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : revisedPath.isBlocked,
            aiming              : null,
            updateViewAfterMove : true,
        });

        if (!revisedPath.isBlocked) {
            const playerManager     = war.getPlayerManager();
            const playerIndexArray  = createRange(PlayerIndex.First, playerManager.getTotalPlayersCount(true), 1);
            const oldHasUnitFlags   = playerIndexArray.map(v => unitMap.checkHasUnitForPlayer(v));
            const skillType         = getExisted(action.getSkillType());
            playerInTurn.updateOnUseCoSkill(skillType);

            const skillIdArray = playerInTurn.getCoCurrentSkills();
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

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitUseCoSkill): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${getText(TextType.B0142)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
