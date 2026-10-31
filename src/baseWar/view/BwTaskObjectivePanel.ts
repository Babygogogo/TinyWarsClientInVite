import {
    Lang_Utils,
    Lang_Constants,
    Ui_Components_UiContainer,
    Ui_Components_UiImage,
    Ui_Components_UiLabel,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    Ui_Utils_UiSkinHelpers,
} from "../../internal.ts";
import type { TaskObjective } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type { TaskObjectiveState } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";

export interface OpenData {
    war     : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTaskObjective!   : Ui_Interfaces_IUiLayout.IUiLayout;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,   callback : this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateGroupTaskObjective();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1214);

        this._updateGroupTaskObjective();
    }

    private _updateGroupTaskObjective(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const group = this._groupTaskObjective;
        group.removeAllItems(false);

        const allTaskObjectiveArray = war.getInstanceWarRule().getTaskObjectiveFullData()?.getTaskObjectiveArray() ?? [];
        const stateArray            = war.getTaskObjectiveManager().getStateArray();
        {
            group.addItem(createLabelForTaskObjectiveCategory(Lang_Utils.getText(Lang_Constants.TextType.B1217)), false);

            const dataArray = getDataArrayForTaskObjectiveRenderer(war, allTaskObjectiveArray, stateArray, true);
            for (const data of dataArray) {
                group.addItem(createTaskObjectiveRenderer(data), false);
            }
            if (!dataArray.length) {
                group.addItem(createGroupEmpty(), false);
            }
        }

        group.addItem(createSeparator(), false);

        {
            group.addItem(createLabelForTaskObjectiveCategory(Lang_Utils.getText(Lang_Constants.TextType.B1220)), false);

            const dataArray = getDataArrayForTaskObjectiveRenderer(war, allTaskObjectiveArray, stateArray, false);
            for (const data of dataArray) {
                group.addItem(createTaskObjectiveRenderer(data), false);
            }
            if (!dataArray.length) {
                group.addItem(createGroupEmpty(), false);
            }
        }

        group.arrangeItems();
    }
}

function createLabelForTaskObjectiveCategory(text: string): Ui_Interfaces_IUiLabel.IUiLabel {
    const label = new Ui_Components_UiLabel.UiLabel();
    label.setText(text);
    label.setIsBold(true);
    label.setFontSize(12);
    label.setTextColor(0xC9D3DF);
    return label;
}
function createTaskObjectiveRenderer(data: DataForTaskObjectiveRenderer): TaskObjectiveRenderer {
    const renderer = new TaskObjectiveRenderer();
    renderer.setData(data);
    return renderer;
}
function createGroupEmpty(): Ui_Interfaces_IUiContainer.IUiContainer {
    const label     = new Ui_Components_UiLabel.UiLabel();
    label.setText(`----`);
    label.setFontSize(16);
    label.setX(30);

    const group = new Ui_Components_UiContainer.UiContainer();
    group.addUiChild(label);
    return group;
}
function createSeparator(): Ui_Interfaces_IUiImage.IUiImage {
    const img = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedColorWhite0000` });
    img.setUnscaledManualWidth(560);
    img.setUnscaledManualHeight(1);
    img.setIsSmoothing(false);
    img.setIsVisible(false);
    return img;
}
function getDataArrayForTaskObjectiveRenderer(war: BaseWar_Interface_IBwWar.IBwWar, allTaskObjectiveArray: TaskObjective[], stateArray: TaskObjectiveState[], isMain: boolean): DataForTaskObjectiveRenderer[] {
    const dataArray: DataForTaskObjectiveRenderer[] = [];
    for (const taskObjective of allTaskObjectiveArray.filter(v => isMain === !!v.getIsMain())) {
        const objectiveId = taskObjective.getObjectiveId();
        if (!stateArray.find(v => (v.getObjectiveId()) === objectiveId)?.getIsHidden()) {
            dataArray.push({
                war           : war,
                taskObjective : taskObjective,
            });
        }
    }
    return dataArray;
}

interface DataForTaskObjectiveRenderer {
    taskObjective   : TaskObjective;
    war             : BaseWar_Interface_IBwWar.IBwWar;
}
class TaskObjectiveRenderer extends Ui_Components_UiContainer.UiContainer {
    private readonly _groupCompleted!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCompleted!     : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelDesc!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private _data           : DataForTaskObjectiveRenderer | null = null;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "component/taskObjective/TaskObjective001.exml");
    }

    public updateOnLoadedSkin(): void {
        this._updateView();
    }

    public setData(data: DataForTaskObjectiveRenderer): void {
        this._data = data;
        this._updateView();
    }
    public getData(): DataForTaskObjectiveRenderer | null {
        return this._data;
    }

    private _updateView(): void {
        const data = this.getData();
        if (data == null) {
            this.setIsVisible(false);
            return;
        } else {
            this.setIsVisible(true);
        }

        const taskObjective     = data.taskObjective;
        const objectiveId       = taskObjective.getObjectiveId();
        const maxProgress       = taskObjective.getMaxProgress();
        const currentProgress   = data.war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId()) == objectiveId)?.getCurrentProgress() ?? 0;
        const labelDesc         = this._labelDesc;
        labelDesc.setText(`(${currentProgress}${maxProgress == null ? `` : ` / ${maxProgress}`}) ${Lang_Utils.getLanguageText({ textArray : taskObjective.getDesc() })}`);
        this.setUnscaledManualHeight(labelDesc.getScaledHeight());

        const groupCompleted = this._groupCompleted;
        if (maxProgress == null) {
            groupCompleted.setIsVisible(false);
        } else {
            groupCompleted.setIsVisible(true);
            this._imgCompleted.setIsVisible(currentProgress >= maxProgress);
        }
    }
}
