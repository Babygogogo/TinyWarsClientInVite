import {
    ExpressionParsers_Contexts_Base,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    Helpers_Misc,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    WarOperations_Constants,
    ExpressionParsers_Results_Position,
    ExpressionParsers_Results_PositionArray,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type ExpressionParsers_Results_Base,
    type ExpressionParsers_Results_WarOperation,
} from "../../internal.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class WarOperation extends ExpressionParsers_Contexts_Base.Base {
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
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(WarOperation.VnId,                       { desc: Lang_Constants.TextType.A0704, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnType,                     { desc: Lang_Constants.TextType.A0705, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnWar,                      { desc: Lang_Constants.TextType.A0384, resultType: ExpressionParsers_Enums.ResultType.War,           isExtension: false });
        variables.set(WarOperation.VnTargetWarEventId,         { desc: Lang_Constants.TextType.A0906, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetPlayerIndex,        { desc: Lang_Constants.TextType.A0907, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnAgreeToDraw,              { desc: Lang_Constants.TextType.A0908, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetPosition,           { desc: Lang_Constants.TextType.A0909, resultType: ExpressionParsers_Enums.ResultType.Position,      isExtension: false });
        variables.set(WarOperation.VnTargetUnitHp,             { desc: Lang_Constants.TextType.A0910, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetUnitType,           { desc: Lang_Constants.TextType.A0911, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetCoSkillType,        { desc: Lang_Constants.TextType.A0912, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetPositionArray,      { desc: Lang_Constants.TextType.A0913, resultType: ExpressionParsers_Enums.ResultType.PositionArray, isExtension: false });
        variables.set(WarOperation.VnUnitMovePath,             { desc: Lang_Constants.TextType.A0914, resultType: ExpressionParsers_Enums.ResultType.PositionArray, isExtension: false });
        variables.set(WarOperation.VnIsUnitMovePathBlocked,    { desc: Lang_Constants.TextType.A0915, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnLaunchedUnitId,           { desc: Lang_Constants.TextType.A0916, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnIsDerivedActionBlocked,   { desc: Lang_Constants.TextType.A0917, resultType: ExpressionParsers_Enums.ResultType.Number,        isExtension: false });
        variables.set(WarOperation.VnTargetUnitIdArray,        { desc: Lang_Constants.TextType.A0918, resultType: ExpressionParsers_Enums.ResultType.NumberArray,   isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
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
    private _contextWar     : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(result: ExpressionParsers_Results_WarOperation.WarOperation) {
        super(result.war);

        this._woContainer = result.woContainer;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.WarOperation;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const woContainer   = this._woContainer;
        const war           = this.getWar();
        switch (identifierName) {
            case WarOperation.VnId                     : return new ExpressionParsers_Results_Num.Num(war, woContainer ? woContainer.getOperationId() ?? 0 : -2);
            case WarOperation.VnType                   : return new ExpressionParsers_Results_Num.Num(war, woContainer ? Helpers_Misc.getExisted(getWarOperationType(woContainer)) : -2);
            case WarOperation.VnWar                    : return new ExpressionParsers_Results_War.War(war);
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
            default                                             : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).resolveVariable(identifierName);
        }
    }
    private _resolveTargetWarEventId(): ExpressionParsers_Results_Num.Num {
        const data = this._woContainer?.getWoSystemCallWarEvent();
        return new ExpressionParsers_Results_Num.Num(this.getWar(), data ? data.getWarEventId() : -2);
    }
    private _resolveTargetPlayerIndex(): ExpressionParsers_Results_Num.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        {
            const operation = container.getWoSystemDestroyPlayerForce();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getTargetPlayerIndex() ?? 0);
            }
        }
        {
            const operation = container.getWoPlayerSurrender();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPlayerIndex() ?? 0);
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, -2);
    }
    private _resolveAgreeToDraw(): ExpressionParsers_Results_Num.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        {
            const operation = container.getWoSystemVoteForDraw();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getIsAgree() ? 1 : 0);
            }
        }

        {
            const operation = container.getWoPlayerVoteForDraw();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getIsAgree() ? 1 : 0);
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, -2);
    }
    private _resolveTargetPosition(): ExpressionParsers_Results_Position.Position {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_Position.Position(war, -2, -2);
        }

        {
            const operation = container.getWoPlayerProduceUnit();
            if (operation) {
                const gridIndex = operation.getGridIndex();
                return new ExpressionParsers_Results_Position.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoPlayerDeleteUnit();
            if (operation) {
                const gridIndex = operation.getGridIndex();
                return new ExpressionParsers_Results_Position.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new ExpressionParsers_Results_Position.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new ExpressionParsers_Results_Position.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new ExpressionParsers_Results_Position.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                const gridIndex = operation.getTargetGridIndex();
                return new ExpressionParsers_Results_Position.Position(war, gridIndex?.getX() ?? 0, gridIndex?.getY() ?? 0);
            }
        }

        return new ExpressionParsers_Results_Position.Position(war, -2, -2);
    }
    private _resolveTargetUnitHp(): ExpressionParsers_Results_Num.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        {
            const operation = container.getWoPlayerProduceUnit();
            if (operation) {
                const hp = operation.getUnitHp();
                if (hp != null) {
                    return new ExpressionParsers_Results_Num.Num(war, hp);
                } else {
                    return new ExpressionParsers_Results_Num.Num(war, war.getGcData().getUnitTemplateCfg(operation.getUnitType() ?? 0)?.getMaxHp() ?? 0);
                }
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, -2);
    }
    private _resolveTargetUnitType(): ExpressionParsers_Results_Num.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        {
            const operation = container.getWoPlayerProduceUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getUnitType() ?? 0);
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, -2);
    }
    private _resolveTargetCoSkillType(): ExpressionParsers_Results_Num.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        } else if (container.getWoPlayerUseCoSkill()) {
            return new ExpressionParsers_Results_Num.Num(war, container.getWoPlayerUseCoSkill()?.getSkillType() ?? 0);
        } else if (container.getWoUnitUseCoSkill()) {
            return new ExpressionParsers_Results_Num.Num(war, container.getWoUnitUseCoSkill()?.getSkillType() ?? 0);
        } else {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }
    }
    private _resolveTargetPositionArray(): ExpressionParsers_Results_PositionArray.PositionArray {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_PositionArray.PositionArray(war, []);
        }

        {
            const operation = container.getWoPlayerUseCoSkill();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(
                    war,
                    operation.getTargetGridIndexArray().map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)),
                );
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(
                    war,
                    operation.getDropDestinations().map(v => new ExpressionParsers_Results_Position.Position(war, v.getGridIndex()?.getX() ?? 0, v.getGridIndex()?.getY() ?? 0)),
                );
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(
                    war,
                    operation.getTargetGridIndexArray().map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)),
                );
            }
        }

        return new ExpressionParsers_Results_PositionArray.PositionArray(war, []);
    }
    private _resolveUnitMovePath(): ExpressionParsers_Results_PositionArray.PositionArray {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_PositionArray.PositionArray(war, []);
        }

        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitBeLoaded();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitBoardedByCo();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitBuildTile();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitCaptureTile();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitCrushUnit();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitDive();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitJoinUnit();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitProduceUnit();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitRepairUnit();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitSelfDetonate();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitSupplyUnit();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitSurface();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }
        {
            const operation = container.getWoUnitWait();
            if (operation) {
                return new ExpressionParsers_Results_PositionArray.PositionArray(war, operation.getPath()?.getNodes()?.map(v => new ExpressionParsers_Results_Position.Position(war, v.getX() ?? 0, v.getY() ?? 0)) ?? []);
            }
        }

        return new ExpressionParsers_Results_PositionArray.PositionArray(war, []);
    }
    private _resolveIsUnitMovePathBlocked(): ExpressionParsers_Results_Num.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitBeLoaded();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitBoardedByCo();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitBuildTile();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitCaptureTile();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitCrushUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitDive();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitJoinUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitProduceUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitRepairUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitSelfDetonate();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitSupplyUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitSurface();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }
        {
            const operation = container.getWoUnitWait();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getPath()?.getIsBlocked() ? 1 : 0);
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, -2);
    }
    private _resolveLaunchedUnitId(): ExpressionParsers_Results_Num.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        {
            const operation = container.getWoUnitAttackTile();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitAttackUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitBeLoaded();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitBoardedByCo();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitBuildTile();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitCaptureTile();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitCrushUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitDive();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitJoinUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitLaunchFlare();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitLaunchSilo();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitProduceUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitRepairUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitSelfDetonate();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitSupplyUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitSurface();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitUseCoSkill();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }
        {
            const operation = container.getWoUnitWait();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getLaunchUnitId() ?? -1);
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, -2);
    }
    private _resolveIsDerivedActionBlocked(): ExpressionParsers_Results_Num.Num {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsers_Results_Num.Num(war, operation.getIsDropBlocked() ? 1 : 0);
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, -2);
    }
    private _resolveTargetUnitIdArray(): ExpressionParsers_Results_NumArray.NumArray {
        const container = this._woContainer;
        const war       = this.getWar();
        if (container == null) {
            return new ExpressionParsers_Results_NumArray.NumArray(war, []);
        }

        {
            const operation = container.getWoUnitDropUnit();
            if (operation) {
                return new ExpressionParsers_Results_NumArray.NumArray(war, operation.getDropDestinations().map(v => v.getUnitId() ?? 0));
            }
        }

        return new ExpressionParsers_Results_NumArray.NumArray(war, []);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const war = this.getWar();
        switch (identifierName) {
            default                         : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
}

function getWarOperationType(woContainer: WoContainer): WarOperations_Constants.OperationTypeId | null {
    if      (woContainer.getWoSystemBeginTurn())            { return WarOperations_Constants.OperationTypeId.SystemBeginTurn; }
    else if (woContainer.getWoSystemCallWarEvent())         { return WarOperations_Constants.OperationTypeId.SystemCallWarEvent; }
    else if (woContainer.getWoSystemDestroyPlayerForce())   { return WarOperations_Constants.OperationTypeId.SystemDestroyPlayerForce; }
    else if (woContainer.getWoSystemEndTurn())              { return WarOperations_Constants.OperationTypeId.SystemEndTurn; }
    else if (woContainer.getWoSystemEndWar())               { return WarOperations_Constants.OperationTypeId.SystemEndWar; }
    else if (woContainer.getWoSystemHandleBootPlayer())     { return WarOperations_Constants.OperationTypeId.SystemHandleBootPlayer; }
    else if (woContainer.getWoSystemVoteForDraw())          { return WarOperations_Constants.OperationTypeId.SystemVoteForDraw; }
    else if (woContainer.getWoPlayerDeleteUnit())           { return WarOperations_Constants.OperationTypeId.PlayerDeleteUnit; }
    else if (woContainer.getWoPlayerEndTurn())              { return WarOperations_Constants.OperationTypeId.PlayerEndTurn; }
    else if (woContainer.getWoPlayerProduceUnit())          { return WarOperations_Constants.OperationTypeId.PlayerProduceUnit; }
    else if (woContainer.getWoPlayerSurrender())            { return WarOperations_Constants.OperationTypeId.PlayerSurrender; }
    else if (woContainer.getWoPlayerUseCoSkill())           { return WarOperations_Constants.OperationTypeId.PlayerUseCoSkill; }
    else if (woContainer.getWoPlayerVoteForDraw())          { return WarOperations_Constants.OperationTypeId.PlayerVoteForDraw; }
    else if (woContainer.getWoUnitAttackTile())             { return WarOperations_Constants.OperationTypeId.UnitAttackTile; }
    else if (woContainer.getWoUnitAttackUnit())             { return WarOperations_Constants.OperationTypeId.UnitAttackUnit; }
    else if (woContainer.getWoUnitBeLoaded())               { return WarOperations_Constants.OperationTypeId.UnitBeLoaded; }
    else if (woContainer.getWoUnitBoardedByCo())            { return WarOperations_Constants.OperationTypeId.UnitBoardedByCo; }
    else if (woContainer.getWoUnitBuildTile())              { return WarOperations_Constants.OperationTypeId.UnitBuildTile; }
    else if (woContainer.getWoUnitCaptureTile())            { return WarOperations_Constants.OperationTypeId.UnitCaptureTile; }
    else if (woContainer.getWoUnitCrushUnit())              { return WarOperations_Constants.OperationTypeId.UnitCrushUnit; }
    else if (woContainer.getWoUnitDive())                   { return WarOperations_Constants.OperationTypeId.UnitDive; }
    else if (woContainer.getWoUnitDropUnit())               { return WarOperations_Constants.OperationTypeId.UnitDropUnit; }
    else if (woContainer.getWoUnitJoinUnit())               { return WarOperations_Constants.OperationTypeId.UnitJoinUnit; }
    else if (woContainer.getWoUnitLaunchFlare())            { return WarOperations_Constants.OperationTypeId.UnitLaunchFlare; }
    else if (woContainer.getWoUnitLaunchSilo())             { return WarOperations_Constants.OperationTypeId.UnitLaunchSilo; }
    else if (woContainer.getWoUnitProduceUnit())            { return WarOperations_Constants.OperationTypeId.UnitProduceUnit; }
    else if (woContainer.getWoUnitRepairUnit())             { return WarOperations_Constants.OperationTypeId.UnitRepairUnit; }
    else if (woContainer.getWoUnitSelfDetonate())           { return WarOperations_Constants.OperationTypeId.UnitSelfDetonate; }
    else if (woContainer.getWoUnitSupplyUnit())             { return WarOperations_Constants.OperationTypeId.UnitSupplyUnit; }
    else if (woContainer.getWoUnitSurface())                { return WarOperations_Constants.OperationTypeId.UnitSurface; }
    else if (woContainer.getWoUnitUseCoSkill())             { return WarOperations_Constants.OperationTypeId.UnitUseCoSkill; }
    else if (woContainer.getWoUnitWait())                   { return WarOperations_Constants.OperationTypeId.UnitWait; }
    else                                                    { return null; }
}
