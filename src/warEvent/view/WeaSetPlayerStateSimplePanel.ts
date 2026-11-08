import {
    Players_Constants,
    ValueAndComparators_Constants,
    CoSkills_Constants,
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
import type { WeaSetPlayerStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateSimple.ts";

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

    private readonly _btnConTileComparator!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileComparator!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActFund!                               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActFund!                             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCoId!                               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCoId!                             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCoEnergy!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCoEnergy!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActAliveState!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActAliveState!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActIsSkipTurn!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsSkipTurn!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCoUsingSkillType!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCoUsingSkillType!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActActivateCoSkillType!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActActivateCoSkillType!              : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnType,                                callback : this._onTouchedBtnType },
            { ui : this._btnClose,                               callback : this.closePanel },

            { ui : this._btnConPlayerFilter,                     callback : this._onTouchedBtnConPlayerFilter },
            { ui : this._btnConUnitFilter,                       callback : this._onTouchedBtnConUnitFilter },
            { ui : this._btnConUnitComparator,                   callback : this._onTouchedBtnConUnitComparator },
            { ui : this._btnConTileFilter,                       callback : this._onTouchedBtnConTileFilter },
            { ui : this._btnConTileComparator,                   callback : this._onTouchedBtnConTileComparator },

            { ui : this._btnActFund,                             callback : this._onTouchedBtnActFund },
            { ui : this._btnActCoId,                             callback : this._onTouchedBtnActCoId },
            { ui : this._btnActCoEnergy,                         callback : this._onTouchedBtnActCoEnergy },
            { ui : this._btnActAliveState,                       callback : this._onTouchedBtnActAliveState },
            { ui : this._btnActIsSkipTurn,                       callback : this._onTouchedBtnActIsSkipTurn },
            { ui : this._btnActCoUsingSkillType,                 callback : this._onTouchedBtnActCoUsingSkillType },
            { ui : this._btnActActivateCoSkillType,              callback : this._onTouchedBtnActActivateCoSkillType },
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
                                    value      : unitsCount,
                                    comparator : sign,
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

                if ((filter != null) && (!action.getConTileComparator())) {
                    action.setConTileComparator(ValueAndComparator.fromJson({
                        comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
                        value      : 0,
                    }));
                }

                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnConTileComparator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldCon = action.getConTileComparator();
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
                    callback     : TilesCount => {
                        if (TilesCount == null) {
                            action.setConTileComparator(null);
                            action.setConTileFilter(null);
                            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                        } else {
                            if (oldCon) {
                                oldCon.setValue(TilesCount);
                                oldCon.setComparator(sign);
                            } else {
                                action.setConTileComparator(ValueAndComparator.fromJson({
                                    value      : TilesCount,
                                    comparator : sign,
                                }));
                            }

                            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                        }
                    },
                });
            },
        });
    }

    private _onTouchedBtnActFund(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActFund();
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
                        action.setActFund(null);
                    } else {
                        action.setActFund(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }

    private _onTouchedBtnActCoId(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const gcData = this.getOpenData()?.war.getGcData();
        if (gcData == null) {
            return;
        }

        const act = action.getActCoId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
            currentCoId        : act,
            availableCoIdArray : gcData.getAllEnabledCoArray().map(v => v.getCoId()),
            gameConfig         : gcData,
            isBan              : false,
            callbackOnConfirm  : newCoId => {
                action.setActCoId(newCoId);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
            callbackOnSetNull : () => {
                action.setActCoId(null);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnActCoEnergy(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCoEnergy();
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
                        action.setActCoEnergy(null);
                    } else {
                        action.setActCoEnergy(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }

    private _onTouchedBtnActAliveState(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState),
            availableNumberArray : [-1].concat(Players_Constants.AllAliveStateIdArray),
            currentNumber        : action.getActAliveState() ?? -1,
            getNumberMainText    : num => num === -1 ? `(${Lang_Utils.getText(Lang_Constants.TextType.B0022)})` : (Lang_Utils.getPlayerAliveStateName(num) ?? Lang_Constants.UndefinedError),
            callbackOnConfirm    : num => {
                if (num === -1) {
                    action.setActAliveState(null);
                } else {
                    action.setActAliveState(num);
                }
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnActIsSkipTurn(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActIsSkipTurn();
        if (oldValue == null) {
            action.setActIsSkipTurn(true);
        } else if (oldValue) {
            action.setActIsSkipTurn(false);
        } else {
            action.setActIsSkipTurn(null);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _onTouchedBtnActCoUsingSkillType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.ActivatingCoSkillType),
            availableNumberArray : [-1].concat(CoSkills_Constants.AllSkillTypeIdArray),
            currentNumber        : action.getActCoUsingSkillType() ?? -1,
            getNumberMainText    : num => num === -1 ? `(${Lang_Utils.getText(Lang_Constants.TextType.B0022)})` : (Lang_Utils.getCoSkillTypeName(num) ?? Lang_Constants.UndefinedError),
            callbackOnConfirm    : num => {
                if (num === -1) {
                    action.setActCoUsingSkillType(null);
                } else {
                    action.setActCoUsingSkillType(num);
                }
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnActActivateCoSkillType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.TriggerCoSkillType),
            availableNumberArray : [-1].concat(CoSkills_Constants.AllSkillTypeIdArray),
            currentNumber        : action.getActActivateCoSkillType() ?? -1,
            getNumberMainText    : num => num === -1 ? `(${Lang_Utils.getText(Lang_Constants.TextType.B0022)})` : (Lang_Utils.getCoSkillTypeName(num) ?? Lang_Constants.UndefinedError),
            callbackOnConfirm    : num => {
                if (num === -1) {
                    action.setActActivateCoSkillType(null);
                } else {
                    action.setActActivateCoSkillType(num);
                }
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
        this._btnConTileComparator.setLangText(Lang_Constants.TextType.Comparator);

        this._btnActFund.setLangText(Lang_Constants.TextType.Fund);
        this._btnActCoId.setText(`CO`);
        this._btnActCoEnergy.setLangText(Lang_Constants.TextType.CoEnergy);
        this._btnActAliveState.setLangText(Lang_Constants.TextType.PlayerAliveState);
        this._btnActIsSkipTurn.setLangText(Lang_Constants.TextType.SkipATurn);
        this._btnActCoUsingSkillType.setLangText(Lang_Constants.TextType.ActivatingCoSkillType);
        this._btnActActivateCoSkillType.setLangText(Lang_Constants.TextType.TriggerCoSkillType);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();
        this._updateLabelConTileComparator();

        this._updateLabelActFund();
        this._updateLabelActCoId();
        this._updateLabelActCoEnergy();
        this._updateLabelActAliveState();
        this._updateLabelActIsSkipTurn();
        this._updateLabelActCoUsingSkillType();
        this._updateLabelActActivateCoSkillType();
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

    private _updateLabelConTileComparator(): void {
        const comparator = this._getAction()?.getConTileComparator();
        this._labelConTileComparator.setText(comparator == null ? `` : ValueAndComparators_Utils.getBriefDesc(comparator));
    }

    private _updateLabelActFund(): void {
        const act = this._getAction()?.getActFund();
        this._labelActFund.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActCoId(): void {
        const gcData    = this.getOpenData()?.war.getGcData();
        const label     = this._labelActCoId;
        if (gcData == null) {
            label.setText(Lang_Constants.UndefinedError);
            return;
        }

        const act = this._getAction()?.getActCoId();
        this._labelActCoId.setText(act == null
            ? ``
            : (gcData.getCoBasicCfg(act)?.getName() ?? Lang_Constants.UndefinedError),
        );
    }

    private _updateLabelActCoEnergy(): void {
        const act = this._getAction()?.getActCoEnergy();
        this._labelActCoEnergy.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act),
        );
    }

    private _updateLabelActAliveState(): void {
        const act = this._getAction()?.getActAliveState();
        this._labelActAliveState.setText(act == null
            ? ``
            : (Lang_Utils.getPlayerAliveStateName(act) ?? Lang_Constants.UndefinedError),
        );
    }

    private _updateLabelActIsSkipTurn(): void {
        const act = this._getAction()?.getActIsSkipTurn();
        this._labelActIsSkipTurn.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act),
        );
    }

    private _updateLabelActCoUsingSkillType(): void {
        const act = this._getAction()?.getActCoUsingSkillType();
        this._labelActCoUsingSkillType.setText(act == null
            ? ``
            : (Lang_Utils.getCoSkillTypeName(act) ?? Lang_Constants.UndefinedError),
        );
    }

    private _updateLabelActActivateCoSkillType(): void {
        const act = this._getAction()?.getActActivateCoSkillType();
        this._labelActActivateCoSkillType.setText(act == null
            ? ``
            : (Lang_Utils.getCoSkillTypeName(act) ?? Lang_Constants.UndefinedError),
        );
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetPlayerStateSimple> {
        return this.getOpenData()?.action.getWeaSetPlayerStateSimple();
    }
}
