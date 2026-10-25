import { getAtPhaseInfo, getAtFullMapInfo, getAtTourneyInfo } from "../../mains/Provider.ts";
import { DefaultParams, TimerTypeId } from "../../../bootTimers/Constants.ts";
import {
    type OpenData as CommonViewCommonWarAdvancedSettingsPageOpenData,
    Page,
} from "../../../common/view/CommonWarAdvancedSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarBasicSettingsPageOpenData,
    Page as CommonViewCommonWarBasicSettingsPage,
} from "../../../common/view/CommonWarBasicSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarMapInfoPageOpenData,
    Page as CommonViewCommonWarMapInfoPage,
} from "../../../common/view/CommonWarMapInfoPage.ts";
import { showLang } from "../../../FloatText.ts";
import { getLatestGameConfig } from "../../../gameConfig/GcModel.ts";
import { BasicSettingsType } from "../../../gameConfig/GcWar.ts";
import { ModeId } from "../../../gameModes/Constants.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { getExisted, newError } from "../../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getText, getLanguageText } from "../../../lang/Utils.ts";
import { getRawData, getBriefData } from "../../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../../sounds/Constants.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import { wait } from "../../../timer/TimerModel.ts";
import { TurnIndex } from "../../../turns/Constants.ts";
import { Executor } from "../../../tween/Executor.ts";
import { UiListItemRenderer } from "../../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import { UiTabItemRenderer } from "../../../ui/components/UiTabItemRenderer.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../../ui/interfaces/IUiScrollList.ts";
import type { IUiTab } from "../../../ui/interfaces/IUiTab.ts";
import type { UiListItemData } from "../../../ui/types/UiListItemData.ts";
import { Common } from "../../../warOperations/Constants.ts";

type OpenDataForCommonWarAdvancedSettingsPage   = CommonViewCommonWarAdvancedSettingsPageOpenData;
type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPageOpenData;
type OpenDataForCommonWarMapInfoPage            = CommonViewCommonWarMapInfoPageOpenData;

export interface OpenData {
    tourneyId   : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarAdvancedSettingsPage>;

    private readonly _groupNavigator!       : IUiLayout;
    private readonly _layoutNavName!        : IUiLayout;
    private readonly _labelRankMatch!       : IUiLabel;
    private readonly _labelPreviewMap!      : IUiLabel;
    private readonly _labelMapType!         : IUiLabel;

    private readonly _btnBack!              : IUiButton;
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
        const index     = getExisted(listMap.getRevisedFirstIndex(v => v?.normalMapId === normalMapId));
        listMap.setSelectedItemIndex(index);
        if (needScroll) {
            listMap.scrollToItem(index);
        }

        this._updateComponentsForTargetMapInfo();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().AtrMainMenuPanel, void 0);
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnSwitch(): Promise<void> {
        const info          = await getAtPhaseInfo();
        const tourneyIdSet  = new Set(info?.infoArray.map(v => v.getTourneyId() ?? 0));
        if (tourneyIdSet.size <= 1) {
            showLang(TextType.B0278);
            return;
        }

        const currentTourneyId = this.getOpenData()?.tourneyId;
        if (currentTourneyId == null) {
            return;
        }

        const minTourneyId  = Math.min(...tourneyIdSet);
        const maxTourneyId  = Math.max(...tourneyIdSet);
        openPanel(getDict().CommonInputIntegerPanel, {
            minValue        : minTourneyId,
            maxValue        : maxTourneyId,
            currentValue    : currentTourneyId,
            getTitle           : () => getText(TextType.B1026),
            callback        : tourneyId => {
                if (tourneyId != currentTourneyId) {
                    this.closePanel();
                    openPanel(getDict().AtrPreviewMapListPanel, {
                        tourneyId   : tourneyId,
                    });
                }
            },
        });
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
        this._labelRankMatch.setText(getText(TextType.B1022));
        this._labelPreviewMap.setText(getText(TextType.B0594));
        this._labelMapType.setText(`#${this.getOpenData()?.tourneyId}`);
        this._btnBack.setText(getText(TextType.B0146));
        this._labelNoMap.setText(getText(TextType.B0582));
        this._btnSwitch.setText(getText(TextType.B0520));

        this._layoutNavName.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private async _initGroupMapList(): Promise<void> {
        const labelLoading      = this._labelLoading;
        const labelNoMap        = this._labelNoMap;
        const listMap           = this._listMap;
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
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return [];
        }

        const dataArray: DataForMapNameRenderer[] = [];
        for (const mapInfo of (await getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray() ?? []) {
            dataArray.push({
                normalMapId : mapInfo.getNormalMapId() ?? 0,
                hasFog      : !!mapInfo.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                panel       : this,
            });
        }

        return dataArray;
    }

    private async _createDataForCommonMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
        const normalMapId = this._getPreviewingNormalMapId();
        return normalMapId == null
            ? null
            : {
                mapInfo : {
                    gameConfig          : await getLatestGameConfig(),
                    hasFog              : !!this._listMap.getFirstSelectedData()?.hasFog,
                    mapRawData          : getExisted(await getRawData(normalMapId)),
                    overridingPlayers   : null,
                },
            };
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const normalMapId = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            return null;
        }

        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return null;
        }

        const mapInfo = (await getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray().find(v => (v.getNormalMapId() ?? 0) === normalMapId);
        if (mapInfo == null) {
            return null;
        }

        const tourneyInfo = await getAtTourneyInfo(tourneyId);
        if (tourneyInfo == null) {
            return null;
        }

        const instanceWarRule   = getExisted(mapInfo.getInstanceWarRule());
        const bootTimerParams   = tourneyInfo.getBootTimerParams() ?? DefaultParams.concat();
        const timerType         = bootTimerParams[0] as TimerTypeId;
        const gameConfig        = await getLatestGameConfig();
        const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : BasicSettingsType.NormalMapId,
                    currentValue    : normalMapId,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsType.HasFog,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsType.Weather,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType        : BasicSettingsType.TileTheme,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : null,
                },
                {
                    settingsType    : BasicSettingsType.WarEvent,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsType.TurnsAndWarOperationsLimit,
                    currentValue    : `${TurnIndex.DefaultLimit}, ${Common.DefaultLimit}`,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : BasicSettingsType.TimerType,
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
                settingsType    : BasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: null,
            });
        } else if (timerType === TimerTypeId.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : BasicSettingsType.TimerIncrementalParams,
                    currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            );
        } else {
            throw newError(`Invalid timerType: ${timerType}`);
        }

        return openData;
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        const normalMapId = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            return null;
        }

        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return null;
        }

        const mapInfo = (await getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray().find(v => (v.getNormalMapId() ?? 0) === normalMapId);
        if (mapInfo == null) {
            return null;
        }

        return {
            canModify       : false,
            gcData          : await getLatestGameConfig(),
            instanceWarRule : getExisted(mapInfo.getInstanceWarRule()),
            gameModeId      : ModeId.AutoTourney,
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
            obj         : this._btnSwitch,
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
            obj         : this._btnSwitch,
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

interface DataForMapNameRenderer extends UiListItemData {
    normalMapId : number;
    hasFog      : boolean;
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
        this._updateOnOpenDataChanged();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
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
