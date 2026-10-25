import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { moveElementInList, deleteElementFromList } from "../../helpers/Collection.ts";
import { getTruncatedText } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getLanguageText } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type {
    TemplateWarRule as ProtoSchemaCommonProtoWarRuleTemplateWarRule,
} from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

type TemplateWarRule    = ProtoSchemaCommonProtoWarRuleTemplateWarRule;

export interface OpenData {
    mapRawData      : MapRawData;
    templateWarRule : TemplateWarRule;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnAdd!               : IUiButton;
    private readonly _btnDeleteAll!         : IUiButton;

    private readonly _list!                 : IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MeTaskObjectiveFullDataChanged,          callback: this._onNotifyMeTaskObjectiveFullDataChanged },
            { type: TypeId.MeWarRuleTaskObjectiveIdArrayChanged,    callback: this._onNotifyMeWarRuleTaskObjectiveIdArrayChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnAdd,         callback: this._onTouchedBtnAdd },
            { ui: this._btnDeleteAll,   callback: this._onTouchedBtnDeleteAll },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(ItemRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMeTaskObjectiveFullDataChanged(): void {
        this._updateView();
    }
    private _onNotifyMeWarRuleTaskObjectiveIdArrayChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnAdd(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapRawData            = openData.mapRawData;
        const taskObjectiveFullData = mapRawData.getTaskObjectiveFullData();
        if (taskObjectiveFullData == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const templateWarRule               = openData.templateWarRule;
            const allTaskObjectiveIdSet         = new Set(taskObjectiveFullData.getTaskObjectiveArray().map(v => v.getObjectiveId() ?? 0));
            const currentTaskObjectiveIdArray   = templateWarRule.getTaskObjectiveIdArray();
            for (const taskObjectiveId of currentTaskObjectiveIdArray ?? []) {
                allTaskObjectiveIdSet.delete(taskObjectiveId);
            }
            openPanel(getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray            : [...allTaskObjectiveIdSet],
                currentNumberArray              : [],
                showNumber                      : true,
                getTitleText                    : () => getFormattedText(TextType.F0092, getText(TextType.B1214)),
                getNumberMainText               : taskObjectiveId => getTruncatedText(
                    getLanguageText({
                        textArray: taskObjectiveFullData.getTaskObjectiveArray().find(v => (v.getObjectiveId() ?? 0) === taskObjectiveId)?.getDesc()
                    }) ?? UndefinedError,
                    15
                ),
                callbackOnConfirm               : additionalTaskObjectiveIdArray => {
                    if (!currentTaskObjectiveIdArray) {
                        templateWarRule.setTaskObjectiveIdArray(additionalTaskObjectiveIdArray);
                    } else {
                        for (const taskObjectiveId of additionalTaskObjectiveIdArray) {
                            if (currentTaskObjectiveIdArray.indexOf(taskObjectiveId) < 0) {
                                currentTaskObjectiveIdArray.push(taskObjectiveId);
                            }
                        }
                    }
                    dispatch(TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
                },
            });
        }
    }
    private _onTouchedBtnDeleteAll(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0802),
            callback: () => {
                openData.templateWarRule.setTaskObjectiveIdArray([]);
                dispatch(TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B1214)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoData.setText(getText(TextType.B0278));
    }
    private async _updateListConditionAndLabelNoCondition(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapRawData            = openData.mapRawData;
        const templateWarRule       = openData.templateWarRule;
        const dataArray             : DataForItemRenderer[] = [];
        for (const taskObjectiveId of templateWarRule.getTaskObjectiveIdArray()) {
            dataArray.push({
                mapRawData          : mapRawData,
                templateWarRule     : templateWarRule,
                taskObjectiveId     : taskObjectiveId,
            });
        }

        this._labelNoData.setIsVisible(!dataArray.length);
        await this._list.bindData(dataArray);
    }
}

interface DataForItemRenderer extends UiListItemData {
    mapRawData          : MapRawData;
    taskObjectiveId     : number;
    templateWarRule     : TemplateWarRule;
}
class ItemRenderer extends UiListItemRenderer<DataForItemRenderer> {
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName!    : IUiLabel;

    private readonly _btnUp!        : IUiButton;
    private readonly _btnDown!      : IUiButton;
    private readonly _btnDelete!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnUp,          callback: this._onTouchedBtnUp },
            { ui: this._btnDown,        callback: this._onTouchedBtnDown },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnUp(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const taskObjectiveIdArray = openData.templateWarRule.getTaskObjectiveIdArray();
        if (taskObjectiveIdArray) {
            moveElementInList(taskObjectiveIdArray, openData.taskObjectiveId, -1);
            dispatch(TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
        }
    }
    private _onTouchedBtnDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const taskObjectiveIdArray = openData.templateWarRule.getTaskObjectiveIdArray();
        if (taskObjectiveIdArray) {
            moveElementInList(taskObjectiveIdArray, openData.taskObjectiveId, 1);
            dispatch(TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
        }
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const taskObjectiveIdArray = openData.templateWarRule.getTaskObjectiveIdArray();
        if (taskObjectiveIdArray) {
            deleteElementFromList(taskObjectiveIdArray, openData.taskObjectiveId);
            dispatch(TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const taskObjectiveId = openData.taskObjectiveId;
        this._labelId.setText(`#${taskObjectiveId}`);
        this._labelName.setText(getTruncatedText(
            getLanguageText({
                textArray: openData.mapRawData.getTaskObjectiveFullData()?.getTaskObjectiveArray().find(v => (v.getObjectiveId() ?? 0) === taskObjectiveId)?.getDesc()
            }) ?? UndefinedError,
            30
        ));
        this._layoutName.arrangeItems();
    }
}
