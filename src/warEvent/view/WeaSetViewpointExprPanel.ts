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
import type { WeaSetViewpointExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetViewpointExpr.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/SetViewpointExpr.ts";
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

    private readonly _groupTargets!                                     : IUiContainer;
    private readonly _groupModifyTargets!                               : IUiContainer;
    private readonly _btnTargets!                                       : IUiButton;
    private readonly _labelTargets!                                     : IUiLabel;

    private readonly _groupNeedFocusEffect!                             : IUiContainer;
    private readonly _groupModifyNeedFocusEffect!                       : IUiContainer;
    private readonly _labelNeedFocusEffect!                             : IUiLabel;
    private readonly _btnNeedFocusEffect!                               : IUiButton;

    private readonly _groupIsOneByOne!                                  : IUiContainer;
    private readonly _groupModifyIsOneByOne!                            : IUiContainer;
    private readonly _labelIsOneByOne!                                  : IUiLabel;
    private readonly _btnIsOneByOne!                                    : IUiButton;

    private readonly _groupInterval!                                    : IUiContainer;
    private readonly _groupModifyInterval!                              : IUiContainer;
    private readonly _labelInterval!                                    : IUiLabel;
    private readonly _btnInterval!                                      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyTargets,                             callback: this._onTouchedGroupModifyTargets },
            { ui: this._btnTargets,                                     callback: this._onTouchedBtnTargets },

            { ui: this._groupModifyNeedFocusEffect,                     callback: this._onTouchedGroupModifyNeedFocusEffect },
            { ui: this._btnNeedFocusEffect,                             callback: this._onTouchedBtnNeedFocusEffect },

            { ui: this._groupModifyIsOneByOne,                          callback: this._onTouchedGroupModifyIsOneByOne },
            { ui: this._btnIsOneByOne,                                  callback: this._onTouchedBtnIsOneByOne },

            { ui: this._groupModifyInterval,                            callback: this._onTouchedGroupModifyInterval },
            { ui: this._btnInterval,                                    callback: this._onTouchedBtnInterval },
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

    private _onTouchedBtnTargets(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.Targets.getHelpText(),
        });
    }
    private _onTouchedGroupModifyTargets(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getTargets(),
            expressionInfo  : ExpressionInfoDict.Targets,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getTargets() != text) {
                    action.setTargets(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnNeedFocusEffect(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.NeedFocusEffect.getHelpText(),
        });
    }
    private _onTouchedGroupModifyNeedFocusEffect(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getNeedFocusEffect(),
            expressionInfo  : ExpressionInfoDict.NeedFocusEffect,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getNeedFocusEffect() != text) {
                    action.setNeedFocusEffect(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnIsOneByOne(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.IsOneByOne.getHelpText(),
        });
    }
    private _onTouchedGroupModifyIsOneByOne(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getIsOneByOne(),
            expressionInfo  : ExpressionInfoDict.IsOneByOne,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getIsOneByOne() != text) {
                    action.setIsOneByOne(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnInterval(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.Interval.getHelpText(),
        });
    }
    private _onTouchedGroupModifyInterval(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getInterval(),
            expressionInfo  : ExpressionInfoDict.Interval,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getInterval() != text) {
                    action.setInterval(text);
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
        this._btnTargets.setText(ExpressionInfoDict.Targets.getTitleText());
        this._btnNeedFocusEffect.setText(ExpressionInfoDict.NeedFocusEffect.getTitleText());
        this._btnIsOneByOne.setText(ExpressionInfoDict.IsOneByOne.getTitleText());
        this._btnInterval.setText(ExpressionInfoDict.Interval.getTitleText());

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
            const label = this._labelTargets;
            label.setText(action.getTargets() ?? ``);
            this._groupTargets.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelNeedFocusEffect;
            label.setText(action.getNeedFocusEffect() ?? ``);
            this._groupNeedFocusEffect.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelIsOneByOne;
            label.setText(action.getIsOneByOne() ?? ``);
            this._groupIsOneByOne.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelInterval;
            label.setText(action.getInterval() ?? ``);
            this._groupInterval.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaSetViewpointExpr> {
        return this.getOpenData()?.action.getWeaSetViewpointExpr();
    }
}
