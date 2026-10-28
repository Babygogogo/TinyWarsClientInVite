import type { PlayerInfo } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
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
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getGameModeIdByWarData } from "../../gameModes/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { gotoSinglePlayerWar } from "../../helpers/GameFlow.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getNormalMapId, getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getTimestampShortText, getWarTypeName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { AliveStateId } from "../../players/Constants.ts";
import { Common as SinglePlayerWarConstants } from "../../singlePlayerWars/Constants.ts";
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
import { getPlayerRule, getPlayersCountUnneutral } from "../../warRules/utils/CommonData.ts";
import { BasicSettingsTypeId } from "../../wars/Constants.ts";
import { getEmptySlotIndexArray, getSlotFullData, getSlotName } from "../model/SpmModel.ts";

type OpenDataForCommonWarMapInfoPage            = CommonViewCommonWarMapInfoPageOpenData;
type OpenDataForCommonWarPlayerInfoPage         = CommonViewCommonWarPlayerInfoPageOpenData;
type OpenDataForCommonWarAdvancedSettingsPage   = CommonViewCommonWarAdvancedSettingsPageOpenData;
type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPageOpenData;

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTab!             : IUiContainer;
    private readonly _tabSettings!          : IUiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

    private readonly _groupNavigator!       : IUiLayout;
    private readonly _labelSinglePlayer!    : IUiLabel;
    private readonly _labelContinue!        : IUiLabel;
    private readonly _labelChooseWar!       : IUiLabel;

    private readonly _btnBack!              : IUiButton;
    private readonly _btnNextStep!          : IUiButton;

    private readonly _groupWarList!         : IUiContainer;
    private readonly _listWar!              : IUiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar!           : IUiLabel;
    private readonly _labelLoading!         : IUiLabel;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : TypeId.MsgSpmGetWarSaveSlotIndexArray,      callback : this._onNotifyMsgSpmGetWarSaveSlotIndexArray },
        ]);
        this._setUiListenerArray([
            { ui : this._btnBack,        callback : this._onTouchedBtnBack },
            { ui : this._btnNextStep,    callback : this._onTouchedBtnNextStep },
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
        this._updateAllPagesForTabSettings();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupWarList();
        this._updateComponentsForPreviewingWarInfo();
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await Promise.all([
            this._tabSettings.clear(),
            this._listWar.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public setAndReviseSelectedSlotIndex(newSlotIndex: number, needScroll: boolean): void {
        const listWar   = this._listWar;
        const index     = listWar.getRevisedFirstIndex(v => v?.slotIndex === newSlotIndex);
        listWar.setSelectedItemIndex(index);
        this._updateComponentsForPreviewingWarInfo();

        if (needScroll) {
            listWar.scrollToItem(index);
        }
    }
    private _getSelectedSlotIndex(): number | null {
        return this._listWar.getFirstSelectedData()?.slotIndex ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgSpmGetWarSaveSlotIndexArray(): void {
        this._updateGroupWarList();
        this._updateComponentsForPreviewingWarInfo();
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().SpmMainMenuPanel, void 0);
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await getSlotFullData(slotIndex);
        if (slotData != null) {
            gotoSinglePlayerWar({
                slotIndex     : slotData.slotIndex,
                warData       : slotData.warData,
                slotExtraData : slotData.extraData,
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
                tabItemData : { name : getText(TextType.B0298) },
                pageClass   : CommonViewCommonWarMapInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name : getText(TextType.B0224) },
                pageClass   : CommonViewCommonWarPlayerInfoPage,
                pageData    : null,
            },
            {
                tabItemData : { name : getText(TextType.B0002) },
                pageClass   : CommonViewCommonWarBasicSettingsPage,
                pageData    : null,
            },
            {
                tabItemData : { name : getText(TextType.B0003) },
                pageClass   : Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonWarMapInfoPage(),
            this._updateCommonWarPlayerInfoPage(),
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(TextType.A0040);
        this._labelSinglePlayer.setLangText(TextType.B0138);
        this._labelContinue.setLangText(TextType.B0024);
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
        labelLoading.setIsVisible(true);
        labelNoWar.setIsVisible(false);
        await listWar.removeAllItems();

        const dataArray = await this._createDataForListWar();
        labelLoading.setIsVisible(false);
        labelNoWar.setIsVisible(!dataArray.length);
        await listWar.bindData(dataArray);
        this.setAndReviseSelectedSlotIndex(dataArray[0]?.slotIndex ?? 0, true);
    }

    private async _updateComponentsForPreviewingWarInfo(): Promise<void> {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        const slotIndex     = this._getSelectedSlotIndex();
        if (slotIndex == null) {
            groupTab.setIsVisible(false);
            btnNextStep.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);
            btnNextStep.setIsVisible(true);

            await this._updateAllPagesForTabSettings();
        }
    }

    private async _updateCommonWarMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
        }
    }

    private async _updateCommonWarPlayerInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
        }
    }

    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
        }
    }

    private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }

    private async _createDataForListWar(): Promise<DataForWarRenderer[]> {
        const emptySlotIndexArray   = await getEmptySlotIndexArray();
        const dataArray             : DataForWarRenderer[] = [];
        for (let slotIndex = 0; slotIndex < SinglePlayerWarConstants.MaxSaveSlotCount; ++slotIndex) {
            if (emptySlotIndexArray.indexOf(slotIndex) < 0) {
                dataArray.push({
                    slotIndex : slotIndex,
                    panel     : this,
                });
            }
        }

        return dataArray;
    }

    private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
        const slotIndex = this._getSelectedSlotIndex();
        const warData   = slotIndex == null ? null : (await getSlotFullData(slotIndex))?.warData;
        return warData == null
            ? null
            : {
                warInfo : {
                    warData            : warData,
                    showInitialWarData : true,
                    overridingPlayers  : warData.getPlayerManager()?.getPlayers(),
                },
            };
    }

    private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await getSlotFullData(slotIndex);
        const warData   = slotData?.warData;
        if (warData == null) {
            return null;
        }

        const settingsForCommon = getExisted(warData.getSettingsForCommon());
        const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
        const warRuleCommonData = getExisted(instanceWarRule.getWarRuleCommonData());
        const playerInfoArray   : PlayerInfo[] = [];
        for (const playerInfo of getExisted(warData.getPlayerManager()?.getPlayers())) {
            const playerIndex   = playerInfo.getPlayerIndex();
            const userId        = playerInfo.getUserId() ?? null;
            playerInfoArray.push({
                playerIndex       : playerIndex,
                teamIndex         : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
                isAi              : userId == null,
                userId            : userId,
                coId              : playerInfo.getCoId(),
                unitAndTileSkinId : playerInfo.getUnitAndTileSkinId(),
                isReady           : null,
                isInTurn          : null,
                isDefeat          : playerInfo.getAliveState() === AliveStateId.Dead,
                restTimeToBoot    : playerInfo.getRestTimeToBoot(),
            });
        }

        return {
            gameConfig             : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
            playersCountUnneutral  : getPlayersCountUnneutral(warRuleCommonData),
            roomOwnerPlayerIndex   : null,
            callbackOnDeletePlayer : null,
            callbackOnExitRoom     : null,
            callbackOnAddDummy     : null,
            callbackOnChangeDummy  : null,
            playerInfoArray        : playerInfoArray,
            enterTurnTime          : null,
            isReplay               : false,
        };
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await getSlotFullData(slotIndex);
        const warData   = slotData?.warData;
        if (warData == null) {
            return { dataArrayForListSettings : [] };
        }

        const settingsForCommon = getExisted(warData.getSettingsForCommon());
        const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
        const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
        const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
        const normalMapId       = getNormalMapId(warData);
        return {
            dataArrayForListSettings : [
                {
                    settingsType     : BasicSettingsTypeId.NormalMapId,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : normalMapId,
                    callbackOnModify : null,
                },
                {
                    settingsType     : BasicSettingsTypeId.SpmSaveSlotIndex,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : slotIndex,
                    callbackOnModify : null,
                },
                {
                    settingsType     : BasicSettingsTypeId.SpmSaveSlotComment,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : slotData?.extraData?.getSlotComment() ?? null,
                    callbackOnModify : null,
                },
                {
                    settingsType     : BasicSettingsTypeId.WarRuleTitle,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : null,
                    callbackOnModify : null,
                },
                {
                    settingsType     : BasicSettingsTypeId.HasFog,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue     : null,
                    callbackOnModify : null,
                },
                {
                    settingsType     : BasicSettingsTypeId.Weather,
                    currentValue     : null,
                    instanceWarRule,
                    warEventFullData,
                    gameConfig,
                    callbackOnModify : null,
                },
                {
                    settingsType     : BasicSettingsTypeId.TileTheme,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gameConfig,
                    warEventFullData : warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : BasicSettingsTypeId.WarEvent,
                    currentValue     : null,
                    instanceWarRule,
                    warEventFullData,
                    gameConfig,
                    callbackOnModify : null,
                },
            ]
        };
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        const slotIndex = this._getSelectedSlotIndex();
        const slotData  = slotIndex == null ? null : await getSlotFullData(slotIndex);
        const warData   = slotData?.warData;
        if (warData == null) {
            return null;
        }

        const settingsForCommon = getExisted(warData.getSettingsForCommon());
        return {
            canModify       : false,
            gcData          : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
            instanceWarRule : getExisted(settingsForCommon.getInstanceWarRule()),
            gameModeId      : getExisted(getGameModeIdByWarData(warData)),
        };
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Executor.reset({
            obj        : this._groupWarList,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Executor.reset({
            obj        : this._btnNextStep,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 0, },
            endProps   : { customAlpha : 1, },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Executor.reset({
            obj        : this._groupWarList,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Executor.reset({
            obj        : this._btnNextStep,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 1, },
            endProps   : { customAlpha : 0, },
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
    slotIndex   : number;
    panel       : Panel;
}
class WarRenderer
    extends     UiListItemRenderer<DataForWarRenderer>
    implements  IUiListItemRenderer<DataForWarRenderer> {
    private readonly _layoutName!       : IUiLayout;
    private readonly _labelType!        : IUiLabel;
    private readonly _labelTimestamp!   : IUiLabel;
    private readonly _labelName!        : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private async _updateView(): Promise<void> {
        const slotIndex = this.getOpenData()?.slotIndex;
        if (slotIndex == null) {
            return;
        }

        const slotData = await getSlotFullData(slotIndex);
        if (slotIndex !== this.getOpenData()?.slotIndex) {
            return;
        }

        const labelType         = this._labelType;
        const labelName         = this._labelName;
        const labelTimestamp    = this._labelTimestamp;
        if (!slotData) {
            labelType.setText(`#${slotIndex}`);
            labelTimestamp.setText(``);
            labelName.setText(`----`);

        } else {
            const warData = slotData.warData;
            labelType.setText(`#${slotIndex} ${getWarTypeName(getWarTypeId(warData))}`);

            const slotExtraData = slotData.extraData;
            const timestamp     = slotExtraData.getTimestamp();
            labelTimestamp.setText(timestamp == null ? `` : getTimestampShortText(timestamp));

            const slotName = await getSlotName(slotIndex);
            if (slotIndex === this.getOpenData()?.slotIndex) {
                labelName.setText(slotName);
            }
        }

        this._layoutName.arrangeItems();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedSlotIndex(openData.slotIndex, false);
    }
}
