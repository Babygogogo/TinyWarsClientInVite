import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetForceFogCodeSimpleJson extends $ProtoSchemaJsonBase {
    forceFogCode?: number | null | undefined;
    turnsCount?: number | null | undefined;
}

export class WeaSetForceFogCodeSimple extends $ProtoSchemaBase {
    private _forceFogCode?: number | null | undefined;
    private _turnsCount?: number | null | undefined;

    public static fromJson(obj: WeaSetForceFogCodeSimpleJson): WeaSetForceFogCodeSimple {
        return new WeaSetForceFogCodeSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetForceFogCodeSimpleJson): this {
        this.setForceFogCode(obj.forceFogCode);
        this.setTurnsCount(obj.turnsCount);
        return this;
    }
    public override toJson(obj?: WeaSetForceFogCodeSimpleJson): WeaSetForceFogCodeSimpleJson {
        obj ??= ({} as WeaSetForceFogCodeSimpleJson);

        {
            const value = this.getForceFogCode();
            (value != null) && (obj.forceFogCode = value);
        }

        {
            const value = this.getTurnsCount();
            (value != null) && (obj.turnsCount = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getForceFogCode();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTurnsCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetForceFogCodeSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetForceFogCodeSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setForceFogCode(reader.int32());
                    break;

                case 2:
                    msg.setTurnsCount(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetForceFogCodeSimple {
        return WeaSetForceFogCodeSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetForceFogCodeSimple" {
        return "WeaSetForceFogCodeSimple";
    }

    public checkHasForceFogCode(): boolean {
        return this._forceFogCode != null;
    }
    public getForceFogCode(): number {
        return this._forceFogCode ?? 0;
    }
    public setForceFogCode(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._forceFogCode = null;
        } else {
            this._forceFogCode = value;
        }
    }

    public checkHasTurnsCount(): boolean {
        return this._turnsCount != null;
    }
    public getTurnsCount(): number {
        return this._turnsCount ?? 0;
    }
    public setTurnsCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._turnsCount = null;
        } else {
            this._turnsCount = value;
        }
    }
}
