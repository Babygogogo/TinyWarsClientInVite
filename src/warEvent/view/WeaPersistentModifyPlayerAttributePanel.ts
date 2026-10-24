import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as ExpressionParsersEnums from "../../expressionParsers/Enums.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaPersistentModifyPlayerAttribute from "../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyPlayerAttribute.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsPersistentModifyPlayerAttribute from "../../warEvents/actions/constants/PersistentModifyPlayerAttribute.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData                       = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction                         = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnIdentifier!                                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                                : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupCon!                                     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                     : UiInterfacesIUiLayout.IUiLayout;

    private readonly _btnConIsEffectiveInMpw!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsEffectiveInMpw!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupConPlayerFilter!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConPlayerFilter!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnConPlayerFilter!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActBannedUnitTypeArray!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActBannedUnitTypeArray!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActBannedUnitTypeArray!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActBannedUnitTypeArray!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActUnbannedUnitTypeArray!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActUnbannedUnitTypeArray!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActUnbannedUnitTypeArray!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActUnbannedUnitTypeArray!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActCanActivateCoSkill!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCanActivateCoSkill!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActCanActivateCoSkill!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCanActivateCoSkill!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActEnergyGrowthMultiplierModifier!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActEnergyGrowthMultiplierModifier! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActEnergyGrowthMultiplierModifier!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActEnergyGrowthMultiplierModifier!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActCoZoneRadiusModifier!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCoZoneRadiusModifier!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActCoZoneRadiusModifier!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCoZoneRadiusModifier!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActAiUnitProductionBonusScore!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActAiUnitProductionBonusScore!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActAiUnitProductionBonusScore!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActAiUnitProductionBonusScore!           : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionTypeListPanel, {
            fullData    : openData.fullData,
            action      : openData.action,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonApiPanel, {
            contextType : ExpressionParsersEnums.ContextType.Player,
        });
    }
    private _onTouchedBtnConIsEffectiveInMpw(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        if (action.getIsEffectiveInMpw()) {
            action.setIsEffectiveInMpw(null);
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.A0538),
                callback    : () => {
                    action.setIsEffectiveInMpw(true);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            });
        }
    }

    private _onTouchedBtnConPlayerFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0533),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConPlayerFilter(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ConPlayerFilter,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConPlayerFilter() != text) {
                    action.setConPlayerFilter(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBannedUnitTypeArray(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0534),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBannedUnitTypeArray(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBannedUnitTypeArray() != text) {
                    action.setActBannedUnitTypeArray(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnbannedUnitTypeArray(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0535),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActUnbannedUnitTypeArray(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActUnbannedUnitTypeArray() != text) {
                    action.setActUnbannedUnitTypeArray(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanActivateCoSkill(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0536),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCanActivateCoSkill(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCanActivateCoSkill() != text) {
                    action.setActCanActivateCoSkill(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActEnergyGrowthMultiplierModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0537),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActEnergyGrowthMultiplierModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActEnergyGrowthMultiplierModifier() != text) {
                    action.setActEnergyGrowthMultiplierModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoZoneRadiusModifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCoZoneRadiusModifier(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCoZoneRadiusModifier() != text) {
                    action.setActCoZoneRadiusModifier(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAiUnitProductionBonusScore(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAiUnitProductionBonusScore(),
            expressionInfo  : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAiUnitProductionBonusScore() != text) {
                    action.setActAiUnitProductionBonusScore(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnIdentifier.setLangText(LangConstants.TextType.B0131);
        this._btnConIsEffectiveInMpw.setLangText(LangConstants.TextType.B1170);

        this._btnConPlayerFilter.setText(WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ConPlayerFilter.getTitleText());
        this._btnActBannedUnitTypeArray.setText(WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray.getTitleText());
        this._btnActUnbannedUnitTypeArray.setText(WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray.getTitleText());
        this._btnActCanActivateCoSkill.setText(WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill.getTitleText());
        this._btnActEnergyGrowthMultiplierModifier.setText(WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier.getTitleText());
        this._btnActCoZoneRadiusModifier.setText(WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier.getTitleText());
        this._btnActAiUnitProductionBonusScore.setText(WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore.getTitleText());

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
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getBriefDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConIsEffectiveInMpw(): void {
        this._labelConIsEffectiveInMpw.setText(LangUtils.getTextForYesOrNo(this.getAction()?.getIsEffectiveInMpw()));
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

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaPersistentModifyPlayerAttribute.WeaPersistentModifyPlayerAttribute> {
        return this.getOpenData()?.action.getWeaPersistentModifyPlayerAttribute();
    }
}
