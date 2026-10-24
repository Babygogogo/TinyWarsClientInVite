import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoTaskObjectivesTaskObjective from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import * as TaskObjectivesUtils from "../../taskObjectives/Utils.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war: MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;

    private readonly _listTaskObjective!    : UiInterfacesIUiScrollList.IUiScrollList<DataForTaskObjectiveRenderer>;
    private readonly _labelNoTaskObjective! : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged,  callback: this._onNotifyMeTaskObjectiveFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnAdd,         callback: this._onTouchedBtnAdd },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listTaskObjective.setItemRendererClass(TaskObjectiveRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listTaskObjective.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMeTaskObjectiveFullDataChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnAdd(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const fullData              = war.getTaskObjectiveFullData() ?? new ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData();
        const taskObjectiveArray    = fullData.getTaskObjectiveArray();
        if (taskObjectiveArray.length >= GameConfigGcWar.TaskObjectives.MaxObjectivesCount) {
            FloatText2.showLang(LangConstants.TextType.A0712);
            return;
        }

        const objectiveIdSet = new Set(taskObjectiveArray.map(v => v.getObjectiveId() ?? 0));
        for (let objectiveId = 0; ; ++objectiveId) {
            if (!objectiveIdSet.has(objectiveId)) {
                taskObjectiveArray.push(ProtoSchemaCommonProtoTaskObjectivesTaskObjective.TaskObjective.fromJson({
                    objectiveId : objectiveId,
                    desc        : [],
                }));
                break;
            }
        }
        taskObjectiveArray.sort((v1, v2) => (v1.getObjectiveId() ?? 0) - (v2.getObjectiveId() ?? 0));
        war.setTaskObjectiveFullData(fullData);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged, fullData);
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0713),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForTaskObjective();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1214));
        this._labelNoTaskObjective.setText(LangUtils.getText(LangConstants.TextType.B0278));
    }
    private async _updateComponentsForTaskObjective(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const fullData              = war.getTaskObjectiveFullData();
        const customCounterNameSet  = new Set(war.getWarEventManager().getWarEventFullData()?.getCustomCounterNameArray()?.map(v => v.getName() ?? ``));
        const dataArray             : DataForTaskObjectiveRenderer[] = [];
        if (fullData) {
            for (const taskObjective of fullData.getTaskObjectiveArray()) {
                dataArray.push({
                    taskObjective           : taskObjective,
                    fullData                : fullData,
                    customCounterNameSet    : customCounterNameSet,
                    war                     : war,
                });
            }
        }

        this._labelNoTaskObjective.setIsVisible(!dataArray.length);
        await this._listTaskObjective.bindData(dataArray);
    }
}

interface DataForTaskObjectiveRenderer extends UiTypesUiListItemData.UiListItemData {
    taskObjective           : ProtoSchemaCommonProtoTaskObjectivesTaskObjective.TaskObjective;
    fullData                : ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData;
    customCounterNameSet    : Set<string>;
    war                     : MapEditorInterfaceIMeWar.IMeWar;
}
class TaskObjectiveRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTaskObjectiveRenderer> {
    private readonly _labelError!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDescTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDesc!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnDesc!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnEdit!          : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDesc,        callback: this._onTouchedBtnDesc },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
            { ui: this._btnEdit,        callback: this._onTouchedBtnEdit },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateLabelErrorAndDesc();
    }

    private _onTouchedBtnDesc(): void {
        const taskObjective = this.getOpenData()?.taskObjective;
        if (taskObjective == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0088),
            getContent : () => [
                `${LangUtils.getText(LangConstants.TextType.B1215)}:`,
                LangUtils.getJoinedShortLanguageText(taskObjective.getDesc()),
                ``,
                `${LangUtils.getText(LangConstants.TextType.B1226)}:`,
                taskObjective.getUpdaterForCurrentProgress() ?? `----`,
            ].join(`\n`),
        });
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                callback: () => {
                    const fullData = openData.fullData;
                    HelpersCollection.deleteElementFromList(fullData.getTaskObjectiveArray(), openData.taskObjective);
                    FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged, fullData);
                },
            });
        }
    }
    private _onTouchedBtnEdit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MeTaskObjectivePanel, {
                taskObjective       : openData.taskObjective,
                fullData            : openData.fullData,
                warEventFullData    : war.getWarEventManager().getWarEventFullData(),
                isReviewingMap      : false,
            });
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDesc.setText(LangUtils.getText(LangConstants.TextType.B1258));
        this._btnDelete.setText(LangUtils.getText(LangConstants.TextType.B0220));
        this._btnEdit.setText(LangUtils.getText(LangConstants.TextType.B0465));
        this._labelDescTitle.setText([
            LangUtils.getText(LangConstants.TextType.B1215),
            ``,
            LangUtils.getText(LangConstants.TextType.B1217),
            LangUtils.getText(LangConstants.TextType.B1216),
            LangUtils.getText(LangConstants.TextType.B1218),
            LangUtils.getText(LangConstants.TextType.B1219),
            LangUtils.getText(LangConstants.TextType.B1226),
        ].join(`\n`));

        this._updateLabelErrorAndDesc();
    }

    private _updateLabelErrorAndDesc(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const labelError        = this._labelError;
        const taskObjective     = openData.taskObjective;
        const errorText         = TaskObjectivesUtils.getErrorText(taskObjective, openData.customCounterNameSet);
        labelError.setText(`#${taskObjective.getObjectiveId() ?? 0} ${errorText ?? LangUtils.getText(LangConstants.TextType.B0493)}`);
        labelError.setTextColor(errorText ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);

        const updaterForCurrentProgress = taskObjective.getUpdaterForCurrentProgress() ?? `----`;
        this._labelDesc.setText([
            LangUtils.getJoinedShortLanguageText(taskObjective.getDesc(), 40),
            LangUtils.getTextForYesOrNo(taskObjective.getIsMain()),
            `${taskObjective.getMaxProgress() ?? `----`}`,
            `${taskObjective.getScoreForCompletion() ?? 0}`,
            `${taskObjective.getScoreForProgress() ?? 0}`,
            `${updaterForCurrentProgress.length <= 40 ? updaterForCurrentProgress : `${updaterForCurrentProgress.substring(0, 40)}...`}`,
        ].join(`\n`));
    }
}
