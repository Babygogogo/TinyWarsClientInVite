import {
    Locations_Constants,
    Helpers_Collection,
    Locations_Utils,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    needChangeLocationVisibility    : boolean;
    currentGroupedLocationIds       : number[];
    war                             : BaseWar_Interface_IBwWar.IBwWar;
    getTitleText                    : () => string;
    callback                        : (locationIdArray: number[]) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupSelectAll!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgSelectAll!     : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelSelectAll!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listLocation!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForLocationRenderer>;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTips!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnCancel,              callback : this._onTouchedBtnCancel },
            { ui : this._btnHelp,                callback : this._onTouchedBtnHelp },
            { ui : this._groupSelectAll,         callback : this._onTouchedGroupSelectAll },
            { ui : this._btnConfirm,             callback : this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();
        });
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listLocation.setItemRendererClass(LocationRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateListLocation();
        this.updateImgSelectAll();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listLocation.removeAllItems();

        await super._onClosed();
    }

    private _onTouchedGroupSelectAll(): void {
        const openData      = this.getOpenData();
        const isSelectAll   = !this._imgSelectAll.getIsVisible();
        if ((openData) && (openData.needChangeLocationVisibility)) {
            openData.war.getTileMap().setAllLocationVisible(isSelectAll);
        }

        const list = this._listLocation;
        list.setSelectedItemIndexes(isSelectAll ? Helpers_Collection.createRange(0, (list.getBoundDataArray()?.length ?? 0) + 1, 1) : []);
        this.updateImgSelectAll();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callback(Helpers_Collection.getNonNullElements(this._listLocation.getSelectedDataArray()?.map(v => v?.locationId) ?? []));
        this.closePanel();
    }
    private _onTouchedBtnCancel(): void {
        const openData = this.getOpenData();
        if ((openData) && (openData.needChangeLocationVisibility)) {
            openData.war.getTileMap().setVisibleGroupedLocationIdArray(openData.currentGroupedLocationIds);
        }

        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0781),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? Lang_Utils.getText(Lang_Constants.TextType.Location));
        this._labelSelectAll.setLangText(Lang_Constants.TextType.B0761);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._labelTips.setLangText(Lang_Constants.TextType.A0982);

        this._groupSelectAll.arrangeItems();
    }

    public updateImgSelectAll(): void {
        this._imgSelectAll.setIsVisible((this._listLocation.getSelectedItems()?.length ?? 0) >= Locations_Constants.AllLocationsCount);
    }
    private async _updateListLocation(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const inUseDict     = new Map<number, number>();
        const noEntryDict   = new Map<number, number>();
        for (const locationId of war.getTileMap().getAllTiles().flatMap(v => v.getLocationIdList(true))) {
            inUseDict.set(locationId, (inUseDict.get(locationId) ?? 0) + 1);
        }
        for (const locationId of war.getUnitMap().getAllUnits().flatMap(v => v.getForbiddenLocationIdArray())) {
            noEntryDict.set(locationId, (noEntryDict.get(locationId) ?? 0) + 1);
        }

        const needChangeLocationVisibility  = openData.needChangeLocationVisibility;
        const locationIdList                = Locations_Utils.decode(openData.currentGroupedLocationIds);
        const selectedItemIndexes           : number[] = [];
        let index                           = 0;
        const dataArray                     : DataForLocationRenderer[] = [];
        for (let locationId = Locations_Constants.MinId; locationId <= Locations_Constants.MaxId; ++locationId) {
            dataArray.push({
                war                          : war,
                needChangeLocationVisibility : needChangeLocationVisibility,
                locationId                   : locationId,
                useCount                     : inUseDict.get(locationId) ?? 0,
                noEntryCount                 : noEntryDict.get(locationId) ?? 0,
                panel                        : this,
            });
            if (locationIdList.includes(locationId)) {
                selectedItemIndexes.push(index);
            }
            ++index;
        }

        const list = this._listLocation;
        await list.bindData(dataArray);
        list.setSelectedItemIndexes(selectedItemIndexes);
    }
}

interface DataForLocationRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war                             : BaseWar_Interface_IBwWar.IBwWar;
    needChangeLocationVisibility    : boolean;
    locationId                      : number;
    useCount                        : number;
    noEntryCount                    : number;
    panel                           : Panel;
}
class LocationRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
    private readonly _layoutInfo!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelLocationId!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutUsage!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelInUse!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoEntry!     : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        this._labelLocationId.setText(`${openData?.locationId}`);

        {
            const useCount      = openData?.useCount ?? 0;
            const labelInUse    = this._labelInUse;
            labelInUse.setIsVisible(useCount > 0);
            labelInUse.setText(`${useCount}`);
        }
        {
            const noEntryCount  = openData?.noEntryCount ?? 0;
            const labelNoEntry  = this._labelNoEntry;
            labelNoEntry.setIsVisible(noEntryCount > 0);
            labelNoEntry.setText(`${noEntryCount}`);
        }

        this._layoutUsage.arrangeItems();
        this._layoutInfo.arrangeItems();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const locationId = openData.locationId;
        if (openData.needChangeLocationVisibility) {
            const tileMap = openData.war.getTileMap();
            tileMap.setIsLocationVisible(locationId, !tileMap.getIsLocationVisible(locationId));
        }

        openData.panel.updateImgSelectAll();
    }
}
