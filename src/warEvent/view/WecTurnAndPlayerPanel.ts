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
import type * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWecTurnAndPlayer from "../../proto/schema/CommonProto/WarEvent/WecTurnAndPlayer.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventCondition          = ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;

export interface OpenData {
    war         : BaseWarInterfaceIBwWar.IBwWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTurnIndex!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTurnIndex!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTurnIndexComparator!       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTurnIndexComparator!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTurnDivider!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTurnDivider!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTurnRemainder!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTurnRemainder!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTurnRemainderComparator!   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTurnRemainderComparator! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTurnPhase!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTurnPhase!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnPlayerIndex!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPlayerIndex!             : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },
            { ui: this._btnTurnIndexComparator,         callback: this._onTouchedBtnTurnIndexComparator },
            { ui: this._btnTurnRemainderComparator,     callback: this._onTouchedBtnTurnRemainderComparator },
            { ui: this._btnTurnPhase,                   callback: this._onTouchedBtnTurnPhase },
            { ui: this._btnPlayerIndex,                 callback: this._onTouchedBtnPlayerIndex },
            { ui: this._btnTurnIndex,                   callback: this._onTouchedBtnTurnIndex },
            { ui: this._btnTurnDivider,                 callback: this._onTouchedBtnTurnDivider },
            { ui: this._btnTurnRemainder,               callback: this._onTouchedBtnTurnRemainder },
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
    private _onTouchedBtnTurnIndexComparator(): void {
        const condition = this._getCondition();
        condition.setTurnIndexComparator(ValueAndComparatorsUtils.getNextComparatorId(condition.getTurnIndexComparator()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnTurnRemainderComparator(): void {
        const condition = this._getCondition();
        condition.setTurnIndexRemainderComparator(ValueAndComparatorsUtils.getNextComparatorId(condition.getTurnIndexRemainderComparator()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnTurnPhase(): void {
        const condition = this._getCondition();
        const turnPhase = condition.getTurnPhase();
        if (turnPhase === TurnsConstants.PhaseCode.WaitBeginTurn) {
            condition.setTurnPhase(TurnsConstants.PhaseCode.Main);
        } else if (turnPhase === TurnsConstants.PhaseCode.Main) {
            condition.setTurnPhase(null);
        } else {
            condition.setTurnPhase(TurnsConstants.PhaseCode.WaitBeginTurn);
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
    private _onTouchedBtnTurnIndex(): void {
        const condition = this._getCondition();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Turns),
            minValue        : 0,
            maxValue        : TurnsConstants.TurnIndex.MaxLimit,
            currentValue    : condition.getTurnIndex(),
            callback        : value => {
                condition.setTurnIndex(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTurnDivider(): void {
        const condition = this._getCondition();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0518),
            minValue        : 2,
            maxValue        : TurnsConstants.TurnIndex.MaxLimit,
            currentValue    : condition.getTurnIndexDivider(),
            callback        : value => {
                condition.setTurnIndexDivider(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTurnRemainder(): void {
        const condition = this._getCondition();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0519),
            minValue        : 0,
            maxValue        : TurnsConstants.TurnIndex.MaxLimit,
            currentValue    : condition.getTurnIndexRemainder(),
            callback        : value => {
                condition.setTurnIndexRemainder(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnTurnIndex.setLangText(LangConstants.TextType.Turns);
        this._btnTurnIndexComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnTurnDivider.setLangText(LangConstants.TextType.B0518);
        this._btnTurnRemainder.setLangText(LangConstants.TextType.B0519);
        this._btnTurnRemainderComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnTurnPhase.setLangText(LangConstants.TextType.B0782);
        this._btnPlayerIndex.setLangText(LangConstants.TextType.B0031);

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
    private _updateInputTurnIndex(): void {
        const turnIndex = this._getCondition().getTurnIndex();
        this._labelTurnIndex.setText(turnIndex == null ? `` : `${turnIndex}`);
    }
    private _updateLabelTurnIndexComparator(): void {
        const comparator = this._getCondition().getTurnIndexComparator();
        this._labelTurnIndexComparator.setText(LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError);
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
        this._labelTurnRemainderComparator.setText(LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError);
    }
    private _updateLabelTurnPhase(): void {
        const turnPhase = this._getCondition().getTurnPhase();
        this._labelTurnPhase.setText(turnPhase == null ? LangUtils.getText(LangConstants.TextType.B0776) : (LangUtils.getTurnPhaseName(turnPhase) ?? LangConstants.UndefinedError));
    }
    private _updateLabelPlayerIndex(): void {
        const playerIndexArray = this._getCondition().getPlayerIndexArray();
        this._labelPlayerIndex.setText(playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : LangUtils.getText(LangConstants.TextType.B0776));
    }

    private _getCondition(): ProtoSchemaCommonProtoWarEventWecTurnAndPlayer.WecTurnAndPlayer {
        return HelpersMisc.getExisted(this.getOpenData()?.condition.getWecTurnAndPlayer());
    }
}
