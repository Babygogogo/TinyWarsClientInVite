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
import type { WeaAddTileBuffExpr } from "../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffExpr.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/AddTileBuffExpr.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnType!                                  : IUiButton;
    private readonly _btnClose!                                 : IUiButton;
    private readonly _btnIdentifier!                            : IUiButton;

    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _scrExpression!                            : IUiScroller<IUiLayout>;
    private readonly _groupExpression!                          : IUiLayout;
    private readonly _groupCon!                                 : IUiLayout;
    private readonly _groupAct!                                 : IUiLayout;

    private readonly _groupConTileFilter!                       : IUiContainer;
    private readonly _groupModifyConTileFilter!                 : IUiContainer;
    private readonly _btnConTileFilter!                         : IUiButton;
    private readonly _labelConTileFilter!                       : IUiLabel;

    private readonly _groupActBuffType!                         : IUiContainer;
    private readonly _groupModifyActBuffType!                   : IUiContainer;
    private readonly _btnActBuffType!                           : IUiButton;
    private readonly _labelActBuffType!                         : IUiLabel;

    private readonly _groupActExpiringTurnIndex!                : IUiContainer;
    private readonly _groupModifyActExpiringTurnIndex!          : IUiContainer;
    private readonly _btnActExpiringTurnIndex!                  : IUiButton;
    private readonly _labelActExpiringTurnIndex!                : IUiLabel;

    private readonly _groupActExpiringPlayerIndex!              : IUiContainer;
    private readonly _groupModifyActExpiringPlayerIndex!        : IUiContainer;
    private readonly _btnActExpiringPlayerIndex!                : IUiButton;
    private readonly _labelActExpiringPlayerIndex!              : IUiLabel;

    private readonly _groupActExtraParams!                      : IUiContainer;
    private readonly _groupModifyActExtraParams!                : IUiContainer;
    private readonly _btnActExtraParams!                        : IUiButton;
    private readonly _labelActExtraParams!                      : IUiLabel;

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

    private _onTouchedBtnActBuffType(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0761),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBuffType(),
            expressionInfo  : ExpressionInfoDict.ActBuffType,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBuffType() != text) {
                    action.setActBuffType(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActExpiringTurnIndex(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0762),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActExpiringTurnIndex(),
            expressionInfo  : ExpressionInfoDict.ActExpiringTurnIndex,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActExpiringTurnIndex() != text) {
                    action.setActExpiringTurnIndex(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActExpiringPlayerIndex(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0763),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActExpiringPlayerIndex(),
            expressionInfo  : ExpressionInfoDict.ActExpiringPlayerIndex,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActExpiringPlayerIndex() != text) {
                    action.setActExpiringPlayerIndex(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActExtraParams(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0764),
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

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActExtraParams(),
            expressionInfo  : ExpressionInfoDict.ActExtraParams,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActExtraParams() != text) {
                    action.setActExtraParams(text);
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

        this._btnConTileFilter.setLangText(TextType.TileFilter);
        this._btnActBuffType.setLangText(TextType.B0805);
        this._btnActExpiringTurnIndex.setLangText(TextType.EndTurnIndex);
        this._btnActExpiringPlayerIndex.setLangText(TextType.EndPlayerIndex);
        this._btnActExtraParams.setLangText(TextType.B1229);

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

    private getAction(): Undefinable<WeaAddTileBuffExpr> {
        return this.getOpenData()?.action.getWeaAddTileBuffExpr();
    }
}
