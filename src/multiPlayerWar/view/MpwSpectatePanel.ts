import {
    Graphics_Constants,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Users_Model,
    MultiPlayerWar_Model_MpwModel,
    WatchWar_Model_WwModel,
    GamePanels_Manager,
    WatchWar_Model_WwProxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type MultiPlayerWar_Interface_IMpwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export interface OpenData {
    war: MultiPlayerWar_Interface_IMpwWar.IMpwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelGameSpectatorTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelGameSpectator!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOwnSpectatorTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOwnSpectator!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelIncomingRequestTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelIncomingRequest!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnMakeRequest!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHandleRequest!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteWatcher!             : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgMpwWatchGetOutgoingInfo,          callback : this._onNotifyMsgMpwWatchGetOutgoingInfo },
            { type : Notifications_TypeId.TypeId.MsgMpwWatchGetIncomingInfo,          callback : this._onNotifyMsgMpwWatchGetIncomingInfo },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                   callback : this.closePanel },
            { ui : this._btnMakeRequest,                             callback : this._onTouchedBtnMakeRequest },
            { ui : this._btnHandleRequest,                           callback : this._onTouchedBtnHandleRequest },
            { ui : this._btnDeleteWatcher,                           callback : this._onTouchedBtnDeleteWatcher },
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

    private _onNotifyMsgMpwWatchGetOutgoingInfo(): void {
        this._updateLabelGameSpectator();
    }

    private _onNotifyMsgMpwWatchGetIncomingInfo(): void {
        this._updateBtnHandleRequest();
        this._updateLabelGameSpectator();
        this._updateLabelIncomingRequest();
        this._updateLabelOwnSpectator();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for ui.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnMakeRequest(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const warId     = Helpers_Misc.getExisted(war.getWarId());
        const info      = await WatchWar_Model_WwModel.getWatchOutgoingInfo(warId);
        const userIdSet = new Set<number>();
        for (const userId of info?.getOngoingDstUserIdArray() ?? []) {
            userIdSet.add(userId);
        }
        for (const userId of info?.getRequestDstUserIdArray() ?? []) {
            userIdSet.add(userId);
        }

        const selfUserId = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
        for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
            const userId = player.getUserId();
            if ((userId != null) && (userId !== selfUserId) && (!userIdSet.has(userId))) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwMakeRequestDetailPanel, {
                    warId,
                });
                return;
            }
        }

        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0299));
    }

    private async _onTouchedBtnHandleRequest(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const warId                 = Helpers_Misc.getExisted(war.getWarId());
        const watchIncomingInfo     = await WatchWar_Model_WwModel.getWatchIncomingInfo(warId);
        const warPlayerInfoArray    = (await MultiPlayerWar_Model_MpwModel.getWarSettings(warId))?.getPlayerInfoArray();
        if ((watchIncomingInfo == null) || (warPlayerInfoArray == null)) {
            FloatText.showLang(Lang_Constants.TextType.A0300);
            return;
        }

        const requestSrcUserIdArray = watchIncomingInfo.getRequestSrcUserIdArray();
        if (!requestSrcUserIdArray.length) {
            FloatText.showLang(Lang_Constants.TextType.A0300);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray     : [],
                availableNumberArray   : requestSrcUserIdArray,
                showNumber             : true,
                columnsCount           : 3,
                getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B0208),
                getHelpText            : () => Lang_Utils.getText(Lang_Constants.TextType.A0859),
                getNumberMainText      : async userId => (await Users_Model.getUserNickname(userId)) ?? Lang_Constants.UndefinedError,
                getNumberMainTextColor : userId => {
                    if (warPlayerInfoArray.some(v => (v.getUserId() ?? 0) === userId)) {
                        return Graphics_Constants.ColorValue.Yellow;
                    }

                    const info = watchIncomingInfo.getSrcUserInfoArray().find(v => (v.getUserId() ?? 0) === userId);
                    return ((info?.getIsRequestingOthers()) || (info?.getIsWatchingOthers()))
                        ? Graphics_Constants.ColorValue.Yellow
                        : Graphics_Constants.ColorValue.White;
                },
                callbackOnHelp    : userId => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId }),
                callbackOnConfirm : acceptUserIdArray => {
                    const acceptUserIdSet       = new Set(acceptUserIdArray);
                    const declineUserIdArray    = requestSrcUserIdArray.filter(v => !acceptUserIdSet.has(v));
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0082, acceptUserIdArray.length, declineUserIdArray.length),
                        callback   : () => WatchWar_Model_WwProxy.reqWatchHandleRequest(warId, acceptUserIdArray, declineUserIdArray),
                    });
                },
            });
        }
    }

    private async _onTouchedBtnDeleteWatcher(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const warId                 = Helpers_Misc.getExisted(war.getWarId());
        const watchIncomingInfo     = await WatchWar_Model_WwModel.getWatchIncomingInfo(warId);
        const warPlayerInfoArray    = (await MultiPlayerWar_Model_MpwModel.getWarSettings(warId))?.getPlayerInfoArray();
        if ((watchIncomingInfo == null) || (warPlayerInfoArray == null)) {
            FloatText.showLang(Lang_Constants.TextType.A0301);
            return;
        }

        const ongoingUserIdArray = watchIncomingInfo.getOngoingSrcUserIdArray();
        if (!ongoingUserIdArray.length) {
            FloatText.showLang(Lang_Constants.TextType.A0301);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray     : [],
                availableNumberArray   : ongoingUserIdArray,
                showNumber             : true,
                minChooseCount         : 1,
                columnsCount           : 3,
                getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B0219),
                getHelpText            : () => Lang_Utils.getText(Lang_Constants.TextType.A0858),
                getNumberMainText      : async userId => (await Users_Model.getUserNickname(userId)) ?? Lang_Constants.UndefinedError,
                getNumberMainTextColor : userId => {
                    if (warPlayerInfoArray.some(v => (v.getUserId() ?? 0) === userId)) {
                        return Graphics_Constants.ColorValue.Yellow;
                    }

                    const info = watchIncomingInfo.getSrcUserInfoArray().find(v => (v.getUserId() ?? 0) === userId);
                    return ((info?.getIsRequestingOthers()) || (info?.getIsWatchingOthers()))
                        ? Graphics_Constants.ColorValue.Yellow
                        : Graphics_Constants.ColorValue.White;
                },
                callbackOnHelp    : userId => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId }),
                callbackOnConfirm : userIdArray => WatchWar_Model_WwProxy.reqWatchDeleteWatcher(warId, userIdArray),
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnHandleRequest();
        this._updateLabelGameSpectator();
        this._updateLabelOwnSpectator();
        this._updateLabelIncomingRequest();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0872);
        this._labelGameSpectatorTitle.setLangText(Lang_Constants.TextType.B0873);
        this._labelOwnSpectatorTitle.setLangText(Lang_Constants.TextType.B0874);
        this._labelIncomingRequestTitle.setLangText(Lang_Constants.TextType.B0875);
        this._btnDeleteWatcher.setLangText(Lang_Constants.TextType.B0219);
        this._btnHandleRequest.setLangText(Lang_Constants.TextType.B0208);
        this._btnMakeRequest.setLangText(Lang_Constants.TextType.B0207);
    }

    private async _updateBtnHandleRequest(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const info = await WatchWar_Model_WwModel.getWatchIncomingInfo(Helpers_Misc.getExisted(war.getWarId()));
        this._btnHandleRequest.setRedVisible(!!info?.getRequestSrcUserIdArray().length);
    }

    private _updateLabelGameSpectator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const userIdSet = new Set<number>();
        for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
            for (const userId of player.getWatchOngoingSrcUserIds()) {
                userIdSet.add(userId);
            }
        }
        this._labelGameSpectator.setText(`${userIdSet.size}`);
    }

    private _updateLabelOwnSpectator(): void {
        this._labelOwnSpectator.setText(`${this.getOpenData()?.war.getPlayerLoggedIn()?.getWatchOngoingSrcUserIds().size ?? 0}`);
    }

    private async _updateLabelIncomingRequest(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const info = await WatchWar_Model_WwModel.getWatchIncomingInfo(Helpers_Misc.getExisted(war.getWarId()));
        this._labelIncomingRequest.setText(`${info?.getRequestSrcUserIdArray().length ?? 0}`);
    }
}
