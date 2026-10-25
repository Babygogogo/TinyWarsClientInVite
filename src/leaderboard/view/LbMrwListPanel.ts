import { getMrwRankList } from "../../common/model/CommonModel.ts";
import { reqGetRankList } from "../../common/model/CommonProxy.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { MultiRankedWar } from "../../gameConfig/GcWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getUserAvatar, getMedal } from "../../helpers/ImageSource.ts";
import { newError } from "../../helpers/Misc.ts";
import { format } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { getMrwRankIndex } from "../model/LeaderboardModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfUserId, getSelfInfo, getUserPublicInfo } from "../../users/Model.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnSwitch!        : IUiButton;
    private readonly _btnClose!         : IUiButton;

    private readonly _labelStdRank!     : IUiLabel;
    private readonly _labelStdNickname! : IUiLabel;
    private readonly _labelStdScore!    : IUiLabel;
    private readonly _labelStdWin!      : IUiLabel;
    private readonly _labelStdLose!     : IUiLabel;
    private readonly _labelStdDraw!     : IUiLabel;
    private readonly _labelStdWinRate!  : IUiLabel;
    private readonly _listStd!          : IUiScrollList<DataForMrwUserRenderer>;
    private readonly _labelStdNoData!   : IUiLabel;

    private readonly _groupMyInfo!      : IUiContainer;
    private readonly _layoutName!       : IUiLayout;
    private readonly _labelMyIndex!     : IUiLabel;
    private readonly _imgMyAvatar!      : IUiImage;
    private readonly _labelMyNickname!  : IUiLabel;
    private readonly _imgMyMedal!       : IUiImage;
    private readonly _labelMyScore!     : IUiLabel;
    private readonly _labelMyWin!       : IUiLabel;
    private readonly _labelMyLose!      : IUiLabel;
    private readonly _labelMyDraw!      : IUiLabel;
    private readonly _labelMyWinRate!   : IUiLabel;

    private _isStd                      = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCommonGetRankList,   callback: this._onMsgCommonGetRankList },
        ]);
        this._setUiListenerArray([
            { ui: this._btnSwitch,      callback: this._onTouchedBtnSwitch },
            { ui: this._groupMyInfo,    callback: this._onTouchedGroupMyInfo },
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listStd.setItemRendererClass(MrwUserRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        reqGetRankList();

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
        const userId = getSelfUserId();
        if (userId != null) {
            openPanel(getDict().UserPanel, { userId: userId });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelStdNoData.setText(getText(TextType.B0278));
        this._labelStdRank.setText(getText(TextType.B0904));
        this._labelStdNickname.setText(getText(TextType.B0175));
        this._labelStdScore.setText(getText(TextType.B0579));
        this._labelStdWin.setText(getText(TextType.B0550));
        this._labelStdLose.setText(getText(TextType.B0551));
        this._labelStdDraw.setText(getText(TextType.B0552));
        this._labelStdWinRate.setText(getText(TextType.B0553));

        this._updateLabelTitle();
    }
    private _updateLabelTitle(): void {
        this._labelTitle.setText(`${getText(TextType.B1102)} (${getText(this._isStd ? TextType.B0548 : TextType.B0549)})`);
    }
    private async _updateComponentsForListStd(): Promise<void> {
        const playersCount  = 2;
        const warType       = this._isStd ? WarTypeId.MrwStd : WarTypeId.MrwFog;
        const gameConfig    = await getLatestGameConfig();
        const dataList      : DataForMrwUserRenderer[] = [];
        for (const data of getMrwRankList() || []) {
            if ((data.getPlayersCountUnneutral() === playersCount) && (data.getWarType() === warType)) {
                const userId = data.getUserId();
                if (userId == null) {
                    throw newError(`LbMrwListPanel._updateComponentsForStd() empty userId.`);
                }

                dataList.push({
                    gameConfig      : gameConfig,
                    rank            : dataList.length + 1,
                    userId          : userId,
                    warType         : warType,
                    playersCount    : playersCount,
                    isLast          : false,
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
        const userInfo  = getSelfInfo();
        if (userInfo == null) {
            group.setIsVisible(false);
            return;
        }

        const isStd         = this._isStd;
        const warType       = isStd ? WarTypeId.MrwStd : WarTypeId.MrwFog;
        const gameConfig    = await getLatestGameConfig();
        const rankIndex     = await getMrwRankIndex(warType, userInfo.getUserId() ?? 0);
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
        this._imgMyAvatar.loadSource(getUserAvatar(userComplexInfo?.getAvatarId() ?? 1));
        this._labelMyNickname.setText(userInfo.getNickname() ?? UndefinedError);
        this._imgMyMedal.loadSource(medalId == null ? `` : getMedal(medalId));
        this._labelMyScore.setText(`${rankInfo?.getCurrentScore() ?? MultiRankedWar.InitialScore}`);
        this._labelMyWin.setText(`${winCount}`);
        this._labelMyLose.setText(`${loseCount}`);
        this._labelMyDraw.setText(`${drawCount}`);
        this._labelMyWinRate.setText(gamesCount > 0 ? `${format(`%.2f`, winCount * 100 / gamesCount)}` : `--`);

        this._layoutName.arrangeItems();
    }
}

interface DataForMrwUserRenderer extends UiListItemData {
    gameConfig      : GcData;
    rank            : number;
    userId          : number;
    playersCount    : number;
    warType         : WarTypeId;
    isLast          : boolean;
}
class MrwUserRenderer
    extends     UiListItemRenderer<DataForMrwUserRenderer>
    implements  IUiListItemRenderer<DataForMrwUserRenderer>
{
    private readonly _group!            : IUiContainer;
    private readonly _imgBottom!        : IUiImage;
    private readonly _labelIndex!       : IUiLabel;
    private readonly _imgAvatar!        : IUiImage;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelNickname!    : IUiLabel;
    private readonly _imgMedal!         : IUiImage;

    private readonly _labelScore!       : IUiLabel;
    private readonly _labelWin!         : IUiLabel;
    private readonly _labelLose!        : IUiLabel;
    private readonly _labelDraw!        : IUiLabel;
    private readonly _labelWinRate!     : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        openPanel(getDict().UserPanel, { userId: this.getOpenData()?.userId });
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
        const userInfo  = await getUserPublicInfo(userId);
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
        imgAvatar.loadSource(getUserAvatar(userInfo.getAvatarId() ?? 1));
        labelNickname.setText(userInfo.getNickname() ?? UndefinedError);
        imgMedal.loadSource(medalId == null ? `` : getMedal(medalId));
        labelScore.setText(`${rankInfo?.getCurrentScore() ?? MultiRankedWar.InitialScore}`);
        labelWin.setText(`${winCount}`);
        labelLose.setText(`${loseCount}`);
        labelDraw.setText(`${drawCount}`);
        labelWinRate.setText(gamesCount > 0 ? `${format(`%.2f`, winCount * 100 / gamesCount)}` : `--`);

        this._layoutName.arrangeItems();
    }
}
