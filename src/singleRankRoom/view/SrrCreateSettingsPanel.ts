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
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { gotoSinglePlayerWar } from "../../helpers/GameFlow.ts";
import {
    getExisted,
    newError,
} from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as SpmCreateSrwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/S.ts";
import { checkIsEmpty } from "../../singlePlayerMode/model/SpmModel.ts";
import { reqSpmCreateSrw } from "../../singlePlayerMode/model/SpmProxy.ts";
import {
    type OpenData as SpmRankPageOpenData,
    Page as SpmRankPage,
} from "../../singlePlayerMode/view/SpmRankPage.ts";
import type { SrrWarCreator } from "../model/SrrWarCreator.ts";
import {
    type OpenData as SrrCreatePlayerInfoPageOpenData,
    Page as SrrCreatePlayerInfoPage,
} from "./SrrCreatePlayerInfoPage.ts";
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
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import {
    Event,
    setTimeout,
    clearTimeout,
} from "../../egret/Egret.ts";
import { BasicSettingsTypeId } from "../../wars/Constants.ts";

const CONFIRM_INTERVAL_MS = 5000;

export interface OpenData {
    warCreator  : SrrWarCreator;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupNavigator!       : IUiLayout;
    private readonly _labelSinglePlayer!    : IUiLabel;
    private readonly _labelWarRoomMode!     : IUiLabel;
    private readonly _labelChooseMap!       : IUiLabel;
    private readonly _labelGameSettings!    : IUiLabel;

    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, void | CommonWarMapInfoPageOpenData | CommonWarBasicSettingsPageOpenData | CommonWarAdvancedSettingsPageOpenData | SpmRankPageOpenData | SrrCreatePlayerInfoPageOpenData>;

    private readonly _btnBack!              : IUiButton;
    private readonly _btnQuickSettings!     : IUiButton;
    private readonly _btnConfirm!           : IUiButton;

    private _timeoutIdForBtnConfirm : number | null = null;
    private _isTabInitialized       = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,            callback: this._onTouchedBtnBack },
            { ui: this._btnQuickSettings,   callback: this._onTouchedBtnQuickSettings },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgSpmCreateSrw,                         callback: this._onNotifyMsgSpmCreateSrw },
            { type: TypeId.WarCreator_TemplateWarRuleIdChanged,  callback: this._onNotifySrrCreateModelTemplateWarRuleIdChanged },
            { type: TypeId.WarCreator_SaveSlotIndexChanged,             callback: this._onNotifySrrCreateWarSaveSlotChanged },
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
        openPanel(getDict().SrrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnQuickSettings(): void {
        openPanel(getDict().SrrCreateQuickSettingsPanel, void 0);
    }
    private async _onTouchedBtnConfirm(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator    = openData.warCreator;
        const callback      = () => {
            reqSpmCreateSrw(warCreator.generateData());
            this._resetTimeoutForBtnConfirm();
        };

        if (await checkIsEmpty(warCreator.getSaveSlotIndex())) {
            callback();
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0070),
                callback,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgSpmCreateSrw(e: Event): void {
        const data = e.data as SpmCreateSrwResponse;
        gotoSinglePlayerWar({
            warData         : getExisted(data.getWarData()),
            slotExtraData   : getExisted(data.getExtraData()),
            slotIndex       : getExisted(data.getSlotIndex()),
        });
    }
    private _onNotifySrrCreateModelTemplateWarRuleIdChanged(): void {
        this._updateCommonWarBasicSettingsPage();
        this._updateCommonWarAdvancedSettingsPage();
    }
    private _onNotifySrrCreateWarSaveSlotChanged(): void {
        this._updateCommonWarBasicSettingsPage();
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
        this._labelSinglePlayer.setLangText(TextType.B0614);
        this._labelWarRoomMode.setLangText(TextType.B1372);
        this._labelChooseMap.setLangText(TextType.B0227);
        this._labelGameSettings.setLangText(TextType.B0604);
        this._btnBack.setLangText(TextType.B0146);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnQuickSettings.setLangText(TextType.B0908);

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
                tabItemData : { name: getText(TextType.B0298) },
                pageClass   : CommonWarMapInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0224) },
                pageClass   : SrrCreatePlayerInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0436) },
                pageClass   : SpmRankPage,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
            this._updateCommonWarMapInfoPage(),
            this._updateSrrCreatePlayerInfoPage(),
            this._updateSpmRankPage(),
        ]);
    }
    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCommonWarBasicSettingsPage());
        }
    }
    private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private async _updateCommonWarMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarMapInfoPage());
        }
    }
    private _updateSrrCreatePlayerInfoPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, this._createDataForSrrCreatePlayerInfoPage());
        }
    }
    private async _updateSpmRankPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(4, this._createDataForSpmRankPage());
        }
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonWarBasicSettingsPageOpenData> {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator        = openData.warCreator;
        const instanceWarRule   = warCreator.getInstanceWarRule();
        const gameConfig        = warCreator.getGcData();
        const mapRawData        = warCreator.getMapRawData();
        const warEventFullData  = mapRawData.getWarEventFullData();
        const openDataForPage   : CommonWarBasicSettingsPageOpenData = {
            dataArrayForListSettings: [
                {
                    settingsType    : BasicSettingsTypeId.NormalMapId,
                    currentValue    : mapRawData.getNormalMapId(),
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsTypeId.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: async () => {
                        await warCreator.tickTemplateWarRuleId();
                        this._updateCommonWarBasicSettingsPage();
                        this._updateCommonWarAdvancedSettingsPage();
                        this._updateSrrCreatePlayerInfoPage();
                    },
                },
                {
                    settingsType        : BasicSettingsTypeId.HasFog,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : null,
                },
                {
                    settingsType        : BasicSettingsTypeId.Weather,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : null,
                },
                {
                    settingsType        : BasicSettingsTypeId.TileTheme,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : null,
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
                    settingsType        : BasicSettingsTypeId.SpmSaveSlotIndex,
                    currentValue        : warCreator.getSaveSlotIndex(),
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : () => {
                        openPanel(getDict().CommonChooseSingleSpmSaveSlotPanel, {
                            currentSlotIndex        : warCreator.getSaveSlotIndex(),
                            needComment             : false,
                            needConfirmOverwrite    : true,
                            callback                : slotIndex => {
                                warCreator.setSaveSlotIndex(slotIndex);
                            },
                        });
                    },
                },
                {
                    settingsType        : BasicSettingsTypeId.SpmSaveSlotComment,
                    currentValue        : warCreator.getSlotComment() ?? null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw newError(`Invalid newValue: ${newValue}`, ClientErrorCode.SrrCreateSettingsPanel_CreateDataForCommonWarBasicSettingsPage_00);
                        }
                        warCreator.setSlotComment(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            ],
        };

        return openDataForPage;
    }
    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonWarAdvancedSettingsPageOpenData> {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator        = openData.warCreator;
        const settingsForCommon = warCreator.getSettingsForCommon();
        const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
        return {
            canModify       : false,
            gcData          : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
            instanceWarRule : instanceWarRule,
            gameModeId      : ModeId.WarRoom,
        };
    }
    private async _createDataForCommonWarMapInfoPage(): Promise<CommonWarMapInfoPageOpenData> {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator = openData.warCreator;
        return {
            mapInfo : {
                hasFog              : !!warCreator.getInstanceWarRule().getWarRuleCommonData()?.getHasFogByDefault(),
                mapRawData          : warCreator.getMapRawData(),
                gameConfig          : warCreator.getGcData(),
                overridingPlayers   : null,
            },
        };
    }
    private _createDataForSrrCreatePlayerInfoPage(): SrrCreatePlayerInfoPageOpenData {
        const openData = this.getOpenData();
        return openData ? { warCreator: openData.warCreator } : null;
    }
    private _createDataForSpmRankPage(): SpmRankPageOpenData {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator = openData.warCreator;
        return {
            normalMapId   : warCreator.getMapRawData().getNormalMapId(),
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
            obj         : this._btnQuickSettings,
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
            obj         : this._btnQuickSettings,
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
