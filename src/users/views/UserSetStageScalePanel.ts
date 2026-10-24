import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage from "../../localData/Storage.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as StagesStageManager from "../../stages/StageManager.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutContent!    : UiInterfacesIUiLayout.IUiLayout;

    private readonly _labelScaleTitle!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupScale!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgScaleBar!      : UiInterfacesIUiImage.IUiImage;
    private readonly _imgScalePoint!    : UiInterfacesIUiImage.IUiImage;
    private readonly _labelScale!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnDefault!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    private _prevScale                  : number | null = null;
    private _selectedScale              : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupScale,     callback: this._onTouchedGroupScale,    eventType: HelpersPointerInput.PointerEventType.Press },

            { ui: this._btnClose,       callback: this._onTouchedBtnClose },
            { ui: this._btnDefault,     callback: this._onTouchedBtnDefault },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => this._onTouchedPanelMask());
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        const scale         = StagesStageManager.getStageScale();
        this._prevScale     = scale;
        this._selectedScale = scale;

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupScale(e: VendorEgretEgret.Event): void {
        this._handleTouchGroupScale(e);
    }
    private _handleTouchGroupScale(e: VendorEgretEgret.Event): void {
        const group         = this._groupScale;
        const width         = group.getUnscaledWidth();
        const data          = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point         = group.globalToLocal(data.stageX, data.stageY);
        const scale         = Math.floor(Math.max(0, Math.min(point.x, width)) / width * (StagesConstants.Scale.MaxScale - StagesConstants.Scale.MinScale) + StagesConstants.Scale.MinScale);
        this._selectedScale = scale;
        StagesStageManager.setStageScale(scale);
        this._updateGroupScale();
    }

    private _onTouchedBtnClose(): void {
        StagesStageManager.setStageScale(this._prevScale || StagesConstants.Scale.MinScale);

        this.closePanel();
    }
    private _onTouchedBtnDefault(): void {
        this._selectedScale = StagesConstants.Scale.MinScale;
        StagesStageManager.setStageScale(StagesConstants.Scale.MinScale);

        this._updateView();
    }
    private _onTouchedBtnConfirm(): void {
        LocalDataStorage.setStageScale(this._selectedScale || StagesConstants.Scale.MinScale);

        this.closePanel();
    }
    private _onTouchedPanelMask(): void {
        StagesStageManager.setStageScale(this._prevScale || StagesConstants.Scale.MinScale);
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);

        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupScale();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0558));
        this._labelScaleTitle.setText(LangUtils.getText(LangConstants.TextType.B0559));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnDefault.setText(LangUtils.getText(LangConstants.TextType.B0543));
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0154));

        this._layoutContent.arrangeItems();
    }

    private _updateGroupScale(): void {
        const scale = this._selectedScale || StagesConstants.Scale.MinScale;
        const width = this._groupScale.getUnscaledWidth();
        const pos   = width * (scale - StagesConstants.Scale.MinScale) / (StagesConstants.Scale.MaxScale - StagesConstants.Scale.MinScale);
        this._imgScalePoint.setX(pos);
        this._imgScaleBar.setUnscaledManualWidth(pos);
        this._labelScale.setText(`${HelpersText.format("%.2f", 10000 / scale)}%`);
    }
}
