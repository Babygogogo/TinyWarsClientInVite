import type { GcData as GameConfigGcData } from "../../gameConfig/GcData.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { MpwWar } from "../../multiPlayerWar/model/MpwWar.ts";
import type {
    SerialWar as ProtoSchemaCommonProtoWarSerializationSerialWar,
} from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type {
    SettingsForMcw as ProtoSchemaCommonProtoWarSettingsSettingsForMcw,
} from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar;
type SettingsForMcw     = ProtoSchemaCommonProtoWarSettingsSettingsForMcw;
type GcData             = GameConfigGcData;

export class McwWar extends MpwWar {
    private _settingsForMcw?: SettingsForMcw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForMcw(getExisted(data.getSettingsForMcw(), ClientErrorCode.McwWar_Init_00));

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
        return this.getSettingsForMcw().getNormalMapId() ?? 0;
    }

    private _setSettingsForMcw(settings: SettingsForMcw): void {
        this._settingsForMcw = settings;
    }
    public getSettingsForMcw(): SettingsForMcw {
        return getExisted(this._settingsForMcw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWarName(): string | null {
        return this.getSettingsForMcw().getWarName() ?? null;
    }
    public getWarPassword(): string | null {
        return this.getSettingsForMcw().getWarPassword() ?? null;
    }
    public getWarComment(): string | null {
        return this.getSettingsForMcw().getWarComment() ?? null;
    }

    public getSettingsBootTimerParams(): number[] {
        return getExisted(this.getSettingsForMcw().getBootTimerParams());
    }
}
