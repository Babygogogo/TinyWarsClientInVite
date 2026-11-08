import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetPlayerStateExpr,
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
import type { WeaSetPlayerStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateExpr.ts";

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
    private readonly _btnIdentifier!                            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCoId!                                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrExpression!                            : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupExpression!                          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupCon!                                 : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupAct!                                 : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupConPlayerFilter!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyConPlayerFilter!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnConPlayerFilter!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActFund!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActFund!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActFund!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActFund!                               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCoId!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCoId!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCoId!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCoId!                               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCoEnergy!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCoEnergy!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCoEnergy!                         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCoEnergy!                           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCoUsingSkillType!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCoUsingSkillType!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCoUsingSkillType!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCoUsingSkillType!                   : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActActivateCoSkillType!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActActivateCoSkillType!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActActivateCoSkillType!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActActivateCoSkillType!                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActAliveState!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActAliveState!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActAliveState!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActAliveState!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActSkipTurn!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActSkipTurn!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActSkipTurn!                         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActSkipTurn!                           : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",             callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                   callback : this.closePanel },
            { ui : this._btnType,                                    callback : this._onTouchedBtnType },
            { ui : this._btnIdentifier,                              callback : this._onTouchedBtnIdentifier },
            { ui : this._btnCoId,                                    callback : this._onTouchedBtnCoId },

            { ui : this._groupModifyConPlayerFilter,                 callback : this._onTouchedGroupModifyConPlayerFilter },
            { ui : this._btnConPlayerFilter,                         callback : this._onTouchedBtnConPlayerFilter },

            { ui : this._groupModifyActFund,                         callback : this._onTouchedGroupModifyActFund },
            { ui : this._btnActFund,                                 callback : this._onTouchedBtnActFund },

            { ui : this._groupModifyActCoId,                         callback : this._onTouchedGroupModifyActCoId },
            { ui : this._btnActCoId,                                 callback : this._onTouchedBtnActCoId },

            { ui : this._groupModifyActCoEnergy,                     callback : this._onTouchedGroupModifyActCoEnergy },
            { ui : this._btnActCoEnergy,                             callback : this._onTouchedBtnActCoEnergy },

            { ui : this._groupModifyActCoUsingSkillType,             callback : this._onTouchedGroupModifyActCoUsingSkillType },
            { ui : this._btnActCoUsingSkillType,                     callback : this._onTouchedBtnActCoUsingSkillType },

            { ui : this._groupModifyActActivateCoSkillType,          callback : this._onTouchedGroupModifyActActivateCoSkillType },
            { ui : this._btnActActivateCoSkillType,                  callback : this._onTouchedBtnActActivateCoSkillType },

            { ui : this._groupModifyActAliveState,                   callback : this._onTouchedGroupModifyActAliveState },
            { ui : this._btnActAliveState,                           callback : this._onTouchedBtnActAliveState },

            { ui : this._groupModifyActSkipTurn,                     callback : this._onTouchedGroupModifyActSkipTurn },
            { ui : this._btnActSkipTurn,                             callback : this._onTouchedBtnActSkipTurn },
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
    private _onTouchedBtnCoId(): void {
        const gcData = this.getOpenData()?.war.getGcData();
        if (gcData != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoIdPanel, {
                gameConfig         : gcData,
                currentCoIdArray   : [],
                availableCoIdArray : gcData.getAllEnabledCoArray().map(v => v.getCoId()),
                isBan              : false,
                showCoId           : true,
                getTitleText       : () => `CO ID`,
            });
        }
    }

    private _onTouchedBtnConPlayerFilter(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter.getHelpText(),
        });
    }
    private _onTouchedGroupModifyConPlayerFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getConPlayerFilter(),
            expressionInfo : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getConPlayerFilter() != text) {
                    action.setConPlayerFilter(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFund(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActFund.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActFund(),
            expressionInfo : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActFund,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActFund() != text) {
                    action.setActFund(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoId(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCoId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActCoId(),
            expressionInfo : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoId,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActCoId() != text) {
                    action.setActCoId(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoEnergy(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCoEnergy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActCoEnergy(),
            expressionInfo : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActCoEnergy() != text) {
                    action.setActCoEnergy(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoUsingSkillType(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCoUsingSkillType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActCoUsingSkillType(),
            expressionInfo : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActCoUsingSkillType() != text) {
                    action.setActCoUsingSkillType(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActActivateCoSkillType(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActActivateCoSkillType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActActivateCoSkillType(),
            expressionInfo : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActActivateCoSkillType() != text) {
                    action.setActActivateCoSkillType(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAliveState(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActAliveState.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActAliveState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActAliveState(),
            expressionInfo : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActAliveState,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActAliveState() != text) {
                    action.setActAliveState(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActSkipTurn(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActSkipTurn(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActIsSkipTurn(),
            expressionInfo : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActIsSkipTurn() != text) {
                    action.setActIsSkipTurn(text);
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
        this._btnCoId.setText(`CO ID`);
        this._btnConPlayerFilter.setText(WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter.getTitleText());
        this._btnActFund.setText(WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActFund.getTitleText());
        this._btnActCoId.setText(WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoId.getTitleText());
        this._btnActCoEnergy.setText(WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy.getTitleText());
        this._btnActCoUsingSkillType.setText(WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType.getTitleText());
        this._btnActActivateCoSkillType.setText(WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType.getTitleText());
        this._btnActAliveState.setText(WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActAliveState.getTitleText());
        this._btnActSkipTurn.setText(WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn.getTitleText());

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
            const label = this._labelConPlayerFilter;
            label.setText(action.getConPlayerFilter() ?? ``);
            this._groupConPlayerFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActFund;
            label.setText(action.getActFund() ?? ``);
            this._groupActFund.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCoId;
            label.setText(action.getActCoId() ?? ``);
            this._groupActCoId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCoEnergy;
            label.setText(action.getActCoEnergy() ?? ``);
            this._groupActCoEnergy.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCoUsingSkillType;
            label.setText(action.getActCoUsingSkillType() ?? ``);
            this._groupActCoUsingSkillType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActActivateCoSkillType;
            label.setText(action.getActActivateCoSkillType() ?? ``);
            this._groupActActivateCoSkillType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActAliveState;
            label.setText(action.getActAliveState() ?? ``);
            this._groupActAliveState.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActSkipTurn;
            label.setText(action.getActIsSkipTurn() ?? ``);
            this._groupActSkipTurn.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetPlayerStateExpr> {
        return this.getOpenData()?.action.getWeaSetPlayerStateExpr();
    }
}
