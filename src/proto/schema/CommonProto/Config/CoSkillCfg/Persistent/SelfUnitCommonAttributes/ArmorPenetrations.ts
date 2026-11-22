import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface ArmorPenetrationsJson extends $ProtoSchemaJsonBase {
    pierceTilePct?: number | null | undefined;
    piercePromotionPct?: number | null | undefined;
    pierceCoPct?: number | null | undefined;
    pierceGlobalTilePct?: number | null | undefined;
    pierceRulePct?: number | null | undefined;
    pierceWarEventPct?: number | null | undefined;
}

export class ArmorPenetrations extends $ProtoSchemaBase {
    private _pierceTilePct?: number | null | undefined;
    private _piercePromotionPct?: number | null | undefined;
    private _pierceCoPct?: number | null | undefined;
    private _pierceGlobalTilePct?: number | null | undefined;
    private _pierceRulePct?: number | null | undefined;
    private _pierceWarEventPct?: number | null | undefined;

    public static fromJson(obj: ArmorPenetrationsJson): ArmorPenetrations {
        return new ArmorPenetrations().loadJson(obj);
    }
    public override loadJson(obj: ArmorPenetrationsJson): this {
        this.setPierceTilePct(obj.pierceTilePct);
        this.setPiercePromotionPct(obj.piercePromotionPct);
        this.setPierceCoPct(obj.pierceCoPct);
        this.setPierceGlobalTilePct(obj.pierceGlobalTilePct);
        this.setPierceRulePct(obj.pierceRulePct);
        this.setPierceWarEventPct(obj.pierceWarEventPct);
        return this;
    }
    public override toJson(obj?: ArmorPenetrationsJson): ArmorPenetrationsJson {
        obj ??= ({} as ArmorPenetrationsJson);

        {
            const value = this.getPierceTilePct();
            (value != null) && (obj.pierceTilePct = value);
        }

        {
            const value = this.getPiercePromotionPct();
            (value != null) && (obj.piercePromotionPct = value);
        }

        {
            const value = this.getPierceCoPct();
            (value != null) && (obj.pierceCoPct = value);
        }

        {
            const value = this.getPierceGlobalTilePct();
            (value != null) && (obj.pierceGlobalTilePct = value);
        }

        {
            const value = this.getPierceRulePct();
            (value != null) && (obj.pierceRulePct = value);
        }

        {
            const value = this.getPierceWarEventPct();
            (value != null) && (obj.pierceWarEventPct = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPierceTilePct();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getPiercePromotionPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getPierceCoPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getPierceGlobalTilePct();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getPierceRulePct();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getPierceWarEventPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ArmorPenetrations {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ArmorPenetrations();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPierceTilePct(reader.int32());
                    break;

                case 2:
                    msg.setPiercePromotionPct(reader.int32());
                    break;

                case 3:
                    msg.setPierceCoPct(reader.int32());
                    break;

                case 4:
                    msg.setPierceGlobalTilePct(reader.int32());
                    break;

                case 5:
                    msg.setPierceRulePct(reader.int32());
                    break;

                case 6:
                    msg.setPierceWarEventPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ArmorPenetrations {
        return ArmorPenetrations.decode(this.encode());
    }

    public override getSchemaName(): "ArmorPenetrations" {
        return "ArmorPenetrations";
    }

    public checkHasPierceTilePct(): boolean {
        return this._pierceTilePct != null;
    }
    public getPierceTilePct(): number {
        return this._pierceTilePct ?? 0;
    }
    public setPierceTilePct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._pierceTilePct = null;
        } else {
            this._pierceTilePct = value;
        }
    }

    public checkHasPiercePromotionPct(): boolean {
        return this._piercePromotionPct != null;
    }
    public getPiercePromotionPct(): number {
        return this._piercePromotionPct ?? 0;
    }
    public setPiercePromotionPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._piercePromotionPct = null;
        } else {
            this._piercePromotionPct = value;
        }
    }

    public checkHasPierceCoPct(): boolean {
        return this._pierceCoPct != null;
    }
    public getPierceCoPct(): number {
        return this._pierceCoPct ?? 0;
    }
    public setPierceCoPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._pierceCoPct = null;
        } else {
            this._pierceCoPct = value;
        }
    }

    public checkHasPierceGlobalTilePct(): boolean {
        return this._pierceGlobalTilePct != null;
    }
    public getPierceGlobalTilePct(): number {
        return this._pierceGlobalTilePct ?? 0;
    }
    public setPierceGlobalTilePct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._pierceGlobalTilePct = null;
        } else {
            this._pierceGlobalTilePct = value;
        }
    }

    public checkHasPierceRulePct(): boolean {
        return this._pierceRulePct != null;
    }
    public getPierceRulePct(): number {
        return this._pierceRulePct ?? 0;
    }
    public setPierceRulePct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._pierceRulePct = null;
        } else {
            this._pierceRulePct = value;
        }
    }

    public checkHasPierceWarEventPct(): boolean {
        return this._pierceWarEventPct != null;
    }
    public getPierceWarEventPct(): number {
        return this._pierceWarEventPct ?? 0;
    }
    public setPierceWarEventPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._pierceWarEventPct = null;
        } else {
            this._pierceWarEventPct = value;
        }
    }
}
