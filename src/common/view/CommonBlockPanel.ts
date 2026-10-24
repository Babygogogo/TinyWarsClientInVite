import * as NumbersUtils from "../../numbers/Utils.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    title  : string;
    content: string;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _scrContent!   : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _labelContent! : UiInterfacesIUiLabel.IUiLabel;

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

        const groupHeight = NumbersUtils.getValueInRange({
            rawValue    : labelContent.getUnscaledHeight() + 80,
            minValue    : 140,
            maxValue    : StagesConstants.Dimension.DesignMinHeight,
        });
        this._group.setUnscaledManualHeight(groupHeight);

        const scrContent = this._scrContent;
        scrContent.setUnscaledManualHeight(groupHeight - 80);
        scrContent.scrollTop();
    }
}
