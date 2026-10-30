import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import {
    DefaultParams,
    TimerTypeId,
    Incremental,
} from "../bootTimers/Constants.ts";
import { CoId } from "../cos/Constants.ts";
import { SkinId } from "../forceSkins/Constants.ts";
import type { GameConfig } from "../gameConfigs/GameConfig.ts";
import { getExisted } from "../helpers/Misc.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { PlayerIndex } from "../players/Constants.ts";
import type { InstanceWarRule } from "../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { SettingsForCommon } from "../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";

const REGULAR_TIME_LIMITS = [
    60 * 60 * 24 * 1,   // 1 day
    60 * 60 * 24 * 2,   // 2 days
    60 * 60 * 24 * 3,   // 3 days
    60 * 60 * 24 * 7,   // 7 days
];

export abstract class RoomCreatorBase {
    private readonly _gcData            : GameConfig;
    private readonly _settingsForCommon : SettingsForCommon;

    private _selfCoId                   = CoId.Empty;
    private _selfPlayerIndex            = PlayerIndex.First;
    private _selfUnitAndTileSkinId      = SkinId.First;

    private _warName                    : Undefinable<string>;
    private _warPassword                : Undefinable<string>;
    private _warComment                 : Undefinable<string>;

    private readonly _bootTimerParams   = DefaultParams.concat();

    public constructor(gcData: GameConfig, settingsForCommon: SettingsForCommon) {
        this._gcData            = gcData;
        this._settingsForCommon = settingsForCommon;
    }

    public getGcData(): GameConfig {
        return this._gcData;
    }
    public getSettingsForCommon(): SettingsForCommon {
        return this._settingsForCommon;
    }
    public getInstanceWarRule(): InstanceWarRule {
        return getExisted(this.getSettingsForCommon().getInstanceWarRule());
    }

    public getSelfPlayerIndex(): number {
        return this._selfPlayerIndex;
    }
    public setSelfPlayerIndex(playerIndex: number): void {
        if (playerIndex !== this.getSelfPlayerIndex()) {
            this._selfPlayerIndex = playerIndex;
            dispatch(TypeId.RoomCreator_SelfPlayerIndexChanged);
        }
    }

    public getSelfCoId(): number {
        return this._selfCoId;
    }
    public setSelfCoId(coId: number): void {
        if (this.getSelfCoId() !== coId) {
            this._selfCoId = coId;
            dispatch(TypeId.RoomCreator_SelfCoIdChanged);
        }
    }

    public getSelfUnitAndTileSkinId(): number {
        return this._selfUnitAndTileSkinId;
    }
    public setSelfUnitAndTileSkinId(skinId: number): void {
        if (skinId !== this.getSelfUnitAndTileSkinId()) {
            this._selfUnitAndTileSkinId = skinId;
            dispatch(TypeId.RoomCreator_SelfSkinIdChanged);
        }
    }

    public getWarName(): Undefinable<string> {
        return this._warName;
    }
    public setWarName(name: Undefinable<string>): void {
        this._warName = name;
    }

    public getWarPassword(): Undefinable<string> {
        return this._warPassword;
    }
    public setWarPassword(password: Undefinable<string>): void {
        this._warPassword = password;
    }

    public getWarComment(): Undefinable<string> {
        return this._warComment;
    }
    public setWarComment(comment: Undefinable<string>): void {
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
        if ((params) && (params[0] === TimerTypeId.Regular)) {
            this.setBootTimerParams(Incremental.DefaultParams.concat());
        } else {
            this.setBootTimerParams(DefaultParams.concat());
        }
    }
    public tickTimerRegularTime(): void {
        const params = this.getBootTimerParams();
        if (params[0] !== TimerTypeId.Regular) {
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
