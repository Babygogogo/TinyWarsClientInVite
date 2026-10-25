import type { Undefinable, Point } from "./AuxiliaryTypes.ts";
import type { MapSize } from "./MapSize.ts";
import { AreaTypeId } from "../coSkills/Constants.ts";
import { DirectionId } from "../geometries/Constants.ts";
import { getCurrentTextureResolutionConfig } from "../graphics/Utils.ts";
import { createLazyFunc, newError, getExisted } from "../helpers/Misc.ts";
import { MaxValue } from "../numbers/Constants.ts";
import { getValueInRange } from "../numbers/Utils.ts";
import { GridIndex as ProtoSchemaCommonProtoStructureGridIndex } from "../proto/schema/CommonProto/Structure/GridIndex.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";

const getGridWidth  = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);

export class GridIndex {
    private static readonly _ADJACENT_OFFSETS = [
        { offset: new GridIndex(-1,  0), direction: DirectionId.Left,  clockwiseOffset: new GridIndex( 1,  1) },
        { offset: new GridIndex( 1,  0), direction: DirectionId.Right, clockwiseOffset: new GridIndex(-1, -1) },
        { offset: new GridIndex( 0, -1), direction: DirectionId.Up,    clockwiseOffset: new GridIndex(-1,  1) },
        { offset: new GridIndex( 0,  1), direction: DirectionId.Down,  clockwiseOffset: new GridIndex( 1, -1) },
    ];

    private _x: number;
    private _y: number;

    public static convertGridIndex(raw: Undefinable<ProtoSchemaCommonProtoStructureGridIndex>): GridIndex | null {
        const x = raw?.getX();
        const y = raw?.getY();
        return ((x == null) || (y == null)) ? null : new GridIndex(x, y);
    }

    public static createGridIndexByPoint(p: Point): GridIndex {
        return new GridIndex(
            Math.floor(p.x / getGridWidth()),
            Math.floor(p.y / getGridHeight()),
        );
    }

    public static add(g1: GridIndex, g2: GridIndex): GridIndex {
        return new GridIndex(
            g1.getX() + g2.getX(),
            g1.getY() + g2.getY(),
        );
    }
    public static sub(g1: GridIndex, g2: GridIndex): GridIndex {
        return new GridIndex(
            g1.getX() - g2.getX(),
            g1.getY() - g2.getY(),
        );
    }
    public static scale(g: GridIndex, factor: number): GridIndex {
        return new GridIndex(
            g.getX() * factor,
            g.getY() * factor,
        );
    }

    public static getGridIndexByGridId(gridId: number, mapSize: MapSize): GridIndex {
        const width = mapSize.getWidth();
        return new GridIndex(
            gridId % width,
            Math.floor(gridId / width),
        );
    }
    public static getGridId(x: number, y: number, mapSize: MapSize): number {
        return y * mapSize.getWidth() + x;
    }

    public constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public toProto(): ProtoSchemaCommonProtoStructureGridIndex {
        return ProtoSchemaCommonProtoStructureGridIndex.fromJson({ x: this.getX(), y: this.getY() });
    }
    public getXY(): { x: number, y: number } {
        return { x: this.getX(), y: this.getY() };
    }

    public getX(): number {
        return this._x;
    }
    public setX(x: number): void {
        this._x = x;
    }

    public getY(): number {
        return this._y;
    }
    public setY(y: number): void {
        this._y = y;
    }

    public createPointByGridIndex(): Point {
        return {
            x: this.getX() * getGridWidth(),
            y: this.getY() * getGridHeight(),
        };
    }

    public clone(): GridIndex {
        return new GridIndex(this.getX(), this.getY());
    }

    public getDistance(g: GridIndex): number {
        return Math.abs(this.getX() - g.getX()) + Math.abs(this.getY() - g.getY());
    }
    public getMinDistance(list: GridIndex[]): number {
        let minDistance = MaxValue;
        for (const g of list) {
            const distance = this.getDistance(g);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }
        return minDistance;
    }

    public checkIsAdjacent(g: GridIndex): boolean {
        return this.getDistance(g) === 1;
    }

    public checkIsEqual(g2: GridIndex): boolean {
        return (this.getX() === g2.getX()) && (this.getY() === g2.getY());
    }
    public checkIsEqual2(raw: Undefinable<ProtoSchemaCommonProtoStructureGridIndex>): boolean {
        return (raw != null)
            && (this.getX() === raw.getX())
            && (this.getY() === raw.getY());
    }

    public checkIsInsideMap(mapSize: MapSize): boolean {
        const x = this.getX();
        const y = this.getY();
        return (x >= 0)
            && (y >= 0)
            && (x < mapSize.getWidth())
            && (y < mapSize.getHeight());
    }

    public checkIsInsideCoSkillArea({ coSkillAreaType, getCoGridIndexArrayOnMap, coZoneRadius }: {
        coSkillAreaType         : AreaTypeId;
        getCoGridIndexArrayOnMap: () => GridIndex[];
        coZoneRadius            : number;
    }): boolean {
        if (coSkillAreaType === AreaTypeId.Halo) {
            return true;

        } else if (coSkillAreaType === AreaTypeId.OnMap) {
            const coGridIndexArray = getCoGridIndexArrayOnMap();
            return coGridIndexArray.length > 0;

        } else if (coSkillAreaType === AreaTypeId.Zone) {
            const coGridIndexArray  = getCoGridIndexArrayOnMap();
            const distance          = this.getMinDistance(coGridIndexArray);
            return (distance != null) && (distance <= coZoneRadius);

        } else {
            throw newError(`Invalid coSkillAreaType: ${coSkillAreaType}`, ClientErrorCode.WarCommonHelpers_CheckIsGridIndexInsideCoSkillArea_00);
        }
    }

    public getNearestGridIndexInMap(mapSize: MapSize): GridIndex {
        return new GridIndex(
            getValueInRange({
                minValue    : 0,
                maxValue    : mapSize.getWidth() - 1,
                rawValue    : this.getX(),
            }),
            getValueInRange({
                minValue    : 0,
                maxValue    : mapSize.getHeight() - 1,
                rawValue    : this.getY(),
            }),
        );
    }

    public getAdjacentGrids(mapSize: MapSize): GridIndex[] {
        const grids: GridIndex[] = [];
        for (const o of GridIndex._ADJACENT_OFFSETS) {
            const adjacentGrid = GridIndex.add(this, o.offset);
            if ((!mapSize) || (adjacentGrid.checkIsInsideMap(mapSize))) {
                grids.push(adjacentGrid);
            }
        }
        return grids;
    }
    public getAdjacentGrid(direction: DirectionId): GridIndex {
        return GridIndex.add(
            this,
            getExisted(GridIndex._ADJACENT_OFFSETS.find(v => v.direction === direction)?.offset)
        );
    }

    /**
     * If this is not adjacent to g, Direction.Undefined is returned.
     * Else, if index1 is at the right side of index2, then Direction.Right is returned, and so on.
    */
    public getAdjacentDirection(g: GridIndex): DirectionId {
        if (this.getDistance(g) === 1) {
            const offset = GridIndex.sub(this, g);
            for (const o of GridIndex._ADJACENT_OFFSETS) {
                if (offset.checkIsEqual(o.offset)) {
                    return o.direction;
                }
            }
        }
        return DirectionId.Undefined;
    }

    public getGridsWithinDistance({ minDistance, maxDistance, mapSize, predicate, limit }: {
        minDistance : number;
        maxDistance : number;
        mapSize     : MapSize;
        predicate?  : (g: GridIndex) => boolean;
        limit?      : number;
    }): GridIndex[] {
        maxDistance = Math.min(maxDistance, mapSize.getWidth() + mapSize.getHeight());
        const grids : GridIndex[] = [];
        if ((minDistance == 0)                  &&
            (maxDistance >= minDistance)        &&
            (this.checkIsInsideMap(mapSize))    &&
            ((!predicate) || (predicate(this)))
        ) {
            grids.push(this);

            if ((limit != null) && (grids.length >= limit)) {
                return grids;
            }
        }

        for (let distance = minDistance; distance <= maxDistance; ++distance) {
            for (const offsetItem of GridIndex._ADJACENT_OFFSETS) {
                let gridIndex = GridIndex.add(this, GridIndex.sub(GridIndex.scale(offsetItem.offset, distance), offsetItem.clockwiseOffset));
                for (let i = 1; i <= distance; ++i) {
                    gridIndex = GridIndex.add(gridIndex, offsetItem.clockwiseOffset);
                    if ((gridIndex.checkIsInsideMap(mapSize)) &&
                        ((!predicate) || (predicate(gridIndex)))
                    ) {
                        grids.push(gridIndex);

                        if ((limit != null) && (grids.length >= limit)) {
                            return grids;
                        }
                    }
                }
            }
        }

        return grids;
    }

    public getGridId(mapSize: MapSize): number {
        return this.getY() * mapSize.getWidth() + this.getX();
    }
}
