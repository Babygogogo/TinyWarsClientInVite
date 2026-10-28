import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getTruncatedText } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getLanguageText, getComparatorName } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecEventCalledCount } from "../../proto/schema/CommonProto/WarEvent/WecEventCalledCount.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getNextComparatorId } from "../../valueAndComparators/Utils.ts";
import { getErrorTipForCondition, getDetailedDescForCondition } from "../../warEvents/conditions/utils/Common.ts";
import { Event } from "../../warEvents/Constants.ts";

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

    private readonly _btnEventId!                       : IUiButton;
    private readonly _labelEventId!                     : IUiLabel;

    private readonly _btnTimesInTurn!                   : IUiButton;
    private readonly _labelTimesInTurn!                 : IUiLabel;
    private readonly _btnTimesInTurnComparator!         : IUiButton;
    private readonly _labelTimesInTurnComparator!       : IUiLabel;

    private readonly _btnTimesTotal!                    : IUiButton;
    private readonly _labelTimesTotal!                  : IUiLabel;
    private readonly _btnTimesTotalComparator!          : IUiButton;
    private readonly _labelTimesTotalComparator!        : IUiLabel;

    private readonly _btnEventsCount!                   : IUiButton;
    private readonly _labelEventsCount!                 : IUiLabel;
    private readonly _btnEventsCountComparator!         : IUiButton;
    private readonly _labelEventsCountComparator!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },
            { ui: this._btnEventId,                     callback: this._onTouchedBtnEventId },
            { ui: this._btnTimesInTurn,                 callback: this._onTouchedBtnTimesInTurn },
            { ui: this._btnTimesInTurnComparator,       callback: this._onTouchedBtnTimesInTurnComparator },
            { ui: this._btnTimesTotal,                  callback: this._onTouchedBtnTimesTotal },
            { ui: this._btnTimesTotalComparator,        callback: this._onTouchedBtnTimesTotalComparator },
            { ui: this._btnEventsCount,                 callback: this._onTouchedBtnEventsCount },
            { ui: this._btnEventsCountComparator,       callback: this._onTouchedBtnEventsCountComparator },
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
    private _onTouchedBtnEventId(): void {
        const fullData = this.getOpenData()?.fullData;
        if (fullData == null) {
            return;
        }

        const condition = this._getCondition();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray          : condition.getEventIdArray(),
            availableNumberArray        : getNonNullElements(fullData.getEventArray()?.map(v => v.getEventId())),
            showNumber                  : true,
            getTitleText                : () => getFormattedText(TextType.F0092, getText(TextType.B0461)),
            getNumberMainText           : warEventId => getTruncatedText(
                getLanguageText({
                    textArray: fullData.getEventArray()?.find(v => v.getEventId() === warEventId)?.getEventNameArray()
                }) ?? UndefinedError,
                15
            ),
            callbackOnConfirm           : eventIdArray => {
                condition.setEventIdArray(eventIdArray);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTimesInTurn(): void {
        const condition = this._getCondition();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.B0790),
            minValue        : 0,
            maxValue        : Event.MaxCallCountInPlayerTurn,
            currentValue    : condition.getTimesInTurn(),
            callback        : value => {
                condition.setTimesInTurn(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTimesInTurnComparator(): void {
        const condition = this._getCondition();
        condition.setTimesInTurnComparator(getNextComparatorId(condition.getTimesInTurnComparator()));
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnTimesTotal(): void {
        const condition = this._getCondition();
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.B0791),
            minValue        : 0,
            maxValue        : Event.MaxCallCountTotal,
            currentValue    : condition.getTimesTotal(),
            callback        : value => {
                condition.setTimesTotal(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTimesTotalComparator(): void {
        const condition = this._getCondition();
        condition.setTimesTotalComparator(getNextComparatorId(condition.getTimesTotalComparator()));
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnEventsCount(): void {
        const condition = this._getCondition();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.B0788),
            minValue        : 0,
            maxValue        : Event.MaxEventsPerMap,
            currentValue    : condition.getEventsCount(),
            callback        : value => {
                condition.setEventsCount(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnEventsCountComparator(): void {
        const condition = this._getCondition();
        condition.setEventsCountComparator(getNextComparatorId(condition.getEventsCountComparator()));
        dispatch(TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${getText(TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(TextType.B0146);
        this._btnType.setLangText(TextType.B0516);
        this._btnEventId.setLangText(TextType.B0462);
        this._btnTimesInTurn.setLangText(TextType.B0790);
        this._btnTimesInTurnComparator.setLangText(TextType.Comparator);
        this._btnTimesTotal.setLangText(TextType.B0791);
        this._btnTimesTotalComparator.setLangText(TextType.Comparator);
        this._btnEventsCount.setLangText(TextType.B0788);
        this._btnEventsCountComparator.setLangText(TextType.Comparator);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        const condition     = openData.condition;
        const war           = openData.war;
        const errorTip      = getErrorTipForCondition(openData.fullData, condition, war);
        const labelError    = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDetailedDescForCondition(condition, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelEventId(): void {
        const eventIdArray = this._getCondition().getEventIdArray();
        this._labelEventId.setText(eventIdArray?.length ? eventIdArray.map(v => `${v}`).join(`, `) : getText(TextType.B0776));
    }
    private _updateInputTimesInTurn(): void {
        const timesInTurn = this._getCondition().getTimesInTurn();
        this._labelTimesInTurn.setText(timesInTurn == null ? `` : `${timesInTurn}`);
    }
    private _updateLabelTimesInTurnComparator(): void {
        const comparator = getExisted(this._getCondition().getTimesInTurnComparator());
        this._labelTimesInTurnComparator.setText(getComparatorName(comparator) ?? UndefinedError);
    }
    private _updateInputTimesTotal(): void {
        const timesTotal = this._getCondition().getTimesTotal();
        this._labelTimesTotal.setText(timesTotal == null ? `` : `${timesTotal}`);
    }
    private _updateLabelTimesTotalComparator(): void {
        const comparator = getExisted(this._getCondition().getTimesTotalComparator());
        this._labelTimesTotalComparator.setText(getComparatorName(comparator) ?? UndefinedError);
    }
    private _updateInputEventsCount(): void {
        const eventsCount = this._getCondition().getEventsCount();
        this._labelEventsCount.setText(eventsCount == null ? `` : `${eventsCount}`);
    }
    private _updateEventsCountComparator(): void {
        const comparator = this._getCondition().getEventsCountComparator();
        this._labelEventsCountComparator.setText(getComparatorName(comparator) ?? UndefinedError);
    }

    private _getCondition(): WecEventCalledCount {
        return getExisted(this.getOpenData()?.condition.getWecEventCalledCount());
    }
}
