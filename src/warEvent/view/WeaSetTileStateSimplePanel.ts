import { getDesc } from "../../arrayModifiers/Utils.ts";
import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getComparatorName,
    getTextForYesOrNo,
} from "../../lang/Utils.ts";
import { AllLocationIdArray } from "../../locations/Constants.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import {
    checkIsDefault,
    getBriefDesc as getMultiplierAndOffsetsBriefDesc,
} from "../../multiplierAndOffsets/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ArrayModifier } from "../../proto/schema/CommonProto/Structure/ArrayModifier.ts";
import { MultiplierAndOffset } from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetTileStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetTileStateSimple.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import {
    ComparatorId,
    AllComparatorIdArray,
} from "../../valueAndComparators/Constants.ts";
import { getBriefDesc as getValueAndComparatorsBriefDesc } from "../../valueAndComparators/Utils.ts";
import {
    getErrorTipForAction,
    getDetailDescForAction,
} from "../../warEvents/actions/utils/Common.ts";
import { Event } from "../../warEvents/Constants.ts";

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

    private readonly _btnConPlayerFilter!                       : IUiButton;
    private readonly _labelConPlayerFilter!                     : IUiLabel;

    private readonly _btnConUnitFilter!                         : IUiButton;
    private readonly _labelConUnitFilter!                       : IUiLabel;

    private readonly _btnConUnitComparator!                     : IUiButton;
    private readonly _labelConUnitComparator!                   : IUiLabel;

    private readonly _btnConTileFilter!                         : IUiButton;
    private readonly _labelConTileFilter!                       : IUiLabel;

    private readonly _btnActCurrentHp!                          : IUiButton;
    private readonly _labelActCurrentHp!                        : IUiLabel;

    private readonly _btnActCurrentBuildPoint!                  : IUiButton;
    private readonly _labelActCurrentBuildPoint!                : IUiLabel;

    private readonly _btnActCurrentCapturePoint!                : IUiButton;
    private readonly _labelActCurrentCapturePoint!              : IUiLabel;

    private readonly _btnActPlayerIndex!                        : IUiButton;
    private readonly _labelActPlayerIndex!                      : IUiLabel;

    private readonly _btnActIsHighlighted!                      : IUiButton;
    private readonly _labelActIsHighlighted!                    : IUiLabel;

    private readonly _btnActLocationIdArray!                    : IUiButton;
    private readonly _labelActLocationIdArray!                  : IUiLabel;

    private readonly _btnActCustomNameId!                       : IUiButton;
    private readonly _labelActCustomNameId!                     : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },

            { ui: this._btnActCurrentHp,                        callback: this._onTouchedBtnActCurrentHp },
            { ui: this._btnActCurrentBuildPoint,                callback: this._onTouchedBtnActCurrentBuildPoint },
            { ui: this._btnActCurrentCapturePoint,              callback: this._onTouchedBtnActCurrentCapturePoint },
            { ui: this._btnActPlayerIndex,                      callback: this._onTouchedBtnActPlayerIndex },
            { ui: this._btnActIsHighlighted,                    callback: this._onTouchedBtnActIsHighlighted },
            { ui: this._btnActLocationIdArray,                  callback: this._onTouchedBtnActLocationIdArray },
            { ui: this._btnActCustomNameId,                     callback: this._onTouchedBtnActCustomNameId },
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

    private _onTouchedBtnActCurrentHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCurrentHp();
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
                        action.setActCurrentHp(null);
                    } else {
                        action.setActCurrentHp(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActCurrentBuildPoint(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCurrentBuildPoint();
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
                        action.setActCurrentBuildPoint(null);
                    } else {
                        action.setActCurrentBuildPoint(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActCurrentCapturePoint(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCurrentCapturePoint();
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
                        action.setActCurrentCapturePoint(null);
                    } else {
                        action.setActCurrentCapturePoint(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActPlayerIndex();
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
                        action.setActPlayerIndex(null);
                    } else {
                        action.setActPlayerIndex(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
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
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActLocationIdArray(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            getTitleText            : () => getText(TextType.B1425),
            availableIntegerArray   : AllLocationIdArray,
            currentIntegerArray     : action.getActLocationIdArray()?.getAddIntArray() ?? [],
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = AllLocationIdArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActLocationIdArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonChooseMultiIntegerPanel, {
                        getTitleText            : () => getText(TextType.B1426),
                        availableIntegerArray   : remainingValueArray,
                        currentIntegerArray     : action.getActLocationIdArray()?.getDeleteIntArray() ?? [],
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActLocationIdArray(null);
                            } else {
                                action.setActLocationIdArray(ArrayModifier.fromJson({
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

    private _onTouchedBtnActCustomNameId(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCustomNameId();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle           : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActCustomNameId(null);
                    } else {
                        action.setActCustomNameId(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
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
        this._labelTitle.setText(`${getText(TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(TextType.B0516);

        this._btnConPlayerFilter.setLangText(TextType.PlayerFilter);
        this._btnConUnitFilter.setLangText(TextType.UnitFilter);
        this._btnConUnitComparator.setLangText(TextType.Comparator);
        this._btnConTileFilter.setLangText(TextType.TileFilter);

        this._btnActCurrentHp.setLangText(TextType.Hp);
        this._btnActCurrentBuildPoint.setLangText(TextType.BuildPoint);
        this._btnActCurrentCapturePoint.setLangText(TextType.CapturePoint);
        this._btnActPlayerIndex.setLangText(TextType.PlayerIndex);
        this._btnActIsHighlighted.setLangText(TextType.IsHighlighted);
        this._btnActLocationIdArray.setLangText(TextType.Location);
        this._btnActCustomNameId.setLangText(TextType.CustomNameId);

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
        this._labelConUnitComparator.setText(comparator == null ? `` : getValueAndComparatorsBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelActCurrentHp(): void {
        const act = this._getAction()?.getActCurrentHp();
        this._labelActCurrentHp.setText(act == null
            ? ``
            : getMultiplierAndOffsetsBriefDesc(act)
        );
    }

    private _updateLabelActCurrentBuildPoint(): void {
        const act = this._getAction()?.getActCurrentBuildPoint();
        this._labelActCurrentBuildPoint.setText(act == null
            ? ``
            : getMultiplierAndOffsetsBriefDesc(act)
        );
    }

    private _updateLabelActCurrentCapturePoint(): void {
        const act = this._getAction()?.getActCurrentCapturePoint();
        this._labelActCurrentCapturePoint.setText(act == null
            ? ``
            : getMultiplierAndOffsetsBriefDesc(act)
        );
    }

    private _updateLabelActPromotion(): void {
        const act = this._getAction()?.getActPlayerIndex();
        this._labelActPlayerIndex.setText(act == null
            ? ``
            : getMultiplierAndOffsetsBriefDesc(act)
        );
    }

    private _updateLabelActIsHighlighted(): void {
        const act = this._getAction()?.getActIsHighlighted();
        this._labelActIsHighlighted.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActLocationIdArray(): void {
        const act = this._getAction()?.getActLocationIdArray();
        this._labelActLocationIdArray.setText(act == null
            ? ``
            : getDesc(act, getText(TextType.NoEntryLocations))
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
            : getMultiplierAndOffsetsBriefDesc(act)
        );
    }

    private _getAction(): Undefinable<WeaSetTileStateSimple> {
        return this.getOpenData()?.action.getWeaSetTileStateSimple();
    }
}
