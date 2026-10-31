import {
    Graphics_Constants,
    ExpressionParsers_Enums,
    Notifications_Dispatcher,
    WarEvents_Actions_Constants_PersistentModifyPlayerAttribute,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaPersistentModifyPlayerAttribute } from "../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyPlayerAttribute.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnIdentifier!                                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                                    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrExpression!                                : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupExpression!                              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupCon!                                     : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupAct!                                     : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _btnConIsEffectiveInMpw!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsEffectiveInMpw!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupConPlayerFilter!                         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyConPlayerFilter!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnConPlayerFilter!                           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActBannedUnitTypeArray!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActBannedUnitTypeArray!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActBannedUnitTypeArray!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActBannedUnitTypeArray!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActUnbannedUnitTypeArray!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActUnbannedUnitTypeArray!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActUnbannedUnitTypeArray!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActUnbannedUnitTypeArray!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActCanActivateCoSkill!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCanActivateCoSkill!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActCanActivateCoSkill!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCanActivateCoSkill!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActEnergyGrowthMultiplierModifier!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActEnergyGrowthMultiplierModifier! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActEnergyGrowthMultiplierModifier!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActEnergyGrowthMultiplierModifier!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActCoZoneRadiusModifier!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActCoZoneRadiusModifier!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActCoZoneRadiusModifier!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActCoZoneRadiusModifier!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupActAiUnitProductionBonusScore!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModifyActAiUnitProductionBonusScore!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnActAiUnitProductionBonusScore!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActAiUnitProductionBonusScore!           : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged", callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                       callback : this.closePanel },
            { ui : this._btnType,                                        callback : this._onTouchedBtnType },
            { ui : this._btnIdentifier,                                  callback : this._onTouchedBtnIdentifier },
            { ui : this._btnConIsEffectiveInMpw,                         callback : this._onTouchedBtnConIsEffectiveInMpw },

            { ui : this._groupModifyConPlayerFilter,                     callback : this._onTouchedGroupModifyConPlayerFilter },
            { ui : this._btnConPlayerFilter,                             callback : this._onTouchedBtnConPlayerFilter },

            { ui : this._groupModifyActBannedUnitTypeArray,              callback : this._onTouchedGroupModifyActBannedUnitTypeArray },
            { ui : this._btnActBannedUnitTypeArray,                      callback : this._onTouchedBtnActBannedUnitTypeArray },

            { ui : this._groupModifyActUnbannedUnitTypeArray,            callback : this._onTouchedGroupModifyActUnbannedUnitTypeArray },
            { ui : this._btnActUnbannedUnitTypeArray,                    callback : this._onTouchedBtnActUnbannedUnitTypeArray },

            { ui : this._groupModifyActCanActivateCoSkill,               callback : this._onTouchedGroupModifyActCanActivateCoSkill },
            { ui : this._btnActCanActivateCoSkill,                       callback : this._onTouchedBtnActCanActivateCoSkill },

            { ui : this._groupModifyActEnergyGrowthMultiplierModifier,   callback : this._onTouchedGroupModifyActEnergyGrowthMultiplierModifier },
            { ui : this._btnActEnergyGrowthMultiplierModifier,           callback : this._onTouchedBtnActEnergyGrowthMultiplierModifier },

            { ui : this._groupModifyActCoZoneRadiusModifier,             callback : this._onTouchedGroupModifyActCoZoneRadiusModifier },
            { ui : this._btnActCoZoneRadiusModifier,                     callback : this._onTouchedBtnActCoZoneRadiusModifier },

            { ui : this._groupModifyActAiUnitProductionBonusScore,       callback : this._onTouchedGroupModifyActAiUnitProductionBonusScore },
            { ui : this._btnActAiUnitProductionBonusScore,               callback : this._onTouchedBtnActAiUnitProductionBonusScore },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeActionTypeListPanel, {
            fullData : openData.fullData,
            action   : openData.action,
            war      : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonApiPanel, {
            contextType : ExpressionParsers_Enums.ContextType.Player,
        });
    }
    private _onTouchedBtnConIsEffectiveInMpw(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        if (action.getIsEffectiveInMpw()) {
            action.setIsEffectiveInMpw(null);
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0538),
                callback   : () => {
                    action.setIsEffectiveInMpw(true);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            });
        }
    }

    private _onTouchedBtnConPlayerFilter(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0533),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getConPlayerFilter(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ConPlayerFilter,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getConPlayerFilter() != text) {
                    action.setConPlayerFilter(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActBannedUnitTypeArray(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0534),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActBannedUnitTypeArray(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActBannedUnitTypeArray() != text) {
                    action.setActBannedUnitTypeArray(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActUnbannedUnitTypeArray(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0535),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActUnbannedUnitTypeArray(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActUnbannedUnitTypeArray() != text) {
                    action.setActUnbannedUnitTypeArray(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCanActivateCoSkill(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0536),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActCanActivateCoSkill(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActCanActivateCoSkill() != text) {
                    action.setActCanActivateCoSkill(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActEnergyGrowthMultiplierModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0537),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActEnergyGrowthMultiplierModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActEnergyGrowthMultiplierModifier() != text) {
                    action.setActEnergyGrowthMultiplierModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoZoneRadiusModifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActCoZoneRadiusModifier(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActCoZoneRadiusModifier() != text) {
                    action.setActCoZoneRadiusModifier(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAiUnitProductionBonusScore(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore.getHelpText(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputExpressionPanel, {
            currentValue   : action.getActAiUnitProductionBonusScore(),
            expressionInfo : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore,
            fullData       : openData.fullData,
            isReviewingMap : openData.war.getIsReviewingMap(),
            callback       : text => {
                if (action.getActAiUnitProductionBonusScore() != text) {
                    action.setActAiUnitProductionBonusScore(text);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnIdentifier.setLangText(Lang_Constants.TextType.B0131);
        this._btnConIsEffectiveInMpw.setLangText(Lang_Constants.TextType.B1170);

        this._btnConPlayerFilter.setText(WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ConPlayerFilter.getTitleText());
        this._btnActBannedUnitTypeArray.setText(WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray.getTitleText());
        this._btnActUnbannedUnitTypeArray.setText(WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray.getTitleText());
        this._btnActCanActivateCoSkill.setText(WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill.getTitleText());
        this._btnActEnergyGrowthMultiplierModifier.setText(WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier.getTitleText());
        this._btnActCoZoneRadiusModifier.setText(WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier.getTitleText());
        this._btnActAiUnitProductionBonusScore.setText(WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore.getTitleText());

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
        const errorTip          = WarEvents_Actions_Utils_Common.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Actions_Utils_Common.getBriefDescForAction(action, war.getGcData()) || Lang_Constants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConIsEffectiveInMpw(): void {
        this._labelConIsEffectiveInMpw.setLangText(this.getAction()?.getIsEffectiveInMpw() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
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

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentModifyPlayerAttribute> {
        return this.getOpenData()?.action.getWeaPersistentModifyPlayerAttribute();
    }
}
