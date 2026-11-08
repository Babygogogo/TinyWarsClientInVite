import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_PersistentModifyUnitAttribute,
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
import type { WeaPersistentModifyUnitAttribute } from "../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyUnitAttribute.ts";

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

    private readonly _layoutConIsEffectiveInMpw!                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnConIsEffectiveInMpw!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsEffectiveInMpw!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupConUnitFilter!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyConUnitFilter!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnConUnitFilter!                         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitFilter!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActAttackPowerModifier!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActAttackPowerModifier!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActAttackPowerModifier!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActAttackPowerModifier!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActDefenseModifier!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActDefenseModifier!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActDefenseModifier!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActDefenseModifier!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActMaxAttackRangeModifier!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActMaxAttackRangeModifier!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActMaxAttackRangeModifier!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActMaxAttackRangeModifier!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActCanAttackAfterMoving!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCanAttackAfterMoving!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActCanAttackAfterMoving!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanAttackAfterMoving!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActMoveRangeModifier!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActMoveRangeModifier!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActMoveRangeModifier!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActMoveRangeModifier!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActLuckLowerLimitModifier!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActLuckLowerLimitModifier!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActLuckLowerLimitModifier!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActLuckLowerLimitModifier!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActLuckUpperLimitModifier!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActLuckUpperLimitModifier!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActLuckUpperLimitModifier!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActLuckUpperLimitModifier!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActVisionRangeModifier!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActVisionRangeModifier!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActVisionRangeModifier!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActVisionRangeModifier!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActIsPenetratingVision!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActIsPenetratingVision!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActIsPenetratingVision!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActIsPenetratingVision!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActFlareRangeModifier!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActFlareRangeModifier!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActFlareRangeModifier!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActFlareRangeModifier!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActFlareRadiusModifier!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActFlareRadiusModifier!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActFlareRadiusModifier!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActFlareRadiusModifier!              : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged", callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                   callback : this.closePanel },
            { ui : this._btnType,                                    callback : this._onTouchedBtnType },
            { ui : this._btnIdentifier,                              callback : this._onTouchedBtnIdentifier },
            { ui : this._btnConIsEffectiveInMpw,                     callback : this._onTouchedBtnConIsEffectiveInMpw },

            { ui : this._groupModifyConUnitFilter,                   callback : this._onTouchedGroupModifyConUnitFilter },
            { ui : this._btnConUnitFilter,                           callback : this._onTouchedBtnConUnitFilter },

            { ui : this._groupModifyActAttackPowerModifier,          callback : this._onTouchedGroupModifyActAttackPowerModifier },
            { ui : this._btnActAttackPowerModifier,                  callback : this._onTouchedBtnActAttackPowerModifier },

            { ui : this._groupModifyActDefenseModifier,              callback : this._onTouchedGroupModifyActDefenseModifier },
            { ui : this._btnActDefenseModifier,                      callback : this._onTouchedBtnActDefenseModifier },

            { ui : this._groupModifyActMaxAttackRangeModifier,       callback : this._onTouchedGroupModifyActMaxAttackRangeModifier },
            { ui : this._btnActMaxAttackRangeModifier,               callback : this._onTouchedBtnActMaxAttackRangeModifier },

            { ui : this._groupModifyActCanAttackAfterMoving,         callback : this._onTouchedGroupModifyActCanAttackAfterMoving },
            { ui : this._btnActCanAttackAfterMoving,                 callback : this._onTouchedBtnActCanAttackAfterMoving },

            { ui : this._groupModifyActMoveRangeModifier,            callback : this._onTouchedGroupModifyActMoveRangeModifier },
            { ui : this._btnActMoveRangeModifier,                    callback : this._onTouchedBtnActMoveRangeModifier },

            { ui : this._groupModifyActLuckLowerLimitModifier,       callback : this._onTouchedGroupModifyActLuckLowerLimitModifier },
            { ui : this._btnActLuckLowerLimitModifier,               callback : this._onTouchedBtnActLuckLowerLimitModifier },

            { ui : this._groupModifyActLuckUpperLimitModifier,       callback : this._onTouchedGroupModifyActLuckUpperLimitModifier },
            { ui : this._btnActLuckUpperLimitModifier,               callback : this._onTouchedBtnActLuckUpperLimitModifier },

            { ui : this._groupModifyActVisionRangeModifier,          callback : this._onTouchedGroupModifyActVisionRangeModifier },
            { ui : this._btnActVisionRangeModifier,                  callback : this._onTouchedBtnActVisionRangeModifier },

            { ui : this._groupModifyActIsPenetratingVision,          callback : this._onTouchedGroupModifyActIsPenetratingVision },
            { ui : this._btnActIsPenetratingVision,                  callback : this._onTouchedBtnActIsPenetratingVision },

            { ui : this._groupModifyActFlareRangeModifier,           callback : this._onTouchedGroupModifyActFlareRangeModifier },
            { ui : this._btnActFlareRangeModifier,                   callback : this._onTouchedBtnActFlareRangeModifier },

            { ui : this._groupModifyActFlareRadiusModifier,          callback : this._onTouchedGroupModifyActFlareRadiusModifier },
            { ui : this._btnActFlareRadiusModifier,                  callback : this._onTouchedBtnActFlareRadiusModifier },
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
            contextType : ExpressionParsers_Enums.ContextType.Unit,
        });
    }
    private _onTouchedBtnConIsEffectiveInMpw(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        if (action.getIsEffectiveInMpw()) {
            action.setIsEffectiveInMpw(null);
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0538),
                callback   : () => {
                    action.setIsEffectiveInMpw(true);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            });
        }
    }

    private _onTouchedBtnConUnitFilter(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0539),
        });
    }
    private _onTouchedGroupModifyConUnitFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getConUnitFilter(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ConUnitFilter,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getConUnitFilter() != text) {
                    action.setConUnitFilter(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAttackPowerModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActAttackPowerModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActAttackPowerModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActAttackPowerModifier() != text) {
                    action.setActAttackPowerModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDefenseModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActDefenseModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActDefenseModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActDefenseModifier() != text) {
                    action.setActDefenseModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMaxAttackRangeModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0543),
        });
    }
    private _onTouchedGroupModifyActMaxAttackRangeModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActMaxAttackRangeModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActMaxAttackRangeModifier() != text) {
                    action.setActMaxAttackRangeModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanAttackAfterMoving(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0548),
        });
    }
    private _onTouchedGroupModifyActCanAttackAfterMoving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActCanAttackAfterMoving(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActCanAttackAfterMoving() != text) {
                    action.setActCanAttackAfterMoving(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMoveRangeModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActMoveRangeModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActMoveRangeModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActMoveRangeModifier() != text) {
                    action.setActMoveRangeModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActLuckLowerLimitModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActLuckLowerLimitModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActLuckLowerLimitModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActLuckLowerLimitModifier() != text) {
                    action.setActLuckLowerLimitModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActLuckUpperLimitModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActLuckUpperLimitModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActLuckUpperLimitModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActLuckUpperLimitModifier() != text) {
                    action.setActLuckUpperLimitModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActVisionRangeModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0643),
        });
    }
    private _onTouchedGroupModifyActVisionRangeModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActVisionRangeModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActVisionRangeModifier() != text) {
                    action.setActVisionRangeModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsPenetratingVision(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0644),
        });
    }
    private _onTouchedGroupModifyActIsPenetratingVision(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActIsPenetratingVision(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActIsPenetratingVision() != text) {
                    action.setActIsPenetratingVision(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFlareRangeModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActFlareRangeModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActFlareRangeModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActFlareRangeModifier() != text) {
                    action.setActFlareRangeModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFlareRadiusModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActFlareRadiusModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActFlareRadiusModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActFlareRadiusModifier() != text) {
                    action.setActFlareRadiusModifier(text);
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
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnIdentifier.setLangText(Lang_Constants.TextType.B0131);
        this._btnConIsEffectiveInMpw.setLangText(Lang_Constants.TextType.B1170);
        this._btnConUnitFilter.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ConUnitFilter.getTitleText());
        this._btnActAttackPowerModifier.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier.getTitleText());
        this._btnActDefenseModifier.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier.getTitleText());
        this._btnActMaxAttackRangeModifier.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier.getTitleText());
        this._btnActCanAttackAfterMoving.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving.getTitleText());
        this._btnActMoveRangeModifier.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier.getTitleText());
        this._btnActLuckLowerLimitModifier.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier.getTitleText());
        this._btnActLuckUpperLimitModifier.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier.getTitleText());
        this._btnActVisionRangeModifier.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier.getTitleText());
        this._btnActIsPenetratingVision.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision.getTitleText());
        this._btnActFlareRangeModifier.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier.getTitleText());
        this._btnActFlareRadiusModifier.setText(WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier.getTitleText());

        this._updateLabelDescAndLabelError();
        this._updateLabelConIsEffectiveInMpw();
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

    private _updateLabelConIsEffectiveInMpw(): void {
        this._labelConIsEffectiveInMpw.setLangText(this.getAction()?.getIsEffectiveInMpw() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._layoutConIsEffectiveInMpw.arrangeItems();
    }

    private _updateInputs(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        {
            const label = this._labelConUnitFilter;
            label.setText(action.getConUnitFilter() ?? ``);
            this._groupConUnitFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActAttackPowerModifier;
            label.setText(action.getActAttackPowerModifier() ?? ``);
            this._groupActAttackPowerModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActDefenseModifier;
            label.setText(action.getActDefenseModifier() ?? ``);
            this._groupActDefenseModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActMaxAttackRangeModifier;
            label.setText(action.getActMaxAttackRangeModifier() ?? ``);
            this._groupActMaxAttackRangeModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanAttackAfterMoving;
            label.setText(action.getActCanAttackAfterMoving() ?? ``);
            this._groupActCanAttackAfterMoving.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActMoveRangeModifier;
            label.setText(action.getActMoveRangeModifier() ?? ``);
            this._groupActMoveRangeModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActLuckLowerLimitModifier;
            label.setText(action.getActLuckLowerLimitModifier() ?? ``);
            this._groupActLuckLowerLimitModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActLuckUpperLimitModifier;
            label.setText(action.getActLuckUpperLimitModifier() ?? ``);
            this._groupActLuckUpperLimitModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActVisionRangeModifier;
            label.setText(action.getActVisionRangeModifier() ?? ``);
            this._groupActVisionRangeModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsPenetratingVision;
            label.setText(action.getActIsPenetratingVision() ?? ``);
            this._groupActIsPenetratingVision.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActFlareRangeModifier;
            label.setText(action.getActFlareRangeModifier() ?? ``);
            this._groupActFlareRangeModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActFlareRadiusModifier;
            label.setText(action.getActFlareRadiusModifier() ?? ``);
            this._groupActFlareRadiusModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentModifyUnitAttribute> {
        return this.getOpenData()?.action.getWeaPersistentModifyUnitAttribute();
    }
}
