import {
    AuxiliaryTypes_ChatToTarget,
    Mail_Model_MailModel,
    NormalMap_Model_NormalMapModel,
    Utils_ClientErrorCode,
    Users_Constants,
    Campaigns_Managements_Provider,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Users_Model,
    GamePanels_Manager,
    Users_Proxy,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDamageCalculator!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMail!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _groupButtons!                 : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnGraphicSettings!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSoundSettings!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMiscSettings!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeGameVersion!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnComplaint!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnGameChart!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnGameManagement!            : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserGetPublicInfo,    callback : this._onMsgUserGetPublicInfo },
            { type : Notifications_TypeId.TypeId.MsgUserSetNickname,      callback : this._onMsgUserSetNickname },
            { type : Notifications_TypeId.TypeId.MsgUserSetDiscordInfo,   callback : this._onMsgUserSetDiscordId },
            { type : Notifications_TypeId.TypeId.MsgMailSetIsNew,         callback : this._onMsgMailSetIsNew },
            { type : Notifications_TypeId.TypeId.MsgMailGetAllMailArray,  callback : this._onMsgMailGetAllMailArray },
            { type : Notifications_TypeId.TypeId.MsgMmGetReviewingMaps,   callback : this._onMsgMmGetReviewingMaps },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnDamageCalculator,        callback : this._onTouchedBtnDamageCalculator },
            { ui : this._btnGraphicSettings,         callback : this._onTouchedBtnGraphicSettings },
            { ui : this._btnChangeGameVersion,       callback : this._onTouchedBtnChangeGameVersion },
            { ui : this._btnSoundSettings,           callback : this._onTouchedBtnSoundSettings },
            { ui : this._btnMiscSettings,            callback : this._onTouchedBtnMiscSettings },
            { ui : this._btnMail,                    callback : this._onTouchedBtnMail },
            { ui : this._btnComplaint,               callback : this._onTouchedBtnComplaint },
            { ui : this._btnGameChart,               callback : this._onTouchedBtnGameChart },
            { ui : this._btnGameManagement,          callback : this._onTouchedBtnGameManagement },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        const selfUserId = Helpers_Misc.getExisted(Users_Model.getSelfUserId(), Utils_ClientErrorCode.ClientErrorCode.UserSettingsPanel_OnOpened_00);
        Users_Proxy.reqUserGetPublicInfo(selfUserId);

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserGetPublicInfo(): void {
        this._updateView();
    }
    private _onMsgUserSetNickname(): void {
        const selfUserId = Helpers_Misc.getExisted(Users_Model.getSelfUserId(), Utils_ClientErrorCode.ClientErrorCode.UserSettingsPanel_OnMsgUserSetNickname_00);
        Users_Proxy.reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgUserSetDiscordId(): void {
        const selfUserId = Helpers_Misc.getExisted(Users_Model.getSelfUserId(), Utils_ClientErrorCode.ClientErrorCode.UserSettingsPanel_OnMsgUserSetDiscordId_00);
        Users_Proxy.reqUserGetPublicInfo(selfUserId);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDamageCalculatorPanel, {
            data                 : null,
            war                  : null,
            needReviseWeaponType : true,
        });
    }
    private _onTouchedBtnGraphicSettings(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserGraphicSettingsPanel, void 0);
    }
    private _onTouchedBtnChangeGameVersion(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChangeVersionPanel, void 0);
    }
    private _onTouchedBtnSoundSettings(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SoundsSettingsPanel, void 0);
    }
    private _onTouchedBtnMiscSettings(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserMiscSettingsPanel, void 0);
    }
    private _onTouchedBtnMail(): void {
        // this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MailPanel, void 0);
    }
    private _onTouchedBtnComplaint(): void {
        // this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, {
            toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({
                toUserId : Users_Constants.Common.AdminUserId,
            }), 
        });
    }
    private async _onTouchedBtnGameChart(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonGameChartPanel, void 0);
    }
    private _onTouchedBtnGameManagement(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserGameManagementPanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
        this._updateRedForBtnMail();
        this._updateRedForBtnGameManagement();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0560);
        this._btnSoundSettings.setLangText(Lang_Constants.TextType.B0540);
        this._btnMiscSettings.setLangText(Lang_Constants.TextType.B1278);
        this._btnGraphicSettings.setLangText(Lang_Constants.TextType.B0984);
        this._btnChangeGameVersion.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1277)}: ${Lang_Utils.getGameVersionName(window.GAME_VERSION)}`);
        this._btnGameChart.setLangText(Lang_Constants.TextType.B0900);
        this._btnGameManagement.setLangText(Lang_Constants.TextType.B0878);
        this._btnComplaint.setLangText(Lang_Constants.TextType.B0453);
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
        if ((Users_Model.getIsSelfAdmin())                                           ||
            (Users_Model.getIsSelfMapCommittee())                                    ||
            (Users_Model.getIsSelfAutoTourneyCommittee())                            ||
            (Users_Model.getIsSelfCampaignManager())                                 ||
            ((await Campaigns_Managements_Provider.getDesigningCampaignIdArray())?.length)
        ) {
            group.addItem(this._btnGameManagement, true);
        }
    }
    private _updateRedForBtnMail(): void {
        this._btnMail.setRedVisible(Mail_Model_MailModel.checkIsRed());
    }
    private async _updateRedForBtnGameManagement(): Promise<void> {
        this._btnGameManagement.setRedVisible(await NormalMap_Model_NormalMapModel.checkIsRedForMapManagement());
    }
}
