import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiPanel from "../../ui/interfaces/IUiPanel.ts";
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    gameConfig          : GameConfigGcData.GcData;
    playerIndex         : number;
    teamIndex           : number;
    nickname            : string;
    coId                : number;
    unitAndTileSkinId   : number;
    callbackOnFinish    : () => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSkin!          : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCo!            : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPlayerIndex! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNickname!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTurnStart!   : UiInterfacesIUiLabel.IUiLabel;

    private _timeoutIdForClose  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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

        this._labelPlayerIndex.setText(`${LangUtils.getPlayerForceName(openData.playerIndex)} (${LangUtils.getPlayerTeamName(openData.teamIndex)})`);
        this._labelNickname.setText(openData.nickname);
        this._labelTurnStart.setText(LangUtils.getText(LangConstants.TextType.B0679));
        this._imgSkin.loadSource(HelpersImageSource.getCoHeadFrame(openData.unitAndTileSkinId));
        this._imgCo.loadSource(HelpersImageSource.getCoHead(openData.gameConfig, openData.coId) ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
    }
    protected override async _onClosed(): Promise<void> {
        this._clearTimeoutForClose();
        this.getOpenData()?.callbackOnFinish();

        await super._onClosed();
    }

    private _resetTimeoutForClose(): void {
        this._clearTimeoutForClose();
        this._timeoutIdForClose = VendorEgretEgret.setTimeout(() => {
            this._clearTimeoutForClose();
            this.closePanel();
        }, null, 1500);
    }
    private _clearTimeoutForClose(): void {
        if (this._timeoutIdForClose != null) {
            VendorEgretEgret.clearTimeout(this._timeoutIdForClose);
            this._timeoutIdForClose = null;
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        this.setAlpha(0);
        TweenExecutor.Executor.get(this as UiInterfacesIUiPanel.IUiPanel<OpenData>)
            .to({ customAlpha: 1 }, 150);

        await TimerTimerModel.wait(250);

        this._resetTimeoutForClose();
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.get(this as UiInterfacesIUiPanel.IUiPanel<OpenData>)
            .to({ customAlpha: 0 }, 150);

        await TimerTimerModel.wait(250);
    }
}
