import * as AuxiliaryTypesWarFilter from "../../auxiliaryTypes/WarFilter.ts";
import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
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
import * as WarSettingsUtilsMpwWarSettings from "../../warSettings/utils/MpwWarSettings.ts";
import * as WatchWarModelWwModel from "../model/WwModel.ts";
import * as WatchWarModelWwProxy from "../model/WwProxy.ts";

const MapsPerPage   = 50;
let _pageIndex      = 0;

export interface OpenData {
    filter  : AuxiliaryTypesWarFilter.WarFilter | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!          : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPage.OpenData | CommonViewCommonWarPlayerInfoPage.OpenData | CommonViewCommonWarAdvancedSettingsPage.OpenData | CommonViewCommonWarBasicSettingsPage.OpenData>;

    private readonly _groupNavigator!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelWatchWar!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMakeRequest!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseWar!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTopRightButtons! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSearch!            : UiInterfacesIUiButton.IUiButton;

    private readonly _groupSearch!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnPrevPage!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextPage!          : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutPage!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPageTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPage!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextStep!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupWarList!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listWar!              : UiInterfacesIUiScrollList.IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoading!         : UiInterfacesIUiLabel.IUiLabel;

    private _warFilter                      = new AuxiliaryTypesWarFilter.WarFilter();
    private _hasReceivedData                = false;
    private _isTabInitialized               = false;
    private _cachedListDataArray            : DataForWarRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetRequestableWarIdArray, callback: this._onNotifyMsgMpwWatchGetRequestableWarIdArray },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchMakeRequest,              callback: this._onNotifyMsgMpwWatchMakeRequest },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            { ui: this._btnPrevPage,    callback: this._onTouchedBtnPrevPage },
            { ui: this._btnNextPage,    callback: this._onTouchedBtnNextPage },
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
        const index     = HelpersMisc.getExisted(listMap.getRevisedFirstIndex(v => v?.warId === warId));
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
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0060));
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBottomPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WwMainMenuPanel, void 0);
    }

    private _onTouchTapBtnSearch(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WwSearchWarPanel, {
            filter  : this.getOpenData()?.filter,
        });
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const data = this._listWar.getFirstSelectedData();
        if (data == null) {
            return;
        }

        const warId = data.warId;
        if (await WatchWarModelWwModel.getWatchOutgoingInfo(warId) == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0297));
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().WwMakeRequestDetailPanel, {
                warId,
            });
        }
    }

    private async _onTouchedBtnPrevPage(): Promise<void> {
        const newPageIndex = NumbersUtils.getValueInRange({
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
        const newPageIndex = NumbersUtils.getValueInRange({
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

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setText(LangUtils.getText(LangConstants.TextType.A0040));
        this._labelWatchWar.setText(LangUtils.getText(LangConstants.TextType.B0206));
        this._labelMakeRequest.setText(LangUtils.getText(LangConstants.TextType.B0207));
        this._labelChooseWar.setText(LangUtils.getText(LangConstants.TextType.B0589));
        this._btnBack.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._labelNoWar.setText(LangUtils.getText(LangConstants.TextType.B0210));
        this._btnNextStep.setText(LangUtils.getText(LangConstants.TextType.B0566));
        this._btnPrevPage.setText(LangUtils.getText(LangConstants.TextType.B1384));
        this._btnNextPage.setText(LangUtils.getText(LangConstants.TextType.B1385));
        this._updateLabelPageTitle();

        this._layoutPage.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private _updateLabelPageTitle(): void {
        const label = this._labelPageTitle;
        if (checkIsFilterEmpty(this._warFilter)) {
            label.setTextColor(0xCCCCCC);
            label.setText(LangUtils.getText(LangConstants.TextType.B1386));
        } else {
            label.setTextColor(0xFFFF00);
            label.setText(`${LangUtils.getText(LangConstants.TextType.B1386)}(${LangUtils.getText(LangConstants.TextType.B1387)})`);
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
        for (const warId of WatchWarModelWwModel.getRequestableWarIdArray() ?? []) {
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

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonViewCommonWarMapInfoPage.OpenData> {
        return await WatchWarModelWwModel.createDataForCommonWarMapInfoPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
        return await WatchWarModelWwModel.createDataForCommonWarPlayerInfoPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
        return await WatchWarModelWwModel.createDataForCommonWarBasicSettingsPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
        return await WatchWarModelWwModel.createDataForCommonWarAdvancedSettingsPage(this._getSelectedWarId());
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
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 0, customY: 16 - 40 },
            endProps    : { customAlpha: 1, customY: 16 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 0, customY: 30 },
            endProps    : { customAlpha: 1, customY: 70 },
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
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 1, customY: 16 },
            endProps    : { customAlpha: 0, customY: 16 - 40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 1, customY: 70 },
            endProps    : { customAlpha: 0, customY: 30 },
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
    warId   : number;
    panel   : Panel;
}
class WarRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForWarRenderer>
{
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

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

        const warSettings   = await MultiPlayerWarModelMpwModel.getWarSettings(warId);
        const label         = this._labelType;
        if (warSettings == null) {
            label.setText(LangConstants.UndefinedError);
        } else {
            label.setText(LangUtils.getWarTypeName(WarSettingsUtilsMpwWarSettings.getWarTypeByMpwWarSettings(warSettings)) ?? LangConstants.UndefinedError);
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

        const warSettings = await MultiPlayerWarModelMpwModel.getWarSettings(warId);
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
                    const normalMapId   = settingsForMcw.getNormalMapId() ?? 0;
                    labelName.setText((normalMapId == null ? null : await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || LangConstants.UndefinedError);
                }

            } else if (settingsForCcw) {
                const warName = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const normalMapId   = settingsForCcw.getNormalMapId() ?? 0;
                    labelName.setText((normalMapId == null ? null : await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || LangConstants.UndefinedError);
                }

            } else if (settingsForMrw) {
                const normalMapId   = settingsForMrw.getNormalMapId() ?? 0;
                labelName.setText((normalMapId == null ? null : await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || LangConstants.UndefinedError);

            } else if (settingsForMmw) {
                const normalMapId   = settingsForMmw.getNormalMapId() ?? 0;
                labelName.setText((normalMapId == null ? null : await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || LangConstants.UndefinedError);

            } else if (settingsForAtw) {
                const normalMapId   = settingsForAtw.getNormalMapId() ?? 0;
                labelName.setText((normalMapId == null ? null : await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || LangConstants.UndefinedError);
            }
        }

        layoutName.arrangeItems();
    }
}

function reqDataArray(filter: AuxiliaryTypesWarFilter.WarFilter): void {
    WatchWarModelWwProxy.reqMpwWatchGetRequestableWarIdArray({
        warId                   : filter.warId,
        coCategoryId            : filter.coCategoryId,
        normalMapId             : filter.normalMapId,
        userId                  : filter.userId,
        playersCountUnneutral   : filter.playersCountUnneutral,
        warName                 : filter.warName,
    });
}
function checkIsFilterEmpty(filter: AuxiliaryTypesWarFilter.WarFilter): boolean {
    return (filter.coCategoryId             == null)
        && (filter.normalMapId              == null)
        && (filter.playersCountUnneutral    == null)
        && (filter.userId                   == null)
        && (filter.warId                    == null)
        && (filter.warName                  == null);
}
