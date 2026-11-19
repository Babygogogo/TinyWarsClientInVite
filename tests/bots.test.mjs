import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const compiled = new Map()
const helpers = {
  getExisted(value) {
    assert.notEqual(value, undefined)
    assert.notEqual(value, null)
    return value
  },
  newError: (message, code) => Object.assign(new Error(message), { errorCode: code }),
  createLazyFunc: fn => {
    let value
    return () => value ??= fn()
  },
}

function loadBot(filename, dependencies) {
  if (!compiled.has(filename)) {
    compiled.set(filename, ts.transpileModule(
      readFileSync(new URL(`../src/bots/${filename}.ts`, import.meta.url), 'utf8'),
      { compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.CommonJS } },
    ).outputText)
  }
  const context = {
    exports: {},
    require(specifier) {
      if (specifier.endsWith('/internal.ts')) return {
        ...Object.fromEntries(['01', '08', '09', '11', '12'].map(phase => [
          `Bots_Phases_Phase${phase}`, { [`getActionForPhase${phase}`]: () => null },
        ])),
        ...dependencies,
      }
      assert.match(specifier, /\/proto\//)
      return { WoContainer: { fromJson: value => value } }
    },
  }
  vm.runInNewContext(compiled.get(filename), context)
  return context.exports
}

test('bot failures release the per-war guard, including failures assigning the operation ID', async () => {
  for (const failAssignment of [false, true]) {
    const failure = new Error('Calculation failed')
    let shouldFail = true
    let assignedId
    const operation = { setOperationId: id => {
      if (shouldFail && failAssignment) throw failure
      assignedId = id
    } }
    const war = { getExecutedOperationManager: () => ({ getExecutedOperationsCount: () => 17 }) }
    const bot = loadBot('Bot', {
      Helpers_Misc: helpers,
      Utils_ClientErrorCode: { ClientErrorCode: { SpwRobot_GetNextAction_00: 'busy' } },
      Bots_Utils: { doGetNextOperation: async () => {
        if (shouldFail && !failAssignment) throw failure
        return operation
      } },
    })
    await assert.rejects(bot.getNextOperation(war), error => error === failure)
    shouldFail = false
    assert.equal(await bot.getNextOperation(war), operation)
    assert.equal(assignedId, 17)
  }
})

test('bot still rejects concurrent calculations for the same war but permits other wars', async () => {
  let finish
  const operation = { setOperationId() {} }
  const bot = loadBot('Bot', {
    Helpers_Misc: helpers,
    Utils_ClientErrorCode: { ClientErrorCode: { SpwRobot_GetNextAction_00: 'busy' } },
    Bots_Utils: { doGetNextOperation: () => new Promise(resolve => { finish = () => resolve(operation) }) },
  })
  const war = () => ({ getExecutedOperationManager: () => ({ getExecutedOperationsCount: () => 0 }) })
  const firstWar = war()
  const first = bot.getNextOperation(firstWar)
  const finishFirst = finish
  await assert.rejects(bot.getNextOperation(firstWar), error => error.errorCode === 'busy')
  const second = bot.getNextOperation(war())
  finish()
  finishFirst()
  assert.equal(await first, operation)
  assert.equal(await second, operation)
})

function grid(x) {
  return {
    getX: () => x,
    getY: () => 0,
    getGridId: () => x,
    checkIsEqual: other => other.getX() === x && other.getY() === 0,
    getGridsWithinDistance() { return [this] },
    toProto: () => ({ toJson: () => ({ x, y: 0 }) }),
  }
}

test('CO skill targets match C#: empty list without targets, otherwise value and unit-ID order', () => {
  let count = 0
  const units = [[5, 1000, false], [3, 1000, false], [8, 600, true]].map(([id, cost, onboard]) => ({
    getUnitId: () => id,
    getProductionCfgCost: () => cost,
    getCurrentHp: () => 100,
    getMaxHp: () => 100,
    getIsCoOnboard: () => onboard,
    getTeamIndex: () => 2,
    getGridIndex: () => grid(id),
  }))
  const utils = loadBot('Utils', {
    CoSkills_Utils_Common: { getPowerSkillTargetsCount: () => count },
  })
  const player = {
    getCoBasicCfg: () => ({}),
    getTeamIndex: () => 1,
    getWar: () => ({ getUnitMap: () => ({ getAllUnitsOnMap: predicate => units.filter(predicate) }) }),
  }
  const params = { getMapSize: () => ({}) }
  assert.deepEqual(Array.from(utils.getCoPowerSkillTargetGridIndexArray(params, player, 1)), [])
  count = 2
  assert.deepEqual(Array.from(utils.getCoPowerSkillTargetGridIndexArray(params, player, 1), value => value.getX()), [8, 3])
})

test('production scoring reuses enemy pathfinding across factories and unit types', async () => {
  const grids = [grid(0), grid(1), grid(2)]
  const mapSize = {}
  const template = {
    getAiProductionScore: () => ({
      getBaseStd: () => 100,
      getBonusForTooFewHp: () => [],
    }),
    getDiveCfg: () => null,
    getMaxBuildMaterial: () => 0,
    getPrimaryWeaponMaxAmmo: () => 1,
    getFlareMaxAmmo: () => 0,
    getMaxProduceMaterial: () => 0,
    getMaxFuel: () => 99,
  }
  class Unit {
    init(data) { this.data = data }
    startRunning() {}
    getGridIndex() { return grids[this.data.gridIndex.x] }
    getTeamIndex() { return this.data.playerIndex }
    getCurrentHp() { return 100 }
    getNormalizedMaxHp() { return 10 }
    getArmorType() { return 1 }
    getBaseDamage() { return 10 }
    getCfgMaxAttackRange() { return 1 }
    getFinalMoveRange() { return 1 }
    getCfgCanAttackAfterMoving() { return true }
    getProductionFinalCost() { return 1000 }
    getProductionCfgCost() { return 1000 }
  }
  const enemy = new Unit()
  enemy.init({ gridIndex: { x: 2 }, playerIndex: 2 })
  const tiles = grids.slice(0, 2).map(index => ({
    getGridIndex: () => index,
    getPlayerIndex: () => 1,
    getUnfixedBuffList: () => [],
    getEffectiveSelfUnitProductionSkillCfg: () => null,
    getRegularProducibleUnitTypeArray: () => [1, 2],
  }))
  const war = {
    getExecutedOperationManager: () => ({ getExecutedOperationsCount: () => 0 }),
    getCommonSettingManager: () => ({ getInstanceWarRule: () => ({ getWarRuleCommonData: () => null }) }),
    getUnitMap: () => ({ getUnitOnMap: () => null, getAllUnits: () => [enemy] }),
    getTileMap: () => ({ getAllTiles: () => tiles, getTile: index => index }),
    getGcData: () => ({ getUnitTemplateCfg: () => template }),
    checkCanProduceUnitByOpaAndRule: () => true,
    getFogMap: () => ({ checkHasFogCurrently: () => false }),
    getWarEventManager: () => ({ getOpaAiUnitProductionBonusScore: () => 0 }),
    getPlayerManager: () => ({ getPlayer: () => ({ getFund: () => 10000 }) }),
  }
  let enemyPathfindingCount = 0
  const dependencies = {
    Timer_TimerModel: { checkAndCallLater: async () => {} },
    Utils_ClientErrorCode: { ClientErrorCode: {} },
    Helpers_Misc: helpers,
    Helpers_Collection: { getNonNullElements: values => values.filter(value => value != null) },
    Players_Constants: { PlayerIndex: { Neutral: 0 } },
    Units_Constants: { Hp: { MaxHp: 100 }, CategoryId: { All: 0 } },
    Units_Unit: { Unit },
    Units_Utils_Serialization: { create: value => value },
    Units_Utils_Common: { getNormalizedHp: value => Math.ceil(value / 10) },
    Numbers_Constants: { MinValue: -Number.MAX_VALUE, MaxValue: Number.MAX_VALUE },
    Numbers_Utils: { getValueInRange: ({ rawValue }) => rawValue },
    AuxiliaryTypes_MovableArea: { MovableArea: { create: ({ gridIndex }) => {
      if (gridIndex === grids[2]) ++enemyPathfindingCount
      return { getArea: () => grids.map(() => [{ totalMoveCost: 1 }]) }
    } } },
  }
  dependencies.Bots_Utils = loadBot('Utils', dependencies)
  const phase = loadBot('phases/Phase09', dependencies)
  const action = await phase.getActionForPhase09({
    getWar: () => war,
    getPlayerIndexInTurn: () => 1,
    getMapSize: () => mapSize,
    getUnitValueRatio: () => 1,
    getCanAttackAfterMoving: () => true,
  })
  assert.equal(enemyPathfindingCount, 1, 'enemy movement map must be shared, as in C# sequential scoring')
  assert.equal(action.WoPlayerProduceUnit.unitType, 1)
  assert.equal(action.WoPlayerProduceUnit.unitHp, 100)
  assert.equal(action.WoPlayerProduceUnit.gridIndex.x, 0)
})
