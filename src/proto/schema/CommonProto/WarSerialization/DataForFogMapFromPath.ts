import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface DataForFogMapFromPathJson extends $ProtoSchemaJsonBase {
    playerIndex?: number | null | undefined;
    visibilityArray: number[];
}

export class DataForFogMapFromPath extends $ProtoSchemaBase {
    private _playerIndex?: number | null | undefined;
    private _visibilityArray: number[] = [];

    public static fromJson(obj: DataForFogMapFromPathJson): DataForFogMapFromPath {
        return new DataForFogMapFromPath().loadJson(obj);
    }
    public override loadJson(obj: DataForFogMapFromPathJson): this {
        this.setPlayerIndex(obj.playerIndex);
        this.setVisibilityArray(obj.visibilityArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: DataForFogMapFromPathJson): DataForFogMapFromPathJson {
        obj ??= ({} as DataForFogMapFromPathJson);

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            obj.visibilityArray = this.getVisibilityArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getVisibilityArray();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForFogMapFromPath {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForFogMapFromPath();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._visibilityArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForFogMapFromPath {
        return DataForFogMapFromPath.decode(this.encode());
    }

    public override getSchemaName(): "DataForFogMapFromPath" {
        return "DataForFogMapFromPath";
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number {
        return this._playerIndex ?? 0;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._playerIndex = null;
        } else {
            this._playerIndex = value;
        }
    }

    public getVisibilityArray(): number[] {
        return this._visibilityArray;
    }
    public setVisibilityArray(value: number[]): void {
        this._visibilityArray = value;
    }
}
