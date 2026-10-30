import { TimerTypeId } from "../../bootTimers/Constants.ts";
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
import { reqCreateRoom } from "../model/CcrProxy.ts";
import type { CcrRoomCreator } from "../model/CcrRoomCreator.ts";
import {
    type OpenData as CcrCreatePlayerInfoPageOpenData,
    Page as CcrCreatePlayerInfoPage,
} from "./CcrCreatePlayerInfoPage.ts";
import {
    showLang,
    show,
} from "../../FloatText.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { gotoLobby } from "../../helpers/GameFlow.ts";
import { newError } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import { UiTabItemRenderer } from "../../ui/components/UiTabItemRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiTab } from "../../ui/interfaces/IUiTab.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import {
    setTimeout,
    clearTimeout,
} from "../../egret/Egret.ts";
import { tickDefaultWeatherType } from "../../warRules/utils/CommonData.ts";
import { BasicSettingsTypeId } from "../../wars/Constants.ts";

const CONFIRM_INTERVAL_MS = 5000;

export interface OpenData {
    roomCreator : CcrRoomCreator;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupNavigator!       : IUiLayout;
    private readonly _labelMultiPlayer!     : IUiLabel;
    private readonly _labelCreateRoom!      : IUiLabel;
    private readonly _labelChooseMap!       : IUiLabel;
    private readonly _labelRoomSettings!    : IUiLabel;

    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, void | CommonWarMapInfoPageOpenData | CommonWarBasicSettingsPageOpenData | CommonWarAdvancedSettingsPageOpenData | CcrCreatePlayerInfoPageOpenData>;

    private readonly _btnBack!              : IUiButton;
    private readonly _btnConfirm!           : IUiButton;

    private _timeoutIdForBtnConfirm : number | null = null;
    private _isTabInitialized       = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCcrCreateRoom,           callback: this._onNotifyMsgCcrCreateRoom },
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
        openPanel(getDict().CcrCreateMapListPanel, {
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

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgCcrCreateRoom(): void {
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
        this._labelMultiPlayer.setLangText(TextType.B0646);
        this._labelChooseMap.setLangText(TextType.B0227);
        this._labelRoomSettings.setLangText(TextType.B0571);
        this._btnBack.setLangText(TextType.B0146);
        this._btnConfirm.setLangText(TextType.B0026);

        this._groupNavigator.arrangeItems();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: getText(TextType.B0002) },
                pageClass   : CommonWarBasicSettingsPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0003) },
                pageClass   : CommonWarAdvancedSettingsPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0224) },
                pageClass   : CcrCreatePlayerInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0298) },
                pageClass   : CommonWarMapInfoPage,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
            this._updateCcrCreatePlayerInfoPage(),
            this._updateCommonWarMapInfoPage(),
        ]);
    }
    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, this._createDataForCommonWarBasicSettingsPage());
        }
    }
    private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private async _updateCcrCreatePlayerInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, this._createDataForCcrCreatePlayerInfoPage());
        }
    }
    private async _updateCommonWarMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, this._createDataForCommonMapInfoPage());
        }
    }

    private _createDataForCommonWarBasicSettingsPage(): CommonWarBasicSettingsPageOpenData {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        const instanceWarRule   = roomCreator.getInstanceWarRule();
        const warRuleCommonData = instanceWarRule.getWarRuleCommonData();
        if (warRuleCommonData == null) {
            return null;
        }

        const settingsForCommon = roomCreator.getSettingsForCommon();
        const bootTimerParams   = roomCreator.getBootTimerParams();
        const gcData            = roomCreator.getGcData();
        const warEventFullData  = roomCreator.getMapRawData().getWarEventFullData();
        const timerType         = bootTimerParams[0] as TimerTypeId;
        const openData          : CommonWarBasicSettingsPageOpenData = {
            dataArrayForListSettings: [
                {
                    settingsType    : BasicSettingsTypeId.NormalMapId,
                    currentValue    : roomCreator.getSettingsForCcw().getNormalMapId(),
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
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
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
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
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
                    callbackOnModify: () => {
                        roomCreator.tickTemplateWarRuleId();
                        this._updateCommonWarBasicSettingsPage();
                        this._updateCommonWarAdvancedSettingsPage();
                        this._updateCcrCreatePlayerInfoPage();
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
            throw newError(`CcrCreateSettingsPanel._createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openData;
    }
    private _createDataForCommonWarAdvancedSettingsPage(): CommonWarAdvancedSettingsPageOpenData {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            canModify       : true,
            instanceWarRule : roomCreator.getInstanceWarRule(),
            gameModeId      : ModeId.Coop,
            gcData          : roomCreator.getGcData(),
        };
    }
    private _createDataForCcrCreatePlayerInfoPage(): CcrCreatePlayerInfoPageOpenData {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            roomCreator : roomCreator,
        };
    }
    private _createDataForCommonMapInfoPage(): CommonWarMapInfoPageOpenData {
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
