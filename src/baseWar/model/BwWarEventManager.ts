import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import type { IBwWarEventManager } from "../interface/IBwWarEventManager.ts";
import { Constants } from "../../customCounters/Constants.ts";
import {
    checkIsValidCustomCounterArray,
    checkIsValidId,
    checkIsValidValue,
} from "../../customCounters/Utils.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import {
    newError,
    getExisted,
    getDefined,
} from "../../helpers/Misc.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import {
    PlayerIndex,
    AliveStateId,
} from "../../players/Constants.ts";
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
import {
    applyWithExtraData as applyAddTileBuffExprWithExtraData,
    applyWithoutExtraData as applyAddTileBuffExprWithoutExtraData,
} from "../../warEvents/actions/utils/AddTileBuffExpr.ts";
import {
    applyWithExtraData as applyAddTileBuffSimpleWithExtraData,
    applyWithoutExtraData as applyAddTileBuffSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/AddTileBuffSimple.ts";
import {
    applyWithExtraData as applyAddUnitBuffSimpleWithExtraData,
    applyWithoutExtraData as applyAddUnitBuffSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/AddUnitBuffSimple.ts";
import {
    applyWithExtraData as applyAddUnitOnMapSimpleWithExtraData,
    applyWithoutExtraData as applyAddUnitOnMapSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/AddUnitOnMapSimple.ts";
import {
    applyWithExtraData as applyBigDialogueSimpleWithExtraData,
    applyWithoutExtraData as applyBigDialogueSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/BigDialogueSimple.ts";
import { checkIsPersistentAction } from "../../warEvents/actions/utils/Common.ts";
import {
    applyWithExtraData as applyDeleteTileBuffExprWithExtraData,
    applyWithoutExtraData as applyDeleteTileBuffExprWithoutExtraData,
} from "../../warEvents/actions/utils/DeleteTileBuffExpr.ts";
import {
    applyWithExtraData as applyDeleteTileBuffSimpleWithExtraData,
    applyWithoutExtraData as applyDeleteTileBuffSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/DeleteTileBuffSimple.ts";
import {
    applyWithExtraData as applyDeleteUnitBuffSimpleWithExtraData,
    applyWithoutExtraData as applyDeleteUnitBuffSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/DeleteUnitBuffSimple.ts";
import {
    applyWithExtraData as applyDestroyUnitExprWithExtraData,
    applyWithoutExtraData as applyDestroyUnitExprWithoutExtraData,
} from "../../warEvents/actions/utils/DestroyUnitExpr.ts";
import {
    applyWithExtraData as applyDestroyUnitSimpleWithExtraData,
    applyWithoutExtraData as applyDestroyUnitSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/DestroyUnitSimple.ts";
import {
    applyWithExtraData as applyFillUnitLoadedExprWithExtraData,
    applyWithoutExtraData as applyFillUnitLoadedExprWithoutExtraData,
} from "../../warEvents/actions/utils/FillUnitLoadedExpr.ts";
import {
    applyWithExtraData as applyFillUnitLoadedSimpleWithExtraData,
    applyWithoutExtraData as applyFillUnitLoadedSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/FillUnitLoadedSimple.ts";
import {
    applyWithExtraData as applyFillUnitOnMapExprWithExtraData,
    applyWithoutExtraData as applyFillUnitOnMapExprWithoutExtraData,
} from "../../warEvents/actions/utils/FillUnitOnMapExpr.ts";
import {
    applyWithExtraData as applyFillUnitOnMapSimpleWithExtraData,
    applyWithoutExtraData as applyFillUnitOnMapSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/FillUnitOnMapSimple.ts";
import {
    applyWithExtraData as applyModifyTileBuffExprWithExtraData,
    applyWithoutExtraData as applyModifyTileBuffExprWithoutExtraData,
} from "../../warEvents/actions/utils/ModifyTileBuffExpr.ts";
import {
    applyWithExtraData as applyModifyTileBuffSimpleWithExtraData,
    applyWithoutExtraData as applyModifyTileBuffSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/ModifyTileBuffSimple.ts";
import {
    applyWithExtraData as applyModifyUnitBuffSimpleWithExtraData,
    applyWithoutExtraData as applyModifyUnitBuffSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/ModifyUnitBuffSimple.ts";
import {
    checkCanActivateCoSkillForPlayer,
    checkCanProduceUnitForPlayer,
    getActEnergyGrowthMultiplierModifierForPlayer,
    getActAiUnitProductionBonusScore,
    getActCoZoneRadiusModifierForPlayer,
    applyWithExtraData as applyPersistentModifyPlayerAttributeWithExtraData,
    applyWithoutExtraData as applyPersistentModifyPlayerAttributeWithoutExtraData,
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
    applyWithExtraData as applyPersistentModifyUnitAttributeWithExtraData,
    applyWithoutExtraData as applyPersistentModifyUnitAttributeWithoutExtraData,
} from "../../warEvents/actions/utils/PersistentModifyUnitAttribute.ts";
import {
    applyWithExtraData as applyPersistentPlayBgmWithExtraData,
    applyWithoutExtraData as applyPersistentPlayBgmWithoutExtraData,
} from "../../warEvents/actions/utils/PersistentPlayBgm.ts";
import {
    applyWithExtraData as applyPersistentShowTextWithExtraData,
    applyWithoutExtraData as applyPersistentShowTextWithoutExtraData,
} from "../../warEvents/actions/utils/PersistentShowText.ts";
import {
    applyWithExtraData as applyPlayBgmWithExtraData,
    applyWithoutExtraData as applyPlayBgmWithoutExtraData,
} from "../../warEvents/actions/utils/PlayBgm.ts";
import {
    applyWithExtraData as applyPlaySfxWithExtraData,
    applyWithoutExtraData as applyPlaySfxWithoutExtraData,
} from "../../warEvents/actions/utils/PlaySfx.ts";
import {
    applyWithExtraData as applySetCustomBuildingStateExprWithExtraData,
    applyWithoutExtraData as applySetCustomBuildingStateExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomBuildingStateExpr.ts";
import {
    applyWithExtraData as applySetCustomBuildingStateSimpleWithExtraData,
    applyWithoutExtraData as applySetCustomBuildingStateSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomBuildingStateSimple.ts";
import {
    applyWithExtraData as applySetCustomCannonStateExprWithExtraData,
    applyWithoutExtraData as applySetCustomCannonStateExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCannonStateExpr.ts";
import {
    applyWithExtraData as applySetCustomCannonStateSimpleWithExtraData,
    applyWithoutExtraData as applySetCustomCannonStateSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCannonStateSimple.ts";
import {
    applyWithExtraData as applySetCustomCountersWithExtraData,
    applyWithoutExtraData as applySetCustomCountersWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCounters.ts";
import {
    applyWithExtraData as applySetCustomCrystalStateExprWithExtraData,
    applyWithoutExtraData as applySetCustomCrystalStateExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCrystalStateExpr.ts";
import {
    applyWithExtraData as applySetCustomCrystalStateSimpleWithExtraData,
    applyWithoutExtraData as applySetCustomCrystalStateSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomCrystalStateSimple.ts";
import {
    applyWithExtraData as applySetCustomLaserTurretStateExprWithExtraData,
    applyWithoutExtraData as applySetCustomLaserTurretStateExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomLaserTurretStateExpr.ts";
import {
    applyWithExtraData as applySetCustomLaserTurretStateSimpleWithExtraData,
    applyWithoutExtraData as applySetCustomLaserTurretStateSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetCustomLaserTurretStateSimple.ts";
import {
    applyWithExtraData as applySetForceFogCodeExprWithExtraData,
    applyWithoutExtraData as applySetForceFogCodeExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetForceFogCodeExpr.ts";
import {
    applyWithExtraData as applySetForceFogCodeSimpleWithExtraData,
    applyWithoutExtraData as applySetForceFogCodeSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetForceFogCodeSimple.ts";
import {
    applyWithExtraData as applySetPlayerStateExprWithExtraData,
    applyWithoutExtraData as applySetPlayerStateExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetPlayerStateExpr.ts";
import {
    applyWithExtraData as applySetPlayerStateSimpleWithExtraData,
    applyWithoutExtraData as applySetPlayerStateSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetPlayerStateSimple.ts";
import {
    applyWithExtraData as applySetTaskObjectiveStateWithExtraData,
    applyWithoutExtraData as applySetTaskObjectiveStateWithoutExtraData,
} from "../../warEvents/actions/utils/SetTaskObjectiveState.ts";
import {
    applyWithExtraData as applySetTileStateExprWithExtraData,
    applyWithoutExtraData as applySetTileStateExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetTileStateExpr.ts";
import {
    applyWithExtraData as applySetTileStateSimpleWithExtraData,
    applyWithoutExtraData as applySetTileStateSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetTileStateSimple.ts";
import {
    applyWithExtraData as applySetTileTypeExprWithExtraData,
    applyWithoutExtraData as applySetTileTypeExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetTileTypeExpr.ts";
import {
    applyWithExtraData as applySetTileTypeSimpleWithExtraData,
    applyWithoutExtraData as applySetTileTypeSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetTileTypeSimple.ts";
import {
    applyWithExtraData as applySetUnitMovePathVisibilityWithExtraData,
    applyWithoutExtraData as applySetUnitMovePathVisibilityWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitMovePathVisibility.ts";
import {
    applyWithExtraData as applySetUnitOwnershipExprWithExtraData,
    applyWithoutExtraData as applySetUnitOwnershipExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitOwnershipExpr.ts";
import {
    applyWithExtraData as applySetUnitOwnershipSimpleWithExtraData,
    applyWithoutExtraData as applySetUnitOwnershipSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitOwnershipSimple.ts";
import {
    applyWithExtraData as applySetUnitPositionExprWithExtraData,
    applyWithoutExtraData as applySetUnitPositionExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitPositionExpr.ts";
import {
    applyWithExtraData as applySetUnitPositionSimpleWithExtraData,
    applyWithoutExtraData as applySetUnitPositionSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitPositionSimple.ts";
import {
    applyWithExtraData as applySetUnitStateExprWithExtraData,
    applyWithoutExtraData as applySetUnitStateExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitStateExpr.ts";
import {
    applyWithExtraData as applySetUnitStateSimpleWithExtraData,
    applyWithoutExtraData as applySetUnitStateSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitStateSimple.ts";
import {
    applyWithExtraData as applySetUnitTypeExprWithExtraData,
    applyWithoutExtraData as applySetUnitTypeExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitTypeExpr.ts";
import {
    applyWithExtraData as applySetUnitTypeSimpleWithExtraData,
    applyWithoutExtraData as applySetUnitTypeSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetUnitTypeSimple.ts";
import {
    applyWithExtraData as applySetViewpointExprWithExtraData,
    applyWithoutExtraData as applySetViewpointExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetViewpointExpr.ts";
import {
    applyWithExtraData as applySetViewpointSimpleWithExtraData,
    applyWithoutExtraData as applySetViewpointSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetViewpointSimple.ts";
import {
    applyWithExtraData as applySetWeatherExprWithExtraData,
    applyWithoutExtraData as applySetWeatherExprWithoutExtraData,
} from "../../warEvents/actions/utils/SetWeatherExpr.ts";
import {
    applyWithExtraData as applySetWeatherSimpleWithExtraData,
    applyWithoutExtraData as applySetWeatherSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SetWeatherSimple.ts";
import {
    applyWithExtraData as applySmallDialogueSimpleWithExtraData,
    applyWithoutExtraData as applySmallDialogueSimpleWithoutExtraData,
} from "../../warEvents/actions/utils/SmallDialogueSimple.ts";
import {
    applyWithExtraData as applyStopPersistentActionWithExtraData,
    applyWithoutExtraData as applyStopPersistentActionWithoutExtraData,
} from "../../warEvents/actions/utils/StopPersistentAction.ts";
import { checkIsMeet as checkCustomCounterIsMeet } from "../../warEvents/conditions/utils/CustomCounter.ts";
import { checkIsMeet as checkEventCalledCountIsMeet } from "../../warEvents/conditions/utils/EventCalledCount.ts";
import { checkIsMeet as checkExpressionIsMeet } from "../../warEvents/conditions/utils/Expression.ts";
import { checkIsMeet as checkManualActionStatisticsIsMeet } from "../../warEvents/conditions/utils/ManualActionStatistics.ts";
import { checkIsMeet as checkOngoingPersistentActionPresenceIsMeet } from "../../warEvents/conditions/utils/OngoingPersistentActionPresence.ts";
import { checkIsMeet as checkPlayerPresenceIsMeet } from "../../warEvents/conditions/utils/PlayerPresence.ts";
import { checkIsMeet as checkTilePresenceIsMeet } from "../../warEvents/conditions/utils/TilePresence.ts";
import { checkIsMeet as checkTurnAndPlayerIsMeet } from "../../warEvents/conditions/utils/TurnAndPlayer.ts";
import { checkIsMeet as checkUnitPresenceIsMeet } from "../../warEvents/conditions/utils/UnitPresence.ts";
import { checkIsMeet as checkWeatherAndFogIsMeet } from "../../warEvents/conditions/utils/WeatherAndFog.ts";
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
                return applyAddUnitOnMapSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapExpr();
            if (act) {
                return applyFillUnitOnMapExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapSimple();
            if (act) {
                return applyFillUnitOnMapSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedSimple();
            if (act) {
                return applyFillUnitLoadedSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedExpr();
            if (act) {
                return applyFillUnitLoadedExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDestroyUnitSimple();
            if (act) {
                return applyDestroyUnitSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDestroyUnitExpr();
            if (act) {
                return applyDestroyUnitExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitTypeSimple();
            if (act) {
                return applySetUnitTypeSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitTypeExpr();
            if (act) {
                return applySetUnitTypeExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipSimple();
            if (act) {
                return applySetUnitOwnershipSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipExpr();
            if (act) {
                return applySetUnitOwnershipExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitPositionSimple();
            if (act) {
                return applySetUnitPositionSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitPositionExpr();
            if (act) {
                return applySetUnitPositionExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitStateSimple();
            if (act) {
                return applySetUnitStateSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitStateExpr();
            if (act) {
                return applySetUnitStateExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaAddUnitBuffSimple();
            if (act) {
                return applyAddUnitBuffSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaModifyUnitBuffSimple();
            if (act) {
                return applyModifyUnitBuffSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDeleteUnitBuffSimple();
            if (act) {
                return applyDeleteUnitBuffSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaBigDialogueSimple();
            if (act) {
                return applyBigDialogueSimpleWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointExpr();
            if (act) {
                return applySetViewpointExprWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointSimple();
            if (act) {
                return applySetViewpointSimpleWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherExpr();
            if (act) {
                return applySetWeatherExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetWeatherSimple();
            if (act) {
                return applySetWeatherSimpleWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSmallDialogueSimple();
            if (act) {
                return applySmallDialogueSimpleWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlayBgm();
            if (act) {
                return applyPlayBgmWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlaySfx();
            if (act) {
                return applyPlaySfxWithExtraData(act, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeExpr();
            if (act) {
                return applySetForceFogCodeExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeSimple();
            if (act) {
                return applySetForceFogCodeSimpleWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetCustomCounters();
            if (act) {
                return applySetCustomCountersWithExtraData(act);
            }
        }
        {
            const act = action.getWeaStopPersistentAction();
            if (act) {
                return applyStopPersistentActionWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateExpr();
            if (act) {
                return applySetPlayerStateExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetPlayerStateSimple();
            if (act) {
                return applySetPlayerStateSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTaskObjectiveState();
            if (act) {
                return applySetTaskObjectiveStateWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitMovePathVisibility();
            if (act) {
                return applySetUnitMovePathVisibilityWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileTypeExpr();
            if (act) {
                return applySetTileTypeExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileTypeSimple();
            if (act) {
                return applySetTileTypeSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileStateExpr();
            if (act) {
                return applySetTileStateExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileStateSimple();
            if (act) {
                return applySetTileStateSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateExpr();
            if (act) {
                return applySetCustomBuildingStateExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateSimple();
            if (act) {
                return applySetCustomBuildingStateSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateExpr();
            if (act) {
                return applySetCustomCannonStateExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateSimple();
            if (act) {
                return applySetCustomCannonStateSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateExpr();
            if (act) {
                return applySetCustomCrystalStateExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateSimple();
            if (act) {
                return applySetCustomCrystalStateSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateExpr();
            if (act) {
                return applySetCustomLaserTurretStateExprWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateSimple();
            if (act) {
                return applySetCustomLaserTurretStateSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffExpr();
            if (act) {
                return applyDeleteTileBuffExprWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffSimple();
            if (act) {
                return applyDeleteTileBuffSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaAddTileBuffExpr();
            if (act) {
                return applyAddTileBuffExprWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaAddTileBuffSimple();
            if (act) {
                return applyAddTileBuffSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaModifyTileBuffExpr();
            if (act) {
                return applyModifyTileBuffExprWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaModifyTileBuffSimple();
            if (act) {
                return applyModifyTileBuffSimpleWithExtraData(act);
            }
        }
        {
            const act = action.getWeaPersistentShowText();
            if (act) {
                return applyPersistentShowTextWithExtraData(act, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentPlayBgm();
            if (act) {
                return applyPersistentPlayBgmWithExtraData(act, isFastExecute, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentModifyPlayerAttribute();
            if (act) {
                return applyPersistentModifyPlayerAttributeWithExtraData(act, war, warEventActionId);
            }
        }
        {
            const act = action.getWeaPersistentModifyUnitAttribute();
            if (act) {
                return applyPersistentModifyUnitAttributeWithExtraData(act, war, warEventActionId);
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
                return applyAddUnitOnMapSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapExpr();
            if (act) {
                return applyFillUnitOnMapExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapSimple();
            if (act) {
                return applyFillUnitOnMapSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedSimple();
            if (act) {
                return applyFillUnitLoadedSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedExpr();
            if (act) {
                return applyFillUnitLoadedExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDestroyUnitSimple();
            if (act) {
                return applyDestroyUnitSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDestroyUnitExpr();
            if (act) {
                return applyDestroyUnitExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitTypeSimple();
            if (act) {
                return applySetUnitTypeSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitTypeExpr();
            if (act) {
                return applySetUnitTypeExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipSimple();
            if (act) {
                return applySetUnitOwnershipSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipExpr();
            if (act) {
                return applySetUnitOwnershipExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitPositionSimple();
            if (act) {
                return applySetUnitPositionSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitPositionExpr();
            if (act) {
                return applySetUnitPositionExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitStateSimple();
            if (act) {
                return applySetUnitStateSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitStateExpr();
            if (act) {
                return applySetUnitStateExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaAddUnitBuffSimple();
            if (act) {
                return applyAddUnitBuffSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaModifyUnitBuffSimple();
            if (act) {
                return applyModifyUnitBuffSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDeleteUnitBuffSimple();
            if (act) {
                return applyDeleteUnitBuffSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaBigDialogueSimple();
            if (act) {
                return applyBigDialogueSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointExpr();
            if (act) {
                return applySetViewpointExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointSimple();
            if (act) {
                return applySetViewpointSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherExpr();
            if (act) {
                return applySetWeatherExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherSimple();
            if (act) {
                return applySetWeatherSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSmallDialogueSimple();
            if (act) {
                return applySmallDialogueSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlayBgm();
            if (act) {
                return applyPlayBgmWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlaySfx();
            if (act) {
                return applyPlaySfxWithoutExtraData(act, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeExpr();
            if (act) {
                return applySetForceFogCodeExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeSimple();
            if (act) {
                return applySetForceFogCodeSimpleWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetCustomCounters();
            if (act) {
                return applySetCustomCountersWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaStopPersistentAction();
            if (act) {
                return applyStopPersistentActionWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateExpr();
            if (act) {
                return applySetPlayerStateExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateSimple();
            if (act) {
                return applySetPlayerStateSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTaskObjectiveState();
            if (act) {
                return applySetTaskObjectiveStateWithoutExtraData(act, war);
            }
        }
        {
            const act = action.getWeaSetUnitMovePathVisibility();
            if (act) {
                return applySetUnitMovePathVisibilityWithoutExtraData(act, war);
            }
        }
        {
            const act = action.getWeaSetTileTypeExpr();
            if (act) {
                return applySetTileTypeExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileTypeSimple();
            if (act) {
                return applySetTileTypeSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileStateExpr();
            if (act) {
                return applySetTileStateExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileStateSimple();
            if (act) {
                return applySetTileStateSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateExpr();
            if (act) {
                return applySetCustomBuildingStateExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateSimple();
            if (act) {
                return applySetCustomBuildingStateSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateExpr();
            if (act) {
                return applySetCustomCannonStateExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateSimple();
            if (act) {
                return applySetCustomCannonStateSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateExpr();
            if (act) {
                return applySetCustomCrystalStateExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateSimple();
            if (act) {
                return applySetCustomCrystalStateSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateExpr();
            if (act) {
                return applySetCustomLaserTurretStateExprWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateSimple();
            if (act) {
                return applySetCustomLaserTurretStateSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffExpr();
            if (act) {
                return applyDeleteTileBuffExprWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffSimple();
            if (act) {
                return applyDeleteTileBuffSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaAddTileBuffExpr();
            if (act) {
                return applyAddTileBuffExprWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaAddTileBuffSimple();
            if (act) {
                return applyAddTileBuffSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaModifyTileBuffExpr();
            if (act) {
                return applyModifyTileBuffExprWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaModifyTileBuffSimple();
            if (act) {
                return applyModifyTileBuffSimpleWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPersistentShowText();
            if (act) {
                return applyPersistentShowTextWithoutExtraData(act, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentPlayBgm();
            if (act) {
                return applyPersistentPlayBgmWithoutExtraData(act, isFastExecute, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentModifyPlayerAttribute();
            if (act) {
                return applyPersistentModifyPlayerAttributeWithoutExtraData(act, war, warEventActionId);
            }
        }
        {
            const act = action.getWeaPersistentModifyUnitAttribute();
            if (act) {
                return applyPersistentModifyUnitAttributeWithoutExtraData(act, war, warEventActionId);
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
                    return checkEventCalledCountIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecPlayerPresence();
                if (con) {
                    return checkPlayerPresenceIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecTurnAndPlayer();
                if (con) {
                    return checkTurnAndPlayerIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecWeatherAndFog();
                if (con) {
                    return checkWeatherAndFogIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecTilePresence();
                if (con) {
                    return checkTilePresenceIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecUnitPresence();
                if (con) {
                    return checkUnitPresenceIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecExpression();
                if (con) {
                    return checkExpressionIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecCustomCounter();
                if (con) {
                    return checkCustomCounterIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecOngoingPersistentActionPresence();
                if (con) {
                    return checkOngoingPersistentActionPresenceIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecManualActionStatistics();
                if (con) {
                    return checkManualActionStatisticsIsMeet(con, war);
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
