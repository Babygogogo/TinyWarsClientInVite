import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../results/NumArray.ts";
import * as ExpressionParsersResultsTile from "../results/Tile.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as LangConstants from "../../lang/Constants.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as TilesITile from "../../tiles/ITile.ts";

type TileBuffProto      = ProtoSchemaCommonProtoStructureTileBuff.TileBuff;
type ITile              = TilesITile.ITile;

export class TileBuff extends ExpressionParsersContextsBase.Base {
    private static readonly VnType                      = "type";
    private static readonly VnExpiringPlayerIndex       = "expiringPlayerIndex";
    private static readonly VnExpiringTurnIndex         = "expiringTurnIndex";
    private static readonly VnExtraParams               = "extraParams";
    private static readonly VnTile                      = "tile";
    private static readonly VnWar                       = "war";

    public static readonly Variables    = TileBuff.generateVariables();
    public static readonly Functions    = TileBuff.generateFunctions();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(TileBuff.VnType,                 { desc: LangConstants.TextType.A0748, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(TileBuff.VnExpiringPlayerIndex,  { desc: LangConstants.TextType.A0749, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(TileBuff.VnExpiringTurnIndex,    { desc: LangConstants.TextType.A0750, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(TileBuff.VnExtraParams,          { desc: LangConstants.TextType.A0751, resultType: ExpressionParsersEnums.ResultType.NumberArray, isExtension: false });
        variables.set(TileBuff.VnTile,                 { desc: LangConstants.TextType.A0752, resultType: ExpressionParsersEnums.ResultType.Tile,        isExtension: false });
        variables.set(TileBuff.VnWar,                  { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,         isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        return functions;
    }

    private readonly _buff  : TileBuffProto;
    private readonly _tile  : ITile;
    private _contextWar     : ExpressionParsersContextsWar.War | null = null;

    public constructor(buff: TileBuffProto, tile: ITile) {
        super(tile.getWar());

        this._buff  = buff;
        this._tile  = tile;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.TileBuff;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const war   = this.getWar();
        const buff  = this._buff;
        if (identifierName == TileBuff.VnType) {
            return new ExpressionParsersResultsNum.Num(war, buff.getBuffTypeId());
        } else if (identifierName == TileBuff.VnExpiringPlayerIndex) {
            return new ExpressionParsersResultsNum.Num(war, buff.getExpiringPlayerIndex() ?? -1);
        } else if (identifierName == TileBuff.VnExpiringTurnIndex) {
            return new ExpressionParsersResultsNum.Num(war, buff.getExpiringTurnIndex() ?? -1);
        } else if (identifierName == TileBuff.VnExtraParams) {
            return new ExpressionParsersResultsNumArray.NumArray(war, buff.getExtraParamArray() ?? []);
        } else if (identifierName == TileBuff.VnTile) {
            return new ExpressionParsersResultsTile.Tile(this._tile);
        } else if (identifierName == TileBuff.VnWar) {
            return new ExpressionParsersResultsWar.War(war);
        }

        return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).resolveVariable(identifierName);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
    }
}
