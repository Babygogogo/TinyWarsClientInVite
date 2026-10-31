import {
    Graphics_Constants,
    Notifications_Dispatcher,
    Lang_Utils,
    ForceSkins_Utils,
    GamePanels_Dict,
    GamePanels_Manager,
    Players_Constants,
    Lang_Constants,
    Ui_Components_UiPanel,
    Ui_Components_UiTileView,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type AuxiliaryTypes_AuxiliaryTypes,
    ValueAndComparators_Constants,
    ValueAndComparators_Utils,
    WarEvents_Actions_Utils_Common,
} from "../../internal.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetTileTypeSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeSimple.ts";

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

    private readonly _btnConUnitComparator!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitComparator!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConTileFilter!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelTileBase!                            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnChangeTileBase!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _conTileBase!                              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClearTileBase!                         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelTileDecoration!                      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnChangeTileDecoration!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _conTileDecoration!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClearTileDecoration!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnActDeleteTileDecoration!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDeleteTileDecoration!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelTileObject!                          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnChangeTileObject!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _conTileObject!                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClearTileObject!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnActDeleteTileObject!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDeleteTileObject!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _tileView                                  = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnType,                                callback : this._onTouchedBtnType },
            { ui : this._btnClose,                               callback : this.closePanel },

            { ui : this._btnConPlayerFilter,                     callback : this._onTouchedBtnConPlayerFilter },
            { ui : this._btnConUnitFilter,                       callback : this._onTouchedBtnConUnitFilter },
            { ui : this._btnConUnitComparator,                   callback : this._onTouchedBtnConUnitComparator },
            { ui : this._btnConTileFilter,                       callback : this._onTouchedBtnConTileFilter },

            { ui : this._btnChangeTileBase,                      callback : this._onTouchedBtnChangeTileBase },
            { ui : this._btnClearTileBase,                       callback : this._onTouchedBtnClearTileBase },

            { ui : this._btnChangeTileDecoration,                callback : this._onTouchedBtnChangeTileDecoration },
            { ui : this._btnClearTileDecoration,                 callback : this._onTouchedBtnClearTileDecoration },
            { ui : this._btnActDeleteTileDecoration,             callback : this._onTouchedBtnActDeleteTileDecoration },

            { ui : this._btnChangeTileObject,                    callback : this._onTouchedBtnChangeTileObject },
            { ui : this._btnClearTileObject,                     callback : this._onTouchedBtnClearTileObject },
            { ui : this._btnActDeleteTileObject,                 callback : this._onTouchedBtnActDeleteTileObject },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",         callback : this._onNotifyWarEventFullDataChanged },
            { type : "TileAnimationTick",               callback : this._onNotifyTileAnimationTick },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        const tileView = this._tileView;
        this._conTileBase.addUiChild(tileView.getImgBase());
        this._conTileObject.addUiChild(tileView.getImgObject());
        this._conTileDecoration.addUiChild(tileView.getImgDecoration());
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

    private _onNotifyTileAnimationTick(): void {
        this._updateTileView();
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
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnChangeTileBase(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseTileBasePanel, {
            gameConfig : war.getGcData(),
            callback   : (baseType, baseShapeId) => {
                action.setActTileBaseType(baseType);
                action.setActTileBaseShapeId(baseShapeId);
                action.setActChangeTileBase(true);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnClearTileBase(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        action.setActTileBaseType(null);
        action.setActTileBaseShapeId(null);
        action.setActChangeTileBase(null);
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _onTouchedBtnChangeTileDecoration(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseTileDecorationPanel, {
            gameConfig : war.getGcData(),
            callback   : (decorationType, decorationShapeId) => {
                action.setActTileDecorationType(decorationType);
                action.setActTileDecorationShapeId(decorationShapeId);
                action.setActChangeTileDecoration(true);
                action.setActDeleteTileDecoration(null);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnClearTileDecoration(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        action.setActTileDecorationType(null);
        action.setActTileDecorationShapeId(null);
        action.setActChangeTileDecoration(null);
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnActDeleteTileDecoration(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        if (action.getActDeleteTileDecoration()) {
            action.setActDeleteTileDecoration(null);
        } else {
            action.setActTileDecorationType(null);
            action.setActTileDecorationShapeId(null);
            action.setActChangeTileDecoration(null);
            action.setActDeleteTileDecoration(true);
        }

        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _onTouchedBtnChangeTileObject(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseTileObjectPanel, {
            gameConfig              : war.getGcData(),
            finalSkinIdArray        : [ForceSkins_Utils.getDefaultSkinId(Players_Constants.PlayerIndex.Neutral)],
            showNeutralHeadquarters : true,
            callback                : (objectType, objectShapeId) => {
                action.setActTileObjectType(objectType);
                action.setActTileObjectShapeId(objectShapeId);
                action.setActChangeTileObject(true);
                action.setActDeleteTileObject(null);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnClearTileObject(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        action.setActTileObjectType(null);
        action.setActTileObjectShapeId(null);
        action.setActChangeTileObject(null);
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnActDeleteTileObject(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        if (action.getActDeleteTileObject()) {
            action.setActDeleteTileObject(null);
        } else {
            action.setActTileObjectType(null);
            action.setActTileObjectShapeId(null);
            action.setActChangeTileObject(null);
            action.setActDeleteTileObject(true);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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

        this._labelTileBase.setLangText(Lang_Constants.TextType.TileBase);
        this._btnChangeTileBase.setLangText(Lang_Constants.TextType.B1388);
        this._labelTileDecoration.setLangText(Lang_Constants.TextType.TileDecoration);
        this._btnChangeTileDecoration.setLangText(Lang_Constants.TextType.B1388);
        this._btnActDeleteTileDecoration.setLangText(Lang_Constants.TextType.B0220);
        this._labelTileObject.setLangText(Lang_Constants.TextType.TileObject);
        this._btnChangeTileObject.setLangText(Lang_Constants.TextType.B1388);
        this._btnActDeleteTileObject.setLangText(Lang_Constants.TextType.B0220);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();

        this._updateLabelActDeleteTileDecoration();
        this._updateLabelActDeleteTileObject();

        this._updateTileView();
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

    private _updateLabelActDeleteTileDecoration(): void {
        this._labelActDeleteTileDecoration.setText(this._getAction()?.getActDeleteTileDecoration()
            ? Lang_Utils.getText(Lang_Constants.TextType.Yes)
            : ``,
        );
    }

    private _updateLabelActDeleteTileObject(): void {
        this._labelActDeleteTileObject.setText(this._getAction()?.getActDeleteTileObject()
            ? Lang_Utils.getText(Lang_Constants.TextType.Yes)
            : ``,
        );
    }

    private _updateTileView(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const tileView  = this._tileView;
        tileView.init({
            tileBaseType          : action.getActTileBaseType(),
            tileBaseShapeId       : action.getActTileBaseShapeId(),
            tileObjectType        : action.getActTileObjectType(),
            tileObjectShapeId     : action.getActTileObjectShapeId(),
            tileDecorationType    : action.getActTileDecorationType(),
            tileDecorationShapeId : action.getActTileDecorationShapeId(),
            skinId                : ForceSkins_Utils.getDefaultSkinId(Players_Constants.PlayerIndex.Neutral),
            overridingSkinId      : undefined,
            gameConfig            : war.getGcData(),
        });
        tileView.updateView();
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileTypeSimple> {
        return this.getOpenData()?.action.getWeaSetTileTypeSimple();
    }
}
