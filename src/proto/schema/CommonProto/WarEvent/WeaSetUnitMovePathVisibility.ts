import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetUnitMovePathVisibilityJson extends $ProtoSchemaJsonBase {
    conPositionFilter?: string | null | undefined;
    actVisibilityArray?: string | null | undefined;
}

export class WeaSetUnitMovePathVisibility extends $ProtoSchemaBase {
    private _conPositionFilter?: string | null | undefined;
    private _actVisibilityArray?: string | null | undefined;

    public static fromJson(obj: WeaSetUnitMovePathVisibilityJson): WeaSetUnitMovePathVisibility {
        return new WeaSetUnitMovePathVisibility().loadJson(obj);
    }
    public override loadJson(obj: WeaSetUnitMovePathVisibilityJson): this {
        this.setConPositionFilter(obj.conPositionFilter);
        this.setActVisibilityArray(obj.actVisibilityArray);
        return this;
    }
    public override toJson(obj?: WeaSetUnitMovePathVisibilityJson): WeaSetUnitMovePathVisibilityJson {
        obj ??= ({} as WeaSetUnitMovePathVisibilityJson);

        {
            const value = this.getConPositionFilter();
            (value != null) && (obj.conPositionFilter = value);
        }

        {
            const value = this.getActVisibilityArray();
            (value != null) && (obj.actVisibilityArray = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConPositionFilter();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getActVisibilityArray();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetUnitMovePathVisibility {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetUnitMovePathVisibility();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConPositionFilter(reader.string());
                    break;

                case 2:
                    msg.setActVisibilityArray(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetUnitMovePathVisibility {
        return WeaSetUnitMovePathVisibility.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetUnitMovePathVisibility" {
        return "WeaSetUnitMovePathVisibility";
    }

    public checkHasConPositionFilter(): boolean {
        return this._conPositionFilter != null;
    }
    public getConPositionFilter(): string | null | undefined {
        return this._conPositionFilter;
    }
    public setConPositionFilter(value: string | null | undefined): void {
        this._conPositionFilter = value;
    }

    public checkHasActVisibilityArray(): boolean {
        return this._actVisibilityArray != null;
    }
    public getActVisibilityArray(): string | null | undefined {
        return this._actVisibilityArray;
    }
    public setActVisibilityArray(value: string | null | undefined): void {
        this._actVisibilityArray = value;
    }
}
