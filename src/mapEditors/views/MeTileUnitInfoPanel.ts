import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getUnitViewClass, getUnitClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { closePanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getWar } from "../../mapEditor/model/MeModel.ts";
import type { DataForDrawUnit } from "../../mapEditor/model/MeTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ObjectTypeId } from "../../tiles/constants/Common.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUiTileViewClass } from "../../ui/utils/UiFactory.ts";
import { createDefault } from "../../units/utils/Serialization.ts";

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _scrData!              : IUiScroller<IUiLayout>;
    private readonly _groupData!            : IUiLayout;
    private readonly _listTile!             : IUiScrollList<DataForTileRenderer>;
    private readonly _listUnit!             : IUiScrollList<DataForUnitRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
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
        this._labelTitle.setLangText(TextType.B1244);
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

            if (tileObjectType == ObjectTypeId.Empty) {
                if (dictForTileBases.has(tileBaseType)) {
                    ++getExisted(dictForTileBases.get(tileBaseType)).count;
                } else {
                    dictForTileBases.set(tileBaseType, {
                        baseType    : tileBaseType,
                        objectType  : null,
                        count       : 1,
                        tileType,
                        playerIndex,
                        gameConfig,
                    });
                }
            } else {
                if (dictForTileObjects.has(tileObjectType)) {
                    ++getExisted(dictForTileObjects.get(tileObjectType)).count;
                } else {
                    dictForTileObjects.set(tileObjectType, {
                        baseType    : null,
                        objectType  : tileObjectType,
                        count       : 1,
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

            const subDict       = getExisted(dict.get(unitType));
            const playerIndex   = unit.getPlayerIndex();
            if (subDict.has(playerIndex)) {
                ++getExisted(subDict.get(playerIndex)).count;
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

interface DataForTileRenderer extends UiListItemData {
    baseType    : number | null;
    objectType  : number | null;
    count       : number;
    tileType    : number;
    playerIndex : number;
    gameConfig  : GameConfig;
}
class TileRenderer extends UiListItemRenderer<DataForTileRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _labelNum!     : IUiLabel;
    private readonly _conTileView!  : IUiContainer;

    private _tileView   = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
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
            tileBaseType            : openData.baseType,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : openData.objectType,
            tileObjectShapeId       : 0,
            skinId                  : openData.playerIndex,
            overridingSkinId        : undefined,
            gameConfig              : openData.gameConfig,
        });
        this._tileView.updateView();
    }
}

interface DataForUnitRenderer extends UiListItemData {
    count           : number;
    dataForDrawUnit : DataForDrawUnit;
}
class UnitRenderer extends UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _labelNum!     : IUiLabel;
    private readonly _conUnitView!  : IUiContainer;

    private _unitView   = new (getUnitViewClass())();

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

        const war       = getExisted(getWar());
        const gcData    = war.getGcData();
        const unit      = new (getUnitClass())();
        unit.init(createDefault({
            gridIndex   : { x: 0, y: 0 },
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

        closePanel(getDict().MeChooseUnitPanel);
        getExisted(getWar()).getDrawer().setModeDrawUnit(openData.dataForDrawUnit);
    }
}
