import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwCommonSettingManager from "../interface/IBwCommonSettingManager.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type * as ProtoSchemaCommonProtoWarRulePlayerRule from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type * as ProtoSchemaCommonProtoWarRuleWarRuleCommonData from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForCommon from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as TurnsUtils from "../../turns/Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarOperationsConstants from "../../warOperations/Constants.ts";
import * as WarOperationsUtils from "../../warOperations/Utils.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarRulesUtilsInstance from "../../warRules/utils/Instance.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

type TemplateWarRule        = ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;

export class BwCommonSettingManager implements BaseWarInterfaceIBwCommonSettingManager.IBwCommonSettingManager {
    private _war?               : BaseWarInterfaceIBwWar.IBwWar;
    private _settingsForCommon? : ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon;

    public init({ settings, warType, playersCountUnneutral, gameConfig, mapSize }: {
        settings                : ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon;
        warType                 : WarTypesConstants.WarTypeId;
        playersCountUnneutral   : number;
        gameConfig              : GameConfigGcData.GcData;
        mapSize                 : AuxiliaryTypesMapSize.MapSize;
    }): void {
        const configVersion = settings.getConfigVersion();
        if (configVersion !== gameConfig.getVersion()) {
            throw HelpersMisc.newError(`Invalid configVersion: ${configVersion}`, UtilsClientErrorCode.ClientErrorCode.BwCommonSettingManager_Init_00);
        }

        if (warType === WarTypesConstants.WarTypeId.Me) {
            // 在地图编辑器里，玩家数量固定为最大值（为了方便处理某些编辑逻辑），因此warRule实际上是不正确的，因此要重写init函数，去除父类中对warRule的合法性检查，否则地图会无法加载
            const instanceWarRule = settings.getInstanceWarRule();
            if (instanceWarRule == null) {
                throw HelpersMisc.newError(`Invalid configVersion: ${configVersion}`, UtilsClientErrorCode.ClientErrorCode.MeCommonSettingManager_Init_00);
            }

            instanceWarRule.setWarEventFullData(instanceWarRule.getWarEventFullData() ?? new ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData());
            this._setSettingsForCommon(settings);

        } else {
            const errorCodeForWarRule = WarRulesUtilsInstance.getErrorCode({
                instanceWarRule         : HelpersMisc.getExisted(settings.getInstanceWarRule(), UtilsClientErrorCode.ClientErrorCode.BwCommonSettingManager_Init_01),
                gameConfig              : gameConfig,
                playersCountUnneutral   : playersCountUnneutral,
                warType                 : warType,
                mapSize                 : mapSize,
            });
            if (errorCodeForWarRule) {
                throw HelpersMisc.newError(`Invalid warRule.`, errorCodeForWarRule);
            }

            {
                const turnsLimit = settings.getTurnsLimit();
                if (!TurnsUtils.checkIsValidTurnsLimit(turnsLimit)) {
                    throw HelpersMisc.newError(`Invalid turnsLimit: ${turnsLimit}`, UtilsClientErrorCode.ClientErrorCode.BwCommonSettingManager_Init_02);
                }
            }

            {
                const warOperationsLimit = settings.getWarOperationsLimit();
                if (!WarOperationsUtils.checkIsValidWarOperationsLimit(warOperationsLimit)) {
                    throw HelpersMisc.newError(`Invalid warOperationsLimit: ${warOperationsLimit}`, UtilsClientErrorCode.ClientErrorCode.BwCommonSettingManager_Init_03);
                }
            }

            this._setSettingsForCommon(settings);
        }
    }

    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon {
        const war = this._getWar();
        if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            const templateWarRule   = war.getRevisedTemplateWarRuleArray(war.getField().getMaxPlayerIndex())[0];
            const settingsForCommon = war.getCommonSettingManager().getSettingsForCommon();
            return ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon.fromJson({
                turnsLimit          : TurnsConstants.TurnIndex.DefaultLimit,
                warOperationsLimit  : WarOperationsConstants.Common.DefaultLimit,
                configVersion       : settingsForCommon.getConfigVersion(),
                instanceWarRule     : WarRulesUtilsInstance.create({
                    templateWarRule             : templateWarRule,
                    warEventFullData            : settingsForCommon.getInstanceWarRule()?.getWarEventFullData(),
                    taskObjectiveFullData       : war.getTaskObjectiveFullData(),
                    allMapSimpleDialogueArray   : war.getMapSimpleDialogueArray(),
                }).toJson(),
            });

        } else {
            return this.getSettingsForCommon().clone();
        }
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon {
        return this.serializeForCreateSfw();
    }
    public serializeForCreateSfwWithTemplateWarRule(templateWarRule: TemplateWarRule): ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon {
        const war = this._getWar();
        if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            const settingsForCommon         = war.getCommonSettingManager().getSettingsForCommon();
            const allMapSimpleDialogueArray = war.getMapSimpleDialogueArray();
            return ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon.fromJson({
                turnsLimit          : TurnsConstants.TurnIndex.DefaultLimit,
                warOperationsLimit  : WarOperationsConstants.Common.DefaultLimit,
                configVersion       : settingsForCommon.getConfigVersion(),
                instanceWarRule     : WarRulesUtilsInstance.create({
                    templateWarRule             : templateWarRule,
                    warEventFullData            : settingsForCommon.getInstanceWarRule()?.getWarEventFullData(),
                    taskObjectiveFullData       : war.getTaskObjectiveFullData(),
                    allMapSimpleDialogueArray   : HelpersCollection.getNonNullElements(templateWarRule
                        .getMapSimpleDialogueIdArray()
                        .map(id => allMapSimpleDialogueArray.find(data => (data.getDialogueId() ?? 0) === id))
                    ),
                }).toJson(),
            });

        } else {
            throw HelpersMisc.newError(`Invalid war type: ${war.getWarType()}`);
        }
    }
    public serializeForCreateMfwWithTemplateWarRule(templateWarRule: TemplateWarRule): ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon {
        const war = this._getWar();
        if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            const settingsForCommon = war.getCommonSettingManager().getSettingsForCommon();
            return ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon.fromJson({
                turnsLimit          : TurnsConstants.TurnIndex.DefaultLimit,
                warOperationsLimit  : WarOperationsConstants.Common.DefaultLimit,
                configVersion       : settingsForCommon.getConfigVersion(),
                instanceWarRule     : WarRulesUtilsInstance.create({
                    templateWarRule             : templateWarRule,
                    warEventFullData            : settingsForCommon.getInstanceWarRule()?.getWarEventFullData(),
                    taskObjectiveFullData       : war.getTaskObjectiveFullData(),
                    allMapSimpleDialogueArray   : war.getMapSimpleDialogueArray(),
                }).toJson(),
            });

        } else {
            throw HelpersMisc.newError(`Invalid war type: ${war.getWarType()}`);
        }
    }

    public startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void {
        this._setWar(war);
    }

    private _setWar(war: BaseWarInterfaceIBwWar.IBwWar): void {
        this._war = war;
    }
    protected _getWar(): BaseWarInterfaceIBwWar.IBwWar {
        return HelpersMisc.getExisted(this._war);
    }

    protected _setSettingsForCommon(settings: ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon): void {
        this._settingsForCommon = settings;
    }
    public getSettingsForCommon(): ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon {
        return HelpersMisc.getExisted(this._settingsForCommon, UtilsClientErrorCode.ClientErrorCode.BwCommonSettingManager_GetSettingsForCommon_00);
    }
    public getTurnsLimit(): number {
        return this.getSettingsForCommon().getTurnsLimit();
    }
    public getWarOperationsLimit(): number {
        return this.getSettingsForCommon().getWarOperationsLimit();
    }

    public getInstanceWarRule(): ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule {
        return HelpersMisc.getExisted(this.getSettingsForCommon().getInstanceWarRule());
    }
    public getWarRuleCommonData(): ProtoSchemaCommonProtoWarRuleWarRuleCommonData.WarRuleCommonData {
        return HelpersMisc.getExisted(this.getInstanceWarRule().getWarRuleCommonData());
    }

    public getSettingsHasFogByDefault(): boolean {
        return this.getInstanceWarRule().getWarRuleCommonData()?.getHasFogByDefault() ?? false;
    }
    public getSettingsDefaultWeatherType(): number {
        return WarRulesUtilsCommonData.getDefaultWeatherType(this.getWarRuleCommonData(), this._getWar().getGcData());
    }

    public getPlayerRule(playerIndex: number): ProtoSchemaCommonProtoWarRulePlayerRule.PlayerRule {
        return WarRulesUtilsCommonData.getPlayerRule(this.getWarRuleCommonData(), playerIndex);
    }
}
