import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetTileStateExprJson extends $ProtoSchemaJsonBase {
    conTileFilter?: string | null | undefined;
    actPlayerIndex?: string | null | undefined;
    actCurrentHp?: string | null | undefined;
    actCurrentBuildPoint?: string | null | undefined;
    actCurrentCapturePoint?: string | null | undefined;
    actIsHighlighted?: string | null | undefined;
    actGroupedLocationIdArray?: string | null | undefined;
    actCustomNameId?: string | null | undefined;
}

export class WeaSetTileStateExpr extends $ProtoSchemaBase {
    private _conTileFilter?: string | null | undefined;
    private _actPlayerIndex?: string | null | undefined;
    private _actCurrentHp?: string | null | undefined;
    private _actCurrentBuildPoint?: string | null | undefined;
    private _actCurrentCapturePoint?: string | null | undefined;
    private _actIsHighlighted?: string | null | undefined;
    private _actGroupedLocationIdArray?: string | null | undefined;
    private _actCustomNameId?: string | null | undefined;

    public static fromJson(obj: WeaSetTileStateExprJson): WeaSetTileStateExpr {
        return new WeaSetTileStateExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetTileStateExprJson): this {
        this.setConTileFilter(obj.conTileFilter);
        this.setActPlayerIndex(obj.actPlayerIndex);
        this.setActCurrentHp(obj.actCurrentHp);
        this.setActCurrentBuildPoint(obj.actCurrentBuildPoint);
        this.setActCurrentCapturePoint(obj.actCurrentCapturePoint);
        this.setActIsHighlighted(obj.actIsHighlighted);
        this.setActGroupedLocationIdArray(obj.actGroupedLocationIdArray);
        this.setActCustomNameId(obj.actCustomNameId);
        return this;
    }
    public override toJson(obj?: WeaSetTileStateExprJson): WeaSetTileStateExprJson {
        obj ??= ({} as WeaSetTileStateExprJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value);
        }

        {
            const value = this.getActPlayerIndex();
            (value != null) && (obj.actPlayerIndex = value);
        }

        {
            const value = this.getActCurrentHp();
            (value != null) && (obj.actCurrentHp = value);
        }

        {
            const value = this.getActCurrentBuildPoint();
            (value != null) && (obj.actCurrentBuildPoint = value);
        }

        {
            const value = this.getActCurrentCapturePoint();
            (value != null) && (obj.actCurrentCapturePoint = value);
        }

        {
            const value = this.getActIsHighlighted();
            (value != null) && (obj.actIsHighlighted = value);
        }

        {
            const value = this.getActGroupedLocationIdArray();
            (value != null) && (obj.actGroupedLocationIdArray = value);
        }

        {
            const value = this.getActCustomNameId();
            (value != null) && (obj.actCustomNameId = value);
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
            const value = this.getActPlayerIndex();
            if (value != null) {
                writer.uint32(82).string(value);
            }
        }

        {
            const value = this.getActCurrentHp();
            if (value != null) {
                writer.uint32(90).string(value);
            }
        }

        {
            const value = this.getActCurrentBuildPoint();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getActCurrentCapturePoint();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getActIsHighlighted();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        {
            const value = this.getActGroupedLocationIdArray();
            if (value != null) {
                writer.uint32(122).string(value);
            }
        }

        {
            const value = this.getActCustomNameId();
            if (value != null) {
                writer.uint32(130).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetTileStateExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetTileStateExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter(reader.string());
                    break;

                case 10:
                    msg.setActPlayerIndex(reader.string());
                    break;

                case 11:
                    msg.setActCurrentHp(reader.string());
                    break;

                case 12:
                    msg.setActCurrentBuildPoint(reader.string());
                    break;

                case 13:
                    msg.setActCurrentCapturePoint(reader.string());
                    break;

                case 14:
                    msg.setActIsHighlighted(reader.string());
                    break;

                case 15:
                    msg.setActGroupedLocationIdArray(reader.string());
                    break;

                case 16:
                    msg.setActCustomNameId(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetTileStateExpr {
        return WeaSetTileStateExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetTileStateExpr" {
        return "WeaSetTileStateExpr";
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

    public checkHasActPlayerIndex(): boolean {
        return this._actPlayerIndex != null;
    }
    public getActPlayerIndex(): string | null | undefined {
        return this._actPlayerIndex;
    }
    public setActPlayerIndex(value: string | null | undefined): void {
        this._actPlayerIndex = value;
    }

    public checkHasActCurrentHp(): boolean {
        return this._actCurrentHp != null;
    }
    public getActCurrentHp(): string | null | undefined {
        return this._actCurrentHp;
    }
    public setActCurrentHp(value: string | null | undefined): void {
        this._actCurrentHp = value;
    }

    public checkHasActCurrentBuildPoint(): boolean {
        return this._actCurrentBuildPoint != null;
    }
    public getActCurrentBuildPoint(): string | null | undefined {
        return this._actCurrentBuildPoint;
    }
    public setActCurrentBuildPoint(value: string | null | undefined): void {
        this._actCurrentBuildPoint = value;
    }

    public checkHasActCurrentCapturePoint(): boolean {
        return this._actCurrentCapturePoint != null;
    }
    public getActCurrentCapturePoint(): string | null | undefined {
        return this._actCurrentCapturePoint;
    }
    public setActCurrentCapturePoint(value: string | null | undefined): void {
        this._actCurrentCapturePoint = value;
    }

    public checkHasActIsHighlighted(): boolean {
        return this._actIsHighlighted != null;
    }
    public getActIsHighlighted(): string | null | undefined {
        return this._actIsHighlighted;
    }
    public setActIsHighlighted(value: string | null | undefined): void {
        this._actIsHighlighted = value;
    }

    public checkHasActGroupedLocationIdArray(): boolean {
        return this._actGroupedLocationIdArray != null;
    }
    public getActGroupedLocationIdArray(): string | null | undefined {
        return this._actGroupedLocationIdArray;
    }
    public setActGroupedLocationIdArray(value: string | null | undefined): void {
        this._actGroupedLocationIdArray = value;
    }

    public checkHasActCustomNameId(): boolean {
        return this._actCustomNameId != null;
    }
    public getActCustomNameId(): string | null | undefined {
        return this._actCustomNameId;
    }
    public setActCustomNameId(value: string | null | undefined): void {
        this._actCustomNameId = value;
    }
}
