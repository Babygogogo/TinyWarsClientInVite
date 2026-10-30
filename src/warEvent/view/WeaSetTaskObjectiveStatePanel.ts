import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetTaskObjectiveState,
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
import type { WeaSetTaskObjectiveState } from "../../proto/schema/CommonProto/WarEvent/WeaSetTaskObjectiveState.ts";

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

    private readonly _groupConTaskObjectiveFilter!                      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyConTaskObjectiveFilter!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnConTaskObjectiveFilter!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTaskObjectiveFilter!                      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActProgress!                                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActProgress!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActProgress!                                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActProgress!                                   : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActIsHidden!                                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActIsHidden!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActIsHidden!                                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActIsHidden!                                   : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActIsProgressUpdaterDisabled!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActIsProgressUpdaterDisabled!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActIsProgressUpdaterDisabled!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActIsProgressUpdaterDisabled!                  : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,                 callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                       callback : this.closePanel },
            { ui : this._btnType,                                        callback : this._onTouchedBtnType },
            { ui : this._btnIdentifier,                                  callback : this._onTouchedBtnIdentifier },

            { ui : this._groupModifyConTaskObjectiveFilter,              callback : this._onTouchedGroupModifyConTaskObjectiveFilter },
            { ui : this._btnConTaskObjectiveFilter,                      callback : this._onTouchedBtnConTaskObjectiveFilter },

            { ui : this._groupModifyActProgress,                         callback : this._onTouchedGroupModifyActProgress },
            { ui : this._btnActProgress,                                 callback : this._onTouchedBtnActProgress },

            { ui : this._groupModifyActIsHidden,                         callback : this._onTouchedGroupModifyActIsHidden },
            { ui : this._btnActIsHidden,                                 callback : this._onTouchedBtnActIsHidden },

            { ui : this._groupModifyActIsProgressUpdaterDisabled,        callback : this._onTouchedGroupModifyActIsProgressUpdaterDisabled },
            { ui : this._btnActIsProgressUpdaterDisabled,                callback : this._onTouchedBtnActIsProgressUpdaterDisabled },
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

    private _onTouchedBtnConTaskObjectiveFilter(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter.getHelpText(),
        });
    }
    private _onTouchedGroupModifyConTaskObjectiveFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getConTaskObjectiveFilter(),
            expressionInfo : WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getConTaskObjectiveFilter() != text) {
                    action.setConTaskObjectiveFilter(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActProgress(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActProgress.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActProgress(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActProgress(),
            expressionInfo : WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActProgress,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActProgress() != text) {
                    action.setActProgress(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsHidden(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsHidden.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsHidden(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActIsHidden(),
            expressionInfo : WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsHidden,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActIsHidden() != text) {
                    action.setActIsHidden(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsProgressUpdaterDisabled(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsProgressUpdaterDisabled(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActIsProgressUpdaterDisabled(),
            expressionInfo : WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActIsProgressUpdaterDisabled() != text) {
                    action.setActIsProgressUpdaterDisabled(text);
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
        this._btnConTaskObjectiveFilter.setText(WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter.getTitleText());
        this._btnActProgress.setText(WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActProgress.getTitleText());
        this._btnActIsHidden.setText(WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsHidden.getTitleText());
        this._btnActIsProgressUpdaterDisabled.setText(WarEvents_Actions_Constants_SetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled.getTitleText());

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
            const label = this._labelConTaskObjectiveFilter;
            label.setText(action.getConTaskObjectiveFilter() ?? ``);
            this._groupConTaskObjectiveFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActProgress;
            label.setText(action.getActProgress() ?? ``);
            this._groupActProgress.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsHidden;
            label.setText(action.getActIsHidden() ?? ``);
            this._groupActIsHidden.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsProgressUpdaterDisabled;
            label.setText(action.getActIsProgressUpdaterDisabled() ?? ``);
            this._groupActIsProgressUpdaterDisabled.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTaskObjectiveState> {
        return this.getOpenData()?.action.getWeaSetTaskObjectiveState();
    }
}
