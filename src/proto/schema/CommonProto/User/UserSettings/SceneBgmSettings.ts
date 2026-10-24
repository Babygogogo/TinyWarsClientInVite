import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SceneBgmSettingsJson extends $ProtoSchemaJsonBase {
    lobbyBgmCode?: number | null | undefined;
    mapEditorBgmCode?: number | null | undefined;
}

export class SceneBgmSettings extends $ProtoSchemaBase {
    private _lobbyBgmCode?: number | null | undefined;
    private _mapEditorBgmCode?: number | null | undefined;

    public static fromJson(obj: SceneBgmSettingsJson): SceneBgmSettings {
        return new SceneBgmSettings().loadJson(obj);
    }
    public override loadJson(obj: SceneBgmSettingsJson): this {
        this.setLobbyBgmCode(obj.lobbyBgmCode);
        this.setMapEditorBgmCode(obj.mapEditorBgmCode);
        return this;
    }
    public override toJson(obj?: SceneBgmSettingsJson): SceneBgmSettingsJson {
        obj ??= ({} as SceneBgmSettingsJson);

        {
            const value = this.getLobbyBgmCode();
            (value != null) && (obj.lobbyBgmCode = value);
        }

        {
            const value = this.getMapEditorBgmCode();
            (value != null) && (obj.mapEditorBgmCode = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getLobbyBgmCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMapEditorBgmCode();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SceneBgmSettings {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SceneBgmSettings();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setLobbyBgmCode(reader.int32());
                    break;

                case 2:
                    msg.setMapEditorBgmCode(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SceneBgmSettings {
        return SceneBgmSettings.decode(this.encode());
    }

    public override getSchemaName(): "SceneBgmSettings" {
        return "SceneBgmSettings";
    }

    public checkHasLobbyBgmCode(): boolean {
        return this._lobbyBgmCode != null;
    }
    public getLobbyBgmCode(): number | null | undefined {
        return this._lobbyBgmCode;
    }
    public setLobbyBgmCode(value: number | null | undefined): void {
        this._lobbyBgmCode = value;
    }

    public checkHasMapEditorBgmCode(): boolean {
        return this._mapEditorBgmCode != null;
    }
    public getMapEditorBgmCode(): number | null | undefined {
        return this._mapEditorBgmCode;
    }
    public setMapEditorBgmCode(value: number | null | undefined): void {
        this._mapEditorBgmCode = value;
    }
}
