import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    acceptSrcUserIds: number[];
    declineSrcUserIds: number[];
}

export class C extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _acceptSrcUserIds: number[] = [];
    private _declineSrcUserIds: number[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setWarId(obj.warId);
        this.setAcceptSrcUserIds(obj.acceptSrcUserIds?.concat() ?? []);
        this.setDeclineSrcUserIds(obj.declineSrcUserIds?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            obj.acceptSrcUserIds = this.getAcceptSrcUserIds().concat();
        }

        {
            obj.declineSrcUserIds = this.getDeclineSrcUserIds().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getAcceptSrcUserIds();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getDeclineSrcUserIds();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._acceptSrcUserIds;
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

                case 3:
                    {
                        const arr = msg._declineSrcUserIds;
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

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
    }

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
    }

    public getAcceptSrcUserIds(): number[] {
        return this._acceptSrcUserIds;
    }
    public setAcceptSrcUserIds(value: number[]): void {
        this._acceptSrcUserIds = value;
    }

    public getDeclineSrcUserIds(): number[] {
        return this._declineSrcUserIds;
    }
    public setDeclineSrcUserIds(value: number[]): void {
        this._declineSrcUserIds = value;
    }
}
