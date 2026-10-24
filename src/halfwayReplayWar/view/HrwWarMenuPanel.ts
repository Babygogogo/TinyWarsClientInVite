import * as FloatText2 from "../../FloatText.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import type * as HalfwayReplayWarInterfaceIHrwWar from "../interface/IHrwWar.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

export interface OpenData {
    war     : HalfwayReplayWarInterfaceIHrwWar.IHrwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCalculator!        : UiInterfacesIUiButton.IUiButton;

    private readonly _btnSettings!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSimulation!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnFreeMode!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnOverrideSkin!      : UiInterfacesIUiButton.IUiButton;

    private readonly _btnOngoingWar!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnLobby!             : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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

    private async _onTouchedBtnSimulation(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0103));
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.A0931),
                callback    : () => {
                    const warData = war.serializeForCreateSfw();
                    warData.createIfNotExistsSettingsForSfw();

                    HelpersGameFlow.gotoSinglePlayerWar({
                        warData         : warData,
                        slotIndex       : null,
                        slotExtraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.fromJson({
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
    private _onTouchedBtnOverrideSkin(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseOverridingSkinIdPanel, { war });
    }
    private _onTouchedBtnOngoingWar(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
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

                const warData = await MultiPlayerWarModelMpwModel.getOngoingWarData(war.getWarId() ?? 0);
                if (warData) {
                    HelpersGameFlow.gotoMultiPlayerWar(warData);
                } else {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                }

                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
            }
        });
    }
    private _onTouchedBtnLobby(): void {
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
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0155);
        this._btnOngoingWar.setLangText(LangConstants.TextType.B0711);
        this._btnLobby.setLangText(LangConstants.TextType.B0054);
        this._btnSimulation.setLangText(LangConstants.TextType.B0325);
        this._btnFreeMode.setLangText(LangConstants.TextType.B0557);
        this._btnOverrideSkin.setLangText(LangConstants.TextType.B0609);
    }
}
