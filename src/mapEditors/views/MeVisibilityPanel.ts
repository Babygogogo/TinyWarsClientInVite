import {
    MapEditors_Constants,
    Helpers_Misc,
    Lang_Utils,
    MapEditor_Model_MeModel,
    Locations_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelTileAndUnit!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupUnit!            : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelUnit!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgUnit!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupTileObject!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgTileObject!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTileObject!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupTileBase!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgTileBase!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTileBase!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupTileDecoration!  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgTileDecoration!    : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTileDecoration!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelLocation!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupShowAllLocation! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgShowAllLocation!   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelShowAllLocation! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listLocation!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForLocationRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._groupTileBase,          callback : this._onTouchedGroupTileBase },
            { ui : this._groupTileDecoration,    callback : this._onTouchedGroupTileDecoration },
            { ui : this._groupTileObject,        callback : this._onTouchedGroupTileObject },
            { ui : this._groupUnit,              callback : this._onTouchedGroupUnit },
            { ui : this._groupShowAllLocation,   callback : this._onTouchedGroupShowAllLocation },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listLocation.setItemRendererClass(LocationRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateGroupUnit();
        this._updateGroupTileBase();
        this._updateGroupTileDecoration();
        this._updateGroupTileObject();
        this.updateImgShowAllLocation();
        this._updateListLocation();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listLocation.removeAllItems();

        await super._onClosed();
    }

    private _getWar(): MapEditor_Interface_IMeWar.IMeWar {
        return Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar());
    }

    private _onTouchedGroupTileBase(): void {
        const view = this._getWar().getField().getView();
        view.setTileBasesVisible(!view.getTileBasesVisible());
        this._updateGroupTileBase();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupTileDecoration(): void {
        const view = this._getWar().getField().getView();
        view.setTileDecorationsVisible(!view.getTileDecorationsVisible());
        this._updateGroupTileDecoration();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupTileObject(): void {
        const view = this._getWar().getField().getView();
        view.setTileObjectsVisible(!view.getTileObjectsVisible());
        this._updateGroupTileObject();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupUnit(): void {
        const view = this._getWar().getField().getView();
        view.setUnitsVisible(!view.getUnitsVisible());
        this._updateGroupUnit();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupShowAllLocation(): void {
        const tileMap = this._getWar().getTileMap();
        if (!this._imgShowAllLocation.getIsVisible()) {
            for (let locationId = Locations_Constants.MinId; locationId <= Locations_Constants.MaxId; ++locationId) {
                tileMap.setIsLocationVisible(locationId, true);
            }
        } else {
            const drawer        = this._getWar().getDrawer();
            const drawerMode    = drawer.getMode();
            const forceVisibleLocationIdSet = new Set<number>();
            if (drawerMode === MapEditors_Constants.DrawerMode.AddTileToLocation) {
                for (const locationId of drawer.getDataForAddTileToLocation()?.locationIdArray ?? []) {
                    forceVisibleLocationIdSet.add(locationId);
                }
            } else if (drawerMode === MapEditors_Constants.DrawerMode.DeleteTileFromLocation) {
                for (const locationId of drawer.getDataForDeleteTileFromLocation()?.locationIdArray ?? []) {
                    forceVisibleLocationIdSet.add(locationId);
                }
            }

            for (let locationId = Locations_Constants.MinId; locationId <= Locations_Constants.MaxId; ++locationId) {
                if (!forceVisibleLocationIdSet.has(locationId)) {
                    tileMap.setIsLocationVisible(locationId, false);
                }
            }
        }

        this.updateImgShowAllLocation();
        this._updateListLocation();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0301);
        this._labelTileAndUnit.setLangText(Lang_Constants.TextType.B1244);
        this._labelTileBase.setLangText(Lang_Constants.TextType.TileBase);
        this._labelTileDecoration.setLangText(Lang_Constants.TextType.TileDecoration);
        this._labelTileObject.setLangText(Lang_Constants.TextType.TileObject);
        this._labelUnit.setLangText(Lang_Constants.TextType.Units);
        this._labelLocation.setLangText(Lang_Constants.TextType.Location);
        this._labelShowAllLocation.setLangText(Lang_Constants.TextType.B0761);
        // this._btnShowAllLocations.label = Lang.getText(LangTextType.B0757);
        // this._btnHideAllLocations.label = Lang.getText(LangTextType.B0758);

        this._groupShowAllLocation.arrangeItems();
        this._groupTileBase.arrangeItems();
        this._groupTileDecoration.arrangeItems();
        this._groupTileObject.arrangeItems();
        this._groupUnit.arrangeItems();
    }

    private _updateGroupUnit(): void {
        this._imgUnit.setIsVisible(this._getWar().getField().getView().getUnitsVisible());
    }
    private _updateGroupTileBase(): void {
        this._imgTileBase.setIsVisible(this._getWar().getField().getView().getTileBasesVisible());
    }
    private _updateGroupTileDecoration(): void {
        this._imgTileDecoration.setIsVisible(this._getWar().getField().getView().getTileDecorationsVisible());
    }
    private _updateGroupTileObject(): void {
        this._imgTileObject.setIsVisible(this._getWar().getField().getView().getTileObjectsVisible());
    }
    public updateImgShowAllLocation(): void {
        const tileMap   = this._getWar().getTileMap();
        const img       = this._imgShowAllLocation;
        for (let locationId = Locations_Constants.MinId; locationId <= Locations_Constants.MaxId; ++locationId) {
            if (!tileMap.getIsLocationVisible(locationId)) {
                img.setIsVisible(false);
                return;
            }
        }

        img.setIsVisible(true);
    }
    private async _updateListLocation(): Promise<void> {
        const dataArray : DataForLocationRenderer[] = [];
        const war       = this._getWar();
        for (let locationId = Locations_Constants.MinId; locationId <= Locations_Constants.MaxId; ++locationId) {
            dataArray.push({
                war        : war,
                locationId : locationId,
                panel      : this,
            });
        }
        await this._listLocation.bindData(dataArray);
    }
}

interface DataForLocationRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    locationId  : number;
    panel       : Panel;
}
class LocationRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
    private readonly _groupShow!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgShow!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelLocationId!  : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        this._labelLocationId.setText(`${this.getOpenData()?.locationId}`);
        this._updateImgShow();
    }

    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        const locationId    = openData.locationId;
        const war           = openData.war;
        const drawer        = war.getDrawer();
        if (((drawer.getMode() === MapEditors_Constants.DrawerMode.AddTileToLocation) && (drawer.getDataForAddTileToLocation()?.locationIdArray.some(v => v === locationId)))             ||
            ((drawer.getMode() === MapEditors_Constants.DrawerMode.DeleteTileFromLocation) && (drawer.getDataForDeleteTileFromLocation()?.locationIdArray.some(v => v === locationId)))
        ) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0267));
            return;
        }

        const tileMap = war.getTileMap();
        tileMap.setIsLocationVisible(locationId, !tileMap.getIsLocationVisible(locationId));
        this._updateImgShow();
        openData.panel.updateImgShowAllLocation();
    }

    private _updateImgShow(): void {
        const openData = this.getOpenData();
        this._imgShow.setIsVisible(!!openData?.war.getTileMap().getIsLocationVisible(openData.locationId));
    }
}
