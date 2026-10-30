import {
    Notifications_Dispatcher,
    Lang_Utils,
    GamePanels_Dict,
    Users_Model,
    Lang_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Users_Proxy,
    LocalData_Storage,
    Sounds_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiSwitch,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelLanguage!                            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnLanguage!                              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupHelpAutoScrollMap!                   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelAutoScrollMap!                       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchAutoScrollMap!                    : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _groupHelpIsReplayResultVisible!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelIsReplayResultVisible!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchIsReplayResultVisible!            : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _groupHelpSetPath!                         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSetPath!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchSetPath!                          : Ui_Interfaces_IUiSwitch.IUiSwitch;

    private readonly _groupHelpCanAcceptNotFollowingMessages!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCanAcceptNotFollowingMessages!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiSwitchCanAcceptNotFollowingMessages!    : Ui_Interfaces_IUiSwitch.IUiSwitch;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.UserSettingsIsAutoScrollMapChanged,                  callback : this._onNotifyUserSettingsIsAutoScrollMapChanged },
            { type : Notifications_TypeId.TypeId.UserSettingsIsReplayResultVisibleChanged,            callback : this._onNotifyUserSettingsIsReplayResultVisibleChanged },
            { type : Notifications_TypeId.TypeId.UserSettingsIsSetPathModeChanged,                    callback : this._onNotifyUserSettingsIsSetPathModeChanged },
            { type : Notifications_TypeId.TypeId.UserSettingsCanAcceptNotFollowingMessagesChanged,    callback : this._onNotifyUserSettingsCanAcceptNotFollowingMessagesChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                   callback : this.closePanel },
            { ui : this._btnLanguage,                                callback : this._onTouchedBtnLanguage },
            { ui : this._groupHelpAutoScrollMap,                     callback : this._onTouchedGroupHelpAutoScrollMap },
            { ui : this._groupHelpIsReplayResultVisible,             callback : this._onTouchedGroupHelpIsReplayResultVisible },
            { ui : this._groupHelpSetPath,                           callback : this._onTouchedGroupHelpSetPath },
            { ui : this._groupHelpCanAcceptNotFollowingMessages,     callback : this._onTouchedGroupHelpCanAcceptNotFollowingMessages },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._uiSwitchAutoScrollMap.setCallbackOnTouch(() => {
            Users_Proxy.reqUserSetSettings({
                isAutoScrollMap : !Users_Model.getSelfSettingsIsAutoScrollMap(),
                coBgmSettings   : [],
            });
        });
        this._uiSwitchIsReplayResultVisible.setCallbackOnTouch(() => {
            Users_Proxy.reqUserSetSettings({
                isReplayResultVisible : !Users_Model.getSelfSettingsIsReplayResultVisible(),
                coBgmSettings         : [],
            });
        });
        this._uiSwitchSetPath.setCallbackOnTouch(() => {
            Users_Proxy.reqUserSetSettings({
                isSetPathMode : !Users_Model.getSelfSettingsIsSetPathMode(),
                coBgmSettings : [],
            });
        });
        this._uiSwitchCanAcceptNotFollowingMessages.setCallbackOnTouch(() => {
            Users_Proxy.reqUserSetSettings({
                canAcceptNotFollowingMessages : !Users_Model.getSelfSettingsCanAcceptNotFollowingMessages(),
                coBgmSettings                 : [],
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0627),
            availableNumberArray : [
                Lang_Constants.LanguageType.Chinese,
                Lang_Constants.LanguageType.English,
                Lang_Constants.LanguageType.Spanish,
            ],
            currentNumber     : Lang_Utils.getCurrentLanguageType(),
            getNumberMainText : num => Lang_Utils.getLanguageTypeName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm : num => {
                Lang_Utils.setCurrentLanguageType(num);
                LocalData_Storage.setLanguageType(num);

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.LanguageChanged);
            },
        });
    }
    private _onTouchedGroupHelpAutoScrollMap(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0823),
        });
    }
    private _onTouchedGroupHelpIsReplayResultVisible(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0824),
        });
    }
    private _onTouchedGroupHelpSetPath(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0822),
        });
    }
    private _onTouchedGroupHelpCanAcceptNotFollowingMessages(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0888),
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1278);
        this._labelLanguage.setLangText(Lang_Constants.TextType.B0627);
        this._labelAutoScrollMap.setLangText(Lang_Constants.TextType.B0793);
        this._labelIsReplayResultVisible.setLangText(Lang_Constants.TextType.B1241);
        this._labelSetPath.setLangText(Lang_Constants.TextType.B0430);
        this._labelCanAcceptNotFollowingMessages.setLangText(Lang_Constants.TextType.B1353);

        this._btnLanguage.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getCurrentLanguageType()) ?? Lang_Constants.UndefinedError);
        this._groupHelpAutoScrollMap.arrangeItems();
        this._groupHelpCanAcceptNotFollowingMessages.arrangeItems();
        this._groupHelpIsReplayResultVisible.arrangeItems();
        this._groupHelpSetPath.arrangeItems();
    }

    private _updateSwitchAutoScrollMap(isTween: boolean): void {
        this._uiSwitchAutoScrollMap.setIsSwitchOn(Users_Model.getSelfSettingsIsAutoScrollMap(), isTween);
    }
    private _updateSwitchIsReplayResultVisible(isTween: boolean): void {
        this._uiSwitchIsReplayResultVisible.setIsSwitchOn(Users_Model.getSelfSettingsIsReplayResultVisible(), isTween);
    }
    private _updateSwitchSetPath(isTween: boolean): void {
        this._uiSwitchSetPath.setIsSwitchOn(Users_Model.getSelfSettingsIsSetPathMode(), isTween);
    }
    private _updateSwitchCanAcceptNotFollowingMessages(isTween: boolean): void {
        this._uiSwitchCanAcceptNotFollowingMessages.setIsSwitchOn(Users_Model.getSelfSettingsCanAcceptNotFollowingMessages(), isTween);
    }
}
