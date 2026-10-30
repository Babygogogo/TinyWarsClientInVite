import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetWeatherExpr,
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
import type { WeaSetWeatherExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetWeatherExpr.ts";

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

    private readonly _groupWeatherType!                                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyWeatherType!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnWeatherType!                                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelWeatherType!                                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupWeatherTurnsCount!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyWeatherTurnsCount!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWeatherTurnsCount!                           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnWeatherTurnsCount!                             : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyWeatherType,                         callback: this._onTouchedGroupModifyWeatherType },
            { ui: this._btnWeatherType,                                 callback: this._onTouchedBtnWeatherType },

            { ui: this._groupModifyWeatherTurnsCount,                   callback: this._onTouchedGroupModifyWeatherTurnsCount },
            { ui: this._btnWeatherTurnsCount,                           callback: this._onTouchedBtnWeatherTurnsCount },
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

    private _onTouchedBtnWeatherType(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyWeatherType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getWeatherType(),
            expressionInfo  : WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherType,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getWeatherType() != text) {
                    action.setWeatherType(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnWeatherTurnsCount(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherTurnsCount.getHelpText(),
        });
    }
    private _onTouchedGroupModifyWeatherTurnsCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getWeatherTurnsCount(),
            expressionInfo  : WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherTurnsCount,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getWeatherTurnsCount() != text) {
                    action.setWeatherTurnsCount(text);
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
        this._btnWeatherType.setText(WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherType.getTitleText());
        this._btnWeatherTurnsCount.setText(WarEvents_Actions_Constants_SetWeatherExpr.ExpressionInfoDict.WeatherTurnsCount.getTitleText());

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
            const label = this._labelWeatherType;
            label.setText(action.getWeatherType() ?? ``);
            this._groupWeatherType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelWeatherTurnsCount;
            label.setText(action.getWeatherTurnsCount() ?? ``);
            this._groupWeatherTurnsCount.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetWeatherExpr> {
        return this.getOpenData()?.action.getWeaSetWeatherExpr();
    }
}
