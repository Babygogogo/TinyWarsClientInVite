import { showLang } from "../../FloatText.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getBgmSfxName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getSelfSettingsBgmCodeForLobby, getSelfSettingsBgmCodeForMapEditor } from "../Model.ts";
import { reqUserSetSceneBgmSettings } from "../Proxy.ts";

export type OpenData = {
    gameConfig  : GameConfig;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _layoutContent!        : IUiLayout;
    private readonly _layoutLobby!          : IUiLayout;
    private readonly _labelLobby!           : IUiLabel;
    private readonly _btnLobby!             : IUiButton;

    private readonly _layoutMapEditor!      : IUiLayout;
    private readonly _labelMapEditor!       : IUiLabel;
    private readonly _btnMapEditor!         : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserSetSceneBgmSettings,  callback: this._onNotifyMsgUserSetSceneBgmSettings },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                           callback: this.closePanel },

            { ui: this._btnLobby,                           callback: this._onTouchedBtnLobby },
            { ui: this._btnMapEditor,                       callback: this._onTouchedBtnMapEditor },
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
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserSetSceneBgmSettings(): void {
        showLang(TextType.OperationSucceeded);
        this._updateBtnLobby();
        this._updateBtnMapEditor();
    }

    private async _onTouchedBtnLobby(): Promise<void> {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const currentBgmCode = getSelfSettingsBgmCodeForLobby();
        openPanel(getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : currentBgmCode,
            callbackOnConfirm   : newBgmCode => {
                if (newBgmCode === currentBgmCode) {
                    showLang(TextType.OperationSucceeded);
                } else {
                    reqUserSetSceneBgmSettings({
                        lobbyBgmCode    : newBgmCode,
                    });
                }
            },
        });
    }

    private async _onTouchedBtnMapEditor(): Promise<void> {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const currentBgmCode = getSelfSettingsBgmCodeForMapEditor();
        openPanel(getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : currentBgmCode,
            callbackOnConfirm   : newBgmCode => {
                if (newBgmCode === currentBgmCode) {
                    showLang(TextType.OperationSucceeded);
                } else {
                    reqUserSetSceneBgmSettings({
                        mapEditorBgmCode    : newBgmCode,
                    });
                }
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // view
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1286);
        this._labelLobby.setLangText(TextType.B1288);
        this._labelMapEditor.setLangText(TextType.B0271);

        this._layoutLobby.arrangeItems();
        this._layoutMapEditor.arrangeItems();
        this._layoutContent.arrangeItems();
        this._updateBtnLobby();
        this._updateBtnMapEditor();
    }

    private _updateBtnLobby(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const bgmCode = getSelfSettingsBgmCodeForLobby();
        this._btnLobby.setText(getBgmSfxName(bgmCode, gameConfig) ?? UndefinedError);
    }

    private _updateBtnMapEditor(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const bgmCode = getSelfSettingsBgmCodeForMapEditor();
        this._btnMapEditor.setText(getBgmSfxName(bgmCode, gameConfig) ?? UndefinedError);
    }
}
