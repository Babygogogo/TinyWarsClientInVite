import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SeedRandomState as $Message$CommonProto$Structure$SeedRandomState, type SeedRandomStateJson as $Json$CommonProto$Structure$SeedRandomState } from "../Structure/SeedRandomState.js";
import { SerialDrawVoteManager as $Message$CommonProto$WarSerialization$SerialDrawVoteManager, type SerialDrawVoteManagerJson as $Json$CommonProto$WarSerialization$SerialDrawVoteManager } from "./SerialDrawVoteManager.js";
import { SerialExecutedOperationManager as $Message$CommonProto$WarSerialization$SerialExecutedOperationManager, type SerialExecutedOperationManagerJson as $Json$CommonProto$WarSerialization$SerialExecutedOperationManager } from "./SerialExecutedOperationManager.js";
import { SerialField as $Message$CommonProto$WarSerialization$SerialField, type SerialFieldJson as $Json$CommonProto$WarSerialization$SerialField } from "./SerialField.js";
import { SerialPlayerManager as $Message$CommonProto$WarSerialization$SerialPlayerManager, type SerialPlayerManagerJson as $Json$CommonProto$WarSerialization$SerialPlayerManager } from "./SerialPlayerManager.js";
import { SerialTaskObjectiveManager as $Message$CommonProto$WarSerialization$SerialTaskObjectiveManager, type SerialTaskObjectiveManagerJson as $Json$CommonProto$WarSerialization$SerialTaskObjectiveManager } from "./SerialTaskObjectiveManager.js";
import { SerialTurnManager as $Message$CommonProto$WarSerialization$SerialTurnManager, type SerialTurnManagerJson as $Json$CommonProto$WarSerialization$SerialTurnManager } from "./SerialTurnManager.js";
import { SerialWarEventManager as $Message$CommonProto$WarSerialization$SerialWarEventManager, type SerialWarEventManagerJson as $Json$CommonProto$WarSerialization$SerialWarEventManager } from "./SerialWarEventManager.js";
import { SerialWarStatisticsManager as $Message$CommonProto$WarSerialization$SerialWarStatisticsManager, type SerialWarStatisticsManagerJson as $Json$CommonProto$WarSerialization$SerialWarStatisticsManager } from "./SerialWarStatisticsManager.js";
import { SerialWeatherManager as $Message$CommonProto$WarSerialization$SerialWeatherManager, type SerialWeatherManagerJson as $Json$CommonProto$WarSerialization$SerialWeatherManager } from "./SerialWeatherManager.js";
import { SettingsForAtw as $Message$CommonProto$WarSettings$SettingsForAtw, type SettingsForAtwJson as $Json$CommonProto$WarSettings$SettingsForAtw } from "../WarSettings/SettingsForAtw.js";
import { SettingsForCaw as $Message$CommonProto$WarSettings$SettingsForCaw, type SettingsForCawJson as $Json$CommonProto$WarSettings$SettingsForCaw } from "../WarSettings/SettingsForCaw.js";
import { SettingsForCcw as $Message$CommonProto$WarSettings$SettingsForCcw, type SettingsForCcwJson as $Json$CommonProto$WarSettings$SettingsForCcw } from "../WarSettings/SettingsForCcw.js";
import { SettingsForCommon as $Message$CommonProto$WarSettings$SettingsForCommon, type SettingsForCommonJson as $Json$CommonProto$WarSettings$SettingsForCommon } from "../WarSettings/SettingsForCommon.js";
import { SettingsForMcw as $Message$CommonProto$WarSettings$SettingsForMcw, type SettingsForMcwJson as $Json$CommonProto$WarSettings$SettingsForMcw } from "../WarSettings/SettingsForMcw.js";
import { SettingsForMfw as $Message$CommonProto$WarSettings$SettingsForMfw, type SettingsForMfwJson as $Json$CommonProto$WarSettings$SettingsForMfw } from "../WarSettings/SettingsForMfw.js";
import { SettingsForMmw as $Message$CommonProto$WarSettings$SettingsForMmw, type SettingsForMmwJson as $Json$CommonProto$WarSettings$SettingsForMmw } from "../WarSettings/SettingsForMmw.js";
import { SettingsForMrw as $Message$CommonProto$WarSettings$SettingsForMrw, type SettingsForMrwJson as $Json$CommonProto$WarSettings$SettingsForMrw } from "../WarSettings/SettingsForMrw.js";
import { SettingsForScw as $Message$CommonProto$WarSettings$SettingsForScw, type SettingsForScwJson as $Json$CommonProto$WarSettings$SettingsForScw } from "../WarSettings/SettingsForScw.js";
import { SettingsForSfw as $Message$CommonProto$WarSettings$SettingsForSfw, type SettingsForSfwJson as $Json$CommonProto$WarSettings$SettingsForSfw } from "../WarSettings/SettingsForSfw.js";
import { SettingsForSrw as $Message$CommonProto$WarSettings$SettingsForSrw, type SettingsForSrwJson as $Json$CommonProto$WarSettings$SettingsForSrw } from "../WarSettings/SettingsForSrw.js";

export interface SerialWarJson extends $ProtoSchemaJsonBase {
    settingsForCommon?: $Json$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    settingsForMcw?: $Json$CommonProto$WarSettings$SettingsForMcw | null | undefined;
    settingsForScw?: $Json$CommonProto$WarSettings$SettingsForScw | null | undefined;
    settingsForMrw?: $Json$CommonProto$WarSettings$SettingsForMrw | null | undefined;
    settingsForMfw?: $Json$CommonProto$WarSettings$SettingsForMfw | null | undefined;
    settingsForSfw?: $Json$CommonProto$WarSettings$SettingsForSfw | null | undefined;
    settingsForSrw?: $Json$CommonProto$WarSettings$SettingsForSrw | null | undefined;
    settingsForCcw?: $Json$CommonProto$WarSettings$SettingsForCcw | null | undefined;
    settingsForMmw?: $Json$CommonProto$WarSettings$SettingsForMmw | null | undefined;
    warId?: number | null | undefined;
    seedRandomInitialState?: $Json$CommonProto$Structure$SeedRandomState | null | undefined;
    seedRandomCurrentState?: $Json$CommonProto$Structure$SeedRandomState | null | undefined;
    warStatisticsManager?: $Json$CommonProto$WarSerialization$SerialWarStatisticsManager | null | undefined;
    remainingVotesForDraw?: number | null | undefined;
    playerManager?: $Json$CommonProto$WarSerialization$SerialPlayerManager | null | undefined;
    turnManager?: $Json$CommonProto$WarSerialization$SerialTurnManager | null | undefined;
    field?: $Json$CommonProto$WarSerialization$SerialField | null | undefined;
    warEventManager?: $Json$CommonProto$WarSerialization$SerialWarEventManager | null | undefined;
    weatherManager?: $Json$CommonProto$WarSerialization$SerialWeatherManager | null | undefined;
    modifiedTime?: number | null | undefined;
    isEnded?: boolean | null | undefined;
    executedOperationManager?: $Json$CommonProto$WarSerialization$SerialExecutedOperationManager | null | undefined;
    taskObjectiveManager?: $Json$CommonProto$WarSerialization$SerialTaskObjectiveManager | null | undefined;
    drawVoteManager?: $Json$CommonProto$WarSerialization$SerialDrawVoteManager | null | undefined;
    settingsForAtw?: $Json$CommonProto$WarSettings$SettingsForAtw | null | undefined;
    settingsForCaw?: $Json$CommonProto$WarSettings$SettingsForCaw | null | undefined;
}

export class SerialWar extends $ProtoSchemaBase {
    private _settingsForCommon?: $Message$CommonProto$WarSettings$SettingsForCommon | null | undefined;
    private _settingsForMcw?: $Message$CommonProto$WarSettings$SettingsForMcw | null | undefined;
    private _settingsForScw?: $Message$CommonProto$WarSettings$SettingsForScw | null | undefined;
    private _settingsForMrw?: $Message$CommonProto$WarSettings$SettingsForMrw | null | undefined;
    private _settingsForMfw?: $Message$CommonProto$WarSettings$SettingsForMfw | null | undefined;
    private _settingsForSfw?: $Message$CommonProto$WarSettings$SettingsForSfw | null | undefined;
    private _settingsForSrw?: $Message$CommonProto$WarSettings$SettingsForSrw | null | undefined;
    private _settingsForCcw?: $Message$CommonProto$WarSettings$SettingsForCcw | null | undefined;
    private _settingsForMmw?: $Message$CommonProto$WarSettings$SettingsForMmw | null | undefined;
    private _warId?: number | null | undefined;
    private _seedRandomInitialState?: $Message$CommonProto$Structure$SeedRandomState | null | undefined;
    private _seedRandomCurrentState?: $Message$CommonProto$Structure$SeedRandomState | null | undefined;
    private _warStatisticsManager?: $Message$CommonProto$WarSerialization$SerialWarStatisticsManager | null | undefined;
    private _remainingVotesForDraw?: number | null | undefined;
    private _playerManager?: $Message$CommonProto$WarSerialization$SerialPlayerManager | null | undefined;
    private _turnManager?: $Message$CommonProto$WarSerialization$SerialTurnManager | null | undefined;
    private _field?: $Message$CommonProto$WarSerialization$SerialField | null | undefined;
    private _warEventManager?: $Message$CommonProto$WarSerialization$SerialWarEventManager | null | undefined;
    private _weatherManager?: $Message$CommonProto$WarSerialization$SerialWeatherManager | null | undefined;
    private _modifiedTime?: number | null | undefined;
    private _isEnded?: boolean | null | undefined;
    private _executedOperationManager?: $Message$CommonProto$WarSerialization$SerialExecutedOperationManager | null | undefined;
    private _taskObjectiveManager?: $Message$CommonProto$WarSerialization$SerialTaskObjectiveManager | null | undefined;
    private _drawVoteManager?: $Message$CommonProto$WarSerialization$SerialDrawVoteManager | null | undefined;
    private _settingsForAtw?: $Message$CommonProto$WarSettings$SettingsForAtw | null | undefined;
    private _settingsForCaw?: $Message$CommonProto$WarSettings$SettingsForCaw | null | undefined;

    public static fromJson(obj: SerialWarJson): SerialWar {
        return new SerialWar().loadJson(obj);
    }
    public override loadJson(obj: SerialWarJson): this {
        this.setSettingsForCommon(obj.settingsForCommon != null ? $Message$CommonProto$WarSettings$SettingsForCommon.fromJson(obj.settingsForCommon) : null);
        this.setSettingsForMcw(obj.settingsForMcw != null ? $Message$CommonProto$WarSettings$SettingsForMcw.fromJson(obj.settingsForMcw) : null);
        this.setSettingsForScw(obj.settingsForScw != null ? $Message$CommonProto$WarSettings$SettingsForScw.fromJson(obj.settingsForScw) : null);
        this.setSettingsForMrw(obj.settingsForMrw != null ? $Message$CommonProto$WarSettings$SettingsForMrw.fromJson(obj.settingsForMrw) : null);
        this.setSettingsForMfw(obj.settingsForMfw != null ? $Message$CommonProto$WarSettings$SettingsForMfw.fromJson(obj.settingsForMfw) : null);
        this.setSettingsForSfw(obj.settingsForSfw != null ? $Message$CommonProto$WarSettings$SettingsForSfw.fromJson(obj.settingsForSfw) : null);
        this.setSettingsForSrw(obj.settingsForSrw != null ? $Message$CommonProto$WarSettings$SettingsForSrw.fromJson(obj.settingsForSrw) : null);
        this.setSettingsForCcw(obj.settingsForCcw != null ? $Message$CommonProto$WarSettings$SettingsForCcw.fromJson(obj.settingsForCcw) : null);
        this.setSettingsForMmw(obj.settingsForMmw != null ? $Message$CommonProto$WarSettings$SettingsForMmw.fromJson(obj.settingsForMmw) : null);
        this.setWarId(obj.warId);
        this.setSeedRandomInitialState(obj.seedRandomInitialState != null ? $Message$CommonProto$Structure$SeedRandomState.fromJson(obj.seedRandomInitialState) : null);
        this.setSeedRandomCurrentState(obj.seedRandomCurrentState != null ? $Message$CommonProto$Structure$SeedRandomState.fromJson(obj.seedRandomCurrentState) : null);
        this.setWarStatisticsManager(obj.warStatisticsManager != null ? $Message$CommonProto$WarSerialization$SerialWarStatisticsManager.fromJson(obj.warStatisticsManager) : null);
        this.setRemainingVotesForDraw(obj.remainingVotesForDraw);
        this.setPlayerManager(obj.playerManager != null ? $Message$CommonProto$WarSerialization$SerialPlayerManager.fromJson(obj.playerManager) : null);
        this.setTurnManager(obj.turnManager != null ? $Message$CommonProto$WarSerialization$SerialTurnManager.fromJson(obj.turnManager) : null);
        this.setField(obj.field != null ? $Message$CommonProto$WarSerialization$SerialField.fromJson(obj.field) : null);
        this.setWarEventManager(obj.warEventManager != null ? $Message$CommonProto$WarSerialization$SerialWarEventManager.fromJson(obj.warEventManager) : null);
        this.setWeatherManager(obj.weatherManager != null ? $Message$CommonProto$WarSerialization$SerialWeatherManager.fromJson(obj.weatherManager) : null);
        this.setModifiedTime(obj.modifiedTime);
        this.setIsEnded(obj.isEnded);
        this.setExecutedOperationManager(obj.executedOperationManager != null ? $Message$CommonProto$WarSerialization$SerialExecutedOperationManager.fromJson(obj.executedOperationManager) : null);
        this.setTaskObjectiveManager(obj.taskObjectiveManager != null ? $Message$CommonProto$WarSerialization$SerialTaskObjectiveManager.fromJson(obj.taskObjectiveManager) : null);
        this.setDrawVoteManager(obj.drawVoteManager != null ? $Message$CommonProto$WarSerialization$SerialDrawVoteManager.fromJson(obj.drawVoteManager) : null);
        this.setSettingsForAtw(obj.settingsForAtw != null ? $Message$CommonProto$WarSettings$SettingsForAtw.fromJson(obj.settingsForAtw) : null);
        this.setSettingsForCaw(obj.settingsForCaw != null ? $Message$CommonProto$WarSettings$SettingsForCaw.fromJson(obj.settingsForCaw) : null);
        return this;
    }
    public override toJson(obj?: SerialWarJson): SerialWarJson {
        obj ??= ({} as SerialWarJson);

        {
            const value = this.getSettingsForCommon();
            (value != null) && (obj.settingsForCommon = value.toJson());
        }

        {
            const value = this.getSettingsForMcw();
            (value != null) && (obj.settingsForMcw = value.toJson());
        }

        {
            const value = this.getSettingsForScw();
            (value != null) && (obj.settingsForScw = value.toJson());
        }

        {
            const value = this.getSettingsForMrw();
            (value != null) && (obj.settingsForMrw = value.toJson());
        }

        {
            const value = this.getSettingsForMfw();
            (value != null) && (obj.settingsForMfw = value.toJson());
        }

        {
            const value = this.getSettingsForSfw();
            (value != null) && (obj.settingsForSfw = value.toJson());
        }

        {
            const value = this.getSettingsForSrw();
            (value != null) && (obj.settingsForSrw = value.toJson());
        }

        {
            const value = this.getSettingsForCcw();
            (value != null) && (obj.settingsForCcw = value.toJson());
        }

        {
            const value = this.getSettingsForMmw();
            (value != null) && (obj.settingsForMmw = value.toJson());
        }

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getSeedRandomInitialState();
            (value != null) && (obj.seedRandomInitialState = value.toJson());
        }

        {
            const value = this.getSeedRandomCurrentState();
            (value != null) && (obj.seedRandomCurrentState = value.toJson());
        }

        {
            const value = this.getWarStatisticsManager();
            (value != null) && (obj.warStatisticsManager = value.toJson());
        }

        {
            const value = this.getRemainingVotesForDraw();
            (value != null) && (obj.remainingVotesForDraw = value);
        }

        {
            const value = this.getPlayerManager();
            (value != null) && (obj.playerManager = value.toJson());
        }

        {
            const value = this.getTurnManager();
            (value != null) && (obj.turnManager = value.toJson());
        }

        {
            const value = this.getField();
            (value != null) && (obj.field = value.toJson());
        }

        {
            const value = this.getWarEventManager();
            (value != null) && (obj.warEventManager = value.toJson());
        }

        {
            const value = this.getWeatherManager();
            (value != null) && (obj.weatherManager = value.toJson());
        }

        {
            const value = this.getModifiedTime();
            (value != null) && (obj.modifiedTime = value);
        }

        {
            const value = this.getIsEnded();
            (value != null) && (obj.isEnded = value);
        }

        {
            const value = this.getExecutedOperationManager();
            (value != null) && (obj.executedOperationManager = value.toJson());
        }

        {
            const value = this.getTaskObjectiveManager();
            (value != null) && (obj.taskObjectiveManager = value.toJson());
        }

        {
            const value = this.getDrawVoteManager();
            (value != null) && (obj.drawVoteManager = value.toJson());
        }

        {
            const value = this.getSettingsForAtw();
            (value != null) && (obj.settingsForAtw = value.toJson());
        }

        {
            const value = this.getSettingsForCaw();
            (value != null) && (obj.settingsForCaw = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSettingsForCommon();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMcw();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForScw();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMrw();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMfw();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForSfw();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForSrw();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForCcw();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForMmw();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getSeedRandomInitialState();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getSeedRandomCurrentState();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getWarStatisticsManager();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getRemainingVotesForDraw();
            if (value != null) {
                writer.uint32(112).int32(value);
            }
        }

        {
            const value = this.getPlayerManager();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getTurnManager();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getField();
            if (value != null) {
                value.toWriter(writer.uint32(138).fork()).ldelim();
            }
        }

        {
            const value = this.getWarEventManager();
            if (value != null) {
                value.toWriter(writer.uint32(146).fork()).ldelim();
            }
        }

        {
            const value = this.getWeatherManager();
            if (value != null) {
                value.toWriter(writer.uint32(154).fork()).ldelim();
            }
        }

        {
            const value = this.getModifiedTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(160).uint32(value);
            }
        }

        {
            const value = this.getIsEnded();
            if ((value != null) && (value != false)) {
                writer.uint32(168).bool(value);
            }
        }

        {
            const value = this.getExecutedOperationManager();
            if (value != null) {
                value.toWriter(writer.uint32(178).fork()).ldelim();
            }
        }

        {
            const value = this.getTaskObjectiveManager();
            if (value != null) {
                value.toWriter(writer.uint32(186).fork()).ldelim();
            }
        }

        {
            const value = this.getDrawVoteManager();
            if (value != null) {
                value.toWriter(writer.uint32(194).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForAtw();
            if (value != null) {
                value.toWriter(writer.uint32(242).fork()).ldelim();
            }
        }

        {
            const value = this.getSettingsForCaw();
            if (value != null) {
                value.toWriter(writer.uint32(250).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialWar {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialWar();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSettingsForCommon($Message$CommonProto$WarSettings$SettingsForCommon.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setSettingsForMcw($Message$CommonProto$WarSettings$SettingsForMcw.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setSettingsForScw($Message$CommonProto$WarSettings$SettingsForScw.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setSettingsForMrw($Message$CommonProto$WarSettings$SettingsForMrw.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setSettingsForMfw($Message$CommonProto$WarSettings$SettingsForMfw.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setSettingsForSfw($Message$CommonProto$WarSettings$SettingsForSfw.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setSettingsForSrw($Message$CommonProto$WarSettings$SettingsForSrw.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setSettingsForCcw($Message$CommonProto$WarSettings$SettingsForCcw.decode(reader, reader.uint32()));
                    break;

                case 9:
                    msg.setSettingsForMmw($Message$CommonProto$WarSettings$SettingsForMmw.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setWarId(reader.int32());
                    break;

                case 11:
                    msg.setSeedRandomInitialState($Message$CommonProto$Structure$SeedRandomState.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setSeedRandomCurrentState($Message$CommonProto$Structure$SeedRandomState.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setWarStatisticsManager($Message$CommonProto$WarSerialization$SerialWarStatisticsManager.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setRemainingVotesForDraw(reader.int32());
                    break;

                case 15:
                    msg.setPlayerManager($Message$CommonProto$WarSerialization$SerialPlayerManager.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setTurnManager($Message$CommonProto$WarSerialization$SerialTurnManager.decode(reader, reader.uint32()));
                    break;

                case 17:
                    msg.setField($Message$CommonProto$WarSerialization$SerialField.decode(reader, reader.uint32()));
                    break;

                case 18:
                    msg.setWarEventManager($Message$CommonProto$WarSerialization$SerialWarEventManager.decode(reader, reader.uint32()));
                    break;

                case 19:
                    msg.setWeatherManager($Message$CommonProto$WarSerialization$SerialWeatherManager.decode(reader, reader.uint32()));
                    break;

                case 20:
                    msg.setModifiedTime(reader.uint32());
                    break;

                case 21:
                    msg.setIsEnded(reader.bool());
                    break;

                case 22:
                    msg.setExecutedOperationManager($Message$CommonProto$WarSerialization$SerialExecutedOperationManager.decode(reader, reader.uint32()));
                    break;

                case 23:
                    msg.setTaskObjectiveManager($Message$CommonProto$WarSerialization$SerialTaskObjectiveManager.decode(reader, reader.uint32()));
                    break;

                case 24:
                    msg.setDrawVoteManager($Message$CommonProto$WarSerialization$SerialDrawVoteManager.decode(reader, reader.uint32()));
                    break;

                case 30:
                    msg.setSettingsForAtw($Message$CommonProto$WarSettings$SettingsForAtw.decode(reader, reader.uint32()));
                    break;

                case 31:
                    msg.setSettingsForCaw($Message$CommonProto$WarSettings$SettingsForCaw.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialWar {
        return SerialWar.decode(this.encode());
    }

    public override getSchemaName(): "SerialWar" {
        return "SerialWar";
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

    public checkHasSettingsForMcw(): boolean {
        return this._settingsForMcw != null;
    }
    public getSettingsForMcw(): $Message$CommonProto$WarSettings$SettingsForMcw | null | undefined {
        return this._settingsForMcw;
    }
    public setSettingsForMcw(value: $Message$CommonProto$WarSettings$SettingsForMcw | null | undefined): void {
        this._settingsForMcw = value;
    }
    public createIfNotExistsSettingsForMcw(): $Message$CommonProto$WarSettings$SettingsForMcw {
        return this._settingsForMcw ??= new $Message$CommonProto$WarSettings$SettingsForMcw();
    }

    public checkHasSettingsForScw(): boolean {
        return this._settingsForScw != null;
    }
    public getSettingsForScw(): $Message$CommonProto$WarSettings$SettingsForScw | null | undefined {
        return this._settingsForScw;
    }
    public setSettingsForScw(value: $Message$CommonProto$WarSettings$SettingsForScw | null | undefined): void {
        this._settingsForScw = value;
    }
    public createIfNotExistsSettingsForScw(): $Message$CommonProto$WarSettings$SettingsForScw {
        return this._settingsForScw ??= new $Message$CommonProto$WarSettings$SettingsForScw();
    }

    public checkHasSettingsForMrw(): boolean {
        return this._settingsForMrw != null;
    }
    public getSettingsForMrw(): $Message$CommonProto$WarSettings$SettingsForMrw | null | undefined {
        return this._settingsForMrw;
    }
    public setSettingsForMrw(value: $Message$CommonProto$WarSettings$SettingsForMrw | null | undefined): void {
        this._settingsForMrw = value;
    }
    public createIfNotExistsSettingsForMrw(): $Message$CommonProto$WarSettings$SettingsForMrw {
        return this._settingsForMrw ??= new $Message$CommonProto$WarSettings$SettingsForMrw();
    }

    public checkHasSettingsForMfw(): boolean {
        return this._settingsForMfw != null;
    }
    public getSettingsForMfw(): $Message$CommonProto$WarSettings$SettingsForMfw | null | undefined {
        return this._settingsForMfw;
    }
    public setSettingsForMfw(value: $Message$CommonProto$WarSettings$SettingsForMfw | null | undefined): void {
        this._settingsForMfw = value;
    }
    public createIfNotExistsSettingsForMfw(): $Message$CommonProto$WarSettings$SettingsForMfw {
        return this._settingsForMfw ??= new $Message$CommonProto$WarSettings$SettingsForMfw();
    }

    public checkHasSettingsForSfw(): boolean {
        return this._settingsForSfw != null;
    }
    public getSettingsForSfw(): $Message$CommonProto$WarSettings$SettingsForSfw | null | undefined {
        return this._settingsForSfw;
    }
    public setSettingsForSfw(value: $Message$CommonProto$WarSettings$SettingsForSfw | null | undefined): void {
        this._settingsForSfw = value;
    }
    public createIfNotExistsSettingsForSfw(): $Message$CommonProto$WarSettings$SettingsForSfw {
        return this._settingsForSfw ??= new $Message$CommonProto$WarSettings$SettingsForSfw();
    }

    public checkHasSettingsForSrw(): boolean {
        return this._settingsForSrw != null;
    }
    public getSettingsForSrw(): $Message$CommonProto$WarSettings$SettingsForSrw | null | undefined {
        return this._settingsForSrw;
    }
    public setSettingsForSrw(value: $Message$CommonProto$WarSettings$SettingsForSrw | null | undefined): void {
        this._settingsForSrw = value;
    }
    public createIfNotExistsSettingsForSrw(): $Message$CommonProto$WarSettings$SettingsForSrw {
        return this._settingsForSrw ??= new $Message$CommonProto$WarSettings$SettingsForSrw();
    }

    public checkHasSettingsForCcw(): boolean {
        return this._settingsForCcw != null;
    }
    public getSettingsForCcw(): $Message$CommonProto$WarSettings$SettingsForCcw | null | undefined {
        return this._settingsForCcw;
    }
    public setSettingsForCcw(value: $Message$CommonProto$WarSettings$SettingsForCcw | null | undefined): void {
        this._settingsForCcw = value;
    }
    public createIfNotExistsSettingsForCcw(): $Message$CommonProto$WarSettings$SettingsForCcw {
        return this._settingsForCcw ??= new $Message$CommonProto$WarSettings$SettingsForCcw();
    }

    public checkHasSettingsForMmw(): boolean {
        return this._settingsForMmw != null;
    }
    public getSettingsForMmw(): $Message$CommonProto$WarSettings$SettingsForMmw | null | undefined {
        return this._settingsForMmw;
    }
    public setSettingsForMmw(value: $Message$CommonProto$WarSettings$SettingsForMmw | null | undefined): void {
        this._settingsForMmw = value;
    }
    public createIfNotExistsSettingsForMmw(): $Message$CommonProto$WarSettings$SettingsForMmw {
        return this._settingsForMmw ??= new $Message$CommonProto$WarSettings$SettingsForMmw();
    }

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
    }

    public checkHasSeedRandomInitialState(): boolean {
        return this._seedRandomInitialState != null;
    }
    public getSeedRandomInitialState(): $Message$CommonProto$Structure$SeedRandomState | null | undefined {
        return this._seedRandomInitialState;
    }
    public setSeedRandomInitialState(value: $Message$CommonProto$Structure$SeedRandomState | null | undefined): void {
        this._seedRandomInitialState = value;
    }
    public createIfNotExistsSeedRandomInitialState(): $Message$CommonProto$Structure$SeedRandomState {
        return this._seedRandomInitialState ??= new $Message$CommonProto$Structure$SeedRandomState();
    }

    public checkHasSeedRandomCurrentState(): boolean {
        return this._seedRandomCurrentState != null;
    }
    public getSeedRandomCurrentState(): $Message$CommonProto$Structure$SeedRandomState | null | undefined {
        return this._seedRandomCurrentState;
    }
    public setSeedRandomCurrentState(value: $Message$CommonProto$Structure$SeedRandomState | null | undefined): void {
        this._seedRandomCurrentState = value;
    }
    public createIfNotExistsSeedRandomCurrentState(): $Message$CommonProto$Structure$SeedRandomState {
        return this._seedRandomCurrentState ??= new $Message$CommonProto$Structure$SeedRandomState();
    }

    public checkHasWarStatisticsManager(): boolean {
        return this._warStatisticsManager != null;
    }
    public getWarStatisticsManager(): $Message$CommonProto$WarSerialization$SerialWarStatisticsManager | null | undefined {
        return this._warStatisticsManager;
    }
    public setWarStatisticsManager(value: $Message$CommonProto$WarSerialization$SerialWarStatisticsManager | null | undefined): void {
        this._warStatisticsManager = value;
    }
    public createIfNotExistsWarStatisticsManager(): $Message$CommonProto$WarSerialization$SerialWarStatisticsManager {
        return this._warStatisticsManager ??= new $Message$CommonProto$WarSerialization$SerialWarStatisticsManager();
    }

    public checkHasRemainingVotesForDraw(): boolean {
        return this._remainingVotesForDraw != null;
    }
    public getRemainingVotesForDraw(): number | null | undefined {
        return this._remainingVotesForDraw;
    }
    public setRemainingVotesForDraw(value: number | null | undefined): void {
        this._remainingVotesForDraw = value;
    }

    public checkHasPlayerManager(): boolean {
        return this._playerManager != null;
    }
    public getPlayerManager(): $Message$CommonProto$WarSerialization$SerialPlayerManager | null | undefined {
        return this._playerManager;
    }
    public setPlayerManager(value: $Message$CommonProto$WarSerialization$SerialPlayerManager | null | undefined): void {
        this._playerManager = value;
    }
    public createIfNotExistsPlayerManager(): $Message$CommonProto$WarSerialization$SerialPlayerManager {
        return this._playerManager ??= new $Message$CommonProto$WarSerialization$SerialPlayerManager();
    }

    public checkHasTurnManager(): boolean {
        return this._turnManager != null;
    }
    public getTurnManager(): $Message$CommonProto$WarSerialization$SerialTurnManager | null | undefined {
        return this._turnManager;
    }
    public setTurnManager(value: $Message$CommonProto$WarSerialization$SerialTurnManager | null | undefined): void {
        this._turnManager = value;
    }
    public createIfNotExistsTurnManager(): $Message$CommonProto$WarSerialization$SerialTurnManager {
        return this._turnManager ??= new $Message$CommonProto$WarSerialization$SerialTurnManager();
    }

    public checkHasField(): boolean {
        return this._field != null;
    }
    public getField(): $Message$CommonProto$WarSerialization$SerialField | null | undefined {
        return this._field;
    }
    public setField(value: $Message$CommonProto$WarSerialization$SerialField | null | undefined): void {
        this._field = value;
    }
    public createIfNotExistsField(): $Message$CommonProto$WarSerialization$SerialField {
        return this._field ??= new $Message$CommonProto$WarSerialization$SerialField();
    }

    public checkHasWarEventManager(): boolean {
        return this._warEventManager != null;
    }
    public getWarEventManager(): $Message$CommonProto$WarSerialization$SerialWarEventManager | null | undefined {
        return this._warEventManager;
    }
    public setWarEventManager(value: $Message$CommonProto$WarSerialization$SerialWarEventManager | null | undefined): void {
        this._warEventManager = value;
    }
    public createIfNotExistsWarEventManager(): $Message$CommonProto$WarSerialization$SerialWarEventManager {
        return this._warEventManager ??= new $Message$CommonProto$WarSerialization$SerialWarEventManager();
    }

    public checkHasWeatherManager(): boolean {
        return this._weatherManager != null;
    }
    public getWeatherManager(): $Message$CommonProto$WarSerialization$SerialWeatherManager | null | undefined {
        return this._weatherManager;
    }
    public setWeatherManager(value: $Message$CommonProto$WarSerialization$SerialWeatherManager | null | undefined): void {
        this._weatherManager = value;
    }
    public createIfNotExistsWeatherManager(): $Message$CommonProto$WarSerialization$SerialWeatherManager {
        return this._weatherManager ??= new $Message$CommonProto$WarSerialization$SerialWeatherManager();
    }

    public checkHasModifiedTime(): boolean {
        return this._modifiedTime != null;
    }
    public getModifiedTime(): number {
        return this._modifiedTime ?? 0;
    }
    public setModifiedTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._modifiedTime = null;
        } else {
            this._modifiedTime = value;
        }
    }

    public checkHasIsEnded(): boolean {
        return this._isEnded != null;
    }
    public getIsEnded(): boolean {
        return this._isEnded ?? false;
    }
    public setIsEnded(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEnded = null;
        } else {
            this._isEnded = value;
        }
    }

    public checkHasExecutedOperationManager(): boolean {
        return this._executedOperationManager != null;
    }
    public getExecutedOperationManager(): $Message$CommonProto$WarSerialization$SerialExecutedOperationManager | null | undefined {
        return this._executedOperationManager;
    }
    public setExecutedOperationManager(value: $Message$CommonProto$WarSerialization$SerialExecutedOperationManager | null | undefined): void {
        this._executedOperationManager = value;
    }
    public createIfNotExistsExecutedOperationManager(): $Message$CommonProto$WarSerialization$SerialExecutedOperationManager {
        return this._executedOperationManager ??= new $Message$CommonProto$WarSerialization$SerialExecutedOperationManager();
    }

    public checkHasTaskObjectiveManager(): boolean {
        return this._taskObjectiveManager != null;
    }
    public getTaskObjectiveManager(): $Message$CommonProto$WarSerialization$SerialTaskObjectiveManager | null | undefined {
        return this._taskObjectiveManager;
    }
    public setTaskObjectiveManager(value: $Message$CommonProto$WarSerialization$SerialTaskObjectiveManager | null | undefined): void {
        this._taskObjectiveManager = value;
    }
    public createIfNotExistsTaskObjectiveManager(): $Message$CommonProto$WarSerialization$SerialTaskObjectiveManager {
        return this._taskObjectiveManager ??= new $Message$CommonProto$WarSerialization$SerialTaskObjectiveManager();
    }

    public checkHasDrawVoteManager(): boolean {
        return this._drawVoteManager != null;
    }
    public getDrawVoteManager(): $Message$CommonProto$WarSerialization$SerialDrawVoteManager | null | undefined {
        return this._drawVoteManager;
    }
    public setDrawVoteManager(value: $Message$CommonProto$WarSerialization$SerialDrawVoteManager | null | undefined): void {
        this._drawVoteManager = value;
    }
    public createIfNotExistsDrawVoteManager(): $Message$CommonProto$WarSerialization$SerialDrawVoteManager {
        return this._drawVoteManager ??= new $Message$CommonProto$WarSerialization$SerialDrawVoteManager();
    }

    public checkHasSettingsForAtw(): boolean {
        return this._settingsForAtw != null;
    }
    public getSettingsForAtw(): $Message$CommonProto$WarSettings$SettingsForAtw | null | undefined {
        return this._settingsForAtw;
    }
    public setSettingsForAtw(value: $Message$CommonProto$WarSettings$SettingsForAtw | null | undefined): void {
        this._settingsForAtw = value;
    }
    public createIfNotExistsSettingsForAtw(): $Message$CommonProto$WarSettings$SettingsForAtw {
        return this._settingsForAtw ??= new $Message$CommonProto$WarSettings$SettingsForAtw();
    }

    public checkHasSettingsForCaw(): boolean {
        return this._settingsForCaw != null;
    }
    public getSettingsForCaw(): $Message$CommonProto$WarSettings$SettingsForCaw | null | undefined {
        return this._settingsForCaw;
    }
    public setSettingsForCaw(value: $Message$CommonProto$WarSettings$SettingsForCaw | null | undefined): void {
        this._settingsForCaw = value;
    }
    public createIfNotExistsSettingsForCaw(): $Message$CommonProto$WarSettings$SettingsForCaw {
        return this._settingsForCaw ??= new $Message$CommonProto$WarSettings$SettingsForCaw();
    }
}
