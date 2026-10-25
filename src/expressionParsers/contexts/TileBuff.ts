import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { NumArray } from "../results/NumArray.ts";
import { Tile } from "../results/Tile.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import { extendVariableInfoDict, extendFunctionInfoDict } from "../Utils.ts";
import { TextType } from "../../lang/Constants.ts";
import type { TileBuff as ProtoSchemaCommonProtoStructureTileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { ITile as TilesITile } from "../../tiles/ITile.ts";

type TileBuffProto      = ProtoSchemaCommonProtoStructureTileBuff;
type ITile              = TilesITile;

export class TileBuff extends Base {
    private static readonly VnType                      = "type";
    private static readonly VnExpiringPlayerIndex       = "expiringPlayerIndex";
    private static readonly VnExpiringTurnIndex         = "expiringTurnIndex";
    private static readonly VnExtraParams               = "extraParams";
    private static readonly VnTile                      = "tile";
    private static readonly VnWar                       = "war";

    public static readonly Variables    = TileBuff.generateVariables();
    public static readonly Functions    = TileBuff.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(TileBuff.VnType,                 { desc: TextType.A0748, resultType: ResultType.Number,      isExtension: false });
        variables.set(TileBuff.VnExpiringPlayerIndex,  { desc: TextType.A0749, resultType: ResultType.Number,      isExtension: false });
        variables.set(TileBuff.VnExpiringTurnIndex,    { desc: TextType.A0750, resultType: ResultType.Number,      isExtension: false });
        variables.set(TileBuff.VnExtraParams,          { desc: TextType.A0751, resultType: ResultType.NumberArray, isExtension: false });
        variables.set(TileBuff.VnTile,                 { desc: TextType.A0752, resultType: ResultType.Tile,        isExtension: false });
        variables.set(TileBuff.VnWar,                  { desc: TextType.A0384, resultType: ResultType.War,         isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        return functions;
    }

    private readonly _buff  : TileBuffProto;
    private readonly _tile  : ITile;
    private _contextWar     : War | null = null;

    public constructor(buff: TileBuffProto, tile: ITile) {
        super(tile.getWar());

        this._buff  = buff;
        this._tile  = tile;
    }

    public getContextType(): ContextType {
        return ContextType.TileBuff;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        const war   = this.getWar();
        const buff  = this._buff;
        if (identifierName == TileBuff.VnType) {
            return new Num(war, buff.getBuffTypeId());
        } else if (identifierName == TileBuff.VnExpiringPlayerIndex) {
            return new Num(war, buff.getExpiringPlayerIndex() ?? -1);
        } else if (identifierName == TileBuff.VnExpiringTurnIndex) {
            return new Num(war, buff.getExpiringTurnIndex() ?? -1);
        } else if (identifierName == TileBuff.VnExtraParams) {
            return new NumArray(war, buff.getExtraParamArray() ?? []);
        } else if (identifierName == TileBuff.VnTile) {
            return new Tile(this._tile);
        } else if (identifierName == TileBuff.VnWar) {
            return new ExpressionParsersResultsWar(war);
        }

        return (this._contextWar ??= new War(war)).resolveVariable(identifierName);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
    }
}
