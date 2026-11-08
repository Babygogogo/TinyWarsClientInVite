import {
    SinglePlayerWars_AutoWarOpManager,
    SinglePlayerWars_War,
    type AuxiliaryTypes_DropDestination,
    type AuxiliaryTypes_GridIndex,
    type CoSkills_Constants,
} from "../internal.ts";
import type { MovePath } from "../proto/schema/CommonProto/Structure/MovePath.ts";
import { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export function reqPlayerDeleteUnit(war: SinglePlayerWars_War.War, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId        : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerDeleteUnit : {
            gridIndex : gridIndex.toProto().toJson(),
        },
    }));
}

export function reqPlayerEndTurn(war: SinglePlayerWars_War.War): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId     : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerEndTurn : {},
    }));
}

export function reqPlayerProduceUnit({ war, gridIndex, unitType, unitHp }: {
    war         : SinglePlayerWars_War.War;
    gridIndex   : AuxiliaryTypes_GridIndex.GridIndex;
    unitType    : number;
    unitHp      : number;
}): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerProduceUnit : {
            gridIndex : gridIndex.toProto().toJson(),
            unitType,
            unitHp,
        },
    }));
}

export function reqPlayerUseCoActiveSkill({ war, skillType, targetGridIndexArray }: {
    war                     : SinglePlayerWars_War.War;
    skillType               : CoSkills_Constants.SkillTypeId;
    targetGridIndexArray    : AuxiliaryTypes_GridIndex.GridIndex[] | null;
}): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId        : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerUseCoSkill : {
            skillType            : skillType,
            targetGridIndexArray : targetGridIndexArray?.map(v => v.toProto().toJson()) ?? [],
        },
    }));
}

export function reqPlayerVoteForDraw(war: SinglePlayerWars_War.War, playerIndex: number, isAgree: boolean): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerVoteForDraw : {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    }));
}

export function reqPlayerSurrender(war: SinglePlayerWars_War.War, playerIndex: number): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId       : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerSurrender : {
            playerIndex : playerIndex,
        },
    }));
}

export function reqUnitAttackUnit({ war, path, launchUnitId, targetGridIndex }: {
    war             : SinglePlayerWars_War.War;
    path            : MovePath;
    launchUnitId    : number | null;
    targetGridIndex : AuxiliaryTypes_GridIndex.GridIndex;
}): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId      : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitAttackUnit : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitAttackTile({ war, path, launchUnitId, targetGridIndex }: {
    war             : SinglePlayerWars_War.War;
    path            : MovePath;
    launchUnitId    : number | null;
    targetGridIndex : AuxiliaryTypes_GridIndex.GridIndex;
}): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId      : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitAttackTile : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitBeLoaded(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId    : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitBeLoaded : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitBuildTile(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId     : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitBuildTile : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitCaptureTile(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId       : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitCaptureTile : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitCrushUnit(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null, targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId     : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitCrushUnit : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitDive(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitDive  : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitDrop({ war, path, launchUnitId, dropDestinations }: {
    war             : SinglePlayerWars_War.War;
    path            : MovePath;
    launchUnitId    : number | null;
    dropDestinations: AuxiliaryTypes_DropDestination.DropDestination[];
}): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId    : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitDropUnit : {
            path             : path.toJson(),
            launchUnitId     : launchUnitId,
            dropDestinations : dropDestinations.map(v => v.toProto().toJson()),
        },
    }));
}

export function reqUnitJoin(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId    : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitJoinUnit : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitLaunchFlare({ war, path, launchUnitId, targetGridIndex }: {
    war             : SinglePlayerWars_War.War;
    path            : MovePath;
    launchUnitId    : number | null;
    targetGridIndex : AuxiliaryTypes_GridIndex.GridIndex;
}): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId       : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitLaunchFlare : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitLaunchSilo({ war, path, launchUnitId, targetGridIndex }: {
    war             : SinglePlayerWars_War.War;
    path            : MovePath;
    launchUnitId    : number | null;
    targetGridIndex : AuxiliaryTypes_GridIndex.GridIndex;
}): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId      : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitLaunchSilo : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitBoardedByCo(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId       : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitBoardedByCo : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitProduceUnit(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId       : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitProduceUnit : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitRepairUnit(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null, targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId      : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitRepairUnit : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitSelfDetonate(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId        : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitSelfDetonate : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitSupply(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId      : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitSupplyUnit : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitSurface(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId   : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitSurface : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}

export function reqUnitUseCoActiveSkill({ war, skillType, path, launchUnitId, targetGridIndexArray }: {
    war                     : SinglePlayerWars_War.War;
    skillType               : CoSkills_Constants.SkillTypeId;
    path                    : MovePath;
    launchUnitId            : number | null;
    targetGridIndexArray    : AuxiliaryTypes_GridIndex.GridIndex[] | null;
}): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId      : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitUseCoSkill : {
            skillType            : skillType,
            path                 : path.toJson(),
            launchUnitId         : launchUnitId,
            targetGridIndexArray : targetGridIndexArray?.map(v => v.toProto().toJson()) ?? [],
        },
    }));
}

export function reqUnitWait(war: SinglePlayerWars_War.War, path: MovePath, launchUnitId: number | null): void {
    SinglePlayerWars_AutoWarOpManager.handlePlayerOpAndAutoOps(war, WoContainer.fromJson({
        operationId : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitWait  : {
            path         : path.toJson(),
            launchUnitId : launchUnitId,
        },
    }));
}
