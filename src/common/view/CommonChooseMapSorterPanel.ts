import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

const MapSortTypeArray = [
    GameConfigGcMap.SortType.MapName,
    GameConfigGcMap.SortType.NormalMapId,
    GameConfigGcMap.SortType.DesignerName,
    GameConfigGcMap.SortType.Popularity,
    GameConfigGcMap.SortType.GlobalRating,
    GameConfigGcMap.SortType.MyRating,
    GameConfigGcMap.SortType.PlayersCountUnneutral,
    GameConfigGcMap.SortType.GridsCount,
];

export interface OpenData {
    currentSorter       : AuxiliaryTypesAuxiliaryTypes.MapSorter | null;
    callbackOnConfirm   : (mapSorter: AuxiliaryTypesAuxiliaryTypes.MapSorter) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _listSortType!     : UiInterfacesIUiScrollList.IUiScrollList<DataForSortTypeRenderer>;

    private readonly _groupIsAscending! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgIsAscending!   : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIsAscending! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    private _isAscending    = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1049));
        this._labelIsAscending.setText(LangUtils.getText(LangConstants.TextType.B1106));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
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
        const sortType  = this.getOpenData()?.currentSorter?.sortType ?? GameConfigGcMap.SortType.MapName;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(Math.max(0, dataArray.findIndex(v => v.sortType === sortType)));
    }

    private _updateImgIsAscending(): void {
        this._imgIsAscending.setIsVisible(this._isAscending);
    }
}

interface DataForSortTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    sortType    : GameConfigGcMap.SortType;
}
class SortTypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSortTypeRenderer> {
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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

        this._labelName.setText(LangUtils.getMapSortTypeName(openData.sortType) ?? LangConstants.UndefinedError);
    }
}
