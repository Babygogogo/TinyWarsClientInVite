import {
    Campaigns_Wars_War,
    GameConfigs_Provider,
    Helpers_Misc,
    Logger,
    SingleCustomWar_Model_ScwWar,
    SingleFreeWar_Model_SfwWar,
    SinglePlayerWars_War,
    SingleRankWar_Model_SrwWar,
    Utils_ClientErrorCode,
} from "../internal.ts";

import type { SpmWarSaveSlotExtraData } from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

let _war: SinglePlayerWars_War.War | null = null;

export function init(): void {
    // nothing to do.
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for managing war.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function loadWar({ warData, slotIndex, slotExtraData }: {
    warData         : SerialWar;
    slotIndex       : number | null;
    slotExtraData   : SpmWarSaveSlotExtraData | null;
}): Promise<SinglePlayerWars_War.War> {
    if (getWar()) {
        Logger.warn(`SpwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const data  = warData.clone();
    const war   = createWarByWarData(data);
    war.setSaveSlotIndex(slotIndex);
    war.setSaveSlotExtraData(slotExtraData?.clone());
    war.init(data, await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(data.getSettingsForCommon()?.getConfigVersion())));
    war.startRunning().startRunningView();
    setWar(war);

    return war;
}

export function unloadWar(): void {
    const war = getWar();
    if (war) {
        war.dispose();
        setWar(null);
    }
}

export function getWar(): SinglePlayerWars_War.War | null {
    return _war;
}
function setWar(war: SinglePlayerWars_War.War | null): void {
    _war = war;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Util functions.
////////////////////////////////////////////////////////////////////////////////////////////////////
function createWarByWarData(warData: SerialWar): SinglePlayerWars_War.War {
    if (warData.getSettingsForScw()) {
        return new SingleCustomWar_Model_ScwWar.ScwWar(true);
    } else if (warData.getSettingsForSfw()) {
        return new SingleFreeWar_Model_SfwWar.SfwWar(true);
    } else if (warData.getSettingsForSrw()) {
        return new SingleRankWar_Model_SrwWar.SrwWar(true);
    } else if (warData.getSettingsForCaw()) {
        return new Campaigns_Wars_War.War(true);
    } else {
        throw Helpers_Misc.newError(`Invalid warData.`, Utils_ClientErrorCode.ClientErrorCode.SpwModel_CreateWarByWarData_00);
    }
}
