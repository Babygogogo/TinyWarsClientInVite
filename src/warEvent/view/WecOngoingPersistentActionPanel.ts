import {
    WarEvents_Actions_Utils_Common,
    Graphics_Constants,
    Notifications_Dispatcher,
    WarEvents_FullDatas_Utils,
    Lang_Utils,
    WarEvents_Conditions_Utils_Common,
    GamePanels_Dict,
    Helpers_Misc,
    ValueAndComparators_Utils,
    WarEvents_Actions_Constants_Common,
    GamePanels_Manager,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecOngoingPersistentActionPresence } from "../../proto/schema/CommonProto/WarEvent/WecOngoingPersistentActionPresence.ts";

export interface OpenData {
    war         : BaseWar_Interface_IBwWar.IBwWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActionId!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActionId!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActionCount!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActionCount!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActionCountComparator!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActionCountComparator!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged, callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                       callback : this.closePanel },
            { ui : this._btnType,                        callback : this._onTouchedBtnType },
            { ui : this._btnActionId,                    callback : this._onTouchedBtnActionId },
            { ui : this._btnActionCount,                 callback : this._onTouchedBtnActionCount },
            { ui : this._btnActionCountComparator,       callback : this._onTouchedBtnActionCountComparator },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeConditionTypeListPanel, {
            fullData  : openData.fullData,
            condition : openData.condition,
            war       : openData.war,
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray   : condition.getOngoingActionIdArray(),
            availableNumberArray : warEventFullData.getActionArray().filter(v => WarEvents_Actions_Utils_Common.checkIsPersistentAction(v)).map(v => Helpers_Misc.getExisted(v.getWeaCommonData()?.getActionId())),
            showNumber           : true,
            getNumberMainText    : actionId => WarEvents_Actions_Utils_Common.getBriefDescForAction(Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getAction(warEventFullData, actionId)), gameConfig) ?? Lang_Constants.UndefinedError,
            getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0889)),
            callbackOnConfirm    : actionIdArray => {
                condition.setOngoingActionIdArray(actionIdArray);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActionCount(): void {
        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0902),
            minValue     : 0,
            maxValue     : WarEvents_Actions_Constants_Common.MaxCounts.PerMap,
            currentValue : condition.getOngoingActionsCount(),
            callback     : value => {
                condition.setOngoingActionsCount(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActionCountComparator(): void {
        const condition = this._getCondition();
        condition.setOngoingActionsCountComparator(ValueAndComparators_Utils.getNextComparatorId(condition.getOngoingActionsCountComparator()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateLabelActionId();
        this._updateInputActionCount();
        this._updateLabelActionCountComparator();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnActionId.setLangText(Lang_Constants.TextType.B0889);
        this._btnActionCount.setLangText(Lang_Constants.TextType.B0902);
        this._btnActionCountComparator.setLangText(Lang_Constants.TextType.Comparator);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition     = openData.condition;
        const war           = openData.war;
        const errorTip      = WarEvents_Conditions_Utils_Common.getErrorTipForCondition(openData.fullData, condition, war);
        const labelError    = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Conditions_Utils_Common.getDetailedDescForCondition(condition, war.getGcData()) || Lang_Constants.UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelActionId(): void {
        const actionIdArray         = this._getCondition().getOngoingActionIdArray();
        this._labelActionId.setText(actionIdArray?.length ? actionIdArray.join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.B0776));
    }
    private _updateInputActionCount(): void {
        const value                     = this._getCondition().getOngoingActionsCount();
        this._labelActionCount.setText(value == null ? `` : `${value}`);
    }
    private _updateLabelActionCountComparator(): void {
        const comparator = this._getCondition().getOngoingActionsCountComparator();
        this._labelActionCountComparator.setText(Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError);
    }

    private _getCondition(): WecOngoingPersistentActionPresence {
        return Helpers_Misc.getExisted(this.getOpenData()?.condition.getWecOngoingPersistentActionPresence());
    }
}
