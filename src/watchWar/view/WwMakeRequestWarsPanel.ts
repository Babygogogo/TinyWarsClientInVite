import { WarFilter } from "../../auxiliaryTypes/WarFilter.ts";
import {
    type OpenData as CommonWarAdvancedSettingsPageOpenData,
    Page as CommonWarAdvancedSettingsPage,
} from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import {
    type OpenData as CommonWarBasicSettingsPageOpenData,
    Page as CommonWarBasicSettingsPage,
} from "../../common/view/CommonWarBasicSettingsPage.ts";
import {
    type OpenData as CommonWarMapInfoPageOpenData,
    Page as CommonWarMapInfoPage,
} from "../../common/view/CommonWarMapInfoPage.ts";
import {
    type OpenData as CommonWarPlayerInfoPageOpenData,
    Page as CommonWarPlayerInfoPage,
} from "../../common/view/CommonWarPlayerInfoPage.ts";
import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getWarTypeName,
} from "../../lang/Utils.ts";
import { getWarSettings } from "../../multiPlayerWar/model/MpwModel.ts";
import { getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
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
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getWarTypeByMpwWarSettings } from "../../warSettings/utils/MpwWarSettings.ts";
import {
    getWatchOutgoingInfo,
    getRequestableWarIdArray,
    createDataForCommonWarMapInfoPage,
    createDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage,
} from "../model/WwModel.ts";
import { reqMpwWatchGetRequestableWarIdArray } from "../model/WwProxy.ts";

const MapsPerPage   = 50;
let _pageIndex      = 0;

export interface OpenData {
    filter  : WarFilter | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, CommonWarMapInfoPageOpenData | CommonWarPlayerInfoPageOpenData | CommonWarAdvancedSettingsPageOpenData | CommonWarBasicSettingsPageOpenData>;

    private readonly _groupNavigator!       : IUiLayout;
    private readonly _labelWatchWar!        : IUiLabel;
    private readonly _labelMakeRequest!     : IUiLabel;
    private readonly _labelChooseWar!       : IUiLabel;

    private readonly _groupTopRightButtons! : IUiContainer;
    private readonly _btnSearch!            : IUiButton;

    private readonly _groupSearch!          : IUiContainer;
    private readonly _btnPrevPage!          : IUiButton;
    private readonly _btnNextPage!          : IUiButton;
    private readonly _layoutPage!           : IUiLayout;
    private readonly _labelPageTitle!       : IUiLabel;
    private readonly _labelPage!            : IUiLabel;

    private readonly _btnBack!              : IUiButton;
    private readonly _btnNextStep!          : IUiButton;

    private readonly _groupWarList!         : IUiContainer;
    private readonly _listWar!              : IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!           : IUiLabel;
    private readonly _labelLoading!         : IUiLabel;

    private _warFilter                      = new WarFilter();
    private _hasReceivedData                = false;
    private _isTabInitialized               = false;
    private _cachedListDataArray            : DataForWarRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMpwWatchGetRequestableWarIdArray, callback: this._onNotifyMsgMpwWatchGetRequestableWarIdArray },
            { type: TypeId.MsgMpwWatchMakeRequest,              callback: this._onNotifyMsgMpwWatchMakeRequest },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            { ui: this._btnPrevPage,    callback: this._onTouchedBtnPrevPage },
            { ui: this._btnNextPage,    callback: this._onTouchedBtnNextPage },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
        show(getText(TextType.A0060));
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
        openPanel(getDict().WwMainMenuPanel, void 0);
    }

    private _onTouchTapBtnSearch(): void {
        openPanel(getDict().WwSearchWarPanel, {
            filter  : this.getOpenData()?.filter,
        });
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const data = this._listWar.getFirstSelectedData();
        if (data == null) {
            return;
        }

        const warId = data.warId;
        if (await getWatchOutgoingInfo(warId) == null) {
            show(getText(TextType.A0297));
        } else {
            openPanel(getDict().WwMakeRequestDetailPanel, {
                warId,
            });
        }
    }

    private async _onTouchedBtnPrevPage(): Promise<void> {
        const newPageIndex = getValueInRange({
            minValue    : 0,
            maxValue    : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue    : _pageIndex - 1,
        });
        if (newPageIndex !== _pageIndex) {
            _pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }
    private async _onTouchedBtnNextPage(): Promise<void> {
        const newPageIndex = getValueInRange({
            minValue    : 0,
            maxValue    : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue    : _pageIndex + 1,
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
                tabItemData : { name: getText(TextType.B0298) },
                pageClass   : CommonWarMapInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0224) },
                pageClass   : CommonWarPlayerInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0002) },
                pageClass   : CommonWarBasicSettingsPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0003) },
                pageClass   : CommonWarAdvancedSettingsPage,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(TextType.A0040);
        this._labelWatchWar.setLangText(TextType.B0206);
        this._labelMakeRequest.setLangText(TextType.B0207);
        this._labelChooseWar.setLangText(TextType.B0589);
        this._btnBack.setLangText(TextType.B0146);
        this._labelNoWar.setLangText(TextType.B0210);
        this._btnNextStep.setLangText(TextType.B0566);
        this._btnPrevPage.setLangText(TextType.B1384);
        this._btnNextPage.setLangText(TextType.B1385);
        this._updateLabelPageTitle();

        this._layoutPage.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private _updateLabelPageTitle(): void {
        const label = this._labelPageTitle;
        if (checkIsFilterEmpty(this._warFilter)) {
            label.setTextColor(0xCCCCCC);
            label.setLangText(TextType.B1386);
        } else {
            label.setTextColor(0xFFFF00);
            label.setText(`${getText(TextType.B1386)}(${getText(TextType.B1387)})`);
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
        for (const warId of getRequestableWarIdArray() ?? []) {
            dataArray.push({
                warId   : warId,
                panel   : this,
            });
        }

        this._cachedListDataArray = dataArray.sort((v1, v2) => v2.warId - v1.warId);
    }
    private getListDataArray(): DataForWarRenderer[] {
        return this._cachedListDataArray.slice(_pageIndex * MapsPerPage, (_pageIndex + 1) * MapsPerPage);
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonWarMapInfoPageOpenData> {
        return await createDataForCommonWarMapInfoPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonWarPlayerInfoPageOpenData> {
        return await createDataForCommonWarPlayerInfoPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonWarBasicSettingsPageOpenData> {
        return await createDataForCommonWarBasicSettingsPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonWarAdvancedSettingsPageOpenData> {
        return await createDataForCommonWarAdvancedSettingsPage(this._getSelectedWarId());
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
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 0, customY: 16 - 40 },
            endProps    : { customAlpha: 1, customY: 16 },
        });
        Executor.reset({
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 0, customY: 30 },
            endProps    : { customAlpha: 1, customY: 70 },
        });
        Executor.reset({
            obj         : this._groupWarList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Executor.reset({
            obj         : this._btnNextStep,
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
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 1, customY: 16 },
            endProps    : { customAlpha: 0, customY: 16 - 40 },
        });
        Executor.reset({
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 1, customY: 70 },
            endProps    : { customAlpha: 0, customY: 30 },
        });
        Executor.reset({
            obj         : this._groupWarList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Executor.reset({
            obj         : this._btnNextStep,
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

interface DataForWarRenderer extends UiListItemData {
    warId   : number;
    panel   : Panel;
}
class WarRenderer
    extends     UiListItemRenderer<DataForWarRenderer>
    implements  IUiListItemRenderer<DataForWarRenderer>
{
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelType!    : IUiLabel;
    private readonly _labelName!    : IUiLabel;

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

        const warSettings   = await getWarSettings(warId);
        const label         = this._labelType;
        if (warSettings == null) {
            label.setText(UndefinedError);
        } else {
            label.setText(getWarTypeName(getWarTypeByMpwWarSettings(warSettings)) ?? UndefinedError);
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

        const warSettings = await getWarSettings(warId);
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
                    labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);
                }

            } else if (settingsForCcw) {
                const warName = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const normalMapId   = settingsForCcw.getNormalMapId();
                    labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);
                }

            } else if (settingsForMrw) {
                const normalMapId   = settingsForMrw.getNormalMapId();
                labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);

            } else if (settingsForMmw) {
                const normalMapId   = settingsForMmw.getNormalMapId();
                labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);

            } else if (settingsForAtw) {
                const normalMapId   = settingsForAtw.getNormalMapId();
                labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);
            }
        }

        layoutName.arrangeItems();
    }
}

function reqDataArray(filter: WarFilter): void {
    reqMpwWatchGetRequestableWarIdArray({
        warId                   : filter.warId,
        coCategoryId            : filter.coCategoryId,
        normalMapId             : filter.normalMapId,
        userId                  : filter.userId,
        playersCountUnneutral   : filter.playersCountUnneutral,
        warName                 : filter.warName,
    });
}
function checkIsFilterEmpty(filter: WarFilter): boolean {
    return (filter.coCategoryId             == null)
        && (filter.normalMapId              == null)
        && (filter.playersCountUnneutral    == null)
        && (filter.userId                   == null)
        && (filter.warId                    == null)
        && (filter.warName                  == null);
}
