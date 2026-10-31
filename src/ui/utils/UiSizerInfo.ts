import {
    Ui_Utils_UiSizerHelpers,
    Ui_Types_UiCommonEventType,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiSizerInfo,
    type Ui_Types_UiSizerOptions,
} from "../../internal.ts";

export class UiSizerInfo implements Ui_Interfaces_IUiSizerInfo.IUiSizerInfo {
    private readonly _target             : Ui_Interfaces_IUiComponent.IUiComponent;
    private _isEnabled          = true;
    private _sizerOptions?      : Ui_Types_UiSizerOptions.UiSizerOptions;
    private _hasEverApplied     = false;

    public constructor(target: Ui_Interfaces_IUiComponent.IUiComponent) {
        this._target = target;

        Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(target, false);
        target.getEventAgent().addUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.AddedToParent, this._onAddedToParent, this);
    }

    private _onAddedToParent(): void {
        Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this._target, false);
    }

    public getSizer(): Ui_Interfaces_IUiComponent.IUiComponent {
        return this._target;
    }

    public getIsEnabled(): boolean {
        return this._isEnabled;
    }
    public setIsEnabled(isEnabled: boolean): void {
        if (this.getIsEnabled() !== isEnabled) {
            this._isEnabled = isEnabled;

            if (isEnabled) {
                Ui_Utils_UiSizerHelpers.addAutoSizerInfo(this, false);
            }
        }
    }

    /** 如果需要修改sizerOptions，需要重新调用setSizerOptions()，以便自动sizer正常运作 */
    public getSizerOptions(): Ui_Types_UiSizerOptions.UiSizerOptions | undefined {
        return this._sizerOptions;
    }
    public setSizerOptions(options: Ui_Types_UiSizerOptions.UiSizerOptions | undefined): void {
        this._sizerOptions = options;
        this.setHasEverApplied(false);

        if (options != null) {
            Ui_Utils_UiSizerHelpers.addAutoSizerInfo(this, false);
        }
    }
    public addSizerOptions(options: Ui_Types_UiSizerOptions.UiSizerOptions): void {
        const oldOptions = this.getSizerOptions() ?? {};

        {
            const width = options.width;
            if (width) {
                {
                    const extension = width.extension;
                    (extension != null) && ((oldOptions.width ??= {}).extension = extension);
                }
                {
                    const maxValue = width.maxValue;
                    (maxValue != null) && ((oldOptions.width ??= {}).maxValue = maxValue);
                }
                {
                    const minValue = width.minValue;
                    (minValue != null) && ((oldOptions.width ??= {}).minValue = minValue);
                }
                {
                    const percentage = width.percentage;
                    (percentage != null) && ((oldOptions.width ??= {}).percentage = percentage);
                }
            }
        }
        {
            const height = options.height;
            if (height) {
                {
                    const extension = height.extension;
                    (extension != null) && ((oldOptions.height ??= {}).extension = extension);
                }
                {
                    const maxValue = height.maxValue;
                    (maxValue != null) && ((oldOptions.height ??= {}).maxValue = maxValue);
                }
                {
                    const minValue = height.minValue;
                    (minValue != null) && ((oldOptions.height ??= {}).minValue = minValue);
                }
                {
                    const percentage = height.percentage;
                    (percentage != null) && ((oldOptions.height ??= {}).percentage = percentage);
                }
            }
        }
        {
            const horizontalAlign = options.horizontalAlign;
            if (horizontalAlign) {
                {
                    const align = horizontalAlign.align;
                    (align != null) && ((oldOptions.horizontalAlign ??= {}).align = align);
                }
                {
                    const offset = horizontalAlign.offset;
                    (offset != null) && ((oldOptions.horizontalAlign ??= {}).offset = offset);
                }
            }
        }
        {
            const verticalAlign = options.verticalAlign;
            if (verticalAlign) {
                {
                    const align = verticalAlign.align;
                    (align != null) && ((oldOptions.verticalAlign ??= {}).align = align);
                }
                {
                    const offset = verticalAlign.offset;
                    (offset != null) && ((oldOptions.verticalAlign ??= {}).offset = offset);
                }
            }
        }

        this.setSizerOptions(oldOptions);
    }

    public getHasEverApplied(): boolean {
        return this._hasEverApplied;
    }
    public setHasEverApplied(hasEverApplied: boolean): void {
        this._hasEverApplied = hasEverApplied;
    }

    public destroy(): void {
        this.setIsEnabled(false);
        this._target.getEventAgent().removeUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.AddedToParent, this._onAddedToParent, this);
    }
}
