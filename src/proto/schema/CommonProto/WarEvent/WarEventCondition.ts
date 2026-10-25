import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { WecCommonData as $Message$CommonProto$WarEvent$WecCommonData, type WecCommonDataJson as $Json$CommonProto$WarEvent$WecCommonData } from "./WecCommonData.js";
import { WecCustomCounter as $Message$CommonProto$WarEvent$WecCustomCounter, type WecCustomCounterJson as $Json$CommonProto$WarEvent$WecCustomCounter } from "./WecCustomCounter.js";
import { WecEventCalledCount as $Message$CommonProto$WarEvent$WecEventCalledCount, type WecEventCalledCountJson as $Json$CommonProto$WarEvent$WecEventCalledCount } from "./WecEventCalledCount.js";
import { WecExpression as $Message$CommonProto$WarEvent$WecExpression, type WecExpressionJson as $Json$CommonProto$WarEvent$WecExpression } from "./WecExpression.js";
import { WecManualActionStatistics as $Message$CommonProto$WarEvent$WecManualActionStatistics, type WecManualActionStatisticsJson as $Json$CommonProto$WarEvent$WecManualActionStatistics } from "./WecManualActionStatistics.js";
import { WecOngoingPersistentActionPresence as $Message$CommonProto$WarEvent$WecOngoingPersistentActionPresence, type WecOngoingPersistentActionPresenceJson as $Json$CommonProto$WarEvent$WecOngoingPersistentActionPresence } from "./WecOngoingPersistentActionPresence.js";
import { WecPlayerPresence as $Message$CommonProto$WarEvent$WecPlayerPresence, type WecPlayerPresenceJson as $Json$CommonProto$WarEvent$WecPlayerPresence } from "./WecPlayerPresence.js";
import { WecTilePresence as $Message$CommonProto$WarEvent$WecTilePresence, type WecTilePresenceJson as $Json$CommonProto$WarEvent$WecTilePresence } from "./WecTilePresence.js";
import { WecTurnAndPlayer as $Message$CommonProto$WarEvent$WecTurnAndPlayer, type WecTurnAndPlayerJson as $Json$CommonProto$WarEvent$WecTurnAndPlayer } from "./WecTurnAndPlayer.js";
import { WecUnitPresence as $Message$CommonProto$WarEvent$WecUnitPresence, type WecUnitPresenceJson as $Json$CommonProto$WarEvent$WecUnitPresence } from "./WecUnitPresence.js";
import { WecWeatherAndFog as $Message$CommonProto$WarEvent$WecWeatherAndFog, type WecWeatherAndFogJson as $Json$CommonProto$WarEvent$WecWeatherAndFog } from "./WecWeatherAndFog.js";

export interface WarEventConditionJson extends $ProtoSchemaJsonBase {
    WecCommonData?: $Json$CommonProto$WarEvent$WecCommonData | null | undefined;
    WecTurnAndPlayer?: $Json$CommonProto$WarEvent$WecTurnAndPlayer | null | undefined;
    WecWeatherAndFog?: $Json$CommonProto$WarEvent$WecWeatherAndFog | null | undefined;
    WecExpression?: $Json$CommonProto$WarEvent$WecExpression | null | undefined;
    WecEventCalledCount?: $Json$CommonProto$WarEvent$WecEventCalledCount | null | undefined;
    WecPlayerPresence?: $Json$CommonProto$WarEvent$WecPlayerPresence | null | undefined;
    WecTilePresence?: $Json$CommonProto$WarEvent$WecTilePresence | null | undefined;
    WecUnitPresence?: $Json$CommonProto$WarEvent$WecUnitPresence | null | undefined;
    WecCustomCounter?: $Json$CommonProto$WarEvent$WecCustomCounter | null | undefined;
    WecOngoingPersistentActionPresence?: $Json$CommonProto$WarEvent$WecOngoingPersistentActionPresence | null | undefined;
    WecManualActionStatistics?: $Json$CommonProto$WarEvent$WecManualActionStatistics | null | undefined;
}

export class WarEventCondition extends $ProtoSchemaBase {
    private _WecCommonData?: $Message$CommonProto$WarEvent$WecCommonData | null | undefined;
    private _WecTurnAndPlayer?: $Message$CommonProto$WarEvent$WecTurnAndPlayer | null | undefined;
    private _WecWeatherAndFog?: $Message$CommonProto$WarEvent$WecWeatherAndFog | null | undefined;
    private _WecExpression?: $Message$CommonProto$WarEvent$WecExpression | null | undefined;
    private _WecEventCalledCount?: $Message$CommonProto$WarEvent$WecEventCalledCount | null | undefined;
    private _WecPlayerPresence?: $Message$CommonProto$WarEvent$WecPlayerPresence | null | undefined;
    private _WecTilePresence?: $Message$CommonProto$WarEvent$WecTilePresence | null | undefined;
    private _WecUnitPresence?: $Message$CommonProto$WarEvent$WecUnitPresence | null | undefined;
    private _WecCustomCounter?: $Message$CommonProto$WarEvent$WecCustomCounter | null | undefined;
    private _WecOngoingPersistentActionPresence?: $Message$CommonProto$WarEvent$WecOngoingPersistentActionPresence | null | undefined;
    private _WecManualActionStatistics?: $Message$CommonProto$WarEvent$WecManualActionStatistics | null | undefined;

    public static fromJson(obj: WarEventConditionJson): WarEventCondition {
        return new WarEventCondition().loadJson(obj);
    }
    public override loadJson(obj: WarEventConditionJson): this {
        this.setWecCommonData(obj.WecCommonData != null ? $Message$CommonProto$WarEvent$WecCommonData.fromJson(obj.WecCommonData) : null);
        this.setWecTurnAndPlayer(obj.WecTurnAndPlayer != null ? $Message$CommonProto$WarEvent$WecTurnAndPlayer.fromJson(obj.WecTurnAndPlayer) : null);
        this.setWecWeatherAndFog(obj.WecWeatherAndFog != null ? $Message$CommonProto$WarEvent$WecWeatherAndFog.fromJson(obj.WecWeatherAndFog) : null);
        this.setWecExpression(obj.WecExpression != null ? $Message$CommonProto$WarEvent$WecExpression.fromJson(obj.WecExpression) : null);
        this.setWecEventCalledCount(obj.WecEventCalledCount != null ? $Message$CommonProto$WarEvent$WecEventCalledCount.fromJson(obj.WecEventCalledCount) : null);
        this.setWecPlayerPresence(obj.WecPlayerPresence != null ? $Message$CommonProto$WarEvent$WecPlayerPresence.fromJson(obj.WecPlayerPresence) : null);
        this.setWecTilePresence(obj.WecTilePresence != null ? $Message$CommonProto$WarEvent$WecTilePresence.fromJson(obj.WecTilePresence) : null);
        this.setWecUnitPresence(obj.WecUnitPresence != null ? $Message$CommonProto$WarEvent$WecUnitPresence.fromJson(obj.WecUnitPresence) : null);
        this.setWecCustomCounter(obj.WecCustomCounter != null ? $Message$CommonProto$WarEvent$WecCustomCounter.fromJson(obj.WecCustomCounter) : null);
        this.setWecOngoingPersistentActionPresence(obj.WecOngoingPersistentActionPresence != null ? $Message$CommonProto$WarEvent$WecOngoingPersistentActionPresence.fromJson(obj.WecOngoingPersistentActionPresence) : null);
        this.setWecManualActionStatistics(obj.WecManualActionStatistics != null ? $Message$CommonProto$WarEvent$WecManualActionStatistics.fromJson(obj.WecManualActionStatistics) : null);
        return this;
    }
    public override toJson(obj?: WarEventConditionJson): WarEventConditionJson {
        obj ??= ({} as WarEventConditionJson);

        {
            const value = this.getWecCommonData();
            (value != null) && (obj.WecCommonData = value.toJson());
        }

        {
            const value = this.getWecTurnAndPlayer();
            (value != null) && (obj.WecTurnAndPlayer = value.toJson());
        }

        {
            const value = this.getWecWeatherAndFog();
            (value != null) && (obj.WecWeatherAndFog = value.toJson());
        }

        {
            const value = this.getWecExpression();
            (value != null) && (obj.WecExpression = value.toJson());
        }

        {
            const value = this.getWecEventCalledCount();
            (value != null) && (obj.WecEventCalledCount = value.toJson());
        }

        {
            const value = this.getWecPlayerPresence();
            (value != null) && (obj.WecPlayerPresence = value.toJson());
        }

        {
            const value = this.getWecTilePresence();
            (value != null) && (obj.WecTilePresence = value.toJson());
        }

        {
            const value = this.getWecUnitPresence();
            (value != null) && (obj.WecUnitPresence = value.toJson());
        }

        {
            const value = this.getWecCustomCounter();
            (value != null) && (obj.WecCustomCounter = value.toJson());
        }

        {
            const value = this.getWecOngoingPersistentActionPresence();
            (value != null) && (obj.WecOngoingPersistentActionPresence = value.toJson());
        }

        {
            const value = this.getWecManualActionStatistics();
            (value != null) && (obj.WecManualActionStatistics = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWecCommonData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getWecTurnAndPlayer();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getWecWeatherAndFog();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getWecExpression();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getWecEventCalledCount();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getWecPlayerPresence();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        {
            const value = this.getWecTilePresence();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getWecUnitPresence();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getWecCustomCounter();
            if (value != null) {
                value.toWriter(writer.uint32(138).fork()).ldelim();
            }
        }

        {
            const value = this.getWecOngoingPersistentActionPresence();
            if (value != null) {
                value.toWriter(writer.uint32(146).fork()).ldelim();
            }
        }

        {
            const value = this.getWecManualActionStatistics();
            if (value != null) {
                value.toWriter(writer.uint32(154).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarEventCondition {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarEventCondition();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWecCommonData($Message$CommonProto$WarEvent$WecCommonData.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setWecTurnAndPlayer($Message$CommonProto$WarEvent$WecTurnAndPlayer.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setWecWeatherAndFog($Message$CommonProto$WarEvent$WecWeatherAndFog.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setWecExpression($Message$CommonProto$WarEvent$WecExpression.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setWecEventCalledCount($Message$CommonProto$WarEvent$WecEventCalledCount.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setWecPlayerPresence($Message$CommonProto$WarEvent$WecPlayerPresence.decode(reader, reader.uint32()));
                    break;

                case 15:
                    msg.setWecTilePresence($Message$CommonProto$WarEvent$WecTilePresence.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setWecUnitPresence($Message$CommonProto$WarEvent$WecUnitPresence.decode(reader, reader.uint32()));
                    break;

                case 17:
                    msg.setWecCustomCounter($Message$CommonProto$WarEvent$WecCustomCounter.decode(reader, reader.uint32()));
                    break;

                case 18:
                    msg.setWecOngoingPersistentActionPresence($Message$CommonProto$WarEvent$WecOngoingPersistentActionPresence.decode(reader, reader.uint32()));
                    break;

                case 19:
                    msg.setWecManualActionStatistics($Message$CommonProto$WarEvent$WecManualActionStatistics.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WarEventCondition {
        return WarEventCondition.decode(this.encode());
    }

    public override getSchemaName(): "WarEventCondition" {
        return "WarEventCondition";
    }

    public clearConditionData(): void {
        this._WecTurnAndPlayer = null;
        this._WecWeatherAndFog = null;
        this._WecExpression = null;
        this._WecEventCalledCount = null;
        this._WecPlayerPresence = null;
        this._WecTilePresence = null;
        this._WecUnitPresence = null;
        this._WecCustomCounter = null;
        this._WecOngoingPersistentActionPresence = null;
        this._WecManualActionStatistics = null;
    }

    public checkHasWecCommonData(): boolean {
        return this._WecCommonData != null;
    }
    public getWecCommonData(): $Message$CommonProto$WarEvent$WecCommonData | null | undefined {
        return this._WecCommonData;
    }
    public setWecCommonData(value: $Message$CommonProto$WarEvent$WecCommonData | null | undefined): void {
        this._WecCommonData = value;
    }
    public createIfNotExistsWecCommonData(): $Message$CommonProto$WarEvent$WecCommonData {
        return this._WecCommonData ??= new $Message$CommonProto$WarEvent$WecCommonData();
    }

    public checkHasWecTurnAndPlayer(): boolean {
        return this._WecTurnAndPlayer != null;
    }
    public getWecTurnAndPlayer(): $Message$CommonProto$WarEvent$WecTurnAndPlayer | null | undefined {
        return this._WecTurnAndPlayer;
    }
    public setWecTurnAndPlayer(value: $Message$CommonProto$WarEvent$WecTurnAndPlayer | null | undefined): void {
        this._WecTurnAndPlayer = value;
    }
    public createIfNotExistsWecTurnAndPlayer(): $Message$CommonProto$WarEvent$WecTurnAndPlayer {
        return this._WecTurnAndPlayer ??= new $Message$CommonProto$WarEvent$WecTurnAndPlayer();
    }

    public checkHasWecWeatherAndFog(): boolean {
        return this._WecWeatherAndFog != null;
    }
    public getWecWeatherAndFog(): $Message$CommonProto$WarEvent$WecWeatherAndFog | null | undefined {
        return this._WecWeatherAndFog;
    }
    public setWecWeatherAndFog(value: $Message$CommonProto$WarEvent$WecWeatherAndFog | null | undefined): void {
        this._WecWeatherAndFog = value;
    }
    public createIfNotExistsWecWeatherAndFog(): $Message$CommonProto$WarEvent$WecWeatherAndFog {
        return this._WecWeatherAndFog ??= new $Message$CommonProto$WarEvent$WecWeatherAndFog();
    }

    public checkHasWecExpression(): boolean {
        return this._WecExpression != null;
    }
    public getWecExpression(): $Message$CommonProto$WarEvent$WecExpression | null | undefined {
        return this._WecExpression;
    }
    public setWecExpression(value: $Message$CommonProto$WarEvent$WecExpression | null | undefined): void {
        this._WecExpression = value;
    }
    public createIfNotExistsWecExpression(): $Message$CommonProto$WarEvent$WecExpression {
        return this._WecExpression ??= new $Message$CommonProto$WarEvent$WecExpression();
    }

    public checkHasWecEventCalledCount(): boolean {
        return this._WecEventCalledCount != null;
    }
    public getWecEventCalledCount(): $Message$CommonProto$WarEvent$WecEventCalledCount | null | undefined {
        return this._WecEventCalledCount;
    }
    public setWecEventCalledCount(value: $Message$CommonProto$WarEvent$WecEventCalledCount | null | undefined): void {
        this._WecEventCalledCount = value;
    }
    public createIfNotExistsWecEventCalledCount(): $Message$CommonProto$WarEvent$WecEventCalledCount {
        return this._WecEventCalledCount ??= new $Message$CommonProto$WarEvent$WecEventCalledCount();
    }

    public checkHasWecPlayerPresence(): boolean {
        return this._WecPlayerPresence != null;
    }
    public getWecPlayerPresence(): $Message$CommonProto$WarEvent$WecPlayerPresence | null | undefined {
        return this._WecPlayerPresence;
    }
    public setWecPlayerPresence(value: $Message$CommonProto$WarEvent$WecPlayerPresence | null | undefined): void {
        this._WecPlayerPresence = value;
    }
    public createIfNotExistsWecPlayerPresence(): $Message$CommonProto$WarEvent$WecPlayerPresence {
        return this._WecPlayerPresence ??= new $Message$CommonProto$WarEvent$WecPlayerPresence();
    }

    public checkHasWecTilePresence(): boolean {
        return this._WecTilePresence != null;
    }
    public getWecTilePresence(): $Message$CommonProto$WarEvent$WecTilePresence | null | undefined {
        return this._WecTilePresence;
    }
    public setWecTilePresence(value: $Message$CommonProto$WarEvent$WecTilePresence | null | undefined): void {
        this._WecTilePresence = value;
    }
    public createIfNotExistsWecTilePresence(): $Message$CommonProto$WarEvent$WecTilePresence {
        return this._WecTilePresence ??= new $Message$CommonProto$WarEvent$WecTilePresence();
    }

    public checkHasWecUnitPresence(): boolean {
        return this._WecUnitPresence != null;
    }
    public getWecUnitPresence(): $Message$CommonProto$WarEvent$WecUnitPresence | null | undefined {
        return this._WecUnitPresence;
    }
    public setWecUnitPresence(value: $Message$CommonProto$WarEvent$WecUnitPresence | null | undefined): void {
        this._WecUnitPresence = value;
    }
    public createIfNotExistsWecUnitPresence(): $Message$CommonProto$WarEvent$WecUnitPresence {
        return this._WecUnitPresence ??= new $Message$CommonProto$WarEvent$WecUnitPresence();
    }

    public checkHasWecCustomCounter(): boolean {
        return this._WecCustomCounter != null;
    }
    public getWecCustomCounter(): $Message$CommonProto$WarEvent$WecCustomCounter | null | undefined {
        return this._WecCustomCounter;
    }
    public setWecCustomCounter(value: $Message$CommonProto$WarEvent$WecCustomCounter | null | undefined): void {
        this._WecCustomCounter = value;
    }
    public createIfNotExistsWecCustomCounter(): $Message$CommonProto$WarEvent$WecCustomCounter {
        return this._WecCustomCounter ??= new $Message$CommonProto$WarEvent$WecCustomCounter();
    }

    public checkHasWecOngoingPersistentActionPresence(): boolean {
        return this._WecOngoingPersistentActionPresence != null;
    }
    public getWecOngoingPersistentActionPresence(): $Message$CommonProto$WarEvent$WecOngoingPersistentActionPresence | null | undefined {
        return this._WecOngoingPersistentActionPresence;
    }
    public setWecOngoingPersistentActionPresence(value: $Message$CommonProto$WarEvent$WecOngoingPersistentActionPresence | null | undefined): void {
        this._WecOngoingPersistentActionPresence = value;
    }
    public createIfNotExistsWecOngoingPersistentActionPresence(): $Message$CommonProto$WarEvent$WecOngoingPersistentActionPresence {
        return this._WecOngoingPersistentActionPresence ??= new $Message$CommonProto$WarEvent$WecOngoingPersistentActionPresence();
    }

    public checkHasWecManualActionStatistics(): boolean {
        return this._WecManualActionStatistics != null;
    }
    public getWecManualActionStatistics(): $Message$CommonProto$WarEvent$WecManualActionStatistics | null | undefined {
        return this._WecManualActionStatistics;
    }
    public setWecManualActionStatistics(value: $Message$CommonProto$WarEvent$WecManualActionStatistics | null | undefined): void {
        this._WecManualActionStatistics = value;
    }
    public createIfNotExistsWecManualActionStatistics(): $Message$CommonProto$WarEvent$WecManualActionStatistics {
        return this._WecManualActionStatistics ??= new $Message$CommonProto$WarEvent$WecManualActionStatistics();
    }
}
