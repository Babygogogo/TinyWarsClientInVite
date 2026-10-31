import {
    Ui_Components_UiTileView,
    Units_Unit,
    Units_UnitView,
    type GameConfigs_GameConfig,
    GamePanels_Manager,
    GamePanels_Dict,
    Helpers_Misc,
    MapEditor_Model_MeModel,
    Tiles_Constants_Common,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Model_MeTypes,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    Units_Utils_Serialization,
} from "../../internal.ts";

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _scrData!              : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupData!            : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _listTile!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileRenderer>;
    private readonly _listUnit!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "UnitAndTileTextureVersionChanged",    callback : this._onNotifyUnitAndTileTextureVersionChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listTile.setItemRendererClass(TileRenderer);
        this._listUnit.setItemRendererClass(UnitRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listTile.removeAllItems(),
            this._listUnit.removeAllItems(),
        ]);

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyUnitAndTileTextureVersionChanged(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._updateListTile();
        await this._updateListUnit();
        this._groupData.arrangeItems();
        this._scrData.updateOnItemsChanged();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1244);
    }

    private async _updateListTile(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dictForTileBases      = new Map<number, DataForTileRenderer>();
        const dictForTileObjects    = new Map<number, DataForTileRenderer>();
        const gameConfig            = war.getGcData();
        for (const tile of war.getTileMap().getAllTiles()) {
            const tileObjectType    = tile.getObjectType();
            const tileBaseType      = tile.getBaseType();
            const tileType          = tile.getTileTypeId();
            const playerIndex       = tile.getPlayerIndex();

            if (tileObjectType == Tiles_Constants_Common.ObjectTypeId.Empty) {
                if (dictForTileBases.has(tileBaseType)) {
                    ++Helpers_Misc.getExisted(dictForTileBases.get(tileBaseType)).count;
                } else {
                    dictForTileBases.set(tileBaseType, {
                        baseType   : tileBaseType,
                        objectType : null,
                        count      : 1,
                        tileType,
                        playerIndex,
                        gameConfig,
                    });
                }
            } else {
                if (dictForTileObjects.has(tileObjectType)) {
                    ++Helpers_Misc.getExisted(dictForTileObjects.get(tileObjectType)).count;
                } else {
                    dictForTileObjects.set(tileObjectType, {
                        baseType   : null,
                        objectType : tileObjectType,
                        count      : 1,
                        tileType,
                        playerIndex,
                        gameConfig,
                    });
                }
            }
        }

        const dataList : DataForTileRenderer[] = [];
        for (const [, v] of dictForTileBases) {
            dataList.push(v);
        }
        for (const [, v] of dictForTileObjects) {
            dataList.push(v);
        }
        await this._listTile.bindData(dataList.sort((v1, v2) => {
            if (v1.tileType !== v2.tileType) {
                return v1.tileType - v2.tileType;
            } else {
                return v1.playerIndex - v2.playerIndex;
            }
        }));
    }

    private async _updateListUnit(): Promise<void> {
        const dict = new Map<number, Map<number, DataForUnitRenderer>>();
        for (const unit of this.getOpenData()?.war.getUnitMap().getAllUnits() ?? []) {
            const unitType = unit.getUnitType();
            if (!dict.has(unitType)) {
                dict.set(unitType, new Map());
            }

            const subDict       = Helpers_Misc.getExisted(dict.get(unitType));
            const playerIndex   = unit.getPlayerIndex();
            if (subDict.has(playerIndex)) {
                ++Helpers_Misc.getExisted(subDict.get(playerIndex)).count;
            } else {
                subDict.set(playerIndex, {
                    count           : 1,
                    dataForDrawUnit : {
                        unitType,
                        playerIndex,
                    },
                });
            }
        }

        const dataList: DataForUnitRenderer[] = [];
        for (const [, subDict] of dict) {
            for (const [, v] of subDict) {
                dataList.push(v);
            }
        }
        await this._listUnit.bindData(dataList.sort((v1, v2) => {
            const d1 = v1.dataForDrawUnit;
            const d2 = v2.dataForDrawUnit;
            const p1 = d1.playerIndex;
            const p2 = d2.playerIndex;
            if (p1 !== p2) {
                return p1 - p2;
            } else {
                return d1.unitType - d2.unitType;
            }
        }));
    }
}

interface DataForTileRenderer extends Ui_Types_UiListItemData.UiListItemData {
    baseType    : number | null;
    objectType  : number | null;
    count       : number;
    tileType    : number;
    playerIndex : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
}
class TileRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelNum!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private _tileView   = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "TileAnimationTick",  callback : this._onNotifyTileAnimationTick },
        ]);

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
        this._labelNum.setText(`${openData.count}`);
        this._tileView.init({
            tileBaseType          : openData.baseType,
            tileBaseShapeId       : 0,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectType        : openData.objectType,
            tileObjectShapeId     : 0,
            skinId                : openData.playerIndex,
            overridingSkinId      : undefined,
            gameConfig            : openData.gameConfig,
        });
        this._tileView.updateView();
    }
}

interface DataForUnitRenderer extends Ui_Types_UiListItemData.UiListItemData {
    count           : number;
    dataForDrawUnit : MapEditor_Model_MeTypes.DataForDrawUnit;
}
class UnitRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelNum!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conUnitView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private _unitView   = new Units_UnitView.UnitView();

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
        this._conUnitView.addUiChild(this._unitView);
    }
    protected override async _onClosed(): Promise<void> {
        this._unitView.stopRunningView();

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawUnit = openData.dataForDrawUnit;
        this._labelNum.setText(`${openData.count}`);

        const war       = Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar());
        const gcData    = war.getGcData();
        const unit      = new Units_Unit.Unit();
        unit.init(Units_Utils_Serialization.createDefault({
            gridIndex   : { x : 0, y : 0 },
            unitId      : 0,
            unitTypeId  : dataForDrawUnit.unitType,
            playerIndex : dataForDrawUnit.playerIndex,
            gcData      : gcData,
        }), gcData);
        unit.startRunning(war);

        const unitView = this._unitView;
        unitView.init(unit);
        unitView.startRunningView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().MeChooseUnitPanel);
        Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()).getDrawer().setModeDrawUnit(openData.dataForDrawUnit);
    }
}
