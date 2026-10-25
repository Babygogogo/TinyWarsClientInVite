import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted, newError } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoUnitLaunchFlare } from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitLaunchFlare, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitLaunchFlare(war, action);
    } else {
        await normalExeUnitLaunchFlare(war, action);
    }
}

function fastExeUnitLaunchFlare(war: IBwWar, action: WoUnitLaunchFlare): void {
    const fogMap            = war.getFogMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitLaunchFlare_01),
            isFastExecute   : true,
        });
    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        if (!path.isBlocked) {
            focusUnit.setFlareCurrentAmmo(getExisted(focusUnit.getFlareCurrentAmmo()) - 1);
            fogMap.updateMapFromPathsByFlare(
                focusUnit.getPlayerIndex(),
                getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex())),
                getExisted(focusUnit.getFlareRadius(pathNodes[pathNodes.length - 1]))
            );
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitLaunchFlare(war: IBwWar, action: WoUnitLaunchFlare): Promise<void> {
    // const desc = await war.getDescForExeUnitLaunchFlare(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const mapSize           = war.getTileMap().getMapSize();
    const fogMap            = war.getFogMap();
    const playerIndexInTurn = war.getPlayerIndexInTurn();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        const targetGridIndex   = GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        if (targetGridIndex) {
            const flareRadius = getExisted(actionExtraData.getFlareRadius(), ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_01);
            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: flareRadius, mapSize })) {
                gridVisualEffect.showEffectFlare(grid);
            }
        }

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        const isFlareSucceeded  = !path.isBlocked;
        const flareRadius       = getExisted(focusUnit.getFlareRadius(pathNodes[pathNodes.length - 1]));
        const targetGridIndex   = GridIndex.convertGridIndex(action.getTargetGridIndex());
        if (isFlareSucceeded) {
            if (targetGridIndex == null) {
                throw newError(`Empty targetGridIndex.`, ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_02);
            }

            focusUnit.setFlareCurrentAmmo(getExisted(focusUnit.getFlareCurrentAmmo()) - 1);
            fogMap.updateMapFromPathsByFlare(playerIndexInTurn, targetGridIndex, flareRadius);
        }

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : path.isBlocked,
            aiming              : null,
            updateViewAfterMove : true,
        });
        if ((isFlareSucceeded) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()))) {
            if (targetGridIndex == null) {
                throw newError(`Empty targetGridIndex.`, ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_03);
            }

            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: flareRadius, mapSize })) {
                gridVisualEffect.showEffectFlare(grid);
            }
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitLaunchFlare): Promise<string | null> {
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
        return `${getText(TextType.B0104)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
