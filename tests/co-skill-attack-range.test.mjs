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
  function loadSource(filename, testExport) {
    const source = readFileSync(new URL(`../src/${filename}.ts`, import.meta.url), 'utf8')
    const compiled = ts.transpileModule(testExport ? `${source}\nexport { ${testExport} };` : source,
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
    CoSkills_Utils_Persistent_SelfTileCommonAttributes_Conditions: 'coSkills/utils/persistent/selfTileCommonAttributes/Conditions',
    CoSkills_Utils_Persistent_SelfTileCommonAttributes_IncomeOffsets: 'coSkills/utils/persistent/selfTileCommonAttributes/IncomeOffsets',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions: 'coSkills/utils/persistent/selfUnitCommonAttributes/Conditions',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_ArmorPenetrations: 'coSkills/utils/persistent/selfUnitCommonAttributes/ArmorPenetrations',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_MoveCosts: 'coSkills/utils/persistent/selfUnitCommonAttributes/MoveCosts',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_ReceiveFullTileDefenseWhenDamaged: 'coSkills/utils/persistent/selfUnitCommonAttributes/ReceiveFullTileDefenseWhenDamaged',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Invisibilities: 'coSkills/utils/persistent/selfUnitCommonAttributes/Invisibilities',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_ImmuneToCounterAttacks: 'coSkills/utils/persistent/selfUnitCommonAttributes/ImmuneToCounterAttacks',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_AbleToDoCounterAttacks: 'coSkills/utils/persistent/selfUnitCommonAttributes/AbleToDoCounterAttacks',
    CoSkills_Utils_Persistent_AttackRangeOffsets: 'coSkills/utils/persistent/selfUnitCommonAttributes/AttackRangeOffsets',
    CoSkills_Utils_Persistent_SelfUnitMoveRange: 'coSkills/utils/persistent/selfUnitCommonAttributes/MoveRangeOffsets',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_RepairAmountOffsets: 'coSkills/utils/persistent/selfUnitCommonAttributes/RepairAmountOffsets',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_PromotionOffsetsWhenProduced: 'coSkills/utils/persistent/selfUnitCommonAttributes/PromotionOffsetsWhenProduced',
    CoSkills_Utils_Persistent_Visions: 'coSkills/utils/persistent/selfUnitCommonAttributes/Visions',
    AuxiliaryTypes_UnitVisionInfo: 'auxiliaryTypes/UnitVisionInfo',
    Units_Unit: 'units/Unit',
    Units_Utils_Common: 'units/utils/Common',
    Locations_Utils: 'locations/Utils',
    Tiles_Utils_Common: 'tiles/utils/Common',
    Tiles_Tile: 'tiles/Tile',
  })) {
    internal[name] = loadSource(filename)
    if (filename.includes('/selfUnitCommonAttributes/')) {
      internal[`CoSkills_Utils_Persistent_SelfUnitCommonAttributes_${filename.split('/').at(-1)}`] = internal[name]
    }
  }
  const { FullConfig, SelfUnitCommonAttributes, CoSkillCfg } = proto
  const raw = FullConfig.decode(readFileSync(new URL('../src/assets/resource/config/FullConfigD0000000.bin', import.meta.url)))
  const gameConfig = new internal.GameConfigs_GameConfig.GameConfig('D0000000', raw)
  const panelSource = ts.createSourceFile('panel.ts',
    readFileSync(new URL('../src/common/view/CommonDamageCalculatorPanel.ts', import.meta.url), 'utf8'),
    ts.ScriptTarget.Latest, true)
  const panelFunctions = panelSource.statements.filter(node => ts.isFunctionDeclaration(node)
    && ['getAttackerOffensePierce', 'getCoSkillIdArray', 'getTileDefenseAmountForUnit'].includes(node.name?.text)).map(node => node.getText(panelSource)).join('\n')
  const panelContext = { ...internal }
  vm.runInNewContext(ts.transpileModule(panelFunctions, {
    compilerOptions: { target: ts.ScriptTarget.ES2023 },
  }).outputText, panelContext)
  return { internal, gameConfig, raw, FullConfig, SelfUnitCommonAttributes, CoSkillCfg,
    getTileProductionPromotion: loadSource('warOperations/executors/utils/PlayerProduceUnit', 'getPromotionForPlayerProduceUnit').getPromotionForPlayerProduceUnit,
    getUnitProductionPromotion: loadSource('warOperations/executors/utils/UnitProduceUnit', 'getPromotionForUnitProduceUnit').getPromotionForUnitProduceUnit,
    getPanelOffensePierce: panelContext.getAttackerOffensePierce,
    getPanelTileDefense: panelContext.getTileDefenseAmountForUnit }
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

test('tile income filters by tile, current weather and CO area, and multiplies matching effects', async () => {
  const { internal, gameConfig, raw, CoSkillCfg } = await runtime
  const tile = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(c => c.getTileTypeId()),
    c => c.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(c => c.getWeatherTypeId()),
    c => c.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    tileCategoryId: tile.id, weatherCategoryId: weather.id }
  const skill = (multiplierPct, filters = conditions) => CoSkillCfg.fromJson({
    persistent: { selfTileCommonAttributes: {
      conditions: filters,
      incomeOffsets: multiplierPct === undefined ? undefined : { multiplierPct },
    } },
  })
  const skills = [skill(125), skill(50), skill(0), skill(undefined), skill(200, null)]
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: id => skills[id] })
  const GridIndex = internal.AuxiliaryTypes_GridIndex.GridIndex
  const coGridIndex = new GridIndex(0, 0)
  let gridIndex = new GridIndex(1, 0)
  let tileType = tile.included
  let weatherType = weather.included
  let skillIds = [0, 1, 3, 4, 99]
  const player = { getCoCurrentSkills: () => skillIds, getCoZoneRadius: () => 1, getCoGridIndexListOnMap: () => [coGridIndex] }
  const war = { getGcData: () => config,
    getWeatherManager: () => ({ getCurrentWeatherType: () => weatherType }),
    getCommonSettingManager: () => ({ getPlayerRule: () => ({ getIncomeMultiplier: () => 120 }) }),
  }
  const receiver = { getPlayerIndex: () => 1, getUnfixedBuffList: () => undefined,
    getWar: () => war, getPlayer: () => player, getTileTypeId: () => tileType,
    getGridIndex: () => gridIndex, getIncomePerTurn: () => 1001,
  }
  const income = () => internal.Tiles_Tile.Tile.prototype.getIncomeForPlayer.call(receiver, 1)
  assert.equal(income(), 750)
  weatherType = weather.excluded
  assert.equal(income(), 1201)
  weatherType = weather.included
  tileType = tile.excluded
  assert.equal(income(), 1201)
  tileType = tile.included
  gridIndex = new GridIndex(2, 0)
  assert.equal(income(), 1201)
  gridIndex = coGridIndex
  assert.equal(income(), 750)
  skillIds = [0, 2]
  assert.equal(income(), 0)
})

test('production promotion filters the new unit, production tile and weather, and clamps stacked offsets', async () => {
  const { internal, gameConfig, raw, CoSkillCfg, getTileProductionPromotion, getUnitProductionPromotion } = await runtime
  const unit = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(c => c.getUnitTypeId()),
    c => c.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
  const tile = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(c => c.getTileTypeId()),
    c => c.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(c => c.getWeatherTypeId()),
    c => c.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    unitCategoryId: unit.id, tileCategoryId: tile.id, weatherCategoryId: weather.id }
  const skills = [3, -1, 10, -10, undefined].map(offset => CoSkillCfg.fromJson({
    persistent: { selfUnitCommonAttributes: {
      conditions, ...(offset === undefined ? {} : { promotionOffsetsWhenProduced: { offset } }),
    } },
  }))
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: id => skills[id], getUnitMaxPromotion: () => 3 })
  const GridIndex = internal.AuxiliaryTypes_GridIndex.GridIndex
  const origin = new GridIndex(0, 0)
  let gridIndex = new GridIndex(1, 0)
  let tileType = tile.included
  let weatherType = weather.included
  let skillIds = [0, 1, 4, 99]
  let isCoOnboard = false
  const player = { getCoCurrentSkills: () => skillIds, getCoZoneRadius: () => 1, getCoGridIndexListOnMap: () => [origin] }
  const war = { getPlayerInTurn: () => player, getGcData: () => config,
    getTileMap: () => ({ getTile: actual => {
      assert.equal(actual, gridIndex)
      return { getTileTypeId: () => tileType }
    } }),
    getWeatherManager: () => ({ getCurrentWeatherType: () => weatherType }),
  }
  const producer = { getPlayer: () => player, getGridIndex: () => gridIndex,
    getUnitTypeId: () => unit.excluded, getIsCoOnboard: () => isCoOnboard }
  const check = (tileResult, unitResult, unitType = unit.included) => {
    assert.equal(getTileProductionPromotion(war, gridIndex, unitType), tileResult)
    assert.equal(getUnitProductionPromotion(war, producer, unitType), unitResult)
  }
  check(2, 2)
  gridIndex = new GridIndex(2, 0)
  check(0, 0)
  isCoOnboard = true
  check(0, 2)
  check(0, 0, unit.excluded)
  tileType = tile.excluded
  check(0, 0)
  tileType = tile.included
  weatherType = weather.excluded
  check(0, 0)
  weatherType = weather.included
  gridIndex = origin
  skillIds.push(2)
  check(3, 3)
  skillIds = [1, 3]
  check(0, 0)
})

  test('loaded-unit repair uses the repairing unit shared conditions, additive offsets and multiplicative optional costs', async () => {
    const { internal, gameConfig, raw, CoSkillCfg, SelfUnitCommonAttributes } = await runtime
    const unitCategory = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(c => c.getUnitTypeId()),
      c => c.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
    const tileCategory = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(c => c.getTileTypeId()),
      c => c.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
    const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(c => c.getWeatherTypeId()),
      c => c.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
    const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
      unitCategoryId: unitCategory.id, tileCategoryId: tileCategory.id, weatherCategoryId: weather.id }
    const origin = new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)
    const effects = [{ offset: 3 }, { offset: -1, costMultiplierPct: 50 }, { costMultiplierPct: 80 }]
    const skills = effects.map(repairAmountOffsets => CoSkillCfg.fromJson({
      persistent: { selfUnitCommonAttributes: { conditions, repairAmountOffsets },
        selfRepairAmountBonus: { coSkillAreaTypeId: 2, repairOffsetFromTile: 9, costMultiplierPct: 25 } },
    }))
    const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: id => skills[id] })
    const player = { getCoCurrentSkills: () => [0, 1, 2, 99], getCoZoneRadius: () => 1,
      getCoGridIndexListOnMap: () => [origin], getFund: () => 10000 }
    let args, repairingUnit
    for (const unitTypeId of [unitCategory.excluded, unitCategory.included]) {
      for (const tileTypeId of [tileCategory.excluded, tileCategory.included]) {
        for (const weatherTypeId of [weather.excluded, weather.included]) {
          for (const isCoOnboard of [false, true]) {
            for (const distance of [0, 1, 2]) {
              const gridIndex = new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0)
              args = { gameConfig: config, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard, gridIndex,
                coZoneRadius: 1, getCoGridIndexArrayOnMap: () => [origin] }
              repairingUnit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
                getPlayer: () => player, getGcData: () => config, getGridIndex: () => gridIndex,
                getUnitTypeId: () => unitTypeId, getIsCoOnboard: () => isCoOnboard, getUnitId: () => 10,
                getNormalizedRepairHpForLoadedUnit: () => 2,
                getWar: () => ({
                  getTileMap: () => ({ getTile: actual => {
                    assert.equal(actual, gridIndex)
                    return { getTileTypeId: () => tileTypeId }
                  } }),
                  getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }),
                }),
              })
              const matches = unitTypeId === unitCategory.included && tileTypeId === tileCategory.included
                && weatherTypeId === weather.included && (isCoOnboard || distance <= 1)
              const result = repairingUnit.getNormalizedRepairAmountAndCostModifier()
              assert.equal(result.amountModifier, matches ? 2 : 0)
              assert.equal(result.costMultiplierPct, matches ? 40 : 100)
              const loadedUnit = { getLoaderUnitId: () => 10, checkIsFullHp: () => false,
                getNormalizedMaxHp: () => 10, getNormalizedCurrentHp: () => 1, getCurrentHp: () => 10,
                getProductionFinalCost: () => 10000, getPlayer: () => player,
                getUnitTypeId: () => unitCategory.excluded }
              const repair = repairingUnit.getRepairHpAndCostForLoadedUnit(loadedUnit)
              assert.equal(repair.hp, matches ? 40 : 20)
              assert.equal(repair.cost, matches ? 1600 : 2000)
            }
          }
        }
      }
    }
    const check = internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_RepairAmountOffsets.getAmountAndCostModifier
    for (const cfg of [null, undefined, SelfUnitCommonAttributes.fromJson({ conditions }),
      SelfUnitCommonAttributes.fromJson({ repairAmountOffsets: { offset: 1 } })]) {
      const result = check({ ...args, cfg })
      assert.equal(result.amountModifier, 0)
      assert.equal(result.costMultiplierPct, 100)
    }
    for (const cost of [undefined, 0, 50, 100]) {
      const cfg = SelfUnitCommonAttributes.decode(SelfUnitCommonAttributes.fromJson({
        conditions, repairAmountOffsets: { costMultiplierPct: cost },
      }).encode())
      assert.equal(cfg.getRepairAmountOffsets().getCostMultiplierPct() ?? undefined, cost)
      const result = check({ ...args, cfg })
      assert.equal(result.amountModifier, 0)
      assert.equal(result.costMultiplierPct, cost ?? 100)
    }
  })

  test('repair migration preserves the ten effects without modifying globally shared skills or tile repair', async () => {
    const { FullConfig } = await runtime
    for (const version of ['A0000000', 'B0000000', 'B0000001', 'B0000002', 'C0000000', 'D0000000']) {
      const raw = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
      const skills = new Map(raw.getCoSkill().map(s => [s.getSkillId(), s]))
      const expected = version === 'A0000000' ? [[61001, 'getPassiveSkillIds', 2, 0]]
        : ['B0000001', 'B0000002', 'D0000000'].includes(version)
          ? ['getPassiveSkillIds', 'getPowerSkillIds', 'getSuperPowerSkillIds'].map(group =>
            [version.startsWith('B') ? 47001 : 47000, group, 1, 2]) : []
      const actual = []
      for (const co of raw.getCoBasic()) {
        for (const group of ['getPassiveSkillIds', 'getPowerSkillIds', 'getSuperPowerSkillIds']) {
          assert.equal(new Set(co[group]()).size, co[group]().length)
          const effects = co[group]().map(id => {
            assert.ok(skills.has(id))
            return skills.get(id).getPersistent()?.getSelfUnitCommonAttributes()
          }).filter(c => c?.getRepairAmountOffsets())
          for (const common of effects) {
            const effect = common.getRepairAmountOffsets(), conditions = common.getConditions()
            actual.push([co.getCoId(), group, effect.getOffset(), conditions.getCoSkillAreaTypeId()])
            assert.equal(effect.getCostMultiplierPct(), 100)
            assert.equal(conditions.getUnitCategoryId(), 1)
            assert.equal(conditions.getTileCategoryId(), 1)
            assert.equal(conditions.getWeatherCategoryId(), 1)
          }
        }
      }
      assert.deepEqual(actual, expected)
      assert.equal(skills.get(99999999)?.getPersistent()?.getSelfUnitCommonAttributes()?.getRepairAmountOffsets() ?? null, null)
      for (const skill of skills.values()) {
        const tile = skill.getPersistent()?.getSelfRepairAmountBonus()
        if (tile) {
          assert.equal(tile.getRepairOffsetFromTile(), version === 'A0000000' ? 2 : 1)
          assert.equal(tile.getCostMultiplierPct(), 100)
          assert.equal('repairOffsetFromUnit' in tile.toJson(), false)
        }
      }
    }
  })
test('counterattack permission only disables on explicit false with matching shared conditions in helper and Unit', async () => {
  const { internal, gameConfig, raw, CoSkillCfg, SelfUnitCommonAttributes } = await runtime
  const unitCategory = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(cfg => cfg.getUnitTypeId()),
    cfg => cfg.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
  const tileCategory = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    unitCategoryId: unitCategory.id, tileCategoryId: tileCategory.id, weatherCategoryId: weather.id }
  const origin = new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)
  const skill = CoSkillCfg.fromJson({ persistent: {} })
  const allowingSkill = CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    conditions, ableToDoCounterAttacks: { isAble: true },
  } } })
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: id => id === 0 ? skill : allowingSkill })
  let coId = 52000
  let skillIds = [0]
  const player = { getCoId: () => coId, getCoCurrentSkills: () => skillIds, getCoZoneRadius: () => 1,
    getCoGridIndexListOnMap: () => [origin] }
  const check = internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_AbleToDoCounterAttacks.checkIsAble
  let args
  let unit
  for (const isAble of [undefined, true, false]) {
    const common = SelfUnitCommonAttributes.decode(SelfUnitCommonAttributes.fromJson({
      conditions, ableToDoCounterAttacks: { isAble },
    }).encode())
    const effect = common.getAbleToDoCounterAttacks()
    assert.equal(effect.checkHasIsAble(), isAble != null)
    assert.equal(effect.getIsAble() ?? undefined, isAble)
    skill.getPersistent().setSelfUnitCommonAttributes(common)
    for (const unitTypeId of [unitCategory.excluded, unitCategory.included]) {
      for (const tileTypeId of [tileCategory.excluded, tileCategory.included]) {
        for (const weatherTypeId of [weather.excluded, weather.included]) {
          for (const isCoOnboard of [false, true]) {
            for (const distance of [2, 1, 0]) {
              const gridIndex = new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0)
              args = { cfg: common, gameConfig: config, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard,
                gridIndex, coZoneRadius: 1, getCoGridIndexArrayOnMap: () => [origin] }
              unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
                getPlayer: () => player, getGcData: () => config, getUnitTypeId: () => unitTypeId,
                getIsCoOnboard: () => isCoOnboard,
                getWar: () => ({
                  getTileMap: () => ({ getTile: actual => {
                    assert.equal(actual, gridIndex)
                    return { getTileTypeId: () => tileTypeId }
                  } }),
                  getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }),
                }),
              })
              const able = !(isAble === false && unitTypeId === unitCategory.included
                && tileTypeId === tileCategory.included && weatherTypeId === weather.included
                && (isCoOnboard || distance <= 1))
              assert.equal(check(args), able)
              assert.equal(unit.checkCanCounterAttackByCo(gridIndex), able)
            }
          }
        }
      }
    }
  }
  for (const cfg of [null, undefined, SelfUnitCommonAttributes.fromJson({ conditions }),
    SelfUnitCommonAttributes.fromJson({ ableToDoCounterAttacks: { isAble: false } })]) {
    assert.equal(check({ ...args, cfg }), true)
    skill.getPersistent().setSelfUnitCommonAttributes(cfg)
    assert.equal(unit.checkCanCounterAttackByCo(args.gridIndex), true)
  }
  skill.getPersistent().setSelfUnitCommonAttributes(args.cfg)
  for (const ids of [[0, 1], [1, 0]]) {
    skillIds = ids
    assert.equal(unit.checkCanCounterAttackByCo(args.gridIndex), false, 'true does not override a disabling skill')
  }
  coId = internal.Cos_Constants.CoId.Empty
  assert.equal(unit.checkCanCounterAttackByCo(args.gridIndex), true)
})

test('counterattack permission migration preserves all Grimm skill groups and all-weather conditions', async () => {
  const { FullConfig } = await runtime
  for (const version of ['A0000000', 'B0000000', 'B0000001', 'B0000002', 'C0000000', 'D0000000']) {
    const raw = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
    const skills = new Map(raw.getCoSkill().map(skill => [skill.getSkillId(), skill]))
    const effects = []
    for (const co of raw.getCoBasic()) {
      for (const group of ['getPassiveSkillIds', 'getPowerSkillIds', 'getSuperPowerSkillIds']) {
        for (const id of co[group]()) {
          const common = skills.get(id).getPersistent()?.getSelfUnitCommonAttributes()
          if (common?.getAbleToDoCounterAttacks()?.getIsAble() !== false) continue
          const conditions = common.getConditions()
          effects.push([co.getCoId(), group, id, conditions.getCoSkillAreaTypeId(),
            conditions.getUnitCategoryId(), conditions.getTileCategoryId(), conditions.getWeatherCategoryId()])
        }
      }
    }
    assert.deepEqual(effects, version.startsWith('B') ? [
      [52000, 'getPowerSkillIds', 52000101, 2, 7, 1, 1],
      [52000, 'getSuperPowerSkillIds', 52000201, 2, 7, 1, 1],
    ] : [])
  }
})

test('counterattack immunity requires its flag and all shared filters in the helper and Unit', async () => {
  const { internal, gameConfig, raw, CoSkillCfg, SelfUnitCommonAttributes } = await runtime
  const unitCategory = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(cfg => cfg.getUnitTypeId()),
    cfg => cfg.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
  const tileCategory = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    unitCategoryId: unitCategory.id, tileCategoryId: tileCategory.id, weatherCategoryId: weather.id }
  const origin = new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)
  const skill = CoSkillCfg.fromJson({ persistent: {} })
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: () => skill })
  let coId = 49000
  const player = { getCoId: () => coId, getCoCurrentSkills: () => [0], getCoZoneRadius: () => 1,
    getCoGridIndexListOnMap: () => [origin] }
  const check = internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_ImmuneToCounterAttacks.checkIsImmune
  let args
  let unit
  for (const isImmune of [undefined, false, true]) {
    const common = SelfUnitCommonAttributes.decode(SelfUnitCommonAttributes.fromJson({
      conditions, immuneToCounterAttacks: { isImmune },
    }).encode())
    assert.equal(common.getImmuneToCounterAttacks().getIsImmune(), isImmune === true)
    skill.getPersistent().setSelfUnitCommonAttributes(common)
    for (const unitTypeId of [unitCategory.excluded, unitCategory.included]) {
      for (const tileTypeId of [tileCategory.excluded, tileCategory.included]) {
        for (const weatherTypeId of [weather.excluded, weather.included]) {
          for (const isCoOnboard of [false, true]) {
            for (const distance of [2, 1, 0]) {
              const gridIndex = new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0)
              args = { cfg: common, gameConfig: config, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard,
                gridIndex, coZoneRadius: 1, getCoGridIndexArrayOnMap: () => [origin] }
              unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
                getPlayer: () => player, getGcData: () => config, getUnitTypeId: () => unitTypeId,
                getIsCoOnboard: () => isCoOnboard,
                getWar: () => ({
                  getTileMap: () => ({ getTile: actual => {
                    assert.equal(actual, gridIndex)
                    return { getTileTypeId: () => tileTypeId }
                  } }),
                  getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }),
                }),
              })
              const immune = isImmune === true && unitTypeId === unitCategory.included
                && tileTypeId === tileCategory.included && weatherTypeId === weather.included
                && (isCoOnboard || distance <= 1)
              assert.equal(check(args), immune)
              assert.equal(unit.checkCanBeCounterAttackedByCo(gridIndex), !immune)
            }
          }
        }
      }
    }
  }
  for (const cfg of [null, undefined, SelfUnitCommonAttributes.fromJson({ conditions }),
    SelfUnitCommonAttributes.fromJson({ immuneToCounterAttacks: { isImmune: true } })]) {
    assert.equal(check({ ...args, cfg }), false)
    skill.getPersistent().setSelfUnitCommonAttributes(cfg)
    assert.equal(unit.checkCanBeCounterAttackedByCo(args.gridIndex), true)
  }
  skill.getPersistent().setSelfUnitCommonAttributes(args.cfg)
  coId = internal.Cos_Constants.CoId.Empty
  assert.equal(unit.checkCanBeCounterAttackedByCo(args.gridIndex), true)
})

test('counterattack immunity migration preserves Sonja groups and all-weather conditions in every config', async () => {
  const { FullConfig } = await runtime
  for (const version of ['A0000000', 'B0000000', 'B0000001', 'B0000002', 'C0000000', 'D0000000']) {
    const raw = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
    const skills = new Map(raw.getCoSkill().map(skill => [skill.getSkillId(), skill]))
    const effects = []
    for (const co of raw.getCoBasic()) {
      for (const group of ['getPassiveSkillIds', 'getPowerSkillIds', 'getSuperPowerSkillIds']) {
        for (const id of co[group]()) {
          const common = skills.get(id).getPersistent()?.getSelfUnitCommonAttributes()
          if (!common?.getImmuneToCounterAttacks()?.getIsImmune()) continue
          const conditions = common.getConditions()
          effects.push([co.getCoId(), group, id, conditions.getCoSkillAreaTypeId(),
            conditions.getUnitCategoryId(), conditions.getTileCategoryId(), conditions.getWeatherCategoryId()])
        }
      }
    }
    assert.deepEqual(effects, version.startsWith('B') ? [
      [49000, 'getPassiveSkillIds', 49000001, 2, 1, 1, 1],
      [49000, 'getPowerSkillIds', 49000101, 2, 1, 1, 1],
      [49000, 'getSuperPowerSkillIds', 49000201, 2, 1, 1, 1],
    ] : [])
  }
})

test('invisibility requires its flag and shared filters; CO units bypass only the area filter', async () => {
  const { internal, gameConfig, raw, CoSkillCfg } = await runtime
  const unitCategory = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(cfg => cfg.getUnitTypeId()),
    cfg => cfg.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
  const tileCategory = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    unitCategoryId: unitCategory.id, tileCategoryId: tileCategory.id, weatherCategoryId: weather.id }
  let common
  const skill = CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    conditions, invisibilities: { isInvisible: true },
  } } })
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: id => id === 0 ? skill : undefined })
  const origin = new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)
  const player = { getCoCurrentSkills: () => [1, 0], getCoZoneRadius: () => 1,
    getCoGridIndexListOnMap: () => [origin] }
  for (const isInvisible of [undefined, false, true]) {
    const cfg = CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
      conditions, invisibilities: { isInvisible },
    } } })
    common = CoSkillCfg.decode(cfg.encode()).getPersistent().getSelfUnitCommonAttributes()
    assert.equal(common.getInvisibilities().getIsInvisible(), isInvisible === true)
    skill.getPersistent().setSelfUnitCommonAttributes(common)
    for (const unitTypeId of [unitCategory.included, unitCategory.excluded]) {
      for (const tileTypeId of [tileCategory.included, tileCategory.excluded]) {
        for (const weatherTypeId of [weather.included, weather.excluded]) {
          for (const isCoOnboard of [false, true]) {
            for (const distance of [0, 1, 2]) {
              const gridIndex = new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0)
              const args = { cfg: common, gameConfig: config, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard,
                gridIndex, coZoneRadius: 1, getCoGridIndexArrayOnMap: () => [origin] }
              const unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
                getPlayer: () => player, getGcData: () => config, getUnitTypeId: () => unitTypeId,
                getIsCoOnboard: () => isCoOnboard,
                getWar: () => ({
                  getTileMap: () => ({ getTile: actual => {
                    assert.equal(actual, gridIndex)
                    return { getTileTypeId: () => tileTypeId }
                  } }),
                  getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }),
                }),
              })
              const enabled = isInvisible === true && unitTypeId === unitCategory.included
                && tileTypeId === tileCategory.included && weatherTypeId === weather.included
                && (isCoOnboard || distance <= 1)
              assert.equal(internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Invisibilities.checkIsInvisible(args), enabled)
              assert.equal(unit.checkIsInvisible(gridIndex), enabled)
            }
          }
        }
      }
    }
  }
  const args = { cfg: common, gameConfig: config, unitTypeId: unitCategory.included, tileTypeId: tileCategory.included,
    weatherTypeId: weather.included, isCoOnboard: true, gridIndex: origin, coZoneRadius: 1,
    getCoGridIndexArrayOnMap: () => [origin] }
  const check = cfg => internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Invisibilities.checkIsInvisible({ ...args, cfg })
  common.setConditions(null)
  assert.equal(check(common), false)
  common.setConditions(CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: { conditions } } })
    .getPersistent().getSelfUnitCommonAttributes().getConditions())
  common.setInvisibilities(null)
  assert.equal(check(common), false)
  assert.equal(check(undefined), false)
  assert.equal(check(null), false)
})

test('migrated invisibility remains limited to the original CO groups and condition tuples in all six configs', async () => {
  const { FullConfig } = await runtime
  for (const version of ['A0000000', 'B0000000', 'B0000001', 'B0000002', 'C0000000', 'D0000000']) {
    const raw = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
    const skills = new Map(raw.getCoSkill().map(skill => [skill.getSkillId(), skill]))
    const effects = []
    for (const co of raw.getCoBasic()) {
      for (const group of ['getPassiveSkillIds', 'getPowerSkillIds', 'getSuperPowerSkillIds']) {
        for (const id of co[group]()) {
          const common = skills.get(id).getPersistent()?.getSelfUnitCommonAttributes()
          if (!common?.getInvisibilities()?.getIsInvisible()) continue
          const conditions = common.getConditions()
          effects.push([co.getCoId(), group, conditions.getCoSkillAreaTypeId(), conditions.getUnitCategoryId(),
            conditions.getTileCategoryId(), conditions.getWeatherCategoryId()])
        }
      }
    }
    assert.deepEqual(effects, version.startsWith('B') ? [
      [10000, 'getSuperPowerSkillIds', 2, 2, 16, 1],
      [49000, 'getSuperPowerSkillIds', 2, 1, 1, 1],
    ] : [])
  }
})

test('full tile defense requires enabled shared conditions and preserves HP scaling, previews and unsupported terrain', async () => {
  const { internal, gameConfig, raw, CoSkillCfg, getPanelTileDefense } = await runtime
  const unitCategory = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(cfg => cfg.getUnitTypeId()),
    cfg => cfg.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
  const tileCategory = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    unitCategoryId: unitCategory.id, tileCategoryId: tileCategory.id, weatherCategoryId: weather.id }
  const skill = CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    conditions, receiveFullTileDefenseWhenDamaged: { isEnabled: true },
  } } })
  let ids = [0]
  let canDefend = true
  const template = { getIsCustomizableBuilding: () => false, getDefenseAmount: () => 30,
    getDefenseUnitCategoryId: () => canDefend ? 1 : 0 }
  const config = Object.assign(Object.create(gameConfig), {
    getCoSkillCfg: id => id === 0 ? skill : undefined,
    getCoBasicCfg: () => ({ getPassiveSkillIds: () => ids }),
    getTileTemplateCfg: () => template,
  })
  const origin = new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)
  const player = { getPlayerIndex: () => 1, getCoCurrentSkills: () => ids, getCoZoneRadius: () => 1,
    getCoGridIndexListOnMap: () => [origin], getVisibleCoGridIndexArrayOnMap: () => [] }
  for (const unitType of [unitCategory.included, unitCategory.excluded]) {
    for (const tileType of [tileCategory.included, tileCategory.excluded]) {
      for (const weatherType of [weather.included, weather.excluded]) {
        for (const onboard of [false, true]) {
          for (const distance of [0, 1, 2]) {
            for (const preview of [false, true]) {
              const unit = { getUnitTypeId: () => unitType, getPlayer: () => player,
                getIsCoOnboard: () => onboard, getNormalizedCurrentHp: () => 5, getNormalizedMaxHp: () => 10 }
              const tile = Object.assign(Object.create(internal.Tiles_Tile.Tile.prototype), {
                checkCanDefendUnit: () => canDefend, getDefenseAmount: () => 30, getTileTypeId: () => tileType,
                getGridIndex: () => new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0),
                getWar: () => ({ getGcData: () => config,
                  getWeatherManager: () => ({ getCurrentWeatherType: () => weatherType }),
                  getDamagePreviewSettings: () => ({ isEnabled: true,
                    settings: [{ playerIndex: 1, isForcedInCoZone: true }] }),
                }),
              })
              const matches = unitType === unitCategory.included && tileType === tileCategory.included
                && weatherType === weather.included
              assert.equal(tile.getDefenseAmountForUnit(unit, null, preview),
                matches && (onboard || preview || distance <= 1) ? 30 : 15)
              assert.equal(tile.getDefenseAmountForUnit(unit, new Set([1]), preview),
                matches && (onboard || preview) ? 30 : 15)
              assert.equal(getPanelTileDefense({ gameConfig: config, unitType, tileType, weatherType,
                unitHp: 50, coId: 1, coSkillType: internal.CoSkills_Constants.SkillTypeId.Passive }),
              matches ? 30 : 15)
              ids = [2]
              assert.equal(tile.getDefenseAmountForUnit(unit, null, preview), 15)
              ids = [0]
              canDefend = false
              assert.equal(tile.getDefenseAmountForUnit(unit, null, preview), 0)
              assert.equal(getPanelTileDefense({ gameConfig: config, unitType, tileType, weatherType,
                unitHp: 50, coId: 1, coSkillType: internal.CoSkills_Constants.SkillTypeId.Passive }), 0)
              canDefend = true
            }
          }
        }
      }
    }
  }
  const args = { gameConfig: config, unitType: unitCategory.included, tileType: tileCategory.included,
    weatherType: weather.included, unitHp: 50, coId: 1, coSkillType: internal.CoSkills_Constants.SkillTypeId.Passive }
  const common = skill.getPersistent().getSelfUnitCommonAttributes()
  let normalizedHp = 5
  const unit = { getUnitTypeId: () => args.unitType, getPlayer: () => player, getIsCoOnboard: () => false,
    getNormalizedCurrentHp: () => normalizedHp, getNormalizedMaxHp: () => 10 }
  const tile = Object.assign(Object.create(internal.Tiles_Tile.Tile.prototype), {
    checkCanDefendUnit: () => true, getDefenseAmount: () => 30, getTileTypeId: () => args.tileType,
    getGridIndex: () => origin,
    getWar: () => ({ getGcData: () => config,
      getWeatherManager: () => ({ getCurrentWeatherType: () => args.weatherType }),
      getDamagePreviewSettings: () => ({ isEnabled: false }),
    }),
  })
  for (const isEnabled of [undefined, false, true]) {
    const cfg = CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
      conditions, receiveFullTileDefenseWhenDamaged: { isEnabled },
    } } })
    const decoded = CoSkillCfg.decode(cfg.encode()).getPersistent().getSelfUnitCommonAttributes()
    assert.equal(decoded.getReceiveFullTileDefenseWhenDamaged().getIsEnabled(), isEnabled === true)
    common.setReceiveFullTileDefenseWhenDamaged(decoded.getReceiveFullTileDefenseWhenDamaged())
    assert.equal(getPanelTileDefense(args), isEnabled === true ? 30 : 15)
    assert.equal(tile.getDefenseAmountForUnit(unit, null, false), isEnabled === true ? 30 : 15)
    normalizedHp = 10
    assert.equal(tile.getDefenseAmountForUnit(unit, null, false), 30)
    normalizedHp = 5
  }
  common.setConditions(null)
  assert.equal(getPanelTileDefense(args), 15)
  assert.equal(tile.getDefenseAmountForUnit(unit, null, false), 15)
  common.setConditions(CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: { conditions } } })
    .getPersistent().getSelfUnitCommonAttributes().getConditions())
  common.setReceiveFullTileDefenseWhenDamaged(null)
  assert.equal(getPanelTileDefense(args), 15)
  assert.equal(tile.getDefenseAmountForUnit(unit, null, false), 15)
})

test('armor penetrations stack all six values using current tile, weather and common conditions', async () => {
  const { internal, gameConfig, raw, CoSkillCfg, getPanelOffensePierce } = await runtime
  const unitCategory = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(cfg => cfg.getUnitTypeId()),
    cfg => cfg.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
  const tileCategory = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    unitCategoryId: unitCategory.id, tileCategoryId: tileCategory.id, weatherCategoryId: weather.id }
  const fields = ['pierceTilePct', 'piercePromotionPct', 'pierceCoPct',
    'pierceGlobalTilePct', 'pierceRulePct', 'pierceWarEventPct']
  const values = [10, 20, 30, 40, 50, 60]
  const skills = [values, values.map(v => -v / 2)].map(values => CoSkillCfg.fromJson({
    persistent: { selfUnitCommonAttributes: {
      conditions, armorPenetrations: Object.fromEntries(fields.map((field, i) => [field, values[i]])),
    } },
  }))
  const config = Object.assign(Object.create(gameConfig), {
    getCoSkillCfg: id => skills[id],
    getCoBasicCfg: () => ({ getPassiveSkillIds: () => ids }),
  })
  const origin = new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)
  let ids = [0, 1, 2]
  const player = { getCoId: () => 1, getCoCurrentSkills: () => ids,
    getCoZoneRadius: () => 1, getCoGridIndexListOnMap: () => [origin] }
  for (const unitTypeId of [unitCategory.included, unitCategory.excluded]) {
    for (const tileTypeId of [tileCategory.included, tileCategory.excluded]) {
      for (const weatherTypeId of [weather.included, weather.excluded]) {
        for (const onboard of [false, true]) {
          for (const distance of [0, 1, 2]) {
            const grid = new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0)
            const unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
              getPlayer: () => player, getGcData: () => config, getUnitTypeId: () => unitTypeId,
              getIsCoOnboard: () => onboard,
              getWar: () => ({
                getTileMap: () => ({ getTile: actualGrid => {
                  assert.equal(actualGrid, grid)
                  return { getTileTypeId: () => tileTypeId }
                } }),
                getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }),
              }),
            })
            const enabled = unitTypeId === unitCategory.included && tileTypeId === tileCategory.included
              && weatherTypeId === weather.included && (onboard || distance <= 1)
            const penetrationValues = internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_ArmorPenetrations.getPenetrationValues({
              cfg: skills[0].getPersistent().getSelfUnitCommonAttributes(),
              gameConfig: config, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard: onboard,
              gridIndex: grid, coZoneRadius: 1, getCoGridIndexArrayOnMap: () => [origin],
            })
            assert.deepEqual(penetrationValues == null ? penetrationValues : Array.from(penetrationValues),
              enabled ? values : null)
            assert.deepEqual(Array.from(unit.getEffectiveOffensePierce(grid)),
              enabled ? values.map(v => v / 2) : values.map(() => 0))
            const panelEnabled = unitTypeId === unitCategory.included && tileTypeId === tileCategory.included
              && weatherTypeId === weather.included
            assert.deepEqual(Array.from(getPanelOffensePierce({
              gameConfig: config, weatherType: weatherTypeId,
              attackerData: { coId: 1, coSkillType: internal.CoSkills_Constants.SkillTypeId.Passive,
                unitType: unitTypeId, tileType: tileTypeId },
            })), panelEnabled ? values.map(v => v / 2) : values.map(() => 0))
            ids = []
            assert.deepEqual(Array.from(unit.getEffectiveOffensePierce(grid)), values.map(() => 0))
            ids = [0, 1, 2]
          }
        }
      }
    }
  }
  skills[0].getPersistent().getSelfUnitCommonAttributes().setConditions(null)
  skills[1].getPersistent().getSelfUnitCommonAttributes().setArmorPenetrations(null)
  const unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
    getPlayer: () => player, getGcData: () => config, getUnitTypeId: () => unitCategory.included,
    getIsCoOnboard: () => true,
    getWar: () => ({
      getTileMap: () => ({ getTile: () => ({ getTileTypeId: () => tileCategory.included }) }),
      getWeatherManager: () => ({ getCurrentWeatherType: () => weather.included }),
    }),
  })
  assert.deepEqual(Array.from(unit.getEffectiveOffensePierce(origin)), values.map(() => 0))
})

test('armor helper returns null for missing configuration, effect or conditions, but retains matching zero values', async () => {
  const { internal, gameConfig, raw, SelfUnitCommonAttributes } = await runtime
  const getPenetrationValues = internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_ArmorPenetrations.getPenetrationValues
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    unitCategoryId: 1, tileCategoryId: 1, weatherCategoryId: 1 }
  const origin = new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)
  const args = { gameConfig, unitTypeId: raw.getUnitTemplate()[0].getUnitTypeId(),
    tileTypeId: raw.getTileTemplate()[0].getTileTypeId(), weatherTypeId: raw.getWeather()[0].getWeatherTypeId(),
    isCoOnboard: false, gridIndex: origin, coZoneRadius: 1, getCoGridIndexArrayOnMap: () => [origin] }
  for (const cfg of [undefined, null,
    SelfUnitCommonAttributes.fromJson({ conditions }),
    SelfUnitCommonAttributes.fromJson({ armorPenetrations: { pierceTilePct: 10 } })]) {
    assert.equal(getPenetrationValues({ ...args, cfg }), null)
  }
  const cfg = SelfUnitCommonAttributes.fromJson({ conditions, armorPenetrations: { pierceTilePct: 0 } })
  assert.deepEqual(Array.from(getPenetrationValues({ ...args, cfg })), [0, 0, 0, 0, 0, 0])
})

test('tile move costs use destination categories and common area conditions, including the CO-only area exemption', async () => {
  const { internal, gameConfig, raw, CoSkillCfg } = await runtime
  const unitCategory = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(cfg => cfg.getUnitTypeId()),
    cfg => cfg.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
  const tileCategory = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const skill = CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    conditions: { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
      unitCategoryId: unitCategory.id, tileCategoryId: tileCategory.id, weatherCategoryId: weather.id },
    moveCosts: { fixedCost: 1 },
  } } })
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: () => skill })
  const origin = new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)
  const player = { getCoCurrentSkills: () => [0], getCoZoneRadius: () => 1, getCoGridIndexListOnMap: () => [origin] }
  for (const unitTypeId of [unitCategory.included, unitCategory.excluded]) {
    for (const tileTypeId of [tileCategory.included, tileCategory.excluded]) {
      for (const weatherTypeId of [weather.included, weather.excluded]) {
        for (const onboard of [false, true]) {
          for (const distance of [0, 1, 2]) {
            const unit = { getUnitTypeId: () => unitTypeId, getTeamIndex: () => 1,
              getForbiddenGroupedLocationIdArray: () => [], getMoveTypeId: () => 1,
              getPlayer: () => player, getIsCoOnboard: () => onboard }
            const tile = Object.assign(Object.create(internal.Tiles_Tile.Tile.prototype), {
              getTeamIndex: () => 1, getGroupedLocationIdArray: () => [], getMoveCostByMoveType: () => 3,
              getTileTypeId: () => tileTypeId, getGridIndex: () => new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0),
              getWar: () => ({ getGcData: () => config, getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }) }),
            })
            const enabled = unitTypeId === unitCategory.included && tileTypeId === tileCategory.included
              && weatherTypeId === weather.included && (onboard || distance <= 1)
            assert.equal(tile.getMoveCostByUnit(unit), enabled ? 1 : 3)
          }
        }
      }
    }
  }
})

test('tile move costs preserve first-match ordering, zero costs and impassability', async () => {
  const { internal, gameConfig, raw, CoSkillCfg } = await runtime
  const conditions = { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
    unitCategoryId: 1, tileCategoryId: 1, weatherCategoryId: 1 }
  const skills = [2, 0].map(fixedCost => CoSkillCfg.fromJson({
    persistent: { selfUnitCommonAttributes: { conditions, moveCosts: { fixedCost } } },
  }))
  let ids = [0, 1]
  let rawCost = 3
  let enemy = false
  let forbidden = []
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: id => skills[id] })
  const player = { getCoCurrentSkills: () => ids, getCoZoneRadius: () => 1,
    getCoGridIndexListOnMap: () => [new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)] }
  const unit = { getUnitTypeId: () => raw.getUnitTemplate()[0].getUnitTypeId(), getTeamIndex: () => 1,
    getForbiddenGroupedLocationIdArray: () => forbidden, getMoveTypeId: () => 1,
    getPlayer: () => player, getIsCoOnboard: () => false }
  const tile = Object.assign(Object.create(internal.Tiles_Tile.Tile.prototype), {
    getTeamIndex: () => enemy ? 2 : 1, checkCanBlockEnemyUnitType: () => true,
    getGroupedLocationIdArray: () => [1], getMoveCostByMoveType: () => rawCost,
    getTileTypeId: () => raw.getTileTemplate()[0].getTileTypeId(),
    getGridIndex: () => new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0),
    getWar: () => ({ getGcData: () => config,
      getWeatherManager: () => ({ getCurrentWeatherType: () => raw.getWeather()[0].getWeatherTypeId() }) }),
  })
  assert.equal(tile.getMoveCostByUnit(unit), 2)
  ids = [1, 0]
  assert.equal(tile.getMoveCostByUnit(unit), 0)
  ids = [0]
  rawCost = 1
  assert.equal(tile.getMoveCostByUnit(unit), 1)
  rawCost = null
  assert.equal(tile.getMoveCostByUnit(unit), null)
  rawCost = 3
  forbidden = [1]
  assert.equal(tile.getMoveCostByUnit(unit), null)
  forbidden = []
  enemy = true
  assert.equal(tile.getMoveCostByUnit(unit), null)
  enemy = false
  skills[0].getPersistent().getSelfUnitCommonAttributes().setMoveCosts(null)
  assert.equal(tile.getMoveCostByUnit(unit), 3)
  ids = [1]
  skills[1].getPersistent().getSelfUnitCommonAttributes().getMoveCosts().setFixedCost(null)
  assert.throws(() => tile.getMoveCostByUnit(unit))
  skills[1].getPersistent().getSelfUnitCommonAttributes().setConditions(null)
  assert.equal(tile.getMoveCostByUnit(unit), 3)
})

test('move-cost serialization distinguishes explicitly zero cost from a missing fixedCost', async () => {
  const { SelfUnitCommonAttributes } = await runtime
  for (const fixedCost of [undefined, 0, 1]) {
    const cfg = SelfUnitCommonAttributes.fromJson({ moveCosts: { fixedCost } })
    const decoded = SelfUnitCommonAttributes.decode(cfg.encode()).getMoveCosts()
    assert.equal(decoded.checkHasFixedCost(), fixedCost !== undefined)
    if (fixedCost === undefined) assert.equal(decoded.getFixedCost() == null, true)
    else assert.equal(decoded.getFixedCost(), fixedCost)
  }
})

test('migrated move-cost skills preserve weather filters and do not modify shared all-CO skills', async () => {
  const { internal, FullConfig } = await runtime
  for (const version of ['A0000000', 'B0000000', 'B0000001', 'B0000002', 'C0000000', 'D0000000']) {
    const raw = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
    const config = new internal.GameConfigs_GameConfig.GameConfig(version, raw)
    const sharedSkill = config.getCoSkillCfg(99999999)
    if (version.startsWith('D')) assert.ok(sharedSkill)
    assert.equal(sharedSkill?.getPersistent()?.getSelfUnitCommonAttributes()?.getMoveCosts() ?? null, null)
    if (!version.startsWith('B') && !version.startsWith('D')) continue
    const co = config.getCoBasicCfg(43000)
    for (const ids of [co.getPassiveSkillIds(), co.getSuperPowerSkillIds()]) {
      const player = { getCoCurrentSkills: () => ids, getCoZoneRadius: () => 1,
        getCoGridIndexListOnMap: () => [new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)] }
      const unit = { getUnitTypeId: () => raw.getUnitTemplate()[0].getUnitTypeId(), getTeamIndex: () => 1,
        getForbiddenGroupedLocationIdArray: () => [], getMoveTypeId: () => 1,
        getPlayer: () => player, getIsCoOnboard: () => false }
      for (const weather of raw.getWeather()) {
        const weatherTypeId = weather.getWeatherTypeId()
        const tile = Object.assign(Object.create(internal.Tiles_Tile.Tile.prototype), {
          getTeamIndex: () => 1, getGroupedLocationIdArray: () => [], getMoveCostByMoveType: () => 3,
          getTileTypeId: () => raw.getTileTemplate()[0].getTileTypeId(),
          getGridIndex: () => new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0),
          getWar: () => ({ getGcData: () => config, getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId }) }),
        })
        const enabled = version.startsWith('D') || config.checkIsWeatherTypeInCategory(weatherTypeId, 4)
        assert.equal(tile.getMoveCostByUnit(unit), enabled ? 1 : 3, `${version}: weather ${weatherTypeId}`)
      }
    }
  }
})

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

test('both vision effects match common attribute conditions; CO units bypass only area, not categories', async () => {
  const { internal, gameConfig, raw, SelfUnitCommonAttributes } = await runtime
  const unit = categoryFixture(raw.getUnitCategory(), raw.getUnitTemplate().map(cfg => cfg.getUnitTypeId()),
    cfg => cfg.getUnitCategoryId(), (type, id) => gameConfig.checkIsUnitTypeInCategory(type, id))
  const tile = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const vision = internal.CoSkills_Utils_Persistent_Visions
  for (const coSkillAreaTypeId of Object.values(internal.CoSkills_Constants.AreaTypeId).filter(v => typeof v === 'number')) {
    const conditions = { coSkillAreaTypeId, unitCategoryId: unit.id, tileCategoryId: tile.id, weatherCategoryId: weather.id }
    const cfg = SelfUnitCommonAttributes.fromJson({ conditions, visions: { rangeOffset: -1, canSeeThrough: true } })
    const common = SelfUnitCommonAttributes.fromJson({ conditions, moveRangeOffsets: { offset: -1 } })
    for (const unitTypeId of [unit.included, unit.excluded]) {
      for (const tileTypeId of [tile.included, tile.excluded]) {
        for (const weatherTypeId of [weather.included, weather.excluded]) {
          for (const isCoOnboard of [false, true]) {
            for (const distance of [0, 1, 2, 5]) {
              const args = { gameConfig, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard,
                gridIndex: new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0), coZoneRadius: 1,
                getCoGridIndexArrayOnMap: () => [new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)] }
              const expected = unitTypeId === unit.included && tileTypeId === tile.included
                && weatherTypeId === weather.included && (isCoOnboard || args.gridIndex.checkIsInsideCoSkillArea({
                  coSkillAreaType: coSkillAreaTypeId, coZoneRadius: 1, getCoGridIndexArrayOnMap: args.getCoGridIndexArrayOnMap,
                }))
              assert.equal(vision.getTotalRangeOffset({ ...args, cfg }), expected ? -1 : 0)
              assert.equal(vision.checkCanSeeThrough({ ...args, cfg }), expected)
              assert.equal(vision.getTotalRangeOffset({ ...args, cfg }),
                internal.CoSkills_Utils_Persistent_SelfUnitMoveRange.getTotalOffset({ ...args, cfg: common }))
            }
          }
        }
      }
    }
  }
  const args = { gameConfig, unitTypeId: unit.included, tileTypeId: tile.included,
    weatherTypeId: weather.included, isCoOnboard: true }
  for (const cfg of [null, SelfUnitCommonAttributes.fromJson({ visions: { rangeOffset: 2, canSeeThrough: true } }),
    SelfUnitCommonAttributes.fromJson({ conditions: { coSkillAreaTypeId: 0, unitCategoryId: 1, tileCategoryId: 1,
      weatherCategoryId: 1 }, attackRangeOffsets: { upperOffset: 2 } })]) {
    assert.equal(vision.getTotalRangeOffset({ ...args, cfg }), 0)
    assert.equal(vision.checkCanSeeThrough({ ...args, cfg }), false)
  }
  const all = SelfUnitCommonAttributes.fromJson({ conditions: { coSkillAreaTypeId: 0, unitCategoryId: 1, tileCategoryId: 1,
    weatherCategoryId: 1 }, visions: { rangeOffset: 2, canSeeThrough: true } })
  assert.equal(vision.getTotalRangeOffset({ ...args, cfg: all }), 2)
  assert.equal(vision.checkCanSeeThrough({ ...args, cfg: all }), true)
  all.getVisions().setRangeOffset(0)
  assert.equal(vision.getTotalRangeOffset({ ...args, cfg: all }), 0)
  assert.equal(vision.checkCanSeeThrough({ ...args, cfg: all }), true)
  all.getVisions().setRangeOffset(-2)
  all.getVisions().setCanSeeThrough(false)
  assert.equal(vision.getTotalRangeOffset({ ...args, cfg: all }), -2)
  assert.equal(vision.checkCanSeeThrough({ ...args, cfg: all }), false)
})

test('unit vision passes its own tile and current weather to stacked range and penetrating effects', async () => {
  const { internal, gameConfig, raw, CoSkillCfg } = await runtime
  const tile = categoryFixture(raw.getTileCategory(), raw.getTileTemplate().map(cfg => cfg.getTileTypeId()),
    cfg => cfg.getTileCategoryId(), (type, id) => gameConfig.checkIsTileTypeInCategory(type, id))
  const weather = categoryFixture(raw.getWeatherCategory(), raw.getWeather().map(cfg => cfg.getWeatherTypeId()),
    cfg => cfg.getWeatherCategoryId(), (type, id) => gameConfig.checkIsWeatherTypeInCategory(type, id))
  const skills = [2, -1].map(rangeOffset => CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    conditions: { coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone, unitCategoryId: 1,
      tileCategoryId: tile.id, weatherCategoryId: weather.id }, visions: { rangeOffset, canSeeThrough: true },
  } } }))
  const config = Object.assign(Object.create(gameConfig), { getCoSkillCfg: id => skills[id] })
  let tileTypeId = tile.included
  let weatherTypeId = weather.included
  let distance = 0
  let onboard = false
  const player = { getCoId: () => 1, getCoZoneRadius: () => 1, getCoCurrentSkills: () => [0, 1],
    getCoGridIndexListOnMap: () => [new internal.AuxiliaryTypes_GridIndex.GridIndex(0, 0)] }
  const unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
    getPlayer: () => player, getGcData: () => config, getCfgVisionRange: () => 3, getPlayerIndex: () => 1,
    getUnitTypeId: () => raw.getUnitTemplate()[0].getUnitTypeId(), getIsCoOnboard: () => onboard,
    getGridIndex: () => new internal.AuxiliaryTypes_GridIndex.GridIndex(distance, 0),
    getWar: () => ({
      getTileMap: () => ({ getTile: grid => { assert.equal(grid.getX(), distance); return { getTileTypeId: () => tileTypeId } } }),
      getWeatherManager: () => ({ getCurrentWeatherType: () => weatherTypeId, getCurrentWeatherCfg: () => null }),
      getCommonSettingManager: () => ({ getPlayerRule: () => ({ getUnitVisionRangeModifier: () => 0 }) }),
      getWarEventManager: () => ({ getOpaUnitVisionRangeModifier: () => 0, getOpaIsPenetratingVision: () => null }),
    }),
  })
  const check = enabled => {
    const info = unit.getVisionInfo()
    assert.equal(info.baseRange, enabled ? 4 : 3)
    assert.equal(info.isPenetrating, enabled)
  }
  check(true)
  tileTypeId = tile.excluded
  check(false)
  onboard = true
  check(false)
  tileTypeId = tile.included
  weatherTypeId = weather.excluded
  check(false)
  weatherTypeId = weather.included
  distance = 5
  onboard = false
  check(false)
  onboard = true
  check(true)
  for (const skill of skills) {
    skill.getPersistent().getSelfUnitCommonAttributes().getConditions().setTileCategoryId(1)
    skill.getPersistent().getSelfUnitCommonAttributes().getConditions().setWeatherCategoryId(1)
  }
  tileTypeId = tile.excluded
  weatherTypeId = weather.excluded
  check(true)
})

test('merged vision skills retain selective infantry vision without duplicating the all-unit common effect', async () => {
  const { internal, FullConfig } = await runtime
  for (const version of ['A0000000', 'B0000000', 'B0000001', 'B0000002', 'C0000000', 'D0000000']) {
    const raw = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
    const gameConfig = new internal.GameConfigs_GameConfig.GameConfig(version, raw)
    const ids = gameConfig.getCoBasicCfg(10000).getSuperPowerSkillIds()
    for (const unit of raw.getUnitTemplate()) {
      const args = { gameConfig, unitTypeId: unit.getUnitTypeId(), tileTypeId: raw.getTileTemplate()[0].getTileTypeId(),
        weatherTypeId: raw.getWeather()[0].getWeatherTypeId(), isCoOnboard: true }
      const expected = gameConfig.checkIsUnitTypeInCategory(args.unitTypeId, 2)
      const calculate = id => ({ ...args, cfg: gameConfig.getCoSkillCfg(id).getPersistent()?.getSelfUnitCommonAttributes() })
      assert.equal(ids.reduce((sum, id) => sum + internal.CoSkills_Utils_Persistent_Visions.getTotalRangeOffset(calculate(id)), 0),
        expected ? 2 : 0, `${version}: vision range`)
      assert.equal(ids.some(id => internal.CoSkills_Utils_Persistent_Visions.checkCanSeeThrough(calculate(id))),
        expected, `${version}: penetrating vision`)
    }
  }
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
