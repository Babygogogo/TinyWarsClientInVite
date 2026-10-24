import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiPlayerRoomsRoomCreatorBase from "../../multiPlayerRooms/RoomCreatorBase.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgMfrCreateRoomC from "../../proto/schema/CommonProto/NetMessage/MsgMfrCreateRoom/C.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomC from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/C.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForMfw from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";

type GcData                 = GameConfigGcData.GcData;
type SerialWar              = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;

export type DataForJoinRoom = ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomC.C;

export class MfrRoomCreator extends MultiPlayerRoomsRoomCreatorBase.RoomCreatorBase {
    private readonly _settingsForMfw = new ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw();

    public constructor(gcData: GcData, warData: SerialWar) {
        super(gcData, HelpersMisc.getExisted(warData.getSettingsForCommon()));

        if (gcData.getVersion() !== this.getSettingsForCommon().getConfigVersion()) {
            throw HelpersMisc.newError(`MfrRoomCreator.constructor() the config version is not correct.`);
        }

        this.getSettingsForMfw().setInitialWarData(warData);

        const playerData = HelpersMisc.getExisted(warData.getPlayerManager()?.getPlayers().find(v => {
            return (v.getAliveState() !== PlayersConstants.AliveStateId.Dead)
                && (v.getPlayerIndex() !== PlayersConstants.PlayerIndex.Neutral)
                && (v.getUserId() != null);
        }));
        this.setSelfPlayerIndex(playerData.getPlayerIndex());
        this.setSelfCoId(playerData.getCoId());
        this.setSelfUnitAndTileSkinId(playerData.getUnitAndTileSkinId());
    }

    public generateData(): ProtoSchemaCommonProtoNetMessageMsgMfrCreateRoomC.C {
        const settingsForMfw = this.getSettingsForMfw().clone();
        settingsForMfw.setWarName(this.getWarName());
        settingsForMfw.setWarPassword(this.getWarPassword());
        settingsForMfw.setWarComment(this.getWarComment());
        settingsForMfw.setBootTimerParams(this.getBootTimerParams());

        return ProtoSchemaCommonProtoNetMessageMsgMfrCreateRoomC.C.fromJson({
            settingsForMfw         : settingsForMfw.toJson(),

            selfPlayerIndex        : this.getSelfPlayerIndex(),
            selfCoId               : this.getSelfCoId(),
            selfUnitAndTileSkinId  : this.getSelfUnitAndTileSkinId(),
        });
    }

    public getInitialWarData(): SerialWar {
        return HelpersMisc.getExisted(this.getSettingsForMfw().getInitialWarData());
    }
    private getSettingsForMfw(): ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw {
        return this._settingsForMfw;
    }
}
