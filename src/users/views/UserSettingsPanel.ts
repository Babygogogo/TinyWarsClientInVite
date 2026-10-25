import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { getDesigningCampaignIdArray } from "../../campaigns/managements/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getGameVersionName } from "../../lang/Utils.ts";
import { checkIsRed } from "../../mail/model/MailModel.ts";
import { checkIsRedForMapManagement } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { Common } from "../Constants.ts";
import { getSelfUserId, getIsSelfAdmin, getIsSelfMapCommittee, getIsSelfAutoTourneyCommittee, getIsSelfCampaignManager } from "../Model.ts";
import { reqUserGetPublicInfo } from "../Proxy.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;
    private readonly _btnDamageCalculator!          : IUiButton;
    private readonly _btnMail!                      : IUiButton;
    private readonly _group!                        : IUiContainer;

    private readonly _groupButtons!                 : IUiLayout;
    private readonly _btnGraphicSettings!           : IUiButton;
    private readonly _btnSoundSettings!             : IUiButton;
    private readonly _btnMiscSettings!              : IUiButton;
    private readonly _btnChangeGameVersion!         : IUiButton;
    private readonly _btnComplaint!                 : IUiButton;
    private readonly _btnGameChart!                 : IUiButton;
    private readonly _btnGameManagement!            : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserGetPublicInfo,    callback: this._onMsgUserGetPublicInfo },
            { type: TypeId.MsgUserSetNickname,      callback: this._onMsgUserSetNickname },
            { type: TypeId.MsgUserSetDiscordInfo,   callback: this._onMsgUserSetDiscordId },
            { type: TypeId.MsgMailSetIsNew,         callback: this._onMsgMailSetIsNew },
            { type: TypeId.MsgMailGetAllMailArray,  callback: this._onMsgMailGetAllMailArray },
            { type: TypeId.MsgMmGetReviewingMaps,   callback: this._onMsgMmGetReviewingMaps },
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

        const selfUserId = getExisted(getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnOpened_00);
        reqUserGetPublicInfo(selfUserId);

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserGetPublicInfo(): void {
        this._updateView();
    }
    private _onMsgUserSetNickname(): void {
        const selfUserId = getExisted(getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnMsgUserSetNickname_00);
        reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgUserSetDiscordId(): void {
        const selfUserId = getExisted(getSelfUserId(), ClientErrorCode.UserSettingsPanel_OnMsgUserSetDiscordId_00);
        reqUserGetPublicInfo(selfUserId);
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
        openPanel(getDict().CommonDamageCalculatorPanel, {
            data                    : null,
            war                     : null,
            needReviseWeaponType    : true,
        });
    }
    private _onTouchedBtnGraphicSettings(): void {
        openPanel(getDict().UserGraphicSettingsPanel, void 0);
    }
    private _onTouchedBtnChangeGameVersion(): void {
        openPanel(getDict().CommonChangeVersionPanel, void 0);
    }
    private _onTouchedBtnSoundSettings(): void {
        openPanel(getDict().SoundsSettingsPanel, void 0);
    }
    private _onTouchedBtnMiscSettings(): void {
        openPanel(getDict().UserMiscSettingsPanel, void 0);
    }
    private _onTouchedBtnMail(): void {
        // this.closePanel();
        openPanel(getDict().MailPanel, void 0);
    }
    private _onTouchedBtnComplaint(): void {
        // this.closePanel();
        openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({
            toUserId: Common.AdminUserId,
        }) });
    }
    private async _onTouchedBtnGameChart(): Promise<void> {
        openPanel(getDict().CommonGameChartPanel, void 0);
    }
    private _onTouchedBtnGameManagement(): void {
        openPanel(getDict().UserGameManagementPanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
        this._updateRedForBtnMail();
        this._updateRedForBtnGameManagement();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0560);
        this._btnSoundSettings.setLangText(TextType.B0540);
        this._btnMiscSettings.setLangText(TextType.B1278);
        this._btnGraphicSettings.setLangText(TextType.B0984);
        this._btnChangeGameVersion.setText(`${getText(TextType.B1277)}: ${getGameVersionName(window.GAME_VERSION)}`);
        this._btnGameChart.setLangText(TextType.B0900);
        this._btnGameManagement.setLangText(TextType.B0878);
        this._btnComplaint.setLangText(TextType.B0453);
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
        if ((getIsSelfAdmin())                                           ||
            (getIsSelfMapCommittee())                                    ||
            (getIsSelfAutoTourneyCommittee())                            ||
            (getIsSelfCampaignManager())                                 ||
            ((await getDesigningCampaignIdArray())?.length)
        ) {
            group.addItem(this._btnGameManagement, true);
        }
    }
    private _updateRedForBtnMail(): void {
        this._btnMail.setRedVisible(checkIsRed());
    }
    private async _updateRedForBtnGameManagement(): Promise<void> {
        this._btnGameManagement.setRedVisible(await checkIsRedForMapManagement());
    }
}
