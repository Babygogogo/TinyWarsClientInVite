import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MapTagsUtils from "../../mapTags/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    currentGroupedMapTagId  : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _list!             : UiInterfacesIUiScrollList.IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _selectedMapTagIdSet   = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
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

        const mapTagIdArray         = MapTagsUtils.getDecodedMapTagIdList(currentGroupedMapTagId);
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
        this._labelTitle.setLangText(LangConstants.TextType.B0445);
        this._labelNoData.setLangText(LangConstants.TextType.B0278);
    }

    private async _updateComponentsForList(): Promise<void> {
        const enabledMapTagIdArray  = HelpersCollection.getNonNullElements((await NormalMapModelNormalMapModel.getMapTag())?.getMapTagDataArray()?.map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []);
        const dataArray             : DataForItemRenderer[] = [];
        for (const mapTagId of enabledMapTagIdArray.sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                mapTagId    : mapTagId,
                panel       : this,
            });
        }

        const hasData = !!dataArray.length;
        this._labelNoData.setIsVisible(!hasData);
        await this._list.bindData(dataArray);
    }
}

interface DataForItemRenderer extends UiTypesUiListItemData.UiListItemData {
    mapTagId    : number;
    panel       : Panel;
}
class ItemRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForItemRenderer> {
    private readonly _groupShow!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._setShortSfxCode(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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

        const mapTagData = (await NormalMapModelNormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if (mapTagId !== this.getOpenData()?.mapTagId) {
            return;
        }

        this._labelId.setText(`#${mapTagId}`);
        this._labelName.setText(LangUtils.getLanguageText({ textArray: mapTagData?.getNameArray() }) ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
    }
}
