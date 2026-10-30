import {
    Stages_Constants,
    Lang_Utils,
    Numbers_Utils,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScroller,
} from "../../internal.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";

export interface OpenData {
    getTitleText?   : () => string;
    textArray       : LanguageText[];
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrContent!           : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _labelTitle1!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelText1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTitle2!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelText2!           : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setText(getTitleText ? getTitleText() : Lang_Utils.getText(Lang_Constants.TextType.B1250));
        this._scrContent.scrollTop();

        const labelText1  = this._labelText1;
        labelText1.setText(Lang_Utils.getLanguageText({ textArray, languageType: Lang_Utils.getCurrentLanguageType(), useAlternate: false}) ?? `----`);
        labelText1.setY(this._labelTitle1.getScaledHeight() + 6);

        const labelTitle2 = this._labelTitle2;
        labelTitle2.setY(labelText1.getY() + labelText1.getScaledHeight() + 12);

        const labelText2  = this._labelText2;
        labelText2.setText(Lang_Utils.getLanguageText({ textArray, languageType: Lang_Utils.getSecondaryLanguageType(), useAlternate: false}) ?? `----`);
        labelText2.setY(labelTitle2.getY() + labelTitle2.getScaledHeight() + 6);

        const contentHeight     = labelText2.getY() + labelText2.getScaledHeight();
        const maxScrHeight      = Stages_Constants.Dimension.DesignMinHeight - 80;
        const scrContentHeight  = Numbers_Utils.getValueInRange({
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
        this._labelTitle1.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getCurrentLanguageType()) ?? Lang_Constants.UndefinedError);
        this._labelTitle2.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getSecondaryLanguageType()) ?? Lang_Constants.UndefinedError);
        this._labelTips.setLangText(Lang_Constants.TextType.A0379);
    }
}
