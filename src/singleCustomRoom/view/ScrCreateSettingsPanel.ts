import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/S.ts";
import type * as SingleCustomRoomModelScrWarCreator from "../model/ScrWarCreator.ts";
import * as SingleCustomRoomViewScrCreatePlayerInfoPage from "./ScrCreatePlayerInfoPage.ts";
import * as SinglePlayerModeModelSpmModel from "../../singlePlayerMode/model/SpmModel.ts";
import * as SinglePlayerModeModelSpmProxy from "../../singlePlayerMode/model/SpmProxy.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import * as UiComponentsUiTabItemRenderer from "../../ui/components/UiTabItemRenderer.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiTab from "../../ui/interfaces/IUiTab.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPage.OpenData;
type OpenDataForCommonWarMapInfoPage            = CommonViewCommonWarMapInfoPage.OpenData;
type OpenDataForScrCreatePlayerInfoPage         = SingleCustomRoomViewScrCreatePlayerInfoPage.OpenData;
type OpenDataForCommonWarAdvancedSettingsPage   = CommonViewCommonWarAdvancedSettingsPage.OpenData;

const CONFIRM_INTERVAL_MS = 5000;

export interface OpenData {
    warCreator : SingleCustomRoomModelScrWarCreator.ScrWarCreator;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupNavigator!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSinglePlayer!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCustomMode!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseMap!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelGameSettings!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTab!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!          : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, void | OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForScrCreatePlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage>;

    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!           : UiInterfacesIUiButton.IUiButton;

    private _timeoutIdForBtnConfirm : number | null = null;
    private _isTabInitialized       = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgSpmCreateScw,                 callback: this._onNotifyMsgSpmCreateScw },
            { type: NotificationsTypeId.TypeId.WarCreator_SaveSlotIndexChanged,     callback: this._onNotifyScrCreateWarSaveSlotChanged },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ScrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private async _onTouchedBtnConfirm(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (this._timeoutIdForBtnConfirm != null) {
            FloatText2.showLang(LangConstants.TextType.A0421);
            return;
        }

        const warCreator    = openData.warCreator;
        const callback      = () => {
            SinglePlayerModeModelSpmProxy.reqSpmCreateScw(warCreator.generateData());
            this._resetTimeoutForBtnConfirm();
        };

        if (await SinglePlayerModeModelSpmModel.checkIsEmpty(warCreator.getSaveSlotIndex())) {
            callback();
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0070),
                callback,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgSpmCreateScw(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwS.S;
        HelpersGameFlow.gotoSinglePlayerWar({
            warData         : HelpersMisc.getExisted(data.getWarData()),
            slotExtraData   : HelpersMisc.getExisted(data.getExtraData()),
            slotIndex       : HelpersMisc.getExisted(data.getSlotIndex()),
        });
    }
    private _onNotifyScrCreateWarSaveSlotChanged(): void {
        this._updateCommonWarBasicSettingsPage();
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
        this._labelSinglePlayer.setLangText(LangConstants.TextType.B0603);
        this._labelCustomMode.setLangText(LangConstants.TextType.B1372);
        this._labelChooseMap.setLangText(LangConstants.TextType.B0227);
        this._labelGameSettings.setLangText(LangConstants.TextType.B0604);
        this._btnBack.setLangText(LangConstants.TextType.B0146);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);

        this._groupNavigator.arrangeItems();
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
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0224) },
                pageClass   : SingleCustomRoomViewScrCreatePlayerInfoPage.Page,
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
            this._updateScrCreatePlayerInfoPage(),
        ]);
    }
    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCommonWarBasicSettingsPage());
        }
    }
    private _updateCommonWarAdvancedSettingsPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private async _updateCommonWarMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, await this._createDataForCommonMapInfoPage());
        }
    }
    private _updateScrCreatePlayerInfoPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, this._createDataForScrCreatePlayerInfoPage());
        }
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator        = openData.warCreator;
        const instanceWarRule   = warCreator.getInstanceWarRule();
        const gcData        = warCreator.getGcData();
        const mapRawData        = warCreator.getMapRawData();
        const warEventFullData  = mapRawData.getWarEventFullData();
        const warRuleCommonData = HelpersMisc.getExisted(instanceWarRule.getWarRuleCommonData());
        const openDataForPage   : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings: [
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.NormalMapId,
                    currentValue    : mapRawData.getNormalMapId(),
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: async () => {
                        warCreator.tickTemplateWarRuleId();
                        this._updateCommonWarBasicSettingsPage();
                        this._updateCommonWarAdvancedSettingsPage();
                        this._updateScrCreatePlayerInfoPage();
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

                        if (warRuleCommonData.getFixedTileTheme() != newValue) {
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
                    settingsType    : GameConfigGcWar.BasicSettingsType.SpmSaveSlotIndex,
                    currentValue    : warCreator.getSaveSlotIndex(),
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: () => {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
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
                    settingsType    : GameConfigGcWar.BasicSettingsType.SpmSaveSlotComment,
                    currentValue    : warCreator.getSlotComment() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw HelpersMisc.newError(`Invalid newValue: ${newValue}`, UtilsClientErrorCode.ClientErrorCode.ScrCreateSettingsPanel_CreateDataForCommonWarBasicSettingsPage_00);
                        }
                        warCreator.setSlotComment(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            ],
        };

        return openDataForPage;
    }
    private _createDataForCommonWarAdvancedSettingsPage(): OpenDataForCommonWarAdvancedSettingsPage {
        const warCreator = this.getOpenData()?.warCreator;
        if (warCreator == null) {
            return null;
        }

        return {
            canModify       : true,
            instanceWarRule : warCreator.getInstanceWarRule(),
            gameModeId      : GameModesConstants.ModeId.SingleCustom,
            gcData          : warCreator.getGcData(),
        };
    }
    private async _createDataForCommonMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator = openData.warCreator;
        return {
            mapInfo : {
                hasFog              : !!warCreator.getInstanceWarRule().getWarRuleCommonData()?.getHasFogByDefault(),
                gameConfig          : warCreator.getGcData(),
                mapRawData          : warCreator.getMapRawData(),
                overridingPlayers   : null,
            },
        };
    }
    private _createDataForScrCreatePlayerInfoPage(): OpenDataForScrCreatePlayerInfoPage {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        return {
            warCreator    : openData.warCreator,
        };
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
