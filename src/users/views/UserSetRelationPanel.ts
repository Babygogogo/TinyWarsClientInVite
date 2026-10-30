import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as UserSetRelationResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserSetRelation/S.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import {
    checkIsFollowingUser,
    checkIsBlockingUser,
} from "../Model.ts";
import { reqUserSetRelation } from "../Proxy.ts";
import type { Event } from "../../egret/Egret.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _groupFollow!      : IUiContainer;
    private readonly _imgFollow!        : IUiImage;
    private readonly _labelFollow!      : IUiLabel;
    private readonly _groupHelpFollow!  : IUiContainer;

    private readonly _groupBlock!       : IUiContainer;
    private readonly _imgBlock!         : IUiImage;
    private readonly _labelBlock!       : IUiLabel;
    private readonly _groupHelpBlock!   : IUiContainer;

    private readonly _btnConfirm!       : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserSetRelation,  callback: this._onNotifyMsgUserSetRelation },
        ]);
        this._setUiListenerArray([
            { ui: this._groupFollow,            callback: this._onTouchedGroupFollow },
            { ui: this._groupHelpFollow,        callback: this._onTouchedGroupHelpFollow },
            { ui: this._groupBlock,             callback: this._onTouchedGroupBlock },
            { ui: this._groupHelpBlock,         callback: this._onTouchedGroupHelpBlock },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,               callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        applyTouchEnabled(this._groupHelpBlock);
        applyTouchEnabled(this._groupHelpFollow);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserSetRelation(e: Event): void {
        const data = e.data as UserSetRelationResponse;
        if (data.getTargetUserId() === this.getOpenData()?.userId) {
            show(getText(TextType.A0377));
            this.closePanel();
        }
    }

    private _onTouchedGroupFollow(): void {
        const img = this._imgFollow;
        img.setIsVisible(!img.getIsVisible());
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupHelpFollow(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.B0999),
            getContent : () => getText(TextType.A0375),
        });
    }
    private _onTouchedGroupBlock(): void {
        const img = this._imgBlock;
        img.setIsVisible(!img.getIsVisible());
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupHelpBlock(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.B1000),
            getContent : () => getText(TextType.A0376),
        });
    }
    private _onTouchedBtnConfirm(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const isFollow  = this._imgFollow.getIsVisible();
        const isBlock   = this._imgBlock.getIsVisible();
        if ((isFollow === checkIsFollowingUser(userId)) && (isBlock === checkIsBlockingUser(userId))) {
            this.closePanel();
        } else {
            reqUserSetRelation(userId, isFollow, isBlock);
        }
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const userId = this.getOpenData()?.userId;
        this._imgFollow.setIsVisible(checkIsFollowingUser(userId));
        this._imgBlock.setIsVisible(checkIsBlockingUser(userId));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1001);
        this._labelFollow.setLangText(TextType.B0999);
        this._labelBlock.setLangText(TextType.B1000);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnClose.setLangText(TextType.B0154);
    }
}

function applyTouchEnabled(container: IUiContainer): void {
    container.setIsTouchEnabled(true);
    container.setIsTouchChildrenEnabled(false);
}
