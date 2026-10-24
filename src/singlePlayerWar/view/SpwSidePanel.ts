import * as ActionPlannersConstants from "../../actionPlanners/Constants.ts";
import * as ActionPlannersStatesChoosingCoActiveSkillTarget from "../../actionPlanners/states/ChoosingCoActiveSkillTarget.ts";
import * as ActionPlannersStatesIdle from "../../actionPlanners/states/Idle.ts";
import * as ActionPlannersStatesRequestingPlayerEndTurn from "../../actionPlanners/states/RequestingPlayerEndTurn.ts";
import * as ActionPlannersStatesRequestingPlayerUseCoActiveSkill from "../../actionPlanners/states/RequestingPlayerUseCoActiveSkill.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as CoSkillsUtilsCommon from "../../coSkills/utils/Common.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjective from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../interface/ISpwWar.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiContainer from "../../ui/components/UiContainer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UsersModel from "../../users/Model.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type TaskObjective          = ProtoSchemaCommonProtoTaskObjectivesTaskObjective.TaskObjective;
type TaskObjectiveState     = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState;

let _showTaskObjective = false;

export interface OpenData {
    war : SinglePlayerWarInterfaceISpwWar.ISpwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupLeft!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnCop!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnScop!                  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupRight!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnUndo!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRedo!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextUnit!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextTile!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnEndTurn!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnInfo!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMenu!                  : UiInterfacesIUiButton.IUiButton;

    private readonly _btnTaskObjective!         : UiInterfacesIUiButton.IUiButton;
    private readonly _groupTaskObjectiveWindow! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _scrollerTaskObjective!    : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupTaskObjective!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnCloseTaskObjective!    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MouseRightButtonClicked,         callback: this._onNotifyMouseRightButtonClicked },
            { type: NotificationsTypeId.TypeId.BwTurnPhaseCodeChanged,          callback: this._onNotifyBwTurnPhaseCodeChanged },
            { type: NotificationsTypeId.TypeId.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: NotificationsTypeId.TypeId.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
            { type: NotificationsTypeId.TypeId.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
            { type: NotificationsTypeId.TypeId.ActionPlannerStateChanged,       callback: this._onNotifyActionPlannerStateChanged },
            { type: NotificationsTypeId.TypeId.WarOperationNormalExecuted,      callback: this._onNotifyWarOperationNormalExecuted },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCop,                 callback: this._onTouchedBtnCop },
            { ui: this._btnScop,                callback: this._onTouchedBtnScop },
            { ui: this._btnUndo,                callback: this._onTouchedBtnUndo },
            { ui: this._btnRedo,                callback: this._onTouchedBtnRedo },
            { ui: this._btnNextUnit,            callback: this._onTouchedBtnNextUnit, },
            { ui: this._btnNextTile,            callback: this._onTouchedBtnNextTile, },
            { ui: this._btnEndTurn,             callback: this._onTouchedBtnEndTurn, },
            { ui: this._btnCancel,              callback: this._onTouchedBtnCancel },
            { ui: this._btnInfo,                callback: this._onTouchedBtnInfo },
            { ui: this._btnMenu,                callback: this._onTouchedBtnMenu, },
            { ui: this._btnTaskObjective,       callback: this._onTouchedBtnTaskObjective },
            { ui: this._btnCloseTaskObjective,  callback: this._onTouchedBtnCloseTaskObjective },
        ]);
        this._btnCop.setShortSfxCode(SoundsConstants.ShortSfxCode.None);
        this._btnScop.setShortSfxCode(SoundsConstants.ShortSfxCode.None);
        this._btnNextUnit.setShortSfxCode(SoundsConstants.ShortSfxCode.None);
        this._btnNextTile.setShortSfxCode(SoundsConstants.ShortSfxCode.None);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMouseRightButtonClicked(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const planner = war.getActionPlanner();
        if ((!war.getIsExecutingAction()) && (!planner.checkIsStateRequesting())) {
            ActionPlannersStatesIdle.Idle.getInstance().apply(planner);
        }
    }
    private _onNotifyBwTurnPhaseCodeChanged(): void {
        this._updateDynamicButtons();
    }
    private _onNotifyBwPlayerIndexInTurnChanged(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._updateDynamicButtons();
        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    }
    private _onNotifyBwCoEnergyChanged(): void {
        this._updateBtnCop();
        this._updateBtnScop();
    }
    private _onNotifyBwCoUsingSkillChanged(): void {
        this._updateBtnCop();
        this._updateBtnScop();

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    }
    private _onNotifyActionPlannerStateChanged(): void {
        this._updateDynamicButtons();
    }
    private _onNotifyWarOperationNormalExecuted(): void {
        this._updateComponentsForTaskObjective();
    }

    private _onTouchedBtnCop(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const skillType     = CoSkillsConstants.SkillTypeId.Power;
        const playerInTurn  = war.getPlayerInTurn();
        if (!playerInTurn.checkCanUseCoSkill(skillType)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
        } else {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

            const targetsCount  = CoSkillsUtilsCommon.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
            const actionPlanner = war.getActionPlanner();
            if (targetsCount <= 0) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getTitle    : () => LangUtils.getText(LangConstants.TextType.B0142),
                    getContent  : () => LangUtils.getText(LangConstants.TextType.A0054),
                    callback    : () => ActionPlannersStatesRequestingPlayerUseCoActiveSkill.RequestingPlayerUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null),
                });
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent  : () => LangUtils.getFormattedText(LangConstants.TextType.F0205, targetsCount),
                    callback    : () => ActionPlannersStatesChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance().doApplyOnTouchButton(actionPlanner, skillType),
                });
            }
        }
    }
    private _onTouchedBtnScop(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const skillType     = CoSkillsConstants.SkillTypeId.SuperPower;
        const playerInTurn  = war.getPlayerInTurn();
        if (!playerInTurn.checkCanUseCoSkill(skillType)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
        } else {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

            const targetsCount  = CoSkillsUtilsCommon.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
            const actionPlanner = war.getActionPlanner();
            if (targetsCount <= 0) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getTitle    : () => LangUtils.getText(LangConstants.TextType.B0144),
                    getContent  : () => LangUtils.getText(LangConstants.TextType.A0058),
                    callback    : () => ActionPlannersStatesRequestingPlayerUseCoActiveSkill.RequestingPlayerUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null),
                });
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent  : () => LangUtils.getFormattedText(LangConstants.TextType.F0205, targetsCount),
                    callback    : () => ActionPlannersStatesChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance().doApplyOnTouchButton(actionPlanner, skillType),
                });
            }
        }
    }
    private _onTouchedBtnUndo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0374));
            return;
        }
        if (!war.checkIsHumanInTurn()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const retractManager    = war.getRetractManager();
        const retractId         = retractManager.getNextRetractId() - 2;
        const retractState      = retractManager.getRetractState(retractId);
        if (retractState == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0318));
        } else {
            war.fastLoadState(ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(retractState));
            retractManager.setNextRetractId(retractId + 1);
            SoundsSoundPlayer.playCoBgmWithWar({
                war                             : war,
                force                           : false,
                coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
            });
        }
    }
    private _onTouchedBtnRedo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0374));
            return;
        }
        if (!war.checkIsHumanInTurn()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0239));
            return;
        }

        const retractManager    = war.getRetractManager();
        const retractId         = Math.max(1, retractManager.getNextRetractId());
        const retractState      = retractManager.getRetractState(retractId);
        if (retractState == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0319));
        } else {
            war.fastLoadState(ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(retractState));
            retractManager.setNextRetractId(retractId + 1);
            SoundsSoundPlayer.playCoBgmWithWar({
                war                             : war,
                force                           : false,
                coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
            });
        }
    }
    private _onTouchedBtnNextUnit(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const field         = war.getField();
        const actionPlanner = field.getActionPlanner();
        if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getStateId() !== ActionPlannersConstants.StateId.ExecutingAction)) {
            ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);

            const gridIndex = war.getIdleUnitGridIndex();
            if (!gridIndex) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
            } else {
                const cursor = field.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            }
        }
    }
    private _onTouchedBtnNextTile(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const field         = war.getField();
        const actionPlanner = field.getActionPlanner();
        if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getStateId() !== ActionPlannersConstants.StateId.ExecutingAction)) {
            ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);

            const gridIndex = war.getIdleBuildingGridIndex();
            if (!gridIndex) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
            } else {
                const cursor = field.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            }
        }
    }
    private _onTouchedBtnEndTurn(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(war.getPlayerIndexInTurn())) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0034));
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getTitle    : () => LangUtils.getText(LangConstants.TextType.B0036),
                getContent  : () => war.getHintForEndTurn(),
                callback    : () => ActionPlannersStatesRequestingPlayerEndTurn.RequestingPlayerEndTurn.getInstance().doApplyOnChooseAction(war.getActionPlanner()),
            });
        }
    }
    private _onTouchedBtnCancel(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const planner = war.getActionPlanner();
        if ((!war.getIsExecutingAction()) && (!planner.checkIsStateRequesting())) {
            ActionPlannersStatesIdle.Idle.getInstance().apply(planner);
        }
    }
    private _onTouchedBtnInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);
        }
        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwWarInfoPanel, { war });
    }
    private _onTouchedBtnMenu(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);
        }
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpwWarMenuPanel, {
            war: war,
        });
    }
    private _onTouchedBtnTaskObjective(): void {
        _showTaskObjective = true;
        this._updateComponentsForTaskObjective();
    }
    private _onTouchedBtnCloseTaskObjective(): void {
        _showTaskObjective = false;
        this._updateComponentsForTaskObjective();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for views.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateDynamicButtons();
    }
    private _updateDynamicButtons(): void {
        this._updateBtnCop();
        this._updateBtnScop();
        this._updateButtonsForRetract();
        this._updateBtnEndTurn();
        this._updateBtnNextUnit();
        this._updateBtnNextTile();
        this._updateBtnCancel();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCop.setLangText(LangConstants.TextType.B0142);
        this._btnScop.setLangText(LangConstants.TextType.B0144);
        this._btnUndo.setLangText(LangConstants.TextType.B0923);
        this._btnRedo.setLangText(LangConstants.TextType.B0924);
        this._btnNextUnit.setLangText(LangConstants.TextType.B0685);
        this._btnNextTile.setLangText(LangConstants.TextType.B0686);
        this._btnEndTurn.setLangText(LangConstants.TextType.B0036);
        this._btnCancel.setLangText(LangConstants.TextType.B0154);
        this._btnInfo.setLangText(LangConstants.TextType.B0223);
        this._btnMenu.setLangText(LangConstants.TextType.B0155);
        this._btnTaskObjective.setLangText(LangConstants.TextType.B1480);

        this._updateComponentsForTaskObjective();
    }
    private _updateComponentsForTaskObjective(): void {
        const btnTaskObjective  = this._btnTaskObjective;
        const groupWindow       = this._groupTaskObjectiveWindow;

        const war = this.getOpenData()?.war;
        if (war == null) {
            btnTaskObjective.setIsVisible(false);
            groupWindow.setIsVisible(false);
            return;
        }

        const allTaskObjectiveArray = war.getInstanceWarRule().getTaskObjectiveFullData()?.getTaskObjectiveArray() ?? [];
        const stateArray            = war.getTaskObjectiveManager().getStateArray();
        const mainDataArray         = getDataArrayForTaskObjectiveRenderer(war, allTaskObjectiveArray, stateArray, true);
        const subDataArray          = getDataArrayForTaskObjectiveRenderer(war, allTaskObjectiveArray, stateArray, false);
        if (mainDataArray.length + subDataArray.length <= 0) {
            btnTaskObjective.setIsVisible(false);
            groupWindow.setIsVisible(false);
            return;
        }

        if (!_showTaskObjective) {
            btnTaskObjective.setIsVisible(true);
            groupWindow.setIsVisible(false);
        } else {
            btnTaskObjective.setIsVisible(false);
            groupWindow.setIsVisible(true);

            const group = this._groupTaskObjective;
            group.removeAllItems(false);

            if (mainDataArray.length) {
                group.addItem(createLabelForTaskObjectiveCategory(LangUtils.getText(LangConstants.TextType.B1217)), false);

                for (const data of mainDataArray) {
                    group.addItem(createTaskObjectiveRenderer(data), false);
                }
            }

            if (subDataArray.length) {
                group.addItem(createLabelForTaskObjectiveCategory(LangUtils.getText(LangConstants.TextType.B1220)), false);

                for (const data of subDataArray) {
                    group.addItem(createTaskObjectiveRenderer(data), false);
                }
            }

            group.arrangeItems();
        }
    }

    private _updateBtnCop(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const player    = war.getPlayerInTurn();
        const btn       = this._btnCop;
        if ((war.getActionPlanner().getStateId() !== ActionPlannersConstants.StateId.Idle)     ||
            (war.getTurnManager().getPhaseCode() !== TurnsConstants.PhaseCode.Main)        ||
            (!war.checkIsHumanInTurn())                                         ||
            (player.getCoEnergyType() !== CosConstants.EnergyTypeId.Trilogy)                            ||
            (player.getCoPowerEnergy() == null)
        ) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setIconSource(player.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.Power) ? `commonIcon0009` : `commonIcon0010`);
        }
    }

    private _updateBtnScop(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const player    = war.getPlayerInTurn();
        const btn       = this._btnScop;
        if ((war.getActionPlanner().getStateId() !== ActionPlannersConstants.StateId.Idle)   ||
            (war.getTurnManager().getPhaseCode() !== TurnsConstants.PhaseCode.Main)      ||
            (!war.checkIsHumanInTurn())                                       ||
            (player.getCoEnergyType() !== CosConstants.EnergyTypeId.Trilogy)                            ||
            (player.getCoSuperPowerEnergy() == null)
        ) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setIconSource(player.checkCanUseCoSkill(CoSkillsConstants.SkillTypeId.SuperPower) ? `commonIcon0011` : `commonIcon0012`);
        }
    }

    private _updateButtonsForRetract(): void {
        const canRetract = !!this.getOpenData()?.war.getRetractManager().getCanRetract();
        this._btnUndo.setIsVisible(canRetract);
        this._btnRedo.setIsVisible(canRetract);
    }

    private _updateBtnEndTurn(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const turnManager = war.getTurnManager();
        this._btnEndTurn.setIsVisible(
            (war.getActionPlanner().getStateId() === ActionPlannersConstants.StateId.Idle) &&
            (war.checkIsHumanInTurn())                                      &&
            (turnManager.getPhaseCode() === TurnsConstants.PhaseCode.Main)
        );
    }

    private _updateBtnNextUnit(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const turnManager   = war.getTurnManager();
        const btn           = this._btnNextUnit;
        if ((war.getActionPlanner().getStateId() !== ActionPlannersConstants.StateId.Idle) ||
            (!war.checkIsHumanInTurn())                                     ||
            (turnManager.getPhaseCode() !== TurnsConstants.PhaseCode.Main)
        ) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setIconSource(war.getIdleUnitGridIndex() == null ? `commonIcon0018` : `commonIcon0015`);

            const playerIndex       = turnManager.getPlayerIndexInTurn();
            let groundUnitsCount    = 0;
            let airUnitsCount       = 0;
            let navalUnitsCount     = 0;
            for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                if ((unit.getActionState() !== UnitsConstants.ActionStateId.Idle)  ||
                    (unit.getPlayerIndex() !== playerIndex)
                ) {
                    continue;
                }

                const layer = unit.getTemplateCfg().getLayer();
                if (layer === UnitsConstants.DisplayLayerId.Ground) {
                    ++groundUnitsCount;
                } else if (layer === UnitsConstants.DisplayLayerId.Air) {
                    ++airUnitsCount;
                } else if (layer === UnitsConstants.DisplayLayerId.Sea) {
                    ++navalUnitsCount;
                }
            }
            btn.setExtraText(`${groundUnitsCount} / ${airUnitsCount} / ${navalUnitsCount}`);
        }
    }

    private _updateBtnNextTile(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        const turnManager   = war.getTurnManager();
        const btn           = this._btnNextTile;
        if ((actionPlanner.getStateId() !== ActionPlannersConstants.StateId.Idle)  ||
            (!war.checkIsHumanInTurn())                             ||
            (turnManager.getPhaseCode() !== TurnsConstants.PhaseCode.Main)
        ) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setIconSource(war.getIdleBuildingGridIndex() == null ? `commonIcon0019` : `commonIcon0016`);
        }
    }

    private _updateBtnCancel(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const turnManager       = war.getTurnManager();
        const actionPlanner     = war.getActionPlanner();
        const state             = actionPlanner.getStateId();
        this._btnCancel.setIsVisible(
            (state !== ActionPlannersConstants.StateId.Idle)             &&
            (state !== ActionPlannersConstants.StateId.ExecutingAction)  &&
            (!actionPlanner.checkIsStateRequesting())       &&
            (war.checkIsHumanInTurn())                      &&
            (turnManager.getPhaseCode() === TurnsConstants.PhaseCode.Main)
        );
    }
}

function createLabelForTaskObjectiveCategory(text: string): UiInterfacesIUiLabel.IUiLabel {
    const label = new (UiUtilsUiFactory.getUiLabelClass());
    label.setText(text);
    // label.setIsBold(true);
    label.setFontSize(8);
    label.setTextColor(0xC9D3DF);
    return label;
}
function createTaskObjectiveRenderer(data: DataForTaskObjectiveRenderer): TaskObjectiveRenderer {
    const renderer = new TaskObjectiveRenderer();
    renderer.setData(data);
    return renderer;
}
function getDataArrayForTaskObjectiveRenderer(war: IBwWar, allTaskObjectiveArray: TaskObjective[], stateArray: TaskObjectiveState[], isMain: boolean): DataForTaskObjectiveRenderer[] {
    const dataArray: DataForTaskObjectiveRenderer[] = [];
    for (const taskObjective of allTaskObjectiveArray.filter(v => isMain === !!v.getIsMain())) {
        const objectiveId = taskObjective.getObjectiveId() ?? 0;
        if (!stateArray.find(v => (v.getObjectiveId() ?? 0) === objectiveId)?.getIsHidden()) {
            dataArray.push({
                war             : war,
                taskObjective   : taskObjective,
            });
        }
    }
    return dataArray;
}

interface DataForTaskObjectiveRenderer {
    taskObjective   : TaskObjective;
    war             : IBwWar;
}
class TaskObjectiveRenderer extends UiComponentsUiContainer.UiContainer {
    private readonly _groupCompleted!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCompleted!     : UiInterfacesIUiImage.IUiImage;
    private readonly _labelDesc!        : UiInterfacesIUiLabel.IUiLabel;

    private _data           : DataForTaskObjectiveRenderer | null = null;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "component/taskObjective/TaskObjective002.exml");
    }

    public updateOnLoadedSkin(): void {
        this._updateView();
    }

    public setData(data: DataForTaskObjectiveRenderer): void {
        this._data = data;
        this._updateView();
    }
    public getData(): DataForTaskObjectiveRenderer | null {
        return this._data;
    }

    private _updateView(): void {
        const data = this.getData();
        if (data == null) {
            this.setIsVisible(false);
            return;
        } else {
            this.setIsVisible(true);
        }

        const taskObjective     = data.taskObjective;
        const objectiveId       = taskObjective.getObjectiveId() ?? 0;
        const maxProgress       = taskObjective.getMaxProgress();
        const currentProgress   = data.war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) == objectiveId)?.getCurrentProgress() ?? 0;
        const labelDesc         = this._labelDesc;
        labelDesc.setText(`(${currentProgress}${maxProgress == null ? `` : ` / ${maxProgress}`}) ${LangUtils.getLanguageText({ textArray: taskObjective.getDesc() })}`);
        this.setUnscaledManualHeight(labelDesc.getScaledHeight());

        const groupCompleted = this._groupCompleted;
        if (maxProgress == null) {
            groupCompleted.setIsVisible(false);
        } else {
            groupCompleted.setIsVisible(true);
            this._imgCompleted.setIsVisible(currentProgress >= maxProgress);
        }
    }
}
