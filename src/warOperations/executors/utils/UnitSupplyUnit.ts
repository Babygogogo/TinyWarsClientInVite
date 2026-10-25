import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoUnitSupplyUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSupplyUnit.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

type IBwUnit            = IUnit;
let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitSupplyUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitSupplyUnit(war, action);
    } else {
        await normalExeUnitSupplyUnit(war, action);
    }
}

function fastExeUnitSupplyUnit(war: IBwWar, action: WoUnitSupplyUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war             : war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitSupplyUnit_00),
            isFastExecute   : true,
        });
    } else {
        const revisedPath   = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

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

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitSupplyUnit(war: IBwWar, action: WoUnitSupplyUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitSupplyUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitSupplyUnit_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const revisedPath   = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

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
            const suppliedUnits : IBwUnit[] = [];
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

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitSupplyUnit): Promise<string | null> {
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
        return `${getText(TextType.B0107)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
