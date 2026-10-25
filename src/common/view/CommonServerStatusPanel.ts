import { reqCommonGetServerStatus } from "../model/CommonProxy.ts";
import { UndefinedError, TextType } from "../../lang/Constants.ts";
import { getTimeDurationText, getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetServerStatus/S.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;

    private readonly _labelAccountsTitle!       : IUiLabel;
    private readonly _labelAccounts!            : IUiLabel;
    private readonly _labelOnlineTimeTitle!     : IUiLabel;
    private readonly _labelOnlineTime!          : IUiLabel;
    private readonly _labelNewAccountsTitle!    : IUiLabel;
    private readonly _labelNewAccounts!         : IUiLabel;
    private readonly _labelActiveAccountsTitle! : IUiLabel;
    private readonly _labelActiveAccounts!      : IUiLabel;
    private readonly _labelOngoingMpwInfoTitle! : IUiLabel;
    private readonly _labelOngoingMpwInfo!      : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.MsgCommonGetServerStatus, callback: this._onMsgCommonGetServerStatus },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        reqCommonGetServerStatus();
    }

    private _onMsgCommonGetServerStatus(e: Event): void {
        const data = e.data as S;

        this._labelAccounts.setText("" + data.getTotalAccounts());

        const totalOnlineTime           = data.getTotalOnlineTime();
        this._labelOnlineTime.setText(totalOnlineTime == null ? UndefinedError : getTimeDurationText(totalOnlineTime, ` `));

        const activeAccounts            = data.getActiveAccounts();
        this._labelActiveAccounts.setText(activeAccounts == null ? UndefinedError : activeAccounts.join(" / "));

        const newAccounts               = data.getNewAccounts();
        this._labelNewAccounts.setText(newAccounts == null ? UndefinedError : newAccounts.join(" / "));

        const ongoingMpwInfo            = data.getOngoingMpwInfo();
        this._labelOngoingMpwInfo.setText(ongoingMpwInfo == null
            ? UndefinedError
            : `${ongoingMpwInfo[0]} (${getText(TextType.Players)}: ${ongoingMpwInfo[1]})`
        );
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0327);
        this._labelAccountsTitle.setLangText(TextType.B0328);
        this._labelOnlineTimeTitle.setLangText(TextType.B0329);
        this._labelNewAccountsTitle.setLangText(TextType.B0330);
        this._labelActiveAccountsTitle.setLangText(TextType.B0331);
        this._labelOngoingMpwInfoTitle.setLangText(TextType.B1101);
    }
}
