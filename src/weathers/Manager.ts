import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoConfigWeatherCfg from "../proto/schema/CommonProto/Config/WeatherCfg.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWeatherManager from "../proto/schema/CommonProto/WarSerialization/SerialWeatherManager.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import type * as WeathersIManager from "./IManager.ts";
import type * as WeathersIView from "./IView.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export class Manager implements WeathersIManager.IManager {
    private _forceWeatherType?      : number | null;
    private _expirePlayerIndex?     : number | null;
    private _expireTurnIndex?       : number | null;
    private _war?                   : IBwWar;

    private readonly _view = new (GameHelpersGhFactory.getBwWeatherManagerViewClass())();

    public init(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWeatherManager.SerialWeatherManager>): void {
        this.setForceWeatherType(data?.getForceWeatherType() ?? null);
        this.setExpireTurnIndex(data?.getExpireTurnIndex() ?? null);
        this.setExpirePlayerIndex(data?.getExpirePlayerIndex() ?? null);

        this.getView().init(this);
    }
    public fastInit(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWeatherManager.SerialWeatherManager>): void {
        this.init(data);
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialWeatherManager.SerialWeatherManager {
        return ProtoSchemaCommonProtoWarSerializationSerialWeatherManager.SerialWeatherManager.fromJson({
            forceWeatherType    : this.getForceWeatherType(),
            expireTurnIndex     : this.getExpireTurnIndex(),
            expirePlayerIndex   : this.getExpirePlayerIndex(),
        });
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialWeatherManager.SerialWeatherManager {
        return this.serialize();
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialWeatherManager.SerialWeatherManager {
        return this.serialize();
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        this.getView().stopRunningView();
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return HelpersMisc.getExisted(this._war, UtilsClientErrorCode.ClientErrorCode.BwWeatherManager_GetWar_00);
    }

    public getView(): WeathersIView.IView {
        return this._view;
    }

    public getDefaultWeatherType(): number {
        return this.getWar().getCommonSettingManager().getSettingsDefaultWeatherType();
    }
    public getCurrentWeatherType(): number {
        return this.getForceWeatherType() ?? this.getDefaultWeatherType();
    }
    public getCurrentWeatherCfg(): ProtoSchemaCommonProtoConfigWeatherCfg.WeatherCfg {
        return HelpersMisc.getExisted(this.getWar().getGcData().getWeatherCfg(this.getCurrentWeatherType()));
    }

    public setForceWeatherType(type: number | null): void {
        if (this._forceWeatherType !== type) {
            this._forceWeatherType = type;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwForceWeatherTypeChanged);
        }
    }
    public getForceWeatherType(): number | null {
        return HelpersMisc.getDefined(this._forceWeatherType, UtilsClientErrorCode.ClientErrorCode.BwWeatherManager_GetForceWeatherType_00);
    }

    public setExpirePlayerIndex(playerIndex: number | null): void {
        this._expirePlayerIndex = playerIndex;
    }
    public getExpirePlayerIndex(): number | null {
        return HelpersMisc.getDefined(this._expirePlayerIndex, UtilsClientErrorCode.ClientErrorCode.BwWeatherManager_GetExpirePlayerIndex_00);
    }

    public setExpireTurnIndex(turnIndex: number | null): void {
        this._expireTurnIndex = turnIndex;
    }
    public getExpireTurnIndex(): number | null {
        return HelpersMisc.getDefined(this._expireTurnIndex, UtilsClientErrorCode.ClientErrorCode.BwWeatherManager_GetExpireTurnIndex_00);
    }

    public updateOnPlayerTurnSwitched(): void {
        const expireTurnIndex   = this.getExpireTurnIndex();
        const expirePlayerIndex = this.getExpirePlayerIndex();
        if ((expireTurnIndex == null) || (expirePlayerIndex == null)) {
            return;
        }

        const turnManager       = this.getWar().getTurnManager();
        const currentTurnIndex  = turnManager.getTurnIndex();
        if ((expireTurnIndex < currentTurnIndex)                                                                ||
            (expireTurnIndex === currentTurnIndex) && (expirePlayerIndex <= turnManager.getPlayerIndexInTurn())
        ) {
            this.setForceWeatherType(null);
            this.setExpireTurnIndex(null);
            this.setExpirePlayerIndex(null);
        }
    }

    public getDesc(): string {
        const war               = this.getWar();
        const gameConfig        = war.getGcData();
        const expireTurnIndex   = this.getExpireTurnIndex();
        const currentWeatherName = LangUtils.getWeatherName(this.getCurrentWeatherType(), gameConfig);
        const defaultWeatherName = LangUtils.getWeatherName(this.getDefaultWeatherType(), gameConfig);
        if (expireTurnIndex == null) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0073, currentWeatherName, defaultWeatherName)}`
                + `\n\n${LangUtils.getWeatherFullDesc(gameConfig)}`;
        } else {
            const turnManager   = war.getTurnManager();
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0073, currentWeatherName, defaultWeatherName)}`
                + `\n${LangUtils.getFormattedText(LangConstants.TextType.F0074, expireTurnIndex, this.getExpirePlayerIndex(), turnManager.getTurnIndex(), turnManager.getPlayerIndexInTurn())}`
                + `\n\n${LangUtils.getWeatherFullDesc(gameConfig)}`;
        }
    }
}
