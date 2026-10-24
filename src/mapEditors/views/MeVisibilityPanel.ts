import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMapEditor from "../../gameConfig/GcMapEditor.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocationsConstants from "../../locations/Constants.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
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

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _labelTileAndUnit!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupUnit!            : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelUnit!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgUnit!              : UiInterfacesIUiImage.IUiImage;
    private readonly _groupTileObject!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgTileObject!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTileObject!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupTileBase!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgTileBase!          : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTileBase!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupTileDecoration!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgTileDecoration!    : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTileDecoration!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelLocation!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupShowAllLocation! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgShowAllLocation!   : UiInterfacesIUiImage.IUiImage;
    private readonly _labelShowAllLocation! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listLocation!         : UiInterfacesIUiScrollList.IUiScrollList<DataForLocationRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._groupTileBase,          callback: this._onTouchedGroupTileBase, },
            { ui: this._groupTileDecoration,    callback: this._onTouchedGroupTileDecoration },
            { ui: this._groupTileObject,        callback: this._onTouchedGroupTileObject, },
            { ui: this._groupUnit,              callback: this._onTouchedGroupUnit },
            { ui: this._groupShowAllLocation,   callback: this._onTouchedGroupShowAllLocation },
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

    private _getWar(): MapEditorInterfaceIMeWar.IMeWar {
        return HelpersMisc.getExisted(MapEditorModelMeModel.getWar());
    }

    private _onTouchedGroupTileBase(): void {
        const view = this._getWar().getField().getView();
        view.setTileBasesVisible(!view.getTileBasesVisible());
        this._updateGroupTileBase();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupTileDecoration(): void {
        const view = this._getWar().getField().getView();
        view.setTileDecorationsVisible(!view.getTileDecorationsVisible());
        this._updateGroupTileDecoration();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupTileObject(): void {
        const view = this._getWar().getField().getView();
        view.setTileObjectsVisible(!view.getTileObjectsVisible());
        this._updateGroupTileObject();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupUnit(): void {
        const view = this._getWar().getField().getView();
        view.setUnitsVisible(!view.getUnitsVisible());
        this._updateGroupUnit();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupShowAllLocation(): void {
        const tileMap = this._getWar().getTileMap();
        if (!this._imgShowAllLocation.getIsVisible()) {
            for (let locationId = LocationsConstants.MinId; locationId <= LocationsConstants.MaxId; ++locationId) {
                tileMap.setIsLocationVisible(locationId, true);
            }
        } else {
            const drawer        = this._getWar().getDrawer();
            const drawerMode    = drawer.getMode();
            const forceVisibleLocationIdSet = new Set<number>();
            if (drawerMode === GameConfigGcMapEditor.DrawerMode.AddTileToLocation) {
                for (const locationId of drawer.getDataForAddTileToLocation()?.locationIdArray ?? []) {
                    forceVisibleLocationIdSet.add(locationId);
                }
            } else if (drawerMode === GameConfigGcMapEditor.DrawerMode.DeleteTileFromLocation) {
                for (const locationId of drawer.getDataForDeleteTileFromLocation()?.locationIdArray ?? []) {
                    forceVisibleLocationIdSet.add(locationId);
                }
            }

            for (let locationId = LocationsConstants.MinId; locationId <= LocationsConstants.MaxId; ++locationId) {
                if (!forceVisibleLocationIdSet.has(locationId)) {
                    tileMap.setIsLocationVisible(locationId, false);
                }
            }
        }

        this.updateImgShowAllLocation();
        this._updateListLocation();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0301));
        this._labelTileAndUnit.setText(LangUtils.getText(LangConstants.TextType.B1244));
        this._labelTileBase.setText(LangUtils.getText(LangConstants.TextType.TileBase));
        this._labelTileDecoration.setText(LangUtils.getText(LangConstants.TextType.TileDecoration));
        this._labelTileObject.setText(LangUtils.getText(LangConstants.TextType.TileObject));
        this._labelUnit.setText(LangUtils.getText(LangConstants.TextType.Units));
        this._labelLocation.setText(LangUtils.getText(LangConstants.TextType.Location));
        this._labelShowAllLocation.setText(LangUtils.getText(LangConstants.TextType.B0761));
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
        for (let locationId = LocationsConstants.MinId; locationId <= LocationsConstants.MaxId; ++locationId) {
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
        for (let locationId = LocationsConstants.MinId; locationId <= LocationsConstants.MaxId; ++locationId) {
            dataArray.push({
                war         : war,
                locationId  : locationId,
                panel       : this,
            });
        }
        await this._listLocation.bindData(dataArray);
    }
}

interface DataForLocationRenderer extends UiTypesUiListItemData.UiListItemData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    locationId  : number;
    panel       : Panel;
}
class LocationRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
    private readonly _groupShow!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgShow!          : UiInterfacesIUiImage.IUiImage;
    private readonly _labelLocationId!  : UiInterfacesIUiLabel.IUiLabel;

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
        if (((drawer.getMode() === GameConfigGcMapEditor.DrawerMode.AddTileToLocation) && (drawer.getDataForAddTileToLocation()?.locationIdArray.some(v => v === locationId)))             ||
            ((drawer.getMode() === GameConfigGcMapEditor.DrawerMode.DeleteTileFromLocation) && (drawer.getDataForDeleteTileFromLocation()?.locationIdArray.some(v => v === locationId)))
        ) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0267));
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
