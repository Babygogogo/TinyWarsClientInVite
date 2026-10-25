import type { IPlayer } from "../players/IPlayer.ts";
import type {
    BattleDamageInfo as ProtoSchemaCommonProtoStructureBattleDamageInfo,
} from "../proto/schema/CommonProto/Structure/BattleDamageInfo.ts";
import type { SerialPlayer } from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialTile } from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import type { ITile as TilesITile } from "../tiles/ITile.ts";
import type { IUnit as UnitsIUnit } from "../units/IUnit.ts";

type BattleDamageInfo       = ProtoSchemaCommonProtoStructureBattleDamageInfo;
type IUnit                  = UnitsIUnit;
type ITile                  = TilesITile;

export class BattleInfo {
    public readonly oldUnits                    = new Map<number, SerialUnit>();
    public readonly oldPlayers                  = new Map<number, SerialPlayer>();
    public readonly oldTiles                    = new Map<number, SerialTile>();

    public readonly destroyedUnits              = new Map<number, IUnit>();
    public readonly damagedUnits                = new Map<number, IUnit>();
    public readonly destroyedTiles              = new Map<number, ITile>();
    public readonly damagedTiles                = new Map<number, ITile>();
    public readonly playersForDestroyedUnits    = new Set<IPlayer>();

    public readonly damageInfoArray             : BattleDamageInfo[] = [];
}
