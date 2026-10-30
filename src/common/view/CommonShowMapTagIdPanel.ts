import {
    MapTags_Utils,
    Lang_Utils,
    NormalMap_Model_NormalMapModel,
    Helpers_Collection,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    currentGroupedMapTagId  : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _list!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _selectedMapTagIdSet   = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(ItemRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const currentGroupedMapTagId = this.getOpenData()?.currentGroupedMapTagId;
        if (currentGroupedMapTagId == null) {
            return;
        }

        const mapTagIdArray         = MapTags_Utils.getDecodedMapTagIdList(currentGroupedMapTagId);
        const selectedMapTagIdSet   = this._selectedMapTagIdSet;
        selectedMapTagIdSet.clear();
        for (const mapTagId of mapTagIdArray) {
            selectedMapTagIdSet.add(mapTagId);
        }

        this._updateComponentsForLanguage();
        this._updateComponentsForList();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    public checkHasSelectedMapTagId(mapTagId: number): boolean {
        return this._selectedMapTagIdSet.has(mapTagId);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0445);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
    }

    private async _updateComponentsForList(): Promise<void> {
        const enabledMapTagIdArray  = Helpers_Collection.getNonNullElements((await NormalMap_Model_NormalMapModel.getMapTag())?.getMapTagDataArray()?.map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []);
        const dataArray             : DataForItemRenderer[] = [];
        for (const mapTagId of enabledMapTagIdArray.sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                mapTagId : mapTagId,
                panel    : this,
            });
        }

        const hasData = !!dataArray.length;
        this._labelNoData.setIsVisible(!hasData);
        await this._list.bindData(dataArray);
    }
}

interface DataForItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    mapTagId    : number;
    panel       : Panel;
}
class ItemRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForItemRenderer> {
    private readonly _groupShow!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);

        this._setShortSfxCode(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapTagId = openData.mapTagId;
        this._imgSelected.setIsVisible(openData.panel.checkHasSelectedMapTagId(mapTagId));

        const mapTagData = (await NormalMap_Model_NormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if (mapTagId !== this.getOpenData()?.mapTagId) {
            return;
        }

        this._labelId.setText(`#${mapTagId}`);
        this._labelName.setText(Lang_Utils.getLanguageText({ textArray : mapTagData?.getNameArray() }) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }
}
