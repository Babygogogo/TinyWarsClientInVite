import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData from "../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";

export interface OpenData {
    currentData             : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData>;
    callback                : ((customData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData | null) => void) | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClear!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgInnerTouchMask!                        : UiInterfacesIUiImage.IUiImage;

    private readonly _btnCanAffectSelf!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCanAffectSelf!                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCanAffectAlly!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCanAffectAlly!                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCanAffectEnemy!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCanAffectEnemy!                      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelPriority!                            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputPriority!                            : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelDeltaHp!                             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputDeltaHp!                             : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelDeltaFuelPercentage!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputDeltaFuelPercentage!                 : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelDeltaPrimaryAmmoPercentage!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputDeltaPrimaryAmmoPercentage!          : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelRangeForUp!                          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputRangeForUp!                          : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelRangeForDown!                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputRangeForDown!                        : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelRangeForLeft!                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputRangeForLeft!                        : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelRangeForRight!                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputRangeForRight!                       : UiInterfacesIUiPromptedInput.IUiPromptedInput;

    private _customData = new ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData();

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

    //         { ui: this._inputDeltaHp,                           callback: this._onFocusInInputDeltaHp,                              eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputDeltaHp,                           callback: this._onFocusOutInputDeltaHp,                             eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputDeltaFuelPercentage,               callback: this._onFocusInInputDeltaFuelPercentage,                  eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputDeltaFuelPercentage,               callback: this._onFocusOutInputDeltaFuelPercentage,                 eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputDeltaPrimaryAmmoPercentage,        callback: this._onFocusInInputDeltaPrimaryAmmoPercentage,           eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputDeltaPrimaryAmmoPercentage,        callback: this._onFocusOutInputDeltaPrimaryAmmoPercentage,          eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputRangeForUp,                        callback: this._onFocusInInputRangeForUp,                           eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputRangeForUp,                        callback: this._onFocusOutInputRangeForUp,                          eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputRangeForDown,                      callback: this._onFocusInInputRangeForDown,                         eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputRangeForDown,                      callback: this._onFocusOutInputRangeForDown,                        eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputRangeForLeft,                      callback: this._onFocusInInputRangeForLeft,                         eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputRangeForLeft,                      callback: this._onFocusOutInputRangeForLeft,                        eventType: Ui.Types.UiInputEventType.FocusOut },

    //         { ui: this._inputRangeForRight,                     callback: this._onFocusInInputRangeForRight,                        eventType: Ui.Types.UiInputEventType.FocusIn },
    //         { ui: this._inputRangeForRight,                     callback: this._onFocusOutInputRangeForRight,                       eventType: Ui.Types.UiInputEventType.FocusOut },
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
    //                 callback(PhTileCustomLaserTurretData.checkIsEmpty(customData) ? null : customData);
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
    //             this._updateInputOffsetHp();
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
    //             this._updateInputOffsetFuelPercentage();
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
    //             this._updateInputOffsetPrimaryAmmoPercentage();
    //         } else {
    //             customData.offsetPrimaryAmmoPercentage = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputRangeForUp(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputRangeForUp(): void {
    //     const text          = this._inputRangeForUp.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.rangeForUp;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputRangeForUp();
    //         } else {
    //             customData.rangeForUp = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputRangeForDown(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputRangeForDown(): void {
    //     const text          = this._inputRangeForDown.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.rangeForDown;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputRangeForDown();
    //         } else {
    //             customData.rangeForDown = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputRangeForLeft(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputRangeForLeft(): void {
    //     const text          = this._inputRangeForLeft.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.rangeForLeft;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputRangeForLeft();
    //         } else {
    //             customData.rangeForLeft = value;
    //             this._updateView();
    //         }
    //     }
    // }

    // private _onFocusInInputRangeForRight(): void {
    //     this._setInnerTouchMaskEnabled(true);
    // }
    // private _onFocusOutInputRangeForRight(): void {
    //     const text          = this._inputRangeForRight.getInputText();
    //     const value         = text ? parseInt(text) : null;
    //     const customData    = this._getCustomData();
    //     if (value == null) {
    //         delete customData.rangeForRight;
    //         this._updateView();
    //     } else {
    //         if (isNaN(value)) {
    //             this._updateInputRangeForRight();
    //         } else {
    //             customData.rangeForRight = value;
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
    //     this._updateInputOffsetHp();
    //     this._updateInputOffsetFuelPercentage();
    //     this._updateInputOffsetPrimaryAmmoPercentage();
    //     this._updateInputRangeForUp();
    //     this._updateInputRangeForDown();
    //     this._updateInputRangeForLeft();
    //     this._updateInputRangeForRight();
    // }

    // private async _updateComponentsForLanguage(): Promise<void> {
    //     this._labelTitle.setText(Lang.getTileName(
    //         GameConfig.Tile.TileType.CustomLaserTurret,
    //         await GameConfig.GcModel.getLatestGameConfig()
    //     ) ?? Lang.ErrorTextForUndefined);
    //     this._btnClose.setText(Lang.getText(LangTextType.B0204));
    //     this._btnClear.setText(Lang.getText(LangTextType.B0391));

    //     this._btnCanAffectSelf.setText(Lang.getText(LangTextType.B0735));
    //     this._btnCanAffectAlly.setText(Lang.getText(LangTextType.B0736));
    //     this._btnCanAffectEnemy.setText(Lang.getText(LangTextType.B0737));

    //     this._labelPriority.setText(Lang.getText(LangTextType.B0739));
    //     this._labelDeltaHp.setText(Lang.getText(LangTextType.B0731));
    //     this._labelDeltaFuelPercentage.setText(Lang.getText(LangTextType.B0732));
    //     this._labelDeltaPrimaryAmmoPercentage.setText(Lang.getText(LangTextType.B0733));
    //     this._labelRangeForUp.setText(Lang.getText(LangTextType.B0742));
    //     this._labelRangeForDown.setText(Lang.getText(LangTextType.B0744));
    //     this._labelRangeForLeft.setText(Lang.getText(LangTextType.B0745));
    //     this._labelRangeForRight.setText(Lang.getText(LangTextType.B0743));

    //     this._updateLabelDescAndLabelError();
    // }

    // private _updateLabelDescAndLabelError(): void {
    //     const customData        = this._getCustomData();
    //     const errorTip          = PhTileCustomLaserTurretData.getErrorTip(customData);
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
    // private _updateInputOffsetHp(): void {
    //     this._inputDeltaHp.setInputText(`${this._getCustomData().offsetHp ?? ``}`);
    // }
    // private _updateInputOffsetFuelPercentage(): void {
    //     this._inputDeltaFuelPercentage.setInputText(`${this._getCustomData().offsetFuelPercentage ?? ``}`);
    // }
    // private _updateInputOffsetPrimaryAmmoPercentage(): void {
    //     this._inputDeltaPrimaryAmmoPercentage.setInputText(`${this._getCustomData().offsetPrimaryAmmoPercentage ?? ``}`);
    // }
    // private _updateInputRangeForUp(): void {
    //     this._inputRangeForUp.setInputText(`${this._getCustomData().rangeForUp ?? ``}`);
    // }
    // private _updateInputRangeForDown(): void {
    //     this._inputRangeForDown.setInputText(`${this._getCustomData().rangeForDown ?? ``}`);
    // }
    // private _updateInputRangeForLeft(): void {
    //     this._inputRangeForLeft.setInputText(`${this._getCustomData().rangeForLeft ?? ``}`);
    // }
    // private _updateInputRangeForRight(): void {
    //     this._inputRangeForRight.setInputText(`${this._getCustomData().rangeForRight ?? ``}`);
    // }

    // private _getCustomData(): ITileCustomLaserTurretData {
    //     return this._customData;
    // }
    // private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
    //     this._imgInnerTouchMask.setIsVisible(isEnabled);
    // }
}
