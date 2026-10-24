import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    gridIdArrayForAddMark: number[];
    gridIdArrayForDeleteMark: number[];
    markTypeId?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _gridIdArrayForAddMark: number[] = [];
    private _gridIdArrayForDeleteMark: number[] = [];
    private _markTypeId?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setWarId(obj.warId);
        this.setGridIdArrayForAddMark(obj.gridIdArrayForAddMark?.concat() ?? []);
        this.setGridIdArrayForDeleteMark(obj.gridIdArrayForDeleteMark?.concat() ?? []);
        this.setMarkTypeId(obj.markTypeId);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            obj.gridIdArrayForAddMark = this.getGridIdArrayForAddMark().concat();
        }

        {
            obj.gridIdArrayForDeleteMark = this.getGridIdArrayForDeleteMark().concat();
        }

        {
            const value = this.getMarkTypeId();
            (value != null) && (obj.markTypeId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getGridIdArrayForAddMark();
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
            const value = this.getGridIdArrayForDeleteMark();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getMarkTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
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
                        const arr = msg._gridIdArrayForAddMark;
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
                        const arr = msg._gridIdArrayForDeleteMark;
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

                case 4:
                    msg.setMarkTypeId(reader.int32());
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
    public getWarId(): number {
        return this._warId ?? 0;
    }
    public setWarId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._warId = null;
        } else {
            this._warId = value;
        }
    }

    public getGridIdArrayForAddMark(): number[] {
        return this._gridIdArrayForAddMark;
    }
    public setGridIdArrayForAddMark(value: number[]): void {
        this._gridIdArrayForAddMark = value;
    }

    public getGridIdArrayForDeleteMark(): number[] {
        return this._gridIdArrayForDeleteMark;
    }
    public setGridIdArrayForDeleteMark(value: number[]): void {
        this._gridIdArrayForDeleteMark = value;
    }

    public checkHasMarkTypeId(): boolean {
        return this._markTypeId != null;
    }
    public getMarkTypeId(): number {
        return this._markTypeId ?? 0;
    }
    public setMarkTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._markTypeId = null;
        } else {
            this._markTypeId = value;
        }
    }
}
