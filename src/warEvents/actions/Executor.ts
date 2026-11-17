import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
    WarEvents_Actions_Utils_AddTileBuffExpr,
    WarEvents_Actions_Utils_AddTileBuffSimple,
    WarEvents_Actions_Utils_AddUnitBuffSimple,
    WarEvents_Actions_Utils_AddUnitOnMapSimple,
    WarEvents_Actions_Utils_BigDialogueSimple,
    WarEvents_Actions_Utils_DeleteTileBuffExpr,
    WarEvents_Actions_Utils_DeleteTileBuffSimple,
    WarEvents_Actions_Utils_DeleteUnitBuffSimple,
    WarEvents_Actions_Utils_DestroyUnitExpr,
    WarEvents_Actions_Utils_DestroyUnitSimple,
    WarEvents_Actions_Utils_FillUnitLoadedExpr,
    WarEvents_Actions_Utils_FillUnitLoadedSimple,
    WarEvents_Actions_Utils_FillUnitOnMapExpr,
    WarEvents_Actions_Utils_FillUnitOnMapSimple,
    WarEvents_Actions_Utils_ModifyTileBuffExpr,
    WarEvents_Actions_Utils_ModifyTileBuffSimple,
    WarEvents_Actions_Utils_ModifyUnitBuffSimple,
    WarEvents_Actions_Utils_PersistentModifyPlayerAttribute,
    WarEvents_Actions_Utils_PersistentModifyUnitAttribute,
    WarEvents_Actions_Utils_PersistentPlayBgm,
    WarEvents_Actions_Utils_PersistentShowText,
    WarEvents_Actions_Utils_PlayBgm,
    WarEvents_Actions_Utils_PlaySfx,
    WarEvents_Actions_Utils_SetCustomBuildingStateExpr,
    WarEvents_Actions_Utils_SetCustomBuildingStateSimple,
    WarEvents_Actions_Utils_SetCustomCannonStateExpr,
    WarEvents_Actions_Utils_SetCustomCannonStateSimple,
    WarEvents_Actions_Utils_SetCustomCounters,
    WarEvents_Actions_Utils_SetCustomCrystalStateExpr,
    WarEvents_Actions_Utils_SetCustomCrystalStateSimple,
    WarEvents_Actions_Utils_SetCustomLaserTurretStateExpr,
    WarEvents_Actions_Utils_SetCustomLaserTurretStateSimple,
    WarEvents_Actions_Utils_SetForceFogCodeExpr,
    WarEvents_Actions_Utils_SetForceFogCodeSimple,
    WarEvents_Actions_Utils_SetPlayerStateExpr,
    WarEvents_Actions_Utils_SetPlayerStateSimple,
    WarEvents_Actions_Utils_SetTaskObjectiveState,
    WarEvents_Actions_Utils_SetTileStateExpr,
    WarEvents_Actions_Utils_SetTileStateSimple,
    WarEvents_Actions_Utils_SetTileTypeExpr,
    WarEvents_Actions_Utils_SetTileTypeSimple,
    WarEvents_Actions_Utils_SetUnitMovePathVisibility,
    WarEvents_Actions_Utils_SetUnitOwnershipExpr,
    WarEvents_Actions_Utils_SetUnitOwnershipSimple,
    WarEvents_Actions_Utils_SetUnitPositionExpr,
    WarEvents_Actions_Utils_SetUnitPositionSimple,
    WarEvents_Actions_Utils_SetUnitStateExpr,
    WarEvents_Actions_Utils_SetUnitStateSimple,
    WarEvents_Actions_Utils_SetUnitTypeExpr,
    WarEvents_Actions_Utils_SetUnitTypeSimple,
    WarEvents_Actions_Utils_SetViewpointExpr,
    WarEvents_Actions_Utils_SetViewpointSimple,
    WarEvents_Actions_Utils_SetWeatherExpr,
    WarEvents_Actions_Utils_SetWeatherSimple,
    WarEvents_Actions_Utils_SmallDialogueSimple,
    WarEvents_Actions_Utils_StopPersistentAction,
    type WarEvents_Manager,
} from "../../internal";

export async function executeAsOuterWar(warEventManager: WarEvents_Manager.Manager, warEventActionId: number, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation | void> {
    const action    = warEventManager.getWarEventAction(warEventActionId);
    const war       = warEventManager.getWar();
    {
        const act = action.getWeaAddUnitOnMapSimple();
        if (act) {
            return WarEvents_Actions_Utils_AddUnitOnMapSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaFillUnitOnMapSimple();
        if (act) {
            return WarEvents_Actions_Utils_FillUnitOnMapSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaFillUnitOnMapExpr();
        if (act) {
            return WarEvents_Actions_Utils_FillUnitOnMapExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaFillUnitLoadedSimple();
        if (act) {
            return WarEvents_Actions_Utils_FillUnitLoadedSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaFillUnitLoadedExpr();
        if (act) {
            return WarEvents_Actions_Utils_FillUnitLoadedExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaDestroyUnitSimple();
        if (act) {
            return WarEvents_Actions_Utils_DestroyUnitSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaDestroyUnitExpr();
        if (act) {
            return WarEvents_Actions_Utils_DestroyUnitExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetUnitTypeSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitTypeSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetUnitTypeExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitTypeExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetUnitOwnershipSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitOwnershipSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetUnitOwnershipExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitOwnershipExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetUnitPositionSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitPositionSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetUnitPositionExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitPositionExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetUnitStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitStateSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetUnitStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitStateExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaAddUnitBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_AddUnitBuffSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaModifyUnitBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_ModifyUnitBuffSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaDeleteUnitBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_DeleteUnitBuffSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaBigDialogueSimple();
        if (act) {
            return WarEvents_Actions_Utils_BigDialogueSimple.executeAsOuterWar(act, isFastExecute, war);
        }
    }
    {
        const act = action.getWeaSetViewpointExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetViewpointExpr.executeAsOuterWar(act, isFastExecute, war);
        }
    }
    {
        const act = action.getWeaSetViewpointSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetViewpointSimple.executeAsOuterWar(act, isFastExecute, war);
        }
    }
    {
        const act = action.getWeaSetWeatherExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetWeatherExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetWeatherSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetWeatherSimple.executeAsOuterWar(act, isFastExecute, war);
        }
    }
    {
        const act = action.getWeaSmallDialogueSimple();
        if (act) {
            return WarEvents_Actions_Utils_SmallDialogueSimple.executeAsOuterWar(act, isFastExecute, war);
        }
    }
    {
        const act = action.getWeaPlayBgm();
        if (act) {
            return WarEvents_Actions_Utils_PlayBgm.executeAsOuterWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaPlaySfx();
        if (act) {
            return WarEvents_Actions_Utils_PlaySfx.executeAsOuterWar(act, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetForceFogCodeExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetForceFogCodeExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetForceFogCodeSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetForceFogCodeSimple.executeAsOuterWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomCounters();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCounters.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaStopPersistentAction();
        if (act) {
            return WarEvents_Actions_Utils_StopPersistentAction.executeAsOuterWar(act, isFastExecute, war);
        }
    }
    {
        const act = action.getWeaSetPlayerStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetPlayerStateExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetPlayerStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetPlayerStateSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetTaskObjectiveState();
        if (act) {
            return WarEvents_Actions_Utils_SetTaskObjectiveState.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetUnitMovePathVisibility();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitMovePathVisibility.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetTileTypeExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetTileTypeExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetTileTypeSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetTileTypeSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetTileStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetTileStateExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetTileStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetTileStateSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetCustomBuildingStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomBuildingStateExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetCustomBuildingStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomBuildingStateSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetCustomCannonStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCannonStateExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetCustomCannonStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCannonStateSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetCustomCrystalStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCrystalStateExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetCustomCrystalStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCrystalStateSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetCustomLaserTurretStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomLaserTurretStateExpr.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaSetCustomLaserTurretStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomLaserTurretStateSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaDeleteTileBuffExpr();
        if (act) {
            return WarEvents_Actions_Utils_DeleteTileBuffExpr.executeAsOuterWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaDeleteTileBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_DeleteTileBuffSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaAddTileBuffExpr();
        if (act) {
            return WarEvents_Actions_Utils_AddTileBuffExpr.executeAsOuterWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaAddTileBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_AddTileBuffSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaModifyTileBuffExpr();
        if (act) {
            return WarEvents_Actions_Utils_ModifyTileBuffExpr.executeAsOuterWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaModifyTileBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_ModifyTileBuffSimple.executeAsOuterWar(act);
        }
    }
    {
        const act = action.getWeaPersistentShowText();
        if (act) {
            return WarEvents_Actions_Utils_PersistentShowText.executeAsOuterWar(act, warEventActionId, war);
        }
    }
    {
        const act = action.getWeaPersistentPlayBgm();
        if (act) {
            return WarEvents_Actions_Utils_PersistentPlayBgm.executeAsOuterWar(act, warEventActionId, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaPersistentModifyPlayerAttribute();
        if (act) {
            return WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.executeAsOuterWar(act, war, warEventActionId);
        }
    }
    {
        const act = action.getWeaPersistentModifyUnitAttribute();
        if (act) {
            return WarEvents_Actions_Utils_PersistentModifyUnitAttribute.executeAsOuterWar(act, war, warEventActionId);
        }
    }

    // todo: add more actions.
    throw Helpers_Misc.newError(`Invalid action.`);
}

export async function executeAsLocalWar(warEventManager: WarEvents_Manager.Manager, warEventActionId: number, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const action    = warEventManager.getWarEventAction(warEventActionId);
    const war       = warEventManager.getWar();
    {
        const act = action.getWeaAddUnitOnMapSimple();
        if (act) {
            return WarEvents_Actions_Utils_AddUnitOnMapSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaFillUnitOnMapSimple();
        if (act) {
            return WarEvents_Actions_Utils_FillUnitOnMapSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaFillUnitOnMapExpr();
        if (act) {
            return WarEvents_Actions_Utils_FillUnitOnMapExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaFillUnitLoadedSimple();
        if (act) {
            return WarEvents_Actions_Utils_FillUnitLoadedSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaFillUnitLoadedExpr();
        if (act) {
            return WarEvents_Actions_Utils_FillUnitLoadedExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaDestroyUnitSimple();
        if (act) {
            return WarEvents_Actions_Utils_DestroyUnitSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaDestroyUnitExpr();
        if (act) {
            return WarEvents_Actions_Utils_DestroyUnitExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetUnitTypeSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitTypeSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetUnitTypeExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitTypeExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetUnitOwnershipSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitOwnershipSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetUnitOwnershipExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitOwnershipExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetUnitPositionSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitPositionSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetUnitPositionExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitPositionExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetUnitStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitStateSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetUnitStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitStateExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaAddUnitBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_AddUnitBuffSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaModifyUnitBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_ModifyUnitBuffSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaDeleteUnitBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_DeleteUnitBuffSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaBigDialogueSimple();
        if (act) {
            return WarEvents_Actions_Utils_BigDialogueSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetViewpointExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetViewpointExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetViewpointSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetViewpointSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetWeatherExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetWeatherExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetWeatherSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetWeatherSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSmallDialogueSimple();
        if (act) {
            return WarEvents_Actions_Utils_SmallDialogueSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaPlayBgm();
        if (act) {
            return WarEvents_Actions_Utils_PlayBgm.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaPlaySfx();
        if (act) {
            return WarEvents_Actions_Utils_PlaySfx.executeAsLocalWar(act, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetForceFogCodeExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetForceFogCodeExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetForceFogCodeSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetForceFogCodeSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomCounters();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCounters.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaStopPersistentAction();
        if (act) {
            return WarEvents_Actions_Utils_StopPersistentAction.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetPlayerStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetPlayerStateExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetPlayerStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetPlayerStateSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetTaskObjectiveState();
        if (act) {
            return WarEvents_Actions_Utils_SetTaskObjectiveState.executeAsLocalWar(act, war);
        }
    }
    {
        const act = action.getWeaSetUnitMovePathVisibility();
        if (act) {
            return WarEvents_Actions_Utils_SetUnitMovePathVisibility.executeAsLocalWar(act, war);
        }
    }
    {
        const act = action.getWeaSetTileTypeExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetTileTypeExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetTileTypeSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetTileTypeSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetTileStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetTileStateExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetTileStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetTileStateSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomBuildingStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomBuildingStateExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomBuildingStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomBuildingStateSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomCannonStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCannonStateExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomCannonStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCannonStateSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomCrystalStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCrystalStateExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomCrystalStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomCrystalStateSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomLaserTurretStateExpr();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomLaserTurretStateExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaSetCustomLaserTurretStateSimple();
        if (act) {
            return WarEvents_Actions_Utils_SetCustomLaserTurretStateSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaDeleteTileBuffExpr();
        if (act) {
            return WarEvents_Actions_Utils_DeleteTileBuffExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaDeleteTileBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_DeleteTileBuffSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaAddTileBuffExpr();
        if (act) {
            return WarEvents_Actions_Utils_AddTileBuffExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaAddTileBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_AddTileBuffSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaModifyTileBuffExpr();
        if (act) {
            return WarEvents_Actions_Utils_ModifyTileBuffExpr.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaModifyTileBuffSimple();
        if (act) {
            return WarEvents_Actions_Utils_ModifyTileBuffSimple.executeAsLocalWar(act, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaPersistentShowText();
        if (act) {
            return WarEvents_Actions_Utils_PersistentShowText.executeAsLocalWar(act, warEventActionId, war);
        }
    }
    {
        const act = action.getWeaPersistentPlayBgm();
        if (act) {
            return WarEvents_Actions_Utils_PersistentPlayBgm.executeAsLocalWar(act, warEventActionId, war, isFastExecute);
        }
    }
    {
        const act = action.getWeaPersistentModifyPlayerAttribute();
        if (act) {
            return WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.executeAsLocalWar(act, war, warEventActionId);
        }
    }
    {
        const act = action.getWeaPersistentModifyUnitAttribute();
        if (act) {
            return WarEvents_Actions_Utils_PersistentModifyUnitAttribute.executeAsLocalWar(act, war, warEventActionId);
        }
    }

    // todo: add more actions.
    throw Helpers_Misc.newError(`Invalid action.`);
}
