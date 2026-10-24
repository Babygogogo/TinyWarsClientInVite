import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetViewpointExprJson extends $ProtoSchemaJsonBase {
    targets?: string | null | undefined;
    needFocusEffect?: string | null | undefined;
    isOneByOne?: string | null | undefined;
    interval?: string | null | undefined;
}

export class WeaSetViewpointExpr extends $ProtoSchemaBase {
    private _targets?: string | null | undefined;
    private _needFocusEffect?: string | null | undefined;
    private _isOneByOne?: string | null | undefined;
    private _interval?: string | null | undefined;

    public static fromJson(obj: WeaSetViewpointExprJson): WeaSetViewpointExpr {
        return new WeaSetViewpointExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetViewpointExprJson): this {
        this.setTargets(obj.targets);
        this.setNeedFocusEffect(obj.needFocusEffect);
        this.setIsOneByOne(obj.isOneByOne);
        this.setInterval(obj.interval);
        return this;
    }
    public override toJson(obj?: WeaSetViewpointExprJson): WeaSetViewpointExprJson {
        obj ??= ({} as WeaSetViewpointExprJson);

        {
            const value = this.getTargets();
            (value != null) && (obj.targets = value);
        }

        {
            const value = this.getNeedFocusEffect();
            (value != null) && (obj.needFocusEffect = value);
        }

        {
            const value = this.getIsOneByOne();
            (value != null) && (obj.isOneByOne = value);
        }

        {
            const value = this.getInterval();
            (value != null) && (obj.interval = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTargets();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getNeedFocusEffect();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getIsOneByOne();
            if (value != null) {
                writer.uint32(26).string(value);
            }
        }

        {
            const value = this.getInterval();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetViewpointExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetViewpointExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTargets(reader.string());
                    break;

                case 2:
                    msg.setNeedFocusEffect(reader.string());
                    break;

                case 3:
                    msg.setIsOneByOne(reader.string());
                    break;

                case 4:
                    msg.setInterval(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetViewpointExpr {
        return WeaSetViewpointExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetViewpointExpr" {
        return "WeaSetViewpointExpr";
    }

    public checkHasTargets(): boolean {
        return this._targets != null;
    }
    public getTargets(): string | null | undefined {
        return this._targets;
    }
    public setTargets(value: string | null | undefined): void {
        this._targets = value;
    }

    public checkHasNeedFocusEffect(): boolean {
        return this._needFocusEffect != null;
    }
    public getNeedFocusEffect(): string | null | undefined {
        return this._needFocusEffect;
    }
    public setNeedFocusEffect(value: string | null | undefined): void {
        this._needFocusEffect = value;
    }

    public checkHasIsOneByOne(): boolean {
        return this._isOneByOne != null;
    }
    public getIsOneByOne(): string | null | undefined {
        return this._isOneByOne;
    }
    public setIsOneByOne(value: string | null | undefined): void {
        this._isOneByOne = value;
    }

    public checkHasInterval(): boolean {
        return this._interval != null;
    }
    public getInterval(): string | null | undefined {
        return this._interval;
    }
    public setInterval(value: string | null | undefined): void {
        this._interval = value;
    }
}
