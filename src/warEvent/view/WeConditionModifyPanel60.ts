import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";

export type OpenData = {
    war         : IBwWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _labelTitle!                       : IUiLabel;
    private readonly _btnType!                          : IUiButton;
    private readonly _btnClose!                         : IUiButton;
    private readonly _labelDesc!                        : IUiLabel;
    private readonly _labelError!                       : IUiLabel;
    private readonly _imgInnerTouchMask!                : IUiImage;

    private readonly _btnCounterId!                     : IUiButton;
    private readonly _labelCounterId!                   : IUiLabel;
    private readonly _labelValue!                       : IUiLabel;
    private readonly _inputValue!                       : IUiPromptedInput;
    private readonly _btnValueComparator!               : IUiButton;
    private readonly _labelValueComparator!             : IUiLabel;
    private readonly _labelValueDivider!                : IUiLabel;
    private readonly _inputValueDivider!                : IUiPromptedInput;
    private readonly _labelValueRemainder!              : IUiLabel;
    private readonly _inputValueRemainder!              : IUiPromptedInput;
    private readonly _btnValueRemainderComparator!      : IUiButton;
    private readonly _labelValueRemainderComparator!    : IUiLabel;
    private readonly _labelCounterCount!                : IUiLabel;
    private readonly _inputCounterCount!                : IUiPromptedInput;
    private readonly _btnCounterCountComparator!        : IUiButton;
    private readonly _labelCounterCountComparator!      : IUiLabel;

    // public updateOnLoadedSkin(): void {
    //     this._setNotifyListenerArray([
    //         { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
    //         { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
    //     ]);
    //     this._setUiListenerArray([
    //         { ui: this._btnClose,                       callback: this.closePanel },
    //         { ui: this._btnType,                        callback: this._onTouchedBtnType },
    //         { ui: this._imgInnerTouchMask,              callback: this._onTouchedImgInnerTouchMask },
    //         { ui: this._btnCounterId,                   callback: this._onTouchedBtnCounterId },
    //         { ui: this._inputValue,                     callback: this._onFocusInInputValue,                    eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputValue,                     callback: this._onFocusOutInputValue,                   eventType: Ui.Types.UiInputEventType.FocusOut },
    //         { ui: this._btnValueComparator,             callback: this._onTouchedBtnValueComparator },
    //         { ui: this._inputValueDivider,              callback: this._onFocusInInputValueDivider,             eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputValueDivider,              callback: this._onFocusOutInputValueDivider,            eventType: Ui.Types.UiInputEventType.FocusOut },
    //         { ui: this._inputValueRemainder,            callback: this._onFocusInInputValueRemainder,           eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputValueRemainder,            callback: this._onFocusOutInputValueRemainder,          eventType: Ui.Types.UiInputEventType.FocusOut },
    //         { ui: this._btnValueRemainderComparator,    callback: this._onTouchedBtnValueRemainderComparator },
    //         { ui: this._inputCounterCount,              callback: this._onFocusInInputCounterCount,             eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputCounterCount,              callback: this._onFocusOutInputCounterCount,            eventType: Ui.Types.UiInputEventType.FocusOut },
    //         { ui: this._btnCounterCountComparator,      callback: this._onTouchedBtnCounterCountComparator },
    //     ]);
    //     this._setIsTouchMaskEnabled(true);
    //     this._setIsCloseOnTouchedMask();
    //     this._enableKeyEscapeToClosePanel();

    //     this._imgInnerTouchMask.touchEnabled = true;
    //     this._setInnerTouchMaskEnabled(false);
    // }
    // protected override async _doApplyOpenData(): Promise<void> {
    //     this._updateView();
    // }
    // protected _onClosed(): void {
    //     // nothing to do
    // }

    // private _onNotifyLanguageChanged(): void {
    //     this._updateComponentsForLanguage();
    // }
    // private _onNotifyWarEventFullDataChanged(): void {
    //     this._updateView();
    // }
    // private _onTouchedBtnType(): void {
    //     const openData = this.getOpenData();
    //     GamePanels.openPanel(PanelHelpers.PanelDict.WeConditionTypeListPanel, {
    //         fullData    : openData.fullData,
    //         condition   : openData.condition,
    //         war         : openData.war,
    //     });
    // }
    // private _onTouchedImgInnerTouchMask(): void {
    //     this._setInnerTouchMaskEnabled(false);
    // }
    // private _onTouchedBtnCounterId(): void {
    //     const condition = this._getCondition();
    //     GamePanels.openPanel(PanelHelpers.PanelDict.CommonChooseMultiIntegerPanel, {
    //         availableIntegerArray       : GameHelper.GhWarEventCustomCounter.getAllIdArray(),
    //         currentIntegerArray         : condition.counterIdArray ?? [],
    //         getTitleText                : () => Lang.getFormattedText(LangTextType.F0092, Lang.getText(LangTextType.B0799)),
    //         callbackOnConfirm           : counterIdArray => {
    //             condition.counterIdArray = counterIdArray;
    //             Notify.Dispatcher.dispatch(NotifyType.WarEventFullDataChanged);
    //         },
    //     });
    // }
    // private _onFocusInInputValue(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputValue(): void {
    //     const text  = this._inputValue.text;
    //     const value = !text ? null : parseInt(text);
    //     if ((value == null) || (!isNaN(value))) {
    //         this._getCondition().value = value;
    //         Notify.Dispatcher.dispatch(NotifyType.WarEventFullDataChanged);
    //     } else {
    //         this._updateInputValue();
    //     }
    // }
    // private _onTouchedBtnValueComparator(): void {
    //     const condition             = this._getCondition();
    //     condition.valueComparator   = GameHelpers.GhValueComparator.getNextValueComparator(condition.valueComparator);
    //     Notify.Dispatcher.dispatch(NotifyType.WarEventFullDataChanged);
    // }
    // private _onFocusInInputValueDivider(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputValueDivider(): void {
    //     const text  = this._inputValueDivider.text;
    //     const value = !text ? null : parseInt(text);
    //     if ((value == null) || (value >= 2)) {
    //         this._getCondition().valueDivider = value;
    //         Notify.Dispatcher.dispatch(NotifyType.WarEventFullDataChanged);
    //     } else {
    //         this._updateInputValueDivider();
    //     }
    // }
    // private _onFocusInInputValueRemainder(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputValueRemainder(): void {
    //     const text  = this._inputValueRemainder.text;
    //     const value = !text ? null : parseInt(text);
    //     if ((value == null) || (!isNaN(value))) {
    //         this._getCondition().valueRemainder = value;
    //         Notify.Dispatcher.dispatch(NotifyType.WarEventFullDataChanged);
    //     } else {
    //         this._updateInputValueRemainder();
    //     }
    // }
    // private _onTouchedBtnValueRemainderComparator(): void {
    //     const condition                     = this._getCondition();
    //     condition.valueRemainderComparator  = GameHelpers.GhValueComparator.getNextValueComparator(condition.valueRemainderComparator);
    //     Notify.Dispatcher.dispatch(NotifyType.WarEventFullDataChanged);
    // }
    // private _onFocusInInputCounterCount(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputCounterCount(): void {
    //     const text  = this._inputCounterCount.text;
    //     const value = !text ? null : parseInt(text);
    //     if ((value != null) && (!isNaN(value))) {
    //         this._getCondition().counterCount = value;
    //         Notify.Dispatcher.dispatch(NotifyType.WarEventFullDataChanged);
    //     } else {
    //         this._updateInputCounterCount();
    //     }
    // }
    // private _onTouchedBtnCounterCountComparator(): void {
    //     const condition                     = this._getCondition();
    //     condition.counterCountComparator    = GameHelpers.GhValueComparator.getNextValueComparator(condition.counterCountComparator);
    //     Notify.Dispatcher.dispatch(NotifyType.WarEventFullDataChanged);
    // }

    // private _updateView(): void {
    //     this._updateComponentsForLanguage();

    //     this._updateLabelDescAndLabelError();
    //     this._updateLabelCounterId();
    //     this._updateInputValue();
    //     this._updateLabelValueComparator();
    //     this._updateInputValueDivider();
    //     this._updateInputValueRemainder();
    //     this._updateLabelValueRemainderComparator();
    //     this._updateInputCounterCount();
    //     this._updateLabelCounterCountComparator();
    // }

    // private _updateComponentsForLanguage(): void {
    //     this._labelTitle.text                       = `${Lang.getText(LangTextType.B0501)} C${this.getOpenData().condition.WecCommonData?.conditionId}`;
    //     this._btnClose.label                        = Lang.getText(LangTextType.B0146);
    //     this._btnType.label                         = Lang.getText(LangTextType.B0516);
    //     this._btnCounterId.label                    = Lang.getText(LangTextType.B0799);
    //     this._labelValue.text                       = Lang.getText(LangTextType.B0803);
    //     this._btnValueComparator.label              = Lang.getText(LangTextType.B0774);
    //     this._labelValueDivider.text                = `${Lang.getText(LangTextType.B0518)}(>=2)`;
    //     this._labelValueRemainder.text              = Lang.getText(LangTextType.B0519);
    //     this._btnValueRemainderComparator.label     = Lang.getText(LangTextType.B0774);
    //     this._labelCounterCount.text                = Lang.getText(LangTextType.B0801);
    //     this._btnCounterCountComparator.label       = Lang.getText(LangTextType.B0774);

    //     this._updateLabelDescAndLabelError();
    // }

    // private _updateLabelDescAndLabelError(): void {
    //     const openData          = this.getOpenData();
    //     const condition         = openData.condition;
    //     const war               = openData.war;
    //     const errorTip          = GameHelper.GhWarEventCondition.getErrorTipForCondition(openData.fullData, condition, war);
    //     const labelError        = this._labelError;
    //     labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
    //     labelError.textColor    = errorTip ? ColorValue.Red : ColorValue.Green;
    //     this._labelDesc.text    = GameHelper.GhWarEventCondition.getDetailedDescForCondition(condition, war.getGameConfig()) || Lang.ErrorTextForUndefined;
    // }
    // private _updateLabelCounterId(): void {
    //     const counterIdArray        = this._getCondition().counterIdArray;
    //     this._labelCounterId.text   = counterIdArray?.length ? counterIdArray.join(`, `) : Lang.getText(LangTextType.B0776);
    // }
    // private _updateInputValue(): void {
    //     const value             = this._getCondition().value;
    //     this._inputValue.text   = value == null ? `` : `${value}`;
    // }
    // private _updateLabelValueComparator(): void {
    //     const comparator                = Helpers.Misc.getExisted(this._getCondition().valueComparator);
    //     this._labelValueComparator.text = Lang.getValueComparatorName(comparator) ?? Lang.ErrorTextForUndefined;
    // }
    // private _updateInputValueDivider(): void {
    //     const divider                   = this._getCondition().valueDivider;
    //     this._inputValueDivider.text    = divider == null ? `` : `${divider}`;
    // }
    // private _updateInputValueRemainder(): void {
    //     const remainder                 = this._getCondition().valueRemainder;
    //     this._inputValueRemainder.text  = remainder == null ? `` : `${remainder}`;
    // }
    // private _updateLabelValueRemainderComparator(): void {
    //     const comparator                            = Helpers.Misc.getExisted(this._getCondition().valueRemainderComparator);
    //     this._labelValueRemainderComparator.text    = Lang.getValueComparatorName(comparator) ?? Lang.ErrorTextForUndefined;
    // }
    // private _updateInputCounterCount(): void {
    //     const value                     = this._getCondition().counterCount;
    //     this._inputCounterCount.text    = value == null ? `` : `${value}`;
    // }
    // private _updateLabelCounterCountComparator(): void {
    //     const comparator                        = Helpers.Misc.getExisted(this._getCondition().counterCountComparator);
    //     this._labelCounterCountComparator.text  = Lang.getValueComparatorName(comparator) ?? Lang.ErrorTextForUndefined;
    // }

    // private _getCondition(): CommonProto.WarEvent.IWecCustomCounter {
    //     return Helpers.Misc.getExisted(this.getOpenData().condition.WecCustomCounter);
    // }
    // private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
    //     this._imgInnerTouchMask.visible = isEnabled;
    // }
}
