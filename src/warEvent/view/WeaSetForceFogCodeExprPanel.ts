import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as ExpressionParsersEnums from "../../expressionParsers/Enums.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeExpr from "../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeExpr.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsSetForceFogCodeExpr from "../../warEvents/actions/constants/SetForceFogCodeExpr.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction             = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnIdentifier!                                    : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                                    : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                                  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                         : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupForceFogCode!                                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyForceFogCode!                          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnForceFogCode!                                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelForceFogCode!                                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTurnsCount!                                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyTurnsCount!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTurnsCount!                                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnTurnsCount!                                    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyForceFogCode,                        callback: this._onTouchedGroupModifyForceFogCode },
            { ui: this._btnForceFogCode,                                callback: this._onTouchedBtnForceFogCode },

            { ui: this._groupModifyTurnsCount,                          callback: this._onTouchedGroupModifyTurnsCount },
            { ui: this._btnTurnsCount,                                  callback: this._onTouchedBtnTurnsCount },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

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
            fullData    : openData.fullData,
            action      : openData.action,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonApiPanel, {
            contextType : ExpressionParsersEnums.ContextType.Player,
        });
    }

    private _onTouchedBtnForceFogCode(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.ForceFogCode.getHelpText(),
        });
    }
    private _onTouchedGroupModifyForceFogCode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getForceFogCode(),
            expressionInfo  : WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.ForceFogCode,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getForceFogCode() != text) {
                    action.setForceFogCode(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnTurnsCount(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.TurnsCount.getHelpText(),
        });
    }
    private _onTouchedGroupModifyTurnsCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getTurnsCount(),
            expressionInfo  : WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.TurnsCount,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getTurnsCount() != text) {
                    action.setTurnsCount(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setText(LangUtils.getText(LangConstants.TextType.B0516));
        this._btnIdentifier.setText(LangUtils.getText(LangConstants.TextType.B0131));
        this._btnForceFogCode.setText(WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.ForceFogCode.getTitleText());
        this._btnTurnsCount.setText(WarEventsActionsConstantsSetForceFogCodeExpr.ExpressionInfoDict.TurnsCount.getTitleText());

        this._updateLabelDescAndLabelError();
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
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getBriefDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateInputs(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        {
            const label = this._labelForceFogCode;
            label.setText( action.getForceFogCode() ?? ``);
            this._groupForceFogCode.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelTurnsCount;
            label.setText( action.getTurnsCount() ?? ``);
            this._groupTurnsCount.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeExpr.WeaSetForceFogCodeExpr> {
        return this.getOpenData()?.action.getWeaSetForceFogCodeExpr();
    }
}
