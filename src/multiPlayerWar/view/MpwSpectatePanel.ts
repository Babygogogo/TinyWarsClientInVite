import {
    show,
    showLang,
} from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../../lang/Utils.ts";
import type { IMpwWar } from "../interface/IMpwWar.ts";
import { getWarSettings } from "../model/MpwModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import {
    getSelfUserId,
    getUserNickname,
} from "../../users/Model.ts";
import {
    getWatchOutgoingInfo,
    getWatchIncomingInfo,
} from "../../watchWar/model/WwModel.ts";
import {
    reqWatchHandleRequest,
    reqWatchDeleteWatcher,
} from "../../watchWar/model/WwProxy.ts";

export interface OpenData {
    war: IMpwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;

    private readonly _labelGameSpectatorTitle!      : IUiLabel;
    private readonly _labelGameSpectator!           : IUiLabel;
    private readonly _labelOwnSpectatorTitle!       : IUiLabel;
    private readonly _labelOwnSpectator!            : IUiLabel;
    private readonly _labelIncomingRequestTitle!    : IUiLabel;
    private readonly _labelIncomingRequest!         : IUiLabel;
    private readonly _btnMakeRequest!               : IUiButton;
    private readonly _btnHandleRequest!             : IUiButton;
    private readonly _btnDeleteWatcher!             : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMpwWatchGetOutgoingInfo,          callback: this._onNotifyMsgMpwWatchGetOutgoingInfo },
            { type: TypeId.MsgMpwWatchGetIncomingInfo,          callback: this._onNotifyMsgMpwWatchGetIncomingInfo },
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

        const warId     = getExisted(war.getWarId());
        const info      = await getWatchOutgoingInfo(warId);
        const userIdSet = new Set<number>();
        for (const userId of info?.getOngoingDstUserIdArray() ?? []) {
            userIdSet.add(userId);
        }
        for (const userId of info?.getRequestDstUserIdArray() ?? []) {
            userIdSet.add(userId);
        }

        const selfUserId = getExisted(getSelfUserId());
        for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
            const userId = player.getUserId();
            if ((userId != null) && (userId !== selfUserId) && (!userIdSet.has(userId))) {
                openPanel(getDict().WwMakeRequestDetailPanel, {
                    warId,
                });
                return;
            }
        }

        show(getText(TextType.A0299));
    }

    private async _onTouchedBtnHandleRequest(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const warId                 = getExisted(war.getWarId());
        const watchIncomingInfo     = await getWatchIncomingInfo(warId);
        const warPlayerInfoArray    = (await getWarSettings(warId))?.getPlayerInfoArray();
        if ((watchIncomingInfo == null) || (warPlayerInfoArray == null)) {
            showLang(TextType.A0300);
            return;
        }

        const requestSrcUserIdArray = watchIncomingInfo.getRequestSrcUserIdArray();
        if (!requestSrcUserIdArray.length) {
            showLang(TextType.A0300);
        } else {
            openPanel(getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray      : [],
                availableNumberArray    : requestSrcUserIdArray,
                showNumber              : true,
                columnsCount            : 3,
                getTitleText            : () => getText(TextType.B0208),
                getHelpText             : () => getText(TextType.A0859),
                getNumberMainText       : async userId => (await getUserNickname(userId)) ?? UndefinedError,
                getNumberMainTextColor  : userId => {
                    if (warPlayerInfoArray.some(v => (v.getUserId() ?? 0) === userId)) {
                        return ColorValue.Yellow;
                    }

                    const info = watchIncomingInfo.getSrcUserInfoArray().find(v => (v.getUserId() ?? 0) === userId);
                    return ((info?.getIsRequestingOthers()) || (info?.getIsWatchingOthers()))
                        ? ColorValue.Yellow
                        : ColorValue.White;
                },
                callbackOnHelp          : userId => openPanel(getDict().UserPanel, { userId }),
                callbackOnConfirm       : acceptUserIdArray => {
                    const acceptUserIdSet       = new Set(acceptUserIdArray);
                    const declineUserIdArray    = requestSrcUserIdArray.filter(v => !acceptUserIdSet.has(v));
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent : () => getFormattedText(TextType.F0082, acceptUserIdArray.length, declineUserIdArray.length),
                        callback: () => reqWatchHandleRequest(warId, acceptUserIdArray, declineUserIdArray),
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

        const warId                 = getExisted(war.getWarId());
        const watchIncomingInfo     = await getWatchIncomingInfo(warId);
        const warPlayerInfoArray    = (await getWarSettings(warId))?.getPlayerInfoArray();
        if ((watchIncomingInfo == null) || (warPlayerInfoArray == null)) {
            showLang(TextType.A0301);
            return;
        }

        const ongoingUserIdArray = watchIncomingInfo.getOngoingSrcUserIdArray();
        if (!ongoingUserIdArray.length) {
            showLang(TextType.A0301);
        } else {
            openPanel(getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray      : [],
                availableNumberArray    : ongoingUserIdArray,
                showNumber              : true,
                minChooseCount          : 1,
                columnsCount            : 3,
                getTitleText            : () => getText(TextType.B0219),
                getHelpText             : () => getText(TextType.A0858),
                getNumberMainText       : async userId => (await getUserNickname(userId)) ?? UndefinedError,
                getNumberMainTextColor  : userId => {
                    if (warPlayerInfoArray.some(v => (v.getUserId() ?? 0) === userId)) {
                        return ColorValue.Yellow;
                    }

                    const info = watchIncomingInfo.getSrcUserInfoArray().find(v => (v.getUserId() ?? 0) === userId);
                    return ((info?.getIsRequestingOthers()) || (info?.getIsWatchingOthers()))
                        ? ColorValue.Yellow
                        : ColorValue.White;
                },
                callbackOnHelp          : userId => openPanel(getDict().UserPanel, { userId }),
                callbackOnConfirm       : userIdArray => reqWatchDeleteWatcher(warId, userIdArray),
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
        this._labelTitle.setLangText(TextType.B0872);
        this._labelGameSpectatorTitle.setLangText(TextType.B0873);
        this._labelOwnSpectatorTitle.setLangText(TextType.B0874);
        this._labelIncomingRequestTitle.setLangText(TextType.B0875);
        this._btnDeleteWatcher.setLangText(TextType.B0219);
        this._btnHandleRequest.setLangText(TextType.B0208);
        this._btnMakeRequest.setLangText(TextType.B0207);
    }

    private async _updateBtnHandleRequest(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const info = await getWatchIncomingInfo(getExisted(war.getWarId()));
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

        const info = await getWatchIncomingInfo(getExisted(war.getWarId()));
        this._labelIncomingRequest.setText(`${info?.getRequestSrcUserIdArray().length ?? 0}`);
    }
}
