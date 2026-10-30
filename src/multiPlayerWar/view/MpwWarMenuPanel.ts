import {
    MultiPlayerWar_Model_MpwModel,
    GamePanels_Manager,
    GamePanels_Dict,
    Lang_Utils,
    WatchWar_Model_WwModel,
    Helpers_GameFlow,
    Turns_Constants,
    MultiPlayerWar_Model_MpwProxy,
    FloatText,
    ActionPlanners_Constants,
    Wars_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type MultiPlayerWar_Interface_IMpwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";

export interface OpenData {
    war     : MultiPlayerWar_Interface_IMpwWar.IMpwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnDamageCalculator!  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSettings!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupMainButton!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnSync!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnReplay!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSpectate!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMapSimpleDialogue! : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdvanced!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSimulation!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnGotoWarList!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnGotoLobby!         : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgMpwWatchGetIncomingInfo,          callback: this._onNotifyMsgMpwWatchGetIncomingInfo },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnDamageCalculator,                        callback: this._onTouchedBtnDamageCalculator },
            { ui: this._btnSettings,                                callback: this._onTouchedBtnSettings, },

            { ui: this._btnMapSimpleDialogue,                       callback: this._onTouchedBtnMapSimpleDialogue },
            { ui: this._btnSync,                                    callback: this._onTouchedBtnSync },
            { ui: this._btnAdvanced,                                callback: this._onTouchedBtnAdvanced },
            { ui: this._btnReplay,                                  callback: this._onTouchedBtnReplay },
            { ui: this._btnSpectate,                                callback: this._onTouchedBtnSpectate },
            { ui: this._btnSimulation,                              callback: this._onTouchedBtnSimulation },

            { ui: this._btnGotoWarList,                             callback: this._onTouchedBtnGotoWarList },
            { ui: this._btnGotoLobby,                               callback: this._onTouchedBtnGotoLobby },
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
    private _onNotifyMsgMpwWatchGetIncomingInfo(): void {
        this._updateBtnSpectate();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for ui.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnDamageCalculator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDamageCalculatorPanel, {
            war                     : war,
            needReviseWeaponType    : true,
            data                    : null,
        });
        this.closePanel();
    }

    private _onTouchedBtnSettings(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSettingsPanel, void 0);
    }

    private _onTouchedBtnMapSimpleDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getWarEventManager().getCalledDialogueActionIdArray().length) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwMapSimpleDialogueListPanel, {
                war     : war,
            });
            this.closePanel();

        } else {
            const dialogueArray = war.getInstanceWarRule().getMapSimpleDialogueArray();
            if (dialogueArray.length <= 0) {
                FloatText.showLang(Lang_Constants.TextType.B0278);

            } else if (dialogueArray.length === 1) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwMapSimpleDialoguePanel, {
                    war             : war,
                    dialogueData    : dialogueArray[0],
                    callbackOnClose : () => {
                        // nothing to do
                    },
                });
                this.closePanel();

            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwMapSimpleDialogueListPanel, {
                    war     : war,
                });
                this.closePanel();
            }
        }
    }

    private _onTouchedBtnSync(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        MultiPlayerWar_Model_MpwProxy.reqMpwCommonSyncWar(
            war,
            war.getActionPlanner().checkIsStateRequesting()
                ? Wars_Constants.SyncRequestTypeId.PlayerForce
                : Wars_Constants.SyncRequestTypeId.PlayerRequest
        );
        this.closePanel();
    }

    private _onTouchedBtnAdvanced(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwWarAdvancedMenuPanel, { war: war });
    }

    private _onTouchedBtnReplay(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0249),
            callback: async () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                    title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                    content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
                });

                const warData = await MultiPlayerWar_Model_MpwModel.getHalfwayReplayData(war.getWarId() ?? 0);
                if (warData) {
                    Helpers_GameFlow.gotoHalfwayReplayWar(warData);
                } else {
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                }

                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
            },
        });
    }

    private _onTouchedBtnSpectate(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwSpectatePanel, { war });
    }

    private async _onTouchedBtnSimulation(): Promise<void> {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.A0931),
            callback    : () => {
                const warData = war.serializeForCreateSfw();
                warData.createIfNotExistsSettingsForSfw();

                const playerLoggedIn = war.getPlayerLoggedIn();
                Helpers_GameFlow.gotoSinglePlayerWar({
                    warData         : warData,
                    slotIndex       : null,
                    slotExtraData   : SpmWarSaveSlotExtraData.fromJson({
                        mpwWarId                : war.getWarId(),
                        overridingSkinIdArray   : [],
                        gridMarkData            : GridMarkData.fromJson({
                            gridIdAndMarkTypeIdList : playerLoggedIn?.getGridMarkList().map(v => v.toJson()) ?? [],
                            hiddenMarkTypeIdList    : playerLoggedIn?.getHiddenGridMarkTypeIdList() ?? [],
                        }).toJson(),
                    }),
                });
            }
        });
    }

    private _onTouchedBtnGotoWarList(): void {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0652),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                if (war?.getPlayerLoggedIn() != null) {
                    Helpers_GameFlow.gotoMyWarListPanel(war.getWarType());
                } else {
                    Helpers_GameFlow.gotoWatchWarListPanel();
                }
            },
        });
    }

    private _onTouchedBtnGotoLobby(): void {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0054),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0025),
            callback: () => Helpers_GameFlow.gotoLobby(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupMainButton();
        this._updateBtnSpectate();
        this._updateBtnGotoWarList();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0155);
        this._btnSync.setLangText(Lang_Constants.TextType.B0089);
        this._btnReplay.setLangText(Lang_Constants.TextType.B0710);
        this._btnAdvanced.setLangText(Lang_Constants.TextType.B0080);
        this._btnSpectate.setLangText(Lang_Constants.TextType.B0872);
        this._btnMapSimpleDialogue.setLangText(Lang_Constants.TextType.B1098);
        this._btnSimulation.setLangText(Lang_Constants.TextType.B0325);
        this._btnGotoWarList.setLangText(Lang_Constants.TextType.B0652);
        this._btnGotoLobby.setLangText(Lang_Constants.TextType.B0054);
    }

    private _updateGroupMainButton(): void {
        const group = this._groupMainButton;
        group.removeAllItems(false);

        group.addItem(this._btnSimulation, false);
        group.addItem(this._btnReplay, false);
        group.addItem(this._btnSpectate, false);
        group.addItem(this._btnSync, false);

        const war = this.getOpenData()?.war;
        if ((war?.getInstanceWarRule().getMapSimpleDialogueArray()?.length)          ||
            (war?.getWarEventManager().getCalledDialogueActionIdArray().length)
        ) {
            group.addItem(this._btnMapSimpleDialogue, false);
        }

        group.addItem(this._btnAdvanced, false);

        group.arrangeItems();
    }

    private async _updateBtnSpectate(): Promise<void> {
        const warId = this.getOpenData()?.war.getWarId();
        if (warId == null) {
            return;
        }

        const info = await WatchWar_Model_WwModel.getWatchIncomingInfo(warId);
        this._btnSpectate.setRedVisible(!!info?.getRequestSrcUserIdArray()?.length);
    }

    private async _updateBtnGotoWarList(): Promise<void> {
        this._btnGotoWarList.setRedVisible(await MultiPlayerWar_Model_MpwModel.checkIsRedForAllMyWars([this.getOpenData()?.war.getWarId() ?? 0]));
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
