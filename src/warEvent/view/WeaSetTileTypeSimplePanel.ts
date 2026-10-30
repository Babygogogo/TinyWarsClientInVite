import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDefaultSkinId } from "../../forceSkins/Utils.ts";
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
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetTileTypeSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeSimple.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getUiTileViewClass } from "../../ui/utils/UiFactory.ts";
import {
    ComparatorId,
    AllComparatorIdArray,
} from "../../valueAndComparators/Constants.ts";
import { getBriefDesc } from "../../valueAndComparators/Utils.ts";
import {
    getErrorTipForAction,
    getDetailDescForAction,
} from "../../warEvents/actions/utils/Common.ts";

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

    private readonly _labelTileBase!                            : IUiLabel;
    private readonly _btnChangeTileBase!                        : IUiButton;
    private readonly _conTileBase!                              : IUiContainer;
    private readonly _btnClearTileBase!                         : IUiButton;

    private readonly _labelTileDecoration!                      : IUiLabel;
    private readonly _btnChangeTileDecoration!                  : IUiButton;
    private readonly _conTileDecoration!                        : IUiContainer;
    private readonly _btnClearTileDecoration!                   : IUiButton;
    private readonly _btnActDeleteTileDecoration!               : IUiButton;
    private readonly _labelActDeleteTileDecoration!             : IUiLabel;

    private readonly _labelTileObject!                          : IUiLabel;
    private readonly _btnChangeTileObject!                      : IUiButton;
    private readonly _conTileObject!                            : IUiContainer;
    private readonly _btnClearTileObject!                       : IUiButton;
    private readonly _btnActDeleteTileObject!                   : IUiButton;
    private readonly _labelActDeleteTileObject!                 : IUiLabel;

    private readonly _tileView                                  = new (getUiTileViewClass())();

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
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
            { type: TypeId.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
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

    private _onTouchedBtnChangeTileBase(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonChooseTileBasePanel, {
            gameConfig  : war.getGcData(),
            callback    : (baseType, baseShapeId) => {
                action.setActTileBaseType(baseType);
                action.setActTileBaseShapeId(baseShapeId);
                action.setActChangeTileBase(true);
                dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
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

        openPanel(getDict().CommonChooseTileDecorationPanel, {
            gameConfig  : war.getGcData(),
            callback    : (decorationType, decorationShapeId) => {
                action.setActTileDecorationType(decorationType);
                action.setActTileDecorationShapeId(decorationShapeId);
                action.setActChangeTileDecoration(true);
                action.setActDeleteTileDecoration(null);
                dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
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

        dispatch(TypeId.WarEventFullDataChanged);
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

        openPanel(getDict().CommonChooseTileObjectPanel, {
            gameConfig              : war.getGcData(),
            finalSkinIdArray        : [getDefaultSkinId(PlayerIndex.Neutral)],
            showNeutralHeadquarters : true,
            callback                : (objectType, objectShapeId) => {
                action.setActTileObjectType(objectType);
                action.setActTileObjectShapeId(objectShapeId);
                action.setActChangeTileObject(true);
                action.setActDeleteTileObject(null);
                dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
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

        this._labelTileBase.setLangText(TextType.TileBase);
        this._btnChangeTileBase.setLangText(TextType.B1388);
        this._labelTileDecoration.setLangText(TextType.TileDecoration);
        this._btnChangeTileDecoration.setLangText(TextType.B1388);
        this._btnActDeleteTileDecoration.setLangText(TextType.B0220);
        this._labelTileObject.setLangText(TextType.TileObject);
        this._btnChangeTileObject.setLangText(TextType.B1388);
        this._btnActDeleteTileObject.setLangText(TextType.B0220);

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
        this._labelConUnitComparator.setText(comparator == null ? `` : getBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelActDeleteTileDecoration(): void {
        this._labelActDeleteTileDecoration.setText(this._getAction()?.getActDeleteTileDecoration()
            ? getText(TextType.Yes)
            : ``
        );
    }

    private _updateLabelActDeleteTileObject(): void {
        this._labelActDeleteTileObject.setText(this._getAction()?.getActDeleteTileObject()
            ? getText(TextType.Yes)
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
            skinId                  : getDefaultSkinId(PlayerIndex.Neutral),
            overridingSkinId        : undefined,
            gameConfig              : war.getGcData(),
        });
        tileView.updateView();
    }

    private _getAction(): Undefinable<WeaSetTileTypeSimple> {
        return this.getOpenData()?.action.getWeaSetTileTypeSimple();
    }
}
