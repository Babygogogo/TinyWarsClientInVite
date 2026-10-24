import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MoveTypeCfgJson extends $ProtoSchemaJsonBase {
    moveTypeId?: number | null | undefined;
    nameTextId?: number | null | undefined;
}

export class MoveTypeCfg extends $ProtoSchemaBase {
    private _moveTypeId?: number | null | undefined;
    private _nameTextId?: number | null | undefined;

    public static fromJson(obj: MoveTypeCfgJson): MoveTypeCfg {
        return new MoveTypeCfg().loadJson(obj);
    }
    public override loadJson(obj: MoveTypeCfgJson): this {
        this.setMoveTypeId(obj.moveTypeId);
        this.setNameTextId(obj.nameTextId);
        return this;
    }
    public override toJson(obj?: MoveTypeCfgJson): MoveTypeCfgJson {
        obj ??= ({} as MoveTypeCfgJson);

        {
            const value = this.getMoveTypeId();
            (value != null) && (obj.moveTypeId = value);
        }

        {
            const value = this.getNameTextId();
            (value != null) && (obj.nameTextId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMoveTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getNameTextId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MoveTypeCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MoveTypeCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMoveTypeId(reader.int32());
                    break;

                case 2:
                    msg.setNameTextId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MoveTypeCfg {
        return MoveTypeCfg.decode(this.encode());
    }

    public override getSchemaName(): "MoveTypeCfg" {
        return "MoveTypeCfg";
    }

    public checkHasMoveTypeId(): boolean {
        return this._moveTypeId != null;
    }
    public getMoveTypeId(): number {
        return this._moveTypeId ?? 0;
    }
    public setMoveTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._moveTypeId = null;
        } else {
            this._moveTypeId = value;
        }
    }

    public checkHasNameTextId(): boolean {
        return this._nameTextId != null;
    }
    public getNameTextId(): number {
        return this._nameTextId ?? 0;
    }
    public setNameTextId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._nameTextId = null;
        } else {
            this._nameTextId = value;
        }
    }
}
