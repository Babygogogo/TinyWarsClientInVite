import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiPlayerWarModelMpwModel from "../model/MpwModel.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
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
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiInterfacesIUiTab from "../../ui/interfaces/IUiTab.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WarSettingsUtilsMpwWarSettings from "../../warSettings/utils/MpwWarSettings.ts";

const MAX_COUNTDOWN_FOR_AUTO_UPDATE = 30;

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTab!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tabSettings!      : UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, CommonViewCommonWarAdvancedSettingsPage.OpenData | CommonViewCommonWarBasicSettingsPage.OpenData | CommonViewCommonWarMapInfoPage.OpenData | CommonViewCommonWarPlayerInfoPage.OpenData>;

    private readonly _groupNavigator!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMultiPlayer! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyWar!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseWar!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextStep!      : UiInterfacesIUiButton.IUiButton;

    private readonly _groupWarList!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listWar!          : UiInterfacesIUiScrollList.IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoading!     : UiInterfacesIUiLabel.IUiLabel;

    private _isTabInitialized           = false;
    private _countdownForAutoUpdate     = MAX_COUNTDOWN_FOR_AUTO_UPDATE;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.TimeTick,            callback: this._onNotifyTimeTick },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,                    callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,                callback: this._onTouchedBtnNextStep },
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

    public async setAndReviseSelectedWarId(newWarId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>, needScroll: boolean): Promise<void> {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrMainMenuPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const warId = this._listWar.getFirstSelectedData()?.warId;
        if (warId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                title   : LangUtils.getText(LangConstants.TextType.B0088),
                content : LangUtils.getText(LangConstants.TextType.A0040),
            });

            const warData = await MultiPlayerWarModelMpwModel.getOngoingWarData(warId);
            if (warData) {
                HelpersGameFlow.gotoMultiPlayerWar(warData);
            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }

            GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
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
        this._labelMultiPlayer.setText(LangUtils.getText(LangConstants.TextType.B0137));
        this._labelMyWar.setText(LangUtils.getText(LangConstants.TextType.B0024));
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
        btn.setRedVisible((warId != null) && (await MultiPlayerWarModelMpwModel.checkIsRedForMyWar(await MultiPlayerWarModelMpwModel.getWarProgressInfo(warId))));
    }

    private async _createDataForListWar(): Promise<DataForWarRenderer[]> {
        const dataArray: DataForWarRenderer[] = (await MultiPlayerWarModelMpwModel.getJoinedMpwIdArray(true) ?? [])
            .map(v => ({
                warId   : v,
                panel   : this,
            }));

        return dataArray.sort((v1, v2) => v1.warId - v2.warId);
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonViewCommonWarMapInfoPage.OpenData> {
        const warId         = this._listWar.getFirstSelectedData()?.warId;
        const warSettings   = warId == null ? null : await MultiPlayerWarModelMpwModel.getWarSettings(warId);
        if (warSettings == null) {
            return null;
        }

        const normalMapId = WarSettingsUtilsMpwWarSettings.getNormalMapIdForMpwWarSettings(warSettings);
        if (normalMapId != null) {
            const settingsForCommon = warSettings.getSettingsForCommon();
            return {
                mapInfo : {
                    hasFog              : !!settingsForCommon?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                    gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon?.getConfigVersion())),
                    mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                    overridingPlayers   : null,
                },
            };
        } else {
            const warData = warSettings.getSettingsForMfw()?.getInitialWarData();
            return warData == null
                ? null
                : {
                    warInfo     : {
                        warData             : warData,
                        showInitialWarData  : false,
                        overridingPlayers   : null,
                    },
                };
        }
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
        return await MultiPlayerWarModelMpwModel.createDataForCommonWarPlayerInfoPage(this._listWar.getFirstSelectedData()?.warId ?? null);
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
        return await MultiPlayerWarModelMpwModel.createDataForCommonWarBasicSettingsPage(this._listWar.getFirstSelectedData()?.warId ?? null);
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
        return await MultiPlayerWarModelMpwModel.createDataForCommonWarAdvancedSettingsPage(this._listWar.getFirstSelectedData()?.warId ?? null);
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
    warId   : number;
    panel   : Panel;
}
class WarRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
    private readonly _imgRed!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutName!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelWarId!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRestTimeToBoot!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWarType!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!            : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TimeTick,                    callback: this._onNotifyTimeTick },
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

        const warSettings   = await MultiPlayerWarModelMpwModel.getWarSettings(warId);
        const labelName     = this._labelName;
        const labelWarType  = this._labelWarType;
        labelName.setText(``);
        labelWarType.setText(``);
        if (warSettings != null) {
            labelWarType.setText(LangUtils.getWarTypeName(WarSettingsUtilsMpwWarSettings.getWarTypeByMpwWarSettings(warSettings)) ?? LangConstants.UndefinedError);

            const warName = (warSettings.getSettingsForCcw()?.getWarName() ?? warSettings.getSettingsForMcw()?.getWarName() ?? warSettings.getSettingsForMfw()?.getWarName())?.trim();
            if (warName) {
                labelName.setText(warName);
            } else {
                const normalMapId = WarSettingsUtilsMpwWarSettings.getNormalMapIdForMpwWarSettings(warSettings);
                if (normalMapId != null) {
                    labelName.setText(await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId) || LangConstants.UndefinedError);
                } else {
                    labelName.setText(`(${LangUtils.getText(LangConstants.TextType.B0557)})`);
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

        this._imgRed.setIsVisible(await MultiPlayerWarModelMpwModel.checkIsRedForMyWar(await MultiPlayerWarModelMpwModel.getWarProgressInfo(warId)));
    }

    private async _updateLabelRestTimeToBoot(): Promise<void> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }

        const warSettings       = await MultiPlayerWarModelMpwModel.getWarSettings(warId);
        const warProgressInfo   = await MultiPlayerWarModelMpwModel.getWarProgressInfo(warId);
        const userId            = UsersModel.getSelfUserId();
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

        const playerIndexInTurn = HelpersMisc.getExisted(warProgressInfo.getPlayerIndexInTurn());
        if (warSettings.getPlayerInfoArray()?.find(v => v.getPlayerIndex() === playerIndexInTurn)?.getUserId() !== userId) {
            label.setText(`----------`);
            layout.arrangeItems();
            return;
        }

        const enterTurnTime     = warProgressInfo.getEnterTurnTime();
        const restTimeToBoot    = warProgressInfo.getPlayerInfoList().find(v => v.getPlayerIndex() === playerIndexInTurn)?.getRestTimeToBoot();
        const restTime          = (restTimeToBoot == null) || (enterTurnTime == null)
            ? null
            : Math.max(0, restTimeToBoot + enterTurnTime - TimerTimerModel.getServerTimestamp());
        if (restTime == null) {
            label.setText(`----------`);
        } else {
            label.setText(LangUtils.getTimeDurationText2(restTime));
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400)
            );
        }
        layout.arrangeItems();
    }
}
