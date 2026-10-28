import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ContextType } from "../../expressionParsers/Enums.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetCustomBuildingStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateExpr.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/SetCustomBuildingStateExpr.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                      : IUiImage;
    private readonly _group!                                        : IUiContainer;
    private readonly _labelTitle!                                   : IUiLabel;
    private readonly _btnType!                                      : IUiButton;
    private readonly _btnClose!                                     : IUiButton;
    private readonly _btnIdentifier!                                : IUiButton;

    private readonly _groupDesc!                                    : IUiLayout;
    private readonly _labelDesc!                                    : IUiLabel;
    private readonly _labelError!                                   : IUiLabel;

    private readonly _scrExpression!                                : IUiScroller<IUiLayout>;
    private readonly _groupExpression!                              : IUiLayout;
    private readonly _groupCon!                                     : IUiLayout;
    private readonly _groupAct!                                     : IUiLayout;

    private readonly _groupConTileFilter!                           : IUiContainer;
    private readonly _groupModifyConTileFilter!                     : IUiContainer;
    private readonly _btnConTileFilter!                             : IUiButton;
    private readonly _labelConTileFilter!                           : IUiLabel;

    private readonly _groupActDefenseAmount!                        : IUiContainer;
    private readonly _groupModifyActDefenseAmount!                  : IUiContainer;
    private readonly _btnActDefenseAmount!                          : IUiButton;
    private readonly _labelActDefenseAmount!                        : IUiLabel;

    private readonly _groupActDefenseUnitTypeArray!                 : IUiContainer;
    private readonly _groupModifyActDefenseUnitTypeArray!           : IUiContainer;
    private readonly _btnActDefenseUnitTypeArray!                   : IUiButton;
    private readonly _labelActDefenseUnitTypeArray!                 : IUiLabel;

    private readonly _groupActMaxCapturePoint!                      : IUiContainer;
    private readonly _groupModifyActMaxCapturePoint!                : IUiContainer;
    private readonly _btnActMaxCapturePoint!                        : IUiButton;
    private readonly _labelActMaxCapturePoint!                      : IUiLabel;

    private readonly _groupActIsDefeatedOnCapture!                  : IUiContainer;
    private readonly _groupModifyActIsDefeatedOnCapture!            : IUiContainer;
    private readonly _btnActIsDefeatedOnCapture!                    : IUiButton;
    private readonly _labelActIsDefeatedOnCapture!                  : IUiLabel;

    private readonly _groupActRepairNormalizedHp!                   : IUiContainer;
    private readonly _groupModifyActRepairNormalizedHp!             : IUiContainer;
    private readonly _btnActRepairNormalizedHp!                     : IUiButton;
    private readonly _labelActRepairNormalizedHp!                   : IUiLabel;

    private readonly _groupActRepairUnitTypeArray!                  : IUiContainer;
    private readonly _groupModifyActRepairUnitTypeArray!            : IUiContainer;
    private readonly _btnActRepairUnitTypeArray!                    : IUiButton;
    private readonly _labelActRepairUnitTypeArray!                  : IUiLabel;

    private readonly _groupActIncomePerTurn!                        : IUiContainer;
    private readonly _groupModifyActIncomePerTurn!                  : IUiContainer;
    private readonly _btnActIncomePerTurn!                          : IUiButton;
    private readonly _labelActIncomePerTurn!                        : IUiLabel;

    private readonly _groupActVisionRange!                          : IUiContainer;
    private readonly _groupModifyActVisionRange!                    : IUiContainer;
    private readonly _btnActVisionRange!                            : IUiButton;
    private readonly _labelActVisionRange!                          : IUiLabel;

    private readonly _groupActIsVisionEnabledForAllPlayers!         : IUiContainer;
    private readonly _groupModifyActIsVisionEnabledForAllPlayers!   : IUiContainer;
    private readonly _btnActIsVisionEnabledForAllPlayers!           : IUiButton;
    private readonly _labelActIsVisionEnabledForAllPlayers!         : IUiLabel;

    private readonly _groupActHideUnitTypeArray!                    : IUiContainer;
    private readonly _groupModifyActHideUnitTypeArray!              : IUiContainer;
    private readonly _btnActHideUnitTypeArray!                      : IUiButton;
    private readonly _labelActHideUnitTypeArray!                    : IUiLabel;

    private readonly _groupActProduceUnitTypeArray!                 : IUiContainer;
    private readonly _groupModifyActProduceUnitTypeArray!           : IUiContainer;
    private readonly _btnActProduceUnitTypeArray!                   : IUiButton;
    private readonly _labelActProduceUnitTypeArray!                 : IUiLabel;

    private readonly _groupActGlobalAttackBonus!                    : IUiContainer;
    private readonly _groupModifyActGlobalAttackBonus!              : IUiContainer;
    private readonly _btnActGlobalAttackBonus!                      : IUiButton;
    private readonly _labelActGlobalAttackBonus!                    : IUiLabel;

    private readonly _groupActGlobalDefenseBonus!                   : IUiContainer;
    private readonly _groupModifyActGlobalDefenseBonus!             : IUiContainer;
    private readonly _btnActGlobalDefenseBonus!                     : IUiButton;
    private readonly _labelActGlobalDefenseBonus!                   : IUiLabel;

    private readonly _groupActUnitTypeArrayForCoBoard!              : IUiContainer;
    private readonly _groupModifyActUnitTypeArrayForCoBoard!        : IUiContainer;
    private readonly _btnActUnitTypeArrayForCoBoard!                : IUiButton;
    private readonly _labelActUnitTypeArrayForCoBoard!              : IUiLabel;

    private readonly _groupActBlockEnemyUnitTypeArray!              : IUiContainer;
    private readonly _groupModifyActBlockEnemyUnitTypeArray!        : IUiContainer;
    private readonly _btnActBlockEnemyUnitTypeArray!                : IUiButton;
    private readonly _labelActBlockEnemyUnitTypeArray!              : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
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

        openPanel(getDict().WeActionTypeListPanel, {
            fullData    : openData.fullData,
            action      : openData.action,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        openPanel(getDict().CommonApiPanel, {
            contextType : ContextType.Tile,
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0662),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConTileFilter(),
            expressionInfo  : ExpressionInfoDict.ConTileFilter,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConTileFilter() != text) {
                    action.setConTileFilter(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDefenseAmount(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0662),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDefenseAmount(),
            expressionInfo  : ExpressionInfoDict.ActDefenseAmount,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDefenseAmount() != text) {
                    action.setActDefenseAmount(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDefenseUnitTypeArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0662),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDefenseUnitTypeArray(),
            expressionInfo  : ExpressionInfoDict.ActDefenseUnitTypeArray,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDefenseUnitTypeArray() != text) {
                    action.setActDefenseUnitTypeArray(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActMaxCapturePoint(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0687),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActMaxCapturePoint(),
            expressionInfo  : ExpressionInfoDict.ActMaxCapturePoint,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActMaxCapturePoint() != text) {
                    action.setActMaxCapturePoint(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsDefeatedOnCapture(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0688),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsDefeatedOnCapture(),
            expressionInfo  : ExpressionInfoDict.ActIsDefeatedOnCapture,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsDefeatedOnCapture() != text) {
                    action.setActIsDefeatedOnCapture(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRepairNormalized(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0689),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRepairNormalizedHp(),
            expressionInfo  : ExpressionInfoDict.ActRepairNormalizedHp,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRepairNormalizedHp() != text) {
                    action.setActRepairNormalizedHp(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActRepairUnitTypeArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0690),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActRepairUnitTypeArray(),
            expressionInfo  : ExpressionInfoDict.ActRepairUnitTypeArray,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActRepairUnitTypeArray() != text) {
                    action.setActRepairUnitTypeArray(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIncomePerTurn(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0691),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIncomePerTurn(),
            expressionInfo  : ExpressionInfoDict.ActIncomePerTurn,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIncomePerTurn() != text) {
                    action.setActIncomePerTurn(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActVisionRange(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0692),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActVisionRange(),
            expressionInfo  : ExpressionInfoDict.ActVisionRange,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActVisionRange() != text) {
                    action.setActVisionRange(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsVisionEnabledForAllPlayers(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0693),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsVisionEnabledForAllPlayers(),
            expressionInfo  : ExpressionInfoDict.ActIsVisionEnabledForAllPlayers,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsVisionEnabledForAllPlayers() != text) {
                    action.setActIsVisionEnabledForAllPlayers(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActHideUnitTypeArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0693),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActHideUnitTypeArray(),
            expressionInfo  : ExpressionInfoDict.ActHideUnitTypeArray,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActHideUnitTypeArray() != text) {
                    action.setActHideUnitTypeArray(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActProduceUnitTypeArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0695),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActProduceUnitTypeArray(),
            expressionInfo  : ExpressionInfoDict.ActProduceUnitTypeArray,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActProduceUnitTypeArray() != text) {
                    action.setActProduceUnitTypeArray(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGlobalAttackBonus(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0695),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGlobalAttackBonus(),
            expressionInfo  : ExpressionInfoDict.ActGlobalAttackBonus,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGlobalAttackBonus() != text) {
                    action.setActGlobalAttackBonus(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGlobalDefenseBonus(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0695),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGlobalDefenseBonus(),
            expressionInfo  : ExpressionInfoDict.ActGlobalDefenseBonus,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGlobalDefenseBonus() != text) {
                    action.setActGlobalDefenseBonus(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnitTypeArrayForCoBoard(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0698),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnitTypeArrayForCoBoard(),
            expressionInfo  : ExpressionInfoDict.ActUnitTypeArrayForCoBoard,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnitTypeArrayForCoBoard() != text) {
                    action.setActUnitTypeArrayForCoBoard(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBlockEnemyUnitTypeArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0699),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBlockEnemyUnitTypeArray(),
            expressionInfo  : ExpressionInfoDict.ActBlockEnemyUnitTypeArray,
            fullData        : openData.fullData,
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBlockEnemyUnitTypeArray() != text) {
                    action.setActBlockEnemyUnitTypeArray(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnClose.setLangText(TextType.B0146);
        this._btnType.setLangText(TextType.B0516);
        this._btnIdentifier.setLangText(TextType.B0131);

        this._btnConTileFilter.setText(ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActDefenseAmount.setText(ExpressionInfoDict.ActDefenseAmount.getTitleText());
        this._btnActDefenseUnitTypeArray.setText(ExpressionInfoDict.ActDefenseUnitTypeArray.getTitleText());
        this._btnActMaxCapturePoint.setText(ExpressionInfoDict.ActMaxCapturePoint.getTitleText());
        this._btnActIsDefeatedOnCapture.setText(ExpressionInfoDict.ActIsDefeatedOnCapture.getTitleText());
        this._btnActRepairNormalizedHp.setText(ExpressionInfoDict.ActRepairNormalizedHp.getTitleText());
        this._btnActRepairUnitTypeArray.setText(ExpressionInfoDict.ActRepairUnitTypeArray.getTitleText());
        this._btnActIncomePerTurn.setText(ExpressionInfoDict.ActIncomePerTurn.getTitleText());
        this._btnActVisionRange.setText(ExpressionInfoDict.ActVisionRange.getTitleText());
        this._btnActIsVisionEnabledForAllPlayers.setText(ExpressionInfoDict.ActIsVisionEnabledForAllPlayers.getTitleText());
        this._btnActHideUnitTypeArray.setText(ExpressionInfoDict.ActHideUnitTypeArray.getTitleText());
        this._btnActProduceUnitTypeArray.setText(ExpressionInfoDict.ActProduceUnitTypeArray.getTitleText());
        this._btnActGlobalAttackBonus.setText(ExpressionInfoDict.ActGlobalAttackBonus.getTitleText());
        this._btnActGlobalDefenseBonus.setText(ExpressionInfoDict.ActGlobalDefenseBonus.getTitleText());
        this._btnActUnitTypeArrayForCoBoard.setText(ExpressionInfoDict.ActUnitTypeArrayForCoBoard.getTitleText());
        this._btnActBlockEnemyUnitTypeArray.setText(ExpressionInfoDict.ActBlockEnemyUnitTypeArray.getTitleText());

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const war               = openData.war;
        const errorTip          = getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getBriefDescForAction(action, war.getGcData()) || UndefinedError);
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

    private getAction(): Undefinable<WeaSetCustomBuildingStateExpr> {
        return this.getOpenData()?.action.getWeaSetCustomBuildingStateExpr();
    }
}
