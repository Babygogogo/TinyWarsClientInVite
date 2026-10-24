import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { PlayerCoInfo as $Message$CommonProto$NetMessage$MsgCampaignCreateWar$PlayerCoInfo, type PlayerCoInfoJson as $Json$CommonProto$NetMessage$MsgCampaignCreateWar$PlayerCoInfo } from "./PlayerCoInfo.js";
import { SpmWarSaveSlotExtraData as $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData, type SpmWarSaveSlotExtraDataJson as $Json$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData } from "../../SinglePlayerMode/SpmWarSaveSlotExtraData.js";

export interface CJson extends $ProtoSchemaJsonBase {
    slotIndex?: number | null | undefined;
    slotExtraData?: $Json$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined;
    campaignId?: number | null | undefined;
    campaignMapId?: number | null | undefined;
    playerCoInfoArray: $Json$CommonProto$NetMessage$MsgCampaignCreateWar$PlayerCoInfo[];
}

export class C extends $ProtoSchemaBase {
    private _slotIndex?: number | null | undefined;
    private _slotExtraData?: $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined;
    private _campaignId?: number | null | undefined;
    private _campaignMapId?: number | null | undefined;
    private _playerCoInfoArray: $Message$CommonProto$NetMessage$MsgCampaignCreateWar$PlayerCoInfo[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setSlotIndex(obj.slotIndex);
        this.setSlotExtraData(obj.slotExtraData != null ? $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData.fromJson(obj.slotExtraData) : null);
        this.setCampaignId(obj.campaignId);
        this.setCampaignMapId(obj.campaignMapId);
        this.setPlayerCoInfoArray(obj.playerCoInfoArray?.map(v => $Message$CommonProto$NetMessage$MsgCampaignCreateWar$PlayerCoInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getSlotIndex();
            (value != null) && (obj.slotIndex = value);
        }

        {
            const value = this.getSlotExtraData();
            (value != null) && (obj.slotExtraData = value.toJson());
        }

        {
            const value = this.getCampaignId();
            (value != null) && (obj.campaignId = value);
        }

        {
            const value = this.getCampaignMapId();
            (value != null) && (obj.campaignMapId = value);
        }

        {
            obj.playerCoInfoArray = this.getPlayerCoInfoArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSlotIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getSlotExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getCampaignId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getCampaignMapId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getPlayerCoInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(42).fork()).ldelim();
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
                    msg.setSlotIndex(reader.int32());
                    break;

                case 2:
                    msg.setSlotExtraData($Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setCampaignId(reader.int32());
                    break;

                case 4:
                    msg.setCampaignMapId(reader.int32());
                    break;

                case 5:
                    {
                        const arr = msg._playerCoInfoArray;
                        arr.push($Message$CommonProto$NetMessage$MsgCampaignCreateWar$PlayerCoInfo.decode(reader, reader.uint32()));
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

    public checkHasSlotIndex(): boolean {
        return this._slotIndex != null;
    }
    public getSlotIndex(): number | null | undefined {
        return this._slotIndex;
    }
    public setSlotIndex(value: number | null | undefined): void {
        this._slotIndex = value;
    }

    public checkHasSlotExtraData(): boolean {
        return this._slotExtraData != null;
    }
    public getSlotExtraData(): $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined {
        return this._slotExtraData;
    }
    public setSlotExtraData(value: $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined): void {
        this._slotExtraData = value;
    }
    public createIfNotExistsSlotExtraData(): $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData {
        return this._slotExtraData ??= new $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData();
    }

    public checkHasCampaignId(): boolean {
        return this._campaignId != null;
    }
    public getCampaignId(): number | null | undefined {
        return this._campaignId;
    }
    public setCampaignId(value: number | null | undefined): void {
        this._campaignId = value;
    }

    public checkHasCampaignMapId(): boolean {
        return this._campaignMapId != null;
    }
    public getCampaignMapId(): number | null | undefined {
        return this._campaignMapId;
    }
    public setCampaignMapId(value: number | null | undefined): void {
        this._campaignMapId = value;
    }

    public getPlayerCoInfoArray(): $Message$CommonProto$NetMessage$MsgCampaignCreateWar$PlayerCoInfo[] {
        return this._playerCoInfoArray;
    }
    public setPlayerCoInfoArray(value: $Message$CommonProto$NetMessage$MsgCampaignCreateWar$PlayerCoInfo[]): void {
        this._playerCoInfoArray = value;
    }
}
