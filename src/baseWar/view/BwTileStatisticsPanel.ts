import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UiUtilsUiSizerHelpers from "../../ui/utils/UiSizerHelpers.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";

type ITile          = TilesITile.ITile;

export interface OpenData {
    war             : BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupTitle!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTotal!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP0!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP1!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP2!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP3!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP4!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP5!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP6!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP7!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP8!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listTile!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForTileRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setLangText(LangConstants.TextType.B1296);
        this._labelTotal.setLangText(LangConstants.TextType.B1295);

        UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this._groupTitle, false);
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
        const visibleTileSet        = VisibilitiesUtils.getAllTilesVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
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

            const tileObjectCfg = gameConfig.getTileObjectCfg(tileObjectType);
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

interface DataForTileRenderer extends UiTypesUiListItemData.UiListItemData {
    index                   : number;
    gameConfig              : GameConfigGcData.GcData;
    tileObjectType          : number;
    playersCountUnneutral   : number;
    total                   : number;
    countArray              : number[];
}
class UnitRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBackground!    : UiInterfacesIUiImage.IUiImage;
    private readonly _conTileView!      : UiInterfacesIUiContainer.IUiContainer;

    private readonly _groupValue!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTotal!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP0!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP1!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP2!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP3!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP4!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP5!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP6!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP7!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelP8!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _tileView          = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,       callback: this._onNotifyTileAnimationTick },
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
                skinId                  : PlayersConstants.PlayerIndex.Neutral,
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

           UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this._groupValue, false);
        }
    }
}
