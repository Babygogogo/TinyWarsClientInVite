import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetCustomCrystalStateExpr,
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
import type { WeaSetCustomCrystalStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateExpr.ts";

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

    private readonly _groupActRadius!                               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActRadius!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActRadius!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActRadius!                               : Ui_Interfaces_IUiLabel.IUiLabel;

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

    private readonly _groupActOffsetFund!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetFund!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActOffsetFund!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetFund!                           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActOffsetEnergyPercentage!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetEnergyPercentage!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActOffsetEnergyPercentage!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetEnergyPercentage!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActOffsetHp!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetHp!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActOffsetHp!                               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetHp!                             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActOffsetFuelPercentage!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetFuelPercentage!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActOffsetFuelPercentage!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetFuelPercentage!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActOffsetPrimaryAmmoPercentage!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActOffsetPrimaryAmmoPercentage!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActOffsetPrimaryAmmoPercentage!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActOffsetPrimaryAmmoPercentage!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActCanBeFatal!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCanBeFatal!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActCanBeFatal!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanBeFatal!                           : Ui_Interfaces_IUiLabel.IUiLabel;

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

            { ui: this._groupModifyActRadius,                       callback: this._onTouchedGroupModifyActRadius },
            { ui: this._btnActRadius,                               callback: this._onTouchedBtnActRadius },

            { ui: this._groupModifyActPriority,                     callback: this._onTouchedGroupModifyActPriority },
            { ui: this._btnActPriority,                             callback: this._onTouchedBtnActPriority },

            { ui: this._groupModifyActCanAffectSelf,                callback: this._onTouchedGroupModifyActCanAffectSelf },
            { ui: this._btnActCanAffectSelf,                        callback: this._onTouchedBtnActCanAffectSelf },

            { ui: this._groupModifyActCanAffectAlly,                callback: this._onTouchedGroupModifyActCanAffectAlly },
            { ui: this._btnActCanAffectAlly,                        callback: this._onTouchedBtnActCanAffectAlly },

            { ui: this._groupModifyActCanAffectEnemy,               callback: this._onTouchedGroupModifyActCanAffectEnemy },
            { ui: this._btnActCanAffectEnemy,                       callback: this._onTouchedBtnActCanAffectEnemy },

            { ui: this._groupModifyActOffsetFund,                   callback: this._onTouchedGroupModifyActOffsetFund },
            { ui: this._btnActOffsetFund,                           callback: this._onTouchedBtnActOffsetFund },

            { ui: this._groupModifyActOffsetEnergyPercentage,       callback: this._onTouchedGroupModifyActOffsetEnergyPercentage },
            { ui: this._btnActOffsetEnergyPercentage,               callback: this._onTouchedBtnActOffsetEnergyPercentage },

            { ui: this._groupModifyActOffsetHp,                     callback: this._onTouchedGroupModifyActOffsetHp },
            { ui: this._btnActOffsetHp,                             callback: this._onTouchedBtnActOffsetHp },

            { ui: this._groupModifyActOffsetFuelPercentage,         callback: this._onTouchedGroupModifyActOffsetFuelPercentage },
            { ui: this._btnActOffsetFuelPercentage,                 callback: this._onTouchedBtnActOffsetFuelPercentage },

            { ui: this._groupModifyActOffsetPrimaryAmmoPercentage,  callback: this._onTouchedGroupModifyActOffsetPrimaryAmmoPercentage },
            { ui: this._btnActOffsetPrimaryAmmoPercentage,          callback: this._onTouchedBtnActOffsetPrimaryAmmoPercentage },

            { ui: this._groupModifyActCanBeFatal,                   callback: this._onTouchedGroupModifyActCanBeFatal },
            { ui: this._btnActCanBeFatal,                           callback: this._onTouchedBtnActCanBeFatal },
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ConTileFilter,
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

    private _onTouchedBtnActRadius(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0670),
        });
    }
    private _onTouchedGroupModifyActRadius(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRadius(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRadius() != text) {
                    action.setActRadius(text);
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority,
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf,
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly,
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy,
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

    private _onTouchedBtnActOffsetFund(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0675),
        });
    }
    private _onTouchedGroupModifyActOffsetFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetFund(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetFund() != text) {
                    action.setActOffsetFund(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActOffsetEnergyPercentage(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0676),
        });
    }
    private _onTouchedGroupModifyActOffsetEnergyPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActOffsetEnergyPercentage(),
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActOffsetEnergyPercentage() != text) {
                    action.setActOffsetEnergyPercentage(text);
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp,
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage,
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
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

    private _onTouchedBtnActCanBeFatal(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal.getHelpText,
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
            expressionInfo  : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal,
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

        this._btnConTileFilter.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActRadius.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius.getTitleText());
        this._btnActPriority.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority.getTitleText());
        this._btnActCanAffectSelf.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf.getTitleText());
        this._btnActCanAffectAlly.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly.getTitleText());
        this._btnActCanAffectEnemy.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy.getTitleText());
        this._btnActOffsetFund.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund.getTitleText());
        this._btnActOffsetEnergyPercentage.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage.getTitleText());
        this._btnActOffsetHp.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp.getTitleText());
        this._btnActOffsetFuelPercentage.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText());
        this._btnActOffsetPrimaryAmmoPercentage.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText());
        this._btnActCanBeFatal.setText(WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal.getTitleText());

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
            const label = this._labelActRadius;
            label.setText(action.getActRadius() ?? ``);
            this._groupActRadius.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
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
            const label = this._labelActOffsetFund;
            label.setText(action.getActOffsetFund() ?? ``);
            this._groupActOffsetFund.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetEnergyPercentage;
            label.setText(action.getActOffsetEnergyPercentage() ?? ``);
            this._groupActOffsetEnergyPercentage.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActOffsetHp;
            label.setText(action.getActOffsetHp() ?? ``);
            this._groupActOffsetHp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
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
        {
            const label = this._labelActCanBeFatal;
            label.setText(action.getActCanBeFatal() ?? ``);
            this._groupActCanBeFatal.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateExpr> {
        return this.getOpenData()?.action.getWeaSetCustomCrystalStateExpr();
    }
}
