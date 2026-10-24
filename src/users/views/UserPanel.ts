import * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LeaderboardModelLeaderboardModel from "../../leaderboard/model/LeaderboardModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgOnlineState!               : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnSwitch!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _groupTopButtons!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnChat!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetProfile!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetRelation!               : UiInterfacesIUiButton.IUiButton;

    private readonly _imgAvatar!                    : UiInterfacesIUiImage.IUiImage;
    private readonly _imgLogo!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _btnMedal!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetPrivilege!              : UiInterfacesIUiButton.IUiButton;

    private readonly _labelStdRank!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdRankScoreTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdRankScore!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdGamesTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdGames!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnRankStdHistory!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnStdStatistics!             : UiInterfacesIUiButton.IUiButton;

    private readonly _labelFogRank!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFogRankScoreTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFogRankScore!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFogGamesTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFogGames!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnRankFogHistory!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnFogStatistics!             : UiInterfacesIUiButton.IUiButton;

    private readonly _labelSpmRank!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSpmRankScoreTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSpmRankScore!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnMyWarRoomRecord!           : UiInterfacesIUiButton.IUiButton;

    private readonly _labelRegisterTimeTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRegisterTime1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRegisterTime2!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLastLoginTimeTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLastLoginTime1!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLastLoginTime2!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOnlineTimeTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOnlineTime!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoginCountTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoginCount!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUserId!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUserIdTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLastActivityTimeTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLastActivityTime1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLastActivityTime2!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserGetPublicInfo,        callback: this._onNotifyMsgUserGetPublicInfo },
            { type: NotificationsTypeId.TypeId.MsgUserSetNickname,          callback: this._onNotifyMsgUserSetNickname },
            { type: NotificationsTypeId.TypeId.MsgUserSetAvatarId,          callback: this._onNotifyMsgUserSetAvatarId },
        ]);
        this._setUiListenerArray([
            { ui: this._labelTitle,             callback: this._onTouchedLabelTitle },
            { ui: this._btnChat,                callback: this._onTouchedBtnChat },
            { ui: this._btnSetProfile,          callback: this._onTouchedBtnSetProfile },
            { ui: this._btnSetRelation,         callback: this._onTouchedBtnSetRelation },
            { ui: this._btnSetPrivilege,        callback: this._onTouchedBtnSetPrivilege },
            { ui: this._btnMedal,               callback: this._onTouchedBtnMedal },
            { ui: this._btnRankStdHistory,      callback: this._onTouchedBtnRankStdHistory },
            { ui: this._btnStdStatistics,       callback: this._onTouchedBtnStdStatistics },
            { ui: this._btnRankFogHistory,      callback: this._onTouchedBtnRankFogHistory },
            { ui: this._btnFogStatistics,       callback: this._onTouchedBtnFogStatistics },
            { ui: this._btnMyWarRoomRecord,     callback: this._onTouchedBtnMyWarRoomRecord },
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnSwitch,              callback: this._onTouchedBtnSwitch },
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
            UsersProxy.reqUserGetPublicInfo(userId);
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
        if ((userId != null) && (userId === UsersModel.getSelfUserId())) {
            UsersProxy.reqUserGetPublicInfo(userId);
        }
    }
    private _onNotifyMsgUserSetAvatarId(): void {
        const userId = this.getOpenData()?.userId;
        if ((userId != null) && (userId === UsersModel.getSelfUserId())) {
            UsersProxy.reqUserGetPublicInfo(userId);
        }
    }

    private async _onTouchedLabelTitle(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const nickname = await UsersModel.getUserNickname(userId);
        if (nickname == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (navigator?.clipboard?.writeText == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0275));
        } else {
            try {
                navigator.clipboard.writeText(nickname);
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0839));
            } catch {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0275));
            }
        }
    }
    private _onTouchedBtnChat(): void {
        const userId = this.getOpenData()?.userId;
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({ toUserId: userId }) });
    }
    private _onTouchedBtnSetProfile(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserProfileSettingsPanel, void 0);
    }
    private _onTouchedBtnSetRelation(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetRelationPanel, { userId: userId });
    }
    private _onTouchedBtnSetPrivilege(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().GmSetUserFullPrivilegePanel, { userId: userId });
        this.closePanel();
    }
    private async _onTouchedBtnMedal(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const medalIdArray  = (await UsersModel.getUserPublicInfo(userId))?.getShowMedalIdArray();
        const medalId       = medalIdArray ? medalIdArray[0] : null;
        const desc          = medalId == null ? null : LangUtils.getMedalDesc(medalId);
        if (desc) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => desc,
            });
        }
    }
    private _onTouchedBtnStdStatistics(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserMpwStatisticsPanel, {
            userId  : userId,
        });
    }
    private _onTouchedBtnRankStdHistory(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserWarHistoryPanel, {
            userId      : userId,
            historyType : AuxiliaryTypesAuxiliaryTypes.UserWarHistoryType.RankStd,
        });
    }
    private _onTouchedBtnFogStatistics(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserMpwStatisticsPanel, {
            userId  : userId,
        });
    }
    private _onTouchedBtnRankFogHistory(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserWarHistoryPanel, {
            userId      : userId,
            historyType : AuxiliaryTypesAuxiliaryTypes.UserWarHistoryType.RankFow,
        });
    }
    private _onTouchedBtnMyWarRoomRecord(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmMyWarRoomRecordPanel, void 0);
    }
    private _onTouchedBtnSwitch(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonSearchSingleUserPanel, {
            getTitleText        : null,
            callbackOnConfirm   : userId => GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, {
                userId  : userId,
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

        const info = await UsersModel.getUserPublicInfo(userId);
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

        const userOnlineState = await UsersModel.getUserOnlineState(userId);
        if (userOnlineState) {
            updateLabelsForTime(userOnlineState.lastActivityTimestamp, this._labelLastActivityTime1, this._labelLastActivityTime2);
        }
    }

    private _updateGroupTopButtons(): void {
        const group = this._groupTopButtons;
        group.removeAllItems(false);

        const privilege = UsersModel.getSelfUserPrivilege();
        if ((privilege != null)                                             &&
            ((privilege.getIsAdmin()) || (privilege.getIsChatManager()))
        ) {
            group.addItem(this._btnSetPrivilege, false);
        }

        if (this.getOpenData()?.userId !== UsersModel.getSelfUserId()) {
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

        const info = await UsersModel.getUserPublicInfo(userId);
        return this._imgAvatar.loadSource(HelpersImageSource.getUserAvatar(info?.getAvatarId() ?? 1));
    }

    private async _updateImgOnlineState(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        return this._imgOnlineState.loadSource(HelpersImageSource.getUserOnlineState(await UsersModel.getUserOnlineState(userId)));
    }

    private async _updateBtnMedal(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const medalIdArray  = (await UsersModel.getUserPublicInfo(userId))?.getShowMedalIdArray();
        const medalId       = medalIdArray ? medalIdArray[0] : null;
        const btnMedal      = this._btnMedal;
        if (medalId == null) {
            btnMedal.setIsVisible(false);
        } else {
            btnMedal.setIsVisible(true);
            btnMedal.setIconSource(HelpersImageSource.getMedal(medalId));
        }
    }

    private _updateBtnSetProfile(): void {
        this._btnSetProfile.setIsVisible(this.getOpenData()?.userId === UsersModel.getSelfUserId());
    }

    private _updateComponentsForLanguage(): void {
        this._labelStdRank.setLangText(LangConstants.TextType.B1328);
        this._labelStdRankScoreTitle.setLangText(LangConstants.TextType.B0060);
        this._labelStdGamesTitle.setLangText(LangConstants.TextType.B0252);

        this._labelFogRank.setLangText(LangConstants.TextType.B1329);
        this._labelFogRankScoreTitle.setLangText(LangConstants.TextType.B0060);
        this._labelFogGamesTitle.setLangText(LangConstants.TextType.B0252);

        this._labelSpmRankScoreTitle.setLangText(LangConstants.TextType.B0819);
        this._labelUserIdTitle.setLangText(LangConstants.TextType.B0640);
        this._labelRegisterTimeTitle.setLangText(LangConstants.TextType.B0194);
        this._labelLastLoginTimeTitle.setLangText(LangConstants.TextType.B0195);
        this._labelOnlineTimeTitle.setLangText(LangConstants.TextType.B0196);
        this._labelLoginCountTitle.setLangText(LangConstants.TextType.B0197);
        this._labelLastActivityTimeTitle.setLangText(LangConstants.TextType.B0917);
        this._btnSetProfile.setLangText(LangConstants.TextType.B0560);
        this._labelSpmRank.setLangText(LangConstants.TextType.B0614);

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

        const nickname = await UsersModel.getUserNickname(userId);
        this._labelTitle.setText(LangUtils.getFormattedText(LangConstants.TextType.F0009, nickname));
    }
    private async _updateComponentsForMultiPlayerStd(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const data          = await UsersModel.getUserMrwRankScoreInfo(userId, WarTypesConstants.WarTypeId.MrwStd, 2);
        const rawScore      = data?.getCurrentScore();
        const score         = rawScore != null ? rawScore : GameConfigGcWar.MultiRankedWar.InitialScore;
        // const rankName   = `(${Lang.getRankName(score, await GameConfig.GameConfigurationManager.getLatestGameConfig()) ?? Lang.ErrorTextForUndefined})`;
        const rankIndex     = await LeaderboardModelLeaderboardModel.getMrwRankIndex(WarTypesConstants.WarTypeId.MrwStd, userId);
        const textForRank   = rankIndex == null ? LangUtils.getText(LangConstants.TextType.B0435) : `${rankIndex}${HelpersText.getSuffixForRankIndex(rankIndex)}`;
        this._labelStdRankScore.setText(`${score} (${textForRank})`);
        this._labelStdGames.setText(`${await getUserMpwGamesCount(userId, false)}`);
    }
    private async _updateComponentsForMultiPlayerFog(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const data          = await UsersModel.getUserMrwRankScoreInfo(userId, WarTypesConstants.WarTypeId.MrwFog, 2);
        const rawScore      = data?.getCurrentScore();
        const score         = rawScore != null ? rawScore : GameConfigGcWar.MultiRankedWar.InitialScore;
        // const rankName   = `(${Lang.getRankName(score, await GameConfig.GameConfigurationManager.getLatestGameConfig()) ?? Lang.ErrorTextForUndefined})`;
        const rankIndex     = await LeaderboardModelLeaderboardModel.getMrwRankIndex(WarTypesConstants.WarTypeId.MrwFog, userId);
        const textForRank   = rankIndex == null ? LangUtils.getText(LangConstants.TextType.B0435) : `${rankIndex}${HelpersText.getSuffixForRankIndex(rankIndex)}`;
        this._labelFogRankScore.setText(`${score} (${textForRank})`);
        this._labelFogGames.setText(`${await getUserMpwGamesCount(userId, true)}`);
    }
    private async _updateComponentsForSpmRank(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        this._btnMyWarRoomRecord.setIsVisible(userId === UsersModel.getSelfUserId());

        const rankInfo      = await LeaderboardModelLeaderboardModel.getSpmOverallRankInfo(userId);
        const rankScore     = rankInfo?.score ?? 0;
        const rankIndex     = rankInfo?.rankIndex ?? 0;
        const isRankValid   = (rankIndex > 0) && (rankScore > 0);
        const textForRank   = isRankValid ? `${rankIndex}${HelpersText.getSuffixForRankIndex(rankIndex)}` : LangUtils.getText(LangConstants.TextType.B0435);
        const textForScore  = rankScore > 0 ? HelpersText.format(`%.2f`, rankScore) : `--`;
        this._labelSpmRankScore.setText(`${textForScore} (${textForRank})`);
    }
    private async _updateLabelOnlineTime(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const info          = await UsersModel.getUserPublicInfo(userId);
        const onlineTime    = info?.getOnlineTime();
        this._labelOnlineTime.setText(onlineTime == null ? LangConstants.UndefinedError : LangUtils.getTimeDurationText2(onlineTime));
    }
}

function updateLabelsForTime(time: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>, label1: UiInterfacesIUiLabel.IUiLabel, label2: UiInterfacesIUiLabel.IUiLabel): void {
    if (time == null) {
        label1.setText(LangConstants.UndefinedError);
        label2.setText(LangConstants.UndefinedError);
    } else {
        label1.setText(LangUtils.getTimestampShortText(time, { hour: false, minute: false, second: false }));
        label2.setText(LangUtils.getTimestampShortText(time, { year: false, month: false, date: false }));
    }

    const parent = label1.getParent();
    if (parent instanceof UiUtilsUiFactory.getUiLayoutBaseClass()) {
        parent.arrangeItems();
    }
}

async function getUserMpwGamesCount(userId: number, hasFog: boolean): Promise<number> {
    let totalCount = 0;
    for (const data of (await UsersModel.getUserPublicInfo(userId))?.getUserMpwStatisticsArray() ?? []) {
        const warType   = data.getWarType() ?? 0;
        const count     = (data.getDraws() ?? 0) + (data.getLoses() ?? 0) + (data.getWins() ?? 0);
        if (hasFog) {
            if ((warType === WarTypesConstants.WarTypeId.AtwFog)   ||
                (warType === WarTypesConstants.WarTypeId.CcwFog)   ||
                (warType === WarTypesConstants.WarTypeId.McwFog)   ||
                (warType === WarTypesConstants.WarTypeId.MfwFog)   ||
                (warType === WarTypesConstants.WarTypeId.MmwFog)   ||
                (warType === WarTypesConstants.WarTypeId.MrwFog)
            ) {
                totalCount += count;
            }
        } else {
            if ((warType === WarTypesConstants.WarTypeId.AtwStd)   ||
                (warType === WarTypesConstants.WarTypeId.CcwStd)   ||
                (warType === WarTypesConstants.WarTypeId.McwStd)   ||
                (warType === WarTypesConstants.WarTypeId.MfwStd)   ||
                (warType === WarTypesConstants.WarTypeId.MmwStd)   ||
                (warType === WarTypesConstants.WarTypeId.MrwStd)
            ) {
                totalCount += count;
            }
        }
    }
    return totalCount;
}
