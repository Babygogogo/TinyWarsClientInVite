import { StateId } from "../../actionPlanners/Constants.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { getMpwWarClass, getSpwWarClass, getMeWarClass, getUnitViewClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCurrentGameEssentialConfig } from "../../gameVersions/Utils.ts";
import { TextureResolutionId } from "../../graphics/Constants.ts";
import { type PointerUnifiedEventData, PointerEventType, MouseStyleType } from "../../helpers/PointerInput.ts";
import { getNumText, getSignedNumText } from "../../helpers/Text.ts";
import { UndefinedError } from "../../lang/Constants.ts";
import { getUnitName } from "../../lang/Utils.ts";
import type { BwUnitChanged } from "../../notifications/DataTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiContainer } from "../../ui/components/UiContainer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import type { IUnit } from "../../units/IUnit.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { checkIsUnitOnMapVisibleToTeams } from "../../visibilities/Utils.ts";

const _CELL_WIDTH   = 70;

export interface OpenData {
    war : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _group!        : IUiContainer;
    private readonly _btnExpand!    : IUiButton;
    private readonly _btnNarrow!    : IUiButton;

    private _cellList           : BwUnitBriefCell[] = [];

    private _unitList   : IUnit[] = [];
    private _isExpanded = true;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            // { type: NotifyType.GlobalTouchBegin,                callback: this._onNotifyGlobalTouchBegin },
            // { type: NotifyType.GlobalTouchMove,                 callback: this._onNotifyGlobalTouchMove },
            { type: TypeId.BwCursorGridIndexChanged,        callback: this._onNotifyBwCursorGridIndexChanged },
            { type: TypeId.ActionPlannerStateSet,           callback: this._onNotifyActionPlannerStateSet },
            { type: TypeId.BwProduceUnitPanelOpened,        callback: this._onNotifyBwProduceUnitPanelOpened },
            { type: TypeId.BwProduceUnitPanelClosed,        callback: this._onNotifyBwProduceUnitPanelClosed },
            { type: TypeId.BwUnitChanged,                   callback: this._onNotifyBwUnitChanged },
            { type: TypeId.BwUnitCustomNameArrayChanged,    callback: this._onNotifyBwUnitCustomNameArrayChanged },
            { type: TypeId.BwUnitCustomNameIdChanged,       callback: this._onNotifyBwUnitCustomNameIdChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnExpand,  callback: this._onTouchedBtnExpand },
            { ui: this._btnNarrow,  callback: this._onTouchedBtnNarrow },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        for (const cell of this._cellList) {
            this._destroyCell(cell);
        }
        this._cellList.length = 0;
        this._unitList.length = 0;

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // private _onNotifyGlobalTouchBegin(e: egret.Event): void {
    //     this._adjustPositionOnTouch(e.data);
    // }
    // private _onNotifyGlobalTouchMove(e: egret.Event): void {
    //     this._adjustPositionOnTouch(e.data);
    // }
    private _onNotifyBwCursorGridIndexChanged(): void {
        this._updateView();
    }
    private _onNotifyActionPlannerStateSet(): void {
        const planner = this.getOpenData()?.war.getActionPlanner();
        if (planner == null) {
            return;
        }

        if ((planner.getPreviousStateId() === StateId.ExecutingAction) &&
            (planner.getStateId() !== StateId.ExecutingAction)
        ) {
            this._updateView();
        }
    }
    private _onNotifyBwProduceUnitPanelOpened(): void {
        this._updateView();
    }
    private _onNotifyBwProduceUnitPanelClosed(): void {
        this._updateView();
    }
    private _onNotifyBwUnitChanged(e: Event): void {
        const gridIndex = this.getOpenData()?.war.getCursor().getGridIndex();
        if (gridIndex == null) {
            return;
        }

        const data = e.data as BwUnitChanged;
        if (data.gridIndex.checkIsEqual(gridIndex)) {
            this._updateView();
        }
    }
    private _onNotifyBwUnitCustomNameArrayChanged(): void {
        for (const cell of this._cellList) {
            cell.updateLabelName();
        }
    }
    private _onNotifyBwUnitCustomNameIdChanged(): void {
        for (const cell of this._cellList) {
            cell.updateLabelName();
        }
    }

    private _onTouchedBtnExpand(): void {
        this._isExpanded = true;
        this._updateView();
    }
    private _onTouchedBtnNarrow(): void {
        this._isExpanded = false;
        this._updateView();
    }

    private _onCellTouchTap(e: Event): void {
        const dispatcher = (e.data as PointerUnifiedEventData).dispatcher;
        if (dispatcher == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const war       = this.getOpenData()?.war;
        const canDelete = (war instanceof getMpwWarClass())
            || (war instanceof getSpwWarClass())
            || (war instanceof getMeWarClass());
        for (let i = 0; i < this._cellList.length; ++i) {
            if (this._cellList[i] === dispatcher) {
                openPanel(getDict().BwUnitDetailPanel, {
                    unit        : this._unitList[i],
                    canDelete   : canDelete,
                });
                return;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (!war.getIsRunning()) {
            this.setIsVisible(false);
            return;
        }

        this.setIsVisible(true);

        const isExpanded = this._isExpanded;
        this._btnExpand.setIsVisible(!isExpanded);
        this._btnNarrow.setIsVisible(isExpanded);
        this._group.setIsVisible(isExpanded);

        const unitList  = this._unitList;
        unitList.length = 0;

        const unitMap       = war.getUnitMap();
        const gridIndex     = war.getCursor().getGridIndex();
        const unitOnMap     = unitMap.getUnitOnMap(gridIndex);
        const teamIndexes   = war.getPlayerManager().getWatcherTeamIndexesForSelf();

        if ((unitOnMap)                                         &&
            (checkIsUnitOnMapVisibleToTeams({
                war                 : war,
                gridIndex           : gridIndex,
                unitType            : unitOnMap.getUnitType(),
                isDiving            : unitOnMap.getIsDiving(),
                isInvisible         : unitOnMap.checkIsInvisible(gridIndex),
                unitPlayerIndex     : unitOnMap.getPlayerIndex(),
                observerTeamIndexes : teamIndexes
            }))
        ) {
            unitList.push(unitOnMap);

            for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unitOnMap, true)) {
                unitList.push(loadedUnit);
            }
        }

        this._group.removeUiChildren();
        const cellList  = this._cellList;
        const length    = unitList.length;
        this._group.setUnscaledManualWidth(length * _CELL_WIDTH);
        for (let i = 0; i < length; ++i) {
            cellList[i] = cellList[i] || this._createCell();
            cellList[i].setUnit(unitList[i]);
            this._group.addUiChild(cellList[i]);
        }

        this._updatePosition();
    }

    // private async _adjustPositionOnTouch(e: egret.TouchEvent): Promise<void> {
    //     const tileBriefPanel = TwnsBwTileBriefPanel.BwTileBriefPanel.getInstance();
    //     let target = e.target as egret.DisplayObject;
    //     while (target) {
    //         if ((target) && ((target === tileBriefPanel) || (target === this))) {
    //             return;
    //         }
    //         target = target.parent;
    //     }

    //     const stageWidth        = StageManager.getStage().stageWidth;
    //     const currentIsLeftSide = this._isLeftSide;
    //     const newIsLeftSide     = e.stageX >= stageWidth / 4 * 3
    //         ? true
    //         : (e.stageX < stageWidth / 4
    //             ? false
    //             : currentIsLeftSide
    //         );
    //     if (newIsLeftSide !== currentIsLeftSide) {
    //         await this._showCloseAnimation();
    //         this._isLeftSide = newIsLeftSide;
    //         this._updatePosition();
    //         this._showOpenAnimation();
    //     }
    // }

    private _updatePosition(): void {
        const cellList  = this._cellList;
        const length    = this._unitList.length;
        for (let i = 0; i < length; ++i) {
            cellList[i].setX(_CELL_WIDTH * i);
        }
    }

    private _createCell(): BwUnitBriefCell {
        const cell = new BwUnitBriefCell();
        cell.setIsTouchEnabled(true);
        cell.getEventAgent().addPointerEventListener(PointerEventType.Tap, this._onCellTouchTap, this);
        return cell;
    }
    private _destroyCell(cell: BwUnitBriefCell) {
        cell.setIsTouchEnabled(false);
        cell.getEventAgent().removePointerEventListener(PointerEventType.Tap, this._onCellTouchTap, this);
        cell.dispose();
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            tweenTime   : 50,
        });

        await wait(50);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
            tweenTime   : 50,
        });

        await wait(50);
    }
}

const _IMAGE_SOURCE_HP          = `c04_t10_s00_f00`;
const _IMAGE_SOURCE_FUEL        = `c04_t10_s01_f00`;
const _IMAGE_SOURCE_AMMO        = `c04_t10_s02_f00`;
const _IMAGE_SOURCE_MATERIAL    = `c04_t10_s05_f00`;
const _IMAGE_SOURCE_FLARE       = `c04_t10_s02_f00`;

class BwUnitBriefCell extends UiContainer {
    private readonly _group!        : IUiContainer;
    private readonly _conUnitView!  : IUiContainer;
    private readonly _labelName!    : IUiLabel;
    private readonly _labelBonus!   : IUiLabel;

    private readonly _groupAttr!    : IUiLayout;

    private readonly _imgHp!        : IUiImage;
    private readonly _labelHp!      : IUiLabel;

    private readonly _imgFuel!      : IUiImage;
    private readonly _labelFuel!    : IUiLabel;

    private readonly _imgState!     : IUiImage;
    private readonly _labelState!   : IUiLabel;

    private readonly _unitView      = new (getUnitViewClass())();

    private _unit               : IUnit | null = null;

    public constructor() {
        super();

        this.setIsTouchChildrenEnabled(false);
        this.setMouseStyle(MouseStyleType.Pointer);

        const resTypeId = getCurrentGameEssentialConfig().textureResolutionTypeId;
        loadSkinByPath(
            this,
            resTypeId === TextureResolutionId.Dor
                ? `baseWar/BwUnitBriefCell.exml`
                : `baseWar/BwUnitBriefCell_res${getNumText(resTypeId)}.exml`
        );
    }

    public updateOnLoadedSkin(): void {
        this._imgHp.loadSource(_IMAGE_SOURCE_HP);
        this._imgFuel.loadSource(_IMAGE_SOURCE_FUEL);
        this._conUnitView.addUiChild(this._unitView);
        this._updateView();
    }

    public setUnit(unit: IUnit): void {
        this._unit = unit;
        this._updateView();
    }

    public updateLabelName(): void {
        const unit = this._unit;
        if (unit == null) {
            return;
        }

        this._labelName.setText(
            unit.getCustomName()                                        ??
            getUnitName(unit.getUnitType(), unit.getGcData())  ??
            UndefinedError
        );
    }

    public dispose(): void {
        this._unitView.stopRunningView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const unit = this._unit;
        if (unit == null) {
            return;
        }

        this._unitView.init(unit).startRunningView();
        this._labelHp.setText(`${unit.getCurrentHp()}`);
        this._labelFuel.setText(`${unit.getCurrentFuel()}`);
        this.updateLabelName();

        if (unit.getMaxBuildMaterial() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(_IMAGE_SOURCE_MATERIAL);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getCurrentBuildMaterial()}`);
        } else if (unit.getMaxProduceMaterial() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(_IMAGE_SOURCE_MATERIAL);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getCurrentProduceMaterial()}`);
        } else if (unit.getFlareMaxAmmo() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(_IMAGE_SOURCE_FLARE);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getFlareCurrentAmmo()}`);
        } else if (unit.getPrimaryWeaponMaxAmmo() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(_IMAGE_SOURCE_AMMO);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getPrimaryWeaponCurrentAmmo()}`);
        } else {
            this._imgState.setIsVisible(false);
            this._labelState.setIsVisible(false);
        }
        this._groupAttr.arrangeItems();

        this._updateLabelBonus();
    }
    private _updateLabelBonus(): void {
        const unit  = this._unit;
        const label = this._labelBonus;
        if (unit == null) {
            label.setText(``);
            return;
        }

        const war                   = unit.getWar();
        const unitPlayerIndex       = unit.getPlayerIndex();
        const tileMap               = war.getTileMap();
        const gridIndex             = unit.getGridIndex();
        const playerRule            = war.getCommonSettingManager().getPlayerRule(unitPlayerIndex);
        const observerTeamIndexSet  = getObserverTeamIndexSet(war);

        const attackBonusFromCommonSettings = playerRule.getAttackPowerModifier();
        const attackBonusFromGlobalTiles    = war.getTileMap().getTotalGlobalAttackBonus(unitPlayerIndex, observerTeamIndexSet, false);
        const attackBonusFromPromotion      = unit.getPromotionAttackBonus();
        const attackBonusFromOpa            = war.getWarEventManager().getOpaAttackPowerModifier(unit, gridIndex);
        const attackBonusFromWeather        = unit.getAttackModifierByWeather(gridIndex, observerTeamIndexSet, false);
        const attackBonusFromCo             = unit.getAttackModifierByCo({
            selfGridIndex               : gridIndex,
            isCounter                   : false,
            observerTeamIndexSet        : observerTeamIndexSet,
            useDamagePreviewSettings    : false,
        });
        const totalAttackBonus              = Math.floor(attackBonusFromCommonSettings + attackBonusFromGlobalTiles + attackBonusFromPromotion + attackBonusFromOpa + attackBonusFromWeather + attackBonusFromCo);

        const defenseBonusFromTile          = tileMap.getTile(gridIndex).getDefenseAmountForUnit(unit, observerTeamIndexSet, false);
        const defenseBonusFromPromotion     = unit.getPromotionDefenseBonus();
        const defenseBonusFromRule          = playerRule.getDefenseModifier();
        const defenseBonusFromOpa           = war.getWarEventManager().getOpaDefenseModifier(unit, gridIndex);
        const defenseBonusFromGlobalTiles   = tileMap.getTotalGlobalDefenseBonus(unitPlayerIndex, observerTeamIndexSet, false);
        const defenseBonusFromCo            = unit.getDefenseModifierByCo({
            selfGridIndex               : gridIndex,
            attackerUnitTypeId          : null,
            observerTeamIndexSet        : observerTeamIndexSet,
            useDamagePreviewSettings    : false,
        });
        const totalDefenseBonus             = Math.floor(defenseBonusFromTile + defenseBonusFromPromotion + defenseBonusFromRule + defenseBonusFromOpa + defenseBonusFromGlobalTiles + defenseBonusFromCo);

        label.setText(`A ${getSignedNumText(totalAttackBonus)}%\nD ${getSignedNumText(totalDefenseBonus)}%`);
    }
}

function getObserverTeamIndexSet(war: IBwWar): Set<number> | null {
    if (war instanceof getSpwWarClass()) {
        const set           = new Set<number>();
        const playerInTurn  = war.getPlayerInTurn();
        if (playerInTurn.getUserId() != null) {
            set.add(playerInTurn.getTeamIndex());
        }

        return set;
    }

    return null;
}
