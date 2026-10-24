import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as BootTimersConstants from "../bootTimers/Constants.ts";
import * as CosConstants from "../cos/Constants.ts";
import * as ForceSkinsConstants from "../forceSkins/Constants.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import * as PlayersConstants from "../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForCommon from "../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type GcData             = GameConfigGcData.GcData;

const REGULAR_TIME_LIMITS = [
    60 * 60 * 24 * 1,   // 1 day
    60 * 60 * 24 * 2,   // 2 days
    60 * 60 * 24 * 3,   // 3 days
    60 * 60 * 24 * 7,   // 7 days
];

export abstract class RoomCreatorBase {
    private readonly _gcData            : GcData;
    private readonly _settingsForCommon : ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon;

    private _selfCoId                   = CosConstants.CoId.Empty;
    private _selfPlayerIndex            = PlayersConstants.PlayerIndex.First;
    private _selfUnitAndTileSkinId      = ForceSkinsConstants.SkinId.First;

    private _warName                    : Undefinable<string>;
    private _warPassword                : Undefinable<string>;
    private _warComment                 : Undefinable<string>;

    private readonly _bootTimerParams   = BootTimersConstants.DefaultParams.concat();

    public constructor(gcData: GcData, settingsForCommon: ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon) {
        this._gcData            = gcData;
        this._settingsForCommon = settingsForCommon;
    }

    public getGcData(): GcData {
        return this._gcData;
    }
    public getSettingsForCommon(): ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon {
        return this._settingsForCommon;
    }
    public getInstanceWarRule(): ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule {
        return HelpersMisc.getExisted(this.getSettingsForCommon().getInstanceWarRule());
    }

    public getSelfPlayerIndex(): number {
        return this._selfPlayerIndex;
    }
    public setSelfPlayerIndex(playerIndex: number): void {
        if (playerIndex !== this.getSelfPlayerIndex()) {
            this._selfPlayerIndex = playerIndex;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.RoomCreator_SelfPlayerIndexChanged);
        }
    }

    public getSelfCoId(): number {
        return this._selfCoId;
    }
    public setSelfCoId(coId: number): void {
        if (this.getSelfCoId() !== coId) {
            this._selfCoId = coId;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.RoomCreator_SelfCoIdChanged);
        }
    }

    public getSelfUnitAndTileSkinId(): number {
        return this._selfUnitAndTileSkinId;
    }
    public setSelfUnitAndTileSkinId(skinId: number): void {
        if (skinId !== this.getSelfUnitAndTileSkinId()) {
            this._selfUnitAndTileSkinId = skinId;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.RoomCreator_SelfSkinIdChanged);
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
        if ((params) && (params[0] === BootTimersConstants.TimerTypeId.Regular)) {
            this.setBootTimerParams(BootTimersConstants.Incremental.DefaultParams.concat());
        } else {
            this.setBootTimerParams(BootTimersConstants.DefaultParams.concat());
        }
    }
    public tickTimerRegularTime(): void {
        const params = this.getBootTimerParams();
        if (params[0] !== BootTimersConstants.TimerTypeId.Regular) {
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
