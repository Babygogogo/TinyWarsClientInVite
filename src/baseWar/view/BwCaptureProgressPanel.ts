import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiProgressBar } from "../../ui/interfaces/IUiProgressBar.ts";

export interface OpenData {
    maxValue        : number;
    currentValue    : number;
    newValue        : number;
    callbackOnFinish: () => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _group!        : IUiContainer;
    private readonly _pbarProgress! : IUiProgressBar;

    public updateOnLoadedSkin(): void {
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            Executor.removeTweens(this._pbarProgress);
            this.closePanel();
        });
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const oldOpenData = this.getPreviousOpenData();
        if (oldOpenData) {
            oldOpenData.callbackOnFinish();
        }

        const openData  = this.getOpenData();
        if (openData == null) {
            return;
        }
        const pbar      = this._pbarProgress;
        const newValue  = openData.newValue;
        const maxValue  = openData.maxValue;
        pbar.setEndValue(maxValue);
        pbar.setCurrentValue(openData.currentValue);

        Executor.removeTweens(pbar);
        Executor.get(pbar)
            .wait(250)
            .to({ currentValue: newValue }, 250)
            .wait(500)
            .call(() => {
                if (newValue >= maxValue) {
                    playShortSfx(ShortSfxCode.Capture);
                }
                this.closePanel();
            });
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._pbarProgress);
        this.getOpenData()?.callbackOnFinish();

        await super._onClosed();
    }
}
