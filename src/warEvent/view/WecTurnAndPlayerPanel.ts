import {
    Graphics_Constants,
    Helpers_Collection,
    Notifications_Dispatcher,
    Lang_Utils,
    WarEvents_Conditions_Utils_Common,
    GamePanels_Dict,
    Helpers_Misc,
    ValueAndComparators_Utils,
    GamePanels_Manager,
    Turns_Constants,
    Players_Constants,
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
import type { WecTurnAndPlayer } from "../../proto/schema/CommonProto/WarEvent/WecTurnAndPlayer.ts";

export interface OpenData {
    war         : BaseWar_Interface_IBwWar.IBwWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTurnIndex!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTurnIndex!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTurnIndexComparator!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTurnIndexComparator!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTurnDivider!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTurnDivider!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTurnRemainder!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTurnRemainder!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTurnRemainderComparator!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTurnRemainderComparator! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTurnPhase!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTurnPhase!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnPlayerIndex!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPlayerIndex!             : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged, callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                       callback : this.closePanel },
            { ui : this._btnType,                        callback : this._onTouchedBtnType },
            { ui : this._btnTurnIndexComparator,         callback : this._onTouchedBtnTurnIndexComparator },
            { ui : this._btnTurnRemainderComparator,     callback : this._onTouchedBtnTurnRemainderComparator },
            { ui : this._btnTurnPhase,                   callback : this._onTouchedBtnTurnPhase },
            { ui : this._btnPlayerIndex,                 callback : this._onTouchedBtnPlayerIndex },
            { ui : this._btnTurnIndex,                   callback : this._onTouchedBtnTurnIndex },
            { ui : this._btnTurnDivider,                 callback : this._onTouchedBtnTurnDivider },
            { ui : this._btnTurnRemainder,               callback : this._onTouchedBtnTurnRemainder },
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
    private _onTouchedBtnTurnIndexComparator(): void {
        const condition = this._getCondition();
        condition.setTurnIndexComparator(ValueAndComparators_Utils.getNextComparatorId(condition.getTurnIndexComparator()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnTurnRemainderComparator(): void {
        const condition = this._getCondition();
        condition.setTurnIndexRemainderComparator(ValueAndComparators_Utils.getNextComparatorId(condition.getTurnIndexRemainderComparator()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnTurnPhase(): void {
        const condition = this._getCondition();
        const turnPhase = condition.getTurnPhase();
        if (turnPhase === Turns_Constants.PhaseCode.WaitBeginTurn) {
            condition.setTurnPhase(Turns_Constants.PhaseCode.Main);
        } else if (turnPhase === Turns_Constants.PhaseCode.Main) {
            condition.setTurnPhase(null);
        } else {
            condition.setTurnPhase(Turns_Constants.PhaseCode.WaitBeginTurn);
        }
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTurnIndex(): void {
        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.Turns),
            minValue     : 0,
            maxValue     : Turns_Constants.TurnIndex.MaxLimit,
            currentValue : condition.getTurnIndex(),
            callback     : value => {
                condition.setTurnIndex(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTurnDivider(): void {
        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0518),
            minValue     : 2,
            maxValue     : Turns_Constants.TurnIndex.MaxLimit,
            currentValue : condition.getTurnIndexDivider(),
            callback     : value => {
                condition.setTurnIndexDivider(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTurnRemainder(): void {
        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0519),
            minValue     : 0,
            maxValue     : Turns_Constants.TurnIndex.MaxLimit,
            currentValue : condition.getTurnIndexRemainder(),
            callback     : value => {
                condition.setTurnIndexRemainder(value);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateInputTurnIndex();
        this._updateLabelTurnIndexComparator();
        this._updateInputTurnDivider();
        this._updateInputTurnRemainder();
        this._updateLabelTurnRemainderComparator();
        this._updateLabelTurnPhase();
        this._updateLabelPlayerIndex();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnTurnIndex.setLangText(Lang_Constants.TextType.Turns);
        this._btnTurnIndexComparator.setLangText(Lang_Constants.TextType.Comparator);
        this._btnTurnDivider.setLangText(Lang_Constants.TextType.B0518);
        this._btnTurnRemainder.setLangText(Lang_Constants.TextType.B0519);
        this._btnTurnRemainderComparator.setLangText(Lang_Constants.TextType.Comparator);
        this._btnTurnPhase.setLangText(Lang_Constants.TextType.B0782);
        this._btnPlayerIndex.setLangText(Lang_Constants.TextType.B0031);

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
    private _updateInputTurnIndex(): void {
        const turnIndex = this._getCondition().getTurnIndex();
        this._labelTurnIndex.setText(turnIndex == null ? `` : `${turnIndex}`);
    }
    private _updateLabelTurnIndexComparator(): void {
        const comparator = this._getCondition().getTurnIndexComparator();
        this._labelTurnIndexComparator.setText(Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError);
    }
    private _updateInputTurnDivider(): void {
        const turnDivider = this._getCondition().getTurnIndexDivider();
        this._labelTurnDivider.setText(turnDivider == null ? `` : `${turnDivider}`);
    }
    private _updateInputTurnRemainder(): void {
        const turnRemainder = this._getCondition().getTurnIndexRemainder();
        this._labelTurnRemainder.setText(turnRemainder == null ? `` : `${turnRemainder}`);
    }
    private _updateLabelTurnRemainderComparator(): void {
        const comparator = this._getCondition().getTurnIndexRemainderComparator();
        this._labelTurnRemainderComparator.setText(Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError);
    }
    private _updateLabelTurnPhase(): void {
        const turnPhase = this._getCondition().getTurnPhase();
        this._labelTurnPhase.setText(turnPhase == null ? Lang_Utils.getText(Lang_Constants.TextType.B0776) : (Lang_Utils.getTurnPhaseName(turnPhase) ?? Lang_Constants.UndefinedError));
    }
    private _updateLabelPlayerIndex(): void {
        const playerIndexArray = this._getCondition().getPlayerIndexArray();
        this._labelPlayerIndex.setText(playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.B0776));
    }

    private _getCondition(): WecTurnAndPlayer {
        return Helpers_Misc.getExisted(this.getOpenData()?.condition.getWecTurnAndPlayer());
    }
}
