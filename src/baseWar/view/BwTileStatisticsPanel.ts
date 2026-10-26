import type { IBwWar } from "../interface/IBwWar.ts";
import { GcData } from "../../gameConfigs/GcData.ts";
import { TextType } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { ITile } from "../../tiles/ITile.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUiTileViewClass } from "../../ui/utils/UiFactory.ts";
import { checkAndAddAutoSizerInfo } from "../../ui/utils/UiSizerHelpers.ts";
import { getAllTilesVisibleToTeams } from "../../visibilities/Utils.ts";

export interface OpenData {
    war             : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;

    private readonly _groupTitle!               : IUiContainer;
    private readonly _labelTotal!               : IUiLabel;
    private readonly _labelP0!                  : IUiLabel;
    private readonly _labelP1!                  : IUiLabel;
    private readonly _labelP2!                  : IUiLabel;
    private readonly _labelP3!                  : IUiLabel;
    private readonly _labelP4!                  : IUiLabel;
    private readonly _labelP5!                  : IUiLabel;
    private readonly _labelP6!                  : IUiLabel;
    private readonly _labelP7!                  : IUiLabel;
    private readonly _labelP8!                  : IUiLabel;

    private readonly _listTile!                 : IUiScrollList<DataForTileRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._labelP0.setText(`P0`);
        this._labelP1.setText(`P1`);
        this._labelP2.setText(`P2`);
        this._labelP3.setText(`P3`);
        this._labelP4.setText(`P4`);
        this._labelP5.setText(`P5`);
        this._labelP6.setText(`P6`);
        this._labelP7.setText(`P7`);
        this._labelP8.setText(`P8`);

        this._listTile.setItemRendererClass(UnitRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listTile.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1296);
        this._labelTotal.setLangText(TextType.B1295);

        checkAndAddAutoSizerInfo(this._groupTitle, false);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForTiles(true);
    }

    private async _updateComponentsForTiles(resetScroll: boolean): Promise<void> {
        const list = this._listTile;
        await list.bindData(this._createDataForList(), resetScroll);

        const playersCountUnneutral = this.getOpenData()?.war.getPlayersCountUnneutral() ?? 0;
        this._labelP8.setIsVisible(playersCountUnneutral >= 8);
        this._labelP7.setIsVisible(playersCountUnneutral >= 7);
        this._labelP6.setIsVisible(playersCountUnneutral >= 6);
        this._labelP5.setIsVisible(playersCountUnneutral >= 5);
        this._labelP4.setIsVisible(playersCountUnneutral >= 4);
        this._labelP3.setIsVisible(playersCountUnneutral >= 3);
    }

    private _createDataForList(): DataForTileRenderer[] {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return [];
        }

        const gameConfig            = war.getGcData();
        const playersCountUnneutral = war.getPlayersCountUnneutral();
        const allTiles              = war.getTileMap().getAllTiles();
        const visibleTileSet        = getAllTilesVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
        const allTilesForPlayers    : ITile[][] = [];
        for (let i = 0; i <= playersCountUnneutral; ++i) {
            allTilesForPlayers.push([]);
        }
        for (const tile of allTiles) {
            if ((visibleTileSet.has(tile)) || (tile.getTemplateCfg().getIsAlwaysShowOwner())) {
                allTilesForPlayers[tile.getPlayerIndex()].push(tile);
            } else {
                allTilesForPlayers[0].push(tile);
            }
        }

        const dataArray : DataForTileRenderer[] = [];
        let index       = 0;
        for (const tileType of gameConfig.getAllTileTypeArraySortedByWeight()) {
            const tileObjectType = gameConfig.getTileObjectTypeByTileType(tileType);
            if (tileObjectType == null) {
                continue;
            }

            const tileObjectCfg = GcData.getTileObjectCfg(tileObjectType);
            if ((tileObjectCfg == null) || (tileObjectCfg.isNeutralOnly)) {
                continue;
            }

            dataArray.push({
                index                   : index++,
                gameConfig              : gameConfig,
                tileObjectType          : tileObjectType,
                playersCountUnneutral   : playersCountUnneutral,
                total                   : allTiles.filter(v => v.getTileTypeId() === tileType).length,
                countArray              : allTilesForPlayers.map(v => v.filter(t => t.getTileTypeId() === tileType).length),
            });
        }

        return dataArray;
    }
}

interface DataForTileRenderer extends UiListItemData {
    index                   : number;
    gameConfig              : GcData;
    tileObjectType          : number;
    playersCountUnneutral   : number;
    total                   : number;
    countArray              : number[];
}
class UnitRenderer extends UiListItemRenderer<DataForTileRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBackground!    : IUiImage;
    private readonly _conTileView!      : IUiContainer;

    private readonly _groupValue!       : IUiContainer;
    private readonly _labelTotal!       : IUiLabel;
    private readonly _labelP0!          : IUiLabel;
    private readonly _labelP1!          : IUiLabel;
    private readonly _labelP2!          : IUiLabel;
    private readonly _labelP3!          : IUiLabel;
    private readonly _labelP4!          : IUiLabel;
    private readonly _labelP5!          : IUiLabel;
    private readonly _labelP6!          : IUiLabel;
    private readonly _labelP7!          : IUiLabel;
    private readonly _labelP8!          : IUiLabel;

    private readonly _tileView          = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TileAnimationTick,       callback: this._onNotifyTileAnimationTick },
        ]);

        const conTileView   = this._conTileView;
        const tileView      = this._tileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig = openData.gameConfig;
        this._imgBackground.setIsVisible(openData.index % 2 == 1);

        {
            const tileView = this._tileView;
            tileView.init({
                tileBaseType            : null,
                tileBaseShapeId         : null,
                tileDecorationType      : null,
                tileDecorationShapeId   : null,
                tileObjectType          : openData.tileObjectType,
                tileObjectShapeId       : 0,
                skinId                  : PlayerIndex.Neutral,
                overridingSkinId        : undefined,
                gameConfig              : gameConfig,
            });
            tileView.updateView();
        }

        {
           const playersCountUnneutral  = openData.playersCountUnneutral;
           const countArray             = openData.countArray;
           this._labelTotal.setText(`${openData.total}`);
           this._labelP0.setText(`${countArray[0]}`);
           this._labelP1.setText(`${countArray[1]}`);
           this._labelP2.setText(`${countArray[2]}`);
           this._labelP3.setText(playersCountUnneutral >= 3 ? `${countArray[3]}` : ``);
           this._labelP4.setText(playersCountUnneutral >= 4 ? `${countArray[4]}` : ``);
           this._labelP5.setText(playersCountUnneutral >= 5 ? `${countArray[5]}` : ``);
           this._labelP6.setText(playersCountUnneutral >= 6 ? `${countArray[6]}` : ``);
           this._labelP7.setText(playersCountUnneutral >= 7 ? `${countArray[7]}` : ``);
           this._labelP8.setText(playersCountUnneutral >= 8 ? `${countArray[8]}` : ``);

           checkAndAddAutoSizerInfo(this._groupValue, false);
        }
    }
}
