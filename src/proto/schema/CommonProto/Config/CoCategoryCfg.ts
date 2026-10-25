import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface CoCategoryCfgJson extends $ProtoSchemaJsonBase {
    coCategoryId?: number | null | undefined;
    name?: string | null | undefined;
    bgmCodeArray: number[];
    sort?: number | null | undefined;
}

export class CoCategoryCfg extends $ProtoSchemaBase {
    private _coCategoryId?: number | null | undefined;
    private _name?: string | null | undefined;
    private _bgmCodeArray: number[] = [];
    private _sort?: number | null | undefined;

    public static fromJson(obj: CoCategoryCfgJson): CoCategoryCfg {
        return new CoCategoryCfg().loadJson(obj);
    }
    public override loadJson(obj: CoCategoryCfgJson): this {
        this.setCoCategoryId(obj.coCategoryId);
        this.setName(obj.name);
        this.setBgmCodeArray(obj.bgmCodeArray?.concat() ?? []);
        this.setSort(obj.sort);
        return this;
    }
    public override toJson(obj?: CoCategoryCfgJson): CoCategoryCfgJson {
        obj ??= ({} as CoCategoryCfgJson);

        {
            const value = this.getCoCategoryId();
            (value != null) && (obj.coCategoryId = value);
        }

        {
            const value = this.getName();
            (value != null) && (obj.name = value);
        }

        {
            obj.bgmCodeArray = this.getBgmCodeArray().concat();
        }

        {
            const value = this.getSort();
            (value != null) && (obj.sort = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCoCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getName();
            if ((value != null) && (value != "")) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getBgmCodeArray();
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
            const value = this.getSort();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CoCategoryCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CoCategoryCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoCategoryId(reader.int32());
                    break;

                case 2:
                    msg.setName(reader.string());
                    break;

                case 3:
                    {
                        const arr = msg._bgmCodeArray;
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
                    msg.setSort(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CoCategoryCfg {
        return CoCategoryCfg.decode(this.encode());
    }

    public override getSchemaName(): "CoCategoryCfg" {
        return "CoCategoryCfg";
    }

    public checkHasCoCategoryId(): boolean {
        return this._coCategoryId != null;
    }
    public getCoCategoryId(): number {
        return this._coCategoryId ?? 0;
    }
    public setCoCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coCategoryId = null;
        } else {
            this._coCategoryId = value;
        }
    }

    public checkHasName(): boolean {
        return this._name != null;
    }
    public getName(): string {
        return this._name ?? "";
    }
    public setName(value: string | null | undefined): void {
        if ((value == null) || (value == "")) {
            this._name = null;
        } else {
            this._name = value;
        }
    }

    public getBgmCodeArray(): number[] {
        return this._bgmCodeArray;
    }
    public setBgmCodeArray(value: number[]): void {
        this._bgmCodeArray = value;
    }

    public checkHasSort(): boolean {
        return this._sort != null;
    }
    public getSort(): number {
        return this._sort ?? 0;
    }
    public setSort(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._sort = null;
        } else {
            this._sort = value;
        }
    }
}
