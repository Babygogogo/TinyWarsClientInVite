import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { loadInternalModules } from './helpers/load-modules.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const load = await loadInternalModules()
const accessors = await Promise.all(
  ['DeprecatedIndexedDbAccessor.ts', 'IndexedDbAccessor.ts'].map(async filename => ({
    filename,
    stores: await load(path.join(root, 'src', 'localData', filename)),
  })),
)

function testStores(name, callback) {
  for (const { filename, stores } of accessors) {
    test(`${filename}: ${name}`, { timeout: 1000 }, () => callback(stores))
  }
}

function createDatabase(records) {
  let readCount = 0
  function request(result) {
    readCount++
    const pending = {}
    queueMicrotask(() => pending.onsuccess())
    pending.result = result
    return pending
  }
  return {
    database: {
      transaction() {
        return {
          objectStore() {
            return {
              getAll: () => request(records),
              get: () => request(undefined),
            }
          },
        }
      },
    },
    getReadCount: () => readCount,
  }
}

function createStore(Store, records) {
  const store = new Store({
    storeName: 'test',
    encode: value => value,
    decode: value => value,
  })
  const { database, getReadCount } = createDatabase(records)
  store.setDatabase(database)
  return { store, getReadCount }
}

function entries(dict) {
  return Array.from(dict, ([key, value]) => [key, value])
}

function nestedEntries(dict) {
  return Array.from(dict, ([key, value]) => [key, entries(value)])
}

testStores('Store1 cached enumeration resolves with every entry and skips missing data', async ({ Store1 }) => {
  const records = [{ key: 1, value: 'one' }, { key: 2, value: 'two' }]
  const { store, getReadCount } = createStore(Store1, records)
  assert.equal(await store.getData(0), null)
  assert.deepEqual(entries(await store.getAllDataDict()), [[1, 'one'], [2, 'two']])
  const reads = getReadCount()
  const cached = await store.getAllDataDict()
  assert.deepEqual(entries(cached), [[1, 'one'], [2, 'two']])
  cached.clear()
  assert.deepEqual(entries(await store.getAllDataDict()), [[1, 'one'], [2, 'two']])
  assert.equal(getReadCount(), reads)
})

testStores('Store1 cached enumeration resolves for an empty database', async ({ Store1 }) => {
  const { store, getReadCount } = createStore(Store1, [])
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal(getReadCount(), 1)
})

testStores('Store1 cached enumeration resolves when all cached entries are missing', async ({ Store1 }) => {
  const { store, getReadCount } = createStore(Store1, [])
  await store.getData(1)
  await store.getAllDataDict()
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal(getReadCount(), 2)
})

testStores('Store2 cached enumeration preserves both keys and skips missing data', async ({ Store2 }) => {
  const records = [
    { key1: 1, key2: 1, value: 'one' },
    { key1: 1, key2: 2, value: 'two' },
    { key1: 2, key2: 1, value: 'three' },
  ]
  const expected = [[1, [[1, 'one'], [2, 'two']]], [2, [[1, 'three']]]]
  const { store, getReadCount } = createStore(Store2, records)
  await store.getData(1, 0)
  assert.deepEqual(nestedEntries(await store.getAllDataDict()), expected)
  const reads = getReadCount()
  const cached = await store.getAllDataDict()
  assert.deepEqual(nestedEntries(cached), expected)
  cached.get(1).clear()
  assert.deepEqual(nestedEntries(await store.getAllDataDict()), expected)
  assert.deepEqual(entries(await store.getAllDataDictForKey1(1)), [[1, 'one'], [2, 'two']])
  assert.deepEqual(entries(await store.getAllDataDictForKey1(2)), [[1, 'three']])
  assert.equal((await store.getAllDataDictForKey1(3)).size, 0)
  assert.equal(getReadCount(), reads)
})

testStores('Store2 cached enumeration and filtering resolve for an empty database', async ({ Store2 }) => {
  const { store, getReadCount } = createStore(Store2, [])
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal((await store.getAllDataDictForKey1(1)).size, 0)
  assert.equal(getReadCount(), 1)
})

testStores('Store2 cached enumeration and filtering skip groups containing only missing data', async ({ Store2 }) => {
  const { store, getReadCount } = createStore(Store2, [])
  await store.getData(1, 1)
  await store.getAllDataDict()
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal((await store.getAllDataDictForKey1(1)).size, 0)
  assert.equal(getReadCount(), 2)
})

testStores('Store2 filtering before full enumeration still reads the database', async ({ Store2 }) => {
  const records = [
    { key1: 1, key2: 1, value: 'one' },
    { key1: 2, key2: 1, value: 'two' },
  ]
  const { store, getReadCount } = createStore(Store2, records)
  assert.deepEqual(entries(await store.getAllDataDictForKey1(1)), [[1, 'one']])
  assert.deepEqual(entries(await store.getAllDataDictForKey1(2)), [[1, 'two']])
  assert.equal(getReadCount(), 2)
})
