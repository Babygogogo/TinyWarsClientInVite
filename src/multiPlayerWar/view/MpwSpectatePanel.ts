import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../interface/IMpwWar.ts";
import * as MultiPlayerWarModelMpwModel from "../model/MpwModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WatchWarModelWwModel from "../../watchWar/model/WwModel.ts";
import * as WatchWarModelWwProxy from "../../watchWar/model/WwProxy.ts";

export interface OpenData {
    war: MultiPlayerWarInterfaceIMpwWar.IMpwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelGameSpectatorTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelGameSpectator!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOwnSpectatorTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOwnSpectator!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelIncomingRequestTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelIncomingRequest!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnMakeRequest!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHandleRequest!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteWatcher!             : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetOutgoingInfo,          callback: this._onNotifyMsgMpwWatchGetOutgoingInfo },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetIncomingInfo,          callback: this._onNotifyMsgMpwWatchGetIncomingInfo },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnMakeRequest,                             callback: this._onTouchedBtnMakeRequest },
            { ui: this._btnHandleRequest,                           callback: this._onTouchedBtnHandleRequest },
            { ui: this._btnDeleteWatcher,                           callback: this._onTouchedBtnDeleteWatcher },
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

        const warId     = HelpersMisc.getExisted(war.getWarId());
        const info      = await WatchWarModelWwModel.getWatchOutgoingInfo(warId);
        const userIdSet = new Set<number>();
        for (const userId of info?.getOngoingDstUserIdArray() ?? []) {
            userIdSet.add(userId);
        }
        for (const userId of info?.getRequestDstUserIdArray() ?? []) {
            userIdSet.add(userId);
        }

        const selfUserId = HelpersMisc.getExisted(UsersModel.getSelfUserId());
        for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
            const userId = player.getUserId();
            if ((userId != null) && (userId !== selfUserId) && (!userIdSet.has(userId))) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().WwMakeRequestDetailPanel, {
                    warId,
                });
                return;
            }
        }

        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0299));
    }

    private async _onTouchedBtnHandleRequest(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const warId                 = HelpersMisc.getExisted(war.getWarId());
        const watchIncomingInfo     = await WatchWarModelWwModel.getWatchIncomingInfo(warId);
        const warPlayerInfoArray    = (await MultiPlayerWarModelMpwModel.getWarSettings(warId))?.getPlayerInfoArray();
        if ((watchIncomingInfo == null) || (warPlayerInfoArray == null)) {
            FloatText2.showLang(LangConstants.TextType.A0300);
            return;
        }

        const requestSrcUserIdArray = watchIncomingInfo.getRequestSrcUserIdArray();
        if (!requestSrcUserIdArray.length) {
            FloatText2.showLang(LangConstants.TextType.A0300);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray      : [],
                availableNumberArray    : requestSrcUserIdArray,
                showNumber              : true,
                columnsCount            : 3,
                getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0208),
                getHelpText             : () => LangUtils.getText(LangConstants.TextType.A0859),
                getNumberMainText       : async userId => (await UsersModel.getUserNickname(userId)) ?? LangConstants.UndefinedError,
                getNumberMainTextColor  : userId => {
                    if (warPlayerInfoArray.some(v => (v.getUserId() ?? 0) === userId)) {
                        return GraphicsConstants.ColorValue.Yellow;
                    }

                    const info = watchIncomingInfo.getSrcUserInfoArray().find(v => (v.getUserId() ?? 0) === userId);
                    return ((info?.getIsRequestingOthers()) || (info?.getIsWatchingOthers()))
                        ? GraphicsConstants.ColorValue.Yellow
                        : GraphicsConstants.ColorValue.White;
                },
                callbackOnHelp          : userId => GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId }),
                callbackOnConfirm       : acceptUserIdArray => {
                    const acceptUserIdSet       = new Set(acceptUserIdArray);
                    const declineUserIdArray    = requestSrcUserIdArray.filter(v => !acceptUserIdSet.has(v));
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent : () => LangUtils.getFormattedText(LangConstants.TextType.F0082, acceptUserIdArray.length, declineUserIdArray.length),
                        callback: () => WatchWarModelWwProxy.reqWatchHandleRequest(warId, acceptUserIdArray, declineUserIdArray),
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

        const warId                 = HelpersMisc.getExisted(war.getWarId());
        const watchIncomingInfo     = await WatchWarModelWwModel.getWatchIncomingInfo(warId);
        const warPlayerInfoArray    = (await MultiPlayerWarModelMpwModel.getWarSettings(warId))?.getPlayerInfoArray();
        if ((watchIncomingInfo == null) || (warPlayerInfoArray == null)) {
            FloatText2.showLang(LangConstants.TextType.A0301);
            return;
        }

        const ongoingUserIdArray = watchIncomingInfo.getOngoingSrcUserIdArray();
        if (!ongoingUserIdArray.length) {
            FloatText2.showLang(LangConstants.TextType.A0301);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray      : [],
                availableNumberArray    : ongoingUserIdArray,
                showNumber              : true,
                minChooseCount          : 1,
                columnsCount            : 3,
                getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0219),
                getHelpText             : () => LangUtils.getText(LangConstants.TextType.A0858),
                getNumberMainText       : async userId => (await UsersModel.getUserNickname(userId)) ?? LangConstants.UndefinedError,
                getNumberMainTextColor  : userId => {
                    if (warPlayerInfoArray.some(v => (v.getUserId() ?? 0) === userId)) {
                        return GraphicsConstants.ColorValue.Yellow;
                    }

                    const info = watchIncomingInfo.getSrcUserInfoArray().find(v => (v.getUserId() ?? 0) === userId);
                    return ((info?.getIsRequestingOthers()) || (info?.getIsWatchingOthers()))
                        ? GraphicsConstants.ColorValue.Yellow
                        : GraphicsConstants.ColorValue.White;
                },
                callbackOnHelp          : userId => GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId }),
                callbackOnConfirm       : userIdArray => WatchWarModelWwProxy.reqWatchDeleteWatcher(warId, userIdArray),
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
        this._labelTitle.setLangText(LangConstants.TextType.B0872);
        this._labelGameSpectatorTitle.setLangText(LangConstants.TextType.B0873);
        this._labelOwnSpectatorTitle.setLangText(LangConstants.TextType.B0874);
        this._labelIncomingRequestTitle.setLangText(LangConstants.TextType.B0875);
        this._btnDeleteWatcher.setLangText(LangConstants.TextType.B0219);
        this._btnHandleRequest.setLangText(LangConstants.TextType.B0208);
        this._btnMakeRequest.setLangText(LangConstants.TextType.B0207);
    }

    private async _updateBtnHandleRequest(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const info = await WatchWarModelWwModel.getWatchIncomingInfo(HelpersMisc.getExisted(war.getWarId()));
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

        const info = await WatchWarModelWwModel.getWatchIncomingInfo(HelpersMisc.getExisted(war.getWarId()));
        this._labelIncomingRequest.setText(`${info?.getRequestSrcUserIdArray().length ?? 0}`);
    }
}
