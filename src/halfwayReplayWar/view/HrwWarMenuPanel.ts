import {
    FloatText,
    TestWar_Model_TwWar,
    GamePanels_Manager,
    GamePanels_Dict,
    Lang_Utils,
    MultiPlayerWar_Model_MpwModel,
    Helpers_GameFlow,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type HalfwayReplayWar_Interface_IHrwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";

export interface OpenData {
    war     : HalfwayReplayWar_Interface_IHrwWar.IHrwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCalculator!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnSettings!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSimulation!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnFreeMode!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnOverrideSkin!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnOngoingWar!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLobby!             : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnCalculator,              callback: this._onTouchedBtnCalculator },
            { ui: this._btnSettings,                callback: this._onTouchedBtnSettings },
            { ui: this._btnSimulation,              callback: this._onTouchedBtnSimulation },
            { ui: this._btnFreeMode,                callback: this._onTouchedBtnFreeMode },
            { ui: this._btnOverrideSkin,            callback: this._onTouchedBtnOverrideSkin },

            { ui: this._btnOngoingWar,              callback: this._onTouchedBtnOngoingWar },
            { ui: this._btnLobby,                   callback: this._onTouchedBtnLobby },
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
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnCalculator(): void {
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

    private async _onTouchedBtnSimulation(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsExecutingAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0103));
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.A0931),
                callback    : () => {
                    const warData = war.serializeForCreateSfw();
                    warData.createIfNotExistsSettingsForSfw();

                    Helpers_GameFlow.gotoSinglePlayerWar({
                        warData         : warData,
                        slotIndex       : null,
                        slotExtraData   : SpmWarSaveSlotExtraData.fromJson({
                            mpwWarId                : war.getWarId(),
                            overridingSkinIdArray   : [],
                            gridMarkData            : war.getGridMarkData().toJson(),
                        }),
                    });
                }
            });
        }
    }
    private _onTouchedBtnFreeMode(): void {
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
            callback: () => {
                Helpers_GameFlow.gotoMfrCreateSettingsPanel(warData);
            }
        });
    }
    private _onTouchedBtnOverrideSkin(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseOverridingSkinIdPanel, { war });
    }
    private _onTouchedBtnOngoingWar(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
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

                const warData = await MultiPlayerWar_Model_MpwModel.getOngoingWarData(war.getWarId() ?? 0);
                if (warData) {
                    Helpers_GameFlow.gotoMultiPlayerWar(warData);
                } else {
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                }

                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
            }
        });
    }
    private _onTouchedBtnLobby(): void {
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
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0155);
        this._btnOngoingWar.setLangText(Lang_Constants.TextType.B0711);
        this._btnLobby.setLangText(Lang_Constants.TextType.B0054);
        this._btnSimulation.setLangText(Lang_Constants.TextType.B0325);
        this._btnFreeMode.setLangText(Lang_Constants.TextType.B0557);
        this._btnOverrideSkin.setLangText(Lang_Constants.TextType.B0609);
    }
}
