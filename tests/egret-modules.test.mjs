import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { loadInternalModules } from './helpers/load-modules.mjs'

const vendorDirectory = fileURLToPath(new URL('../src/egret/', import.meta.url))
async function loadModules() {
  const module = await loadInternalModules()
  const internal = await module(path.join(vendorDirectory, '..', 'internal.ts'))
  return name => internal[`Egret_${name}`]
}

test('engine namespaces initialize through the internal entry without registration', async () => {
  const module = await loadModules()
  for (const name of ['Egret', 'Sys', 'Web', 'Lifecycle', 'Res', 'Processor', 'LocalStorage', 'Path']) {
    assert.ok(Object.keys(await module(name)).length > 0)
  }
})

test('engine has no bootstrap, runtime registration, core facades, or deferred getter wrappers', async () => {
  for (const name of ['Bootstrap', 'Runtime', 'EgretCore', 'SysCore', 'WebCore', 'ResCore', 'ProcessorCore']) {
    assert.equal(existsSync(path.join(vendorDirectory, `${name}.ts`)), false)
  }
  for (const name of readdirSync(vendorDirectory).filter(name => name.endsWith('.ts'))) {
    const filename = path.join(vendorDirectory, name)
    assert.doesNotMatch(readFileSync(filename, 'utf8'), /initializeRuntime|\bruntime\.(web|sys|processor)\b|\.\/\w*Core/)
  }
  const module = await loadModules()
  const egret = await module('Egret')
  for (const name of ['getHttpRequest', 'getImageLoader', 'getStageText', 'getFpsDisplay', 'getVideo', 'getTicker', 'getFps']) {
    assert.equal(name in egret, false)
  }
  const res = await module('Res')
  for (const name of ['getHost', 'getConfig', 'getQueue', 'ResHelper']) assert.equal(name in res, false)
  assert.equal('getMap' in await module('Processor'), false)
})

test('platform constructors and shared engine state are wired', async () => {
  const module = await loadModules()
  const egret = await module('Egret')
  const sys = await module('Sys')
  const web = await module('Web')
  for (const name of ['WebHttpRequest', 'WebImageLoader', 'WebVideo', 'HTML5StageText', 'WebFps']) {
    assert.equal(typeof web[name], 'function')
  }
  assert.equal(sys.SystemTicker.instance, sys.SystemTicker.instance)
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
  const module = await loadModules()
  const res = await module('Res')
  const processor = await module('Processor')
  assert.equal(res.host.resourceConfig, res.config)
  assert.ok(res.queue instanceof res.ResourceLoader)
  assert.equal(processor._map.image, processor.ResProcessorHelper.ImageProcessor)
  assert.equal(processor._map.json, processor.ResProcessorHelper.JsonProcessor)
  const resource = { name: 'example', root: '', url: 'example', type: 'test' }
  const custom = {
    async onLoadStart() { return 'loaded' },
    onRemoveStart() {},
  }
  processor.map('test', custom)
  assert.equal(processor.isSupport(resource), custom)
  assert.equal(processor._map.test, custom)
  assert.equal(await res.host.load(resource), 'loaded')
  assert.equal(await res.host.load({ ...resource, name: 'named' }, 'test'), 'loaded')
})

test('display-object ancestry cursors preserve parent traversal', async () => {
  const module = await loadModules()
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
  const module = await loadModules()
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
  const module = await loadModules()
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
