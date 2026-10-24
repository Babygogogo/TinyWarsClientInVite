import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    getTitleText?   : () => string;
    textArray       : ProtoSchemaCommonProtoStructureLanguageText.LanguageText[];
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrContent!           : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _labelTitle1!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelText1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTitle2!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelText2!           : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setText(getTitleText ? getTitleText() : LangUtils.getText(LangConstants.TextType.B1250));
        this._scrContent.scrollTop();

        const labelText1  = this._labelText1;
        labelText1.setText(LangUtils.getLanguageText({ textArray, languageType: LangUtils.getCurrentLanguageType(), useAlternate: false}) ?? `----`);
        labelText1.setY(this._labelTitle1.getScaledHeight() + 6);

        const labelTitle2 = this._labelTitle2;
        labelTitle2.setY(labelText1.getY() + labelText1.getScaledHeight() + 12);

        const labelText2  = this._labelText2;
        labelText2.setText(LangUtils.getLanguageText({ textArray, languageType: LangUtils.getSecondaryLanguageType(), useAlternate: false}) ?? `----`);
        labelText2.setY(labelTitle2.getY() + labelTitle2.getScaledHeight() + 6);

        const contentHeight     = labelText2.getY() + labelText2.getScaledHeight();
        const maxScrHeight      = StagesConstants.Dimension.DesignMinHeight - 80;
        const scrContentHeight  = NumbersUtils.getValueInRange({
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
        this._labelTitle1.setText(LangUtils.getLanguageTypeName(LangUtils.getCurrentLanguageType()) ?? LangConstants.UndefinedError);
        this._labelTitle2.setText(LangUtils.getLanguageTypeName(LangUtils.getSecondaryLanguageType()) ?? LangConstants.UndefinedError);
        this._labelTips.setLangText(LangConstants.TextType.A0379);
    }
}
