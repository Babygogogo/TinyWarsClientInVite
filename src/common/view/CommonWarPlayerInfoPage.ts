import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LeaderboardModelLeaderboardModel from "../../leaderboard/model/LeaderboardModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UsersUtils from "../../users/Utils.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export type OpenData = {
    gameConfig              : GameConfigGcData.GcData;
    playersCountUnneutral   : number;
    enterTurnTime           : number | null;
    roomOwnerPlayerIndex    : number | null;
    isReplay                : boolean;
    playerInfoArray         : AuxiliaryTypesAuxiliaryTypes.PlayerInfo[];
    callbackOnAddDummy      : ((playerIndex: number) => void) | null;
    callbackOnChangeDummy   : ((playerIndex: number) => void) | null;
    callbackOnExitRoom      : (() => void) | null;
    callbackOnDeletePlayer  : ((playerIndex: number, forbidReentrance: boolean) => void) | null;
} | null;
export class Page extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listPlayer!   : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "common/CommonWarPlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
        });

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected _doApplyOpenData(): void | Promise<void> {
        this._updateListPlayer();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    private async _updateListPlayer(): Promise<void> {
        const openData      = this.getOpenData();
        const listPlayer    = this._listPlayer;
        if (openData == null) {
            await listPlayer.removeAllItems();
            return;
        }

        const {
            gameConfig,
            callbackOnAddDummy,
            callbackOnChangeDummy,
            callbackOnExitRoom,
            callbackOnDeletePlayer,
            roomOwnerPlayerIndex,
            playersCountUnneutral,
            playerInfoArray,
            enterTurnTime,
            isReplay,
        } = openData;
        const isRoomOwnedBySelf = playerInfoArray.find(v => v.playerIndex === roomOwnerPlayerIndex)?.userId === UsersModel.getSelfUserId();
        const dataArray         : DataForPlayerRenderer[] = [];
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerInfo = playerInfoArray.find(v => v.playerIndex === playerIndex);
            if (playerInfo == null) {
                throw HelpersMisc.newError(`CommonWarPlayerInfoPage._updateListPlayer() empty playerInfo.`);
            }

            dataArray.push({
                gameConfig              : gameConfig,
                isRoomOwnedBySelf       : isRoomOwnedBySelf,
                playerInfo              : playerInfo,
                enterTurnTime           : enterTurnTime,
                isReplay                : isReplay,
                callbackOnAddDummy      : callbackOnAddDummy,
                callbackOnChangeDummy   : callbackOnChangeDummy,
                callbackOnExitRoom      : callbackOnExitRoom,
                callbackOnDeletePlayer  : callbackOnDeletePlayer,
            });
        }

        await listPlayer.bindData(dataArray);
    }
}

interface DataForPlayerRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig              : GameConfigGcData.GcData;
    isRoomOwnedBySelf       : boolean;
    enterTurnTime           : number | null;
    playerInfo              : AuxiliaryTypesAuxiliaryTypes.PlayerInfo;
    isReplay                : boolean;
    callbackOnAddDummy      : ((playerIndex: number) => void) | null;
    callbackOnChangeDummy   : ((playerIndex: number) => void) | null;
    callbackOnExitRoom      : (() => void) | null;
    callbackOnDeletePlayer  : ((playerIndex: number, forbidReentrance: boolean) => void) | null;
}
class PlayerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSkin!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCoHead!                : UiInterfacesIUiImage.IUiImage;
    private readonly _labelNickname!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCo!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStatus!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutInfo!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPlayerIndex!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTeamIndex!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutStd!                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRankStdTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRankStd!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutFog!                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRankFogTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRankFog!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupRestTimeToBoot!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRestTimeToBootTitle! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRestTimeToBoot!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupButton!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnChat!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnInfo!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddDummy!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeDummy!           : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,        callback: this._onTouchedGroupCo },
            { ui: this._btnChat,        callback: this._onTouchedBtnChat },
            { ui: this._btnInfo,        callback: this._onTouchedBtnInfo },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
            { ui: this._btnAddDummy,    callback: this._onTouchedBtnAddDummy },
            { ui: this._btnChangeDummy, callback: this._onTouchedBtnChangeDummy },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.TimeTick,                                    callback: this._onNotifyTimeTick },
            { type: NotificationsTypeId.TypeId.UserSettingsIsReplayResultVisibleChanged,    callback: this._onNotifyUserSettingsIsReplayResultVisibleChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const coId  = openData.playerInfo.coId;
        if ((coId != null) && (coId !== CosConstants.CoId.Empty)) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoInfoPanel, {
                gameConfig  : openData.gameConfig,
                coId,
            });
        }
    }

    private _onTouchedBtnChat(): void {
        const userId = this.getOpenData()?.playerInfo.userId;
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({ toUserId: userId }) });
        }
    }

    private _onTouchedBtnInfo(): void {
        const userId = this.getOpenData()?.playerInfo.userId;
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId });
        }
    }

    private async _onTouchedBtnDelete(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerInfo    = openData.playerInfo;
        const userId        = playerInfo.userId;
        if (userId == null) {
            return;
        }

        if (userId === UsersModel.getSelfUserId()) {
            const callback = openData.callbackOnExitRoom;
            if (callback) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent : () => LangUtils.getText(LangConstants.TextType.A0126),
                    callback,
                });
            }

        } else {
            const callback = openData.callbackOnDeletePlayer;
            if ((callback) && (openData.isRoomOwnedBySelf)) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDeletePlayerPanel, {
                    content : LangUtils.getFormattedText(LangConstants.TextType.F0029, await UsersModel.getUserNickname(userId)),
                    callback: (forbidReentrance: boolean) => {
                        callback(playerInfo.playerIndex, forbidReentrance);
                    },
                });
            }
        }
    }

    private _onTouchedBtnAddDummy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = openData.callbackOnAddDummy;
        if (callback == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        callback(openData.playerInfo.playerIndex);
    }

    private _onTouchedBtnChangeDummy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = openData.callbackOnChangeDummy;
        if (callback == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        callback(openData.playerInfo.playerIndex);
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyTimeTick(): void {
        this._updateGroupRestTimeToBoot();
    }
    private _onNotifyUserSettingsIsReplayResultVisibleChanged(): void {
        this._updateLabelStatus();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForInfo();
    }

    private _updateComponentsForLanguage(): void {
        this._labelRankStdTitle.setLangText(LangConstants.TextType.B0546);
        this._labelRankFogTitle.setLangText(LangConstants.TextType.B0547);
        this._labelRestTimeToBootTitle.setLangText(LangConstants.TextType.B0188);
        this._btnAddDummy.setText(`A.I.`);
        this._btnChangeDummy.setLangText(LangConstants.TextType.B0560);

        this._layoutFog.arrangeItems();
        this._layoutStd.arrangeItems();
        this._groupRestTimeToBoot.arrangeItems();
        this._layoutInfo.arrangeItems();
    }

    private async _updateComponentsForInfo(): Promise<void> {
        this._updateLabelStatus();
        this._updateComponentsForRankInfo();
        this._updateGroupRestTimeToBoot();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerInfo    = openData.playerInfo;
        const playerIndex   = playerInfo.playerIndex;
        this._labelPlayerIndex.setText(LangUtils.getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(LangUtils.getPlayerTeamName(playerInfo.teamIndex) || LangConstants.UndefinedError);
        this._imgSkin.loadSource(HelpersImageSource.getCoHeadFrame(playerInfo.unitAndTileSkinId));

        const coId      = playerInfo.coId;
        const labelCo   = this._labelCo;
        const imgCoHead = this._imgCoHead;
        if (coId == null) {
            labelCo.setText(`??`);
            imgCoHead.loadSource(``);
        } else {
            const gameConfig    = openData.gameConfig;
            const coCfg         = gameConfig.getCoBasicCfg(coId);
            labelCo.setText(coCfg?.getName() ?? LangConstants.UndefinedError);
            imgCoHead.loadSource(HelpersImageSource.getCoHead(gameConfig, coId) ?? LangConstants.UndefinedError);
        }

        const userId        = playerInfo.userId;
        const userInfo      = userId == null ? null : await UsersModel.getUserPublicInfo(userId);
        const labelNickname = this._labelNickname;
        if (userInfo) {
            labelNickname.setText(userInfo.getNickname() || LangConstants.UndefinedError);
        } else {
            labelNickname.setText(playerInfo.isAi ? LangUtils.getText(LangConstants.TextType.B0607) : `??`);
        }

        {
            const groupButton = this._groupButton;
            groupButton.removeAllItems(false);

            const isRoomOwnedBySelf = openData.isRoomOwnedBySelf;
            if (userInfo == null) {
                if ((coId == null)                  &&
                    (isRoomOwnedBySelf)             &&
                    (openData.callbackOnAddDummy)
                ) {
                    groupButton.addItem(this._btnAddDummy, false);
                }

            } else {
                const isDummy = UsersUtils.checkIsDummy(userId);
                if ((isDummy)                       &&
                    (isRoomOwnedBySelf)             &&
                    (openData.callbackOnChangeDummy)
                ) {
                    groupButton.addItem(this._btnChangeDummy, false);
                }

                if (!isDummy) {
                    groupButton.addItem(this._btnInfo, false);
                }

                const selfUserId = UsersModel.getSelfUserId();
                if ((!isDummy) && (userId !== selfUserId)) {
                    groupButton.addItem(this._btnChat, false);
                }

                if (((openData.callbackOnExitRoom) && (userId === selfUserId))      ||
                    ((openData.callbackOnDeletePlayer) && (isRoomOwnedBySelf))
                ) {
                    groupButton.addItem(this._btnDelete, false);
                }
            }
            groupButton.arrangeItems();
        }
    }

    private _updateLabelStatus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const label = this._labelStatus;
        if ((openData.isReplay) && (!UsersModel.getSelfSettingsIsReplayResultVisible())) {
            label.setText(``);
            return;
        }

        const playerInfo = openData.playerInfo;
        if (playerInfo.isReady) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0402));
        } else if (playerInfo.isInTurn) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0086));
        } else if (playerInfo.isDefeat != null) {
            label.setText(LangUtils.getText(playerInfo.isDefeat ? LangConstants.TextType.B0472 : LangConstants.TextType.B0471));
        } else {
            // TODO
            label.setText(``);
        }
    }

    private async _updateComponentsForRankInfo(): Promise<void> {
        const userId        = this.getOpenData()?.playerInfo.userId;
        const labelRankStd  = this._labelRankStd;
        const labelRankFog  = this._labelRankFog;
        if (userId == null) {
            labelRankStd.setText(`??`);
            labelRankFog.setText(`??`);
            return;
        }

        const rankScoreArray    = (await UsersModel.getUserPublicInfo(userId))?.getUserMrwRankInfoArray();
        const stdRankInfo       = rankScoreArray?.find(v => v.getWarType() === WarTypesConstants.WarTypeId.MrwStd);
        const fogRankInfo       = rankScoreArray?.find(v => v.getWarType() === WarTypesConstants.WarTypeId.MrwFog);
        const stdRankIndex      = await LeaderboardModelLeaderboardModel.getMrwRankIndex(WarTypesConstants.WarTypeId.MrwStd, userId);
        const fogRankIndex      = await LeaderboardModelLeaderboardModel.getMrwRankIndex(WarTypesConstants.WarTypeId.MrwFog, userId);
        labelRankStd.setText(stdRankInfo
            ? `${stdRankInfo?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore} (${stdRankIndex == null ? `--` : `${stdRankIndex}${HelpersText.getSuffixForRankIndex(stdRankIndex)}`})`
            : `${GameConfigGcWar.MultiRankedWar.InitialScore} (--)`
        );
        labelRankFog.setText(fogRankInfo
            ? `${fogRankInfo?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore} (${fogRankIndex == null ? `--` : `${fogRankIndex}${HelpersText.getSuffixForRankIndex(fogRankIndex)}`})`
            : `${GameConfigGcWar.MultiRankedWar.InitialScore} (--)`
        );

        this._layoutStd.arrangeItems();
        this._layoutFog.arrangeItems();
        this._layoutInfo.arrangeItems();
    }

    private _updateGroupRestTimeToBoot(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerInfo        = openData.playerInfo;
        const restTimeToBoot    = playerInfo.restTimeToBoot;
        const enterTurnTime     = openData.enterTurnTime;
        const restTime          = (restTimeToBoot == null) || (enterTurnTime == null)
            ? null
            : (playerInfo.isInTurn
                ? Math.max(0, restTimeToBoot + enterTurnTime - TimerTimerModel.getServerTimestamp())
                : restTimeToBoot
            );
        const label             = this._labelRestTimeToBoot;
        if (restTime == null) {
            label.setText(`--`);
            label.setTextColor(0xFFFFFF);
        } else {
            label.setText(LangUtils.getTimeDurationText2(restTime));
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400)
            );
        }

        this._groupRestTimeToBoot.arrangeItems();
        this._layoutInfo.arrangeItems();
    }
}
