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
import type * as ProtoSchemaCommonProtoWarEventWeaSetTaskObjectiveState from "../../proto/schema/CommonProto/WarEvent/WeaSetTaskObjectiveState.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsSetTaskObjectiveState from "../../warEvents/actions/constants/SetTaskObjectiveState.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction                 = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

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
    private readonly _groupCon!                                         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                         : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupConTaskObjectiveFilter!                      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConTaskObjectiveFilter!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnConTaskObjectiveFilter!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTaskObjectiveFilter!                      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActProgress!                                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActProgress!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActProgress!                                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActProgress!                                   : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActIsHidden!                                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActIsHidden!                           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActIsHidden!                                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActIsHidden!                                   : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActIsProgressUpdaterDisabled!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActIsProgressUpdaterDisabled!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActIsProgressUpdaterDisabled!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActIsProgressUpdaterDisabled!                  : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
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

    private _onTouchedBtnConTaskObjectiveFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConTaskObjectiveFilter(),
            expressionInfo  : WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConTaskObjectiveFilter() != text) {
                    action.setConTaskObjectiveFilter(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActProgress(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActProgress.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActProgress(),
            expressionInfo  : WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActProgress,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActProgress() != text) {
                    action.setActProgress(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsHidden(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsHidden.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsHidden(),
            expressionInfo  : WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsHidden,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsHidden() != text) {
                    action.setActIsHidden(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsProgressUpdaterDisabled(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled.getHelpText(),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsProgressUpdaterDisabled(),
            expressionInfo  : WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsProgressUpdaterDisabled() != text) {
                    action.setActIsProgressUpdaterDisabled(text);
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
        this._btnConTaskObjectiveFilter.setText(WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ConTaskObjectiveFilter.getTitleText());
        this._btnActProgress.setText(WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActProgress.getTitleText());
        this._btnActIsHidden.setText(WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsHidden.getTitleText());
        this._btnActIsProgressUpdaterDisabled.setText(WarEventsActionsConstantsSetTaskObjectiveState.ExpressionInfoDict.ActIsProgressUpdaterDisabled.getTitleText());

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

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetTaskObjectiveState.WeaSetTaskObjectiveState> {
        return this.getOpenData()?.action.getWeaSetTaskObjectiveState();
    }
}
