import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ContextType } from "../../expressionParsers/Enums.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetTileStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetTileStateExpr.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/SetTileStateExpr.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                          : IUiImage;
    private readonly _group!                                            : IUiContainer;
    private readonly _labelTitle!                                       : IUiLabel;
    private readonly _btnType!                                          : IUiButton;
    private readonly _btnClose!                                         : IUiButton;
    private readonly _btnIdentifier!                                    : IUiButton;

    private readonly _groupDesc!                                        : IUiLayout;
    private readonly _labelDesc!                                        : IUiLabel;
    private readonly _labelError!                                       : IUiLabel;

    private readonly _scrExpression!                                    : IUiScroller<IUiLayout>;
    private readonly _groupExpression!                                  : IUiLayout;
    private readonly _groupCon!                                         : IUiLayout;
    private readonly _groupAct!                                         : IUiLayout;

    private readonly _groupConTileFilter!                               : IUiContainer;
    private readonly _groupModifyConTileFilter!                         : IUiContainer;
    private readonly _btnConTileFilter!                                 : IUiButton;
    private readonly _labelConTileFilter!                               : IUiLabel;

    private readonly _groupActPlayerIndex!                              : IUiContainer;
    private readonly _groupModifyActPlayerIndex!                        : IUiContainer;
    private readonly _labelActPlayerIndex!                              : IUiLabel;
    private readonly _btnActPlayerIndex!                                : IUiButton;

    private readonly _groupActCurrentHp!                                : IUiContainer;
    private readonly _groupModifyActCurrentHp!                          : IUiContainer;
    private readonly _labelActCurrentHp!                                : IUiLabel;
    private readonly _btnActCurrentHp!                                  : IUiButton;

    private readonly _groupActCurrentBuildPoint!                        : IUiContainer;
    private readonly _groupModifyActCurrentBuildPoint!                  : IUiContainer;
    private readonly _btnActCurrentBuildPoint!                          : IUiButton;
    private readonly _labelActCurrentBuildPoint!                        : IUiLabel;

    private readonly _groupActCurrentCapturePoint!                      : IUiContainer;
    private readonly _groupModifyActCurrentCapturePoint!                : IUiContainer;
    private readonly _labelActCurrentCapturePoint!                      : IUiLabel;
    private readonly _btnActCurrentCapturePoint!                        : IUiButton;

    private readonly _groupActIsHighlighted!                            : IUiContainer;
    private readonly _groupModifyActIsHighlighted!                      : IUiContainer;
    private readonly _labelActIsHighlighted!                            : IUiLabel;
    private readonly _btnActIsHighlighted!                              : IUiButton;

    private readonly _groupActGroupedLocationIdArray!                   : IUiContainer;
    private readonly _groupModifyActGroupedLocationIdArray!             : IUiContainer;
    private readonly _labelActGroupedLocationIdArray!                   : IUiLabel;
    private readonly _btnActGroupedLocationIdArray!                     : IUiButton;

    private readonly _groupActCustomNameId!                             : IUiContainer;
    private readonly _groupModifyActCustomNameId!                       : IUiContainer;
    private readonly _labelActCustomNameId!                             : IUiLabel;
    private readonly _btnActCustomNameId!                               : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
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

        openPanel(getDict().WeActionTypeListPanel, {
            fullData    : openData.fullData,
            action      : openData.action,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        openPanel(getDict().CommonApiPanel, {
            contextType : ContextType.Player,
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ConTileFilter.getHelpText(),
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
            fullData        : getExisted(openData.fullData),
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

    private _onTouchedBtnActPlayerIndex(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActPlayerIndex.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPlayerIndex(),
            expressionInfo  : ExpressionInfoDict.ActPlayerIndex,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPlayerIndex() != text) {
                    action.setActPlayerIndex(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentHp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCurrentHp.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentHp(),
            expressionInfo  : ExpressionInfoDict.ActCurrentHp,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentHp() != text) {
                    action.setActCurrentHp(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentBuildPoint(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCurrentBuildPoint.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentBuildPoint(),
            expressionInfo  : ExpressionInfoDict.ActCurrentBuildPoint,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentBuildPoint() != text) {
                    action.setActCurrentBuildPoint(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentCapturePoint(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCurrentCapturePoint.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentCapturePoint(),
            expressionInfo  : ExpressionInfoDict.ActCurrentCapturePoint,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentCapturePoint() != text) {
                    action.setActCurrentCapturePoint(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsHighlighted(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActIsHighlighted.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsHighlighted(),
            expressionInfo  : ExpressionInfoDict.ActIsHighlighted,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsHighlighted() != text) {
                    action.setActIsHighlighted(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGroupedLocationIdArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActGroupedLocationIdArray.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGroupedLocationIdArray(),
            expressionInfo  : ExpressionInfoDict.ActGroupedLocationIdArray,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGroupedLocationIdArray() != text) {
                    action.setActGroupedLocationIdArray(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCustomNameId(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCustomNameId.getHelpText(),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCustomNameId(),
            expressionInfo  : ExpressionInfoDict.ActCustomNameId,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCustomNameId() != text) {
                    action.setActCustomNameId(text);
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
        this._btnType.setLangText(TextType.B0516);
        this._btnIdentifier.setLangText(TextType.B0131);
        this._btnConTileFilter.setText(ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActPlayerIndex.setText(ExpressionInfoDict.ActPlayerIndex.getTitleText());
        this._btnActCurrentHp.setText(ExpressionInfoDict.ActCurrentHp.getTitleText());
        this._btnActCurrentBuildPoint.setText(ExpressionInfoDict.ActCurrentBuildPoint.getTitleText());
        this._btnActCurrentCapturePoint.setText(ExpressionInfoDict.ActCurrentCapturePoint.getTitleText());
        this._btnActIsHighlighted.setText(ExpressionInfoDict.ActIsHighlighted.getTitleText());
        this._btnActGroupedLocationIdArray.setText(ExpressionInfoDict.ActGroupedLocationIdArray.getTitleText());
        this._btnActCustomNameId.setText(ExpressionInfoDict.ActCustomNameId.getTitleText());

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
        labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
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

    private getAction(): Undefinable<WeaSetTileStateExpr> {
        return this.getOpenData()?.action.getWeaSetTileStateExpr();
    }
}
