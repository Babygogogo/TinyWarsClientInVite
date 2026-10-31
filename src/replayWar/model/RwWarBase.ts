import {
    BaseWar_Model_BwWar,
    BaseWar_Model_BwWarEventManager,
    FloatText,
    BootTimers_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWarEventManager,
    type AuxiliaryTypes_AuxiliaryTypes,
    Timer_TimerModel,
    WarOperations_Executors_Executor,
    Utils_ClientErrorCode,
    Notifications_Dispatcher,
    Helpers_Misc,
    LocalData_Storage,
    Users_Model,
    Lang_Utils,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    Sounds_SoundPlayer,
    Egret_Egret,
    Lang_Constants,
    type ReplayWar_Interface_IRwWarBase,
} from "../../internal.ts";

import { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { SerialExecutedOperationManager } from "../../proto/schema/CommonProto/WarSerialization/SerialExecutedOperationManager.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForAtw } from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";
import type { SettingsForCcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import type { SettingsForMcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import type { SettingsForMfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";
import type { SettingsForMmw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";
import type { SettingsForMrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";
import type { SettingsForScw } from "../../proto/schema/CommonProto/WarSettings/SettingsForScw.ts";
import type { SettingsForSfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";
import type { SettingsForSrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";

type TurnIndexAndPlayerIndex = {
    turnIndex   : number;
    playerIndex : number;
};

export abstract class RwWarBase extends BaseWar_Model_BwWar.BwWar implements ReplayWar_Interface_IRwWarBase.IRwWarBase {
    private readonly _warEventManager               = new BaseWar_Model_BwWarEventManager.BwWarEventManager();
    private _srcExecutedOperationArray              : WoContainer[] | null = null;

    private _settingsForMcw                         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMcw>;
    private _settingsForMfw                         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMfw>;
    private _settingsForMrw                         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMrw>;
    private _settingsForMmw                         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMmw>;
    private _settingsForCcw                         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForCcw>;
    private _settingsForAtw                         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForAtw>;
    private _settingsForScw                         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForScw>;
    private _settingsForSfw                         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForSfw>;
    private _settingsForSrw                         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForSrw>;

    private _visionTeamIndex                        : number | null = null;
    private _isTickingReplay                        = false;
    private _isBatchExecuteAction                   = false;    // 用于在批量运行战局操作（比如切换到下一回合或战局终止状态）时，省略不必要的计算
    private _isShowTurnStartPopUp                   = true;
    private _isAutoReplay                           = false;
    private _firstOperationId                       = 0;
    private _nextOperationId                        = 0;
    private readonly _checkpointIdsForNextOperationId        = new Map<number, number>();
    private readonly _checkpointDataListForCheckpointId      = new Map<number, AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointData>();
    private readonly _turnAndPlayerIndexesForCheckpointId    = new Map<number, TurnIndexAndPlayerIndex>();
    private readonly _gridMarkData                  = new GridMarkData();

    public abstract serializeForCheckpoint(): AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointData;
    public abstract tickVisionTeamIndex(): number | null;

    public init(warData: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        warData                             = warData.clone();
        const srcExecutedOperationArray     = warData.getExecutedOperationManager()?.getExecutedOperationArray() ?? [];
        this._srcExecutedOperationArray     = srcExecutedOperationArray;
        warData.setExecutedOperationManager(new SerialExecutedOperationManager());
        this._baseInit(warData, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(warData));

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

    public getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager {
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
        return [BootTimers_Constants.TimerTypeId.NoBoot];
    }
    public getNormalMapId(): number | null {
        const settingsForMcw = this.getSettingsForMcw();
        if (settingsForMcw) {
            return settingsForMcw.getNormalMapId();
        }

        const settingsForMrw = this.getSettingsForMrw();
        if (settingsForMrw) {
            return settingsForMrw.getNormalMapId();
        }

        const settingsForMmw = this.getSettingsForMmw();
        if (settingsForMmw) {
            return settingsForMmw.getNormalMapId();
        }

        const settingsForAtw = this.getSettingsForAtw();
        if (settingsForAtw) {
            return settingsForAtw.getNormalMapId();
        }

        const settingsForScw = this.getSettingsForScw();
        if (settingsForScw) {
            return settingsForScw.getNormalMapId();
        }

        const settingsForSrw = this.getSettingsForSrw();
        if (settingsForSrw) {
            return settingsForSrw.getNormalMapId();
        }

        const settingsForCcw = this.getSettingsForCcw();
        if (settingsForCcw) {
            return settingsForCcw.getNormalMapId();
        }

        return null;
    }

    public getWarOperationDescSuffix(): string {
        const lastOperationId = this._getLastOperationId();
        return `(${this.getNextOperationId()} / ${lastOperationId == null ? `??` : lastOperationId + 1} ${Lang_Utils.getText(Lang_Constants.TextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`;
    }

    public getSettingsForMcw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMcw> {
        return this._settingsForMcw;
    }
    protected _setSettingsForMcw(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMcw>): void {
        this._settingsForMcw = value;
    }
    public getSettingsForScw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForScw> {
        return this._settingsForScw;
    }
    protected _setSettingsForScw(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForScw>): void {
        this._settingsForScw = value;
    }
    public getSettingsForSfw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForSfw> {
        return this._settingsForSfw;
    }
    protected _setSettingsForSfw(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForSfw>): void {
        this._settingsForSfw = value;
    }
    public getSettingsForSrw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForSrw> {
        return this._settingsForSrw;
    }
    protected _setSettingsForSrw(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForSrw>): void {
        this._settingsForSrw = value;
    }
    public getSettingsForMrw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMrw> {
        return this._settingsForMrw;
    }
    protected _setSettingsForMrw(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMrw>): void {
        this._settingsForMrw = value;
    }
    public getSettingsForMmw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMmw> {
        return this._settingsForMmw;
    }
    protected _setSettingsForMmw(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMmw>): void {
        this._settingsForMmw = value;
    }
    public getSettingsForAtw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForAtw> {
        return this._settingsForAtw;
    }
    protected _setSettingsForAtw(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForAtw>): void {
        this._settingsForAtw = value;
    }
    public getSettingsForCcw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForCcw> {
        return this._settingsForCcw;
    }
    protected _setSettingsForCcw(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForCcw>): void {
        this._settingsForCcw = value;
    }
    public getSettingsForMfw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMfw> {
        return this._settingsForMfw;
    }
    protected _setSettingsForMfw(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMfw>): void {
        this._settingsForMfw = value;
    }

    public getGridMarkData(): GridMarkData {
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
            Notifications_Dispatcher.dispatch("ReplayAutoReplayChanged");

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
        Notifications_Dispatcher.dispatch("RwNextOperationIdChanged");
    }
    public getNextAction(): WoContainer | null {
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

    private _getCheckpointData(checkpointId: number): AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointData | null {
        return this._checkpointDataListForCheckpointId.get(checkpointId) ?? null;
    }
    private _setCheckpointData(checkpointId: number, data: AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointData): void {
        this._checkpointDataListForCheckpointId.set(checkpointId, data);
    }

    public getAllCheckpointInfoArray(): AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointInfo[] {
        const turnManager   = Helpers_Misc.getExisted(SerialWar.decode(Helpers_Misc.getExisted(this._getCheckpointData(0)?.warData)).getTurnManager(), Utils_ClientErrorCode.ClientErrorCode.HrwWar_GetAllCheckpointInfoArray_00);
        let checkpointId    = 0;
        let turnIndex       = turnManager.getTurnIndex();
        let playerIndex     = turnManager.getPlayerIndex();
        const infoArray     : AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointInfo[] = [{
            checkpointId    : checkpointId,
            nextOperationId : this._getFirstOperationId(),
            turnIndex       : turnIndex,
            playerIndex     : playerIndex,
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
        Notifications_Dispatcher.dispatch("ReplayTick");
    }
    /** 不加锁，也不判断当前是否被锁 */
    private async _doLoadCheckpoint(checkpointId: number, floatText = true): Promise<void> {
        this.setIsAutoReplay(false);

        this.setIsBatchExecuteAction(true);
        while (!this._getCheckpointData(checkpointId)) {
            await Timer_TimerModel.checkAndCallLater(50);
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
        Notifications_Dispatcher.dispatch("ReplayTick");
    }
    /** 不加锁，也不判断当前是否被锁 */
    private _doLoadPreviousCheckpoint(floatText = true): Promise<void> {
        const nextOperationId   = this.getNextOperationId();
        const checkpointId      = Math.min(Helpers_Misc.getExisted(this._getCheckpointId(nextOperationId)), Helpers_Misc.getExisted(this._getCheckpointId(nextOperationId - 1)));
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
        await this._doLoadCheckpoint(Helpers_Misc.getExisted(this._getCheckpointId(this.getNextOperationId())) + 1);
        this._setIsTickingReplay(false);
        Notifications_Dispatcher.dispatch("ReplayTick");
    }
    private async _loadExistingCheckpoint(checkpointId: number, floatText = true): Promise<void> {
        if ((this.getIsExecutingAction()) || (!this.getIsRunning())) {
            throw Helpers_Misc.newError(`RwWarBase._loadExistingCheckpoint() can't load!`);
        }

        this.setIsAutoReplay(false);

        const checkpointData = Helpers_Misc.getExisted(this._getCheckpointData(checkpointId));
        this.fastLoadState(SerialWar.decode(checkpointData.warData));
        await Timer_TimerModel.checkAndCallLater();

        this.setNextOperationId(checkpointData.nextOperationId);
        this.setIsEnded(this.checkIsInEnd());

        if (floatText) {
            const lastOperationId = this._getLastOperationId();
            FloatText.show(`${Lang_Utils.getText(Lang_Constants.TextType.A0045)} (${this.getNextOperationId()} / ${lastOperationId == null ? `??` : lastOperationId + 1} ${Lang_Utils.getText(Lang_Constants.TextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
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
        Sounds_SoundPlayer.playCoBgmWithWar({
            war                            : this,
            force                          : false,
            coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(this.getPlayerInTurn().getCoCategoryId()),
        });

        this._setIsTickingReplay(false);
        Notifications_Dispatcher.dispatch("ReplayTick");
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
        Sounds_SoundPlayer.playCoBgmWithWar({
            war                            : this,
            force                          : false,
            coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(this.getPlayerInTurn().getCoCategoryId()),
        });

        this._setIsTickingReplay(false);
        Notifications_Dispatcher.dispatch("ReplayTick");
    }

    private async _executeNextAction(isFastExecute: boolean): Promise<void> {
        const action = this.getNextAction();
        if ((action == null)            ||
            (!this.getIsRunning())       ||
            (this.checkIsInEnd())        ||
            (this.getIsExecutingAction())
        ) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.B0110));
        } else {
            await this._doExecuteAction(action, isFastExecute);
        }
    }
    private async _doExecuteAction(action: WoContainer, isFastExecute: boolean): Promise<void> {
        this.setNextOperationId(this.getNextOperationId() + 1);
        await WarOperations_Executors_Executor.checkAndExecute(this, action, isFastExecute);

        const isInEnd = this.checkIsInEnd();
        if (isInEnd) {
            this.setIsAutoReplay(false);
        }

        const operationId       = this.getNextOperationId();
        const turnManager       = this.getTurnManager();
        const prevCheckpointId  = Helpers_Misc.getExisted(this._getCheckpointId(operationId - 1));
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
            Notifications_Dispatcher.dispatch("ReplayTick");
        }

        if ((!isInEnd) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
            Egret_Egret.setTimeout(() => {
                if ((!this.checkIsInEnd()) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
                    this._doExecuteAction(Helpers_Misc.getExisted(this.getNextAction()), isFastExecute);
                }
            }, null, LocalData_Storage.getReplayPauseTime());
        }
    }
    private _getTurnAndPlayerIndexByCheckpointId(checkpointId: number): TurnIndexAndPlayerIndex {
        const dict = this._turnAndPlayerIndexesForCheckpointId;
        if (dict.has(checkpointId)) {
            return Helpers_Misc.getExisted(dict.get(checkpointId));
        } else {
            const turnData      = Helpers_Misc.getExisted(SerialWar.decode(Helpers_Misc.getExisted(this._getCheckpointData(checkpointId)).warData).getTurnManager());
            const turnIndex     = turnData.getTurnIndex();
            const playerIndex   = turnData.getPlayerIndex();
            const data          : TurnIndexAndPlayerIndex = {
                turnIndex   : turnIndex,
                playerIndex : playerIndex,
            };
            dict.set(checkpointId, data);
            return data;
        }
    }
}
