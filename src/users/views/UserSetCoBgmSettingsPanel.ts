import { showLang } from "../../FloatText.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    getCoEyeBackgroundByCoId,
    getCoEye,
} from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getBgmSfxName,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as UserSetCoBgmSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserSetCoBgmSettings/S.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getSelfSettings } from "../Model.ts";
import { reqUserSetCoBgmSettings } from "../Proxy.ts";
import type { Event } from "../../egret/Egret.ts";

export interface OpenData {
    gameConfig  : GameConfig;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _layoutCo!         : IUiLayout;
    private readonly _btnCo!            : IUiButton;
    private readonly _labelCoName!      : IUiLabel;
    private readonly _groupCoHead!      : IUiContainer;
    private readonly _imgCoHead!        : IUiImage;
    private readonly _imgCoForce!       : IUiImage;

    private readonly _layoutPassive!    : IUiLayout;
    private readonly _btnPassive!       : IUiButton;
    private readonly _labelPassive!     : IUiLabel;

    private readonly _layoutCop!        : IUiLayout;
    private readonly _btnPower!         : IUiButton;
    private readonly _labelPower!       : IUiLabel;

    private readonly _layoutSp!         : IUiLayout;
    private readonly _btnSuperPower!    : IUiButton;
    private readonly _labelSuperPower!  : IUiLabel;

    private readonly _btnReset!         : IUiButton;

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
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserSetCoBgmSettings,     callback: this._onNotifyMsgUserSetCoBgmSettings },
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
    private _onNotifyMsgUserSetCoBgmSettings(e: Event): void {
        showLang(TextType.OperationSucceeded);

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

        openPanel(getDict().CommonChooseSingleCoCategoryIdPanel, {
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

        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                reqUserSetCoBgmSettings(coCategoryId, null);
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

        const coCategoryCfg = getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
        const bgmCodeArray  = (getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray() ?? coCategoryCfg.getBgmCodeArray());
        openPanel(getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : bgmCodeArray[0],
            callbackOnConfirm   : bgmCode => {
                reqUserSetCoBgmSettings(coCategoryId, [bgmCode, bgmCodeArray[1], bgmCodeArray[2]]);
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

        const coCategoryCfg = getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
        const bgmCodeArray  = (getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray() ?? coCategoryCfg.getBgmCodeArray());
        openPanel(getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : bgmCodeArray[1],
            callbackOnConfirm   : bgmCode => {
                reqUserSetCoBgmSettings(coCategoryId, [bgmCodeArray[0], bgmCode, bgmCodeArray[2]]);
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

        const coCategoryCfg = getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
        const bgmCodeArray  = (getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray() ?? coCategoryCfg.getBgmCodeArray());
        openPanel(getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : bgmCodeArray[2],
            callbackOnConfirm   : bgmCode => {
                reqUserSetCoBgmSettings(coCategoryId, [bgmCodeArray[0], bgmCodeArray[1], bgmCode]);
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0992);
        this._btnCo.setLangText(TextType.B0425);
        this._btnReset.setLangText(TextType.B0567);
        this._btnPassive.setLangText(TextType.B0576);
        this._btnPower.setLangText(TextType.B0577);
        this._btnSuperPower.setLangText(TextType.B0578);
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
                getSelfSettings()?.getCoBgmSettings()?.find(v => v.getCoCategoryId() === coCategoryId)?.getBgmCodeArray()    ??
                coCategoryCfg?.getBgmCodeArray()                                                                                            ??
                []
            );

        this._labelCoName.setText(coCategoryCfg?.getName() ?? UndefinedError);
        this._labelPassive.setText(getBgmSfxName(bgmCodeArray[0], gameConfig) ?? UndefinedError);
        this._labelPower.setText(getBgmSfxName(bgmCodeArray[1], gameConfig) ?? UndefinedError);
        this._labelSuperPower.setText(getBgmSfxName(bgmCodeArray[2], gameConfig) ?? UndefinedError);

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

            this._imgCoForce.loadSource(getCoEyeBackgroundByCoId(gcData, coId) ?? ``);
            this._imgCoHead.loadSource(getCoEye(gcData, coId, true) ?? ``);
        }
    }
}
