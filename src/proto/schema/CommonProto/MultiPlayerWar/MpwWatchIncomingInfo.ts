import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MpwWatchSrcUserInfo as $Message$CommonProto$MultiPlayerWar$MpwWatchSrcUserInfo, type MpwWatchSrcUserInfoJson as $Json$CommonProto$MultiPlayerWar$MpwWatchSrcUserInfo } from "./MpwWatchSrcUserInfo.js";

export interface MpwWatchIncomingInfoJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    ongoingSrcUserIdArray: number[];
    requestSrcUserIdArray: number[];
    srcUserInfoArray: $Json$CommonProto$MultiPlayerWar$MpwWatchSrcUserInfo[];
}

export class MpwWatchIncomingInfo extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _ongoingSrcUserIdArray: number[] = [];
    private _requestSrcUserIdArray: number[] = [];
    private _srcUserInfoArray: $Message$CommonProto$MultiPlayerWar$MpwWatchSrcUserInfo[] = [];

    public static fromJson(obj: MpwWatchIncomingInfoJson): MpwWatchIncomingInfo {
        return new MpwWatchIncomingInfo().loadJson(obj);
    }
    public override loadJson(obj: MpwWatchIncomingInfoJson): this {
        this.setWarId(obj.warId);
        this.setOngoingSrcUserIdArray(obj.ongoingSrcUserIdArray?.concat() ?? []);
        this.setRequestSrcUserIdArray(obj.requestSrcUserIdArray?.concat() ?? []);
        this.setSrcUserInfoArray(obj.srcUserInfoArray?.map(v => $Message$CommonProto$MultiPlayerWar$MpwWatchSrcUserInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MpwWatchIncomingInfoJson): MpwWatchIncomingInfoJson {
        obj ??= ({} as MpwWatchIncomingInfoJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            obj.ongoingSrcUserIdArray = this.getOngoingSrcUserIdArray().concat();
        }

        {
            obj.requestSrcUserIdArray = this.getRequestSrcUserIdArray().concat();
        }

        {
            obj.srcUserInfoArray = this.getSrcUserInfoArray().map(v => v.toJson());
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
            const value = this.getOngoingSrcUserIdArray();
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
            const value = this.getRequestSrcUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getSrcUserInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MpwWatchIncomingInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MpwWatchIncomingInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._ongoingSrcUserIdArray;
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
                        const arr = msg._requestSrcUserIdArray;
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

                case 4:
                    {
                        const arr = msg._srcUserInfoArray;
                        arr.push($Message$CommonProto$MultiPlayerWar$MpwWatchSrcUserInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MpwWatchIncomingInfo {
        return MpwWatchIncomingInfo.decode(this.encode());
    }

    public override getSchemaName(): "MpwWatchIncomingInfo" {
        return "MpwWatchIncomingInfo";
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

    public getOngoingSrcUserIdArray(): number[] {
        return this._ongoingSrcUserIdArray;
    }
    public setOngoingSrcUserIdArray(value: number[]): void {
        this._ongoingSrcUserIdArray = value;
    }

    public getRequestSrcUserIdArray(): number[] {
        return this._requestSrcUserIdArray;
    }
    public setRequestSrcUserIdArray(value: number[]): void {
        this._requestSrcUserIdArray = value;
    }

    public getSrcUserInfoArray(): $Message$CommonProto$MultiPlayerWar$MpwWatchSrcUserInfo[] {
        return this._srcUserInfoArray;
    }
    public setSrcUserInfoArray(value: $Message$CommonProto$MultiPlayerWar$MpwWatchSrcUserInfo[]): void {
        this._srcUserInfoArray = value;
    }
}
