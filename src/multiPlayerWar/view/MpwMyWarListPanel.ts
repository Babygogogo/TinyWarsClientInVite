import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { type OpenData as CommonViewCommonWarAdvancedSettingsPageOpenData, Page } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarBasicSettingsPageOpenData,
    Page as CommonViewCommonWarBasicSettingsPage,
} from "../../common/view/CommonWarBasicSettingsPage.ts";
import {
    type OpenData as CommonViewCommonWarMapInfoPageOpenData,
    Page as CommonViewCommonWarMapInfoPage,
} from "../../common/view/CommonWarMapInfoPage.ts";
import {
    type OpenData as CommonViewCommonWarPlayerInfoPageOpenData,
    Page as CommonViewCommonWarPlayerInfoPage,
} from "../../common/view/CommonWarPlayerInfoPage.ts";
import { showLang } from "../../FloatText.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { gotoMultiPlayerWar } from "../../helpers/GameFlow.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getWarTypeName, getTimeDurationText2 } from "../../lang/Utils.ts";
import {
    getOngoingWarData,
    checkIsRedForMyWar,
    getWarProgressInfo,
    getJoinedMpwIdArray,
    getWarSettings,
    createDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage,
} from "../model/MpwModel.ts";
import { getRawData, getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait, getServerTimestamp } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import { UiTabItemRenderer } from "../../ui/components/UiTabItemRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { IUiTab } from "../../ui/interfaces/IUiTab.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { getNormalMapIdForMpwWarSettings, getWarTypeByMpwWarSettings } from "../../warSettings/utils/MpwWarSettings.ts";

const MAX_COUNTDOWN_FOR_AUTO_UPDATE = 30;

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!         : IUiContainer;
    private readonly _tabSettings!      : IUiTab<DataForTabItemRenderer, CommonViewCommonWarAdvancedSettingsPageOpenData | CommonViewCommonWarBasicSettingsPageOpenData | CommonViewCommonWarMapInfoPageOpenData | CommonViewCommonWarPlayerInfoPageOpenData>;

    private readonly _groupNavigator!   : IUiLayout;
    private readonly _labelMultiPlayer! : IUiLabel;
    private readonly _labelMyWar!       : IUiLabel;
    private readonly _labelChooseWar!   : IUiLabel;

    private readonly _btnBack!          : IUiButton;
    private readonly _btnNextStep!      : IUiButton;

    private readonly _groupWarList!     : IUiContainer;
    private readonly _listWar!          : IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!       : IUiLabel;
    private readonly _labelLoading!     : IUiLabel;

    private _isTabInitialized           = false;
    private _countdownForAutoUpdate     = MAX_COUNTDOWN_FOR_AUTO_UPDATE;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: TypeId.TimeTick,            callback: this._onNotifyTimeTick },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,                    callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,                callback: this._onTouchedBtnNextStep },
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

    public async setAndReviseSelectedWarId(newWarId: Undefinable<number>, needScroll: boolean): Promise<void> {
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
        openPanel(getDict().McrMainMenuPanel, void 0);
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const warId = this._listWar.getFirstSelectedData()?.warId;
        if (warId != null) {
            openPanel(getDict().CommonBlockPanel, {
                title   : getText(TextType.B0088),
                content : getText(TextType.A0040),
            });

            const warData = await getOngoingWarData(warId);
            if (warData) {
                gotoMultiPlayerWar(warData);
            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }

            closePanel(getDict().CommonBlockPanel);
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
                pageClass   : CommonViewCommonWarMapInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name: getText(TextType.B0224) },
                pageClass   : CommonViewCommonWarPlayerInfoPage,
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

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(TextType.A0040);
        this._labelMultiPlayer.setLangText(TextType.B0137);
        this._labelMyWar.setLangText(TextType.B0024);
        this._labelChooseWar.setLangText(TextType.B0589);
        this._btnBack.setLangText(TextType.B0146);
        this._labelNoWar.setLangText(TextType.B0210);
        this._btnNextStep.setLangText(TextType.B0024);

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
        btn.setRedVisible((warId != null) && (await checkIsRedForMyWar(await getWarProgressInfo(warId))));
    }

    private async _createDataForListWar(): Promise<DataForWarRenderer[]> {
        const dataArray: DataForWarRenderer[] = (await getJoinedMpwIdArray(true) ?? [])
            .map(v => ({
                warId   : v,
                panel   : this,
            }));

        return dataArray.sort((v1, v2) => v1.warId - v2.warId);
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonViewCommonWarMapInfoPageOpenData> {
        const warId         = this._listWar.getFirstSelectedData()?.warId;
        const warSettings   = warId == null ? null : await getWarSettings(warId);
        if (warSettings == null) {
            return null;
        }

        const normalMapId = getNormalMapIdForMpwWarSettings(warSettings);
        if (normalMapId != null) {
            const settingsForCommon = warSettings.getSettingsForCommon();
            return {
                mapInfo : {
                    hasFog              : !!settingsForCommon?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                    gameConfig          : await getGameConfig(getExisted(settingsForCommon?.getConfigVersion())),
                    mapRawData          : getExisted(await getRawData(normalMapId)),
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

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPageOpenData> {
        return await createDataForCommonWarPlayerInfoPage(this._listWar.getFirstSelectedData()?.warId ?? null);
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPageOpenData> {
        return await createDataForCommonWarBasicSettingsPage(this._listWar.getFirstSelectedData()?.warId ?? null);
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPageOpenData> {
        return await createDataForCommonWarAdvancedSettingsPage(this._listWar.getFirstSelectedData()?.warId ?? null);
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
class WarRenderer extends UiListItemRenderer<DataForWarRenderer> {
    private readonly _imgRed!               : IUiLabel;
    private readonly _layoutName!           : IUiLayout;
    private readonly _labelWarId!           : IUiLabel;
    private readonly _labelRestTimeToBoot!  : IUiLabel;
    private readonly _labelWarType!         : IUiLabel;
    private readonly _labelName!            : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TimeTick,                    callback: this._onNotifyTimeTick },
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

        const warSettings   = await getWarSettings(warId);
        const labelName     = this._labelName;
        const labelWarType  = this._labelWarType;
        labelName.setText(``);
        labelWarType.setText(``);
        if (warSettings != null) {
            labelWarType.setText(getWarTypeName(getWarTypeByMpwWarSettings(warSettings)) ?? UndefinedError);

            const warName = (warSettings.getSettingsForCcw()?.getWarName() ?? warSettings.getSettingsForMcw()?.getWarName() ?? warSettings.getSettingsForMfw()?.getWarName())?.trim();
            if (warName) {
                labelName.setText(warName);
            } else {
                const normalMapId = getNormalMapIdForMpwWarSettings(warSettings);
                if (normalMapId != null) {
                    labelName.setText(await getMapNameInCurrentLanguage(normalMapId) || UndefinedError);
                } else {
                    labelName.setText(`(${getText(TextType.B0557)})`);
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

        this._imgRed.setIsVisible(await checkIsRedForMyWar(await getWarProgressInfo(warId)));
    }

    private async _updateLabelRestTimeToBoot(): Promise<void> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }

        const warSettings       = await getWarSettings(warId);
        const warProgressInfo   = await getWarProgressInfo(warId);
        const userId            = getSelfUserId();
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

        const playerIndexInTurn = getExisted(warProgressInfo.getPlayerIndexInTurn());
        if (warSettings.getPlayerInfoArray()?.find(v => v.getPlayerIndex() === playerIndexInTurn)?.getUserId() !== userId) {
            label.setText(`----------`);
            layout.arrangeItems();
            return;
        }

        const enterTurnTime     = warProgressInfo.getEnterTurnTime();
        const restTimeToBoot    = warProgressInfo.getPlayerInfoList().find(v => v.getPlayerIndex() === playerIndexInTurn)?.getRestTimeToBoot();
        const restTime          = (restTimeToBoot == null) || (enterTurnTime == null)
            ? null
            : Math.max(0, restTimeToBoot + enterTurnTime - getServerTimestamp());
        if (restTime == null) {
            label.setText(`----------`);
        } else {
            label.setText(getTimeDurationText2(restTime));
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400)
            );
        }
        layout.arrangeItems();
    }
}
