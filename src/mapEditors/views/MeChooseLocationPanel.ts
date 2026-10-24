import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocationsConstants from "../../locations/Constants.ts";
import * as LocationsUtils from "../../locations/Utils.ts";
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

export interface OpenData {
    needChangeLocationVisibility    : boolean;
    currentGroupedLocationIds       : number[];
    war                             : BaseWarInterfaceIBwWar.IBwWar;
    getTitleText                    : () => string;
    callback                        : (locationIdArray: number[]) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupSelectAll!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgSelectAll!     : UiInterfacesIUiImage.IUiImage;
    private readonly _labelSelectAll!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listLocation!     : UiInterfacesIUiScrollList.IUiScrollList<DataForLocationRenderer>;

    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTips!        : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,              callback: this._onTouchedBtnCancel },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },
            { ui: this._groupSelectAll,         callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();
        });
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
        list.setSelectedItemIndexes(isSelectAll ? HelpersCollection.createRange(0, (list.getBoundDataArray()?.length ?? 0) + 1, 1) : []);
        this.updateImgSelectAll();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callback(HelpersCollection.getNonNullElements(this._listLocation.getSelectedDataArray()?.map(v => v?.locationId) ?? []));
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0781),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? LangUtils.getText(LangConstants.TextType.Location));
        this._labelSelectAll.setLangText(LangConstants.TextType.B0761);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
        this._btnCancel.setLangText(LangConstants.TextType.B0154);
        this._labelTips.setLangText(LangConstants.TextType.A0982);

        this._groupSelectAll.arrangeItems();
    }

    public updateImgSelectAll(): void {
        this._imgSelectAll.setIsVisible((this._listLocation.getSelectedItems()?.length ?? 0) >= LocationsConstants.AllLocationsCount);
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
        const locationIdList                = LocationsUtils.decode(openData.currentGroupedLocationIds);
        const selectedItemIndexes           : number[] = [];
        let index                           = 0;
        const dataArray                     : DataForLocationRenderer[] = [];
        for (let locationId = LocationsConstants.MinId; locationId <= LocationsConstants.MaxId; ++locationId) {
            dataArray.push({
                war                             : war,
                needChangeLocationVisibility    : needChangeLocationVisibility,
                locationId                      : locationId,
                useCount                        : inUseDict.get(locationId) ?? 0,
                noEntryCount                    : noEntryDict.get(locationId) ?? 0,
                panel                           : this,
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

interface DataForLocationRenderer extends UiTypesUiListItemData.UiListItemData {
    war                             : BaseWarInterfaceIBwWar.IBwWar;
    needChangeLocationVisibility    : boolean;
    locationId                      : number;
    useCount                        : number;
    noEntryCount                    : number;
    panel                           : Panel;
}
class LocationRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
    private readonly _layoutInfo!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelLocationId!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutUsage!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelInUse!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNoEntry!     : UiInterfacesIUiLabel.IUiLabel;

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
