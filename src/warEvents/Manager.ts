import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    CustomCounters_Constants,
    CustomCounters_Utils,
    Helpers_Collection,
    Helpers_Misc,
    Notifications_Dispatcher,
    Players_Constants,
    Utils_ClientErrorCode,
    WarEvents_Actions_Executor,
    WarEvents_Actions_Utils_Common,
    WarEvents_Actions_Utils_PersistentModifyPlayerAttribute,
    WarEvents_Actions_Utils_PersistentModifyUnitAttribute,
    WarEvents_Conditions_Utils_CustomCounter,
    WarEvents_Conditions_Utils_EventCalledCount,
    WarEvents_Conditions_Utils_Expression,
    WarEvents_Conditions_Utils_ManualActionStatistics,
    WarEvents_Conditions_Utils_OngoingPersistentActionPresence,
    WarEvents_Conditions_Utils_PlayerPresence,
    WarEvents_Conditions_Utils_TilePresence,
    WarEvents_Conditions_Utils_TurnAndPlayer,
    WarEvents_Conditions_Utils_UnitPresence,
    WarEvents_Conditions_Utils_WeatherAndFog,
    WarOperations_Executors_Utils_Common,
    type AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Model_War,
    type Units_Unit,
    type WarEvents_Types,
} from "../internal.ts";
import type { ConditionIdAndFlags } from "../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import type { NodeIdAndFlags } from "../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type { WarEvent } from "../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type { WarEventAction } from "../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventCondition } from "../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventConditionNode } from "../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type { WarEventFullData } from "../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WoSystemCallWarEvent } from "../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import { CustomCounter } from "../proto/schema/CommonProto/WarSerialization/CustomCounter.ts";
import { DataForWarEventCalledCount } from "../proto/schema/CommonProto/WarSerialization/DataForWarEventCalledCount.ts";
import { SerialWarEventManager } from "../proto/schema/CommonProto/WarSerialization/SerialWarEventManager.ts";

export class Manager {
    private _war?                           : BaseWar_Model_War.War;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public serializeForTeamIndexes(teamIndexes: Set<number>): SerialWarEventManager {
        return this.serialize();
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

    public startRunning(war: BaseWar_Model_War.War): void {
        this._setWar(war);
    }

    public getWar(): BaseWar_Model_War.War {
        return Helpers_Misc.getExisted(this._war);
    }
    private _setWar(war: BaseWar_Model_War.War): void {
        this._war = war;
    }

    public getWarEventFullData(): WarEventFullData | null {
        return this.getWar().getCommonSettingManager().getInstanceWarRule().getWarEventFullData() ?? null;
    }
    public setWarEventFullData(data: WarEventFullData | null): void {
        this.getWar().getCommonSettingManager().getInstanceWarRule().setWarEventFullData(data);
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
        const war           = this.getWar();
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
        const war           = this.getWar();
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
        const war       = this.getWar();
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
        const war       = this.getWar();
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
        const war       = this.getWar();
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getOpaAttackPowerModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getOpaDefenseModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
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
    public getOpaMoveRangeModifier(unit: Units_Unit.Unit): number {
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
    public getOpaMaxAttackRangeModifier(unit: Units_Unit.Unit): number {
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
    public getOpaCanAttackAfterMoving(unit: Units_Unit.Unit): boolean | null {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getOpaUnitVisionRangeModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
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
    public getOpaIsPenetratingVision(unit: Units_Unit.Unit): boolean | null {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getOpaLuckLowerLimitModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getOpaLuckUpperLimitModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getOpaFlareRadiusModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getOpaFlareRangeModifier(unit: Units_Unit.Unit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
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
    public async callWarEventAsOuterWar(action: WoSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
        for (const actionId of this.getWarEvent(action.getWarEventId()).getRootNodeAndActionsArray()[action.getNodeAndActionsIndex()].getActionIdArray()) {
            await WarEvents_Actions_Executor.executeAsOuterWar(this, actionId, isFastExecute);
        }

        const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_01);
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : this.getWar(),
            commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_02),
            isFastExecute   : isFastExecute,
        });
    }
    public async callWarEventAsInnerWar(warEventId: number, dataIndex: number): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> { // DONE
        return this._callWarEventAsLocalWar(warEventId, dataIndex, true);
    }
    public async callWarEventAsUnifiedWar(warEventId: number, dataIndex: number, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> { // DONE
        return this._callWarEventAsLocalWar(warEventId, dataIndex, isFastExecute);
    }
    private async _callWarEventAsLocalWar(warEventId: number, dataIndex: number, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> { // DONE
        const war           = this.getWar();
        const unitMap       = war.getUnitMap();
        const playerManager = war.getPlayerManager();
        const playerIndexes = playerManager.getPlayerIndexArray(Players_Constants.PlayerIndex.First, false)
            .filter(v => (playerManager.getPlayer(v).getAliveState() === Players_Constants.AliveStateId.Alive) && (unitMap.checkHasUnitForPlayer(v)));

        const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
        for (const actionId of this.getWarEvent(warEventId).getRootNodeAndActionsArray()[dataIndex].getActionIdArray()) {
            changedThings.mergeFrom(await WarEvents_Actions_Executor.executeAsLocalWar(this, actionId, isFastExecute));
        }

        for (const playerIndex of playerIndexes) {
            const player = playerManager.getPlayer(playerIndex);
            if ((player.getAliveState() === Players_Constants.AliveStateId.Alive)   &&
                (!unitMap.checkHasUnitForPlayer(playerIndex))
            ) {
                player.setAliveState(Players_Constants.AliveStateId.Dying);
                changedThings.addPlayer(player);
            }
        }

        return changedThings;
    }

    public getCallableWarEventIdAndDataIndex(): WarEvents_Types.WarEventIdAndDataIndex | null {                                // DONE
        const war = this.getWar();
        if (war.checkIsExceedTurnsOrWarOperationsLimit()) {
            return null;
        }

        const warEventArray = war.getCommonSettingManager().getInstanceWarRule().getWarEventFullData()?.getEventArray();
        if (!warEventArray?.length) {
            return null;
        }

        const randomNumberManager   = war.getRandomNumberManager();
        const randomState           = randomNumberManager.getSeedRandomCurrentStateJson();
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

        randomNumberManager.setSeedRandomCurrentStateJson(randomState);
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
            (this.getWar().getExecutedOperationManager().getLastExecutedOperation()?.getWoSystemCallWarEvent() != null)
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

        const war       = this.getWar();
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
