import {
    Weathers_View,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Utils_ClientErrorCode,
    Notifications_Dispatcher,
    Helpers_Misc,
    Lang_Utils,
    Lang_Constants,
    Notifications_TypeId,
    type Weathers_IManager,
    type Weathers_IView,
} from "../internal.ts";

import type { WeatherCfg } from "../proto/schema/CommonProto/Config/WeatherCfg.ts";
import { SerialWeatherManager } from "../proto/schema/CommonProto/WarSerialization/SerialWeatherManager.ts";

export class Manager implements Weathers_IManager.IManager {
    private _forceWeatherType?      : number | null;
    private _expirePlayerIndex?     : number | null;
    private _expireTurnIndex?       : number | null;
    private _war?                   : BaseWar_Interface_IBwWar.IBwWar;

    private readonly _view = new Weathers_View.View();

    public init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWeatherManager>): void {
        this.setForceWeatherType(data?.getForceWeatherType() ?? null);
        this.setExpireTurnIndex(data?.getExpireTurnIndex() ?? null);
        this.setExpirePlayerIndex(data?.getExpirePlayerIndex() ?? null);

        this.getView().init(this);
    }
    public fastInit(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWeatherManager>): void {
        this.init(data);
    }

    public serialize(): SerialWeatherManager {
        return SerialWeatherManager.fromJson({
            forceWeatherType    : this.getForceWeatherType(),
            expireTurnIndex     : this.getExpireTurnIndex(),
            expirePlayerIndex   : this.getExpirePlayerIndex(),
        });
    }
    public serializeForCreateMfr(): SerialWeatherManager {
        return this.serialize();
    }
    public serializeForCreateSfw(): SerialWeatherManager {
        return this.serialize();
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._setWar(war);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        this.getView().stopRunningView();
    }

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    public getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war, Utils_ClientErrorCode.ClientErrorCode.BwWeatherManager_GetWar_00);
    }

    public getView(): Weathers_IView.IView {
        return this._view;
    }

    public getDefaultWeatherType(): number {
        return this.getWar().getCommonSettingManager().getSettingsDefaultWeatherType();
    }
    public getCurrentWeatherType(): number {
        return this.getForceWeatherType() ?? this.getDefaultWeatherType();
    }
    public getCurrentWeatherCfg(): WeatherCfg {
        return Helpers_Misc.getExisted(this.getWar().getGcData().getWeatherCfg(this.getCurrentWeatherType()));
    }

    public setForceWeatherType(type: number | null): void {
        if (this._forceWeatherType !== type) {
            this._forceWeatherType = type;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwForceWeatherTypeChanged);
        }
    }
    public getForceWeatherType(): number | null {
        return Helpers_Misc.getDefined(this._forceWeatherType, Utils_ClientErrorCode.ClientErrorCode.BwWeatherManager_GetForceWeatherType_00);
    }

    public setExpirePlayerIndex(playerIndex: number | null): void {
        this._expirePlayerIndex = playerIndex;
    }
    public getExpirePlayerIndex(): number | null {
        return Helpers_Misc.getDefined(this._expirePlayerIndex, Utils_ClientErrorCode.ClientErrorCode.BwWeatherManager_GetExpirePlayerIndex_00);
    }

    public setExpireTurnIndex(turnIndex: number | null): void {
        this._expireTurnIndex = turnIndex;
    }
    public getExpireTurnIndex(): number | null {
        return Helpers_Misc.getDefined(this._expireTurnIndex, Utils_ClientErrorCode.ClientErrorCode.BwWeatherManager_GetExpireTurnIndex_00);
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
        const currentWeatherName = Lang_Utils.getWeatherName(this.getCurrentWeatherType(), gameConfig);
        const defaultWeatherName = Lang_Utils.getWeatherName(this.getDefaultWeatherType(), gameConfig);
        if (expireTurnIndex == null) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0073, currentWeatherName, defaultWeatherName)}`
                + `\n\n${Lang_Utils.getWeatherFullDesc(gameConfig)}`;
        } else {
            const turnManager   = war.getTurnManager();
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0073, currentWeatherName, defaultWeatherName)}`
                + `\n${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0074, expireTurnIndex, this.getExpirePlayerIndex(), turnManager.getTurnIndex(), turnManager.getPlayerIndexInTurn())}`
                + `\n\n${Lang_Utils.getWeatherFullDesc(gameConfig)}`;
        }
    }
}
