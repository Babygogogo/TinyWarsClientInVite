import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";

export type OpenData = {
    content     : string;
    callback?   : () => any;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _scrContent!   : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _labelContent! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips!    : UiInterfacesIUiLabel.IUiLabel;

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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.A0056));
        this._scrContent.scrollTop();

        const labelContent = this._labelContent;
        labelContent.setText(`${openData?.content}\n\n${LangUtils.getText(LangConstants.TextType.A0777)}`);
        this._updateLabelTips();

        this._group.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            rawValue    : labelContent.getScaledHeight() + 130,
            minValue    : 200,
            maxValue    : StagesConstants.Dimension.DesignMinHeight,
        }));
    }

    private _updateLabelTips(): void {
        const labelTips = this._labelTips;
        labelTips.setText(LangUtils.getText(LangConstants.TextType.A0379));
        labelTips.setIsVisible(this._labelContent.getScaledHeight() > StagesConstants.Dimension.DesignMinHeight - 130);
    }

    private _onTouchedBtnClose(): void {
        const openData = this.getOpenData();
        (openData?.callback) && (openData.callback());

        this.closePanel();
    }
}
