import {
    AuxiliaryTypes_RawGridIndexAndPathInfo,
    AuxiliaryTypes_RevisedDropUnitInfo,
    SinglePlayerWars_War,
    Visibilities_Constants,
    type AuxiliaryTypes_MovePath,
} from "../internal";
import { GridIndexAndPathInfo } from "../proto/schema/CommonProto/Structure/GridIndexAndPathInfo";
import { MovingUnitAndPath } from "../proto/schema/CommonProto/Structure/MovingUnitAndPath";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit";

export class RawMovingUnitAndPath {
    private readonly _unit: SerialUnit;
    private readonly _path: AuxiliaryTypes_RawGridIndexAndPathInfo.RawGridIndexAndPathInfo[];

    public static create(unit: SerialUnit, revisedPath: AuxiliaryTypes_MovePath.MovePath): RawMovingUnitAndPath {
        const path = revisedPath.getNodes().map(node => new AuxiliaryTypes_RawGridIndexAndPathInfo.RawGridIndexAndPathInfo(node.gridIndex.clone(), false, false, node.isInvisible));
        path[path.length - 1].isBlocked = revisedPath.getIsBlocked();

        return new RawMovingUnitAndPath(unit.clone(), path);
    }
    public static create2(info: AuxiliaryTypes_RevisedDropUnitInfo.RevisedDropUnitInfo): RawMovingUnitAndPath {
        return new RawMovingUnitAndPath(
            info.getUnitDataBeforeAction().clone(),
            info.getPath().map(node => new AuxiliaryTypes_RawGridIndexAndPathInfo.RawGridIndexAndPathInfo(node.gridIndex.clone(), false, false, node.isInvisible)),
        );
    }

    private constructor(unit: SerialUnit, path: AuxiliaryTypes_RawGridIndexAndPathInfo.RawGridIndexAndPathInfo[]) {
        this._unit = unit;
        this._path = path;
    }

    public updatePathToSend(
        war                                 : SinglePlayerWars_War.War,
        teamIndex                           : number,
        unitGridIdsForEachTeamBeforeAction  : Map<number, Set<number>>,
        visibilityMap                       : number[][] | undefined,
    ): void {
        const unitData  = this._unit;
        const path      = this._path;
        if (war.getPlayerManager().getTeamIndex(unitData.getPlayerIndex()) == teamIndex) {
            for (const pathNode of path) {
                pathNode.isVisible = true;
            }
        } else {
            const tileMap       = war.getTileMap();
            const mapSize       = tileMap.getMapSize();
            const unitType      = unitData.getUnitType();
            const isDiving      = unitData.getIsDiving();
            const unitGridIds   = unitGridIdsForEachTeamBeforeAction.get(teamIndex) ?? new Set();

            for (const pathNode of path) {
                if (pathNode.isVisible) {
                    continue;
                }

                const gridIndex = pathNode.gridIndex;
                if ((isDiving) || (pathNode.isUnitInvisible)) {
                    if (gridIndex.getAdjacentGridIds(mapSize).some(v => unitGridIds.has(v))) {
                        pathNode.isVisible = true;
                    }
                } else {
                    const visibility = visibilityMap?.[gridIndex.getX()][gridIndex.getY()];
                    if ((visibility == Visibilities_Constants.VisibilityTypeId.Penetrating)                                                             ||
                        ((visibility == Visibilities_Constants.VisibilityTypeId.Inside) && (!tileMap.getTile(gridIndex).checkCanHideUnitType(unitType)))
                    ) {
                        pathNode.isVisible = true;
                    }
                }
            }
        }
    }

    public createFinalMovingUnitAndPath(): MovingUnitAndPath | undefined {
        const trimmedPath = this.trimPathToSend();
        if ((trimmedPath == null) || (trimmedPath.length <= 0)) {
            return undefined;
        }

        const movingUnit = this._unit.clone();
        movingUnit.setGridIndex(trimmedPath[0].gridIndex.toProto());

        return MovingUnitAndPath.fromJson({
            unit : movingUnit.toJson(),
            path : trimmedPath.map(v => GridIndexAndPathInfo.fromJson({
                gridIndex : v.gridIndex.toProto().toJson(),
                isVisible : v.isVisible,
                isBlocked : v.isBlocked,
            }).toJson()),
        });
    }

    private trimPathToSend(): AuxiliaryTypes_RawGridIndexAndPathInfo.RawGridIndexAndPathInfo[] | undefined {
        const rawPath = this._path;
        if (rawPath.every(v => !v.isVisible)) {
            return undefined;
        }

        const path = rawPath.concat();
        for (let firstIndex = 0; firstIndex < path.length; ++firstIndex) {
            if ((path[firstIndex].isVisible)                                        ||
                ((firstIndex + 1 < path.length) && (path[firstIndex + 1].isVisible))
            ) {
                path.splice(0, firstIndex);
                break;
            }
        }
        for (let lastIndex = path.length - 1; lastIndex >= 0; --lastIndex) {
            if ((path[lastIndex].isVisible)                                 ||
                ((lastIndex - 1 >= 0) && (path[lastIndex - 1].isVisible))
            ) {
                if (lastIndex + 1 < path.length) {
                    path.splice(lastIndex + 1, path.length - 1 - lastIndex);
                }
                break;
            }
        }

        return path;
    }
}
