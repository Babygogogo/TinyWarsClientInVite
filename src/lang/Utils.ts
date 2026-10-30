import { PhaseId } from "../autoTourneys/Constants.ts";
import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { TimerTypeId } from "../bootTimers/Constants.ts";
import { PublicChannelId } from "../chat/Constants.ts";
import { EnergyTypeId } from "../cos/Constants.ts";
import { SkillTypeId } from "../coSkills/Constants.ts";
import { SmallDialogueSideId } from "../dialogues/Constants.ts";
import {
    ContextType,
    ResultType,
} from "../expressionParsers/Enums.ts";
import { ForcedFogCode } from "../fogMaps/Constants.ts";
import { GameConfig } from "../gameConfigs/GameConfig.ts";
import { ModeId } from "../gameModes/Constants.ts";
import { TypeName } from "../gameVersions/Constants.ts";
import { newError } from "../helpers/Misc.ts";
import {
    format,
    getNumText,
} from "../helpers/Text.ts";
import { getLanguageType } from "../localData/Storage.ts";
import { DrawerMode } from "../mapEditors/Constants.ts";
import {
    ReviewStatus,
    SortType,
} from "../maps/Constants.ts";
import { MedalTypeId } from "../medals/Constants.ts";
import { getMedalCfg } from "../medals/Utils.ts";
import { MultiPlayerRoomType } from "../multiPlayerRooms/Constants.ts";
import { RuleTypeId } from "../playerRules/Constants.ts";
import { AliveStateId } from "../players/Constants.ts";
import type { LanguageText } from "../proto/schema/CommonProto/Structure/LanguageText.ts";
import { getBgmSfxCfg } from "../sounds/Utils.ts";
import { BuffTypeId as TileBuffsBuffTypeId } from "../tileBuffs/Constants.ts";
import { getTileDecorationCfg } from "../tileDecorations/Utils.ts";
import { getTileObjectCfg } from "../tileObjects/Utils.ts";
import {
    ObjectTypeId,
    ThemeTypeId,
    TileTypeId,
} from "../tiles/constants/Common.ts";
import { PhaseCode } from "../turns/Constants.ts";
import { BuffTypeId as UnitBuffTypeId } from "../unitBuffs/Constants.ts";
import {
    ActionStateId,
    ActionTypeId as UnitsActionTypeId,
    AiModeId,
} from "../units/Constants.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { ServerErrorCode } from "../utils/ServerErrorCode.ts";
import { ComparatorId } from "../valueAndComparators/Constants.ts";
import { SetRelationId } from "../valueSetAndRelations/Constants.ts";
import {
    BuffEndTimeModificationMode,
    CategoryId,
    ActionTypeId as WarEventActionTypeId,
} from "../warEvents/actions/constants/Common.ts";
import { ConditionTypeId } from "../warEvents/conditions/Constants.ts";
import { BasicSettingsTypeId } from "../wars/Constants.ts";
import { WarTypeId } from "../warTypes/Constants.ts";
import { CommonText } from "./CommonText.ts";
import {
    LanguageType,
    TextType,
    UndefinedError,
} from "./Constants.ts";
import { ErrorText } from "./ErrorText.ts";

let _languageType = LanguageType.Chinese;
export function init(): void {
    setCurrentLanguageType(getLanguageType());
}

export function getCurrentLanguageType(): LanguageType {
    return _languageType;
}
export function setCurrentLanguageType(language: LanguageType): void {
    _languageType = language;
}
export function getSecondaryLanguageType(t = getCurrentLanguageType()): LanguageType {
    switch (t) {
        case LanguageType.Chinese   : return LanguageType.English;
        case LanguageType.English   : return LanguageType.Chinese;  // TODO
        case LanguageType.Spanish   : return LanguageType.English;
        default                     : return LanguageType.English;
    }
}
export function getLanguageTypeName(type: LanguageType): string | null {
    switch (type) {
        case LanguageType.Chinese   : return getText(TextType.B0624, LanguageType.Chinese);
        case LanguageType.English   : return getText(TextType.B0625, LanguageType.English);
        case LanguageType.Spanish   : return getText(TextType.B1435, LanguageType.Spanish);
        default                     : return null;
    }
}

export function checkIsValidLanguageType(t: Undefinable<number>): boolean {
    return (t === LanguageType.Chinese)
        || (t === LanguageType.English)
        || (t === LanguageType.Spanish);
}
export function checkIsValidLanguageTextArray({ list, minTextLength, maxTextLength, minTextCount }: {
    list            : LanguageText[];
    minTextLength   : number;
    maxTextLength   : number;
    minTextCount    : number;
}): boolean {
    if (list.length <= 0) {
        return minTextCount <= 0;
    }

    const languageTypeSet = new Set<number>();
    for (const data of list) {
        const languageType = data.getLanguageType();
        if ((languageType == null)                      ||
            (!checkIsValidLanguageType(languageType))   ||
            (languageTypeSet.has(languageType))
        ) {
            return false;
        }
        languageTypeSet.add(languageType);

        const text = data.getText();
        if ((text == null) || (text !== text.trim())) {
            return false;
        }

        const length = text.length;
        if ((length > maxTextLength) || (length < minTextLength)) {
            return false;
        }
    }

    return true;
}

export function getText(t: TextType, languageType = getCurrentLanguageType()): string {
    const data = CommonText[t];
    const text = data ? data[languageType] : null;
    if (text != null) {
        return text;
    } else {
        throw newError(`getText() empty text: ${t} ${languageType}`, ClientErrorCode.Lang_GetText_00);
    }
}

export function getFormattedText(t: TextType, ...params: (Undefinable<number | string>)[]): string {
    if ((t < TextType.F0000) || (t >= TextType.R0000)) {
        throw newError(`getFormattedText() invalid t:${t}`);
    }

    const data = getText(t);
    return data === UndefinedError
        ? UndefinedError
        : format(data, ...params);
}

export function getErrorText(code: ServerErrorCode | ClientErrorCode): string {
    const textList  = ErrorText[code];
    const text      = textList ? textList[_languageType] : null;
    return code === ServerErrorCode.UserGuestPrivilege_0000
        ? `${text || getText(TextType.A0153)}`
        : `${getText(TextType.B0452)} ${code}: ${text || getText(TextType.A0153)}`;
}

export function getTextForYesOrNo(value: unknown): string {
    return getText(value ? TextType.Yes : TextType.No);
}

export function getPlayerForceName(playerIndex: number): string {
    return `P${playerIndex}`;
}

export function getPlayerTeamName(teamIndex: number): string | null {
    switch (teamIndex) {
        case 0  : return getText(TextType.B0030);
        case 1  : return getText(TextType.B0008);
        case 2  : return getText(TextType.B0009);
        case 3  : return getText(TextType.B0010);
        case 4  : return getText(TextType.B0011);
        case 5  : return getText(TextType.B0699);
        case 6  : return getText(TextType.B0112);
        case 7  : return getText(TextType.B0113);
        case 8  : return getText(TextType.B0114);
        default : return null;
    }
}
export function getPlayerShortTeamName(teamIndex: number): string | null {
    switch (teamIndex) {
        case 0  : return ``;
        case 1  : return `A`;
        case 2  : return `B`;
        case 3  : return `C`;
        case 4  : return `D`;
        case 5  : return `E`;
        case 6  : return `F`;
        case 7  : return `G`;
        case 8  : return `H`;
        default : return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getWeatherName(weatherType: number, gameConfig: GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getWeatherCfg(weatherType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getWeatherDesc(weatherType: number, gameConfig: GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getWeatherCfg(weatherType)?.getDescTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getWeatherFullDesc(gameConfig: GameConfig): string {
    const textArray: string[] = [];
    for (const weatherType of gameConfig.getAllWeatherTypeArray()) {
        textArray.push(`${getWeatherName(weatherType, gameConfig)}: ${getWeatherDesc(weatherType, gameConfig)}`);
    }
    return getFormattedText(TextType.F0200, textArray.join(`\n`));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getTileBaseName(tileBaseType: number, gameConfig: GameConfig): string | null {
    const tileType = gameConfig.getTileType(tileBaseType, ObjectTypeId.Empty);
    return tileType == null ? null : getTileName(tileType, gameConfig);
}

export function getTileThemeName(tileTheme: number | null): string | null {
    switch (tileTheme) {
        case ThemeTypeId.Normal     : return getText(TextType.B0701);
        case ThemeTypeId.Rain       : return getText(TextType.B0704);
        case ThemeTypeId.Sandstorm  : return getText(TextType.B0702);
        case ThemeTypeId.Snow       : return getText(TextType.B0703);
        case null                       : return getText(TextType.B0890);
        default                         : return null;
    }
}

export function getTileBuffName(buffType: number): string | null {
    switch (buffType) {
        case TileBuffsBuffTypeId.NoProduction    : return getText(TextType.B1240);
        case TileBuffsBuffTypeId.NoIncome        : return getText(TextType.B1230);
        case TileBuffsBuffTypeId.Custom          : return getText(TextType.B0321);
        default                             : return null;
    }
}

export function getTileBuffDesc(buffType: number): string | null {
    switch (buffType) {
        case TileBuffsBuffTypeId.NoProduction    : return getText(TextType.A0770);
        case TileBuffsBuffTypeId.NoIncome        : return getText(TextType.A0740);
        case TileBuffsBuffTypeId.Custom          : return getText(TextType.A0970);
        default                             : return null;
    }
}

export function getTileBuffExtraParamDesc(buffType: number): string | null {
    switch (buffType) {
        case TileBuffsBuffTypeId.NoProduction    : return getText(TextType.A0745);
        case TileBuffsBuffTypeId.NoIncome        : return getText(TextType.A0745);
        case TileBuffsBuffTypeId.Custom          : return getText(TextType.A0745);
        default                             : return null;
    }
}

export function getTileName(tileType: TileTypeId, gameConfig: GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getTileTemplateCfg(tileType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getTileObjectName(tileObjectType: number, gameConfig: GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = getTileObjectCfg(tileObjectType)?.nameTextId;
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getTileDecorationName(tileDecorationType: number, gameConfig: GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = getTileDecorationCfg(tileDecorationType)?.nameTextId;
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getUnitName(unitType: number, gameConfig: GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getUnitTemplateCfg(unitType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getUnitCategoryName(unitCategory: number, gameConfig: GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getUnitCategoryCfg(unitCategory)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getUnitActionName(actionType: UnitsActionTypeId): string | null{
    switch (actionType) {
        case UnitsActionTypeId.BeLoaded        : return getText(TextType.B0037);
        case UnitsActionTypeId.Join            : return getText(TextType.B0038);
        case UnitsActionTypeId.UseCoPower      : return getText(TextType.B0142);
        case UnitsActionTypeId.UseCoSuperPower : return getText(TextType.B0144);
        case UnitsActionTypeId.Attack          : return getText(TextType.B0039);
        case UnitsActionTypeId.CaptureTile         : return getText(TextType.B0040);
        case UnitsActionTypeId.CrushUnit       : return getText(TextType.B1350);
        case UnitsActionTypeId.Dive            : return getText(TextType.B0041);
        case UnitsActionTypeId.RepairUnit      : return getText(TextType.B1351);
        case UnitsActionTypeId.Surface         : return getText(TextType.B0042);
        case UnitsActionTypeId.BuildTile       : return getText(TextType.B0043);
        case UnitsActionTypeId.SelfDetonate    : return getText(TextType.B1349);
        case UnitsActionTypeId.Supply          : return getText(TextType.B0044);
        case UnitsActionTypeId.LaunchUnit      : return getText(TextType.B0045);
        case UnitsActionTypeId.DropUnit        : return getText(TextType.B0046);
        case UnitsActionTypeId.LaunchFlare     : return getText(TextType.B0047);
        case UnitsActionTypeId.LaunchSilo      : return getText(TextType.B0048);
        case UnitsActionTypeId.CoBoard         : return getText(TextType.B0139);
        case UnitsActionTypeId.ProduceUnit     : return getText(TextType.B0049);
        case UnitsActionTypeId.Wait            : return getText(TextType.B0050);
        default                             : return null;
    }
}

export function getUnitAiModeName(mode: AiModeId): string | null {
    switch (mode) {
        case AiModeId.NoMove                : return getText(TextType.B0721);
        case AiModeId.Normal                : return getText(TextType.B0723);
        case AiModeId.WaitUntilCanAttack    : return getText(TextType.B0722);
        default                                     : return null;
    }
}

export function getUnitBuffName(buffTypeId: number): string | null {
    switch (buffTypeId) {
        case UnitBuffTypeId.Fire      : return getText(TextType.B1307);
        case UnitBuffTypeId.Disease   : return getText(TextType.B1465);
        case UnitBuffTypeId.Custom    : return getText(TextType.B0321);
        default                                         : return null;
    }
}

export function getUnitBuffDesc(buffType: number): string | null {
    switch (buffType) {
        case UnitBuffTypeId.Fire      : return getText(TextType.A0968);
        case UnitBuffTypeId.Disease   : return getText(TextType.A0969);
        case UnitBuffTypeId.Custom    : return getText(TextType.A0970);
        default                                         : return null;
    }
}

export function getUnitBuffExtraParamDesc(buffType: number): string | null {
    switch (buffType) {
        case UnitBuffTypeId.Fire      : return getText(TextType.A0745);
        case UnitBuffTypeId.Disease   : return getText(TextType.A0745);
        case UnitBuffTypeId.Custom    : return getText(TextType.A0745);
        default                                         : return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getMoveTypeName(moveType: number, gameConfig: GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId = gameConfig.getMoveTypeCfg(moveType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getBgmSfxName(bgmCode: number, gameConfig: GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId = getBgmSfxCfg(bgmCode)?.nameTextId;
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getWarTypeName(type: WarTypeId): string | null {
    switch (type) {
        case WarTypeId.McwStd     : return getText(TextType.B0417);
        case WarTypeId.McwFog     : return getText(TextType.B0418);
        case WarTypeId.Me         : return getText(TextType.B0271);
        case WarTypeId.MrwStd     : return getText(TextType.B0415);
        case WarTypeId.MrwFog     : return getText(TextType.B0416);
        case WarTypeId.MmwStd     : return getText(TextType.B1014);
        case WarTypeId.MmwFog     : return getText(TextType.B1015);
        case WarTypeId.AtwStd     : return getText(TextType.B1023);
        case WarTypeId.AtwFog     : return getText(TextType.B1024);
        case WarTypeId.MfwStd     : return getText(TextType.B0812);
        case WarTypeId.MfwFog     : return getText(TextType.B0813);
        case WarTypeId.ScwStd     : return getText(TextType.B0417);
        case WarTypeId.ScwFog     : return getText(TextType.B0418);
        case WarTypeId.SfwStd     : return getText(TextType.B0612);
        case WarTypeId.SfwFog     : return getText(TextType.B0613);
        case WarTypeId.CcwStd     : return getText(TextType.B0725);
        case WarTypeId.CcwFog     : return getText(TextType.B0726);
        case WarTypeId.SrwStd     : return getText(TextType.B0257);
        case WarTypeId.SrwFog     : return getText(TextType.B0817);
        case WarTypeId.CampStd    : return getText(TextType.B0093);
        case WarTypeId.CampFog    : return getText(TextType.B0118);
        default                 : return null;
    }
}

export function getWarBasicSettingsName(type: BasicSettingsTypeId): string | null {
    switch (type) {
        case BasicSettingsTypeId.NormalMapId                     : return getText(TextType.B0225);
        case BasicSettingsTypeId.WarName                   : return getText(TextType.B0185);
        case BasicSettingsTypeId.WarPassword               : return getText(TextType.B0186);
        case BasicSettingsTypeId.WarComment                : return getText(TextType.B0187);
        case BasicSettingsTypeId.WarRuleTitle              : return getText(TextType.B0318);
        case BasicSettingsTypeId.HasFog                    : return getText(TextType.B0020);
        case BasicSettingsTypeId.Weather                   : return getText(TextType.Weather);
        case BasicSettingsTypeId.TileTheme                 : return getText(TextType.B1113);
        case BasicSettingsTypeId.WarEvent                  : return getText(TextType.B0469);
        case BasicSettingsTypeId.TurnsAndWarOperationsLimit   : return getText(TextType.B0987);
        case BasicSettingsTypeId.TimerType                 : return getText(TextType.B0574);
        case BasicSettingsTypeId.TimerRegularParam         : return getText(TextType.B0021);
        case BasicSettingsTypeId.TimerIncrementalParams    : return getText(TextType.B0990);
        case BasicSettingsTypeId.SpmSaveSlotIndex          : return getText(TextType.B0255);
        case BasicSettingsTypeId.SpmSaveSlotComment        : return getText(TextType.B0605);
        default                                             : return null;
    }
}

export function getRoomTypeName(roomType: MultiPlayerRoomType): string | null {
    switch (roomType) {
        case MultiPlayerRoomType.Atr   : return getText(TextType.B1022);
        case MultiPlayerRoomType.Ccr   : return getText(TextType.B0646);
        case MultiPlayerRoomType.Mcr   : return getText(TextType.B1011);
        case MultiPlayerRoomType.Mfr   : return getText(TextType.B0557);
        case MultiPlayerRoomType.Mmr   : return getText(TextType.B1012);
        case MultiPlayerRoomType.Mrr   : return getText(TextType.B0404);
        default             : return null;
    }
}

export function getMapReviewStatusText(status: ReviewStatus): string | null{
    switch (status) {
        case ReviewStatus.None         : return getText(TextType.B0273);
        case ReviewStatus.Reviewing    : return getText(TextType.B0274);
        case ReviewStatus.Rejected     : return getText(TextType.B0275);
        case ReviewStatus.Accepted     : return getText(TextType.B0276);
        default                                 : return null;
    }
}

export function getMapEditorDrawerModeText(mode: DrawerMode): string | null{
    switch (mode) {
        case DrawerMode.Preview                : return getText(TextType.B0286);
        case DrawerMode.DrawUnit               : return getText(TextType.B0281);
        case DrawerMode.DrawTileBase           : return getText(TextType.B0282);
        case DrawerMode.DrawTileDecoration     : return getText(TextType.B0662);
        case DrawerMode.DrawTileObject         : return getText(TextType.B0283);
        case DrawerMode.DeleteUnit             : return getText(TextType.B0284);
        case DrawerMode.DeleteTileDecoration   : return getText(TextType.B0661);
        case DrawerMode.DeleteTileObject       : return getText(TextType.B0285);
        case DrawerMode.AddTileToLocation      : return getText(TextType.B0759);
        case DrawerMode.DeleteTileFromLocation : return getText(TextType.B0760);
        default                                         : return null;
    }
}

export function getUnitActionStateText(state: ActionStateId): string | null{
    switch (state) {
        case ActionStateId.Acted  : return getText(TextType.B0368);
        case ActionStateId.Idle   : return getText(TextType.B0369);
        default                     : return null;
    }
}

export function getChatChannelName(channel: PublicChannelId, languageType: LanguageType = getCurrentLanguageType()): string | null {
    switch (channel) {
        case PublicChannelId.System   : return getText(TextType.B0374, languageType);
        case PublicChannelId.PublicEn : return getText(TextType.B0373, languageType);
        case PublicChannelId.PublicCn : return getText(TextType.B0384, languageType);
        default                         : return null;
    }
}

export function getUnitAndTileSkinName(skinId: number): string | null {
    switch (skinId) {
        case 0  : return "";
        case 1  : return getText(TextType.B0004);
        case 2  : return getText(TextType.B0005);
        case 3  : return getText(TextType.B0006);
        case 4  : return getText(TextType.B0007);
        case 5  : return getText(TextType.B0700);
        case 6  : return getText(TextType.B0115);
        case 7  : return getText(TextType.B0116);
        case 8  : return getText(TextType.B0117);
        default : return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getCoEnergyTypeName(coEnergyType: EnergyTypeId): string | null {
    switch (coEnergyType) {
        case EnergyTypeId.Dor       : return getText(TextType.B1269);
        case EnergyTypeId.Trilogy   : return getText(TextType.B1270);
        default                     : return null;
    }
}

export function getCoSkillTypeName(skillType: SkillTypeId): string | null {
    switch (skillType) {
        case SkillTypeId.Passive      : return getText(TextType.B0576);
        case SkillTypeId.Power        : return getText(TextType.B0577);
        case SkillTypeId.SuperPower   : return getText(TextType.B0578);
        default                             : return null;
    }
}

export function getCoSkillDescArray({ coId, skillType, gameConfig, languageType, isExtra }: {
    coId            : number;
    skillType       : SkillTypeId;
    gameConfig      : GameConfig;
    languageType    : LanguageType;
    isExtra         : boolean;
}): string[] | null {
    const cfg = gameConfig.getCoSkillDescCfg(coId);
    if (cfg == null) {
        return null;
    }

    if (skillType === SkillTypeId.Passive) {
        if (isExtra) {
            switch (languageType) {
                case LanguageType.Chinese   : return cfg.getD2dExtra0();
                case LanguageType.English   : return cfg.getD2dExtra1();
                case LanguageType.Spanish   : return cfg.getD2dExtra2();
                default                     : return cfg.getD2dExtra1();
            }
        } else {
            switch (languageType) {
                case LanguageType.Chinese   : return cfg.getD2d0();
                case LanguageType.English   : return cfg.getD2d1();
                case LanguageType.Spanish   : return cfg.getD2d2();
                default                     : return cfg.getD2d1();
            }
        }
    } else if (skillType === SkillTypeId.Power) {
        if (isExtra) {
            switch (languageType) {
                case LanguageType.Chinese   : return cfg.getPExtra0();
                case LanguageType.English   : return cfg.getPExtra1();
                case LanguageType.Spanish   : return cfg.getPExtra2();
                default                     : return cfg.getPExtra1();
            }
        } else {
            switch (languageType) {
                case LanguageType.Chinese   : return cfg.getP0();
                case LanguageType.English   : return cfg.getP1();
                case LanguageType.Spanish   : return cfg.getP2();
                default                     : return cfg.getP1();
            }
        }
    } else if (skillType === SkillTypeId.SuperPower) {
        if (isExtra) {
            switch (languageType) {
                case LanguageType.Chinese   : return cfg.getSpExtra0();
                case LanguageType.English   : return cfg.getSpExtra1();
                case LanguageType.Spanish   : return cfg.getSpExtra2();
                default                     : return cfg.getSpExtra1();
            }
        } else {
            switch (languageType) {
                case LanguageType.Chinese   : return cfg.getSp0();
                case LanguageType.English   : return cfg.getSp1();
                case LanguageType.Spanish   : return cfg.getSp2();
                default                     : return cfg.getSp1();
            }
        }
    } else {
        return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getPlayerAliveStateName(state: AliveStateId): string | null {
    switch (state) {
        case AliveStateId.Alive   : return getText(TextType.B0471);
        case AliveStateId.Dead    : return getText(TextType.B0472);
        case AliveStateId.Dying   : return getText(TextType.B0473);
        default                             : return null;
    }
}

export function getTurnPhaseName(phaseCode: PhaseCode): string | null {
    switch (phaseCode) {
        case PhaseCode.WaitBeginTurn    : return getText(TextType.B0474);
        case PhaseCode.Main             : return getText(TextType.B0475);
        default                             : return null;
    }
}

export function getMapSimpleDialogueSideName(side: number): string | null {
    switch (side) {
        case SmallDialogueSideId.Top       : return getText(TextType.B1260);
        case SmallDialogueSideId.Bottom    : return getText(TextType.B1261);
        default                                         : return null;
    }
}

export function getWarEventConditionTypeName(type: ConditionTypeId): string | null {
    switch (type) {
        case ConditionTypeId.WecTurnAndPlayer                     : return getText(TextType.B0781);
        case ConditionTypeId.WecEventCalledCount                  : return getText(TextType.B0789);
        case ConditionTypeId.WecWeatherAndFog                     : return getText(TextType.B0794);
        case ConditionTypeId.WecPlayerPresence                    : return getText(TextType.B0786);
        case ConditionTypeId.WecTilePresence                      : return getText(TextType.B0779);
        case ConditionTypeId.WecUnitPresence                      : return getText(TextType.B0775);
        case ConditionTypeId.WecExpression                        : return getText(TextType.B1146);
        case ConditionTypeId.WecCustomCounter                     : return getText(TextType.B0802);
        case ConditionTypeId.WecOngoingPersistentActionPresence   : return getText(TextType.B0901);
        case ConditionTypeId.WecManualActionStatistics            : return getText(TextType.B0929);
        default                                                         : return null;
    }
}

export function getWarEventActionCategoryName(category: CategoryId): string | null {
    switch (category) {
        case CategoryId.UnitSimple                : return getText(TextType.B1058);
        case CategoryId.UnitExpr                  : return `${getText(TextType.B1058)} (${getText(TextType.B0129)})`;
        case CategoryId.TileSimple                : return getText(TextType.B1144);
        case CategoryId.TileExpr                  : return `${getText(TextType.B1144)} (${getText(TextType.B0129)})`;
        case CategoryId.PlayerSimple              : return getText(TextType.B0031);
        case CategoryId.PlayerExpr                : return `${getText(TextType.B0031)} (${getText(TextType.B0129)})`;
        case CategoryId.WeatherAndFogSimple       : return getText(TextType.B1345);
        case CategoryId.WeatherAndFogExpr         : return `${getText(TextType.B1345)} (${getText(TextType.B0129)})`;
        case CategoryId.ImageAndSoundSimple       : return getText(TextType.B1343);
        case CategoryId.ImageAndSoundExpr         : return `${getText(TextType.B1343)} (${getText(TextType.B0129)})`;
        case CategoryId.MiscSimple                : return getText(TextType.B1279);
        case CategoryId.MiscExpr                  : return `${getText(TextType.B1279)} (${getText(TextType.B0129)})`;
        default                                         : return null;
    }
}

export function getWarEventActionTypeName(type: WarEventActionTypeId): string | null {
    switch (type) {
        case WarEventActionTypeId.AddUnitOnMapSimple                          : return getText(TextType.B0617);
        case WarEventActionTypeId.FillUnitOnMapExpr                           : return getText(TextType.B1190);
        case WarEventActionTypeId.FillUnitOnMapSimple                         : return getText(TextType.B1059);
        case WarEventActionTypeId.FillUnitLoadedSimple                        : return getText(TextType.B1191);
        case WarEventActionTypeId.FillUnitLoadedExpr                          : return `${getText(TextType.B1191)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.DestroyUnitSimple                           : return getText(TextType.B1374);
        case WarEventActionTypeId.DestroyUnitExpr                             : return `${getText(TextType.B1374)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetUnitTypeSimple                           : return getText(TextType.B1192);
        case WarEventActionTypeId.SetUnitTypeExpr                             : return `${getText(TextType.B1192)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetUnitOwnershipSimple                      : return getText(TextType.B1193);
        case WarEventActionTypeId.SetUnitOwnershipExpr                        : return `${getText(TextType.B1193)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetUnitPositionSimple                       : return getText(TextType.B1198);
        case WarEventActionTypeId.SetUnitPositionExpr                         : return `${getText(TextType.B1198)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetUnitStateSimple                          : return getText(TextType.B0806);
        case WarEventActionTypeId.SetUnitStateExpr                            : return `${getText(TextType.B0806)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.AddUnitBuffSimple                           : return getText(TextType.B1466);
        case WarEventActionTypeId.ModifyUnitBuffSimple                        : return getText(TextType.B1467);
        case WarEventActionTypeId.DeleteUnitBuffSimple                        : return getText(TextType.B1469);
        case WarEventActionTypeId.SetTileTypeExpr                             : return `${getText(TextType.B0825)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetTileTypeSimple                           : return getText(TextType.B0825);
        case WarEventActionTypeId.SetTileStateExpr                            : return `${getText(TextType.B0861)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetTileStateSimple                          : return getText(TextType.B0861);
        case WarEventActionTypeId.SetCustomBuildingStateExpr                  : return `${getText(TextType.B1211)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetCustomBuildingStateSimple                : return getText(TextType.B1211);
        case WarEventActionTypeId.SetCustomCrystalStateExpr                   : return `${getText(TextType.B1208)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetCustomCrystalStateSimple                 : return getText(TextType.B1208);
        case WarEventActionTypeId.SetCustomCannonStateExpr                    : return `${getText(TextType.B1209)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetCustomCannonStateSimple                  : return getText(TextType.B1209);
        case WarEventActionTypeId.SetCustomLaserTurretStateExpr               : return `${getText(TextType.B1210)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetCustomLaserTurretStateSimple             : return getText(TextType.B1210);
        case WarEventActionTypeId.DeleteTileBuffExpr                          : return `${getText(TextType.B1234)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.DeleteTileBuffSimple                        : return getText(TextType.B1234);
        case WarEventActionTypeId.AddTileBuffExpr                             : return `${getText(TextType.B1238)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.AddTileBuffSimple                           : return getText(TextType.B1238);
        case WarEventActionTypeId.ModifyTileBuffExpr                          : return `${getText(TextType.B1239)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.ModifyTileBuffSimple                        : return getText(TextType.B1239);
        case WarEventActionTypeId.BigDialogueSimple                           : return getText(TextType.B0674);
        case WarEventActionTypeId.SetViewpointExpr                            : return `${getText(TextType.B0713)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetViewpointSimple                          : return getText(TextType.B0713);
        case WarEventActionTypeId.SetWeatherExpr                              : return `${getText(TextType.B0715)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetWeatherSimple                            : return getText(TextType.B0715);
        case WarEventActionTypeId.SetForceFogCodeExpr                         : return `${getText(TextType.B0795)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetForceFogCodeSimple                       : return getText(TextType.B0795);
        case WarEventActionTypeId.SetCustomCounters                           : return getText(TextType.B0800);
        case WarEventActionTypeId.SmallDialogueSimple                         : return getText(TextType.B0728);
        case WarEventActionTypeId.PlayBgm                                     : return getText(TextType.B0750);
        case WarEventActionTypeId.PlaySfx                                     : return getText(TextType.B1164);
        case WarEventActionTypeId.StopPersistentAction                        : return getText(TextType.B0887);
        case WarEventActionTypeId.SetPlayerStateExpr                          : return `${getText(TextType.B0810)} (${getText(TextType.B0129)})`;
        case WarEventActionTypeId.SetPlayerStateSimple                        : return getText(TextType.B0810);
        case WarEventActionTypeId.SetTaskObjectiveState                       : return getText(TextType.B1224);
        case WarEventActionTypeId.SetUnitMovePathVisibility                   : return getText(TextType.B1340);
        case WarEventActionTypeId.PersistentShowText                          : return getText(TextType.B0888);
        case WarEventActionTypeId.PersistentPlayBgm                           : return getText(TextType.B1083);
        case WarEventActionTypeId.PersistentModifyPlayerAttribute             : return getText(TextType.B0903);
        case WarEventActionTypeId.PersistentModifyUnitAttribute               : return getText(TextType.B1080);
        default                                                             : return null;
    }
}

export function getWarEventConditionNodeDesc(isNeedAnd: Undefinable<boolean>, isNeedFalse: Undefinable<boolean>): string {
    if (isNeedFalse) {
        return getText(isNeedAnd ? TextType.A0436 : TextType.A0091);
    } else {
        return getText(isNeedAnd ? TextType.A0162 : TextType.A0163);
    }
}

export function getPlayerRuleName(type: RuleTypeId): string | null {
    switch (type) {
        case RuleTypeId.TeamIndex                       : return getText(TextType.B0019);
        case RuleTypeId.BannedCoCategoryIdArray         : return getText(TextType.B0403);
        case RuleTypeId.BannedUnitTypeArray             : return getText(TextType.B0895);
        case RuleTypeId.CanActivateCoSkill              : return getText(TextType.B0897);
        case RuleTypeId.CanCoBoard                      : return getText(TextType.B1427);
        case RuleTypeId.CanUnitJoin                     : return getText(TextType.B1428);
        case RuleTypeId.InitialFund                     : return getText(TextType.B0178);
        case RuleTypeId.IncomeMultiplier                : return getText(TextType.B0179);
        case RuleTypeId.MaxUnitsCount                   : return getText(TextType.B1473);
        case RuleTypeId.EnergyAddPctOnCoBoard           : return getText(TextType.B0180);
        case RuleTypeId.EnergyLossPctOnCoDie            : return getText(TextType.B0127);
        case RuleTypeId.EnergyGrowthMultiplier          : return getText(TextType.B0181);
        case RuleTypeId.MoveRangeModifier               : return getText(TextType.B0182);
        case RuleTypeId.AttackPowerModifier             : return getText(TextType.B0183);
        case RuleTypeId.DefenseModifier                 : return getText(TextType.DefBonus$);
        case RuleTypeId.UnitVisionRangeModifier         : return getText(TextType.B0184);
        case RuleTypeId.TileVisionRangeModifier         : return getText(TextType.B1331);
        case RuleTypeId.LuckLowerLimit                  : return getText(TextType.B0189);
        case RuleTypeId.LuckUpperLimit                  : return getText(TextType.B0190);
        case RuleTypeId.McwHumanCoCategoryIdArray       : return getText(TextType.B1303);
        case RuleTypeId.MmwHumanCoCategoryIdArray       : return getText(TextType.B1304);
        case RuleTypeId.MrwHumanCoCategoryIdArray       : return getText(TextType.B1305);
        case RuleTypeId.AtwHumanCoCategoryIdArray       : return getText(TextType.B1306);
        case RuleTypeId.CcwHumanCoCategoryIdArray       : return getText(TextType.B1302);
        case RuleTypeId.CcwAiCoId                       : return getText(TextType.B1263);
        case RuleTypeId.WarRoomAiCoId                   : return getText(TextType.B1264);
        case RuleTypeId.WarRoomHumanCoCategoryIdArray   : return getText(TextType.B1265);
        case RuleTypeId.CampaignAiCoId                  : return getText(TextType.B0642);
        case RuleTypeId.CampaignHumanCoIdArray          : return getText(TextType.B0096);
        case RuleTypeId.CampaignSkinId                  : return getText(TextType.B1266);
        default                                             : return null;
    }
}
export function getPlayerRuleHelpText(ruleType: RuleTypeId): string | null {
    switch (ruleType) {
        case RuleTypeId.TeamIndex                       : return null;
        case RuleTypeId.BannedCoCategoryIdArray         : return null;
        case RuleTypeId.BannedUnitTypeArray             : return getText(TextType.A0805);
        case RuleTypeId.CanActivateCoSkill              : return null;
        case RuleTypeId.CanCoBoard                      : return null;
        case RuleTypeId.CanUnitJoin                     : return null;
        case RuleTypeId.InitialFund                     : return null;
        case RuleTypeId.IncomeMultiplier                : return null;
        case RuleTypeId.MaxUnitsCount                   : return getText(TextType.A0981);
        case RuleTypeId.EnergyAddPctOnCoBoard           : return null;
        case RuleTypeId.EnergyLossPctOnCoDie            : return null;
        case RuleTypeId.EnergyGrowthMultiplier          : return null;
        case RuleTypeId.MoveRangeModifier               : return null;
        case RuleTypeId.AttackPowerModifier             : return null;
        case RuleTypeId.DefenseModifier                 : return null;
        case RuleTypeId.UnitVisionRangeModifier         : return null;
        case RuleTypeId.TileVisionRangeModifier         : return null;
        case RuleTypeId.LuckLowerLimit                  : return null;
        case RuleTypeId.LuckUpperLimit                  : return null;
        case RuleTypeId.McwHumanCoCategoryIdArray       : return getText(TextType.A0828);
        case RuleTypeId.MmwHumanCoCategoryIdArray       : return getText(TextType.A0828);
        case RuleTypeId.MrwHumanCoCategoryIdArray       : return getText(TextType.A0828);
        case RuleTypeId.AtwHumanCoCategoryIdArray       : return getText(TextType.A0828);
        case RuleTypeId.CcwHumanCoCategoryIdArray       : return getText(TextType.A0828);
        case RuleTypeId.CcwAiCoId                       : return getText(TextType.A0806);
        case RuleTypeId.WarRoomAiCoId                   : return getText(TextType.A0807);
        case RuleTypeId.WarRoomHumanCoCategoryIdArray   : return getText(TextType.A0809);
        case RuleTypeId.CampaignAiCoId                  : return getText(TextType.A0810);
        case RuleTypeId.CampaignHumanCoIdArray          : return getText(TextType.A0811);
        case RuleTypeId.CampaignSkinId                  : return getText(TextType.A0812);
        default                                             : return null;
    }
}

export function getForceFogCodeName(code: ForcedFogCode): string | null {
    switch (code) {
        case ForcedFogCode.Fog       : return getText(TextType.B0796);
        case ForcedFogCode.Clear     : return getText(TextType.B0797);
        case ForcedFogCode.None      : return getText(TextType.B0798);
        default                     : return null;
    }
}

export function getAutoTourneyPhaseName(phase: number): string | null {
    switch (phase) {
        case PhaseId.Registration    : return getText(TextType.B1039);
        case PhaseId.Adjustment      : return getText(TextType.B1040);
        case PhaseId.Battle          : return getText(TextType.B1041);
        case PhaseId.End             : return getText(TextType.B1002);
        default                                 : return null;
    }
}

export function getMedalDesc(medalId: number): string | null {
    const typeParams = getMedalCfg(medalId)?.typeParams;
    if (typeParams == null) {
        return null;
    }

    const medalType = typeParams[0];
    if (medalType === MedalTypeId.TournamentPrize) {
        return getFormattedText(TextType.F0162, typeParams[1]);
    } else {
        return null;
    }
}

export function getGameVersionName(type: TypeName): string | null {
    switch (type) {
        case TypeName.Legacy     : return getText(TextType.B0385);
        case TypeName.Test       : return getText(TextType.B0622);
        case TypeName.Dor        : return getText(TextType.B1131);
        case TypeName.Trilogy    : return getText(TextType.B1348);
        case TypeName.TinyWars2  : return getText(TextType.B1308);
        case TypeName.Awbw       : return getText(TextType.B0649);
        default                         : return null;
    }
}
export function getGameVersionDesc(type: TypeName): string | null {
    switch (type) {
        case TypeName.Legacy     : return getText(TextType.A0217);
        case TypeName.Test       : return getText(TextType.A0218);
        case TypeName.Dor        : return getText(TextType.A0438);
        case TypeName.Trilogy    : return getText(TextType.A0886);
        case TypeName.TinyWars2  : return getText(TextType.A0843);
        case TypeName.Awbw       : return getText(TextType.A0224);
        default                         : return null;
    }
}

export function getMapSortTypeName(type: SortType): string | null {
    switch (type) {
        case SortType.MapName                    : return getText(TextType.B0225);
        case SortType.NormalMapId                : return getText(TextType.B0821);
        case SortType.DesignerName               : return getText(TextType.B0163);
        case SortType.Popularity                 : return getText(TextType.B0565);
        case SortType.GlobalRating               : return getText(TextType.B0364);
        case SortType.MyRating                   : return getText(TextType.B0363);
        case SortType.PlayersCountUnneutral      : return getText(TextType.B0229);
        case SortType.GridsCount                 : return getText(TextType.B1105);
        default                                     : return null;
    }
}

export function getGameModeName(gameMode: ModeId): string | null {
    switch (gameMode) {
        case ModeId.Coop              : return getText(TextType.B0646);
        case ModeId.Free              : return getText(TextType.B0557);
        case ModeId.Versus            : return getText(TextType.B1011);
        case ModeId.RankedMatch       : return getText(TextType.B0404);
        case ModeId.UnrankedMatch     : return getText(TextType.B1012);
        case ModeId.SingleCustom      : return getText(TextType.B1262);
        case ModeId.WarRoom           : return getText(TextType.B0614);
        case ModeId.AutoTourney    : return getText(TextType.B1022);
        default                             : return null;
    }
}
export function getGameModeHelpText(gameMode: ModeId): string | null {
    switch (gameMode) {
        case ModeId.Coop              : return getText(TextType.R0008);
        case ModeId.Free              : return getText(TextType.R0007);
        case ModeId.Versus            : return getText(TextType.A0797);
        case ModeId.RankedMatch       : return getText(TextType.A0798);
        case ModeId.UnrankedMatch     : return getText(TextType.R0017);
        case ModeId.SingleCustom      : return getText(TextType.A0799);
        case ModeId.WarRoom           : return getText(TextType.A0800);
        case ModeId.AutoTourney    : return getText(TextType.R0018);
        default                             : return null;
    }
}

export function getExpressionParserContextName(type: ContextType): string | null {
    switch (type) {
        case ContextType.CustomCounter       : return getText(TextType.B1143);
        case ContextType.War                 : return getText(TextType.B0719);
        case ContextType.Tile                : return getText(TextType.B1144);
        case ContextType.TileArray           : return getText(TextType.B1156);
        case ContextType.Unit                : return getText(TextType.B1058);
        case ContextType.UnitArray           : return getText(TextType.B1157);
        case ContextType.Position            : return getText(TextType.B1181);
        case ContextType.PositionArray       : return getText(TextType.B1182);
        case ContextType.UnitStatistic       : return getText(TextType.B1166);
        case ContextType.UnitStatisticArray  : return getText(TextType.B1167);
        case ContextType.Player              : return getText(TextType.B0031);
        case ContextType.PlayerArray         : return getText(TextType.B1158);
        case ContextType.Number              : return getText(TextType.B0133);
        case ContextType.NumberArray         : return getText(TextType.B1159);
        case ContextType.Turn                : return getText(TextType.B0191);
        case ContextType.Weather             : return getText(TextType.Weather);
        case ContextType.TaskObjective       : return getText(TextType.B1214);
        case ContextType.TileBuff            : return getText(TextType.B1232);
        case ContextType.TileBuffArray       : return getText(TextType.B1233);
        case ContextType.WarOperation        : return getText(TextType.B1212);
        case ContextType.Fog                 : return getText(TextType.B1145);
        default                                                 : return null;
    }
}
export function getExpressionParserResultTypeName(type: ResultType): string | null {
    switch (type) {
        case ResultType.War                  : return getText(TextType.B0719);
        case ResultType.Tile                 : return getText(TextType.B1144);
        case ResultType.TileArray            : return getText(TextType.B1156);
        case ResultType.TileBuff             : return getText(TextType.B1232);
        case ResultType.TileBuffArray        : return getText(TextType.B1233);
        case ResultType.Unit                 : return getText(TextType.B1058);
        case ResultType.UnitArray            : return getText(TextType.B1157);
        case ResultType.Position             : return getText(TextType.B1181);
        case ResultType.PositionArray        : return getText(TextType.B1182);
        case ResultType.UnitStatistic        : return getText(TextType.B1166);
        case ResultType.UnitStatisticArray   : return getText(TextType.B1167);
        case ResultType.Player               : return getText(TextType.B0031);
        case ResultType.PlayerArray          : return getText(TextType.B1158);
        case ResultType.Number               : return getText(TextType.B0133);
        case ResultType.NumberArray          : return getText(TextType.B1159);
        case ResultType.Turn                 : return getText(TextType.B0191);
        case ResultType.Weather              : return getText(TextType.Weather);
        case ResultType.WarOperation         : return getText(TextType.B1212);
        case ResultType.Fog                  : return getText(TextType.B1145);
        case ResultType.Lambda               : return getText(TextType.B1169);
        case ResultType.Unknown              : return getText(TextType.B0672);
        default                                                 : return null;
    }
}

export function getBuffEndTimeModificationModeName(mode: BuffEndTimeModificationMode): string | null {
    switch (mode) {
        case BuffEndTimeModificationMode.DoNotChange                    : return getText(TextType.B1463);
        case BuffEndTimeModificationMode.Delete                         : return getText(TextType.B1455);
        case BuffEndTimeModificationMode.SetAbsoluteValue               : return getText(TextType.B1464);
        case BuffEndTimeModificationMode.AddOffset                      : return `${getText(TextType.B1017)} 1`;
        case BuffEndTimeModificationMode.SetValueRelativeToCurrentTime  : return `${getText(TextType.B1017)} 2`;
        default                                                         : return null;
    }
}

export function getLanguageText({ textArray, languageType = getCurrentLanguageType(), useAlternate = true }: {
    textArray       : Undefinable<LanguageText[]>;
    languageType?   : LanguageType;
    useAlternate?   : boolean;
}): string | null {
    if ((textArray == null) || (!textArray.length)) {
        return null;
    }

    const data = textArray.find(v => (v.getLanguageType()) === languageType);
    if (data) {
        return data.getText() ?? null;
    }
    if (!useAlternate) {
        return null;
    }

    const secondaryText = getLanguageText({ textArray, languageType : getSecondaryLanguageType(languageType), useAlternate : false });
    if (secondaryText) {
        return secondaryText;
    } else {
        return textArray[0].getText() ?? null;
    }
}
export function concatLanguageTextList(textList: Undefinable<LanguageText[]>): string {
    const strList: string[] = [];
    for (const data of textList || []) {
        strList.push(data.getText() || `??`);
    }
    return strList.join(`, `);
}
export function getJoinedShortLanguageText(textArray: Undefinable<LanguageText[]>, limit?: number): string {
    const rawText1 = getLanguageText({ textArray, languageType : getCurrentLanguageType(), useAlternate : false })?.trim() || `----`;
    const rawText2 = getLanguageText({ textArray, languageType : getSecondaryLanguageType(), useAlternate : false })?.trim() || `----`;
    if (!limit) {
        return `${rawText1}\n${rawText2}`;
    } else {
        const chineseText = rawText1.substring(0, limit).replace(/\n/g, ` `) || `----`;
        const englishText = rawText2.substring(0, limit).replace(/\n/g, ` `) || `----`;
        return `${chineseText}${chineseText.length < rawText1.length ? `...` : ``}\n${englishText}${englishText.length < rawText2.length ? `...` : ``}`;
    }
}

export function getTimeDurationText(totalSeconds: number, separator = ``): string {
    if (totalSeconds <= 0) {
        return `0${getText(TextType.B0017)}`;
    } else {
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours   = Math.floor(totalSeconds / (60 * 60)) % 24;
        const days    = Math.floor(totalSeconds / (60 * 60 * 24));

        const textArray: string[] = [];
        if (days    > 0) {
            textArray.push(`${days}${getText(TextType.B0014)}`);
        }
        if (hours   > 0) {
            textArray.push(`${hours}${getText(TextType.B0015)}`);
        }
        if (minutes > 0) {
            textArray.push(`${minutes}${getText(TextType.B0016)}`);
        }
        if (seconds > 0) {
            textArray.push(`${seconds}${getText(TextType.B0017)}`);
        }
        return textArray.join(separator);
    }
}
export function getTimeDurationText2(totalSeconds: number): string {
    if (totalSeconds <= 0) {
        return `00:00:00`;
    } else {
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours   = Math.floor(totalSeconds / (60 * 60));
        return `${getNumText(hours)}:${getNumText(minutes)}:${getNumText(seconds)}`;
    }
}

type TimeTextController = {
    year?   : boolean;
    month?  : boolean;
    date?   : boolean;
    hour?   : boolean;
    minute? : boolean;
    second? : boolean;
};
/**
 * 返回指定时间戳对应的时间，格式： x年x月x日xx:xx:xx
 * @param controller 用于控制特定子串要不要显示，默认为全显示
 */
export function getTimestampText(timestamp: number, controller?: TimeTextController): string {
    const d = new Date(timestamp * 1000);
    const needHour   = (!controller) || (controller.hour !== false);
    const needMinute = (!controller) || (controller.minute !== false);
    const needSecond = (!controller) || (controller.second !== false);
    const strYear    = (!controller) || (controller.year !== false)  ? `${getNumText(d.getFullYear(), 4)}${getText(TextType.B0059)}`     : ``;
    const strMonth   = (!controller) || (controller.month !== false) ? `${getNumText(d.getMonth() + 1)}${getText(TextType.B0058)}`    : ``;
    const strDate    = (!controller) || (controller.date !== false)  ? `${getNumText(d.getDate())}${getText(TextType.B0057)}`         : ``;
    const strHour    = needHour                 ? `${getNumText(d.getHours())}`   : "";
    const sep1       = needHour   && needMinute ? ":" : "";
    const strMinute  = needMinute               ? `${getNumText(d.getMinutes())}` : "";
    const sep2       = needMinute && needSecond ? ":" : "";
    const strSecond  = needSecond               ? `${getNumText(d.getSeconds())}` : "";
    return strYear + strMonth + strDate + strHour + sep1 + strMinute + sep2 + strSecond;
}
export function getTimestampShortText(timestamp: number, controller?: TimeTextController): string {
    const d = new Date(timestamp * 1000);
    const needHour   = (!controller) || (controller.hour !== false);
    const needMinute = (!controller) || (controller.minute !== false);
    const needSecond = (!controller) || (controller.second !== false);
    const strYear    = (!controller) || (controller.year !== false)  ? `${getNumText(d.getFullYear(), 4)}/`     : ``;
    const strMonth   = (!controller) || (controller.month !== false) ? `${getNumText(d.getMonth() + 1)}/`    : ``;
    const strDate    = (!controller) || (controller.date !== false)  ? `${getNumText(d.getDate())} `         : ``;
    const strHour    = needHour                 ? `${getNumText(d.getHours())}`   : "";
    const sep1       = needHour   && needMinute ? ":" : "";
    const strMinute  = needMinute               ? `${getNumText(d.getMinutes())}` : "";
    const sep2       = needMinute && needSecond ? ":" : "";
    const strSecond  = needSecond               ? `${getNumText(d.getSeconds())}` : "";
    return strYear + strMonth + strDate + strHour + sep1 + strMinute + sep2 + strSecond;
}

export function getBootTimerTypeName(type: TimerTypeId): string | null {
    switch (type) {
        case TimerTypeId.Regular    : return getText(TextType.B0387);
        case TimerTypeId.Incremental: return getText(TextType.B0388);
        default                             : return null;
    }
}
export function getBootTimerDesc(params: number[]): string | null {
    params          = params || [];
    const timerType = params[0] as TimerTypeId;
    if (timerType === TimerTypeId.Regular) {
        return `${getText(TextType.B0387)} ${getTimeDurationText2(params[1])}`;
    } else if (timerType === TimerTypeId.Incremental) {
        return `${getText(TextType.B0388)} ${getTimeDurationText2(params[1])} + ${getTimeDurationText2(params[2])}`;
    } else {
        return null;
    }
}

export function getComparatorName(comparator: Undefinable<number>): string | null {
    switch (comparator) {
        case ComparatorId.EqualTo          : return getText(TextType.B0767);
        case ComparatorId.NotEqualTo       : return getText(TextType.B0768);
        case ComparatorId.GreaterThan      : return getText(TextType.B0769);
        case ComparatorId.NotGreaterThan   : return getText(TextType.B0770);
        case ComparatorId.LessThan         : return getText(TextType.B0771);
        case ComparatorId.NotLessThan      : return getText(TextType.B0772);
        default                                 : return null;
    }
}
export function getSetRelationName(relation: Undefinable<number>): string {
    switch (relation) {
        case SetRelationId.EqualTo          : return getText(TextType.B1409);
        case SetRelationId.NotEqualTo       : return getText(TextType.B1410);
        case SetRelationId.SupersetOf       : return getText(TextType.B1411);
        case SetRelationId.NotSupersetOf    : return getText(TextType.B1412);
        case SetRelationId.SubsetOf         : return getText(TextType.B1413);
        case SetRelationId.NotSubsetOf      : return getText(TextType.B1414);
        case SetRelationId.Intersection     : return getText(TextType.B1415);
        case SetRelationId.NoIntersection   : return getText(TextType.B1416);
        default                             : return UndefinedError;
    }
}
