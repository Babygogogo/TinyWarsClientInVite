import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetCustomCounters,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
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
import type { WeaSetCustomCounters } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomCounters.ts";

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

    private readonly _groupIdExpression!                                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyIdExpression!                          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnIdExpression!                                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelIdExpression!                                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupValueExpression!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyValueExpression!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelValueExpression!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnValueExpression!                               : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                         callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",                 callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                       callback : this.closePanel },
            { ui : this._btnType,                                        callback : this._onTouchedBtnType },
            { ui : this._btnIdentifier,                                  callback : this._onTouchedBtnIdentifier },

            { ui : this._groupModifyIdExpression,                        callback : this._onTouchedGroupModifyIdExpression },
            { ui : this._btnIdExpression,                                callback : this._onTouchedBtnIdExpression },

            { ui : this._groupModifyValueExpression,                     callback : this._onTouchedGroupModifyValueExpression },
            { ui : this._btnValueExpression,                             callback : this._onTouchedBtnValueExpression },
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

    private _onTouchedBtnIdExpression(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.IdExpression.getHelpText(),
        });
    }
    private _onTouchedGroupModifyIdExpression(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getIdExpression(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.IdExpression,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getIdExpression() != text) {
                    action.setIdExpression(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnValueExpression(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.ValueExpression.getHelpText(),
        });
    }
    private _onTouchedGroupModifyValueExpression(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getValueExpression(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.ValueExpression,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getValueExpression() != text) {
                    action.setValueExpression(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
        this._btnIdExpression.setText(WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.IdExpression.getTitleText());
        this._btnValueExpression.setText(WarEvents_Actions_Constants_SetCustomCounters.ExpressionInfoDict.ValueExpression.getTitleText());

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
            const label = this._labelIdExpression;
            label.setText(action.getIdExpression() ?? ``);
            this._groupIdExpression.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelValueExpression;
            label.setText(action.getValueExpression() ?? ``);
            this._groupValueExpression.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCounters> {
        return this.getOpenData()?.action.getWeaSetCustomCounters();
    }
}
