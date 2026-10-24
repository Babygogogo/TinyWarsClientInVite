import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersConstants from "../../../numbers/Constants.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureUnitBuff from "../../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaDeleteUnitBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteUnitBuffSimple.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitBuffsUtilsFilter from "../../../unitBuffs/utils/Filter.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";

type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type PlayerFilter               = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type UnitBuff                   = ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff;
type WeaDeleteUnitBuffSimple    = ProtoSchemaCommonProtoWarEventWeaDeleteUnitBuffSimple.WeaDeleteUnitBuffSimple;
type IPlayer                    = PlayersIPlayer.IPlayer;

export function checkIsValid(
    data                    : Undefinable<WeaDeleteUnitBuffSimple>,
    mapSize                 : AuxiliaryTypesMapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigGcData.GcData
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gcData) == null);
}

export function getBriefDesc(data: Undefinable<WeaDeleteUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0262,
        LangUtils.getText(LangConstants.TextType.B1468),
    );
}
export function getDetailDesc(data: Undefinable<WeaDeleteUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConUnitBuffFilter();
            if (filter != null) {
                conTextArray.push(`- ${UnitBuffsUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConUnitFilter();
            if (filter != null) {
                conTextArray.push(`- ${UnitsUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1423)}) ${TilesUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1422)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
            }
        }

        if (!conTextArray.length) {
            conTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
        }
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0263,
        LangUtils.getText(LangConstants.TextType.B1468),
        conTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaDeleteUnitBuffSimple,
    mapSize                 : AuxiliaryTypesMapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigGcData.GcData
): string | null {
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                            &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gcData))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConUnitFilter();
        if ((filter != null) &&
            (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gcData))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                    &&
            (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gcData))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }
    {
        const filter = data.getConUnitBuffFilter();
        if ((filter != null)                                &&
            (!UnitBuffsUtilsFilter.checkIsValid(filter))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1235));
        }
    }
    {
        const con = data.getConMaxDeleteCount();
        if ((con != null) && (con <= 0)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1457));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaDeleteUnitBuffSimple): Promise<void> {
    // nothing to do
}

export async function applyWithoutExtraData(action: WeaDeleteUnitBuffSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetUnitDict = new Map<UnitsIUnit.IUnit, UnitBuff[]>();
    {
        const tileMap               = war.getTileMap();
        const conTileFilter         = action.getConTileFilter();
        const conUnitFilter         = action.getConUnitFilter();
        const conPlayerFilter       = action.getConPlayerFilter();
        const conUnitBuffFilter     = action.getConUnitBuffFilter();
        const conMaxDeleteCount     = action.getConMaxDeleteCount() ?? NumbersConstants.MaxInt32;
        const playerFilterDict      = new Map<IPlayer, boolean>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((conUnitFilter != null) &&
                (!UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit))
            ) {
                continue;
            }

            const oldBuffList = unit.getBuffList();
            if ((oldBuffList == null)       ||
                (oldBuffList.length <= 0)
            ) {
                continue;
            }

            if ((conTileFilter != null)                                                                 &&
                (!TilesUtilsFilter.checkIsMeet(conTileFilter, tileMap.getTile(unit.getGridIndex())))
            ) {
                continue;
            }

            if ((conPlayerFilter != null)                                                           &&
                (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))
            ) {
                continue;
            }

            const newBuffList   : UnitBuff[] = [];
            let modifiedCount   = 0;
            for (const oldBuff of oldBuffList) {
                if (modifiedCount >= conMaxDeleteCount) {
                    newBuffList.push(oldBuff);
                    continue;
                }

                if ((conUnitBuffFilter != null)                                             &&
                    (!UnitBuffsUtilsFilter.checkIsMeet(conUnitBuffFilter, oldBuff, war))
                ) {
                    newBuffList.push(oldBuff);
                } else {
                    ++modifiedCount;
                }
            }

            if (modifiedCount > 0) {
                targetUnitDict.set(unit, newBuffList);
            }
        }

        if (targetUnitDict.size <= 0) {
            return;
        }
    }

    {
        for (const [targetUnit, newBuffList] of targetUnitDict) {
            targetUnit.setBuffList(newBuffList);

            if (!isFastExecute) {
                targetUnit.updateView();
            }
        }
    }
}

function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
