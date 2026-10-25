import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface AiSkinInfoJson extends $ProtoSchemaJsonBase {
    playerIndex?: number | null | undefined;
    unitAndTileSkinId?: number | null | undefined;
}

export class AiSkinInfo extends $ProtoSchemaBase {
    private _playerIndex?: number | null | undefined;
    private _unitAndTileSkinId?: number | null | undefined;

    public static fromJson(obj: AiSkinInfoJson): AiSkinInfo {
        return new AiSkinInfo().loadJson(obj);
    }
    public override loadJson(obj: AiSkinInfoJson): this {
        this.setPlayerIndex(obj.playerIndex);
        this.setUnitAndTileSkinId(obj.unitAndTileSkinId);
        return this;
    }
    public override toJson(obj?: AiSkinInfoJson): AiSkinInfoJson {
        obj ??= ({} as AiSkinInfoJson);

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getUnitAndTileSkinId();
            (value != null) && (obj.unitAndTileSkinId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUnitAndTileSkinId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): AiSkinInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new AiSkinInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 2:
                    msg.setUnitAndTileSkinId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): AiSkinInfo {
        return AiSkinInfo.decode(this.encode());
    }

    public override getSchemaName(): "AiSkinInfo" {
        return "AiSkinInfo";
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number | null | undefined {
        return this._playerIndex;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        this._playerIndex = value;
    }

    public checkHasUnitAndTileSkinId(): boolean {
        return this._unitAndTileSkinId != null;
    }
    public getUnitAndTileSkinId(): number | null | undefined {
        return this._unitAndTileSkinId;
    }
    public setUnitAndTileSkinId(value: number | null | undefined): void {
        this._unitAndTileSkinId = value;
    }
}
