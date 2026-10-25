import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndexAndPathInfo as $Message$CommonProto$Structure$GridIndexAndPathInfo, type GridIndexAndPathInfoJson as $Json$CommonProto$Structure$GridIndexAndPathInfo } from "./GridIndexAndPathInfo.js";
import { SerialUnit as $Message$CommonProto$WarSerialization$SerialUnit, type SerialUnitJson as $Json$CommonProto$WarSerialization$SerialUnit } from "../WarSerialization/SerialUnit.js";

export interface MovingUnitAndPathJson extends $ProtoSchemaJsonBase {
    unit?: $Json$CommonProto$WarSerialization$SerialUnit | null | undefined;
    path: $Json$CommonProto$Structure$GridIndexAndPathInfo[];
}

export class MovingUnitAndPath extends $ProtoSchemaBase {
    private _unit?: $Message$CommonProto$WarSerialization$SerialUnit | null | undefined;
    private _path: $Message$CommonProto$Structure$GridIndexAndPathInfo[] = [];

    public static fromJson(obj: MovingUnitAndPathJson): MovingUnitAndPath {
        return new MovingUnitAndPath().loadJson(obj);
    }
    public override loadJson(obj: MovingUnitAndPathJson): this {
        this.setUnit(obj.unit != null ? $Message$CommonProto$WarSerialization$SerialUnit.fromJson(obj.unit) : null);
        this.setPath(obj.path?.map(v => $Message$CommonProto$Structure$GridIndexAndPathInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MovingUnitAndPathJson): MovingUnitAndPathJson {
        obj ??= ({} as MovingUnitAndPathJson);

        {
            const value = this.getUnit();
            (value != null) && (obj.unit = value.toJson());
        }

        {
            obj.path = this.getPath().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnit();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getPath();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MovingUnitAndPath {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MovingUnitAndPath();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnit($Message$CommonProto$WarSerialization$SerialUnit.decode(reader, reader.uint32()));
                    break;

                case 2:
                    {
                        const arr = msg._path;
                        arr.push($Message$CommonProto$Structure$GridIndexAndPathInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MovingUnitAndPath {
        return MovingUnitAndPath.decode(this.encode());
    }

    public override getSchemaName(): "MovingUnitAndPath" {
        return "MovingUnitAndPath";
    }

    public checkHasUnit(): boolean {
        return this._unit != null;
    }
    public getUnit(): $Message$CommonProto$WarSerialization$SerialUnit | null | undefined {
        return this._unit;
    }
    public setUnit(value: $Message$CommonProto$WarSerialization$SerialUnit | null | undefined): void {
        this._unit = value;
    }
    public createIfNotExistsUnit(): $Message$CommonProto$WarSerialization$SerialUnit {
        return this._unit ??= new $Message$CommonProto$WarSerialization$SerialUnit();
    }

    public getPath(): $Message$CommonProto$Structure$GridIndexAndPathInfo[] {
        return this._path;
    }
    public setPath(value: $Message$CommonProto$Structure$GridIndexAndPathInfo[]): void {
        this._path = value;
    }
}
