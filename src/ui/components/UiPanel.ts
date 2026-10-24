import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import type * as GamePanelsTypes from "../../gamePanels/Types.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as KeyboardKbManager from "../../keyboard/KbManager.ts";
import * as KeyboardKbTypes from "../../keyboard/KbTypes.ts";
import * as Logger2 from "../../Logger.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesStageManager from "../../stages/StageManager.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiOpenableComponent from "./UiOpenableComponent.ts";
import type * as UiInterfacesIUiContainer from "../interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../interfaces/IUiImage.ts";
import type * as UiInterfacesIUiPanel from "../interfaces/IUiPanel.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

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
const DefaultTweenTime = GraphicsConstants.Tween.DefaultDuration;

interface ComponentsForDefaultOpenAndCloseAnimation {
    imgMask : UiInterfacesIUiImage.IUiImage;
    group   : UiInterfacesIUiContainer.IUiContainer;
}



type PanelConfig<T> = GamePanelsTypes.PanelConfig<T>;

export abstract class UiPanel<OpenData> extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> implements UiInterfacesIUiPanel.IUiPanel<OpenData> {
    private _panelConfig?                               : PanelConfig<OpenData>;
    private _boundedGroupTouchCallbacks?                : Map<string, () => void>;

    private _isTouchMaskEnabled                         = false;
    private _isCloseOnTouchedMask                       = false;
    private _callbackOnTouchedMask?                     : () => void;
    private _touchMask?                                 : UiInterfacesIUiContainer.IUiContainer;

    private _componentsForDefaultOpenAndCloseAnimation? : ComponentsForDefaultOpenAndCloseAnimation;
    private _defaultOpenAndCloseAnimationType           = 1;
    private _isShowingCloseAnimation                    = false;

    private _shouldListenKeyEscape                      = false;
    private _callbackOnKeyEscape?                       : () => void;

    public setPanelConfig(config: PanelConfig<OpenData>): void {
        this._panelConfig = config;
    }
    public getPanelConfig(): PanelConfig<OpenData> {
        return HelpersMisc.getExisted(this._panelConfig);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for open self.
    ////////////////////////////////////////////////////////////////////////////////
    protected override async _onOpened(): Promise<void> {
        const touchMask = createTouchMask();
        this.addChild(touchMask as unknown as VendorEgretEgret.DisplayObject);

        const stage = StagesStageManager.getStage();
        this.resize(stage.stageWidth, stage.stageHeight);
        this._resetSoundForCommonButtons();
        this._resetInteractiveForGroup(true);

        await (this._componentsForDefaultOpenAndCloseAnimation
            ? showDefaultOpenAnimation(this._componentsForDefaultOpenAndCloseAnimation, this._defaultOpenAndCloseAnimationType)
            : this._showOpenAnimation()
        );

        if (this._shouldListenKeyEscape) {
            KeyboardKbManager.addListener(this._onKeyEscape, this);
        }
        this.removeChild(touchMask as unknown as VendorEgretEgret.DisplayObject);
    }

    protected async _showOpenAnimation(): Promise<void> {
        // to be overridden
    }

    protected _enableDefaultOpenAndCloseAnimation(imgMask: UiInterfacesIUiImage.IUiImage, group: UiInterfacesIUiContainer.IUiContainer, animationType = 1): void {
        this._componentsForDefaultOpenAndCloseAnimation = { imgMask: imgMask, group: group };
        this._defaultOpenAndCloseAnimationType          = animationType;
    }
    protected _disableDefaultOpenAndCloseAnimation(): void {
        delete this._componentsForDefaultOpenAndCloseAnimation;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for close self.
    ////////////////////////////////////////////////////////////////////////////////
    public closePanel(): void {
        GamePanelsManager.closePanel(this.getPanelConfig());
    }

    protected override async _onClosed(): Promise<void> {
        const touchMask = createTouchMask();
        this.addChild(touchMask as unknown as VendorEgretEgret.DisplayObject);

        KeyboardKbManager.deleteListener(this._onKeyEscape, this);

        this._setIsShowingCloseAnimation(true);
        await (this._componentsForDefaultOpenAndCloseAnimation
            ? showDefaultCloseAnimation(this._componentsForDefaultOpenAndCloseAnimation, this._defaultOpenAndCloseAnimationType)
            : this._showCloseAnimation()
        );
        this._setIsShowingCloseAnimation(false);

        this.removeChild(touchMask as unknown as VendorEgretEgret.DisplayObject);
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
                this.removeChild(mask as unknown as VendorEgretEgret.DisplayObject);
            }

        } else {
            if (!this._touchMask) {
                const newMask = createTouchMask();
                // newMask.on(UiEventTypePointerTap, this._onTouchedTouchMask, this);
                newMask.getEventAgent().addPointerEventListener(HelpersPointerInput.PointerEventType.Tap, this._onTouchedTouchMask, this);
                this._touchMask = newMask;
            }
            this.addChildAt(this._touchMask as unknown as VendorEgretEgret.DisplayObject, 0);
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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
    private _onKeyEscape(data: KeyboardKbTypes.EventData): void {
        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        if (data.newKeys.has(KeyboardKbTypes.KeyCode.Escape)) {
            if (this._callbackOnKeyEscape) {
                this._callbackOnKeyEscape();
            } else {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
                this.closePanel();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Utils.
    ////////////////////////////////////////////////////////////////////////////////
    private _resetSoundForCommonButtons(): void {
        const buttonClass = UiUtilsUiFactory.getUiButtonClass();
        for (const name of NAMES_FOR_BUTTON_CLOSE) {
            const btn = (this as any)[name];
            if (btn instanceof buttonClass) {
                btn.setShortSfxCode(SoundsConstants.ShortSfxCode.ButtonCancel01);
            }
        }
        for (const name of NAMES_FOR_BUTTON_CONFIRM) {
            const btn = (this as any)[name];
            if (btn instanceof buttonClass) {
                btn.setShortSfxCode(SoundsConstants.ShortSfxCode.ButtonConfirm01);
            }
        }
    }
    private _resetInteractiveForGroup(on: boolean): void {
        const skinName = this._panelConfig?.skinName;
        for (const name of NAMES_FOR_GROUP) {
            const group = (this as any)[name];
            if (group instanceof UiUtilsUiFactory.getUiContainerClass()) {
                if (on) {
                    group.setIsTouchEnabled(true);

                    if (window.CLIENT_VERSION === "DEVELOP") {
                        const agent = group.getEventAgent();
                        const dict  = this._boundedGroupTouchCallbacks ??= new Map();
                        if (dict.has(name)) {
                            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.Press, HelpersMisc.getExisted(dict.get(name)), undefined);
                        } else {
                            const callback = (): void => Logger2.log(`%cPanel pointer down:`, `background:#aaaaff;`, ` ${skinName}.${name}`);
                            dict.set(name, callback);
                            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.Press, callback, undefined);
                        }
                    }
                } else {
                    group.setIsTouchEnabled(false);

                    if (window.CLIENT_VERSION === "DEVELOP") {
                        const dict = this._boundedGroupTouchCallbacks;
                        if (dict?.has(name)) {
                            group.getEventAgent().removePointerEventListener(HelpersPointerInput.PointerEventType.Press, HelpersMisc.getExisted(dict.get(name)), undefined);
                        } else {
                            throw HelpersMisc.newError(`WTF? ${skinName}`);
                        }
                    }
                }
            }
        }
    }
}

function createTouchMask(): UiInterfacesIUiContainer.IUiContainer {
    const mask  = new (UiUtilsUiFactory.getUiContainerClass())();
    const stage = StagesStageManager.getStage();
    mask.setIsTouchEnabled(true);
    mask.setUnscaledManualWidth(stage.stageWidth);
    mask.setUnscaledManualHeight(stage.stageHeight);

    return mask;
}

async function showDefaultOpenAnimation(components: ComponentsForDefaultOpenAndCloseAnimation, animationType: number): Promise<void> {
    const { imgMask, group } = components;
    if (animationType === 1) {
        throw HelpersMisc.newError("animationType 1 is no longer supported.");

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
        TweenExecutor.Executor.reset({
            obj         : imgMask,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });

        group.customScaleX  = 0.9;
        group.customScaleY  = 0.9;
        group.customAlpha   = 0;

        TweenExecutor.Executor.removeTweens(group);
        TweenExecutor.Executor.get(group).to({ customAlpha: 1 }, DefaultTweenTime);
        TweenExecutor.Executor.get(group)
            .to({ customScaleX: 1.05,   customScaleY: 1.05 },   DefaultTweenTime / 8 * 6)
            .to({ customScaleX: 1,      customScaleY: 1 },      DefaultTweenTime / 8 * 2);

        await TimerTimerModel.wait(DefaultTweenTime);
    }
}

async function showDefaultCloseAnimation(components: ComponentsForDefaultOpenAndCloseAnimation, animationType: number): Promise<void> {
    const { imgMask, group } = components;
    if (animationType === 1) {
        throw HelpersMisc.newError("animationType 1 is no longer supported.");

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
        TweenExecutor.Executor.reset({
            obj         : imgMask,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        group.customScaleX  = 1;
        group.customScaleY  = 1;
        group.customAlpha   = 1;

        TweenExecutor.Executor.removeTweens(group);
        TweenExecutor.Executor.get(group).to({ customAlpha: 0 }, DefaultTweenTime);
        TweenExecutor.Executor.get(group)
            .to({ customScaleX: 1.05,   customScaleY: 1.05 },   DefaultTweenTime / 8 * 2)
            .to({ customScaleX: 0.9,    customScaleY: 0.9 },    DefaultTweenTime / 8 * 6);

        await TimerTimerModel.wait(DefaultTweenTime);
    }
}
