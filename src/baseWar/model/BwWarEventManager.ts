import {
    Players_Constants,
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
    WarEvents_Conditions_Utils_CustomCounter,
    WarEvents_Conditions_Utils_EventCalledCount,
    WarEvents_Conditions_Utils_Expression,
    WarEvents_Actions_Utils_Common,
    CustomCounters_Utils,
    WarEvents_Conditions_Utils_ManualActionStatistics,
    WarEvents_Conditions_Utils_OngoingPersistentActionPresence,
    WarEvents_Conditions_Utils_PlayerPresence,
    WarEvents_Conditions_Utils_TilePresence,
    WarEvents_Conditions_Utils_TurnAndPlayer,
    WarEvents_Conditions_Utils_UnitPresence,
    WarEvents_Conditions_Utils_WeatherAndFog,
    Utils_ClientErrorCode,
    CustomCounters_Constants,
    Helpers_Collection,
    Notifications_Dispatcher,
    Helpers_Misc,
    WarOperations_Executors_Utils_Common,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Interface_IBwWarEventManager,
    type Units_IUnit,
    type AuxiliaryTypes_AuxiliaryTypes,
    type WarEvents_Types,
} from "../../internal.ts";
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

export class BwWarEventManager implements BaseWar_Interface_IBwWarEventManager.IBwWarEventManager {
    private _war?                           : BaseWar_Interface_IBwWar.IBwWar;
    private _calledCountList?               : DataForWarEventCalledCount[] | null;
    private _customCounterArray?            : CustomCounter[] | null;
    private _opaIdArray?                    : number[];

    public init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWarEventManager>, warEventFullData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WarEventFullData>): void {
        if (!data) {
            this._setCalledCountList(null);
            this._setCustomCounterArray(null);
            this._setOpaIdArray([]);
        } else {
            // TODO: validate the data.
            const customCounterArray = data.getCustomCounterArray();
            if ((customCounterArray) && (!CustomCounters_Utils.checkIsValidCustomCounterArray(customCounterArray))) {
                throw Helpers_Misc.newError(`BwWarEventManager.init() invalid customCounterArray.`, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_Init_00);
            }

            const opaIdArray = data.getOngoingPersistentActionIdArray();
            if (opaIdArray.length !== new Set(opaIdArray).size) {
                throw Helpers_Misc.newError(`BwWarEventManager.init() invalid ongoingPersistentActionIdArray.`, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_Init_01);
            }
            for (const actionId of opaIdArray) {
                const action = warEventFullData?.getActionArray()?.find(v => v.getWeaCommonData()?.getActionId() === actionId);
                if ((action == null) || (!WarEvents_Actions_Utils_Common.checkIsPersistentAction(action))) {
                    throw Helpers_Misc.newError(`BwWarEventManager.init() invalid ongoingPersistentActionIdArray.`, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_Init_02);
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
            calledCountList                : this._getCalledCountList()?.map(v => v.toJson()) ?? [],
            customCounterArray             : this._getCustomCounterArray()?.map(v => v.toJson()) ?? [],
            ongoingPersistentActionIdArray : [...this.getOpaIdArray()],
        });
    }
    public serializeForCreateSfw(): SerialWarEventManager {
        return SerialWarEventManager.fromJson({
            calledCountList                : this._getCalledCountList()?.map(v => v.clone().toJson()) ?? [],
            customCounterArray             : this._getCustomCounterArray()?.map(v => v.clone().toJson()) ?? [],
            ongoingPersistentActionIdArray : [...this.getOpaIdArray()],
        });
    }
    public serializeForCreateMfr(): SerialWarEventManager {
        return this.serializeForCreateSfw();
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._setWar(war);
    }

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    private _getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
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
        return Helpers_Misc.getDefined(this._calledCountList, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_GetCalledCountList_00);
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
        Notifications_Dispatcher.dispatch("BwCustomCountersChanged");
    }
    private _getCustomCounterArray(): CustomCounter[] | null {
        return Helpers_Misc.getDefined(this._customCounterArray, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_GetCustomCounterArray_00);
    }

    public setCustomCounter(counterId: number, counterValue: number): void {
        if (!CustomCounters_Utils.checkIsValidId(counterId)) {
            throw Helpers_Misc.newError(`BwWarEventManager._setCustomCounter() invalid counterId: ${counterId}`, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_SetCustomCounter_00);
        }

        if (!CustomCounters_Utils.checkIsValidValue(counterValue)) {
            throw Helpers_Misc.newError(`BwWarEventManager._setCustomCounter() invalid counterValue: ${counterValue}`, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_SetCustomCounter_01);
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
            Notifications_Dispatcher.dispatch("BwCustomCountersChanged");
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
            for (let counterId = CustomCounters_Constants.Constants.MinId; counterId <= CustomCounters_Constants.Constants.MaxId; ++counterId) {
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
        return Helpers_Misc.getExisted(this._opaIdArray, Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_GetOngoingPersistentActionIdSet_00);
    }
    public getAllPersistentActionIdArray(): number[] {
        const idArray: number[] = [];
        for (const action of this.getWarEventFullData()?.getActionArray() ?? []) {
            if (WarEvents_Actions_Utils_Common.checkIsPersistentAction(action)) {
                idArray.push(action.getWeaCommonData()?.getActionId() ?? 0);
            }
        }
        idArray.sort((v1, v2) => v1 - v2);

        return idArray;
    }
    public updateOpaIdArrayOnExecuteAction(actionId: number): void {
        const opaIdArray = this.getOpaIdArray();
        Helpers_Collection.deleteElementFromList(opaIdArray, actionId);
        opaIdArray.push(actionId);
    }
    public updateOpaIdArrayOnDeleteAction(actionIdArray: number[]): void {
        const opaIdArray = this.getOpaIdArray();
        for (const actionId of actionIdArray) {
            Helpers_Collection.deleteElementFromList(opaIdArray, actionId);
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
                    const canActivate = WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.checkCanActivateCoSkillForPlayer(actionData, playerIndex, war);
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
                    const canProduceUnit = WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.checkCanProduceUnitForPlayer(actionData, playerIndex, unitType, war);
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
                    modifier += WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.getActEnergyGrowthMultiplierModifierForPlayer(actionData, playerIndex, war);
                }
            }
        }

        return modifier;
    }
    public getOpaAiUnitProductionBonusScore(playerIndex: number, unitTypeId: number, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
        const war       = this._getWar();
        let bonusScore  = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyPlayerAttribute();
                if (actionData) {
                    bonusScore += WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.getActAiUnitProductionBonusScore({
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
                    modifier += WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.getActCoZoneRadiusModifierForPlayer(actionData, playerIndex, war);
                }
            }
        }

        return modifier;
    }
    public getOpaAttackPowerModifier(unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getAttackPowerModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaDefenseModifier(unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getDefenseModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaMoveRangeModifier(unit: Units_IUnit.IUnit): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getMoveRangeModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaMaxAttackRangeModifier(unit: Units_IUnit.IUnit): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getMaxAttackRangeModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaCanAttackAfterMoving(unit: Units_IUnit.IUnit): boolean | null {
        for (const opaId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(opaId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    const canAttack = WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getCanAttackAfterMovingForUnit(actionData, unit);
                    if (canAttack != null) {
                        return canAttack;
                    }
                }
            }
        }

        return null;
    }
    public getOpaUnitVisionRangeModifier(unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getVisionRangeModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaIsPenetratingVision(unit: Units_IUnit.IUnit): boolean | null {
        for (const opaId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(opaId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    const isPenetrating = WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getIsPenetratingVisionForUnit(actionData, unit);
                    if (isPenetrating != null) {
                        return isPenetrating;
                    }
                }
            }
        }

        return null;
    }
    public getOpaLuckLowerLimitModifier(unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getLuckLowerLimitModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaLuckUpperLimitModifier(unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getLuckUpperLimitModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaFlareRadiusModifier(unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getFlareRadiusModifierForUnit(actionData, unit);
                }
            }
        }

        return modifier;
    }
    public getOpaFlareRangeModifier(unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
        let modifier = 0;
        for (const actionId of this.getOpaIdArray()) {
            const action = this.getWarEventAction(actionId);
            {
                const actionData = action.getWeaPersistentModifyUnitAttribute();
                if (actionData) {
                    modifier += WarEvents_Actions_Utils_PersistentModifyUnitAttribute.getFlareRangeModifierForUnit(actionData, unit);
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
                return Helpers_Misc.getExisted(action.getBgmCode());
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
                isFastExecute,
            );
    }
    private async _callWarEventWithExtraData(action: WoSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
        for (const actionId of this.getWarEvent(action.getWarEventId()).getRootNodeAndActionsArray()[action.getNodeAndActionsIndex()].getActionIdArray()) {
            await this._callActionWithExtraData(actionId, isFastExecute);
        }

        const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_01);
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : this._getWar(),
            commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_02),
            isFastExecute   : isFastExecute,
        });
    }
    private async _callWarEventWithoutExtraData(warEventId: number, dataIndex: number, isFastExecute: boolean): Promise<void> { // DONE
        const war           = this._getWar();
        const unitMap       = war.getUnitMap();
        const playerManager = war.getPlayerManager();
        const playerIndexes = playerManager.getPlayerIndexArray(Players_Constants.PlayerIndex.First, false)
            .filter(v => (playerManager.getPlayer(v).getAliveState() === Players_Constants.AliveStateId.Alive) && (unitMap.checkHasUnitForPlayer(v)));

        for (const actionId of this.getWarEvent(warEventId).getRootNodeAndActionsArray()[dataIndex].getActionIdArray()) {
            await this._callActionWithoutExtraData(actionId, isFastExecute);
        }

        for (const playerIndex of playerIndexes) {
            const player = playerManager.getPlayer(playerIndex);
            if ((player.getAliveState() === Players_Constants.AliveStateId.Alive)   &&
                (!unitMap.checkHasUnitForPlayer(playerIndex))
            ) {
                player.setAliveState(Players_Constants.AliveStateId.Dying);
            }
        }
    }

    private async _callActionWithExtraData(warEventActionId: number, isFastExecute: boolean): Promise<void> {
        const action    = this.getWarEventAction(warEventActionId);
        const war       = this._getWar();
        {
            const act = action.getWeaAddUnitOnMapSimple();
            if (act) {
                return WarEvents_Actions_Utils_AddUnitOnMapSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapExpr();
            if (act) {
                return WarEvents_Actions_Utils_FillUnitOnMapExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapSimple();
            if (act) {
                return WarEvents_Actions_Utils_FillUnitOnMapSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedSimple();
            if (act) {
                return WarEvents_Actions_Utils_FillUnitLoadedSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedExpr();
            if (act) {
                return WarEvents_Actions_Utils_FillUnitLoadedExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDestroyUnitSimple();
            if (act) {
                return WarEvents_Actions_Utils_DestroyUnitSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDestroyUnitExpr();
            if (act) {
                return WarEvents_Actions_Utils_DestroyUnitExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitTypeSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitTypeSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitTypeExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitTypeExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitOwnershipSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitOwnershipExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitPositionSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitPositionSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitPositionExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitPositionExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaAddUnitBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_AddUnitBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaModifyUnitBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_ModifyUnitBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDeleteUnitBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_DeleteUnitBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaBigDialogueSimple();
            if (act) {
                return WarEvents_Actions_Utils_BigDialogueSimple.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetViewpointExpr.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetViewpointSimple.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetWeatherExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetWeatherSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetWeatherSimple.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSmallDialogueSimple();
            if (act) {
                return WarEvents_Actions_Utils_SmallDialogueSimple.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlayBgm();
            if (act) {
                return WarEvents_Actions_Utils_PlayBgm.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlaySfx();
            if (act) {
                return WarEvents_Actions_Utils_PlaySfx.applyWithExtraData(act, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetForceFogCodeExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetForceFogCodeSimple.applyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetCustomCounters();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCounters.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaStopPersistentAction();
            if (act) {
                return WarEvents_Actions_Utils_StopPersistentAction.applyWithExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetPlayerStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetPlayerStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetPlayerStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTaskObjectiveState();
            if (act) {
                return WarEvents_Actions_Utils_SetTaskObjectiveState.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetUnitMovePathVisibility();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitMovePathVisibility.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileTypeExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetTileTypeExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileTypeSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetTileTypeSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetTileStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetTileStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetTileStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomBuildingStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomBuildingStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCannonStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCannonStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCrystalStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCrystalStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomLaserTurretStateExpr.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomLaserTurretStateSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffExpr();
            if (act) {
                return WarEvents_Actions_Utils_DeleteTileBuffExpr.applyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_DeleteTileBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaAddTileBuffExpr();
            if (act) {
                return WarEvents_Actions_Utils_AddTileBuffExpr.applyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaAddTileBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_AddTileBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaModifyTileBuffExpr();
            if (act) {
                return WarEvents_Actions_Utils_ModifyTileBuffExpr.applyWithExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaModifyTileBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_ModifyTileBuffSimple.applyWithExtraData(act);
            }
        }
        {
            const act = action.getWeaPersistentShowText();
            if (act) {
                return WarEvents_Actions_Utils_PersistentShowText.applyWithExtraData(act, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentPlayBgm();
            if (act) {
                return WarEvents_Actions_Utils_PersistentPlayBgm.applyWithExtraData(act, isFastExecute, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentModifyPlayerAttribute();
            if (act) {
                return WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.applyWithExtraData(act, war, warEventActionId);
            }
        }
        {
            const act = action.getWeaPersistentModifyUnitAttribute();
            if (act) {
                return WarEvents_Actions_Utils_PersistentModifyUnitAttribute.applyWithExtraData(act, war, warEventActionId);
            }
        }

        // todo: add more actions.
        throw Helpers_Misc.newError(`Invalid action.`);
    }
    private async _callActionWithoutExtraData(warEventActionId: number, isFastExecute: boolean): Promise<void> {
        const action    = this.getWarEventAction(warEventActionId);
        const war       = this._getWar();
        {
            const act = action.getWeaAddUnitOnMapSimple();
            if (act) {
                return WarEvents_Actions_Utils_AddUnitOnMapSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapExpr();
            if (act) {
                return WarEvents_Actions_Utils_FillUnitOnMapExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitOnMapSimple();
            if (act) {
                return WarEvents_Actions_Utils_FillUnitOnMapSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedSimple();
            if (act) {
                return WarEvents_Actions_Utils_FillUnitLoadedSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaFillUnitLoadedExpr();
            if (act) {
                return WarEvents_Actions_Utils_FillUnitLoadedExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDestroyUnitSimple();
            if (act) {
                return WarEvents_Actions_Utils_DestroyUnitSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDestroyUnitExpr();
            if (act) {
                return WarEvents_Actions_Utils_DestroyUnitExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitTypeSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitTypeSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitTypeExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitTypeExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitOwnershipSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitOwnershipExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitOwnershipExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitPositionSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitPositionSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitPositionExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitPositionExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetUnitStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaAddUnitBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_AddUnitBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaModifyUnitBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_ModifyUnitBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDeleteUnitBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_DeleteUnitBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaBigDialogueSimple();
            if (act) {
                return WarEvents_Actions_Utils_BigDialogueSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetViewpointExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetViewpointSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetViewpointSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetWeatherExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetWeatherSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetWeatherSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSmallDialogueSimple();
            if (act) {
                return WarEvents_Actions_Utils_SmallDialogueSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlayBgm();
            if (act) {
                return WarEvents_Actions_Utils_PlayBgm.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPlaySfx();
            if (act) {
                return WarEvents_Actions_Utils_PlaySfx.applyWithoutExtraData(act, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetForceFogCodeExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetForceFogCodeSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetForceFogCodeSimple.applyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaSetCustomCounters();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCounters.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaStopPersistentAction();
            if (act) {
                return WarEvents_Actions_Utils_StopPersistentAction.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetPlayerStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetPlayerStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetPlayerStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTaskObjectiveState();
            if (act) {
                return WarEvents_Actions_Utils_SetTaskObjectiveState.applyWithoutExtraData(act, war);
            }
        }
        {
            const act = action.getWeaSetUnitMovePathVisibility();
            if (act) {
                return WarEvents_Actions_Utils_SetUnitMovePathVisibility.applyWithoutExtraData(act, war);
            }
        }
        {
            const act = action.getWeaSetTileTypeExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetTileTypeExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileTypeSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetTileTypeSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetTileStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetTileStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetTileStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomBuildingStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomBuildingStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomBuildingStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCannonStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCannonStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCannonStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCrystalStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomCrystalStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomCrystalStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateExpr();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomLaserTurretStateExpr.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaSetCustomLaserTurretStateSimple();
            if (act) {
                return WarEvents_Actions_Utils_SetCustomLaserTurretStateSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffExpr();
            if (act) {
                return WarEvents_Actions_Utils_DeleteTileBuffExpr.applyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaDeleteTileBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_DeleteTileBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaAddTileBuffExpr();
            if (act) {
                return WarEvents_Actions_Utils_AddTileBuffExpr.applyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaAddTileBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_AddTileBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaModifyTileBuffExpr();
            if (act) {
                return WarEvents_Actions_Utils_ModifyTileBuffExpr.applyWithoutExtraData(act, war, isFastExecute);
            }
        }
        {
            const act = action.getWeaModifyTileBuffSimple();
            if (act) {
                return WarEvents_Actions_Utils_ModifyTileBuffSimple.applyWithoutExtraData(act, isFastExecute, war);
            }
        }
        {
            const act = action.getWeaPersistentShowText();
            if (act) {
                return WarEvents_Actions_Utils_PersistentShowText.applyWithoutExtraData(act, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentPlayBgm();
            if (act) {
                return WarEvents_Actions_Utils_PersistentPlayBgm.applyWithoutExtraData(act, isFastExecute, warEventActionId, war);
            }
        }
        {
            const act = action.getWeaPersistentModifyPlayerAttribute();
            if (act) {
                return WarEvents_Actions_Utils_PersistentModifyPlayerAttribute.applyWithoutExtraData(act, war, warEventActionId);
            }
        }
        {
            const act = action.getWeaPersistentModifyUnitAttribute();
            if (act) {
                return WarEvents_Actions_Utils_PersistentModifyUnitAttribute.applyWithoutExtraData(act, war, warEventActionId);
            }
        }

        // todo: add more actions.
        throw Helpers_Misc.newError(`Invalid action.`);
    }

    public getCallableWarEventIdAndDataIndex(): WarEvents_Types.WarEventIdAndDataIndex | null {                                // DONE
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
        let result                  : WarEvents_Types.WarEventIdAndDataIndex | null = null;

        for (const warEvent of warEventArray) {
            const warEventId    = warEvent.getEventId();
            const dataIndex     = this._getCallableNodeAndActionsIndex(warEventId, nodeResultDict, conditionResultDict);
            if (dataIndex != null) {
                result = { warEventId : warEventId, dataIndex : dataIndex };
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
                Helpers_Misc.getExisted(rootNodeAndActionsArray[index].getNodeIdAndFlags()),
                nodeResultDict,
                conditionResultDict,
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
            throw Helpers_Misc.newError(`Empty conditionIdArray and subNodeIdArray.`);
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
                    return WarEvents_Conditions_Utils_EventCalledCount.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecPlayerPresence();
                if (con) {
                    return WarEvents_Conditions_Utils_PlayerPresence.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecTurnAndPlayer();
                if (con) {
                    return WarEvents_Conditions_Utils_TurnAndPlayer.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecWeatherAndFog();
                if (con) {
                    return WarEvents_Conditions_Utils_WeatherAndFog.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecTilePresence();
                if (con) {
                    return WarEvents_Conditions_Utils_TilePresence.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecUnitPresence();
                if (con) {
                    return WarEvents_Conditions_Utils_UnitPresence.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecExpression();
                if (con) {
                    return WarEvents_Conditions_Utils_Expression.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecCustomCounter();
                if (con) {
                    return WarEvents_Conditions_Utils_CustomCounter.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecOngoingPersistentActionPresence();
                if (con) {
                    return WarEvents_Conditions_Utils_OngoingPersistentActionPresence.checkIsMeet(con, war);
                }
            }
            {
                const con = condition.getWecManualActionStatistics();
                if (con) {
                    return WarEvents_Conditions_Utils_ManualActionStatistics.checkIsMeet(con, war);
                }
            }

            throw Helpers_Misc.newError(`Invalid condition!`);
        })();

        conditionResultDict.set(conditionId, result);
        return isNegated ? (!result) : (!!result);
    }

    public getWarEvent(warEventId: number): WarEvent {                    // DONE
        return Helpers_Misc.getExisted(this.getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === warEventId));
    }
    private _getConditionNode(nodeId: number): WarEventConditionNode {    // DONE
        return Helpers_Misc.getExisted(this.getWarEventFullData()?.getConditionNodeArray()?.find(v => v.getNodeId() === nodeId));
    }
    private _getCondition(conditionId: number): WarEventCondition {       // DONE
        return Helpers_Misc.getExisted(this.getWarEventFullData()?.getConditionArray()?.find(v => v.getWecCommonData()?.getConditionId() === conditionId));
    }
    public getWarEventAction(actionId: number): WarEventAction {          // DONE
        return Helpers_Misc.getExisted(this.getWarEventFullData()?.getActionArray()?.find(v => v.getWeaCommonData()?.getActionId() === actionId));
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
