import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getComparatorName, getTileBuffName, getTileBuffDesc, getTextForYesOrNo } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaAddTileBuffSimple } from "../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffSimple.ts";
import { AllBuffTypeIdArray, EndTimeModification } from "../../tileBuffs/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ComparatorId, AllComparatorIdArray } from "../../valueAndComparators/Constants.ts";
import { getBriefDesc } from "../../valueAndComparators/Utils.ts";
import { getErrorTipForAction, getDetailDescForAction } from "../../warEvents/actions/utils/Common.ts";

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

    private readonly _btnConPlayerFilter!                       : IUiButton;
    private readonly _labelConPlayerFilter!                     : IUiLabel;

    private readonly _btnConUnitFilter!                         : IUiButton;
    private readonly _labelConUnitFilter!                       : IUiLabel;

    private readonly _btnConUnitComparator!                     : IUiButton;
    private readonly _labelConUnitComparator!                   : IUiLabel;

    private readonly _btnConTileFilter!                         : IUiButton;
    private readonly _labelConTileFilter!                       : IUiLabel;

    private readonly _btnActBuffType!                           : IUiButton;
    private readonly _labelActBuffType!                         : IUiLabel;

    private readonly _btnActExtraParams!                        : IUiButton;
    private readonly _labelActExtraParams!                      : IUiLabel;

    private readonly _btnActEndTurnIndex!                       : IUiButton;
    private readonly _labelActEndTurnIndex!                     : IUiLabel;

    private readonly _btnActEndPlayerIndex!                     : IUiButton;
    private readonly _labelActEndPlayerIndex!                   : IUiLabel;

    private readonly _btnActIsRelativeEndTurnIndex!             : IUiButton;
    private readonly _labelActIsRelativeEndTurnIndex!           : IUiLabel;

    private readonly _btnActIsRelativeEndPlayerIndex!           : IUiButton;
    private readonly _labelActIsRelativeEndPlayerIndex!         : IUiLabel;

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

                if (filter != null) {
                    if (action.getConUnitComparator() == null) {
                        action.setConUnitComparator(ValueAndComparator.fromJson({
                            comparator  : ComparatorId.EqualTo,
                            value       : 0,
                        }));
                    }
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
                    currentValue    : oldCon?.getValue(),
                    minValue        : 0,
                    maxValue        : 10,
                    callback        : unitsCount => {
                        if (unitsCount == null) {
                            action.setConUnitComparator(null);
                            action.setConUnitFilter(null);
                            dispatch(TypeId.WarEventFullDataChanged);
                        } else {
                            if (oldCon != null) {
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

    private _onTouchedBtnActBuffType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActBuffType();
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.AbnormalStateTypeId),
            availableNumberArray    : AllBuffTypeIdArray,
            currentNumber           : act,
            getNumberMainText       : typeId => getTileBuffName(typeId) || UndefinedError,
            getNumberHelpText       : typeId => getTileBuffDesc(typeId) || UndefinedError,
            callbackOnConfirm       : newValue => {
                action.setActBuffType(newValue);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActExtraParams(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        // TODO
        showLang(TextType.B1456);
    }

    private _onTouchedBtnActEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActEndTurnIndex();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.EndTurnIndex),
            minValue        : EndTimeModification.MinEndTurnIndex,
            maxValue        : EndTimeModification.MaxEndTurnIndex,
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

                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActEndPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActEndPlayerIndex();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.EndPlayerIndex),
            minValue        : EndTimeModification.MinEndPlayerIndex,
            maxValue        : EndTimeModification.MaxEndPlayerIndex,
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

                dispatch(TypeId.WarEventFullDataChanged);
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

        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActIsRelativeEndPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        action.setActIsRelativeEndPlayerIndex(!action.getActIsRelativeEndPlayerIndex());
        action.setActEndTurnIndex(action.getActEndTurnIndex() ?? 0);
        action.setActEndPlayerIndex(action.getActEndPlayerIndex() ?? 0);

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

        this._btnActBuffType.setLangText(TextType.AbnormalStateTypeId);
        this._btnActExtraParams.setLangText(TextType.B1229);
        this._btnActEndTurnIndex.setLangText(TextType.EndTurnIndex);
        this._btnActEndPlayerIndex.setLangText(TextType.EndPlayerIndex);
        this._btnActIsRelativeEndTurnIndex.setLangText(TextType.B1017);
        this._btnActIsRelativeEndPlayerIndex.setLangText(TextType.B1017);

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
        const errorTip          = getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDetailDescForAction(action, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConPlayerFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConPlayerFilter.setText(action.getConPlayerFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConUnitFilter.setText(action.getConUnitFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConUnitComparator(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const comparator = action.getConUnitComparator();
        this._labelConUnitComparator.setText(comparator == null ? `` : getBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConTileFilter.setText(action.getConTileFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelActBuffType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelActBuffType.setText(getTileBuffName(action.getActBuffType() ?? 0) || ``);
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
                : getTextForYesOrNo(action.getActIsRelativeEndTurnIndex())
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
                : getTextForYesOrNo(action.getActIsRelativeEndPlayerIndex())
        );
    }

    private _getAction(): Undefinable<WeaAddTileBuffSimple> {
        return this.getOpenData()?.action.getWeaAddTileBuffSimple();
    }
}
