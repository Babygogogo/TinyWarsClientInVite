import {
    Utils_ClientErrorCode,
    GamePanels_Manager,
    SinglePlayerMode_Model_SpmModel,
    GamePanels_Dict,
    MultiPlayerWar_Model_MpwModel,
    Lang_Utils,
    Helpers_GameFlow,
    Helpers_Misc,
    Turns_Constants,
    Campaigns_Mains_Gateway,
    SinglePlayerMode_Model_SpmProxy,
    FloatText,
    ActionPlanners_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    WarTypes_Constants,
    type SinglePlayerWar_Interface_ISpwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";

export interface OpenData {
    war     : SinglePlayerWar_Interface_ISpwWar.ISpwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSettings!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDamageCalculator!  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupMainButton!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnSaveGame!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLoadGame!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdvanced!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnTaskObjective!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMapSimpleDialogue! : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSimulation!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnGotoMpw!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnGotoWarList!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnGotoLobby!         : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnDamageCalculator,                        callback: this._onTouchedBtnDamageCalculator },
            { ui: this._btnSettings,                                callback: this._onTouchedBtnSettings },
            { ui: this._btnClose,                                   callback: this.closePanel },

            { ui: this._btnTaskObjective,                           callback: this._onTouchedBtnTaskObjective },
            { ui: this._btnMapSimpleDialogue,                       callback: this._onTouchedBtnMapSimpleDialogue },
            { ui: this._btnSaveGame,                                callback: this._onTouchedBtnSaveGame },
            { ui: this._btnLoadGame,                                callback: this._onTouchedBtnLoadGame },
            { ui: this._btnAdvanced,                                callback: this._onTouchedBtnAdvanced },

            { ui: this._btnSimulation,                              callback: this._onTouchedBtnSimulation },

            { ui: this._btnGotoMpw,                                 callback: this._onTouchedBtnGotoMpWar },
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for ui.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnTaskObjective(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTaskObjectivePanel, {
            war : war,
        });
        this.closePanel();
    }

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

    private async _onTouchedBtnSaveGame(): Promise<void> {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getSaveSlotIndex() == null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
                currentSlotIndex        : await SinglePlayerMode_Model_SpmModel.getAvailableSlotIndex(),
                needComment             : true,
                needConfirmOverwrite    : true,
                callback                : (slotIndex, comment) => {
                    const saveSlotExtraData = war.getSaveSlotExtraData();
                    SinglePlayerMode_Model_SpmProxy.reqSpmCreateSfw({
                        slotIndex       : slotIndex,
                        slotExtraData   : SpmWarSaveSlotExtraData.fromJson({
                            slotComment             : comment,
                            mpwWarId                : saveSlotExtraData.getMpwWarId(),
                            overridingSkinIdArray   : [],
                            gridMarkData            : saveSlotExtraData.getGridMarkData()?.toJson(),
                        }),
                        warData         : war.serializeForCreateSfw(),
                    });
                }
            });
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0071),
            callback: () => {
                const warType = war.getWarType();
                if ((warType === WarTypes_Constants.WarTypeId.ScwFog) || (warType === WarTypes_Constants.WarTypeId.ScwStd)) {
                    SinglePlayerMode_Model_SpmProxy.reqSpmSaveScw(war);
                } else if ((warType === WarTypes_Constants.WarTypeId.SfwFog) || (warType === WarTypes_Constants.WarTypeId.SfwStd)) {
                    SinglePlayerMode_Model_SpmProxy.reqSpmSaveSfw(war);
                } else if ((warType === WarTypes_Constants.WarTypeId.SrwFog) || (warType === WarTypes_Constants.WarTypeId.SrwStd)) {
                    SinglePlayerMode_Model_SpmProxy.reqSpmSaveSrw(war);
                } else if ((warType === WarTypes_Constants.WarTypeId.CampFog) || (warType === WarTypes_Constants.WarTypeId.CampStd)) {
                    Campaigns_Mains_Gateway.reqCampaignSaveWar(war);
                } else {
                    throw Helpers_Misc.newError(`Invalid warType: ${warType}`, Utils_ClientErrorCode.ClientErrorCode.SpwWarMenuPanel_OnTOuchedBtnSaveGame_00);
                }
            },
        });
    }

    private _onTouchedBtnLoadGame(): void {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.A0072),
            callback    : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
                currentSlotIndex        : this.getOpenData()?.war.getSaveSlotIndex() ?? 0,
                needComment             : false,
                needConfirmOverwrite    : false,
                needNonEmptyData        : true,
                callback                : async slotIndex => {
                    const slotInfo  = await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex);
                    if (slotInfo != null) {
                        Helpers_GameFlow.gotoSinglePlayerWar({
                            slotIndex       : slotIndex,
                            warData         : slotInfo.warData,
                            slotExtraData   : slotInfo.extraData,
                        });
                    }
                }
            }),
        });
    }

    private _onTouchedBtnAdvanced(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpwWarAdvancedMenuPanel, {
            war : war,
        });
        this.closePanel();
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
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.A0931),
            callback    : () => {
                const warData = war.serializeForCreateSfw();
                warData.createIfNotExistsSettingsForSfw();

                const saveSlotExtraData = war.getSaveSlotExtraData();
                Helpers_GameFlow.gotoSinglePlayerWar({
                    warData         : warData,
                    slotIndex       : null,
                    slotExtraData   : SpmWarSaveSlotExtraData.fromJson({
                        mpwWarId                : saveSlotExtraData.getMpwWarId(),
                        overridingSkinIdArray   : [],
                        gridMarkData            : saveSlotExtraData.getGridMarkData()?.toJson(),
                    }),
                });
            }
        });
    }

    private _onTouchedBtnGotoMpWar(): void {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        const mpwWarId = this.getOpenData()?.war.getSaveSlotExtraData()?.getMpwWarId();
        if (mpwWarId == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0439));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0711),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback: async () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                    title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                    content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
                });

                const warData = await MultiPlayerWar_Model_MpwModel.getOngoingWarData(mpwWarId);
                if (warData) {
                    Helpers_GameFlow.gotoMultiPlayerWar(warData);
                } else {
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                }

                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
            },
        });
    }

    private _onTouchedBtnGotoWarList(): void {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0652),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback: () => Helpers_GameFlow.gotoMyWarListPanel(war.getWarType()),
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
        this._updateBtnGotoMpw();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0155);
        this._btnSaveGame.setLangText(Lang_Constants.TextType.B0260);
        this._btnLoadGame.setLangText(Lang_Constants.TextType.B0261);
        this._btnTaskObjective.setLangText(Lang_Constants.TextType.B1214);
        this._btnMapSimpleDialogue.setLangText(Lang_Constants.TextType.B1098);
        this._btnAdvanced.setLangText(Lang_Constants.TextType.B0080);
        this._btnSimulation.setLangText(Lang_Constants.TextType.B0325);
        this._btnGotoMpw.setLangText(Lang_Constants.TextType.B0711);
        this._btnGotoWarList.setLangText(Lang_Constants.TextType.B0652);
        this._btnGotoLobby.setLangText(Lang_Constants.TextType.B0054);
    }

    private _updateGroupMainButton(): void {
        const group = this._groupMainButton;
        group.removeAllItems(false);

        group.addItem(this._btnSaveGame, false);
        group.addItem(this._btnLoadGame, false);

        const war               = this.getOpenData()?.war;
        const instanceWarRule   = war?.getInstanceWarRule();
        if ((instanceWarRule?.getMapSimpleDialogueArray()?.length)                   ||
            (war?.getWarEventManager().getCalledDialogueActionIdArray().length)
        ) {
            group.addItem(this._btnMapSimpleDialogue, false);
        }
        if (instanceWarRule?.getTaskObjectiveFullData()?.getTaskObjectiveArray().length) {
            group.addItem(this._btnTaskObjective, false);
        }

        group.addItem(this._btnSimulation, false);
        group.addItem(this._btnAdvanced, false);

        group.arrangeItems();
    }

    private _updateBtnGotoMpw(): void {
        this._btnGotoMpw.setIsVisible(this.getOpenData()?.war.getSaveSlotExtraData()?.getMpwWarId() != null);
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
