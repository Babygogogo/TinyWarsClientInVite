import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { AllForcedFogCodeArray } from "../../fogMaps/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getForceFogCodeName,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetForceFogCodeSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeSimple.ts";
import { TurnIndex } from "../../turns/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
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

    private readonly _btnForceFogCode!                          : IUiButton;
    private readonly _labelForceFogCode!                        : IUiLabel;

    private readonly _btnTurnsCount!                            : IUiButton;
    private readonly _labelTurnsCount!                          : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnForceFogCode,                        callback: this._onTouchedBtnForceFogCode },
            { ui: this._btnTurnsCount,                          callback: this._onTouchedBtnTurnsCount },
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

    private _onTouchedBtnForceFogCode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B0796),
            availableNumberArray    : AllForcedFogCodeArray,
            currentNumber           : action.getForceFogCode(),
            getNumberMainText       : num => getForceFogCodeName(num) ?? UndefinedError,
            callbackOnConfirm       : ForceFogCode => {
                action.setForceFogCode(ForceFogCode);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnTurnsCount(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Turns),
            minValue        : 0,
            maxValue        : TurnIndex.MaxLimit,
            currentValue    : action.getTurnsCount(),
            callback        : turnsCount => {
                action.setTurnsCount(turnsCount);
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

        this._btnForceFogCode.setLangText(TextType.B0796);
        this._btnTurnsCount.setLangText(TextType.Turns);

        this._updateLabelDescAndLabelError();

        this._updateLabelForceFogCode();
        this._updateLabelTurnsCount();
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

    private _updateLabelForceFogCode(): void {
        const forceFogCode = this._getAction()?.getForceFogCode();
        this._labelForceFogCode.setText((forceFogCode == null)
            ? UndefinedError
            : (getForceFogCodeName(forceFogCode) ?? UndefinedError)
        );
    }

    private _updateLabelTurnsCount(): void {
        const turnsCount = this._getAction()?.getTurnsCount();
        this._labelTurnsCount.setText(turnsCount == null
            ? UndefinedError
            : (turnsCount == 0
                ? getText(TextType.B0141)
                : `${turnsCount}`
            )
        );
    }

    private _getAction(): Undefinable<WeaSetForceFogCodeSimple> {
        return this.getOpenData()?.action.getWeaSetForceFogCodeSimple();
    }
}
