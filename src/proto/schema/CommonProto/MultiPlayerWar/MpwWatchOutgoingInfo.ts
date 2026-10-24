import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MpwWatchOutgoingInfoJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    ongoingDstUserIdArray: number[];
    requestDstUserIdArray: number[];
}

export class MpwWatchOutgoingInfo extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _ongoingDstUserIdArray: number[] = [];
    private _requestDstUserIdArray: number[] = [];

    public static fromJson(obj: MpwWatchOutgoingInfoJson): MpwWatchOutgoingInfo {
        return new MpwWatchOutgoingInfo().loadJson(obj);
    }
    public override loadJson(obj: MpwWatchOutgoingInfoJson): this {
        this.setWarId(obj.warId);
        this.setOngoingDstUserIdArray(obj.ongoingDstUserIdArray?.concat() ?? []);
        this.setRequestDstUserIdArray(obj.requestDstUserIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: MpwWatchOutgoingInfoJson): MpwWatchOutgoingInfoJson {
        obj ??= ({} as MpwWatchOutgoingInfoJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            obj.ongoingDstUserIdArray = this.getOngoingDstUserIdArray().concat();
        }

        {
            obj.requestDstUserIdArray = this.getRequestDstUserIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getOngoingDstUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getRequestDstUserIdArray();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MpwWatchOutgoingInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MpwWatchOutgoingInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._ongoingDstUserIdArray;
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

                case 3:
                    {
                        const arr = msg._requestDstUserIdArray;
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

    public override clone(): MpwWatchOutgoingInfo {
        return MpwWatchOutgoingInfo.decode(this.encode());
    }

    public override getSchemaName(): "MpwWatchOutgoingInfo" {
        return "MpwWatchOutgoingInfo";
    }

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
    }

    public getOngoingDstUserIdArray(): number[] {
        return this._ongoingDstUserIdArray;
    }
    public setOngoingDstUserIdArray(value: number[]): void {
        this._ongoingDstUserIdArray = value;
    }

    public getRequestDstUserIdArray(): number[] {
        return this._requestDstUserIdArray;
    }
    public setRequestDstUserIdArray(value: number[]): void {
        this._requestDstUserIdArray = value;
    }
}
