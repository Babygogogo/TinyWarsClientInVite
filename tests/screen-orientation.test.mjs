import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { loadModules, sourceFor } from './module-loader.mjs'

const load = await loadModules('internal.ts')
const egret = await load('egret/Egret.ts')
const sys = await load('egret/Sys.ts')
const web = await load('egret/Web.ts')
const constants = await load('stages/Constants.ts')
const graphics = await load('graphics/Constants.ts')

async function createScreen(isMobile) {
  const player = new web.WebPlayer()
  const viewport = { width: 390, height: 844, top: 0 }
  const layers = []
  let resize
  let touchScale
  const stage = {
    $orientation: 'landscape',
    $scaleMode: 'fixedWidth',
    stageWidth: 960,
    stageHeight: 540,
    set orientation(value) { this.$orientation = value },
    setContentSize(width, height) { player.setContentSize(width, height) },
    addEventListener(type, listener) {
      assert.equal(type, egret.Event.RESIZE)
      resize = listener
    },
    addChild(layer) { layers.push(layer) },
  }
  player.stage = stage
  player.canvas = { width: 0, height: 0, style: {} }
  player.container = { getBoundingClientRect: () => viewport }
  player.playerOption = { contentWidth: 960, contentHeight: 540 }
  player.webTouchHandler = {
    updateScaleMode(...values) { touchScale = values },
  }
  player.webInput = { $updateSize() {} }
  player.player = {
    updateStageSize(width, height) {
      stage.stageWidth = width
      stage.stageHeight = height
      resize?.()
    },
  }

  const dependencies = {
    Egret_Egret: {
      ...egret,
      Capabilities: { isMobile },
      startTick() {},
      updateAllScreens() { player.updateScreenSize() },
    },
    Egret_Sys: sys,
    Stages_Constants: constants,
    Graphics_Constants: graphics,
    Helpers_PointerInput: { enable() {} },
    Helpers_Misc: {},
    Helpers_Compatibility: {},
    Utils_ClientErrorCode: {},
    Ui_Components_UiLayer: {
      UiLayer: class {
        resize(width, height) { Object.assign(this, { width, height }) }
      },
    },
  }
  const context = vm.createContext({ DOMRect: class {} })
  const internal = new vm.SyntheticModule(Object.keys(dependencies), function () {
    for (const [name, value] of Object.entries(dependencies)) this.setExport(name, value)
  }, { context })
  const manager = new vm.SourceTextModule(
    sourceFor(new URL('../src/stages/StageManager.ts', import.meta.url)),
    { context },
  )
  await manager.link(() => internal)
  await manager.evaluate()
  manager.namespace.init(stage)
  return { player, stage, viewport, layers, manager: manager.namespace, getTouchScale: () => touchScale }
}

test('orientation constants have their declared runtime values', () => {
  assert.equal(egret.OrientationMode.AUTO, 'auto')
  assert.equal(egret.OrientationMode.PORTRAIT, 'portrait')
  assert.equal(egret.OrientationMode.LANDSCAPE, 'landscape')
  assert.equal(egret.OrientationMode.LANDSCAPE_FLIPPED, 'landscapeFlipped')
  assert.equal(new egret.Stage().orientation, 'auto')
})

test('the page follows viewport orientation without requesting a portrait lock', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  assert.match(html, /data-orientation="auto"/)
  assert.doesNotMatch(html, /<meta\s+name="screen-orientation"/)
})

for (const isMobile of [true, false]) {
  test(`automatic layout follows viewport changes on ${isMobile ? 'mobile' : 'desktop'}`, async () => {
    const screen = await createScreen(isMobile)
    const { player, stage, viewport, layers, manager } = screen
    assert.equal(stage.$orientation, 'auto')
    assert.equal(stage.stageWidth, 960)
    assert.equal(stage.stageHeight, 2078)
    assert.ok(layers.length > 0)

    for (const scale of [100, 200, 300]) {
      manager.setStageScale(scale)
      for (const [width, height] of [[390, 844], [844, 390], [800, 800], [2560, 720], [375, 667], [390, 844]]) {
        Object.assign(viewport, { width, height })
        player.updateScreenSize()
        const [scaleX, scaleY, rotation] = screen.getTouchScale()
        assert.equal(rotation, 0)
        assert.equal(stage.stageWidth % 2, 0)
        assert.equal(stage.stageHeight % 2, 0)
        assert.ok(stage.stageWidth >= 960 * scale / 100)
        assert.ok(stage.stageHeight >= 540 * scale / 100)
        assert.ok(Math.abs(stage.stageWidth - stage.stageHeight * width / height) <= 2 * Math.max(1, width / height))
        assert.ok(Math.abs(player.canvas.width * scaleX - width) <= 1)
        assert.ok(Math.abs(player.canvas.height * scaleY - height) <= 1)
        assert.equal(egret.Capabilities.boundingClientWidth, width)
        assert.equal(egret.Capabilities.boundingClientHeight, height)
        const matrix = Object.values(player.canvas.style).find(value => value.startsWith('matrix('))
        const components = matrix.slice(7, -1).split(',').map(Number)
        assert.equal(components[1], 0)
        assert.equal(components[2], 0)
        for (const layer of layers) {
          assert.equal(layer.width, stage.stageWidth)
          assert.equal(layer.height, stage.stageHeight)
        }
      }
    }
  })
}

test('explicit orientation modes retain their rotation and touch mapping', async () => {
  const screen = await createScreen(true)
  const { player, stage, viewport } = screen
  for (const [orientation, width, height, rotation] of [
    ['landscape', 390, 844, 90],
    ['landscapeFlipped', 390, 844, -90],
    ['portrait', 844, 390, -90],
    ['portrait', 390, 844, 0],
    ['landscape', 844, 390, 0],
    ['landscapeFlipped', 844, 390, 0],
  ]) {
    stage.$orientation = orientation
    Object.assign(viewport, { width, height })
    player.updateScreenSize()
    assert.equal(screen.getTouchScale()[2], rotation)
    assert.equal(egret.Capabilities.boundingClientWidth, rotation ? height : width)
    assert.equal(egret.Capabilities.boundingClientHeight, rotation ? width : height)
  }
})
