import {
    ValueAndComparators_Constants,
    MultiplierAndOffsets_Utils,
    Graphics_Constants,
    Notifications_Dispatcher,
    WarEvents_Constants,
    Lang_Utils,
    ArrayModifiers_Utils,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    ValueAndComparators_Utils,
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
    type Ui_Interfaces_IUiScroller,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { ArrayModifier } from "../../proto/schema/CommonProto/Structure/ArrayModifier.ts";
import { MultiplierAndOffset } from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetCustomBuildingStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateSimple.ts";

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

    private readonly _btnActDefenseAmount!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDefenseAmount!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActDefenseUnitTypeArray!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDefenseUnitTypeArray!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActMaxCapturePoint!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActMaxCapturePoint!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActDeleteMaxCapturePoint!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDeleteMaxCapturePoint!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActIsDefeatedOnCapture!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsDefeatedOnCapture!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActRepairNormalizedHp!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRepairNormalizedHp!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActDeleteRepairNormalizedHp!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDeleteRepairNormalizedHp!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActRepairUnitTypeArray!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRepairUnitTypeArray!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActIncomePerTurn!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIncomePerTurn!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActVisionRange!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActVisionRange!                      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActIsVisionEnabledForAllPlayers!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsVisionEnabledForAllPlayers!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActHideUnitTypeArray!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActHideUnitTypeArray!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActProduceUnitTypeArray!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActProduceUnitTypeArray!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActGlobalAttackBonus!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActGlobalAttackBonus!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActGlobalDefenseBonus!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActGlobalDefenseBonus!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActUnitTypeArrayForCoBoard!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActUnitTypeArrayForCoBoard!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActBlockEnemyUnitTypeArray!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActBlockEnemyUnitTypeArray!         : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnType,                                callback : this._onTouchedBtnType },
            { ui : this._btnClose,                               callback : this.closePanel },

            { ui : this._btnConPlayerFilter,                     callback : this._onTouchedBtnConPlayerFilter },
            { ui : this._btnConUnitFilter,                       callback : this._onTouchedBtnConUnitFilter },
            { ui : this._btnConUnitComparator,                   callback : this._onTouchedBtnConUnitComparator },
            { ui : this._btnConTileFilter,                       callback : this._onTouchedBtnConTileFilter },

            { ui : this._btnActDefenseAmount,                    callback : this._onTouchedBtnActDefenseAmount },
            { ui : this._btnActDefenseUnitTypeArray,             callback : this._onTouchedBtnActDefenseUnitTypeArray },
            { ui : this._btnActMaxCapturePoint,                  callback : this._onTouchedBtnActMaxCapturePoint },
            { ui : this._btnActDeleteMaxCapturePoint,            callback : this._onTouchedBtnActDeleteMaxCapturePoint },
            { ui : this._btnActIsDefeatedOnCapture,              callback : this._onTouchedBtnActIsDefeatedOnCapture },
            { ui : this._btnActRepairNormalizedHp,               callback : this._onTouchedBtnActRepairNormalizedHp },
            { ui : this._btnActDeleteRepairNormalizedHp,         callback : this._onTouchedBtnActDeleteRepairNormalizedHp },
            { ui : this._btnActRepairUnitTypeArray,              callback : this._onTouchedBtnActRepairUnitTypeArray },
            { ui : this._btnActIncomePerTurn,                    callback : this._onTouchedBtnActIncomePerTurn },
            { ui : this._btnActVisionRange,                      callback : this._onTouchedBtnActVisionRange },
            { ui : this._btnActIsVisionEnabledForAllPlayers,     callback : this._onTouchedBtnActIsVisionEnabledForAllPlayers },
            { ui : this._btnActHideUnitTypeArray,                callback : this._onTouchedBtnActHideUnitTypeArray },
            { ui : this._btnActProduceUnitTypeArray,             callback : this._onTouchedBtnActProduceUnitTypeArray },
            { ui : this._btnActGlobalAttackBonus,                callback : this._onTouchedBtnActGlobalAttackBonus },
            { ui : this._btnActGlobalDefenseBonus,               callback : this._onTouchedBtnActGlobalDefenseBonus },
            { ui : this._btnActUnitTypeArrayForCoBoard,          callback : this._onTouchedBtnActUnitTypeArrayForCoBoard },
            { ui : this._btnActBlockEnemyUnitTypeArray,          callback : this._onTouchedBtnActBlockEnemyUnitTypeArray },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,         callback : this._onNotifyWarEventFullDataChanged },
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
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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

                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActDefenseAmount(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActDefenseAmount();
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
                        action.setActDefenseAmount(null);
                    } else {
                        action.setActDefenseAmount(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActDefenseUnitTypeArray(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const allUnitTypeArray = gameConfig.getAllUnitTypeArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1425),
            availableUnitTypeArray : allUnitTypeArray,
            currentUnitTypeArray   : action.getActDefenseUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig             : gameConfig,
            callbackOnConfirm      : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActDefenseUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray    : addIntArray,
                        deleteIntArray : [],
                    }));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1426),
                        availableUnitTypeArray : remainingValueArray,
                        currentUnitTypeArray   : action.getActDefenseUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig             : gameConfig,
                        callbackOnConfirm      : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActDefenseUnitTypeArray(null);
                            } else {
                                action.setActDefenseUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray    : addIntArray,
                                    deleteIntArray : deleteIntArray,
                                }));
                            }
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                        },
                    });
                }
            },
        });
    }

    private _onTouchedBtnActMaxCapturePoint(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActMaxCapturePoint();
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
                        action.setActMaxCapturePoint(null);
                    } else {
                        action.setActMaxCapturePoint(multiplierAndOffset);
                        action.setActDeleteMaxCapturePoint(null);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActDeleteMaxCapturePoint(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        if (action.getActDeleteMaxCapturePoint()) {
            action.setActDeleteMaxCapturePoint(null);
        } else {
            action.setActDeleteMaxCapturePoint(true);
            action.setActMaxCapturePoint(null);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActIsDefeatedOnCapture(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActIsDefeatedOnCapture();
        if (oldValue == null) {
            action.setActIsDefeatedOnCapture(true);
        } else if (oldValue) {
            action.setActIsDefeatedOnCapture(false);
        } else {
            action.setActIsDefeatedOnCapture(null);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActRepairNormalizedHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActRepairNormalizedHp();
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
                        action.setActRepairNormalizedHp(null);
                    } else {
                        action.setActRepairNormalizedHp(multiplierAndOffset);
                        action.setActDeleteRepairNormalizedHp(null);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActDeleteRepairNormalizedHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        if (action.getActDeleteRepairNormalizedHp()) {
            action.setActDeleteRepairNormalizedHp(null);
        } else {
            action.setActDeleteRepairNormalizedHp(true);
            action.setActRepairNormalizedHp(null);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActRepairUnitTypeArray(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const allUnitTypeArray = gameConfig.getAllUnitTypeArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1425),
            availableUnitTypeArray : allUnitTypeArray,
            currentUnitTypeArray   : action.getActRepairUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig             : gameConfig,
            callbackOnConfirm      : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActRepairUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray    : addIntArray,
                        deleteIntArray : [],
                    }));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1426),
                        availableUnitTypeArray : remainingValueArray,
                        currentUnitTypeArray   : action.getActRepairUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig             : gameConfig,
                        callbackOnConfirm      : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActRepairUnitTypeArray(null);
                            } else {
                                action.setActRepairUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray    : addIntArray,
                                    deleteIntArray : deleteIntArray,
                                }));
                            }
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                        },
                    });
                }
            },
        });
    }

    private _onTouchedBtnActIncomePerTurn(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActIncomePerTurn();
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
                        action.setActIncomePerTurn(null);
                    } else {
                        action.setActIncomePerTurn(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActVisionRange(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActVisionRange();
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
                        action.setActVisionRange(null);
                    } else {
                        action.setActVisionRange(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActIsVisionEnabledForAllPlayers(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActIsVisionEnabledForAllPlayers();
        if (oldValue == null) {
            action.setActIsVisionEnabledForAllPlayers(true);
        } else if (oldValue) {
            action.setActIsVisionEnabledForAllPlayers(false);
        } else {
            action.setActIsVisionEnabledForAllPlayers(null);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActHideUnitTypeArray(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const allUnitTypeArray = gameConfig.getAllUnitTypeArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1425),
            availableUnitTypeArray : allUnitTypeArray,
            currentUnitTypeArray   : action.getActHideUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig             : gameConfig,
            callbackOnConfirm      : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActHideUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray    : addIntArray,
                        deleteIntArray : [],
                    }));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1426),
                        availableUnitTypeArray : remainingValueArray,
                        currentUnitTypeArray   : action.getActHideUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig             : gameConfig,
                        callbackOnConfirm      : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActHideUnitTypeArray(null);
                            } else {
                                action.setActHideUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray    : addIntArray,
                                    deleteIntArray : deleteIntArray,
                                }));
                            }
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                        },
                    });
                }
            },
        });
    }

    private _onTouchedBtnActProduceUnitTypeArray(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const allUnitTypeArray = gameConfig.getAllUnitTypeArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1425),
            availableUnitTypeArray : allUnitTypeArray,
            currentUnitTypeArray   : action.getActProduceUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig             : gameConfig,
            callbackOnConfirm      : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActProduceUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray    : addIntArray,
                        deleteIntArray : [],
                    }));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1426),
                        availableUnitTypeArray : remainingValueArray,
                        currentUnitTypeArray   : action.getActProduceUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig             : gameConfig,
                        callbackOnConfirm      : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActProduceUnitTypeArray(null);
                            } else {
                                action.setActProduceUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray    : addIntArray,
                                    deleteIntArray : deleteIntArray,
                                }));
                            }
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                        },
                    });
                }
            },
        });
    }

    private _onTouchedBtnActGlobalAttackBonus(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActGlobalAttackBonus();
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
                        action.setActGlobalAttackBonus(null);
                    } else {
                        action.setActGlobalAttackBonus(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActGlobalDefenseBonus(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActGlobalDefenseBonus();
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
                        action.setActGlobalDefenseBonus(null);
                    } else {
                        action.setActGlobalDefenseBonus(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActUnitTypeArrayForCoBoard(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const allUnitTypeArray = gameConfig.getAllUnitTypeArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1425),
            availableUnitTypeArray : allUnitTypeArray,
            currentUnitTypeArray   : action.getActUnitTypeArrayForCoBoard()?.getAddIntArray() ?? [],
            gameConfig             : gameConfig,
            callbackOnConfirm      : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActUnitTypeArrayForCoBoard(ArrayModifier.fromJson({
                        addIntArray    : addIntArray,
                        deleteIntArray : [],
                    }));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1426),
                        availableUnitTypeArray : remainingValueArray,
                        currentUnitTypeArray   : action.getActUnitTypeArrayForCoBoard()?.getDeleteIntArray() ?? [],
                        gameConfig             : gameConfig,
                        callbackOnConfirm      : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActUnitTypeArrayForCoBoard(null);
                            } else {
                                action.setActUnitTypeArrayForCoBoard(ArrayModifier.fromJson({
                                    addIntArray    : addIntArray,
                                    deleteIntArray : deleteIntArray,
                                }));
                            }
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                        },
                    });
                }
            },
        });
    }

    private _onTouchedBtnActBlockEnemyUnitTypeArray(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const allUnitTypeArray = gameConfig.getAllUnitTypeArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1425),
            availableUnitTypeArray : allUnitTypeArray,
            currentUnitTypeArray   : action.getActBlockEnemyUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig             : gameConfig,
            callbackOnConfirm      : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActBlockEnemyUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray    : addIntArray,
                        deleteIntArray : [],
                    }));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText           : () => Lang_Utils.getText(Lang_Constants.TextType.B1426),
                        availableUnitTypeArray : remainingValueArray,
                        currentUnitTypeArray   : action.getActBlockEnemyUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig             : gameConfig,
                        callbackOnConfirm      : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActBlockEnemyUnitTypeArray(null);
                            } else {
                                action.setActBlockEnemyUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray    : addIntArray,
                                    deleteIntArray : deleteIntArray,
                                }));
                            }
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                        },
                    });
                }
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

        this._btnActDefenseAmount.setLangText(Lang_Constants.TextType.DefBonus$);
        this._btnActDefenseUnitTypeArray.setLangText(Lang_Constants.TextType.DefensibleUnits);
        this._btnActMaxCapturePoint.setLangText(Lang_Constants.TextType.MaxCapturePoint);
        this._btnActDeleteMaxCapturePoint.setLangText(Lang_Constants.TextType.B0220);
        this._btnActIsDefeatedOnCapture.setLangText(Lang_Constants.TextType.DefeatIfCaptured);
        this._btnActRepairNormalizedHp.setLangText(Lang_Constants.TextType.RepairHpAmount);
        this._btnActDeleteRepairNormalizedHp.setLangText(Lang_Constants.TextType.B0220);
        this._btnActRepairUnitTypeArray.setLangText(Lang_Constants.TextType.RepairableUnits);
        this._btnActIncomePerTurn.setLangText(Lang_Constants.TextType.Income);
        this._btnActVisionRange.setLangText(Lang_Constants.TextType.VisionRange);
        this._btnActIsVisionEnabledForAllPlayers.setLangText(Lang_Constants.TextType.SharedVision);
        this._btnActHideUnitTypeArray.setLangText(Lang_Constants.TextType.HidableUnits);
        this._btnActProduceUnitTypeArray.setLangText(Lang_Constants.TextType.ProducibleUnits);
        this._btnActGlobalAttackBonus.setLangText(Lang_Constants.TextType.GlobalAtkBonus);
        this._btnActGlobalDefenseBonus.setLangText(Lang_Constants.TextType.GlobalDefBonus);
        this._btnActUnitTypeArrayForCoBoard.setLangText(Lang_Constants.TextType.CoBoardableUnit);
        this._btnActBlockEnemyUnitTypeArray.setLangText(Lang_Constants.TextType.BlockableEnemyUnits);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();

        this._updateLabelActDefenseAmount();
        this._updateLabelActDefenseUnitTypeArray();
        this._updateLabelActMaxCapturePoint();
        this._updateLabelActDeleteMaxCapturePoint();
        this._updateLabelActIsDefeatedOnCapture();
        this._updateLabelActRepairNormalizedHp();
        this._updateLabelActDeleteRepairNormalizedHp();
        this._updateLabelActRepairUnitTypeArray();
        this._updateLabelActIncomePerTurn();
        this._updateLabelActVisionRange();
        this._updateLabelActIsVisionEnabledForAllPlayers();
        this._updateLabelActHideUnitTypeArray();
        this._updateLabelActProduceUnitTypeArray();
        this._updateLabelActGlobalAttackBonus();
        this._updateLabelActGlobalDefenseBonus();
        this._updateLabelActUnitTypeArrayForCoBoard();
        this._updateLabelActBlockEnemyUnitTypeArray();
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

    private _updateLabelActDefenseAmount(): void {
        const act = this._getAction()?.getActDefenseAmount();
        this._labelActDefenseAmount.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActDefenseUnitTypeArray(): void {
        const act = this._getAction()?.getActDefenseUnitTypeArray();
        this._labelActDefenseUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiers_Utils.getDesc(act, Lang_Utils.getText(Lang_Constants.TextType.DefensibleUnits)),
        );
    }

    private _updateLabelActMaxCapturePoint(): void {
        const act = this._getAction()?.getActMaxCapturePoint();
        this._labelActMaxCapturePoint.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActDeleteMaxCapturePoint(): void {
        const act = this._getAction()?.getActDeleteMaxCapturePoint();
        this._labelActDeleteMaxCapturePoint.setText(act ? Lang_Utils.getText(Lang_Constants.TextType.Yes) : ``);
    }

    private _updateLabelActIsDefeatedOnCapture(): void {
        const act = this._getAction()?.getActIsDefeatedOnCapture();
        this._labelActIsDefeatedOnCapture.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act),
        );
    }

    private _updateLabelActRepairNormalizedHp(): void {
        const act = this._getAction()?.getActRepairNormalizedHp();
        this._labelActRepairNormalizedHp.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActDeleteRepairNormalizedHp(): void {
        const act = this._getAction()?.getActDeleteRepairNormalizedHp();
        this._labelActDeleteRepairNormalizedHp.setText(act ? Lang_Utils.getText(Lang_Constants.TextType.Yes) : ``);
    }

    private _updateLabelActRepairUnitTypeArray(): void {
        const act = this._getAction()?.getActRepairUnitTypeArray();
        this._labelActRepairUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiers_Utils.getDesc(act, Lang_Utils.getText(Lang_Constants.TextType.RepairableUnits)),
        );
    }

    private _updateLabelActIncomePerTurn(): void {
        const act = this._getAction()?.getActIncomePerTurn();
        this._labelActIncomePerTurn.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActVisionRange(): void {
        const act = this._getAction()?.getActVisionRange();
        this._labelActVisionRange.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActIsVisionEnabledForAllPlayers(): void {
        const act = this._getAction()?.getActIsVisionEnabledForAllPlayers();
        this._labelActIsVisionEnabledForAllPlayers.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act),
        );
    }

    private _updateLabelActHideUnitTypeArray(): void {
        const act = this._getAction()?.getActHideUnitTypeArray();
        this._labelActHideUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiers_Utils.getDesc(act, Lang_Utils.getText(Lang_Constants.TextType.HidableUnits)),
        );
    }

    private _updateLabelActProduceUnitTypeArray(): void {
        const act = this._getAction()?.getActProduceUnitTypeArray();
        this._labelActProduceUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiers_Utils.getDesc(act, Lang_Utils.getText(Lang_Constants.TextType.ProducibleUnits)),
        );
    }

    private _updateLabelActGlobalAttackBonus(): void {
        const act = this._getAction()?.getActGlobalAttackBonus();
        this._labelActGlobalAttackBonus.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActGlobalDefenseBonus(): void {
        const act = this._getAction()?.getActGlobalDefenseBonus();
        this._labelActGlobalDefenseBonus.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActUnitTypeArrayForCoBoard(): void {
        const act = this._getAction()?.getActUnitTypeArrayForCoBoard();
        this._labelActUnitTypeArrayForCoBoard.setText(act == null
            ? ``
            : ArrayModifiers_Utils.getDesc(act, Lang_Utils.getText(Lang_Constants.TextType.CoBoardableUnit)),
        );
    }

    private _updateLabelActBlockEnemyUnitTypeArray(): void {
        const act = this._getAction()?.getActBlockEnemyUnitTypeArray();
        this._labelActBlockEnemyUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiers_Utils.getDesc(act, Lang_Utils.getText(Lang_Constants.TextType.BlockableEnemyUnits)),
        );
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateSimple> {
        return this.getOpenData()?.action.getWeaSetCustomBuildingStateSimple();
    }
}
