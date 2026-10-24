import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";

export type OpenData = {
    content     : string;
    callback    : (forbidReentrance: boolean) => any;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;

    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _scrContent!   : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _labelContent! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;

    private readonly _groupForbidReentrance!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgForbidReentrance!      : UiInterfacesIUiImage.IUiImage;
    private readonly _labelForbidReentrance!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnCancel!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!   : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._groupForbidReentrance,  callback: this._onTouchedGroupForbidReentrance },
            { ui: this._btnCancel,              callback: this.closePanel, },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm, },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        this._labelContent.setText(openData?.content ?? LangConstants.UndefinedError);

        this._scrContent.scrollTop();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupForbidReentrance(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const img = this._imgForbidReentrance;
        img.setIsVisible(!img.getIsVisible());
    }

    private _onTouchedBtnConfirm(): void {
        const callback          = this.getOpenData()?.callback;
        const forbidReentrance  = this._imgForbidReentrance.getIsVisible();
        this.closePanel();
        (callback) && (callback(forbidReentrance));
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0088));
        this._labelForbidReentrance.setText(LangUtils.getText(LangConstants.TextType.B0916));
    }
}
