import type protobuf from "protobufjs/minimal.js";
 
export interface ProtoSchemaJsonBase {
}

export abstract class ProtoSchemaBase {
    public abstract loadJson(obj: ProtoSchemaJsonBase): this;
    public abstract toJson(obj?: ProtoSchemaJsonBase): ProtoSchemaJsonBase;
    public abstract toWriter(writer?: protobuf.Writer): protobuf.Writer;
    public abstract clone(): ProtoSchemaBase;

    public encode(): Uint8Array {
        return this.toWriter().finish();
    }

    public abstract getSchemaName(): string;
}
