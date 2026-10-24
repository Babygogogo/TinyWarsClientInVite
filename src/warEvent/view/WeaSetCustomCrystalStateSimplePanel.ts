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
import * as ProtoSchemaCommonProtoStructureMultiplierAndOffset from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateSimple from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateSimple.ts";
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

    private readonly _btnActRadius!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActRadius!                           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActPriority!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActPriority!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCanAffectSelf!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanAffectSelf!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCanAffectAlly!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanAffectAlly!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCanAffectEnemy!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanAffectEnemy!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActOffsetFund!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetFund!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActOffsetEnergyPercentage!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetEnergyPercentage!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActOffsetHp!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetHp!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActOffsetFuelPercentage!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetFuelPercentage!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActOffsetPrimaryAmmoPercentage!        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActOffsetPrimaryAmmoPercentage!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCanBeFatal!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanBeFatal!                       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },

            { ui: this._btnActRadius,                           callback: this._onTouchedBtnActRadius },
            { ui: this._btnActPriority,                         callback: this._onTouchedBtnActPriority },
            { ui: this._btnActCanAffectSelf,                    callback: this._onTouchedBtnActCanAffectSelf },
            { ui: this._btnActCanAffectAlly,                    callback: this._onTouchedBtnActCanAffectAlly },
            { ui: this._btnActCanAffectEnemy,                   callback: this._onTouchedBtnActCanAffectEnemy },
            { ui: this._btnActOffsetFund,                       callback: this._onTouchedBtnActOffsetFund },
            { ui: this._btnActOffsetEnergyPercentage,           callback: this._onTouchedBtnActOffsetEnergyPercentage },
            { ui: this._btnActOffsetHp,                         callback: this._onTouchedBtnActOffsetHp },
            { ui: this._btnActOffsetFuelPercentage,             callback: this._onTouchedBtnActOffsetFuelPercentage },
            { ui: this._btnActOffsetPrimaryAmmoPercentage,      callback: this._onTouchedBtnActOffsetPrimaryAmmoPercentage },
            { ui: this._btnActCanBeFatal,                       callback: this._onTouchedBtnActCanBeFatal },
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

    private _onTouchedBtnActRadius(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActRadius();
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
                        action.setActRadius(null);
                    } else {
                        action.setActRadius(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActPriority(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActPriority();
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
                        action.setActPriority(null);
                    } else {
                        action.setActPriority(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActOffsetFund(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetFund();
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
                        action.setActOffsetFund(null);
                    } else {
                        action.setActOffsetFund(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActOffsetEnergyPercentage(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetEnergyPercentage();
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
                        action.setActOffsetEnergyPercentage(null);
                    } else {
                        action.setActOffsetEnergyPercentage(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActOffsetHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetHp();
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
                        action.setActOffsetHp(null);
                    } else {
                        action.setActOffsetHp(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActOffsetFuelPercentage(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetFuelPercentage();
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
                        action.setActOffsetFuelPercentage(null);
                    } else {
                        action.setActOffsetFuelPercentage(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActOffsetPrimaryAmmoPercentage(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetPrimaryAmmoPercentage();
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
                        action.setActOffsetPrimaryAmmoPercentage(null);
                    } else {
                        action.setActOffsetPrimaryAmmoPercentage(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        this._btnActRadius.setLangText(LangConstants.TextType.EffectiveRadius);
        this._btnActPriority.setLangText(LangConstants.TextType.Priority);
        this._btnActCanAffectSelf.setLangText(LangConstants.TextType.AffectOwner);
        this._btnActCanAffectAlly.setLangText(LangConstants.TextType.AffectAlly);
        this._btnActCanAffectEnemy.setLangText(LangConstants.TextType.AffectEnemy);
        this._btnActOffsetFund.setLangText(LangConstants.TextType.FundOffset);
        this._btnActOffsetEnergyPercentage.setLangText(LangConstants.TextType.CoEnergyOffset$);
        this._btnActOffsetHp.setLangText(LangConstants.TextType.UnitsHpOffset);
        this._btnActOffsetFuelPercentage.setLangText(LangConstants.TextType.UnitsFuelOffset$);
        this._btnActOffsetPrimaryAmmoPercentage.setLangText(LangConstants.TextType.UnitsPriAmmoOffset$);
        this._btnActCanBeFatal.setLangText(LangConstants.TextType.CanBeFatal);

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

    private _updateLabelActRadius(): void {
        const act = this._getAction()?.getActRadius();
        this._labelActRadius.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActPriority(): void {
        const act = this._getAction()?.getActPriority();
        this._labelActPriority.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActCanAffectSelf(): void {
        const act = this._getAction()?.getActCanAffectSelf();
        this._labelActCanAffectSelf.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActCanAffectAlly(): void {
        const act = this._getAction()?.getActCanAffectAlly();
        this._labelActCanAffectAlly.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActCanAffectEnemy(): void {
        const act = this._getAction()?.getActCanAffectEnemy();
        this._labelActCanAffectEnemy.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActOffsetFund(): void {
        const act = this._getAction()?.getActOffsetFund();
        this._labelActOffsetFund.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActOffsetEnergyPercentage(): void {
        const act = this._getAction()?.getActOffsetEnergyPercentage();
        this._labelActOffsetEnergyPercentage.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActOffsetHp(): void {
        const act = this._getAction()?.getActOffsetHp();
        this._labelActOffsetHp.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActOffsetFuelPercentage(): void {
        const act = this._getAction()?.getActOffsetFuelPercentage();
        this._labelActOffsetFuelPercentage.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActOffsetPrimaryAmmoPercentage(): void {
        const act = this._getAction()?.getActOffsetPrimaryAmmoPercentage();
        this._labelActOffsetPrimaryAmmoPercentage.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActCanBeFatal(): void {
        const act = this._getAction()?.getActCanBeFatal();
        this._labelActCanBeFatal.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateSimple.WeaSetCustomCrystalStateSimple> {
        return this.getOpenData()?.action.getWeaSetCustomCrystalStateSimple();
    }
}
