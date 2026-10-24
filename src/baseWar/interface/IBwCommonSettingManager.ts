import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "./IBwWar.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type * as ProtoSchemaCommonProtoWarRulePlayerRule from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type * as ProtoSchemaCommonProtoWarRuleWarRuleCommonData from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForCommon from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import type * as WarTypesConstants from "../../warTypes/Constants.ts";

type SettingsForCommon  = ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon;
type TemplateWarRule    = ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;

export interface IBwCommonSettingManager {
    init({ settings, warType, playersCountUnneutral, gameConfig, mapSize }: {
        settings                : SettingsForCommon;
        warType                 : WarTypesConstants.WarTypeId;
        playersCountUnneutral   : number;
        gameConfig              : GameConfigGcData.GcData;
        mapSize                 : AuxiliaryTypesMapSize.MapSize;
    }): void;

    serializeForCreateSfw(): SettingsForCommon;
    serializeForCreateMfr(): SettingsForCommon;
    serializeForCreateSfwWithTemplateWarRule(templateWarRule: TemplateWarRule): SettingsForCommon;
    serializeForCreateMfwWithTemplateWarRule(templateWarRule: TemplateWarRule): SettingsForCommon;

    startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void;

    getSettingsForCommon(): SettingsForCommon;
    getTurnsLimit(): number;
    getWarOperationsLimit(): number;

    getInstanceWarRule(): ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule;
    getWarRuleCommonData(): ProtoSchemaCommonProtoWarRuleWarRuleCommonData.WarRuleCommonData;

    getSettingsHasFogByDefault(): boolean;
    getSettingsDefaultWeatherType(): number;

    getPlayerRule(playerIndex: number): ProtoSchemaCommonProtoWarRulePlayerRule.PlayerRule;
}
