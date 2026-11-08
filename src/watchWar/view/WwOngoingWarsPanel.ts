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
    GamePanels_Manager,
    WatchWar_Model_WwModel,
    Tween_Executor,
    GamePanels_Dict,
    NormalMap_Model_NormalMapModel,
    Lang_Utils,
    MultiPlayerWar_Model_MpwModel,
    WarSettings_Utils_MpwWarSettings,
    Helpers_GameFlow,
    Sounds_SoundPlayer,
    WatchWar_Model_WwProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarPlayerInfoPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData>;

    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelWatchWar!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelContinue!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseWar!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupWarList!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listWar!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoading!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _hasReceivedData    = false;
    private _isTabInitialized   = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
            { type : "MsgMpwWatchGetOngoingWarInfos",   callback : this._onNotifyMsgMpwWatchGetOngoingWarInfos },
        ]);
        this._setUiListenerArray([
            { ui : this._btnBack,        callback : this._onTouchedBtnBack },
            { ui : this._btnNextStep,    callback : this._onTouchedBtnNextStep },
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
        this._hasReceivedData = false;
        WatchWar_Model_WwProxy.reqMpwWatchGetOngoingWarIdArray();

        this._updateGroupWarList();
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
        if (needScroll) {
            listMap.scrollToItem(index);
        }

        this._updateBtnNextStep();
        await this._updateGroupTab();
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

    private _onNotifyMsgMpwWatchGetOngoingWarInfos(): void {
        this._hasReceivedData = true;
        this._updateGroupWarList();
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwMainMenuPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const warId = this._listWar.getFirstSelectedData()?.warId;
        if (warId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
            });

            const warData = await WatchWar_Model_WwModel.getWatchWarData(warId);
            if (warData) {
                Helpers_GameFlow.gotoMultiPlayerWar(warData);
            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }

            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _createDataForListWar(): DataForWarRenderer[] {
        const dataArray: DataForWarRenderer[] = [];
        for (const warId of WatchWar_Model_WwModel.getOngoingWarIdArray() || []) {
            dataArray.push({
                warId,
                panel : this,
            });
        }

        return dataArray;
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
        this._labelContinue.setLangText(Lang_Constants.TextType.B0222);
        this._labelChooseWar.setLangText(Lang_Constants.TextType.B0589);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._labelNoWar.setLangText(Lang_Constants.TextType.B0210);
        this._btnNextStep.setLangText(Lang_Constants.TextType.B0566);

        this._groupNavigator.arrangeItems();
    }

    private async _updateGroupWarList(): Promise<void> {
        const labelLoading  = this._labelLoading;
        const labelNoWar    = this._labelNoWar;
        const listWar       = this._listWar;
        if (!this._hasReceivedData) {
            labelLoading.setIsVisible(true);
            labelNoWar.setIsVisible(false);
            await listWar.removeAllItems();
            await this.setAndReviseSelectedWarId(-1, true);

        } else {
            const dataArray = this._createDataForListWar();
            labelLoading.setIsVisible(false);
            labelNoWar.setIsVisible(!dataArray.length);
            await listWar.bindData(dataArray);
            await this.setAndReviseSelectedWarId(dataArray[0]?.warId ?? -1, true);
        }
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

            this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
            this._tabSettings.updatePageData(3, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private _updateBtnNextStep(): void {
        this._btnNextStep.setIsVisible((this._hasReceivedData) && (this._getSelectedWarId() != null));
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
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
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
        this._updateLabelIdAndType();
        this._updateLabelName();
    }

    private async _updateLabelIdAndType(): Promise<void> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }
        this._labelId.setText(`#${warId}`);

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

        const warInfo = await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
        if (warInfo != null) {
            const settingsForAtw = warInfo.getSettingsForAtw();
            const settingsForMfw = warInfo.getSettingsForMfw();
            const settingsForMcw = warInfo.getSettingsForMcw();
            const settingsForCcw = warInfo.getSettingsForCcw();
            const settingsForMrw = warInfo.getSettingsForMrw();
            const settingsForMmw = warInfo.getSettingsForMmw();

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
