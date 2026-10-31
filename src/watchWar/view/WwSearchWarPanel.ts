import {
    GamePanels_Dict,
    NormalMap_Model_NormalMapModel,
    GameConfigs_Provider,
    Lang_Utils,
    Users_Model,
    Wars_Constants,
    GamePanels_Manager,
    Players_Constants,
    Lang_Constants,
    Ui_Components_UiPanel,
    AuxiliaryTypes_WarFilter,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export type OpenData = {
    filter  : AuxiliaryTypes_WarFilter.WarFilter | null;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnReset!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSearch!                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapNameTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnMapName!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapName!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPlayerNameTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayerName!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPlayerName!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeletePlayerName!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPlayersCountTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayersCount!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPlayersCount!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeletePlayersCount!    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelCoNameTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCoName!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCoName!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteCoName!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelWarIdTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWarId!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnWarId!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteWarId!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelWarNameTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWarName!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnWarName!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteWarName!         : Ui_Interfaces_IUiButton.IUiButton;

    private _filter                             = new AuxiliaryTypes_WarFilter.WarFilter();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnHelp,                callback : this._onTouchedBtnHelp },

            { ui : this._btnReset,               callback : this._onTouchedBtnReset },
            { ui : this._btnSearch,              callback : this._onTouchedBtnSearch },

            { ui : this._btnMapName,             callback : this._onTouchedBtnMapName },
            { ui : this._btnDeleteMapName,       callback : this._onTouchedBtnDeleteMapName },

            { ui : this._btnPlayerName,          callback : this._onTouchedBtnPlayerName },
            { ui : this._btnDeletePlayerName,    callback : this._onTouchedBtnDeletePlayerName },

            { ui : this._btnCoName,              callback : this._onTouchedBtnCoName },
            { ui : this._btnDeleteCoName,        callback : this._onTouchedBtnDeleteCoName },

            { ui : this._btnPlayersCount,        callback : this._onTouchedBtnPlayersCount },
            { ui : this._btnDeletePlayersCount,  callback : this._onTouchedBtnDeletePlayersCount },

            { ui : this._btnWarId,               callback : this._onTouchedBtnWarId },
            { ui : this._btnDeleteWarId,         callback : this._onTouchedBtnDeleteWarId },

            { ui : this._btnWarName,             callback : this._onTouchedBtnWarName },
            { ui : this._btnDeleteWarName,       callback : this._onTouchedBtnDeleteWarName },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._filter = this.getOpenData()?.filter?.clone() ?? new AuxiliaryTypes_WarFilter.WarFilter();

        this._updateComponentsForLanguage();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => `${Lang_Utils.getText(Lang_Constants.TextType.A0838)}\n\n${Lang_Utils.getText(Lang_Constants.TextType.A0063)}`,
        });
    }

    private _onTouchedBtnReset(): void {
        this._filter = new AuxiliaryTypes_WarFilter.WarFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwMakeRequestWarsPanel, {
            filter : this._filter,
        });
        this.closePanel();
    }

    private async _onTouchedBtnMapName(): Promise<void> {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray : [...await NormalMap_Model_NormalMapModel.getEnabledNormalMapIdSet()],
            getTitleText              : () => Lang_Utils.getText(Lang_Constants.TextType.B0227),
            callback                  : normalMapId => {
                filter.normalMapId = normalMapId;
                this._updateLabelMapName();
            },
        });
    }
    private _onTouchedBtnDeleteMapName(): void {
        this._filter.normalMapId = null;
        this._updateLabelMapName();
    }

    private _onTouchedBtnPlayerName(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonSearchSingleUserPanel, {
            getTitleText      : null,
            callbackOnConfirm : userId => {
                this._filter.userId = userId;
                this._updateLabelPlayerName();
            },
        });
    }
    private _onTouchedBtnDeletePlayerName(): void {
        this._filter.userId = null;
        this._updateLabelPlayerName();
    }

    private async _onTouchedBtnCoName(): Promise<void> {
        const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
        const filter        = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoCategoryIdPanel, {
            gameConfig                 : gameConfig,
            availableCoCategoryIdArray : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryId        : filter.coCategoryId ?? null,
            isBan                      : false,
            callbackOnConfirm          : coCategoryId => {
                filter.coCategoryId = coCategoryId;
                this._updateLabelCoName();
            },
        });
    }
    private _onTouchedBtnDeleteCoName(): void {
        this._filter.coCategoryId = null;
        this._updateLabelCoName();
    }

    private _onTouchedBtnPlayersCount(): void {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0229),
            minValue     : 2,
            maxValue     : Players_Constants.PlayerIndex.Max,
            currentValue : filter.playersCountUnneutral ?? 2,
            callback     : playersCount => {
                filter.playersCountUnneutral = playersCount;
                this._updateLabelPlayersCount();
            },
        });
    }
    private _onTouchedBtnDeletePlayersCount(): void {
        this._filter.playersCountUnneutral = null;
        this._updateLabelPlayersCount();
    }

    private _onTouchedBtnWarId(): void {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0226),
            minValue     : 0,
            maxValue     : 999999999,
            currentValue : filter.warId ?? 0,
            callback     : warId => {
                filter.warId = warId;
                this._updateLabelWarId();
            },
        });
    }
    private _onTouchedBtnDeleteWarId(): void {
        this._filter.warId = null;
        this._updateLabelWarId();
    }

    private _onTouchedBtnWarName(): void {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0185),
            charRestrict : null,
            canBeEmpty   : true,
            maxChars     : Wars_Constants.Misc.MaxNameLength,
            tips         : null,
            currentValue : filter.warName ?? ``,
            callback     : panel => {
                filter.warName = panel.getInputText();
                this._updateLabelWarName();
            },
        });
    }
    private _onTouchedBtnDeleteWarName(): void {
        this._filter.warName = null;
        this._updateLabelWarName();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0228);
        this._labelMapNameTitle.setLangText(Lang_Constants.TextType.B0225);
        this._labelPlayerNameTitle.setLangText(Lang_Constants.TextType.B0031);
        this._labelPlayersCountTitle.setLangText(Lang_Constants.TextType.B0922);
        this._labelCoNameTitle.setLangText(Lang_Constants.TextType.B0394);
        this._labelWarIdTitle.setLangText(Lang_Constants.TextType.B0226);
        this._labelWarNameTitle.setLangText(Lang_Constants.TextType.B0185);

        this._btnReset.setLangText(Lang_Constants.TextType.B0567);
        this._btnSearch.setLangText(Lang_Constants.TextType.B0228);
    }

    private _updateComponentsForFilter(): void {
        this._updateLabelMapName();
        this._updateLabelPlayerName();
        this._updateLabelCoName();
        this._updateLabelPlayersCount();
        this._updateLabelWarId();
        this._updateLabelWarName();
    }

    private async _updateLabelMapName(): Promise<void> {
        const normalMapId = this._filter.normalMapId;
        this._labelMapName.setText(normalMapId == null
            ? ``
            : (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) ?? Lang_Constants.UndefinedError);
    }

    private async _updateLabelPlayerName(): Promise<void> {
        const userId = this._filter.userId;
        this._labelPlayerName.setText( userId == null
            ? ``
            : (await Users_Model.getUserNickname(userId)) ?? Lang_Constants.UndefinedError);
    }

    private async _updateLabelCoName(): Promise<void> {
        const coCategoryId = this._filter.coCategoryId;
        this._labelCoName.setText( coCategoryId == null
            ? ``
            : (await GameConfigs_Provider.getLatestGameConfig()).getCoCategoryCfg(coCategoryId)?.getName() ?? Lang_Constants.UndefinedError);
    }

    private _updateLabelPlayersCount(): void {
        this._labelPlayersCount.setText(`${this._filter.playersCountUnneutral ?? ``}`);
    }

    private _updateLabelWarId(): void {
        this._labelWarId.setText(`${this._filter.warId ?? ``}`);
    }

    private _updateLabelWarName(): void {
        this._labelWarName.setText(this._filter.warName ?? ``);
    }
}
