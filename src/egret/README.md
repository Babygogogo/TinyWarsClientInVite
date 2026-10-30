# Egret modules

Keep application imports pointed at the public modules (`Egret`, `Sys`, `Web`,
`Res`, and `Processor`). These entry points preserve the existing exports and
load `Bootstrap` once to connect the platform and resource implementations.

`*Core` modules contain the implementations. They must not import the public
entry points or `Bootstrap`. Reverse runtime dependencies are accessed through
`Runtime`; type-only dependencies use `import type`. This lets every class be
defined before platform constructors or resource processors are accessed, without
depending on the application's import order.

`Lifecycle` and `Xml` depend directly on core definitions and do not require
runtime registration for their own APIs.

Run `npx eslint src/vendor/egret --max-warnings 0` to lint the engine modules.
Mutable display-object ancestry cursors retain narrowly scoped `no-this-alias`
exceptions; other aliases use `this` directly. Type-only class fields use
`declare` rather than interface/class merging, without adding runtime fields.

Run `npm run testEgretCircleRef` to check all public entry points, detect cycles in emitted
JavaScript imports, and verify shared engine state and resource processors.
The tests use Node's experimental VM modules to execute TypeScript as native ES
modules in isolated browser-like contexts.
