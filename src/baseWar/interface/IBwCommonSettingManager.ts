import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "./IBwWar.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type { WarRuleCommonData } from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import type { SettingsForCommon } from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import type { WarTypeId } from "../../warTypes/Constants.ts";

export interface IBwCommonSettingManager {
    init({ settings, warType, playersCountUnneutral, gameConfig, mapSize }: {
        settings                : SettingsForCommon;
        warType                 : WarTypeId;
        playersCountUnneutral   : number;
        gameConfig              : GameConfig;
        mapSize                 : MapSize;
    }): void;

    serializeForCreateSfw(): SettingsForCommon;
    serializeForCreateMfr(): SettingsForCommon;
    serializeForCreateSfwWithTemplateWarRule(templateWarRule: TemplateWarRule): SettingsForCommon;
    serializeForCreateMfwWithTemplateWarRule(templateWarRule: TemplateWarRule): SettingsForCommon;

    startRunning(war: IBwWar): void;

    getSettingsForCommon(): SettingsForCommon;
    getTurnsLimit(): number;
    getWarOperationsLimit(): number;

    getInstanceWarRule(): InstanceWarRule;
    getWarRuleCommonData(): WarRuleCommonData;

    getSettingsHasFogByDefault(): boolean;
    getSettingsDefaultWeatherType(): number;

    getPlayerRule(playerIndex: number): PlayerRule;
}
