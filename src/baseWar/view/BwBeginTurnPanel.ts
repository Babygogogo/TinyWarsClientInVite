import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import {
    getCoHeadFrame,
    getCoHead,
} from "../../helpers/ImageSource.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getPlayerForceName,
    getPlayerTeamName,
} from "../../lang/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiPanel } from "../../ui/interfaces/IUiPanel.ts";
import {
    setTimeout,
    clearTimeout,
} from "../../vendor/egret/Egret.ts";

export interface OpenData {
    gameConfig          : GameConfig;
    playerIndex         : number;
    teamIndex           : number;
    nickname            : string;
    coId                : number;
    unitAndTileSkinId   : number;
    callbackOnFinish    : () => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _group!            : IUiContainer;
    private readonly _imgSkin!          : IUiImage;
    private readonly _imgCo!            : IUiImage;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelPlayerIndex! : IUiLabel;
    private readonly _labelNickname!    : IUiLabel;
    private readonly _labelTurnStart!   : IUiLabel;

    private _timeoutIdForClose  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
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

        this._labelPlayerIndex.setText(`${getPlayerForceName(openData.playerIndex)} (${getPlayerTeamName(openData.teamIndex)})`);
        this._labelNickname.setText(openData.nickname);
        this._labelTurnStart.setLangText(TextType.B0679);
        this._imgSkin.loadSource(getCoHeadFrame(openData.unitAndTileSkinId));
        this._imgCo.loadSource(getCoHead(openData.gameConfig, openData.coId) ?? UndefinedError);
        this._layoutName.arrangeItems();
    }
    protected override async _onClosed(): Promise<void> {
        this._clearTimeoutForClose();
        this.getOpenData()?.callbackOnFinish();

        await super._onClosed();
    }

    private _resetTimeoutForClose(): void {
        this._clearTimeoutForClose();
        this._timeoutIdForClose = setTimeout(() => {
            this._clearTimeoutForClose();
            this.closePanel();
        }, null, 1500);
    }
    private _clearTimeoutForClose(): void {
        if (this._timeoutIdForClose != null) {
            clearTimeout(this._timeoutIdForClose);
            this._timeoutIdForClose = null;
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        this.setAlpha(0);
        Executor.get(this as IUiPanel<OpenData>)
            .to({ customAlpha: 1 }, 150);

        await wait(250);

        this._resetTimeoutForClose();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.get(this as IUiPanel<OpenData>)
            .to({ customAlpha: 0 }, 150);

        await wait(250);
    }
}
