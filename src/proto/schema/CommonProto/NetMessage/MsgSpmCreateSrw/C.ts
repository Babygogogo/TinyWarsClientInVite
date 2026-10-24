import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SpmWarSaveSlotExtraData as $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData, type SpmWarSaveSlotExtraDataJson as $Json$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData } from "../../SinglePlayerMode/SpmWarSaveSlotExtraData.js";
import { DataForPlayerInRoom as $Message$CommonProto$Structure$DataForPlayerInRoom, type DataForPlayerInRoomJson as $Json$CommonProto$Structure$DataForPlayerInRoom } from "../../Structure/DataForPlayerInRoom.js";
import { SettingsForCommon as $Message$CommonProto$WarSettings$SettingsForCommon, type SettingsForCommonJson as $Json$CommonProto$WarSettings$SettingsForCommon } from "../../WarSettings/SettingsForCommon.js";

export interface CJson extends $ProtoSchemaJsonBase {
    slotIndex?: number | null | undefined;
    slotExtraData?: $Json$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined;
    settingsForCommon?: $Json$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    normalMapId?: number | null | undefined;
    playerInfoList: $Json$CommonProto$Structure$DataForPlayerInRoom[];
}

export class C extends $ProtoSchemaBase {
    private _slotIndex?: number | null | undefined;
    private _slotExtraData?: $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined;
    private _settingsForCommon?: $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _playerInfoList: $Message$CommonProto$Structure$DataForPlayerInRoom[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setSlotIndex(obj.slotIndex);
        this.setSlotExtraData(obj.slotExtraData != null ? $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData.fromJson(obj.slotExtraData) : null);
        this.setSettingsForCommon(obj.settingsForCommon != null ? $Message$CommonProto$WarSettings$SettingsForCommon.fromJson(obj.settingsForCommon) : null);
        this.setNormalMapId(obj.normalMapId);
        this.setPlayerInfoList(obj.playerInfoList?.map(v => $Message$CommonProto$Structure$DataForPlayerInRoom.fromJson(v)) ?? []);
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
            const value = this.getSettingsForCommon();
            (value != null) && (obj.settingsForCommon = value.toJson());
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            obj.playerInfoList = this.getPlayerInfoList().map(v => v.toJson());
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
            const value = this.getSettingsForCommon();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getPlayerInfoList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(82).fork()).ldelim();
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
                    msg.setSettingsForCommon($Message$CommonProto$WarSettings$SettingsForCommon.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 10:
                    {
                        const arr = msg._playerInfoList;
                        arr.push($Message$CommonProto$Structure$DataForPlayerInRoom.decode(reader, reader.uint32()));
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

    public checkHasSettingsForCommon(): boolean {
        return this._settingsForCommon != null;
    }
    public getSettingsForCommon(): $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined {
        return this._settingsForCommon;
    }
    public setSettingsForCommon(value: $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined): void {
        this._settingsForCommon = value;
    }
    public createIfNotExistsSettingsForCommon(): $Message$CommonProto$WarSettings$SettingsForCommon {
        return this._settingsForCommon ??= new $Message$CommonProto$WarSettings$SettingsForCommon();
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

    public getPlayerInfoList(): $Message$CommonProto$Structure$DataForPlayerInRoom[] {
        return this._playerInfoList;
    }
    public setPlayerInfoList(value: $Message$CommonProto$Structure$DataForPlayerInRoom[]): void {
        this._playerInfoList = value;
    }
}
