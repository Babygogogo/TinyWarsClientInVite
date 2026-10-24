import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForPlayerBanCo as $Message$CommonProto$Structure$DataForPlayerBanCo, type DataForPlayerBanCoJson as $Json$CommonProto$Structure$DataForPlayerBanCo } from "../Structure/DataForPlayerBanCo.js";

export interface SettingsForMrwJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    dataArrayForBanCo: $Json$CommonProto$Structure$DataForPlayerBanCo[];
    bootTimerParams: number[];
}

export class SettingsForMrw extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _dataArrayForBanCo: $Message$CommonProto$Structure$DataForPlayerBanCo[] = [];
    private _bootTimerParams: number[] = [];

    public static fromJson(obj: SettingsForMrwJson): SettingsForMrw {
        return new SettingsForMrw().loadJson(obj);
    }
    public override loadJson(obj: SettingsForMrwJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setDataArrayForBanCo(obj.dataArrayForBanCo?.map(v => $Message$CommonProto$Structure$DataForPlayerBanCo.fromJson(v)) ?? []);
        this.setBootTimerParams(obj.bootTimerParams?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: SettingsForMrwJson): SettingsForMrwJson {
        obj ??= ({} as SettingsForMrwJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            obj.dataArrayForBanCo = this.getDataArrayForBanCo().map(v => v.toJson());
        }

        {
            obj.bootTimerParams = this.getBootTimerParams().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getDataArrayForBanCo();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getBootTimerParams();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SettingsForMrw {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SettingsForMrw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._dataArrayForBanCo;
                        arr.push($Message$CommonProto$Structure$DataForPlayerBanCo.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    {
                        const arr = msg._bootTimerParams;
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

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SettingsForMrw {
        return SettingsForMrw.decode(this.encode());
    }

    public override getSchemaName(): "SettingsForMrw" {
        return "SettingsForMrw";
    }

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number {
        return this._normalMapId ?? 0;
    }
    public setNormalMapId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._normalMapId = null;
        } else {
            this._normalMapId = value;
        }
    }

    public getDataArrayForBanCo(): $Message$CommonProto$Structure$DataForPlayerBanCo[] {
        return this._dataArrayForBanCo;
    }
    public setDataArrayForBanCo(value: $Message$CommonProto$Structure$DataForPlayerBanCo[]): void {
        this._dataArrayForBanCo = value;
    }

    public getBootTimerParams(): number[] {
        return this._bootTimerParams;
    }
    public setBootTimerParams(value: number[]): void {
        this._bootTimerParams = value;
    }
}
