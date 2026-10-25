import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface GlobalSettingsJson extends $ProtoSchemaJsonBase {
    isEnabled?: boolean | null | undefined;
    interval?: number | null | undefined;
}

export class GlobalSettings extends $ProtoSchemaBase {
    private _isEnabled?: boolean | null | undefined;
    private _interval?: number | null | undefined;

    public static fromJson(obj: GlobalSettingsJson): GlobalSettings {
        return new GlobalSettings().loadJson(obj);
    }
    public override loadJson(obj: GlobalSettingsJson): this {
        this.setIsEnabled(obj.isEnabled);
        this.setInterval(obj.interval);
        return this;
    }
    public override toJson(obj?: GlobalSettingsJson): GlobalSettingsJson {
        obj ??= ({} as GlobalSettingsJson);

        {
            const value = this.getIsEnabled();
            (value != null) && (obj.isEnabled = value);
        }

        {
            const value = this.getInterval();
            (value != null) && (obj.interval = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIsEnabled();
            if ((value != null) && (value != false)) {
                writer.uint32(8).bool(value);
            }
        }

        {
            const value = this.getInterval();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): GlobalSettings {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new GlobalSettings();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsEnabled(reader.bool());
                    break;

                case 2:
                    msg.setInterval(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): GlobalSettings {
        return GlobalSettings.decode(this.encode());
    }

    public override getSchemaName(): "GlobalSettings" {
        return "GlobalSettings";
    }

    public checkHasIsEnabled(): boolean {
        return this._isEnabled != null;
    }
    public getIsEnabled(): boolean {
        return this._isEnabled ?? false;
    }
    public setIsEnabled(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEnabled = null;
        } else {
            this._isEnabled = value;
        }
    }

    public checkHasInterval(): boolean {
        return this._interval != null;
    }
    public getInterval(): number {
        return this._interval ?? 0;
    }
    public setInterval(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._interval = null;
        } else {
            this._interval = value;
        }
    }
}
