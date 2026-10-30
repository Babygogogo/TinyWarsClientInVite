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
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiListItemData,
    Players_Constants,
    Wars_Constants,
    Tween_Executor,
    GamePanels_Dict,
    SinglePlayerMode_Model_SpmModel,
    Helpers_Misc,
    GameConfigs_Provider,
    GameModes_Utils,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    WarRules_Utils_CommonData,
    Lang_Utils,
    Helpers_GameFlow,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    SinglePlayerWars_Constants,
    Lang_Constants,
    Notifications_TypeId,
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
    private readonly _labelSinglePlayer!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelContinue!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseWar!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupWarList!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listWar!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoading!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgSpmGetWarSaveSlotIndexArray,      callback : this._onNotifyMsgSpmGetWarSaveSlotIndexArray },
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
        this._updateAllPagesForTabSettings();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupWarList();
        this._updateComponentsForPreviewingWarInfo();
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await Promise.all([
            this._tabSettings.clear(),
            this._listWar.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public setAndReviseSelectedSlotIndex(newSlotIndex: number, needScroll: boolean): void {
        const listWar   = this._listWar;
        const index     = listWar.getRevisedFirstIndex(v => v?.slotIndex === newSlotIndex);
        listWar.setSelectedItemIndex(index);
        this._updateComponentsForPreviewingWarInfo();

        if (needScroll) {
            listWar.scrollToItem(index);
        }
    }
    private _getSelectedSlotIndex(): number | null {
        return this._listWar.getFirstSelectedData()?.slotIndex ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgSpmGetWarSaveSlotIndexArray(): void {
        this._updateGroupWarList();
        this._updateComponentsForPreviewingWarInfo();
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmMainMenuPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex);
        if (slotData != null) {
            Helpers_GameFlow.gotoSinglePlayerWar({
                slotIndex     : slotData.slotIndex,
                warData       : slotData.warData,
                slotExtraData : slotData.extraData,
            });
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
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonWarMapInfoPage(),
            this._updateCommonWarPlayerInfoPage(),
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(Lang_Constants.TextType.A0040);
        this._labelSinglePlayer.setLangText(Lang_Constants.TextType.B0138);
        this._labelContinue.setLangText(Lang_Constants.TextType.B0024);
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
        labelLoading.setIsVisible(true);
        labelNoWar.setIsVisible(false);
        await listWar.removeAllItems();

        const dataArray = await this._createDataForListWar();
        labelLoading.setIsVisible(false);
        labelNoWar.setIsVisible(!dataArray.length);
        await listWar.bindData(dataArray);
        this.setAndReviseSelectedSlotIndex(dataArray[0]?.slotIndex ?? 0, true);
    }

    private async _updateComponentsForPreviewingWarInfo(): Promise<void> {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        const slotIndex     = this._getSelectedSlotIndex();
        if (slotIndex == null) {
            groupTab.setIsVisible(false);
            btnNextStep.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);
            btnNextStep.setIsVisible(true);

            await this._updateAllPagesForTabSettings();
        }
    }

    private async _updateCommonWarMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
        }
    }

    private async _updateCommonWarPlayerInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
        }
    }

    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
        }
    }

    private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }

    private async _createDataForListWar(): Promise<DataForWarRenderer[]> {
        const emptySlotIndexArray   = await SinglePlayerMode_Model_SpmModel.getEmptySlotIndexArray();
        const dataArray             : DataForWarRenderer[] = [];
        for (let slotIndex = 0; slotIndex < SinglePlayerWars_Constants.Common.MaxSaveSlotCount; ++slotIndex) {
            if (emptySlotIndexArray.indexOf(slotIndex) < 0) {
                dataArray.push({
                    slotIndex : slotIndex,
                    panel     : this,
                });
            }
        }

        return dataArray;
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
        const slotIndex = this._getSelectedSlotIndex();
        const warData   = slotIndex == null ? null : (await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex))?.warData;
        return warData == null
            ? null
            : {
                warInfo : {
                    warData            : warData,
                    showInitialWarData : true,
                    overridingPlayers  : warData.getPlayerManager()?.getPlayers(),
                },
            };
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex);
        const warData   = slotData?.warData;
        if (warData == null) {
            return null;
        }

        const settingsForCommon = Helpers_Misc.getExisted(warData.getSettingsForCommon());
        const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
        const warRuleCommonData = Helpers_Misc.getExisted(instanceWarRule.getWarRuleCommonData());
        const playerInfoArray   : AuxiliaryTypes_AuxiliaryTypes.PlayerInfo[] = [];
        for (const playerInfo of Helpers_Misc.getExisted(warData.getPlayerManager()?.getPlayers())) {
            const playerIndex   = playerInfo.getPlayerIndex();
            const userId        = playerInfo.getUserId() ?? null;
            playerInfoArray.push({
                playerIndex       : playerIndex,
                teamIndex         : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
                isAi              : userId == null,
                userId            : userId,
                coId              : playerInfo.getCoId(),
                unitAndTileSkinId : playerInfo.getUnitAndTileSkinId(),
                isReady           : null,
                isInTurn          : null,
                isDefeat          : playerInfo.getAliveState() === Players_Constants.AliveStateId.Dead,
                restTimeToBoot    : playerInfo.getRestTimeToBoot(),
            });
        }

        return {
            gameConfig             : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())),
            playersCountUnneutral  : WarRules_Utils_CommonData.getPlayersCountUnneutral(warRuleCommonData),
            roomOwnerPlayerIndex   : null,
            callbackOnDeletePlayer : null,
            callbackOnExitRoom     : null,
            callbackOnAddDummy     : null,
            callbackOnChangeDummy  : null,
            playerInfoArray        : playerInfoArray,
            enterTurnTime          : null,
            isReplay               : false,
        };
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex);
        const warData   = slotData?.warData;
        if (warData == null) {
            return { dataArrayForListSettings : [] };
        }

        const settingsForCommon = Helpers_Misc.getExisted(warData.getSettingsForCommon());
        const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
        const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
        const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
        const normalMapId       = Helpers_ProtoSchema_WarSerialization_SerialWar.getNormalMapId(warData);
        return {
            dataArrayForListSettings : [
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : normalMapId,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.SpmSaveSlotIndex,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : slotIndex,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.SpmSaveSlotComment,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : slotData?.extraData?.getSlotComment() ?? null,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : null,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : null,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                    currentValue     : null,
                    instanceWarRule,
                    warEventFullData,
                    gameConfig,
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
                    instanceWarRule,
                    warEventFullData,
                    gameConfig,
                    callbackOnModify : null,
                },
            ],
        };
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex);
        const warData   = slotData?.warData;
        if (warData == null) {
            return null;
        }

        const settingsForCommon = Helpers_Misc.getExisted(warData.getSettingsForCommon());
        return {
            canModify       : false,
            gcData          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())),
            instanceWarRule : Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule()),
            gameModeId      : Helpers_Misc.getExisted(GameModes_Utils.getGameModeIdByWarData(warData)),
        };
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
    slotIndex   : number;
    panel       : Panel;
}
class WarRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForWarRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForWarRenderer> {
    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelType!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private async _updateView(): Promise<void> {
        const slotIndex = this.getOpenData()?.slotIndex;
        if (slotIndex == null) {
            return;
        }

        const slotData = await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex);
        if (slotIndex !== this.getOpenData()?.slotIndex) {
            return;
        }

        const labelType         = this._labelType;
        const labelName         = this._labelName;
        const labelTimestamp    = this._labelTimestamp;
        if (!slotData) {
            labelType.setText(`#${slotIndex}`);
            labelTimestamp.setText(``);
            labelName.setText(`----`);

        } else {
            const warData = slotData.warData;
            labelType.setText(`#${slotIndex} ${Lang_Utils.getWarTypeName(Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(warData))}`);

            const slotExtraData = slotData.extraData;
            const timestamp     = slotExtraData.getTimestamp();
            labelTimestamp.setText(timestamp == null ? `` : Lang_Utils.getTimestampShortText(timestamp));

            const slotName = await SinglePlayerMode_Model_SpmModel.getSlotName(slotIndex);
            if (slotIndex === this.getOpenData()?.slotIndex) {
                labelName.setText(slotName);
            }
        }

        this._layoutName.arrangeItems();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedSlotIndex(openData.slotIndex, false);
    }
}
