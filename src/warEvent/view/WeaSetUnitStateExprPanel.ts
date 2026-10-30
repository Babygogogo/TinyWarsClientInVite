import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_SetUnitStateExpr,
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
import type { WeaSetUnitStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateExpr.ts";

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

    private readonly _groupConUnitFilter!                               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyConUnitFilter!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnConUnitFilter!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConUnitFilter!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActActionState!                              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActActionState!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActActionState!                              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActActionState!                                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCurrentHp!                                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentHp!                          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCurrentHp!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCurrentHp!                                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActPrimaryWeaponCurrentAmmo!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActPrimaryWeaponCurrentAmmo!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActPrimaryWeaponCurrentAmmo!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActPrimaryWeaponCurrentAmmo!                   : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActFlareCurrentAmmo!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActFlareCurrentAmmo!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActFlareCurrentAmmo!                         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActFlareCurrentAmmo!                           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCurrentFuel!                              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentFuel!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCurrentFuel!                              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCurrentFuel!                                : Ui_Interfaces_IUiButton.IUiButton;

    // private readonly _groupActIsCapturingTile!                          : Ui.Interfaces.IUiContainer;
    // private readonly _groupModifyActIsCapturingTile!                    : Ui.Interfaces.IUiContainer;
    // private readonly _btnActIsCapturingTile!                            : Ui.Interfaces.IUiButton;
    // private readonly _labelActIsCapturingTile!                          : Ui.Interfaces.IUiLabel;

    private readonly _groupActIsDiving!                                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActIsDiving!                           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActIsDiving!                                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActIsDiving!                                   : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCurrentBuildMaterial!                     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentBuildMaterial!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCurrentBuildMaterial!                     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCurrentBuildMaterial!                       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCurrentProduceMaterial!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentProduceMaterial!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCurrentProduceMaterial!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCurrentProduceMaterial!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCurrentPromotion!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentPromotion!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCurrentPromotion!                         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCurrentPromotion!                           : Ui_Interfaces_IUiButton.IUiButton;

    // private readonly _groupActIsBuildingTile!                           : Ui.Interfaces.IUiContainer;
    // private readonly _groupModifyActIsBuildingTile!                     : Ui.Interfaces.IUiContainer;
    // private readonly _labelActIsBuildingTile!                           : Ui.Interfaces.IUiLabel;
    // private readonly _btnActIsBuildingTile!                             : Ui.Interfaces.IUiButton;

    private readonly _groupActIsCoOnboard!                              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActIsCoOnboard!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActIsCoOnboard!                              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActIsCoOnboard!                                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActAiMode!                                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActAiMode!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActAiMode!                                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActAiMode!                                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActCustomNameId!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCustomNameId!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActCustomNameId!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActCustomNameId!                               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActGroupedTagId!                             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActGroupedTagId!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActGroupedTagId!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActGroupedTagId!                               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActForbiddenGroupedLocationIdArray!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActForbiddenGroupedLocationIdArray!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActForbiddenGroupedLocationIdArray!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActForbiddenGroupedLocationIdArray!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActAiWeightedDestination!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActAiWeightedDestination!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActAiWeightedDestination!                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActAiWeightedDestination!                      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConUnitFilter,                       callback: this._onTouchedGroupModifyConUnitFilter },
            { ui: this._btnConUnitFilter,                               callback: this._onTouchedBtnConUnitFilter },

            { ui: this._groupModifyActActionState,                      callback: this._onTouchedGroupModifyActActionState },
            { ui: this._btnActActionState,                              callback: this._onTouchedBtnActActionState },

            { ui: this._groupModifyActCurrentHp,                        callback: this._onTouchedGroupModifyActCurrentHp },
            { ui: this._btnActCurrentHp,                                callback: this._onTouchedBtnActCurrentHp },

            { ui: this._groupModifyActPrimaryWeaponCurrentAmmo,         callback: this._onTouchedGroupModifyActPrimaryWeaponCurrentAmmo },
            { ui: this._btnActPrimaryWeaponCurrentAmmo,                 callback: this._onTouchedBtnActPrimaryWeaponCurrentAmmo },

            { ui: this._groupModifyActFlareCurrentAmmo,                 callback: this._onTouchedGroupModifyActFlareCurrentAmmo },
            { ui: this._btnActFlareCurrentAmmo,                         callback: this._onTouchedBtnActFlareCurrentAmmo },

            { ui: this._groupModifyActCurrentFuel,                      callback: this._onTouchedGroupModifyActCurrentFuel },
            { ui: this._btnActCurrentFuel,                              callback: this._onTouchedBtnActCurrentFuel },

            // { ui: this._groupModifyActIsCapturingTile,                  callback: this._onTouchedGroupModifyActIsCapturingTile },
            // { ui: this._btnActIsCapturingTile,                          callback: this._onTouchedBtnActIsCapturingTile },

            { ui: this._groupModifyActIsDiving,                         callback: this._onTouchedGroupModifyActIsDiving },
            { ui: this._btnActIsDiving,                                 callback: this._onTouchedBtnActIsDiving },

            { ui: this._groupModifyActCurrentBuildMaterial,             callback: this._onTouchedGroupModifyActCurrentBuildMaterial },
            { ui: this._btnActCurrentBuildMaterial,                     callback: this._onTouchedBtnActCurrentBuildMaterial },

            { ui: this._groupModifyActCurrentProduceMaterial,           callback: this._onTouchedGroupModifyActCurrentProduceMaterial },
            { ui: this._btnActCurrentProduceMaterial,                   callback: this._onTouchedBtnActCurrentProduceMaterial },

            { ui: this._groupModifyActCurrentPromotion,                 callback: this._onTouchedGroupModifyActCurrentPromotion },
            { ui: this._btnActCurrentPromotion,                         callback: this._onTouchedBtnActCurrentPromotion },

            // { ui: this._groupModifyActIsBuildingTile,                   callback: this._onTouchedGroupModifyActIsBuildingTile },
            // { ui: this._btnActIsBuildingTile,                           callback: this._onTouchedBtnActIsBuildingTile },

            { ui: this._groupModifyActIsCoOnboard,                      callback: this._onTouchedGroupModifyActIsCoOnboard },
            { ui: this._btnActIsCoOnboard,                              callback: this._onTouchedBtnActIsCoOnboard },

            { ui: this._groupModifyActAiMode,                           callback: this._onTouchedGroupModifyActAiMode },
            { ui: this._btnActAiMode,                                   callback: this._onTouchedBtnActAiMode },

            { ui: this._groupModifyActCustomNameId,                     callback: this._onTouchedGroupModifyActCustomNameId },
            { ui: this._btnActCustomNameId,                             callback: this._onTouchedBtnActCustomNameId },

            { ui: this._groupModifyActGroupedTagId,                     callback: this._onTouchedGroupModifyActGroupedTagId },
            { ui: this._btnActGroupedTagId,                             callback: this._onTouchedBtnActGroupedTagId },

            { ui: this._groupModifyActForbiddenGroupedLocationIdArray,  callback: this._onTouchedGroupModifyActForbiddenGroupedLocationIdArray },
            { ui: this._btnActForbiddenGroupedLocationIdArray,          callback: this._onTouchedBtnActForbiddenGroupedLocationIdArray },

            { ui: this._groupModifyActAiWeightedDestination,            callback: this._onTouchedGroupModifyActAiWeightedDestination },
            { ui: this._btnActAiWeightedDestination,                    callback: this._onTouchedBtnActAiWeightedDestination },
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

    private _onTouchedBtnConUnitFilter(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ConUnitFilter.getHelpText(),
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
            currentValue    : action.getConUnitFilter(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ConUnitFilter,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConUnitFilter() != text) {
                    action.setConUnitFilter(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActActionState(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActActionState.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActActionState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActActionState(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActActionState,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActActionState() != text) {
                    action.setActActionState(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentHp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentHp.getHelpText(),
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
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentHp,
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

    private _onTouchedBtnActPrimaryWeaponCurrentAmmo(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActPrimaryWeaponCurrentAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPrimaryWeaponCurrentAmmo() != text) {
                    action.setActPrimaryWeaponCurrentAmmo(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFlareCurrentAmmo(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActFlareCurrentAmmo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActFlareCurrentAmmo(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActFlareCurrentAmmo,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActFlareCurrentAmmo() != text) {
                    action.setActFlareCurrentAmmo(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentFuel(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentFuel.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentFuel(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentFuel(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentFuel,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentFuel() != text) {
                    action.setActCurrentFuel(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsCapturingTile(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCapturingTile.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsCapturingTile(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsCapturingTile(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCapturingTile,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsCapturingTile() != text) {
                    action.setActIsCapturingTile(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsDiving(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsDiving.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsDiving(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsDiving(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsDiving,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsDiving() != text) {
                    action.setActIsDiving(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentBuildMaterial(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentBuildMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentBuildMaterial(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentBuildMaterial,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentBuildMaterial() != text) {
                    action.setActCurrentBuildMaterial(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentProduceMaterial(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentProduceMaterial(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentProduceMaterial(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentProduceMaterial,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentProduceMaterial() != text) {
                    action.setActCurrentProduceMaterial(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentPromotion(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentPromotion.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentPromotion(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentPromotion(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentPromotion,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentPromotion() != text) {
                    action.setActCurrentPromotion(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsBuildingTile(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsBuildingTile.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsBuildingTile(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsBuildingTile(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsBuildingTile,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsBuildingTile() != text) {
                    action.setActIsBuildingTile(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsCoOnboard(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCoOnboard.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsCoOnboard(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsCoOnboard(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCoOnboard,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsCoOnboard() != text) {
                    action.setActIsCoOnboard(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAiMode(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiMode.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActAiMode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAiMode(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiMode,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAiMode() != text) {
                    action.setActAiMode(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCustomNameId(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCustomNameId.getHelpText(),
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
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCustomNameId,
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

    private _onTouchedBtnActGroupedTagId(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActGroupedTagId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActGroupedTagId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGroupedTagId(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActGroupedTagId,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGroupedTagId() != text) {
                    action.setActGroupedTagId(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActForbiddenGroupedLocationIdArray(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActForbiddenGroupedLocationIdArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActForbiddenGroupedLocationIdArray() != text) {
                    action.setActForbiddenGroupedLocationIdArray(text);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAiWeightedDestination(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiWeightedDestination.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActAiWeightedDestination(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAiWeightedDestination(),
            expressionInfo  : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiWeightedDestination,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAiWeightedDestination() != text) {
                    action.setActAiWeightedDestination(text);
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

        this._btnConUnitFilter.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ConUnitFilter.getTitleText());
        this._btnActActionState.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActActionState.getTitleText());
        this._btnActCurrentHp.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentHp.getTitleText());
        this._btnActPrimaryWeaponCurrentAmmo.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText());
        this._btnActFlareCurrentAmmo.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText());
        this._btnActCurrentFuel.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentFuel.getTitleText());
        // this._btnActIsCapturingTile.setText(PhWeaSetUnitState.ExpressionInfoDict.ActIsCapturingTile.getTitleText());
        this._btnActIsDiving.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsDiving.getTitleText());
        this._btnActCurrentBuildMaterial.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText());
        this._btnActCurrentProduceMaterial.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText());
        this._btnActCurrentPromotion.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentPromotion.getTitleText());
        // this._btnActIsBuildingTile.setText(PhWeaSetUnitState.ExpressionInfoDict.ActIsBuildingTile.getTitleText());
        this._btnActIsCoOnboard.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCoOnboard.getTitleText());
        this._btnActAiMode.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiMode.getTitleText());
        this._btnActCustomNameId.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCustomNameId.getTitleText());
        this._btnActGroupedTagId.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActGroupedTagId.getTitleText());
        this._btnActForbiddenGroupedLocationIdArray.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText());
        this._btnActAiWeightedDestination.setText(WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiWeightedDestination.getTitleText());

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
            const label = this._labelConUnitFilter;
            label.setText(action.getConUnitFilter() ?? ``);
            this._groupConUnitFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActActionState;
            label.setText(action.getActActionState() ?? ``);
            this._groupActActionState.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentHp;
            label.setText(action.getActCurrentHp() ?? ``);
            this._groupActCurrentHp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActPrimaryWeaponCurrentAmmo;
            label.setText(action.getActPrimaryWeaponCurrentAmmo() ?? ``);
            this._groupActPrimaryWeaponCurrentAmmo.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActFlareCurrentAmmo;
            label.setText(action.getActFlareCurrentAmmo() ?? ``);
            this._groupActFlareCurrentAmmo.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentFuel;
            label.setText(action.getActCurrentFuel() ?? ``);
            this._groupActCurrentFuel.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        // {
        //     const label = this._labelActIsCapturingTile;
        //     label.setText(action.getActIsCapturingTile() ?? ``);
        //     this._groupActIsCapturingTile.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        // }
        {
            const label = this._labelActIsDiving;
            label.setText(action.getActIsDiving() ?? ``);
            this._groupActIsDiving.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentBuildMaterial;
            label.setText(action.getActCurrentBuildMaterial() ?? ``);
            this._groupActCurrentBuildMaterial.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentProduceMaterial;
            label.setText(action.getActCurrentProduceMaterial() ?? ``);
            this._groupActCurrentProduceMaterial.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentPromotion;
            label.setText(action.getActCurrentPromotion() ?? ``);
            this._groupActCurrentPromotion.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        // {
        //     const label = this._labelActIsBuildingTile;
        //     label.setText(action.getActIsBuildingTile() ?? ``);
        //     this._groupActIsBuildingTile.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        // }
        {
            const label = this._labelActIsCoOnboard;
            label.setText(action.getActIsCoOnboard() ?? ``);
            this._groupActIsCoOnboard.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActAiMode;
            label.setText(action.getActAiMode() ?? ``);
            this._groupActAiMode.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCustomNameId;
            label.setText(action.getActCustomNameId() ?? ``);
            this._groupActCustomNameId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActGroupedTagId;
            label.setText(action.getActGroupedTagId() ?? ``);
            this._groupActGroupedTagId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActForbiddenGroupedLocationIdArray;
            label.setText(action.getActForbiddenGroupedLocationIdArray() ?? ``);
            this._groupActForbiddenGroupedLocationIdArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActAiWeightedDestination;
            label.setText(action.getActAiWeightedDestination() ?? ``);
            this._groupActAiWeightedDestination.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitStateExpr> {
        return this.getOpenData()?.action.getWeaSetUnitStateExpr();
    }
}
