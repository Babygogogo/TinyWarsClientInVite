import {
    Stages_Constants,
    Lang_Utils,
    Numbers_Utils,
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
    callback?   : () => any;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _scrContent!   : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _labelContent! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this._onTouchedBtnClose },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        this._labelTitle.setLangText(Lang_Constants.TextType.A0056);
        this._scrContent.scrollTop();

        const labelContent = this._labelContent;
        labelContent.setText(`${openData?.content}\n\n${Lang_Utils.getText(Lang_Constants.TextType.A0777)}`);
        this._updateLabelTips();

        this._group.setUnscaledManualHeight(Numbers_Utils.getValueInRange({
            rawValue    : labelContent.getScaledHeight() + 130,
            minValue    : 200,
            maxValue    : Stages_Constants.Dimension.DesignMinHeight,
        }));
    }

    private _updateLabelTips(): void {
        const labelTips = this._labelTips;
        labelTips.setLangText(Lang_Constants.TextType.A0379);
        labelTips.setIsVisible(this._labelContent.getScaledHeight() > Stages_Constants.Dimension.DesignMinHeight - 130);
    }

    private _onTouchedBtnClose(): void {
        const openData = this.getOpenData();
        (openData?.callback) && (openData.callback());

        this.closePanel();
    }
}
