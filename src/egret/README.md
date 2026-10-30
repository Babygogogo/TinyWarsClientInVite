# Egret modules

Engine implementations and application code import the `Egret_*` namespaces
from `../internal.ts`. Do not import engine implementation files directly:
the internal entry point controls evaluation order for the shared ESM cycles.
`Egret`, `Path`, `Lifecycle`, `Sys`, `Res`, `Web`, and `Processor` evaluate before
application modules that use their classes.

There are no Bootstrap/Runtime registration modules or Core facades. Reference
platform constructors directly, such as `Egret_Web.WebHttpRequest`, and use
`Egret_Sys.SystemTicker.instance` for the ticker. Resource state is exported as
`Egret_Res.host`, `Egret_Res.config`, and `Egret_Res.queue`; built-in processors and
`Egret_Processor._map` are initialized during module evaluation.

Run `npx eslint src/egret --max-warnings 0` to lint the engine modules.
Mutable display-object ancestry cursors retain narrowly scoped `no-this-alias`
exceptions; other aliases use `this` directly. Type-only class fields use
`declare` rather than interface/class merging, without adding runtime fields.

Run `npm run testEgretCircleRef` to check initialization through the internal entry
point, absence of the old registration layer, shared engine state, and resource processors.
The tests use Node's experimental VM modules to execute TypeScript as native ES
modules in isolated browser-like contexts.
