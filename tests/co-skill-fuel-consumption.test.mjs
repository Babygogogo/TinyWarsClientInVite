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
  for (const name of ['Config/FullConfig', 'Config/CoSkillCfg', 'Config/TileCategoryCfg', 'Config/UnitCategoryCfg',
    'Config/WeatherCategoryCfg', 'Structure/GridIndex', 'Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes']) {
    Object.assign(proto, await module(fileURLToPath(new URL(`../src/proto/schema/CommonProto/${name}.ts`, import.meta.url))))
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
  for (const [name, filename] of Object.entries({
    Helpers_Collection: 'helpers/Collection',
    CoSkills_Constants: 'coSkills/Constants', Geometries_Constants: 'geometries/Constants',
    Units_Constants: 'units/Constants', Weathers_Constants: 'weathers/Constants',
    Tiles_Constants_Common: 'tiles/constants/Common', Numbers_Constants: 'numbers/Constants',
    Cos_Constants: 'cos/Constants', Numbers_Utils: 'numbers/Utils', AuxiliaryTypes_GridIndex: 'auxiliaryTypes/GridIndex',
    GameConfigs_GameConfig: 'gameConfigs/GameConfig',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions: 'coSkills/utils/persistent/selfUnitCommonAttributes/Conditions',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_MoveRangeOffsets: 'coSkills/utils/persistent/selfUnitCommonAttributes/MoveRangeOffsets',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_FuelConsumptions: 'coSkills/utils/persistent/selfUnitCommonAttributes/FuelConsumptions',
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
  const raw = proto.FullConfig.decode(readFileSync(new URL('../src/assets/resource/config/FullConfigD0000000.bin', import.meta.url)))
  return { internal, ...proto, raw, gameConfig: new internal.GameConfigs_GameConfig.GameConfig('D0000000', raw) }
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

function fixtures({ raw, gameConfig }) {
  return {
    unit: categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(cfg => cfg.getUnitTypeId()),
      cfg => cfg.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id)),
    tile: categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
      cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id)),
    weather: categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
      cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id)),
  }
}

test('fuel consumption matches all four common conditions; CO units bypass only area', async () => {
  const context = await runtime
  const { internal, gameConfig, SelfUnitCommonAttributes } = context
  const { unit, tile, weather } = fixtures(context)
  const calculate = internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_FuelConsumptions.getTotalOffset
  for (const coSkillAreaTypeId of Object.values(internal.CoSkills_Constants.AreaTypeId).filter(v => typeof v === 'number')) {
    const conditions = { coSkillAreaTypeId, unitCategoryId: unit.id, tileCategoryId: tile.id, weatherCategoryId: weather.id }
    const cfg = SelfUnitCommonAttributes.fromJson({ conditions, fuelConsumptions: { offset: -2 } })
    const common = SelfUnitCommonAttributes.fromJson({ conditions, moveRangeOffsets: { offset: -2 } })
    for (const unitTypeId of [unit.included, unit.excluded]) {
      for (const tileTypeId of [tile.included, tile.excluded]) {
        for (const weatherTypeId of [weather.included, weather.excluded]) {
          for (const isCoOnboard of [false, true]) {
            for (const distance of [0, 1, 2, 5]) {
              const args = { gameConfig, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard,
                gridIndex: new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0), coZoneRadius: 1,
                getCoGridIndexArrayOnMap: () => [new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)] }
              assert.equal(calculate({ ...args, cfg }),
                internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_MoveRangeOffsets.getTotalOffset({ ...args, cfg: common }))
            }
          }
        }
      }
    }
  }
  const args = { gameConfig, unitTypeId: unit.included, tileTypeId: tile.included,
    weatherTypeId: weather.included, isCoOnboard: true }
  const all = { coSkillAreaTypeId: 0, unitCategoryId: 1, tileCategoryId: 1, weatherCategoryId: 1 }
  const create = conditions => SelfUnitCommonAttributes.fromJson({ conditions, fuelConsumptions: { offset: 2 } })
  assert.equal(calculate({ ...args, cfg: create(all) }), 2)
  assert.equal(calculate({ ...args, cfg: null }), 0)
  assert.equal(calculate({ ...args, cfg: create(undefined) }), 0)
  assert.equal(calculate({ ...args, cfg: SelfUnitCommonAttributes.fromJson({
    conditions: all, moveRangeOffsets: { offset: 2 }, visions: { rangeOffset: 2, canSeeThrough: true },
  }) }), 0)
  for (const key of ['unitCategoryId', 'tileCategoryId', 'weatherCategoryId']) {
    for (const value of [undefined, 0, 2147483647]) {
      const json = { ...all, [key]: value }
      if (value === undefined) delete json[key]
      assert.equal(calculate({ ...args, cfg: create(json) }), 0, `${key}: ${value}`)
    }
  }
})

test('per-turn fuel passes current tile and weather to stacked offsets and preserves diving consumption', async () => {
  const context = await runtime
  const { internal, gameConfig, CoSkillCfg } = context
  const { unit: unitCategory, tile, weather } = fixtures(context)
  const skills = [2, -1].map(offset => CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    conditions: { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone, unitCategoryId: unitCategory.id,
      tileCategoryId: tile.id, weatherCategoryId: weather.id },
    fuelConsumptions: { offset },
  } } }))
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: id => skills[id] })
  let unitTypeId = unitCategory.included
  let tileTypeId = tile.included
  let weatherTypeId = weather.included
  let distance = 0
  let onboard = false
  let diving = false
  const player = { getCoZoneRadius: () => 1, getCoCurrentSkills: () => [0, 1],
    getCoGridIndexListOnMap: () => [new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)] }
  const unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
    getPlayer: () => player, getGcData: () => config, getIsDiving: () => diving,
    getTemplateCfg: () => ({ getFuelConsumptionPerTurn: () => 3,
      getDiveCfg: () => ({ getDivedFuelConsumption: () => 5 }) }),
    getUnitTypeId: () => unitTypeId, getIsCoOnboard: () => onboard,
    getGridIndex: () => new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0),
    getWar: () => ({
      getTileMap: () => ({ getTile: grid => { assert.equal(grid.getX(), distance); return { getTileTypeId: () => tileTypeId } } }),
      getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }),
    }),
  })
  assert.equal(unit.getFuelConsumptionPerTurn(), 4)
  tileTypeId = tile.excluded
  assert.equal(unit.getFuelConsumptionPerTurn(), 3)
  onboard = true
  assert.equal(unit.getFuelConsumptionPerTurn(), 3)
  tileTypeId = tile.included
  weatherTypeId = weather.excluded
  assert.equal(unit.getFuelConsumptionPerTurn(), 3)
  weatherTypeId = weather.included
  unitTypeId = unitCategory.excluded
  assert.equal(unit.getFuelConsumptionPerTurn(), 3)
  unitTypeId = unitCategory.included
  distance = 5
  onboard = false
  assert.equal(unit.getFuelConsumptionPerTurn(), 3)
  onboard = true
  diving = true
  assert.equal(unit.getFuelConsumptionPerTurn(), 6)
  for (const skill of skills) {
    const cfg = skill.getPersistent().getSelfUnitCommonAttributes().getConditions()
    cfg.setUnitCategoryId(1)
    cfg.setTileCategoryId(1)
    cfg.setWeatherCategoryId(1)
  }
  unitTypeId = unitCategory.excluded
  tileTypeId = tile.excluded
  weatherTypeId = weather.excluded
  assert.equal(unit.getFuelConsumptionPerTurn(), 6)
})

test('migrated CO groups keep selective fuel reduction without granting it to other units', async () => {
  const { internal, FullConfig } = await runtime
  const groups = {
    A0000000: [], B0000000: [[32000, 17]], B0000001: [[32000, 17], [32001, 4]],
    B0000002: [[32000, 17], [32001, 4]], C0000000: [], D0000000: [[32000, 4]],
  }
  for (const [version, targets] of Object.entries(groups)) {
    const raw = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
    const gameConfig = new internal.GameConfigs_GameConfig.GameConfig(version, raw)
    for (const co of raw.getCoBasic()) {
      const category = targets.find(([coId]) => coId === co.getCoId())?.[1]
      for (const ids of [co.getPassiveSkillIds(), co.getPowerSkillIds(), co.getSuperPowerSkillIds()]) {
        for (const unit of raw.getUnitTemplate()) {
          const unitTypeId = unit.getUnitTypeId()
          const actual = ids.reduce((total, id) => total
            + internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_FuelConsumptions.getTotalOffset({
              cfg: gameConfig.getCoSkillCfg(id).getPersistent()?.getSelfUnitCommonAttributes(),
              gameConfig, unitTypeId, tileTypeId: raw.getTileTemplate()[0].getTileTypeId(),
              weatherTypeId: raw.getWeather()[0].getWeatherTypeId(), isCoOnboard: true,
            }), 0)
          assert.equal(actual, category != null && gameConfig.checkIsUnitTypeInCategory(unitTypeId, category) ? -2 : 0,
            `${version}: CO ${co.getCoId()}, unit ${unitTypeId}`)
        }
      }
    }
  }
})
