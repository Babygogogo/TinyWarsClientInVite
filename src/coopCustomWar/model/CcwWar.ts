import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { MpwWar } from "../../multiPlayerWar/model/MpwWar.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForCcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class CcwWar extends MpwWar {
    private _settingsForCcw?: SettingsForCcw;

    public init(data: SerialWar, gameConfig: GameConfig): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForCcw(getExisted(data.getSettingsForCcw(), ClientErrorCode.CcwWar_Init_00));

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
        return this.getSettingsForCcw().getNormalMapId();
    }

    private _setSettingsForCcw(settings: SettingsForCcw): void {
        this._settingsForCcw = settings;
    }
    public getSettingsForCcw(): SettingsForCcw {
        return getExisted(this._settingsForCcw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWarName(): string | null {
        return this.getSettingsForCcw().getWarName() ?? null;
    }
    public getWarPassword(): string | null {
        return this.getSettingsForCcw().getWarPassword() ?? null;
    }
    public getWarComment(): string | null {
        return this.getSettingsForCcw().getWarComment() ?? null;
    }

    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForCcw().getBootTimerParams();
    }
}
