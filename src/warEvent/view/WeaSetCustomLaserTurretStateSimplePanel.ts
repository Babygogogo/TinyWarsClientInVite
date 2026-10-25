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
import { MultiplierAndOffset } from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetCustomLaserTurretStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomLaserTurretStateSimple.ts";
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

    private readonly _btnActRangeForUp!                         : IUiButton;
    private readonly _labelActRangeForUp!                       : IUiLabel;

    private readonly _btnActRangeForDown!                       : IUiButton;
    private readonly _labelActRangeForDown!                     : IUiLabel;

    private readonly _btnActRangeForLeft!                       : IUiButton;
    private readonly _labelActRangeForLeft!                     : IUiLabel;

    private readonly _btnActRangeForRight!                      : IUiButton;
    private readonly _labelActRangeForRight!                    : IUiLabel;

    private readonly _btnActPriority!                           : IUiButton;
    private readonly _labelActPriority!                         : IUiLabel;

    private readonly _btnActCanAffectSelf!                      : IUiButton;
    private readonly _labelActCanAffectSelf!                    : IUiLabel;

    private readonly _btnActCanAffectAlly!                      : IUiButton;
    private readonly _labelActCanAffectAlly!                    : IUiLabel;

    private readonly _btnActCanAffectEnemy!                     : IUiButton;
    private readonly _labelActCanAffectEnemy!                   : IUiLabel;

    private readonly _btnActOffsetHp!                           : IUiButton;
    private readonly _labelActOffsetHp!                         : IUiLabel;

    private readonly _btnActOffsetFuelPercentage!               : IUiButton;
    private readonly _labelActOffsetFuelPercentage!             : IUiLabel;

    private readonly _btnActOffsetPrimaryAmmoPercentage!        : IUiButton;
    private readonly _labelActOffsetPrimaryAmmoPercentage!      : IUiLabel;

    private readonly _btnActCanBeFatal!                         : IUiButton;
    private readonly _labelActCanBeFatal!                       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },

            { ui: this._btnActRangeForUp,                       callback: this._onTouchedBtnActRangeForUp },
            { ui: this._btnActRangeForDown,                     callback: this._onTouchedBtnActRangeForDown },
            { ui: this._btnActRangeForLeft,                     callback: this._onTouchedBtnActRangeForLeft },
            { ui: this._btnActRangeForRight,                    callback: this._onTouchedBtnActRangeForRight },
            { ui: this._btnActPriority,                         callback: this._onTouchedBtnActPriority },
            { ui: this._btnActCanAffectSelf,                    callback: this._onTouchedBtnActCanAffectSelf },
            { ui: this._btnActCanAffectAlly,                    callback: this._onTouchedBtnActCanAffectAlly },
            { ui: this._btnActCanAffectEnemy,                   callback: this._onTouchedBtnActCanAffectEnemy },
            { ui: this._btnActOffsetHp,                         callback: this._onTouchedBtnActOffsetHp },
            { ui: this._btnActOffsetFuelPercentage,             callback: this._onTouchedBtnActOffsetFuelPercentage },
            { ui: this._btnActOffsetPrimaryAmmoPercentage,      callback: this._onTouchedBtnActOffsetPrimaryAmmoPercentage },
            { ui: this._btnActCanBeFatal,                       callback: this._onTouchedBtnActCanBeFatal },
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
                                    value       : unitsCount,
                                    comparator  : sign,
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

    private _onTouchedBtnActRangeForUp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActRangeForUp();
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
                        action.setActRangeForUp(null);
                    } else {
                        action.setActRangeForUp(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActRangeForDown(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActRangeForDown();
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
                        action.setActRangeForDown(null);
                    } else {
                        action.setActRangeForDown(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActRangeForLeft(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActRangeForLeft();
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
                        action.setActRangeForLeft(null);
                    } else {
                        action.setActRangeForLeft(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActRangeForRight(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActRangeForRight();
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
                        action.setActRangeForRight(null);
                    } else {
                        action.setActRangeForRight(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
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
                        action.setActPriority(null);
                    } else {
                        action.setActPriority(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActOffsetHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActOffsetHp();
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
                        action.setActOffsetHp(null);
                    } else {
                        action.setActOffsetHp(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
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
                        action.setActOffsetFuelPercentage(null);
                    } else {
                        action.setActOffsetFuelPercentage(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
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
                        action.setActOffsetPrimaryAmmoPercentage(null);
                    } else {
                        action.setActOffsetPrimaryAmmoPercentage(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
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

        this._btnActRangeForUp.setLangText(TextType.RangeUp);
        this._btnActRangeForDown.setLangText(TextType.RangeDown);
        this._btnActRangeForLeft.setLangText(TextType.RangeLeft);
        this._btnActRangeForRight.setLangText(TextType.RangeRight);
        this._btnActPriority.setLangText(TextType.Priority);
        this._btnActCanAffectSelf.setLangText(TextType.AffectOwner);
        this._btnActCanAffectAlly.setLangText(TextType.AffectAlly);
        this._btnActCanAffectEnemy.setLangText(TextType.AffectEnemy);
        this._btnActOffsetHp.setLangText(TextType.UnitsHpOffset);
        this._btnActOffsetFuelPercentage.setLangText(TextType.UnitsFuelOffset$);
        this._btnActOffsetPrimaryAmmoPercentage.setLangText(TextType.UnitsPriAmmoOffset$);
        this._btnActCanBeFatal.setLangText(TextType.CanBeFatal);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();

        this._updateLabelActRangeForUp();
        this._updateLabelActRangeForDown();
        this._updateLabelActRangeForLeft();
        this._updateLabelActRangeForRight();
        this._updateLabelActPriority();
        this._updateLabelActCanAffectSelf();
        this._updateLabelActCanAffectAlly();
        this._updateLabelActCanAffectEnemy();
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

    private _updateLabelActRangeForUp(): void {
        const act = this._getAction()?.getActRangeForUp();
        this._labelActRangeForUp.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActRangeForDown(): void {
        const act = this._getAction()?.getActRangeForDown();
        this._labelActRangeForDown.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActRangeForLeft(): void {
        const act = this._getAction()?.getActRangeForLeft();
        this._labelActRangeForLeft.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActRangeForRight(): void {
        const act = this._getAction()?.getActRangeForRight();
        this._labelActRangeForRight.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActPriority(): void {
        const act = this._getAction()?.getActPriority();
        this._labelActPriority.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActCanAffectSelf(): void {
        const act = this._getAction()?.getActCanAffectSelf();
        this._labelActCanAffectSelf.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActCanAffectAlly(): void {
        const act = this._getAction()?.getActCanAffectAlly();
        this._labelActCanAffectAlly.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActCanAffectEnemy(): void {
        const act = this._getAction()?.getActCanAffectEnemy();
        this._labelActCanAffectEnemy.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActOffsetHp(): void {
        const act = this._getAction()?.getActOffsetHp();
        this._labelActOffsetHp.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActOffsetFuelPercentage(): void {
        const act = this._getAction()?.getActOffsetFuelPercentage();
        this._labelActOffsetFuelPercentage.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActOffsetPrimaryAmmoPercentage(): void {
        const act = this._getAction()?.getActOffsetPrimaryAmmoPercentage();
        this._labelActOffsetPrimaryAmmoPercentage.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActCanBeFatal(): void {
        const act = this._getAction()?.getActCanBeFatal();
        this._labelActCanBeFatal.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _getAction(): Undefinable<WeaSetCustomLaserTurretStateSimple> {
        return this.getOpenData()?.action.getWeaSetCustomLaserTurretStateSimple();
    }
}
