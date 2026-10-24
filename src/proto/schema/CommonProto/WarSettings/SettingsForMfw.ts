import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SerialWar as $Message$CommonProto$WarSerialization$SerialWar, type SerialWarJson as $Json$CommonProto$WarSerialization$SerialWar } from "../WarSerialization/SerialWar.js";

export interface SettingsForMfwJson extends $ProtoSchemaJsonBase {
    initialWarData?: $Json$CommonProto$WarSerialization$SerialWar | null | undefined;
    warName?: string | null | undefined;
    warPassword?: string | null | undefined;
    warComment?: string | null | undefined;
    bootTimerParams: number[];
}

export class SettingsForMfw extends $ProtoSchemaBase {
    private _initialWarData?: $Message$CommonProto$WarSerialization$SerialWar | null | undefined;
    private _warName?: string | null | undefined;
    private _warPassword?: string | null | undefined;
    private _warComment?: string | null | undefined;
    private _bootTimerParams: number[] = [];

    public static fromJson(obj: SettingsForMfwJson): SettingsForMfw {
        return new SettingsForMfw().loadJson(obj);
    }
    public override loadJson(obj: SettingsForMfwJson): this {
        this.setInitialWarData(obj.initialWarData != null ? $Message$CommonProto$WarSerialization$SerialWar.fromJson(obj.initialWarData) : null);
        this.setWarName(obj.warName);
        this.setWarPassword(obj.warPassword);
        this.setWarComment(obj.warComment);
        this.setBootTimerParams(obj.bootTimerParams?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: SettingsForMfwJson): SettingsForMfwJson {
        obj ??= ({} as SettingsForMfwJson);

        {
            const value = this.getInitialWarData();
            (value != null) && (obj.initialWarData = value.toJson());
        }

        {
            const value = this.getWarName();
            (value != null) && (obj.warName = value);
        }

        {
            const value = this.getWarPassword();
            (value != null) && (obj.warPassword = value);
        }

        {
            const value = this.getWarComment();
            (value != null) && (obj.warComment = value);
        }

        {
            obj.bootTimerParams = this.getBootTimerParams().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getInitialWarData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getWarName();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getWarPassword();
            if (value != null) {
                writer.uint32(26).string(value);
            }
        }

        {
            const value = this.getWarComment();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        {
            const value = this.getBootTimerParams();
            const length = value.length;
            if (length) {
                writer.uint32(42).fork();
                for (let i = 0; i < length; ++i) {
                    writer.sint32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SettingsForMfw {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SettingsForMfw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setInitialWarData($Message$CommonProto$WarSerialization$SerialWar.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setWarName(reader.string());
                    break;

                case 3:
                    msg.setWarPassword(reader.string());
                    break;

                case 4:
                    msg.setWarComment(reader.string());
                    break;

                case 5:
                    {
                        const arr = msg._bootTimerParams;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.sint32());
                            }
                        } else {
                            arr.push(reader.sint32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SettingsForMfw {
        return SettingsForMfw.decode(this.encode());
    }

    public override getSchemaName(): "SettingsForMfw" {
        return "SettingsForMfw";
    }

    public checkHasInitialWarData(): boolean {
        return this._initialWarData != null;
    }
    public getInitialWarData(): $Message$CommonProto$WarSerialization$SerialWar | null | undefined {
        return this._initialWarData;
    }
    public setInitialWarData(value: $Message$CommonProto$WarSerialization$SerialWar | null | undefined): void {
        this._initialWarData = value;
    }
    public createIfNotExistsInitialWarData(): $Message$CommonProto$WarSerialization$SerialWar {
        return this._initialWarData ??= new $Message$CommonProto$WarSerialization$SerialWar();
    }

    public checkHasWarName(): boolean {
        return this._warName != null;
    }
    public getWarName(): string | null | undefined {
        return this._warName;
    }
    public setWarName(value: string | null | undefined): void {
        this._warName = value;
    }

    public checkHasWarPassword(): boolean {
        return this._warPassword != null;
    }
    public getWarPassword(): string | null | undefined {
        return this._warPassword;
    }
    public setWarPassword(value: string | null | undefined): void {
        this._warPassword = value;
    }

    public checkHasWarComment(): boolean {
        return this._warComment != null;
    }
    public getWarComment(): string | null | undefined {
        return this._warComment;
    }
    public setWarComment(value: string | null | undefined): void {
        this._warComment = value;
    }

    public getBootTimerParams(): number[] {
        return this._bootTimerParams;
    }
    public setBootTimerParams(value: number[]): void {
        this._bootTimerParams = value;
    }
}
