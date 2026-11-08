import {
    type Notifications_Mapping,
    PlayerRules_Constants,
    Cos_Constants,
    Graphics_Constants,
    Notifications_Dispatcher,
    ForceSkins_Utils,
    GamePanels_Dict,
    Helpers_Collection,
    Lang_Utils,
    Helpers_Text,
    GameModes_Constants,
    Helpers_Misc,
    GamePanels_Manager,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    type Egret_Egret,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiLabel,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { WarRuleCommonData } from "../../proto/schema/CommonProto/WarRule/WarRuleCommonData.ts";

export interface DataForUiPlayerRuleRenderer extends Ui_Types_UiListItemData.UiListItemData {
    canModify               : boolean;
    gcData                  : GameConfigs_GameConfig.GameConfig;
    gameModeId              : AuxiliaryTypes_AuxiliaryTypes.Undefinable<GameModes_Constants.ModeId>;
    instanceWarRule         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<InstanceWarRule>;
    warRuleCommonData       : WarRuleCommonData;
    playerRule              : PlayerRule;
    playerRuleType          : PlayerRules_Constants.RuleTypeId;
    getIsBatch              : () => boolean;
}
export class UiPlayerRuleRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUiPlayerRuleRenderer> {
    private readonly _labelValue!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "RuleEditor_PlayerRuleChanged", callback : this._onNotifyMePlayerRuleChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        this._callbackOnTap();
    }
    private _onNotifyMePlayerRuleChanged(e: Egret_Egret.Event<Notifications_Mapping.Mapping["RuleEditor_PlayerRuleChanged"]>): void {
        const eventData = Helpers_Misc.getExisted(e.data);
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
            case PlayerRules_Constants.RuleTypeId.TeamIndex                       : return this._onTapAsTeamIndex(openData);
            case PlayerRules_Constants.RuleTypeId.BannedCoCategoryIdArray         : return this._onTapAsBannedCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.BannedUnitTypeArray             : return this._onTapAsBannedUnitTypeArray(openData);
            case PlayerRules_Constants.RuleTypeId.InitialFund                     : return this._onTapAsInitialFund(openData);
            case PlayerRules_Constants.RuleTypeId.IncomeMultiplier                : return this._onTapAsIncomeMultiplier(openData);
            case PlayerRules_Constants.RuleTypeId.MaxUnitsCount                   : return this._onTapAsMaxUnitsCount(openData);
            case PlayerRules_Constants.RuleTypeId.EnergyAddPctOnCoBoard           : return this._onTapAsEnergyAddPctOnCoBoard(openData);
            case PlayerRules_Constants.RuleTypeId.EnergyLossPctOnCoDie            : return this._onTapAsEnergyLossPctOnCoDie(openData);
            case PlayerRules_Constants.RuleTypeId.EnergyGrowthMultiplier          : return this._onTapAsEnergyGrowthMultiplier(openData);
            case PlayerRules_Constants.RuleTypeId.CanActivateCoSkill              : return this._onTapAsCanActivateCoSkill(openData);
            case PlayerRules_Constants.RuleTypeId.CanCoBoard                      : return this._onTapAsCanCoBoard(openData);
            case PlayerRules_Constants.RuleTypeId.CanUnitJoin                     : return this._onTapAsCanUnitJoin(openData);
            case PlayerRules_Constants.RuleTypeId.MoveRangeModifier               : return this._onTapAsMoveRangeModifier(openData);
            case PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier         : return this._onTapAsUnitVisionRangeModifier(openData);
            case PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier         : return this._onTapAsTileVisionRangeModifier(openData);
            case PlayerRules_Constants.RuleTypeId.McwHumanCoCategoryIdArray       : return this._onTapAsMcwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.MmwHumanCoCategoryIdArray       : return this._onTapAsMmwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.MrwHumanCoCategoryIdArray       : return this._onTapAsMrwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.AtwHumanCoCategoryIdArray       : return this._onTapAsAtwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.CcwHumanCoCategoryIdArray       : return this._onTapAsCcwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.WarRoomHumanCoCategoryIdArray   : return this._onTapAsWarRoomHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.CampaignHumanCoIdArray          : return this._onTapAsCampaignHumanCoIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.CcwAiCoId                       : return this._onTapAsCcwAiCoId(openData);
            case PlayerRules_Constants.RuleTypeId.WarRoomAiCoId                   : return this._onTapAsWarRoomAiCoId(openData);
            case PlayerRules_Constants.RuleTypeId.CampaignAiCoId                  : return this._onTapAsCampaignAiCoId(openData);
            case PlayerRules_Constants.RuleTypeId.CampaignSkinId                  : return this._onTapAsCampaignSkinId(openData);
            case PlayerRules_Constants.RuleTypeId.AttackPowerModifier             : return this._onTapAsAttackPowerModifier(openData);
            case PlayerRules_Constants.RuleTypeId.DefenseModifier                 : return this._onTapAsDefenseModifier(openData);
            case PlayerRules_Constants.RuleTypeId.LuckLowerLimit                  : return this._onTapAsLuckLowerLimit(openData);
            case PlayerRules_Constants.RuleTypeId.LuckUpperLimit                  : return this._onTapAsLuckUpperLimit(openData);
            default                                             : throw Helpers_Misc.newError(`Unknown ruleType: ${playerRuleType}`);
        }
    }
    private _onTapAsTeamIndex(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule = openData.playerRule;
        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            playerRule.setTeamIndex(playerRule.getTeamIndex() % openData.warRuleCommonData.getPlayerRuleList().length + 1);

            Notifications_Dispatcher.dispatch(
                "RuleEditor_PlayerRuleChanged",
                { playerIndex : playerRule.getPlayerIndex(), ruleType : openData.playerRuleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                 : gcData,
                availableCoCategoryIdArray : availableCoCategoryIdArray,
                currentCoCategoryIdArray   : currentBannedCoCategoryIdArray,
                isBan                      : true,
                getTitleText               : () => Lang_Utils.getText(Lang_Constants.TextType.B0590),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                     : gcData,
                availableCoCategoryIdArray     : availableCoCategoryIdArray,
                currentCoCategoryIdArray       : currentBannedCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray : null,
                maxChooseCount                 : null,
                isBan                          : true,
                getTitleText                   : () => Lang_Utils.getText(Lang_Constants.TextType.B0590),
                callbackOnConfirm              : bannedCoCategoryIdArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setBannedCoCategoryIdArray(bannedCoCategoryIdArray);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setBannedCoCategoryIdArray(bannedCoCategoryIdArray);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowUnitTypePanel, {
                gameConfig             : gcData,
                availableUnitTypeArray : availableUnitTypeArray,
                currentUnitTypeArray   : currentBannedUnitTypeArray,
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
                currentUnitTypeArray   : currentBannedUnitTypeArray,
                availableUnitTypeArray : availableUnitTypeArray,
                gameConfig             : gcData,
                callbackOnConfirm      : bannedUnitTypeArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setBannedUnitTypeArray(bannedUnitTypeArray);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setBannedUnitTypeArray(bannedUnitTypeArray);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.InitialFund.MaxLimit,
                minValue     : PlayerRules_Constants.InitialFund.MinLimit,
                currentValue : playerRule.getInitialFund(),
                callback     : value => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setInitialFund(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setInitialFund(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.MaxUnitsCount.MaxLimit,
                minValue     : PlayerRules_Constants.MaxUnitsCount.MinLimit,
                currentValue : playerRule.getMaxUnitsCount(),
                callback     : value => {
                    if (!openData.getIsBatch()) {
                        playerRule.setMaxUnitsCount(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : playerRuleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMaxUnitsCount(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : playerRuleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.IncomeMultiplier.MaxLimit,
                minValue     : PlayerRules_Constants.IncomeMultiplier.MinLimit,
                currentValue : playerRule.getIncomeMultiplier(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setIncomeMultiplier(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setIncomeMultiplier(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.EnergyAddPctOnCoBoard.MaxLimit,
                minValue     : PlayerRules_Constants.EnergyAddPctOnCoBoard.MinLimit,
                currentValue : playerRule.getEnergyAddPctOnCoBoard(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setEnergyAddPctOnCoBoard(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setEnergyAddPctOnCoBoard(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.EnergyLossPctOnCoDie.MaxLimit,
                minValue     : PlayerRules_Constants.EnergyLossPctOnCoDie.MinLimit,
                currentValue : playerRule.getEnergyLossPctOnCoDie(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setEnergyLossPctOnCoDie(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of  openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setEnergyLossPctOnCoDie(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.EnergyGrowthMultiplier.MaxLimit,
                minValue     : PlayerRules_Constants.EnergyGrowthMultiplier.MinLimit,
                currentValue : playerRule.getEnergyGrowthMultiplier(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setEnergyGrowthMultiplier(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setEnergyGrowthMultiplier(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
                Notifications_Dispatcher.dispatch(
                    "RuleEditor_PlayerRuleChanged",
                    { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                );
            } else {
                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                    p.setCanActivateCoSkill(!canActivateCoSkill);
                    Notifications_Dispatcher.dispatch(
                        "RuleEditor_PlayerRuleChanged",
                        { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
                Notifications_Dispatcher.dispatch(
                    "RuleEditor_PlayerRuleChanged",
                    { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                );
            } else {
                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                    p.setCanCoBoard(!canCoBoard);
                    Notifications_Dispatcher.dispatch(
                        "RuleEditor_PlayerRuleChanged",
                        { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
                Notifications_Dispatcher.dispatch(
                    "RuleEditor_PlayerRuleChanged",
                    { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                );
            } else {
                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                    p.setCanUnitJoin(!canUnitJoin);
                    Notifications_Dispatcher.dispatch(
                        "RuleEditor_PlayerRuleChanged",
                        { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
                    );
                }
            }
        });
    }
    private _onTapAsMoveRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.MoveRangeModifier.MaxLimit,
                minValue     : PlayerRules_Constants.MoveRangeModifier.MinLimit,
                currentValue : playerRule.getMoveRangeModifier(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMoveRangeModifier(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMoveRangeModifier(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.UnitVisionRangeModifier.MaxLimit,
                minValue     : PlayerRules_Constants.UnitVisionRangeModifier.MinLimit,
                currentValue : playerRule.getUnitVisionRangeModifier(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setUnitVisionRangeModifier(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setUnitVisionRangeModifier(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.TileVisionRangeModifier.MaxLimit,
                minValue     : PlayerRules_Constants.TileVisionRangeModifier.MinLimit,
                currentValue : playerRule.getTileVisionRangeModifier(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setTileVisionRangeModifier(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setTileVisionRangeModifier(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                 : gcData,
                availableCoCategoryIdArray : allCoCategoryIdArray,
                currentCoCategoryIdArray   : currentHumanCoCategoryIdArray,
                isBan                      : false,
                getTitleText               : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                     : gcData,
                availableCoCategoryIdArray     : allCoCategoryIdArray,
                currentCoCategoryIdArray       : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray : null,
                maxChooseCount                 : null,
                isBan                          : false,
                getTitleText                   : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
                callbackOnConfirm              : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                 : gcData,
                availableCoCategoryIdArray : allCoCategoryIdArray,
                currentCoCategoryIdArray   : currentHumanCoCategoryIdArray,
                isBan                      : false,
                getTitleText               : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                     : gcData,
                availableCoCategoryIdArray     : allCoCategoryIdArray,
                currentCoCategoryIdArray       : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray : null,
                maxChooseCount                 : null,
                isBan                          : false,
                getTitleText                   : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
                callbackOnConfirm              : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMmwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMmwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                 : gcData,
                availableCoCategoryIdArray : allCoCategoryIdArray,
                currentCoCategoryIdArray   : currentHumanCoCategoryIdArray,
                isBan                      : false,
                getTitleText               : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                     : gcData,
                availableCoCategoryIdArray     : allCoCategoryIdArray,
                currentCoCategoryIdArray       : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray : null,
                maxChooseCount                 : null,
                isBan                          : false,
                getTitleText                   : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
                callbackOnConfirm              : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setMrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setMrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                 : gcData,
                availableCoCategoryIdArray : allCoCategoryIdArray,
                currentCoCategoryIdArray   : currentHumanCoCategoryIdArray,
                isBan                      : false,
                getTitleText               : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                     : gcData,
                availableCoCategoryIdArray     : allCoCategoryIdArray,
                currentCoCategoryIdArray       : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray : null,
                maxChooseCount                 : null,
                isBan                          : false,
                getTitleText                   : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
                callbackOnConfirm              : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setAtwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setAtwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                 : gcData,
                availableCoCategoryIdArray : allCoCategoryIdArray,
                currentCoCategoryIdArray   : currentHumanCoCategoryIdArray,
                isBan                      : false,
                getTitleText               : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                     : gcData,
                availableCoCategoryIdArray     : allCoCategoryIdArray,
                currentCoCategoryIdArray       : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray : null,
                maxChooseCount                 : null,
                isBan                          : false,
                getTitleText                   : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
                callbackOnConfirm              : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setCcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCcwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
        const allCoCategoryIdArray          = gcData.getEnabledCoArrayByGameModeId(GameModes_Constants.ModeId.WarRoom)
            .filter(v => v.getCoCategoryId() !== Cos_Constants.CategoryId.Random).map(v => v.getCoCategoryId());

        if (!openData.canModify) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoCategoryIdPanel, {
                gameConfig                 : gcData,
                availableCoCategoryIdArray : allCoCategoryIdArray,
                currentCoCategoryIdArray   : currentHumanCoCategoryIdArray,
                isBan                      : false,
                getTitleText               : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoCategoryIdPanel, {
                gameConfig                     : gcData,
                availableCoCategoryIdArray     : allCoCategoryIdArray,
                currentCoCategoryIdArray       : currentHumanCoCategoryIdArray.length ? currentHumanCoCategoryIdArray : allCoCategoryIdArray,
                forceUnchosenCoCategoryIdArray : null,
                maxChooseCount                 : null,
                isBan                          : false,
                getTitleText                   : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
                callbackOnConfirm              : newHumanCoCategoryIdArray => {
                    if (newHumanCoCategoryIdArray.length >= allCoCategoryIdArray.length) {
                        newHumanCoCategoryIdArray = [];
                    }

                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setSrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setSrwHumanCoCategoryIdArray(newHumanCoCategoryIdArray);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
        const allCoIdArray          = gcData.getEnabledCoArrayByGameModeId(GameModes_Constants.ModeId.SingleCampaign)
            .filter(v => v.getCoCategoryId() !== Cos_Constants.CategoryId.Random).map(v => v.getCoId());

        if (!openData.canModify) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoIdPanel, {
                gameConfig         : gcData,
                availableCoIdArray : allCoIdArray,
                currentCoIdArray   : currentHumanCoIdArray,
                isBan              : false,
                getTitleText       : () => Lang_Utils.getText(Lang_Constants.TextType.B0238),
            });
            return;
        }

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoIdPanel, {
                gameConfig         : gcData,
                availableCoIdArray : allCoIdArray,
                currentCoIdArray   : currentHumanCoIdArray,
                minChooseCount     : null,
                maxChooseCount     : null,
                isBan              : false,
                callbackOnConfirm  : newHumanCoIdArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setCampaignHumanCoIdArray(newHumanCoIdArray);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCampaignHumanCoIdArray(newHumanCoIdArray);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0808),
                getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
                getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.No),
                showButtonClose   : true,
                callback          : () => {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig         : gcData,
                        currentCoId        : playerRule.getCcwAiCoId() ?? null,
                        availableCoIdArray : gcData.getEnabledCoArrayForAi().filter(v => v.getCoCategoryId() !== Cos_Constants.CategoryId.Random).map(v => v.getCoId()),
                        isBan              : false,
                        callbackOnConfirm  : newCoId => {
                            if (!openData.getIsBatch()) {
                                playerRule.setCcwAiCoId(newCoId);
                                Notifications_Dispatcher.dispatch(
                                    "RuleEditor_PlayerRuleChanged",
                                    { playerIndex : playerIndex, ruleType : playerRuleType },
                                );
                            } else {
                                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                                    p.setCcwAiCoId(newCoId);
                                    Notifications_Dispatcher.dispatch(
                                        "RuleEditor_PlayerRuleChanged",
                                        { playerIndex : p.getPlayerIndex(), ruleType : playerRuleType },
                                    );
                                }
                            }
                        },
                    });
                },
                callbackOnCancel : () => {
                    if (!openData.getIsBatch()) {
                        playerRule.setCcwAiCoId(null);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerIndex, ruleType : playerRuleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCcwAiCoId(null);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : playerRuleType },
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsWarRoomAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const gcData            = openData.gcData;
        const playerRule        = openData.playerRule;
        const playerRuleType    = openData.playerRuleType;
        const playerIndex       = playerRule.getPlayerIndex();

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0808),
                getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
                getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.No),
                showButtonClose   : true,
                callback          : () => {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig         : gcData,
                        currentCoId        : playerRule.getSrwAiCoId() ?? null,
                        availableCoIdArray : gcData.getEnabledCoArrayForAi().filter(v => v.getCoCategoryId() !== Cos_Constants.CategoryId.Random).map(v => v.getCoId()),
                        isBan              : false,
                        callbackOnConfirm  : newCoId => {
                            if (!openData.getIsBatch()) {
                                playerRule.setSrwAiCoId(newCoId);
                                Notifications_Dispatcher.dispatch(
                                    "RuleEditor_PlayerRuleChanged",
                                    { playerIndex : playerIndex, ruleType : playerRuleType },
                                );
                            } else {
                                for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                                    p.setSrwAiCoId(newCoId);
                                    Notifications_Dispatcher.dispatch(
                                        "RuleEditor_PlayerRuleChanged",
                                        { playerIndex : p.getPlayerIndex(), ruleType : playerRuleType },
                                    );
                                }
                            }
                        },
                    });
                },
                callbackOnCancel : () => {
                    if (!openData.getIsBatch()) {
                        playerRule.setSrwAiCoId(null);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerIndex, ruleType : playerRuleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setSrwAiCoId(null);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : playerRuleType },
                            );
                        }
                    }
                },
            });
        });
    }
    private _onTapAsCampaignAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const gcData        = openData.gcData;
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiCoIdPanel, {
                gameConfig         : gcData,
                currentCoIdArray   : Helpers_Collection.getNonNullElements([playerRule.getCampaignAiCoId()]),
                availableCoIdArray : gcData.getEnabledCoArrayForAi().filter(v => v.getCoCategoryId() !== Cos_Constants.CategoryId.Random).map(v => v.getCoId()),
                minChooseCount     : null,
                maxChooseCount     : 1,
                isBan              : false,
                callbackOnConfirm  : newCoIdArray => {
                    const ruleType = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setCampaignAiCoId(newCoIdArray[0]);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setCampaignAiCoId(newCoIdArray[0]);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
                currentSkinId        : playerRule.getCampaignSkinId() ?? null,
                availableSkinIdArray : ForceSkins_Utils.getAllSkinIdArray(false),
                callback             : newSkinId => {
                    const ruleType = openData.playerRuleType;
                    playerRule.setCampaignSkinId(newSkinId);
                    Notifications_Dispatcher.dispatch(
                        "RuleEditor_PlayerRuleChanged",
                        { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                    );
                },
            });
        });
    }
    private _onTapAsAttackPowerModifier(openData: DataForUiPlayerRuleRenderer): void {
        const playerRule    = openData.playerRule;

        checkAndSetCustomWarRuleId(openData.instanceWarRule, () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.AttackPowerModifier.MaxLimit,
                minValue     : PlayerRules_Constants.AttackPowerModifier.MinLimit,
                currentValue : playerRule.getAttackPowerModifier(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setAttackPowerModifier(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setAttackPowerModifier(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.DefenseModifier.MaxLimit,
                minValue     : PlayerRules_Constants.DefenseModifier.MinLimit,
                currentValue : playerRule.getDefenseModifier(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setDefenseModifier(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setDefenseModifier(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : Math.min(PlayerRules_Constants.Luck.MaxLimit, playerRule.getLuckUpperLimit()),
                minValue     : PlayerRules_Constants.Luck.MinLimit,
                currentValue : playerRule.getLuckLowerLimit(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setLuckLowerLimit(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setLuckLowerLimit(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getPlayerRuleName(openData.playerRuleType) ?? Lang_Constants.UndefinedError,
                maxValue     : PlayerRules_Constants.Luck.MaxLimit,
                minValue     : Math.max(PlayerRules_Constants.Luck.MinLimit, playerRule.getLuckLowerLimit()),
                currentValue : playerRule.getLuckUpperLimit(),
                callback     : value => {
                    const ruleType  = openData.playerRuleType;
                    if (!openData.getIsBatch()) {
                        playerRule.setLuckUpperLimit(value);
                        Notifications_Dispatcher.dispatch(
                            "RuleEditor_PlayerRuleChanged",
                            { playerIndex : playerRule.getPlayerIndex(), ruleType : ruleType },
                        );
                    } else {
                        for (const p of openData.warRuleCommonData.getPlayerRuleList()) {
                            p.setLuckUpperLimit(value);
                            Notifications_Dispatcher.dispatch(
                                "RuleEditor_PlayerRuleChanged",
                                { playerIndex : p.getPlayerIndex(), ruleType : ruleType },
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
            case PlayerRules_Constants.RuleTypeId.TeamIndex                       : return this._updateViewAsTeamIndex(openData);
            case PlayerRules_Constants.RuleTypeId.BannedCoCategoryIdArray         : return this._updateViewAsBannedCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.BannedUnitTypeArray             : return this._updateViewAsBannedUnitTypeArray(openData);
            case PlayerRules_Constants.RuleTypeId.InitialFund                     : return this._updateViewAsInitialFund(openData);
            case PlayerRules_Constants.RuleTypeId.IncomeMultiplier                : return this._updateViewAsIncomeMultiplier(openData);
            case PlayerRules_Constants.RuleTypeId.MaxUnitsCount                   : return this._updateViewAsMaxUnitsCount(openData);
            case PlayerRules_Constants.RuleTypeId.EnergyAddPctOnCoBoard           : return this._updateViewAsEnergyAddPctOnCoBoard(openData);
            case PlayerRules_Constants.RuleTypeId.EnergyLossPctOnCoDie            : return this._updateViewAsEnergyLossPctOnCoDie(openData);
            case PlayerRules_Constants.RuleTypeId.EnergyGrowthMultiplier          : return this._updateViewAsEnergyGrowthMultiplier(openData);
            case PlayerRules_Constants.RuleTypeId.CanActivateCoSkill              : return this._updateViewAsCanActivateCoSkill(openData);
            case PlayerRules_Constants.RuleTypeId.CanCoBoard                      : return this._updateViewAsCanCoBoard(openData);
            case PlayerRules_Constants.RuleTypeId.CanUnitJoin                     : return this._updateViewAsCanUnitJoin(openData);
            case PlayerRules_Constants.RuleTypeId.MoveRangeModifier               : return this._updateViewAsMoveRangeModifier(openData);
            case PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier         : return this._updateViewAsUnitVisionRangeModifier(openData);
            case PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier         : return this._updateViewAsTileVisionRangeModifier(openData);
            case PlayerRules_Constants.RuleTypeId.McwHumanCoCategoryIdArray       : return this._updateViewAsMcwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.MmwHumanCoCategoryIdArray       : return this._updateViewAsMmwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.MrwHumanCoCategoryIdArray       : return this._updateViewAsMrwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.AtwHumanCoCategoryIdArray       : return this._updateViewAsAtwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.CcwHumanCoCategoryIdArray       : return this._updateViewAsCcwHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.WarRoomHumanCoCategoryIdArray   : return this._updateViewAsWarRoomHumanCoCategoryIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.CampaignHumanCoIdArray          : return this._updateViewAsCampaignHumanCoIdArray(openData);
            case PlayerRules_Constants.RuleTypeId.CcwAiCoId                       : return this._updateViewAsCcwAiCoId(openData);
            case PlayerRules_Constants.RuleTypeId.WarRoomAiCoId                   : return this._updateViewAsWarRoomAiCoId(openData);
            case PlayerRules_Constants.RuleTypeId.CampaignAiCoId                  : return this._updateViewAsCampaignAiCoId(openData);
            case PlayerRules_Constants.RuleTypeId.CampaignSkinId                  : return this._updateViewAsCampaignSkinId(openData);
            case PlayerRules_Constants.RuleTypeId.AttackPowerModifier             : return this._updateViewAsAttackPowerModifier(openData);
            case PlayerRules_Constants.RuleTypeId.DefenseModifier                 : return this._updateViewAsDefenseModifier(openData);
            case PlayerRules_Constants.RuleTypeId.LuckLowerLimit                  : return this._updateViewAsLuckLowerLimit(openData);
            case PlayerRules_Constants.RuleTypeId.LuckUpperLimit                  : return this._updateViewAsLuckUpperLimit(openData);
            default                                             : throw Helpers_Misc.newError(`Unknown ruleType: ${playerRuleType}`);
        }
    }
    private _updateViewAsTeamIndex(openData: DataForUiPlayerRuleRenderer): void {
        const label = this._labelValue;
        label.setText(Lang_Utils.getPlayerTeamName(openData.playerRule.getTeamIndex()) ?? Lang_Constants.UndefinedError);
        label.setTextColor(Graphics_Constants.ColorValue.White);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsBannedCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const label     = this._labelValue;
        const currValue = openData.playerRule.getBannedCoCategoryIdArray().length;
        label.setText(`${currValue}`);
        label.setTextColor(currValue <= 0 ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Red);

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsBannedUnitTypeArray(openData: DataForUiPlayerRuleRenderer): void {
        const label     = this._labelValue;
        const currValue = openData.playerRule.getBannedUnitTypeArray().length;
        label.setText(`${currValue}`);
        label.setTextColor(currValue <= 0 ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Red);

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsInitialFund(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getInitialFund();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.InitialFund.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsIncomeMultiplier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getIncomeMultiplier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.IncomeMultiplier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsMaxUnitsCount(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getMaxUnitsCount();
        const label         = this._labelValue;
        label.setText(`${currValue ?? `--`}`);
        label.setTextColor(currValue == null ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsEnergyAddPctOnCoBoard(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getEnergyAddPctOnCoBoard();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.EnergyAddPctOnCoBoard.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsEnergyLossPctOnCoDie(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getEnergyLossPctOnCoDie();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.EnergyLossPctOnCoDie.Default, true));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsEnergyGrowthMultiplier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getEnergyGrowthMultiplier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.EnergyGrowthMultiplier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCanActivateCoSkill(openData: DataForUiPlayerRuleRenderer): void {
        const canActivateCoSkill    = openData.playerRule.getCanActivateCoSkill();
        const label                 = this._labelValue;
        label.setLangText(canActivateCoSkill ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        label.setTextColor(canActivateCoSkill ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCanCoBoard(openData: DataForUiPlayerRuleRenderer): void {
        const canCoBoard    = openData.playerRule.getCanCoBoard();
        const label         = this._labelValue;
        label.setLangText(canCoBoard ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        label.setTextColor(canCoBoard ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCanUnitJoin(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getCanUnitJoin();
        const label         = this._labelValue;
        label.setLangText(currValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        label.setTextColor(currValue ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Red);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsMoveRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getMoveRangeModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.MoveRangeModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsUnitVisionRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getUnitVisionRangeModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.UnitVisionRangeModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsTileVisionRangeModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getTileVisionRangeModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.TileVisionRangeModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsMcwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getMcwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(Lang_Constants.TextType.B0120);
            label.setTextColor(Graphics_Constants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(Graphics_Constants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsMmwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getMmwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(Lang_Constants.TextType.B0120);
            label.setTextColor(Graphics_Constants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(Graphics_Constants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsMrwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getMrwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(Lang_Constants.TextType.B0120);
            label.setTextColor(Graphics_Constants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(Graphics_Constants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsAtwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getAtwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(Lang_Constants.TextType.B0120);
            label.setTextColor(Graphics_Constants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(Graphics_Constants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsCcwHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getCcwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(Lang_Constants.TextType.B0120);
            label.setTextColor(Graphics_Constants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(Graphics_Constants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsWarRoomHumanCoCategoryIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getSrwHumanCoCategoryIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(Lang_Constants.TextType.B0120);
            label.setTextColor(Graphics_Constants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(Graphics_Constants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsCampaignHumanCoIdArray(openData: DataForUiPlayerRuleRenderer): void {
        const currentValue  = openData.playerRule.getCampaignHumanCoIdArray().length;
        const label         = this._labelValue;
        if (currentValue == 0) {
            label.setLangText(Lang_Constants.TextType.B0120);
            label.setTextColor(Graphics_Constants.ColorValue.White);
        } else {
            label.setText(`${currentValue}`);
            label.setTextColor(Graphics_Constants.ColorValue.Red);
        }

        this._applySettingsForWholeTouch(true);
    }
    private _updateViewAsCcwAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const ccwAiCoId = openData.playerRule.getCcwAiCoId();
        const label     = this._labelValue;
        label.setText(ccwAiCoId == null ? `--` : openData.gcData.getCoNameAndTierText(ccwAiCoId) ?? Lang_Constants.UndefinedError);
        label.setTextColor(ccwAiCoId == null ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsWarRoomAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const srwAiCoId = openData.playerRule.getSrwAiCoId();
        const label     = this._labelValue;
        label.setText(srwAiCoId == null ? `--` : openData.gcData.getCoNameAndTierText(srwAiCoId) ?? Lang_Constants.UndefinedError);
        label.setTextColor(srwAiCoId == null ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCampaignAiCoId(openData: DataForUiPlayerRuleRenderer): void {
        const coId      = openData.playerRule.getCampaignAiCoId();
        const label     = this._labelValue;
        label.setText(coId == null ? `--` : (openData.gcData.getCoNameAndTierText(coId) ?? Lang_Constants.UndefinedError));
        label.setTextColor(coId == null ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsCampaignSkinId(openData: DataForUiPlayerRuleRenderer): void {
        const skinId    = openData.playerRule.getCampaignSkinId();
        const label     = this._labelValue;
        label.setText(skinId == null ? `--` : (Lang_Utils.getUnitAndTileSkinName(skinId) ?? Lang_Constants.UndefinedError));
        label.setTextColor(skinId == null ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Green);

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsAttackPowerModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue = openData.playerRule.getAttackPowerModifier();
        const label     = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.AttackPowerModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsDefenseModifier(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getDefenseModifier();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.DefenseModifier.Default));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsLuckLowerLimit(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getLuckLowerLimit();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, PlayerRules_Constants.Luck.DefaultLowerLimit));

        this._applySettingsForWholeTouch(openData.canModify);
    }
    private _updateViewAsLuckUpperLimit(openData: DataForUiPlayerRuleRenderer): void {
        const currValue     = openData.playerRule.getLuckUpperLimit();
        const label         = this._labelValue;
        label.setText(`${currValue}`);
        label.setTextColor(Helpers_Text.getTextColor(currValue, openData.gcData.getSystemCfg().getDefaultLuckUpperLimit()));

        this._applySettingsForWholeTouch(openData.canModify);
    }
}

function checkAndSetCustomWarRuleId(instanceWarRule: AuxiliaryTypes_AuxiliaryTypes.Undefinable<InstanceWarRule>, callback: () => void): void {
    if ((!instanceWarRule) || (instanceWarRule.getTemplateWarRuleId() == null)) {
        callback();
    } else {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0129),
            callback   : () => {
                instanceWarRule.setTemplateWarRuleId(null);
                callback();
            },
        });
    }
}
