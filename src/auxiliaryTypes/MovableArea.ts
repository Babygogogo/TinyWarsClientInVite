import type * as AuxiliaryTypesAuxiliaryTypes from "./AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "./GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "./MapSize.ts";
import * as AuxiliaryTypesMovePathNode from "./MovePathNode.ts";
import * as HelpersMisc from "../helpers/Misc.ts";

type Data = {
    prevGridIndex   : AuxiliaryTypesGridIndex.GridIndex | null;
    totalMoveCost   : number;
};
type AvailableMovableGrid = {
    currGridIndex   : AuxiliaryTypesGridIndex.GridIndex;
    prevGridIndex   : AuxiliaryTypesGridIndex.GridIndex | null;
    totalMoveCost   : number;
};

export class MovableArea {
    private _area: Data[][];

    public constructor(area: Data[][]) {
        this._area = area;
    }
    public getArea(): Data[][] {
        return this._area;
    }
    public getColumn(x: number): Data[] | null {
        return this._area[x];
    }
    public getData(x: number, y: number): Data | null {
        const column = this._area[x];
        return column ? column[y] : null;
    }
    public getDataByGridIndex(gridIndex: AuxiliaryTypesGridIndex.GridIndex): Data | null {
        return this.getData(gridIndex.getX(), gridIndex.getY());
    }
    public checkHasGrid(x: number, y: number): boolean {
        return this.getData(x, y) != null;
    }
    public checkHasGridByGridIndex(gridIndex: AuxiliaryTypesGridIndex.GridIndex): boolean {
        return this.checkHasGrid(gridIndex.getX(), gridIndex.getY());
    }

    public static create({ gridIndex, maxMoveCost, mapSize, moveCostGetter }: {
        gridIndex       : AuxiliaryTypesGridIndex.GridIndex;
        maxMoveCost     : number;
        mapSize         : AuxiliaryTypesMapSize.MapSize;
        moveCostGetter  : (g: AuxiliaryTypesGridIndex.GridIndex) => AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    }): MovableArea {
        const area              : Data[][] = [];
        const availableGrids    : AvailableMovableGrid[] = [];
        _updateAvailableGrids({
            grids           : availableGrids,
            index           : 0,
            gridIndex       : gridIndex,
            prev            : null,
            totalMoveCost   : 0,
        });

        const moveCostDict  = new Map<number, AuxiliaryTypesAuxiliaryTypes.Undefinable<number>>();
        let index           = 0;
        while (index < availableGrids.length) {
            const availableGrid                     = _sortAvailableMovableGrids(availableGrids, index);
            const { currGridIndex, totalMoveCost }  = availableGrid;
            if (_checkAndUpdateMovableArea({ area, gridIndex: currGridIndex, prev: availableGrid.prevGridIndex, totalMoveCost })) {
                for (const nextGridIndex of currGridIndex.getAdjacentGrids(mapSize)) {
                    const gridId = nextGridIndex.getGridId(mapSize);
                    if (!moveCostDict.has(gridId)) {
                        moveCostDict.set(gridId, moveCostGetter(nextGridIndex));
                    }
                    const nextMoveCost = moveCostDict.get(gridId) ?? null;
                    if ((nextMoveCost != null) && (nextMoveCost + totalMoveCost <= maxMoveCost)) {
                        _updateAvailableGrids({ grids: availableGrids, index: index + 1, gridIndex: nextGridIndex, prev: currGridIndex, totalMoveCost: nextMoveCost + totalMoveCost });
                    }
                }
            }

            ++index;
        }

        return new MovableArea(area);
    }

    public createShortestMovePath(destination: AuxiliaryTypesGridIndex.GridIndex): AuxiliaryTypesMovePathNode.MovePathNode[] {
        const reversedPath  : AuxiliaryTypesMovePathNode.MovePathNode[] = [];
        let gridIndex       : AuxiliaryTypesGridIndex.GridIndex | null = destination;
        let movableNode     = HelpersMisc.getExisted(this.getDataByGridIndex(gridIndex));

        for (;;) {
            reversedPath.push(new AuxiliaryTypesMovePathNode.MovePathNode(
                gridIndex.clone(),
                movableNode.totalMoveCost,
            ));

            gridIndex = movableNode.prevGridIndex;
            if (!gridIndex) {
                return reversedPath.reverse();
            }
            movableNode = HelpersMisc.getExisted(this.getDataByGridIndex(gridIndex));
        }
    }
}

function _updateAvailableGrids({ grids, index, gridIndex, prev, totalMoveCost }: {
    grids           : AvailableMovableGrid[];
    index           : number;
    gridIndex       : AuxiliaryTypesGridIndex.GridIndex;
    prev            : AuxiliaryTypesGridIndex.GridIndex | null;
    totalMoveCost   : number;
}): void {
    const newNode: AvailableMovableGrid = {
        currGridIndex: gridIndex,
        prevGridIndex: prev?.clone() ?? null,
        totalMoveCost,
    };

    for (let i = index; i < grids.length; ++i) {
        if (grids[i].currGridIndex.checkIsEqual(gridIndex)) {
            if (grids[i].totalMoveCost > totalMoveCost) {
                grids[i] = newNode;
            }
            return;
        }
    }

    grids.push(newNode);
}
function _checkAndUpdateMovableArea({ area, gridIndex, prev, totalMoveCost }: {
    area            : Data[][];
    gridIndex       : AuxiliaryTypesGridIndex.GridIndex;
    prev            : AuxiliaryTypesGridIndex.GridIndex | null;
    totalMoveCost   : number;
}): boolean {
    const x = gridIndex.getX();
    const y = gridIndex.getY();
    area[x] = area[x] || [];

    if ((area[x][y]) && (area[x][y].totalMoveCost <= totalMoveCost)) {
        return false;
    } else {
        area[x][y] = {
            prevGridIndex: prev?.clone() ?? null,
            totalMoveCost,
        };
        return true;
    }
}
function _sortAvailableMovableGrids(list: AvailableMovableGrid[], startingIndex: number): AvailableMovableGrid {
    let indexForMinMoveCost = startingIndex;
    let minMoveCost         = list[indexForMinMoveCost].totalMoveCost;
    for (let i = startingIndex + 1; i < list.length; ++i) {
        if (list[i].totalMoveCost < minMoveCost) {
            indexForMinMoveCost = i;
            minMoveCost         = list[i].totalMoveCost;
        }
    }

    if (indexForMinMoveCost !== startingIndex) {
        [list[indexForMinMoveCost], list[startingIndex]] = [list[startingIndex], list[indexForMinMoveCost]];
    }
    return list[startingIndex];
}
