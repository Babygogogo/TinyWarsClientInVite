import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { DefaultParams, TimerTypeId } from "../../bootTimers/Constants.ts";
import { type OpenData as CommonViewCommonWarAdvancedSettingsPageOpenData, Page } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarBasicSettingsPageOpenData,
    Page as CommonViewCommonWarBasicSettingsPage,
} from "../../common/view/CommonWarBasicSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarMapInfoPageOpenData,
    Page as CommonViewCommonWarMapInfoPage,
} from "../../common/view/CommonWarMapInfoPage.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText } from "../../lang/Utils.ts";
import { getEnabledNormalMapIdSet, getBriefData, getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { TurnIndex } from "../../turns/Constants.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import { UiTabItemRenderer } from "../../ui/components/UiTabItemRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { IUiTab } from "../../ui/interfaces/IUiTab.ts";
import type { IUiTabItemRenderer } from "../../ui/interfaces/IUiTabItemRenderer.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { Common } from "../../warOperations/Constants.ts";
import { create } from "../../warRules/utils/Instance.ts";
import {BasicSettingsTypeId} from "../../wars/Constants.ts";

export interface OpenData {
    hasFog: boolean;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPageOpenData | CommonViewCommonWarBasicSettingsPageOpenData | CommonViewCommonWarAdvancedSettingsPageOpenData>;

    private readonly _groupNavigator!       : IUiLayout;
    private readonly _layoutNavName!        : IUiLayout;
    private readonly _labelRankMatch!       : IUiLabel;
    private readonly _labelPreviewMap!      : IUiLabel;
    private readonly _labelMapType!         : IUiLabel;

    private readonly _btnBack!              : IUiButton;

    private readonly _groupBottomButton!    : IUiContainer;
    private readonly _btnBanMap!            : IUiButton;
    private readonly _btnSwitch!            : IUiButton;

    private readonly _groupMapList!         : IUiContainer;
    private readonly _listMap!              : IUiScrollList<DataForMapNameRenderer>;
    private readonly _labelNoMap!           : IUiLabel;
    private readonly _labelLoading!         : IUiLabel;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBanMap,      callback: this._onTouchedBtnBanMap },
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnSwitch,      callback: this._onTouchedBtnSwitch },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
        const index     = getExisted(listMap.getRevisedFirstIndex(v => v?.normalMapId === normalMapId), ClientErrorCode.MrrPreviewMapListPanel_SetSelectedNormalMapId_00);
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
        openPanel(getDict().MrrBanMapPanel, void 0);
    }
    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().MrrMainMenuPanel, void 0);
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
    }

    private _onTouchedBtnSwitch(): void {
        const hasFog = this.getOpenData()?.hasFog;
        this.closePanel();
        openPanel(getDict().MrrPreviewMapListPanel, { hasFog: !hasFog });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: getText(TextType.B0298) },
                pageClass   : CommonViewCommonWarMapInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0002) },
                pageClass   : CommonViewCommonWarBasicSettingsPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0003) },
                pageClass   : Page,
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
        this._labelLoading.setText(getText(TextType.A0040));
        this._labelRankMatch.setText(getText(TextType.B0404));
        this._labelPreviewMap.setText(getText(TextType.B0594));
        this._labelMapType.setText(getText(this.getOpenData()?.hasFog ? TextType.B0596 : TextType.B0595));
        this._btnBack.setText(getText(TextType.B0146));
        this._labelNoMap.setText(getText(TextType.B0582));
        this._btnBanMap.setText(getText(TextType.B0084));
        this._btnSwitch.setText(getText(TextType.B0520));

        this._layoutNavName.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private async _initGroupMapList(): Promise<void> {
        const labelLoading  = this._labelLoading;
        const labelNoMap    = this._labelNoMap;
        const listMap       = this._listMap;
        labelNoMap.setIsVisible(false);

        const dataArray = await this._createDataForListMap();
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
        const promiseArray: Promise<Undefinable<MapRawData>>[] = [];
        for (const normalMapId of await getEnabledNormalMapIdSet()) {
            promiseArray.push((async (): Promise<Undefinable<MapRawData>> => {
                const mapBriefData = await getBriefData(normalMapId);
                if (mapBriefData == null) {
                    return null;
                }

                if ((mapBriefData.getNormalMapExtraData()?.getIsEnabled())  &&
                    (mapBriefData.getRuleAvailability()?.getCanMrw())
                ) {
                    return await getRawData(normalMapId);
                }

                return null;
            })());
        }

        const hasFog    = this.getOpenData()?.hasFog;
        const dataArray : DataForMapNameRenderer[] = [];
        for (const mapRawData of await Promise.all(promiseArray)) {
            if (mapRawData?.getTemplateWarRuleArray().some(v => {
                return (v.getRuleAvailability()?.getCanMrw()) && (hasFog === v.getWarRuleCommonData()?.getHasFogByDefault());
            })) {
                dataArray.push({
                    normalMapId   : getExisted(mapRawData.getNormalMapId()),
                    mapName : getLanguageText({ textArray: mapRawData.getMapNameArray() }) || UndefinedError,
                    panel   : this,
                });
            }
        }

        return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
    }

    private async _createDataForCommonMapInfoPage(): Promise<CommonViewCommonWarMapInfoPageOpenData> {
        const normalMapId = this._getPreviewingNormalMapId();
        return normalMapId == null
            ? null
            : {
                mapInfo : {
                    hasFog              : !!this.getOpenData()?.hasFog,
                    mapRawData          : getExisted(await getRawData(normalMapId)),
                    gameConfig          : await getLatestGameConfig(),
                    overridingPlayers   : null,
                },
            };
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPageOpenData> {
        const normalMapId = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            return null;
        }

        const mapRawData = await getRawData(normalMapId);
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

        const instanceWarRule   = create({
            templateWarRule             : templateWarRuleArray[0],
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
        });
        const bootTimerParams   = DefaultParams.concat();
        const timerType         = bootTimerParams[0] as TimerTypeId;
        const gameConfig        = await getLatestGameConfig();
        const warEventFullData  = mapRawData.getWarEventFullData() ?? null;
        const openData          : CommonViewCommonWarBasicSettingsPageOpenData = {
            dataArrayForListSettings    : [
                {
                    settingsType    : BasicSettingsTypeId.NormalMapId,
                    currentValue    : normalMapId,
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
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsTypeId.HasFog,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsTypeId.Weather,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
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
                    settingsType    : BasicSettingsTypeId.WarEvent,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                    currentValue    : `${TurnIndex.DefaultLimit}, ${Common.DefaultLimit}`,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsTypeId.TimerType,
                    currentValue    : timerType,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === TimerTypeId.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : BasicSettingsTypeId.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: null,
            });
        } else if (timerType === TimerTypeId.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : BasicSettingsTypeId.TimerIncrementalParams,
                    currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            );
        } else {
            throw newError(`Invalid timerType: ${timerType}`, ClientErrorCode.MrrPreviewMapListPanel_CreateDataForCommonWarBasicSettingsPage_00);
        }

        return openData;
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPageOpenData> {
        const normalMapId = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            return null;
        }

        const mapRawData            = getExisted(await getRawData(normalMapId));
        const hasFog                = this.getOpenData()?.hasFog;
        const templateWarRuleArray  = mapRawData.getTemplateWarRuleArray().filter(v => {
            return (v.getRuleAvailability()?.getCanMrw()) && (hasFog === v.getWarRuleCommonData()?.getHasFogByDefault());
        });
        if ((templateWarRuleArray == null) || (!templateWarRuleArray.length)) {
            return null;
        }

        return {
            canModify       : false,
            gcData          : await getLatestGameConfig(),
            instanceWarRule : create({
                templateWarRule             : templateWarRuleArray[0],
                warEventFullData            : mapRawData.getWarEventFullData(),
                allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
                taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
            }),
            gameModeId      : ModeId.RankedMatch,
        };
    }

    private _getPreviewingNormalMapId(): number | null {
        return this._listMap.getFirstSelectedData()?.normalMapId ?? null;
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._groupMapList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Executor.reset({
            obj         : this._groupBottomButton,
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
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._groupMapList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Executor.reset({
            obj         : this._groupBottomButton,
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
class TabItemRenderer
    extends     UiTabItemRenderer<DataForTabItemRenderer>
    implements  IUiTabItemRenderer<DataForTabItemRenderer>
{
    private readonly _labelName!    : IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? UndefinedError);
    }
}

interface DataForMapNameRenderer extends UiListItemData {
    normalMapId : number;
    mapName     : string;
    panel       : Panel;
}
class MapNameRenderer
    extends     UiListItemRenderer<DataForMapNameRenderer>
    implements  IUiListItemRenderer<DataForMapNameRenderer>
{
    private readonly _layoutName!       : IUiLayout;
    private readonly _labelName!        : IUiLabel;
    private readonly _labelId!          : IUiLabel;
    private readonly _labelDesigner!    : IUiLabel;

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

        const mapBriefData = await getBriefData(normalMapId);
        if ((mapBriefData == null) || (normalMapId !== this.getOpenData()?.normalMapId)) {
            return;
        }

        this._labelName.setText(getLanguageText({ textArray: mapBriefData.getMapNameArray() }) ?? UndefinedError);
        this._labelId.setText(`#${normalMapId}`);
        this._labelDesigner.setText(mapBriefData.getDesignerName() ?? UndefinedError);
        this._layoutName.arrangeItems();
    }
}
