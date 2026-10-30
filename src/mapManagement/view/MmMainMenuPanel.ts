import {
    NormalMap_Model_NormalMapModel,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnReviewMap!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyMap!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyMapTag!  : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgMmReloadAllMaps,      callback : this._onMsgMmReloadAllMaps },
            { type : Notifications_TypeId.TypeId.MsgMmGetReviewingMaps,   callback : this._onMsgMmGetReviewingMaps },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },

            { ui : this._btnReviewMap,       callback : this._onTouchedBtnReviewMap },
            { ui : this._btnModifyMap,       callback : this._onTouchedBtnModifyMap },
            { ui : this._btnModifyMapTag,    callback : this._onTouchedBtnModifyMapTag },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateRedForBtnReviewMap();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onMsgMmReloadAllMaps(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0075));
    }
    private _onMsgMmGetReviewingMaps(): void {
        this._updateRedForBtnReviewMap();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0192);
        this._btnReviewMap.setLangText(Lang_Constants.TextType.B0295);
        this._btnModifyMap.setLangText(Lang_Constants.TextType.B0317);
        this._btnModifyMapTag.setLangText(Lang_Constants.TextType.B0445);
    }

    private async _updateRedForBtnReviewMap(): Promise<void> {
        this._btnReviewMap.setRedVisible(await NormalMap_Model_NormalMapModel.checkIsRedForMmReviewingMaps());
    }

    private _onTouchedBtnReviewMap(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmReviewListPanel, void 0);
    }
    private async _onTouchedBtnModifyMap(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray : [...await NormalMap_Model_NormalMapModel.getEnabledNormalMapIdSet()],
            getTitleText              : () => Lang_Utils.getText(Lang_Constants.TextType.B0317),
            isAutoClose               : false,
            callback                  : normalMapId => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmCommandPanel, { normalMapId });
            },
        });
    }
    private _onTouchedBtnModifyMapTag(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmMapTagListPanel, void 0);
    }
}
