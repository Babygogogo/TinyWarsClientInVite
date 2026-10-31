import {
    MapEditor_Model_MeWar,
    AuxiliaryTypes_MovePath,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
    type Units_Unit,
} from "../../../internal.ts";

import type { WoUnitSupplyUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSupplyUnit.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitSupplyUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitSupplyUnit(war, action);
    } else {
        await normalExeUnitSupplyUnit(war, action);
    }
}

function fastExeUnitSupplyUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitSupplyUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitSupplyUnit_00),
            isFastExecute   : true,
        });
    } else {
        const revisedPath   = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        const isBlocked = revisedPath.isBlocked;
        if (isBlocked) {
            // nothing to do.
        } else {
            const playerIndex = focusUnit.getPlayerIndex();
            for (const gridIndex of pathNodes[pathNodes.length - 1].getAdjacentGrids(unitMap.getMapSize())) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                    unit.addCurrentFuel(unit.getUsedFuel());
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(unit.getPrimaryWeaponUsedAmmo() ?? 0);
                    unit.addFlareCurrentAmmo(unit.getFlareUsedAmmo() ?? 0);
                }
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitSupplyUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitSupplyUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitSupplyUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitSupplyUnit_00);
        await war.moveExtraUnit({
            movingUnitAndPath     : commonExtraData.getMovingUnitAndPath(),
            aiming                : null,
            deleteViewAfterMoving : true,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const revisedPath   = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        const isBlocked = revisedPath.isBlocked;
        if (isBlocked) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const suppliedUnits : Units_Unit.Unit[] = [];
            const playerIndex   = focusUnit.getPlayerIndex();
            for (const gridIndex of pathNodes[pathNodes.length - 1].getAdjacentGrids(unitMap.getMapSize())) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                    const offsetFuel                = unit.getUsedFuel();
                    const offsetPrimaryWeaponAmmo   = unit.getPrimaryWeaponUsedAmmo() ?? 0;
                    const offsetFlareAmmo           = unit.getFlareUsedAmmo() ?? 0;
                    unit.addCurrentFuel(offsetFuel);
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(offsetPrimaryWeaponAmmo);
                    unit.addFlareCurrentAmmo(offsetFlareAmmo);

                    if ((offsetFuel !== 0) || (offsetPrimaryWeaponAmmo !== 0) || (offsetFlareAmmo !== 0)) {
                        suppliedUnits.push(unit);
                    }
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

            const gridVisionEffect = war.getGridVisualEffect();
            for (const unit of suppliedUnits) {
                unit.updateView();
                gridVisionEffect.showEffectSupply(unit.getGridIndex());
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitSupplyUnit): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0107)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
