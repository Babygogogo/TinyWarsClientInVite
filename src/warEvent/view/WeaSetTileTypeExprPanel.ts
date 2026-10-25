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
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetTileTypeExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeExpr.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/SetTileTypeExpr.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction         = ProtoSchemaCommonProtoWarEventWarEventAction;

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

    private readonly _groupActBaseType!                                 : IUiContainer;
    private readonly _groupModifyActBaseType!                           : IUiContainer;
    private readonly _labelActBaseType!                                 : IUiLabel;
    private readonly _btnActBaseType!                                   : IUiButton;

    private readonly _groupActBaseShapeId!                              : IUiContainer;
    private readonly _groupModifyActBaseShapeId!                        : IUiContainer;
    private readonly _labelActBaseShapeId!                              : IUiLabel;
    private readonly _btnActBaseShapeId!                                : IUiButton;

    private readonly _groupActObjectType!                               : IUiContainer;
    private readonly _groupModifyActObjectType!                         : IUiContainer;
    private readonly _labelActObjectType!                               : IUiLabel;
    private readonly _btnActObjectType!                                 : IUiButton;

    private readonly _groupActObjectShapeId!                            : IUiContainer;
    private readonly _groupModifyActObjectShapeId!                      : IUiContainer;
    private readonly _labelActObjectShapeId!                            : IUiLabel;
    private readonly _btnActObjectShapeId!                              : IUiButton;

    private readonly _groupActDecorationType!                           : IUiContainer;
    private readonly _groupModifyActDecorationType!                     : IUiContainer;
    private readonly _btnActDecorationType!                             : IUiButton;
    private readonly _labelActDecorationType!                           : IUiLabel;

    private readonly _groupActDecorationShapeId!                        : IUiContainer;
    private readonly _groupModifyActDecorationShapeId!                  : IUiContainer;
    private readonly _labelActDecorationShapeId!                        : IUiLabel;
    private readonly _btnActDecorationShapeId!                          : IUiButton;

    private readonly _groupActUnitHandler!                              : IUiContainer;
    private readonly _groupModifyActUnitHandler!                        : IUiContainer;
    private readonly _labelActUnitHandler!                              : IUiLabel;
    private readonly _btnActUnitHandler!                                : IUiButton;

    private readonly _groupActUnitFilter!                               : IUiContainer;
    private readonly _groupModifyActUnitFilter!                         : IUiContainer;
    private readonly _labelActUnitFilter!                               : IUiLabel;
    private readonly _btnActUnitFilter!                                 : IUiButton;

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

            { ui: this._groupModifyActBaseType,                         callback: this._onTouchedGroupModifyActBaseType },
            { ui: this._btnActBaseType,                                 callback: this._onTouchedBtnActBaseType },

            { ui: this._groupModifyActBaseShapeId,                      callback: this._onTouchedGroupModifyActBaseShapeId },
            { ui: this._btnActBaseShapeId,                              callback: this._onTouchedBtnActBaseShapeId },

            { ui: this._groupModifyActObjectType,                       callback: this._onTouchedGroupModifyActObjectType },
            { ui: this._btnActObjectType,                               callback: this._onTouchedBtnActObjectType },

            { ui: this._groupModifyActObjectShapeId,                    callback: this._onTouchedGroupModifyActObjectShapeId },
            { ui: this._btnActObjectShapeId,                            callback: this._onTouchedBtnActObjectShapeId },

            { ui: this._groupModifyActDecorationType,                   callback: this._onTouchedGroupModifyActDecorationType },
            { ui: this._btnActDecorationType,                           callback: this._onTouchedBtnActDecorationType },

            { ui: this._groupModifyActDecorationShapeId,                callback: this._onTouchedGroupModifyActDecorationShapeId },
            { ui: this._btnActDecorationShapeId,                        callback: this._onTouchedBtnActDecorationShapeId },

            { ui: this._groupModifyActUnitHandler,                      callback: this._onTouchedGroupModifyActUnitHandler },
            { ui: this._btnActUnitHandler,                              callback: this._onTouchedBtnActUnitHandler },

            { ui: this._groupModifyActUnitFilter,                       callback: this._onTouchedGroupModifyActUnitFilter },
            { ui: this._btnActUnitFilter,                               callback: this._onTouchedBtnActUnitFilter },
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

    private _onTouchedBtnActBaseType(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActBaseType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActBaseType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBaseType(),
            expressionInfo  : ExpressionInfoDict.ActBaseType,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBaseType() != text) {
                    action.setActBaseType(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBaseShapeId(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActBaseShapeId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActBaseShapeId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBaseShapeId(),
            expressionInfo  : ExpressionInfoDict.ActBaseShapeId,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBaseShapeId() != text) {
                    action.setActBaseShapeId(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActObjectType(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActObjectType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActObjectType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActObjectType(),
            expressionInfo  : ExpressionInfoDict.ActObjectType,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActObjectType() != text) {
                    action.setActObjectType(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActObjectShapeId(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActObjectShapeId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActObjectShapeId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActObjectShapeId(),
            expressionInfo  : ExpressionInfoDict.ActObjectShapeId,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActObjectShapeId() != text) {
                    action.setActObjectShapeId(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDecorationType(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActDecorationType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActDecorationType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDecorationType(),
            expressionInfo  : ExpressionInfoDict.ActDecorationType,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDecorationType() != text) {
                    action.setActDecorationType(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActDecorationShapeId(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActDecorationShapeId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActDecorationShapeId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActDecorationShapeId(),
            expressionInfo  : ExpressionInfoDict.ActDecorationShapeId,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActDecorationShapeId() != text) {
                    action.setActDecorationShapeId(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnitHandler(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActUnitHandler.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActUnitHandler(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnitHandler(),
            expressionInfo  : ExpressionInfoDict.ActUnitHandler,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnitHandler() != text) {
                    action.setActUnitHandler(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnitFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActUnitFilter.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActUnitFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnitFilter(),
            expressionInfo  : ExpressionInfoDict.ActUnitFilter,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnitFilter() != text) {
                    action.setActUnitFilter(text);
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
        this._btnActBaseType.setText(ExpressionInfoDict.ActBaseType.getTitleText());
        this._btnActBaseShapeId.setText(ExpressionInfoDict.ActBaseShapeId.getTitleText());
        this._btnActObjectType.setText(ExpressionInfoDict.ActObjectType.getTitleText());
        this._btnActObjectShapeId.setText(ExpressionInfoDict.ActObjectShapeId.getTitleText());
        this._btnActDecorationType.setText(ExpressionInfoDict.ActDecorationType.getTitleText());
        this._btnActDecorationShapeId.setText(ExpressionInfoDict.ActDecorationShapeId.getTitleText());
        this._btnActUnitHandler.setText(ExpressionInfoDict.ActUnitHandler.getTitleText());
        this._btnActUnitFilter.setText(ExpressionInfoDict.ActUnitFilter.getTitleText());

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
            const label = this._labelActBaseType;
            label.setText(action.getActBaseType() ?? ``);
            this._groupActBaseType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActBaseShapeId;
            label.setText(action.getActBaseShapeId() ?? ``);
            this._groupActBaseShapeId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActObjectType;
            label.setText(action.getActObjectType() ?? ``);
            this._groupActObjectType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActObjectShapeId;
            label.setText(action.getActObjectShapeId() ?? ``);
            this._groupActObjectShapeId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActDecorationType;
            label.setText(action.getActDecorationType() ?? ``);
            this._groupActDecorationType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActDecorationShapeId;
            label.setText(action.getActDecorationShapeId() ?? ``);
            this._groupActDecorationShapeId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActUnitHandler;
            label.setText(action.getActUnitHandler() ?? ``);
            this._groupActUnitHandler.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActUnitFilter;
            label.setText(action.getActUnitFilter() ?? ``);
            this._groupActUnitFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaSetTileTypeExpr> {
        return this.getOpenData()?.action.getWeaSetTileTypeExpr();
    }
}
