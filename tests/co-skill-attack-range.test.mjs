import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { loadModules } from './helpers/load-modules.mjs'

const runtime = (async () => {
  const module = await loadModules(fileURLToPath(new URL('../src/proto/schema/CommonProto/Config/FullConfig.ts', import.meta.url)))
  const schema = name => module(fileURLToPath(new URL(`../src/proto/schema/CommonProto/${name}.ts`, import.meta.url)))
  const proto = {}
  for (const name of ['Config/FullConfig', 'Config/CoSkillCfg', 'Config/TileCategoryCfg', 'Config/UnitCategoryCfg',
    'Config/WeatherCategoryCfg', 'Structure/GridIndex',
    'Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes']) {
    Object.assign(proto, await schema(name))
  }
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
  function loadSource(filename) {
    const compiled = ts.transpileModule(readFileSync(new URL(`../src/${filename}.ts`, import.meta.url), 'utf8'),
      { compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.CommonJS } }).outputText
    const context = { exports: {}, require(specifier) {
      if (specifier.endsWith('/internal.ts')) return internal
      assert.match(specifier, /\/proto\//)
      return proto
    } }
    vm.runInNewContext(compiled, context)
    return context.exports
  }
  for (const [name, filename] of Object.entries({
    Helpers_Collection: 'helpers/Collection',
    CoSkills_Constants: 'coSkills/Constants', Geometries_Constants: 'geometries/Constants',
    Units_Constants: 'units/Constants', Weathers_Constants: 'weathers/Constants',
    Tiles_Constants_Common: 'tiles/constants/Common', Numbers_Constants: 'numbers/Constants',
    Cos_Constants: 'cos/Constants', Numbers_Utils: 'numbers/Utils', AuxiliaryTypes_GridIndex: 'auxiliaryTypes/GridIndex',
    GameConfigs_GameConfig: 'gameConfigs/GameConfig',
    CoSkills_Utils_Persistent_AttackRangeOffsets: 'coSkills/utils/persistent/AttackRangeOffsets',
    CoSkills_Utils_Persistent_SelfUnitMoveRange: 'coSkills/utils/persistent/SelfUnitMoveRange',
    Units_Unit: 'units/Unit',
  })) internal[name] = loadSource(filename)
  const { FullConfig, SelfUnitCommonAttributes, CoSkillCfg } = proto
  const raw = FullConfig.decode(readFileSync(new URL('../src/assets/resource/config/FullConfigD0000000.bin', import.meta.url)))
  const gameConfig = new internal.GameConfigs_GameConfig.GameConfig('D0000000', raw)
  return { internal, gameConfig, raw, FullConfig, SelfUnitCommonAttributes, CoSkillCfg }
})()

function categoryFixture(categories, types, getId, matches) {
  for (const category of categories) {
    const id = getId(category)
    const included = types.find(type => matches(type, id))
    const excluded = types.find(type => !matches(type, id))
    if (included != null && excluded != null) return { id, included, excluded }
  }
  assert.fail('Expected a category with both matching and nonmatching types')
}

test('attack range uses the same conjunctive category and area conditions as common attributes, including CO units', async () => {
  const { internal, gameConfig, raw, SelfUnitCommonAttributes } = await runtime
  const unit = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(cfg => cfg.getUnitTypeId()),
    cfg => cfg.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
  const tile = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    unitCategoryId: unit.id, tileCategoryId: tile.id, weatherCategoryId: weather.id }
  const cfg = SelfUnitCommonAttributes.fromJson({ conditions, attackRangeOffsets: { upperOffset: -1 } })
  const common = SelfUnitCommonAttributes.fromJson({ conditions, moveRangeOffsets: { offset: -1 } })
  const getCoGridIndexArrayOnMap = () => [new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)]
  for (const unitTypeId of [unit.included, unit.excluded]) {
    for (const tileTypeId of [tile.included, tile.excluded]) {
      for (const weatherTypeId of [weather.included, weather.excluded]) {
        for (const isCoOnboard of [false, true]) {
          for (const distance of [0, 5]) {
            const args = { gameConfig, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard,
              gridIndex: new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0),
              coZoneRadius: 1, getCoGridIndexArrayOnMap }
            const expected = unitTypeId === unit.included && tileTypeId === tile.included
              && weatherTypeId === weather.included && (isCoOnboard || distance === 0) ? -1 : 0
            assert.equal(internal.CoSkills_Utils_Persistent_AttackRangeOffsets.getTotalUpperOffset({ ...args, cfg }), expected)
            assert.equal(internal.CoSkills_Utils_Persistent_SelfUnitMoveRange.getTotalOffset({ ...args, cfg: common }), expected)
          }
        }
      }
    }
  }
})

test('unit maximum range passes current terrain and weather to stacked skills without CO category exemptions', async () => {
  const { internal, gameConfig, raw, CoSkillCfg } = await runtime
  const tile = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const skills = [2, -1].map(upperOffset => CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    conditions: {
      coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
      unitCategoryId: 1, tileCategoryId: tile.id, weatherCategoryId: weather.id,
    },
    attackRangeOffsets: { upperOffset },
  } } }))
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: id => skills[id] })
  let tileTypeId = tile.included
  let weatherTypeId = weather.included
  let onboard = false
  const player = { getCoId: () => 1, getCoZoneRadius: () => 1, getCoCurrentSkills: () => [0, 1],
    getCoGridIndexListOnMap: () => [new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)] }
  const unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
    getPlayer: () => player, getGcData: () => config, getCfgMaxAttackRange: () => 3,
    getUnitTypeId: () => raw.getUnitTemplate()[0].getUnitTypeId(),
    getIsCoOnboard: () => onboard, getGridIndex: () => new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0),
    getWar: () => ({
      getTileMap: () => ({ getTile: () => ({ getTileTypeId: () => tileTypeId }) }),
      getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }),
      getWarEventManager: () => ({ getOpaMaxAttackRangeModifier: () => 0 }),
    }),
  })
  assert.equal(unit.getFinalMaxAttackRange(), 4)
  tileTypeId = tile.excluded
  assert.equal(unit.getFinalMaxAttackRange(), 3)
  onboard = true
  assert.equal(unit.getFinalMaxAttackRange(), 3)
  tileTypeId = tile.included
  weatherTypeId = weather.excluded
  assert.equal(unit.getFinalMaxAttackRange(), 3)
  weatherTypeId = weather.included
  assert.equal(unit.getFinalMaxAttackRange(), 4)
  for (const skill of skills) {
    const conditions = skill.getPersistent().getSelfUnitCommonAttributes().getConditions()
    conditions.setTileCategoryId(1)
    conditions.setWeatherCategoryId(1)
  }
  tileTypeId = tile.excluded
  weatherTypeId = weather.excluded
  assert.equal(unit.getFinalMaxAttackRange(), 4)
})

test('other common attributes do not grant range and a range effect requires shared conditions', async () => {
  const { internal, gameConfig, SelfUnitCommonAttributes } = await runtime
  const calculate = cfg => internal.CoSkills_Utils_Persistent_AttackRangeOffsets.getTotalUpperOffset({ cfg, gameConfig })
  assert.equal(calculate(null), 0)
  assert.equal(calculate(SelfUnitCommonAttributes.fromJson({ attackRangeOffsets: { upperOffset: 2 } })), 0)
  assert.equal(calculate(SelfUnitCommonAttributes.fromJson({
    conditions: { coSkillAreaTypeId: 2, unitCategoryId: 1, tileCategoryId: 1, weatherCategoryId: 1 },
    moveRangeOffsets: { offset: 2 },
  })), 0)
})

test('migrated skill groups retain all-unit range and separate indirect-unit-only range without double counting', async () => {
  const { internal, FullConfig } = await runtime
  for (const version of ['A0000000', 'B0000000', 'B0000001', 'B0000002', 'C0000000', 'D0000000']) {
    const raw = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
    const gameConfig = new internal.GameConfigs_GameConfig.GameConfig(version, raw)
    const groups = [
      [gameConfig.getCoBasicCfg(12000).getPassiveSkillIds(), () => 1],
      [gameConfig.getCoBasicCfg(2000).getSuperPowerSkillIds(), unit => gameConfig.checkIsUnitTypeInCategory(unit, 8) ? 2 : 0],
    ]
    for (const [ids, expected] of groups) {
      for (const unit of raw.getUnitTemplate()) {
        const unitTypeId = unit.getUnitTypeId()
        const total = ids.reduce((sum, id) => sum + internal.CoSkills_Utils_Persistent_AttackRangeOffsets.getTotalUpperOffset({
          cfg: gameConfig.getCoSkillCfg(id).getPersistent()?.getSelfUnitCommonAttributes(),
          gameConfig, unitTypeId, tileTypeId: raw.getTileTemplate()[0].getTileTypeId(),
          weatherTypeId: raw.getWeather()[0].getWeatherTypeId(), isCoOnboard: true,
        }), 0)
        assert.equal(total, expected(unitTypeId), `${version}: unit ${unitTypeId}`)
      }
    }
  }
})
