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
import type * as ProtoSchemaCommonProtoWarEventWeaAddTileBuffExpr from "../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffExpr.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsAddTileBuffExpr from "../../warEvents/actions/constants/AddTileBuffExpr.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction     = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

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

    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                            : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupCon!                                 : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                 : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupConTileFilter!                       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConTileFilter!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnConTileFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActBuffType!                         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActBuffType!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActBuffType!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActBuffType!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActExpiringTurnIndex!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActExpiringTurnIndex!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActExpiringTurnIndex!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActExpiringTurnIndex!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActExpiringPlayerIndex!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActExpiringPlayerIndex!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActExpiringPlayerIndex!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActExpiringPlayerIndex!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupActExtraParams!                      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyActExtraParams!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnActExtraParams!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActExtraParams!                      : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnType,                                    callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                              callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConTileFilter,                   callback: this._onTouchedGroupModifyConTileFilter },
            { ui: this._btnConTileFilter,                           callback: this._onTouchedBtnConTileFilter },

            { ui: this._groupModifyActBuffType,                     callback: this._onTouchedGroupModifyActBuffType },
            { ui: this._btnActBuffType,                             callback: this._onTouchedBtnActBuffType },

            { ui: this._groupModifyActExpiringTurnIndex,            callback: this._onTouchedGroupModifyActExpiringTurnIndex },
            { ui: this._btnActExpiringTurnIndex,                    callback: this._onTouchedBtnActExpiringTurnIndex },

            { ui: this._groupModifyActExpiringPlayerIndex,          callback: this._onTouchedGroupModifyActExpiringPlayerIndex },
            { ui: this._btnActExpiringPlayerIndex,                  callback: this._onTouchedBtnActExpiringPlayerIndex },

            { ui: this._groupModifyActExtraParams,                  callback: this._onTouchedGroupModifyActExtraParams },
            { ui: this._btnActExtraParams,                          callback: this._onTouchedBtnActExtraParams },
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
            contextType : ExpressionParsersEnums.ContextType.Tile,
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0662),
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
            expressionInfo  : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ConTileFilter,
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

    private _onTouchedBtnActBuffType(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0761),
        });
    }
    private _onTouchedGroupModifyActBuffType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActBuffType(),
            expressionInfo  : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActBuffType,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActBuffType() != text) {
                    action.setActBuffType(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActExpiringTurnIndex(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0762),
        });
    }
    private _onTouchedGroupModifyActExpiringTurnIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActExpiringTurnIndex(),
            expressionInfo  : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActExpiringTurnIndex() != text) {
                    action.setActExpiringTurnIndex(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActExpiringPlayerIndex(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0763),
        });
    }
    private _onTouchedGroupModifyActExpiringPlayerIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActExpiringPlayerIndex(),
            expressionInfo  : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActExpiringPlayerIndex() != text) {
                    action.setActExpiringPlayerIndex(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnActExtraParams(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0764),
        });
    }
    private _onTouchedGroupModifyActExtraParams(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action = this.getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : action.getActExtraParams(),
            expressionInfo  : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExtraParams,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (action.getActExtraParams() != text) {
                    action.setActExtraParams(text);
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

        this._btnConTileFilter.setLangText(LangConstants.TextType.TileFilter);
        this._btnActBuffType.setLangText(LangConstants.TextType.B0805);
        this._btnActExpiringTurnIndex.setLangText(LangConstants.TextType.EndTurnIndex);
        this._btnActExpiringPlayerIndex.setLangText(LangConstants.TextType.EndPlayerIndex);
        this._btnActExtraParams.setLangText(LangConstants.TextType.B1229);

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
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
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
            const label = this._labelActBuffType;
            label.setText(action.getActBuffType() ?? ``);
            this._groupActBuffType.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActExpiringTurnIndex;
            label.setText(action.getActExpiringTurnIndex() ?? ``);
            this._groupActExpiringTurnIndex.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActExpiringPlayerIndex;
            label.setText(action.getActExpiringPlayerIndex() ?? ``);
            this._groupActExpiringPlayerIndex.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActExtraParams;
            label.setText(action.getActExtraParams() ?? ``);
            this._groupActExtraParams.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupCon.arrangeItems();
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaAddTileBuffExpr.WeaAddTileBuffExpr> {
        return this.getOpenData()?.action.getWeaAddTileBuffExpr();
    }
}
