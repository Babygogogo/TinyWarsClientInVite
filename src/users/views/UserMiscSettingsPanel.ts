import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    TextType,
    LanguageType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getCurrentLanguageType,
    getLanguageTypeName,
    setCurrentLanguageType,
} from "../../lang/Utils.ts";
import { setLanguageType } from "../../localData/Storage.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiSwitch } from "../../ui/interfaces/IUiSwitch.ts";
import {
    getSelfSettingsIsAutoScrollMap,
    getSelfSettingsIsReplayResultVisible,
    getSelfSettingsIsSetPathMode,
    getSelfSettingsCanAcceptNotFollowingMessages,
} from "../Model.ts";
import { reqUserSetSettings } from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _labelLanguage!                            : IUiLabel;
    private readonly _btnLanguage!                              : IUiButton;

    private readonly _groupHelpAutoScrollMap!                   : IUiLayout;
    private readonly _labelAutoScrollMap!                       : IUiLabel;
    private readonly _uiSwitchAutoScrollMap!                    : IUiSwitch;

    private readonly _groupHelpIsReplayResultVisible!           : IUiLayout;
    private readonly _labelIsReplayResultVisible!               : IUiLabel;
    private readonly _uiSwitchIsReplayResultVisible!            : IUiSwitch;

    private readonly _groupHelpSetPath!                         : IUiLayout;
    private readonly _labelSetPath!                             : IUiLabel;
    private readonly _uiSwitchSetPath!                          : IUiSwitch;

    private readonly _groupHelpCanAcceptNotFollowingMessages!   : IUiLayout;
    private readonly _labelCanAcceptNotFollowingMessages!       : IUiLabel;
    private readonly _uiSwitchCanAcceptNotFollowingMessages!    : IUiSwitch;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.UserSettingsIsAutoScrollMapChanged,                  callback: this._onNotifyUserSettingsIsAutoScrollMapChanged },
            { type: TypeId.UserSettingsIsReplayResultVisibleChanged,            callback: this._onNotifyUserSettingsIsReplayResultVisibleChanged },
            { type: TypeId.UserSettingsIsSetPathModeChanged,                    callback: this._onNotifyUserSettingsIsSetPathModeChanged },
            { type: TypeId.UserSettingsCanAcceptNotFollowingMessagesChanged,    callback: this._onNotifyUserSettingsCanAcceptNotFollowingMessagesChanged },
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
            reqUserSetSettings({
                isAutoScrollMap : !getSelfSettingsIsAutoScrollMap(),
                coBgmSettings   : [],
            });
        });
        this._uiSwitchIsReplayResultVisible.setCallbackOnTouch(() => {
            reqUserSetSettings({
                isReplayResultVisible   : !getSelfSettingsIsReplayResultVisible(),
                coBgmSettings           : [],
            });
        });
        this._uiSwitchSetPath.setCallbackOnTouch(() => {
            reqUserSetSettings({
                isSetPathMode   : !getSelfSettingsIsSetPathMode(),
                coBgmSettings   : [],
            });
        });
        this._uiSwitchCanAcceptNotFollowingMessages.setCallbackOnTouch(() => {
            reqUserSetSettings({
                canAcceptNotFollowingMessages   : !getSelfSettingsCanAcceptNotFollowingMessages(),
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B0627),
            availableNumberArray    : [
                LanguageType.Chinese,
                LanguageType.English,
                LanguageType.Spanish,
            ],
            currentNumber           : getCurrentLanguageType(),
            getNumberMainText       : num => getLanguageTypeName(num) ?? UndefinedError,
            callbackOnConfirm       : num => {
                setCurrentLanguageType(num);
                setLanguageType(num);

                dispatch(TypeId.LanguageChanged);
            },
        });
    }
    private _onTouchedGroupHelpAutoScrollMap(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0823),
        });
    }
    private _onTouchedGroupHelpIsReplayResultVisible(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0824),
        });
    }
    private _onTouchedGroupHelpSetPath(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0822),
        });
    }
    private _onTouchedGroupHelpCanAcceptNotFollowingMessages(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0888),
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
        this._labelTitle.setLangText(TextType.B1278);
        this._labelLanguage.setLangText(TextType.B0627);
        this._labelAutoScrollMap.setLangText(TextType.B0793);
        this._labelIsReplayResultVisible.setLangText(TextType.B1241);
        this._labelSetPath.setLangText(TextType.B0430);
        this._labelCanAcceptNotFollowingMessages.setLangText(TextType.B1353);

        this._btnLanguage.setText(getLanguageTypeName(getCurrentLanguageType()) ?? UndefinedError);
        this._groupHelpAutoScrollMap.arrangeItems();
        this._groupHelpCanAcceptNotFollowingMessages.arrangeItems();
        this._groupHelpIsReplayResultVisible.arrangeItems();
        this._groupHelpSetPath.arrangeItems();
    }

    private _updateSwitchAutoScrollMap(isTween: boolean): void {
        this._uiSwitchAutoScrollMap.setIsSwitchOn(getSelfSettingsIsAutoScrollMap(), isTween);
    }
    private _updateSwitchIsReplayResultVisible(isTween: boolean): void {
        this._uiSwitchIsReplayResultVisible.setIsSwitchOn(getSelfSettingsIsReplayResultVisible(), isTween);
    }
    private _updateSwitchSetPath(isTween: boolean): void {
        this._uiSwitchSetPath.setIsSwitchOn(getSelfSettingsIsSetPathMode(), isTween);
    }
    private _updateSwitchCanAcceptNotFollowingMessages(isTween: boolean): void {
        this._uiSwitchCanAcceptNotFollowingMessages.setIsSwitchOn(getSelfSettingsCanAcceptNotFollowingMessages(), isTween);
    }
}
