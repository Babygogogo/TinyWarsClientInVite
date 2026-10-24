import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjective from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import * as UiComponentsUiContainer from "../../ui/components/UiContainer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";

export interface OpenData {
    war     : BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTaskObjective!   : UiInterfacesIUiLayout.IUiLayout;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1214));

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
            group.addItem(createLabelForTaskObjectiveCategory(LangUtils.getText(LangConstants.TextType.B1217)), false);

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
            group.addItem(createLabelForTaskObjectiveCategory(LangUtils.getText(LangConstants.TextType.B1220)), false);

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

function createLabelForTaskObjectiveCategory(text: string): UiInterfacesIUiLabel.IUiLabel {
    const label = new (UiUtilsUiFactory.getUiLabelClass());
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
function createGroupEmpty(): UiInterfacesIUiContainer.IUiContainer {
    const label     = new (UiUtilsUiFactory.getUiLabelClass());
    label.setText(`----`);
    label.setFontSize(16);
    label.setX(30);

    const group = new (UiUtilsUiFactory.getUiContainerClass());
    group.addUiChild(label);
    return group;
}
function createSeparator(): UiInterfacesIUiImage.IUiImage {
    const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000`});
    img.setUnscaledManualWidth(560);
    img.setUnscaledManualHeight(1);
    img.setIsSmoothing(false);
    img.setIsVisible(false);
    return img;
}
function getDataArrayForTaskObjectiveRenderer(war: BaseWarInterfaceIBwWar.IBwWar, allTaskObjectiveArray: ProtoSchemaCommonProtoTaskObjectivesTaskObjective.TaskObjective[], stateArray: ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState[], isMain: boolean): DataForTaskObjectiveRenderer[] {
    const dataArray: DataForTaskObjectiveRenderer[] = [];
    for (const taskObjective of allTaskObjectiveArray.filter(v => isMain === !!v.getIsMain())) {
        const objectiveId = taskObjective.getObjectiveId() ?? 0;
        if (!stateArray.find(v => (v.getObjectiveId() ?? 0) === objectiveId)?.getIsHidden()) {
            dataArray.push({
                war             : war,
                taskObjective   : taskObjective,
            });
        }
    }
    return dataArray;
}

interface DataForTaskObjectiveRenderer {
    taskObjective   : ProtoSchemaCommonProtoTaskObjectivesTaskObjective.TaskObjective;
    war             : BaseWarInterfaceIBwWar.IBwWar;
}
class TaskObjectiveRenderer extends UiComponentsUiContainer.UiContainer {
    private readonly _groupCompleted!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCompleted!     : UiInterfacesIUiImage.IUiImage;
    private readonly _labelDesc!        : UiInterfacesIUiLabel.IUiLabel;

    private _data           : DataForTaskObjectiveRenderer | null = null;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "component/taskObjective/TaskObjective001.exml");
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
        const objectiveId       = taskObjective.getObjectiveId() ?? 0;
        const maxProgress       = taskObjective.getMaxProgress();
        const currentProgress   = data.war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) == objectiveId)?.getCurrentProgress() ?? 0;
        const labelDesc         = this._labelDesc;
        labelDesc.setText(`(${currentProgress}${maxProgress == null ? `` : ` / ${maxProgress}`}) ${LangUtils.getLanguageText({ textArray: taskObjective.getDesc() })}`);
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
