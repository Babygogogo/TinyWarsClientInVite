import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ContextType } from "../../expressionParsers/Enums.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getTextForYesOrNo } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaPersistentModifyPlayerAttribute } from "../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyPlayerAttribute.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ExpressionInfoDict } from "../../warEvents/actions/constants/PersistentModifyPlayerAttribute.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData                       = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction                         = ProtoSchemaCommonProtoWarEventWarEventAction;

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

    private readonly _btnConIsEffectiveInMpw!                       : IUiButton;
    private readonly _labelConIsEffectiveInMpw!                     : IUiLabel;

    private readonly _groupConPlayerFilter!                         : IUiContainer;
    private readonly _groupModifyConPlayerFilter!                   : IUiContainer;
    private readonly _btnConPlayerFilter!                           : IUiButton;
    private readonly _labelConPlayerFilter!                         : IUiLabel;

    private readonly _groupActBannedUnitTypeArray!                  : IUiContainer;
    private readonly _groupModifyActBannedUnitTypeArray!            : IUiContainer;
    private readonly _btnActBannedUnitTypeArray!                    : IUiButton;
    private readonly _labelActBannedUnitTypeArray!                  : IUiLabel;

    private readonly _groupActUnbannedUnitTypeArray!                : IUiContainer;
    private readonly _groupModifyActUnbannedUnitTypeArray!          : IUiContainer;
    private readonly _btnActUnbannedUnitTypeArray!                  : IUiButton;
    private readonly _labelActUnbannedUnitTypeArray!                : IUiLabel;

    private readonly _groupActCanActivateCoSkill!                   : IUiContainer;
    private readonly _groupModifyActCanActivateCoSkill!             : IUiContainer;
    private readonly _btnActCanActivateCoSkill!                     : IUiButton;
    private readonly _labelActCanActivateCoSkill!                   : IUiLabel;

    private readonly _groupActEnergyGrowthMultiplierModifier!       : IUiContainer;
    private readonly _groupModifyActEnergyGrowthMultiplierModifier! : IUiContainer;
    private readonly _btnActEnergyGrowthMultiplierModifier!         : IUiButton;
    private readonly _labelActEnergyGrowthMultiplierModifier!       : IUiLabel;

    private readonly _groupActCoZoneRadiusModifier!                 : IUiContainer;
    private readonly _groupModifyActCoZoneRadiusModifier!           : IUiContainer;
    private readonly _btnActCoZoneRadiusModifier!                   : IUiButton;
    private readonly _labelActCoZoneRadiusModifier!                 : IUiLabel;

    private readonly _groupActAiUnitProductionBonusScore!           : IUiContainer;
    private readonly _groupModifyActAiUnitProductionBonusScore!     : IUiContainer;
    private readonly _btnActAiUnitProductionBonusScore!             : IUiButton;
    private readonly _labelActAiUnitProductionBonusScore!           : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },
            { ui: this._btnConIsEffectiveInMpw,                         callback: this._onTouchedBtnConIsEffectiveInMpw },

            { ui: this._groupModifyConPlayerFilter,                     callback: this._onTouchedGroupModifyConPlayerFilter },
            { ui: this._btnConPlayerFilter,                             callback: this._onTouchedBtnConPlayerFilter },

            { ui: this._groupModifyActBannedUnitTypeArray,              callback: this._onTouchedGroupModifyActBannedUnitTypeArray },
            { ui: this._btnActBannedUnitTypeArray,                      callback: this._onTouchedBtnActBannedUnitTypeArray },

            { ui: this._groupModifyActUnbannedUnitTypeArray,            callback: this._onTouchedGroupModifyActUnbannedUnitTypeArray },
            { ui: this._btnActUnbannedUnitTypeArray,                    callback: this._onTouchedBtnActUnbannedUnitTypeArray },

            { ui: this._groupModifyActCanActivateCoSkill,               callback: this._onTouchedGroupModifyActCanActivateCoSkill },
            { ui: this._btnActCanActivateCoSkill,                       callback: this._onTouchedBtnActCanActivateCoSkill },

            { ui: this._groupModifyActEnergyGrowthMultiplierModifier,   callback: this._onTouchedGroupModifyActEnergyGrowthMultiplierModifier },
            { ui: this._btnActEnergyGrowthMultiplierModifier,           callback: this._onTouchedBtnActEnergyGrowthMultiplierModifier },

            { ui: this._groupModifyActCoZoneRadiusModifier,             callback: this._onTouchedGroupModifyActCoZoneRadiusModifier },
            { ui: this._btnActCoZoneRadiusModifier,                     callback: this._onTouchedBtnActCoZoneRadiusModifier },

            { ui: this._groupModifyActAiUnitProductionBonusScore,       callback: this._onTouchedGroupModifyActAiUnitProductionBonusScore },
            { ui: this._btnActAiUnitProductionBonusScore,               callback: this._onTouchedBtnActAiUnitProductionBonusScore },
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
    private _onTouchedBtnConIsEffectiveInMpw(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        if (action.getIsEffectiveInMpw()) {
            action.setIsEffectiveInMpw(null);
            dispatch(TypeId.WarEventFullDataChanged);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.A0538),
                callback    : () => {
                    action.setIsEffectiveInMpw(true);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            });
        }
    }

    private _onTouchedBtnConPlayerFilter(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0533),
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

    private _onTouchedBtnActBannedUnitTypeArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0534),
        });
    }
    private _onTouchedGroupModifyActBannedUnitTypeArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBannedUnitTypeArray(),
            expressionInfo  : ExpressionInfoDict.ActBannedUnitTypeArray,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBannedUnitTypeArray() != text) {
                    action.setActBannedUnitTypeArray(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnbannedUnitTypeArray(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0535),
        });
    }
    private _onTouchedGroupModifyActUnbannedUnitTypeArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnbannedUnitTypeArray(),
            expressionInfo  : ExpressionInfoDict.ActUnbannedUnitTypeArray,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnbannedUnitTypeArray() != text) {
                    action.setActUnbannedUnitTypeArray(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanActivateCoSkill(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0536),
        });
    }
    private _onTouchedGroupModifyActCanActivateCoSkill(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanActivateCoSkill(),
            expressionInfo  : ExpressionInfoDict.ActCanActivateCoSkill,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanActivateCoSkill() != text) {
                    action.setActCanActivateCoSkill(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActEnergyGrowthMultiplierModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0537),
        });
    }
    private _onTouchedGroupModifyActEnergyGrowthMultiplierModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActEnergyGrowthMultiplierModifier(),
            expressionInfo  : ExpressionInfoDict.ActEnergyGrowthMultiplierModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActEnergyGrowthMultiplierModifier() != text) {
                    action.setActEnergyGrowthMultiplierModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoZoneRadiusModifier(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActCoZoneRadiusModifier.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCoZoneRadiusModifier(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCoZoneRadiusModifier(),
            expressionInfo  : ExpressionInfoDict.ActCoZoneRadiusModifier,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCoZoneRadiusModifier() != text) {
                    action.setActCoZoneRadiusModifier(text);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAiUnitProductionBonusScore(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => ExpressionInfoDict.ActAiUnitProductionBonusScore.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActAiUnitProductionBonusScore(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAiUnitProductionBonusScore(),
            expressionInfo  : ExpressionInfoDict.ActAiUnitProductionBonusScore,
            fullData        : getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAiUnitProductionBonusScore() != text) {
                    action.setActAiUnitProductionBonusScore(text);
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
        this._btnConIsEffectiveInMpw.setLangText(TextType.B1170);

        this._btnConPlayerFilter.setText(ExpressionInfoDict.ConPlayerFilter.getTitleText());
        this._btnActBannedUnitTypeArray.setText(ExpressionInfoDict.ActBannedUnitTypeArray.getTitleText());
        this._btnActUnbannedUnitTypeArray.setText(ExpressionInfoDict.ActUnbannedUnitTypeArray.getTitleText());
        this._btnActCanActivateCoSkill.setText(ExpressionInfoDict.ActCanActivateCoSkill.getTitleText());
        this._btnActEnergyGrowthMultiplierModifier.setText(ExpressionInfoDict.ActEnergyGrowthMultiplierModifier.getTitleText());
        this._btnActCoZoneRadiusModifier.setText(ExpressionInfoDict.ActCoZoneRadiusModifier.getTitleText());
        this._btnActAiUnitProductionBonusScore.setText(ExpressionInfoDict.ActAiUnitProductionBonusScore.getTitleText());

        this._updateLabelDescAndLabelError();
        this._updateLabelConIsEffectiveInMpw();
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

    private _updateLabelConIsEffectiveInMpw(): void {
        this._labelConIsEffectiveInMpw.setText(getTextForYesOrNo(this.getAction()?.getIsEffectiveInMpw()));
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
            const label = this._labelActBannedUnitTypeArray;
            label.setText(action.getActBannedUnitTypeArray() ?? ``);
            this._groupActBannedUnitTypeArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActUnbannedUnitTypeArray;
            label.setText(action.getActUnbannedUnitTypeArray() ?? ``);
            this._groupActUnbannedUnitTypeArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCanActivateCoSkill;
            label.setText(action.getActCanActivateCoSkill() ?? ``);
            this._groupActCanActivateCoSkill.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActEnergyGrowthMultiplierModifier;
            label.setText(action.getActEnergyGrowthMultiplierModifier() ?? ``);
            this._groupActEnergyGrowthMultiplierModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCoZoneRadiusModifier;
            label.setText(action.getActCoZoneRadiusModifier() ?? ``);
            this._groupActCoZoneRadiusModifier.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActAiUnitProductionBonusScore;
            label.setText(action.getActAiUnitProductionBonusScore() ?? ``);
            this._groupActAiUnitProductionBonusScore.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaPersistentModifyPlayerAttribute> {
        return this.getOpenData()?.action.getWeaPersistentModifyPlayerAttribute();
    }
}
