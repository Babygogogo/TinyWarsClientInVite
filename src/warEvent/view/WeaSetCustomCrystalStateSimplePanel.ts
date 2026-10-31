import {
    ValueAndComparators_Constants,
    MultiplierAndOffsets_Utils,
    Graphics_Constants,
    Notifications_Dispatcher,
    WarEvents_Constants,
    Lang_Utils,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    ValueAndComparators_Utils,
    GamePanels_Manager,
    Lang_Constants,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { MultiplierAndOffset } from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetCustomCrystalStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateSimple.ts";

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

    private readonly _sclContent!                               : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;

    private readonly _btnConPlayerFilter!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConUnitFilter!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitFilter!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConUnitComparator!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitComparator!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConTileFilter!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActRadius!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRadius!                           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActPriority!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActPriority!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCanAffectSelf!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanAffectSelf!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCanAffectAlly!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanAffectAlly!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCanAffectEnemy!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanAffectEnemy!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActOffsetFund!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetFund!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActOffsetEnergyPercentage!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetEnergyPercentage!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActOffsetHp!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetHp!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActOffsetFuelPercentage!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetFuelPercentage!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActOffsetPrimaryAmmoPercentage!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetPrimaryAmmoPercentage!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCanBeFatal!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanBeFatal!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnType,                                callback : this._onTouchedBtnType },
            { ui : this._btnClose,                               callback : this.closePanel },

            { ui : this._btnConPlayerFilter,                     callback : this._onTouchedBtnConPlayerFilter },
            { ui : this._btnConUnitFilter,                       callback : this._onTouchedBtnConUnitFilter },
            { ui : this._btnConUnitComparator,                   callback : this._onTouchedBtnConUnitComparator },
            { ui : this._btnConTileFilter,                       callback : this._onTouchedBtnConTileFilter },

            { ui : this._btnActRadius,                           callback : this._onTouchedBtnActRadius },
            { ui : this._btnActPriority,                         callback : this._onTouchedBtnActPriority },
            { ui : this._btnActCanAffectSelf,                    callback : this._onTouchedBtnActCanAffectSelf },
            { ui : this._btnActCanAffectAlly,                    callback : this._onTouchedBtnActCanAffectAlly },
            { ui : this._btnActCanAffectEnemy,                   callback : this._onTouchedBtnActCanAffectEnemy },
            { ui : this._btnActOffsetFund,                       callback : this._onTouchedBtnActOffsetFund },
            { ui : this._btnActOffsetEnergyPercentage,           callback : this._onTouchedBtnActOffsetEnergyPercentage },
            { ui : this._btnActOffsetHp,                         callback : this._onTouchedBtnActOffsetHp },
            { ui : this._btnActOffsetFuelPercentage,             callback : this._onTouchedBtnActOffsetFuelPercentage },
            { ui : this._btnActOffsetPrimaryAmmoPercentage,      callback : this._onTouchedBtnActOffsetPrimaryAmmoPercentage },
            { ui : this._btnActCanBeFatal,                       callback : this._onTouchedBtnActCanBeFatal },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",         callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();

        this._sclContent.scrollTop();
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
            war      : openData.war,
            fullData : openData.fullData,
            action   : openData.action,
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
            gameConfig            : war.getGcData(),
            playersCountUnneutral : war.getPlayersCountUnneutral(),
            currentFilter         : action.getConPlayerFilter(),
            callback              : filter => {
                action.setConPlayerFilter(filter);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
            gameConfig            : war.getGcData(),
            playersCountUnneutral : war.getPlayersCountUnneutral(),
            mapSize               : war.getTileMap().getMapSize(),
            currentFilter         : action.getConUnitFilter(),
            callback              : filter => {
                action.setConUnitFilter(filter);

                if ((filter != null) && (!action.getConUnitComparator())) {
                    action.setConUnitComparator(ValueAndComparator.fromJson({
                        comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
                        value      : 0,
                    }));
                }

                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.Comparator),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            currentNumber        : oldCon?.getComparator(),
            getNumberMainText    : num => Lang_Utils.getComparatorName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : sign => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0160),
                    currentValue : oldCon?.getValue() ?? 0,
                    minValue     : 0,
                    maxValue     : 10,
                    callback     : unitsCount => {
                        if (unitsCount == null) {
                            action.setConUnitComparator(null);
                            action.setConUnitFilter(null);
                            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                        } else {
                            if (oldCon) {
                                oldCon.setValue(unitsCount);
                                oldCon.setComparator(sign);
                            } else {
                                action.setConUnitComparator(ValueAndComparator.fromJson({
                                    comparator : sign,
                                    value      : unitsCount,
                                }));
                            }

                            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                        }
                    },
                });
            },
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
            gameConfig            : war.getGcData(),
            playersCountUnneutral : war.getPlayersCountUnneutral(),
            mapSize               : war.getTileMap().getMapSize(),
            currentFilter         : action.getConTileFilter(),
            callback              : filter => {
                action.setConTileFilter(filter);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnActRadius(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActRadius();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue     : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue     : WarEvents_Constants.Event.MaxMultiplier,
            currentValue : act?.getMultiplierPct() ?? 100,
            callback     : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue     : -WarEvents_Constants.Event.MaxOffset,
                maxValue     : WarEvents_Constants.Event.MaxOffset,
                currentValue : act?.getOffset() ?? 0,
                callback     : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct : newMultiplierPct,
                        offset        : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActRadius(null);
                    } else {
                        action.setActRadius(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }

    private _onTouchedBtnActPriority(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActPriority();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue     : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue     : WarEvents_Constants.Event.MaxMultiplier,
            currentValue : act?.getMultiplierPct() ?? 100,
            callback     : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue     : -WarEvents_Constants.Event.MaxOffset,
                maxValue     : WarEvents_Constants.Event.MaxOffset,
                currentValue : act?.getOffset() ?? 0,
                callback     : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct : newMultiplierPct,
                        offset        : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActPriority(null);
                    } else {
                        action.setActPriority(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }

    private _onTouchedBtnActCanAffectSelf(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActCanAffectSelf();
        if (oldValue == null) {
            action.setActCanAffectSelf(true);
        } else if (oldValue) {
            action.setActCanAffectSelf(false);
        } else {
            action.setActCanAffectSelf(null);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _onTouchedBtnActCanAffectAlly(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActCanAffectAlly();
        if (oldValue == null) {
            action.setActCanAffectAlly(true);
        } else if (oldValue) {
            action.setActCanAffectAlly(false);
        } else {
            action.setActCanAffectAlly(null);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _onTouchedBtnActCanAffectEnemy(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActCanAffectEnemy();
        if (oldValue == null) {
            action.setActCanAffectEnemy(true);
        } else if (oldValue) {
            action.setActCanAffectEnemy(false);
        } else {
            action.setActCanAffectEnemy(null);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _onTouchedBtnActOffsetFund(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetFund();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue     : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue     : WarEvents_Constants.Event.MaxMultiplier,
            currentValue : act?.getMultiplierPct() ?? 100,
            callback     : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue     : -WarEvents_Constants.Event.MaxOffset,
                maxValue     : WarEvents_Constants.Event.MaxOffset,
                currentValue : act?.getOffset() ?? 0,
                callback     : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct : newMultiplierPct,
                        offset        : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActOffsetFund(null);
                    } else {
                        action.setActOffsetFund(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }

    private _onTouchedBtnActOffsetEnergyPercentage(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetEnergyPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue     : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue     : WarEvents_Constants.Event.MaxMultiplier,
            currentValue : act?.getMultiplierPct() ?? 100,
            callback     : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue     : -WarEvents_Constants.Event.MaxOffset,
                maxValue     : WarEvents_Constants.Event.MaxOffset,
                currentValue : act?.getOffset() ?? 0,
                callback     : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct : newMultiplierPct,
                        offset        : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActOffsetEnergyPercentage(null);
                    } else {
                        action.setActOffsetEnergyPercentage(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }

    private _onTouchedBtnActOffsetHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetHp();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue     : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue     : WarEvents_Constants.Event.MaxMultiplier,
            currentValue : act?.getMultiplierPct() ?? 100,
            callback     : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue     : -WarEvents_Constants.Event.MaxOffset,
                maxValue     : WarEvents_Constants.Event.MaxOffset,
                currentValue : act?.getOffset() ?? 0,
                callback     : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct : newMultiplierPct,
                        offset        : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActOffsetHp(null);
                    } else {
                        action.setActOffsetHp(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }

    private _onTouchedBtnActOffsetFuelPercentage(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetFuelPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue     : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue     : WarEvents_Constants.Event.MaxMultiplier,
            currentValue : act?.getMultiplierPct() ?? 100,
            callback     : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue     : -WarEvents_Constants.Event.MaxOffset,
                maxValue     : WarEvents_Constants.Event.MaxOffset,
                currentValue : act?.getOffset() ?? 0,
                callback     : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct : newMultiplierPct,
                        offset        : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActOffsetFuelPercentage(null);
                    } else {
                        action.setActOffsetFuelPercentage(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }

    private _onTouchedBtnActOffsetPrimaryAmmoPercentage(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetPrimaryAmmoPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue     : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue     : WarEvents_Constants.Event.MaxMultiplier,
            currentValue : act?.getMultiplierPct() ?? 100,
            callback     : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue     : -WarEvents_Constants.Event.MaxOffset,
                maxValue     : WarEvents_Constants.Event.MaxOffset,
                currentValue : act?.getOffset() ?? 0,
                callback     : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct : newMultiplierPct,
                        offset        : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActOffsetPrimaryAmmoPercentage(null);
                    } else {
                        action.setActOffsetPrimaryAmmoPercentage(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }

    private _onTouchedBtnActCanBeFatal(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActCanBeFatal();
        if (oldValue == null) {
            action.setActCanBeFatal(true);
        } else if (oldValue) {
            action.setActCanBeFatal(false);
        } else {
            action.setActCanBeFatal(null);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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

        this._btnActRadius.setLangText(Lang_Constants.TextType.EffectiveRadius);
        this._btnActPriority.setLangText(Lang_Constants.TextType.Priority);
        this._btnActCanAffectSelf.setLangText(Lang_Constants.TextType.AffectOwner);
        this._btnActCanAffectAlly.setLangText(Lang_Constants.TextType.AffectAlly);
        this._btnActCanAffectEnemy.setLangText(Lang_Constants.TextType.AffectEnemy);
        this._btnActOffsetFund.setLangText(Lang_Constants.TextType.FundOffset);
        this._btnActOffsetEnergyPercentage.setLangText(Lang_Constants.TextType.CoEnergyOffset$);
        this._btnActOffsetHp.setLangText(Lang_Constants.TextType.UnitsHpOffset);
        this._btnActOffsetFuelPercentage.setLangText(Lang_Constants.TextType.UnitsFuelOffset$);
        this._btnActOffsetPrimaryAmmoPercentage.setLangText(Lang_Constants.TextType.UnitsPriAmmoOffset$);
        this._btnActCanBeFatal.setLangText(Lang_Constants.TextType.CanBeFatal);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();

        this._updateLabelActRadius();
        this._updateLabelActPriority();
        this._updateLabelActCanAffectSelf();
        this._updateLabelActCanAffectAlly();
        this._updateLabelActCanAffectEnemy();
        this._updateLabelActOffsetFund();
        this._updateLabelActOffsetEnergyPercentage();
        this._updateLabelActOffsetHp();
        this._updateLabelActOffsetFuelPercentage();
        this._updateLabelActOffsetPrimaryAmmoPercentage();
        this._updateLabelActCanBeFatal();
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
        this._labelConPlayerFilter.setText(this._getAction()?.getConPlayerFilter() == null ? `` : Lang_Utils.getText(Lang_Constants.TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        this._labelConUnitFilter.setText(this._getAction()?.getConUnitFilter() == null ? `` : Lang_Utils.getText(Lang_Constants.TextType.B1408));
    }

    private _updateLabelConUnitComparator(): void {
        const comparator = this._getAction()?.getConUnitComparator();
        this._labelConUnitComparator.setText(comparator == null ? `` : ValueAndComparators_Utils.getBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : Lang_Utils.getText(Lang_Constants.TextType.B1408));
    }

    private _updateLabelActRadius(): void {
        const act = this._getAction()?.getActRadius();
        this._labelActRadius.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActPriority(): void {
        const act = this._getAction()?.getActPriority();
        this._labelActPriority.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActCanAffectSelf(): void {
        const act = this._getAction()?.getActCanAffectSelf();
        this._labelActCanAffectSelf.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act),
        );
    }

    private _updateLabelActCanAffectAlly(): void {
        const act = this._getAction()?.getActCanAffectAlly();
        this._labelActCanAffectAlly.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act),
        );
    }

    private _updateLabelActCanAffectEnemy(): void {
        const act = this._getAction()?.getActCanAffectEnemy();
        this._labelActCanAffectEnemy.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act),
        );
    }

    private _updateLabelActOffsetFund(): void {
        const act = this._getAction()?.getActOffsetFund();
        this._labelActOffsetFund.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActOffsetEnergyPercentage(): void {
        const act = this._getAction()?.getActOffsetEnergyPercentage();
        this._labelActOffsetEnergyPercentage.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActOffsetHp(): void {
        const act = this._getAction()?.getActOffsetHp();
        this._labelActOffsetHp.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActOffsetFuelPercentage(): void {
        const act = this._getAction()?.getActOffsetFuelPercentage();
        this._labelActOffsetFuelPercentage.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act),
        );
    }

    private _updateLabelActOffsetPrimaryAmmoPercentage(): void {
        const act = this._getAction()?.getActOffsetPrimaryAmmoPercentage();
        this._labelActOffsetPrimaryAmmoPercentage.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActCanBeFatal(): void {
        const act = this._getAction()?.getActCanBeFatal();
        this._labelActCanBeFatal.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act),
        );
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateSimple> {
        return this.getOpenData()?.action.getWeaSetCustomCrystalStateSimple();
    }
}
