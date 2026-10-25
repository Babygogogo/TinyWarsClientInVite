import type { IWar } from "./IWar.ts";
import { DefaultParams } from "../../bootTimers/Constants.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { MpwWar } from "../../multiPlayerWar/model/MpwWar.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForAtw } from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";

export class War extends MpwWar implements IWar {
    private _settingsForAtw?    : SettingsForAtw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForAtw(getExisted(data.getSettingsForAtw()));

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
        return this.getSettingsForAtw().getNormalMapId() ?? 0;
    }

    private _setSettingsForAtw(settings: SettingsForAtw): void {
        this._settingsForAtw = settings;
    }
    public getSettingsForAtw(): SettingsForAtw {
        return getExisted(this._settingsForAtw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForAtw().getBootTimerParams() ?? DefaultParams.concat();
    }
}
