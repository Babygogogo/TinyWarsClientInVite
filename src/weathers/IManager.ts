import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as ProtoSchemaCommonProtoConfigWeatherCfg from "../proto/schema/CommonProto/Config/WeatherCfg.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWeatherManager from "../proto/schema/CommonProto/WarSerialization/SerialWeatherManager.ts";
import type * as WeathersIView from "./IView.ts";

type SerialWeatherManager = ProtoSchemaCommonProtoWarSerializationSerialWeatherManager.SerialWeatherManager;

export interface IManager {
    init(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialWeatherManager>): void;
    fastInit(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialWeatherManager>): void;

    serialize(): SerialWeatherManager;
    serializeForCreateMfr(): SerialWeatherManager;
    serializeForCreateSfw(): SerialWeatherManager;

    startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    getWar(): BaseWarInterfaceIBwWar.IBwWar;

    getView(): WeathersIView.IView;

    getDefaultWeatherType(): number;
    getCurrentWeatherType(): number;
    getCurrentWeatherCfg(): ProtoSchemaCommonProtoConfigWeatherCfg.WeatherCfg;

    setForceWeatherType(type: number | null): void;
    getForceWeatherType(): number | null;

    setExpirePlayerIndex(playerIndex: number | null): void;
    getExpirePlayerIndex(): number | null;

    setExpireTurnIndex(turnIndex: number | null): void;
    getExpireTurnIndex(): number | null;

    updateOnPlayerTurnSwitched(): void;

    getDesc(): string;
}
