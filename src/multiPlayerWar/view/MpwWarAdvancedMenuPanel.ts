import {
    type Notifications_Mapping,
    Maps_Constants,
    ActionPlanners_States_RequestingPlayerDeleteUnit,
    ActionPlanners_States_RequestingPlayerSurrender,
    ActionPlanners_States_RequestingPlayerVoteForDraw,
    FloatText,
    ActionPlanners_Constants,
    TestWar_Model_TwWar,
    Units_Constants,
    Players_Constants,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_Misc,
    MapEditor_Model_MeModel,
    Users_Model,
    Helpers_GameFlow,
    GamePanels_Manager,
    Turns_Constants,
    MapEditor_Model_MeProxy,
    Users_Proxy,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type MultiPlayerWar_Interface_IMpwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";


export interface OpenData {
    war: MultiPlayerWar_Interface_IMpwWar.IMpwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupButtons!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnDeleteUnit!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUnitOpacity!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMapRating!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMarkGrid!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnFreeMode!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnEditMap!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnOverrideSkin!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCustomCounter!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnSetDraw!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSurrender!         : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "UnitAndTileTextureVersionChanged",    callback : this._onNotifyUnitAndTileTextureVersionChanged },
            { type : "UserSettingsOpacitySettingsChanged",  callback : this._onNotifyMsgUserSettingsOpacitySettingsChanged },
            { type : "MsgUserSetMapRating",                 callback : this._onNotifyMsgUserSetMapRating },
            { type : "MsgMeSubmitNormalMap",                callback : this._onNotifyMsgMeSubmitNormalMap },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                   callback : this.closePanel },
            { ui : this._btnDeleteUnit,                              callback : this._onTouchedBtnDeleteUnit },
            { ui : this._btnFreeMode,                                callback : this._onTouchedBtnFreeMode },
            { ui : this._btnUnitOpacity,                             callback : this._onTouchedBtnUnitOpacity },
            { ui : this._btnMapRating,                               callback : this._onTouchedBtnMapRating },
            { ui : this._btnMarkGrid,                                callback : this._onTouchedBtnMarkGrid },
            { ui : this._btnEditMap,                                 callback : this._onTouchedBtnEditMap },
            { ui : this._btnOverrideSkin,                            callback : this._onTouchedBtnOverrideSkin },
            { ui : this._btnCustomCounter,                           callback : this._onTouchedBtnCustomCounter },

            { ui : this._btnSetDraw,                                 callback : this._onTouchedBtnSetDraw },
            { ui : this._btnSurrender,                               callback : this._onTouchedBtnSurrender },
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
    private _onNotifyMsgMeSubmitNormalMap(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMeSubmitNormalMap"]>): void {
        const slotIndex = ((Helpers_Misc.getExisted(e.data)).msg).getSlotIndex() ?? 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0872),
            callback   : async () => {
                const mapEditorData             = await MapEditor_Model_MeModel.getMapEditorData(slotIndex);
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (srcNormalMapIdForAddEvent == null) {
                    Helpers_GameFlow.gotoMapEditorWar({
                        mapRawData                : mapEditorData?.mapRawData,
                        slotIndex                 : slotIndex,
                        isReview                  : false,
                        srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                        gridMarkData              : mapEditorData?.gridMarkData,
                    });
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0015),
                        callback   : () => Helpers_GameFlow.gotoMapEditorWar({
                            mapRawData                : mapEditorData?.mapRawData,
                            slotIndex                 : slotIndex,
                            isReview                  : false,
                            srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                            gridMarkData              : mapEditorData?.gridMarkData,
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayerInTurn().getUserId() !== Users_Model.getSelfUserId()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0242));
            return;
        }

        const unitMap       = war.getUnitMap();
        const unit          = unitMap.getVisibleUnitOnMap(war.getCursor().getGridIndex());
        const playerIndex   = war.getPlayerIndexInTurn();
        if (!unit) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0027));
        } else if ((unit.getPlayerIndex() !== playerIndex) || (unit.getActionState() !== Units_Constants.ActionStateId.Idle)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0028));
        } else if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0076));
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0081),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0029),
                callback   : () => ActionPlanners_States_RequestingPlayerDeleteUnit.RequestingPlayerDeleteUnit.getInstance().doApplyOnChooseAction(war.getActionPlanner()),
            });
        }
    }

    private _onTouchedBtnFreeMode(): void {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayerManager().getAliveOrDyingTeamsCount(false) < 2) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0199));
            return;
        }

        const warData   = war.serializeForCreateMfr();
        const errorCode = new TestWar_Model_TwWar.TwWar().getErrorCodeForInitForMfw(warData, war.getGcData());
        if (errorCode) {
            FloatText.show(Lang_Utils.getErrorText(errorCode));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => `${Lang_Utils.getText(Lang_Constants.TextType.R0007)}\n\n\n${Lang_Utils.getText(Lang_Constants.TextType.A0201)}`,
            callback   : () => {
                Helpers_GameFlow.gotoMfrCreateSettingsPanel(warData);
            },
        });
    }

    private _onTouchedBtnUnitOpacity(): void {
        Users_Model.reqTickSelfSettingsUnitOpacity();
    }

    private _onTouchedBtnMapRating(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const normalMapId   = Helpers_Misc.getExisted(war.getNormalMapId());
        const minValue      = Maps_Constants.Common.MinRating;
        const maxValue      = Maps_Constants.Common.MaxRating;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0363),
            currentValue : Users_Model.getMapRating(normalMapId) || 0,
            minValue,
            maxValue,
            getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0238),
            callback     : value => {
                Users_Proxy.reqUserSetMapRating(normalMapId, value);
            },
        });
    }

    private _onTouchedBtnMarkGrid(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwMarkGridPanel, { war : war });
        this.closePanel();
    }

    private _onTouchedBtnEditMap(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex     : 0,
            needConfirmOverwrite : true,
            needNonEmptySlot     : false,
            getHelpText          : null,
            callback             : async slotIndex => MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                slotIndex                 : slotIndex,
                mapRawData                : await war.serializeForMap(),
                needReview                : false,
                srcNormalMapIdForAddEvent : null,
                gridMarkData              : null,
            }),
        });
    }

    private _onTouchedBtnOverrideSkin(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseOverridingSkinIdPanel, { war });
    }

    private _onTouchedBtnCustomCounter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwCustomCounterListPanel, { war });
    }

    private _onTouchedBtnSetDraw(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const playerIndex = war.getPlayerIndexLoggedIn();
        if (playerIndex == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const drawVoteManager = war.getDrawVoteManager();
        if ((!drawVoteManager.checkCanVote(playerIndex, true))  &&
            (!drawVoteManager.checkCanVote(playerIndex, false))
        ) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0240));
            return;
        }

        const actionPlanner = war.getActionPlanner();
        const state         = ActionPlanners_States_RequestingPlayerVoteForDraw.RequestingPlayerVoteForDraw.getInstance();
        if (!drawVoteManager.checkHasOngoingVote()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0031),
                callback   : () => state.doApplyOnChooseAction(actionPlanner, playerIndex, true),
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0241),
                getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0214),
                getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0215),
                showButtonClose   : true,
                callback          : () => {
                    state.doApplyOnChooseAction(actionPlanner, playerIndex, true);
                    this.closePanel();
                },
                callbackOnCancel : () => {
                    state.doApplyOnChooseAction(actionPlanner, playerIndex, false);
                    this.closePanel();
                },
            });
        }
    }

    private _onTouchedBtnSurrender(): void {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const player = war.getPlayerLoggedIn();
        if (player?.getAliveState() !== Players_Constants.AliveStateId.Alive) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.YouCanNotDoThisRightNow));
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle       : () => Lang_Utils.getText(Lang_Constants.TextType.B0055),
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            showRedConfirm : true,
            callback       : () => {
                ActionPlanners_States_RequestingPlayerSurrender.RequestingPlayerSurrender.getInstance().doApplyOnChooseAction(war.getActionPlanner(), player.getPlayerIndex());
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0155);
        this._btnDeleteUnit.setLangText(Lang_Constants.TextType.B0081);
        this._btnFreeMode.setLangText(Lang_Constants.TextType.B1285);
        this._btnMarkGrid.setLangText(Lang_Constants.TextType.B1108);
        this._btnSurrender.setLangText(Lang_Constants.TextType.B0055);
        this._btnEditMap.setLangText(Lang_Constants.TextType.B0458);
        this._btnOverrideSkin.setLangText(Lang_Constants.TextType.B0609);
        this._btnCustomCounter.setLangText(Lang_Constants.TextType.B1143);
        this._updateBtnUnitOpacity();
        this._updateBtnMapRating();
        this._updateBtnSetDraw();
    }

    private _updateBtnUnitOpacity(): void {
        this._btnUnitOpacity.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0747)}: ${Users_Model.getSelfSettingsOpacitySettings()?.getUnitOpacity() ?? 100}%`);
    }

    private _updateBtnMapRating(): void {
        const btn   = this._btnMapRating;
        const normalMapId = this.getOpenData()?.war.getNormalMapId();
        if (normalMapId == null) {
            btn.setText(``);
        } else {
            btn.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0804)}: ${Users_Model.getMapRating(normalMapId) ?? `--`}`);
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
        this._btnSetDraw.setLangText(!this.getOpenData()?.war.getDrawVoteManager().checkHasOngoingVote() ? Lang_Constants.TextType.B0690 : Lang_Constants.TextType.B0841);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _checkCanDoAction(): boolean {
        const war = this.getOpenData()?.war;
        return (war != null)
            && (war.checkIsHumanInTurn())
            && (war.getTurnManager().getPhaseCode() === Turns_Constants.PhaseCode.Main)
            && (war.getActionPlanner().getStateId() === ActionPlanners_Constants.StateId.Idle);
    }
}
