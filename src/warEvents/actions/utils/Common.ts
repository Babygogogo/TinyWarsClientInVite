import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { SmallDialogueSideId } from "../../../dialogues/Constants.ts";
import { ForcedFogCode } from "../../../fogMaps/Constants.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import {
    closePanel,
    openPanel,
} from "../../../gamePanels/Manager.ts";
import {
    newError,
    getExisted,
} from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    checkIsValidLanguageTextArray,
    getText,
    getCurrentLanguageType,
} from "../../../lang/Utils.ts";
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
import { BuffTypeId as TileBuffsBuffTypeId } from "../../../tileBuffs/Constants.ts";
import { BuffTypeId as UnitBuffsBuffTypeId } from "../../../unitBuffs/Constants.ts";
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
import {
    checkIsValid as checkAddTileBuffExprIsValid,
    getBriefDesc as getAddTileBuffExprBriefDesc,
    getDetailDesc as getAddTileBuffExprDetailDesc,
    getErrorTip as getAddTileBuffExprErrorTip,
} from "./AddTileBuffExpr.ts";
import {
    checkIsValid as checkAddTileBuffSimpleIsValid,
    getBriefDesc as getAddTileBuffSimpleBriefDesc,
    getDetailDesc as getAddTileBuffSimpleDetailDesc,
    getErrorTip as getAddTileBuffSimpleErrorTip,
} from "./AddTileBuffSimple.ts";
import {
    checkIsValid as checkAddUnitBuffSimpleIsValid,
    getBriefDesc as getAddUnitBuffSimpleBriefDesc,
    getDetailDesc as getAddUnitBuffSimpleDetailDesc,
    getErrorTip as getAddUnitBuffSimpleErrorTip,
} from "./AddUnitBuffSimple.ts";
import {
    checkIsValid as checkAddUnitOnMapSimpleIsValid,
    getBriefDesc as getAddUnitOnMapSimpleBriefDesc,
    getDetailDesc as getAddUnitOnMapSimpleDetailDesc,
    getErrorTip as getAddUnitOnMapSimpleErrorTip,
} from "./AddUnitOnMapSimple.ts";
import {
    checkIsValid as checkBigDialogueSimpleIsValid,
    getBriefDesc as getBigDialogueSimpleBriefDesc,
    getDetailDesc as getBigDialogueSimpleDetailDesc,
    getErrorTip as getBigDialogueSimpleErrorTip,
} from "./BigDialogueSimple.ts";
import {
    checkIsValid as checkDeleteTileBuffExprIsValid,
    getBriefDesc as getDeleteTileBuffExprBriefDesc,
    getDetailDesc as getDeleteTileBuffExprDetailDesc,
    getErrorTip as getDeleteTileBuffExprErrorTip,
} from "./DeleteTileBuffExpr.ts";
import {
    checkIsValid as checkDeleteTileBuffSimpleIsValid,
    getBriefDesc as getDeleteTileBuffSimpleBriefDesc,
    getDetailDesc as getDeleteTileBuffSimpleDetailDesc,
    getErrorTip as getDeleteTileBuffSimpleErrorTip,
} from "./DeleteTileBuffSimple.ts";
import {
    checkIsValid as checkDeleteUnitBuffSimpleIsValid,
    getBriefDesc as getDeleteUnitBuffSimpleBriefDesc,
    getDetailDesc as getDeleteUnitBuffSimpleDetailDesc,
    getErrorTip as getDeleteUnitBuffSimpleErrorTip,
} from "./DeleteUnitBuffSimple.ts";
import {
    checkIsValid as checkDestroyUnitExprIsValid,
    getBriefDesc as getDestroyUnitExprBriefDesc,
    getDetailDesc as getDestroyUnitExprDetailDesc,
    getErrorTip as getDestroyUnitExprErrorTip,
} from "./DestroyUnitExpr.ts";
import {
    checkIsValid as checkDestroyUnitSimpleIsValid,
    getBriefDesc as getDestroyUnitSimpleBriefDesc,
    getDetailDesc as getDestroyUnitSimpleDetailDesc,
    getErrorTip as getDestroyUnitSimpleErrorTip,
} from "./DestroyUnitSimple.ts";
import {
    checkIsValid as checkFillUnitLoadedExprIsValid,
    getBriefDesc as getFillUnitLoadedExprBriefDesc,
    getDetailDesc as getFillUnitLoadedExprDetailDesc,
    getErrorTip as getFillUnitLoadedExprErrorTip,
} from "./FillUnitLoadedExpr.ts";
import {
    checkIsValid as checkFillUnitLoadedSimpleIsValid,
    getBriefDesc as getFillUnitLoadedSimpleBriefDesc,
    getDetailDesc as getFillUnitLoadedSimpleDetailDesc,
    getErrorTip as getFillUnitLoadedSimpleErrorTip,
} from "./FillUnitLoadedSimple.ts";
import {
    checkIsValid as checkFillUnitOnMapExprIsValid,
    getBriefDesc as getFillUnitOnMapExprBriefDesc,
    getDetailDesc as getFillUnitOnMapExprDetailDesc,
    getErrorTip as getFillUnitOnMapExprErrorTip,
} from "./FillUnitOnMapExpr.ts";
import {
    checkIsValid as checkFillUnitOnMapSimpleIsValid,
    getBriefDesc as getFillUnitOnMapSimpleBriefDesc,
    getDetailDesc as getFillUnitOnMapSimpleDetailDesc,
    getErrorTip as getFillUnitOnMapSimpleErrorTip,
} from "./FillUnitOnMapSimple.ts";
import {
    checkIsValid as checkModifyTileBuffExprIsValid,
    getBriefDesc as getModifyTileBuffExprBriefDesc,
    getDetailDesc as getModifyTileBuffExprDetailDesc,
    getErrorTip as getModifyTileBuffExprErrorTip,
} from "./ModifyTileBuffExpr.ts";
import {
    checkIsValid as checkModifyTileBuffSimpleIsValid,
    getBriefDesc as getModifyTileBuffSimpleBriefDesc,
    getDetailDesc as getModifyTileBuffSimpleDetailDesc,
    getErrorTip as getModifyTileBuffSimpleErrorTip,
} from "./ModifyTileBuffSimple.ts";
import {
    checkIsValid as checkModifyUnitBuffSimpleIsValid,
    getBriefDesc as getModifyUnitBuffSimpleBriefDesc,
    getDetailDesc as getModifyUnitBuffSimpleDetailDesc,
    getErrorTip as getModifyUnitBuffSimpleErrorTip,
} from "./ModifyUnitBuffSimple.ts";
import {
    checkIsValid as checkPersistentModifyPlayerAttributeIsValid,
    getBriefDesc as getPersistentModifyPlayerAttributeBriefDesc,
    getDetailDesc as getPersistentModifyPlayerAttributeDetailDesc,
    getErrorTip as getPersistentModifyPlayerAttributeErrorTip,
} from "./PersistentModifyPlayerAttribute.ts";
import {
    checkIsValid as checkPersistentModifyUnitAttributeIsValid,
    getBriefDesc as getPersistentModifyUnitAttributeBriefDesc,
    getDetailDesc as getPersistentModifyUnitAttributeDetailDesc,
    getErrorTip as getPersistentModifyUnitAttributeErrorTip,
} from "./PersistentModifyUnitAttribute.ts";
import {
    checkIsValid as checkPersistentPlayBgmIsValid,
    getBriefDesc as getPersistentPlayBgmBriefDesc,
    getDetailDesc as getPersistentPlayBgmDetailDesc,
    getErrorTip as getPersistentPlayBgmErrorTip,
} from "./PersistentPlayBgm.ts";
import {
    checkIsValid as checkPersistentShowTextIsValid,
    getBriefDesc as getPersistentShowTextBriefDesc,
    getDetailDesc as getPersistentShowTextDetailDesc,
    getErrorTip as getPersistentShowTextErrorTip,
} from "./PersistentShowText.ts";
import {
    checkIsValid as checkPlayBgmIsValid,
    getBriefDesc as getPlayBgmBriefDesc,
    getDetailDesc as getPlayBgmDetailDesc,
    getErrorTip as getPlayBgmErrorTip,
} from "./PlayBgm.ts";
import {
    checkIsValid as checkPlaySfxIsValid,
    getBriefDesc as getPlaySfxBriefDesc,
    getDetailDesc as getPlaySfxDetailDesc,
    getErrorTip as getPlaySfxErrorTip,
} from "./PlaySfx.ts";
import {
    checkIsValid as checkSetCustomBuildingStateExprIsValid,
    getBriefDesc as getSetCustomBuildingStateExprBriefDesc,
    getDetailDesc as getSetCustomBuildingStateExprDetailDesc,
    getErrorTip as getSetCustomBuildingStateExprErrorTip,
} from "./SetCustomBuildingStateExpr.ts";
import {
    checkIsValid as checkSetCustomBuildingStateSimpleIsValid,
    getBriefDesc as getSetCustomBuildingStateSimpleBriefDesc,
    getDetailDesc as getSetCustomBuildingStateSimpleDetailDesc,
    getErrorTip as getSetCustomBuildingStateSimpleErrorTip,
} from "./SetCustomBuildingStateSimple.ts";
import {
    checkIsValid as checkSetCustomCannonStateExprIsValid,
    getBriefDesc as getSetCustomCannonStateExprBriefDesc,
    getDetailDesc as getSetCustomCannonStateExprDetailDesc,
    getErrorTip as getSetCustomCannonStateExprErrorTip,
} from "./SetCustomCannonStateExpr.ts";
import {
    checkIsValid as checkSetCustomCannonStateSimpleIsValid,
    getBriefDesc as getSetCustomCannonStateSimpleBriefDesc,
    getDetailDesc as getSetCustomCannonStateSimpleDetailDesc,
    getErrorTip as getSetCustomCannonStateSimpleErrorTip,
} from "./SetCustomCannonStateSimple.ts";
import {
    checkIsValid as checkSetCustomCountersIsValid,
    getBriefDesc as getSetCustomCountersBriefDesc,
    getDetailDesc as getSetCustomCountersDetailDesc,
    getErrorTip as getSetCustomCountersErrorTip,
} from "./SetCustomCounters.ts";
import {
    checkIsValid as checkSetCustomCrystalStateExprIsValid,
    getBriefDesc as getSetCustomCrystalStateExprBriefDesc,
    getDetailDesc as getSetCustomCrystalStateExprDetailDesc,
    getErrorTip as getSetCustomCrystalStateExprErrorTip,
} from "./SetCustomCrystalStateExpr.ts";
import {
    checkIsValid as checkSetCustomCrystalStateSimpleIsValid,
    getBriefDesc as getSetCustomCrystalStateSimpleBriefDesc,
    getDetailDesc as getSetCustomCrystalStateSimpleDetailDesc,
    getErrorTip as getSetCustomCrystalStateSimpleErrorTip,
} from "./SetCustomCrystalStateSimple.ts";
import {
    checkIsValid as checkSetCustomLaserTurretStateExprIsValid,
    getBriefDesc as getSetCustomLaserTurretStateExprBriefDesc,
    getDetailDesc as getSetCustomLaserTurretStateExprDetailDesc,
    getErrorTip as getSetCustomLaserTurretStateExprErrorTip,
} from "./SetCustomLaserTurretStateExpr.ts";
import {
    checkIsValid as checkSetCustomLaserTurretStateSimpleIsValid,
    getBriefDesc as getSetCustomLaserTurretStateSimpleBriefDesc,
    getDetailDesc as getSetCustomLaserTurretStateSimpleDetailDesc,
    getErrorTip as getSetCustomLaserTurretStateSimpleErrorTip,
} from "./SetCustomLaserTurretStateSimple.ts";
import {
    checkIsValid as checkSetForceFogCodeExprIsValid,
    getBriefDesc as getSetForceFogCodeExprBriefDesc,
    getDetailDesc as getSetForceFogCodeExprDetailDesc,
    getErrorTip as getSetForceFogCodeExprErrorTip,
} from "./SetForceFogCodeExpr.ts";
import {
    checkIsValid as checkSetForceFogCodeSimpleIsValid,
    getBriefDesc as getSetForceFogCodeSimpleBriefDesc,
    getDetailDesc as getSetForceFogCodeSimpleDetailDesc,
    getErrorTip as getSetForceFogCodeSimpleErrorTip,
} from "./SetForceFogCodeSimple.ts";
import {
    checkIsValid as checkSetPlayerStateExprIsValid,
    getBriefDesc as getSetPlayerStateExprBriefDesc,
    getDetailDesc as getSetPlayerStateExprDetailDesc,
    getErrorTip as getSetPlayerStateExprErrorTip,
} from "./SetPlayerStateExpr.ts";
import {
    checkIsValid as checkSetPlayerStateSimpleIsValid,
    getBriefDesc as getSetPlayerStateSimpleBriefDesc,
    getDetailDesc as getSetPlayerStateSimpleDetailDesc,
    getErrorTip as getSetPlayerStateSimpleErrorTip,
} from "./SetPlayerStateSimple.ts";
import {
    checkIsValid as checkSetTaskObjectiveStateIsValid,
    getBriefDesc as getSetTaskObjectiveStateBriefDesc,
    getDetailDesc as getSetTaskObjectiveStateDetailDesc,
    getErrorTip as getSetTaskObjectiveStateErrorTip,
} from "./SetTaskObjectiveState.ts";
import {
    checkIsValid as checkSetTileStateExprIsValid,
    getBriefDesc as getSetTileStateExprBriefDesc,
    getDetailDesc as getSetTileStateExprDetailDesc,
    getErrorTip as getSetTileStateExprErrorTip,
} from "./SetTileStateExpr.ts";
import {
    checkIsValid as checkSetTileStateSimpleIsValid,
    getBriefDesc as getSetTileStateSimpleBriefDesc,
    getDetailDesc as getSetTileStateSimpleDetailDesc,
    getErrorTip as getSetTileStateSimpleErrorTip,
} from "./SetTileStateSimple.ts";
import {
    checkIsValid as checkSetTileTypeExprIsValid,
    getBriefDesc as getSetTileTypeExprBriefDesc,
    getDetailDesc as getSetTileTypeExprDetailDesc,
    getErrorTip as getSetTileTypeExprErrorTip,
} from "./SetTileTypeExpr.ts";
import {
    checkIsValid as checkSetTileTypeSimpleIsValid,
    getBriefDesc as getSetTileTypeSimpleBriefDesc,
    getDetailDesc as getSetTileTypeSimpleDetailDesc,
    getErrorTip as getSetTileTypeSimpleErrorTip,
} from "./SetTileTypeSimple.ts";
import {
    checkIsValid as checkSetUnitMovePathVisibilityIsValid,
    getBriefDesc as getSetUnitMovePathVisibilityBriefDesc,
    getDetailDesc as getSetUnitMovePathVisibilityDetailDesc,
    getErrorTip as getSetUnitMovePathVisibilityErrorTip,
} from "./SetUnitMovePathVisibility.ts";
import {
    checkIsValid as checkSetUnitOwnershipExprIsValid,
    getBriefDesc as getSetUnitOwnershipExprBriefDesc,
    getDetailDesc as getSetUnitOwnershipExprDetailDesc,
    getErrorTip as getSetUnitOwnershipExprErrorTip,
} from "./SetUnitOwnershipExpr.ts";
import {
    checkIsValid as checkSetUnitOwnershipSimpleIsValid,
    getBriefDesc as getSetUnitOwnershipSimpleBriefDesc,
    getDetailDesc as getSetUnitOwnershipSimpleDetailDesc,
    getErrorTip as getSetUnitOwnershipSimpleErrorTip,
} from "./SetUnitOwnershipSimple.ts";
import {
    checkIsValid as checkSetUnitPositionExprIsValid,
    getBriefDesc as getSetUnitPositionExprBriefDesc,
    getDetailDesc as getSetUnitPositionExprDetailDesc,
    getErrorTip as getSetUnitPositionExprErrorTip,
} from "./SetUnitPositionExpr.ts";
import {
    checkIsValid as checkSetUnitPositionSimpleIsValid,
    getBriefDesc as getSetUnitPositionSimpleBriefDesc,
    getDetailDesc as getSetUnitPositionSimpleDetailDesc,
    getErrorTip as getSetUnitPositionSimpleErrorTip,
} from "./SetUnitPositionSimple.ts";
import {
    checkIsValid as checkSetUnitStateExprIsValid,
    getBriefDesc as getSetUnitStateExprBriefDesc,
    getDetailDesc as getSetUnitStateExprDetailDesc,
    getErrorTip as getSetUnitStateExprErrorTip,
} from "./SetUnitStateExpr.ts";
import {
    checkIsValid as checkSetUnitStateSimpleIsValid,
    getBriefDesc as getSetUnitStateSimpleBriefDesc,
    getDetailDesc as getSetUnitStateSimpleDetailDesc,
    getErrorTip as getSetUnitStateSimpleErrorTip,
} from "./SetUnitStateSimple.ts";
import {
    checkIsValid as checkSetUnitTypeExprIsValid,
    getBriefDesc as getSetUnitTypeExprBriefDesc,
    getDetailDesc as getSetUnitTypeExprDetailDesc,
    getErrorTip as getSetUnitTypeExprErrorTip,
} from "./SetUnitTypeExpr.ts";
import {
    checkIsValid as checkSetUnitTypeSimpleIsValid,
    getBriefDesc as getSetUnitTypeSimpleBriefDesc,
    getDetailDesc as getSetUnitTypeSimpleDetailDesc,
    getErrorTip as getSetUnitTypeSimpleErrorTip,
} from "./SetUnitTypeSimple.ts";
import {
    checkIsValid as checkSetViewpointExprIsValid,
    getBriefDesc as getSetViewpointExprBriefDesc,
    getDetailDesc as getSetViewpointExprDetailDesc,
    getErrorTip as getSetViewpointExprErrorTip,
} from "./SetViewpointExpr.ts";
import {
    checkIsValid as checkSetViewpointSimpleIsValid,
    getBriefDesc as getSetViewpointSimpleBriefDesc,
    getDetailDesc as getSetViewpointSimpleDetailDesc,
    getErrorTip as getSetViewpointSimpleErrorTip,
} from "./SetViewpointSimple.ts";
import {
    checkIsValid as checkSetWeatherExprIsValid,
    getBriefDesc as getSetWeatherExprBriefDesc,
    getDetailDesc as getSetWeatherExprDetailDesc,
    getErrorTip as getSetWeatherExprErrorTip,
} from "./SetWeatherExpr.ts";
import {
    checkIsValid as checkSetWeatherSimpleIsValid,
    getBriefDesc as getSetWeatherSimpleBriefDesc,
    getDetailDesc as getSetWeatherSimpleDetailDesc,
    getErrorTip as getSetWeatherSimpleErrorTip,
} from "./SetWeatherSimple.ts";
import {
    checkIsValid as checkSmallDialogueSimpleIsValid,
    getBriefDesc as getSmallDialogueSimpleBriefDesc,
    getDetailDesc as getSmallDialogueSimpleDetailDesc,
    getErrorTip as getSmallDialogueSimpleErrorTip,
} from "./SmallDialogueSimple.ts";
import {
    checkIsValid as checkStopPersistentActionIsValid,
    getBriefDesc as getStopPersistentActionBriefDesc,
    getDetailDesc as getStopPersistentActionDetailDesc,
    getErrorTip as getStopPersistentActionErrorTip,
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
    return (checkAddUnitOnMapSimpleIsValid({ action: action.getWeaAddUnitOnMapSimple(), gameConfig, mapSize, playersCountUnneutral }))
        || (checkFillUnitOnMapExprIsValid(action.getWeaFillUnitOnMapExpr(), customCounterNameSet))
        || (checkFillUnitOnMapSimpleIsValid(action.getWeaFillUnitOnMapSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkFillUnitLoadedSimpleIsValid(action.getWeaFillUnitLoadedSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkFillUnitLoadedExprIsValid(action.getWeaFillUnitLoadedExpr(), customCounterNameSet))
        || (checkDestroyUnitSimpleIsValid(action.getWeaDestroyUnitSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkDestroyUnitExprIsValid(action.getWeaDestroyUnitExpr(), customCounterNameSet))
        || (checkSetUnitTypeSimpleIsValid(action.getWeaSetUnitTypeSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetUnitTypeExprIsValid(action.getWeaSetUnitTypeExpr(), customCounterNameSet))
        || (checkSetUnitOwnershipSimpleIsValid(action.getWeaSetUnitOwnershipSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetUnitOwnershipExprIsValid(action.getWeaSetUnitOwnershipExpr(), customCounterNameSet))
        || (checkSetUnitPositionSimpleIsValid(action.getWeaSetUnitPositionSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetUnitPositionExprIsValid(action.getWeaSetUnitPositionExpr(), customCounterNameSet))
        || (checkSetUnitStateSimpleIsValid(action.getWeaSetUnitStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetUnitStateExprIsValid(action.getWeaSetUnitStateExpr(), customCounterNameSet))
        || (checkAddUnitBuffSimpleIsValid(action.getWeaAddUnitBuffSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkModifyUnitBuffSimpleIsValid(action.getWeaModifyUnitBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (checkDeleteUnitBuffSimpleIsValid(action.getWeaDeleteUnitBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (checkSetViewpointExprIsValid(action.getWeaSetViewpointExpr(), customCounterNameSet))
        || (checkSetViewpointSimpleIsValid(action.getWeaSetViewpointSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetWeatherExprIsValid(action.getWeaSetWeatherExpr(), customCounterNameSet))
        || (checkSetWeatherSimpleIsValid(action.getWeaSetWeatherSimple(), gameConfig))
        || (checkBigDialogueSimpleIsValid(action.getWeaBigDialogueSimple(), playersCountUnneutral, gameConfig))
        || (checkSmallDialogueSimpleIsValid(action.getWeaSmallDialogueSimple(), playersCountUnneutral, gameConfig))
        || (checkPlayBgmIsValid(action.getWeaPlayBgm(), gameConfig))
        || (checkPlaySfxIsValid(action.getWeaPlaySfx()))
        || (checkSetForceFogCodeExprIsValid(action.getWeaSetForceFogCodeExpr(), customCounterNameSet))
        || (checkSetForceFogCodeSimpleIsValid(action.getWeaSetForceFogCodeSimple()))
        || (checkSetCustomCountersIsValid(action.getWeaSetCustomCounters(), customCounterNameSet))
        || (checkStopPersistentActionIsValid(action.getWeaStopPersistentAction()))
        || (checkSetPlayerStateExprIsValid(action.getWeaSetPlayerStateExpr(), customCounterNameSet))
        || (checkSetPlayerStateSimpleIsValid(action.getWeaSetPlayerStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetTaskObjectiveStateIsValid(action.getWeaSetTaskObjectiveState(), customCounterNameSet))
        || (checkSetUnitMovePathVisibilityIsValid(action.getWeaSetUnitMovePathVisibility(), customCounterNameSet))
        || (checkSetTileTypeExprIsValid(action.getWeaSetTileTypeExpr(), customCounterNameSet))
        || (checkSetTileTypeSimpleIsValid(action.getWeaSetTileTypeSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetTileStateExprIsValid(action.getWeaSetTileStateExpr(), customCounterNameSet))
        || (checkSetTileStateSimpleIsValid(action.getWeaSetTileStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetCustomBuildingStateExprIsValid(action.getWeaSetCustomBuildingStateExpr(), customCounterNameSet))
        || (checkSetCustomBuildingStateSimpleIsValid(action.getWeaSetCustomBuildingStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetCustomCrystalStateExprIsValid(action.getWeaSetCustomCrystalStateExpr(), customCounterNameSet))
        || (checkSetCustomCrystalStateSimpleIsValid(action.getWeaSetCustomCrystalStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetCustomCannonStateExprIsValid(action.getWeaSetCustomCannonStateExpr(), customCounterNameSet))
        || (checkSetCustomCannonStateSimpleIsValid(action.getWeaSetCustomCannonStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkSetCustomLaserTurretStateExprIsValid(action.getWeaSetCustomLaserTurretStateExpr(), customCounterNameSet))
        || (checkSetCustomLaserTurretStateSimpleIsValid(action.getWeaSetCustomLaserTurretStateSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkDeleteTileBuffExprIsValid(action.getWeaDeleteTileBuffExpr(), customCounterNameSet))
        || (checkDeleteTileBuffSimpleIsValid(action.getWeaDeleteTileBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (checkAddTileBuffExprIsValid(action.getWeaAddTileBuffExpr(), customCounterNameSet))
        || (checkAddTileBuffSimpleIsValid(action.getWeaAddTileBuffSimple(), gameConfig, mapSize, playersCountUnneutral))
        || (checkModifyTileBuffExprIsValid(action.getWeaModifyTileBuffExpr(), customCounterNameSet))
        || (checkModifyTileBuffSimpleIsValid(action.getWeaModifyTileBuffSimple(), mapSize, playersCountUnneutral, gameConfig))
        || (checkPersistentShowTextIsValid(action.getWeaPersistentShowText()))
        || (checkPersistentPlayBgmIsValid(action.getWeaPersistentPlayBgm()))
        || (checkPersistentModifyPlayerAttributeIsValid(action.getWeaPersistentModifyPlayerAttribute(), customCounterNameSet))
        || (checkPersistentModifyUnitAttributeIsValid(action.getWeaPersistentModifyUnitAttribute(), customCounterNameSet));
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
    return (getAddUnitOnMapSimpleBriefDesc(action.getWeaAddUnitOnMapSimple(), gameConfig))
        || (getFillUnitOnMapExprBriefDesc(action.getWeaFillUnitOnMapExpr()))
        || (getFillUnitOnMapSimpleBriefDesc(action.getWeaFillUnitOnMapSimple(), gameConfig))
        || (getFillUnitLoadedSimpleBriefDesc(action.getWeaFillUnitLoadedSimple(), gameConfig))
        || (getFillUnitLoadedExprBriefDesc(action.getWeaFillUnitLoadedExpr()))
        || (getDestroyUnitSimpleBriefDesc(action.getWeaDestroyUnitSimple()))
        || (getDestroyUnitExprBriefDesc(action.getWeaDestroyUnitExpr()))
        || (getSetUnitTypeSimpleBriefDesc(action.getWeaSetUnitTypeSimple(), gameConfig))
        || (getSetUnitTypeExprBriefDesc(action.getWeaSetUnitTypeExpr()))
        || (getSetUnitOwnershipSimpleBriefDesc(action.getWeaSetUnitOwnershipSimple()))
        || (getSetUnitOwnershipExprBriefDesc(action.getWeaSetUnitOwnershipExpr()))
        || (getSetUnitPositionSimpleBriefDesc(action.getWeaSetUnitPositionSimple()))
        || (getSetUnitPositionExprBriefDesc(action.getWeaSetUnitPositionExpr()))
        || (getSetUnitStateSimpleBriefDesc(action.getWeaSetUnitStateSimple()))
        || (getSetUnitStateExprBriefDesc(action.getWeaSetUnitStateExpr()))
        || (getAddUnitBuffSimpleBriefDesc(action.getWeaAddUnitBuffSimple()))
        || (getModifyUnitBuffSimpleBriefDesc(action.getWeaModifyUnitBuffSimple()))
        || (getDeleteUnitBuffSimpleBriefDesc(action.getWeaDeleteUnitBuffSimple()))
        || (getSetViewpointExprBriefDesc(action.getWeaSetViewpointExpr()))
        || (getSetViewpointSimpleBriefDesc(action.getWeaSetViewpointSimple()))
        || (getSetWeatherExprBriefDesc(action.getWeaSetWeatherExpr()))
        || (getSetWeatherSimpleBriefDesc(action.getWeaSetWeatherSimple(), gameConfig))
        || (getBigDialogueSimpleBriefDesc(action.getWeaBigDialogueSimple(), gameConfig))
        || (getSmallDialogueSimpleBriefDesc(action.getWeaSmallDialogueSimple(), gameConfig))
        || (getPlayBgmBriefDesc(action.getWeaPlayBgm(), gameConfig))
        || (getPlaySfxBriefDesc(action.getWeaPlaySfx(), gameConfig))
        || (getSetForceFogCodeExprBriefDesc(action.getWeaSetForceFogCodeExpr()))
        || (getSetForceFogCodeSimpleBriefDesc(action.getWeaSetForceFogCodeSimple()))
        || (getSetCustomCountersBriefDesc(action.getWeaSetCustomCounters()))
        || (getStopPersistentActionBriefDesc(action.getWeaStopPersistentAction()))
        || (getSetPlayerStateExprBriefDesc(action.getWeaSetPlayerStateExpr()))
        || (getSetPlayerStateSimpleBriefDesc(action.getWeaSetPlayerStateSimple()))
        || (getSetTaskObjectiveStateBriefDesc(action.getWeaSetTaskObjectiveState()))
        || (getSetUnitMovePathVisibilityBriefDesc(action.getWeaSetUnitMovePathVisibility()))
        || (getSetTileTypeExprBriefDesc(action.getWeaSetTileTypeExpr()))
        || (getSetTileTypeSimpleBriefDesc(action.getWeaSetTileTypeSimple()))
        || (getSetTileStateExprBriefDesc(action.getWeaSetTileStateExpr()))
        || (getSetTileStateSimpleBriefDesc(action.getWeaSetTileStateSimple()))
        || (getSetCustomBuildingStateExprBriefDesc(action.getWeaSetCustomBuildingStateExpr()))
        || (getSetCustomBuildingStateSimpleBriefDesc(action.getWeaSetCustomBuildingStateSimple()))
        || (getSetCustomCrystalStateExprBriefDesc(action.getWeaSetCustomCrystalStateExpr()))
        || (getSetCustomCrystalStateSimpleBriefDesc(action.getWeaSetCustomCrystalStateSimple()))
        || (getSetCustomCannonStateExprBriefDesc(action.getWeaSetCustomCannonStateExpr()))
        || (getSetCustomCannonStateSimpleBriefDesc(action.getWeaSetCustomCannonStateSimple()))
        || (getSetCustomLaserTurretStateExprBriefDesc(action.getWeaSetCustomLaserTurretStateExpr()))
        || (getSetCustomLaserTurretStateSimpleBriefDesc(action.getWeaSetCustomLaserTurretStateSimple()))
        || (getDeleteTileBuffExprBriefDesc(action.getWeaDeleteTileBuffExpr()))
        || (getDeleteTileBuffSimpleBriefDesc(action.getWeaDeleteTileBuffSimple()))
        || (getAddTileBuffExprBriefDesc(action.getWeaAddTileBuffExpr()))
        || (getAddTileBuffSimpleBriefDesc(action.getWeaAddTileBuffSimple()))
        || (getModifyTileBuffExprBriefDesc(action.getWeaModifyTileBuffExpr()))
        || (getModifyTileBuffSimpleBriefDesc(action.getWeaModifyTileBuffSimple()))
        || (getPersistentShowTextBriefDesc(action.getWeaPersistentShowText()))
        || (getPersistentPlayBgmBriefDesc(action.getWeaPersistentPlayBgm(), gameConfig))
        || (getPersistentModifyPlayerAttributeBriefDesc(action.getWeaPersistentModifyPlayerAttribute()))
        || (getPersistentModifyUnitAttributeBriefDesc(action.getWeaPersistentModifyUnitAttribute()));
}
export function getDetailDescForAction(action: WarEventAction, gameConfig: GameConfig): string | null {
    // todo: add functions for other actions
    return (getAddUnitOnMapSimpleDetailDesc(action.getWeaAddUnitOnMapSimple(), gameConfig))
        || (getFillUnitOnMapExprDetailDesc(action.getWeaFillUnitOnMapExpr()))
        || (getFillUnitOnMapSimpleDetailDesc(action.getWeaFillUnitOnMapSimple(), gameConfig))
        || (getFillUnitLoadedSimpleDetailDesc(action.getWeaFillUnitLoadedSimple(), gameConfig))
        || (getFillUnitLoadedExprDetailDesc(action.getWeaFillUnitLoadedExpr()))
        || (getDestroyUnitSimpleDetailDesc(action.getWeaDestroyUnitSimple()))
        || (getDestroyUnitExprDetailDesc(action.getWeaDestroyUnitExpr()))
        || (getSetUnitTypeSimpleDetailDesc(action.getWeaSetUnitTypeSimple(), gameConfig))
        || (getSetUnitTypeExprDetailDesc(action.getWeaSetUnitTypeExpr()))
        || (getSetUnitOwnershipSimpleDetailDesc(action.getWeaSetUnitOwnershipSimple()))
        || (getSetUnitOwnershipExprDetailDesc(action.getWeaSetUnitOwnershipExpr()))
        || (getSetUnitPositionSimpleDetailDesc(action.getWeaSetUnitPositionSimple()))
        || (getSetUnitPositionExprDetailDesc(action.getWeaSetUnitPositionExpr()))
        || (getSetUnitStateSimpleDetailDesc(action.getWeaSetUnitStateSimple()))
        || (getSetUnitStateExprDetailDesc(action.getWeaSetUnitStateExpr()))
        || (getAddUnitBuffSimpleDetailDesc(action.getWeaAddUnitBuffSimple()))
        || (getModifyUnitBuffSimpleDetailDesc(action.getWeaModifyUnitBuffSimple()))
        || (getDeleteUnitBuffSimpleDetailDesc(action.getWeaDeleteUnitBuffSimple()))
        || (getSetViewpointExprDetailDesc(action.getWeaSetViewpointExpr()))
        || (getSetViewpointSimpleDetailDesc(action.getWeaSetViewpointSimple()))
        || (getSetWeatherExprDetailDesc(action.getWeaSetWeatherExpr()))
        || (getSetWeatherSimpleDetailDesc(action.getWeaSetWeatherSimple(), gameConfig))
        || (getBigDialogueSimpleDetailDesc(action.getWeaBigDialogueSimple(), gameConfig))
        || (getSmallDialogueSimpleDetailDesc(action.getWeaSmallDialogueSimple(), gameConfig))
        || (getPlayBgmDetailDesc(action.getWeaPlayBgm(), gameConfig))
        || (getPlaySfxDetailDesc(action.getWeaPlaySfx(), gameConfig))
        || (getSetForceFogCodeExprDetailDesc(action.getWeaSetForceFogCodeExpr()))
        || (getSetForceFogCodeSimpleDetailDesc(action.getWeaSetForceFogCodeSimple()))
        || (getSetCustomCountersDetailDesc(action.getWeaSetCustomCounters()))
        || (getStopPersistentActionDetailDesc(action.getWeaStopPersistentAction()))
        || (getSetPlayerStateExprDetailDesc(action.getWeaSetPlayerStateExpr()))
        || (getSetPlayerStateSimpleDetailDesc(action.getWeaSetPlayerStateSimple()))
        || (getSetTaskObjectiveStateDetailDesc(action.getWeaSetTaskObjectiveState()))
        || (getSetUnitMovePathVisibilityDetailDesc(action.getWeaSetUnitMovePathVisibility()))
        || (getSetTileTypeExprDetailDesc(action.getWeaSetTileTypeExpr()))
        || (getSetTileTypeSimpleDetailDesc(action.getWeaSetTileTypeSimple()))
        || (getSetTileStateExprDetailDesc(action.getWeaSetTileStateExpr()))
        || (getSetTileStateSimpleDetailDesc(action.getWeaSetTileStateSimple()))
        || (getSetCustomBuildingStateExprDetailDesc(action.getWeaSetCustomBuildingStateExpr()))
        || (getSetCustomBuildingStateSimpleDetailDesc(action.getWeaSetCustomBuildingStateSimple()))
        || (getSetCustomCrystalStateExprDetailDesc(action.getWeaSetCustomCrystalStateExpr()))
        || (getSetCustomCrystalStateSimpleDetailDesc(action.getWeaSetCustomCrystalStateSimple()))
        || (getSetCustomCannonStateExprDetailDesc(action.getWeaSetCustomCannonStateExpr()))
        || (getSetCustomCannonStateSimpleDetailDesc(action.getWeaSetCustomCannonStateSimple()))
        || (getSetCustomLaserTurretStateExprDetailDesc(action.getWeaSetCustomLaserTurretStateExpr()))
        || (getSetCustomLaserTurretStateSimpleDetailDesc(action.getWeaSetCustomLaserTurretStateSimple()))
        || (getDeleteTileBuffExprDetailDesc(action.getWeaDeleteTileBuffExpr()))
        || (getDeleteTileBuffSimpleDetailDesc(action.getWeaDeleteTileBuffSimple()))
        || (getAddTileBuffExprDetailDesc(action.getWeaAddTileBuffExpr()))
        || (getAddTileBuffSimpleDetailDesc(action.getWeaAddTileBuffSimple()))
        || (getModifyTileBuffExprDetailDesc(action.getWeaModifyTileBuffExpr()))
        || (getModifyTileBuffSimpleDetailDesc(action.getWeaModifyTileBuffSimple()))
        || (getPersistentShowTextDetailDesc(action.getWeaPersistentShowText()))
        || (getPersistentPlayBgmDetailDesc(action.getWeaPersistentPlayBgm(), gameConfig))
        || (getPersistentModifyPlayerAttributeDetailDesc(action.getWeaPersistentModifyPlayerAttribute()))
        || (getPersistentModifyUnitAttributeDetailDesc(action.getWeaPersistentModifyUnitAttribute()));
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
        return getAddUnitOnMapSimpleErrorTip(weaAddUnitOnMapSimple, war);
    }

    const weaFillUnitOnMapExpr = action.getWeaFillUnitOnMapExpr();
    if (weaFillUnitOnMapExpr) {
        return getFillUnitOnMapExprErrorTip(weaFillUnitOnMapExpr, customCounterNameSet);
    }

    const weaFillUnitOnMapSimple = action.getWeaFillUnitOnMapSimple();
    if (weaFillUnitOnMapSimple) {
        return getFillUnitOnMapSimpleErrorTip(weaFillUnitOnMapSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaFillUnitLoadedSimple = action.getWeaFillUnitLoadedSimple();
    if (weaFillUnitLoadedSimple) {
        return getFillUnitLoadedSimpleErrorTip(weaFillUnitLoadedSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaFillUnitLoadedExpr = action.getWeaFillUnitLoadedExpr();
    if (weaFillUnitLoadedExpr) {
        return getFillUnitLoadedExprErrorTip(weaFillUnitLoadedExpr, customCounterNameSet);
    }

    const weaDestroyUnitSimple = action.getWeaDestroyUnitSimple();
    if (weaDestroyUnitSimple) {
        return getDestroyUnitSimpleErrorTip(weaDestroyUnitSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDestroyUnitExpr = action.getWeaDestroyUnitExpr();
    if (weaDestroyUnitExpr) {
        return getDestroyUnitExprErrorTip(weaDestroyUnitExpr, customCounterNameSet);
    }

    const weaSetUnitTypeSimple = action.getWeaSetUnitTypeSimple();
    if (weaSetUnitTypeSimple) {
        return getSetUnitTypeSimpleErrorTip(weaSetUnitTypeSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitTypeExpr = action.getWeaSetUnitTypeExpr();
    if (weaSetUnitTypeExpr) {
        return getSetUnitTypeExprErrorTip(weaSetUnitTypeExpr, customCounterNameSet);
    }

    const weaSetUnitOwnershipSimple = action.getWeaSetUnitOwnershipSimple();
    if (weaSetUnitOwnershipSimple) {
        return getSetUnitOwnershipSimpleErrorTip(weaSetUnitOwnershipSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitOwnershipExpr = action.getWeaSetUnitOwnershipExpr();
    if (weaSetUnitOwnershipExpr) {
        return getSetUnitOwnershipExprErrorTip(weaSetUnitOwnershipExpr, customCounterNameSet);
    }

    const weaSetUnitPositionSimple = action.getWeaSetUnitPositionSimple();
    if (weaSetUnitPositionSimple) {
        return getSetUnitPositionSimpleErrorTip(weaSetUnitPositionSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitPositionExpr = action.getWeaSetUnitPositionExpr();
    if (weaSetUnitPositionExpr) {
        return getSetUnitPositionExprErrorTip(weaSetUnitPositionExpr, customCounterNameSet);
    }

    const weaSetUnitStateSimple = action.getWeaSetUnitStateSimple();
    if (weaSetUnitStateSimple) {
        return getSetUnitStateSimpleErrorTip(weaSetUnitStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetUnitStateExpr = action.getWeaSetUnitStateExpr();
    if (weaSetUnitStateExpr) {
        return getSetUnitStateExprErrorTip(weaSetUnitStateExpr, customCounterNameSet);
    }

    const weaAddUnitBuffSimple = action.getWeaAddUnitBuffSimple();
    if (weaAddUnitBuffSimple) {
        return getAddUnitBuffSimpleErrorTip(weaAddUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaModifyUnitBuffSimple = action.getWeaModifyUnitBuffSimple();
    if (weaModifyUnitBuffSimple) {
        return getModifyUnitBuffSimpleErrorTip(weaModifyUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDeleteUnitBuffSimple = action.getWeaDeleteUnitBuffSimple();
    if (weaDeleteUnitBuffSimple) {
        return getDeleteUnitBuffSimpleErrorTip(weaDeleteUnitBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetViewpointExpr = action.getWeaSetViewpointExpr();
    if (weaSetViewpointExpr) {
        return getSetViewpointExprErrorTip(weaSetViewpointExpr, customCounterNameSet);
    }

    const weaSetViewpointSimple = action.getWeaSetViewpointSimple();
    if (weaSetViewpointSimple) {
        return getSetViewpointSimpleErrorTip(weaSetViewpointSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetWeatherExpr = action.getWeaSetWeatherExpr();
    if (weaSetWeatherExpr) {
        return getSetWeatherExprErrorTip(weaSetWeatherExpr, customCounterNameSet);
    }

    const weaSetWeatherSimple = action.getWeaSetWeatherSimple();
    if (weaSetWeatherSimple) {
        return getSetWeatherSimpleErrorTip(weaSetWeatherSimple, gameConfig);
    }

    const weaBigDialogueSimple = action.getWeaBigDialogueSimple();
    if (weaBigDialogueSimple) {
        return getBigDialogueSimpleErrorTip(weaBigDialogueSimple, playersCountUnneutral, gameConfig);
    }

    const weaSmallDialogueSimple = action.getWeaSmallDialogueSimple();
    if (weaSmallDialogueSimple) {
        return getSmallDialogueSimpleErrorTip(weaSmallDialogueSimple, playersCountUnneutral, gameConfig);
    }

    const weaPlayBgm = action.getWeaPlayBgm();
    if (weaPlayBgm) {
        return getPlayBgmErrorTip(weaPlayBgm);
    }

    const weaPlaySfx = action.getWeaPlaySfx();
    if (weaPlaySfx) {
        return getPlaySfxErrorTip(weaPlaySfx);
    }

    const weaSetForceFogCodeExpr = action.getWeaSetForceFogCodeExpr();
    if (weaSetForceFogCodeExpr) {
        return getSetForceFogCodeExprErrorTip(weaSetForceFogCodeExpr, customCounterNameSet);
    }

    const weaSetForceFogCodeSimple = action.getWeaSetForceFogCodeSimple();
    if (weaSetForceFogCodeSimple) {
        return getSetForceFogCodeSimpleErrorTip(weaSetForceFogCodeSimple);
    }

    const weaSetCustomCounters = action.getWeaSetCustomCounters();
    if (weaSetCustomCounters) {
        return getSetCustomCountersErrorTip(weaSetCustomCounters, customCounterNameSet);
    }

    const weaStopPersistentAction = action.getWeaStopPersistentAction();
    if (weaStopPersistentAction) {
        return getStopPersistentActionErrorTip(weaStopPersistentAction, fullData);
    }

    const weaSetPlayerStateExpr = action.getWeaSetPlayerStateExpr();
    if (weaSetPlayerStateExpr) {
        return getSetPlayerStateExprErrorTip(weaSetPlayerStateExpr, customCounterNameSet);
    }

    const weaSetPlayerStateSimple = action.getWeaSetPlayerStateSimple();
    if (weaSetPlayerStateSimple) {
        return getSetPlayerStateSimpleErrorTip(weaSetPlayerStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetTaskObjectiveState = action.getWeaSetTaskObjectiveState();
    if (weaSetTaskObjectiveState) {
        return getSetTaskObjectiveStateErrorTip(weaSetTaskObjectiveState, customCounterNameSet);
    }

    const weaSetUnitMovePathVisibility = action.getWeaSetUnitMovePathVisibility();
    if (weaSetUnitMovePathVisibility) {
        return getSetUnitMovePathVisibilityErrorTip(weaSetUnitMovePathVisibility, customCounterNameSet);
    }

    const weaSetTileTypeExpr = action.getWeaSetTileTypeExpr();
    if (weaSetTileTypeExpr) {
        return getSetTileTypeExprErrorTip(weaSetTileTypeExpr, customCounterNameSet);
    }

    const weaSetTileTypeSimple = action.getWeaSetTileTypeSimple();
    if (weaSetTileTypeSimple) {
        return getSetTileTypeSimpleErrorTip(weaSetTileTypeSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetTileStateExpr = action.getWeaSetTileStateExpr();
    if (weaSetTileStateExpr) {
        return getSetTileStateExprErrorTip(weaSetTileStateExpr, customCounterNameSet);
    }

    const weaSetTileStateSimple = action.getWeaSetTileStateSimple();
    if (weaSetTileStateSimple) {
        return getSetTileStateSimpleErrorTip(weaSetTileStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomBuildingStateExpr = action.getWeaSetCustomBuildingStateExpr();
    if (weaSetCustomBuildingStateExpr) {
        return getSetCustomBuildingStateExprErrorTip(weaSetCustomBuildingStateExpr, customCounterNameSet);
    }

    const weaSetCustomBuildingStateSimple = action.getWeaSetCustomBuildingStateSimple();
    if (weaSetCustomBuildingStateSimple) {
        return getSetCustomBuildingStateSimpleErrorTip(weaSetCustomBuildingStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomCrystalStateExpr = action.getWeaSetCustomCrystalStateExpr();
    if (weaSetCustomCrystalStateExpr) {
        return getSetCustomCrystalStateExprErrorTip(weaSetCustomCrystalStateExpr, customCounterNameSet);
    }

    const weaSetCustomCrystalStateSimple = action.getWeaSetCustomCrystalStateSimple();
    if (weaSetCustomCrystalStateSimple) {
        return getSetCustomCrystalStateSimpleErrorTip(weaSetCustomCrystalStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomCannonStateExpr = action.getWeaSetCustomCannonStateExpr();
    if (weaSetCustomCannonStateExpr) {
        return getSetCustomCannonStateExprErrorTip(weaSetCustomCannonStateExpr, customCounterNameSet);
    }

    const weaSetCustomCannonStateSimple = action.getWeaSetCustomCannonStateSimple();
    if (weaSetCustomCannonStateSimple) {
        return getSetCustomCannonStateSimpleErrorTip(weaSetCustomCannonStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaSetCustomLaserTurretStateExpr = action.getWeaSetCustomLaserTurretStateExpr();
    if (weaSetCustomLaserTurretStateExpr) {
        return getSetCustomLaserTurretStateExprErrorTip(weaSetCustomLaserTurretStateExpr, customCounterNameSet);
    }

    const weaSetCustomLaserTurretStateSimple = action.getWeaSetCustomLaserTurretStateSimple();
    if (weaSetCustomLaserTurretStateSimple) {
        return getSetCustomLaserTurretStateSimpleErrorTip(weaSetCustomLaserTurretStateSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaDeleteTileBuffExpr = action.getWeaDeleteTileBuffExpr();
    if (weaDeleteTileBuffExpr) {
        return getDeleteTileBuffExprErrorTip(weaDeleteTileBuffExpr, customCounterNameSet);
    }

    const weaDeleteTileBuffSimple = action.getWeaDeleteTileBuffSimple();
    if (weaDeleteTileBuffSimple) {
        return getDeleteTileBuffSimpleErrorTip(weaDeleteTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaAddTileBuffExpr = action.getWeaAddTileBuffExpr();
    if (weaAddTileBuffExpr) {
        return getAddTileBuffExprErrorTip(weaAddTileBuffExpr, customCounterNameSet);
    }

    const weaAddTileBuffSimple = action.getWeaAddTileBuffSimple();
    if (weaAddTileBuffSimple) {
        return getAddTileBuffSimpleErrorTip(weaAddTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaModifyTileBuffExpr = action.getWeaModifyTileBuffExpr();
    if (weaModifyTileBuffExpr) {
        return getModifyTileBuffExprErrorTip(weaModifyTileBuffExpr, customCounterNameSet);
    }

    const weaModifyTileBuffSimple = action.getWeaModifyTileBuffSimple();
    if (weaModifyTileBuffSimple) {
        return getModifyTileBuffSimpleErrorTip(weaModifyTileBuffSimple, mapSize, playersCountUnneutral, gameConfig);
    }

    const weaPersistentShowText = action.getWeaPersistentShowText();
    if (weaPersistentShowText) {
        return getPersistentShowTextErrorTip(weaPersistentShowText);
    }

    const weaPersistentPlayBgm = action.getWeaPersistentPlayBgm();
    if (weaPersistentPlayBgm) {
        return getPersistentPlayBgmErrorTip(weaPersistentPlayBgm);
    }

    const weaPersistentModifyPlayerAttribute = action.getWeaPersistentModifyPlayerAttribute();
    if (weaPersistentModifyPlayerAttribute) {
        return getPersistentModifyPlayerAttributeErrorTip(weaPersistentModifyPlayerAttribute, customCounterNameSet);
    }

    const weaPersistentModifyUnitAttribute = action.getWeaPersistentModifyUnitAttribute();
    if (weaPersistentModifyUnitAttribute) {
        return getPersistentModifyUnitAttributeErrorTip(weaPersistentModifyUnitAttribute, customCounterNameSet);
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
            actBuffType     : UnitBuffsBuffTypeId.Fire,
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
            actBuffType     : TileBuffsBuffTypeId.NoIncome,
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
