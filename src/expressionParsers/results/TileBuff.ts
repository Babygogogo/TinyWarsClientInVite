import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { TileBuff as ProtoTileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { ITile } from "../../tiles/ITile.ts";

export class TileBuff extends Base {
    public readonly buff: ProtoTileBuff;
    public readonly tile: ITile;

    public constructor(buff: ProtoTileBuff, tile: ITile) {
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
