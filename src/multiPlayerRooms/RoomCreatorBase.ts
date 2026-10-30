import {
    Cos_Constants,
    BootTimers_Constants,
    Notifications_Dispatcher,
    Helpers_Misc,
    Players_Constants,
    ForceSkins_Constants,
    Notifications_TypeId,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { InstanceWarRule } from "../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { SettingsForCommon } from "../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";

const REGULAR_TIME_LIMITS = [
    60 * 60 * 24 * 1,   // 1 day
    60 * 60 * 24 * 2,   // 2 days
    60 * 60 * 24 * 3,   // 3 days
    60 * 60 * 24 * 7,   // 7 days
];

export abstract class RoomCreatorBase {
    private readonly _gcData            : GameConfigs_GameConfig.GameConfig;
    private readonly _settingsForCommon : SettingsForCommon;

    private _selfCoId                   = Cos_Constants.CoId.Empty;
    private _selfPlayerIndex            = Players_Constants.PlayerIndex.First;
    private _selfUnitAndTileSkinId      = ForceSkins_Constants.SkinId.First;

    private _warName                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;
    private _warPassword                : AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;
    private _warComment                 : AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;

    private readonly _bootTimerParams   = BootTimers_Constants.DefaultParams.concat();

    public constructor(gcData: GameConfigs_GameConfig.GameConfig, settingsForCommon: SettingsForCommon) {
        this._gcData            = gcData;
        this._settingsForCommon = settingsForCommon;
    }

    public getGcData(): GameConfigs_GameConfig.GameConfig {
        return this._gcData;
    }
    public getSettingsForCommon(): SettingsForCommon {
        return this._settingsForCommon;
    }
    public getInstanceWarRule(): InstanceWarRule {
        return Helpers_Misc.getExisted(this.getSettingsForCommon().getInstanceWarRule());
    }

    public getSelfPlayerIndex(): number {
        return this._selfPlayerIndex;
    }
    public setSelfPlayerIndex(playerIndex: number): void {
        if (playerIndex !== this.getSelfPlayerIndex()) {
            this._selfPlayerIndex = playerIndex;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.RoomCreator_SelfPlayerIndexChanged);
        }
    }

    public getSelfCoId(): number {
        return this._selfCoId;
    }
    public setSelfCoId(coId: number): void {
        if (this.getSelfCoId() !== coId) {
            this._selfCoId = coId;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.RoomCreator_SelfCoIdChanged);
        }
    }

    public getSelfUnitAndTileSkinId(): number {
        return this._selfUnitAndTileSkinId;
    }
    public setSelfUnitAndTileSkinId(skinId: number): void {
        if (skinId !== this.getSelfUnitAndTileSkinId()) {
            this._selfUnitAndTileSkinId = skinId;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.RoomCreator_SelfSkinIdChanged);
        }
    }

    public getWarName(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<string> {
        return this._warName;
    }
    public setWarName(name: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): void {
        this._warName = name;
    }

    public getWarPassword(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<string> {
        return this._warPassword;
    }
    public setWarPassword(password: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): void {
        this._warPassword = password;
    }

    public getWarComment(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<string> {
        return this._warComment;
    }
    public setWarComment(comment: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): void {
        this._warComment = comment;
    }

    public setBootTimerParams(newParams: number[]): void {
        const arr = this.getBootTimerParams();
        arr.splice(0, arr.length, ...newParams);
    }
    public getBootTimerParams(): number[] {
        return this._bootTimerParams;
    }
    public tickBootTimerType(): void {
        const params = this.getBootTimerParams();
        if ((params) && (params[0] === BootTimers_Constants.TimerTypeId.Regular)) {
            this.setBootTimerParams(BootTimers_Constants.Incremental.DefaultParams.concat());
        } else {
            this.setBootTimerParams(BootTimers_Constants.DefaultParams.concat());
        }
    }
    public tickTimerRegularTime(): void {
        const params = this.getBootTimerParams();
        if (params[0] !== BootTimers_Constants.TimerTypeId.Regular) {
            this.tickBootTimerType();
        } else {
            const index = REGULAR_TIME_LIMITS.indexOf(params[1]);
            if (index < 0) {
                this.tickBootTimerType();
            } else {
                const newIndex  = index + 1;
                params[1]       = newIndex < REGULAR_TIME_LIMITS.length ? REGULAR_TIME_LIMITS[newIndex] : REGULAR_TIME_LIMITS[0];
            }
        }
    }
}
