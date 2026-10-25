import { getNonNullElements } from "../../helpers/Collection.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getLanguageText } from "../../lang/Utils.ts";
import { getDecodedMapTagIdList } from "../../mapTags/Utils.ts";
import { getMapTag } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    currentGroupedMapTagId  : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _list!             : IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!      : IUiLabel;

    private readonly _selectedMapTagIdSet   = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

        const mapTagIdArray         = getDecodedMapTagIdList(currentGroupedMapTagId);
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
        this._labelTitle.setLangText(TextType.B0445);
        this._labelNoData.setLangText(TextType.B0278);
    }

    private async _updateComponentsForList(): Promise<void> {
        const enabledMapTagIdArray  = getNonNullElements((await getMapTag())?.getMapTagDataArray()?.map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []);
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

interface DataForItemRenderer extends UiListItemData {
    mapTagId    : number;
    panel       : Panel;
}
class ItemRenderer extends UiListItemRenderer<DataForItemRenderer> {
    private readonly _groupShow!    : IUiContainer;
    private readonly _imgSelected!  : IUiImage;

    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._setShortSfxCode(ShortSfxCode.ButtonNeutral01);
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

        const mapTagData = (await getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if (mapTagId !== this.getOpenData()?.mapTagId) {
            return;
        }

        this._labelId.setText(`#${mapTagId}`);
        this._labelName.setText(getLanguageText({ textArray: mapTagData?.getNameArray() }) ?? UndefinedError);
        this._layoutName.arrangeItems();
    }
}
