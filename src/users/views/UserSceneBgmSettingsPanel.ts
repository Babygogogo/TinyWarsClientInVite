import {
    Lang_Utils,
    GamePanels_Dict,
    Users_Model,
    GamePanels_Manager,
    Users_Proxy,
    FloatText,
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

export type OpenData = {
    gameConfig  : GameConfigs_GameConfig.GameConfig;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutContent!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutLobby!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelLobby!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnLobby!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutMapEditor!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapEditor!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnMapEditor!         : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserSetSceneBgmSettings,  callback : this._onNotifyMsgUserSetSceneBgmSettings },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                           callback : this.closePanel },

            { ui : this._btnLobby,                           callback : this._onTouchedBtnLobby },
            { ui : this._btnMapEditor,                       callback : this._onTouchedBtnMapEditor },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserSetSceneBgmSettings(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._updateBtnLobby();
        this._updateBtnMapEditor();
    }

    private async _onTouchedBtnLobby(): Promise<void> {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const currentBgmCode = Users_Model.getSelfSettingsBgmCodeForLobby();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig        : gameConfig,
            currentBgmCode    : currentBgmCode,
            callbackOnConfirm : newBgmCode => {
                if (newBgmCode === currentBgmCode) {
                    FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                } else {
                    Users_Proxy.reqUserSetSceneBgmSettings({
                        lobbyBgmCode : newBgmCode,
                    });
                }
            },
        });
    }

    private async _onTouchedBtnMapEditor(): Promise<void> {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const currentBgmCode = Users_Model.getSelfSettingsBgmCodeForMapEditor();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig        : gameConfig,
            currentBgmCode    : currentBgmCode,
            callbackOnConfirm : newBgmCode => {
                if (newBgmCode === currentBgmCode) {
                    FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                } else {
                    Users_Proxy.reqUserSetSceneBgmSettings({
                        mapEditorBgmCode : newBgmCode,
                    });
                }
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // view
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1286);
        this._labelLobby.setLangText(Lang_Constants.TextType.B1288);
        this._labelMapEditor.setLangText(Lang_Constants.TextType.B0271);

        this._layoutLobby.arrangeItems();
        this._layoutMapEditor.arrangeItems();
        this._layoutContent.arrangeItems();
        this._updateBtnLobby();
        this._updateBtnMapEditor();
    }

    private _updateBtnLobby(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const bgmCode = Users_Model.getSelfSettingsBgmCodeForLobby();
        this._btnLobby.setText(Lang_Utils.getBgmSfxName(bgmCode, gameConfig) ?? Lang_Constants.UndefinedError);
    }

    private _updateBtnMapEditor(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const bgmCode = Users_Model.getSelfSettingsBgmCodeForMapEditor();
        this._btnMapEditor.setText(Lang_Utils.getBgmSfxName(bgmCode, gameConfig) ?? Lang_Constants.UndefinedError);
    }
}
