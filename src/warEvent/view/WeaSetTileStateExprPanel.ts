import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetTileStateExpr,
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
import type { WeaSetTileStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetTileStateExpr.ts";

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

    private readonly _groupActPlayerIndex!                              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActPlayerIndex!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActPlayerIndex!                              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActPlayerIndex!                                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCurrentHp!                                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentHp!                          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCurrentHp!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCurrentHp!                                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCurrentBuildPoint!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentBuildPoint!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActCurrentBuildPoint!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCurrentBuildPoint!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActCurrentCapturePoint!                      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentCapturePoint!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCurrentCapturePoint!                      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCurrentCapturePoint!                        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActIsHighlighted!                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActIsHighlighted!                      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActIsHighlighted!                            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActIsHighlighted!                              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActGroupedLocationIdArray!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActGroupedLocationIdArray!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActGroupedLocationIdArray!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActGroupedLocationIdArray!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCustomNameId!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCustomNameId!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCustomNameId!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCustomNameId!                               : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTileFilter,                       callback: this._onTouchedGroupModifyConTileFilter },
            { ui: this._btnConTileFilter,                               callback: this._onTouchedBtnConTileFilter },

            { ui: this._groupModifyActPlayerIndex,                      callback: this._onTouchedGroupModifyActPlayerIndex },
            { ui: this._btnActPlayerIndex,                              callback: this._onTouchedBtnActPlayerIndex },

            { ui: this._groupModifyActCurrentHp,                        callback: this._onTouchedGroupModifyActCurrentHp },
            { ui: this._btnActCurrentHp,                                callback: this._onTouchedBtnActCurrentHp },

            { ui: this._groupModifyActCurrentBuildPoint,                callback: this._onTouchedGroupModifyActCurrentBuildPoint },
            { ui: this._btnActCurrentBuildPoint,                        callback: this._onTouchedBtnActCurrentBuildPoint },

            { ui: this._groupModifyActCurrentCapturePoint,              callback: this._onTouchedGroupModifyActCurrentCapturePoint },
            { ui: this._btnActCurrentCapturePoint,                      callback: this._onTouchedBtnActCurrentCapturePoint },

            { ui: this._groupModifyActIsHighlighted,                    callback: this._onTouchedGroupModifyActIsHighlighted },
            { ui: this._btnActIsHighlighted,                            callback: this._onTouchedBtnActIsHighlighted },

            { ui: this._groupModifyActGroupedLocationIdArray,           callback: this._onTouchedGroupModifyActGroupedLocationIdArray },
            { ui: this._btnActGroupedLocationIdArray,                   callback: this._onTouchedBtnActGroupedLocationIdArray },

            { ui: this._groupModifyActCustomNameId,                     callback: this._onTouchedGroupModifyActCustomNameId },
            { ui: this._btnActCustomNameId,                             callback: this._onTouchedBtnActCustomNameId },
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

    private _onTouchedBtnConTileFilter(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ConTileFilter.getHelpText(),
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
            currentValue    : action.getConTileFilter(),
            expressionInfo  : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ConTileFilter,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConTileFilter() != text) {
                    action.setConTileFilter(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActPlayerIndex(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActPlayerIndex.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActPlayerIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPlayerIndex(),
            expressionInfo  : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActPlayerIndex,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPlayerIndex() != text) {
                    action.setActPlayerIndex(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentHp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentHp.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentHp(),
            expressionInfo  : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentHp,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentHp() != text) {
                    action.setActCurrentHp(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentBuildPoint(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentBuildPoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentBuildPoint(),
            expressionInfo  : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentBuildPoint() != text) {
                    action.setActCurrentBuildPoint(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentCapturePoint(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentCapturePoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentCapturePoint(),
            expressionInfo  : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentCapturePoint() != text) {
                    action.setActCurrentCapturePoint(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsHighlighted(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActIsHighlighted.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsHighlighted(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsHighlighted(),
            expressionInfo  : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActIsHighlighted,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsHighlighted() != text) {
                    action.setActIsHighlighted(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGroupedLocationIdArray(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActGroupedLocationIdArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGroupedLocationIdArray(),
            expressionInfo  : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGroupedLocationIdArray() != text) {
                    action.setActGroupedLocationIdArray(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCustomNameId(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCustomNameId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCustomNameId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCustomNameId(),
            expressionInfo  : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCustomNameId,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCustomNameId() != text) {
                    action.setActCustomNameId(text);
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
        this._btnConTileFilter.setText(WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActPlayerIndex.setText(WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActPlayerIndex.getTitleText());
        this._btnActCurrentHp.setText(WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentHp.getTitleText());
        this._btnActCurrentBuildPoint.setText(WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint.getTitleText());
        this._btnActCurrentCapturePoint.setText(WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint.getTitleText());
        this._btnActIsHighlighted.setText(WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActIsHighlighted.getTitleText());
        this._btnActGroupedLocationIdArray.setText(WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray.getTitleText());
        this._btnActCustomNameId.setText(WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCustomNameId.getTitleText());

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
            const label = this._labelActPlayerIndex;
            label.setText(action.getActPlayerIndex() ?? ``);
            this._groupActPlayerIndex.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentHp;
            label.setText(action.getActCurrentHp() ?? ``);
            this._groupActCurrentHp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentBuildPoint;
            label.setText(action.getActCurrentBuildPoint() ?? ``);
            this._groupActCurrentBuildPoint.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentCapturePoint;
            label.setText(action.getActCurrentCapturePoint() ?? ``);
            this._groupActCurrentCapturePoint.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsHighlighted;
            label.setText(action.getActIsHighlighted() ?? ``);
            this._groupActIsHighlighted.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActGroupedLocationIdArray;
            label.setText(action.getActGroupedLocationIdArray() ?? ``);
            this._groupActGroupedLocationIdArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCustomNameId;
            label.setText(action.getActCustomNameId() ?? ``);
            this._groupActCustomNameId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileStateExpr> {
        return this.getOpenData()?.action.getWeaSetTileStateExpr();
    }
}
