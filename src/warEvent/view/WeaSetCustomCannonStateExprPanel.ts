import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetCustomCannonStateExpr,
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
import type { WeaSetCustomCannonStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateExpr.ts";

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

    private readonly _groupActRangeForUp!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActRangeForUp!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActRangeForUp!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRangeForUp!                           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActRangeForDown!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActRangeForDown!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActRangeForDown!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRangeForDown!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActRangeForLeft!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActRangeForLeft!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActRangeForLeft!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRangeForLeft!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActRangeForRight!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActRangeForRight!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActRangeForRight!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRangeForRight!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActPriority!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActPriority!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActPriority!                               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActPriority!                             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActCanAffectSelf!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCanAffectSelf!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActCanAffectSelf!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanAffectSelf!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActCanAffectAlly!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCanAffectAlly!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActCanAffectAlly!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanAffectAlly!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActCanAffectEnemy!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCanAffectEnemy!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActCanAffectEnemy!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanAffectEnemy!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActMaxTargetCount!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActMaxTargetCount!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActMaxTargetCount!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActMaxTargetCount!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActOffsetHp!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetHp!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActOffsetHp!                               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetHp!                             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActCanBeFatal!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCanBeFatal!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActCanBeFatal!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanBeFatal!                           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActOffsetFuelPercentage!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetFuelPercentage!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActOffsetFuelPercentage!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetFuelPercentage!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActOffsetPrimaryAmmoPercentage!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetPrimaryAmmoPercentage!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActOffsetPrimaryAmmoPercentage!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetPrimaryAmmoPercentage!          : Ui_Interfaces_IUiLabel.IUiLabel;

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

            { ui: this._groupModifyActRangeForUp,                   callback: this._onTouchedGroupModifyActRangeForUp },
            { ui: this._btnActRangeForUp,                           callback: this._onTouchedBtnActRangeForUp },

            { ui: this._groupModifyActRangeForDown,                 callback: this._onTouchedGroupModifyActRangeForDown },
            { ui: this._btnActRangeForDown,                         callback: this._onTouchedBtnActRangeForDown },

            { ui: this._groupModifyActRangeForLeft,                 callback: this._onTouchedGroupModifyActRangeForLeft },
            { ui: this._btnActRangeForLeft,                         callback: this._onTouchedBtnActRangeForLeft },

            { ui: this._groupModifyActRangeForRight,                callback: this._onTouchedGroupModifyActRangeForRight },
            { ui: this._btnActRangeForRight,                        callback: this._onTouchedBtnActRangeForRight },

            { ui: this._groupModifyActPriority,                     callback: this._onTouchedGroupModifyActPriority },
            { ui: this._btnActPriority,                             callback: this._onTouchedBtnActPriority },

            { ui: this._groupModifyActCanAffectSelf,                callback: this._onTouchedGroupModifyActCanAffectSelf },
            { ui: this._btnActCanAffectSelf,                        callback: this._onTouchedBtnActCanAffectSelf },

            { ui: this._groupModifyActCanAffectAlly,                callback: this._onTouchedGroupModifyActCanAffectAlly },
            { ui: this._btnActCanAffectAlly,                        callback: this._onTouchedBtnActCanAffectAlly },

            { ui: this._groupModifyActCanAffectEnemy,               callback: this._onTouchedGroupModifyActCanAffectEnemy },
            { ui: this._btnActCanAffectEnemy,                       callback: this._onTouchedBtnActCanAffectEnemy },

            { ui: this._groupModifyActMaxTargetCount,               callback: this._onTouchedGroupModifyActMaxTargetCount },
            { ui: this._btnActMaxTargetCount,                       callback: this._onTouchedBtnActMaxTargetCount },

            { ui: this._groupModifyActOffsetHp,                     callback: this._onTouchedGroupModifyActOffsetHp },
            { ui: this._btnActOffsetHp,                             callback: this._onTouchedBtnActOffsetHp },

            { ui: this._groupModifyActCanBeFatal,                   callback: this._onTouchedGroupModifyActCanBeFatal },
            { ui: this._btnActCanBeFatal,                           callback: this._onTouchedBtnActCanBeFatal },

            { ui: this._groupModifyActOffsetFuelPercentage,         callback: this._onTouchedGroupModifyActOffsetFuelPercentage },
            { ui: this._btnActOffsetFuelPercentage,                 callback: this._onTouchedBtnActOffsetFuelPercentage },

            { ui: this._groupModifyActOffsetPrimaryAmmoPercentage,  callback: this._onTouchedGroupModifyActOffsetPrimaryAmmoPercentage },
            { ui: this._btnActOffsetPrimaryAmmoPercentage,          callback: this._onTouchedBtnActOffsetPrimaryAmmoPercentage },
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ConTileFilter,
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

    private _onTouchedBtnActRangeForUp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0680),
        });
    }
    private _onTouchedGroupModifyActRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRangeForUp(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForUp,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRangeForUp() != text) {
                    action.setActRangeForUp(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRangeForDown(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0681),
        });
    }
    private _onTouchedGroupModifyActRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRangeForDown(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForDown,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRangeForDown() != text) {
                    action.setActRangeForDown(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRangeForLeft(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0682),
        });
    }
    private _onTouchedGroupModifyActRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRangeForLeft(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForLeft,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRangeForLeft() != text) {
                    action.setActRangeForLeft(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRangeForRight(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0683),
        });
    }
    private _onTouchedGroupModifyActRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRangeForRight(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForRight,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRangeForRight() != text) {
                    action.setActRangeForRight(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActPriority(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0671),
        });
    }
    private _onTouchedGroupModifyActPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPriority(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActPriority,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPriority() != text) {
                    action.setActPriority(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAffectSelf(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0672),
        });
    }
    private _onTouchedGroupModifyActCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAffectSelf(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectSelf,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAffectSelf() != text) {
                    action.setActCanAffectSelf(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAffectAlly(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0673),
        });
    }
    private _onTouchedGroupModifyActCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAffectAlly(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectAlly,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAffectAlly() != text) {
                    action.setActCanAffectAlly(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAffectEnemy(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0674),
        });
    }
    private _onTouchedGroupModifyActCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanAffectEnemy(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectEnemy,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanAffectEnemy() != text) {
                    action.setActCanAffectEnemy(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMaxTargetCount(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0684),
        });
    }
    private _onTouchedGroupModifyActMaxTargetCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActMaxTargetCount(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActMaxTargetCount,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActMaxTargetCount() != text) {
                    action.setActMaxTargetCount(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetHp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0677),
        });
    }
    private _onTouchedGroupModifyActOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetHp(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetHp,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetHp() != text) {
                    action.setActOffsetHp(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanBeFatal(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanBeFatal.getHelpText,
        });
    }
    private _onTouchedGroupModifyActCanBeFatal(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanBeFatal(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanBeFatal,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanBeFatal() != text) {
                    action.setActCanBeFatal(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetFuelPercentage(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0677),
        });
    }
    private _onTouchedGroupModifyActOffsetFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetFuelPercentage(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetFuelPercentage() != text) {
                    action.setActOffsetFuelPercentage(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetPrimaryAmmoPercentage(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0677),
        });
    }
    private _onTouchedGroupModifyActOffsetPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetPrimaryAmmoPercentage() != text) {
                    action.setActOffsetPrimaryAmmoPercentage(text);
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

        this._btnConTileFilter.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActRangeForUp.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForUp.getTitleText());
        this._btnActRangeForDown.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForDown.getTitleText());
        this._btnActRangeForLeft.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForLeft.getTitleText());
        this._btnActRangeForRight.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForRight.getTitleText());
        this._btnActPriority.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActPriority.getTitleText());
        this._btnActCanAffectSelf.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectSelf.getTitleText());
        this._btnActCanAffectAlly.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectAlly.getTitleText());
        this._btnActCanAffectEnemy.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectEnemy.getTitleText());
        this._btnActMaxTargetCount.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActMaxTargetCount.getTitleText());
        this._btnActOffsetHp.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetHp.getTitleText());
        this._btnActCanBeFatal.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanBeFatal.getTitleText());
        this._btnActOffsetFuelPercentage.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText());
        this._btnActOffsetPrimaryAmmoPercentage.setText(WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText());

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
            const label = this._labelActRangeForUp;
            label.setText(action.getActRangeForUp() ?? ``);
            this._groupActRangeForUp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActRangeForDown;
            label.setText(action.getActRangeForDown() ?? ``);
            this._groupActRangeForDown.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActRangeForLeft;
            label.setText(action.getActRangeForLeft() ?? ``);
            this._groupActRangeForLeft.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActRangeForRight;
            label.setText(action.getActRangeForRight() ?? ``);
            this._groupActRangeForRight.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActPriority;
            label.setText(action.getActPriority() ?? ``);
            this._groupActPriority.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanAffectSelf;
            label.setText(action.getActCanAffectSelf() ?? ``);
            this._groupActCanAffectSelf.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanAffectAlly;
            label.setText(action.getActCanAffectAlly() ?? ``);
            this._groupActCanAffectAlly.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanAffectEnemy;
            label.setText(action.getActCanAffectEnemy() ?? ``);
            this._groupActCanAffectEnemy.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActMaxTargetCount;
            label.setText(action.getActMaxTargetCount() ?? ``);
            this._groupActMaxTargetCount.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetHp;
            label.setText(action.getActOffsetHp() ?? ``);
            this._groupActOffsetHp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanBeFatal;
            label.setText(action.getActCanBeFatal() ?? ``);
            this._groupActCanBeFatal.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetFuelPercentage;
            label.setText(action.getActOffsetFuelPercentage() ?? ``);
            this._groupActOffsetFuelPercentage.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetPrimaryAmmoPercentage;
            label.setText(action.getActOffsetPrimaryAmmoPercentage() ?? ``);
            this._groupActOffsetPrimaryAmmoPercentage.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCannonStateExpr> {
        return this.getOpenData()?.action.getWeaSetCustomCannonStateExpr();
    }
}
