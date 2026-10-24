import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as WarEventsActionsConstantsCommon from "../../warEvents/actions/constants/Common.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction             = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;

    private readonly _listCategory! : UiInterfacesIUiScrollList.IUiScrollList<DataForCategoryRenderer>;
    private readonly _listType!     : UiInterfacesIUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _labelTips!    : UiInterfacesIUiLabel.IUiLabel;

    private _selectedType           : WarEventsActionsConstantsCommon.ActionTypeId | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listCategory.setItemRendererClass(CategoryRenderer);
        this._listType.setItemRendererClass(TypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const action = this.getOpenData()?.action;
        if (action == null) {
            return;
        }

        const actionType        = WarEventsActionsUtilsCommon.getActionTypeId(action);
        this._selectedType      = null;
        await this._initListCategory();
        await this.setAndReviseSelectedCategory(actionType == null ? null : getActionCategory(actionType), true);
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listCategory.removeAllItems(),
            this._listType.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public checkHasSelectedCategory(category: WarEventsActionsConstantsCommon.CategoryId): boolean {
        return this._listCategory.getFirstSelectedData()?.category === category;
    }
    public async setAndReviseSelectedCategory(newCategory: number | null, needScroll: boolean): Promise<void> {
        const list      = this._listCategory;
        const newIndex  = list.findIndex(v => v?.category == newCategory);
        list.setSelectedItemIndex(newIndex);

        if (needScroll) {
            list.scrollToItem(newIndex);
        }

        this._selectedType = null;
        await this._updateListType();
    }
    public checkHasSelectedType(actionType: WarEventsActionsConstantsCommon.ActionTypeId): boolean {
        return this._selectedType === actionType;
    }
    public updateOnSelectActionType(actionType: WarEventsActionsConstantsCommon.ActionTypeId): void {
        const oldSelectedActionType = this._selectedType;
        if (oldSelectedActionType === actionType) {
            const openData = this.getOpenData();
            if (openData == null) {
                return;
            }

            const action    = openData.action;
            const war       = openData.war;
            if (actionType !== WarEventsActionsUtilsCommon.getActionTypeId(action)) {
                WarEventsActionsUtilsCommon.resetAction(action, actionType, war.getGcData());
                WarEventsActionsUtilsCommon.openActionModifyPanel(war, openData.fullData, action);

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            }
            this.closePanel();

        } else {
            const list          = this._listType;
            const dataArray     = list.getBoundDataArray() ?? [];
            const oldIndex      = dataArray.findIndex(v => v?.newActionType == oldSelectedActionType);
            const newIndex      = dataArray.findIndex(v => v?.newActionType == actionType);
            this._selectedType  = actionType;
            if (oldIndex >= 0) {
                list.updateSingleData(oldIndex, dataArray[oldIndex]);
            }
            if (newIndex >= 0) {
                list.updateSingleData(newIndex, dataArray[newIndex]);
            }
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0516));
        this._labelTips.setText(LangUtils.getText(LangConstants.TextType.B1249));
    }
    private async _initListCategory(): Promise<void> {
        const action        = this.getOpenData()?.action;
        const actionType    = action == null ? null : WarEventsActionsUtilsCommon.getActionTypeId(action);
        const categoryInUse = actionType == null ? null : getActionCategory(actionType);
        const dataArray     : DataForCategoryRenderer[] = [];
        for (const [category] of WarEventsActionsConstantsCommon.TypeDict) {
            dataArray.push({
                category    : category,
                isInUse     : category === categoryInUse,
                panel       : this,
            });
        }

        await this._listCategory.bindData(dataArray);
    }
    private async _updateListType(): Promise<void> {
        const category  = this._listCategory.getFirstSelectedData()?.category;
        const list      = this._listType;
        if (category == null) {
            await list.removeAllItems();
            return;
        }

        const action = this.getOpenData()?.action;
        if (action == null) {
            return;
        }

        const dataArray: DataForTypeRenderer[] = [];
        for (const newActionType of WarEventsActionsConstantsCommon.TypeDict.get(category) ?? []) {
            dataArray.push({
                newActionType   : newActionType,
                action          : action,
                panel           : this,
            });
        }

        await list.bindData(dataArray, true);
    }
}

interface DataForCategoryRenderer extends UiTypesUiListItemData.UiListItemData {
    category    : WarEventsActionsConstantsCommon.CategoryId;
    isInUse     : boolean;
    panel       : Panel;
}
class CategoryRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForCategoryRenderer>
{
    private readonly _labelCategory!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const label = this._labelCategory;
        label.setText(LangUtils.getWarEventActionCategoryName(data.category) ?? LangConstants.UndefinedError);
        label.setTextColor(data.isInUse ? GraphicsConstants.ColorValue.Green : GraphicsConstants.ColorValue.White);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedCategory(openData.category, false);
    }
}

interface DataForTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    newActionType   : WarEventsActionsConstantsCommon.ActionTypeId;
    action          : WarEventAction;
    panel           : Panel;
}
class TypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _groupSelect!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUsing!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateLabelType();
        this._updateImgSelected();
        this._updateLabelUsing();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectActionType(openData.newActionType);
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelUsing.setText(LangUtils.getText(LangConstants.TextType.B0503));

        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const label = this._labelType;
        if (openData == null) {
            label.setText(``);
        } else {
            label.setText(LangUtils.getWarEventActionTypeName(openData.newActionType) || LangConstants.UndefinedError);
        }
    }
    private _updateImgSelected(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgSelected.setIsVisible(openData.panel.checkHasSelectedType(openData.newActionType));
    }
    private _updateLabelUsing(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelUsing.setIsVisible(WarEventsActionsUtilsCommon.getActionTypeId(openData.action) === openData.newActionType);
    }
}

function getActionCategory(actionType: WarEventsActionsConstantsCommon.ActionTypeId): WarEventsActionsConstantsCommon.CategoryId | null {
    for (const [category, arr] of WarEventsActionsConstantsCommon.TypeDict) {
        if (arr.indexOf(actionType) >= 0) {
            return category;
        }
    }
    return null;
}
