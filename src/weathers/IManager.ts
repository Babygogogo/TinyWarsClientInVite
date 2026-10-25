import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { WeatherCfg } from "../proto/schema/CommonProto/Config/WeatherCfg.ts";
import type {
    SerialWeatherManager as ProtoSchemaCommonProtoWarSerializationSerialWeatherManager,
} from "../proto/schema/CommonProto/WarSerialization/SerialWeatherManager.ts";
import type { IView } from "./IView.ts";

type SerialWeatherManager = ProtoSchemaCommonProtoWarSerializationSerialWeatherManager;

export interface IManager {
    init(data: Undefinable<SerialWeatherManager>): void;
    fastInit(data: Undefinable<SerialWeatherManager>): void;

    serialize(): SerialWeatherManager;
    serializeForCreateMfr(): SerialWeatherManager;
    serializeForCreateSfw(): SerialWeatherManager;

    startRunning(war: IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    getWar(): IBwWar;

    getView(): IView;

    getDefaultWeatherType(): number;
    getCurrentWeatherType(): number;
    getCurrentWeatherCfg(): WeatherCfg;

    setForceWeatherType(type: number | null): void;
    getForceWeatherType(): number | null;

    setExpirePlayerIndex(playerIndex: number | null): void;
    getExpirePlayerIndex(): number | null;

    setExpireTurnIndex(turnIndex: number | null): void;
    getExpireTurnIndex(): number | null;

    updateOnPlayerTurnSwitched(): void;

    getDesc(): string;
}
