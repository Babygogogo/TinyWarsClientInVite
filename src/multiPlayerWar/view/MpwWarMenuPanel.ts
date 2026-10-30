import { StateId } from "../../actionPlanners/Constants.ts";
import {
    showLang,
    show,
} from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../gamePanels/Manager.ts";
import {
    gotoHalfwayReplayWar,
    gotoSinglePlayerWar,
    gotoMyWarListPanel,
    gotoWatchWarListPanel,
    gotoLobby,
} from "../../helpers/GameFlow.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMpwWar } from "../interface/IMpwWar.ts";
import {
    getHalfwayReplayData,
    checkIsRedForAllMyWars,
} from "../model/MpwModel.ts";
import { reqMpwCommonSyncWar } from "../model/MpwProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import { PhaseCode } from "../../turns/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getWatchIncomingInfo } from "../../watchWar/model/WwModel.ts";
import { SyncRequestTypeId } from "../../wars/Constants.ts";

export interface OpenData {
    war     : IMpwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;

    private readonly _btnDamageCalculator!  : IUiButton;
    private readonly _btnSettings!          : IUiButton;
    private readonly _btnClose!             : IUiButton;

    private readonly _groupMainButton!      : IUiLayout;
    private readonly _btnSync!              : IUiButton;
    private readonly _btnReplay!            : IUiButton;
    private readonly _btnSpectate!          : IUiButton;
    private readonly _btnMapSimpleDialogue! : IUiButton;
    private readonly _btnAdvanced!          : IUiButton;
    private readonly _btnSimulation!        : IUiButton;

    private readonly _btnGotoWarList!       : IUiButton;
    private readonly _btnGotoLobby!         : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMpwWatchGetIncomingInfo,          callback: this._onNotifyMsgMpwWatchGetIncomingInfo },
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

    private _onTouchedBtnSync(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        reqMpwCommonSyncWar(
            war,
            war.getActionPlanner().checkIsStateRequesting()
                ? SyncRequestTypeId.PlayerForce
                : SyncRequestTypeId.PlayerRequest
        );
        this.closePanel();
    }

    private _onTouchedBtnAdvanced(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this.closePanel();
        openPanel(getDict().MpwWarAdvancedMenuPanel, { war: war });
    }

    private _onTouchedBtnReplay(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0249),
            callback: async () => {
                openPanel(getDict().CommonBlockPanel, {
                    title   : getText(TextType.B0088),
                    content : getText(TextType.A0040),
                });

                const warData = await getHalfwayReplayData(war.getWarId() ?? 0);
                if (warData) {
                    gotoHalfwayReplayWar(warData);
                } else {
                    showLang(TextType.YouCanNotDoThisRightNow);
                }

                closePanel(getDict().CommonBlockPanel);
            },
        });
    }

    private _onTouchedBtnSpectate(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().MpwSpectatePanel, { war });
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
            getContent  : () => getText(TextType.A0931),
            callback    : () => {
                const warData = war.serializeForCreateSfw();
                warData.createIfNotExistsSettingsForSfw();

                const playerLoggedIn = war.getPlayerLoggedIn();
                gotoSinglePlayerWar({
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
            show(getText(TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0652),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => {
                if (war?.getPlayerLoggedIn() != null) {
                    gotoMyWarListPanel(war.getWarType());
                } else {
                    gotoWatchWarListPanel();
                }
            },
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
        this._updateBtnSpectate();
        this._updateBtnGotoWarList();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0155);
        this._btnSync.setLangText(TextType.B0089);
        this._btnReplay.setLangText(TextType.B0710);
        this._btnAdvanced.setLangText(TextType.B0080);
        this._btnSpectate.setLangText(TextType.B0872);
        this._btnMapSimpleDialogue.setLangText(TextType.B1098);
        this._btnSimulation.setLangText(TextType.B0325);
        this._btnGotoWarList.setLangText(TextType.B0652);
        this._btnGotoLobby.setLangText(TextType.B0054);
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

        const info = await getWatchIncomingInfo(warId);
        this._btnSpectate.setRedVisible(!!info?.getRequestSrcUserIdArray()?.length);
    }

    private async _updateBtnGotoWarList(): Promise<void> {
        this._btnGotoWarList.setRedVisible(await checkIsRedForAllMyWars([this.getOpenData()?.war.getWarId() ?? 0]));
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
