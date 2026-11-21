import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { loadModules } from './helpers/load-modules.mjs'

const runtime = (async () => {
  const schemaFile = fileURLToPath(new URL('../src/proto/schema/CommonProto/Config/CoSkillCfg.ts', import.meta.url))
  const module = await loadModules(schemaFile)
  const { CoSkillCfg } = await module(schemaFile)
  const { SelfUnitCommonAttributes } = await module(fileURLToPath(new URL(
    '../src/proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes.ts', import.meta.url)))
  const internal = {
    Helpers_Misc: {
      getExisted: value => { assert.notEqual(value, undefined); assert.notEqual(value, null); return value },
      createLazyFunc: fn => { let value; return () => value ??= fn() },
    },
  }
  function loadSource(filename, functions) {
    let source = readFileSync(new URL(`../src/${filename}.ts`, import.meta.url), 'utf8')
    if (functions) {
      const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true)
      source = ast.statements.filter(node => ts.isFunctionDeclaration(node) && functions.includes(node.name?.text))
        .map(node => node.getText(ast)).join('\n')
      source += `\nexport { ${functions.join(', ')} };`
    }
    const compiled = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.CommonJS },
    }).outputText
    const context = { ...internal, exports: {}, require: specifier => {
      assert.ok(specifier.endsWith('/internal.ts'))
      return internal
    } }
    vm.runInNewContext(compiled, context)
    return context.exports
  }
  internal.CoSkills_Constants = loadSource('coSkills/Constants')
  internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions =
    loadSource('coSkills/utils/persistent/selfUnitCommonAttributes/Conditions')
  internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_ImmuneToWeathers =
    loadSource('coSkills/utils/persistent/selfUnitCommonAttributes/ImmuneToWeathers')
  internal.AuxiliaryTypes_UnitVisionInfo = loadSource('auxiliaryTypes/UnitVisionInfo')
  const { Unit } = loadSource('units/Unit')
  const calculator = loadSource('common/view/CommonDamageCalculatorPanel', ['getCoSkillIdArray', 'getAttackModifierByWeather'])
  return { CoSkillCfg, SelfUnitCommonAttributes, Unit, calculator, internal }
})()

test('weather immunity defaults to false and survives protocol round trips', async () => {
  const { SelfUnitCommonAttributes } = await runtime
  for (const isImmune of [undefined, false, true]) {
    const cfg = SelfUnitCommonAttributes.fromJson({
      conditions: { weatherCategoryId: 9 }, immuneToWeathers: { isImmune },
    })
    const decoded = SelfUnitCommonAttributes.decode(cfg.encode())
    assert.equal(decoded.getImmuneToWeathers().getIsImmune(), isImmune === true)
    assert.equal(decoded.getConditions().getWeatherCategoryId(), 9)
  }
})

test('attack, movement, vision and calculator immunity require true and matching current weather', async () => {
  const { CoSkillCfg, Unit, calculator, internal } = await runtime
  let skills
  let weatherType = 3
  let inArea = true
  let onboard = false
  let previewForced = false
  let unitType = 1
  let tileType = 1
  const grid = { checkIsInsideCoSkillArea: () => inArea }
  const weather = {
    getOffenseBonus: () => [1, 1, -20],
    getMovementBonus: () => [1, 1, -2],
    getUnitVisionFixed: () => [1, 1, 1],
  }
  const config = {
    getCoSkillCfg: id => skills[id],
    getWeatherCfg: () => weather,
    getCoBasicCfg: () => ({ getPassiveSkillIds: () => skills.map((_, id) => id) }),
    checkIsUnitTypeInCategory: (type, category) => category === 1 || (category === 8 && type === 1),
    checkIsTileTypeInCategory: (type, category) => category === 1 || (category === 8 && type === 1),
    checkIsWeatherTypeInCategory: (type, category) => category === 9 && type === 3,
  }
  const player = {
    getPlayerIndex: () => 0, getCoZoneRadius: () => 1,
    getCoCurrentSkills: () => skills.map((_, id) => id), getCoGridIndexListOnMap: () => [],
  }
  const war = {
    getGcData: () => config,
    getTileMap: () => ({ getTile: () => ({ getTileTypeId: () => tileType }) }),
    getWeatherManager: () => ({ getCurrentWeatherType: () => weatherType, getCurrentWeatherCfg: () => weather }),
    getDamagePreviewSettings: () => ({
      isEnabled: previewForced, settings: [{ playerIndex: 0, isForcedInCoZone: true }],
    }),
    getCommonSettingManager: () => ({ getPlayerRule: () => ({ getUnitVisionRangeModifier: () => 0 }) }),
    getWarEventManager: () => ({ getOpaUnitVisionRangeModifier: () => 0 }),
  }
  const unit = Object.assign(Object.create(Unit.prototype), {
    getWar: () => war, getPlayer: () => player, getUnitTypeId: () => unitType,
    getIsCoOnboard: () => onboard, getGridIndex: () => grid, getCfgVisionRange: () => 5,
    _getVisionRangeModifierByCo: () => 0, _checkVisionCanSeeThrough: () => false,
  })
  function skill(isImmune) {
    return CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
      conditions: {
        coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
        unitCategoryId: 8, tileCategoryId: 8, weatherCategoryId: 9,
      },
      immuneToWeathers: { isImmune },
    } } })
  }
  function check(expected, calculatorExpected = expected) {
    assert.equal(unit.getAttackModifierByWeather(grid, null, false), expected ? 0 : -20)
    assert.equal(unit._getMoveRangeModifierByWeather(), expected ? 0 : -2)
    assert.equal(unit.getVisionInfo().isFixed, !expected)
    assert.equal(unit.getVisionInfo().baseRange, expected ? 5 : 1)
    assert.equal(calculator.getAttackModifierByWeather({
      gameConfig: config, weatherType,
      attackerData: { unitType, tileType, coId: 1, coSkillType: internal.CoSkills_Constants.SkillTypeId.Passive },
    }), calculatorExpected ? 0 : -20)
  }
  for (const isImmune of [undefined, false, true]) {
    skills = [skill(isImmune)]
    weatherType = 3
    check(isImmune === true)
    weatherType = 4
    check(false)
  }
  weatherType = 3
  skills = [skill(false), skill(true)]
  check(true)
  unitType = 2
  check(false)
  unitType = 1
  tileType = 2
  check(false)
  tileType = 1
  inArea = false
  check(false, true)
  previewForced = true
  assert.equal(unit.getAttackModifierByWeather(grid, null, true), 0)
  assert.equal(unit.getAttackModifierByWeather(grid, null, false), -20)
  unitType = 2
  assert.equal(unit.getAttackModifierByWeather(grid, null, true), -20)
  unitType = 1
  previewForced = false
  onboard = true
  check(true)
  weatherType = 4
  check(false)
  weatherType = 3
  skills = [skill(false)]
  check(false)
  skills = [CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    immuneToWeathers: { isImmune: true },
  } } })]
  check(false)
  skills = [CoSkillCfg.fromJson({ persistent: { selfUnitCommonAttributes: {
    conditions: {
      coSkillAreaTypeId: internal.CoSkills_Constants.AreaTypeId.Zone,
      unitCategoryId: 8, tileCategoryId: 8, weatherCategoryId: 9,
    },
    captureAmounts: { offsetPct: 20 },
  } } })]
  check(false)
  skills = []
  check(false)
})
