import {
    Stages_Constants,
    Numbers_Utils,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScroller,
} from "../../internal.ts";

export interface OpenData {
    title  : string;
    content: string;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _scrContent!   : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _labelContent! : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._imgMask.setIsTouchEnabled(true);
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const labelContent = this._labelContent;
        labelContent.setText(openData.content);
        this._labelTitle.setText(openData.title);

        const groupHeight = Numbers_Utils.getValueInRange({
            rawValue : labelContent.getUnscaledHeight() + 80,
            minValue : 140,
            maxValue : Stages_Constants.Dimension.DesignMinHeight,
        });
        this._group.setUnscaledManualHeight(groupHeight);

        const scrContent = this._scrContent;
        scrContent.setUnscaledManualHeight(groupHeight - 80);
        scrContent.scrollTop();
    }
}
