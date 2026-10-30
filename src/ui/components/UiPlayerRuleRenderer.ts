import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CategoryId } from "../../cos/Constants.ts";
import { getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { newError } from "../../helpers/Misc.ts";
import { getTextColor } from "../../helpers/Text.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getPlayerRuleName,
    getPlayerTeamName,
    getUnitAndTileSkinName,
} from "../../lang/Utils.ts";
import type { RuleEditor_PlayerRuleChanged } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import {
    RuleTypeId,
    InitialFund,
    MaxUnitsCount,
    IncomeMultiplier,
    EnergyAddPctOnCoBoard,
    EnergyLossPctOnCoDie,
    EnergyGrowthMultiplier,
    MoveRangeModifier,
    UnitVisionRangeModifier,
    TileVisionRangeModifier,
    AttackPowerModifier,
    DefenseModifier,
    Luck,
} from "../../playerRules/Constants.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { WarRuleCommonData } from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import { UiListItemRenderer } from "./UiListItemRenderer.ts";
import type { IUiLabel } from "../interfaces/IUiLabel.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export interface DataForUiPlayerRuleRenderer extends UiListItemData {
    canModify               : boolean;
    gcData                  : GameConfig;
    gameModeId              : Undefinable<ModeId>;
    instanceWarRule         : Undefinable<InstanceWarRule>;
    warRuleCommonData       : WarRuleCommonData;
    playerRule              : PlayerRule;
    playerRuleType          : RuleTypeId;
    getIsBatch              : () => boolean;
}
export class UiPlayerRuleRenderer extends UiListItemRenderer<DataForUiPlayerRuleRenderer> {
    private readonly _labelValue!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.RuleEditor_PlayerRuleChanged, callback: this._onNotifyMePlayerRuleChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        this._callbackOnTap();
    }
    private _onNotifyMePlayerRuleChanged(e: Event): void {
        const eventData = e.data as RuleEditor_PlayerRuleChanged;
        const data      = this.getOpenData();
        if ((eventData.playerIndex === data?.playerRule.getPlayerIndex()) &&
            (data.playerRuleType === data.playerRuleType)
        ) {
            this._updateView();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _callbackOnTap(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerRuleType = openData.playerRuleType;
        switch (playerRuleType) {
            case RuleTypeId.TeamIndex                       : return this._onTapAsTeamIndex(openData);
            case RuleTypeId.BannedCoCategoryIdArray         : return this._onTapAsBannedCoCategoryIdArray(openData);
            case RuleTypeId.BannedUnitTypeArray             : return this._onTapAsBannedUnitTypeArray(openData);
            case RuleTypeId.InitialFund                     : return this._onTapAsInitialFund(openData);
            case RuleTypeId.IncomeMultiplier                : return this._onTapAsIncomeMultiplier(openData);
            case RuleTypeId.MaxUnitsCount                   : return this._onTapAsMaxUnitsCount(openData);
            case RuleTypeId.EnergyAddPctOnCoBoard           : return this._onTapAsEnergyAddPctOnCoBoard(openData);
            case RuleTypeId.EnergyLossPctOnCoDie            : return this._onTapAsEnergyLossPctOnCoDie(openData);
            case RuleTypeId.EnergyGrowthMultiplier          : return this._onTapAsEnergyGrowthMultiplier(openData);
            case RuleTypeId.CanActivateCoSkill              : return this._onTapAsCanActivateCoSkill(openData);
            case RuleTypeId.CanCoBoard                      : return this._onTapAsCanCoBoard(openData);
            case RuleTypeId.CanUnitJoin                     : return this._onTapAsCanUnitJoin(openData);
            case RuleTypeId.MoveRangeModifier               : return this._onTapAsMoveRangeModifier(openData);
            case RuleTypeId.UnitVisionRangeModifier         : return this._onTapAsUnitVisionRangeModifier(openData);
            case RuleTypeId.TileVisionRangeModifier         : return this._onTapAsTileVisionRangeModifier(openData);
            case RuleTypeId.McwHumanCoCategoryIdArray       : return this._onTapAsMcwHumanCoCategoryIdArray(openData);
            case RuleTypeId.MmwHumanCoCategoryIdArray       : return this._onTapAsMmwHumanCoCategoryIdArray(openData);
            case RuleTypeId.MrwHumanCoCategoryIdArray       : return this._onTapAsMrwHumanCoCategoryIdArray(openData);
            case RuleTypeId.AtwHumanCoCategoryIdArray       : return this._onTapAsAtwHumanCoCategoryIdArray(openData);
            case RuleTypeId.CcwHumanCoCategoryIdArray       : return this._onTapAsCcwHumanCoCategoryIdArray(openData);
            case RuleTypeId.WarRoomHumanCoCategoryIdArray   : return this._onTapAsWarRoomHumanCoCategoryIdArray(openData);
            case RuleTypeId.CampaignHumanCoIdArray          : return this._onTapAsCampaignHumanCoIdArray(openData);
            case RuleTypeId.CcwAiCoId                       : return this._onTapAsCcwAiCoId(openData);
            case RuleTypeId.WarRoomAiCoId                   : return this._onTapAsWarRoomAiCoId(openData);
            case RuleTypeId.CampaignAiCoId                  : return this._onTapAsCampaignAiCoId(openData);
            case RuleTypeId.CampaignSkinId                  : return this._onTapAsCampaignSkinId(openData);
            case RuleTypeId.AttackPowerModifier             : return this._onTapAsAttackPowerModifier(openData);
            case RuleTypeId.DefenseModifier                 : return this._onTapAsDefenseModifier(openData);
            case RuleTypeId.LuckLowerLimit                  : return this._onTapAsLuckLowerLimit(openData);
            case RuleTypeId.LuckUpperLimit                  : return this._onTapAsLuckUpperLimit(openData);
            default                                             : throw newError(`Unknown ruleType: ${playerRuleType}`);
        }
    }
    private _onTapAsTeamIndex(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule = openData.playerRule;
        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            playerRule.setTeamIndex(playerRule.getTeamIndex() % openData.warRuleCommonData.getPlayerRuleList().length + 1);

            dispatch(
                TypeId.RuleEditor_PlayerRuleChanged,
                { playerIndex: playerRule.getPlayerIndex(), ruleType: openData.playerRuleType } as RuleEditor_PlayerRuleChanged
            );
        });
    }
    private _onTapAsBannedCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule                        = openData.playerRule;
        const gcData                            = openData.gcData;
        const gameModeId                        = openData.gameModeId;
        const currentBannedCoCategoryIdArray    = playerRule.getBannedCoCategoryIdArray();
        const availableCoCategoryIdArray        = gameModeId == null
            ? gcData.getAllEnabledCoCategoryIdArray()
            : gcData.getEnabledCoCategoryIdArrayByGameModeId(gameModeId);

        if (!openData.canModify) {
            openPanel(getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : availableCoCategoryIdArray,
                currentCoCategoryIdArray        : currentBannedCoCategoryIdArray,
                isBan                           : true,
                getTitleText                    : () => getText(TextType.B0590),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : availableCoCategoryIdArray,
                currentCoCategoryIdArray        : currentBannedCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : true,
                getTitleText                    : () => getText(TextType.B0590),
                callbackOnConfirm               : bannedCoCategoryIdArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setBannedCoCategoryIdArray(bannedCoCategoryIdArray);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setBannedCoCategoryIdArray(bannedCoCategoryIdArray);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsBannedUnitTypeArray(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule                    = openData.playerRule;
        const gcData                        = openData.gcData;
        const availableUnitTypeArray        = gcData.getAllUnitTypeArray();
        const currentBannedUnitTypeArray    = playerRule.getBannedUnitTypeArray();

        if (!openData.canModify) {
            openPanel(getDict().CommonShowUnitTypePanel, {
                gameConfig                  : gcData,
                availableUnitTypeArray      : availableUnitTypeArray,
                currentUnitTypeArray        : currentBannedUnitTypeArray,
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiUnitTypePanel, {
                currentUnitTypeArray    : currentBannedUnitTypeArray,
                availableUnitTypeArray  : availableUnitTypeArray,
                gameConfig              : gcData,
                callbackOnConfirm       : bannedUnitTypeArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setBannedUnitTypeArray(bannedUnitTypeArray);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setBannedUnitTypeArray(bannedUnitTypeArray);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsInitialFund(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : InitialFund.MaxLimit,
                minValue        : InitialFund.MinLimit,
                currentValue    : playerRule.getInitialFund(),
                callback        : value => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setInitialFund(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setInitialFund(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsMaxUnitsCount(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule        = openData.playerRule;
        const playerRuleType    = openData.playerRuleType;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getPlayerRuleName(playerRuleType) ?? UndefinedError,
                maxValue        : MaxUnitsCount.MaxLimit,
                minValue        : MaxUnitsCount.MinLimit,
                currentValue    : playerRule.getMaxUnitsCount(),
                callback        : value => {
                    if (!openData.getIsBatch()) {
                        playerRule.setMaxUnitsCount(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMaxUnitsCount(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsIncomeMultiplier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : IncomeMultiplier.MaxLimit,
                minValue        : IncomeMultiplier.MinLimit,
                currentValue    : playerRule.getIncomeMultiplier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setIncomeMultiplier(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setIncomeMultiplier(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsEnergyAddPctOnCoBoard(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : EnergyAddPctOnCoBoard.MaxLimit,
                minValue        : EnergyAddPctOnCoBoard.MinLimit,
                currentValue    : playerRule.getEnergyAddPctOnCoBoard(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setEnergyAddPctOnCoBoard(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setEnergyAddPctOnCoBoard(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsEnergyLossPctOnCoDie(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : EnergyLossPctOnCoDie.MaxLimit,
                minValue        : EnergyLossPctOnCoDie.MinLimit,
                currentValue    : playerRule.getEnergyLossPctOnCoDie(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setEnergyLossPctOnCoDie(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of  openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setEnergyLossPctOnCoDie(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsEnergyGrowthMultiplier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : EnergyGrowthMultiplier.MaxLimit,
                minValue        : EnergyGrowthMultiplier.MinLimit,
                currentValue    : playerRule.getEnergyGrowthMultiplier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setEnergyGrowthMultiplier(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setEnergyGrowthMultiplier(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsCanActivateCoSkill(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule            = openData.playerRule;
        const canActivateCoSkill    = playerRule.getCanActivateCoSkill();

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            const ruleType = openData.playerRuleType;
            if (!openData.getIsBatch()) {
                playerRule.setCanActivateCoSkill(!canActivateCoSkill);
                dispatch(
                    TypeId.RuleEditor_PlayerRuleChanged,
                    { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                );
            } else {
                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                    p.setCanActivateCoSkill(!canActivateCoSkill);
                    dispatch(
                        TypeId.RuleEditor_PlayerRuleChanged,
                        { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                    );
                }
            }
        });
    }
    private _onTapAsCanCoBoard(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule        = openData.playerRule;
        const canCoBoard        = playerRule.getCanCoBoard();

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            const ruleType = openData.playerRuleType;
            if (!openData.getIsBatch()) {
                playerRule.setCanCoBoard(!canCoBoard);
                dispatch(
                    TypeId.RuleEditor_PlayerRuleChanged,
                    { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                );
            } else {
                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                    p.setCanCoBoard(!canCoBoard);
                    dispatch(
                        TypeId.RuleEditor_PlayerRuleChanged,
                        { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                    );
                }
            }
        });
    }
    private _onTapAsCanUnitJoin(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;
        const canUnitJoin   = playerRule.getCanUnitJoin();

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            const ruleType = openData.playerRuleType;
            if (!openData.getIsBatch()) {
                playerRule.setCanUnitJoin(!canUnitJoin);
                dispatch(
                    TypeId.RuleEditor_PlayerRuleChanged,
                    { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                );
            } else {
                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                    p.setCanUnitJoin(!canUnitJoin);
                    dispatch(
                        TypeId.RuleEditor_PlayerRuleChanged,
                        { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                    );
                }
            }
        });
    }
    private _onTapAsMoveRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : MoveRangeModifier.MaxLimit,
                minValue        : MoveRangeModifier.MinLimit,
                currentValue    : playerRule.getMoveRangeModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMoveRangeModifier(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMoveRangeModifier(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsUnitVisionRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule        = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : UnitVisionRangeModifier.MaxLimit,
                minValue        : UnitVisionRangeModifier.MinLimit,
                currentValue    : playerRule.getUnitVisionRangeModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setUnitVisionRangeModifier(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setUnitVisionRangeModifier(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsTileVisionRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule        = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : TileVisionRangeModifier.MaxLimit,
                minValue        : TileVisionRangeModifier.MinLimit,
                currentValue    : playerRule.getTileVisionRangeModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setTileVisionRangeModifier(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setTileVisionRangeModifier(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsMcwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const gcData                        = openData.gcData;
        const playerRule                    = openData.playerRule;
        const gameModeId                    = openData.gameModeId;
        const currentHumanCoCategoryIdArray = playerRule.getMcwHumanCoCategoryIdArray();
        const allCoCategoryIdArray          = gameModeId == null
            ? gcData.getAllEnabledCoCategoryIdArray()
            : gcData.getEnabledCoCategoryIdArrayByGameModeId(gameModeId);

        if (!openData.canModify) {
            openPanel(getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsMmwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const gcData                        = openData.gcData;
        const playerRule                    = openData.playerRule;
        const gameModeId                    = openData.gameModeId;
        const currentHumanCoCategoryIdArray = playerRule.getMmwHumanCoCategoryIdArray();
        const allCoCategoryIdArray          = gameModeId == null
            ? gcData.getAllEnabledCoCategoryIdArray()
            : gcData.getEnabledCoCategoryIdArrayByGameModeId(gameModeId);

        if (!openData.canModify) {
            openPanel(getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMmwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMmwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsMrwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const gcData                        = openData.gcData;
        const playerRule                    = openData.playerRule;
        const gameModeId                    = openData.gameModeId;
        const currentHumanCoCategoryIdArray = playerRule.getMrwHumanCoCategoryIdArray();
        const allCoCategoryIdArray          = gameModeId == null
            ? gcData.getAllEnabledCoCategoryIdArray()
            : gcData.getEnabledCoCategoryIdArrayByGameModeId(gameModeId);

        if (!openData.canModify) {
            openPanel(getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsAtwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const gcData                        = openData.gcData;
        const playerRule                    = openData.playerRule;
        const gameModeId                    = openData.gameModeId;
        const currentHumanCoCategoryIdArray = playerRule.getAtwHumanCoCategoryIdArray();
        const allCoCategoryIdArray          = gameModeId == null
            ? gcData.getAllEnabledCoCategoryIdArray()
            : gcData.getEnabledCoCategoryIdArrayByGameModeId(gameModeId);

        if (!openData.canModify) {
            openPanel(getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setAtwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setAtwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsCcwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const gcData                        = openData.gcData;
        const playerRule                    = openData.playerRule;
        const gameModeId                    = openData.gameModeId;
        const currentHumanCoCategoryIdArray = playerRule.getCcwHumanCoCategoryIdArray();
        const allCoCategoryIdArray          = gameModeId == null
            ? gcData.getAllEnabledCoCategoryIdArray()
            : gcData.getEnabledCoCategoryIdArrayByGameModeId(gameModeId);

        if (!openData.canModify) {
            openPanel(getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setCcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsWarRoomHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const gcData                        = openData.gcData;
        const playerRule                    = openData.playerRule;
        const currentHumanCoCategoryIdArray = playerRule.getSrwHumanCoCategoryIdArray();
        const allCoCategoryIdArray          = gcData.getEnabledCoArrayByGameModeId(ModeId.WarRoom)
            .filter(v => v.getCoCategoryId() !== CategoryId.Random).map(v => v.getCoCategoryId());

        if (!openData.canModify) {
            openPanel(getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => getText(TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setSrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setSrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsCampaignHumanCoIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const gcData                = openData.gcData;
        const playerRule            = openData.playerRule;
        const currentHumanCoIdArray = playerRule.getCampaignHumanCoIdArray();
        const allCoIdArray          = gcData.getEnabledCoArrayByGameModeId(ModeId.SingleCampaign)
            .filter(v => v.getCoCategoryId() !== CategoryId.Random).map(v => v.getCoId());

        if (!openData.canModify) {
            openPanel(getDict().CommonShowCoIdPanel, {
                gameConfig          : gcData,
                availableCoIdArray  : allCoIdArray,
                currentCoIdArray    : currentHumanCoIdArray,
                isBan               : false,
                getTitleText        : () => getText(TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiCoIdPanel, {
                gameConfig          : gcData,
                availableCoIdArray  : allCoIdArray,
                currentCoIdArray    : currentHumanCoIdArray,
                minChooseCount      : null,
                maxChooseCount      : null,
                isBan               : false,
                callbackOnConfirm   : newHumanCoIdArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setCampaignHumanCoIdArray(newHumanCoIdArray);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCampaignHumanCoIdArray(newHumanCoIdArray);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsCcwAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const gcData            = openData.gcData;
        const playerRule        = openData.playerRule;
        const playerRuleType    = openData.playerRuleType;
        const playerIndex       = playerRule.getPlayerIndex();

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0808),
                getTextForConfirm   : () => getText(TextType.Yes),
                getTextForCancel    : () => getText(TextType.No),
                showButtonClose     : true,
                callback            : () => {
                    openPanel(getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig          : gcData,
                        currentCoId         : playerRule.getCcwAiCoId() ?? null,
                        availableCoIdArray  : gcData.getEnabledCoArrayForAi().filter(v => v.getCoCategoryId() !== CategoryId.Random).map(v => v.getCoId()),
                        isBan               : false,
                        callbackOnConfirm   : newCoId => {
                            if (!openData.getIsBatch()) {
                                playerRule.setCcwAiCoId(newCoId);
                                dispatch(
                                    TypeId.RuleEditor_PlayerRuleChanged,
                                    { playerIndex: playerIndex, ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                                );
                            } else {
                                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                                    p.setCcwAiCoId(newCoId);
                                    dispatch(
                                        TypeId.RuleEditor_PlayerRuleChanged,
                                        { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                                    );
                                }
                            }
                        },
                    });
                },
                callbackOnCancel    : () => {
                    if (!openData.getIsBatch()) {
                        playerRule.setCcwAiCoId(null);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerIndex, ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCcwAiCoId(null);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                }
            });
        });
    }
    private _onTapAsWarRoomAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const gcData            = openData.gcData;
        const playerRule        = openData.playerRule;
        const playerRuleType    = openData.playerRuleType;
        const playerIndex       = playerRule.getPlayerIndex();

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0808),
                getTextForConfirm   : () => getText(TextType.Yes),
                getTextForCancel    : () => getText(TextType.No),
                showButtonClose     : true,
                callback            : () => {
                    openPanel(getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig          : gcData,
                        currentCoId         : playerRule.getSrwAiCoId() ?? null,
                        availableCoIdArray  : gcData.getEnabledCoArrayForAi().filter(v => v.getCoCategoryId() !== CategoryId.Random).map(v => v.getCoId()),
                        isBan               : false,
                        callbackOnConfirm   : newCoId => {
                            if (!openData.getIsBatch()) {
                                playerRule.setSrwAiCoId(newCoId);
                                dispatch(
                                    TypeId.RuleEditor_PlayerRuleChanged,
                                    { playerIndex: playerIndex, ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                                );
                            } else {
                                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                                    p.setSrwAiCoId(newCoId);
                                    dispatch(
                                        TypeId.RuleEditor_PlayerRuleChanged,
                                        { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                                    );
                                }
                            }
                        },
                    });
                },
                callbackOnCancel    : () => {
                    if (!openData.getIsBatch()) {
                        playerRule.setSrwAiCoId(null);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerIndex, ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setSrwAiCoId(null);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                }
            });
        });
    }
    private _onTapAsCampaignAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const gcData        = openData.gcData;
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseMultiCoIdPanel, {
                gameConfig          : gcData,
                currentCoIdArray    : getNonNullElements([playerRule.getCampaignAiCoId()]),
                availableCoIdArray  : gcData.getEnabledCoArrayForAi().filter(v => v.getCoCategoryId() !== CategoryId.Random).map(v => v.getCoId()),
                minChooseCount      : null,
                maxChooseCount      : 1,
                isBan               : false,
                callbackOnConfirm   : newCoIdArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setCampaignAiCoId(newCoIdArray[0]);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCampaignAiCoId(newCoIdArray[0]);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsCampaignSkinId(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonChooseSingleSkinIdPanel, {
                currentSkinId           : playerRule.getCampaignSkinId() ?? null,
                availableSkinIdArray    : getAllSkinIdArray(false),
                callback                : newSkinId => {
                    const ruleType = openData.playerRuleType;
                    playerRule.setCampaignSkinId(newSkinId);
                    dispatch(
                        TypeId.RuleEditor_PlayerRuleChanged,
                        { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                    );
                },
            });
        });
    }
    private _onTapAsAttackPowerModifier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : AttackPowerModifier.MaxLimit,
                minValue        : AttackPowerModifier.MinLimit,
                currentValue    : playerRule.getAttackPowerModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setAttackPowerModifier(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setAttackPowerModifier(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsDefenseModifier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : DefenseModifier.MaxLimit,
                minValue        : DefenseModifier.MinLimit,
                currentValue    : playerRule.getDefenseModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setDefenseModifier(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setDefenseModifier(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsLuckLowerLimit(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : Math.min(Luck.MaxLimit, playerRule.getLuckUpperLimit()),
                minValue        : Luck.MinLimit,
                currentValue    : playerRule.getLuckLowerLimit(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setLuckLowerLimit(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setLuckLowerLimit(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsLuckUpperLimit(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule        = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getPlayerRuleName(openData.playerRuleType) ?? UndefinedError,
                maxValue        : Luck.MaxLimit,
                minValue        : Math.max(Luck.MinLimit, playerRule.getLuckLowerLimit()),
                currentValue    : playerRule.getLuckUpperLimit(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setLuckUpperLimit(value);
                        dispatch(
                            TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setLuckUpperLimit(value);
                            dispatch(
                                TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as RuleEditor_PlayerRuleChanged
                            );
                        }
                    }
                },
            });
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            this._labelValue.setText("");
            this._applySettingsForWholeTouch(false);
            return;
        }

        const playerRuleType = openData.playerRuleType;
        switch (playerRuleType) {
            case RuleTypeId.TeamIndex                       : return this._updateViewAsTeamIndex(openData);
            case RuleTypeId.BannedCoCategoryIdArray         : return this._updateViewAsBannedCoCategoryIdArray(openData);
            case RuleTypeId.BannedUnitTypeArray             : return this._updateViewAsBannedUnitTypeArray(openData);
            case RuleTypeId.InitialFund                     : return this._updateViewAsInitialFund(openData);
            case RuleTypeId.IncomeMultiplier                : return this._updateViewAsIncomeMultiplier(openData);
            case RuleTypeId.MaxUnitsCount                   : return this._updateViewAsMaxUnitsCount(openData);
            case RuleTypeId.EnergyAddPctOnCoBoard           : return this._updateViewAsEnergyAddPctOnCoBoard(openData);
            case RuleTypeId.EnergyLossPctOnCoDie            : return this._updateViewAsEnergyLossPctOnCoDie(openData);
            case RuleTypeId.EnergyGrowthMultiplier          : return this._updateViewAsEnergyGrowthMultiplier(openData);
            case RuleTypeId.CanActivateCoSkill              : return this._updateViewAsCanActivateCoSkill(openData);
            case RuleTypeId.CanCoBoard                      : return this._updateViewAsCanCoBoard(openData);
            case RuleTypeId.CanUnitJoin                     : return this._updateViewAsCanUnitJoin(openData);
            case RuleTypeId.MoveRangeModifier               : return this._updateViewAsMoveRangeModifier(openData);
            case RuleTypeId.UnitVisionRangeModifier         : return this._updateViewAsUnitVisionRangeModifier(openData);
            case RuleTypeId.TileVisionRangeModifier         : return this._updateViewAsTileVisionRangeModifier(openData);
            case RuleTypeId.McwHumanCoCategoryIdArray       : return this._updateViewAsMcwHumanCoCategoryIdArray(openData);
            case RuleTypeId.MmwHumanCoCategoryIdArray       : return this._updateViewAsMmwHumanCoCategoryIdArray(openData);
            case RuleTypeId.MrwHumanCoCategoryIdArray       : return this._updateViewAsMrwHumanCoCategoryIdArray(openData);
            case RuleTypeId.AtwHumanCoCategoryIdArray       : return this._updateViewAsAtwHumanCoCategoryIdArray(openData);
            case RuleTypeId.CcwHumanCoCategoryIdArray       : return this._updateViewAsCcwHumanCoCategoryIdArray(openData);
            case RuleTypeId.WarRoomHumanCoCategoryIdArray   : return this._updateViewAsWarRoomHumanCoCategoryIdArray(openData);
            case RuleTypeId.CampaignHumanCoIdArray          : return this._updateViewAsCampaignHumanCoIdArray(openData);
            case RuleTypeId.CcwAiCoId                       : return this._updateViewAsCcwAiCoId(openData);
            case RuleTypeId.WarRoomAiCoId                   : return this._updateViewAsWarRoomAiCoId(openData);
            case RuleTypeId.CampaignAiCoId                  : return this._updateViewAsCampaignAiCoId(openData);
            case RuleTypeId.CampaignSkinId                  : return this._updateViewAsCampaignSkinId(openData);
            case RuleTypeId.AttackPowerModifier             : return this._updateViewAsAttackPowerModifier(openData);
            case RuleTypeId.DefenseModifier                 : return this._updateViewAsDefenseModifier(openData);
            case RuleTypeId.LuckLowerLimit                  : return this._updateViewAsLuckLowerLimit(openData);
            case RuleTypeId.LuckUpperLimit                  : return this._updateViewAsLuckUpperLimit(openData);
            default                                             : throw newError(`Unknown ruleType: ${playerRuleType}`);
        }
    }
    private _updateViewAsTeamIndex(openData: DataForUiPlayerRuleRenderer): void {
        const label = this._labelValue;
        label.setText(getPlayerTeamName(openData.playerRule.getTeamIndex()) ?? UndefinedError);
        label.setTextColor(ColorValue.White);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsBannedCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const label     = this._labelValue;
        const currValue = openData.playerRule.getBannedCoCategoryIdArray().length;
        label.setText(`${currValue}`);
        label.setTextColor(currValue <= 0 ? ColorValue.White : ColorValue.Red);

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsBannedUnitTypeArray(openData: DataForUiPlayerRuleRenderer): void {
        const label     = this._labelValue;
        const currValue = openData.playerRule.getBannedUnitTypeArray().length;
        label.setText(`${currValue}`);
        label.setTextColor(currValue <= 0 ? ColorValue.White : ColorValue.Red);

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsInitialFund(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getInitialFund();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, InitialFund.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsIncomeMultiplier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getIncomeMultiplier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, IncomeMultiplier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsMaxUnitsCount(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getMaxUnitsCount();
        const label         = this._labelValue;
        label.setText(`${currValue ?? `--`}`);
        label.setTextColor(currValue == null ? ColorValue.White : ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsEnergyAddPctOnCoBoard(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getEnergyAddPctOnCoBoard();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, EnergyAddPctOnCoBoard.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsEnergyLossPctOnCoDie(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getEnergyLossPctOnCoDie();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, EnergyLossPctOnCoDie.Default, true));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsEnergyGrowthMultiplier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getEnergyGrowthMultiplier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, EnergyGrowthMultiplier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCanActivateCoSkill(openData: DataForUiPlayerRuleRenderer): void {
        const canActivateCoSkill    = openData.playerRule.getCanActivateCoSkill();
        const label                 = this._labelValue;
        label.setLangText(canActivateCoSkill ? TextType.Yes : TextType.No);
        label.setTextColor(canActivateCoSkill ? ColorValue.White : ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCanCoBoard(openData: DataForUiPlayerRuleRenderer): void {
        const canCoBoard    = openData.playerRule.getCanCoBoard();
        const label         = this._labelValue;
        label.setLangText(canCoBoard ? TextType.Yes : TextType.No);
        label.setTextColor(canCoBoard ? ColorValue.White : ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCanUnitJoin(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getCanUnitJoin();
        const label         = this._labelValue;
        label.setLangText(currValue ? TextType.Yes : TextType.No);
        label.setTextColor(currValue ? ColorValue.White : ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsMoveRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getMoveRangeModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, MoveRangeModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsUnitVisionRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getUnitVisionRangeModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, UnitVisionRangeModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsTileVisionRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getTileVisionRangeModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, TileVisionRangeModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsMcwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getMcwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(TextType.B0120);
            label.setTextColor(ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsMmwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getMmwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(TextType.B0120);
            label.setTextColor(ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsMrwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getMrwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(TextType.B0120);
            label.setTextColor(ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsAtwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getAtwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(TextType.B0120);
            label.setTextColor(ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsCcwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getCcwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(TextType.B0120);
            label.setTextColor(ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsWarRoomHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getSrwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(TextType.B0120);
            label.setTextColor(ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsCampaignHumanCoIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getCampaignHumanCoIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(TextType.B0120);
            label.setTextColor(ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsCcwAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const ccwAiCoId = openData.playerRule.getCcwAiCoId();
        const label     = this._labelValue;
        label.setText(ccwAiCoId == null ? `--` : openData.gcData.getCoNameAndTierText(ccwAiCoId) ?? UndefinedError);
        label.setTextColor(ccwAiCoId == null ? ColorValue.White : ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsWarRoomAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const srwAiCoId = openData.playerRule.getSrwAiCoId();
        const label     = this._labelValue;
        label.setText(srwAiCoId == null ? `--` : openData.gcData.getCoNameAndTierText(srwAiCoId) ?? UndefinedError);
        label.setTextColor(srwAiCoId == null ? ColorValue.White : ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCampaignAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const coId      = openData.playerRule.getCampaignAiCoId();
        const label     = this._labelValue;
        label.setText(coId == null ? `--` : (openData.gcData.getCoNameAndTierText(coId) ?? UndefinedError));
        label.setTextColor(coId == null ? ColorValue.White : ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCampaignSkinId(openData: DataForUiPlayerRuleRenderer): void {
        const skinId    = openData.playerRule.getCampaignSkinId();
        const label     = this._labelValue;
        label.setText(skinId == null ? `--` : (getUnitAndTileSkinName(skinId) ?? UndefinedError));
        label.setTextColor(skinId == null ? ColorValue.White : ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsAttackPowerModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue = openData.playerRule.getAttackPowerModifier();
        const label     = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, AttackPowerModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsDefenseModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getDefenseModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, DefenseModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsLuckLowerLimit(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getLuckLowerLimit();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, Luck.DefaultLowerLimit));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsLuckUpperLimit(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getLuckUpperLimit();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(getTextColor(currValue, openData.gcData.getSystemCfg().getDefaultLuckUpperLimit()));

        this._applySettingsForWholeTouch(openData.canModify);
    }
}

function checkAndSetCustomWarRuleId(instanceWarRule: Undefinable<InstanceWarRule>, callback: () => void): void {
    if ((!instanceWarRule) || (instanceWarRule.getTemplateWarRuleId() == null)) {
        callback();
    } else {
        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.A0129),
            callback    : () => {
                instanceWarRule.setTemplateWarRuleId(null);
                callback();
            },
        });
    }
}
