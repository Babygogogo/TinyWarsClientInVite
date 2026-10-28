import { Constants } from "../Constants.ts";
import { reqBroadcastAddMessage } from "../Gateway.ts";
import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { LanguageType, TextType } from "../../lang/Constants.ts";
import { getText, getFormattedText, getTimestampShortText, getTimeDurationText2 } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _labelChinese!         : IUiLabel;
    private readonly _inputChinese!         : IUiPromptedInput;
    private readonly _labelEnglish!         : IUiLabel;
    private readonly _inputEnglish!         : IUiPromptedInput;

    private readonly _btnStartTime!         : IUiButton;
    private readonly _labelStartTime!       : IUiLabel;
    private readonly _btnStartTimeYear!     : IUiButton;
    private readonly _btnStartTimeMonth!    : IUiButton;
    private readonly _btnStartTimeDay!      : IUiButton;
    private readonly _btnStartTimeHour!     : IUiButton;
    private readonly _btnStartTimeMinute!   : IUiButton;
    private readonly _btnStartTimeSecond!   : IUiButton;
    private readonly _btnDuration!          : IUiButton;
    private readonly _labelDuration!        : IUiLabel;

    private readonly _labelTip!             : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnModify!            : IUiButton;

    private _startTime      = 0;
    private _duration       = 180;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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

        this._inputChinese.setInputMaxLength(Constants.TextMaxLength);
        this._inputEnglish.setInputMaxLength(Constants.TextMaxLength);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._startTime = getServerTimestamp();
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
        const textList      : LanguageText[] = [];
        if (chineseText) {
            textList.push(LanguageText.fromJson({ languageType: LanguageType.Chinese, text: chineseText }));
        }
        if (englishText) {
            textList.push(LanguageText.fromJson({ languageType: LanguageType.English, text: englishText }));
        }
        if (textList.every(v => getExisted(v.getText()).length <= 0)) {
            show(getText(TextType.A0155));
        } else if (textList.some(v => getExisted(v.getText()).length > Constants.TextMaxLength)) {
            show(getFormattedText(TextType.F0034, Constants.TextMaxLength));
        } else {
            const startTime = this._startTime;
            reqBroadcastAddMessage(textList, startTime, startTime + this._duration);
            this.closePanel();
        }
    }

    private _onTouchedBtnStartTime(): void {
        this._startTime = getServerTimestamp();
        this._updateLabelDuration();
        this._updateLabelStartTime();
    }

    private _onTouchedBtnStartTimeYear(): void {
        const minValue  = 2022;
        const maxValue  = 2100;
        const date      = new Date(this._startTime * 1000);
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0059),
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0058),
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0057),
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0884),
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0885),
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0886),
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0883),
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
        this._btnClose.setLangText(TextType.B0146);
        this._btnModify.setLangText(TextType.B0320);
        this._labelChinese.setLangText(TextType.B0455);
        this._labelEnglish.setLangText(TextType.B0456);
        this._labelTip.setLangText(TextType.A0156);
        this._labelTitle.setLangText(TextType.B0454);
        this._btnStartTime.setLangText(TextType.B0882);
        this._btnDuration.setLangText(TextType.B0883);
        this._btnStartTimeYear.setLangText(TextType.B0059);
        this._btnStartTimeMonth.setLangText(TextType.B0058);
        this._btnStartTimeDay.setLangText(TextType.B0057);
        this._btnStartTimeHour.setLangText(TextType.B0884);
        this._btnStartTimeMinute.setLangText(TextType.B0885);
        this._btnStartTimeSecond.setLangText(TextType.B0886);
    }

    private _updateLabelStartTime(): void {
        this._labelStartTime.setText(getTimestampShortText(this._startTime));
    }
    private _updateLabelDuration(): void {
        const duration              = this._duration;
        this._labelDuration.setText(`${getTimeDurationText2(duration)} (~${getTimestampShortText(this._startTime + duration)})`);
    }
}
