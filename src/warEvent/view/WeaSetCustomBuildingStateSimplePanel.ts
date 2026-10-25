import { getDesc } from "../../arrayModifiers/Utils.ts";
import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getComparatorName, getTextForYesOrNo } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { checkIsDefault, getBriefDesc } from "../../multiplierAndOffsets/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ArrayModifier } from "../../proto/schema/CommonProto/Structure/ArrayModifier.ts";
import { MultiplierAndOffset } from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetCustomBuildingStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateSimple.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ComparatorId, AllComparatorIdArray } from "../../valueAndComparators/Constants.ts";
import { getBriefDesc as ValueAndComparatorsUtilsGetBriefDesc } from "../../valueAndComparators/Utils.ts";
import { getErrorTipForAction, getDetailDescForAction } from "../../warEvents/actions/utils/Common.ts";
import { Event } from "../../warEvents/Constants.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction                 = ProtoSchemaCommonProtoWarEventWarEventAction;

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnType!                                  : IUiButton;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _sclContent!                               : IUiScroller<IUiContainer>;

    private readonly _btnConPlayerFilter!                       : IUiButton;
    private readonly _labelConPlayerFilter!                     : IUiLabel;

    private readonly _btnConUnitFilter!                         : IUiButton;
    private readonly _labelConUnitFilter!                       : IUiLabel;

    private readonly _btnConUnitComparator!                     : IUiButton;
    private readonly _labelConUnitComparator!                   : IUiLabel;

    private readonly _btnConTileFilter!                         : IUiButton;
    private readonly _labelConTileFilter!                       : IUiLabel;

    private readonly _btnActDefenseAmount!                      : IUiButton;
    private readonly _labelActDefenseAmount!                    : IUiLabel;

    private readonly _btnActDefenseUnitTypeArray!               : IUiButton;
    private readonly _labelActDefenseUnitTypeArray!             : IUiLabel;

    private readonly _btnActMaxCapturePoint!                    : IUiButton;
    private readonly _labelActMaxCapturePoint!                  : IUiLabel;

    private readonly _btnActDeleteMaxCapturePoint!              : IUiButton;
    private readonly _labelActDeleteMaxCapturePoint!            : IUiLabel;

    private readonly _btnActIsDefeatedOnCapture!                : IUiButton;
    private readonly _labelActIsDefeatedOnCapture!              : IUiLabel;

    private readonly _btnActRepairNormalizedHp!                 : IUiButton;
    private readonly _labelActRepairNormalizedHp!               : IUiLabel;

    private readonly _btnActDeleteRepairNormalizedHp!           : IUiButton;
    private readonly _labelActDeleteRepairNormalizedHp!         : IUiLabel;

    private readonly _btnActRepairUnitTypeArray!                : IUiButton;
    private readonly _labelActRepairUnitTypeArray!              : IUiLabel;

    private readonly _btnActIncomePerTurn!                      : IUiButton;
    private readonly _labelActIncomePerTurn!                    : IUiLabel;

    private readonly _btnActVisionRange!                        : IUiButton;
    private readonly _labelActVisionRange!                      : IUiLabel;

    private readonly _btnActIsVisionEnabledForAllPlayers!       : IUiButton;
    private readonly _labelActIsVisionEnabledForAllPlayers!     : IUiLabel;

    private readonly _btnActHideUnitTypeArray!                  : IUiButton;
    private readonly _labelActHideUnitTypeArray!                : IUiLabel;

    private readonly _btnActProduceUnitTypeArray!               : IUiButton;
    private readonly _labelActProduceUnitTypeArray!             : IUiLabel;

    private readonly _btnActGlobalAttackBonus!                  : IUiButton;
    private readonly _labelActGlobalAttackBonus!                : IUiLabel;

    private readonly _btnActGlobalDefenseBonus!                 : IUiButton;
    private readonly _labelActGlobalDefenseBonus!               : IUiLabel;

    private readonly _btnActUnitTypeArrayForCoBoard!           : IUiButton;
    private readonly _labelActUnitTypeArrayForCoBoard!         : IUiLabel;

    private readonly _btnActBlockEnemyUnitTypeArray!           : IUiButton;
    private readonly _labelActBlockEnemyUnitTypeArray!         : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },

            { ui: this._btnActDefenseAmount,                    callback: this._onTouchedBtnActDefenseAmount },
            { ui: this._btnActDefenseUnitTypeArray,             callback: this._onTouchedBtnActDefenseUnitTypeArray },
            { ui: this._btnActMaxCapturePoint,                  callback: this._onTouchedBtnActMaxCapturePoint },
            { ui: this._btnActDeleteMaxCapturePoint,            callback: this._onTouchedBtnActDeleteMaxCapturePoint },
            { ui: this._btnActIsDefeatedOnCapture,              callback: this._onTouchedBtnActIsDefeatedOnCapture },
            { ui: this._btnActRepairNormalizedHp,               callback: this._onTouchedBtnActRepairNormalizedHp },
            { ui: this._btnActDeleteRepairNormalizedHp,         callback: this._onTouchedBtnActDeleteRepairNormalizedHp },
            { ui: this._btnActRepairUnitTypeArray,              callback: this._onTouchedBtnActRepairUnitTypeArray },
            { ui: this._btnActIncomePerTurn,                    callback: this._onTouchedBtnActIncomePerTurn },
            { ui: this._btnActVisionRange,                      callback: this._onTouchedBtnActVisionRange },
            { ui: this._btnActIsVisionEnabledForAllPlayers,     callback: this._onTouchedBtnActIsVisionEnabledForAllPlayers },
            { ui: this._btnActHideUnitTypeArray,                callback: this._onTouchedBtnActHideUnitTypeArray },
            { ui: this._btnActProduceUnitTypeArray,             callback: this._onTouchedBtnActProduceUnitTypeArray },
            { ui: this._btnActGlobalAttackBonus,                callback: this._onTouchedBtnActGlobalAttackBonus },
            { ui: this._btnActGlobalDefenseBonus,               callback: this._onTouchedBtnActGlobalDefenseBonus },
            { ui: this._btnActUnitTypeArrayForCoBoard,          callback: this._onTouchedBtnActUnitTypeArrayForCoBoard },
            { ui: this._btnActBlockEnemyUnitTypeArray,          callback: this._onTouchedBtnActBlockEnemyUnitTypeArray },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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

        openPanel(getDict().WeActionTypeListPanel, {
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

        openPanel(getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : action.getConPlayerFilter(),
            callback                : filter => {
                action.setConPlayerFilter(filter);
                dispatch(TypeId.WarEventFullDataChanged);
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

        openPanel(getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConUnitFilter(),
            callback                : filter => {
                action.setConUnitFilter(filter);

                if ((filter != null) && (!action.getConUnitComparator())) {
                    action.setConUnitComparator(ValueAndComparator.fromJson({
                        comparator  : ComparatorId.EqualTo,
                        value       : 0,
                    }));
                }

                dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.Comparator),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => {
                openPanel(getDict().CommonInputNullableIntegerPanel, {
                    getTitle        : () => getText(TextType.B0160),
                    currentValue    : oldCon?.getValue() ?? 0,
                    minValue        : 0,
                    maxValue        : 10,
                    callback        : unitsCount => {
                        if (unitsCount == null) {
                            action.setConUnitComparator(null);
                            action.setConUnitFilter(null);
                            dispatch(TypeId.WarEventFullDataChanged);
                        } else {
                            if (oldCon) {
                                oldCon.setValue(unitsCount);
                                oldCon.setComparator(sign);
                            } else {
                                action.setConUnitComparator(ValueAndComparator.fromJson({
                                    comparator  : sign,
                                    value       : unitsCount,
                                }));
                            }

                            dispatch(TypeId.WarEventFullDataChanged);
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

        openPanel(getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConTileFilter(),
            callback                : filter => {
                action.setConTileFilter(filter);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActDefenseAmount(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActDefenseAmount();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActDefenseAmount(null);
                    } else {
                        action.setActDefenseAmount(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
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
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => getText(TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActDefenseUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActDefenseUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => getText(TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActDefenseUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActDefenseUnitTypeArray(null);
                            } else {
                                action.setActDefenseUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActMaxCapturePoint(null);
                    } else {
                        action.setActMaxCapturePoint(multiplierAndOffset);
                        action.setActDeleteMaxCapturePoint(null);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
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
        dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActRepairNormalizedHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActRepairNormalizedHp();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActRepairNormalizedHp(null);
                    } else {
                        action.setActRepairNormalizedHp(multiplierAndOffset);
                        action.setActDeleteRepairNormalizedHp(null);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
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
        dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => getText(TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActRepairUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActRepairUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => getText(TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActRepairUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActRepairUnitTypeArray(null);
                            } else {
                                action.setActRepairUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActIncomePerTurn(null);
                    } else {
                        action.setActIncomePerTurn(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActVisionRange(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActVisionRange();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActVisionRange(null);
                    } else {
                        action.setActVisionRange(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
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
        dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => getText(TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActHideUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActHideUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => getText(TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActHideUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActHideUnitTypeArray(null);
                            } else {
                                action.setActHideUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => getText(TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActProduceUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActProduceUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => getText(TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActProduceUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActProduceUnitTypeArray(null);
                            } else {
                                action.setActProduceUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActGlobalAttackBonus(null);
                    } else {
                        action.setActGlobalAttackBonus(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActGlobalDefenseBonus(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActGlobalDefenseBonus();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActGlobalDefenseBonus(null);
                    } else {
                        action.setActGlobalDefenseBonus(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
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
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => getText(TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActUnitTypeArrayForCoBoard()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActUnitTypeArrayForCoBoard(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => getText(TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActUnitTypeArrayForCoBoard()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActUnitTypeArrayForCoBoard(null);
                            } else {
                                action.setActUnitTypeArrayForCoBoard(ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => getText(TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActBlockEnemyUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActBlockEnemyUnitTypeArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => getText(TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActBlockEnemyUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActBlockEnemyUnitTypeArray(null);
                            } else {
                                action.setActBlockEnemyUnitTypeArray(ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            dispatch(TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${getText(TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(TextType.B0516);

        this._btnConPlayerFilter.setLangText(TextType.PlayerFilter);
        this._btnConUnitFilter.setLangText(TextType.UnitFilter);
        this._btnConUnitComparator.setLangText(TextType.Comparator);
        this._btnConTileFilter.setLangText(TextType.TileFilter);

        this._btnActDefenseAmount.setLangText(TextType.DefBonus$);
        this._btnActDefenseUnitTypeArray.setLangText(TextType.DefensibleUnits);
        this._btnActMaxCapturePoint.setLangText(TextType.MaxCapturePoint);
        this._btnActDeleteMaxCapturePoint.setLangText(TextType.B0220);
        this._btnActIsDefeatedOnCapture.setLangText(TextType.DefeatIfCaptured);
        this._btnActRepairNormalizedHp.setLangText(TextType.RepairHpAmount);
        this._btnActDeleteRepairNormalizedHp.setLangText(TextType.B0220);
        this._btnActRepairUnitTypeArray.setLangText(TextType.RepairableUnits);
        this._btnActIncomePerTurn.setLangText(TextType.Income);
        this._btnActVisionRange.setLangText(TextType.VisionRange);
        this._btnActIsVisionEnabledForAllPlayers.setLangText(TextType.SharedVision);
        this._btnActHideUnitTypeArray.setLangText(TextType.HidableUnits);
        this._btnActProduceUnitTypeArray.setLangText(TextType.ProducibleUnits);
        this._btnActGlobalAttackBonus.setLangText(TextType.GlobalAtkBonus);
        this._btnActGlobalDefenseBonus.setLangText(TextType.GlobalDefBonus);
        this._btnActUnitTypeArrayForCoBoard.setLangText(TextType.CoBoardableUnit);
        this._btnActBlockEnemyUnitTypeArray.setLangText(TextType.BlockableEnemyUnits);

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
        const errorTip          = getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDetailDescForAction(action, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConPlayerFilter(): void {
        this._labelConPlayerFilter.setText(this._getAction()?.getConPlayerFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        this._labelConUnitFilter.setText(this._getAction()?.getConUnitFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConUnitComparator(): void {
        const comparator = this._getAction()?.getConUnitComparator();
        this._labelConUnitComparator.setText(comparator == null ? `` : ValueAndComparatorsUtilsGetBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelActDefenseAmount(): void {
        const act = this._getAction()?.getActDefenseAmount();
        this._labelActDefenseAmount.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActDefenseUnitTypeArray(): void {
        const act = this._getAction()?.getActDefenseUnitTypeArray();
        this._labelActDefenseUnitTypeArray.setText(act == null
            ? ``
            : getDesc(act, getText(TextType.DefensibleUnits))
        );
    }

    private _updateLabelActMaxCapturePoint(): void {
        const act = this._getAction()?.getActMaxCapturePoint();
        this._labelActMaxCapturePoint.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActDeleteMaxCapturePoint(): void {
        const act = this._getAction()?.getActDeleteMaxCapturePoint();
        this._labelActDeleteMaxCapturePoint.setText(act ? getText(TextType.Yes) : ``);
    }

    private _updateLabelActIsDefeatedOnCapture(): void {
        const act = this._getAction()?.getActIsDefeatedOnCapture();
        this._labelActIsDefeatedOnCapture.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActRepairNormalizedHp(): void {
        const act = this._getAction()?.getActRepairNormalizedHp();
        this._labelActRepairNormalizedHp.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActDeleteRepairNormalizedHp(): void {
        const act = this._getAction()?.getActDeleteRepairNormalizedHp();
        this._labelActDeleteRepairNormalizedHp.setText(act ? getText(TextType.Yes) : ``);
    }

    private _updateLabelActRepairUnitTypeArray(): void {
        const act = this._getAction()?.getActRepairUnitTypeArray();
        this._labelActRepairUnitTypeArray.setText(act == null
            ? ``
            : getDesc(act, getText(TextType.RepairableUnits))
        );
    }

    private _updateLabelActIncomePerTurn(): void {
        const act = this._getAction()?.getActIncomePerTurn();
        this._labelActIncomePerTurn.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActVisionRange(): void {
        const act = this._getAction()?.getActVisionRange();
        this._labelActVisionRange.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActIsVisionEnabledForAllPlayers(): void {
        const act = this._getAction()?.getActIsVisionEnabledForAllPlayers();
        this._labelActIsVisionEnabledForAllPlayers.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActHideUnitTypeArray(): void {
        const act = this._getAction()?.getActHideUnitTypeArray();
        this._labelActHideUnitTypeArray.setText(act == null
            ? ``
            : getDesc(act, getText(TextType.HidableUnits))
        );
    }

    private _updateLabelActProduceUnitTypeArray(): void {
        const act = this._getAction()?.getActProduceUnitTypeArray();
        this._labelActProduceUnitTypeArray.setText(act == null
            ? ``
            : getDesc(act, getText(TextType.ProducibleUnits))
        );
    }

    private _updateLabelActGlobalAttackBonus(): void {
        const act = this._getAction()?.getActGlobalAttackBonus();
        this._labelActGlobalAttackBonus.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActGlobalDefenseBonus(): void {
        const act = this._getAction()?.getActGlobalDefenseBonus();
        this._labelActGlobalDefenseBonus.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActUnitTypeArrayForCoBoard(): void {
        const act = this._getAction()?.getActUnitTypeArrayForCoBoard();
        this._labelActUnitTypeArrayForCoBoard.setText(act == null
            ? ``
            : getDesc(act, getText(TextType.CoBoardableUnit))
        );
    }

    private _updateLabelActBlockEnemyUnitTypeArray(): void {
        const act = this._getAction()?.getActBlockEnemyUnitTypeArray();
        this._labelActBlockEnemyUnitTypeArray.setText(act == null
            ? ``
            : getDesc(act, getText(TextType.BlockableEnemyUnits))
        );
    }

    private _getAction(): Undefinable<WeaSetCustomBuildingStateSimple> {
        return this.getOpenData()?.action.getWeaSetCustomBuildingStateSimple();
    }
}
