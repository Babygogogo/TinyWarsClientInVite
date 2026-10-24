import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { BroadcastMessage as $Message$CommonProto$Broadcast$BroadcastMessage, type BroadcastMessageJson as $Json$CommonProto$Broadcast$BroadcastMessage } from "./BroadcastMessage.js";

export interface BroadcastInfoJson extends $ProtoSchemaJsonBase {
    messageList: $Json$CommonProto$Broadcast$BroadcastMessage[];
}

export class BroadcastInfo extends $ProtoSchemaBase {
    private _messageList: $Message$CommonProto$Broadcast$BroadcastMessage[] = [];

    public static fromJson(obj: BroadcastInfoJson): BroadcastInfo {
        return new BroadcastInfo().loadJson(obj);
    }
    public override loadJson(obj: BroadcastInfoJson): this {
        this.setMessageList(obj.messageList?.map(v => $Message$CommonProto$Broadcast$BroadcastMessage.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: BroadcastInfoJson): BroadcastInfoJson {
        obj ??= ({} as BroadcastInfoJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): BroadcastInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new BroadcastInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._messageList;
                        arr.push($Message$CommonProto$Broadcast$BroadcastMessage.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): BroadcastInfo {
        return BroadcastInfo.decode(this.encode());
    }

    public override getSchemaName(): "BroadcastInfo" {
        return "BroadcastInfo";
    }

    public getMessageList(): $Message$CommonProto$Broadcast$BroadcastMessage[] {
        return this._messageList;
    }
    public setMessageList(value: $Message$CommonProto$Broadcast$BroadcastMessage[]): void {
        this._messageList = value;
    }
}
