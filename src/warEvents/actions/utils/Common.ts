import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { SmallDialogueSideId } from "../../../dialogues/Constants.ts";
import { ForcedFogCode } from "../../../fogMaps/Constants.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { closePanel, openPanel } from "../../../gamePanels/Manager.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { checkIsValidLanguageTextArray, getText, getCurrentLanguageType } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
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
import { BgmSfxCode } from "../../../sounds/Constants.ts";
import { BuffTypeId } from "../../../tileBuffs/Constants.ts";
import { BuffTypeId as UnitBuffsConstantsBuffTypeId } from "../../../unitBuffs/Constants.ts";
import { UnitTypeId } from "../../../units/Constants.ts";
import { createDefault } from "../../../units/utils/Serialization.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import {
    MaxCounts,
    AllBuffEndTimeModificationModeArray,
    ActionTypeId,
    InterchangeableTypeId,
    PersistentInterchangeableActionTypeArray,
    InstantInterchangeableActionTypeArray,
} from "../constants/Common.ts";
import { checkIsValid, getBriefDesc, getDetailDesc, getErrorTip } from "./AddTileBuffExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsAddTileBuffSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsAddTileBuffSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsAddTileBuffSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsAddTileBuffSimpleGetErrorTip,
} from "./AddTileBuffSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsAddUnitBuffSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsAddUnitBuffSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsAddUnitBuffSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsAddUnitBuffSimpleGetErrorTip,
} from "./AddUnitBuffSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsAddUnitOnMapSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsAddUnitOnMapSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsAddUnitOnMapSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsAddUnitOnMapSimpleGetErrorTip,
} from "./AddUnitOnMapSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsBigDialogueSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsBigDialogueSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsBigDialogueSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsBigDialogueSimpleGetErrorTip,
} from "./BigDialogueSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsDeleteTileBuffExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsDeleteTileBuffExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsDeleteTileBuffExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsDeleteTileBuffExprGetErrorTip,
} from "./DeleteTileBuffExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsDeleteTileBuffSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsDeleteTileBuffSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsDeleteTileBuffSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsDeleteTileBuffSimpleGetErrorTip,
} from "./DeleteTileBuffSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsDeleteUnitBuffSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsDeleteUnitBuffSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsDeleteUnitBuffSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsDeleteUnitBuffSimpleGetErrorTip,
} from "./DeleteUnitBuffSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsDestroyUnitExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsDestroyUnitExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsDestroyUnitExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsDestroyUnitExprGetErrorTip,
} from "./DestroyUnitExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsDestroyUnitSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsDestroyUnitSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsDestroyUnitSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsDestroyUnitSimpleGetErrorTip,
} from "./DestroyUnitSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsFillUnitLoadedExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsFillUnitLoadedExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsFillUnitLoadedExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsFillUnitLoadedExprGetErrorTip,
} from "./FillUnitLoadedExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsFillUnitLoadedSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsFillUnitLoadedSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsFillUnitLoadedSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsFillUnitLoadedSimpleGetErrorTip,
} from "./FillUnitLoadedSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsFillUnitOnMapExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsFillUnitOnMapExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsFillUnitOnMapExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsFillUnitOnMapExprGetErrorTip,
} from "./FillUnitOnMapExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsFillUnitOnMapSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsFillUnitOnMapSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsFillUnitOnMapSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsFillUnitOnMapSimpleGetErrorTip,
} from "./FillUnitOnMapSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsModifyTileBuffExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsModifyTileBuffExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsModifyTileBuffExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsModifyTileBuffExprGetErrorTip,
} from "./ModifyTileBuffExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsModifyTileBuffSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsModifyTileBuffSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsModifyTileBuffSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsModifyTileBuffSimpleGetErrorTip,
} from "./ModifyTileBuffSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsModifyUnitBuffSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsModifyUnitBuffSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsModifyUnitBuffSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsModifyUnitBuffSimpleGetErrorTip,
} from "./ModifyUnitBuffSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsPersistentModifyPlayerAttributeCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsPersistentModifyPlayerAttributeGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsPersistentModifyPlayerAttributeGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsPersistentModifyPlayerAttributeGetErrorTip,
} from "./PersistentModifyPlayerAttribute.ts";
import {
    checkIsValid as WarEventsActionsUtilsPersistentModifyUnitAttributeCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsPersistentModifyUnitAttributeGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsPersistentModifyUnitAttributeGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsPersistentModifyUnitAttributeGetErrorTip,
} from "./PersistentModifyUnitAttribute.ts";
import {
    checkIsValid as WarEventsActionsUtilsPersistentPlayBgmCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsPersistentPlayBgmGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsPersistentPlayBgmGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsPersistentPlayBgmGetErrorTip,
} from "./PersistentPlayBgm.ts";
import {
    checkIsValid as WarEventsActionsUtilsPersistentShowTextCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsPersistentShowTextGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsPersistentShowTextGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsPersistentShowTextGetErrorTip,
} from "./PersistentShowText.ts";
import {
    checkIsValid as WarEventsActionsUtilsPlayBgmCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsPlayBgmGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsPlayBgmGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsPlayBgmGetErrorTip,
} from "./PlayBgm.ts";
import {
    checkIsValid as WarEventsActionsUtilsPlaySfxCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsPlaySfxGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsPlaySfxGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsPlaySfxGetErrorTip,
} from "./PlaySfx.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetCustomBuildingStateExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetCustomBuildingStateExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetCustomBuildingStateExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetCustomBuildingStateExprGetErrorTip,
} from "./SetCustomBuildingStateExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetCustomBuildingStateSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetCustomBuildingStateSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetCustomBuildingStateSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetCustomBuildingStateSimpleGetErrorTip,
} from "./SetCustomBuildingStateSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetCustomCannonStateExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetCustomCannonStateExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetCustomCannonStateExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetCustomCannonStateExprGetErrorTip,
} from "./SetCustomCannonStateExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetCustomCannonStateSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetCustomCannonStateSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetCustomCannonStateSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetCustomCannonStateSimpleGetErrorTip,
} from "./SetCustomCannonStateSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetCustomCountersCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetCustomCountersGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetCustomCountersGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetCustomCountersGetErrorTip,
} from "./SetCustomCounters.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetCustomCrystalStateExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetCustomCrystalStateExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetCustomCrystalStateExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetCustomCrystalStateExprGetErrorTip,
} from "./SetCustomCrystalStateExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetCustomCrystalStateSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetCustomCrystalStateSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetCustomCrystalStateSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetCustomCrystalStateSimpleGetErrorTip,
} from "./SetCustomCrystalStateSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetCustomLaserTurretStateExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetCustomLaserTurretStateExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetCustomLaserTurretStateExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetCustomLaserTurretStateExprGetErrorTip,
} from "./SetCustomLaserTurretStateExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetCustomLaserTurretStateSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetCustomLaserTurretStateSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetCustomLaserTurretStateSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetCustomLaserTurretStateSimpleGetErrorTip,
} from "./SetCustomLaserTurretStateSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetForceFogCodeExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetForceFogCodeExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetForceFogCodeExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetForceFogCodeExprGetErrorTip,
} from "./SetForceFogCodeExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetForceFogCodeSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetForceFogCodeSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetForceFogCodeSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetForceFogCodeSimpleGetErrorTip,
} from "./SetForceFogCodeSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetPlayerStateExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetPlayerStateExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetPlayerStateExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetPlayerStateExprGetErrorTip,
} from "./SetPlayerStateExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetPlayerStateSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetPlayerStateSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetPlayerStateSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetPlayerStateSimpleGetErrorTip,
} from "./SetPlayerStateSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetTaskObjectiveStateCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetTaskObjectiveStateGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetTaskObjectiveStateGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetTaskObjectiveStateGetErrorTip,
} from "./SetTaskObjectiveState.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetTileStateExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetTileStateExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetTileStateExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetTileStateExprGetErrorTip,
} from "./SetTileStateExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetTileStateSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetTileStateSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetTileStateSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetTileStateSimpleGetErrorTip,
} from "./SetTileStateSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetTileTypeExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetTileTypeExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetTileTypeExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetTileTypeExprGetErrorTip,
} from "./SetTileTypeExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetTileTypeSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetTileTypeSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetTileTypeSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetTileTypeSimpleGetErrorTip,
} from "./SetTileTypeSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetUnitMovePathVisibilityCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetUnitMovePathVisibilityGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetUnitMovePathVisibilityGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetUnitMovePathVisibilityGetErrorTip,
} from "./SetUnitMovePathVisibility.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetUnitOwnershipExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetUnitOwnershipExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetUnitOwnershipExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetUnitOwnershipExprGetErrorTip,
} from "./SetUnitOwnershipExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetUnitOwnershipSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetUnitOwnershipSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetUnitOwnershipSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetUnitOwnershipSimpleGetErrorTip,
} from "./SetUnitOwnershipSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetUnitPositionExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetUnitPositionExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetUnitPositionExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetUnitPositionExprGetErrorTip,
} from "./SetUnitPositionExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetUnitPositionSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetUnitPositionSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetUnitPositionSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetUnitPositionSimpleGetErrorTip,
} from "./SetUnitPositionSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetUnitStateExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetUnitStateExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetUnitStateExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetUnitStateExprGetErrorTip,
} from "./SetUnitStateExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetUnitStateSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetUnitStateSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetUnitStateSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetUnitStateSimpleGetErrorTip,
} from "./SetUnitStateSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetUnitTypeExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetUnitTypeExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetUnitTypeExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetUnitTypeExprGetErrorTip,
} from "./SetUnitTypeExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetUnitTypeSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetUnitTypeSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetUnitTypeSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetUnitTypeSimpleGetErrorTip,
} from "./SetUnitTypeSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetViewpointExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetViewpointExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetViewpointExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetViewpointExprGetErrorTip,
} from "./SetViewpointExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetViewpointSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetViewpointSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetViewpointSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetViewpointSimpleGetErrorTip,
} from "./SetViewpointSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetWeatherExprCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetWeatherExprGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetWeatherExprGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetWeatherExprGetErrorTip,
} from "./SetWeatherExpr.ts";
import {
    checkIsValid as WarEventsActionsUtilsSetWeatherSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSetWeatherSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSetWeatherSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSetWeatherSimpleGetErrorTip,
} from "./SetWeatherSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsSmallDialogueSimpleCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsSmallDialogueSimpleGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsSmallDialogueSimpleGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsSmallDialogueSimpleGetErrorTip,
} from "./SmallDialogueSimple.ts";
import {
    checkIsValid as WarEventsActionsUtilsStopPersistentActionCheckIsValid,
    getBriefDesc as WarEventsActionsUtilsStopPersistentActionGetBriefDesc,
    getDetailDesc as WarEventsActionsUtilsStopPersistentActionGetDetailDesc,
    getErrorTip as WarEventsActionsUtilsStopPersistentActionGetErrorTip,
} from "./StopPersistentAction.ts";
import { Event } from "../../Constants.ts";
import { getEvent } from "../../fullDatas/Utils.ts";

export function checkIsValidWarEventActionId(actionId: number): boolean {
    return (actionId > 0) && (actionId <= MaxCounts.PerMap);
}
export function checkIsValidWarEventActionIdSubset(actionIdArray: number[]): boolean {
    return (actionIdArray.length <= MaxCounts.PerMap)
        && (actionIdArray.length === new Set(actionIdArray).size)
        && (actionIdArray.every(v => checkIsValidWarEventActionId(v)));
}

export function checkIsValidBuffEndTimeModificationMode(mode: number): boolean {
    return AllBuffEndTimeModificationModeArray.includes(mode);
}

export function checkIsValidWarEventAction({ action, mapSize, gameConfig, playersCountUnneutral, customCounterNameSet }: {    // DONE
    action                  : WarEventAction;
    mapSize                 : MapSize;
    gameConfig              : GameConfig;
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
    if (!checkIsValidLanguageTextArray({
        list            : weaCommonData?.getActionNameArray() ?? [],
        maxTextLength   : Event.MaxNameLength,
        minTextLength   : 1,
        minTextCount    : 0,
    })) {
        return false;
    }

    // todo: add more checkers when the action types grow.
    return (WarEventsActionsUtilsAddUnitOnMapSimpleCheckIsValid({ action: action.getWeaAddUnitOnMapSimple(), gameConfig, mapSize, playersCountUnneutral }))
        || (WarEventsActionsUtilsFillUnitOnMapExprCheckIsValid(action.getWeaFillUnitOnMapExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsFillUnitOnMapSimpleCheckIsValid(action.getWeaFillUnitOnMapSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsFillUnitLoadedSimpleCheckIsValid(action.getWeaFillUnitLoadedSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsFillUnitLoadedExprCheckIsValid(action.getWeaFillUnitLoadedExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsDestroyUnitSimpleCheckIsValid(action.getWeaDestroyUnitSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsDestroyUnitExprCheckIsValid(action.getWeaDestroyUnitExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitTypeSimpleCheckIsValid(action.getWeaSetUnitTypeSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetUnitTypeExprCheckIsValid(action.getWeaSetUnitTypeExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitOwnershipSimpleCheckIsValid(action.getWeaSetUnitOwnershipSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetUnitOwnershipExprCheckIsValid(action.getWeaSetUnitOwnershipExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitPositionSimpleCheckIsValid(action.getWeaSetUnitPositionSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetUnitPositionExprCheckIsValid(action.getWeaSetUnitPositionExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitStateSimpleCheckIsValid(action.getWeaSetUnitStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetUnitStateExprCheckIsValid(action.getWeaSetUnitStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsAddUnitBuffSimpleCheckIsValid(action.getWeaAddUnitBuffSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsModifyUnitBuffSimpleCheckIsValid(action.getWeaModifyUnitBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsDeleteUnitBuffSimpleCheckIsValid(action.getWeaDeleteUnitBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsSetViewpointExprCheckIsValid(action.getWeaSetViewpointExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetViewpointSimpleCheckIsValid(action.getWeaSetViewpointSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetWeatherExprCheckIsValid(action.getWeaSetWeatherExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetWeatherSimpleCheckIsValid(action.getWeaSetWeatherSimple(), gameConfig))
        || (WarEventsActionsUtilsBigDialogueSimpleCheckIsValid(action.getWeaBigDialogueSimple(), playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsSmallDialogueSimpleCheckIsValid(action.getWeaSmallDialogueSimple(), playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsPlayBgmCheckIsValid(action.getWeaPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPlaySfxCheckIsValid(action.getWeaPlaySfx()))
        || (WarEventsActionsUtilsSetForceFogCodeExprCheckIsValid(action.getWeaSetForceFogCodeExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetForceFogCodeSimpleCheckIsValid(action.getWeaSetForceFogCodeSimple()))
        || (WarEventsActionsUtilsSetCustomCountersCheckIsValid(action.getWeaSetCustomCounters(), customCounterNameSet))
        || (WarEventsActionsUtilsStopPersistentActionCheckIsValid(action.getWeaStopPersistentAction()))
        || (WarEventsActionsUtilsSetPlayerStateExprCheckIsValid(action.getWeaSetPlayerStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetPlayerStateSimpleCheckIsValid(action.getWeaSetPlayerStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetTaskObjectiveStateCheckIsValid(action.getWeaSetTaskObjectiveState(), customCounterNameSet))
        || (WarEventsActionsUtilsSetUnitMovePathVisibilityCheckIsValid(action.getWeaSetUnitMovePathVisibility(), customCounterNameSet))
        || (WarEventsActionsUtilsSetTileTypeExprCheckIsValid(action.getWeaSetTileTypeExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetTileTypeSimpleCheckIsValid(action.getWeaSetTileTypeSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetTileStateExprCheckIsValid(action.getWeaSetTileStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetTileStateSimpleCheckIsValid(action.getWeaSetTileStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetCustomBuildingStateExprCheckIsValid(action.getWeaSetCustomBuildingStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetCustomBuildingStateSimpleCheckIsValid(action.getWeaSetCustomBuildingStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetCustomCrystalStateExprCheckIsValid(action.getWeaSetCustomCrystalStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetCustomCrystalStateSimpleCheckIsValid(action.getWeaSetCustomCrystalStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetCustomCannonStateExprCheckIsValid(action.getWeaSetCustomCannonStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetCustomCannonStateSimpleCheckIsValid(action.getWeaSetCustomCannonStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateExprCheckIsValid(action.getWeaSetCustomLaserTurretStateExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateSimpleCheckIsValid(action.getWeaSetCustomLaserTurretStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsDeleteTileBuffExprCheckIsValid(action.getWeaDeleteTileBuffExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsDeleteTileBuffSimpleCheckIsValid(action.getWeaDeleteTileBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (checkIsValid(action.getWeaAddTileBuffExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsAddTileBuffSimpleCheckIsValid(action.getWeaAddTileBuffSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (WarEventsActionsUtilsModifyTileBuffExprCheckIsValid(action.getWeaModifyTileBuffExpr(), customCounterNameSet))
        || (WarEventsActionsUtilsModifyTileBuffSimpleCheckIsValid(action.getWeaModifyTileBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (WarEventsActionsUtilsPersistentShowTextCheckIsValid(action.getWeaPersistentShowText()))
        || (WarEventsActionsUtilsPersistentPlayBgmCheckIsValid(action.getWeaPersistentPlayBgm()))
        || (WarEventsActionsUtilsPersistentModifyPlayerAttributeCheckIsValid(action.getWeaPersistentModifyPlayerAttribute(), customCounterNameSet))
        || (WarEventsActionsUtilsPersistentModifyUnitAttributeCheckIsValid(action.getWeaPersistentModifyUnitAttribute(), customCounterNameSet));
}

export function checkIsPersistentAction(action: WarEventAction): boolean {
    return (action.getWeaPersistentShowText() != null)
        || (action.getWeaPersistentPlayBgm() != null)
        || (action.getWeaPersistentModifyPlayerAttribute() != null)
        || (action.getWeaPersistentModifyUnitAttribute() != null);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function openActionModifyPanel(war: IMeWar, fullData: WarEventFullData, action: WarEventAction): void {
    // todo: handle more action types.
    closePanel(getDict().WeaAddUnitOnMapSimplePanel);
    closePanel(getDict().WeaSetViewpointExprPanel);
    closePanel(getDict().WeaSetViewpointSimplePanel);
    closePanel(getDict().WeaBigDialogueSimplePanel);
    closePanel(getDict().WeaSmallDialogueSimplePanel);
    closePanel(getDict().WeaPlayBgmPanel);
    closePanel(getDict().WeaPlaySfxPanel);
    closePanel(getDict().WeaSetWeatherExprPanel);
    closePanel(getDict().WeaSetWeatherSimplePanel);
    closePanel(getDict().WeaFillUnitOnMapExprPanel);
    closePanel(getDict().WeaFillUnitOnMapSimplePanel);
    closePanel(getDict().WeaFillUnitLoadedSimplePanel);
    closePanel(getDict().WeaFillUnitLoadedExprPanel);
    closePanel(getDict().WeaDestroyUnitSimplePanel);
    closePanel(getDict().WeaDestroyUnitExprPanel);
    closePanel(getDict().WeaSetUnitTypeSimplePanel);
    closePanel(getDict().WeaSetUnitTypeExprPanel);
    closePanel(getDict().WeaAddUnitBuffSimplePanel);
    closePanel(getDict().WeaModifyUnitBuffSimplePanel);
    closePanel(getDict().WeaDeleteUnitBuffSimplePanel);

    closePanel(getDict().WeaSetUnitOwnershipSimplePanel);
    closePanel(getDict().WeaSetUnitOwnershipExprPanel);
    closePanel(getDict().WeaSetUnitPositionSimplePanel);
    closePanel(getDict().WeaSetUnitPositionExprPanel);
    closePanel(getDict().WeaSetUnitStateSimplePanel);
    closePanel(getDict().WeaSetUnitStateExprPanel);

    closePanel(getDict().WeaSetForceFogCodeExprPanel);
    closePanel(getDict().WeaSetForceFogCodeSimplePanel);
    closePanel(getDict().WeaStopPersistentActionPanel);
    closePanel(getDict().WeaSetCustomCountersPanel);

    closePanel(getDict().WeaSetPlayerStateExprPanel);
    closePanel(getDict().WeaSetPlayerStateSimplePanel);
    closePanel(getDict().WeaSetTaskObjectiveStatePanel);
    closePanel(getDict().WeaSetUnitMovePathVisibilityPanel);

    closePanel(getDict().WeaSetTileTypeExprPanel);
    closePanel(getDict().WeaSetTileTypeSimplePanel);
    closePanel(getDict().WeaSetTileStateExprPanel);
    closePanel(getDict().WeaSetTileStateSimplePanel);
    closePanel(getDict().WeaSetCustomBuildingStateExprPanel);
    closePanel(getDict().WeaSetCustomBuildingStateSimplePanel);
    closePanel(getDict().WeaSetCustomCrystalStateExprPanel);
    closePanel(getDict().WeaSetCustomCrystalStateSimplePanel);
    closePanel(getDict().WeaSetCustomCannonStateExprPanel);
    closePanel(getDict().WeaSetCustomCannonStateSimplePanel);
    closePanel(getDict().WeaSetCustomLaserTurretStateExprPanel);
    closePanel(getDict().WeaSetCustomLaserTurretStateSimplePanel);
    closePanel(getDict().WeaDeleteTileBuffExprPanel);
    closePanel(getDict().WeaDeleteTileBuffSimplePanel);
    closePanel(getDict().WeaAddTileBuffExprPanel);
    closePanel(getDict().WeaAddTileBuffSimplePanel);
    closePanel(getDict().WeaModifyTileBuffExprPanel);
    closePanel(getDict().WeaModifyTileBuffSimplePanel);

    closePanel(getDict().WeaPersistentShowTextPanel);
    closePanel(getDict().WeaPersistentPlayBgmPanel);
    closePanel(getDict().WeaPersistentModifyPlayerAttributePanel);
    closePanel(getDict().WeaPersistentModifyUnitAttributePanel);

    if      (action.getWeaAddUnitOnMapSimple())                         { openPanel(getDict().WeaAddUnitOnMapSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaSetViewpointExpr())                           { openPanel(getDict().WeaSetViewpointExprPanel,                               { war, fullData, action }); }
    else if (action.getWeaSetViewpointSimple())                         { openPanel(getDict().WeaSetViewpointSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaBigDialogueSimple())                          { openPanel(getDict().WeaBigDialogueSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaSmallDialogueSimple())                        { openPanel(getDict().WeaSmallDialogueSimplePanel,                            { war, fullData, action }); }
    else if (action.getWeaPlayBgm())                                    { openPanel(getDict().WeaPlayBgmPanel,                                        { war, fullData, action }); }
    else if (action.getWeaPlaySfx())                                    { openPanel(getDict().WeaPlaySfxPanel,                                        { war, fullData, action }); }
    else if (action.getWeaSetWeatherExpr())                             { openPanel(getDict().WeaSetWeatherExprPanel,                                 { war, fullData, action }); }
    else if (action.getWeaSetWeatherSimple())                           { openPanel(getDict().WeaSetWeatherSimplePanel,                               { war, fullData, action }); }
    else if (action.getWeaFillUnitOnMapExpr())                          { openPanel(getDict().WeaFillUnitOnMapExprPanel,                              { war, fullData, action }); }
    else if (action.getWeaFillUnitOnMapSimple())                        { openPanel(getDict().WeaFillUnitOnMapSimplePanel,                            { war, fullData, action }); }
    else if (action.getWeaFillUnitLoadedSimple())                       { openPanel(getDict().WeaFillUnitLoadedSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaFillUnitLoadedExpr())                         { openPanel(getDict().WeaFillUnitLoadedExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaDestroyUnitSimple())                          { openPanel(getDict().WeaDestroyUnitSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaDestroyUnitExpr())                            { openPanel(getDict().WeaDestroyUnitExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaSetUnitTypeSimple())                          { openPanel(getDict().WeaSetUnitTypeSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaSetUnitTypeExpr())                            { openPanel(getDict().WeaSetUnitTypeExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaSetUnitOwnershipSimple())                     { openPanel(getDict().WeaSetUnitOwnershipSimplePanel,                         { war, fullData, action }); }
    else if (action.getWeaSetUnitOwnershipExpr())                       { openPanel(getDict().WeaSetUnitOwnershipExprPanel,                           { war, fullData, action }); }
    else if (action.getWeaSetUnitPositionSimple())                      { openPanel(getDict().WeaSetUnitPositionSimplePanel,                          { war, fullData, action }); }
    else if (action.getWeaSetUnitPositionExpr())                        { openPanel(getDict().WeaSetUnitPositionExprPanel,                            { war, fullData, action }); }
    else if (action.getWeaSetUnitStateSimple())                         { openPanel(getDict().WeaSetUnitStateSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaSetUnitStateExpr())                           { openPanel(getDict().WeaSetUnitStateExprPanel,                               { war, fullData, action }); }
    else if (action.getWeaAddUnitBuffSimple())                          { openPanel(getDict().WeaAddUnitBuffSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaModifyUnitBuffSimple())                       { openPanel(getDict().WeaModifyUnitBuffSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaDeleteUnitBuffSimple())                       { openPanel(getDict().WeaDeleteUnitBuffSimplePanel,                           { war, fullData, action }); }

    else if (action.getWeaSetForceFogCodeExpr())                        { openPanel(getDict().WeaSetForceFogCodeExprPanel,                            { war, fullData, action }); }
    else if (action.getWeaSetForceFogCodeSimple())                      { openPanel(getDict().WeaSetForceFogCodeSimplePanel,                          { war, fullData, action }); }
    else if (action.getWeaStopPersistentAction())                       { openPanel(getDict().WeaStopPersistentActionPanel,                           { war, fullData, action }); }
    else if (action.getWeaSetCustomCounters())                          { openPanel(getDict().WeaSetCustomCountersPanel,                              { war, fullData, action }); }

    else if (action.getWeaSetPlayerStateExpr())                         { openPanel(getDict().WeaSetPlayerStateExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaSetPlayerStateSimple())                       { openPanel(getDict().WeaSetPlayerStateSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaSetTaskObjectiveState())                      { openPanel(getDict().WeaSetTaskObjectiveStatePanel,                          { war, fullData, action }); }
    else if (action.getWeaSetUnitMovePathVisibility())                  { openPanel(getDict().WeaSetUnitMovePathVisibilityPanel,                      { war, fullData, action }); }

    else if (action.getWeaSetTileTypeExpr())                            { openPanel(getDict().WeaSetTileTypeExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaSetTileTypeSimple())                          { openPanel(getDict().WeaSetTileTypeSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaSetTileStateExpr())                           { openPanel(getDict().WeaSetTileStateExprPanel,                               { war, fullData, action }); }
    else if (action.getWeaSetTileStateSimple())                         { openPanel(getDict().WeaSetTileStateSimplePanel,                             { war, fullData, action }); }
    else if (action.getWeaSetCustomBuildingStateExpr())                 { openPanel(getDict().WeaSetCustomBuildingStateExprPanel,                     { war, fullData, action }); }
    else if (action.getWeaSetCustomBuildingStateSimple())               { openPanel(getDict().WeaSetCustomBuildingStateSimplePanel,                   { war, fullData, action }); }
    else if (action.getWeaSetCustomCrystalStateExpr())                  { openPanel(getDict().WeaSetCustomCrystalStateExprPanel,                      { war, fullData, action }); }
    else if (action.getWeaSetCustomCrystalStateSimple())                { openPanel(getDict().WeaSetCustomCrystalStateSimplePanel,                    { war, fullData, action }); }
    else if (action.getWeaSetCustomCannonStateExpr())                   { openPanel(getDict().WeaSetCustomCannonStateExprPanel,                       { war, fullData, action }); }
    else if (action.getWeaSetCustomCannonStateSimple())                 { openPanel(getDict().WeaSetCustomCannonStateSimplePanel,                     { war, fullData, action }); }
    else if (action.getWeaSetCustomLaserTurretStateExpr())              { openPanel(getDict().WeaSetCustomLaserTurretStateExprPanel,                  { war, fullData, action }); }
    else if (action.getWeaSetCustomLaserTurretStateSimple())            { openPanel(getDict().WeaSetCustomLaserTurretStateSimplePanel,                { war, fullData, action }); }
    else if (action.getWeaDeleteTileBuffExpr())                         { openPanel(getDict().WeaDeleteTileBuffExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaDeleteTileBuffSimple())                       { openPanel(getDict().WeaDeleteTileBuffSimplePanel,                           { war, fullData, action }); }
    else if (action.getWeaAddTileBuffExpr())                            { openPanel(getDict().WeaAddTileBuffExprPanel,                                { war, fullData, action }); }
    else if (action.getWeaAddTileBuffSimple())                          { openPanel(getDict().WeaAddTileBuffSimplePanel,                              { war, fullData, action }); }
    else if (action.getWeaModifyTileBuffExpr())                         { openPanel(getDict().WeaModifyTileBuffExprPanel,                             { war, fullData, action }); }
    else if (action.getWeaModifyTileBuffSimple())                       { openPanel(getDict().WeaModifyTileBuffSimplePanel,                           { war, fullData, action }); }

    else if (action.getWeaPersistentShowText())                         { openPanel(getDict().WeaPersistentShowTextPanel,                             { war, fullData, action }); }
    else if (action.getWeaPersistentPlayBgm())                          { openPanel(getDict().WeaPersistentPlayBgmPanel,                              { war, fullData, action }); }
    else if (action.getWeaPersistentModifyPlayerAttribute())            { openPanel(getDict().WeaPersistentModifyPlayerAttributePanel,                { war, fullData, action }); }
    else if (action.getWeaPersistentModifyUnitAttribute())              { openPanel(getDict().WeaPersistentModifyUnitAttributePanel,                  { war, fullData, action }); }

    else                                                                { throw newError(`Invalid action.`, ClientErrorCode.WarEventHelper_OpenActionModifyPanel_00); }
}

export function getBriefDescForAction(action: WarEventAction, gameConfig: GameConfig): string | null {
    // todo: add functions for other actions
    return (WarEventsActionsUtilsAddUnitOnMapSimpleGetBriefDesc(action.getWeaAddUnitOnMapSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitOnMapExprGetBriefDesc(action.getWeaFillUnitOnMapExpr()))
        || (WarEventsActionsUtilsFillUnitOnMapSimpleGetBriefDesc(action.getWeaFillUnitOnMapSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitLoadedSimpleGetBriefDesc(action.getWeaFillUnitLoadedSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitLoadedExprGetBriefDesc(action.getWeaFillUnitLoadedExpr()))
        || (WarEventsActionsUtilsDestroyUnitSimpleGetBriefDesc(action.getWeaDestroyUnitSimple()))
        || (WarEventsActionsUtilsDestroyUnitExprGetBriefDesc(action.getWeaDestroyUnitExpr()))
        || (WarEventsActionsUtilsSetUnitTypeSimpleGetBriefDesc(action.getWeaSetUnitTypeSimple(), gameConfig))
        || (WarEventsActionsUtilsSetUnitTypeExprGetBriefDesc(action.getWeaSetUnitTypeExpr()))
        || (WarEventsActionsUtilsSetUnitOwnershipSimpleGetBriefDesc(action.getWeaSetUnitOwnershipSimple()))
        || (WarEventsActionsUtilsSetUnitOwnershipExprGetBriefDesc(action.getWeaSetUnitOwnershipExpr()))
        || (WarEventsActionsUtilsSetUnitPositionSimpleGetBriefDesc(action.getWeaSetUnitPositionSimple()))
        || (WarEventsActionsUtilsSetUnitPositionExprGetBriefDesc(action.getWeaSetUnitPositionExpr()))
        || (WarEventsActionsUtilsSetUnitStateSimpleGetBriefDesc(action.getWeaSetUnitStateSimple()))
        || (WarEventsActionsUtilsSetUnitStateExprGetBriefDesc(action.getWeaSetUnitStateExpr()))
        || (WarEventsActionsUtilsAddUnitBuffSimpleGetBriefDesc(action.getWeaAddUnitBuffSimple()))
        || (WarEventsActionsUtilsModifyUnitBuffSimpleGetBriefDesc(action.getWeaModifyUnitBuffSimple()))
        || (WarEventsActionsUtilsDeleteUnitBuffSimpleGetBriefDesc(action.getWeaDeleteUnitBuffSimple()))
        || (WarEventsActionsUtilsSetViewpointExprGetBriefDesc(action.getWeaSetViewpointExpr()))
        || (WarEventsActionsUtilsSetViewpointSimpleGetBriefDesc(action.getWeaSetViewpointSimple()))
        || (WarEventsActionsUtilsSetWeatherExprGetBriefDesc(action.getWeaSetWeatherExpr()))
        || (WarEventsActionsUtilsSetWeatherSimpleGetBriefDesc(action.getWeaSetWeatherSimple(), gameConfig))
        || (WarEventsActionsUtilsBigDialogueSimpleGetBriefDesc(action.getWeaBigDialogueSimple(), gameConfig))
        || (WarEventsActionsUtilsSmallDialogueSimpleGetBriefDesc(action.getWeaSmallDialogueSimple(), gameConfig))
        || (WarEventsActionsUtilsPlayBgmGetBriefDesc(action.getWeaPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPlaySfxGetBriefDesc(action.getWeaPlaySfx(), gameConfig))
        || (WarEventsActionsUtilsSetForceFogCodeExprGetBriefDesc(action.getWeaSetForceFogCodeExpr()))
        || (WarEventsActionsUtilsSetForceFogCodeSimpleGetBriefDesc(action.getWeaSetForceFogCodeSimple()))
        || (WarEventsActionsUtilsSetCustomCountersGetBriefDesc(action.getWeaSetCustomCounters()))
        || (WarEventsActionsUtilsStopPersistentActionGetBriefDesc(action.getWeaStopPersistentAction()))
        || (WarEventsActionsUtilsSetPlayerStateExprGetBriefDesc(action.getWeaSetPlayerStateExpr()))
        || (WarEventsActionsUtilsSetPlayerStateSimpleGetBriefDesc(action.getWeaSetPlayerStateSimple()))
        || (WarEventsActionsUtilsSetTaskObjectiveStateGetBriefDesc(action.getWeaSetTaskObjectiveState()))
        || (WarEventsActionsUtilsSetUnitMovePathVisibilityGetBriefDesc(action.getWeaSetUnitMovePathVisibility()))
        || (WarEventsActionsUtilsSetTileTypeExprGetBriefDesc(action.getWeaSetTileTypeExpr()))
        || (WarEventsActionsUtilsSetTileTypeSimpleGetBriefDesc(action.getWeaSetTileTypeSimple()))
        || (WarEventsActionsUtilsSetTileStateExprGetBriefDesc(action.getWeaSetTileStateExpr()))
        || (WarEventsActionsUtilsSetTileStateSimpleGetBriefDesc(action.getWeaSetTileStateSimple()))
        || (WarEventsActionsUtilsSetCustomBuildingStateExprGetBriefDesc(action.getWeaSetCustomBuildingStateExpr()))
        || (WarEventsActionsUtilsSetCustomBuildingStateSimpleGetBriefDesc(action.getWeaSetCustomBuildingStateSimple()))
        || (WarEventsActionsUtilsSetCustomCrystalStateExprGetBriefDesc(action.getWeaSetCustomCrystalStateExpr()))
        || (WarEventsActionsUtilsSetCustomCrystalStateSimpleGetBriefDesc(action.getWeaSetCustomCrystalStateSimple()))
        || (WarEventsActionsUtilsSetCustomCannonStateExprGetBriefDesc(action.getWeaSetCustomCannonStateExpr()))
        || (WarEventsActionsUtilsSetCustomCannonStateSimpleGetBriefDesc(action.getWeaSetCustomCannonStateSimple()))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateExprGetBriefDesc(action.getWeaSetCustomLaserTurretStateExpr()))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateSimpleGetBriefDesc(action.getWeaSetCustomLaserTurretStateSimple()))
        || (WarEventsActionsUtilsDeleteTileBuffExprGetBriefDesc(action.getWeaDeleteTileBuffExpr()))
        || (WarEventsActionsUtilsDeleteTileBuffSimpleGetBriefDesc(action.getWeaDeleteTileBuffSimple()))
        || (getBriefDesc(action.getWeaAddTileBuffExpr()))
        || (WarEventsActionsUtilsAddTileBuffSimpleGetBriefDesc(action.getWeaAddTileBuffSimple()))
        || (WarEventsActionsUtilsModifyTileBuffExprGetBriefDesc(action.getWeaModifyTileBuffExpr()))
        || (WarEventsActionsUtilsModifyTileBuffSimpleGetBriefDesc(action.getWeaModifyTileBuffSimple()))
        || (WarEventsActionsUtilsPersistentShowTextGetBriefDesc(action.getWeaPersistentShowText()))
        || (WarEventsActionsUtilsPersistentPlayBgmGetBriefDesc(action.getWeaPersistentPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPersistentModifyPlayerAttributeGetBriefDesc(action.getWeaPersistentModifyPlayerAttribute()))
        || (WarEventsActionsUtilsPersistentModifyUnitAttributeGetBriefDesc(action.getWeaPersistentModifyUnitAttribute()));
}
export function getDetailDescForAction(action: WarEventAction, gameConfig: GameConfig): string | null {
    // todo: add functions for other actions
    return (WarEventsActionsUtilsAddUnitOnMapSimpleGetDetailDesc(action.getWeaAddUnitOnMapSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitOnMapExprGetDetailDesc(action.getWeaFillUnitOnMapExpr()))
        || (WarEventsActionsUtilsFillUnitOnMapSimpleGetDetailDesc(action.getWeaFillUnitOnMapSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitLoadedSimpleGetDetailDesc(action.getWeaFillUnitLoadedSimple(), gameConfig))
        || (WarEventsActionsUtilsFillUnitLoadedExprGetDetailDesc(action.getWeaFillUnitLoadedExpr()))
        || (WarEventsActionsUtilsDestroyUnitSimpleGetDetailDesc(action.getWeaDestroyUnitSimple()))
        || (WarEventsActionsUtilsDestroyUnitExprGetDetailDesc(action.getWeaDestroyUnitExpr()))
        || (WarEventsActionsUtilsSetUnitTypeSimpleGetDetailDesc(action.getWeaSetUnitTypeSimple(), gameConfig))
        || (WarEventsActionsUtilsSetUnitTypeExprGetDetailDesc(action.getWeaSetUnitTypeExpr()))
        || (WarEventsActionsUtilsSetUnitOwnershipSimpleGetDetailDesc(action.getWeaSetUnitOwnershipSimple()))
        || (WarEventsActionsUtilsSetUnitOwnershipExprGetDetailDesc(action.getWeaSetUnitOwnershipExpr()))
        || (WarEventsActionsUtilsSetUnitPositionSimpleGetDetailDesc(action.getWeaSetUnitPositionSimple()))
        || (WarEventsActionsUtilsSetUnitPositionExprGetDetailDesc(action.getWeaSetUnitPositionExpr()))
        || (WarEventsActionsUtilsSetUnitStateSimpleGetDetailDesc(action.getWeaSetUnitStateSimple()))
        || (WarEventsActionsUtilsSetUnitStateExprGetDetailDesc(action.getWeaSetUnitStateExpr()))
        || (WarEventsActionsUtilsAddUnitBuffSimpleGetDetailDesc(action.getWeaAddUnitBuffSimple()))
        || (WarEventsActionsUtilsModifyUnitBuffSimpleGetDetailDesc(action.getWeaModifyUnitBuffSimple()))
        || (WarEventsActionsUtilsDeleteUnitBuffSimpleGetDetailDesc(action.getWeaDeleteUnitBuffSimple()))
        || (WarEventsActionsUtilsSetViewpointExprGetDetailDesc(action.getWeaSetViewpointExpr()))
        || (WarEventsActionsUtilsSetViewpointSimpleGetDetailDesc(action.getWeaSetViewpointSimple()))
        || (WarEventsActionsUtilsSetWeatherExprGetDetailDesc(action.getWeaSetWeatherExpr()))
        || (WarEventsActionsUtilsSetWeatherSimpleGetDetailDesc(action.getWeaSetWeatherSimple(), gameConfig))
        || (WarEventsActionsUtilsBigDialogueSimpleGetDetailDesc(action.getWeaBigDialogueSimple(), gameConfig))
        || (WarEventsActionsUtilsSmallDialogueSimpleGetDetailDesc(action.getWeaSmallDialogueSimple(), gameConfig))
        || (WarEventsActionsUtilsPlayBgmGetDetailDesc(action.getWeaPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPlaySfxGetDetailDesc(action.getWeaPlaySfx(), gameConfig))
        || (WarEventsActionsUtilsSetForceFogCodeExprGetDetailDesc(action.getWeaSetForceFogCodeExpr()))
        || (WarEventsActionsUtilsSetForceFogCodeSimpleGetDetailDesc(action.getWeaSetForceFogCodeSimple()))
        || (WarEventsActionsUtilsSetCustomCountersGetDetailDesc(action.getWeaSetCustomCounters()))
        || (WarEventsActionsUtilsStopPersistentActionGetDetailDesc(action.getWeaStopPersistentAction()))
        || (WarEventsActionsUtilsSetPlayerStateExprGetDetailDesc(action.getWeaSetPlayerStateExpr()))
        || (WarEventsActionsUtilsSetPlayerStateSimpleGetDetailDesc(action.getWeaSetPlayerStateSimple()))
        || (WarEventsActionsUtilsSetTaskObjectiveStateGetDetailDesc(action.getWeaSetTaskObjectiveState()))
        || (WarEventsActionsUtilsSetUnitMovePathVisibilityGetDetailDesc(action.getWeaSetUnitMovePathVisibility()))
        || (WarEventsActionsUtilsSetTileTypeExprGetDetailDesc(action.getWeaSetTileTypeExpr()))
        || (WarEventsActionsUtilsSetTileTypeSimpleGetDetailDesc(action.getWeaSetTileTypeSimple()))
        || (WarEventsActionsUtilsSetTileStateExprGetDetailDesc(action.getWeaSetTileStateExpr()))
        || (WarEventsActionsUtilsSetTileStateSimpleGetDetailDesc(action.getWeaSetTileStateSimple()))
        || (WarEventsActionsUtilsSetCustomBuildingStateExprGetDetailDesc(action.getWeaSetCustomBuildingStateExpr()))
        || (WarEventsActionsUtilsSetCustomBuildingStateSimpleGetDetailDesc(action.getWeaSetCustomBuildingStateSimple()))
        || (WarEventsActionsUtilsSetCustomCrystalStateExprGetDetailDesc(action.getWeaSetCustomCrystalStateExpr()))
        || (WarEventsActionsUtilsSetCustomCrystalStateSimpleGetDetailDesc(action.getWeaSetCustomCrystalStateSimple()))
        || (WarEventsActionsUtilsSetCustomCannonStateExprGetDetailDesc(action.getWeaSetCustomCannonStateExpr()))
        || (WarEventsActionsUtilsSetCustomCannonStateSimpleGetDetailDesc(action.getWeaSetCustomCannonStateSimple()))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateExprGetDetailDesc(action.getWeaSetCustomLaserTurretStateExpr()))
        || (WarEventsActionsUtilsSetCustomLaserTurretStateSimpleGetDetailDesc(action.getWeaSetCustomLaserTurretStateSimple()))
        || (WarEventsActionsUtilsDeleteTileBuffExprGetDetailDesc(action.getWeaDeleteTileBuffExpr()))
        || (WarEventsActionsUtilsDeleteTileBuffSimpleGetDetailDesc(action.getWeaDeleteTileBuffSimple()))
        || (getDetailDesc(action.getWeaAddTileBuffExpr()))
        || (WarEventsActionsUtilsAddTileBuffSimpleGetDetailDesc(action.getWeaAddTileBuffSimple()))
        || (WarEventsActionsUtilsModifyTileBuffExprGetDetailDesc(action.getWeaModifyTileBuffExpr()))
        || (WarEventsActionsUtilsModifyTileBuffSimpleGetDetailDesc(action.getWeaModifyTileBuffSimple()))
        || (WarEventsActionsUtilsPersistentShowTextGetDetailDesc(action.getWeaPersistentShowText()))
        || (WarEventsActionsUtilsPersistentPlayBgmGetDetailDesc(action.getWeaPersistentPlayBgm(), gameConfig))
        || (WarEventsActionsUtilsPersistentModifyPlayerAttributeGetDetailDesc(action.getWeaPersistentModifyPlayerAttribute()))
        || (WarEventsActionsUtilsPersistentModifyUnitAttributeGetDetailDesc(action.getWeaPersistentModifyUnitAttribute()));
}

export function getErrorTipForAction(fullData: WarEventFullData, action: WarEventAction, war: IBwWar): string | null {
    const actionsCountTotal = fullData.getActionArray().length;
    if (actionsCountTotal > MaxCounts.PerMap) {
        return `${getText(TextType.A0184)} (${actionsCountTotal}/${MaxCounts.PerMap})`;
    }

    // if (Object.keys(action.toJson()).length !== 2) {
    //     return Lang.getText(LangTextType.A0177);
    // }

    const actionId = action.getWeaCommonData()?.getActionId();
    if ((actionId == null) || (!checkIsValidWarEventActionId(actionId))) {
        return getText(TextType.A0177);
    }

    const playersCountUnneutral = war.getPlayersCountUnneutral();
    const gameConfig            = war.getGcData();
    const mapSize               = war.getTileMap().getMapSize();
    const customCounterNameSet  = new Set(fullData.getCustomCounterNameArray().map(v => v.getName() ?? ``));

    // todo: add more tips for the future actions.
    const weaAddUnitOnMapSimple = action.getWeaAddUnitOnMapSimple();
    if (weaAddUnitOnMapSimple) {
        return WarEventsActionsUtilsAddUnitOnMapSimpleGetErrorTip(weaAddUnitOnMapSimple, war);
    }

    const weaFillUnitOnMapExpr = action.getWeaFillUnitOnMapExpr();
    if (weaFillUnitOnMapExpr) {
        return WarEventsActionsUtilsFillUnitOnMapExprGetErrorTip(weaFillUnitOnMapExpr, customCounterNameSet);
    }

    const weaFillUnitOnMapSimple = action.getWeaFillUnitOnMapSimple();
    if (weaFillUnitOnMapSimple) {
        return WarEventsActionsUtilsFillUnitOnMapSimpleGetErrorTip(weaFillUnitOnMapSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaFillUnitLoadedSimple = action.getWeaFillUnitLoadedSimple();
    if (weaFillUnitLoadedSimple) {
        return WarEventsActionsUtilsFillUnitLoadedSimpleGetErrorTip(weaFillUnitLoadedSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaFillUnitLoadedExpr = action.getWeaFillUnitLoadedExpr();
    if (weaFillUnitLoadedExpr) {
        return WarEventsActionsUtilsFillUnitLoadedExprGetErrorTip(weaFillUnitLoadedExpr, customCounterNameSet);
    }

    const weaDestroyUnitSimple = action.getWeaDestroyUnitSimple();
    if (weaDestroyUnitSimple) {
        return WarEventsActionsUtilsDestroyUnitSimpleGetErrorTip(weaDestroyUnitSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDestroyUnitExpr = action.getWeaDestroyUnitExpr();
    if (weaDestroyUnitExpr) {
        return WarEventsActionsUtilsDestroyUnitExprGetErrorTip(weaDestroyUnitExpr, customCounterNameSet);
    }

    const weaSetUnitTypeSimple = action.getWeaSetUnitTypeSimple();
    if (weaSetUnitTypeSimple) {
        return WarEventsActionsUtilsSetUnitTypeSimpleGetErrorTip(weaSetUnitTypeSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitTypeExpr = action.getWeaSetUnitTypeExpr();
    if (weaSetUnitTypeExpr) {
        return WarEventsActionsUtilsSetUnitTypeExprGetErrorTip(weaSetUnitTypeExpr, customCounterNameSet);
    }

    const weaSetUnitOwnershipSimple = action.getWeaSetUnitOwnershipSimple();
    if (weaSetUnitOwnershipSimple) {
        return WarEventsActionsUtilsSetUnitOwnershipSimpleGetErrorTip(weaSetUnitOwnershipSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitOwnershipExpr = action.getWeaSetUnitOwnershipExpr();
    if (weaSetUnitOwnershipExpr) {
        return WarEventsActionsUtilsSetUnitOwnershipExprGetErrorTip(weaSetUnitOwnershipExpr, customCounterNameSet);
    }

    const weaSetUnitPositionSimple = action.getWeaSetUnitPositionSimple();
    if (weaSetUnitPositionSimple) {
        return WarEventsActionsUtilsSetUnitPositionSimpleGetErrorTip(weaSetUnitPositionSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitPositionExpr = action.getWeaSetUnitPositionExpr();
    if (weaSetUnitPositionExpr) {
        return WarEventsActionsUtilsSetUnitPositionExprGetErrorTip(weaSetUnitPositionExpr, customCounterNameSet);
    }

    const weaSetUnitStateSimple = action.getWeaSetUnitStateSimple();
    if (weaSetUnitStateSimple) {
        return WarEventsActionsUtilsSetUnitStateSimpleGetErrorTip(weaSetUnitStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitStateExpr = action.getWeaSetUnitStateExpr();
    if (weaSetUnitStateExpr) {
        return WarEventsActionsUtilsSetUnitStateExprGetErrorTip(weaSetUnitStateExpr, customCounterNameSet);
    }

    const weaAddUnitBuffSimple = action.getWeaAddUnitBuffSimple();
    if (weaAddUnitBuffSimple) {
        return WarEventsActionsUtilsAddUnitBuffSimpleGetErrorTip(weaAddUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaModifyUnitBuffSimple = action.getWeaModifyUnitBuffSimple();
    if (weaModifyUnitBuffSimple) {
        return WarEventsActionsUtilsModifyUnitBuffSimpleGetErrorTip(weaModifyUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDeleteUnitBuffSimple = action.getWeaDeleteUnitBuffSimple();
    if (weaDeleteUnitBuffSimple) {
        return WarEventsActionsUtilsDeleteUnitBuffSimpleGetErrorTip(weaDeleteUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetViewpointExpr = action.getWeaSetViewpointExpr();
    if (weaSetViewpointExpr) {
        return WarEventsActionsUtilsSetViewpointExprGetErrorTip(weaSetViewpointExpr, customCounterNameSet);
    }

    const weaSetViewpointSimple = action.getWeaSetViewpointSimple();
    if (weaSetViewpointSimple) {
        return WarEventsActionsUtilsSetViewpointSimpleGetErrorTip(weaSetViewpointSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetWeatherExpr = action.getWeaSetWeatherExpr();
    if (weaSetWeatherExpr) {
        return WarEventsActionsUtilsSetWeatherExprGetErrorTip(weaSetWeatherExpr, customCounterNameSet);
    }

    const weaSetWeatherSimple = action.getWeaSetWeatherSimple();
    if (weaSetWeatherSimple) {
        return WarEventsActionsUtilsSetWeatherSimpleGetErrorTip(weaSetWeatherSimple, gameConfig);
    }

    const weaBigDialogueSimple = action.getWeaBigDialogueSimple();
    if (weaBigDialogueSimple) {
        return WarEventsActionsUtilsBigDialogueSimpleGetErrorTip(weaBigDialogueSimple, playersCountUnneutral, gameConfig);
    }

    const weaSmallDialogueSimple = action.getWeaSmallDialogueSimple();
    if (weaSmallDialogueSimple) {
        return WarEventsActionsUtilsSmallDialogueSimpleGetErrorTip(weaSmallDialogueSimple, playersCountUnneutral, gameConfig);
    }

    const weaPlayBgm = action.getWeaPlayBgm();
    if (weaPlayBgm) {
        return WarEventsActionsUtilsPlayBgmGetErrorTip(weaPlayBgm);
    }

    const weaPlaySfx = action.getWeaPlaySfx();
    if (weaPlaySfx) {
        return WarEventsActionsUtilsPlaySfxGetErrorTip(weaPlaySfx);
    }

    const weaSetForceFogCodeExpr = action.getWeaSetForceFogCodeExpr();
    if (weaSetForceFogCodeExpr) {
        return WarEventsActionsUtilsSetForceFogCodeExprGetErrorTip(weaSetForceFogCodeExpr, customCounterNameSet);
    }

    const weaSetForceFogCodeSimple = action.getWeaSetForceFogCodeSimple();
    if (weaSetForceFogCodeSimple) {
        return WarEventsActionsUtilsSetForceFogCodeSimpleGetErrorTip(weaSetForceFogCodeSimple);
    }

    const weaSetCustomCounters = action.getWeaSetCustomCounters();
    if (weaSetCustomCounters) {
        return WarEventsActionsUtilsSetCustomCountersGetErrorTip(weaSetCustomCounters, customCounterNameSet);
    }

    const weaStopPersistentAction = action.getWeaStopPersistentAction();
    if (weaStopPersistentAction) {
        return WarEventsActionsUtilsStopPersistentActionGetErrorTip(weaStopPersistentAction, fullData);
    }

    const weaSetPlayerStateExpr = action.getWeaSetPlayerStateExpr();
    if (weaSetPlayerStateExpr) {
        return WarEventsActionsUtilsSetPlayerStateExprGetErrorTip(weaSetPlayerStateExpr, customCounterNameSet);
    }

    const weaSetPlayerStateSimple = action.getWeaSetPlayerStateSimple();
    if (weaSetPlayerStateSimple) {
        return WarEventsActionsUtilsSetPlayerStateSimpleGetErrorTip(weaSetPlayerStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetTaskObjectiveState = action.getWeaSetTaskObjectiveState();
    if (weaSetTaskObjectiveState) {
        return WarEventsActionsUtilsSetTaskObjectiveStateGetErrorTip(weaSetTaskObjectiveState, customCounterNameSet);
    }

    const weaSetUnitMovePathVisibility = action.getWeaSetUnitMovePathVisibility();
    if (weaSetUnitMovePathVisibility) {
        return WarEventsActionsUtilsSetUnitMovePathVisibilityGetErrorTip(weaSetUnitMovePathVisibility, customCounterNameSet);
    }

    const weaSetTileTypeExpr = action.getWeaSetTileTypeExpr();
    if (weaSetTileTypeExpr) {
        return WarEventsActionsUtilsSetTileTypeExprGetErrorTip(weaSetTileTypeExpr, customCounterNameSet);
    }

    const weaSetTileTypeSimple = action.getWeaSetTileTypeSimple();
    if (weaSetTileTypeSimple) {
        return WarEventsActionsUtilsSetTileTypeSimpleGetErrorTip(weaSetTileTypeSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetTileStateExpr = action.getWeaSetTileStateExpr();
    if (weaSetTileStateExpr) {
        return WarEventsActionsUtilsSetTileStateExprGetErrorTip(weaSetTileStateExpr, customCounterNameSet);
    }

    const weaSetTileStateSimple = action.getWeaSetTileStateSimple();
    if (weaSetTileStateSimple) {
        return WarEventsActionsUtilsSetTileStateSimpleGetErrorTip(weaSetTileStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomBuildingStateExpr = action.getWeaSetCustomBuildingStateExpr();
    if (weaSetCustomBuildingStateExpr) {
        return WarEventsActionsUtilsSetCustomBuildingStateExprGetErrorTip(weaSetCustomBuildingStateExpr, customCounterNameSet);
    }

    const weaSetCustomBuildingStateSimple = action.getWeaSetCustomBuildingStateSimple();
    if (weaSetCustomBuildingStateSimple) {
        return WarEventsActionsUtilsSetCustomBuildingStateSimpleGetErrorTip(weaSetCustomBuildingStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomCrystalStateExpr = action.getWeaSetCustomCrystalStateExpr();
    if (weaSetCustomCrystalStateExpr) {
        return WarEventsActionsUtilsSetCustomCrystalStateExprGetErrorTip(weaSetCustomCrystalStateExpr, customCounterNameSet);
    }

    const weaSetCustomCrystalStateSimple = action.getWeaSetCustomCrystalStateSimple();
    if (weaSetCustomCrystalStateSimple) {
        return WarEventsActionsUtilsSetCustomCrystalStateSimpleGetErrorTip(weaSetCustomCrystalStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomCannonStateExpr = action.getWeaSetCustomCannonStateExpr();
    if (weaSetCustomCannonStateExpr) {
        return WarEventsActionsUtilsSetCustomCannonStateExprGetErrorTip(weaSetCustomCannonStateExpr, customCounterNameSet);
    }

    const weaSetCustomCannonStateSimple = action.getWeaSetCustomCannonStateSimple();
    if (weaSetCustomCannonStateSimple) {
        return WarEventsActionsUtilsSetCustomCannonStateSimpleGetErrorTip(weaSetCustomCannonStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomLaserTurretStateExpr = action.getWeaSetCustomLaserTurretStateExpr();
    if (weaSetCustomLaserTurretStateExpr) {
        return WarEventsActionsUtilsSetCustomLaserTurretStateExprGetErrorTip(weaSetCustomLaserTurretStateExpr, customCounterNameSet);
    }

    const weaSetCustomLaserTurretStateSimple = action.getWeaSetCustomLaserTurretStateSimple();
    if (weaSetCustomLaserTurretStateSimple) {
        return WarEventsActionsUtilsSetCustomLaserTurretStateSimpleGetErrorTip(weaSetCustomLaserTurretStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDeleteTileBuffExpr = action.getWeaDeleteTileBuffExpr();
    if (weaDeleteTileBuffExpr) {
        return WarEventsActionsUtilsDeleteTileBuffExprGetErrorTip(weaDeleteTileBuffExpr, customCounterNameSet);
    }

    const weaDeleteTileBuffSimple = action.getWeaDeleteTileBuffSimple();
    if (weaDeleteTileBuffSimple) {
        return WarEventsActionsUtilsDeleteTileBuffSimpleGetErrorTip(weaDeleteTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaAddTileBuffExpr = action.getWeaAddTileBuffExpr();
    if (weaAddTileBuffExpr) {
        return getErrorTip(weaAddTileBuffExpr, customCounterNameSet);
    }

    const weaAddTileBuffSimple = action.getWeaAddTileBuffSimple();
    if (weaAddTileBuffSimple) {
        return WarEventsActionsUtilsAddTileBuffSimpleGetErrorTip(weaAddTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaModifyTileBuffExpr = action.getWeaModifyTileBuffExpr();
    if (weaModifyTileBuffExpr) {
        return WarEventsActionsUtilsModifyTileBuffExprGetErrorTip(weaModifyTileBuffExpr, customCounterNameSet);
    }

    const weaModifyTileBuffSimple = action.getWeaModifyTileBuffSimple();
    if (weaModifyTileBuffSimple) {
        return WarEventsActionsUtilsModifyTileBuffSimpleGetErrorTip(weaModifyTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaPersistentShowText = action.getWeaPersistentShowText();
    if (weaPersistentShowText) {
        return WarEventsActionsUtilsPersistentShowTextGetErrorTip(weaPersistentShowText);
    }

    const weaPersistentPlayBgm = action.getWeaPersistentPlayBgm();
    if (weaPersistentPlayBgm) {
        return WarEventsActionsUtilsPersistentPlayBgmGetErrorTip(weaPersistentPlayBgm);
    }

    const weaPersistentModifyPlayerAttribute = action.getWeaPersistentModifyPlayerAttribute();
    if (weaPersistentModifyPlayerAttribute) {
        return WarEventsActionsUtilsPersistentModifyPlayerAttributeGetErrorTip(weaPersistentModifyPlayerAttribute, customCounterNameSet);
    }

    const weaPersistentModifyUnitAttribute = action.getWeaPersistentModifyUnitAttribute();
    if (weaPersistentModifyUnitAttribute) {
        return WarEventsActionsUtilsPersistentModifyUnitAttributeGetErrorTip(weaPersistentModifyUnitAttribute, customCounterNameSet);
    }

    return getText(TextType.A0177);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function addDefaultAction({ fullData, eventId, nodeId, actionIndex }: {
    fullData        : WarEventFullData;
    eventId         : number;
    nodeId          : number;
    actionIndex     : number | null;
}): number | null {   // DONE
    const actionIdArray = getEvent(fullData, eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getActionIdArray();
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
            actionArray.sort((v1, v2) => getExisted(v1.getWeaCommonData()?.getActionId()) - getExisted(v2.getWeaCommonData()?.getActionId()));

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
            playerIndex : PlayerIndex.First,
            side        : SmallDialogueSideId.Bottom,
            nameArray   : [],
            textArray   : [
                { languageType: getCurrentLanguageType(), text: `...` },
            ],
        },
    });
}

export function cloneAction(fullData: WarEventFullData, srcActionId: number): number {
    const actionArray   = fullData.getActionArray();
    const newAction     = getExisted(actionArray.find(v => v.getWeaCommonData()?.getActionId() === srcActionId)).clone();
    actionArray.push(newAction);

    for (let actionId = 1; ; ++actionId) {
        if (actionArray.some(v => v.getWeaCommonData()?.getActionId() === actionId)) {
            continue;
        }

        getExisted(newAction.getWeaCommonData()).setActionId(actionId);
        actionArray.sort((v1, v2) => getExisted(v1.getWeaCommonData()?.getActionId()) - getExisted(v2.getWeaCommonData()?.getActionId()));
        return actionId;
    }
}

export function resetAction(action: WarEventAction, actionType: ActionTypeId, gameConfig: GameConfig): void {
    action.clearActionData();

    // todo handle future actions.
    if (actionType === ActionTypeId.AddUnitOnMapSimple) {
        action.setWeaAddUnitOnMapSimple(WeaAddUnitOnMapSimple.fromJson({
            unitArray   : [],
        }));
    } else if (actionType === ActionTypeId.FillUnitOnMapExpr) {
        action.setWeaFillUnitOnMapExpr(WeaFillUnitOnMapExpr.fromJson({
            conTileFilter                       : ``,
            actPlayerIndex                      : ``,
            actUnitType                         : ``,
        }));
    } else if (actionType === ActionTypeId.FillUnitOnMapSimple) {
        const unitData = createDefault({
            unitTypeId  : UnitTypeId.First,
            playerIndex : PlayerIndex.First,
            gridIndex   : { x: 0, y: 0 },
            unitId      : -1,
            gcData      : gameConfig,
        });
        unitData.setGridIndex(null);
        action.setWeaFillUnitOnMapSimple(WeaFillUnitOnMapSimple.fromJson({
            actUnitData : unitData.toJson(),
        }));
    } else if (actionType === ActionTypeId.FillUnitLoadedSimple) {
        const unitData = createDefault({
            unitTypeId  : UnitTypeId.First,
            playerIndex : PlayerIndex.First,
            gridIndex   : { x: 0, y: 0 },
            unitId      : -1,
            gcData      : gameConfig,
        });
        unitData.setGridIndex(null);
        action.setWeaFillUnitLoadedSimple(WeaFillUnitLoadedSimple.fromJson({
            actLoadCount    : 1,
            actUnitData : unitData.toJson(),
        }));
    } else if (actionType === ActionTypeId.FillUnitLoadedExpr) {
        action.setWeaFillUnitLoadedExpr(WeaFillUnitLoadedExpr.fromJson({
            conUnitFilter                       : ``,
            actUnitType                         : ``,
        }));
    } else if (actionType === ActionTypeId.DestroyUnitSimple) {
        action.setWeaDestroyUnitSimple(WeaDestroyUnitSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.DestroyUnitExpr) {
        action.setWeaDestroyUnitExpr(WeaDestroyUnitExpr.fromJson({
            conUnitFilter                       : ``,
        }));
    } else if (actionType === ActionTypeId.SetUnitTypeSimple) {
        action.setWeaSetUnitTypeSimple(WeaSetUnitTypeSimple.fromJson({
            actUnitType                         : UnitTypeId.First,
        }));
    } else if (actionType === ActionTypeId.SetUnitTypeExpr) {
        action.setWeaSetUnitTypeExpr(WeaSetUnitTypeExpr.fromJson({
            conUnitFilter                       : ``,
            actUnitType                         : ``,
        }));
    } else if (actionType === ActionTypeId.SetUnitOwnershipSimple) {
        action.setWeaSetUnitOwnershipSimple(WeaSetUnitOwnershipSimple.fromJson({
            actPlayerIndex                      : PlayerIndex.First,
        }));
    } else if (actionType === ActionTypeId.SetUnitOwnershipExpr) {
        action.setWeaSetUnitOwnershipExpr(WeaSetUnitOwnershipExpr.fromJson({
            conUnitFilter                       : ``,
            actPlayerIndex                      : ``,
        }));
    } else if (actionType === ActionTypeId.SetUnitPositionSimple) {
        action.setWeaSetUnitPositionSimple(WeaSetUnitPositionSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetUnitPositionExpr) {
        action.setWeaSetUnitPositionExpr(WeaSetUnitPositionExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetUnitStateSimple) {
        action.setWeaSetUnitStateSimple(WeaSetUnitStateSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetUnitStateExpr) {
        action.setWeaSetUnitStateExpr(WeaSetUnitStateExpr.fromJson({
            conUnitFilter                       : ``,
        }));
    } else if (actionType === ActionTypeId.AddUnitBuffSimple) {
        action.setWeaAddUnitBuffSimple(WeaAddUnitBuffSimple.fromJson({
            actBuffType     : UnitBuffsConstantsBuffTypeId.Fire,
            actExtraParams  : [],
        }));
    } else if (actionType === ActionTypeId.ModifyUnitBuffSimple) {
        action.setWeaModifyUnitBuffSimple(WeaModifyUnitBuffSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.DeleteUnitBuffSimple) {
        action.setWeaDeleteUnitBuffSimple(WeaDeleteUnitBuffSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetViewpointExpr) {
        action.setWeaSetViewpointExpr(WeaSetViewpointExpr.fromJson({
            targets         : ``,
        }));
    } else if (actionType === ActionTypeId.SetViewpointSimple) {
        action.setWeaSetViewpointSimple(WeaSetViewpointSimple.fromJson({
            actNeedFocusEffect  : true,
            actIsOneByOne       : true,
        }));
    } else if (actionType === ActionTypeId.SetWeatherSimple) {
        action.setWeaSetWeatherSimple(WeaSetWeatherSimple.fromJson({
            weatherType         : gameConfig.getDefaultWeatherType(),
            weatherTurnsCount   : 0,
        }));
    } else if (actionType === ActionTypeId.SetWeatherExpr) {
        action.setWeaSetWeatherExpr(WeaSetWeatherExpr.fromJson({
            weatherType         : "",
            weatherTurnsCount   : "",
        }));
    } else if (actionType === ActionTypeId.BigDialogueSimple) {
        action.setWeaBigDialogueSimple(WeaBigDialogueSimple.fromJson({
            backgroundId    : 0,
            dataArray       : [],
        }));
    } else if (actionType === ActionTypeId.SmallDialogueSimple) {
        action.setWeaSmallDialogueSimple(WeaSmallDialogueSimple.fromJson({
            dataArray       : [],
        }));
    } else if (actionType === ActionTypeId.PlayBgm) {
        action.setWeaPlayBgm(WeaPlayBgm.fromJson({
            useCoBgm        : false,
            bgmCode         : BgmSfxCode.None,
        }));
    } else if (actionType === ActionTypeId.PlaySfx) {
        action.setWeaPlaySfx(WeaPlaySfx.fromJson({
            sfxCode         : BgmSfxCode.None,
        }));
    } else if (actionType === ActionTypeId.SetForceFogCodeExpr) {
        action.setWeaSetForceFogCodeExpr(WeaSetForceFogCodeExpr.fromJson({
            forceFogCode    : ``,
        }));
    } else if (actionType === ActionTypeId.SetForceFogCodeSimple) {
        action.setWeaSetForceFogCodeSimple(WeaSetForceFogCodeSimple.fromJson({
            forceFogCode    : ForcedFogCode.Fog,
            turnsCount      : 0,
        }));
    } else if (actionType === ActionTypeId.SetCustomCounters) {
        action.setWeaSetCustomCounters(WeaSetCustomCounters.fromJson({
            idExpression            : "",
            valueExpression         : "",
        }));
    } else if (actionType === ActionTypeId.StopPersistentAction) {
        action.setWeaStopPersistentAction(WeaStopPersistentAction.fromJson({
            actionIdArray   : [],
        }));
    } else if (actionType === ActionTypeId.SetPlayerStateExpr) {
        action.setWeaSetPlayerStateExpr(WeaSetPlayerStateExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetPlayerStateSimple) {
        action.setWeaSetPlayerStateSimple(WeaSetPlayerStateSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetTaskObjectiveState) {
        action.setWeaSetTaskObjectiveState(WeaSetTaskObjectiveState.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetUnitMovePathVisibility) {
        action.setWeaSetUnitMovePathVisibility(WeaSetUnitMovePathVisibility.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetTileTypeExpr) {
        action.setWeaSetTileTypeExpr(WeaSetTileTypeExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetTileTypeSimple) {
        action.setWeaSetTileTypeSimple(WeaSetTileTypeSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetTileStateExpr) {
        action.setWeaSetTileStateExpr(WeaSetTileStateExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetTileStateSimple) {
        action.setWeaSetTileStateSimple(WeaSetTileStateSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetCustomBuildingStateExpr) {
        action.setWeaSetCustomBuildingStateExpr(WeaSetCustomBuildingStateExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetCustomBuildingStateSimple) {
        action.setWeaSetCustomBuildingStateSimple(WeaSetCustomBuildingStateSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetCustomCrystalStateExpr) {
        action.setWeaSetCustomCrystalStateExpr(WeaSetCustomCrystalStateExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetCustomCrystalStateSimple) {
        action.setWeaSetCustomCrystalStateSimple(WeaSetCustomCrystalStateSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetCustomCannonStateExpr) {
        action.setWeaSetCustomCannonStateExpr(WeaSetCustomCannonStateExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetCustomCannonStateSimple) {
        action.setWeaSetCustomCannonStateSimple(WeaSetCustomCannonStateSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetCustomLaserTurretStateExpr) {
        action.setWeaSetCustomLaserTurretStateExpr(WeaSetCustomLaserTurretStateExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.SetCustomLaserTurretStateSimple) {
        action.setWeaSetCustomLaserTurretStateSimple(WeaSetCustomLaserTurretStateSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.DeleteTileBuffExpr) {
        action.setWeaDeleteTileBuffExpr(WeaDeleteTileBuffExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.DeleteTileBuffSimple) {
        action.setWeaDeleteTileBuffSimple(WeaDeleteTileBuffSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.AddTileBuffExpr) {
        action.setWeaAddTileBuffExpr(WeaAddTileBuffExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.AddTileBuffSimple) {
        action.setWeaAddTileBuffSimple(WeaAddTileBuffSimple.fromJson({
            actBuffType     : BuffTypeId.NoIncome,
            actExtraParams  : [],
        }));
    } else if (actionType === ActionTypeId.ModifyTileBuffExpr) {
        action.setWeaModifyTileBuffExpr(WeaModifyTileBuffExpr.fromJson({
        }));
    } else if (actionType === ActionTypeId.ModifyTileBuffSimple) {
        action.setWeaModifyTileBuffSimple(WeaModifyTileBuffSimple.fromJson({
        }));
    } else if (actionType === ActionTypeId.PersistentShowText) {
        action.setWeaPersistentShowText(WeaPersistentShowText.fromJson({
            textArray: [],
        }));
    } else if (actionType === ActionTypeId.PersistentPlayBgm) {
        action.setWeaPersistentPlayBgm(WeaPersistentPlayBgm.fromJson({
            bgmCode     : BgmSfxCode.CoEmpty,
        }));
    } else if (actionType === ActionTypeId.PersistentModifyPlayerAttribute) {
        action.setWeaPersistentModifyPlayerAttribute(WeaPersistentModifyPlayerAttribute.fromJson({
        }));
    } else if (actionType === ActionTypeId.PersistentModifyUnitAttribute) {
        action.setWeaPersistentModifyUnitAttribute(WeaPersistentModifyUnitAttribute.fromJson({
            conUnitFilter               : ``,
        }));
    } else {
        throw newError(`Invalid actionType: ${actionType}.`, ClientErrorCode.WarEventHelper_ResetAction_00);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getActionTypeId(action: WarEventAction): ActionTypeId | null {
    // todo: handle future actions.
    if      (action.getWeaAddUnitOnMapSimple())                         { return ActionTypeId.AddUnitOnMapSimple; }
    else if (action.getWeaFillUnitOnMapExpr())                          { return ActionTypeId.FillUnitOnMapExpr; }
    else if (action.getWeaFillUnitOnMapSimple())                        { return ActionTypeId.FillUnitOnMapSimple; }
    else if (action.getWeaFillUnitLoadedSimple())                       { return ActionTypeId.FillUnitLoadedSimple; }
    else if (action.getWeaFillUnitLoadedExpr())                         { return ActionTypeId.FillUnitLoadedExpr; }
    else if (action.getWeaDestroyUnitSimple())                          { return ActionTypeId.DestroyUnitSimple; }
    else if (action.getWeaDestroyUnitExpr())                            { return ActionTypeId.DestroyUnitExpr; }
    else if (action.getWeaSetUnitTypeSimple())                          { return ActionTypeId.SetUnitTypeSimple; }
    else if (action.getWeaSetUnitTypeExpr())                            { return ActionTypeId.SetUnitTypeExpr; }
    else if (action.getWeaSetUnitOwnershipSimple())                     { return ActionTypeId.SetUnitOwnershipSimple; }
    else if (action.getWeaSetUnitOwnershipExpr())                       { return ActionTypeId.SetUnitOwnershipExpr; }
    else if (action.getWeaSetUnitPositionSimple())                      { return ActionTypeId.SetUnitPositionSimple; }
    else if (action.getWeaSetUnitPositionExpr())                        { return ActionTypeId.SetUnitPositionExpr; }
    else if (action.getWeaSetUnitStateSimple())                         { return ActionTypeId.SetUnitStateSimple; }
    else if (action.getWeaSetUnitStateExpr())                           { return ActionTypeId.SetUnitStateExpr; }
    else if (action.getWeaAddUnitBuffSimple())                          { return ActionTypeId.AddUnitBuffSimple; }
    else if (action.getWeaModifyUnitBuffSimple())                       { return ActionTypeId.ModifyUnitBuffSimple; }
    else if (action.getWeaDeleteUnitBuffSimple())                       { return ActionTypeId.DeleteUnitBuffSimple; }
    else if (action.getWeaSetViewpointExpr())                           { return ActionTypeId.SetViewpointExpr; }
    else if (action.getWeaSetViewpointSimple())                         { return ActionTypeId.SetViewpointSimple; }
    else if (action.getWeaSetWeatherSimple())                           { return ActionTypeId.SetWeatherSimple; }
    else if (action.getWeaSetWeatherExpr())                             { return ActionTypeId.SetWeatherExpr; }
    else if (action.getWeaBigDialogueSimple())                          { return ActionTypeId.BigDialogueSimple; }
    else if (action.getWeaSmallDialogueSimple())                        { return ActionTypeId.SmallDialogueSimple; }
    else if (action.getWeaPlayBgm())                                    { return ActionTypeId.PlayBgm; }
    else if (action.getWeaPlaySfx())                                    { return ActionTypeId.PlaySfx; }
    else if (action.getWeaSetForceFogCodeExpr())                        { return ActionTypeId.SetForceFogCodeExpr; }
    else if (action.getWeaSetForceFogCodeSimple())                      { return ActionTypeId.SetForceFogCodeSimple; }
    else if (action.getWeaSetCustomCounters())                          { return ActionTypeId.SetCustomCounters; }
    else if (action.getWeaStopPersistentAction())                       { return ActionTypeId.StopPersistentAction; }
    else if (action.getWeaSetPlayerStateExpr())                         { return ActionTypeId.SetPlayerStateExpr; }
    else if (action.getWeaSetPlayerStateSimple())                       { return ActionTypeId.SetPlayerStateSimple; }
    else if (action.getWeaSetTaskObjectiveState())                      { return ActionTypeId.SetTaskObjectiveState; }
    else if (action.getWeaSetUnitMovePathVisibility())                  { return ActionTypeId.SetUnitMovePathVisibility; }
    else if (action.getWeaSetTileTypeExpr())                            { return ActionTypeId.SetTileTypeExpr; }
    else if (action.getWeaSetTileTypeSimple())                          { return ActionTypeId.SetTileTypeSimple; }
    else if (action.getWeaSetTileStateExpr())                           { return ActionTypeId.SetTileStateExpr; }
    else if (action.getWeaSetTileStateSimple())                         { return ActionTypeId.SetTileStateSimple; }
    else if (action.getWeaSetCustomBuildingStateExpr())                 { return ActionTypeId.SetCustomBuildingStateExpr; }
    else if (action.getWeaSetCustomBuildingStateSimple())               { return ActionTypeId.SetCustomBuildingStateSimple; }
    else if (action.getWeaSetCustomCrystalStateExpr())                  { return ActionTypeId.SetCustomCrystalStateExpr; }
    else if (action.getWeaSetCustomCrystalStateSimple())                { return ActionTypeId.SetCustomCrystalStateSimple; }
    else if (action.getWeaSetCustomCannonStateExpr())                   { return ActionTypeId.SetCustomCannonStateExpr; }
    else if (action.getWeaSetCustomCannonStateSimple())                 { return ActionTypeId.SetCustomCannonStateSimple; }
    else if (action.getWeaSetCustomLaserTurretStateExpr())              { return ActionTypeId.SetCustomLaserTurretStateExpr; }
    else if (action.getWeaSetCustomLaserTurretStateSimple())            { return ActionTypeId.SetCustomLaserTurretStateSimple; }
    else if (action.getWeaDeleteTileBuffExpr())                         { return ActionTypeId.DeleteTileBuffExpr; }
    else if (action.getWeaDeleteTileBuffSimple())                       { return ActionTypeId.DeleteTileBuffSimple; }
    else if (action.getWeaAddTileBuffExpr())                            { return ActionTypeId.AddTileBuffExpr; }
    else if (action.getWeaAddTileBuffSimple())                          { return ActionTypeId.AddTileBuffSimple; }
    else if (action.getWeaModifyTileBuffExpr())                         { return ActionTypeId.ModifyTileBuffExpr; }
    else if (action.getWeaModifyTileBuffSimple())                       { return ActionTypeId.ModifyTileBuffSimple; }
    else if (action.getWeaPersistentShowText())                         { return ActionTypeId.PersistentShowText; }
    else if (action.getWeaPersistentPlayBgm())                          { return ActionTypeId.PersistentPlayBgm; }
    else if (action.getWeaPersistentModifyPlayerAttribute())            { return ActionTypeId.PersistentModifyPlayerAttribute; }
    else if (action.getWeaPersistentModifyUnitAttribute())              { return ActionTypeId.PersistentModifyUnitAttribute; }
    else                                                                { return null; }
}
export function getInterchangeableTypeId(action: WarEventAction): InterchangeableTypeId {
    const actionType = getActionTypeId(action);
    if (actionType == null) {
        return InterchangeableTypeId.NotInterchangeable;
    } else if (PersistentInterchangeableActionTypeArray.includes(actionType)) {
        return InterchangeableTypeId.Persistent;
    } else if (InstantInterchangeableActionTypeArray.includes(actionType)) {
        return InterchangeableTypeId.Instant;
    } else {
        return InterchangeableTypeId.NotInterchangeable;
    }
}
