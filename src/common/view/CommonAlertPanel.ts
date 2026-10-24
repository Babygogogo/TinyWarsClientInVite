import * as LangConstants from "../../lang/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    getTitle    : () => string;
    getContent  : () => string;
    callback?   : () => any;
}
// eslint-disable-next-line no-shadow
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _scrContent!   : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _labelContent! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConfirm!   : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnConfirm, callback: this._onTouchedBtnClose },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setText(openData.getTitle());
        this._scrContent.scrollTop();

        const labelContent = this._labelContent;
        labelContent.setText(openData.getContent());

        this._group.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            rawValue    : labelContent.getScaledHeight() + 140,
            minValue    : 200,
            maxValue    : StagesConstants.Dimension.DesignMinHeight,
        }));
    }

    private _onTouchedBtnClose(): void {
        const callback = this.getOpenData()?.callback;
        (callback) && (callback());

        this.closePanel();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
    }
}
