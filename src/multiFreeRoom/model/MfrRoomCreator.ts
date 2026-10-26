import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { RoomCreatorBase } from "../../multiPlayerRooms/RoomCreatorBase.ts";
import { AliveStateId, PlayerIndex } from "../../players/Constants.ts";
import { C } from "../../proto/schema/CommonProto/NetMessage/MsgMfrCreateRoom/C.ts";
import type { C as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomC } from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/C.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { SettingsForMfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";

export type DataForJoinRoom = ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomC;

export class MfrRoomCreator extends RoomCreatorBase {
    private readonly _settingsForMfw = new SettingsForMfw();

    public constructor(gcData: GameConfig, warData: SerialWar) {
        super(gcData, getExisted(warData.getSettingsForCommon()));

        if (gcData.getVersion() !== this.getSettingsForCommon().getConfigVersion()) {
            throw newError(`MfrRoomCreator.constructor() the config version is not correct.`);
        }

        this.getSettingsForMfw().setInitialWarData(warData);

        const playerData = getExisted(warData.getPlayerManager()?.getPlayers().find(v => {
            return (v.getAliveState() !== AliveStateId.Dead)
                && (v.getPlayerIndex() !== PlayerIndex.Neutral)
                && (v.getUserId() != null);
        }));
        this.setSelfPlayerIndex(playerData.getPlayerIndex());
        this.setSelfCoId(playerData.getCoId());
        this.setSelfUnitAndTileSkinId(playerData.getUnitAndTileSkinId());
    }

    public generateData(): C {
        const settingsForMfw = this.getSettingsForMfw().clone();
        settingsForMfw.setWarName(this.getWarName());
        settingsForMfw.setWarPassword(this.getWarPassword());
        settingsForMfw.setWarComment(this.getWarComment());
        settingsForMfw.setBootTimerParams(this.getBootTimerParams());

        return C.fromJson({
            settingsForMfw         : settingsForMfw.toJson(),

            selfPlayerIndex        : this.getSelfPlayerIndex(),
            selfCoId               : this.getSelfCoId(),
            selfUnitAndTileSkinId  : this.getSelfUnitAndTileSkinId(),
        });
    }

    public getInitialWarData(): SerialWar {
        return getExisted(this.getSettingsForMfw().getInitialWarData());
    }
    private getSettingsForMfw(): SettingsForMfw {
        return this._settingsForMfw;
    }
}
