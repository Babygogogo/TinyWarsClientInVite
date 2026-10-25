import { ContextType, ResultType } from "../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../expressionParsers/Types.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecExpression } from "../../proto/schema/CommonProto/WarEvent/WecExpression.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { getErrorTipForCondition, getBriefDescForCondition } from "../../warEvents/conditions/utils/Common.ts";

const ExpressionInfo: EpExpressionInfo = {
    contextType     : ContextType.War,
    resultTypes     : [ResultType.Number],
    isRequired      : true,
    getTitleText    : () => getText(TextType.B0129),
    getHelpText     : () => getText(TextType.A0941),
};

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
/** WecPlayerIndexInTurnEqualTo */
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnType!                      : IUiButton;
    private readonly _btnClose!                     : IUiButton;
    private readonly _btnIdentifier!                : IUiButton;

    private readonly _groupDesc!                    : IUiLayout;
    private readonly _labelDesc!                    : IUiLabel;
    private readonly _labelError!                   : IUiLabel;

    private readonly _scrContent!                   : IUiScroller<IUiLayout>;
    private readonly _layoutContent!                : IUiLayout;

    private readonly _groupConExpression!           : IUiContainer;
    private readonly _groupModifyConExpression!     : IUiContainer;
    private readonly _labelConExpression!           : IUiLabel;
    private readonly _btnConExpression!             : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConExpression,       callback: this._onTouchedGroupModifyConExpression },
            { ui: this._btnConExpression,               callback: this._onTouchedBtnConExpression },
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

        openPanel(getDict().WeConditionTypeListPanel, {
            fullData    : openData.fullData,
            condition   : openData.condition,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        openPanel(getDict().CommonApiPanel, {
            contextType : ContextType.War,
        });
    }

    private _onTouchedBtnConExpression(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0941),
        });
    }
    private _onTouchedGroupModifyConExpression(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition = this._getCondition();
        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : condition.getExpression(),
            expressionInfo  : ExpressionInfo,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (condition.getExpression() != text) {
                    condition.setExpression(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputExpression();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(TextType.B0146);
        this._btnType.setLangText(TextType.B0516);
        this._btnIdentifier.setLangText(TextType.B0131);
        this._btnConExpression.setLangText(TextType.B0129);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getBriefDescForCondition(condition, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateInputExpression(): void {
        const condition = this._getCondition();

        {
            const label = this._labelConExpression;
            label.setText(condition.getExpression() ?? ``);
            this._groupConExpression.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const scrContent    = this._scrContent;
        const layoutContent = this._layoutContent;
        layoutContent.arrangeItems();
        scrContent.updateOnItemsChanged();
        scrContent.setUnscaledManualHeight(Math.min(140, layoutContent.getScaledHeight()));
    }

    private _getCondition(): WecExpression {
        return getExisted(this.getOpenData()?.condition.getWecExpression());
    }
}
