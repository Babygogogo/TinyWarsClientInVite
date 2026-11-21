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
  for (const name of ['Config/FullConfig', 'Config/CoSkillCfg', 'Structure/GridIndex',
    'Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes']) {
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
    CoSkills_Constants: 'coSkills/Constants', Cos_Constants: 'cos/Constants',
    Geometries_Constants: 'geometries/Constants', Numbers_Constants: 'numbers/Constants',
    AuxiliaryTypes_GridIndex: 'auxiliaryTypes/GridIndex',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions: 'coSkills/utils/persistent/selfUnitCommonAttributes/Conditions',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_CoBoardingPermissions: 'coSkills/utils/persistent/selfUnitCommonAttributes/CoBoardingPermissions',
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_CoBoardingCosts: 'coSkills/utils/persistent/selfUnitCommonAttributes/CoBoardingCosts',
    Units_Unit: 'units/Unit',
  })) internal[name] = loadSource(filename)
  return { ...proto, internal, GridIndex: internal.AuxiliaryTypes_GridIndex.GridIndex,
    board: internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_CoBoardingPermissions.checkCanCoBoard }
})()

const gameConfig = {
  checkIsUnitTypeInCategory: (type, category) => category === 1 || category === 7 && type === 11,
  checkIsTileTypeInCategory: (type, category) => category === 1 || category === 8 && type === 12,
  checkIsWeatherTypeInCategory: (type, category) => category === 1 || category === 9 && type === 13,
}

test('boarding shares category and zone conditions; ownership remains effect-specific and CO bypasses only area', async () => {
  const { SelfUnitCommonAttributes, GridIndex, board, internal } = await runtime
  const conditions = { coSkillAreaTypeId: 0, unitCategoryId: 7, tileCategoryId: 8, weatherCategoryId: 9 }
  const cfg = SelfUnitCommonAttributes.fromJson({ conditions, coBoardingPermissions: { conIsOwnTile: false, actCanBoard: true } })
  const costCfg = SelfUnitCommonAttributes.fromJson({ conditions, coBoardingCosts: { multiplierPct: 0 } })
  for (const unitTypeId of [11, 21]) for (const tileTypeId of [12, 22]) for (const weatherTypeId of [13, 23]) {
    for (const isCoOnboard of [false, true]) for (const distance of [0, 1, 2]) {
      const args = { cfg, gameConfig, unitTypeId, tileTypeId, weatherTypeId, isCoOnboard,
        gridIndex: new GridIndex(distance, 0), coZoneRadius: 1,
        getCoGridIndexArrayOnMap: () => [new GridIndex(0, 0)] }
      const matches = unitTypeId === 11 && tileTypeId === 12 && weatherTypeId === 13 && (isCoOnboard || distance <= 1)
      assert.equal(board({ ...args, isOwnTile: false }), matches ? true : null)
      assert.equal(board({ ...args, isOwnTile: true }), null)
      assert.equal(internal.CoSkills_Utils_Persistent_SelfUnitCommonAttributes_CoBoardingCosts.getMultiplierPct({
        ...args, cfg: costCfg,
      }), matches ? 0 : 100)
    }
  }
})

test('false boarding flags survive serialization; absent effects fall through and invalid flags fail explicitly', async () => {
  const { SelfUnitCommonAttributes, GridIndex, board } = await runtime
  const conditions = { coSkillAreaTypeId: 2, unitCategoryId: 1, tileCategoryId: 1, weatherCategoryId: 1 }
  const args = { gameConfig, unitTypeId: 11, tileTypeId: 12, weatherTypeId: 13,
    isCoOnboard: false, isOwnTile: true, gridIndex: new GridIndex(100, 100),
    coZoneRadius: 0, getCoGridIndexArrayOnMap: () => [] }
  const original = SelfUnitCommonAttributes.fromJson({ conditions, coBoardingPermissions: { conIsOwnTile: false, actCanBoard: false } })
  const cfg = original.clone()
  assert.equal(cfg.getCoBoardingPermissions().checkHasActCanBoard(), true)
  assert.equal(cfg.getCoBoardingPermissions().getActCanBoard(), false)
  assert.equal(cfg.getCoBoardingPermissions().getConIsOwnTile(), false)
  assert.equal(board({ ...args, cfg, isOwnTile: false }), false)
  assert.equal(board({ ...args, cfg }), null)
  cfg.getCoBoardingPermissions().setConIsOwnTile(null)
  assert.equal(board({ ...args, cfg }), false)
  for (const absent of [null, SelfUnitCommonAttributes.fromJson({ conditions }),
    SelfUnitCommonAttributes.fromJson({ coBoardingPermissions: { actCanBoard: true } })]) {
    assert.equal(board({ ...args, cfg: absent }), null)
  }
  cfg.getCoBoardingPermissions().setActCanBoard(null)
  assert.throws(() => board({ ...args, cfg }))
  cfg.getCoBoardingPermissions().setActCanBoard(true)
  cfg.getConditions().setCoSkillAreaTypeId(1)
  assert.equal(board({ ...args, cfg }), null)
  cfg.getConditions().setCoSkillAreaTypeId(2)
  assert.equal(board({ ...args, cfg }), true)
})

test('unit boarding uses destination, weather and ordered first-match flags before tile fallback', async () => {
  const { CoSkillCfg, GridIndex, internal } = await runtime
  const destination = new GridIndex(1, 0)
  const conditions = { coSkillAreaTypeId: 0, unitCategoryId: 7, tileCategoryId: 8, weatherCategoryId: 9 }
  const skills = [false, true].map(actCanBoard => CoSkillCfg.fromJson({
    persistent: { selfUnitCommonAttributes: { conditions, coBoardingPermissions: { actCanBoard } } },
  }))
  let ids = [0, 1], weather = 13, owner = 2, fallbackCalls = 0
  internal.Tiles_Utils_Common = { checkCanCoBoard: () => { fallbackCalls++; return true } }
  const config = { ...gameConfig, getCoSkillCfg: id => skills[id] }
  const tile = { getTileTypeId: () => 12, getPlayerIndex: () => owner,
    getTemplateCfg: () => null, getCustomBuildingData: () => null }
  const player = { getCoMaxBoardCount: () => 1, getCoId: () => 1, getCoIsDestroyedInTurn: () => false,
    getFund: () => 100, getCoCurrentSkills: () => ids, getCoZoneRadius: () => 1,
    getCoGridIndexListOnMap: () => [new GridIndex(0, 0)] }
  const war = { getPlayer: () => player, getTileMap: () => ({ getTile: grid => {
    assert.equal(grid, destination)
    return tile
  } }), getWeatherManager: () => ({ getCurrentWeatherType: () => weather }),
  getCommonSettingManager: () => ({ getPlayerRule: () => ({ getCanCoBoard: () => true }) }),
  getUnitMap: () => ({ getAllCoUnits: () => [] }) }
  const unit = Object.assign(Object.create(internal.Units_Unit.Unit.prototype), {
    getWar: () => war, getPlayerIndex: () => 1, getLoaderUnitId: () => null,
    getIsCoOnboard: () => false, getCoBoardingCost: () => 0, getGcData: () => config,
    getUnitTypeId: () => 11, getGridIndex: () => new GridIndex(100, 100),
  })
  const check = () => unit.checkCanCoBoardAfterMovePath([destination])
  assert.equal(check(), false)
  ids = [1, 0]
  assert.equal(check(), true)
  weather = 23
  assert.equal(check(), false)
  owner = 1
  assert.equal(check(), true)
  assert.equal(fallbackCalls, 1)
  assert.equal(unit.checkCanCoBoardAfterMovePath([destination, destination]), false)
})

test('all migrated versions retain global boarding even before a CO is deployed', async () => {
  const { FullConfig, GridIndex, board } = await runtime
  for (const version of ['A0000000', 'B0000000', 'B0000001', 'B0000002', 'C0000000', 'D0000000']) {
    const raw = FullConfig.decode(readFileSync(new URL(`../src/assets/resource/config/FullConfig${version}.bin`, import.meta.url)))
    const skills = raw.getCoSkill()
    const byId = new Map(skills.map(s => [s.getSkillId(), s]))
    const effects = skills.map(s => s.getPersistent()?.getSelfUnitCommonAttributes()).filter(s => s?.getCoBoardingPermissions())
    assert.equal(effects.length, version.startsWith('B') ? 6 : 2)
    for (const cfg of effects) {
      assert.equal(cfg.getConditions().getCoSkillAreaTypeId(), 2)
      assert.equal(cfg.getCoBoardingPermissions().checkHasActCanBoard(), true)
      if (cfg.getCoBoardingPermissions().getActCanBoard()) {
        assert.equal(board({ cfg, gameConfig, unitTypeId: 21, tileTypeId: 22, weatherTypeId: 23,
          isOwnTile: false, isCoOnboard: false, gridIndex: new GridIndex(100, 100),
          coZoneRadius: 0, getCoGridIndexArrayOnMap: () => [] }), true)
      }
    }
    for (const co of raw.getCoBasic()) {
      for (const ids of [co.getPassiveSkillIds(), co.getPowerSkillIds(), co.getSuperPowerSkillIds()]) {
        assert.equal(new Set(ids).size, ids.length)
        for (const id of ids) assert.ok(byId.has(id), `${version}: missing ${id}`)
      }
    }
  }
})
