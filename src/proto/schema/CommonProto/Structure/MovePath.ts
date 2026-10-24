import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "./GridIndex.js";

export interface MovePathJson extends $ProtoSchemaJsonBase {
    nodes: $Json$CommonProto$Structure$GridIndex[];
    isBlocked?: boolean | null | undefined;
    fuelConsumption?: number | null | undefined;
}

export class MovePath extends $ProtoSchemaBase {
    private _nodes: $Message$CommonProto$Structure$GridIndex[] = [];
    private _isBlocked?: boolean | null | undefined;
    private _fuelConsumption?: number | null | undefined;

    public static fromJson(obj: MovePathJson): MovePath {
        return new MovePath().loadJson(obj);
    }
    public override loadJson(obj: MovePathJson): this {
        this.setNodes(obj.nodes?.map(v => $Message$CommonProto$Structure$GridIndex.fromJson(v)) ?? []);
        this.setIsBlocked(obj.isBlocked);
        this.setFuelConsumption(obj.fuelConsumption);
        return this;
    }
    public override toJson(obj?: MovePathJson): MovePathJson {
        obj ??= ({} as MovePathJson);

        {
            obj.nodes = this.getNodes().map(v => v.toJson());
        }

        {
            const value = this.getIsBlocked();
            (value != null) && (obj.isBlocked = value);
        }

        {
            const value = this.getFuelConsumption();
            (value != null) && (obj.fuelConsumption = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNodes();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getIsBlocked();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getFuelConsumption();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MovePath {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MovePath();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._nodes;
                        arr.push($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    msg.setIsBlocked(reader.bool());
                    break;

                case 3:
                    msg.setFuelConsumption(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MovePath {
        return MovePath.decode(this.encode());
    }

    public override getSchemaName(): "MovePath" {
        return "MovePath";
    }

    public getNodes(): $Message$CommonProto$Structure$GridIndex[] {
        return this._nodes;
    }
    public setNodes(value: $Message$CommonProto$Structure$GridIndex[]): void {
        this._nodes = value;
    }

    public checkHasIsBlocked(): boolean {
        return this._isBlocked != null;
    }
    public getIsBlocked(): boolean {
        return this._isBlocked ?? false;
    }
    public setIsBlocked(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isBlocked = null;
        } else {
            this._isBlocked = value;
        }
    }

    public checkHasFuelConsumption(): boolean {
        return this._fuelConsumption != null;
    }
    public getFuelConsumption(): number {
        return this._fuelConsumption ?? 0;
    }
    public setFuelConsumption(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._fuelConsumption = null;
        } else {
            this._fuelConsumption = value;
        }
    }
}
