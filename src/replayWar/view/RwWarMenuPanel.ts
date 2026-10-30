import {
    FloatText,
    TestWar_Model_TwWar,
    Users_Model,
    ReplayWars_Constants,
    GamePanels_Dict,
    Lang_Utils,
    MapEditor_Model_MeModel,
    ReplayWar_Model_RwModel,
    Helpers_GameFlow,
    GamePanels_Manager,
    MapEditor_Model_MeProxy,
    ReplayWar_Model_RwProxy,
    Users_Proxy,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type ReplayWar_Interface_IRwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

import type { S as MeSubmitNormalMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";

export interface OpenData {
    war     : ReplayWar_Interface_IRwWar.IRwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTopButton!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCalculator!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSettings!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnRate!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnFavorite!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSimulation!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnFreeMode!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnEditMap!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnOverrideSkin!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnReplayList!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLobby!             : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgReplaySetSelfRating,              callback : this._onNotifyMsgReplaySetRating },
            { type : Notifications_TypeId.TypeId.MsgUserModifyFavoriteReplayIdArray,  callback : this._onNotifyMsgUserModifyFavoriteReplayIdArray },
            { type : Notifications_TypeId.TypeId.MsgMeSubmitNormalMap,                callback : this._onNotifyMsgMeSubmitNormalMap },
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
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.OperationSucceeded));
        this._updateBtnRate();
    }
    private _onNotifyMsgUserModifyFavoriteReplayIdArray(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.OperationSucceeded));
        this._updateBtnFavorite();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: Egret_Egret.Event): void {
        const slotIndex = (e.data as MeSubmitNormalMapResponse).getSlotIndex() ?? 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0872),
            callback   : async () => {
                const mapEditorData             = await MapEditor_Model_MeModel.getMapEditorData(slotIndex);
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (srcNormalMapIdForAddEvent == null) {
                    Helpers_GameFlow.gotoMapEditorWar({
                        mapRawData                : mapEditorData?.mapRawData,
                        slotIndex                 : slotIndex,
                        isReview                  : false,
                        srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                        gridMarkData              : mapEditorData?.gridMarkData,
                    });
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0015),
                        callback   : () => Helpers_GameFlow.gotoMapEditorWar({
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDamageCalculatorPanel, {
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

        if (Users_Model.checkIsFavoriteReplayId(replayId)) {
            Users_Proxy.reqUserModifyFavoriteReplayIdArray([], [replayId]);
        } else {
            Users_Proxy.reqUserModifyFavoriteReplayIdArray([replayId], []);
        }
    }
    private _onTouchedBtnSettings(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSettingsPanel, void 0);
    }

    private async _onTouchedBtnRate(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const minValue  = ReplayWars_Constants.Common.MinRating;
        const maxValue  = ReplayWars_Constants.Common.MaxRating;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0365)}`,
            currentValue : (await ReplayWar_Model_RwModel.getReplaySelfRating(war.getReplayId())) ?? 5,
            minValue     : minValue,
            maxValue     : maxValue,
            callback     : value => {
                ReplayWar_Model_RwProxy.reqReplaySetSelfRating(war.getReplayId(), value);
            },
        });
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
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0931),
                callback   : () => {
                    const warData = war.serializeForCreateSfw();
                    warData.createIfNotExistsSettingsForSfw();
                    Helpers_GameFlow.gotoSinglePlayerWar({
                        warData       : warData,
                        slotIndex     : null,
                        slotExtraData : null,
                    });
                },
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
            callback   : () => {
                Helpers_GameFlow.gotoMfrCreateSettingsPanel(warData);
            },
        });
    }
    private _onTouchedBtnEditMap(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex     : 0,
            needConfirmOverwrite : true,
            needNonEmptySlot     : false,
            getHelpText          : null,
            callback             : async slotIndex => MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseOverridingSkinIdPanel, { war });
    }
    private _onTouchedBtnReplayList(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0651),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                if (war.getSettingsForSrw()) {
                    Helpers_GameFlow.gotoSrrCreateMapListPanel();
                } else {
                    Helpers_GameFlow.gotoRwReplayListPanel();
                }
            },
        });
    }
    private _onTouchedBtnLobby(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0054),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0025),
            callback   : () => Helpers_GameFlow.gotoLobby(),
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
        this._btnRate.setLangText(Lang_Constants.TextType.B0365);
        this._btnReplayList.setLangText(Lang_Constants.TextType.B0651);
        this._btnLobby.setLangText(Lang_Constants.TextType.B0054);
        this._btnSimulation.setLangText(Lang_Constants.TextType.B0325);
        this._btnFreeMode.setLangText(Lang_Constants.TextType.B0557);
        this._btnEditMap.setLangText(Lang_Constants.TextType.B0458);
        this._btnOverrideSkin.setLangText(Lang_Constants.TextType.B0609);

        this._updateBtnRate();
        this._updateBtnFavorite();
    }

    private async _updateBtnRate(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._btnRate.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0363)}: ${(await ReplayWar_Model_RwModel.getReplaySelfRating(war.getReplayId())) ?? `--`}`);
    }
    private _updateBtnFavorite(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._btnFavorite.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1291)}: ${Lang_Utils.getTextForYesOrNo(Users_Model.checkIsFavoriteReplayId(war.getReplayId()))}`);
    }
}
