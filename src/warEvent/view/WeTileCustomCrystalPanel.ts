import {
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { TileCustomCrystalData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";

export interface OpenData {
    currentData             : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomCrystalData>;
    callback                : ((customData: TileCustomCrystalData | null) => void) | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClear!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgInnerTouchMask!                        : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _btnCanAffectSelf!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCanAffectSelf!                       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCanAffectAlly!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCanAffectAlly!                       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCanAffectEnemy!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCanAffectEnemy!                      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelPriority!                            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputPriority!                            : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelRadius!                              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputRadius!                              : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelDeltaFund!                           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputDeltaFund!                           : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelDeltaEnergyPercentage!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputDeltaEnergyPercentage!               : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelDeltaHp!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputDeltaHp!                             : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelDeltaFuelPercentage!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputDeltaFuelPercentage!                 : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelDeltaPrimaryAmmoPercentage!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputDeltaPrimaryAmmoPercentage!          : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;

    private _customData = new TileCustomCrystalData();

    // public updateOnLoadedSkin(): void {
    //     this._setNotifyListenerArray([
    //         { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
    //         { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
    //     ]);
    //     this._setUiListenerArray([
    //         { ui: this._btnClose,                               callback: this._onTouchedBtnClose },
    //         { ui: this._btnClear,                               callback: this._onTouchedBtnClear },
    //         { ui: this._imgInnerTouchMask,                      callback: this._onTouchedImgInnerTouchMask },

    //         { ui: this._btnCanAffectSelf,                       callback: this._onTouchedBtnCanAffectSelf },
    //         { ui: this._btnCanAffectAlly,                       callback: this._onTouchedBtnCanAffectAlly },
    //         { ui: this._btnCanAffectEnemy,                      callback: this._onTouchedBtnCanAffectEnemy },

    //     ]);
    //     this._setInputListenerArray([
    //         { ui: this._inputPriority,                          callback: this._onFocusInInputPriority,                             eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputPriority,                          callback: this._onFocusOutInputPriority,                            eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputRadius,                            callback: this._onFocusInInputRadius,                               eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputRadius,                            callback: this._onFocusOutInputRadius,                              eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputDeltaFund,                         callback: this._onFocusInInputDeltaFund,                            eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputDeltaFund,                         callback: this._onFocusOutInputDeltaFund,                           eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputDeltaEnergyPercentage,             callback: this._onFocusInInputDeltaEnergyPercentage,                eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputDeltaEnergyPercentage,             callback: this._onFocusOutInputDeltaEnergyPercentage,               eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputDeltaHp,                           callback: this._onFocusInInputDeltaHp,                              eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputDeltaHp,                           callback: this._onFocusOutInputDeltaHp,                             eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputDeltaFuelPercentage,               callback: this._onFocusInInputDeltaFuelPercentage,                  eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputDeltaFuelPercentage,               callback: this._onFocusOutInputDeltaFuelPercentage,                 eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputDeltaPrimaryAmmoPercentage,        callback: this._onFocusInInputDeltaPrimaryAmmoPercentage,           eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputDeltaPrimaryAmmoPercentage,        callback: this._onFocusOutInputDeltaPrimaryAmmoPercentage,          eventType: Ui.Types.UiInputEventType.FocusOut },
    //     ]);
    //     this._setIsTouchMaskEnabled(true);
    //     this._enableKeyEscapeToClosePanel(() => {
    //         SoundManager.playShortSfx(GameConfig.Sound.ShortSfxCode.ButtonCancel01);
    //         this._onTouchedBtnClose();
    //     });

    //     this._imgInnerTouchMask.setIsTouchEnabled(true);
    //     this._setInnerTouchMaskEnabled(false);
    // }
    // protected override async _doApplyOpenData(): Promise<void> {
    //     this._customData = AuxiliaryHelpers.deepClone(this.getOpenData()?.currentData) ?? {};

    //     this._updateView();
    // }

    // private _onNotifyLanguageChanged(): void {
    //     this._updateComponentsForLanguage();
    // }
    // private _onNotifyWarEventFullDataChanged(): void {
    //     this._updateView();
    // }
    // private _onTouchedBtnClose(): void {
    //     const callback = this.getOpenData()?.callback;
    //     if (callback == null) {
    //         this.closePanel();
    //     } else {
    //         GamePanels.openPanel(PanelHelpers.PanelDict.CommonConfirmPanel, {
    //             content             : Lang.getText(LangTextType.A0418),
    //             textForConfirm      : Lang.getText(LangTextType.B0012),
    //             textForCancel       : Lang.getText(LangTextType.B0013),
    //             callback            : () => {
    //                 const customData = this._getCustomData();
    //                 callback(PhTileCustomCrystalData.checkIsEmpty(customData) ? null : customData);
    //                 this.closePanel();
    //             },
    //             callbackOnCancel    : () => this.closePanel(),
    //             showButtonClose     : true,
    //         });
    //     }
    // }
    // private _onTouchedBtnClear(): void {
    //     GamePanels.openPanel(PanelHelpers.PanelDict.CommonConfirmPanel, {
    //         content     : Lang.getText(LangTextType.A0225),
    //         callback    : () => {
    //             this._customData = {};
    //             this._updateView();
    //         }
    //     });
    // }

    // private _onTouchedImgInnerTouchMask(): void {
    //     this._setInnerTouchMaskEnabled(false);
    // }

    // private _onTouchedBtnCanAffectSelf(): void {
    //     const customData    = this._getCustomData();
    //     const canAffect     = customData.canAffectSelf;
    //     if (canAffect == null) {
    //         customData.canAffectSelf = true;
    //     } else if (canAffect) {
    //         customData.canAffectSelf = false;
    //     } else {
    //         customData.canAffectSelf = null;
    //     }
    //     this._updateView();
    // }
    // private _onTouchedBtnCanAffectAlly(): void {
    //     const customData    = this._getCustomData();
    //     const canAffect     = customData.canAffectAlly;
    //     if (canAffect == null) {
    //         customData.canAffectAlly = true;
    //     } else if (canAffect) {
    //         customData.canAffectAlly = false;
    //     } else {
    //         customData.canAffectAlly = null;
    //     }
    //     this._updateView();
    // }
    // private _onTouchedBtnCanAffectEnemy(): void {
    //     const customData    = this._getCustomData();
    //     const canAffect     = customData.canAffectEnemy;
    //     if (canAffect == null) {
    //         customData.canAffectEnemy = true;
    //     } else if (canAffect) {
    //         customData.canAffectEnemy = false;
    //     } else {
    //         customData.canAffectEnemy = null;
    //     }
    //     this._updateView();
    // }

    // private _onFocusInInputPriority(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputPriority(): void {
    //     const text          = this._inputPriority.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.priority;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputPriority();
    //         } else {
    //             customData.priority = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputRadius(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputRadius(): void {
    //     const text          = this._inputRadius.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.radius;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputRadius();
    //         } else {
    //             customData.radius = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputDeltaFund(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputDeltaFund(): void {
    //     const text          = this._inputDeltaFund.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.offsetFund;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputDeltaFund();
    //         } else {
    //             customData.offsetFund = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputDeltaEnergyPercentage(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputDeltaEnergyPercentage(): void {
    //     const text          = this._inputDeltaEnergyPercentage.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.offsetEnergyPercentage;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputDeltaEnergyPercentage();
    //         } else {
    //             customData.offsetEnergyPercentage = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputDeltaHp(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputDeltaHp(): void {
    //     const text          = this._inputDeltaHp.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.offsetHp;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputDeltaHp();
    //         } else {
    //             customData.offsetHp = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputDeltaFuelPercentage(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputDeltaFuelPercentage(): void {
    //     const text          = this._inputDeltaFuelPercentage.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.offsetFuelPercentage;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputDeltaFuelPercentage();
    //         } else {
    //             customData.offsetFuelPercentage = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputDeltaPrimaryAmmoPercentage(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputDeltaPrimaryAmmoPercentage(): void {
    //     const text          = this._inputDeltaPrimaryAmmoPercentage.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.offsetPrimaryAmmoPercentage;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputDeltaPrimaryAmmoPercentage();
    //         } else {
    //             customData.offsetPrimaryAmmoPercentage = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _updateView(): void {
    //     this._updateComponentsForLanguage();

    //     this._updateLabelDescAndLabelError();

    //     this._updateLabelCanAffectSelf();
    //     this._updateLabelCanAffectAlly();
    //     this._updateLabelCanAffectEnemy();

    //     this._updateInputPriority();
    //     this._updateInputRadius();
    //     this._updateInputDeltaFund();
    //     this._updateInputDeltaEnergyPercentage();
    //     this._updateInputDeltaHp();
    //     this._updateInputDeltaFuelPercentage();
    //     this._updateInputDeltaPrimaryAmmoPercentage();
    // }

    // private async _updateComponentsForLanguage(): Promise<void> {
    //     this._labelTitle.setText(Lang.getTileName(
    //         GameConfig.Tile.TileType.CustomCrystal,
    //         await GameConfig.GcModel.getLatestGameConfig()
    //     ) ?? Lang.ErrorTextForUndefined);
    //     this._btnClose.setText(Lang.getText(LangTextType.B0204));
    //     this._btnClear.setText(Lang.getText(LangTextType.B0391));

    //     this._btnCanAffectSelf.setText(Lang.getText(LangTextType.B0735));
    //     this._btnCanAffectAlly.setText(Lang.getText(LangTextType.B0736));
    //     this._btnCanAffectEnemy.setText(Lang.getText(LangTextType.B0737));

    //     this._labelPriority.setText(Lang.getText(LangTextType.B0739));
    //     this._labelRadius.setText(Lang.getText(LangTextType.B0734));
    //     this._labelDeltaFund.setText(Lang.getText(LangTextType.B0738));
    //     this._labelDeltaEnergyPercentage.setText(Lang.getText(LangTextType.B0730));
    //     this._labelDeltaHp.setText(Lang.getText(LangTextType.B0731));
    //     this._labelDeltaFuelPercentage.setText(Lang.getText(LangTextType.B0732));
    //     this._labelDeltaPrimaryAmmoPercentage.setText(Lang.getText(LangTextType.B0733));

    //     this._updateLabelDescAndLabelError();
    // }

    // private _updateLabelDescAndLabelError(): void {
    //     const customData        = this._getCustomData();
    //     const errorTip          = PhTileCustomCrystalData.getErrorTip(customData);
    //     const labelError        = this._labelError;
    //     labelError.setText(errorTip || Lang.getText(LangTextType.B0493));
    //     labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
    // }

    // private _updateLabelCanAffectSelf(): void {
    //     const canAffectSelf = this._getCustomData().canAffectSelf;
    //     const label         = this._labelCanAffectSelf;
    //     if (canAffectSelf == null) {
    //         label.setText(`--`);
    //     } else {
    //         label.setText(Lang.getText(canAffectSelf ? LangTextType.B0012 : LangTextType.B0013));
    //     }
    // }
    // private _updateLabelCanAffectAlly(): void {
    //     const canAffectAlly = this._getCustomData().canAffectAlly;
    //     const label         = this._labelCanAffectAlly;
    //     if (canAffectAlly == null) {
    //         label.setText(`--`);
    //     } else {
    //         label.setText(Lang.getText(canAffectAlly ? LangTextType.B0012 : LangTextType.B0013));
    //     }
    // }
    // private _updateLabelCanAffectEnemy(): void {
    //     const canAffectEnemy = this._getCustomData().canAffectEnemy;
    //     const label         = this._labelCanAffectEnemy;
    //     if (canAffectEnemy == null) {
    //         label.setText(`--`);
    //     } else {
    //         label.setText(Lang.getText(canAffectEnemy ? LangTextType.B0012 : LangTextType.B0013));
    //     }
    // }

    // private _updateInputPriority(): void {
    //     this._inputPriority.setInputText(`${this._getCustomData().priority ?? ``}`);
    // }
    // private _updateInputRadius(): void {
    //     this._inputRadius.setInputText(`${this._getCustomData().radius ?? ``}`);
    // }
    // private _updateInputDeltaFund(): void {
    //     this._inputDeltaFund.setInputText(`${this._getCustomData().offsetFund ?? ``}`);
    // }
    // private _updateInputDeltaEnergyPercentage(): void {
    //     this._inputDeltaEnergyPercentage.setInputText(`${this._getCustomData().offsetEnergyPercentage ?? ``}`);
    // }
    // private _updateInputDeltaHp(): void {
    //     this._inputDeltaHp.setInputText(`${this._getCustomData().offsetHp ?? ``}`);
    // }
    // private _updateInputDeltaFuelPercentage(): void {
    //     this._inputDeltaFuelPercentage.setInputText(`${this._getCustomData().offsetFuelPercentage ?? ``}`);
    // }
    // private _updateInputDeltaPrimaryAmmoPercentage(): void {
    //     this._inputDeltaPrimaryAmmoPercentage.setInputText(`${this._getCustomData().offsetPrimaryAmmoPercentage ?? ``}`);
    // }

    // private _getCustomData(): ITileCustomCrystalData {
    //     return this._customData;
    // }
    // private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
    //     this._imgInnerTouchMask.setIsVisible(isEnabled);
    // }
}
