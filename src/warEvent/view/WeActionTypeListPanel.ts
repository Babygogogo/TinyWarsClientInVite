import {
    WarEvents_Actions_Constants_Common,
    Graphics_Constants,
    Notifications_Dispatcher,
    Tween_Executor,
    WarEvents_Actions_Utils_Common,
    Lang_Utils,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listCategory! : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCategoryRenderer>;
    private readonly _listType!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _labelTips!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private _selectedType           : WarEvents_Actions_Constants_Common.ActionTypeId | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
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

        const actionType        = WarEvents_Actions_Utils_Common.getActionTypeId(action);
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

    public checkHasSelectedCategory(category: WarEvents_Actions_Constants_Common.CategoryId): boolean {
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
    public checkHasSelectedType(actionType: WarEvents_Actions_Constants_Common.ActionTypeId): boolean {
        return this._selectedType === actionType;
    }
    public updateOnSelectActionType(actionType: WarEvents_Actions_Constants_Common.ActionTypeId): void {
        const oldSelectedActionType = this._selectedType;
        if (oldSelectedActionType === actionType) {
            const openData = this.getOpenData();
            if (openData == null) {
                return;
            }

            const action    = openData.action;
            const war       = openData.war;
            if (actionType !== WarEvents_Actions_Utils_Common.getActionTypeId(action)) {
                WarEvents_Actions_Utils_Common.resetAction(action, actionType, war.getGcData());
                WarEvents_Actions_Utils_Common.openActionModifyPanel(war, openData.fullData, action);

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0516);
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
    }
    private async _initListCategory(): Promise<void> {
        const action        = this.getOpenData()?.action;
        const actionType    = action == null ? null : WarEvents_Actions_Utils_Common.getActionTypeId(action);
        const categoryInUse = actionType == null ? null : getActionCategory(actionType);
        const dataArray     : DataForCategoryRenderer[] = [];
        for (const [category] of WarEvents_Actions_Constants_Common.TypeDict) {
            dataArray.push({
                category : category,
                isInUse  : category === categoryInUse,
                panel    : this,
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
        for (const newActionType of WarEvents_Actions_Constants_Common.TypeDict.get(category) ?? []) {
            dataArray.push({
                newActionType : newActionType,
                action        : action,
                panel         : this,
            });
        }

        await list.bindData(dataArray, true);
    }
}

interface DataForCategoryRenderer extends Ui_Types_UiListItemData.UiListItemData {
    category    : WarEvents_Actions_Constants_Common.CategoryId;
    isInUse     : boolean;
    panel       : Panel;
}
class CategoryRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForCategoryRenderer> {
    private readonly _labelCategory!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const label = this._labelCategory;
        label.setText(Lang_Utils.getWarEventActionCategoryName(data.category) ?? Lang_Constants.UndefinedError);
        label.setTextColor(data.isInUse ? Graphics_Constants.ColorValue.Green : Graphics_Constants.ColorValue.White);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedCategory(openData.category, false);
    }
}

interface DataForTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    newActionType   : WarEvents_Actions_Constants_Common.ActionTypeId;
    action          : WarEventAction;
    panel           : Panel;
}
class TypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _groupSelect!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUsing!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);

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
        this._labelUsing.setLangText(Lang_Constants.TextType.B0503);

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
            label.setText(Lang_Utils.getWarEventActionTypeName(openData.newActionType) || Lang_Constants.UndefinedError);
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

        this._labelUsing.setIsVisible(WarEvents_Actions_Utils_Common.getActionTypeId(openData.action) === openData.newActionType);
    }
}

function getActionCategory(actionType: WarEvents_Actions_Constants_Common.ActionTypeId): WarEvents_Actions_Constants_Common.CategoryId | null {
    for (const [category, arr] of WarEvents_Actions_Constants_Common.TypeDict) {
        if (arr.indexOf(actionType) >= 0) {
            return category;
        }
    }
    return null;
}
