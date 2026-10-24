import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "../interface/IBwWarEventManager.ts";
import * as CustomCountersConstants from "../../customCounters/Constants.ts";
import * as CustomCountersUtils from "../../customCounters/Utils.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarEventConditionIdAndFlags from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import type * as ProtoSchemaCommonProtoWarEventNodeIdAndFlags from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEvent from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventConditionNode from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent from "../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import * as ProtoSchemaCommonProtoWarSerializationCustomCounter from "../../proto/schema/CommonProto/WarSerialization/CustomCounter.ts";
import * as ProtoSchemaCommonProtoWarSerializationDataForWarEventCalledCount from "../../proto/schema/CommonProto/WarSerialization/DataForWarEventCalledCount.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWarEventManager from "../../proto/schema/CommonProto/WarSerialization/SerialWarEventManager.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarEventsActionsUtilsAddTileBuffExpr from "../../warEvents/actions/utils/AddTileBuffExpr.ts";
import * as WarEventsActionsUtilsAddTileBuffSimple from "../../warEvents/actions/utils/AddTileBuffSimple.ts";
import * as WarEventsActionsUtilsAddUnitBuffSimple from "../../warEvents/actions/utils/AddUnitBuffSimple.ts";
import * as WarEventsActionsUtilsAddUnitOnMapSimple from "../../warEvents/actions/utils/AddUnitOnMapSimple.ts";
import * as WarEventsActionsUtilsBigDialogueSimple from "../../warEvents/actions/utils/BigDialogueSimple.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";
import * as WarEventsActionsUtilsDeleteTileBuffExpr from "../../warEvents/actions/utils/DeleteTileBuffExpr.ts";
import * as WarEventsActionsUtilsDeleteTileBuffSimple from "../../warEvents/actions/utils/DeleteTileBuffSimple.ts";
import * as WarEventsActionsUtilsDeleteUnitBuffSimple from "../../warEvents/actions/utils/DeleteUnitBuffSimple.ts";
import * as WarEventsActionsUtilsDestroyUnitExpr from "../../warEvents/actions/utils/DestroyUnitExpr.ts";
import * as WarEventsActionsUtilsDestroyUnitSimple from "../../warEvents/actions/utils/DestroyUnitSimple.ts";
import * as WarEventsActionsUtilsFillUnitLoadedExpr from "../../warEvents/actions/utils/FillUnitLoadedExpr.ts";
import * as WarEventsActionsUtilsFillUnitLoadedSimple from "../../warEvents/actions/utils/FillUnitLoadedSimple.ts";
import * as WarEventsActionsUtilsFillUnitOnMapExpr from "../../warEvents/actions/utils/FillUnitOnMapExpr.ts";
import * as WarEventsActionsUtilsFillUnitOnMapSimple from "../../warEvents/actions/utils/FillUnitOnMapSimple.ts";
import * as WarEventsActionsUtilsModifyTileBuffExpr from "../../warEvents/actions/utils/ModifyTileBuffExpr.ts";
import * as WarEventsActionsUtilsModifyTileBuffSimple from "../../warEvents/actions/utils/ModifyTileBuffSimple.ts";
import * as WarEventsActionsUtilsModifyUnitBuffSimple from "../../warEvents/actions/utils/ModifyUnitBuffSimple.ts";
import * as WarEventsActionsUtilsPersistentModifyPlayerAttribute from "../../warEvents/actions/utils/PersistentModifyPlayerAttribute.ts";
import * as WarEventsActionsUtilsPersistentModifyUnitAttribute from "../../warEvents/actions/utils/PersistentModifyUnitAttribute.ts";
import * as WarEventsActionsUtilsPersistentPlayBgm from "../../warEvents/actions/utils/PersistentPlayBgm.ts";
import * as WarEventsActionsUtilsPersistentShowText from "../../warEvents/actions/utils/PersistentShowText.ts";
import * as WarEventsActionsUtilsPlayBgm from "../../warEvents/actions/utils/PlayBgm.ts";
import * as WarEventsActionsUtilsPlaySfx from "../../warEvents/actions/utils/PlaySfx.ts";
import * as WarEventsActionsUtilsSetCustomBuildingStateExpr from "../../warEvents/actions/utils/SetCustomBuildingStateExpr.ts";
import * as WarEventsActionsUtilsSetCustomBuildingStateSimple from "../../warEvents/actions/utils/SetCustomBuildingStateSimple.ts";
import * as WarEventsActionsUtilsSetCustomCannonStateExpr from "../../warEvents/actions/utils/SetCustomCannonStateExpr.ts";
import * as WarEventsActionsUtilsSetCustomCannonStateSimple from "../../warEvents/actions/utils/SetCustomCannonStateSimple.ts";
import * as WarEventsActionsUtilsSetCustomCounters from "../../warEvents/actions/utils/SetCustomCounters.ts";
import * as WarEventsActionsUtilsSetCustomCrystalStateExpr from "../../warEvents/actions/utils/SetCustomCrystalStateExpr.ts";
import * as WarEventsActionsUtilsSetCustomCrystalStateSimple from "../../warEvents/actions/utils/SetCustomCrystalStateSimple.ts";
import * as WarEventsActionsUtilsSetCustomLaserTurretStateExpr from "../../warEvents/actions/utils/SetCustomLaserTurretStateExpr.ts";
import * as WarEventsActionsUtilsSetCustomLaserTurretStateSimple from "../../warEvents/actions/utils/SetCustomLaserTurretStateSimple.ts";
import * as WarEventsActionsUtilsSetForceFogCodeExpr from "../../warEvents/actions/utils/SetForceFogCodeExpr.ts";
import * as WarEventsActionsUtilsSetForceFogCodeSimple from "../../warEvents/actions/utils/SetForceFogCodeSimple.ts";
import * as WarEventsActionsUtilsSetPlayerStateExpr from "../../warEvents/actions/utils/SetPlayerStateExpr.ts";
import * as WarEventsActionsUtilsSetPlayerStateSimple from "../../warEvents/actions/utils/SetPlayerStateSimple.ts";
import * as WarEventsActionsUtilsSetTaskObjectiveState from "../../warEvents/actions/utils/SetTaskObjectiveState.ts";
import * as WarEventsActionsUtilsSetTileStateExpr from "../../warEvents/actions/utils/SetTileStateExpr.ts";
import * as WarEventsActionsUtilsSetTileStateSimple from "../../warEvents/actions/utils/SetTileStateSimple.ts";
import * as WarEventsActionsUtilsSetTileTypeExpr from "../../warEvents/actions/utils/SetTileTypeExpr.ts";
import * as WarEventsActionsUtilsSetTileTypeSimple from "../../warEvents/actions/utils/SetTileTypeSimple.ts";
import * as WarEventsActionsUtilsSetUnitMovePathVisibility from "../../warEvents/actions/utils/SetUnitMovePathVisibility.ts";
import * as WarEventsActionsUtilsSetUnitOwnershipExpr from "../../warEvents/actions/utils/SetUnitOwnershipExpr.ts";
import * as WarEventsActionsUtilsSetUnitOwnershipSimple from "../../warEvents/actions/utils/SetUnitOwnershipSimple.ts";
import * as WarEventsActionsUtilsSetUnitPositionExpr from "../../warEvents/actions/utils/SetUnitPositionExpr.ts";
import * as WarEventsActionsUtilsSetUnitPositionSimple from "../../warEvents/actions/utils/SetUnitPositionSimple.ts";
import * as WarEventsActionsUtilsSetUnitStateExpr from "../../warEvents/actions/utils/SetUnitStateExpr.ts";
import * as WarEventsActionsUtilsSetUnitStateSimple from "../../warEvents/actions/utils/SetUnitStateSimple.ts";
import * as WarEventsActionsUtilsSetUnitTypeExpr from "../../warEvents/actions/utils/SetUnitTypeExpr.ts";
import * as WarEventsActionsUtilsSetUnitTypeSimple from "../../warEvents/actions/utils/SetUnitTypeSimple.ts";
import * as WarEventsActionsUtilsSetViewpointExpr from "../../warEvents/actions/utils/SetViewpointExpr.ts";
import * as WarEventsActionsUtilsSetViewpointSimple from "../../warEvents/actions/utils/SetViewpointSimple.ts";
import * as WarEventsActionsUtilsSetWeatherExpr from "../../warEvents/actions/utils/SetWeatherExpr.ts";
import * as WarEventsActionsUtilsSetWeatherSimple from "../../warEvents/actions/utils/SetWeatherSimple.ts";
import * as WarEventsActionsUtilsSmallDialogueSimple from "../../warEvents/actions/utils/SmallDialogueSimple.ts";
import * as WarEventsActionsUtilsStopPersistentAction from "../../warEvents/actions/utils/StopPersistentAction.ts";
import * as WarEventsConditionsUtilsCustomCounter from "../../warEvents/conditions/utils/CustomCounter.ts";
import * as WarEventsConditionsUtilsEventCalledCount from "../../warEvents/conditions/utils/EventCalledCount.ts";
import * as WarEventsConditionsUtilsExpression from "../../warEvents/conditions/utils/Expression.ts";
import * as WarEventsConditionsUtilsManualActionStatistics from "../../warEvents/conditions/utils/ManualActionStatistics.ts";
import * as WarEventsConditionsUtilsOngoingPersistentActionPresence from "../../warEvents/conditions/utils/OngoingPersistentActionPresence.ts";
import * as WarEventsConditionsUtilsPlayerPresence from "../../warEvents/conditions/utils/PlayerPresence.ts";
import * as WarEventsConditionsUtilsTilePresence from "../../warEvents/conditions/utils/TilePresence.ts";
import * as WarEventsConditionsUtilsTurnAndPlayer from "../../warEvents/conditions/utils/TurnAndPlayer.ts";
import * as WarEventsConditionsUtilsUnitPresence from "../../warEvents/conditions/utils/UnitPresence.ts";
import * as WarEventsConditionsUtilsWeatherAndFog from "../../warEvents/conditions/utils/WeatherAndFog.ts";
import type * as WarEventsTypes from "../../warEvents/Types.ts";
import * as WarOperationsExecutorsUtilsCommon from "../../warOperations/executors/utils/Common.ts";

type IUnit                                  = UnitsIUnit.IUnit;
type NodeIdAndFlags                         = ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags;
type ConditionIdAndFlags                    = ProtoSchemaCommonProtoWarEventConditionIdAndFlags.ConditionIdAndFlags;
type WarEventIdAndDataIndex                 = WarEventsTypes.WarEventIdAndDataIndex;

export class BwWarEventManager implements BaseWarInterfaceIBwWarEventManager.IBwWarEventManager {
    private _war?                           : BaseWarInterfaceIBwWar.IBwWar;
    private _calledCountList?               : ProtoSchemaCommonProtoWarSerializationDataForWarEventCalledCount.DataForWarEventCalledCount[] | null;
    private _customCounterArray?            : ProtoSchemaCommonProtoWarSerializationCustomCounter.CustomCounter[] | null;
    private _opaIdArray?                    : number[];

    public init(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWarEventManager.SerialWarEventManager>, warEventFullData: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData>): void {
        if (!data) {
            this._setCalledCountList(null);
            this._setCustomCounterArray(null);
            this._setOpaIdArray([]);
        } else {
            // TODO: validate the data.
            const customCounterArray = data.getCustomCounterArray();
            if ((customCounterArray) && (!CustomCountersUtils.checkIsValidCustomCounterArray(customCounterArray))) {
                throw HelpersMisc.newError(`BwWarEventManager.init() invalid customCounterArray.`, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_Init_00);
            }

            const opaIdArray = data.getOngoingPersistentActionIdArray();
            if (opaIdArray.length !== new Set(opaIdArray).size) {
                throw HelpersMisc.newError(`BwWarEventManager.init() invalid ongoingPersistentActionIdArray.`, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_Init_01);
            }
            for (const actionId of opaIdArray) {
                const action = warEventFullData?.getActionArray()?.find(v => v.getWeaCommonData()?.getActionId() === actionId);
                if ((action == null) || (!WarEventsActionsUtilsCommon.checkIsPersistentAction(action))) {
                    throw HelpersMisc.newError(`BwWarEventManager.init() invalid ongoingPersistentActionIdArray.`, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_Init_02);
                }
            }

            this._setCalledCountList(data.getCalledCountList().map(v => v.clone()));
            this._setCustomCounterArray(customCounterArray.map(v => v.clone()));
            this._setOpaIdArray(opaIdArray);
        }
    }
    public fastInit(data: ProtoSchemaCommonProtoWarSerializationSerialWarEventManager.SerialWarEventManager): void {
        this._setCalledCountList(data.getCalledCountList().map(v => v.clone()));
        this._setCustomCounterArray(data.getCustomCounterArray().map(v => v.clone()));
        this._setOpaIdArray(data.getOngoingPersistentActionIdArray().concat());
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialWarEventManager.SerialWarEventManager {
        return ProtoSchemaCommonProtoWarSerializationSerialWarEventManager.SerialWarEventManager.fromJson({
            calledCountList                 : this._getCalledCountList()?.map(v => v.toJson()) ?? [],
            customCounterArray              : this._getCustomCounterArray()?.map(v => v.toJson()) ?? [],
            ongoingPersistentActionIdArray  : [...this.getOpaIdArray()],
        });
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialWarEventManager.SerialWarEventManager {
        return ProtoSchemaCommonProtoWarSerializationSerialWarEventManager.SerialWarEventManager.fromJson({
            calledCountList                 : this._getCalledCountList()?.map(v => v.clone().toJson()) ?? [],
            customCounterArray              : this._getCustomCounterArray()?.map(v => v.clone().toJson()) ?? [],
            ongoingPersistentActionIdArray  : [...this.getOpaIdArray()],
        });
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialWarEventManager.SerialWarEventManager {
        return this.serializeForCreateSfw();
    }

    public startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void {
        this._setWar(war);
    }

    private _setWar(war: BaseWarInterfaceIBwWar.IBwWar): void {
        this._war = war;
    }
    private _getWar(): BaseWarInterfaceIBwWar.IBwWar {
        return HelpersMisc.getExisted(this._war);
    }

    public getWarEventFullData(): ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData | null {
        return this._getWar().getCommonSettingManager().getInstanceWarRule().getWarEventFullData() ?? null;
    }
    public setWarEventFullData(data: ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData | null): void {
        this._getWar().getCommonSettingManager().getInstanceWarRule().setWarEventFullData(data);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for called counts.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected _setCalledCountList(list: ProtoSchemaCommonProtoWarSerializationDataForWarEventCalledCount.DataForWarEventCalledCount[] | null): void {
        this._calledCountList = list;
    }
    private _getCalledCountList(): ProtoSchemaCommonProtoWarSerializationDataForWarEventCalledCount.DataForWarEventCalledCount[] | null {
        return HelpersMisc.getDefined(this._calledCountList, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_GetCalledCountList_00);
    }

    public updateWarEventCalledCountOnCall(eventId: number): void {                     // DONE
        const calledCountList = this._getCalledCountList();
        if (calledCountList == null) {
            this._setCalledCountList([ProtoSchemaCommonProtoWarSerializationDataForWarEventCalledCount.DataForWarEventCalledCount.fromJson({
                eventId                 : eventId,
                calledCountTotal        : 1,
                calledCountInPlayerTurn : 1,
            })]);
        } else {
            const data = calledCountList.find(v => v.getEventId() === eventId);
            if (data) {
                data.setCalledCountInPlayerTurn((data.getCalledCountInPlayerTurn() ?? 0) + 1);
                data.setCalledCountTotal((data.getCalledCountTotal() ?? 0) + 1);
            } else {
                calledCountList.push(ProtoSchemaCommonProtoWarSerializationDataForWarEventCalledCount.DataForWarEventCalledCount.fromJson({
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
    protected _setCustomCounterArray(counterArray: ProtoSchemaCommonProtoWarSerializationCustomCounter.CustomCounter[] | null): void {
        this._customCounterArray = counterArray;
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCustomCountersChanged);
    }
    private _getCustomCounterArray(): ProtoSchemaCommonProtoWarSerializationCustomCounter.CustomCounter[] | null {
        return HelpersMisc.getDefined(this._customCounterArray, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_GetCustomCounterArray_00);
    }

    public setCustomCounter(counterId: number, counterValue: number): void {
        if (!CustomCountersUtils.checkIsValidId(counterId)) {
            throw HelpersMisc.newError(`BwWarEventManager._setCustomCounter() invalid counterId: ${counterId}`, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_SetCustomCounter_00);
        }

        if (!CustomCountersUtils.checkIsValidValue(counterValue)) {
            throw HelpersMisc.newError(`BwWarEventManager._setCustomCounter() invalid counterValue: ${counterValue}`, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_SetCustomCounter_01);
        }

        const array = this._getCustomCounterArray();
        if (array == null) {
            this._setCustomCounterArray([ProtoSchemaCommonProtoWarSerializationCustomCounter.CustomCounter.fromJson({
                customCounterId : counterId,
                value           : counterValue,
            })]);
        } else {
            const data = array.find(v => v.getCustomCounterId() === counterId);
            if (data) {
                data.setValue(counterValue);
            } else {
                array.push(ProtoSchemaCommonProtoWarSerializationCustomCounter.CustomCounter.fromJson({
                    customCounterId : counterId,
                    value           : counterValue,
                }));
            }
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCustomCountersChanged);
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
            for (let counterId = CustomCountersConstants.Constants.MinId; counterId <= CustomCountersConstants.Constants.MaxId; ++counterId) {
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
        return HelpersMisc.getExisted(this._opaIdArray, UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_GetOngoingPersistentActionIdSet_00);
    }
    public getAllPersistentActionIdArray(): number[] {
        const idArray: number[] = [];
        for (const action of this.getWarEventFullData()?.getActionArray() ?? []) {
            if (WarEventsActionsUtilsCommon.checkIsPersistentAction(action)) {
                idArray.push(action.getWeaCommonData()?.getActionId() ?? 0);
            }
        }
        idArray.sort((v1, v2) => v1 - v2);

        return idArray;
    }
    public updateOpaIdArrayOnExecuteAction(actionId: number): void {
        const opaIdArray = this.getOpaIdArray();
        HelpersCollection.deleteElementFromList(opaIdArray, actionId);
        opaIdArray.push(actionId);
    }
    public updateOpaIdArrayOnDeleteAction(actionIdArray: number[]): void {
        const opaIdArray = this.getOpaIdArray();
        for (const actionId of actionIdArray) {
            HelpersCollection.deleteElementFromList(opaIdArray, actionId);
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
                    const canActivate = WarEventsActionsUtilsPersistentModifyPlayerAttribute.checkCanActivateCoSkillForPlayer(actionData, playerIndex, war);
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
                    const canProduceUnit = WarEventsActionsUtilsPersistentModifyPlayerAttribute.checkCanProduceUnitForPlayer(actionData, playerIndex, unitType, war);
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
                    modifier += WarEventsActionsUtilsPersistentModifyPlayerAttribute.getActEnergyGrowthMultiplierModifierForPlayer(actionData, playerIndex, war);
                }
            }
        }

        return modifier;
    }
    public getOpaAiUnitProductionBonusScore(playerIndex: number, unitTypeId: number, gridIndex: AuxiliaryTypesGridIndex.GridIndex): number {
        const war       = this._getWar();
        let bonusScore  = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyPlayerAttribute();
                if (actionData) {
                    bonusScore += WarEventsActionsUtilsPersistentModifyPlayerAttribute.getActAiUnitProductionBonusScore({
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
                    modifier += WarEventsActionsUtilsPersistentModifyPlayerAttribute.getActCoZoneRadiusModifierForPlayer(actionData, playerIndex, war);
                }
            }
        }

        return modifier;
    }
    public getOpaAttackPowerModifier(unit: IUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEventsActionsUtilsPersistentModifyUnitAttribute.getAttackPowerModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaDefenseModifier(unit: IUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEventsActionsUtilsPersistentModifyUnitAttribute.getDefenseModifierForUnit(actionData, unit);
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
                    modifier += WarEventsActionsUtilsPersistentModifyUnitAttribute.getMoveRangeModifierForUnit(actionData, unit);
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
                    modifier += WarEventsActionsUtilsPersistentModifyUnitAttribute.getMaxAttackRangeModifierForUnit(actionData, unit);
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
                    const canAttack = WarEventsActionsUtilsPersistentModifyUnitAttribute.getCanAttackAfterMovingForUnit(actionData, unit);
                    if (canAttack != null) {
                        return canAttack;
                    }
                }
            }
        }

        return null;
    }
    public getOpaUnitVisionRangeModifier(unit: IUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEventsActionsUtilsPersistentModifyUnitAttribute.getVisionRangeModifierForUnit(actionData, unit);
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
                    const isPenetrating = WarEventsActionsUtilsPersistentModifyUnitAttribute.getIsPenetratingVisionForUnit(actionData, unit);
                    if (isPenetrating != null) {
                        return isPenetrating;
                    }
                }
            }
        }

        return null;
    }
    public getOpaLuckLowerLimitModifier(unit: IUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEventsActionsUtilsPersistentModifyUnitAttribute.getLuckLowerLimitModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaLuckUpperLimitModifier(unit: IUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEventsActionsUtilsPersistentModifyUnitAttribute.getLuckUpperLimitModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaFlareRadiusModifier(unit: IUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEventsActionsUtilsPersistentModifyUnitAttribute.getFlareRadiusModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaFlareRangeModifier(unit: IUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEventsActionsUtilsPersistentModifyUnitAttribute.getFlareRangeModifierForUnit(actionData, unit);
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
                return HelpersMisc.getExisted(action.getBgmCode());
            }
        }

        return null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for calling events.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public async callWarEvent(action: ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent.WoSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
        this._getWar().getIsExecuteActionsWithExtraData()
            ? await this._callWarEventWithExtraData(action, isFastExecute)
            : await this._callWarEventWithoutExtraData(
                HelpersMisc.getExisted(action.getWarEventId(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CallWarEvent_00),
                HelpersMisc.getExisted(action.getNodeAndActionsIndex(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CallWarEvent_01),
                isFastExecute
            );
    }
    private async _callWarEventWithExtraData(action: ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent.WoSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
        for (const actionId of this.getWarEvent(HelpersMisc.getExisted(action.getWarEventId())).getRootNodeAndActionsArray()[HelpersMisc.getExisted(action.getNodeAndActionsIndex())].getActionIdArray()) {
            await this._callActionWithExtraData(actionId, isFastExecute);
        }

        const extraData = HelpersMisc.getExisted(action.getExtraData(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_01);
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : this._getWar(),
            commonExtraData : HelpersMisc.getExisted(extraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_02),
            isFastExecute   : isFastExecute,
        });
    }
    private async _callWarEventWithoutExtraData(warEventId: number, dataIndex: number, isFastExecute: boolean): Promise<void> { // DONE
        const war           = this._getWar();
        const unitMap       = war.getUnitMap();
        const playerManager = war.getPlayerManager();
        const playerIndexes = playerManager.getPlayerIndexArray(PlayersConstants.PlayerIndex.First, false)
            .filter(v => (playerManager.getPlayer(v).getAliveState() === PlayersConstants.AliveStateId.Alive) && (unitMap.checkHasUnitForPlayer(v)));

        for (const actionId of this.getWarEvent(warEventId).getRootNodeAndActionsArray()[dataIndex].getActionIdArray()) {
            await this._callActionWithoutExtraData(actionId, isFastExecute);
        }

        for (const playerIndex of playerIndexes) {
            const player = playerManager.getPlayer(playerIndex);
            if ((player.getAliveState() === PlayersConstants.AliveStateId.Alive)   &&
                (!unitMap.checkHasUnitForPlayer(playerIndex))
            ) {
                player.setAliveState(PlayersConstants.AliveStateId.Dying);
            }
        }
    }

    private async _callActionWithExtraData(warEventActionId: number, isFastExecute: boolean): Promise<void> {
        const action    = this.getWarEventAction(warEventActionId);
        const war       = this._getWar();
        {
            const act = action.getWeaAddUnitOnMapSimple();
            if (act) {
                return WarEventsActionsUtilsAddUnitOnMapSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapExpr();
            if (act) {
                return WarEventsActionsUtilsFillUnitOnMapExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapSimple();
            if (act) {
                return WarEventsActionsUtilsFillUnitOnMapSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedSimple();
            if (act) {
                return WarEventsActionsUtilsFillUnitLoadedSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedExpr();
            if (act) {
                return WarEventsActionsUtilsFillUnitLoadedExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDestroyUnitSimple();
            if (act) {
                return WarEventsActionsUtilsDestroyUnitSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDestroyUnitExpr();
            if (act) {
                return WarEventsActionsUtilsDestroyUnitExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitTypeSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitTypeSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitTypeExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitTypeExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitOwnershipSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitOwnershipExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitPositionSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitPositionSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitPositionExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitPositionExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaAddUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsAddUnitBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaModifyUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsModifyUnitBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDeleteUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsDeleteUnitBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaBigDialogueSimple();
            if (act) {
                return WarEventsActionsUtilsBigDialogueSimple.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointExpr();
            if (act) {
                return WarEventsActionsUtilsSetViewpointExpr.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointSimple();
            if (act) {
                return WarEventsActionsUtilsSetViewpointSimple.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherExpr();
            if (act) {
                return WarEventsActionsUtilsSetWeatherExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetWeatherSimple();
            if (act) {
                return WarEventsActionsUtilsSetWeatherSimple.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSmallDialogueSimple();
            if (act) {
                return WarEventsActionsUtilsSmallDialogueSimple.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlayBgm();
            if (act) {
                return WarEventsActionsUtilsPlayBgm.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlaySfx();
            if (act) {
                return WarEventsActionsUtilsPlaySfx.applyWithExtraData(act, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeExpr();
            if (act) {
                return WarEventsActionsUtilsSetForceFogCodeExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeSimple();
            if (act) {
                return WarEventsActionsUtilsSetForceFogCodeSimple.applyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetCustomCounters();
            if (act) {
                return WarEventsActionsUtilsSetCustomCounters.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaStopPersistentAction();
            if (act) {
                return WarEventsActionsUtilsStopPersistentAction.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetPlayerStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetPlayerStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetPlayerStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTaskObjectiveState();
            if (act) {
                return WarEventsActionsUtilsSetTaskObjectiveState.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitMovePathVisibility();
            if (act) {
                return WarEventsActionsUtilsSetUnitMovePathVisibility.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileTypeExpr();
            if (act) {
                return WarEventsActionsUtilsSetTileTypeExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileTypeSimple();
            if (act) {
                return WarEventsActionsUtilsSetTileTypeSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetTileStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetTileStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomBuildingStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomBuildingStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomCannonStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomCannonStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomCrystalStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomCrystalStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomLaserTurretStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomLaserTurretStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsDeleteTileBuffExpr.applyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsDeleteTileBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaAddTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsAddTileBuffExpr.applyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaAddTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsAddTileBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaModifyTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsModifyTileBuffExpr.applyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaModifyTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsModifyTileBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaPersistentShowText();
            if (act) {
                return WarEventsActionsUtilsPersistentShowText.applyWithExtraData(act, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentPlayBgm();
            if (act) {
                return WarEventsActionsUtilsPersistentPlayBgm.applyWithExtraData(act, isFastExecute, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentModifyPlayerAttribute();
            if (act) {
                return WarEventsActionsUtilsPersistentModifyPlayerAttribute.applyWithExtraData(act, war, warEventActionId);
            }
        }
        {
            const act = action.getWeaPersistentModifyUnitAttribute();
            if (act) {
                return WarEventsActionsUtilsPersistentModifyUnitAttribute.applyWithExtraData(act, war, warEventActionId);
            }
        }

        // todo: add more actions.
        throw HelpersMisc.newError(`Invalid action.`);
    }
    private async _callActionWithoutExtraData(warEventActionId: number, isFastExecute: boolean): Promise<void> {
        const action    = this.getWarEventAction(warEventActionId);
        const war       = this._getWar();
        {
            const act = action.getWeaAddUnitOnMapSimple();
            if (act) {
                return WarEventsActionsUtilsAddUnitOnMapSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapExpr();
            if (act) {
                return WarEventsActionsUtilsFillUnitOnMapExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapSimple();
            if (act) {
                return WarEventsActionsUtilsFillUnitOnMapSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedSimple();
            if (act) {
                return WarEventsActionsUtilsFillUnitLoadedSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedExpr();
            if (act) {
                return WarEventsActionsUtilsFillUnitLoadedExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDestroyUnitSimple();
            if (act) {
                return WarEventsActionsUtilsDestroyUnitSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDestroyUnitExpr();
            if (act) {
                return WarEventsActionsUtilsDestroyUnitExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitTypeSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitTypeSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitTypeExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitTypeExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitOwnershipSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitOwnershipExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitPositionSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitPositionSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitPositionExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitPositionExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetUnitStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetUnitStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaAddUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsAddUnitBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaModifyUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsModifyUnitBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDeleteUnitBuffSimple();
            if (act) {
                return WarEventsActionsUtilsDeleteUnitBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaBigDialogueSimple();
            if (act) {
                return WarEventsActionsUtilsBigDialogueSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointExpr();
            if (act) {
                return WarEventsActionsUtilsSetViewpointExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointSimple();
            if (act) {
                return WarEventsActionsUtilsSetViewpointSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherExpr();
            if (act) {
                return WarEventsActionsUtilsSetWeatherExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherSimple();
            if (act) {
                return WarEventsActionsUtilsSetWeatherSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSmallDialogueSimple();
            if (act) {
                return WarEventsActionsUtilsSmallDialogueSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlayBgm();
            if (act) {
                return WarEventsActionsUtilsPlayBgm.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlaySfx();
            if (act) {
                return WarEventsActionsUtilsPlaySfx.applyWithoutExtraData(act, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeExpr();
            if (act) {
                return WarEventsActionsUtilsSetForceFogCodeExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeSimple();
            if (act) {
                return WarEventsActionsUtilsSetForceFogCodeSimple.applyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetCustomCounters();
            if (act) {
                return WarEventsActionsUtilsSetCustomCounters.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaStopPersistentAction();
            if (act) {
                return WarEventsActionsUtilsStopPersistentAction.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetPlayerStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetPlayerStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTaskObjectiveState();
            if (act) {
                return WarEventsActionsUtilsSetTaskObjectiveState.applyWithoutExtraData(act, war);
            }
        }
        {
            const act = action.getWeaSetUnitMovePathVisibility();
            if (act) {
                return WarEventsActionsUtilsSetUnitMovePathVisibility.applyWithoutExtraData(act, war);
            }
        }
        {
            const act = action.getWeaSetTileTypeExpr();
            if (act) {
                return WarEventsActionsUtilsSetTileTypeExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileTypeSimple();
            if (act) {
                return WarEventsActionsUtilsSetTileTypeSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetTileStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetTileStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomBuildingStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomBuildingStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomCannonStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomCannonStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomCrystalStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomCrystalStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateExpr();
            if (act) {
                return WarEventsActionsUtilsSetCustomLaserTurretStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateSimple();
            if (act) {
                return WarEventsActionsUtilsSetCustomLaserTurretStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsDeleteTileBuffExpr.applyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsDeleteTileBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaAddTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsAddTileBuffExpr.applyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaAddTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsAddTileBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaModifyTileBuffExpr();
            if (act) {
                return WarEventsActionsUtilsModifyTileBuffExpr.applyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaModifyTileBuffSimple();
            if (act) {
                return WarEventsActionsUtilsModifyTileBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPersistentShowText();
            if (act) {
                return WarEventsActionsUtilsPersistentShowText.applyWithoutExtraData(act, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentPlayBgm();
            if (act) {
                return WarEventsActionsUtilsPersistentPlayBgm.applyWithoutExtraData(act, isFastExecute, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentModifyPlayerAttribute();
            if (act) {
                return WarEventsActionsUtilsPersistentModifyPlayerAttribute.applyWithoutExtraData(act, war, warEventActionId);
            }
        }
        {
            const act = action.getWeaPersistentModifyUnitAttribute();
            if (act) {
                return WarEventsActionsUtilsPersistentModifyUnitAttribute.applyWithoutExtraData(act, war, warEventActionId);
            }
        }

        // todo: add more actions.
        throw HelpersMisc.newError(`Invalid action.`);
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
                HelpersMisc.getExisted(rootNodeAndActionsArray[index].getNodeIdAndFlags()),
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
            throw HelpersMisc.newError(`Empty conditionIdArray and subNodeIdArray.`);
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
                    return WarEventsConditionsUtilsEventCalledCount.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecPlayerPresence();
                if (con) {
                    return WarEventsConditionsUtilsPlayerPresence.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecTurnAndPlayer();
                if (con) {
                    return WarEventsConditionsUtilsTurnAndPlayer.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecWeatherAndFog();
                if (con) {
                    return WarEventsConditionsUtilsWeatherAndFog.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecTilePresence();
                if (con) {
                    return WarEventsConditionsUtilsTilePresence.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecUnitPresence();
                if (con) {
                    return WarEventsConditionsUtilsUnitPresence.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecExpression();
                if (con) {
                    return WarEventsConditionsUtilsExpression.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecCustomCounter();
                if (con) {
                    return WarEventsConditionsUtilsCustomCounter.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecOngoingPersistentActionPresence();
                if (con) {
                    return WarEventsConditionsUtilsOngoingPersistentActionPresence.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecManualActionStatistics();
                if (con) {
                    return WarEventsConditionsUtilsManualActionStatistics.checkIsMeet(con, war);
                }
            }

            throw HelpersMisc.newError(`Invalid condition!`);
        })();

        conditionResultDict.set(conditionId, result);
        return isNegated ? (!result) : (!!result);
    }

    public getWarEvent(warEventId: number): ProtoSchemaCommonProtoWarEventWarEvent.WarEvent {                    // DONE
        return HelpersMisc.getExisted(this.getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === warEventId));
    }
    private _getConditionNode(nodeId: number): ProtoSchemaCommonProtoWarEventWarEventConditionNode.WarEventConditionNode {    // DONE
        return HelpersMisc.getExisted(this.getWarEventFullData()?.getConditionNodeArray()?.find(v => v.getNodeId() === nodeId));
    }
    private _getCondition(conditionId: number): ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition {       // DONE
        return HelpersMisc.getExisted(this.getWarEventFullData()?.getConditionArray()?.find(v => v.getWecCommonData()?.getConditionId() === conditionId));
    }
    public getWarEventAction(actionId: number): ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction {          // DONE
        return HelpersMisc.getExisted(this.getWarEventFullData()?.getActionArray()?.find(v => v.getWeaCommonData()?.getActionId() === actionId));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // misc
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getCalledDialogueActionIdArray(): number[] {
        // TODO: 此函数返回结果包含了所有已触发过的事件里的不同条件分支的所有对话，但是一个事件被触发过不代表所有条件分支都被触发过，因此如果某个事件的不同条件分支里包含不同对话，结果会出错
        const actionIdArray: number[] = [];
        for (const calledCountInfo of this._getCalledCountList() ?? []) {
            if ((calledCountInfo.getCalledCountTotal() ?? 0) <= 0) {
                continue;
            }

            for (const rootNodeAndActions of this.getWarEvent(calledCountInfo.getEventId() ?? 0).getRootNodeAndActionsArray()) {
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
