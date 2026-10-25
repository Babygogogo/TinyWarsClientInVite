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
import type { WeaSetPlayerStateExpr } from "../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateExpr.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/SetPlayerStateExpr.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction             = ProtoSchemaCommonProtoWarEventWarEventAction;

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
    private readonly _btnCoId!                                  : IUiButton;

    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _scrExpression!                            : IUiScroller<IUiLayout>;
    private readonly _groupExpression!                          : IUiLayout;
    private readonly _groupCon!                                 : IUiLayout;
    private readonly _groupAct!                                 : IUiLayout;

    private readonly _groupConPlayerFilter!                     : IUiContainer;
    private readonly _groupModifyConPlayerFilter!               : IUiContainer;
    private readonly _btnConPlayerFilter!                       : IUiButton;
    private readonly _labelConPlayerFilter!                     : IUiLabel;

    private readonly _groupActFund!                             : IUiContainer;
    private readonly _groupModifyActFund!                       : IUiContainer;
    private readonly _labelActFund!                             : IUiLabel;
    private readonly _btnActFund!                               : IUiButton;

    private readonly _groupActCoId!                             : IUiContainer;
    private readonly _groupModifyActCoId!                       : IUiContainer;
    private readonly _labelActCoId!                             : IUiLabel;
    private readonly _btnActCoId!                               : IUiButton;

    private readonly _groupActCoEnergy!                         : IUiContainer;
    private readonly _groupModifyActCoEnergy!                   : IUiContainer;
    private readonly _labelActCoEnergy!                         : IUiLabel;
    private readonly _btnActCoEnergy!                           : IUiButton;

    private readonly _groupActCoUsingSkillType!                 : IUiContainer;
    private readonly _groupModifyActCoUsingSkillType!           : IUiContainer;
    private readonly _labelActCoUsingSkillType!                 : IUiLabel;
    private readonly _btnActCoUsingSkillType!                   : IUiButton;

    private readonly _groupActActivateCoSkillType!              : IUiContainer;
    private readonly _groupModifyActActivateCoSkillType!        : IUiContainer;
    private readonly _labelActActivateCoSkillType!              : IUiLabel;
    private readonly _btnActActivateCoSkillType!                : IUiButton;

    private readonly _groupActAliveState!                       : IUiContainer;
    private readonly _groupModifyActAliveState!                 : IUiContainer;
    private readonly _btnActAliveState!                         : IUiButton;
    private readonly _labelActAliveState!                       : IUiLabel;

    private readonly _groupActSkipTurn!                         : IUiContainer;
    private readonly _groupModifyActSkipTurn!                   : IUiContainer;
    private readonly _labelActSkipTurn!                         : IUiLabel;
    private readonly _btnActSkipTurn!                           : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnType,                                    callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                              callback: this._onTouchedBtnIdentifier },
            { ui: this._btnCoId,                                    callback: this._onTouchedBtnCoId },

            { ui: this._groupModifyConPlayerFilter,                 callback: this._onTouchedGroupModifyConPlayerFilter },
            { ui: this._btnConPlayerFilter,                         callback: this._onTouchedBtnConPlayerFilter },

            { ui: this._groupModifyActFund,                         callback: this._onTouchedGroupModifyActFund },
            { ui: this._btnActFund,                                 callback: this._onTouchedBtnActFund },

            { ui: this._groupModifyActCoId,                         callback: this._onTouchedGroupModifyActCoId },
            { ui: this._btnActCoId,                                 callback: this._onTouchedBtnActCoId },

            { ui: this._groupModifyActCoEnergy,                     callback: this._onTouchedGroupModifyActCoEnergy },
            { ui: this._btnActCoEnergy,                             callback: this._onTouchedBtnActCoEnergy },

            { ui: this._groupModifyActCoUsingSkillType,             callback: this._onTouchedGroupModifyActCoUsingSkillType },
            { ui: this._btnActCoUsingSkillType,                     callback: this._onTouchedBtnActCoUsingSkillType },

            { ui: this._groupModifyActActivateCoSkillType,          callback: this._onTouchedGroupModifyActActivateCoSkillType },
            { ui: this._btnActActivateCoSkillType,                  callback: this._onTouchedBtnActActivateCoSkillType },

            { ui: this._groupModifyActAliveState,                   callback: this._onTouchedGroupModifyActAliveState },
            { ui: this._btnActAliveState,                           callback: this._onTouchedBtnActAliveState },

            { ui: this._groupModifyActSkipTurn,                     callback: this._onTouchedGroupModifyActSkipTurn },
            { ui: this._btnActSkipTurn,                             callback: this._onTouchedBtnActSkipTurn },
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
    private _onTouchedBtnCoId(): void {
        const gcData = this.getOpenData()?.war.getGcData();
        if (gcData != null) {
            openPanel(getDict().CommonShowCoIdPanel, {
                gameConfig          : gcData,
                currentCoIdArray    : [],
                availableCoIdArray  : gcData.getAllEnabledCoArray().map(v => v.getCoId()),
                isBan               : false,
                showCoId            : true,
                getTitleText        : () => `CO ID`,
            });
        }
    }

    private _onTouchedBtnConPlayerFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ConPlayerFilter.getHelpText(),
        });
    }
    private _onTouchedGroupModifyConPlayerFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConPlayerFilter(),
            expressionInfo  : ExpressionInfoDict.ConPlayerFilter,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConPlayerFilter() != text) {
                    action.setConPlayerFilter(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActFund(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActFund.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActFund(),
            expressionInfo  : ExpressionInfoDict.ActFund,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActFund() != text) {
                    action.setActFund(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoId(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCoId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCoId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCoId(),
            expressionInfo  : ExpressionInfoDict.ActCoId,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCoId() != text) {
                    action.setActCoId(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoEnergy(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCoEnergy.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCoEnergy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCoEnergy(),
            expressionInfo  : ExpressionInfoDict.ActCoEnergy,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCoEnergy() != text) {
                    action.setActCoEnergy(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoUsingSkillType(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCoUsingSkillType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCoUsingSkillType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCoUsingSkillType(),
            expressionInfo  : ExpressionInfoDict.ActCoUsingSkillType,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCoUsingSkillType() != text) {
                    action.setActCoUsingSkillType(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActActivateCoSkillType(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActActivateCoSkillType.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActActivateCoSkillType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActActivateCoSkillType(),
            expressionInfo  : ExpressionInfoDict.ActActivateCoSkillType,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActActivateCoSkillType() != text) {
                    action.setActActivateCoSkillType(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAliveState(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActAliveState.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActAliveState(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAliveState(),
            expressionInfo  : ExpressionInfoDict.ActAliveState,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAliveState() != text) {
                    action.setActAliveState(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActSkipTurn(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActSkipTurn.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActSkipTurn(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsSkipTurn(),
            expressionInfo  : ExpressionInfoDict.ActSkipTurn,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsSkipTurn() != text) {
                    action.setActIsSkipTurn(text);
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
        this._btnCoId.setText(`CO ID`);
        this._btnConPlayerFilter.setText(ExpressionInfoDict.ConPlayerFilter.getTitleText());
        this._btnActFund.setText(ExpressionInfoDict.ActFund.getTitleText());
        this._btnActCoId.setText(ExpressionInfoDict.ActCoId.getTitleText());
        this._btnActCoEnergy.setText(ExpressionInfoDict.ActCoEnergy.getTitleText());
        this._btnActCoUsingSkillType.setText(ExpressionInfoDict.ActCoUsingSkillType.getTitleText());
        this._btnActActivateCoSkillType.setText(ExpressionInfoDict.ActActivateCoSkillType.getTitleText());
        this._btnActAliveState.setText(ExpressionInfoDict.ActAliveState.getTitleText());
        this._btnActSkipTurn.setText(ExpressionInfoDict.ActSkipTurn.getTitleText());

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
            const label = this._labelConPlayerFilter;
            label.setText(action.getConPlayerFilter() ?? ``);
            this._groupConPlayerFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActFund;
            label.setText(action.getActFund() ?? ``);
            this._groupActFund.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCoId;
            label.setText(action.getActCoId() ?? ``);
            this._groupActCoId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCoEnergy;
            label.setText(action.getActCoEnergy() ?? ``);
            this._groupActCoEnergy.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCoUsingSkillType;
            label.setText(action.getActCoUsingSkillType() ?? ``);
            this._groupActCoUsingSkillType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActActivateCoSkillType;
            label.setText(action.getActActivateCoSkillType() ?? ``);
            this._groupActActivateCoSkillType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActAliveState;
            label.setText(action.getActAliveState() ?? ``);
            this._groupActAliveState.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActSkipTurn;
            label.setText(action.getActIsSkipTurn() ?? ``);
            this._groupActSkipTurn.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaSetPlayerStateExpr> {
        return this.getOpenData()?.action.getWeaSetPlayerStateExpr();
    }
}
