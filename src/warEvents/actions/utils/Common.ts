import {
    WarEvents_Actions_Constants_Common,
    Sounds_Constants,
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
    Lang_Utils,
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
    Utils_ClientErrorCode,
    GamePanels_Manager,
    Units_Utils_Serialization,
    WarEvents_Constants,
    FogMaps_Constants,
    GamePanels_Dict,
    WarEvents_FullDatas_Utils,
    Helpers_Misc,
    Players_Constants,
    Dialogues_Constants,
    Lang_Constants,
    TileBuffs_Constants,
    UnitBuffs_Constants,
    Units_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type MapEditor_Interface_IMeWar,
    type AuxiliaryTypes_MapSize,
} from "../../../internal.ts";
import { WarEventAction } from "../../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { WeaAddTileBuffExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffExpr.ts";
import { WeaAddTileBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffSimple.ts";
import { WeaAddUnitBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitBuffSimple.ts";
import { WeaAddUnitOnMapSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple.ts";
import { WeaBigDialogueSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";
import { WeaDeleteTileBuffExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffExpr.ts";
import { WeaDeleteTileBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffSimple.ts";
import { WeaDeleteUnitBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteUnitBuffSimple.ts";
import { WeaDestroyUnitExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitExpr.ts";
import { WeaDestroyUnitSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitSimple.ts";
import { WeaFillUnitLoadedExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedExpr.ts";
import { WeaFillUnitLoadedSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedSimple.ts";
import { WeaFillUnitOnMapExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapExpr.ts";
import { WeaFillUnitOnMapSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapSimple.ts";
import { WeaModifyTileBuffExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffExpr.ts";
import { WeaModifyTileBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffSimple.ts";
import { WeaModifyUnitBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaModifyUnitBuffSimple.ts";
import { WeaPersistentModifyPlayerAttribute } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyPlayerAttribute.ts";
import { WeaPersistentModifyUnitAttribute } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyUnitAttribute.ts";
import { WeaPersistentPlayBgm } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentPlayBgm.ts";
import { WeaPersistentShowText } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentShowText.ts";
import { WeaPlayBgm } from "../../../proto/schema/CommonProto/WarEvent/WeaPlayBgm.ts";
import { WeaPlaySfx } from "../../../proto/schema/CommonProto/WarEvent/WeaPlaySfx.ts";
import { WeaSetCustomBuildingStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateExpr.ts";
import { WeaSetCustomBuildingStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateSimple.ts";
import { WeaSetCustomCannonStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateExpr.ts";
import { WeaSetCustomCannonStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateSimple.ts";
import { WeaSetCustomCounters } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCounters.ts";
import { WeaSetCustomCrystalStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateExpr.ts";
import { WeaSetCustomCrystalStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateSimple.ts";
import { WeaSetCustomLaserTurretStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomLaserTurretStateExpr.ts";
import { WeaSetCustomLaserTurretStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomLaserTurretStateSimple.ts";
import { WeaSetForceFogCodeExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeExpr.ts";
import { WeaSetForceFogCodeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeSimple.ts";
import { WeaSetPlayerStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateExpr.ts";
import { WeaSetPlayerStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateSimple.ts";
import { WeaSetTaskObjectiveState } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTaskObjectiveState.ts";
import { WeaSetTileStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateExpr.ts";
import { WeaSetTileStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateSimple.ts";
import { WeaSetTileTypeExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeExpr.ts";
import { WeaSetTileTypeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeSimple.ts";
import { WeaSetUnitMovePathVisibility } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitMovePathVisibility.ts";
import { WeaSetUnitOwnershipExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipExpr.ts";
import { WeaSetUnitOwnershipSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipSimple.ts";
import { WeaSetUnitPositionExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionExpr.ts";
import { WeaSetUnitPositionSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionSimple.ts";
import { WeaSetUnitStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateExpr.ts";
import { WeaSetUnitStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateSimple.ts";
import { WeaSetUnitTypeExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeExpr.ts";
import { WeaSetUnitTypeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeSimple.ts";
import { WeaSetViewpointExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetViewpointExpr.ts";
import { WeaSetViewpointSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetViewpointSimple.ts";
import { WeaSetWeatherExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherExpr.ts";
import { WeaSetWeatherSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherSimple.ts";
import { WeaSmallDialogueSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple.ts";
import { DataForDialogue } from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForDialogue.ts";
import { WeaStopPersistentAction } from "../../../proto/schema/CommonProto/WarEvent/WeaStopPersistentAction.ts";

export function checkIsValidWarEventActionId(actionId: number): boolean {
    return (actionId > 0) && (actionId <= WarEvents_Actions_Constants_Common.MaxCounts.PerMap);
}
export function checkIsValidWarEventActionIdSubset(actionIdArray: number[]): boolean {
    return (actionIdArray.length <= WarEvents_Actions_Constants_Common.MaxCounts.PerMap)
        && (actionIdArray.length === new Set(actionIdArray).size)
        && (actionIdArray.every(v => checkIsValidWarEventActionId(v)));
}

export function checkIsValidBuffEndTimeModificationMode(mode: number): boolean {
    return WarEvents_Actions_Constants_Common.AllBuffEndTimeModificationModeArray.includes(mode);
}

export function checkIsValidWarEventAction({ action, mapSize, gameConfig, playersCountUnneutral, customCounterNameSet }: {    // DONE
    action                  : WarEventAction;
    mapSize                 : AuxiliaryTypes_MapSize.MapSize;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral   : number;
    customCounterNameSet    : Set<string>;
}): boolean {
    // if (Object.keys(action.toJson()).length !== 2) {
    //     return false;
    // }

    const weaCommonData = action.getWeaCommonData();
    const actionId      = weaCommonData?.getActionId();
    if ((actionId == null) || (!checkIsValidWarEventActionId(actionId))) {
        return false;
    }
    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list            : weaCommonData?.getActionNameArray() ?? [],
        maxTextLength   : WarEvents_Constants.Event.MaxNameLength,
        minTextLength   : 1,
        minTextCount    : 0,
    })) {
        return false;
    }

    // todo: add more checkers when the action types grow.
    return (WarEvents_Actions_Utils_AddUnitOnMapSimple.checkIsValid({ action: action.getWeaAddUnitOnMapSimple(), gameConfig, mapSize, playersCountUnneutral }))
        || (WarEvents_Actions_Utils_FillUnitOnMapExpr.checkIsValid(action.getWeaFillUnitOnMapExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_FillUnitOnMapSimple.checkIsValid(action.getWeaFillUnitOnMapSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_FillUnitLoadedSimple.checkIsValid(action.getWeaFillUnitLoadedSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_FillUnitLoadedExpr.checkIsValid(action.getWeaFillUnitLoadedExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_DestroyUnitSimple.checkIsValid(action.getWeaDestroyUnitSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_DestroyUnitExpr.checkIsValid(action.getWeaDestroyUnitExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetUnitTypeSimple.checkIsValid(action.getWeaSetUnitTypeSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetUnitTypeExpr.checkIsValid(action.getWeaSetUnitTypeExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetUnitOwnershipSimple.checkIsValid(action.getWeaSetUnitOwnershipSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetUnitOwnershipExpr.checkIsValid(action.getWeaSetUnitOwnershipExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetUnitPositionSimple.checkIsValid(action.getWeaSetUnitPositionSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetUnitPositionExpr.checkIsValid(action.getWeaSetUnitPositionExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetUnitStateSimple.checkIsValid(action.getWeaSetUnitStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetUnitStateExpr.checkIsValid(action.getWeaSetUnitStateExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_AddUnitBuffSimple.checkIsValid(action.getWeaAddUnitBuffSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_ModifyUnitBuffSimple.checkIsValid(action.getWeaModifyUnitBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEvents_Actions_Utils_DeleteUnitBuffSimple.checkIsValid(action.getWeaDeleteUnitBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEvents_Actions_Utils_SetViewpointExpr.checkIsValid(action.getWeaSetViewpointExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetViewpointSimple.checkIsValid(action.getWeaSetViewpointSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetWeatherExpr.checkIsValid(action.getWeaSetWeatherExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetWeatherSimple.checkIsValid(action.getWeaSetWeatherSimple(), gameConfig))
        || (WarEvents_Actions_Utils_BigDialogueSimple.checkIsValid(action.getWeaBigDialogueSimple(), playersCountUnneutral, gameConfig))
        || (WarEvents_Actions_Utils_SmallDialogueSimple.checkIsValid(action.getWeaSmallDialogueSimple(), playersCountUnneutral, gameConfig))
        || (WarEvents_Actions_Utils_PlayBgm.checkIsValid(action.getWeaPlayBgm(), gameConfig))
        || (WarEvents_Actions_Utils_PlaySfx.checkIsValid(action.getWeaPlaySfx()))
        || (WarEvents_Actions_Utils_SetForceFogCodeExpr.checkIsValid(action.getWeaSetForceFogCodeExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetForceFogCodeSimple.checkIsValid(action.getWeaSetForceFogCodeSimple()))
        || (WarEvents_Actions_Utils_SetCustomCounters.checkIsValid(action.getWeaSetCustomCounters(), customCounterNameSet))
        || (WarEvents_Actions_Utils_StopPersistentAction.checkIsValid(action.getWeaStopPersistentAction()))
        || (WarEvents_Actions_Utils_SetPlayerStateExpr.checkIsValid(action.getWeaSetPlayerStateExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetPlayerStateSimple.checkIsValid(action.getWeaSetPlayerStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetTaskObjectiveState.checkIsValid(action.getWeaSetTaskObjectiveState(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetUnitMovePathVisibility.checkIsValid(action.getWeaSetUnitMovePathVisibility(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetTileTypeExpr.checkIsValid(action.getWeaSetTileTypeExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetTileTypeSimple.checkIsValid(action.getWeaSetTileTypeSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetTileStateExpr.checkIsValid(action.getWeaSetTileStateExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetTileStateSimple.checkIsValid(action.getWeaSetTileStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetCustomBuildingStateExpr.checkIsValid(action.getWeaSetCustomBuildingStateExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetCustomBuildingStateSimple.checkIsValid(action.getWeaSetCustomBuildingStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetCustomCrystalStateExpr.checkIsValid(action.getWeaSetCustomCrystalStateExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetCustomCrystalStateSimple.checkIsValid(action.getWeaSetCustomCrystalStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetCustomCannonStateExpr.checkIsValid(action.getWeaSetCustomCannonStateExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetCustomCannonStateSimple.checkIsValid(action.getWeaSetCustomCannonStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_SetCustomLaserTurretStateExpr.checkIsValid(action.getWeaSetCustomLaserTurretStateExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_SetCustomLaserTurretStateSimple.checkIsValid(action.getWeaSetCustomLaserTurretStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_DeleteTileBuffExpr.checkIsValid(action.getWeaDeleteTileBuffExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_DeleteTileBuffSimple.checkIsValid(action.getWeaDeleteTileBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEvents_Actions_Utils_AddTileBuffExpr.checkIsValid(action.getWeaAddTileBuffExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_AddTileBuffSimple.checkIsValid(action.getWeaAddTileBuffSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEvents_Actions_Utils_ModifyTileBuffExpr.checkIsValid(action.getWeaModifyTileBuffExpr(), customCounterNameSet))
        || (WarEvents_Actions_Utils_ModifyTileBuffSimple.checkIsValid(action.getWeaModifyTileBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEvents_Actions_Utils_PersistentShowText.checkIsValid(action.getWeaPersistentShowText()))
        || (WarEvents_Actions_Utils_PersistentPlayBgm.checkIsValid(action.getWeaPersistentPlayBgm()))
        || (WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.checkIsValid(action.getWeaPersistentModifyPlayerAttribute(), customCounterNameSet))
        || (WarEvents_Actions_Utils_PersistentModifyUnitAttribute.checkIsValid(action.getWeaPersistentModifyUnitAttribute(), customCounterNameSet));
}

export function checkIsPersistentAction(action: WarEventAction): boolean {
    return (action.getWeaPersistentShowText() != null)
        || (action.getWeaPersistentPlayBgm() != null)
        || (action.getWeaPersistentModifyPlayerAttribute() != null)
        || (action.getWeaPersistentModifyUnitAttribute() != null);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function openActionModifyPanel(war: MapEditor_Interface_IMeWar.IMeWar, fullData: WarEventFullData, action: WarEventAction): void {
    // todo: handle more action types.
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaAddUnitOnMapSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetViewpointExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetViewpointSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaBigDialogueSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSmallDialogueSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaPlayBgmPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaPlaySfxPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetWeatherExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetWeatherSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaFillUnitOnMapExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaFillUnitOnMapSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaFillUnitLoadedSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaFillUnitLoadedExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaDestroyUnitSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaDestroyUnitExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetUnitTypeSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetUnitTypeExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaAddUnitBuffSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaModifyUnitBuffSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaDeleteUnitBuffSimplePanel);

    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetUnitOwnershipSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetUnitOwnershipExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetUnitPositionSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetUnitPositionExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetUnitStateSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetUnitStateExprPanel);

    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetForceFogCodeExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetForceFogCodeSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaStopPersistentActionPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetCustomCountersPanel);

    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetPlayerStateExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetPlayerStateSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetTaskObjectiveStatePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetUnitMovePathVisibilityPanel);

    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetTileTypeExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetTileTypeSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetTileStateExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetTileStateSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetCustomBuildingStateExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetCustomBuildingStateSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetCustomCrystalStateExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetCustomCrystalStateSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetCustomCannonStateExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetCustomCannonStateSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetCustomLaserTurretStateExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaSetCustomLaserTurretStateSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaDeleteTileBuffExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaDeleteTileBuffSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaAddTileBuffExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaAddTileBuffSimplePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaModifyTileBuffExprPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaModifyTileBuffSimplePanel);

    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaPersistentShowTextPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaPersistentPlayBgmPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaPersistentModifyPlayerAttributePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeaPersistentModifyUnitAttributePanel);

    if      (action.getWeaAddUnitOnMapSimple())                         { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaAddUnitOnMapSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaSetViewpointExpr())                           { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetViewpointExprPanel,                               { war, fullData, action }); }
    else if (action.getWeaSetViewpointSimple())                         { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetViewpointSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaBigDialogueSimple())                          { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaBigDialogueSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaSmallDialogueSimple())                        { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSmallDialogueSimplePanel,                            { war, fullData, action }); }
    else if (action.getWeaPlayBgm())                                    { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaPlayBgmPanel,                                        { war, fullData, action }); }
    else if (action.getWeaPlaySfx())                                    { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaPlaySfxPanel,                                        { war, fullData, action }); }
    else if (action.getWeaSetWeatherExpr())                             { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetWeatherExprPanel,                                 { war, fullData, action }); }
    else if (action.getWeaSetWeatherSimple())                           { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetWeatherSimplePanel,                               { war, fullData, action }); }
    else if (action.getWeaFillUnitOnMapExpr())                          { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaFillUnitOnMapExprPanel,                              { war, fullData, action }); }
    else if (action.getWeaFillUnitOnMapSimple())                        { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaFillUnitOnMapSimplePanel,                            { war, fullData, action }); }
    else if (action.getWeaFillUnitLoadedSimple())                       { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaFillUnitLoadedSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaFillUnitLoadedExpr())                         { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaFillUnitLoadedExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaDestroyUnitSimple())                          { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaDestroyUnitSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaDestroyUnitExpr())                            { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaDestroyUnitExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaSetUnitTypeSimple())                          { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetUnitTypeSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaSetUnitTypeExpr())                            { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetUnitTypeExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaSetUnitOwnershipSimple())                     { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetUnitOwnershipSimplePanel,                         { war, fullData, action }); }
    else if (action.getWeaSetUnitOwnershipExpr())                       { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetUnitOwnershipExprPanel,                           { war, fullData, action }); }
    else if (action.getWeaSetUnitPositionSimple())                      { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetUnitPositionSimplePanel,                          { war, fullData, action }); }
    else if (action.getWeaSetUnitPositionExpr())                        { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetUnitPositionExprPanel,                            { war, fullData, action }); }
    else if (action.getWeaSetUnitStateSimple())                         { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetUnitStateSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaSetUnitStateExpr())                           { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetUnitStateExprPanel,                               { war, fullData, action }); }
    else if (action.getWeaAddUnitBuffSimple())                          { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaAddUnitBuffSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaModifyUnitBuffSimple())                       { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaModifyUnitBuffSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaDeleteUnitBuffSimple())                       { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaDeleteUnitBuffSimplePanel,                           { war, fullData, action }); }

    else if (action.getWeaSetForceFogCodeExpr())                        { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetForceFogCodeExprPanel,                            { war, fullData, action }); }
    else if (action.getWeaSetForceFogCodeSimple())                      { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetForceFogCodeSimplePanel,                          { war, fullData, action }); }
    else if (action.getWeaStopPersistentAction())                       { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaStopPersistentActionPanel,                           { war, fullData, action }); }
    else if (action.getWeaSetCustomCounters())                          { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetCustomCountersPanel,                              { war, fullData, action }); }

    else if (action.getWeaSetPlayerStateExpr())                         { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetPlayerStateExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaSetPlayerStateSimple())                       { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetPlayerStateSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaSetTaskObjectiveState())                      { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetTaskObjectiveStatePanel,                          { war, fullData, action }); }
    else if (action.getWeaSetUnitMovePathVisibility())                  { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetUnitMovePathVisibilityPanel,                      { war, fullData, action }); }

    else if (action.getWeaSetTileTypeExpr())                            { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetTileTypeExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaSetTileTypeSimple())                          { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetTileTypeSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaSetTileStateExpr())                           { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetTileStateExprPanel,                               { war, fullData, action }); }
    else if (action.getWeaSetTileStateSimple())                         { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetTileStateSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaSetCustomBuildingStateExpr())                 { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetCustomBuildingStateExprPanel,                     { war, fullData, action }); }
    else if (action.getWeaSetCustomBuildingStateSimple())               { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetCustomBuildingStateSimplePanel,                   { war, fullData, action }); }
    else if (action.getWeaSetCustomCrystalStateExpr())                  { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetCustomCrystalStateExprPanel,                      { war, fullData, action }); }
    else if (action.getWeaSetCustomCrystalStateSimple())                { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetCustomCrystalStateSimplePanel,                    { war, fullData, action }); }
    else if (action.getWeaSetCustomCannonStateExpr())                   { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetCustomCannonStateExprPanel,                       { war, fullData, action }); }
    else if (action.getWeaSetCustomCannonStateSimple())                 { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetCustomCannonStateSimplePanel,                     { war, fullData, action }); }
    else if (action.getWeaSetCustomLaserTurretStateExpr())              { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetCustomLaserTurretStateExprPanel,                  { war, fullData, action }); }
    else if (action.getWeaSetCustomLaserTurretStateSimple())            { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaSetCustomLaserTurretStateSimplePanel,                { war, fullData, action }); }
    else if (action.getWeaDeleteTileBuffExpr())                         { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaDeleteTileBuffExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaDeleteTileBuffSimple())                       { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaDeleteTileBuffSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaAddTileBuffExpr())                            { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaAddTileBuffExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaAddTileBuffSimple())                          { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaAddTileBuffSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaModifyTileBuffExpr())                         { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaModifyTileBuffExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaModifyTileBuffSimple())                       { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaModifyTileBuffSimplePanel,                           { war, fullData, action }); }

    else if (action.getWeaPersistentShowText())                         { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaPersistentShowTextPanel,                             { war, fullData, action }); }
    else if (action.getWeaPersistentPlayBgm())                          { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaPersistentPlayBgmPanel,                              { war, fullData, action }); }
    else if (action.getWeaPersistentModifyPlayerAttribute())            { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaPersistentModifyPlayerAttributePanel,                { war, fullData, action }); }
    else if (action.getWeaPersistentModifyUnitAttribute())              { GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeaPersistentModifyUnitAttributePanel,                  { war, fullData, action }); }

    else                                                                { throw Helpers_Misc.newError(`Invalid action.`, Utils_ClientErrorCode.ClientErrorCode.WarEventHelper_OpenActionModifyPanel_00); }
}

export function getBriefDescForAction(action: WarEventAction, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    // todo: add functions for other actions
    return (WarEvents_Actions_Utils_AddUnitOnMapSimple.getBriefDesc(action.getWeaAddUnitOnMapSimple(), gameConfig))
        || (WarEvents_Actions_Utils_FillUnitOnMapExpr.getBriefDesc(action.getWeaFillUnitOnMapExpr()))
        || (WarEvents_Actions_Utils_FillUnitOnMapSimple.getBriefDesc(action.getWeaFillUnitOnMapSimple(), gameConfig))
        || (WarEvents_Actions_Utils_FillUnitLoadedSimple.getBriefDesc(action.getWeaFillUnitLoadedSimple(), gameConfig))
        || (WarEvents_Actions_Utils_FillUnitLoadedExpr.getBriefDesc(action.getWeaFillUnitLoadedExpr()))
        || (WarEvents_Actions_Utils_DestroyUnitSimple.getBriefDesc(action.getWeaDestroyUnitSimple()))
        || (WarEvents_Actions_Utils_DestroyUnitExpr.getBriefDesc(action.getWeaDestroyUnitExpr()))
        || (WarEvents_Actions_Utils_SetUnitTypeSimple.getBriefDesc(action.getWeaSetUnitTypeSimple(), gameConfig))
        || (WarEvents_Actions_Utils_SetUnitTypeExpr.getBriefDesc(action.getWeaSetUnitTypeExpr()))
        || (WarEvents_Actions_Utils_SetUnitOwnershipSimple.getBriefDesc(action.getWeaSetUnitOwnershipSimple()))
        || (WarEvents_Actions_Utils_SetUnitOwnershipExpr.getBriefDesc(action.getWeaSetUnitOwnershipExpr()))
        || (WarEvents_Actions_Utils_SetUnitPositionSimple.getBriefDesc(action.getWeaSetUnitPositionSimple()))
        || (WarEvents_Actions_Utils_SetUnitPositionExpr.getBriefDesc(action.getWeaSetUnitPositionExpr()))
        || (WarEvents_Actions_Utils_SetUnitStateSimple.getBriefDesc(action.getWeaSetUnitStateSimple()))
        || (WarEvents_Actions_Utils_SetUnitStateExpr.getBriefDesc(action.getWeaSetUnitStateExpr()))
        || (WarEvents_Actions_Utils_AddUnitBuffSimple.getBriefDesc(action.getWeaAddUnitBuffSimple()))
        || (WarEvents_Actions_Utils_ModifyUnitBuffSimple.getBriefDesc(action.getWeaModifyUnitBuffSimple()))
        || (WarEvents_Actions_Utils_DeleteUnitBuffSimple.getBriefDesc(action.getWeaDeleteUnitBuffSimple()))
        || (WarEvents_Actions_Utils_SetViewpointExpr.getBriefDesc(action.getWeaSetViewpointExpr()))
        || (WarEvents_Actions_Utils_SetViewpointSimple.getBriefDesc(action.getWeaSetViewpointSimple()))
        || (WarEvents_Actions_Utils_SetWeatherExpr.getBriefDesc(action.getWeaSetWeatherExpr()))
        || (WarEvents_Actions_Utils_SetWeatherSimple.getBriefDesc(action.getWeaSetWeatherSimple(), gameConfig))
        || (WarEvents_Actions_Utils_BigDialogueSimple.getBriefDesc(action.getWeaBigDialogueSimple(), gameConfig))
        || (WarEvents_Actions_Utils_SmallDialogueSimple.getBriefDesc(action.getWeaSmallDialogueSimple(), gameConfig))
        || (WarEvents_Actions_Utils_PlayBgm.getBriefDesc(action.getWeaPlayBgm(), gameConfig))
        || (WarEvents_Actions_Utils_PlaySfx.getBriefDesc(action.getWeaPlaySfx(), gameConfig))
        || (WarEvents_Actions_Utils_SetForceFogCodeExpr.getBriefDesc(action.getWeaSetForceFogCodeExpr()))
        || (WarEvents_Actions_Utils_SetForceFogCodeSimple.getBriefDesc(action.getWeaSetForceFogCodeSimple()))
        || (WarEvents_Actions_Utils_SetCustomCounters.getBriefDesc(action.getWeaSetCustomCounters()))
        || (WarEvents_Actions_Utils_StopPersistentAction.getBriefDesc(action.getWeaStopPersistentAction()))
        || (WarEvents_Actions_Utils_SetPlayerStateExpr.getBriefDesc(action.getWeaSetPlayerStateExpr()))
        || (WarEvents_Actions_Utils_SetPlayerStateSimple.getBriefDesc(action.getWeaSetPlayerStateSimple()))
        || (WarEvents_Actions_Utils_SetTaskObjectiveState.getBriefDesc(action.getWeaSetTaskObjectiveState()))
        || (WarEvents_Actions_Utils_SetUnitMovePathVisibility.getBriefDesc(action.getWeaSetUnitMovePathVisibility()))
        || (WarEvents_Actions_Utils_SetTileTypeExpr.getBriefDesc(action.getWeaSetTileTypeExpr()))
        || (WarEvents_Actions_Utils_SetTileTypeSimple.getBriefDesc(action.getWeaSetTileTypeSimple()))
        || (WarEvents_Actions_Utils_SetTileStateExpr.getBriefDesc(action.getWeaSetTileStateExpr()))
        || (WarEvents_Actions_Utils_SetTileStateSimple.getBriefDesc(action.getWeaSetTileStateSimple()))
        || (WarEvents_Actions_Utils_SetCustomBuildingStateExpr.getBriefDesc(action.getWeaSetCustomBuildingStateExpr()))
        || (WarEvents_Actions_Utils_SetCustomBuildingStateSimple.getBriefDesc(action.getWeaSetCustomBuildingStateSimple()))
        || (WarEvents_Actions_Utils_SetCustomCrystalStateExpr.getBriefDesc(action.getWeaSetCustomCrystalStateExpr()))
        || (WarEvents_Actions_Utils_SetCustomCrystalStateSimple.getBriefDesc(action.getWeaSetCustomCrystalStateSimple()))
        || (WarEvents_Actions_Utils_SetCustomCannonStateExpr.getBriefDesc(action.getWeaSetCustomCannonStateExpr()))
        || (WarEvents_Actions_Utils_SetCustomCannonStateSimple.getBriefDesc(action.getWeaSetCustomCannonStateSimple()))
        || (WarEvents_Actions_Utils_SetCustomLaserTurretStateExpr.getBriefDesc(action.getWeaSetCustomLaserTurretStateExpr()))
        || (WarEvents_Actions_Utils_SetCustomLaserTurretStateSimple.getBriefDesc(action.getWeaSetCustomLaserTurretStateSimple()))
        || (WarEvents_Actions_Utils_DeleteTileBuffExpr.getBriefDesc(action.getWeaDeleteTileBuffExpr()))
        || (WarEvents_Actions_Utils_DeleteTileBuffSimple.getBriefDesc(action.getWeaDeleteTileBuffSimple()))
        || (WarEvents_Actions_Utils_AddTileBuffExpr.getBriefDesc(action.getWeaAddTileBuffExpr()))
        || (WarEvents_Actions_Utils_AddTileBuffSimple.getBriefDesc(action.getWeaAddTileBuffSimple()))
        || (WarEvents_Actions_Utils_ModifyTileBuffExpr.getBriefDesc(action.getWeaModifyTileBuffExpr()))
        || (WarEvents_Actions_Utils_ModifyTileBuffSimple.getBriefDesc(action.getWeaModifyTileBuffSimple()))
        || (WarEvents_Actions_Utils_PersistentShowText.getBriefDesc(action.getWeaPersistentShowText()))
        || (WarEvents_Actions_Utils_PersistentPlayBgm.getBriefDesc(action.getWeaPersistentPlayBgm(), gameConfig))
        || (WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.getBriefDesc(action.getWeaPersistentModifyPlayerAttribute()))
        || (WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getBriefDesc(action.getWeaPersistentModifyUnitAttribute()));
}
export function getDetailDescForAction(action: WarEventAction, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    // todo: add functions for other actions
    return (WarEvents_Actions_Utils_AddUnitOnMapSimple.getDetailDesc(action.getWeaAddUnitOnMapSimple(), gameConfig))
        || (WarEvents_Actions_Utils_FillUnitOnMapExpr.getDetailDesc(action.getWeaFillUnitOnMapExpr()))
        || (WarEvents_Actions_Utils_FillUnitOnMapSimple.getDetailDesc(action.getWeaFillUnitOnMapSimple(), gameConfig))
        || (WarEvents_Actions_Utils_FillUnitLoadedSimple.getDetailDesc(action.getWeaFillUnitLoadedSimple(), gameConfig))
        || (WarEvents_Actions_Utils_FillUnitLoadedExpr.getDetailDesc(action.getWeaFillUnitLoadedExpr()))
        || (WarEvents_Actions_Utils_DestroyUnitSimple.getDetailDesc(action.getWeaDestroyUnitSimple()))
        || (WarEvents_Actions_Utils_DestroyUnitExpr.getDetailDesc(action.getWeaDestroyUnitExpr()))
        || (WarEvents_Actions_Utils_SetUnitTypeSimple.getDetailDesc(action.getWeaSetUnitTypeSimple(), gameConfig))
        || (WarEvents_Actions_Utils_SetUnitTypeExpr.getDetailDesc(action.getWeaSetUnitTypeExpr()))
        || (WarEvents_Actions_Utils_SetUnitOwnershipSimple.getDetailDesc(action.getWeaSetUnitOwnershipSimple()))
        || (WarEvents_Actions_Utils_SetUnitOwnershipExpr.getDetailDesc(action.getWeaSetUnitOwnershipExpr()))
        || (WarEvents_Actions_Utils_SetUnitPositionSimple.getDetailDesc(action.getWeaSetUnitPositionSimple()))
        || (WarEvents_Actions_Utils_SetUnitPositionExpr.getDetailDesc(action.getWeaSetUnitPositionExpr()))
        || (WarEvents_Actions_Utils_SetUnitStateSimple.getDetailDesc(action.getWeaSetUnitStateSimple()))
        || (WarEvents_Actions_Utils_SetUnitStateExpr.getDetailDesc(action.getWeaSetUnitStateExpr()))
        || (WarEvents_Actions_Utils_AddUnitBuffSimple.getDetailDesc(action.getWeaAddUnitBuffSimple()))
        || (WarEvents_Actions_Utils_ModifyUnitBuffSimple.getDetailDesc(action.getWeaModifyUnitBuffSimple()))
        || (WarEvents_Actions_Utils_DeleteUnitBuffSimple.getDetailDesc(action.getWeaDeleteUnitBuffSimple()))
        || (WarEvents_Actions_Utils_SetViewpointExpr.getDetailDesc(action.getWeaSetViewpointExpr()))
        || (WarEvents_Actions_Utils_SetViewpointSimple.getDetailDesc(action.getWeaSetViewpointSimple()))
        || (WarEvents_Actions_Utils_SetWeatherExpr.getDetailDesc(action.getWeaSetWeatherExpr()))
        || (WarEvents_Actions_Utils_SetWeatherSimple.getDetailDesc(action.getWeaSetWeatherSimple(), gameConfig))
        || (WarEvents_Actions_Utils_BigDialogueSimple.getDetailDesc(action.getWeaBigDialogueSimple(), gameConfig))
        || (WarEvents_Actions_Utils_SmallDialogueSimple.getDetailDesc(action.getWeaSmallDialogueSimple(), gameConfig))
        || (WarEvents_Actions_Utils_PlayBgm.getDetailDesc(action.getWeaPlayBgm(), gameConfig))
        || (WarEvents_Actions_Utils_PlaySfx.getDetailDesc(action.getWeaPlaySfx(), gameConfig))
        || (WarEvents_Actions_Utils_SetForceFogCodeExpr.getDetailDesc(action.getWeaSetForceFogCodeExpr()))
        || (WarEvents_Actions_Utils_SetForceFogCodeSimple.getDetailDesc(action.getWeaSetForceFogCodeSimple()))
        || (WarEvents_Actions_Utils_SetCustomCounters.getDetailDesc(action.getWeaSetCustomCounters()))
        || (WarEvents_Actions_Utils_StopPersistentAction.getDetailDesc(action.getWeaStopPersistentAction()))
        || (WarEvents_Actions_Utils_SetPlayerStateExpr.getDetailDesc(action.getWeaSetPlayerStateExpr()))
        || (WarEvents_Actions_Utils_SetPlayerStateSimple.getDetailDesc(action.getWeaSetPlayerStateSimple()))
        || (WarEvents_Actions_Utils_SetTaskObjectiveState.getDetailDesc(action.getWeaSetTaskObjectiveState()))
        || (WarEvents_Actions_Utils_SetUnitMovePathVisibility.getDetailDesc(action.getWeaSetUnitMovePathVisibility()))
        || (WarEvents_Actions_Utils_SetTileTypeExpr.getDetailDesc(action.getWeaSetTileTypeExpr()))
        || (WarEvents_Actions_Utils_SetTileTypeSimple.getDetailDesc(action.getWeaSetTileTypeSimple()))
        || (WarEvents_Actions_Utils_SetTileStateExpr.getDetailDesc(action.getWeaSetTileStateExpr()))
        || (WarEvents_Actions_Utils_SetTileStateSimple.getDetailDesc(action.getWeaSetTileStateSimple()))
        || (WarEvents_Actions_Utils_SetCustomBuildingStateExpr.getDetailDesc(action.getWeaSetCustomBuildingStateExpr()))
        || (WarEvents_Actions_Utils_SetCustomBuildingStateSimple.getDetailDesc(action.getWeaSetCustomBuildingStateSimple()))
        || (WarEvents_Actions_Utils_SetCustomCrystalStateExpr.getDetailDesc(action.getWeaSetCustomCrystalStateExpr()))
        || (WarEvents_Actions_Utils_SetCustomCrystalStateSimple.getDetailDesc(action.getWeaSetCustomCrystalStateSimple()))
        || (WarEvents_Actions_Utils_SetCustomCannonStateExpr.getDetailDesc(action.getWeaSetCustomCannonStateExpr()))
        || (WarEvents_Actions_Utils_SetCustomCannonStateSimple.getDetailDesc(action.getWeaSetCustomCannonStateSimple()))
        || (WarEvents_Actions_Utils_SetCustomLaserTurretStateExpr.getDetailDesc(action.getWeaSetCustomLaserTurretStateExpr()))
        || (WarEvents_Actions_Utils_SetCustomLaserTurretStateSimple.getDetailDesc(action.getWeaSetCustomLaserTurretStateSimple()))
        || (WarEvents_Actions_Utils_DeleteTileBuffExpr.getDetailDesc(action.getWeaDeleteTileBuffExpr()))
        || (WarEvents_Actions_Utils_DeleteTileBuffSimple.getDetailDesc(action.getWeaDeleteTileBuffSimple()))
        || (WarEvents_Actions_Utils_AddTileBuffExpr.getDetailDesc(action.getWeaAddTileBuffExpr()))
        || (WarEvents_Actions_Utils_AddTileBuffSimple.getDetailDesc(action.getWeaAddTileBuffSimple()))
        || (WarEvents_Actions_Utils_ModifyTileBuffExpr.getDetailDesc(action.getWeaModifyTileBuffExpr()))
        || (WarEvents_Actions_Utils_ModifyTileBuffSimple.getDetailDesc(action.getWeaModifyTileBuffSimple()))
        || (WarEvents_Actions_Utils_PersistentShowText.getDetailDesc(action.getWeaPersistentShowText()))
        || (WarEvents_Actions_Utils_PersistentPlayBgm.getDetailDesc(action.getWeaPersistentPlayBgm(), gameConfig))
        || (WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.getDetailDesc(action.getWeaPersistentModifyPlayerAttribute()))
        || (WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getDetailDesc(action.getWeaPersistentModifyUnitAttribute()));
}

export function getErrorTipForAction(fullData: WarEventFullData, action: WarEventAction, war: BaseWar_Interface_IBwWar.IBwWar): string | null {
    const actionsCountTotal = fullData.getActionArray().length;
    if (actionsCountTotal > WarEvents_Actions_Constants_Common.MaxCounts.PerMap) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.A0184)} (${actionsCountTotal}/${WarEvents_Actions_Constants_Common.MaxCounts.PerMap})`;
    }

    // if (Object.keys(action.toJson()).length !== 2) {
    //     return Lang.getText(LangTextType.A0177);
    // }

    const actionId = action.getWeaCommonData()?.getActionId();
    if ((actionId == null) || (!checkIsValidWarEventActionId(actionId))) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0177);
    }

    const playersCountUnneutral = war.getPlayersCountUnneutral();
    const gameConfig            = war.getGcData();
    const mapSize               = war.getTileMap().getMapSize();
    const customCounterNameSet  = new Set(fullData.getCustomCounterNameArray().map(v => v.getName() ?? ``));

    // todo: add more tips for the future actions.
    const weaAddUnitOnMapSimple = action.getWeaAddUnitOnMapSimple();
    if (weaAddUnitOnMapSimple) {
        return WarEvents_Actions_Utils_AddUnitOnMapSimple.getErrorTip(weaAddUnitOnMapSimple, war);
    }

    const weaFillUnitOnMapExpr = action.getWeaFillUnitOnMapExpr();
    if (weaFillUnitOnMapExpr) {
        return WarEvents_Actions_Utils_FillUnitOnMapExpr.getErrorTip(weaFillUnitOnMapExpr, customCounterNameSet);
    }

    const weaFillUnitOnMapSimple = action.getWeaFillUnitOnMapSimple();
    if (weaFillUnitOnMapSimple) {
        return WarEvents_Actions_Utils_FillUnitOnMapSimple.getErrorTip(weaFillUnitOnMapSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaFillUnitLoadedSimple = action.getWeaFillUnitLoadedSimple();
    if (weaFillUnitLoadedSimple) {
        return WarEvents_Actions_Utils_FillUnitLoadedSimple.getErrorTip(weaFillUnitLoadedSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaFillUnitLoadedExpr = action.getWeaFillUnitLoadedExpr();
    if (weaFillUnitLoadedExpr) {
        return WarEvents_Actions_Utils_FillUnitLoadedExpr.getErrorTip(weaFillUnitLoadedExpr, customCounterNameSet);
    }

    const weaDestroyUnitSimple = action.getWeaDestroyUnitSimple();
    if (weaDestroyUnitSimple) {
        return WarEvents_Actions_Utils_DestroyUnitSimple.getErrorTip(weaDestroyUnitSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDestroyUnitExpr = action.getWeaDestroyUnitExpr();
    if (weaDestroyUnitExpr) {
        return WarEvents_Actions_Utils_DestroyUnitExpr.getErrorTip(weaDestroyUnitExpr, customCounterNameSet);
    }

    const weaSetUnitTypeSimple = action.getWeaSetUnitTypeSimple();
    if (weaSetUnitTypeSimple) {
        return WarEvents_Actions_Utils_SetUnitTypeSimple.getErrorTip(weaSetUnitTypeSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitTypeExpr = action.getWeaSetUnitTypeExpr();
    if (weaSetUnitTypeExpr) {
        return WarEvents_Actions_Utils_SetUnitTypeExpr.getErrorTip(weaSetUnitTypeExpr, customCounterNameSet);
    }

    const weaSetUnitOwnershipSimple = action.getWeaSetUnitOwnershipSimple();
    if (weaSetUnitOwnershipSimple) {
        return WarEvents_Actions_Utils_SetUnitOwnershipSimple.getErrorTip(weaSetUnitOwnershipSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitOwnershipExpr = action.getWeaSetUnitOwnershipExpr();
    if (weaSetUnitOwnershipExpr) {
        return WarEvents_Actions_Utils_SetUnitOwnershipExpr.getErrorTip(weaSetUnitOwnershipExpr, customCounterNameSet);
    }

    const weaSetUnitPositionSimple = action.getWeaSetUnitPositionSimple();
    if (weaSetUnitPositionSimple) {
        return WarEvents_Actions_Utils_SetUnitPositionSimple.getErrorTip(weaSetUnitPositionSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitPositionExpr = action.getWeaSetUnitPositionExpr();
    if (weaSetUnitPositionExpr) {
        return WarEvents_Actions_Utils_SetUnitPositionExpr.getErrorTip(weaSetUnitPositionExpr, customCounterNameSet);
    }

    const weaSetUnitStateSimple = action.getWeaSetUnitStateSimple();
    if (weaSetUnitStateSimple) {
        return WarEvents_Actions_Utils_SetUnitStateSimple.getErrorTip(weaSetUnitStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitStateExpr = action.getWeaSetUnitStateExpr();
    if (weaSetUnitStateExpr) {
        return WarEvents_Actions_Utils_SetUnitStateExpr.getErrorTip(weaSetUnitStateExpr, customCounterNameSet);
    }

    const weaAddUnitBuffSimple = action.getWeaAddUnitBuffSimple();
    if (weaAddUnitBuffSimple) {
        return WarEvents_Actions_Utils_AddUnitBuffSimple.getErrorTip(weaAddUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaModifyUnitBuffSimple = action.getWeaModifyUnitBuffSimple();
    if (weaModifyUnitBuffSimple) {
        return WarEvents_Actions_Utils_ModifyUnitBuffSimple.getErrorTip(weaModifyUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDeleteUnitBuffSimple = action.getWeaDeleteUnitBuffSimple();
    if (weaDeleteUnitBuffSimple) {
        return WarEvents_Actions_Utils_DeleteUnitBuffSimple.getErrorTip(weaDeleteUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetViewpointExpr = action.getWeaSetViewpointExpr();
    if (weaSetViewpointExpr) {
        return WarEvents_Actions_Utils_SetViewpointExpr.getErrorTip(weaSetViewpointExpr, customCounterNameSet);
    }

    const weaSetViewpointSimple = action.getWeaSetViewpointSimple();
    if (weaSetViewpointSimple) {
        return WarEvents_Actions_Utils_SetViewpointSimple.getErrorTip(weaSetViewpointSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetWeatherExpr = action.getWeaSetWeatherExpr();
    if (weaSetWeatherExpr) {
        return WarEvents_Actions_Utils_SetWeatherExpr.getErrorTip(weaSetWeatherExpr, customCounterNameSet);
    }

    const weaSetWeatherSimple = action.getWeaSetWeatherSimple();
    if (weaSetWeatherSimple) {
        return WarEvents_Actions_Utils_SetWeatherSimple.getErrorTip(weaSetWeatherSimple, gameConfig);
    }

    const weaBigDialogueSimple = action.getWeaBigDialogueSimple();
    if (weaBigDialogueSimple) {
        return WarEvents_Actions_Utils_BigDialogueSimple.getErrorTip(weaBigDialogueSimple, playersCountUnneutral, gameConfig);
    }

    const weaSmallDialogueSimple = action.getWeaSmallDialogueSimple();
    if (weaSmallDialogueSimple) {
        return WarEvents_Actions_Utils_SmallDialogueSimple.getErrorTip(weaSmallDialogueSimple, playersCountUnneutral, gameConfig);
    }

    const weaPlayBgm = action.getWeaPlayBgm();
    if (weaPlayBgm) {
        return WarEvents_Actions_Utils_PlayBgm.getErrorTip(weaPlayBgm);
    }

    const weaPlaySfx = action.getWeaPlaySfx();
    if (weaPlaySfx) {
        return WarEvents_Actions_Utils_PlaySfx.getErrorTip(weaPlaySfx);
    }

    const weaSetForceFogCodeExpr = action.getWeaSetForceFogCodeExpr();
    if (weaSetForceFogCodeExpr) {
        return WarEvents_Actions_Utils_SetForceFogCodeExpr.getErrorTip(weaSetForceFogCodeExpr, customCounterNameSet);
    }

    const weaSetForceFogCodeSimple = action.getWeaSetForceFogCodeSimple();
    if (weaSetForceFogCodeSimple) {
        return WarEvents_Actions_Utils_SetForceFogCodeSimple.getErrorTip(weaSetForceFogCodeSimple);
    }

    const weaSetCustomCounters = action.getWeaSetCustomCounters();
    if (weaSetCustomCounters) {
        return WarEvents_Actions_Utils_SetCustomCounters.getErrorTip(weaSetCustomCounters, customCounterNameSet);
    }

    const weaStopPersistentAction = action.getWeaStopPersistentAction();
    if (weaStopPersistentAction) {
        return WarEvents_Actions_Utils_StopPersistentAction.getErrorTip(weaStopPersistentAction, fullData);
    }

    const weaSetPlayerStateExpr = action.getWeaSetPlayerStateExpr();
    if (weaSetPlayerStateExpr) {
        return WarEvents_Actions_Utils_SetPlayerStateExpr.getErrorTip(weaSetPlayerStateExpr, customCounterNameSet);
    }

    const weaSetPlayerStateSimple = action.getWeaSetPlayerStateSimple();
    if (weaSetPlayerStateSimple) {
        return WarEvents_Actions_Utils_SetPlayerStateSimple.getErrorTip(weaSetPlayerStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetTaskObjectiveState = action.getWeaSetTaskObjectiveState();
    if (weaSetTaskObjectiveState) {
        return WarEvents_Actions_Utils_SetTaskObjectiveState.getErrorTip(weaSetTaskObjectiveState, customCounterNameSet);
    }

    const weaSetUnitMovePathVisibility = action.getWeaSetUnitMovePathVisibility();
    if (weaSetUnitMovePathVisibility) {
        return WarEvents_Actions_Utils_SetUnitMovePathVisibility.getErrorTip(weaSetUnitMovePathVisibility, customCounterNameSet);
    }

    const weaSetTileTypeExpr = action.getWeaSetTileTypeExpr();
    if (weaSetTileTypeExpr) {
        return WarEvents_Actions_Utils_SetTileTypeExpr.getErrorTip(weaSetTileTypeExpr, customCounterNameSet);
    }

    const weaSetTileTypeSimple = action.getWeaSetTileTypeSimple();
    if (weaSetTileTypeSimple) {
        return WarEvents_Actions_Utils_SetTileTypeSimple.getErrorTip(weaSetTileTypeSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetTileStateExpr = action.getWeaSetTileStateExpr();
    if (weaSetTileStateExpr) {
        return WarEvents_Actions_Utils_SetTileStateExpr.getErrorTip(weaSetTileStateExpr, customCounterNameSet);
    }

    const weaSetTileStateSimple = action.getWeaSetTileStateSimple();
    if (weaSetTileStateSimple) {
        return WarEvents_Actions_Utils_SetTileStateSimple.getErrorTip(weaSetTileStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomBuildingStateExpr = action.getWeaSetCustomBuildingStateExpr();
    if (weaSetCustomBuildingStateExpr) {
        return WarEvents_Actions_Utils_SetCustomBuildingStateExpr.getErrorTip(weaSetCustomBuildingStateExpr, customCounterNameSet);
    }

    const weaSetCustomBuildingStateSimple = action.getWeaSetCustomBuildingStateSimple();
    if (weaSetCustomBuildingStateSimple) {
        return WarEvents_Actions_Utils_SetCustomBuildingStateSimple.getErrorTip(weaSetCustomBuildingStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomCrystalStateExpr = action.getWeaSetCustomCrystalStateExpr();
    if (weaSetCustomCrystalStateExpr) {
        return WarEvents_Actions_Utils_SetCustomCrystalStateExpr.getErrorTip(weaSetCustomCrystalStateExpr, customCounterNameSet);
    }

    const weaSetCustomCrystalStateSimple = action.getWeaSetCustomCrystalStateSimple();
    if (weaSetCustomCrystalStateSimple) {
        return WarEvents_Actions_Utils_SetCustomCrystalStateSimple.getErrorTip(weaSetCustomCrystalStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomCannonStateExpr = action.getWeaSetCustomCannonStateExpr();
    if (weaSetCustomCannonStateExpr) {
        return WarEvents_Actions_Utils_SetCustomCannonStateExpr.getErrorTip(weaSetCustomCannonStateExpr, customCounterNameSet);
    }

    const weaSetCustomCannonStateSimple = action.getWeaSetCustomCannonStateSimple();
    if (weaSetCustomCannonStateSimple) {
        return WarEvents_Actions_Utils_SetCustomCannonStateSimple.getErrorTip(weaSetCustomCannonStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomLaserTurretStateExpr = action.getWeaSetCustomLaserTurretStateExpr();
    if (weaSetCustomLaserTurretStateExpr) {
        return WarEvents_Actions_Utils_SetCustomLaserTurretStateExpr.getErrorTip(weaSetCustomLaserTurretStateExpr, customCounterNameSet);
    }

    const weaSetCustomLaserTurretStateSimple = action.getWeaSetCustomLaserTurretStateSimple();
    if (weaSetCustomLaserTurretStateSimple) {
        return WarEvents_Actions_Utils_SetCustomLaserTurretStateSimple.getErrorTip(weaSetCustomLaserTurretStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDeleteTileBuffExpr = action.getWeaDeleteTileBuffExpr();
    if (weaDeleteTileBuffExpr) {
        return WarEvents_Actions_Utils_DeleteTileBuffExpr.getErrorTip(weaDeleteTileBuffExpr, customCounterNameSet);
    }

    const weaDeleteTileBuffSimple = action.getWeaDeleteTileBuffSimple();
    if (weaDeleteTileBuffSimple) {
        return WarEvents_Actions_Utils_DeleteTileBuffSimple.getErrorTip(weaDeleteTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaAddTileBuffExpr = action.getWeaAddTileBuffExpr();
    if (weaAddTileBuffExpr) {
        return WarEvents_Actions_Utils_AddTileBuffExpr.getErrorTip(weaAddTileBuffExpr, customCounterNameSet);
    }

    const weaAddTileBuffSimple = action.getWeaAddTileBuffSimple();
    if (weaAddTileBuffSimple) {
        return WarEvents_Actions_Utils_AddTileBuffSimple.getErrorTip(weaAddTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaModifyTileBuffExpr = action.getWeaModifyTileBuffExpr();
    if (weaModifyTileBuffExpr) {
        return WarEvents_Actions_Utils_ModifyTileBuffExpr.getErrorTip(weaModifyTileBuffExpr, customCounterNameSet);
    }

    const weaModifyTileBuffSimple = action.getWeaModifyTileBuffSimple();
    if (weaModifyTileBuffSimple) {
        return WarEvents_Actions_Utils_ModifyTileBuffSimple.getErrorTip(weaModifyTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaPersistentShowText = action.getWeaPersistentShowText();
    if (weaPersistentShowText) {
        return WarEvents_Actions_Utils_PersistentShowText.getErrorTip(weaPersistentShowText);
    }

    const weaPersistentPlayBgm = action.getWeaPersistentPlayBgm();
    if (weaPersistentPlayBgm) {
        return WarEvents_Actions_Utils_PersistentPlayBgm.getErrorTip(weaPersistentPlayBgm);
    }

    const weaPersistentModifyPlayerAttribute = action.getWeaPersistentModifyPlayerAttribute();
    if (weaPersistentModifyPlayerAttribute) {
        return WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.getErrorTip(weaPersistentModifyPlayerAttribute, customCounterNameSet);
    }

    const weaPersistentModifyUnitAttribute = action.getWeaPersistentModifyUnitAttribute();
    if (weaPersistentModifyUnitAttribute) {
        return WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getErrorTip(weaPersistentModifyUnitAttribute, customCounterNameSet);
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0177);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function addDefaultAction({ fullData, eventId, nodeId, actionIndex }: {
    fullData        : WarEventFullData;
    eventId         : number;
    nodeId          : number;
    actionIndex     : number | null;
}): number | null {   // DONE
    const actionIdArray = WarEvents_FullDatas_Utils.getEvent(fullData, eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getActionIdArray();
    if (actionIdArray == null) {
        return null;
    }

    const actionArray = fullData.getActionArray();
    for (let actionId = 1; ; ++actionId) {
        if (!actionArray.some(v => v.getWeaCommonData()?.getActionId() === actionId)) {
            actionArray.push(WarEventAction.fromJson({
                WeaCommonData: {
                    actionId        : actionId,
                    actionNameArray : [],
                },
                WeaAddUnitOnMapSimple: {
                    unitArray   : [],
                },
            }));
            actionArray.sort((v1, v2) => Helpers_Misc.getExisted(v1.getWeaCommonData()?.getActionId()) - Helpers_Misc.getExisted(v2.getWeaCommonData()?.getActionId()));

            if (actionIndex == null) {
                actionIdArray.push(actionId);
            } else {
                actionIdArray.splice(Math.min(actionIndex, actionIdArray.length), 0, actionId);
            }

            return actionId;
        }
    }
}

export function getDefaultSimpleCoDialogueData(): DataForDialogue {
    return DataForDialogue.fromJson({
        dataForCoDialogue: {
            coId        : null,
            playerIndex : Players_Constants.PlayerIndex.First,
            side        : Dialogues_Constants.SmallDialogueSideId.Bottom,
            nameArray   : [],
            textArray   : [
                { languageType: Lang_Utils.getCurrentLanguageType(), text: `...` },
            ],
        },
    });
}

export function cloneAction(fullData: WarEventFullData, srcActionId: number): number {
    const actionArray   = fullData.getActionArray();
    const newAction     = Helpers_Misc.getExisted(actionArray.find(v => v.getWeaCommonData()?.getActionId() === srcActionId)).clone();
    actionArray.push(newAction);

    for (let actionId = 1; ; ++actionId) {
        if (actionArray.some(v => v.getWeaCommonData()?.getActionId() === actionId)) {
            continue;
        }

        Helpers_Misc.getExisted(newAction.getWeaCommonData()).setActionId(actionId);
        actionArray.sort((v1, v2) => Helpers_Misc.getExisted(v1.getWeaCommonData()?.getActionId()) - Helpers_Misc.getExisted(v2.getWeaCommonData()?.getActionId()));
        return actionId;
    }
}

export function resetAction(action: WarEventAction, actionType: WarEvents_Actions_Constants_Common.ActionTypeId, gameConfig: GameConfigs_GameConfig.GameConfig): void {
    action.clearActionData();

    // todo handle future actions.
    if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.AddUnitOnMapSimple) {
        action.setWeaAddUnitOnMapSimple(WeaAddUnitOnMapSimple.fromJson({
            unitArray   : [],
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitOnMapExpr) {
        action.setWeaFillUnitOnMapExpr(WeaFillUnitOnMapExpr.fromJson({
            conTileFilter                       : ``,
            actPlayerIndex                      : ``,
            actUnitType                         : ``,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitOnMapSimple) {
        const unitData = Units_Utils_Serialization.createDefault({
            unitTypeId  : Units_Constants.UnitTypeId.First,
            playerIndex : Players_Constants.PlayerIndex.First,
            gridIndex   : { x: 0, y: 0 },
            unitId      : -1,
            gcData      : gameConfig,
        });
        unitData.setGridIndex(null);
        action.setWeaFillUnitOnMapSimple(WeaFillUnitOnMapSimple.fromJson({
            actUnitData : unitData.toJson(),
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitLoadedSimple) {
        const unitData = Units_Utils_Serialization.createDefault({
            unitTypeId  : Units_Constants.UnitTypeId.First,
            playerIndex : Players_Constants.PlayerIndex.First,
            gridIndex   : { x: 0, y: 0 },
            unitId      : -1,
            gcData      : gameConfig,
        });
        unitData.setGridIndex(null);
        action.setWeaFillUnitLoadedSimple(WeaFillUnitLoadedSimple.fromJson({
            actLoadCount    : 1,
            actUnitData : unitData.toJson(),
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitLoadedExpr) {
        action.setWeaFillUnitLoadedExpr(WeaFillUnitLoadedExpr.fromJson({
            conUnitFilter                       : ``,
            actUnitType                         : ``,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.DestroyUnitSimple) {
        action.setWeaDestroyUnitSimple(WeaDestroyUnitSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.DestroyUnitExpr) {
        action.setWeaDestroyUnitExpr(WeaDestroyUnitExpr.fromJson({
            conUnitFilter                       : ``,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitTypeSimple) {
        action.setWeaSetUnitTypeSimple(WeaSetUnitTypeSimple.fromJson({
            actUnitType                         : Units_Constants.UnitTypeId.First,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitTypeExpr) {
        action.setWeaSetUnitTypeExpr(WeaSetUnitTypeExpr.fromJson({
            conUnitFilter                       : ``,
            actUnitType                         : ``,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitOwnershipSimple) {
        action.setWeaSetUnitOwnershipSimple(WeaSetUnitOwnershipSimple.fromJson({
            actPlayerIndex                      : Players_Constants.PlayerIndex.First,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitOwnershipExpr) {
        action.setWeaSetUnitOwnershipExpr(WeaSetUnitOwnershipExpr.fromJson({
            conUnitFilter                       : ``,
            actPlayerIndex                      : ``,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitPositionSimple) {
        action.setWeaSetUnitPositionSimple(WeaSetUnitPositionSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitPositionExpr) {
        action.setWeaSetUnitPositionExpr(WeaSetUnitPositionExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitStateSimple) {
        action.setWeaSetUnitStateSimple(WeaSetUnitStateSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitStateExpr) {
        action.setWeaSetUnitStateExpr(WeaSetUnitStateExpr.fromJson({
            conUnitFilter                       : ``,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.AddUnitBuffSimple) {
        action.setWeaAddUnitBuffSimple(WeaAddUnitBuffSimple.fromJson({
            actBuffType     : UnitBuffs_Constants.BuffTypeId.Fire,
            actExtraParams  : [],
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.ModifyUnitBuffSimple) {
        action.setWeaModifyUnitBuffSimple(WeaModifyUnitBuffSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.DeleteUnitBuffSimple) {
        action.setWeaDeleteUnitBuffSimple(WeaDeleteUnitBuffSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetViewpointExpr) {
        action.setWeaSetViewpointExpr(WeaSetViewpointExpr.fromJson({
            targets         : ``,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetViewpointSimple) {
        action.setWeaSetViewpointSimple(WeaSetViewpointSimple.fromJson({
            actNeedFocusEffect  : true,
            actIsOneByOne       : true,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetWeatherSimple) {
        action.setWeaSetWeatherSimple(WeaSetWeatherSimple.fromJson({
            weatherType         : gameConfig.getDefaultWeatherType(),
            weatherTurnsCount   : 0,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetWeatherExpr) {
        action.setWeaSetWeatherExpr(WeaSetWeatherExpr.fromJson({
            weatherType         : "",
            weatherTurnsCount   : "",
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.BigDialogueSimple) {
        action.setWeaBigDialogueSimple(WeaBigDialogueSimple.fromJson({
            backgroundId    : 0,
            dataArray       : [],
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SmallDialogueSimple) {
        action.setWeaSmallDialogueSimple(WeaSmallDialogueSimple.fromJson({
            dataArray       : [],
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.PlayBgm) {
        action.setWeaPlayBgm(WeaPlayBgm.fromJson({
            useCoBgm        : false,
            bgmCode         : Sounds_Constants.BgmSfxCode.None,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.PlaySfx) {
        action.setWeaPlaySfx(WeaPlaySfx.fromJson({
            sfxCode         : Sounds_Constants.BgmSfxCode.None,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetForceFogCodeExpr) {
        action.setWeaSetForceFogCodeExpr(WeaSetForceFogCodeExpr.fromJson({
            forceFogCode    : ``,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetForceFogCodeSimple) {
        action.setWeaSetForceFogCodeSimple(WeaSetForceFogCodeSimple.fromJson({
            forceFogCode    : FogMaps_Constants.ForcedFogCode.Fog,
            turnsCount      : 0,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCounters) {
        action.setWeaSetCustomCounters(WeaSetCustomCounters.fromJson({
            idExpression            : "",
            valueExpression         : "",
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.StopPersistentAction) {
        action.setWeaStopPersistentAction(WeaStopPersistentAction.fromJson({
            actionIdArray   : [],
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetPlayerStateExpr) {
        action.setWeaSetPlayerStateExpr(WeaSetPlayerStateExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetPlayerStateSimple) {
        action.setWeaSetPlayerStateSimple(WeaSetPlayerStateSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetTaskObjectiveState) {
        action.setWeaSetTaskObjectiveState(WeaSetTaskObjectiveState.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitMovePathVisibility) {
        action.setWeaSetUnitMovePathVisibility(WeaSetUnitMovePathVisibility.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetTileTypeExpr) {
        action.setWeaSetTileTypeExpr(WeaSetTileTypeExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetTileTypeSimple) {
        action.setWeaSetTileTypeSimple(WeaSetTileTypeSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetTileStateExpr) {
        action.setWeaSetTileStateExpr(WeaSetTileStateExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetTileStateSimple) {
        action.setWeaSetTileStateSimple(WeaSetTileStateSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomBuildingStateExpr) {
        action.setWeaSetCustomBuildingStateExpr(WeaSetCustomBuildingStateExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomBuildingStateSimple) {
        action.setWeaSetCustomBuildingStateSimple(WeaSetCustomBuildingStateSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCrystalStateExpr) {
        action.setWeaSetCustomCrystalStateExpr(WeaSetCustomCrystalStateExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCrystalStateSimple) {
        action.setWeaSetCustomCrystalStateSimple(WeaSetCustomCrystalStateSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCannonStateExpr) {
        action.setWeaSetCustomCannonStateExpr(WeaSetCustomCannonStateExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCannonStateSimple) {
        action.setWeaSetCustomCannonStateSimple(WeaSetCustomCannonStateSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomLaserTurretStateExpr) {
        action.setWeaSetCustomLaserTurretStateExpr(WeaSetCustomLaserTurretStateExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomLaserTurretStateSimple) {
        action.setWeaSetCustomLaserTurretStateSimple(WeaSetCustomLaserTurretStateSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.DeleteTileBuffExpr) {
        action.setWeaDeleteTileBuffExpr(WeaDeleteTileBuffExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.DeleteTileBuffSimple) {
        action.setWeaDeleteTileBuffSimple(WeaDeleteTileBuffSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.AddTileBuffExpr) {
        action.setWeaAddTileBuffExpr(WeaAddTileBuffExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.AddTileBuffSimple) {
        action.setWeaAddTileBuffSimple(WeaAddTileBuffSimple.fromJson({
            actBuffType     : TileBuffs_Constants.BuffTypeId.NoIncome,
            actExtraParams  : [],
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.ModifyTileBuffExpr) {
        action.setWeaModifyTileBuffExpr(WeaModifyTileBuffExpr.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.ModifyTileBuffSimple) {
        action.setWeaModifyTileBuffSimple(WeaModifyTileBuffSimple.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.PersistentShowText) {
        action.setWeaPersistentShowText(WeaPersistentShowText.fromJson({
            textArray: [],
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.PersistentPlayBgm) {
        action.setWeaPersistentPlayBgm(WeaPersistentPlayBgm.fromJson({
            bgmCode     : Sounds_Constants.BgmSfxCode.CoEmpty,
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.PersistentModifyPlayerAttribute) {
        action.setWeaPersistentModifyPlayerAttribute(WeaPersistentModifyPlayerAttribute.fromJson({
        }));
    } else if (actionType === WarEvents_Actions_Constants_Common.ActionTypeId.PersistentModifyUnitAttribute) {
        action.setWeaPersistentModifyUnitAttribute(WeaPersistentModifyUnitAttribute.fromJson({
            conUnitFilter               : ``,
        }));
    } else {
        throw Helpers_Misc.newError(`Invalid actionType: ${actionType}.`, Utils_ClientErrorCode.ClientErrorCode.WarEventHelper_ResetAction_00);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getActionTypeId(action: WarEventAction): WarEvents_Actions_Constants_Common.ActionTypeId | null {
    // todo: handle future actions.
    if      (action.getWeaAddUnitOnMapSimple())                         { return WarEvents_Actions_Constants_Common.ActionTypeId.AddUnitOnMapSimple; }
    else if (action.getWeaFillUnitOnMapExpr())                          { return WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitOnMapExpr; }
    else if (action.getWeaFillUnitOnMapSimple())                        { return WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitOnMapSimple; }
    else if (action.getWeaFillUnitLoadedSimple())                       { return WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitLoadedSimple; }
    else if (action.getWeaFillUnitLoadedExpr())                         { return WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitLoadedExpr; }
    else if (action.getWeaDestroyUnitSimple())                          { return WarEvents_Actions_Constants_Common.ActionTypeId.DestroyUnitSimple; }
    else if (action.getWeaDestroyUnitExpr())                            { return WarEvents_Actions_Constants_Common.ActionTypeId.DestroyUnitExpr; }
    else if (action.getWeaSetUnitTypeSimple())                          { return WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitTypeSimple; }
    else if (action.getWeaSetUnitTypeExpr())                            { return WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitTypeExpr; }
    else if (action.getWeaSetUnitOwnershipSimple())                     { return WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitOwnershipSimple; }
    else if (action.getWeaSetUnitOwnershipExpr())                       { return WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitOwnershipExpr; }
    else if (action.getWeaSetUnitPositionSimple())                      { return WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitPositionSimple; }
    else if (action.getWeaSetUnitPositionExpr())                        { return WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitPositionExpr; }
    else if (action.getWeaSetUnitStateSimple())                         { return WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitStateSimple; }
    else if (action.getWeaSetUnitStateExpr())                           { return WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitStateExpr; }
    else if (action.getWeaAddUnitBuffSimple())                          { return WarEvents_Actions_Constants_Common.ActionTypeId.AddUnitBuffSimple; }
    else if (action.getWeaModifyUnitBuffSimple())                       { return WarEvents_Actions_Constants_Common.ActionTypeId.ModifyUnitBuffSimple; }
    else if (action.getWeaDeleteUnitBuffSimple())                       { return WarEvents_Actions_Constants_Common.ActionTypeId.DeleteUnitBuffSimple; }
    else if (action.getWeaSetViewpointExpr())                           { return WarEvents_Actions_Constants_Common.ActionTypeId.SetViewpointExpr; }
    else if (action.getWeaSetViewpointSimple())                         { return WarEvents_Actions_Constants_Common.ActionTypeId.SetViewpointSimple; }
    else if (action.getWeaSetWeatherSimple())                           { return WarEvents_Actions_Constants_Common.ActionTypeId.SetWeatherSimple; }
    else if (action.getWeaSetWeatherExpr())                             { return WarEvents_Actions_Constants_Common.ActionTypeId.SetWeatherExpr; }
    else if (action.getWeaBigDialogueSimple())                          { return WarEvents_Actions_Constants_Common.ActionTypeId.BigDialogueSimple; }
    else if (action.getWeaSmallDialogueSimple())                        { return WarEvents_Actions_Constants_Common.ActionTypeId.SmallDialogueSimple; }
    else if (action.getWeaPlayBgm())                                    { return WarEvents_Actions_Constants_Common.ActionTypeId.PlayBgm; }
    else if (action.getWeaPlaySfx())                                    { return WarEvents_Actions_Constants_Common.ActionTypeId.PlaySfx; }
    else if (action.getWeaSetForceFogCodeExpr())                        { return WarEvents_Actions_Constants_Common.ActionTypeId.SetForceFogCodeExpr; }
    else if (action.getWeaSetForceFogCodeSimple())                      { return WarEvents_Actions_Constants_Common.ActionTypeId.SetForceFogCodeSimple; }
    else if (action.getWeaSetCustomCounters())                          { return WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCounters; }
    else if (action.getWeaStopPersistentAction())                       { return WarEvents_Actions_Constants_Common.ActionTypeId.StopPersistentAction; }
    else if (action.getWeaSetPlayerStateExpr())                         { return WarEvents_Actions_Constants_Common.ActionTypeId.SetPlayerStateExpr; }
    else if (action.getWeaSetPlayerStateSimple())                       { return WarEvents_Actions_Constants_Common.ActionTypeId.SetPlayerStateSimple; }
    else if (action.getWeaSetTaskObjectiveState())                      { return WarEvents_Actions_Constants_Common.ActionTypeId.SetTaskObjectiveState; }
    else if (action.getWeaSetUnitMovePathVisibility())                  { return WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitMovePathVisibility; }
    else if (action.getWeaSetTileTypeExpr())                            { return WarEvents_Actions_Constants_Common.ActionTypeId.SetTileTypeExpr; }
    else if (action.getWeaSetTileTypeSimple())                          { return WarEvents_Actions_Constants_Common.ActionTypeId.SetTileTypeSimple; }
    else if (action.getWeaSetTileStateExpr())                           { return WarEvents_Actions_Constants_Common.ActionTypeId.SetTileStateExpr; }
    else if (action.getWeaSetTileStateSimple())                         { return WarEvents_Actions_Constants_Common.ActionTypeId.SetTileStateSimple; }
    else if (action.getWeaSetCustomBuildingStateExpr())                 { return WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomBuildingStateExpr; }
    else if (action.getWeaSetCustomBuildingStateSimple())               { return WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomBuildingStateSimple; }
    else if (action.getWeaSetCustomCrystalStateExpr())                  { return WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCrystalStateExpr; }
    else if (action.getWeaSetCustomCrystalStateSimple())                { return WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCrystalStateSimple; }
    else if (action.getWeaSetCustomCannonStateExpr())                   { return WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCannonStateExpr; }
    else if (action.getWeaSetCustomCannonStateSimple())                 { return WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCannonStateSimple; }
    else if (action.getWeaSetCustomLaserTurretStateExpr())              { return WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomLaserTurretStateExpr; }
    else if (action.getWeaSetCustomLaserTurretStateSimple())            { return WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomLaserTurretStateSimple; }
    else if (action.getWeaDeleteTileBuffExpr())                         { return WarEvents_Actions_Constants_Common.ActionTypeId.DeleteTileBuffExpr; }
    else if (action.getWeaDeleteTileBuffSimple())                       { return WarEvents_Actions_Constants_Common.ActionTypeId.DeleteTileBuffSimple; }
    else if (action.getWeaAddTileBuffExpr())                            { return WarEvents_Actions_Constants_Common.ActionTypeId.AddTileBuffExpr; }
    else if (action.getWeaAddTileBuffSimple())                          { return WarEvents_Actions_Constants_Common.ActionTypeId.AddTileBuffSimple; }
    else if (action.getWeaModifyTileBuffExpr())                         { return WarEvents_Actions_Constants_Common.ActionTypeId.ModifyTileBuffExpr; }
    else if (action.getWeaModifyTileBuffSimple())                       { return WarEvents_Actions_Constants_Common.ActionTypeId.ModifyTileBuffSimple; }
    else if (action.getWeaPersistentShowText())                         { return WarEvents_Actions_Constants_Common.ActionTypeId.PersistentShowText; }
    else if (action.getWeaPersistentPlayBgm())                          { return WarEvents_Actions_Constants_Common.ActionTypeId.PersistentPlayBgm; }
    else if (action.getWeaPersistentModifyPlayerAttribute())            { return WarEvents_Actions_Constants_Common.ActionTypeId.PersistentModifyPlayerAttribute; }
    else if (action.getWeaPersistentModifyUnitAttribute())              { return WarEvents_Actions_Constants_Common.ActionTypeId.PersistentModifyUnitAttribute; }
    else                                                                { return null; }
}
export function getInterchangeableTypeId(action: WarEventAction): WarEvents_Actions_Constants_Common.InterchangeableTypeId {
    const actionType = getActionTypeId(action);
    if (actionType == null) {
        return WarEvents_Actions_Constants_Common.InterchangeableTypeId.NotInterchangeable;
    } else if (WarEvents_Actions_Constants_Common.PersistentInterchangeableActionTypeArray.includes(actionType)) {
        return WarEvents_Actions_Constants_Common.InterchangeableTypeId.Persistent;
    } else if (WarEvents_Actions_Constants_Common.InstantInterchangeableActionTypeArray.includes(actionType)) {
        return WarEvents_Actions_Constants_Common.InterchangeableTypeId.Instant;
    } else {
        return WarEvents_Actions_Constants_Common.InterchangeableTypeId.NotInterchangeable;
    }
}
