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
import type * as ProtoSchemaCommonProtoWarEventWeaSetTileTypeExpr from "../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeExpr.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsSetTileTypeExpr from "../../warEvents/actions/constants/SetTileTypeExpr.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction         = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

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
    private readonly _groupCon!                                         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                         : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupConTileFilter!                               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConTileFilter!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnConTileFilter!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActBaseType!                                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActBaseType!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActBaseType!                                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActBaseType!                                   : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActBaseShapeId!                              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActBaseShapeId!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActBaseShapeId!                              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActBaseShapeId!                                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActObjectType!                               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActObjectType!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActObjectType!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActObjectType!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActObjectShapeId!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActObjectShapeId!                      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActObjectShapeId!                            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActObjectShapeId!                              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActDecorationType!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActDecorationType!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActDecorationType!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDecorationType!                           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActDecorationShapeId!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActDecorationShapeId!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActDecorationShapeId!                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActDecorationShapeId!                          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActUnitHandler!                              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActUnitHandler!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActUnitHandler!                              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActUnitHandler!                                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActUnitFilter!                               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActUnitFilter!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActUnitFilter!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActUnitFilter!                                 : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTileFilter,                       callback: this._onTouchedGroupModifyConTileFilter },
            { ui: this._btnConTileFilter,                               callback: this._onTouchedBtnConTileFilter },

            { ui: this._groupModifyActBaseType,                         callback: this._onTouchedGroupModifyActBaseType },
            { ui: this._btnActBaseType,                                 callback: this._onTouchedBtnActBaseType },

            { ui: this._groupModifyActBaseShapeId,                      callback: this._onTouchedGroupModifyActBaseShapeId },
            { ui: this._btnActBaseShapeId,                              callback: this._onTouchedBtnActBaseShapeId },

            { ui: this._groupModifyActObjectType,                       callback: this._onTouchedGroupModifyActObjectType },
            { ui: this._btnActObjectType,                               callback: this._onTouchedBtnActObjectType },

            { ui: this._groupModifyActObjectShapeId,                    callback: this._onTouchedGroupModifyActObjectShapeId },
            { ui: this._btnActObjectShapeId,                            callback: this._onTouchedBtnActObjectShapeId },

            { ui: this._groupModifyActDecorationType,                   callback: this._onTouchedGroupModifyActDecorationType },
            { ui: this._btnActDecorationType,                           callback: this._onTouchedBtnActDecorationType },

            { ui: this._groupModifyActDecorationShapeId,                callback: this._onTouchedGroupModifyActDecorationShapeId },
            { ui: this._btnActDecorationShapeId,                        callback: this._onTouchedBtnActDecorationShapeId },

            { ui: this._groupModifyActUnitHandler,                      callback: this._onTouchedGroupModifyActUnitHandler },
            { ui: this._btnActUnitHandler,                              callback: this._onTouchedBtnActUnitHandler },

            { ui: this._groupModifyActUnitFilter,                       callback: this._onTouchedGroupModifyActUnitFilter },
            { ui: this._btnActUnitFilter,                               callback: this._onTouchedBtnActUnitFilter },
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

    private _onTouchedBtnConTileFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ConTileFilter.getHelpText(),
        });
    }
    private _onTouchedGroupModifyConTileFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConTileFilter(),
            expressionInfo  : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ConTileFilter,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConTileFilter() != text) {
                    action.setConTileFilter(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBaseType(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActBaseType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBaseType(),
            expressionInfo  : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseType,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBaseType() != text) {
                    action.setActBaseType(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBaseShapeId(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActBaseShapeId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBaseShapeId(),
            expressionInfo  : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBaseShapeId() != text) {
                    action.setActBaseShapeId(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActObjectType(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActObjectType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActObjectType(),
            expressionInfo  : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectType,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActObjectType() != text) {
                    action.setActObjectType(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActObjectShapeId(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActObjectShapeId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActObjectShapeId(),
            expressionInfo  : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActObjectShapeId() != text) {
                    action.setActObjectShapeId(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDecorationType(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActDecorationType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDecorationType(),
            expressionInfo  : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationType,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDecorationType() != text) {
                    action.setActDecorationType(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDecorationShapeId(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActDecorationShapeId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDecorationShapeId(),
            expressionInfo  : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDecorationShapeId() != text) {
                    action.setActDecorationShapeId(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnitHandler(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitHandler.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActUnitHandler(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnitHandler(),
            expressionInfo  : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitHandler,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnitHandler() != text) {
                    action.setActUnitHandler(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnitFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitFilter.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActUnitFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnitFilter(),
            expressionInfo  : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitFilter,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnitFilter() != text) {
                    action.setActUnitFilter(text);
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
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnIdentifier.setLangText(LangConstants.TextType.B0131);
        this._btnConTileFilter.setText(WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActBaseType.setText(WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseType.getTitleText());
        this._btnActBaseShapeId.setText(WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId.getTitleText());
        this._btnActObjectType.setText(WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectType.getTitleText());
        this._btnActObjectShapeId.setText(WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId.getTitleText());
        this._btnActDecorationType.setText(WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationType.getTitleText());
        this._btnActDecorationShapeId.setText(WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId.getTitleText());
        this._btnActUnitHandler.setText(WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitHandler.getTitleText());
        this._btnActUnitFilter.setText(WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitFilter.getTitleText());

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
            const label = this._labelConTileFilter;
            label.setText(action.getConTileFilter() ?? ``);
            this._groupConTileFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActBaseType;
            label.setText(action.getActBaseType() ?? ``);
            this._groupActBaseType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActBaseShapeId;
            label.setText(action.getActBaseShapeId() ?? ``);
            this._groupActBaseShapeId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActObjectType;
            label.setText(action.getActObjectType() ?? ``);
            this._groupActObjectType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActObjectShapeId;
            label.setText(action.getActObjectShapeId() ?? ``);
            this._groupActObjectShapeId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActDecorationType;
            label.setText(action.getActDecorationType() ?? ``);
            this._groupActDecorationType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActDecorationShapeId;
            label.setText(action.getActDecorationShapeId() ?? ``);
            this._groupActDecorationShapeId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActUnitHandler;
            label.setText(action.getActUnitHandler() ?? ``);
            this._groupActUnitHandler.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActUnitFilter;
            label.setText(action.getActUnitFilter() ?? ``);
            this._groupActUnitFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetTileTypeExpr.WeaSetTileTypeExpr> {
        return this.getOpenData()?.action.getWeaSetTileTypeExpr();
    }
}
