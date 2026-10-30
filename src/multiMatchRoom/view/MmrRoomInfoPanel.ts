import {
    type OpenData as CommonWarAdvancedSettingsPageOpenData,
    Page as CommonWarAdvancedSettingsPage,
} from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import {
    type OpenData as CommonWarBasicSettingsPageOpenData,
    Page as CommonWarBasicSettingsPage,
} from "../../common/view/CommonWarBasicSettingsPage.ts";
import {
    type OpenData as CommonWarMapInfoPageOpenData,
    Page as CommonWarMapInfoPage,
} from "../../common/view/CommonWarMapInfoPage.ts";
import {
    type OpenData as CommonWarPlayerInfoPageOpenData,
    Page as CommonWarPlayerInfoPage,
} from "../../common/view/CommonWarPlayerInfoPage.ts";
import {
    CategoryId,
    CoId,
} from "../../cos/Constants.ts";
import {
    show,
    showLang,
} from "../../FloatText.ts";
import { getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import {
    getCoEye,
    getSkinCircle,
} from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getFormattedText,
    getPlayerTeamName,
    getText,
    getTimeDurationText2,
} from "../../lang/Utils.ts";
import { Common as MultiRankedWarsCommon } from "../../multiRankedWars/Constants.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as MmrDeleteRoomByServerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrDeleteRoomByServer/S.ts";
import type { S as MmrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetRoomPublicInfo/S.ts";
import type { S as MmrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedCoIdArray/S.ts";
import type { S as MmrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetSelfSettings/S.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import {
    getServerTimestamp,
    wait,
} from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import { UiTabItemRenderer } from "../../ui/components/UiTabItemRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiTab } from "../../ui/interfaces/IUiTab.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfUserId } from "../../users/Model.ts";
import type { Event } from "../../egret/Egret.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";
import {
    createDataForCommonWarAdvancedSettingsPage,
    createDataForCommonWarBasicSettingsPage,
    createDataForCommonWarPlayerInfoPage,
    getRoomInfo,
    getSelfSettings,
} from "../model/MmrModel.ts";
import {
    reqMmrGetRoomPublicInfo,
    reqMmrSetBannedCoIdArray,
    reqMmrSetSelfSettings,
} from "../model/MmrProxy.ts";

export interface OpenData {
    roomId  : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!                 : IUiContainer;
    private readonly _tabSettings!              : IUiTab<DataForTabItemRenderer, CommonWarMapInfoPageOpenData | CommonWarPlayerInfoPageOpenData | CommonWarBasicSettingsPageOpenData | CommonWarAdvancedSettingsPageOpenData>;

    private readonly _groupNavigator!           : IUiLayout;
    private readonly _labelRankMatch!           : IUiLabel;
    private readonly _labelMyRoom!              : IUiLabel;
    private readonly _labelRoomInfo!            : IUiLabel;

    private readonly _groupBanCo!               : IUiContainer;
    private readonly _btnBanCo!                 : IUiButton;
    private readonly _btnBannedCo!              : IUiButton;
    private readonly _labelBanCo!               : IUiLabel;

    private readonly _groupSettings!            : IUiContainer;
    private readonly _groupChooseCo!            : IUiContainer;
    private readonly _btnChooseCo!              : IUiButton;
    private readonly _imgCo!                    : IUiImage;

    private readonly _groupChoosePlayerIndex!   : IUiContainer;
    private readonly _btnChoosePlayerIndex!     : IUiButton;
    private readonly _labelPlayerIndex!         : IUiLabel;

    private readonly _groupChooseSkinId!        : IUiContainer;
    private readonly _btnChooseSkinId!          : IUiButton;
    private readonly _imgSkinId!                : IUiImage;

    private readonly _groupChooseReady!         : IUiContainer;
    private readonly _btnChooseReady!           : IUiButton;
    private readonly _imgReady!                 : IUiImage;

    private readonly _groupState!               : IUiLayout;
    private readonly _layoutCountdown!          : IUiLayout;
    private readonly _labelCountdownTitle!      : IUiLabel;
    private readonly _labelCountdown!           : IUiLabel;
    private readonly _labelState!               : IUiLabel;

    private readonly _btnBack!                  : IUiButton;

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
            { type : TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : TypeId.TimeTick,                            callback : this._onNotifyTimeTick },
            { type : TypeId.RoomSelfSettingsCoIdChanged,          callback : this._onNotifyMmrSelfSettingsCoIdChanged },
            { type : TypeId.MsgMmrGetRoomPublicInfo,             callback : this._onNotifyMsgMmrGetRoomPublicInfo },
            { type : TypeId.MsgMmrSetSelfSettings,               callback : this._onNotifyMsgMmrSetSelfSettings },
            { type : TypeId.MsgMmrSetBannedCoIdArray,            callback : this._onNotifyMsgMmrSetBannedCoIdArray },
            { type : TypeId.MsgMmrDeleteRoomByServer,            callback : this._onNotifyMsgMmrDeleteRoomByServer },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
            reqMmrGetRoomPublicInfo(roomId);
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
        openPanel(getDict().MpwMyRoomListPanel, void 0);
    }

    private async _onTouchedBtnBanCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return;
        }

        const userId            = getSelfUserId();
        const selfPlayerData    = roomInfo.getPlayerDataList().find(v => v.getUserId() === userId);
        if (selfPlayerData == null) {
            return;
        }

        const instanceWarRule           = roomInfo.getSettingsForCommon()?.getInstanceWarRule();
        const bannedCoCategoryIdSets    = instanceWarRule?.getWarRuleCommonData()?.getPlayerRuleList().filter(v => v.getPlayerIndex()).map(v => new Set(v.getBannedCoCategoryIdArray())) ?? [];
        const warType                   = instanceWarRule?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypeId.MmwFog : WarTypeId.MmwStd;
        const gcData                    = await getGameConfig(getExisted(roomInfo.getSettingsForCommon()?.getConfigVersion()));
        openPanel(getDict().CommonChooseMultiCoCategoryIdPanel, {
            gameConfig                 : gcData,
            availableCoCategoryIdArray : gcData
                .getEnabledCoCategoryIdArray(warType)
                .filter(coCategoryId =>
                    (coCategoryId !== CategoryId.Random)                                            &&
                    ((!bannedCoCategoryIdSets.length) || (bannedCoCategoryIdSets.some(v => !v.has(coCategoryId))))
                ),
            currentCoCategoryIdArray       : [],
            forceUnchosenCoCategoryIdArray : null,
            maxChooseCount                 : gcData.getSystemCfg().getMaxBanCoNumber(),
            isBan                          : true,
            getTitleText                   : () => getText(TextType.B0590),
            callbackOnConfirm              : bannedCoCategoryIdArray => {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent : () => bannedCoCategoryIdArray.length <= 0
                        ? getText(TextType.A0139)
                        : getFormattedText(
                            TextType.F0185,
                            bannedCoCategoryIdArray.map(v => gcData.getCoIdByCategoryId(v)).map(v => gcData.getCoNameAndTierText(v) ?? UndefinedError).join(`, `)
                        ),
                    callback : () => reqMmrSetBannedCoIdArray(
                        roomId,
                        bannedCoCategoryIdArray.map(v => (gcData.getEnabledCoIdByCategoryId(v) ?? gcData.getCoIdByCategoryId(v)))
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

        const roomSelfSettings = await getSelfSettings(roomId);
        if (roomSelfSettings == null) {
            return;
        }

        const roomInfo          = await getRoomInfo(roomId);
        const selfUserId        = getSelfUserId();
        const selfPlayerData    = roomInfo ? roomInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId) : null;
        if (selfPlayerData != null) {
            if (selfPlayerData.getIsReady()) {
                show(getText(TextType.A0207));
            } else {
                const currentCoId = roomSelfSettings.getCoId();
                openPanel(getDict().CommonChooseSingleCoIdPanel, {
                    gameConfig         : await getGameConfig(getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                    currentCoId        : currentCoId,
                    availableCoIdArray : getExisted(roomSelfSettings.getAvailableCoIdArray()),
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
        showLang(TextType.A0209);
    }

    private async _onTouchedBtnChooseSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return;
        }

        const roomSelfSettings = await getSelfSettings(roomId);
        if (roomSelfSettings == null) {
            return;
        }

        const selfUserId        = getSelfUserId();
        const playerDataList    = roomInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.getIsReady()) {
            show(getText(TextType.A0128));
            return;
        }

        const usedSkinIdArray       = getNonNullElements(playerDataList?.filter(v => v.getUserId() !== selfUserId).map(v => v.getUnitAndTileSkinId()));
        const availableSkinIdArray  = getAllSkinIdArray(false).filter(v => usedSkinIdArray.indexOf(v) < 0);
        const selfSkinId            = selfPlayerData.getUnitAndTileSkinId();
        openPanel(getDict().CommonChooseSingleSkinIdPanel, {
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

        const roomSelfSettings = await getSelfSettings(roomId);
        if (roomSelfSettings == null) {
            return;
        }

        const selfUserId        = getSelfUserId();
        const selfPlayerData    = (await getRoomInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.getIsReady()) {
            show(getText(TextType.A0205));
            return;
        }

        const coId      = roomSelfSettings.getCoId();
        const skinId    = roomSelfSettings.getUnitAndTileSkinId();
        if ((coId == null) || (skinId == null)) {
            return;
        }

        const callback  = () => {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0206),
                callback   : () => {
                    reqMmrSetSelfSettings(roomId, coId, skinId);
                },
            });
        };
        if ((coId == CoId.Empty)                                                             &&
            ((roomSelfSettings.getAvailableCoIdArray() || []).some(v => v !== CoId.Empty))
        ) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0208),
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

    private _onNotifyMsgMmrGetRoomPublicInfo(e: Event): void {
        const data = e.data as MmrGetRoomPublicInfoResponse;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
            this._updateAllPagesForTabSettings();
        }
    }

    private _onNotifyMsgMmrSetSelfSettings(e: Event): void {
        const data = e.data as MmrSetSelfSettingsResponse;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            this._updateGroupSettings();
            this._updateGroupState();
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgMmrSetBannedCoIdArray(e: Event): void {
        const data = e.data as MmrSetBannedCoIdArrayResponse;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
            this._updateCommonWarPlayerInfoPage();
        }
    }

    private _onNotifyMsgMmrDeleteRoomByServer(e: Event): void {
        const data = e.data as MmrDeleteRoomByServerResponse;
        if (data.getRoomId() === this.getOpenData()?.roomId) {
            show(getText(TextType.A0019));
            this.closePanel();
            openPanel(getDict().MpwMyRoomListPanel, void 0);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name : getText(TextType.B0298) },
                pageClass   : CommonWarMapInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name : getText(TextType.B0224) },
                pageClass   : CommonWarPlayerInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name : getText(TextType.B0002) },
                pageClass   : CommonWarBasicSettingsPage,
                pageData    : null,
            },
            {
                tabItemData : { name : getText(TextType.B0003) },
                pageClass   : CommonWarAdvancedSettingsPage,
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
        const roomInfo      = await getRoomInfo(roomId);
        const userId        = getSelfUserId();
        const playerIndex   = roomInfo?.getPlayerDataList().find(v => v.getUserId() === userId)?.getPlayerIndex();
        if (playerIndex == null) {
            label.setText(``);
            return;
        }

        const warRuleCommonData = roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData();
        const teamIndex         = warRuleCommonData == null ? null : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        if (teamIndex == null) {
            label.setText(``);
            return;
        }

        label.setText(`P${playerIndex}${`\n`}${getPlayerTeamName(teamIndex) ?? UndefinedError}`);
    }

    private async _updateImgSkinId(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = getSelfUserId();
        const skinId        = (await getRoomInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getUnitAndTileSkinId() ?? (await getSelfSettings(roomId))?.getUnitAndTileSkinId();
        this._imgSkinId.loadSource(skinId == null ? `` : getSkinCircle(skinId, true));
    }

    private async _updateGroupChooseReady(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const selfUserId    = getSelfUserId();
        const isReady       = (await getRoomInfo(roomId))?.getPlayerDataList().find(v => v.getUserId() === selfUserId)?.getIsReady();
        this._imgReady.setIsVisible(!!isReady);
        this._btnChooseReady.setRedVisible(!isReady);
    }

    private _updateComponentsForLanguage(): void {
        this._labelRankMatch.setLangText(TextType.B1012);
        this._labelMyRoom.setLangText(TextType.B0410);
        this._labelRoomInfo.setLangText(TextType.B0398);
        this._btnBack.setLangText(TextType.B0146);
        this._btnBanCo.setLangText(TextType.B0590);
        this._btnBannedCo.setLangText(TextType.B0403);
        this._btnChooseCo.setLangText(TextType.B0425);
        this._btnChoosePlayerIndex.setLangText(TextType.B0168);
        this._btnChooseSkinId.setLangText(TextType.B0397);
        this._btnChooseReady.setLangText(TextType.B0402);

        this._groupNavigator.arrangeItems();
        this._updateLabelPlayerIndex();
    }

    private async _updateGroupBanCo(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo  = await getRoomInfo(roomId);
        const group     = this._groupBanCo;
        if ((!roomInfo) || (roomInfo.getTimeForStartSetSelfSettings() != null)) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const userId        = getSelfUserId();
            const playerData    = getExisted(roomInfo.getPlayerDataList().find(v => v.getUserId() === userId));
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
                const bannedCoIdArray   = banCoData.getBannedCoIdArray();
                const gameConfig        = await getGameConfig(getExisted(roomInfo.getSettingsForCommon()?.getConfigVersion()));
                btnBanCo.setIsVisible(false);
                btnBannedCo.setIsVisible(true);
                labelBanCo.setText(bannedCoIdArray.length
                    ? bannedCoIdArray.map(v => gameConfig.getCoBasicCfg(v)?.getName()).join(`\n`)
                    : getText(TextType.None)
                );
            }
        }
    }

    private async _updateGroupSettings(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo  = await getRoomInfo(roomId);
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

        const configVersion = (await getRoomInfo(roomId))?.getSettingsForCommon()?.getConfigVersion();
        const gameConfig    = configVersion ? await getGameConfig(configVersion) : null;
        const coId          = (await getSelfSettings(roomId))?.getCoId();
        this._imgCo.loadSource(((gameConfig == null) || (coId == null))
            ? ``
            : getCoEye(gameConfig, coId, true) ?? ``
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

        const roomInfo              = await getRoomInfo(roomId);
        const labelCountdownTitle   = this._labelCountdownTitle;
        const labelCountdown        = this._labelCountdown;
        if (!roomInfo) {
            labelCountdownTitle.setText(``);
            labelCountdown.setText(``);
            return;
        }

        const timeForStartSetSelfSettings   = roomInfo.getTimeForStartSetSelfSettings();
        const currentTime                   = getServerTimestamp();
        if (timeForStartSetSelfSettings != null) {
            labelCountdownTitle.setLangText(TextType.B0593);
            labelCountdown.setText(getTimeDurationText2(Math.max(0, timeForStartSetSelfSettings + MultiRankedWarsCommon.RoomPhaseTime - currentTime)));
        } else {
            labelCountdownTitle.setLangText(TextType.B0592);
            labelCountdown.setText(getTimeDurationText2(Math.max(0, roomInfo.getTimeForCreateRoom() + MultiRankedWarsCommon.RoomPhaseTime - currentTime)));
        }
        this._layoutCountdown.arrangeItems();
        this._groupState.arrangeItems();
    }
    private async _updateLabelState(): Promise<void> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return;
        }

        const roomInfo      = await getRoomInfo(roomId);
        const labelState    = this._labelState;
        const groupState    = this._groupState;
        if (!roomInfo) {
            labelState.setText(``);
            groupState.arrangeItems();
            return;
        }

        const userId        = getSelfUserId();
        const playerData    = getExisted(roomInfo.getPlayerDataList().find(v => v.getUserId() === userId));
        const playerIndex   = playerData.getPlayerIndex();
        if (roomInfo.getTimeForStartSetSelfSettings() == null) {
            labelState.setLangText(roomInfo.getSettingsForMmw()?.getDataArrayForBanCo()?.some(v => v.getSrcPlayerIndex() === playerIndex) ? TextType.A0133 : TextType.A0210);
        } else {
            labelState.setLangText(playerData.getIsReady() ? TextType.A0134 : TextType.A0211);
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

    private async _createDataForCommonMapInfoPage(): Promise<CommonWarMapInfoPageOpenData> {
        const roomId = this.getOpenData()?.roomId;
        if (roomId == null) {
            return null;
        }

        const roomInfo      = await getRoomInfo(roomId);
        const normalMapId   = roomInfo ? (roomInfo.getSettingsForMmw()?.getNormalMapId() ?? 0) : null;
        return normalMapId == null
            ? null
            : {
                mapInfo : {
                    hasFog            : !!roomInfo?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                    gameConfig        : await getGameConfig(getExisted(roomInfo?.getSettingsForCommon()?.getConfigVersion())),
                    mapRawData        : getExisted(await getRawData(normalMapId)),
                    overridingPlayers : null,
                },
            };
    }

    private _createDataForCommonWarPlayerInfoPage(): Promise<CommonWarPlayerInfoPageOpenData> {
        return createDataForCommonWarPlayerInfoPage(this.getOpenData()?.roomId);
    }

    private _createDataForCommonWarBasicSettingsPage(): Promise<CommonWarBasicSettingsPageOpenData> {
        return createDataForCommonWarBasicSettingsPage(this.getOpenData()?.roomId);
    }

    private _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonWarAdvancedSettingsPageOpenData> {
        return createDataForCommonWarAdvancedSettingsPage(this.getOpenData()?.roomId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Executor.reset({
            obj        : this._groupBanCo,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Executor.reset({
            obj        : this._groupSettings,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Executor.reset({
            obj        : this._groupState,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 0, },
            endProps   : { customAlpha : 1, },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Executor.reset({
            obj        : this._groupBanCo,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Executor.reset({
            obj        : this._groupSettings,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Executor.reset({
            obj        : this._groupState,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 1, },
            endProps   : { customAlpha : 0, },
        });

        await wait();
    }
}

interface DataForTabItemRenderer extends UiListItemData {
    name: string;
}
class TabItemRenderer extends UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? UndefinedError);
    }
}
