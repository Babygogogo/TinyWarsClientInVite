import type { GridIndex } from "./GridIndex.ts";

export class MovePathNode {
    private _gridIndex      : GridIndex;
    private _totalMoveCost  : number;

    public constructor(gridIndex: GridIndex, totalMoveCost: number) {
        this._gridIndex     = gridIndex;
        this._totalMoveCost = totalMoveCost;
    }

    public getGridIndex(): GridIndex {
        return this._gridIndex;
    }
    public getTotalMoveCost(): number {
        return this._totalMoveCost;
    }
}
