import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import type * as HalfwayReplayWarInterfaceIHrwWar from "../interface/IHrwWar.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as Logger2 from "../../Logger.ts";
import * as ProtoSchemaCommonProtoStructureCommonExtraDataForWarOperation from "../../proto/schema/CommonProto/Structure/CommonExtraDataForWarOperation.ts";
import type * as ProtoSchemaCommonProtoStructureGridIndexAndPathInfo from "../../proto/schema/CommonProto/Structure/GridIndexAndPathInfo.ts";
import * as ProtoSchemaCommonProtoStructureMovingUnitAndPath from "../../proto/schema/CommonProto/Structure/MovingUnitAndPath.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as ProtoSchemaCommonProtoWarOperationWoPlayerDeleteUnit from "../../proto/schema/CommonProto/WarOperation/WoPlayerDeleteUnit.ts";
import * as ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn from "../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import * as ProtoSchemaCommonProtoWarOperationWoPlayerProduceUnit from "../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";
import * as ProtoSchemaCommonProtoWarOperationWoPlayerSurrender from "../../proto/schema/CommonProto/WarOperation/WoPlayerSurrender.ts";
import * as ProtoSchemaCommonProtoWarOperationWoPlayerUseCoSkill from "../../proto/schema/CommonProto/WarOperation/WoPlayerUseCoSkill.ts";
import * as ProtoSchemaCommonProtoWarOperationWoPlayerVoteForDraw from "../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";
import * as ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn from "../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import * as ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent from "../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import * as ProtoSchemaCommonProtoWarOperationWoSystemDestroyPlayerForce from "../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";
import * as ProtoSchemaCommonProtoWarOperationWoSystemEndTurn from "../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";
import * as ProtoSchemaCommonProtoWarOperationWoSystemEndWar from "../../proto/schema/CommonProto/WarOperation/WoSystemEndWar.ts";
import * as ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer from "../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";
import * as ProtoSchemaCommonProtoWarOperationWoSystemVoteForDraw from "../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitAttackTile from "../../proto/schema/CommonProto/WarOperation/WoUnitAttackTile.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitAttackUnit from "../../proto/schema/CommonProto/WarOperation/WoUnitAttackUnit.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitBeLoaded from "../../proto/schema/CommonProto/WarOperation/WoUnitBeLoaded.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitBoardedByCo from "../../proto/schema/CommonProto/WarOperation/WoUnitBoardedByCo.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitBuildTile from "../../proto/schema/CommonProto/WarOperation/WoUnitBuildTile.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitCaptureTile from "../../proto/schema/CommonProto/WarOperation/WoUnitCaptureTile.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitCrushUnit from "../../proto/schema/CommonProto/WarOperation/WoUnitCrushUnit.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitDive from "../../proto/schema/CommonProto/WarOperation/WoUnitDive.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitDropUnit from "../../proto/schema/CommonProto/WarOperation/WoUnitDropUnit.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitJoinUnit from "../../proto/schema/CommonProto/WarOperation/WoUnitJoinUnit.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitLaunchFlare from "../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitLaunchSilo from "../../proto/schema/CommonProto/WarOperation/WoUnitLaunchSilo.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitProduceUnit from "../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitRepairUnit from "../../proto/schema/CommonProto/WarOperation/WoUnitRepairUnit.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitSelfDetonate from "../../proto/schema/CommonProto/WarOperation/WoUnitSelfDetonate.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitSupplyUnit from "../../proto/schema/CommonProto/WarOperation/WoUnitSupplyUnit.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitSurface from "../../proto/schema/CommonProto/WarOperation/WoUnitSurface.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitUseCoSkill from "../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";
import * as ProtoSchemaCommonProtoWarOperationWoUnitWait from "../../proto/schema/CommonProto/WarOperation/WoUnitWait.ts";
import type * as ProtoSchemaCommonProtoWarSerializationCustomCounter from "../../proto/schema/CommonProto/WarSerialization/CustomCounter.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayer from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWeatherManager from "../../proto/schema/CommonProto/WarSerialization/SerialWeatherManager.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type Undefinable<T>                     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

let _war    : Undefinable<HalfwayReplayWarInterfaceIHrwWar.IHrwWar>;

export function init(): void {
    // nothing to do
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for managing war.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function loadWar(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar): Promise<HalfwayReplayWarInterfaceIHrwWar.IHrwWar> {
    if (_war) {
        Logger2.warn(`HrwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const war = new (GameHelpersGhFactory.getHrwWarClass())();
    war.init(warData, await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
    war.startRunning().startRunningView();
    _war = war;
    return _war;
}

export function unloadWar(): void {
    if (_war) {
        _war.stopRunning();
        _war = null;
    }
}

export function getWar(): Undefinable<HalfwayReplayWarInterfaceIHrwWar.IHrwWar> {
    return _war;
}

export function generateExecutedActions(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer[] {
    const halfwayReplayActionArray      = warData.getExecutedOperationManager()?.getHalfwayReplayOperationArray() ?? [];
    const actionsCount                  = halfwayReplayActionArray[0]?.getOperationArray()?.length ?? 0;
    const rearrangedHalfwayActionArray  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer[][] = new Array(actionsCount);
    const teamsCount                    = halfwayReplayActionArray.length;
    for (let i = 0; i < actionsCount; ++i) {
        const actionArrayForTeams: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer[] = new Array(teamsCount);
        for (let j = 0; j < teamsCount; ++j) {
            actionArrayForTeams[j] = HelpersMisc.getExisted(halfwayReplayActionArray[j].getOperationArray(), UtilsClientErrorCode.ClientErrorCode.HrwModel_GenerateExecutedActions_00)[i];
        }
        rearrangedHalfwayActionArray[i] = actionArrayForTeams;
    }

    const executedActionArray: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer[] = [];
    for (let i = 0; i < actionsCount; ++i) {
        const actionForTeams = rearrangedHalfwayActionArray[i];
        executedActionArray.push(ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
            operationId                 : actionForTeams[0]?.getOperationId(),
            WoPlayerDeleteUnit          : mergePlayerDeleteUnit(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoPlayerDeleteUnit())))?.toJson(),
            WoPlayerEndTurn             : mergePlayerEndTurn(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoPlayerEndTurn())))?.toJson(),
            WoPlayerProduceUnit         : mergePlayerProduceUnit(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoPlayerProduceUnit())))?.toJson(),
            WoPlayerSurrender           : mergePlayerSurrender(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoPlayerSurrender())))?.toJson(),
            WoPlayerUseCoSkill          : mergePlayerUseCoSkill(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoPlayerUseCoSkill())))?.toJson(),
            WoPlayerVoteForDraw         : mergePlayerVoteForDraw(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoPlayerVoteForDraw())))?.toJson(),
            WoSystemBeginTurn           : mergeSystemBeginTurn(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoSystemBeginTurn())))?.toJson(),
            WoSystemCallWarEvent        : mergeSystemCallWarEvent(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoSystemCallWarEvent())))?.toJson(),
            WoSystemDestroyPlayerForce  : mergeSystemDestroyPlayerForce(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoSystemDestroyPlayerForce())))?.toJson(),
            WoSystemEndTurn             : mergeSystemEndTurn(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoSystemEndTurn())))?.toJson(),
            WoSystemEndWar              : mergeSystemEndWar(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoSystemEndWar())))?.toJson(),
            WoSystemHandleBootPlayer    : mergeSystemHandleBootPlayer(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoSystemHandleBootPlayer())))?.toJson(),
            WoSystemVoteForDraw         : mergeSystemVoteForDraw(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoSystemVoteForDraw())))?.toJson(),
            WoUnitAttackTile            : mergeUnitAttackTile(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitAttackTile())))?.toJson(),
            WoUnitAttackUnit            : mergeUnitAttackUnit(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitAttackUnit())))?.toJson(),
            WoUnitBeLoaded              : mergeUnitBeLoaded(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitBeLoaded())))?.toJson(),
            WoUnitBuildTile             : mergeUnitBuildTile(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitBuildTile())))?.toJson(),
            WoUnitCaptureTile           : mergeUnitCaptureTile(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitCaptureTile())))?.toJson(),
            WoUnitCrushUnit             : mergeUnitCrushUnit(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitCrushUnit())))?.toJson(),
            WoUnitDive                  : mergeUnitDive(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitDive())))?.toJson(),
            WoUnitDropUnit              : mergeUnitDropUnit(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitDropUnit())))?.toJson(),
            WoUnitJoinUnit              : mergeUnitJoinUnit(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitJoinUnit())))?.toJson(),
            WoUnitLaunchFlare           : mergeUnitLaunchFlare(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitLaunchFlare())))?.toJson(),
            WoUnitLaunchSilo            : mergeUnitLaunchSilo(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitLaunchSilo())))?.toJson(),
            WoUnitBoardedByCo           : mergeUnitBoardedByCo(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitBoardedByCo())))?.toJson(),
            WoUnitProduceUnit           : mergeUnitProduceUnit(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitProduceUnit())))?.toJson(),
            WoUnitRepairUnit            : mergeUnitRepairUnit(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitRepairUnit())))?.toJson(),
            WoUnitSelfDetonate          : mergeUnitSelfDetonate(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitSelfDetonate())))?.toJson(),
            WoUnitSupplyUnit            : mergeUnitSupplyUnit(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitSupplyUnit())))?.toJson(),
            WoUnitSurface               : mergeUnitSurface(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitSurface())))?.toJson(),
            WoUnitUseCoSkill            : mergeUnitUseCoSkill(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitUseCoSkill())))?.toJson(),
            WoUnitWait                  : mergeUnitWait(HelpersCollection.getNonNullElements(actionForTeams.map(v => v.getWoUnitWait())))?.toJson(),
        }));
    }

    return executedActionArray;
}

function mergePlayerDeleteUnit(actionArray: ProtoSchemaCommonProtoWarOperationWoPlayerDeleteUnit.WoPlayerDeleteUnit[]): ProtoSchemaCommonProtoWarOperationWoPlayerDeleteUnit.WoPlayerDeleteUnit | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoPlayerDeleteUnit.WoPlayerDeleteUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergePlayerEndTurn(actionArray: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn[]): ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergePlayerProduceUnit(actionArray: ProtoSchemaCommonProtoWarOperationWoPlayerProduceUnit.WoPlayerProduceUnit[]): ProtoSchemaCommonProtoWarOperationWoPlayerProduceUnit.WoPlayerProduceUnit | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoPlayerProduceUnit.WoPlayerProduceUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergePlayerSurrender(actionArray: ProtoSchemaCommonProtoWarOperationWoPlayerSurrender.WoPlayerSurrender[]): ProtoSchemaCommonProtoWarOperationWoPlayerSurrender.WoPlayerSurrender | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoPlayerSurrender.WoPlayerSurrender.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergePlayerUseCoSkill(actionArray: ProtoSchemaCommonProtoWarOperationWoPlayerUseCoSkill.WoPlayerUseCoSkill[]): ProtoSchemaCommonProtoWarOperationWoPlayerUseCoSkill.WoPlayerUseCoSkill | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoPlayerUseCoSkill.WoPlayerUseCoSkill.fromJson({
            targetGridIndexArray    : actionArray[0].getTargetGridIndexArray().map(v => v.toJson()),
            extraData               : {
                commonExtraData         : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                skillDataArray          : actionArray[0].getExtraData()?.getSkillDataArray().map(v => v.toJson()) ?? [],
                skillType               : actionArray[0].getExtraData()?.getSkillType(),
                targetGridIndexArray    : [],
            },
        })
        : null;
}
function mergePlayerVoteForDraw(actionArray: ProtoSchemaCommonProtoWarOperationWoPlayerVoteForDraw.WoPlayerVoteForDraw[]): ProtoSchemaCommonProtoWarOperationWoPlayerVoteForDraw.WoPlayerVoteForDraw | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoPlayerVoteForDraw.WoPlayerVoteForDraw.fromJson({
            extraData: {
                commonExtraData : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                isAgree         : actionArray[0].getExtraData()?.getIsAgree(),
            },
        })
        : null;
}
function mergeSystemBeginTurn(actionArray: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn[]): ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeSystemCallWarEvent(actionArray: ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent.WoSystemCallWarEvent[]): ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent.WoSystemCallWarEvent | null {
    if (!actionArray.length) {
        return null;
    }

    const action = actionArray[0];
    return ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent.WoSystemCallWarEvent.fromJson({
        warEventId          : action.getWarEventId(),
        nodeAndActionsIndex : action.getNodeAndActionsIndex(),
        extraData           : {
            commonExtraData         : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            // deprecatedWarEventId    : action.getExtraData()?.getDeprecatedWarEventId(),
        },
    });
}
function mergeSystemDestroyPlayerForce(actionArray: ProtoSchemaCommonProtoWarOperationWoSystemDestroyPlayerForce.WoSystemDestroyPlayerForce[]): ProtoSchemaCommonProtoWarOperationWoSystemDestroyPlayerForce.WoSystemDestroyPlayerForce | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoSystemDestroyPlayerForce.WoSystemDestroyPlayerForce.fromJson({
            extraData: {
                commonExtraData     : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetPlayerIndex   : actionArray[0].getExtraData()?.getTargetPlayerIndex(),
            },
        })
        : null;
}
function mergeSystemEndTurn(actionArray: ProtoSchemaCommonProtoWarOperationWoSystemEndTurn.WoSystemEndTurn[]): ProtoSchemaCommonProtoWarOperationWoSystemEndTurn.WoSystemEndTurn | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoSystemEndTurn.WoSystemEndTurn.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeSystemEndWar(actionArray: ProtoSchemaCommonProtoWarOperationWoSystemEndWar.WoSystemEndWar[]): ProtoSchemaCommonProtoWarOperationWoSystemEndWar.WoSystemEndWar | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoSystemEndWar.WoSystemEndWar.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeSystemHandleBootPlayer(actionArray: ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer.WoSystemHandleBootPlayer[]): ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer.WoSystemHandleBootPlayer | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer.WoSystemHandleBootPlayer.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeSystemVoteForDraw(actionArray: ProtoSchemaCommonProtoWarOperationWoSystemVoteForDraw.WoSystemVoteForDraw[]): ProtoSchemaCommonProtoWarOperationWoSystemVoteForDraw.WoSystemVoteForDraw | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoSystemVoteForDraw.WoSystemVoteForDraw.fromJson({
            extraData: {
                commonExtraData : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                isAgree         : actionArray[0].getExtraData()?.getIsAgree(),
            },
        })
        : null;
}
function mergeUnitAttackTile(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitAttackTile.WoUnitAttackTile[]): ProtoSchemaCommonProtoWarOperationWoUnitAttackTile.WoUnitAttackTile | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitAttackTile.WoUnitAttackTile.fromJson({
            extraData: {
                commonExtraData : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetGridIndex : actionArray[0].getExtraData()?.getTargetGridIndex()?.toJson(),
            },
        })
        : null;
}
function mergeUnitAttackUnit(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitAttackUnit.WoUnitAttackUnit[]): ProtoSchemaCommonProtoWarOperationWoUnitAttackUnit.WoUnitAttackUnit | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitAttackUnit.WoUnitAttackUnit.fromJson({
            extraData: {
                commonExtraData : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetGridIndex : actionArray[0].getExtraData()?.getTargetGridIndex()?.toJson(),
            },
        })
        : null;
}
function mergeUnitBeLoaded(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitBeLoaded.WoUnitBeLoaded[]): ProtoSchemaCommonProtoWarOperationWoUnitBeLoaded.WoUnitBeLoaded | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitBeLoaded.WoUnitBeLoaded.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitBuildTile(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitBuildTile.WoUnitBuildTile[]): ProtoSchemaCommonProtoWarOperationWoUnitBuildTile.WoUnitBuildTile | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitBuildTile.WoUnitBuildTile.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitCaptureTile(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitCaptureTile.WoUnitCaptureTile[]): ProtoSchemaCommonProtoWarOperationWoUnitCaptureTile.WoUnitCaptureTile | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitCaptureTile.WoUnitCaptureTile.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitCrushUnit(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitCrushUnit.WoUnitCrushUnit[]): ProtoSchemaCommonProtoWarOperationWoUnitCrushUnit.WoUnitCrushUnit | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitCrushUnit.WoUnitCrushUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitDive(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitDive.WoUnitDive[]): ProtoSchemaCommonProtoWarOperationWoUnitDive.WoUnitDive | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitDive.WoUnitDive.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitDropUnit(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitDropUnit.WoUnitDropUnit[]): ProtoSchemaCommonProtoWarOperationWoUnitDropUnit.WoUnitDropUnit | null {
    if (!actionArray.length) {
        return null;
    }

    const droppingUnitAndPathArrays: ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath[][] = [];
    for (const action of actionArray) {
        for (const data of action.getExtraData()?.getDroppingUnitAndPathArray() ?? []) {
            const unit          = data.getUnit();
            const unitId        = unit ? unit.getUnitId() : null;
            const existingArray = droppingUnitAndPathArrays.find(v => {
                const u = v[0]?.getUnit();
                return (u ? u.getUnitId() : null) === unitId;
            });
            if (existingArray) {
                existingArray.push(data);
            } else {
                droppingUnitAndPathArrays.push([data]);
            }
        }
    }

    return ProtoSchemaCommonProtoWarOperationWoUnitDropUnit.WoUnitDropUnit.fromJson({
        dropDestinations    : [],
        extraData           : {
            commonExtraData             : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            isDropBlocked               : actionArray[0].getExtraData()?.getIsDropBlocked(),
            droppingUnitAndPathArray    : HelpersCollection.getNonNullElements(droppingUnitAndPathArrays.map(v => mergeMovingUnitAndPathArray(v))).map(v => v.toJson()),
        },
    });
}
function mergeUnitJoinUnit(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitJoinUnit.WoUnitJoinUnit[]): ProtoSchemaCommonProtoWarOperationWoUnitJoinUnit.WoUnitJoinUnit | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitJoinUnit.WoUnitJoinUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitLaunchFlare(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitLaunchFlare.WoUnitLaunchFlare[]): ProtoSchemaCommonProtoWarOperationWoUnitLaunchFlare.WoUnitLaunchFlare | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitLaunchFlare.WoUnitLaunchFlare.fromJson({
            extraData: {
                commonExtraData     : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetGridIndex     : actionArray[0].getExtraData()?.getTargetGridIndex()?.toJson(),
                flareRadius         : actionArray[0].getExtraData()?.getFlareRadius(),
            },
        })
        : null;
}
function mergeUnitLaunchSilo(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitLaunchSilo.WoUnitLaunchSilo[]): ProtoSchemaCommonProtoWarOperationWoUnitLaunchSilo.WoUnitLaunchSilo | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitLaunchSilo.WoUnitLaunchSilo.fromJson({
            extraData: {
                commonExtraData     : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetGridIndex     : actionArray[0].getExtraData()?.getTargetGridIndex()?.toJson(),
            },
        })
        : null;
}
function mergeUnitBoardedByCo(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitBoardedByCo.WoUnitBoardedByCo[]): ProtoSchemaCommonProtoWarOperationWoUnitBoardedByCo.WoUnitBoardedByCo | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitBoardedByCo.WoUnitBoardedByCo.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitProduceUnit(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitProduceUnit.WoUnitProduceUnit[]): ProtoSchemaCommonProtoWarOperationWoUnitProduceUnit.WoUnitProduceUnit | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitProduceUnit.WoUnitProduceUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitRepairUnit(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitRepairUnit.WoUnitRepairUnit[]): ProtoSchemaCommonProtoWarOperationWoUnitRepairUnit.WoUnitRepairUnit | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitRepairUnit.WoUnitRepairUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitSelfDetonate(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitSelfDetonate.WoUnitSelfDetonate[]): ProtoSchemaCommonProtoWarOperationWoUnitSelfDetonate.WoUnitSelfDetonate | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitSelfDetonate.WoUnitSelfDetonate.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitSupplyUnit(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitSupplyUnit.WoUnitSupplyUnit[]): ProtoSchemaCommonProtoWarOperationWoUnitSupplyUnit.WoUnitSupplyUnit | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitSupplyUnit.WoUnitSupplyUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitSurface(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitSurface.WoUnitSurface[]): ProtoSchemaCommonProtoWarOperationWoUnitSurface.WoUnitSurface | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitSurface.WoUnitSurface.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitUseCoSkill(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitUseCoSkill.WoUnitUseCoSkill[]): ProtoSchemaCommonProtoWarOperationWoUnitUseCoSkill.WoUnitUseCoSkill | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitUseCoSkill.WoUnitUseCoSkill.fromJson({
            targetGridIndexArray    : actionArray[0].getTargetGridIndexArray().map(v => v.toJson()),
            extraData               : {
                commonExtraData         : mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                skillDataArray          : actionArray[0].getExtraData()?.getSkillDataArray().map(v => v.toJson()) ?? [],
                skillType               : actionArray[0].getExtraData()?.getSkillType(),
                targetGridIndexArray    : [],
            },
        })
        : null;
}
function mergeUnitWait(actionArray: ProtoSchemaCommonProtoWarOperationWoUnitWait.WoUnitWait[]): ProtoSchemaCommonProtoWarOperationWoUnitWait.WoUnitWait | null {
    return actionArray.length
        ? ProtoSchemaCommonProtoWarOperationWoUnitWait.WoUnitWait.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => HelpersMisc.getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}

function mergeCommonExtraData(dataArray: ProtoSchemaCommonProtoStructureCommonExtraDataForWarOperation.CommonExtraDataForWarOperation[]): ProtoSchemaCommonProtoStructureCommonExtraDataForWarOperation.CommonExtraDataForWarOperation {
    let nextUnitId                                  : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    let weatherManager                              : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWeatherManager.SerialWeatherManager>;
    const destroyedUnitIdArray                      : number[] = [];
    const customCounterArray                        : ProtoSchemaCommonProtoWarSerializationCustomCounter.CustomCounter[] = [];
    const hiddenUnitIdArray                         : number[] = [];
    const tileArrayAfterAction                      : ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile[] = [];
    const unitArrayAfterAction                      : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[] = [];
    const playerArrayAfterAction                    : ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[] = [];
    const visibilityArrayFromPathsAfterAction       : number[] = [];
    const unitMovePathVisibilitySetAfterWarEvent    = new Set<number>();
    const movingUnitAndPathArray                    : ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath[] = [];
    for (const extraData of dataArray) {
        nextUnitId      ??= extraData.getNextUnitId();
        weatherManager  ??= extraData.getWeatherManager();
        mergeDestroyedUnitIdArray(extraData.getDestroyedUnitIdArray(), destroyedUnitIdArray);
        mergeCustomCounterArray(extraData.getCustomCounterArray(), customCounterArray);
        mergeHiddenUnitIdArray(extraData.getHiddenUnitIdArray(), hiddenUnitIdArray);
        mergeTileArrayAfterAction(extraData.getTileArrayAfterAction(), tileArrayAfterAction);
        mergeUnitArrayAfterAction(extraData.getUnitArrayAfterAction(), unitArrayAfterAction);
        mergePlayerArrayAfterAction(extraData.getPlayerArrayAfterAction(), playerArrayAfterAction);
        mergeVisibilityArrayFromPathsAfterAction(extraData.getVisibilityArrayFromPathsAfterAction(), visibilityArrayFromPathsAfterAction);
        mergeUnitMovePathVisibilityAfterWarEvent(extraData.getVisibilityArrayFromPathsAfterWarEvent(), unitMovePathVisibilitySetAfterWarEvent);
        {
            const movingUnitAndPath = extraData.getMovingUnitAndPath();
            if (movingUnitAndPath) {
                movingUnitAndPathArray.push(movingUnitAndPath);
            }
        }
    }

    return ProtoSchemaCommonProtoStructureCommonExtraDataForWarOperation.CommonExtraDataForWarOperation.fromJson({
        nextUnitId                              : nextUnitId,
        weatherManager                          : weatherManager?.toJson(),
        destroyedUnitIdArray                    : destroyedUnitIdArray,
        customCounterArray                      : customCounterArray.map(v => v.toJson()),
        hiddenUnitIdArray                       : hiddenUnitIdArray,
        tileArrayAfterAction                    : tileArrayAfterAction.map(v => v.toJson()),
        unitArrayAfterAction                    : unitArrayAfterAction.map(v => v.toJson()),
        playerArrayAfterAction                  : playerArrayAfterAction.map(v => v.toJson()),
        visibilityArrayFromPathsAfterAction     : visibilityArrayFromPathsAfterAction,
        visibilityArrayFromPathsAfterWarEvent   : [...unitMovePathVisibilitySetAfterWarEvent],
        movingUnitAndPath                       : mergeMovingUnitAndPathArray(movingUnitAndPathArray)?.toJson(),
        taskObjectiveStateArray                 : [],
    });
}
function mergeDestroyedUnitIdArray(src: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>, dst: number[]): void {
    for (const id of src ?? []) {
        if (dst.indexOf(id) < 0) {
            dst.push(id);
        }
    }
}
function mergeCustomCounterArray(src: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationCustomCounter.CustomCounter[]>, dst: ProtoSchemaCommonProtoWarSerializationCustomCounter.CustomCounter[]): void {
    for (const srcData of src ?? []) {
        const id            = srcData.getCustomCounterId() ?? 0;
        const existingData  = dst.find(v => (v.getCustomCounterId() ?? 0) === id);
        if (existingData) {
            existingData.setValue(srcData.getValue());
        } else {
            dst.push(srcData);
        }
    }
}
function mergeHiddenUnitIdArray(src: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>, dst: number[]): void {
    for (const id of src ?? []) {
        if (dst.indexOf(id) < 0) {
            dst.push(id);
        }
    }
}
function mergeTileArrayAfterAction(src: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile[]>, dst: ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile[]): void {
    for (const tileData of src ?? []) {
        const gridIndex = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.HrwModel_MergeTileArrayAfterAction_00);
        if (!dst.find(v => AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v.getGridIndex())?.checkIsEqual(gridIndex))) {
            dst.push(tileData);
        }
    }
}
function mergeUnitArrayAfterAction(src: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[]>, dst: ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[]): void {
    for (const unitData of src ?? []) {
        if (!dst.find(v => v.getUnitId() === unitData.getUnitId())) {
            dst.push(unitData);
        }
    }
}
function mergePlayerArrayAfterAction(src: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[]>, dst: ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[]): void {
    for (const playerData of src ?? []) {
        const existingPlayerData = dst.find(v => v.getPlayerIndex() == playerData.getPlayerIndex());
        if (!existingPlayerData) {
            dst.push(playerData);
        } else {
            if (existingPlayerData.getFund() === 0) {
                existingPlayerData.setFund(playerData.getFund());
            }
        }
    }
}
function mergeVisibilityArrayFromPathsAfterAction(src: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>, dst: number[]): void {
    for (const id of src ?? []) {
        if (dst.indexOf(id) < 0) {
            dst.push(id);
        }
    }
}
function mergeUnitMovePathVisibilityAfterWarEvent(src: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>, dst: Set<number>): void {
    for (const id of src ?? []) {
        dst.add(id);
    }
}
function mergeMovingUnitAndPathArray(array: ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath[]): ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath | null {
    for (;;) {
        let isUpdated = false;
        for (let i = 0; i < array.length; ++i) {
            for (let j = i + 1; j < array.length; ++j) {
                const mergedData = mergeMovingUnitAndPath(array[i], array[j]);
                if (mergedData) {
                    array.splice(j, 1);
                    array.splice(i, 1, mergedData);
                    isUpdated = true;
                }
            }
        }
        if (!isUpdated) {
            break;
        }
    }

    const length = array.length;
    if (length <= 1) {
        return array[0] ?? null;
    } else {
        array.sort((v1, v2) => {
            const path1     = HelpersMisc.getExisted(v1.getPath(), UtilsClientErrorCode.ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_00);
            const path2     = HelpersMisc.getExisted(v2.getPath(), UtilsClientErrorCode.ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_01);
            const lastNode1 = path1[path1.length - 1];
            const lastNode2 = path2[path2.length - 1];
            if (lastNode1.getIsVisible()) {
                return 1;
            } else if (lastNode2.getIsVisible()) {
                return -1;
            }

            const firstGridIndex1   = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(path1[0].getGridIndex()), UtilsClientErrorCode.ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_02);
            const firstGridIndex2   = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(path2[0].getGridIndex()), UtilsClientErrorCode.ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_03);
            const lastGridIndex1    = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(lastNode1.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_04);
            const lastGridIndex2    = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(lastNode2.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_05);
            if (firstGridIndex1.checkIsAdjacent(lastGridIndex2)) {
                return 1;
            } else if (firstGridIndex2.checkIsAdjacent(lastGridIndex1)) {
                return -1;
            } else {
                // 无法判断路径顺序
                return 1;
            }
        });
        const mergedPath: ProtoSchemaCommonProtoStructureGridIndexAndPathInfo.GridIndexAndPathInfo[] = [];
        for (const data of array) {
            for (const pathNode of data.getPath()) {
                mergedPath.push(pathNode);
            }
        }
        return ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath.fromJson({
            unit    : array[0].getUnit()?.toJson(),
            path    : mergedPath.map(v => v.toJson()),
        });
    }
}
function mergeMovingUnitAndPath(data1: ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath, data2: ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath): ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath | null {
    const unit1 = data1.getUnit();
    const path1 = data1.getPath();
    if ((unit1 == null) || (path1 == null) || (!path1.length)) {
        return data2;
    }

    const unit2 = data2.getUnit();
    const path2 = data2.getPath();
    if ((unit2 == null) || (path2 == null) || (!path2.length)) {
        return data1;
    }

    const length1 = path1.length;
    const length2 = path2.length;
    for (let index1 = 0; index1 < length1; ++index1) {
        const node1         = path1[index1];
        const gridIndex1    = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(node1.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.HrwModel_MergeMovingUnitAndPath_00);
        for (let index2 = 0; index2 < length2; ++index2) {
            const node2         = path2[index2];
            const gridIndex2    = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(node2.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.HrwModel_MergeMovingUnitAndPath_01);

            if (gridIndex1.checkIsEqual(gridIndex2)) {
                const dstPath = path1.map(v => v.clone());
                const srcPath = path2;
                for (let i = 0; ; ++i) {
                    const srcNode = srcPath[index2 + i];
                    if (srcNode == null) {
                        break;
                    }

                    const dstIndex  = index1 + i;
                    const dstNode   = dstPath[dstIndex];
                    if (dstNode == null) {
                        dstPath[dstIndex] = srcNode.clone();
                    } else {
                        dstNode.setIsBlocked(dstNode.getIsBlocked() || srcNode.getIsBlocked());
                        dstNode.setIsVisible(dstNode.getIsVisible() || srcNode.getIsVisible());
                    }
                }

                return ProtoSchemaCommonProtoStructureMovingUnitAndPath.MovingUnitAndPath.fromJson({
                    unit    : unit1.clone().toJson(),
                    path    : dstPath.map(v => v.toJson()),
                });
            }
        }
    }

    return null;
}
