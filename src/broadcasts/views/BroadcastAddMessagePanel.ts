import * as BroadcastsConstants from "../Constants.ts";
import * as BroadcastsGateway from "../Gateway.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChinese!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputChinese!         : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelEnglish!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputEnglish!         : UiInterfacesIUiPromptedInput.IUiPromptedInput;

    private readonly _btnStartTime!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelStartTime!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnStartTimeYear!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnStartTimeMonth!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnStartTimeDay!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnStartTimeHour!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnStartTimeMinute!   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnStartTimeSecond!   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDuration!          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelDuration!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelTip!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModify!            : UiInterfacesIUiButton.IUiButton;

    private _startTime      = 0;
    private _duration       = 180;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnModify,                  callback: this._onTouchedBtnModify },
            { ui: this._btnStartTime,               callback: this._onTouchedBtnStartTime },
            { ui: this._btnStartTimeYear,           callback: this._onTouchedBtnStartTimeYear },
            { ui: this._btnStartTimeMonth,          callback: this._onTouchedBtnStartTimeMonth },
            { ui: this._btnStartTimeDay,            callback: this._onTouchedBtnStartTimeDay },
            { ui: this._btnStartTimeHour,           callback: this._onTouchedBtnStartTimeHour },
            { ui: this._btnStartTimeMinute,         callback: this._onTouchedBtnStartTimeMinute },
            { ui: this._btnStartTimeSecond,         callback: this._onTouchedBtnStartTimeSecond },
            { ui: this._btnDuration,                callback: this._onTouchedBtnDuration },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._inputChinese.setInputMaxLength(BroadcastsConstants.Constants.TextMaxLength);
        this._inputEnglish.setInputMaxLength(BroadcastsConstants.Constants.TextMaxLength);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._startTime = TimerTimerModel.getServerTimestamp();
        this._updateView();

        this._inputChinese.setInputText(`服务器即将进行停机更新。请尽快保存您的进度以免丢失，谢谢！`);
        this._inputEnglish.setInputText(`The server is about to be down and updated. Please save your progress ASAP, thank you!`);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnModify(): void {
        const chineseText   = this._inputChinese.trimInputText();
        const englishText   = this._inputEnglish.trimInputText();
        const textList      : ProtoSchemaCommonProtoStructureLanguageText.LanguageText[] = [];
        if (chineseText) {
            textList.push(ProtoSchemaCommonProtoStructureLanguageText.LanguageText.fromJson({ languageType: LangConstants.LanguageType.Chinese, text: chineseText }));
        }
        if (englishText) {
            textList.push(ProtoSchemaCommonProtoStructureLanguageText.LanguageText.fromJson({ languageType: LangConstants.LanguageType.English, text: englishText }));
        }
        if (textList.every(v => HelpersMisc.getExisted(v.getText()).length <= 0)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0155));
        } else if (textList.some(v => HelpersMisc.getExisted(v.getText()).length > BroadcastsConstants.Constants.TextMaxLength)) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0034, BroadcastsConstants.Constants.TextMaxLength));
        } else {
            const startTime = this._startTime;
            BroadcastsGateway.reqBroadcastAddMessage(textList, startTime, startTime + this._duration);
            this.closePanel();
        }
    }

    private _onTouchedBtnStartTime(): void {
        this._startTime = TimerTimerModel.getServerTimestamp();
        this._updateLabelDuration();
        this._updateLabelStartTime();
    }

    private _onTouchedBtnStartTimeYear(): void {
        const minValue  = 2022;
        const maxValue  = 2100;
        const date      = new Date(this._startTime * 1000);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0059),
            minValue,
            maxValue,
            currentValue    : date.getFullYear(),
            callback        : value => {
                date.setFullYear(value);
                this._startTime = Math.floor(date.getTime() / 1000);
                this._updateLabelStartTime();
                this._updateLabelDuration();
            },
        });
    }
    private _onTouchedBtnStartTimeMonth(): void {
        const minValue  = 1;
        const maxValue  = 12;
        const date      = new Date(this._startTime * 1000);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0058),
            minValue,
            maxValue,
            currentValue    : date.getMonth() + 1,
            callback        : value => {
                date.setMonth(value - 1);
                this._startTime = Math.floor(date.getTime() / 1000);
                this._updateLabelStartTime();
                this._updateLabelDuration();
            },
        });
    }
    private _onTouchedBtnStartTimeDay(): void {
        const minValue  = 1;
        const maxValue  = 31;
        const date      = new Date(this._startTime * 1000);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0057),
            minValue,
            maxValue,
            currentValue    : date.getDate(),
            callback        : value => {
                date.setDate(value);
                this._startTime = Math.floor(date.getTime() / 1000);
                this._updateLabelStartTime();
                this._updateLabelDuration();
            },
        });
    }
    private _onTouchedBtnStartTimeHour(): void {
        const minValue  = 0;
        const maxValue  = 23;
        const date      = new Date(this._startTime * 1000);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0884),
            minValue,
            maxValue,
            currentValue    : date.getHours(),
            callback        : value => {
                date.setHours(value);
                this._startTime = Math.floor(date.getTime() / 1000);
                this._updateLabelStartTime();
                this._updateLabelDuration();
            },
        });
    }
    private _onTouchedBtnStartTimeMinute(): void {
        const minValue  = 0;
        const maxValue  = 59;
        const date      = new Date(this._startTime * 1000);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0885),
            minValue,
            maxValue,
            currentValue    : date.getMinutes(),
            callback        : value => {
                date.setMinutes(value);
                this._startTime = Math.floor(date.getTime() / 1000);
                this._updateLabelStartTime();
                this._updateLabelDuration();
            },
        });
    }
    private _onTouchedBtnStartTimeSecond(): void {
        const minValue  = 0;
        const maxValue  = 59;
        const date      = new Date(this._startTime * 1000);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0886),
            minValue,
            maxValue,
            currentValue    : date.getSeconds(),
            callback        : value => {
                date.setSeconds(value);
                this._startTime = Math.floor(date.getTime() / 1000);
                this._updateLabelStartTime();
                this._updateLabelDuration();
            },
        });
    }

    private _onTouchedBtnDuration(): void {
        const minValue  = 30;
        const maxValue  = 3600 * 24;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0883),
            minValue,
            maxValue,
            currentValue    : this._duration,
            callback        : newValue => {
                this._duration = newValue;
                this._updateLabelDuration();
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelStartTime();
        this._updateLabelDuration();
    }

    private _updateComponentsForLanguage(): void {
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._btnModify.setText(LangUtils.getText(LangConstants.TextType.B0320));
        this._labelChinese.setText(LangUtils.getText(LangConstants.TextType.B0455));
        this._labelEnglish.setText(LangUtils.getText(LangConstants.TextType.B0456));
        this._labelTip.setText(LangUtils.getText(LangConstants.TextType.A0156));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0454));
        this._btnStartTime.setText(LangUtils.getText(LangConstants.TextType.B0882));
        this._btnDuration.setText(LangUtils.getText(LangConstants.TextType.B0883));
        this._btnStartTimeYear.setText(LangUtils.getText(LangConstants.TextType.B0059));
        this._btnStartTimeMonth.setText(LangUtils.getText(LangConstants.TextType.B0058));
        this._btnStartTimeDay.setText(LangUtils.getText(LangConstants.TextType.B0057));
        this._btnStartTimeHour.setText(LangUtils.getText(LangConstants.TextType.B0884));
        this._btnStartTimeMinute.setText(LangUtils.getText(LangConstants.TextType.B0885));
        this._btnStartTimeSecond.setText(LangUtils.getText(LangConstants.TextType.B0886));
    }

    private _updateLabelStartTime(): void {
        this._labelStartTime.setText(LangUtils.getTimestampShortText(this._startTime));
    }
    private _updateLabelDuration(): void {
        const duration              = this._duration;
        this._labelDuration.setText(`${LangUtils.getTimeDurationText2(duration)} (~${LangUtils.getTimestampShortText(this._startTime + duration)})`);
    }
}
