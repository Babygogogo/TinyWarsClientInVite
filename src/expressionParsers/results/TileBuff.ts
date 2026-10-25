import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { TileBuff as ProtoSchemaCommonProtoStructureTileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { ITile as TilesITile } from "../../tiles/ITile.ts";

type TileBuffProto      = ProtoSchemaCommonProtoStructureTileBuff;
type ITile              = TilesITile;

export class TileBuff extends Base {
    public readonly buff: TileBuffProto;
    public readonly tile: ITile;

    public constructor(buff: TileBuffProto, tile: ITile) {
        super(tile.getWar());

        this.buff = buff;
        this.tile = tile;
    }

    public override getResultType(): ResultType {
        return ResultType.TileBuff;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (this.war === rhs.war)
            && (rhs instanceof TileBuff)
            && (this.buff === rhs.buff)
            && (this.tile === rhs.tile);
    }
}
