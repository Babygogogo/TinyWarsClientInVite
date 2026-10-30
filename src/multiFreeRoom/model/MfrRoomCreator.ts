import {
    Players_Constants,
    Helpers_Misc,
    MultiPlayerRooms_RoomCreatorBase,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import { C as MfrCreateRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMfrCreateRoom/C.ts";
import type { C as MfrJoinRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/C.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { SettingsForMfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";

export type DataForJoinRoom = MfrJoinRoomRequest;

export class MfrRoomCreator extends MultiPlayerRooms_RoomCreatorBase.RoomCreatorBase {
    private readonly _settingsForMfw = new SettingsForMfw();

    public constructor(gcData: GameConfigs_GameConfig.GameConfig, warData: SerialWar) {
        super(gcData, Helpers_Misc.getExisted(warData.getSettingsForCommon()));

        if (gcData.getVersion() !== this.getSettingsForCommon().getConfigVersion()) {
            throw Helpers_Misc.newError(`MfrRoomCreator.constructor() the config version is not correct.`);
        }

        this.getSettingsForMfw().setInitialWarData(warData);

        const playerData = Helpers_Misc.getExisted(warData.getPlayerManager()?.getPlayers().find(v => {
            return (v.getAliveState() !== Players_Constants.AliveStateId.Dead)
                && (v.getPlayerIndex() !== Players_Constants.PlayerIndex.Neutral)
                && (v.getUserId() != null);
        }));
        this.setSelfPlayerIndex(playerData.getPlayerIndex());
        this.setSelfCoId(playerData.getCoId());
        this.setSelfUnitAndTileSkinId(playerData.getUnitAndTileSkinId());
    }

    public generateData(): MfrCreateRoomRequest {
        const settingsForMfw = this.getSettingsForMfw().clone();
        settingsForMfw.setWarName(this.getWarName());
        settingsForMfw.setWarPassword(this.getWarPassword());
        settingsForMfw.setWarComment(this.getWarComment());
        settingsForMfw.setBootTimerParams(this.getBootTimerParams());

        return MfrCreateRoomRequest.fromJson({
            settingsForMfw         : settingsForMfw.toJson(),

            selfPlayerIndex        : this.getSelfPlayerIndex(),
            selfCoId               : this.getSelfCoId(),
            selfUnitAndTileSkinId  : this.getSelfUnitAndTileSkinId(),
        });
    }

    public getInitialWarData(): SerialWar {
        return Helpers_Misc.getExisted(this.getSettingsForMfw().getInitialWarData());
    }
    private getSettingsForMfw(): SettingsForMfw {
        return this._settingsForMfw;
    }
}
