import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetTileTypeSimple from "../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeSimple.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

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

    private readonly _labelTileBase!                            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnChangeTileBase!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _conTileBase!                              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClearTileBase!                         : UiInterfacesIUiButton.IUiButton;

    private readonly _labelTileDecoration!                      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnChangeTileDecoration!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _conTileDecoration!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClearTileDecoration!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnActDeleteTileDecoration!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDeleteTileDecoration!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelTileObject!                          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnChangeTileObject!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _conTileObject!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClearTileObject!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnActDeleteTileObject!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDeleteTileObject!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _tileView                                  = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },

            { ui: this._btnChangeTileBase,                      callback: this._onTouchedBtnChangeTileBase },
            { ui: this._btnClearTileBase,                       callback: this._onTouchedBtnClearTileBase },

            { ui: this._btnChangeTileDecoration,                callback: this._onTouchedBtnChangeTileDecoration },
            { ui: this._btnClearTileDecoration,                 callback: this._onTouchedBtnClearTileDecoration },
            { ui: this._btnActDeleteTileDecoration,             callback: this._onTouchedBtnActDeleteTileDecoration },

            { ui: this._btnChangeTileObject,                    callback: this._onTouchedBtnChangeTileObject },
            { ui: this._btnClearTileObject,                     callback: this._onTouchedBtnClearTileObject },
            { ui: this._btnActDeleteTileObject,                 callback: this._onTouchedBtnActDeleteTileObject },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
            { type: NotificationsTypeId.TypeId.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
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

    private _onTouchedBtnChangeTileBase(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseTileBasePanel, {
            gameConfig  : war.getGcData(),
            callback    : (baseType, baseShapeId) => {
                action.setActTileBaseType(baseType);
                action.setActTileBaseShapeId(baseShapeId);
                action.setActChangeTileBase(true);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseTileDecorationPanel, {
            gameConfig  : war.getGcData(),
            callback    : (decorationType, decorationShapeId) => {
                action.setActTileDecorationType(decorationType);
                action.setActTileDecorationShapeId(decorationShapeId);
                action.setActChangeTileDecoration(true);
                action.setActDeleteTileDecoration(null);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseTileObjectPanel, {
            gameConfig              : war.getGcData(),
            finalSkinIdArray        : [ForceSkinsUtils.getDefaultSkinId(PlayersConstants.PlayerIndex.Neutral)],
            showNeutralHeadquarters : true,
            callback                : (objectType, objectShapeId) => {
                action.setActTileObjectType(objectType);
                action.setActTileObjectShapeId(objectShapeId);
                action.setActChangeTileObject(true);
                action.setActDeleteTileObject(null);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        this._labelTileBase.setLangText(LangConstants.TextType.TileBase);
        this._btnChangeTileBase.setLangText(LangConstants.TextType.B1388);
        this._labelTileDecoration.setLangText(LangConstants.TextType.TileDecoration);
        this._btnChangeTileDecoration.setLangText(LangConstants.TextType.B1388);
        this._btnActDeleteTileDecoration.setLangText(LangConstants.TextType.B0220);
        this._labelTileObject.setLangText(LangConstants.TextType.TileObject);
        this._btnChangeTileObject.setLangText(LangConstants.TextType.B1388);
        this._btnActDeleteTileObject.setLangText(LangConstants.TextType.B0220);

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

    private _updateLabelActDeleteTileDecoration(): void {
        this._labelActDeleteTileDecoration.setText(this._getAction()?.getActDeleteTileDecoration()
            ? LangUtils.getText(LangConstants.TextType.Yes)
            : ``
        );
    }

    private _updateLabelActDeleteTileObject(): void {
        this._labelActDeleteTileObject.setText(this._getAction()?.getActDeleteTileObject()
            ? LangUtils.getText(LangConstants.TextType.Yes)
            : ``
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
            tileBaseType            : action.getActTileBaseType(),
            tileBaseShapeId         : action.getActTileBaseShapeId(),
            tileObjectType          : action.getActTileObjectType(),
            tileObjectShapeId       : action.getActTileObjectShapeId(),
            tileDecorationType      : action.getActTileDecorationType(),
            tileDecorationShapeId   : action.getActTileDecorationShapeId(),
            skinId                  : ForceSkinsUtils.getDefaultSkinId(PlayersConstants.PlayerIndex.Neutral),
            overridingSkinId        : undefined,
            gameConfig              : war.getGcData(),
        });
        tileView.updateView();
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetTileTypeSimple.WeaSetTileTypeSimple> {
        return this.getOpenData()?.action.getWeaSetTileTypeSimple();
    }
}
