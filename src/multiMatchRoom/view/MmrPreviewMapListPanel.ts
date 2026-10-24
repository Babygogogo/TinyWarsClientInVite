import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
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
import type * as UiInterfacesIUiTabItemRenderer from "../../ui/interfaces/IUiTabItemRenderer.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarOperationsConstants from "../../warOperations/Constants.ts";
import * as WarRulesUtilsInstance from "../../warRules/utils/Instance.ts";

type Undefinable<T>                                 = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export interface OpenData {
    hasFog: boolean;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!          : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPage.OpenData | CommonViewCommonWarBasicSettingsPage.OpenData | CommonViewCommonWarAdvancedSettingsPage.OpenData>;

    private readonly _groupNavigator!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutNavName!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRankMatch!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPreviewMap!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapType!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupBottomButton!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnBanMap!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSwitch!            : UiInterfacesIUiButton.IUiButton;

    private readonly _groupMapList!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listMap!              : UiInterfacesIUiScrollList.IUiScrollList<DataForMapNameRenderer>;
    private readonly _labelNoMap!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoading!         : UiInterfacesIUiLabel.IUiLabel;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBanMap,      callback: this._onTouchedBtnBanMap },
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnSwitch,      callback: this._onTouchedBtnSwitch },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listMap.setItemRendererClass(MapNameRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();
        this._updateAllPagesForTabSettings();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        await this._initGroupMapList();
        this.setAndReviseSelectedNormalMapId(-1, true);
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await Promise.all([
            this._tabSettings.clear(),
            this._listMap.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedNormalMapId(normalMapId: number, needScroll: boolean): Promise<void> {
        const listMap   = this._listMap;
        const index     = HelpersMisc.getExisted(listMap.getRevisedFirstIndex(v => v?.normalMapId === normalMapId), UtilsClientErrorCode.ClientErrorCode.MmrPreviewMapListPanel_SetSelectedNormalMapId_00);
        listMap.setSelectedItemIndex(index);

        if (needScroll) {
            listMap.scrollToItem(index);
        }
        await this._updateComponentsForTargetMapInfo();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnBanMap(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmrBanMapPanel, void 0);
    }
    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmrMainMenuPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBottomPanel, void 0);
    }

    private _onTouchedBtnSwitch(): void {
        const hasFog = this.getOpenData()?.hasFog;
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmrPreviewMapListPanel, { hasFog: !hasFog });
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
            this._updateCommonMapInfoPage(),
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setText(LangUtils.getText(LangConstants.TextType.A0040));
        this._labelRankMatch.setText(LangUtils.getText(LangConstants.TextType.B1012));
        this._labelPreviewMap.setText(LangUtils.getText(LangConstants.TextType.B0594));
        this._labelMapType.setText(LangUtils.getText(this.getOpenData()?.hasFog ? LangConstants.TextType.B0596 : LangConstants.TextType.B0595));
        this._btnBack.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._labelNoMap.setText(LangUtils.getText(LangConstants.TextType.B0582));
        this._btnBanMap.setText(LangUtils.getText(LangConstants.TextType.B0084));
        this._btnSwitch.setText(LangUtils.getText(LangConstants.TextType.B0520));

        this._layoutNavName.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private async _initGroupMapList(): Promise<void> {
        const labelLoading      = this._labelLoading;
        const labelNoMap        = this._labelNoMap;
        const listMap           = this._listMap;
        labelNoMap.setIsVisible(false);

        const dataArray         = await this._createDataForListMap();
        labelLoading.setIsVisible(false);
        labelNoMap.setIsVisible(!dataArray.length);
        await listMap.bindData(dataArray);
    }

    private async _updateComponentsForTargetMapInfo(): Promise<void> {
        const groupTab      = this._groupTab;
        const normalMapId   = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            groupTab.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);

            await this._updateAllPagesForTabSettings();
        }
    }

    private async _updateCommonMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCommonMapInfoPage());
        }
    }

    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarBasicSettingsPage());
        }
    }

    private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }

    private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
        const promiseArray: Promise<Undefinable<ProtoSchemaCommonProtoMapMapRawData.MapRawData>>[] = [];
        for (const normalMapId of await NormalMapModelNormalMapModel.getEnabledNormalMapIdSet()) {
            promiseArray.push((async (): Promise<Undefinable<ProtoSchemaCommonProtoMapMapRawData.MapRawData>> => {
                const mapBriefData = await NormalMapModelNormalMapModel.getBriefData(normalMapId);
                if (mapBriefData == null) {
                    return null;
                }

                if ((mapBriefData.getNormalMapExtraData()?.getIsEnabled())  &&
                    (mapBriefData.getRuleAvailability()?.getCanMrw())
                ) {
                    return await NormalMapModelNormalMapModel.getRawData(normalMapId);
                }

                return null;
            })());
        }

        const hasFog    = this.getOpenData()?.hasFog;
        const dataArray : DataForMapNameRenderer[] = [];
        for (const mapRawData of await Promise.all(promiseArray)) {
            if (mapRawData?.getTemplateWarRuleArray()?.some(v => {
                return (v.getRuleAvailability()?.getCanMrw()) && (hasFog === v.getWarRuleCommonData()?.getHasFogByDefault());
            })) {
                dataArray.push({
                    normalMapId   : HelpersMisc.getExisted(mapRawData.getNormalMapId()),
                    mapName : LangUtils.getLanguageText({ textArray: mapRawData.getMapNameArray() }) || LangConstants.UndefinedError,
                    panel   : this,
                });
            }
        }

        return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
    }

    private async _createDataForCommonMapInfoPage(): Promise<CommonViewCommonWarMapInfoPage.OpenData> {
        const normalMapId = this._getPreviewingNormalMapId();
        return normalMapId == null
            ? null
            : {
                mapInfo : {
                    hasFog              : !!this.getOpenData()?.hasFog,
                    gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                    mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                    overridingPlayers   : null,
                },
            };
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
        const normalMapId = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            return null;
        }

        const mapRawData = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return null;
        }

        const hasFog                = this.getOpenData()?.hasFog;
        const templateWarRuleArray  = mapRawData.getTemplateWarRuleArray().filter(v => {
            return (v.getRuleAvailability()?.getCanMrw()) && (hasFog === v.getWarRuleCommonData()?.getHasFogByDefault());
        });
        if ((templateWarRuleArray == null) || (!templateWarRuleArray.length)) {
            return null;
        }

        const instanceWarRule   = WarRulesUtilsInstance.create({
            templateWarRule             : templateWarRuleArray[0],
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
        });
        const bootTimerParams   = BootTimersConstants.DefaultParams.concat();
        const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
        const gameConfig        = await GameConfigGcModel.getLatestGameConfig();
        const warEventFullData  = mapRawData.getWarEventFullData() ?? null;
        const openData          : CommonViewCommonWarBasicSettingsPage.OpenData = {
            dataArrayForListSettings    : [
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.NormalMapId,
                    currentValue    : normalMapId,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.HasFog,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.Weather,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
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
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit,
                    currentValue    : `${TurnsConstants.TurnIndex.DefaultLimit}, ${WarOperationsConstants.Common.DefaultLimit}`,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.TimerType,
                    currentValue    : timerType,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === BootTimersConstants.TimerTypeId.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : GameConfigGcWar.BasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: null,
            });
        } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : GameConfigGcWar.BasicSettingsType.TimerIncrementalParams,
                    currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            );
        } else {
            throw HelpersMisc.newError(`Invalid timerType: ${timerType}`, UtilsClientErrorCode.ClientErrorCode.MmrPreviewMapListPanel_CreateDataForCommonWarBasicSettingsPage_00);
        }

        return openData;
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
        const normalMapId = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            return null;
        }

        const mapRawData            = HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId));
        const hasFog                = this.getOpenData()?.hasFog;
        const templateWarRuleArray  = mapRawData.getTemplateWarRuleArray().filter(v => {
            return (v.getRuleAvailability()?.getCanMrw()) && (hasFog === v.getWarRuleCommonData()?.getHasFogByDefault());
        });
        if ((templateWarRuleArray == null) || (!templateWarRuleArray.length)) {
            return null;
        }

        return {
            canModify       : false,
            gcData          : await GameConfigGcModel.getLatestGameConfig(),
            instanceWarRule : WarRulesUtilsInstance.create({
                templateWarRule             : templateWarRuleArray[0],
                warEventFullData            : mapRawData.getWarEventFullData(),
                allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
                taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
            }),
            gameModeId      : GameModesConstants.ModeId.UnrankedMatch,
        };
    }

    private _getPreviewingNormalMapId(): number | null {
        return this._listMap.getFirstSelectedData()?.normalMapId ?? null;
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
            obj         : this._groupMapList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupBottomButton,
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
            obj         : this._groupMapList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupBottomButton,
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
class TabItemRenderer
    extends     UiComponentsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer>
    implements  UiInterfacesIUiTabItemRenderer.IUiTabItemRenderer<DataForTabItemRenderer>
{
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? LangConstants.UndefinedError);
    }
}

interface DataForMapNameRenderer extends UiTypesUiListItemData.UiListItemData {
    normalMapId : number;
    mapName     : string;
    panel       : Panel;
}
class MapNameRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForMapNameRenderer>
{
    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelId!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDesigner!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedNormalMapId(openData.normalMapId, false);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapBriefData = await NormalMapModelNormalMapModel.getBriefData(normalMapId);
        if ((mapBriefData == null) || (normalMapId !== this.getOpenData()?.normalMapId)) {
            return;
        }

        this._labelName.setText(LangUtils.getLanguageText({ textArray: mapBriefData.getMapNameArray() }) ?? LangConstants.UndefinedError);
        this._labelId.setText(`#${normalMapId}`);
        this._labelDesigner.setText(mapBriefData.getDesignerName() ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
    }
}
