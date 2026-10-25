import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { NumArray } from "../results/NumArray.ts";
import { Position } from "../results/Position.ts";
import { PositionArray } from "../results/PositionArray.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import type { WarOperation as ExpressionParsersResultsWarOperation } from "../results/WarOperation.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import { extendVariableInfoDict, extendFunctionInfoDict } from "../Utils.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import type {
    WoContainer as ProtoSchemaCommonProtoWarOperationWoContainer,
} from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { OperationTypeId } from "../../warOperations/Constants.ts";

type WoContainer            = ProtoSchemaCommonProtoWarOperationWoContainer;

export class WarOperation extends Base {
    private static readonly VnId                        = "id";
    private static readonly VnType                      = "type";
    private static readonly VnWar                       = "war";
    private static readonly VnTargetWarEventId          = "targetWarEventId";
    private static readonly VnTargetPlayerIndex         = "targetPlayerIndex";
    private static readonly VnAgreeToDraw               = "agreeToDraw";
    private static readonly VnTargetPosition            = "targetPosition";
    private static readonly VnTargetUnitHp              = "targetUnitHp";
    private static readonly VnTargetUnitType            = "targetUnitType";
    private static readonly VnTargetCoSkillType         = "targetCoSkillType";
    private static readonly VnTargetPositionArray       = "targetPositionArray";
    private static readonly VnUnitMovePath              = "unitMovePath";
    private static readonly VnIsUnitMovePathBlocked     = "isUnitMovePathBlocked";
    private static readonly VnLaunchedUnitId            = "launchedUnitId";
    private static readonly VnIsDerivedActionBlocked    = "isDerivedActionBlocked";
    private static readonly VnTargetUnitIdArray         = "targetUnitIdArray";

    public static readonly Variables    = WarOperation.generateVariables();
    public static readonly Functions    = WarOperation.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(WarOperation.VnId,                       { desc: TextType.A0704, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnType,                     { desc: TextType.A0705, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnWar,                      { desc: TextType.A0384, resultType: ResultType.War,           isExtension: false });
        variables.set(WarOperation.VnTargetWarEventId,         { desc: TextType.A0906, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetPlayerIndex,        { desc: TextType.A0907, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnAgreeToDraw,              { desc: TextType.A0908, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetPosition,           { desc: TextType.A0909, resultType: ResultType.Position,      isExtension: false });
        variables.set(WarOperation.VnTargetUnitHp,             { desc: TextType.A0910, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetUnitType,           { desc: TextType.A0911, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetCoSkillType,        { desc: TextType.A0912, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetPositionArray,      { desc: TextType.A0913, resultType: ResultType.PositionArray, isExtension: false });
        variables.set(WarOperation.VnUnitMovePath,             { desc: TextType.A0914, resultType: ResultType.PositionArray, isExtension: false });
        variables.set(WarOperation.VnIsUnitMovePathBlocked,    { desc: TextType.A0915, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnLaunchedUnitId,           { desc: TextType.A0916, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnIsDerivedActionBlocked,   { desc: TextType.A0917, resultType: ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetUnitIdArray,        { desc: TextType.A0918, resultType: ResultType.NumberArray,   isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        // functions.set(
        //     EpContextWarOperation.FnType,
        //     new FunctionInfo(
        //         LangTextType.A0456,
        //         (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
        //             if (argArray.length !== 1) {
        //                 throw Helpers.newError(
        //                     getErrorTextForParameterCount(EpContextWarOperation.FnType, 1, argArray.length),
        //                     ClientErrorCode.EpContextWarOperation_GenerateFunctions_00
        //                 );
        //             }

        //             const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        //             if (argType !== EpResultType.Number) {
        //                 throw Helpers.newError(
        //                     getErrorTextForParameterType(EpContextWarOperation.FnType, 1, EpResultType.Number, argType),
        //                     ClientErrorCode.EpContextWarOperation_GenerateFunctions_01
        //                 );
        //             }

        //             return EpResultType.Number;
        //         },
        //     )
        // );

        return functions;
    }

    private _woContainer    : WoContainer | null;
    private _contextWar     : War | null = null;

    public constructor(result: ExpressionParsersResultsWarOperation) {
        super(result.war);

        this._woContainer = result.woContainer;
    }

    public getContextType(): ContextType {
        return ContextType.WarOperation;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        const woContainer   = this._woContainer;
        const war           = this.getWar();
        switch (identifierName) {
            case WarOperation.VnId                     : return new Num(war, woContainer ? woContainer.getOperationId() ?? 0 : -2);
            case WarOperation.VnType                   : return new Num(war, woContainer ? getExisted(getWarOperationType(woContainer)) : -2);
            case WarOperation.VnWar                    : return new ExpressionParsersResultsWar(war);
            case WarOperation.VnTargetWarEventId       : return this._resolveTargetWarEventId();
            case WarOperation.VnTargetPlayerIndex      : return this._resolveTargetPlayerIndex();
            case WarOperation.VnAgreeToDraw            : return this._resolveAgreeToDraw();
            case WarOperation.VnTargetPosition         : return this._resolveTargetPosition();
            case WarOperation.VnTargetUnitHp           : return this._resolveTargetUnitHp();
            case WarOperation.VnTargetUnitType         : return this._resolveTargetUnitType();
            case WarOperation.VnTargetCoSkillType      : return this._resolveTargetCoSkillType();
            case WarOperation.VnTargetPositionArray    : return this._resolveTargetPositionArray();
            case WarOperation.VnUnitMovePath           : return this._resolveUnitMovePath();
            case WarOperation.VnIsUnitMovePathBlocked  : return this._resolveIsUnitMovePathBlocked();
            case WarOperation.VnLaunchedUnitId         : return this._resolveLaunchedUnitId();
            case WarOperation.VnIsDerivedActionBlocked : return this._resolveIsDerivedActionBlocked();
            case WarOperation.VnTargetUnitIdArray      : return this._resolveTargetUnitIdArray();
            default                                             : return (this._contextWar ??= new War(war)).resolveVariable(identifierName);
        }
    }
    private _resolveTargetWarEventId(): Num {
        const data = this._woContainer?.getWoSystemCallWarEvent();
        return new Num(this.getWar(), data ? data.getWarEventId() ?? 0 : -2);
    }
    private _resolveTargetPlayerIndex(): Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new Num(war, -2);
        }

        {
            const operation = container.getWoSystemDestroyPlayerForce();
            if (operation) {
                return new Num(war, operation.getTargetPlayerIndex() ?? 0);
            }
        }
        {
            const operation = container.getWoPlayerSurrender();
            if (operation) {
                return new Num(war, operation.getPlayerIndex() ?? 0);
            }
        }

        return new Num(war, -2);
    }
    private _resolveAgreeToDraw(): Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new Num(war, -2);
        }

        {
            const operation = container.getWoSystemVoteForDraw();
            if (operation) {
                return new Num(war, operation.getIsAgree() ? 1 : 0);
            }
        }

        {
            const operation = container.getWoPlayerVoteForDraw();
            if (operation) {
                return new Num(war, operation.getIsAgree() ? 1 : 0);
            }
        }

        return new Num(war, -2);
    }
    private _resolveTargetPosition(): Position {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new Position(war, -2, -2);
        }

        {
            const operation = container.getWoPlayerProduceUnit();
            if (operation) {
                const gridIndex = operation.getGridIndex();
                return new Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoPlayerDeleteUnit();
            if (operation) {
                const gridIndex = operation.getGridIndex();
                return new Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }

        return new Position(war, -2, -2);
    }
    private _resolveTargetUnitHp(): Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new Num(war, -2);
        }

        {
            const operation = container.getWoPlayerProduceUnit();
            if (operation) {
                const hp = operation.getUnitHp();
                if (hp != null) {
                    return new Num(war, hp);
                } else {
                    return new Num(war, war.getGcData().getUnitTemplateCfg(operation.getUnitType() ?? 0)?.getMaxHp() ?? 0);
                }
            }
        }

        return new Num(war, -2);
    }
    private _resolveTargetUnitType(): Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new Num(war, -2);
        }

        {
            const operation = container.getWoPlayerProduceUnit();
            if (operation) {
                return new Num(war, operation.getUnitType() ?? 0);
            }
        }

        return new Num(war, -2);
    }
    private _resolveTargetCoSkillType(): Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new Num(war, -2);
        } else if (container.getWoPlayerUseCoSkill()) {
            return new Num(war, container.getWoPlayerUseCoSkill()?.getSkillType() ?? 0);
        } else if (container.getWoUnitUseCoSkill()) {
            return new Num(war, container.getWoUnitUseCoSkill()?.getSkillType() ?? 0);
        } else {
            return new Num(war, -2);
        }
    }
    private _resolveTargetPositionArray(): PositionArray {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new PositionArray(war, []);
        }

        {
            const operation = container.getWoPlayerUseCoSkill();
            if (operation) {
                return new PositionArray(
                    war,
                    operation.getTargetGridIndexArray().map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? [],
                );
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new PositionArray(
                    war,
                    operation.getDropDestinations().map(v => new Position(war, v.getGridIndex()?.getX() ?? 0, v.getGridIndex()?.getY() ?? 0)) ?? [],
                );
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new PositionArray(
                    war,
                    operation.getTargetGridIndexArray().map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? [],
                );
            }
        }

        return new PositionArray(war, []);
    }
    private _resolveUnitMovePath(): PositionArray {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new PositionArray(war, []);
        }

        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitBeLoaded();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitBoardedByCo();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitBuildTile();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitCaptureTile();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitCrushUnit();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitDive();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitJoinUnit();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitProduceUnit();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitRepairUnit();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitSelfDetonate();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitSupplyUnit();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitSurface();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitWait();
            if (operation) {
                return new PositionArray(war, operation.getPath()?.getNodes()?.map(v => new Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }

        return new PositionArray(war, []);
    }
    private _resolveIsUnitMovePathBlocked(): Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new Num(war, -2);
        }

        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitBeLoaded();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitBoardedByCo();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitBuildTile();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitCaptureTile();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitCrushUnit();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitDive();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitJoinUnit();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitProduceUnit();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitRepairUnit();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitSelfDetonate();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitSupplyUnit();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitSurface();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitWait();
            if (operation) {
                return new Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }

        return new Num(war, -2);
    }
    private _resolveLaunchedUnitId(): Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new Num(war, -2);
        }

        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitBeLoaded();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitBoardedByCo();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitBuildTile();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitCaptureTile();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitCrushUnit();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitDive();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitJoinUnit();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitProduceUnit();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitRepairUnit();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitSelfDetonate();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitSupplyUnit();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitSurface();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitWait();
            if (operation) {
                return new Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }

        return new Num(war, -2);
    }
    private _resolveIsDerivedActionBlocked(): Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new Num(war, -2);
        }

        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new Num(war, operation.getIsDropBlocked() ? 1 : 0);
            }
        }

        return new Num(war, -2);
    }
    private _resolveTargetUnitIdArray(): NumArray {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new NumArray(war, []);
        }

        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new NumArray(war, operation.getDropDestinations().map(v => v.getUnitId() ?? 0) ?? []);
            }
        }

        return new NumArray(war, []);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        const war = this.getWar();
        switch (identifierName) {
            default                         : return (this._contextWar ??= new War(war)).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
}

function getWarOperationType(woContainer: WoContainer): OperationTypeId | null {
    if      (woContainer.getWoSystemBeginTurn())            { return OperationTypeId.SystemBeginTurn; }
    else if (woContainer.getWoSystemCallWarEvent())         { return OperationTypeId.SystemCallWarEvent; }
    else if (woContainer.getWoSystemDestroyPlayerForce())   { return OperationTypeId.SystemDestroyPlayerForce; }
    else if (woContainer.getWoSystemEndTurn())              { return OperationTypeId.SystemEndTurn; }
    else if (woContainer.getWoSystemEndWar())               { return OperationTypeId.SystemEndWar; }
    else if (woContainer.getWoSystemHandleBootPlayer())     { return OperationTypeId.SystemHandleBootPlayer; }
    else if (woContainer.getWoSystemVoteForDraw())          { return OperationTypeId.SystemVoteForDraw; }
    else if (woContainer.getWoPlayerDeleteUnit())           { return OperationTypeId.PlayerDeleteUnit; }
    else if (woContainer.getWoPlayerEndTurn())              { return OperationTypeId.PlayerEndTurn; }
    else if (woContainer.getWoPlayerProduceUnit())          { return OperationTypeId.PlayerProduceUnit; }
    else if (woContainer.getWoPlayerSurrender())            { return OperationTypeId.PlayerSurrender; }
    else if (woContainer.getWoPlayerUseCoSkill())           { return OperationTypeId.PlayerUseCoSkill; }
    else if (woContainer.getWoPlayerVoteForDraw())          { return OperationTypeId.PlayerVoteForDraw; }
    else if (woContainer.getWoUnitAttackTile())             { return OperationTypeId.UnitAttackTile; }
    else if (woContainer.getWoUnitAttackUnit())             { return OperationTypeId.UnitAttackUnit; }
    else if (woContainer.getWoUnitBeLoaded())               { return OperationTypeId.UnitBeLoaded; }
    else if (woContainer.getWoUnitBoardedByCo())            { return OperationTypeId.UnitBoardedByCo; }
    else if (woContainer.getWoUnitBuildTile())              { return OperationTypeId.UnitBuildTile; }
    else if (woContainer.getWoUnitCaptureTile())            { return OperationTypeId.UnitCaptureTile; }
    else if (woContainer.getWoUnitCrushUnit())              { return OperationTypeId.UnitCrushUnit; }
    else if (woContainer.getWoUnitDive())                   { return OperationTypeId.UnitDive; }
    else if (woContainer.getWoUnitDropUnit())               { return OperationTypeId.UnitDropUnit; }
    else if (woContainer.getWoUnitJoinUnit())               { return OperationTypeId.UnitJoinUnit; }
    else if (woContainer.getWoUnitLaunchFlare())            { return OperationTypeId.UnitLaunchFlare; }
    else if (woContainer.getWoUnitLaunchSilo())             { return OperationTypeId.UnitLaunchSilo; }
    else if (woContainer.getWoUnitProduceUnit())            { return OperationTypeId.UnitProduceUnit; }
    else if (woContainer.getWoUnitRepairUnit())             { return OperationTypeId.UnitRepairUnit; }
    else if (woContainer.getWoUnitSelfDetonate())           { return OperationTypeId.UnitSelfDetonate; }
    else if (woContainer.getWoUnitSupplyUnit())             { return OperationTypeId.UnitSupplyUnit; }
    else if (woContainer.getWoUnitSurface())                { return OperationTypeId.UnitSurface; }
    else if (woContainer.getWoUnitUseCoSkill())             { return OperationTypeId.UnitUseCoSkill; }
    else if (woContainer.getWoUnitWait())                   { return OperationTypeId.UnitWait; }
    else                                                    { return null; }
}
