import * as ArrayModifiersUtils from "../../arrayModifiers/Utils.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocationsConstants from "../../locations/Constants.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MultiplierAndOffsetsUtils from "../../multiplierAndOffsets/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureArrayModifier from "../../proto/schema/CommonProto/Structure/ArrayModifier.ts";
import * as ProtoSchemaCommonProtoStructureMultiplierAndOffset from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import * as ProtoSchemaCommonProtoStructureWeightedGridIndex from "../../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetUnitStateSimple from "../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateSimple.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";
import * as WarEventsConstants from "../../warEvents/Constants.ts";
import * as WeightedGridIndexesUtils from "../../weightedGridIndexes/Utils.ts";

type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction         = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

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

    private readonly _btnConPlayerFilter!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConTileFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActHp!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActHp!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActFuel!                               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActFuel!                             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActPriAmmo!                            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActPriAmmo!                          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActPromotion!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActPromotion!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCustomNameId!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCustomNameId!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActFlareAmmo!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActFlareAmmo!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActBuildMaterial!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActBuildMaterial!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActProduceMaterial!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActProduceMaterial!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActActionState!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActActionState!                      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActIsCoOnboard!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsCoOnboard!                      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActIsDiving!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsDiving!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActAiMode!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActAiMode!                           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActAiWeightedDestination!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActAiWeightedDestination!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActTagIdArray!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActTagIdArray!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActForbiddenLocationIdArray!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActForbiddenLocationIdArray!         : UiInterfacesIUiLabel.IUiLabel;

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
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

    private _onTouchedBtnActHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActHp();
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
                        action.setActHp(null);
                    } else {
                        action.setActHp(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActFuel(null);
                    } else {
                        action.setActFuel(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActPriAmmo(null);
                    } else {
                        action.setActPriAmmo(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActPromotion(null);
                    } else {
                        action.setActPromotion(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActCustomNameId(null);
                    } else {
                        action.setActCustomNameId(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActFlareAmmo(null);
                    } else {
                        action.setActFlareAmmo(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActBuildMaterial(null);
                    } else {
                        action.setActBuildMaterial(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActProduceMaterial(null);
                    } else {
                        action.setActProduceMaterial(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
            action.setActActionState(UnitsConstants.ActionStateId.Idle);
        } else if (oldValue === UnitsConstants.ActionStateId.Idle) {
            action.setActActionState(UnitsConstants.ActionStateId.Acted);
        } else {
            action.setActActionState(null);
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActAiMode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue      = action.getActAiMode();
        const valueArray    = UnitsConstants.AllAiModeIdArray;
        const index         = oldValue == null ? -1 : valueArray.indexOf(oldValue);
        if (index < valueArray.length - 1) {
            action.setActAiMode(valueArray[index + 1]);
        } else {
            action.setActAiMode(null);
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : oldValue?.getGridIndex()?.getX(),
            callback        : newX => {
                if (newX == null) {
                    action.setActAiWeightedDestination(null);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                        getTitle        : () => LangUtils.getText(LangConstants.TextType.B1072),
                        minValue        : 0,
                        maxValue        : mapSize.getHeight() - 1,
                        currentValue    : oldValue?.getGridIndex()?.getY(),
                        callback        : newY => {
                            if (newY == null) {
                                action.setActAiWeightedDestination(null);
                                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                            } else {
                                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                                    getTitle        : () => LangUtils.getText(LangConstants.TextType.B1094),
                                    minValue        : UnitsConstants.AiDestination.MinWeight,
                                    maxValue        : UnitsConstants.AiDestination.MaxWeight,
                                    currentValue    : oldValue?.getWeight() ?? 0,
                                    callback        : newWeight => {
                                        action.setActAiWeightedDestination(ProtoSchemaCommonProtoStructureWeightedGridIndex.WeightedGridIndex.fromJson({
                                            gridIndex   : { x: newX, y: newY },
                                            weight      : newWeight,
                                        }));
                                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        const allValueArray = UnitsConstants.AllTagIdArray;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1425),
            availableIntegerArray   : allValueArray,
            currentIntegerArray     : action.getActTagIdArray()?.getAddIntArray() ?? [],
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = allValueArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActTagIdArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1426),
                        availableIntegerArray   : remainingValueArray,
                        currentIntegerArray     : action.getActTagIdArray()?.getDeleteIntArray() ?? [],
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActTagIdArray(null);
                            } else {
                                action.setActTagIdArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
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

    private _onTouchedBtnActForbiddenLocationIdArray(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1425),
            availableIntegerArray   : LocationsConstants.AllLocationIdArray,
            currentIntegerArray     : action.getActForbiddenLocationIdArray()?.getAddIntArray() ?? [],
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = LocationsConstants.AllLocationIdArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActForbiddenLocationIdArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1426),
                        availableIntegerArray   : remainingValueArray,
                        currentIntegerArray     : action.getActForbiddenLocationIdArray()?.getDeleteIntArray() ?? [],
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActForbiddenLocationIdArray(null);
                            } else {
                                action.setActForbiddenLocationIdArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
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
        this._btnConTileFilter.setLangText(LangConstants.TextType.TileFilter);

        this._btnActHp.setLangText(LangConstants.TextType.Hp);
        this._btnActFuel.setLangText(LangConstants.TextType.Fuel);
        this._btnActPriAmmo.setLangText(LangConstants.TextType.PrimaryWeaponAmmo);
        this._btnActPromotion.setLangText(LangConstants.TextType.Promotion);
        this._btnActCustomNameId.setLangText(LangConstants.TextType.CustomNameId);
        this._btnActFlareAmmo.setLangText(LangConstants.TextType.FlareAmmo);
        this._btnActBuildMaterial.setLangText(LangConstants.TextType.BuildMaterial);
        this._btnActProduceMaterial.setLangText(LangConstants.TextType.ProductionMaterial);
        this._btnActActionState.setLangText(LangConstants.TextType.ActionState);
        this._btnActIsCoOnboard.setLangText(LangConstants.TextType.CoOnboard);
        this._btnActIsDiving.setLangText(LangConstants.TextType.IsDived);
        this._btnActAiMode.setLangText(LangConstants.TextType.AiMode);
        this._btnActAiWeightedDestination.setLangText(LangConstants.TextType.AiDestination);
        this._btnActTagIdArray.setLangText(LangConstants.TextType.Tags);
        this._btnActForbiddenLocationIdArray.setLangText(LangConstants.TextType.NoEntryLocations);

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

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelActHp(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const act = this._getAction()?.getActHp();
        this._labelActHp.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
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
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
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
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
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
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
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
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
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
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
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
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
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
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActActionState(): void {
        const act = this._getAction()?.getActActionState();
        this._labelActActionState.setText(act == null
            ? ``
            : (LangUtils.getUnitActionStateText(act) ?? LangConstants.UndefinedError)
        );
    }

    private _updateLabelActIsCoOnboard(): void {
        const act = this._getAction()?.getActIsCoOnboard();
        this._labelActIsCoOnboard.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActIsDiving(): void {
        const act = this._getAction()?.getActIsDiving();
        this._labelActIsDiving.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActAiMode(): void {
        const act = this._getAction()?.getActAiMode();
        this._labelActAiMode.setText(act == null
            ? ``
            : (LangUtils.getUnitAiModeName(act) ?? LangConstants.UndefinedError)
        );
    }

    private _updateLabelActAiWeightedDestination(): void {
        const act = this._getAction()?.getActAiWeightedDestination();
        this._labelActAiWeightedDestination.setText(act == null
            ? ``
            : WeightedGridIndexesUtils.getDesc(act)
        );
    }

    private _updateLabelActTagIdArray(): void {
        const act = this._getAction()?.getActTagIdArray();
        this._labelActTagIdArray.setText(act == null
            ? ``
            : ArrayModifiersUtils.getDesc(act, LangUtils.getText(LangConstants.TextType.Tags))
        );
    }

    private _updateLabelActForbiddenLocationIdArray(): void {
        const act = this._getAction()?.getActForbiddenLocationIdArray();
        this._labelActForbiddenLocationIdArray.setText(act == null
            ? ``
            : ArrayModifiersUtils.getDesc(act, LangUtils.getText(LangConstants.TextType.NoEntryLocations))
        );
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetUnitStateSimple.WeaSetUnitStateSimple> {
        return this.getOpenData()?.action.getWeaSetUnitStateSimple();
    }
}
