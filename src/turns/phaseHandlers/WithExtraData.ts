import * as AuxiliaryTypesAttackableArea from "../../auxiliaryTypes/AttackableArea.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn from "../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn from "../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import * as TilesConstantsMapWeapon from "../../tiles/constants/MapWeapon.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TurnsConstants from "../Constants.ts";
import type * as TurnsITurnManager from "../ITurnManager.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "../../warOperations/executors/utils/Common.ts";

type IBwTile                = TilesITile.ITile;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export async function endPhaseStandby(turnManager: TurnsITurnManager.ITurnManager, action: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== TurnsConstants.PhaseCode.WaitBeginTurn) {
        throw HelpersMisc.newError(`Invalid phaseCode: ${phaseCode}`, UtilsClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_00);
    }

    runPhaseResetHasUnitOnBeginningTurn(turnManager, action, isFastExecute);
    runPhaseHandleUnitBuffEffect(turnManager, action, isFastExecute);
    runPhaseGetFund(turnManager, action, isFastExecute);
    runPhaseConsumeFuel(turnManager, action, isFastExecute);
    runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkillsConstants.AutoRecoveryTimingId.BeforeRegularRepair);
    runPhaseRepairUnitByTile(turnManager, action, isFastExecute);
    runPhaseDestroyUnitsOutOfFuel(turnManager, action, isFastExecute);
    runPhaseRepairUnitByUnit(turnManager, action, isFastExecute);
    runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkillsConstants.AutoRecoveryTimingId.AfterRegularRepair);
    await runPhaseActivateMapWeapon(turnManager, action, isFastExecute);
    runPhaseCheckAndUpdateUnitAiMode(turnManager, action, isFastExecute);
    runPhaseMain(turnManager, action, isFastExecute);

    turnManager.setPhaseCode(TurnsConstants.PhaseCode.Main);

    const extraData = HelpersMisc.getExisted(action.getExtraData(), UtilsClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_01);
    WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : HelpersMisc.getExisted(extraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}

export function endPhaseMain(turnManager: TurnsITurnManager.ITurnManager, action: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid phaseCode: ${phaseCode}`, UtilsClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_00);
    }

    runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkillsConstants.AutoRecoveryTimingId.BeforeEndTurn);
    runPhaseResetUnitState(turnManager, action, isFastExecute);
    runPhaseResetVisionForCurrentPlayer(turnManager, action, isFastExecute);
    runPhaseHandleUnitBuffEffect2(turnManager, action, isFastExecute);
    runPhaseTickTurnAndPlayerIndex(turnManager, action, isFastExecute);
    runPhaseResetSkillState(turnManager, action, isFastExecute);
    runPhaseResetVotesForDraw(turnManager, action, isFastExecute);
    runPhaseUpdateWeatherAndForceFog(turnManager, action, isFastExecute);
    runPhaseUpdateAllTileBuffArray(turnManager, action, isFastExecute);
    runPhaseUpdateAllUnitBuffArray(turnManager, action, isFastExecute);
    runPhaseResetVisionForNextPlayer(turnManager, action, isFastExecute);
    runPhaseWaitBeginTurn(turnManager, action, isFastExecute);

    turnManager.setPhaseCode(TurnsConstants.PhaseCode.WaitBeginTurn);

    const extraData = HelpersMisc.getExisted(action.getExtraData(), UtilsClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_01);
    WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : HelpersMisc.getExisted(extraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetHasUnitOnBeginningTurn(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseHandleUnitBuffEffect(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseGetFund(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseConsumeFuel(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseRecoverUnitByCo(turnManager: TurnsITurnManager.ITurnManager, isFastExecute: boolean, timing: number): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseRepairUnitByTile(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseDestroyUnitsOutOfFuel(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseRepairUnitByUnit(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runPhaseActivateMapWeapon(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
    const war               = turnManager.getWar();
    const playerIndex       = war.getPlayerIndexInTurn();
    const tileMap           = war.getTileMap();
    const mapSize           = tileMap.getMapSize();
    const allTileArray      = tileMap.getAllTiles().filter(v => v.getPlayerIndex() === playerIndex);
    {
        const crystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.Crystal)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of crystalArray) {
            await handleMapWeaponTileCrystal(data, war, tile, isFastExecute);
        }
    }
    {
        const customCrystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal)
            .sort((v1, v2) => {
                const priority1 = HelpersMisc.getExisted(v1.getFinalCrystalData()).getPriority();
                const priority2 = HelpersMisc.getExisted(v2.getFinalCrystalData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCrystalArray) {
            await handleMapWeaponTileCrystal(data, war, tile, isFastExecute);
        }
    }
    {
        const cannonArray = allTileArray.filter(v => v.checkIsNormalCannon())
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of cannonArray) {
            await handleMapWeaponTileCannon(data, war, tile, isFastExecute);
        }
    }
    {
        const customCannonArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCannon)
            .sort((v1, v2) => {
                const priority1 = HelpersMisc.getExisted(v1.getFinalCannonData()).getPriority();
                const priority2 = HelpersMisc.getExisted(v2.getFinalCannonData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCannonArray) {
            await handleMapWeaponTileCannon(data, war, tile, isFastExecute);
        }
    }
    {
        const laserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.LaserTurret)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of laserTurretArray) {
            await handleMapWeaponTileLaserTurret(data, war, tile, isFastExecute);
        }
    }
    {
        const customLaserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
            .sort((v1, v2) => {
                const priority1 = HelpersMisc.getExisted(v1.getFinalLaserTurretData()).getPriority();
                const priority2 = HelpersMisc.getExisted(v2.getFinalLaserTurretData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customLaserTurretArray) {
            await handleMapWeaponTileLaserTurret(data, war, tile, isFastExecute);
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseCheckAndUpdateUnitAiMode(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseMain(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetUnitState(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForCurrentPlayer(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    const war = turnManager.getWar();
    war.getFogMap().resetMapFromPathsForPlayerWithEncodedData(war.getPlayerIndexInTurn());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseHandleUnitBuffEffect2(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseTickTurnAndPlayerIndex(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    const info = turnManager.getNextTurnAndPlayerIndex();
    turnManager.setTurnIndex(info.turnIndex);
    turnManager.setPlayerIndexInTurn(info.playerIndex);
    turnManager.setEnterTurnTime(TimerTimerModel.getServerTimestamp());
    turnManager.getWar().getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetSkillState(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVotesForDraw(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    turnManager.getWar().getDrawVoteManager().handleTurnPhaseResetVotesForDraw();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateWeatherAndForceFog(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    const war               = turnManager.getWar();
    const weatherManager    = war.getWeatherManager();
    weatherManager.updateOnPlayerTurnSwitched();
    war.getFogMap().updateOnPlayerTurnSwitched();

    if (!isFastExecute) {
        weatherManager.getView().resetView(false);
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateAllTileBuffArray(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateAllUnitBuffArray(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForNextPlayer(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    // if (!isFastExecute) {
    //     turnManager.getWar().updateTilesAndUnitsOnVisibilityChanged();
    // }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseWaitBeginTurn(turnManager: TurnsITurnManager.ITurnManager, data: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, isFastExecute: boolean): void {
    if (!isFastExecute) {
        turnManager.getWar().getTileMap().getView().resetMarkLayer();
    }
}

async function handleMapWeaponTileCrystal(data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, war: IBwWar, tile: IBwTile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await TimerTimerModel.wait(400);
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypesAttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect.showEffectDamage(new AuxiliaryTypesGridIndex.GridIndex(x, y));
                }
            }
        }
        await TimerTimerModel.wait(200);

        await TimerTimerModel.wait(400);
    }
}
async function handleMapWeaponTileCannon(data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, war: IBwWar, tile: IBwTile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await TimerTimerModel.wait(400);
    }
}
async function handleMapWeaponTileLaserTurret(data: ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn, war: IBwWar, tile: IBwTile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await TimerTimerModel.wait(400);
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypesAttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect.showEffectDamage(new AuxiliaryTypesGridIndex.GridIndex(x, y));
                }
            }
        }
        await TimerTimerModel.wait(200);

        await TimerTimerModel.wait(400);
    }
}
