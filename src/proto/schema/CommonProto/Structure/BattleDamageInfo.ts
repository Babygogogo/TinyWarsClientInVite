import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "./GridIndex.js";

export interface BattleDamageInfoJson extends $ProtoSchemaJsonBase {
    attackerUnitId?: number | null | undefined;
    targetUnitId?: number | null | undefined;
    targetTileGridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    damage?: number | null | undefined;
}

export class BattleDamageInfo extends $ProtoSchemaBase {
    private _attackerUnitId?: number | null | undefined;
    private _targetUnitId?: number | null | undefined;
    private _targetTileGridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _damage?: number | null | undefined;

    public static fromJson(obj: BattleDamageInfoJson): BattleDamageInfo {
        return new BattleDamageInfo().loadJson(obj);
    }
    public override loadJson(obj: BattleDamageInfoJson): this {
        this.setAttackerUnitId(obj.attackerUnitId);
        this.setTargetUnitId(obj.targetUnitId);
        this.setTargetTileGridIndex(obj.targetTileGridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.targetTileGridIndex) : null);
        this.setDamage(obj.damage);
        return this;
    }
    public override toJson(obj?: BattleDamageInfoJson): BattleDamageInfoJson {
        obj ??= ({} as BattleDamageInfoJson);

        {
            const value = this.getAttackerUnitId();
            (value != null) && (obj.attackerUnitId = value);
        }

        {
            const value = this.getTargetUnitId();
            (value != null) && (obj.targetUnitId = value);
        }

        {
            const value = this.getTargetTileGridIndex();
            (value != null) && (obj.targetTileGridIndex = value.toJson());
        }

        {
            const value = this.getDamage();
            (value != null) && (obj.damage = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getAttackerUnitId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTargetUnitId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTargetTileGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getDamage();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).sint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): BattleDamageInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new BattleDamageInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setAttackerUnitId(reader.int32());
                    break;

                case 2:
                    msg.setTargetUnitId(reader.int32());
                    break;

                case 3:
                    msg.setTargetTileGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setDamage(reader.sint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): BattleDamageInfo {
        return BattleDamageInfo.decode(this.encode());
    }

    public override getSchemaName(): "BattleDamageInfo" {
        return "BattleDamageInfo";
    }

    public checkHasAttackerUnitId(): boolean {
        return this._attackerUnitId != null;
    }
    public getAttackerUnitId(): number {
        return this._attackerUnitId ?? 0;
    }
    public setAttackerUnitId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._attackerUnitId = null;
        } else {
            this._attackerUnitId = value;
        }
    }

    public checkHasTargetUnitId(): boolean {
        return this._targetUnitId != null;
    }
    public getTargetUnitId(): number | null | undefined {
        return this._targetUnitId;
    }
    public setTargetUnitId(value: number | null | undefined): void {
        this._targetUnitId = value;
    }

    public checkHasTargetTileGridIndex(): boolean {
        return this._targetTileGridIndex != null;
    }
    public getTargetTileGridIndex(): $Message$CommonProto$Structure$GridIndex | null | undefined {
        return this._targetTileGridIndex;
    }
    public setTargetTileGridIndex(value: $Message$CommonProto$Structure$GridIndex | null | undefined): void {
        this._targetTileGridIndex = value;
    }
    public createIfNotExistsTargetTileGridIndex(): $Message$CommonProto$Structure$GridIndex {
        return this._targetTileGridIndex ??= new $Message$CommonProto$Structure$GridIndex();
    }

    public checkHasDamage(): boolean {
        return this._damage != null;
    }
    public getDamage(): number {
        return this._damage ?? 0;
    }
    public setDamage(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._damage = null;
        } else {
            this._damage = value;
        }
    }
}
