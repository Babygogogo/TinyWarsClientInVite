import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../../mapEditor/model/MeProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import type * as ReplayWarInterfaceIRwWar from "../interface/IRwWar.ts";
import * as ReplayWarModelRwModel from "../model/RwModel.ts";
import * as ReplayWarModelRwProxy from "../model/RwProxy.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UsersProxy from "../../users/Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    war     : ReplayWarInterfaceIRwWar.IRwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTopButton!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCalculator!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSettings!          : UiInterfacesIUiButton.IUiButton;

    private readonly _btnRate!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnFavorite!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSimulation!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnFreeMode!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnEditMap!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnOverrideSkin!      : UiInterfacesIUiButton.IUiButton;

    private readonly _btnReplayList!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnLobby!             : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgReplaySetSelfRating,              callback: this._onNotifyMsgReplaySetRating },
            { type: NotificationsTypeId.TypeId.MsgUserModifyFavoriteReplayIdArray,  callback: this._onNotifyMsgUserModifyFavoriteReplayIdArray },
            { type: NotificationsTypeId.TypeId.MsgMeSubmitNormalMap,                callback: this._onNotifyMsgMeSubmitNormalMap },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnCalculator,      callback: this._onTouchedBtnCalculator },
            { ui: this._btnSettings,        callback: this._onTouchedBtnSettings },

            { ui: this._btnFavorite,        callback: this._onTouchedBtnFavorite },
            { ui: this._btnRate,            callback: this._onTouchedBtnRate },
            { ui: this._btnSimulation,      callback: this._onTouchedBtnSimulation },
            { ui: this._btnFreeMode,        callback: this._onTouchedBtnFreeMode },
            { ui: this._btnEditMap,         callback: this._onTouchedBtnEditMap },
            { ui: this._btnOverrideSkin,    callback: this._onTouchedBtnOverrideSkin },

            { ui: this._btnReplayList,      callback: this._onTouchedBtnReplayList },
            { ui: this._btnLobby,           callback: this._onTouchedBtnLobby },
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
        FloatText2.show(LangUtils.getText(LangConstants.TextType.OperationSucceeded));
        this._updateBtnRate();
    }
    private _onNotifyMsgUserModifyFavoriteReplayIdArray(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.OperationSucceeded));
        this._updateBtnFavorite();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: VendorEgretEgret.Event): void {
        const slotIndex = (e.data as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS.S).getSlotIndex() ?? 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0872),
            callback    : async () => {
                const mapEditorData             = await MapEditorModelMeModel.getMapEditorData(slotIndex);
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (srcNormalMapIdForAddEvent == null) {
                    HelpersGameFlow.gotoMapEditorWar({
                        mapRawData                  : mapEditorData?.mapRawData,
                        slotIndex                   : slotIndex,
                        isReview                    : false,
                        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                        gridMarkData                : mapEditorData?.gridMarkData,
                    });
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent  : () => LangUtils.getText(LangConstants.TextType.R0015),
                        callback    : () => HelpersGameFlow.gotoMapEditorWar({
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
    private _onTouchedBtnFavorite(): void {
        const replayId = this.getOpenData()?.war.getReplayId();
        if (replayId == null) {
            return;
        }

        if (UsersModel.checkIsFavoriteReplayId(replayId)) {
            UsersProxy.reqUserModifyFavoriteReplayIdArray([], [replayId]);
        } else {
            UsersProxy.reqUserModifyFavoriteReplayIdArray([replayId], []);
        }
    }
    private _onTouchedBtnSettings(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSettingsPanel, void 0);
    }

    private async _onTouchedBtnRate(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const minValue  = GameConfigGcWar.ReplayWar.MinRating;
        const maxValue  = GameConfigGcWar.ReplayWar.MaxRating;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => `${LangUtils.getText(LangConstants.TextType.B0365)}`,
            currentValue    : (await ReplayWarModelRwModel.getReplaySelfRating(war.getReplayId())) ?? 5,
            minValue        : minValue,
            maxValue        : maxValue,
            callback        : value => {
                ReplayWarModelRwProxy.reqReplaySetSelfRating(war.getReplayId(), value);
            },
        });
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
                        slotExtraData   : null,
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
    private _onTouchedBtnEditMap(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex        : 0,
            needConfirmOverwrite    : true,
            needNonEmptySlot        : false,
            getHelpText             : null,
            callback                : async slotIndex => MapEditorModelMeProxy.reqMeSubmitNormalMap({
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseOverridingSkinIdPanel, { war });
    }
    private _onTouchedBtnReplayList(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0651),
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                if (war.getSettingsForSrw()) {
                    HelpersGameFlow.gotoSrrCreateMapListPanel();
                } else {
                    HelpersGameFlow.gotoRwReplayListPanel();
                }
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
        this._btnRate.setLangText(LangConstants.TextType.B0365);
        this._btnReplayList.setLangText(LangConstants.TextType.B0651);
        this._btnLobby.setLangText(LangConstants.TextType.B0054);
        this._btnSimulation.setLangText(LangConstants.TextType.B0325);
        this._btnFreeMode.setLangText(LangConstants.TextType.B0557);
        this._btnEditMap.setLangText(LangConstants.TextType.B0458);
        this._btnOverrideSkin.setLangText(LangConstants.TextType.B0609);

        this._updateBtnRate();
        this._updateBtnFavorite();
    }

    private async _updateBtnRate(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._btnRate.setText(`${LangUtils.getText(LangConstants.TextType.B0363)}: ${(await ReplayWarModelRwModel.getReplaySelfRating(war.getReplayId())) ?? `--`}`);
    }
    private _updateBtnFavorite(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._btnFavorite.setText(`${LangUtils.getText(LangConstants.TextType.B1291)}: ${LangUtils.getTextForYesOrNo(UsersModel.checkIsFavoriteReplayId(war.getReplayId()))}`);
    }
}
