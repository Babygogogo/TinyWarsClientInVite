import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import type { IBwWarEventManager } from "../interface/IBwWarEventManager.ts";
import { Constants } from "../../customCounters/Constants.ts";
import { checkIsValidCustomCounterArray, checkIsValidId, checkIsValidValue } from "../../customCounters/Utils.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import { newError, getExisted, getDefined } from "../../helpers/Misc.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex, AliveStateId } from "../../players/Constants.ts";
import type { ConditionIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import type { NodeIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type { WarEvent } from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventConditionNode } from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WoSystemCallWarEvent } from "../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import { CustomCounter } from "../../proto/schema/CommonProto/WarSerialization/CustomCounter.ts";
import { DataForWarEventCalledCount } from "../../proto/schema/CommonProto/WarSerialization/DataForWarEventCalledCount.ts";
import { SerialWarEventManager } from "../../proto/schema/CommonProto/WarSerialization/SerialWarEventManager.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { applyWithExtraData, applyWithoutExtraData } from "../../warEvents/actions/utils/AddTileBuffExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsAddTileBuffSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsAddTileBuffSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/AddTileBuffSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsAddUnitBuffSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsAddUnitBuffSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/AddUnitBuffSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsAddUnitOnMapSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsAddUnitOnMapSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/AddUnitOnMapSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsBigDialogueSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsBigDialogueSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/BigDialogueSimple.ts";
import { checkIsPersistentAction } from "../../warEvents/actions/utils/Common.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsDeleteTileBuffExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsDeleteTileBuffExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/DeleteTileBuffExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsDeleteTileBuffSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsDeleteTileBuffSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/DeleteTileBuffSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsDeleteUnitBuffSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsDeleteUnitBuffSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/DeleteUnitBuffSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsDestroyUnitExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsDestroyUnitExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/DestroyUnitExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsDestroyUnitSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsDestroyUnitSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/DestroyUnitSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsFillUnitLoadedExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsFillUnitLoadedExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/FillUnitLoadedExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsFillUnitLoadedSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsFillUnitLoadedSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/FillUnitLoadedSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsFillUnitOnMapExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsFillUnitOnMapExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/FillUnitOnMapExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsFillUnitOnMapSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsFillUnitOnMapSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/FillUnitOnMapSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsModifyTileBuffExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsModifyTileBuffExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/ModifyTileBuffExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsModifyTileBuffSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsModifyTileBuffSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/ModifyTileBuffSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsModifyUnitBuffSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsModifyUnitBuffSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/ModifyUnitBuffSimple.ts";
import {
    checkCanActivateCoSkillForPlayer,
    checkCanProduceUnitForPlayer,
    getActEnergyGrowthMultiplierModifierForPlayer,
    getActAiUnitProductionBonusScore,
    getActCoZoneRadiusModifierForPlayer,
    applyWithExtraData as WarEventsActionsUtilsPersistentModifyPlayerAttributeApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsPersistentModifyPlayerAttributeApplyWithoutExtraData,
} from "../../warEvents/actions/utils/PersistentModifyPlayerAttribute.ts";
import {
    getAttackPowerModifierForUnit,
    getDefenseModifierForUnit,
    getMoveRangeModifierForUnit,
    getMaxAttackRangeModifierForUnit,
    getCanAttackAfterMovingForUnit,
    getVisionRangeModifierForUnit,
    getIsPenetratingVisionForUnit,
    getLuckLowerLimitModifierForUnit,
    getLuckUpperLimitModifierForUnit,
    getFlareRadiusModifierForUnit,
    getFlareRangeModifierForUnit,
    applyWithExtraData as WarEventsActionsUtilsPersistentModifyUnitAttributeApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsPersistentModifyUnitAttributeApplyWithoutExtraData,
} from "../../warEvents/actions/utils/PersistentModifyUnitAttribute.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsPersistentPlayBgmApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsPersistentPlayBgmApplyWithoutExtraData,
} from "../../warEvents/actions/utils/PersistentPlayBgm.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsPersistentShowTextApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsPersistentShowTextApplyWithoutExtraData,
} from "../../warEvents/actions/utils/PersistentShowText.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsPlayBgmApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsPlayBgmApplyWithoutExtraData,
} from "../../warEvents/actions/utils/PlayBgm.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsPlaySfxApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsPlaySfxApplyWithoutExtraData,
} from "../../warEvents/actions/utils/PlaySfx.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetCustomBuildingStateExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetCustomBuildingStateExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomBuildingStateExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetCustomBuildingStateSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetCustomBuildingStateSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomBuildingStateSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetCustomCannonStateExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetCustomCannonStateExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCannonStateExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetCustomCannonStateSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetCustomCannonStateSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCannonStateSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetCustomCountersApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetCustomCountersApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCounters.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetCustomCrystalStateExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetCustomCrystalStateExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCrystalStateExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetCustomCrystalStateSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetCustomCrystalStateSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCrystalStateSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetCustomLaserTurretStateExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetCustomLaserTurretStateExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomLaserTurretStateExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetCustomLaserTurretStateSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetCustomLaserTurretStateSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomLaserTurretStateSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetForceFogCodeExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetForceFogCodeExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetForceFogCodeExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetForceFogCodeSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetForceFogCodeSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetForceFogCodeSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetPlayerStateExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetPlayerStateExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetPlayerStateExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetPlayerStateSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetPlayerStateSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetPlayerStateSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetTaskObjectiveStateApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetTaskObjectiveStateApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetTaskObjectiveState.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetTileStateExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetTileStateExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetTileStateExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetTileStateSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetTileStateSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetTileStateSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetTileTypeExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetTileTypeExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetTileTypeExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetTileTypeSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetTileTypeSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetTileTypeSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetUnitMovePathVisibilityApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetUnitMovePathVisibilityApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitMovePathVisibility.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetUnitOwnershipExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetUnitOwnershipExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitOwnershipExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetUnitOwnershipSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetUnitOwnershipSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitOwnershipSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetUnitPositionExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetUnitPositionExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitPositionExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetUnitPositionSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetUnitPositionSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitPositionSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetUnitStateExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetUnitStateExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitStateExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetUnitStateSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetUnitStateSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitStateSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetUnitTypeExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetUnitTypeExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitTypeExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetUnitTypeSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetUnitTypeSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitTypeSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetViewpointExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetViewpointExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetViewpointExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetViewpointSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetViewpointSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetViewpointSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetWeatherExprApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetWeatherExprApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetWeatherExpr.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSetWeatherSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSetWeatherSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SetWeatherSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsSmallDialogueSimpleApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsSmallDialogueSimpleApplyWithoutExtraData,
} from "../../warEvents/actions/utils/SmallDialogueSimple.ts";
import {
    applyWithExtraData as WarEventsActionsUtilsStopPersistentActionApplyWithExtraData,
    applyWithoutExtraData as WarEventsActionsUtilsStopPersistentActionApplyWithoutExtraData,
} from "../../warEvents/actions/utils/StopPersistentAction.ts";
import { checkIsMeet } from "../../warEvents/conditions/utils/CustomCounter.ts";
import { checkIsMeet as WarEventsConditionsUtilsEventCalledCountCheckIsMeet } from "../../warEvents/conditions/utils/EventCalledCount.ts";
import { checkIsMeet as WarEventsConditionsUtilsExpressionCheckIsMeet } from "../../warEvents/conditions/utils/Expression.ts";
import {
    checkIsMeet as WarEventsConditionsUtilsManualActionStatisticsCheckIsMeet,
} from "../../warEvents/conditions/utils/ManualActionStatistics.ts";
import {
    checkIsMeet as WarEventsConditionsUtilsOngoingPersistentActionPresenceCheckIsMeet,
} from "../../warEvents/conditions/utils/OngoingPersistentActionPresence.ts";
import { checkIsMeet as WarEventsConditionsUtilsPlayerPresenceCheckIsMeet } from "../../warEvents/conditions/utils/PlayerPresence.ts";
import { checkIsMeet as WarEventsConditionsUtilsTilePresenceCheckIsMeet } from "../../warEvents/conditions/utils/TilePresence.ts";
import { checkIsMeet as WarEventsConditionsUtilsTurnAndPlayerCheckIsMeet } from "../../warEvents/conditions/utils/TurnAndPlayer.ts";
import { checkIsMeet as WarEventsConditionsUtilsUnitPresenceCheckIsMeet } from "../../warEvents/conditions/utils/UnitPresence.ts";
import { checkIsMeet as WarEventsConditionsUtilsWeatherAndFogCheckIsMeet } from "../../warEvents/conditions/utils/WeatherAndFog.ts";
import type { WarEventIdAndDataIndex } from "../../warEvents/Types.ts";
import { handleCommonExtraData } from "../../warOperations/executors/utils/Common.ts";

export class BwWarEventManager implements IBwWarEventManager {
    private _war?                           : IBwWar;
    private _calledCountList?               : DataForWarEventCalledCount[] | null;
    private _customCounterArray?            : CustomCounter[] | null;
    private _opaIdArray?                    : number[];

    public init(data: Undefinable<SerialWarEventManager>, warEventFullData: Undefinable<WarEventFullData>): void {
        if (!data) {
            this._setCalledCountList(null);
            this._setCustomCounterArray(null);
            this._setOpaIdArray([]);
        } else {
            // TODO: validate the data.
            const customCounterArray = data.getCustomCounterArray();
            if ((customCounterArray) && (!checkIsValidCustomCounterArray(customCounterArray))) {
                throw newError(`BwWarEventManager.init() invalid customCounterArray.`, ClientErrorCode.BwWarEventManager_Init_00);
            }

            const opaIdArray = data.getOngoingPersistentActionIdArray();
            if (opaIdArray.length !== new Set(opaIdArray).size) {
                throw newError(`BwWarEventManager.init() invalid ongoingPersistentActionIdArray.`, ClientErrorCode.BwWarEventManager_Init_01);
            }
            for (const actionId of opaIdArray) {
                const action = warEventFullData?.getActionArray()?.find(v => v.getWeaCommonData()?.getActionId() === actionId);
                if ((action == null) || (!checkIsPersistentAction(action))) {
                    throw newError(`BwWarEventManager.init() invalid ongoingPersistentActionIdArray.`, ClientErrorCode.BwWarEventManager_Init_02);
                }
            }

            this._setCalledCountList(data.getCalledCountList().map(v => v.clone()));
            this._setCustomCounterArray(customCounterArray.map(v => v.clone()));
            this._setOpaIdArray(opaIdArray);
        }
    }
    public fastInit(data: SerialWarEventManager): void {
        this._setCalledCountList(data.getCalledCountList().map(v => v.clone()));
        this._setCustomCounterArray(data.getCustomCounterArray().map(v => v.clone()));
        this._setOpaIdArray(data.getOngoingPersistentActionIdArray().concat());
    }

    public serialize(): SerialWarEventManager {
        return SerialWarEventManager.fromJson({
            calledCountList                 : this._getCalledCountList()?.map(v => v.toJson()) ?? [],
            customCounterArray              : this._getCustomCounterArray()?.map(v => v.toJson()) ?? [],
            ongoingPersistentActionIdArray  : [...this.getOpaIdArray()],
        });
    }
    public serializeForCreateSfw(): SerialWarEventManager {
        return SerialWarEventManager.fromJson({
            calledCountList                 : this._getCalledCountList()?.map(v => v.clone().toJson()) ?? [],
            customCounterArray              : this._getCustomCounterArray()?.map(v => v.clone().toJson()) ?? [],
            ongoingPersistentActionIdArray  : [...this.getOpaIdArray()],
        });
    }
    public serializeForCreateMfr(): SerialWarEventManager {
        return this.serializeForCreateSfw();
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    private _getWar(): IBwWar {
        return getExisted(this._war);
    }

    public getWarEventFullData(): WarEventFullData | null {
        return this._getWar().getCommonSettingManager().getInstanceWarRule().getWarEventFullData() ?? null;
    }
    public setWarEventFullData(data: WarEventFullData | null): void {
        this._getWar().getCommonSettingManager().getInstanceWarRule().setWarEventFullData(data);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for called counts.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected _setCalledCountList(list: DataForWarEventCalledCount[] | null): void {
        this._calledCountList = list;
    }
    private _getCalledCountList(): DataForWarEventCalledCount[] | null {
        return getDefined(this._calledCountList, ClientErrorCode.BwWarEventManager_GetCalledCountList_00);
    }

    public updateWarEventCalledCountOnCall(eventId: number): void {                     // DONE
        const calledCountList = this._getCalledCountList();
        if (calledCountList == null) {
            this._setCalledCountList([DataForWarEventCalledCount.fromJson({
                eventId                 : eventId,
                calledCountTotal        : 1,
                calledCountInPlayerTurn : 1,
            })]);
        } else {
            const data = calledCountList.find(v => v.getEventId() === eventId);
            if (data) {
                data.setCalledCountInPlayerTurn((data.getCalledCountInPlayerTurn()) + 1);
                data.setCalledCountTotal((data.getCalledCountTotal()) + 1);
            } else {
                calledCountList.push(DataForWarEventCalledCount.fromJson({
                    eventId                 : eventId,
                    calledCountTotal        : 1,
                    calledCountInPlayerTurn : 1,
                }));
            }
        }
    }
    public updateWarEventCalledCountOnPlayerTurnSwitched(): void {                      // DONE
        const list = this._getCalledCountList();
        if (list) {
            list.forEach(v => {
                v.setCalledCountInPlayerTurn(0);
            });
        }
    }
    public getWarEventCalledCountTotal(eventId: number): number {                       // DONE
        return this._getCalledCountList()?.find(v => v.getEventId() === eventId)?.getCalledCountTotal() ?? 0;
    }
    public getWarEventCalledCountInPlayerTurn(eventId: number): number {                // DONE
        return this._getCalledCountList()?.find(v => v.getEventId() === eventId)?.getCalledCountInPlayerTurn() ?? 0;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for custom counters.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected _setCustomCounterArray(counterArray: CustomCounter[] | null): void {
        this._customCounterArray = counterArray;
        dispatch(TypeId.BwCustomCountersChanged);
    }
    private _getCustomCounterArray(): CustomCounter[] | null {
        return getDefined(this._customCounterArray, ClientErrorCode.BwWarEventManager_GetCustomCounterArray_00);
    }

    public setCustomCounter(counterId: number, counterValue: number): void {
        if (!checkIsValidId(counterId)) {
            throw newError(`BwWarEventManager._setCustomCounter() invalid counterId: ${counterId}`, ClientErrorCode.BwWarEventManager_SetCustomCounter_00);
        }

        if (!checkIsValidValue(counterValue)) {
            throw newError(`BwWarEventManager._setCustomCounter() invalid counterValue: ${counterValue}`, ClientErrorCode.BwWarEventManager_SetCustomCounter_01);
        }

        const array = this._getCustomCounterArray();
        if (array == null) {
            this._setCustomCounterArray([CustomCounter.fromJson({
                customCounterId : counterId,
                value           : counterValue,
            })]);
        } else {
            const data = array.find(v => v.getCustomCounterId() === counterId);
            if (data) {
                data.setValue(counterValue);
            } else {
                array.push(CustomCounter.fromJson({
                    customCounterId : counterId,
                    value           : counterValue,
                }));
            }
            dispatch(TypeId.BwCustomCountersChanged);
        }
    }
    public getCustomCounter(counterId: number): number {
        const counter = this._getCustomCounterArray()?.find(v => v.getCustomCounterId() === counterId);
        return counter?.getValue() ?? 0;
    }

    public checkIsCustomCounterRelevant(): boolean {
        for (const action of this.getWarEventFullData()?.getActionArray() ?? []) {
            if (action.getWeaSetCustomCounters()) {
                return true;
            }
        }

        return false;
    }

    public handleEscapeText(rawText: string): string {
        for (;;) {
            let tempText = rawText;
            for (let counterId = Constants.MinId; counterId <= Constants.MaxId; ++counterId) {
                tempText = tempText.replace(new RegExp(`{CC${counterId}}`, "g"), `${this.getCustomCounter(counterId)}`);
            }
            if (tempText === rawText) {
                return tempText;
            }
            rawText = tempText;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for persistent actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _setOpaIdArray(opaIdArray: number[]): void {
        this._opaIdArray = opaIdArray;
    }
    public getOpaIdArray(): number[] {
        return getExisted(this._opaIdArray, ClientErrorCode.BwWarEventManager_GetOngoingPersistentActionIdSet_00);
    }
    public getAllPersistentActionIdArray(): number[] {
        const idArray: number[] = [];
        for (const action of this.getWarEventFullData()?.getActionArray() ?? []) {
            if (checkIsPersistentAction(action)) {
                idArray.push(action.getWeaCommonData()?.getActionId() ?? 0);
            }
        }
        idArray.sort((v1, v2) => v1 - v2);

        return idArray;
    }
    public updateOpaIdArrayOnExecuteAction(actionId: number): void {
        const opaIdArray = this.getOpaIdArray();
        deleteElementFromList(opaIdArray, actionId);
        opaIdArray.push(actionId);
    }
    public updateOpaIdArrayOnDeleteAction(actionIdArray: number[]): void {
        const opaIdArray = this.getOpaIdArray();
        for (const actionId of actionIdArray) {
            deleteElementFromList(opaIdArray, actionId);
        }
    }

    public checkOpaCanActivateCoSkill(playerIndex: number): boolean | null {
        const opaIdArray    = this.getOpaIdArray();
        const war           = this._getWar();
        for (let i = opaIdArray.length - 1; i >= 0; --i) {
            const action = this.getWarEventAction(opaIdArray[i]);
            {
                const actionData = action.getWeaPersistentModifyPlayerAttribute();
                if (actionData) {
                    const canActivate = checkCanActivateCoSkillForPlayer(actionData, playerIndex, war);
                    if (canActivate != null) {
                        return canActivate;
                    }
                }
            }
        }

        return null;
    }
    public checkOpaCanProduceUnit(playerIndex: number, unitType: number): boolean | null {
        const opaIdArray    = this.getOpaIdArray();
        const war           = this._getWar();
        for (let i = opaIdArray.length - 1; i >= 0; --i) {
            const action = this.getWarEventAction(opaIdArray[i]);
            {
                const actionData = action.getWeaPersistentModifyPlayerAttribute();
                if (actionData) {
                    const canProduceUnit = checkCanProduceUnitForPlayer(actionData, playerIndex, unitType, war);
                    if (canProduceUnit != null) {
                        return canProduceUnit;
                    }
                }
            }
        }

        return null;
    }

    public getOpaEnergyGrowthMultiplierModifier(playerIndex: number): number {
        const war       = this._getWar();
        let modifier    = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyPlayerAttribute();
                if (actionData) {
                    modifier += getActEnergyGrowthMultiplierModifierForPlayer(actionData, playerIndex, war);
                }
            }
        }

        return modifier;
    }
    public getOpaAiUnitProductionBonusScore(playerIndex: number, unitTypeId: number, gridIndex: GridIndex): number {
        const war       = this._getWar();
        let bonusScore  = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyPlayerAttribute();
                if (actionData) {
                    bonusScore += getActAiUnitProductionBonusScore({
                        action      : actionData,
                        playerIndex : playerIndex,
                        war         : war,
                        unitTypeId  : unitTypeId,
                        gridIndex   : gridIndex,
                    });
                }
            }
        }

        return isNaN(bonusScore) ? 0 : bonusScore;
    }
    public getOpaCoZoneRadiusModifier(playerIndex: number): number {
        const war       = this._getWar();
        let modifier    = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyPlayerAttribute();
                if (actionData) {
                    modifier += getActCoZoneRadiusModifierForPlayer(actionData, playerIndex, war);
                }
            }
        }

        return modifier;
    }
    public getOpaAttackPowerModifier(unit: IUnit, gridIndex: GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += getAttackPowerModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaDefenseModifier(unit: IUnit, gridIndex: GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += getDefenseModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaMoveRangeModifier(unit: IUnit): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += getMoveRangeModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaMaxAttackRangeModifier(unit: IUnit): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += getMaxAttackRangeModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaCanAttackAfterMoving(unit: IUnit): boolean | null {
        for (const opaId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(opaId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    const canAttack = getCanAttackAfterMovingForUnit(actionData, unit);
                    if (canAttack != null) {
                        return canAttack;
                    }
                }
            }
        }

        return null;
    }
    public getOpaUnitVisionRangeModifier(unit: IUnit, gridIndex: GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += getVisionRangeModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaIsPenetratingVision(unit: IUnit): boolean | null {
        for (const opaId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(opaId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    const isPenetrating = getIsPenetratingVisionForUnit(actionData, unit);
                    if (isPenetrating != null) {
                        return isPenetrating;
                    }
                }
            }
        }

        return null;
    }
    public getOpaLuckLowerLimitModifier(unit: IUnit, gridIndex: GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += getLuckLowerLimitModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaLuckUpperLimitModifier(unit: IUnit, gridIndex: GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += getLuckUpperLimitModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaFlareRadiusModifier(unit: IUnit, gridIndex: GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += getFlareRadiusModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaFlareRangeModifier(unit: IUnit, gridIndex: GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += getFlareRangeModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }

    public getOpaBgmCode(): number | null {
        const opaIdArray = this.getOpaIdArray();
        for (let i = opaIdArray.length - 1; i >= 0; --i) {
            const action = this.getWarEventAction(opaIdArray[i]).getWeaPersistentPlayBgm();
            if (action != null) {
                return getExisted(action.getBgmCode());
            }
        }

        return null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for calling events.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public async callWarEvent(action: WoSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
        this._getWar().getIsExecuteActionsWithExtraData()
            ? await this._callWarEventWithExtraData(action, isFastExecute)
            : await this._callWarEventWithoutExtraData(
                action.getWarEventId(),
                action.getNodeAndActionsIndex(),
                isFastExecute
            );
    }
    private async _callWarEventWithExtraData(action: WoSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
        for (const actionId of this.getWarEvent(action.getWarEventId()).getRootNodeAndActionsArray()[action.getNodeAndActionsIndex()].getActionIdArray()) {
            await this._callActionWithExtraData(actionId, isFastExecute);
        }

        const extraData = getExisted(action.getExtraData(), ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_01);
        handleCommonExtraData({
            war             : this._getWar(),
            commonExtraData : getExisted(extraData.getCommonExtraData(), ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_02),
            isFastExecute   : isFastExecute,
        });
    }
    private async _callWarEventWithoutExtraData(warEventId: number, dataIndex: number, isFastExecute: boolean): Promise<void> { // DONE
        const war           = this._getWar();
        const unitMap       = war.getUnitMap();
        const playerManager = war.getPlayerManager();
        const playerIndexes = playerManager.getPlayerIndexArray(PlayerIndex.First, false)
            .filter(v => (playerManager.getPlayer(v).getAliveState() === AliveStateId.Alive) && (unitMap.checkHasUnitForPlayer(v)));

        for (const actionId of this.getWarEvent(warEventId).getRootNodeAndActionsArray()[dataIndex].getActionIdArray()) {
            await this._callActionWithoutExtraData(actionId, isFastExecute);
        }

        for (const playerIndex of playerIndexes) {
            const player = playerManager.getPlayer(playerIndex);
            if ((player.getAliveState() === AliveStateId.Alive)   &&
                (!unitMap.checkHasUnitForPlayer(playerIndex))
            ) {
                player.setAliveState(AliveStateId.Dying);
            }
        }
    }

    private async _callActionWithExtraData(warEventActionId: number, isFastExecute: boolean): Promise<void> {
        const action    = this.getWarEventAction(warEventActionId);
        const war       = this._getWar();
        {
            const act = action.getWeaAddUnitOnMapSimple();
            if (act) {
                return WarEventsActionsUtilsAddUnitOnMapSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapExpr();
            if (act) {
                return WarEventsActionsUtilsFillUnitOnMapExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapSimple();
            if (act) {
                return WarEventsActionsUtilsFillUnitOnMapSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedSimple();
            if (act) {
                return WarEventsActionsUtilsFillUnitLoadedSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedExpr();
            if (act) {
                return WarEventsActionsUtilsFillUnitLoadedExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDestroyUnitSimple();
            if (act) {
                return WarEventsActionsUtilsDestroyUnitSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDestroyUnitExpr();
            if (act) {
                return WarEventsActionsUtilsDestroyUnitExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitTypeSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitTypeSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitTypeExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitTypeExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitOwnershipSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitOwnershipExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitPositionSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitPositionSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitPositionExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitPositionExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitStateSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitStateExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaAddUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsAddUnitBuffSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaModifyUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsModifyUnitBuffSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDeleteUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsDeleteUnitBuffSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaBigDialogueSimple();
            if (act) {
                return WarEventsActionsUtilsBigDialogueSimpleApplyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointExpr();
            if (act) {
                return WarEventsActionsUtilsSetViewpointExprApplyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointSimple();
            if (act) {
                return WarEventsActionsUtilsSetViewpointSimpleApplyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherExpr();
            if (act) {
                return WarEventsActionsUtilsSetWeatherExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetWeatherSimple();
            if (act) {
                return WarEventsActionsUtilsSetWeatherSimpleApplyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSmallDialogueSimple();
            if (act) {
                return WarEventsActionsUtilsSmallDialogueSimpleApplyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlayBgm();
            if (act) {
                return WarEventsActionsUtilsPlayBgmApplyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlaySfx();
            if (act) {
                return WarEventsActionsUtilsPlaySfxApplyWithExtraData(act, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeExpr();
            if (act) {
                return WarEventsActionsUtilsSetForceFogCodeExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeSimple();
            if (act) {
                return WarEventsActionsUtilsSetForceFogCodeSimpleApplyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetCustomCounters();
            if (act) {
                return WarEventsActionsUtilsSetCustomCountersApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaStopPersistentAction();
            if (act) {
                return WarEventsActionsUtilsStopPersistentActionApplyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetPlayerStateExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetPlayerStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetPlayerStateSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTaskObjectiveState();
            if (act) {
                return WarEventsActionsUtilsSetTaskObjectiveStateApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitMovePathVisibility();
            if (act) {
                return WarEventsActionsUtilsSetUnitMovePathVisibilityApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileTypeExpr();
            if (act) {
                return WarEventsActionsUtilsSetTileTypeExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileTypeSimple();
            if (act) {
                return WarEventsActionsUtilsSetTileTypeSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetTileStateExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetTileStateSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomBuildingStateExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomBuildingStateSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomCannonStateExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomCannonStateSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomCrystalStateExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomCrystalStateSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomLaserTurretStateExprApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomLaserTurretStateSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsDeleteTileBuffExprApplyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsDeleteTileBuffSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaAddTileBuffExpr();
            if (act) {
                return applyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaAddTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsAddTileBuffSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaModifyTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsModifyTileBuffExprApplyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaModifyTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsModifyTileBuffSimpleApplyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaPersistentShowText();
            if (act) {
                return WarEventsActionsUtilsPersistentShowTextApplyWithExtraData(act, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentPlayBgm();
            if (act) {
                return WarEventsActionsUtilsPersistentPlayBgmApplyWithExtraData(act, isFastExecute, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentModifyPlayerAttribute();
            if (act) {
                return WarEventsActionsUtilsPersistentModifyPlayerAttributeApplyWithExtraData(act, war, warEventActionId);
            }
        }
        {
            const act = action.getWeaPersistentModifyUnitAttribute();
            if (act) {
                return WarEventsActionsUtilsPersistentModifyUnitAttributeApplyWithExtraData(act, war, warEventActionId);
            }
        }

        // todo: add more actions.
        throw newError(`Invalid action.`);
    }
    private async _callActionWithoutExtraData(warEventActionId: number, isFastExecute: boolean): Promise<void> {
        const action    = this.getWarEventAction(warEventActionId);
        const war       = this._getWar();
        {
            const act = action.getWeaAddUnitOnMapSimple();
            if (act) {
                return WarEventsActionsUtilsAddUnitOnMapSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapExpr();
            if (act) {
                return WarEventsActionsUtilsFillUnitOnMapExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapSimple();
            if (act) {
                return WarEventsActionsUtilsFillUnitOnMapSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedSimple();
            if (act) {
                return WarEventsActionsUtilsFillUnitLoadedSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedExpr();
            if (act) {
                return WarEventsActionsUtilsFillUnitLoadedExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDestroyUnitSimple();
            if (act) {
                return WarEventsActionsUtilsDestroyUnitSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDestroyUnitExpr();
            if (act) {
                return WarEventsActionsUtilsDestroyUnitExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitTypeSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitTypeSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitTypeExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitTypeExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitOwnershipSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitOwnershipExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitPositionSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitPositionSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitPositionExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitPositionExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitStateSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitStateExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaAddUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsAddUnitBuffSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaModifyUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsModifyUnitBuffSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDeleteUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsDeleteUnitBuffSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaBigDialogueSimple();
            if (act) {
                return WarEventsActionsUtilsBigDialogueSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointExpr();
            if (act) {
                return WarEventsActionsUtilsSetViewpointExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointSimple();
            if (act) {
                return WarEventsActionsUtilsSetViewpointSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherExpr();
            if (act) {
                return WarEventsActionsUtilsSetWeatherExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherSimple();
            if (act) {
                return WarEventsActionsUtilsSetWeatherSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSmallDialogueSimple();
            if (act) {
                return WarEventsActionsUtilsSmallDialogueSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlayBgm();
            if (act) {
                return WarEventsActionsUtilsPlayBgmApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlaySfx();
            if (act) {
                return WarEventsActionsUtilsPlaySfxApplyWithoutExtraData(act, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeExpr();
            if (act) {
                return WarEventsActionsUtilsSetForceFogCodeExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeSimple();
            if (act) {
                return WarEventsActionsUtilsSetForceFogCodeSimpleApplyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetCustomCounters();
            if (act) {
                return WarEventsActionsUtilsSetCustomCountersApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaStopPersistentAction();
            if (act) {
                return WarEventsActionsUtilsStopPersistentActionApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetPlayerStateExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetPlayerStateSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTaskObjectiveState();
            if (act) {
                return WarEventsActionsUtilsSetTaskObjectiveStateApplyWithoutExtraData(act, war);
            }
        }
        {
            const act = action.getWeaSetUnitMovePathVisibility();
            if (act) {
                return WarEventsActionsUtilsSetUnitMovePathVisibilityApplyWithoutExtraData(act, war);
            }
        }
        {
            const act = action.getWeaSetTileTypeExpr();
            if (act) {
                return WarEventsActionsUtilsSetTileTypeExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileTypeSimple();
            if (act) {
                return WarEventsActionsUtilsSetTileTypeSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetTileStateExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetTileStateSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomBuildingStateExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomBuildingStateSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomCannonStateExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomCannonStateSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomCrystalStateExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomCrystalStateSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomLaserTurretStateExprApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomLaserTurretStateSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsDeleteTileBuffExprApplyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsDeleteTileBuffSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaAddTileBuffExpr();
            if (act) {
                return applyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaAddTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsAddTileBuffSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaModifyTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsModifyTileBuffExprApplyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaModifyTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsModifyTileBuffSimpleApplyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPersistentShowText();
            if (act) {
                return WarEventsActionsUtilsPersistentShowTextApplyWithoutExtraData(act, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentPlayBgm();
            if (act) {
                return WarEventsActionsUtilsPersistentPlayBgmApplyWithoutExtraData(act, isFastExecute, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentModifyPlayerAttribute();
            if (act) {
                return WarEventsActionsUtilsPersistentModifyPlayerAttributeApplyWithoutExtraData(act, war, warEventActionId);
            }
        }
        {
            const act = action.getWeaPersistentModifyUnitAttribute();
            if (act) {
                return WarEventsActionsUtilsPersistentModifyUnitAttributeApplyWithoutExtraData(act, war, warEventActionId);
            }
        }

        // todo: add more actions.
        throw newError(`Invalid action.`);
    }

    public getCallableWarEventIdAndDataIndex(): WarEventIdAndDataIndex | null {                                // DONE
        const war = this._getWar();
        if (war.checkIsExceedTurnsOrWarOperationsLimit()) {
            return null;
        }

        const warEventArray = war.getCommonSettingManager().getInstanceWarRule().getWarEventFullData()?.getEventArray();
        if (!warEventArray?.length) {
            return null;
        }

        const randomNumberManager   = war.getRandomNumberManager();
        const randomState           = randomNumberManager.getIsNeedSeedRandom() ? randomNumberManager.getSeedRandomCurrentStateJson() : null;
        const nodeResultDict        = new Map<number, boolean>();
        const conditionResultDict   = new Map<number, boolean>();
        let result                  : WarEventIdAndDataIndex | null = null;

        for (const warEvent of warEventArray) {
            const warEventId    = warEvent.getEventId();
            const dataIndex     = this._getCallableNodeAndActionsIndex(warEventId, nodeResultDict, conditionResultDict);
            if (dataIndex != null) {
                result = { warEventId: warEventId, dataIndex: dataIndex };
                break;
            }
        }

        if (randomState) {
            randomNumberManager.setSeedRandomCurrentStateJson(randomState);
        }
        return result;
    }
    private _getCallableNodeAndActionsIndex(warEventId: number, nodeResultDict: Map<number, boolean>, conditionResultDict: Map<number, boolean>): number | null {   // DONE
        const warEvent = this.getWarEvent(warEventId);
        if ((this.getWarEventCalledCountInPlayerTurn(warEventId) >= warEvent.getMaxCallCountInPlayerTurn()) ||
            (this.getWarEventCalledCountTotal(warEventId) >= warEvent.getMaxCallCountTotal())
        ) {
            return null;
        }

        if ((!warEvent.getCanBeTriggeredRightAfterAnyEvent())                                                               &&
            (this._getWar().getExecutedOperationManager().getLastExecutedOperation()?.getWoSystemCallWarEvent() != null)
        ) {
            return null;
        }

        const rootNodeAndActionsArray = warEvent.getRootNodeAndActionsArray();
        for (let index = 0; index < rootNodeAndActionsArray.length; index++) {
            if (this._checkIsMeetConditionNode(
                getExisted(rootNodeAndActionsArray[index].getNodeIdAndFlags()),
                nodeResultDict,
                conditionResultDict
            )) {
                return index;
            }
        }

        return null;
    }

    private _checkIsMeetConditionNode(nodeIdAndFlags: NodeIdAndFlags, nodeResultDict: Map<number, boolean>, conditionResultDict: Map<number, boolean>): boolean {            // DONE
        const nodeId    = nodeIdAndFlags.getNodeId();
        const isNegated = nodeIdAndFlags.getIsNegated();
        if (nodeResultDict.has(nodeId)) {
            const result = nodeResultDict.get(nodeId);
            return isNegated ? (!result) : (!!result);
        }

        const node                      = this._getConditionNode(nodeId);
        const isNeedAnd                 = node.getIsNeedAnd();
        const isNeedFalse               = node.getIsNeedFalse();
        const conditionIdAndFlagsArray  = node.getConditionIdAndFlagsArray();
        const subNodeIdAndFlagsArray    = node.getSubNodeIdAndFlagsArray();
        if ((!conditionIdAndFlagsArray?.length) && (!subNodeIdAndFlagsArray?.length)) {
            throw newError(`Empty conditionIdArray and subNodeIdArray.`);
        }

        let isAnySubConTrue     = false;
        let isAnySubConFalse    = false;
        if (conditionIdAndFlagsArray) {
            for (const conditionIdAndFlags of conditionIdAndFlagsArray) {
                const isConditionMet = this._checkIsMeetCondition(conditionIdAndFlags, conditionResultDict);
                if (isNeedAnd) {
                    if (((isConditionMet) && (isNeedFalse))     ||
                        ((!isConditionMet) && (!isNeedFalse))
                    ){
                        nodeResultDict.set(nodeId, false);
                        return isNegated ? true : false;
                    }
                } else {
                    if (((isConditionMet) && (!isNeedFalse))    ||
                        ((!isConditionMet) && (isNeedFalse))
                    ){
                        nodeResultDict.set(nodeId, true);
                        return isNegated ? false : true;
                    }
                }

                isAnySubConTrue     ||= isConditionMet;
                isAnySubConFalse    ||= !isConditionMet;
            }
        }

        if (subNodeIdAndFlagsArray) {
            for (const subNodeIdAndFlags of subNodeIdAndFlagsArray) {
                const isSubNodeMet = this._checkIsMeetConditionNode(subNodeIdAndFlags, nodeResultDict, conditionResultDict);
                if (isNeedAnd) {
                    if (((isSubNodeMet) && (isNeedFalse))   ||
                        ((!isSubNodeMet) && (!isNeedFalse))
                    ){
                        nodeResultDict.set(nodeId, false);
                        return isNegated ? true : false;
                    }
                } else {
                    if (((isSubNodeMet) && (!isNeedFalse))  ||
                        ((!isSubNodeMet) && (isNeedFalse))
                    ){
                        nodeResultDict.set(nodeId, true);
                        return isNegated ? false : true;
                    }
                }

                isAnySubConTrue     ||= isSubNodeMet;
                isAnySubConFalse    ||= !isSubNodeMet;
            }
        }

        if (isNeedFalse) {
            nodeResultDict.set(nodeId, isAnySubConFalse);
            return isNegated ? !isAnySubConFalse : isAnySubConFalse;
        } else {
            nodeResultDict.set(nodeId, isAnySubConTrue);
            return isNegated ? !isAnySubConTrue : isAnySubConTrue;
        }
    }
    private _checkIsMeetCondition(conditionIdAndFlags: ConditionIdAndFlags, conditionResultDict: Map<number, boolean>): boolean {
        const conditionId   = conditionIdAndFlags.getConditionId();
        const isNegated     = conditionIdAndFlags.getIsNegated();
        if (conditionResultDict.has(conditionId)) {
            const result = conditionResultDict.get(conditionId);
            return isNegated ? (!result) : (!!result);
        }

        const war       = this._getWar();
        const result    = ((): boolean => {
            const condition = this._getCondition(conditionId);
            {
                const con = condition.getWecEventCalledCount();
                if (con) {
                    return WarEventsConditionsUtilsEventCalledCountCheckIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecPlayerPresence();
                if (con) {
                    return WarEventsConditionsUtilsPlayerPresenceCheckIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecTurnAndPlayer();
                if (con) {
                    return WarEventsConditionsUtilsTurnAndPlayerCheckIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecWeatherAndFog();
                if (con) {
                    return WarEventsConditionsUtilsWeatherAndFogCheckIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecTilePresence();
                if (con) {
                    return WarEventsConditionsUtilsTilePresenceCheckIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecUnitPresence();
                if (con) {
                    return WarEventsConditionsUtilsUnitPresenceCheckIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecExpression();
                if (con) {
                    return WarEventsConditionsUtilsExpressionCheckIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecCustomCounter();
                if (con) {
                    return checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecOngoingPersistentActionPresence();
                if (con) {
                    return WarEventsConditionsUtilsOngoingPersistentActionPresenceCheckIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecManualActionStatistics();
                if (con) {
                    return WarEventsConditionsUtilsManualActionStatisticsCheckIsMeet(con, war);
                }
            }

            throw newError(`Invalid condition!`);
        })();

        conditionResultDict.set(conditionId, result);
        return isNegated ? (!result) : (!!result);
    }

    public getWarEvent(warEventId: number): WarEvent {                    // DONE
        return getExisted(this.getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === warEventId));
    }
    private _getConditionNode(nodeId: number): WarEventConditionNode {    // DONE
        return getExisted(this.getWarEventFullData()?.getConditionNodeArray()?.find(v => v.getNodeId() === nodeId));
    }
    private _getCondition(conditionId: number): WarEventCondition {       // DONE
        return getExisted(this.getWarEventFullData()?.getConditionArray()?.find(v => v.getWecCommonData()?.getConditionId() === conditionId));
    }
    public getWarEventAction(actionId: number): WarEventAction {          // DONE
        return getExisted(this.getWarEventFullData()?.getActionArray()?.find(v => v.getWeaCommonData()?.getActionId() === actionId));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // misc
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getCalledDialogueActionIdArray(): number[] {
        // TODO: 此函数返回结果包含了所有已触发过的事件里的不同条件分支的所有对话，但是一个事件被触发过不代表所有条件分支都被触发过，因此如果某个事件的不同条件分支里包含不同对话，结果会出错
        const actionIdArray: number[] = [];
        for (const calledCountInfo of this._getCalledCountList() ?? []) {
            if ((calledCountInfo.getCalledCountTotal()) <= 0) {
                continue;
            }

            for (const rootNodeAndActions of this.getWarEvent(calledCountInfo.getEventId()).getRootNodeAndActionsArray()) {
                for (const actionId of rootNodeAndActions.getActionIdArray()) {
                    const action = this.getWarEventAction(actionId);
                    if ((action.getWeaBigDialogueSimple()) || (action.getWeaSmallDialogueSimple())) {
                        if (!actionIdArray.includes(actionId)) {
                            actionIdArray.push(actionId);
                        }
                    }
                }
            }
        }
        return actionIdArray;
    }
}
