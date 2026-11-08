import {
    Tween_Executor,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiProgressBar,
} from "../../internal.ts";

export interface OpenData {
    maxValue        : number;
    currentValue    : number;
    newValue        : number;
    callbackOnFinish: () => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _pbarProgress! : Ui_Interfaces_IUiProgressBar.IUiProgressBar;

    public updateOnLoadedSkin(): void {
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            Tween_Executor.Executor.removeTweens(this._pbarProgress);
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

        Tween_Executor.Executor.removeTweens(pbar);
        Tween_Executor.Executor.get(pbar)
            .wait(250)
            .to({ currentValue : newValue }, 250)
            .wait(500)
            .call(() => {
                if (newValue >= maxValue) {
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Capture);
                }
                this.closePanel();
            });
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._pbarProgress);
        this.getOpenData()?.callbackOnFinish();

        await super._onClosed();
    }
}
