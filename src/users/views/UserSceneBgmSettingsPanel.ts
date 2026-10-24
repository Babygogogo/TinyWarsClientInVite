import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";

export type OpenData = {
    gameConfig  : GameConfigGcData.GcData;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutContent!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutLobby!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelLobby!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnLobby!             : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutMapEditor!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapEditor!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnMapEditor!         : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserSetSceneBgmSettings,  callback: this._onNotifyMsgUserSetSceneBgmSettings },
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
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        this._updateBtnLobby();
        this._updateBtnMapEditor();
    }

    private async _onTouchedBtnLobby(): Promise<void> {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const currentBgmCode = UsersModel.getSelfSettingsBgmCodeForLobby();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : currentBgmCode,
            callbackOnConfirm   : newBgmCode => {
                if (newBgmCode === currentBgmCode) {
                    FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                } else {
                    UsersProxy.reqUserSetSceneBgmSettings({
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

        const currentBgmCode = UsersModel.getSelfSettingsBgmCodeForMapEditor();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : gameConfig,
            currentBgmCode      : currentBgmCode,
            callbackOnConfirm   : newBgmCode => {
                if (newBgmCode === currentBgmCode) {
                    FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                } else {
                    UsersProxy.reqUserSetSceneBgmSettings({
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1286));
        this._labelLobby.setText(LangUtils.getText(LangConstants.TextType.B1288));
        this._labelMapEditor.setText(LangUtils.getText(LangConstants.TextType.B0271));

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

        const bgmCode = UsersModel.getSelfSettingsBgmCodeForLobby();
        this._btnLobby.setText(LangUtils.getBgmSfxName(bgmCode, gameConfig) ?? LangConstants.UndefinedError);
    }

    private _updateBtnMapEditor(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const bgmCode = UsersModel.getSelfSettingsBgmCodeForMapEditor();
        this._btnMapEditor.setText(LangUtils.getBgmSfxName(bgmCode, gameConfig) ?? LangConstants.UndefinedError);
    }
}
