import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as CommonModelCommonProxy from "../../common/model/CommonProxy.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LeaderboardModelLeaderboardModel from "../model/LeaderboardModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnSwitch!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _labelStdRank!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdNickname! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdScore!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdWin!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdLose!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdDraw!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdWinRate!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listStd!          : UiInterfacesIUiScrollList.IUiScrollList<DataForMrwUserRenderer>;
    private readonly _labelStdNoData!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupMyInfo!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMyIndex!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgMyAvatar!      : UiInterfacesIUiImage.IUiImage;
    private readonly _labelMyNickname!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgMyMedal!       : UiInterfacesIUiImage.IUiImage;
    private readonly _labelMyScore!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyWin!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyLose!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyDraw!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyWinRate!   : UiInterfacesIUiLabel.IUiLabel;

    private _isStd                      = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCommonGetRankList,   callback: this._onMsgCommonGetRankList },
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
        CommonModelCommonProxy.reqGetRankList();

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
        const userId = UsersModel.getSelfUserId();
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: userId });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelStdNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._labelStdRank.setText(LangUtils.getText(LangConstants.TextType.B0904));
        this._labelStdNickname.setText(LangUtils.getText(LangConstants.TextType.B0175));
        this._labelStdScore.setText(LangUtils.getText(LangConstants.TextType.B0579));
        this._labelStdWin.setText(LangUtils.getText(LangConstants.TextType.B0550));
        this._labelStdLose.setText(LangUtils.getText(LangConstants.TextType.B0551));
        this._labelStdDraw.setText(LangUtils.getText(LangConstants.TextType.B0552));
        this._labelStdWinRate.setText(LangUtils.getText(LangConstants.TextType.B0553));

        this._updateLabelTitle();
    }
    private _updateLabelTitle(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1102)} (${LangUtils.getText(this._isStd ? LangConstants.TextType.B0548 : LangConstants.TextType.B0549)})`);
    }
    private async _updateComponentsForListStd(): Promise<void> {
        const playersCount  = 2;
        const warType       = this._isStd ? WarTypesConstants.WarTypeId.MrwStd : WarTypesConstants.WarTypeId.MrwFog;
        const gameConfig    = await GameConfigGcModel.getLatestGameConfig();
        const dataList      : DataForMrwUserRenderer[] = [];
        for (const data of CommonModelCommonModel.getMrwRankList() || []) {
            if ((data.getPlayersCountUnneutral() === playersCount) && (data.getWarType() === warType)) {
                const userId = data.getUserId();
                if (userId == null) {
                    throw HelpersMisc.newError(`LbMrwListPanel._updateComponentsForStd() empty userId.`);
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
        const userInfo  = UsersModel.getSelfInfo();
        if (userInfo == null) {
            group.setIsVisible(false);
            return;
        }

        const isStd         = this._isStd;
        const warType       = isStd ? WarTypesConstants.WarTypeId.MrwStd : WarTypesConstants.WarTypeId.MrwFog;
        const gameConfig    = await GameConfigGcModel.getLatestGameConfig();
        const rankIndex     = await LeaderboardModelLeaderboardModel.getMrwRankIndex(warType, userInfo.getUserId() ?? 0);
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
        this._imgMyAvatar.loadSource(HelpersImageSource.getUserAvatar(userComplexInfo?.getAvatarId() ?? 1));
        this._labelMyNickname.setText(userInfo.getNickname() ?? LangConstants.UndefinedError);
        this._imgMyMedal.loadSource(medalId == null ? `` : HelpersImageSource.getMedal(medalId));
        this._labelMyScore.setText(`${rankInfo?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore}`);
        this._labelMyWin.setText(`${winCount}`);
        this._labelMyLose.setText(`${loseCount}`);
        this._labelMyDraw.setText(`${drawCount}`);
        this._labelMyWinRate.setText(gamesCount > 0 ? `${HelpersText.format(`%.2f`, winCount * 100 / gamesCount)}` : `--`);

        this._layoutName.arrangeItems();
    }
}

interface DataForMrwUserRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig      : GameConfigGcData.GcData;
    rank            : number;
    userId          : number;
    playersCount    : number;
    warType         : WarTypesConstants.WarTypeId;
    isLast          : boolean;
}
class MrwUserRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMrwUserRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForMrwUserRenderer>
{
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBottom!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIndex!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgAvatar!        : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelNickname!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgMedal!         : UiInterfacesIUiImage.IUiImage;

    private readonly _labelScore!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWin!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWinRate!     : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: this.getOpenData()?.userId });
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
        const userInfo  = await UsersModel.getUserPublicInfo(userId);
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
        imgAvatar.loadSource(HelpersImageSource.getUserAvatar(userInfo.getAvatarId() ?? 1));
        labelNickname.setText(userInfo.getNickname() ?? LangConstants.UndefinedError);
        imgMedal.loadSource(medalId == null ? `` : HelpersImageSource.getMedal(medalId));
        labelScore.setText(`${rankInfo?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore}`);
        labelWin.setText(`${winCount}`);
        labelLose.setText(`${loseCount}`);
        labelDraw.setText(`${drawCount}`);
        labelWinRate.setText(gamesCount > 0 ? `${HelpersText.format(`%.2f`, winCount * 100 / gamesCount)}` : `--`);

        this._layoutName.arrangeItems();
    }
}
