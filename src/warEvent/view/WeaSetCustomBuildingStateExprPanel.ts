import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetCustomBuildingStateExpr,
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
import type { WeaSetCustomBuildingStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateExpr.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnIdentifier!                                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                                    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrExpression!                                : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupExpression!                              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupCon!                                     : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupAct!                                     : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupConTileFilter!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyConTileFilter!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnConTileFilter!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConTileFilter!                           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActDefenseAmount!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActDefenseAmount!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActDefenseAmount!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDefenseAmount!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActDefenseUnitTypeArray!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActDefenseUnitTypeArray!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActDefenseUnitTypeArray!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDefenseUnitTypeArray!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActMaxCapturePoint!                      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActMaxCapturePoint!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActMaxCapturePoint!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActMaxCapturePoint!                      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActIsDefeatedOnCapture!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActIsDefeatedOnCapture!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActIsDefeatedOnCapture!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsDefeatedOnCapture!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActRepairNormalizedHp!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActRepairNormalizedHp!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActRepairNormalizedHp!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRepairNormalizedHp!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActRepairUnitTypeArray!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActRepairUnitTypeArray!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActRepairUnitTypeArray!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRepairUnitTypeArray!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActIncomePerTurn!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActIncomePerTurn!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActIncomePerTurn!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIncomePerTurn!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActVisionRange!                          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActVisionRange!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActVisionRange!                            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActVisionRange!                          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActIsVisionEnabledForAllPlayers!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActIsVisionEnabledForAllPlayers!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActIsVisionEnabledForAllPlayers!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsVisionEnabledForAllPlayers!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActHideUnitTypeArray!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActHideUnitTypeArray!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActHideUnitTypeArray!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActHideUnitTypeArray!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActProduceUnitTypeArray!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActProduceUnitTypeArray!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActProduceUnitTypeArray!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActProduceUnitTypeArray!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActGlobalAttackBonus!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActGlobalAttackBonus!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActGlobalAttackBonus!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActGlobalAttackBonus!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActGlobalDefenseBonus!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActGlobalDefenseBonus!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActGlobalDefenseBonus!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActGlobalDefenseBonus!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActUnitTypeArrayForCoBoard!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActUnitTypeArrayForCoBoard!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActUnitTypeArrayForCoBoard!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActUnitTypeArrayForCoBoard!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActBlockEnemyUnitTypeArray!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActBlockEnemyUnitTypeArray!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActBlockEnemyUnitTypeArray!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActBlockEnemyUnitTypeArray!              : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,             callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                   callback : this.closePanel },
            { ui : this._btnType,                                    callback : this._onTouchedBtnType },
            { ui : this._btnIdentifier,                              callback : this._onTouchedBtnIdentifier },

            { ui : this._groupModifyConTileFilter,                   callback : this._onTouchedGroupModifyConTileFilter },
            { ui : this._btnConTileFilter,                           callback : this._onTouchedBtnConTileFilter },

            { ui : this._groupModifyActDefenseAmount,                callback : this._onTouchedGroupModifyActDefenseAmount },
            { ui : this._btnActDefenseAmount,                        callback : this._onTouchedBtnActDefenseAmount },

            { ui : this._groupModifyActDefenseUnitTypeArray,         callback : this._onTouchedGroupModifyActDefenseUnitTypeArray },
            { ui : this._btnActDefenseUnitTypeArray,                 callback : this._onTouchedBtnActDefenseUnitTypeArray },

            { ui : this._groupModifyActMaxCapturePoint,              callback : this._onTouchedGroupModifyActMaxCapturePoint },
            { ui : this._btnActMaxCapturePoint,                      callback : this._onTouchedBtnActMaxCapturePoint },

            { ui : this._groupModifyActIsDefeatedOnCapture,          callback : this._onTouchedGroupModifyActIsDefeatedOnCapture },
            { ui : this._btnActIsDefeatedOnCapture,                  callback : this._onTouchedBtnActIsDefeatedOnCapture },

            { ui : this._groupModifyActRepairNormalizedHp,           callback : this._onTouchedGroupModifyActRepairNormalizedHp },
            { ui : this._btnActRepairNormalizedHp,                   callback : this._onTouchedBtnActRepairNormalized },

            { ui : this._groupModifyActRepairUnitTypeArray,          callback : this._onTouchedGroupModifyActRepairUnitTypeArray },
            { ui : this._btnActRepairUnitTypeArray,                  callback : this._onTouchedBtnActRepairUnitTypeArray },

            { ui : this._groupModifyActIncomePerTurn,                callback : this._onTouchedGroupModifyActIncomePerTurn },
            { ui : this._btnActIncomePerTurn,                        callback : this._onTouchedBtnActIncomePerTurn },

            { ui : this._groupModifyActVisionRange,                  callback : this._onTouchedGroupModifyActVisionRange },
            { ui : this._btnActVisionRange,                          callback : this._onTouchedBtnActVisionRange },

            { ui : this._groupModifyActIsVisionEnabledForAllPlayers, callback : this._onTouchedGroupModifyActIsVisionEnabledForAllPlayers },
            { ui : this._btnActIsVisionEnabledForAllPlayers,         callback : this._onTouchedBtnActIsVisionEnabledForAllPlayers },

            { ui : this._groupModifyActHideUnitTypeArray,            callback : this._onTouchedGroupModifyActHideUnitTypeArray },
            { ui : this._btnActHideUnitTypeArray,                    callback : this._onTouchedBtnActHideUnitTypeArray },

            { ui : this._groupModifyActProduceUnitTypeArray,         callback : this._onTouchedGroupModifyActProduceUnitTypeArray },
            { ui : this._btnActProduceUnitTypeArray,                 callback : this._onTouchedBtnActProduceUnitTypeArray },

            { ui : this._groupModifyActGlobalAttackBonus,            callback : this._onTouchedGroupModifyActGlobalAttackBonus },
            { ui : this._btnActGlobalAttackBonus,                    callback : this._onTouchedBtnActGlobalAttackBonus },

            { ui : this._groupModifyActGlobalDefenseBonus,           callback : this._onTouchedGroupModifyActGlobalDefenseBonus },
            { ui : this._btnActGlobalDefenseBonus,                   callback : this._onTouchedBtnActGlobalDefenseBonus },

            { ui : this._groupModifyActUnitTypeArrayForCoBoard,      callback : this._onTouchedGroupModifyActUnitTypeArrayForCoBoard },
            { ui : this._btnActUnitTypeArrayForCoBoard,              callback : this._onTouchedBtnActUnitTypeArrayForCoBoard },

            { ui : this._groupModifyActBlockEnemyUnitTypeArray,      callback : this._onTouchedGroupModifyActBlockEnemyUnitTypeArray },
            { ui : this._btnActBlockEnemyUnitTypeArray,              callback : this._onTouchedBtnActBlockEnemyUnitTypeArray },
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
            currentValue   : action.getConTileFilter(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ConTileFilter,
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

    private _onTouchedBtnActDefenseAmount(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0662),
        });
    }
    private _onTouchedGroupModifyActDefenseAmount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActDefenseAmount(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActDefenseAmount() != text) {
                    action.setActDefenseAmount(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDefenseUnitTypeArray(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0662),
        });
    }
    private _onTouchedGroupModifyActDefenseUnitTypeArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActDefenseUnitTypeArray(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActDefenseUnitTypeArray() != text) {
                    action.setActDefenseUnitTypeArray(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMaxCapturePoint(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0687),
        });
    }
    private _onTouchedGroupModifyActMaxCapturePoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActMaxCapturePoint(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActMaxCapturePoint() != text) {
                    action.setActMaxCapturePoint(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsDefeatedOnCapture(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0688),
        });
    }
    private _onTouchedGroupModifyActIsDefeatedOnCapture(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActIsDefeatedOnCapture(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActIsDefeatedOnCapture() != text) {
                    action.setActIsDefeatedOnCapture(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRepairNormalized(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0689),
        });
    }
    private _onTouchedGroupModifyActRepairNormalizedHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActRepairNormalizedHp(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActRepairNormalizedHp() != text) {
                    action.setActRepairNormalizedHp(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRepairUnitTypeArray(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0690),
        });
    }
    private _onTouchedGroupModifyActRepairUnitTypeArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActRepairUnitTypeArray(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActRepairUnitTypeArray() != text) {
                    action.setActRepairUnitTypeArray(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIncomePerTurn(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0691),
        });
    }
    private _onTouchedGroupModifyActIncomePerTurn(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActIncomePerTurn(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActIncomePerTurn() != text) {
                    action.setActIncomePerTurn(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActVisionRange(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0692),
        });
    }
    private _onTouchedGroupModifyActVisionRange(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActVisionRange(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActVisionRange() != text) {
                    action.setActVisionRange(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsVisionEnabledForAllPlayers(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0693),
        });
    }
    private _onTouchedGroupModifyActIsVisionEnabledForAllPlayers(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActIsVisionEnabledForAllPlayers(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActIsVisionEnabledForAllPlayers() != text) {
                    action.setActIsVisionEnabledForAllPlayers(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActHideUnitTypeArray(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0693),
        });
    }
    private _onTouchedGroupModifyActHideUnitTypeArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActHideUnitTypeArray(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActHideUnitTypeArray() != text) {
                    action.setActHideUnitTypeArray(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActProduceUnitTypeArray(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0695),
        });
    }
    private _onTouchedGroupModifyActProduceUnitTypeArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActProduceUnitTypeArray(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActProduceUnitTypeArray() != text) {
                    action.setActProduceUnitTypeArray(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGlobalAttackBonus(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0695),
        });
    }
    private _onTouchedGroupModifyActGlobalAttackBonus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActGlobalAttackBonus(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActGlobalAttackBonus() != text) {
                    action.setActGlobalAttackBonus(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGlobalDefenseBonus(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0695),
        });
    }
    private _onTouchedGroupModifyActGlobalDefenseBonus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActGlobalDefenseBonus(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActGlobalDefenseBonus() != text) {
                    action.setActGlobalDefenseBonus(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnitTypeArrayForCoBoard(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0698),
        });
    }
    private _onTouchedGroupModifyActUnitTypeArrayForCoBoard(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActUnitTypeArrayForCoBoard(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActUnitTypeArrayForCoBoard() != text) {
                    action.setActUnitTypeArrayForCoBoard(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBlockEnemyUnitTypeArray(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0699),
        });
    }
    private _onTouchedGroupModifyActBlockEnemyUnitTypeArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActBlockEnemyUnitTypeArray(),
            expressionInfo : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActBlockEnemyUnitTypeArray() != text) {
                    action.setActBlockEnemyUnitTypeArray(text);
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

        this._btnConTileFilter.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActDefenseAmount.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount.getTitleText());
        this._btnActDefenseUnitTypeArray.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray.getTitleText());
        this._btnActMaxCapturePoint.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint.getTitleText());
        this._btnActIsDefeatedOnCapture.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture.getTitleText());
        this._btnActRepairNormalizedHp.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp.getTitleText());
        this._btnActRepairUnitTypeArray.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray.getTitleText());
        this._btnActIncomePerTurn.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn.getTitleText());
        this._btnActVisionRange.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange.getTitleText());
        this._btnActIsVisionEnabledForAllPlayers.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers.getTitleText());
        this._btnActHideUnitTypeArray.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray.getTitleText());
        this._btnActProduceUnitTypeArray.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray.getTitleText());
        this._btnActGlobalAttackBonus.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus.getTitleText());
        this._btnActGlobalDefenseBonus.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus.getTitleText());
        this._btnActUnitTypeArrayForCoBoard.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard.getTitleText());
        this._btnActBlockEnemyUnitTypeArray.setText(WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray.getTitleText());

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
            const label = this._labelActDefenseAmount;
            label.setText(action.getActDefenseAmount() ?? ``);
            this._groupActDefenseAmount.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActDefenseUnitTypeArray;
            label.setText(action.getActDefenseUnitTypeArray() ?? ``);
            this._groupActDefenseUnitTypeArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActMaxCapturePoint;
            label.setText(action.getActMaxCapturePoint() ?? ``);
            this._groupActMaxCapturePoint.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsDefeatedOnCapture;
            label.setText(action.getActIsDefeatedOnCapture() ?? ``);
            this._groupActIsDefeatedOnCapture.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActRepairNormalizedHp;
            label.setText(action.getActRepairNormalizedHp() ?? ``);
            this._groupActRepairNormalizedHp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActRepairUnitTypeArray;
            label.setText(action.getActRepairUnitTypeArray() ?? ``);
            this._groupActRepairUnitTypeArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIncomePerTurn;
            label.setText(action.getActIncomePerTurn() ?? ``);
            this._groupActIncomePerTurn.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActVisionRange;
            label.setText(action.getActVisionRange() ?? ``);
            this._groupActVisionRange.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsVisionEnabledForAllPlayers;
            label.setText(action.getActIsVisionEnabledForAllPlayers() ?? ``);
            this._groupActIsVisionEnabledForAllPlayers.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActHideUnitTypeArray;
            label.setText(action.getActHideUnitTypeArray() ?? ``);
            this._groupActHideUnitTypeArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActProduceUnitTypeArray;
            label.setText(action.getActProduceUnitTypeArray() ?? ``);
            this._groupActProduceUnitTypeArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActGlobalAttackBonus;
            label.setText(action.getActGlobalAttackBonus() ?? ``);
            this._groupActGlobalAttackBonus.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActGlobalDefenseBonus;
            label.setText(action.getActGlobalDefenseBonus() ?? ``);
            this._groupActGlobalDefenseBonus.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActUnitTypeArrayForCoBoard;
            label.setText(action.getActUnitTypeArrayForCoBoard() ?? ``);
            this._groupActUnitTypeArrayForCoBoard.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActBlockEnemyUnitTypeArray;
            label.setText(action.getActBlockEnemyUnitTypeArray() ?? ``);
            this._groupActBlockEnemyUnitTypeArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateExpr> {
        return this.getOpenData()?.action.getWeaSetCustomBuildingStateExpr();
    }
}
