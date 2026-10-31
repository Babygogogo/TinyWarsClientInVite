import {
    Graphics_Constants,
    WarOperations_Constants,
    ValueAndComparators_Constants,
    Helpers_Collection,
    Notifications_Dispatcher,
    Lang_Utils,
    WarEvents_Conditions_Utils_Common,
    GamePanels_Dict,
    Helpers_Misc,
    GamePanels_Manager,
    Players_Constants,
    Lang_Constants,
    ValueAndComparators_Utils,
    Turns_Constants,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecManualActionStatistics } from "../../proto/schema/CommonProto/WarEvent/WecManualActionStatistics.ts";

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

    private readonly _btnPlayerIndex!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPlayerIndex!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnIsPlayerInTurn!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelIsPlayerInTurn!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnRecentTurnsCount!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelRecentTurnsCount!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnActionsCount!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActionsCount!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActionsCountComparator!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelActionsCountComparator!      : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged", callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                       callback : this.closePanel },
            { ui : this._btnType,                        callback : this._onTouchedBtnType },

            { ui : this._btnPlayerIndex,                 callback : this._onTouchedBtnPlayerIndex },
            { ui : this._btnIsPlayerInTurn,              callback : this._onTouchedBtnIsPlayerInTurn },

            { ui : this._btnRecentTurnsCount,            callback : this._onTouchedBtnRecentTurnsCount },

            { ui : this._btnActionsCount,                callback : this._onTouchedBtnActionsCount },
            { ui : this._btnActionsCountComparator,      callback : this._onTouchedBtnActionsCountComparator },
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
    private _onTouchedBtnPlayerIndex(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray   : condition.getPlayerIndexArray(),
            availableNumberArray : Helpers_Collection.createRange(Players_Constants.PlayerIndex.Neutral, war.getPlayersCountUnneutral() + 1, 1),
            getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0031)),
            getNumberMainText    : playerIndex => `P${playerIndex}`,
            callbackOnConfirm    : playerIndexArray => {
                condition.setPlayerIndexArray(playerIndexArray);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnIsPlayerInTurn(): void {
        const condition = this._getCondition();
        const isPlayerInTurn    = condition.getIsPlayerInTurn();
        if (isPlayerInTurn == null) {
            condition.setIsPlayerInTurn(true);
        } else if (isPlayerInTurn) {
            condition.setIsPlayerInTurn(false);
        } else {
            condition.setIsPlayerInTurn(null);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _onTouchedBtnRecentTurnsCount(): void {
        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0930),
            minValue     : 1,
            maxValue     : Turns_Constants.TurnIndex.MaxLimit,
            currentValue : condition.getRecentTurnsCount() ?? 0,
            callback     : value => {
                condition.setRecentTurnsCount(value);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnActionsCount(): void {
        const condition = this._getCondition();
        const oldCon    = condition.getTotalActions();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0090),
            minValue     : 0,
            maxValue     : WarOperations_Constants.Common.MaxLimit,
            currentValue : oldCon?.getValue() ?? 0,
            callback     : value => {
                if (oldCon) {
                    oldCon.setValue(value);
                } else {
                    condition.setTotalActions(ValueAndComparator.fromJson({
                        value      : value,
                        comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
                    }));
                }

                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnActionsCountComparator(): void {
        const condition = this._getCondition();
        const oldCon    = condition.getTotalActions();
        if (oldCon) {
            ValueAndComparators_Utils.tickComparator(oldCon);
        } else {
            condition.setTotalActions(ValueAndComparator.fromJson({
                value      : 0,
                comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            }));
        }

        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateLabelPlayerIndex();
        this._updateLabelIsPlayerInTurn();
        this._updateInputRecentTurnsCount();
        this._updateInputActionsCount();
        this._updatePlayersCountComparator();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnPlayerIndex.setLangText(Lang_Constants.TextType.PlayerIndex);
        this._btnIsPlayerInTurn.setLangText(Lang_Constants.TextType.B0086);
        this._btnRecentTurnsCount.setLangText(Lang_Constants.TextType.B0930);
        this._btnActionsCount.setLangText(Lang_Constants.TextType.B0090);
        this._btnActionsCountComparator.setLangText(Lang_Constants.TextType.Comparator);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = WarEvents_Conditions_Utils_Common.getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Conditions_Utils_Common.getDetailedDescForCondition(condition, war.getGcData()) || Lang_Constants.UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelPlayerIndex(): void {
        const playerIndexArray = this._getCondition().getPlayerIndexArray();
        this._labelPlayerIndex.setText(playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.B0776));
    }
    private _updateLabelIsPlayerInTurn(): void {
        const isPlayerInTurn    = this._getCondition().getIsPlayerInTurn();
        const label             = this._labelIsPlayerInTurn;
        if (isPlayerInTurn == null) {
            label.setText(`--`);
        } else {
            label.setLangText(isPlayerInTurn ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateInputRecentTurnsCount(): void {
        const recentTurnsCount = this._getCondition().getRecentTurnsCount();
        this._labelRecentTurnsCount.setText(recentTurnsCount == null ? `` : `${recentTurnsCount}`);
    }
    private _updateInputActionsCount(): void {
        const actionsCount = this._getCondition().getTotalActions()?.getValue();
        this._labelActionsCount.setText(actionsCount == null ? Lang_Constants.UndefinedError : `${actionsCount}`);
    }
    private _updatePlayersCountComparator(): void {
        const comparator = this._getCondition().getTotalActions()?.getComparator();
        this._labelActionsCountComparator.setText(Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError);
    }

    private _getCondition(): WecManualActionStatistics {
        return Helpers_Misc.getExisted(this.getOpenData()?.condition.getWecManualActionStatistics());
    }
}
