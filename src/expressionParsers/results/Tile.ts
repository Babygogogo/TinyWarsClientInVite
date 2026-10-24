import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as TilesITile from "../../tiles/ITile.ts";

type ITile = TilesITile.ITile;

export class Tile extends ExpressionParsersResultsBase.Base {
    public readonly tile: ITile;

    public constructor(tile: ITile) {
        super(tile.getWar());

        this.tile = tile;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Tile;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof Tile)
            && (this.tile === rhs.tile);
    }
}
