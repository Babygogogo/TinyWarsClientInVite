import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { MpwWar } from "../../multiPlayerWar/model/MpwWar.ts";
import type { IMrwWar } from "../interface/IMrwWar.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForMrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class MrwWar extends MpwWar implements IMrwWar {
    private _settingsForMrw?    : SettingsForMrw;

    public init(data: SerialWar, gameConfig: GameConfig): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForMrw(getExisted(data.getSettingsForMrw(), ClientErrorCode.MrwWar_Init_00));

        this._initView();
    }

    public getCanCheat(): boolean {
        return false;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return false;
    }

    public getIsNeedExecutedOperations(): boolean {
        return false;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }
    public getNormalMapId(): number {
        return this.getSettingsForMrw().getNormalMapId();
    }

    private _setSettingsForMrw(settings: SettingsForMrw): void {
        this._settingsForMrw = settings;
    }
    public getSettingsForMrw(): SettingsForMrw {
        return getExisted(this._settingsForMrw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForMrw().getBootTimerParams();
    }
}
