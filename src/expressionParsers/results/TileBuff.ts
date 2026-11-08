import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type Tiles_Tile,
} from "../../internal.ts";
import type { TileBuff as ProtoTileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";

export class TileBuff extends ExpressionParsers_Results_Base.Base {
    public readonly buff: ProtoTileBuff;
    public readonly tile: Tiles_Tile.Tile;

    public constructor(buff: ProtoTileBuff, tile: Tiles_Tile.Tile) {
        super(tile.getWar());

        this.buff = buff;
        this.tile = tile;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.TileBuff;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (this.war === rhs.war)
            && (rhs instanceof TileBuff)
            && (this.buff === rhs.buff)
            && (this.tile === rhs.tile);
    }
}
