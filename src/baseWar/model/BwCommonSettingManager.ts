import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { IBwCommonSettingManager } from "../interface/IBwCommonSettingManager.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getMeWarClass } from "../../gameHelpers/GhFactory.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { newError, getExisted } from "../../helpers/Misc.ts";
import { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type {
    TemplateWarRule as ProtoSchemaCommonProtoWarRuleTemplateWarRule,
} from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type { WarRuleCommonData } from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import { SettingsForCommon } from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import { TurnIndex } from "../../turns/Constants.ts";
import { checkIsValidTurnsLimit } from "../../turns/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { Common } from "../../warOperations/Constants.ts";
import { checkIsValidWarOperationsLimit } from "../../warOperations/Utils.ts";
import { getDefaultWeatherType, getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { getErrorCode, create } from "../../warRules/utils/Instance.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

type TemplateWarRule        = ProtoSchemaCommonProtoWarRuleTemplateWarRule;

export class BwCommonSettingManager implements IBwCommonSettingManager {
    private _war?               : IBwWar;
    private _settingsForCommon? : SettingsForCommon;

    public init({ settings, warType, playersCountUnneutral, gameConfig, mapSize }: {
        settings                : SettingsForCommon;
        warType                 : WarTypeId;
        playersCountUnneutral   : number;
        gameConfig              : GcData;
        mapSize                 : MapSize;
    }): void {
        const configVersion = settings.getConfigVersion();
        if (configVersion !== gameConfig.getVersion()) {
            throw newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.BwCommonSettingManager_Init_00);
        }

        if (warType === WarTypeId.Me) {
            // 在地图编辑器里，玩家数量固定为最大值（为了方便处理某些编辑逻辑），因此warRule实际上是不正确的，因此要重写init函数，去除父类中对warRule的合法性检查，否则地图会无法加载
            const instanceWarRule = settings.getInstanceWarRule();
            if (instanceWarRule == null) {
                throw newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.MeCommonSettingManager_Init_00);
            }

            instanceWarRule.setWarEventFullData(instanceWarRule.getWarEventFullData() ?? new WarEventFullData());
            this._setSettingsForCommon(settings);

        } else {
            const errorCodeForWarRule = getErrorCode({
                instanceWarRule         : getExisted(settings.getInstanceWarRule(), ClientErrorCode.BwCommonSettingManager_Init_01),
                gameConfig              : gameConfig,
                playersCountUnneutral   : playersCountUnneutral,
                warType                 : warType,
                mapSize                 : mapSize,
            });
            if (errorCodeForWarRule) {
                throw newError(`Invalid warRule.`, errorCodeForWarRule);
            }

            {
                const turnsLimit = settings.getTurnsLimit();
                if (!checkIsValidTurnsLimit(turnsLimit)) {
                    throw newError(`Invalid turnsLimit: ${turnsLimit}`, ClientErrorCode.BwCommonSettingManager_Init_02);
                }
            }

            {
                const warOperationsLimit = settings.getWarOperationsLimit();
                if (!checkIsValidWarOperationsLimit(warOperationsLimit)) {
                    throw newError(`Invalid warOperationsLimit: ${warOperationsLimit}`, ClientErrorCode.BwCommonSettingManager_Init_03);
                }
            }

            this._setSettingsForCommon(settings);
        }
    }

    public serializeForCreateSfw(): SettingsForCommon {
        const war = this._getWar();
        if (war instanceof getMeWarClass()) {
            const templateWarRule   = war.getRevisedTemplateWarRuleArray(war.getField().getMaxPlayerIndex())[0];
            const settingsForCommon = war.getCommonSettingManager().getSettingsForCommon();
            return SettingsForCommon.fromJson({
                turnsLimit          : TurnIndex.DefaultLimit,
                warOperationsLimit  : Common.DefaultLimit,
                configVersion       : settingsForCommon.getConfigVersion(),
                instanceWarRule     : create({
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
        if (war instanceof getMeWarClass()) {
            const settingsForCommon         = war.getCommonSettingManager().getSettingsForCommon();
            const allMapSimpleDialogueArray = war.getMapSimpleDialogueArray();
            return SettingsForCommon.fromJson({
                turnsLimit          : TurnIndex.DefaultLimit,
                warOperationsLimit  : Common.DefaultLimit,
                configVersion       : settingsForCommon.getConfigVersion(),
                instanceWarRule     : create({
                    templateWarRule             : templateWarRule,
                    warEventFullData            : settingsForCommon.getInstanceWarRule()?.getWarEventFullData(),
                    taskObjectiveFullData       : war.getTaskObjectiveFullData(),
                    allMapSimpleDialogueArray   : getNonNullElements(templateWarRule
                        .getMapSimpleDialogueIdArray()
                        .map(id => allMapSimpleDialogueArray.find(data => (data.getDialogueId() ?? 0) === id))
                    ),
                }).toJson(),
            });

        } else {
            throw newError(`Invalid war type: ${war.getWarType()}`);
        }
    }
    public serializeForCreateMfwWithTemplateWarRule(templateWarRule: TemplateWarRule): SettingsForCommon {
        const war = this._getWar();
        if (war instanceof getMeWarClass()) {
            const settingsForCommon = war.getCommonSettingManager().getSettingsForCommon();
            return SettingsForCommon.fromJson({
                turnsLimit          : TurnIndex.DefaultLimit,
                warOperationsLimit  : Common.DefaultLimit,
                configVersion       : settingsForCommon.getConfigVersion(),
                instanceWarRule     : create({
                    templateWarRule             : templateWarRule,
                    warEventFullData            : settingsForCommon.getInstanceWarRule()?.getWarEventFullData(),
                    taskObjectiveFullData       : war.getTaskObjectiveFullData(),
                    allMapSimpleDialogueArray   : war.getMapSimpleDialogueArray(),
                }).toJson(),
            });

        } else {
            throw newError(`Invalid war type: ${war.getWarType()}`);
        }
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    protected _getWar(): IBwWar {
        return getExisted(this._war);
    }

    protected _setSettingsForCommon(settings: SettingsForCommon): void {
        this._settingsForCommon = settings;
    }
    public getSettingsForCommon(): SettingsForCommon {
        return getExisted(this._settingsForCommon, ClientErrorCode.BwCommonSettingManager_GetSettingsForCommon_00);
    }
    public getTurnsLimit(): number {
        return this.getSettingsForCommon().getTurnsLimit();
    }
    public getWarOperationsLimit(): number {
        return this.getSettingsForCommon().getWarOperationsLimit();
    }

    public getInstanceWarRule(): InstanceWarRule {
        return getExisted(this.getSettingsForCommon().getInstanceWarRule());
    }
    public getWarRuleCommonData(): WarRuleCommonData {
        return getExisted(this.getInstanceWarRule().getWarRuleCommonData());
    }

    public getSettingsHasFogByDefault(): boolean {
        return this.getInstanceWarRule().getWarRuleCommonData()?.getHasFogByDefault() ?? false;
    }
    public getSettingsDefaultWeatherType(): number {
        return getDefaultWeatherType(this.getWarRuleCommonData(), this._getWar().getGcData());
    }

    public getPlayerRule(playerIndex: number): PlayerRule {
        return getPlayerRule(this.getWarRuleCommonData(), playerIndex);
    }
}
