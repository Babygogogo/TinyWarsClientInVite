import {
    type Players_IPlayer,
    type Tiles_Tile,
    type Units_Unit,
} from "../internal.ts";
import type { BattleDamageInfo } from "../proto/schema/CommonProto/Structure/BattleDamageInfo.ts";
import type { SerialPlayer } from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialTile } from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

export class BattleInfo {
    public readonly oldUnits                    = new Map<number, SerialUnit>();
    public readonly oldPlayers                  = new Map<number, SerialPlayer>();
    public readonly oldTiles                    = new Map<number, SerialTile>();

    public readonly destroyedUnits              = new Map<number, Units_Unit.Unit>();
    public readonly damagedUnits                = new Map<number, Units_Unit.Unit>();
    public readonly destroyedTiles              = new Map<number, Tiles_Tile.Tile>();
    public readonly damagedTiles                = new Map<number, Tiles_Tile.Tile>();
    public readonly playersForDestroyedUnits    = new Set<Players_IPlayer.IPlayer>();

    public readonly damageInfoArray             : BattleDamageInfo[] = [];
}
