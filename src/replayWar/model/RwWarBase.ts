import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "../../baseWar/interface/IBwWarEventManager.ts";
import * as BaseWarModelBwWar from "../../baseWar/model/BwWar.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage from "../../localData/Storage.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureGridMarkData from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager from "../../proto/schema/CommonProto/WarSerialization/SerialExecutedOperationManager.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForAtw from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForCcw from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMcw from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMfw from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMmw from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMrw from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForScw from "../../proto/schema/CommonProto/WarSettings/SettingsForScw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForSfw from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForSrw from "../../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../interface/IRwWarBase.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarOperationsExecutorsExecutor from "../../warOperations/executors/Executor.ts";

type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

type TurnIndexAndPlayerIndex = {
    turnIndex   : number;
    playerIndex : number;
};

export abstract class RwWarBase extends BaseWarModelBwWar.BwWar implements ReplayWarInterfaceIRwWarBase.IRwWarBase {
    private readonly _warEventManager               = new (GameHelpersGhFactory.getBwWarEventManagerClass())();
    private _srcExecutedOperationArray              : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer[] | null = null;

    private _settingsForMcw                         : Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMcw.SettingsForMcw>;
    private _settingsForMfw                         : Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw>;
    private _settingsForMrw                         : Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMrw.SettingsForMrw>;
    private _settingsForMmw                         : Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMmw.SettingsForMmw>;
    private _settingsForCcw                         : Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForCcw.SettingsForCcw>;
    private _settingsForAtw                         : Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForAtw.SettingsForAtw>;
    private _settingsForScw                         : Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForScw.SettingsForScw>;
    private _settingsForSfw                         : Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForSfw.SettingsForSfw>;
    private _settingsForSrw                         : Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForSrw.SettingsForSrw>;

    private _visionTeamIndex                        : number | null = null;
    private _isTickingReplay                        = false;
    private _isBatchExecuteAction                   = false;    // 用于在批量运行战局操作（比如切换到下一回合或战局终止状态）时，省略不必要的计算
    private _isShowTurnStartPopUp                   = true;
    private _isAutoReplay                           = false;
    private _firstOperationId                       = 0;
    private _nextOperationId                        = 0;
    private _checkpointIdsForNextOperationId        = new Map<number, number>();
    private _checkpointDataListForCheckpointId      = new Map<number, AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointData>();
    private _turnAndPlayerIndexesForCheckpointId    = new Map<number, TurnIndexAndPlayerIndex>();
    private readonly _gridMarkData                  = new ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData();

    public abstract serializeForCheckpoint(): AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointData;
    public abstract tickVisionTeamIndex(): number | null;

    public init(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GameConfigGcData.GcData): void {
        warData                             = warData.clone();
        const srcExecutedOperationArray     = warData.getExecutedOperationManager()?.getExecutedOperationArray() ?? [];
        this._srcExecutedOperationArray     = srcExecutedOperationArray;
        warData.setExecutedOperationManager(new ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager());
        this._baseInit(warData, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(warData));

        this._setSettingsForMcw(warData.getSettingsForMcw());
        this._setSettingsForScw(warData.getSettingsForScw());
        this._setSettingsForSfw(warData.getSettingsForSfw());
        this._setSettingsForSrw(warData.getSettingsForSrw());
        this._setSettingsForMrw(warData.getSettingsForMrw());
        this._setSettingsForMmw(warData.getSettingsForMmw());
        this._setSettingsForAtw(warData.getSettingsForAtw());
        this._setSettingsForCcw(warData.getSettingsForCcw());
        this._setSettingsForMfw(warData.getSettingsForMfw());

        const firstOperationId = srcExecutedOperationArray[0]?.getOperationId() ?? 0;
        this._setFirstOperationId(firstOperationId);
        this.setNextOperationId(firstOperationId);

        this._setCheckpointId(firstOperationId, 0);
        this._setCheckpointData(0, {
            nextOperationId : firstOperationId,
            warData         : warData.encode(),
        });
    }

    public getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager {
        return this._warEventManager;
    }

    public getCanCheat(): boolean {
        return false;
    }
    public getIsNeedExecutedOperations(): boolean {
        return true;
    }
    public getBootRestTime(): number | null {
        return null;
    }
    public getSettingsBootTimerParams(): number[] {
        return [BootTimersConstants.TimerTypeId.NoBoot];
    }
    public getNormalMapId(): number | null {
        const settingsForMcw = this.getSettingsForMcw();
        if (settingsForMcw) {
            return settingsForMcw.getNormalMapId() ?? 0;
        }

        const settingsForMrw = this.getSettingsForMrw();
        if (settingsForMrw) {
            return settingsForMrw.getNormalMapId() ?? 0;
        }

        const settingsForMmw = this.getSettingsForMmw();
        if (settingsForMmw) {
            return settingsForMmw.getNormalMapId() ?? 0;
        }

        const settingsForAtw = this.getSettingsForAtw();
        if (settingsForAtw) {
            return settingsForAtw.getNormalMapId() ?? 0;
        }

        const settingsForScw = this.getSettingsForScw();
        if (settingsForScw) {
            return settingsForScw.getNormalMapId() ?? 0;
        }

        const settingsForSrw = this.getSettingsForSrw();
        if (settingsForSrw) {
            return settingsForSrw.getNormalMapId() ?? 0;
        }

        const settingsForCcw = this.getSettingsForCcw();
        if (settingsForCcw) {
            return settingsForCcw.getNormalMapId() ?? 0;
        }

        return null;
    }

    public getWarOperationDescSuffix(): string {
        const lastOperationId = this._getLastOperationId();
        return `(${this.getNextOperationId()} / ${lastOperationId == null ? `??` : lastOperationId + 1} ${LangUtils.getText(LangConstants.TextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`;
    }

    public getSettingsForMcw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMcw.SettingsForMcw> {
        return this._settingsForMcw;
    }
    protected _setSettingsForMcw(value: Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMcw.SettingsForMcw>): void {
        this._settingsForMcw = value;
    }
    public getSettingsForScw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForScw.SettingsForScw> {
        return this._settingsForScw;
    }
    protected _setSettingsForScw(value: Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForScw.SettingsForScw>): void {
        this._settingsForScw = value;
    }
    public getSettingsForSfw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForSfw.SettingsForSfw> {
        return this._settingsForSfw;
    }
    protected _setSettingsForSfw(value: Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForSfw.SettingsForSfw>): void {
        this._settingsForSfw = value;
    }
    public getSettingsForSrw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForSrw.SettingsForSrw> {
        return this._settingsForSrw;
    }
    protected _setSettingsForSrw(value: Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForSrw.SettingsForSrw>): void {
        this._settingsForSrw = value;
    }
    public getSettingsForMrw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMrw.SettingsForMrw> {
        return this._settingsForMrw;
    }
    protected _setSettingsForMrw(value: Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMrw.SettingsForMrw>): void {
        this._settingsForMrw = value;
    }
    public getSettingsForMmw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMmw.SettingsForMmw> {
        return this._settingsForMmw;
    }
    protected _setSettingsForMmw(value: Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMmw.SettingsForMmw>): void {
        this._settingsForMmw = value;
    }
    public getSettingsForAtw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForAtw.SettingsForAtw> {
        return this._settingsForAtw;
    }
    protected _setSettingsForAtw(value: Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForAtw.SettingsForAtw>): void {
        this._settingsForAtw = value;
    }
    public getSettingsForCcw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForCcw.SettingsForCcw> {
        return this._settingsForCcw;
    }
    protected _setSettingsForCcw(value: Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForCcw.SettingsForCcw>): void {
        this._settingsForCcw = value;
    }
    public getSettingsForMfw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw> {
        return this._settingsForMfw;
    }
    protected _setSettingsForMfw(value: Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw>): void {
        this._settingsForMfw = value;
    }

    public getGridMarkData(): ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData {
        return this._gridMarkData;
    }

    public checkIsInBeginning(): boolean {
        return this.getNextOperationId() <= this._getFirstOperationId();
    }
    public checkIsInEnd(): boolean {
        const lastOperationId = this._getLastOperationId();
        return lastOperationId == null ? true : this.getNextOperationId() > lastOperationId;
    }

    public getIsTickingReplay(): boolean {
        return this._isTickingReplay;
    }
    private _setIsTickingReplay(isTicking: boolean): void {
        this._isTickingReplay = isTicking;
    }

    public getIsBatchExecuteAction(): boolean {
        return this._isBatchExecuteAction;
    }
    public setIsBatchExecuteAction(isFast: boolean): void {
        this._isBatchExecuteAction = isFast;
    }

    public getVisionTeamIndex(): number | null {
        return this._visionTeamIndex;
    }
    protected _setVisionTeamIndex(index: number | null): void {
        this._visionTeamIndex = index;
    }

    public getIsShowTurnStartPopUp(): boolean {
        return this._isShowTurnStartPopUp;
    }
    public setIsShowTurnStartPopUp(isShow: boolean): void {
        this._isShowTurnStartPopUp = isShow;
    }

    public getIsAutoReplay(): boolean {
        return this._isAutoReplay;
    }
    public setIsAutoReplay(isAuto: boolean): void {
        if (this.getIsAutoReplay() !== isAuto) {
            this._isAutoReplay = isAuto;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ReplayAutoReplayChanged);

            if ((isAuto) && (!this.getIsExecutingAction()) && (!this.checkIsInEnd())) {
                this._executeNextAction(false);
            }
        }
    }

    private _getFirstOperationId(): number {
        return this._firstOperationId;
    }
    private _setFirstOperationId(operationId: number): void {
        this._firstOperationId = operationId;
    }
    protected _getLastOperationId(): number | null {
        const array = this._srcExecutedOperationArray;
        if (array == null) {
            return null;
        }

        const length = array.length;
        return length
            ? (array[length - 1].getOperationId() ?? 0)
            : null;
    }

    public getNextOperationId(): number {
        return this._nextOperationId;
    }
    public setNextOperationId(nextOperationId: number): void {
        this._nextOperationId = nextOperationId;
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.RwNextOperationIdChanged);
    }
    public getNextAction(): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer | null {
        const array = this._srcExecutedOperationArray;
        if (!array?.length) {
            return null;
        }

        return array[this.getNextOperationId() - (array[0].getOperationId() ?? 0)];
    }

    private _getCheckpointId(nextOperationId: number): number | null {
        return this._checkpointIdsForNextOperationId.get(nextOperationId) ?? null;
    }
    protected _setCheckpointId(nextOperationId: number, checkpointId: number): void {
        this._checkpointIdsForNextOperationId.set(nextOperationId, checkpointId);
    }

    private _getCheckpointData(checkpointId: number): AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointData | null {
        return this._checkpointDataListForCheckpointId.get(checkpointId) ?? null;
    }
    private _setCheckpointData(checkpointId: number, data: AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointData): void {
        this._checkpointDataListForCheckpointId.set(checkpointId, data);
    }

    public getAllCheckpointInfoArray(): AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointInfo[] {
        const turnManager   = HelpersMisc.getExisted(ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersMisc.getExisted(this._getCheckpointData(0)?.warData)).getTurnManager(), UtilsClientErrorCode.ClientErrorCode.HrwWar_GetAllCheckpointInfoArray_00);
        let checkpointId    = 0;
        let turnIndex       = turnManager.getTurnIndex() ?? 0;
        let playerIndex     = turnManager.getPlayerIndex() ?? 0;
        const infoArray     : AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointInfo[] = [{
            checkpointId        : checkpointId,
            nextOperationId     : this._getFirstOperationId(),
            turnIndex           : turnIndex,
            playerIndex         : playerIndex,
        }];

        const allActionArray    = this._srcExecutedOperationArray ?? [];
        const actionsCount      = allActionArray.length;
        const maxPlayerIndex    = this.getPlayerManager().getTotalPlayersCount(false);
        for (let i = 0; i < actionsCount; ++i) {
            const action = allActionArray[i];
            if ((action.getWoPlayerEndTurn()) || (action.getWoSystemEndTurn()) || (i === actionsCount - 1)) {
                if (playerIndex < maxPlayerIndex) {
                    ++playerIndex;
                } else {
                    playerIndex = 0;
                    ++turnIndex;
                }
                infoArray.push({
                    checkpointId    : ++checkpointId,
                    nextOperationId : (action.getOperationId() ?? 0) + 1,
                    turnIndex       : turnIndex,
                    playerIndex     : playerIndex,
                });
            }
        }

        return infoArray;
    }

    public async loadCheckpoint(checkpointId: number, floatText = true): Promise<void> {
        if ((this.getIsExecutingAction())   ||
            (!this.getIsRunning())          ||
            (this.getIsTickingReplay())
        ) {
            return;
        }

        this._setIsTickingReplay(true);
        await this._doLoadCheckpoint(checkpointId, floatText);
        this._setIsTickingReplay(false);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ReplayTick);
    }
    /** 不加锁，也不判断当前是否被锁 */
    private async _doLoadCheckpoint(checkpointId: number, floatText = true): Promise<void> {
        this.setIsAutoReplay(false);

        this.setIsBatchExecuteAction(true);
        while (!this._getCheckpointData(checkpointId)) {
            await TimerTimerModel.checkAndCallLater(50);
            await this._executeNextAction(true);
        }
        this.setIsBatchExecuteAction(false);

        await this._loadExistingCheckpoint(checkpointId, floatText);
    }
    public async loadPreviousCheckpoint(floatText = true): Promise<void> {
        if ((this.checkIsInBeginning())     ||
            (this.getIsExecutingAction())   ||
            (!this.getIsRunning())          ||
            (this.getIsTickingReplay())
        ) {
            return;
        }

        this._setIsTickingReplay(true);
        await this._doLoadPreviousCheckpoint(floatText);
        this._setIsTickingReplay(false);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ReplayTick);
    }
    /** 不加锁，也不判断当前是否被锁 */
    private _doLoadPreviousCheckpoint(floatText = true): Promise<void> {
        const nextOperationId   = this.getNextOperationId();
        const checkpointId      = Math.min(HelpersMisc.getExisted(this._getCheckpointId(nextOperationId)), HelpersMisc.getExisted(this._getCheckpointId(nextOperationId - 1)));
        return this._doLoadCheckpoint(checkpointId, floatText);
    }
    public async loadNextCheckpoint(): Promise<void> {
        if ((this.checkIsInEnd())           ||
            (this.getIsExecutingAction())   ||
            (!this.getIsRunning())          ||
            (this.getIsTickingReplay())
        ) {
            return;
        }

        this._setIsTickingReplay(true);
        await this._doLoadCheckpoint(HelpersMisc.getExisted(this._getCheckpointId(this.getNextOperationId())) + 1);
        this._setIsTickingReplay(false);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ReplayTick);
    }
    private async _loadExistingCheckpoint(checkpointId: number, floatText = true): Promise<void> {
        if ((this.getIsExecutingAction()) || (!this.getIsRunning())) {
            throw HelpersMisc.newError(`RwWarBase._loadExistingCheckpoint() can't load!`);
        }

        this.setIsAutoReplay(false);

        const checkpointData = HelpersMisc.getExisted(this._getCheckpointData(checkpointId));
        this.fastLoadState(ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(checkpointData.warData));
        await TimerTimerModel.checkAndCallLater();

        this.setNextOperationId(checkpointData.nextOperationId);
        this.setIsEnded(this.checkIsInEnd());

        if (floatText) {
            const lastOperationId = this._getLastOperationId();
            FloatText2.show(`${LangUtils.getText(LangConstants.TextType.A0045)} (${this.getNextOperationId()} / ${lastOperationId == null ? `??` : lastOperationId + 1} ${LangUtils.getText(LangConstants.TextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
        }
    }

    public async loadPreviousAction(): Promise<void> {
        if ((this.checkIsInBeginning())     ||
            (this.getIsExecutingAction())   ||
            (!this.getIsRunning())          ||
            (this.getIsTickingReplay())
        ) {
            return;
        }

        this._setIsTickingReplay(true);

        const nextOperationId = this.getNextOperationId() - 1;
        await this._doLoadPreviousCheckpoint(false);

        this.setIsBatchExecuteAction(true);
        while (this.getNextOperationId() < nextOperationId) {
            await this._executeNextAction(true);
        }
        this.setIsBatchExecuteAction(false);

        this._fastInitView();
        this.startRunning().startRunningView();
        this.updateTilesAndUnitsOnVisibilityChanged(false);
        this.getView().updatePersistentText();
        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : this,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(this.getPlayerInTurn().getCoCategoryId()),
        });

        this._setIsTickingReplay(false);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ReplayTick);
    }
    public async loadNextAction(): Promise<void> {
        if ((this.checkIsInEnd())           ||
            (this.getIsExecutingAction())   ||
            (!this.getIsRunning())          ||
            (this.getIsTickingReplay())
        ) {
            return;
        }

        this._setIsTickingReplay(true);

        await this._executeNextAction(true);

        this._fastInitView();
        this.startRunning().startRunningView();
        this.updateTilesAndUnitsOnVisibilityChanged(false);
        this.getView().updatePersistentText();
        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : this,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(this.getPlayerInTurn().getCoCategoryId()),
        });

        this._setIsTickingReplay(false);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ReplayTick);
    }

    private async _executeNextAction(isFastExecute: boolean): Promise<void> {
        const action = this.getNextAction();
        if ((action == null)            ||
            (!this.getIsRunning())       ||
            (this.checkIsInEnd())        ||
            (this.getIsExecutingAction())
        ) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.B0110));
        } else {
            await this._doExecuteAction(action, isFastExecute);
        }
    }
    private async _doExecuteAction(action: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer, isFastExecute: boolean): Promise<void> {
        this.setNextOperationId(this.getNextOperationId() + 1);
        await WarOperationsExecutorsExecutor.checkAndExecute(this, action, isFastExecute);

        const isInEnd = this.checkIsInEnd();
        if (isInEnd) {
            this.setIsAutoReplay(false);
        }

        const operationId       = this.getNextOperationId();
        const turnManager       = this.getTurnManager();
        const prevCheckpointId  = HelpersMisc.getExisted(this._getCheckpointId(operationId - 1));
        const prevTurnData      = this._getTurnAndPlayerIndexByCheckpointId(prevCheckpointId);
        const isNewCheckpoint   = (isInEnd) || (turnManager.getTurnIndex() !== prevTurnData.turnIndex) || (turnManager.getPlayerIndexInTurn() !== prevTurnData.playerIndex);
        const checkpointId      = isNewCheckpoint ? prevCheckpointId + 1 : prevCheckpointId;
        if (this._getCheckpointId(operationId) == null) {
            this._setCheckpointId(operationId, checkpointId);
        }
        if (this._getCheckpointData(checkpointId) == null) {
            this._setCheckpointData(checkpointId, this.serializeForCheckpoint());
        }

        if (!isFastExecute) {
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ReplayTick);
        }

        if ((!isInEnd) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
            VendorEgretEgret.setTimeout(() => {
                if ((!this.checkIsInEnd()) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
                    this._doExecuteAction(HelpersMisc.getExisted(this.getNextAction()), isFastExecute);
                }
            }, null, LocalDataStorage.getReplayPauseTime());
        }
    }
    private _getTurnAndPlayerIndexByCheckpointId(checkpointId: number): TurnIndexAndPlayerIndex {
        const dict = this._turnAndPlayerIndexesForCheckpointId;
        if (dict.has(checkpointId)) {
            return HelpersMisc.getExisted(dict.get(checkpointId));
        } else {
            const turnData      = HelpersMisc.getExisted(ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersMisc.getExisted(this._getCheckpointData(checkpointId)).warData).getTurnManager());
            const turnIndex     = turnData.getTurnIndex() ?? 0;
            const playerIndex   = turnData.getPlayerIndex() ?? 0;
            const data          : TurnIndexAndPlayerIndex = {
                turnIndex   : turnIndex,
                playerIndex : playerIndex,
            };
            dict.set(checkpointId, data);
            return data;
        }
    }
}
