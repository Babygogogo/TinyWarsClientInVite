import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'

export const sourceDirectory = fileURLToPath(new URL('../src/', import.meta.url))
const sources = new Map()

export function sourceFor(filename) {
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

export async function loadModules(entry) {
  const context = vm.createContext({
    console,
    URL,
    navigator: { userAgent: '', language: 'en-US' },
    DOMParser: class DOMParser {},
    DOMRect: class DOMRect {
      constructor(x = 0, y = 0, width = 0, height = 0) {
        Object.assign(this, { x, y, width, height })
      }
    },
    document: {
      createElement(tag) {
        if (tag === 'div') return { style: { transform: '' } }
        if (tag !== 'video' && tag !== 'source') throw new Error(`Unexpected DOM element during module initialization: ${tag}`)
        return {
          setAttribute() {},
          appendChild() {},
          addEventListener() {},
        }
      },
    },
  })
  vm.runInContext('globalThis.window = globalThis', context)
  const modules = new Map()
  function getModule(filename) {
    if (!modules.has(filename)) {
      modules.set(filename, new vm.SourceTextModule(sourceFor(filename), {
        context,
        identifier: filename,
        initializeImportMeta(meta) {
          // Resource URLs are supplied by Vite, not evaluated during module initialization.
          meta.glob = () => ({})
        },
      }))
    }
    return modules.get(filename)
  }
  async function link(specifier, parent) {
    if (!specifier.startsWith('.')) {
      if (!modules.has(specifier)) {
        modules.set(specifier, import(specifier).then(namespace =>
          new vm.SyntheticModule(Object.keys(namespace), function () {
            for (const [name, value] of Object.entries(namespace)) this.setExport(name, value)
          }, { context, identifier: specifier })))
      }
      return modules.get(specifier)
    }
    let filename = path.resolve(path.dirname(parent.identifier), specifier)
    if (filename.endsWith('.js') && !existsSync(filename)) filename = filename.slice(0, -3) + '.ts'
    if (!path.extname(filename)) filename += '.ts'
    return getModule(filename)
  }
  async function load(name) {
    const module = getModule(path.resolve(sourceDirectory, name))
    if (module.status === 'unlinked') await module.link(link)
    if (module.status === 'linked') await module.evaluate()
    return module.namespace
  }
  await load(entry)
  return load
}
