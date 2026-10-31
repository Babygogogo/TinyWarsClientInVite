import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { loadInternalModules } from './helpers/load-modules.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
let storeDatabase
const load = await loadInternalModules({
  window: {
    URL,
    Number,
    indexedDB: {
      open() {
        assert.ok(storeDatabase, 'Store tests must provide a database before initialization')
        const request = { result: storeDatabase }
        queueMicrotask(() => request.onsuccess())
        return request
      },
    },
  },
})
const accessors = await Promise.all(
  ['DeprecatedIndexedDbAccessor.ts', 'IndexedDbAccessor.ts'].map(async filename => ({
    filename,
    stores: await load(path.join(root, 'src', 'localData', filename)),
  })),
)

function testDatabases(name, callback) {
  for (const deprecated of [false, true]) {
    const prefix = deprecated ? 'Deprecated' : ''
    const filename = `${prefix}IndexedDbAccessor.ts`
    test(`${filename}: ${name}`, { timeout: 1000 }, () => callback({
      filename,
      storageName: `LocalData_${prefix}Storage`,
      accessorName: `LocalData_${prefix}IndexedDbAccessor`,
      logPrefix: deprecated ? 'Deprecated IndexedDB' : 'IndexedDB',
      storeCount: deprecated ? 3 : 17,
    }))
  }
}

for (const outcomes of [
  ['success'],
  ['error', 'success'],
  ['error', 'error', 'success'],
  ['error', 'error', 'error', 'success'],
  ['throw', 'success'],
  ['throw', 'throw', 'throw', 'success'],
  ['throw', 'error', 'success'],
]) {
  testDatabases(`initialization attempts ${outcomes.join(', ')}`, async ({ storageName, logPrefix, storeCount }) => {
    let attempts = 0
    const warnings = []
    const error = new Error('Database open failed')
    const storeNames = new Set()
    const connection = createDatabase([])
    const database = {
      ...connection.database,
      objectStoreNames: { contains: name => storeNames.has(name) },
      createObjectStore: name => storeNames.add(name),
      deleteObjectStore: name => storeNames.delete(name),
    }
    const load = await loadInternalModules({
      window: {
        URL,
        Number,
        CLIENT_VERSION: 'DEVELOP',
        console: { warn: (...args) => warnings.push(args) },
        indexedDB: {
          open() {
            const outcome = outcomes[attempts++]
            assert.ok(outcome, 'Unexpected extra initialization attempt')
            if (outcome === 'throw') throw error
            const request = { result: database, error }
            queueMicrotask(() => {
              if (outcome === 'error') {
                request.onerror()
              } else {
                request.onupgradeneeded()
                request.onsuccess()
              }
            })
            return request
          },
        },
      },
      queueMicrotask,
    })
    const modules = await load(path.join(root, 'src', 'internal.ts'))
    const storage = modules[storageName]
    const expectedAttempts = Math.min(outcomes.length, 3)
    const succeeded = outcomes[expectedAttempts - 1] === 'success'
    await storage.init()
    assert.equal(attempts, expectedAttempts)
    const failures = warnings.filter(([message]) => message.startsWith(`${logPrefix} failed to init`))
    assert.equal(failures.length, succeeded ? expectedAttempts - 1 : expectedAttempts)
    failures.forEach(([message, loggedError], index) => {
      assert.equal(message, `${logPrefix} failed to init (attempt ${index + 1}/3).`)
      assert.equal(loggedError, error)
    })
    const stores = Object.entries(storage).filter(([name]) => name.startsWith('Store'))
    assert.equal(stores.length, storeCount)
    for (const [, store] of stores) {
      assert.equal('_database' in store, false)
      assert.equal('setDatabase' in store, false)
      assert.equal((await store.getAllEncodedDataDict()).size, 0)
    }
    assert.equal(connection.getReadCount(), succeeded ? stores.length : 0)
    assert.equal(storeNames.size, succeeded ? stores.length : 0)
  })
}

function testStores(name, callback) {
  for (const { filename, stores } of accessors) {
    test(`${filename}: ${name}`, { timeout: 1000 }, () => callback({
      ...stores,
      createStore: (Store, records) => createStore(Store, records, stores.initDatabase),
    }))
  }
}

test('IndexedDB accessors keep separate connections and legacy upgrades preserve existing stores', { timeout: 1000 }, async () => {
  const opened = []
  const databases = new Map()
  const load = await loadInternalModules({
    window: {
      URL,
      Number,
      indexedDB: {
        open(name, version) {
          opened.push([name, version])
          if (!databases.has(name)) {
            const connection = createDatabase([])
            const names = new Set()
            const created = []
            const deleted = []
            Object.assign(connection.database, {
              objectStoreNames: { contains: name => names.has(name) },
              createObjectStore(name) {
                names.add(name)
                created.push(name)
              },
              deleteObjectStore(name) {
                names.delete(name)
                deleted.push(name)
              },
            })
            databases.set(name, { ...connection, created, deleted })
          }
          const request = { result: databases.get(name).database }
          queueMicrotask(() => {
            request.onupgradeneeded()
            request.onsuccess()
          })
          return request
        },
      },
    },
  })
  const {
    LocalData_Constants: constants,
    LocalData_Storage: current,
    LocalData_DeprecatedStorage: legacy,
  } = await load(path.join(root, 'src', 'internal.ts'))
  await legacy.init()
  const oldConnection = databases.get(constants.OldDatabaseName)
  assert.equal(oldConnection.created.length, 3)
  await legacy.init()
  assert.equal(oldConnection.created.length, 3, 'Existing legacy stores must not be recreated')
  assert.deepEqual(oldConnection.deleted, [])
  await current.init()
  const newConnection = databases.get(constants.NewDatabaseName)
  assert.notEqual(newConnection.database, oldConnection.database)
  for (const [storage, connection] of [[legacy, oldConnection], [current, newConnection]]) {
    const stores = Object.entries(storage).filter(([name]) => name.startsWith('Store'))
    for (const [, store] of stores) await store.getAllEncodedDataDict()
    assert.equal(connection.getReadCount(), stores.length)
  }
  assert.deepEqual(opened, [
    [constants.OldDatabaseName, 5],
    [constants.OldDatabaseName, 5],
    [constants.NewDatabaseName, constants.NewDatabaseVersion],
  ])
})

testDatabases('caller upgrade callback survives retries and automatic reconnection', async ({ filename }) => {
  const outcomes = ['error', 'upgrade', 'open', 'error', 'upgrade', 'upgrade']
  const connections = []
  const upgraded = []
  let attempts = 0
  const load = await loadInternalModules({
    window: {
      URL,
      Number,
      indexedDB: {
        open() {
          const outcome = outcomes[attempts++]
          assert.ok(outcome, 'Unexpected extra open')
          const database = createDatabase([]).database
          const request = { result: database, error: new Error('Open failed') }
          queueMicrotask(() => {
            if (outcome === 'error') {
              request.onerror()
            } else {
              if (outcome === 'upgrade') request.onupgradeneeded()
              connections.push(database)
              request.onsuccess()
            }
          })
          return request
        },
      },
    },
  })
  const { initDatabase } = await load(path.join(root, 'src', 'localData', filename))
  const onUpgradeNeeded = database => upgraded.push(database)
  const unexpectedUpgrade = () => assert.fail('A pending initialization must keep its original callback')
  const initialization = initDatabase(onUpgradeNeeded)
  assert.equal(initDatabase(unexpectedUpgrade), initialization)
  await initialization
  assert.equal(attempts, 2)
  assert.deepEqual(upgraded, [connections[0]])

  connections[0].onclose()
  assert.equal(attempts, 3)
  await initDatabase(unexpectedUpgrade)
  assert.deepEqual(upgraded, [connections[0]], 'Opening an existing database must not run the callback')

  connections[1].onclose()
  assert.equal(attempts, 4)
  await initDatabase(unexpectedUpgrade)
  assert.equal(attempts, 5)
  assert.deepEqual(upgraded, [connections[0], connections[2]])

  connections[2].onclose()
  await initDatabase(unexpectedUpgrade)
  assert.equal(attempts, 6)
  assert.deepEqual(upgraded, [connections[0], connections[2], connections[3]])
})

for (const reconnectOutcomes of [
  ['success'],
  ['error', 'error', 'success'],
  ['throw', 'throw', 'success'],
  ['error', 'error', 'error'],
  ['throw', 'throw', 'throw'],
]) {
  testDatabases(`unexpected closure reconnects with ${reconnectOutcomes.join(', ')}`, async ({ storageName, accessorName, logPrefix }) => {
    const outcomes = ['success', ...reconnectOutcomes, 'success']
    const connections = []
    const warnings = []
    const error = new Error('Reconnection failed')
    let attempts = 0
    const load = await loadInternalModules({
      window: {
        URL,
        Number,
        CLIENT_VERSION: 'DEVELOP',
        console: { warn: (...args) => warnings.push(args) },
        indexedDB: {
          open() {
            const outcome = outcomes[attempts++]
            assert.ok(outcome, 'Unexpected extra reconnection attempt')
            if (outcome === 'throw') throw error
            const connection = outcome === 'success' ? createDatabase([]) : null
            if (connection) connections.push(connection)
            const request = { result: connection?.database, error }
            queueMicrotask(() => {
              if (connection) request.onsuccess()
              else request.onerror()
            })
            return request
          },
        },
      },
    })
    const modules = await load(path.join(root, 'src', 'internal.ts'))
    const storage = modules[storageName]
    const { Store1, Store2 } = modules[accessorName]
    const options = { storeName: 'test', encode: value => value, decode: value => value }
    const extraStores = [new Store1(options), new Store2(options)]
    const initialization = storage.init()
    assert.equal(storage.init(), initialization, 'Concurrent initialization must reuse the pending open')
    await initialization
    const stores = [
      ...Object.entries(storage).filter(([name]) => name.startsWith('Store')).map(([, store]) => store),
      ...extraStores,
      new Store1(options),
      new Store2(options),
    ]
    const original = connections[0]
    for (const store of stores) await store.getAllEncodedDataDict()
    assert.equal(original.getReadCount(), stores.length)

    original.database.onclose()
    assert.equal(attempts, 2, 'The close event must start reconnection automatically')
    const disconnectedReads = stores.map(store => store.getAllEncodedDataDict())
    assert.equal(original.getReadCount(), stores.length, 'Disconnected stores must not access the closed database')
    const reconnection = storage.init()
    assert.equal(storage.init(), reconnection, 'Concurrent reconnection must reuse the pending open')
    original.database.onclose()
    await reconnection
    for (const data of await Promise.all(disconnectedReads)) assert.equal(data.size, 0)
    assert.equal(attempts, 1 + reconnectOutcomes.length)
    assert.equal(warnings.filter(([message]) => message.includes('closed unexpectedly')).length, 1)
    const failures = warnings.filter(([message]) => message.startsWith(`${logPrefix} failed to init`))
    assert.equal(failures.length, reconnectOutcomes.filter(outcome => outcome !== 'success').length)
    for (const [, loggedError] of failures) assert.equal(loggedError, error)

    const succeeded = reconnectOutcomes.at(-1) === 'success'
    const replacement = succeeded ? connections[1] : null
    for (const store of stores) {
      assert.equal('_database' in store, false)
      assert.equal('setDatabase' in store, false)
      await store.getAllEncodedDataDict()
    }
    assert.equal(original.getReadCount(), stores.length, 'Operations must not use the closed database')
    if (replacement) assert.equal(replacement.getReadCount(), stores.length)

    original.database.onclose()
    assert.equal(attempts, 1 + reconnectOutcomes.length, 'A stale close event must not reconnect again')
    if (replacement) {
      replacement.database.onclose()
      assert.equal(attempts, 2 + reconnectOutcomes.length, 'The replacement must also reconnect automatically')
      await storage.init()
      assert.equal(attempts, 2 + reconnectOutcomes.length)
      for (const store of stores) await store.getAllEncodedDataDict()
      assert.equal(connections[2].getReadCount(), stores.length)
      assert.equal(replacement.getReadCount(), stores.length)
    }
  })
}

function createDatabase(records) {
  let readCount = 0
  const writes = []
  function request(result, isRead = true) {
    if (isRead) readCount++
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
              count: () => request(records.length),
              put(record) {
                writes.push(['put', { ...record }])
                return request(undefined, false)
              },
              delete(key) {
                writes.push(['delete', Array.isArray(key) ? Array.from(key) : key])
                return request(undefined, false)
              },
            }
          },
        }
      },
    },
    getReadCount: () => readCount,
    writes,
  }
}

async function createStore(Store, records, initializeDatabase) {
  const store = new Store({
    storeName: 'test',
    encode: value => value,
    decode: value => value,
  })
  const { database, getReadCount, writes } = createDatabase(records)
  storeDatabase = database
  await initializeDatabase(() => {})
  return { store, getReadCount, writes }
}

function entries(dict) {
  return Array.from(dict, ([key, value]) => [key, value])
}

function nestedEntries(dict) {
  return Array.from(dict, ([key, value]) => [key, entries(value)])
}

for (const storeName of ['Store1', 'Store2']) {
  testStores(`${storeName} encoded reads, counts, writes, and deletions use the database`, async ({ createStore, ...stores }) => {
    const keys = storeName === 'Store1' ? [1] : [1, 2]
    const record = storeName === 'Store1' ? { key: 1, value: 'one' } : { key1: 1, key2: 2, value: 'one' }
    const { store, getReadCount, writes } = await createStore(stores[storeName], [record])
    const encoded = await store.getAllEncodedDataDict()
    assert.deepEqual(
      storeName === 'Store1' ? entries(encoded) : nestedEntries(encoded),
      storeName === 'Store1' ? [[1, 'one']] : [[1, [[2, 'one']]]],
    )
    assert.equal(await store.getAllDataCount(), 1)
    await store.setData(...keys, 'two')
    assert.equal(await store.getData(...keys), 'two')
    await store.setData(...keys, null)
    assert.equal(await store.getData(...keys), null)
    assert.deepEqual(writes, [
      ['put', { ...record, value: 'two' }],
      ['delete', storeName === 'Store1' ? 1 : keys],
    ])
    assert.equal(getReadCount(), 2)
  })
}

testStores('Store1 cached enumeration resolves with every entry and skips missing data', async ({ Store1, createStore }) => {
  const records = [{ key: 1, value: 'one' }, { key: 2, value: 'two' }]
  const { store, getReadCount } = await createStore(Store1, records)
  assert.equal(await store.getData(0), null)
  assert.deepEqual(entries(await store.getAllDataDict()), [[1, 'one'], [2, 'two']])
  const reads = getReadCount()
  const cached = await store.getAllDataDict()
  assert.deepEqual(entries(cached), [[1, 'one'], [2, 'two']])
  cached.clear()
  assert.deepEqual(entries(await store.getAllDataDict()), [[1, 'one'], [2, 'two']])
  assert.equal(getReadCount(), reads)
})

testStores('Store1 cached enumeration resolves for an empty database', async ({ Store1, createStore }) => {
  const { store, getReadCount } = await createStore(Store1, [])
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal(getReadCount(), 1)
})

testStores('Store1 cached enumeration resolves when all cached entries are missing', async ({ Store1, createStore }) => {
  const { store, getReadCount } = await createStore(Store1, [])
  await store.getData(1)
  await store.getAllDataDict()
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal(getReadCount(), 2)
})

testStores('Store2 cached enumeration preserves both keys and skips missing data', async ({ Store2, createStore }) => {
  const records = [
    { key1: 1, key2: 1, value: 'one' },
    { key1: 1, key2: 2, value: 'two' },
    { key1: 2, key2: 1, value: 'three' },
  ]
  const expected = [[1, [[1, 'one'], [2, 'two']]], [2, [[1, 'three']]]]
  const { store, getReadCount } = await createStore(Store2, records)
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

testStores('Store2 cached enumeration and filtering resolve for an empty database', async ({ Store2, createStore }) => {
  const { store, getReadCount } = await createStore(Store2, [])
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal((await store.getAllDataDictForKey1(1)).size, 0)
  assert.equal(getReadCount(), 1)
})

testStores('Store2 cached enumeration and filtering skip groups containing only missing data', async ({ Store2, createStore }) => {
  const { store, getReadCount } = await createStore(Store2, [])
  await store.getData(1, 1)
  await store.getAllDataDict()
  assert.equal((await store.getAllDataDict()).size, 0)
  assert.equal((await store.getAllDataDictForKey1(1)).size, 0)
  assert.equal(getReadCount(), 2)
})

testStores('Store2 filtering before full enumeration still reads the database', async ({ Store2, createStore }) => {
  const records = [
    { key1: 1, key2: 1, value: 'one' },
    { key1: 2, key2: 1, value: 'two' },
  ]
  const { store, getReadCount } = await createStore(Store2, records)
  assert.deepEqual(entries(await store.getAllDataDictForKey1(1)), [[1, 'one']])
  assert.deepEqual(entries(await store.getAllDataDictForKey1(2)), [[1, 'two']])
  assert.equal(getReadCount(), 2)
})
