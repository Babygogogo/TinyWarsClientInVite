import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWecManualActionStatistics from "../../proto/schema/CommonProto/WarEvent/WecManualActionStatistics.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";
import * as WarOperationsConstants from "../../warOperations/Constants.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventCondition              = ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;

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

    private readonly _btnPlayerIndex!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPlayerIndex!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnIsPlayerInTurn!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelIsPlayerInTurn!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnRecentTurnsCount!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelRecentTurnsCount!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActionsCount!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActionsCount!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActionsCountComparator!        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActionsCountComparator!      : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeConditionTypeListPanel, {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray          : condition.getPlayerIndexArray(),
            availableNumberArray        : HelpersCollection.createRange(PlayersConstants.PlayerIndex.Neutral, war.getPlayersCountUnneutral() + 1, 1),
            getTitleText                : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0031)),
            getNumberMainText           : playerIndex => `P${playerIndex}`,
            callbackOnConfirm           : playerIndexArray => {
                condition.setPlayerIndexArray(playerIndexArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnRecentTurnsCount(): void {
        const condition = this._getCondition();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0930),
            minValue        : 1,
            maxValue        : TurnsConstants.TurnIndex.MaxLimit,
            currentValue    : condition.getRecentTurnsCount() ?? 0,
            callback        : value => {
                condition.setRecentTurnsCount(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActionsCount(): void {
        const condition = this._getCondition();
        const oldCon    = condition.getTotalActions();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0090),
            minValue        : 0,
            maxValue        : WarOperationsConstants.Common.MaxLimit,
            currentValue    : oldCon?.getValue() ?? 0,
            callback        : value => {
                if (oldCon) {
                    oldCon.setValue(value);
                } else {
                    condition.setTotalActions(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                        value       : value,
                        comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
                    }));
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActionsCountComparator(): void {
        const condition = this._getCondition();
        const oldCon    = condition.getTotalActions();
        if (oldCon) {
            ValueAndComparatorsUtils.tickComparator(oldCon);
        } else {
            condition.setTotalActions(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            }));
        }

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._btnType.setText(LangUtils.getText(LangConstants.TextType.B0516));
        this._btnPlayerIndex.setText(LangUtils.getText(LangConstants.TextType.PlayerIndex));
        this._btnIsPlayerInTurn.setText(LangUtils.getText(LangConstants.TextType.B0086));
        this._btnRecentTurnsCount.setText(LangUtils.getText(LangConstants.TextType.B0930));
        this._btnActionsCount.setText(LangUtils.getText(LangConstants.TextType.B0090));
        this._btnActionsCountComparator.setText(LangUtils.getText(LangConstants.TextType.Comparator));

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
        this._labelDesc.setText(WarEventsConditionsUtilsCommon.getDetailedDescForCondition(condition, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelPlayerIndex(): void {
        const playerIndexArray = this._getCondition().getPlayerIndexArray();
        this._labelPlayerIndex.setText(playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : LangUtils.getText(LangConstants.TextType.B0776));
    }
    private _updateLabelIsPlayerInTurn(): void {
        const isPlayerInTurn    = this._getCondition().getIsPlayerInTurn();
        const label             = this._labelIsPlayerInTurn;
        if (isPlayerInTurn == null) {
            label.setText(`--`);
        } else {
            label.setText(LangUtils.getText(isPlayerInTurn ? LangConstants.TextType.Yes : LangConstants.TextType.No));
        }
    }
    private _updateInputRecentTurnsCount(): void {
        const recentTurnsCount = this._getCondition().getRecentTurnsCount();
        this._labelRecentTurnsCount.setText(recentTurnsCount == null ? `` : `${recentTurnsCount}`);
    }
    private _updateInputActionsCount(): void {
        const actionsCount = this._getCondition().getTotalActions()?.getValue();
        this._labelActionsCount.setText(actionsCount == null ? LangConstants.UndefinedError : `${actionsCount}`);
    }
    private _updatePlayersCountComparator(): void {
        const comparator = this._getCondition().getTotalActions()?.getComparator();
        this._labelActionsCountComparator.setText(LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError);
    }

    private _getCondition(): ProtoSchemaCommonProtoWarEventWecManualActionStatistics.WecManualActionStatistics {
        return HelpersMisc.getExisted(this.getOpenData()?.condition.getWecManualActionStatistics());
    }
}
