import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { loadInternalModules } from './helpers/load-modules.mjs'

const compiled = new Map()
let realRuntime
function getRealRuntime() {
  realRuntime ??= loadInternalModules().then(async module => ({
    module,
    internal: await module(fileURLToPath(new URL('../src/internal.ts', import.meta.url))),
  }))
  return realRuntime
}
const helpers = {
  getExisted(value) {
    if (value == null) throw new Error('Missing value')
    return value
  },
  newError: (message, code) => Object.assign(new Error(message), { errorCode: code }),
}
const codes = new Proxy({ NoError: 0 }, { get: (target, key) => target[key] ?? key })

function loadSource(filename, dependencies, proto = {}) {
  if (!compiled.has(filename)) {
    compiled.set(filename, ts.transpileModule(
      readFileSync(new URL(`../src/${filename}`, import.meta.url), 'utf8'),
      { compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.CommonJS } },
    ).outputText)
  }
  const context = {
    exports: {},
    require(specifier) {
      if (/\/internal(?:\.ts)?$/.test(specifier)) return dependencies
      assert.match(specifier, /\/proto\//)
      return proto
    },
  }
  vm.runInNewContext(compiled.get(filename), context)
  return context.exports
}

function providerFixture({ humanTeams = [1], failOuterInit = false } = {}) {
  const instances = []
  class War {
    constructor(view) {
      this.view = view
      instances.push(this)
    }
    setSaveSlotIndex(value) { this.slot = value }
    setSaveSlotExtraData(value) { this.extra = value }
    init(data, config) {
      if (this.view && failOuterInit) throw new Error('Failed to initialize outer war')
      this.data = data
      this.config = config
    }
    startRunning() { this.running = true; return this }
    startRunningView() { assert.equal(this.view, true); return this }
    getHumanPlayers() { return humanTeams.map(team => ({ getTeamIndex: () => team })) }
    getPlayerManager() { return { getWatcherTeamIndexesForSelf: () => new Set(this.getHumanPlayers().map(player => player.getTeamIndex())) } }
    serializeForTeamIndexes(teams) {
      assert.deepEqual([...teams], [1])
      return { masked: true, getSettingsForSrw: () => this.data.kind === 'ranked', getSettingsForCaw: () => this.data.kind === 'campaign' }
    }
    dispose() { this.running = false; this.disposed = true }
  }
  const provider = loadSource('singlePlayerWars/ProviderForDualWars.ts', {
    Helpers_Misc: helpers,
    Utils_ClientErrorCode: { ClientErrorCode: codes },
    GameConfigs_Provider: { getGameConfig: async () => ({ version: 'test' }) },
    SingleRankedWars_War: { War },
    Campaigns_Wars_War: { War },
  })
  const data = kind => ({
    kind,
    clone() { return data(this.kind) },
    getSettingsForCommon: () => ({ getConfigVersion: () => 'test' }),
    getSettingsForSrw() { return this.kind === 'ranked' },
    getSettingsForCaw() { return this.kind === 'campaign' },
  })
  return { provider, instances, data }
}

test('both game types load a viewless authoritative war and a separate team-filtered war', async () => {
  const { provider, instances, data } = providerFixture({ humanTeams: [1, 1] })
  for (const kind of ['ranked', 'campaign']) {
    const source = data(kind)
    const outer = await provider.loadWar({ warData: source, slotIndex: 3, slotExtraData: null })
    const inner = provider.getInnerWar()
    assert.equal(provider.getOuterWar(), outer)
    assert.equal(provider.getInnerWarForOuterWar(outer), inner)
    assert.equal(provider.getInnerWarForOuterWar(inner), undefined)
    assert.notEqual(inner.data, source)
    assert.equal(inner.data.kind, kind)
    assert.equal(inner.view, false)
    assert.equal(outer.view, true)
    assert.equal(outer.data.masked, true)
    assert.equal(outer.data.kind, undefined)
    assert.equal(outer.slot, 3)
  }
  assert.equal(instances[0].disposed, true)
  assert.equal(instances[1].disposed, true)
  provider.unloadWar()
  assert.ok(instances.every(war => war.disposed))
  assert.equal(provider.getInnerWar(), undefined)
  assert.equal(provider.getOuterWar(), undefined)
})

test('failed loading disposes both partial wars and rejects unsupported human-team layouts', async () => {
  for (const options of [{ failOuterInit: true }, { humanTeams: [] }, { humanTeams: [1, 2] }]) {
    const { provider, instances, data } = providerFixture(options)
    await assert.rejects(provider.loadWar({ warData: data('campaign'), slotIndex: null, slotExtraData: null }))
    assert.ok(instances.every(war => war.disposed))
    assert.equal(provider.getOuterWar(), undefined)
    assert.equal(provider.getInnerWar(), undefined)
  }
})

function operation(kind, payload = {}, id = 0) {
  return new Proxy({ getOperationId: () => id }, {
    get: (target, name) => target[name] ?? (name.startsWith('getWo') ? () => name === `getWo${kind}` ? payload : undefined : undefined),
  })
}

function executorFixture() {
  const events = []
  const raw = operation('UnitWait')
  const masked = operation('UnitWait', { visible: true })
  const otherTeam = operation('UnitWait', { secret: true })
  const path = { nodes: ['original', 'revised'] }
  const makeWar = name => {
    let running = true
    let busy = false
    let count = 0
    const history = []
    const statistics = []
    return {
      name, history, statistics,
      getIsRunning: () => running,
      stop: () => { running = false },
      getIsEnded: () => false,
      getIsExecutingAction: () => busy,
      setIsExecutingAction: value => { busy = value },
      getPlayerManager: () => ({ getWatcherTeamIndexesForSelf: () => new Set([1]) }),
      getIsAiPaused: () => true,
      getTurnManager: () => ({ getTurnIndex: () => 4, getPlayerIndexInTurn: () => 2 }),
      getActionPlanner: () => ({ name }),
      getFogMap: () => ({ checkHasFogCurrently: () => true }),
      getExecutedOperationManager: () => ({
        getExecutedOperationsCount: () => count,
        tickExecutedOperationsCount: () => count++,
        addExecutedOperation: value => history.push(value),
      }),
      getWarStatisticsManager: () => ({ tickPlayerManualOperationsCount: (...args) => statistics.push(args) }),
      getTaskObjectiveManager: () => ({ autoUpdateAllCurrentProgresses: () => ({ objective: 'updated' }) }),
    }
  }
  const inner = makeWar('inner')
  const outer = makeWar('outer')
  const dependencies = {
    Helpers_Misc: helpers,
    Utils_ClientErrorCode: { ClientErrorCode: codes },
    ActionPlanners_States_ExecutingAction: { ExecutingAction: { getInstance: () => ({ apply: () => events.push('busy') }) } },
    ActionPlanners_States_Idle: { Idle: { getInstance: () => ({ apply: () => events.push('idle') }) } },
    Notifications_Dispatcher: { dispatch: value => events.push(value) },
    WarOperations_Executors_Utils_UnitWait: {
      executeAsInnerWar(war, action, revisedPath) {
        assert.equal(war, inner)
        assert.equal(action, raw.getWoUnitWait())
        assert.equal(revisedPath, path)
        assert.equal(inner.getIsExecutingAction(), true)
        events.push('calculate')
        return (changes, id) => {
          assert.equal(changes.objective, 'updated')
          assert.equal(id, 0)
          return new Map([[1, masked], [2, otherTeam]])
        }
      },
      async executeAsOuterWar(war, action) {
        assert.equal(war, outer)
        assert.equal(action, masked.getWoUnitWait())
        assert.equal(war.getIsExecutingAction(), true)
        events.push('present')
      },
    },
  }
  const executor = loadSource('warOperations/executors/Executor.ts', dependencies)
  const result = { errorCode: 0, operation: raw, movePath: path }
  return { executor, inner, outer, result, raw, masked, events, dependencies }
}

function autoExecutorFixture(state) {
  return loadSource('warOperations/AutoWarOpManager.ts', {
    Helpers_Misc: helpers,
    Utils_ClientErrorCode: { ClientErrorCode: codes },
    SinglePlayerWars_ProviderForDualWars: { getInnerWarForOuterWar: war => war === state.outer ? state.inner : undefined },
    WarOperations_Revisers_Reviser: { revise: (war, action) => {
      assert.equal(war, state.inner)
      return { ...state.result, operation: action }
    } },
    WarOperations_Executors_Executor: state.executor,
    Users_Model: { getSelfUserId: () => 123 },
  }, { WoContainer: { fromJson: () => {
    const action = operation('SystemCallWarEvent')
    action.createIfNotExistsWoSystemCallWarEvent = () => ({ setWarEventId() {}, setNodeAndActionsIndex() {} })
    return action
  } } })
}

test('dual execution retains the revised path and sends only the selected team result to the outer executor', async () => {
  const { executor, inner, outer, result, raw, masked, events } = executorFixture()
  const execution = executor.checkAndExecuteAsInnerWar(inner, result)
  assert.equal(inner.getIsExecutingAction(), true)
  await assert.rejects(executor.checkAndExecuteAsInnerWar(inner, result))
  const outerOperation = await execution
  assert.equal(outerOperation, masked)
  await executor.checkAndExecuteAsOuterWar(outer, outerOperation, false)
  assert.deepEqual(inner.history, [raw])
  assert.deepEqual(outer.history, [masked])
  assert.deepEqual(inner.statistics, [[4, 2]])
  assert.deepEqual(outer.statistics, [[4, 2]])
  assert.deepEqual(events, ['calculate', 'busy', 'present', 'idle', 'WarOperationNormalExecuted'])
  assert.equal(inner.getIsExecutingAction(), false)
  assert.equal(outer.getIsExecutingAction(), false)
})

test('invalid operations release execution locks without updating the outer war', async () => {
  const { executor, inner, outer, result, events } = executorFixture()
  result.errorCode = 123
  await assert.rejects(executor.checkAndExecuteAsInnerWar(inner, result), /123/)
  assert.equal(inner.getIsExecutingAction(), false)
  assert.equal(outer.getIsExecutingAction(), false)
  assert.deepEqual(inner.history, [])
  assert.deepEqual(outer.history, [])
  assert.deepEqual(events, [])
})

test('inner execution releases its lock when calculation, objectives or filtering fail', async () => {
  for (const stage of ['calculation', 'objectives', 'filtering']) {
    const state = executorFixture()
    const failure = new Error(`Failed during ${stage}`)
    if (stage === 'calculation') {
      state.dependencies.WarOperations_Executors_Utils_UnitWait.executeAsInnerWar = () => { throw failure }
    } else if (stage === 'objectives') {
      state.inner.getTaskObjectiveManager = () => ({ autoUpdateAllCurrentProgresses() { throw failure } })
    } else {
      state.dependencies.WarOperations_Executors_Utils_UnitWait.executeAsInnerWar = () => () => { throw failure }
    }
    await assert.rejects(state.executor.checkAndExecuteAsInnerWar(state.inner, state.result), error => error === failure)
    assert.equal(state.inner.getIsExecutingAction(), false)
    assert.deepEqual(state.outer.history, [])
  }
})

test('automatic operations do not advance the inner war during an outer animation', async () => {
  const state = executorFixture()
  Object.assign(state.inner, {
    getTurnPhaseCode: () => 1,
    getDrawVoteManager: () => ({}),
    checkIsExceedTurnsOrWarOperationsLimit: () => false,
    getWarEventManager: () => ({ getCallableWarEventIdAndDataIndex: () => ({ warEventId: 7, dataIndex: 0 }) }),
  })
  state.outer.setIsExecutingAction(true)
  state.outer.getIsAiPaused = () => false
  state.outer.getIsViewingWarInfo = () => false
  state.dependencies.WarOperations_Executors_Utils_SystemCallWarEvent = {
    executeAsInnerWar: () => () => new Map([[1, state.masked]]),
  }
  await autoExecutorFixture(state).generateAndRunAutoOps(state.outer)
  assert.deepEqual(state.inner.history, [])
  assert.deepEqual(state.outer.history, [])
})

test('pending player calculations exclude further player and automatic operations', async () => {
  const state = executorFixture()
  let finish
  state.inner.getTurnPhaseCode = () => { throw new Error('Cannot plan against a pending player operation') }
  state.dependencies.WarOperations_Executors_Utils_SystemCallWarEvent = {
    executeAsInnerWar: () => new Promise(resolve => { finish = () => resolve(() => new Map([[1, state.masked]])) }),
  }
  const auto = autoExecutorFixture(state)
  const action = operation('SystemCallWarEvent')
  const pending = auto.handlePlayerOpAndAutoOps(state.outer, action)
  try {
    await assert.rejects(auto.handlePlayerOpAndAutoOps(state.outer, action), error =>
      error.errorCode === codes.SpwModel_HandlePlayerOrRobotAction_01)
    state.outer.getIsAiPaused = () => false
    state.outer.getIsViewingWarInfo = () => false
    await auto.generateAndRunAutoOps(state.outer)
  } finally {
    state.outer.getIsAiPaused = () => true
    finish()
    await pending
  }
  assert.equal(state.inner.history.length, 1)
  assert.equal(state.outer.history.length, 1)
})

test('a failed player calculation releases the operation runner for the next request', async () => {
  const state = executorFixture()
  const failure = new Error('Calculation failed')
  let fail = true
  state.dependencies.WarOperations_Executors_Utils_SystemCallWarEvent = {
    executeAsInnerWar() {
      if (fail) { fail = false; throw failure }
      return () => new Map([[1, state.masked]])
    },
  }
  const auto = autoExecutorFixture(state)
  const action = operation('SystemCallWarEvent')
  await assert.rejects(auto.handlePlayerOpAndAutoOps(state.outer, action), error => error === failure)
  await auto.handlePlayerOpAndAutoOps(state.outer, action)
  assert.equal(state.inner.history.length, 1)
  assert.equal(state.outer.history.length, 1)
})

test('unloading while authoritative execution is pending does not update a disposed outer war', async () => {
  const state = executorFixture()
  let finish
  state.dependencies.WarOperations_Executors_Utils_SystemCallWarEvent = {
    executeAsInnerWar: () => new Promise(resolve => { finish = () => resolve(() => new Map([[1, state.masked]])) }),
  }
  const execution = autoExecutorFixture(state).handlePlayerOpAndAutoOps(state.outer, operation('SystemCallWarEvent'))
  state.outer.stop()
  state.inner.stop()
  finish()
  await execution
  assert.deepEqual(state.outer.history, [])
  assert.equal(state.inner.getIsExecutingAction(), false)
  assert.equal(state.outer.getIsExecutingAction(), false)
  assert.deepEqual(state.events, [])
})

test('automatic operations, bot planning and revision use the inner war, while pause controls stay on the outer war', async () => {
  let phase = 0
  let humanInTurn = false
  let paused = true
  let fail = true
  const events = []
  const player = {
    getPlayerIndex: () => 2,
    getAliveState: () => 1,
    checkIsNeutral: () => false,
    getIsSkipTurn: () => false,
    getUserId: () => humanInTurn ? 123 : null,
  }
  const inner = {
    getIsEnded: () => false,
    getTurnPhaseCode: () => phase,
    checkIsExceedTurnsOrWarOperationsLimit: () => false,
    getExecutedOperationManager: () => ({ getExecutedOperationsCount: () => 0 }),
    getWarEventManager: () => ({ getCallableWarEventIdAndDataIndex: () => null }),
    checkCanEnd: () => false,
    checkIsBoot: () => false,
    getPlayerManager: () => ({
      getPlayerInTurn: () => player,
      getPlayerIndexArray: () => [],
    }),
    getDrawVoteManager: () => ({ checkHasOngoingVote: () => false }),
  }
  const outer = {
    getIsEnded: () => false,
    getIsExecutingAction: () => false,
    getIsRunning: () => true,
    getIsAiPaused: () => paused,
    getIsViewingWarInfo: () => false,
    checkIsHumanInTurn: () => humanInTurn,
    getRetractManager: () => ({ getCanRetract: () => false }),
  }
  const auto = loadSource('warOperations/AutoWarOpManager.ts', {
    Helpers_Misc: helpers,
    SinglePlayerWars_ProviderForDualWars: { getInnerWarForOuterWar: war => war === outer ? inner : undefined },
    WarOperations_Revisers_Reviser: {
      revise(war, action) {
        assert.equal(war, inner)
        events.push('revise')
        return { operation: action, movePath: 'revised-path' }
      },
    },
    WarOperations_Executors_Executor: {
      async checkAndExecuteAsInnerWar(authority, result) {
        assert.equal(authority, inner)
        assert.equal(result.movePath, 'revised-path')
        return result.operation
      },
      async checkAndExecuteAsOuterWar(display) {
        assert.equal(display, outer)
        if (phase === 0) { phase = 1; events.push('begin') }
        else { humanInTurn = true; events.push('bot-result') }
      },
    },
    Bots_Bot: {
      async getNextOperation(war) {
        assert.equal(war, inner)
        if (fail) { fail = false; throw new Error('Bot failed') }
        events.push('bot')
        return operation('PlayerEndTurn')
      },
    },
    Turns_Constants: { PhaseCode: { WaitBeginTurn: 0, Main: 1 } },
    Players_Constants: { AliveStateId: { Dying: 2, Dead: 0 } },
    Users_Utils: { checkIsDummy: () => false },
  }, { WoContainer: { fromJson: () => ({ createIfNotExistsWoSystemBeginTurn() {} }) } })
  await auto.generateAndRunAutoOps(outer)
  assert.deepEqual(events, [])
  paused = false
  await assert.rejects(auto.generateAndRunAutoOps(outer), /Bot failed/)
  await auto.generateAndRunAutoOps(outer)
  assert.deepEqual(events, ['revise', 'begin', 'bot', 'revise', 'bot-result'])
})

test('campaign and ranked save requests persist full inner data and current outer save metadata', () => {
  const sent = []
  const bytes = new Uint8Array([5, 6, 7])
  const inner = { serialize: () => ({ encode: () => bytes }) }
  const outer = {
    serialize() { throw new Error('A masked war cannot be saved') },
    getSaveSlotIndex: () => 9,
    getSaveSlotExtraData: () => ({ toJson: () => ({ skin: 2 }) }),
  }
  const dependencies = {
    SinglePlayerWars_ProviderForDualWars: { getInnerWarForOuterWar: war => { assert.equal(war, outer); return inner } },
    Networks_Manager: { send: value => sent.push(value) },
    Helpers_Gzip: { compress: value => value },
  }
  loadSource('singlePlayerMode/model/SpmProxy.ts', dependencies).reqSpmSaveSrw(outer)
  loadSource('campaigns/mains/Gateway.ts', dependencies).reqCampaignSaveWar(outer)
  for (const request of sent) {
    const data = Object.values(request)[0].c
    assert.equal(data.slotIndex, 9)
    assert.equal(data.slotExtraData.skin, 2)
    assert.equal(data.compressedWarData, bytes)
  }
})

test('victory validation retains the authoritative war even when leaving the game unloads the pair', async () => {
  class Ranked {}
  class Campaign {}
  class Free {}
  for (const kind of ['ranked', 'campaign']) {
    const panels = []
    const validations = []
    const outer = {}
    const inner = Object.assign(new (kind === 'ranked' ? Ranked : Campaign)(), {
      getIsEnded: () => true,
      getDrawVoteManager: () => ({ checkIsDraw: () => false }),
      getPlayerManager: () => ({ getHumanPlayers: () => [{ getAliveState: () => 1 }] }),
      getTurnManager: () => ({ getTurnIndex: () => 3 }),
      getExecutedOperationManager: () => ({ getExecutedOperationsCount: () => 10 }),
      calculateTotalScore: () => 100,
      getSettingsForCaw: () => ({ getCampaignId: () => 1, getCampaignMapId: () => 2 }),
    })
    let activeInner = inner
    const auto = loadSource('warOperations/AutoWarOpManager.ts', {
      SinglePlayerWars_ProviderForDualWars: { getInnerWarForOuterWar: war => war === outer ? activeInner : undefined },
      SingleRankedWars_War: { War: Ranked },
      Campaigns_Wars_War: { War: Campaign },
      SingleFreeWars_War: { War: Free },
      Players_Constants: { AliveStateId: { Dead: 0 } },
      GamePanels_Dict: { getDict: () => ({ CommonAlertPanel: 'alert', CommonConfirmPanel: 'confirm' }) },
      GamePanels_Manager: { openPanel: (name, data) => panels.push({ name, data }) },
      Helpers_GameFlow: {
        gotoLobby: () => { activeInner = undefined },
        gotoCampaignCreateMapsPanel: () => { activeInner = undefined },
      },
      SinglePlayerMode_Model_SpmProxy: { reqSpmValidateSrw: war => validations.push(war) },
      Campaigns_Mains_Gateway: { reqCampaignValidateWar: war => validations.push(war) },
      Users_Model: { getSelfCawHighScoreInfo: () => null },
    })
    outer.getIsExecutingAction = () => false
    outer.getIsRunning = () => true
    await auto.generateAndRunAutoOps(outer)
    assert.equal(panels[0].name, 'alert')
    panels[0].data.callback()
    if (kind === 'ranked') {
      assert.equal(activeInner, undefined)
      assert.equal(panels[1].name, 'confirm')
      panels[1].data.callback()
    }
    assert.deepEqual(validations, [inner])
  }
})

test('multiplayer, replay and editor initial tile views match the initialized fog state', () => {
  class Multiplayer {}
  class HalfwayReplay {}
  class Replay {}
  class Editor {}
  const base = loadSource('baseWar/model/War.ts', {
    HalfwayReplayWar_Model_HrwWar: { HrwWar: HalfwayReplay },
    MapEditor_Model_MeWar: { MeWar: Editor },
    MultiPlayerWar_Model_MpwWar: { MpwWar: Multiplayer },
    ReplayWar_Model_RwWar: { RwWar: Replay },
    Visibilities_Utils: {
      getAllTilesVisibleToTeams: () => new Set(),
      getAllTilesVisibleToTeam: () => new Set(),
    },
  })
  for (const War of [Multiplayer, HalfwayReplay, Replay, Editor]) {
    const tile = {
      fog: War === Editor,
      viewFog: undefined,
      getHasFog() { return this.fog },
      setHasFog(value) { this.fog = value },
      resetTileDataAsHasFog() { this.fog = true },
      flushDataToView() { this.viewFog = this.fog },
    }
    const war = new War()
    war.getView = () => ({ startRunningView() {} })
    war.getField = () => ({ startRunningView() { tile.flushDataToView() } })
    war.getWeatherManager = () => ({ startRunningView() {} })
    war.getPlayerManager = () => ({ getWatcherTeamIndexesForSelf: () => new Set([1]) })
    war.getPlayerInTurn = () => ({ getTeamIndex: () => 1 })
    war.getTileMap = () => ({ getAllTiles: () => [tile] })
    base.War.prototype.startRunningView.call(war)
    assert.equal(tile.fog, War !== Editor)
    assert.equal(tile.viewFog, tile.fog)
  }
})

test('real campaign and ranked outer wars keep human vision on AI turns and remove hidden data, not just views', async () => {
  const { internal } = await getRealRuntime()
  const GridIndex = internal.AuxiliaryTypes_GridIndex.GridIndex
  const size = new internal.AuxiliaryTypes_MapSize.MapSize(5, 1)
  for (const War of [internal.Campaigns_Wars_War.War, internal.SingleRankedWars_War.War]) {
    const war = new War(false)
    const players = war.getPlayerManager()
    players.startRunning(war)
    players.getHumanPlayers = () => [{ getTeamIndex: () => 1 }]
    players.getPlayerInTurn = () => ({ getTeamIndex: () => 2, getUserId: () => null })
    assert.deepEqual([...players.getWatcherTeamIndexesForSelf()], [1])

    const units = new Map()
    for (const [x, team] of [[0, 1], [4, 2]]) {
      units.set(x, {
        getGridIndex: () => new GridIndex(x, 0),
        getTeamIndex: () => team,
        getUnitTypeId: () => 1,
        getIsDiving: () => false,
        checkIsInvisible: () => false,
        dispose() {},
      })
    }
    const tiles = Array.from({ length: 5 }, (_, x) => ({
      fog: false,
      reset: false,
      getGridIndex: () => new GridIndex(x, 0),
      getTeamIndex: () => 0,
      checkCanHideUnitType: () => false,
      checkIsUnitHider: () => false,
      getHasFog() { return this.fog },
      setHasFog(value) { this.fog = value },
      resetTileDataAsHasFog() { this.fog = true; this.reset = true },
      updateOnUnitLeave() {},
    }))
    const unitMap = {
      getAllUnitsOnMap: () => [...units.values()],
      getMapSize: () => size,
      getUnitOnMap: grid => units.get(grid.getX()),
      deleteUnitOnMap(grid) { const unit = units.get(grid.getX()); units.delete(grid.getX()); return unit },
      getUnitsLoadedByLoader: () => [],
    }
    const dark = Array.from({ length: 5 }, () => [0])
    war.getUnitMap = () => unitMap
    war.getTileMap = () => ({
      getAllTiles: () => tiles,
      getTile: grid => tiles[grid.getX()],
      getView: () => undefined,
    })
    war.getFogMap = () => ({
      checkHasFogCurrently: () => true,
      getVisibilityMapFromPathsForTeams: () => dark,
      getVisibilityMapFromTilesForTeams: () => dark,
      getVisibilityMapFromUnitsForTeams: () => dark,
    })
    war.updateTilesAndUnitsOnVisibilityChanged(true)
    assert.equal(units.has(4), true)
    assert.equal(tiles[4].fog, false)
    war.getView = () => ({})
    war.updateTilesAndUnitsOnVisibilityChanged(true)
    assert.equal(units.has(0), true)
    assert.equal(units.has(4), false)
    assert.equal(tiles[0].fog, false)
    assert.equal(tiles[4].fog, true)
    assert.equal(tiles[4].reset, true)
  }
})

test('real inner/outer executors synchronize movement, fog discovery, AI turns and saved operation history', async () => {
  const { module, internal } = await getRealRuntime()
  const schema = async filename => module(fileURLToPath(new URL(`../src/proto/schema/CommonProto/${filename}.ts`, import.meta.url)))
  const { FullConfig } = await schema('Config/FullConfig')
  const { SerialWar } = await schema('WarSerialization/SerialWar')
  const { WoContainer } = await schema('WarOperation/WoContainer')
  const version = 'D0000000'
  const config = new internal.GameConfigs_GameConfig.GameConfig(version, FullConfig.decode(
    readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)),
  ))
  const emptyCo = internal.Cos_Constants.CoId.Empty
  const baseType = internal.TileBases_Utils.getDefaultTileBaseType()
  const unitType = config.getAllUnitTypeArray()[0]
  const unitCfg = config.getUnitTemplateCfg(unitType)
  const grid = (x, y = 0) => new internal.AuxiliaryTypes_GridIndex.GridIndex(x, y)
  const state = { i: 0, j: 0, S: Array.from({ length: 256 }, (_, index) => index) }
  for (const [War, settings] of [
    [internal.Campaigns_Wars_War.War, { settingsForCaw: {} }],
    [internal.SingleRankedWars_War.War, { settingsForSrw: { normalMapId: 1 } }],
  ]) {
    const rules = internal.PlayerRules_Utils.createDefaultPlayerRuleList(2, config)
    rules[0].setCampaignHumanCoIdArray([emptyCo])
    rules[0].setCampaignSkinId(1)
    rules[1].setCampaignAiCoId(emptyCo)
    rules[1].setCampaignSkinId(2)
    rules[1].setSrwAiCoId(emptyCo)
    const players = [0, 1, 2].map(index => {
      const player = internal.MapEditor_Model_MeHelpers.createDefaultISerialPlayer(index)
      player.setUserId(index === 1 ? 123 : null)
      player.setFund(index === 2 ? 23456 : 1000)
      return player.toJson()
    })
    const tiles = Array.from({ length: 50 }, (_, index) => internal.Tiles_Utils_Serialization.createDefault({
      tileBaseTypeId: baseType,
      tileObjectTypeId: 0,
      gridIndex: grid(index % 10, Math.floor(index / 10)).toProto().toJson(),
      gcData: config,
    }).toJson())
    const units = [[1, 0], [2, 4]].map(([index, x]) => ({
      unitId: index,
      playerIndex: index,
      unitType,
      gridIndex: grid(x).toProto().toJson(),
      currentHp: unitCfg.getMaxHp(),
      currentFuel: unitCfg.getMaxFuel(),
      primaryWeaponCurrentAmmo: unitCfg.getPrimaryWeaponMaxAmmo() ?? 0,
      actionState: internal.Units_Constants.ActionStateId.Idle,
    }))
    const inner = new War(false)
    inner.init(SerialWar.fromJson({
      ...settings,
      settingsForCommon: {
        configVersion: version,
        turnsLimit: internal.Turns_Constants.TurnIndex.DefaultLimit,
        warOperationsLimit: internal.WarOperations_Constants.Common.DefaultLimit,
        instanceWarRule: {
          ruleNameArray: [{ languageType: 1, text: 'Dual war test' }],
          warRuleCommonData: {
            hasFogByDefault: true,
            playerRuleList: rules.map(rule => rule.toJson()),
          },
          warEventFullData: {},
        },
      },
      seedRandomInitialState: state,
      seedRandomCurrentState: state,
      playerManager: { players },
      turnManager: { turnIndex: 1, playerIndex: 1, turnPhaseCode: internal.Turns_Constants.PhaseCode.Main },
      field: {
        tileMap: { tiles },
        unitMap: { nextUnitId: 3, units },
        fogMap: { forceFogCode: internal.FogMaps_Constants.ForcedFogCode.None },
      },
    }), config)
    inner.startRunning()
    const outer = new War(false)
    outer.init(inner.serializeForTeamIndexes(new Set([1])), config)
    outer.startRunning()
    assert.equal(outer.getUnitMap().getUnitById(2), null)
    assert.equal(outer.getPlayer(2).getFund(), 0)
    const execute = async action => {
      action.operationId = inner.getExecutedOperationManager().getExecutedOperationsCount()
      const result = internal.WarOperations_Revisers_Reviser.revise(inner, WoContainer.fromJson(action), inner.getPlayerInTurn().getUserId())
      assert.equal(result.errorCode, 0)
      const outerOperation = await internal.WarOperations_Executors_Executor.checkAndExecuteAsInnerWar(inner, result)
      await internal.WarOperations_Executors_Executor.checkAndExecuteAsOuterWar(outer, outerOperation, true)
      assert.equal(outer.getExecutedOperationManager().getExecutedOperationsCount(), inner.getExecutedOperationManager().getExecutedOperationsCount())
      const expected = inner.serializeForTeamIndexes(new Set([1])).getField().getUnitMap()
      assert.deepEqual(outer.getUnitMap().serialize().toJson(), expected.toJson())
    }
    await execute({ WoUnitWait: { path: { nodes: [grid(0), grid(1), grid(2)].map(value => value.toProto().toJson()) } } })
    assert.ok(outer.getUnitMap().getUnitById(2))
    await execute({ WoPlayerEndTurn: {} })
    assert.deepEqual([...outer.getPlayerManager().getWatcherTeamIndexesForSelf()], [1])
    await execute({ WoSystemBeginTurn: {} })
    await execute({ WoUnitWait: { path: { nodes: [grid(4), grid(5), grid(6)].map(value => value.toProto().toJson()) } } })
    assert.equal(outer.getUnitMap().getUnitById(2), null)
    const saved = SerialWar.decode(inner.serialize().encode())
    const restored = new War(false)
    restored.init(saved, config)
    restored.startRunning()
    assert.ok(restored.getUnitMap().getUnitById(2))
    assert.deepEqual(JSON.parse(JSON.stringify(saved.getSeedRandomInitialState().toJson())), state)
    assert.equal(saved.getExecutedOperationManager().getExecutedOperationArray().length, 4)
    assert.equal(restored.serializeForValidation().getExecutedOperationManager().getExecutedOperationArray().length, 4)
    restored.dispose()
    outer.dispose()
    inner.dispose()
  }
})
