import {
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiTab,
    SinglePlayerMode_View_SpmRankPage,
    SingleRankRoom_View_SrrCreatePlayerInfoPage,
    type SingleRankRoom_Model_SrrWarCreator,
    type Ui_Types_UiListItemData,
    Wars_Constants,
    SinglePlayerMode_Model_SpmModel,
    Egret_Egret,
    Utils_ClientErrorCode,
    Tween_Executor,
    GamePanels_Dict,
    Helpers_Misc,
    GameConfigs_Provider,
    Lang_Utils,
    Helpers_GameFlow,
    GameModes_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    SinglePlayerMode_Model_SpmProxy,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
} from "../../internal.ts";
import type { S as SpmCreateSrwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/S.ts";

const CONFIRM_INTERVAL_MS = 5000;

export interface OpenData {
    warCreator  : SingleRankRoom_Model_SrrWarCreator.SrrWarCreator;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSinglePlayer!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWarRoomMode!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseMap!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelGameSettings!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, void | Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData | SinglePlayerMode_View_SpmRankPage.OpenData | SingleRankRoom_View_SrrCreatePlayerInfoPage.OpenData>;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnQuickSettings!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;

    private _timeoutIdForBtnConfirm : number | null = null;
    private _isTabInitialized       = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnBack,            callback : this._onTouchedBtnBack },
            { ui : this._btnQuickSettings,   callback : this._onTouchedBtnQuickSettings },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgSpmCreateSrw,                         callback : this._onNotifyMsgSpmCreateSrw },
            { type : Notifications_TypeId.TypeId.WarCreator_TemplateWarRuleIdChanged,  callback : this._onNotifySrrCreateModelTemplateWarRuleIdChanged },
            { type : Notifications_TypeId.TypeId.WarCreator_SaveSlotIndexChanged,             callback : this._onNotifySrrCreateWarSaveSlotChanged },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SrrCreateMapListPanel, {
            mapFilter            : null,
            mapSorter            : null,
            usePreviousFilter    : true,
            usePreviousPageIndex : true,
        });
    }
    private _onTouchedBtnQuickSettings(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SrrCreateQuickSettingsPanel, void 0);
    }
    private async _onTouchedBtnConfirm(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator    = openData.warCreator;
        const callback      = () => {
            SinglePlayerMode_Model_SpmProxy.reqSpmCreateSrw(warCreator.generateData());
            this._resetTimeoutForBtnConfirm();
        };

        if (await SinglePlayerMode_Model_SpmModel.checkIsEmpty(warCreator.getSaveSlotIndex())) {
            callback();
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0070),
                callback,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgSpmCreateSrw(e: Egret_Egret.Event): void {
        const data = e.data as SpmCreateSrwResponse;
        Helpers_GameFlow.gotoSinglePlayerWar({
            warData       : Helpers_Misc.getExisted(data.getWarData()),
            slotExtraData : Helpers_Misc.getExisted(data.getExtraData()),
            slotIndex     : Helpers_Misc.getExisted(data.getSlotIndex()),
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
        this._timeoutIdForBtnConfirm = Egret_Egret.setTimeout(() => {
            this._timeoutIdForBtnConfirm = null;
        }, this, CONFIRM_INTERVAL_MS);
    }

    private _clearTimeoutForBtnConfirm(): void {
        if (this._timeoutIdForBtnConfirm != null) {
            Egret_Egret.clearTimeout(this._timeoutIdForBtnConfirm);
            this._timeoutIdForBtnConfirm = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for the view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelSinglePlayer.setLangText(Lang_Constants.TextType.B0614);
        this._labelWarRoomMode.setLangText(Lang_Constants.TextType.B1372);
        this._labelChooseMap.setLangText(Lang_Constants.TextType.B0227);
        this._labelGameSettings.setLangText(Lang_Constants.TextType.B0604);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnQuickSettings.setLangText(Lang_Constants.TextType.B0908);

        this._groupNavigator.arrangeItems();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
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
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0298) },
                pageClass   : Common_View_CommonWarMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0224) },
                pageClass   : SingleRankRoom_View_SrrCreatePlayerInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0436) },
                pageClass   : SinglePlayerMode_View_SpmRankPage.Page,
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

    private async _createDataForCommonWarBasicSettingsPage(): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator        = openData.warCreator;
        const instanceWarRule   = warCreator.getInstanceWarRule();
        const gameConfig        = warCreator.getGcData();
        const mapRawData        = warCreator.getMapRawData();
        const warEventFullData  = mapRawData.getWarEventFullData();
        const openDataForPage   : Common_View_CommonWarBasicSettingsPage.OpenData = {
            dataArrayForListSettings : [
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                    currentValue     : mapRawData.getNormalMapId(),
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                    currentValue     : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : async () => {
                        await warCreator.tickTemplateWarRuleId();
                        this._updateCommonWarBasicSettingsPage();
                        this._updateCommonWarAdvancedSettingsPage();
                        this._updateSrrCreatePlayerInfoPage();
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gameConfig,
                    warEventFullData : warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gameConfig,
                    warEventFullData : warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.TileTheme,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gameConfig,
                    warEventFullData : warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarEvent,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gameConfig,
                    warEventFullData : warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.SpmSaveSlotIndex,
                    currentValue     : warCreator.getSaveSlotIndex(),
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gameConfig,
                    warEventFullData : warEventFullData,
                    callbackOnModify : () => {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
                            currentSlotIndex     : warCreator.getSaveSlotIndex(),
                            needComment          : false,
                            needConfirmOverwrite : true,
                            callback             : slotIndex => {
                                warCreator.setSaveSlotIndex(slotIndex);
                            },
                        });
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.SpmSaveSlotComment,
                    currentValue     : warCreator.getSlotComment() ?? null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gameConfig,
                    warEventFullData : warEventFullData,
                    callbackOnModify : (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`, Utils_ClientErrorCode.ClientErrorCode.SrrCreateSettingsPanel_CreateDataForCommonWarBasicSettingsPage_00);
                        }
                        warCreator.setSlotComment(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            ],
        };

        return openDataForPage;
    }
    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator        = openData.warCreator;
        const settingsForCommon = warCreator.getSettingsForCommon();
        const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
        return {
            canModify       : false,
            gcData          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())),
            instanceWarRule : instanceWarRule,
            gameModeId      : GameModes_Constants.ModeId.WarRoom,
        };
    }
    private async _createDataForCommonWarMapInfoPage(): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator = openData.warCreator;
        return {
            mapInfo : {
                hasFog            : !!warCreator.getInstanceWarRule().getWarRuleCommonData()?.getHasFogByDefault(),
                mapRawData        : warCreator.getMapRawData(),
                gameConfig        : warCreator.getGcData(),
                overridingPlayers : null,
            },
        };
    }
    private _createDataForSrrCreatePlayerInfoPage(): SingleRankRoom_View_SrrCreatePlayerInfoPage.OpenData {
        const openData = this.getOpenData();
        return openData ? { warCreator : openData.warCreator } : null;
    }
    private _createDataForSpmRankPage(): SinglePlayerMode_View_SpmRankPage.OpenData {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const warCreator = openData.warCreator;
        return {
            normalMapId : warCreator.getMapRawData().getNormalMapId(),
        };
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
            obj        : this._btnQuickSettings,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnConfirm,
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
            obj        : this._btnQuickSettings,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnConfirm,
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
