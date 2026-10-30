import {
    type BaseWar_Interface_IBwWar,
    type Weathers_IView,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { WeatherCfg } from "../proto/schema/CommonProto/Config/WeatherCfg.ts";
import type { SerialWeatherManager } from "../proto/schema/CommonProto/WarSerialization/SerialWeatherManager.ts";

export interface IManager {
    init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWeatherManager>): void;
    fastInit(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWeatherManager>): void;

    serialize(): SerialWeatherManager;
    serializeForCreateMfr(): SerialWeatherManager;
    serializeForCreateSfw(): SerialWeatherManager;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    getWar(): BaseWar_Interface_IBwWar.IBwWar;

    getView(): Weathers_IView.IView;

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
