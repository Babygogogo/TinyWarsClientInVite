import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgUserSetCoBgmSettings/S.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    gameConfig  : GameConfigGcData.GcData;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutCo!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnCo!            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCoName!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupCoHead!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCoHead!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCoForce!       : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutPassive!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnPassive!       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPassive!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutCop!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnPower!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPower!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutSp!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnSuperPower!    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelSuperPower!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnReset!         : UiInterfacesIUiButton.IUiButton;

    private _coCategoryId               : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                           callback: this.closePanel },

            { ui: this._btnCo,                              callback: this._onTouchedBtnCo },
            { ui: this._btnReset,                           callback: this._onTouchedBtnReset },
            { ui: this._btnPassive,                         callback: this._onTouchedBtnPassive },
            { ui: this._btnPower,                           callback: this._onTouchedBtnPower },
            { ui: this._btnSuperPower,                      callback: this._onTouchedBtnSuperPower },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserSetCoBgmSettings,     callback: this._onNotifyMsgUserSetCoBgmSettings },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        this._coCategoryId = gameConfig.getAllEnabledCoCategoryIdArray()[0];
        this._updateComponentsForCoAndBgm();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserSetCoBgmSettings(e: VendorEgretEgret.Event): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS.S;
        if (data.getCoCategoryId() === this._coCategoryId) {
            this._updateComponentsForCoAndBgm();
        }
    }

    private _onTouchedBtnCo(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoCategoryIdPanel, {
            availableCoCategoryIdArray  : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryId         : this._coCategoryId,
            gameConfig                  : gameConfig,
            isBan                       : false,
            callbackOnConfirm           : coCategoryId => {
                this._coCategoryId = coCategoryId;
                this._updateComponentsForCoAndBgm();
            },
        });
    }
    private _onTouchedBtnReset(): void {
        const coCategoryId = this._coCategoryId;
        if (coCategoryId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                UsersProxy.reqUserSetCoBgmSettings(coCategoryId, null);
            },
        });
    }
    private _onTouchedBtnPassive(): void {
        const coCategoryId = this._coCategoryId;
        if (coCategoryId == null) {
            return;
        }

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const coCategoryCfg = HelpersMisc.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
        const bgmCodeArray  = HelpersMisc.getExisted(UsersModel.getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray() ?? coCategoryCfg.getBgmCodeArray());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : bgmCodeArray[0],
            callbackOnConfirm   : bgmCode => {
                UsersProxy.reqUserSetCoBgmSettings(coCategoryId, [bgmCode, bgmCodeArray[1], bgmCodeArray[2]]);
            },
        });
    }
    private _onTouchedBtnPower(): void {
        const coCategoryId = this._coCategoryId;
        if (coCategoryId == null) {
            return;
        }

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const coCategoryCfg = HelpersMisc.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
        const bgmCodeArray  = HelpersMisc.getExisted(UsersModel.getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray() ?? coCategoryCfg.getBgmCodeArray());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : bgmCodeArray[1],
            callbackOnConfirm   : bgmCode => {
                UsersProxy.reqUserSetCoBgmSettings(coCategoryId, [bgmCodeArray[0], bgmCode, bgmCodeArray[2]]);
            },
        });
    }
    private _onTouchedBtnSuperPower(): void {
        const coCategoryId = this._coCategoryId;
        if (coCategoryId == null) {
            return;
        }

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const coCategoryCfg = HelpersMisc.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
        const bgmCodeArray  = HelpersMisc.getExisted(UsersModel.getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray() ?? coCategoryCfg.getBgmCodeArray());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : bgmCodeArray[2],
            callbackOnConfirm   : bgmCode => {
                UsersProxy.reqUserSetCoBgmSettings(coCategoryId, [bgmCodeArray[0], bgmCodeArray[1], bgmCode]);
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0992));
        this._btnCo.setText(LangUtils.getText(LangConstants.TextType.B0425));
        this._btnReset.setText(LangUtils.getText(LangConstants.TextType.B0567));
        this._btnPassive.setText(LangUtils.getCoSkillTypeName(CoSkillsConstants.SkillTypeId.Passive) ?? LangConstants.UndefinedError);
        this._btnPower.setText(LangUtils.getCoSkillTypeName(CoSkillsConstants.SkillTypeId.Power) ?? LangConstants.UndefinedError);
        this._btnSuperPower.setText(LangUtils.getCoSkillTypeName(CoSkillsConstants.SkillTypeId.SuperPower) ?? LangConstants.UndefinedError);
    }

    private _updateComponentsForCoAndBgm(): void {
        this._updateGroupCoHead();

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const coCategoryId  = this._coCategoryId;
        const coCategoryCfg = coCategoryId == null ? null : gameConfig.getCoCategoryCfg(coCategoryId);
        const bgmCodeArray  = coCategoryId == null
            ? []
            : (
                UsersModel.getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray()    ??
                coCategoryCfg?.getBgmCodeArray()                                                                                            ??
                []
            );

        this._labelCoName.setText(coCategoryCfg?.getName() ?? LangConstants.UndefinedError);
        this._labelPassive.setText(LangUtils.getBgmSfxName(bgmCodeArray[0], gameConfig) ?? LangConstants.UndefinedError);
        this._labelPower.setText(LangUtils.getBgmSfxName(bgmCodeArray[1], gameConfig) ?? LangConstants.UndefinedError);
        this._labelSuperPower.setText(LangUtils.getBgmSfxName(bgmCodeArray[2], gameConfig) ?? LangConstants.UndefinedError);

        this._layoutCo.arrangeItems();
        this._layoutPassive.arrangeItems();
        this._layoutCop.arrangeItems();
        this._layoutSp.arrangeItems();
    }

    private _updateGroupCoHead(): void {
        const gcData = this.getOpenData()?.gameConfig;
        if (gcData == null) {
            return;
        }

        const coCategoryId  = this._coCategoryId;
        const coId          = coCategoryId == null ? null : gcData.getCoIdByCategoryId(coCategoryId);
        const group         = this._groupCoHead;
        if (coId == null) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            this._imgCoForce.loadSource(HelpersImageSource.getCoEyeBackgroundByCoId(gcData, coId) ?? ``);
            this._imgCoHead.loadSource(HelpersImageSource.getCoEye(gcData, coId, true) ?? ``);
        }
    }
}
