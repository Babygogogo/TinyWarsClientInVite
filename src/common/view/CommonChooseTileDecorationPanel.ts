import { GcData } from "../../gameConfig/GcData.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getTileDecorationName } from "../../lang/Utils.ts";
import type { DataForDrawTileDecoration } from "../../mapEditor/model/MeTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUiTileViewClass } from "../../ui/utils/UiFactory.ts";

export interface OpenData {
    currentDecorationType?  : number;
    gameConfig              : GcData;
    callback                : (decorationType: number, shapeId: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _listType!                 : IUiScrollList<DataForTypeRenderer>;
    private readonly _listTileDecoration!       : IUiScrollList<DataForTileDecorationRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,      callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listType.setItemRendererClass(TypeRenderer);
        this._listTileDecoration.setItemRendererClass(TileDecorationRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listType.removeAllItems(),
            this._listTileDecoration.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newType: number | null, needScroll: boolean): Promise<void> {
        const listType  = this._listType;
        const index     = getExisted(listType.getRevisedFirstIndex(v => v?.decorationType === newType));
        listType.setSelectedItemIndex(index);
        if (needScroll) {
            listType.scrollToItem(index);
        }

        await this._updateListTileDecoration();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateOnOpenDataChanged(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._updateListType(this.getOpenData()?.currentDecorationType);
        await this._updateListTileDecoration();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.TileDecoration);
    }

    private _createDataForListTileDecoration(): DataForTileDecorationRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const gameConfig        = openData.gameConfig;
        const callback          = openData.callback;
        const decorationType    = this._listType.getFirstSelectedData()?.decorationType;
        const dataList          : DataForTileDecorationRenderer[] = [];
        if (decorationType != null) {
            const cfg = getExisted(GcData.getTileDecorationCfg(decorationType));
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                dataList.push({
                    panel                       : this,
                    gameConfig                  : gameConfig,
                    callback                    : callback,
                    dataForDrawTileDecoration   : {
                        decorationType  : decorationType,
                        shapeId         : shapeId,
                    },
                });
            }

        }

        return dataList;
    }

    private async _updateListType(selectedType: number | undefined): Promise<void> {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const dataArray: DataForTypeRenderer[] = [];
        for (const cfg of GcData.getAllTileDecorationCfgArray()) {
            dataArray.push({
                decorationType  : cfg.tileDecorationTypeId,
                gameConfig      : gameConfig,
                panel           : this,
            });
        }

        const list = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.decorationType == selectedType));
    }

    private async _updateListTileDecoration(): Promise<void> {
        await this._listTileDecoration.bindData(this._createDataForListTileDecoration(), true);
    }
}

interface DataForTypeRenderer extends UiListItemData {
    decorationType  : number;
    gameConfig      : GcData;
    panel           : Panel;
}
class TypeRenderer extends UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : IUiLabel;
    private readonly _imgBg!        : IUiImage;
    private readonly _imgSelected!  : IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
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

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        this._labelType.setText(getTileDecorationName(openData.decorationType, openData.gameConfig) ?? UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.decorationType, false);
    }
}

interface DataForTileDecorationRenderer extends UiListItemData {
    dataForDrawTileDecoration   : DataForDrawTileDecoration;
    panel                       : Panel;
    gameConfig                  : GcData;
    callback                    : (decorationType: number, shapeId: number) => void;
}
class TileDecorationRenderer extends UiListItemRenderer<DataForTileDecorationRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _conTileView!  : IUiContainer;
    private readonly _labelName!    : IUiLabel;

    private _tileView   = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
        tileView.startRunningView();
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawTileDecoration = openData.dataForDrawTileDecoration;
        const shapeId                   = dataForDrawTileDecoration.shapeId;
        this._labelName.setText(`${shapeId}`);

        const tileView = this._tileView;
        tileView.init({
            tileBaseShapeId         : null,
            tileBaseType            : null,
            tileDecorationType      : dataForDrawTileDecoration.decorationType,
            tileDecorationShapeId   : shapeId,
            tileObjectShapeId       : null,
            tileObjectType          : null,
            skinId                  : PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : openData.gameConfig,
        });
        tileView.updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const data = openData.dataForDrawTileDecoration;
        openData.callback(data.decorationType, data.shapeId);
        openData.panel.closePanel();
    }
}
