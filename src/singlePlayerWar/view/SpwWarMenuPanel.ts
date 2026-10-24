import * as ActionPlannersConstants from "../../actionPlanners/Constants.ts";
import * as CampaignsMainsGateway from "../../campaigns/mains/Gateway.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as SinglePlayerModeModelSpmModel from "../../singlePlayerMode/model/SpmModel.ts";
import * as SinglePlayerModeModelSpmProxy from "../../singlePlayerMode/model/SpmProxy.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../interface/ISpwWar.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export interface OpenData {
    war     : SinglePlayerWarInterfaceISpwWar.ISpwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSettings!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDamageCalculator!  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupMainButton!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnSaveGame!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnLoadGame!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdvanced!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnTaskObjective!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMapSimpleDialogue! : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSimulation!        : UiInterfacesIUiButton.IUiButton;

    private readonly _btnGotoMpw!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnGotoWarList!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnGotoLobby!         : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTaskObjectivePanel, {
            war : war,
        });
        this.closePanel();
    }

    private _onTouchedBtnDamageCalculator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDamageCalculatorPanel, {
            war                     : war,
            needReviseWeaponType    : true,
            data                    : null,
        });
        this.closePanel();
    }

    private _onTouchedBtnSettings(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSettingsPanel, void 0);
    }

    private _onTouchedBtnMapSimpleDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getWarEventManager().getCalledDialogueActionIdArray().length) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().BwMapSimpleDialogueListPanel, {
                war     : war,
            });
            this.closePanel();

        } else {
            const dialogueArray = war.getInstanceWarRule().getMapSimpleDialogueArray();
            if (dialogueArray.length <= 0) {
                FloatText2.showLang(LangConstants.TextType.B0278);

            } else if (dialogueArray.length === 1) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().BwMapSimpleDialoguePanel, {
                    war             : war,
                    dialogueData    : dialogueArray[0],
                    callbackOnClose : () => {
                        // nothing to do
                    },
                });
                this.closePanel();

            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().BwMapSimpleDialogueListPanel, {
                    war     : war,
                });
                this.closePanel();
            }
        }
    }

    private async _onTouchedBtnSaveGame(): Promise<void> {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getSaveSlotIndex() == null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
                currentSlotIndex        : await SinglePlayerModeModelSpmModel.getAvailableSlotIndex(),
                needComment             : true,
                needConfirmOverwrite    : true,
                callback                : (slotIndex, comment) => {
                    const saveSlotExtraData = war.getSaveSlotExtraData();
                    SinglePlayerModeModelSpmProxy.reqSpmCreateSfw({
                        slotIndex       : slotIndex,
                        slotExtraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.fromJson({
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0071),
            callback: () => {
                const warType = war.getWarType();
                if ((warType === WarTypesConstants.WarTypeId.ScwFog) || (warType === WarTypesConstants.WarTypeId.ScwStd)) {
                    SinglePlayerModeModelSpmProxy.reqSpmSaveScw(war);
                } else if ((warType === WarTypesConstants.WarTypeId.SfwFog) || (warType === WarTypesConstants.WarTypeId.SfwStd)) {
                    SinglePlayerModeModelSpmProxy.reqSpmSaveSfw(war);
                } else if ((warType === WarTypesConstants.WarTypeId.SrwFog) || (warType === WarTypesConstants.WarTypeId.SrwStd)) {
                    SinglePlayerModeModelSpmProxy.reqSpmSaveSrw(war);
                } else if ((warType === WarTypesConstants.WarTypeId.CampFog) || (warType === WarTypesConstants.WarTypeId.CampStd)) {
                    CampaignsMainsGateway.reqCampaignSaveWar(war);
                } else {
                    throw HelpersMisc.newError(`Invalid warType: ${warType}`, UtilsClientErrorCode.ClientErrorCode.SpwWarMenuPanel_OnTOuchedBtnSaveGame_00);
                }
            },
        });
    }

    private _onTouchedBtnLoadGame(): void {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0072),
            callback    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
                currentSlotIndex        : this.getOpenData()?.war.getSaveSlotIndex() ?? 0,
                needComment             : false,
                needConfirmOverwrite    : false,
                needNonEmptyData        : true,
                callback                : async slotIndex => {
                    const slotInfo  = await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex);
                    if (slotInfo != null) {
                        HelpersGameFlow.gotoSinglePlayerWar({
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpwWarAdvancedMenuPanel, {
            war : war,
        });
        this.closePanel();
    }

    private async _onTouchedBtnSimulation(): Promise<void> {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0931),
            callback    : () => {
                const warData = war.serializeForCreateSfw();
                warData.createIfNotExistsSettingsForSfw();

                const saveSlotExtraData = war.getSaveSlotExtraData();
                HelpersGameFlow.gotoSinglePlayerWar({
                    warData         : warData,
                    slotIndex       : null,
                    slotExtraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.fromJson({
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const mpwWarId = this.getOpenData()?.war.getSaveSlotExtraData()?.getMpwWarId();
        if (mpwWarId == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0439));
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0711),
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: async () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                    title   : LangUtils.getText(LangConstants.TextType.B0088),
                    content : LangUtils.getText(LangConstants.TextType.A0040),
                });

                const warData = await MultiPlayerWarModelMpwModel.getOngoingWarData(mpwWarId);
                if (warData) {
                    HelpersGameFlow.gotoMultiPlayerWar(warData);
                } else {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                }

                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
            },
        });
    }

    private _onTouchedBtnGotoWarList(): void {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0652),
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => HelpersGameFlow.gotoMyWarListPanel(war.getWarType()),
        });
    }

    private _onTouchedBtnGotoLobby(): void {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0054),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0025),
            callback: () => HelpersGameFlow.gotoLobby(),
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
        this._labelTitle.setLangText(LangConstants.TextType.B0155);
        this._btnSaveGame.setLangText(LangConstants.TextType.B0260);
        this._btnLoadGame.setLangText(LangConstants.TextType.B0261);
        this._btnTaskObjective.setLangText(LangConstants.TextType.B1214);
        this._btnMapSimpleDialogue.setLangText(LangConstants.TextType.B1098);
        this._btnAdvanced.setLangText(LangConstants.TextType.B0080);
        this._btnSimulation.setLangText(LangConstants.TextType.B0325);
        this._btnGotoMpw.setLangText(LangConstants.TextType.B0711);
        this._btnGotoWarList.setLangText(LangConstants.TextType.B0652);
        this._btnGotoLobby.setLangText(LangConstants.TextType.B0054);
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
            && (war.getTurnManager().getPhaseCode() === TurnsConstants.PhaseCode.Main)
            && (war.getActionPlanner().getStateId() === ActionPlannersConstants.StateId.Idle);
    }
}
