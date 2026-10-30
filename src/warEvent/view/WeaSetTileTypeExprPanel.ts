import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetTileTypeExpr,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetTileTypeExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeExpr.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                                       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnIdentifier!                                    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                                        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrExpression!                                    : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupExpression!                                  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupCon!                                         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupAct!                                         : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupConTileFilter!                               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyConTileFilter!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnConTileFilter!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileFilter!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActBaseType!                                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActBaseType!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActBaseType!                                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActBaseType!                                   : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActBaseShapeId!                              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActBaseShapeId!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActBaseShapeId!                              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActBaseShapeId!                                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActObjectType!                               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActObjectType!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActObjectType!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActObjectType!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActObjectShapeId!                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActObjectShapeId!                      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActObjectShapeId!                            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActObjectShapeId!                              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActDecorationType!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActDecorationType!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActDecorationType!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDecorationType!                           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActDecorationShapeId!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActDecorationShapeId!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActDecorationShapeId!                        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActDecorationShapeId!                          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActUnitHandler!                              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActUnitHandler!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActUnitHandler!                              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActUnitHandler!                                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActUnitFilter!                               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActUnitFilter!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActUnitFilter!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActUnitFilter!                                 : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,                 callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                       callback : this.closePanel },
            { ui : this._btnType,                                        callback : this._onTouchedBtnType },
            { ui : this._btnIdentifier,                                  callback : this._onTouchedBtnIdentifier },

            { ui : this._groupModifyConTileFilter,                       callback : this._onTouchedGroupModifyConTileFilter },
            { ui : this._btnConTileFilter,                               callback : this._onTouchedBtnConTileFilter },

            { ui : this._groupModifyActBaseType,                         callback : this._onTouchedGroupModifyActBaseType },
            { ui : this._btnActBaseType,                                 callback : this._onTouchedBtnActBaseType },

            { ui : this._groupModifyActBaseShapeId,                      callback : this._onTouchedGroupModifyActBaseShapeId },
            { ui : this._btnActBaseShapeId,                              callback : this._onTouchedBtnActBaseShapeId },

            { ui : this._groupModifyActObjectType,                       callback : this._onTouchedGroupModifyActObjectType },
            { ui : this._btnActObjectType,                               callback : this._onTouchedBtnActObjectType },

            { ui : this._groupModifyActObjectShapeId,                    callback : this._onTouchedGroupModifyActObjectShapeId },
            { ui : this._btnActObjectShapeId,                            callback : this._onTouchedBtnActObjectShapeId },

            { ui : this._groupModifyActDecorationType,                   callback : this._onTouchedGroupModifyActDecorationType },
            { ui : this._btnActDecorationType,                           callback : this._onTouchedBtnActDecorationType },

            { ui : this._groupModifyActDecorationShapeId,                callback : this._onTouchedGroupModifyActDecorationShapeId },
            { ui : this._btnActDecorationShapeId,                        callback : this._onTouchedBtnActDecorationShapeId },

            { ui : this._groupModifyActUnitHandler,                      callback : this._onTouchedGroupModifyActUnitHandler },
            { ui : this._btnActUnitHandler,                              callback : this._onTouchedBtnActUnitHandler },

            { ui : this._groupModifyActUnitFilter,                       callback : this._onTouchedGroupModifyActUnitFilter },
            { ui : this._btnActUnitFilter,                               callback : this._onTouchedBtnActUnitFilter },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeActionTypeListPanel, {
            fullData : openData.fullData,
            action   : openData.action,
            war      : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonApiPanel, {
            contextType : ExpressionParsers_Enums.ContextType.Player,
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ConTileFilter.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getConTileFilter(),
            expressionInfo : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ConTileFilter,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getConTileFilter() != text) {
                    action.setConTileFilter(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBaseType(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseType.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActBaseType(),
            expressionInfo : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseType,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActBaseType() != text) {
                    action.setActBaseType(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBaseShapeId(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActBaseShapeId(),
            expressionInfo : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActBaseShapeId() != text) {
                    action.setActBaseShapeId(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActObjectType(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectType.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActObjectType(),
            expressionInfo : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectType,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActObjectType() != text) {
                    action.setActObjectType(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActObjectShapeId(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActObjectShapeId(),
            expressionInfo : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActObjectShapeId() != text) {
                    action.setActObjectShapeId(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDecorationType(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationType.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActDecorationType(),
            expressionInfo : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationType,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActDecorationType() != text) {
                    action.setActDecorationType(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDecorationShapeId(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActDecorationShapeId(),
            expressionInfo : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActDecorationShapeId() != text) {
                    action.setActDecorationShapeId(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnitHandler(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitHandler.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActUnitHandler(),
            expressionInfo : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitHandler,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActUnitHandler() != text) {
                    action.setActUnitHandler(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnitFilter(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitFilter.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActUnitFilter(),
            expressionInfo : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitFilter,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActUnitFilter() != text) {
                    action.setActUnitFilter(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnIdentifier.setLangText(Lang_Constants.TextType.B0131);
        this._btnConTileFilter.setText(WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActBaseType.setText(WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseType.getTitleText());
        this._btnActBaseShapeId.setText(WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId.getTitleText());
        this._btnActObjectType.setText(WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectType.getTitleText());
        this._btnActObjectShapeId.setText(WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId.getTitleText());
        this._btnActDecorationType.setText(WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationType.getTitleText());
        this._btnActDecorationShapeId.setText(WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId.getTitleText());
        this._btnActUnitHandler.setText(WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitHandler.getTitleText());
        this._btnActUnitFilter.setText(WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitFilter.getTitleText());

        this._updateLabelDescAndLabelError();
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
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Actions_Utils_Common.getBriefDescForAction(action, war.getGcData()) || Lang_Constants.UndefinedError);
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

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileTypeExpr> {
        return this.getOpenData()?.action.getWeaSetTileTypeExpr();
    }
}
