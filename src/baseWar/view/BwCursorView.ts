import * as ActionPlannersConstants from "../../actionPlanners/Constants.ts";
import * as ActionPlannersStatesIdle from "../../actionPlanners/states/Idle.ts";
import * as ActionPlannersStatesRequestingPlayerEndTurn from "../../actionPlanners/states/RequestingPlayerEndTurn.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwCursor from "../interface/IBwCursor.ts";
import type * as BaseWarInterfaceIBwCursorView from "../interface/IBwCursorView.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GeometriesUtils from "../../geometries/Utils.ts";
import * as GraphicsUtils from "../../graphics/Utils.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as KeyboardKbManager from "../../keyboard/KbManager.ts";
import * as KeyboardKbTypes from "../../keyboard/KbTypes.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MapEditorModelMeHelpers from "../../mapEditor/model/MeHelpers.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../../mapEditor/model/MeProxy.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiContainer from "../../ui/components/UiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

const _PULSE_IN_DURATION                    = 150;
const _PULSE_OUT_DURATION                   = 150;
const _PULSE_INTERVAL_DURATION              = 300;
const _TARGET_FRAME_DURATION                = 100;
const _DRAG_FIELD_SQUARED_TRIGGER_DISTANCE  = 400;
const getImageSourceForCursorCorner         = HelpersMisc.createLazyFunc(() => HelpersImageSource.getCursorCorner());
const getImageSourcesForCursorAiming        = HelpersMisc.createLazyFunc(() => HelpersImageSource.getArrayCursorAiming());

const getGridWidth                  = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight                 = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);
const getOutLength                  = HelpersMisc.createLazyFunc(() => getGridWidth() / 6);
const getInLength                   = HelpersMisc.createLazyFunc(() => getGridWidth() / 9);
const getUpperLeftCornerOuterX      = HelpersMisc.createLazyFunc(() => -getOutLength());
const getUpperLeftCornerOuterY      = HelpersMisc.createLazyFunc(() => -getOutLength());
const getUpperLeftCornerInnerX      = HelpersMisc.createLazyFunc(() => getInLength());
const getUpperLeftCornerInnerY      = HelpersMisc.createLazyFunc(() => getInLength());
const getUpperRightCornerOuterX     = HelpersMisc.createLazyFunc(() => getGridWidth() + getOutLength());
const getUpperRightCornerOuterY     = HelpersMisc.createLazyFunc(() => -getOutLength());
const getUpperRightCornerInnerX     = HelpersMisc.createLazyFunc(() => getGridWidth() - getInLength());
const getUpperRightCornerInnerY     = HelpersMisc.createLazyFunc(() => getInLength());
const getLowerLeftCornerOuterX      = HelpersMisc.createLazyFunc(() => -getOutLength());
const getLowerLeftCornerOuterY      = HelpersMisc.createLazyFunc(() => getGridHeight() + getOutLength());
const getLowerLeftCornerInnerX      = HelpersMisc.createLazyFunc(() => getInLength());
const getLowerLeftCornerInnerY      = HelpersMisc.createLazyFunc(() => getGridHeight() - getInLength());
const getLowerRightCornerOuterX     = HelpersMisc.createLazyFunc(() => getGridWidth()  + getOutLength());
const getLowerRightCornerOuterY     = HelpersMisc.createLazyFunc(() => getGridHeight() + getOutLength());
const getLowerRightCornerInnerX     = HelpersMisc.createLazyFunc(() => getGridWidth()  - getInLength());
const getLowerRightCornerInnerY     = HelpersMisc.createLazyFunc(() => getGridHeight() - getInLength());

export class BwCursorView extends UiComponentsUiContainer.UiContainer implements BaseWarInterfaceIBwCursorView.IBwCursorView {
    private _cursor?                : BaseWarInterfaceIBwCursor.IBwCursor;
    private _frameIndexForImgTarget = 0;

    private _currGlobalTouchPoints      = new Map<number, AuxiliaryTypesAuxiliaryTypes.Point>();
    private _prevGlobalTouchPoints      = new Map<number, AuxiliaryTypesAuxiliaryTypes.Point>();
    private _touchIdForTouchingCursor   : number | null = null;
    private _initialGlobalTouchPoint?   : AuxiliaryTypesAuxiliaryTypes.Point;
    private _isTouchMovedOrMultiple?    : boolean;
    private _targetAreaRadius           = 2;
    private _lastNewDirectionKeyTime    = new Date().getTime();
    private _lastAllDirectionKeyTime    = new Date().getTime();
    private _lastSaveMapTime            = 0;

    private readonly _conForAll             = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _conForNormal          = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _conForTarget          = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _conForTargetArea      = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _imgUpperLeftCorner    = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: getImageSourceForCursorCorner() });
    private readonly _imgUpperRightCorner   = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: getImageSourceForCursorCorner() });
    private readonly _imgLowerLeftCorner    = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: getImageSourceForCursorCorner() });
    private readonly _imgLowerRightCorner   = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: getImageSourceForCursorCorner() });
    private readonly _imgTarget             = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: getImageSourcesForCursorAiming()[this._frameIndexForImgTarget] });

    public constructor() {
        super();

        this.setIsTouchChildrenEnabled(false);
        this.addUiChild(this._conForAll);
        this._initConForNormal();
        this._initConForTarget();
        this._initConForTargetArea();
    }

    public init(cursor: BaseWarInterfaceIBwCursor.IBwCursor): void {
        this._cursor = cursor;

        const mapSize = cursor.getMapSize();
        this.setUnscaledManualWidth(mapSize.getWidth() * getGridWidth());
        this.setUnscaledManualHeight(mapSize.getHeight() * getGridHeight());
    }
    public fastInit(cursor: BaseWarInterfaceIBwCursor.IBwCursor): void {
        this._cursor = cursor;
    }

    public startRunningView(): void {
        NotificationsDispatcher.addEventListener(NotificationsTypeId.TypeId.ZoomableContentsMoved, this._onNotifyZoomableContentsMoved, this);
        KeyboardKbManager.addListener(this._onKeyboard, this);

        {
            const agent = this.getEventAgent();
            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.Press,        this._onPointerPress,       this);
            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.ReleaseIn,    this._onPointerReleaseIn,   this);
            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.ReleaseOut,   this._onPointerReleaseOut,  this);
            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.PressMove,    this._onPointerPressMove,   this);
        }

        this.updateView();

        this._startNormalAnimation();
        this._startTargetAnimation();
        this.setIsTouchEnabled(true);
    }
    public stopRunningView(): void {
        this.setIsTouchEnabled(false);
        this._stopNormalAnimation();
        this._stopTargetAnimation();

        NotificationsDispatcher.removeEventListener(NotificationsTypeId.TypeId.ZoomableContentsMoved,        this._onNotifyZoomableContentsMoved,    this);
        KeyboardKbManager.deleteListener(this._onKeyboard, this);

        {
            const agent = this.getEventAgent();
            agent.removePointerEventListener(HelpersPointerInput.PointerEventType.Press,         this._onPointerPress,       this);
            agent.removePointerEventListener(HelpersPointerInput.PointerEventType.ReleaseIn,     this._onPointerReleaseIn,   this);
            agent.removePointerEventListener(HelpersPointerInput.PointerEventType.ReleaseOut,    this._onPointerReleaseOut,  this);
            agent.removePointerEventListener(HelpersPointerInput.PointerEventType.PressMove,     this._onPointerPressMove,   this);
        }

        this._currGlobalTouchPoints.clear();
        this._prevGlobalTouchPoints.clear();
        this._touchIdForTouchingCursor = null;
        delete this._initialGlobalTouchPoint;
        delete this._isTouchMovedOrMultiple;
    }

    public updateView(): void {
        this._updatePos();
        this._updateConForNormal();
        this._updateConForTarget();
        this._updateConForTargetArea();
    }

    public setTargetAreaRadius(radius: number): void {
        if (this._targetAreaRadius != radius) {
            this._targetAreaRadius = radius;
            this._resetImagesForTargetArea();
        }
    }

    // public setVisibleForConForNormal(visible: boolean): void {
    //     this._conForNormal.visible = visible;
    // }
    // public setVisibleForConForTarget(visible: boolean): void {
    //     this._conForTarget.visible = visible;
    // }
    // public setVisibleForConForSiloArea(visible: boolean): void {
    //     this._conForSiloArea.visible = visible;
    // }

    private _getCursor(): BaseWarInterfaceIBwCursor.IBwCursor {
        return HelpersMisc.getExisted(this._cursor);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyZoomableContentsMoved(): void {
        const touchPoints = this._currGlobalTouchPoints;
        if ((this._touchIdForTouchingCursor != null) && (touchPoints.size === 1)) {
            const point         = touchPoints.values().next().value as AuxiliaryTypesAuxiliaryTypes.Point;
            const gridIndex     = this._getGridIndexByGlobalXY(point.x, point.y);
            const currGridIndex = this._getCursor().getGridIndex();
            if (!gridIndex.checkIsEqual(currGridIndex)) {
                this._isTouchMovedOrMultiple = true;
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCursorDragged, {
                    current     : currGridIndex,
                    draggedTo   : gridIndex,
                } as NotificationsDataTypes.BwCursorDragged);
            }
        }
    }

    private _onPointerPress(e: VendorEgretEgret.Event): void {
        const data      = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const touchId   = data.pointerId;
        const stageX    = data.stageX;
        const stageY    = data.stageY;
        if (this._currGlobalTouchPoints.size <= 0) {
            // this.getEventAgent().addPointerEventListener(PointerManager.PointerEventType.PressMove, this._onPointerPressMove, this);
            const { x: localX, y: localY }  = this.globalToLocal(stageX, stageY);
            this._initialGlobalTouchPoint   = { x: stageX, y: stageY };
            this._isTouchMovedOrMultiple    = false;
            this._touchIdForTouchingCursor  = this._getCursor().getGridIndex().checkIsEqual(this._getGridIndexByLocalXY(localX, localY))
                ? touchId
                : null;
        }

        if (this._currGlobalTouchPoints.size <= 1) {
            this._currGlobalTouchPoints.set(touchId, { x: stageX, y: stageY });
            this._prevGlobalTouchPoints.set(touchId, { x: stageX, y: stageY });
        }
        if (this._currGlobalTouchPoints.size >= 2) {
            this._isTouchMovedOrMultiple = true;
        }
    }
    private _onPointerReleaseIn(e: VendorEgretEgret.Event): void {
        const data = e.data as HelpersPointerInput.PointerUnifiedEventData;
        this._removeTouch(data.pointerId);
    }
    private _onPointerReleaseOut(e: VendorEgretEgret.Event): void {
        const data = e.data as HelpersPointerInput.PointerUnifiedEventData;
        this._removeTouch(data.pointerId);
    }
    private _onPointerPressMove(e: VendorEgretEgret.Event): void {
        const data                  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const touchId               = data.pointerId;
        const stageX                = data.stageX;
        const stageY                = data.stageY;
        const currGlobalTouchPoints = this._currGlobalTouchPoints;
        if (currGlobalTouchPoints.has(touchId)) {
            const initialGlobalTouchPoint   = HelpersMisc.getExisted(this._initialGlobalTouchPoint);
            this._isTouchMovedOrMultiple    = (this._isTouchMovedOrMultiple)
                || (GeometriesUtils.getSquaredPointDistance(stageX, stageY, initialGlobalTouchPoint.x, initialGlobalTouchPoint.y) > _DRAG_FIELD_SQUARED_TRIGGER_DISTANCE);
            currGlobalTouchPoints.set(touchId, { x: stageX, y: stageY });

            if (currGlobalTouchPoints.size > 1) {
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwFieldZoomedByTouch, {
                    current : currGlobalTouchPoints,
                    previous: this._prevGlobalTouchPoints,
                } as NotificationsDataTypes.BwFieldZoomedByTouch);
            } else {
                if (this._touchIdForTouchingCursor != null) {
                    const { x: localX, y: localY }  = this.globalToLocal(stageX, stageY);
                    const gridIndex                 = this._getGridIndexByLocalXY(localX, localY);
                    const currGridIndex             = this._getCursor().getGridIndex();
                    if (!gridIndex.checkIsEqual(currGridIndex)) {
                        this._isTouchMovedOrMultiple = true;
                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCursorDragged, {
                            current     : currGridIndex,
                            draggedTo   : gridIndex,
                        } as NotificationsDataTypes.BwCursorDragged);
                    }
                } else {
                    if (this._isTouchMovedOrMultiple) {
                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwFieldDragged, {
                            current : currGlobalTouchPoints.values().next().value,
                            previous: this._prevGlobalTouchPoints.values().next().value,
                        } as NotificationsDataTypes.BwFieldDragged);
                    }
                }
            }

            this._prevGlobalTouchPoints.set(touchId, { x: stageX, y: stageY });
        }
    }
    private _removeTouch(touchId: number): void {
        this._prevGlobalTouchPoints.delete(touchId);

        const currGlobalTouchPoints = this._currGlobalTouchPoints;
        if (currGlobalTouchPoints.has(touchId)) {
            currGlobalTouchPoints.delete(touchId);

            const touchIdForTouchingCursor = this._touchIdForTouchingCursor;
            if ((touchIdForTouchingCursor != null) && (!currGlobalTouchPoints.has(touchIdForTouchingCursor))) {
                this._touchIdForTouchingCursor = null;
            }
            if (!currGlobalTouchPoints.size) {
                // this.getEventAgent().removePointerEventListener(PointerManager.PointerEventType.PressMove, this._onPointerPressMove, this);
                if (!this._isTouchMovedOrMultiple) {
                    const initialGlobalTouchPoint = HelpersMisc.getExisted(this._initialGlobalTouchPoint);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCursorTapped, {
                        current : this._getCursor().getGridIndex(),
                        tappedOn: this._getGridIndexByGlobalXY(initialGlobalTouchPoint.x, initialGlobalTouchPoint.y),
                    } as NotificationsDataTypes.BwCursorTapped);
                } else {
                    if (touchIdForTouchingCursor != null) {
                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCursorDragEnded);
                    }
                }
                delete this._initialGlobalTouchPoint;
            }
        }
    }

    private async _onKeyboard(data: KeyboardKbTypes.EventData): Promise<void> {
        const cursor        = this._getCursor();
        const war           = cursor.getWar();
        const actionPlanner = war.getActionPlanner();
        if ((actionPlanner.checkIsStateRequesting())    ||
            (war.getIsExecutingAction())                ||
            (war.getIsEnded())                          ||
            (!war.getIsRunning())
        ) {
            return;
        }

        if (data.isHandled) {
            return;
        }

        const cursorGridIndex   = cursor.getGridIndex();
        const newKeys           = data.newKeys;
        const allKeys           = data.allKeys;
        if ((newKeys.has(KeyboardKbTypes.KeyCode.J)) || (newKeys.has(KeyboardKbTypes.KeyCode.Enter))) {
            data.isHandled = true;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCursorTapped, {
                current     : cursorGridIndex,
                tappedOn    : cursorGridIndex,
            } as NotificationsDataTypes.BwCursorTapped);

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.K)) {
            data.isHandled = true;
            actionPlanner.cancelCurrentState();

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.Escape)) {
            data.isHandled = true;
            if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
                war.getDrawer().setModePreview();
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            } else {
                actionPlanner.cancelCurrentState();
            }

        } else if ((newKeys.has(KeyboardKbTypes.KeyCode.S)) && (allKeys.has(KeyboardKbTypes.KeyCode.Control))) {
            if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
                data.isHandled = true;

                const currentTime   = Date.now();
                const deltaTime     = currentTime - this._lastSaveMapTime;
                if (deltaTime < 500) {
                    return;
                } else if (deltaTime < 10000) {
                    FloatText2.showLang(LangConstants.TextType.A0421);
                    return;
                }
                this._lastSaveMapTime = currentTime;

                if ((war == null) || (war.getIsReviewingMap())) {
                    FloatText2.showLang(LangConstants.TextType.A0273);
                    return;
                }
                // if (!war.getIsMapModified()) {
                //     FloatText.showLangText(LangTextType.A0085);
                //     return;
                // }

                const slotIndex = war.getMapSlotIndex();
                if (slotIndex === await MapEditorModelMeModel.getReviewingMapSlotIndex()) {
                    FloatText2.showLang(LangConstants.TextType.A0422);
                    return;
                }

                const mapRawData = await war.serializeForMap();
                MapEditorModelMeHelpers.getCriticalErrorCodeForMapRawData(mapRawData).then(errorCode => {
                    if (errorCode) {
                        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0304));
                    } else {
                        MapEditorModelMeProxy.reqMeSubmitNormalMap({
                            slotIndex                   : slotIndex,
                            mapRawData                  : mapRawData,
                            needReview                  : false,
                            srcNormalMapIdForAddEvent   : war.getSrcNormalMapIdForAddEvent(),
                            gridMarkData                : war.getGridMarkData(),
                        });
                    }
                });
            }

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.I)) {
            data.isHandled = true;

            if (((war instanceof GameHelpersGhFactory.getSpwWarClass()) && (war.getPlayerInTurn().getUserId() != null))                    ||
                ((war instanceof GameHelpersGhFactory.getMpwWarClass()) && (war.getPlayerIndexLoggedIn() === war.getPlayerIndexInTurn()))
            ) {
                ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);

                const gridIndex = war.getIdleBuildingGridIndex();
                if (!gridIndex) {
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
                } else {
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                    war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
                }
            } else {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
            }

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.U)) {
            data.isHandled = true;

            if (((war instanceof GameHelpersGhFactory.getSpwWarClass()) && (war.getPlayerInTurn().getUserId() != null))                    ||
                ((war instanceof GameHelpersGhFactory.getMpwWarClass()) && (war.getPlayerIndexLoggedIn() === war.getPlayerIndexInTurn()))
            ) {
                ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);

                const gridIndex = war.getIdleUnitGridIndex();
                if (!gridIndex) {
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
                } else {
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                    war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
                }
            } else {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
            }

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.Y)) {
            data.isHandled = true;

            if (((war instanceof GameHelpersGhFactory.getSpwWarClass()) && (war.getPlayerInTurn().getUserId() != null))                    ||
                ((war instanceof GameHelpersGhFactory.getMpwWarClass()) && (war.getPlayerIndexLoggedIn() === war.getPlayerIndexInTurn()))
            ) {
                if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(war.getPlayerIndexInTurn())) {
                    FloatText2.show(LangUtils.getText(LangConstants.TextType.A0034));
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getTitle    : () => LangUtils.getText(LangConstants.TextType.B0036),
                        getContent  : () => war.getHintForEndTurn(),
                        callback    : () => ActionPlannersStatesRequestingPlayerEndTurn.RequestingPlayerEndTurn.getInstance().doApplyOnChooseAction(war.getActionPlanner()),
                    });
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorConfirm01);
                }
            } else {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonForbidden01);
            }

        } else if ((allKeys.has(KeyboardKbTypes.KeyCode.Q)) || (allKeys.has(KeyboardKbTypes.KeyCode.E))) {
            data.isHandled = true;

            const zoomOut   = allKeys.has(KeyboardKbTypes.KeyCode.Q);
            const zoomIn    = allKeys.has(KeyboardKbTypes.KeyCode.E);
            if (((zoomOut) && (!zoomIn))    ||
                ((!zoomOut) && (zoomIn))
            ) {
                const point = this._conForNormal.localToGlobal(getGridWidth() / 2, getGridHeight() / 2);
                war.getView().zoomField(point.x, point.y, zoomIn);
            }

        } else if (KeyboardKbManager.checkHasDirectionKeys(allKeys)) {
            data.isHandled = true;

            const time                  = new Date().getTime();
            const hasNewDirectionKey    = KeyboardKbManager.checkHasDirectionKeys(newKeys);
            if ((hasNewDirectionKey)                                                                            ||
                ((time - this._lastNewDirectionKeyTime > 300) && (time - this._lastAllDirectionKeyTime > 80))
            ) {
                this._lastAllDirectionKeyTime = time;
                if (hasNewDirectionKey) {
                    this._lastNewDirectionKeyTime = time;
                }

                const mapSize       = war.getTileMap().getMapSize();
                const keys          = hasNewDirectionKey ? newKeys : allKeys;
                const newGridIndex  = new AuxiliaryTypesGridIndex.GridIndex(
                    NumbersUtils.getValueInRange({
                        minValue    : 0,
                        maxValue    : mapSize.getWidth() - 1,
                        rawValue    : cursorGridIndex.getX() + (keys.has(KeyboardKbTypes.KeyCode.A) ? -1 : 0) + (keys.has(KeyboardKbTypes.KeyCode.D) ? 1 : 0),
                    }),
                    NumbersUtils.getValueInRange({
                        minValue    : 0,
                        maxValue    : mapSize.getHeight() - 1,
                        rawValue    : cursorGridIndex.getY() + (keys.has(KeyboardKbTypes.KeyCode.W) ? -1 : 0) + (keys.has(KeyboardKbTypes.KeyCode.S) ? 1 : 0),
                    }),
                );

                if (!newGridIndex.checkIsEqual(cursorGridIndex)) {
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCursorDragged, {
                        current     : cursorGridIndex,
                        draggedTo   : newGridIndex,
                    } as NotificationsDataTypes.BwCursorDragged);
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updatePos(): void {
        const cursor = this._getCursor();
        this._conForAll.setX(cursor.getGridX() * getGridWidth());
        this._conForAll.setY(cursor.getGridY() * getGridHeight());
    }

    private _updateConForNormal(): void {
        const cursor        = this._getCursor();
        const actionPlanner = cursor.getWar().getActionPlanner();
        const gridIndex     = cursor.getGridIndex();
        const state         = actionPlanner.getStateId();
        const con           = this._conForNormal;

        if (state === ActionPlannersConstants.StateId.Idle) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.ExecutingAction) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(!actionPlanner.getFocusUnit()?.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(!actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(!actionPlanner.getUnitRepairCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(true);

        } else {
            // todo
        }
    }
    private _updateConForTarget(): void {
        const cursor        = this._getCursor();
        const actionPlanner = cursor.getWar().getActionPlanner();
        const con           = this._conForTarget;
        const gridIndex     = cursor.getGridIndex();
        const state         = actionPlanner.getStateId();

        if (state === ActionPlannersConstants.StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(!!actionPlanner.getFocusUnit()?.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(actionPlanner.getUnitRepairCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(true);

        } else if (state === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(false);

        } else {
            // todo
        }
    }
    private _updateConForTargetArea(): void {
        const actionPlanner = this._getCursor().getWar().getActionPlanner();
        const con           = this._conForTargetArea;
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
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(true);
            this._resetImagesForTargetArea();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(true);
            this._resetImagesForTargetArea();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(true);
            this._resetImagesForTargetArea();

        } else if (state === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(false);

        } else {
            // todo
        }
    }

    private _initConForNormal(): void {
        {
            const img = this._imgUpperLeftCorner;
            img.setIsSmoothing(false);
            img.setX(getUpperLeftCornerOuterX());
            img.setY(getUpperLeftCornerOuterY());
            this._conForNormal.addUiChild(img);
        }

        {
            const img = this._imgUpperRightCorner;
            img.setIsSmoothing(false);
            img.setX(getUpperRightCornerOuterX());
            img.setY(getUpperRightCornerOuterY());
            img.setRotationInDegree(90);
            this._conForNormal.addUiChild(img);
        }

        {
            const img = this._imgLowerLeftCorner;
            img.setIsSmoothing(false);
            img.setX(getLowerLeftCornerOuterX());
            img.setY(getLowerLeftCornerOuterY());
            img.setRotationInDegree(-90);
            this._conForNormal.addUiChild(img);
        }

        {
            const img = this._imgLowerRightCorner;
            img.setIsSmoothing(false);
            img.setX(getLowerRightCornerOuterX());
            img.setY(getLowerRightCornerOuterY());
            img.setRotationInDegree(180);
            this._conForNormal.addUiChild(img);
        }

        this._conForAll.addUiChild(this._conForNormal);
    }
    private _initConForTarget(): void {
        const img = this._imgTarget;
        img.setIsSmoothing(false);
        img.setX(-getGridWidth());
        img.setY(-getGridHeight());
        this._conForTarget.addUiChild(img);

        this._conForAll.addUiChild(this._conForTarget);
    }
    private _initConForTargetArea(): void {
        this._conForAll.addUiChild(this._conForTargetArea);
    }

    private _resetImagesForTargetArea(): void {
        const conForTargetArea  = this._conForTargetArea;
        const radius            = this._targetAreaRadius;
        if (radius < 0) {
            conForTargetArea.removeUiChildren();
            return;
        }

        const cursor                    = this._getCursor();
        const gridIndex                 = cursor.getGridIndex();
        const { x: gridX, y: gridY }    = gridIndex.getXY();
        let index                       = 0;
        for (const g of gridIndex.getGridsWithinDistance({ minDistance: radius, maxDistance: radius, mapSize: cursor.getMapSize() })) {
            const { x, y }  = g.getXY();
            const deltaX    = x - gridX;
            const deltaY    = y - gridY;
            if (deltaX <= 0) {
                const img   = this._getOrCreateImageForConTargetArea(index++);
                img.setUnscaledManualWidth(2);
                img.setUnscaledManualHeight(getGridHeight() - 2);
                img.setX((deltaX + 0) * getGridWidth() - 1);
                img.setY((deltaY + 0) * getGridHeight() + 1);
            }
            if (deltaX >= 0) {
                const img   = this._getOrCreateImageForConTargetArea(index++);
                img.setUnscaledManualWidth(2);
                img.setUnscaledManualHeight(getGridHeight() - 2);
                img.setX((deltaX + 1) * getGridWidth() - 1);
                img.setY((deltaY + 0) * getGridHeight() + 1);
            }
            if (deltaY >= 0) {
                const img   = this._getOrCreateImageForConTargetArea(index++);
                img.setUnscaledManualWidth(getGridWidth() - 2);
                img.setUnscaledManualHeight(2);
                img.setX((deltaX + 0) * getGridWidth() + 1);
                img.setY((deltaY + 1) * getGridHeight() - 1);
            }
            if (deltaY <= 0) {
                const img   = this._getOrCreateImageForConTargetArea(index++);
                img.setUnscaledManualWidth(getGridWidth() - 2);
                img.setUnscaledManualHeight(2);
                img.setX((deltaX + 0) * getGridWidth() + 1);
                img.setY((deltaY + 0) * getGridHeight() - 1);
            }
        }

        while (conForTargetArea.getUiChildren().length > index) {
            conForTargetArea.removeUiChildAt(conForTargetArea.getUiChildren().length - 1);
        }
    }
    private _getOrCreateImageForConTargetArea(index: number): UiInterfacesIUiImage.IUiImage {
        const con = this._conForTargetArea;
        while (index >= con.getUiChildren().length) {
            const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000` });
            img.setIsSmoothing(false);
            con.addUiChild(img);
        }

        return con.getUiChildAt(index) as UiInterfacesIUiImage.IUiImage;
    }

    private _startNormalAnimation(): void {
        this._stopNormalAnimation();

        TweenExecutor.Executor.get(this._imgUpperLeftCorner, { loop: true })
            .set({ customX: getUpperLeftCornerOuterX(), customY: getUpperLeftCornerOuterY() })
            .to({ customX: getUpperLeftCornerInnerX(), customY: getUpperLeftCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX: getUpperLeftCornerOuterX(), customY: getUpperLeftCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);

        TweenExecutor.Executor.get(this._imgUpperRightCorner, { loop: true })
            .set({ customX: getUpperRightCornerOuterX(), customY: getUpperRightCornerOuterY() })
            .to({ customX: getUpperRightCornerInnerX(), customY: getUpperRightCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX: getUpperRightCornerOuterX(), customY: getUpperRightCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);

        TweenExecutor.Executor.get(this._imgLowerLeftCorner, { loop: true })
            .set({ customX: getLowerLeftCornerOuterX(), customY: getLowerLeftCornerOuterY() })
            .to({ customX: getLowerLeftCornerInnerX(), customY: getLowerLeftCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX: getLowerLeftCornerOuterX(), customY: getLowerLeftCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);

        TweenExecutor.Executor.get(this._imgLowerRightCorner, { loop: true })
            .set({ customX: getLowerRightCornerOuterX(), customY: getLowerRightCornerOuterY() })
            .to({ customX: getLowerRightCornerInnerX(), customY: getLowerRightCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX: getLowerRightCornerOuterX(), customY: getLowerRightCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);
    }
    private _stopNormalAnimation(): void {
        TweenExecutor.Executor.removeTweens(this._imgUpperLeftCorner);
        TweenExecutor.Executor.removeTweens(this._imgUpperRightCorner);
        TweenExecutor.Executor.removeTweens(this._imgLowerLeftCorner);
        TweenExecutor.Executor.removeTweens(this._imgLowerRightCorner);
    }

    private _startTargetAnimation(): void {
        this._stopTargetAnimation();

        const totalFramesCount = getImageSourcesForCursorAiming().length;
        TweenExecutor.Executor.get(this._imgTarget, { loop: true })
            .wait(_TARGET_FRAME_DURATION)
            .call(() => {
                ++this._frameIndexForImgTarget;
                (this._frameIndexForImgTarget >= totalFramesCount) && (this._frameIndexForImgTarget = 0);
                this._imgTarget.loadSource(getImageSourcesForCursorAiming()[this._frameIndexForImgTarget]);
            });
    }
    private _stopTargetAnimation(): void {
        this._frameIndexForImgTarget = 0;
        TweenExecutor.Executor.removeTweens(this._imgTarget);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Utils.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _getGridXByLocalX(localX: number): number {
        let gridX = Math.floor(localX / getGridWidth());
        gridX = Math.max(gridX, 0);
        gridX = Math.min(gridX, this._getCursor().getMapSize().getWidth() - 1);
        return gridX;
    }
    private _getGridYByLocalY(localY: number): number {
        let gridY = Math.floor(localY / getGridHeight());
        gridY = Math.max(gridY, 0);
        gridY = Math.min(gridY, this._getCursor().getMapSize().getHeight() - 1);
        return gridY;
    }
    private _getGridIndexByLocalXY(localX: number, localY: number): AuxiliaryTypesGridIndex.GridIndex {
        return new AuxiliaryTypesGridIndex.GridIndex(this._getGridXByLocalX(localX), this._getGridYByLocalY(localY));
    }
    private _getGridIndexByGlobalXY(globalX: number, globalY: number): AuxiliaryTypesGridIndex.GridIndex {
        const point = this.globalToLocal(globalX, globalY);
        return this._getGridIndexByLocalXY(point.x, point.y);
    }
}
