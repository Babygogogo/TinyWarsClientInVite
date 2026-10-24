import type * as AuxiliaryTypesAuxiliaryTypes from "./AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "./MapSize.ts";
import * as CoSkillsConstants from "../coSkills/Constants.ts";
import * as GeometriesConstants from "../geometries/Constants.ts";
import * as GraphicsUtils from "../graphics/Utils.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NumbersConstants from "../numbers/Constants.ts";
import * as NumbersUtils from "../numbers/Utils.ts";
import * as ProtoSchemaCommonProtoStructureGridIndex from "../proto/schema/CommonProto/Structure/GridIndex.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

const getGridWidth  = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);

export class GridIndex {
    private static readonly _ADJACENT_OFFSETS = [
        { offset: new GridIndex(-1,  0), direction: GeometriesConstants.DirectionId.Left,  clockwiseOffset: new GridIndex( 1,  1) },
        { offset: new GridIndex( 1,  0), direction: GeometriesConstants.DirectionId.Right, clockwiseOffset: new GridIndex(-1, -1) },
        { offset: new GridIndex( 0, -1), direction: GeometriesConstants.DirectionId.Up,    clockwiseOffset: new GridIndex(-1,  1) },
        { offset: new GridIndex( 0,  1), direction: GeometriesConstants.DirectionId.Down,  clockwiseOffset: new GridIndex( 1, -1) },
    ];

    private _x: number;
    private _y: number;

    public static convertGridIndex(raw: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureGridIndex.GridIndex>): GridIndex | null {
        const x = raw?.getX();
        const y = raw?.getY();
        return ((x == null) || (y == null)) ? null : new GridIndex(x, y);
    }

    public static createGridIndexByPoint(p: AuxiliaryTypesAuxiliaryTypes.Point): GridIndex {
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

    public static getGridIndexByGridId(gridId: number, mapSize: AuxiliaryTypesMapSize.MapSize): GridIndex {
        const width = mapSize.getWidth();
        return new GridIndex(
            gridId % width,
            Math.floor(gridId / width),
        );
    }
    public static getGridId(x: number, y: number, mapSize: AuxiliaryTypesMapSize.MapSize): number {
        return y * mapSize.getWidth() + x;
    }

    public constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public toProto(): ProtoSchemaCommonProtoStructureGridIndex.GridIndex {
        return ProtoSchemaCommonProtoStructureGridIndex.GridIndex.fromJson({ x: this.getX(), y: this.getY() });
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

    public createPointByGridIndex(): AuxiliaryTypesAuxiliaryTypes.Point {
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
        let minDistance = NumbersConstants.MaxValue;
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
    public checkIsEqual2(raw: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureGridIndex.GridIndex>): boolean {
        return (raw != null)
            && (this.getX() === raw.getX())
            && (this.getY() === raw.getY());
    }

    public checkIsInsideMap(mapSize: AuxiliaryTypesMapSize.MapSize): boolean {
        const x = this.getX();
        const y = this.getY();
        return (x >= 0)
            && (y >= 0)
            && (x < mapSize.getWidth())
            && (y < mapSize.getHeight());
    }

    public checkIsInsideCoSkillArea({ coSkillAreaType, getCoGridIndexArrayOnMap, coZoneRadius }: {
        coSkillAreaType         : CoSkillsConstants.AreaTypeId;
        getCoGridIndexArrayOnMap: () => GridIndex[];
        coZoneRadius            : number;
    }): boolean {
        if (coSkillAreaType === CoSkillsConstants.AreaTypeId.Halo) {
            return true;

        } else if (coSkillAreaType === CoSkillsConstants.AreaTypeId.OnMap) {
            const coGridIndexArray = getCoGridIndexArrayOnMap();
            return coGridIndexArray.length > 0;

        } else if (coSkillAreaType === CoSkillsConstants.AreaTypeId.Zone) {
            const coGridIndexArray  = getCoGridIndexArrayOnMap();
            const distance          = this.getMinDistance(coGridIndexArray);
            return (distance != null) && (distance <= coZoneRadius);

        } else {
            throw HelpersMisc.newError(`Invalid coSkillAreaType: ${coSkillAreaType}`, UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_CheckIsGridIndexInsideCoSkillArea_00);
        }
    }

    public getNearestGridIndexInMap(mapSize: AuxiliaryTypesMapSize.MapSize): GridIndex {
        return new GridIndex(
            NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : mapSize.getWidth() - 1,
                rawValue    : this.getX(),
            }),
            NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : mapSize.getHeight() - 1,
                rawValue    : this.getY(),
            }),
        );
    }

    public getAdjacentGrids(mapSize: AuxiliaryTypesMapSize.MapSize): GridIndex[] {
        const grids: GridIndex[] = [];
        for (const o of GridIndex._ADJACENT_OFFSETS) {
            const adjacentGrid = GridIndex.add(this, o.offset);
            if ((!mapSize) || (adjacentGrid.checkIsInsideMap(mapSize))) {
                grids.push(adjacentGrid);
            }
        }
        return grids;
    }
    public getAdjacentGrid(direction: GeometriesConstants.DirectionId): GridIndex {
        return GridIndex.add(
            this,
            HelpersMisc.getExisted(GridIndex._ADJACENT_OFFSETS.find(v => v.direction === direction)?.offset)
        );
    }

    /**
     * If this is not adjacent to g, Direction.Undefined is returned.
     * Else, if index1 is at the right side of index2, then Direction.Right is returned, and so on.
    */
    public getAdjacentDirection(g: GridIndex): GeometriesConstants.DirectionId {
        if (this.getDistance(g) === 1) {
            const offset = GridIndex.sub(this, g);
            for (const o of GridIndex._ADJACENT_OFFSETS) {
                if (offset.checkIsEqual(o.offset)) {
                    return o.direction;
                }
            }
        }
        return GeometriesConstants.DirectionId.Undefined;
    }

    public getGridsWithinDistance({ minDistance, maxDistance, mapSize, predicate, limit }: {
        minDistance : number;
        maxDistance : number;
        mapSize     : AuxiliaryTypesMapSize.MapSize;
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

    public getGridId(mapSize: AuxiliaryTypesMapSize.MapSize): number {
        return this.getY() * mapSize.getWidth() + this.getX();
    }
}
