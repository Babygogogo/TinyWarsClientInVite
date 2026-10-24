import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

type TemplateWarRule    = ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;

export interface OpenData {
    mapRawData      : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
    templateWarRule : TemplateWarRule;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteAll!         : UiInterfacesIUiButton.IUiButton;

    private readonly _list!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged,          callback: this._onNotifyMeTaskObjectiveFullDataChanged },
            { type: NotificationsTypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged,    callback: this._onNotifyMeWarRuleTaskObjectiveIdArrayChanged },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const templateWarRule               = openData.templateWarRule;
            const allTaskObjectiveIdSet         = new Set(taskObjectiveFullData.getTaskObjectiveArray().map(v => v.getObjectiveId() ?? 0));
            const currentTaskObjectiveIdArray   = templateWarRule.getTaskObjectiveIdArray();
            for (const taskObjectiveId of currentTaskObjectiveIdArray ?? []) {
                allTaskObjectiveIdSet.delete(taskObjectiveId);
            }
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray            : [...allTaskObjectiveIdSet],
                currentNumberArray              : [],
                showNumber                      : true,
                getTitleText                    : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B1214)),
                getNumberMainText               : taskObjectiveId => HelpersText.getTruncatedText(
                    LangUtils.getLanguageText({
                        textArray: taskObjectiveFullData.getTaskObjectiveArray().find(v => (v.getObjectiveId() ?? 0) === taskObjectiveId)?.getDesc()
                    }) ?? LangConstants.UndefinedError,
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
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
                },
            });
        }
    }
    private _onTouchedBtnDeleteAll(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0802),
            callback: () => {
                openData.templateWarRule.setTaskObjectiveIdArray([]);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1214)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
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

interface DataForItemRenderer extends UiTypesUiListItemData.UiListItemData {
    mapRawData          : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
    taskObjectiveId     : number;
    templateWarRule     : TemplateWarRule;
}
class ItemRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForItemRenderer> {
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnUp!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDown!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnUp,          callback: this._onTouchedBtnUp },
            { ui: this._btnDown,        callback: this._onTouchedBtnDown },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            HelpersCollection.moveElementInList(taskObjectiveIdArray, openData.taskObjectiveId, -1);
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
        }
    }
    private _onTouchedBtnDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const taskObjectiveIdArray = openData.templateWarRule.getTaskObjectiveIdArray();
        if (taskObjectiveIdArray) {
            HelpersCollection.moveElementInList(taskObjectiveIdArray, openData.taskObjectiveId, 1);
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
        }
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const taskObjectiveIdArray = openData.templateWarRule.getTaskObjectiveIdArray();
        if (taskObjectiveIdArray) {
            HelpersCollection.deleteElementFromList(taskObjectiveIdArray, openData.taskObjectiveId);
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
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
        this._labelName.setText(HelpersText.getTruncatedText(
            LangUtils.getLanguageText({
                textArray: openData.mapRawData.getTaskObjectiveFullData()?.getTaskObjectiveArray().find(v => (v.getObjectiveId() ?? 0) === taskObjectiveId)?.getDesc()
            }) ?? LangConstants.UndefinedError,
            30
        ));
        this._layoutName.arrangeItems();
    }
}
