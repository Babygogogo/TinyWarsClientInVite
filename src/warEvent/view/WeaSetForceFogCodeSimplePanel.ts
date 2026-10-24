import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as FogMapsConstants from "../../fogMaps/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeSimple from "../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeSimple.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction     = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

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

    private readonly _btnForceFogCode!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelForceFogCode!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTurnsCount!                            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTurnsCount!                          : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnForceFogCode,                        callback: this._onTouchedBtnForceFogCode },
            { ui: this._btnTurnsCount,                          callback: this._onTouchedBtnTurnsCount },
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

    private _onTouchedBtnForceFogCode(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0796),
            availableNumberArray    : FogMapsConstants.AllForcedFogCodeArray,
            currentNumber           : action.getForceFogCode(),
            getNumberMainText       : num => LangUtils.getForceFogCodeName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : ForceFogCode => {
                action.setForceFogCode(ForceFogCode);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Turns),
            minValue        : 0,
            maxValue        : TurnsConstants.TurnIndex.MaxLimit,
            currentValue    : action.getTurnsCount() ?? 0,
            callback        : turnsCount => {
                action.setTurnsCount(turnsCount);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(LangConstants.TextType.B0516);

        this._btnForceFogCode.setLangText(LangConstants.TextType.B0796);
        this._btnTurnsCount.setLangText(LangConstants.TextType.Turns);

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
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getDetailDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelForceFogCode(): void {
        const forceFogCode = this._getAction()?.getForceFogCode();
        this._labelForceFogCode.setText((forceFogCode == null)
            ? LangConstants.UndefinedError
            : (LangUtils.getForceFogCodeName(forceFogCode) ?? LangConstants.UndefinedError)
        );
    }

    private _updateLabelTurnsCount(): void {
        const turnsCount = this._getAction()?.getTurnsCount();
        this._labelTurnsCount.setText(turnsCount == null
            ? LangConstants.UndefinedError
            : (turnsCount == 0
                ? LangUtils.getText(LangConstants.TextType.B0141)
                : `${turnsCount}`
            )
        );
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeSimple.WeaSetForceFogCodeSimple> {
        return this.getOpenData()?.action.getWeaSetForceFogCodeSimple();
    }
}
