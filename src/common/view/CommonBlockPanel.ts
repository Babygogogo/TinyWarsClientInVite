import { getValueInRange } from "../../numbers/Utils.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    title  : string;
    content: string;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _scrContent!   : IUiScroller<IUiContainer>;
    private readonly _labelContent! : IUiLabel;

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

        const groupHeight = getValueInRange({
            rawValue    : labelContent.getUnscaledHeight() + 80,
            minValue    : 140,
            maxValue    : Dimension.DesignMinHeight,
        });
        this._group.setUnscaledManualHeight(groupHeight);

        const scrContent = this._scrContent;
        scrContent.setUnscaledManualHeight(groupHeight - 80);
        scrContent.scrollTop();
    }
}
