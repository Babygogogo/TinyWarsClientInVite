import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
} from "../../../internal.ts";

export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    const war               = Helpers_Misc.getExisted(turnManager.getWar());
    const weatherManager    = war.getWeatherManager();
    weatherManager.updateOnPlayerTurnSwitched(!isFastExecute);
    war.getFogMap().updateOnPlayerTurnSwitched();

    if (!isFastExecute) {
        weatherManager.getView()?.resetView(false);
    }
}

export function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war               = Helpers_Misc.getExisted(turnManager.getWar());
    const weatherManager    = war.getWeatherManager();
    weatherManager.updateOnPlayerTurnSwitched(!isFastExecute);
    war.getFogMap().updateOnPlayerTurnSwitched();

    if (!isFastExecute) {
        weatherManager.getView()?.resetView(false);
    }

    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}
