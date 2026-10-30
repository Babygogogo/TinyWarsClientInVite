import {
    Helpers_Text,
    GamePanels_Dict,
    GameConfigs_Provider,
    Helpers_ImageSource,
    Leaderboard_Model_LeaderboardModel,
    Common_Model_CommonModel,
    Users_Model,
    Lang_Utils,
    MultiRankedWars_Constants,
    Helpers_Misc,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Common_Model_CommonProxy,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    WarTypes_Constants,
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
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSwitch!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelStdRank!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdNickname! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdScore!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdWin!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdLose!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdDraw!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdWinRate!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listStd!          : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMrwUserRenderer>;
    private readonly _labelStdNoData!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupMyInfo!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMyIndex!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgMyAvatar!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelMyNickname!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgMyMedal!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelMyScore!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyWin!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyLose!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyDraw!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyWinRate!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isStd                      = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,        callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgCommonGetRankList,   callback : this._onMsgCommonGetRankList },
        ]);
        this._setUiListenerArray([
            { ui : this._btnSwitch,      callback : this._onTouchedBtnSwitch },
            { ui : this._groupMyInfo,    callback : this._onTouchedGroupMyInfo },
            { ui : this._btnClose,       callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listStd.setItemRendererClass(MrwUserRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        Common_Model_CommonProxy.reqGetRankList();

        this._updateComponentsForLanguage();
        this._updateComponentsForListStd();
        this._updateComponentsForMyInfo();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listStd.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onMsgCommonGetRankList(): void {
        this._updateComponentsForListStd();
        this._updateComponentsForMyInfo();
    }

    private _onTouchedBtnSwitch(): void {
        this._isStd = !this._isStd;
        this._updateLabelTitle();
        this._updateComponentsForListStd();
        this._updateComponentsForMyInfo();
    }

    private _onTouchedGroupMyInfo(): void {
        const userId = Users_Model.getSelfUserId();
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : userId });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelStdNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelStdRank.setLangText(Lang_Constants.TextType.B0904);
        this._labelStdNickname.setLangText(Lang_Constants.TextType.B0175);
        this._labelStdScore.setLangText(Lang_Constants.TextType.B0579);
        this._labelStdWin.setLangText(Lang_Constants.TextType.B0550);
        this._labelStdLose.setLangText(Lang_Constants.TextType.B0551);
        this._labelStdDraw.setLangText(Lang_Constants.TextType.B0552);
        this._labelStdWinRate.setLangText(Lang_Constants.TextType.B0553);

        this._updateLabelTitle();
    }
    private _updateLabelTitle(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1102)} (${Lang_Utils.getText(this._isStd ? Lang_Constants.TextType.B0548 : Lang_Constants.TextType.B0549)})`);
    }
    private async _updateComponentsForListStd(): Promise<void> {
        const playersCount  = 2;
        const warType       = this._isStd ? WarTypes_Constants.WarTypeId.MrwStd : WarTypes_Constants.WarTypeId.MrwFog;
        const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
        const dataList      : DataForMrwUserRenderer[] = [];
        for (const data of Common_Model_CommonModel.getMrwRankList() || []) {
            if ((data.getPlayersCountUnneutral() === playersCount) && (data.getWarType() === warType)) {
                const userId = data.getUserId();
                if (userId == null) {
                    throw Helpers_Misc.newError(`LbMrwListPanel._updateComponentsForStd() empty userId.`);
                }

                dataList.push({
                    gameConfig   : gameConfig,
                    rank         : dataList.length + 1,
                    userId       : userId,
                    warType      : warType,
                    playersCount : playersCount,
                    isLast       : false,
                });
            }
        }
        if (dataList.length) {
            dataList[dataList.length - 1].isLast = true;
        }

        this._labelStdNoData.setIsVisible(!dataList.length);
        await this._listStd.bindData(dataList);
    }
    private async _updateComponentsForMyInfo(): Promise<void> {
        const group     = this._groupMyInfo;
        const userInfo  = Users_Model.getSelfInfo();
        if (userInfo == null) {
            group.setIsVisible(false);
            return;
        }

        const isStd         = this._isStd;
        const warType       = isStd ? WarTypes_Constants.WarTypeId.MrwStd : WarTypes_Constants.WarTypeId.MrwFog;
        const rankIndex     = await Leaderboard_Model_LeaderboardModel.getMrwRankIndex(warType, userInfo.getUserId() ?? 0);
        if (isStd !== this._isStd) {
            return;
        }

        group.setIsVisible(true);

        const playersCount      = 2;
        const userComplexInfo   = userInfo.getUserComplexInfo();
        const rankInfo          = userComplexInfo?.getUserRankInfo()?.getMrwArray().find(v => (v.getPlayersCountUnneutral() === playersCount) && (v.getWarType() === warType));
        const statistics        = userComplexInfo?.getUserWarStatistics()?.getMpwArray().find(v => (v.getPlayersCountUnneutral() === playersCount) && (v.getWarType() === warType));
        const winCount          = statistics?.getWins() ?? 0;
        const loseCount         = statistics?.getLoses() ?? 0;
        const drawCount         = statistics?.getDraws() ?? 0;
        const gamesCount        = winCount + loseCount + drawCount;
        const medalId           = (userComplexInfo?.getUserMedalInfo()?.getShowMedalIdArray() ?? [])[0];
        this._labelMyIndex.setText(rankIndex == null ? `--` : `${rankIndex}`);
        this._imgMyAvatar.loadSource(Helpers_ImageSource.getUserAvatar(userComplexInfo?.getAvatarId() ?? 1));
        this._labelMyNickname.setText(userInfo.getNickname() ?? Lang_Constants.UndefinedError);
        this._imgMyMedal.loadSource(medalId == null ? `` : Helpers_ImageSource.getMedal(medalId));
        this._labelMyScore.setText(`${rankInfo?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore}`);
        this._labelMyWin.setText(`${winCount}`);
        this._labelMyLose.setText(`${loseCount}`);
        this._labelMyDraw.setText(`${drawCount}`);
        this._labelMyWinRate.setText(gamesCount > 0 ? `${Helpers_Text.format(`%.2f`, winCount * 100 / gamesCount)}` : `--`);

        this._layoutName.arrangeItems();
    }
}

interface DataForMrwUserRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    rank            : number;
    userId          : number;
    playersCount    : number;
    warType         : WarTypes_Constants.WarTypeId;
    isLast          : boolean;
}
class MrwUserRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMrwUserRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForMrwUserRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBottom!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgAvatar!        : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelNickname!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgMedal!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _labelScore!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWin!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWinRate!     : Ui_Interfaces_IUiLabel.IUiLabel;

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

        this._labelIndex.setText(`${openData.rank}`);
        this._imgBottom.setIsVisible(!openData.isLast);

        const imgAvatar         = this._imgAvatar;
        const labelNickname     = this._labelNickname;
        const imgMedal          = this._imgMedal;
        const labelScore        = this._labelScore;
        const labelWin          = this._labelWin;
        const labelLose         = this._labelLose;
        const labelDraw         = this._labelDraw;
        const labelWinRate      = this._labelWinRate;
        imgAvatar.loadSource(``);
        labelNickname.setText(``);
        imgMedal.loadSource(``);
        labelScore.setText(``);
        labelWin.setText(``);
        labelLose.setText(``);
        labelDraw.setText(``);
        labelWinRate.setText(``);

        const userId    = openData.userId;
        const userInfo  = await Users_Model.getUserPublicInfo(userId);
        if ((userInfo == null) || (userId !== this.getOpenData()?.userId)) {
            return;
        }

        const playersCount  = openData.playersCount;
        const warType       = openData.warType;
        const rankInfo      = userInfo.getUserMrwRankInfoArray().find(v => (v.getPlayersCountUnneutral() === playersCount) && (v.getWarType() === warType));
        const statistics    = userInfo.getUserMpwStatisticsArray().find(v => (v.getPlayersCountUnneutral() === playersCount) && (v.getWarType() === warType));
        const winCount      = statistics?.getWins() ?? 0;
        const loseCount     = statistics?.getLoses() ?? 0;
        const drawCount     = statistics?.getDraws() ?? 0;
        const gamesCount    = winCount + loseCount + drawCount;
        const medalId       = userInfo.getShowMedalIdArray()[0];
        imgAvatar.loadSource(Helpers_ImageSource.getUserAvatar(userInfo.getAvatarId() ?? 1));
        labelNickname.setText(userInfo.getNickname() ?? Lang_Constants.UndefinedError);
        imgMedal.loadSource(medalId == null ? `` : Helpers_ImageSource.getMedal(medalId));
        labelScore.setText(`${rankInfo?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore}`);
        labelWin.setText(`${winCount}`);
        labelLose.setText(`${loseCount}`);
        labelDraw.setText(`${drawCount}`);
        labelWinRate.setText(gamesCount > 0 ? `${Helpers_Text.format(`%.2f`, winCount * 100 / gamesCount)}` : `--`);

        this._layoutName.arrangeItems();
    }
}
