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
import type { WeaSetTaskObjectiveState } from "../../proto/schema/CommonProto/WarEvent/WeaSetTaskObjectiveState.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/SetTaskObjectiveState.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction                 = ProtoSchemaCommonProtoWarEventWarEventAction;

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

    private readonly _groupConTaskObjectiveFilter!                      : IUiContainer;
    private readonly _groupModifyConTaskObjectiveFilter!                : IUiContainer;
    private readonly _btnConTaskObjectiveFilter!                        : IUiButton;
    private readonly _labelConTaskObjectiveFilter!                      : IUiLabel;

    private readonly _groupActProgress!                                 : IUiContainer;
    private readonly _groupModifyActProgress!                           : IUiContainer;
    private readonly _labelActProgress!                                 : IUiLabel;
    private readonly _btnActProgress!                                   : IUiButton;

    private readonly _groupActIsHidden!                                 : IUiContainer;
    private readonly _groupModifyActIsHidden!                           : IUiContainer;
    private readonly _labelActIsHidden!                                 : IUiLabel;
    private readonly _btnActIsHidden!                                   : IUiButton;

    private readonly _groupActIsProgressUpdaterDisabled!                : IUiContainer;
    private readonly _groupModifyActIsProgressUpdaterDisabled!          : IUiContainer;
    private readonly _labelActIsProgressUpdaterDisabled!                : IUiLabel;
    private readonly _btnActIsProgressUpdaterDisabled!                  : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTaskObjectiveFilter,              callback: this._onTouchedGroupModifyConTaskObjectiveFilter },
            { ui: this._btnConTaskObjectiveFilter,                      callback: this._onTouchedBtnConTaskObjectiveFilter },

            { ui: this._groupModifyActProgress,                         callback: this._onTouchedGroupModifyActProgress },
            { ui: this._btnActProgress,                                 callback: this._onTouchedBtnActProgress },

            { ui: this._groupModifyActIsHidden,                         callback: this._onTouchedGroupModifyActIsHidden },
            { ui: this._btnActIsHidden,                                 callback: this._onTouchedBtnActIsHidden },

            { ui: this._groupModifyActIsProgressUpdaterDisabled,        callback: this._onTouchedGroupModifyActIsProgressUpdaterDisabled },
            { ui: this._btnActIsProgressUpdaterDisabled,                callback: this._onTouchedBtnActIsProgressUpdaterDisabled },
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

    private _onTouchedBtnConTaskObjectiveFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ConTaskObjectiveFilter.getHelpText(),
        });
    }
    private _onTouchedGroupModifyConTaskObjectiveFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConTaskObjectiveFilter(),
            expressionInfo  : ExpressionInfoDict.ConTaskObjectiveFilter,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConTaskObjectiveFilter() != text) {
                    action.setConTaskObjectiveFilter(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActProgress(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActProgress.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActProgress(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActProgress(),
            expressionInfo  : ExpressionInfoDict.ActProgress,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActProgress() != text) {
                    action.setActProgress(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsHidden(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActIsHidden.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsHidden(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsHidden(),
            expressionInfo  : ExpressionInfoDict.ActIsHidden,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsHidden() != text) {
                    action.setActIsHidden(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsProgressUpdaterDisabled(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActIsProgressUpdaterDisabled.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsProgressUpdaterDisabled(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsProgressUpdaterDisabled(),
            expressionInfo  : ExpressionInfoDict.ActIsProgressUpdaterDisabled,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsProgressUpdaterDisabled() != text) {
                    action.setActIsProgressUpdaterDisabled(text);
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
        this._btnConTaskObjectiveFilter.setText(ExpressionInfoDict.ConTaskObjectiveFilter.getTitleText());
        this._btnActProgress.setText(ExpressionInfoDict.ActProgress.getTitleText());
        this._btnActIsHidden.setText(ExpressionInfoDict.ActIsHidden.getTitleText());
        this._btnActIsProgressUpdaterDisabled.setText(ExpressionInfoDict.ActIsProgressUpdaterDisabled.getTitleText());

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
            const label = this._labelConTaskObjectiveFilter;
            label.setText(action.getConTaskObjectiveFilter() ?? ``);
            this._groupConTaskObjectiveFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActProgress;
            label.setText(action.getActProgress() ?? ``);
            this._groupActProgress.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsHidden;
            label.setText(action.getActIsHidden() ?? ``);
            this._groupActIsHidden.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsProgressUpdaterDisabled;
            label.setText(action.getActIsProgressUpdaterDisabled() ?? ``);
            this._groupActIsProgressUpdaterDisabled.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaSetTaskObjectiveState> {
        return this.getOpenData()?.action.getWeaSetTaskObjectiveState();
    }
}
