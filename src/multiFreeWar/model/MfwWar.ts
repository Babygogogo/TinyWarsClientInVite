import type { GcData as GameConfigGcData } from "../../gameConfig/GcData.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import type { IMfwWar } from "../interface/IMfwWar.ts";
import { MpwWar } from "../../multiPlayerWar/model/MpwWar.ts";
import type {
    SerialWar as ProtoSchemaCommonProtoWarSerializationSerialWar,
} from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type {
    SettingsForMfw as ProtoSchemaCommonProtoWarSettingsSettingsForMfw,
} from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar;
type SettingsForMfw     = ProtoSchemaCommonProtoWarSettingsSettingsForMfw;
type GcData             = GameConfigGcData;

export class MfwWar extends MpwWar implements IMfwWar {
    private _settingsForMfw?    : SettingsForMfw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForMfw(getExisted(data.getSettingsForMfw(), ClientErrorCode.MfwWar_Init_00));

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
    public getNormalMapId(): number | null {
        return null;
    }

    private _setSettingsForMfw(settings: SettingsForMfw): void {
        this._settingsForMfw = settings;
    }
    public getSettingsForMfw(): SettingsForMfw {
        return getExisted(this._settingsForMfw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWarName(): string | null {
        return this.getSettingsForMfw().getWarName() ?? null;
    }
    public getWarPassword(): string | null {
        return this.getSettingsForMfw().getWarPassword() ?? null;
    }
    public getWarComment(): string | null {
        return this.getSettingsForMfw().getWarComment() ?? null;
    }

    public getSettingsBootTimerParams(): number[] {
        return getExisted(this.getSettingsForMfw().getBootTimerParams());
    }
}
