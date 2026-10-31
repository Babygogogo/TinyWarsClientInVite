import {
    Cos_Constants,
    GamePanels_Dict,
    GameConfigs_Provider,
    GamePanels_Manager,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export type OpenData = {
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _layoutContent!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutLeaderboard!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelLeaderboard!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnLbMrw!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLbSpmOverall!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutNumerical!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelNumerical!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnUnit!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnTile!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCo!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCoStatistics!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutMisc!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMisc!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnOnlineUsers!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnServerStatus!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeLog!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnTutorial!          : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },

            { ui : this._btnLbMrw,                   callback : this._onTouchedBtnLbMrw },
            { ui : this._btnLbSpmOverall,            callback : this._onTouchedBtnLbSpmOverall },
            { ui : this._btnUnit,                    callback : this._onTouchedBtnUnit },
            { ui : this._btnTile,                    callback : this._onTouchedBtnTile },
            { ui : this._btnCo,                      callback : this._onTouchedBtnCo },
            { ui : this._btnCoStatistics,            callback : this._onTouchedBtnCoStatistics },
            { ui : this._btnTutorial,                callback : this._onTouchedBtnTutorial },
            { ui : this._btnOnlineUsers,             callback : this._onTouchedBtnOnlineUsers },
            { ui : this._btnChangeLog,               callback : this._onTouchedBtnChangeLog },
            { ui : this._btnServerStatus,            callback : this._onTouchedBtnServerStatus },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnLbMrw(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LbMrwListPanel, void 0);
    }
    private _onTouchedBtnLbSpmOverall(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LbSpmOverallListPanel, void 0);
    }
    private async _onTouchedBtnUnit(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDamageChartPanel, {
            gameConfig : await GameConfigs_Provider.getLatestGameConfig(),
        });
    }
    private async _onTouchedBtnTile(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonTileChartPanel, {
            gameConfig : await GameConfigs_Provider.getLatestGameConfig(),
        });
    }
    private async _onTouchedBtnCo(): Promise<void> {
        const gameConfig = await GameConfigs_Provider.getLatestGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoIdPanel, {
            gameConfig         : gameConfig,
            currentCoIdArray   : [],
            isBan              : false,
            getTitleText       : null,
            availableCoIdArray : gameConfig.getAllEnabledCoArray()
                .filter(v => (v.getCoCategoryId() !== Cos_Constants.CategoryId.Empty) && (v.getCoCategoryId() !== Cos_Constants.CategoryId.Random))
                .map(v => v.getCoId()),
        });
    }
    private _onTouchedBtnCoStatistics(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoStatisticsPanel, {
            filter            : undefined,
            usePreviousFilter : true,
        });
    }
    private _onTouchedBtnTutorial(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonTutorialPanel, void 0);
    }
    private _onTouchedBtnOnlineUsers(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserOnlineUsersPanel, void 0);
    }
    private _onTouchedBtnChangeLog(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChangeLogPanel, void 0);
    }
    private _onTouchedBtnServerStatus(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonServerStatusPanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0900);
        this._labelLeaderboard.setLangText(Lang_Constants.TextType.B0436);
        this._labelNumerical.setLangText(Lang_Constants.TextType.B0840);
        this._labelMisc.setLangText(Lang_Constants.TextType.B1279);
        this._btnLbMrw.setLangText(Lang_Constants.TextType.B0404);
        this._btnLbSpmOverall.setLangText(Lang_Constants.TextType.B0614);
        this._btnUnit.setLangText(Lang_Constants.TextType.Units);
        this._btnTile.setLangText(Lang_Constants.TextType.B0899);
        this._btnCo.setLangText(Lang_Constants.TextType.B0425);
        this._btnCoStatistics.setLangText(Lang_Constants.TextType.B1076);
        this._btnTutorial.setLangText(Lang_Constants.TextType.B0978);
        this._btnOnlineUsers.setLangText(Lang_Constants.TextType.B0151);
        this._btnChangeLog.setLangText(Lang_Constants.TextType.B0457);
        this._btnServerStatus.setLangText(Lang_Constants.TextType.B0327);

        this._layoutLeaderboard.arrangeItems();
        this._layoutNumerical.arrangeItems();
        this._layoutMisc.arrangeItems();
        this._layoutContent.arrangeItems();
    }
}
