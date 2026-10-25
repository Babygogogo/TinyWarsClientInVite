import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getWarEventActionCategoryName, getWarEventActionTypeName } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { ActionTypeId, CategoryId, TypeDict } from "../../warEvents/actions/constants/Common.ts";
import { getActionTypeId, resetAction, openActionModifyPanel } from "../../warEvents/actions/utils/Common.ts";

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _btnClose!     : IUiButton;

    private readonly _listCategory! : IUiScrollList<DataForCategoryRenderer>;
    private readonly _listType!     : IUiScrollList<DataForTypeRenderer>;
    private readonly _labelTips!    : IUiLabel;

    private _selectedType           : ActionTypeId | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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

        const actionType        = getActionTypeId(action);
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

    public checkHasSelectedCategory(category: CategoryId): boolean {
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
    public checkHasSelectedType(actionType: ActionTypeId): boolean {
        return this._selectedType === actionType;
    }
    public updateOnSelectActionType(actionType: ActionTypeId): void {
        const oldSelectedActionType = this._selectedType;
        if (oldSelectedActionType === actionType) {
            const openData = this.getOpenData();
            if (openData == null) {
                return;
            }

            const action    = openData.action;
            const war       = openData.war;
            if (actionType !== getActionTypeId(action)) {
                resetAction(action, actionType, war.getGcData());
                openActionModifyPanel(war, openData.fullData, action);

                dispatch(TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(getText(TextType.B0516));
        this._labelTips.setText(getText(TextType.B1249));
    }
    private async _initListCategory(): Promise<void> {
        const action        = this.getOpenData()?.action;
        const actionType    = action == null ? null : getActionTypeId(action);
        const categoryInUse = actionType == null ? null : getActionCategory(actionType);
        const dataArray     : DataForCategoryRenderer[] = [];
        for (const [category] of TypeDict) {
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
        for (const newActionType of TypeDict.get(category) ?? []) {
            dataArray.push({
                newActionType   : newActionType,
                action          : action,
                panel           : this,
            });
        }

        await list.bindData(dataArray, true);
    }
}

interface DataForCategoryRenderer extends UiListItemData {
    category    : CategoryId;
    isInUse     : boolean;
    panel       : Panel;
}
class CategoryRenderer
    extends     UiListItemRenderer<DataForCategoryRenderer>
    implements  IUiListItemRenderer<DataForCategoryRenderer>
{
    private readonly _labelCategory!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const label = this._labelCategory;
        label.setText(getWarEventActionCategoryName(data.category) ?? UndefinedError);
        label.setTextColor(data.isInUse ? ColorValue.Green : ColorValue.White);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedCategory(openData.category, false);
    }
}

interface DataForTypeRenderer extends UiListItemData {
    newActionType   : ActionTypeId;
    action          : WarEventAction;
    panel           : Panel;
}
class TypeRenderer extends UiListItemRenderer<DataForTypeRenderer> {
    private readonly _groupSelect!  : IUiContainer;
    private readonly _labelType!    : IUiLabel;
    private readonly _labelUsing!   : IUiLabel;
    private readonly _imgSelected!  : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);

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
        this._labelUsing.setText(getText(TextType.B0503));

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
            label.setText(getWarEventActionTypeName(openData.newActionType) || UndefinedError);
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

        this._labelUsing.setIsVisible(getActionTypeId(openData.action) === openData.newActionType);
    }
}

function getActionCategory(actionType: ActionTypeId): CategoryId | null {
    for (const [category, arr] of TypeDict) {
        if (arr.indexOf(actionType) >= 0) {
            return category;
        }
    }
    return null;
}
