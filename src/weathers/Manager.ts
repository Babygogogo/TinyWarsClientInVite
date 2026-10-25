import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../baseWar/interface/IBwWar.ts";
import { getBwWeatherManagerViewClass } from "../gameHelpers/GhFactory.ts";
import { getExisted, getDefined } from "../helpers/Misc.ts";
import { TextType } from "../lang/Constants.ts";
import { getWeatherName, getFormattedText, getWeatherFullDesc } from "../lang/Utils.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { WeatherCfg } from "../proto/schema/CommonProto/Config/WeatherCfg.ts";
import { SerialWeatherManager } from "../proto/schema/CommonProto/WarSerialization/SerialWeatherManager.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import type { IManager } from "./IManager.ts";
import type { IView } from "./IView.ts";

type IBwWar                 = BaseWarInterfaceIBwWar;

export class Manager implements IManager {
    private _forceWeatherType?      : number | null;
    private _expirePlayerIndex?     : number | null;
    private _expireTurnIndex?       : number | null;
    private _war?                   : IBwWar;

    private readonly _view = new (getBwWeatherManagerViewClass())();

    public init(data: Undefinable<SerialWeatherManager>): void {
        this.setForceWeatherType(data?.getForceWeatherType() ?? null);
        this.setExpireTurnIndex(data?.getExpireTurnIndex() ?? null);
        this.setExpirePlayerIndex(data?.getExpirePlayerIndex() ?? null);

        this.getView().init(this);
    }
    public fastInit(data: Undefinable<SerialWeatherManager>): void {
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
        return getExisted(this._war, ClientErrorCode.BwWeatherManager_GetWar_00);
    }

    public getView(): IView {
        return this._view;
    }

    public getDefaultWeatherType(): number {
        return this.getWar().getCommonSettingManager().getSettingsDefaultWeatherType();
    }
    public getCurrentWeatherType(): number {
        return this.getForceWeatherType() ?? this.getDefaultWeatherType();
    }
    public getCurrentWeatherCfg(): WeatherCfg {
        return getExisted(this.getWar().getGcData().getWeatherCfg(this.getCurrentWeatherType()));
    }

    public setForceWeatherType(type: number | null): void {
        if (this._forceWeatherType !== type) {
            this._forceWeatherType = type;
            dispatch(TypeId.BwForceWeatherTypeChanged);
        }
    }
    public getForceWeatherType(): number | null {
        return getDefined(this._forceWeatherType, ClientErrorCode.BwWeatherManager_GetForceWeatherType_00);
    }

    public setExpirePlayerIndex(playerIndex: number | null): void {
        this._expirePlayerIndex = playerIndex;
    }
    public getExpirePlayerIndex(): number | null {
        return getDefined(this._expirePlayerIndex, ClientErrorCode.BwWeatherManager_GetExpirePlayerIndex_00);
    }

    public setExpireTurnIndex(turnIndex: number | null): void {
        this._expireTurnIndex = turnIndex;
    }
    public getExpireTurnIndex(): number | null {
        return getDefined(this._expireTurnIndex, ClientErrorCode.BwWeatherManager_GetExpireTurnIndex_00);
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
        const currentWeatherName = getWeatherName(this.getCurrentWeatherType(), gameConfig);
        const defaultWeatherName = getWeatherName(this.getDefaultWeatherType(), gameConfig);
        if (expireTurnIndex == null) {
            return `${getFormattedText(TextType.F0073, currentWeatherName, defaultWeatherName)}`
                + `\n\n${getWeatherFullDesc(gameConfig)}`;
        } else {
            const turnManager   = war.getTurnManager();
            return `${getFormattedText(TextType.F0073, currentWeatherName, defaultWeatherName)}`
                + `\n${getFormattedText(TextType.F0074, expireTurnIndex, this.getExpirePlayerIndex(), turnManager.getTurnIndex(), turnManager.getPlayerIndexInTurn())}`
                + `\n\n${getWeatherFullDesc(gameConfig)}`;
        }
    }
}
