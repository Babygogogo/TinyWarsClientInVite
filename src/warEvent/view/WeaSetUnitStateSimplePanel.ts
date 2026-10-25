import { getDesc } from "../../arrayModifiers/Utils.ts";
import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getUnitActionStateText, getTextForYesOrNo, getUnitAiModeName } from "../../lang/Utils.ts";
import { AllLocationIdArray } from "../../locations/Constants.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { checkIsDefault, getBriefDesc } from "../../multiplierAndOffsets/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ArrayModifier } from "../../proto/schema/CommonProto/Structure/ArrayModifier.ts";
import { MultiplierAndOffset } from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import { WeightedGridIndex } from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetUnitStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateSimple.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ActionStateId, AllAiModeIdArray, AiDestination, AllTagIdArray } from "../../units/Constants.ts";
import { getErrorTipForAction, getDetailDescForAction } from "../../warEvents/actions/utils/Common.ts";
import { Event } from "../../warEvents/Constants.ts";
import { getDesc as WeightedGridIndexesUtilsGetDesc } from "../../weightedGridIndexes/Utils.ts";

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

    private readonly _btnConTileFilter!                         : IUiButton;
    private readonly _labelConTileFilter!                       : IUiLabel;

    private readonly _btnActHp!                                 : IUiButton;
    private readonly _labelActHp!                               : IUiLabel;

    private readonly _btnActFuel!                               : IUiButton;
    private readonly _labelActFuel!                             : IUiLabel;

    private readonly _btnActPriAmmo!                            : IUiButton;
    private readonly _labelActPriAmmo!                          : IUiLabel;

    private readonly _btnActPromotion!                          : IUiButton;
    private readonly _labelActPromotion!                        : IUiLabel;

    private readonly _btnActCustomNameId!                       : IUiButton;
    private readonly _labelActCustomNameId!                     : IUiLabel;

    private readonly _btnActFlareAmmo!                          : IUiButton;
    private readonly _labelActFlareAmmo!                        : IUiLabel;

    private readonly _btnActBuildMaterial!                      : IUiButton;
    private readonly _labelActBuildMaterial!                    : IUiLabel;

    private readonly _btnActProduceMaterial!                    : IUiButton;
    private readonly _labelActProduceMaterial!                  : IUiLabel;

    private readonly _btnActActionState!                        : IUiButton;
    private readonly _labelActActionState!                      : IUiLabel;

    private readonly _btnActIsCoOnboard!                        : IUiButton;
    private readonly _labelActIsCoOnboard!                      : IUiLabel;

    private readonly _btnActIsDiving!                           : IUiButton;
    private readonly _labelActIsDiving!                         : IUiLabel;

    private readonly _btnActAiMode!                             : IUiButton;
    private readonly _labelActAiMode!                           : IUiLabel;

    private readonly _btnActAiWeightedDestination!              : IUiButton;
    private readonly _labelActAiWeightedDestination!            : IUiLabel;

    private readonly _btnActTagIdArray!                         : IUiButton;
    private readonly _labelActTagIdArray!                       : IUiLabel;

    private readonly _btnActForbiddenLocationIdArray!           : IUiButton;
    private readonly _labelActForbiddenLocationIdArray!         : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },

            { ui: this._btnActHp,                               callback: this._onTouchedBtnActHp },
            { ui: this._btnActFuel,                             callback: this._onTouchedBtnActFuel },
            { ui: this._btnActPriAmmo,                          callback: this._onTouchedBtnActPriAmmo },
            { ui: this._btnActPromotion,                        callback: this._onTouchedBtnActPromotion },
            { ui: this._btnActCustomNameId,                     callback: this._onTouchedBtnActCustomNameId },
            { ui: this._btnActFlareAmmo,                        callback: this._onTouchedBtnActFlareAmmo },
            { ui: this._btnActBuildMaterial,                    callback: this._onTouchedBtnActBuildMaterial },
            { ui: this._btnActProduceMaterial,                  callback: this._onTouchedBtnActProduceMaterial },
            { ui: this._btnActActionState,                      callback: this._onTouchedBtnActActionState },
            { ui: this._btnActIsCoOnboard,                      callback: this._onTouchedBtnActIsCoOnboard },
            { ui: this._btnActIsDiving,                         callback: this._onTouchedBtnActIsDiving },
            { ui: this._btnActAiMode,                           callback: this._onTouchedBtnActAiMode },
            { ui: this._btnActAiWeightedDestination,            callback: this._onTouchedBtnActAiWeightedDestination },
            { ui: this._btnActTagIdArray,                       callback: this._onTouchedBtnActTagIdArray },
            { ui: this._btnActForbiddenLocationIdArray,         callback: this._onTouchedBtnActForbiddenLocationIdArray },
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
                dispatch(TypeId.WarEventFullDataChanged);
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

    private _onTouchedBtnActHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActHp();
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
                        action.setActHp(null);
                    } else {
                        action.setActHp(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActFuel(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActFuel();
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
                        action.setActFuel(null);
                    } else {
                        action.setActFuel(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActPriAmmo(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActPriAmmo();
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
                        action.setActPriAmmo(null);
                    } else {
                        action.setActPriAmmo(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActPromotion(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActPromotion();
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
                        action.setActPromotion(null);
                    } else {
                        action.setActPromotion(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActCustomNameId(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCustomNameId();
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
                        action.setActCustomNameId(null);
                    } else {
                        action.setActCustomNameId(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActFlareAmmo(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActFlareAmmo();
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
                        action.setActFlareAmmo(null);
                    } else {
                        action.setActFlareAmmo(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActBuildMaterial(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActBuildMaterial();
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
                        action.setActBuildMaterial(null);
                    } else {
                        action.setActBuildMaterial(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActProduceMaterial(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActProduceMaterial();
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
                        action.setActProduceMaterial(null);
                    } else {
                        action.setActProduceMaterial(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActActionState(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActActionState();
        if (oldValue == null) {
            action.setActActionState(ActionStateId.Idle);
        } else if (oldValue === ActionStateId.Idle) {
            action.setActActionState(ActionStateId.Acted);
        } else {
            action.setActActionState(null);
        }
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActIsCoOnboard(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActIsCoOnboard();
        if (oldValue == null) {
            action.setActIsCoOnboard(true);
        } else if (oldValue) {
            action.setActIsCoOnboard(false);
        } else {
            action.setActIsCoOnboard(null);
        }
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActIsDiving(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActIsDiving();
        if (oldValue == null) {
            action.setActIsDiving(true);
        } else if (oldValue) {
            action.setActIsDiving(false);
        } else {
            action.setActIsDiving(null);
        }
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActAiMode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue      = action.getActAiMode();
        const valueArray    = AllAiModeIdArray;
        const index         = oldValue == null ? -1 : valueArray.indexOf(oldValue);
        if (index < valueArray.length - 1) {
            action.setActAiMode(valueArray[index + 1]);
        } else {
            action.setActAiMode(null);
        }
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActAiWeightedDestination(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const mapSize = this.getOpenData()?.war.getTileMap().getMapSize();
        if (mapSize == null) {
            return;
        }

        const oldValue = action.getActAiWeightedDestination();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : oldValue?.getGridIndex()?.getX(),
            callback        : newX => {
                if (newX == null) {
                    action.setActAiWeightedDestination(null);
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonInputNullableIntegerPanel, {
                        getTitle        : () => getText(TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : oldValue?.getGridIndex()?.getY(),
                        callback        : newY => {
                            if (newY == null) {
                                action.setActAiWeightedDestination(null);
                                dispatch(TypeId.WarEventFullDataChanged);

                            } else {
                                openPanel(getDict().CommonInputIntegerPanel, {
                                    getTitle        : () => getText(TextType.B1094),
                                    minValue        : AiDestination.MinWeight,
                                    maxValue        : AiDestination.MaxWeight,
                                    currentValue    : oldValue?.getWeight() ?? 0,
                                    callback        : newWeight => {
                                        action.setActAiWeightedDestination(WeightedGridIndex.fromJson({
                                            gridIndex   : { x: newX, y: newY },
                                            weight      : newWeight,
                                        }));
                                        dispatch(TypeId.WarEventFullDataChanged);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    private _onTouchedBtnActTagIdArray(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const allValueArray = AllTagIdArray;
        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            getTitleText            : () => getText(TextType.B1425),
            availableIntegerArray   : allValueArray,
            currentIntegerArray     : action.getActTagIdArray()?.getAddIntArray() ?? [],
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allValueArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActTagIdArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonChooseMultiIntegerPanel, {
                        getTitleText            : () => getText(TextType.B1426),
                        availableIntegerArray   : remainingValueArray,
                        currentIntegerArray     : action.getActTagIdArray()?.getDeleteIntArray() ?? [],
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActTagIdArray(null);
                            } else {
                                action.setActTagIdArray(ArrayModifier.fromJson({
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

    private _onTouchedBtnActForbiddenLocationIdArray(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            getTitleText            : () => getText(TextType.B1425),
            availableIntegerArray   : AllLocationIdArray,
            currentIntegerArray     : action.getActForbiddenLocationIdArray()?.getAddIntArray() ?? [],
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = AllLocationIdArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActForbiddenLocationIdArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    dispatch(TypeId.WarEventFullDataChanged);

                } else {
                    openPanel(getDict().CommonChooseMultiIntegerPanel, {
                        getTitleText            : () => getText(TextType.B1426),
                        availableIntegerArray   : remainingValueArray,
                        currentIntegerArray     : action.getActForbiddenLocationIdArray()?.getDeleteIntArray() ?? [],
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActForbiddenLocationIdArray(null);
                            } else {
                                action.setActForbiddenLocationIdArray(ArrayModifier.fromJson({
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
        this._btnConTileFilter.setLangText(TextType.TileFilter);

        this._btnActHp.setLangText(TextType.Hp);
        this._btnActFuel.setLangText(TextType.Fuel);
        this._btnActPriAmmo.setLangText(TextType.PrimaryWeaponAmmo);
        this._btnActPromotion.setLangText(TextType.Promotion);
        this._btnActCustomNameId.setLangText(TextType.CustomNameId);
        this._btnActFlareAmmo.setLangText(TextType.FlareAmmo);
        this._btnActBuildMaterial.setLangText(TextType.BuildMaterial);
        this._btnActProduceMaterial.setLangText(TextType.ProductionMaterial);
        this._btnActActionState.setLangText(TextType.ActionState);
        this._btnActIsCoOnboard.setLangText(TextType.CoOnboard);
        this._btnActIsDiving.setLangText(TextType.IsDived);
        this._btnActAiMode.setLangText(TextType.AiMode);
        this._btnActAiWeightedDestination.setLangText(TextType.AiDestination);
        this._btnActTagIdArray.setLangText(TextType.Tags);
        this._btnActForbiddenLocationIdArray.setLangText(TextType.NoEntryLocations);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConTileFilter();

        this._updateLabelActHp();
        this._updateLabelActFuel();
        this._updateLabelActPriAmmo();
        this._updateLabelActPromotion();
        this._updateLabelActCustomNameId();
        this._updateLabelActFlareAmmo();
        this._updateLabelActBuildMaterial();
        this._updateLabelActProduceMaterial();
        this._updateLabelActActionState();
        this._updateLabelActIsCoOnboard();
        this._updateLabelActIsDiving();
        this._updateLabelActAiMode();
        this._updateLabelActAiWeightedDestination();
        this._updateLabelActTagIdArray();
        this._updateLabelActForbiddenLocationIdArray();
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

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelActHp(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActHp();
        this._labelActHp.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActFuel(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActFuel();
        this._labelActFuel.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActPriAmmo(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActPriAmmo();
        this._labelActPriAmmo.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActPromotion(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActPromotion();
        this._labelActPromotion.setText(act == null
            ? ``
            : getBriefDesc(act)
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
            : getBriefDesc(act)
        );
    }

    private _updateLabelActFlareAmmo(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActFlareAmmo();
        this._labelActFlareAmmo.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActBuildMaterial(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActBuildMaterial();
        this._labelActBuildMaterial.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActProduceMaterial(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActProduceMaterial();
        this._labelActProduceMaterial.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActActionState(): void {
        const act = this._getAction()?.getActActionState();
        this._labelActActionState.setText(act == null
            ? ``
            : (getUnitActionStateText(act) ?? UndefinedError)
        );
    }

    private _updateLabelActIsCoOnboard(): void {
        const act = this._getAction()?.getActIsCoOnboard();
        this._labelActIsCoOnboard.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActIsDiving(): void {
        const act = this._getAction()?.getActIsDiving();
        this._labelActIsDiving.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActAiMode(): void {
        const act = this._getAction()?.getActAiMode();
        this._labelActAiMode.setText(act == null
            ? ``
            : (getUnitAiModeName(act) ?? UndefinedError)
        );
    }

    private _updateLabelActAiWeightedDestination(): void {
        const act = this._getAction()?.getActAiWeightedDestination();
        this._labelActAiWeightedDestination.setText(act == null
            ? ``
            : WeightedGridIndexesUtilsGetDesc(act)
        );
    }

    private _updateLabelActTagIdArray(): void {
        const act = this._getAction()?.getActTagIdArray();
        this._labelActTagIdArray.setText(act == null
            ? ``
            : getDesc(act, getText(TextType.Tags))
        );
    }

    private _updateLabelActForbiddenLocationIdArray(): void {
        const act = this._getAction()?.getActForbiddenLocationIdArray();
        this._labelActForbiddenLocationIdArray.setText(act == null
            ? ``
            : getDesc(act, getText(TextType.NoEntryLocations))
        );
    }

    private _getAction(): Undefinable<WeaSetUnitStateSimple> {
        return this.getOpenData()?.action.getWeaSetUnitStateSimple();
    }
}
