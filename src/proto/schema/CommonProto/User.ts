import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface UserJson extends $ProtoSchemaJsonBase {
}

export class User extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: UserJson): User {
        return new User().loadJson(obj);
    }
    public override loadJson(_obj: UserJson): this {
        return this;
    }
    public override toJson(obj?: UserJson): UserJson {
        obj ??= ({} as UserJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): User {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new User();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): User {
        return User.decode(this.encode());
    }

    public override getSchemaName(): "User" {
        return "User";
    }

    // No member data accessors.
}
