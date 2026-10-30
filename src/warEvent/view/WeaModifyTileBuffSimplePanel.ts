import {
    WarEvents_Actions_Constants_Common,
    TileBuffs_Constants,
    ValueAndComparators_Constants,
    Graphics_Constants,
    Notifications_Dispatcher,
    ValueAndComparators_Utils,
    Lang_Utils,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    GamePanels_Manager,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaModifyTileBuffSimple } from "../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffSimple.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConPlayerFilter!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConUnitFilter!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitFilter!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConUnitComparator!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitComparator!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConTileFilter!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConTileBuffFilter!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileBuffFilter!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActBuffType!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActBuffType!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActEndTurnIndex!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActEndTurnIndex!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActEndPlayerIndex!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActEndPlayerIndex!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActEndTurnIndexMode!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActEndTurnIndexMode!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActEndPlayerIndexMode!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActEndPlayerIndexMode!               : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },
            { ui: this._btnConTileBuffFilter,                   callback: this._onTouchedBtnConTileBuffFilter },

            { ui: this._btnActBuffType,                         callback: this._onTouchedBtnActBuffType },
            { ui: this._btnActEndTurnIndex,                     callback: this._onTouchedBtnActEndTurnIndex },
            { ui: this._btnActEndPlayerIndex,                   callback: this._onTouchedBtnActEndPlayerIndex },
            { ui: this._btnActEndTurnIndexMode,                 callback: this._onTouchedBtnActEndTurnIndexMode },
            { ui: this._btnActEndPlayerIndexMode,               callback: this._onTouchedBtnActEndPlayerIndexMode },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }

    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeActionTypeListPanel, {
            war         : openData.war,
            fullData    : openData.fullData,
            action      : openData.action,
        });
    }

    private _onTouchedBtnConPlayerFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : action.getConPlayerFilter(),
            callback                : filter => {
                action.setConPlayerFilter(filter);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnConUnitFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConUnitFilter(),
            callback                : filter => {
                action.setConUnitFilter(filter);

                if (filter != null) {
                    if (action.getConUnitComparator() == null) {
                        action.setConUnitComparator(ValueAndComparator.fromJson({
                            comparator  : ValueAndComparators_Constants.ComparatorId.EqualTo,
                            value       : 0,
                        }));
                    }
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnConUnitComparator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldCon = action.getConUnitComparator();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.Comparator),
            availableNumberArray    : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm       : sign => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.B0160),
                    currentValue    : oldCon?.getValue() ?? 0,
                    minValue        : 0,
                    maxValue        : 10,
                    callback        : unitsCount => {
                        if (unitsCount == null) {
                            action.setConUnitComparator(null);
                            action.setConUnitFilter(null);
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                        } else {
                            if (oldCon != null) {
                                oldCon.setValue(unitsCount);
                                oldCon.setComparator(sign);
                            } else {
                                action.setConUnitComparator(ValueAndComparator.fromJson({
                                    value       : unitsCount,
                                    comparator  : sign,
                                }));
                            }

                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                        }
                    },
                });
            }
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConTileFilter(),
            callback                : filter => {
                action.setConTileFilter(filter);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnConTileBuffFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeTileBuffFilterPanel, {
            currentFilter   : action.getConTileBuffFilter(),
            callback        : filter => {
                action.setConTileBuffFilter(filter);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActBuffType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActBuffType();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId),
            availableNumberArray    : [-1, ...TileBuffs_Constants.AllBuffTypeIdArray],
            currentNumber           : act,
            getNumberMainText       : typeId => typeId == -1 ? Lang_Utils.getText(Lang_Constants.TextType.None) : (Lang_Utils.getTileBuffName(typeId) || Lang_Constants.UndefinedError),
            getNumberHelpText       : typeId => typeId == -1 ? Lang_Utils.getText(Lang_Constants.TextType.None) : Lang_Utils.getTileBuffDesc(typeId) || Lang_Constants.UndefinedError,
            callbackOnConfirm       : newValue => {
                action.setActBuffType(newValue == -1 ? null : newValue);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex),
            minValue        : TileBuffs_Constants.EndTimeModification.MinEndTurnIndex,
            maxValue        : TileBuffs_Constants.EndTimeModification.MaxEndTurnIndex,
            currentValue    : action.getActEndTurnIndex(),
            callback        : newValue => {
                action.setActEndTurnIndex(newValue);

                const mode = action.getActEndTurnIndexMode();
                if (newValue == null) {
                    if ((mode !== WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange) && (mode !== WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete)) {
                        action.setActEndPlayerIndex(null);
                        action.setActEndTurnIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange);
                        action.setActEndPlayerIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange);
                    }
                } else {
                    if ((mode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange) || (mode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete)) {
                        action.setActEndPlayerIndex(0);
                        action.setActEndTurnIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetAbsoluteValue);
                        action.setActEndPlayerIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetAbsoluteValue);
                    }
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActEndPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex),
            minValue        : TileBuffs_Constants.EndTimeModification.MinEndPlayerIndex,
            maxValue        : TileBuffs_Constants.EndTimeModification.MaxEndPlayerIndex,
            currentValue    : action.getActEndPlayerIndex(),
            callback        : newValue => {
                action.setActEndPlayerIndex(newValue);

                const mode = action.getActEndPlayerIndexMode();
                if (newValue == null) {
                    if ((mode !== WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange) && (mode !== WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete)) {
                        action.setActEndTurnIndex(null);
                        action.setActEndTurnIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange);
                        action.setActEndPlayerIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange);
                    }
                } else {
                    if ((mode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange) || (mode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete)) {
                        action.setActEndTurnIndex(0);
                        action.setActEndTurnIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetAbsoluteValue);
                        action.setActEndPlayerIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetAbsoluteValue);
                    }
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActEndTurnIndexMode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0280),
            availableNumberArray    : WarEvents_Actions_Constants_Common.AllBuffEndTimeModificationModeArray,
            getNumberMainText       : mode => Lang_Utils.getBuffEndTimeModificationModeName(mode) || Lang_Constants.UndefinedError,
            currentNumber           : action.getActEndTurnIndexMode(),
            callbackOnConfirm       : newMode => {
                action.setActEndTurnIndexMode(newMode);

                if ((newMode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange) || (newMode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete)) {
                    action.setActEndTurnIndex(null);

                    if (newMode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete) {
                        action.setActEndPlayerIndex(null);
                        action.setActEndPlayerIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete);
                    } else {
                        if (action.getActEndPlayerIndexMode() === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete) {
                            action.setActEndPlayerIndex(null);
                            action.setActEndPlayerIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange);
                        }
                    }

                } else {
                    action.setActEndTurnIndex(action.getActEndTurnIndex() ?? 0);

                    if (action.getActEndPlayerIndexMode() === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete) {
                        action.setActEndPlayerIndex(null);
                        action.setActEndPlayerIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange);
                    }
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActEndPlayerIndexMode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0280),
            availableNumberArray    : WarEvents_Actions_Constants_Common.AllBuffEndTimeModificationModeArray,
            getNumberMainText       : mode => Lang_Utils.getBuffEndTimeModificationModeName(mode) || Lang_Constants.UndefinedError,
            currentNumber           : action.getActEndPlayerIndexMode(),
            callbackOnConfirm       : newMode => {
                action.setActEndPlayerIndexMode(newMode);

                if ((newMode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange) || (newMode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete)) {
                    action.setActEndPlayerIndex(null);

                    if (newMode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete) {
                        action.setActEndTurnIndex(null);
                        action.setActEndTurnIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete);
                    } else {
                        if (action.getActEndTurnIndexMode() === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete) {
                            action.setActEndTurnIndex(null);
                            action.setActEndTurnIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange);
                        }
                    }

                } else {
                    action.setActEndPlayerIndex(action.getActEndPlayerIndex() ?? 0);

                    if (action.getActEndTurnIndexMode() === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete) {
                        action.setActEndTurnIndex(null);
                        action.setActEndTurnIndexMode(WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange);
                    }
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);

        this._btnConPlayerFilter.setLangText(Lang_Constants.TextType.PlayerFilter);
        this._btnConUnitFilter.setLangText(Lang_Constants.TextType.UnitFilter);
        this._btnConUnitComparator.setLangText(Lang_Constants.TextType.Comparator);
        this._btnConTileFilter.setLangText(Lang_Constants.TextType.TileFilter);
        this._btnConTileBuffFilter.setLangText(Lang_Constants.TextType.B1235);

        this._btnActBuffType.setLangText(Lang_Constants.TextType.AbnormalStateTypeId);
        this._btnActEndTurnIndex.setLangText(Lang_Constants.TextType.EndTurnIndex);
        this._btnActEndPlayerIndex.setLangText(Lang_Constants.TextType.EndPlayerIndex);
        this._btnActEndTurnIndexMode.setLangText(Lang_Constants.TextType.B0280);
        this._btnActEndPlayerIndexMode.setLangText(Lang_Constants.TextType.B0280);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();
        this._updateLabelConTileBuffFilter();

        this._updateLabelActBuffType();
        this._updateLabelActEndTurnIndex();
        this._updateLabelActEndPlayerIndex();
        this._updateLabelActIsRelativeEndTurnIndex();
        this._updateLabelActEndPlayerIndexMode();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const war               = openData.war;
        const errorTip          = WarEvents_Actions_Utils_Common.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Actions_Utils_Common.getDetailDescForAction(action, war.getGcData()) || Lang_Constants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConPlayerFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConPlayerFilter.setText(action.getConPlayerFilter() == null ? `` : Lang_Utils.getText(Lang_Constants.TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConUnitFilter.setText(action.getConUnitFilter() == null ? `` : Lang_Utils.getText(Lang_Constants.TextType.B1408));
    }

    private _updateLabelConUnitComparator(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const comparator = action.getConUnitComparator();
        this._labelConUnitComparator.setText(comparator == null ? `` : ValueAndComparators_Utils.getBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConTileFilter.setText(action.getConTileFilter() == null ? `` : Lang_Utils.getText(Lang_Constants.TextType.B1408));
    }

    private _updateLabelConTileBuffFilter(): void {
        const action = this._getAction();
        this._labelConTileBuffFilter.setText(action == null || action.getConTileBuffFilter() == null ? `` : Lang_Utils.getText(Lang_Constants.TextType.B1408));
    }

    private _updateLabelActBuffType(): void {
        const buffTypeId = this._getAction()?.getActBuffType();
        this._labelActBuffType.setText(buffTypeId == null ? `` : (Lang_Utils.getTileBuffName(buffTypeId) ?? Lang_Constants.UndefinedError));
    }

    private _updateLabelActEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const value = action.getActEndTurnIndex();
        const label = this._labelActEndTurnIndex;
        if (value == null) {
            label.setText(``);
        } else {
            const mode      = action.getActEndTurnIndexMode();
            const prefix    = ((mode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.AddOffset) || (mode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime)) && (value >= 0)
                ? `+`
                : ``;
            label.setText(`${prefix}${value}`);
        }
    }

    private _updateLabelActEndPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const value = action.getActEndPlayerIndex();
        const label = this._labelActEndPlayerIndex;
        if (value == null) {
            label.setText(``);
        } else {
            const mode      = action.getActEndPlayerIndexMode();
            const prefix    = ((mode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.AddOffset) || (mode === WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime)) && (value >= 0)
                ? `+`
                : ``;
            label.setText(`${prefix}${value}`);
        }
    }

    private _updateLabelActIsRelativeEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const mode = action.getActEndTurnIndexMode();
        this._labelActEndTurnIndexMode.setText(Lang_Utils.getBuffEndTimeModificationModeName(mode) || Lang_Constants.UndefinedError);
    }

    private _updateLabelActEndPlayerIndexMode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const mode = action.getActEndPlayerIndexMode();
        this._labelActEndPlayerIndexMode.setText(Lang_Utils.getBuffEndTimeModificationModeName(mode) || Lang_Constants.UndefinedError);
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaModifyTileBuffSimple> {
        return this.getOpenData()?.action.getWeaModifyTileBuffSimple();
    }
}
