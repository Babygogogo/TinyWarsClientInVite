import {
    Egret_Egret,
    Tween_Executor,
    Helpers_ImageSource,
    Lang_Utils,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiPanel,
} from "../../internal.ts";

export interface OpenData {
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    playerIndex         : number;
    teamIndex           : number;
    nickname            : string;
    coId                : number;
    unitAndTileSkinId   : number;
    callbackOnFinish    : () => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSkin!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo!            : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPlayerIndex! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNickname!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurnStart!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private _timeoutIdForClose  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._clearTimeoutForClose();
            this.closePanel();
        });
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const oldOpenData = this.getPreviousOpenData();
        if (oldOpenData) {
            oldOpenData.callbackOnFinish();
            this._resetTimeoutForClose();
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelPlayerIndex.setText(`${Lang_Utils.getPlayerForceName(openData.playerIndex)} (${Lang_Utils.getPlayerTeamName(openData.teamIndex)})`);
        this._labelNickname.setText(openData.nickname);
        this._labelTurnStart.setLangText(Lang_Constants.TextType.B0679);
        this._imgSkin.loadSource(Helpers_ImageSource.getCoHeadFrame(openData.unitAndTileSkinId));
        this._imgCo.loadSource(Helpers_ImageSource.getCoHead(openData.gameConfig, openData.coId) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }
    protected override async _onClosed(): Promise<void> {
        this._clearTimeoutForClose();
        this.getOpenData()?.callbackOnFinish();

        await super._onClosed();
    }

    private _resetTimeoutForClose(): void {
        this._clearTimeoutForClose();
        this._timeoutIdForClose = Egret_Egret.setTimeout(() => {
            this._clearTimeoutForClose();
            this.closePanel();
        }, null, 1500);
    }
    private _clearTimeoutForClose(): void {
        if (this._timeoutIdForClose != null) {
            Egret_Egret.clearTimeout(this._timeoutIdForClose);
            this._timeoutIdForClose = null;
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        this.setAlpha(0);
        Tween_Executor.Executor.get(this as Ui_Interfaces_IUiPanel.IUiPanel<OpenData>)
            .to({ customAlpha : 1 }, 150);

        await Timer_TimerModel.wait(250);

        this._resetTimeoutForClose();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.get(this as Ui_Interfaces_IUiPanel.IUiPanel<OpenData>)
            .to({ customAlpha : 0 }, 150);

        await Timer_TimerModel.wait(250);
    }
}
