import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../results/NumArray.ts";
import * as ExpressionParsersResultsPosition from "../results/Position.ts";
import * as ExpressionParsersResultsPositionArray from "../results/PositionArray.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersResultsWarOperation from "../results/WarOperation.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as WarOperationsConstants from "../../warOperations/Constants.ts";

type WoContainer            = ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer;

export class WarOperation extends ExpressionParsersContextsBase.Base {
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
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(WarOperation.VnId,                       { desc: LangConstants.TextType.A0704, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnType,                     { desc: LangConstants.TextType.A0705, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnWar,                      { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,           isExtension: false });
        variables.set(WarOperation.VnTargetWarEventId,         { desc: LangConstants.TextType.A0906, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetPlayerIndex,        { desc: LangConstants.TextType.A0907, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnAgreeToDraw,              { desc: LangConstants.TextType.A0908, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetPosition,           { desc: LangConstants.TextType.A0909, resultType: ExpressionParsersEnums.ResultType.Position,      isExtension: false });
        variables.set(WarOperation.VnTargetUnitHp,             { desc: LangConstants.TextType.A0910, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetUnitType,           { desc: LangConstants.TextType.A0911, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetCoSkillType,        { desc: LangConstants.TextType.A0912, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetPositionArray,      { desc: LangConstants.TextType.A0913, resultType: ExpressionParsersEnums.ResultType.PositionArray, isExtension: false });
        variables.set(WarOperation.VnUnitMovePath,             { desc: LangConstants.TextType.A0914, resultType: ExpressionParsersEnums.ResultType.PositionArray, isExtension: false });
        variables.set(WarOperation.VnIsUnitMovePathBlocked,    { desc: LangConstants.TextType.A0915, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnLaunchedUnitId,           { desc: LangConstants.TextType.A0916, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnIsDerivedActionBlocked,   { desc: LangConstants.TextType.A0917, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetUnitIdArray,        { desc: LangConstants.TextType.A0918, resultType: ExpressionParsersEnums.ResultType.NumberArray,   isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
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
    private _contextWar     : ExpressionParsersContextsWar.War | null = null;

    public constructor(result: ExpressionParsersResultsWarOperation.WarOperation) {
        super(result.war);

        this._woContainer = result.woContainer;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.WarOperation;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const woContainer   = this._woContainer;
        const war           = this.getWar();
        switch (identifierName) {
            case WarOperation.VnId                     : return new ExpressionParsersResultsNum.Num(war, woContainer ? woContainer.getOperationId() ?? 0 : -2);
            case WarOperation.VnType                   : return new ExpressionParsersResultsNum.Num(war, woContainer ? HelpersMisc.getExisted(getWarOperationType(woContainer)) : -2);
            case WarOperation.VnWar                    : return new ExpressionParsersResultsWar.War(war);
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
            default                                             : return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).resolveVariable(identifierName);
        }
    }
    private _resolveTargetWarEventId(): ExpressionParsersResultsNum.Num {
        const data = this._woContainer?.getWoSystemCallWarEvent();
        return new ExpressionParsersResultsNum.Num(this.getWar(), data ? data.getWarEventId() ?? 0 : -2);
    }
    private _resolveTargetPlayerIndex(): ExpressionParsersResultsNum.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        {
            const operation = container.getWoSystemDestroyPlayerForce();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getTargetPlayerIndex() ?? 0);
            }
        }
        {
            const operation = container.getWoPlayerSurrender();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPlayerIndex() ?? 0);
            }
        }

        return new ExpressionParsersResultsNum.Num(war, -2);
    }
    private _resolveAgreeToDraw(): ExpressionParsersResultsNum.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        {
            const operation = container.getWoSystemVoteForDraw();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getIsAgree() ? 1 : 0);
            }
        }

        {
            const operation = container.getWoPlayerVoteForDraw();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getIsAgree() ? 1 : 0);
            }
        }

        return new ExpressionParsersResultsNum.Num(war, -2);
    }
    private _resolveTargetPosition(): ExpressionParsersResultsPosition.Position {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsPosition.Position(war, -2, -2);
        }

        {
            const operation = container.getWoPlayerProduceUnit();
            if (operation) {
                const gridIndex = operation.getGridIndex();
                return new ExpressionParsersResultsPosition.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoPlayerDeleteUnit();
            if (operation) {
                const gridIndex = operation.getGridIndex();
                return new ExpressionParsersResultsPosition.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new ExpressionParsersResultsPosition.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new ExpressionParsersResultsPosition.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new ExpressionParsersResultsPosition.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new ExpressionParsersResultsPosition.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }

        return new ExpressionParsersResultsPosition.Position(war, -2, -2);
    }
    private _resolveTargetUnitHp(): ExpressionParsersResultsNum.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        {
            const operation = container.getWoPlayerProduceUnit();
            if (operation) {
                const hp = operation.getUnitHp();
                if (hp != null) {
                    return new ExpressionParsersResultsNum.Num(war, hp);
                } else {
                    return new ExpressionParsersResultsNum.Num(war, war.getGcData().getUnitTemplateCfg(operation.getUnitType() ?? 0)?.getMaxHp() ?? 0);
                }
            }
        }

        return new ExpressionParsersResultsNum.Num(war, -2);
    }
    private _resolveTargetUnitType(): ExpressionParsersResultsNum.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        {
            const operation = container.getWoPlayerProduceUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getUnitType() ?? 0);
            }
        }

        return new ExpressionParsersResultsNum.Num(war, -2);
    }
    private _resolveTargetCoSkillType(): ExpressionParsersResultsNum.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        } else if (container.getWoPlayerUseCoSkill()) {
            return new ExpressionParsersResultsNum.Num(war, container.getWoPlayerUseCoSkill()?.getSkillType() ?? 0);
        } else if (container.getWoUnitUseCoSkill()) {
            return new ExpressionParsersResultsNum.Num(war, container.getWoUnitUseCoSkill()?.getSkillType() ?? 0);
        } else {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }
    }
    private _resolveTargetPositionArray(): ExpressionParsersResultsPositionArray.PositionArray {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsPositionArray.PositionArray(war, []);
        }

        {
            const operation = container.getWoPlayerUseCoSkill();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(
                    war,
                    operation.getTargetGridIndexArray().map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? [],
                );
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(
                    war,
                    operation.getDropDestinations().map(v => new ExpressionParsersResultsPosition.Position(war, v.getGridIndex()?.getX() ?? 0, v.getGridIndex()?.getY() ?? 0)) ?? [],
                );
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(
                    war,
                    operation.getTargetGridIndexArray().map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? [],
                );
            }
        }

        return new ExpressionParsersResultsPositionArray.PositionArray(war, []);
    }
    private _resolveUnitMovePath(): ExpressionParsersResultsPositionArray.PositionArray {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsPositionArray.PositionArray(war, []);
        }

        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitBeLoaded();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitBoardedByCo();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitBuildTile();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitCaptureTile();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitCrushUnit();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitDive();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitJoinUnit();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitProduceUnit();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitRepairUnit();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitSelfDetonate();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitSupplyUnit();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitSurface();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitWait();
            if (operation) {
                return new ExpressionParsersResultsPositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsersResultsPosition.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }

        return new ExpressionParsersResultsPositionArray.PositionArray(war, []);
    }
    private _resolveIsUnitMovePathBlocked(): ExpressionParsersResultsNum.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitBeLoaded();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitBoardedByCo();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitBuildTile();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitCaptureTile();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitCrushUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitDive();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitJoinUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitProduceUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitRepairUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitSelfDetonate();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitSupplyUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitSurface();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitWait();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }

        return new ExpressionParsersResultsNum.Num(war, -2);
    }
    private _resolveLaunchedUnitId(): ExpressionParsersResultsNum.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitBeLoaded();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitBoardedByCo();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitBuildTile();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitCaptureTile();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitCrushUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitDive();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitJoinUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitProduceUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitRepairUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitSelfDetonate();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitSupplyUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitSurface();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitWait();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }

        return new ExpressionParsersResultsNum.Num(war, -2);
    }
    private _resolveIsDerivedActionBlocked(): ExpressionParsersResultsNum.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsersResultsNum.Num(war, operation.getIsDropBlocked() ? 1 : 0);
            }
        }

        return new ExpressionParsersResultsNum.Num(war, -2);
    }
    private _resolveTargetUnitIdArray(): ExpressionParsersResultsNumArray.NumArray {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsersResultsNumArray.NumArray(war, []);
        }

        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsersResultsNumArray.NumArray(war, operation.getDropDestinations().map(v => v.getUnitId() ?? 0) ?? []);
            }
        }

        return new ExpressionParsersResultsNumArray.NumArray(war, []);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const war = this.getWar();
        switch (identifierName) {
            default                         : return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
}

function getWarOperationType(woContainer: WoContainer): WarOperationsConstants.OperationTypeId | null {
    if      (woContainer.getWoSystemBeginTurn())            { return WarOperationsConstants.OperationTypeId.SystemBeginTurn; }
    else if (woContainer.getWoSystemCallWarEvent())         { return WarOperationsConstants.OperationTypeId.SystemCallWarEvent; }
    else if (woContainer.getWoSystemDestroyPlayerForce())   { return WarOperationsConstants.OperationTypeId.SystemDestroyPlayerForce; }
    else if (woContainer.getWoSystemEndTurn())              { return WarOperationsConstants.OperationTypeId.SystemEndTurn; }
    else if (woContainer.getWoSystemEndWar())               { return WarOperationsConstants.OperationTypeId.SystemEndWar; }
    else if (woContainer.getWoSystemHandleBootPlayer())     { return WarOperationsConstants.OperationTypeId.SystemHandleBootPlayer; }
    else if (woContainer.getWoSystemVoteForDraw())          { return WarOperationsConstants.OperationTypeId.SystemVoteForDraw; }
    else if (woContainer.getWoPlayerDeleteUnit())           { return WarOperationsConstants.OperationTypeId.PlayerDeleteUnit; }
    else if (woContainer.getWoPlayerEndTurn())              { return WarOperationsConstants.OperationTypeId.PlayerEndTurn; }
    else if (woContainer.getWoPlayerProduceUnit())          { return WarOperationsConstants.OperationTypeId.PlayerProduceUnit; }
    else if (woContainer.getWoPlayerSurrender())            { return WarOperationsConstants.OperationTypeId.PlayerSurrender; }
    else if (woContainer.getWoPlayerUseCoSkill())           { return WarOperationsConstants.OperationTypeId.PlayerUseCoSkill; }
    else if (woContainer.getWoPlayerVoteForDraw())          { return WarOperationsConstants.OperationTypeId.PlayerVoteForDraw; }
    else if (woContainer.getWoUnitAttackTile())             { return WarOperationsConstants.OperationTypeId.UnitAttackTile; }
    else if (woContainer.getWoUnitAttackUnit())             { return WarOperationsConstants.OperationTypeId.UnitAttackUnit; }
    else if (woContainer.getWoUnitBeLoaded())               { return WarOperationsConstants.OperationTypeId.UnitBeLoaded; }
    else if (woContainer.getWoUnitBoardedByCo())            { return WarOperationsConstants.OperationTypeId.UnitBoardedByCo; }
    else if (woContainer.getWoUnitBuildTile())              { return WarOperationsConstants.OperationTypeId.UnitBuildTile; }
    else if (woContainer.getWoUnitCaptureTile())            { return WarOperationsConstants.OperationTypeId.UnitCaptureTile; }
    else if (woContainer.getWoUnitCrushUnit())              { return WarOperationsConstants.OperationTypeId.UnitCrushUnit; }
    else if (woContainer.getWoUnitDive())                   { return WarOperationsConstants.OperationTypeId.UnitDive; }
    else if (woContainer.getWoUnitDropUnit())               { return WarOperationsConstants.OperationTypeId.UnitDropUnit; }
    else if (woContainer.getWoUnitJoinUnit())               { return WarOperationsConstants.OperationTypeId.UnitJoinUnit; }
    else if (woContainer.getWoUnitLaunchFlare())            { return WarOperationsConstants.OperationTypeId.UnitLaunchFlare; }
    else if (woContainer.getWoUnitLaunchSilo())             { return WarOperationsConstants.OperationTypeId.UnitLaunchSilo; }
    else if (woContainer.getWoUnitProduceUnit())            { return WarOperationsConstants.OperationTypeId.UnitProduceUnit; }
    else if (woContainer.getWoUnitRepairUnit())             { return WarOperationsConstants.OperationTypeId.UnitRepairUnit; }
    else if (woContainer.getWoUnitSelfDetonate())           { return WarOperationsConstants.OperationTypeId.UnitSelfDetonate; }
    else if (woContainer.getWoUnitSupplyUnit())             { return WarOperationsConstants.OperationTypeId.UnitSupplyUnit; }
    else if (woContainer.getWoUnitSurface())                { return WarOperationsConstants.OperationTypeId.UnitSurface; }
    else if (woContainer.getWoUnitUseCoSkill())             { return WarOperationsConstants.OperationTypeId.UnitUseCoSkill; }
    else if (woContainer.getWoUnitWait())                   { return WarOperationsConstants.OperationTypeId.UnitWait; }
    else                                                    { return null; }
}
