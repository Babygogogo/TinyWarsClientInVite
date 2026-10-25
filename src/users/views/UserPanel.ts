import { UserWarHistoryType, type Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { show } from "../../FloatText.ts";
import { MultiRankedWar } from "../../gameConfig/GcWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getUserAvatar, getUserOnlineState, getMedal } from "../../helpers/ImageSource.ts";
import { getSuffixForRankIndex, format } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getMedalDesc, getFormattedText, getTimeDurationText2, getTimestampShortText } from "../../lang/Utils.ts";
import { getMrwRankIndex, getSpmOverallRankInfo } from "../../leaderboard/model/LeaderboardModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getUiLayoutBaseClass } from "../../ui/utils/UiFactory.ts";
import {
    getSelfUserId,
    getUserNickname,
    getUserPublicInfo,
    getUserOnlineState as UsersModelGetUserOnlineState,
    getSelfUserPrivilege,
    getUserMrwRankScoreInfo,
} from "../Model.ts";
import { reqUserGetPublicInfo } from "../Proxy.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _imgOnlineState!               : IUiImage;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnSwitch!                    : IUiButton;
    private readonly _btnClose!                     : IUiButton;

    private readonly _groupTopButtons!              : IUiLayout;
    private readonly _btnChat!                      : IUiButton;
    private readonly _btnSetProfile!                : IUiButton;
    private readonly _btnSetRelation!               : IUiButton;

    private readonly _imgAvatar!                    : IUiImage;
    private readonly _imgLogo!                      : IUiImage;
    private readonly _btnMedal!                     : IUiButton;
    private readonly _btnSetPrivilege!              : IUiButton;

    private readonly _labelStdRank!                 : IUiLabel;
    private readonly _labelStdRankScoreTitle!       : IUiLabel;
    private readonly _labelStdRankScore!            : IUiLabel;
    private readonly _labelStdGamesTitle!           : IUiLabel;
    private readonly _labelStdGames!                : IUiLabel;
    private readonly _btnRankStdHistory!            : IUiButton;
    private readonly _btnStdStatistics!             : IUiButton;

    private readonly _labelFogRank!                 : IUiLabel;
    private readonly _labelFogRankScoreTitle!       : IUiLabel;
    private readonly _labelFogRankScore!            : IUiLabel;
    private readonly _labelFogGamesTitle!           : IUiLabel;
    private readonly _labelFogGames!                : IUiLabel;
    private readonly _btnRankFogHistory!            : IUiButton;
    private readonly _btnFogStatistics!             : IUiButton;

    private readonly _labelSpmRank!                 : IUiLabel;
    private readonly _labelSpmRankScoreTitle!       : IUiLabel;
    private readonly _labelSpmRankScore!            : IUiLabel;
    private readonly _btnMyWarRoomRecord!           : IUiButton;

    private readonly _labelRegisterTimeTitle!       : IUiLabel;
    private readonly _labelRegisterTime1!           : IUiLabel;
    private readonly _labelRegisterTime2!           : IUiLabel;
    private readonly _labelLastLoginTimeTitle!      : IUiLabel;
    private readonly _labelLastLoginTime1!          : IUiLabel;
    private readonly _labelLastLoginTime2!          : IUiLabel;
    private readonly _labelOnlineTimeTitle!         : IUiLabel;
    private readonly _labelOnlineTime!              : IUiLabel;
    private readonly _labelLoginCountTitle!         : IUiLabel;
    private readonly _labelLoginCount!              : IUiLabel;
    private readonly _labelUserId!                  : IUiLabel;
    private readonly _labelUserIdTitle!             : IUiLabel;
    private readonly _labelLastActivityTimeTitle!   : IUiLabel;
    private readonly _labelLastActivityTime1!       : IUiLabel;
    private readonly _labelLastActivityTime2!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserGetPublicInfo,        callback: this._onNotifyMsgUserGetPublicInfo },
            { type: TypeId.MsgUserSetNickname,          callback: this._onNotifyMsgUserSetNickname },
            { type: TypeId.MsgUserSetAvatarId,          callback: this._onNotifyMsgUserSetAvatarId },
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
            reqUserGetPublicInfo(userId);
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
        if ((userId != null) && (userId === getSelfUserId())) {
            reqUserGetPublicInfo(userId);
        }
    }
    private _onNotifyMsgUserSetAvatarId(): void {
        const userId = this.getOpenData()?.userId;
        if ((userId != null) && (userId === getSelfUserId())) {
            reqUserGetPublicInfo(userId);
        }
    }

    private async _onTouchedLabelTitle(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const nickname = await getUserNickname(userId);
        if (nickname == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (navigator?.clipboard?.writeText == null) {
            show(getText(TextType.A0275));
        } else {
            try {
                navigator.clipboard.writeText(nickname);
                show(getText(TextType.A0839));
            } catch {
                show(getText(TextType.A0275));
            }
        }
    }
    private _onTouchedBtnChat(): void {
        const userId = this.getOpenData()?.userId;
        this.closePanel();
        openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({ toUserId: userId }) });
    }
    private _onTouchedBtnSetProfile(): void {
        openPanel(getDict().UserProfileSettingsPanel, void 0);
    }
    private _onTouchedBtnSetRelation(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        openPanel(getDict().UserSetRelationPanel, { userId: userId });
    }
    private _onTouchedBtnSetPrivilege(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        openPanel(getDict().GmSetUserFullPrivilegePanel, { userId: userId });
        this.closePanel();
    }
    private async _onTouchedBtnMedal(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const medalIdArray  = (await getUserPublicInfo(userId))?.getShowMedalIdArray();
        const medalId       = medalIdArray ? medalIdArray[0] : null;
        const desc          = medalId == null ? null : getMedalDesc(medalId);
        if (desc) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => desc,
            });
        }
    }
    private _onTouchedBtnStdStatistics(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        openPanel(getDict().UserMpwStatisticsPanel, {
            userId  : userId,
        });
    }
    private _onTouchedBtnRankStdHistory(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        openPanel(getDict().UserWarHistoryPanel, {
            userId      : userId,
            historyType : UserWarHistoryType.RankStd,
        });
    }
    private _onTouchedBtnFogStatistics(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        openPanel(getDict().UserMpwStatisticsPanel, {
            userId  : userId,
        });
    }
    private _onTouchedBtnRankFogHistory(): void {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        openPanel(getDict().UserWarHistoryPanel, {
            userId      : userId,
            historyType : UserWarHistoryType.RankFow,
        });
    }
    private _onTouchedBtnMyWarRoomRecord(): void {
        openPanel(getDict().SpmMyWarRoomRecordPanel, void 0);
    }
    private _onTouchedBtnSwitch(): void {
        this.closePanel();
        openPanel(getDict().CommonSearchSingleUserPanel, {
            getTitleText        : null,
            callbackOnConfirm   : userId => openPanel(getDict().UserPanel, {
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

        const info = await getUserPublicInfo(userId);
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

        const userOnlineState = await UsersModelGetUserOnlineState(userId);
        if (userOnlineState) {
            updateLabelsForTime(userOnlineState.lastActivityTimestamp, this._labelLastActivityTime1, this._labelLastActivityTime2);
        }
    }

    private _updateGroupTopButtons(): void {
        const group = this._groupTopButtons;
        group.removeAllItems(false);

        const privilege = getSelfUserPrivilege();
        if ((privilege != null)                                             &&
            ((privilege.getIsAdmin()) || (privilege.getIsChatManager()))
        ) {
            group.addItem(this._btnSetPrivilege, false);
        }

        if (this.getOpenData()?.userId !== getSelfUserId()) {
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

        const info = await getUserPublicInfo(userId);
        return this._imgAvatar.loadSource(getUserAvatar(info?.getAvatarId() ?? 1));
    }

    private async _updateImgOnlineState(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        return this._imgOnlineState.loadSource(getUserOnlineState(await UsersModelGetUserOnlineState(userId)));
    }

    private async _updateBtnMedal(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const medalIdArray  = (await getUserPublicInfo(userId))?.getShowMedalIdArray();
        const medalId       = medalIdArray ? medalIdArray[0] : null;
        const btnMedal      = this._btnMedal;
        if (medalId == null) {
            btnMedal.setIsVisible(false);
        } else {
            btnMedal.setIsVisible(true);
            btnMedal.setIconSource(getMedal(medalId));
        }
    }

    private _updateBtnSetProfile(): void {
        this._btnSetProfile.setIsVisible(this.getOpenData()?.userId === getSelfUserId());
    }

    private _updateComponentsForLanguage(): void {
        this._labelStdRank.setLangText(TextType.B1328);
        this._labelStdRankScoreTitle.setLangText(TextType.B0060);
        this._labelStdGamesTitle.setLangText(TextType.B0252);

        this._labelFogRank.setLangText(TextType.B1329);
        this._labelFogRankScoreTitle.setLangText(TextType.B0060);
        this._labelFogGamesTitle.setLangText(TextType.B0252);

        this._labelSpmRankScoreTitle.setLangText(TextType.B0819);
        this._labelUserIdTitle.setLangText(TextType.B0640);
        this._labelRegisterTimeTitle.setLangText(TextType.B0194);
        this._labelLastLoginTimeTitle.setLangText(TextType.B0195);
        this._labelOnlineTimeTitle.setLangText(TextType.B0196);
        this._labelLoginCountTitle.setLangText(TextType.B0197);
        this._labelLastActivityTimeTitle.setLangText(TextType.B0917);
        this._btnSetProfile.setLangText(TextType.B0560);
        this._labelSpmRank.setLangText(TextType.B0614);

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

        const nickname = await getUserNickname(userId);
        this._labelTitle.setText(getFormattedText(TextType.F0009, nickname));
    }
    private async _updateComponentsForMultiPlayerStd(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const data          = await getUserMrwRankScoreInfo(userId, WarTypeId.MrwStd, 2);
        const rawScore      = data?.getCurrentScore();
        const score         = rawScore != null ? rawScore : MultiRankedWar.InitialScore;
        // const rankName   = `(${Lang.getRankName(score, await GameConfig.GameConfigurationManager.getLatestGameConfig()) ?? Lang.ErrorTextForUndefined})`;
        const rankIndex     = await getMrwRankIndex(WarTypeId.MrwStd, userId);
        const textForRank   = rankIndex == null ? getText(TextType.B0435) : `${rankIndex}${getSuffixForRankIndex(rankIndex)}`;
        this._labelStdRankScore.setText(`${score} (${textForRank})`);
        this._labelStdGames.setText(`${await getUserMpwGamesCount(userId, false)}`);
    }
    private async _updateComponentsForMultiPlayerFog(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const data          = await getUserMrwRankScoreInfo(userId, WarTypeId.MrwFog, 2);
        const rawScore      = data?.getCurrentScore();
        const score         = rawScore != null ? rawScore : MultiRankedWar.InitialScore;
        // const rankName   = `(${Lang.getRankName(score, await GameConfig.GameConfigurationManager.getLatestGameConfig()) ?? Lang.ErrorTextForUndefined})`;
        const rankIndex     = await getMrwRankIndex(WarTypeId.MrwFog, userId);
        const textForRank   = rankIndex == null ? getText(TextType.B0435) : `${rankIndex}${getSuffixForRankIndex(rankIndex)}`;
        this._labelFogRankScore.setText(`${score} (${textForRank})`);
        this._labelFogGames.setText(`${await getUserMpwGamesCount(userId, true)}`);
    }
    private async _updateComponentsForSpmRank(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        this._btnMyWarRoomRecord.setIsVisible(userId === getSelfUserId());

        const rankInfo      = await getSpmOverallRankInfo(userId);
        const rankScore     = rankInfo?.score ?? 0;
        const rankIndex     = rankInfo?.rankIndex ?? 0;
        const isRankValid   = (rankIndex > 0) && (rankScore > 0);
        const textForRank   = isRankValid ? `${rankIndex}${getSuffixForRankIndex(rankIndex)}` : getText(TextType.B0435);
        const textForScore  = rankScore > 0 ? format(`%.2f`, rankScore) : `--`;
        this._labelSpmRankScore.setText(`${textForScore} (${textForRank})`);
    }
    private async _updateLabelOnlineTime(): Promise<void> {
        const userId = this.getOpenData()?.userId;
        if (userId == null) {
            return;
        }

        const info          = await getUserPublicInfo(userId);
        const onlineTime    = info?.getOnlineTime();
        this._labelOnlineTime.setText(onlineTime == null ? UndefinedError : getTimeDurationText2(onlineTime));
    }
}

function updateLabelsForTime(time: Undefinable<number>, label1: IUiLabel, label2: IUiLabel): void {
    if (time == null) {
        label1.setText(UndefinedError);
        label2.setText(UndefinedError);
    } else {
        label1.setText(getTimestampShortText(time, { hour: false, minute: false, second: false }));
        label2.setText(getTimestampShortText(time, { year: false, month: false, date: false }));
    }

    const parent = label1.getParent();
    if (parent instanceof getUiLayoutBaseClass()) {
        parent.arrangeItems();
    }
}

async function getUserMpwGamesCount(userId: number, hasFog: boolean): Promise<number> {
    let totalCount = 0;
    for (const data of (await getUserPublicInfo(userId))?.getUserMpwStatisticsArray() ?? []) {
        const warType   = data.getWarType() ?? 0;
        const count     = (data.getDraws() ?? 0) + (data.getLoses() ?? 0) + (data.getWins() ?? 0);
        if (hasFog) {
            if ((warType === WarTypeId.AtwFog)   ||
                (warType === WarTypeId.CcwFog)   ||
                (warType === WarTypeId.McwFog)   ||
                (warType === WarTypeId.MfwFog)   ||
                (warType === WarTypeId.MmwFog)   ||
                (warType === WarTypeId.MrwFog)
            ) {
                totalCount += count;
            }
        } else {
            if ((warType === WarTypeId.AtwStd)   ||
                (warType === WarTypeId.CcwStd)   ||
                (warType === WarTypeId.McwStd)   ||
                (warType === WarTypeId.MfwStd)   ||
                (warType === WarTypeId.MmwStd)   ||
                (warType === WarTypeId.MrwStd)
            ) {
                totalCount += count;
            }
        }
    }
    return totalCount;
}
