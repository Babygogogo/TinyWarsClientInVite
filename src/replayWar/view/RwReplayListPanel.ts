import {
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
    type AuxiliaryTypes_ReplayFilter,
    ReplayWar_View_RwReplayWarInfoPage,
    type Ui_Types_UiListItemData,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    GameModes_Utils,
    Helpers_Misc,
    Users_Model,
    GameConfigs_Provider,
    NormalMap_Model_NormalMapModel,
    ReplayWar_Model_RwModel,
    Lang_Utils,
    Numbers_Utils,
    Helpers_GameFlow,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
} from "../../internal.ts";
import type { ReplayInfo } from "../../proto/schema/CommonProto/Replay/ReplayInfo.ts";

const MapsPerPage       = 50;
let _pageIndex          = 0;
let _selectedReplayId   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
let _previousFilter     : AuxiliaryTypes_ReplayFilter.ReplayFilter | null | undefined;

export interface OpenData {
    filter                  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_ReplayFilter.ReplayFilter>;
    usePreviousFilter       : boolean;
    usePreviousPageIndex    : boolean;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarPlayerInfoPage.OpenData | ReplayWar_View_RwReplayWarInfoPage.OpenData>;

    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelReplay!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseReplay!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupTopRightButtons! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSearch!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupSearch!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnPrevPage!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextPage!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutPage!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPageTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPage!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupReplayList!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listReplay!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForReplayRenderer>;
    private readonly _labelNoReplay!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoading!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isTabInitialized               = false;
    private _replayFilter                   : AuxiliaryTypes_ReplayFilter.ReplayFilter | null | undefined;
    private _cachedListDataArray            : DataForReplayRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnBack,        callback : this._onTouchedBtnBack },
            { ui : this._btnSearch,      callback : this._onTouchedBtnSearch },
            { ui : this._btnNextStep,    callback : this._onTouchedBtnNextStep },
            { ui : this._btnPrevPage,    callback : this._onTouchedBtnPrevPage },
            { ui : this._btnNextPage,    callback : this._onTouchedBtnNextPage },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrMainMenuPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
    }
    private _onTouchedBtnSearch(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().RwSearchReplayPanel, {
            replayFilter : this._replayFilter,
        });
    }
    private async _onTouchedBtnNextStep(): Promise<void> {
        const replayId = this._getSelectedReplayId();
        if (replayId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
            });

            const data = await ReplayWar_Model_RwModel.getReplayData(replayId);
            if (data) {
                Helpers_GameFlow.gotoReplayWar(data, replayId);
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
            }
        }
    }
    private async _onTouchedBtnPrevPage(): Promise<void> {
        const newPageIndex = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue : _pageIndex - 1,
        });
        if (newPageIndex !== _pageIndex) {
            _pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }
    private async _onTouchedBtnNextPage(): Promise<void> {
        const newPageIndex = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue : _pageIndex + 1,
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
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0223) },
                pageClass   : ReplayWar_View_RwReplayWarInfoPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(Lang_Constants.TextType.A0040);
        this._labelReplay.setLangText(Lang_Constants.TextType.B0092);
        this._labelChooseReplay.setLangText(Lang_Constants.TextType.B0598);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._labelNoReplay.setLangText(Lang_Constants.TextType.B0241);
        this._btnNextStep.setLangText(Lang_Constants.TextType.B0249);
        this._btnPrevPage.setLangText(Lang_Constants.TextType.B1384);
        this._btnNextPage.setLangText(Lang_Constants.TextType.B1385);
        this._updateLabelPageTitle();

        this._layoutPage.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private _updateLabelPageTitle(): void {
        const label = this._labelPageTitle;
        if (_checkIsEmptyFilter(this._replayFilter)) {
            label.setTextColor(0xCCCCCC);
            label.setLangText(Lang_Constants.TextType.B1386);
        } else {
            label.setTextColor(0xFFFF00);
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1386)}(${Lang_Utils.getText(Lang_Constants.TextType.B1387)})`);
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
            this._tabSettings.updatePageData(2, (replayId == null ? null : { replayId }) as ReplayWar_View_RwReplayWarInfoPage.OpenData);
        }
    }
    private _updateBtnNextStep(): void {
        this._btnNextStep.setIsVisible(this._getSelectedReplayId() != null);
    }

    private async _refreshCachedListDataArray(): Promise<void> {
        const filter = this._replayFilter;
        if (filter?.replayId != null) {
            const replayId      = filter.replayId;
            const replayInfo    = await ReplayWar_Model_RwModel.getReplayInfo(replayId);
            if ((replayInfo != null) && (await _checkIsReplayInfoMeetFilter(replayInfo, filter))) {
                this._cachedListDataArray = [{
                    replayId : replayId,
                    panel    : this,
                }];
            } else {
                this._cachedListDataArray = [];
            }
            return;
        }

        const promiseArray  : Promise<void>[] = [];
        const dataArray     : DataForReplayRenderer[] = [];
        for (const replayId of await ReplayWar_Model_RwModel.getReplayIdSet()) {
            promiseArray.push((async () => {
                const replayInfo = await ReplayWar_Model_RwModel.getReplayInfo(replayId);
                if (replayInfo == null) {
                    return;
                }

                if ((filter == null) || (await _checkIsReplayInfoMeetFilter(replayInfo, filter))) {
                    dataArray.push({
                        replayId : replayId,
                        panel    : this,
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

    private async _createDataForCommonWarMapInfoPage(): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
        const replayId = this._getSelectedReplayId();
        if (replayId == null) {
            return null;
        }

        const replayInfo    = Helpers_Misc.getExisted(await ReplayWar_Model_RwModel.getReplayInfo(replayId));
        const normalMapId   = replayInfo.getNormalMapId();
        if (normalMapId != null) {
            return {
                mapInfo : {
                    hasFog            : !!replayInfo.getHasFog(),
                    mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                    gameConfig        : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(replayInfo.getConfigVersion())),
                    overridingPlayers : null,
                },
            };
        } else {
            const warData = (await ReplayWar_Model_RwModel.getReplayData(replayId))?.getSettingsForMfw()?.getInitialWarData();
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
        const replayId = this._getSelectedReplayId();
        if (replayId == null) {
            return null;
        }

        const replayBriefInfo = await ReplayWar_Model_RwModel.getReplayInfo(replayId);
        if (replayBriefInfo == null) {
            return null;
        }

        const playerInfoArray: AuxiliaryTypes_AuxiliaryTypes.PlayerInfo[] = [];
        for (const playerInfo of replayBriefInfo.getPlayerInfoList()) {
            const userId = playerInfo.getUserId() ?? null;
            playerInfoArray.push({
                playerIndex       : playerInfo.getPlayerIndex(),
                teamIndex         : playerInfo.getTeamIndex(),
                isAi              : userId == null,
                userId            : userId,
                coId              : playerInfo.getCoId(),
                unitAndTileSkinId : playerInfo.getUnitAndTileSkinId(),
                isReady           : null,
                isInTurn          : null,
                isDefeat          : !playerInfo.getIsAlive(),
                restTimeToBoot    : playerInfo.getRestTimeToBoot(),
            });
        }

        return {
            gameConfig             : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(replayBriefInfo.getConfigVersion())),
            playersCountUnneutral  : playerInfoArray.length,
            roomOwnerPlayerIndex   : null,
            callbackOnExitRoom     : null,
            callbackOnDeletePlayer : null,
            callbackOnAddDummy     : null,
            callbackOnChangeDummy  : null,
            playerInfoArray        : playerInfoArray,
            enterTurnTime          : null,
            isReplay               : true,
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
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 0, customY : 16 - 40 },
            endProps   : { customAlpha : 1, customY : 16 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSearch,
            beginProps : { customAlpha : 0, customY : 30 },
            endProps   : { customAlpha : 1, customY : 70 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupReplayList,
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
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 1, customY : 16 },
            endProps   : { customAlpha : 0, customY : 16 - 40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSearch,
            beginProps : { customAlpha : 1, customY : 70 },
            endProps   : { customAlpha : 0, customY : 30 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupReplayList,
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

interface DataForReplayRenderer extends Ui_Types_UiListItemData.UiListItemData {
    replayId    : number;
    panel       : Panel;
}
class ReplayRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForReplayRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForReplayRenderer> {
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

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

        const replayBriefInfo   = await ReplayWar_Model_RwModel.getReplayInfo(replayId);
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
            labelType.setText(Lang_Utils.getWarTypeName(replayBriefInfo.getWarType()) ?? Lang_Constants.UndefinedError);
            labelName.setText(normalMapId == null
                ? `----`
                : await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? Lang_Constants.UndefinedError,
            );
        }
        this._layoutName.arrangeItems();
    }
}

async function _checkIsReplayInfoMeetFilter(replayInfo: ReplayInfo, filter: AuxiliaryTypes_ReplayFilter.ReplayFilter): Promise<boolean> {
    const replayId = replayInfo.getReplayId();
    {
        if ((filter.replayId != null) && (replayId !== filter.replayId)) {
            return false;
        }
    }

    {
        if ((filter.hasFog != null) && ((replayInfo.getHasFog()) !== filter.hasFog)) {
            return false;
        }
    }

    {
        if ((filter.normalMapId != null) && (replayInfo.getNormalMapId() !== filter.normalMapId)) {
            return false;
        }
    }

    {
        if ((filter.gameMode != null) && (GameModes_Utils.getEnum(replayInfo.getWarType()) !== filter.gameMode)) {
            return false;
        }
    }

    {
        const minPlayersCountUnneutral = filter.minPlayersCountUnneutral;
        if ((minPlayersCountUnneutral != null) && ((replayInfo.getPlayerInfoList().length) < minPlayersCountUnneutral)) {
            return false;
        }
    }

    {
        const maxPlayersCountUnneutral = filter.maxPlayersCountUnneutral;
        if ((maxPlayersCountUnneutral != null) && ((replayInfo.getPlayerInfoList().length) > maxPlayersCountUnneutral)) {
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
        if ((minTurnsCount != null) && ((replayInfo.getTurnIndex()) < minTurnsCount)) {
            return false;
        }
    }

    {
        const maxTurnsCount = filter.maxTurnsCount;
        if ((maxTurnsCount != null) && ((replayInfo.getTurnIndex()) > maxTurnsCount)) {
            return false;
        }
    }

    {
        const minWarOperationsCount = filter.minWarOperationsCount;
        if ((minWarOperationsCount != null) && ((replayInfo.getExecutedActionsCount()) < minWarOperationsCount)) {
            return false;
        }
    }

    {
        const maxWarOperationsCount = filter.maxWarOperationsCount;
        if ((maxWarOperationsCount != null) && ((replayInfo.getExecutedActionsCount()) > maxWarOperationsCount)) {
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
            (((Users_Model.getFavoriteReplayIdArray() ?? []).indexOf(replayId) >= 0) !== isFavorite)
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
            const gameConfig = await GameConfigs_Provider.getGameConfig(replayInfo.getConfigVersion() ?? ``);
            if (gameConfig == null) {
                return false;
            }

            const coCategoryId = filter.coCategoryId;
            if (!playerInfoList.some(v => gameConfig.getCoBasicCfg(v.getCoId())?.getCoCategoryId() === coCategoryId)) {
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

function _checkIsEmptyFilter(filter: AuxiliaryTypes_ReplayFilter.ReplayFilter | null | undefined): boolean {
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
