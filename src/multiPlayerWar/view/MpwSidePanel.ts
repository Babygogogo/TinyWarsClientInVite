import { StateId } from "../../actionPlanners/Constants.ts";
import { ChoosingCoActiveSkillTarget } from "../../actionPlanners/states/ChoosingCoActiveSkillTarget.ts";
import { Idle } from "../../actionPlanners/states/Idle.ts";
import { RequestingPlayerEndTurn } from "../../actionPlanners/states/RequestingPlayerEndTurn.ts";
import { RequestingPlayerUseCoActiveSkill } from "../../actionPlanners/states/RequestingPlayerUseCoActiveSkill.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { EnergyTypeId } from "../../cos/Constants.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { getPowerSkillTargetsCount } from "../../coSkills/utils/Common.ts";
import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { checkIsAnyPromiseTrue } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
    getLanguageText,
} from "../../lang/Utils.ts";
import type { IMpwWar } from "../interface/IMpwWar.ts";
import { checkIsRedForAllMyWars } from "../model/MpwModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { TaskObjective } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type { TaskObjectiveState } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import {
    playCoBgmWithWar,
    playShortSfx,
} from "../../sounds/SoundPlayer.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { PhaseCode } from "../../turns/Constants.ts";
import { UiContainer } from "../../ui/components/UiContainer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { getUiLabelClass } from "../../ui/utils/UiFactory.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import {
    ActionStateId,
    DisplayLayerId,
} from "../../units/Constants.ts";
import { getSelfSettingsCoBgmCodeArray } from "../../users/Model.ts";
import { getWatchIncomingInfo } from "../../watchWar/model/WwModel.ts";

let _showTaskObjective = false;

export interface OpenData {
    war : IMpwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupLeft!                : IUiContainer;
    private readonly _btnCop!                   : IUiButton;
    private readonly _btnScop!                  : IUiButton;

    private readonly _groupRight!               : IUiContainer;
    private readonly _btnNextUnit!              : IUiButton;
    private readonly _btnNextTile!              : IUiButton;
    private readonly _btnEndTurn!               : IUiButton;
    private readonly _btnCancel!                : IUiButton;
    private readonly _btnInfo!                  : IUiButton;
    private readonly _btnMenu!                  : IUiButton;

    private readonly _btnTaskObjective!         : IUiButton;
    private readonly _groupTaskObjectiveWindow! : IUiContainer;
    private readonly _scrollerTaskObjective!    : IUiScroller<IUiLayout>;
    private readonly _groupTaskObjective!       : IUiLayout;
    private readonly _btnCloseTaskObjective!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.TimeTick,                        callback: this._onNotifyTimeTick },

            { type: TypeId.MouseRightButtonClicked,         callback: this._onNotifyMouseRightButtonClicked },
            { type: TypeId.BwTurnPhaseCodeChanged,          callback: this._onNotifyBwTurnPhaseCodeChanged },
            { type: TypeId.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: TypeId.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
            { type: TypeId.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
            { type: TypeId.ActionPlannerStateChanged,       callback: this._onNotifyActionPlannerStateChanged },
            { type: TypeId.MsgMpwWatchGetIncomingInfo,      callback: this._onNotifyMsgMpwWatchGetIncomingInfo },
            { type: TypeId.WarOperationNormalExecuted,      callback: this._onNotifyWarOperationNormalExecuted },
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
        this._btnCop.setShortSfxCode(ShortSfxCode.None);
        this._btnScop.setShortSfxCode(ShortSfxCode.None);
        this._btnNextUnit.setShortSfxCode(ShortSfxCode.None);
        this._btnNextTile.setShortSfxCode(ShortSfxCode.None);
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
        if (getServerTimestamp() % 30 == 0) {
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
            Idle.getInstance().apply(planner);
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
        playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
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
        playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
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

        const skillType     = SkillTypeId.Power;
        const playerInTurn  = war.getPlayerInTurn();
        if (!playerInTurn.checkCanUseCoSkill(skillType)) {
            playShortSfx(ShortSfxCode.ButtonForbidden01);
        } else {
            playShortSfx(ShortSfxCode.ButtonNeutral01);

            const targetsCount  = getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
            const actionPlanner = war.getActionPlanner();
            if (targetsCount <= 0) {
                openPanel(getDict().CommonConfirmPanel, {
                    getTitle    : () => getText(TextType.B0142),
                    getContent  : () => getText(TextType.A0054),
                    callback    : () => RequestingPlayerUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null),
                });
            } else {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent  : () => getFormattedText(TextType.F0205, targetsCount),
                    callback    : () => ChoosingCoActiveSkillTarget.getInstance().doApplyOnTouchButton(actionPlanner, skillType),
                });
            }
        }
    }
    private _onTouchedBtnScop(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const skillType     = SkillTypeId.SuperPower;
        const playerInTurn  = war.getPlayerInTurn();
        if (!playerInTurn.checkCanUseCoSkill(skillType)) {
            playShortSfx(ShortSfxCode.ButtonForbidden01);
        } else {
            playShortSfx(ShortSfxCode.ButtonNeutral01);

            const targetsCount  = getPowerSkillTargetsCount(playerInTurn.getCoBasicCfg(), skillType);
            const actionPlanner = war.getActionPlanner();
            if (targetsCount <= 0) {
                openPanel(getDict().CommonConfirmPanel, {
                    getTitle    : () => getText(TextType.B0144),
                    getContent  : () => getText(TextType.A0058),
                    callback    : () => RequestingPlayerUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null),
                });
            } else {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent  : () => getFormattedText(TextType.F0205, targetsCount),
                    callback    : () => ChoosingCoActiveSkillTarget.getInstance().doApplyOnTouchButton(actionPlanner, skillType),
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
        if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getStateId() !== StateId.ExecutingAction)) {
            Idle.getInstance().apply(actionPlanner);

            const gridIndex = war.getIdleUnitGridIndex();
            if (!gridIndex) {
                playShortSfx(ShortSfxCode.ButtonForbidden01);
            } else {
                const cursor = field.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                playShortSfx(ShortSfxCode.ButtonNeutral01);
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
        if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getStateId() !== StateId.ExecutingAction)) {
            Idle.getInstance().apply(actionPlanner);

            const gridIndex = war.getIdleBuildingGridIndex();
            if (!gridIndex) {
                playShortSfx(ShortSfxCode.ButtonForbidden01);
            } else {
                const cursor = field.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                playShortSfx(ShortSfxCode.ButtonNeutral01);
            }
        }
    }
    private _onTouchedBtnEndTurn(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(war.getPlayerIndexInTurn())) {
            show(getText(TextType.A0034));
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getTitle    : () => getText(TextType.B0036),
                getContent  : () => war.getHintForEndTurn(),
                callback    : () => RequestingPlayerEndTurn.getInstance().doApplyOnChooseAction(war.getActionPlanner()),
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
            Idle.getInstance().apply(planner);
        }
    }
    private _onTouchedBtnInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            Idle.getInstance().apply(actionPlanner);
        }
        openPanel(getDict().BwWarInfoPanel, { war });
    }
    private _onTouchedBtnMenu(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            Idle.getInstance().apply(actionPlanner);
        }
        openPanel(getDict().MpwWarMenuPanel, { war: war });
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
        this._btnCop.setLangText(TextType.B0142);
        this._btnScop.setLangText(TextType.B0144);
        this._btnNextUnit.setLangText(TextType.B0685);
        this._btnNextTile.setLangText(TextType.B0686);
        this._btnEndTurn.setLangText(TextType.B0036);
        this._btnCancel.setLangText(TextType.B0154);
        this._btnInfo.setLangText(TextType.B0223);
        this._btnMenu.setLangText(TextType.B0155);
        this._btnTaskObjective.setLangText(TextType.B1480);

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
                group.addItem(createLabelForTaskObjectiveCategory(getText(TextType.B1217)), false);

                for (const data of mainDataArray) {
                    group.addItem(createTaskObjectiveRenderer(data), false);
                }
            }

            if (subDataArray.length) {
                group.addItem(createLabelForTaskObjectiveCategory(getText(TextType.B1220)), false);

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
        if ((war.getActionPlanner().getStateId() !== StateId.Idle)     ||
            (war.getTurnManager().getPhaseCode() !== PhaseCode.Main)        ||
            (player.getPlayerIndex() !== war.getPlayerIndexLoggedIn())          ||
            (player.getCoEnergyType() !== EnergyTypeId.Trilogy)                 ||
            (player.getCoPowerEnergy() == null)
        ) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setIconSource(player.checkCanUseCoSkill(SkillTypeId.Power) ? `commonIcon0009` : `commonIcon0010`);
        }
    }

    private _updateBtnScop(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const player    = war.getPlayerInTurn();
        const btn       = this._btnScop;
        if ((war.getActionPlanner().getStateId() !== StateId.Idle)     ||
            (war.getTurnManager().getPhaseCode() !== PhaseCode.Main)        ||
            (player.getPlayerIndex() !== war.getPlayerIndexLoggedIn())          ||
            (player.getCoEnergyType() !== EnergyTypeId.Trilogy)                            ||
            (player.getCoSuperPowerEnergy() == null)
        ) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setIconSource(player.checkCanUseCoSkill(SkillTypeId.SuperPower) ? `commonIcon0011` : `commonIcon0012`);
        }
    }

    private _updateBtnEndTurn(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const turnManager = war.getTurnManager();
        this._btnEndTurn.setIsVisible((war.getActionPlanner().getStateId() === StateId.Idle)
            && (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
            && (turnManager.getPhaseCode() === PhaseCode.Main)
        );
    }

    private _updateBtnNextUnit(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const turnManager   = war.getTurnManager();
        const btn           = this._btnNextUnit;
        if ((war.getActionPlanner().getStateId() !== StateId.Idle)         ||
            (turnManager.getPlayerIndexInTurn() !== war.getPlayerIndexLoggedIn())   ||
            (turnManager.getPhaseCode() !== PhaseCode.Main)
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
                if ((unit.getActionState() !== ActionStateId.Idle)  ||
                    (unit.getPlayerIndex() !== playerIndex)
                ) {
                    continue;
                }

                const layer = unit.getTemplateCfg().getLayer();
                if (layer === DisplayLayerId.Ground) {
                    ++groundUnitsCount;
                } else if (layer === DisplayLayerId.Air) {
                    ++airUnitsCount;
                } else if (layer === DisplayLayerId.Sea) {
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
        if ((actionPlanner.getStateId() !== StateId.Idle)            ||
            (turnManager.getPlayerIndexInTurn() !== war.getPlayerIndexLoggedIn())   ||
            (turnManager.getPhaseCode() !== PhaseCode.Main)
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
            (state !== StateId.Idle)                                     &&
            (state !== StateId.ExecutingAction)                          &&
            (!actionPlanner.checkIsStateRequesting())                               &&
            (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())   &&
            (turnManager.getPhaseCode() === PhaseCode.Main)
        );
    }

    private async _updateBtnMenu(): Promise<void> {
        const warId = this.getOpenData()?.war.getWarId() ?? 0;
        this._btnMenu.setRedVisible(await checkIsAnyPromiseTrue([
            checkIsRedForAllMyWars([warId]),
            !!(await getWatchIncomingInfo(warId))?.getRequestSrcUserIdArray()?.length,
        ]));
    }
}

function createLabelForTaskObjectiveCategory(text: string): IUiLabel {
    const label = new (getUiLabelClass());
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
    war             : IBwWar;
}
class TaskObjectiveRenderer extends UiContainer {
    private readonly _groupCompleted!   : IUiContainer;
    private readonly _imgCompleted!     : IUiImage;
    private readonly _labelDesc!        : IUiLabel;

    private _data           : DataForTaskObjectiveRenderer | null = null;

    public constructor() {
        super();

        loadSkinByPath(this, "component/taskObjective/TaskObjective002.exml");
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
        labelDesc.setText(`(${currentProgress}${maxProgress == null ? `` : ` / ${maxProgress}`}) ${getLanguageText({ textArray: taskObjective.getDesc() })}`);
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
