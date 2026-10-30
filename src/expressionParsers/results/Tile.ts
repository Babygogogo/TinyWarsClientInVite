import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type Tiles_ITile,
} from "../../internal.ts";

export class Tile extends ExpressionParsers_Results_Base.Base {
    public readonly tile: Tiles_ITile.ITile;

    public constructor(tile: Tiles_ITile.ITile) {
        super(tile.getWar());

        this.tile = tile;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Tile;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof Tile)
            && (this.tile === rhs.tile);
    }
}
