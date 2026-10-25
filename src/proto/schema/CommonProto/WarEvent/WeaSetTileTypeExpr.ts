import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetTileTypeExprJson extends $ProtoSchemaJsonBase {
    conTileFilter?: string | null | undefined;
    actBaseType?: string | null | undefined;
    actBaseShapeId?: string | null | undefined;
    actObjectType?: string | null | undefined;
    actObjectShapeId?: string | null | undefined;
    actDecorationType?: string | null | undefined;
    actDecorationShapeId?: string | null | undefined;
    actUnitHandler?: string | null | undefined;
    actUnitFilter?: string | null | undefined;
}

export class WeaSetTileTypeExpr extends $ProtoSchemaBase {
    private _conTileFilter?: string | null | undefined;
    private _actBaseType?: string | null | undefined;
    private _actBaseShapeId?: string | null | undefined;
    private _actObjectType?: string | null | undefined;
    private _actObjectShapeId?: string | null | undefined;
    private _actDecorationType?: string | null | undefined;
    private _actDecorationShapeId?: string | null | undefined;
    private _actUnitHandler?: string | null | undefined;
    private _actUnitFilter?: string | null | undefined;

    public static fromJson(obj: WeaSetTileTypeExprJson): WeaSetTileTypeExpr {
        return new WeaSetTileTypeExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetTileTypeExprJson): this {
        this.setConTileFilter(obj.conTileFilter);
        this.setActBaseType(obj.actBaseType);
        this.setActBaseShapeId(obj.actBaseShapeId);
        this.setActObjectType(obj.actObjectType);
        this.setActObjectShapeId(obj.actObjectShapeId);
        this.setActDecorationType(obj.actDecorationType);
        this.setActDecorationShapeId(obj.actDecorationShapeId);
        this.setActUnitHandler(obj.actUnitHandler);
        this.setActUnitFilter(obj.actUnitFilter);
        return this;
    }
    public override toJson(obj?: WeaSetTileTypeExprJson): WeaSetTileTypeExprJson {
        obj ??= ({} as WeaSetTileTypeExprJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value);
        }

        {
            const value = this.getActBaseType();
            (value != null) && (obj.actBaseType = value);
        }

        {
            const value = this.getActBaseShapeId();
            (value != null) && (obj.actBaseShapeId = value);
        }

        {
            const value = this.getActObjectType();
            (value != null) && (obj.actObjectType = value);
        }

        {
            const value = this.getActObjectShapeId();
            (value != null) && (obj.actObjectShapeId = value);
        }

        {
            const value = this.getActDecorationType();
            (value != null) && (obj.actDecorationType = value);
        }

        {
            const value = this.getActDecorationShapeId();
            (value != null) && (obj.actDecorationShapeId = value);
        }

        {
            const value = this.getActUnitHandler();
            (value != null) && (obj.actUnitHandler = value);
        }

        {
            const value = this.getActUnitFilter();
            (value != null) && (obj.actUnitFilter = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConTileFilter();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getActBaseType();
            if (value != null) {
                writer.uint32(82).string(value);
            }
        }

        {
            const value = this.getActBaseShapeId();
            if (value != null) {
                writer.uint32(90).string(value);
            }
        }

        {
            const value = this.getActObjectType();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getActObjectShapeId();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getActDecorationType();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        {
            const value = this.getActDecorationShapeId();
            if (value != null) {
                writer.uint32(122).string(value);
            }
        }

        {
            const value = this.getActUnitHandler();
            if (value != null) {
                writer.uint32(130).string(value);
            }
        }

        {
            const value = this.getActUnitFilter();
            if (value != null) {
                writer.uint32(138).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetTileTypeExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetTileTypeExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter(reader.string());
                    break;

                case 10:
                    msg.setActBaseType(reader.string());
                    break;

                case 11:
                    msg.setActBaseShapeId(reader.string());
                    break;

                case 12:
                    msg.setActObjectType(reader.string());
                    break;

                case 13:
                    msg.setActObjectShapeId(reader.string());
                    break;

                case 14:
                    msg.setActDecorationType(reader.string());
                    break;

                case 15:
                    msg.setActDecorationShapeId(reader.string());
                    break;

                case 16:
                    msg.setActUnitHandler(reader.string());
                    break;

                case 17:
                    msg.setActUnitFilter(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetTileTypeExpr {
        return WeaSetTileTypeExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetTileTypeExpr" {
        return "WeaSetTileTypeExpr";
    }

    public checkHasConTileFilter(): boolean {
        return this._conTileFilter != null;
    }
    public getConTileFilter(): string | null | undefined {
        return this._conTileFilter;
    }
    public setConTileFilter(value: string | null | undefined): void {
        this._conTileFilter = value;
    }

    public checkHasActBaseType(): boolean {
        return this._actBaseType != null;
    }
    public getActBaseType(): string | null | undefined {
        return this._actBaseType;
    }
    public setActBaseType(value: string | null | undefined): void {
        this._actBaseType = value;
    }

    public checkHasActBaseShapeId(): boolean {
        return this._actBaseShapeId != null;
    }
    public getActBaseShapeId(): string | null | undefined {
        return this._actBaseShapeId;
    }
    public setActBaseShapeId(value: string | null | undefined): void {
        this._actBaseShapeId = value;
    }

    public checkHasActObjectType(): boolean {
        return this._actObjectType != null;
    }
    public getActObjectType(): string | null | undefined {
        return this._actObjectType;
    }
    public setActObjectType(value: string | null | undefined): void {
        this._actObjectType = value;
    }

    public checkHasActObjectShapeId(): boolean {
        return this._actObjectShapeId != null;
    }
    public getActObjectShapeId(): string | null | undefined {
        return this._actObjectShapeId;
    }
    public setActObjectShapeId(value: string | null | undefined): void {
        this._actObjectShapeId = value;
    }

    public checkHasActDecorationType(): boolean {
        return this._actDecorationType != null;
    }
    public getActDecorationType(): string | null | undefined {
        return this._actDecorationType;
    }
    public setActDecorationType(value: string | null | undefined): void {
        this._actDecorationType = value;
    }

    public checkHasActDecorationShapeId(): boolean {
        return this._actDecorationShapeId != null;
    }
    public getActDecorationShapeId(): string | null | undefined {
        return this._actDecorationShapeId;
    }
    public setActDecorationShapeId(value: string | null | undefined): void {
        this._actDecorationShapeId = value;
    }

    public checkHasActUnitHandler(): boolean {
        return this._actUnitHandler != null;
    }
    public getActUnitHandler(): string | null | undefined {
        return this._actUnitHandler;
    }
    public setActUnitHandler(value: string | null | undefined): void {
        this._actUnitHandler = value;
    }

    public checkHasActUnitFilter(): boolean {
        return this._actUnitFilter != null;
    }
    public getActUnitFilter(): string | null | undefined {
        return this._actUnitFilter;
    }
    public setActUnitFilter(value: string | null | undefined): void {
        this._actUnitFilter = value;
    }
}
