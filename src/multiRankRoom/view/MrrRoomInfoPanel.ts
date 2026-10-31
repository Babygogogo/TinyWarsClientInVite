import {
    type Notifications_Mapping,
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    Common_View_CommonWarPlayerInfoPage,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiTab,
    type Ui_Types_UiListItemData,
    Cos_Constants,
    MultiRankRoom_Model_MrrModel,
    Tween_Executor,
    ForceSkins_Utils,
    Helpers_ImageSource,
    Common_Model_CommonModel,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    Helpers_Collection,
    WarRules_Utils_CommonData,
    NormalMap_Model_NormalMapModel,
    Users_Model,
    Timer_TimerModel,
    MultiRankedWars_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    MultiRankRoom_Model_MrrProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    WarTypes_Constants,
} from "../../internal.ts";
import type { S as MrrDeleteRoomByServerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrDeleteRoomByServer/S.ts";
import type { S as MrrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetRoomPublicInfo/S.ts";
import type { S as MrrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedCoIdArray/S.ts";
import type { S as MrrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetSelfSettings/S.ts";

export interface OpenData {
    roomId  : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!              : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarPlayerInfoPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData>;

    private readonly _groupNavigator!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRankMatch!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyRoom!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRoomInfo!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupBanCo!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnBanCo!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnBannedCo!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelBanCo!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupSettings!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupChooseCo!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChooseCo!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgCo!                    : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupChoosePlayerIndex!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChoosePlayerIndex!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPlayerIndex!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupChooseSkinId!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChooseSkinId!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgSkinId!                : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupChooseReady!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChooseReady!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgReady!                 : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupState!               : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutCountdown!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCountdownTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCountdown!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelState!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!                  : Ui_Interfaces_IUiButton.IUiButton;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnBack,                callback : this._onTouchedBtnBack },
            { ui : this._btnBanCo,               callback : this._onTouchedBtnBanCo },
            { ui : this._btnChooseCo,            callback : this._onTouchedBtnChooseCo },
            { ui : this._btnChoosePlayerIndex,   callback : this._onTouchedBtnChoosePlayerIndex },
            { ui : this._btnChooseSkinId,        callback : this._onTouchedBtnChooseSkinId },
            { ui : this._btnChooseReady,         callback : this._onTouchedBtnChooseReady },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "TimeTick",                            callback : this._onNotifyTimeTick },
            { type : "RoomSelfSettingsCoIdChanged",         callback : this._onNotifyMrrSelfSettingsCoIdChanged },
            { type : "MsgMrrGetRoomPublicInfo",             callback : this._onNotifyMsgMrrGetRoomPublicInfo },
            { type : "MsgMrrSetSelfSettings",               callback : this._onNotifyMsgMrrSetSelfSettings },
            { type : "MsgMrrSetBannedCoIdArray",            callback : this._onNotifyMsgMrrSetBannedCoIdArray },
            { type : "MsgMrrDeleteRoomByServer",            callback : this._onNotifyMsgMrrDeleteRoomByServer },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._btnBanCo.setRedVisible(true);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();
        this._updateAllPagesForTabSettings();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateGroupBanCo();
        this._updateGroupSettings();
        this._updateGroupState();
        this._updateAllPagesForTabSettings();

        const roomId = this.getOpenData()?.roomId;
        if (roomId != null) {
            MultiRankRoom_Model_MrrProxy.reqMrrGetRoomPublicInfo(roomId);
        }
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.clear();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyRoomListPanel, void 0);
    }

    private async _onTouchedBtnBanCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
        if (roomInfo == null) {
            return;
        }

        const selfPlayerData = roomInfo.getPlayerDataList().find(v => v.getUserId() === Users_Model.getSelfUserId());
        if (selfPlayerData == null) {
            return;
        }

        const instanceWarRule                       = roomInfo.getSettingsForCommon()?.getInstanceWarRule();
        const bannedCoCategoryIdSets                = instanceWarRule?.getWarRuleCommonData()?.getPlayerRuleList().filter(v => v.getPlayerIndex()).map(v => new Set(v.getBannedCoCategoryIdArray())) ?? [];
        const warType                               = instanceWarRule?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypes_Constants.WarTypeId.MrwFog : WarTypes_Constants.WarTypeId.MrwStd;
        const normalMapId                           = roomInfo.getSettingsForMrw()?.getNormalMapId() ?? 0;
        const [gcData, mapRawData, coStatistics]    = await Promise.all([
            GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomInfo.getSettingsForCommon()?.getConfigVersion())),
            NormalMap_Model_NormalMapModel.getRawData(normalMapId),
            Common_Model_CommonModel.getCoStatistics(),
        ]);
        let totalGamesCount = 0;
        for (const gameData of coStatistics?.getGameDataArray() ?? []) {
            if (((gameData.getNormalMapId() ?? 0) === normalMapId) && ((gameData.getWarType() ?? 0) === warType)) {
                ++totalGamesCount;
            }
        }
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoCategoryIdPanel, {
            gameConfig                 : gcData,
            availableCoCategoryIdArray : gcData
                .getEnabledCoCategoryIdArray(warType)
                .filter(coCategoryId =>
                    (coCategoryId !== Cos_Constants.CategoryId.Random)                                            &&
                    ((!bannedCoCategoryIdSets.length) || (bannedCoCategoryIdSets.some(v => !v.has(coCategoryId)))),
                ),
            currentCoCategoryIdArray       : [],
            forceUnchosenCoCategoryIdArray : null,
            maxChooseCount                 : gcData.getSystemCfg().getMaxBanCoNumber(),
            isBan                          : true,
            getTitleText                   : () => Lang_Utils.getText(Lang_Constants.TextType.B0590),
            getBpRates                     : coCategoryId => {
                if (totalGamesCount <= 0) {
                    return [];
                }

                const coId = gcData.getEnabledCoIdByCategoryId(coCategoryId);
                if (coId == null) {
                    return [];
                }

                let pickCount   = 0;
                let banCount    = 0;
                for (const gameData of coStatistics?.getGameDataArray() ?? []) {
                    if (((gameData.getNormalMapId() ?? 0) !== normalMapId)    ||
                        ((gameData.getWarType() ?? 0) !== warType)
                    ) {
                        continue;
                    }

                    const pickedCoIdArray = gameData.getPickedCoIdArray();
                    if (pickedCoIdArray?.length !== 2) {
                        continue;
                    }

                    for (const pickedCoId of pickedCoIdArray) {
                        if (coId === pickedCoId) {
                            ++pickCount;
                        }
                    }
                    for (const bannedCoId of gameData.getBannedCoIdArray()) {
                        if (bannedCoId === coId) {
                            ++banCount;
                        }
                    }
                }

                return [banCount / totalGamesCount, pickCount / totalGamesCount];
            },
            getWlRates : coCategoryId => {
                if (totalGamesCount <= 0) {
                    return [];
                }

                const coId = gcData.getEnabledCoIdByCategoryId(coCategoryId);
                if (coId == null) {
                    return [];
                }

                let gamesCount  = 0;
                let winCount    = 0;
                let loseCount   = 0;
                for (const gameData of coStatistics?.getGameDataArray() ?? []) {
                    if (((gameData.getNormalMapId() ?? 0) !== normalMapId)    ||
                        ((gameData.getWarType() ?? 0) !== warType)
                    ) {
                        continue;
                    }

                    const pickedCoIdArray = gameData.getPickedCoIdArray();
                    if (pickedCoIdArray?.length !== 2) {
                        continue;
                    }

                    const winnerPlayerIndex = gameData.getWinnerPlayerIndex() ?? 0;
                    for (let i = 0; i < pickedCoIdArray.length; ++i) {
                        if (coId === pickedCoIdArray[i]) {
                            if (winnerPlayerIndex !== 0) {
                                if (winnerPlayerIndex === i + 1) {
                                    ++winCount;
                                } else {
                                    ++loseCount;
                                }
                            }
                            ++gamesCount;
                        }
                    }
                }

                if (gamesCount <= 0) {
                    return [];
                } else {
                    return [winCount / gamesCount, loseCount / gamesCount];
                }
            },
            callbackOnMap : mapRawData == null
                ? null
                : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
                    mapInfo : {
                        mapRawData        : mapRawData,
                        gameConfig        : gcData,
                        overridingPlayers : null,
                    },
                }),
            callbackOnConfirm : bannedCoCategoryIdArray => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => bannedCoCategoryIdArray.length <= 0
                        ? Lang_Utils.getText(Lang_Constants.TextType.A0139)
                        : Lang_Utils.getFormattedText(
                            Lang_Constants.TextType.F0185,
                            bannedCoCategoryIdArray.map(v => gcData.getCoIdByCategoryId(v)).map(v => gcData.getCoNameAndTierText(v) ?? Lang_Constants.UndefinedError).join(`, `),
                        ),
                    callback : () => MultiRankRoom_Model_MrrProxy.reqMrrSetBannedCoIdArray(
                        roomId,
                        bannedCoCategoryIdArray.map(v => (gcData.getEnabledCoIdByCategoryId(v) ?? gcData.getCoIdByCategoryId(v))),
                    ),
                });
            },
        });
    }

    private async _onTouchedBtnChooseCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomSelfSettings = await MultiRankRoom_Model_MrrModel.getSelfSettings(roomId);
        if (roomSelfSettings == null) {
            return;
        }

        const roomInfo          = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
        const selfUserId        = Users_Model.getSelfUserId();
        const selfPlayerData    = roomInfo ? roomInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId) : null;
        if (selfPlayerData != null) {
            if (selfPlayerData.getIsReady()) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0207));
            } else {
                const currentCoId = roomSelfSettings.getCoId();
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
                    gameConfig         : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                    currentCoId        : currentCoId,
                    availableCoIdArray : Helpers_Misc.getExisted(roomSelfSettings.getAvailableCoIdArray()),
                    isBan              : false,
                    callbackOnConfirm  : newCoId => {
                        if (newCoId !== currentCoId) {
                            roomSelfSettings.setCoId(newCoId);
                        }
                    },
                });
            }
        }
    }

    private _onTouchedBtnChoosePlayerIndex(): void {
        FloatText.showLang(Lang_Constants.TextType.A0209);
    }

    private async _onTouchedBtnChooseSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
        if (roomInfo == null) {
            return;
        }

        const roomSelfSettings = await MultiRankRoom_Model_MrrModel.getSelfSettings(roomId);
        if (roomSelfSettings == null) {
            return;
        }

        const selfUserId        = Users_Model.getSelfUserId();
        const playerDataList    = roomInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.getIsReady()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0128));
            return;
        }

        const usedSkinIdArray       = Helpers_Collection.getNonNullElements(playerDataList?.filter(v => v.getUserId() !== selfUserId).map(v => v.getUnitAndTileSkinId()));
        const availableSkinIdArray  = ForceSkins_Utils.getAllSkinIdArray(false).filter(v => usedSkinIdArray.indexOf(v) < 0);
        const selfSkinId            = selfPlayerData.getUnitAndTileSkinId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId        : selfSkinId,
            availableSkinIdArray : availableSkinIdArray,
            callback             : skinId => {
                roomSelfSettings.setUnitAndTileSkinId(skinId);
                this._updateImgSkinId();
            },
        });
    }

    private async _onTouchedBtnChooseReady(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomSelfSettings = await MultiRankRoom_Model_MrrModel.getSelfSettings(roomId);
        if (roomSelfSettings == null) {
            return;
        }

        const selfUserId        = Users_Model.getSelfUserId();
        const selfPlayerData    = (await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.getIsReady()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0205));
            return;
        }

        const coId      = roomSelfSettings.getCoId();
        const skinId    = roomSelfSettings.getUnitAndTileSkinId();
        if ((coId == null) || (skinId == null)) {
            return;
        }

        const callback  = () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0206),
                callback   : () => {
                    MultiRankRoom_Model_MrrProxy.reqMrrSetSelfSettings(roomId, coId, skinId);
                },
            });
        };
        if ((coId == Cos_Constants.CoId.Empty)                                                             &&
            ((roomSelfSettings.getAvailableCoIdArray() || []).some(v => v !== Cos_Constants.CoId.Empty))
        ) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0208),
                callback,
            });
        } else {
            callback();
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyTimeTick(): void {
        this._updateLabelCountdown();
    }

    private _onNotifyMrrSelfSettingsCoIdChanged(): void {
        this._updateImgCo();
    }

    private _onNotifyMsgMrrGetRoomPublicInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMrrGetRoomPublicInfo"]>): void {
        const data = (e.data as { msg: MrrGetRoomPublicInfoResponse }).msg;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
            this._updateAllPagesForTabSettings();
        }
    }

    private _onNotifyMsgMrrSetSelfSettings(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMrrSetSelfSettings"]>): void {
        const data = (e.data as { msg: MrrSetSelfSettingsResponse }).msg;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            this._updateGroupSettings();
            this._updateGroupState();
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgMrrSetBannedCoIdArray(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMrrSetBannedCoIdArray"]>): void {
        const data = (e.data as { msg: MrrSetBannedCoIdArrayResponse }).msg;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgMrrDeleteRoomByServer(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMrrDeleteRoomByServer"]>): void {
        const data = (e.data as { msg: MrrDeleteRoomByServerResponse }).msg;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0019));
            this.closePanel();
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyRoomListPanel, void 0);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0298) },
                pageClass   : Common_View_CommonWarMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0224) },
                pageClass   : Common_View_CommonWarPlayerInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0002) },
                pageClass   : Common_View_CommonWarBasicSettingsPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0003) },
                pageClass   : Common_View_CommonWarAdvancedSettingsPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonMapInfoPage(),
            this._updateCommonWarPlayerInfoPage(),
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
        ]);
    }

    private async _updateLabelPlayerIndex(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const label         = this._labelPlayerIndex;
        const roomInfo      = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
        const userId        = Users_Model.getSelfUserId();
        const playerIndex   = roomInfo?.getPlayerDataList().find(v => v.getUserId() === userId)?.getPlayerIndex();
        if (playerIndex == null) {
            label.setText(``);
            return;
        }

        const warRuleCommonData = roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData();
        const teamIndex         = warRuleCommonData == null ? null : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        if (teamIndex == null) {
            label.setText(``);
            return;
        }

        label.setText(`P${playerIndex}${`\n`}${Lang_Utils.getPlayerTeamName(teamIndex) ?? Lang_Constants.UndefinedError}`);
    }

    private async _updateImgSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = Users_Model.getSelfUserId();
        const skinId        = (await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getUnitAndTileSkinId() ?? (await MultiRankRoom_Model_MrrModel.getSelfSettings(roomId))?.getUnitAndTileSkinId();
        this._imgSkinId.loadSource(skinId == null ? `` : Helpers_ImageSource.getSkinCircle(skinId, true));
    }

    private async _updateGroupChooseReady(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = Users_Model.getSelfUserId();
        const isReady       = (await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getIsReady();
        this._imgReady.setIsVisible(!!isReady);
        this._btnChooseReady.setRedVisible(!isReady);
    }

    private _updateComponentsForLanguage(): void {
        this._labelRankMatch.setLangText(Lang_Constants.TextType.B0404);
        this._labelMyRoom.setLangText(Lang_Constants.TextType.B0410);
        this._labelRoomInfo.setLangText(Lang_Constants.TextType.B0398);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._btnBanCo.setLangText(Lang_Constants.TextType.B0590);
        this._btnBannedCo.setLangText(Lang_Constants.TextType.B0403);
        this._btnChooseCo.setLangText(Lang_Constants.TextType.B0425);
        this._btnChoosePlayerIndex.setLangText(Lang_Constants.TextType.B0168);
        this._btnChooseSkinId.setLangText(Lang_Constants.TextType.B0397);
        this._btnChooseReady.setLangText(Lang_Constants.TextType.B0402);

        this._groupNavigator.arrangeItems();
        this._updateLabelPlayerIndex();
    }

    private async _updateGroupBanCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo  = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
        const group     = this._groupBanCo;
        if ((!roomInfo) || (roomInfo.getTimeForStartSetSelfSettings() != null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const userId        = Users_Model.getSelfUserId();
            const playerData    = Helpers_Misc.getExisted(roomInfo.getPlayerDataList().find(v => v.getUserId() === userId));
            const playerIndex   = playerData.getPlayerIndex();
            const banCoData     = roomInfo.getSettingsForMrw()?.getDataArrayForBanCo().find(v => v.getSrcPlayerIndex() === playerIndex);
            const btnBanCo      = this._btnBanCo;
            const btnBannedCo   = this._btnBannedCo;
            const labelBanCo    = this._labelBanCo;
            if (banCoData == null) {
                btnBanCo.setIsVisible(true);
                btnBannedCo.setIsVisible(false);
                labelBanCo.setText(``);
            } else {
                const coCategoryIdArray = banCoData.getBannedCoIdArray();
                const gameConfig        = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomInfo.getSettingsForCommon()?.getConfigVersion()));
                btnBanCo.setIsVisible(false);
                btnBannedCo.setIsVisible(true);
                labelBanCo.setText(coCategoryIdArray.length
                    ? coCategoryIdArray.map(v => gameConfig.getCoBasicCfg(v)?.getName()).join(`\n`)
                    : Lang_Utils.getText(Lang_Constants.TextType.None),
                );
            }
        }
    }

    private async _updateGroupSettings(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo  = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
        const group     = this._groupSettings;
        if ((!roomInfo) || (roomInfo.getTimeForStartSetSelfSettings() == null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            this._updateImgCo();
            this._updateLabelPlayerIndex();
            this._updateImgSkinId();
            this._updateGroupChooseReady();
        }
    }

    private async _updateImgCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const configVersion     = (await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId))?.getSettingsForCommon()?.getConfigVersion();
        const gameConfig        = configVersion ? await GameConfigs_Provider.getGameConfig(configVersion) : null;
        const coId              = (await MultiRankRoom_Model_MrrModel.getSelfSettings(roomId))?.getCoId();
        this._imgCo.loadSource(((gameConfig == null) || (coId == null))
            ? ``
            : Helpers_ImageSource.getCoEye(gameConfig, coId, true) ?? ``,
        );
    }

    private _updateGroupState(): void {
        this._updateLabelCountdown();
        this._updateLabelState();
    }
    private async _updateLabelCountdown(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo              = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
        const labelCountdownTitle   = this._labelCountdownTitle;
        const labelCountdown        = this._labelCountdown;
        if (!roomInfo) {
            labelCountdownTitle.setText(``);
            labelCountdown.setText(``);
            return;
        }

        const timeForStartSetSelfSettings   = roomInfo.getTimeForStartSetSelfSettings();
        const currentTime                   = Timer_TimerModel.getServerTimestamp();
        if (timeForStartSetSelfSettings != null) {
            labelCountdownTitle.setLangText(Lang_Constants.TextType.B0593);
            labelCountdown.setText(Lang_Utils.getTimeDurationText2(Math.max(0, timeForStartSetSelfSettings + MultiRankedWars_Constants.Common.RoomPhaseTime - currentTime)));
        } else {
            labelCountdownTitle.setLangText(Lang_Constants.TextType.B0592);
            labelCountdown.setText(Lang_Utils.getTimeDurationText2(Math.max(0, roomInfo.getTimeForCreateRoom() + MultiRankedWars_Constants.Common.RoomPhaseTime - currentTime)));
        }
        this._layoutCountdown.arrangeItems();
        this._groupState.arrangeItems();
    }
    private async _updateLabelState(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo      = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
        const labelState    = this._labelState;
        const groupState    = this._groupState;
        if (!roomInfo) {
            labelState.setText(``);
            groupState.arrangeItems();
            return;
        }

        const userId        = Users_Model.getSelfUserId();
        const playerData    = Helpers_Misc.getExisted(roomInfo.getPlayerDataList().find(v => v.getUserId() === userId));
        const playerIndex   = playerData.getPlayerIndex();
        if (roomInfo.getTimeForStartSetSelfSettings() == null) {
            labelState.setLangText(roomInfo.getSettingsForMrw()?.getDataArrayForBanCo().some(v => v.getSrcPlayerIndex() === playerIndex) ? Lang_Constants.TextType.A0133 : Lang_Constants.TextType.A0210);
        } else {
            labelState.setLangText(playerData.getIsReady() ? Lang_Constants.TextType.A0134 : Lang_Constants.TextType.A0211);
        }
        groupState.arrangeItems();
    }

    private async _updateCommonMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCommonMapInfoPage());
        }
    }

    private async _updateCommonWarPlayerInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
        }
    }

    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
        }
    }

    private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }

    private async _createDataForCommonMapInfoPage(): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return null;
        }

        const roomInfo      = await MultiRankRoom_Model_MrrModel.getRoomInfo(roomId);
        const normalMapId   = roomInfo ? (roomInfo.getSettingsForMrw()?.getNormalMapId() ?? 0) : null;
        if (normalMapId == null) {
            return null;
        } else {
            const settingsForCommon = roomInfo?.getSettingsForCommon();
            return {
                mapInfo : {
                    hasFog            : !!settingsForCommon?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                    mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                    gameConfig        : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon?.getConfigVersion())),
                    overridingPlayers : null,
                },
            };
        }
    }

    private _createDataForCommonWarPlayerInfoPage(): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
        return MultiRankRoom_Model_MrrModel.createDataForCommonWarPlayerInfoPage(this.getOpenData()?.roomId);
    }

    private _createDataForCommonWarBasicSettingsPage(): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
        return MultiRankRoom_Model_MrrModel.createDataForCommonWarBasicSettingsPage(this.getOpenData()?.roomId);
    }

    private _createDataForCommonWarAdvancedSettingsPage(): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
        return MultiRankRoom_Model_MrrModel.createDataForCommonWarAdvancedSettingsPage(this.getOpenData()?.roomId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupBanCo,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSettings,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupState,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupBanCo,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSettings,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupState,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });

        await Timer_TimerModel.wait();
    }
}

interface DataForTabItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    name: string;
}
class TabItemRenderer extends Ui_Components_UiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? Lang_Constants.UndefinedError);
    }
}
