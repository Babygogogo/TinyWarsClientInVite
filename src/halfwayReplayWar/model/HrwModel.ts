import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getHrwWarClass } from "../../gameHelpers/GhFactory.ts";
import type { IHrwWar } from "../interface/IHrwWar.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { warn } from "../../Logger.ts";
import { CommonExtraDataForWarOperation } from "../../proto/schema/CommonProto/Structure/CommonExtraDataForWarOperation.ts";
import type { GridIndexAndPathInfo } from "../../proto/schema/CommonProto/Structure/GridIndexAndPathInfo.ts";
import { MovingUnitAndPath } from "../../proto/schema/CommonProto/Structure/MovingUnitAndPath.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { WoPlayerDeleteUnit } from "../../proto/schema/CommonProto/WarOperation/WoPlayerDeleteUnit.ts";
import { WoPlayerEndTurn } from "../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import { WoPlayerProduceUnit } from "../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";
import { WoPlayerSurrender } from "../../proto/schema/CommonProto/WarOperation/WoPlayerSurrender.ts";
import { WoPlayerUseCoSkill } from "../../proto/schema/CommonProto/WarOperation/WoPlayerUseCoSkill.ts";
import { WoPlayerVoteForDraw } from "../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";
import { WoSystemBeginTurn } from "../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import { WoSystemCallWarEvent } from "../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import { WoSystemDestroyPlayerForce } from "../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";
import { WoSystemEndTurn } from "../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";
import { WoSystemEndWar } from "../../proto/schema/CommonProto/WarOperation/WoSystemEndWar.ts";
import { WoSystemHandleBootPlayer } from "../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";
import { WoSystemVoteForDraw } from "../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";
import { WoUnitAttackTile } from "../../proto/schema/CommonProto/WarOperation/WoUnitAttackTile.ts";
import { WoUnitAttackUnit } from "../../proto/schema/CommonProto/WarOperation/WoUnitAttackUnit.ts";
import { WoUnitBeLoaded } from "../../proto/schema/CommonProto/WarOperation/WoUnitBeLoaded.ts";
import { WoUnitBoardedByCo } from "../../proto/schema/CommonProto/WarOperation/WoUnitBoardedByCo.ts";
import { WoUnitBuildTile } from "../../proto/schema/CommonProto/WarOperation/WoUnitBuildTile.ts";
import { WoUnitCaptureTile } from "../../proto/schema/CommonProto/WarOperation/WoUnitCaptureTile.ts";
import { WoUnitCrushUnit } from "../../proto/schema/CommonProto/WarOperation/WoUnitCrushUnit.ts";
import { WoUnitDive } from "../../proto/schema/CommonProto/WarOperation/WoUnitDive.ts";
import { WoUnitDropUnit } from "../../proto/schema/CommonProto/WarOperation/WoUnitDropUnit.ts";
import { WoUnitJoinUnit } from "../../proto/schema/CommonProto/WarOperation/WoUnitJoinUnit.ts";
import { WoUnitLaunchFlare } from "../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";
import { WoUnitLaunchSilo } from "../../proto/schema/CommonProto/WarOperation/WoUnitLaunchSilo.ts";
import { WoUnitProduceUnit } from "../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";
import { WoUnitRepairUnit } from "../../proto/schema/CommonProto/WarOperation/WoUnitRepairUnit.ts";
import { WoUnitSelfDetonate } from "../../proto/schema/CommonProto/WarOperation/WoUnitSelfDetonate.ts";
import { WoUnitSupplyUnit } from "../../proto/schema/CommonProto/WarOperation/WoUnitSupplyUnit.ts";
import { WoUnitSurface } from "../../proto/schema/CommonProto/WarOperation/WoUnitSurface.ts";
import { WoUnitUseCoSkill } from "../../proto/schema/CommonProto/WarOperation/WoUnitUseCoSkill.ts";
import { WoUnitWait } from "../../proto/schema/CommonProto/WarOperation/WoUnitWait.ts";
import type { CustomCounter } from "../../proto/schema/CommonProto/WarSerialization/CustomCounter.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SerialWeatherManager } from "../../proto/schema/CommonProto/WarSerialization/SerialWeatherManager.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

let _war    : Undefinable<IHrwWar>;

export function init(): void {
    // nothing to do
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for managing war.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function loadWar(warData: SerialWar): Promise<IHrwWar> {
    if (_war) {
        warn(`HrwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const war = new (getHrwWarClass())();
    war.init(warData, await getGameConfig(getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
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

export function getWar(): Undefinable<IHrwWar> {
    return _war;
}

export function generateExecutedActions(warData: SerialWar): WoContainer[] {
    const halfwayReplayActionArray      = warData.getExecutedOperationManager()?.getHalfwayReplayOperationArray() ?? [];
    const actionsCount                  = halfwayReplayActionArray[0]?.getOperationArray()?.length ?? 0;
    const rearrangedHalfwayActionArray  : WoContainer[][] = new Array(actionsCount);
    const teamsCount                    = halfwayReplayActionArray.length;
    for (let i = 0; i < actionsCount; ++i) {
        const actionArrayForTeams: WoContainer[] = new Array(teamsCount);
        for (let j = 0; j < teamsCount; ++j) {
            actionArrayForTeams[j] = getExisted(halfwayReplayActionArray[j].getOperationArray(), ClientErrorCode.HrwModel_GenerateExecutedActions_00)[i];
        }
        rearrangedHalfwayActionArray[i] = actionArrayForTeams;
    }

    const executedActionArray: WoContainer[] = [];
    for (let i = 0; i < actionsCount; ++i) {
        const actionForTeams = rearrangedHalfwayActionArray[i];
        executedActionArray.push(WoContainer.fromJson({
            operationId                 : actionForTeams[0]?.getOperationId(),
            WoPlayerDeleteUnit          : mergePlayerDeleteUnit(getNonNullElements(actionForTeams.map(v => v.getWoPlayerDeleteUnit())))?.toJson(),
            WoPlayerEndTurn             : mergePlayerEndTurn(getNonNullElements(actionForTeams.map(v => v.getWoPlayerEndTurn())))?.toJson(),
            WoPlayerProduceUnit         : mergePlayerProduceUnit(getNonNullElements(actionForTeams.map(v => v.getWoPlayerProduceUnit())))?.toJson(),
            WoPlayerSurrender           : mergePlayerSurrender(getNonNullElements(actionForTeams.map(v => v.getWoPlayerSurrender())))?.toJson(),
            WoPlayerUseCoSkill          : mergePlayerUseCoSkill(getNonNullElements(actionForTeams.map(v => v.getWoPlayerUseCoSkill())))?.toJson(),
            WoPlayerVoteForDraw         : mergePlayerVoteForDraw(getNonNullElements(actionForTeams.map(v => v.getWoPlayerVoteForDraw())))?.toJson(),
            WoSystemBeginTurn           : mergeSystemBeginTurn(getNonNullElements(actionForTeams.map(v => v.getWoSystemBeginTurn())))?.toJson(),
            WoSystemCallWarEvent        : mergeSystemCallWarEvent(getNonNullElements(actionForTeams.map(v => v.getWoSystemCallWarEvent())))?.toJson(),
            WoSystemDestroyPlayerForce  : mergeSystemDestroyPlayerForce(getNonNullElements(actionForTeams.map(v => v.getWoSystemDestroyPlayerForce())))?.toJson(),
            WoSystemEndTurn             : mergeSystemEndTurn(getNonNullElements(actionForTeams.map(v => v.getWoSystemEndTurn())))?.toJson(),
            WoSystemEndWar              : mergeSystemEndWar(getNonNullElements(actionForTeams.map(v => v.getWoSystemEndWar())))?.toJson(),
            WoSystemHandleBootPlayer    : mergeSystemHandleBootPlayer(getNonNullElements(actionForTeams.map(v => v.getWoSystemHandleBootPlayer())))?.toJson(),
            WoSystemVoteForDraw         : mergeSystemVoteForDraw(getNonNullElements(actionForTeams.map(v => v.getWoSystemVoteForDraw())))?.toJson(),
            WoUnitAttackTile            : mergeUnitAttackTile(getNonNullElements(actionForTeams.map(v => v.getWoUnitAttackTile())))?.toJson(),
            WoUnitAttackUnit            : mergeUnitAttackUnit(getNonNullElements(actionForTeams.map(v => v.getWoUnitAttackUnit())))?.toJson(),
            WoUnitBeLoaded              : mergeUnitBeLoaded(getNonNullElements(actionForTeams.map(v => v.getWoUnitBeLoaded())))?.toJson(),
            WoUnitBuildTile             : mergeUnitBuildTile(getNonNullElements(actionForTeams.map(v => v.getWoUnitBuildTile())))?.toJson(),
            WoUnitCaptureTile           : mergeUnitCaptureTile(getNonNullElements(actionForTeams.map(v => v.getWoUnitCaptureTile())))?.toJson(),
            WoUnitCrushUnit             : mergeUnitCrushUnit(getNonNullElements(actionForTeams.map(v => v.getWoUnitCrushUnit())))?.toJson(),
            WoUnitDive                  : mergeUnitDive(getNonNullElements(actionForTeams.map(v => v.getWoUnitDive())))?.toJson(),
            WoUnitDropUnit              : mergeUnitDropUnit(getNonNullElements(actionForTeams.map(v => v.getWoUnitDropUnit())))?.toJson(),
            WoUnitJoinUnit              : mergeUnitJoinUnit(getNonNullElements(actionForTeams.map(v => v.getWoUnitJoinUnit())))?.toJson(),
            WoUnitLaunchFlare           : mergeUnitLaunchFlare(getNonNullElements(actionForTeams.map(v => v.getWoUnitLaunchFlare())))?.toJson(),
            WoUnitLaunchSilo            : mergeUnitLaunchSilo(getNonNullElements(actionForTeams.map(v => v.getWoUnitLaunchSilo())))?.toJson(),
            WoUnitBoardedByCo           : mergeUnitBoardedByCo(getNonNullElements(actionForTeams.map(v => v.getWoUnitBoardedByCo())))?.toJson(),
            WoUnitProduceUnit           : mergeUnitProduceUnit(getNonNullElements(actionForTeams.map(v => v.getWoUnitProduceUnit())))?.toJson(),
            WoUnitRepairUnit            : mergeUnitRepairUnit(getNonNullElements(actionForTeams.map(v => v.getWoUnitRepairUnit())))?.toJson(),
            WoUnitSelfDetonate          : mergeUnitSelfDetonate(getNonNullElements(actionForTeams.map(v => v.getWoUnitSelfDetonate())))?.toJson(),
            WoUnitSupplyUnit            : mergeUnitSupplyUnit(getNonNullElements(actionForTeams.map(v => v.getWoUnitSupplyUnit())))?.toJson(),
            WoUnitSurface               : mergeUnitSurface(getNonNullElements(actionForTeams.map(v => v.getWoUnitSurface())))?.toJson(),
            WoUnitUseCoSkill            : mergeUnitUseCoSkill(getNonNullElements(actionForTeams.map(v => v.getWoUnitUseCoSkill())))?.toJson(),
            WoUnitWait                  : mergeUnitWait(getNonNullElements(actionForTeams.map(v => v.getWoUnitWait())))?.toJson(),
        }));
    }

    return executedActionArray;
}

function mergePlayerDeleteUnit(actionArray: WoPlayerDeleteUnit[]): WoPlayerDeleteUnit | null {
    return actionArray.length
        ? WoPlayerDeleteUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergePlayerEndTurn(actionArray: WoPlayerEndTurn[]): WoPlayerEndTurn | null {
    return actionArray.length
        ? WoPlayerEndTurn.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergePlayerProduceUnit(actionArray: WoPlayerProduceUnit[]): WoPlayerProduceUnit | null {
    return actionArray.length
        ? WoPlayerProduceUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergePlayerSurrender(actionArray: WoPlayerSurrender[]): WoPlayerSurrender | null {
    return actionArray.length
        ? WoPlayerSurrender.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergePlayerUseCoSkill(actionArray: WoPlayerUseCoSkill[]): WoPlayerUseCoSkill | null {
    return actionArray.length
        ? WoPlayerUseCoSkill.fromJson({
            targetGridIndexArray    : actionArray[0].getTargetGridIndexArray().map(v => v.toJson()),
            extraData               : {
                commonExtraData         : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                skillDataArray          : actionArray[0].getExtraData()?.getSkillDataArray().map(v => v.toJson()) ?? [],
                skillType               : actionArray[0].getExtraData()?.getSkillType(),
                targetGridIndexArray    : [],
            },
        })
        : null;
}
function mergePlayerVoteForDraw(actionArray: WoPlayerVoteForDraw[]): WoPlayerVoteForDraw | null {
    return actionArray.length
        ? WoPlayerVoteForDraw.fromJson({
            extraData: {
                commonExtraData : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                isAgree         : actionArray[0].getExtraData()?.getIsAgree(),
            },
        })
        : null;
}
function mergeSystemBeginTurn(actionArray: WoSystemBeginTurn[]): WoSystemBeginTurn | null {
    return actionArray.length
        ? WoSystemBeginTurn.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeSystemCallWarEvent(actionArray: WoSystemCallWarEvent[]): WoSystemCallWarEvent | null {
    if (!actionArray.length) {
        return null;
    }

    const action = actionArray[0];
    return WoSystemCallWarEvent.fromJson({
        warEventId          : action.getWarEventId(),
        nodeAndActionsIndex : action.getNodeAndActionsIndex(),
        extraData           : {
            commonExtraData         : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            // deprecatedWarEventId    : action.getExtraData()?.getDeprecatedWarEventId(),
        },
    });
}
function mergeSystemDestroyPlayerForce(actionArray: WoSystemDestroyPlayerForce[]): WoSystemDestroyPlayerForce | null {
    return actionArray.length
        ? WoSystemDestroyPlayerForce.fromJson({
            extraData: {
                commonExtraData     : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetPlayerIndex   : actionArray[0].getExtraData()?.getTargetPlayerIndex(),
            },
        })
        : null;
}
function mergeSystemEndTurn(actionArray: WoSystemEndTurn[]): WoSystemEndTurn | null {
    return actionArray.length
        ? WoSystemEndTurn.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeSystemEndWar(actionArray: WoSystemEndWar[]): WoSystemEndWar | null {
    return actionArray.length
        ? WoSystemEndWar.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeSystemHandleBootPlayer(actionArray: WoSystemHandleBootPlayer[]): WoSystemHandleBootPlayer | null {
    return actionArray.length
        ? WoSystemHandleBootPlayer.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeSystemVoteForDraw(actionArray: WoSystemVoteForDraw[]): WoSystemVoteForDraw | null {
    return actionArray.length
        ? WoSystemVoteForDraw.fromJson({
            extraData: {
                commonExtraData : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                isAgree         : actionArray[0].getExtraData()?.getIsAgree(),
            },
        })
        : null;
}
function mergeUnitAttackTile(actionArray: WoUnitAttackTile[]): WoUnitAttackTile | null {
    return actionArray.length
        ? WoUnitAttackTile.fromJson({
            extraData: {
                commonExtraData : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetGridIndex : actionArray[0].getExtraData()?.getTargetGridIndex()?.toJson(),
            },
        })
        : null;
}
function mergeUnitAttackUnit(actionArray: WoUnitAttackUnit[]): WoUnitAttackUnit | null {
    return actionArray.length
        ? WoUnitAttackUnit.fromJson({
            extraData: {
                commonExtraData : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetGridIndex : actionArray[0].getExtraData()?.getTargetGridIndex()?.toJson(),
            },
        })
        : null;
}
function mergeUnitBeLoaded(actionArray: WoUnitBeLoaded[]): WoUnitBeLoaded | null {
    return actionArray.length
        ? WoUnitBeLoaded.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitBuildTile(actionArray: WoUnitBuildTile[]): WoUnitBuildTile | null {
    return actionArray.length
        ? WoUnitBuildTile.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitCaptureTile(actionArray: WoUnitCaptureTile[]): WoUnitCaptureTile | null {
    return actionArray.length
        ? WoUnitCaptureTile.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitCrushUnit(actionArray: WoUnitCrushUnit[]): WoUnitCrushUnit | null {
    return actionArray.length
        ? WoUnitCrushUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitDive(actionArray: WoUnitDive[]): WoUnitDive | null {
    return actionArray.length
        ? WoUnitDive.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitDropUnit(actionArray: WoUnitDropUnit[]): WoUnitDropUnit | null {
    if (!actionArray.length) {
        return null;
    }

    const droppingUnitAndPathArrays: MovingUnitAndPath[][] = [];
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

    return WoUnitDropUnit.fromJson({
        dropDestinations    : [],
        extraData           : {
            commonExtraData             : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            isDropBlocked               : actionArray[0].getExtraData()?.getIsDropBlocked(),
            droppingUnitAndPathArray    : getNonNullElements(droppingUnitAndPathArrays.map(v => mergeMovingUnitAndPathArray(v))).map(v => v.toJson()),
        },
    });
}
function mergeUnitJoinUnit(actionArray: WoUnitJoinUnit[]): WoUnitJoinUnit | null {
    return actionArray.length
        ? WoUnitJoinUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitLaunchFlare(actionArray: WoUnitLaunchFlare[]): WoUnitLaunchFlare | null {
    return actionArray.length
        ? WoUnitLaunchFlare.fromJson({
            extraData: {
                commonExtraData     : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetGridIndex     : actionArray[0].getExtraData()?.getTargetGridIndex()?.toJson(),
                flareRadius         : actionArray[0].getExtraData()?.getFlareRadius(),
            },
        })
        : null;
}
function mergeUnitLaunchSilo(actionArray: WoUnitLaunchSilo[]): WoUnitLaunchSilo | null {
    return actionArray.length
        ? WoUnitLaunchSilo.fromJson({
            extraData: {
                commonExtraData     : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                targetGridIndex     : actionArray[0].getExtraData()?.getTargetGridIndex()?.toJson(),
            },
        })
        : null;
}
function mergeUnitBoardedByCo(actionArray: WoUnitBoardedByCo[]): WoUnitBoardedByCo | null {
    return actionArray.length
        ? WoUnitBoardedByCo.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitProduceUnit(actionArray: WoUnitProduceUnit[]): WoUnitProduceUnit | null {
    return actionArray.length
        ? WoUnitProduceUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitRepairUnit(actionArray: WoUnitRepairUnit[]): WoUnitRepairUnit | null {
    return actionArray.length
        ? WoUnitRepairUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitSelfDetonate(actionArray: WoUnitSelfDetonate[]): WoUnitSelfDetonate | null {
    return actionArray.length
        ? WoUnitSelfDetonate.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitSupplyUnit(actionArray: WoUnitSupplyUnit[]): WoUnitSupplyUnit | null {
    return actionArray.length
        ? WoUnitSupplyUnit.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitSurface(actionArray: WoUnitSurface[]): WoUnitSurface | null {
    return actionArray.length
        ? WoUnitSurface.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}
function mergeUnitUseCoSkill(actionArray: WoUnitUseCoSkill[]): WoUnitUseCoSkill | null {
    return actionArray.length
        ? WoUnitUseCoSkill.fromJson({
            targetGridIndexArray    : actionArray[0].getTargetGridIndexArray().map(v => v.toJson()),
            extraData               : {
                commonExtraData         : mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
                skillDataArray          : actionArray[0].getExtraData()?.getSkillDataArray().map(v => v.toJson()) ?? [],
                skillType               : actionArray[0].getExtraData()?.getSkillType(),
                targetGridIndexArray    : [],
            },
        })
        : null;
}
function mergeUnitWait(actionArray: WoUnitWait[]): WoUnitWait | null {
    return actionArray.length
        ? WoUnitWait.fromJson({
            extraData: {
                commonExtraData: mergeCommonExtraData(actionArray.map(v => getExisted(v.getExtraData()?.getCommonExtraData()))).toJson(),
            },
        })
        : null;
}

function mergeCommonExtraData(dataArray: CommonExtraDataForWarOperation[]): CommonExtraDataForWarOperation {
    let nextUnitId                                  : Undefinable<number>;
    let weatherManager                              : Undefinable<SerialWeatherManager>;
    const destroyedUnitIdArray                      : number[] = [];
    const customCounterArray                        : CustomCounter[] = [];
    const hiddenUnitIdArray                         : number[] = [];
    const tileArrayAfterAction                      : SerialTile[] = [];
    const unitArrayAfterAction                      : SerialUnit[] = [];
    const playerArrayAfterAction                    : SerialPlayer[] = [];
    const visibilityArrayFromPathsAfterAction       : number[] = [];
    const unitMovePathVisibilitySetAfterWarEvent    = new Set<number>();
    const movingUnitAndPathArray                    : MovingUnitAndPath[] = [];
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

    return CommonExtraDataForWarOperation.fromJson({
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
function mergeDestroyedUnitIdArray(src: Undefinable<number[]>, dst: number[]): void {
    for (const id of src ?? []) {
        if (dst.indexOf(id) < 0) {
            dst.push(id);
        }
    }
}
function mergeCustomCounterArray(src: Undefinable<CustomCounter[]>, dst: CustomCounter[]): void {
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
function mergeHiddenUnitIdArray(src: Undefinable<number[]>, dst: number[]): void {
    for (const id of src ?? []) {
        if (dst.indexOf(id) < 0) {
            dst.push(id);
        }
    }
}
function mergeTileArrayAfterAction(src: Undefinable<SerialTile[]>, dst: SerialTile[]): void {
    for (const tileData of src ?? []) {
        const gridIndex = getExisted(GridIndex.convertGridIndex(tileData.getGridIndex()), ClientErrorCode.HrwModel_MergeTileArrayAfterAction_00);
        if (!dst.find(v => GridIndex.convertGridIndex(v.getGridIndex())?.checkIsEqual(gridIndex))) {
            dst.push(tileData);
        }
    }
}
function mergeUnitArrayAfterAction(src: Undefinable<SerialUnit[]>, dst: SerialUnit[]): void {
    for (const unitData of src ?? []) {
        if (!dst.find(v => v.getUnitId() === unitData.getUnitId())) {
            dst.push(unitData);
        }
    }
}
function mergePlayerArrayAfterAction(src: Undefinable<SerialPlayer[]>, dst: SerialPlayer[]): void {
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
function mergeVisibilityArrayFromPathsAfterAction(src: Undefinable<number[]>, dst: number[]): void {
    for (const id of src ?? []) {
        if (dst.indexOf(id) < 0) {
            dst.push(id);
        }
    }
}
function mergeUnitMovePathVisibilityAfterWarEvent(src: Undefinable<number[]>, dst: Set<number>): void {
    for (const id of src ?? []) {
        dst.add(id);
    }
}
function mergeMovingUnitAndPathArray(array: MovingUnitAndPath[]): MovingUnitAndPath | null {
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
            const path1     = getExisted(v1.getPath(), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_00);
            const path2     = getExisted(v2.getPath(), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_01);
            const lastNode1 = path1[path1.length - 1];
            const lastNode2 = path2[path2.length - 1];
            if (lastNode1.getIsVisible()) {
                return 1;
            } else if (lastNode2.getIsVisible()) {
                return -1;
            }

            const firstGridIndex1   = getExisted(GridIndex.convertGridIndex(path1[0].getGridIndex()), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_02);
            const firstGridIndex2   = getExisted(GridIndex.convertGridIndex(path2[0].getGridIndex()), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_03);
            const lastGridIndex1    = getExisted(GridIndex.convertGridIndex(lastNode1.getGridIndex()), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_04);
            const lastGridIndex2    = getExisted(GridIndex.convertGridIndex(lastNode2.getGridIndex()), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_05);
            if (firstGridIndex1.checkIsAdjacent(lastGridIndex2)) {
                return 1;
            } else if (firstGridIndex2.checkIsAdjacent(lastGridIndex1)) {
                return -1;
            } else {
                // 无法判断路径顺序
                return 1;
            }
        });
        const mergedPath: GridIndexAndPathInfo[] = [];
        for (const data of array) {
            for (const pathNode of data.getPath()) {
                mergedPath.push(pathNode);
            }
        }
        return MovingUnitAndPath.fromJson({
            unit    : array[0].getUnit()?.toJson(),
            path    : mergedPath.map(v => v.toJson()),
        });
    }
}
function mergeMovingUnitAndPath(data1: MovingUnitAndPath, data2: MovingUnitAndPath): MovingUnitAndPath | null {
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
        const gridIndex1    = getExisted(GridIndex.convertGridIndex(node1.getGridIndex()), ClientErrorCode.HrwModel_MergeMovingUnitAndPath_00);
        for (let index2 = 0; index2 < length2; ++index2) {
            const node2         = path2[index2];
            const gridIndex2    = getExisted(GridIndex.convertGridIndex(node2.getGridIndex()), ClientErrorCode.HrwModel_MergeMovingUnitAndPath_01);

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

                return MovingUnitAndPath.fromJson({
                    unit    : unit1.clone().toJson(),
                    path    : dstPath.map(v => v.toJson()),
                });
            }
        }
    }

    return null;
}
