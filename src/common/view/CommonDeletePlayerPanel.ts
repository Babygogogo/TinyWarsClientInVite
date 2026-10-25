import { UndefinedError, TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";

export type OpenData = {
    content     : string;
    callback    : (forbidReentrance: boolean) => any;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;

    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _scrContent!   : IUiScroller<IUiContainer>;
    private readonly _labelContent! : IUiLabel;
    private readonly _btnClose!     : IUiButton;

    private readonly _groupForbidReentrance!    : IUiContainer;
    private readonly _imgForbidReentrance!      : IUiImage;
    private readonly _labelForbidReentrance!    : IUiLabel;

    private readonly _btnCancel!    : IUiButton;
    private readonly _btnConfirm!   : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._groupForbidReentrance,  callback: this._onTouchedGroupForbidReentrance },
            { ui: this._btnCancel,              callback: this.closePanel, },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm, },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        this._labelContent.setText(openData?.content ?? UndefinedError);

        this._scrContent.scrollTop();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupForbidReentrance(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

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
        this._btnConfirm.setText(getText(TextType.B0026));
        this._btnCancel.setText(getText(TextType.B0154));
        this._labelTitle.setText(getText(TextType.B0088));
        this._labelForbidReentrance.setText(getText(TextType.B0916));
    }
}
