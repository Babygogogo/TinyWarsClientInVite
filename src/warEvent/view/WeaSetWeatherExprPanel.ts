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
import type { WeaSetWeatherExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetWeatherExpr.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/SetWeatherExpr.ts";
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
    private readonly _groupAct!                                         : IUiLayout;

    private readonly _groupWeatherType!                                 : IUiContainer;
    private readonly _groupModifyWeatherType!                           : IUiContainer;
    private readonly _btnWeatherType!                                   : IUiButton;
    private readonly _labelWeatherType!                                 : IUiLabel;

    private readonly _groupWeatherTurnsCount!                           : IUiContainer;
    private readonly _groupModifyWeatherTurnsCount!                     : IUiContainer;
    private readonly _labelWeatherTurnsCount!                           : IUiLabel;
    private readonly _btnWeatherTurnsCount!                             : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyWeatherType,                         callback: this._onTouchedGroupModifyWeatherType },
            { ui: this._btnWeatherType,                                 callback: this._onTouchedBtnWeatherType },

            { ui: this._groupModifyWeatherTurnsCount,                   callback: this._onTouchedGroupModifyWeatherTurnsCount },
            { ui: this._btnWeatherTurnsCount,                           callback: this._onTouchedBtnWeatherTurnsCount },
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

    private _onTouchedBtnWeatherType(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.WeatherType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyWeatherType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getWeatherType(),
            expressionInfo  : ExpressionInfoDict.WeatherType,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getWeatherType() != text) {
                    action.setWeatherType(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnWeatherTurnsCount(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.WeatherTurnsCount.getHelpText(),
        });
    }
    private _onTouchedGroupModifyWeatherTurnsCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getWeatherTurnsCount(),
            expressionInfo  : ExpressionInfoDict.WeatherTurnsCount,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getWeatherTurnsCount() != text) {
                    action.setWeatherTurnsCount(text);
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
        this._btnType.setText(getText(TextType.B0516));
        this._btnIdentifier.setText(getText(TextType.B0131));
        this._btnWeatherType.setText(ExpressionInfoDict.WeatherType.getTitleText());
        this._btnWeatherTurnsCount.setText(ExpressionInfoDict.WeatherTurnsCount.getTitleText());

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
            const label = this._labelWeatherType;
            label.setText(action.getWeatherType() ?? ``);
            this._groupWeatherType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelWeatherTurnsCount;
            label.setText(action.getWeatherTurnsCount() ?? ``);
            this._groupWeatherTurnsCount.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaSetWeatherExpr> {
        return this.getOpenData()?.action.getWeaSetWeatherExpr();
    }
}
