import type { DropDestination } from "../../auxiliaryTypes/DropDestination.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { SkillTypeId } from "../../coSkills/Constants.ts";
import type { MovePath } from "../../proto/schema/CommonProto/Structure/MovePath.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { ISpwWar } from "../interface/ISpwWar.ts";
import { handlePlayerActionAndAutoActions } from "./SpwModel.ts";

export function reqPlayerDeleteUnit(war: ISpwWar, gridIndex: GridIndex): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerDeleteUnit  : {
            gridIndex   : gridIndex.toProto().toJson(),
        },
    }));
}

export function reqPlayerEndTurn(war: ISpwWar): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerEndTurn  : {},
    }));
}

export function reqPlayerProduceUnit({ war, gridIndex, unitType, unitHp }: {
    war         : ISpwWar;
    gridIndex   : GridIndex;
    unitType    : number;
    unitHp      : number;
}): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                    : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerProduceUnit  : {
            gridIndex   : gridIndex.toProto().toJson(),
            unitType,
            unitHp,
        },
    }));
}

export function reqPlayerUseCoActiveSkill({ war, skillType, targetGridIndexArray }: {
    war                     : ISpwWar;
    skillType               : SkillTypeId;
    targetGridIndexArray    : GridIndex[] | null;
}): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerUseCoSkill  : {
            skillType               : skillType,
            targetGridIndexArray    : targetGridIndexArray?.map(v => v.toProto().toJson()) ?? [],
        },
    }));
}

export function reqPlayerVoteForDraw(war: ISpwWar, playerIndex: number, isAgree: boolean): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerVoteForDraw : {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    }));
}

export function reqPlayerSurrender(war: ISpwWar, playerIndex: number): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                    : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoPlayerSurrender    : {
            playerIndex : playerIndex,
        },
    }));
}

export function reqUnitAttackUnit({ war, path, launchUnitId, targetGridIndex }: {
    war             : ISpwWar;
    path            : MovePath;
    launchUnitId    : number | null;
    targetGridIndex : GridIndex;
}): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitAttackUnit : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitAttackTile({ war, path, launchUnitId, targetGridIndex }: {
    war             : ISpwWar;
    path            : MovePath;
    launchUnitId    : number | null;
    targetGridIndex : GridIndex;
}): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitAttackTile : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitBeLoaded(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitBeLoaded   : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitBuildTile(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitBuildTile  : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitCaptureTile(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitCaptureTile: {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitCrushUnit(war: ISpwWar, path: MovePath, launchUnitId: number | null, targetGridIndex: GridIndex): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitCrushUnit     : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitDive(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId            : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitDive   : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitDrop({ war, path, launchUnitId, dropDestinations }: {
    war             : ISpwWar;
    path            : MovePath;
    launchUnitId    : number | null;
    dropDestinations: DropDestination[];
}): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitDropUnit   : {
            path                : path.toJson(),
            launchUnitId        : launchUnitId,
            dropDestinations    : dropDestinations.map(v => v.toProto().toJson()),
        },
    }));
}

export function reqUnitJoin(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitJoinUnit   : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitLaunchFlare({ war, path, launchUnitId, targetGridIndex }: {
    war             : ISpwWar;
    path            : MovePath;
    launchUnitId    : number | null;
    targetGridIndex : GridIndex;
}): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                    : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitLaunchFlare    : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitLaunchSilo({ war, path, launchUnitId, targetGridIndex }: {
    war             : ISpwWar;
    path            : MovePath;
    launchUnitId    : number | null;
    targetGridIndex : GridIndex;
}): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitLaunchSilo : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitBoardedByCo(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId            : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitBoardedByCo : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitProduceUnit(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                    : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitProduceUnit    : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitRepairUnit(war: ISpwWar, path: MovePath, launchUnitId: number | null, targetGridIndex: GridIndex): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitRepairUnit    : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }));
}

export function reqUnitSelfDetonate(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitSelfDetonate  : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitSupply(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitSupplyUnit : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitSurface(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId                : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitSurface    : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}

export function reqUnitUseCoActiveSkill({ war, skillType, path, launchUnitId, targetGridIndexArray }: {
    war                     : ISpwWar;
    skillType               : SkillTypeId;
    path                    : MovePath;
    launchUnitId            : number | null;
    targetGridIndexArray    : GridIndex[] | null;
}): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId         : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitUseCoSkill    : {
            skillType               : skillType,
            path                    : path.toJson(),
            launchUnitId            : launchUnitId,
            targetGridIndexArray    : targetGridIndexArray?.map(v => v.toProto().toJson()) ?? [],
        },
    }));
}

export function reqUnitWait(war: ISpwWar, path: MovePath, launchUnitId: number | null): void {
    handlePlayerActionAndAutoActions(war, WoContainer.fromJson({
        operationId     : war.getExecutedOperationManager().getExecutedOperationsCount(),
        WoUnitWait      : {
            path            : path.toJson(),
            launchUnitId    : launchUnitId,
        },
    }));
}
