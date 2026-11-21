import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { loadModules } from './helpers/load-modules.mjs'

const runtime = (async () => {
  const filename = fileURLToPath(new URL('../src/proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes.ts', import.meta.url))
  const module = await loadModules(filename)
  const { SelfUnitCommonAttributes } = await module(filename)
  const internal = { Helpers_Misc: {
    getExisted(value) {
      assert.notEqual(value, undefined)
      assert.notEqual(value, null)
      return value
    },
    createLazyFunc: fn => {
      let value
      return () => value ??= fn()
    },
  } }
  const load = name => {
    const code = ts.transpileModule(readFileSync(new URL(`../src/${name}.ts`, import.meta.url), 'utf8'),
      { compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.CommonJS } }).outputText
    const context = { exports: {}, require: specifier => {
      if (specifier.endsWith('/internal.ts')) return internal
      assert.match(specifier, /\/proto\//)
      return {}
    } }
    vm.runInNewContext(code, context)
    return context.exports
  }
  internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions =
    load('coSkills/utils/persistent/selfUnitCommonAttributes/Conditions')
  internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_LuckRangeOffsets =
    load('coSkills/utils/persistent/selfUnitCommonAttributes/LuckRangeOffsets')
  return { SelfUnitCommonAttributes, luck: internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_LuckRangeOffsets,
    Unit: load('units/Unit').Unit }
})()

const gameConfig = {
  checkIsUnitTypeInCategory: (type, category) => category === 1 || type === category,
  checkIsTileTypeInCategory: (type, category) => category === 1 || type === category,
  checkIsWeatherTypeInCategory: (type, category) => category === 1 || type === category,
}
const conditions = { coSkillAreaTypeId: 2, unitCategoryId: 11, tileCategoryId: 21, weatherCategoryId: 31 }
const plain = value => ({ ...value })

test('luck offsets share all common conditions; CO units bypass only the area check', async () => {
  const { SelfUnitCommonAttributes, luck } = await runtime
  const cfg = SelfUnitCommonAttributes.fromJson({ conditions, luckRangeOffsets: { lowerOffset: -5, upperOffset: 12 } })
  for (const unitTypeId of [11, 12]) {
    for (const tileTypeId of [21, 22]) {
      for (const weatherTypeId of [31, 32]) {
        for (const isCoOnboard of [false, true]) {
          for (const inside of [false, true]) {
            const gridIndex = { checkIsInsideCoSkillArea: args => {
              assert.equal(args.coSkillAreaType, 2)
              assert.equal(args.coZoneRadius, 3)
              return inside
            } }
            const args = { cfg, gameConfig, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard,
              gridIndex, coZoneRadius: 3, getCoGridIndexArrayOnMap: () => [] }
            const categoriesMatch = unitTypeId === 11 && tileTypeId === 21 && weatherTypeId === 31
            assert.deepEqual(plain(luck.getTotalOffset(args)),
              categoriesMatch && (inside || isCoOnboard) ? { lower: -5, upper: 12 } : { lower: 0, upper: 0 })
            assert.deepEqual(plain(luck.getTotalOffsetForDamageCalculatorPanel(args)),
              categoriesMatch ? { lower: -5, upper: 12 } : { lower: 0, upper: 0 })
          }
        }
      }
    }
  }
})

test('missing effects/conditions contribute nothing; unrestricted and single-bound effects work', async () => {
  const { SelfUnitCommonAttributes, luck } = await runtime
  const args = { gameConfig, unitTypeId: 12, tileTypeId: 22, weatherTypeId: 32, isCoOnboard: true }
  for (const cfg of [null, SelfUnitCommonAttributes.fromJson({ luckRangeOffsets: { upperOffset: 8 } }),
    SelfUnitCommonAttributes.fromJson({ conditions, fuelConsumptions: { offset: 1 } })]) {
    assert.deepEqual(plain(luck.getTotalOffset({ ...args, cfg })), { lower: 0, upper: 0 })
    assert.deepEqual(plain(luck.getTotalOffsetForDamageCalculatorPanel({ ...args, cfg })), { lower: 0, upper: 0 })
  }
  const cfg = SelfUnitCommonAttributes.fromJson({ conditions: {
    coSkillAreaTypeId: 2, unitCategoryId: 1, tileCategoryId: 1, weatherCategoryId: 1,
  }, luckRangeOffsets: { upperOffset: 8 } })
  assert.deepEqual(plain(luck.getTotalOffset({ ...args, cfg })), { lower: 0, upper: 8 })
  cfg.getLuckRangeOffsets().setUpperOffset(0)
  cfg.getLuckRangeOffsets().setLowerOffset(-3)
  assert.deepEqual(plain(luck.getTotalOffsetForDamageCalculatorPanel({ ...args, cfg })), { lower: -3, upper: 0 })
})

test('unit luck uses the supplied battle tile/current weather and stacks signed offsets', async () => {
  const { SelfUnitCommonAttributes, Unit } = await runtime
  const skills = [{ lowerOffset: -5, upperOffset: 12 }, { lowerOffset: 2, upperOffset: -3 }]
    .map(luckRangeOffsets => SelfUnitCommonAttributes.fromJson({ conditions, luckRangeOffsets }))
  const config = { ...gameConfig, getCoSkillCfg: id => ({
    getPersistent: () => ({ getSelfUnitCommonAttributes: () => skills[id] }),
  }) }
  let tileTypeId = 21
  let weatherTypeId = 31
  let onboard = false
  let inside = true
  const gridIndex = { checkIsInsideCoSkillArea: () => inside }
  const player = { getCoZoneRadius: () => 3, getCoCurrentSkills: () => [0, 1], getCoGridIndexListOnMap: () => [] }
  const unit = Object.assign(Object.create(Unit.prototype), {
    getPlayer: () => player, getGcData: () => config, getUnitTypeId: () => 11, getIsCoOnboard: () => onboard,
    getWar: () => ({
      getTileMap: () => ({ getTile: grid => {
        assert.equal(grid, gridIndex)
        return { getTileTypeId: () => tileTypeId }
      } }),
      getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }),
    }),
  })
  const offsets = () => plain(unit.getLuckLimitModifierByCo(gridIndex))
  assert.deepEqual(offsets(), { lower: -3, upper: 9 })
  inside = false
  assert.deepEqual(offsets(), { lower: 0, upper: 0 })
  onboard = true
  assert.deepEqual(offsets(), { lower: -3, upper: 9 })
  tileTypeId = 22
  assert.deepEqual(offsets(), { lower: 0, upper: 0 })
  tileTypeId = 21
  weatherTypeId = 32
  assert.deepEqual(offsets(), { lower: 0, upper: 0 })
})
