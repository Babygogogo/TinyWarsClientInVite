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
import type * as ProtoSchemaCommonProtoWarEventWeaSetViewpointExpr from "../../proto/schema/CommonProto/WarEvent/WeaSetViewpointExpr.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsSetViewpointExpr from "../../warEvents/actions/constants/SetViewpointExpr.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction         = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnIdentifier!                                    : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                                    : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                                  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                         : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupTargets!                                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyTargets!                               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnTargets!                                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTargets!                                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupNeedFocusEffect!                             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyNeedFocusEffect!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelNeedFocusEffect!                             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnNeedFocusEffect!                               : UiInterfacesIUiButton.IUiButton;

    private readonly _groupIsOneByOne!                                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyIsOneByOne!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelIsOneByOne!                                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnIsOneByOne!                                    : UiInterfacesIUiButton.IUiButton;

    private readonly _groupInterval!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyInterval!                              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelInterval!                                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnInterval!                                      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
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

    private _onTouchedBtnTargets(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Targets.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getTargets(),
            expressionInfo  : WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Targets,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getTargets() != text) {
                    action.setTargets(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnNeedFocusEffect(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.NeedFocusEffect.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getNeedFocusEffect(),
            expressionInfo  : WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.NeedFocusEffect,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getNeedFocusEffect() != text) {
                    action.setNeedFocusEffect(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnIsOneByOne(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.IsOneByOne.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getIsOneByOne(),
            expressionInfo  : WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.IsOneByOne,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getIsOneByOne() != text) {
                    action.setIsOneByOne(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnInterval(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Interval.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getInterval(),
            expressionInfo  : WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Interval,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getInterval() != text) {
                    action.setInterval(text);
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
        this._btnTargets.setText(WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Targets.getTitleText());
        this._btnNeedFocusEffect.setText(WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.NeedFocusEffect.getTitleText());
        this._btnIsOneByOne.setText(WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.IsOneByOne.getTitleText());
        this._btnInterval.setText(WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Interval.getTitleText());

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

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetViewpointExpr.WeaSetViewpointExpr> {
        return this.getOpenData()?.action.getWeaSetViewpointExpr();
    }
}
