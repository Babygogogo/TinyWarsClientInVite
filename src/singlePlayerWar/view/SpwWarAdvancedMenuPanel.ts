import { StateId } from "../../actionPlanners/Constants.ts";
import { RequestingPlayerDeleteUnit } from "../../actionPlanners/states/RequestingPlayerDeleteUnit.ts";
import { RequestingPlayerSurrender } from "../../actionPlanners/states/RequestingPlayerSurrender.ts";
import { RequestingPlayerVoteForDraw } from "../../actionPlanners/states/RequestingPlayerVoteForDraw.ts";
import {
    show,
    showLang,
} from "../../FloatText.ts";
import { Common } from "../../maps/Constants.ts";
import { getTwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    gotoMapEditorWar,
    gotoMfrCreateSettingsPanel,
} from "../../helpers/GameFlow.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getErrorText,
} from "../../lang/Utils.ts";
import { getMapEditorData } from "../../mapEditor/model/MeModel.ts";
import { reqMeSubmitNormalMap } from "../../mapEditor/model/MeProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as MeSubmitNormalMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import { reqSpmDeleteWarSaveSlot } from "../../singlePlayerMode/model/SpmProxy.ts";
import type { ISpwWar } from "../interface/ISpwWar.ts";
import { PhaseCode } from "../../turns/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ActionStateId } from "../../units/Constants.ts";
import {
    reqTickSelfSettingsUnitOpacity,
    getMapRating,
    getSelfSettingsOpacitySettings,
} from "../../users/Model.ts";
import { reqUserSetMapRating } from "../../users/Proxy.ts";
import type { Event } from "../../egret/Egret.ts";

export interface OpenData {
    war     : ISpwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _groupButtons!         : IUiLayout;
    private readonly _btnDeleteUnit!        : IUiButton;
    private readonly _btnDeleteGame!        : IUiButton;
    private readonly _btnUnitOpacity!       : IUiButton;
    private readonly _btnMapRating!         : IUiButton;
    private readonly _btnMarkGrid!          : IUiButton;
    private readonly _btnFreeMode!          : IUiButton;
    private readonly _btnEditMap!           : IUiButton;
    private readonly _btnOverrideSkin!      : IUiButton;
    private readonly _btnCustomCounter!     : IUiButton;

    private readonly _btnSetDraw!           : IUiButton;
    private readonly _btnSurrender!         : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: TypeId.UserSettingsOpacitySettingsChanged,  callback: this._onNotifyUserSettingsOpacitySettingsChanged },
            { type: TypeId.MsgSpmDeleteWarSaveSlot,             callback: this._onNotifyMsgSpmDeleteWarSaveSlot },
            { type: TypeId.MsgUserSetMapRating,                 callback: this._onNotifyMsgUserSetMapRating },
            { type: TypeId.MsgMeSubmitNormalMap,                callback: this._onNotifyMsgMeSubmitNormalMap },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnDeleteUnit,                              callback: this._onTouchedBtnDeleteUnit },
            { ui: this._btnFreeMode,                                callback: this._onTouchedBtnFreeMode },
            { ui: this._btnDeleteGame,                              callback: this._onTouchedBtnDeleteGame },
            { ui: this._btnUnitOpacity,                             callback: this._onTouchedBtnUnitOpacity },
            { ui: this._btnMapRating,                               callback: this._onTouchedBtnMapRating },
            { ui: this._btnMarkGrid,                                callback: this._onTouchedBtnMarkGrid },
            { ui: this._btnEditMap,                                 callback: this._onTouchedBtnEditMap },
            { ui: this._btnOverrideSkin,                            callback: this._onTouchedBtnOverrideSkin },
            { ui: this._btnCustomCounter,                           callback: this._onTouchedBtnCustomCounter },

            { ui: this._btnSetDraw,                                 callback: this._onTouchedBtnSetDraw },
            { ui: this._btnSurrender,                               callback: this._onTouchedBtnSurrender },
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
    private _onNotifyUnitAndTileTextureVersionChanged(): void {
        this._updateView();
    }

    private _onNotifyUserSettingsOpacitySettingsChanged(): void {
        this._updateBtnUnitOpacity();
    }

    private _onNotifyMsgSpmDeleteWarSaveSlot(): void {
        show(getText(TextType.A0141));
    }

    private _onNotifyMsgUserSetMapRating(): void {
        this._updateBtnMapRating();
    }

    private _onNotifyMsgMeSubmitNormalMap(e: Event): void {
        const slotIndex = (e.data as MeSubmitNormalMapResponse).getSlotIndex() ?? 0;
        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.A0872),
            callback    : async () => {
                const mapEditorData             = await getMapEditorData(slotIndex);
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (srcNormalMapIdForAddEvent == null) {
                    gotoMapEditorWar({
                        mapRawData                  : mapEditorData?.mapRawData,
                        slotIndex                   : slotIndex,
                        isReview                    : false,
                        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                        gridMarkData                : mapEditorData?.gridMarkData,
                    });
                } else {
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent  : () => getText(TextType.R0015),
                        callback    : () => gotoMapEditorWar({
                            mapRawData                  : mapEditorData?.mapRawData,
                            slotIndex                   : slotIndex,
                            isReview                    : false,
                            srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                            gridMarkData                : mapEditorData?.gridMarkData,
                        }),
                    });
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for ui.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnDeleteUnit(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
            return;
        }

        const unitMap       = war.getUnitMap();
        const unit          = unitMap.getVisibleUnitOnMap(war.getCursor().getGridIndex());
        const playerIndex   = war.getPlayerIndexInTurn();
        if (!unit) {
            show(getText(TextType.A0027));
        } else if ((unit.getPlayerIndex() !== playerIndex) || (unit.getActionState() !== ActionStateId.Idle)) {
            show(getText(TextType.A0028));
        } else if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
            show(getText(TextType.A0076));
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getTitle    : () => getText(TextType.B0081),
                getContent  : () => getText(TextType.A0029),
                callback    : () => RequestingPlayerDeleteUnit.getInstance().doApplyOnChooseAction(war.getActionPlanner()),
            });
        }
    }

    private async _onTouchedBtnFreeMode(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
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

    private _onTouchedBtnDeleteGame(): void {
        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
            return;
        }

        const saveSlotIndex = this.getOpenData()?.war.getSaveSlotIndex();
        if (saveSlotIndex == null) {
            showLang(TextType.A0929);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.A0140),
            callback    : () => {
                reqSpmDeleteWarSaveSlot(saveSlotIndex);
            },
        });
    }

    private _onTouchedBtnUnitOpacity(): void {
        reqTickSelfSettingsUnitOpacity();
    }

    private _onTouchedBtnMapRating(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const normalMapId   = getExisted(war.getNormalMapId());
        const minValue      = Common.MinRating;
        const maxValue      = Common.MaxRating;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0363),
            currentValue    : getMapRating(normalMapId) || 0,
            minValue,
            maxValue,
            callback        : value => {
                reqUserSetMapRating(normalMapId, value);
            },
        });
    }

    private _onTouchedBtnMarkGrid(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().BwMarkGridPanel, { war: war });
        this.closePanel();
    }

    private _onTouchedBtnEditMap(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex        : 0,
            needConfirmOverwrite    : true,
            needNonEmptySlot        : false,
            getHelpText             : null,
            callback                : async slotIndex => reqMeSubmitNormalMap({
                slotIndex                   : slotIndex,
                mapRawData                  : await war.serializeForMap(),
                needReview                  : false,
                srcNormalMapIdForAddEvent   : null,
                gridMarkData                : null,
            }),
        });
    }

    private _onTouchedBtnOverrideSkin(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonChooseOverridingSkinIdPanel, { war });
    }

    private _onTouchedBtnCustomCounter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().BwCustomCounterListPanel, { war });
    }

    private _onTouchedBtnSetDraw(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
            return;
        }

        const playerIndex       = war.getPlayerInTurn().getPlayerIndex();
        const drawVoteManager   = war.getDrawVoteManager();
        if ((!drawVoteManager.checkCanVote(playerIndex, true))  &&
            (!drawVoteManager.checkCanVote(playerIndex, false))
        ) {
            show(getText(TextType.A0240));
            return;
        }

        const actionPlanner = war.getActionPlanner();
        const state         = RequestingPlayerVoteForDraw.getInstance();
        if (!drawVoteManager.checkHasOngoingVote()) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent  : () => getText(TextType.A0031),
                callback    : () => state.doApplyOnChooseAction(actionPlanner, playerIndex, true),
            });
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0241),
                getTextForConfirm   : () => getText(TextType.B0214),
                getTextForCancel    : () => getText(TextType.B0215),
                showButtonClose     : true,
                callback            : () => {
                    state.doApplyOnChooseAction(actionPlanner, playerIndex, true);
                    this.closePanel();
                },
                callbackOnCancel    : () => {
                    state.doApplyOnChooseAction(actionPlanner, playerIndex, false);
                    this.closePanel();
                },
            });
        }
    }

    private _onTouchedBtnSurrender(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0239));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0055),
            getContent : () => getText(TextType.A0026),
            callback: () => {
                RequestingPlayerSurrender.getInstance().doApplyOnChooseAction(war.getActionPlanner(), war.getPlayerIndexInTurn());
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
        this._labelTitle.setLangText(TextType.B0155);
        this._btnDeleteUnit.setLangText(TextType.B0081);
        this._btnFreeMode.setLangText(TextType.B1285);
        this._btnDeleteGame.setLangText(TextType.B0420);
        this._btnMarkGrid.setLangText(TextType.B1108);
        this._btnSurrender.setLangText(TextType.B0055);
        this._btnEditMap.setLangText(TextType.B0458);
        this._btnOverrideSkin.setLangText(TextType.B0609);
        this._btnCustomCounter.setLangText(TextType.B1143);
        this._updateBtnUnitOpacity();
        this._updateBtnMapRating();
        this._updateBtnSetDraw();
    }

    private _updateBtnUnitOpacity(): void {
        this._btnUnitOpacity.setText(`${getText(TextType.B0747)}: ${getSelfSettingsOpacitySettings()?.getUnitOpacity() ?? 100}%`);
    }

    private _updateBtnMapRating(): void {
        const btn           = this._btnMapRating;
        const normalMapId   = this.getOpenData()?.war.getNormalMapId();
        if (normalMapId == null) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setText(`${getText(TextType.B0804)}: ${getMapRating(normalMapId) ?? `--`}`);
        }
    }

    private _updateBtnSetDraw(): void {
        this._btnSetDraw.setLangText(!this.getOpenData()?.war.getDrawVoteManager().checkHasOngoingVote()
            ? TextType.B0690
            : TextType.B0841
        );
    }

    private _updateGroupButtons(): void {
        const group = this._groupButtons;
        group.removeAllItems(false);

        group.addItem(this._btnFreeMode, false);
        group.addItem(this._btnOverrideSkin, false);
        group.addItem(this._btnDeleteUnit, false);
        group.addItem(this._btnDeleteGame, false);
        group.addItem(this._btnUnitOpacity, false);
        group.addItem(this._btnMarkGrid, false);
        group.addItem(this._btnEditMap, false);

        const war = this.getOpenData()?.war;
        if (war?.getNormalMapId() != null) {
            group.addItem(this._btnMapRating, false);
        }
        if (war?.getWarEventManager().checkIsCustomCounterRelevant()) {
            group.addItem(this._btnCustomCounter, false);
        }
        group.arrangeItems();

        this._group.setUnscaledManualHeight(group.getScaledHeight() + 130);
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
