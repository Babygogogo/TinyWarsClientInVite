import {
    AuxiliaryTypes_ChatToTarget,
    Helpers_Text,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_ImageSource,
    Leaderboard_Model_LeaderboardModel,
    MultiRankedWars_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiLayoutBase,
    Ui_Components_UiPanel,
    AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    Users_Model,
    Users_Proxy,
    WarTypes_Constants,
} from "../../internal.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgOnlineState!               : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSwitch!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupTopButtons!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnChat!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetProfile!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetRelation!               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _imgAvatar!                    : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgLogo!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnMedal!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetPrivilege!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelStdRank!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdRankScoreTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdRankScore!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdGamesTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdGames!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnRankStdHistory!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnStdStatistics!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelFogRank!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFogRankScoreTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFogRankScore!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFogGamesTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFogGames!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnRankFogHistory!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnFogStatistics!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelSpmRank!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSpmRankScoreTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSpmRankScore!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnMyWarRoomRecord!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelRegisterTimeTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRegisterTime1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRegisterTime2!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLastLoginTimeTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLastLoginTime1!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLastLoginTime2!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOnlineTimeTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOnlineTime!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoginCountTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoginCount!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUserId!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUserIdTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLastActivityTimeTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLastActivityTime1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLastActivityTime2!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "MsgUserGetPublicInfo",        callback : this._onNotifyMsgUserGetPublicInfo },
            { type : "MsgUserSetNickname",          callback : this._onNotifyMsgUserSetNickname },
            { type : "MsgUserSetAvatarId",          callback : this._onNotifyMsgUserSetAvatarId },
        ]);
        this._setUiListenerArray([
            { ui : this._labelTitle,             callback : this._onTouchedLabelTitle },
            { ui : this._btnChat,                callback : this._onTouchedBtnChat },
            { ui : this._btnSetProfile,          callback : this._onTouchedBtnSetProfile },
            { ui : this._btnSetRelation,         callback : this._onTouchedBtnSetRelation },
            { ui : this._btnSetPrivilege,        callback : this._onTouchedBtnSetPrivilege },
            { ui : this._btnMedal,               callback : this._onTouchedBtnMedal },
            { ui : this._btnRankStdHistory,      callback : this._onTouchedBtnRankStdHistory },
            { ui : this._btnStdStatistics,       callback : this._onTouchedBtnStdStatistics },
            { ui : this._btnRankFogHistory,      callback : this._onTouchedBtnRankFogHistory },
            { ui : this._btnFogStatistics,       callback : this._onTouchedBtnFogStatistics },
            { ui : this._btnMyWarRoomRecord,     callback : this._onTouchedBtnMyWarRoomRecord },
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnSwitch,              callback : this._onTouchedBtnSwitch },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateView();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId != null) {
            Users_Proxy.reqUserGetPublicInfo(userId);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserGetPublicInfo(): void {
        this._updateView();
    }
    private _onNotifyMsgUserSetNickname(): void {
        const userId = this.getOpenData()?.userId;
        if ((userId != null) && (userId === Users_Model.getSelfUserId())) {
            Users_Proxy.reqUserGetPublicInfo(userId);
        }
    }
    private _onNotifyMsgUserSetAvatarId(): void {
        const userId = this.getOpenData()?.userId;
        if ((userId != null) && (userId === Users_Model.getSelfUserId())) {
            Users_Proxy.reqUserGetPublicInfo(userId);
        }
    }

    private async _onTouchedLabelTitle(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const nickname = await Users_Model.getUserNickname(userId);
        if (nickname == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (navigator?.clipboard?.writeText == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0275));
        } else {
            try {
                navigator.clipboard.writeText(nickname);
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0839));
            } catch {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0275));
            }
        }
    }
    private _onTouchedBtnChat(): void {
        const userId = this.getOpenData()?.userId;
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, { toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toUserId : userId }) });
    }
    private _onTouchedBtnSetProfile(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserProfileSettingsPanel, void 0);
    }
    private _onTouchedBtnSetRelation(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetRelationPanel, { userId : userId });
    }
    private _onTouchedBtnSetPrivilege(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().GmSetUserFullPrivilegePanel, { userId : userId });
        this.closePanel();
    }
    private async _onTouchedBtnMedal(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const medalIdArray  = (await Users_Model.getUserPublicInfo(userId))?.getShowMedalIdArray();
        const medalId       = medalIdArray ? medalIdArray[0] : null;
        const desc          = medalId == null ? null : Lang_Utils.getMedalDesc(medalId);
        if (desc) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => desc,
            });
        }
    }
    private _onTouchedBtnStdStatistics(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserMpwStatisticsPanel, {
            userId : userId,
        });
    }
    private _onTouchedBtnRankStdHistory(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserWarHistoryPanel, {
            userId      : userId,
            historyType : AuxiliaryTypes_AuxiliaryTypes.UserWarHistoryType.RankStd,
        });
    }
    private _onTouchedBtnFogStatistics(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserMpwStatisticsPanel, {
            userId : userId,
        });
    }
    private _onTouchedBtnRankFogHistory(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserWarHistoryPanel, {
            userId      : userId,
            historyType : AuxiliaryTypes_AuxiliaryTypes.UserWarHistoryType.RankFow,
        });
    }
    private _onTouchedBtnMyWarRoomRecord(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmMyWarRoomRecordPanel, void 0);
    }
    private _onTouchedBtnSwitch(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonSearchSingleUserPanel, {
            getTitleText      : null,
            callbackOnConfirm : userId => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, {
                userId : userId,
            }),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForUserPublicInfo();
        this._updateLabelLastActivityTime();
        this._updateLabelOnlineTime();
        this._updateGroupTopButtons();
        this._updateImgAvatar();
        this._updateImgOnlineState();
        this._updateBtnMedal();
        this._updateBtnSetProfile();
    }

    private async _updateComponentsForUserPublicInfo(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const info = await Users_Model.getUserPublicInfo(userId);
        if (info) {
            updateLabelsForTime(info.getRegisterTime(), this._labelRegisterTime1, this._labelRegisterTime2);
            updateLabelsForTime(info.getLastLoginTime(), this._labelLastLoginTime1, this._labelLastLoginTime2);

            this._labelLoginCount.setText(`${info.getLoginCount()}`);
            this._labelUserId.setText(`${userId}`);
        }
    }

    private async _updateLabelLastActivityTime(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const userOnlineState = await Users_Model.getUserOnlineState(userId);
        if (userOnlineState) {
            updateLabelsForTime(userOnlineState.lastActivityTimestamp, this._labelLastActivityTime1, this._labelLastActivityTime2);
        }
    }

    private _updateGroupTopButtons(): void {
        const group = this._groupTopButtons;
        group.removeAllItems(false);

        const privilege = Users_Model.getSelfUserPrivilege();
        if ((privilege != null)                                             &&
            ((privilege.getIsAdmin()) || (privilege.getIsChatManager()))
        ) {
            group.addItem(this._btnSetPrivilege, false);
        }

        if (this.getOpenData()?.userId !== Users_Model.getSelfUserId()) {
            group.addItem(this._btnChat, false);
            group.addItem(this._btnSetRelation, false);
        }

        group.arrangeItems();
    }

    private async _updateImgAvatar(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const info = await Users_Model.getUserPublicInfo(userId);
        return this._imgAvatar.loadSource(Helpers_ImageSource.getUserAvatar(info?.getAvatarId() ?? 1));
    }

    private async _updateImgOnlineState(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        return this._imgOnlineState.loadSource(Helpers_ImageSource.getUserOnlineState(await Users_Model.getUserOnlineState(userId)));
    }

    private async _updateBtnMedal(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const medalIdArray  = (await Users_Model.getUserPublicInfo(userId))?.getShowMedalIdArray();
        const medalId       = medalIdArray ? medalIdArray[0] : null;
        const btnMedal      = this._btnMedal;
        if (medalId == null) {
            btnMedal.setIsVisible(false);
        } else {
            btnMedal.setIsVisible(true);
            btnMedal.setIconSource(Helpers_ImageSource.getMedal(medalId));
        }
    }

    private _updateBtnSetProfile(): void {
        this._btnSetProfile.setIsVisible(this.getOpenData()?.userId === Users_Model.getSelfUserId());
    }

    private _updateComponentsForLanguage(): void {
        this._labelStdRank.setLangText(Lang_Constants.TextType.B1328);
        this._labelStdRankScoreTitle.setLangText(Lang_Constants.TextType.B0060);
        this._labelStdGamesTitle.setLangText(Lang_Constants.TextType.B0252);

        this._labelFogRank.setLangText(Lang_Constants.TextType.B1329);
        this._labelFogRankScoreTitle.setLangText(Lang_Constants.TextType.B0060);
        this._labelFogGamesTitle.setLangText(Lang_Constants.TextType.B0252);

        this._labelSpmRankScoreTitle.setLangText(Lang_Constants.TextType.B0819);
        this._labelUserIdTitle.setLangText(Lang_Constants.TextType.B0640);
        this._labelRegisterTimeTitle.setLangText(Lang_Constants.TextType.B0194);
        this._labelLastLoginTimeTitle.setLangText(Lang_Constants.TextType.B0195);
        this._labelOnlineTimeTitle.setLangText(Lang_Constants.TextType.B0196);
        this._labelLoginCountTitle.setLangText(Lang_Constants.TextType.B0197);
        this._labelLastActivityTimeTitle.setLangText(Lang_Constants.TextType.B0917);
        this._btnSetProfile.setLangText(Lang_Constants.TextType.B0560);
        this._labelSpmRank.setLangText(Lang_Constants.TextType.B0614);

        this._updateLabelTitle();
        this._updateComponentsForMultiPlayerStd();
        this._updateComponentsForMultiPlayerFog();
        this._updateComponentsForSpmRank();
    }

    private async _updateLabelTitle(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const nickname = await Users_Model.getUserNickname(userId);
        this._labelTitle.setText(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0009, nickname));
    }
    private async _updateComponentsForMultiPlayerStd(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const data          = await Users_Model.getUserMrwRankScoreInfo(userId, WarTypes_Constants.WarTypeId.MrwStd, 2);
        const rawScore      = data?.getCurrentScore();
        const score         = rawScore != null ? rawScore : MultiRankedWars_Constants.Common.InitialScore;
        // const rankName   = `(${Lang.getRankName(score, await GameConfig.GameConfigurationManager.getLatestGameConfig()) ?? Lang.ErrorTextForUndefined})`;
        const rankIndex     = await Leaderboard_Model_LeaderboardModel.getMrwRankIndex(WarTypes_Constants.WarTypeId.MrwStd, userId);
        const textForRank   = rankIndex == null ? Lang_Utils.getText(Lang_Constants.TextType.B0435) : `${rankIndex}${Helpers_Text.getSuffixForRankIndex(rankIndex)}`;
        this._labelStdRankScore.setText(`${score} (${textForRank})`);
        this._labelStdGames.setText(`${await getUserMpwGamesCount(userId, false)}`);
    }
    private async _updateComponentsForMultiPlayerFog(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const data          = await Users_Model.getUserMrwRankScoreInfo(userId, WarTypes_Constants.WarTypeId.MrwFog, 2);
        const rawScore      = data?.getCurrentScore();
        const score         = rawScore != null ? rawScore : MultiRankedWars_Constants.Common.InitialScore;
        // const rankName   = `(${Lang.getRankName(score, await GameConfig.GameConfigurationManager.getLatestGameConfig()) ?? Lang.ErrorTextForUndefined})`;
        const rankIndex     = await Leaderboard_Model_LeaderboardModel.getMrwRankIndex(WarTypes_Constants.WarTypeId.MrwFog, userId);
        const textForRank   = rankIndex == null ? Lang_Utils.getText(Lang_Constants.TextType.B0435) : `${rankIndex}${Helpers_Text.getSuffixForRankIndex(rankIndex)}`;
        this._labelFogRankScore.setText(`${score} (${textForRank})`);
        this._labelFogGames.setText(`${await getUserMpwGamesCount(userId, true)}`);
    }
    private async _updateComponentsForSpmRank(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        this._btnMyWarRoomRecord.setIsVisible(userId === Users_Model.getSelfUserId());

        const rankInfo      = await Leaderboard_Model_LeaderboardModel.getSpmOverallRankInfo(userId);
        const rankScore     = rankInfo?.score ?? 0;
        const rankIndex     = rankInfo?.rankIndex ?? 0;
        const isRankValid   = (rankIndex > 0) && (rankScore > 0);
        const textForRank   = isRankValid ? `${rankIndex}${Helpers_Text.getSuffixForRankIndex(rankIndex)}` : Lang_Utils.getText(Lang_Constants.TextType.B0435);
        const textForScore  = rankScore > 0 ? Helpers_Text.format(`%.2f`, rankScore) : `--`;
        this._labelSpmRankScore.setText(`${textForScore} (${textForRank})`);
    }
    private async _updateLabelOnlineTime(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const info          = await Users_Model.getUserPublicInfo(userId);
        const onlineTime    = info?.getOnlineTime();
        this._labelOnlineTime.setText(onlineTime == null ? Lang_Constants.UndefinedError : Lang_Utils.getTimeDurationText2(onlineTime));
    }
}

function updateLabelsForTime(time: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>, label1: Ui_Interfaces_IUiLabel.IUiLabel, label2: Ui_Interfaces_IUiLabel.IUiLabel): void {
    if (time == null) {
        label1.setText(Lang_Constants.UndefinedError);
        label2.setText(Lang_Constants.UndefinedError);
    } else {
        label1.setText(Lang_Utils.getTimestampShortText(time, { hour : false, minute : false, second : false }));
        label2.setText(Lang_Utils.getTimestampShortText(time, { year : false, month : false, date : false }));
    }

    const parent = label1.getParent();
    if (parent instanceof Ui_Components_UiLayoutBase.UiLayoutBase) {
        parent.arrangeItems();
    }
}

async function getUserMpwGamesCount(userId: number, hasFog: boolean): Promise<number> {
    let totalCount = 0;
    for (const data of (await Users_Model.getUserPublicInfo(userId))?.getUserMpwStatisticsArray() ?? []) {
        const warType   = data.getWarType() ?? 0;
        const count     = (data.getDraws() ?? 0) + (data.getLoses() ?? 0) + (data.getWins() ?? 0);
        if (hasFog) {
            if ((warType === WarTypes_Constants.WarTypeId.AtwFog)   ||
                (warType === WarTypes_Constants.WarTypeId.CcwFog)   ||
                (warType === WarTypes_Constants.WarTypeId.McwFog)   ||
                (warType === WarTypes_Constants.WarTypeId.MfwFog)   ||
                (warType === WarTypes_Constants.WarTypeId.MmwFog)   ||
                (warType === WarTypes_Constants.WarTypeId.MrwFog)
            ) {
                totalCount += count;
            }
        } else {
            if ((warType === WarTypes_Constants.WarTypeId.AtwStd)   ||
                (warType === WarTypes_Constants.WarTypeId.CcwStd)   ||
                (warType === WarTypes_Constants.WarTypeId.McwStd)   ||
                (warType === WarTypes_Constants.WarTypeId.MfwStd)   ||
                (warType === WarTypes_Constants.WarTypeId.MmwStd)   ||
                (warType === WarTypes_Constants.WarTypeId.MrwStd)
            ) {
                totalCount += count;
            }
        }
    }
    return totalCount;
}
