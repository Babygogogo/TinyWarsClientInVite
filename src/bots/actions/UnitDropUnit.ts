import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as ProtoSchemaCommonProtoStructureDropDestination from "../../proto/schema/CommonProto/Structure/DropDestination.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitDropUnit({ commonParams, unit, gridIndex, pathNodes }: {
    commonParams    : BotsCommonParams.CommonParams;
    unit            : IBwUnit;
    gridIndex       : AuxiliaryTypesGridIndex.GridIndex;
    pathNodes       : AuxiliaryTypesMovePathNode.MovePathNode[];
}): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

    if ((!unit.getCfgCanDropLoadedUnit()) || (unit.getLoadedUnitsCount() <= 0)) {
        return null;
    }

    const war           = commonParams.getWar();
    const tileMap       = war.getTileMap();
    const loaderTile    = tileMap.getTile(gridIndex);
    if (!unit.checkCanDropLoadedUnit(loaderTile.getTileTypeId())) {
        return null;
    }

    const unitMap           = war.getUnitMap();
    const targetTileArray   = gridIndex.getAdjacentGrids(commonParams.getMapSize())
        .filter(v => {
            const existingUnit = unitMap.getUnitOnMap(v);
            return (existingUnit == null) || (existingUnit == unit);
        })
        .map(v => tileMap.getTile(v));
        // .sort(() => commonParams.getAndTickRandomInteger() % 2 === 0 ? -1 : 1);
    const loadedUnitArray   = unit.getLoadedUnits()
        .filter(v => commonParams.getMoveCost(v, loaderTile) != null)
        .sort((v1, v2) => {
            const hp1 = v1.getCurrentHp();
            const hp2 = v2.getCurrentHp();
            if (hp1 !== hp2) {
                return hp2 - hp1;
            } else {
                return v1.getUnitId() - v2.getUnitId();
            }
        });

    const dropDestinations: ProtoSchemaCommonProtoStructureDropDestination.DropDestination[] = [];
    for (const loadedUnit of loadedUnitArray) {
        const index = targetTileArray.findIndex(v => commonParams.getMoveCost(loadedUnit, v) != null);
        if (index >= 0) {
            dropDestinations.push(ProtoSchemaCommonProtoStructureDropDestination.DropDestination.fromJson({
                unitId      : loadedUnit.getUnitId(),
                gridIndex   : targetTileArray[index].getGridIndex().toProto().toJson(),
            }));
            targetTileArray.splice(index, 1);
        }
    }

    if (!dropDestinations.length) {
        return null;
    } else {
        const score = await getScoreForActionUnitDropUnit(dropDestinations);
        return {
            score   : score,
            action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitDropUnit: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                dropDestinations: dropDestinations.map(v => v.toJson()),
                isDropBlocked   : false,
            } }),
        };
    }
}

async function getScoreForActionUnitDropUnit(dropDestinations: ProtoSchemaCommonProtoStructureDropDestination.DropDestination[]): Promise<number> {
    await TimerTimerModel.checkAndCallLater();

    return dropDestinations.length * 100;
}
