import { Base } from "./Base.ts";
import { War } from "./War.ts";
import {
    ResultType,
    ContextType,
} from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { NullableUnit } from "../results/NullableUnit.ts";
import { Num } from "../results/Num.ts";
import { NumArray } from "../results/NumArray.ts";
import { Player } from "../results/Player.ts";
import { Position } from "../results/Position.ts";
import { Tile } from "../results/Tile.ts";
import { War as ResultsWar } from "../results/War.ts";
import type {
    EpVariableInfoDict,
    EpFunctionInfoDict,
} from "../Types.ts";
import {
    extendVariableInfoDict,
    extendFunctionInfoDict,
    getErrorTextForParameterCount,
    getErrorTextForParameterType,
} from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    MaxId,
    MinId,
} from "../../locations/Constants.ts";
import {
    encode,
    checkHasAnyOverlap,
} from "../../locations/Utils.ts";
import { TagId } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class Unit extends Base {
    private static readonly VnX                     = "x";
    private static readonly VnY                     = "y";
    private static readonly VnPos                   = "pos";
    private static readonly VnPlayerIndex           = "playerIndex";
    private static readonly VnTeamIndex             = "teamIndex";
    private static readonly VnType                  = "type";
    private static readonly VnId                    = "id";
    private static readonly VnCustomNameId          = "customNameId";
    private static readonly VnLoader                = "loader";
    private static readonly VnLoaderId              = "loaderId";
    private static readonly VnActionState           = "actionState";
    private static readonly VnCoOnboard             = "coOnboard";
    private static readonly VnCapturing             = "capturing";
    private static readonly VnBuilding              = "building";
    private static readonly VnDived                 = "dived";
    private static readonly VnTags                  = "tags";
    private static readonly VnAiMode                = "aiMode";
    private static readonly VnMoveType              = "moveType";
    private static readonly VnInCoZone              = "inCoZone";
    private static readonly VnPlayer                = "player";
    private static readonly VnTile                  = "tile";
    private static readonly VnExist                 = "exist";
    private static readonly VnVisionRange           = "visionRange";
    private static readonly VnVisionRange0          = "visionRange0";
    private static readonly VnWar                   = "war";

    private static readonly FnHp                    = "hp";
    private static readonly FnFuel                  = "fuel";
    private static readonly FnMovement              = "movement";
    private static readonly FnPromotion             = "promotion";
    private static readonly FnCost                  = "cost";
    private static readonly FnPrimaryAmmo           = "primaryAmmo";
    private static readonly FnFlareAmmo             = "flareAmmo";
    private static readonly FnBuildMaterial         = "buildMaterial";
    private static readonly FnProduceMaterial       = "produceMaterial";
    private static readonly FnLoadedUnitsCount      = "loadedUnitsCount";
    private static readonly FnHasTag                = "hasTag";
    private static readonly FnHasProhibitedLocation = "hasProhibitedLocation";
    private static readonly FnInLocation            = "inLocation";
    private static readonly FnDistanceToGrid        = "distanceToGrid";
    private static readonly FnDistanceToLocation    = "distanceToLocation";
    private static readonly FnDistanceToCoUnit      = "distanceToCoUnit";

    public static readonly Variables    = Unit.generateVariables();
    public static readonly Functions    = Unit.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(Unit.VnX,                { desc: TextType.A0186, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnY,                { desc: TextType.A0200, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnPos,              { desc: TextType.A0577, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnPlayerIndex,      { desc: TextType.A0202, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnTeamIndex,        { desc: TextType.A0203, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnType,             { desc: TextType.A0204, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnId,               { desc: TextType.A0213, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnCustomNameId,     { desc: TextType.A0959, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnLoader,           { desc: TextType.A0471, resultType: ResultType.Unit,          isExtension: false });
        variables.set(Unit.VnLoaderId,         { desc: TextType.A0214, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnActionState,      { desc: TextType.A0229, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnCoOnboard,        { desc: TextType.A0234, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnCapturing,        { desc: TextType.A0236, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnBuilding,         { desc: TextType.A0255, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnDived,            { desc: TextType.A0256, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnTags,             { desc: TextType.A0709, resultType: ResultType.NumberArray,   isExtension: false });
        variables.set(Unit.VnAiMode,           { desc: TextType.A0307, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnMoveType,         { desc: TextType.A0927, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnInCoZone,         { desc: TextType.A0710, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnPlayer,           { desc: TextType.A0464, resultType: ResultType.Player,        isExtension: false });
        variables.set(Unit.VnTile,             { desc: TextType.A0462, resultType: ResultType.Tile,          isExtension: false });
        variables.set(Unit.VnExist,            { desc: TextType.A0463, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnVisionRange,      { desc: TextType.A0775, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnVisionRange0,     { desc: TextType.A0776, resultType: ResultType.Number,        isExtension: false });
        variables.set(Unit.VnWar,              { desc: TextType.A0384, resultType: ResultType.War,           isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            Unit.FnHp,
            new FunctionInfo(
                TextType.A0215,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnHp, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnHp, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_01
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnFuel,
            new FunctionInfo(
                TextType.A0216,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnFuel, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_02
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnFuel, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_03
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnMovement,
            new FunctionInfo(
                TextType.A0554,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnMovement, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_04
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnMovement, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_05
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnPromotion,
            new FunctionInfo(
                TextType.A0223,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnPromotion, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_06
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnPromotion, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_07
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnCost,
            new FunctionInfo(
                TextType.A0472,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnCost, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_08
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnCost, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_09
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnPrimaryAmmo,
            new FunctionInfo(
                TextType.A0257,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnPrimaryAmmo, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_10
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnPrimaryAmmo, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_11
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnFlareAmmo,
            new FunctionInfo(
                TextType.A0260,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnFlareAmmo, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_12
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnFlareAmmo, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_13
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnBuildMaterial,
            new FunctionInfo(
                TextType.A0261,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnBuildMaterial, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_14
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnBuildMaterial, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_15
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnProduceMaterial,
            new FunctionInfo(
                TextType.A0287,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnProduceMaterial, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_16
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnProduceMaterial, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_16
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnLoadedUnitsCount,
            new FunctionInfo(
                TextType.A0310,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnLoadedUnitsCount, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_18
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnLoadedUnitsCount, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_19
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnHasTag,
            new FunctionInfo(
                TextType.A0335,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnHasTag, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_20
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnHasTag, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_21
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnHasProhibitedLocation,
            new FunctionInfo(
                TextType.A0366,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnHasProhibitedLocation, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_22
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnHasProhibitedLocation, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_23
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnInLocation,
            new FunctionInfo(
                TextType.A0473,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnInLocation, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_24
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnInLocation, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_25
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnDistanceToGrid,
            new FunctionInfo(
                TextType.A0381,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnDistanceToGrid, 2, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_26
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(Unit.FnDistanceToGrid, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextUnit_GenerateFunctions_27
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnDistanceToLocation,
            new FunctionInfo(
                TextType.A0382,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnDistanceToLocation, 1, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_28
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Unit.FnDistanceToLocation, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_29
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnDistanceToCoUnit,
            new FunctionInfo(
                TextType.A0771,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 0) {
                        throw newError(
                            getErrorTextForParameterCount(Unit.FnDistanceToCoUnit, 0, argArray.length),
                            ClientErrorCode.EpContextUnit_GenerateFunctions_30
                        );
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _unit       : IUnit | null;
    private _contextWar : War | null = null;

    public constructor(data: NullableUnit) {
        super(data.war);

        this._unit  = data.unit;
    }

    public getContextType(): ContextType {
        return ContextType.Unit;
    }

    public override resolveVariable(identifierName: string, isRestricted: boolean): ResultsBase {
        const unit      = this._unit;
        const war       = this.getWar();
        switch (identifierName) {
            case Unit.VnX              : return new Num(war, unit ? (unit.getGridX())                       : -2);
            case Unit.VnY              : return new Num(war, unit ? (unit.getGridY())                       : -2);
            case Unit.VnPlayerIndex    : return new Num(war, unit ? (unit.getPlayerIndex())                 : -2);
            case Unit.VnTeamIndex      : return new Num(war, unit ? (unit.getTeamIndex())                   : -2);
            case Unit.VnType           : return new Num(war, unit ? (unit.getUnitType())                    : -2);
            case Unit.VnId             : return new Num(war, unit ? (unit.getUnitId())                      : -2);
            case Unit.VnCustomNameId   : return new Num(war, unit ? (unit.getCustomNameId() ?? -1)          : -2);
            case Unit.VnLoaderId       : return new Num(war, unit ? (unit.getLoaderUnitId() ?? -1)          : -2);
            case Unit.VnActionState    : return new Num(war, unit ? (unit.getActionState())                 : -2);
            case Unit.VnCoOnboard      : return new Num(war, unit ? (unit.getIsCoOnboard() ? 1 : 0)         : -2);
            case Unit.VnCapturing      : return new Num(war, unit ? (unit.checkIsCapturingTile() ? 1 : 0)   : -2);
            case Unit.VnBuilding       : return new Num(war, unit ? (unit.checkIsBuildingTile() ? 1 : 0)    : -2);
            case Unit.VnDived          : return new Num(war, unit ? (unit.getIsDiving() ? 1 : 0)            : -2);
            case Unit.VnAiMode         : return new Num(war, unit ? (unit.getAiMode())                      : -2);
            case Unit.VnMoveType       : return new Num(war, unit ? (unit.getMoveTypeId())                  : -2);
            case Unit.VnExist          : return new Num(war, unit ? 1 : 0);
            case Unit.VnVisionRange    : return this.resolveVisionRange(isRestricted);
            case Unit.VnVisionRange0   : return this.resolveVisionRange0();
            case Unit.VnWar            : return new ResultsWar(war);
            case Unit.VnTags           :
                if (unit == null) {
                    return new NumArray(war, [-2]);
                } else {
                    return new NumArray(war, unit.getTagIdArray(true));
                }
            case Unit.VnInCoZone       :
                if (isRestricted) {
                    throw newError(`Restricted.`);
                } else {
                    if (unit == null) {
                        return new Num(war, -2);
                    } else {
                        if (unit.getIsCoOnboard()) {
                            return new Num(war, 1);
                        }
                        if (unit.getLoaderUnitId() != null) {
                            return new Num(war, 0);
                        }

                        const player = unit.getPlayer();
                        return new Num(
                            war,
                            (unit.getGridIndex().getMinDistance(player.getCoGridIndexListOnMap()) <= player.getCoZoneRadius()) ? 1 : 0
                        );
                    }
                }
            case Unit.VnPos            :
                return new Position(war, unit?.getGridX() ?? -2, unit?.getGridY() ?? -2);
            case Unit.VnLoader         :
                if (unit == null) {
                    throw newError(`The unit is null.`);
                } else {
                    return new NullableUnit(war, unit.getLoaderUnit());
                }
            case Unit.VnPlayer           :
                if (unit == null) {
                    throw newError(`The unit is null.`);
                } else {
                    return new Player(unit.getPlayer());
                }
            case Unit.VnTile             :
                if (unit == null) {
                    throw newError(`The unit is null.`);
                } else {
                    return new Tile(war.getTileMap().getTile(unit.getGridIndex()));
                }
            default                             : return (this._contextWar ??= new War(war)).resolveVariable(identifierName);
        }
    }
    private resolveVisionRange(isRestricted: boolean): Num {
        if (isRestricted) {
            throw newError(`Restricted.`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        return unit
            ? new Num(war, unit.getFinalVisionRange(unit.getVisionInfo(), unit.getGridIndex()))
            : new Num(war, -2);
    }
    private resolveVisionRange0(): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        return unit
            ? new Num(war, unit.getCfgVisionRange())
            : new Num(war, -2);
    }

    public override callFunction(identifierName: string, argumentArray: ResultsBase[], rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        switch (identifierName) {
            case Unit.FnHp                     : return this.callHp(argumentArray[0]);
            case Unit.FnFuel                   : return this.callFuel(argumentArray[0]);
            case Unit.FnMovement               : return this.callMovement(argumentArray[0], isRestricted);
            case Unit.FnPromotion              : return this.callPromotion(argumentArray[0]);
            case Unit.FnCost                   : return this.callCost(argumentArray[0]);
            case Unit.FnPrimaryAmmo            : return this.callPrimaryAmmo(argumentArray[0]);
            case Unit.FnFlareAmmo              : return this.callFlareAmmo(argumentArray[0]);
            case Unit.FnBuildMaterial          : return this.callBuildMaterial(argumentArray[0]);
            case Unit.FnProduceMaterial        : return this.callProduceMaterial(argumentArray[0]);
            case Unit.FnLoadedUnitsCount       : return this.callLoadedUnitsCount(argumentArray[0]);
            case Unit.FnHasTag                 : return this.callHasTag(argumentArray[0]);
            case Unit.FnHasProhibitedLocation  : return this.callHasProhibitedLocation(argumentArray[0]);
            case Unit.FnInLocation             : return this.callInLocation(argumentArray[0]);
            case Unit.FnDistanceToGrid         : return this.callDistanceToGrid(argumentArray[0], argumentArray[1]);
            case Unit.FnDistanceToLocation     : return this.callDistanceToLocation(argumentArray[0]);
            case Unit.FnDistanceToCoUnit       : return this.callDistanceToCoUnit();
            default                                     : return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    public callHp(arg: ResultsBase): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentHp();
        const maxValue      = unit.getMaxHp();
        switch (arg.num) {
            case 1  : return new Num(war, maxValue);
            case 2  : return new Num(war, maxValue - currentValue);
            case 3  : return new Num(war, currentValue / maxValue);
            case 4  : return new Num(war, (maxValue - currentValue) / maxValue);
            case 5  : return new Num(war, unit.getNormalizedCurrentHp());
            case 6  : return new Num(war, unit.getNormalizedMaxHp());
            case 7  : return new Num(war, unit.getNormalizedMaxHp() - unit.getNormalizedCurrentHp());
            default : return new Num(war, currentValue);
        }
    }
    public callFuel(arg: ResultsBase): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentFuel();
        const maxValue      = unit.getMaxFuel();
        switch (arg.num) {
            case 1  : return new Num(war, maxValue);
            case 2  : return new Num(war, maxValue - currentValue);
            case 3  : return new Num(war, currentValue / maxValue);
            case 4  : return new Num(war, (maxValue - currentValue) / maxValue);
            default : return new Num(war, currentValue);
        }
    }
    private callMovement(arg: ResultsBase, isRestricted: boolean): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        if (arg.num === 1) {
            if (isRestricted) {
                throw newError(`Restricted.`);
            }

            return new Num(war, unit.getFinalMoveRange());
        } else {
            return new Num(war, unit.getCfgMoveRange());
        }
    }
    public callPromotion(arg: ResultsBase): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentPromotion();
        const maxValue      = unit.getMaxPromotion();
        switch (arg.num) {
            case 1  : return new Num(war, maxValue);
            case 2  : return new Num(war, maxValue - currentValue);
            case 3  : return new Num(war, currentValue / maxValue);
            case 4  : return new Num(war, (maxValue - currentValue) / maxValue);
            default : return new Num(war, currentValue);
        }
    }
    public callCost(arg: ResultsBase): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getNormalizedCurrentHp();
        const maxValue      = unit.getNormalizedMaxHp();
        const cost          = unit.getProductionCfgCost();
        const costWithCo    = unit.getIsCoOnboard() ? (cost + unit.getCoBoardCost()) : cost;
        switch (arg.num) {
            case 1  : return new Num(war, cost * currentValue / maxValue);
            case 2  : return new Num(war, cost * (maxValue - currentValue) / maxValue);
            case 3  : return new Num(war, costWithCo);
            case 4  : return new Num(war, costWithCo * currentValue / maxValue);
            case 5  : return new Num(war, costWithCo * (maxValue - currentValue) / maxValue);
            default : return new Num(war, cost);
        }
    }
    public callPrimaryAmmo(arg: ResultsBase): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        const maxValue = unit.getPrimaryWeaponMaxAmmo();
        if (maxValue == null) {
            return new Num(war, -1);
        }

        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const currentValue = unit.getPrimaryWeaponCurrentAmmo();
        switch (arg.num) {
            case 1  : return new Num(war, maxValue);
            case 2  : return new Num(war, maxValue - currentValue);
            case 3  : return new Num(war, currentValue / maxValue);
            case 4  : return new Num(war, (maxValue - currentValue) / maxValue);
            default : return new Num(war, currentValue);
        }
    }
    public callFlareAmmo(arg: ResultsBase): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        const maxValue  = unit.getFlareMaxAmmo();
        if (maxValue == null) {
            return new Num(war, -1);
        }

        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getFlareCurrentAmmo();
        switch (arg.num) {
            case 1  : return new Num(war, maxValue);
            case 2  : return new Num(war, maxValue - currentValue);
            case 3  : return new Num(war, currentValue / maxValue);
            case 4  : return new Num(war, (maxValue - currentValue) / maxValue);
            default : return new Num(war, currentValue);
        }
    }
    public callBuildMaterial(arg: ResultsBase): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        const maxValue  = unit.getMaxBuildMaterial();
        if (maxValue == null) {
            return new Num(war, -1);
        }

        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentBuildMaterial();
        switch (arg.num) {
            case 1  : return new Num(war, maxValue);
            case 2  : return new Num(war, maxValue - currentValue);
            case 3  : return new Num(war, currentValue / maxValue);
            case 4  : return new Num(war, (maxValue - currentValue) / maxValue);
            default : return new Num(war, currentValue);
        }
    }
    public callProduceMaterial(arg: ResultsBase): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        const maxValue  = unit.getMaxProduceMaterial();
        if (maxValue == null) {
            return new Num(war, -1);
        }

        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const currentValue = unit.getCurrentProduceMaterial();
        switch (arg.num) {
            case 1  : return new Num(war, maxValue);
            case 2  : return new Num(war, maxValue - currentValue);
            case 3  : return new Num(war, currentValue / maxValue);
            case 4  : return new Num(war, (maxValue - currentValue) / maxValue);
            default : return new Num(war, currentValue);
        }
    }
    public callLoadedUnitsCount(isRecursive: ResultsBase): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        if (!(isRecursive instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        return new Num(war, war.getUnitMap().getUnitsLoadedByLoader(unit, isRecursive.num !== 0).length);
    }
    public callHasTag(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const tagId = arg.num;
        if (tagId != Math.floor(tagId)) {
            throw newError(`Invalid tagId: ${tagId}`);
        }

        const war   = this.getWar();
        const unit  = this._unit;
        if (unit == null) {
            return new Num(war, -2);
        }

        if ((tagId > TagId.MaxTagId) || (tagId < TagId.MinTagId)) {
            return new Num(war, 0);
        }

        return new Num(war, unit.getHasTagId(tagId) ? 1 : 0);
    }
    public callHasProhibitedLocation(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw newError(`Invalid locationId: ${locationId}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        if ((locationId > MaxId) || (locationId < MinId)) {
            return new Num(war, 0);
        }

        const groupedLocationIdArray = encode([locationId]);
        return new Num(
            war,
            (checkHasAnyOverlap(groupedLocationIdArray, unit.getForbiddenGroupedLocationIdArray())) ? 1 : 0
        );
    }
    public callInLocation(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw newError(`Invalid locationId: ${locationId}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        if ((locationId > MaxId) || (locationId < MinId)) {
            return new Num(war, 0);
        }

        const groupedLocationIdArray = encode([locationId]);
        return new Num(
            war,
            war.getTileMap().getTile(unit.getGridIndex()).checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray) ? 1 : 0
        );
    }
    public callDistanceToGrid(argX: ResultsBase, argY: ResultsBase): Num {
        if (!(argX instanceof Num)) {
            throw newError(`Unexpected argX.`);
        }
        if (!(argY instanceof Num)) {
            throw newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x != Math.floor(x)) || (y != Math.floor(y))) {
            throw newError(`Invalid xy: ${x}, ${y}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        const gridIndex = unit.getGridIndex();
        return new Num(war, Math.abs(gridIndex.getX() - x) + Math.abs(gridIndex.getY() - y));
    }
    public callDistanceToLocation(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw newError(`Invalid locationId: ${locationId}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }

        if ((locationId > MaxId) || (locationId < MinId)) {
            return new Num(war, -1);
        }

        const gridIndexList = this.getWar().getTileMap().getGridIndexListWithAnyLocationId([locationId]);
        return new Num(
            war,
            (gridIndexList.length <= 0) ? -1 : unit.getGridIndex().getMinDistance(gridIndexList)
        );
    }
    private callDistanceToCoUnit(): Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new Num(war, -2);
        }
        if (unit.getIsCoOnboard()) {
            return new Num(war, 0);
        }
        if (unit.getLoaderUnitId() != null) {
            return new Num(war, -1);
        }

        const gridIndexList = unit.getPlayer().getCoGridIndexListOnMap();
        return (gridIndexList.length <= 0)
            ? new Num(war, -1)
            : new Num(war, unit.getGridIndex().getMinDistance(gridIndexList));
    }
}
