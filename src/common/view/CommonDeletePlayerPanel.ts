import {
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScroller,
} from "../../internal.ts";

export type OpenData = {
    content     : string;
    callback    : (forbidReentrance: boolean) => any;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _scrContent!   : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _labelContent! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupForbidReentrance!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgForbidReentrance!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelForbidReentrance!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnCancel!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!   : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._groupForbidReentrance,  callback : this._onTouchedGroupForbidReentrance },
            { ui : this._btnCancel,              callback : this.closePanel },
            { ui : this._btnConfirm,             callback : this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",  callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        this._labelContent.setText(openData?.content ?? Lang_Constants.UndefinedError);

        this._scrContent.scrollTop();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupForbidReentrance(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

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
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0088);
        this._labelForbidReentrance.setLangText(Lang_Constants.TextType.B0916);
    }
}
