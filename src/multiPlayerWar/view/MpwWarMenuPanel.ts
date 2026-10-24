import * as ActionPlannersConstants from "../../actionPlanners/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../interface/IMpwWar.ts";
import * as MultiPlayerWarModelMpwModel from "../model/MpwModel.ts";
import * as MultiPlayerWarModelMpwProxy from "../model/MpwProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as ProtoSchemaCommonProtoStructureGridMarkData from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as WatchWarModelWwModel from "../../watchWar/model/WwModel.ts";

export interface OpenData {
    war     : MultiPlayerWarInterfaceIMpwWar.IMpwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnDamageCalculator!  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSettings!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _groupMainButton!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnSync!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnReplay!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSpectate!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMapSimpleDialogue! : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdvanced!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSimulation!        : UiInterfacesIUiButton.IUiButton;

    private readonly _btnGotoWarList!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnGotoLobby!         : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetIncomingInfo,          callback: this._onNotifyMsgMpwWatchGetIncomingInfo },
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

    private _onTouchedBtnSync(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        MultiPlayerWarModelMpwProxy.reqMpwCommonSyncWar(
            war,
            war.getActionPlanner().checkIsStateRequesting()
                ? GameConfigGcWar.SyncRequestType.PlayerForce
                : GameConfigGcWar.SyncRequestType.PlayerRequest
        );
        this.closePanel();
    }

    private _onTouchedBtnAdvanced(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwWarAdvancedMenuPanel, { war: war });
    }

    private _onTouchedBtnReplay(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0249),
            callback: async () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                    title   : LangUtils.getText(LangConstants.TextType.B0088),
                    content : LangUtils.getText(LangConstants.TextType.A0040),
                });

                const warData = await MultiPlayerWarModelMpwModel.getHalfwayReplayData(war.getWarId() ?? 0);
                if (warData) {
                    HelpersGameFlow.gotoHalfwayReplayWar(warData);
                } else {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                }

                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
            },
        });
    }

    private _onTouchedBtnSpectate(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwSpectatePanel, { war });
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
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0931),
            callback    : () => {
                const warData = war.serializeForCreateSfw();
                warData.createIfNotExistsSettingsForSfw();

                const playerLoggedIn = war.getPlayerLoggedIn();
                HelpersGameFlow.gotoSinglePlayerWar({
                    warData         : warData,
                    slotIndex       : null,
                    slotExtraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.fromJson({
                        mpwWarId                : war.getWarId(),
                        overridingSkinIdArray   : [],
                        gridMarkData            : ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData.fromJson({
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const war = this.getOpenData()?.war;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0652),
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                if (war?.getPlayerLoggedIn() != null) {
                    HelpersGameFlow.gotoMyWarListPanel(war.getWarType());
                } else {
                    HelpersGameFlow.gotoWatchWarListPanel();
                }
            },
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
        this._updateBtnSpectate();
        this._updateBtnGotoWarList();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0155);
        this._btnSync.setLangText(LangConstants.TextType.B0089);
        this._btnReplay.setLangText(LangConstants.TextType.B0710);
        this._btnAdvanced.setLangText(LangConstants.TextType.B0080);
        this._btnSpectate.setLangText(LangConstants.TextType.B0872);
        this._btnMapSimpleDialogue.setLangText(LangConstants.TextType.B1098);
        this._btnSimulation.setLangText(LangConstants.TextType.B0325);
        this._btnGotoWarList.setLangText(LangConstants.TextType.B0652);
        this._btnGotoLobby.setLangText(LangConstants.TextType.B0054);
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

        const info = await WatchWarModelWwModel.getWatchIncomingInfo(warId);
        this._btnSpectate.setRedVisible(!!info?.getRequestSrcUserIdArray()?.length);
    }

    private async _updateBtnGotoWarList(): Promise<void> {
        this._btnGotoWarList.setRedVisible(await MultiPlayerWarModelMpwModel.checkIsRedForAllMyWars([this.getOpenData()?.war.getWarId() ?? 0]));
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
