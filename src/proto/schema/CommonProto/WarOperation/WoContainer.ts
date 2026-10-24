import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { WoPlayerDeleteUnit as $Message$CommonProto$WarOperation$WoPlayerDeleteUnit, type WoPlayerDeleteUnitJson as $Json$CommonProto$WarOperation$WoPlayerDeleteUnit } from "./WoPlayerDeleteUnit.js";
import { WoPlayerEndTurn as $Message$CommonProto$WarOperation$WoPlayerEndTurn, type WoPlayerEndTurnJson as $Json$CommonProto$WarOperation$WoPlayerEndTurn } from "./WoPlayerEndTurn.js";
import { WoPlayerProduceUnit as $Message$CommonProto$WarOperation$WoPlayerProduceUnit, type WoPlayerProduceUnitJson as $Json$CommonProto$WarOperation$WoPlayerProduceUnit } from "./WoPlayerProduceUnit.js";
import { WoPlayerSurrender as $Message$CommonProto$WarOperation$WoPlayerSurrender, type WoPlayerSurrenderJson as $Json$CommonProto$WarOperation$WoPlayerSurrender } from "./WoPlayerSurrender.js";
import { WoPlayerUseCoSkill as $Message$CommonProto$WarOperation$WoPlayerUseCoSkill, type WoPlayerUseCoSkillJson as $Json$CommonProto$WarOperation$WoPlayerUseCoSkill } from "./WoPlayerUseCoSkill.js";
import { WoPlayerVoteForDraw as $Message$CommonProto$WarOperation$WoPlayerVoteForDraw, type WoPlayerVoteForDrawJson as $Json$CommonProto$WarOperation$WoPlayerVoteForDraw } from "./WoPlayerVoteForDraw.js";
import { WoSystemBeginTurn as $Message$CommonProto$WarOperation$WoSystemBeginTurn, type WoSystemBeginTurnJson as $Json$CommonProto$WarOperation$WoSystemBeginTurn } from "./WoSystemBeginTurn.js";
import { WoSystemCallWarEvent as $Message$CommonProto$WarOperation$WoSystemCallWarEvent, type WoSystemCallWarEventJson as $Json$CommonProto$WarOperation$WoSystemCallWarEvent } from "./WoSystemCallWarEvent.js";
import { WoSystemDestroyPlayerForce as $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce, type WoSystemDestroyPlayerForceJson as $Json$CommonProto$WarOperation$WoSystemDestroyPlayerForce } from "./WoSystemDestroyPlayerForce.js";
import { WoSystemEndTurn as $Message$CommonProto$WarOperation$WoSystemEndTurn, type WoSystemEndTurnJson as $Json$CommonProto$WarOperation$WoSystemEndTurn } from "./WoSystemEndTurn.js";
import { WoSystemEndWar as $Message$CommonProto$WarOperation$WoSystemEndWar, type WoSystemEndWarJson as $Json$CommonProto$WarOperation$WoSystemEndWar } from "./WoSystemEndWar.js";
import { WoSystemHandleBootPlayer as $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer, type WoSystemHandleBootPlayerJson as $Json$CommonProto$WarOperation$WoSystemHandleBootPlayer } from "./WoSystemHandleBootPlayer.js";
import { WoSystemVoteForDraw as $Message$CommonProto$WarOperation$WoSystemVoteForDraw, type WoSystemVoteForDrawJson as $Json$CommonProto$WarOperation$WoSystemVoteForDraw } from "./WoSystemVoteForDraw.js";
import { WoUnitAttackTile as $Message$CommonProto$WarOperation$WoUnitAttackTile, type WoUnitAttackTileJson as $Json$CommonProto$WarOperation$WoUnitAttackTile } from "./WoUnitAttackTile.js";
import { WoUnitAttackUnit as $Message$CommonProto$WarOperation$WoUnitAttackUnit, type WoUnitAttackUnitJson as $Json$CommonProto$WarOperation$WoUnitAttackUnit } from "./WoUnitAttackUnit.js";
import { WoUnitBeLoaded as $Message$CommonProto$WarOperation$WoUnitBeLoaded, type WoUnitBeLoadedJson as $Json$CommonProto$WarOperation$WoUnitBeLoaded } from "./WoUnitBeLoaded.js";
import { WoUnitBoardedByCo as $Message$CommonProto$WarOperation$WoUnitBoardedByCo, type WoUnitBoardedByCoJson as $Json$CommonProto$WarOperation$WoUnitBoardedByCo } from "./WoUnitBoardedByCo.js";
import { WoUnitBuildTile as $Message$CommonProto$WarOperation$WoUnitBuildTile, type WoUnitBuildTileJson as $Json$CommonProto$WarOperation$WoUnitBuildTile } from "./WoUnitBuildTile.js";
import { WoUnitCaptureTile as $Message$CommonProto$WarOperation$WoUnitCaptureTile, type WoUnitCaptureTileJson as $Json$CommonProto$WarOperation$WoUnitCaptureTile } from "./WoUnitCaptureTile.js";
import { WoUnitCrushUnit as $Message$CommonProto$WarOperation$WoUnitCrushUnit, type WoUnitCrushUnitJson as $Json$CommonProto$WarOperation$WoUnitCrushUnit } from "./WoUnitCrushUnit.js";
import { WoUnitDive as $Message$CommonProto$WarOperation$WoUnitDive, type WoUnitDiveJson as $Json$CommonProto$WarOperation$WoUnitDive } from "./WoUnitDive.js";
import { WoUnitDropUnit as $Message$CommonProto$WarOperation$WoUnitDropUnit, type WoUnitDropUnitJson as $Json$CommonProto$WarOperation$WoUnitDropUnit } from "./WoUnitDropUnit.js";
import { WoUnitJoinUnit as $Message$CommonProto$WarOperation$WoUnitJoinUnit, type WoUnitJoinUnitJson as $Json$CommonProto$WarOperation$WoUnitJoinUnit } from "./WoUnitJoinUnit.js";
import { WoUnitLaunchFlare as $Message$CommonProto$WarOperation$WoUnitLaunchFlare, type WoUnitLaunchFlareJson as $Json$CommonProto$WarOperation$WoUnitLaunchFlare } from "./WoUnitLaunchFlare.js";
import { WoUnitLaunchSilo as $Message$CommonProto$WarOperation$WoUnitLaunchSilo, type WoUnitLaunchSiloJson as $Json$CommonProto$WarOperation$WoUnitLaunchSilo } from "./WoUnitLaunchSilo.js";
import { WoUnitProduceUnit as $Message$CommonProto$WarOperation$WoUnitProduceUnit, type WoUnitProduceUnitJson as $Json$CommonProto$WarOperation$WoUnitProduceUnit } from "./WoUnitProduceUnit.js";
import { WoUnitRepairUnit as $Message$CommonProto$WarOperation$WoUnitRepairUnit, type WoUnitRepairUnitJson as $Json$CommonProto$WarOperation$WoUnitRepairUnit } from "./WoUnitRepairUnit.js";
import { WoUnitSelfDetonate as $Message$CommonProto$WarOperation$WoUnitSelfDetonate, type WoUnitSelfDetonateJson as $Json$CommonProto$WarOperation$WoUnitSelfDetonate } from "./WoUnitSelfDetonate.js";
import { WoUnitSupplyUnit as $Message$CommonProto$WarOperation$WoUnitSupplyUnit, type WoUnitSupplyUnitJson as $Json$CommonProto$WarOperation$WoUnitSupplyUnit } from "./WoUnitSupplyUnit.js";
import { WoUnitSurface as $Message$CommonProto$WarOperation$WoUnitSurface, type WoUnitSurfaceJson as $Json$CommonProto$WarOperation$WoUnitSurface } from "./WoUnitSurface.js";
import { WoUnitUseCoSkill as $Message$CommonProto$WarOperation$WoUnitUseCoSkill, type WoUnitUseCoSkillJson as $Json$CommonProto$WarOperation$WoUnitUseCoSkill } from "./WoUnitUseCoSkill.js";
import { WoUnitWait as $Message$CommonProto$WarOperation$WoUnitWait, type WoUnitWaitJson as $Json$CommonProto$WarOperation$WoUnitWait } from "./WoUnitWait.js";

export interface WoContainerJson extends $ProtoSchemaJsonBase {
    operationId?: number | null | undefined;
    WoSystemBeginTurn?: $Json$CommonProto$WarOperation$WoSystemBeginTurn | null | undefined;
    WoSystemCallWarEvent?: $Json$CommonProto$WarOperation$WoSystemCallWarEvent | null | undefined;
    WoSystemDestroyPlayerForce?: $Json$CommonProto$WarOperation$WoSystemDestroyPlayerForce | null | undefined;
    WoSystemEndWar?: $Json$CommonProto$WarOperation$WoSystemEndWar | null | undefined;
    WoSystemEndTurn?: $Json$CommonProto$WarOperation$WoSystemEndTurn | null | undefined;
    WoSystemHandleBootPlayer?: $Json$CommonProto$WarOperation$WoSystemHandleBootPlayer | null | undefined;
    WoSystemVoteForDraw?: $Json$CommonProto$WarOperation$WoSystemVoteForDraw | null | undefined;
    WoPlayerEndTurn?: $Json$CommonProto$WarOperation$WoPlayerEndTurn | null | undefined;
    WoPlayerSurrender?: $Json$CommonProto$WarOperation$WoPlayerSurrender | null | undefined;
    WoPlayerProduceUnit?: $Json$CommonProto$WarOperation$WoPlayerProduceUnit | null | undefined;
    WoPlayerDeleteUnit?: $Json$CommonProto$WarOperation$WoPlayerDeleteUnit | null | undefined;
    WoPlayerVoteForDraw?: $Json$CommonProto$WarOperation$WoPlayerVoteForDraw | null | undefined;
    WoPlayerUseCoSkill?: $Json$CommonProto$WarOperation$WoPlayerUseCoSkill | null | undefined;
    WoUnitWait?: $Json$CommonProto$WarOperation$WoUnitWait | null | undefined;
    WoUnitBeLoaded?: $Json$CommonProto$WarOperation$WoUnitBeLoaded | null | undefined;
    WoUnitCaptureTile?: $Json$CommonProto$WarOperation$WoUnitCaptureTile | null | undefined;
    WoUnitAttackTile?: $Json$CommonProto$WarOperation$WoUnitAttackTile | null | undefined;
    WoUnitAttackUnit?: $Json$CommonProto$WarOperation$WoUnitAttackUnit | null | undefined;
    WoUnitDropUnit?: $Json$CommonProto$WarOperation$WoUnitDropUnit | null | undefined;
    WoUnitBuildTile?: $Json$CommonProto$WarOperation$WoUnitBuildTile | null | undefined;
    WoUnitDive?: $Json$CommonProto$WarOperation$WoUnitDive | null | undefined;
    WoUnitSurface?: $Json$CommonProto$WarOperation$WoUnitSurface | null | undefined;
    WoUnitJoinUnit?: $Json$CommonProto$WarOperation$WoUnitJoinUnit | null | undefined;
    WoUnitLaunchFlare?: $Json$CommonProto$WarOperation$WoUnitLaunchFlare | null | undefined;
    WoUnitLaunchSilo?: $Json$CommonProto$WarOperation$WoUnitLaunchSilo | null | undefined;
    WoUnitProduceUnit?: $Json$CommonProto$WarOperation$WoUnitProduceUnit | null | undefined;
    WoUnitSupplyUnit?: $Json$CommonProto$WarOperation$WoUnitSupplyUnit | null | undefined;
    WoUnitBoardedByCo?: $Json$CommonProto$WarOperation$WoUnitBoardedByCo | null | undefined;
    WoUnitUseCoSkill?: $Json$CommonProto$WarOperation$WoUnitUseCoSkill | null | undefined;
    WoUnitRepairUnit?: $Json$CommonProto$WarOperation$WoUnitRepairUnit | null | undefined;
    WoUnitCrushUnit?: $Json$CommonProto$WarOperation$WoUnitCrushUnit | null | undefined;
    WoUnitSelfDetonate?: $Json$CommonProto$WarOperation$WoUnitSelfDetonate | null | undefined;
}

export class WoContainer extends $ProtoSchemaBase {
    private _operationId?: number | null | undefined;
    private _WoSystemBeginTurn?: $Message$CommonProto$WarOperation$WoSystemBeginTurn | null | undefined;
    private _WoSystemCallWarEvent?: $Message$CommonProto$WarOperation$WoSystemCallWarEvent | null | undefined;
    private _WoSystemDestroyPlayerForce?: $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce | null | undefined;
    private _WoSystemEndWar?: $Message$CommonProto$WarOperation$WoSystemEndWar | null | undefined;
    private _WoSystemEndTurn?: $Message$CommonProto$WarOperation$WoSystemEndTurn | null | undefined;
    private _WoSystemHandleBootPlayer?: $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer | null | undefined;
    private _WoSystemVoteForDraw?: $Message$CommonProto$WarOperation$WoSystemVoteForDraw | null | undefined;
    private _WoPlayerEndTurn?: $Message$CommonProto$WarOperation$WoPlayerEndTurn | null | undefined;
    private _WoPlayerSurrender?: $Message$CommonProto$WarOperation$WoPlayerSurrender | null | undefined;
    private _WoPlayerProduceUnit?: $Message$CommonProto$WarOperation$WoPlayerProduceUnit | null | undefined;
    private _WoPlayerDeleteUnit?: $Message$CommonProto$WarOperation$WoPlayerDeleteUnit | null | undefined;
    private _WoPlayerVoteForDraw?: $Message$CommonProto$WarOperation$WoPlayerVoteForDraw | null | undefined;
    private _WoPlayerUseCoSkill?: $Message$CommonProto$WarOperation$WoPlayerUseCoSkill | null | undefined;
    private _WoUnitWait?: $Message$CommonProto$WarOperation$WoUnitWait | null | undefined;
    private _WoUnitBeLoaded?: $Message$CommonProto$WarOperation$WoUnitBeLoaded | null | undefined;
    private _WoUnitCaptureTile?: $Message$CommonProto$WarOperation$WoUnitCaptureTile | null | undefined;
    private _WoUnitAttackTile?: $Message$CommonProto$WarOperation$WoUnitAttackTile | null | undefined;
    private _WoUnitAttackUnit?: $Message$CommonProto$WarOperation$WoUnitAttackUnit | null | undefined;
    private _WoUnitDropUnit?: $Message$CommonProto$WarOperation$WoUnitDropUnit | null | undefined;
    private _WoUnitBuildTile?: $Message$CommonProto$WarOperation$WoUnitBuildTile | null | undefined;
    private _WoUnitDive?: $Message$CommonProto$WarOperation$WoUnitDive | null | undefined;
    private _WoUnitSurface?: $Message$CommonProto$WarOperation$WoUnitSurface | null | undefined;
    private _WoUnitJoinUnit?: $Message$CommonProto$WarOperation$WoUnitJoinUnit | null | undefined;
    private _WoUnitLaunchFlare?: $Message$CommonProto$WarOperation$WoUnitLaunchFlare | null | undefined;
    private _WoUnitLaunchSilo?: $Message$CommonProto$WarOperation$WoUnitLaunchSilo | null | undefined;
    private _WoUnitProduceUnit?: $Message$CommonProto$WarOperation$WoUnitProduceUnit | null | undefined;
    private _WoUnitSupplyUnit?: $Message$CommonProto$WarOperation$WoUnitSupplyUnit | null | undefined;
    private _WoUnitBoardedByCo?: $Message$CommonProto$WarOperation$WoUnitBoardedByCo | null | undefined;
    private _WoUnitUseCoSkill?: $Message$CommonProto$WarOperation$WoUnitUseCoSkill | null | undefined;
    private _WoUnitRepairUnit?: $Message$CommonProto$WarOperation$WoUnitRepairUnit | null | undefined;
    private _WoUnitCrushUnit?: $Message$CommonProto$WarOperation$WoUnitCrushUnit | null | undefined;
    private _WoUnitSelfDetonate?: $Message$CommonProto$WarOperation$WoUnitSelfDetonate | null | undefined;

    public static fromJson(obj: WoContainerJson): WoContainer {
        return new WoContainer().loadJson(obj);
    }
    public override loadJson(obj: WoContainerJson): this {
        this.setOperationId(obj.operationId);
        this.setWoSystemBeginTurn(obj.WoSystemBeginTurn != null ? $Message$CommonProto$WarOperation$WoSystemBeginTurn.fromJson(obj.WoSystemBeginTurn) : null);
        this.setWoSystemCallWarEvent(obj.WoSystemCallWarEvent != null ? $Message$CommonProto$WarOperation$WoSystemCallWarEvent.fromJson(obj.WoSystemCallWarEvent) : null);
        this.setWoSystemDestroyPlayerForce(obj.WoSystemDestroyPlayerForce != null ? $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce.fromJson(obj.WoSystemDestroyPlayerForce) : null);
        this.setWoSystemEndWar(obj.WoSystemEndWar != null ? $Message$CommonProto$WarOperation$WoSystemEndWar.fromJson(obj.WoSystemEndWar) : null);
        this.setWoSystemEndTurn(obj.WoSystemEndTurn != null ? $Message$CommonProto$WarOperation$WoSystemEndTurn.fromJson(obj.WoSystemEndTurn) : null);
        this.setWoSystemHandleBootPlayer(obj.WoSystemHandleBootPlayer != null ? $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer.fromJson(obj.WoSystemHandleBootPlayer) : null);
        this.setWoSystemVoteForDraw(obj.WoSystemVoteForDraw != null ? $Message$CommonProto$WarOperation$WoSystemVoteForDraw.fromJson(obj.WoSystemVoteForDraw) : null);
        this.setWoPlayerEndTurn(obj.WoPlayerEndTurn != null ? $Message$CommonProto$WarOperation$WoPlayerEndTurn.fromJson(obj.WoPlayerEndTurn) : null);
        this.setWoPlayerSurrender(obj.WoPlayerSurrender != null ? $Message$CommonProto$WarOperation$WoPlayerSurrender.fromJson(obj.WoPlayerSurrender) : null);
        this.setWoPlayerProduceUnit(obj.WoPlayerProduceUnit != null ? $Message$CommonProto$WarOperation$WoPlayerProduceUnit.fromJson(obj.WoPlayerProduceUnit) : null);
        this.setWoPlayerDeleteUnit(obj.WoPlayerDeleteUnit != null ? $Message$CommonProto$WarOperation$WoPlayerDeleteUnit.fromJson(obj.WoPlayerDeleteUnit) : null);
        this.setWoPlayerVoteForDraw(obj.WoPlayerVoteForDraw != null ? $Message$CommonProto$WarOperation$WoPlayerVoteForDraw.fromJson(obj.WoPlayerVoteForDraw) : null);
        this.setWoPlayerUseCoSkill(obj.WoPlayerUseCoSkill != null ? $Message$CommonProto$WarOperation$WoPlayerUseCoSkill.fromJson(obj.WoPlayerUseCoSkill) : null);
        this.setWoUnitWait(obj.WoUnitWait != null ? $Message$CommonProto$WarOperation$WoUnitWait.fromJson(obj.WoUnitWait) : null);
        this.setWoUnitBeLoaded(obj.WoUnitBeLoaded != null ? $Message$CommonProto$WarOperation$WoUnitBeLoaded.fromJson(obj.WoUnitBeLoaded) : null);
        this.setWoUnitCaptureTile(obj.WoUnitCaptureTile != null ? $Message$CommonProto$WarOperation$WoUnitCaptureTile.fromJson(obj.WoUnitCaptureTile) : null);
        this.setWoUnitAttackTile(obj.WoUnitAttackTile != null ? $Message$CommonProto$WarOperation$WoUnitAttackTile.fromJson(obj.WoUnitAttackTile) : null);
        this.setWoUnitAttackUnit(obj.WoUnitAttackUnit != null ? $Message$CommonProto$WarOperation$WoUnitAttackUnit.fromJson(obj.WoUnitAttackUnit) : null);
        this.setWoUnitDropUnit(obj.WoUnitDropUnit != null ? $Message$CommonProto$WarOperation$WoUnitDropUnit.fromJson(obj.WoUnitDropUnit) : null);
        this.setWoUnitBuildTile(obj.WoUnitBuildTile != null ? $Message$CommonProto$WarOperation$WoUnitBuildTile.fromJson(obj.WoUnitBuildTile) : null);
        this.setWoUnitDive(obj.WoUnitDive != null ? $Message$CommonProto$WarOperation$WoUnitDive.fromJson(obj.WoUnitDive) : null);
        this.setWoUnitSurface(obj.WoUnitSurface != null ? $Message$CommonProto$WarOperation$WoUnitSurface.fromJson(obj.WoUnitSurface) : null);
        this.setWoUnitJoinUnit(obj.WoUnitJoinUnit != null ? $Message$CommonProto$WarOperation$WoUnitJoinUnit.fromJson(obj.WoUnitJoinUnit) : null);
        this.setWoUnitLaunchFlare(obj.WoUnitLaunchFlare != null ? $Message$CommonProto$WarOperation$WoUnitLaunchFlare.fromJson(obj.WoUnitLaunchFlare) : null);
        this.setWoUnitLaunchSilo(obj.WoUnitLaunchSilo != null ? $Message$CommonProto$WarOperation$WoUnitLaunchSilo.fromJson(obj.WoUnitLaunchSilo) : null);
        this.setWoUnitProduceUnit(obj.WoUnitProduceUnit != null ? $Message$CommonProto$WarOperation$WoUnitProduceUnit.fromJson(obj.WoUnitProduceUnit) : null);
        this.setWoUnitSupplyUnit(obj.WoUnitSupplyUnit != null ? $Message$CommonProto$WarOperation$WoUnitSupplyUnit.fromJson(obj.WoUnitSupplyUnit) : null);
        this.setWoUnitBoardedByCo(obj.WoUnitBoardedByCo != null ? $Message$CommonProto$WarOperation$WoUnitBoardedByCo.fromJson(obj.WoUnitBoardedByCo) : null);
        this.setWoUnitUseCoSkill(obj.WoUnitUseCoSkill != null ? $Message$CommonProto$WarOperation$WoUnitUseCoSkill.fromJson(obj.WoUnitUseCoSkill) : null);
        this.setWoUnitRepairUnit(obj.WoUnitRepairUnit != null ? $Message$CommonProto$WarOperation$WoUnitRepairUnit.fromJson(obj.WoUnitRepairUnit) : null);
        this.setWoUnitCrushUnit(obj.WoUnitCrushUnit != null ? $Message$CommonProto$WarOperation$WoUnitCrushUnit.fromJson(obj.WoUnitCrushUnit) : null);
        this.setWoUnitSelfDetonate(obj.WoUnitSelfDetonate != null ? $Message$CommonProto$WarOperation$WoUnitSelfDetonate.fromJson(obj.WoUnitSelfDetonate) : null);
        return this;
    }
    public override toJson(obj?: WoContainerJson): WoContainerJson {
        obj ??= ({} as WoContainerJson);

        {
            const value = this.getOperationId();
            (value != null) && (obj.operationId = value);
        }

        {
            const value = this.getWoSystemBeginTurn();
            (value != null) && (obj.WoSystemBeginTurn = value.toJson());
        }

        {
            const value = this.getWoSystemCallWarEvent();
            (value != null) && (obj.WoSystemCallWarEvent = value.toJson());
        }

        {
            const value = this.getWoSystemDestroyPlayerForce();
            (value != null) && (obj.WoSystemDestroyPlayerForce = value.toJson());
        }

        {
            const value = this.getWoSystemEndWar();
            (value != null) && (obj.WoSystemEndWar = value.toJson());
        }

        {
            const value = this.getWoSystemEndTurn();
            (value != null) && (obj.WoSystemEndTurn = value.toJson());
        }

        {
            const value = this.getWoSystemHandleBootPlayer();
            (value != null) && (obj.WoSystemHandleBootPlayer = value.toJson());
        }

        {
            const value = this.getWoSystemVoteForDraw();
            (value != null) && (obj.WoSystemVoteForDraw = value.toJson());
        }

        {
            const value = this.getWoPlayerEndTurn();
            (value != null) && (obj.WoPlayerEndTurn = value.toJson());
        }

        {
            const value = this.getWoPlayerSurrender();
            (value != null) && (obj.WoPlayerSurrender = value.toJson());
        }

        {
            const value = this.getWoPlayerProduceUnit();
            (value != null) && (obj.WoPlayerProduceUnit = value.toJson());
        }

        {
            const value = this.getWoPlayerDeleteUnit();
            (value != null) && (obj.WoPlayerDeleteUnit = value.toJson());
        }

        {
            const value = this.getWoPlayerVoteForDraw();
            (value != null) && (obj.WoPlayerVoteForDraw = value.toJson());
        }

        {
            const value = this.getWoPlayerUseCoSkill();
            (value != null) && (obj.WoPlayerUseCoSkill = value.toJson());
        }

        {
            const value = this.getWoUnitWait();
            (value != null) && (obj.WoUnitWait = value.toJson());
        }

        {
            const value = this.getWoUnitBeLoaded();
            (value != null) && (obj.WoUnitBeLoaded = value.toJson());
        }

        {
            const value = this.getWoUnitCaptureTile();
            (value != null) && (obj.WoUnitCaptureTile = value.toJson());
        }

        {
            const value = this.getWoUnitAttackTile();
            (value != null) && (obj.WoUnitAttackTile = value.toJson());
        }

        {
            const value = this.getWoUnitAttackUnit();
            (value != null) && (obj.WoUnitAttackUnit = value.toJson());
        }

        {
            const value = this.getWoUnitDropUnit();
            (value != null) && (obj.WoUnitDropUnit = value.toJson());
        }

        {
            const value = this.getWoUnitBuildTile();
            (value != null) && (obj.WoUnitBuildTile = value.toJson());
        }

        {
            const value = this.getWoUnitDive();
            (value != null) && (obj.WoUnitDive = value.toJson());
        }

        {
            const value = this.getWoUnitSurface();
            (value != null) && (obj.WoUnitSurface = value.toJson());
        }

        {
            const value = this.getWoUnitJoinUnit();
            (value != null) && (obj.WoUnitJoinUnit = value.toJson());
        }

        {
            const value = this.getWoUnitLaunchFlare();
            (value != null) && (obj.WoUnitLaunchFlare = value.toJson());
        }

        {
            const value = this.getWoUnitLaunchSilo();
            (value != null) && (obj.WoUnitLaunchSilo = value.toJson());
        }

        {
            const value = this.getWoUnitProduceUnit();
            (value != null) && (obj.WoUnitProduceUnit = value.toJson());
        }

        {
            const value = this.getWoUnitSupplyUnit();
            (value != null) && (obj.WoUnitSupplyUnit = value.toJson());
        }

        {
            const value = this.getWoUnitBoardedByCo();
            (value != null) && (obj.WoUnitBoardedByCo = value.toJson());
        }

        {
            const value = this.getWoUnitUseCoSkill();
            (value != null) && (obj.WoUnitUseCoSkill = value.toJson());
        }

        {
            const value = this.getWoUnitRepairUnit();
            (value != null) && (obj.WoUnitRepairUnit = value.toJson());
        }

        {
            const value = this.getWoUnitCrushUnit();
            (value != null) && (obj.WoUnitCrushUnit = value.toJson());
        }

        {
            const value = this.getWoUnitSelfDetonate();
            (value != null) && (obj.WoUnitSelfDetonate = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getOperationId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getWoSystemBeginTurn();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getWoSystemCallWarEvent();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getWoSystemDestroyPlayerForce();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getWoSystemEndWar();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getWoSystemEndTurn();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        {
            const value = this.getWoSystemHandleBootPlayer();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getWoSystemVoteForDraw();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getWoPlayerEndTurn();
            if (value != null) {
                value.toWriter(writer.uint32(162).fork()).ldelim();
            }
        }

        {
            const value = this.getWoPlayerSurrender();
            if (value != null) {
                value.toWriter(writer.uint32(170).fork()).ldelim();
            }
        }

        {
            const value = this.getWoPlayerProduceUnit();
            if (value != null) {
                value.toWriter(writer.uint32(178).fork()).ldelim();
            }
        }

        {
            const value = this.getWoPlayerDeleteUnit();
            if (value != null) {
                value.toWriter(writer.uint32(186).fork()).ldelim();
            }
        }

        {
            const value = this.getWoPlayerVoteForDraw();
            if (value != null) {
                value.toWriter(writer.uint32(194).fork()).ldelim();
            }
        }

        {
            const value = this.getWoPlayerUseCoSkill();
            if (value != null) {
                value.toWriter(writer.uint32(202).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitWait();
            if (value != null) {
                value.toWriter(writer.uint32(242).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitBeLoaded();
            if (value != null) {
                value.toWriter(writer.uint32(250).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitCaptureTile();
            if (value != null) {
                value.toWriter(writer.uint32(258).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitAttackTile();
            if (value != null) {
                value.toWriter(writer.uint32(266).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitAttackUnit();
            if (value != null) {
                value.toWriter(writer.uint32(274).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitDropUnit();
            if (value != null) {
                value.toWriter(writer.uint32(282).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitBuildTile();
            if (value != null) {
                value.toWriter(writer.uint32(290).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitDive();
            if (value != null) {
                value.toWriter(writer.uint32(298).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitSurface();
            if (value != null) {
                value.toWriter(writer.uint32(306).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitJoinUnit();
            if (value != null) {
                value.toWriter(writer.uint32(314).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitLaunchFlare();
            if (value != null) {
                value.toWriter(writer.uint32(322).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitLaunchSilo();
            if (value != null) {
                value.toWriter(writer.uint32(330).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitProduceUnit();
            if (value != null) {
                value.toWriter(writer.uint32(338).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitSupplyUnit();
            if (value != null) {
                value.toWriter(writer.uint32(346).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitBoardedByCo();
            if (value != null) {
                value.toWriter(writer.uint32(354).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitUseCoSkill();
            if (value != null) {
                value.toWriter(writer.uint32(362).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitRepairUnit();
            if (value != null) {
                value.toWriter(writer.uint32(370).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitCrushUnit();
            if (value != null) {
                value.toWriter(writer.uint32(378).fork()).ldelim();
            }
        }

        {
            const value = this.getWoUnitSelfDetonate();
            if (value != null) {
                value.toWriter(writer.uint32(386).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoContainer {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoContainer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setOperationId(reader.int32());
                    break;

                case 10:
                    msg.setWoSystemBeginTurn($Message$CommonProto$WarOperation$WoSystemBeginTurn.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setWoSystemCallWarEvent($Message$CommonProto$WarOperation$WoSystemCallWarEvent.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setWoSystemDestroyPlayerForce($Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setWoSystemEndWar($Message$CommonProto$WarOperation$WoSystemEndWar.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setWoSystemEndTurn($Message$CommonProto$WarOperation$WoSystemEndTurn.decode(reader, reader.uint32()));
                    break;

                case 15:
                    msg.setWoSystemHandleBootPlayer($Message$CommonProto$WarOperation$WoSystemHandleBootPlayer.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setWoSystemVoteForDraw($Message$CommonProto$WarOperation$WoSystemVoteForDraw.decode(reader, reader.uint32()));
                    break;

                case 20:
                    msg.setWoPlayerEndTurn($Message$CommonProto$WarOperation$WoPlayerEndTurn.decode(reader, reader.uint32()));
                    break;

                case 21:
                    msg.setWoPlayerSurrender($Message$CommonProto$WarOperation$WoPlayerSurrender.decode(reader, reader.uint32()));
                    break;

                case 22:
                    msg.setWoPlayerProduceUnit($Message$CommonProto$WarOperation$WoPlayerProduceUnit.decode(reader, reader.uint32()));
                    break;

                case 23:
                    msg.setWoPlayerDeleteUnit($Message$CommonProto$WarOperation$WoPlayerDeleteUnit.decode(reader, reader.uint32()));
                    break;

                case 24:
                    msg.setWoPlayerVoteForDraw($Message$CommonProto$WarOperation$WoPlayerVoteForDraw.decode(reader, reader.uint32()));
                    break;

                case 25:
                    msg.setWoPlayerUseCoSkill($Message$CommonProto$WarOperation$WoPlayerUseCoSkill.decode(reader, reader.uint32()));
                    break;

                case 30:
                    msg.setWoUnitWait($Message$CommonProto$WarOperation$WoUnitWait.decode(reader, reader.uint32()));
                    break;

                case 31:
                    msg.setWoUnitBeLoaded($Message$CommonProto$WarOperation$WoUnitBeLoaded.decode(reader, reader.uint32()));
                    break;

                case 32:
                    msg.setWoUnitCaptureTile($Message$CommonProto$WarOperation$WoUnitCaptureTile.decode(reader, reader.uint32()));
                    break;

                case 33:
                    msg.setWoUnitAttackTile($Message$CommonProto$WarOperation$WoUnitAttackTile.decode(reader, reader.uint32()));
                    break;

                case 34:
                    msg.setWoUnitAttackUnit($Message$CommonProto$WarOperation$WoUnitAttackUnit.decode(reader, reader.uint32()));
                    break;

                case 35:
                    msg.setWoUnitDropUnit($Message$CommonProto$WarOperation$WoUnitDropUnit.decode(reader, reader.uint32()));
                    break;

                case 36:
                    msg.setWoUnitBuildTile($Message$CommonProto$WarOperation$WoUnitBuildTile.decode(reader, reader.uint32()));
                    break;

                case 37:
                    msg.setWoUnitDive($Message$CommonProto$WarOperation$WoUnitDive.decode(reader, reader.uint32()));
                    break;

                case 38:
                    msg.setWoUnitSurface($Message$CommonProto$WarOperation$WoUnitSurface.decode(reader, reader.uint32()));
                    break;

                case 39:
                    msg.setWoUnitJoinUnit($Message$CommonProto$WarOperation$WoUnitJoinUnit.decode(reader, reader.uint32()));
                    break;

                case 40:
                    msg.setWoUnitLaunchFlare($Message$CommonProto$WarOperation$WoUnitLaunchFlare.decode(reader, reader.uint32()));
                    break;

                case 41:
                    msg.setWoUnitLaunchSilo($Message$CommonProto$WarOperation$WoUnitLaunchSilo.decode(reader, reader.uint32()));
                    break;

                case 42:
                    msg.setWoUnitProduceUnit($Message$CommonProto$WarOperation$WoUnitProduceUnit.decode(reader, reader.uint32()));
                    break;

                case 43:
                    msg.setWoUnitSupplyUnit($Message$CommonProto$WarOperation$WoUnitSupplyUnit.decode(reader, reader.uint32()));
                    break;

                case 44:
                    msg.setWoUnitBoardedByCo($Message$CommonProto$WarOperation$WoUnitBoardedByCo.decode(reader, reader.uint32()));
                    break;

                case 45:
                    msg.setWoUnitUseCoSkill($Message$CommonProto$WarOperation$WoUnitUseCoSkill.decode(reader, reader.uint32()));
                    break;

                case 46:
                    msg.setWoUnitRepairUnit($Message$CommonProto$WarOperation$WoUnitRepairUnit.decode(reader, reader.uint32()));
                    break;

                case 47:
                    msg.setWoUnitCrushUnit($Message$CommonProto$WarOperation$WoUnitCrushUnit.decode(reader, reader.uint32()));
                    break;

                case 48:
                    msg.setWoUnitSelfDetonate($Message$CommonProto$WarOperation$WoUnitSelfDetonate.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoContainer {
        return WoContainer.decode(this.encode());
    }

    public override getSchemaName(): "WoContainer" {
        return "WoContainer";
    }

    public checkHasOperationId(): boolean {
        return this._operationId != null;
    }
    public getOperationId(): number | null | undefined {
        return this._operationId;
    }
    public setOperationId(value: number | null | undefined): void {
        this._operationId = value;
    }

    public checkHasWoSystemBeginTurn(): boolean {
        return this._WoSystemBeginTurn != null;
    }
    public getWoSystemBeginTurn(): $Message$CommonProto$WarOperation$WoSystemBeginTurn | null | undefined {
        return this._WoSystemBeginTurn;
    }
    public setWoSystemBeginTurn(value: $Message$CommonProto$WarOperation$WoSystemBeginTurn | null | undefined): void {
        this._WoSystemBeginTurn = value;
    }
    public createIfNotExistsWoSystemBeginTurn(): $Message$CommonProto$WarOperation$WoSystemBeginTurn {
        return this._WoSystemBeginTurn ??= new $Message$CommonProto$WarOperation$WoSystemBeginTurn();
    }

    public checkHasWoSystemCallWarEvent(): boolean {
        return this._WoSystemCallWarEvent != null;
    }
    public getWoSystemCallWarEvent(): $Message$CommonProto$WarOperation$WoSystemCallWarEvent | null | undefined {
        return this._WoSystemCallWarEvent;
    }
    public setWoSystemCallWarEvent(value: $Message$CommonProto$WarOperation$WoSystemCallWarEvent | null | undefined): void {
        this._WoSystemCallWarEvent = value;
    }
    public createIfNotExistsWoSystemCallWarEvent(): $Message$CommonProto$WarOperation$WoSystemCallWarEvent {
        return this._WoSystemCallWarEvent ??= new $Message$CommonProto$WarOperation$WoSystemCallWarEvent();
    }

    public checkHasWoSystemDestroyPlayerForce(): boolean {
        return this._WoSystemDestroyPlayerForce != null;
    }
    public getWoSystemDestroyPlayerForce(): $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce | null | undefined {
        return this._WoSystemDestroyPlayerForce;
    }
    public setWoSystemDestroyPlayerForce(value: $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce | null | undefined): void {
        this._WoSystemDestroyPlayerForce = value;
    }
    public createIfNotExistsWoSystemDestroyPlayerForce(): $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce {
        return this._WoSystemDestroyPlayerForce ??= new $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce();
    }

    public checkHasWoSystemEndWar(): boolean {
        return this._WoSystemEndWar != null;
    }
    public getWoSystemEndWar(): $Message$CommonProto$WarOperation$WoSystemEndWar | null | undefined {
        return this._WoSystemEndWar;
    }
    public setWoSystemEndWar(value: $Message$CommonProto$WarOperation$WoSystemEndWar | null | undefined): void {
        this._WoSystemEndWar = value;
    }
    public createIfNotExistsWoSystemEndWar(): $Message$CommonProto$WarOperation$WoSystemEndWar {
        return this._WoSystemEndWar ??= new $Message$CommonProto$WarOperation$WoSystemEndWar();
    }

    public checkHasWoSystemEndTurn(): boolean {
        return this._WoSystemEndTurn != null;
    }
    public getWoSystemEndTurn(): $Message$CommonProto$WarOperation$WoSystemEndTurn | null | undefined {
        return this._WoSystemEndTurn;
    }
    public setWoSystemEndTurn(value: $Message$CommonProto$WarOperation$WoSystemEndTurn | null | undefined): void {
        this._WoSystemEndTurn = value;
    }
    public createIfNotExistsWoSystemEndTurn(): $Message$CommonProto$WarOperation$WoSystemEndTurn {
        return this._WoSystemEndTurn ??= new $Message$CommonProto$WarOperation$WoSystemEndTurn();
    }

    public checkHasWoSystemHandleBootPlayer(): boolean {
        return this._WoSystemHandleBootPlayer != null;
    }
    public getWoSystemHandleBootPlayer(): $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer | null | undefined {
        return this._WoSystemHandleBootPlayer;
    }
    public setWoSystemHandleBootPlayer(value: $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer | null | undefined): void {
        this._WoSystemHandleBootPlayer = value;
    }
    public createIfNotExistsWoSystemHandleBootPlayer(): $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer {
        return this._WoSystemHandleBootPlayer ??= new $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer();
    }

    public checkHasWoSystemVoteForDraw(): boolean {
        return this._WoSystemVoteForDraw != null;
    }
    public getWoSystemVoteForDraw(): $Message$CommonProto$WarOperation$WoSystemVoteForDraw | null | undefined {
        return this._WoSystemVoteForDraw;
    }
    public setWoSystemVoteForDraw(value: $Message$CommonProto$WarOperation$WoSystemVoteForDraw | null | undefined): void {
        this._WoSystemVoteForDraw = value;
    }
    public createIfNotExistsWoSystemVoteForDraw(): $Message$CommonProto$WarOperation$WoSystemVoteForDraw {
        return this._WoSystemVoteForDraw ??= new $Message$CommonProto$WarOperation$WoSystemVoteForDraw();
    }

    public checkHasWoPlayerEndTurn(): boolean {
        return this._WoPlayerEndTurn != null;
    }
    public getWoPlayerEndTurn(): $Message$CommonProto$WarOperation$WoPlayerEndTurn | null | undefined {
        return this._WoPlayerEndTurn;
    }
    public setWoPlayerEndTurn(value: $Message$CommonProto$WarOperation$WoPlayerEndTurn | null | undefined): void {
        this._WoPlayerEndTurn = value;
    }
    public createIfNotExistsWoPlayerEndTurn(): $Message$CommonProto$WarOperation$WoPlayerEndTurn {
        return this._WoPlayerEndTurn ??= new $Message$CommonProto$WarOperation$WoPlayerEndTurn();
    }

    public checkHasWoPlayerSurrender(): boolean {
        return this._WoPlayerSurrender != null;
    }
    public getWoPlayerSurrender(): $Message$CommonProto$WarOperation$WoPlayerSurrender | null | undefined {
        return this._WoPlayerSurrender;
    }
    public setWoPlayerSurrender(value: $Message$CommonProto$WarOperation$WoPlayerSurrender | null | undefined): void {
        this._WoPlayerSurrender = value;
    }
    public createIfNotExistsWoPlayerSurrender(): $Message$CommonProto$WarOperation$WoPlayerSurrender {
        return this._WoPlayerSurrender ??= new $Message$CommonProto$WarOperation$WoPlayerSurrender();
    }

    public checkHasWoPlayerProduceUnit(): boolean {
        return this._WoPlayerProduceUnit != null;
    }
    public getWoPlayerProduceUnit(): $Message$CommonProto$WarOperation$WoPlayerProduceUnit | null | undefined {
        return this._WoPlayerProduceUnit;
    }
    public setWoPlayerProduceUnit(value: $Message$CommonProto$WarOperation$WoPlayerProduceUnit | null | undefined): void {
        this._WoPlayerProduceUnit = value;
    }
    public createIfNotExistsWoPlayerProduceUnit(): $Message$CommonProto$WarOperation$WoPlayerProduceUnit {
        return this._WoPlayerProduceUnit ??= new $Message$CommonProto$WarOperation$WoPlayerProduceUnit();
    }

    public checkHasWoPlayerDeleteUnit(): boolean {
        return this._WoPlayerDeleteUnit != null;
    }
    public getWoPlayerDeleteUnit(): $Message$CommonProto$WarOperation$WoPlayerDeleteUnit | null | undefined {
        return this._WoPlayerDeleteUnit;
    }
    public setWoPlayerDeleteUnit(value: $Message$CommonProto$WarOperation$WoPlayerDeleteUnit | null | undefined): void {
        this._WoPlayerDeleteUnit = value;
    }
    public createIfNotExistsWoPlayerDeleteUnit(): $Message$CommonProto$WarOperation$WoPlayerDeleteUnit {
        return this._WoPlayerDeleteUnit ??= new $Message$CommonProto$WarOperation$WoPlayerDeleteUnit();
    }

    public checkHasWoPlayerVoteForDraw(): boolean {
        return this._WoPlayerVoteForDraw != null;
    }
    public getWoPlayerVoteForDraw(): $Message$CommonProto$WarOperation$WoPlayerVoteForDraw | null | undefined {
        return this._WoPlayerVoteForDraw;
    }
    public setWoPlayerVoteForDraw(value: $Message$CommonProto$WarOperation$WoPlayerVoteForDraw | null | undefined): void {
        this._WoPlayerVoteForDraw = value;
    }
    public createIfNotExistsWoPlayerVoteForDraw(): $Message$CommonProto$WarOperation$WoPlayerVoteForDraw {
        return this._WoPlayerVoteForDraw ??= new $Message$CommonProto$WarOperation$WoPlayerVoteForDraw();
    }

    public checkHasWoPlayerUseCoSkill(): boolean {
        return this._WoPlayerUseCoSkill != null;
    }
    public getWoPlayerUseCoSkill(): $Message$CommonProto$WarOperation$WoPlayerUseCoSkill | null | undefined {
        return this._WoPlayerUseCoSkill;
    }
    public setWoPlayerUseCoSkill(value: $Message$CommonProto$WarOperation$WoPlayerUseCoSkill | null | undefined): void {
        this._WoPlayerUseCoSkill = value;
    }
    public createIfNotExistsWoPlayerUseCoSkill(): $Message$CommonProto$WarOperation$WoPlayerUseCoSkill {
        return this._WoPlayerUseCoSkill ??= new $Message$CommonProto$WarOperation$WoPlayerUseCoSkill();
    }

    public checkHasWoUnitWait(): boolean {
        return this._WoUnitWait != null;
    }
    public getWoUnitWait(): $Message$CommonProto$WarOperation$WoUnitWait | null | undefined {
        return this._WoUnitWait;
    }
    public setWoUnitWait(value: $Message$CommonProto$WarOperation$WoUnitWait | null | undefined): void {
        this._WoUnitWait = value;
    }
    public createIfNotExistsWoUnitWait(): $Message$CommonProto$WarOperation$WoUnitWait {
        return this._WoUnitWait ??= new $Message$CommonProto$WarOperation$WoUnitWait();
    }

    public checkHasWoUnitBeLoaded(): boolean {
        return this._WoUnitBeLoaded != null;
    }
    public getWoUnitBeLoaded(): $Message$CommonProto$WarOperation$WoUnitBeLoaded | null | undefined {
        return this._WoUnitBeLoaded;
    }
    public setWoUnitBeLoaded(value: $Message$CommonProto$WarOperation$WoUnitBeLoaded | null | undefined): void {
        this._WoUnitBeLoaded = value;
    }
    public createIfNotExistsWoUnitBeLoaded(): $Message$CommonProto$WarOperation$WoUnitBeLoaded {
        return this._WoUnitBeLoaded ??= new $Message$CommonProto$WarOperation$WoUnitBeLoaded();
    }

    public checkHasWoUnitCaptureTile(): boolean {
        return this._WoUnitCaptureTile != null;
    }
    public getWoUnitCaptureTile(): $Message$CommonProto$WarOperation$WoUnitCaptureTile | null | undefined {
        return this._WoUnitCaptureTile;
    }
    public setWoUnitCaptureTile(value: $Message$CommonProto$WarOperation$WoUnitCaptureTile | null | undefined): void {
        this._WoUnitCaptureTile = value;
    }
    public createIfNotExistsWoUnitCaptureTile(): $Message$CommonProto$WarOperation$WoUnitCaptureTile {
        return this._WoUnitCaptureTile ??= new $Message$CommonProto$WarOperation$WoUnitCaptureTile();
    }

    public checkHasWoUnitAttackTile(): boolean {
        return this._WoUnitAttackTile != null;
    }
    public getWoUnitAttackTile(): $Message$CommonProto$WarOperation$WoUnitAttackTile | null | undefined {
        return this._WoUnitAttackTile;
    }
    public setWoUnitAttackTile(value: $Message$CommonProto$WarOperation$WoUnitAttackTile | null | undefined): void {
        this._WoUnitAttackTile = value;
    }
    public createIfNotExistsWoUnitAttackTile(): $Message$CommonProto$WarOperation$WoUnitAttackTile {
        return this._WoUnitAttackTile ??= new $Message$CommonProto$WarOperation$WoUnitAttackTile();
    }

    public checkHasWoUnitAttackUnit(): boolean {
        return this._WoUnitAttackUnit != null;
    }
    public getWoUnitAttackUnit(): $Message$CommonProto$WarOperation$WoUnitAttackUnit | null | undefined {
        return this._WoUnitAttackUnit;
    }
    public setWoUnitAttackUnit(value: $Message$CommonProto$WarOperation$WoUnitAttackUnit | null | undefined): void {
        this._WoUnitAttackUnit = value;
    }
    public createIfNotExistsWoUnitAttackUnit(): $Message$CommonProto$WarOperation$WoUnitAttackUnit {
        return this._WoUnitAttackUnit ??= new $Message$CommonProto$WarOperation$WoUnitAttackUnit();
    }

    public checkHasWoUnitDropUnit(): boolean {
        return this._WoUnitDropUnit != null;
    }
    public getWoUnitDropUnit(): $Message$CommonProto$WarOperation$WoUnitDropUnit | null | undefined {
        return this._WoUnitDropUnit;
    }
    public setWoUnitDropUnit(value: $Message$CommonProto$WarOperation$WoUnitDropUnit | null | undefined): void {
        this._WoUnitDropUnit = value;
    }
    public createIfNotExistsWoUnitDropUnit(): $Message$CommonProto$WarOperation$WoUnitDropUnit {
        return this._WoUnitDropUnit ??= new $Message$CommonProto$WarOperation$WoUnitDropUnit();
    }

    public checkHasWoUnitBuildTile(): boolean {
        return this._WoUnitBuildTile != null;
    }
    public getWoUnitBuildTile(): $Message$CommonProto$WarOperation$WoUnitBuildTile | null | undefined {
        return this._WoUnitBuildTile;
    }
    public setWoUnitBuildTile(value: $Message$CommonProto$WarOperation$WoUnitBuildTile | null | undefined): void {
        this._WoUnitBuildTile = value;
    }
    public createIfNotExistsWoUnitBuildTile(): $Message$CommonProto$WarOperation$WoUnitBuildTile {
        return this._WoUnitBuildTile ??= new $Message$CommonProto$WarOperation$WoUnitBuildTile();
    }

    public checkHasWoUnitDive(): boolean {
        return this._WoUnitDive != null;
    }
    public getWoUnitDive(): $Message$CommonProto$WarOperation$WoUnitDive | null | undefined {
        return this._WoUnitDive;
    }
    public setWoUnitDive(value: $Message$CommonProto$WarOperation$WoUnitDive | null | undefined): void {
        this._WoUnitDive = value;
    }
    public createIfNotExistsWoUnitDive(): $Message$CommonProto$WarOperation$WoUnitDive {
        return this._WoUnitDive ??= new $Message$CommonProto$WarOperation$WoUnitDive();
    }

    public checkHasWoUnitSurface(): boolean {
        return this._WoUnitSurface != null;
    }
    public getWoUnitSurface(): $Message$CommonProto$WarOperation$WoUnitSurface | null | undefined {
        return this._WoUnitSurface;
    }
    public setWoUnitSurface(value: $Message$CommonProto$WarOperation$WoUnitSurface | null | undefined): void {
        this._WoUnitSurface = value;
    }
    public createIfNotExistsWoUnitSurface(): $Message$CommonProto$WarOperation$WoUnitSurface {
        return this._WoUnitSurface ??= new $Message$CommonProto$WarOperation$WoUnitSurface();
    }

    public checkHasWoUnitJoinUnit(): boolean {
        return this._WoUnitJoinUnit != null;
    }
    public getWoUnitJoinUnit(): $Message$CommonProto$WarOperation$WoUnitJoinUnit | null | undefined {
        return this._WoUnitJoinUnit;
    }
    public setWoUnitJoinUnit(value: $Message$CommonProto$WarOperation$WoUnitJoinUnit | null | undefined): void {
        this._WoUnitJoinUnit = value;
    }
    public createIfNotExistsWoUnitJoinUnit(): $Message$CommonProto$WarOperation$WoUnitJoinUnit {
        return this._WoUnitJoinUnit ??= new $Message$CommonProto$WarOperation$WoUnitJoinUnit();
    }

    public checkHasWoUnitLaunchFlare(): boolean {
        return this._WoUnitLaunchFlare != null;
    }
    public getWoUnitLaunchFlare(): $Message$CommonProto$WarOperation$WoUnitLaunchFlare | null | undefined {
        return this._WoUnitLaunchFlare;
    }
    public setWoUnitLaunchFlare(value: $Message$CommonProto$WarOperation$WoUnitLaunchFlare | null | undefined): void {
        this._WoUnitLaunchFlare = value;
    }
    public createIfNotExistsWoUnitLaunchFlare(): $Message$CommonProto$WarOperation$WoUnitLaunchFlare {
        return this._WoUnitLaunchFlare ??= new $Message$CommonProto$WarOperation$WoUnitLaunchFlare();
    }

    public checkHasWoUnitLaunchSilo(): boolean {
        return this._WoUnitLaunchSilo != null;
    }
    public getWoUnitLaunchSilo(): $Message$CommonProto$WarOperation$WoUnitLaunchSilo | null | undefined {
        return this._WoUnitLaunchSilo;
    }
    public setWoUnitLaunchSilo(value: $Message$CommonProto$WarOperation$WoUnitLaunchSilo | null | undefined): void {
        this._WoUnitLaunchSilo = value;
    }
    public createIfNotExistsWoUnitLaunchSilo(): $Message$CommonProto$WarOperation$WoUnitLaunchSilo {
        return this._WoUnitLaunchSilo ??= new $Message$CommonProto$WarOperation$WoUnitLaunchSilo();
    }

    public checkHasWoUnitProduceUnit(): boolean {
        return this._WoUnitProduceUnit != null;
    }
    public getWoUnitProduceUnit(): $Message$CommonProto$WarOperation$WoUnitProduceUnit | null | undefined {
        return this._WoUnitProduceUnit;
    }
    public setWoUnitProduceUnit(value: $Message$CommonProto$WarOperation$WoUnitProduceUnit | null | undefined): void {
        this._WoUnitProduceUnit = value;
    }
    public createIfNotExistsWoUnitProduceUnit(): $Message$CommonProto$WarOperation$WoUnitProduceUnit {
        return this._WoUnitProduceUnit ??= new $Message$CommonProto$WarOperation$WoUnitProduceUnit();
    }

    public checkHasWoUnitSupplyUnit(): boolean {
        return this._WoUnitSupplyUnit != null;
    }
    public getWoUnitSupplyUnit(): $Message$CommonProto$WarOperation$WoUnitSupplyUnit | null | undefined {
        return this._WoUnitSupplyUnit;
    }
    public setWoUnitSupplyUnit(value: $Message$CommonProto$WarOperation$WoUnitSupplyUnit | null | undefined): void {
        this._WoUnitSupplyUnit = value;
    }
    public createIfNotExistsWoUnitSupplyUnit(): $Message$CommonProto$WarOperation$WoUnitSupplyUnit {
        return this._WoUnitSupplyUnit ??= new $Message$CommonProto$WarOperation$WoUnitSupplyUnit();
    }

    public checkHasWoUnitBoardedByCo(): boolean {
        return this._WoUnitBoardedByCo != null;
    }
    public getWoUnitBoardedByCo(): $Message$CommonProto$WarOperation$WoUnitBoardedByCo | null | undefined {
        return this._WoUnitBoardedByCo;
    }
    public setWoUnitBoardedByCo(value: $Message$CommonProto$WarOperation$WoUnitBoardedByCo | null | undefined): void {
        this._WoUnitBoardedByCo = value;
    }
    public createIfNotExistsWoUnitBoardedByCo(): $Message$CommonProto$WarOperation$WoUnitBoardedByCo {
        return this._WoUnitBoardedByCo ??= new $Message$CommonProto$WarOperation$WoUnitBoardedByCo();
    }

    public checkHasWoUnitUseCoSkill(): boolean {
        return this._WoUnitUseCoSkill != null;
    }
    public getWoUnitUseCoSkill(): $Message$CommonProto$WarOperation$WoUnitUseCoSkill | null | undefined {
        return this._WoUnitUseCoSkill;
    }
    public setWoUnitUseCoSkill(value: $Message$CommonProto$WarOperation$WoUnitUseCoSkill | null | undefined): void {
        this._WoUnitUseCoSkill = value;
    }
    public createIfNotExistsWoUnitUseCoSkill(): $Message$CommonProto$WarOperation$WoUnitUseCoSkill {
        return this._WoUnitUseCoSkill ??= new $Message$CommonProto$WarOperation$WoUnitUseCoSkill();
    }

    public checkHasWoUnitRepairUnit(): boolean {
        return this._WoUnitRepairUnit != null;
    }
    public getWoUnitRepairUnit(): $Message$CommonProto$WarOperation$WoUnitRepairUnit | null | undefined {
        return this._WoUnitRepairUnit;
    }
    public setWoUnitRepairUnit(value: $Message$CommonProto$WarOperation$WoUnitRepairUnit | null | undefined): void {
        this._WoUnitRepairUnit = value;
    }
    public createIfNotExistsWoUnitRepairUnit(): $Message$CommonProto$WarOperation$WoUnitRepairUnit {
        return this._WoUnitRepairUnit ??= new $Message$CommonProto$WarOperation$WoUnitRepairUnit();
    }

    public checkHasWoUnitCrushUnit(): boolean {
        return this._WoUnitCrushUnit != null;
    }
    public getWoUnitCrushUnit(): $Message$CommonProto$WarOperation$WoUnitCrushUnit | null | undefined {
        return this._WoUnitCrushUnit;
    }
    public setWoUnitCrushUnit(value: $Message$CommonProto$WarOperation$WoUnitCrushUnit | null | undefined): void {
        this._WoUnitCrushUnit = value;
    }
    public createIfNotExistsWoUnitCrushUnit(): $Message$CommonProto$WarOperation$WoUnitCrushUnit {
        return this._WoUnitCrushUnit ??= new $Message$CommonProto$WarOperation$WoUnitCrushUnit();
    }

    public checkHasWoUnitSelfDetonate(): boolean {
        return this._WoUnitSelfDetonate != null;
    }
    public getWoUnitSelfDetonate(): $Message$CommonProto$WarOperation$WoUnitSelfDetonate | null | undefined {
        return this._WoUnitSelfDetonate;
    }
    public setWoUnitSelfDetonate(value: $Message$CommonProto$WarOperation$WoUnitSelfDetonate | null | undefined): void {
        this._WoUnitSelfDetonate = value;
    }
    public createIfNotExistsWoUnitSelfDetonate(): $Message$CommonProto$WarOperation$WoUnitSelfDetonate {
        return this._WoUnitSelfDetonate ??= new $Message$CommonProto$WarOperation$WoUnitSelfDetonate();
    }
}
