import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS from "../../proto/schema/CommonProto/NetMessage/MsgUserSetRelation/S.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _groupFollow!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgFollow!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelFollow!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupHelpFollow!  : UiInterfacesIUiContainer.IUiContainer;

    private readonly _groupBlock!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBlock!         : UiInterfacesIUiImage.IUiImage;
    private readonly _labelBlock!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupHelpBlock!   : UiInterfacesIUiContainer.IUiContainer;

    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserSetRelation,  callback: this._onNotifyMsgUserSetRelation },
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
    private _onNotifyMsgUserSetRelation(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS.S;
        if (data.getTargetUserId() === this.getOpenData()?.userId) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0377));
            this.closePanel();
        }
    }

    private _onTouchedGroupFollow(): void {
        const img = this._imgFollow;
        img.setIsVisible(!img.getIsVisible());
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupHelpFollow(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0999),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0375),
        });
    }
    private _onTouchedGroupBlock(): void {
        const img = this._imgBlock;
        img.setIsVisible(!img.getIsVisible());
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupHelpBlock(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B1000),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0376),
        });
    }
    private _onTouchedBtnConfirm(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const isFollow  = this._imgFollow.getIsVisible();
        const isBlock   = this._imgBlock.getIsVisible();
        if ((isFollow === UsersModel.checkIsFollowingUser(userId)) && (isBlock === UsersModel.checkIsBlockingUser(userId))) {
            this.closePanel();
        } else {
            UsersProxy.reqUserSetRelation(userId, isFollow, isBlock);
        }
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const userId = this.getOpenData()?.userId;
        this._imgFollow.setIsVisible(UsersModel.checkIsFollowingUser(userId));
        this._imgBlock.setIsVisible(UsersModel.checkIsBlockingUser(userId));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1001));
        this._labelFollow.setText(LangUtils.getText(LangConstants.TextType.B0999));
        this._labelBlock.setText(LangUtils.getText(LangConstants.TextType.B1000));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0154));
    }
}

function applyTouchEnabled(container: UiInterfacesIUiContainer.IUiContainer): void {
    container.setIsTouchEnabled(true);
    container.setIsTouchChildrenEnabled(false);
}
