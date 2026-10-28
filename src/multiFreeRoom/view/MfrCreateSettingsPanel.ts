import { TimerTypeId } from "../../bootTimers/Constants.ts";
import { type OpenData as CommonViewCommonWarAdvancedSettingsPageOpenData, Page } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarBasicSettingsPageOpenData,
    Page as CommonViewCommonWarBasicSettingsPage,
} from "../../common/view/CommonWarBasicSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarMapInfoPageOpenData,
    Page as CommonViewCommonWarMapInfoPage,
} from "../../common/view/CommonWarMapInfoPage.ts";
import { pickRandomCo } from "../../cos/Utils.ts";
import { showLang, show } from "../../FloatText.ts";
import { getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { gotoLobby } from "../../helpers/GameFlow.ts";
import { getCoEye, getSkinCircle } from "../../helpers/ImageSource.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getPlayerTeamName } from "../../lang/Utils.ts";
import { reqCreateRoom } from "../model/MfrProxy.ts";
import type { MfrRoomCreator } from "../model/MfrRoomCreator.ts";
import {
    type OpenData as MultiFreeRoomViewMfrCreatePlayerInfoPageOpenData,
    Page as MultiFreeRoomViewMfrCreatePlayerInfoPage,
} from "./MfrCreatePlayerInfoPage.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalMfwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { PlayerIndex, AliveStateId } from "../../players/Constants.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
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
import { setTimeout, clearTimeout } from "../../vendor/egret/Egret.ts";
import { getPlayerRule, getPlayersCountUnneutral, tickDefaultWeatherType } from "../../warRules/utils/CommonData.ts";
import {BasicSettingsTypeId} from "../../wars/Constants.ts";

type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPageOpenData;
type OpenDataForCommonWarMapInfoPage            = CommonViewCommonWarMapInfoPageOpenData;
type OpenDataForCommonWarAdvancedSettingsPage   = CommonViewCommonWarAdvancedSettingsPageOpenData;
type OpenDataForMfrCreatePlayerInfoPage         = MultiFreeRoomViewMfrCreatePlayerInfoPageOpenData;

const CONFIRM_INTERVAL_MS = 5000;

export interface OpenData {
    roomCreator : MfrRoomCreator;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupNavigator!           : IUiLayout;
    private readonly _labelFreeMode!            : IUiLabel;
    private readonly _labelCreateRoom!          : IUiLabel;
    private readonly _labelRoomSettings!        : IUiLabel;

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

    private readonly _groupTab!                 : IUiContainer;
    private readonly _tabSettings!              : IUiTab<DataForTabItemRenderer, void | OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForMfrCreatePlayerInfoPage>;

    private readonly _btnBack!                  : IUiButton;
    private readonly _btnConfirm!               : IUiButton;

    private _timeoutIdForBtnConfirm : number | null = null;
    private _isTabInitialized       = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,                callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
            { ui: this._btnChooseCo,            callback: this._onTouchedBtnChooseCo },
            { ui: this._btnChoosePlayerIndex,   callback: this._onTouchedBtnChoosePlayerIndex },
            { ui: this._btnChooseSkinId,        callback: this._onTouchedBtnChooseSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.RoomCreator_SelfCoIdChanged,     callback: this._onNotifyMfrCreateSelfCoIdChanged },
            { type: TypeId.RoomCreator_SelfSkinIdChanged,   callback: this._onNotifyMfrCreateSelfSkinIdChanged },
            { type: TypeId.MsgMfrCreateRoom,                callback: this._onNotifyMsgMfrCreateRoom },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();

        if (this.getOpenData()) {
            await this._updateAllPagesForTabSettings();
        }
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateImgCo();
        this._updateLabelPlayerIndex();
        this._updateImgSkinId();
        this._updateAllPagesForTabSettings();
    }
    protected override async _onClosed(): Promise<void> {
        this._clearTimeoutForBtnConfirm();

        this._isTabInitialized = false;
        await this._tabSettings.clear();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().MfrMainMenuPanel, void 0);
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
    }
    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (this._timeoutIdForBtnConfirm != null) {
            showLang(TextType.A0421);
            return;
        }

        reqCreateRoom(openData.roomCreator.generateData());
        this._resetTimeoutForBtnConfirm();
    }
    private async _onTouchedBtnChooseCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator       = openData.roomCreator;
        const currentCoId       = roomCreator.getSelfCoId();
        const warRuleCommonData = getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const gameConfig        = roomCreator.getGcData();
        openPanel(getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...getFinalMfwHumanCoIdSet({
                playerRule      : getPlayerRule(warRuleCommonData, roomCreator.getSelfPlayerIndex()),
                gameConfig      : gameConfig,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : true,
            })],
            isBan               : false,
            callbackOnConfirm   : newCoId => {
                if (newCoId !== currentCoId) {
                    roomCreator.setSelfCoId(newCoId);
                }
            },
        });
    }
    private async _onTouchedBtnChoosePlayerIndex(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const gameConfig    = roomCreator.getGcData();
        if (gameConfig == null) {
            return;
        }

        const warRuleCommonData         = getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const playersCountUnneutral     = getPlayersCountUnneutral(warRuleCommonData);
        const playerDataArray           = roomCreator.getInitialWarData().getPlayerManager()?.getPlayers() ?? [];
        const availablePlayerIndexArray : number[] = [];
        for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerData = playerDataArray.find(v => (v.getPlayerIndex()) === playerIndex);
            if ((playerData != null)                                                            &&
                (playerData.getUserId() != null)                                                &&
                ((playerData.getAliveState()) !== AliveStateId.Dead)
            ) {
                availablePlayerIndexArray.push(playerIndex);
            }
        }

        const oldPlayerIndex = roomCreator.getSelfPlayerIndex();
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : oldPlayerIndex,
            availableNumberArray    : availablePlayerIndexArray,
            getTitleText            : () => getText(TextType.B0168),
            getNumberMainText       : playerIndex => `P${playerIndex}, ${getPlayerTeamName(getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) ?? UndefinedError}`,
            callbackOnConfirm       : targetPlayerIndex => {
                if (oldPlayerIndex === targetPlayerIndex) {
                    return;
                }
                roomCreator.setSelfPlayerIndex(targetPlayerIndex);

                const targetPlayer = getExisted(playerDataArray.find(v => (v.getPlayerIndex() === targetPlayerIndex)));
                playerDataArray.find(v => v.getPlayerIndex() === oldPlayerIndex)?.setUnitAndTileSkinId(targetPlayer.getUnitAndTileSkinId());
                targetPlayer.setUnitAndTileSkinId(roomCreator.getSelfUnitAndTileSkinId());

                this._updateLabelPlayerIndex();
                dispatch(TypeId.MfrCreatePlayerSkinIdChanged);

                const availableCoIdSet = getFinalMfwHumanCoIdSet({
                    playerRule      : getPlayerRule(warRuleCommonData, targetPlayerIndex),
                    gameConfig      : gameConfig,
                    hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                    includeRandom   : true,
                });
                if (!availableCoIdSet.has(roomCreator.getSelfCoId())) {
                    roomCreator.setSelfCoId(pickRandomCo([...availableCoIdSet]));
                }
            },
        });
    }
    private _onTouchedBtnChooseSkinId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const oldSkinId     = roomCreator.getSelfUnitAndTileSkinId();
        openPanel(getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId           : oldSkinId,
            availableSkinIdArray    : getAllSkinIdArray(false),
            callback                : newSkinId => {
                if (oldSkinId === newSkinId) {
                    return;
                }

                const players           = roomCreator.getInitialWarData().getPlayerManager()?.getPlayers() ?? [];
                const existingPlayer    = players.find(v => v.getUnitAndTileSkinId() === newSkinId);
                players.find(v => v.getUnitAndTileSkinId() === oldSkinId)?.setUnitAndTileSkinId(newSkinId);
                existingPlayer?.setUnitAndTileSkinId(oldSkinId);
                roomCreator.setSelfUnitAndTileSkinId(newSkinId);

                dispatch(TypeId.MfrCreatePlayerSkinIdChanged);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMfrCreateSelfCoIdChanged(): void {
        this._updateImgCo();
    }
    private _onNotifyMfrCreateSelfSkinIdChanged(): void {
        this._updateImgSkinId();
    }
    private _onNotifyMsgMfrCreateRoom(): void {
        show(getText(TextType.A0015));
        gotoLobby();
    }

    private _resetTimeoutForBtnConfirm(): void {
        this._clearTimeoutForBtnConfirm();
        this._timeoutIdForBtnConfirm = setTimeout(() => {
            this._timeoutIdForBtnConfirm = null;
        }, this, CONFIRM_INTERVAL_MS);
    }

    private _clearTimeoutForBtnConfirm(): void {
        if (this._timeoutIdForBtnConfirm != null) {
            clearTimeout(this._timeoutIdForBtnConfirm);
            this._timeoutIdForBtnConfirm = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for the view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelFreeMode.setLangText(TextType.B0557);
        this._labelCreateRoom.setLangText(TextType.B0000);
        this._labelRoomSettings.setLangText(TextType.B0571);
        this._btnChooseCo.setLangText(TextType.B0425);
        this._btnChoosePlayerIndex.setLangText(TextType.B0168);
        this._btnChooseSkinId.setLangText(TextType.B0397);
        this._btnBack.setLangText(TextType.B0146);
        this._btnConfirm.setLangText(TextType.B0026);

        this._groupNavigator.arrangeItems();

        this._updateLabelPlayerIndex();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: getText(TextType.B0002) },
                pageClass   : CommonViewCommonWarBasicSettingsPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0003) },
                pageClass   : Page,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0224) },
                pageClass   : MultiFreeRoomViewMfrCreatePlayerInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0298) },
                pageClass   : CommonViewCommonWarMapInfoPage,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
            this._updateMfrCreatePlayerInfoPage(),
            this._updateCommonWarMapInfoPage(),
        ]);
    }
    private _updateCommonWarBasicSettingsPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, this._createDataForCommonWarBasicSettingsPage());
        }
    }
    private _updateCommonWarAdvancedSettingsPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private _updateMfrCreatePlayerInfoPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, this._createDataForMfrCreatePlayerInfoPage());
        }
    }
    private _updateCommonWarMapInfoPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, this._createDataForCommonWarMapInfoPage());
        }
    }

    private _createDataForCommonWarBasicSettingsPage(): OpenDataForCommonWarBasicSettingsPage {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const roomCreator       = openData.roomCreator;
        const instanceWarRule   = roomCreator.getInstanceWarRule();
        const bootTimerParams   = roomCreator.getBootTimerParams();
        const settingsForCommon = roomCreator.getSettingsForCommon();
        const gameConfig        = roomCreator.getGcData();
        const timerType         = bootTimerParams[0] as TimerTypeId;
        const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
        const warRuleCommonData = getExisted(instanceWarRule.getWarRuleCommonData());
        const openDataForPage   : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings: [
                {
                    settingsType    : BasicSettingsTypeId.WarName,
                    currentValue    : roomCreator.getWarName() ?? null,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarName(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : BasicSettingsTypeId.WarPassword,
                    currentValue    : roomCreator.getWarPassword() ?? null,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarPassword(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : BasicSettingsTypeId.WarComment,
                    currentValue    : roomCreator.getWarComment() ?? null,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarComment(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType        : BasicSettingsTypeId.WarRuleTitle,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : null,
                },
                {
                    settingsType        : BasicSettingsTypeId.HasFog,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : () => {
                        const data = instanceWarRule.createIfNotExistsWarRuleCommonData();
                        data.setHasFogByDefault(!data.getHasFogByDefault());
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType        : BasicSettingsTypeId.Weather,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : () => {
                        tickDefaultWeatherType(warRuleCommonData, gameConfig);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType        : BasicSettingsTypeId.TileTheme,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : newValue => {
                        if (typeof newValue === "string") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }

                        const data = instanceWarRule.createIfNotExistsWarRuleCommonData();
                        if (data.getFixedTileTheme() !== newValue) {
                            data.setFixedTileTheme(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        }
                    },
                },
                {
                    settingsType        : BasicSettingsTypeId.WarEvent,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : null,
                },
                {
                    settingsType    : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                    currentValue    : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue !== "string") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }

                        const stringArray = newValue.split(`,`);
                        settingsForCommon.setTurnsLimit(parseInt(stringArray[0]));
                        settingsForCommon.setWarOperationsLimit(parseInt(stringArray[1]));
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : BasicSettingsTypeId.TimerType,
                    currentValue    : timerType,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: async () => {
                        roomCreator.tickBootTimerType();
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            ],
        };
        if (timerType === TimerTypeId.Regular) {
            openDataForPage.dataArrayForListSettings.push({
                settingsType    : BasicSettingsTypeId.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule: instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: () => {
                    roomCreator.tickTimerRegularTime();
                    this._updateCommonWarBasicSettingsPage();
                },
            });
        } else if (timerType === TimerTypeId.Incremental) {
            openDataForPage.dataArrayForListSettings.push(
                {
                    settingsType    : BasicSettingsTypeId.TimerIncrementalParams,
                    currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: (newValue: number | string | null) => {
                        if (typeof newValue !== "string") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }

                        roomCreator.setBootTimerParams([TimerTypeId.Incremental, ...newValue.split(`,`).map(v => parseInt(v))]);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            );
        } else {
            throw newError(`MfrCreateSettingsPanel._createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openDataForPage;
    }
    private _createDataForCommonWarAdvancedSettingsPage(): OpenDataForCommonWarAdvancedSettingsPage {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            canModify       : true,
            instanceWarRule : roomCreator.getInstanceWarRule(),
            gameModeId      : ModeId.Free,
            gcData          : roomCreator.getGcData(),
        };
    }
    private _createDataForMfrCreatePlayerInfoPage(): OpenDataForMfrCreatePlayerInfoPage {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        return {
            roomCreator   : openData.roomCreator,
        };
    }
    private _createDataForCommonWarMapInfoPage(): OpenDataForCommonWarMapInfoPage {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const roomCreator   = openData.roomCreator;
        const warData       = roomCreator.getInitialWarData();
        return warData == null
            ? null
            : {
                warInfo     : {
                    warData             : warData,
                    showInitialWarData  : false,
                    overridingPlayers   : null,
                },
            };
    }

    private async _updateImgCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const gameConfig    = roomCreator.getGcData();
        const coId          = roomCreator.getSelfCoId();
        this._imgCo.loadSource(((gameConfig == null) || (coId == null))
            ? ``
            : getCoEye(gameConfig, coId, true) ?? ``
        );
    }

    private _updateLabelPlayerIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator       = openData.roomCreator;
        const playerIndex       = roomCreator.getSelfPlayerIndex();
        const warRuleCommonData = getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const teamIndex         = getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        this._labelPlayerIndex.setText(`P${playerIndex}${`\n`}${getPlayerTeamName(teamIndex) ?? UndefinedError}`);
    }

    private _updateImgSkinId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator = openData.roomCreator;
        this._imgSkinId.loadSource(getSkinCircle(roomCreator.getSelfUnitAndTileSkinId(), true));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Executor.reset({
            obj         : this._btnConfirm,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 0, },
            endProps    : { customAlpha: 1, },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Executor.reset({
            obj         : this._btnConfirm,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 1, },
            endProps    : { customAlpha: 0, },
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
