import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { createRange } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getComparatorName } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecManualActionStatistics } from "../../proto/schema/CommonProto/WarEvent/WecManualActionStatistics.ts";
import { TurnIndex } from "../../turns/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ComparatorId } from "../../valueAndComparators/Constants.ts";
import { tickComparator } from "../../valueAndComparators/Utils.ts";
import { getErrorTipForCondition, getDetailedDescForCondition } from "../../warEvents/conditions/utils/Common.ts";
import { Common } from "../../warOperations/Constants.ts";

export interface OpenData {
    war         : IBwWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                          : IUiImage;
    private readonly _group!                            : IUiContainer;
    private readonly _labelTitle!                       : IUiLabel;
    private readonly _btnType!                          : IUiButton;
    private readonly _btnClose!                         : IUiButton;

    private readonly _groupDesc!                        : IUiLayout;
    private readonly _labelDesc!                        : IUiLabel;
    private readonly _labelError!                       : IUiLabel;

    private readonly _btnPlayerIndex!                   : IUiButton;
    private readonly _labelPlayerIndex!                 : IUiLabel;
    private readonly _btnIsPlayerInTurn!                : IUiButton;
    private readonly _labelIsPlayerInTurn!              : IUiLabel;

    private readonly _btnRecentTurnsCount!              : IUiButton;
    private readonly _labelRecentTurnsCount!            : IUiLabel;

    private readonly _btnActionsCount!                  : IUiButton;
    private readonly _labelActionsCount!                : IUiLabel;
    private readonly _btnActionsCountComparator!        : IUiButton;
    private readonly _labelActionsCountComparator!      : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },

            { ui: this._btnPlayerIndex,                 callback: this._onTouchedBtnPlayerIndex },
            { ui: this._btnIsPlayerInTurn,              callback: this._onTouchedBtnIsPlayerInTurn },

            { ui: this._btnRecentTurnsCount,            callback: this._onTouchedBtnRecentTurnsCount },

            { ui: this._btnActionsCount,                callback: this._onTouchedBtnActionsCount },
            { ui: this._btnActionsCountComparator,      callback: this._onTouchedBtnActionsCountComparator },
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

        openPanel(getDict().WeConditionTypeListPanel, {
            fullData    : openData.fullData,
            condition   : openData.condition,
            war         : openData.war,
        });
    }
    private _onTouchedBtnPlayerIndex(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const condition = this._getCondition();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray          : condition.getPlayerIndexArray(),
            availableNumberArray        : createRange(PlayerIndex.Neutral, war.getPlayersCountUnneutral() + 1, 1),
            getTitleText                : () => getFormattedText(TextType.F0092, getText(TextType.B0031)),
            getNumberMainText           : playerIndex => `P${playerIndex}`,
            callbackOnConfirm           : playerIndexArray => {
                condition.setPlayerIndexArray(playerIndexArray);
                dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnRecentTurnsCount(): void {
        const condition = this._getCondition();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.B0930),
            minValue        : 1,
            maxValue        : TurnIndex.MaxLimit,
            currentValue    : condition.getRecentTurnsCount() ?? 0,
            callback        : value => {
                condition.setRecentTurnsCount(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActionsCount(): void {
        const condition = this._getCondition();
        const oldCon    = condition.getTotalActions();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.B0090),
            minValue        : 0,
            maxValue        : Common.MaxLimit,
            currentValue    : oldCon?.getValue() ?? 0,
            callback        : value => {
                if (oldCon) {
                    oldCon.setValue(value);
                } else {
                    condition.setTotalActions(ValueAndComparator.fromJson({
                        value       : value,
                        comparator  : ComparatorId.EqualTo,
                    }));
                }

                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActionsCountComparator(): void {
        const condition = this._getCondition();
        const oldCon    = condition.getTotalActions();
        if (oldCon) {
            tickComparator(oldCon);
        } else {
            condition.setTotalActions(ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ComparatorId.EqualTo,
            }));
        }

        dispatch(TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${getText(TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setText(getText(TextType.B0146));
        this._btnType.setText(getText(TextType.B0516));
        this._btnPlayerIndex.setText(getText(TextType.PlayerIndex));
        this._btnIsPlayerInTurn.setText(getText(TextType.B0086));
        this._btnRecentTurnsCount.setText(getText(TextType.B0930));
        this._btnActionsCount.setText(getText(TextType.B0090));
        this._btnActionsCountComparator.setText(getText(TextType.Comparator));

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDetailedDescForCondition(condition, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelPlayerIndex(): void {
        const playerIndexArray = this._getCondition().getPlayerIndexArray();
        this._labelPlayerIndex.setText(playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : getText(TextType.B0776));
    }
    private _updateLabelIsPlayerInTurn(): void {
        const isPlayerInTurn    = this._getCondition().getIsPlayerInTurn();
        const label             = this._labelIsPlayerInTurn;
        if (isPlayerInTurn == null) {
            label.setText(`--`);
        } else {
            label.setText(getText(isPlayerInTurn ? TextType.Yes : TextType.No));
        }
    }
    private _updateInputRecentTurnsCount(): void {
        const recentTurnsCount = this._getCondition().getRecentTurnsCount();
        this._labelRecentTurnsCount.setText(recentTurnsCount == null ? `` : `${recentTurnsCount}`);
    }
    private _updateInputActionsCount(): void {
        const actionsCount = this._getCondition().getTotalActions()?.getValue();
        this._labelActionsCount.setText(actionsCount == null ? UndefinedError : `${actionsCount}`);
    }
    private _updatePlayersCountComparator(): void {
        const comparator = this._getCondition().getTotalActions()?.getComparator();
        this._labelActionsCountComparator.setText(getComparatorName(comparator) ?? UndefinedError);
    }

    private _getCondition(): WecManualActionStatistics {
        return getExisted(this.getOpenData()?.condition.getWecManualActionStatistics());
    }
}
