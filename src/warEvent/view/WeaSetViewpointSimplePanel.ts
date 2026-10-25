import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getComparatorName, getTextForYesOrNo } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetViewpointSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetViewpointSimple.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ComparatorId, AllComparatorIdArray } from "../../valueAndComparators/Constants.ts";
import { getBriefDesc } from "../../valueAndComparators/Utils.ts";
import { Common } from "../../warEvents/actions/constants/SetViewpointSimple.ts";
import { getErrorTipForAction, getDetailDescForAction } from "../../warEvents/actions/utils/Common.ts";

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

    private readonly _btnActNeedFocusEffect!                    : IUiButton;
    private readonly _labelActNeedFocusEffect!                  : IUiLabel;

    private readonly _btnActIsOneByOne!                         : IUiButton;
    private readonly _labelActIsOneByOne!                       : IUiLabel;

    private readonly _btnActInterval!                           : IUiButton;
    private readonly _labelActInterval!                         : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },

            { ui: this._btnActNeedFocusEffect,                  callback: this._onTouchedBtnActNeedFocusEffect },
            { ui: this._btnActIsOneByOne,                       callback: this._onTouchedBtnActIsOneByOne },
            { ui: this._btnActInterval,                         callback: this._onTouchedBtnActInterval },
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

                if ((filter != null) && (action.getConUnitComparator() == null)) {
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

    private _onTouchedBtnActNeedFocusEffect(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        if (action.getActNeedFocusEffect()) {
            action.setActNeedFocusEffect(null);
        } else {
            action.setActNeedFocusEffect(true);
        }
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActIsOneByOne(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        if (action.getActIsOneByOne()) {
            action.setActIsOneByOne(null);
        } else {
            action.setActIsOneByOne(true);
        }
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActInterval(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.B1035),
            minValue        : Common.MinInterval,
            maxValue        : Common.MaxInterval,
            currentValue    : action.getActInterval() ?? Common.DefaultInterval,
            callback        : interval => {
                if (interval === Common.DefaultInterval) {
                    action.setActInterval(null);
                } else {
                    action.setActInterval(interval);
                }
                dispatch(TypeId.WarEventFullDataChanged);
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
        this._btnConUnitComparator.setLangText(TextType.Comparator);
        this._btnConTileFilter.setLangText(TextType.TileFilter);

        this._btnActNeedFocusEffect.setLangText(TextType.B0714);
        this._btnActIsOneByOne.setLangText(TextType.B1184);
        this._btnActInterval.setLangText(TextType.B1035);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();

        this._updateLabelActNeedFocusEffect();
        this._updateLabelActIsOneByOne();
        this._updateLabelActInterval();
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

    private _updateLabelActNeedFocusEffect(): void {
        this._labelActNeedFocusEffect.setText(getTextForYesOrNo(this._getAction()?.getActNeedFocusEffect()));
    }

    private _updateLabelActIsOneByOne(): void {
        this._labelActIsOneByOne.setText(getTextForYesOrNo(this._getAction()?.getActIsOneByOne()));
    }

    private _updateLabelActInterval(): void {
        this._labelActInterval.setText(`${this._getAction()?.getActInterval() ?? Common.DefaultInterval}`);
    }

    private _getAction(): Undefinable<WeaSetViewpointSimple> {
        return this.getOpenData()?.action.getWeaSetViewpointSimple();
    }
}
