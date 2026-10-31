import {
    type Notifications_Mapping,
    Users_Model,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Users_Proxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";
import type { S as UserSetRelationResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserSetRelation/S.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupFollow!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgFollow!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelFollow!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupHelpFollow!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _groupBlock!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBlock!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelBlock!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupHelpBlock!   : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
            { type : "MsgUserSetRelation",  callback : this._onNotifyMsgUserSetRelation },
        ]);
        this._setUiListenerArray([
            { ui : this._groupFollow,            callback : this._onTouchedGroupFollow },
            { ui : this._groupHelpFollow,        callback : this._onTouchedGroupHelpFollow },
            { ui : this._groupBlock,             callback : this._onTouchedGroupBlock },
            { ui : this._groupHelpBlock,         callback : this._onTouchedGroupHelpBlock },
            { ui : this._btnConfirm,             callback : this._onTouchedBtnConfirm },
            { ui : this._btnClose,               callback : this.closePanel },
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
    private _onNotifyMsgUserSetRelation(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgUserSetRelation"]>): void {
        const data = (e.data as { msg: UserSetRelationResponse }).msg;
        if (data.getTargetUserId() === this.getOpenData()?.userId) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0377));
            this.closePanel();
        }
    }

    private _onTouchedGroupFollow(): void {
        const img = this._imgFollow;
        img.setIsVisible(!img.getIsVisible());
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupHelpFollow(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0999),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0375),
        });
    }
    private _onTouchedGroupBlock(): void {
        const img = this._imgBlock;
        img.setIsVisible(!img.getIsVisible());
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupHelpBlock(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B1000),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0376),
        });
    }
    private _onTouchedBtnConfirm(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const isFollow  = this._imgFollow.getIsVisible();
        const isBlock   = this._imgBlock.getIsVisible();
        if ((isFollow === Users_Model.checkIsFollowingUser(userId)) && (isBlock === Users_Model.checkIsBlockingUser(userId))) {
            this.closePanel();
        } else {
            Users_Proxy.reqUserSetRelation(userId, isFollow, isBlock);
        }
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const userId = this.getOpenData()?.userId;
        this._imgFollow.setIsVisible(Users_Model.checkIsFollowingUser(userId));
        this._imgBlock.setIsVisible(Users_Model.checkIsBlockingUser(userId));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1001);
        this._labelFollow.setLangText(Lang_Constants.TextType.B0999);
        this._labelBlock.setLangText(Lang_Constants.TextType.B1000);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnClose.setLangText(Lang_Constants.TextType.B0154);
    }
}

function applyTouchEnabled(container: Ui_Interfaces_IUiContainer.IUiContainer): void {
    container.setIsTouchEnabled(true);
    container.setIsTouchChildrenEnabled(false);
}
