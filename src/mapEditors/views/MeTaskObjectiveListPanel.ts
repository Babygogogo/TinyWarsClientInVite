import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getJoinedShortLanguageText,
    getTextForYesOrNo,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { TaskObjective } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import { TaskObjectiveFullData } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import { getErrorText } from "../../taskObjectives/Utils.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { Common } from "../../taskObjectives/Constants.ts";

export interface OpenData {
    war: IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _group!                : IUiContainer;
    private readonly _imgMask!              : IUiImage;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnAdd!               : IUiButton;
    private readonly _btnHelp!              : IUiButton;

    private readonly _listTaskObjective!    : IUiScrollList<DataForTaskObjectiveRenderer>;
    private readonly _labelNoTaskObjective! : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MeTaskObjectiveFullDataChanged,  callback: this._onNotifyMeTaskObjectiveFullDataChanged },
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
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const fullData              = war.getTaskObjectiveFullData() ?? new TaskObjectiveFullData();
        const taskObjectiveArray    = fullData.getTaskObjectiveArray();
        if (taskObjectiveArray.length >= Common.MaxObjectivesCount) {
            showLang(TextType.A0712);
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
        dispatch(TypeId.MeTaskObjectiveFullDataChanged, fullData);
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0713),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForTaskObjective();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1214);
        this._labelNoTaskObjective.setLangText(TextType.B0278);
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

interface DataForTaskObjectiveRenderer extends UiListItemData {
    taskObjective           : TaskObjective;
    fullData                : TaskObjectiveFullData;
    customCounterNameSet    : Set<string>;
    war                     : IMeWar;
}
class TaskObjectiveRenderer extends UiListItemRenderer<DataForTaskObjectiveRenderer> {
    private readonly _labelError!       : IUiLabel;
    private readonly _labelDescTitle!   : IUiLabel;
    private readonly _labelDesc!        : IUiLabel;
    private readonly _btnDesc!          : IUiButton;
    private readonly _btnDelete!        : IUiButton;
    private readonly _btnEdit!          : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDesc,        callback: this._onTouchedBtnDesc },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
            { ui: this._btnEdit,        callback: this._onTouchedBtnEdit },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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

        openPanel(getDict().CommonAlertPanel, {
            getTitle   : () => getText(TextType.B0088),
            getContent : () => [
                `${getText(TextType.B1215)}:`,
                getJoinedShortLanguageText(taskObjective.getDesc()),
                ``,
                `${getText(TextType.B1226)}:`,
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.AreYouSureYouWantToContinue),
                callback: () => {
                    const fullData = openData.fullData;
                    deleteElementFromList(fullData.getTaskObjectiveArray(), openData.taskObjective);
                    showLang(TextType.OperationSucceeded);

                    dispatch(TypeId.MeTaskObjectiveFullDataChanged, fullData);
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().MeTaskObjectivePanel, {
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
        this._btnDesc.setLangText(TextType.B1258);
        this._btnDelete.setLangText(TextType.B0220);
        this._btnEdit.setLangText(TextType.B0465);
        this._labelDescTitle.setText([
            getText(TextType.B1215),
            ``,
            getText(TextType.B1217),
            getText(TextType.B1216),
            getText(TextType.B1218),
            getText(TextType.B1219),
            getText(TextType.B1226),
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
        const errorText         = getErrorText(taskObjective, openData.customCounterNameSet);
        labelError.setText(`#${taskObjective.getObjectiveId()} ${errorText ?? getText(TextType.B0493)}`);
        labelError.setTextColor(errorText ? ColorValue.Yellow : ColorValue.Green);

        const updaterForCurrentProgress = taskObjective.getUpdaterForCurrentProgress() ?? `----`;
        this._labelDesc.setText([
            getJoinedShortLanguageText(taskObjective.getDesc(), 40),
            getTextForYesOrNo(taskObjective.getIsMain()),
            `${taskObjective.getMaxProgress() ?? `----`}`,
            `${taskObjective.getScoreForCompletion()}`,
            `${taskObjective.getScoreForProgress()}`,
            `${updaterForCurrentProgress.length <= 40 ? updaterForCurrentProgress : `${updaterForCurrentProgress.substring(0, 40)}...`}`,
        ].join(`\n`));
    }
}
