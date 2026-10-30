import {
    type Players_IPlayer,
    type Tiles_ITile,
    type Units_IUnit,
} from "../internal.ts";
import type { BattleDamageInfo } from "../proto/schema/CommonProto/Structure/BattleDamageInfo.ts";
import type { SerialPlayer } from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialTile } from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

export class BattleInfo {
    public readonly oldUnits                    = new Map<number, SerialUnit>();
    public readonly oldPlayers                  = new Map<number, SerialPlayer>();
    public readonly oldTiles                    = new Map<number, SerialTile>();

    public readonly destroyedUnits              = new Map<number, Units_IUnit.IUnit>();
    public readonly damagedUnits                = new Map<number, Units_IUnit.IUnit>();
    public readonly destroyedTiles              = new Map<number, Tiles_ITile.ITile>();
    public readonly damagedTiles                = new Map<number, Tiles_ITile.ITile>();
    public readonly playersForDestroyedUnits    = new Set<Players_IPlayer.IPlayer>();

    public readonly damageInfoArray             : BattleDamageInfo[] = [];
}
