import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MapSimpleDialogue as $Message$CommonProto$Map$MapSimpleDialogue, type MapSimpleDialogueJson as $Json$CommonProto$Map$MapSimpleDialogue } from "../../Map/MapSimpleDialogue.js";
import { WarRuleDialogueInfo as $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue$WarRuleDialogueInfo, type WarRuleDialogueInfoJson as $Json$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue$WarRuleDialogueInfo } from "./WarRuleDialogueInfo.js";

export interface CJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    mapSimpleDialogueArray: $Json$CommonProto$Map$MapSimpleDialogue[];
    warRuleDialogueInfoArray: $Json$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue$WarRuleDialogueInfo[];
}

export class C extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _mapSimpleDialogueArray: $Message$CommonProto$Map$MapSimpleDialogue[] = [];
    private _warRuleDialogueInfoArray: $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue$WarRuleDialogueInfo[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setMapSimpleDialogueArray(obj.mapSimpleDialogueArray?.map(v => $Message$CommonProto$Map$MapSimpleDialogue.fromJson(v)) ?? []);
        this.setWarRuleDialogueInfoArray(obj.warRuleDialogueInfoArray?.map(v => $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue$WarRuleDialogueInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            obj.mapSimpleDialogueArray = this.getMapSimpleDialogueArray().map(v => v.toJson());
        }

        {
            obj.warRuleDialogueInfoArray = this.getWarRuleDialogueInfoArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMapSimpleDialogueArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getWarRuleDialogueInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
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
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._mapSimpleDialogueArray;
                        arr.push($Message$CommonProto$Map$MapSimpleDialogue.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    {
                        const arr = msg._warRuleDialogueInfoArray;
                        arr.push($Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue$WarRuleDialogueInfo.decode(reader, reader.uint32()));
                    }
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

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public getMapSimpleDialogueArray(): $Message$CommonProto$Map$MapSimpleDialogue[] {
        return this._mapSimpleDialogueArray;
    }
    public setMapSimpleDialogueArray(value: $Message$CommonProto$Map$MapSimpleDialogue[]): void {
        this._mapSimpleDialogueArray = value;
    }

    public getWarRuleDialogueInfoArray(): $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue$WarRuleDialogueInfo[] {
        return this._warRuleDialogueInfoArray;
    }
    public setWarRuleDialogueInfoArray(value: $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue$WarRuleDialogueInfo[]): void {
        this._warRuleDialogueInfoArray = value;
    }
}
