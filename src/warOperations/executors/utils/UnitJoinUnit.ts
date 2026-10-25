import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoUnitJoinUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitJoinUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId, Hp } from "../../../units/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitJoinUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitJoinUnit(war, action);
    } else {
        await normalExeUnitJoinUnit(war, action);
    }
}

function fastExeUnitJoinUnit(war: IBwWar, action: WoUnitJoinUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war             : war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitJoinUnit_00),
            isFastExecute   : true,
            isUnitJoinUnit  : true,
        });
    } else {
        const path              = MovePath.create(getExisted(action.getPath()));
        const launchUnitId      = action.getLaunchUnitId();
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(ActionStateId.Acted);

        } else {
            const targetUnit    = getExisted(unitMap.getUnitOnMap(endingGridIndex));
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            unitMap.removeUnitOnMap(endingGridIndex, true)?.stopRunning();
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(ActionStateId.Acted);

            {
                const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: endingGridIndex });
                if (observerTeamIndexes != null) {
                    const normalizedHpLoss = targetUnit.getNormalizedCurrentHp() + focusUnit.getNormalizedCurrentHp() - focusUnit.getNormalizedMaxHp();
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                    : focusUnit.getUnitType(),
                        dstPlayerIndex              : focusUnit.getPlayerIndex(),
                        unitGain                    : 0,
                        unitLoss                    : 1,
                        normalizedHpGain            : 0,
                        normalizedHpLoss            : Math.max(0, normalizedHpLoss),
                        groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }

            focusUnit.setIsCoOnboard(focusUnit.getIsCoOnboard() || targetUnit.getIsCoOnboard());

            if (focusUnit.checkHasPrimaryWeapon()) {
                focusUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo());
            }

            const joinIncome = focusUnit.getJoinIncome(targetUnit);
            if (joinIncome !== 0) {
                player.setFund(player.getFund() + joinIncome);
            }

            focusUnit.setCurrentHp(Math.min(
                focusUnit.getMaxHp(),
                (focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()) * Hp.Normalizer,
            ));

            focusUnit.setCurrentFuel(Math.min(
                focusUnit.getMaxFuel(),
                focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel()
            ));

            const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
            if (maxBuildMaterial != null) {
                focusUnit.setCurrentBuildMaterial(Math.min(
                    maxBuildMaterial,
                    getExisted(focusUnit.getCurrentBuildMaterial()) + getExisted(targetUnit.getCurrentBuildMaterial()),
                ));
            }

            const maxProduceMaterial = focusUnit.getMaxProduceMaterial();
            if (maxProduceMaterial != null) {
                focusUnit.addAndValidateCurrentProduceMaterial(targetUnit.getCurrentProduceMaterial());
            }

            focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));

            // flare ammo
            {
                const maxAmmo = focusUnit.getFlareMaxAmmo();
                if (maxAmmo != null) {
                    focusUnit.setFlareCurrentAmmo(Math.min(
                        maxAmmo,
                        getExisted(focusUnit.getFlareCurrentAmmo()) + getExisted(targetUnit.getFlareCurrentAmmo()),
                    ));
                }
            }

            focusUnit.setGroupedTagId(focusUnit.getGroupedTagId() | targetUnit.getGroupedTagId());
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitJoinUnit(war: IBwWar, action: WoUnitJoinUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitJoinUnit(action);
    // (desc) && (FloatText.show(desc));

    const unitMap           = war.getUnitMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitJoinUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        const movingPath    = movingUnitAndPath?.getPath();
        const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
        if ((lastNode?.getIsVisible()) && (!lastNode.getIsBlocked())) {
            const gridIndex = getExisted(GridIndex.convertGridIndex(lastNode.getGridIndex()), ClientErrorCode.WarOperationExecutor_NormalExeUnitJoinUnit_01);
            if (unitMap.getUnitOnMap(gridIndex)) {
                unitMap.removeUnitOnMap(gridIndex, true)?.stopRunning();
            }
        }

        handleCommonExtraData({
            war                 : war,
            commonExtraData     : commonExtraData,
            isFastExecute       : false,
            isUnitJoinUnit      : true,
        });

    } else {
        const path              = MovePath.create(getExisted(action.getPath()));
        const launchUnitId      = action.getLaunchUnitId();
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(ActionStateId.Acted);

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            const targetUnit    = getExisted(unitMap.removeUnitOnMap(endingGridIndex, false));
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(ActionStateId.Acted);

            {
                const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: endingGridIndex });
                if (observerTeamIndexes != null) {
                    const normalizedHpLoss = targetUnit.getNormalizedCurrentHp() + focusUnit.getNormalizedCurrentHp() - focusUnit.getNormalizedMaxHp();
                    war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                    : focusUnit.getUnitType(),
                        dstPlayerIndex              : focusUnit.getPlayerIndex(),
                        unitGain                    : 0,
                        unitLoss                    : 1,
                        normalizedHpGain            : 0,
                        normalizedHpLoss            : Math.max(0, normalizedHpLoss),
                        groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }

            focusUnit.setIsCoOnboard(focusUnit.getIsCoOnboard() || targetUnit.getIsCoOnboard());

            if (focusUnit.checkHasPrimaryWeapon()) {
                focusUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo());
            }

            const joinIncome = focusUnit.getJoinIncome(targetUnit);
            if (joinIncome !== 0) {
                player.setFund(player.getFund() + joinIncome);
            }

            focusUnit.setCurrentHp(Math.min(
                focusUnit.getMaxHp(),
                (focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()) * Hp.Normalizer,
            ));

            focusUnit.setCurrentFuel(Math.min(
                focusUnit.getMaxFuel(),
                focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel()
            ));

            {
                const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
                if (maxBuildMaterial != null) {
                    focusUnit.setCurrentBuildMaterial(Math.min(
                        maxBuildMaterial,
                        getExisted(focusUnit.getCurrentBuildMaterial()) + getExisted(targetUnit.getCurrentBuildMaterial())
                    ));
                }
            }

            {
                const maxProduceMaterial = focusUnit.getMaxProduceMaterial();
                if (maxProduceMaterial != null) {
                    focusUnit.addAndValidateCurrentProduceMaterial(targetUnit.getCurrentProduceMaterial());
                }
            }

            {
                focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));
            }

            {
                const maxAmmo = focusUnit.getFlareMaxAmmo();
                if (maxAmmo != null) {
                    focusUnit.setFlareCurrentAmmo(Math.min(
                        maxAmmo,
                        getExisted(focusUnit.getFlareCurrentAmmo()) + getExisted(targetUnit.getFlareCurrentAmmo())
                    ));
                }
            }

            {
                focusUnit.setGroupedTagId(focusUnit.getGroupedTagId() | targetUnit.getGroupedTagId());
            }

            {
                for (const buff of targetUnit.getBuffList() ?? []) {
                    focusUnit.addBuff(buff.clone(), false, true);
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });
            unitMap.getView().removeUnit(targetUnit.getView());
            targetUnit.stopRunning();
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitJoinUnit): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${getText(TextType.B0103)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
