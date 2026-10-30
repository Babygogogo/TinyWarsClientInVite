import {
    MapEditor_Model_MeHelpers,
    Maps_Constants,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export type OpenData = {
    war     : MapEditor_Interface_IMeWar.IMeWar;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelCurrSizeTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCurrWidth!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCurrHeight!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCurrGrids!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelNewSizeTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnWidth!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHeight!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelNewGrids!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnCancel!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;

    private _newWidth   = 0;
    private _newHeight  = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },
            { ui : this._btnCancel,          callback : this.closePanel },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
            { ui : this._btnWidth,           callback : this._onTouchedBtnWidth },
            { ui : this._btnHeight,          callback : this._onTouchedBtnHeight },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { width, height } = openData.war.getTileMap().getMapSize().getWH();
        this._labelCurrHeight.setText(`${height}`);
        this._labelCurrWidth.setText(`${width}`);
        this._labelCurrGrids.setText(`${width * height}`);
        this._newWidth              = width;
        this._newHeight             = height;
        this._updateBtnWidth();
        this._updateBtnHeight();
        this._updateLabelNewGrids();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => `${Lang_Utils.getText(Lang_Constants.TextType.A0117)}\n\n${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0023, Maps_Constants.Common.MaxGridsCount)}`,
        });
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const width         = this._newWidth;
        const height        = this._newHeight;
        const gridsCount    = width * height;
        if ((!gridsCount) || (gridsCount <= 0) || (width <= 0) || (height <= 0) || (gridsCount > Maps_Constants.Common.MaxGridsCount)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0087));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gameConfig    = war.getGcData();
        war.stopRunning();
        await war.initWithMapRawData({
            mapRawData : MapEditor_Model_MeHelpers.clearMap({
                mapRawData : await war.serializeForMap(),
                newWidth   : width,
                newHeight  : height,
                gameConfig : gameConfig,
            }),
            slotIndex                 : war.getMapSlotIndex(),
            gameConfig                : gameConfig,
            srcNormalMapIdForAddEvent : war.getSrcNormalMapIdForAddEvent(),
            gridMarkData              : null,
        });
        war.setIsMapModified(true);
        war.startRunning()
            .startRunningView();

        this.closePanel();
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapCleared);
    }

    private _onTouchedBtnWidth(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0034),
            minValue     : 1,
            maxValue     : Math.floor(Maps_Constants.Common.MaxGridsCount / (this._newHeight || 1)),
            currentValue : this._newWidth,
            callback     : newWidth => {
                this._newWidth = newWidth;
                this._updateBtnWidth();
                this._updateLabelNewGrids();
            },
        });
    }

    private _onTouchedBtnHeight(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0035),
            minValue     : 1,
            maxValue     : Math.floor(Maps_Constants.Common.MaxGridsCount / (this._newWidth || 1)),
            currentValue : this._newHeight,
            callback     : newHeight => {
                this._newHeight = newHeight;
                this._updateBtnHeight();
                this._updateLabelNewGrids();
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0391);
        this._labelCurrSizeTitle.setLangText(Lang_Constants.TextType.B0855);
        this._labelNewSizeTitle.setLangText(Lang_Constants.TextType.B0856);
    }

    private _updateBtnWidth(): void {
        this._btnWidth.setText(`${this._newWidth}`);
    }
    private _updateBtnHeight(): void {
        this._btnHeight.setText(`${this._newHeight}`);
    }
    private _updateLabelNewGrids(): void {
        const grids     = this._newWidth * this._newHeight;
        const label     = this._labelNewGrids;
        label.setText(`${grids}`);
        label.setTextColor((grids > 0) && (grids <= Maps_Constants.Common.MaxGridsCount) ? 0xFFFFFF : 0xFFFF00);
    }
}
