import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { destroyUnitOnMap } from "../../../destructions/Utils.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoPlayerDeleteUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerDeleteUnit.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoPlayerDeleteUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerDeleteUnit(war, action);
    } else {
        await normalExePlayerDeleteUnit(war, action);
    }
}

function fastExePlayerDeleteUnit(war: IBwWar, action: WoPlayerDeleteUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExePlayerDeleteUnit_00),
            isFastExecute   : true,
        });
    } else {
        const gridIndex = getExisted(GridIndex.convertGridIndex(action.getGridIndex()));
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            if (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) {
                war.getFogMap().updateMapFromPathsByUnitAndPath({
                    unit            : focusUnit,
                    unitVisionInfo  : focusUnit.getVisionInfo(),
                    path            : [gridIndex],
                });
            }

            destroyUnitOnMap(war, gridIndex, false);
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExePlayerDeleteUnit(war: IBwWar, action: WoPlayerDeleteUnit): Promise<void> {
    // const desc = await war.getDescForExePlayerDeleteUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExePlayerDeleteUnit_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const gridIndex = getExisted(GridIndex.convertGridIndex(action.getGridIndex()));
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            if (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) {
                war.getFogMap().updateMapFromPathsByUnitAndPath({
                    unit            : focusUnit,
                    unitVisionInfo  : focusUnit.getVisionInfo(),
                    path            : [gridIndex],
                });
            }

            destroyUnitOnMap(war, gridIndex, true);
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoPlayerDeleteUnit): Promise<string | null> {
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
        return `${getText(TextType.B0081)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
