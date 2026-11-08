import {
    FogMaps_Constants,
    Graphics_Constants,
    Notifications_Dispatcher,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Lang_Constants,
    Turns_Constants,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetForceFogCodeSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeSimple.ts";

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

    private readonly _btnForceFogCode!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelForceFogCode!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTurnsCount!                            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTurnsCount!                          : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnType,                                callback : this._onTouchedBtnType },
            { ui : this._btnClose,                               callback : this.closePanel },

            { ui : this._btnForceFogCode,                        callback : this._onTouchedBtnForceFogCode },
            { ui : this._btnTurnsCount,                          callback : this._onTouchedBtnTurnsCount },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",         callback : this._onNotifyWarEventFullDataChanged },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeActionTypeListPanel, {
            war      : openData.war,
            fullData : openData.fullData,
            action   : openData.action,
        });
    }

    private _onTouchedBtnForceFogCode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0796),
            availableNumberArray : FogMaps_Constants.AllForcedFogCodeArray,
            currentNumber        : action.getForceFogCode(),
            getNumberMainText    : num => Lang_Utils.getForceFogCodeName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : ForceFogCode => {
                action.setForceFogCode(ForceFogCode);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Turns),
            minValue     : 0,
            maxValue     : Turns_Constants.TurnIndex.MaxLimit,
            currentValue : action.getTurnsCount(),
            callback     : turnsCount => {
                action.setTurnsCount(turnsCount);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);

        this._btnForceFogCode.setLangText(Lang_Constants.TextType.B0796);
        this._btnTurnsCount.setLangText(Lang_Constants.TextType.Turns);

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
        const errorTip          = WarEvents_Actions_Utils_Common.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Actions_Utils_Common.getDetailDescForAction(action, war.getGcData()) || Lang_Constants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelForceFogCode(): void {
        const forceFogCode = this._getAction()?.getForceFogCode();
        this._labelForceFogCode.setText((forceFogCode == null)
            ? Lang_Constants.UndefinedError
            : (Lang_Utils.getForceFogCodeName(forceFogCode) ?? Lang_Constants.UndefinedError),
        );
    }

    private _updateLabelTurnsCount(): void {
        const turnsCount = this._getAction()?.getTurnsCount();
        this._labelTurnsCount.setText(turnsCount == null
            ? Lang_Constants.UndefinedError
            : (turnsCount == 0
                ? Lang_Utils.getText(Lang_Constants.TextType.B0141)
                : `${turnsCount}`
            ),
        );
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple> {
        return this.getOpenData()?.action.getWeaSetForceFogCodeSimple();
    }
}
