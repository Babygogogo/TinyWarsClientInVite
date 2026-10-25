import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getUnitBuffName, getUnitBuffDesc, getBuffEndTimeModificationModeName } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaModifyUnitBuffSimple } from "../../proto/schema/CommonProto/WarEvent/WeaModifyUnitBuffSimple.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { AllBuffTypeIdArray, EndTimeModification } from "../../unitBuffs/Constants.ts";
import { BuffEndTimeModificationMode, AllBuffEndTimeModificationModeArray } from "../../warEvents/actions/constants/Common.ts";
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

    private readonly _btnConTileFilter!                         : IUiButton;
    private readonly _labelConTileFilter!                       : IUiLabel;

    private readonly _btnConUnitBuffFilter!                     : IUiButton;
    private readonly _labelConUnitBuffFilter!                   : IUiLabel;

    private readonly _btnActBuffType!                           : IUiButton;
    private readonly _labelActBuffType!                         : IUiLabel;

    private readonly _btnActEndTurnIndex!                       : IUiButton;
    private readonly _labelActEndTurnIndex!                     : IUiLabel;

    private readonly _btnActEndPlayerIndex!                     : IUiButton;
    private readonly _labelActEndPlayerIndex!                   : IUiLabel;

    private readonly _btnActEndTurnIndexMode!                   : IUiButton;
    private readonly _labelActEndTurnIndexMode!                 : IUiLabel;

    private readonly _btnActEndPlayerIndexMode!                 : IUiButton;
    private readonly _labelActEndPlayerIndexMode!               : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },
            { ui: this._btnConUnitBuffFilter,                   callback: this._onTouchedBtnConUnitBuffFilter },

            { ui: this._btnActBuffType,                         callback: this._onTouchedBtnActBuffType },
            { ui: this._btnActEndTurnIndex,                     callback: this._onTouchedBtnActEndTurnIndex },
            { ui: this._btnActEndPlayerIndex,                   callback: this._onTouchedBtnActEndPlayerIndex },
            { ui: this._btnActEndTurnIndexMode,                 callback: this._onTouchedBtnActEndTurnIndexMode },
            { ui: this._btnActEndPlayerIndexMode,               callback: this._onTouchedBtnActEndPlayerIndexMode },
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

    private _onTouchedBtnConUnitBuffFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().WeUnitBuffFilterPanel, {
            currentFilter   : action.getConUnitBuffFilter(),
            callback        : filter => {
                action.setConUnitBuffFilter(filter);
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
            availableNumberArray    : [-1, ...AllBuffTypeIdArray],
            currentNumber           : act,
            getNumberMainText       : typeId => typeId == -1 ? getText(TextType.None) : (getUnitBuffName(typeId) || UndefinedError),
            getNumberHelpText       : typeId => typeId == -1 ? getText(TextType.None) : getUnitBuffDesc(typeId) || UndefinedError,
            callbackOnConfirm       : newValue => {
                action.setActBuffType(newValue == -1 ? null : newValue);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.EndTurnIndex),
            minValue        : EndTimeModification.MinEndTurnIndex,
            maxValue        : EndTimeModification.MaxEndTurnIndex,
            currentValue    : action.getActEndTurnIndex(),
            callback        : newValue => {
                action.setActEndTurnIndex(newValue);

                const mode = action.getActEndTurnIndexMode();
                if (newValue == null) {
                    if ((mode !== BuffEndTimeModificationMode.DoNotChange) && (mode !== BuffEndTimeModificationMode.Delete)) {
                        action.setActEndPlayerIndex(null);
                        action.setActEndTurnIndexMode(BuffEndTimeModificationMode.DoNotChange);
                        action.setActEndPlayerIndexMode(BuffEndTimeModificationMode.DoNotChange);
                    }
                } else {
                    if ((mode === BuffEndTimeModificationMode.DoNotChange) || (mode === BuffEndTimeModificationMode.Delete)) {
                        action.setActEndPlayerIndex(0);
                        action.setActEndTurnIndexMode(BuffEndTimeModificationMode.SetAbsoluteValue);
                        action.setActEndPlayerIndexMode(BuffEndTimeModificationMode.SetAbsoluteValue);
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

        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.EndPlayerIndex),
            minValue        : EndTimeModification.MinEndPlayerIndex,
            maxValue        : EndTimeModification.MaxEndPlayerIndex,
            currentValue    : action.getActEndPlayerIndex(),
            callback        : newValue => {
                action.setActEndPlayerIndex(newValue);

                const mode = action.getActEndPlayerIndexMode();
                if (newValue == null) {
                    if ((mode !== BuffEndTimeModificationMode.DoNotChange) && (mode !== BuffEndTimeModificationMode.Delete)) {
                        action.setActEndTurnIndex(null);
                        action.setActEndTurnIndexMode(BuffEndTimeModificationMode.DoNotChange);
                        action.setActEndPlayerIndexMode(BuffEndTimeModificationMode.DoNotChange);
                    }
                } else {
                    if ((mode === BuffEndTimeModificationMode.DoNotChange) || (mode === BuffEndTimeModificationMode.Delete)) {
                        action.setActEndTurnIndex(0);
                        action.setActEndTurnIndexMode(BuffEndTimeModificationMode.SetAbsoluteValue);
                        action.setActEndPlayerIndexMode(BuffEndTimeModificationMode.SetAbsoluteValue);
                    }
                }

                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActEndTurnIndexMode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B0280),
            availableNumberArray    : AllBuffEndTimeModificationModeArray,
            getNumberMainText       : mode => getBuffEndTimeModificationModeName(mode) || UndefinedError,
            currentNumber           : action.getActEndTurnIndexMode(),
            callbackOnConfirm       : newMode => {
                action.setActEndTurnIndexMode(newMode);

                if ((newMode === BuffEndTimeModificationMode.DoNotChange) || (newMode === BuffEndTimeModificationMode.Delete)) {
                    action.setActEndTurnIndex(null);

                    if (newMode === BuffEndTimeModificationMode.Delete) {
                        action.setActEndPlayerIndex(null);
                        action.setActEndPlayerIndexMode(BuffEndTimeModificationMode.Delete);
                    } else {
                        if (action.getActEndPlayerIndexMode() === BuffEndTimeModificationMode.Delete) {
                            action.setActEndPlayerIndex(null);
                            action.setActEndPlayerIndexMode(BuffEndTimeModificationMode.DoNotChange);
                        }
                    }

                } else {
                    action.setActEndTurnIndex(action.getActEndTurnIndex() ?? 0);

                    if (action.getActEndPlayerIndexMode() === BuffEndTimeModificationMode.Delete) {
                        action.setActEndPlayerIndex(null);
                        action.setActEndPlayerIndexMode(BuffEndTimeModificationMode.DoNotChange);
                    }
                }

                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActEndPlayerIndexMode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B0280),
            availableNumberArray    : AllBuffEndTimeModificationModeArray,
            getNumberMainText       : mode => getBuffEndTimeModificationModeName(mode) || UndefinedError,
            currentNumber           : action.getActEndPlayerIndexMode(),
            callbackOnConfirm       : newMode => {
                action.setActEndPlayerIndexMode(newMode);

                if ((newMode === BuffEndTimeModificationMode.DoNotChange) || (newMode === BuffEndTimeModificationMode.Delete)) {
                    action.setActEndPlayerIndex(null);

                    if (newMode === BuffEndTimeModificationMode.Delete) {
                        action.setActEndTurnIndex(null);
                        action.setActEndTurnIndexMode(BuffEndTimeModificationMode.Delete);
                    } else {
                        if (action.getActEndTurnIndexMode() === BuffEndTimeModificationMode.Delete) {
                            action.setActEndTurnIndex(null);
                            action.setActEndTurnIndexMode(BuffEndTimeModificationMode.DoNotChange);
                        }
                    }

                } else {
                    action.setActEndPlayerIndex(action.getActEndPlayerIndex() ?? 0);

                    if (action.getActEndTurnIndexMode() === BuffEndTimeModificationMode.Delete) {
                        action.setActEndTurnIndex(null);
                        action.setActEndTurnIndexMode(BuffEndTimeModificationMode.DoNotChange);
                    }
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
        this._btnConTileFilter.setLangText(TextType.TileFilter);
        this._btnConUnitBuffFilter.setLangText(TextType.B1235);

        this._btnActBuffType.setLangText(TextType.AbnormalStateTypeId);
        this._btnActEndTurnIndex.setLangText(TextType.EndTurnIndex);
        this._btnActEndPlayerIndex.setLangText(TextType.EndPlayerIndex);
        this._btnActEndTurnIndexMode.setLangText(TextType.B0280);
        this._btnActEndPlayerIndexMode.setLangText(TextType.B0280);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConTileFilter();
        this._updateLabelConUnitBuffFilter();

        this._updateLabelActBuffType();
        this._updateLabelActEndTurnIndex();
        this._updateLabelActEndPlayerIndex();
        this._updateLabelActIsRelativeEndTurnIndex();
        this._updateLabelActEndPlayerIndexMode();
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

    private _updateLabelConTileFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConTileFilter.setText(action.getConTileFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConUnitBuffFilter(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        this._labelConUnitBuffFilter.setText(action.getConUnitBuffFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelActBuffType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const buffTypeId = action.getActBuffType();
        this._labelActBuffType.setText(buffTypeId == null ? `` : (getUnitBuffName(buffTypeId) ?? UndefinedError));
    }

    private _updateLabelActEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const value = action.getActEndTurnIndex();
        const label = this._labelActEndTurnIndex;
        if (value == null) {
            label.setText(``);
        } else {
            const mode      = action.getActEndTurnIndexMode();
            const prefix    = ((mode === BuffEndTimeModificationMode.AddOffset) || (mode === BuffEndTimeModificationMode.SetValueRelativeToCurrentTime)) && (value >= 0)
                ? `+`
                : ``;
            label.setText(`${prefix}${value}`);
        }
    }

    private _updateLabelActEndPlayerIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const value = action.getActEndPlayerIndex();
        const label = this._labelActEndPlayerIndex;
        if (value == null) {
            label.setText(``);
        } else {
            const mode      = action.getActEndPlayerIndexMode();
            const prefix    = ((mode === BuffEndTimeModificationMode.AddOffset) || (mode === BuffEndTimeModificationMode.SetValueRelativeToCurrentTime)) && (value >= 0)
                ? `+`
                : ``;
            label.setText(`${prefix}${value}`);
        }
    }

    private _updateLabelActIsRelativeEndTurnIndex(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const mode = action.getActEndTurnIndexMode() ?? 0;
        this._labelActEndTurnIndexMode.setText(getBuffEndTimeModificationModeName(mode) || UndefinedError);
    }

    private _updateLabelActEndPlayerIndexMode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const mode = action.getActEndPlayerIndexMode() ?? 0;
        this._labelActEndPlayerIndexMode.setText(getBuffEndTimeModificationModeName(mode) || UndefinedError);
    }

    private _getAction(): Undefinable<WeaModifyUnitBuffSimple> {
        return this.getOpenData()?.action.getWeaModifyUnitBuffSimple();
    }
}
