import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { loadModules } from './helpers/load-modules.mjs'

const runtime = (async () => {
  const module = await loadModules(fileURLToPath(new URL('../src/proto/schema/CommonProto/Config/FullConfig.ts', import.meta.url)))
  const proto = {}
  for (const name of ['Config/FullConfig', 'Config/CoSkillCfg',
    'Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes', 'Structure/GridIndex']) {
    Object.assign(proto, await module(fileURLToPath(new URL(`../src/proto/schema/CommonProto/${name}.ts`, import.meta.url))))
  }
  const internal = { Helpers_Misc: {
    getExisted(value) { assert.notEqual(value, null); assert.notEqual(value, undefined); return value },
    createLazyFunc: fn => { let value; return () => value ??= fn() },
  } }
  for (const [name, filename] of Object.entries({
    CoSkills_Constants: 'coSkills/Constants',
    Geometries_Constants: 'geometries/Constants',
    Numbers_Constants: 'numbers/Constants',
    Numbers_Utils: 'numbers/Utils',
    AuxiliaryTypes_GridIndex: 'auxiliaryTypes/GridIndex',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions: 'coSkills/utils/persistent/selfUnitCommonAttributes/Conditions',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_CoBoardingCosts: 'coSkills/utils/persistent/selfUnitCommonAttributes/CoBoardingCosts',
    Units_Unit: 'units/Unit',
  })) {
    const compiled = ts.transpileModule(readFileSync(new URL(`../src/${filename}.ts`, import.meta.url), 'utf8'),
      { compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.CommonJS } }).outputText
    const context = { exports: {}, require(specifier) {
      if (specifier.endsWith('/internal.ts')) return internal
      assert.match(specifier, /\/proto\//)
      return proto
    } }
    vm.runInNewContext(compiled, context)
    internal[name] = context.exports
  }
  return { internal, ...proto }
})()

const conditions = { coSkillAreaTypeId: 0, unitCategoryId: 2, tileCategoryId: 2, weatherCategoryId: 2 }
const matches = (type, category) => category === 1 || (category === 2 && type === 10)
const config = {
  checkIsUnitTypeInCategory: matches,
  checkIsTileTypeInCategory: matches,
  checkIsWeatherTypeInCategory: matches,
}

test('boarding multipliers require all shared filters; CO units bypass only the area filter', async () => {
  const { internal, SelfUnitCommonAttributes } = await runtime
  const GridIndex = internal.AuxiliaryTypes_GridIndex.GridIndex
  const calculate = internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_CoBoardingCosts.getMultiplierPct
  for (const area of [0, 1, 2]) {
    const cfg = SelfUnitCommonAttributes.fromJson({
      conditions: { ...conditions, coSkillAreaTypeId: area }, coBoardingCosts: { multiplierPct: 50 },
    })
    for (const unitTypeId of [10, 20]) for (const tileTypeId of [10, 20]) for (const weatherTypeId of [10, 20]) {
      for (const isCoOnboard of [false, true]) for (const distance of [0, 1, 2, 5]) {
        const gridIndex = new GridIndex(distance, 0)
        const getCoGridIndexArrayOnMap = () => [new GridIndex(0, 0)]
        const inArea = gridIndex.checkIsInsideCoSkillArea({
          coSkillAreaType: area, coZoneRadius: 1, getCoGridIndexArrayOnMap,
        })
        const expected = unitTypeId === 10 && tileTypeId === 10 && weatherTypeId === 10 && (isCoOnboard || inArea)
        assert.equal(calculate({ cfg, gameConfig: config, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard,
          gridIndex, coZoneRadius: 1, getCoGridIndexArrayOnMap }), expected ? 50 : 100)
      }
    }
  }
  for (const cfg of [null, SelfUnitCommonAttributes.fromJson({ coBoardingCosts: { multiplierPct: 0 } }),
    SelfUnitCommonAttributes.fromJson({ conditions, luckRangeOffsets: { lowerOffset: 1 } })]) {
    assert.equal(calculate({ cfg, gameConfig: config }), 100)
  }
  assert.throws(() => calculate({
    cfg: SelfUnitCommonAttributes.fromJson({ conditions, coBoardingCosts: {} }),
    gameConfig: config, unitTypeId: 10, tileTypeId: 10, weatherTypeId: 10, isCoOnboard: true,
  }))
})

test('unit boarding costs stack multiplicatively, retain zero effects, filter terrain/weather and round only the final cost', async () => {
  const { internal, CoSkillCfg } = await runtime
  const GridIndex = internal.AuxiliaryTypes_GridIndex.GridIndex
  const skills = [50, 150].map(multiplierPct => CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    conditions, coBoardingCosts: { multiplierPct },
  } } }))
  let unitTypeId = 10, tileTypeId = 10, weatherTypeId = 10, distance = 0, isCoOnboard = false
  const player = {
    getCoBasicCfg: () => ({ getBoardCostPercentage: () => 50 }),
    getCoCurrentSkills: () => [0, 1, 2], getCoZoneRadius: () => 1,
    getCoGridIndexListOnMap: () => [new GridIndex(0, 0)],
  }
  const unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
    getPlayer: () => player, getGcData: () => ({ ...config, getCoSkillCfg: id => skills[id] }),
    getUnitTypeId: () => unitTypeId, getIsCoOnboard: () => isCoOnboard,
    getGridIndex: () => new GridIndex(distance, 0), getProductionCfgCost: () => 1001,
    getWar: () => ({
      getTileMap: () => ({ getTile: () => ({ getTileTypeId: () => tileTypeId }) }),
      getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }),
    }),
  })
  assert.equal(unit.getCoBoardCost(), 375)
  distance = 5
  assert.equal(unit.getCoBoardCost(), 500)
  isCoOnboard = true
  assert.equal(unit.getCoBoardCost(), 375)
  unitTypeId = 20
  assert.equal(unit.getCoBoardCost(), 500)
  unitTypeId = 10; tileTypeId = 20
  assert.equal(unit.getCoBoardCost(), 500)
  tileTypeId = 10; weatherTypeId = 20
  assert.equal(unit.getCoBoardCost(), 500)
  weatherTypeId = 10
  skills[0].getPersistent().getSelfUnitCommonAttributes().getCoBoardingCosts().setMultiplierPct(0)
  assert.equal(unit.getCoBoardCost(), 0)
  skills.length = 0
  assert.equal(unit.getCoBoardCost(), 500)
})

test('all generated configurations retain Cyrus free boarding with unrestricted conditions and wire-preserved explicit zero', async () => {
  const { FullConfig, CoSkillCfg } = await runtime
  for (const version of ['A0000000', 'B0000000', 'B0000001', 'B0000002', 'C0000000', 'D0000000']) {
    const config = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
    const effects = config.getCoSkill().filter(skill => skill.getPersistent()?.getSelfUnitCommonAttributes()?.getCoBoardingCosts())
    assert.equal(effects.length, 1)
    const effect = CoSkillCfg.decode(effects[0].encode())
    const common = effect.getPersistent().getSelfUnitCommonAttributes()
    assert.deepEqual(JSON.parse(JSON.stringify(common.getConditions().toJson())), {
      coSkillAreaTypeId: 1, unitCategoryId: 1, tileCategoryId: 1, weatherCategoryId: 1,
    })
    assert.equal(common.getCoBoardingCosts().checkHasMultiplierPct(), true)
    assert.equal(common.getCoBoardingCosts().getMultiplierPct(), 0)
    const cyrus = config.getCoBasic().find(co => co.getSuperPowerSkillIds().includes(effect.getSkillId()))
    assert.ok(cyrus)
    assert.ok(cyrus.getSuperPowerSkillIds().includes(59000201))
    assert.ok(cyrus.getSuperPowerSkillIds().includes(59000202))
  }
})
