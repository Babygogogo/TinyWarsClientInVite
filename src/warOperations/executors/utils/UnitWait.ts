import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_ThingsForMovePath,
    CoSkills_Utils_InstantMisc_SelfUnitHpAfterWait,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Units_Constants,
    Units_Unit,
    Utils_ClientErrorCode,
    WarOperations_Executors_Utils_Common,
    type AuxiliaryTypes_MovePath,
    type BaseWar_Model_War,
    type WarOperations_Executors_Types,
} from "../../../internal.ts";

import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitWait } from "../../../proto/schema/CommonProto/WarOperation/WoUnitWait.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitWait, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitWait(war, action);
    } else {
        await normalExeUnitWait(war, action);
    }
}

function fastExeUnitWait(war: BaseWar_Model_War.War, action: WoUnitWait): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitWait_00),
            isFastExecute   : true,
        });
    } else {
        const unitMap       = war.getUnitMap();
        const path          = Helpers_Misc.getExisted(action.getPath());
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        handleSelfUnitHpAfterWait(focusUnit, true);
        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}
async function normalExeUnitWait(war: BaseWar_Model_War.War, action: WoUnitWait): Promise<void> {
    // const desc = await war.getDescForExeUnitWait(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitWait_00);
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const unitMap       = war.getUnitMap();
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitWait_01);
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

        handleSelfUnitHpAfterWait(focusUnit, false);
        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitWait, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                               = war.getUnitMap();
    const pathNodes                             = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                          = revisedPath.getLaunchUnitId();
    const focusUnit                             = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const focusUnitDataBeforeAction             = focusUnit.serialize();
    const allTileAppearanceInfosBeforeAction    = war.getTileMap().generateAllTileAppearanceInfos();
    const visibilityArrayFromPathsBeforeAction  = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction  = war.getVisibleThingsForEachTeam();
    const unitGridIdsForEachTeamBeforeAction    = unitMap.getUnitGridIdArrayForEachTeam();
    const changedThings                         = war.moveUnit({
        pathNodes       : pathNodes,
        launchUnitId    : launchUnitId,
        fuelConsumption : revisedPath.getFuelConsumption(),
    });
    unitMap.setUnitOnMap(focusUnit);
    focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
    changedThings.mergeFrom(handleSelfUnitHpAfterWait(focusUnit, true));
    changedThings.mergeFrom(WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true));

    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
        changedThings                        : changedThings.mergeFrom(extraChangedThings),
        thingsForMovePath                    : new AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath(
            unitGridIdsForEachTeamBeforeAction,
            focusUnitDataBeforeAction,
            revisedPath,
            undefined,
        ),
        createMessage : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);
            woContainer.createIfNotExistsWoUnitWait().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitWait): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0109)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}

function handleSelfUnitHpAfterWait(focusUnit: Units_Unit.Unit, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war           = focusUnit.getWar();
    const gridIndex     = focusUnit.getGridIndex();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    if (war.getUnitMap().getUnitOnMap(gridIndex) != focusUnit) {
        return changedThings;
    }

    const isCoOnboard               = focusUnit.getIsCoOnboard();
    const focusPlayer               = focusUnit.getPlayer();
    const maxHp                     = focusUnit.getMaxHp();
    const currentHp                 = focusUnit.getCurrentHp();
    const focusCoZoneRadius         = focusPlayer.getCoZoneRadius();
    const gameConfig                = war.getGcData();
    const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() => focusPlayer.getCoGridIndexListOnMap());
    let newHp                       = currentHp;
    for (const skillId of focusPlayer.getCoCurrentSkills()) {
        const skillCfg = gameConfig.getCoSkillCfg(skillId)?.getInstantMisc()?.getSelfUnitHpAfterWait();
        if (skillCfg == null) {
            continue;
        }

        if ((!isCoOnboard) && (!gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType          : skillCfg.getCoSkillAreaTypeId(),
            coZoneRadius             : focusCoZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))) {
            continue;
        }

        newHp += CoSkills_Utils_InstantMisc_SelfUnitHpAfterWait.getTotalOffset({
            cfg        : skillCfg,
            gameConfig : gameConfig,
            maxHp      : maxHp,
            currentHp  : newHp,
        });
    }

    if (newHp != currentHp) {
        focusUnit.setCurrentHp(newHp);
        changedThings.addUnit(focusUnit);

        if (!isFastExecute) {
            focusUnit.flushDataToView();
        }
    }

    return changedThings;
}
