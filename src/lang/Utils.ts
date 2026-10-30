import {
    Units_Constants,
    Players_Constants,
    Wars_Constants,
    WarEvents_Actions_Constants_Common,
    Utils_ClientErrorCode,
    Lang_CommonText,
    ValueAndComparators_Constants,
    WarEvents_Conditions_Constants,
    ExpressionParsers_Enums,
    MapEditors_Constants,
    Cos_Constants,
    Lang_ErrorText,
    FogMaps_Constants,
    Helpers_Text,
    GameConfigs_GameConfig,
    Sounds_Utils,
    LocalData_Storage,
    Medals_Utils,
    TileDecorations_Utils,
    TileObjects_Utils,
    Lang_Constants,
    Medals_Constants,
    GameModes_Constants,
    MultiPlayerRooms_Constants,
    Helpers_Misc,
    Tiles_Constants_Common,
    Turns_Constants,
    AutoTourneys_Constants,
    Chat_Constants,
    Maps_Constants,
    PlayerRules_Constants,
    Utils_ServerErrorCode,
    ValueSetAndRelations_Constants,
    CoSkills_Constants,
    Dialogues_Constants,
    TileBuffs_Constants,
    BootTimers_Constants,
    GameVersions_Constants,
    UnitBuffs_Constants,
    WarTypes_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { LanguageText } from "../proto/schema/CommonProto/Structure/LanguageText.ts";

let _languageType = Lang_Constants.LanguageType.Chinese;
export function init(): void {
    setCurrentLanguageType(LocalData_Storage.getLanguageType());
}

export function getCurrentLanguageType(): Lang_Constants.LanguageType {
    return _languageType;
}
export function setCurrentLanguageType(language: Lang_Constants.LanguageType): void {
    _languageType = language;
}
export function getSecondaryLanguageType(t = getCurrentLanguageType()): Lang_Constants.LanguageType {
    switch (t) {
        case Lang_Constants.LanguageType.Chinese   : return Lang_Constants.LanguageType.English;
        case Lang_Constants.LanguageType.English   : return Lang_Constants.LanguageType.Chinese;  // TODO
        case Lang_Constants.LanguageType.Spanish   : return Lang_Constants.LanguageType.English;
        default                     : return Lang_Constants.LanguageType.English;
    }
}
export function getLanguageTypeName(type: Lang_Constants.LanguageType): string | null {
    switch (type) {
        case Lang_Constants.LanguageType.Chinese   : return getText(Lang_Constants.TextType.B0624, Lang_Constants.LanguageType.Chinese);
        case Lang_Constants.LanguageType.English   : return getText(Lang_Constants.TextType.B0625, Lang_Constants.LanguageType.English);
        case Lang_Constants.LanguageType.Spanish   : return getText(Lang_Constants.TextType.B1435, Lang_Constants.LanguageType.Spanish);
        default                     : return null;
    }
}

export function checkIsValidLanguageType(t: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
    return (t === Lang_Constants.LanguageType.Chinese)
        || (t === Lang_Constants.LanguageType.English)
        || (t === Lang_Constants.LanguageType.Spanish);
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

export function getText(t: Lang_Constants.TextType, languageType = getCurrentLanguageType()): string {
    const data = Lang_CommonText.CommonText[t];
    const text = data ? data[languageType] : null;
    if (text != null) {
        return text;
    } else {
        throw Helpers_Misc.newError(`getText() empty text: ${t} ${languageType}`, Utils_ClientErrorCode.ClientErrorCode.Lang_GetText_00);
    }
}

export function getFormattedText(t: Lang_Constants.TextType, ...params: (AuxiliaryTypes_AuxiliaryTypes.Undefinable<number | string>)[]): string {
    if ((t < Lang_Constants.TextType.F0000) || (t >= Lang_Constants.TextType.R0000)) {
        throw Helpers_Misc.newError(`getFormattedText() invalid t:${t}`);
    }

    const data = getText(t);
    return data === Lang_Constants.UndefinedError
        ? Lang_Constants.UndefinedError
        : Helpers_Text.format(data, ...params);
}

export function getErrorText(code: Utils_ServerErrorCode.ServerErrorCode | Utils_ClientErrorCode.ClientErrorCode): string {
    const textList  = Lang_ErrorText.ErrorText[code];
    const text      = textList ? textList[_languageType] : null;
    return code === Utils_ServerErrorCode.ServerErrorCode.UserGuestPrivilege_0000
        ? `${text || getText(Lang_Constants.TextType.A0153)}`
        : `${getText(Lang_Constants.TextType.B0452)} ${code}: ${text || getText(Lang_Constants.TextType.A0153)}`;
}

export function getTextForYesOrNo(value: unknown): string {
    return getText(value ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
}

export function getPlayerForceName(playerIndex: number): string {
    return `P${playerIndex}`;
}

export function getPlayerTeamName(teamIndex: number): string | null {
    switch (teamIndex) {
        case 0  : return getText(Lang_Constants.TextType.B0030);
        case 1  : return getText(Lang_Constants.TextType.B0008);
        case 2  : return getText(Lang_Constants.TextType.B0009);
        case 3  : return getText(Lang_Constants.TextType.B0010);
        case 4  : return getText(Lang_Constants.TextType.B0011);
        case 5  : return getText(Lang_Constants.TextType.B0699);
        case 6  : return getText(Lang_Constants.TextType.B0112);
        case 7  : return getText(Lang_Constants.TextType.B0113);
        case 8  : return getText(Lang_Constants.TextType.B0114);
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
export function getWeatherName(weatherType: number, gameConfig: GameConfigs_GameConfig.GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getWeatherCfg(weatherType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getWeatherDesc(weatherType: number, gameConfig: GameConfigs_GameConfig.GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getWeatherCfg(weatherType)?.getDescTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getWeatherFullDesc(gameConfig: GameConfigs_GameConfig.GameConfig): string {
    const textArray: string[] = [];
    for (const weatherType of gameConfig.getAllWeatherTypeArray()) {
        textArray.push(`${getWeatherName(weatherType, gameConfig)}: ${getWeatherDesc(weatherType, gameConfig)}`);
    }
    return getFormattedText(Lang_Constants.TextType.F0200, textArray.join(`\n`));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getTileBaseName(tileBaseType: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    const tileType = gameConfig.getTileType(tileBaseType, Tiles_Constants_Common.ObjectTypeId.Empty);
    return tileType == null ? null : getTileName(tileType, gameConfig);
}

export function getTileThemeName(tileTheme: number | null): string | null {
    switch (tileTheme) {
        case Tiles_Constants_Common.ThemeTypeId.Normal     : return getText(Lang_Constants.TextType.B0701);
        case Tiles_Constants_Common.ThemeTypeId.Rain       : return getText(Lang_Constants.TextType.B0704);
        case Tiles_Constants_Common.ThemeTypeId.Sandstorm  : return getText(Lang_Constants.TextType.B0702);
        case Tiles_Constants_Common.ThemeTypeId.Snow       : return getText(Lang_Constants.TextType.B0703);
        case null                       : return getText(Lang_Constants.TextType.B0890);
        default                         : return null;
    }
}

export function getTileBuffName(buffType: number): string | null {
    switch (buffType) {
        case TileBuffs_Constants.BuffTypeId.NoProduction    : return getText(Lang_Constants.TextType.B1240);
        case TileBuffs_Constants.BuffTypeId.NoIncome        : return getText(Lang_Constants.TextType.B1230);
        case TileBuffs_Constants.BuffTypeId.Custom          : return getText(Lang_Constants.TextType.B0321);
        default                             : return null;
    }
}

export function getTileBuffDesc(buffType: number): string | null {
    switch (buffType) {
        case TileBuffs_Constants.BuffTypeId.NoProduction    : return getText(Lang_Constants.TextType.A0770);
        case TileBuffs_Constants.BuffTypeId.NoIncome        : return getText(Lang_Constants.TextType.A0740);
        case TileBuffs_Constants.BuffTypeId.Custom          : return getText(Lang_Constants.TextType.A0970);
        default                             : return null;
    }
}

export function getTileBuffExtraParamDesc(buffType: number): string | null {
    switch (buffType) {
        case TileBuffs_Constants.BuffTypeId.NoProduction    : return getText(Lang_Constants.TextType.A0745);
        case TileBuffs_Constants.BuffTypeId.NoIncome        : return getText(Lang_Constants.TextType.A0745);
        case TileBuffs_Constants.BuffTypeId.Custom          : return getText(Lang_Constants.TextType.A0745);
        default                             : return null;
    }
}

export function getTileName(tileType: Tiles_Constants_Common.TileTypeId, gameConfig: GameConfigs_GameConfig.GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getTileTemplateCfg(tileType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getTileObjectName(tileObjectType: number, gameConfig: GameConfigs_GameConfig.GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = TileObjects_Utils.getTileObjectCfg(tileObjectType)?.nameTextId;
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getTileDecorationName(tileDecorationType: number, gameConfig: GameConfigs_GameConfig.GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = TileDecorations_Utils.getTileDecorationCfg(tileDecorationType)?.nameTextId;
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getUnitName(unitType: number, gameConfig: GameConfigs_GameConfig.GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getUnitTemplateCfg(unitType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getUnitCategoryName(unitCategory: number, gameConfig: GameConfigs_GameConfig.GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId    = gameConfig.getUnitCategoryCfg(unitCategory)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getUnitActionName(actionType: Units_Constants.ActionTypeId): string | null{
    switch (actionType) {
        case Units_Constants.ActionTypeId.BeLoaded        : return getText(Lang_Constants.TextType.B0037);
        case Units_Constants.ActionTypeId.Join            : return getText(Lang_Constants.TextType.B0038);
        case Units_Constants.ActionTypeId.UseCoPower      : return getText(Lang_Constants.TextType.B0142);
        case Units_Constants.ActionTypeId.UseCoSuperPower : return getText(Lang_Constants.TextType.B0144);
        case Units_Constants.ActionTypeId.Attack          : return getText(Lang_Constants.TextType.B0039);
        case Units_Constants.ActionTypeId.CaptureTile         : return getText(Lang_Constants.TextType.B0040);
        case Units_Constants.ActionTypeId.CrushUnit       : return getText(Lang_Constants.TextType.B1350);
        case Units_Constants.ActionTypeId.Dive            : return getText(Lang_Constants.TextType.B0041);
        case Units_Constants.ActionTypeId.RepairUnit      : return getText(Lang_Constants.TextType.B1351);
        case Units_Constants.ActionTypeId.Surface         : return getText(Lang_Constants.TextType.B0042);
        case Units_Constants.ActionTypeId.BuildTile       : return getText(Lang_Constants.TextType.B0043);
        case Units_Constants.ActionTypeId.SelfDetonate    : return getText(Lang_Constants.TextType.B1349);
        case Units_Constants.ActionTypeId.Supply          : return getText(Lang_Constants.TextType.B0044);
        case Units_Constants.ActionTypeId.LaunchUnit      : return getText(Lang_Constants.TextType.B0045);
        case Units_Constants.ActionTypeId.DropUnit        : return getText(Lang_Constants.TextType.B0046);
        case Units_Constants.ActionTypeId.LaunchFlare     : return getText(Lang_Constants.TextType.B0047);
        case Units_Constants.ActionTypeId.LaunchSilo      : return getText(Lang_Constants.TextType.B0048);
        case Units_Constants.ActionTypeId.CoBoard         : return getText(Lang_Constants.TextType.B0139);
        case Units_Constants.ActionTypeId.ProduceUnit     : return getText(Lang_Constants.TextType.B0049);
        case Units_Constants.ActionTypeId.Wait            : return getText(Lang_Constants.TextType.B0050);
        default                             : return null;
    }
}

export function getUnitAiModeName(mode: Units_Constants.AiModeId): string | null {
    switch (mode) {
        case Units_Constants.AiModeId.NoMove                : return getText(Lang_Constants.TextType.B0721);
        case Units_Constants.AiModeId.Normal                : return getText(Lang_Constants.TextType.B0723);
        case Units_Constants.AiModeId.WaitUntilCanAttack    : return getText(Lang_Constants.TextType.B0722);
        default                                     : return null;
    }
}

export function getUnitBuffName(buffTypeId: number): string | null {
    switch (buffTypeId) {
        case UnitBuffs_Constants.BuffTypeId.Fire      : return getText(Lang_Constants.TextType.B1307);
        case UnitBuffs_Constants.BuffTypeId.Disease   : return getText(Lang_Constants.TextType.B1465);
        case UnitBuffs_Constants.BuffTypeId.Custom    : return getText(Lang_Constants.TextType.B0321);
        default                                         : return null;
    }
}

export function getUnitBuffDesc(buffType: number): string | null {
    switch (buffType) {
        case UnitBuffs_Constants.BuffTypeId.Fire      : return getText(Lang_Constants.TextType.A0968);
        case UnitBuffs_Constants.BuffTypeId.Disease   : return getText(Lang_Constants.TextType.A0969);
        case UnitBuffs_Constants.BuffTypeId.Custom    : return getText(Lang_Constants.TextType.A0970);
        default                                         : return null;
    }
}

export function getUnitBuffExtraParamDesc(buffType: number): string | null {
    switch (buffType) {
        case UnitBuffs_Constants.BuffTypeId.Fire      : return getText(Lang_Constants.TextType.A0745);
        case UnitBuffs_Constants.BuffTypeId.Disease   : return getText(Lang_Constants.TextType.A0745);
        case UnitBuffs_Constants.BuffTypeId.Custom    : return getText(Lang_Constants.TextType.A0745);
        default                                         : return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getMoveTypeName(moveType: number, gameConfig: GameConfigs_GameConfig.GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId = gameConfig.getMoveTypeCfg(moveType)?.getNameTextId();
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getBgmSfxName(bgmCode: number, gameConfig: GameConfigs_GameConfig.GameConfig, languageType = getCurrentLanguageType()): string | null {
    const textId = Sounds_Utils.getBgmSfxCfg(bgmCode)?.nameTextId;
    const textArray = textId == null ? null : gameConfig.getTextArray(textId, languageType);
    return textArray == null ? null : textArray[0];
}

export function getWarTypeName(type: WarTypes_Constants.WarTypeId): string | null {
    switch (type) {
        case WarTypes_Constants.WarTypeId.McwStd     : return getText(Lang_Constants.TextType.B0417);
        case WarTypes_Constants.WarTypeId.McwFog     : return getText(Lang_Constants.TextType.B0418);
        case WarTypes_Constants.WarTypeId.Me         : return getText(Lang_Constants.TextType.B0271);
        case WarTypes_Constants.WarTypeId.MrwStd     : return getText(Lang_Constants.TextType.B0415);
        case WarTypes_Constants.WarTypeId.MrwFog     : return getText(Lang_Constants.TextType.B0416);
        case WarTypes_Constants.WarTypeId.MmwStd     : return getText(Lang_Constants.TextType.B1014);
        case WarTypes_Constants.WarTypeId.MmwFog     : return getText(Lang_Constants.TextType.B1015);
        case WarTypes_Constants.WarTypeId.AtwStd     : return getText(Lang_Constants.TextType.B1023);
        case WarTypes_Constants.WarTypeId.AtwFog     : return getText(Lang_Constants.TextType.B1024);
        case WarTypes_Constants.WarTypeId.MfwStd     : return getText(Lang_Constants.TextType.B0812);
        case WarTypes_Constants.WarTypeId.MfwFog     : return getText(Lang_Constants.TextType.B0813);
        case WarTypes_Constants.WarTypeId.ScwStd     : return getText(Lang_Constants.TextType.B0417);
        case WarTypes_Constants.WarTypeId.ScwFog     : return getText(Lang_Constants.TextType.B0418);
        case WarTypes_Constants.WarTypeId.SfwStd     : return getText(Lang_Constants.TextType.B0612);
        case WarTypes_Constants.WarTypeId.SfwFog     : return getText(Lang_Constants.TextType.B0613);
        case WarTypes_Constants.WarTypeId.CcwStd     : return getText(Lang_Constants.TextType.B0725);
        case WarTypes_Constants.WarTypeId.CcwFog     : return getText(Lang_Constants.TextType.B0726);
        case WarTypes_Constants.WarTypeId.SrwStd     : return getText(Lang_Constants.TextType.B0257);
        case WarTypes_Constants.WarTypeId.SrwFog     : return getText(Lang_Constants.TextType.B0817);
        case WarTypes_Constants.WarTypeId.CampStd    : return getText(Lang_Constants.TextType.B0093);
        case WarTypes_Constants.WarTypeId.CampFog    : return getText(Lang_Constants.TextType.B0118);
        default                 : return null;
    }
}

export function getWarBasicSettingsName(type: Wars_Constants.BasicSettingsTypeId): string | null {
    switch (type) {
        case Wars_Constants.BasicSettingsTypeId.NormalMapId                     : return getText(Lang_Constants.TextType.B0225);
        case Wars_Constants.BasicSettingsTypeId.WarName                   : return getText(Lang_Constants.TextType.B0185);
        case Wars_Constants.BasicSettingsTypeId.WarPassword               : return getText(Lang_Constants.TextType.B0186);
        case Wars_Constants.BasicSettingsTypeId.WarComment                : return getText(Lang_Constants.TextType.B0187);
        case Wars_Constants.BasicSettingsTypeId.WarRuleTitle              : return getText(Lang_Constants.TextType.B0318);
        case Wars_Constants.BasicSettingsTypeId.HasFog                    : return getText(Lang_Constants.TextType.B0020);
        case Wars_Constants.BasicSettingsTypeId.Weather                   : return getText(Lang_Constants.TextType.Weather);
        case Wars_Constants.BasicSettingsTypeId.TileTheme                 : return getText(Lang_Constants.TextType.B1113);
        case Wars_Constants.BasicSettingsTypeId.WarEvent                  : return getText(Lang_Constants.TextType.B0469);
        case Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit   : return getText(Lang_Constants.TextType.B0987);
        case Wars_Constants.BasicSettingsTypeId.TimerType                 : return getText(Lang_Constants.TextType.B0574);
        case Wars_Constants.BasicSettingsTypeId.TimerRegularParam         : return getText(Lang_Constants.TextType.B0021);
        case Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams    : return getText(Lang_Constants.TextType.B0990);
        case Wars_Constants.BasicSettingsTypeId.SpmSaveSlotIndex          : return getText(Lang_Constants.TextType.B0255);
        case Wars_Constants.BasicSettingsTypeId.SpmSaveSlotComment        : return getText(Lang_Constants.TextType.B0605);
        default                                             : return null;
    }
}

export function getRoomTypeName(roomType: MultiPlayerRooms_Constants.MultiPlayerRoomType): string | null {
    switch (roomType) {
        case MultiPlayerRooms_Constants.MultiPlayerRoomType.Atr   : return getText(Lang_Constants.TextType.B1022);
        case MultiPlayerRooms_Constants.MultiPlayerRoomType.Ccr   : return getText(Lang_Constants.TextType.B0646);
        case MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr   : return getText(Lang_Constants.TextType.B1011);
        case MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr   : return getText(Lang_Constants.TextType.B0557);
        case MultiPlayerRooms_Constants.MultiPlayerRoomType.Mmr   : return getText(Lang_Constants.TextType.B1012);
        case MultiPlayerRooms_Constants.MultiPlayerRoomType.Mrr   : return getText(Lang_Constants.TextType.B0404);
        default             : return null;
    }
}

export function getMapReviewStatusText(status: Maps_Constants.ReviewStatus): string | null{
    switch (status) {
        case Maps_Constants.ReviewStatus.None         : return getText(Lang_Constants.TextType.B0273);
        case Maps_Constants.ReviewStatus.Reviewing    : return getText(Lang_Constants.TextType.B0274);
        case Maps_Constants.ReviewStatus.Rejected     : return getText(Lang_Constants.TextType.B0275);
        case Maps_Constants.ReviewStatus.Accepted     : return getText(Lang_Constants.TextType.B0276);
        default                                 : return null;
    }
}

export function getMapEditorDrawerModeText(mode: MapEditors_Constants.DrawerMode): string | null{
    switch (mode) {
        case MapEditors_Constants.DrawerMode.Preview                : return getText(Lang_Constants.TextType.B0286);
        case MapEditors_Constants.DrawerMode.DrawUnit               : return getText(Lang_Constants.TextType.B0281);
        case MapEditors_Constants.DrawerMode.DrawTileBase           : return getText(Lang_Constants.TextType.B0282);
        case MapEditors_Constants.DrawerMode.DrawTileDecoration     : return getText(Lang_Constants.TextType.B0662);
        case MapEditors_Constants.DrawerMode.DrawTileObject         : return getText(Lang_Constants.TextType.B0283);
        case MapEditors_Constants.DrawerMode.DeleteUnit             : return getText(Lang_Constants.TextType.B0284);
        case MapEditors_Constants.DrawerMode.DeleteTileDecoration   : return getText(Lang_Constants.TextType.B0661);
        case MapEditors_Constants.DrawerMode.DeleteTileObject       : return getText(Lang_Constants.TextType.B0285);
        case MapEditors_Constants.DrawerMode.AddTileToLocation      : return getText(Lang_Constants.TextType.B0759);
        case MapEditors_Constants.DrawerMode.DeleteTileFromLocation : return getText(Lang_Constants.TextType.B0760);
        default                                         : return null;
    }
}

export function getUnitActionStateText(state: Units_Constants.ActionStateId): string | null{
    switch (state) {
        case Units_Constants.ActionStateId.Acted  : return getText(Lang_Constants.TextType.B0368);
        case Units_Constants.ActionStateId.Idle   : return getText(Lang_Constants.TextType.B0369);
        default                     : return null;
    }
}

export function getChatChannelName(channel: Chat_Constants.PublicChannelId, languageType: Lang_Constants.LanguageType = getCurrentLanguageType()): string | null {
    switch (channel) {
        case Chat_Constants.PublicChannelId.System   : return getText(Lang_Constants.TextType.B0374, languageType);
        case Chat_Constants.PublicChannelId.PublicEn : return getText(Lang_Constants.TextType.B0373, languageType);
        case Chat_Constants.PublicChannelId.PublicCn : return getText(Lang_Constants.TextType.B0384, languageType);
        default                         : return null;
    }
}

export function getUnitAndTileSkinName(skinId: number): string | null {
    switch (skinId) {
        case 0  : return "";
        case 1  : return getText(Lang_Constants.TextType.B0004);
        case 2  : return getText(Lang_Constants.TextType.B0005);
        case 3  : return getText(Lang_Constants.TextType.B0006);
        case 4  : return getText(Lang_Constants.TextType.B0007);
        case 5  : return getText(Lang_Constants.TextType.B0700);
        case 6  : return getText(Lang_Constants.TextType.B0115);
        case 7  : return getText(Lang_Constants.TextType.B0116);
        case 8  : return getText(Lang_Constants.TextType.B0117);
        default : return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getCoEnergyTypeName(coEnergyType: Cos_Constants.EnergyTypeId): string | null {
    switch (coEnergyType) {
        case Cos_Constants.EnergyTypeId.Dor       : return getText(Lang_Constants.TextType.B1269);
        case Cos_Constants.EnergyTypeId.Trilogy   : return getText(Lang_Constants.TextType.B1270);
        default                     : return null;
    }
}

export function getCoSkillTypeName(skillType: CoSkills_Constants.SkillTypeId): string | null {
    switch (skillType) {
        case CoSkills_Constants.SkillTypeId.Passive      : return getText(Lang_Constants.TextType.B0576);
        case CoSkills_Constants.SkillTypeId.Power        : return getText(Lang_Constants.TextType.B0577);
        case CoSkills_Constants.SkillTypeId.SuperPower   : return getText(Lang_Constants.TextType.B0578);
        default                             : return null;
    }
}

export function getCoSkillDescArray({ coId, skillType, gameConfig, languageType, isExtra }: {
    coId            : number;
    skillType       : CoSkills_Constants.SkillTypeId;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    languageType    : Lang_Constants.LanguageType;
    isExtra         : boolean;
}): string[] | null {
    const cfg = gameConfig.getCoSkillDescCfg(coId);
    if (cfg == null) {
        return null;
    }

    if (skillType === CoSkills_Constants.SkillTypeId.Passive) {
        if (isExtra) {
            switch (languageType) {
                case Lang_Constants.LanguageType.Chinese   : return cfg.getD2dExtra0();
                case Lang_Constants.LanguageType.English   : return cfg.getD2dExtra1();
                case Lang_Constants.LanguageType.Spanish   : return cfg.getD2dExtra2();
                default                     : return cfg.getD2dExtra1();
            }
        } else {
            switch (languageType) {
                case Lang_Constants.LanguageType.Chinese   : return cfg.getD2d0();
                case Lang_Constants.LanguageType.English   : return cfg.getD2d1();
                case Lang_Constants.LanguageType.Spanish   : return cfg.getD2d2();
                default                     : return cfg.getD2d1();
            }
        }
    } else if (skillType === CoSkills_Constants.SkillTypeId.Power) {
        if (isExtra) {
            switch (languageType) {
                case Lang_Constants.LanguageType.Chinese   : return cfg.getPExtra0();
                case Lang_Constants.LanguageType.English   : return cfg.getPExtra1();
                case Lang_Constants.LanguageType.Spanish   : return cfg.getPExtra2();
                default                     : return cfg.getPExtra1();
            }
        } else {
            switch (languageType) {
                case Lang_Constants.LanguageType.Chinese   : return cfg.getP0();
                case Lang_Constants.LanguageType.English   : return cfg.getP1();
                case Lang_Constants.LanguageType.Spanish   : return cfg.getP2();
                default                     : return cfg.getP1();
            }
        }
    } else if (skillType === CoSkills_Constants.SkillTypeId.SuperPower) {
        if (isExtra) {
            switch (languageType) {
                case Lang_Constants.LanguageType.Chinese   : return cfg.getSpExtra0();
                case Lang_Constants.LanguageType.English   : return cfg.getSpExtra1();
                case Lang_Constants.LanguageType.Spanish   : return cfg.getSpExtra2();
                default                     : return cfg.getSpExtra1();
            }
        } else {
            switch (languageType) {
                case Lang_Constants.LanguageType.Chinese   : return cfg.getSp0();
                case Lang_Constants.LanguageType.English   : return cfg.getSp1();
                case Lang_Constants.LanguageType.Spanish   : return cfg.getSp2();
                default                     : return cfg.getSp1();
            }
        }
    } else {
        return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getPlayerAliveStateName(state: Players_Constants.AliveStateId): string | null {
    switch (state) {
        case Players_Constants.AliveStateId.Alive   : return getText(Lang_Constants.TextType.B0471);
        case Players_Constants.AliveStateId.Dead    : return getText(Lang_Constants.TextType.B0472);
        case Players_Constants.AliveStateId.Dying   : return getText(Lang_Constants.TextType.B0473);
        default                             : return null;
    }
}

export function getTurnPhaseName(phaseCode: Turns_Constants.PhaseCode): string | null {
    switch (phaseCode) {
        case Turns_Constants.PhaseCode.WaitBeginTurn    : return getText(Lang_Constants.TextType.B0474);
        case Turns_Constants.PhaseCode.Main             : return getText(Lang_Constants.TextType.B0475);
        default                             : return null;
    }
}

export function getMapSimpleDialogueSideName(side: number): string | null {
    switch (side) {
        case Dialogues_Constants.SmallDialogueSideId.Top       : return getText(Lang_Constants.TextType.B1260);
        case Dialogues_Constants.SmallDialogueSideId.Bottom    : return getText(Lang_Constants.TextType.B1261);
        default                                         : return null;
    }
}

export function getWarEventConditionTypeName(type: WarEvents_Conditions_Constants.ConditionTypeId): string | null {
    switch (type) {
        case WarEvents_Conditions_Constants.ConditionTypeId.WecTurnAndPlayer                     : return getText(Lang_Constants.TextType.B0781);
        case WarEvents_Conditions_Constants.ConditionTypeId.WecEventCalledCount                  : return getText(Lang_Constants.TextType.B0789);
        case WarEvents_Conditions_Constants.ConditionTypeId.WecWeatherAndFog                     : return getText(Lang_Constants.TextType.B0794);
        case WarEvents_Conditions_Constants.ConditionTypeId.WecPlayerPresence                    : return getText(Lang_Constants.TextType.B0786);
        case WarEvents_Conditions_Constants.ConditionTypeId.WecTilePresence                      : return getText(Lang_Constants.TextType.B0779);
        case WarEvents_Conditions_Constants.ConditionTypeId.WecUnitPresence                      : return getText(Lang_Constants.TextType.B0775);
        case WarEvents_Conditions_Constants.ConditionTypeId.WecExpression                        : return getText(Lang_Constants.TextType.B1146);
        case WarEvents_Conditions_Constants.ConditionTypeId.WecCustomCounter                     : return getText(Lang_Constants.TextType.B0802);
        case WarEvents_Conditions_Constants.ConditionTypeId.WecOngoingPersistentActionPresence   : return getText(Lang_Constants.TextType.B0901);
        case WarEvents_Conditions_Constants.ConditionTypeId.WecManualActionStatistics            : return getText(Lang_Constants.TextType.B0929);
        default                                                         : return null;
    }
}

export function getWarEventActionCategoryName(category: WarEvents_Actions_Constants_Common.CategoryId): string | null {
    switch (category) {
        case WarEvents_Actions_Constants_Common.CategoryId.UnitSimple                : return getText(Lang_Constants.TextType.B1058);
        case WarEvents_Actions_Constants_Common.CategoryId.UnitExpr                  : return `${getText(Lang_Constants.TextType.B1058)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.CategoryId.TileSimple                : return getText(Lang_Constants.TextType.B1144);
        case WarEvents_Actions_Constants_Common.CategoryId.TileExpr                  : return `${getText(Lang_Constants.TextType.B1144)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.CategoryId.PlayerSimple              : return getText(Lang_Constants.TextType.B0031);
        case WarEvents_Actions_Constants_Common.CategoryId.PlayerExpr                : return `${getText(Lang_Constants.TextType.B0031)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.CategoryId.WeatherAndFogSimple       : return getText(Lang_Constants.TextType.B1345);
        case WarEvents_Actions_Constants_Common.CategoryId.WeatherAndFogExpr         : return `${getText(Lang_Constants.TextType.B1345)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.CategoryId.ImageAndSoundSimple       : return getText(Lang_Constants.TextType.B1343);
        case WarEvents_Actions_Constants_Common.CategoryId.ImageAndSoundExpr         : return `${getText(Lang_Constants.TextType.B1343)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.CategoryId.MiscSimple                : return getText(Lang_Constants.TextType.B1279);
        case WarEvents_Actions_Constants_Common.CategoryId.MiscExpr                  : return `${getText(Lang_Constants.TextType.B1279)} (${getText(Lang_Constants.TextType.B0129)})`;
        default                                         : return null;
    }
}

export function getWarEventActionTypeName(type: WarEvents_Actions_Constants_Common.ActionTypeId): string | null {
    switch (type) {
        case WarEvents_Actions_Constants_Common.ActionTypeId.AddUnitOnMapSimple                          : return getText(Lang_Constants.TextType.B0617);
        case WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitOnMapExpr                           : return getText(Lang_Constants.TextType.B1190);
        case WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitOnMapSimple                         : return getText(Lang_Constants.TextType.B1059);
        case WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitLoadedSimple                        : return getText(Lang_Constants.TextType.B1191);
        case WarEvents_Actions_Constants_Common.ActionTypeId.FillUnitLoadedExpr                          : return `${getText(Lang_Constants.TextType.B1191)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.DestroyUnitSimple                           : return getText(Lang_Constants.TextType.B1374);
        case WarEvents_Actions_Constants_Common.ActionTypeId.DestroyUnitExpr                             : return `${getText(Lang_Constants.TextType.B1374)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitTypeSimple                           : return getText(Lang_Constants.TextType.B1192);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitTypeExpr                             : return `${getText(Lang_Constants.TextType.B1192)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitOwnershipSimple                      : return getText(Lang_Constants.TextType.B1193);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitOwnershipExpr                        : return `${getText(Lang_Constants.TextType.B1193)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitPositionSimple                       : return getText(Lang_Constants.TextType.B1198);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitPositionExpr                         : return `${getText(Lang_Constants.TextType.B1198)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitStateSimple                          : return getText(Lang_Constants.TextType.B0806);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitStateExpr                            : return `${getText(Lang_Constants.TextType.B0806)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.AddUnitBuffSimple                           : return getText(Lang_Constants.TextType.B1466);
        case WarEvents_Actions_Constants_Common.ActionTypeId.ModifyUnitBuffSimple                        : return getText(Lang_Constants.TextType.B1467);
        case WarEvents_Actions_Constants_Common.ActionTypeId.DeleteUnitBuffSimple                        : return getText(Lang_Constants.TextType.B1469);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetTileTypeExpr                             : return `${getText(Lang_Constants.TextType.B0825)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetTileTypeSimple                           : return getText(Lang_Constants.TextType.B0825);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetTileStateExpr                            : return `${getText(Lang_Constants.TextType.B0861)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetTileStateSimple                          : return getText(Lang_Constants.TextType.B0861);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomBuildingStateExpr                  : return `${getText(Lang_Constants.TextType.B1211)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomBuildingStateSimple                : return getText(Lang_Constants.TextType.B1211);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCrystalStateExpr                   : return `${getText(Lang_Constants.TextType.B1208)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCrystalStateSimple                 : return getText(Lang_Constants.TextType.B1208);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCannonStateExpr                    : return `${getText(Lang_Constants.TextType.B1209)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCannonStateSimple                  : return getText(Lang_Constants.TextType.B1209);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomLaserTurretStateExpr               : return `${getText(Lang_Constants.TextType.B1210)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomLaserTurretStateSimple             : return getText(Lang_Constants.TextType.B1210);
        case WarEvents_Actions_Constants_Common.ActionTypeId.DeleteTileBuffExpr                          : return `${getText(Lang_Constants.TextType.B1234)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.DeleteTileBuffSimple                        : return getText(Lang_Constants.TextType.B1234);
        case WarEvents_Actions_Constants_Common.ActionTypeId.AddTileBuffExpr                             : return `${getText(Lang_Constants.TextType.B1238)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.AddTileBuffSimple                           : return getText(Lang_Constants.TextType.B1238);
        case WarEvents_Actions_Constants_Common.ActionTypeId.ModifyTileBuffExpr                          : return `${getText(Lang_Constants.TextType.B1239)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.ModifyTileBuffSimple                        : return getText(Lang_Constants.TextType.B1239);
        case WarEvents_Actions_Constants_Common.ActionTypeId.BigDialogueSimple                           : return getText(Lang_Constants.TextType.B0674);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetViewpointExpr                            : return `${getText(Lang_Constants.TextType.B0713)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetViewpointSimple                          : return getText(Lang_Constants.TextType.B0713);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetWeatherExpr                              : return `${getText(Lang_Constants.TextType.B0715)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetWeatherSimple                            : return getText(Lang_Constants.TextType.B0715);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetForceFogCodeExpr                         : return `${getText(Lang_Constants.TextType.B0795)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetForceFogCodeSimple                       : return getText(Lang_Constants.TextType.B0795);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetCustomCounters                           : return getText(Lang_Constants.TextType.B0800);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SmallDialogueSimple                         : return getText(Lang_Constants.TextType.B0728);
        case WarEvents_Actions_Constants_Common.ActionTypeId.PlayBgm                                     : return getText(Lang_Constants.TextType.B0750);
        case WarEvents_Actions_Constants_Common.ActionTypeId.PlaySfx                                     : return getText(Lang_Constants.TextType.B1164);
        case WarEvents_Actions_Constants_Common.ActionTypeId.StopPersistentAction                        : return getText(Lang_Constants.TextType.B0887);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetPlayerStateExpr                          : return `${getText(Lang_Constants.TextType.B0810)} (${getText(Lang_Constants.TextType.B0129)})`;
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetPlayerStateSimple                        : return getText(Lang_Constants.TextType.B0810);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetTaskObjectiveState                       : return getText(Lang_Constants.TextType.B1224);
        case WarEvents_Actions_Constants_Common.ActionTypeId.SetUnitMovePathVisibility                   : return getText(Lang_Constants.TextType.B1340);
        case WarEvents_Actions_Constants_Common.ActionTypeId.PersistentShowText                          : return getText(Lang_Constants.TextType.B0888);
        case WarEvents_Actions_Constants_Common.ActionTypeId.PersistentPlayBgm                           : return getText(Lang_Constants.TextType.B1083);
        case WarEvents_Actions_Constants_Common.ActionTypeId.PersistentModifyPlayerAttribute             : return getText(Lang_Constants.TextType.B0903);
        case WarEvents_Actions_Constants_Common.ActionTypeId.PersistentModifyUnitAttribute               : return getText(Lang_Constants.TextType.B1080);
        default                                                             : return null;
    }
}

export function getWarEventConditionNodeDesc(isNeedAnd: AuxiliaryTypes_AuxiliaryTypes.Undefinable<boolean>, isNeedFalse: AuxiliaryTypes_AuxiliaryTypes.Undefinable<boolean>): string {
    if (isNeedFalse) {
        return getText(isNeedAnd ? Lang_Constants.TextType.A0436 : Lang_Constants.TextType.A0091);
    } else {
        return getText(isNeedAnd ? Lang_Constants.TextType.A0162 : Lang_Constants.TextType.A0163);
    }
}

export function getPlayerRuleName(type: PlayerRules_Constants.RuleTypeId): string | null {
    switch (type) {
        case PlayerRules_Constants.RuleTypeId.TeamIndex                       : return getText(Lang_Constants.TextType.B0019);
        case PlayerRules_Constants.RuleTypeId.BannedCoCategoryIdArray         : return getText(Lang_Constants.TextType.B0403);
        case PlayerRules_Constants.RuleTypeId.BannedUnitTypeArray             : return getText(Lang_Constants.TextType.B0895);
        case PlayerRules_Constants.RuleTypeId.CanActivateCoSkill              : return getText(Lang_Constants.TextType.B0897);
        case PlayerRules_Constants.RuleTypeId.CanCoBoard                      : return getText(Lang_Constants.TextType.B1427);
        case PlayerRules_Constants.RuleTypeId.CanUnitJoin                     : return getText(Lang_Constants.TextType.B1428);
        case PlayerRules_Constants.RuleTypeId.InitialFund                     : return getText(Lang_Constants.TextType.B0178);
        case PlayerRules_Constants.RuleTypeId.IncomeMultiplier                : return getText(Lang_Constants.TextType.B0179);
        case PlayerRules_Constants.RuleTypeId.MaxUnitsCount                   : return getText(Lang_Constants.TextType.B1473);
        case PlayerRules_Constants.RuleTypeId.EnergyAddPctOnCoBoard           : return getText(Lang_Constants.TextType.B0180);
        case PlayerRules_Constants.RuleTypeId.EnergyLossPctOnCoDie            : return getText(Lang_Constants.TextType.B0127);
        case PlayerRules_Constants.RuleTypeId.EnergyGrowthMultiplier          : return getText(Lang_Constants.TextType.B0181);
        case PlayerRules_Constants.RuleTypeId.MoveRangeModifier               : return getText(Lang_Constants.TextType.B0182);
        case PlayerRules_Constants.RuleTypeId.AttackPowerModifier             : return getText(Lang_Constants.TextType.B0183);
        case PlayerRules_Constants.RuleTypeId.DefenseModifier                 : return getText(Lang_Constants.TextType.DefBonus$);
        case PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier         : return getText(Lang_Constants.TextType.B0184);
        case PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier         : return getText(Lang_Constants.TextType.B1331);
        case PlayerRules_Constants.RuleTypeId.LuckLowerLimit                  : return getText(Lang_Constants.TextType.B0189);
        case PlayerRules_Constants.RuleTypeId.LuckUpperLimit                  : return getText(Lang_Constants.TextType.B0190);
        case PlayerRules_Constants.RuleTypeId.McwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.B1303);
        case PlayerRules_Constants.RuleTypeId.MmwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.B1304);
        case PlayerRules_Constants.RuleTypeId.MrwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.B1305);
        case PlayerRules_Constants.RuleTypeId.AtwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.B1306);
        case PlayerRules_Constants.RuleTypeId.CcwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.B1302);
        case PlayerRules_Constants.RuleTypeId.CcwAiCoId                       : return getText(Lang_Constants.TextType.B1263);
        case PlayerRules_Constants.RuleTypeId.WarRoomAiCoId                   : return getText(Lang_Constants.TextType.B1264);
        case PlayerRules_Constants.RuleTypeId.WarRoomHumanCoCategoryIdArray   : return getText(Lang_Constants.TextType.B1265);
        case PlayerRules_Constants.RuleTypeId.CampaignAiCoId                  : return getText(Lang_Constants.TextType.B0642);
        case PlayerRules_Constants.RuleTypeId.CampaignHumanCoIdArray          : return getText(Lang_Constants.TextType.B0096);
        case PlayerRules_Constants.RuleTypeId.CampaignSkinId                  : return getText(Lang_Constants.TextType.B1266);
        default                                             : return null;
    }
}
export function getPlayerRuleHelpText(ruleType: PlayerRules_Constants.RuleTypeId): string | null {
    switch (ruleType) {
        case PlayerRules_Constants.RuleTypeId.TeamIndex                       : return null;
        case PlayerRules_Constants.RuleTypeId.BannedCoCategoryIdArray         : return null;
        case PlayerRules_Constants.RuleTypeId.BannedUnitTypeArray             : return getText(Lang_Constants.TextType.A0805);
        case PlayerRules_Constants.RuleTypeId.CanActivateCoSkill              : return null;
        case PlayerRules_Constants.RuleTypeId.CanCoBoard                      : return null;
        case PlayerRules_Constants.RuleTypeId.CanUnitJoin                     : return null;
        case PlayerRules_Constants.RuleTypeId.InitialFund                     : return null;
        case PlayerRules_Constants.RuleTypeId.IncomeMultiplier                : return null;
        case PlayerRules_Constants.RuleTypeId.MaxUnitsCount                   : return getText(Lang_Constants.TextType.A0981);
        case PlayerRules_Constants.RuleTypeId.EnergyAddPctOnCoBoard           : return null;
        case PlayerRules_Constants.RuleTypeId.EnergyLossPctOnCoDie            : return null;
        case PlayerRules_Constants.RuleTypeId.EnergyGrowthMultiplier          : return null;
        case PlayerRules_Constants.RuleTypeId.MoveRangeModifier               : return null;
        case PlayerRules_Constants.RuleTypeId.AttackPowerModifier             : return null;
        case PlayerRules_Constants.RuleTypeId.DefenseModifier                 : return null;
        case PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier         : return null;
        case PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier         : return null;
        case PlayerRules_Constants.RuleTypeId.LuckLowerLimit                  : return null;
        case PlayerRules_Constants.RuleTypeId.LuckUpperLimit                  : return null;
        case PlayerRules_Constants.RuleTypeId.McwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.A0828);
        case PlayerRules_Constants.RuleTypeId.MmwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.A0828);
        case PlayerRules_Constants.RuleTypeId.MrwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.A0828);
        case PlayerRules_Constants.RuleTypeId.AtwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.A0828);
        case PlayerRules_Constants.RuleTypeId.CcwHumanCoCategoryIdArray       : return getText(Lang_Constants.TextType.A0828);
        case PlayerRules_Constants.RuleTypeId.CcwAiCoId                       : return getText(Lang_Constants.TextType.A0806);
        case PlayerRules_Constants.RuleTypeId.WarRoomAiCoId                   : return getText(Lang_Constants.TextType.A0807);
        case PlayerRules_Constants.RuleTypeId.WarRoomHumanCoCategoryIdArray   : return getText(Lang_Constants.TextType.A0809);
        case PlayerRules_Constants.RuleTypeId.CampaignAiCoId                  : return getText(Lang_Constants.TextType.A0810);
        case PlayerRules_Constants.RuleTypeId.CampaignHumanCoIdArray          : return getText(Lang_Constants.TextType.A0811);
        case PlayerRules_Constants.RuleTypeId.CampaignSkinId                  : return getText(Lang_Constants.TextType.A0812);
        default                                             : return null;
    }
}

export function getForceFogCodeName(code: FogMaps_Constants.ForcedFogCode): string | null {
    switch (code) {
        case FogMaps_Constants.ForcedFogCode.Fog       : return getText(Lang_Constants.TextType.B0796);
        case FogMaps_Constants.ForcedFogCode.Clear     : return getText(Lang_Constants.TextType.B0797);
        case FogMaps_Constants.ForcedFogCode.None      : return getText(Lang_Constants.TextType.B0798);
        default                     : return null;
    }
}

export function getAutoTourneyPhaseName(phase: number): string | null {
    switch (phase) {
        case AutoTourneys_Constants.PhaseId.Registration    : return getText(Lang_Constants.TextType.B1039);
        case AutoTourneys_Constants.PhaseId.Adjustment      : return getText(Lang_Constants.TextType.B1040);
        case AutoTourneys_Constants.PhaseId.Battle          : return getText(Lang_Constants.TextType.B1041);
        case AutoTourneys_Constants.PhaseId.End             : return getText(Lang_Constants.TextType.B1002);
        default                                 : return null;
    }
}

export function getMedalDesc(medalId: number): string | null {
    const typeParams = Medals_Utils.getMedalCfg(medalId)?.typeParams;
    if (typeParams == null) {
        return null;
    }

    const medalType = typeParams[0];
    if (medalType === Medals_Constants.MedalTypeId.TournamentPrize) {
        return getFormattedText(Lang_Constants.TextType.F0162, typeParams[1]);
    } else {
        return null;
    }
}

export function getGameVersionName(type: GameVersions_Constants.TypeName): string | null {
    switch (type) {
        case GameVersions_Constants.TypeName.Legacy     : return getText(Lang_Constants.TextType.B0385);
        case GameVersions_Constants.TypeName.Test       : return getText(Lang_Constants.TextType.B0622);
        case GameVersions_Constants.TypeName.Dor        : return getText(Lang_Constants.TextType.B1131);
        case GameVersions_Constants.TypeName.Trilogy    : return getText(Lang_Constants.TextType.B1348);
        case GameVersions_Constants.TypeName.TinyWars2  : return getText(Lang_Constants.TextType.B1308);
        case GameVersions_Constants.TypeName.Awbw       : return getText(Lang_Constants.TextType.B0649);
        default                         : return null;
    }
}
export function getGameVersionDesc(type: GameVersions_Constants.TypeName): string | null {
    switch (type) {
        case GameVersions_Constants.TypeName.Legacy     : return getText(Lang_Constants.TextType.A0217);
        case GameVersions_Constants.TypeName.Test       : return getText(Lang_Constants.TextType.A0218);
        case GameVersions_Constants.TypeName.Dor        : return getText(Lang_Constants.TextType.A0438);
        case GameVersions_Constants.TypeName.Trilogy    : return getText(Lang_Constants.TextType.A0886);
        case GameVersions_Constants.TypeName.TinyWars2  : return getText(Lang_Constants.TextType.A0843);
        case GameVersions_Constants.TypeName.Awbw       : return getText(Lang_Constants.TextType.A0224);
        default                         : return null;
    }
}

export function getMapSortTypeName(type: Maps_Constants.SortType): string | null {
    switch (type) {
        case Maps_Constants.SortType.MapName                    : return getText(Lang_Constants.TextType.B0225);
        case Maps_Constants.SortType.NormalMapId                : return getText(Lang_Constants.TextType.B0821);
        case Maps_Constants.SortType.DesignerName               : return getText(Lang_Constants.TextType.B0163);
        case Maps_Constants.SortType.Popularity                 : return getText(Lang_Constants.TextType.B0565);
        case Maps_Constants.SortType.GlobalRating               : return getText(Lang_Constants.TextType.B0364);
        case Maps_Constants.SortType.MyRating                   : return getText(Lang_Constants.TextType.B0363);
        case Maps_Constants.SortType.PlayersCountUnneutral      : return getText(Lang_Constants.TextType.B0229);
        case Maps_Constants.SortType.GridsCount                 : return getText(Lang_Constants.TextType.B1105);
        default                                     : return null;
    }
}

export function getGameModeName(gameMode: GameModes_Constants.ModeId): string | null {
    switch (gameMode) {
        case GameModes_Constants.ModeId.Coop              : return getText(Lang_Constants.TextType.B0646);
        case GameModes_Constants.ModeId.Free              : return getText(Lang_Constants.TextType.B0557);
        case GameModes_Constants.ModeId.Versus            : return getText(Lang_Constants.TextType.B1011);
        case GameModes_Constants.ModeId.RankedMatch       : return getText(Lang_Constants.TextType.B0404);
        case GameModes_Constants.ModeId.UnrankedMatch     : return getText(Lang_Constants.TextType.B1012);
        case GameModes_Constants.ModeId.SingleCustom      : return getText(Lang_Constants.TextType.B1262);
        case GameModes_Constants.ModeId.WarRoom           : return getText(Lang_Constants.TextType.B0614);
        case GameModes_Constants.ModeId.AutoTourney    : return getText(Lang_Constants.TextType.B1022);
        default                             : return null;
    }
}
export function getGameModeHelpText(gameMode: GameModes_Constants.ModeId): string | null {
    switch (gameMode) {
        case GameModes_Constants.ModeId.Coop              : return getText(Lang_Constants.TextType.R0008);
        case GameModes_Constants.ModeId.Free              : return getText(Lang_Constants.TextType.R0007);
        case GameModes_Constants.ModeId.Versus            : return getText(Lang_Constants.TextType.A0797);
        case GameModes_Constants.ModeId.RankedMatch       : return getText(Lang_Constants.TextType.A0798);
        case GameModes_Constants.ModeId.UnrankedMatch     : return getText(Lang_Constants.TextType.R0017);
        case GameModes_Constants.ModeId.SingleCustom      : return getText(Lang_Constants.TextType.A0799);
        case GameModes_Constants.ModeId.WarRoom           : return getText(Lang_Constants.TextType.A0800);
        case GameModes_Constants.ModeId.AutoTourney    : return getText(Lang_Constants.TextType.R0018);
        default                             : return null;
    }
}

export function getExpressionParserContextName(type: ExpressionParsers_Enums.ContextType): string | null {
    switch (type) {
        case ExpressionParsers_Enums.ContextType.CustomCounter       : return getText(Lang_Constants.TextType.B1143);
        case ExpressionParsers_Enums.ContextType.War                 : return getText(Lang_Constants.TextType.B0719);
        case ExpressionParsers_Enums.ContextType.Tile                : return getText(Lang_Constants.TextType.B1144);
        case ExpressionParsers_Enums.ContextType.TileArray           : return getText(Lang_Constants.TextType.B1156);
        case ExpressionParsers_Enums.ContextType.Unit                : return getText(Lang_Constants.TextType.B1058);
        case ExpressionParsers_Enums.ContextType.UnitArray           : return getText(Lang_Constants.TextType.B1157);
        case ExpressionParsers_Enums.ContextType.Position            : return getText(Lang_Constants.TextType.B1181);
        case ExpressionParsers_Enums.ContextType.PositionArray       : return getText(Lang_Constants.TextType.B1182);
        case ExpressionParsers_Enums.ContextType.UnitStatistic       : return getText(Lang_Constants.TextType.B1166);
        case ExpressionParsers_Enums.ContextType.UnitStatisticArray  : return getText(Lang_Constants.TextType.B1167);
        case ExpressionParsers_Enums.ContextType.Player              : return getText(Lang_Constants.TextType.B0031);
        case ExpressionParsers_Enums.ContextType.PlayerArray         : return getText(Lang_Constants.TextType.B1158);
        case ExpressionParsers_Enums.ContextType.Number              : return getText(Lang_Constants.TextType.B0133);
        case ExpressionParsers_Enums.ContextType.NumberArray         : return getText(Lang_Constants.TextType.B1159);
        case ExpressionParsers_Enums.ContextType.Turn                : return getText(Lang_Constants.TextType.B0191);
        case ExpressionParsers_Enums.ContextType.Weather             : return getText(Lang_Constants.TextType.Weather);
        case ExpressionParsers_Enums.ContextType.TaskObjective       : return getText(Lang_Constants.TextType.B1214);
        case ExpressionParsers_Enums.ContextType.TileBuff            : return getText(Lang_Constants.TextType.B1232);
        case ExpressionParsers_Enums.ContextType.TileBuffArray       : return getText(Lang_Constants.TextType.B1233);
        case ExpressionParsers_Enums.ContextType.WarOperation        : return getText(Lang_Constants.TextType.B1212);
        case ExpressionParsers_Enums.ContextType.Fog                 : return getText(Lang_Constants.TextType.B1145);
        default                                                 : return null;
    }
}
export function getExpressionParserResultTypeName(type: ExpressionParsers_Enums.ResultType): string | null {
    switch (type) {
        case ExpressionParsers_Enums.ResultType.War                  : return getText(Lang_Constants.TextType.B0719);
        case ExpressionParsers_Enums.ResultType.Tile                 : return getText(Lang_Constants.TextType.B1144);
        case ExpressionParsers_Enums.ResultType.TileArray            : return getText(Lang_Constants.TextType.B1156);
        case ExpressionParsers_Enums.ResultType.TileBuff             : return getText(Lang_Constants.TextType.B1232);
        case ExpressionParsers_Enums.ResultType.TileBuffArray        : return getText(Lang_Constants.TextType.B1233);
        case ExpressionParsers_Enums.ResultType.Unit                 : return getText(Lang_Constants.TextType.B1058);
        case ExpressionParsers_Enums.ResultType.UnitArray            : return getText(Lang_Constants.TextType.B1157);
        case ExpressionParsers_Enums.ResultType.Position             : return getText(Lang_Constants.TextType.B1181);
        case ExpressionParsers_Enums.ResultType.PositionArray        : return getText(Lang_Constants.TextType.B1182);
        case ExpressionParsers_Enums.ResultType.UnitStatistic        : return getText(Lang_Constants.TextType.B1166);
        case ExpressionParsers_Enums.ResultType.UnitStatisticArray   : return getText(Lang_Constants.TextType.B1167);
        case ExpressionParsers_Enums.ResultType.Player               : return getText(Lang_Constants.TextType.B0031);
        case ExpressionParsers_Enums.ResultType.PlayerArray          : return getText(Lang_Constants.TextType.B1158);
        case ExpressionParsers_Enums.ResultType.Number               : return getText(Lang_Constants.TextType.B0133);
        case ExpressionParsers_Enums.ResultType.NumberArray          : return getText(Lang_Constants.TextType.B1159);
        case ExpressionParsers_Enums.ResultType.Turn                 : return getText(Lang_Constants.TextType.B0191);
        case ExpressionParsers_Enums.ResultType.Weather              : return getText(Lang_Constants.TextType.Weather);
        case ExpressionParsers_Enums.ResultType.WarOperation         : return getText(Lang_Constants.TextType.B1212);
        case ExpressionParsers_Enums.ResultType.Fog                  : return getText(Lang_Constants.TextType.B1145);
        case ExpressionParsers_Enums.ResultType.Lambda               : return getText(Lang_Constants.TextType.B1169);
        case ExpressionParsers_Enums.ResultType.Unknown              : return getText(Lang_Constants.TextType.B0672);
        default                                                 : return null;
    }
}

export function getBuffEndTimeModificationModeName(mode: WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode): string | null {
    switch (mode) {
        case WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange                    : return getText(Lang_Constants.TextType.B1463);
        case WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete                         : return getText(Lang_Constants.TextType.B1455);
        case WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetAbsoluteValue               : return getText(Lang_Constants.TextType.B1464);
        case WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.AddOffset                      : return `${getText(Lang_Constants.TextType.B1017)} 1`;
        case WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime  : return `${getText(Lang_Constants.TextType.B1017)} 2`;
        default                                                         : return null;
    }
}

export function getLanguageText({ textArray, languageType = getCurrentLanguageType(), useAlternate = true }: {
    textArray       : AuxiliaryTypes_AuxiliaryTypes.Undefinable<LanguageText[]>;
    languageType?   : Lang_Constants.LanguageType;
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
export function concatLanguageTextList(textList: AuxiliaryTypes_AuxiliaryTypes.Undefinable<LanguageText[]>): string {
    const strList: string[] = [];
    for (const data of textList || []) {
        strList.push(data.getText() || `??`);
    }
    return strList.join(`, `);
}
export function getJoinedShortLanguageText(textArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<LanguageText[]>, limit?: number): string {
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
        return `0${getText(Lang_Constants.TextType.B0017)}`;
    } else {
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours   = Math.floor(totalSeconds / (60 * 60)) % 24;
        const days    = Math.floor(totalSeconds / (60 * 60 * 24));

        const textArray: string[] = [];
        if (days    > 0) {
            textArray.push(`${days}${getText(Lang_Constants.TextType.B0014)}`);
        }
        if (hours   > 0) {
            textArray.push(`${hours}${getText(Lang_Constants.TextType.B0015)}`);
        }
        if (minutes > 0) {
            textArray.push(`${minutes}${getText(Lang_Constants.TextType.B0016)}`);
        }
        if (seconds > 0) {
            textArray.push(`${seconds}${getText(Lang_Constants.TextType.B0017)}`);
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
        return `${Helpers_Text.getNumText(hours)}:${Helpers_Text.getNumText(minutes)}:${Helpers_Text.getNumText(seconds)}`;
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
    const strYear    = (!controller) || (controller.year !== false)  ? `${Helpers_Text.getNumText(d.getFullYear(), 4)}${getText(Lang_Constants.TextType.B0059)}`     : ``;
    const strMonth   = (!controller) || (controller.month !== false) ? `${Helpers_Text.getNumText(d.getMonth() + 1)}${getText(Lang_Constants.TextType.B0058)}`    : ``;
    const strDate    = (!controller) || (controller.date !== false)  ? `${Helpers_Text.getNumText(d.getDate())}${getText(Lang_Constants.TextType.B0057)}`         : ``;
    const strHour    = needHour                 ? `${Helpers_Text.getNumText(d.getHours())}`   : "";
    const sep1       = needHour   && needMinute ? ":" : "";
    const strMinute  = needMinute               ? `${Helpers_Text.getNumText(d.getMinutes())}` : "";
    const sep2       = needMinute && needSecond ? ":" : "";
    const strSecond  = needSecond               ? `${Helpers_Text.getNumText(d.getSeconds())}` : "";
    return strYear + strMonth + strDate + strHour + sep1 + strMinute + sep2 + strSecond;
}
export function getTimestampShortText(timestamp: number, controller?: TimeTextController): string {
    const d = new Date(timestamp * 1000);
    const needHour   = (!controller) || (controller.hour !== false);
    const needMinute = (!controller) || (controller.minute !== false);
    const needSecond = (!controller) || (controller.second !== false);
    const strYear    = (!controller) || (controller.year !== false)  ? `${Helpers_Text.getNumText(d.getFullYear(), 4)}/`     : ``;
    const strMonth   = (!controller) || (controller.month !== false) ? `${Helpers_Text.getNumText(d.getMonth() + 1)}/`    : ``;
    const strDate    = (!controller) || (controller.date !== false)  ? `${Helpers_Text.getNumText(d.getDate())} `         : ``;
    const strHour    = needHour                 ? `${Helpers_Text.getNumText(d.getHours())}`   : "";
    const sep1       = needHour   && needMinute ? ":" : "";
    const strMinute  = needMinute               ? `${Helpers_Text.getNumText(d.getMinutes())}` : "";
    const sep2       = needMinute && needSecond ? ":" : "";
    const strSecond  = needSecond               ? `${Helpers_Text.getNumText(d.getSeconds())}` : "";
    return strYear + strMonth + strDate + strHour + sep1 + strMinute + sep2 + strSecond;
}

export function getBootTimerTypeName(type: BootTimers_Constants.TimerTypeId): string | null {
    switch (type) {
        case BootTimers_Constants.TimerTypeId.Regular    : return getText(Lang_Constants.TextType.B0387);
        case BootTimers_Constants.TimerTypeId.Incremental: return getText(Lang_Constants.TextType.B0388);
        default                             : return null;
    }
}
export function getBootTimerDesc(params: number[]): string | null {
    params          = params || [];
    const timerType = params[0] as BootTimers_Constants.TimerTypeId;
    if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        return `${getText(Lang_Constants.TextType.B0387)} ${getTimeDurationText2(params[1])}`;
    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        return `${getText(Lang_Constants.TextType.B0388)} ${getTimeDurationText2(params[1])} + ${getTimeDurationText2(params[2])}`;
    } else {
        return null;
    }
}

export function getComparatorName(comparator: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): string | null {
    switch (comparator) {
        case ValueAndComparators_Constants.ComparatorId.EqualTo          : return getText(Lang_Constants.TextType.B0767);
        case ValueAndComparators_Constants.ComparatorId.NotEqualTo       : return getText(Lang_Constants.TextType.B0768);
        case ValueAndComparators_Constants.ComparatorId.GreaterThan      : return getText(Lang_Constants.TextType.B0769);
        case ValueAndComparators_Constants.ComparatorId.NotGreaterThan   : return getText(Lang_Constants.TextType.B0770);
        case ValueAndComparators_Constants.ComparatorId.LessThan         : return getText(Lang_Constants.TextType.B0771);
        case ValueAndComparators_Constants.ComparatorId.NotLessThan      : return getText(Lang_Constants.TextType.B0772);
        default                                 : return null;
    }
}
export function getSetRelationName(relation: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): string {
    switch (relation) {
        case ValueSetAndRelations_Constants.SetRelationId.EqualTo          : return getText(Lang_Constants.TextType.B1409);
        case ValueSetAndRelations_Constants.SetRelationId.NotEqualTo       : return getText(Lang_Constants.TextType.B1410);
        case ValueSetAndRelations_Constants.SetRelationId.SupersetOf       : return getText(Lang_Constants.TextType.B1411);
        case ValueSetAndRelations_Constants.SetRelationId.NotSupersetOf    : return getText(Lang_Constants.TextType.B1412);
        case ValueSetAndRelations_Constants.SetRelationId.SubsetOf         : return getText(Lang_Constants.TextType.B1413);
        case ValueSetAndRelations_Constants.SetRelationId.NotSubsetOf      : return getText(Lang_Constants.TextType.B1414);
        case ValueSetAndRelations_Constants.SetRelationId.Intersection     : return getText(Lang_Constants.TextType.B1415);
        case ValueSetAndRelations_Constants.SetRelationId.NoIntersection   : return getText(Lang_Constants.TextType.B1416);
        default                             : return Lang_Constants.UndefinedError;
    }
}
