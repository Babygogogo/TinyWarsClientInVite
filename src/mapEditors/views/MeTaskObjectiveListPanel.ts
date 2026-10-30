import {
    Graphics_Constants,
    TaskObjectives_Constants,
    Helpers_Collection,
    Notifications_Dispatcher,
    GamePanels_Dict,
    TaskObjectives_Utils,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import { TaskObjective } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import { TaskObjectiveFullData } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";

export interface OpenData {
    war: MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listTaskObjective!    : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTaskObjectiveRenderer>;
    private readonly _labelNoTaskObjective! : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged,  callback: this._onNotifyMeTaskObjectiveFullDataChanged },
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const fullData              = war.getTaskObjectiveFullData() ?? new TaskObjectiveFullData();
        const taskObjectiveArray    = fullData.getTaskObjectiveArray();
        if (taskObjectiveArray.length >= TaskObjectives_Constants.Common.MaxObjectivesCount) {
            FloatText.showLang(Lang_Constants.TextType.A0712);
            return;
        }

        const objectiveIdSet = new Set(taskObjectiveArray.map(v => v.getObjectiveId()));
        for (let objectiveId = 0; ; ++objectiveId) {
            if (!objectiveIdSet.has(objectiveId)) {
                taskObjectiveArray.push(TaskObjective.fromJson({
                    objectiveId : objectiveId,
                    desc        : [],
                }));
                break;
            }
        }
        taskObjectiveArray.sort((v1, v2) => (v1.getObjectiveId()) - (v2.getObjectiveId()));
        war.setTaskObjectiveFullData(fullData);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged, fullData);
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0713),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForTaskObjective();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1214);
        this._labelNoTaskObjective.setLangText(Lang_Constants.TextType.B0278);
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

interface DataForTaskObjectiveRenderer extends Ui_Types_UiListItemData.UiListItemData {
    taskObjective           : TaskObjective;
    fullData                : TaskObjectiveFullData;
    customCounterNameSet    : Set<string>;
    war                     : MapEditor_Interface_IMeWar.IMeWar;
}
class TaskObjectiveRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTaskObjectiveRenderer> {
    private readonly _labelError!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDescTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDesc!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnDesc!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnEdit!          : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDesc,        callback: this._onTouchedBtnDesc },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
            { ui: this._btnEdit,        callback: this._onTouchedBtnEdit },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
            getContent : () => [
                `${Lang_Utils.getText(Lang_Constants.TextType.B1215)}:`,
                Lang_Utils.getJoinedShortLanguageText(taskObjective.getDesc()),
                ``,
                `${Lang_Utils.getText(Lang_Constants.TextType.B1226)}:`,
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                callback: () => {
                    const fullData = openData.fullData;
                    Helpers_Collection.deleteElementFromList(fullData.getTaskObjectiveArray(), openData.taskObjective);
                    FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged, fullData);
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeTaskObjectivePanel, {
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
        this._btnDesc.setLangText(Lang_Constants.TextType.B1258);
        this._btnDelete.setLangText(Lang_Constants.TextType.B0220);
        this._btnEdit.setLangText(Lang_Constants.TextType.B0465);
        this._labelDescTitle.setText([
            Lang_Utils.getText(Lang_Constants.TextType.B1215),
            ``,
            Lang_Utils.getText(Lang_Constants.TextType.B1217),
            Lang_Utils.getText(Lang_Constants.TextType.B1216),
            Lang_Utils.getText(Lang_Constants.TextType.B1218),
            Lang_Utils.getText(Lang_Constants.TextType.B1219),
            Lang_Utils.getText(Lang_Constants.TextType.B1226),
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
        const errorText         = TaskObjectives_Utils.getErrorText(taskObjective, openData.customCounterNameSet);
        labelError.setText(`#${taskObjective.getObjectiveId()} ${errorText ?? Lang_Utils.getText(Lang_Constants.TextType.B0493)}`);
        labelError.setTextColor(errorText ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);

        const updaterForCurrentProgress = taskObjective.getUpdaterForCurrentProgress() ?? `----`;
        this._labelDesc.setText([
            Lang_Utils.getJoinedShortLanguageText(taskObjective.getDesc(), 40),
            Lang_Utils.getTextForYesOrNo(taskObjective.getIsMain()),
            `${taskObjective.getMaxProgress() ?? `----`}`,
            `${taskObjective.getScoreForCompletion()}`,
            `${taskObjective.getScoreForProgress()}`,
            `${updaterForCurrentProgress.length <= 40 ? updaterForCurrentProgress : `${updaterForCurrentProgress.substring(0, 40)}...`}`,
        ].join(`\n`));
    }
}
