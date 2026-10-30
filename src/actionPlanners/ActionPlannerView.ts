import {
    Common_Model_CommonModel,
    AuxiliaryTypes_GridIndex,
    ReplayWar_Model_RwWarBase,
    ActionPlanners_Constants,
    Ui_Components_UiContainer,
    Ui_Components_UiImage,
    Units_UnitView,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_IActionPlannerView,
    type AuxiliaryTypes_AuxiliaryTypes,
    Notifications_Dispatcher,
    Helpers_Collection,
    Helpers_Misc,
    Geometries_Constants,
    Helpers_ImageSource,
    Graphics_Utils,
    Notifications_TypeId,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Notifications_Types,
    Units_Constants,
    type Units_IUnit,
    type Units_IUnitView,
} from "../internal.ts";

const getGridWidth                          = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight                         = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);
const getImageSourceMovePathEmpty           = Helpers_Misc.createLazyFunc(() => ``);
const getImageSourceMovePathLineVertical    = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(1));
const getImageSourceMovePathLineHorizontal  = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(2));
const getImageSourceMovePathLineUp          = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(11));
const getImageSourceMovePathLineDown        = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(12));
const getImageSourceMovePathLineLeft        = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(13));
const getImageSourceMovePathLineRight       = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(14));
const getImageSourceMovePathArrowUp         = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(3));
const getImageSourceMovePathArrowDown       = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(4));
const getImageSourceMovePathArrowLeft       = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(5));
const getImageSourceMovePathArrowRight      = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(6));
const getImageSourceMovePathCornerDownLeft  = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(7));
const getImageSourceMovePathCornerDownRight = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(8));
const getImageSourceMovePathCornerUpLeft    = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(9));
const getImageSourceMovePathCornerUpRight   = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getMovePath(10));

const getImageSourcesMovePath               = Helpers_Misc.createLazyFunc(() => new Map<Geometries_Constants.DirectionId, Map<Geometries_Constants.DirectionId, string>>([
    [Geometries_Constants.DirectionId.Undefined, new Map([
        [Geometries_Constants.DirectionId.Undefined,   getImageSourceMovePathEmpty()],
        [Geometries_Constants.DirectionId.Up,          getImageSourceMovePathLineUp()],
        [Geometries_Constants.DirectionId.Down,        getImageSourceMovePathLineDown()],
        [Geometries_Constants.DirectionId.Left,        getImageSourceMovePathLineLeft()],
        [Geometries_Constants.DirectionId.Right,       getImageSourceMovePathLineRight()],
    ])],
    [Geometries_Constants.DirectionId.Up, new Map([
        [Geometries_Constants.DirectionId.Undefined,   getImageSourceMovePathArrowDown()],
        [Geometries_Constants.DirectionId.Up,          getImageSourceMovePathEmpty()],
        [Geometries_Constants.DirectionId.Down,        getImageSourceMovePathLineVertical()],
        [Geometries_Constants.DirectionId.Left,        getImageSourceMovePathCornerUpLeft()],
        [Geometries_Constants.DirectionId.Right,       getImageSourceMovePathCornerUpRight()],
    ])],
    [Geometries_Constants.DirectionId.Down, new Map([
        [Geometries_Constants.DirectionId.Undefined,   getImageSourceMovePathArrowUp()],
        [Geometries_Constants.DirectionId.Up,          getImageSourceMovePathLineVertical()],
        [Geometries_Constants.DirectionId.Down,        getImageSourceMovePathEmpty()],
        [Geometries_Constants.DirectionId.Left,        getImageSourceMovePathCornerDownLeft()],
        [Geometries_Constants.DirectionId.Right,       getImageSourceMovePathCornerDownRight()],
    ])],
    [Geometries_Constants.DirectionId.Left, new Map([
        [Geometries_Constants.DirectionId.Undefined,   getImageSourceMovePathArrowRight()],
        [Geometries_Constants.DirectionId.Up,          getImageSourceMovePathCornerUpLeft()],
        [Geometries_Constants.DirectionId.Down,        getImageSourceMovePathCornerDownLeft()],
        [Geometries_Constants.DirectionId.Left,        getImageSourceMovePathEmpty()],
        [Geometries_Constants.DirectionId.Right,       getImageSourceMovePathLineHorizontal()],
    ])],
    [Geometries_Constants.DirectionId.Right, new Map([
        [Geometries_Constants.DirectionId.Undefined,   getImageSourceMovePathArrowLeft()],
        [Geometries_Constants.DirectionId.Up,          getImageSourceMovePathCornerUpRight()],
        [Geometries_Constants.DirectionId.Down,        getImageSourceMovePathCornerDownRight()],
        [Geometries_Constants.DirectionId.Left,        getImageSourceMovePathLineHorizontal()],
        [Geometries_Constants.DirectionId.Right,       getImageSourceMovePathEmpty()],
    ])],
]));
const ALPHA_FOR_MOVABLE_GRIDS           = 0.5;
const ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL = 0.6;
const ALPHA_FOR_ATTACKABLE_GRIDS_SILO   = 0.15;
const ALPHA_FOR_VISIBLE_GRIDS_NORMAL    = 0.6;

export class ActionPlannerView implements ActionPlanners_IActionPlannerView.IActionPlannerView {
    private _actionPlanner?                 : ActionPlanners_IActionPlanner.IActionPlanner;

    private _conForGrids                    = new Ui_Components_UiContainer.UiContainer();
    private _conForMovableGrids             = new Ui_Components_UiContainer.UiContainer();
    private _conForMoveDestination          = new Ui_Components_UiContainer.UiContainer();
    private _conForAttackableGrids          = new Ui_Components_UiContainer.UiContainer();
    private _conForVisibleGrids             = new Ui_Components_UiContainer.UiContainer();
    private _conForMovePath                 = new Ui_Components_UiContainer.UiContainer();
    private _imgsForMovableGrids?           : Ui_Interfaces_IUiImage.IUiImage[][];
    private _imgsForAttackableGrids?        : Ui_Interfaces_IUiImage.IUiImage[][];
    private _imgsForVisibleGrids?           : Ui_Interfaces_IUiImage.IUiImage[][];
    private readonly _imgForMoveDestination = new Ui_Components_UiImage.UiImage({
        textureSourceName : Helpers_ImageSource.getMovableAreaByTick(0),
    });

    private _conForUnits            = new Ui_Components_UiContainer.UiContainer();
    private _focusUnitViews         = new Map<number, Units_IUnitView.IUnitView>();

    private _notifyEvents: Notifications_Types.Listener[] = [
        { type : Notifications_TypeId.TypeId.GridAnimationTick,       callback : this._onNotifyGridAnimationTick },
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

    public init(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        this._actionPlanner = actionPlanner;
    }
    public fastInit(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): void {
        this._actionPlanner = actionPlanner;
    }

    public startRunningView(): void {
        this._initConForMovableGrids();
        this._initConForMoveDestination();
        this._initConForAttackableGrids();
        this._initConForMovePath();
        this._initConForVisibleGrids();

        Notifications_Dispatcher.addEventListeners(this._notifyEvents, this);
        this.updateView();
    }
    public stopRunningView(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyEvents, this);
    }

    private _getActionPlanner(): ActionPlanners_IActionPlanner.IActionPlanner {
        return Helpers_Misc.getExisted(this._actionPlanner);
    }

    public getContainerForGrids(): Ui_Interfaces_IUiContainer.IUiContainer {
        return this._conForGrids;
    }
    public getContainerForUnits(): Ui_Interfaces_IUiContainer.IUiContainer {
        return this._conForUnits;
    }

    private _getImgsForMovableGrids(): Ui_Interfaces_IUiImage.IUiImage[][] {
        return Helpers_Misc.getExisted(this._imgsForMovableGrids);
    }
    private _getImgsForAttackableGrids(): Ui_Interfaces_IUiImage.IUiImage[][] {
        return Helpers_Misc.getExisted(this._imgsForAttackableGrids);
    }
    private _getImgForMoveDestination(): Ui_Interfaces_IUiImage.IUiImage {
        return this._imgForMoveDestination;
    }
    private _getImgsForVisibleGrids(): Ui_Interfaces_IUiImage.IUiImage[][] {
        return Helpers_Misc.getExisted(this._imgsForVisibleGrids);
    }

    private _initConForMovableGrids(): void {
        const con = this._conForMovableGrids;
        con.removeUiChildren();
        con.setAlpha(ALPHA_FOR_MOVABLE_GRIDS);

        const { width, height } = this._getActionPlanner().getMapSize().getWH();
        const images            = Helpers_Collection.createEmptyMap<Ui_Interfaces_IUiImage.IUiImage>(width, height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const image     = new Ui_Components_UiImage.UiImage({
                    textureSourceName : Helpers_ImageSource.getMovableAreaByTick(0),
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
        const images            = Helpers_Collection.createEmptyMap<Ui_Interfaces_IUiImage.IUiImage>(width, height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const image     = new Ui_Components_UiImage.UiImage({
                    textureSourceName : Helpers_ImageSource.getAttackableAreaByTick(0),
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
        const images            = Helpers_Collection.createEmptyMap<Ui_Interfaces_IUiImage.IUiImage>(width, height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const image     = new Ui_Components_UiImage.UiImage({
                    textureSourceName : Helpers_ImageSource.getVisibleAreaByTick(0),
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
        if ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction())){
            return;
        }

        const tick                  = Common_Model_CommonModel.getGridAnimationTickCount();
        const sourceForMovable      = Helpers_ImageSource.getMovableAreaByTick(tick);
        const sourceForAttackable   = Helpers_ImageSource.getAttackableAreaByTick(tick);
        const sourceForVisible      = Helpers_ImageSource.getVisibleAreaByTick(tick);
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

        if (state === ActionPlanners_Constants.StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const movableArea               = Helpers_Misc.getExisted(actionPlanner.getMovableArea());
            const attackableArea            = Helpers_Misc.getExisted(actionPlanner.getAttackableArea());
            const { width, height }         = actionPlanner.getMapSize().getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible((!movableArea.checkHasGrid(x, y)) && (attackableArea.checkHasGrid(x, y)));
                }
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const movableArea               = Helpers_Misc.getExisted(actionPlanner.getMovableArea());
            const attackableArea            = Helpers_Misc.getExisted(actionPlanner.getAttackableArea());
            const { width, height }         = actionPlanner.getMapSize().getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible((!movableArea.checkHasGrid(x, y)) && (attackableArea.checkHasGrid(x, y)));
                }
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const { width, height }         = actionPlanner.getMapSize().getWH();
            const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForAttackableGrids[x][y].setIsVisible(false);
                }
            }
            for (const grid of Helpers_Misc.getExisted(actionPlanner.getAttackableGridsForUnitWeapon())) {
                imgsForAttackableGrids[grid.getX()][grid.getY()].setIsVisible(true);
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
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

        } else if (state === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL);

            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForAttackableGrids();
            const destination       = actionPlanner.getMovePathDestination().getGridIndex();
            const range             = Helpers_Misc.getExisted(actionPlanner.getFocusUnit()?.getFlareMaxRange(destination));
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(destination.getDistance(new AuxiliaryTypes_GridIndex.GridIndex(x, y)) <= range);
                }
            }
        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
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

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(true);
            con.setAlpha(ALPHA_FOR_ATTACKABLE_GRIDS_SILO);

            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForAttackableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(true);
                }
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
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

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
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

        if (state === ActionPlanners_Constants.StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(true);

            const movableArea       = Helpers_Misc.getExisted(actionPlanner.getMovableArea());
            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(movableArea.checkHasGrid(x, y));
                }
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            con.setIsVisible(true);

            const movableArea       = Helpers_Misc.getExisted(actionPlanner.getMovableArea());
            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(movableArea.checkHasGrid(x, y));
                }
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(true);

            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(false);
                }
            }
            for (const grid of Helpers_Misc.getExisted(actionPlanner.getAvailableDropDestinations())) {
                imgs[grid.getX()][grid.getY()].setIsVisible(true);
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(true);

            const area              = Helpers_Misc.getExisted(actionPlanner.getAreaForPreviewingMovableArea());
            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForMovableGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(area.checkHasGrid(x, y));
                }
            }

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(false);

        } else {
            // TODO
        }
    }

    private _resetConForVisibleGrids(): void {
        const con           = this._conForVisibleGrids;
        const actionPlanner = this._getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state === ActionPlanners_Constants.StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
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

        } else if (state === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
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

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
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

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(true);

            const { width, height } = actionPlanner.getMapSize().getWH();
            const imgs              = this._getImgsForVisibleGrids();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgs[x][y].setIsVisible(false);
                }
            }
            for (const gridIndex of Helpers_Misc.getExisted(actionPlanner.getAreaForPreviewingVisible())) {
                imgs[gridIndex.getX()][gridIndex.getY()].setIsVisible(true);
            }

        } else if (state === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
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

        if (state == ActionPlanners_Constants.StateId.Idle) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ExecutingAction) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);

            this._addMovePathView();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            con.removeUiChildren();
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
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

        if (state === ActionPlanners_Constants.StateId.Idle) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else if (state === ActionPlanners_Constants.StateId.ExecutingAction) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap());
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

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const focusUnitOnMap    = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap());
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
                this._addUnitView(Helpers_Misc.getExisted(actionPlanner.getChoosingUnitForDrop()), cursorGridIndex);
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unitOnMap     = Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap());
            const unitLoaded    = actionPlanner.getFocusUnitLoaded();
            const movePath      = actionPlanner.getMovePath();
            if (!unitLoaded) {
                this._addUnitView(unitOnMap, movePath[movePath.length - 1].getGridIndex());
            } else {
                this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                this._addUnitView(unitLoaded, movePath[movePath.length - 1].getGridIndex());
            }

        } else if (state === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            con.removeUiChildren();
            con.setIsVisible(false);
            this._clearFocusUnitViews();

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                this._addUnitView(unit, unit.getGridIndex());
            }

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unit = Helpers_Misc.getExisted(actionPlanner.getUnitForPreviewingMovableArea());
            this._addUnitView(unit, unit.getGridIndex());

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            con.removeUiChildren();
            con.setIsVisible(true);
            this._clearFocusUnitViews();

            const unit = Helpers_Misc.getExisted(actionPlanner.getUnitForPreviewingVisibleArea());
            this._addUnitView(unit, unit.getGridIndex());

        } else if (state === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
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
    private _addUnitView(unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, _alpha = 1): void {
        const view = new Units_UnitView.UnitView().init(unit).startRunningView();
        // view.alpha = alpha;
        _resetUnitViewXy(view, gridIndex);
        view.showUnitAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);
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

function _createImgForMovePathGrid(prev: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex>, curr: AuxiliaryTypes_GridIndex.GridIndex, next: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex>): Ui_Interfaces_IUiImage.IUiImage | null {
    const source = Helpers_Misc.getExisted(getImageSourcesMovePath().get(prev?.getAdjacentDirection(curr) ?? Geometries_Constants.DirectionId.Undefined)).get(next?.getAdjacentDirection(curr) ?? Geometries_Constants.DirectionId.Undefined);
    if (!source) {
        return null;
    } else {
        const image = new Ui_Components_UiImage.UiImage({ textureSourceName : source });
        image.setIsSmoothing(false);
        image.setX(curr.getX() * getGridWidth());
        image.setY(curr.getY() * getGridHeight());
        return image;
    }
}

function _resetUnitViewXy(view: Units_IUnitView.IUnitView, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
    view.setX(gridIndex.getX() * getGridWidth());
    view.setY(gridIndex.getY() * getGridHeight());
}
