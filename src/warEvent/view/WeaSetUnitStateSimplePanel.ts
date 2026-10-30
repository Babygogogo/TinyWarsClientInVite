import {
    Units_Constants,
    Locations_Constants,
    MultiplierAndOffsets_Utils,
    Graphics_Constants,
    Notifications_Dispatcher,
    WarEvents_Constants,
    ArrayModifiers_Utils,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    Lang_Utils,
    WeightedGridIndexes_Utils,
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
import { WeightedGridIndex } from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetUnitStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateSimple.ts";

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

    private readonly _btnConTileFilter!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActHp!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActHp!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActFuel!                               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActFuel!                             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActPriAmmo!                            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActPriAmmo!                          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActPromotion!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActPromotion!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActCustomNameId!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCustomNameId!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActFlareAmmo!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActFlareAmmo!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActBuildMaterial!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActBuildMaterial!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActProduceMaterial!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActProduceMaterial!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActActionState!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActActionState!                      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActIsCoOnboard!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsCoOnboard!                      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActIsDiving!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsDiving!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActAiMode!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActAiMode!                           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActAiWeightedDestination!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActAiWeightedDestination!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActTagIdArray!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActTagIdArray!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActForbiddenLocationIdArray!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActForbiddenLocationIdArray!         : Ui_Interfaces_IUiLabel.IUiLabel;

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
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : action.getConPlayerFilter(),
            callback                : filter => {
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
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConUnitFilter(),
            callback                : filter => {
                action.setConUnitFilter(filter);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConTileFilter(),
            callback                : filter => {
                action.setConTileFilter(filter);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActHp();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue        : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue        : WarEvents_Constants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue        : -WarEvents_Constants.Event.MaxOffset,
                maxValue        : WarEvents_Constants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActHp(null);
                    } else {
                        action.setActHp(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue        : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue        : WarEvents_Constants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue        : -WarEvents_Constants.Event.MaxOffset,
                maxValue        : WarEvents_Constants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActFuel(null);
                    } else {
                        action.setActFuel(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue        : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue        : WarEvents_Constants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue        : -WarEvents_Constants.Event.MaxOffset,
                maxValue        : WarEvents_Constants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActPriAmmo(null);
                    } else {
                        action.setActPriAmmo(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue        : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue        : WarEvents_Constants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue        : -WarEvents_Constants.Event.MaxOffset,
                maxValue        : WarEvents_Constants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActPromotion(null);
                    } else {
                        action.setActPromotion(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue        : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue        : WarEvents_Constants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue        : -WarEvents_Constants.Event.MaxOffset,
                maxValue        : WarEvents_Constants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActCustomNameId(null);
                    } else {
                        action.setActCustomNameId(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue        : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue        : WarEvents_Constants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue        : -WarEvents_Constants.Event.MaxOffset,
                maxValue        : WarEvents_Constants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActFlareAmmo(null);
                    } else {
                        action.setActFlareAmmo(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue        : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue        : WarEvents_Constants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue        : -WarEvents_Constants.Event.MaxOffset,
                maxValue        : WarEvents_Constants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActBuildMaterial(null);
                    } else {
                        action.setActBuildMaterial(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Multiplier),
            minValue        : -WarEvents_Constants.Event.MaxMultiplier,
            maxValue        : WarEvents_Constants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Offset),
                minValue        : -WarEvents_Constants.Event.MaxOffset,
                maxValue        : WarEvents_Constants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsets_Utils.checkIsDefault(multiplierAndOffset)) {
                        action.setActProduceMaterial(null);
                    } else {
                        action.setActProduceMaterial(multiplierAndOffset);
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
            action.setActActionState(Units_Constants.ActionStateId.Idle);
        } else if (oldValue === Units_Constants.ActionStateId.Idle) {
            action.setActActionState(Units_Constants.ActionStateId.Acted);
        } else {
            action.setActActionState(null);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActAiMode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue      = action.getActAiMode();
        const valueArray    = Units_Constants.AllAiModeIdArray;
        const index         = oldValue == null ? -1 : valueArray.indexOf(oldValue);
        if (index < valueArray.length - 1) {
            action.setActAiMode(valueArray[index + 1]);
        } else {
            action.setActAiMode(null);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : oldValue?.getGridIndex()?.getX(),
            callback        : newX => {
                if (newX == null) {
                    action.setActAiWeightedDestination(null);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                        getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : oldValue?.getGridIndex()?.getY(),
                        callback        : newY => {
                            if (newY == null) {
                                action.setActAiWeightedDestination(null);
                                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                            } else {
                                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                                    getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.B1094),
                                    minValue        : Units_Constants.AiDestination.MinWeight,
                                    maxValue        : Units_Constants.AiDestination.MaxWeight,
                                    currentValue    : oldValue?.getWeight() ?? 0,
                                    callback        : newWeight => {
                                        action.setActAiWeightedDestination(WeightedGridIndex.fromJson({
                                            gridIndex   : { x: newX, y: newY },
                                            weight      : newWeight,
                                        }));
                                        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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

        const allValueArray = Units_Constants.AllTagIdArray;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B1425),
            availableIntegerArray   : allValueArray,
            currentIntegerArray     : action.getActTagIdArray()?.getAddIntArray() ?? [],
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allValueArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActTagIdArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
                        getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B1426),
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
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B1425),
            availableIntegerArray   : Locations_Constants.AllLocationIdArray,
            currentIntegerArray     : action.getActForbiddenLocationIdArray()?.getAddIntArray() ?? [],
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = Locations_Constants.AllLocationIdArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActForbiddenLocationIdArray(ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
                        getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B1426),
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
        this._btnConTileFilter.setLangText(Lang_Constants.TextType.TileFilter);

        this._btnActHp.setLangText(Lang_Constants.TextType.Hp);
        this._btnActFuel.setLangText(Lang_Constants.TextType.Fuel);
        this._btnActPriAmmo.setLangText(Lang_Constants.TextType.PrimaryWeaponAmmo);
        this._btnActPromotion.setLangText(Lang_Constants.TextType.Promotion);
        this._btnActCustomNameId.setLangText(Lang_Constants.TextType.CustomNameId);
        this._btnActFlareAmmo.setLangText(Lang_Constants.TextType.FlareAmmo);
        this._btnActBuildMaterial.setLangText(Lang_Constants.TextType.BuildMaterial);
        this._btnActProduceMaterial.setLangText(Lang_Constants.TextType.ProductionMaterial);
        this._btnActActionState.setLangText(Lang_Constants.TextType.ActionState);
        this._btnActIsCoOnboard.setLangText(Lang_Constants.TextType.CoOnboard);
        this._btnActIsDiving.setLangText(Lang_Constants.TextType.IsDived);
        this._btnActAiMode.setLangText(Lang_Constants.TextType.AiMode);
        this._btnActAiWeightedDestination.setLangText(Lang_Constants.TextType.AiDestination);
        this._btnActTagIdArray.setLangText(Lang_Constants.TextType.Tags);
        this._btnActForbiddenLocationIdArray.setLangText(Lang_Constants.TextType.NoEntryLocations);

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

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : Lang_Utils.getText(Lang_Constants.TextType.B1408));
    }

    private _updateLabelActHp(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActHp();
        this._labelActHp.setText(act == null
            ? ``
            : MultiplierAndOffsets_Utils.getBriefDesc(act)
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
            : MultiplierAndOffsets_Utils.getBriefDesc(act)
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
            : MultiplierAndOffsets_Utils.getBriefDesc(act)
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
            : MultiplierAndOffsets_Utils.getBriefDesc(act)
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
            : MultiplierAndOffsets_Utils.getBriefDesc(act)
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
            : MultiplierAndOffsets_Utils.getBriefDesc(act)
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
            : MultiplierAndOffsets_Utils.getBriefDesc(act)
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
            : MultiplierAndOffsets_Utils.getBriefDesc(act)
        );
    }

    private _updateLabelActActionState(): void {
        const act = this._getAction()?.getActActionState();
        this._labelActActionState.setText(act == null
            ? ``
            : (Lang_Utils.getUnitActionStateText(act) ?? Lang_Constants.UndefinedError)
        );
    }

    private _updateLabelActIsCoOnboard(): void {
        const act = this._getAction()?.getActIsCoOnboard();
        this._labelActIsCoOnboard.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActIsDiving(): void {
        const act = this._getAction()?.getActIsDiving();
        this._labelActIsDiving.setText(act == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActAiMode(): void {
        const act = this._getAction()?.getActAiMode();
        this._labelActAiMode.setText(act == null
            ? ``
            : (Lang_Utils.getUnitAiModeName(act) ?? Lang_Constants.UndefinedError)
        );
    }

    private _updateLabelActAiWeightedDestination(): void {
        const act = this._getAction()?.getActAiWeightedDestination();
        this._labelActAiWeightedDestination.setText(act == null
            ? ``
            : WeightedGridIndexes_Utils.getDesc(act)
        );
    }

    private _updateLabelActTagIdArray(): void {
        const act = this._getAction()?.getActTagIdArray();
        this._labelActTagIdArray.setText(act == null
            ? ``
            : ArrayModifiers_Utils.getDesc(act, Lang_Utils.getText(Lang_Constants.TextType.Tags))
        );
    }

    private _updateLabelActForbiddenLocationIdArray(): void {
        const act = this._getAction()?.getActForbiddenLocationIdArray();
        this._labelActForbiddenLocationIdArray.setText(act == null
            ? ``
            : ArrayModifiers_Utils.getDesc(act, Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations))
        );
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitStateSimple> {
        return this.getOpenData()?.action.getWeaSetUnitStateSimple();
    }
}
