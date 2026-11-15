import {
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    Notifications_Dispatcher,
    Utils_ClientErrorCode,
    Weathers_View,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../internal.ts";

import type { WeatherCfg } from "../proto/schema/CommonProto/Config/WeatherCfg.ts";
import { SerialWeatherManager } from "../proto/schema/CommonProto/WarSerialization/SerialWeatherManager.ts";

export class Manager {
    private _forceWeatherType?      : number | null;
    private _expirePlayerIndex?     : number | null;
    private _expireTurnIndex?       : number | null;
    private _war                    : BaseWar_Model_War.War | undefined;

    private _view                   : Weathers_View.View | undefined;

    public constructor(isNeedView: boolean) {
        if (isNeedView) {
            this._view = new Weathers_View.View();
        }
    }

    public init(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWeatherManager>): void {
        this.setForceWeatherType(data?.getForceWeatherType() ?? null);
        this.setExpireTurnIndex(data?.getExpireTurnIndex() ?? null);
        this.setExpirePlayerIndex(data?.getExpirePlayerIndex() ?? null);

        this.getView()?.init(this);
    }
    public fastInit(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWeatherManager>): void {
        this.init(data);
    }

    public serialize(): SerialWeatherManager {
        return SerialWeatherManager.fromJson({
            forceWeatherType  : this.getForceWeatherType(),
            expireTurnIndex   : this.getExpireTurnIndex(),
            expirePlayerIndex : this.getExpirePlayerIndex(),
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public serializeForTeamIndexes(teamIndexes: Set<number>): SerialWeatherManager {
        return this.serialize();
    }
    public serializeForCreateMfr(): SerialWeatherManager {
        return this.serialize();
    }
    public serializeForCreateSfw(): SerialWeatherManager {
        return this.serialize();
    }

    public startRunning(war: BaseWar_Model_War.War): void {
        this._setWar(war);
    }
    public startRunningView(): void {
        this.getView()?.startRunningView();
    }
    public stopRunning(): void {
        this.getView()?.stopRunningView();
    }

    public getWar(): BaseWar_Model_War.War | undefined {
        return this._war;
    }
    private _setWar(war: BaseWar_Model_War.War): void {
        this._war = war;
    }

    public getView(): Weathers_View.View | undefined {
        return this._view;
    }

    public getDefaultWeatherType(): number | undefined {
        return this.getWar()?.getCommonSettingManager().getSettingsDefaultWeatherType();
    }
    public getCurrentWeatherType(): number | undefined {
        return this.getForceWeatherType() ?? this.getDefaultWeatherType();
    }
    public getCurrentWeatherCfg(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeatherCfg> {
        const currentWeatherType = this.getCurrentWeatherType();
        if (currentWeatherType == null) {
            return undefined;
        }

        return this.getWar()?.getGcData().getWeatherCfg(currentWeatherType);
    }

    public setForceWeatherType(type: number | null): void {
        if (this._forceWeatherType !== type) {
            this._forceWeatherType = type;

            if (this.getWar()?.getView() != null) {
                Notifications_Dispatcher.dispatch("BwForceWeatherTypeChanged");
            }
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

        const turnManager       = Helpers_Misc.getExisted(this.getWar()?.getTurnManager());
        const currentTurnIndex  = turnManager.getTurnIndex();
        if ((expireTurnIndex < currentTurnIndex)                                                                ||
            (expireTurnIndex === currentTurnIndex) && (expirePlayerIndex <= turnManager.getPlayerIndexInTurn())
        ) {
            this.setForceWeatherType(null);
            this.setExpireTurnIndex(null);
            this.setExpirePlayerIndex(null);
        }
    }

    public getDesc(): string | undefined {
        const war = this.getWar();
        if (war == null) {
            return undefined;
        }

        const currentWeatherType = this.getCurrentWeatherType();
        if (currentWeatherType == null) {
            return undefined;
        }

        const defaultWeatherType = this.getDefaultWeatherType();
        if (defaultWeatherType == null) {
            return undefined;
        }

        const gameConfig        = war.getGcData();
        const expireTurnIndex   = this.getExpireTurnIndex();
        const currentWeatherName = Lang_Utils.getWeatherName(currentWeatherType, gameConfig);
        const defaultWeatherName = Lang_Utils.getWeatherName(defaultWeatherType, gameConfig);
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
