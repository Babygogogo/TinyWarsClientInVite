import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'

const sources = new Map()

export function loadInternalModules() {
  return loadModules(fileURLToPath(new URL('../../src/internal.ts', import.meta.url)), {
    DOMRect: class DOMRect {},
    document: {
      createElement(tag) {
        if (!['video', 'source'].includes(tag)) throw new Error(`Unexpected DOM initialization: ${tag}`)
        return { setAttribute() {}, appendChild() {}, addEventListener() {} }
      },
    },
  })
}

export async function loadModules(entry, globals = {}) {
  const context = vm.createContext({
    console,
    window: { URL, Number },
    navigator: { userAgent: '', language: 'en-US' },
    DOMParser: class DOMParser {},
    ...globals,
  })
  const modules = new Map()
  function getModule(filename) {
    if (!modules.has(filename)) {
      if (!sources.has(filename)) {
        sources.set(filename, ts.transpileModule(readFileSync(filename, 'utf8'), {
          compilerOptions: {
            target: ts.ScriptTarget.ES2023,
            module: ts.ModuleKind.ESNext,
            verbatimModuleSyntax: true,
          },
        }).outputText)
      }
      modules.set(filename, new vm.SourceTextModule(sources.get(filename), {
        context,
        identifier: filename,
        initializeImportMeta(meta) {
          // Resource loading is tested by Vite; initialization needs only the asset registry.
          meta.glob = () => ({})
        },
      }))
    }
    return modules.get(filename)
  }
  async function resolve(specifier, parent) {
    if (!specifier.startsWith('.')) {
      if (!modules.has(specifier)) {
        const external = await import(specifier)
        const names = Object.keys(external)
        modules.set(specifier, new vm.SyntheticModule(names, function () {
          for (const name of names) this.setExport(name, external[name])
        }, { context, identifier: specifier }))
      }
      return modules.get(specifier)
    }
    let filename = path.resolve(path.dirname(parent.identifier), specifier)
    if (filename.endsWith('.js') && !existsSync(filename)) filename = filename.slice(0, -3) + '.ts'
    if (!path.extname(filename)) filename += '.ts'
    return getModule(filename)
  }
  const root = getModule(entry)
  await root.link(resolve)
  await root.evaluate()
  return async filename => {
    const module = getModule(filename)
    if (module.status === 'unlinked') await module.link(resolve)
    if (module.status === 'linked') await module.evaluate()
    return module.namespace
  }
}
