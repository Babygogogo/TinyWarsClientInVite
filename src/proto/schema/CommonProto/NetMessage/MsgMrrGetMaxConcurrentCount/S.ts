import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    maxCountForStd?: number | null | undefined;
    maxCountForFog?: number | null | undefined;
    additionalMaxDifferenceInScoreForStd?: number | null | undefined;
    additionalMaxDifferenceInScoreForFog?: number | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _maxCountForStd?: number | null | undefined;
    private _maxCountForFog?: number | null | undefined;
    private _additionalMaxDifferenceInScoreForStd?: number | null | undefined;
    private _additionalMaxDifferenceInScoreForFog?: number | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setMaxCountForStd(obj.maxCountForStd);
        this.setMaxCountForFog(obj.maxCountForFog);
        this.setAdditionalMaxDifferenceInScoreForStd(obj.additionalMaxDifferenceInScoreForStd);
        this.setAdditionalMaxDifferenceInScoreForFog(obj.additionalMaxDifferenceInScoreForFog);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getMaxCountForStd();
            (value != null) && (obj.maxCountForStd = value);
        }

        {
            const value = this.getMaxCountForFog();
            (value != null) && (obj.maxCountForFog = value);
        }

        {
            const value = this.getAdditionalMaxDifferenceInScoreForStd();
            (value != null) && (obj.additionalMaxDifferenceInScoreForStd = value);
        }

        {
            const value = this.getAdditionalMaxDifferenceInScoreForFog();
            (value != null) && (obj.additionalMaxDifferenceInScoreForFog = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMaxCountForStd();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getMaxCountForFog();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getAdditionalMaxDifferenceInScoreForStd();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getAdditionalMaxDifferenceInScoreForFog();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setMaxCountForStd(reader.int32());
                    break;

                case 3:
                    msg.setMaxCountForFog(reader.int32());
                    break;

                case 4:
                    msg.setAdditionalMaxDifferenceInScoreForStd(reader.int32());
                    break;

                case 5:
                    msg.setAdditionalMaxDifferenceInScoreForFog(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
    }

    public checkHasMaxCountForStd(): boolean {
        return this._maxCountForStd != null;
    }
    public getMaxCountForStd(): number | null | undefined {
        return this._maxCountForStd;
    }
    public setMaxCountForStd(value: number | null | undefined): void {
        this._maxCountForStd = value;
    }

    public checkHasMaxCountForFog(): boolean {
        return this._maxCountForFog != null;
    }
    public getMaxCountForFog(): number | null | undefined {
        return this._maxCountForFog;
    }
    public setMaxCountForFog(value: number | null | undefined): void {
        this._maxCountForFog = value;
    }

    public checkHasAdditionalMaxDifferenceInScoreForStd(): boolean {
        return this._additionalMaxDifferenceInScoreForStd != null;
    }
    public getAdditionalMaxDifferenceInScoreForStd(): number | null | undefined {
        return this._additionalMaxDifferenceInScoreForStd;
    }
    public setAdditionalMaxDifferenceInScoreForStd(value: number | null | undefined): void {
        this._additionalMaxDifferenceInScoreForStd = value;
    }

    public checkHasAdditionalMaxDifferenceInScoreForFog(): boolean {
        return this._additionalMaxDifferenceInScoreForFog != null;
    }
    public getAdditionalMaxDifferenceInScoreForFog(): number | null | undefined {
        return this._additionalMaxDifferenceInScoreForFog;
    }
    public setAdditionalMaxDifferenceInScoreForFog(value: number | null | undefined): void {
        this._additionalMaxDifferenceInScoreForFog = value;
    }
}
