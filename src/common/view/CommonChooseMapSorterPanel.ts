import {
    Lang_Utils,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Maps_Constants,
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
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

const MapSortTypeArray = [
    Maps_Constants.SortType.MapName,
    Maps_Constants.SortType.NormalMapId,
    Maps_Constants.SortType.DesignerName,
    Maps_Constants.SortType.Popularity,
    Maps_Constants.SortType.GlobalRating,
    Maps_Constants.SortType.MyRating,
    Maps_Constants.SortType.PlayersCountUnneutral,
    Maps_Constants.SortType.GridsCount,
];

export interface OpenData {
    currentSorter       : AuxiliaryTypes_AuxiliaryTypes.MapSorter | null;
    callbackOnConfirm   : (mapSorter: AuxiliaryTypes_AuxiliaryTypes.MapSorter) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listSortType!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSortTypeRenderer>;

    private readonly _groupIsAscending! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgIsAscending!   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIsAscending! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    private _isAscending    = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
            { ui : this._groupIsAscending,   callback : this._onTouchedGroupIsAscending },
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
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1049);
        this._labelIsAscending.setLangText(Lang_Constants.TextType.B1106);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._groupIsAscending.arrangeItems();
    }

    private async _updateListTileType(): Promise<void> {
        const dataArray: DataForSortTypeRenderer[] = [];
        for (const sortType of MapSortTypeArray) {
            dataArray.push({
                sortType : sortType,
            });
        }

        const list      = this._listSortType;
        const sortType  = this.getOpenData()?.currentSorter?.sortType ?? Maps_Constants.SortType.MapName;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(Math.max(0, dataArray.findIndex(v => v.sortType === sortType)));
    }

    private _updateImgIsAscending(): void {
        this._imgIsAscending.setIsVisible(this._isAscending);
    }
}

interface DataForSortTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    sortType    : Maps_Constants.SortType;
}
class SortTypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSortTypeRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
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

        this._labelName.setText(Lang_Utils.getMapSortTypeName(openData.sortType) ?? Lang_Constants.UndefinedError);
    }
}
