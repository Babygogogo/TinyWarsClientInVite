import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { UndefinedError, TextType } from "../../lang/Constants.ts";
import { getFormattedText, getText, getComparatorName } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecOngoingPersistentActionPresence } from "../../proto/schema/CommonProto/WarEvent/WecOngoingPersistentActionPresence.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getNextComparatorId } from "../../valueAndComparators/Utils.ts";
import { MaxCounts } from "../../warEvents/actions/constants/Common.ts";
import { checkIsPersistentAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";
import { getErrorTipForCondition, getDetailedDescForCondition } from "../../warEvents/conditions/utils/Common.ts";
import { getAction } from "../../warEvents/fullDatas/Utils.ts";

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

    private readonly _btnActionId!                      : IUiButton;
    private readonly _labelActionId!                    : IUiLabel;

    private readonly _btnActionCount!                   : IUiButton;
    private readonly _labelActionCount!                 : IUiLabel;
    private readonly _btnActionCountComparator!         : IUiButton;
    private readonly _labelActionCountComparator!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },
            { ui: this._btnActionId,                    callback: this._onTouchedBtnActionId },
            { ui: this._btnActionCount,                 callback: this._onTouchedBtnActionCount },
            { ui: this._btnActionCountComparator,       callback: this._onTouchedBtnActionCountComparator },
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
    private _onTouchedBtnActionId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = this._getCondition();
        const warEventFullData  = openData.fullData;
        const gameConfig        = openData.war.getGcData();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : condition.getOngoingActionIdArray(),
            availableNumberArray    : warEventFullData.getActionArray().filter(v => checkIsPersistentAction(v)).map(v => getExisted(v.getWeaCommonData()?.getActionId())),
            showNumber              : true,
            getNumberMainText       : actionId => getBriefDescForAction(getExisted(getAction(warEventFullData, actionId)), gameConfig) ?? UndefinedError,
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.B0889)),
            callbackOnConfirm       : actionIdArray => {
                condition.setOngoingActionIdArray(actionIdArray);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActionCount(): void {
        const condition = this._getCondition();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.B0902),
            minValue        : 0,
            maxValue        : MaxCounts.PerMap,
            currentValue    : condition.getOngoingActionsCount(),
            callback        : value => {
                condition.setOngoingActionsCount(value);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActionCountComparator(): void {
        const condition = this._getCondition();
        condition.setOngoingActionsCountComparator(getNextComparatorId(condition.getOngoingActionsCountComparator()));
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateLabelActionId();
        this._updateInputActionCount();
        this._updateLabelActionCountComparator();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(TextType.B0146);
        this._btnType.setLangText(TextType.B0516);
        this._btnActionId.setLangText(TextType.B0889);
        this._btnActionCount.setLangText(TextType.B0902);
        this._btnActionCountComparator.setLangText(TextType.Comparator);

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
    private _updateLabelActionId(): void {
        const actionIdArray         = this._getCondition().getOngoingActionIdArray();
        this._labelActionId.setText(actionIdArray?.length ? actionIdArray.join(`, `) : getText(TextType.B0776));
    }
    private _updateInputActionCount(): void {
        const value                     = this._getCondition().getOngoingActionsCount();
        this._labelActionCount.setText(value == null ? `` : `${value}`);
    }
    private _updateLabelActionCountComparator(): void {
        const comparator = this._getCondition().getOngoingActionsCountComparator();
        this._labelActionCountComparator.setText(getComparatorName(comparator) ?? UndefinedError);
    }

    private _getCondition(): WecOngoingPersistentActionPresence {
        return getExisted(this.getOpenData()?.condition.getWecOngoingPersistentActionPresence());
    }
}
