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
import { createRange } from "../../helpers/Collection.ts";
import { gotoLobby } from "../../helpers/GameFlow.ts";
import { getCoEye, getSkinCircle } from "../../helpers/ImageSource.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getPlayerTeamName } from "../../lang/Utils.ts";
import { reqCreateRoom } from "../model/McrProxy.ts";
import type { McrRoomCreator } from "../model/McrRoomCreator.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalMcwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
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
import { getPlayerRule, tickDefaultWeatherType } from "../../warRules/utils/CommonData.ts";
import {BasicSettingsTypeId} from "../../wars/Constants.ts";

type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPageOpenData;
type OpenDataForCommonWarMapInfoPage            = CommonViewCommonWarMapInfoPageOpenData;
type OpenDataForCommonWarAdvancedSettingsPage   = CommonViewCommonWarAdvancedSettingsPageOpenData;

const CONFIRM_INTERVAL_MS = 5000;

export interface OpenData {
    roomCreator : McrRoomCreator;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupNavigator!           : IUiLayout;
    private readonly _labelMultiPlayer!         : IUiLabel;
    private readonly _labelCreateRoom!          : IUiLabel;
    private readonly _labelChooseMap!           : IUiLabel;
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
    private readonly _tabSettings!              : IUiTab<DataForTabItemRenderer, void | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarAdvancedSettingsPage>;

    private readonly _btnBack!                  : IUiButton;
    private readonly _btnConfirm!               : IUiButton;

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
            { type: TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: TypeId.RoomCreator_SelfCoIdChanged,   callback: this._onNotifyMcrCreateSelfCoIdChanged },
            { type: TypeId.MsgMcrCreateRoom,           callback: this._onNotifyMsgMcrCreateRoom },
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
        openPanel(getDict().McrCreateMapListPanel, {
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
            showLang(TextType.A0421);
            return;
        }

        reqCreateRoom(openData.roomCreator.generateData());
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
        const warRuleCommonData = getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        openPanel(getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...getFinalMcwHumanCoIdSet({
                playerRule          : getPlayerRule(warRuleCommonData, roomCreator.getSelfPlayerIndex()),
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

        const warRuleCommonData = getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : roomCreator.getSelfPlayerIndex(),
            availableNumberArray    : createRange(PlayerIndex.First, playersCountUnneutral + 1, 1),
            getTitleText            : () => getText(TextType.B0168),
            getNumberMainText       : playerIndex => `P${playerIndex}, ${getPlayerTeamName(getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) ?? UndefinedError}`,
            callbackOnConfirm       : playerIndex => {
                roomCreator.setSelfPlayerIndex(playerIndex);
                this._updateLabelPlayerIndex();

                const availableCoIdArray = [...getFinalMcwHumanCoIdSet({
                    playerRule          : getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfiguration   : roomCreator.getGcData(),
                    hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                    includeRandom       : true,
                })];
                if (availableCoIdArray.indexOf(roomCreator.getSelfCoId()) < 0) {
                    roomCreator.setSelfCoId(pickRandomCo(availableCoIdArray));
                }
            },
        });
    }
    private _onTouchedBtnChooseSkinId(): void {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId           : roomCreator.getSelfUnitAndTileSkinId(),
            availableSkinIdArray    : getAllSkinIdArray(false),
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
        this._labelCreateRoom.setLangText(TextType.B0000);
        this._labelMultiPlayer.setLangText(TextType.B1011);
        this._labelChooseMap.setLangText(TextType.B0227);
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
        const timerType             = bootTimerParams[0] as TimerTypeId;
        const openData              : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings: [
                {
                    settingsType    : BasicSettingsTypeId.NormalMapId,
                    currentValue    : roomCreator.getSettingsForMcw().getNormalMapId(),
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsTypeId.WarName,
                    currentValue    : roomCreator.getWarName() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue == "number") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarName(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : BasicSettingsTypeId.WarPassword,
                    currentValue    : roomCreator.getWarPassword() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue == "number") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarPassword(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : BasicSettingsTypeId.WarComment,
                    currentValue    : roomCreator.getWarComment() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue == "number") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarComment(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : BasicSettingsTypeId.WarRuleTitle,
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
                    settingsType    : BasicSettingsTypeId.HasFog,
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
                    settingsType    : BasicSettingsTypeId.Weather,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: () => {
                        tickDefaultWeatherType(warRuleCommonData, gcData);
                        instanceWarRule.setTemplateWarRuleId(null);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType        : BasicSettingsTypeId.TileTheme,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gcData,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : newValue => {
                        if (typeof newValue === "string") {
                            throw newError(`Invalid newValue: ${newValue}`);
                        }

                        if (warRuleCommonData.getFixedTileTheme() !== newValue) {
                            warRuleCommonData.setFixedTileTheme(newValue);
                            instanceWarRule.setTemplateWarRuleId(null);
                            this._updateCommonWarBasicSettingsPage();
                        }
                    },
                },
                {
                    settingsType    : BasicSettingsTypeId.WarEvent,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                    currentValue    : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
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
        if (timerType === TimerTypeId.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : BasicSettingsTypeId.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule : instanceWarRule,
                gameConfig      : gcData,
                warEventFullData: warEventFullData,
                callbackOnModify: () => {
                    roomCreator.tickTimerRegularTime();
                    this._updateCommonWarBasicSettingsPage();
                },
            });
        } else if (timerType === TimerTypeId.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : BasicSettingsTypeId.TimerIncrementalParams,
                    currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
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
            throw newError(`Invalid timerType: ${timerType}`);
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
            gameModeId      : ModeId.Versus,
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
            : getCoEye(gameConfig, coId, true) ?? ``
        );
    }

    private _updateLabelPlayerIndex(): void {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        const playerIndex       = roomCreator.getSelfPlayerIndex();
        const warRuleCommonData = getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const teamIndex         = getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        this._labelPlayerIndex.setText(`P${playerIndex}${`\n`}${getPlayerTeamName(teamIndex) ?? UndefinedError}`);
    }

    private _updateImgSkinId(): void {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

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
