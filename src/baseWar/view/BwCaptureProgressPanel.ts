import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiProgressBar from "../../ui/interfaces/IUiProgressBar.ts";

export interface OpenData {
    maxValue        : number;
    currentValue    : number;
    newValue        : number;
    callbackOnFinish: () => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _pbarProgress! : UiInterfacesIUiProgressBar.IUiProgressBar;

    public updateOnLoadedSkin(): void {
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            TweenExecutor.Executor.removeTweens(this._pbarProgress);
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

        TweenExecutor.Executor.removeTweens(pbar);
        TweenExecutor.Executor.get(pbar)
            .wait(250)
            .to({ currentValue: newValue }, 250)
            .wait(500)
            .call(() => {
                if (newValue >= maxValue) {
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Capture);
                }
                this.closePanel();
            });
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._pbarProgress);
        this.getOpenData()?.callbackOnFinish();

        await super._onClosed();
    }
}
