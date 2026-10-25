import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SeedRandomStateJson extends $ProtoSchemaJsonBase {
    i?: number | null | undefined;
    j?: number | null | undefined;
    S: number[];
}

export class SeedRandomState extends $ProtoSchemaBase {
    private _i?: number | null | undefined;
    private _j?: number | null | undefined;
    private _S: number[] = [];

    public static fromJson(obj: SeedRandomStateJson): SeedRandomState {
        return new SeedRandomState().loadJson(obj);
    }
    public override loadJson(obj: SeedRandomStateJson): this {
        this.setI(obj.i);
        this.setJ(obj.j);
        this.setS(obj.S?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: SeedRandomStateJson): SeedRandomStateJson {
        obj ??= ({} as SeedRandomStateJson);

        {
            const value = this.getI();
            (value != null) && (obj.i = value);
        }

        {
            const value = this.getJ();
            (value != null) && (obj.j = value);
        }

        {
            obj.S = this.getS().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getI();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getJ();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getS();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SeedRandomState {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SeedRandomState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setI(reader.int32());
                    break;

                case 2:
                    msg.setJ(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._S;
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

    public override clone(): SeedRandomState {
        return SeedRandomState.decode(this.encode());
    }

    public override getSchemaName(): "SeedRandomState" {
        return "SeedRandomState";
    }

    public checkHasI(): boolean {
        return this._i != null;
    }
    public getI(): number {
        return this._i ?? 0;
    }
    public setI(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._i = null;
        } else {
            this._i = value;
        }
    }

    public checkHasJ(): boolean {
        return this._j != null;
    }
    public getJ(): number {
        return this._j ?? 0;
    }
    public setJ(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._j = null;
        } else {
            this._j = value;
        }
    }

    public getS(): number[] {
        return this._S;
    }
    public setS(value: number[]): void {
        this._S = value;
    }
}
