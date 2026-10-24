import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWecOngoingPersistentActionPresence from "../../proto/schema/CommonProto/WarEvent/WecOngoingPersistentActionPresence.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as WarEventsActionsConstantsCommon from "../../warEvents/actions/constants/Common.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";
import * as WarEventsFullDatasUtils from "../../warEvents/fullDatas/Utils.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventCondition  = ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;

export interface OpenData {
    war         : BaseWarInterfaceIBwWar.IBwWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                         : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActionId!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActionId!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActionCount!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActionCount!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActionCountComparator!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActionCountComparator!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },
            { ui: this._btnActionId,                    callback: this._onTouchedBtnActionId },
            { ui: this._btnActionCount,                 callback: this._onTouchedBtnActionCount },
            { ui: this._btnActionCountComparator,       callback: this._onTouchedBtnActionCountComparator },
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
    private _onTouchedBtnActionId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = this._getCondition();
        const warEventFullData  = openData.fullData;
        const gameConfig        = openData.war.getGcData();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : condition.getOngoingActionIdArray(),
            availableNumberArray    : warEventFullData.getActionArray().filter(v => WarEventsActionsUtilsCommon.checkIsPersistentAction(v)).map(v => HelpersMisc.getExisted(v.getWeaCommonData()?.getActionId())) ?? [],
            showNumber              : true,
            getNumberMainText       : actionId => WarEventsActionsUtilsCommon.getBriefDescForAction(HelpersMisc.getExisted(WarEventsFullDatasUtils.getAction(warEventFullData, actionId)), gameConfig) ?? LangConstants.UndefinedError,
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0889)),
            callbackOnConfirm       : actionIdArray => {
                condition.setOngoingActionIdArray(actionIdArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActionCount(): void {
        const condition = this._getCondition();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0902),
            minValue        : 0,
            maxValue        : WarEventsActionsConstantsCommon.MaxCounts.PerMap,
            currentValue    : condition.getOngoingActionsCount() ?? 0,
            callback        : value => {
                condition.setOngoingActionsCount(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActionCountComparator(): void {
        const condition = this._getCondition();
        condition.setOngoingActionsCountComparator(ValueAndComparatorsUtils.getNextComparatorId(condition.getOngoingActionsCountComparator()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateLabelActionId();
        this._updateInputActionCount();
        this._updateLabelActionCountComparator();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnActionId.setLangText(LangConstants.TextType.B0889);
        this._btnActionCount.setLangText(LangConstants.TextType.B0902);
        this._btnActionCountComparator.setLangText(LangConstants.TextType.Comparator);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition     = openData.condition;
        const war           = openData.war;
        const errorTip      = WarEventsConditionsUtilsCommon.getErrorTipForCondition(openData.fullData, condition, war);
        const labelError    = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsConditionsUtilsCommon.getDetailedDescForCondition(condition, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelActionId(): void {
        const actionIdArray         = this._getCondition().getOngoingActionIdArray();
        this._labelActionId.setText(actionIdArray?.length ? actionIdArray.join(`, `) : LangUtils.getText(LangConstants.TextType.B0776));
    }
    private _updateInputActionCount(): void {
        const value                     = this._getCondition().getOngoingActionsCount();
        this._labelActionCount.setText(value == null ? `` : `${value}`);
    }
    private _updateLabelActionCountComparator(): void {
        const comparator = HelpersMisc.getExisted(this._getCondition().getOngoingActionsCountComparator());
        this._labelActionCountComparator.setText(LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError);
    }

    private _getCondition(): ProtoSchemaCommonProtoWarEventWecOngoingPersistentActionPresence.WecOngoingPersistentActionPresence {
        return HelpersMisc.getExisted(this.getOpenData()?.condition.getWecOngoingPersistentActionPresence());
    }
}
