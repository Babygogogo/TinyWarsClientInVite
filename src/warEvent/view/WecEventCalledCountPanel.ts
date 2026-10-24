import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWecEventCalledCount from "../../proto/schema/CommonProto/WarEvent/WecEventCalledCount.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";
import * as WarEventsConstants from "../../warEvents/Constants.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventCondition          = ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;

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

    private readonly _btnEventId!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelEventId!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTimesInTurn!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTimesInTurn!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnTimesInTurnComparator!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTimesInTurnComparator!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTimesTotal!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTimesTotal!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnTimesTotalComparator!          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTimesTotalComparator!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnEventsCount!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelEventsCount!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnEventsCountComparator!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelEventsCountComparator!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeConditionTypeListPanel, {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray          : condition.getEventIdArray(),
            availableNumberArray        : HelpersCollection.getNonNullElements(fullData.getEventArray()?.map(v => v.getEventId()) ?? []),
            showNumber                  : true,
            getTitleText                : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0461)),
            getNumberMainText           : warEventId => HelpersText.getTruncatedText(
                LangUtils.getLanguageText({
                    textArray: fullData.getEventArray()?.find(v => v.getEventId() === warEventId)?.getEventNameArray()
                }) ?? LangConstants.UndefinedError,
                15
            ),
            callbackOnConfirm           : eventIdArray => {
                condition.setEventIdArray(eventIdArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTimesInTurn(): void {
        const condition = this._getCondition();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0790),
            minValue        : 0,
            maxValue        : WarEventsConstants.Event.MaxCallCountInPlayerTurn,
            currentValue    : condition.getTimesInTurn(),
            callback        : value => {
                condition.setTimesInTurn(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTimesInTurnComparator(): void {
        const condition = this._getCondition();
        condition.setTimesInTurnComparator(ValueAndComparatorsUtils.getNextComparatorId(condition.getTimesInTurnComparator()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnTimesTotal(): void {
        const condition = this._getCondition();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0791),
            minValue        : 0,
            maxValue        : WarEventsConstants.Event.MaxCallCountTotal,
            currentValue    : condition.getTimesTotal(),
            callback        : value => {
                condition.setTimesTotal(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTimesTotalComparator(): void {
        const condition = this._getCondition();
        condition.setTimesTotalComparator(ValueAndComparatorsUtils.getNextComparatorId(condition.getTimesTotalComparator()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnEventsCount(): void {
        const condition = this._getCondition();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0788),
            minValue        : 0,
            maxValue        : WarEventsConstants.Event.MaxEventsPerMap,
            currentValue    : condition.getEventsCount() ?? 0,
            callback        : value => {
                condition.setEventsCount(value);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnEventsCountComparator(): void {
        const condition = this._getCondition();
        condition.setEventsCountComparator(ValueAndComparatorsUtils.getNextComparatorId(condition.getEventsCountComparator()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnEventId.setLangText(LangConstants.TextType.B0462);
        this._btnTimesInTurn.setLangText(LangConstants.TextType.B0790);
        this._btnTimesInTurnComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnTimesTotal.setLangText(LangConstants.TextType.B0791);
        this._btnTimesTotalComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnEventsCount.setLangText(LangConstants.TextType.B0788);
        this._btnEventsCountComparator.setLangText(LangConstants.TextType.Comparator);

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
    private _updateLabelEventId(): void {
        const eventIdArray = this._getCondition().getEventIdArray();
        this._labelEventId.setText(eventIdArray?.length ? eventIdArray.map(v => `${v}`).join(`, `) : LangUtils.getText(LangConstants.TextType.B0776));
    }
    private _updateInputTimesInTurn(): void {
        const timesInTurn = this._getCondition().getTimesInTurn();
        this._labelTimesInTurn.setText(timesInTurn == null ? `` : `${timesInTurn}`);
    }
    private _updateLabelTimesInTurnComparator(): void {
        const comparator = HelpersMisc.getExisted(this._getCondition().getTimesInTurnComparator());
        this._labelTimesInTurnComparator.setText(LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError);
    }
    private _updateInputTimesTotal(): void {
        const timesTotal = this._getCondition().getTimesTotal();
        this._labelTimesTotal.setText(timesTotal == null ? `` : `${timesTotal}`);
    }
    private _updateLabelTimesTotalComparator(): void {
        const comparator = HelpersMisc.getExisted(this._getCondition().getTimesTotalComparator());
        this._labelTimesTotalComparator.setText(LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError);
    }
    private _updateInputEventsCount(): void {
        const eventsCount = this._getCondition().getEventsCount();
        this._labelEventsCount.setText(eventsCount == null ? `` : `${eventsCount}`);
    }
    private _updateEventsCountComparator(): void {
        const comparator = HelpersMisc.getExisted(this._getCondition().getEventsCountComparator());
        this._labelEventsCountComparator.setText(LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError);
    }

    private _getCondition(): ProtoSchemaCommonProtoWarEventWecEventCalledCount.WecEventCalledCount {
        return HelpersMisc.getExisted(this.getOpenData()?.condition.getWecEventCalledCount());
    }
}
