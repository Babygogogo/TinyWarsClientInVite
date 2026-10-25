import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaStopPersistentActionJson extends $ProtoSchemaJsonBase {
    actionIdArray: number[];
}

export class WeaStopPersistentAction extends $ProtoSchemaBase {
    private _actionIdArray: number[] = [];

    public static fromJson(obj: WeaStopPersistentActionJson): WeaStopPersistentAction {
        return new WeaStopPersistentAction().loadJson(obj);
    }
    public override loadJson(obj: WeaStopPersistentActionJson): this {
        this.setActionIdArray(obj.actionIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: WeaStopPersistentActionJson): WeaStopPersistentActionJson {
        obj ??= ({} as WeaStopPersistentActionJson);

        {
            obj.actionIdArray = this.getActionIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getActionIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(10).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaStopPersistentAction {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaStopPersistentAction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._actionIdArray;
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

    public override clone(): WeaStopPersistentAction {
        return WeaStopPersistentAction.decode(this.encode());
    }

    public override getSchemaName(): "WeaStopPersistentAction" {
        return "WeaStopPersistentAction";
    }

    public getActionIdArray(): number[] {
        return this._actionIdArray;
    }
    public setActionIdArray(value: number[]): void {
        this._actionIdArray = value;
    }
}
