import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface MoveCostsJson extends $ProtoSchemaJsonBase {
    fixedCost?: number | null | undefined;
}

export class MoveCosts extends $ProtoSchemaBase {
    private _fixedCost?: number | null | undefined;

    public static fromJson(obj: MoveCostsJson): MoveCosts {
        return new MoveCosts().loadJson(obj);
    }
    public override loadJson(obj: MoveCostsJson): this {
        this.setFixedCost(obj.fixedCost);
        return this;
    }
    public override toJson(obj?: MoveCostsJson): MoveCostsJson {
        obj ??= ({} as MoveCostsJson);

        {
            const value = this.getFixedCost();
            (value != null) && (obj.fixedCost = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getFixedCost();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MoveCosts {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MoveCosts();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setFixedCost(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MoveCosts {
        return MoveCosts.decode(this.encode());
    }

    public override getSchemaName(): "MoveCosts" {
        return "MoveCosts";
    }

    public checkHasFixedCost(): boolean {
        return this._fixedCost != null;
    }
    public getFixedCost(): number | null | undefined {
        return this._fixedCost;
    }
    public setFixedCost(value: number | null | undefined): void {
        this._fixedCost = value;
    }
}
