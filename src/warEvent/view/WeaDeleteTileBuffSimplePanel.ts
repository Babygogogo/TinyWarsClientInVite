import {
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
import type { WeaDeleteTileBuffSimple } from "../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffSimple.ts";

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

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },
            { ui: this._btnConTileBuffFilter,                   callback: this._onTouchedBtnConTileBuffFilter },
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
                    currentValue    : oldCon?.getValue(),
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

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();
        this._updateLabelConTileBuffFilter();
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

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteTileBuffSimple> {
        return this.getOpenData()?.action.getWeaDeleteTileBuffSimple();
    }
}
