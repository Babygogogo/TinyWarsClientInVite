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
import { show, showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getWarTypeName } from "../../lang/Utils.ts";
import { getWarSettings } from "../../multiPlayerWar/model/MpwModel.ts";
import { getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
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
import { getUserNickname } from "../../users/Model.ts";
import { getWarTypeByMpwWarSettings } from "../../warSettings/utils/MpwWarSettings.ts";
import {
    getWatchIncomingInfo,
    getRequestedWarIdArray,
    createDataForCommonWarMapInfoPage,
    createDataForCommonWarPlayerInfoPage,
    createDataForCommonWarBasicSettingsPage,
    createDataForCommonWarAdvancedSettingsPage,
} from "../model/WwModel.ts";
import { reqMpwWatchRequestedWarIdArray, reqWatchHandleRequest } from "../model/WwProxy.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, CommonViewCommonWarMapInfoPageOpenData | CommonViewCommonWarPlayerInfoPageOpenData | CommonViewCommonWarAdvancedSettingsPageOpenData | CommonViewCommonWarBasicSettingsPageOpenData>;

    private readonly _groupNavigator!       : IUiLayout;
    private readonly _labelWatchWar!        : IUiLabel;
    private readonly _labelHandleRequest!   : IUiLabel;
    private readonly _labelChooseWar!       : IUiLabel;

    private readonly _btnBack!              : IUiButton;
    private readonly _btnNextStep!          : IUiButton;

    private readonly _groupWarList!         : IUiContainer;
    private readonly _listWar!              : IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!           : IUiLabel;
    private readonly _labelLoading!         : IUiLabel;

    private _hasReceivedData    = false;
    private _isTabInitialized   = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onNotifyMsgMpwWatchGetRequestedWarIdArray },
            { type: TypeId.MsgMpwWatchHandleRequest,            callback: this._onNotifyMsgMpwWatchHandleRequest },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
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
        this._hasReceivedData = false;
        reqMpwWatchRequestedWarIdArray();

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

    public async setAndReviseSelectedWarId(warId: number, needScroll: boolean): Promise<void> {
        const listMap   = this._listWar;
        const index     = getExisted(listMap.getRevisedFirstIndex(v => v?.warId === warId));
        listMap.setSelectedItemIndex(index);
        if (needScroll) {
            listMap.scrollToItem(index);
        }

        this._updateBtnNextStep();
        await this._updateGroupTab();
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

    private _onNotifyMsgMpwWatchGetRequestedWarIdArray(): void {
        this._hasReceivedData = true;
        this._updateGroupWarList();
    }

    private _onNotifyMsgMpwWatchHandleRequest(): void {
        show(getText(TextType.OperationSucceeded));
        reqMpwWatchRequestedWarIdArray();
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
        openPanel(getDict().WwMainMenuPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const data = this._listWar.getFirstSelectedData();
        if (data == null) {
            return;
        }

        const warId                 = data.warId;
        const watchIncomingInfo     = await getWatchIncomingInfo(warId);
        const warPlayerInfoArray    = (await getWarSettings(warId))?.getPlayerInfoArray();
        if ((watchIncomingInfo == null) || (warPlayerInfoArray == null)) {
            showLang(TextType.A0300);
            return;
        }

        const requestSrcUserIdArray = watchIncomingInfo.getRequestSrcUserIdArray();
        if (!requestSrcUserIdArray.length) {
            showLang(TextType.A0300);
        } else {
            openPanel(getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray      : [],
                availableNumberArray    : requestSrcUserIdArray,
                showNumber              : true,
                columnsCount            : 3,
                getTitleText            : () => getText(TextType.B0208),
                getHelpText             : () => getText(TextType.A0859),
                getNumberMainText       : async userId => (await getUserNickname(userId)) ?? UndefinedError,
                getNumberMainTextColor  : userId => {
                    if (warPlayerInfoArray.some(v => (v.getUserId() ?? 0) === userId)) {
                        return ColorValue.Yellow;
                    }

                    const info = watchIncomingInfo.getSrcUserInfoArray().find(v => (v.getUserId() ?? 0) === userId);
                    return ((info?.getIsRequestingOthers()) || (info?.getIsWatchingOthers()))
                        ? ColorValue.Yellow
                        : ColorValue.White;
                },
                callbackOnHelp          : userId => openPanel(getDict().UserPanel, { userId }),
                callbackOnConfirm       : acceptUserIdArray => {
                    const acceptUserIdSet       = new Set(acceptUserIdArray);
                    const declineUserIdArray    = requestSrcUserIdArray.filter(v => !acceptUserIdSet.has(v));
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent : () => getFormattedText(TextType.F0082, acceptUserIdArray.length, declineUserIdArray.length),
                        callback: () => reqWatchHandleRequest(warId, acceptUserIdArray, declineUserIdArray),
                    });
                },
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
        this._labelLoading.setText(getText(TextType.A0040));
        this._labelWatchWar.setText(getText(TextType.B0206));
        this._labelHandleRequest.setText(getText(TextType.B0208));
        this._labelChooseWar.setText(getText(TextType.B0589));
        this._labelNoWar.setText(getText(TextType.B0209));
        this._btnBack.setText(getText(TextType.B0146));
        this._btnNextStep.setText(getText(TextType.B0566));

        this._groupNavigator.arrangeItems();
    }

    private async _updateGroupWarList(): Promise<void> {
        const labelLoading  = this._labelLoading;
        const labelNoWar    = this._labelNoWar;
        const listWar       = this._listWar;
        if (!this._hasReceivedData) {
            labelLoading.setIsVisible(true);
            labelNoWar.setIsVisible(false);
            await listWar.removeAllItems();
            await this.setAndReviseSelectedWarId(-1, true);

        } else {
            const dataArray = this._createDataForListWar();
            labelLoading.setIsVisible(false);
            labelNoWar.setIsVisible(!dataArray.length);
            await listWar.bindData(dataArray);
            await this.setAndReviseSelectedWarId(dataArray[0]?.warId ?? -1, true);
        }
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

            this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
            this._tabSettings.updatePageData(3, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private _updateBtnNextStep(): void {
        this._btnNextStep.setIsVisible((this._hasReceivedData) && (this._getSelectedWarId() != null));
    }

    private _createDataForListWar(): DataForWarRenderer[] {
        const dataArray: DataForWarRenderer[] = [];
        for (const info of getRequestedWarIdArray() || []) {
            dataArray.push({
                warId: info,
                panel   : this,
            });
        }

        return dataArray;
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<CommonViewCommonWarMapInfoPageOpenData> {
        return await createDataForCommonWarMapInfoPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<CommonViewCommonWarPlayerInfoPageOpenData> {
        return await createDataForCommonWarPlayerInfoPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<CommonViewCommonWarBasicSettingsPageOpenData> {
        return await createDataForCommonWarBasicSettingsPage(this._getSelectedWarId());
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<CommonViewCommonWarAdvancedSettingsPageOpenData> {
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
class WarRenderer
    extends     UiListItemRenderer<DataForWarRenderer>
    implements  IUiListItemRenderer<DataForWarRenderer>
{
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelType!    : IUiLabel;
    private readonly _labelId!      : IUiLabel;
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
        this._updateLabelIdAndType();
        this._updateLabelName();
    }

    private async _updateLabelIdAndType(): Promise<void> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }
        this._labelId.setText(`#${warId}`);

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
                    const normalMapId   = settingsForMcw.getNormalMapId() ?? 0;
                    labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);
                }

            } else if (settingsForCcw) {
                const warName = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    const normalMapId   = settingsForCcw.getNormalMapId() ?? 0;
                    labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);
                }

            } else if (settingsForMrw) {
                const normalMapId   = settingsForMrw.getNormalMapId() ?? 0;
                labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);

            } else if (settingsForMmw) {
                const normalMapId   = settingsForMmw.getNormalMapId() ?? 0;
                labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);

            } else if (settingsForAtw) {
                const normalMapId   = settingsForAtw.getNormalMapId() ?? 0;
                labelName.setText((normalMapId == null ? null : await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError);
            }
        }

        layoutName.arrangeItems();
    }
}
