import {
    Graphics_Constants,
    Notifications_Dispatcher,
    WarEvents_Constants,
    Lang_Utils,
    WarEvents_Conditions_Utils_Common,
    GamePanels_Dict,
    Helpers_Misc,
    ValueAndComparators_Utils,
    Helpers_Collection,
    Helpers_Text,
    GamePanels_Manager,
    Lang_Constants,
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
import type { WecEventCalledCount } from "../../proto/schema/CommonProto/WarEvent/WecEventCalledCount.ts";

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

    private readonly _btnEventId!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelEventId!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTimesInTurn!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTimesInTurn!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnTimesInTurnComparator!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTimesInTurnComparator!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTimesTotal!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTimesTotal!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnTimesTotalComparator!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTimesTotalComparator!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnEventsCount!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelEventsCount!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnEventsCountComparator!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelEventsCountComparator!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged", callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                       callback : this.closePanel },
            { ui : this._btnType,                        callback : this._onTouchedBtnType },
            { ui : this._btnEventId,                     callback : this._onTouchedBtnEventId },
            { ui : this._btnTimesInTurn,                 callback : this._onTouchedBtnTimesInTurn },
            { ui : this._btnTimesInTurnComparator,       callback : this._onTouchedBtnTimesInTurnComparator },
            { ui : this._btnTimesTotal,                  callback : this._onTouchedBtnTimesTotal },
            { ui : this._btnTimesTotalComparator,        callback : this._onTouchedBtnTimesTotalComparator },
            { ui : this._btnEventsCount,                 callback : this._onTouchedBtnEventsCount },
            { ui : this._btnEventsCountComparator,       callback : this._onTouchedBtnEventsCountComparator },
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
    private _onTouchedBtnEventId(): void {
        const fullData = this.getOpenData()?.fullData;
        if (fullData == null) {
            return;
        }

        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray   : condition.getEventIdArray(),
            availableNumberArray : Helpers_Collection.getNonNullElements(fullData.getEventArray()?.map(v => v.getEventId())),
            showNumber           : true,
            getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0461)),
            getNumberMainText    : warEventId => Helpers_Text.getTruncatedText(
                Lang_Utils.getLanguageText({
                    textArray : fullData.getEventArray()?.find(v => v.getEventId() === warEventId)?.getEventNameArray(),
                }) ?? Lang_Constants.UndefinedError,
                15,
            ),
            callbackOnConfirm : eventIdArray => {
                condition.setEventIdArray(eventIdArray);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnTimesInTurn(): void {
        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0790),
            minValue     : 0,
            maxValue     : WarEvents_Constants.Event.MaxCallCountInPlayerTurn,
            currentValue : condition.getTimesInTurn(),
            callback     : value => {
                condition.setTimesInTurn(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnTimesInTurnComparator(): void {
        const condition = this._getCondition();
        condition.setTimesInTurnComparator(ValueAndComparators_Utils.getNextComparatorId(condition.getTimesInTurnComparator()));
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnTimesTotal(): void {
        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0791),
            minValue     : 0,
            maxValue     : WarEvents_Constants.Event.MaxCallCountTotal,
            currentValue : condition.getTimesTotal(),
            callback     : value => {
                condition.setTimesTotal(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnTimesTotalComparator(): void {
        const condition = this._getCondition();
        condition.setTimesTotalComparator(ValueAndComparators_Utils.getNextComparatorId(condition.getTimesTotalComparator()));
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnEventsCount(): void {
        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0788),
            minValue     : 0,
            maxValue     : WarEvents_Constants.Event.MaxEventsPerMap,
            currentValue : condition.getEventsCount(),
            callback     : value => {
                condition.setEventsCount(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnEventsCountComparator(): void {
        const condition = this._getCondition();
        condition.setEventsCountComparator(ValueAndComparators_Utils.getNextComparatorId(condition.getEventsCountComparator()));
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateLabelEventId();
        this._updateInputTimesInTurn();
        this._updateLabelTimesInTurnComparator();
        this._updateInputTimesTotal();
        this._updateLabelTimesTotalComparator();
        this._updateInputEventsCount();
        this._updateEventsCountComparator();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnEventId.setLangText(Lang_Constants.TextType.B0462);
        this._btnTimesInTurn.setLangText(Lang_Constants.TextType.B0790);
        this._btnTimesInTurnComparator.setLangText(Lang_Constants.TextType.Comparator);
        this._btnTimesTotal.setLangText(Lang_Constants.TextType.B0791);
        this._btnTimesTotalComparator.setLangText(Lang_Constants.TextType.Comparator);
        this._btnEventsCount.setLangText(Lang_Constants.TextType.B0788);
        this._btnEventsCountComparator.setLangText(Lang_Constants.TextType.Comparator);

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
    private _updateLabelEventId(): void {
        const eventIdArray = this._getCondition().getEventIdArray();
        this._labelEventId.setText(eventIdArray?.length ? eventIdArray.map(v => `${v}`).join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.B0776));
    }
    private _updateInputTimesInTurn(): void {
        const timesInTurn = this._getCondition().getTimesInTurn();
        this._labelTimesInTurn.setText(timesInTurn == null ? `` : `${timesInTurn}`);
    }
    private _updateLabelTimesInTurnComparator(): void {
        const comparator = Helpers_Misc.getExisted(this._getCondition().getTimesInTurnComparator());
        this._labelTimesInTurnComparator.setText(Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError);
    }
    private _updateInputTimesTotal(): void {
        const timesTotal = this._getCondition().getTimesTotal();
        this._labelTimesTotal.setText(timesTotal == null ? `` : `${timesTotal}`);
    }
    private _updateLabelTimesTotalComparator(): void {
        const comparator = Helpers_Misc.getExisted(this._getCondition().getTimesTotalComparator());
        this._labelTimesTotalComparator.setText(Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError);
    }
    private _updateInputEventsCount(): void {
        const eventsCount = this._getCondition().getEventsCount();
        this._labelEventsCount.setText(eventsCount == null ? `` : `${eventsCount}`);
    }
    private _updateEventsCountComparator(): void {
        const comparator = this._getCondition().getEventsCountComparator();
        this._labelEventsCountComparator.setText(Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError);
    }

    private _getCondition(): WecEventCalledCount {
        return Helpers_Misc.getExisted(this.getOpenData()?.condition.getWecEventCalledCount());
    }
}
