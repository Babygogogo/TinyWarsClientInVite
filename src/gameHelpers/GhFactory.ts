import type { IActionPlanner } from "../actionPlanners/IActionPlanner.ts";
import type { IActionPlannerView } from "../actionPlanners/IActionPlannerView.ts";
import type { IWar } from "../autoTourneys/wars/IWar.ts";
import type { IBwCommonSettingManager } from "../baseWar/interface/IBwCommonSettingManager.ts";
import type { IBwCursor } from "../baseWar/interface/IBwCursor.ts";
import type { IBwCursorView } from "../baseWar/interface/IBwCursorView.ts";
import type { IBwDrawVoteManager } from "../baseWar/interface/IBwDrawVoteManager.ts";
import type { IBwExecutedOperationManager } from "../baseWar/interface/IBwExecutedOperationManager.ts";
import type { IBwGridVisualEffect } from "../baseWar/interface/IBwGridVisualEffect.ts";
import type { IBwGridVisualEffectView } from "../baseWar/interface/IBwGridVisualEffectView.ts";
import type { IBwRandomNumberManager } from "../baseWar/interface/IBwRandomNumberManager.ts";
import type { IBwWarEventManager } from "../baseWar/interface/IBwWarEventManager.ts";
import type { IBwWarStatisticsManager } from "../baseWar/interface/IBwWarStatisticsManager.ts";
import type { IBwWarView } from "../baseWar/interface/IBwWarView.ts";
import type { IWar as CampaignsWarsIWar } from "../campaigns/wars/IWar.ts";
import type { IField } from "../fields/IField.ts";
import type { IFieldView } from "../fields/IFieldView.ts";
import type { IFogMap } from "../fogMaps/IFogMap.ts";
import type { IHrwWar } from "../halfwayReplayWar/interface/IHrwWar.ts";
import type { IMeDrawer } from "../mapEditor/interface/IMeDrawer.ts";
import type { IMeWar } from "../mapEditor/interface/IMeWar.ts";
import type { IMfwWar } from "../multiFreeWar/interface/IMfwWar.ts";
import type { IMmwWar } from "../multiMatchWar/interface/IMmwWar.ts";
import type { IMpwWar } from "../multiPlayerWar/interface/IMpwWar.ts";
import type { IMrwWar } from "../multiRankWar/interface/IMrwWar.ts";
import type { IPlayer } from "../players/IPlayer.ts";
import type { IPlayerManager } from "../players/IPlayerManager.ts";
import type { IRwWar } from "../replayWar/interface/IRwWar.ts";
import type { IRwWarBase } from "../replayWar/interface/IRwWarBase.ts";
import type { ISfwWar } from "../singleFreeWar/interface/ISfwWar.ts";
import type { ISpwRetractManager } from "../singlePlayerWar/interface/ISpwRetractManager.ts";
import type { ISpwWar } from "../singlePlayerWar/interface/ISpwWar.ts";
import type { ISrwWar } from "../singleRankWar/interface/ISrwWar.ts";
import type { ITaskObjectiveManager } from "../taskObjectives/ITaskObjectiveManager.ts";
import type { ITwWar } from "../testWar/interface/ITwWar.ts";
import type { ITile } from "../tiles/ITile.ts";
import type { ITileMap } from "../tiles/ITileMap.ts";
import type { ITileMapView } from "../tiles/ITileMapView.ts";
import type { ITileView } from "../tiles/ITileView.ts";
import type { ITurnManager } from "../turns/ITurnManager.ts";
import type { IUnit } from "../units/IUnit.ts";
import type { IUnitMap } from "../units/IUnitMap.ts";
import type { IUnitMapView } from "../units/IUnitMapView.ts";
import type { IUnitView } from "../units/IUnitView.ts";
import type { IManager } from "../weathers/IManager.ts";
import type { IView } from "../weathers/IView.ts";

type IBwWeatherManager              = IManager;
type IBwWeatherManagerView          = IView;
type IAtwWar                        = IWar;
type ICawWar                        = CampaignsWarsIWar;
let _actionPlanner              : new () => IActionPlanner;
let _actionPlannerView          : new () => IActionPlannerView;

let _bwCommonSettingManager     : new () => IBwCommonSettingManager;
let _bwCursor                   : new () => IBwCursor;
let _bwCursorView               : new () => IBwCursorView;
let _bwDrawVoteManager          : new () => IBwDrawVoteManager;
let _bwExecutedOperationManager : new () => IBwExecutedOperationManager;
let _bwGridVisualEffect         : new () => IBwGridVisualEffect;
let _bwGridVisualEffectView     : new () => IBwGridVisualEffectView;
let _bwRandomNumberManager      : new () => IBwRandomNumberManager;
let _bwWarEventManager          : new () => IBwWarEventManager;
let _bwWarStatisticsManager     : new () => IBwWarStatisticsManager;
let _bwWarView                  : new () => IBwWarView;
let _bwWeatherManager           : new () => IBwWeatherManager;
let _bwWeatherManagerView       : new () => IBwWeatherManagerView;

let _atwWar                     : new () => IAtwWar;

let _cawWar                     : new () => ICawWar;

let _ccwWar                     : new () => IMpwWar;

let _field                      : new () => IField;
let _fieldView                  : new () => IFieldView;

let _fogMap                     : new () => IFogMap;

let _hrwWar                     : new () => IHrwWar;

let _mcwWar                     : new () => IMpwWar;

let _meDrawer                   : new () => IMeDrawer;
let _meWar                      : new () => IMeWar;

let _mfwWar                     : new () => IMfwWar;

let _mmwWar                     : new () => IMmwWar;

let _mpwWar                     : new () => IMpwWar;

let _mrwWar                     : new () => IMrwWar;

let _player                     : new () => IPlayer;
let _playerManager              : new () => IPlayerManager;

let _rwWar                      : new () => IRwWar;
let _rwWarBase                  : new () => IRwWarBase;

let _scwWar                     : new () => ISpwWar;

let _sfwWar                     : new () => ISfwWar;

let _spwRetractManager          : new () => ISpwRetractManager;
let _spwWar                     : new () => ISpwWar;

let _srwWar                     : new () => ISrwWar;

let _taskObjectiveManager       : new () => ITaskObjectiveManager;

let _tile                       : new () => ITile;
let _tileMap                    : new () => ITileMap;
let _tileMapView                : new () => ITileMapView;
let _tileView                   : new () => ITileView;

let _turnManager                : new () => ITurnManager;

let _twWar                      : new () => ITwWar;

let _unit                       : new () => IUnit;
let _unitMap                    : new () => IUnitMap;
let _unitMapView                : new () => IUnitMapView;
let _unitView                   : new () => IUnitView;

export function init({
    actionPlanner,
    actionPlannerView,

    bwCommonSettingManager,
    bwCursor,
    bwCursorView,
    bwDrawVoteManager,
    bwExecutedOperationManager,
    bwGridVisualEffect,
    bwGridVisualEffectView,
    bwRandomNumberManager,
    bwWarEventManager,
    bwWarStatisticsManager,
    bwWarView,
    bwWeatherManager,
    bwWeatherManagerView,

    atwWar,

    cawWar,

    ccwWar,

    field,
    fieldView,

    fogMap,

    hrwWar,

    mcwWar,

    meDrawer,
    meWar,

    mfwWar,

    mmwWar,

    mpwWar,

    mrwWar,

    player,
    playerManager,

    rwWar,
    rwWarBase,

    scwWar,

    sfwWar,

    spwRetractManager,
    spwWar,

    srwWar,

    taskObjectiveManager,

    tile,
    tileMap,
    tileMapView,
    tileView,

    turnManager,

    twWar,

    unit,
    unitMap,
    unitMapView,
    unitView,
}: {
    actionPlanner               : new () => IActionPlanner;
    actionPlannerView           : new () => IActionPlannerView;

    bwCommonSettingManager      : new () => IBwCommonSettingManager;
    bwCursor                    : new () => IBwCursor;
    bwCursorView                : new () => IBwCursorView;
    bwDrawVoteManager           : new () => IBwDrawVoteManager;
    bwExecutedOperationManager  : new () => IBwExecutedOperationManager;
    bwGridVisualEffect          : new () => IBwGridVisualEffect;
    bwGridVisualEffectView      : new () => IBwGridVisualEffectView;
    bwRandomNumberManager       : new () => IBwRandomNumberManager;
    bwWarEventManager           : new () => IBwWarEventManager;
    bwWarStatisticsManager      : new () => IBwWarStatisticsManager;
    bwWarView                   : new () => IBwWarView;
    bwWeatherManager            : new () => IBwWeatherManager;
    bwWeatherManagerView        : new () => IBwWeatherManagerView;

    atwWar                      : new () => IAtwWar;

    cawWar                      : new () => ICawWar;

    ccwWar                      : new () => IMpwWar;

    field                       : new () => IField;
    fieldView                   : new () => IFieldView;

    fogMap                      : new () => IFogMap;

    hrwWar                      : new () => IHrwWar;

    mcwWar                      : new () => IMpwWar;

    meDrawer                    : new () => IMeDrawer;
    meWar                       : new () => IMeWar;

    mfwWar                      : new () => IMfwWar;

    mmwWar                      : new () => IMmwWar;

    mpwWar                      : new () => IMpwWar;

    mrwWar                      : new () => IMrwWar;

    player                      : new () => IPlayer;
    playerManager               : new () => IPlayerManager;

    rwWar                       : new () => IRwWar;
    rwWarBase                   : new () => IRwWarBase;

    scwWar                      : new () => ISpwWar;

    sfwWar                      : new () => ISfwWar;

    spwRetractManager           : new () => ISpwRetractManager;
    spwWar                      : new () => ISpwWar;

    srwWar                      : new () => ISrwWar;

    taskObjectiveManager        : new () => ITaskObjectiveManager;

    tile                        : new () => ITile;
    tileMap                     : new () => ITileMap;
    tileMapView                 : new () => ITileMapView;
    tileView                    : new () => ITileView;

    turnManager                 : new () => ITurnManager;

    twWar                       : new () => ITwWar;

    unit                        : new () => IUnit;
    unitMap                     : new () => IUnitMap;
    unitMapView                 : new () => IUnitMapView;
    unitView                    : new () => IUnitView;
}): void {
    _actionPlanner              = actionPlanner;
    _actionPlannerView          = actionPlannerView;

    _bwCommonSettingManager     = bwCommonSettingManager;
    _bwCursor                   = bwCursor;
    _bwCursorView               = bwCursorView;
    _bwDrawVoteManager          = bwDrawVoteManager;
    _bwExecutedOperationManager = bwExecutedOperationManager;
    _bwGridVisualEffect         = bwGridVisualEffect;
    _bwGridVisualEffectView     = bwGridVisualEffectView;
    _bwRandomNumberManager      = bwRandomNumberManager;
    _taskObjectiveManager     = taskObjectiveManager;
    _turnManager              = turnManager;
    _bwWarEventManager          = bwWarEventManager;
    _bwWarStatisticsManager     = bwWarStatisticsManager;
    _bwWarView                  = bwWarView;
    _bwWeatherManager           = bwWeatherManager;
    _bwWeatherManagerView       = bwWeatherManagerView;

    _atwWar                     = atwWar;

    _cawWar                     = cawWar;

    _ccwWar                     = ccwWar;

    _field                      = field;
    _fieldView                  = fieldView;

    _fogMap                     = fogMap;

    _hrwWar                     = hrwWar;

    _mcwWar                     = mcwWar;

    _mfwWar                     = mfwWar;

    _meDrawer                   = meDrawer;
    _meWar                      = meWar;

    _mmwWar                     = mmwWar;

    _mpwWar                     = mpwWar;

    _mrwWar                     = mrwWar;

    _player                     = player;
    _playerManager              = playerManager;

    _rwWar                      = rwWar;
    _rwWarBase                  = rwWarBase;

    _scwWar                     = scwWar;

    _sfwWar                     = sfwWar;

    _spwRetractManager          = spwRetractManager;
    _spwWar                     = spwWar;

    _srwWar                     = srwWar;

    _tile                       = tile;
    _tileMap                    = tileMap;
    _tileMapView                = tileMapView;
    _tileView                   = tileView;

    _twWar                      = twWar;

    _unit                       = unit;
    _unitMap                    = unitMap;
    _unitMapView                = unitMapView;
    _unitView                   = unitView;
}

export function getActionPlannerClass(): new () => IActionPlanner {
    return _actionPlanner;
}
export function getActionPlannerViewClass(): new () => IActionPlannerView {
    return _actionPlannerView;
}

export function getBwCommonSettingManagerClass(): new () => IBwCommonSettingManager {
    return _bwCommonSettingManager;
}
export function getBwCursorClass(): new () => IBwCursor {
    return _bwCursor;
}
export function getBwCursorViewClass(): new () => IBwCursorView {
    return _bwCursorView;
}
export function getBwDrawVoteManagerClass(): new () => IBwDrawVoteManager {
    return _bwDrawVoteManager;
}
export function getBwExecutedOperationManagerClass(): new () => IBwExecutedOperationManager {
    return _bwExecutedOperationManager;
}
export function getBwGridVisualEffectClass(): new () => IBwGridVisualEffect {
    return _bwGridVisualEffect;
}
export function getBwGridVisualEffectViewClass(): new () => IBwGridVisualEffectView {
    return _bwGridVisualEffectView;
}
export function getBwRandomNumberManagerClass(): new () => IBwRandomNumberManager {
    return _bwRandomNumberManager;
}
export function getBwWarEventManagerClass(): new () => IBwWarEventManager {
    return _bwWarEventManager;
}
export function getBwWarStatisticsManagerClass(): new () => IBwWarStatisticsManager {
    return _bwWarStatisticsManager;
}
export function getBwWarViewClass(): new () => IBwWarView {
    return _bwWarView;
}
export function getBwWeatherManagerClass(): new () => IBwWeatherManager {
    return _bwWeatherManager;
}
export function getBwWeatherManagerViewClass(): new () => IBwWeatherManagerView {
    return _bwWeatherManagerView;
}

export function getAtwWarClass(): new () => IAtwWar {
    return _atwWar;
}

export function getCawWarClass(): new () => ICawWar {
    return _cawWar;
}

export function getCcwWarClass(): new () => IMpwWar {
    return _ccwWar;
}

export function getFieldClass(): new () => IField {
    return _field;
}
export function getFieldViewClass(): new () => IFieldView {
    return _fieldView;
}

export function getFogMapClass(): new () => IFogMap {
    return _fogMap;
}

export function getHrwWarClass(): new () => IHrwWar {
    return _hrwWar;
}

export function getMcwWarClass(): new () => IMpwWar {
    return _mcwWar;
}

export function getMeDrawerClass(): new () => IMeDrawer {
    return _meDrawer;
}
export function getMeWarClass(): new () => IMeWar {
    return _meWar;
}

export function getMfwWarClass(): new () => IMfwWar {
    return _mfwWar;
}

export function getMmwWarClass(): new () => IMmwWar {
    return _mmwWar;
}

export function getMpwWarClass(): new () => IMpwWar {
    return _mpwWar;
}

export function getMrwWarClass(): new () => IMrwWar {
    return _mrwWar;
}

export function getPlayerClass(): new () => IPlayer {
    return _player;
}
export function getPlayerManagerClass(): new () => IPlayerManager {
    return _playerManager;
}

export function getRwWarClass(): new () => IRwWar {
    return _rwWar;
}
export function getRwWarBaseClass(): new () => IRwWarBase {
    return _rwWarBase;
}

export function getScwWarClass(): new () => ISpwWar {
    return _scwWar;
}

export function getSfwWarClass(): new () => ISfwWar {
    return _sfwWar;
}

export function getSpwRetractManagerClass(): new () => ISpwRetractManager {
    return _spwRetractManager;
}
export function getSpwWarClass(): new () => ISpwWar {
    return _spwWar;
}

export function getSrwWarClass(): new () => ISrwWar {
    return _srwWar;
}

export function getTaskObjectiveManagerClass(): new () => ITaskObjectiveManager {
    return _taskObjectiveManager;
}

export function getTileClass(): new () => ITile {
    return _tile;
}
export function getTileMapClass(): new () => ITileMap {
    return _tileMap;
}
export function getTileMapViewClass(): new () => ITileMapView {
    return _tileMapView;
}
export function getTileViewClass(): new () => ITileView {
    return _tileView;
}

export function getTurnManagerClass(): new () => ITurnManager {
    return _turnManager;
}

export function getTwWarClass(): new () => ITwWar {
    return _twWar;
}

export function getUnitClass(): new () => IUnit {
    return _unit;
}
export function getUnitMapClass(): new () => IUnitMap {
    return _unitMap;
}
export function getUnitMapViewClass(): new () => IUnitMapView {
    return _unitMapView;
}
export function getUnitViewClass(): new () => IUnitView {
    return _unitView;
}
