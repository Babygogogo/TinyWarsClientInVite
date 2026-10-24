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
import type * as ProtoSchemaCommonProtoWarEventWeaSetTileStateExpr from "../../proto/schema/CommonProto/WarEvent/WeaSetTileStateExpr.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsSetTileStateExpr from "../../warEvents/actions/constants/SetTileStateExpr.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction             = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

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

    private readonly _groupConTileFilter!                               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConTileFilter!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnConTileFilter!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActPlayerIndex!                              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActPlayerIndex!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActPlayerIndex!                              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActPlayerIndex!                                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCurrentHp!                                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentHp!                          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCurrentHp!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCurrentHp!                                  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCurrentBuildPoint!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentBuildPoint!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActCurrentBuildPoint!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCurrentBuildPoint!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActCurrentCapturePoint!                      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCurrentCapturePoint!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCurrentCapturePoint!                      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCurrentCapturePoint!                        : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActIsHighlighted!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActIsHighlighted!                      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActIsHighlighted!                            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActIsHighlighted!                              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActGroupedLocationIdArray!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActGroupedLocationIdArray!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActGroupedLocationIdArray!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActGroupedLocationIdArray!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActCustomNameId!                             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActCustomNameId!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActCustomNameId!                             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActCustomNameId!                               : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,                 callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                       callback: this.closePanel },
            { ui: this._btnType,                                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTileFilter,                       callback: this._onTouchedGroupModifyConTileFilter },
            { ui: this._btnConTileFilter,                               callback: this._onTouchedBtnConTileFilter },

            { ui: this._groupModifyActPlayerIndex,                      callback: this._onTouchedGroupModifyActPlayerIndex },
            { ui: this._btnActPlayerIndex,                              callback: this._onTouchedBtnActPlayerIndex },

            { ui: this._groupModifyActCurrentHp,                        callback: this._onTouchedGroupModifyActCurrentHp },
            { ui: this._btnActCurrentHp,                                callback: this._onTouchedBtnActCurrentHp },

            { ui: this._groupModifyActCurrentBuildPoint,                callback: this._onTouchedGroupModifyActCurrentBuildPoint },
            { ui: this._btnActCurrentBuildPoint,                        callback: this._onTouchedBtnActCurrentBuildPoint },

            { ui: this._groupModifyActCurrentCapturePoint,              callback: this._onTouchedGroupModifyActCurrentCapturePoint },
            { ui: this._btnActCurrentCapturePoint,                      callback: this._onTouchedBtnActCurrentCapturePoint },

            { ui: this._groupModifyActIsHighlighted,                    callback: this._onTouchedGroupModifyActIsHighlighted },
            { ui: this._btnActIsHighlighted,                            callback: this._onTouchedBtnActIsHighlighted },

            { ui: this._groupModifyActGroupedLocationIdArray,           callback: this._onTouchedGroupModifyActGroupedLocationIdArray },
            { ui: this._btnActGroupedLocationIdArray,                   callback: this._onTouchedBtnActGroupedLocationIdArray },

            { ui: this._groupModifyActCustomNameId,                     callback: this._onTouchedGroupModifyActCustomNameId },
            { ui: this._btnActCustomNameId,                             callback: this._onTouchedBtnActCustomNameId },
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

    private _onTouchedBtnConTileFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ConTileFilter.getHelpText(),
        });
    }
    private _onTouchedGroupModifyConTileFilter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getConTileFilter(),
            expressionInfo  : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ConTileFilter,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getConTileFilter() != text) {
                    action.setConTileFilter(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActPlayerIndex(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActPlayerIndex.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActPlayerIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActPlayerIndex(),
            expressionInfo  : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActPlayerIndex,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActPlayerIndex() != text) {
                    action.setActPlayerIndex(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentHp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentHp.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentHp(),
            expressionInfo  : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentHp,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentHp() != text) {
                    action.setActCurrentHp(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentBuildPoint(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentBuildPoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentBuildPoint(),
            expressionInfo  : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentBuildPoint() != text) {
                    action.setActCurrentBuildPoint(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCurrentCapturePoint(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCurrentCapturePoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCurrentCapturePoint(),
            expressionInfo  : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCurrentCapturePoint() != text) {
                    action.setActCurrentCapturePoint(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActIsHighlighted(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActIsHighlighted.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActIsHighlighted(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActIsHighlighted(),
            expressionInfo  : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActIsHighlighted,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActIsHighlighted() != text) {
                    action.setActIsHighlighted(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActGroupedLocationIdArray(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActGroupedLocationIdArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActGroupedLocationIdArray(),
            expressionInfo  : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActGroupedLocationIdArray() != text) {
                    action.setActGroupedLocationIdArray(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActCustomNameId(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCustomNameId.getHelpText(),
        });
    }
    private _onTouchedGroupModifyActCustomNameId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActCustomNameId(),
            expressionInfo  : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCustomNameId,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActCustomNameId() != text) {
                    action.setActCustomNameId(text);
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
        this._btnConTileFilter.setText(WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ConTileFilter.getTitleText());
        this._btnActPlayerIndex.setText(WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActPlayerIndex.getTitleText());
        this._btnActCurrentHp.setText(WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentHp.getTitleText());
        this._btnActCurrentBuildPoint.setText(WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint.getTitleText());
        this._btnActCurrentCapturePoint.setText(WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint.getTitleText());
        this._btnActIsHighlighted.setText(WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActIsHighlighted.getTitleText());
        this._btnActGroupedLocationIdArray.setText(WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray.getTitleText());
        this._btnActCustomNameId.setText(WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCustomNameId.getTitleText());

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
            const label = this._labelConTileFilter;
            label.setText(action.getConTileFilter() ?? ``);
            this._groupConTileFilter.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActPlayerIndex;
            label.setText(action.getActPlayerIndex() ?? ``);
            this._groupActPlayerIndex.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentHp;
            label.setText(action.getActCurrentHp() ?? ``);
            this._groupActCurrentHp.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentBuildPoint;
            label.setText(action.getActCurrentBuildPoint() ?? ``);
            this._groupActCurrentBuildPoint.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCurrentCapturePoint;
            label.setText(action.getActCurrentCapturePoint() ?? ``);
            this._groupActCurrentCapturePoint.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActIsHighlighted;
            label.setText(action.getActIsHighlighted() ?? ``);
            this._groupActIsHighlighted.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActGroupedLocationIdArray;
            label.setText(action.getActGroupedLocationIdArray() ?? ``);
            this._groupActGroupedLocationIdArray.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActCustomNameId;
            label.setText(action.getActCustomNameId() ?? ``);
            this._groupActCustomNameId.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetTileStateExpr.WeaSetTileStateExpr> {
        return this.getOpenData()?.action.getWeaSetTileStateExpr();
    }
}
