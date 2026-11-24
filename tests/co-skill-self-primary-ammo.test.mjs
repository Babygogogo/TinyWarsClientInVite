import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { loadModules } from './helpers/load-modules.mjs'

test('manual primary ammo uses shared conditions and keeps the two percentage bases', async () => {
  const internal = {
    Helpers_Misc: { getExisted: value => value },
    AuxiliaryTypes_ChangedThingsForWarOperation: {
      ChangedThingsForWarOperation: class {
        units = []
        addUnit(unit) { this.units.push(unit) }
      },
    },
  }
  function load(name) {
    const source = readFileSync(new URL(`../src/coSkills/utils/instantManual/${name}.ts`, import.meta.url), 'utf8')
    const compiled = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.CommonJS },
    }).outputText
    const exports = {}
    vm.runInNewContext(compiled, { exports, require: () => internal })
    return exports
  }
  internal.CoSkills_Utils_InstantManual_Conditions = load('Conditions')
  const { executeAsLocalWar } = load('SelfPrimaryAmmo')
  const schema = fileURLToPath(new URL('../src/proto/schema/CommonProto/Config/CoSkillCfg.ts', import.meta.url))
  const { CoSkillCfg } = await (await loadModules(schema))(schema)
  const conditions = { coSkillAreaTypeId: 2, unitCategoryId: 1, tileCategoryId: 2, weatherCategoryId: 3, unitLoadedStateId: 2 }

  function createUnit({ owner = 1, inArea = true, tile = 2, loaded = false, maxAmmo = 8 } = {}) {
    return {
      offsets: [],
      getPlayerIndex: () => owner,
      getUnitTypeId: () => 1,
      getGridIndex: () => ({ tile, checkIsInsideCoSkillArea: () => inArea }),
      getIsCoOnboard: () => true,
      checkIsMeetLoadedState: state => state === 2 && !loaded,
      getPrimaryWeaponMaxAmmo: () => maxAmmo,
      getPrimaryWeaponCurrentAmmo: () => 4,
      addAndValidatePrimaryWeaponCurrentAmmo(offset) { this.offsets.push(offset) },
    }
  }
  for (const [offsetPct, weather, expected] of [[50, 3, [4]], [-50, 3, [-2]], [50, 1, []], [undefined, 3, []]]) {
    const target = createUnit()
    const excluded = [
      createUnit({ owner: 2 }), createUnit({ inArea: false }), createUnit({ tile: 1 }),
      createUnit({ loaded: true }), createUnit({ maxAmmo: null }),
    ]
    const war = {
      getGcData: () => ({
        checkIsUnitTypeInCategory: (type, category) => type === category,
        checkIsTileTypeInCategory: (type, category) => type === category,
        checkIsWeatherTypeInCategory: (type, category) => type === category,
      }),
      getTileMap: () => ({ getTile: grid => ({ getTileTypeId: () => grid.tile }) }),
      getWeatherManager: () => ({ getCurrentWeatherType: () => weather }),
      getUnitMap: () => ({ getAllUnits: () => [target, ...excluded] }),
    }
    const result = executeAsLocalWar({
      skillCfg: CoSkillCfg.fromJson({ instantManual: { unitAttributes: { conditions, selfPrimaryAmmo: { offsetPct } } } }),
      player: { getPlayerIndex: () => 1, getWar: () => war },
      skillUserCoGridIndexList: [], skillUserCoZoneRadius: 2, isFastExecute: true,
    })
    assert.deepEqual(target.offsets, expected)
    assert.deepEqual(result.units, expected.length ? [target] : [])
    for (const unit of excluded) assert.deepEqual(unit.offsets, [])
  }
})
