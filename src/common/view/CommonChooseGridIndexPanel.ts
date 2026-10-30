import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../../lang/Utils.ts";
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
    currentGridIndexArray   : GridIndex[];
    mapSize                 : MapSize;
    callbackOnConfirm       : (teamIndexArray: GridIndex[]) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;

    private readonly _layoutTitle!      : IUiLayout;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelMapSize!     : IUiLabel;

    private readonly _btnClose!         : IUiButton;
    private readonly _btnAdd!           : IUiButton;
    private readonly _btnDeleteAll!     : IUiButton;

    private readonly _listLocation!     : IUiScrollList<DataForLocationRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnAdd,             callback: this._onTouchedBtnAdd },
            { ui: this._btnDeleteAll,       callback: this._onTouchedBtnDeleteAll },
            { ui: this._btnClose,           callback: this._onTouchedBtnClose },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listLocation.setItemRendererClass(GridIndexRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateListLocation();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listLocation.removeAllItems();

        await super._onClosed();
    }

    public async updateOnDeleteGridIndex(gridIndex: GridIndex): Promise<void> {
        const list      = this._listLocation;
        const dataArray = getNonNullElements(list.getBoundDataArray() ?? []);
        await list.bindData(dataArray.filter(v => !gridIndex.checkIsEqual(v.gridIndex)));
    }

    private _onTouchedBtnAdd(): void {
        const mapSize = this.getOpenData()?.mapSize;
        if (mapSize == null) {
            return;
        }

        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B1071),
            minValue        : 0,
            maxValue        : mapSize.getWidth() - 1,
            currentValue    : 0,
            callback        : x => {
                openPanel(getDict().CommonInputIntegerPanel, {
                    getTitle           : () => getText(TextType.B1072),
                    minValue        : 0,
                    maxValue        : mapSize.getHeight() - 1,
                    currentValue    : 0,
                    callback        : async y => {
                        const list              = this._listLocation;
                        const gridIndexArray    = getNonNullElements(list.getBoundDataArray()?.map(v => v?.gridIndex) ?? []);
                        const gridIndex         = new GridIndex(x, y);
                        if (gridIndexArray.some(v => v.checkIsEqual(gridIndex))) {
                            show(getText(TextType.A0268));
                            return;
                        }

                        gridIndexArray.push(gridIndex);
                        await list.bindData(gridIndexArray.sort(gridIndexSorter).map(v => { return { gridIndex: v, panel: this }; }));
                    },
                });
            },
        });
    }
    private _onTouchedBtnDeleteAll(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0851),
            callback: () => this._listLocation.removeAllItems(),
        });
    }
    private _onTouchedBtnClose(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getContent             : () => getText(TextType.A0418),
            getTextForConfirm      : () => getText(TextType.Yes),
            getTextForCancel       : () => getText(TextType.No),
            callback            : () => {
                this.getOpenData()?.callbackOnConfirm(getNonNullElements(this._listLocation.getBoundDataArray()?.map(v => v?.gridIndex) ?? []).sort(gridIndexSorter));
                this.closePanel();
            },
            callbackOnCancel    : () => this.closePanel(),
            showButtonClose     : true,
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getFormattedText(TextType.F0092, getText(TextType.B0531)));
        this._btnAdd.setLangText(TextType.B0320);
        this._btnDeleteAll.setLangText(TextType.B0762);
        this._layoutTitle.arrangeItems();

        this._updateLabelMapSize();
    }

    private async _updateListLocation(): Promise<void> {
        const dataArray : DataForLocationRenderer[] = [];
        for (const gridIndex of this.getOpenData()?.currentGridIndexArray.concat().sort(gridIndexSorter) ?? []) {
            dataArray.push({
                gridIndex   : gridIndex,
                panel       : this,
            });
        }

        await this._listLocation.bindData(dataArray);
    }

    private _updateLabelMapSize(): void {
        const mapSize = this.getOpenData()?.mapSize;
        this._labelMapSize.setText(`(${getText(TextType.B0300)}: ${mapSize?.getWidth()} x ${mapSize?.getHeight()})`);
        this._layoutTitle.arrangeItems();
    }
}

interface DataForLocationRenderer extends UiListItemData {
    gridIndex   : GridIndex;
    panel       : Panel;
}
class GridIndexRenderer extends UiListItemRenderer<DataForLocationRenderer> {
    private readonly _btnDelete!    : IUiButton;
    private readonly _labelName!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDelete, callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => {
                openData.panel.updateOnDeleteGridIndex(openData.gridIndex);
            },
        });
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        const gridIndex = this.getOpenData()?.gridIndex;
        this._labelName.setText(`${gridIndex?.getX()}, ${gridIndex?.getY()}`);
    }

    private _updateComponentsForLanguage(): void {
        this._btnDelete.setLangText(TextType.B0220);
    }
}

function gridIndexSorter(g1: GridIndex, g2: GridIndex): number {
    const x1 = g1.getX();
    const x2 = g2.getX();
    if (x1 !== x2) {
        return x1 - x2;
    } else {
        return g1.getY() - g2.getY();
    }
}
