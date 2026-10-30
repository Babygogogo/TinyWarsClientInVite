import {
    Maps_Constants,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { MapRawData } from "../proto/schema/CommonProto/Map/MapRawData.ts";
import type { GridIndex as ProtoGridIndex } from "../proto/schema/CommonProto/Structure/GridIndex.ts";
import type { SerialTile } from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { SerialTileMap } from "../proto/schema/CommonProto/WarSerialization/SerialTileMap.ts";

export class MapSize {
    private _width  : number;
    private _height : number;

    public static createWithTileArray(tileDataArray: SerialTile[]): MapSize {
        let width   = 0;
        let height  = 0;
        for (const tile of tileDataArray) {
            const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(tile.getGridIndex()));
            width           = Math.max(gridIndex.getX() + 1, width);
            height          = Math.max(gridIndex.getY() + 1, height);
        }

        return new MapSize(width, height);
    }
    public static createWithSerialTileMap(serialTileMap: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTileMap>): MapSize {
        return this.createWithTileArray(serialTileMap?.getTiles() ?? []);
    }
    public static createWithMapRawData(mapRawData: MapRawData): MapSize | null {
        const mapWidth  = mapRawData.getMapWidth();
        const mapHeight = mapRawData.getMapHeight();
        return (mapWidth == null) || (mapHeight == null)
            ? null
            : new MapSize(mapWidth, mapHeight);
    }

    public constructor(width: number, height: number) {
        this._width     = width;
        this._height    = height;
    }

    public clone(): MapSize {
        return new MapSize(this.getWidth(), this.getHeight());
    }

    public getWH(): { width: number, height: number } {
        return { width : this.getWidth(), height : this.getHeight() };
    }

    public getWidth(): number {
        return this._width;
    }

    public getHeight(): number {
        return this._height;
    }

    public getGridsCount(): number {
        return this.getWidth() * this.getHeight();
    }

    public getValidGridXArray(): number[] {
        const array : number[] = [];
        const width = this.getWidth();
        for (let x = 0; x < width; ++x) {
            array.push(x);
        }
        return array;
    }
    public getValidGridYArray(): number[] {
        const array     : number[] = [];
        const height    = this.getHeight();
        for (let y = 0; y < height; ++y) {
            array.push(y);
        }
        return array;
    }

    public checkIsInsideMap(x: number, y: number): boolean {
        return (x >= 0) && (y >= 0) && (x < this.getWidth()) && (y < this.getHeight());
    }

    public checkIsValid(): boolean {
        const { width, height } = this.getWH();
        return (width > 0)
            && (height > 0)
            && (width * height <= Maps_Constants.Common.MaxGridsCount);
    }

    public checkIsValidGridIndexSubset(gridIndexArray: ProtoGridIndex[]): boolean {
        const gridIdSet = new Set<number>();
        for (const g of gridIndexArray) {
            const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(g);
            if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(this))) {
                return false;
            }

            const gridId = gridIndex.getGridId(this);
            if (gridIdSet.has(gridId)) {
                return false;
            }
            gridIdSet.add(gridId);
        }

        return true;
    }
    public checkIsValidGridXSubset(gridXArray: number[]): boolean {
        const gridXSet  = new Set<number>();
        const width     = this.getWidth();
        for (const gridX of gridXArray) {
            if ((gridX < 0) || (gridX >= width)) {
                return false;
            }

            if (gridXSet.has(gridX)) {
                return false;
            }
            gridXSet.add(gridX);
        }

        return true;
    }
    public checkIsValidGridYSubset(gridYArray: number[]): boolean {
        const gridYSet  = new Set<number>();
        const height    = this.getHeight();
        for (const gridY of gridYArray) {
            if ((gridY < 0) || (gridY >= height)) {
                return false;
            }

            if (gridYSet.has(gridY)) {
                return false;
            }
            gridYSet.add(gridY);
        }

        return true;
    }
}
