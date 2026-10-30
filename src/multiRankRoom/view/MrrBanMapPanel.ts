import {
    MultiRankRoom_Model_MrrModel,
    GamePanels_Dict,
    NormalMap_Model_NormalMapModel,
    Helpers_Collection,
    Lang_Utils,
    GamePanels_Manager,
    MultiRankRoom_Model_MrrProxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
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
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutStd!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelStd!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdMap0!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnStdMap0!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteStdMap0! : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelStdMap1!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnStdMap1!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteStdMap1! : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutFog!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelFog!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFogMap0!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnFogMap0!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteFogMap0! : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelFogMap1!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnFogMap1!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteFogMap1! : Ui_Interfaces_IUiButton.IUiButton;

    private _normalMapIdArrayForStd     : (number | null)[] = [];
    private _normalMapIdArrayForFog     : (number | null)[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgMrrGetBannedNormalMapIdArray, callback: this._onMsgMrrGetBannedNormalMapIdArray },
            { type: Notifications_TypeId.TypeId.MsgMrrSetBannedNormalMapIdArray, callback: this._onMsgMrrSetBannedNormalMapIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },

            { ui: this._btnStdMap0,         callback: this._onTouchedBtnStdMap0 },
            { ui: this._btnDeleteStdMap0,   callback: this._onTouchedBtnDeleteStdMap0 },

            { ui: this._btnStdMap1,         callback: this._onTouchedBtnStdMap1 },
            { ui: this._btnDeleteStdMap1,   callback: this._onTouchedBtnDeleteStdMap1 },

            { ui: this._btnFogMap0,         callback: this._onTouchedBtnFogMap0 },
            { ui: this._btnDeleteFogMap0,   callback: this._onTouchedBtnDeleteFogMap0 },

            { ui: this._btnFogMap1,         callback: this._onTouchedBtnFogMap1 },
            { ui: this._btnDeleteFogMap1,   callback: this._onTouchedBtnDeleteFogMap1 },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._resetNormalMapIdArrayAndView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgMrrGetBannedNormalMapIdArray(): void {
        this._resetNormalMapIdArrayAndView();
    }
    private _onMsgMrrSetBannedNormalMapIdArray(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._resetNormalMapIdArrayAndView();
    }

    private async _onTouchedBtnStdMap0(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await NormalMap_Model_NormalMapModel.getNormalMapIdArrayForRankedMatch(false),
            getTitleText                : () => Lang_Utils.getText(Lang_Constants.TextType.B0084),
            callback                    : normalMapId => {
                this._normalMapIdArrayForStd[0] = normalMapId;
                this._updateComponentsForStd();
            }
        });
    }
    private _onTouchedBtnDeleteStdMap0(): void {
        this._normalMapIdArrayForStd[0] = null;
        this._updateComponentsForStd();
    }

    private async _onTouchedBtnStdMap1(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await NormalMap_Model_NormalMapModel.getNormalMapIdArrayForRankedMatch(false),
            getTitleText                : () => Lang_Utils.getText(Lang_Constants.TextType.B0084),
            callback                    : normalMapId => {
                this._normalMapIdArrayForStd[1] = normalMapId;
                this._updateComponentsForStd();
            }
        });
    }
    private _onTouchedBtnDeleteStdMap1(): void {
        this._normalMapIdArrayForStd[1] = null;
        this._updateComponentsForStd();
    }

    private async _onTouchedBtnFogMap0(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await NormalMap_Model_NormalMapModel.getNormalMapIdArrayForRankedMatch(true),
            getTitleText                : () => Lang_Utils.getText(Lang_Constants.TextType.B0084),
            callback                    : normalMapId => {
                this._normalMapIdArrayForFog[0] = normalMapId;
                this._updateComponentsForFog();
            }
        });
    }
    private _onTouchedBtnDeleteFogMap0(): void {
        this._normalMapIdArrayForFog[0] = null;
        this._updateComponentsForFog();
    }

    private async _onTouchedBtnFogMap1(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await NormalMap_Model_NormalMapModel.getNormalMapIdArrayForRankedMatch(true),
            getTitleText                : () => Lang_Utils.getText(Lang_Constants.TextType.B0084),
            callback                    : normalMapId => {
                this._normalMapIdArrayForFog[1] = normalMapId;
                this._updateComponentsForFog();
            }
        });
    }
    private _onTouchedBtnDeleteFogMap1(): void {
        this._normalMapIdArrayForFog[1] = null;
        this._updateComponentsForFog();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0101),
        });
    }
    private _onTouchedBtnCancel(): void {
        this.closePanel();
    }
    private _onTouchedBtnConfirm(): void {
        MultiRankRoom_Model_MrrProxy.reqMrrSetBannedNormalMapIdArray(
            [...new Set(Helpers_Collection.getNonNullElements(this._normalMapIdArrayForStd))],
            [...new Set(Helpers_Collection.getNonNullElements(this._normalMapIdArrayForFog))],
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _resetNormalMapIdArrayAndView(): void {
        this._normalMapIdArrayForStd = MultiRankRoom_Model_MrrModel.getBannedNormalMapIdArray(false).concat();
        this._normalMapIdArrayForFog = MultiRankRoom_Model_MrrModel.getBannedNormalMapIdArray(true).concat();
        this._updateComponentsForStd();
        this._updateComponentsForFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0084);
        this._labelStd.setLangText(Lang_Constants.TextType.B0548);
        this._labelFog.setLangText(Lang_Constants.TextType.B0549);

        this._layoutStd.arrangeItems();
        this._layoutFog.arrangeItems();

        this._updateComponentsForStd();
        this._updateComponentsForFog();
    }

    private async _updateComponentsForStd(): Promise<void> {
        const normalMapIdArray  = this._normalMapIdArrayForStd;
        const normalMapId0      = normalMapIdArray[0];
        const normalMapId1      = normalMapIdArray[1];
        this._labelStdMap0.setText(normalMapId0 == null ? `` : `#${normalMapId0} ${(await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId0) ?? Lang_Constants.UndefinedError)}`);
        this._labelStdMap1.setText(normalMapId1 == null ? `` : `#${normalMapId1} ${(await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId1) ?? Lang_Constants.UndefinedError)}`);
    }
    private async _updateComponentsForFog(): Promise<void> {
        const normalMapIdArray  = this._normalMapIdArrayForFog;
        const normalMapId0      = normalMapIdArray[0];
        const normalMapId1      = normalMapIdArray[1];
        this._labelFogMap0.setText(normalMapId0 == null ? `` : `#${normalMapId0} ${(await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId0) ?? Lang_Constants.UndefinedError)}`);
        this._labelFogMap1.setText(normalMapId1 == null ? `` : `#${normalMapId1} ${(await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId1) ?? Lang_Constants.UndefinedError)}`);
    }
}
