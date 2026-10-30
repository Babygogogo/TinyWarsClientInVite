import { show } from "../../FloatText.ts";
import { DrawerMode } from "../Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import {
    MinId,
    MaxId,
} from "../../locations/Constants.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getWar } from "../../mapEditor/model/MeModel.ts";
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

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _labelTileAndUnit!     : IUiLabel;
    private readonly _groupUnit!            : IUiLayout;
    private readonly _labelUnit!            : IUiLabel;
    private readonly _imgUnit!              : IUiImage;
    private readonly _groupTileObject!      : IUiLayout;
    private readonly _imgTileObject!        : IUiImage;
    private readonly _labelTileObject!      : IUiLabel;
    private readonly _groupTileBase!        : IUiLayout;
    private readonly _imgTileBase!          : IUiImage;
    private readonly _labelTileBase!        : IUiLabel;
    private readonly _groupTileDecoration!  : IUiLayout;
    private readonly _imgTileDecoration!    : IUiImage;
    private readonly _labelTileDecoration!  : IUiLabel;

    private readonly _labelLocation!        : IUiLabel;
    private readonly _groupShowAllLocation! : IUiLayout;
    private readonly _imgShowAllLocation!   : IUiImage;
    private readonly _labelShowAllLocation! : IUiLabel;
    private readonly _listLocation!         : IUiScrollList<DataForLocationRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

    private _getWar(): IMeWar {
        return getExisted(getWar());
    }

    private _onTouchedGroupTileBase(): void {
        const view = this._getWar().getField().getView();
        view.setTileBasesVisible(!view.getTileBasesVisible());
        this._updateGroupTileBase();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupTileDecoration(): void {
        const view = this._getWar().getField().getView();
        view.setTileDecorationsVisible(!view.getTileDecorationsVisible());
        this._updateGroupTileDecoration();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupTileObject(): void {
        const view = this._getWar().getField().getView();
        view.setTileObjectsVisible(!view.getTileObjectsVisible());
        this._updateGroupTileObject();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupUnit(): void {
        const view = this._getWar().getField().getView();
        view.setUnitsVisible(!view.getUnitsVisible());
        this._updateGroupUnit();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupShowAllLocation(): void {
        const tileMap = this._getWar().getTileMap();
        if (!this._imgShowAllLocation.getIsVisible()) {
            for (let locationId = MinId; locationId <= MaxId; ++locationId) {
                tileMap.setIsLocationVisible(locationId, true);
            }
        } else {
            const drawer        = this._getWar().getDrawer();
            const drawerMode    = drawer.getMode();
            const forceVisibleLocationIdSet = new Set<number>();
            if (drawerMode === DrawerMode.AddTileToLocation) {
                for (const locationId of drawer.getDataForAddTileToLocation()?.locationIdArray ?? []) {
                    forceVisibleLocationIdSet.add(locationId);
                }
            } else if (drawerMode === DrawerMode.DeleteTileFromLocation) {
                for (const locationId of drawer.getDataForDeleteTileFromLocation()?.locationIdArray ?? []) {
                    forceVisibleLocationIdSet.add(locationId);
                }
            }

            for (let locationId = MinId; locationId <= MaxId; ++locationId) {
                if (!forceVisibleLocationIdSet.has(locationId)) {
                    tileMap.setIsLocationVisible(locationId, false);
                }
            }
        }

        this.updateImgShowAllLocation();
        this._updateListLocation();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0301);
        this._labelTileAndUnit.setLangText(TextType.B1244);
        this._labelTileBase.setLangText(TextType.TileBase);
        this._labelTileDecoration.setLangText(TextType.TileDecoration);
        this._labelTileObject.setLangText(TextType.TileObject);
        this._labelUnit.setLangText(TextType.Units);
        this._labelLocation.setLangText(TextType.Location);
        this._labelShowAllLocation.setLangText(TextType.B0761);
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
        for (let locationId = MinId; locationId <= MaxId; ++locationId) {
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
        for (let locationId = MinId; locationId <= MaxId; ++locationId) {
            dataArray.push({
                war         : war,
                locationId  : locationId,
                panel       : this,
            });
        }
        await this._listLocation.bindData(dataArray);
    }
}

interface DataForLocationRenderer extends UiListItemData {
    war         : IMeWar;
    locationId  : number;
    panel       : Panel;
}
class LocationRenderer extends UiListItemRenderer<DataForLocationRenderer> {
    private readonly _groupShow!        : IUiContainer;
    private readonly _imgShow!          : IUiImage;
    private readonly _labelLocationId!  : IUiLabel;

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
        if (((drawer.getMode() === DrawerMode.AddTileToLocation) && (drawer.getDataForAddTileToLocation()?.locationIdArray.some(v => v === locationId)))             ||
            ((drawer.getMode() === DrawerMode.DeleteTileFromLocation) && (drawer.getDataForDeleteTileFromLocation()?.locationIdArray.some(v => v === locationId)))
        ) {
            show(getText(TextType.A0267));
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
