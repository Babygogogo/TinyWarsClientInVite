import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const compiled = new Map()

function loadExecutor(name, dependencies) {
  if (!compiled.has(name)) {
    const source = readFileSync(new URL(`../src/warOperations/executors/utils/${name}.ts`, import.meta.url), 'utf8')
    compiled.set(name, ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.CommonJS },
    }).outputText)
  }
  const context = {
    exports: {},
    require: specifier => {
      if (specifier === '../../../internal.ts') return dependencies
      assert.match(specifier, /^\.\.\/\.\.\/\.\.\/proto\//)
      return {}
    },
  }
  vm.runInNewContext(compiled.get(name), context)
  return context.exports.executeAsOuterWar
}

function fixture({ visible = false, blocked = true, skillType = 1, vibrated = false } = {}) {
  const events = []
  const grid = { x: 1, y: 2 }
  const lastNode = {
    getGridIndex: () => grid,
    getIsVisible: () => visible,
    getIsBlocked: () => blocked,
  }
  const movingUnitAndPath = {
    getUnit: () => ({ getUnitId: () => 7 }),
    getPath: () => [lastNode],
  }
  const commonExtraData = {
    getMovingUnitAndPath: () => movingUnitAndPath,
    getDestroyedUnitIdArray: () => [7],
  }
  const extraData = {
    getCommonExtraData: () => commonExtraData,
    getTargetGridIndex: () => null,
    getDroppingUnitAndPathArray: () => [],
    getIsDropBlocked: () => blocked,
    getSkillType: () => skillType,
    getSkillDataArray: () => [{ getSkillIndex: () => 0 }],
    getPlayerIndex: () => 2,
    getIsAgree: () => false,
  }
  const unit = {
    getPlayerIndex: () => 1,
    getGridIndex: () => grid,
    flushDataToView: () => events.push(['flush']),
  }
  const unitMap = {
    getAllUnitsOnMap: () => [unit, { getPlayerIndex: () => 2 }],
    getMapSize: () => ({}),
    getUnitLoadedById: () => null,
    getUnitOnMap: () => unit,
  }
  const player = {
    getPlayerIndex: () => 1,
    getUserId: () => 'other',
    getCoSkills: () => [11],
  }
  const war = {
    getPlayerInTurn: () => player,
    getPlayerIndexInTurn: () => 1,
    getUnitMap: () => unitMap,
    getTileMap: () => ({ getMapSize: () => ({}) }),
    getGcData: () => ({
      getTileTemplateCfgDict: () => new Map([[0, { getLaunchSiloParams: () => [0, 0, 2] }]]),
    }),
    getGridVisualEffect: () => new Proxy({}, {
      get: (_, effect) => () => events.push([effect]),
    }),
    getView: () => ({ showVibration: () => events.push(['vibrate']) }),
    getDrawVoteManager: () => ({
      handleVote: (...args) => events.push(['vote', ...args]),
      handlePlayerForceDestruction: () => events.push(['destroyForce']),
    }),
    showTempUnitMoveAnimation: async ({ callback, aiming }) => {
      events.push(['move', aiming])
      await callback?.({ setIsVisible: value => events.push(['visible', value]) })
    },
    updateTilesAndUnitsOnVisibilityChanged: isFast => events.push(['visibility', isFast]),
  }
  const dependencies = {
    Helpers_Misc: {
      getExisted(value, code) {
        if (value == null) throw new Error(code ?? 'missing value')
        return value
      },
    },
    AuxiliaryTypes_GridIndex: { GridIndex: { convertGridIndex: value => value } },
    Utils_ClientErrorCode: { ClientErrorCode: new Proxy({}, { get: (_, code) => code }) },
    WarOperations_Executors_Utils_Common: {
      handleCommonExtraData: ({ commonExtraData: data, isFastExecute, isUnitJoinUnit }) => {
        assert.equal(data, commonExtraData)
        events.push(['common', isFastExecute, !!isUnitJoinUnit])
        return vibrated
      },
    },
    Users_Model: { getSelfUserId: () => 'self' },
    CoSkills_Constants: { SkillTypeId: { Power: 1 } },
    CoSkills_Utils_Executor: {
      executeInstantSkillAsOuterWar: ({ skillId, isFastExecute }) => events.push(['skill', skillId, isFastExecute]),
    },
    Sounds_Constants: { ShortSfxCode: { Explode: 'explode', Block: 'block', UnitProduction: 'produce' } },
    Sounds_SoundPlayer: { playShortSfx: sound => events.push(['sound', sound]) },
    MapEditor_Model_MeWar: { MeWar: class {} },
    MultiPlayerWar_Model_MpwWar: { MpwWar: class {} },
    ReplayWar_Model_RwWarBase: { RwWarBase: class {} },
    SinglePlayerWars_War: { War: class {} },
    TestWar_Model_TwWar: { TwWar: class {} },
  }
  return { events, war, action: { getExtraData: () => extraData, getTargetGridIndexArray: () => [] }, dependencies, extraData, commonExtraData, unitMap }
}

const commonExecutors = [
  'PlayerDeleteUnit', 'PlayerSurrender', 'PlayerVoteForDraw',
  'SystemDestroyPlayerForce', 'SystemHandleBootPlayer', 'SystemVoteForDraw',
  'UnitAttackTile', 'UnitAttackUnit', 'UnitBeLoaded', 'UnitBoardedByCo',
  'UnitBuildTile', 'UnitCaptureTile', 'UnitCrushUnit', 'UnitDive', 'UnitDropUnit',
  'UnitJoinUnit', 'UnitLaunchFlare', 'UnitLaunchSilo', 'UnitProduceUnit',
  'UnitRepairUnit', 'UnitSelfDetonate', 'UnitSupplyUnit', 'UnitSurface', 'UnitWait',
]

for (const name of commonExecutors) {
  test(`${name}: normal execution awaits movement; fast execution skips presentation`, async () => {
    for (const isFast of [false, true]) {
      const { events, war, action, dependencies } = fixture()
      await loadExecutor(name, dependencies)(war, action, isFast)
      const expected = isFast ? [] : [['move', null]]
      if (name === 'UnitDropUnit' && !isFast) expected.push(['visible', false])
      expected.push(['common', isFast, name === 'UnitJoinUnit'])
      if (name.endsWith('VoteForDraw')) expected.push(['vote', 2, false])
      if (name === 'SystemDestroyPlayerForce') expected.push(['destroyForce'])
      if (!['PlayerSurrender', 'PlayerVoteForDraw', 'SystemHandleBootPlayer', 'SystemVoteForDraw'].includes(name)) {
        expected.push(['visibility', isFast])
      }
      assert.deepEqual(events, expected)
    }
  })

  test('ending a turn forwards the execution mode before refreshing visibility', async () => {
    for (const name of ['PlayerEndTurn', 'SystemEndTurn']) {
      for (const isFast of [false, true]) {
        const state = fixture()
        const manager = {}
        state.war.getTurnManager = () => manager
        state.dependencies.Turns_Phases_Handler = {
          endPhaseMainAsOuterWar: (turnManager, action, fast) => {
            assert.equal(turnManager, manager)
            assert.equal(action, state.action)
            state.events.push(['endMain', fast])
          },
        }
        await loadExecutor(name, state.dependencies)(state.war, state.action, isFast)
        assert.deepEqual(state.events, [['endMain', isFast], ['visibility', isFast]])
      }
    }
  })

  test('beginning a turn awaits the normal popup and phase handler, skipping the popup in fast mode', async () => {
    for (const isFast of [false, true]) {
      const state = fixture()
      state.war.getPlayerInTurn = () => ({
        getPlayerIndex: () => 1,
        getAliveState: () => 1,
        getNickname: async () => 'player',
        getTeamIndex: () => 1,
        getCoId: () => 0,
        getUnitAndTileSkinId: () => 0,
      })
      state.war.getTurnManager = () => ({})
      state.dependencies.Players_Constants = { PlayerIndex: { Neutral: 0 }, AliveStateId: { Dead: 0 } }
      state.dependencies.GamePanels_Dict = { getDict: () => ({ BwBeginTurnPanel: 'begin' }) }
      state.dependencies.GamePanels_Manager = {
        openPanel: (_, { callbackOnFinish }) => {
          state.events.push(['popup'])
          queueMicrotask(() => {
            state.events.push(['popupFinished'])
            callbackOnFinish()
          })
        },
      }
      state.dependencies.Turns_Phases_Handler = {
        endPhaseStandbyAsOuterWar: async (_, action, fast) => {
          assert.equal(action, state.action)
          await Promise.resolve()
          state.events.push(['endStandby', fast])
        },
      }
      await loadExecutor('SystemBeginTurn', state.dependencies)(state.war, state.action, isFast)
      assert.deepEqual(state.events, [
        ...isFast ? [] : [['popup'], ['popupFinished']],
        ['endStandby', isFast], ['visibility', isFast],
      ])
    }
  })

  test('war events await execution and refresh persistent text only in normal mode', async () => {
    for (const isFast of [false, true]) {
      const state = fixture()
      state.action.getWarEventId = () => 42
      state.dependencies.Lang_Constants = { TextType: { B0451: 'event' } }
      state.dependencies.Lang_Utils = { getText: () => 'event' }
      state.dependencies.FloatText = { show: text => state.events.push(['desc', text]) }
      state.war.getView = () => ({ updatePersistentText: () => state.events.push(['text']) })
      state.war.getWarEventManager = () => ({
        updateWarEventCalledCountOnCall: id => state.events.push(['count', id]),
        callWarEventAsOuterWar: async (_, fast) => {
          await Promise.resolve()
          state.events.push(['event', fast])
        },
      })
      await loadExecutor('SystemCallWarEvent', state.dependencies)(state.war, state.action, isFast)
      assert.deepEqual(state.events, [
        ...isFast ? [] : [['desc', 'event (E42)']],
        ['count', 42], ['event', isFast], ['visibility', isFast],
        ...isFast ? [] : [['text']],
      ])
    }
  })

  test('ending a war shows the description only in normal mode', async () => {
    for (const isFast of [false, true]) {
      const state = fixture()
      Object.setPrototypeOf(state.war, state.dependencies.SinglePlayerWars_War.War.prototype)
      state.dependencies.Lang_Constants = { TextType: { B0087: 'ended' } }
      state.dependencies.Lang_Utils = { getText: () => 'ended' }
      state.dependencies.FloatText = { show: text => state.events.push(['desc', text]) }
      state.war.setIsEnded = value => state.events.push(['ended', value])
      await loadExecutor('SystemEndWar', state.dependencies)(state.war, state.action, isFast)
      assert.deepEqual(state.events, [...isFast ? [] : [['desc', 'ended']], ['ended', true]])
    }
  })
}

test('CO skills execute in both modes but activate allied unit views only in normal mode', async () => {
  for (const name of ['PlayerUseCoSkill', 'UnitUseCoSkill']) {
    for (const isFast of [false, true]) {
      for (const skillType of [1, 2, ...(name === 'UnitUseCoSkill' ? [undefined] : [])]) {
        const state = fixture({ skillType: skillType ?? null })
        await loadExecutor(name, state.dependencies)(state.war, state.action, isFast)
        const expected = name === 'UnitUseCoSkill' && !isFast ? [['move', null]] : []
        if (skillType != null) expected.push(['skill', 11, isFast])
        expected.push(['common', isFast, false])
        if (!isFast && skillType != null) {
          expected.push(['flush'], [skillType === 1 ? 'showEffectCoPowerActivation' : 'showEffectCoSuperPowerActivation'])
        }
        expected.push(['visibility', isFast])
        assert.deepEqual(state.events, expected)
      }
    }
  }
})

test('dropping units removes loaded copies in both modes without refreshing loaders in fast mode', async () => {
  for (const isFast of [false, true]) {
    const state = fixture()
    const droppingUnit = { getUnit: () => ({ getUnitId: () => 8 }) }
    state.extraData.getDroppingUnitAndPathArray = () => [droppingUnit]
    state.unitMap.getUnitLoadedById = () => ({
      getLoaderUnitId: () => {
        assert.equal(isFast, false)
        return 9
      },
    })
    state.unitMap.deleteUnitLoaded = id => ({ dispose: () => state.events.push(['dispose', id]) })
    state.unitMap.getUnitById = () => ({ flushDataToView: () => state.events.push(['loaderFlush']) })
    await loadExecutor('UnitDropUnit', state.dependencies)(state.war, state.action, isFast)
    assert.deepEqual(state.events, [
      ...isFast ? [] : [['move', null], ['visible', false], ['move', null]],
      ['common', isFast, false],
      ['dispose', 8],
      ...isFast ? [] : [['loaderFlush']],
      ['visibility', isFast],
    ])
  }
})

test('destroyed attacking units explode only in normal mode without duplicating vibration', async () => {
  for (const isFast of [false, true]) {
    for (const vibrated of [false, true]) {
      const state = fixture({ visible: true, blocked: false, vibrated })
      await loadExecutor('UnitAttackUnit', state.dependencies)(state.war, state.action, isFast)
      assert.deepEqual(state.events, [
        ...isFast ? [] : [['move', null]],
        ['common', isFast, false],
        ...isFast ? [] : [['showEffectExplosion'], ...vibrated ? [] : [['vibrate'], ['sound', 'explode']]],
        ['visibility', isFast],
      ])
    }
  }
})

test('failed animation rejects before common data or visibility updates', async () => {
  const state = fixture()
  const failure = new Error('animation failed')
  state.war.showTempUnitMoveAnimation = async () => { throw failure }
  await assert.rejects(loadExecutor('PlayerDeleteUnit', state.dependencies)(state.war, state.action, false), error => error === failure)
  assert.deepEqual(state.events, [])
})

test('missing common data keeps mode-specific diagnostics', async () => {
  for (const [name, fastSuffix] of [['PlayerDeleteUnit', 'PlayerDeleteUnit_00'], ['UnitLaunchFlare', 'UnitLaunchFlare_01'], ['UnitLaunchSilo', 'UnitLaunchFlare_00']]) {
    for (const isFast of [false, true]) {
      const state = fixture()
      state.extraData.getCommonExtraData = () => undefined
      const code = `WarOperationExecutor_${isFast ? `FastExe${fastSuffix}` : `NormalExe${name}_00`}`
      await assert.rejects(loadExecutor(name, state.dependencies)(state.war, state.action, isFast), { message: code })
      assert.deepEqual(state.events, [])
    }
  }
})
