import { AttackableArea } from "../../auxiliaryTypes/AttackableArea.ts";
import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { AutoRecoveryTimingId } from "../../coSkills/Constants.ts";
import { newError, getExisted } from "../../helpers/Misc.ts";
import type { WoPlayerEndTurn } from "../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type { WoSystemBeginTurn } from "../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import { TypeId } from "../../tiles/constants/MapWeapon.ts";
import type { ITile } from "../../tiles/ITile.ts";
import { getServerTimestamp, wait } from "../../timer/TimerModel.ts";
import { PhaseCode } from "../Constants.ts";
import type { ITurnManager } from "../ITurnManager.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { handleCommonExtraData } from "../../warOperations/executors/utils/Common.ts";

type IBwTile                = ITile;
export async function endPhaseStandby(turnManager: ITurnManager, action: WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== PhaseCode.WaitBeginTurn) {
        throw newError(`Invalid phaseCode: ${phaseCode}`, ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_00);
    }

    runPhaseResetHasUnitOnBeginningTurn(turnManager, action, isFastExecute);
    runPhaseHandleUnitBuffEffect(turnManager, action, isFastExecute);
    runPhaseGetFund(turnManager, action, isFastExecute);
    runPhaseConsumeFuel(turnManager, action, isFastExecute);
    runPhaseRecoverUnitByCo(turnManager, isFastExecute, AutoRecoveryTimingId.BeforeRegularRepair);
    runPhaseRepairUnitByTile(turnManager, action, isFastExecute);
    runPhaseDestroyUnitsOutOfFuel(turnManager, action, isFastExecute);
    runPhaseRepairUnitByUnit(turnManager, action, isFastExecute);
    runPhaseRecoverUnitByCo(turnManager, isFastExecute, AutoRecoveryTimingId.AfterRegularRepair);
    await runPhaseActivateMapWeapon(turnManager, action, isFastExecute);
    runPhaseCheckAndUpdateUnitAiMode(turnManager, action, isFastExecute);
    runPhaseMain(turnManager, action, isFastExecute);

    turnManager.setPhaseCode(PhaseCode.Main);

    const extraData = getExisted(action.getExtraData(), ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_01);
    handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : getExisted(extraData.getCommonExtraData(), ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}

export function endPhaseMain(turnManager: ITurnManager, action: WoPlayerEndTurn, isFastExecute: boolean): void {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== PhaseCode.Main) {
        throw newError(`Invalid phaseCode: ${phaseCode}`, ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_00);
    }

    runPhaseRecoverUnitByCo(turnManager, isFastExecute, AutoRecoveryTimingId.BeforeEndTurn);
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

    turnManager.setPhaseCode(PhaseCode.WaitBeginTurn);

    const extraData = getExisted(action.getExtraData(), ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_01);
    handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : getExisted(extraData.getCommonExtraData(), ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetHasUnitOnBeginningTurn(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseHandleUnitBuffEffect(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseGetFund(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseConsumeFuel(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseRecoverUnitByCo(turnManager: ITurnManager, isFastExecute: boolean, timing: number): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseRepairUnitByTile(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseDestroyUnitsOutOfFuel(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseRepairUnitByUnit(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runPhaseActivateMapWeapon(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
    const war               = turnManager.getWar();
    const playerIndex       = war.getPlayerIndexInTurn();
    const tileMap           = war.getTileMap();
    const mapSize           = tileMap.getMapSize();
    const allTileArray      = tileMap.getAllTiles().filter(v => v.getPlayerIndex() === playerIndex);
    {
        const crystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TypeId.Crystal)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of crystalArray) {
            await handleMapWeaponTileCrystal(data, war, tile, isFastExecute);
        }
    }
    {
        const customCrystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TypeId.CustomCrystal)
            .sort((v1, v2) => {
                const priority1 = getExisted(v1.getFinalCrystalData()).getPriority();
                const priority2 = getExisted(v2.getFinalCrystalData()).getPriority();
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
        const customCannonArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TypeId.CustomCannon)
            .sort((v1, v2) => {
                const priority1 = getExisted(v1.getFinalCannonData()).getPriority();
                const priority2 = getExisted(v2.getFinalCannonData()).getPriority();
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
        const laserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TypeId.LaserTurret)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of laserTurretArray) {
            await handleMapWeaponTileLaserTurret(data, war, tile, isFastExecute);
        }
    }
    {
        const customLaserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === TypeId.CustomLaserTurret)
            .sort((v1, v2) => {
                const priority1 = getExisted(v1.getFinalLaserTurretData()).getPriority();
                const priority2 = getExisted(v2.getFinalLaserTurretData()).getPriority();
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
function runPhaseCheckAndUpdateUnitAiMode(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseMain(turnManager: ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetUnitState(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForCurrentPlayer(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    const war = turnManager.getWar();
    war.getFogMap().resetMapFromPathsForPlayerWithEncodedData(war.getPlayerIndexInTurn());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseHandleUnitBuffEffect2(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseTickTurnAndPlayerIndex(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    const info = turnManager.getNextTurnAndPlayerIndex();
    turnManager.setTurnIndex(info.turnIndex);
    turnManager.setPlayerIndexInTurn(info.playerIndex);
    turnManager.setEnterTurnTime(getServerTimestamp());
    turnManager.getWar().getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetSkillState(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVotesForDraw(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    turnManager.getWar().getDrawVoteManager().handleTurnPhaseResetVotesForDraw();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateWeatherAndForceFog(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    const war               = turnManager.getWar();
    const weatherManager    = war.getWeatherManager();
    weatherManager.updateOnPlayerTurnSwitched();
    war.getFogMap().updateOnPlayerTurnSwitched();

    if (!isFastExecute) {
        weatherManager.getView().resetView(false);
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateAllTileBuffArray(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateAllUnitBuffArray(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForNextPlayer(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // if (!isFastExecute) {
    //     turnManager.getWar().updateTilesAndUnitsOnVisibilityChanged();
    // }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseWaitBeginTurn(turnManager: ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    if (!isFastExecute) {
        turnManager.getWar().getTileMap().getView().resetMarkLayer();
    }
}

async function handleMapWeaponTileCrystal(data: WoSystemBeginTurn, war: IBwWar, tile: IBwTile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await wait(400);
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect.showEffectDamage(new GridIndex(x, y));
                }
            }
        }
        await wait(200);

        await wait(400);
    }
}
async function handleMapWeaponTileCannon(data: WoSystemBeginTurn, war: IBwWar, tile: IBwTile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await wait(400);
    }
}
async function handleMapWeaponTileLaserTurret(data: WoSystemBeginTurn, war: IBwWar, tile: IBwTile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await wait(400);
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect.showEffectDamage(new GridIndex(x, y));
                }
            }
        }
        await wait(200);

        await wait(400);
    }
}
