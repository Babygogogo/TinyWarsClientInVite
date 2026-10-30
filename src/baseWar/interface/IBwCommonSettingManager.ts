import {
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_MapSize,
    type WarTypes_Constants,
} from "../../internal.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type { WarRuleCommonData } from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import type { SettingsForCommon } from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";

export interface IBwCommonSettingManager {
    init({ settings, warType, playersCountUnneutral, gameConfig, mapSize }: {
        settings                : SettingsForCommon;
        warType                 : WarTypes_Constants.WarTypeId;
        playersCountUnneutral   : number;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
    }): void;

    serializeForCreateSfw(): SettingsForCommon;
    serializeForCreateMfr(): SettingsForCommon;
    serializeForCreateSfwWithTemplateWarRule(templateWarRule: TemplateWarRule): SettingsForCommon;
    serializeForCreateMfwWithTemplateWarRule(templateWarRule: TemplateWarRule): SettingsForCommon;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;

    getSettingsForCommon(): SettingsForCommon;
    getTurnsLimit(): number;
    getWarOperationsLimit(): number;

    getInstanceWarRule(): InstanceWarRule;
    getWarRuleCommonData(): WarRuleCommonData;

    getSettingsHasFogByDefault(): boolean;
    getSettingsDefaultWeatherType(): number;

    getPlayerRule(playerIndex: number): PlayerRule;
}
