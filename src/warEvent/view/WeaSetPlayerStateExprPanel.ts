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
import type * as ProtoSchemaCommonProtoWarEventWeaSetPlayerStateExpr from "../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateExpr.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsSetPlayerStateExpr from "../../warEvents/actions/constants/SetPlayerStateExpr.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction             = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnIdentifier!                            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCoId!                                  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                            : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupCon!                                 : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                 : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupConPlayerFilter!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConPlayerFilter!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnConPlayerFilter!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActFund!                             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActFund!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActFund!                             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActFund!                               : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCoId!                             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCoId!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCoId!                             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCoId!                               : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCoEnergy!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCoEnergy!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCoEnergy!                         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCoEnergy!                           : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCoUsingSkillType!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCoUsingSkillType!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCoUsingSkillType!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCoUsingSkillType!                   : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActActivateCoSkillType!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActActivateCoSkillType!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActActivateCoSkillType!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActActivateCoSkillType!                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActAliveState!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActAliveState!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActAliveState!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActAliveState!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActSkipTurn!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActSkipTurn!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActSkipTurn!                         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActSkipTurn!                           : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
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
    private _onTouchedBtnCoId(): void {
        const gcData = this.getOpenData()?.war.getGcData();
        if (gcData != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoIdPanel, {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter.getHelpText(),
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
            expressionInfo  : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter,
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

    private _onTouchedBtnActFund(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActFund.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActFund(),
            expressionInfo  : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActFund,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActFund() != text) {
                    action.setActFund(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoId(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoId.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCoId(),
            expressionInfo  : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoId,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCoId() != text) {
                    action.setActCoId(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoEnergy(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCoEnergy(),
            expressionInfo  : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCoEnergy() != text) {
                    action.setActCoEnergy(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCoUsingSkillType(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCoUsingSkillType(),
            expressionInfo  : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCoUsingSkillType() != text) {
                    action.setActCoUsingSkillType(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActActivateCoSkillType(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActActivateCoSkillType(),
            expressionInfo  : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActActivateCoSkillType() != text) {
                    action.setActActivateCoSkillType(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActAliveState(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActAliveState.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActAliveState(),
            expressionInfo  : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActAliveState,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActAliveState() != text) {
                    action.setActAliveState(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActSkipTurn(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsSkipTurn(),
            expressionInfo  : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsSkipTurn() != text) {
                    action.setActIsSkipTurn(text);
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
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnIdentifier.setLangText(LangConstants.TextType.B0131);
        this._btnCoId.setText(`CO ID`);
        this._btnConPlayerFilter.setText(WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter.getTitleText());
        this._btnActFund.setText(WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActFund.getTitleText());
        this._btnActCoId.setText(WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoId.getTitleText());
        this._btnActCoEnergy.setText(WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy.getTitleText());
        this._btnActCoUsingSkillType.setText(WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType.getTitleText());
        this._btnActActivateCoSkillType.setText(WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType.getTitleText());
        this._btnActAliveState.setText(WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActAliveState.getTitleText());
        this._btnActSkipTurn.setText(WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn.getTitleText());

        this._updateLabelDescAndLabelError();
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
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getBriefDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
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

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetPlayerStateExpr.WeaSetPlayerStateExpr> {
        return this.getOpenData()?.action.getWeaSetPlayerStateExpr();
    }
}
