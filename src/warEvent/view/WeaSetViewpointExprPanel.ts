import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetViewpointExpr,
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
import type { WeaSetViewpointExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetViewpointExpr.ts";

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
    private readonly _groupAct!                                         : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupTargets!                                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyTargets!                               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnTargets!                                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTargets!                                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupNeedFocusEffect!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyNeedFocusEffect!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelNeedFocusEffect!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnNeedFocusEffect!                               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupIsOneByOne!                                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyIsOneByOne!                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelIsOneByOne!                                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnIsOneByOne!                                    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupInterval!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyInterval!                              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelInterval!                                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnInterval!                                      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyTargets,                             callback: this._onTouchedGroupModifyTargets },
            { ui: this._btnTargets,                                     callback: this._onTouchedBtnTargets },

            { ui: this._groupModifyNeedFocusEffect,                     callback: this._onTouchedGroupModifyNeedFocusEffect },
            { ui: this._btnNeedFocusEffect,                             callback: this._onTouchedBtnNeedFocusEffect },

            { ui: this._groupModifyIsOneByOne,                          callback: this._onTouchedGroupModifyIsOneByOne },
            { ui: this._btnIsOneByOne,                                  callback: this._onTouchedBtnIsOneByOne },

            { ui: this._groupModifyInterval,                            callback: this._onTouchedGroupModifyInterval },
            { ui: this._btnInterval,                                    callback: this._onTouchedBtnInterval },
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
            fullData    : openData.fullData,
            action      : openData.action,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonApiPanel, {
            contextType : ExpressionParsers_Enums.ContextType.Player,
        });
    }

    private _onTouchedBtnTargets(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Targets.getHelpText(),
        });
    }
    private _onTouchedGroupModifyTargets(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getTargets(),
            expressionInfo  : WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Targets,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getTargets() != text) {
                    action.setTargets(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnNeedFocusEffect(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.NeedFocusEffect.getHelpText(),
        });
    }
    private _onTouchedGroupModifyNeedFocusEffect(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getNeedFocusEffect(),
            expressionInfo  : WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.NeedFocusEffect,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getNeedFocusEffect() != text) {
                    action.setNeedFocusEffect(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnIsOneByOne(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.IsOneByOne.getHelpText(),
        });
    }
    private _onTouchedGroupModifyIsOneByOne(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getIsOneByOne(),
            expressionInfo  : WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.IsOneByOne,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getIsOneByOne() != text) {
                    action.setIsOneByOne(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnInterval(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Interval.getHelpText(),
        });
    }
    private _onTouchedGroupModifyInterval(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getInterval(),
            expressionInfo  : WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Interval,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getInterval() != text) {
                    action.setInterval(text);
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
        this._btnTargets.setText(WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Targets.getTitleText());
        this._btnNeedFocusEffect.setText(WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.NeedFocusEffect.getTitleText());
        this._btnIsOneByOne.setText(WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.IsOneByOne.getTitleText());
        this._btnInterval.setText(WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Interval.getTitleText());

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
            const label = this._labelTargets;
            label.setText(action.getTargets() ?? ``);
            this._groupTargets.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelNeedFocusEffect;
            label.setText(action.getNeedFocusEffect() ?? ``);
            this._groupNeedFocusEffect.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelIsOneByOne;
            label.setText(action.getIsOneByOne() ?? ``);
            this._groupIsOneByOne.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelInterval;
            label.setText(action.getInterval() ?? ``);
            this._groupInterval.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetViewpointExpr> {
        return this.getOpenData()?.action.getWeaSetViewpointExpr();
    }
}
