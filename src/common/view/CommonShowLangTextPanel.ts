import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText, getCurrentLanguageType, getSecondaryLanguageType, getLanguageTypeName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    getTitleText?   : () => string;
    textArray       : LanguageText[];
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _btnClose!             : IUiButton;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _labelTips!            : IUiLabel;

    private readonly _scrContent!           : IUiScroller<IUiContainer>;
    private readonly _labelTitle1!          : IUiLabel;
    private readonly _labelText1!           : IUiLabel;
    private readonly _labelTitle2!          : IUiLabel;
    private readonly _labelText2!           : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const getTitleText  = openData.getTitleText;
        const textArray     = openData.textArray;
        this._labelTitle.setText(getTitleText ? getTitleText() : getText(TextType.B1250));
        this._scrContent.scrollTop();

        const labelText1  = this._labelText1;
        labelText1.setText(getLanguageText({ textArray, languageType: getCurrentLanguageType(), useAlternate: false}) ?? `----`);
        labelText1.setY(this._labelTitle1.getScaledHeight() + 6);

        const labelTitle2 = this._labelTitle2;
        labelTitle2.setY(labelText1.getY() + labelText1.getScaledHeight() + 12);

        const labelText2  = this._labelText2;
        labelText2.setText(getLanguageText({ textArray, languageType: getSecondaryLanguageType(), useAlternate: false}) ?? `----`);
        labelText2.setY(labelTitle2.getY() + labelTitle2.getScaledHeight() + 6);

        const contentHeight     = labelText2.getY() + labelText2.getScaledHeight();
        const maxScrHeight      = Dimension.DesignMinHeight - 80;
        const scrContentHeight  = getValueInRange({
            rawValue    : contentHeight,
            minValue    : 100,
            maxValue    : maxScrHeight,
        });
        this._scrContent.setUnscaledManualHeight(scrContentHeight);
        this._group.setUnscaledManualHeight(scrContentHeight + 80);
        this._labelTips.setIsVisible(contentHeight > maxScrHeight);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle1.setText(getLanguageTypeName(getCurrentLanguageType()) ?? UndefinedError);
        this._labelTitle2.setText(getLanguageTypeName(getSecondaryLanguageType()) ?? UndefinedError);
        this._labelTips.setLangText(TextType.A0379);
    }
}
