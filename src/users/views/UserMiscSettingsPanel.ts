import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage from "../../localData/Storage.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiSwitch from "../../ui/interfaces/IUiSwitch.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelLanguage!                            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnLanguage!                              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupHelpAutoScrollMap!                   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelAutoScrollMap!                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchAutoScrollMap!                    : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _groupHelpIsReplayResultVisible!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelIsReplayResultVisible!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchIsReplayResultVisible!            : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _groupHelpSetPath!                         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSetPath!                             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchSetPath!                          : UiInterfacesIUiSwitch.IUiSwitch;

    private readonly _groupHelpCanAcceptNotFollowingMessages!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCanAcceptNotFollowingMessages!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _uiSwitchCanAcceptNotFollowingMessages!    : UiInterfacesIUiSwitch.IUiSwitch;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UserSettingsIsAutoScrollMapChanged,                  callback: this._onNotifyUserSettingsIsAutoScrollMapChanged },
            { type: NotificationsTypeId.TypeId.UserSettingsIsReplayResultVisibleChanged,            callback: this._onNotifyUserSettingsIsReplayResultVisibleChanged },
            { type: NotificationsTypeId.TypeId.UserSettingsIsSetPathModeChanged,                    callback: this._onNotifyUserSettingsIsSetPathModeChanged },
            { type: NotificationsTypeId.TypeId.UserSettingsCanAcceptNotFollowingMessagesChanged,    callback: this._onNotifyUserSettingsCanAcceptNotFollowingMessagesChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnLanguage,                                callback: this._onTouchedBtnLanguage },
            { ui: this._groupHelpAutoScrollMap,                     callback: this._onTouchedGroupHelpAutoScrollMap },
            { ui: this._groupHelpIsReplayResultVisible,             callback: this._onTouchedGroupHelpIsReplayResultVisible },
            { ui: this._groupHelpSetPath,                           callback: this._onTouchedGroupHelpSetPath },
            { ui: this._groupHelpCanAcceptNotFollowingMessages,     callback: this._onTouchedGroupHelpCanAcceptNotFollowingMessages },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._uiSwitchAutoScrollMap.setCallbackOnTouch(() => {
            UsersProxy.reqUserSetSettings({
                isAutoScrollMap : !UsersModel.getSelfSettingsIsAutoScrollMap(),
                coBgmSettings   : [],
            });
        });
        this._uiSwitchIsReplayResultVisible.setCallbackOnTouch(() => {
            UsersProxy.reqUserSetSettings({
                isReplayResultVisible   : !UsersModel.getSelfSettingsIsReplayResultVisible(),
                coBgmSettings           : [],
            });
        });
        this._uiSwitchSetPath.setCallbackOnTouch(() => {
            UsersProxy.reqUserSetSettings({
                isSetPathMode   : !UsersModel.getSelfSettingsIsSetPathMode(),
                coBgmSettings   : [],
            });
        });
        this._uiSwitchCanAcceptNotFollowingMessages.setCallbackOnTouch(() => {
            UsersProxy.reqUserSetSettings({
                canAcceptNotFollowingMessages   : !UsersModel.getSelfSettingsCanAcceptNotFollowingMessages(),
                coBgmSettings                   : [],
            });
        });

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyUserSettingsIsAutoScrollMapChanged(): void {
        this._updateSwitchAutoScrollMap(true);
    }
    private _onNotifyUserSettingsIsReplayResultVisibleChanged(): void {
        this._updateSwitchIsReplayResultVisible(true);
    }
    private _onNotifyUserSettingsIsSetPathModeChanged(): void {
        this._updateSwitchSetPath(true);
    }
    private _onNotifyUserSettingsCanAcceptNotFollowingMessagesChanged(): void {
        this._updateSwitchCanAcceptNotFollowingMessages(true);
    }

    private _onTouchedBtnLanguage(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0627),
            availableNumberArray    : [
                LangConstants.LanguageType.Chinese,
                LangConstants.LanguageType.English,
                LangConstants.LanguageType.Spanish,
            ],
            currentNumber           : LangUtils.getCurrentLanguageType(),
            getNumberMainText       : num => LangUtils.getLanguageTypeName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : num => {
                LangUtils.setCurrentLanguageType(num);
                LocalDataStorage.setLanguageType(num);

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.LanguageChanged);
            },
        });
    }
    private _onTouchedGroupHelpAutoScrollMap(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0823),
        });
    }
    private _onTouchedGroupHelpIsReplayResultVisible(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0824),
        });
    }
    private _onTouchedGroupHelpSetPath(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0822),
        });
    }
    private _onTouchedGroupHelpCanAcceptNotFollowingMessages(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0888),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateSwitchAutoScrollMap(false);
        this._updateSwitchIsReplayResultVisible(false);
        this._updateSwitchSetPath(false);
        this._updateSwitchCanAcceptNotFollowingMessages(false);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B1278);
        this._labelLanguage.setLangText(LangConstants.TextType.B0627);
        this._labelAutoScrollMap.setLangText(LangConstants.TextType.B0793);
        this._labelIsReplayResultVisible.setLangText(LangConstants.TextType.B1241);
        this._labelSetPath.setLangText(LangConstants.TextType.B0430);
        this._labelCanAcceptNotFollowingMessages.setLangText(LangConstants.TextType.B1353);

        this._btnLanguage.setText(LangUtils.getLanguageTypeName(LangUtils.getCurrentLanguageType()) ?? LangConstants.UndefinedError);
        this._groupHelpAutoScrollMap.arrangeItems();
        this._groupHelpCanAcceptNotFollowingMessages.arrangeItems();
        this._groupHelpIsReplayResultVisible.arrangeItems();
        this._groupHelpSetPath.arrangeItems();
    }

    private _updateSwitchAutoScrollMap(isTween: boolean): void {
        this._uiSwitchAutoScrollMap.setIsSwitchOn(UsersModel.getSelfSettingsIsAutoScrollMap(), isTween);
    }
    private _updateSwitchIsReplayResultVisible(isTween: boolean): void {
        this._uiSwitchIsReplayResultVisible.setIsSwitchOn(UsersModel.getSelfSettingsIsReplayResultVisible(), isTween);
    }
    private _updateSwitchSetPath(isTween: boolean): void {
        this._uiSwitchSetPath.setIsSwitchOn(UsersModel.getSelfSettingsIsSetPathMode(), isTween);
    }
    private _updateSwitchCanAcceptNotFollowingMessages(isTween: boolean): void {
        this._uiSwitchCanAcceptNotFollowingMessages.setIsSwitchOn(UsersModel.getSelfSettingsCanAcceptNotFollowingMessages(), isTween);
    }
}
