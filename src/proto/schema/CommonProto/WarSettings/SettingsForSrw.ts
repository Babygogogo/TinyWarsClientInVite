import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SettingsForSrwJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    warSignature?: string | null | undefined;
    totalScore?: number | null | undefined;
    initialCoIdArray: number[];
}

export class SettingsForSrw extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _warSignature?: string | null | undefined;
    private _totalScore?: number | null | undefined;
    private _initialCoIdArray: number[] = [];

    public static fromJson(obj: SettingsForSrwJson): SettingsForSrw {
        return new SettingsForSrw().loadJson(obj);
    }
    public override loadJson(obj: SettingsForSrwJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setWarSignature(obj.warSignature);
        this.setTotalScore(obj.totalScore);
        this.setInitialCoIdArray(obj.initialCoIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: SettingsForSrwJson): SettingsForSrwJson {
        obj ??= ({} as SettingsForSrwJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getWarSignature();
            (value != null) && (obj.warSignature = value);
        }

        {
            const value = this.getTotalScore();
            (value != null) && (obj.totalScore = value);
        }

        {
            obj.initialCoIdArray = this.getInitialCoIdArray().concat();
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
            const value = this.getWarSignature();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getTotalScore();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getInitialCoIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(90).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SettingsForSrw {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SettingsForSrw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setWarSignature(reader.string());
                    break;

                case 3:
                    msg.setTotalScore(reader.int32());
                    break;

                case 11:
                    {
                        const arr = msg._initialCoIdArray;
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

    public override clone(): SettingsForSrw {
        return SettingsForSrw.decode(this.encode());
    }

    public override getSchemaName(): "SettingsForSrw" {
        return "SettingsForSrw";
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

    public checkHasWarSignature(): boolean {
        return this._warSignature != null;
    }
    public getWarSignature(): string | null | undefined {
        return this._warSignature;
    }
    public setWarSignature(value: string | null | undefined): void {
        this._warSignature = value;
    }

    public checkHasTotalScore(): boolean {
        return this._totalScore != null;
    }
    public getTotalScore(): number | null | undefined {
        return this._totalScore;
    }
    public setTotalScore(value: number | null | undefined): void {
        this._totalScore = value;
    }

    public getInitialCoIdArray(): number[] {
        return this._initialCoIdArray;
    }
    public setInitialCoIdArray(value: number[]): void {
        this._initialCoIdArray = value;
    }
}
