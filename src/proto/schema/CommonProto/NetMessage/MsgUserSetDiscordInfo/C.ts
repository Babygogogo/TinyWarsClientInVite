import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { UserDiscordInfo as $Message$CommonProto$User$UserDiscordInfo, type UserDiscordInfoJson as $Json$CommonProto$User$UserDiscordInfo } from "../../User/UserDiscordInfo.js";

export interface CJson extends $ProtoSchemaJsonBase {
    discordInfo?: $Json$CommonProto$User$UserDiscordInfo | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _discordInfo?: $Message$CommonProto$User$UserDiscordInfo | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setDiscordInfo(obj.discordInfo != null ? $Message$CommonProto$User$UserDiscordInfo.fromJson(obj.discordInfo) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getDiscordInfo();
            (value != null) && (obj.discordInfo = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDiscordInfo();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setDiscordInfo($Message$CommonProto$User$UserDiscordInfo.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
    }

    public checkHasDiscordInfo(): boolean {
        return this._discordInfo != null;
    }
    public getDiscordInfo(): $Message$CommonProto$User$UserDiscordInfo | null | undefined {
        return this._discordInfo;
    }
    public setDiscordInfo(value: $Message$CommonProto$User$UserDiscordInfo | null | undefined): void {
        this._discordInfo = value;
    }
    public createIfNotExistsDiscordInfo(): $Message$CommonProto$User$UserDiscordInfo {
        return this._discordInfo ??= new $Message$CommonProto$User$UserDiscordInfo();
    }
}
