import {
    AuxiliaryTypes_AuxiliaryTypes,
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_GridIndexAndInvisibility,
    BaseWar_Model_War,
    Helpers_Misc,
    Turns_Constants,
    Units_Constants,
    Utils_ClientErrorCode,
    Visibilities_Utils,
} from "../internal.ts";
import { MovePath as ProtoMovePath } from "../proto/schema/CommonProto/Structure/MovePath.ts";

export class MovePath {
    private readonly _nodes             : AuxiliaryTypes_GridIndexAndInvisibility.GridIndexAndInvisibility[];
    private readonly _launchUnitId      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private readonly _fuelConsumption   : number;
    private readonly _isBlocked         : boolean;

    public static getRevisedPath({ war, rawPath, launchUnitId, requesterUserId }: {
        war             : BaseWar_Model_War.War;
        rawPath         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ProtoMovePath>;
        launchUnitId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
        requesterUserId : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    }): MovePath {
        if (rawPath == null) {
            throw Helpers_Misc.newError(`Empty rawPath.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_00);
        }

        const rawPathNodes = rawPath.getNodes();
        if ((rawPathNodes == null) || (!rawPathNodes.length)) {
            throw Helpers_Misc.newError(`Empty rawPathNodes.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_01);
        }

        const beginningGridIndex    = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawPathNodes[0]), Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_02);
        const playerInTurn          = war.getPlayerInTurn();
        const unitMap               = war.getUnitMap();
        const focusUnit             = launchUnitId != null ? unitMap.getUnitLoadedById(launchUnitId) : unitMap.getUnitOnMap(beginningGridIndex);
        if ((!focusUnit)                                                        ||
            (focusUnit.getPlayerIndex() !== playerInTurn.getPlayerIndex())      ||
            (focusUnit.getActionState() !== Units_Constants.ActionStateId.Idle) ||
            (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main)         ||
            (playerInTurn.getUserId() != requesterUserId)
        ) {
            throw Helpers_Misc.newError(`Invalid focusUnit.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_03);
        }

        if (launchUnitId != null) {
            if (!focusUnit.getGridIndex().checkIsEqual(beginningGridIndex)) {
                throw Helpers_Misc.newError(`Invalid gridIndex.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_04);
            }
        }

        const tileMap                   = war.getTileMap();
        const mapSize                   = tileMap.getMapSize();
        const teamIndexInTurn           = playerInTurn.getTeamIndex();
        const maxFuelConsumption        = focusUnit.getFinalMoveRange();
        const revisedNodes              = [new AuxiliaryTypes_GridIndexAndInvisibility.GridIndexAndInvisibility(beginningGridIndex.clone(), focusUnit.checkIsInvisible(beginningGridIndex))];
        let revisedTotalFuelConsumption = 0;
        let rawTotalFuelConsumption     = 0;
        let isBlocked                   = false;
        for (let i = 1; i < rawPathNodes.length; ++i) {
            const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawPathNodes[i]);
            if ((!gridIndex)                                                                                                                    ||
                (!gridIndex.checkIsAdjacent(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawPathNodes[i - 1])))) ||
                (!gridIndex.checkIsInsideMap(mapSize))                                                                                          ||
                (revisedNodes.some(g => g.gridIndex.checkIsEqual(gridIndex)))
            ) {
                throw Helpers_Misc.newError(`Invalid gridIndex.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_05);
            }

            const tile              = tileMap.getTile(gridIndex);
            const fuelConsumption   = Helpers_Misc.getExisted(tile.getMoveCostByUnit(focusUnit), Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_06);
            rawTotalFuelConsumption += fuelConsumption;
            if (rawTotalFuelConsumption > maxFuelConsumption) {
                throw Helpers_Misc.newError(`Invalid rawTotalFuelConsumption: ${rawTotalFuelConsumption}`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_07);
            }

            const existingUnit = unitMap.getUnitOnMap(gridIndex);
            if ((existingUnit) && (existingUnit.getTeamIndex() !== teamIndexInTurn)) {
                if (Visibilities_Utils.checkIsUnitOnMapVisibleToTeam({
                    war               : war,
                    gridIndex         : gridIndex,
                    unitType          : existingUnit.getUnitTypeId(),
                    isDiving          : existingUnit.getIsDiving(),
                    isInvisible       : existingUnit.checkIsInvisible(gridIndex),
                    unitPlayerIndex   : existingUnit.getPlayerIndex(),
                    observerTeamIndex : teamIndexInTurn,
                })) {
                    throw Helpers_Misc.newError(`There is a blocking visible unit.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_08);
                } else {
                    isBlocked = true;
                }
            }

            if (!isBlocked) {
                revisedTotalFuelConsumption = rawTotalFuelConsumption;
                revisedNodes.push(new AuxiliaryTypes_GridIndexAndInvisibility.GridIndexAndInvisibility(gridIndex.clone(), focusUnit.checkIsInvisible(gridIndex)));
            }
        }

        return new MovePath(revisedNodes, launchUnitId, revisedTotalFuelConsumption, isBlocked);
    }

    private constructor(nodes: AuxiliaryTypes_GridIndexAndInvisibility.GridIndexAndInvisibility[], launchUnitId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>, fuelConsumption: number, isBlocked: boolean) {
        this._nodes             = nodes;
        this._launchUnitId      = launchUnitId;
        this._fuelConsumption   = fuelConsumption;
        this._isBlocked         = isBlocked;
    }

    public toProtoMovePath(): ProtoMovePath {
        return ProtoMovePath.fromJson({
            nodes           : this._nodes.map(v => v.gridIndex.toProto().toJson()),
            isBlocked       : this._isBlocked,
            fuelConsumption : this._fuelConsumption,
        });
    }

    public getNodes(): AuxiliaryTypes_GridIndexAndInvisibility.GridIndexAndInvisibility[] {
        return this._nodes;
    }

    public getLaunchUnitId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return this._launchUnitId;
    }

    public getFuelConsumption(): number {
        return this._fuelConsumption;
    }

    public getIsBlocked(): boolean {
        return this._isBlocked;
    }
}
