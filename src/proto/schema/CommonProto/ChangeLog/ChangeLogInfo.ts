import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ChangeLogMessage as $Message$CommonProto$ChangeLog$ChangeLogMessage, type ChangeLogMessageJson as $Json$CommonProto$ChangeLog$ChangeLogMessage } from "./ChangeLogMessage.js";

export interface ChangeLogInfoJson extends $ProtoSchemaJsonBase {
    messageList: $Json$CommonProto$ChangeLog$ChangeLogMessage[];
}

export class ChangeLogInfo extends $ProtoSchemaBase {
    private _messageList: $Message$CommonProto$ChangeLog$ChangeLogMessage[] = [];

    public static fromJson(obj: ChangeLogInfoJson): ChangeLogInfo {
        return new ChangeLogInfo().loadJson(obj);
    }
    public override loadJson(obj: ChangeLogInfoJson): this {
        this.setMessageList(obj.messageList?.map(v => $Message$CommonProto$ChangeLog$ChangeLogMessage.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: ChangeLogInfoJson): ChangeLogInfoJson {
        obj ??= ({} as ChangeLogInfoJson);

        {
            obj.messageList = this.getMessageList().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMessageList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ChangeLogInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ChangeLogInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._messageList;
                        arr.push($Message$CommonProto$ChangeLog$ChangeLogMessage.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ChangeLogInfo {
        return ChangeLogInfo.decode(this.encode());
    }

    public override getSchemaName(): "ChangeLogInfo" {
        return "ChangeLogInfo";
    }

    public getMessageList(): $Message$CommonProto$ChangeLog$ChangeLogMessage[] {
        return this._messageList;
    }
    public setMessageList(value: $Message$CommonProto$ChangeLog$ChangeLogMessage[]): void {
        this._messageList = value;
    }
}
