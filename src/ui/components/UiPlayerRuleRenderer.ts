import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesConstants from "../../playerRules/Constants.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type * as ProtoSchemaCommonProtoWarRulePlayerRule from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type * as ProtoSchemaCommonProtoWarRuleWarRuleCommonData from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";
import * as UiComponentsUiListItemRenderer from "./UiListItemRenderer.ts";
import type * as UiInterfacesIUiLabel from "../interfaces/IUiLabel.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type InstanceWarRule        = ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule;
type PlayerRule             = ProtoSchemaCommonProtoWarRulePlayerRule.PlayerRule;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export interface DataForUiPlayerRuleRenderer extends UiTypesUiListItemData.UiListItemData {
    canModify               : boolean;
    gcData                  : GameConfigGcData.GcData;
    gameModeId              : Undefinable<GameModesConstants.ModeId>;
    instanceWarRule         : Undefinable<InstanceWarRule>;
    warRuleCommonData       : ProtoSchemaCommonProtoWarRuleWarRuleCommonData.WarRuleCommonData;
    playerRule              : PlayerRule;
    playerRuleType          : PlayerRulesConstants.RuleTypeId;
    getIsBatch              : () => boolean;
}
export class UiPlayerRuleRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUiPlayerRuleRenderer> {
    private readonly _labelValue!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged, callback: this._onNotifyMePlayerRuleChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        this._callbackOnTap();
    }
    private _onNotifyMePlayerRuleChanged(e: VendorEgretEgret.Event): void {
        const eventData = e.data as NotificationsDataTypes.RuleEditor_PlayerRuleChanged;
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
            case PlayerRulesConstants.RuleTypeId.TeamIndex                       : return this._onTapAsTeamIndex(openData);
            case PlayerRulesConstants.RuleTypeId.BannedCoCategoryIdArray         : return this._onTapAsBannedCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.BannedUnitTypeArray             : return this._onTapAsBannedUnitTypeArray(openData);
            case PlayerRulesConstants.RuleTypeId.InitialFund                     : return this._onTapAsInitialFund(openData);
            case PlayerRulesConstants.RuleTypeId.IncomeMultiplier                : return this._onTapAsIncomeMultiplier(openData);
            case PlayerRulesConstants.RuleTypeId.MaxUnitsCount                   : return this._onTapAsMaxUnitsCount(openData);
            case PlayerRulesConstants.RuleTypeId.EnergyAddPctOnCoBoard           : return this._onTapAsEnergyAddPctOnCoBoard(openData);
            case PlayerRulesConstants.RuleTypeId.EnergyLossPctOnCoDie            : return this._onTapAsEnergyLossPctOnCoDie(openData);
            case PlayerRulesConstants.RuleTypeId.EnergyGrowthMultiplier          : return this._onTapAsEnergyGrowthMultiplier(openData);
            case PlayerRulesConstants.RuleTypeId.CanActivateCoSkill              : return this._onTapAsCanActivateCoSkill(openData);
            case PlayerRulesConstants.RuleTypeId.CanCoBoard                      : return this._onTapAsCanCoBoard(openData);
            case PlayerRulesConstants.RuleTypeId.CanUnitJoin                     : return this._onTapAsCanUnitJoin(openData);
            case PlayerRulesConstants.RuleTypeId.MoveRangeModifier               : return this._onTapAsMoveRangeModifier(openData);
            case PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier         : return this._onTapAsUnitVisionRangeModifier(openData);
            case PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier         : return this._onTapAsTileVisionRangeModifier(openData);
            case PlayerRulesConstants.RuleTypeId.McwHumanCoCategoryIdArray       : return this._onTapAsMcwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.MmwHumanCoCategoryIdArray       : return this._onTapAsMmwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.MrwHumanCoCategoryIdArray       : return this._onTapAsMrwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.AtwHumanCoCategoryIdArray       : return this._onTapAsAtwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.CcwHumanCoCategoryIdArray       : return this._onTapAsCcwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.WarRoomHumanCoCategoryIdArray   : return this._onTapAsWarRoomHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.CampaignHumanCoIdArray          : return this._onTapAsCampaignHumanCoIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.CcwAiCoId                       : return this._onTapAsCcwAiCoId(openData);
            case PlayerRulesConstants.RuleTypeId.WarRoomAiCoId                   : return this._onTapAsWarRoomAiCoId(openData);
            case PlayerRulesConstants.RuleTypeId.CampaignAiCoId                  : return this._onTapAsCampaignAiCoId(openData);
            case PlayerRulesConstants.RuleTypeId.CampaignSkinId                  : return this._onTapAsCampaignSkinId(openData);
            case PlayerRulesConstants.RuleTypeId.AttackPowerModifier             : return this._onTapAsAttackPowerModifier(openData);
            case PlayerRulesConstants.RuleTypeId.DefenseModifier                 : return this._onTapAsDefenseModifier(openData);
            case PlayerRulesConstants.RuleTypeId.LuckLowerLimit                  : return this._onTapAsLuckLowerLimit(openData);
            case PlayerRulesConstants.RuleTypeId.LuckUpperLimit                  : return this._onTapAsLuckUpperLimit(openData);
            default                                             : throw HelpersMisc.newError(`Unknown ruleType: ${playerRuleType}`);
        }
    }
    private _onTapAsTeamIndex(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule = openData.playerRule;
        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            playerRule.setTeamIndex(playerRule.getTeamIndex() % openData.warRuleCommonData.getPlayerRuleList().length + 1);

            NotificationsDispatcher.dispatch(
                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                { playerIndex: playerRule.getPlayerIndex(), ruleType: openData.playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : availableCoCategoryIdArray,
                currentCoCategoryIdArray        : currentBannedCoCategoryIdArray,
                isBan                           : true,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0590),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : availableCoCategoryIdArray,
                currentCoCategoryIdArray        : currentBannedCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : true,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0590),
                callbackOnConfirm               : bannedCoCategoryIdArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setBannedCoCategoryIdArray(bannedCoCategoryIdArray);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setBannedCoCategoryIdArray(bannedCoCategoryIdArray);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowUnitTypePanel, {
                gameConfig                  : gcData,
                availableUnitTypeArray      : availableUnitTypeArray,
                currentUnitTypeArray        : currentBannedUnitTypeArray,
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
                currentUnitTypeArray    : currentBannedUnitTypeArray,
                availableUnitTypeArray  : availableUnitTypeArray,
                gameConfig              : gcData,
                callbackOnConfirm       : bannedUnitTypeArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setBannedUnitTypeArray(bannedUnitTypeArray);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setBannedUnitTypeArray(bannedUnitTypeArray);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.InitialFund.MaxLimit,
                minValue        : PlayerRulesConstants.InitialFund.MinLimit,
                currentValue    : playerRule.getInitialFund(),
                callback        : value => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setInitialFund(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setInitialFund(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.MaxUnitsCount.MaxLimit,
                minValue        : PlayerRulesConstants.MaxUnitsCount.MinLimit,
                currentValue    : playerRule.getMaxUnitsCount(),
                callback        : value => {
                    if (!openData.getIsBatch()) {
                        playerRule.setMaxUnitsCount(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMaxUnitsCount(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.IncomeMultiplier.MaxLimit,
                minValue        : PlayerRulesConstants.IncomeMultiplier.MinLimit,
                currentValue    : playerRule.getIncomeMultiplier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setIncomeMultiplier(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setIncomeMultiplier(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.EnergyAddPctOnCoBoard.MaxLimit,
                minValue        : PlayerRulesConstants.EnergyAddPctOnCoBoard.MinLimit,
                currentValue    : playerRule.getEnergyAddPctOnCoBoard(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setEnergyAddPctOnCoBoard(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setEnergyAddPctOnCoBoard(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.EnergyLossPctOnCoDie.MaxLimit,
                minValue        : PlayerRulesConstants.EnergyLossPctOnCoDie.MinLimit,
                currentValue    : playerRule.getEnergyLossPctOnCoDie(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setEnergyLossPctOnCoDie(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of  openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setEnergyLossPctOnCoDie(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.EnergyGrowthMultiplier.MaxLimit,
                minValue        : PlayerRulesConstants.EnergyGrowthMultiplier.MinLimit,
                currentValue    : playerRule.getEnergyGrowthMultiplier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setEnergyGrowthMultiplier(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setEnergyGrowthMultiplier(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
                NotificationsDispatcher.dispatch(
                    NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                    { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                );
            } else {
                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                    p.setCanActivateCoSkill(!canActivateCoSkill);
                    NotificationsDispatcher.dispatch(
                        NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                        { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
                NotificationsDispatcher.dispatch(
                    NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                    { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                );
            } else {
                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                    p.setCanCoBoard(!canCoBoard);
                    NotificationsDispatcher.dispatch(
                        NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                        { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
                NotificationsDispatcher.dispatch(
                    NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                    { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                );
            } else {
                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                    p.setCanUnitJoin(!canUnitJoin);
                    NotificationsDispatcher.dispatch(
                        NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                        { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                    );
                }
            }
        });
    }
    private _onTapAsMoveRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.MoveRangeModifier.MaxLimit,
                minValue        : PlayerRulesConstants.MoveRangeModifier.MinLimit,
                currentValue    : playerRule.getMoveRangeModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMoveRangeModifier(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMoveRangeModifier(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.UnitVisionRangeModifier.MaxLimit,
                minValue        : PlayerRulesConstants.UnitVisionRangeModifier.MinLimit,
                currentValue    : playerRule.getUnitVisionRangeModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setUnitVisionRangeModifier(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setUnitVisionRangeModifier(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.TileVisionRangeModifier.MaxLimit,
                minValue        : PlayerRulesConstants.TileVisionRangeModifier.MinLimit,
                currentValue    : playerRule.getTileVisionRangeModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setTileVisionRangeModifier(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setTileVisionRangeModifier(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMmwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMmwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setAtwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setAtwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setCcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
        const allCoCategoryIdArray          = gcData.getEnabledCoArrayByGameModeId(GameModesConstants.ModeId.WarRoom)
            .filter(v => v.getCoCategoryId() !== CosConstants.CategoryId.Random).map(v => v.getCoCategoryId());

        if (!openData.canModify) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                      : gcData,
                availableCoCategoryIdArray      : allCoCategoryIdArray,
                currentCoCategoryIdArray        : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray  : null,
                maxChooseCount                  : null,
                isBan                           : false,
                getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0238),
                callbackOnConfirm               : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setSrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setSrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
        const allCoIdArray          = gcData.getEnabledCoArrayByGameModeId(GameModesConstants.ModeId.SingleCampaign)
            .filter(v => v.getCoCategoryId() !== CosConstants.CategoryId.Random).map(v => v.getCoId());

        if (!openData.canModify) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoIdPanel, {
                gameConfig          : gcData,
                availableCoIdArray  : allCoIdArray,
                currentCoIdArray    : currentHumanCoIdArray,
                isBan               : false,
                getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoIdPanel, {
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
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCampaignHumanCoIdArray(newHumanCoIdArray);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0808),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.Yes),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.No),
                showButtonClose     : true,
                callback            : () => {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig          : gcData,
                        currentCoId         : playerRule.getCcwAiCoId() ?? null,
                        availableCoIdArray  : gcData.getEnabledCoArrayForAi().filter(v => v.getCoCategoryId() !== CosConstants.CategoryId.Random).map(v => v.getCoId()),
                        isBan               : false,
                        callbackOnConfirm   : newCoId => {
                            if (!openData.getIsBatch()) {
                                playerRule.setCcwAiCoId(newCoId);
                                NotificationsDispatcher.dispatch(
                                    NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                    { playerIndex: playerIndex, ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                                );
                            } else {
                                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                                    p.setCcwAiCoId(newCoId);
                                    NotificationsDispatcher.dispatch(
                                        NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                        { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                                    );
                                }
                            }
                        },
                    });
                },
                callbackOnCancel    : () => {
                    if (!openData.getIsBatch()) {
                        playerRule.setCcwAiCoId(null);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerIndex, ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCcwAiCoId(null);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0808),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.Yes),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.No),
                showButtonClose     : true,
                callback            : () => {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig          : gcData,
                        currentCoId         : playerRule.getSrwAiCoId() ?? null,
                        availableCoIdArray  : gcData.getEnabledCoArrayForAi().filter(v => v.getCoCategoryId() !== CosConstants.CategoryId.Random).map(v => v.getCoId()),
                        isBan               : false,
                        callbackOnConfirm   : newCoId => {
                            if (!openData.getIsBatch()) {
                                playerRule.setSrwAiCoId(newCoId);
                                NotificationsDispatcher.dispatch(
                                    NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                    { playerIndex: playerIndex, ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                                );
                            } else {
                                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                                    p.setSrwAiCoId(newCoId);
                                    NotificationsDispatcher.dispatch(
                                        NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                        { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                                    );
                                }
                            }
                        },
                    });
                },
                callbackOnCancel    : () => {
                    if (!openData.getIsBatch()) {
                        playerRule.setSrwAiCoId(null);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerIndex, ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setSrwAiCoId(null);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: playerRuleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiCoIdPanel, {
                gameConfig          : gcData,
                currentCoIdArray    : HelpersCollection.getNonNullElements([playerRule.getCampaignAiCoId()]),
                availableCoIdArray  : gcData.getEnabledCoArrayForAi().filter(v => v.getCoCategoryId() !== CosConstants.CategoryId.Random).map(v => v.getCoId()),
                minChooseCount      : null,
                maxChooseCount      : 1,
                isBan               : false,
                callbackOnConfirm   : newCoIdArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setCampaignAiCoId(newCoIdArray[0]);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCampaignAiCoId(newCoIdArray[0]);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel, {
                currentSkinId           : playerRule.getCampaignSkinId() ?? null,
                availableSkinIdArray    : ForceSkinsUtils.getAllSkinIdArray(false),
                callback                : newSkinId => {
                    const ruleType = openData.playerRuleType;
                    playerRule.setCampaignSkinId(newSkinId);
                    NotificationsDispatcher.dispatch(
                        NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                        { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                    );
                },
            });
        });
    }
    private _onTapAsAttackPowerModifier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.AttackPowerModifier.MaxLimit,
                minValue        : PlayerRulesConstants.AttackPowerModifier.MinLimit,
                currentValue    : playerRule.getAttackPowerModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setAttackPowerModifier(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setAttackPowerModifier(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.DefenseModifier.MaxLimit,
                minValue        : PlayerRulesConstants.DefenseModifier.MinLimit,
                currentValue    : playerRule.getDefenseModifier(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setDefenseModifier(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setDefenseModifier(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : Math.min(PlayerRulesConstants.Luck.MaxLimit, playerRule.getLuckUpperLimit()),
                minValue        : PlayerRulesConstants.Luck.MinLimit,
                currentValue    : playerRule.getLuckLowerLimit(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setLuckLowerLimit(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setLuckLowerLimit(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getPlayerRuleName(openData.playerRuleType) ?? LangConstants.UndefinedError,
                maxValue        : PlayerRulesConstants.Luck.MaxLimit,
                minValue        : Math.max(PlayerRulesConstants.Luck.MinLimit, playerRule.getLuckLowerLimit()),
                currentValue    : playerRule.getLuckUpperLimit(),
                callback        : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setLuckUpperLimit(value);
                        NotificationsDispatcher.dispatch(
                            NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                            { playerIndex: playerRule.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setLuckUpperLimit(value);
                            NotificationsDispatcher.dispatch(
                                NotificationsTypeId.TypeId.RuleEditor_PlayerRuleChanged,
                                { playerIndex: p.getPlayerIndex(), ruleType: ruleType } as NotificationsDataTypes.RuleEditor_PlayerRuleChanged
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
            case PlayerRulesConstants.RuleTypeId.TeamIndex                       : return this._updateViewAsTeamIndex(openData);
            case PlayerRulesConstants.RuleTypeId.BannedCoCategoryIdArray         : return this._updateViewAsBannedCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.BannedUnitTypeArray             : return this._updateViewAsBannedUnitTypeArray(openData);
            case PlayerRulesConstants.RuleTypeId.InitialFund                     : return this._updateViewAsInitialFund(openData);
            case PlayerRulesConstants.RuleTypeId.IncomeMultiplier                : return this._updateViewAsIncomeMultiplier(openData);
            case PlayerRulesConstants.RuleTypeId.MaxUnitsCount                   : return this._updateViewAsMaxUnitsCount(openData);
            case PlayerRulesConstants.RuleTypeId.EnergyAddPctOnCoBoard           : return this._updateViewAsEnergyAddPctOnCoBoard(openData);
            case PlayerRulesConstants.RuleTypeId.EnergyLossPctOnCoDie            : return this._updateViewAsEnergyLossPctOnCoDie(openData);
            case PlayerRulesConstants.RuleTypeId.EnergyGrowthMultiplier          : return this._updateViewAsEnergyGrowthMultiplier(openData);
            case PlayerRulesConstants.RuleTypeId.CanActivateCoSkill              : return this._updateViewAsCanActivateCoSkill(openData);
            case PlayerRulesConstants.RuleTypeId.CanCoBoard                      : return this._updateViewAsCanCoBoard(openData);
            case PlayerRulesConstants.RuleTypeId.CanUnitJoin                     : return this._updateViewAsCanUnitJoin(openData);
            case PlayerRulesConstants.RuleTypeId.MoveRangeModifier               : return this._updateViewAsMoveRangeModifier(openData);
            case PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier         : return this._updateViewAsUnitVisionRangeModifier(openData);
            case PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier         : return this._updateViewAsTileVisionRangeModifier(openData);
            case PlayerRulesConstants.RuleTypeId.McwHumanCoCategoryIdArray       : return this._updateViewAsMcwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.MmwHumanCoCategoryIdArray       : return this._updateViewAsMmwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.MrwHumanCoCategoryIdArray       : return this._updateViewAsMrwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.AtwHumanCoCategoryIdArray       : return this._updateViewAsAtwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.CcwHumanCoCategoryIdArray       : return this._updateViewAsCcwHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.WarRoomHumanCoCategoryIdArray   : return this._updateViewAsWarRoomHumanCoCategoryIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.CampaignHumanCoIdArray          : return this._updateViewAsCampaignHumanCoIdArray(openData);
            case PlayerRulesConstants.RuleTypeId.CcwAiCoId                       : return this._updateViewAsCcwAiCoId(openData);
            case PlayerRulesConstants.RuleTypeId.WarRoomAiCoId                   : return this._updateViewAsWarRoomAiCoId(openData);
            case PlayerRulesConstants.RuleTypeId.CampaignAiCoId                  : return this._updateViewAsCampaignAiCoId(openData);
            case PlayerRulesConstants.RuleTypeId.CampaignSkinId                  : return this._updateViewAsCampaignSkinId(openData);
            case PlayerRulesConstants.RuleTypeId.AttackPowerModifier             : return this._updateViewAsAttackPowerModifier(openData);
            case PlayerRulesConstants.RuleTypeId.DefenseModifier                 : return this._updateViewAsDefenseModifier(openData);
            case PlayerRulesConstants.RuleTypeId.LuckLowerLimit                  : return this._updateViewAsLuckLowerLimit(openData);
            case PlayerRulesConstants.RuleTypeId.LuckUpperLimit                  : return this._updateViewAsLuckUpperLimit(openData);
            default                                             : throw HelpersMisc.newError(`Unknown ruleType: ${playerRuleType}`);
        }
    }
    private _updateViewAsTeamIndex(openData: DataForUiPlayerRuleRenderer): void {
        const label = this._labelValue;
        label.setText(LangUtils.getPlayerTeamName(openData.playerRule.getTeamIndex()) ?? LangConstants.UndefinedError);
        label.setTextColor(GraphicsConstants.ColorValue.White);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsBannedCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const label     = this._labelValue;
        const currValue = openData.playerRule.getBannedCoCategoryIdArray().length;
        label.setText(`${currValue}`);
        label.setTextColor(currValue <= 0 ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Red);

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsBannedUnitTypeArray(openData: DataForUiPlayerRuleRenderer): void {
        const label     = this._labelValue;
        const currValue = openData.playerRule.getBannedUnitTypeArray().length;
        label.setText(`${currValue}`);
        label.setTextColor(currValue <= 0 ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Red);

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsInitialFund(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getInitialFund();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.InitialFund.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsIncomeMultiplier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getIncomeMultiplier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.IncomeMultiplier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsMaxUnitsCount(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getMaxUnitsCount();
        const label         = this._labelValue;
        label.setText(`${currValue ?? `--`}`);
        label.setTextColor(currValue == null ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsEnergyAddPctOnCoBoard(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getEnergyAddPctOnCoBoard();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.EnergyAddPctOnCoBoard.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsEnergyLossPctOnCoDie(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getEnergyLossPctOnCoDie();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.EnergyLossPctOnCoDie.Default, true));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsEnergyGrowthMultiplier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getEnergyGrowthMultiplier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.EnergyGrowthMultiplier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCanActivateCoSkill(openData: DataForUiPlayerRuleRenderer): void {
        const canActivateCoSkill    = openData.playerRule.getCanActivateCoSkill();
        const label                 = this._labelValue;
        label.setText(LangUtils.getTextForYesOrNo(canActivateCoSkill));
        label.setTextColor(canActivateCoSkill ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCanCoBoard(openData: DataForUiPlayerRuleRenderer): void {
        const canCoBoard    = openData.playerRule.getCanCoBoard();
        const label         = this._labelValue;
        label.setText(LangUtils.getTextForYesOrNo(canCoBoard));
        label.setTextColor(canCoBoard ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCanUnitJoin(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getCanUnitJoin();
        const label         = this._labelValue;
        label.setText(LangUtils.getTextForYesOrNo(currValue));
        label.setTextColor(currValue ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsMoveRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getMoveRangeModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.MoveRangeModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsUnitVisionRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getUnitVisionRangeModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.UnitVisionRangeModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsTileVisionRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getTileVisionRangeModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.TileVisionRangeModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsMcwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getMcwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0120));
            label.setTextColor(GraphicsConstants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(GraphicsConstants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsMmwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getMmwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0120));
            label.setTextColor(GraphicsConstants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(GraphicsConstants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsMrwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getMrwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0120));
            label.setTextColor(GraphicsConstants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(GraphicsConstants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsAtwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getAtwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0120));
            label.setTextColor(GraphicsConstants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(GraphicsConstants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsCcwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getCcwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0120));
            label.setTextColor(GraphicsConstants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(GraphicsConstants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsWarRoomHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getSrwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0120));
            label.setTextColor(GraphicsConstants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(GraphicsConstants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsCampaignHumanCoIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getCampaignHumanCoIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0120));
            label.setTextColor(GraphicsConstants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(GraphicsConstants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsCcwAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const ccwAiCoId = openData.playerRule.getCcwAiCoId();
        const label     = this._labelValue;
        label.setText(ccwAiCoId == null ? `--` : openData.gcData.getCoNameAndTierText(ccwAiCoId) ?? LangConstants.UndefinedError);
        label.setTextColor(ccwAiCoId == null ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsWarRoomAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const srwAiCoId = openData.playerRule.getSrwAiCoId();
        const label     = this._labelValue;
        label.setText(srwAiCoId == null ? `--` : openData.gcData.getCoNameAndTierText(srwAiCoId) ?? LangConstants.UndefinedError);
        label.setTextColor(srwAiCoId == null ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCampaignAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const coId      = openData.playerRule.getCampaignAiCoId();
        const label     = this._labelValue;
        label.setText(coId == null ? `--` : (openData.gcData.getCoNameAndTierText(coId) ?? LangConstants.UndefinedError));
        label.setTextColor(coId == null ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCampaignSkinId(openData: DataForUiPlayerRuleRenderer): void {
        const skinId    = openData.playerRule.getCampaignSkinId();
        const label     = this._labelValue;
        label.setText(skinId == null ? `--` : (LangUtils.getUnitAndTileSkinName(skinId) ?? LangConstants.UndefinedError));
        label.setTextColor(skinId == null ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsAttackPowerModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue = openData.playerRule.getAttackPowerModifier();
        const label     = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.AttackPowerModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsDefenseModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getDefenseModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.DefenseModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsLuckLowerLimit(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getLuckLowerLimit();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, PlayerRulesConstants.Luck.DefaultLowerLimit));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsLuckUpperLimit(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getLuckUpperLimit();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(HelpersText.getTextColor(currValue, openData.gcData.getSystemCfg().getDefaultLuckUpperLimit()));

        this._applySettingsForWholeTouch(openData.canModify);
    }
}

function checkAndSetCustomWarRuleId(instanceWarRule: Undefinable<InstanceWarRule>, callback: () => void): void {
    if ((!instanceWarRule) || (instanceWarRule.getTemplateWarRuleId() == null)) {
        callback();
    } else {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0129),
            callback    : () => {
                instanceWarRule.setTemplateWarRuleId(null);
                callback();
            },
        });
    }
}
