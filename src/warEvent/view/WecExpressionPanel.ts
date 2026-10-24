import * as ExpressionParsersEnums from "../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../expressionParsers/Types.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWecExpression from "../../proto/schema/CommonProto/WarEvent/WecExpression.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventCondition  = ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;

const ExpressionInfo: ExpressionParsersTypes.EpExpressionInfo = {
    contextType     : ExpressionParsersEnums.ContextType.War,
    resultTypes     : [ExpressionParsersEnums.ResultType.Number],
    isRequired      : true,
    getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0129),
    getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0941),
};

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
/** WecPlayerIndexInTurnEqualTo */
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnIdentifier!                : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrContent!                   : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _layoutContent!                : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupConExpression!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModifyConExpression!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelConExpression!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConExpression!             : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },
            { ui: this._btnIdentifier,                  callback: this._onTouchedBtnIdentifier },

            { ui: this._groupModifyConExpression,       callback: this._onTouchedGroupModifyConExpression },
            { ui: this._btnConExpression,               callback: this._onTouchedBtnConExpression },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeConditionTypeListPanel, {
            fullData    : openData.fullData,
            condition   : openData.condition,
            war         : openData.war,
        });
    }
    private _onTouchedBtnIdentifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonApiPanel, {
            contextType : ExpressionParsersEnums.ContextType.War,
        });
    }

    private _onTouchedBtnConExpression(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0941),
        });
    }
    private _onTouchedGroupModifyConExpression(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition = this._getCondition();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputExpressionPanel, {
            currentValue    : condition.getExpression(),
            expressionInfo  : ExpressionInfo,
            fullData        : HelpersMisc.getExisted(openData.fullData),
            isReviewingMap  : openData.war.getIsReviewingMap(),
            callback        : text => {
                if (condition.getExpression() != text) {
                    condition.setExpression(text);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputExpression();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnIdentifier.setLangText(LangConstants.TextType.B0131);
        this._btnConExpression.setLangText(LangConstants.TextType.B0129);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = WarEventsConditionsUtilsCommon.getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsConditionsUtilsCommon.getBriefDescForCondition(condition, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateInputExpression(): void {
        const condition = this._getCondition();

        {
            const label = this._labelConExpression;
            label.setText(condition.getExpression() ?? ``);
            this._groupConExpression.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const scrContent    = this._scrContent;
        const layoutContent = this._layoutContent;
        layoutContent.arrangeItems();
        scrContent.updateOnItemsChanged();
        scrContent.setUnscaledManualHeight(Math.min(140, layoutContent.getScaledHeight()));
    }

    private _getCondition(): ProtoSchemaCommonProtoWarEventWecExpression.WecExpression {
        return HelpersMisc.getExisted(this.getOpenData()?.condition.getWecExpression());
    }
}
