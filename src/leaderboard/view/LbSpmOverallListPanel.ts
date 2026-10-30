import {
    Helpers_Text,
    GamePanels_Dict,
    Helpers_Misc,
    GameConfigs_Provider,
    Helpers_ImageSource,
    Leaderboard_Model_LeaderboardModel,
    Users_Model,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelSpmNoData!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSpmRank!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSpmNickname!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSpmScore!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listSpm!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSpmUserRenderer>;

    private readonly _layoutVersion!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelVersionTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelVersion!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPreviousVersion!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextVersion!       : Ui_Interfaces_IUiButton.IUiButton;

    private _configVersion = ``;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,        callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgCommonGetRankList,   callback : this._onMsgCommonGetRankList },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnPreviousVersion,     callback : this._onTouchedBtnPreviousVersion },
            { ui : this._btnNextVersion,         callback : this._onTouchedBtnNextVersion },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSpm.setItemRendererClass(SpmUserRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._configVersion = await GameConfigs_Provider.getLatestConfigVersion();

        this._updateComponentsForLanguage();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSpm.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnPreviousVersion(): Promise<void> {
        const configVersion = await GameConfigs_Provider.getPreviousConfigVersion(this._configVersion);
        if (configVersion == null) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
        } else {
            this._configVersion = configVersion;
            this._updateView();
        }
    }

    private async _onTouchedBtnNextVersion(): Promise<void> {
        const configVersion = await GameConfigs_Provider.getNextConfigVersion(this._configVersion);
        if (configVersion == null) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
        } else {
            this._configVersion = configVersion;
            this._updateView();
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onMsgCommonGetRankList(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForSpm();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1103);
        this._labelSpmNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelSpmRank.setLangText(Lang_Constants.TextType.B0904);
        this._labelSpmNickname.setLangText(Lang_Constants.TextType.B0175);
        this._labelSpmScore.setLangText(Lang_Constants.TextType.B0579);
        this._labelVersionTitle.setLangText(Lang_Constants.TextType.B1104);
        this._btnPreviousVersion.setLangText(Lang_Constants.TextType.B1029);
        this._btnNextVersion.setLangText(Lang_Constants.TextType.B1030);
    }

    private async _updateComponentsForSpm(): Promise<void> {
        const configVersion = this._configVersion;
        const gameConfig    = await GameConfigs_Provider.getGameConfig(configVersion);
        const dataArray     : DataForSpmUserRenderer[] = [];
        if (gameConfig != null) {
            for (const data of (await Leaderboard_Model_LeaderboardModel.getSpmOverallTopDataArray(configVersion))?.getDataArray() ?? []) {
                const length    = dataArray.length;
                const score     = Helpers_Misc.getExisted(data.getScore());
                dataArray.push({
                    gameConfig : gameConfig,
                    index      : length + 1,
                    userId     : Helpers_Misc.getExisted(data.getUserId()),
                    score      : score,
                    isLast     : false,
                    rank       : length === 0
                        ? 1
                        : (score === dataArray[length - 1].score ? dataArray[length - 1].rank : length + 1),
                });
            }
        }
        if (dataArray.length) {
            dataArray[dataArray.length - 1].isLast = true;
        }

        this._labelVersion.setText(configVersion);
        this._labelSpmNoData.setIsVisible(!dataArray.length);

        this._layoutVersion.arrangeItems();

        await this._listSpm.bindData(dataArray);
    }
}

interface DataForSpmUserRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    index       : number;
    rank        : number;
    userId      : number;
    score       : number;
    isLast      : boolean;
}
class SpmUserRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSpmUserRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForSpmUserRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgAvatar!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgBottom!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgMedal!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelNickname!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelScore!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : this.getOpenData()?.userId });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const rank              = openData.rank;
        const labelNickname     = this._labelNickname;
        const labelScore        = this._labelScore;
        const imgAvatar         = this._imgAvatar;
        const imgMedal          = this._imgMedal;
        labelNickname.setText(``);
        imgAvatar.loadSource(``);
        imgMedal.loadSource(``);
        labelScore.setText(`${Helpers_Text.format(`%.2f`, openData.score)}`);
        this._labelIndex.setText(`${rank}`);
        this._imgBottom.setIsVisible(!openData.isLast);

        const userId            = openData.userId;
        const userInfo          = await Users_Model.getUserPublicInfo(userId);
        if ((userInfo == null) || (userId !== this.getOpenData()?.userId)) {
            return;
        }

        const medalId = (userInfo.getShowMedalIdArray())[0];
        imgAvatar.loadSource(Helpers_ImageSource.getUserAvatar(userInfo.getAvatarId() ?? 1));
        imgMedal.loadSource(medalId == null ? `` : Helpers_ImageSource.getMedal(medalId));
        labelNickname.setText(userInfo?.getNickname() ?? Lang_Constants.UndefinedError);

        this._layoutName.arrangeItems();
    }
}
