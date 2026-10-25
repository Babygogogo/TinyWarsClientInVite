import { StateId } from "../../actionPlanners/Constants.ts";
import { Idle } from "../../actionPlanners/states/Idle.ts";
import { RequestingPlayerEndTurn } from "../../actionPlanners/states/RequestingPlayerEndTurn.ts";
import type { Point } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwCursor } from "../interface/IBwCursor.ts";
import type { IBwCursorView } from "../interface/IBwCursorView.ts";
import { showLang, show } from "../../FloatText.ts";
import { getMeWarClass, getSpwWarClass, getMpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getSquaredPointDistance } from "../../geometries/Utils.ts";
import { getCurrentTextureResolutionConfig } from "../../graphics/Utils.ts";
import { getCursorCorner, getArrayCursorAiming } from "../../helpers/ImageSource.ts";
import { createLazyFunc, getExisted } from "../../helpers/Misc.ts";
import { PointerEventType, type PointerUnifiedEventData } from "../../helpers/PointerInput.ts";
import { addListener, deleteListener, checkHasDirectionKeys } from "../../keyboard/KbManager.ts";
import { type EventData, KeyCode } from "../../keyboard/KbTypes.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { getCriticalErrorCodeForMapRawData } from "../../mapEditor/model/MeHelpers.ts";
import { getReviewingMapSlotIndex } from "../../mapEditor/model/MeModel.ts";
import { reqMeSubmitNormalMap } from "../../mapEditor/model/MeProxy.ts";
import type { BwCursorDragged, BwFieldZoomedByTouch, BwFieldDragged, BwCursorTapped } from "../../notifications/DataTypes.ts";
import { addEventListener, removeEventListener, dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiContainer } from "../../ui/components/UiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import { getUiContainerClass, getUiImageClass } from "../../ui/utils/UiFactory.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

const _PULSE_IN_DURATION                    = 150;
const _PULSE_OUT_DURATION                   = 150;
const _PULSE_INTERVAL_DURATION              = 300;
const _TARGET_FRAME_DURATION                = 100;
const _DRAG_FIELD_SQUARED_TRIGGER_DISTANCE  = 400;
const getImageSourceForCursorCorner         = createLazyFunc(() => getCursorCorner());
const getImageSourcesForCursorAiming        = createLazyFunc(() => getArrayCursorAiming());

const getGridWidth                  = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight                 = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);
const getOutLength                  = createLazyFunc(() => getGridWidth() / 6);
const getInLength                   = createLazyFunc(() => getGridWidth() / 9);
const getUpperLeftCornerOuterX      = createLazyFunc(() => -getOutLength());
const getUpperLeftCornerOuterY      = createLazyFunc(() => -getOutLength());
const getUpperLeftCornerInnerX      = createLazyFunc(() => getInLength());
const getUpperLeftCornerInnerY      = createLazyFunc(() => getInLength());
const getUpperRightCornerOuterX     = createLazyFunc(() => getGridWidth() + getOutLength());
const getUpperRightCornerOuterY     = createLazyFunc(() => -getOutLength());
const getUpperRightCornerInnerX     = createLazyFunc(() => getGridWidth() - getInLength());
const getUpperRightCornerInnerY     = createLazyFunc(() => getInLength());
const getLowerLeftCornerOuterX      = createLazyFunc(() => -getOutLength());
const getLowerLeftCornerOuterY      = createLazyFunc(() => getGridHeight() + getOutLength());
const getLowerLeftCornerInnerX      = createLazyFunc(() => getInLength());
const getLowerLeftCornerInnerY      = createLazyFunc(() => getGridHeight() - getInLength());
const getLowerRightCornerOuterX     = createLazyFunc(() => getGridWidth()  + getOutLength());
const getLowerRightCornerOuterY     = createLazyFunc(() => getGridHeight() + getOutLength());
const getLowerRightCornerInnerX     = createLazyFunc(() => getGridWidth()  - getInLength());
const getLowerRightCornerInnerY     = createLazyFunc(() => getGridHeight() - getInLength());

export class BwCursorView extends UiContainer implements IBwCursorView {
    private _cursor?                : IBwCursor;
    private _frameIndexForImgTarget = 0;

    private _currGlobalTouchPoints      = new Map<number, Point>();
    private _prevGlobalTouchPoints      = new Map<number, Point>();
    private _touchIdForTouchingCursor   : number | null = null;
    private _initialGlobalTouchPoint?   : Point;
    private _isTouchMovedOrMultiple?    : boolean;
    private _targetAreaRadius           = 2;
    private _lastNewDirectionKeyTime    = new Date().getTime();
    private _lastAllDirectionKeyTime    = new Date().getTime();
    private _lastSaveMapTime            = 0;

    private readonly _conForAll             = new (getUiContainerClass())();
    private readonly _conForNormal          = new (getUiContainerClass())();
    private readonly _conForTarget          = new (getUiContainerClass())();
    private readonly _conForTargetArea      = new (getUiContainerClass())();
    private readonly _imgUpperLeftCorner    = new (getUiImageClass())({ textureSourceName: getImageSourceForCursorCorner() });
    private readonly _imgUpperRightCorner   = new (getUiImageClass())({ textureSourceName: getImageSourceForCursorCorner() });
    private readonly _imgLowerLeftCorner    = new (getUiImageClass())({ textureSourceName: getImageSourceForCursorCorner() });
    private readonly _imgLowerRightCorner   = new (getUiImageClass())({ textureSourceName: getImageSourceForCursorCorner() });
    private readonly _imgTarget             = new (getUiImageClass())({ textureSourceName: getImageSourcesForCursorAiming()[this._frameIndexForImgTarget] });

    public constructor() {
        super();

        this.setIsTouchChildrenEnabled(false);
        this.addUiChild(this._conForAll);
        this._initConForNormal();
        this._initConForTarget();
        this._initConForTargetArea();
    }

    public init(cursor: IBwCursor): void {
        this._cursor = cursor;

        const mapSize = cursor.getMapSize();
        this.setUnscaledManualWidth(mapSize.getWidth() * getGridWidth());
        this.setUnscaledManualHeight(mapSize.getHeight() * getGridHeight());
    }
    public fastInit(cursor: IBwCursor): void {
        this._cursor = cursor;
    }

    public startRunningView(): void {
        addEventListener(TypeId.ZoomableContentsMoved, this._onNotifyZoomableContentsMoved, this);
        addListener(this._onKeyboard, this);

        {
            const agent = this.getEventAgent();
            agent.addPointerEventListener(PointerEventType.Press,        this._onPointerPress,       this);
            agent.addPointerEventListener(PointerEventType.ReleaseIn,    this._onPointerReleaseIn,   this);
            agent.addPointerEventListener(PointerEventType.ReleaseOut,   this._onPointerReleaseOut,  this);
            agent.addPointerEventListener(PointerEventType.PressMove,    this._onPointerPressMove,   this);
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

        removeEventListener(TypeId.ZoomableContentsMoved,        this._onNotifyZoomableContentsMoved,    this);
        deleteListener(this._onKeyboard, this);

        {
            const agent = this.getEventAgent();
            agent.removePointerEventListener(PointerEventType.Press,         this._onPointerPress,       this);
            agent.removePointerEventListener(PointerEventType.ReleaseIn,     this._onPointerReleaseIn,   this);
            agent.removePointerEventListener(PointerEventType.ReleaseOut,    this._onPointerReleaseOut,  this);
            agent.removePointerEventListener(PointerEventType.PressMove,     this._onPointerPressMove,   this);
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

    private _getCursor(): IBwCursor {
        return getExisted(this._cursor);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyZoomableContentsMoved(): void {
        const touchPoints = this._currGlobalTouchPoints;
        if ((this._touchIdForTouchingCursor != null) && (touchPoints.size === 1)) {
            const point         = touchPoints.values().next().value as Point;
            const gridIndex     = this._getGridIndexByGlobalXY(point.x, point.y);
            const currGridIndex = this._getCursor().getGridIndex();
            if (!gridIndex.checkIsEqual(currGridIndex)) {
                this._isTouchMovedOrMultiple = true;
                dispatch(TypeId.BwCursorDragged, {
                    current     : currGridIndex,
                    draggedTo   : gridIndex,
                } as BwCursorDragged);
            }
        }
    }

    private _onPointerPress(e: Event): void {
        const data      = e.data as PointerUnifiedEventData;
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
    private _onPointerReleaseIn(e: Event): void {
        const data = e.data as PointerUnifiedEventData;
        this._removeTouch(data.pointerId);
    }
    private _onPointerReleaseOut(e: Event): void {
        const data = e.data as PointerUnifiedEventData;
        this._removeTouch(data.pointerId);
    }
    private _onPointerPressMove(e: Event): void {
        const data                  = e.data as PointerUnifiedEventData;
        const touchId               = data.pointerId;
        const stageX                = data.stageX;
        const stageY                = data.stageY;
        const currGlobalTouchPoints = this._currGlobalTouchPoints;
        if (currGlobalTouchPoints.has(touchId)) {
            const initialGlobalTouchPoint   = getExisted(this._initialGlobalTouchPoint);
            this._isTouchMovedOrMultiple    = (this._isTouchMovedOrMultiple)
                || (getSquaredPointDistance(stageX, stageY, initialGlobalTouchPoint.x, initialGlobalTouchPoint.y) > _DRAG_FIELD_SQUARED_TRIGGER_DISTANCE);
            currGlobalTouchPoints.set(touchId, { x: stageX, y: stageY });

            if (currGlobalTouchPoints.size > 1) {
                dispatch(TypeId.BwFieldZoomedByTouch, {
                    current : currGlobalTouchPoints,
                    previous: this._prevGlobalTouchPoints,
                } as BwFieldZoomedByTouch);
            } else {
                if (this._touchIdForTouchingCursor != null) {
                    const { x: localX, y: localY }  = this.globalToLocal(stageX, stageY);
                    const gridIndex                 = this._getGridIndexByLocalXY(localX, localY);
                    const currGridIndex             = this._getCursor().getGridIndex();
                    if (!gridIndex.checkIsEqual(currGridIndex)) {
                        this._isTouchMovedOrMultiple = true;
                        dispatch(TypeId.BwCursorDragged, {
                            current     : currGridIndex,
                            draggedTo   : gridIndex,
                        } as BwCursorDragged);
                    }
                } else {
                    if (this._isTouchMovedOrMultiple) {
                        dispatch(TypeId.BwFieldDragged, {
                            current : currGlobalTouchPoints.values().next().value,
                            previous: this._prevGlobalTouchPoints.values().next().value,
                        } as BwFieldDragged);
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
                    const initialGlobalTouchPoint = getExisted(this._initialGlobalTouchPoint);
                    dispatch(TypeId.BwCursorTapped, {
                        current : this._getCursor().getGridIndex(),
                        tappedOn: this._getGridIndexByGlobalXY(initialGlobalTouchPoint.x, initialGlobalTouchPoint.y),
                    } as BwCursorTapped);
                } else {
                    if (touchIdForTouchingCursor != null) {
                        dispatch(TypeId.BwCursorDragEnded);
                    }
                }
                delete this._initialGlobalTouchPoint;
            }
        }
    }

    private async _onKeyboard(data: EventData): Promise<void> {
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
        if ((newKeys.has(KeyCode.J)) || (newKeys.has(KeyCode.Enter))) {
            data.isHandled = true;
            dispatch(TypeId.BwCursorTapped, {
                current     : cursorGridIndex,
                tappedOn    : cursorGridIndex,
            } as BwCursorTapped);

        } else if (newKeys.has(KeyCode.K)) {
            data.isHandled = true;
            actionPlanner.cancelCurrentState();

        } else if (newKeys.has(KeyCode.Escape)) {
            data.isHandled = true;
            if (war instanceof getMeWarClass()) {
                war.getDrawer().setModePreview();
                playShortSfx(ShortSfxCode.ButtonCancel01);
            } else {
                actionPlanner.cancelCurrentState();
            }

        } else if ((newKeys.has(KeyCode.S)) && (allKeys.has(KeyCode.Control))) {
            if (war instanceof getMeWarClass()) {
                data.isHandled = true;

                const currentTime   = Date.now();
                const deltaTime     = currentTime - this._lastSaveMapTime;
                if (deltaTime < 500) {
                    return;
                } else if (deltaTime < 10000) {
                    showLang(TextType.A0421);
                    return;
                }
                this._lastSaveMapTime = currentTime;

                if ((war == null) || (war.getIsReviewingMap())) {
                    showLang(TextType.A0273);
                    return;
                }
                // if (!war.getIsMapModified()) {
                //     FloatText.showLangText(LangTextType.A0085);
                //     return;
                // }

                const slotIndex = war.getMapSlotIndex();
                if (slotIndex === await getReviewingMapSlotIndex()) {
                    showLang(TextType.A0422);
                    return;
                }

                const mapRawData = await war.serializeForMap();
                getCriticalErrorCodeForMapRawData(mapRawData).then(errorCode => {
                    if (errorCode) {
                        show(getText(TextType.A0304));
                    } else {
                        reqMeSubmitNormalMap({
                            slotIndex                   : slotIndex,
                            mapRawData                  : mapRawData,
                            needReview                  : false,
                            srcNormalMapIdForAddEvent   : war.getSrcNormalMapIdForAddEvent(),
                            gridMarkData                : war.getGridMarkData(),
                        });
                    }
                });
            }

        } else if (newKeys.has(KeyCode.I)) {
            data.isHandled = true;

            if (((war instanceof getSpwWarClass()) && (war.getPlayerInTurn().getUserId() != null))                    ||
                ((war instanceof getMpwWarClass()) && (war.getPlayerIndexLoggedIn() === war.getPlayerIndexInTurn()))
            ) {
                Idle.getInstance().apply(actionPlanner);

                const gridIndex = war.getIdleBuildingGridIndex();
                if (!gridIndex) {
                    playShortSfx(ShortSfxCode.ButtonForbidden01);
                } else {
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                    war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                    playShortSfx(ShortSfxCode.ButtonNeutral01);
                }
            } else {
                playShortSfx(ShortSfxCode.ButtonForbidden01);
            }

        } else if (newKeys.has(KeyCode.U)) {
            data.isHandled = true;

            if (((war instanceof getSpwWarClass()) && (war.getPlayerInTurn().getUserId() != null))                    ||
                ((war instanceof getMpwWarClass()) && (war.getPlayerIndexLoggedIn() === war.getPlayerIndexInTurn()))
            ) {
                Idle.getInstance().apply(actionPlanner);

                const gridIndex = war.getIdleUnitGridIndex();
                if (!gridIndex) {
                    playShortSfx(ShortSfxCode.ButtonForbidden01);
                } else {
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                    war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                    playShortSfx(ShortSfxCode.ButtonNeutral01);
                }
            } else {
                playShortSfx(ShortSfxCode.ButtonForbidden01);
            }

        } else if (newKeys.has(KeyCode.Y)) {
            data.isHandled = true;

            if (((war instanceof getSpwWarClass()) && (war.getPlayerInTurn().getUserId() != null))                    ||
                ((war instanceof getMpwWarClass()) && (war.getPlayerIndexLoggedIn() === war.getPlayerIndexInTurn()))
            ) {
                if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(war.getPlayerIndexInTurn())) {
                    show(getText(TextType.A0034));
                    playShortSfx(ShortSfxCode.ButtonForbidden01);
                } else {
                    openPanel(getDict().CommonConfirmPanel, {
                        getTitle    : () => getText(TextType.B0036),
                        getContent  : () => war.getHintForEndTurn(),
                        callback    : () => RequestingPlayerEndTurn.getInstance().doApplyOnChooseAction(war.getActionPlanner()),
                    });
                    playShortSfx(ShortSfxCode.CursorConfirm01);
                }
            } else {
                playShortSfx(ShortSfxCode.ButtonForbidden01);
            }

        } else if ((allKeys.has(KeyCode.Q)) || (allKeys.has(KeyCode.E))) {
            data.isHandled = true;

            const zoomOut   = allKeys.has(KeyCode.Q);
            const zoomIn    = allKeys.has(KeyCode.E);
            if (((zoomOut) && (!zoomIn))    ||
                ((!zoomOut) && (zoomIn))
            ) {
                const point = this._conForNormal.localToGlobal(getGridWidth() / 2, getGridHeight() / 2);
                war.getView().zoomField(point.x, point.y, zoomIn);
            }

        } else if (checkHasDirectionKeys(allKeys)) {
            data.isHandled = true;

            const time                  = new Date().getTime();
            const hasNewDirectionKey    = checkHasDirectionKeys(newKeys);
            if ((hasNewDirectionKey)                                                                            ||
                ((time - this._lastNewDirectionKeyTime > 300) && (time - this._lastAllDirectionKeyTime > 80))
            ) {
                this._lastAllDirectionKeyTime = time;
                if (hasNewDirectionKey) {
                    this._lastNewDirectionKeyTime = time;
                }

                const mapSize       = war.getTileMap().getMapSize();
                const keys          = hasNewDirectionKey ? newKeys : allKeys;
                const newGridIndex  = new GridIndex(
                    getValueInRange({
                        minValue    : 0,
                        maxValue    : mapSize.getWidth() - 1,
                        rawValue    : cursorGridIndex.getX() + (keys.has(KeyCode.A) ? -1 : 0) + (keys.has(KeyCode.D) ? 1 : 0),
                    }),
                    getValueInRange({
                        minValue    : 0,
                        maxValue    : mapSize.getHeight() - 1,
                        rawValue    : cursorGridIndex.getY() + (keys.has(KeyCode.W) ? -1 : 0) + (keys.has(KeyCode.S) ? 1 : 0),
                    }),
                );

                if (!newGridIndex.checkIsEqual(cursorGridIndex)) {
                    dispatch(TypeId.BwCursorDragged, {
                        current     : cursorGridIndex,
                        draggedTo   : newGridIndex,
                    } as BwCursorDragged);
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

        if (state === StateId.Idle) {
            con.setIsVisible(true);

        } else if (state === StateId.ExecutingAction) {
            con.setIsVisible(true);

        } else if (state === StateId.ChoosingUnitMovePath) {
            con.setIsVisible(!actionPlanner.getFocusUnit()?.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex));

        } else if (state === StateId.ChoosingUnitAction) {
            con.setIsVisible(true);

        } else if (state === StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex));

        } else if (state === StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(!actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(true);

        } else if (state === StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(!actionPlanner.getUnitRepairCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(true);

        } else if (state === StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(true);

        } else if (state === StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(true);

        } else if (state === StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(true);

        } else if (state === StateId.PreviewingTileAttackableArea) {
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

        if (state === StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitMovePath) {
            con.setIsVisible(!!actionPlanner.getFocusUnit()?.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex));

        } else if (state === StateId.ChoosingUnitAction) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex));

        } else if (state === StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(true);

        } else if (state === StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(true);

        } else if (state === StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(actionPlanner.getUnitRepairCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(true);

        } else if (state === StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(false);

        } else {
            // todo
        }
    }
    private _updateConForTargetArea(): void {
        const actionPlanner = this._getCursor().getWar().getActionPlanner();
        const con           = this._conForTargetArea;
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
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(true);
            this._resetImagesForTargetArea();

        } else if (state === StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(true);
            this._resetImagesForTargetArea();

        } else if (state === StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(true);
            this._resetImagesForTargetArea();

        } else if (state === StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === StateId.PreviewingTileAttackableArea) {
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
    private _getOrCreateImageForConTargetArea(index: number): IUiImage {
        const con = this._conForTargetArea;
        while (index >= con.getUiChildren().length) {
            const img = new (getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000` });
            img.setIsSmoothing(false);
            con.addUiChild(img);
        }

        return con.getUiChildAt(index) as IUiImage;
    }

    private _startNormalAnimation(): void {
        this._stopNormalAnimation();

        Executor.get(this._imgUpperLeftCorner, { loop: true })
            .set({ customX: getUpperLeftCornerOuterX(), customY: getUpperLeftCornerOuterY() })
            .to({ customX: getUpperLeftCornerInnerX(), customY: getUpperLeftCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX: getUpperLeftCornerOuterX(), customY: getUpperLeftCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);

        Executor.get(this._imgUpperRightCorner, { loop: true })
            .set({ customX: getUpperRightCornerOuterX(), customY: getUpperRightCornerOuterY() })
            .to({ customX: getUpperRightCornerInnerX(), customY: getUpperRightCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX: getUpperRightCornerOuterX(), customY: getUpperRightCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);

        Executor.get(this._imgLowerLeftCorner, { loop: true })
            .set({ customX: getLowerLeftCornerOuterX(), customY: getLowerLeftCornerOuterY() })
            .to({ customX: getLowerLeftCornerInnerX(), customY: getLowerLeftCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX: getLowerLeftCornerOuterX(), customY: getLowerLeftCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);

        Executor.get(this._imgLowerRightCorner, { loop: true })
            .set({ customX: getLowerRightCornerOuterX(), customY: getLowerRightCornerOuterY() })
            .to({ customX: getLowerRightCornerInnerX(), customY: getLowerRightCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX: getLowerRightCornerOuterX(), customY: getLowerRightCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);
    }
    private _stopNormalAnimation(): void {
        Executor.removeTweens(this._imgUpperLeftCorner);
        Executor.removeTweens(this._imgUpperRightCorner);
        Executor.removeTweens(this._imgLowerLeftCorner);
        Executor.removeTweens(this._imgLowerRightCorner);
    }

    private _startTargetAnimation(): void {
        this._stopTargetAnimation();

        const totalFramesCount = getImageSourcesForCursorAiming().length;
        Executor.get(this._imgTarget, { loop: true })
            .wait(_TARGET_FRAME_DURATION)
            .call(() => {
                ++this._frameIndexForImgTarget;
                (this._frameIndexForImgTarget >= totalFramesCount) && (this._frameIndexForImgTarget = 0);
                this._imgTarget.loadSource(getImageSourcesForCursorAiming()[this._frameIndexForImgTarget]);
            });
    }
    private _stopTargetAnimation(): void {
        this._frameIndexForImgTarget = 0;
        Executor.removeTweens(this._imgTarget);
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
    private _getGridIndexByLocalXY(localX: number, localY: number): GridIndex {
        return new GridIndex(this._getGridXByLocalX(localX), this._getGridYByLocalY(localY));
    }
    private _getGridIndexByGlobalXY(globalX: number, globalY: number): GridIndex {
        const point = this.globalToLocal(globalX, globalY);
        return this._getGridIndexByLocalXY(point.x, point.y);
    }
}
