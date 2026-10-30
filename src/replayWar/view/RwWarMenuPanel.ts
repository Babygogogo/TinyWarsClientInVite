import { show } from "../../FloatText.ts";
import { getTwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    gotoLobby,
    gotoMapEditorWar,
    gotoMfrCreateSettingsPanel,
    gotoRwReplayListPanel,
    gotoSinglePlayerWar,
    gotoSrrCreateMapListPanel,
} from "../../helpers/GameFlow.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getErrorText,
    getText,
    getTextForYesOrNo,
} from "../../lang/Utils.ts";
import { getMapEditorData } from "../../mapEditor/model/MeModel.ts";
import { reqMeSubmitNormalMap } from "../../mapEditor/model/MeProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as MeSubmitNormalMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import { Common } from "../../replayWars/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { checkIsFavoriteReplayId } from "../../users/Model.ts";
import { reqUserModifyFavoriteReplayIdArray } from "../../users/Proxy.ts";
import type { Event } from "../../egret/Egret.ts";
import type { IRwWar } from "../interface/IRwWar.ts";
import { getReplaySelfRating } from "../model/RwModel.ts";
import { reqReplaySetSelfRating } from "../model/RwProxy.ts";

export interface OpenData {
    war     : IRwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;

    private readonly _groupTopButton!       : IUiContainer;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnCalculator!        : IUiButton;
    private readonly _btnSettings!          : IUiButton;

    private readonly _btnRate!              : IUiButton;
    private readonly _btnFavorite!          : IUiButton;
    private readonly _btnSimulation!        : IUiButton;
    private readonly _btnFreeMode!          : IUiButton;
    private readonly _btnEditMap!           : IUiButton;
    private readonly _btnOverrideSkin!      : IUiButton;

    private readonly _btnReplayList!        : IUiButton;
    private readonly _btnLobby!             : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : TypeId.MsgReplaySetSelfRating,              callback : this._onNotifyMsgReplaySetRating },
            { type : TypeId.MsgUserModifyFavoriteReplayIdArray,  callback : this._onNotifyMsgUserModifyFavoriteReplayIdArray },
            { type : TypeId.MsgMeSubmitNormalMap,                callback : this._onNotifyMsgMeSubmitNormalMap },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnCalculator,      callback : this._onTouchedBtnCalculator },
            { ui : this._btnSettings,        callback : this._onTouchedBtnSettings },

            { ui : this._btnFavorite,        callback : this._onTouchedBtnFavorite },
            { ui : this._btnRate,            callback : this._onTouchedBtnRate },
            { ui : this._btnSimulation,      callback : this._onTouchedBtnSimulation },
            { ui : this._btnFreeMode,        callback : this._onTouchedBtnFreeMode },
            { ui : this._btnEditMap,         callback : this._onTouchedBtnEditMap },
            { ui : this._btnOverrideSkin,    callback : this._onTouchedBtnOverrideSkin },

            { ui : this._btnReplayList,      callback : this._onTouchedBtnReplayList },
            { ui : this._btnLobby,           callback : this._onTouchedBtnLobby },
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

    private _onNotifyMsgReplaySetRating(): void {
        show(getText(TextType.OperationSucceeded));
        this._updateBtnRate();
    }
    private _onNotifyMsgUserModifyFavoriteReplayIdArray(): void {
        show(getText(TextType.OperationSucceeded));
        this._updateBtnFavorite();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: Event): void {
        const slotIndex = (e.data as MeSubmitNormalMapResponse).getSlotIndex() ?? 0;
        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0872),
            callback   : async () => {
                const mapEditorData             = await getMapEditorData(slotIndex);
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (srcNormalMapIdForAddEvent == null) {
                    gotoMapEditorWar({
                        mapRawData                : mapEditorData?.mapRawData,
                        slotIndex                 : slotIndex,
                        isReview                  : false,
                        srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                        gridMarkData              : mapEditorData?.gridMarkData,
                    });
                } else {
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent : () => getText(TextType.R0015),
                        callback   : () => gotoMapEditorWar({
                            mapRawData                : mapEditorData?.mapRawData,
                            slotIndex                 : slotIndex,
                            isReview                  : false,
                            srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                            gridMarkData              : mapEditorData?.gridMarkData,
                        }),
                    });
                }
            },
        });
    }

    private _onTouchedBtnCalculator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonDamageCalculatorPanel, {
            war                  : war,
            needReviseWeaponType : true,
            data                 : null,
        });
        this.closePanel();
    }
    private _onTouchedBtnFavorite(): void {
        const replayId = this.getOpenData()?.war.getReplayId();
        if (replayId == null) {
            return;
        }

        if (checkIsFavoriteReplayId(replayId)) {
            reqUserModifyFavoriteReplayIdArray([], [replayId]);
        } else {
            reqUserModifyFavoriteReplayIdArray([replayId], []);
        }
    }
    private _onTouchedBtnSettings(): void {
        openPanel(getDict().UserSettingsPanel, void 0);
    }

    private async _onTouchedBtnRate(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const minValue  = Common.MinRating;
        const maxValue  = Common.MaxRating;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle     : () => `${getText(TextType.B0365)}`,
            currentValue : (await getReplaySelfRating(war.getReplayId())) ?? 5,
            minValue     : minValue,
            maxValue     : maxValue,
            callback     : value => {
                reqReplaySetSelfRating(war.getReplayId(), value);
            },
        });
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
                getContent : () => getText(TextType.A0931),
                callback   : () => {
                    const warData = war.serializeForCreateSfw();
                    warData.createIfNotExistsSettingsForSfw();
                    gotoSinglePlayerWar({
                        warData       : warData,
                        slotIndex     : null,
                        slotExtraData : null,
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
            callback   : () => {
                gotoMfrCreateSettingsPanel(warData);
            }
        });
    }
    private _onTouchedBtnEditMap(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex     : 0,
            needConfirmOverwrite : true,
            needNonEmptySlot     : false,
            getHelpText          : null,
            callback             : async slotIndex => reqMeSubmitNormalMap({
                slotIndex                 : slotIndex,
                mapRawData                : await war.serializeForMap(),
                needReview                : false,
                srcNormalMapIdForAddEvent : null,
                gridMarkData              : null,
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
    private _onTouchedBtnReplayList(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0651),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                if (war.getSettingsForSrw()) {
                    gotoSrrCreateMapListPanel();
                } else {
                    gotoRwReplayListPanel();
                }
            }
        });
    }
    private _onTouchedBtnLobby(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0054),
            getContent : () => getText(TextType.A0025),
            callback   : () => gotoLobby(),
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
        this._btnRate.setLangText(TextType.B0365);
        this._btnReplayList.setLangText(TextType.B0651);
        this._btnLobby.setLangText(TextType.B0054);
        this._btnSimulation.setLangText(TextType.B0325);
        this._btnFreeMode.setLangText(TextType.B0557);
        this._btnEditMap.setLangText(TextType.B0458);
        this._btnOverrideSkin.setLangText(TextType.B0609);

        this._updateBtnRate();
        this._updateBtnFavorite();
    }

    private async _updateBtnRate(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._btnRate.setText(`${getText(TextType.B0363)}: ${(await getReplaySelfRating(war.getReplayId())) ?? `--`}`);
    }
    private _updateBtnFavorite(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._btnFavorite.setText(`${getText(TextType.B1291)}: ${getTextForYesOrNo(checkIsFavoriteReplayId(war.getReplayId()))}`);
    }
}
