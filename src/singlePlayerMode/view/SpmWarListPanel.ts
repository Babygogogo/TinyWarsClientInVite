import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameModesUtils from "../../gameModes/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as SinglePlayerModeModelSpmModel from "../model/SpmModel.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import * as UiComponentsUiTabItemRenderer from "../../ui/components/UiTabItemRenderer.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiInterfacesIUiTab from "../../ui/interfaces/IUiTab.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

type OpenDataForCommonWarMapInfoPage            = CommonViewCommonWarMapInfoPage.OpenData;
type OpenDataForCommonWarPlayerInfoPage         = CommonViewCommonWarPlayerInfoPage.OpenData;
type OpenDataForCommonWarAdvancedSettingsPage   = CommonViewCommonWarAdvancedSettingsPage.OpenData;
type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPage.OpenData;

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!          : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

    private readonly _groupNavigator!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSinglePlayer!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelContinue!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseWar!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextStep!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupWarList!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listWar!              : UiInterfacesIUiScrollList.IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoading!         : UiInterfacesIUiLabel.IUiLabel;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgSpmGetWarSaveSlotIndexArray,      callback: this._onNotifyMsgSpmGetWarSaveSlotIndexArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
        const index     = listWar.getRevisedFirstIndex(v => v?.slotIndex === newSlotIndex) ?? -1;
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmMainMenuPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex);
        if (slotData != null) {
            HelpersGameFlow.gotoSinglePlayerWar({
                slotIndex       : slotData.slotIndex,
                warData         : slotData.warData,
                slotExtraData   : slotData.extraData,
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
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0298) },
                pageClass   : CommonViewCommonWarMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0224) },
                pageClass   : CommonViewCommonWarPlayerInfoPage.Page,
                pageData    : null,
            },
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
        this._labelLoading.setText(LangUtils.getText(LangConstants.TextType.A0040));
        this._labelSinglePlayer.setText(LangUtils.getText(LangConstants.TextType.B0138));
        this._labelContinue.setText(LangUtils.getText(LangConstants.TextType.B0024));
        this._labelChooseWar.setText(LangUtils.getText(LangConstants.TextType.B0589));
        this._btnBack.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._labelNoWar.setText(LangUtils.getText(LangConstants.TextType.B0210));
        this._btnNextStep.setText(LangUtils.getText(LangConstants.TextType.B0024));

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
        const emptySlotIndexArray   = await SinglePlayerModeModelSpmModel.getEmptySlotIndexArray();
        const dataArray             : DataForWarRenderer[] = [];
        for (let slotIndex = 0; slotIndex < GameConfigGcWar.SinglePlayerWar.MaxSaveSlotCount; ++slotIndex) {
            if (emptySlotIndexArray.indexOf(slotIndex) < 0) {
                dataArray.push({
                    slotIndex   : slotIndex,
                    panel       : this,
                });
            }
        }

        return dataArray;
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
        const slotIndex = this._getSelectedSlotIndex();
        const warData   = slotIndex == null ? null : (await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex))?.warData;
        return warData == null
            ? null
            : {
                warInfo : {
                    warData             : warData,
                    showInitialWarData  : true,
                    overridingPlayers   : warData.getPlayerManager()?.getPlayers(),
                },
            };
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex);
        const warData   = slotData?.warData;
        if (warData == null) {
            return null;
        }

        const settingsForCommon = HelpersMisc.getExisted(warData.getSettingsForCommon());
        const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
        const warRuleCommonData = HelpersMisc.getExisted(instanceWarRule.getWarRuleCommonData());
        const playerInfoArray   : AuxiliaryTypesAuxiliaryTypes.PlayerInfo[] = [];
        for (const playerInfo of HelpersMisc.getExisted(warData.getPlayerManager()?.getPlayers())) {
            const playerIndex   = playerInfo.getPlayerIndex();
            const userId        = playerInfo.getUserId() ?? null;
            playerInfoArray.push({
                playerIndex         : playerIndex,
                teamIndex           : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
                isAi                : userId == null,
                userId              : userId,
                coId                : playerInfo.getCoId(),
                unitAndTileSkinId   : playerInfo.getUnitAndTileSkinId(),
                isReady             : null,
                isInTurn            : null,
                isDefeat            : playerInfo.getAliveState() === PlayersConstants.AliveStateId.Dead,
                restTimeToBoot      : playerInfo.getRestTimeToBoot(),
            });
        }

        return {
            gameConfig              : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())),
            playersCountUnneutral   : WarRulesUtilsCommonData.getPlayersCountUnneutral(warRuleCommonData),
            roomOwnerPlayerIndex    : null,
            callbackOnDeletePlayer  : null,
            callbackOnExitRoom      : null,
            callbackOnAddDummy      : null,
            callbackOnChangeDummy   : null,
            playerInfoArray         : playerInfoArray,
            enterTurnTime           : null,
            isReplay                : false,
        };
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex);
        const warData   = slotData?.warData;
        if (warData == null) {
            return { dataArrayForListSettings: [] };
        }

        const settingsForCommon = HelpersMisc.getExisted(warData.getSettingsForCommon());
        const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
        const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
        const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
        const normalMapId       = HelpersProtoSchemaWarSerializationSerialWar.getNormalMapId(warData);
        return { dataArrayForListSettings: [
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.NormalMapId,
                instanceWarRule,
                gameConfig,
                warEventFullData,
                currentValue    : normalMapId,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.SpmSaveSlotIndex,
                instanceWarRule,
                gameConfig,
                warEventFullData,
                currentValue    : slotIndex,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.SpmSaveSlotComment,
                instanceWarRule,
                gameConfig,
                warEventFullData,
                currentValue    : slotData?.extraData?.getSlotComment() ?? null,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                instanceWarRule,
                gameConfig,
                warEventFullData,
                currentValue    : null,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.HasFog,
                instanceWarRule,
                gameConfig,
                warEventFullData,
                currentValue    : null,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.Weather,
                currentValue    : null,
                instanceWarRule,
                warEventFullData,
                gameConfig,
                callbackOnModify: null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.WarEvent,
                currentValue    : null,
                instanceWarRule,
                warEventFullData,
                gameConfig,
                callbackOnModify: null,
            },
        ] };
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex);
        const warData   = slotData?.warData;
        if (warData == null) {
            return null;
        }

        const settingsForCommon = HelpersMisc.getExisted(warData.getSettingsForCommon());
        return {
            canModify       : false,
            gcData          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())),
            instanceWarRule : HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule()),
            gameModeId      : HelpersMisc.getExisted(GameModesUtils.getGameModeIdByWarData(warData)),
        };
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupWarList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnNextStep,
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
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupWarList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnNextStep,
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

interface DataForWarRenderer extends UiTypesUiListItemData.UiListItemData {
    slotIndex   : number;
    panel       : Panel;
}
class WarRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForWarRenderer>
{
    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelType!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;

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

        const slotData = await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex);
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
            labelType.setText(`#${slotIndex} ${LangUtils.getWarTypeName(HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(warData))}`);

            const slotExtraData = slotData.extraData;
            const timestamp     = slotExtraData.getTimestamp();
            labelTimestamp.setText(timestamp == null ? `` : LangUtils.getTimestampShortText(timestamp));

            const slotName = await SinglePlayerModeModelSpmModel.getSlotName(slotIndex);
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
