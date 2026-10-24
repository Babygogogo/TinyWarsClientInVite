import type * as PlayersIPlayer from "../players/IPlayer.ts";
import type * as ProtoSchemaCommonProtoStructureBattleDamageInfo from "../proto/schema/CommonProto/Structure/BattleDamageInfo.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayer from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import type * as TilesITile from "../tiles/ITile.ts";
import type * as UnitsIUnit from "../units/IUnit.ts";

type BattleDamageInfo       = ProtoSchemaCommonProtoStructureBattleDamageInfo.BattleDamageInfo;
type IUnit                  = UnitsIUnit.IUnit;
type ITile                  = TilesITile.ITile;

export class BattleInfo {
    public readonly oldUnits                    = new Map<number, ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit>();
    public readonly oldPlayers                  = new Map<number, ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer>();
    public readonly oldTiles                    = new Map<number, ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile>();

    public readonly destroyedUnits              = new Map<number, IUnit>();
    public readonly damagedUnits                = new Map<number, IUnit>();
    public readonly destroyedTiles              = new Map<number, ITile>();
    public readonly damagedTiles                = new Map<number, ITile>();
    public readonly playersForDestroyedUnits    = new Set<PlayersIPlayer.IPlayer>();

    public readonly damageInfoArray             : BattleDamageInfo[] = [];
}
