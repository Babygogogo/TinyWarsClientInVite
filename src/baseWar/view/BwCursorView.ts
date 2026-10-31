import {
    AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwCursor,
    type BaseWar_Interface_IBwCursorView,
    ActionPlanners_States_Idle,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    ActionPlanners_States_RequestingPlayerEndTurn,
    FloatText,
    SinglePlayerWar_Model_SpwWar,
    ActionPlanners_Constants,
    Ui_Components_UiImage,
    Notifications_Dispatcher,
    Keyboard_KbManager,
    Helpers_Misc,
    Keyboard_KbTypes,
    Tween_Executor,
    Helpers_ImageSource,
    MapEditor_Model_MeHelpers,
    Graphics_Utils,
    GamePanels_Dict,
    MapEditor_Model_MeModel,
    Geometries_Utils,
    Lang_Utils,
    Numbers_Utils,
    type Ui_Interfaces_IUiImage,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Helpers_PointerInput,
    MapEditor_Model_MeProxy,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiContainer,
    type Egret_Egret,
} from "../../internal.ts";

const _PULSE_IN_DURATION                    = 150;
const _PULSE_OUT_DURATION                   = 150;
const _PULSE_INTERVAL_DURATION              = 300;
const _TARGET_FRAME_DURATION                = 100;
const _DRAG_FIELD_SQUARED_TRIGGER_DISTANCE  = 400;
const getImageSourceForCursorCorner         = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getCursorCorner());
const getImageSourcesForCursorAiming        = Helpers_Misc.createLazyFunc(() => Helpers_ImageSource.getArrayCursorAiming());

const getGridWidth                  = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight                 = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);
const getOutLength                  = Helpers_Misc.createLazyFunc(() => getGridWidth() / 6);
const getInLength                   = Helpers_Misc.createLazyFunc(() => getGridWidth() / 9);
const getUpperLeftCornerOuterX      = Helpers_Misc.createLazyFunc(() => -getOutLength());
const getUpperLeftCornerOuterY      = Helpers_Misc.createLazyFunc(() => -getOutLength());
const getUpperLeftCornerInnerX      = Helpers_Misc.createLazyFunc(() => getInLength());
const getUpperLeftCornerInnerY      = Helpers_Misc.createLazyFunc(() => getInLength());
const getUpperRightCornerOuterX     = Helpers_Misc.createLazyFunc(() => getGridWidth() + getOutLength());
const getUpperRightCornerOuterY     = Helpers_Misc.createLazyFunc(() => -getOutLength());
const getUpperRightCornerInnerX     = Helpers_Misc.createLazyFunc(() => getGridWidth() - getInLength());
const getUpperRightCornerInnerY     = Helpers_Misc.createLazyFunc(() => getInLength());
const getLowerLeftCornerOuterX      = Helpers_Misc.createLazyFunc(() => -getOutLength());
const getLowerLeftCornerOuterY      = Helpers_Misc.createLazyFunc(() => getGridHeight() + getOutLength());
const getLowerLeftCornerInnerX      = Helpers_Misc.createLazyFunc(() => getInLength());
const getLowerLeftCornerInnerY      = Helpers_Misc.createLazyFunc(() => getGridHeight() - getInLength());
const getLowerRightCornerOuterX     = Helpers_Misc.createLazyFunc(() => getGridWidth()  + getOutLength());
const getLowerRightCornerOuterY     = Helpers_Misc.createLazyFunc(() => getGridHeight() + getOutLength());
const getLowerRightCornerInnerX     = Helpers_Misc.createLazyFunc(() => getGridWidth()  - getInLength());
const getLowerRightCornerInnerY     = Helpers_Misc.createLazyFunc(() => getGridHeight() - getInLength());

export class BwCursorView extends Ui_Components_UiContainer.UiContainer implements BaseWar_Interface_IBwCursorView.IBwCursorView {
    private _cursor?                : BaseWar_Interface_IBwCursor.IBwCursor;
    private _frameIndexForImgTarget = 0;

    private readonly _currGlobalTouchPoints      = new Map<number, AuxiliaryTypes_AuxiliaryTypes.Point>();
    private readonly _prevGlobalTouchPoints      = new Map<number, AuxiliaryTypes_AuxiliaryTypes.Point>();
    private _touchIdForTouchingCursor   : number | null = null;
    private _initialGlobalTouchPoint?   : AuxiliaryTypes_AuxiliaryTypes.Point;
    private _isTouchMovedOrMultiple?    : boolean;
    private _targetAreaRadius           = 2;
    private _lastNewDirectionKeyTime    = new Date().getTime();
    private _lastAllDirectionKeyTime    = new Date().getTime();
    private _lastSaveMapTime            = 0;

    private readonly _conForAll             = new Ui_Components_UiContainer.UiContainer();
    private readonly _conForNormal          = new Ui_Components_UiContainer.UiContainer();
    private readonly _conForTarget          = new Ui_Components_UiContainer.UiContainer();
    private readonly _conForTargetArea      = new Ui_Components_UiContainer.UiContainer();
    private readonly _imgUpperLeftCorner    = new Ui_Components_UiImage.UiImage({ textureSourceName : getImageSourceForCursorCorner() });
    private readonly _imgUpperRightCorner   = new Ui_Components_UiImage.UiImage({ textureSourceName : getImageSourceForCursorCorner() });
    private readonly _imgLowerLeftCorner    = new Ui_Components_UiImage.UiImage({ textureSourceName : getImageSourceForCursorCorner() });
    private readonly _imgLowerRightCorner   = new Ui_Components_UiImage.UiImage({ textureSourceName : getImageSourceForCursorCorner() });
    private readonly _imgTarget             = new Ui_Components_UiImage.UiImage({ textureSourceName : getImageSourcesForCursorAiming()[this._frameIndexForImgTarget] });

    public constructor() {
        super();

        this.setIsTouchChildrenEnabled(false);
        this.addUiChild(this._conForAll);
        this._initConForNormal();
        this._initConForTarget();
        this._initConForTargetArea();
    }

    public init(cursor: BaseWar_Interface_IBwCursor.IBwCursor): void {
        this._cursor = cursor;

        const mapSize = cursor.getMapSize();
        this.setUnscaledManualWidth(mapSize.getWidth() * getGridWidth());
        this.setUnscaledManualHeight(mapSize.getHeight() * getGridHeight());
    }
    public fastInit(cursor: BaseWar_Interface_IBwCursor.IBwCursor): void {
        this._cursor = cursor;
    }

    public startRunningView(): void {
        Notifications_Dispatcher.addEventListener("ZoomableContentsMoved", this._onNotifyZoomableContentsMoved, this);
        Keyboard_KbManager.addListener(this._onKeyboard, this);

        {
            const agent = this.getEventAgent();
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Press,        this._onPointerPress,       this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseIn,    this._onPointerReleaseIn,   this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseOut,   this._onPointerReleaseOut,  this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.PressMove,    this._onPointerPressMove,   this);
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

        Notifications_Dispatcher.removeEventListener("ZoomableContentsMoved",        this._onNotifyZoomableContentsMoved,    this);
        Keyboard_KbManager.deleteListener(this._onKeyboard, this);

        {
            const agent = this.getEventAgent();
            agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.Press,         this._onPointerPress,       this);
            agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseIn,     this._onPointerReleaseIn,   this);
            agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseOut,    this._onPointerReleaseOut,  this);
            agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.PressMove,     this._onPointerPressMove,   this);
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

    private _getCursor(): BaseWar_Interface_IBwCursor.IBwCursor {
        return Helpers_Misc.getExisted(this._cursor);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyZoomableContentsMoved(): void {
        const touchPoints = this._currGlobalTouchPoints;
        if ((this._touchIdForTouchingCursor != null) && (touchPoints.size === 1)) {
            const point         = touchPoints.values().next().value as AuxiliaryTypes_AuxiliaryTypes.Point;
            const gridIndex     = this._getGridIndexByGlobalXY(point.x, point.y);
            const currGridIndex = this._getCursor().getGridIndex();
            if (!gridIndex.checkIsEqual(currGridIndex)) {
                this._isTouchMovedOrMultiple = true;
                Notifications_Dispatcher.dispatch("BwCursorDragged", {
                    current   : currGridIndex,
                    draggedTo : gridIndex,
                });
            }
        }
    }

    private _onPointerPress(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const data      = Helpers_Misc.getExisted(e.data);
        const touchId   = data.pointerId;
        const stageX    = data.stageX;
        const stageY    = data.stageY;
        if (this._currGlobalTouchPoints.size <= 0) {
            // this.getEventAgent().addPointerEventListener(PointerManager.PointerEventType.PressMove, this._onPointerPressMove, this);
            const { x: localX, y: localY }  = this.globalToLocal(stageX, stageY);
            this._initialGlobalTouchPoint   = { x : stageX, y : stageY };
            this._isTouchMovedOrMultiple    = false;
            this._touchIdForTouchingCursor  = this._getCursor().getGridIndex().checkIsEqual(this._getGridIndexByLocalXY(localX, localY))
                ? touchId
                : null;
        }

        if (this._currGlobalTouchPoints.size <= 1) {
            this._currGlobalTouchPoints.set(touchId, { x : stageX, y : stageY });
            this._prevGlobalTouchPoints.set(touchId, { x : stageX, y : stageY });
        }
        if (this._currGlobalTouchPoints.size >= 2) {
            this._isTouchMovedOrMultiple = true;
        }
    }
    private _onPointerReleaseIn(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const data = Helpers_Misc.getExisted(e.data);
        this._removeTouch(data.pointerId);
    }
    private _onPointerReleaseOut(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const data = Helpers_Misc.getExisted(e.data);
        this._removeTouch(data.pointerId);
    }
    private _onPointerPressMove(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const data                  = Helpers_Misc.getExisted(e.data);
        const touchId               = data.pointerId;
        const stageX                = data.stageX;
        const stageY                = data.stageY;
        const currGlobalTouchPoints = this._currGlobalTouchPoints;
        if (currGlobalTouchPoints.has(touchId)) {
            const initialGlobalTouchPoint   = Helpers_Misc.getExisted(this._initialGlobalTouchPoint);
            this._isTouchMovedOrMultiple    = (this._isTouchMovedOrMultiple)
                || (Geometries_Utils.getSquaredPointDistance(stageX, stageY, initialGlobalTouchPoint.x, initialGlobalTouchPoint.y) > _DRAG_FIELD_SQUARED_TRIGGER_DISTANCE);
            currGlobalTouchPoints.set(touchId, { x : stageX, y : stageY });

            if (currGlobalTouchPoints.size > 1) {
                Notifications_Dispatcher.dispatch("BwFieldZoomedByTouch", {
                    current  : currGlobalTouchPoints,
                    previous : this._prevGlobalTouchPoints,
                });
            } else {
                if (this._touchIdForTouchingCursor != null) {
                    const { x: localX, y: localY }  = this.globalToLocal(stageX, stageY);
                    const gridIndex                 = this._getGridIndexByLocalXY(localX, localY);
                    const currGridIndex             = this._getCursor().getGridIndex();
                    if (!gridIndex.checkIsEqual(currGridIndex)) {
                        this._isTouchMovedOrMultiple = true;
                        Notifications_Dispatcher.dispatch("BwCursorDragged", {
                            current   : currGridIndex,
                            draggedTo : gridIndex,
                        });
                    }
                } else {
                    if (this._isTouchMovedOrMultiple) {
                        Notifications_Dispatcher.dispatch("BwFieldDragged", {
                            current  : Helpers_Misc.getExisted(currGlobalTouchPoints.values().next().value),
                            previous : Helpers_Misc.getExisted(this._prevGlobalTouchPoints.values().next().value),
                        });
                    }
                }
            }

            this._prevGlobalTouchPoints.set(touchId, { x : stageX, y : stageY });
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
                    const initialGlobalTouchPoint = Helpers_Misc.getExisted(this._initialGlobalTouchPoint);
                    Notifications_Dispatcher.dispatch("BwCursorTapped", {
                        current  : this._getCursor().getGridIndex(),
                        tappedOn : this._getGridIndexByGlobalXY(initialGlobalTouchPoint.x, initialGlobalTouchPoint.y),
                    });
                } else {
                    if (touchIdForTouchingCursor != null) {
                        Notifications_Dispatcher.dispatch("BwCursorDragEnded");
                    }
                }
                delete this._initialGlobalTouchPoint;
            }
        }
    }

    private async _onKeyboard(data: Keyboard_KbTypes.EventData): Promise<void> {
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
        if ((newKeys.has(Keyboard_KbTypes.KeyCode.J)) || (newKeys.has(Keyboard_KbTypes.KeyCode.Enter))) {
            data.isHandled = true;
            Notifications_Dispatcher.dispatch("BwCursorTapped", {
                current  : cursorGridIndex,
                tappedOn : cursorGridIndex,
            });

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.K)) {
            data.isHandled = true;
            actionPlanner.cancelCurrentState();

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Escape)) {
            data.isHandled = true;
            if (war instanceof MapEditor_Model_MeWar.MeWar) {
                war.getDrawer().setModePreview();
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            } else {
                actionPlanner.cancelCurrentState();
            }

        } else if ((newKeys.has(Keyboard_KbTypes.KeyCode.S)) && (allKeys.has(Keyboard_KbTypes.KeyCode.Control))) {
            if (war instanceof MapEditor_Model_MeWar.MeWar) {
                data.isHandled = true;

                const currentTime   = Date.now();
                const deltaTime     = currentTime - this._lastSaveMapTime;
                if (deltaTime < 500) {
                    return;
                } else if (deltaTime < 10000) {
                    FloatText.showLang(Lang_Constants.TextType.A0421);
                    return;
                }
                this._lastSaveMapTime = currentTime;

                if ((war == null) || (war.getIsReviewingMap())) {
                    FloatText.showLang(Lang_Constants.TextType.A0273);
                    return;
                }
                // if (!war.getIsMapModified()) {
                //     FloatText.showLangText(LangTextType.A0085);
                //     return;
                // }

                const slotIndex = war.getMapSlotIndex();
                if (slotIndex === await MapEditor_Model_MeModel.getReviewingMapSlotIndex()) {
                    FloatText.showLang(Lang_Constants.TextType.A0422);
                    return;
                }

                const mapRawData = await war.serializeForMap();
                MapEditor_Model_MeHelpers.getCriticalErrorCodeForMapRawData(mapRawData).then(errorCode => {
                    if (errorCode) {
                        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0304));
                    } else {
                        MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                            slotIndex                 : slotIndex,
                            mapRawData                : mapRawData,
                            needReview                : false,
                            srcNormalMapIdForAddEvent : war.getSrcNormalMapIdForAddEvent(),
                            gridMarkData              : war.getGridMarkData(),
                        });
                    }
                });
            }

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.I)) {
            data.isHandled = true;

            if (((war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) && (war.getPlayerInTurn().getUserId() != null))                    ||
                ((war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) && (war.getPlayerIndexLoggedIn() === war.getPlayerIndexInTurn()))
            ) {
                ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);

                const gridIndex = war.getIdleBuildingGridIndex();
                if (!gridIndex) {
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
                } else {
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                    war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
                }
            } else {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
            }

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.U)) {
            data.isHandled = true;

            if (((war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) && (war.getPlayerInTurn().getUserId() != null))                    ||
                ((war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) && (war.getPlayerIndexLoggedIn() === war.getPlayerIndexInTurn()))
            ) {
                ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);

                const gridIndex = war.getIdleUnitGridIndex();
                if (!gridIndex) {
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
                } else {
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                    war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
                }
            } else {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
            }

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Y)) {
            data.isHandled = true;

            if (((war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) && (war.getPlayerInTurn().getUserId() != null))                    ||
                ((war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) && (war.getPlayerIndexLoggedIn() === war.getPlayerIndexInTurn()))
            ) {
                if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(war.getPlayerIndexInTurn())) {
                    FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0034));
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0036),
                        getContent : () => war.getHintForEndTurn(),
                        callback   : () => ActionPlanners_States_RequestingPlayerEndTurn.RequestingPlayerEndTurn.getInstance().doApplyOnChooseAction(war.getActionPlanner()),
                    });
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorConfirm01);
                }
            } else {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonForbidden01);
            }

        } else if ((allKeys.has(Keyboard_KbTypes.KeyCode.Q)) || (allKeys.has(Keyboard_KbTypes.KeyCode.E))) {
            data.isHandled = true;

            const zoomOut   = allKeys.has(Keyboard_KbTypes.KeyCode.Q);
            const zoomIn    = allKeys.has(Keyboard_KbTypes.KeyCode.E);
            if (((zoomOut) && (!zoomIn))    ||
                ((!zoomOut) && (zoomIn))
            ) {
                const point = this._conForNormal.localToGlobal(getGridWidth() / 2, getGridHeight() / 2);
                war.getView().zoomField(point.x, point.y, zoomIn);
            }

        } else if (Keyboard_KbManager.checkHasDirectionKeys(allKeys)) {
            data.isHandled = true;

            const time                  = new Date().getTime();
            const hasNewDirectionKey    = Keyboard_KbManager.checkHasDirectionKeys(newKeys);
            if ((hasNewDirectionKey)                                                                            ||
                ((time - this._lastNewDirectionKeyTime > 300) && (time - this._lastAllDirectionKeyTime > 80))
            ) {
                this._lastAllDirectionKeyTime = time;
                if (hasNewDirectionKey) {
                    this._lastNewDirectionKeyTime = time;
                }

                const mapSize       = war.getTileMap().getMapSize();
                const keys          = hasNewDirectionKey ? newKeys : allKeys;
                const newGridIndex  = new AuxiliaryTypes_GridIndex.GridIndex(
                    Numbers_Utils.getValueInRange({
                        minValue : 0,
                        maxValue : mapSize.getWidth() - 1,
                        rawValue : cursorGridIndex.getX() + (keys.has(Keyboard_KbTypes.KeyCode.A) ? -1 : 0) + (keys.has(Keyboard_KbTypes.KeyCode.D) ? 1 : 0),
                    }),
                    Numbers_Utils.getValueInRange({
                        minValue : 0,
                        maxValue : mapSize.getHeight() - 1,
                        rawValue : cursorGridIndex.getY() + (keys.has(Keyboard_KbTypes.KeyCode.W) ? -1 : 0) + (keys.has(Keyboard_KbTypes.KeyCode.S) ? 1 : 0),
                    }),
                );

                if (!newGridIndex.checkIsEqual(cursorGridIndex)) {
                    Notifications_Dispatcher.dispatch("BwCursorDragged", {
                        current   : cursorGridIndex,
                        draggedTo : newGridIndex,
                    });
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

        if (state === ActionPlanners_Constants.StateId.Idle) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.ExecutingAction) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(!actionPlanner.getFocusUnit()?.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(!actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(!actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(!actionPlanner.getUnitRepairCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
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

        if (state === ActionPlanners_Constants.StateId.Idle) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ExecutingAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            con.setIsVisible(!!actionPlanner.getFocusUnit()?.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()), gridIndex));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            con.setIsVisible(actionPlanner.checkHasAttackableGridForUnitWeapon(gridIndex));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
            con.setIsVisible(actionPlanner.getUnitCrushCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(actionPlanner.getUnitRepairCandidateGridIndexArray().some(v => v.checkIsEqual(gridIndex)));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(true);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
            con.setIsVisible(false);

        } else {
            // todo
        }
    }
    private _updateConForTargetArea(): void {
        const actionPlanner = this._getCursor().getWar().getActionPlanner();
        const con           = this._conForTargetArea;
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
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            con.setIsVisible(true);
            this._resetImagesForTargetArea();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            con.setIsVisible(true);
            this._resetImagesForTargetArea();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            con.setIsVisible(true);
            this._resetImagesForTargetArea();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            con.setIsVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
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
        for (const g of gridIndex.getGridsWithinDistance({ minDistance : radius, maxDistance : radius, mapSize : cursor.getMapSize() })) {
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
    private _getOrCreateImageForConTargetArea(index: number): Ui_Interfaces_IUiImage.IUiImage {
        const con = this._conForTargetArea;
        while (index >= con.getUiChildren().length) {
            const img = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedColorWhite0000` });
            img.setIsSmoothing(false);
            con.addUiChild(img);
        }

        return con.getUiChildAt(index) as Ui_Interfaces_IUiImage.IUiImage;
    }

    private _startNormalAnimation(): void {
        this._stopNormalAnimation();

        Tween_Executor.Executor.get(this._imgUpperLeftCorner, { loop : true })
            .set({ customX : getUpperLeftCornerOuterX(), customY : getUpperLeftCornerOuterY() })
            .to({ customX : getUpperLeftCornerInnerX(), customY : getUpperLeftCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX : getUpperLeftCornerOuterX(), customY : getUpperLeftCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);

        Tween_Executor.Executor.get(this._imgUpperRightCorner, { loop : true })
            .set({ customX : getUpperRightCornerOuterX(), customY : getUpperRightCornerOuterY() })
            .to({ customX : getUpperRightCornerInnerX(), customY : getUpperRightCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX : getUpperRightCornerOuterX(), customY : getUpperRightCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);

        Tween_Executor.Executor.get(this._imgLowerLeftCorner, { loop : true })
            .set({ customX : getLowerLeftCornerOuterX(), customY : getLowerLeftCornerOuterY() })
            .to({ customX : getLowerLeftCornerInnerX(), customY : getLowerLeftCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX : getLowerLeftCornerOuterX(), customY : getLowerLeftCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);

        Tween_Executor.Executor.get(this._imgLowerRightCorner, { loop : true })
            .set({ customX : getLowerRightCornerOuterX(), customY : getLowerRightCornerOuterY() })
            .to({ customX : getLowerRightCornerInnerX(), customY : getLowerRightCornerInnerY() }, _PULSE_IN_DURATION)
            .to({ customX : getLowerRightCornerOuterX(), customY : getLowerRightCornerOuterY() }, _PULSE_OUT_DURATION)
            .wait(_PULSE_INTERVAL_DURATION);
    }
    private _stopNormalAnimation(): void {
        Tween_Executor.Executor.removeTweens(this._imgUpperLeftCorner);
        Tween_Executor.Executor.removeTweens(this._imgUpperRightCorner);
        Tween_Executor.Executor.removeTweens(this._imgLowerLeftCorner);
        Tween_Executor.Executor.removeTweens(this._imgLowerRightCorner);
    }

    private _startTargetAnimation(): void {
        this._stopTargetAnimation();

        const totalFramesCount = getImageSourcesForCursorAiming().length;
        Tween_Executor.Executor.get(this._imgTarget, { loop : true })
            .wait(_TARGET_FRAME_DURATION)
            .call(() => {
                ++this._frameIndexForImgTarget;
                (this._frameIndexForImgTarget >= totalFramesCount) && (this._frameIndexForImgTarget = 0);
                this._imgTarget.loadSource(getImageSourcesForCursorAiming()[this._frameIndexForImgTarget]);
            });
    }
    private _stopTargetAnimation(): void {
        this._frameIndexForImgTarget = 0;
        Tween_Executor.Executor.removeTweens(this._imgTarget);
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
    private _getGridIndexByLocalXY(localX: number, localY: number): AuxiliaryTypes_GridIndex.GridIndex {
        return new AuxiliaryTypes_GridIndex.GridIndex(this._getGridXByLocalX(localX), this._getGridYByLocalY(localY));
    }
    private _getGridIndexByGlobalXY(globalX: number, globalY: number): AuxiliaryTypes_GridIndex.GridIndex {
        const point = this.globalToLocal(globalX, globalY);
        return this._getGridIndexByLocalXY(point.x, point.y);
    }
}
