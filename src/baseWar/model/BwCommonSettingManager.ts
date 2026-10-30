import {
    MapEditor_Model_MeWar,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwCommonSettingManager,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_MapSize,
    Turns_Utils,
    WarOperations_Utils,
    Utils_ClientErrorCode,
    WarOperations_Constants,
    WarRules_Utils_Instance,
    WarRules_Utils_CommonData,
    Helpers_Misc,
    Helpers_Collection,
    Turns_Constants,
    WarTypes_Constants,
} from "../../internal.ts";

import { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type { WarRuleCommonData } from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import { SettingsForCommon } from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";

export class BwCommonSettingManager implements BaseWar_Interface_IBwCommonSettingManager.IBwCommonSettingManager {
    private _war?               : BaseWar_Interface_IBwWar.IBwWar;
    private _settingsForCommon? : SettingsForCommon;

    public init({ settings, warType, playersCountUnneutral, gameConfig, mapSize }: {
        settings                : SettingsForCommon;
        warType                 : WarTypes_Constants.WarTypeId;
        playersCountUnneutral   : number;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
    }): void {
        const configVersion = settings.getConfigVersion();
        if (configVersion !== gameConfig.getVersion()) {
            throw Helpers_Misc.newError(`Invalid configVersion: ${configVersion}`, Utils_ClientErrorCode.ClientErrorCode.BwCommonSettingManager_Init_00);
        }

        if (warType === WarTypes_Constants.WarTypeId.Me) {
            // 在地图编辑器里，玩家数量固定为最大值（为了方便处理某些编辑逻辑），因此warRule实际上是不正确的，因此要重写init函数，去除父类中对warRule的合法性检查，否则地图会无法加载
            const instanceWarRule = settings.getInstanceWarRule();
            if (instanceWarRule == null) {
                throw Helpers_Misc.newError(`Invalid configVersion: ${configVersion}`, Utils_ClientErrorCode.ClientErrorCode.MeCommonSettingManager_Init_00);
            }

            instanceWarRule.setWarEventFullData(instanceWarRule.getWarEventFullData() ?? new WarEventFullData());
            this._setSettingsForCommon(settings);

        } else {
            const errorCodeForWarRule = WarRules_Utils_Instance.getErrorCode({
                instanceWarRule         : Helpers_Misc.getExisted(settings.getInstanceWarRule(), Utils_ClientErrorCode.ClientErrorCode.BwCommonSettingManager_Init_01),
                gameConfig              : gameConfig,
                playersCountUnneutral   : playersCountUnneutral,
                warType                 : warType,
                mapSize                 : mapSize,
            });
            if (errorCodeForWarRule) {
                throw Helpers_Misc.newError(`Invalid warRule.`, errorCodeForWarRule);
            }

            {
                const turnsLimit = settings.getTurnsLimit();
                if (!Turns_Utils.checkIsValidTurnsLimit(turnsLimit)) {
                    throw Helpers_Misc.newError(`Invalid turnsLimit: ${turnsLimit}`, Utils_ClientErrorCode.ClientErrorCode.BwCommonSettingManager_Init_02);
                }
            }

            {
                const warOperationsLimit = settings.getWarOperationsLimit();
                if (!WarOperations_Utils.checkIsValidWarOperationsLimit(warOperationsLimit)) {
                    throw Helpers_Misc.newError(`Invalid warOperationsLimit: ${warOperationsLimit}`, Utils_ClientErrorCode.ClientErrorCode.BwCommonSettingManager_Init_03);
                }
            }

            this._setSettingsForCommon(settings);
        }
    }

    public serializeForCreateSfw(): SettingsForCommon {
        const war = this._getWar();
        if (war instanceof MapEditor_Model_MeWar.MeWar) {
            const templateWarRule   = war.getRevisedTemplateWarRuleArray(war.getField().getMaxPlayerIndex())[0];
            const settingsForCommon = war.getCommonSettingManager().getSettingsForCommon();
            return SettingsForCommon.fromJson({
                turnsLimit          : Turns_Constants.TurnIndex.DefaultLimit,
                warOperationsLimit  : WarOperations_Constants.Common.DefaultLimit,
                configVersion       : settingsForCommon.getConfigVersion(),
                instanceWarRule     : WarRules_Utils_Instance.create({
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
    public serializeForCreateMfr(): SettingsForCommon {
        return this.serializeForCreateSfw();
    }
    public serializeForCreateSfwWithTemplateWarRule(templateWarRule: TemplateWarRule): SettingsForCommon {
        const war = this._getWar();
        if (war instanceof MapEditor_Model_MeWar.MeWar) {
            const settingsForCommon         = war.getCommonSettingManager().getSettingsForCommon();
            const allMapSimpleDialogueArray = war.getMapSimpleDialogueArray();
            return SettingsForCommon.fromJson({
                turnsLimit          : Turns_Constants.TurnIndex.DefaultLimit,
                warOperationsLimit  : WarOperations_Constants.Common.DefaultLimit,
                configVersion       : settingsForCommon.getConfigVersion(),
                instanceWarRule     : WarRules_Utils_Instance.create({
                    templateWarRule             : templateWarRule,
                    warEventFullData            : settingsForCommon.getInstanceWarRule()?.getWarEventFullData(),
                    taskObjectiveFullData       : war.getTaskObjectiveFullData(),
                    allMapSimpleDialogueArray   : Helpers_Collection.getNonNullElements(templateWarRule
                        .getMapSimpleDialogueIdArray()
                        .map(id => allMapSimpleDialogueArray.find(data => (data.getDialogueId()) === id))
                    ),
                }).toJson(),
            });

        } else {
            throw Helpers_Misc.newError(`Invalid war type: ${war.getWarType()}`);
        }
    }
    public serializeForCreateMfwWithTemplateWarRule(templateWarRule: TemplateWarRule): SettingsForCommon {
        const war = this._getWar();
        if (war instanceof MapEditor_Model_MeWar.MeWar) {
            const settingsForCommon = war.getCommonSettingManager().getSettingsForCommon();
            return SettingsForCommon.fromJson({
                turnsLimit          : Turns_Constants.TurnIndex.DefaultLimit,
                warOperationsLimit  : WarOperations_Constants.Common.DefaultLimit,
                configVersion       : settingsForCommon.getConfigVersion(),
                instanceWarRule     : WarRules_Utils_Instance.create({
                    templateWarRule             : templateWarRule,
                    warEventFullData            : settingsForCommon.getInstanceWarRule()?.getWarEventFullData(),
                    taskObjectiveFullData       : war.getTaskObjectiveFullData(),
                    allMapSimpleDialogueArray   : war.getMapSimpleDialogueArray(),
                }).toJson(),
            });

        } else {
            throw Helpers_Misc.newError(`Invalid war type: ${war.getWarType()}`);
        }
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._setWar(war);
    }

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    protected _getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    protected _setSettingsForCommon(settings: SettingsForCommon): void {
        this._settingsForCommon = settings;
    }
    public getSettingsForCommon(): SettingsForCommon {
        return Helpers_Misc.getExisted(this._settingsForCommon, Utils_ClientErrorCode.ClientErrorCode.BwCommonSettingManager_GetSettingsForCommon_00);
    }
    public getTurnsLimit(): number {
        return this.getSettingsForCommon().getTurnsLimit();
    }
    public getWarOperationsLimit(): number {
        return this.getSettingsForCommon().getWarOperationsLimit();
    }

    public getInstanceWarRule(): InstanceWarRule {
        return Helpers_Misc.getExisted(this.getSettingsForCommon().getInstanceWarRule());
    }
    public getWarRuleCommonData(): WarRuleCommonData {
        return Helpers_Misc.getExisted(this.getInstanceWarRule().getWarRuleCommonData());
    }

    public getSettingsHasFogByDefault(): boolean {
        return this.getInstanceWarRule().getWarRuleCommonData()?.getHasFogByDefault() ?? false;
    }
    public getSettingsDefaultWeatherType(): number {
        return WarRules_Utils_CommonData.getDefaultWeatherType(this.getWarRuleCommonData(), this._getWar().getGcData());
    }

    public getPlayerRule(playerIndex: number): PlayerRule {
        return WarRules_Utils_CommonData.getPlayerRule(this.getWarRuleCommonData(), playerIndex);
    }
}
