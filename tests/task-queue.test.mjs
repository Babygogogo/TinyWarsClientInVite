import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { loadInternalModules } from './helpers/load-modules.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const load = await loadInternalModules()
const { TaskQueue } = await load(path.join(root, 'src', 'auxiliaryTypes', 'TaskQueue.ts'))

test('tasks run sequentially and resolve with their results', { timeout: 1000 }, async () => {
  const queue = new TaskQueue()
  const events = []
  let finishFirst
  const first = queue.addTask(() => {
    events.push('first')
    return new Promise(resolve => { finishFirst = resolve })
  })
  const second = queue.addTask(() => {
    events.push('second')
    return 'second result'
  })
  assert.deepEqual(events, ['first'])
  finishFirst('first result')
  assert.deepEqual(await Promise.all([first, second]), ['first result', 'second result'])
  assert.deepEqual(events, ['first', 'second'])
})

test('a synchronous throw rejects with the original error and the queue can be reused', { timeout: 1000 }, async () => {
  const queue = new TaskQueue()
  const error = new Error('task failed')
  const failed = queue.addTask(() => { throw error })
  await assert.rejects(failed, reason => reason === error)
  assert.equal(await queue.addTask(() => 'recovered'), 'recovered')
})

test('an asynchronous rejection does not block already queued tasks', { timeout: 1000 }, async () => {
  const queue = new TaskQueue()
  const events = []
  const error = new Error('task rejected')
  let failFirst
  const first = queue.addTask(() => {
    events.push('first')
    return new Promise((resolve, reject) => { failFirst = reject })
  })
  const rejected = assert.rejects(first, reason => reason === error)
  const second = queue.addTask(() => {
    events.push('second')
    return 'recovered'
  })
  assert.deepEqual(events, ['first'])
  failFirst(error)
  await rejected
  assert.equal(await second, 'recovered')
  assert.deepEqual(events, ['first', 'second'])
})

test('consecutive failures each reject and preserve FIFO execution', { timeout: 1000 }, async () => {
  const queue = new TaskQueue()
  const events = []
  const error = new Error('synchronous failure')
  const first = queue.addTask(async () => {
    events.push('first')
    throw null
  })
  const second = queue.addTask(() => {
    events.push('second')
    throw error
  })
  const third = queue.addTask(() => {
    events.push('third')
    return undefined
  })
  const results = await Promise.allSettled([first, second, third])
  assert.equal(results[0].status, 'rejected')
  assert.equal(results[0].reason, null)
  assert.equal(results[1].status, 'rejected')
  assert.equal(results[1].reason, error)
  assert.equal(results[2].status, 'fulfilled')
  assert.equal(results[2].value, undefined)
  assert.deepEqual(events, ['first', 'second', 'third'])
})
