import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UserOpacitySettingsJson extends $ProtoSchemaJsonBase {
    unitOpacity?: number | null | undefined;
    tileBaseOpacity?: number | null | undefined;
    tileObjectOpacity?: number | null | undefined;
    tileDecorationOpacity?: number | null | undefined;
}

export class UserOpacitySettings extends $ProtoSchemaBase {
    private _unitOpacity?: number | null | undefined;
    private _tileBaseOpacity?: number | null | undefined;
    private _tileObjectOpacity?: number | null | undefined;
    private _tileDecorationOpacity?: number | null | undefined;

    public static fromJson(obj: UserOpacitySettingsJson): UserOpacitySettings {
        return new UserOpacitySettings().loadJson(obj);
    }
    public override loadJson(obj: UserOpacitySettingsJson): this {
        this.setUnitOpacity(obj.unitOpacity);
        this.setTileBaseOpacity(obj.tileBaseOpacity);
        this.setTileObjectOpacity(obj.tileObjectOpacity);
        this.setTileDecorationOpacity(obj.tileDecorationOpacity);
        return this;
    }
    public override toJson(obj?: UserOpacitySettingsJson): UserOpacitySettingsJson {
        obj ??= ({} as UserOpacitySettingsJson);

        {
            const value = this.getUnitOpacity();
            (value != null) && (obj.unitOpacity = value);
        }

        {
            const value = this.getTileBaseOpacity();
            (value != null) && (obj.tileBaseOpacity = value);
        }

        {
            const value = this.getTileObjectOpacity();
            (value != null) && (obj.tileObjectOpacity = value);
        }

        {
            const value = this.getTileDecorationOpacity();
            (value != null) && (obj.tileDecorationOpacity = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitOpacity();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTileBaseOpacity();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTileObjectOpacity();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getTileDecorationOpacity();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserOpacitySettings {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserOpacitySettings();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitOpacity(reader.int32());
                    break;

                case 2:
                    msg.setTileBaseOpacity(reader.int32());
                    break;

                case 3:
                    msg.setTileObjectOpacity(reader.int32());
                    break;

                case 4:
                    msg.setTileDecorationOpacity(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserOpacitySettings {
        return UserOpacitySettings.decode(this.encode());
    }

    public override getSchemaName(): "UserOpacitySettings" {
        return "UserOpacitySettings";
    }

    public checkHasUnitOpacity(): boolean {
        return this._unitOpacity != null;
    }
    public getUnitOpacity(): number | null | undefined {
        return this._unitOpacity;
    }
    public setUnitOpacity(value: number | null | undefined): void {
        this._unitOpacity = value;
    }

    public checkHasTileBaseOpacity(): boolean {
        return this._tileBaseOpacity != null;
    }
    public getTileBaseOpacity(): number | null | undefined {
        return this._tileBaseOpacity;
    }
    public setTileBaseOpacity(value: number | null | undefined): void {
        this._tileBaseOpacity = value;
    }

    public checkHasTileObjectOpacity(): boolean {
        return this._tileObjectOpacity != null;
    }
    public getTileObjectOpacity(): number | null | undefined {
        return this._tileObjectOpacity;
    }
    public setTileObjectOpacity(value: number | null | undefined): void {
        this._tileObjectOpacity = value;
    }

    public checkHasTileDecorationOpacity(): boolean {
        return this._tileDecorationOpacity != null;
    }
    public getTileDecorationOpacity(): number | null | undefined {
        return this._tileDecorationOpacity;
    }
    public setTileDecorationOpacity(value: number | null | undefined): void {
        this._tileDecorationOpacity = value;
    }
}
