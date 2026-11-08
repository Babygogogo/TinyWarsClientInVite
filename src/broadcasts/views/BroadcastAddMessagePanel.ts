import {
    Broadcasts_Constants,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Timer_TimerModel,
    Lang_Constants,
    GamePanels_Manager,
    Broadcasts_Gateway,
    FloatText,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
} from "../../internal.ts";
import { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChinese!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputChinese!         : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelEnglish!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputEnglish!         : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;

    private readonly _btnStartTime!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelStartTime!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnStartTimeYear!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnStartTimeMonth!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnStartTimeDay!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnStartTimeHour!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnStartTimeMinute!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnStartTimeSecond!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDuration!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelDuration!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelTip!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModify!            : Ui_Interfaces_IUiButton.IUiButton;

    private _startTime      = 0;
    private _duration       = 180;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnModify,                  callback : this._onTouchedBtnModify },
            { ui : this._btnStartTime,               callback : this._onTouchedBtnStartTime },
            { ui : this._btnStartTimeYear,           callback : this._onTouchedBtnStartTimeYear },
            { ui : this._btnStartTimeMonth,          callback : this._onTouchedBtnStartTimeMonth },
            { ui : this._btnStartTimeDay,            callback : this._onTouchedBtnStartTimeDay },
            { ui : this._btnStartTimeHour,           callback : this._onTouchedBtnStartTimeHour },
            { ui : this._btnStartTimeMinute,         callback : this._onTouchedBtnStartTimeMinute },
            { ui : this._btnStartTimeSecond,         callback : this._onTouchedBtnStartTimeSecond },
            { ui : this._btnDuration,                callback : this._onTouchedBtnDuration },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._inputChinese.setInputMaxLength(Broadcasts_Constants.Constants.TextMaxLength);
        this._inputEnglish.setInputMaxLength(Broadcasts_Constants.Constants.TextMaxLength);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._startTime = Timer_TimerModel.getServerTimestamp();
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
            textList.push(LanguageText.fromJson({ languageType : Lang_Constants.LanguageType.Chinese, text : chineseText }));
        }
        if (englishText) {
            textList.push(LanguageText.fromJson({ languageType : Lang_Constants.LanguageType.English, text : englishText }));
        }
        if (textList.every(v => Helpers_Misc.getExisted(v.getText()).length <= 0)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0155));
        } else if (textList.some(v => Helpers_Misc.getExisted(v.getText()).length > Broadcasts_Constants.Constants.TextMaxLength)) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0034, Broadcasts_Constants.Constants.TextMaxLength));
        } else {
            const startTime = this._startTime;
            Broadcasts_Gateway.reqBroadcastAddMessage(textList, startTime, startTime + this._duration);
            this.closePanel();
        }
    }

    private _onTouchedBtnStartTime(): void {
        this._startTime = Timer_TimerModel.getServerTimestamp();
        this._updateLabelDuration();
        this._updateLabelStartTime();
    }

    private _onTouchedBtnStartTimeYear(): void {
        const minValue  = 2022;
        const maxValue  = 2100;
        const date      = new Date(this._startTime * 1000);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0059),
            minValue,
            maxValue,
            currentValue : date.getFullYear(),
            callback     : value => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0058),
            minValue,
            maxValue,
            currentValue : date.getMonth() + 1,
            callback     : value => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0057),
            minValue,
            maxValue,
            currentValue : date.getDate(),
            callback     : value => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0884),
            minValue,
            maxValue,
            currentValue : date.getHours(),
            callback     : value => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0885),
            minValue,
            maxValue,
            currentValue : date.getMinutes(),
            callback     : value => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0886),
            minValue,
            maxValue,
            currentValue : date.getSeconds(),
            callback     : value => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0883),
            minValue,
            maxValue,
            currentValue : this._duration,
            callback     : newValue => {
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
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnModify.setLangText(Lang_Constants.TextType.B0320);
        this._labelChinese.setLangText(Lang_Constants.TextType.B0455);
        this._labelEnglish.setLangText(Lang_Constants.TextType.B0456);
        this._labelTip.setLangText(Lang_Constants.TextType.A0156);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0454);
        this._btnStartTime.setLangText(Lang_Constants.TextType.B0882);
        this._btnDuration.setLangText(Lang_Constants.TextType.B0883);
        this._btnStartTimeYear.setLangText(Lang_Constants.TextType.B0059);
        this._btnStartTimeMonth.setLangText(Lang_Constants.TextType.B0058);
        this._btnStartTimeDay.setLangText(Lang_Constants.TextType.B0057);
        this._btnStartTimeHour.setLangText(Lang_Constants.TextType.B0884);
        this._btnStartTimeMinute.setLangText(Lang_Constants.TextType.B0885);
        this._btnStartTimeSecond.setLangText(Lang_Constants.TextType.B0886);
    }

    private _updateLabelStartTime(): void {
        this._labelStartTime.setText(Lang_Utils.getTimestampShortText(this._startTime));
    }
    private _updateLabelDuration(): void {
        const duration              = this._duration;
        this._labelDuration.setText(`${Lang_Utils.getTimeDurationText2(duration)} (~${Lang_Utils.getTimestampShortText(this._startTime + duration)})`);
    }
}
