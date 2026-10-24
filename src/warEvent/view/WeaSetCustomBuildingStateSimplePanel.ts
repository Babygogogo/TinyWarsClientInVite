import * as ArrayModifiersUtils from "../../arrayModifiers/Utils.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MultiplierAndOffsetsUtils from "../../multiplierAndOffsets/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureArrayModifier from "../../proto/schema/CommonProto/Structure/ArrayModifier.ts";
import * as ProtoSchemaCommonProtoStructureMultiplierAndOffset from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateSimple from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateSimple.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";
import * as WarEventsConstants from "../../warEvents/Constants.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction                 = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _sclContent!                               : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;

    private readonly _btnConPlayerFilter!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitComparator!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitComparator!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConTileFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActDefenseAmount!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDefenseAmount!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActDefenseUnitTypeArray!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDefenseUnitTypeArray!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActMaxCapturePoint!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActMaxCapturePoint!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActDeleteMaxCapturePoint!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDeleteMaxCapturePoint!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActIsDefeatedOnCapture!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsDefeatedOnCapture!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActRepairNormalizedHp!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActRepairNormalizedHp!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActDeleteRepairNormalizedHp!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDeleteRepairNormalizedHp!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActRepairUnitTypeArray!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActRepairUnitTypeArray!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActIncomePerTurn!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIncomePerTurn!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActVisionRange!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActVisionRange!                      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActIsVisionEnabledForAllPlayers!       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsVisionEnabledForAllPlayers!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActHideUnitTypeArray!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActHideUnitTypeArray!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActProduceUnitTypeArray!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActProduceUnitTypeArray!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActGlobalAttackBonus!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActGlobalAttackBonus!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActGlobalDefenseBonus!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActGlobalDefenseBonus!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActUnitTypeArrayForCoBoard!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActUnitTypeArrayForCoBoard!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActBlockEnemyUnitTypeArray!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActBlockEnemyUnitTypeArray!         : UiInterfacesIUiLabel.IUiLabel;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionTypeListPanel, {
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : action.getConPlayerFilter(),
            callback                : filter => {
                action.setConPlayerFilter(filter);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConUnitFilter(),
            callback                : filter => {
                action.setConUnitFilter(filter);

                if ((filter != null) && (!action.getConUnitComparator())) {
                    action.setConUnitComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                        comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
                        value       : 0,
                    }));
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Comparator),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle        : () => LangUtils.getText(LangConstants.TextType.B0160),
                    currentValue    : oldCon?.getValue() ?? 0,
                    minValue        : 0,
                    maxValue        : 10,
                    callback        : unitsCount => {
                        if (unitsCount == null) {
                            action.setConUnitComparator(null);
                            action.setConUnitFilter(null);
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                        } else {
                            if (oldCon) {
                                oldCon.setValue(unitsCount);
                                oldCon.setComparator(sign);
                            } else {
                                action.setConUnitComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                    comparator  : sign,
                                    value       : unitsCount,
                                }));
                            }

                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConTileFilter(),
            callback                : filter => {
                action.setConTileFilter(filter);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActDefenseAmount(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActDefenseAmount();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Offset),
                minValue        : -WarEventsConstants.Event.MaxOffset,
                maxValue        : WarEventsConstants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsetsUtils.checkIsDefault(multiplierAndOffset)) {
                        action.setActDefenseAmount(null);
                    } else {
                        action.setActDefenseAmount(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActDefenseUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActDefenseUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActDefenseUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActDefenseUnitTypeArray(null);
                            } else {
                                action.setActDefenseUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Offset),
                minValue        : -WarEventsConstants.Event.MaxOffset,
                maxValue        : WarEventsConstants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsetsUtils.checkIsDefault(multiplierAndOffset)) {
                        action.setActMaxCapturePoint(null);
                    } else {
                        action.setActMaxCapturePoint(multiplierAndOffset);
                        action.setActDeleteMaxCapturePoint(null);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActRepairNormalizedHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActRepairNormalizedHp();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Offset),
                minValue        : -WarEventsConstants.Event.MaxOffset,
                maxValue        : WarEventsConstants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsetsUtils.checkIsDefault(multiplierAndOffset)) {
                        action.setActRepairNormalizedHp(null);
                    } else {
                        action.setActRepairNormalizedHp(multiplierAndOffset);
                        action.setActDeleteRepairNormalizedHp(null);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActRepairUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActRepairUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActRepairUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActRepairUnitTypeArray(null);
                            } else {
                                action.setActRepairUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Offset),
                minValue        : -WarEventsConstants.Event.MaxOffset,
                maxValue        : WarEventsConstants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsetsUtils.checkIsDefault(multiplierAndOffset)) {
                        action.setActIncomePerTurn(null);
                    } else {
                        action.setActIncomePerTurn(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Offset),
                minValue        : -WarEventsConstants.Event.MaxOffset,
                maxValue        : WarEventsConstants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsetsUtils.checkIsDefault(multiplierAndOffset)) {
                        action.setActVisionRange(null);
                    } else {
                        action.setActVisionRange(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActHideUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActHideUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActHideUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActHideUnitTypeArray(null);
                            } else {
                                action.setActHideUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActProduceUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActProduceUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActProduceUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActProduceUnitTypeArray(null);
                            } else {
                                action.setActProduceUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Offset),
                minValue        : -WarEventsConstants.Event.MaxOffset,
                maxValue        : WarEventsConstants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsetsUtils.checkIsDefault(multiplierAndOffset)) {
                        action.setActGlobalAttackBonus(null);
                    } else {
                        action.setActGlobalAttackBonus(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Offset),
                minValue        : -WarEventsConstants.Event.MaxOffset,
                maxValue        : WarEventsConstants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsetsUtils.checkIsDefault(multiplierAndOffset)) {
                        action.setActGlobalDefenseBonus(null);
                    } else {
                        action.setActGlobalDefenseBonus(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActUnitTypeArrayForCoBoard()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActUnitTypeArrayForCoBoard(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActUnitTypeArrayForCoBoard()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActUnitTypeArrayForCoBoard(null);
                            } else {
                                action.setActUnitTypeArrayForCoBoard(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1425),
            availableUnitTypeArray  : allUnitTypeArray,
            currentUnitTypeArray    : action.getActBlockEnemyUnitTypeArray()?.getAddIntArray() ?? [],
            gameConfig              : gameConfig,
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allUnitTypeArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActBlockEnemyUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1426),
                        availableUnitTypeArray  : remainingValueArray,
                        currentUnitTypeArray    : action.getActBlockEnemyUnitTypeArray()?.getDeleteIntArray() ?? [],
                        gameConfig              : gameConfig,
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActBlockEnemyUnitTypeArray(null);
                            } else {
                                action.setActBlockEnemyUnitTypeArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                                    addIntArray     : addIntArray,
                                    deleteIntArray  : deleteIntArray,
                                }));
                            }
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(LangConstants.TextType.B0516);

        this._btnConPlayerFilter.setLangText(LangConstants.TextType.PlayerFilter);
        this._btnConUnitFilter.setLangText(LangConstants.TextType.UnitFilter);
        this._btnConUnitComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnConTileFilter.setLangText(LangConstants.TextType.TileFilter);

        this._btnActDefenseAmount.setLangText(LangConstants.TextType.DefBonus$);
        this._btnActDefenseUnitTypeArray.setLangText(LangConstants.TextType.DefensibleUnits);
        this._btnActMaxCapturePoint.setLangText(LangConstants.TextType.MaxCapturePoint);
        this._btnActDeleteMaxCapturePoint.setLangText(LangConstants.TextType.B0220);
        this._btnActIsDefeatedOnCapture.setLangText(LangConstants.TextType.DefeatIfCaptured);
        this._btnActRepairNormalizedHp.setLangText(LangConstants.TextType.RepairHpAmount);
        this._btnActDeleteRepairNormalizedHp.setLangText(LangConstants.TextType.B0220);
        this._btnActRepairUnitTypeArray.setLangText(LangConstants.TextType.RepairableUnits);
        this._btnActIncomePerTurn.setLangText(LangConstants.TextType.Income);
        this._btnActVisionRange.setLangText(LangConstants.TextType.VisionRange);
        this._btnActIsVisionEnabledForAllPlayers.setLangText(LangConstants.TextType.SharedVision);
        this._btnActHideUnitTypeArray.setLangText(LangConstants.TextType.HidableUnits);
        this._btnActProduceUnitTypeArray.setLangText(LangConstants.TextType.ProducibleUnits);
        this._btnActGlobalAttackBonus.setLangText(LangConstants.TextType.GlobalAtkBonus);
        this._btnActGlobalDefenseBonus.setLangText(LangConstants.TextType.GlobalDefBonus);
        this._btnActUnitTypeArrayForCoBoard.setLangText(LangConstants.TextType.CoBoardableUnit);
        this._btnActBlockEnemyUnitTypeArray.setLangText(LangConstants.TextType.BlockableEnemyUnits);

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
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getDetailDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConPlayerFilter(): void {
        this._labelConPlayerFilter.setText(this._getAction()?.getConPlayerFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        this._labelConUnitFilter.setText(this._getAction()?.getConUnitFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelConUnitComparator(): void {
        const comparator = this._getAction()?.getConUnitComparator();
        this._labelConUnitComparator.setText(comparator == null ? `` : ValueAndComparatorsUtils.getBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelActDefenseAmount(): void {
        const act = this._getAction()?.getActDefenseAmount();
        this._labelActDefenseAmount.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActDefenseUnitTypeArray(): void {
        const act = this._getAction()?.getActDefenseUnitTypeArray();
        this._labelActDefenseUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiersUtils.getDesc(act, LangUtils.getText(LangConstants.TextType.DefensibleUnits))
        );
    }

    private _updateLabelActMaxCapturePoint(): void {
        const act = this._getAction()?.getActMaxCapturePoint();
        this._labelActMaxCapturePoint.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActDeleteMaxCapturePoint(): void {
        const act = this._getAction()?.getActDeleteMaxCapturePoint();
        this._labelActDeleteMaxCapturePoint.setText(act ? LangUtils.getText(LangConstants.TextType.Yes) : ``);
    }

    private _updateLabelActIsDefeatedOnCapture(): void {
        const act = this._getAction()?.getActIsDefeatedOnCapture();
        this._labelActIsDefeatedOnCapture.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActRepairNormalizedHp(): void {
        const act = this._getAction()?.getActRepairNormalizedHp();
        this._labelActRepairNormalizedHp.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActDeleteRepairNormalizedHp(): void {
        const act = this._getAction()?.getActDeleteRepairNormalizedHp();
        this._labelActDeleteRepairNormalizedHp.setText(act ? LangUtils.getText(LangConstants.TextType.Yes) : ``);
    }

    private _updateLabelActRepairUnitTypeArray(): void {
        const act = this._getAction()?.getActRepairUnitTypeArray();
        this._labelActRepairUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiersUtils.getDesc(act, LangUtils.getText(LangConstants.TextType.RepairableUnits))
        );
    }

    private _updateLabelActIncomePerTurn(): void {
        const act = this._getAction()?.getActIncomePerTurn();
        this._labelActIncomePerTurn.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActVisionRange(): void {
        const act = this._getAction()?.getActVisionRange();
        this._labelActVisionRange.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActIsVisionEnabledForAllPlayers(): void {
        const act = this._getAction()?.getActIsVisionEnabledForAllPlayers();
        this._labelActIsVisionEnabledForAllPlayers.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActHideUnitTypeArray(): void {
        const act = this._getAction()?.getActHideUnitTypeArray();
        this._labelActHideUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiersUtils.getDesc(act, LangUtils.getText(LangConstants.TextType.HidableUnits))
        );
    }

    private _updateLabelActProduceUnitTypeArray(): void {
        const act = this._getAction()?.getActProduceUnitTypeArray();
        this._labelActProduceUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiersUtils.getDesc(act, LangUtils.getText(LangConstants.TextType.ProducibleUnits))
        );
    }

    private _updateLabelActGlobalAttackBonus(): void {
        const act = this._getAction()?.getActGlobalAttackBonus();
        this._labelActGlobalAttackBonus.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActGlobalDefenseBonus(): void {
        const act = this._getAction()?.getActGlobalDefenseBonus();
        this._labelActGlobalDefenseBonus.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActUnitTypeArrayForCoBoard(): void {
        const act = this._getAction()?.getActUnitTypeArrayForCoBoard();
        this._labelActUnitTypeArrayForCoBoard.setText(act == null
            ? ``
            : ArrayModifiersUtils.getDesc(act, LangUtils.getText(LangConstants.TextType.CoBoardableUnit))
        );
    }

    private _updateLabelActBlockEnemyUnitTypeArray(): void {
        const act = this._getAction()?.getActBlockEnemyUnitTypeArray();
        this._labelActBlockEnemyUnitTypeArray.setText(act == null
            ? ``
            : ArrayModifiersUtils.getDesc(act, LangUtils.getText(LangConstants.TextType.BlockableEnemyUnits))
        );
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateSimple.WeaSetCustomBuildingStateSimple> {
        return this.getOpenData()?.action.getWeaSetCustomBuildingStateSimple();
    }
}
