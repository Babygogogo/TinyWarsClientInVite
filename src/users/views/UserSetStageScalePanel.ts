import {
    Helpers_Text,
    Stages_StageManager,
    Sounds_SoundPlayer,
    Helpers_PointerInput,
    Stages_Constants,
    LocalData_Storage,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutContent!    : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _labelScaleTitle!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupScale!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgScaleBar!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgScalePoint!    : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelScale!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnDefault!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    private _prevScale                  : number | null = null;
    private _selectedScale              : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupScale,     callback: this._onTouchedGroupScale,    eventType: Helpers_PointerInput.PointerEventType.Press },

            { ui: this._btnClose,       callback: this._onTouchedBtnClose },
            { ui: this._btnDefault,     callback: this._onTouchedBtnDefault },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => this._onTouchedPanelMask());
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        const scale         = Stages_StageManager.getStageScale();
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

    private _onTouchedGroupScale(e: Egret_Egret.Event): void {
        this._handleTouchGroupScale(e);
    }
    private _handleTouchGroupScale(e: Egret_Egret.Event): void {
        const group         = this._groupScale;
        const width         = group.getUnscaledWidth();
        const data          = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const point         = group.globalToLocal(data.stageX, data.stageY);
        const scale         = Math.floor(Math.max(0, Math.min(point.x, width)) / width * (Stages_Constants.Scale.MaxScale - Stages_Constants.Scale.MinScale) + Stages_Constants.Scale.MinScale);
        this._selectedScale = scale;
        Stages_StageManager.setStageScale(scale);
        this._updateGroupScale();
    }

    private _onTouchedBtnClose(): void {
        Stages_StageManager.setStageScale(this._prevScale || Stages_Constants.Scale.MinScale);

        this.closePanel();
    }
    private _onTouchedBtnDefault(): void {
        this._selectedScale = Stages_Constants.Scale.MinScale;
        Stages_StageManager.setStageScale(Stages_Constants.Scale.MinScale);

        this._updateView();
    }
    private _onTouchedBtnConfirm(): void {
        LocalData_Storage.setStageScale(this._selectedScale || Stages_Constants.Scale.MinScale);

        this.closePanel();
    }
    private _onTouchedPanelMask(): void {
        Stages_StageManager.setStageScale(this._prevScale || Stages_Constants.Scale.MinScale);
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);

        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupScale();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0558);
        this._labelScaleTitle.setLangText(Lang_Constants.TextType.B0559);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnDefault.setLangText(Lang_Constants.TextType.B0543);
        this._btnClose.setLangText(Lang_Constants.TextType.B0154);

        this._layoutContent.arrangeItems();
    }

    private _updateGroupScale(): void {
        const scale = this._selectedScale || Stages_Constants.Scale.MinScale;
        const width = this._groupScale.getUnscaledWidth();
        const pos   = width * (scale - Stages_Constants.Scale.MinScale) / (Stages_Constants.Scale.MaxScale - Stages_Constants.Scale.MinScale);
        this._imgScalePoint.setX(pos);
        this._imgScaleBar.setUnscaledManualWidth(pos);
        this._labelScale.setText(`${Helpers_Text.format("%.2f", 10000 / scale)}%`);
    }
}
