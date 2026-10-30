import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { NeutralPlayerRule } from "../../playerRules/Constants.ts";
import { checkIsSame as checkPlayerRulesIsSame } from "../../playerRules/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { WarRuleCommonData } from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import { checkIsValidThemeId } from "../../tiles/utils/Common.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export function getPlayerRule(data: WarRuleCommonData, playerIndex: number): PlayerRule {
    if (playerIndex === PlayerIndex.Neutral) {
        return NeutralPlayerRule;
    }

    return getExisted(data.getPlayerRuleList().find(v => v.getPlayerIndex() === playerIndex));
}

export function getPlayersCountUnneutral(data: WarRuleCommonData): number {
    return data.getPlayerRuleList().length;
}

export function getDefaultWeatherType(data: WarRuleCommonData, gameConfig: GameConfig): number {
    return data.getDefaultWeatherType() ?? gameConfig.getDefaultWeatherType();
}
export function tickDefaultWeatherType(data: WarRuleCommonData, gcData: GameConfig): void {
    const typeArray = gcData.getAllWeatherTypeArray();
    data.setDefaultWeatherType(typeArray[(typeArray.indexOf(getDefaultWeatherType(data, gcData)) + 1) % typeArray.length]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getErrorCode(data: WarRuleCommonData, gcData: GameConfig): ClientErrorCode {
    {
        const defaultWeatherType = getDefaultWeatherType(data, gcData);
        if ((defaultWeatherType != null)                            &&
            (!gcData.checkIsValidWeatherType(defaultWeatherType))
        ) {
            return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForGlobalParams_00;
        }
    }

    {
        const value = data.getFixedTileTheme();
        if ((value != null)                                 &&
            (!checkIsValidThemeId(value))
        ) {
             return ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForGlobalParams_01;
        }
    }

    return ClientErrorCode.NoError;
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
            if (!checkPlayerRulesIsSame(arr1[i], arr2[i])) {
                return false;
            }
        }
    }

    return true;
}
