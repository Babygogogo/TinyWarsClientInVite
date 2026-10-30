import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    createRange,
    getNonNullElements,
} from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import {
    AllLocationsCount,
    MinId,
    MaxId,
} from "../../locations/Constants.ts";
import { decode } from "../../locations/Utils.ts";
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

export interface OpenData {
    needChangeLocationVisibility    : boolean;
    currentGroupedLocationIds       : number[];
    war                             : IBwWar;
    getTitleText                    : () => string;
    callback                        : (locationIdArray: number[]) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnHelp!          : IUiButton;

    private readonly _groupSelectAll!   : IUiLayout;
    private readonly _imgSelectAll!     : IUiImage;
    private readonly _labelSelectAll!   : IUiLabel;
    private readonly _listLocation!     : IUiScrollList<DataForLocationRenderer>;

    private readonly _btnConfirm!       : IUiButton;
    private readonly _btnCancel!        : IUiButton;
    private readonly _labelTips!        : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,              callback: this._onTouchedBtnCancel },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },
            { ui: this._groupSelectAll,         callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();
        });
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
        list.setSelectedItemIndexes(isSelectAll ? createRange(0, (list.getBoundDataArray()?.length ?? 0) + 1, 1) : []);
        this.updateImgSelectAll();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callback(getNonNullElements(this._listLocation.getSelectedDataArray()?.map(v => v?.locationId) ?? []));
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
        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0781),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? getText(TextType.Location));
        this._labelSelectAll.setLangText(TextType.B0761);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
        this._labelTips.setLangText(TextType.A0982);

        this._groupSelectAll.arrangeItems();
    }

    public updateImgSelectAll(): void {
        this._imgSelectAll.setIsVisible((this._listLocation.getSelectedItems()?.length ?? 0) >= AllLocationsCount);
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
        const locationIdList                = decode(openData.currentGroupedLocationIds);
        const selectedItemIndexes           : number[] = [];
        let index                           = 0;
        const dataArray                     : DataForLocationRenderer[] = [];
        for (let locationId = MinId; locationId <= MaxId; ++locationId) {
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

interface DataForLocationRenderer extends UiListItemData {
    war                             : IBwWar;
    needChangeLocationVisibility    : boolean;
    locationId                      : number;
    useCount                        : number;
    noEntryCount                    : number;
    panel                           : Panel;
}
class LocationRenderer extends UiListItemRenderer<DataForLocationRenderer> {
    private readonly _layoutInfo!       : IUiLayout;
    private readonly _labelLocationId!  : IUiLabel;

    private readonly _layoutUsage!      : IUiLayout;
    private readonly _labelInUse!       : IUiLabel;
    private readonly _labelNoEntry!     : IUiLabel;

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
