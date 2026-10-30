import {
    Tiles_Utils_Common,
    PlayerRules_Utils,
    Utils_ClientErrorCode,
    Helpers_Misc,
    PlayerRules_Constants,
    Players_Constants,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { WarRuleCommonData } from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";

export function getPlayerRule(data: WarRuleCommonData, playerIndex: number): PlayerRule {
    if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
        return PlayerRules_Constants.NeutralPlayerRule;
    }

    return Helpers_Misc.getExisted(data.getPlayerRuleList().find(v => v.getPlayerIndex() === playerIndex));
}

export function getPlayersCountUnneutral(data: WarRuleCommonData): number {
    return data.getPlayerRuleList().length;
}

export function getDefaultWeatherType(data: WarRuleCommonData, gameConfig: GameConfigs_GameConfig.GameConfig): number {
    return data.getDefaultWeatherType() ?? gameConfig.getDefaultWeatherType();
}
export function tickDefaultWeatherType(data: WarRuleCommonData, gcData: GameConfigs_GameConfig.GameConfig): void {
    const typeArray = gcData.getAllWeatherTypeArray();
    data.setDefaultWeatherType(typeArray[(typeArray.indexOf(getDefaultWeatherType(data, gcData)) + 1) % typeArray.length]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getErrorCode(data: WarRuleCommonData, gcData: GameConfigs_GameConfig.GameConfig): Utils_ClientErrorCode.ClientErrorCode {
    {
        const defaultWeatherType = getDefaultWeatherType(data, gcData);
        if ((defaultWeatherType != null)                            &&
            (!gcData.checkIsValidWeatherType(defaultWeatherType))
        ) {
            return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForGlobalParams_00;
        }
    }

    {
        const value = data.getFixedTileTheme();
        if ((value != null)                                 &&
            (!Tiles_Utils_Common.checkIsValidThemeId(value))
        ) {
             return Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForGlobalParams_01;
        }
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function checkIsSame(data1: WarRuleCommonData, data2: WarRuleCommonData): boolean {
    if (data1.getDefaultWeatherType() != data2.getDefaultWeatherType()) {
        return false;
    }
    if (data1.getHasFogByDefault() !== data2.getHasFogByDefault()) {
        return false;
    }
    // if (data1.getFixedTileTheme() != data2.getFixedTileTheme()) {
    //     return false;
    // }

    {
        const arr1      = data1.getPlayerRuleList();
        const arr2      = data2.getPlayerRuleList();
        const length    = arr1.length;
        if (length != arr2.length) {
            return false;
        }

        for (let i = 0; i < length; ++i) {
            if (!PlayerRules_Utils.checkIsSame(arr1[i], arr2[i])) {
                return false;
            }
        }
    }

    return true;
}
