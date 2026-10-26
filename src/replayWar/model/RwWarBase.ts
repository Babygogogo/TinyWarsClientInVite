import type {
    Undefinable,
    ReplayCheckpointData,
    ReplayCheckpointInfo,
} from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWarEventManager } from "../../baseWar/interface/IBwWarEventManager.ts";
import { BwWar } from "../../baseWar/model/BwWar.ts";
import { TimerTypeId } from "../../bootTimers/Constants.ts";
import { show } from "../../FloatText.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getBwWarEventManagerClass } from "../../gameHelpers/GhFactory.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { getReplayPauseTime } from "../../localData/Storage.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
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
import type { IRwWarBase } from "../interface/IRwWarBase.ts";
import { playCoBgmWithWar } from "../../sounds/SoundPlayer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import { getSelfSettingsCoBgmCodeArray } from "../../users/Model.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { setTimeout } from "../../vendor/egret/Egret.ts";
import { checkAndExecute } from "../../warOperations/executors/Executor.ts";

type TurnIndexAndPlayerIndex = {
    turnIndex   : number;
    playerIndex : number;
};

export abstract class RwWarBase extends BwWar implements IRwWarBase {
    private readonly _warEventManager               = new (getBwWarEventManagerClass())();
    private _srcExecutedOperationArray              : WoContainer[] | null = null;

    private _settingsForMcw                         : Undefinable<SettingsForMcw>;
    private _settingsForMfw                         : Undefinable<SettingsForMfw>;
    private _settingsForMrw                         : Undefinable<SettingsForMrw>;
    private _settingsForMmw                         : Undefinable<SettingsForMmw>;
    private _settingsForCcw                         : Undefinable<SettingsForCcw>;
    private _settingsForAtw                         : Undefinable<SettingsForAtw>;
    private _settingsForScw                         : Undefinable<SettingsForScw>;
    private _settingsForSfw                         : Undefinable<SettingsForSfw>;
    private _settingsForSrw                         : Undefinable<SettingsForSrw>;

    private _visionTeamIndex                        : number | null = null;
    private _isTickingReplay                        = false;
    private _isBatchExecuteAction                   = false;    // 用于在批量运行战局操作（比如切换到下一回合或战局终止状态）时，省略不必要的计算
    private _isShowTurnStartPopUp                   = true;
    private _isAutoReplay                           = false;
    private _firstOperationId                       = 0;
    private _nextOperationId                        = 0;
    private _checkpointIdsForNextOperationId        = new Map<number, number>();
    private _checkpointDataListForCheckpointId      = new Map<number, ReplayCheckpointData>();
    private _turnAndPlayerIndexesForCheckpointId    = new Map<number, TurnIndexAndPlayerIndex>();
    private readonly _gridMarkData                  = new GridMarkData();

    public abstract serializeForCheckpoint(): ReplayCheckpointData;
    public abstract tickVisionTeamIndex(): number | null;

    public init(warData: SerialWar, gameConfig: GameConfig): void {
        warData                             = warData.clone();
        const srcExecutedOperationArray     = warData.getExecutedOperationManager()?.getExecutedOperationArray() ?? [];
        this._srcExecutedOperationArray     = srcExecutedOperationArray;
        warData.setExecutedOperationManager(new SerialExecutedOperationManager());
        this._baseInit(warData, gameConfig, getWarTypeId(warData));

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

    public getWarEventManager(): IBwWarEventManager {
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
        return [TimerTypeId.NoBoot];
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
        return `(${this.getNextOperationId()} / ${lastOperationId == null ? `??` : lastOperationId + 1} ${getText(TextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`;
    }

    public getSettingsForMcw(): Undefinable<SettingsForMcw> {
        return this._settingsForMcw;
    }
    protected _setSettingsForMcw(value: Undefinable<SettingsForMcw>): void {
        this._settingsForMcw = value;
    }
    public getSettingsForScw(): Undefinable<SettingsForScw> {
        return this._settingsForScw;
    }
    protected _setSettingsForScw(value: Undefinable<SettingsForScw>): void {
        this._settingsForScw = value;
    }
    public getSettingsForSfw(): Undefinable<SettingsForSfw> {
        return this._settingsForSfw;
    }
    protected _setSettingsForSfw(value: Undefinable<SettingsForSfw>): void {
        this._settingsForSfw = value;
    }
    public getSettingsForSrw(): Undefinable<SettingsForSrw> {
        return this._settingsForSrw;
    }
    protected _setSettingsForSrw(value: Undefinable<SettingsForSrw>): void {
        this._settingsForSrw = value;
    }
    public getSettingsForMrw(): Undefinable<SettingsForMrw> {
        return this._settingsForMrw;
    }
    protected _setSettingsForMrw(value: Undefinable<SettingsForMrw>): void {
        this._settingsForMrw = value;
    }
    public getSettingsForMmw(): Undefinable<SettingsForMmw> {
        return this._settingsForMmw;
    }
    protected _setSettingsForMmw(value: Undefinable<SettingsForMmw>): void {
        this._settingsForMmw = value;
    }
    public getSettingsForAtw(): Undefinable<SettingsForAtw> {
        return this._settingsForAtw;
    }
    protected _setSettingsForAtw(value: Undefinable<SettingsForAtw>): void {
        this._settingsForAtw = value;
    }
    public getSettingsForCcw(): Undefinable<SettingsForCcw> {
        return this._settingsForCcw;
    }
    protected _setSettingsForCcw(value: Undefinable<SettingsForCcw>): void {
        this._settingsForCcw = value;
    }
    public getSettingsForMfw(): Undefinable<SettingsForMfw> {
        return this._settingsForMfw;
    }
    protected _setSettingsForMfw(value: Undefinable<SettingsForMfw>): void {
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
            dispatch(TypeId.ReplayAutoReplayChanged);

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
        dispatch(TypeId.RwNextOperationIdChanged);
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

    private _getCheckpointData(checkpointId: number): ReplayCheckpointData | null {
        return this._checkpointDataListForCheckpointId.get(checkpointId) ?? null;
    }
    private _setCheckpointData(checkpointId: number, data: ReplayCheckpointData): void {
        this._checkpointDataListForCheckpointId.set(checkpointId, data);
    }

    public getAllCheckpointInfoArray(): ReplayCheckpointInfo[] {
        const turnManager   = getExisted(SerialWar.decode(getExisted(this._getCheckpointData(0)?.warData)).getTurnManager(), ClientErrorCode.HrwWar_GetAllCheckpointInfoArray_00);
        let checkpointId    = 0;
        let turnIndex       = turnManager.getTurnIndex() ?? 0;
        let playerIndex     = turnManager.getPlayerIndex() ?? 0;
        const infoArray     : ReplayCheckpointInfo[] = [{
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
        dispatch(TypeId.ReplayTick);
    }
    /** 不加锁，也不判断当前是否被锁 */
    private async _doLoadCheckpoint(checkpointId: number, floatText = true): Promise<void> {
        this.setIsAutoReplay(false);

        this.setIsBatchExecuteAction(true);
        while (!this._getCheckpointData(checkpointId)) {
            await checkAndCallLater(50);
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
        dispatch(TypeId.ReplayTick);
    }
    /** 不加锁，也不判断当前是否被锁 */
    private _doLoadPreviousCheckpoint(floatText = true): Promise<void> {
        const nextOperationId   = this.getNextOperationId();
        const checkpointId      = Math.min(getExisted(this._getCheckpointId(nextOperationId)), getExisted(this._getCheckpointId(nextOperationId - 1)));
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
        await this._doLoadCheckpoint(getExisted(this._getCheckpointId(this.getNextOperationId())) + 1);
        this._setIsTickingReplay(false);
        dispatch(TypeId.ReplayTick);
    }
    private async _loadExistingCheckpoint(checkpointId: number, floatText = true): Promise<void> {
        if ((this.getIsExecutingAction()) || (!this.getIsRunning())) {
            throw newError(`RwWarBase._loadExistingCheckpoint() can't load!`);
        }

        this.setIsAutoReplay(false);

        const checkpointData = getExisted(this._getCheckpointData(checkpointId));
        this.fastLoadState(SerialWar.decode(checkpointData.warData));
        await checkAndCallLater();

        this.setNextOperationId(checkpointData.nextOperationId);
        this.setIsEnded(this.checkIsInEnd());

        if (floatText) {
            const lastOperationId = this._getLastOperationId();
            show(`${getText(TextType.A0045)} (${this.getNextOperationId()} / ${lastOperationId == null ? `??` : lastOperationId + 1} ${getText(TextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
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
        playCoBgmWithWar({
            war                             : this,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(this.getPlayerInTurn().getCoCategoryId()),
        });

        this._setIsTickingReplay(false);
        dispatch(TypeId.ReplayTick);
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
        playCoBgmWithWar({
            war                             : this,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(this.getPlayerInTurn().getCoCategoryId()),
        });

        this._setIsTickingReplay(false);
        dispatch(TypeId.ReplayTick);
    }

    private async _executeNextAction(isFastExecute: boolean): Promise<void> {
        const action = this.getNextAction();
        if ((action == null)            ||
            (!this.getIsRunning())       ||
            (this.checkIsInEnd())        ||
            (this.getIsExecutingAction())
        ) {
            show(getText(TextType.B0110));
        } else {
            await this._doExecuteAction(action, isFastExecute);
        }
    }
    private async _doExecuteAction(action: WoContainer, isFastExecute: boolean): Promise<void> {
        this.setNextOperationId(this.getNextOperationId() + 1);
        await checkAndExecute(this, action, isFastExecute);

        const isInEnd = this.checkIsInEnd();
        if (isInEnd) {
            this.setIsAutoReplay(false);
        }

        const operationId       = this.getNextOperationId();
        const turnManager       = this.getTurnManager();
        const prevCheckpointId  = getExisted(this._getCheckpointId(operationId - 1));
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
            dispatch(TypeId.ReplayTick);
        }

        if ((!isInEnd) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
            setTimeout(() => {
                if ((!this.checkIsInEnd()) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
                    this._doExecuteAction(getExisted(this.getNextAction()), isFastExecute);
                }
            }, null, getReplayPauseTime());
        }
    }
    private _getTurnAndPlayerIndexByCheckpointId(checkpointId: number): TurnIndexAndPlayerIndex {
        const dict = this._turnAndPlayerIndexesForCheckpointId;
        if (dict.has(checkpointId)) {
            return getExisted(dict.get(checkpointId));
        } else {
            const turnData      = getExisted(SerialWar.decode(getExisted(this._getCheckpointData(checkpointId)).warData).getTurnManager());
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
