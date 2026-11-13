import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
    type Players_Player,
    Utils_ClientErrorCode,
    Visibilities_Constants,
} from "../../../internal";
import type { CoSkillCfg } from "../../../proto/schema/CommonProto/Config/CoSkillCfg";
import type { DataForUseCoSkill } from "../../../proto/schema/CommonProto/Structure/DataForUseCoSkill";

export function exeChangeWeatherWithExtraData({ skillCfg, player, skillData, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    skillData       : DataForUseCoSkill;
    isFastExecute   : boolean;
}): void {
    const cfg = skillCfg.getInstantManual()?.getChangeWeather();
    if (cfg) {
        const war               = player.getWar();
        const playerIndex       = player.getPlayerIndex();
        const weatherManager    = war.getWeatherManager();
        const fogMap            = war.getFogMap();
        const hasFog            = fogMap.checkHasFogCurrently();
        weatherManager.setForceWeatherType(Helpers_Misc.getExisted(skillData.getNewWeatherType(), Utils_ClientErrorCode.ClientErrorCode.WarCoSkillHelpers_ExeChangeWeatherWithExtraData_00));
        weatherManager.setExpirePlayerIndex(playerIndex);
        weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + (cfg.getTurns()));
        // war.getFogMap().resetMapFromPathsForPlayer(playerIndex);
        if ((!hasFog) && (fogMap.checkHasFogCurrently()) && (cfg.getKeepVision())) {
            const mapSize           = fogMap.getMapSize();
            const visibilityArray   : Visibilities_Constants.VisibilityTypeId[] = new Array(mapSize.getWidth() * mapSize.getHeight());
            visibilityArray.fill(Visibilities_Constants.VisibilityTypeId.Penetrating);
            fogMap.resetMapFromPathsForPlayer(playerIndex, visibilityArray);
        }

        if (!isFastExecute) {
            weatherManager.getView()?.resetView(false);
        }
    }
}

export function exeChangeWeatherWithoutExtraData({ skillCfg, player, skillData, isFastExecute }: {
    skillCfg        : CoSkillCfg;
    player          : Players_Player.Player;
    skillData       : DataForUseCoSkill;
    isFastExecute   : boolean;
}): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const cfg           = skillCfg.getInstantManual()?.getChangeWeather();
    if (cfg) {
        const war               = player.getWar();
        const playerIndex       = player.getPlayerIndex();
        const weatherManager    = war.getWeatherManager();
        const fogMap            = war.getFogMap();
        const hasFog            = fogMap.checkHasFogCurrently();
        weatherManager.setForceWeatherType(Helpers_Misc.getExisted(skillData.getNewWeatherType(), Utils_ClientErrorCode.ClientErrorCode.WarCoSkillHelpers_ExeChangeWeatherWithoutExtraData_00));
        weatherManager.setExpirePlayerIndex(playerIndex);
        weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + (cfg.getTurns()));
        // war.getFogMap().resetMapFromPathsForPlayer(playerIndex);
        if ((!hasFog) && (fogMap.checkHasFogCurrently()) && (cfg.getKeepVision())) {
            const mapSize           = fogMap.getMapSize();
            const visibilityArray   : Visibilities_Constants.VisibilityTypeId[] = new Array(mapSize.getWidth() * mapSize.getHeight());
            visibilityArray.fill(Visibilities_Constants.VisibilityTypeId.Penetrating);
            fogMap.resetMapFromPathsForPlayer(playerIndex, visibilityArray);
        }

        if (!isFastExecute) {
            weatherManager.getView()?.resetView(false);
        }
    }
    return changedThings;
}
