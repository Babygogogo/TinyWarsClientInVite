import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "./GridIndex.js";

export interface GridIndexArrayAndPredicateJson extends $ProtoSchemaJsonBase {
    gridIndexArray: $Json$CommonProto$Structure$GridIndex[];
    isOneOf?: boolean | null | undefined;
}

export class GridIndexArrayAndPredicate extends $ProtoSchemaBase {
    private _gridIndexArray: $Message$CommonProto$Structure$GridIndex[] = [];
    private _isOneOf?: boolean | null | undefined;

    public static fromJson(obj: GridIndexArrayAndPredicateJson): GridIndexArrayAndPredicate {
        return new GridIndexArrayAndPredicate().loadJson(obj);
    }
    public override loadJson(obj: GridIndexArrayAndPredicateJson): this {
        this.setGridIndexArray(obj.gridIndexArray?.map(v => $Message$CommonProto$Structure$GridIndex.fromJson(v)) ?? []);
        this.setIsOneOf(obj.isOneOf);
        return this;
    }
    public override toJson(obj?: GridIndexArrayAndPredicateJson): GridIndexArrayAndPredicateJson {
        obj ??= ({} as GridIndexArrayAndPredicateJson);

        {
            obj.gridIndexArray = this.getGridIndexArray().map(v => v.toJson());
        }

        {
            const value = this.getIsOneOf();
            (value != null) && (obj.isOneOf = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getGridIndexArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getIsOneOf();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): GridIndexArrayAndPredicate {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new GridIndexArrayAndPredicate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._gridIndexArray;
                        arr.push($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    msg.setIsOneOf(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): GridIndexArrayAndPredicate {
        return GridIndexArrayAndPredicate.decode(this.encode());
    }

    public override getSchemaName(): "GridIndexArrayAndPredicate" {
        return "GridIndexArrayAndPredicate";
    }

    public getGridIndexArray(): $Message$CommonProto$Structure$GridIndex[] {
        return this._gridIndexArray;
    }
    public setGridIndexArray(value: $Message$CommonProto$Structure$GridIndex[]): void {
        this._gridIndexArray = value;
    }

    public checkHasIsOneOf(): boolean {
        return this._isOneOf != null;
    }
    public getIsOneOf(): boolean {
        return this._isOneOf ?? false;
    }
    public setIsOneOf(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isOneOf = null;
        } else {
            this._isOneOf = value;
        }
    }
}
