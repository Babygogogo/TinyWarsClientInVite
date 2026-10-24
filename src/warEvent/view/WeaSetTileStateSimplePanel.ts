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
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetTileStateSimple from "../../proto/schema/CommonProto/WarEvent/WeaSetTileStateSimple.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
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

    private readonly _btnConPlayerFilter!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitComparator!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitComparator!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConTileFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCurrentHp!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCurrentHp!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCurrentBuildPoint!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCurrentBuildPoint!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCurrentCapturePoint!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCurrentCapturePoint!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActPlayerIndex!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActPlayerIndex!                      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActIsHighlighted!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsHighlighted!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActLocationIdArray!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActLocationIdArray!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCustomNameId!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCustomNameId!                     : UiInterfacesIUiLabel.IUiLabel;

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
                                    value       : unitsCount,
                                    comparator  : sign,
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

    private _onTouchedBtnActCurrentHp(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCurrentHp();
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
                        action.setActCurrentHp(null);
                    } else {
                        action.setActCurrentHp(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActCurrentBuildPoint(null);
                    } else {
                        action.setActCurrentBuildPoint(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActCurrentCapturePoint(null);
                    } else {
                        action.setActCurrentCapturePoint(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                        action.setActPlayerIndex(null);
                    } else {
                        action.setActPlayerIndex(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActLocationIdArray(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1425),
            availableIntegerArray   : LocationsConstants.AllLocationIdArray,
            currentIntegerArray     : action.getActLocationIdArray()?.getAddIntArray() ?? [],
            callbackOnConfirm       : addIntArray => {
                const remainingValueArray = LocationsConstants.AllLocationIdArray.filter(v => !addIntArray.includes(v));
                if (!remainingValueArray.length) {
                    action.setActLocationIdArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
                        addIntArray     : addIntArray,
                        deleteIntArray  : [],
                    }));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1426),
                        availableIntegerArray   : remainingValueArray,
                        currentIntegerArray     : action.getActLocationIdArray()?.getDeleteIntArray() ?? [],
                        callbackOnConfirm       : deleteIntArray => {
                            if ((!addIntArray.length) && (!deleteIntArray.length)) {
                                action.setActLocationIdArray(null);
                            } else {
                                action.setActLocationIdArray(ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier.fromJson({
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

    private _onTouchedBtnActCustomNameId(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCustomNameId();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle           : () => LangUtils.getText(LangConstants.TextType.Offset),
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

        this._btnActCurrentHp.setLangText(LangConstants.TextType.Hp);
        this._btnActCurrentBuildPoint.setLangText(LangConstants.TextType.BuildPoint);
        this._btnActCurrentCapturePoint.setLangText(LangConstants.TextType.CapturePoint);
        this._btnActPlayerIndex.setLangText(LangConstants.TextType.PlayerIndex);
        this._btnActIsHighlighted.setLangText(LangConstants.TextType.IsHighlighted);
        this._btnActLocationIdArray.setLangText(LangConstants.TextType.Location);
        this._btnActCustomNameId.setLangText(LangConstants.TextType.CustomNameId);

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

    private _updateLabelActCurrentHp(): void {
        const act = this._getAction()?.getActCurrentHp();
        this._labelActCurrentHp.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActCurrentBuildPoint(): void {
        const act = this._getAction()?.getActCurrentBuildPoint();
        this._labelActCurrentBuildPoint.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActCurrentCapturePoint(): void {
        const act = this._getAction()?.getActCurrentCapturePoint();
        this._labelActCurrentCapturePoint.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActPromotion(): void {
        const act = this._getAction()?.getActPlayerIndex();
        this._labelActPlayerIndex.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActIsHighlighted(): void {
        const act = this._getAction()?.getActIsHighlighted();
        this._labelActIsHighlighted.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActLocationIdArray(): void {
        const act = this._getAction()?.getActLocationIdArray();
        this._labelActLocationIdArray.setText(act == null
            ? ``
            : ArrayModifiersUtils.getDesc(act, LangUtils.getText(LangConstants.TextType.NoEntryLocations))
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

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetTileStateSimple.WeaSetTileStateSimple> {
        return this.getOpenData()?.action.getWeaSetTileStateSimple();
    }
}
