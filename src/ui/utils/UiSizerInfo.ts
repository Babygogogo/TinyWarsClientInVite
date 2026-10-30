import type { IUiComponent } from "../interfaces/IUiComponent.ts";
import type { IUiSizerInfo } from "../interfaces/IUiSizerInfo.ts";
import { UiCommonEventType } from "../types/UiCommonEventType.ts";
import type { UiSizerOptions } from "../types/UiSizerOptions.ts";
import {
    checkAndAddAutoSizerInfo,
    addAutoSizerInfo,
} from "./UiSizerHelpers.ts";

export class UiSizerInfo implements IUiSizerInfo {
    private _target             : IUiComponent;
    private _isEnabled          = true;
    private _sizerOptions?      : UiSizerOptions;
    private _hasEverApplied     = false;

    public constructor(target: IUiComponent) {
        this._target = target;

        checkAndAddAutoSizerInfo(target, false);
        target.getEventAgent().addUiCommonEventListener(UiCommonEventType.AddedToParent, this._onAddedToParent, this);
    }

    private _onAddedToParent(): void {
        checkAndAddAutoSizerInfo(this._target, false);
    }

    public getSizer(): IUiComponent {
        return this._target;
    }

    public getIsEnabled(): boolean {
        return this._isEnabled;
    }
    public setIsEnabled(isEnabled: boolean): void {
        if (this.getIsEnabled() !== isEnabled) {
            this._isEnabled = isEnabled;

            if (isEnabled) {
                addAutoSizerInfo(this, false);
            }
        }
    }

    /** 如果需要修改sizerOptions，需要重新调用setSizerOptions()，以便自动sizer正常运作 */
    public getSizerOptions(): UiSizerOptions | undefined {
        return this._sizerOptions;
    }
    public setSizerOptions(options: UiSizerOptions | undefined): void {
        this._sizerOptions = options;
        this.setHasEverApplied(false);

        if (options != null) {
            addAutoSizerInfo(this, false);
        }
    }
    public addSizerOptions(options: UiSizerOptions): void {
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
        this._target.getEventAgent().removeUiCommonEventListener(UiCommonEventType.AddedToParent, this._onAddedToParent, this);
    }
}
