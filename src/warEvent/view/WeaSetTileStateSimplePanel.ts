import {
    ValueAndComparators_Constants,
    Locations_Constants,
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
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { ArrayModifier } from "../../proto/schema/CommonProto/Structure/ArrayModifier.ts";
import { MultiplierAndOffset } from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetTileStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetTileStateSimple.ts";

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

    private readonly _btnActCurrentHp!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCurrentHp!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCurrentBuildPoint!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCurrentBuildPoint!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCurrentCapturePoint!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCurrentCapturePoint!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActPlayerIndex!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActPlayerIndex!                      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActIsHighlighted!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsHighlighted!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActLocationIdArray!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActLocationIdArray!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCustomNameId!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCustomNameId!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnType,                                callback : this._onTouchedBtnType },
            { ui : this._btnClose,                               callback : this.closePanel },

            { ui : this._btnConPlayerFilter,                     callback : this._onTouchedBtnConPlayerFilter },
            { ui : this._btnConUnitFilter,                       callback : this._onTouchedBtnConUnitFilter },
            { ui : this._btnConUnitComparator,                   callback : this._onTouchedBtnConUnitComparator },
            { ui : this._btnConTileFilter,                       callback : this._onTouchedBtnConTileFilter },

            { ui : this._btnActCurrentHp,                        callback : this._onTouchedBtnActCurrentHp },
            { ui : this._btnActCurrentBuildPoint,                callback : this._onTouchedBtnActCurrentBuildPoint },
            { ui : this._btnActCurrentCapturePoint,              callback : this._onTouchedBtnActCurrentCapturePoint },
            { ui : this._btnActPlayerIndex,                      callback : this._onTouchedBtnActPlayerIndex },
            { ui : this._btnActIsHighlighted,                    callback : this._onTouchedBtnActIsHighlighted },
            { ui : this._btnActLocationIdArray,                  callback : this._onTouchedBtnActLocationIdArray },
            { ui : this._btnActCustomNameId,                     callback : this._onTouchedBtnActCustomNameId },
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
                                    value      : unitsCount,
                                    comparator : sign,
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

    private _onTouchedBtnActCurrentHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCurrentHp();
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
                        action.setActCurrentHp(null);
                    } else {
                        action.setActCurrentHp(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActCurrentBuildPoint(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCurrentBuildPoint();
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
                        action.setActCurrentBuildPoint(null);
                    } else {
                        action.setActCurrentBuildPoint(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActCurrentCapturePoint(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCurrentCapturePoint();
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
                        action.setActCurrentCapturePoint(null);
                    } else {
                        action.setActCurrentCapturePoint(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActPlayerIndex();
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
                        action.setActPlayerIndex(null);
                    } else {
                        action.setActPlayerIndex(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }

    private _onTouchedBtnActIsHighlighted(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActIsHighlighted();
        if (oldValue == null) {
            action.setActIsHighlighted(true);
        } else if (oldValue) {
            action.setActIsHighlighted(false);
        } else {
            action.setActIsHighlighted(null);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActLocationIdArray(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            getTitleText          : () => Lang_Utils.getText(Lang_Constants.TextType.B1425),
            availableIntegerArray : Locations_Constants.AllLocationIdArray,
            currentIntegerArray   : action.getActLocationIdArray()?.getAddIntArray() ?? [],
            callbackOnConfirm     : addIntArray => {
                const remainingValueArray = Locations_Constants.AllLocationIdArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActLocationIdArray(ArrayModifier.fromJson({
                        addIntArray    : addIntArray,
                        deleteIntArray : [],
                    }));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
                        getTitleText          : () => Lang_Utils.getText(Lang_Constants.TextType.B1426),
                        availableIntegerArray : remainingValueArray,
                        currentIntegerArray   : action.getActLocationIdArray()?.getDeleteIntArray() ?? [],
                        callbackOnConfirm     : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActLocationIdArray(null);
                            } else {
                                action.setActLocationIdArray(ArrayModifier.fromJson({
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

    private _onTouchedBtnActCustomNameId(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCustomNameId();
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
                        action.setActCustomNameId(null);
                    } else {
                        action.setActCustomNameId(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            }),
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

        this._btnActCurrentHp.setLangText(Lang_Constants.TextType.Hp);
        this._btnActCurrentBuildPoint.setLangText(Lang_Constants.TextType.BuildPoint);
        this._btnActCurrentCapturePoint.setLangText(Lang_Constants.TextType.CapturePoint);
        this._btnActPlayerIndex.setLangText(Lang_Constants.TextType.PlayerIndex);
        this._btnActIsHighlighted.setLangText(Lang_Constants.TextType.IsHighlighted);
        this._btnActLocationIdArray.setLangText(Lang_Constants.TextType.Location);
        this._btnActCustomNameId.setLangText(Lang_Constants.TextType.CustomNameId);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();

        this._updateLabelActCurrentHp();
        this._updateLabelActCurrentBuildPoint();
        this._updateLabelActCurrentCapturePoint();
        this._updateLabelActPromotion();
        this._updateLabelActIsHighlighted();
        this._updateLabelActLocationIdArray();
        this._updateLabelActCustomNameId();
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

    private _updateLabelActCurrentHp(): void {
        const act = this._getAction()?.getActCurrentHp();
        this._labelActCurrentHp.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActCurrentBuildPoint(): void {
        const act = this._getAction()?.getActCurrentBuildPoint();
        this._labelActCurrentBuildPoint.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActCurrentCapturePoint(): void {
        const act = this._getAction()?.getActCurrentCapturePoint();
        this._labelActCurrentCapturePoint.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActPromotion(): void {
        const act = this._getAction()?.getActPlayerIndex();
        this._labelActPlayerIndex.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActIsHighlighted(): void {
        const act = this._getAction()?.getActIsHighlighted();
        this._labelActIsHighlighted.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act),
        );
    }

    private _updateLabelActLocationIdArray(): void {
        const act = this._getAction()?.getActLocationIdArray();
        this._labelActLocationIdArray.setText(act == null
            ? ``
            : ArrayModifiers_Utils.getDesc(act, Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations)),
        );
    }

    private _updateLabelActCustomNameId(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActCustomNameId();
        this._labelActCustomNameId.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileStateSimple> {
        return this.getOpenData()?.action.getWeaSetTileStateSimple();
    }
}
