import {
    Keyboard_KbManager,
    GamePanels_Manager,
    Keyboard_KbTypes,
    Tween_Executor,
    Helpers_Misc,
    Stages_StageManager,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiPanel,
    Logger,
    type GamePanels_Types,
    Sounds_SoundPlayer,
    Helpers_PointerInput,
    Sounds_Constants,
    Graphics_Constants,
    Ui_Components_UiButton,
    Ui_Components_UiContainer,
    Ui_Components_UiOpenableComponent,
    Timer_TimerModel,
    type Egret_Egret,
} from "../../internal.ts";

const NAMES_FOR_GROUP = [
    `_group`,
];
const NAMES_FOR_BUTTON_CONFIRM = [
    `_btnConfirm`,
];
const NAMES_FOR_BUTTON_CLOSE = [
    `_btnClose`,
    `_btnCancel`,
    `_btnBack`,
];
const DefaultTweenTime = Graphics_Constants.Tween.DefaultDuration;

interface ComponentsForDefaultOpenAndCloseAnimation {
    imgMask : Ui_Interfaces_IUiImage.IUiImage;
    group   : Ui_Interfaces_IUiContainer.IUiContainer;
}

export abstract class UiPanel<OpenData> extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> implements Ui_Interfaces_IUiPanel.IUiPanel<OpenData> {
    private _panelConfig?                               : GamePanels_Types.PanelConfig<OpenData>;
    private _boundedGroupTouchCallbacks?                : Map<string, () => void>;

    private _isTouchMaskEnabled                         = false;
    private _isCloseOnTouchedMask                       = false;
    private _callbackOnTouchedMask?                     : () => void;
    private _touchMask?                                 : Ui_Interfaces_IUiContainer.IUiContainer;

    private _componentsForDefaultOpenAndCloseAnimation? : ComponentsForDefaultOpenAndCloseAnimation;
    private _defaultOpenAndCloseAnimationType           = 1;
    private _isShowingCloseAnimation                    = false;

    private _shouldListenKeyEscape                      = false;
    private _callbackOnKeyEscape?                       : () => void;

    public setPanelConfig(config: GamePanels_Types.PanelConfig<OpenData>): void {
        this._panelConfig = config;
    }
    public getPanelConfig(): GamePanels_Types.PanelConfig<OpenData> {
        return Helpers_Misc.getExisted(this._panelConfig);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for open self.
    ////////////////////////////////////////////////////////////////////////////////
    protected override async _onOpened(): Promise<void> {
        const touchMask = createTouchMask();
        this.addChild(touchMask as unknown as Egret_Egret.DisplayObject);

        const stage = Stages_StageManager.getStage();
        this.resize(stage.stageWidth, stage.stageHeight);
        this._resetSoundForCommonButtons();
        this._resetInteractiveForGroup(true);

        await (this._componentsForDefaultOpenAndCloseAnimation
            ? showDefaultOpenAnimation(this._componentsForDefaultOpenAndCloseAnimation, this._defaultOpenAndCloseAnimationType)
            : this._showOpenAnimation()
        );

        if (this._shouldListenKeyEscape) {
            Keyboard_KbManager.addListener(this._onKeyEscape, this);
        }
        this.removeChild(touchMask as unknown as Egret_Egret.DisplayObject);
    }

    protected async _showOpenAnimation(): Promise<void> {
        // to be overridden
    }

    protected _enableDefaultOpenAndCloseAnimation(imgMask: Ui_Interfaces_IUiImage.IUiImage, group: Ui_Interfaces_IUiContainer.IUiContainer, animationType = 1): void {
        this._componentsForDefaultOpenAndCloseAnimation = { imgMask : imgMask, group : group };
        this._defaultOpenAndCloseAnimationType          = animationType;
    }
    protected _disableDefaultOpenAndCloseAnimation(): void {
        delete this._componentsForDefaultOpenAndCloseAnimation;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for close self.
    ////////////////////////////////////////////////////////////////////////////////
    public closePanel(): void {
        GamePanels_Manager.closePanel(this.getPanelConfig());
    }

    protected override async _onClosed(): Promise<void> {
        const touchMask = createTouchMask();
        this.addChild(touchMask as unknown as Egret_Egret.DisplayObject);

        Keyboard_KbManager.deleteListener(this._onKeyEscape, this);

        this._setIsShowingCloseAnimation(true);
        await (this._componentsForDefaultOpenAndCloseAnimation
            ? showDefaultCloseAnimation(this._componentsForDefaultOpenAndCloseAnimation, this._defaultOpenAndCloseAnimationType)
            : this._showCloseAnimation()
        );
        this._setIsShowingCloseAnimation(false);

        this.removeChild(touchMask as unknown as Egret_Egret.DisplayObject);
    }

    protected async _showCloseAnimation(): Promise<void> {
        // to be overridden
    }

    protected _getIsShowingCloseAnimation(): boolean {
        return this._isShowingCloseAnimation;
    }
    private _setIsShowingCloseAnimation(isShowing: boolean): void {
        this._isShowingCloseAnimation = isShowing;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Auto resize.
    ////////////////////////////////////////////////////////////////////////////////
    public resize(stageWidth: number, stageHeight: number): void {
        const width     = stageWidth / this.getScaleX();
        const height    = stageHeight / this.getScaleY();
        this.setUnscaledManualWidth(width);
        this.setUnscaledManualHeight(height);

        const mask = this._touchMask;
        mask?.setUnscaledManualWidth(width);
        mask?.setUnscaledManualHeight(height);

        this._updateOnResize(stageWidth, stageHeight);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected _updateOnResize(_stageWidth: number, _stageHeight: number): void {
        // to be overridden
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Touch mask.
    ////////////////////////////////////////////////////////////////////////////////
    protected _setIsTouchMaskEnabled(enabled = true): void {
        this._isTouchMaskEnabled = enabled;
        this._resetTouchMask();
    }
    protected _getIsTouchMaskEnabled(): boolean {
        return this._isTouchMaskEnabled;
    }
    private _resetTouchMask(): void {
        if (!this._getIsTouchMaskEnabled()) {
            const mask = this._touchMask;
            if (mask) {
                // mask.off(UiEventTypePointerTap, this._onTouchedTouchMask, this);
                this.removeChild(mask as unknown as Egret_Egret.DisplayObject);
            }

        } else {
            if (!this._touchMask) {
                const newMask = createTouchMask();
                // newMask.on(UiEventTypePointerTap, this._onTouchedTouchMask, this);
                newMask.getEventAgent().addPointerEventListener(Helpers_PointerInput.PointerEventType.Tap, this._onTouchedTouchMask, this);
                this._touchMask = newMask;
            }
            this.addChildAt(this._touchMask as unknown as Egret_Egret.DisplayObject, 0);
        }
    }

    protected _setIsCloseOnTouchedMask(isClose = true): void {
        this._isCloseOnTouchedMask = isClose;
    }
    protected _getIsCloseOnTouchedMask(): boolean {
        return this._isCloseOnTouchedMask;
    }
    protected _setCallbackOnTouchedMask(callback: (() => void) | undefined): void {
        this._callbackOnTouchedMask = callback;
    }
    protected _getCallbackOnTouchedMask(): (() => void) | undefined {
        return this._callbackOnTouchedMask;
    }
    private _onTouchedTouchMask(): void {
        const callback = this._getCallbackOnTouchedMask();
        if (callback) {
            callback();
        }

        if (this._getIsCloseOnTouchedMask()) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this.closePanel();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Keyboard.
    ////////////////////////////////////////////////////////////////////////////////
    protected _enableKeyEscapeToClosePanel(callback?: () => void): void {
        this._shouldListenKeyEscape = true;
        this._callbackOnKeyEscape   = callback;
    }
    private _onKeyEscape(data: Keyboard_KbTypes.EventData): void {
        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        if (data.newKeys.has(Keyboard_KbTypes.KeyCode.Escape)) {
            if (this._callbackOnKeyEscape) {
                this._callbackOnKeyEscape();
            } else {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
                this.closePanel();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Utils.
    ////////////////////////////////////////////////////////////////////////////////
    private _resetSoundForCommonButtons(): void {
        const buttonClass = Ui_Components_UiButton.UiButton;
        for (const name of NAMES_FOR_BUTTON_CLOSE) {
            const btn = (this as any)[name];
            if (btn instanceof buttonClass) {
                btn.setShortSfxCode(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            }
        }
        for (const name of NAMES_FOR_BUTTON_CONFIRM) {
            const btn = (this as any)[name];
            if (btn instanceof buttonClass) {
                btn.setShortSfxCode(Sounds_Constants.ShortSfxCode.ButtonConfirm01);
            }
        }
    }
    private _resetInteractiveForGroup(on: boolean): void {
        const skinName = this._panelConfig?.skinName;
        for (const name of NAMES_FOR_GROUP) {
            const group = (this as any)[name];
            if (group instanceof Ui_Components_UiContainer.UiContainer) {
                if (on) {
                    group.setIsTouchEnabled(true);

                    if (window.CLIENT_VERSION === "DEVELOP") {
                        const agent = group.getEventAgent();
                        const dict  = this._boundedGroupTouchCallbacks ??= new Map<string, () => void>();
                        if (dict.has(name)) {
                            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Press, Helpers_Misc.getExisted(dict.get(name)), undefined);
                        } else {
                            const callback = (): void => Logger.log(`%cPanel pointer down:`, `background:#aaaaff;`, ` ${skinName}.${name}`);
                            dict.set(name, callback);
                            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Press, callback, undefined);
                        }
                    }
                } else {
                    group.setIsTouchEnabled(false);

                    if (window.CLIENT_VERSION === "DEVELOP") {
                        const dict = this._boundedGroupTouchCallbacks;
                        if (dict?.has(name)) {
                            group.getEventAgent().removePointerEventListener(Helpers_PointerInput.PointerEventType.Press, Helpers_Misc.getExisted(dict.get(name)), undefined);
                        } else {
                            throw Helpers_Misc.newError(`WTF? ${skinName}`);
                        }
                    }
                }
            }
        }
    }
}

function createTouchMask(): Ui_Interfaces_IUiContainer.IUiContainer {
    const mask  = new Ui_Components_UiContainer.UiContainer();
    const stage = Stages_StageManager.getStage();
    mask.setIsTouchEnabled(true);
    mask.setUnscaledManualWidth(stage.stageWidth);
    mask.setUnscaledManualHeight(stage.stageHeight);

    return mask;
}

async function showDefaultOpenAnimation(components: ComponentsForDefaultOpenAndCloseAnimation, animationType: number): Promise<void> {
    const { imgMask, group } = components;
    if (animationType === 1) {
        throw Helpers_Misc.newError("animationType 1 is no longer supported.");

        // resetTween({
        //     obj         : imgMask,
        //     beginProps  : { alpha: 0 },
        //     endProps    : { alpha: 1 },
        // });
        // resetTween({
        //     obj         : group,
        //     beginProps  : { alpha: 0, verticalCenter: -40 },
        //     endProps    : { alpha: 1, verticalCenter: 0 },
        // });

        // await TimerModel.wait(DefaultTweenTime);

    } else if (animationType === 2) {
        Tween_Executor.Executor.reset({
            obj        : imgMask,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });

        group.customScaleX  = 0.9;
        group.customScaleY  = 0.9;
        group.customAlpha   = 0;

        Tween_Executor.Executor.removeTweens(group);
        Tween_Executor.Executor.get(group).to({ customAlpha : 1 }, DefaultTweenTime);
        Tween_Executor.Executor.get(group)
            .to({ customScaleX : 1.05,   customScaleY : 1.05 },   DefaultTweenTime / 8 * 6)
            .to({ customScaleX : 1,      customScaleY : 1 },      DefaultTweenTime / 8 * 2);

        await Timer_TimerModel.wait(DefaultTweenTime);
    }
}

async function showDefaultCloseAnimation(components: ComponentsForDefaultOpenAndCloseAnimation, animationType: number): Promise<void> {
    const { imgMask, group } = components;
    if (animationType === 1) {
        throw Helpers_Misc.newError("animationType 1 is no longer supported.");

        // resetTween({
        //     obj         : imgMask,
        //     beginProps  : { alpha: 1 },
        //     endProps    : { alpha: 0 },
        // });
        // resetTween({
        //     obj         : group,
        //     beginProps  : { alpha: 1, verticalCenter: 0 },
        //     endProps    : { alpha: 0, verticalCenter: -40 },
        // });

        // await TimerModel.wait(DefaultTweenTime);

    } else if (animationType === 2) {
        Tween_Executor.Executor.reset({
            obj        : imgMask,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });

        group.customScaleX  = 1;
        group.customScaleY  = 1;
        group.customAlpha   = 1;

        Tween_Executor.Executor.removeTweens(group);
        Tween_Executor.Executor.get(group).to({ customAlpha : 0 }, DefaultTweenTime);
        Tween_Executor.Executor.get(group)
            .to({ customScaleX : 1.05,   customScaleY : 1.05 },   DefaultTweenTime / 8 * 2)
            .to({ customScaleX : 0.9,    customScaleY : 0.9 },    DefaultTweenTime / 8 * 6);

        await Timer_TimerModel.wait(DefaultTweenTime);
    }
}
