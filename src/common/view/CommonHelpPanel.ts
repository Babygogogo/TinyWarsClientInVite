import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    getTitle?   : () => string;
    getContent  : () => string;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _btnClose!     : IUiButton;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _scrContent!   : IUiScroller<IUiContainer>;
    private readonly _labelContent! : IUiLabel;
    private readonly _labelTips!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        this._labelTitle.setText(openData?.getTitle?.() ?? getText(TextType.B0143));
        this._scrContent.scrollTop();

        const labelContent = this._labelContent;
        labelContent.setText(openData?.getContent() ?? UndefinedError);
        this._updateLabelTips();

        this._group.setUnscaledManualHeight(getValueInRange({
            rawValue    : labelContent.getScaledHeight() + 80,
            maxValue    : Dimension.DesignMinHeight,
            minValue    : 140,
        }));
    }

    private _updateLabelTips(): void {
        const labelTips = this._labelTips;
        labelTips.setText(getText(TextType.A0379));
        labelTips.setIsVisible(this._labelContent.getScaledHeight() >= Dimension.DesignMinHeight - 80);
    }
}
