import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as PlayerRulesConstants from "../../playerRules/Constants.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarRulePlayerRule from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type * as ProtoSchemaCommonProtoWarRuleWarRuleCommonData from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import * as TilesUtilsCommon from "../../tiles/utils/Common.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type PlayerRuleSchema           = ProtoSchemaCommonProtoWarRulePlayerRule.PlayerRule;
type WarRuleCommonDataSchema    = ProtoSchemaCommonProtoWarRuleWarRuleCommonData.WarRuleCommonData;
type GcData                     = GameConfigGcData.GcData;

export function getPlayerRule(data: WarRuleCommonDataSchema, playerIndex: number): PlayerRuleSchema {
    if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
        return PlayerRulesConstants.NeutralPlayerRule;
    }

    return HelpersMisc.getExisted(data.getPlayerRuleList().find(v => v.getPlayerIndex() === playerIndex));
}

export function getPlayersCountUnneutral(data: WarRuleCommonDataSchema): number {
    return data.getPlayerRuleList().length;
}

export function getDefaultWeatherType(data: WarRuleCommonDataSchema, gameConfig: GcData): number {
    return data.getDefaultWeatherType() ?? gameConfig.getDefaultWeatherType();
}
export function tickDefaultWeatherType(data: WarRuleCommonDataSchema, gcData: GcData): void {
    const typeArray = gcData.getAllWeatherTypeArray();
    data.setDefaultWeatherType(typeArray[(typeArray.indexOf(getDefaultWeatherType(data, gcData)) + 1) % typeArray.length]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getErrorCode(data: WarRuleCommonDataSchema, gcData: GcData): UtilsClientErrorCode.ClientErrorCode {
    {
        const defaultWeatherType = getDefaultWeatherType(data, gcData);
        if ((defaultWeatherType != null)                            &&
            (!gcData.checkIsValidWeatherType(defaultWeatherType))
        ) {
            return UtilsClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForGlobalParams_00;
        }
    }

    {
        const value = data.getFixedTileTheme();
        if ((value != null)                                 &&
            (!TilesUtilsCommon.checkIsValidThemeId(value))
        ) {
             return UtilsClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForRuleForGlobalParams_01;
        }
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}

export function checkIsSame(data1: WarRuleCommonDataSchema, data2: WarRuleCommonDataSchema): boolean {
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
            if (!PlayerRulesUtils.checkIsSame(arr1[i], arr2[i])) {
                return false;
            }
        }
    }

    return true;
}
