import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as CosUtils from "../../cos/Utils.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiCustomRoomModelMcrProxy from "../model/McrProxy.ts";
import type * as MultiCustomRoomModelMcrRoomCreator from "../model/McrRoomCreator.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
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
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPage.OpenData;
type OpenDataForCommonWarMapInfoPage            = CommonViewCommonWarMapInfoPage.OpenData;
type OpenDataForCommonWarAdvancedSettingsPage   = CommonViewCommonWarAdvancedSettingsPage.OpenData;

const CONFIRM_INTERVAL_MS = 5000;

export interface OpenData {
    roomCreator : MultiCustomRoomModelMcrRoomCreator.McrRoomCreator;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupNavigator!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCreateRoom!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseMap!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRoomSettings!        : UiInterfacesIUiLabel.IUiLabel;

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

    private readonly _groupTab!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!              : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, void | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarAdvancedSettingsPage>;

    private readonly _btnBack!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!               : UiInterfacesIUiButton.IUiButton;

    private _timeoutIdForBtnConfirm             : number | null = null;
    private _isTabInitialized                   = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,                callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
            { ui: this._btnChooseCo,            callback: this._onTouchedBtnChooseCo },
            { ui: this._btnChoosePlayerIndex,   callback: this._onTouchedBtnChoosePlayerIndex },
            { ui: this._btnChooseSkinId,        callback: this._onTouchedBtnChooseSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.RoomCreator_SelfCoIdChanged,   callback: this._onNotifyMcrCreateSelfCoIdChanged },
            { type: NotificationsTypeId.TypeId.MsgMcrCreateRoom,           callback: this._onNotifyMsgMcrCreateRoom },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();

        if (this.getOpenData()) {
            this._updateAllPagesForTabSettings();
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (this._timeoutIdForBtnConfirm != null) {
            FloatText2.showLang(LangConstants.TextType.A0421);
            return;
        }

        MultiCustomRoomModelMcrProxy.reqCreateRoom(openData.roomCreator.generateData());
        this._resetTimeoutForBtnConfirm();
    }
    private _onTouchedBtnChooseCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator       = openData.roomCreator;
        const currentCoId       = roomCreator.getSelfCoId();
        const gameConfig        = roomCreator.getGcData();
        const warRuleCommonData = HelpersMisc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...PlayerRulesUtils.getFinalMcwHumanCoIdSet({
                playerRule          : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, roomCreator.getSelfPlayerIndex()),
                gameConfiguration   : gameConfig,
                hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                includeRandom       : true,
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

        const roomCreator           = openData.roomCreator;
        const playersCountUnneutral = (await roomCreator.getMapRawData()).getPlayersCountUnneutral();
        if (playersCountUnneutral == null) {
            return;
        }

        const warRuleCommonData = HelpersMisc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : roomCreator.getSelfPlayerIndex(),
            availableNumberArray    : HelpersCollection.createRange(PlayersConstants.PlayerIndex.First, playersCountUnneutral + 1, 1),
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0168),
            getNumberMainText       : playerIndex => `P${playerIndex}, ${LangUtils.getPlayerTeamName(WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) ?? LangConstants.UndefinedError}`,
            callbackOnConfirm       : playerIndex => {
                roomCreator.setSelfPlayerIndex(playerIndex);
                this._updateLabelPlayerIndex();

                const availableCoIdArray = [...PlayerRulesUtils.getFinalMcwHumanCoIdSet({
                    playerRule          : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfiguration   : roomCreator.getGcData(),
                    hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                    includeRandom       : true,
                })];
                if (availableCoIdArray.indexOf(roomCreator.getSelfCoId()) < 0) {
                    roomCreator.setSelfCoId(CosUtils.pickRandomCo(availableCoIdArray));
                }
            },
        });
    }
    private _onTouchedBtnChooseSkinId(): void {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId           : roomCreator.getSelfUnitAndTileSkinId(),
            availableSkinIdArray    : ForceSkinsUtils.getAllSkinIdArray(false),
            callback                : skinId => {
                roomCreator.setSelfUnitAndTileSkinId(skinId);
                this._updateImgSkinId();
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMcrCreateSelfCoIdChanged(): void {
        this._updateImgCo();
    }
    private _onNotifyMsgMcrCreateRoom(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0015));
        HelpersGameFlow.gotoLobby();
    }

    private _resetTimeoutForBtnConfirm(): void {
        this._clearTimeoutForBtnConfirm();
        this._timeoutIdForBtnConfirm = VendorEgretEgret.setTimeout(() => {
            this._timeoutIdForBtnConfirm = null;
        }, this, CONFIRM_INTERVAL_MS);
    }

    private _clearTimeoutForBtnConfirm(): void {
        if (this._timeoutIdForBtnConfirm != null) {
            VendorEgretEgret.clearTimeout(this._timeoutIdForBtnConfirm);
            this._timeoutIdForBtnConfirm = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for the view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelCreateRoom.setLangText(LangConstants.TextType.B0000);
        this._labelMultiPlayer.setLangText(LangConstants.TextType.B1011);
        this._labelChooseMap.setLangText(LangConstants.TextType.B0227);
        this._labelRoomSettings.setLangText(LangConstants.TextType.B0571);
        this._btnChooseCo.setLangText(LangConstants.TextType.B0425);
        this._btnChoosePlayerIndex.setLangText(LangConstants.TextType.B0168);
        this._btnChooseSkinId.setLangText(LangConstants.TextType.B0397);
        this._btnBack.setLangText(LangConstants.TextType.B0146);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);

        this._groupNavigator.arrangeItems();

        this._updateLabelPlayerIndex();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
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
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0298) },
                pageClass   : CommonViewCommonWarMapInfoPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonWarBasicSettingsPage(),
            this._updateMcrCreateAdvancedSettingsPage(),
            this._updateCommonWarMapInfoPage(),
        ]);
    }
    private _updateCommonWarBasicSettingsPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, this._createDataForCommonWarBasicSettingsPage());
        }
    }
    private _updateMcrCreateAdvancedSettingsPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private _updateCommonWarMapInfoPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, this._createDataForCommonMapInfoPage());
        }
    }

    private _createDataForCommonWarBasicSettingsPage(): OpenDataForCommonWarBasicSettingsPage {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        const instanceWarRule   = roomCreator.getInstanceWarRule();
        const warRuleCommonData = instanceWarRule.getWarRuleCommonData();
        if (warRuleCommonData == null) {
            return null;
        }

        const bootTimerParams       = roomCreator.getBootTimerParams();
        const settingsForCommon     = roomCreator.getSettingsForCommon();
        const gcData                = roomCreator.getGcData();
        const warEventFullData      = roomCreator.getMapRawData().getWarEventFullData() ?? null;
        const timerType             = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
        const openData              : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings: [
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.NormalMapId,
                    currentValue    : roomCreator.getSettingsForMcw().getNormalMapId(),
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.WarName,
                    currentValue    : roomCreator.getWarName() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue == "number") {
                            throw HelpersMisc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarName(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.WarPassword,
                    currentValue    : roomCreator.getWarPassword() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue == "number") {
                            throw HelpersMisc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarPassword(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.WarComment,
                    currentValue    : roomCreator.getWarComment() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue == "number") {
                            throw HelpersMisc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarComment(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: async () => {
                        await roomCreator.tickTemplateWarRuleId();
                        this._updateCommonWarBasicSettingsPage();
                        this._updateMcrCreateAdvancedSettingsPage();
                    },
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.HasFog,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: () => {
                        warRuleCommonData.setHasFogByDefault(!warRuleCommonData.getHasFogByDefault());
                        instanceWarRule.setTemplateWarRuleId(null);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.Weather,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: () => {
                        WarRulesUtilsCommonData.tickDefaultWeatherType(warRuleCommonData, gcData);
                        instanceWarRule.setTemplateWarRuleId(null);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType        : GameConfigGcWar.BasicSettingsType.TileTheme,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gcData,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : newValue => {
                        if (typeof newValue === "string") {
                            throw HelpersMisc.newError(`Invalid newValue: ${newValue}`);
                        }

                        if (warRuleCommonData.getFixedTileTheme() !== newValue) {
                            warRuleCommonData.setFixedTileTheme(newValue);
                            instanceWarRule.setTemplateWarRuleId(null);
                            this._updateCommonWarBasicSettingsPage();
                        }
                    },
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.WarEvent,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit,
                    currentValue    : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue !== "string") {
                            throw HelpersMisc.newError(`Invalid newValue: ${newValue}`);
                        }

                        const stringArray = newValue.split(`,`);
                        settingsForCommon.setTurnsLimit(parseInt(stringArray[0]));
                        settingsForCommon.setWarOperationsLimit(parseInt(stringArray[1]));
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.TimerType,
                    currentValue    : timerType,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: async () => {
                        roomCreator.tickBootTimerType();
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            ],
        };
        if (timerType === BootTimersConstants.TimerTypeId.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : GameConfigGcWar.BasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule : instanceWarRule,
                gameConfig      : gcData,
                warEventFullData: warEventFullData,
                callbackOnModify: () => {
                    roomCreator.tickTimerRegularTime();
                    this._updateCommonWarBasicSettingsPage();
                },
            });
        } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.TimerIncrementalParams,
                    currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: number | string | null) => {
                        if (typeof newValue !== "string") {
                            throw HelpersMisc.newError(`Invalid newValue: ${newValue}`);
                        }

                        roomCreator.setBootTimerParams([BootTimersConstants.TimerTypeId.Incremental, ...newValue.split(`,`).map(v => parseInt(v))]);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            );
        } else {
            throw HelpersMisc.newError(`Invalid timerType: ${timerType}`);
        }

        return openData;
    }
    private _createDataForCommonWarAdvancedSettingsPage(): OpenDataForCommonWarAdvancedSettingsPage {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            canModify       : true,
            instanceWarRule : roomCreator.getInstanceWarRule(),
            gameModeId      : GameModesConstants.ModeId.Versus,
            gcData          : roomCreator.getGcData(),
        };
    }
    private _createDataForCommonMapInfoPage(): OpenDataForCommonWarMapInfoPage {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            mapInfo : {
                gameConfig          : roomCreator.getGcData(),
                hasFog              : !!roomCreator.getInstanceWarRule().getWarRuleCommonData()?.getHasFogByDefault(),
                mapRawData          : roomCreator.getMapRawData(),
                overridingPlayers   : null,
            },
        };
    }

    private async _updateImgCo(): Promise<void> {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        const gameConfig    = roomCreator.getGcData();
        const coId          = roomCreator.getSelfCoId();
        this._imgCo.loadSource(((gameConfig == null) || (coId == null))
            ? ``
            : HelpersImageSource.getCoEye(gameConfig, coId, true) ?? ``
        );
    }

    private _updateLabelPlayerIndex(): void {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        const playerIndex       = roomCreator.getSelfPlayerIndex();
        const warRuleCommonData = HelpersMisc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const teamIndex         = WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        this._labelPlayerIndex.setText(`P${playerIndex}${`\n`}${LangUtils.getPlayerTeamName(teamIndex) ?? LangConstants.UndefinedError}`);
    }

    private _updateImgSkinId(): void {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        this._imgSkinId.loadSource(HelpersImageSource.getSkinCircle(roomCreator.getSelfUnitAndTileSkinId(), true));
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
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnConfirm,
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
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnConfirm,
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
