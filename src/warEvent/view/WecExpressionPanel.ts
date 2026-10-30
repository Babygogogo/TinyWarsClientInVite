import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Conditions_Utils_Common,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type ExpressionParsers_Types,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
} from "../../internal.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecExpression } from "../../proto/schema/CommonProto/WarEvent/WecExpression.ts";

const ExpressionInfo: ExpressionParsers_Types.EpExpressionInfo = {
    contextType  : ExpressionParsers_Enums.ContextType.War,
    resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
    isRequired   : true,
    getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B0129),
    getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0941),
};

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
/** WecPlayerIndexInTurnEqualTo */
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnIdentifier!                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrContent!                   : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _layoutContent!                : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupConExpression!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyConExpression!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelConExpression!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConExpression!             : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged, callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                       callback : this.closePanel },
            { ui : this._btnType,                        callback : this._onTouchedBtnType },
            { ui : this._btnIdentifier,                  callback : this._onTouchedBtnIdentifier },

            { ui : this._groupModifyConExpression,       callback : this._onTouchedGroupModifyConExpression },
            { ui : this._btnConExpression,               callback : this._onTouchedBtnConExpression },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeConditionTypeListPanel, {
            fullData  : openData.fullData,
            condition : openData.condition,
            war       : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonApiPanel, {
            contextType : ExpressionParsers_Enums.ContextType.War,
        });
    }

    private _onTouchedBtnConExpression(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0941),
        });
    }
    private _onTouchedGroupModifyConExpression(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : condition.getExpression(),
            expressionInfo : ExpressionInfo,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (condition.getExpression() != text) {
                    condition.setExpression(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputExpression();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnIdentifier.setLangText(Lang_Constants.TextType.B0131);
        this._btnConExpression.setLangText(Lang_Constants.TextType.B0129);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = WarEvents_Conditions_Utils_Common.getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Conditions_Utils_Common.getBriefDescForCondition(condition, war.getGcData()) || Lang_Constants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateInputExpression(): void {
        const condition = this._getCondition();

        {
            const label = this._labelConExpression;
            label.setText(condition.getExpression() ?? ``);
            this._groupConExpression.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const scrContent    = this._scrContent;
        const layoutContent = this._layoutContent;
        layoutContent.arrangeItems();
        scrContent.updateOnItemsChanged();
        scrContent.setUnscaledManualHeight(Math.min(140, layoutContent.getScaledHeight()));
    }

    private _getCondition(): WecExpression {
        return Helpers_Misc.getExisted(this.getOpenData()?.condition.getWecExpression());
    }
}
