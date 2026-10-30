import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_AddTileBuffExpr,
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
import type { WeaAddTileBuffExpr } from "../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffExpr.ts";

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

    private readonly _groupDesc!                                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrExpression!                            : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupExpression!                          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupCon!                                 : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupAct!                                 : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupConTileFilter!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyConTileFilter!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnConTileFilter!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActBuffType!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActBuffType!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActBuffType!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActBuffType!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActExpiringTurnIndex!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActExpiringTurnIndex!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActExpiringTurnIndex!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActExpiringTurnIndex!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActExpiringPlayerIndex!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActExpiringPlayerIndex!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActExpiringPlayerIndex!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActExpiringPlayerIndex!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActExtraParams!                      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActExtraParams!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActExtraParams!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActExtraParams!                      : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnType,                                    callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                              callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTileFilter,                   callback: this._onTouchedGroupModifyConTileFilter },
            { ui: this._btnConTileFilter,                           callback: this._onTouchedBtnConTileFilter },

            { ui: this._groupModifyActBuffType,                     callback: this._onTouchedGroupModifyActBuffType },
            { ui: this._btnActBuffType,                             callback: this._onTouchedBtnActBuffType },

            { ui: this._groupModifyActExpiringTurnIndex,            callback: this._onTouchedGroupModifyActExpiringTurnIndex },
            { ui: this._btnActExpiringTurnIndex,                    callback: this._onTouchedBtnActExpiringTurnIndex },

            { ui: this._groupModifyActExpiringPlayerIndex,          callback: this._onTouchedGroupModifyActExpiringPlayerIndex },
            { ui: this._btnActExpiringPlayerIndex,                  callback: this._onTouchedBtnActExpiringPlayerIndex },

            { ui: this._groupModifyActExtraParams,                  callback: this._onTouchedGroupModifyActExtraParams },
            { ui: this._btnActExtraParams,                          callback: this._onTouchedBtnActExtraParams },
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
            contextType : ExpressionParsers_Enums.ContextType.Tile,
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0662),
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
            expressionInfo  : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ConTileFilter,
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

    private _onTouchedBtnActBuffType(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0761),
        });
    }
    private _onTouchedGroupModifyActBuffType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBuffType(),
            expressionInfo  : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActBuffType,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBuffType() != text) {
                    action.setActBuffType(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActExpiringTurnIndex(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0762),
        });
    }
    private _onTouchedGroupModifyActExpiringTurnIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActExpiringTurnIndex(),
            expressionInfo  : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActExpiringTurnIndex() != text) {
                    action.setActExpiringTurnIndex(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActExpiringPlayerIndex(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0763),
        });
    }
    private _onTouchedGroupModifyActExpiringPlayerIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActExpiringPlayerIndex(),
            expressionInfo  : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActExpiringPlayerIndex() != text) {
                    action.setActExpiringPlayerIndex(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActExtraParams(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0764),
        });
    }
    private _onTouchedGroupModifyActExtraParams(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActExtraParams(),
            expressionInfo  : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExtraParams,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActExtraParams() != text) {
                    action.setActExtraParams(text);
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
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnIdentifier.setLangText(Lang_Constants.TextType.B0131);

        this._btnConTileFilter.setLangText(Lang_Constants.TextType.TileFilter);
        this._btnActBuffType.setLangText(Lang_Constants.TextType.B0805);
        this._btnActExpiringTurnIndex.setLangText(Lang_Constants.TextType.EndTurnIndex);
        this._btnActExpiringPlayerIndex.setLangText(Lang_Constants.TextType.EndPlayerIndex);
        this._btnActExtraParams.setLangText(Lang_Constants.TextType.B1229);

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
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
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
            const label = this._labelActBuffType;
            label.setText(action.getActBuffType() ?? ``);
            this._groupActBuffType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActExpiringTurnIndex;
            label.setText(action.getActExpiringTurnIndex() ?? ``);
            this._groupActExpiringTurnIndex.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActExpiringPlayerIndex;
            label.setText(action.getActExpiringPlayerIndex() ?? ``);
            this._groupActExpiringPlayerIndex.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActExtraParams;
            label.setText(action.getActExtraParams() ?? ``);
            this._groupActExtraParams.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddTileBuffExpr> {
        return this.getOpenData()?.action.getWeaAddTileBuffExpr();
    }
}
