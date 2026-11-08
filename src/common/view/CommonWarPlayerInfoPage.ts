import {
    AuxiliaryTypes_ChatToTarget,
    Users_Utils,
    Cos_Constants,
    Helpers_ImageSource,
    GamePanels_Dict,
    Lang_Utils,
    Leaderboard_Model_LeaderboardModel,
    Users_Model,
    Timer_TimerModel,
    Helpers_Text,
    Ui_Utils_UiSkinHelpers,
    MultiRankedWars_Constants,
    Helpers_Misc,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    WarTypes_Constants,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral   : number;
    enterTurnTime           : number | null;
    roomOwnerPlayerIndex    : number | null;
    isReplay                : boolean;
    playerInfoArray         : AuxiliaryTypes_AuxiliaryTypes.PlayerInfo[];
    callbackOnAddDummy      : ((playerIndex: number) => void) | null;
    callbackOnChangeDummy   : ((playerIndex: number) => void) | null;
    callbackOnExitRoom      : (() => void) | null;
    callbackOnDeletePlayer  : ((playerIndex: number, forbidReentrance: boolean) => void) | null;
} | null;
export class Page extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listPlayer!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "common/CommonWarPlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
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
        const isRoomOwnedBySelf = playerInfoArray.find(v => v.playerIndex === roomOwnerPlayerIndex)?.userId === Users_Model.getSelfUserId();
        const dataArray         : DataForPlayerRenderer[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerInfo = playerInfoArray.find(v => v.playerIndex === playerIndex);
            if (playerInfo == null) {
                throw Helpers_Misc.newError(`CommonWarPlayerInfoPage._updateListPlayer() empty playerInfo.`);
            }

            dataArray.push({
                gameConfig             : gameConfig,
                isRoomOwnedBySelf      : isRoomOwnedBySelf,
                playerInfo             : playerInfo,
                enterTurnTime          : enterTurnTime,
                isReplay               : isReplay,
                callbackOnAddDummy     : callbackOnAddDummy,
                callbackOnChangeDummy  : callbackOnChangeDummy,
                callbackOnExitRoom     : callbackOnExitRoom,
                callbackOnDeletePlayer : callbackOnDeletePlayer,
            });
        }

        await listPlayer.bindData(dataArray);
    }
}

interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    isRoomOwnedBySelf       : boolean;
    enterTurnTime           : number | null;
    playerInfo              : AuxiliaryTypes_AuxiliaryTypes.PlayerInfo;
    isReplay                : boolean;
    callbackOnAddDummy      : ((playerIndex: number) => void) | null;
    callbackOnChangeDummy   : ((playerIndex: number) => void) | null;
    callbackOnExitRoom      : (() => void) | null;
    callbackOnDeletePlayer  : ((playerIndex: number, forbidReentrance: boolean) => void) | null;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSkin!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCoHead!                : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelNickname!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCo!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStatus!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutInfo!               : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPlayerIndex!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTeamIndex!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutStd!                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRankStdTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRankStd!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutFog!                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRankFogTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRankFog!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupRestTimeToBoot!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRestTimeToBootTitle! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRestTimeToBoot!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupButton!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnChat!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnInfo!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddDummy!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeDummy!           : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupCo,        callback : this._onTouchedGroupCo },
            { ui : this._btnChat,        callback : this._onTouchedBtnChat },
            { ui : this._btnInfo,        callback : this._onTouchedBtnInfo },
            { ui : this._btnDelete,      callback : this._onTouchedBtnDelete },
            { ui : this._btnAddDummy,    callback : this._onTouchedBtnAddDummy },
            { ui : this._btnChangeDummy, callback : this._onTouchedBtnChangeDummy },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                             callback : this._onNotifyLanguageChanged },
            { type : "TimeTick",                                    callback : this._onNotifyTimeTick },
            { type : "UserSettingsIsReplayResultVisibleChanged",    callback : this._onNotifyUserSettingsIsReplayResultVisibleChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const coId  = openData.playerInfo.coId;
        if ((coId != null) && (coId !== Cos_Constants.CoId.Empty)) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoInfoPanel, {
                gameConfig : openData.gameConfig,
                coId,
            });
        }
    }

    private _onTouchedBtnChat(): void {
        const userId = this.getOpenData()?.playerInfo.userId;
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, { toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toUserId : userId }) });
        }
    }

    private _onTouchedBtnInfo(): void {
        const userId = this.getOpenData()?.playerInfo.userId;
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId });
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

        if (userId === Users_Model.getSelfUserId()) {
            const callback = openData.callbackOnExitRoom;
            if (callback) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0126),
                    callback,
                });
            }

        } else {
            const callback = openData.callbackOnDeletePlayer;
            if ((callback) && (openData.isRoomOwnedBySelf)) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDeletePlayerPanel, {
                    content  : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0029, await Users_Model.getUserNickname(userId)),
                    callback : (forbidReentrance: boolean) => {
                        callback(playerInfo.playerIndex, forbidReentrance);
                    },
                });
            }
        }
    }

    private _onTouchedBtnAddDummy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = openData.callbackOnAddDummy;
        if (callback == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        callback(openData.playerInfo.playerIndex);
    }

    private _onTouchedBtnChangeDummy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = openData.callbackOnChangeDummy;
        if (callback == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
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
        this._labelRankStdTitle.setLangText(Lang_Constants.TextType.B0546);
        this._labelRankFogTitle.setLangText(Lang_Constants.TextType.B0547);
        this._labelRestTimeToBootTitle.setLangText(Lang_Constants.TextType.B0188);
        this._btnAddDummy.setText(`A.I.`);
        this._btnChangeDummy.setLangText(Lang_Constants.TextType.B0560);

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
        this._labelPlayerIndex.setText(Lang_Utils.getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(Lang_Utils.getPlayerTeamName(playerInfo.teamIndex) || Lang_Constants.UndefinedError);
        this._imgSkin.loadSource(Helpers_ImageSource.getCoHeadFrame(playerInfo.unitAndTileSkinId));

        const coId      = playerInfo.coId;
        const labelCo   = this._labelCo;
        const imgCoHead = this._imgCoHead;
        if (coId == null) {
            labelCo.setText(`??`);
            imgCoHead.loadSource(``);
        } else {
            const gameConfig    = openData.gameConfig;
            const coCfg         = gameConfig.getCoBasicCfg(coId);
            labelCo.setText(coCfg?.getName() ?? Lang_Constants.UndefinedError);
            imgCoHead.loadSource(Helpers_ImageSource.getCoHead(gameConfig, coId) ?? Lang_Constants.UndefinedError);
        }

        const userId        = playerInfo.userId;
        const userInfo      = userId == null ? null : await Users_Model.getUserPublicInfo(userId);
        const labelNickname = this._labelNickname;
        if (userInfo) {
            labelNickname.setText(userInfo.getNickname() || Lang_Constants.UndefinedError);
        } else {
            labelNickname.setText(playerInfo.isAi ? Lang_Utils.getText(Lang_Constants.TextType.B0607) : `??`);
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
                const isDummy = Users_Utils.checkIsDummy(userId);
                if ((isDummy)                       &&
                    (isRoomOwnedBySelf)             &&
                    (openData.callbackOnChangeDummy)
                ) {
                    groupButton.addItem(this._btnChangeDummy, false);
                }

                if (!isDummy) {
                    groupButton.addItem(this._btnInfo, false);
                }

                const selfUserId = Users_Model.getSelfUserId();
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
        if ((openData.isReplay) && (!Users_Model.getSelfSettingsIsReplayResultVisible())) {
            label.setText(``);
            return;
        }

        const playerInfo = openData.playerInfo;
        if (playerInfo.isReady) {
            label.setLangText(Lang_Constants.TextType.B0402);
        } else if (playerInfo.isInTurn) {
            label.setLangText(Lang_Constants.TextType.B0086);
        } else if (playerInfo.isDefeat != null) {
            label.setLangText(playerInfo.isDefeat ? Lang_Constants.TextType.B0472 : Lang_Constants.TextType.B0471);
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

        const rankScoreArray    = (await Users_Model.getUserPublicInfo(userId))?.getUserMrwRankInfoArray();
        const stdRankInfo       = rankScoreArray?.find(v => v.getWarType() === WarTypes_Constants.WarTypeId.MrwStd);
        const fogRankInfo       = rankScoreArray?.find(v => v.getWarType() === WarTypes_Constants.WarTypeId.MrwFog);
        const stdRankIndex      = await Leaderboard_Model_LeaderboardModel.getMrwRankIndex(WarTypes_Constants.WarTypeId.MrwStd, userId);
        const fogRankIndex      = await Leaderboard_Model_LeaderboardModel.getMrwRankIndex(WarTypes_Constants.WarTypeId.MrwFog, userId);
        labelRankStd.setText(stdRankInfo
            ? `${stdRankInfo?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore} (${stdRankIndex == null ? `--` : `${stdRankIndex}${Helpers_Text.getSuffixForRankIndex(stdRankIndex)}`})`
            : `${MultiRankedWars_Constants.Common.InitialScore} (--)`,
        );
        labelRankFog.setText(fogRankInfo
            ? `${fogRankInfo?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore} (${fogRankIndex == null ? `--` : `${fogRankIndex}${Helpers_Text.getSuffixForRankIndex(fogRankIndex)}`})`
            : `${MultiRankedWars_Constants.Common.InitialScore} (--)`,
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
                ? Math.max(0, restTimeToBoot + enterTurnTime - Timer_TimerModel.getServerTimestamp())
                : restTimeToBoot
            );
        const label             = this._labelRestTimeToBoot;
        if (restTime == null) {
            label.setText(`--`);
            label.setTextColor(0xFFFFFF);
        } else {
            label.setText(Lang_Utils.getTimeDurationText2(restTime));
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400),
            );
        }

        this._groupRestTimeToBoot.arrangeItems();
        this._layoutInfo.arrangeItems();
    }
}
