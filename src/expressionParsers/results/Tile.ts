import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { ITile } from "../../tiles/ITile.ts";

export class Tile extends Base {
    public readonly tile: ITile;

    public constructor(tile: ITile) {
        super(tile.getWar());

        this.tile = tile;
    }

    public override getResultType(): ResultType {
        return ResultType.Tile;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof Tile)
            && (this.tile === rhs.tile);
    }
}
