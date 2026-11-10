import type {
    Tiles_Tile,
    Units_Unit,
} from "../internal";

export class VisibleThings {
    private readonly _tiles         : Set<Tiles_Tile.Tile>;
    private readonly _units         : Set<Units_Unit.Unit>;
    private readonly _visibilityMap : number[][];

    public constructor(tiles: Set<Tiles_Tile.Tile>, units: Set<Units_Unit.Unit>, visibilityMap: number[][]) {
        this._tiles         = tiles;
        this._units         = units;
        this._visibilityMap = visibilityMap;
    }

    public getTiles(): Set<Tiles_Tile.Tile> {
        return this._tiles;
    }

    public getUnits(): Set<Units_Unit.Unit> {
        return this._units;
    }

    public getVisibilityMap(): number[][] {
        return this._visibilityMap;
    }
}
