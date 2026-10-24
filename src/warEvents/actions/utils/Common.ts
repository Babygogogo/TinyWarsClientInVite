import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as DialoguesConstants from "../../../dialogues/Constants.ts";
import * as FogMapsConstants from "../../../fogMaps/Constants.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as ProtoSchemaCommonProtoWarEventWeaAddTileBuffExpr from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaAddTileBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaAddUnitBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitBuffSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimple from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaBigDialogueSimple from "../../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaDeleteTileBuffExpr from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaDeleteTileBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaDeleteUnitBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteUnitBuffSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaDestroyUnitExpr from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaDestroyUnitSimple from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedExpr from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedSimple from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapSimple from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaModifyTileBuffExpr from "../../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaModifyTileBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaModifyUnitBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaModifyUnitBuffSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaPersistentModifyPlayerAttribute from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyPlayerAttribute.ts";
import * as ProtoSchemaCommonProtoWarEventWeaPersistentModifyUnitAttribute from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyUnitAttribute.ts";
import * as ProtoSchemaCommonProtoWarEventWeaPersistentPlayBgm from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentPlayBgm.ts";
import * as ProtoSchemaCommonProtoWarEventWeaPersistentShowText from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentShowText.ts";
import * as ProtoSchemaCommonProtoWarEventWeaPlayBgm from "../../../proto/schema/CommonProto/WarEvent/WeaPlayBgm.ts";
import * as ProtoSchemaCommonProtoWarEventWeaPlaySfx from "../../../proto/schema/CommonProto/WarEvent/WeaPlaySfx.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetCustomCannonStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetCustomCannonStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetCustomCounters from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCounters.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetCustomLaserTurretStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomLaserTurretStateExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetCustomLaserTurretStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomLaserTurretStateSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetPlayerStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetPlayerStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetTaskObjectiveState from "../../../proto/schema/CommonProto/WarEvent/WeaSetTaskObjectiveState.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetTileStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetTileStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetTileTypeExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetTileTypeSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetUnitMovePathVisibility from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitMovePathVisibility.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetUnitPositionExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetUnitPositionSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetUnitStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetUnitStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetUnitTypeExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetUnitTypeSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetViewpointExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetViewpointExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetViewpointSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetViewpointSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetWeatherExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherExpr.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSetWeatherSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetWeatherSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForDialogue from "../../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForDialogue.ts";
import * as ProtoSchemaCommonProtoWarEventWeaStopPersistentAction from "../../../proto/schema/CommonProto/WarEvent/WeaStopPersistentAction.ts";
import * as SoundsConstants from "../../../sounds/Constants.ts";
import * as TileBuffsConstants from "../../../tileBuffs/Constants.ts";
import * as UnitBuffsConstants from "../../../unitBuffs/Constants.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarEventsActionsConstantsCommon from "../constants/Common.ts";
import * as WarEventsActionsUtilsAddTileBuffExpr from "./AddTileBuffExpr.ts";
import * as WarEventsActionsUtilsAddTileBuffSimple from "./AddTileBuffSimple.ts";
import * as WarEventsActionsUtilsAddUnitBuffSimple from "./AddUnitBuffSimple.ts";
import * as WarEventsActionsUtilsAddUnitOnMapSimple from "./AddUnitOnMapSimple.ts";
import * as WarEventsActionsUtilsBigDialogueSimple from "./BigDialogueSimple.ts";
import * as WarEventsActionsUtilsDeleteTileBuffExpr from "./DeleteTileBuffExpr.ts";
import * as WarEventsActionsUtilsDeleteTileBuffSimple from "./DeleteTileBuffSimple.ts";
import * as WarEventsActionsUtilsDeleteUnitBuffSimple from "./DeleteUnitBuffSimple.ts";
import * as WarEventsActionsUtilsDestroyUnitExpr from "./DestroyUnitExpr.ts";
import * as WarEventsActionsUtilsDestroyUnitSimple from "./DestroyUnitSimple.ts";
import * as WarEventsActionsUtilsFillUnitLoadedExpr from "./FillUnitLoadedExpr.ts";
import * as WarEventsActionsUtilsFillUnitLoadedSimple from "./FillUnitLoadedSimple.ts";
import * as WarEventsActionsUtilsFillUnitOnMapExpr from "./FillUnitOnMapExpr.ts";
import * as WarEventsActionsUtilsFillUnitOnMapSimple from "./FillUnitOnMapSimple.ts";
import * as WarEventsActionsUtilsModifyTileBuffExpr from "./ModifyTileBuffExpr.ts";
import * as WarEventsActionsUtilsModifyTileBuffSimple from "./ModifyTileBuffSimple.ts";
import * as WarEventsActionsUtilsModifyUnitBuffSimple from "./ModifyUnitBuffSimple.ts";
import * as WarEventsActionsUtilsPersistentModifyPlayerAttribute from "./PersistentModifyPlayerAttribute.ts";
import * as WarEventsActionsUtilsPersistentModifyUnitAttribute from "./PersistentModifyUnitAttribute.ts";
import * as WarEventsActionsUtilsPersistentPlayBgm from "./PersistentPlayBgm.ts";
import * as WarEventsActionsUtilsPersistentShowText from "./PersistentShowText.ts";
import * as WarEventsActionsUtilsPlayBgm from "./PlayBgm.ts";
import * as WarEventsActionsUtilsPlaySfx from "./PlaySfx.ts";
import * as WarEventsActionsUtilsSetCustomBuildingStateExpr from "./SetCustomBuildingStateExpr.ts";
import * as WarEventsActionsUtilsSetCustomBuildingStateSimple from "./SetCustomBuildingStateSimple.ts";
import * as WarEventsActionsUtilsSetCustomCannonStateExpr from "./SetCustomCannonStateExpr.ts";
import * as WarEventsActionsUtilsSetCustomCannonStateSimple from "./SetCustomCannonStateSimple.ts";
import * as WarEventsActionsUtilsSetCustomCounters from "./SetCustomCounters.ts";
import * as WarEventsActionsUtilsSetCustomCrystalStateExpr from "./SetCustomCrystalStateExpr.ts";
import * as WarEventsActionsUtilsSetCustomCrystalStateSimple from "./SetCustomCrystalStateSimple.ts";
import * as WarEventsActionsUtilsSetCustomLaserTurretStateExpr from "./SetCustomLaserTurretStateExpr.ts";
import * as WarEventsActionsUtilsSetCustomLaserTurretStateSimple from "./SetCustomLaserTurretStateSimple.ts";
import * as WarEventsActionsUtilsSetForceFogCodeExpr from "./SetForceFogCodeExpr.ts";
import * as WarEventsActionsUtilsSetForceFogCodeSimple from "./SetForceFogCodeSimple.ts";
import * as WarEventsActionsUtilsSetPlayerStateExpr from "./SetPlayerStateExpr.ts";
import * as WarEventsActionsUtilsSetPlayerStateSimple from "./SetPlayerStateSimple.ts";
import * as WarEventsActionsUtilsSetTaskObjectiveState from "./SetTaskObjectiveState.ts";
import * as WarEventsActionsUtilsSetTileStateExpr from "./SetTileStateExpr.ts";
import * as WarEventsActionsUtilsSetTileStateSimple from "./SetTileStateSimple.ts";
import * as WarEventsActionsUtilsSetTileTypeExpr from "./SetTileTypeExpr.ts";
import * as WarEventsActionsUtilsSetTileTypeSimple from "./SetTileTypeSimple.ts";
import * as WarEventsActionsUtilsSetUnitMovePathVisibility from "./SetUnitMovePathVisibility.ts";
import * as WarEventsActionsUtilsSetUnitOwnershipExpr from "./SetUnitOwnershipExpr.ts";
import * as WarEventsActionsUtilsSetUnitOwnershipSimple from "./SetUnitOwnershipSimple.ts";
import * as WarEventsActionsUtilsSetUnitPositionExpr from "./SetUnitPositionExpr.ts";
import * as WarEventsActionsUtilsSetUnitPositionSimple from "./SetUnitPositionSimple.ts";
import * as WarEventsActionsUtilsSetUnitStateExpr from "./SetUnitStateExpr.ts";
import * as WarEventsActionsUtilsSetUnitStateSimple from "./SetUnitStateSimple.ts";
import * as WarEventsActionsUtilsSetUnitTypeExpr from "./SetUnitTypeExpr.ts";
import * as WarEventsActionsUtilsSetUnitTypeSimple from "./SetUnitTypeSimple.ts";
import * as WarEventsActionsUtilsSetViewpointExpr from "./SetViewpointExpr.ts";
import * as WarEventsActionsUtilsSetViewpointSimple from "./SetViewpointSimple.ts";
import * as WarEventsActionsUtilsSetWeatherExpr from "./SetWeatherExpr.ts";
import * as WarEventsActionsUtilsSetWeatherSimple from "./SetWeatherSimple.ts";
import * as WarEventsActionsUtilsSmallDialogueSimple from "./SmallDialogueSimple.ts";
import * as WarEventsActionsUtilsStopPersistentAction from "./StopPersistentAction.ts";
import * as WarEventsConstants from "../../Constants.ts";
import * as WarEventsFullDatasUtils from "../../fullDatas/Utils.ts";

type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;

export function checkIsValidWarEventActionId(actionId: number): boolean {
    return (actionId > 0) && (actionId <= WarEventsActionsConstantsCommon.MaxCounts.PerMap);
}
export function checkIsValidWarEventActionIdSubset(actionIdArray: number[]): boolean {
    return (actionIdArray.length <= WarEventsActionsConstantsCommon.MaxCounts.PerMap)
        && (actionIdArray.length === new Set(actionIdArray).size)
        && (actionIdArray.every(v => checkIsValidWarEventActionId(v)));
}

export function checkIsValidBuffEndTimeModificationMode(mode: number): boolean {
    return WarEventsActionsConstantsCommon.AllBuffEndTimeModificationModeArray.includes(mode);
}

export function checkIsValidWarEventAction({ action, mapSize, gameConfig, playersCountUnneutral, customCounterNameSet }: {    // DONE
    action                  : ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;
    mapSize                 : AuxiliaryTypesMapSize.MapSize;
    gameConfig              : GameConfigGcData.GcData;
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
    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : weaCommonData?.getActionNameArray() ?? [],
        maxTextLength   : WarEventsConstants.Event.MaxNameLength,
        minTextLength   : 1,
        minTextCount    : 0,
    })) {
        return false;
    }

    // todo: add more checkers when the action types grow.
    return (WarEventsActionsUtilsAddUnitOnMapSimple.checkIsValid({ action: action.getWeaAddUnitOnMapSimple(), gameConfig, mapSize, playersCountUnneutral }))
        || (WarEventsActionsUtilsFillUnitOnMapExpr.checkIsValid(action.getWeaFillUnitOnMapExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsFillUnitOnMapSimple.checkIsValid(action.getWeaFillUnitOnMapSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsFillUnitLoadedSimple.checkIsValid(action.getWeaFillUnitLoadedSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsFillUnitLoadedExpr.checkIsValid(action.getWeaFillUnitLoadedExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsDestroyUnitSimple.checkIsValid(action.getWeaDestroyUnitSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsDestroyUnitExpr.checkIsValid(action.getWeaDestroyUnitExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitTypeSimple.checkIsValid(action.getWeaSetUnitTypeSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetUnitTypeExpr.checkIsValid(action.getWeaSetUnitTypeExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitOwnershipSimple.checkIsValid(action.getWeaSetUnitOwnershipSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetUnitOwnershipExpr.checkIsValid(action.getWeaSetUnitOwnershipExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitPositionSimple.checkIsValid(action.getWeaSetUnitPositionSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetUnitPositionExpr.checkIsValid(action.getWeaSetUnitPositionExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitStateSimple.checkIsValid(action.getWeaSetUnitStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetUnitStateExpr.checkIsValid(action.getWeaSetUnitStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsAddUnitBuffSimple.checkIsValid(action.getWeaAddUnitBuffSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsModifyUnitBuffSimple.checkIsValid(action.getWeaModifyUnitBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsDeleteUnitBuffSimple.checkIsValid(action.getWeaDeleteUnitBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsSetViewpointExpr.checkIsValid(action.getWeaSetViewpointExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetViewpointSimple.checkIsValid(action.getWeaSetViewpointSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetWeatherExpr.checkIsValid(action.getWeaSetWeatherExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetWeatherSimple.checkIsValid(action.getWeaSetWeatherSimple(), gameConfig))
        || (WarEventsActionsUtilsBigDialogueSimple.checkIsValid(action.getWeaBigDialogueSimple(), playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsSmallDialogueSimple.checkIsValid(action.getWeaSmallDialogueSimple(), playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsPlayBgm.checkIsValid(action.getWeaPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPlaySfx.checkIsValid(action.getWeaPlaySfx()))
        || (WarEventsActionsUtilsSetForceFogCodeExpr.checkIsValid(action.getWeaSetForceFogCodeExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetForceFogCodeSimple.checkIsValid(action.getWeaSetForceFogCodeSimple()))
        || (WarEventsActionsUtilsSetCustomCounters.checkIsValid(action.getWeaSetCustomCounters(), customCounterNameSet))
        || (WarEventsActionsUtilsStopPersistentAction.checkIsValid(action.getWeaStopPersistentAction()))
        || (WarEventsActionsUtilsSetPlayerStateExpr.checkIsValid(action.getWeaSetPlayerStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetPlayerStateSimple.checkIsValid(action.getWeaSetPlayerStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetTaskObjectiveState.checkIsValid(action.getWeaSetTaskObjectiveState(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitMovePathVisibility.checkIsValid(action.getWeaSetUnitMovePathVisibility(), customCounterNameSet))
        || (WarEventsActionsUtilsSetTileTypeExpr.checkIsValid(action.getWeaSetTileTypeExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetTileTypeSimple.checkIsValid(action.getWeaSetTileTypeSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetTileStateExpr.checkIsValid(action.getWeaSetTileStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetTileStateSimple.checkIsValid(action.getWeaSetTileStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetCustomBuildingStateExpr.checkIsValid(action.getWeaSetCustomBuildingStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetCustomBuildingStateSimple.checkIsValid(action.getWeaSetCustomBuildingStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetCustomCrystalStateExpr.checkIsValid(action.getWeaSetCustomCrystalStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetCustomCrystalStateSimple.checkIsValid(action.getWeaSetCustomCrystalStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetCustomCannonStateExpr.checkIsValid(action.getWeaSetCustomCannonStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetCustomCannonStateSimple.checkIsValid(action.getWeaSetCustomCannonStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateExpr.checkIsValid(action.getWeaSetCustomLaserTurretStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateSimple.checkIsValid(action.getWeaSetCustomLaserTurretStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsDeleteTileBuffExpr.checkIsValid(action.getWeaDeleteTileBuffExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsDeleteTileBuffSimple.checkIsValid(action.getWeaDeleteTileBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsAddTileBuffExpr.checkIsValid(action.getWeaAddTileBuffExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsAddTileBuffSimple.checkIsValid(action.getWeaAddTileBuffSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsModifyTileBuffExpr.checkIsValid(action.getWeaModifyTileBuffExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsModifyTileBuffSimple.checkIsValid(action.getWeaModifyTileBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsPersistentShowText.checkIsValid(action.getWeaPersistentShowText()))
        || (WarEventsActionsUtilsPersistentPlayBgm.checkIsValid(action.getWeaPersistentPlayBgm()))
        || (WarEventsActionsUtilsPersistentModifyPlayerAttribute.checkIsValid(action.getWeaPersistentModifyPlayerAttribute(), customCounterNameSet))
        || (WarEventsActionsUtilsPersistentModifyUnitAttribute.checkIsValid(action.getWeaPersistentModifyUnitAttribute(), customCounterNameSet));
}

export function checkIsPersistentAction(action: ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction): boolean {
    return (action.getWeaPersistentShowText() != null)
        || (action.getWeaPersistentPlayBgm() != null)
        || (action.getWeaPersistentModifyPlayerAttribute() != null)
        || (action.getWeaPersistentModifyUnitAttribute() != null);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function openActionModifyPanel(war: MapEditorInterfaceIMeWar.IMeWar, fullData: WarEventFullData, action: ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction): void {
    // todo: handle more action types.
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaAddUnitOnMapSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetViewpointExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetViewpointSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaBigDialogueSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSmallDialogueSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaPlayBgmPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaPlaySfxPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetWeatherExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetWeatherSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaFillUnitOnMapExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaFillUnitOnMapSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaFillUnitLoadedSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaFillUnitLoadedExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaDestroyUnitSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaDestroyUnitExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetUnitTypeSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetUnitTypeExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaAddUnitBuffSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaModifyUnitBuffSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaDeleteUnitBuffSimplePanel);

    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetUnitOwnershipSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetUnitOwnershipExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetUnitPositionSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetUnitPositionExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetUnitStateSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetUnitStateExprPanel);

    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetForceFogCodeExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetForceFogCodeSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaStopPersistentActionPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetCustomCountersPanel);

    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetPlayerStateExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetPlayerStateSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetTaskObjectiveStatePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetUnitMovePathVisibilityPanel);

    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetTileTypeExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetTileTypeSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetTileStateExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetTileStateSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetCustomBuildingStateExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetCustomBuildingStateSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetCustomCrystalStateExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetCustomCrystalStateSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetCustomCannonStateExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetCustomCannonStateSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetCustomLaserTurretStateExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaSetCustomLaserTurretStateSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaDeleteTileBuffExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaDeleteTileBuffSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaAddTileBuffExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaAddTileBuffSimplePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaModifyTileBuffExprPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaModifyTileBuffSimplePanel);

    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaPersistentShowTextPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaPersistentPlayBgmPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaPersistentModifyPlayerAttributePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeaPersistentModifyUnitAttributePanel);

    if      (action.getWeaAddUnitOnMapSimple())                         { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaAddUnitOnMapSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaSetViewpointExpr())                           { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetViewpointExprPanel,                               { war, fullData, action }); }
    else if (action.getWeaSetViewpointSimple())                         { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetViewpointSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaBigDialogueSimple())                          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaBigDialogueSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaSmallDialogueSimple())                        { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSmallDialogueSimplePanel,                            { war, fullData, action }); }
    else if (action.getWeaPlayBgm())                                    { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaPlayBgmPanel,                                        { war, fullData, action }); }
    else if (action.getWeaPlaySfx())                                    { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaPlaySfxPanel,                                        { war, fullData, action }); }
    else if (action.getWeaSetWeatherExpr())                             { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetWeatherExprPanel,                                 { war, fullData, action }); }
    else if (action.getWeaSetWeatherSimple())                           { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetWeatherSimplePanel,                               { war, fullData, action }); }
    else if (action.getWeaFillUnitOnMapExpr())                          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaFillUnitOnMapExprPanel,                              { war, fullData, action }); }
    else if (action.getWeaFillUnitOnMapSimple())                        { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaFillUnitOnMapSimplePanel,                            { war, fullData, action }); }
    else if (action.getWeaFillUnitLoadedSimple())                       { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaFillUnitLoadedSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaFillUnitLoadedExpr())                         { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaFillUnitLoadedExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaDestroyUnitSimple())                          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaDestroyUnitSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaDestroyUnitExpr())                            { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaDestroyUnitExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaSetUnitTypeSimple())                          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetUnitTypeSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaSetUnitTypeExpr())                            { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetUnitTypeExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaSetUnitOwnershipSimple())                     { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetUnitOwnershipSimplePanel,                         { war, fullData, action }); }
    else if (action.getWeaSetUnitOwnershipExpr())                       { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetUnitOwnershipExprPanel,                           { war, fullData, action }); }
    else if (action.getWeaSetUnitPositionSimple())                      { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetUnitPositionSimplePanel,                          { war, fullData, action }); }
    else if (action.getWeaSetUnitPositionExpr())                        { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetUnitPositionExprPanel,                            { war, fullData, action }); }
    else if (action.getWeaSetUnitStateSimple())                         { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetUnitStateSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaSetUnitStateExpr())                           { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetUnitStateExprPanel,                               { war, fullData, action }); }
    else if (action.getWeaAddUnitBuffSimple())                          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaAddUnitBuffSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaModifyUnitBuffSimple())                       { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaModifyUnitBuffSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaDeleteUnitBuffSimple())                       { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaDeleteUnitBuffSimplePanel,                           { war, fullData, action }); }

    else if (action.getWeaSetForceFogCodeExpr())                        { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetForceFogCodeExprPanel,                            { war, fullData, action }); }
    else if (action.getWeaSetForceFogCodeSimple())                      { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetForceFogCodeSimplePanel,                          { war, fullData, action }); }
    else if (action.getWeaStopPersistentAction())                       { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaStopPersistentActionPanel,                           { war, fullData, action }); }
    else if (action.getWeaSetCustomCounters())                          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetCustomCountersPanel,                              { war, fullData, action }); }

    else if (action.getWeaSetPlayerStateExpr())                         { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetPlayerStateExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaSetPlayerStateSimple())                       { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetPlayerStateSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaSetTaskObjectiveState())                      { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetTaskObjectiveStatePanel,                          { war, fullData, action }); }
    else if (action.getWeaSetUnitMovePathVisibility())                  { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetUnitMovePathVisibilityPanel,                      { war, fullData, action }); }

    else if (action.getWeaSetTileTypeExpr())                            { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetTileTypeExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaSetTileTypeSimple())                          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetTileTypeSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaSetTileStateExpr())                           { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetTileStateExprPanel,                               { war, fullData, action }); }
    else if (action.getWeaSetTileStateSimple())                         { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetTileStateSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaSetCustomBuildingStateExpr())                 { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetCustomBuildingStateExprPanel,                     { war, fullData, action }); }
    else if (action.getWeaSetCustomBuildingStateSimple())               { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetCustomBuildingStateSimplePanel,                   { war, fullData, action }); }
    else if (action.getWeaSetCustomCrystalStateExpr())                  { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetCustomCrystalStateExprPanel,                      { war, fullData, action }); }
    else if (action.getWeaSetCustomCrystalStateSimple())                { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetCustomCrystalStateSimplePanel,                    { war, fullData, action }); }
    else if (action.getWeaSetCustomCannonStateExpr())                   { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetCustomCannonStateExprPanel,                       { war, fullData, action }); }
    else if (action.getWeaSetCustomCannonStateSimple())                 { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetCustomCannonStateSimplePanel,                     { war, fullData, action }); }
    else if (action.getWeaSetCustomLaserTurretStateExpr())              { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetCustomLaserTurretStateExprPanel,                  { war, fullData, action }); }
    else if (action.getWeaSetCustomLaserTurretStateSimple())            { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaSetCustomLaserTurretStateSimplePanel,                { war, fullData, action }); }
    else if (action.getWeaDeleteTileBuffExpr())                         { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaDeleteTileBuffExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaDeleteTileBuffSimple())                       { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaDeleteTileBuffSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaAddTileBuffExpr())                            { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaAddTileBuffExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaAddTileBuffSimple())                          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaAddTileBuffSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaModifyTileBuffExpr())                         { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaModifyTileBuffExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaModifyTileBuffSimple())                       { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaModifyTileBuffSimplePanel,                           { war, fullData, action }); }

    else if (action.getWeaPersistentShowText())                         { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaPersistentShowTextPanel,                             { war, fullData, action }); }
    else if (action.getWeaPersistentPlayBgm())                          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaPersistentPlayBgmPanel,                              { war, fullData, action }); }
    else if (action.getWeaPersistentModifyPlayerAttribute())            { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaPersistentModifyPlayerAttributePanel,                { war, fullData, action }); }
    else if (action.getWeaPersistentModifyUnitAttribute())              { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeaPersistentModifyUnitAttributePanel,                  { war, fullData, action }); }

    else                                                                { throw HelpersMisc.newError(`Invalid action.`, UtilsClientErrorCode.ClientErrorCode.WarEventHelper_OpenActionModifyPanel_00); }
}

export function getBriefDescForAction(action: ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction, gameConfig: GameConfigGcData.GcData): string | null {
    // todo: add functions for other actions
    return (WarEventsActionsUtilsAddUnitOnMapSimple.getBriefDesc(action.getWeaAddUnitOnMapSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitOnMapExpr.getBriefDesc(action.getWeaFillUnitOnMapExpr()))
        || (WarEventsActionsUtilsFillUnitOnMapSimple.getBriefDesc(action.getWeaFillUnitOnMapSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitLoadedSimple.getBriefDesc(action.getWeaFillUnitLoadedSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitLoadedExpr.getBriefDesc(action.getWeaFillUnitLoadedExpr()))
        || (WarEventsActionsUtilsDestroyUnitSimple.getBriefDesc(action.getWeaDestroyUnitSimple()))
        || (WarEventsActionsUtilsDestroyUnitExpr.getBriefDesc(action.getWeaDestroyUnitExpr()))
        || (WarEventsActionsUtilsSetUnitTypeSimple.getBriefDesc(action.getWeaSetUnitTypeSimple(), gameConfig))
        || (WarEventsActionsUtilsSetUnitTypeExpr.getBriefDesc(action.getWeaSetUnitTypeExpr()))
        || (WarEventsActionsUtilsSetUnitOwnershipSimple.getBriefDesc(action.getWeaSetUnitOwnershipSimple()))
        || (WarEventsActionsUtilsSetUnitOwnershipExpr.getBriefDesc(action.getWeaSetUnitOwnershipExpr()))
        || (WarEventsActionsUtilsSetUnitPositionSimple.getBriefDesc(action.getWeaSetUnitPositionSimple()))
        || (WarEventsActionsUtilsSetUnitPositionExpr.getBriefDesc(action.getWeaSetUnitPositionExpr()))
        || (WarEventsActionsUtilsSetUnitStateSimple.getBriefDesc(action.getWeaSetUnitStateSimple()))
        || (WarEventsActionsUtilsSetUnitStateExpr.getBriefDesc(action.getWeaSetUnitStateExpr()))
        || (WarEventsActionsUtilsAddUnitBuffSimple.getBriefDesc(action.getWeaAddUnitBuffSimple()))
        || (WarEventsActionsUtilsModifyUnitBuffSimple.getBriefDesc(action.getWeaModifyUnitBuffSimple()))
        || (WarEventsActionsUtilsDeleteUnitBuffSimple.getBriefDesc(action.getWeaDeleteUnitBuffSimple()))
        || (WarEventsActionsUtilsSetViewpointExpr.getBriefDesc(action.getWeaSetViewpointExpr()))
        || (WarEventsActionsUtilsSetViewpointSimple.getBriefDesc(action.getWeaSetViewpointSimple()))
        || (WarEventsActionsUtilsSetWeatherExpr.getBriefDesc(action.getWeaSetWeatherExpr()))
        || (WarEventsActionsUtilsSetWeatherSimple.getBriefDesc(action.getWeaSetWeatherSimple(), gameConfig))
        || (WarEventsActionsUtilsBigDialogueSimple.getBriefDesc(action.getWeaBigDialogueSimple(), gameConfig))
        || (WarEventsActionsUtilsSmallDialogueSimple.getBriefDesc(action.getWeaSmallDialogueSimple(), gameConfig))
        || (WarEventsActionsUtilsPlayBgm.getBriefDesc(action.getWeaPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPlaySfx.getBriefDesc(action.getWeaPlaySfx(), gameConfig))
        || (WarEventsActionsUtilsSetForceFogCodeExpr.getBriefDesc(action.getWeaSetForceFogCodeExpr()))
        || (WarEventsActionsUtilsSetForceFogCodeSimple.getBriefDesc(action.getWeaSetForceFogCodeSimple()))
        || (WarEventsActionsUtilsSetCustomCounters.getBriefDesc(action.getWeaSetCustomCounters()))
        || (WarEventsActionsUtilsStopPersistentAction.getBriefDesc(action.getWeaStopPersistentAction()))
        || (WarEventsActionsUtilsSetPlayerStateExpr.getBriefDesc(action.getWeaSetPlayerStateExpr()))
        || (WarEventsActionsUtilsSetPlayerStateSimple.getBriefDesc(action.getWeaSetPlayerStateSimple()))
        || (WarEventsActionsUtilsSetTaskObjectiveState.getBriefDesc(action.getWeaSetTaskObjectiveState()))
        || (WarEventsActionsUtilsSetUnitMovePathVisibility.getBriefDesc(action.getWeaSetUnitMovePathVisibility()))
        || (WarEventsActionsUtilsSetTileTypeExpr.getBriefDesc(action.getWeaSetTileTypeExpr()))
        || (WarEventsActionsUtilsSetTileTypeSimple.getBriefDesc(action.getWeaSetTileTypeSimple()))
        || (WarEventsActionsUtilsSetTileStateExpr.getBriefDesc(action.getWeaSetTileStateExpr()))
        || (WarEventsActionsUtilsSetTileStateSimple.getBriefDesc(action.getWeaSetTileStateSimple()))
        || (WarEventsActionsUtilsSetCustomBuildingStateExpr.getBriefDesc(action.getWeaSetCustomBuildingStateExpr()))
        || (WarEventsActionsUtilsSetCustomBuildingStateSimple.getBriefDesc(action.getWeaSetCustomBuildingStateSimple()))
        || (WarEventsActionsUtilsSetCustomCrystalStateExpr.getBriefDesc(action.getWeaSetCustomCrystalStateExpr()))
        || (WarEventsActionsUtilsSetCustomCrystalStateSimple.getBriefDesc(action.getWeaSetCustomCrystalStateSimple()))
        || (WarEventsActionsUtilsSetCustomCannonStateExpr.getBriefDesc(action.getWeaSetCustomCannonStateExpr()))
        || (WarEventsActionsUtilsSetCustomCannonStateSimple.getBriefDesc(action.getWeaSetCustomCannonStateSimple()))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateExpr.getBriefDesc(action.getWeaSetCustomLaserTurretStateExpr()))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateSimple.getBriefDesc(action.getWeaSetCustomLaserTurretStateSimple()))
        || (WarEventsActionsUtilsDeleteTileBuffExpr.getBriefDesc(action.getWeaDeleteTileBuffExpr()))
        || (WarEventsActionsUtilsDeleteTileBuffSimple.getBriefDesc(action.getWeaDeleteTileBuffSimple()))
        || (WarEventsActionsUtilsAddTileBuffExpr.getBriefDesc(action.getWeaAddTileBuffExpr()))
        || (WarEventsActionsUtilsAddTileBuffSimple.getBriefDesc(action.getWeaAddTileBuffSimple()))
        || (WarEventsActionsUtilsModifyTileBuffExpr.getBriefDesc(action.getWeaModifyTileBuffExpr()))
        || (WarEventsActionsUtilsModifyTileBuffSimple.getBriefDesc(action.getWeaModifyTileBuffSimple()))
        || (WarEventsActionsUtilsPersistentShowText.getBriefDesc(action.getWeaPersistentShowText()))
        || (WarEventsActionsUtilsPersistentPlayBgm.getBriefDesc(action.getWeaPersistentPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPersistentModifyPlayerAttribute.getBriefDesc(action.getWeaPersistentModifyPlayerAttribute()))
        || (WarEventsActionsUtilsPersistentModifyUnitAttribute.getBriefDesc(action.getWeaPersistentModifyUnitAttribute()));
}
export function getDetailDescForAction(action: ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction, gameConfig: GameConfigGcData.GcData): string | null {
    // todo: add functions for other actions
    return (WarEventsActionsUtilsAddUnitOnMapSimple.getDetailDesc(action.getWeaAddUnitOnMapSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitOnMapExpr.getDetailDesc(action.getWeaFillUnitOnMapExpr()))
        || (WarEventsActionsUtilsFillUnitOnMapSimple.getDetailDesc(action.getWeaFillUnitOnMapSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitLoadedSimple.getDetailDesc(action.getWeaFillUnitLoadedSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitLoadedExpr.getDetailDesc(action.getWeaFillUnitLoadedExpr()))
        || (WarEventsActionsUtilsDestroyUnitSimple.getDetailDesc(action.getWeaDestroyUnitSimple()))
        || (WarEventsActionsUtilsDestroyUnitExpr.getDetailDesc(action.getWeaDestroyUnitExpr()))
        || (WarEventsActionsUtilsSetUnitTypeSimple.getDetailDesc(action.getWeaSetUnitTypeSimple(), gameConfig))
        || (WarEventsActionsUtilsSetUnitTypeExpr.getDetailDesc(action.getWeaSetUnitTypeExpr()))
        || (WarEventsActionsUtilsSetUnitOwnershipSimple.getDetailDesc(action.getWeaSetUnitOwnershipSimple()))
        || (WarEventsActionsUtilsSetUnitOwnershipExpr.getDetailDesc(action.getWeaSetUnitOwnershipExpr()))
        || (WarEventsActionsUtilsSetUnitPositionSimple.getDetailDesc(action.getWeaSetUnitPositionSimple()))
        || (WarEventsActionsUtilsSetUnitPositionExpr.getDetailDesc(action.getWeaSetUnitPositionExpr()))
        || (WarEventsActionsUtilsSetUnitStateSimple.getDetailDesc(action.getWeaSetUnitStateSimple()))
        || (WarEventsActionsUtilsSetUnitStateExpr.getDetailDesc(action.getWeaSetUnitStateExpr()))
        || (WarEventsActionsUtilsAddUnitBuffSimple.getDetailDesc(action.getWeaAddUnitBuffSimple()))
        || (WarEventsActionsUtilsModifyUnitBuffSimple.getDetailDesc(action.getWeaModifyUnitBuffSimple()))
        || (WarEventsActionsUtilsDeleteUnitBuffSimple.getDetailDesc(action.getWeaDeleteUnitBuffSimple()))
        || (WarEventsActionsUtilsSetViewpointExpr.getDetailDesc(action.getWeaSetViewpointExpr()))
        || (WarEventsActionsUtilsSetViewpointSimple.getDetailDesc(action.getWeaSetViewpointSimple()))
        || (WarEventsActionsUtilsSetWeatherExpr.getDetailDesc(action.getWeaSetWeatherExpr()))
        || (WarEventsActionsUtilsSetWeatherSimple.getDetailDesc(action.getWeaSetWeatherSimple(), gameConfig))
        || (WarEventsActionsUtilsBigDialogueSimple.getDetailDesc(action.getWeaBigDialogueSimple(), gameConfig))
        || (WarEventsActionsUtilsSmallDialogueSimple.getDetailDesc(action.getWeaSmallDialogueSimple(), gameConfig))
        || (WarEventsActionsUtilsPlayBgm.getDetailDesc(action.getWeaPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPlaySfx.getDetailDesc(action.getWeaPlaySfx(), gameConfig))
        || (WarEventsActionsUtilsSetForceFogCodeExpr.getDetailDesc(action.getWeaSetForceFogCodeExpr()))
        || (WarEventsActionsUtilsSetForceFogCodeSimple.getDetailDesc(action.getWeaSetForceFogCodeSimple()))
        || (WarEventsActionsUtilsSetCustomCounters.getDetailDesc(action.getWeaSetCustomCounters()))
        || (WarEventsActionsUtilsStopPersistentAction.getDetailDesc(action.getWeaStopPersistentAction()))
        || (WarEventsActionsUtilsSetPlayerStateExpr.getDetailDesc(action.getWeaSetPlayerStateExpr()))
        || (WarEventsActionsUtilsSetPlayerStateSimple.getDetailDesc(action.getWeaSetPlayerStateSimple()))
        || (WarEventsActionsUtilsSetTaskObjectiveState.getDetailDesc(action.getWeaSetTaskObjectiveState()))
        || (WarEventsActionsUtilsSetUnitMovePathVisibility.getDetailDesc(action.getWeaSetUnitMovePathVisibility()))
        || (WarEventsActionsUtilsSetTileTypeExpr.getDetailDesc(action.getWeaSetTileTypeExpr()))
        || (WarEventsActionsUtilsSetTileTypeSimple.getDetailDesc(action.getWeaSetTileTypeSimple()))
        || (WarEventsActionsUtilsSetTileStateExpr.getDetailDesc(action.getWeaSetTileStateExpr()))
        || (WarEventsActionsUtilsSetTileStateSimple.getDetailDesc(action.getWeaSetTileStateSimple()))
        || (WarEventsActionsUtilsSetCustomBuildingStateExpr.getDetailDesc(action.getWeaSetCustomBuildingStateExpr()))
        || (WarEventsActionsUtilsSetCustomBuildingStateSimple.getDetailDesc(action.getWeaSetCustomBuildingStateSimple()))
        || (WarEventsActionsUtilsSetCustomCrystalStateExpr.getDetailDesc(action.getWeaSetCustomCrystalStateExpr()))
        || (WarEventsActionsUtilsSetCustomCrystalStateSimple.getDetailDesc(action.getWeaSetCustomCrystalStateSimple()))
        || (WarEventsActionsUtilsSetCustomCannonStateExpr.getDetailDesc(action.getWeaSetCustomCannonStateExpr()))
        || (WarEventsActionsUtilsSetCustomCannonStateSimple.getDetailDesc(action.getWeaSetCustomCannonStateSimple()))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateExpr.getDetailDesc(action.getWeaSetCustomLaserTurretStateExpr()))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateSimple.getDetailDesc(action.getWeaSetCustomLaserTurretStateSimple()))
        || (WarEventsActionsUtilsDeleteTileBuffExpr.getDetailDesc(action.getWeaDeleteTileBuffExpr()))
        || (WarEventsActionsUtilsDeleteTileBuffSimple.getDetailDesc(action.getWeaDeleteTileBuffSimple()))
        || (WarEventsActionsUtilsAddTileBuffExpr.getDetailDesc(action.getWeaAddTileBuffExpr()))
        || (WarEventsActionsUtilsAddTileBuffSimple.getDetailDesc(action.getWeaAddTileBuffSimple()))
        || (WarEventsActionsUtilsModifyTileBuffExpr.getDetailDesc(action.getWeaModifyTileBuffExpr()))
        || (WarEventsActionsUtilsModifyTileBuffSimple.getDetailDesc(action.getWeaModifyTileBuffSimple()))
        || (WarEventsActionsUtilsPersistentShowText.getDetailDesc(action.getWeaPersistentShowText()))
        || (WarEventsActionsUtilsPersistentPlayBgm.getDetailDesc(action.getWeaPersistentPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPersistentModifyPlayerAttribute.getDetailDesc(action.getWeaPersistentModifyPlayerAttribute()))
        || (WarEventsActionsUtilsPersistentModifyUnitAttribute.getDetailDesc(action.getWeaPersistentModifyUnitAttribute()));
}

export function getErrorTipForAction(fullData: WarEventFullData, action: ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction, war: BaseWarInterfaceIBwWar.IBwWar): string | null {
    const actionsCountTotal = fullData.getActionArray().length;
    if (actionsCountTotal > WarEventsActionsConstantsCommon.MaxCounts.PerMap) {
        return `${LangUtils.getText(LangConstants.TextType.A0184)} (${actionsCountTotal}/${WarEventsActionsConstantsCommon.MaxCounts.PerMap})`;
    }

    // if (Object.keys(action.toJson()).length !== 2) {
    //     return Lang.getText(LangTextType.A0177);
    // }

    const actionId = action.getWeaCommonData()?.getActionId();
    if ((actionId == null) || (!checkIsValidWarEventActionId(actionId))) {
        return LangUtils.getText(LangConstants.TextType.A0177);
    }

    const playersCountUnneutral = war.getPlayersCountUnneutral();
    const gameConfig            = war.getGcData();
    const mapSize               = war.getTileMap().getMapSize();
    const customCounterNameSet  = new Set(fullData.getCustomCounterNameArray().map(v => v.getName() ?? ``));

    // todo: add more tips for the future actions.
    const weaAddUnitOnMapSimple = action.getWeaAddUnitOnMapSimple();
    if (weaAddUnitOnMapSimple) {
        return WarEventsActionsUtilsAddUnitOnMapSimple.getErrorTip(weaAddUnitOnMapSimple, war);
    }

    const weaFillUnitOnMapExpr = action.getWeaFillUnitOnMapExpr();
    if (weaFillUnitOnMapExpr) {
        return WarEventsActionsUtilsFillUnitOnMapExpr.getErrorTip(weaFillUnitOnMapExpr, customCounterNameSet);
    }

    const weaFillUnitOnMapSimple = action.getWeaFillUnitOnMapSimple();
    if (weaFillUnitOnMapSimple) {
        return WarEventsActionsUtilsFillUnitOnMapSimple.getErrorTip(weaFillUnitOnMapSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaFillUnitLoadedSimple = action.getWeaFillUnitLoadedSimple();
    if (weaFillUnitLoadedSimple) {
        return WarEventsActionsUtilsFillUnitLoadedSimple.getErrorTip(weaFillUnitLoadedSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaFillUnitLoadedExpr = action.getWeaFillUnitLoadedExpr();
    if (weaFillUnitLoadedExpr) {
        return WarEventsActionsUtilsFillUnitLoadedExpr.getErrorTip(weaFillUnitLoadedExpr, customCounterNameSet);
    }

    const weaDestroyUnitSimple = action.getWeaDestroyUnitSimple();
    if (weaDestroyUnitSimple) {
        return WarEventsActionsUtilsDestroyUnitSimple.getErrorTip(weaDestroyUnitSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDestroyUnitExpr = action.getWeaDestroyUnitExpr();
    if (weaDestroyUnitExpr) {
        return WarEventsActionsUtilsDestroyUnitExpr.getErrorTip(weaDestroyUnitExpr, customCounterNameSet);
    }

    const weaSetUnitTypeSimple = action.getWeaSetUnitTypeSimple();
    if (weaSetUnitTypeSimple) {
        return WarEventsActionsUtilsSetUnitTypeSimple.getErrorTip(weaSetUnitTypeSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitTypeExpr = action.getWeaSetUnitTypeExpr();
    if (weaSetUnitTypeExpr) {
        return WarEventsActionsUtilsSetUnitTypeExpr.getErrorTip(weaSetUnitTypeExpr, customCounterNameSet);
    }

    const weaSetUnitOwnershipSimple = action.getWeaSetUnitOwnershipSimple();
    if (weaSetUnitOwnershipSimple) {
        return WarEventsActionsUtilsSetUnitOwnershipSimple.getErrorTip(weaSetUnitOwnershipSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitOwnershipExpr = action.getWeaSetUnitOwnershipExpr();
    if (weaSetUnitOwnershipExpr) {
        return WarEventsActionsUtilsSetUnitOwnershipExpr.getErrorTip(weaSetUnitOwnershipExpr, customCounterNameSet);
    }

    const weaSetUnitPositionSimple = action.getWeaSetUnitPositionSimple();
    if (weaSetUnitPositionSimple) {
        return WarEventsActionsUtilsSetUnitPositionSimple.getErrorTip(weaSetUnitPositionSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitPositionExpr = action.getWeaSetUnitPositionExpr();
    if (weaSetUnitPositionExpr) {
        return WarEventsActionsUtilsSetUnitPositionExpr.getErrorTip(weaSetUnitPositionExpr, customCounterNameSet);
    }

    const weaSetUnitStateSimple = action.getWeaSetUnitStateSimple();
    if (weaSetUnitStateSimple) {
        return WarEventsActionsUtilsSetUnitStateSimple.getErrorTip(weaSetUnitStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitStateExpr = action.getWeaSetUnitStateExpr();
    if (weaSetUnitStateExpr) {
        return WarEventsActionsUtilsSetUnitStateExpr.getErrorTip(weaSetUnitStateExpr, customCounterNameSet);
    }

    const weaAddUnitBuffSimple = action.getWeaAddUnitBuffSimple();
    if (weaAddUnitBuffSimple) {
        return WarEventsActionsUtilsAddUnitBuffSimple.getErrorTip(weaAddUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaModifyUnitBuffSimple = action.getWeaModifyUnitBuffSimple();
    if (weaModifyUnitBuffSimple) {
        return WarEventsActionsUtilsModifyUnitBuffSimple.getErrorTip(weaModifyUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDeleteUnitBuffSimple = action.getWeaDeleteUnitBuffSimple();
    if (weaDeleteUnitBuffSimple) {
        return WarEventsActionsUtilsDeleteUnitBuffSimple.getErrorTip(weaDeleteUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetViewpointExpr = action.getWeaSetViewpointExpr();
    if (weaSetViewpointExpr) {
        return WarEventsActionsUtilsSetViewpointExpr.getErrorTip(weaSetViewpointExpr, customCounterNameSet);
    }

    const weaSetViewpointSimple = action.getWeaSetViewpointSimple();
    if (weaSetViewpointSimple) {
        return WarEventsActionsUtilsSetViewpointSimple.getErrorTip(weaSetViewpointSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetWeatherExpr = action.getWeaSetWeatherExpr();
    if (weaSetWeatherExpr) {
        return WarEventsActionsUtilsSetWeatherExpr.getErrorTip(weaSetWeatherExpr, customCounterNameSet);
    }

    const weaSetWeatherSimple = action.getWeaSetWeatherSimple();
    if (weaSetWeatherSimple) {
        return WarEventsActionsUtilsSetWeatherSimple.getErrorTip(weaSetWeatherSimple, gameConfig);
    }

    const weaBigDialogueSimple = action.getWeaBigDialogueSimple();
    if (weaBigDialogueSimple) {
        return WarEventsActionsUtilsBigDialogueSimple.getErrorTip(weaBigDialogueSimple, playersCountUnneutral, gameConfig);
    }

    const weaSmallDialogueSimple = action.getWeaSmallDialogueSimple();
    if (weaSmallDialogueSimple) {
        return WarEventsActionsUtilsSmallDialogueSimple.getErrorTip(weaSmallDialogueSimple, playersCountUnneutral, gameConfig);
    }

    const weaPlayBgm = action.getWeaPlayBgm();
    if (weaPlayBgm) {
        return WarEventsActionsUtilsPlayBgm.getErrorTip(weaPlayBgm);
    }

    const weaPlaySfx = action.getWeaPlaySfx();
    if (weaPlaySfx) {
        return WarEventsActionsUtilsPlaySfx.getErrorTip(weaPlaySfx);
    }

    const weaSetForceFogCodeExpr = action.getWeaSetForceFogCodeExpr();
    if (weaSetForceFogCodeExpr) {
        return WarEventsActionsUtilsSetForceFogCodeExpr.getErrorTip(weaSetForceFogCodeExpr, customCounterNameSet);
    }

    const weaSetForceFogCodeSimple = action.getWeaSetForceFogCodeSimple();
    if (weaSetForceFogCodeSimple) {
        return WarEventsActionsUtilsSetForceFogCodeSimple.getErrorTip(weaSetForceFogCodeSimple);
    }

    const weaSetCustomCounters = action.getWeaSetCustomCounters();
    if (weaSetCustomCounters) {
        return WarEventsActionsUtilsSetCustomCounters.getErrorTip(weaSetCustomCounters, customCounterNameSet);
    }

    const weaStopPersistentAction = action.getWeaStopPersistentAction();
    if (weaStopPersistentAction) {
        return WarEventsActionsUtilsStopPersistentAction.getErrorTip(weaStopPersistentAction, fullData);
    }

    const weaSetPlayerStateExpr = action.getWeaSetPlayerStateExpr();
    if (weaSetPlayerStateExpr) {
        return WarEventsActionsUtilsSetPlayerStateExpr.getErrorTip(weaSetPlayerStateExpr, customCounterNameSet);
    }

    const weaSetPlayerStateSimple = action.getWeaSetPlayerStateSimple();
    if (weaSetPlayerStateSimple) {
        return WarEventsActionsUtilsSetPlayerStateSimple.getErrorTip(weaSetPlayerStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetTaskObjectiveState = action.getWeaSetTaskObjectiveState();
    if (weaSetTaskObjectiveState) {
        return WarEventsActionsUtilsSetTaskObjectiveState.getErrorTip(weaSetTaskObjectiveState, customCounterNameSet);
    }

    const weaSetUnitMovePathVisibility = action.getWeaSetUnitMovePathVisibility();
    if (weaSetUnitMovePathVisibility) {
        return WarEventsActionsUtilsSetUnitMovePathVisibility.getErrorTip(weaSetUnitMovePathVisibility, customCounterNameSet);
    }

    const weaSetTileTypeExpr = action.getWeaSetTileTypeExpr();
    if (weaSetTileTypeExpr) {
        return WarEventsActionsUtilsSetTileTypeExpr.getErrorTip(weaSetTileTypeExpr, customCounterNameSet);
    }

    const weaSetTileTypeSimple = action.getWeaSetTileTypeSimple();
    if (weaSetTileTypeSimple) {
        return WarEventsActionsUtilsSetTileTypeSimple.getErrorTip(weaSetTileTypeSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetTileStateExpr = action.getWeaSetTileStateExpr();
    if (weaSetTileStateExpr) {
        return WarEventsActionsUtilsSetTileStateExpr.getErrorTip(weaSetTileStateExpr, customCounterNameSet);
    }

    const weaSetTileStateSimple = action.getWeaSetTileStateSimple();
    if (weaSetTileStateSimple) {
        return WarEventsActionsUtilsSetTileStateSimple.getErrorTip(weaSetTileStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomBuildingStateExpr = action.getWeaSetCustomBuildingStateExpr();
    if (weaSetCustomBuildingStateExpr) {
        return WarEventsActionsUtilsSetCustomBuildingStateExpr.getErrorTip(weaSetCustomBuildingStateExpr, customCounterNameSet);
    }

    const weaSetCustomBuildingStateSimple = action.getWeaSetCustomBuildingStateSimple();
    if (weaSetCustomBuildingStateSimple) {
        return WarEventsActionsUtilsSetCustomBuildingStateSimple.getErrorTip(weaSetCustomBuildingStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomCrystalStateExpr = action.getWeaSetCustomCrystalStateExpr();
    if (weaSetCustomCrystalStateExpr) {
        return WarEventsActionsUtilsSetCustomCrystalStateExpr.getErrorTip(weaSetCustomCrystalStateExpr, customCounterNameSet);
    }

    const weaSetCustomCrystalStateSimple = action.getWeaSetCustomCrystalStateSimple();
    if (weaSetCustomCrystalStateSimple) {
        return WarEventsActionsUtilsSetCustomCrystalStateSimple.getErrorTip(weaSetCustomCrystalStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomCannonStateExpr = action.getWeaSetCustomCannonStateExpr();
    if (weaSetCustomCannonStateExpr) {
        return WarEventsActionsUtilsSetCustomCannonStateExpr.getErrorTip(weaSetCustomCannonStateExpr, customCounterNameSet);
    }

    const weaSetCustomCannonStateSimple = action.getWeaSetCustomCannonStateSimple();
    if (weaSetCustomCannonStateSimple) {
        return WarEventsActionsUtilsSetCustomCannonStateSimple.getErrorTip(weaSetCustomCannonStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomLaserTurretStateExpr = action.getWeaSetCustomLaserTurretStateExpr();
    if (weaSetCustomLaserTurretStateExpr) {
        return WarEventsActionsUtilsSetCustomLaserTurretStateExpr.getErrorTip(weaSetCustomLaserTurretStateExpr, customCounterNameSet);
    }

    const weaSetCustomLaserTurretStateSimple = action.getWeaSetCustomLaserTurretStateSimple();
    if (weaSetCustomLaserTurretStateSimple) {
        return WarEventsActionsUtilsSetCustomLaserTurretStateSimple.getErrorTip(weaSetCustomLaserTurretStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDeleteTileBuffExpr = action.getWeaDeleteTileBuffExpr();
    if (weaDeleteTileBuffExpr) {
        return WarEventsActionsUtilsDeleteTileBuffExpr.getErrorTip(weaDeleteTileBuffExpr, customCounterNameSet);
    }

    const weaDeleteTileBuffSimple = action.getWeaDeleteTileBuffSimple();
    if (weaDeleteTileBuffSimple) {
        return WarEventsActionsUtilsDeleteTileBuffSimple.getErrorTip(weaDeleteTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaAddTileBuffExpr = action.getWeaAddTileBuffExpr();
    if (weaAddTileBuffExpr) {
        return WarEventsActionsUtilsAddTileBuffExpr.getErrorTip(weaAddTileBuffExpr, customCounterNameSet);
    }

    const weaAddTileBuffSimple = action.getWeaAddTileBuffSimple();
    if (weaAddTileBuffSimple) {
        return WarEventsActionsUtilsAddTileBuffSimple.getErrorTip(weaAddTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaModifyTileBuffExpr = action.getWeaModifyTileBuffExpr();
    if (weaModifyTileBuffExpr) {
        return WarEventsActionsUtilsModifyTileBuffExpr.getErrorTip(weaModifyTileBuffExpr, customCounterNameSet);
    }

    const weaModifyTileBuffSimple = action.getWeaModifyTileBuffSimple();
    if (weaModifyTileBuffSimple) {
        return WarEventsActionsUtilsModifyTileBuffSimple.getErrorTip(weaModifyTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaPersistentShowText = action.getWeaPersistentShowText();
    if (weaPersistentShowText) {
        return WarEventsActionsUtilsPersistentShowText.getErrorTip(weaPersistentShowText);
    }

    const weaPersistentPlayBgm = action.getWeaPersistentPlayBgm();
    if (weaPersistentPlayBgm) {
        return WarEventsActionsUtilsPersistentPlayBgm.getErrorTip(weaPersistentPlayBgm);
    }

    const weaPersistentModifyPlayerAttribute = action.getWeaPersistentModifyPlayerAttribute();
    if (weaPersistentModifyPlayerAttribute) {
        return WarEventsActionsUtilsPersistentModifyPlayerAttribute.getErrorTip(weaPersistentModifyPlayerAttribute, customCounterNameSet);
    }

    const weaPersistentModifyUnitAttribute = action.getWeaPersistentModifyUnitAttribute();
    if (weaPersistentModifyUnitAttribute) {
        return WarEventsActionsUtilsPersistentModifyUnitAttribute.getErrorTip(weaPersistentModifyUnitAttribute, customCounterNameSet);
    }

    return LangUtils.getText(LangConstants.TextType.A0177);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function addDefaultAction({ fullData, eventId, nodeId, actionIndex }: {
    fullData        : WarEventFullData;
    eventId         : number;
    nodeId          : number;
    actionIndex     : number | null;
}): number | null {   // DONE
    const actionIdArray = WarEventsFullDatasUtils.getEvent(fullData, eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getActionIdArray();
    if (actionIdArray == null) {
        return null;
    }

    const actionArray = fullData.getActionArray();
    for (let actionId = 1; ; ++actionId) {
        if (!actionArray.some(v => v.getWeaCommonData()?.getActionId() === actionId)) {
            actionArray.push(ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction.fromJson({
                WeaCommonData: {
                    actionId        : actionId,
                    actionNameArray : [],
                },
                WeaAddUnitOnMapSimple: {
                    unitArray   : [],
                },
            }));
            actionArray.sort((v1, v2) => HelpersMisc.getExisted(v1.getWeaCommonData()?.getActionId()) - HelpersMisc.getExisted(v2.getWeaCommonData()?.getActionId()));

            if (actionIndex == null) {
                actionIdArray.push(actionId);
            } else {
                actionIdArray.splice(Math.min(actionIndex, actionIdArray.length), 0, actionId);
            }

            return actionId;
        }
    }
}

export function getDefaultSimpleCoDialogueData(): ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForDialogue.DataForDialogue {
    return ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForDialogue.DataForDialogue.fromJson({
        dataForCoDialogue: {
            coId        : null,
            playerIndex : PlayersConstants.PlayerIndex.First,
            side        : DialoguesConstants.SmallDialogueSideId.Bottom,
            nameArray   : [],
            textArray   : [
                { languageType: LangUtils.getCurrentLanguageType(), text: `...` },
            ],
        },
    });
}

export function cloneAction(fullData: WarEventFullData, srcActionId: number): number {
    const actionArray   = fullData.getActionArray();
    const newAction     = HelpersMisc.getExisted(actionArray.find(v => v.getWeaCommonData()?.getActionId() === srcActionId)).clone();
    actionArray.push(newAction);

    for (let actionId = 1; ; ++actionId) {
        if (actionArray.some(v => v.getWeaCommonData()?.getActionId() === actionId)) {
            continue;
        }

        HelpersMisc.getExisted(newAction.getWeaCommonData()).setActionId(actionId);
        actionArray.sort((v1, v2) => HelpersMisc.getExisted(v1.getWeaCommonData()?.getActionId()) - HelpersMisc.getExisted(v2.getWeaCommonData()?.getActionId()));
        return actionId;
    }
}

export function resetAction(action: ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction, actionType: WarEventsActionsConstantsCommon.ActionTypeId, gameConfig: GameConfigGcData.GcData): void {
    action.clearActionData();

    // todo handle future actions.
    if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.AddUnitOnMapSimple) {
        action.setWeaAddUnitOnMapSimple(ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimple.WeaAddUnitOnMapSimple.fromJson({
            unitArray   : [],
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.FillUnitOnMapExpr) {
        action.setWeaFillUnitOnMapExpr(ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr.fromJson({
            conTileFilter                       : ``,
            actPlayerIndex                      : ``,
            actUnitType                         : ``,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.FillUnitOnMapSimple) {
        const unitData = UnitsUtilsSerialization.createDefault({
            unitTypeId  : UnitsConstants.UnitTypeId.First,
            playerIndex : PlayersConstants.PlayerIndex.First,
            gridIndex   : { x: 0, y: 0 },
            unitId      : -1,
            gcData      : gameConfig,
        });
        unitData.setGridIndex(null);
        action.setWeaFillUnitOnMapSimple(ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapSimple.WeaFillUnitOnMapSimple.fromJson({
            actUnitData : unitData.toJson(),
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.FillUnitLoadedSimple) {
        const unitData = UnitsUtilsSerialization.createDefault({
            unitTypeId  : UnitsConstants.UnitTypeId.First,
            playerIndex : PlayersConstants.PlayerIndex.First,
            gridIndex   : { x: 0, y: 0 },
            unitId      : -1,
            gcData      : gameConfig,
        });
        unitData.setGridIndex(null);
        action.setWeaFillUnitLoadedSimple(ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedSimple.WeaFillUnitLoadedSimple.fromJson({
            actLoadCount    : 1,
            actUnitData : unitData.toJson(),
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.FillUnitLoadedExpr) {
        action.setWeaFillUnitLoadedExpr(ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedExpr.WeaFillUnitLoadedExpr.fromJson({
            conUnitFilter                       : ``,
            actUnitType                         : ``,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.DestroyUnitSimple) {
        action.setWeaDestroyUnitSimple(ProtoSchemaCommonProtoWarEventWeaDestroyUnitSimple.WeaDestroyUnitSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.DestroyUnitExpr) {
        action.setWeaDestroyUnitExpr(ProtoSchemaCommonProtoWarEventWeaDestroyUnitExpr.WeaDestroyUnitExpr.fromJson({
            conUnitFilter                       : ``,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetUnitTypeSimple) {
        action.setWeaSetUnitTypeSimple(ProtoSchemaCommonProtoWarEventWeaSetUnitTypeSimple.WeaSetUnitTypeSimple.fromJson({
            actUnitType                         : UnitsConstants.UnitTypeId.First,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetUnitTypeExpr) {
        action.setWeaSetUnitTypeExpr(ProtoSchemaCommonProtoWarEventWeaSetUnitTypeExpr.WeaSetUnitTypeExpr.fromJson({
            conUnitFilter                       : ``,
            actUnitType                         : ``,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetUnitOwnershipSimple) {
        action.setWeaSetUnitOwnershipSimple(ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipSimple.WeaSetUnitOwnershipSimple.fromJson({
            actPlayerIndex                      : PlayersConstants.PlayerIndex.First,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetUnitOwnershipExpr) {
        action.setWeaSetUnitOwnershipExpr(ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipExpr.WeaSetUnitOwnershipExpr.fromJson({
            conUnitFilter                       : ``,
            actPlayerIndex                      : ``,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetUnitPositionSimple) {
        action.setWeaSetUnitPositionSimple(ProtoSchemaCommonProtoWarEventWeaSetUnitPositionSimple.WeaSetUnitPositionSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetUnitPositionExpr) {
        action.setWeaSetUnitPositionExpr(ProtoSchemaCommonProtoWarEventWeaSetUnitPositionExpr.WeaSetUnitPositionExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetUnitStateSimple) {
        action.setWeaSetUnitStateSimple(ProtoSchemaCommonProtoWarEventWeaSetUnitStateSimple.WeaSetUnitStateSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetUnitStateExpr) {
        action.setWeaSetUnitStateExpr(ProtoSchemaCommonProtoWarEventWeaSetUnitStateExpr.WeaSetUnitStateExpr.fromJson({
            conUnitFilter                       : ``,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.AddUnitBuffSimple) {
        action.setWeaAddUnitBuffSimple(ProtoSchemaCommonProtoWarEventWeaAddUnitBuffSimple.WeaAddUnitBuffSimple.fromJson({
            actBuffType     : UnitBuffsConstants.BuffTypeId.Fire,
            actExtraParams  : [],
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.ModifyUnitBuffSimple) {
        action.setWeaModifyUnitBuffSimple(ProtoSchemaCommonProtoWarEventWeaModifyUnitBuffSimple.WeaModifyUnitBuffSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.DeleteUnitBuffSimple) {
        action.setWeaDeleteUnitBuffSimple(ProtoSchemaCommonProtoWarEventWeaDeleteUnitBuffSimple.WeaDeleteUnitBuffSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetViewpointExpr) {
        action.setWeaSetViewpointExpr(ProtoSchemaCommonProtoWarEventWeaSetViewpointExpr.WeaSetViewpointExpr.fromJson({
            targets         : ``,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetViewpointSimple) {
        action.setWeaSetViewpointSimple(ProtoSchemaCommonProtoWarEventWeaSetViewpointSimple.WeaSetViewpointSimple.fromJson({
            actNeedFocusEffect  : true,
            actIsOneByOne       : true,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetWeatherSimple) {
        action.setWeaSetWeatherSimple(ProtoSchemaCommonProtoWarEventWeaSetWeatherSimple.WeaSetWeatherSimple.fromJson({
            weatherType         : gameConfig.getDefaultWeatherType(),
            weatherTurnsCount   : 0,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetWeatherExpr) {
        action.setWeaSetWeatherExpr(ProtoSchemaCommonProtoWarEventWeaSetWeatherExpr.WeaSetWeatherExpr.fromJson({
            weatherType         : "",
            weatherTurnsCount   : "",
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.BigDialogueSimple) {
        action.setWeaBigDialogueSimple(ProtoSchemaCommonProtoWarEventWeaBigDialogueSimple.WeaBigDialogueSimple.fromJson({
            backgroundId    : 0,
            dataArray       : [],
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SmallDialogueSimple) {
        action.setWeaSmallDialogueSimple(ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimple.WeaSmallDialogueSimple.fromJson({
            dataArray       : [],
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.PlayBgm) {
        action.setWeaPlayBgm(ProtoSchemaCommonProtoWarEventWeaPlayBgm.WeaPlayBgm.fromJson({
            useCoBgm        : false,
            bgmCode         : SoundsConstants.BgmSfxCode.None,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.PlaySfx) {
        action.setWeaPlaySfx(ProtoSchemaCommonProtoWarEventWeaPlaySfx.WeaPlaySfx.fromJson({
            sfxCode         : SoundsConstants.BgmSfxCode.None,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetForceFogCodeExpr) {
        action.setWeaSetForceFogCodeExpr(ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeExpr.WeaSetForceFogCodeExpr.fromJson({
            forceFogCode    : ``,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetForceFogCodeSimple) {
        action.setWeaSetForceFogCodeSimple(ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeSimple.WeaSetForceFogCodeSimple.fromJson({
            forceFogCode    : FogMapsConstants.ForcedFogCode.Fog,
            turnsCount      : 0,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCounters) {
        action.setWeaSetCustomCounters(ProtoSchemaCommonProtoWarEventWeaSetCustomCounters.WeaSetCustomCounters.fromJson({
            idExpression            : "",
            valueExpression         : "",
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.StopPersistentAction) {
        action.setWeaStopPersistentAction(ProtoSchemaCommonProtoWarEventWeaStopPersistentAction.WeaStopPersistentAction.fromJson({
            actionIdArray   : [],
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetPlayerStateExpr) {
        action.setWeaSetPlayerStateExpr(ProtoSchemaCommonProtoWarEventWeaSetPlayerStateExpr.WeaSetPlayerStateExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetPlayerStateSimple) {
        action.setWeaSetPlayerStateSimple(ProtoSchemaCommonProtoWarEventWeaSetPlayerStateSimple.WeaSetPlayerStateSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetTaskObjectiveState) {
        action.setWeaSetTaskObjectiveState(ProtoSchemaCommonProtoWarEventWeaSetTaskObjectiveState.WeaSetTaskObjectiveState.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetUnitMovePathVisibility) {
        action.setWeaSetUnitMovePathVisibility(ProtoSchemaCommonProtoWarEventWeaSetUnitMovePathVisibility.WeaSetUnitMovePathVisibility.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetTileTypeExpr) {
        action.setWeaSetTileTypeExpr(ProtoSchemaCommonProtoWarEventWeaSetTileTypeExpr.WeaSetTileTypeExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetTileTypeSimple) {
        action.setWeaSetTileTypeSimple(ProtoSchemaCommonProtoWarEventWeaSetTileTypeSimple.WeaSetTileTypeSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetTileStateExpr) {
        action.setWeaSetTileStateExpr(ProtoSchemaCommonProtoWarEventWeaSetTileStateExpr.WeaSetTileStateExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetTileStateSimple) {
        action.setWeaSetTileStateSimple(ProtoSchemaCommonProtoWarEventWeaSetTileStateSimple.WeaSetTileStateSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetCustomBuildingStateExpr) {
        action.setWeaSetCustomBuildingStateExpr(ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateExpr.WeaSetCustomBuildingStateExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetCustomBuildingStateSimple) {
        action.setWeaSetCustomBuildingStateSimple(ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateSimple.WeaSetCustomBuildingStateSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCrystalStateExpr) {
        action.setWeaSetCustomCrystalStateExpr(ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateExpr.WeaSetCustomCrystalStateExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCrystalStateSimple) {
        action.setWeaSetCustomCrystalStateSimple(ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateSimple.WeaSetCustomCrystalStateSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCannonStateExpr) {
        action.setWeaSetCustomCannonStateExpr(ProtoSchemaCommonProtoWarEventWeaSetCustomCannonStateExpr.WeaSetCustomCannonStateExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCannonStateSimple) {
        action.setWeaSetCustomCannonStateSimple(ProtoSchemaCommonProtoWarEventWeaSetCustomCannonStateSimple.WeaSetCustomCannonStateSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetCustomLaserTurretStateExpr) {
        action.setWeaSetCustomLaserTurretStateExpr(ProtoSchemaCommonProtoWarEventWeaSetCustomLaserTurretStateExpr.WeaSetCustomLaserTurretStateExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.SetCustomLaserTurretStateSimple) {
        action.setWeaSetCustomLaserTurretStateSimple(ProtoSchemaCommonProtoWarEventWeaSetCustomLaserTurretStateSimple.WeaSetCustomLaserTurretStateSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.DeleteTileBuffExpr) {
        action.setWeaDeleteTileBuffExpr(ProtoSchemaCommonProtoWarEventWeaDeleteTileBuffExpr.WeaDeleteTileBuffExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.DeleteTileBuffSimple) {
        action.setWeaDeleteTileBuffSimple(ProtoSchemaCommonProtoWarEventWeaDeleteTileBuffSimple.WeaDeleteTileBuffSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.AddTileBuffExpr) {
        action.setWeaAddTileBuffExpr(ProtoSchemaCommonProtoWarEventWeaAddTileBuffExpr.WeaAddTileBuffExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.AddTileBuffSimple) {
        action.setWeaAddTileBuffSimple(ProtoSchemaCommonProtoWarEventWeaAddTileBuffSimple.WeaAddTileBuffSimple.fromJson({
            actBuffType     : TileBuffsConstants.BuffTypeId.NoIncome,
            actExtraParams  : [],
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.ModifyTileBuffExpr) {
        action.setWeaModifyTileBuffExpr(ProtoSchemaCommonProtoWarEventWeaModifyTileBuffExpr.WeaModifyTileBuffExpr.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.ModifyTileBuffSimple) {
        action.setWeaModifyTileBuffSimple(ProtoSchemaCommonProtoWarEventWeaModifyTileBuffSimple.WeaModifyTileBuffSimple.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.PersistentShowText) {
        action.setWeaPersistentShowText(ProtoSchemaCommonProtoWarEventWeaPersistentShowText.WeaPersistentShowText.fromJson({
            textArray: [],
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.PersistentPlayBgm) {
        action.setWeaPersistentPlayBgm(ProtoSchemaCommonProtoWarEventWeaPersistentPlayBgm.WeaPersistentPlayBgm.fromJson({
            bgmCode     : SoundsConstants.BgmSfxCode.CoEmpty,
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.PersistentModifyPlayerAttribute) {
        action.setWeaPersistentModifyPlayerAttribute(ProtoSchemaCommonProtoWarEventWeaPersistentModifyPlayerAttribute.WeaPersistentModifyPlayerAttribute.fromJson({
        }));
    } else if (actionType === WarEventsActionsConstantsCommon.ActionTypeId.PersistentModifyUnitAttribute) {
        action.setWeaPersistentModifyUnitAttribute(ProtoSchemaCommonProtoWarEventWeaPersistentModifyUnitAttribute.WeaPersistentModifyUnitAttribute.fromJson({
            conUnitFilter               : ``,
        }));
    } else {
        throw HelpersMisc.newError(`Invalid actionType: ${actionType}.`, UtilsClientErrorCode.ClientErrorCode.WarEventHelper_ResetAction_00);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getActionTypeId(action: ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction): WarEventsActionsConstantsCommon.ActionTypeId | null {
    // todo: handle future actions.
    if      (action.getWeaAddUnitOnMapSimple())                         { return WarEventsActionsConstantsCommon.ActionTypeId.AddUnitOnMapSimple; }
    else if (action.getWeaFillUnitOnMapExpr())                          { return WarEventsActionsConstantsCommon.ActionTypeId.FillUnitOnMapExpr; }
    else if (action.getWeaFillUnitOnMapSimple())                        { return WarEventsActionsConstantsCommon.ActionTypeId.FillUnitOnMapSimple; }
    else if (action.getWeaFillUnitLoadedSimple())                       { return WarEventsActionsConstantsCommon.ActionTypeId.FillUnitLoadedSimple; }
    else if (action.getWeaFillUnitLoadedExpr())                         { return WarEventsActionsConstantsCommon.ActionTypeId.FillUnitLoadedExpr; }
    else if (action.getWeaDestroyUnitSimple())                          { return WarEventsActionsConstantsCommon.ActionTypeId.DestroyUnitSimple; }
    else if (action.getWeaDestroyUnitExpr())                            { return WarEventsActionsConstantsCommon.ActionTypeId.DestroyUnitExpr; }
    else if (action.getWeaSetUnitTypeSimple())                          { return WarEventsActionsConstantsCommon.ActionTypeId.SetUnitTypeSimple; }
    else if (action.getWeaSetUnitTypeExpr())                            { return WarEventsActionsConstantsCommon.ActionTypeId.SetUnitTypeExpr; }
    else if (action.getWeaSetUnitOwnershipSimple())                     { return WarEventsActionsConstantsCommon.ActionTypeId.SetUnitOwnershipSimple; }
    else if (action.getWeaSetUnitOwnershipExpr())                       { return WarEventsActionsConstantsCommon.ActionTypeId.SetUnitOwnershipExpr; }
    else if (action.getWeaSetUnitPositionSimple())                      { return WarEventsActionsConstantsCommon.ActionTypeId.SetUnitPositionSimple; }
    else if (action.getWeaSetUnitPositionExpr())                        { return WarEventsActionsConstantsCommon.ActionTypeId.SetUnitPositionExpr; }
    else if (action.getWeaSetUnitStateSimple())                         { return WarEventsActionsConstantsCommon.ActionTypeId.SetUnitStateSimple; }
    else if (action.getWeaSetUnitStateExpr())                           { return WarEventsActionsConstantsCommon.ActionTypeId.SetUnitStateExpr; }
    else if (action.getWeaAddUnitBuffSimple())                          { return WarEventsActionsConstantsCommon.ActionTypeId.AddUnitBuffSimple; }
    else if (action.getWeaModifyUnitBuffSimple())                       { return WarEventsActionsConstantsCommon.ActionTypeId.ModifyUnitBuffSimple; }
    else if (action.getWeaDeleteUnitBuffSimple())                       { return WarEventsActionsConstantsCommon.ActionTypeId.DeleteUnitBuffSimple; }
    else if (action.getWeaSetViewpointExpr())                           { return WarEventsActionsConstantsCommon.ActionTypeId.SetViewpointExpr; }
    else if (action.getWeaSetViewpointSimple())                         { return WarEventsActionsConstantsCommon.ActionTypeId.SetViewpointSimple; }
    else if (action.getWeaSetWeatherSimple())                           { return WarEventsActionsConstantsCommon.ActionTypeId.SetWeatherSimple; }
    else if (action.getWeaSetWeatherExpr())                             { return WarEventsActionsConstantsCommon.ActionTypeId.SetWeatherExpr; }
    else if (action.getWeaBigDialogueSimple())                          { return WarEventsActionsConstantsCommon.ActionTypeId.BigDialogueSimple; }
    else if (action.getWeaSmallDialogueSimple())                        { return WarEventsActionsConstantsCommon.ActionTypeId.SmallDialogueSimple; }
    else if (action.getWeaPlayBgm())                                    { return WarEventsActionsConstantsCommon.ActionTypeId.PlayBgm; }
    else if (action.getWeaPlaySfx())                                    { return WarEventsActionsConstantsCommon.ActionTypeId.PlaySfx; }
    else if (action.getWeaSetForceFogCodeExpr())                        { return WarEventsActionsConstantsCommon.ActionTypeId.SetForceFogCodeExpr; }
    else if (action.getWeaSetForceFogCodeSimple())                      { return WarEventsActionsConstantsCommon.ActionTypeId.SetForceFogCodeSimple; }
    else if (action.getWeaSetCustomCounters())                          { return WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCounters; }
    else if (action.getWeaStopPersistentAction())                       { return WarEventsActionsConstantsCommon.ActionTypeId.StopPersistentAction; }
    else if (action.getWeaSetPlayerStateExpr())                         { return WarEventsActionsConstantsCommon.ActionTypeId.SetPlayerStateExpr; }
    else if (action.getWeaSetPlayerStateSimple())                       { return WarEventsActionsConstantsCommon.ActionTypeId.SetPlayerStateSimple; }
    else if (action.getWeaSetTaskObjectiveState())                      { return WarEventsActionsConstantsCommon.ActionTypeId.SetTaskObjectiveState; }
    else if (action.getWeaSetUnitMovePathVisibility())                  { return WarEventsActionsConstantsCommon.ActionTypeId.SetUnitMovePathVisibility; }
    else if (action.getWeaSetTileTypeExpr())                            { return WarEventsActionsConstantsCommon.ActionTypeId.SetTileTypeExpr; }
    else if (action.getWeaSetTileTypeSimple())                          { return WarEventsActionsConstantsCommon.ActionTypeId.SetTileTypeSimple; }
    else if (action.getWeaSetTileStateExpr())                           { return WarEventsActionsConstantsCommon.ActionTypeId.SetTileStateExpr; }
    else if (action.getWeaSetTileStateSimple())                         { return WarEventsActionsConstantsCommon.ActionTypeId.SetTileStateSimple; }
    else if (action.getWeaSetCustomBuildingStateExpr())                 { return WarEventsActionsConstantsCommon.ActionTypeId.SetCustomBuildingStateExpr; }
    else if (action.getWeaSetCustomBuildingStateSimple())               { return WarEventsActionsConstantsCommon.ActionTypeId.SetCustomBuildingStateSimple; }
    else if (action.getWeaSetCustomCrystalStateExpr())                  { return WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCrystalStateExpr; }
    else if (action.getWeaSetCustomCrystalStateSimple())                { return WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCrystalStateSimple; }
    else if (action.getWeaSetCustomCannonStateExpr())                   { return WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCannonStateExpr; }
    else if (action.getWeaSetCustomCannonStateSimple())                 { return WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCannonStateSimple; }
    else if (action.getWeaSetCustomLaserTurretStateExpr())              { return WarEventsActionsConstantsCommon.ActionTypeId.SetCustomLaserTurretStateExpr; }
    else if (action.getWeaSetCustomLaserTurretStateSimple())            { return WarEventsActionsConstantsCommon.ActionTypeId.SetCustomLaserTurretStateSimple; }
    else if (action.getWeaDeleteTileBuffExpr())                         { return WarEventsActionsConstantsCommon.ActionTypeId.DeleteTileBuffExpr; }
    else if (action.getWeaDeleteTileBuffSimple())                       { return WarEventsActionsConstantsCommon.ActionTypeId.DeleteTileBuffSimple; }
    else if (action.getWeaAddTileBuffExpr())                            { return WarEventsActionsConstantsCommon.ActionTypeId.AddTileBuffExpr; }
    else if (action.getWeaAddTileBuffSimple())                          { return WarEventsActionsConstantsCommon.ActionTypeId.AddTileBuffSimple; }
    else if (action.getWeaModifyTileBuffExpr())                         { return WarEventsActionsConstantsCommon.ActionTypeId.ModifyTileBuffExpr; }
    else if (action.getWeaModifyTileBuffSimple())                       { return WarEventsActionsConstantsCommon.ActionTypeId.ModifyTileBuffSimple; }
    else if (action.getWeaPersistentShowText())                         { return WarEventsActionsConstantsCommon.ActionTypeId.PersistentShowText; }
    else if (action.getWeaPersistentPlayBgm())                          { return WarEventsActionsConstantsCommon.ActionTypeId.PersistentPlayBgm; }
    else if (action.getWeaPersistentModifyPlayerAttribute())            { return WarEventsActionsConstantsCommon.ActionTypeId.PersistentModifyPlayerAttribute; }
    else if (action.getWeaPersistentModifyUnitAttribute())              { return WarEventsActionsConstantsCommon.ActionTypeId.PersistentModifyUnitAttribute; }
    else                                                                { return null; }
}
export function getInterchangeableTypeId(action: ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction): WarEventsActionsConstantsCommon.InterchangeableTypeId {
    const actionType = getActionTypeId(action);
    if (actionType == null) {
        return WarEventsActionsConstantsCommon.InterchangeableTypeId.NotInterchangeable;
    } else if (WarEventsActionsConstantsCommon.PersistentInterchangeableActionTypeArray.includes(actionType)) {
        return WarEventsActionsConstantsCommon.InterchangeableTypeId.Persistent;
    } else if (WarEventsActionsConstantsCommon.InstantInterchangeableActionTypeArray.includes(actionType)) {
        return WarEventsActionsConstantsCommon.InterchangeableTypeId.Instant;
    } else {
        return WarEventsActionsConstantsCommon.InterchangeableTypeId.NotInterchangeable;
    }
}
