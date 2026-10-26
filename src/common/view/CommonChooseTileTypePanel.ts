import type { GcData } from "../../gameConfigs/GcData.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getTileName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUiTileViewClass } from "../../ui/utils/UiFactory.ts";

export interface OpenData {
    gameConfig              : GcData;
    currentTileTypeArray    : number[];
    availableTileTypeArray  : number[];
    getHelpText             : (() => string) | null;
    callbackOnConfirm       : (tileTypeArray: number[]) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnClose!             : IUiButton;

    private readonly _groupSelectAll!       : IUiLayout;
    private readonly _labelSelectAll!       : IUiLabel;
    private readonly _imgSelectAll!         : IUiImage;

    private readonly _groupSelected!        : IUiLayout;
    private readonly _labelSelectedTitle!   : IUiLabel;
    private readonly _labelSelected!        : IUiLabel;

    private readonly _listTileType!         : IUiScrollList<DataForTileTypeRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    private readonly _btnConfirm!           : IUiButton;

    private readonly _selectedNumberSet     = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupSelectAll,     callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listTileType.setItemRendererClass(TileTypeRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listTileType.removeAllItems();

        await super._onClosed();
    }

    public checkHasSelectedNumber(num: number): boolean {
        return this._selectedNumberSet.has(num);
    }
    public updateOnSelectNumber(num: number): void {
        const selectedNumberSet = this._selectedNumberSet;
        if (selectedNumberSet.has(num)) {
            selectedNumberSet.delete(num);
        } else {
            selectedNumberSet.add(num);
        }

        const list      = this._listTileType;
        const dataArray = list.getBoundDataArray() ?? [];
        const index     = dataArray.findIndex(v => v?.tileType === num);
        list.updateSingleData(index, dataArray[index]);
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _onTouchedGroupSelectAll(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();

        const list      = this._listTileType;
        const dataArray = list.getBoundDataArray() ?? [];
        if (!this._imgSelectAll.getIsVisible()) {
            for (const data of dataArray) {
                const tileType = data?.tileType;
                if (tileType != null) {
                    selectedNumberSet.add(tileType);
                }
            }
        }
        for (let i = 0; i < dataArray.length; ++i) {
            list.updateSingleData(i, dataArray[i]);
        }

        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callbackOnConfirm([...this._selectedNumberSet].sort((v1, v2) => v1 - v2) ?? []);
        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        const getHelpText = this.getOpenData()?.getHelpText;
        if (getHelpText) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => getHelpText(),
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getFormattedText(TextType.F0092, getText(TextType.B0718)));
        this._labelSelectAll.setLangText(TextType.B0761);
        this._labelNoData.setLangText(TextType.B0278);
        this._labelSelectedTitle.setLangText(TextType.B1274);
        this._btnConfirm.setLangText(TextType.B0026);

        this._groupSelected.arrangeItems();
        this._groupSelectAll.arrangeItems();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const numberArray       = openData.currentTileTypeArray;
        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();
        for (const num of numberArray) {
            selectedNumberSet.add(num);
        }

        this._btnHelp.setIsVisible(!!openData.getHelpText);
        await this._resetList();
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private async _resetList(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForTileTypeRenderer[] = [];
        for (const num of openData.availableTileTypeArray.concat().sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                tileType            : num,
                gameConfig          : gameConfig,
                panel               : this,
            });
        }

        const length                = dataArray.length;
        this._labelNoData.setIsVisible(!length);
        await this._listTileType.bindData(dataArray);

        const rowsCount = Math.ceil(length / 4);
        this._group.setUnscaledManualHeight(getValueInRange({
            rawValue    : Math.max(0, 34 * rowsCount + 6 * (rowsCount - 1)) + 130,
            minValue    : 210,
            maxValue    : Dimension.DesignMinHeight,
        }));
    }
    private _updateGroupSelectAll(): void {
        const tileTypeArray = getNonNullElements(this._listTileType.getBoundDataArray()?.map(v => v?.tileType) ?? []);
        const group         = this._groupSelectAll;
        if (!tileTypeArray.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._imgSelectAll.setIsVisible((!!tileTypeArray.length) && (tileTypeArray.every(v => this._selectedNumberSet.has(v))));
        }
    }
    private _updateLabelSelected(): void {
        this._labelSelected.setText(`${this._selectedNumberSet.size} / ${this.getOpenData()?.availableTileTypeArray.length}`);
        this._groupSelected.arrangeItems();
    }
}

interface DataForTileTypeRenderer extends UiListItemData {
    tileType    : number;
    gameConfig  : GcData;
    panel       : Panel;
}
class TileTypeRenderer extends UiListItemRenderer<DataForTileTypeRenderer> {
    private readonly _groupSelect!      : IUiContainer;
    private readonly _imgSelected!      : IUiImage;

    private readonly _conTileView!      : IUiContainer;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelTileType!    : IUiLabel;
    private readonly _labelTileName!    : IUiLabel;

    private readonly _tileView          = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const conTileView   = this._conTileView;
        const tileView      = this._tileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }
    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectNumber(openData.tileType);
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();

        this._updateTileView();
    }

    private _updateComponentsForLanguage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileType = openData.tileType;
        this._labelTileType.setText(`#${tileType}`);
        this._labelTileName.setText(getTileName(tileType, openData.gameConfig) ?? UndefinedError);
        this._layoutName.arrangeItems();
    }

    private _updateTileView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileType      = openData.tileType;
        const gameConfig    = openData.gameConfig;
        const objectType    = getExisted(gameConfig.getTileObjectTypeByTileType(tileType));
        const baseType      = getExisted(gameConfig.getTileBaseTypeByTileType(tileType));
        this._imgSelected.setIsVisible(openData.panel.checkHasSelectedNumber(tileType));

        this._tileView.init({
            tileBaseType            : baseType,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : objectType,
            tileObjectShapeId       : 0,
            skinId                  : PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
    }
}
