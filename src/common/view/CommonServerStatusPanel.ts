import {
    Lang_Utils,
    Common_Model_CommonProxy,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";
import type { S as CommonGetServerStatusResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetServerStatus/S.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelAccountsTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAccounts!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOnlineTimeTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOnlineTime!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNewAccountsTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNewAccounts!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelActiveAccountsTitle! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelActiveAccounts!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOngoingMpwInfoTitle! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOngoingMpwInfo!      : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.MsgCommonGetServerStatus, callback: this._onMsgCommonGetServerStatus },
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

        Common_Model_CommonProxy.reqCommonGetServerStatus();
    }

    private _onMsgCommonGetServerStatus(e: Egret_Egret.Event): void {
        const data = e.data as CommonGetServerStatusResponse;

        this._labelAccounts.setText("" + data.getTotalAccounts());

        const totalOnlineTime           = data.getTotalOnlineTime();
        this._labelOnlineTime.setText(totalOnlineTime == null ? Lang_Constants.UndefinedError : Lang_Utils.getTimeDurationText(totalOnlineTime, ` `));

        const activeAccounts            = data.getActiveAccounts();
        this._labelActiveAccounts.setText(activeAccounts == null ? Lang_Constants.UndefinedError : activeAccounts.join(" / "));

        const newAccounts               = data.getNewAccounts();
        this._labelNewAccounts.setText(newAccounts == null ? Lang_Constants.UndefinedError : newAccounts.join(" / "));

        const ongoingMpwInfo            = data.getOngoingMpwInfo();
        this._labelOngoingMpwInfo.setText(ongoingMpwInfo == null
            ? Lang_Constants.UndefinedError
            : `${ongoingMpwInfo[0]} (${Lang_Utils.getText(Lang_Constants.TextType.Players)}: ${ongoingMpwInfo[1]})`
        );
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0327);
        this._labelAccountsTitle.setLangText(Lang_Constants.TextType.B0328);
        this._labelOnlineTimeTitle.setLangText(Lang_Constants.TextType.B0329);
        this._labelNewAccountsTitle.setLangText(Lang_Constants.TextType.B0330);
        this._labelActiveAccountsTitle.setLangText(Lang_Constants.TextType.B0331);
        this._labelOngoingMpwInfoTitle.setLangText(Lang_Constants.TextType.B1101);
    }
}
