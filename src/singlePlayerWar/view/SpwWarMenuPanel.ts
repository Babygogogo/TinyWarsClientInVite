import { StateId } from "../../actionPlanners/Constants.ts";
import { reqCampaignSaveWar } from "../../campaigns/mains/Gateway.ts";
import { showLang, show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { gotoSinglePlayerWar, gotoMultiPlayerWar, gotoMyWarListPanel, gotoLobby } from "../../helpers/GameFlow.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { getOngoingWarData } from "../../multiPlayerWar/model/MpwModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { getAvailableSlotIndex, getSlotFullData } from "../../singlePlayerMode/model/SpmModel.ts";
import { reqSpmCreateSfw, reqSpmSaveScw, reqSpmSaveSfw, reqSpmSaveSrw } from "../../singlePlayerMode/model/SpmProxy.ts";
import type { ISpwWar } from "../interface/ISpwWar.ts";
import { PhaseCode } from "../../turns/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export interface OpenData {
    war     : ISpwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;

    private readonly _btnClose!             : IUiButton;
    private readonly _btnSettings!          : IUiButton;
    private readonly _btnDamageCalculator!  : IUiButton;

    private readonly _groupMainButton!      : IUiLayout;
    private readonly _btnSaveGame!          : IUiButton;
    private readonly _btnLoadGame!          : IUiButton;
    private readonly _btnAdvanced!          : IUiButton;
    private readonly _btnTaskObjective!     : IUiButton;
    private readonly _btnMapSimpleDialogue! : IUiButton;
    private readonly _btnSimulation!        : IUiButton;

    private readonly _btnGotoMpw!           : IUiButton;
    private readonly _btnGotoWarList!       : IUiButton;
    private readonly _btnGotoLobby!         : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
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

        openPanel(getDict().BwTaskObjectivePanel, {
            war : war,
        });
        this.closePanel();
    }

    private _onTouchedBtnDamageCalculator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonDamageCalculatorPanel, {
            war                     : war,
            needReviseWeaponType    : true,
            data                    : null,
        });
        this.closePanel();
    }

    private _onTouchedBtnSettings(): void {
        openPanel(getDict().UserSettingsPanel, void 0);
    }

    private _onTouchedBtnMapSimpleDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getWarEventManager().getCalledDialogueActionIdArray().length) {
            openPanel(getDict().BwMapSimpleDialogueListPanel, {
                war     : war,
            });
            this.closePanel();

        } else {
            const dialogueArray = war.getInstanceWarRule().getMapSimpleDialogueArray();
            if (dialogueArray.length <= 0) {
                showLang(TextType.B0278);

            } else if (dialogueArray.length === 1) {
                openPanel(getDict().BwMapSimpleDialoguePanel, {
                    war             : war,
                    dialogueData    : dialogueArray[0],
                    callbackOnClose : () => {
                        // nothing to do
                    },
                });
                this.closePanel();

            } else {
                openPanel(getDict().BwMapSimpleDialogueListPanel, {
                    war     : war,
                });
                this.closePanel();
            }
        }
    }

    private async _onTouchedBtnSaveGame(): Promise<void> {
        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getSaveSlotIndex() == null) {
            openPanel(getDict().CommonChooseSingleSpmSaveSlotPanel, {
                currentSlotIndex        : await getAvailableSlotIndex(),
                needComment             : true,
                needConfirmOverwrite    : true,
                callback                : (slotIndex, comment) => {
                    const saveSlotExtraData = war.getSaveSlotExtraData();
                    reqSpmCreateSfw({
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

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0071),
            callback: () => {
                const warType = war.getWarType();
                if ((warType === WarTypeId.ScwFog) || (warType === WarTypeId.ScwStd)) {
                    reqSpmSaveScw(war);
                } else if ((warType === WarTypeId.SfwFog) || (warType === WarTypeId.SfwStd)) {
                    reqSpmSaveSfw(war);
                } else if ((warType === WarTypeId.SrwFog) || (warType === WarTypeId.SrwStd)) {
                    reqSpmSaveSrw(war);
                } else if ((warType === WarTypeId.CampFog) || (warType === WarTypeId.CampStd)) {
                    reqCampaignSaveWar(war);
                } else {
                    throw newError(`Invalid warType: ${warType}`, ClientErrorCode.SpwWarMenuPanel_OnTOuchedBtnSaveGame_00);
                }
            },
        });
    }

    private _onTouchedBtnLoadGame(): void {
        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.A0072),
            callback    : () => openPanel(getDict().CommonChooseSingleSpmSaveSlotPanel, {
                currentSlotIndex        : this.getOpenData()?.war.getSaveSlotIndex() ?? 0,
                needComment             : false,
                needConfirmOverwrite    : false,
                needNonEmptyData        : true,
                callback                : async slotIndex => {
                    const slotInfo  = await getSlotFullData(slotIndex);
                    if (slotInfo != null) {
                        gotoSinglePlayerWar({
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

        openPanel(getDict().SpwWarAdvancedMenuPanel, {
            war : war,
        });
        this.closePanel();
    }

    private async _onTouchedBtnSimulation(): Promise<void> {
        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.A0931),
            callback    : () => {
                const warData = war.serializeForCreateSfw();
                warData.createIfNotExistsSettingsForSfw();

                const saveSlotExtraData = war.getSaveSlotExtraData();
                gotoSinglePlayerWar({
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
            show(getText(TextType.A0239));
            return;
        }

        const mpwWarId = this.getOpenData()?.war.getSaveSlotExtraData()?.getMpwWarId();
        if (mpwWarId == null) {
            show(getText(TextType.A0439));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0711),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: async () => {
                openPanel(getDict().CommonBlockPanel, {
                    title   : getText(TextType.B0088),
                    content : getText(TextType.A0040),
                });

                const warData = await getOngoingWarData(mpwWarId);
                if (warData) {
                    gotoMultiPlayerWar(warData);
                } else {
                    showLang(TextType.YouCanNotDoThisRightNow);
                }

                closePanel(getDict().CommonBlockPanel);
            },
        });
    }

    private _onTouchedBtnGotoWarList(): void {
        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0652),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => gotoMyWarListPanel(war.getWarType()),
        });
    }

    private _onTouchedBtnGotoLobby(): void {
        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0054),
            getContent : () => getText(TextType.A0025),
            callback: () => gotoLobby(),
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
        this._labelTitle.setLangText(TextType.B0155);
        this._btnSaveGame.setLangText(TextType.B0260);
        this._btnLoadGame.setLangText(TextType.B0261);
        this._btnTaskObjective.setLangText(TextType.B1214);
        this._btnMapSimpleDialogue.setLangText(TextType.B1098);
        this._btnAdvanced.setLangText(TextType.B0080);
        this._btnSimulation.setLangText(TextType.B0325);
        this._btnGotoMpw.setLangText(TextType.B0711);
        this._btnGotoWarList.setLangText(TextType.B0652);
        this._btnGotoLobby.setLangText(TextType.B0054);
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
            && (war.getTurnManager().getPhaseCode() === PhaseCode.Main)
            && (war.getActionPlanner().getStateId() === StateId.Idle);
    }
}
