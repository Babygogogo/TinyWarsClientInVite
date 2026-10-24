import * as ActionPlannersConstants from "./Constants.ts";
import type * as ActionPlannersIActionPlanner from "./IActionPlanner.ts";
import type * as ActionPlannersIActionPlannerView from "./IActionPlannerView.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import * as CommonModelCommonModel from "../common/model/CommonModel.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as GeometriesConstants from "../geometries/Constants.ts";
import * as GraphicsUtils from "../graphics/Utils.ts";
import * as HelpersCollection from "../helpers/Collection.ts";
import * as HelpersImageSource from "../helpers/ImageSource.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as NotificationsTypes from "../notifications/Types.ts";
import type * as UiInterfacesIUiContainer from "../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../ui/interfaces/IUiImage.ts";
import * as UiUtilsUiFactory from "../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../units/Constants.ts";
import type * as UnitsIUnit from "../units/IUnit.ts";
import type * as UnitsIUnitView from "../units/IUnitView.ts";

type IBwUnit                = UnitsIUnit.IUnit;
type IBwUnitView            = UnitsIUnitView.IUnitView;

const getGridWidth                          = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight                         = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);
const getImageSourceMovePathEmpty           = HelpersMisc.createLazyFunc(() => ``);
const getImageSourceMovePathLineVertical    = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(1));
const getImageSourceMovePathLineHorizontal  = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(2));
const getImageSourceMovePathLineUp          = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(11));
const getImageSourceMovePathLineDown        = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(12));
const getImageSourceMovePathLineLeft        = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(13));
const getImageSourceMovePathLineRight       = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(14));
const getImageSourceMovePathArrowUp         = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(3));
const getImageSourceMovePathArrowDown       = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(4));
const getImageSourceMovePathArrowLeft       = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(5));
const getImageSourceMovePathArrowRight      = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(6));
const getImageSourceMovePathCornerDownLeft  = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(7));
const getImageSourceMovePathCornerDownRight = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(8));
const getImageSourceMovePathCornerUpLeft    = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(9));
const getImageSourceMovePathCornerUpRight   = HelpersMisc.createLazyFunc(() => HelpersImageSource.getMovePath(10));

const getImageSourcesMovePath               = HelpersMisc.createLazyFunc(() => new Map<GeometriesConstants.DirectionId, Map<GeometriesConstants.DirectionId, string>>([
    [GeometriesConstants.DirectionId.Undefined, new Map([
        [GeometriesConstants.DirectionId.Undefined,   getImageSourceMovePathEmpty()],
        [GeometriesConstants.DirectionId.Up,          getImageSourceMovePathLineUp()],
        [GeometriesConstants.DirectionId.Down,        getImageSourceMovePathLineDown()],
        [GeometriesConstants.DirectionId.Left,        getImageSourceMovePathLineLeft()],
        [GeometriesConstants.DirectionId.Right,       getImageSourceMovePathLineRight()],
    ])],
    [GeometriesConstants.DirectionId.Up, new Map([
        [GeometriesConstants.DirectionId.Undefined,   getImageSourceMovePathArrowDown()],
        [GeometriesConstants.DirectionId.Up,          getImageSourceMovePathEmpty()],
        [GeometriesConstants.DirectionId.Down,        getImageSourceMovePathLineVertical()],
        [GeometriesConstants.DirectionId.Left,        getImageSourceMovePathCornerUpLeft()],
        [GeometriesConstants.DirectionId.Right,       getImageSourceMovePathCornerUpRight()],
    ])],
    [GeometriesConstants.DirectionId.Down, new Map([
        [GeometriesConstants.DirectionId.Undefined,   getImageSourceMovePathArrowUp()],
        [GeometriesConstants.DirectionId.Up,          getImageSourceMovePathLineVertical()],
        [GeometriesConstants.DirectionId.Down,        getImageSourceMovePathEmpty()],
        [GeometriesConstants.DirectionId.Left,        getImageSourceMovePathCornerDownLeft()],
        [GeometriesConstants.DirectionId.Right,       getImageSourceMovePathCornerDownRight()],
    ])],
    [GeometriesConstants.DirectionId.Left, new Map([
        [GeometriesConstants.DirectionId.Undefined,   getImageSourceMovePathArrowRight()],
        [GeometriesConstants.DirectionId.Up,          getImageSourceMovePathCornerUpLeft()],
        [GeometriesConstants.DirectionId.Down,        getImageSourceMovePathCornerDownLeft()],
        [GeometriesConstants.DirectionId.Left,        getImageSourceMovePathEmpty()],
        [GeometriesConstants.DirectionId.Right,       getImageSourceMovePathLineHorizontal()],
    ])],
    [GeometriesConstants.DirectionId.Right, new Map([
        [GeometriesConstants.DirectionId.Undefined,   getImageSourceMovePathArrowLeft()],
        [GeometriesConstants.DirectionId.Up,          getImageSourceMovePathCornerUpRight()],
        [GeometriesConstants.DirectionId.Down,        getImageSourceMovePathCornerDownRight()],
        [GeometriesConstants.DirectionId.Left,        getImageSourceMovePathLineHorizontal()],
        [GeometriesConstants.DirectionId.Right,       getImageSourceMovePathEmpty()],
    ])],
]));
const ALPHA_FOR_MOVABLE_GRIDS           = 0.5;
const ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL = 0.6;
const ALPHA_FOR_ATTACKABLE_GRIDS_SILO   = 0.15;
const ALPHA_FOR_VISIBLE_GRIDS_NORMAL    = 0.6;

export class ActionPlannerView implements ActionPlannersIActionPlannerView.IActionPlannerView {
    private _actionPlanner?                 : ActionPlannersIActionPlanner.IActionPlanner;

    private _conForGrids                    = new (UiUtilsUiFactory.getUiContainerClass())();
    private _conForMovableGrids             = new (UiUtilsUiFactory.getUiContainerClass())();
    private _conForMoveDestination          = new (UiUtilsUiFactory.getUiContainerClass())();
    private _conForAttackableGrids          = new (UiUtilsUiFactory.getUiContainerClass())();
    private _conForVisibleGrids             = new (UiUtilsUiFactory.getUiContainerClass())();
    private _conForMovePath                 = new (UiUtilsUiFactory.getUiContainerClass())();
    private _imgsForMovableGrids?           : UiInterfacesIUiImage.IUiImage[][];
    private _imgsForAttackableGrids?        : UiInterfacesIUiImage.IUiImage[][];
    private _imgsForVisibleGrids?           : UiInterfacesIUiImage.IUiImage[][];
    private readonly _imgForMoveDestination = new (UiUtilsUiFactory.getUiImageClass())({
        textureSourceName: HelpersImageSource.getMovableAreaByTick(0)
    });

    private _conForUnits            = new (UiUtilsUiFactory.getUiContainerClass())();
    private _focusUnitViews         = new Map<number, IBwUnitView>();

    private _notifyEvents: NotificationsTypes.Listener[] = [
        { type: NotificationsTypeId.TypeId.GridAnimationTick,       callback: this._onNotifyGridAnimationTick },
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

    public init(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        this._actionPlanner = actionPlanner;
    }
    public fastInit(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): void {
        this._actionPlanner = actionPlanner;
    }

    public startRunningView(): void {
        this._initConForMovableGrids();
        this._initConForMoveDestination();
        this._initConForAttackableGrids();
        this._initConForMovePath();
        this._initConForVisibleGrids();

        NotificationsDispatcher.addEventListeners(this._notifyEvents, this);
        this.updateView();
    }
    public stopRunningView(): void {
        NotificationsDispatcher.removeEventListeners(this._notifyEvents, this);
    }

    private _getActionPlanner(): ActionPlannersIActionPlanner.IActionPlanner {
        return HelpersMisc.getExisted(this._actionPlanner);
    }

    public getContainerForGrids(): UiInterfacesIUiContainer.IUiContainer {
        return this._conForGrids;
    }
    public getContainerForUnits(): UiInterfacesIUiContainer.IUiContainer {
        return this._conForUnits;
    }

    private _getImgsForMovableGrids(): UiInterfacesIUiImage.IUiImage[][] {
        return HelpersMisc.getExisted(this._imgsForMovableGrids);
    }
    private _getImgsForAttackableGrids(): UiInterfacesIUiImage.IUiImage[][] {
        return HelpersMisc.getExisted(this._imgsForAttackableGrids);
    }
    private _getImgForMoveDestination(): UiInterfacesIUiImage.IUiImage {
        return HelpersMisc.getExisted(this._imgForMoveDestination);
    }
    private _getImgsForVisibleGrids(): UiInterfacesIUiImage.IUiImage[][] {
        return HelpersMisc.getExisted(this._imgsForVisibleGrids);
    }

    private _initConForMovableGrids(): void {
        const con = this._conForMovableGrids;
        con.removeUiChildren();
        con.setAlpha(ALPHA_FOR_MOVABLE_GRIDS);

        const { width, height } = this._getActionPlanner().getWar().getTileMap().getMapSize().getWH();
        const images            = HelpersCollection.createEmptyMap<UiInterfacesIUiImage.IUiImage>(width, height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const image     = new (UiUtilsUiFactory.getUiImageClass())({
                    textureSourceName: HelpersImageSource.getMovableAreaByTick(0)
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

        const { width, height } = this._getActionPlanner().getWar().getTileMap().getMapSize().getWH();
        const images            = HelpersCollection.createEmptyMap<UiInterfacesIUiImage.IUiImage>(width, height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const image     = new (UiUtilsUiFactory.getUiImageClass())({
                    textureSourceName: HelpersImageSource.getAttackableAreaByTick(0)
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

        const { width, height } = this._getActionPlanner().getWar().getTileMap().getMapSize().getWH();
        const images            = HelpersCollection.createEmptyMap<UiInterfacesIUiImage.IUiImage>(width, height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const image     = new (UiUtilsUiFactory.getUiImageClass())({
                    textureSourceName: HelpersImageSource.getVisibleAreaByTick(0)
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
        const war = this._getActionPlanner().getWar();
        if ((war instanceof GameHelpersGhFactory.getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
            return;
        }

        const tick                  = CommonModelCommonModel.getGridAnimationTickCount();
        const sourceForMovable      = HelpersImageSource.getMovableAreaByTick(tick);
        const sourceForAttackable   = HelpersImageSource.getAttackableAreaByTick(tick);
        const sourceForVisible      = HelpersImageSource.getVisibleAreaByTick(tick);
        const imgsForMovable        = this._getImgsForMovableGrids();
        const imgsForAttackable     = this._getImgsForAttackableGrids();
        const imgsForVisible        = this._getImgsForVisibleGrids();
        const { width, height }     = war.getTileMap().getMapSize().getWH();
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

        if (state === ActionPlannersConstants.StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const movableArea               = HelpersMisc.getExisted(actionPlanner.getMovableArea());
            const attackableArea            = HelpersMisc.getExisted(actionPlanner.getAttackableArea());
            const { width, height }         = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible((!movableArea.checkHasGrid(x, y)) && (attackableArea.checkHasGrid(x, y)));
                }
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const movableArea               = HelpersMisc.getExisted(actionPlanner.getMovableArea());
            const attackableArea            = HelpersMisc.getExisted(actionPlanner.getAttackableArea());
            const { width, height }         = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible((!movableArea.checkHasGrid(x, y)) && (attackableArea.checkHasGrid(x, y)));
                }
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const { width, height }         = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible(false);
                }
            }
            for (const grid of HelpersMisc.getExisted(actionPlanner.getAttackableGridsForUnitWeapon())) {
                imgsForAttackableGrids[grid.getX()][grid.getY()].setIsVisible(true);
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const war                       = actionPlanner.getWar();
            const mapSize                   = war.getTileMap().getMapSize();
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

        } else if (state === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const { width, height } = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgs              = this._getImgsForAttackableGrids();
            const destination       = actionPlanner.getMovePathDestination().getGridIndex();
            const range             = HelpersMisc.getExisted(actionPlanner.getFocusUnit()?.getFlareMaxRange(destination));
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(destination.getDistance(new AuxiliaryTypesGridIndex.GridIndex(x, y)) <= range);
                }
            }
        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const war                       = actionPlanner.getWar();
            const mapSize                   = war.getTileMap().getMapSize();
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

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_SILO);

            const { width, height } = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgs              = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(true);
                }
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const area              = actionPlanner.getAreaForPreviewingAttackableArea();
            const { width, height } = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgs              = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(area.checkHasGrid(x, y));
                }
            }

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const area              = actionPlanner.getAreaForPreviewingAttackableArea();
            const { width, height } = actionPlanner.getWar().getTileMap().getMapSize().getWH();
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

        if (state === ActionPlannersConstants.StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(true);

            const movableArea       = HelpersMisc.getExisted(actionPlanner.getMovableArea());
            const { width, height } = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(movableArea.checkHasGrid(x, y));
                }
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            con.setIsVisible(true);

            const movableArea       = HelpersMisc.getExisted(actionPlanner.getMovableArea());
            const { width, height } = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(movableArea.checkHasGrid(x, y));
                }
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(true);

            const { width, height } = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(false);
                }
            }
            for (const grid of HelpersMisc.getExisted(actionPlanner.getAvailableDropDestinations())) {
                imgs[grid.getX()][grid.getY()].setIsVisible(true);
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(true);

            const area              = HelpersMisc.getExisted(actionPlanner.getAreaForPreviewingMovableArea());
            const { width, height } = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(area.checkHasGrid(x, y));
                }
            }

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(false);

        } else {
            // TODO
        }
    }

    private _resetConForVisibleGrids(): void {
        const con           = this._conForVisibleGrids;
        const actionPlanner = this._getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state === ActionPlannersConstants.StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(true);

            const mapSize           = actionPlanner.getWar().getTileMap().getMapSize();
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

        } else if (state === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(true);

            const mapSize           = actionPlanner.getWar().getTileMap().getMapSize();
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

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(true);

            const mapSize           = actionPlanner.getWar().getTileMap().getMapSize();
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

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(true);

            const { width, height } = actionPlanner.getWar().getTileMap().getMapSize().getWH();
            const imgs              = this._getImgsForVisibleGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(false);
                }
            }
            for (const gridIndex of HelpersMisc.getExisted(actionPlanner.getAreaForPreviewingVisible())) {
                imgs[gridIndex.getX()][gridIndex.getY()].setIsVisible(true);
            }

        } else if (state === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
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

        if (state == ActionPlannersConstants.StateId.Idle) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ExecutingAction) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
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

        if (state === ActionPlannersConstants.StateId.Idle) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else if (state === ActionPlannersConstants.StateId.ExecutingAction) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap());
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

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const focusUnitOnMap    = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap());
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
                this._addUnitView(HelpersMisc.getExisted(actionPlanner.getChoosingUnitForDrop()), cursorGridIndex);
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                this._addUnitView(unit, unit.getGridIndex());
            }

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unit = HelpersMisc.getExisted(actionPlanner.getUnitForPreviewingMovableArea());
            this._addUnitView(unit, unit.getGridIndex());

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unit = HelpersMisc.getExisted(actionPlanner.getUnitForPreviewingVisibleArea());
            this._addUnitView(unit, unit.getGridIndex());

        } else if (state === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
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
    private _addUnitView(unit: IBwUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex, _alpha = 1): void {
        const view = new (GameHelpersGhFactory.getUnitViewClass())().init(unit).startRunningView();
        // view.alpha = alpha;
        _resetUnitViewXy(view, gridIndex);
        view.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveHorizontal);
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

function _createImgForMovePathGrid(prev: AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesGridIndex.GridIndex>, curr: AuxiliaryTypesGridIndex.GridIndex, next: AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesGridIndex.GridIndex>): UiInterfacesIUiImage.IUiImage | null {
    const source = HelpersMisc.getExisted(getImageSourcesMovePath().get(prev?.getAdjacentDirection(curr) ?? GeometriesConstants.DirectionId.Undefined)).get(next?.getAdjacentDirection(curr) ?? GeometriesConstants.DirectionId.Undefined);
    if (!source) {
        return null;
    } else {
        const image = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: source });
        image.setIsSmoothing(false);
        image.setX(curr.getX() * getGridWidth());
        image.setY(curr.getY() * getGridHeight());
        return image;
    }
}

function _resetUnitViewXy(view: IBwUnitView, gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
    view.setX(gridIndex.getX() * getGridWidth());
    view.setY(gridIndex.getY() * getGridHeight());
}
