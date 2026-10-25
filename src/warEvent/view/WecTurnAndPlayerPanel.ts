import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { createRange } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getComparatorName, getTurnPhaseName } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type {
    WarEventCondition as ProtoSchemaCommonProtoWarEventWarEventCondition,
} from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecTurnAndPlayer } from "../../proto/schema/CommonProto/WarEvent/WecTurnAndPlayer.ts";
import { PhaseCode, TurnIndex } from "../../turns/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getNextComparatorId } from "../../valueAndComparators/Utils.ts";
import { getErrorTipForCondition, getDetailedDescForCondition } from "../../warEvents/conditions/utils/Common.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventCondition          = ProtoSchemaCommonProtoWarEventWarEventCondition;

export interface OpenData {
    war         : IBwWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnType!                      : IUiButton;
    private readonly _btnClose!                     : IUiButton;

    private readonly _groupDesc!                    : IUiLayout;
    private readonly _labelDesc!                    : IUiLabel;
    private readonly _labelError!                   : IUiLabel;

    private readonly _btnTurnIndex!                 : IUiButton;
    private readonly _labelTurnIndex!               : IUiLabel;

    private readonly _btnTurnIndexComparator!       : IUiButton;
    private readonly _labelTurnIndexComparator!     : IUiLabel;

    private readonly _btnTurnDivider!               : IUiButton;
    private readonly _labelTurnDivider!             : IUiLabel;

    private readonly _btnTurnRemainder!             : IUiButton;
    private readonly _labelTurnRemainder!           : IUiLabel;

    private readonly _btnTurnRemainderComparator!   : IUiButton;
    private readonly _labelTurnRemainderComparator! : IUiLabel;

    private readonly _btnTurnPhase!                 : IUiButton;
    private readonly _labelTurnPhase!               : IUiLabel;

    private readonly _btnPlayerIndex!               : IUiButton;
    private readonly _labelPlayerIndex!             : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
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

        openPanel(getDict().WeConditionTypeListPanel, {
            fullData    : openData.fullData,
            condition   : openData.condition,
            war         : openData.war,
        });
    }
    private _onTouchedBtnTurnIndexComparator(): void {
        const condition = this._getCondition();
        condition.setTurnIndexComparator(getNextComparatorId(condition.getTurnIndexComparator()));
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnTurnRemainderComparator(): void {
        const condition = this._getCondition();
        condition.setTurnIndexRemainderComparator(getNextComparatorId(condition.getTurnIndexRemainderComparator()));
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnTurnPhase(): void {
        const condition = this._getCondition();
        const turnPhase = condition.getTurnPhase();
        if (turnPhase === PhaseCode.WaitBeginTurn) {
            condition.setTurnPhase(PhaseCode.Main);
        } else if (turnPhase === PhaseCode.Main) {
            condition.setTurnPhase(null);
        } else {
            condition.setTurnPhase(PhaseCode.WaitBeginTurn);
        }
        dispatch(TypeId.WarEventFullDataChanged);
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
    private _onTouchedBtnTurnIndex(): void {
        const condition = this._getCondition();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.Turns),
            minValue        : 0,
            maxValue        : TurnIndex.MaxLimit,
            currentValue    : condition.getTurnIndex(),
            callback        : value => {
                condition.setTurnIndex(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTurnDivider(): void {
        const condition = this._getCondition();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0518),
            minValue        : 2,
            maxValue        : TurnIndex.MaxLimit,
            currentValue    : condition.getTurnIndexDivider(),
            callback        : value => {
                condition.setTurnIndexDivider(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTurnRemainder(): void {
        const condition = this._getCondition();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0519),
            minValue        : 0,
            maxValue        : TurnIndex.MaxLimit,
            currentValue    : condition.getTurnIndexRemainder(),
            callback        : value => {
                condition.setTurnIndexRemainder(value);
                dispatch(TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${getText(TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(TextType.B0146);
        this._btnType.setLangText(TextType.B0516);
        this._btnTurnIndex.setLangText(TextType.Turns);
        this._btnTurnIndexComparator.setLangText(TextType.Comparator);
        this._btnTurnDivider.setLangText(TextType.B0518);
        this._btnTurnRemainder.setLangText(TextType.B0519);
        this._btnTurnRemainderComparator.setLangText(TextType.Comparator);
        this._btnTurnPhase.setLangText(TextType.B0782);
        this._btnPlayerIndex.setLangText(TextType.B0031);

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
    private _updateInputTurnIndex(): void {
        const turnIndex = this._getCondition().getTurnIndex();
        this._labelTurnIndex.setText(turnIndex == null ? `` : `${turnIndex}`);
    }
    private _updateLabelTurnIndexComparator(): void {
        const comparator = this._getCondition().getTurnIndexComparator();
        this._labelTurnIndexComparator.setText(getComparatorName(comparator) ?? UndefinedError);
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
        this._labelTurnRemainderComparator.setText(getComparatorName(comparator) ?? UndefinedError);
    }
    private _updateLabelTurnPhase(): void {
        const turnPhase = this._getCondition().getTurnPhase();
        this._labelTurnPhase.setText(turnPhase == null ? getText(TextType.B0776) : (getTurnPhaseName(turnPhase) ?? UndefinedError));
    }
    private _updateLabelPlayerIndex(): void {
        const playerIndexArray = this._getCondition().getPlayerIndexArray();
        this._labelPlayerIndex.setText(playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : getText(TextType.B0776));
    }

    private _getCondition(): WecTurnAndPlayer {
        return getExisted(this.getOpenData()?.condition.getWecTurnAndPlayer());
    }
}
