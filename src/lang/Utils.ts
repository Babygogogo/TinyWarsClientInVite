import * as AutoTourneysConstants from "../autoTourneys/Constants.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as BootTimersConstants from "../bootTimers/Constants.ts";
import * as ChatConstants from "../chat/Constants.ts";
import * as CosConstants from "../cos/Constants.ts";
import * as CoSkillsConstants from "../coSkills/Constants.ts";
import * as DialoguesConstants from "../dialogues/Constants.ts";
import * as ExpressionParsersEnums from "../expressionParsers/Enums.ts";
import * as FogMapsConstants from "../fogMaps/Constants.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import * as GameConfigGcMap from "../gameConfig/GcMap.ts";
import * as GameConfigGcMapEditor from "../gameConfig/GcMapEditor.ts";
import * as GameConfigGcWar from "../gameConfig/GcWar.ts";
import * as GameModesConstants from "../gameModes/Constants.ts";
import * as GameVersionsConstants from "../gameVersions/Constants.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as HelpersText from "../helpers/Text.ts";
import * as LangCommonText from "./CommonText.ts";
import * as LangConstants from "./Constants.ts";
import * as LangErrorText from "./ErrorText.ts";
import * as LocalDataStorage from "../localData/Storage.ts";
import * as MedalsConstants from "../medals/Constants.ts";
import * as MedalsUtils from "../medals/Utils.ts";
import * as MultiPlayerRoomsConstants from "../multiPlayerRooms/Constants.ts";
import * as PlayerRulesConstants from "../playerRules/Constants.ts";
import * as PlayersConstants from "../players/Constants.ts";
import type * as ProtoSchemaCommonProtoStructureLanguageText from "../proto/schema/CommonProto/Structure/LanguageText.ts";
import * as SoundsUtils from "../sounds/Utils.ts";
import * as TileBuffsConstants from "../tileBuffs/Constants.ts";
import * as TilesConstantsCommon from "../tiles/constants/Common.ts";
import * as TurnsConstants from "../turns/Constants.ts";
import * as UnitBuffsConstants from "../unitBuffs/Constants.ts";
import * as UnitsConstants from "../units/Constants.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as UtilsServerErrorCode from "../utils/ServerErrorCode.ts";
import * as ValueAndComparatorsConstants from "../valueAndComparators/Constants.ts";
import * as ValueSetAndRelationsConstants from "../valueSetAndRelations/Constants.ts";
import * as WarEventsActionsConstantsCommon from "../warEvents/actions/constants/Common.ts";
import * as WarEventsConditionsConstants from "../warEvents/conditions/Constants.ts";
import * as WarTypesConstants from "../warTypes/Constants.ts";

type LanguageText                   = ProtoSchemaCommonProtoStructureLanguageText.LanguageText;
type Undefinable<T>                 = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

let _languageType = LangConstants.LanguageType.Chinese;
export function init(): void {
    setCurrentLanguageType(LocalDataStorage.getLanguageType());
}

export function getCurrentLanguageType(): LangConstants.LanguageType {
    return _languageType;
}
export function setCurrentLanguageType(language: LangConstants.LanguageType): void {
    _languageType = language;
}
export function getSecondaryLanguageType(t = getCurrentLanguageType()): LangConstants.LanguageType {
    switch (t) {
        case LangConstants.LanguageType.Chinese   : return LangConstants.LanguageType.English;
        case LangConstants.LanguageType.English   : return LangConstants.LanguageType.Chinese;  // TODO
        case LangConstants.LanguageType.Spanish   : return LangConstants.LanguageType.English;
        default                     : return LangConstants.LanguageType.English;
    }
}
export function getLanguageTypeName(type: LangConstants.LanguageType): string | null {
    switch (type) {
        case LangConstants.LanguageType.Chinese   : return getText(LangConstants.TextType.B0624, LangConstants.LanguageType.Chinese);
        case LangConstants.LanguageType.English   : return getText(LangConstants.TextType.B0625, LangConstants.LanguageType.English);
        case LangConstants.LanguageType.Spanish   : return getText(LangConstants.TextType.B1435, LangConstants.LanguageType.Spanish);
        default                     : return null;
    }
}

export function checkIsValidLanguageType(t: Undefinable<number>): boolean {
    return (t === LangConstants.LanguageType.Chinese)
        || (t === LangConstants.LanguageType.English)
        || (t === LangConstants.LanguageType.Spanish);
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

export function getText(t: LangConstants.TextType, languageType = getCurrentLanguageType()): string {
    const data = LangCommonText.CommonText[t];
    const text = data ? data[languageType] : null;
    if (text != null) {
        return text;
    } else {
        throw HelpersMisc.newError(`getText() empty text: ${t} ${languageType}`, UtilsClientErrorCode.ClientErrorCode.Lang_GetText_00);
    }
}

export function getFormattedText(t: LangConstants.TextType, ...params: (Undefinable<number | string>)[]): string {
    if ((t < LangConstants.TextType.F0000) || (t >= LangConstants.TextType.R0000)) {
        throw HelpersMisc.newError(`getFormattedText() invalid t:${t}`);
    }

    const data = getText(t);
    return data === LangConstants.UndefinedError
        ? LangConstants.UndefinedError
        : HelpersText.format(data, ...params);
}

export function getErrorText(code: UtilsServerErrorCode.ServerErrorCode | UtilsClientErrorCode.ClientErrorCode): string {
    const textList  = LangErrorText.ErrorText[code];
    const text      = textList ? textList[_languageType] : null;
    return code === UtilsServerErrorCode.ServerErrorCode.UserGuestPrivilege_0000
        ? `${text || getText(LangConstants.TextType.A0153)}`
        : `${getText(LangConstants.TextType.B0452)} ${code}: ${text || getText(LangConstants.TextType.A0153)}`;
}

export function getTextForYesOrNo(value: unknown): string {
    return getText(value ? LangConstants.TextType.Yes : LangConstants.TextType.No);
}

export function getPlayerForceName(playerIndex: number): string {
    return `P${playerIndex}`;
}

export function getPlayerTeamName(teamIndex: number): string | null {
    switch (teamIndex) {
        case 0  : return getText(LangConstants.TextType.B0030);
        case 1  : return getText(LangConstants.TextType.B0008);
        case 2  : return getText(LangConstants.TextType.B0009);
        case 3  : return getText(LangConstants.TextType.B0010);
        case 4  : return getText(LangConstants.TextType.B0011);
        case 5  : return getText(LangConstants.TextType.B0699);
        case 6  : return getText(LangConstants.TextType.B0112);
        case 7  : return getText(LangConstants.TextType.B0113);
        case 8  : return getText(LangConstants.TextType.B0114);
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
export function getWeatherName(weatherType: number, gameConfig: GameConfigGcData.GcData, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getWeatherCfg(weatherType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getWeatherDesc(weatherType: number, gameConfig: GameConfigGcData.GcData, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getWeatherCfg(weatherType)?.getDescTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getWeatherFullDesc(gameConfig: GameConfigGcData.GcData): string {
    const textArray: string[] = [];
    for (const weatherType of gameConfig.getAllWeatherTypeArray()) {
        textArray.push(`${getWeatherName(weatherType, gameConfig)}: ${getWeatherDesc(weatherType, gameConfig)}`);
    }
    return getFormattedText(LangConstants.TextType.F0200, textArray.join(`\n`));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getTileBaseName(tileBaseType: number, gameConfig: GameConfigGcData.GcData): string | null {
    const tileType = gameConfig.getTileType(tileBaseType, TilesConstantsCommon.ObjectTypeId.Empty);
    return tileType == null ? null : getTileName(tileType, gameConfig);
}

export function getTileThemeName(tileTheme: number | null): string | null {
    switch (tileTheme) {
        case TilesConstantsCommon.ThemeTypeId.Normal     : return getText(LangConstants.TextType.B0701);
        case TilesConstantsCommon.ThemeTypeId.Rain       : return getText(LangConstants.TextType.B0704);
        case TilesConstantsCommon.ThemeTypeId.Sandstorm  : return getText(LangConstants.TextType.B0702);
        case TilesConstantsCommon.ThemeTypeId.Snow       : return getText(LangConstants.TextType.B0703);
        case null                       : return getText(LangConstants.TextType.B0890);
        default                         : return null;
    }
}

export function getTileBuffName(buffType: number): string | null {
    switch (buffType) {
        case TileBuffsConstants.BuffTypeId.NoProduction    : return getText(LangConstants.TextType.B1240);
        case TileBuffsConstants.BuffTypeId.NoIncome        : return getText(LangConstants.TextType.B1230);
        case TileBuffsConstants.BuffTypeId.Custom          : return getText(LangConstants.TextType.B0321);
        default                             : return null;
    }
}

export function getTileBuffDesc(buffType: number): string | null {
    switch (buffType) {
        case TileBuffsConstants.BuffTypeId.NoProduction    : return getText(LangConstants.TextType.A0770);
        case TileBuffsConstants.BuffTypeId.NoIncome        : return getText(LangConstants.TextType.A0740);
        case TileBuffsConstants.BuffTypeId.Custom          : return getText(LangConstants.TextType.A0970);
        default                             : return null;
    }
}

export function getTileBuffExtraParamDesc(buffType: number): string | null {
    switch (buffType) {
        case TileBuffsConstants.BuffTypeId.NoProduction    : return getText(LangConstants.TextType.A0745);
        case TileBuffsConstants.BuffTypeId.NoIncome        : return getText(LangConstants.TextType.A0745);
        case TileBuffsConstants.BuffTypeId.Custom          : return getText(LangConstants.TextType.A0745);
        default                             : return null;
    }
}

export function getTileName(tileType: TilesConstantsCommon.TileTypeId, gameConfig: GameConfigGcData.GcData, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getTileTemplateCfg(tileType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getTileObjectName(tileObjectType: number, gameConfig: GameConfigGcData.GcData, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getTileObjectCfg(tileObjectType)?.nameTextId;
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getTileDecorationName(tileDecorationType: number, gameConfig: GameConfigGcData.GcData, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getTileDecorationCfg(tileDecorationType)?.nameTextId;
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getUnitName(unitType: number, gameConfig: GameConfigGcData.GcData, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getUnitTemplateCfg(unitType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getUnitCategoryName(unitCategory: number, gameConfig: GameConfigGcData.GcData, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getUnitCategoryCfg(unitCategory)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getUnitActionName(actionType: UnitsConstants.ActionTypeId): string | null{
    switch (actionType) {
        case UnitsConstants.ActionTypeId.BeLoaded        : return getText(LangConstants.TextType.B0037);
        case UnitsConstants.ActionTypeId.Join            : return getText(LangConstants.TextType.B0038);
        case UnitsConstants.ActionTypeId.UseCoPower      : return getText(LangConstants.TextType.B0142);
        case UnitsConstants.ActionTypeId.UseCoSuperPower : return getText(LangConstants.TextType.B0144);
        case UnitsConstants.ActionTypeId.Attack          : return getText(LangConstants.TextType.B0039);
        case UnitsConstants.ActionTypeId.CaptureTile         : return getText(LangConstants.TextType.B0040);
        case UnitsConstants.ActionTypeId.CrushUnit       : return getText(LangConstants.TextType.B1350);
        case UnitsConstants.ActionTypeId.Dive            : return getText(LangConstants.TextType.B0041);
        case UnitsConstants.ActionTypeId.RepairUnit      : return getText(LangConstants.TextType.B1351);
        case UnitsConstants.ActionTypeId.Surface         : return getText(LangConstants.TextType.B0042);
        case UnitsConstants.ActionTypeId.BuildTile       : return getText(LangConstants.TextType.B0043);
        case UnitsConstants.ActionTypeId.SelfDetonate    : return getText(LangConstants.TextType.B1349);
        case UnitsConstants.ActionTypeId.Supply          : return getText(LangConstants.TextType.B0044);
        case UnitsConstants.ActionTypeId.LaunchUnit      : return getText(LangConstants.TextType.B0045);
        case UnitsConstants.ActionTypeId.DropUnit        : return getText(LangConstants.TextType.B0046);
        case UnitsConstants.ActionTypeId.LaunchFlare     : return getText(LangConstants.TextType.B0047);
        case UnitsConstants.ActionTypeId.LaunchSilo      : return getText(LangConstants.TextType.B0048);
        case UnitsConstants.ActionTypeId.CoBoard         : return getText(LangConstants.TextType.B0139);
        case UnitsConstants.ActionTypeId.ProduceUnit     : return getText(LangConstants.TextType.B0049);
        case UnitsConstants.ActionTypeId.Wait            : return getText(LangConstants.TextType.B0050);
        default                             : return null;
    }
}

export function getUnitAiModeName(mode: UnitsConstants.AiModeId): string | null {
    switch (mode) {
        case UnitsConstants.AiModeId.NoMove                : return getText(LangConstants.TextType.B0721);
        case UnitsConstants.AiModeId.Normal                : return getText(LangConstants.TextType.B0723);
        case UnitsConstants.AiModeId.WaitUntilCanAttack    : return getText(LangConstants.TextType.B0722);
        default                                     : return null;
    }
}

export function getUnitBuffName(buffTypeId: number): string | null {
    switch (buffTypeId) {
        case UnitBuffsConstants.BuffTypeId.Fire      : return getText(LangConstants.TextType.B1307);
        case UnitBuffsConstants.BuffTypeId.Disease   : return getText(LangConstants.TextType.B1465);
        case UnitBuffsConstants.BuffTypeId.Custom    : return getText(LangConstants.TextType.B0321);
        default                                         : return null;
    }
}

export function getUnitBuffDesc(buffType: number): string | null {
    switch (buffType) {
        case UnitBuffsConstants.BuffTypeId.Fire      : return getText(LangConstants.TextType.A0968);
        case UnitBuffsConstants.BuffTypeId.Disease   : return getText(LangConstants.TextType.A0969);
        case UnitBuffsConstants.BuffTypeId.Custom    : return getText(LangConstants.TextType.A0970);
        default                                         : return null;
    }
}

export function getUnitBuffExtraParamDesc(buffType: number): string | null {
    switch (buffType) {
        case UnitBuffsConstants.BuffTypeId.Fire      : return getText(LangConstants.TextType.A0745);
        case UnitBuffsConstants.BuffTypeId.Disease   : return getText(LangConstants.TextType.A0745);
        case UnitBuffsConstants.BuffTypeId.Custom    : return getText(LangConstants.TextType.A0745);
        default                                         : return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getMoveTypeName(moveType: number, gameConfig: GameConfigGcData.GcData, languageType = getCurrentLanguageType()): string | null {
    const textId = gameConfig.getMoveTypeCfg(moveType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getBgmSfxName(bgmCode: number, gameConfig: GameConfigGcData.GcData, languageType = getCurrentLanguageType()): string | null {
    const textId = SoundsUtils.getBgmSfxCfg(bgmCode)?.nameTextId;
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getWarTypeName(type: WarTypesConstants.WarTypeId): string | null {
    switch (type) {
        case WarTypesConstants.WarTypeId.McwStd     : return getText(LangConstants.TextType.B0417);
        case WarTypesConstants.WarTypeId.McwFog     : return getText(LangConstants.TextType.B0418);
        case WarTypesConstants.WarTypeId.Me         : return getText(LangConstants.TextType.B0271);
        case WarTypesConstants.WarTypeId.MrwStd     : return getText(LangConstants.TextType.B0415);
        case WarTypesConstants.WarTypeId.MrwFog     : return getText(LangConstants.TextType.B0416);
        case WarTypesConstants.WarTypeId.MmwStd     : return getText(LangConstants.TextType.B1014);
        case WarTypesConstants.WarTypeId.MmwFog     : return getText(LangConstants.TextType.B1015);
        case WarTypesConstants.WarTypeId.AtwStd     : return getText(LangConstants.TextType.B1023);
        case WarTypesConstants.WarTypeId.AtwFog     : return getText(LangConstants.TextType.B1024);
        case WarTypesConstants.WarTypeId.MfwStd     : return getText(LangConstants.TextType.B0812);
        case WarTypesConstants.WarTypeId.MfwFog     : return getText(LangConstants.TextType.B0813);
        case WarTypesConstants.WarTypeId.ScwStd     : return getText(LangConstants.TextType.B0417);
        case WarTypesConstants.WarTypeId.ScwFog     : return getText(LangConstants.TextType.B0418);
        case WarTypesConstants.WarTypeId.SfwStd     : return getText(LangConstants.TextType.B0612);
        case WarTypesConstants.WarTypeId.SfwFog     : return getText(LangConstants.TextType.B0613);
        case WarTypesConstants.WarTypeId.CcwStd     : return getText(LangConstants.TextType.B0725);
        case WarTypesConstants.WarTypeId.CcwFog     : return getText(LangConstants.TextType.B0726);
        case WarTypesConstants.WarTypeId.SrwStd     : return getText(LangConstants.TextType.B0257);
        case WarTypesConstants.WarTypeId.SrwFog     : return getText(LangConstants.TextType.B0817);
        case WarTypesConstants.WarTypeId.CampStd    : return getText(LangConstants.TextType.B0093);
        case WarTypesConstants.WarTypeId.CampFog    : return getText(LangConstants.TextType.B0118);
        default                 : return null;
    }
}

export function getWarBasicSettingsName(type: GameConfigGcWar.BasicSettingsType): string | null {
    switch (type) {
        case GameConfigGcWar.BasicSettingsType.NormalMapId                     : return getText(LangConstants.TextType.B0225);
        case GameConfigGcWar.BasicSettingsType.WarName                   : return getText(LangConstants.TextType.B0185);
        case GameConfigGcWar.BasicSettingsType.WarPassword               : return getText(LangConstants.TextType.B0186);
        case GameConfigGcWar.BasicSettingsType.WarComment                : return getText(LangConstants.TextType.B0187);
        case GameConfigGcWar.BasicSettingsType.WarRuleTitle              : return getText(LangConstants.TextType.B0318);
        case GameConfigGcWar.BasicSettingsType.HasFog                    : return getText(LangConstants.TextType.B0020);
        case GameConfigGcWar.BasicSettingsType.Weather                   : return getText(LangConstants.TextType.Weather);
        case GameConfigGcWar.BasicSettingsType.TileTheme                 : return getText(LangConstants.TextType.B1113);
        case GameConfigGcWar.BasicSettingsType.WarEvent                  : return getText(LangConstants.TextType.B0469);
        case GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit   : return getText(LangConstants.TextType.B0987);
        case GameConfigGcWar.BasicSettingsType.TimerType                 : return getText(LangConstants.TextType.B0574);
        case GameConfigGcWar.BasicSettingsType.TimerRegularParam         : return getText(LangConstants.TextType.B0021);
        case GameConfigGcWar.BasicSettingsType.TimerIncrementalParams    : return getText(LangConstants.TextType.B0990);
        case GameConfigGcWar.BasicSettingsType.SpmSaveSlotIndex          : return getText(LangConstants.TextType.B0255);
        case GameConfigGcWar.BasicSettingsType.SpmSaveSlotComment        : return getText(LangConstants.TextType.B0605);
        default                                             : return null;
    }
}

export function getRoomTypeName(roomType: MultiPlayerRoomsConstants.MultiPlayerRoomType): string | null {
    switch (roomType) {
        case MultiPlayerRoomsConstants.MultiPlayerRoomType.Atr   : return getText(LangConstants.TextType.B1022);
        case MultiPlayerRoomsConstants.MultiPlayerRoomType.Ccr   : return getText(LangConstants.TextType.B0646);
        case MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr   : return getText(LangConstants.TextType.B1011);
        case MultiPlayerRoomsConstants.MultiPlayerRoomType.Mfr   : return getText(LangConstants.TextType.B0557);
        case MultiPlayerRoomsConstants.MultiPlayerRoomType.Mmr   : return getText(LangConstants.TextType.B1012);
        case MultiPlayerRoomsConstants.MultiPlayerRoomType.Mrr   : return getText(LangConstants.TextType.B0404);
        default             : return null;
    }
}

export function getMapReviewStatusText(status: GameConfigGcMap.ReviewStatus): string | null{
    switch (status) {
        case GameConfigGcMap.ReviewStatus.None         : return getText(LangConstants.TextType.B0273);
        case GameConfigGcMap.ReviewStatus.Reviewing    : return getText(LangConstants.TextType.B0274);
        case GameConfigGcMap.ReviewStatus.Rejected     : return getText(LangConstants.TextType.B0275);
        case GameConfigGcMap.ReviewStatus.Accepted     : return getText(LangConstants.TextType.B0276);
        default                                 : return null;
    }
}

export function getMapEditorDrawerModeText(mode: GameConfigGcMapEditor.DrawerMode): string | null{
    switch (mode) {
        case GameConfigGcMapEditor.DrawerMode.Preview                : return getText(LangConstants.TextType.B0286);
        case GameConfigGcMapEditor.DrawerMode.DrawUnit               : return getText(LangConstants.TextType.B0281);
        case GameConfigGcMapEditor.DrawerMode.DrawTileBase           : return getText(LangConstants.TextType.B0282);
        case GameConfigGcMapEditor.DrawerMode.DrawTileDecoration     : return getText(LangConstants.TextType.B0662);
        case GameConfigGcMapEditor.DrawerMode.DrawTileObject         : return getText(LangConstants.TextType.B0283);
        case GameConfigGcMapEditor.DrawerMode.DeleteUnit             : return getText(LangConstants.TextType.B0284);
        case GameConfigGcMapEditor.DrawerMode.DeleteTileDecoration   : return getText(LangConstants.TextType.B0661);
        case GameConfigGcMapEditor.DrawerMode.DeleteTileObject       : return getText(LangConstants.TextType.B0285);
        case GameConfigGcMapEditor.DrawerMode.AddTileToLocation      : return getText(LangConstants.TextType.B0759);
        case GameConfigGcMapEditor.DrawerMode.DeleteTileFromLocation : return getText(LangConstants.TextType.B0760);
        default                                         : return null;
    }
}

export function getUnitActionStateText(state: UnitsConstants.ActionStateId): string | null{
    switch (state) {
        case UnitsConstants.ActionStateId.Acted  : return getText(LangConstants.TextType.B0368);
        case UnitsConstants.ActionStateId.Idle   : return getText(LangConstants.TextType.B0369);
        default                     : return null;
    }
}

export function getChatChannelName(channel: ChatConstants.PublicChannelId, languageType: LangConstants.LanguageType = getCurrentLanguageType()): string | null {
    switch (channel) {
        case ChatConstants.PublicChannelId.System   : return getText(LangConstants.TextType.B0374, languageType);
        case ChatConstants.PublicChannelId.PublicEn : return getText(LangConstants.TextType.B0373, languageType);
        case ChatConstants.PublicChannelId.PublicCn : return getText(LangConstants.TextType.B0384, languageType);
        default                         : return null;
    }
}

export function getUnitAndTileSkinName(skinId: number): string | null {
    switch (skinId) {
        case 0  : return "";
        case 1  : return getText(LangConstants.TextType.B0004);
        case 2  : return getText(LangConstants.TextType.B0005);
        case 3  : return getText(LangConstants.TextType.B0006);
        case 4  : return getText(LangConstants.TextType.B0007);
        case 5  : return getText(LangConstants.TextType.B0700);
        case 6  : return getText(LangConstants.TextType.B0115);
        case 7  : return getText(LangConstants.TextType.B0116);
        case 8  : return getText(LangConstants.TextType.B0117);
        default : return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getCoEnergyTypeName(coEnergyType: CosConstants.EnergyTypeId): string | null {
    switch (coEnergyType) {
        case CosConstants.EnergyTypeId.Dor       : return getText(LangConstants.TextType.B1269);
        case CosConstants.EnergyTypeId.Trilogy   : return getText(LangConstants.TextType.B1270);
        default                     : return null;
    }
}

export function getCoSkillTypeName(skillType: CoSkillsConstants.SkillTypeId): string | null {
    switch (skillType) {
        case CoSkillsConstants.SkillTypeId.Passive      : return getText(LangConstants.TextType.B0576);
        case CoSkillsConstants.SkillTypeId.Power        : return getText(LangConstants.TextType.B0577);
        case CoSkillsConstants.SkillTypeId.SuperPower   : return getText(LangConstants.TextType.B0578);
        default                             : return null;
    }
}

export function getCoSkillDescArray({ coId, skillType, gameConfig, languageType, isExtra }: {
    coId            : number;
    skillType       : CoSkillsConstants.SkillTypeId;
    gameConfig      : GameConfigGcData.GcData;
    languageType    : LangConstants.LanguageType;
    isExtra         : boolean;
}): string[] | null {
    const cfg = gameConfig.getCoSkillDescCfg(coId);
    if (cfg == null) {
        return null;
    }

    if (skillType === CoSkillsConstants.SkillTypeId.Passive) {
        if (isExtra) {
            switch (languageType) {
                case LangConstants.LanguageType.Chinese   : return cfg.getD2dExtra0() ?? null;
                case LangConstants.LanguageType.English   : return cfg.getD2dExtra1() ?? null;
                case LangConstants.LanguageType.Spanish   : return cfg.getD2dExtra2() ?? null;
                default                     : return cfg.getD2dExtra1() ?? null;
            }
        } else {
            switch (languageType) {
                case LangConstants.LanguageType.Chinese   : return cfg.getD2d0() ?? null;
                case LangConstants.LanguageType.English   : return cfg.getD2d1() ?? null;
                case LangConstants.LanguageType.Spanish   : return cfg.getD2d2() ?? null;
                default                     : return cfg.getD2d1() ?? null;
            }
        }
    } else if (skillType === CoSkillsConstants.SkillTypeId.Power) {
        if (isExtra) {
            switch (languageType) {
                case LangConstants.LanguageType.Chinese   : return cfg.getPExtra0() ?? null;
                case LangConstants.LanguageType.English   : return cfg.getPExtra1() ?? null;
                case LangConstants.LanguageType.Spanish   : return cfg.getPExtra2() ?? null;
                default                     : return cfg.getPExtra1() ?? null;
            }
        } else {
            switch (languageType) {
                case LangConstants.LanguageType.Chinese   : return cfg.getP0() ?? null;
                case LangConstants.LanguageType.English   : return cfg.getP1() ?? null;
                case LangConstants.LanguageType.Spanish   : return cfg.getP2() ?? null;
                default                     : return cfg.getP1() ?? null;
            }
        }
    } else if (skillType === CoSkillsConstants.SkillTypeId.SuperPower) {
        if (isExtra) {
            switch (languageType) {
                case LangConstants.LanguageType.Chinese   : return cfg.getSpExtra0() ?? null;
                case LangConstants.LanguageType.English   : return cfg.getSpExtra1() ?? null;
                case LangConstants.LanguageType.Spanish   : return cfg.getSpExtra2() ?? null;
                default                     : return cfg.getSpExtra1() ?? null;
            }
        } else {
            switch (languageType) {
                case LangConstants.LanguageType.Chinese   : return cfg.getSp0() ?? null;
                case LangConstants.LanguageType.English   : return cfg.getSp1() ?? null;
                case LangConstants.LanguageType.Spanish   : return cfg.getSp2() ?? null;
                default                     : return cfg.getSp1() ?? null;
            }
        }
    } else {
        return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getPlayerAliveStateName(state: PlayersConstants.AliveStateId): string | null {
    switch (state) {
        case PlayersConstants.AliveStateId.Alive   : return getText(LangConstants.TextType.B0471);
        case PlayersConstants.AliveStateId.Dead    : return getText(LangConstants.TextType.B0472);
        case PlayersConstants.AliveStateId.Dying   : return getText(LangConstants.TextType.B0473);
        default                             : return null;
    }
}

export function getTurnPhaseName(phaseCode: TurnsConstants.PhaseCode): string | null {
    switch (phaseCode) {
        case TurnsConstants.PhaseCode.WaitBeginTurn    : return getText(LangConstants.TextType.B0474);
        case TurnsConstants.PhaseCode.Main             : return getText(LangConstants.TextType.B0475);
        default                             : return null;
    }
}

export function getMapSimpleDialogueSideName(side: number): string | null {
    switch (side) {
        case DialoguesConstants.SmallDialogueSideId.Top       : return getText(LangConstants.TextType.B1260);
        case DialoguesConstants.SmallDialogueSideId.Bottom    : return getText(LangConstants.TextType.B1261);
        default                                         : return null;
    }
}

export function getWarEventConditionTypeName(type: WarEventsConditionsConstants.ConditionTypeId): string | null {
    switch (type) {
        case WarEventsConditionsConstants.ConditionTypeId.WecTurnAndPlayer                     : return getText(LangConstants.TextType.B0781);
        case WarEventsConditionsConstants.ConditionTypeId.WecEventCalledCount                  : return getText(LangConstants.TextType.B0789);
        case WarEventsConditionsConstants.ConditionTypeId.WecWeatherAndFog                     : return getText(LangConstants.TextType.B0794);
        case WarEventsConditionsConstants.ConditionTypeId.WecPlayerPresence                    : return getText(LangConstants.TextType.B0786);
        case WarEventsConditionsConstants.ConditionTypeId.WecTilePresence                      : return getText(LangConstants.TextType.B0779);
        case WarEventsConditionsConstants.ConditionTypeId.WecUnitPresence                      : return getText(LangConstants.TextType.B0775);
        case WarEventsConditionsConstants.ConditionTypeId.WecExpression                        : return getText(LangConstants.TextType.B1146);
        case WarEventsConditionsConstants.ConditionTypeId.WecCustomCounter                     : return getText(LangConstants.TextType.B0802);
        case WarEventsConditionsConstants.ConditionTypeId.WecOngoingPersistentActionPresence   : return getText(LangConstants.TextType.B0901);
        case WarEventsConditionsConstants.ConditionTypeId.WecManualActionStatistics            : return getText(LangConstants.TextType.B0929);
        default                                                         : return null;
    }
}

export function getWarEventActionCategoryName(category: WarEventsActionsConstantsCommon.CategoryId): string | null {
    switch (category) {
        case WarEventsActionsConstantsCommon.CategoryId.UnitSimple                : return getText(LangConstants.TextType.B1058);
        case WarEventsActionsConstantsCommon.CategoryId.UnitExpr                  : return `${getText(LangConstants.TextType.B1058)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.CategoryId.TileSimple                : return getText(LangConstants.TextType.B1144);
        case WarEventsActionsConstantsCommon.CategoryId.TileExpr                  : return `${getText(LangConstants.TextType.B1144)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.CategoryId.PlayerSimple              : return getText(LangConstants.TextType.B0031);
        case WarEventsActionsConstantsCommon.CategoryId.PlayerExpr                : return `${getText(LangConstants.TextType.B0031)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.CategoryId.WeatherAndFogSimple       : return getText(LangConstants.TextType.B1345);
        case WarEventsActionsConstantsCommon.CategoryId.WeatherAndFogExpr         : return `${getText(LangConstants.TextType.B1345)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.CategoryId.ImageAndSoundSimple       : return getText(LangConstants.TextType.B1343);
        case WarEventsActionsConstantsCommon.CategoryId.ImageAndSoundExpr         : return `${getText(LangConstants.TextType.B1343)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.CategoryId.MiscSimple                : return getText(LangConstants.TextType.B1279);
        case WarEventsActionsConstantsCommon.CategoryId.MiscExpr                  : return `${getText(LangConstants.TextType.B1279)} (${getText(LangConstants.TextType.B0129)})`;
        default                                         : return null;
    }
}

export function getWarEventActionTypeName(type: WarEventsActionsConstantsCommon.ActionTypeId): string | null {
    switch (type) {
        case WarEventsActionsConstantsCommon.ActionTypeId.AddUnitOnMapSimple                          : return getText(LangConstants.TextType.B0617);
        case WarEventsActionsConstantsCommon.ActionTypeId.FillUnitOnMapExpr                           : return getText(LangConstants.TextType.B1190);
        case WarEventsActionsConstantsCommon.ActionTypeId.FillUnitOnMapSimple                         : return getText(LangConstants.TextType.B1059);
        case WarEventsActionsConstantsCommon.ActionTypeId.FillUnitLoadedSimple                        : return getText(LangConstants.TextType.B1191);
        case WarEventsActionsConstantsCommon.ActionTypeId.FillUnitLoadedExpr                          : return `${getText(LangConstants.TextType.B1191)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.DestroyUnitSimple                           : return getText(LangConstants.TextType.B1374);
        case WarEventsActionsConstantsCommon.ActionTypeId.DestroyUnitExpr                             : return `${getText(LangConstants.TextType.B1374)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetUnitTypeSimple                           : return getText(LangConstants.TextType.B1192);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetUnitTypeExpr                             : return `${getText(LangConstants.TextType.B1192)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetUnitOwnershipSimple                      : return getText(LangConstants.TextType.B1193);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetUnitOwnershipExpr                        : return `${getText(LangConstants.TextType.B1193)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetUnitPositionSimple                       : return getText(LangConstants.TextType.B1198);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetUnitPositionExpr                         : return `${getText(LangConstants.TextType.B1198)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetUnitStateSimple                          : return getText(LangConstants.TextType.B0806);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetUnitStateExpr                            : return `${getText(LangConstants.TextType.B0806)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.AddUnitBuffSimple                           : return getText(LangConstants.TextType.B1466);
        case WarEventsActionsConstantsCommon.ActionTypeId.ModifyUnitBuffSimple                        : return getText(LangConstants.TextType.B1467);
        case WarEventsActionsConstantsCommon.ActionTypeId.DeleteUnitBuffSimple                        : return getText(LangConstants.TextType.B1469);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetTileTypeExpr                             : return `${getText(LangConstants.TextType.B0825)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetTileTypeSimple                           : return getText(LangConstants.TextType.B0825);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetTileStateExpr                            : return `${getText(LangConstants.TextType.B0861)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetTileStateSimple                          : return getText(LangConstants.TextType.B0861);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetCustomBuildingStateExpr                  : return `${getText(LangConstants.TextType.B1211)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetCustomBuildingStateSimple                : return getText(LangConstants.TextType.B1211);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCrystalStateExpr                   : return `${getText(LangConstants.TextType.B1208)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCrystalStateSimple                 : return getText(LangConstants.TextType.B1208);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCannonStateExpr                    : return `${getText(LangConstants.TextType.B1209)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCannonStateSimple                  : return getText(LangConstants.TextType.B1209);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetCustomLaserTurretStateExpr               : return `${getText(LangConstants.TextType.B1210)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetCustomLaserTurretStateSimple             : return getText(LangConstants.TextType.B1210);
        case WarEventsActionsConstantsCommon.ActionTypeId.DeleteTileBuffExpr                          : return `${getText(LangConstants.TextType.B1234)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.DeleteTileBuffSimple                        : return getText(LangConstants.TextType.B1234);
        case WarEventsActionsConstantsCommon.ActionTypeId.AddTileBuffExpr                             : return `${getText(LangConstants.TextType.B1238)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.AddTileBuffSimple                           : return getText(LangConstants.TextType.B1238);
        case WarEventsActionsConstantsCommon.ActionTypeId.ModifyTileBuffExpr                          : return `${getText(LangConstants.TextType.B1239)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.ModifyTileBuffSimple                        : return getText(LangConstants.TextType.B1239);
        case WarEventsActionsConstantsCommon.ActionTypeId.BigDialogueSimple                           : return getText(LangConstants.TextType.B0674);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetViewpointExpr                            : return `${getText(LangConstants.TextType.B0713)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetViewpointSimple                          : return getText(LangConstants.TextType.B0713);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetWeatherExpr                              : return `${getText(LangConstants.TextType.B0715)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetWeatherSimple                            : return getText(LangConstants.TextType.B0715);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetForceFogCodeExpr                         : return `${getText(LangConstants.TextType.B0795)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetForceFogCodeSimple                       : return getText(LangConstants.TextType.B0795);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetCustomCounters                           : return getText(LangConstants.TextType.B0800);
        case WarEventsActionsConstantsCommon.ActionTypeId.SmallDialogueSimple                         : return getText(LangConstants.TextType.B0728);
        case WarEventsActionsConstantsCommon.ActionTypeId.PlayBgm                                     : return getText(LangConstants.TextType.B0750);
        case WarEventsActionsConstantsCommon.ActionTypeId.PlaySfx                                     : return getText(LangConstants.TextType.B1164);
        case WarEventsActionsConstantsCommon.ActionTypeId.StopPersistentAction                        : return getText(LangConstants.TextType.B0887);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetPlayerStateExpr                          : return `${getText(LangConstants.TextType.B0810)} (${getText(LangConstants.TextType.B0129)})`;
        case WarEventsActionsConstantsCommon.ActionTypeId.SetPlayerStateSimple                        : return getText(LangConstants.TextType.B0810);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetTaskObjectiveState                       : return getText(LangConstants.TextType.B1224);
        case WarEventsActionsConstantsCommon.ActionTypeId.SetUnitMovePathVisibility                   : return getText(LangConstants.TextType.B1340);
        case WarEventsActionsConstantsCommon.ActionTypeId.PersistentShowText                          : return getText(LangConstants.TextType.B0888);
        case WarEventsActionsConstantsCommon.ActionTypeId.PersistentPlayBgm                           : return getText(LangConstants.TextType.B1083);
        case WarEventsActionsConstantsCommon.ActionTypeId.PersistentModifyPlayerAttribute             : return getText(LangConstants.TextType.B0903);
        case WarEventsActionsConstantsCommon.ActionTypeId.PersistentModifyUnitAttribute               : return getText(LangConstants.TextType.B1080);
        default                                                             : return null;
    }
}

export function getWarEventConditionNodeDesc(isNeedAnd: Undefinable<boolean>, isNeedFalse: Undefinable<boolean>): string {
    if (isNeedFalse) {
        return getText(isNeedAnd ? LangConstants.TextType.A0436 : LangConstants.TextType.A0091);
    } else {
        return getText(isNeedAnd ? LangConstants.TextType.A0162 : LangConstants.TextType.A0163);
    }
}

export function getPlayerRuleName(type: PlayerRulesConstants.RuleTypeId): string | null {
    switch (type) {
        case PlayerRulesConstants.RuleTypeId.TeamIndex                       : return getText(LangConstants.TextType.B0019);
        case PlayerRulesConstants.RuleTypeId.BannedCoCategoryIdArray         : return getText(LangConstants.TextType.B0403);
        case PlayerRulesConstants.RuleTypeId.BannedUnitTypeArray             : return getText(LangConstants.TextType.B0895);
        case PlayerRulesConstants.RuleTypeId.CanActivateCoSkill              : return getText(LangConstants.TextType.B0897);
        case PlayerRulesConstants.RuleTypeId.CanCoBoard                      : return getText(LangConstants.TextType.B1427);
        case PlayerRulesConstants.RuleTypeId.CanUnitJoin                     : return getText(LangConstants.TextType.B1428);
        case PlayerRulesConstants.RuleTypeId.InitialFund                     : return getText(LangConstants.TextType.B0178);
        case PlayerRulesConstants.RuleTypeId.IncomeMultiplier                : return getText(LangConstants.TextType.B0179);
        case PlayerRulesConstants.RuleTypeId.MaxUnitsCount                   : return getText(LangConstants.TextType.B1473);
        case PlayerRulesConstants.RuleTypeId.EnergyAddPctOnCoBoard           : return getText(LangConstants.TextType.B0180);
        case PlayerRulesConstants.RuleTypeId.EnergyLossPctOnCoDie            : return getText(LangConstants.TextType.B0127);
        case PlayerRulesConstants.RuleTypeId.EnergyGrowthMultiplier          : return getText(LangConstants.TextType.B0181);
        case PlayerRulesConstants.RuleTypeId.MoveRangeModifier               : return getText(LangConstants.TextType.B0182);
        case PlayerRulesConstants.RuleTypeId.AttackPowerModifier             : return getText(LangConstants.TextType.B0183);
        case PlayerRulesConstants.RuleTypeId.DefenseModifier                 : return getText(LangConstants.TextType.DefBonus$);
        case PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier         : return getText(LangConstants.TextType.B0184);
        case PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier         : return getText(LangConstants.TextType.B1331);
        case PlayerRulesConstants.RuleTypeId.LuckLowerLimit                  : return getText(LangConstants.TextType.B0189);
        case PlayerRulesConstants.RuleTypeId.LuckUpperLimit                  : return getText(LangConstants.TextType.B0190);
        case PlayerRulesConstants.RuleTypeId.McwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.B1303);
        case PlayerRulesConstants.RuleTypeId.MmwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.B1304);
        case PlayerRulesConstants.RuleTypeId.MrwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.B1305);
        case PlayerRulesConstants.RuleTypeId.AtwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.B1306);
        case PlayerRulesConstants.RuleTypeId.CcwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.B1302);
        case PlayerRulesConstants.RuleTypeId.CcwAiCoId                       : return getText(LangConstants.TextType.B1263);
        case PlayerRulesConstants.RuleTypeId.WarRoomAiCoId                   : return getText(LangConstants.TextType.B1264);
        case PlayerRulesConstants.RuleTypeId.WarRoomHumanCoCategoryIdArray   : return getText(LangConstants.TextType.B1265);
        case PlayerRulesConstants.RuleTypeId.CampaignAiCoId                  : return getText(LangConstants.TextType.B0642);
        case PlayerRulesConstants.RuleTypeId.CampaignHumanCoIdArray          : return getText(LangConstants.TextType.B0096);
        case PlayerRulesConstants.RuleTypeId.CampaignSkinId                  : return getText(LangConstants.TextType.B1266);
        default                                             : return null;
    }
}
export function getPlayerRuleHelpText(ruleType: PlayerRulesConstants.RuleTypeId): string | null {
    switch (ruleType) {
        case PlayerRulesConstants.RuleTypeId.TeamIndex                       : return null;
        case PlayerRulesConstants.RuleTypeId.BannedCoCategoryIdArray         : return null;
        case PlayerRulesConstants.RuleTypeId.BannedUnitTypeArray             : return getText(LangConstants.TextType.A0805);
        case PlayerRulesConstants.RuleTypeId.CanActivateCoSkill              : return null;
        case PlayerRulesConstants.RuleTypeId.CanCoBoard                      : return null;
        case PlayerRulesConstants.RuleTypeId.CanUnitJoin                     : return null;
        case PlayerRulesConstants.RuleTypeId.InitialFund                     : return null;
        case PlayerRulesConstants.RuleTypeId.IncomeMultiplier                : return null;
        case PlayerRulesConstants.RuleTypeId.MaxUnitsCount                   : return getText(LangConstants.TextType.A0981);
        case PlayerRulesConstants.RuleTypeId.EnergyAddPctOnCoBoard           : return null;
        case PlayerRulesConstants.RuleTypeId.EnergyLossPctOnCoDie            : return null;
        case PlayerRulesConstants.RuleTypeId.EnergyGrowthMultiplier          : return null;
        case PlayerRulesConstants.RuleTypeId.MoveRangeModifier               : return null;
        case PlayerRulesConstants.RuleTypeId.AttackPowerModifier             : return null;
        case PlayerRulesConstants.RuleTypeId.DefenseModifier                 : return null;
        case PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier         : return null;
        case PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier         : return null;
        case PlayerRulesConstants.RuleTypeId.LuckLowerLimit                  : return null;
        case PlayerRulesConstants.RuleTypeId.LuckUpperLimit                  : return null;
        case PlayerRulesConstants.RuleTypeId.McwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.A0828);
        case PlayerRulesConstants.RuleTypeId.MmwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.A0828);
        case PlayerRulesConstants.RuleTypeId.MrwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.A0828);
        case PlayerRulesConstants.RuleTypeId.AtwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.A0828);
        case PlayerRulesConstants.RuleTypeId.CcwHumanCoCategoryIdArray       : return getText(LangConstants.TextType.A0828);
        case PlayerRulesConstants.RuleTypeId.CcwAiCoId                       : return getText(LangConstants.TextType.A0806);
        case PlayerRulesConstants.RuleTypeId.WarRoomAiCoId                   : return getText(LangConstants.TextType.A0807);
        case PlayerRulesConstants.RuleTypeId.WarRoomHumanCoCategoryIdArray   : return getText(LangConstants.TextType.A0809);
        case PlayerRulesConstants.RuleTypeId.CampaignAiCoId                  : return getText(LangConstants.TextType.A0810);
        case PlayerRulesConstants.RuleTypeId.CampaignHumanCoIdArray          : return getText(LangConstants.TextType.A0811);
        case PlayerRulesConstants.RuleTypeId.CampaignSkinId                  : return getText(LangConstants.TextType.A0812);
        default                                             : return null;
    }
}

export function getForceFogCodeName(code: FogMapsConstants.ForcedFogCode): string | null {
    switch (code) {
        case FogMapsConstants.ForcedFogCode.Fog       : return getText(LangConstants.TextType.B0796);
        case FogMapsConstants.ForcedFogCode.Clear     : return getText(LangConstants.TextType.B0797);
        case FogMapsConstants.ForcedFogCode.None      : return getText(LangConstants.TextType.B0798);
        default                     : return null;
    }
}

export function getAutoTourneyPhaseName(phase: number): string | null {
    switch (phase) {
        case AutoTourneysConstants.PhaseId.Registration    : return getText(LangConstants.TextType.B1039);
        case AutoTourneysConstants.PhaseId.Adjustment      : return getText(LangConstants.TextType.B1040);
        case AutoTourneysConstants.PhaseId.Battle          : return getText(LangConstants.TextType.B1041);
        case AutoTourneysConstants.PhaseId.End             : return getText(LangConstants.TextType.B1002);
        default                                 : return null;
    }
}

export function getMedalDesc(medalId: number): string | null {
    const typeParams = MedalsUtils.getMedalCfg(medalId)?.typeParams;
    if (typeParams == null) {
        return null;
    }

    const medalType = typeParams[0];
    if (medalType === MedalsConstants.MedalTypeId.TournamentPrize) {
        return getFormattedText(LangConstants.TextType.F0162, typeParams[1]);
    } else {
        return null;
    }
}

export function getGameVersionName(type: GameVersionsConstants.TypeName): string | null {
    switch (type) {
        case GameVersionsConstants.TypeName.Legacy     : return getText(LangConstants.TextType.B0385);
        case GameVersionsConstants.TypeName.Test       : return getText(LangConstants.TextType.B0622);
        case GameVersionsConstants.TypeName.Dor        : return getText(LangConstants.TextType.B1131);
        case GameVersionsConstants.TypeName.Trilogy    : return getText(LangConstants.TextType.B1348);
        case GameVersionsConstants.TypeName.TinyWars2  : return getText(LangConstants.TextType.B1308);
        case GameVersionsConstants.TypeName.Awbw       : return getText(LangConstants.TextType.B0649);
        default                         : return null;
    }
}
export function getGameVersionDesc(type: GameVersionsConstants.TypeName): string | null {
    switch (type) {
        case GameVersionsConstants.TypeName.Legacy     : return getText(LangConstants.TextType.A0217);
        case GameVersionsConstants.TypeName.Test       : return getText(LangConstants.TextType.A0218);
        case GameVersionsConstants.TypeName.Dor        : return getText(LangConstants.TextType.A0438);
        case GameVersionsConstants.TypeName.Trilogy    : return getText(LangConstants.TextType.A0886);
        case GameVersionsConstants.TypeName.TinyWars2  : return getText(LangConstants.TextType.A0843);
        case GameVersionsConstants.TypeName.Awbw       : return getText(LangConstants.TextType.A0224);
        default                         : return null;
    }
}

export function getMapSortTypeName(type: GameConfigGcMap.SortType): string | null {
    switch (type) {
        case GameConfigGcMap.SortType.MapName                    : return getText(LangConstants.TextType.B0225);
        case GameConfigGcMap.SortType.NormalMapId                : return getText(LangConstants.TextType.B0821);
        case GameConfigGcMap.SortType.DesignerName               : return getText(LangConstants.TextType.B0163);
        case GameConfigGcMap.SortType.Popularity                 : return getText(LangConstants.TextType.B0565);
        case GameConfigGcMap.SortType.GlobalRating               : return getText(LangConstants.TextType.B0364);
        case GameConfigGcMap.SortType.MyRating                   : return getText(LangConstants.TextType.B0363);
        case GameConfigGcMap.SortType.PlayersCountUnneutral      : return getText(LangConstants.TextType.B0229);
        case GameConfigGcMap.SortType.GridsCount                 : return getText(LangConstants.TextType.B1105);
        default                                     : return null;
    }
}

export function getGameModeName(gameMode: GameModesConstants.ModeId): string | null {
    switch (gameMode) {
        case GameModesConstants.ModeId.Coop              : return getText(LangConstants.TextType.B0646);
        case GameModesConstants.ModeId.Free              : return getText(LangConstants.TextType.B0557);
        case GameModesConstants.ModeId.Versus            : return getText(LangConstants.TextType.B1011);
        case GameModesConstants.ModeId.RankedMatch       : return getText(LangConstants.TextType.B0404);
        case GameModesConstants.ModeId.UnrankedMatch     : return getText(LangConstants.TextType.B1012);
        case GameModesConstants.ModeId.SingleCustom      : return getText(LangConstants.TextType.B1262);
        case GameModesConstants.ModeId.WarRoom           : return getText(LangConstants.TextType.B0614);
        case GameModesConstants.ModeId.AutoTourney    : return getText(LangConstants.TextType.B1022);
        default                             : return null;
    }
}
export function getGameModeHelpText(gameMode: GameModesConstants.ModeId): string | null {
    switch (gameMode) {
        case GameModesConstants.ModeId.Coop              : return getText(LangConstants.TextType.R0008);
        case GameModesConstants.ModeId.Free              : return getText(LangConstants.TextType.R0007);
        case GameModesConstants.ModeId.Versus            : return getText(LangConstants.TextType.A0797);
        case GameModesConstants.ModeId.RankedMatch       : return getText(LangConstants.TextType.A0798);
        case GameModesConstants.ModeId.UnrankedMatch     : return getText(LangConstants.TextType.R0017);
        case GameModesConstants.ModeId.SingleCustom      : return getText(LangConstants.TextType.A0799);
        case GameModesConstants.ModeId.WarRoom           : return getText(LangConstants.TextType.A0800);
        case GameModesConstants.ModeId.AutoTourney    : return getText(LangConstants.TextType.R0018);
        default                             : return null;
    }
}

export function getExpressionParserContextName(type: ExpressionParsersEnums.ContextType): string | null {
    switch (type) {
        case ExpressionParsersEnums.ContextType.CustomCounter       : return getText(LangConstants.TextType.B1143);
        case ExpressionParsersEnums.ContextType.War                 : return getText(LangConstants.TextType.B0719);
        case ExpressionParsersEnums.ContextType.Tile                : return getText(LangConstants.TextType.B1144);
        case ExpressionParsersEnums.ContextType.TileArray           : return getText(LangConstants.TextType.B1156);
        case ExpressionParsersEnums.ContextType.Unit                : return getText(LangConstants.TextType.B1058);
        case ExpressionParsersEnums.ContextType.UnitArray           : return getText(LangConstants.TextType.B1157);
        case ExpressionParsersEnums.ContextType.Position            : return getText(LangConstants.TextType.B1181);
        case ExpressionParsersEnums.ContextType.PositionArray       : return getText(LangConstants.TextType.B1182);
        case ExpressionParsersEnums.ContextType.UnitStatistic       : return getText(LangConstants.TextType.B1166);
        case ExpressionParsersEnums.ContextType.UnitStatisticArray  : return getText(LangConstants.TextType.B1167);
        case ExpressionParsersEnums.ContextType.Player              : return getText(LangConstants.TextType.B0031);
        case ExpressionParsersEnums.ContextType.PlayerArray         : return getText(LangConstants.TextType.B1158);
        case ExpressionParsersEnums.ContextType.Number              : return getText(LangConstants.TextType.B0133);
        case ExpressionParsersEnums.ContextType.NumberArray         : return getText(LangConstants.TextType.B1159);
        case ExpressionParsersEnums.ContextType.Turn                : return getText(LangConstants.TextType.B0191);
        case ExpressionParsersEnums.ContextType.Weather             : return getText(LangConstants.TextType.Weather);
        case ExpressionParsersEnums.ContextType.TaskObjective       : return getText(LangConstants.TextType.B1214);
        case ExpressionParsersEnums.ContextType.TileBuff            : return getText(LangConstants.TextType.B1232);
        case ExpressionParsersEnums.ContextType.TileBuffArray       : return getText(LangConstants.TextType.B1233);
        case ExpressionParsersEnums.ContextType.WarOperation        : return getText(LangConstants.TextType.B1212);
        case ExpressionParsersEnums.ContextType.Fog                 : return getText(LangConstants.TextType.B1145);
        default                                                 : return null;
    }
}
export function getExpressionParserResultTypeName(type: ExpressionParsersEnums.ResultType): string | null {
    switch (type) {
        case ExpressionParsersEnums.ResultType.War                  : return getText(LangConstants.TextType.B0719);
        case ExpressionParsersEnums.ResultType.Tile                 : return getText(LangConstants.TextType.B1144);
        case ExpressionParsersEnums.ResultType.TileArray            : return getText(LangConstants.TextType.B1156);
        case ExpressionParsersEnums.ResultType.TileBuff             : return getText(LangConstants.TextType.B1232);
        case ExpressionParsersEnums.ResultType.TileBuffArray        : return getText(LangConstants.TextType.B1233);
        case ExpressionParsersEnums.ResultType.Unit                 : return getText(LangConstants.TextType.B1058);
        case ExpressionParsersEnums.ResultType.UnitArray            : return getText(LangConstants.TextType.B1157);
        case ExpressionParsersEnums.ResultType.Position             : return getText(LangConstants.TextType.B1181);
        case ExpressionParsersEnums.ResultType.PositionArray        : return getText(LangConstants.TextType.B1182);
        case ExpressionParsersEnums.ResultType.UnitStatistic        : return getText(LangConstants.TextType.B1166);
        case ExpressionParsersEnums.ResultType.UnitStatisticArray   : return getText(LangConstants.TextType.B1167);
        case ExpressionParsersEnums.ResultType.Player               : return getText(LangConstants.TextType.B0031);
        case ExpressionParsersEnums.ResultType.PlayerArray          : return getText(LangConstants.TextType.B1158);
        case ExpressionParsersEnums.ResultType.Number               : return getText(LangConstants.TextType.B0133);
        case ExpressionParsersEnums.ResultType.NumberArray          : return getText(LangConstants.TextType.B1159);
        case ExpressionParsersEnums.ResultType.Turn                 : return getText(LangConstants.TextType.B0191);
        case ExpressionParsersEnums.ResultType.Weather              : return getText(LangConstants.TextType.Weather);
        case ExpressionParsersEnums.ResultType.WarOperation         : return getText(LangConstants.TextType.B1212);
        case ExpressionParsersEnums.ResultType.Fog                  : return getText(LangConstants.TextType.B1145);
        case ExpressionParsersEnums.ResultType.Lambda               : return getText(LangConstants.TextType.B1169);
        case ExpressionParsersEnums.ResultType.Unknown              : return getText(LangConstants.TextType.B0672);
        default                                                 : return null;
    }
}

export function getBuffEndTimeModificationModeName(mode: WarEventsActionsConstantsCommon.BuffEndTimeModificationMode): string | null {
    switch (mode) {
        case WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.DoNotChange                    : return getText(LangConstants.TextType.B1463);
        case WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.Delete                         : return getText(LangConstants.TextType.B1455);
        case WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.SetAbsoluteValue               : return getText(LangConstants.TextType.B1464);
        case WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.AddOffset                      : return `${getText(LangConstants.TextType.B1017)} 1`;
        case WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime  : return `${getText(LangConstants.TextType.B1017)} 2`;
        default                                                         : return null;
    }
}

export function getLanguageText({ textArray, languageType = getCurrentLanguageType(), useAlternate = true }: {
    textArray       : Undefinable<LanguageText[]>;
    languageType?   : LangConstants.LanguageType;
    useAlternate?   : boolean;
}): string | null {
    if ((textArray == null) || (!textArray.length)) {
        return null;
    }

    const data = textArray.find(v => (v.getLanguageType() ?? 0) === languageType);
    if (data) {
        return data.getText() ?? null;
    }
    if (!useAlternate) {
        return null;
    }

    const secondaryText = getLanguageText({ textArray, languageType: getSecondaryLanguageType(languageType), useAlternate: false });
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
    const rawText1 = getLanguageText({ textArray, languageType: getCurrentLanguageType(), useAlternate: false })?.trim() || `----`;
    const rawText2 = getLanguageText({ textArray, languageType: getSecondaryLanguageType(), useAlternate: false })?.trim() || `----`;
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
        return `0${getText(LangConstants.TextType.B0017)}`;
    } else {
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours   = Math.floor(totalSeconds / (60 * 60)) % 24;
        const days    = Math.floor(totalSeconds / (60 * 60 * 24));

        const textArray: string[] = [];
        (days    > 0) && (textArray.push(`${days}${getText(LangConstants.TextType.B0014)}`));
        (hours   > 0) && (textArray.push(`${hours}${getText(LangConstants.TextType.B0015)}`));
        (minutes > 0) && (textArray.push(`${minutes}${getText(LangConstants.TextType.B0016)}`));
        (seconds > 0) && (textArray.push(`${seconds}${getText(LangConstants.TextType.B0017)}`));
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
        return `${HelpersText.getNumText(hours)}:${HelpersText.getNumText(minutes)}:${HelpersText.getNumText(seconds)}`;
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
    const strYear    = (!controller) || (controller.year !== false)  ? `${HelpersText.getNumText(d.getFullYear(), 4)}${getText(LangConstants.TextType.B0059)}`     : ``;
    const strMonth   = (!controller) || (controller.month !== false) ? `${HelpersText.getNumText(d.getMonth() + 1)}${getText(LangConstants.TextType.B0058)}`    : ``;
    const strDate    = (!controller) || (controller.date !== false)  ? `${HelpersText.getNumText(d.getDate())}${getText(LangConstants.TextType.B0057)}`         : ``;
    const strHour    = needHour                 ? `${HelpersText.getNumText(d.getHours())}`   : "";
    const sep1       = needHour   && needMinute ? ":" : "";
    const strMinute  = needMinute               ? `${HelpersText.getNumText(d.getMinutes())}` : "";
    const sep2       = needMinute && needSecond ? ":" : "";
    const strSecond  = needSecond               ? `${HelpersText.getNumText(d.getSeconds())}` : "";
    return strYear + strMonth + strDate + strHour + sep1 + strMinute + sep2 + strSecond;
}
export function getTimestampShortText(timestamp: number, controller?: TimeTextController): string {
    const d = new Date(timestamp * 1000);
    const needHour   = (!controller) || (controller.hour !== false);
    const needMinute = (!controller) || (controller.minute !== false);
    const needSecond = (!controller) || (controller.second !== false);
    const strYear    = (!controller) || (controller.year !== false)  ? `${HelpersText.getNumText(d.getFullYear(), 4)}/`     : ``;
    const strMonth   = (!controller) || (controller.month !== false) ? `${HelpersText.getNumText(d.getMonth() + 1)}/`    : ``;
    const strDate    = (!controller) || (controller.date !== false)  ? `${HelpersText.getNumText(d.getDate())} `         : ``;
    const strHour    = needHour                 ? `${HelpersText.getNumText(d.getHours())}`   : "";
    const sep1       = needHour   && needMinute ? ":" : "";
    const strMinute  = needMinute               ? `${HelpersText.getNumText(d.getMinutes())}` : "";
    const sep2       = needMinute && needSecond ? ":" : "";
    const strSecond  = needSecond               ? `${HelpersText.getNumText(d.getSeconds())}` : "";
    return strYear + strMonth + strDate + strHour + sep1 + strMinute + sep2 + strSecond;
}

export function getBootTimerTypeName(type: BootTimersConstants.TimerTypeId): string | null {
    switch (type) {
        case BootTimersConstants.TimerTypeId.Regular    : return getText(LangConstants.TextType.B0387);
        case BootTimersConstants.TimerTypeId.Incremental: return getText(LangConstants.TextType.B0388);
        default                             : return null;
    }
}
export function getBootTimerDesc(params: number[]): string | null {
    params          = params || [];
    const timerType = params[0] as BootTimersConstants.TimerTypeId;
    if (timerType === BootTimersConstants.TimerTypeId.Regular) {
        return `${getText(LangConstants.TextType.B0387)} ${getTimeDurationText2(params[1])}`;
    } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
        return `${getText(LangConstants.TextType.B0388)} ${getTimeDurationText2(params[1])} + ${getTimeDurationText2(params[2])}`;
    } else {
        return null;
    }
}

export function getComparatorName(comparator: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): string | null {
    switch (comparator) {
        case ValueAndComparatorsConstants.ComparatorId.EqualTo          : return getText(LangConstants.TextType.B0767);
        case ValueAndComparatorsConstants.ComparatorId.NotEqualTo       : return getText(LangConstants.TextType.B0768);
        case ValueAndComparatorsConstants.ComparatorId.GreaterThan      : return getText(LangConstants.TextType.B0769);
        case ValueAndComparatorsConstants.ComparatorId.NotGreaterThan   : return getText(LangConstants.TextType.B0770);
        case ValueAndComparatorsConstants.ComparatorId.LessThan         : return getText(LangConstants.TextType.B0771);
        case ValueAndComparatorsConstants.ComparatorId.NotLessThan      : return getText(LangConstants.TextType.B0772);
        default                                 : return null;
    }
}
export function getSetRelationName(relation: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): string {
    switch (relation) {
        case ValueSetAndRelationsConstants.SetRelationId.EqualTo          : return getText(LangConstants.TextType.B1409);
        case ValueSetAndRelationsConstants.SetRelationId.NotEqualTo       : return getText(LangConstants.TextType.B1410);
        case ValueSetAndRelationsConstants.SetRelationId.SupersetOf       : return getText(LangConstants.TextType.B1411);
        case ValueSetAndRelationsConstants.SetRelationId.NotSupersetOf    : return getText(LangConstants.TextType.B1412);
        case ValueSetAndRelationsConstants.SetRelationId.SubsetOf         : return getText(LangConstants.TextType.B1413);
        case ValueSetAndRelationsConstants.SetRelationId.NotSubsetOf      : return getText(LangConstants.TextType.B1414);
        case ValueSetAndRelationsConstants.SetRelationId.Intersection     : return getText(LangConstants.TextType.B1415);
        case ValueSetAndRelationsConstants.SetRelationId.NoIntersection   : return getText(LangConstants.TextType.B1416);
        default                             : return LangConstants.UndefinedError;
    }
}
