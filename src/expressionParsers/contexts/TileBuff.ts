import {
    ExpressionParsers_Contexts_Base,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Results_Tile,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type Tiles_Tile,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";
import type { TileBuff as ProtoTileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";

export class TileBuff extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnType                      = "type";
    private static readonly VnExpiringPlayerIndex       = "expiringPlayerIndex";
    private static readonly VnExpiringTurnIndex         = "expiringTurnIndex";
    private static readonly VnExtraParams               = "extraParams";
    private static readonly VnTile                      = "tile";
    private static readonly VnWar                       = "war";

    public static readonly Variables    = TileBuff.generateVariables();
    public static readonly Functions    = TileBuff.generateFunctions();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(TileBuff.VnType,                 { desc : Lang_Constants.TextType.A0748, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(TileBuff.VnExpiringPlayerIndex,  { desc : Lang_Constants.TextType.A0749, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(TileBuff.VnExpiringTurnIndex,    { desc : Lang_Constants.TextType.A0750, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(TileBuff.VnExtraParams,          { desc : Lang_Constants.TextType.A0751, resultType : ExpressionParsers_Enums.ResultType.NumberArray, isExtension : false });
        variables.set(TileBuff.VnTile,                 { desc : Lang_Constants.TextType.A0752, resultType : ExpressionParsers_Enums.ResultType.Tile,        isExtension : false });
        variables.set(TileBuff.VnWar,                  { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War,         isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        return functions;
    }

    private readonly _buff  : ProtoTileBuff;
    private readonly _tile  : Tiles_Tile.Tile;
    private _contextWar     : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(buff: ProtoTileBuff, tile: Tiles_Tile.Tile) {
        super(tile.getWar());

        this._buff  = buff;
        this._tile  = tile;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.TileBuff;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const war   = this.getWar();
        const buff  = this._buff;
        if (identifierName == TileBuff.VnType) {
            return new ExpressionParsers_Results_Num.Num(war, buff.getBuffTypeId());
        } else if (identifierName == TileBuff.VnExpiringPlayerIndex) {
            return new ExpressionParsers_Results_Num.Num(war, buff.getExpiringPlayerIndex() ?? -1);
        } else if (identifierName == TileBuff.VnExpiringTurnIndex) {
            return new ExpressionParsers_Results_Num.Num(war, buff.getExpiringTurnIndex() ?? -1);
        } else if (identifierName == TileBuff.VnExtraParams) {
            return new ExpressionParsers_Results_NumArray.NumArray(war, buff.getExtraParamArray());
        } else if (identifierName == TileBuff.VnTile) {
            return new ExpressionParsers_Results_Tile.Tile(this._tile);
        } else if (identifierName == TileBuff.VnWar) {
            return new ExpressionParsers_Results_War.War(war);
        }

        return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).resolveVariable(identifierName);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
    }
}
