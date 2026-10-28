import { StateId } from "./Constants.ts";
import type { IActionPlanner } from "./IActionPlanner.ts";
import type { IActionPlannerView } from "./IActionPlannerView.ts";
import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import { getGridAnimationTickCount } from "../common/model/CommonModel.ts";
import { getRwWarBaseClass, getUnitViewClass } from "../gameHelpers/GhFactory.ts";
import { DirectionId } from "../geometries/Constants.ts";
import { getCurrentTextureResolutionConfig } from "../graphics/Utils.ts";
import { createEmptyMap } from "../helpers/Collection.ts";
import { getMovePath, getMovableAreaByTick, getAttackableAreaByTick, getVisibleAreaByTick } from "../helpers/ImageSource.ts";
import { createLazyFunc, getExisted } from "../helpers/Misc.ts";
import { addEventListeners, removeEventListeners } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { Listener } from "../notifications/Types.ts";
import type { IUiContainer } from "../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../ui/interfaces/IUiImage.ts";
import { getUiContainerClass, getUiImageClass } from "../ui/utils/UiFactory.ts";
import { AnimationTypeId } from "../units/Constants.ts";
import type { IUnit } from "../units/IUnit.ts";
import type { IUnitView } from "../units/IUnitView.ts";

type IBwUnit                = IUnit;
type IBwUnitView            = IUnitView;

const getGridWidth                          = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight                         = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);
const getImageSourceMovePathEmpty           = createLazyFunc(() => ``);
const getImageSourceMovePathLineVertical    = createLazyFunc(() => getMovePath(1));
const getImageSourceMovePathLineHorizontal  = createLazyFunc(() => getMovePath(2));
const getImageSourceMovePathLineUp          = createLazyFunc(() => getMovePath(11));
const getImageSourceMovePathLineDown        = createLazyFunc(() => getMovePath(12));
const getImageSourceMovePathLineLeft        = createLazyFunc(() => getMovePath(13));
const getImageSourceMovePathLineRight       = createLazyFunc(() => getMovePath(14));
const getImageSourceMovePathArrowUp         = createLazyFunc(() => getMovePath(3));
const getImageSourceMovePathArrowDown       = createLazyFunc(() => getMovePath(4));
const getImageSourceMovePathArrowLeft       = createLazyFunc(() => getMovePath(5));
const getImageSourceMovePathArrowRight      = createLazyFunc(() => getMovePath(6));
const getImageSourceMovePathCornerDownLeft  = createLazyFunc(() => getMovePath(7));
const getImageSourceMovePathCornerDownRight = createLazyFunc(() => getMovePath(8));
const getImageSourceMovePathCornerUpLeft    = createLazyFunc(() => getMovePath(9));
const getImageSourceMovePathCornerUpRight   = createLazyFunc(() => getMovePath(10));

const getImageSourcesMovePath               = createLazyFunc(() => new Map<DirectionId, Map<DirectionId, string>>([
    [DirectionId.Undefined, new Map([
        [DirectionId.Undefined,   getImageSourceMovePathEmpty()],
        [DirectionId.Up,          getImageSourceMovePathLineUp()],
        [DirectionId.Down,        getImageSourceMovePathLineDown()],
        [DirectionId.Left,        getImageSourceMovePathLineLeft()],
        [DirectionId.Right,       getImageSourceMovePathLineRight()],
    ])],
    [DirectionId.Up, new Map([
        [DirectionId.Undefined,   getImageSourceMovePathArrowDown()],
        [DirectionId.Up,          getImageSourceMovePathEmpty()],
        [DirectionId.Down,        getImageSourceMovePathLineVertical()],
        [DirectionId.Left,        getImageSourceMovePathCornerUpLeft()],
        [DirectionId.Right,       getImageSourceMovePathCornerUpRight()],
    ])],
    [DirectionId.Down, new Map([
        [DirectionId.Undefined,   getImageSourceMovePathArrowUp()],
        [DirectionId.Up,          getImageSourceMovePathLineVertical()],
        [DirectionId.Down,        getImageSourceMovePathEmpty()],
        [DirectionId.Left,        getImageSourceMovePathCornerDownLeft()],
        [DirectionId.Right,       getImageSourceMovePathCornerDownRight()],
    ])],
    [DirectionId.Left, new Map([
        [DirectionId.Undefined,   getImageSourceMovePathArrowRight()],
        [DirectionId.Up,          getImageSourceMovePathCornerUpLeft()],
        [DirectionId.Down,        getImageSourceMovePathCornerDownLeft()],
        [DirectionId.Left,        getImageSourceMovePathEmpty()],
        [DirectionId.Right,       getImageSourceMovePathLineHorizontal()],
    ])],
    [DirectionId.Right, new Map([
        [DirectionId.Undefined,   getImageSourceMovePathArrowLeft()],
        [DirectionId.Up,          getImageSourceMovePathCornerUpRight()],
        [DirectionId.Down,        getImageSourceMovePathCornerDownRight()],
        [DirectionId.Left,        getImageSourceMovePathLineHorizontal()],
        [DirectionId.Right,       getImageSourceMovePathEmpty()],
    ])],
]));
const ALPHA_FOR_MOVABLE_GRIDS           = 0.5;
const ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL = 0.6;
const ALPHA_FOR_ATTACKABLE_GRIDS_SILO   = 0.15;
const ALPHA_FOR_VISIBLE_GRIDS_NORMAL    = 0.6;

export class ActionPlannerView implements IActionPlannerView {
    private _actionPlanner?                 : IActionPlanner;

    private _conForGrids                    = new (getUiContainerClass())();
    private _conForMovableGrids             = new (getUiContainerClass())();
    private _conForMoveDestination          = new (getUiContainerClass())();
    private _conForAttackableGrids          = new (getUiContainerClass())();
    private _conForVisibleGrids             = new (getUiContainerClass())();
    private _conForMovePath                 = new (getUiContainerClass())();
    private _imgsForMovableGrids?           : IUiImage[][];
    private _imgsForAttackableGrids?        : IUiImage[][];
    private _imgsForVisibleGrids?           : IUiImage[][];
    private readonly _imgForMoveDestination = new (getUiImageClass())({
        textureSourceName: getMovableAreaByTick(0)
    });

    private _conForUnits            = new (getUiContainerClass())();
    private _focusUnitViews         = new Map<number, IBwUnitView>();

    private _notifyEvents: Listener[] = [
        { type: TypeId.GridAnimationTick,       callback: this._onNotifyGridAnimationTick },
    ];

    public constructor() {
        const conForGrids = this._conForGrids;
        conForGrids.addUiChild(this._conForMovableGrids);
        conForGrids.addUiChild(this._conForMoveDestination);
        conForGrids.addUiChild(this._conForAttackableGrids);
        conForGrids.addUiChild(this._conForVisibleGrids);
        conForGrids.addUiChild(this._conForMovePath);
        conForGrids.setIsTouchChildrenEnabled(false);

        this._conForUnits.setIsTouchChildrenEnabled(false);
    }

    public init(actionPlanner: IActionPlanner): void {
        this._actionPlanner = actionPlanner;
    }
    public fastInit(actionPlanner: IActionPlanner): void {
        this._actionPlanner = actionPlanner;
    }

    public startRunningView(): void {
        this._initConForMovableGrids();
        this._initConForMoveDestination();
        this._initConForAttackableGrids();
        this._initConForMovePath();
        this._initConForVisibleGrids();

        addEventListeners(this._notifyEvents, this);
        this.updateView();
    }
    public stopRunningView(): void {
        removeEventListeners(this._notifyEvents, this);
    }

    private _getActionPlanner(): IActionPlanner {
        return getExisted(this._actionPlanner);
    }

    public getContainerForGrids(): IUiContainer {
        return this._conForGrids;
    }
    public getContainerForUnits(): IUiContainer {
        return this._conForUnits;
    }

    private _getImgsForMovableGrids(): IUiImage[][] {
        return getExisted(this._imgsForMovableGrids);
    }
    private _getImgsForAttackableGrids(): IUiImage[][] {
        return getExisted(this._imgsForAttackableGrids);
    }
    private _getImgForMoveDestination(): IUiImage {
        return this._imgForMoveDestination;
    }
    private _getImgsForVisibleGrids(): IUiImage[][] {
        return getExisted(this._imgsForVisibleGrids);
    }

    private _initConForMovableGrids(): void {
        const con = this._conForMovableGrids;
        con.removeUiChildren();
        con.setAlpha(ALPHA_FOR_MOVABLE_GRIDS);

        const { width, height } = this._getActionPlanner().getMapSize().getWH();
        const images            = createEmptyMap<IUiImage>(width, height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const image     = new (getUiImageClass())({
                    textureSourceName: getMovableAreaByTick(0)
                });
                images[x][y]    = image;
                image.setIsSmoothing(false);
                image.setX(x * getGridWidth());
                image.setY(y * getGridHeight());
                image.setIsVisible(false);
                con.addUiChild(image);
            }
        }
        this._imgsForMovableGrids = images;
    }
    private _initConForMoveDestination(): void {
        const img = this._imgForMoveDestination;
        img.setIsSmoothing(false);

        const container = this._conForMoveDestination;
        container.removeUiChildren();
        container.addUiChild(img);
    }
    private _initConForAttackableGrids(): void {
        const con = this._conForAttackableGrids;
        con.removeUiChildren();
        con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

        const { width, height } = this._getActionPlanner().getMapSize().getWH();
        const images            = createEmptyMap<IUiImage>(width, height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const image     = new (getUiImageClass())({
                    textureSourceName: getAttackableAreaByTick(0)
                });
                images[x][y]    = image;
                image.setIsSmoothing(false);
                image.setX(x * getGridWidth());
                image.setY(y * getGridHeight());
                image.setIsVisible(false);
                con.addUiChild(image);
            }
        }
        this._imgsForAttackableGrids = images;
    }
    private _initConForMovePath(): void {
        this._conForMovePath.removeUiChildren();
    }
    private _initConForVisibleGrids(): void {
        const con = this._conForVisibleGrids;
        con.removeUiChildren();
        con.setAlpha(ALPHA_FOR_VISIBLE_GRIDS_NORMAL);

        const { width, height } = this._getActionPlanner().getMapSize().getWH();
        const images            = createEmptyMap<IUiImage>(width, height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const image     = new (getUiImageClass())({
                    textureSourceName: getVisibleAreaByTick(0)
                });
                images[x][y]    = image;
                image.setIsSmoothing(false);
                image.setX(x * getGridWidth());
                image.setY(y * getGridHeight());
                image.setIsVisible(false);
                con.addUiChild(image);
            }
        }
        this._imgsForVisibleGrids = images;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyGridAnimationTick(): void {
        const actionPlanner = this._getActionPlanner();
        const war           = actionPlanner.getWar();
        if ((war instanceof getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
            return;
        }

        const tick                  = getGridAnimationTickCount();
        const sourceForMovable      = getMovableAreaByTick(tick);
        const sourceForAttackable   = getAttackableAreaByTick(tick);
        const sourceForVisible      = getVisibleAreaByTick(tick);
        const imgsForMovable        = this._getImgsForMovableGrids();
        const imgsForAttackable     = this._getImgsForAttackableGrids();
        const imgsForVisible        = this._getImgsForVisibleGrids();
        const { width, height }     = actionPlanner.getMapSize().getWH();
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                imgsForMovable[x][y].loadSource(sourceForMovable);
                imgsForAttackable[x][y].loadSource(sourceForAttackable);
                imgsForVisible[x][y].loadSource(sourceForVisible);
            }
        }
        this._getImgForMoveDestination().loadSource(sourceForMovable);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public updateView(): void {
        this._resetConForAttackableGrids();
        this._resetConForMovableGrids();
        this._resetConForVisibleGrids();
        this._resetConForMoveDestination();
        this._resetConForMovePath();
        this._resetConForUnits();
    }

    private _resetConForAttackableGrids(): void {
        const con           = this._conForAttackableGrids;
        const actionPlanner = this._getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state === StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitMovePath) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const movableArea               = getExisted(actionPlanner.getMovableArea());
            const attackableArea            = getExisted(actionPlanner.getAttackableArea());
            const { width, height }         = actionPlanner.getMapSize().getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible((!movableArea.checkHasGrid(x, y)) && (attackableArea.checkHasGrid(x, y)));
                }
            }

        } else if (state === StateId.ChoosingUnitAction) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const movableArea               = getExisted(actionPlanner.getMovableArea());
            const attackableArea            = getExisted(actionPlanner.getAttackableArea());
            const { width, height }         = actionPlanner.getMapSize().getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible((!movableArea.checkHasGrid(x, y)) && (attackableArea.checkHasGrid(x, y)));
                }
            }

        } else if (state === StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const { width, height }         = actionPlanner.getMapSize().getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible(false);
                }
            }
            for (const grid of getExisted(actionPlanner.getAttackableGridsForUnitWeapon())) {
                imgsForAttackableGrids[grid.getX()][grid.getY()].setIsVisible(true);
            }

        } else if (state === StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const mapSize                   = actionPlanner.getMapSize();
            const { width, height }         = mapSize.getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible(false);
                }
            }
            for (const grid of actionPlanner.getUnitCrushCandidateGridIndexArray()) {
                imgsForAttackableGrids[grid.getX()][grid.getY()].setIsVisible(true);
            }

        } else if (state === StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForAttackableGrids();
            const destination       = actionPlanner.getMovePathDestination().getGridIndex();
            const range             = getExisted(actionPlanner.getFocusUnit()?.getFlareMaxRange(destination));
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(destination.getDistance(new GridIndex(x, y)) <= range);
                }
            }
        } else if (state === StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const mapSize                   = actionPlanner.getMapSize();
            const { width, height }         = mapSize.getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible(false);
                }
            }
            for (const grid of actionPlanner.getUnitRepairCandidateGridIndexArray()) {
                imgsForAttackableGrids[grid.getX()][grid.getY()].setIsVisible(true);
            }

        } else if (state === StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_SILO);

            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(true);
                }
            }

        } else if (state === StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const area              = actionPlanner.getAreaForPreviewingAttackableArea();
            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(area.checkHasGrid(x, y));
                }
            }

        } else if (state === StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const area              = actionPlanner.getAreaForPreviewingAttackableArea();
            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(area.checkHasGrid(x, y));
                }
            }

        } else {
            // TODO
        }
    }

    private _resetConForMovableGrids(): void {
        const con           = this._conForMovableGrids;
        const actionPlanner = this._getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state === StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitMovePath) {
            con.setIsVisible(true);

            const movableArea       = getExisted(actionPlanner.getMovableArea());
            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(movableArea.checkHasGrid(x, y));
                }
            }

        } else if (state === StateId.ChoosingUnitAction) {
            con.setIsVisible(true);

            const movableArea       = getExisted(actionPlanner.getMovableArea());
            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(movableArea.checkHasGrid(x, y));
                }
            }

        } else if (state === StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(true);

            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(false);
                }
            }
            for (const grid of getExisted(actionPlanner.getAvailableDropDestinations())) {
                imgs[grid.getX()][grid.getY()].setIsVisible(true);
            }

        } else if (state === StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(true);

            const area              = getExisted(actionPlanner.getAreaForPreviewingMovableArea());
            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(area.checkHasGrid(x, y));
                }
            }

        } else if (state === StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(false);

        } else {
            // TODO
        }
    }

    private _resetConForVisibleGrids(): void {
        const con           = this._conForVisibleGrids;
        const actionPlanner = this._getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state === StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitMovePath) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitAction) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(true);

            const mapSize           = actionPlanner.getMapSize();
            const { width, height } = mapSize.getWH();
            const imgs              = this._getImgsForVisibleGrids();
            for (let x = 0; x < width; ++x) {
                const column = imgs[x];
                for (let y = 0; y < height; ++y) {
                    column[y].setIsVisible(false);
                }
            }

            const targetGridIndex = actionPlanner.getUnitCrushTargetGridIndex();
            if (targetGridIndex) {
                imgs[targetGridIndex.getX()][targetGridIndex.getY()].setIsVisible(true);
            }

        } else if (state === StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(true);

            const mapSize           = actionPlanner.getMapSize();
            const { width, height } = mapSize.getWH();
            const imgs              = this._getImgsForVisibleGrids();
            for (let x = 0; x < width; ++x) {
                const column = imgs[x];
                for (let y = 0; y < height; ++y) {
                    column[y].setIsVisible(false);
                }
            }

            for (const targetGridIndex of actionPlanner.getCoActiveSkillTargetGridIndexArray() ?? []) {
                imgs[targetGridIndex.getX()][targetGridIndex.getY()].setIsVisible(true);
            }

        } else if (state === StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(true);

            const mapSize           = actionPlanner.getMapSize();
            const { width, height } = mapSize.getWH();
            const imgs              = this._getImgsForVisibleGrids();
            for (let x = 0; x < width; ++x) {
                const column = imgs[x];
                for (let y = 0; y < height; ++y) {
                    column[y].setIsVisible(false);
                }
            }

            const targetGridIndex = actionPlanner.getUnitRepairTargetGridIndex();
            if (targetGridIndex) {
                imgs[targetGridIndex.getX()][targetGridIndex.getY()].setIsVisible(true);
            }

        } else if (state === StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(true);

            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForVisibleGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(false);
                }
            }
            for (const gridIndex of getExisted(actionPlanner.getAreaForPreviewingVisible())) {
                imgs[gridIndex.getX()][gridIndex.getY()].setIsVisible(true);
            }

        } else if (state === StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(false);

        } else {
            // TODO
        }
    }

    private _resetConForMoveDestination(): void {
        const con           = this._conForMoveDestination;
        // const actionPlanner = this._getActionPlanner();
        // const state         = actionPlanner.getState();
        // TODO
        con.setIsVisible(false);
    }

    private _resetConForMovePath(): void {
        const con           = this._conForMovePath;
        const actionPlanner = this._getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state == StateId.Idle) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === StateId.ExecutingAction) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitMovePath) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === StateId.ChoosingUnitAction) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === StateId.ChoosingUnitAttackTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === StateId.ChoosingUnitCrushTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === StateId.ChoosingCoActiveSkillTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === StateId.ChoosingUnitDropDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === StateId.ChoosingUnitFlareDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === StateId.ChoosingUnitRepairTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === StateId.ChoosingUnitSiloDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === StateId.ChoosingTileProductionTarget) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitAttackableArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitMovableArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitVisibleArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingTileAttackableArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else {
            // Nothing to do.
        }
    }

    private _resetConForUnits(): void {
        const con           = this._conForUnits;
        const actionPlanner = this._getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state === StateId.Idle) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else if (state === StateId.ExecutingAction) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else if (state === StateId.ChoosingUnitMovePath) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === StateId.ChoosingUnitAction) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                this._addUnitView(data.unit, data.destination);
            }

        } else if (state === StateId.ChoosingUnitAttackTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === StateId.ChoosingUnitCrushTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === StateId.ChoosingCoActiveSkillTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === StateId.ChoosingUnitDropDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const focusUnitOnMap    = getExisted(actionPlanner.getFocusUnitOnMap());
            const focusUnitLoaded   = actionPlanner.getFocusUnitLoaded();
            const movePath          = actionPlanner.getMovePath();
            if (!focusUnitLoaded) {
                this._addUnitView(focusUnitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(focusUnitOnMap, focusUnitOnMap.getGridIndex());
                this._addUnitView(focusUnitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

            for (const data of actionPlanner.getChosenUnitsForDrop()) {
                this._addUnitView(data.unit, data.destination);
            }

            const cursorGridIndex = actionPlanner.getWar().getCursor().getGridIndex();
            if (actionPlanner.getAvailableDropDestinations()?.some(grid => grid.checkIsEqual(cursorGridIndex))) {
                this._addUnitView(getExisted(actionPlanner.getChoosingUnitForDrop()), cursorGridIndex);
            }

        } else if (state === StateId.ChoosingUnitFlareDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === StateId.ChoosingUnitRepairTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === StateId.ChoosingUnitSiloDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === StateId.ChoosingTileProductionTarget) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else if (state === StateId.PreviewingUnitAttackableArea) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                this._addUnitView(unit, unit.getGridIndex());
            }

        } else if (state === StateId.PreviewingUnitMovableArea) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unit = getExisted(actionPlanner.getUnitForPreviewingMovableArea());
            this._addUnitView(unit, unit.getGridIndex());

        } else if (state === StateId.PreviewingUnitVisibleArea) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unit = getExisted(actionPlanner.getUnitForPreviewingVisibleArea());
            this._addUnitView(unit, unit.getGridIndex());

        } else if (state === StateId.PreviewingTileAttackableArea) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else {
            // TODO
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private _addUnitView(unit: IBwUnit, gridIndex: GridIndex, _alpha = 1): void {
        const view = new (getUnitViewClass())().init(unit).startRunningView();
        // view.alpha = alpha;
        _resetUnitViewXy(view, gridIndex);
        view.showUnitAnimation(AnimationTypeId.MoveHorizontal);
        this._focusUnitViews.set(unit.getUnitId(), view);
        this._conForUnits.addUiChild(view);
    }

    private _clearFocusUnitViews(): void {
        for (const [, view] of this._focusUnitViews) {
            view.stopRunningView();
        }
        this._focusUnitViews.clear();
    }

    private _addMovePathView(): void {
        const con   = this._conForMovePath;
        const path  = this._getActionPlanner().getMovePath();
        for (let i = 0; i < path.length; ++i) {
            const img = _createImgForMovePathGrid(path[i - 1]?.getGridIndex(), path[i].getGridIndex(), path[i + 1]?.getGridIndex());
            img && con.addUiChild(img);
        }
    }
}

function _createImgForMovePathGrid(prev: Undefinable<GridIndex>, curr: GridIndex, next: Undefinable<GridIndex>): IUiImage | null {
    const source = getExisted(getImageSourcesMovePath().get(prev?.getAdjacentDirection(curr) ?? DirectionId.Undefined)).get(next?.getAdjacentDirection(curr) ?? DirectionId.Undefined);
    if (!source) {
        return null;
    } else {
        const image = new (getUiImageClass())({ textureSourceName: source });
        image.setIsSmoothing(false);
        image.setX(curr.getX() * getGridWidth());
        image.setY(curr.getY() * getGridHeight());
        return image;
    }
}

function _resetUnitViewXy(view: IBwUnitView, gridIndex: GridIndex): void {
    view.setX(gridIndex.getX() * getGridWidth());
    view.setY(gridIndex.getY() * getGridHeight());
}
