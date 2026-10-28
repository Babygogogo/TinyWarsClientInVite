import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";

export type OpenData = {
    content     : string;
    callback?   : () => any;
};
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
            { ui: this._btnClose,       callback: this._onTouchedBtnClose },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        this._labelTitle.setLangText(TextType.A0056);
        this._scrContent.scrollTop();

        const labelContent = this._labelContent;
        labelContent.setText(`${openData?.content}\n\n${getText(TextType.A0777)}`);
        this._updateLabelTips();

        this._group.setUnscaledManualHeight(getValueInRange({
            rawValue    : labelContent.getScaledHeight() + 130,
            minValue    : 200,
            maxValue    : Dimension.DesignMinHeight,
        }));
    }

    private _updateLabelTips(): void {
        const labelTips = this._labelTips;
        labelTips.setLangText(TextType.A0379);
        labelTips.setIsVisible(this._labelContent.getScaledHeight() > Dimension.DesignMinHeight - 130);
    }

    private _onTouchedBtnClose(): void {
        const openData = this.getOpenData();
        (openData?.callback) && (openData.callback());

        this.closePanel();
    }
}
