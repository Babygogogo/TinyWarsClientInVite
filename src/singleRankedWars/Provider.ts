import {
    GameConfigs_Provider,
    Helpers_Misc,
    SinglePlayerWars_War,
    SingleRankedWars_War,
    Utils_ClientErrorCode,
} from "../internal.ts";

import type { SpmWarSaveSlotExtraData } from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

let _outerWar: SinglePlayerWars_War.War | undefined;
let _innerWar: SinglePlayerWars_War.War | undefined;

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
    unloadWar();

    const innerData = warData.clone();
    const innerWar  = createWarByWarData(innerData, false);
    innerWar.setSaveSlotIndex(slotIndex);
    innerWar.setSaveSlotExtraData(slotExtraData?.clone());
    innerWar.init(innerData, await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(innerData.getSettingsForCommon()?.getConfigVersion())));
    innerWar.startRunning().startRunningView();

    const teamIndexes = new Set<number>(innerWar.getHumanPlayers().map(v => v.getTeamIndex()));
    if (teamIndexes.size !== 1) {
        throw Helpers_Misc.newError(`Invalid teamIndexes: ${teamIndexes.size}`);
    }

    const outerData = innerWar.serializeForTeamIndexes(teamIndexes);
    const outerWar  = createWarByWarData(outerData, true);
    outerWar.setSaveSlotIndex(slotIndex);
    outerWar.setSaveSlotExtraData(slotExtraData?.clone());
    outerWar.init(outerData, await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(outerData.getSettingsForCommon()?.getConfigVersion())));
    outerWar.startRunning().startRunningView();

    setWars(outerWar, innerWar);
    return outerWar;
}

export function unloadWar(): void {
    getOuterWar()?.dispose();
    getInnerWar()?.dispose();
    setWars(undefined, undefined);
}

export function getOuterWar(): SinglePlayerWars_War.War | undefined {
    return _outerWar;
}
export function getInnerWar(): SinglePlayerWars_War.War | undefined {
    return _innerWar;
}
function setWars(outerWar: SinglePlayerWars_War.War | undefined, innerWar: SinglePlayerWars_War.War | undefined): void {
    _outerWar = outerWar;
    _innerWar = innerWar;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Util functions.
////////////////////////////////////////////////////////////////////////////////////////////////////
function createWarByWarData(warData: SerialWar, isNeedView: boolean): SinglePlayerWars_War.War {
    if (warData.getSettingsForSrw()) {
        return new SingleRankedWars_War.War(isNeedView);
    } else {
        throw Helpers_Misc.newError(`Invalid warData.`, Utils_ClientErrorCode.ClientErrorCode.SpwModel_CreateWarByWarData_00);
    }
}
