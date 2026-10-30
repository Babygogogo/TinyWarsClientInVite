import {
    Lang_Utils,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    Users_Model,
    GamePanels_Manager,
    Users_Proxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";
import type { S as UserSetCoBgmSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserSetCoBgmSettings/S.ts";

export interface OpenData {
    gameConfig  : GameConfigs_GameConfig.GameConfig;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutCo!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnCo!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCoName!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupCoHead!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCoHead!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCoForce!       : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutPassive!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnPassive!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPassive!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutCop!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnPower!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPower!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutSp!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnSuperPower!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelSuperPower!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnReset!         : Ui_Interfaces_IUiButton.IUiButton;

    private _coCategoryId               : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,                           callback : this.closePanel },

            { ui : this._btnCo,                              callback : this._onTouchedBtnCo },
            { ui : this._btnReset,                           callback : this._onTouchedBtnReset },
            { ui : this._btnPassive,                         callback : this._onTouchedBtnPassive },
            { ui : this._btnPower,                           callback : this._onTouchedBtnPower },
            { ui : this._btnSuperPower,                      callback : this._onTouchedBtnSuperPower },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserSetCoBgmSettings,     callback : this._onNotifyMsgUserSetCoBgmSettings },
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
    private _onNotifyMsgUserSetCoBgmSettings(e: Egret_Egret.Event): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

        const data = e.data as UserSetCoBgmSettingsResponse;
        if (data.getCoCategoryId() === this._coCategoryId) {
            this._updateComponentsForCoAndBgm();
        }
    }

    private _onTouchedBtnCo(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoCategoryIdPanel, {
            availableCoCategoryIdArray : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryId        : this._coCategoryId,
            gameConfig                 : gameConfig,
            isBan                      : false,
            callbackOnConfirm          : coCategoryId => {
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                Users_Proxy.reqUserSetCoBgmSettings(coCategoryId, null);
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

        const coCategoryCfg = Helpers_Misc.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
        const bgmCodeArray  = (Users_Model.getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray() ?? coCategoryCfg.getBgmCodeArray());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig        : gameConfig,
            currentBgmCode    : bgmCodeArray[0],
            callbackOnConfirm : bgmCode => {
                Users_Proxy.reqUserSetCoBgmSettings(coCategoryId, [bgmCode, bgmCodeArray[1], bgmCodeArray[2]]);
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

        const coCategoryCfg = Helpers_Misc.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
        const bgmCodeArray  = (Users_Model.getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray() ?? coCategoryCfg.getBgmCodeArray());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig        : gameConfig,
            currentBgmCode    : bgmCodeArray[1],
            callbackOnConfirm : bgmCode => {
                Users_Proxy.reqUserSetCoBgmSettings(coCategoryId, [bgmCodeArray[0], bgmCode, bgmCodeArray[2]]);
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

        const coCategoryCfg = Helpers_Misc.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
        const bgmCodeArray  = (Users_Model.getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray() ?? coCategoryCfg.getBgmCodeArray());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig        : gameConfig,
            currentBgmCode    : bgmCodeArray[2],
            callbackOnConfirm : bgmCode => {
                Users_Proxy.reqUserSetCoBgmSettings(coCategoryId, [bgmCodeArray[0], bgmCodeArray[1], bgmCode]);
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0992);
        this._btnCo.setLangText(Lang_Constants.TextType.B0425);
        this._btnReset.setLangText(Lang_Constants.TextType.B0567);
        this._btnPassive.setLangText(Lang_Constants.TextType.B0576);
        this._btnPower.setLangText(Lang_Constants.TextType.B0577);
        this._btnSuperPower.setLangText(Lang_Constants.TextType.B0578);
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
                Users_Model.getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray()    ??
                coCategoryCfg?.getBgmCodeArray()                                                                                            ??
                []
            );

        this._labelCoName.setText(coCategoryCfg?.getName() ?? Lang_Constants.UndefinedError);
        this._labelPassive.setText(Lang_Utils.getBgmSfxName(bgmCodeArray[0], gameConfig) ?? Lang_Constants.UndefinedError);
        this._labelPower.setText(Lang_Utils.getBgmSfxName(bgmCodeArray[1], gameConfig) ?? Lang_Constants.UndefinedError);
        this._labelSuperPower.setText(Lang_Utils.getBgmSfxName(bgmCodeArray[2], gameConfig) ?? Lang_Constants.UndefinedError);

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

            this._imgCoForce.loadSource(Helpers_ImageSource.getCoEyeBackgroundByCoId(gcData, coId) ?? ``);
            this._imgCoHead.loadSource(Helpers_ImageSource.getCoEye(gcData, coId, true) ?? ``);
        }
    }
}
