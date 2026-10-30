import {
    Notifications_Dispatcher,
    Keyboard_KbManager,
    Helpers_PointerInput,
    Helpers_Misc,
    AuxiliaryTypes_TaskQueue,
    Ui_Components_UiContainer,
    Ui_Components_UiPromptedInput,
    Ui_Components_UiTextInput,
    type Ui_Interfaces_IUiOpenableComponent,
    type Keyboard_KbTypes,
    type Notifications_Types,
    type Ui_Types_UiInputEventListener,
    type Ui_Types_UiPointerEventListener,
} from "../../internal.ts";

interface KeyboardListener {
    callback    : Keyboard_KbTypes.KeyCallback;
    thisObject  : unknown;
    priority?   : number;
}

export abstract class UiOpenableComponent<OpenData>
    extends     Ui_Components_UiContainer.UiContainer
    implements  Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<OpenData> {
    private readonly _taskQueueForOpenClose = new AuxiliaryTypes_TaskQueue.TaskQueue<void>();
    private readonly _taskQueueForOpenData  = new AuxiliaryTypes_TaskQueue.TaskQueue<void>();

    private _isOpened               = false;

    private _previousOpenData?      : OpenData;
    private _openData?              : OpenData;

    private _notifyListenerArray?   : Notifications_Types.Listener[];
    private _pointerListenerArray?  : Ui_Types_UiPointerEventListener.UiPointerEventListener[];
    private _inputListenerArray?    : Ui_Types_UiInputEventListener.UiInputEventListener[];
    private _keyboardListener?      : KeyboardListener;

    private _getTaskQueueForOpenClose(): AuxiliaryTypes_TaskQueue.TaskQueue<void> {
        return this._taskQueueForOpenClose;
    }
    private _getTaskQueueForOpenData(): AuxiliaryTypes_TaskQueue.TaskQueue<void> {
        return this._taskQueueForOpenData;
    }

    public open(): Promise<void> {
        return this._getTaskQueueForOpenClose().addTask(() => this._doOpen());
    }
    private async _doOpen(): Promise<void> {
        // if (!this.getSkinInfo()?.getIsLoaded()) {
        //     throw Helpers.Misc.newError(`Skin not loaded.`);
        // }
        if (!this.getParent()) {
            throw Helpers_Misc.newError(`No parent.`);
        }
        if (this._getIsOpened()) {
            throw Helpers_Misc.newError(`Already opened.`);
        }

        this._setIsOpened(true);
        this._registerNotifyListeners();    // 提早注册，避免onOpened太慢导致来不及触发
        await this._onOpened();
        this._registerInputListeners();
        this._registerUiListeners();
        this._registerKeyboardListener();
    }

    public close(): Promise<void> {
        return this._getTaskQueueForOpenClose().addTask(() => this._doClose());
    }
    private async _doClose(): Promise<void> {
        if (!this._getIsOpened()) {
            throw Helpers_Misc.newError(`Not opened.`);
        }

        this._unregisterNotifyListeners();
        this._unregisterInputListeners();
        this._unregisterUiListeners();
        this._unregisterKeyboardListener();
        await this._onClosed();
        this._setIsOpened(false);
    }

    /** 若有打开动画，要在此函数内播放，并等待其结束后再返回 */
    protected _onOpened(): void | Promise<void> {
        // to be overridden
    }
    /** 若有关闭动画，要在此函数内播放，并等待其结束后再返回 */
    protected _onClosed(): void | Promise<void> {
        // to be overridden
    }

    protected _getIsOpened(): boolean {
        return this._isOpened;
    }
    private _setIsOpened(opening: boolean): void {
        this._isOpened = opening;
    }

    public getPreviousOpenData(): OpenData | undefined {
        return this._previousOpenData;
    }
    public getOpenData(): OpenData | undefined {
        return this._openData;
    }
    public setOpenData(data: OpenData | undefined): void {
        this._previousOpenData  = this.getOpenData();
        this._openData          = data;
    }
    public applyOpenData(): Promise<void> | void {
        return this._getTaskQueueForOpenData().addTask(() => this._doApplyOpenData());
    }
    /**
     * 此函数内部需要await与控件尺寸有关的代码（若有），否则layout排版可能错乱。
     *
     * 此函数内部不要await与控件尺寸无关的代码，以求尽快返回，减少用户等待。
     */
    protected _doApplyOpenData(): void | Promise<void> {
        // to be overridden
    }

    protected _getNotifyListenerArray(): Notifications_Types.Listener[] | undefined {
        return this._notifyListenerArray;
    }
    protected _setNotifyListenerArray(array: Notifications_Types.Listener[] | undefined): void {
        this._notifyListenerArray = array;
    }
    protected _getUiListenerArray(): Ui_Types_UiPointerEventListener.UiPointerEventListener[] | undefined {
        return this._pointerListenerArray;
    }
    protected _setUiListenerArray(array: Ui_Types_UiPointerEventListener.UiPointerEventListener[] | undefined): void {
        this._pointerListenerArray = array;
    }
    protected _getInputListenerArray(): Ui_Types_UiInputEventListener.UiInputEventListener[] | undefined {
        return this._inputListenerArray;
    }
    protected _setInputListenerArray(array: Ui_Types_UiInputEventListener.UiInputEventListener[] | undefined): void {
        this._inputListenerArray = array;
    }
    protected _getKeyboardListener(): KeyboardListener | undefined {
        return this._keyboardListener;
    }
    protected _setKeyboardListener(listener: KeyboardListener | undefined): void {
        this._keyboardListener = listener;
    }

    private _registerNotifyListeners(): void {
        {
            const arr = this._getNotifyListenerArray();
            if (arr) {
                Notifications_Dispatcher.addEventListeners(arr, this);
            }
        }
    }
    private _registerUiListeners(): void {
        const arr = this._getUiListenerArray();
        if (arr) {
            for (const l of arr) {
                const ui        = l.ui;
                // ui.eventMode    = "static";
                ui.setIsTouchEnabled(true);
                ui.setMouseStyle(l.mouseStyle ?? ui.getMouseStyle() ?? Helpers_PointerInput.MouseStyleType.Pointer);
                ui.getEventAgent().addPointerEventListener(l.eventType ?? Helpers_PointerInput.PointerEventType.Tap, l.callback, l.thisObject ?? this);
            }
        }
    }
    private _registerInputListeners(): void {
        const arr = this._getInputListenerArray();
        if (arr) {
            for (const l of arr) {
                const ui = l.ui;
                if (ui instanceof Ui_Components_UiTextInput.UiTextInput) {
                    ui.getEventAgent().addInputEventListener(l.eventType, l.callback, l.thisObject ?? this);
                } else if (ui instanceof Ui_Components_UiPromptedInput.UiPromptedInput) {
                    ui.getInputComponent()?.getEventAgent().addInputEventListener(l.eventType, l.callback, l.thisObject ?? this);
                } else {
                    throw Helpers_Misc.newError(`Unknown input.`);
                }
            }
        }
    }
    private _registerKeyboardListener(): void {
        const listener = this._getKeyboardListener();
        if (listener) {
            Keyboard_KbManager.addListener(listener.callback, listener.thisObject, listener.priority);
        }
    }
    private _unregisterNotifyListeners(): void {
        const arr = this._getNotifyListenerArray();
        if (arr) {
            Notifications_Dispatcher.removeEventListeners(arr, this);
        }
    }
    private _unregisterUiListeners(): void {
        const arr = this._getUiListenerArray();
        if (arr) {
            for (const l of arr) {
                const ui        = l.ui;
                // ui.eventMode    = "passive";
                ui.setIsTouchEnabled(false);
                ui.getEventAgent().removePointerEventListener(l.eventType ?? Helpers_PointerInput.PointerEventType.Tap, l.callback, l.thisObject ?? this);
            }
        }
    }
    private _unregisterInputListeners(): void {
        const arr = this._getInputListenerArray();
        if (arr) {
            for (const l of arr) {
                const ui = l.ui;
                if (ui instanceof Ui_Components_UiTextInput.UiTextInput) {
                    ui.getEventAgent().removeInputEventListener(l.eventType, l.callback, l.thisObject ?? this);
                } else if (ui instanceof Ui_Components_UiPromptedInput.UiPromptedInput) {
                    ui.getInputComponent()?.getEventAgent().removeInputEventListener(l.eventType, l.callback, l.thisObject ?? this);
                } else {
                    throw Helpers_Misc.newError(`Unknown input.`);
                }
            }
        }
    }
    private _unregisterKeyboardListener(): void {
        const listener = this._getKeyboardListener();
        if (listener) {
            Keyboard_KbManager.deleteListener(listener.callback, listener.thisObject);
        }
    }
}
