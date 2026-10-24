import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaAddTileBuffSimple from "../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffSimple.ts";
import * as TileBuffsConstants from "../../tileBuffs/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
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

    private readonly _btnActBuffType!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActBuffType!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActExtraParams!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActExtraParams!                      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActEndTurnIndex!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActEndTurnIndex!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActEndPlayerIndex!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActEndPlayerIndex!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActIsRelativeEndTurnIndex!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsRelativeEndTurnIndex!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActIsRelativeEndPlayerIndex!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsRelativeEndPlayerIndex!         : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },

            { ui: this._btnActBuffType,                         callback: this._onTouchedBtnActBuffType },
            { ui: this._btnActExtraParams,                      callback: this._onTouchedBtnActExtraParams },
            { ui: this._btnActEndTurnIndex,                     callback: this._onTouchedBtnActEndTurnIndex },
            { ui: this._btnActEndPlayerIndex,                   callback: this._onTouchedBtnActEndPlayerIndex },
            { ui: this._btnActIsRelativeEndTurnIndex,           callback: this._onTouchedBtnActIsRelativeEndTurnIndex },
            { ui: this._btnActIsRelativeEndPlayerIndex,         callback: this._onTouchedBtnActIsRelativeEndPlayerIndex },
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

                if (filter != null) {
                    if (action.getConUnitComparator() == null) {
                        action.setConUnitComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                            comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
                            value       : 0,
                        }));
                    }
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
                    currentValue    : oldCon?.getValue(),
                    minValue        : 0,
                    maxValue        : 10,
                    callback        : unitsCount => {
                        if (unitsCount == null) {
                            action.setConUnitComparator(null);
                            action.setConUnitFilter(null);
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                        } else {
                            if (oldCon != null) {
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

    private _onTouchedBtnActBuffType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActBuffType();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId),
            availableNumberArray    : TileBuffsConstants.AllBuffTypeIdArray,
            currentNumber           : act,
            getNumberMainText       : typeId => LangUtils.getTileBuffName(typeId) || LangConstants.UndefinedError,
            getNumberHelpText       : typeId => LangUtils.getTileBuffDesc(typeId) || LangConstants.UndefinedError,
            callbackOnConfirm       : newValue => {
                action.setActBuffType(newValue);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActExtraParams(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        // TODO
        FloatText2.showLang(LangConstants.TextType.B1456);
    }

    private _onTouchedBtnActEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActEndTurnIndex();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.EndTurnIndex),
            minValue        : TileBuffsConstants.EndTimeModification.MinEndTurnIndex,
            maxValue        : TileBuffsConstants.EndTimeModification.MaxEndTurnIndex,
            currentValue    : oldValue,
            callback        : newValue => {
                action.setActEndTurnIndex(newValue);

                const isEmpty = newValue == null;
                if (isEmpty !== (oldValue == null)) {
                    action.setActEndPlayerIndex(
                        isEmpty ? null : (action.getActEndPlayerIndex() ?? 0),
                    );
                    if (isEmpty) {
                        action.setActIsRelativeEndTurnIndex(false);
                        action.setActIsRelativeEndPlayerIndex(false);
                    }
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActEndPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActEndPlayerIndex();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.EndPlayerIndex),
            minValue        : TileBuffsConstants.EndTimeModification.MinEndPlayerIndex,
            maxValue        : TileBuffsConstants.EndTimeModification.MaxEndPlayerIndex,
            currentValue    : oldValue,
            callback        : newValue => {
                action.setActEndPlayerIndex(newValue);

                const isEmpty = newValue == null;
                if (isEmpty !== (oldValue == null)) {
                    action.setActEndTurnIndex(
                        newValue == null ? null : (action.getActEndTurnIndex() ?? 0)
                    );
                    if (isEmpty) {
                        action.setActIsRelativeEndTurnIndex(false);
                        action.setActIsRelativeEndPlayerIndex(false);
                    }
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActIsRelativeEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        action.setActIsRelativeEndTurnIndex(!action.getActIsRelativeEndTurnIndex());
        action.setActEndTurnIndex(action.getActEndTurnIndex() ?? 0);
        action.setActEndPlayerIndex(action.getActEndPlayerIndex() ?? 0);

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActIsRelativeEndPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        action.setActIsRelativeEndPlayerIndex(!action.getActIsRelativeEndPlayerIndex());
        action.setActEndTurnIndex(action.getActEndTurnIndex() ?? 0);
        action.setActEndPlayerIndex(action.getActEndPlayerIndex() ?? 0);

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

        this._btnActBuffType.setLangText(LangConstants.TextType.AbnormalStateTypeId);
        this._btnActExtraParams.setLangText(LangConstants.TextType.B1229);
        this._btnActEndTurnIndex.setLangText(LangConstants.TextType.EndTurnIndex);
        this._btnActEndPlayerIndex.setLangText(LangConstants.TextType.EndPlayerIndex);
        this._btnActIsRelativeEndTurnIndex.setLangText(LangConstants.TextType.B1017);
        this._btnActIsRelativeEndPlayerIndex.setLangText(LangConstants.TextType.B1017);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();

        this._updateLabelActBuffType();
        this._updateLabelActExtraParams();
        this._updateLabelActEndTurnIndex();
        this._updateLabelActEndPlayerIndex();
        this._updateLabelActIsRelativeEndTurnIndex();
        this._updateLabelActIsRelativeEndPlayerIndex();
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
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConPlayerFilter.setText(action.getConPlayerFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConUnitFilter.setText(action.getConUnitFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelConUnitComparator(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const comparator = action.getConUnitComparator();
        this._labelConUnitComparator.setText(comparator == null ? `` : ValueAndComparatorsUtils.getBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConTileFilter.setText(action.getConTileFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelActBuffType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelActBuffType.setText(LangUtils.getTileBuffName(action.getActBuffType() ?? 0) || ``);
    }

    private _updateLabelActExtraParams(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelActExtraParams.setText(action.getActExtraParams()?.join(`, `) || ``);
    }

    private _updateLabelActEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActEndTurnIndex();
        this._labelActEndTurnIndex.setText(act == null ? `` : `${act}`);
    }

    private _updateLabelActEndPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActEndPlayerIndex();
        this._labelActEndPlayerIndex.setText(act == null ? `` : `${act}`);
    }

    private _updateLabelActIsRelativeEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelActIsRelativeEndTurnIndex.setText(
            action.getActEndTurnIndex() == null
                ? ``
                : LangUtils.getTextForYesOrNo(action.getActIsRelativeEndTurnIndex())
        );
    }

    private _updateLabelActIsRelativeEndPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelActIsRelativeEndPlayerIndex.setText(
            action.getActEndPlayerIndex() == null
                ? ``
                : LangUtils.getTextForYesOrNo(action.getActIsRelativeEndPlayerIndex())
        );
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaAddTileBuffSimple.WeaAddTileBuffSimple> {
        return this.getOpenData()?.action.getWeaAddTileBuffSimple();
    }
}
