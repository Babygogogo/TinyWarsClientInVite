import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { WoContainer as $Message$CommonProto$WarOperation$WoContainer, type WoContainerJson as $Json$CommonProto$WarOperation$WoContainer } from "../../WarOperation/WoContainer.js";

export interface HalfwayDataJson extends $ProtoSchemaJsonBase {
    teamIndex?: number | null | undefined;
    action?: $Json$CommonProto$WarOperation$WoContainer | null | undefined;
}

export class HalfwayData extends $ProtoSchemaBase {
    private _teamIndex?: number | null | undefined;
    private _action?: $Message$CommonProto$WarOperation$WoContainer | null | undefined;

    public static fromJson(obj: HalfwayDataJson): HalfwayData {
        return new HalfwayData().loadJson(obj);
    }
    public override loadJson(obj: HalfwayDataJson): this {
        this.setTeamIndex(obj.teamIndex);
        this.setAction(obj.action != null ? $Message$CommonProto$WarOperation$WoContainer.fromJson(obj.action) : null);
        return this;
    }
    public override toJson(obj?: HalfwayDataJson): HalfwayDataJson {
        obj ??= ({} as HalfwayDataJson);

        {
            const value = this.getTeamIndex();
            (value != null) && (obj.teamIndex = value);
        }

        {
            const value = this.getAction();
            (value != null) && (obj.action = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTeamIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getAction();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): HalfwayData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new HalfwayData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTeamIndex(reader.int32());
                    break;

                case 2:
                    msg.setAction($Message$CommonProto$WarOperation$WoContainer.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): HalfwayData {
        return HalfwayData.decode(this.encode());
    }

    public override getSchemaName(): "HalfwayData" {
        return "HalfwayData";
    }

    public checkHasTeamIndex(): boolean {
        return this._teamIndex != null;
    }
    public getTeamIndex(): number | null | undefined {
        return this._teamIndex;
    }
    public setTeamIndex(value: number | null | undefined): void {
        this._teamIndex = value;
    }

    public checkHasAction(): boolean {
        return this._action != null;
    }
    public getAction(): $Message$CommonProto$WarOperation$WoContainer | null | undefined {
        return this._action;
    }
    public setAction(value: $Message$CommonProto$WarOperation$WoContainer | null | undefined): void {
        this._action = value;
    }
    public createIfNotExistsAction(): $Message$CommonProto$WarOperation$WoContainer {
        return this._action ??= new $Message$CommonProto$WarOperation$WoContainer();
    }
}
