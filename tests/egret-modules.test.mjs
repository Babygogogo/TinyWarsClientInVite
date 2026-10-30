import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const vendorDirectory = fileURLToPath(new URL('../src/vendor/egret/', import.meta.url))
const sources = new Map()

function sourceFor(filename) {
  if (!sources.has(filename)) {
    sources.set(filename, ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2023,
        module: ts.ModuleKind.ESNext,
        verbatimModuleSyntax: true,
      },
    }).outputText)
  }
  return sources.get(filename)
}

async function loadModules(entry) {
  const context = vm.createContext({
    console,
    window: { URL },
    navigator: { userAgent: '', language: 'en-US' },
    DOMParser: class DOMParser {},
  })
  const modules = new Map()
  function getModule(filename) {
    if (!modules.has(filename)) {
      modules.set(filename, new vm.SourceTextModule(sourceFor(filename), {
        context,
        identifier: filename,
      }))
    }
    return modules.get(filename)
  }
  function resolve(specifier, parent) {
    const filename = path.resolve(path.dirname(parent), specifier)
    return filename.endsWith('.ts') ? filename : `${filename}.ts`
  }
  const root = getModule(path.join(vendorDirectory, `${entry}.ts`))
  await root.link((specifier, parent) => getModule(resolve(specifier, parent.identifier)))
  await root.evaluate()
  return async name => {
    const module = getModule(path.join(vendorDirectory, `${name}.ts`))
    if (module.status === 'unlinked') {
      await module.link((specifier, parent) => getModule(resolve(specifier, parent.identifier)))
    }
    if (module.status === 'linked') await module.evaluate()
    return module.namespace
  }
}

for (const entry of ['Egret', 'Sys', 'Web', 'Lifecycle', 'Res', 'Processor', 'LocalStorage', 'Path']) {
  test(`${entry} can be the first imported module`, async () => {
    const module = await loadModules(entry)
    assert.ok(Object.keys(await module(entry)).length > 0)
  })
}

test('internal core imports fail explicitly if platform initialization is bypassed', async () => {
  const module = await loadModules('EgretCore')
  const core = await module('EgretCore')
  assert.throws(() => core.getHttpRequest(), /Egret runtime is not initialized/)
})

test('vendor runtime imports are acyclic', () => {
  const edges = new Map()
  for (const name of readdirSync(vendorDirectory).filter(name => name.endsWith('.ts'))) {
    const filename = path.join(vendorDirectory, name)
    const source = ts.createSourceFile(filename, sourceFor(filename), ts.ScriptTarget.Latest, true)
    edges.set(filename, source.statements
      .filter(node => (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier)
      .map(node => path.resolve(vendorDirectory, `${node.moduleSpecifier.text.replace(/\.ts$/, '')}.ts`)))
  }
  const visited = new Set()
  const stack = []
  function visit(filename) {
    assert.ok(!stack.includes(filename), `Circular import: ${[...stack, filename].map(file => path.basename(file)).join(' -> ')}`)
    if (visited.has(filename)) return
    stack.push(filename)
    for (const dependency of edges.get(filename) ?? []) visit(dependency)
    stack.pop()
    visited.add(filename)
  }
  for (const filename of edges.keys()) visit(filename)
})

test('platform constructors and shared engine state are wired', async () => {
  const module = await loadModules('Egret')
  const egret = await module('Egret')
  const sys = await module('Sys')
  const web = await module('Web')
  assert.equal(egret.getHttpRequest(), web.WebHttpRequest)
  assert.equal(egret.getImageLoader(), web.WebImageLoader)
  assert.equal(egret.getVideo(), web.WebVideo)
  assert.equal(egret.getTicker(), sys.SystemTicker.instance)
  assert.ok(new web.WebHttpRequest() instanceof egret.EventDispatcher)
  const shape = new egret.Shape()
  assert.ok(shape.graphics.$renderNode instanceof sys.GraphicsNode)
  const dispatcher = new egret.EventDispatcher()
  let dispatched = false
  dispatcher.addEventListener('ready', () => { dispatched = true }, undefined)
  dispatcher.dispatchEventWith('ready')
  assert.equal(dispatched, true)
})

test('resource processors use the same registry as the resource host', async () => {
  const module = await loadModules('Res')
  const res = await module('Res')
  const processor = await module('Processor')
  const resource = { name: 'example', root: '', url: 'example', type: 'test' }
  const custom = {
    async onLoadStart() { return 'loaded' },
    onRemoveStart() {},
  }
  processor.map('test', custom)
  assert.equal(processor.isSupport(resource), custom)
  assert.equal(await res.getHost().load(resource), 'loaded')
  assert.equal(await res.getHost().load({ ...resource, name: 'named' }, 'test'), 'loaded')
})

test('display-object ancestry cursors preserve parent traversal', async () => {
  const module = await loadModules('Egret')
  const egret = await module('Egret')
  const root = new egret.DisplayObjectContainer()
  const parent = new egret.DisplayObjectContainer()
  const child = new egret.Shape()
  root.addChild(parent)
  parent.addChild(child)
  const listener = () => {}
  root.addEventListener('ancestor-event', listener, undefined)
  assert.equal(child.willTrigger('ancestor-event'), true)
  assert.equal(child.willTrigger('missing-event'), false)
  root.removeEventListener('ancestor-event', listener, undefined)
  assert.equal(child.willTrigger('ancestor-event'), false)

  child.filters = [new egret.BlurFilter(2, 3)]
  parent.filters = [new egret.BlurFilter(4, 5)]
  root.filters = [new egret.BlurFilter(6, 7)]
  const offsets = fromParent => {
    const { minX, minY, maxX, maxY } = child.$measureFiltersOffset(fromParent)
    return { minX, minY, maxX, maxY }
  }
  assert.deepEqual(offsets(false), { minX: -2, minY: -3, maxX: 2, maxY: 3 })
  assert.deepEqual(offsets(true), { minX: -12, minY: -15, maxX: 12, maxY: 15 })

  root.$nestLevel = 1
  parent.$nestLevel = 2
  child.$nestLevel = 3
  root.scaleX = 0
  parent.x = 20
  parent.y = 30
  child.x = 4
  child.y = 5
  child.scrollRect = new egret.Rectangle(1, 2, 10, 10)
  const matrix = new egret.Matrix()
  child.$getConcatenatedMatrixAt(root, matrix)
  assert.deepEqual([matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty], [1, 0, 0, 1, 23, 33])
})

test('graphics drawing handles absent fill and stroke paths', async () => {
  const module = await loadModules('Egret')
  const egret = await module('Egret')
  const shape = new egret.Shape()
  const graphics = shape.graphics
  graphics.drawRect(0, 0, 10, 20)
  graphics.moveTo(1, 2)
  graphics.lineTo(3, 4)
  assert.equal(graphics.$renderNode.drawData.length, 0)
  graphics.beginFill(0xff0000)
  graphics.lineStyle(2, 0x000000)
  graphics.drawRect(0, 0, 10, 20)
  assert.equal(graphics.$renderNode.drawData.length, 2)
  graphics.setStrokeWidth(4)
  assert.deepEqual([graphics.topLeftStrokeWidth, graphics.bottomRightStrokeWidth], [2, 2])
})

test('pixel-read failures retain the original cause', async () => {
  const module = await loadModules('Egret')
  const egret = await module('Egret')
  const shape = new egret.Shape()
  const cause = new Error('pixel read denied')
  shape.$displayList = {
    offsetX: 0,
    offsetY: 0,
    renderBuffer: {
      getPixels() { throw cause },
    },
  }
  assert.throws(() => shape.hitTestPoint(0, 0, true), error => {
    assert.equal(error.cause, cause)
    return true
  })
})
