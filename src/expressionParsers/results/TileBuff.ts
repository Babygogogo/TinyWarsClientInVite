import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as TilesITile from "../../tiles/ITile.ts";

type TileBuffProto      = ProtoSchemaCommonProtoStructureTileBuff.TileBuff;
type ITile              = TilesITile.ITile;

export class TileBuff extends ExpressionParsersResultsBase.Base {
    public readonly buff: TileBuffProto;
    public readonly tile: ITile;

    public constructor(buff: TileBuffProto, tile: ITile) {
        super(tile.getWar());

        this.buff = buff;
        this.tile = tile;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.TileBuff;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (this.war === rhs.war)
            && (rhs instanceof TileBuff)
            && (this.buff === rhs.buff)
            && (this.tile === rhs.tile);
    }
}
