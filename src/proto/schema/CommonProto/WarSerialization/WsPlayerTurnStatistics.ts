import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WsPlayerTurnStatisticsJson extends $ProtoSchemaJsonBase {
    turnIndex?: number | null | undefined;
    manualActionsCount?: number | null | undefined;
}

export class WsPlayerTurnStatistics extends $ProtoSchemaBase {
    private _turnIndex?: number | null | undefined;
    private _manualActionsCount?: number | null | undefined;

    public static fromJson(obj: WsPlayerTurnStatisticsJson): WsPlayerTurnStatistics {
        return new WsPlayerTurnStatistics().loadJson(obj);
    }
    public override loadJson(obj: WsPlayerTurnStatisticsJson): this {
        this.setTurnIndex(obj.turnIndex);
        this.setManualActionsCount(obj.manualActionsCount);
        return this;
    }
    public override toJson(obj?: WsPlayerTurnStatisticsJson): WsPlayerTurnStatisticsJson {
        obj ??= ({} as WsPlayerTurnStatisticsJson);

        {
            const value = this.getTurnIndex();
            (value != null) && (obj.turnIndex = value);
        }

        {
            const value = this.getManualActionsCount();
            (value != null) && (obj.manualActionsCount = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTurnIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getManualActionsCount();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WsPlayerTurnStatistics {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WsPlayerTurnStatistics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTurnIndex(reader.int32());
                    break;

                case 2:
                    msg.setManualActionsCount(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WsPlayerTurnStatistics {
        return WsPlayerTurnStatistics.decode(this.encode());
    }

    public override getSchemaName(): "WsPlayerTurnStatistics" {
        return "WsPlayerTurnStatistics";
    }

    public checkHasTurnIndex(): boolean {
        return this._turnIndex != null;
    }
    public getTurnIndex(): number | null | undefined {
        return this._turnIndex;
    }
    public setTurnIndex(value: number | null | undefined): void {
        this._turnIndex = value;
    }

    public checkHasManualActionsCount(): boolean {
        return this._manualActionsCount != null;
    }
    public getManualActionsCount(): number | null | undefined {
        return this._manualActionsCount;
    }
    public setManualActionsCount(value: number | null | undefined): void {
        this._manualActionsCount = value;
    }
}
