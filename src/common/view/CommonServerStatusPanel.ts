import * as CommonModelCommonProxy from "../model/CommonProxy.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCommonGetServerStatusS from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetServerStatus/S.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelAccountsTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelAccounts!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOnlineTimeTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOnlineTime!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNewAccountsTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNewAccounts!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelActiveAccountsTitle! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelActiveAccounts!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOngoingMpwInfoTitle! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOngoingMpwInfo!      : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.MsgCommonGetServerStatus, callback: this._onMsgCommonGetServerStatus },
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

        CommonModelCommonProxy.reqCommonGetServerStatus();
    }

    private _onMsgCommonGetServerStatus(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCommonGetServerStatusS.S;

        this._labelAccounts.setText("" + data.getTotalAccounts());

        const totalOnlineTime           = data.getTotalOnlineTime();
        this._labelOnlineTime.setText(totalOnlineTime == null ? LangConstants.UndefinedError : LangUtils.getTimeDurationText(totalOnlineTime, ` `));

        const activeAccounts            = data.getActiveAccounts();
        this._labelActiveAccounts.setText(activeAccounts == null ? LangConstants.UndefinedError : activeAccounts.join(" / "));

        const newAccounts               = data.getNewAccounts();
        this._labelNewAccounts.setText(newAccounts == null ? LangConstants.UndefinedError : newAccounts.join(" / "));

        const ongoingMpwInfo            = data.getOngoingMpwInfo();
        this._labelOngoingMpwInfo.setText(ongoingMpwInfo == null
            ? LangConstants.UndefinedError
            : `${ongoingMpwInfo[0]} (${LangUtils.getText(LangConstants.TextType.Players)}: ${ongoingMpwInfo[1]})`
        );
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0327);
        this._labelAccountsTitle.setLangText(LangConstants.TextType.B0328);
        this._labelOnlineTimeTitle.setLangText(LangConstants.TextType.B0329);
        this._labelNewAccountsTitle.setLangText(LangConstants.TextType.B0330);
        this._labelActiveAccountsTitle.setLangText(LangConstants.TextType.B0331);
        this._labelOngoingMpwInfoTitle.setLangText(LangConstants.TextType.B1101);
    }
}
