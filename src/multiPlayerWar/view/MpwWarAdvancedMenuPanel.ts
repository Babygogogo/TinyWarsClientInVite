import * as ActionPlannersConstants from "../../actionPlanners/Constants.ts";
import * as ActionPlannersStatesRequestingPlayerDeleteUnit from "../../actionPlanners/states/RequestingPlayerDeleteUnit.ts";
import * as ActionPlannersStatesRequestingPlayerSurrender from "../../actionPlanners/states/RequestingPlayerSurrender.ts";
import * as ActionPlannersStatesRequestingPlayerVoteForDraw from "../../actionPlanners/states/RequestingPlayerVoteForDraw.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../../mapEditor/model/MeProxy.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../interface/IMpwWar.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UsersProxy from "../../users/Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    war: MultiPlayerWarInterfaceIMpwWar.IMpwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _groupButtons!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnDeleteUnit!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUnitOpacity!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMapRating!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMarkGrid!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnFreeMode!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnEditMap!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnOverrideSkin!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCustomCounter!     : UiInterfacesIUiButton.IUiButton;

    private readonly _btnSetDraw!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSurrender!         : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: NotificationsTypeId.TypeId.UserSettingsOpacitySettingsChanged,  callback: this._onNotifyMsgUserSettingsOpacitySettingsChanged },
            { type: NotificationsTypeId.TypeId.MsgUserSetMapRating,                 callback: this._onNotifyMsgUserSetMapRating },
            { type: NotificationsTypeId.TypeId.MsgMeSubmitNormalMap,                callback: this._onNotifyMsgMeSubmitNormalMap },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnDeleteUnit,                              callback: this._onTouchedBtnDeleteUnit },
            { ui: this._btnFreeMode,                                callback: this._onTouchedBtnFreeMode },
            { ui: this._btnUnitOpacity,                             callback: this._onTouchedBtnUnitOpacity },
            { ui: this._btnMapRating,                               callback: this._onTouchedBtnMapRating },
            { ui: this._btnMarkGrid,                                callback: this._onTouchedBtnMarkGrid },
            { ui: this._btnEditMap,                                 callback: this._onTouchedBtnEditMap },
            { ui: this._btnOverrideSkin,                            callback: this._onTouchedBtnOverrideSkin },
            { ui: this._btnCustomCounter,                           callback: this._onTouchedBtnCustomCounter },

            { ui: this._btnSetDraw,                                 callback: this._onTouchedBtnSetDraw },
            { ui: this._btnSurrender,                               callback: this._onTouchedBtnSurrender },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for notify.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAndTileTextureVersionChanged(): void {
        this._updateView();
    }
    private _onNotifyMsgUserSettingsOpacitySettingsChanged(): void {
        this._updateBtnUnitOpacity();
    }

    private _onNotifyMsgUserSetMapRating(): void {
        this._updateBtnMapRating();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: VendorEgretEgret.Event): void {
        const slotIndex = (e.data as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS.S).getSlotIndex() ?? 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0872),
            callback    : async () => {
                const mapEditorData             = await MapEditorModelMeModel.getMapEditorData(slotIndex);
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (srcNormalMapIdForAddEvent == null) {
                    HelpersGameFlow.gotoMapEditorWar({
                        mapRawData                  : mapEditorData?.mapRawData,
                        slotIndex                   : slotIndex,
                        isReview                    : false,
                        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                        gridMarkData                : mapEditorData?.gridMarkData,
                    });
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent  : () => LangUtils.getText(LangConstants.TextType.R0015),
                        callback    : () => HelpersGameFlow.gotoMapEditorWar({
                            mapRawData                  : mapEditorData?.mapRawData,
                            slotIndex                   : slotIndex,
                            isReview                    : false,
                            srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                            gridMarkData                : mapEditorData?.gridMarkData,
                        }),
                    });
                }
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for ui.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnDeleteUnit(): void {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayerInTurn().getUserId() !== UsersModel.getSelfUserId()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0242));
            return;
        }

        const unitMap       = war.getUnitMap();
        const unit          = unitMap.getVisibleUnitOnMap(war.getCursor().getGridIndex());
        const playerIndex   = war.getPlayerIndexInTurn();
        if (!unit) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0027));
        } else if ((unit.getPlayerIndex() !== playerIndex) || (unit.getActionState() !== UnitsConstants.ActionStateId.Idle)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0028));
        } else if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0076));
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getTitle    : () => LangUtils.getText(LangConstants.TextType.B0081),
                getContent  : () => LangUtils.getText(LangConstants.TextType.A0029),
                callback    : () => ActionPlannersStatesRequestingPlayerDeleteUnit.RequestingPlayerDeleteUnit.getInstance().doApplyOnChooseAction(war.getActionPlanner()),
            });
        }
    }

    private _onTouchedBtnFreeMode(): void {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayerManager().getAliveOrDyingTeamsCount(false) < 2) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0199));
            return;
        }

        const warData   = war.serializeForCreateMfr();
        const errorCode = new (GameHelpersGhFactory.getTwWarClass())().getErrorCodeForInitForMfw(warData, war.getGcData());
        if (errorCode) {
            FloatText2.show(LangUtils.getErrorText(errorCode));
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => `${LangUtils.getText(LangConstants.TextType.R0007)}\n\n\n${LangUtils.getText(LangConstants.TextType.A0201)}`,
            callback: () => {
                HelpersGameFlow.gotoMfrCreateSettingsPanel(warData);
            }
        });
    }

    private _onTouchedBtnUnitOpacity(): void {
        UsersModel.reqTickSelfSettingsUnitOpacity();
    }

    private _onTouchedBtnMapRating(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const normalMapId   = HelpersMisc.getExisted(war.getNormalMapId());
        const minValue      = GameConfigGcMap.Constants.MinRating;
        const maxValue      = GameConfigGcMap.Constants.MaxRating;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0363),
            currentValue    : UsersModel.getMapRating(normalMapId) || 0,
            minValue,
            maxValue,
            getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0238),
            callback        : value => {
                UsersProxy.reqUserSetMapRating(normalMapId, value);
            },
        });
    }

    private _onTouchedBtnMarkGrid(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwMarkGridPanel, { war: war });
        this.closePanel();
    }

    private _onTouchedBtnEditMap(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex        : 0,
            needConfirmOverwrite    : true,
            needNonEmptySlot        : false,
            getHelpText             : null,
            callback                : async slotIndex => MapEditorModelMeProxy.reqMeSubmitNormalMap({
                slotIndex                   : slotIndex,
                mapRawData                  : await war.serializeForMap(),
                needReview                  : false,
                srcNormalMapIdForAddEvent   : null,
                gridMarkData                : null,
            }),
        });
    }

    private _onTouchedBtnOverrideSkin(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseOverridingSkinIdPanel, { war });
    }

    private _onTouchedBtnCustomCounter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwCustomCounterListPanel, { war });
    }

    private _onTouchedBtnSetDraw(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const playerIndex = war.getPlayerIndexLoggedIn();
        if (playerIndex == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const drawVoteManager = war.getDrawVoteManager();
        if ((!drawVoteManager.checkCanVote(playerIndex, true))  &&
            (!drawVoteManager.checkCanVote(playerIndex, false))
        ) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0240));
            return;
        }

        const actionPlanner = war.getActionPlanner();
        const state         = ActionPlannersStatesRequestingPlayerVoteForDraw.RequestingPlayerVoteForDraw.getInstance();
        if (!drawVoteManager.checkHasOngoingVote()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent  : () => LangUtils.getText(LangConstants.TextType.A0031),
                callback    : () => state.doApplyOnChooseAction(actionPlanner, playerIndex, true),
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0241),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0214),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0215),
                showButtonClose     : true,
                callback            : () => {
                    state.doApplyOnChooseAction(actionPlanner, playerIndex, true);
                    this.closePanel();
                },
                callbackOnCancel    : () => {
                    state.doApplyOnChooseAction(actionPlanner, playerIndex, false);
                    this.closePanel();
                },
            });
        }
    }

    private _onTouchedBtnSurrender(): void {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const player = war.getPlayerLoggedIn();
        if (player?.getAliveState() !== PlayersConstants.AliveStateId.Alive) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.YouCanNotDoThisRightNow));
            return;
        }

        // PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmInputPanel, {
        //     title       : Lang.getText(LangTextType.B0055),
        //     confirmText : `resign`,
        //     callback: () => {
        //         war.getActionPlanner().setStateRequestingPlayerSurrender(player.getPlayerIndex());
        //         this.closePanel();
        //     },
        // });
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0055),
            getContent         : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            showRedConfirm  : true,
            callback        : () => {
                ActionPlannersStatesRequestingPlayerSurrender.RequestingPlayerSurrender.getInstance().doApplyOnChooseAction(war.getActionPlanner(), player.getPlayerIndex());
                this.closePanel();
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupButtons();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0155);
        this._btnDeleteUnit.setLangText(LangConstants.TextType.B0081);
        this._btnFreeMode.setLangText(LangConstants.TextType.B1285);
        this._btnMarkGrid.setLangText(LangConstants.TextType.B1108);
        this._btnSurrender.setLangText(LangConstants.TextType.B0055);
        this._btnEditMap.setLangText(LangConstants.TextType.B0458);
        this._btnOverrideSkin.setLangText(LangConstants.TextType.B0609);
        this._btnCustomCounter.setLangText(LangConstants.TextType.B1143);
        this._updateBtnUnitOpacity();
        this._updateBtnMapRating();
        this._updateBtnSetDraw();
    }

    private _updateBtnUnitOpacity(): void {
        this._btnUnitOpacity.setText(`${LangUtils.getText(LangConstants.TextType.B0747)}: ${UsersModel.getSelfSettingsOpacitySettings()?.getUnitOpacity() ?? 100}%`);
    }

    private _updateBtnMapRating(): void {
        const btn   = this._btnMapRating;
        const normalMapId = this.getOpenData()?.war.getNormalMapId();
        if (normalMapId == null) {
            btn.setText(``);
        } else {
            btn.setText(`${LangUtils.getText(LangConstants.TextType.B0804)}: ${UsersModel.getMapRating(normalMapId) ?? `--`}`);
        }
    }

    private _updateGroupButtons(): void {
        const group = this._groupButtons;
        group.removeAllItems(false);

        group.addItem(this._btnFreeMode, false);
        group.addItem(this._btnOverrideSkin, false);
        group.addItem(this._btnDeleteUnit, false);
        group.addItem(this._btnUnitOpacity, false);
        group.addItem(this._btnEditMap, false);

        const war = this.getOpenData()?.war;
        if (war?.getPlayerLoggedIn() != null) {
            group.addItem(this._btnMarkGrid, false);
        }
        if (war?.getNormalMapId() != null) {
            group.addItem(this._btnMapRating, false);
        }
        if (war?.getWarEventManager().checkIsCustomCounterRelevant()) {
            group.addItem(this._btnCustomCounter, false);
        }
        group.arrangeItems();

        this._group.setUnscaledManualHeight(group.getScaledHeight() + 130);
    }

    private _updateBtnSetDraw(): void {
        this._btnSetDraw.setText(!this.getOpenData()?.war.getDrawVoteManager().checkHasOngoingVote()
            ? LangUtils.getText(LangConstants.TextType.B0690)
            : LangUtils.getText(LangConstants.TextType.B0841)
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _checkCanDoAction(): boolean {
        const war = this.getOpenData()?.war;
        return (war != null)
            && (war.checkIsHumanInTurn())
            && (war.getTurnManager().getPhaseCode() === TurnsConstants.PhaseCode.Main)
            && (war.getActionPlanner().getStateId() === ActionPlannersConstants.StateId.Idle);
    }
}
