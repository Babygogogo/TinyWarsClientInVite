import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as ExpressionParsersEnums from "../../expressionParsers/Enums.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateExpr from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateExpr.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsSetCustomBuildingStateExpr from "../../warEvents/actions/constants/SetCustomBuildingStateExpr.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData                   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction                     = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnIdentifier!                                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                                : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupCon!                                     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                     : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupConTileFilter!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConTileFilter!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnConTileFilter!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActDefenseAmount!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActDefenseAmount!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActDefenseAmount!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDefenseAmount!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActDefenseUnitTypeArray!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActDefenseUnitTypeArray!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActDefenseUnitTypeArray!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActDefenseUnitTypeArray!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActMaxCapturePoint!                      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActMaxCapturePoint!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActMaxCapturePoint!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActMaxCapturePoint!                      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActIsDefeatedOnCapture!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActIsDefeatedOnCapture!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActIsDefeatedOnCapture!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsDefeatedOnCapture!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActRepairNormalizedHp!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActRepairNormalizedHp!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActRepairNormalizedHp!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActRepairNormalizedHp!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActRepairUnitTypeArray!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActRepairUnitTypeArray!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActRepairUnitTypeArray!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActRepairUnitTypeArray!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActIncomePerTurn!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActIncomePerTurn!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActIncomePerTurn!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIncomePerTurn!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActVisionRange!                          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActVisionRange!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActVisionRange!                            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActVisionRange!                          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActIsVisionEnabledForAllPlayers!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActIsVisionEnabledForAllPlayers!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActIsVisionEnabledForAllPlayers!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsVisionEnabledForAllPlayers!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActHideUnitTypeArray!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActHideUnitTypeArray!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActHideUnitTypeArray!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActHideUnitTypeArray!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActProduceUnitTypeArray!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActProduceUnitTypeArray!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActProduceUnitTypeArray!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActProduceUnitTypeArray!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActGlobalAttackBonus!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActGlobalAttackBonus!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActGlobalAttackBonus!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActGlobalAttackBonus!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActGlobalDefenseBonus!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActGlobalDefenseBonus!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActGlobalDefenseBonus!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActGlobalDefenseBonus!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActUnitTypeArrayForCoBoard!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActUnitTypeArrayForCoBoard!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActUnitTypeArrayForCoBoard!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActUnitTypeArrayForCoBoard!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActBlockEnemyUnitTypeArray!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActBlockEnemyUnitTypeArray!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActBlockEnemyUnitTypeArray!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActBlockEnemyUnitTypeArray!              : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnType,                                    callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                              callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTileFilter,                   callback: this._onTouchedGroupModifyConTileFilter },
            { ui: this._btnConTileFilter,                           callback: this._onTouchedBtnConTileFilter },

            { ui: this._groupModifyActDefenseAmount,                callback: this._onTouchedGroupModifyActDefenseAmount },
            { ui: this._btnActDefenseAmount,                        callback: this._onTouchedBtnActDefenseAmount },

            { ui: this._groupModifyActDefenseUnitTypeArray,         callback: this._onTouchedGroupModifyActDefenseUnitTypeArray },
            { ui: this._btnActDefenseUnitTypeArray,                 callback: this._onTouchedBtnActDefenseUnitTypeArray },

            { ui: this._groupModifyActMaxCapturePoint,              callback: this._onTouchedGroupModifyActMaxCapturePoint },
            { ui: this._btnActMaxCapturePoint,                      callback: this._onTouchedBtnActMaxCapturePoint },

            { ui: this._groupModifyActIsDefeatedOnCapture,          callback: this._onTouchedGroupModifyActIsDefeatedOnCapture },
            { ui: this._btnActIsDefeatedOnCapture,                  callback: this._onTouchedBtnActIsDefeatedOnCapture },

            { ui: this._groupModifyActRepairNormalizedHp,           callback: this._onTouchedGroupModifyActRepairNormalizedHp },
            { ui: this._btnActRepairNormalizedHp,                   callback: this._onTouchedBtnActRepairNormalized },

            { ui: this._groupModifyActRepairUnitTypeArray,          callback: this._onTouchedGroupModifyActRepairUnitTypeArray },
            { ui: this._btnActRepairUnitTypeArray,                  callback: this._onTouchedBtnActRepairUnitTypeArray },

            { ui: this._groupModifyActIncomePerTurn,                callback: this._onTouchedGroupModifyActIncomePerTurn },
            { ui: this._btnActIncomePerTurn,                        callback: this._onTouchedBtnActIncomePerTurn },

            { ui: this._groupModifyActVisionRange,                  callback: this._onTouchedGroupModifyActVisionRange },
            { ui: this._btnActVisionRange,                          callback: this._onTouchedBtnActVisionRange },

            { ui: this._groupModifyActIsVisionEnabledForAllPlayers, callback: this._onTouchedGroupModifyActIsVisionEnabledForAllPlayers },
            { ui: this._btnActIsVisionEnabledForAllPlayers,         callback: this._onTouchedBtnActIsVisionEnabledForAllPlayers },

            { ui: this._groupModifyActHideUnitTypeArray,            callback: this._onTouchedGroupModifyActHideUnitTypeArray },
            { ui: this._btnActHideUnitTypeArray,                    callback: this._onTouchedBtnActHideUnitTypeArray },

            { ui: this._groupModifyActProduceUnitTypeArray,         callback: this._onTouchedGroupModifyActProduceUnitTypeArray },
            { ui: this._btnActProduceUnitTypeArray,                 callback: this._onTouchedBtnActProduceUnitTypeArray },

            { ui: this._groupModifyActGlobalAttackBonus,            callback: this._onTouchedGroupModifyActGlobalAttackBonus },
            { ui: this._btnActGlobalAttackBonus,                    callback: this._onTouchedBtnActGlobalAttackBonus },

            { ui: this._groupModifyActGlobalDefenseBonus,           callback: this._onTouchedGroupModifyActGlobalDefenseBonus },
            { ui: this._btnActGlobalDefenseBonus,                   callback: this._onTouchedBtnActGlobalDefenseBonus },

            { ui: this._groupModifyActUnitTypeArrayForCoBoard,      callback: this._onTouchedGroupModifyActUnitTypeArrayForCoBoard },
            { ui: this._btnActUnitTypeArrayForCoBoard,              callback: this._onTouchedBtnActUnitTypeArrayForCoBoard },

            { ui: this._groupModifyActBlockEnemyUnitTypeArray,      callback: this._onTouchedGroupModifyActBlockEnemyUnitTypeArray },
            { ui: this._btnActBlockEnemyUnitTypeArray,              callback: this._onTouchedBtnActBlockEnemyUnitTypeArray },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionTypeListPanel, {
            fullData    : openData.fullData,
            action      : openData.action,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonApiPanel, {
            contextType : ExpressionParsersEnums.ContextType.Tile,
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0662),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConTileFilter(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ConTileFilter,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConTileFilter() != text) {
                    action.setConTileFilter(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDefenseAmount(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0662),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDefenseAmount(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDefenseAmount() != text) {
                    action.setActDefenseAmount(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDefenseUnitTypeArray(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0662),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDefenseUnitTypeArray(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDefenseUnitTypeArray() != text) {
                    action.setActDefenseUnitTypeArray(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMaxCapturePoint(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0687),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActMaxCapturePoint(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActMaxCapturePoint() != text) {
                    action.setActMaxCapturePoint(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsDefeatedOnCapture(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0688),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsDefeatedOnCapture(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsDefeatedOnCapture() != text) {
                    action.setActIsDefeatedOnCapture(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRepairNormalized(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0689),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRepairNormalizedHp(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRepairNormalizedHp() != text) {
                    action.setActRepairNormalizedHp(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRepairUnitTypeArray(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0690),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRepairUnitTypeArray(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRepairUnitTypeArray() != text) {
                    action.setActRepairUnitTypeArray(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIncomePerTurn(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0691),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIncomePerTurn(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIncomePerTurn() != text) {
                    action.setActIncomePerTurn(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActVisionRange(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0692),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActVisionRange(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActVisionRange() != text) {
                    action.setActVisionRange(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsVisionEnabledForAllPlayers(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0693),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsVisionEnabledForAllPlayers(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsVisionEnabledForAllPlayers() != text) {
                    action.setActIsVisionEnabledForAllPlayers(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActHideUnitTypeArray(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0693),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActHideUnitTypeArray(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActHideUnitTypeArray() != text) {
                    action.setActHideUnitTypeArray(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActProduceUnitTypeArray(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0695),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActProduceUnitTypeArray(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActProduceUnitTypeArray() != text) {
                    action.setActProduceUnitTypeArray(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGlobalAttackBonus(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0695),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGlobalAttackBonus(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGlobalAttackBonus() != text) {
                    action.setActGlobalAttackBonus(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGlobalDefenseBonus(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0695),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGlobalDefenseBonus(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGlobalDefenseBonus() != text) {
                    action.setActGlobalDefenseBonus(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnitTypeArrayForCoBoard(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0698),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnitTypeArrayForCoBoard(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnitTypeArrayForCoBoard() != text) {
                    action.setActUnitTypeArrayForCoBoard(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBlockEnemyUnitTypeArray(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0699),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBlockEnemyUnitTypeArray(),
            expressionInfo  : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBlockEnemyUnitTypeArray() != text) {
                    action.setActBlockEnemyUnitTypeArray(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._btnType.setText(LangUtils.getText(LangConstants.TextType.B0516));
        this._btnIdentifier.setText(LangUtils.getText(LangConstants.TextType.B0131));

        this._btnConTileFilter.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActDefenseAmount.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount.getTitleText());
        this._btnActDefenseUnitTypeArray.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray.getTitleText());
        this._btnActMaxCapturePoint.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint.getTitleText());
        this._btnActIsDefeatedOnCapture.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture.getTitleText());
        this._btnActRepairNormalizedHp.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp.getTitleText());
        this._btnActRepairUnitTypeArray.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray.getTitleText());
        this._btnActIncomePerTurn.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn.getTitleText());
        this._btnActVisionRange.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange.getTitleText());
        this._btnActIsVisionEnabledForAllPlayers.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers.getTitleText());
        this._btnActHideUnitTypeArray.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray.getTitleText());
        this._btnActProduceUnitTypeArray.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray.getTitleText());
        this._btnActGlobalAttackBonus.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus.getTitleText());
        this._btnActGlobalDefenseBonus.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus.getTitleText());
        this._btnActUnitTypeArrayForCoBoard.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard.getTitleText());
        this._btnActBlockEnemyUnitTypeArray.setText(WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray.getTitleText());

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const war               = openData.war;
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getBriefDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
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

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateExpr.WeaSetCustomBuildingStateExpr> {
        return this.getOpenData()?.action.getWeaSetCustomBuildingStateExpr();
    }
}
