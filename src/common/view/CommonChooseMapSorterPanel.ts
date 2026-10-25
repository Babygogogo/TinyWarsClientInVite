import type { MapSorter } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { SortType } from "../../gameConfig/GcMap.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getMapSortTypeName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

const MapSortTypeArray = [
    SortType.MapName,
    SortType.NormalMapId,
    SortType.DesignerName,
    SortType.Popularity,
    SortType.GlobalRating,
    SortType.MyRating,
    SortType.PlayersCountUnneutral,
    SortType.GridsCount,
];

export interface OpenData {
    currentSorter       : MapSorter | null;
    callbackOnConfirm   : (mapSorter: MapSorter) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _listSortType!     : IUiScrollList<DataForSortTypeRenderer>;

    private readonly _groupIsAscending! : IUiLayout;
    private readonly _imgIsAscending!   : IUiImage;
    private readonly _labelIsAscending! : IUiLabel;

    private readonly _btnConfirm!       : IUiButton;

    private _isAscending    = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            { ui: this._groupIsAscending,   callback: this._onTouchedGroupIsAscending },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSortType.setItemRendererClass(SortTypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._isAscending = this.getOpenData()?.currentSorter?.isAscending ?? true;
        this._updateListTileType();
        this._updateImgIsAscending();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSortType.removeAllItems();

        await super._onClosed();
    }

    private _onTouchedBtnConfirm(): void {
        const sortType = this._listSortType.getFirstSelectedData()?.sortType;
        if (sortType == null) {
            playShortSfx(ShortSfxCode.ButtonForbidden01);
            return;
        }

        this.getOpenData()?.callbackOnConfirm({
            sortType    : sortType,
            isAscending : this._isAscending,
        });
        this.closePanel();
    }

    private _onTouchedGroupIsAscending(): void {
        this._isAscending = !this._isAscending;
        this._updateImgIsAscending();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B1049));
        this._labelIsAscending.setText(getText(TextType.B1106));
        this._btnConfirm.setText(getText(TextType.B0026));
        this._groupIsAscending.arrangeItems();
    }

    private async _updateListTileType(): Promise<void> {
        const dataArray: DataForSortTypeRenderer[] = [];
        for (const sortType of MapSortTypeArray) {
            dataArray.push({
                sortType: sortType,
            });
        }

        const list      = this._listSortType;
        const sortType  = this.getOpenData()?.currentSorter?.sortType ?? SortType.MapName;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(Math.max(0, dataArray.findIndex(v => v.sortType === sortType)));
    }

    private _updateImgIsAscending(): void {
        this._imgIsAscending.setIsVisible(this._isAscending);
    }
}

interface DataForSortTypeRenderer extends UiListItemData {
    sortType    : SortType;
}
class SortTypeRenderer extends UiListItemRenderer<DataForSortTypeRenderer> {
    private readonly _labelName!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelName.setText(getMapSortTypeName(openData.sortType) ?? UndefinedError);
    }
}
