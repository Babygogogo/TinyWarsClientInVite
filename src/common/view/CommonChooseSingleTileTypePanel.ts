import { getDefaultSkinId } from "../../forceSkins/Utils.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getTileName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { Dimension } from "../../stages/Constants.ts";
import { Executor } from "../../tween/Executor.ts";
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
    gameConfig          : GameConfig;
    currentTileType     : number;
    tileTypeArray       : number[];
    callback            : (tileType: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _btnClose!     : IUiButton;
    private readonly _labelTips!    : IUiLabel;

    private readonly _listType!     : IUiScrollList<DataForTypeRenderer>;

    private _selectedTileType       : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listType.setItemRendererClass(TypeRenderer);

    }
    protected override async _doApplyOpenData(): Promise<void> {
        const currentTileType = this.getOpenData()?.currentTileType;
        if (currentTileType == null) {
            return;
        }

        this._selectedTileType = currentTileType;
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listType.removeAllItems();

        await super._onClosed();
    }

    public checkIsTileTypeSelected(tileType: number): boolean {
        return this._selectedTileType === tileType;
    }
    public updateOnSelectedTileType(tileType: number): void {
        const oldTileType = this._selectedTileType;
        if (oldTileType === tileType) {
            this.getOpenData()?.callback(tileType);
            this.closePanel();
        } else {
            this._selectedTileType = tileType;

            const list      = this._listType;
            const dataArray = list.getBoundDataArray() ?? [];
            const oldIndex  = dataArray.findIndex(v => v?.tileType === oldTileType);
            const newIndex  = dataArray.findIndex(v => v?.tileType === tileType);
            if (oldIndex >= 0) {
                list.updateSingleData(oldIndex, dataArray[oldIndex]);
            }
            if (newIndex >= 0) {
                list.updateSingleData(newIndex, dataArray[newIndex]);
            }
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListType();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0516);
        this._labelTips.setLangText(TextType.B1249);
    }
    private async _updateListType(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForTypeRenderer[] = [];
        for (const newTileType of openData.tileTypeArray) {
            dataArray.push({
                gameConfig  : gameConfig,
                tileType    : newTileType,
                panel       : this,
                callback    : openData.callback,
            });
        }
        await this._listType.bindData(dataArray);

        const rowCount = Math.ceil(dataArray.length / 4);
        this._group.setUnscaledManualHeight(getValueInRange({
            rawValue    : rowCount * 36 + (rowCount - 1) * 10 + 80,
            minValue    : 200,
            maxValue    : Dimension.DesignMinHeight,
        }));
    }
}

interface DataForTypeRenderer extends UiListItemData {
    gameConfig  : GameConfig;
    tileType    : number;
    callback    : (tileType: number) => void;
    panel       : Panel;
}
class TypeRenderer extends UiListItemRenderer<DataForTypeRenderer> {
    private readonly _conTileView!  : IUiContainer;
    private readonly _imgSelected!  : IUiImage;

    private readonly _layoutName!   : IUiLayout;
    private readonly _labelType!    : IUiLabel;
    private readonly _labelId!      : IUiLabel;

    private readonly _tileView      = new (getUiTileViewClass())();

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
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLabelId();
        this._updateLabelType();
        this._updateTileView();
        this._updateImgSelected();
    }

    public onItemTapEvent(): void {
        const data = this.getOpenData();
        data?.panel.updateOnSelectedTileType(data.tileType);
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelType.setText(getTileName(openData.tileType, openData.gameConfig) ?? UndefinedError);
        this._layoutName.arrangeItems();
    }
    private _updateLabelId(): void {
        this._labelId.setText(`#${this.getOpenData()?.tileType}`);
        this._layoutName.arrangeItems();
    }
    private _updateTileView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileType      = openData.tileType;
        const gameConfig    = openData.gameConfig;
        this._tileView.init({
            tileBaseType            : getExisted(gameConfig.getTileBaseTypeByTileType(tileType)),
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : getExisted(gameConfig.getTileObjectTypeByTileType(tileType)),
            tileObjectShapeId       : 0,
            skinId                  : getDefaultSkinId(PlayerIndex.Neutral),
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
    }
    private _updateImgSelected(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgSelected.setIsVisible(openData.panel.checkIsTileTypeSelected(openData.tileType));
    }
}
