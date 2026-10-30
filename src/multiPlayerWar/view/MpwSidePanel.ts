import {
    Helpers_Misc,
    MultiPlayerWar_Model_MpwModel,
    ActionPlanners_States_ChoosingCoActiveSkillTarget,
    Cos_Constants,
    GamePanels_Dict,
    Lang_Utils,
    CoSkills_Utils_Common,
    Timer_TimerModel,
    ActionPlanners_States_Idle,
    GamePanels_Manager,
    Turns_Constants,
    Sounds_SoundPlayer,
    ActionPlanners_States_RequestingPlayerEndTurn,
    ActionPlanners_States_RequestingPlayerUseCoActiveSkill,
    Sounds_Constants,
    FloatText,
    CoSkills_Constants,
    ActionPlanners_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiContainer,
    Ui_Components_UiLabel,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type MultiPlayerWar_Interface_IMpwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    Units_Constants,
    Users_Model,
    WatchWar_Model_WwModel,
    Ui_Utils_UiSkinHelpers,
} from "../../internal.ts";
import type { TaskObjective } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type { TaskObjectiveState } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";

let _showTaskObjective = false;

export interface OpenData {
    war : MultiPlayerWar_Interface_IMpwWar.IMpwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupLeft!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnCop!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnScop!                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupRight!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnNextUnit!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextTile!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnEndTurn!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnInfo!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMenu!                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnTaskObjective!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupTaskObjectiveWindow! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _scrollerTaskObjective!    : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupTaskObjective!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnCloseTaskObjective!    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.TimeTick,                        callback: this._onNotifyTimeTick },

            { type: Notifications_TypeId.TypeId.MouseRightButtonClicked,         callback: this._onNotifyMouseRightButtonClicked },
            { type: Notifications_TypeId.TypeId.BwTurnPhaseCodeChanged,          callback: this._onNotifyBwTurnPhaseCodeChanged },
            { type: Notifications_TypeId.TypeId.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: Notifications_TypeId.TypeId.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
            { type: Notifications_TypeId.TypeId.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
            { type: Notifications_TypeId.TypeId.ActionPlannerStateChanged,       callback: this._onNotifyActionPlannerStateChanged },
            { type: Notifications_TypeId.TypeId.MsgMpwWatchGetIncomingInfo,      callback: this._onNotifyMsgMpwWatchGetIncomingInfo },
            { type: Notifications_TypeId.TypeId.WarOperationNormalExecuted,      callback: this._onNotifyWarOperationNormalExecuted },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCop,                 callback: this._onTouchedBtnCop },
            { ui: this._btnScop,                callback: this._onTouchedBtnScop },
            { ui: this._btnNextUnit,            callback: this._onTouchedBtnNextUnit, },
            { ui: this._btnNextTile,            callback: this._onTouchedBtnNextTile, },
            { ui: this._btnEndTurn,             callback: this._onTouchedBtnEndTurn, },
            { ui: this._btnCancel,              callback: this._onTouchedBtnCancel },
            { ui: this._btnInfo,                callback: this._onTouchedBtnInfo },
            { ui: this._btnMenu,                callback: this._onTouchedBtnMenu, },
            { ui: this._btnTaskObjective,       callback: this._onTouchedBtnTaskObjective },
            { ui: this._btnCloseTaskObjective,  callback: this._onTouchedBtnCloseTaskObjective },
        ]);
        this._btnCop.setShortSfxCode(Sounds_Constants.ShortSfxCode.None);
        this._btnScop.setShortSfxCode(Sounds_Constants.ShortSfxCode.None);
        this._btnNextUnit.setShortSfxCode(Sounds_Constants.ShortSfxCode.None);
        this._btnNextTile.setShortSfxCode(Sounds_Constants.ShortSfxCode.None);
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
    private _onNotifyTimeTick(): void {
        if (Timer_TimerModel.getServerTimestamp() % 30 == 0) {
            this._updateBtnMenu();
        }
    }
    private _onNotifyMouseRightButtonClicked(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const planner = war.getActionPlanner();
        if ((!war.getIsExecutingAction()) && (!planner.checkIsStateRequesting())) {
            ActionPlanners_States_Idle.Idle.getInstance().apply(planner);
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
        Sounds_SoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
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
        Sounds_SoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    }
    private _onNotifyActionPlannerStateChanged(): void {
        this._updateDynamicButtons();
    }
    private _onNotifyMsgMpwWatchGetIncomingInfo(): void {
        this._updateBtnMenu();
    }
    private _onNotifyWarOperationNormalExecuted(): void {
        this._updateComponentsForTaskObjective();
    }

    private _onTouchedBtnCop(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const skillType     = CoSkills_Constants.SkillTypeId.Power;
        const playerInTurn  = war.getPlayerInTurn();
        if (!playerInTurn.checkCanUseCoSkill(skillType)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
        } else {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

            const targetsCount  = CoSkills_Utils_Common.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
            const actionPlanner = war.getActionPlanner();
            if (targetsCount <= 0) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getTitle    : () => Lang_Utils.getText(Lang_Constants.TextType.B0142),
                    getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.A0054),
                    callback    : () => ActionPlanners_States_RequestingPlayerUseCoActiveSkill.RequestingPlayerUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null),
                });
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent  : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0205, targetsCount),
                    callback    : () => ActionPlanners_States_ChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance().doApplyOnTouchButton(actionPlanner, skillType),
                });
            }
        }
    }
    private _onTouchedBtnScop(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const skillType     = CoSkills_Constants.SkillTypeId.SuperPower;
        const playerInTurn  = war.getPlayerInTurn();
        if (!playerInTurn.checkCanUseCoSkill(skillType)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
        } else {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

            const targetsCount  = CoSkills_Utils_Common.getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
            const actionPlanner = war.getActionPlanner();
            if (targetsCount <= 0) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getTitle    : () => Lang_Utils.getText(Lang_Constants.TextType.B0144),
                    getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.A0058),
                    callback    : () => ActionPlanners_States_RequestingPlayerUseCoActiveSkill.RequestingPlayerUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null),
                });
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent  : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0205, targetsCount),
                    callback    : () => ActionPlanners_States_ChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance().doApplyOnTouchButton(actionPlanner, skillType),
                });
            }
        }
    }
    private _onTouchedBtnNextUnit(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const field         = war.getField();
        const actionPlanner = field.getActionPlanner();
        if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getStateId() !== ActionPlanners_Constants.StateId.ExecutingAction)) {
            ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);

            const gridIndex = war.getIdleUnitGridIndex();
            if (!gridIndex) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
            } else {
                const cursor = field.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
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
        if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getStateId() !== ActionPlanners_Constants.StateId.ExecutingAction)) {
            ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);

            const gridIndex = war.getIdleBuildingGridIndex();
            if (!gridIndex) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
            } else {
                const cursor = field.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            }
        }
    }
    private _onTouchedBtnEndTurn(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(war.getPlayerIndexInTurn())) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0034));
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getTitle    : () => Lang_Utils.getText(Lang_Constants.TextType.B0036),
                getContent  : () => war.getHintForEndTurn(),
                callback    : () => ActionPlanners_States_RequestingPlayerEndTurn.RequestingPlayerEndTurn.getInstance().doApplyOnChooseAction(war.getActionPlanner()),
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
            ActionPlanners_States_Idle.Idle.getInstance().apply(planner);
        }
    }
    private _onTouchedBtnInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
        }
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwWarInfoPanel, { war });
    }
    private _onTouchedBtnMenu(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
        }
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwWarMenuPanel, { war: war });
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
        this._updateBtnMenu();
    }
    private _updateDynamicButtons(): void {
        this._updateBtnCop();
        this._updateBtnScop();
        this._updateBtnEndTurn();
        this._updateBtnNextUnit();
        this._updateBtnNextTile();
        this._updateBtnCancel();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCop.setLangText(Lang_Constants.TextType.B0142);
        this._btnScop.setLangText(Lang_Constants.TextType.B0144);
        this._btnNextUnit.setLangText(Lang_Constants.TextType.B0685);
        this._btnNextTile.setLangText(Lang_Constants.TextType.B0686);
        this._btnEndTurn.setLangText(Lang_Constants.TextType.B0036);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._btnInfo.setLangText(Lang_Constants.TextType.B0223);
        this._btnMenu.setLangText(Lang_Constants.TextType.B0155);
        this._btnTaskObjective.setLangText(Lang_Constants.TextType.B1480);

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
                group.addItem(createLabelForTaskObjectiveCategory(Lang_Utils.getText(Lang_Constants.TextType.B1217)), false);

                for (const data of mainDataArray) {
                    group.addItem(createTaskObjectiveRenderer(data), false);
                }
            }

            if (subDataArray.length) {
                group.addItem(createLabelForTaskObjectiveCategory(Lang_Utils.getText(Lang_Constants.TextType.B1220)), false);

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
        if ((war.getActionPlanner().getStateId() !== ActionPlanners_Constants.StateId.Idle)     ||
            (war.getTurnManager().getPhaseCode() !== Turns_Constants.PhaseCode.Main)        ||
            (player.getPlayerIndex() !== war.getPlayerIndexLoggedIn())          ||
            (player.getCoEnergyType() !== Cos_Constants.EnergyTypeId.Trilogy)                 ||
            (player.getCoPowerEnergy() == null)
        ) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setIconSource(player.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.Power) ? `commonIcon0009` : `commonIcon0010`);
        }
    }

    private _updateBtnScop(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const player    = war.getPlayerInTurn();
        const btn       = this._btnScop;
        if ((war.getActionPlanner().getStateId() !== ActionPlanners_Constants.StateId.Idle)     ||
            (war.getTurnManager().getPhaseCode() !== Turns_Constants.PhaseCode.Main)        ||
            (player.getPlayerIndex() !== war.getPlayerIndexLoggedIn())          ||
            (player.getCoEnergyType() !== Cos_Constants.EnergyTypeId.Trilogy)                            ||
            (player.getCoSuperPowerEnergy() == null)
        ) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setIconSource(player.checkCanUseCoSkill(CoSkills_Constants.SkillTypeId.SuperPower) ? `commonIcon0011` : `commonIcon0012`);
        }
    }

    private _updateBtnEndTurn(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const turnManager = war.getTurnManager();
        this._btnEndTurn.setIsVisible((war.getActionPlanner().getStateId() === ActionPlanners_Constants.StateId.Idle)
            && (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
            && (turnManager.getPhaseCode() === Turns_Constants.PhaseCode.Main)
        );
    }

    private _updateBtnNextUnit(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const turnManager   = war.getTurnManager();
        const btn           = this._btnNextUnit;
        if ((war.getActionPlanner().getStateId() !== ActionPlanners_Constants.StateId.Idle)         ||
            (turnManager.getPlayerIndexInTurn() !== war.getPlayerIndexLoggedIn())   ||
            (turnManager.getPhaseCode() !== Turns_Constants.PhaseCode.Main)
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
                if ((unit.getActionState() !== Units_Constants.ActionStateId.Idle)  ||
                    (unit.getPlayerIndex() !== playerIndex)
                ) {
                    continue;
                }

                const layer = unit.getTemplateCfg().getLayer();
                if (layer === Units_Constants.DisplayLayerId.Ground) {
                    ++groundUnitsCount;
                } else if (layer === Units_Constants.DisplayLayerId.Air) {
                    ++airUnitsCount;
                } else if (layer === Units_Constants.DisplayLayerId.Sea) {
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
        if ((actionPlanner.getStateId() !== ActionPlanners_Constants.StateId.Idle)            ||
            (turnManager.getPlayerIndexInTurn() !== war.getPlayerIndexLoggedIn())   ||
            (turnManager.getPhaseCode() !== Turns_Constants.PhaseCode.Main)
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
            (state !== ActionPlanners_Constants.StateId.Idle)                                     &&
            (state !== ActionPlanners_Constants.StateId.ExecutingAction)                          &&
            (!actionPlanner.checkIsStateRequesting())                               &&
            (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())   &&
            (turnManager.getPhaseCode() === Turns_Constants.PhaseCode.Main)
        );
    }

    private async _updateBtnMenu(): Promise<void> {
        const warId = this.getOpenData()?.war.getWarId() ?? 0;
        this._btnMenu.setRedVisible(await Helpers_Misc.checkIsAnyPromiseTrue([
            MultiPlayerWar_Model_MpwModel.checkIsRedForAllMyWars([warId]),
            !!(await WatchWar_Model_WwModel.getWatchIncomingInfo(warId))?.getRequestSrcUserIdArray()?.length,
        ]));
    }
}

function createLabelForTaskObjectiveCategory(text: string): Ui_Interfaces_IUiLabel.IUiLabel {
    const label = new Ui_Components_UiLabel.UiLabel;
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
function getDataArrayForTaskObjectiveRenderer(war: BaseWar_Interface_IBwWar.IBwWar, allTaskObjectiveArray: TaskObjective[], stateArray: TaskObjectiveState[], isMain: boolean): DataForTaskObjectiveRenderer[] {
    const dataArray: DataForTaskObjectiveRenderer[] = [];
    for (const taskObjective of allTaskObjectiveArray.filter(v => isMain === !!v.getIsMain())) {
        const objectiveId = taskObjective.getObjectiveId();
        if (!stateArray.find(v => (v.getObjectiveId()) === objectiveId)?.getIsHidden()) {
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
    war             : BaseWar_Interface_IBwWar.IBwWar;
}
class TaskObjectiveRenderer extends Ui_Components_UiContainer.UiContainer {
    private readonly _groupCompleted!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCompleted!     : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelDesc!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private _data           : DataForTaskObjectiveRenderer | null = null;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "component/taskObjective/TaskObjective002.exml");
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
        const objectiveId       = taskObjective.getObjectiveId();
        const maxProgress       = taskObjective.getMaxProgress();
        const currentProgress   = data.war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId()) == objectiveId)?.getCurrentProgress() ?? 0;
        const labelDesc         = this._labelDesc;
        labelDesc.setText(`(${currentProgress}${maxProgress == null ? `` : ` / ${maxProgress}`}) ${Lang_Utils.getLanguageText({ textArray: taskObjective.getDesc() })}`);
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
