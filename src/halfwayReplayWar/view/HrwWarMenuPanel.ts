import {
    show,
    showLang,
} from "../../FloatText.ts";
import { getTwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../gamePanels/Manager.ts";
import type { IHrwWar } from "../interface/IHrwWar.ts";
import {
    gotoSinglePlayerWar,
    gotoMfrCreateSettingsPanel,
    gotoMultiPlayerWar,
    gotoLobby,
} from "../../helpers/GameFlow.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getErrorText,
} from "../../lang/Utils.ts";
import { getOngoingWarData } from "../../multiPlayerWar/model/MpwModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export interface OpenData {
    war     : IHrwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnCalculator!        : IUiButton;

    private readonly _btnSettings!          : IUiButton;
    private readonly _btnSimulation!        : IUiButton;
    private readonly _btnFreeMode!          : IUiButton;
    private readonly _btnOverrideSkin!      : IUiButton;

    private readonly _btnOngoingWar!        : IUiButton;
    private readonly _btnLobby!             : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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

    private async _onTouchedBtnSimulation(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsExecutingAction()) {
            show(getText(TextType.A0103));
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.A0931),
                callback    : () => {
                    const warData = war.serializeForCreateSfw();
                    warData.createIfNotExistsSettingsForSfw();

                    gotoSinglePlayerWar({
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
            show(getText(TextType.A0199));
            return;
        }

        const warData   = war.serializeForCreateMfr();
        const errorCode = new (getTwWarClass())().getErrorCodeForInitForMfw(warData, war.getGcData());
        if (errorCode) {
            show(getErrorText(errorCode));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => `${getText(TextType.R0007)}\n\n\n${getText(TextType.A0201)}`,
            callback: () => {
                gotoMfrCreateSettingsPanel(warData);
            }
        });
    }
    private _onTouchedBtnOverrideSkin(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonChooseOverridingSkinIdPanel, { war });
    }
    private _onTouchedBtnOngoingWar(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
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

                const warData = await getOngoingWarData(war.getWarId() ?? 0);
                if (warData) {
                    gotoMultiPlayerWar(warData);
                } else {
                    showLang(TextType.YouCanNotDoThisRightNow);
                }

                closePanel(getDict().CommonBlockPanel);
            }
        });
    }
    private _onTouchedBtnLobby(): void {
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
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0155);
        this._btnOngoingWar.setLangText(TextType.B0711);
        this._btnLobby.setLangText(TextType.B0054);
        this._btnSimulation.setLangText(TextType.B0325);
        this._btnFreeMode.setLangText(TextType.B0557);
        this._btnOverrideSkin.setLangText(TextType.B0609);
    }
}
