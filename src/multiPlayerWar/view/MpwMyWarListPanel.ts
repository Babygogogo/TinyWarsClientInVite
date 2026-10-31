import {
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    Common_View_CommonWarPlayerInfoPage,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiTab,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
    MultiPlayerWar_Model_MpwModel,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    Helpers_Misc,
    GameConfigs_Provider,
    NormalMap_Model_NormalMapModel,
    WarSettings_Utils_MpwWarSettings,
    Users_Model,
    Timer_TimerModel,
    Lang_Utils,
    Helpers_GameFlow,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
} from "../../internal.ts";

const MAX_COUNTDOWN_FOR_AUTO_UPDATE = 30;

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!      : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Common_View_CommonWarAdvancedSettingsPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData | Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarPlayerInfoPage.OpenData>;

    private readonly _groupNavigator!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMultiPlayer! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyWar!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseWar!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupWarList!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listWar!          : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoading!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isTabInitialized           = false;
    private _countdownForAutoUpdate     = MAX_COUNTDOWN_FOR_AUTO_UPDATE;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
            { type : "TimeTick",            callback : this._onNotifyTimeTick },
        ]);
        this._setUiListenerArray([
            { ui : this._btnBack,                    callback : this._onTouchedBtnBack },
            { ui : this._btnNextStep,                callback : this._onTouchedBtnNextStep },
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
        this._countdownForAutoUpdate = MAX_COUNTDOWN_FOR_AUTO_UPDATE;

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

    public async setAndReviseSelectedWarId(newWarId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>, needScroll: boolean): Promise<void> {
        const listWar   = this._listWar;
        const index     = listWar.getRevisedFirstIndex(v => v?.warId == newWarId);
        listWar.setSelectedItemIndex(index);
        if (needScroll) {
            listWar.scrollToItem(index);
        }

        await Promise.all([
            this._updateBtnNextStep(),
            this._updateGroupTab(),
        ]);
    }
    private _getSelectedWarId(): number | undefined {
        return this._listWar.getFirstSelectedData()?.warId;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private async _onNotifyTimeTick(): Promise<void> {
        if ((--this._countdownForAutoUpdate) <= 0) {
            this._countdownForAutoUpdate = MAX_COUNTDOWN_FOR_AUTO_UPDATE;

            const warId = this._getSelectedWarId();
            await this._updateGroupWarList();
            this.setAndReviseSelectedWarId(warId, false);
        }
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrMainMenuPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const warId = this._listWar.getFirstSelectedData()?.warId;
        if (warId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
            });

            const warData = await MultiPlayerWar_Model_MpwModel.getOngoingWarData(warId);
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
        this._labelMultiPlayer.setLangText(Lang_Constants.TextType.B0137);
        this._labelMyWar.setLangText(Lang_Constants.TextType.B0024);
        this._labelChooseWar.setLangText(Lang_Constants.TextType.B0589);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._labelNoWar.setLangText(Lang_Constants.TextType.B0210);
        this._btnNextStep.setLangText(Lang_Constants.TextType.B0024);

        this._groupNavigator.arrangeItems();
    }

    private async _updateGroupWarList(): Promise<void> {
        const labelLoading  = this._labelLoading;
        const labelNoWar    = this._labelNoWar;
        const listWar       = this._listWar;
        if (!listWar.getBoundDataArray()?.length) {
            labelLoading.setIsVisible(true);
            labelNoWar.setIsVisible(false);
        }

        const dataArray     = await this._createDataForListWar();
        const selectedWarId = this._getSelectedWarId();
        labelLoading.setIsVisible(false);
        labelNoWar.setIsVisible(!dataArray.length);
        await listWar.bindData(dataArray);
        await this.setAndReviseSelectedWarId(selectedWarId ?? dataArray[0]?.warId ?? -1, true);
    }

    private async _updateGroupTab(): Promise<void> {
        const groupTab = this._groupTab;
        if ((!this._isTabInitialized) || (this._getSelectedWarId() == null)) {
            groupTab.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);

            this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
            this._tabSettings.updatePageData(3, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private async _updateBtnNextStep(): Promise<void> {
        const btn   = this._btnNextStep;
        const warId = this._getSelectedWarId();
        btn.setIsVisible(warId != null);
        btn.setRedVisible((warId != null) && (await MultiPlayerWar_Model_MpwModel.checkIsRedForMyWar(await MultiPlayerWar_Model_MpwModel.getWarProgressInfo(warId))));
    }

    private async _createDataForListWar(): Promise<DataForWarRenderer[]> {
        const dataArray: DataForWarRenderer[] = (await MultiPlayerWar_Model_MpwModel.getJoinedMpwIdArray(true) ?? [])
            .map(v => ({
                warId : v,
                panel : this,
            }));

        return dataArray.sort((v1, v2) => v1.warId - v2.warId);
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
        const warId         = this._listWar.getFirstSelectedData()?.warId;
        const warSettings   = warId == null ? null : await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
        if (warSettings == null) {
            return null;
        }

        const normalMapId = WarSettings_Utils_MpwWarSettings.getNormalMapIdForMpwWarSettings(warSettings);
        if (normalMapId != null) {
            const settingsForCommon = warSettings.getSettingsForCommon();
            return {
                mapInfo : {
                    hasFog            : !!settingsForCommon?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                    gameConfig        : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon?.getConfigVersion())),
                    mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                    overridingPlayers : null,
                },
            };
        } else {
            const warData = warSettings.getSettingsForMfw()?.getInitialWarData();
            return warData == null
                ? null
                : {
                    warInfo : {
                        warData            : warData,
                        showInitialWarData : false,
                        overridingPlayers  : null,
                    },
                };
        }
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
        return await MultiPlayerWar_Model_MpwModel.createDataForCommonWarPlayerInfoPage(this._listWar.getFirstSelectedData()?.warId ?? null);
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
        return await MultiPlayerWar_Model_MpwModel.createDataForCommonWarBasicSettingsPage(this._listWar.getFirstSelectedData()?.warId ?? null);
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
        return await MultiPlayerWar_Model_MpwModel.createDataForCommonWarAdvancedSettingsPage(this._listWar.getFirstSelectedData()?.warId ?? null);
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
class WarRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
    private readonly _imgRed!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutName!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelWarId!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRestTimeToBoot!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWarType!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!            : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "TimeTick",                    callback : this._onNotifyTimeTick },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private _onNotifyTimeTick(): void {
        this._updateLabelRestTimeToBoot();
        this._updateImgRed();
    }
    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedWarId(openData.warId, false);
    }

    private async _updateView(): Promise<void> {
        this._updateImgRed();
        this._updateLabelRestTimeToBoot();

        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }

        const layout = this._layoutName;
        this._labelWarId.setText(`#${warId}`);
        layout.arrangeItems();

        const warSettings   = await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
        const labelName     = this._labelName;
        const labelWarType  = this._labelWarType;
        labelName.setText(``);
        labelWarType.setText(``);
        if (warSettings != null) {
            labelWarType.setText(Lang_Utils.getWarTypeName(WarSettings_Utils_MpwWarSettings.getWarTypeByMpwWarSettings(warSettings)) ?? Lang_Constants.UndefinedError);

            const warName = (warSettings.getSettingsForCcw()?.getWarName() ?? warSettings.getSettingsForMcw()?.getWarName() ?? warSettings.getSettingsForMfw()?.getWarName())?.trim();
            if (warName) {
                labelName.setText(warName);
            } else {
                const normalMapId = WarSettings_Utils_MpwWarSettings.getNormalMapIdForMpwWarSettings(warSettings);
                if (normalMapId != null) {
                    labelName.setText(await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId) || Lang_Constants.UndefinedError);
                } else {
                    labelName.setText(`(${Lang_Utils.getText(Lang_Constants.TextType.B0557)})`);
                }
            }
        }
        layout.arrangeItems();
    }

    private async _updateImgRed(): Promise<void> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }

        this._imgRed.setIsVisible(await MultiPlayerWar_Model_MpwModel.checkIsRedForMyWar(await MultiPlayerWar_Model_MpwModel.getWarProgressInfo(warId)));
    }

    private async _updateLabelRestTimeToBoot(): Promise<void> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }

        const warSettings       = await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
        const warProgressInfo   = await MultiPlayerWar_Model_MpwModel.getWarProgressInfo(warId);
        const userId            = Users_Model.getSelfUserId();
        const label             = this._labelRestTimeToBoot;
        const layout            = this._layoutName;
        if ((warSettings == null)       ||
            (warProgressInfo == null)   ||
            (userId == null)            ||
            (warProgressInfo.getIsEnded())
        ) {
            label.setText(`----------`);
            layout.arrangeItems();
            return;
        }

        const playerIndexInTurn = Helpers_Misc.getExisted(warProgressInfo.getPlayerIndexInTurn());
        if (warSettings.getPlayerInfoArray()?.find(v => v.getPlayerIndex() === playerIndexInTurn)?.getUserId() !== userId) {
            label.setText(`----------`);
            layout.arrangeItems();
            return;
        }

        const enterTurnTime     = warProgressInfo.getEnterTurnTime();
        const restTimeToBoot    = warProgressInfo.getPlayerInfoList().find(v => v.getPlayerIndex() === playerIndexInTurn)?.getRestTimeToBoot();
        const restTime          = (restTimeToBoot == null) || (enterTurnTime == null)
            ? null
            : Math.max(0, restTimeToBoot + enterTurnTime - Timer_TimerModel.getServerTimestamp());
        if (restTime == null) {
            label.setText(`----------`);
        } else {
            label.setText(Lang_Utils.getTimeDurationText2(restTime));
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400),
            );
        }
        layout.arrangeItems();
    }
}
