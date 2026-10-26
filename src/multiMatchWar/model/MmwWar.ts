import { DefaultParams } from "../../bootTimers/Constants.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import type { IMmwWar } from "../interface/IMmwWar.ts";
import { MpwWar } from "../../multiPlayerWar/model/MpwWar.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForMmw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class MmwWar extends MpwWar implements IMmwWar {
    private _settingsForMmw?    : SettingsForMmw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForMmw(getExisted(data.getSettingsForMmw(), ClientErrorCode.MmwWar_Init_00));

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
        return this.getSettingsForMmw().getNormalMapId() ?? 0;
    }

    private _setSettingsForMmw(settings: SettingsForMmw): void {
        this._settingsForMmw = settings;
    }
    public getSettingsForMmw(): SettingsForMmw {
        return getExisted(this._settingsForMmw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForMmw().getBootTimerParams() ?? DefaultParams.concat();
    }
}
