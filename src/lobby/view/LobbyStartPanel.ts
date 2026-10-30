import { PhaseId } from "../../autoTourneys/Constants.ts";
import {
    getSinglePhaseInfoArrayForPhase,
    setIsNotifiedForRegistration,
    checkIsRedForRegistration,
    getLastTourneyId,
    getAtPhaseInfo,
} from "../../autoTourneys/mains/Provider.ts";
import { checkIsRed as checkAutoTourneysIsRed } from "../../autoTourneys/rooms/Provider.ts";
import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { checkHasUnreadMessage } from "../../chat/Model.ts";
import { checkIsRed as checkCcrModelIsRed } from "../../coopCustomRoom/model/CcrModel.ts";
import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    unloadAllWarsAndOpenCommonPanels,
    gotoMyWarListPanel,
} from "../../helpers/GameFlow.ts";
import {
    checkIsAnyPromiseTrue,
    getExisted,
} from "../../helpers/Misc.ts";
import { MouseStyleType } from "../../helpers/PointerInput.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import {
    checkIsRedForMultiPlayer,
    checkIsRedForGameSettings,
} from "../model/LobbyModel.ts";
import { checkIsRed as checkMcrModelIsRed } from "../../multiCustomRoom/model/McrModel.ts";
import { checkIsRed as checkMfrModelIsRed } from "../../multiFreeRoom/model/MfrModel.ts";
import { checkIsRed as checkMmrModelIsRed } from "../../multiMatchRoom/model/MmrModel.ts";
import { MultiPlayerRoomType } from "../../multiPlayerRooms/Constants.ts";
import {
    checkIsRedForMyMrwWars,
    checkIsRedForMyMcwWars,
    checkIsRedForMyMfwWars,
    checkIsRedForMyCcwWars,
    checkIsRedForMyMmwWars,
    checkIsRedForMyAtwWars,
} from "../../multiPlayerWar/model/MpwModel.ts";
import { checkIsRed as checkMrrModelIsRed } from "../../multiRankRoom/model/MrrModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfUserId } from "../../users/Model.ts";
import type { Event } from "../../egret/Egret.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";
import {
    getRequestedWarIdArray,
    checkIsRed as checkWwModelIsRed,
} from "../../watchWar/model/WwModel.ts";

// eslint-disable-next-line no-shadow
const enum CommandType {
    C0_SinglePlayer,
    C0_MultiPlayer,
    C0_MyProfile,
    C0_MapEditor,
    C0_GameChart,
    C0_GameSettings,
    C0_Chat,

    C1_Sp_Campaign,
    C1_Sp_WarRoom,
    C1_Sp_Sandbox,
    C1_Sp_Continue,

    C1_Mp_RankedMode,
    C1_Mp_MatchMode,
    C1_Mp_AutoTourneyMode,
    C1_Mp_CreateRoom,
    C1_Mp_JoinRoom,
    C1_Mp_MyRooms,
    C1_Mp_MyGames,
    C1_Mp_Replay,
    C1_Mp_Spectate,

    C2_Mp_RankedMode_SetGameNumber,
    C2_Mp_RankedMode_BanMap,
    C2_Mp_RankedMode_SetGameTimer,
    C2_Mp_RankedMode_PreviewMap,

    C2_Mp_MatchMode_SetGameNumber,
    C2_Mp_MatchMode_BanMap,
    C2_Mp_MatchMode_SetGameTimer,
    C2_Mp_MatchMode_PreviewMap,

    C2_Mp_AutoTourney_Registration,
    C2_Mp_AutoTourney_TourneyInfo,
    C2_Mp_AutoTourney_PreviewMap,

    C2_Mp_CreateRoom_Mcr,
    C2_Mp_CreateRoom_Ccr,

    C2_Mp_Spectate_MakeRequest,
    C2_Mp_Spectate_HandleRequest,
    C2_Mp_Spectate_DeleteSpectator,
    C2_Mp_Spectate_Continue,

    TODO,
}
const TweenTime     = 150;
const ItemHeight    = 40;
const ItemGap       = 6;
const ListMaxItems  = 9;
const ListMaxHeight = ItemHeight * ListMaxItems + ItemGap * (ListMaxItems - 1);

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _groupContainer!   : IUiContainer;

    private readonly _group0!           : IUiContainer;
    private readonly _listCommand0!     : IUiScrollList<DataForCommandRenderer>;

    private readonly _group1!           : IUiContainer;
    private readonly _listCommand1!     : IUiScrollList<DataForCommandRenderer>;

    private readonly _group2!           : IUiContainer;
    private readonly _listCommand2!     : IUiScrollList<DataForCommandRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._group,          callback: this._onTouchedGroup,  mouseStyle: MouseStyleType.Default },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        // this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listCommand0.setItemRendererClass(CommandRenderer);
        this._listCommand1.setItemRendererClass(CommandRenderer);
        this._listCommand2.setItemRendererClass(CommandRenderer);

        this._group.setUnscaledManualHeight(ListMaxHeight);
        this._groupContainer.setUnscaledManualHeight(ListMaxHeight);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._resetView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listCommand0.removeAllItems(),
            this._listCommand1.removeAllItems(),
            this._listCommand2.removeAllItems(),
        ]);

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroup(): void {
        playShortSfx(ShortSfxCode.ButtonCancel01);

        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _resetView(): Promise<void> {
        this._updateComponentsForLanguage();

        const dataArray0 = this._createDataForListCommand0();
        await this._listCommand0.bindData(dataArray0);

        const count0    = dataArray0.length;
        const group0    = this._group0;
        group0.setY(Math.max(0, ListMaxItems - count0) * (ItemHeight + ItemGap));
        group0.setUnscaledManualHeight(getValueInRange({
            minValue    : 0,
            maxValue    : ListMaxHeight,
            rawValue    : count0 * ItemHeight + (count0 - 1) * ItemGap,
        }));

        this._group1.setIsVisible(false);
        this._group2.setIsVisible(false);
    }

    private _updateComponentsForLanguage(): void {
        // nothing to do
    }

    private _createDataForListCommand0(): DataForCommandRenderer[] {
        return [
            {
                commandType     : CommandType.C0_SinglePlayer,
                isExpandVisible : true,
                callback        : async () => {
                    await this._listCommand1.bindData([
                        {
                            commandType     : CommandType.C1_Sp_Campaign,
                            isExpandVisible : false,
                            callback        : () => {
                                unloadAllWarsAndOpenCommonPanels();
                                openPanel(getDict().CampaignCreateCampaignsPanel, void 0);
                            },
                        },
                        {
                            commandType     : CommandType.C1_Sp_WarRoom,
                            isExpandVisible : false,
                            callback        : () => {
                                unloadAllWarsAndOpenCommonPanels();
                                openPanel(getDict().SrrCreateMapListPanel, {
                                    mapFilter               : null,
                                    mapSorter               : null,
                                    usePreviousFilter       : true,
                                    usePreviousPageIndex    : true,
                                });
                            },
                        },
                        {
                            commandType     : CommandType.C1_Sp_Sandbox,
                            isExpandVisible : false,
                            callback        : () => {
                                unloadAllWarsAndOpenCommonPanels();
                                openPanel(getDict().ScrCreateMapListPanel, {
                                    mapFilter               : null,
                                    mapSorter               : null,
                                    usePreviousFilter       : true,
                                    usePreviousPageIndex    : true,
                                });
                            },
                        },
                        {
                            commandType     : CommandType.C1_Sp_Continue,
                            isExpandVisible : false,
                            callback        : () => {
                                unloadAllWarsAndOpenCommonPanels();
                                openPanel(getDict().SpmWarListPanel, void 0);
                            },
                        },
                    ]);

                    this._showGroup1();
                    this._hideGroup2();
                },
            },
            {
                commandType     : CommandType.C0_MultiPlayer,
                isExpandVisible : true,
                callback        : async () => {
                    await this._listCommand1.bindData([
                        {
                            commandType     : CommandType.C1_Mp_RankedMode,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_SetGameNumber,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            openPanel(getDict().MrrSetMaxConcurrentCountPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_SetGameTimer,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            openPanel(getDict().MrrSetTimerPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_BanMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            openPanel(getDict().MrrBanMapPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_RankedMode_PreviewMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            unloadAllWarsAndOpenCommonPanels();
                                            openPanel(getDict().MrrPreviewMapListPanel, {
                                                hasFog: false,
                                            });
                                        },
                                    },
                                ]);
                                this._showGroup2();
                            },
                        },
                        {
                            commandType     : CommandType.C1_Mp_MatchMode,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_SetGameNumber,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            openPanel(getDict().MmrSetMaxConcurrentCountPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_SetGameTimer,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            openPanel(getDict().MmrSetTimerPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_BanMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            this.closePanel();
                                            openPanel(getDict().MmrBanMapPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_MatchMode_PreviewMap,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            unloadAllWarsAndOpenCommonPanels();
                                            openPanel(getDict().MmrPreviewMapListPanel, {
                                                hasFog: false,
                                            });
                                        },
                                    },
                                ]);
                                this._showGroup2();
                            },
                        },
                        {
                            commandType     : CommandType.C1_Mp_AutoTourneyMode,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_AutoTourney_Registration,
                                        isExpandVisible : false,
                                        callback        : async () => {
                                            const tourneyIdArray = (await getSinglePhaseInfoArrayForPhase(PhaseId.Registration))?.map(v => v.getTourneyId());
                                            if (tourneyIdArray.length <= 0) {
                                                showLang(TextType.A0403);
                                                return;
                                            }

                                            for (const tourneyId of tourneyIdArray) {
                                                setIsNotifiedForRegistration(tourneyId, true);
                                            }

                                            this.closePanel();
                                            openPanel(getDict().AtRegisterPanel, void 0);
                                        },
                                        checkIsRed      : () => checkIsRedForRegistration(),
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_AutoTourney_TourneyInfo,
                                        isExpandVisible : false,
                                        callback        : async () => {
                                            if ((await getLastTourneyId()) == null) {
                                                showLang(TextType.B0278);
                                                return;
                                            }

                                            this.closePanel();
                                            openPanel(getDict().AtTourneyInfoPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_AutoTourney_PreviewMap,
                                        isExpandVisible : false,
                                        callback        : async () => {
                                            const tourneyIdArray = (await getAtPhaseInfo())?.infoArray.map(v => v.getTourneyId()) ?? [];
                                            if (tourneyIdArray.length <= 0) {
                                                showLang(TextType.B0278);
                                                return;
                                            }

                                            unloadAllWarsAndOpenCommonPanels();
                                            openPanel(getDict().AtrPreviewMapListPanel, {
                                                tourneyId: Math.max(...tourneyIdArray),
                                            });
                                        },
                                    },
                                ]);
                                this._showGroup2();
                            },
                            checkIsRed      : () => checkIsRedForRegistration(),
                        },
                        {
                            commandType     : CommandType.C1_Mp_CreateRoom,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_CreateRoom_Mcr,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            unloadAllWarsAndOpenCommonPanels();
                                            openPanel(getDict().McrCreateMapListPanel, {
                                                mapFilter               : null,
                                                mapSorter               : null,
                                                usePreviousFilter       : true,
                                                usePreviousPageIndex    : true,
                                            });
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_CreateRoom_Ccr,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            unloadAllWarsAndOpenCommonPanels();
                                            openPanel(getDict().CcrCreateMapListPanel, {
                                                mapFilter               : null,
                                                mapSorter               : null,
                                                usePreviousFilter       : true,
                                                usePreviousPageIndex    : true,
                                            });
                                        },
                                    },
                                ]);

                                this._showGroup2();
                            },
                        },
                        {
                            commandType     : CommandType.C1_Mp_JoinRoom,
                            isExpandVisible : false,
                            callback        : () => {
                                unloadAllWarsAndOpenCommonPanels();
                                openPanel(getDict().MpwJoinRoomListPanel, {
                                    preferredRoomType   : MultiPlayerRoomType.Mcr,
                                    filter              : null
                                });
                            },
                        },
                        {
                            commandType     : CommandType.C1_Mp_MyRooms,
                            isExpandVisible : false,
                            callback        : () => {
                                unloadAllWarsAndOpenCommonPanels();
                                openPanel(getDict().MpwMyRoomListPanel, void 0);
                            },
                            checkIsRed      : () => checkIsAnyPromiseTrue([
                                checkMrrModelIsRed(),
                                checkMcrModelIsRed(),
                                checkMfrModelIsRed(),
                                checkCcrModelIsRed(),
                                checkMmrModelIsRed(),
                                checkAutoTourneysIsRed(),
                            ]),
                        },
                        {
                            commandType     : CommandType.C1_Mp_MyGames,
                            isExpandVisible : false,
                            callback        : () => {
                                unloadAllWarsAndOpenCommonPanels();
                                openPanel(getDict().MpwMyWarListPanel, void 0);
                            },
                            checkIsRed      : () => checkIsAnyPromiseTrue([
                                checkIsRedForMyMrwWars(),
                                checkIsRedForMyMcwWars(),
                                checkIsRedForMyMfwWars(),
                                checkIsRedForMyCcwWars(),
                                checkIsRedForMyMmwWars(),
                                checkIsRedForMyAtwWars(),
                            ]),
                        },
                        {
                            commandType     : CommandType.C1_Mp_Spectate,
                            isExpandVisible : true,
                            callback        : async () => {
                                await this._listCommand2.bindData([
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_MakeRequest,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            unloadAllWarsAndOpenCommonPanels();
                                            openPanel(getDict().WwMakeRequestWarsPanel, {
                                                filter: null
                                            });
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_HandleRequest,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            unloadAllWarsAndOpenCommonPanels();
                                            openPanel(getDict().WwHandleRequestWarsPanel, void 0);
                                        },
                                        checkIsRed      : async () => !!getRequestedWarIdArray()?.length,
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_DeleteSpectator,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            unloadAllWarsAndOpenCommonPanels();
                                            openPanel(getDict().WwDeleteWatcherWarsPanel, void 0);
                                        },
                                    },
                                    {
                                        commandType     : CommandType.C2_Mp_Spectate_Continue,
                                        isExpandVisible : false,
                                        callback        : () => {
                                            unloadAllWarsAndOpenCommonPanels();
                                            openPanel(getDict().WwOngoingWarsPanel, void 0);
                                        },
                                    },
                                ]);

                                this._showGroup2();
                            },
                            checkIsRed      : () => checkWwModelIsRed(),
                        },
                        {
                            commandType     : CommandType.C1_Mp_Replay,
                            isExpandVisible : false,
                            callback        : () => {
                                unloadAllWarsAndOpenCommonPanels();
                                openPanel(getDict().RwReplayListPanel, {
                                    filter                  : null,
                                    usePreviousFilter       : true,
                                    usePreviousPageIndex    : true,
                                });
                            },
                        },
                    ]);

                    this._showGroup1();
                    this._hideGroup2();
                },
                checkIsRed      : () => checkIsRedForMultiPlayer(true),
            },
            {
                commandType     : CommandType.C0_MapEditor,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    gotoMyWarListPanel(WarTypeId.Me);
                },
            },
            {
                commandType     : CommandType.C0_Chat,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({}) });
                },
                checkIsRed      : async () => checkHasUnreadMessage(),
            },
            {
                commandType     : CommandType.C0_MyProfile,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    openPanel(getDict().UserPanel, {
                        userId: getExisted(getSelfUserId()),
                    });
                },
            },
            {
                commandType     : CommandType.C0_GameChart,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    openPanel(getDict().CommonGameChartPanel, void 0);
                },
            },
            {
                commandType     : CommandType.C0_GameSettings,
                isExpandVisible : false,
                callback        : () => {
                    this.closePanel();
                    openPanel(getDict().UserSettingsPanel, void 0);
                },
                checkIsRed      : () => checkIsRedForGameSettings(),
            },
        ];
    }

    protected _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._imgMask,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        Executor.reset({
            obj         : this._groupContainer,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
        });

        return wait(TweenTime);
    }
    protected _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._imgMask,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._groupContainer,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });

        return wait(TweenTime);
    }
    private _showGroup1(): void {
        const list0     = this._listCommand0;
        const list1     = this._listCommand1;
        const index0    = list0.getFirstSelectedItemIndex() ?? 0;
        const length0   = list0.getBoundDataArray()?.length ?? 0;
        const length1   = list1.getBoundDataArray()?.length ?? 0;
        // const offset1   = Math.max(0, length0 - index0 - length1);
        const offset0   = Math.max(0, ListMaxItems - length0);
        const offset1   = Math.max(0, Math.min(offset0 + index0, ListMaxItems - length1));
        const group1    = this._group1;
        // group1.height   = Math.max(0, length1 * ItemHeight + (length1 - 1) * ItemGap);
        // group1.bottom   = offset1 * ItemHeight + offset1 * ItemGap;
        group1.setY(offset1 * (ItemHeight + ItemGap));
        group1.setUnscaledManualHeight(getValueInRange({
            minValue    : 0,
            maxValue    : ListMaxHeight - group1.getY(),
            rawValue    : length1 * ItemHeight + (length1 - 1) * ItemGap,
        }));
        list1.setSelectedItemIndex(-1);

        Executor.removeTweens(group1);
        Executor.get(group1)
            .set({ customVisible: true, customX: 150, customAlpha: 0 })
            .to({ customX: 190, customAlpha: 1 }, TweenTime);
    }
    // private _hideGroup1(): void {
    //     const group1    = this._group1;
    //     group1.visible  = false;
    //     AuxiliaryHelpers.Tween.removeTweens(group1);
    // }
    private _showGroup2(): void {
        const list0     = this._listCommand0;
        const list1     = this._listCommand1;
        const list2     = this._listCommand2;
        const index0    = list0.getFirstSelectedItemIndex() ?? 0;
        const length0   = list0.getBoundDataArray()?.length ?? 0;
        const index1    = list1.getFirstSelectedItemIndex() ?? 0;
        const length1   = list1.getBoundDataArray()?.length ?? 0;
        const length2   = list2.getBoundDataArray()?.length ?? 0;
        // const offset1   = Math.max(0, length0 - index0 - length1);
        // const offset2   = Math.max(0, offset1 + length1 - index1 - length2);
        const offset0   = Math.max(0, ListMaxItems - length0);
        const offset1   = Math.max(0, Math.min(offset0 + index0, ListMaxItems - length1));
        const offset2   = Math.max(0, Math.min(offset1 + index1, ListMaxItems - length2));
        const group2    = this._group2;
        // group2.height   = Math.max(0, length2 * ItemHeight + (length2 - 1) * ItemGap);
        // group2.bottom   = offset2 * ItemHeight + offset2 * ItemGap;
        group2.setY(offset2 * (ItemHeight + ItemGap));
        group2.setUnscaledManualHeight(getValueInRange({
            minValue    : 0,
            maxValue    : ListMaxHeight - group2.getY(),
            rawValue    : length2 * ItemHeight + (length2 - 1) * ItemGap,
        }));
        list2.setSelectedItemIndex(-1);

        Executor.removeTweens(group2);
        Executor.get(group2)
            .set({ customVisible: true, customX: 340, customAlpha: 0 })
            .to({ customX: 380, customAlpha: 1 }, TweenTime);
    }
    private _hideGroup2(): void {
        const group2 = this._group2;
        group2.setIsVisible(false);
        Executor.removeTweens(group2);
    }
}

interface DataForCommandRenderer extends UiListItemData {
    commandType     : CommandType;
    isExpandVisible : boolean;
    callback        : () => void;
    checkIsRed?     : () => Promise<boolean>;
}
class CommandRenderer extends UiListItemRenderer<DataForCommandRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgSelected!      : IUiImage;
    private readonly _imgExpand!        : IUiImage;
    private readonly _imgRed!           : IUiImage;
    private readonly _labelName!        : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this,         callback: this._onTouchedSelf },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateLabelName();
    }

    private _onTouchedSelf(e: Event): void {
        e.stopPropagation();

        this.getOpenData()?.callback();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._imgExpand.setIsVisible(!!this.getOpenData()?.isExpandVisible);
        this._updateImgRed();
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const commandType = this.getOpenData()?.commandType;
        if (commandType == null) {
            return;
        }

        this._labelName.setText(getCommandName(commandType) ?? UndefinedError);
    }

    private async _updateImgRed(): Promise<void> {
        const func  = this.getOpenData()?.checkIsRed;
        const img   = this._imgRed;
        if (!func) {
            img.setIsVisible(false);
        } else {
            const isRed = await func();
            if (func === this.getOpenData()?.checkIsRed) {
                img.setIsVisible(isRed);
            }
        }
    }
}

function getCommandName(commandType: CommandType): string | null {
    switch (commandType) {
        case CommandType.C0_SinglePlayer                : return getText(TextType.B0138);
        case CommandType.C0_MultiPlayer                 : return getText(TextType.B0137);
        case CommandType.C0_MyProfile                   : return getText(TextType.B0169);
        case CommandType.C0_Chat                        : return getText(TextType.B0383);
        case CommandType.C0_GameChart                   : return getText(TextType.B0900);
        case CommandType.C0_GameSettings                : return getText(TextType.B0604);
        case CommandType.C0_MapEditor                   : return getText(TextType.B0271);
        case CommandType.C1_Sp_Campaign                 : return getText(TextType.B1135);
        case CommandType.C1_Sp_Continue                 : return getText(TextType.B0024);
        case CommandType.C1_Sp_Sandbox                  : return getText(TextType.B1262);
        case CommandType.C1_Sp_WarRoom                  : return getText(TextType.B0614);
        case CommandType.C1_Mp_AutoTourneyMode          : return getText(TextType.B1022);
        case CommandType.C1_Mp_MatchMode                : return getText(TextType.B1012);
        case CommandType.C1_Mp_RankedMode               : return getText(TextType.B0404);
        case CommandType.C1_Mp_CreateRoom               : return getText(TextType.B0000);
        case CommandType.C1_Mp_JoinRoom                 : return getText(TextType.B0580);
        case CommandType.C1_Mp_MyRooms                  : return getText(TextType.B0410);
        case CommandType.C1_Mp_MyGames                  : return getText(TextType.B1283);
        case CommandType.C1_Mp_Replay                   : return getText(TextType.B0710);
        case CommandType.C1_Mp_Spectate                 : return getText(TextType.B0872);
        case CommandType.C2_Mp_CreateRoom_Ccr           : return getText(TextType.B0646);
        case CommandType.C2_Mp_CreateRoom_Mcr           : return getText(TextType.B1011);
        case CommandType.C2_Mp_Spectate_Continue        : return getText(TextType.B0222);
        case CommandType.C2_Mp_Spectate_DeleteSpectator : return getText(TextType.B0219);
        case CommandType.C2_Mp_Spectate_HandleRequest   : return getText(TextType.B0208);
        case CommandType.C2_Mp_Spectate_MakeRequest     : return getText(TextType.B0207);
        case CommandType.C2_Mp_RankedMode_BanMap        : return getText(TextType.B0084);
        case CommandType.C2_Mp_RankedMode_PreviewMap    : return getText(TextType.B0594);
        case CommandType.C2_Mp_RankedMode_SetGameNumber : return getText(TextType.B0413);
        case CommandType.C2_Mp_RankedMode_SetGameTimer  : return getText(TextType.B1284);
        case CommandType.C2_Mp_MatchMode_BanMap         : return getText(TextType.B0084);
        case CommandType.C2_Mp_MatchMode_PreviewMap     : return getText(TextType.B0594);
        case CommandType.C2_Mp_MatchMode_SetGameNumber  : return getText(TextType.B0413);
        case CommandType.C2_Mp_MatchMode_SetGameTimer   : return getText(TextType.B1284);
        case CommandType.C2_Mp_AutoTourney_PreviewMap   : return getText(TextType.B0594);
        case CommandType.C2_Mp_AutoTourney_Registration : return getText(TextType.B1025);
        case CommandType.C2_Mp_AutoTourney_TourneyInfo  : return getText(TextType.B0423);
        case CommandType.TODO                           : return `TODO`;
        default                                         : return null;
    }
}
