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
import type { WeaSetUnitMovePathVisibility } from "../../proto/schema/CommonProto/WarEvent/WeaSetUnitMovePathVisibility.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/SetUnitMovePathVisibility.ts";
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

    private readonly _groupConPositionFilter!                   : IUiContainer;
    private readonly _groupModifyConPositionFilter!             : IUiContainer;
    private readonly _btnConPositionFilter!                     : IUiButton;
    private readonly _labelConPositionFilter!                   : IUiLabel;

    private readonly _groupActVisibilityArray!                  : IUiContainer;
    private readonly _groupModifyActVisibilityArray!            : IUiContainer;
    private readonly _labelActVisibilityArray!                  : IUiLabel;
    private readonly _btnActVisibilityArray!                    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this.closePanel },
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                          callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConPositionFilter,           callback: this._onTouchedGroupModifyConPositionFilter },
            { ui: this._btnConPositionFilter,                   callback: this._onTouchedBtnConPositionFilter },

            { ui: this._groupModifyActVisibilityArray,          callback: this._onTouchedGroupModifyActVisibilityArray },
            { ui: this._btnActVisibilityArray,                  callback: this._onTouchedBtnActVisibilityArray },
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

    private _onTouchedBtnConPositionFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ConPositionFilter.getHelpText(),
        });
    }
    private _onTouchedGroupModifyConPositionFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConPositionFilter(),
            expressionInfo  : ExpressionInfoDict.ConPositionFilter,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConPositionFilter() != text) {
                    action.setConPositionFilter(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActVisibilityArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActVisibilityArray.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActVisibilityArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActVisibilityArray(),
            expressionInfo  : ExpressionInfoDict.ActVisibilityArray,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActVisibilityArray() != text) {
                    action.setActVisibilityArray(text);
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
        this._btnConPositionFilter.setText(ExpressionInfoDict.ConPositionFilter.getTitleText());
        this._btnActVisibilityArray.setText(ExpressionInfoDict.ActVisibilityArray.getTitleText());

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
            const label = this._labelConPositionFilter;
            label.setText(action.getConPositionFilter() ?? ``);
            this._groupConPositionFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActVisibilityArray;
            label.setText(action.getActVisibilityArray() ?? ``);
            this._groupActVisibilityArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaSetUnitMovePathVisibility> {
        return this.getOpenData()?.action.getWeaSetUnitMovePathVisibility();
    }
}
