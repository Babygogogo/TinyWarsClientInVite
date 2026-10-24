import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorModelMeTypes from "../../mapEditor/model/MeTypes.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";

export interface OpenData {
    currentBaseType?    : number;
    gameConfig          : GameConfigGcData.GcData;
    callback            : (baseType: number, shapeId: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _listType!         : UiInterfacesIUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _listTileBase!     : UiInterfacesIUiScrollList.IUiScrollList<DataForTileBaseRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,  callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listType.setItemRendererClass(TypeRenderer);
        this._listTileBase.setItemRendererClass(TileBaseRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listType.removeAllItems(),
            this._listTileBase.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newType: number | null, needScroll: boolean): Promise<void> {
        const listType  = this._listType;
        const index     = HelpersMisc.getExisted(listType.getRevisedFirstIndex(v => v?.baseType === newType));
        listType.setSelectedItemIndex(index);
        if (needScroll) {
            listType.scrollToItem(index);
        }

        await this._updateListTileBase();
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

        await this._updateListType(this.getOpenData()?.currentBaseType);
        await this._updateListTileBase();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.TileBase);
    }

    private _createDataForListTileBase(): DataForTileBaseRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const gameConfig    = openData.gameConfig;
        const callback      = openData.callback;
        const baseType      = this._listType.getFirstSelectedData()?.baseType;
        const dataList      : DataForTileBaseRenderer[] = [];
        if (baseType != null) {
            const cfg = HelpersMisc.getExisted(gameConfig.getTileBaseCfg(baseType));
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                dataList.push({
                    panel               : this,
                    gameConfig          : gameConfig,
                    callback            : callback,
                    dataForDrawTileBase : {
                        baseType    : baseType,
                        shapeId     : shapeId,
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
        for (const cfg of gameConfig.getAllEnabledTileBaseCfgArray()) {
            dataArray.push({
                baseType        : cfg.tileBaseTypeId,
                gameConfig      : gameConfig,
                panel           : this,
            });
        }

        const list = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.baseType === selectedType) ?? (dataArray.length ? 0 : -1));
    }

    private async _updateListTileBase(): Promise<void> {
        await this._listTileBase.bindData(this._createDataForListTileBase(), true);
    }
}

interface DataForTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    baseType        : number;
    gameConfig      : GameConfigGcData.GcData;
    panel           : Panel;
}
class TypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelType.setText(LangUtils.getTileBaseName(openData.baseType, openData.gameConfig) ?? LangConstants.UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.baseType, false);
    }
}

interface DataForTileBaseRenderer extends UiTypesUiListItemData.UiListItemData {
    dataForDrawTileBase : MapEditorModelMeTypes.DataForDrawTileBase;
    panel               : Panel;
    gameConfig          : GameConfigGcData.GcData;
    callback            : (baseType: number, shapeId: number) => void;
}
class TileBaseRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTileBaseRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _conTileView!  : UiInterfacesIUiContainer.IUiContainer;

    private _tileView   = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
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

        const dataForDrawTileBase = openData.dataForDrawTileBase;
        this._tileView.init({
            tileBaseShapeId         : dataForDrawTileBase.shapeId,
            tileBaseType            : dataForDrawTileBase.baseType,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectShapeId       : null,
            tileObjectType          : null,
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : openData.gameConfig,
        });
        this._tileView.updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel                 = openData.panel;
        const dataForDrawTileBase   = openData.dataForDrawTileBase;
        openData.callback(dataForDrawTileBase.baseType, dataForDrawTileBase.shapeId);
        panel.closePanel();
    }
}
