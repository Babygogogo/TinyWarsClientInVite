import {
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    Common_View_CommonWarPlayerInfoPage,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiTab,
    type Ui_Types_UiListItemData,
    WatchWar_Model_WwModel,
    Tween_Executor,
    GamePanels_Dict,
    NormalMap_Model_NormalMapModel,
    Lang_Utils,
    Numbers_Utils,
    MultiPlayerWar_Model_MpwModel,
    WarSettings_Utils_MpwWarSettings,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    WatchWar_Model_WwProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
    AuxiliaryTypes_WarFilter,
} from "../../internal.ts";

const MapsPerPage   = 50;
let _pageIndex      = 0;

export interface OpenData {
    filter  : AuxiliaryTypes_WarFilter.WarFilter | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarPlayerInfoPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData>;

    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelWatchWar!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMakeRequest!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseWar!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTopRightButtons! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSearch!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupSearch!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnPrevPage!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextPage!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutPage!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPageTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPage!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupWarList!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listWar!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoading!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _warFilter                      = new AuxiliaryTypes_WarFilter.WarFilter();
    private _hasReceivedData                = false;
    private _isTabInitialized               = false;
    private _cachedListDataArray            : DataForWarRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgMpwWatchGetRequestableWarIdArray, callback : this._onNotifyMsgMpwWatchGetRequestableWarIdArray },
            { type : Notifications_TypeId.TypeId.MsgMpwWatchMakeRequest,              callback : this._onNotifyMsgMpwWatchMakeRequest },
        ]);
        this._setUiListenerArray([
            { ui : this._btnBack,        callback : this._onTouchedBtnBack },
            { ui : this._btnSearch,      callback : this._onTouchTapBtnSearch },
            { ui : this._btnNextStep,    callback : this._onTouchedBtnNextStep },
            { ui : this._btnPrevPage,    callback : this._onTouchedBtnPrevPage },
            { ui : this._btnNextPage,    callback : this._onTouchedBtnNextPage },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listWar.setItemRendererClass(WarRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();
        this._updateGroupTab();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const warFilter = this.getOpenData()?.filter;
        if (warFilter != null) {
            this._warFilter = warFilter;
        }

        this._hasReceivedData       = false;
        this._cachedListDataArray   = [];
        _pageIndex                  = 0;
        reqDataArray(this._warFilter);

        this._updateLabelPageTitle();
        this._updateComponentsForPage();
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await Promise.all([
            this._tabSettings.clear(),
            this._listWar.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedWarId(warId: number, needScroll: boolean): Promise<void> {
        const listMap   = this._listWar;
        const index     = listMap.getRevisedFirstIndex(v => v?.warId === warId);
        listMap.setSelectedItemIndex(index);
        this._updateBtnNextStep();
        this._updateGroupTab();

        if (needScroll) {
            listMap.scrollToItem(index);
        }
    }
    private _getSelectedWarId(): number | null {
        return this._listWar.getFirstSelectedData()?.warId ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onNotifyMsgMpwWatchGetRequestableWarIdArray(): Promise<void> {
        this._hasReceivedData   = true;
        _pageIndex              = 0;
        this._refreshCachedListDataArray();
        await this._updateComponentsForPage();
    }

    private _onNotifyMsgMpwWatchMakeRequest(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0060));
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwMainMenuPanel, void 0);
    }

    private _onTouchTapBtnSearch(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwSearchWarPanel, {
            filter : this.getOpenData()?.filter,
        });
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const data = this._listWar.getFirstSelectedData();
        if (data == null) {
            return;
        }

        const warId = data.warId;
        if (await WatchWar_Model_WwModel.getWatchOutgoingInfo(warId) == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0297));
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwMakeRequestDetailPanel, {
                warId,
            });
        }
    }

    private async _onTouchedBtnPrevPage(): Promise<void> {
        const newPageIndex = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue : _pageIndex - 1,
        });
        if (newPageIndex !== _pageIndex) {
            _pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }
    private async _onTouchedBtnNextPage(): Promise<void> {
        const newPageIndex = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue : _pageIndex + 1,
        });
        if (newPageIndex !== _pageIndex) {
            _pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
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

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(Lang_Constants.TextType.A0040);
        this._labelWatchWar.setLangText(Lang_Constants.TextType.B0206);
        this._labelMakeRequest.setLangText(Lang_Constants.TextType.B0207);
        this._labelChooseWar.setLangText(Lang_Constants.TextType.B0589);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._labelNoWar.setLangText(Lang_Constants.TextType.B0210);
        this._btnNextStep.setLangText(Lang_Constants.TextType.B0566);
        this._btnPrevPage.setLangText(Lang_Constants.TextType.B1384);
        this._btnNextPage.setLangText(Lang_Constants.TextType.B1385);
        this._updateLabelPageTitle();

        this._layoutPage.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private _updateLabelPageTitle(): void {
        const label = this._labelPageTitle;
        if (checkIsFilterEmpty(this._warFilter)) {
            label.setTextColor(0xCCCCCC);
            label.setLangText(Lang_Constants.TextType.B1386);
        } else {
            label.setTextColor(0xFFFF00);
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1386)}(${Lang_Utils.getText(Lang_Constants.TextType.B1387)})`);
        }
        this._layoutPage.arrangeItems();
    }

    private async _updateComponentsForPage(): Promise<void> {
        this._labelPage.setText(`${_pageIndex + 1} / ${Math.max(1, Math.ceil(this._cachedListDataArray.length / MapsPerPage))}`);
        this._layoutPage.arrangeItems();

        const labelLoading  = this._labelLoading;
        const labelNoWar    = this._labelNoWar;
        labelLoading.setIsVisible(true);
        labelNoWar.setIsVisible(false);

        const dataArray = this.getListDataArray();
        const oldWarId  = this._getSelectedWarId();
        labelLoading.setIsVisible(false);
        labelNoWar.setIsVisible(dataArray.length <= 0);
        await this._listWar.bindData(dataArray);

        await this.setAndReviseSelectedWarId(oldWarId ?? -1, true);
    }

    private async _updateGroupTab(): Promise<void> {
        const groupTab = this._groupTab;
        if ((!this._hasReceivedData)            ||
            (this._getSelectedWarId() == null)  ||
            (!this._isTabInitialized)
        ) {
            groupTab.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);

            const tab = this._tabSettings;
            tab.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
            tab.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
            tab.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
            tab.updatePageData(3, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private _updateBtnNextStep(): void {
        this._btnNextStep.setIsVisible((this._hasReceivedData) && (this._getSelectedWarId() != null));
    }

    private _refreshCachedListDataArray(): void {
        const dataArray: DataForWarRenderer[] = [];
        for (const warId of WatchWar_Model_WwModel.getRequestableWarIdArray() ?? []) {
            dataArray.push({
                warId : warId,
                panel : this,
            });
        }

        this._cachedListDataArray = dataArray.sort((v1, v2) => v2.warId - v1.warId);
    }
    private getListDataArray(): DataForWarRenderer[] {
        return this._cachedListDataArray.slice(_pageIndex * MapsPerPage, (_pageIndex + 1) * MapsPerPage);
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
        return await WatchWar_Model_WwModel.createDataForCommonWarMapInfoPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
        return await WatchWar_Model_WwModel.createDataForCommonWarPlayerInfoPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
        return await WatchWar_Model_WwModel.createDataForCommonWarBasicSettingsPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
        return await WatchWar_Model_WwModel.createDataForCommonWarAdvancedSettingsPage(this._getSelectedWarId());
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 0, customY : 16 - 40 },
            endProps   : { customAlpha : 1, customY : 16 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSearch,
            beginProps : { customAlpha : 0, customY : 30 },
            endProps   : { customAlpha : 1, customY : 70 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupWarList,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnNextStep,
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
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 1, customY : 16 },
            endProps   : { customAlpha : 0, customY : 16 - 40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSearch,
            beginProps : { customAlpha : 1, customY : 70 },
            endProps   : { customAlpha : 0, customY : 30 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupWarList,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnNextStep,
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

interface DataForWarRenderer extends Ui_Types_UiListItemData.UiListItemData {
    warId   : number;
    panel   : Panel;
}
class WarRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForWarRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForWarRenderer> {
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedWarId(openData.warId, false);
    }

    private _updateView(): void {
        this._updateLabelId();
        this._updateLabelType();
        this._updateLabelName();
    }

    private _updateLabelId(): void {
        this._labelId.setText(`#${this.getOpenData()?.warId}`);
    }

    private async _updateLabelType(): Promise<void> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }

        const warSettings   = await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
        const label         = this._labelType;
        if (warSettings == null) {
            label.setText(Lang_Constants.UndefinedError);
        } else {
            label.setText(Lang_Utils.getWarTypeName(WarSettings_Utils_MpwWarSettings.getWarTypeByMpwWarSettings(warSettings)) ?? Lang_Constants.UndefinedError);
        }
        this._layoutName.arrangeItems();
    }

    private async _updateLabelName(): Promise<void> {
        const labelName     = this._labelName;
        const layoutName    = this._layoutName;
        labelName.setText(``);
        layoutName.arrangeItems();

        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }

        const warSettings = await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
        if (warSettings != null) {
            const settingsForAtw = warSettings.getSettingsForAtw();
            const settingsForMfw = warSettings.getSettingsForMfw();
            const settingsForMcw = warSettings.getSettingsForMcw();
            const settingsForCcw = warSettings.getSettingsForCcw();
            const settingsForMrw = warSettings.getSettingsForMrw();
            const settingsForMmw = warSettings.getSettingsForMmw();

            if (settingsForMfw) {
                labelName.setText(settingsForMfw.getWarName() || `----`);

            } else if (settingsForMcw) {
                const warName = settingsForMcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const normalMapId   = settingsForMcw.getNormalMapId();
                    labelName.setText((normalMapId == null ? null : await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || Lang_Constants.UndefinedError);
                }

            } else if (settingsForCcw) {
                const warName = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const normalMapId   = settingsForCcw.getNormalMapId();
                    labelName.setText((normalMapId == null ? null : await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || Lang_Constants.UndefinedError);
                }

            } else if (settingsForMrw) {
                const normalMapId   = settingsForMrw.getNormalMapId();
                labelName.setText((normalMapId == null ? null : await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || Lang_Constants.UndefinedError);

            } else if (settingsForMmw) {
                const normalMapId   = settingsForMmw.getNormalMapId();
                labelName.setText((normalMapId == null ? null : await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || Lang_Constants.UndefinedError);

            } else if (settingsForAtw) {
                const normalMapId   = settingsForAtw.getNormalMapId();
                labelName.setText((normalMapId == null ? null : await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || Lang_Constants.UndefinedError);
            }
        }

        layoutName.arrangeItems();
    }
}

function reqDataArray(filter: AuxiliaryTypes_WarFilter.WarFilter): void {
    WatchWar_Model_WwProxy.reqMpwWatchGetRequestableWarIdArray({
        warId                 : filter.warId,
        coCategoryId          : filter.coCategoryId,
        normalMapId           : filter.normalMapId,
        userId                : filter.userId,
        playersCountUnneutral : filter.playersCountUnneutral,
        warName               : filter.warName,
    });
}
function checkIsFilterEmpty(filter: AuxiliaryTypes_WarFilter.WarFilter): boolean {
    return (filter.coCategoryId             == null)
        && (filter.normalMapId              == null)
        && (filter.playersCountUnneutral    == null)
        && (filter.userId                   == null)
        && (filter.warId                    == null)
        && (filter.warName                  == null);
}
