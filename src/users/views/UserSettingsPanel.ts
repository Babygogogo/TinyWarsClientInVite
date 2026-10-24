import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as CampaignsManagementsProvider from "../../campaigns/managements/Provider.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MailModelMailModel from "../../mail/model/MailModel.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UsersConstants from "../Constants.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDamageCalculator!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMail!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;

    private readonly _groupButtons!                 : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnGraphicSettings!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSoundSettings!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMiscSettings!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeGameVersion!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnComplaint!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnGameChart!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnGameManagement!            : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserGetPublicInfo,    callback: this._onMsgUserGetPublicInfo },
            { type: NotificationsTypeId.TypeId.MsgUserSetNickname,      callback: this._onMsgUserSetNickname },
            { type: NotificationsTypeId.TypeId.MsgUserSetDiscordInfo,   callback: this._onMsgUserSetDiscordId },
            { type: NotificationsTypeId.TypeId.MsgMailSetIsNew,         callback: this._onMsgMailSetIsNew },
            { type: NotificationsTypeId.TypeId.MsgMailGetAllMailArray,  callback: this._onMsgMailGetAllMailArray },
            { type: NotificationsTypeId.TypeId.MsgMmGetReviewingMaps,   callback: this._onMsgMmGetReviewingMaps },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnDamageCalculator,        callback: this._onTouchedBtnDamageCalculator },
            { ui: this._btnGraphicSettings,         callback: this._onTouchedBtnGraphicSettings },
            { ui: this._btnChangeGameVersion,       callback: this._onTouchedBtnChangeGameVersion },
            { ui: this._btnSoundSettings,           callback: this._onTouchedBtnSoundSettings },
            { ui: this._btnMiscSettings,            callback: this._onTouchedBtnMiscSettings },
            { ui: this._btnMail,                    callback: this._onTouchedBtnMail },
            { ui: this._btnComplaint,               callback: this._onTouchedBtnComplaint },
            { ui: this._btnGameChart,               callback: this._onTouchedBtnGameChart },
            { ui: this._btnGameManagement,          callback: this._onTouchedBtnGameManagement },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        const selfUserId = HelpersMisc.getExisted(UsersModel.getSelfUserId(), UtilsClientErrorCode.ClientErrorCode.UserSettingsPanel_OnOpened_00);
        UsersProxy.reqUserGetPublicInfo(selfUserId);

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserGetPublicInfo(): void {
        this._updateView();
    }
    private _onMsgUserSetNickname(): void {
        const selfUserId = HelpersMisc.getExisted(UsersModel.getSelfUserId(), UtilsClientErrorCode.ClientErrorCode.UserSettingsPanel_OnMsgUserSetNickname_00);
        UsersProxy.reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgUserSetDiscordId(): void {
        const selfUserId = HelpersMisc.getExisted(UsersModel.getSelfUserId(), UtilsClientErrorCode.ClientErrorCode.UserSettingsPanel_OnMsgUserSetDiscordId_00);
        UsersProxy.reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgMailSetIsNew(): void {
        this._updateRedForBtnMail();
    }
    private _onMsgMailGetAllMailArray(): void {
        this._updateRedForBtnMail();
    }
    private _onMsgMmGetReviewingMaps(): void {
        this._updateRedForBtnGameManagement();
    }

    private _onTouchedBtnDamageCalculator(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDamageCalculatorPanel, {
            data                    : null,
            war                     : null,
            needReviseWeaponType    : true,
        });
    }
    private _onTouchedBtnGraphicSettings(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserGraphicSettingsPanel, void 0);
    }
    private _onTouchedBtnChangeGameVersion(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChangeVersionPanel, void 0);
    }
    private _onTouchedBtnSoundSettings(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SoundsSettingsPanel, void 0);
    }
    private _onTouchedBtnMiscSettings(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserMiscSettingsPanel, void 0);
    }
    private _onTouchedBtnMail(): void {
        // this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MailPanel, void 0);
    }
    private _onTouchedBtnComplaint(): void {
        // this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({
            toUserId: UsersConstants.Common.AdminUserId,
        }) });
    }
    private async _onTouchedBtnGameChart(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonGameChartPanel, void 0);
    }
    private _onTouchedBtnGameManagement(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserGameManagementPanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
        this._updateRedForBtnMail();
        this._updateRedForBtnGameManagement();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0560);
        this._btnSoundSettings.setLangText(LangConstants.TextType.B0540);
        this._btnMiscSettings.setLangText(LangConstants.TextType.B1278);
        this._btnGraphicSettings.setLangText(LangConstants.TextType.B0984);
        this._btnChangeGameVersion.setText(`${LangUtils.getText(LangConstants.TextType.B1277)}: ${LangUtils.getGameVersionName(window.GAME_VERSION)}`);
        this._btnGameChart.setLangText(LangConstants.TextType.B0900);
        this._btnGameManagement.setLangText(LangConstants.TextType.B0878);
        this._btnComplaint.setLangText(LangConstants.TextType.B0453);
    }
    private async _updateGroupButtons(): Promise<void> {
        const group = this._groupButtons;
        group.removeAllItems(false);
        group.addItem(this._btnGraphicSettings, false);
        group.addItem(this._btnSoundSettings, false);
        group.addItem(this._btnMiscSettings, false);
        group.addItem(this._btnGameChart, false);
        group.addItem(this._btnComplaint, false);
        group.addItem(this._btnChangeGameVersion, true);
        if ((UsersModel.getIsSelfAdmin())                                           ||
            (UsersModel.getIsSelfMapCommittee())                                    ||
            (UsersModel.getIsSelfAutoTourneyCommittee())                            ||
            (UsersModel.getIsSelfCampaignManager())                                 ||
            ((await CampaignsManagementsProvider.getDesigningCampaignIdArray())?.length)
        ) {
            group.addItem(this._btnGameManagement, true);
        }
    }
    private _updateRedForBtnMail(): void {
        this._btnMail.setRedVisible(MailModelMailModel.checkIsRed());
    }
    private async _updateRedForBtnGameManagement(): Promise<void> {
        this._btnGameManagement.setRedVisible(await NormalMapModelNormalMapModel.checkIsRedForMapManagement());
    }
}
