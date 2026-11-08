import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { loadInternalModules } from './helpers/load-modules.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const load = await loadInternalModules()
const { CachedDataAccessor } = await load(path.join(root, 'src', 'auxiliaryTypes', 'CachedDataAccessor.ts'))
const { SystemTicker } = await load(path.join(root, 'src', 'egret', 'Sys.ts'))

function mockRetryTimers(t) {
  let nextId = 0
  const timers = new Map()
  t.mock.method(SystemTicker.instance, 'setTimeout', (listener, thisObject, delay, ...args) => {
    assert.equal(delay, 1000)
    const id = ++nextId
    timers.set(id, () => listener.apply(thisObject, args))
    return id
  })
  t.mock.method(SystemTicker.instance, 'clearTimeout', id => timers.delete(id))
  return {
    timers,
    fire() {
      for (const [id, callback] of [...timers]) {
        timers.delete(id)
        callback()
      }
    },
  }
}

test('successful data receipt cancels a pending retry and resolves all waiting callers', async t => {
  const { timers, fire } = mockRetryTimers(t)
  const requests = []
  const accessor = new CachedDataAccessor({ reqData: key => requests.push(key) })
  const first = accessor.getData('key')
  const second = accessor.getData('key')
  accessor.updateOnRequestFailed('key')
  assert.equal(timers.size, 1)

  accessor.setData('key', 'value')
  assert.equal(timers.size, 0)
  assert.equal(await first, 'value')
  assert.equal(await second, 'value')
  fire()
  assert.deepEqual(requests, ['key'])
  assert.equal(await accessor.getData('key'), 'value')
  assert.deepEqual(requests, ['key'])
})

test('completing one key with missing data does not cancel another key retry', async t => {
  const { timers, fire } = mockRetryTimers(t)
  const requests = []
  const accessor = new CachedDataAccessor({ reqData: key => requests.push(key) })
  const first = accessor.getData('first')
  const second = accessor.getData('second')
  accessor.updateOnRequestFailed('first')
  accessor.updateOnRequestFailed('second')
  assert.equal(timers.size, 2)

  accessor.setData('first', null)
  assert.equal(await first, null)
  assert.equal(timers.size, 1)
  fire()
  assert.deepEqual(requests, ['first', 'second', 'second'])
  accessor.setData('second', 'value')
  assert.equal(await second, 'value')
  assert.equal(timers.size, 0)
})

test('success received synchronously during a retry resets its retry count', async t => {
  const { timers, fire } = mockRetryTimers(t)
  let requests = 0
  const accessor = new CachedDataAccessor({
    reqData: key => {
      if (++requests === 2) accessor.setData(key, 'value')
    },
  })
  const pending = accessor.getData('key')
  accessor.updateOnRequestFailed('key')
  fire()

  assert.equal(await pending, 'value')
  assert.equal(requests, 2)
  assert.equal(timers.size, 0)
  assert.equal(accessor._requestRetryCountDict.get('key'), 0)
  assert.equal(accessor._requestRetryTimeoutDict.has('key'), false)
})
