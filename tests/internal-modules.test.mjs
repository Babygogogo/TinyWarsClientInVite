import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import ts from 'typescript'
import { loadInternalModules } from './helpers/load-modules.mjs'

const sourceDirectory = fileURLToPath(new URL('../src/', import.meta.url))
const internalFile = path.join(sourceDirectory, 'internal.ts')

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === 'proto') return []
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? filesIn(filename) : filename.endsWith('.ts') ? [filename] : []
  })
}

test('all implementation modules are covered by the ordered internal entry point', () => {
  const source = ts.createSourceFile(internalFile, readFileSync(internalFile, 'utf8'), ts.ScriptTarget.Latest, true)
  for (const statement of source.statements) {
    assert.ok(
      ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamespaceExport(statement.exportClause) && statement.moduleSpecifier,
      'internal.ts must contain only export * as namespace from module declarations',
    )
  }
  const exportedFiles = new Set(source.statements
    .filter(node => ts.isExportDeclaration(node) && node.moduleSpecifier)
    .map(node => path.resolve(sourceDirectory, node.moduleSpecifier.text)))
  for (const file of filesIn(sourceDirectory)) {
    if (file === internalFile || file.endsWith('.d.ts') || path.basename(file) === 'Main.ts') continue
    assert.ok(exportedFiles.has(file), `${file} is missing from internal.ts`)
  }
})

test('application dependencies use internal.ts, not sibling implementation modules or factories', () => {
  for (const file of filesIn(sourceDirectory)) {
    if (file === internalFile) continue
    const text = readFileSync(file, 'utf8')
    assert.doesNotMatch(text, /GhFactory|UiFactory/, file)
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
    for (const node of source.statements) {
      if ((!ts.isImportDeclaration(node) && !ts.isExportDeclaration(node)) || !node.moduleSpecifier?.text.startsWith('.')) continue
      const specifier = node.moduleSpecifier.text
      if (!specifier.endsWith('.ts')) continue
      const dependency = path.resolve(path.dirname(file), specifier)
      if (dependency.startsWith(path.join(sourceDirectory, 'proto') + path.sep)) continue
      assert.equal(dependency, internalFile, `Implementation dependency in ${file}: ${specifier}`)
    }
  }
  assert.equal(existsSync(path.join(sourceDirectory, 'gameHelpers', 'GhFactory.ts')), false)
  assert.equal(existsSync(path.join(sourceDirectory, 'ui', 'utils', 'UiFactory.ts')), false)
})

test('the entire application initializes as native ESM without factory registration', async () => {
  const module = await loadInternalModules()
  const internal = await module(internalFile)
  const { UiContainer, UiLabel } = {
    UiContainer: internal.Ui_Components_UiContainer.UiContainer,
    UiLabel: internal.Ui_Components_UiLabel.UiLabel,
  }
  assert.ok(new UiContainer() instanceof internal.Egret_Egret.DisplayObjectContainer)
  assert.ok(new UiLabel() instanceof internal.Ui_Components_UiContainerBase.UiContainerBase)
  const scroller = new internal.Ui_Components_UiScroller.UiScroller()
  scroller.initViewport(new UiContainer())
  assert.throws(() => scroller.initViewport(new UiContainer()), /Viewport initialized/)
  const layoutScroller = new internal.Ui_Components_UiScroller.UiScroller()
  layoutScroller.initViewport(new internal.Ui_Components_UiLayout.UiLayout())
  assert.ok(internal.SingleFreeWar_Model_SfwWar.SfwWar.prototype instanceof internal.SinglePlayerWar_Model_SpwWar.SpwWar)
  assert.ok(internal.ReplayWar_Model_RwWar.RwWar.prototype instanceof internal.ReplayWar_Model_RwWarBase.RwWarBase)
  assert.equal(internal.Helpers_GameFlow, await module(path.join(sourceDirectory, 'helpers', 'GameFlow.ts')))
})
