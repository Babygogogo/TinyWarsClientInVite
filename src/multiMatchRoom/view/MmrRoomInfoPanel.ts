import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiMatchRoomModelMmrModel from "../model/MmrModel.ts";
import * as MultiMatchRoomModelMmrProxy from "../model/MmrProxy.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrDeleteRoomByServerS from "../../proto/schema/CommonProto/NetMessage/MsgMmrDeleteRoomByServer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetRoomPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedCoIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetSelfSettings/S.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import * as UiComponentsUiTabItemRenderer from "../../ui/components/UiTabItemRenderer.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiTab from "../../ui/interfaces/IUiTab.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export interface OpenData {
    roomId  : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!              : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPage.OpenData | CommonViewCommonWarPlayerInfoPage.OpenData | CommonViewCommonWarBasicSettingsPage.OpenData | CommonViewCommonWarAdvancedSettingsPage.OpenData>;

    private readonly _groupNavigator!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRankMatch!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyRoom!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRoomInfo!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupBanCo!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnBanCo!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnBannedCo!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelBanCo!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupSettings!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupChooseCo!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnChooseCo!              : UiInterfacesIUiButton.IUiButton;
    private readonly _imgCo!                    : UiInterfacesIUiImage.IUiImage;

    private readonly _groupChoosePlayerIndex!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnChoosePlayerIndex!     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPlayerIndex!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupChooseSkinId!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnChooseSkinId!          : UiInterfacesIUiButton.IUiButton;
    private readonly _imgSkinId!                : UiInterfacesIUiImage.IUiImage;

    private readonly _groupChooseReady!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnChooseReady!           : UiInterfacesIUiButton.IUiButton;
    private readonly _imgReady!                 : UiInterfacesIUiImage.IUiImage;

    private readonly _groupState!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutCountdown!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCountdownTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCountdown!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelState!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!                  : UiInterfacesIUiButton.IUiButton;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,                callback: this._onTouchedBtnBack },
            { ui: this._btnBanCo,               callback: this._onTouchedBtnBanCo },
            { ui: this._btnChooseCo,            callback: this._onTouchedBtnChooseCo },
            { ui: this._btnChoosePlayerIndex,   callback: this._onTouchedBtnChoosePlayerIndex },
            { ui: this._btnChooseSkinId,        callback: this._onTouchedBtnChooseSkinId },
            { ui: this._btnChooseReady,         callback: this._onTouchedBtnChooseReady },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.TimeTick,                            callback: this._onNotifyTimeTick },
            { type: NotificationsTypeId.TypeId.RoomSelfSettingsCoIdChanged,          callback: this._onNotifyMmrSelfSettingsCoIdChanged },
            { type: NotificationsTypeId.TypeId.MsgMmrGetRoomPublicInfo,             callback: this._onNotifyMsgMmrGetRoomPublicInfo },
            { type: NotificationsTypeId.TypeId.MsgMmrSetSelfSettings,               callback: this._onNotifyMsgMmrSetSelfSettings },
            { type: NotificationsTypeId.TypeId.MsgMmrSetBannedCoIdArray,            callback: this._onNotifyMsgMmrSetBannedCoIdArray },
            { type: NotificationsTypeId.TypeId.MsgMmrDeleteRoomByServer,            callback: this._onNotifyMsgMmrDeleteRoomByServer },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
            MultiMatchRoomModelMmrProxy.reqMmrGetRoomPublicInfo(roomId);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyRoomListPanel, void 0);
    }

    private async _onTouchedBtnBanCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
        if (roomInfo == null) {
            return;
        }

        const userId            = UsersModel.getSelfUserId();
        const selfPlayerData    = roomInfo.getPlayerDataList().find(v => v.getUserId() === userId);
        if (selfPlayerData == null) {
            return;
        }

        const instanceWarRule           = roomInfo.getSettingsForCommon()?.getInstanceWarRule();
        const bannedCoCategoryIdSets    = instanceWarRule?.getWarRuleCommonData()?.getPlayerRuleList().filter(v => v.getPlayerIndex()).map(v => new Set(v.getBannedCoCategoryIdArray())) ?? [];
        const warType                   = instanceWarRule?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypesConstants.WarTypeId.MmwFog : WarTypesConstants.WarTypeId.MmwStd;
        const gcData                    = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo.getSettingsForCommon()?.getConfigVersion()));
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoCategoryIdPanel, {
            gameConfig                      : gcData,
            availableCoCategoryIdArray      : gcData
                .getEnabledCoCategoryIdArray(warType)
                .filter(coCategoryId =>
                    (coCategoryId !== CosConstants.CategoryId.Random)                                            &&
                    ((!bannedCoCategoryIdSets.length) || (bannedCoCategoryIdSets.some(v => !v.has(coCategoryId))))
                ),
            currentCoCategoryIdArray        : [],
            forceUnchosenCoCategoryIdArray  : null,
            maxChooseCount                  : gcData.getSystemCfg().getMaxBanCoNumber() ?? 0,
            isBan                           : true,
            getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0590),
            callbackOnConfirm               : bannedCoCategoryIdArray => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent : () => bannedCoCategoryIdArray.length <= 0
                        ? LangUtils.getText(LangConstants.TextType.A0139)
                        : LangUtils.getFormattedText(
                            LangConstants.TextType.F0185,
                            bannedCoCategoryIdArray.map(v => gcData.getCoIdByCategoryId(v)).map(v => gcData.getCoNameAndTierText(v) ?? LangConstants.UndefinedError).join(`, `)
                        ),
                    callback: () => MultiMatchRoomModelMmrProxy.reqMmrSetBannedCoIdArray(
                        roomId,
                        bannedCoCategoryIdArray.map(v => HelpersMisc.getExisted(gcData.getEnabledCoIdByCategoryId(v) ?? gcData.getCoIdByCategoryId(v)))
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

        const roomSelfSettings = await MultiMatchRoomModelMmrModel.getSelfSettings(roomId);
        if (roomSelfSettings == null) {
            return;
        }

        const roomInfo          = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
        const selfUserId        = UsersModel.getSelfUserId();
        const selfPlayerData    = roomInfo ? roomInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId) : null;
        if (selfPlayerData != null) {
            if (selfPlayerData.getIsReady()) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0207));
            } else {
                const currentCoId = roomSelfSettings.getCoId();
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
                    gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                    currentCoId         : currentCoId,
                    availableCoIdArray  : HelpersMisc.getExisted(roomSelfSettings.getAvailableCoIdArray()),
                    isBan               : false,
                    callbackOnConfirm   : newCoId => {
                        if (newCoId !== currentCoId) {
                            roomSelfSettings.setCoId(newCoId);
                        }
                    },
                });
            }
        }
    }

    private _onTouchedBtnChoosePlayerIndex(): void {
        FloatText2.showLang(LangConstants.TextType.A0209);
    }

    private async _onTouchedBtnChooseSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
        if (roomInfo == null) {
            return;
        }

        const roomSelfSettings = await MultiMatchRoomModelMmrModel.getSelfSettings(roomId);
        if (roomSelfSettings == null) {
            return;
        }

        const selfUserId        = UsersModel.getSelfUserId();
        const playerDataList    = roomInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.getIsReady()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0128));
            return;
        }

        const usedSkinIdArray       = HelpersCollection.getNonNullElements(playerDataList?.filter(v => v.getUserId() !== selfUserId).map(v => v.getUnitAndTileSkinId()) ?? []);
        const availableSkinIdArray  = ForceSkinsUtils.getAllSkinIdArray(false).filter(v => usedSkinIdArray.indexOf(v) < 0);
        const selfSkinId            = selfPlayerData.getUnitAndTileSkinId();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId           : selfSkinId ?? availableSkinIdArray[0],
            availableSkinIdArray    : availableSkinIdArray,
            callback                : skinId => {
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

        const roomSelfSettings = await MultiMatchRoomModelMmrModel.getSelfSettings(roomId);
        if (roomSelfSettings == null) {
            return;
        }

        const selfUserId        = UsersModel.getSelfUserId();
        const selfPlayerData    = (await MultiMatchRoomModelMmrModel.getRoomInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.getIsReady()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0205));
            return;
        }

        const coId      = roomSelfSettings.getCoId();
        const skinId    = roomSelfSettings.getUnitAndTileSkinId();
        if ((coId == null) || (skinId == null)) {
            return;
        }

        const callback  = () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0206),
                callback: () => {
                    MultiMatchRoomModelMmrProxy.reqMmrSetSelfSettings(roomId, coId, skinId);
                },
            });
        };
        if ((coId == CosConstants.CoId.Empty)                                                             &&
            ((roomSelfSettings.getAvailableCoIdArray() || []).some(v => v !== CosConstants.CoId.Empty))
        ) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0208),
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

    private _onNotifyMmrSelfSettingsCoIdChanged(): void {
        this._updateImgCo();
    }

    private _onNotifyMsgMmrGetRoomPublicInfo(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS.S;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
            this._updateAllPagesForTabSettings();
        }
    }

    private _onNotifyMsgMmrSetSelfSettings(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS.S;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            this._updateGroupSettings();
            this._updateGroupState();
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgMmrSetBannedCoIdArray(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS.S;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgMmrDeleteRoomByServer(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrDeleteRoomByServerS.S;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0019));
            this.closePanel();
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyRoomListPanel, void 0);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0298) },
                pageClass   : CommonViewCommonWarMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0224) },
                pageClass   : CommonViewCommonWarPlayerInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0002) },
                pageClass   : CommonViewCommonWarBasicSettingsPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0003) },
                pageClass   : CommonViewCommonWarAdvancedSettingsPage.Page,
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
        const roomInfo      = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
        const userId        = UsersModel.getSelfUserId();
        const playerIndex   = roomInfo?.getPlayerDataList().find(v => v.getUserId() === userId)?.getPlayerIndex();
        if (playerIndex == null) {
            label.setText(``);
            return;
        }

        const warRuleCommonData = roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData();
        const teamIndex         = warRuleCommonData == null ? null : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        if (teamIndex == null) {
            label.setText(``);
            return;
        }

        label.setText(`P${playerIndex}${`\n`}${LangUtils.getPlayerTeamName(teamIndex) ?? LangConstants.UndefinedError}`);
    }

    private async _updateImgSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = UsersModel.getSelfUserId();
        const skinId        = (await MultiMatchRoomModelMmrModel.getRoomInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getUnitAndTileSkinId() ?? (await MultiMatchRoomModelMmrModel.getSelfSettings(roomId))?.getUnitAndTileSkinId();
        this._imgSkinId.loadSource(skinId == null ? `` : HelpersImageSource.getSkinCircle(skinId, true));
    }

    private async _updateGroupChooseReady(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = UsersModel.getSelfUserId();
        const isReady       = (await MultiMatchRoomModelMmrModel.getRoomInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getIsReady();
        this._imgReady.setIsVisible(!!isReady);
        this._btnChooseReady.setRedVisible(!isReady);
    }

    private _updateComponentsForLanguage(): void {
        this._labelRankMatch.setLangText(LangConstants.TextType.B1012);
        this._labelMyRoom.setLangText(LangConstants.TextType.B0410);
        this._labelRoomInfo.setLangText(LangConstants.TextType.B0398);
        this._btnBack.setLangText(LangConstants.TextType.B0146);
        this._btnBanCo.setLangText(LangConstants.TextType.B0590);
        this._btnBannedCo.setLangText(LangConstants.TextType.B0403);
        this._btnChooseCo.setLangText(LangConstants.TextType.B0425);
        this._btnChoosePlayerIndex.setLangText(LangConstants.TextType.B0168);
        this._btnChooseSkinId.setLangText(LangConstants.TextType.B0397);
        this._btnChooseReady.setLangText(LangConstants.TextType.B0402);

        this._groupNavigator.arrangeItems();
        this._updateLabelPlayerIndex();
    }

    private async _updateGroupBanCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo  = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
        const group     = this._groupBanCo;
        if ((!roomInfo) || (roomInfo.getTimeForStartSetSelfSettings() != null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const userId        = UsersModel.getSelfUserId();
            const playerData    = HelpersMisc.getExisted(roomInfo.getPlayerDataList().find(v => v.getUserId() === userId));
            const playerIndex   = playerData.getPlayerIndex();
            const banCoData     = roomInfo.getSettingsForMmw()?.getDataArrayForBanCo()?.find(v => v.getSrcPlayerIndex() === playerIndex);
            const btnBanCo      = this._btnBanCo;
            const btnBannedCo   = this._btnBannedCo;
            const labelBanCo    = this._labelBanCo;
            if (banCoData == null) {
                btnBanCo.setIsVisible(true);
                btnBannedCo.setIsVisible(false);
                labelBanCo.setText(``);
            } else {
                const bannedCoIdArray   = banCoData.getBannedCoIdArray() ?? [];
                const gameConfig        = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo.getSettingsForCommon()?.getConfigVersion()));
                btnBanCo.setIsVisible(false);
                btnBannedCo.setIsVisible(true);
                labelBanCo.setText(bannedCoIdArray.length
                    ? bannedCoIdArray.map(v => gameConfig.getCoBasicCfg(v)?.getName()).join(`\n`)
                    : LangUtils.getText(LangConstants.TextType.None)
                );
            }
        }
    }

    private async _updateGroupSettings(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo  = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
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

        const configVersion = (await MultiMatchRoomModelMmrModel.getRoomInfo(roomId))?.getSettingsForCommon()?.getConfigVersion();
        const gameConfig    = configVersion ? await GameConfigGcModel.getGameConfig(configVersion) : null;
        const coId          = (await MultiMatchRoomModelMmrModel.getSelfSettings(roomId))?.getCoId();
        this._imgCo.loadSource(((gameConfig == null) || (coId == null))
            ? ``
            : HelpersImageSource.getCoEye(gameConfig, coId, true) ?? ``
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

        const roomInfo              = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
        const labelCountdownTitle   = this._labelCountdownTitle;
        const labelCountdown        = this._labelCountdown;
        if (!roomInfo) {
            labelCountdownTitle.setText(``);
            labelCountdown.setText(``);
            return;
        }

        const timeForStartSetSelfSettings   = roomInfo.getTimeForStartSetSelfSettings();
        const currentTime                   = TimerTimerModel.getServerTimestamp();
        if (timeForStartSetSelfSettings != null) {
            labelCountdownTitle.setLangText(LangConstants.TextType.B0593);
            labelCountdown.setText(LangUtils.getTimeDurationText2(Math.max(0, timeForStartSetSelfSettings + GameConfigGcWar.MultiRankedWar.RoomPhaseTime - currentTime)));
        } else {
            labelCountdownTitle.setLangText(LangConstants.TextType.B0592);
            labelCountdown.setText(LangUtils.getTimeDurationText2(Math.max(0, HelpersMisc.getExisted(roomInfo.getTimeForCreateRoom()) + GameConfigGcWar.MultiRankedWar.RoomPhaseTime - currentTime)));
        }
        this._layoutCountdown.arrangeItems();
        this._groupState.arrangeItems();
    }
    private async _updateLabelState(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo      = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
        const labelState    = this._labelState;
        const groupState    = this._groupState;
        if (!roomInfo) {
            labelState.setText(``);
            groupState.arrangeItems();
            return;
        }

        const userId        = UsersModel.getSelfUserId();
        const playerData    = HelpersMisc.getExisted(roomInfo.getPlayerDataList().find(v => v.getUserId() === userId));
        const playerIndex   = playerData.getPlayerIndex();
        if (roomInfo.getTimeForStartSetSelfSettings() == null) {
            labelState.setText(roomInfo.getSettingsForMmw()?.getDataArrayForBanCo()?.some(v => v.getSrcPlayerIndex() === playerIndex)
                ? LangUtils.getText(LangConstants.TextType.A0133)
                : LangUtils.getText(LangConstants.TextType.A0210)
            );
        } else {
            labelState.setText(playerData.getIsReady()
                ? LangUtils.getText(LangConstants.TextType.A0134)
                : LangUtils.getText(LangConstants.TextType.A0211)
            );
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

    private async _createDataForCommonMapInfoPage(): Promise<CommonViewCommonWarMapInfoPage.OpenData> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return null;
        }

        const roomInfo      = await MultiMatchRoomModelMmrModel.getRoomInfo(roomId);
        const normalMapId   = roomInfo ? (roomInfo.getSettingsForMmw()?.getNormalMapId() ?? 0) : null;
        return normalMapId == null
            ? null
            : {
                mapInfo     : {
                    hasFog              : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                    gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                    mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                    overridingPlayers   : null,
                },
            };
    }

    private _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
        return MultiMatchRoomModelMmrModel.createDataForCommonWarPlayerInfoPage(this.getOpenData()?.roomId);
    }

    private _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
        return MultiMatchRoomModelMmrModel.createDataForCommonWarBasicSettingsPage(this.getOpenData()?.roomId);
    }

    private _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
        return MultiMatchRoomModelMmrModel.createDataForCommonWarAdvancedSettingsPage(this.getOpenData()?.roomId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupBanCo,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupState,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 0, },
            endProps    : { customAlpha: 1, },
        });

        await TimerTimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupBanCo,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupState,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 1, },
            endProps    : { customAlpha: 0, },
        });

        await TimerTimerModel.wait();
    }
}

interface DataForTabItemRenderer extends UiTypesUiListItemData.UiListItemData {
    name: string;
}
class TabItemRenderer extends UiComponentsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? LangConstants.UndefinedError);
    }
}
