import {
    Cos_Constants,
    Helpers_ImageSource,
    GamePanels_Dict,
    GamePanels_Manager,
    ForceSkins_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export interface OpenData {
    gcData                  : GameConfigs_GameConfig.GameConfig;
    availableCoIdArray      : number[];
    availableSkinIdArray    : number[];
    currentCoId             : number;
    currentSkinId           : number;
    callback                : (coId: number, unitAndTileSkinId: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutCo!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnCo!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgCo!            : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutColor!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnColor!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgColor!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    private _coId                       = Cos_Constants.CoId.Empty;
    private _skinId                     = ForceSkins_Constants.SkinId.First;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,                           callback : this.closePanel },

            { ui : this._btnCo,                              callback : this._onTouchedBtnCo },
            { ui : this._btnColor,                           callback : this._onTouchedBtnColor },
            { ui : this._btnConfirm,                         callback : this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._coId      = openData.currentCoId;
        this._skinId    = openData.currentSkinId;
        this._updateLayoutCo();
        this._updateLayoutColor();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig         : openData.gcData,
            availableCoIdArray : openData.availableCoIdArray,
            currentCoId        : this._coId,
            isBan              : false,
            callbackOnConfirm  : coId => {
                this._coId = coId;
                this._updateLayoutCo();
            },
        });
    }
    private _onTouchedBtnColor(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray : openData.availableSkinIdArray,
            currentSkinId        : this._skinId,
            callback             : skinId => {
                this._skinId = skinId;
                this._updateLayoutColor();
            },
        });
    }
    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.callback(this._coId, this._skinId);
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0560);
        this._btnCo.setText(`CO`);
        this._btnColor.setLangText(Lang_Constants.TextType.B0397);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
    }

    private _updateLayoutCo(): void {
        const gcData = this.getOpenData()?.gcData;
        if (gcData == null) {
            return;
        }

        this._imgCo.loadSource(Helpers_ImageSource.getCoEye(gcData, this._coId, true) ?? ``);
        this._layoutCo.arrangeItems();
    }

    private _updateLayoutColor(): void {
        this._imgColor.loadSource(Helpers_ImageSource.getSkinCircle(this._skinId, true));
        this._layoutColor.arrangeItems();
    }
}
