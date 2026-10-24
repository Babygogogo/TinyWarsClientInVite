import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesReplayFilter from "../../auxiliaryTypes/ReplayFilter.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameModesUtils from "../../gameModes/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoReplayReplayInfo from "../../proto/schema/CommonProto/Replay/ReplayInfo.ts";
import * as ReplayWarModelRwModel from "../model/RwModel.ts";
import * as ReplayWarViewRwReplayWarInfoPage from "./RwReplayWarInfoPage.ts";
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
import * as UsersModel from "../../users/Model.ts";

const MapsPerPage       = 50;
let _pageIndex          = 0;
let _selectedReplayId   : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
let _previousFilter     : AuxiliaryTypesReplayFilter.ReplayFilter | null | undefined;

export interface OpenData {
    filter                  : AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesReplayFilter.ReplayFilter>;
    usePreviousFilter       : boolean;
    usePreviousPageIndex    : boolean;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!          : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPage.OpenData | CommonViewCommonWarPlayerInfoPage.OpenData | ReplayWarViewRwReplayWarInfoPage.OpenData>;

    private readonly _groupNavigator!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelReplay!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseReplay!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextStep!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupTopRightButtons! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSearch!            : UiInterfacesIUiButton.IUiButton;

    private readonly _groupSearch!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnPrevPage!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextPage!          : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutPage!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPageTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPage!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupReplayList!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listReplay!           : UiInterfacesIUiScrollList.IUiScrollList<DataForReplayRenderer>;
    private readonly _labelNoReplay!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoading!         : UiInterfacesIUiLabel.IUiLabel;

    private _isTabInitialized               = false;
    private _replayFilter                   : AuxiliaryTypesReplayFilter.ReplayFilter | null | undefined;
    private _cachedListDataArray            : DataForReplayRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnSearch,      callback: this._onTouchedBtnSearch },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            { ui: this._btnPrevPage,    callback: this._onTouchedBtnPrevPage },
            { ui: this._btnNextPage,    callback: this._onTouchedBtnNextPage },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listReplay.setItemRendererClass(ReplayRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();
        this._updateGroupTab();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await Promise.all([
            this._tabSettings.clear(),
            this._listReplay.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedReplayId(replayId: number | null, needScroll: boolean): Promise<void> {
        _selectedReplayId = replayId;

        const listReplay    = this._listReplay;
        const index         = listReplay.getRevisedFirstIndex(v => v?.replayId === replayId);
        listReplay.setSelectedItemIndex(index);
        if (needScroll) {
            listReplay.scrollToItem(Math.max(0, index - 1));
        }

        this._updateBtnNextStep();
        await this._updateGroupTab();
    }
    private _getSelectedReplayId(): number | null {
        return this._listReplay.getFirstSelectedData()?.replayId ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrMainMenuPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBottomPanel, void 0);
    }
    private _onTouchedBtnSearch(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().RwSearchReplayPanel, {
            replayFilter    : this._replayFilter,
        });
    }
    private async _onTouchedBtnNextStep(): Promise<void> {
        const replayId = this._getSelectedReplayId();
        if (replayId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                title   : LangUtils.getText(LangConstants.TextType.B0088),
                content : LangUtils.getText(LangConstants.TextType.A0040),
            });

            const data = await ReplayWarModelRwModel.getReplayData(replayId);
            if (data) {
                HelpersGameFlow.gotoReplayWar(data, HelpersMisc.getExisted(replayId));
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
            }
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
    private async _updateOnOpenDataChanged(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.usePreviousFilter) {
            this._replayFilter = _previousFilter;
        } else {
            this._replayFilter = openData.filter;
        }
        if (!openData.usePreviousPageIndex) {
            _pageIndex = 0;
        }
        _previousFilter = this._replayFilter;

        this._updateLabelPageTitle();

        const labelLoading = this._labelLoading;
        labelLoading.setIsVisible(true);
        this._labelNoReplay.setIsVisible(false);
        await this._refreshCachedListDataArray();
        labelLoading.setIsVisible(false);
        await this._updateComponentsForPage();
    }

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
                tabItemData : { name: LangUtils.getText(LangConstants.TextType.B0223) },
                pageClass   : ReplayWarViewRwReplayWarInfoPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(LangConstants.TextType.A0040);
        this._labelReplay.setLangText(LangConstants.TextType.B0092);
        this._labelChooseReplay.setLangText(LangConstants.TextType.B0598);
        this._btnBack.setLangText(LangConstants.TextType.B0146);
        this._labelNoReplay.setLangText(LangConstants.TextType.B0241);
        this._btnNextStep.setLangText(LangConstants.TextType.B0249);
        this._btnPrevPage.setLangText(LangConstants.TextType.B1384);
        this._btnNextPage.setLangText(LangConstants.TextType.B1385);
        this._updateLabelPageTitle();

        this._layoutPage.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private _updateLabelPageTitle(): void {
        const label = this._labelPageTitle;
        if (_checkIsEmptyFilter(this._replayFilter)) {
            label.setTextColor(0xCCCCCC);
            label.setLangText(LangConstants.TextType.B1386);
        } else {
            label.setTextColor(0xFFFF00);
            label.setText(`${LangUtils.getText(LangConstants.TextType.B1386)}(${LangUtils.getText(LangConstants.TextType.B1387)})`);
        }
        this._layoutPage.arrangeItems();
    }

    private async _updateComponentsForPage(): Promise<void> {
        const dataArray = this._getListDataArray();
        this._labelPage.setText(`${_pageIndex + 1} / ${Math.max(1, Math.ceil(this._cachedListDataArray.length / MapsPerPage))}`);
        this._layoutPage.arrangeItems();

        const oldSelectedReplayId = _selectedReplayId ?? this._getSelectedReplayId();
        this._labelNoReplay.setIsVisible(dataArray.length <= 0);
        await this._listReplay.bindData(dataArray);
        await this.setAndReviseSelectedReplayId(oldSelectedReplayId ?? -1, true);
    }

    private async _updateGroupTab(): Promise<void> {
        const groupTab = this._groupTab;
        if ((!this._isTabInitialized) || (this._getSelectedReplayId() == null)) {
            groupTab.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);

            const replayId = this._getSelectedReplayId();
            this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
            this._tabSettings.updatePageData(2, (replayId == null ? null : { replayId }) as ReplayWarViewRwReplayWarInfoPage.OpenData);
        }
    }
    private _updateBtnNextStep(): void {
        this._btnNextStep.setIsVisible(this._getSelectedReplayId() != null);
    }

    private async _refreshCachedListDataArray(): Promise<void> {
        const filter = this._replayFilter;
        if (filter?.replayId != null) {
            const replayId      = filter.replayId;
            const replayInfo    = await ReplayWarModelRwModel.getReplayInfo(replayId);
            if ((replayInfo != null) && (await _checkIsReplayInfoMeetFilter(replayInfo, filter))) {
                this._cachedListDataArray = [{
                    replayId    : replayId,
                    panel       : this,
                }];
            } else {
                this._cachedListDataArray = [];
            }
            return;
        }

        const promiseArray  : Promise<void>[] = [];
        const dataArray     : DataForReplayRenderer[] = [];
        for (const replayId of await ReplayWarModelRwModel.getReplayIdSet()) {
            promiseArray.push((async () => {
                const replayInfo = await ReplayWarModelRwModel.getReplayInfo(replayId);
                if (replayInfo == null) {
                    return;
                }

                if ((filter == null) || (await _checkIsReplayInfoMeetFilter(replayInfo, filter))) {
                    dataArray.push({
                        replayId    : replayId,
                        panel       : this,
                    });
                }
            })());
        }
        await Promise.all(promiseArray);
        this._cachedListDataArray = dataArray.sort((v1, v2) => v2.replayId - v1.replayId);
    }
    private _getListDataArray(): DataForReplayRenderer[] {
        return this._cachedListDataArray.slice(_pageIndex * MapsPerPage, (_pageIndex + 1) * MapsPerPage);
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonViewCommonWarMapInfoPage.OpenData> {
        const replayId = this._getSelectedReplayId();
        if (replayId == null) {
            return null;
        }

        const replayInfo    = HelpersMisc.getExisted(await ReplayWarModelRwModel.getReplayInfo(replayId));
        const normalMapId   = replayInfo.getNormalMapId();
        if (normalMapId != null) {
            return {
                mapInfo : {
                    hasFog              : !!replayInfo.getHasFog(),
                    mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                    gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(replayInfo.getConfigVersion())),
                    overridingPlayers   : null,
                },
            };
        } else {
            const warData = (await ReplayWarModelRwModel.getReplayData(replayId))?.getSettingsForMfw()?.getInitialWarData();
            return warData == null
                ? null
                : {
                    warInfo : {
                        warData             : warData,
                        showInitialWarData  : false,
                        overridingPlayers   : null,
                    },
                };
        }
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
        const replayId = this._getSelectedReplayId();
        if (replayId == null) {
            return null;
        }

        const replayBriefInfo = await ReplayWarModelRwModel.getReplayInfo(replayId);
        if (replayBriefInfo == null) {
            return null;
        }

        const playerInfoArray: AuxiliaryTypesAuxiliaryTypes.PlayerInfo[] = [];
        for (const playerInfo of replayBriefInfo.getPlayerInfoList()) {
            const userId = playerInfo.getUserId() ?? null;
            playerInfoArray.push({
                playerIndex         : HelpersMisc.getExisted(playerInfo.getPlayerIndex()),
                teamIndex           : HelpersMisc.getExisted(playerInfo.getTeamIndex()),
                isAi                : userId == null,
                userId              : userId,
                coId                : playerInfo.getCoId() ?? 0,
                unitAndTileSkinId   : playerInfo.getUnitAndTileSkinId() ?? 0,
                isReady             : null,
                isInTurn            : null,
                isDefeat            : !playerInfo.getIsAlive(),
                restTimeToBoot      : playerInfo.getRestTimeToBoot() ?? null,
            });
        }

        return {
            gameConfig              : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(replayBriefInfo.getConfigVersion())),
            playersCountUnneutral   : playerInfoArray.length,
            roomOwnerPlayerIndex    : null,
            callbackOnExitRoom      : null,
            callbackOnDeletePlayer  : null,
            callbackOnAddDummy      : null,
            callbackOnChangeDummy   : null,
            playerInfoArray         : playerInfoArray,
            enterTurnTime           : null,
            isReplay                : true,
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
            obj         : this._groupReplayList,
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
            obj         : this._groupReplayList,
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

interface DataForReplayRenderer extends UiTypesUiListItemData.UiListItemData {
    replayId    : number;
    panel       : Panel;
}
class ReplayRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForReplayRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForReplayRenderer>
{
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedReplayId(openData.replayId, false);
    }

    private async _updateView(): Promise<void> {
        const replayId = this.getOpenData()?.replayId;
        if (replayId == null) {
            return;
        }

        const replayBriefInfo   = await ReplayWarModelRwModel.getReplayInfo(replayId);
        const labelId           = this._labelId;
        const labelType         = this._labelType;
        const labelName         = this._labelName;
        if (replayBriefInfo == null) {
            labelId.setText(``);
            labelType.setText(``);
            labelName.setText(``);
        } else {
            const normalMapId = replayBriefInfo.getNormalMapId();
            labelId.setText(`#${replayBriefInfo.getReplayId()}`);
            labelType.setText(LangUtils.getWarTypeName(HelpersMisc.getExisted(replayBriefInfo.getWarType())) ?? LangConstants.UndefinedError);
            labelName.setText(normalMapId == null
                ? `----`
                : await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? LangConstants.UndefinedError
            );
        }
        this._layoutName.arrangeItems();
    }
}

async function _checkIsReplayInfoMeetFilter(replayInfo: ProtoSchemaCommonProtoReplayReplayInfo.ReplayInfo, filter: AuxiliaryTypesReplayFilter.ReplayFilter): Promise<boolean> {
    const replayId = replayInfo.getReplayId() ?? 0;
    {
        if ((filter.replayId != null) && (replayId !== filter.replayId)) {
            return false;
        }
    }

    {
        if ((filter.hasFog != null) && ((replayInfo.getHasFog() ?? false) !== filter.hasFog)) {
            return false;
        }
    }

    {
        if ((filter.normalMapId != null) && (replayInfo.getNormalMapId() !== filter.normalMapId)) {
            return false;
        }
    }

    {
        if ((filter.gameMode != null) && (GameModesUtils.getEnum(replayInfo.getWarType() ?? 0) !== filter.gameMode)) {
            return false;
        }
    }

    {
        const minPlayersCountUnneutral = filter.minPlayersCountUnneutral;
        if ((minPlayersCountUnneutral != null) && ((replayInfo.getPlayerInfoList().length ?? 0) < minPlayersCountUnneutral)) {
            return false;
        }
    }

    {
        const maxPlayersCountUnneutral = filter.maxPlayersCountUnneutral;
        if ((maxPlayersCountUnneutral != null) && ((replayInfo.getPlayerInfoList().length ?? 0) > maxPlayersCountUnneutral)) {
            return false;
        }
    }

    {
        const minMapWidth = filter.minMapWidth;
        if ((minMapWidth != null) && ((replayInfo.getMapSize()?.getWidth() ?? 0) < minMapWidth)) {
            return false;
        }
    }

    {
        const maxMapWidth = filter.maxMapWidth;
        if ((maxMapWidth != null) && ((replayInfo.getMapSize()?.getWidth() ?? 0) > maxMapWidth)) {
            return false;
        }
    }

    {
        const minMapHeight = filter.minMapHeight;
        if ((minMapHeight != null) && ((replayInfo.getMapSize()?.getHeight() ?? 0) < minMapHeight)) {
            return false;
        }
    }

    {
        const maxMapHeight = filter.maxMapHeight;
        if ((maxMapHeight != null) && ((replayInfo.getMapSize()?.getHeight() ?? 0) > maxMapHeight)) {
            return false;
        }
    }

    {
        const minTurnsCount = filter.minTurnsCount;
        if ((minTurnsCount != null) && ((replayInfo.getTurnIndex() ?? 0) < minTurnsCount)) {
            return false;
        }
    }

    {
        const maxTurnsCount = filter.maxTurnsCount;
        if ((maxTurnsCount != null) && ((replayInfo.getTurnIndex() ?? 0) > maxTurnsCount)) {
            return false;
        }
    }

    {
        const minWarOperationsCount = filter.minWarOperationsCount;
        if ((minWarOperationsCount != null) && ((replayInfo.getExecutedActionsCount() ?? 0) < minWarOperationsCount)) {
            return false;
        }
    }

    {
        const maxWarOperationsCount = filter.maxWarOperationsCount;
        if ((maxWarOperationsCount != null) && ((replayInfo.getExecutedActionsCount() ?? 0) > maxWarOperationsCount)) {
            return false;
        }
    }

    {
        const minRankScore = filter.minRankScore;
        if (minRankScore != null) {
            for (const playerInfo of replayInfo.getPlayerInfoList()) {
                const rankScore = playerInfo.getRankScore() ?? -1;
                if ((rankScore >= 0) && (rankScore < minRankScore)) {
                    return false;
                }
            }
        }
    }

    {
        const maxRankScore = filter.maxRankScore;
        if (maxRankScore != null) {
            for (const playerInfo of replayInfo.getPlayerInfoList()) {
                const rankScore = playerInfo.getRankScore() ?? -1;
                if ((rankScore >= 0) && (rankScore > maxRankScore)) {
                    return false;
                }
            }
        }
    }

    {
        const range = filter.globalRatingRange ?? [];
        if (range.length) {
            const totalRaters = replayInfo.getTotalRaters();
            if (!totalRaters) {
                return false;
            }

            const rating = (replayInfo.getTotalRating() ?? 0) / totalRaters;
            if ((rating < range[0]) || (rating > range[1])) {
                return false;
            }
        }
    }

    {
        const isFavorite = filter.isFavorite;
        if ((isFavorite != null) &&
            (((UsersModel.getFavoriteReplayIdArray() ?? []).indexOf(replayId) >= 0) !== isFavorite)
        ) {
            return false;
        }
    }

    const playerInfoList = replayInfo.getPlayerInfoList();
    {
        if (filter.userId != null) {
            const userId = filter.userId;
            if (!playerInfoList.some(v => v.getUserId() === userId)) {
                return false;
            }
        }
    }

    {
        if (filter.coCategoryId != null) {
            const gameConfig = await GameConfigGcModel.getGameConfig(replayInfo.getConfigVersion() ?? ``);
            if (gameConfig == null) {
                return false;
            }

            const coCategoryId = filter.coCategoryId;
            if (!playerInfoList.some(v => gameConfig.getCoBasicCfg(v.getCoId() ?? 0)?.getCoCategoryId() === coCategoryId)) {
                return false;
            }
        }
    }

    // {
    //     if (filter.minMyRating != null) {
    //         const rating = await RwModel.getReplaySelfRating(replayId);
    //         if ((rating == null) || (rating < filter.minMyRating)) {
    //             return false;
    //         }
    //     }
    // }

    return true;
}

function _checkIsEmptyFilter(filter: AuxiliaryTypesReplayFilter.ReplayFilter | null | undefined): boolean {
    if (filter == null) {
        return true;
    }

    return (filter.coCategoryId == null)
        && (filter.gameMode == null)
        && (filter.globalRatingRange == null)
        && (filter.hasFog == null)
        && (filter.isFavorite == null)
        && (filter.minMyRating == null)
        && (filter.normalMapId == null)
        && (filter.replayId == null)
        && (filter.maxMapHeight == null)
        && (filter.maxMapWidth == null)
        && (filter.maxPlayersCountUnneutral == null)
        && (filter.maxRankScore == null)
        && (filter.maxTurnsCount == null)
        && (filter.maxWarOperationsCount == null)
        && (filter.minMapHeight == null)
        && (filter.minMapWidth == null)
        && (filter.minPlayersCountUnneutral == null)
        && (filter.minRankScore == null)
        && (filter.minTurnsCount == null)
        && (filter.minWarOperationsCount == null)
        && (filter.userId == null);
}
