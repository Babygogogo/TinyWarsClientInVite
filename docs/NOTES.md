## Single-player war architecture
- Campaign and single-ranked games use a viewless, authoritative `innerWar` and a visible `outerWar`, restricted to the human players' shared team.
- Player requests, AI decisions, automatic operations, and scoring run against `innerWar`. Its team-filtered operation results update `outerWar` through the same executors used by multiplayer games.
- A shared runner lock serializes player and automatic operations across inner calculation and outer playback. Runner and inner-executor locks are released on failure; results from unloaded war pairs are discarded.
- Saves and score validation retain the full authoritative state, random seed, and operation history. Loading a save regenerates the filtered outer state.
- Single-custom and single-free games continue to use a unified war.

## CO skill attack-range conditions
- `persistent.selfUnitAttackRange` requires `unitCategoryId`, `tileCategoryId`, and `weatherCategoryId`. Category `1` means all types; missing, zero, or unknown categories fail server configuration validation.
- The unit, its current tile, the current weather, and the CO skill area must all match, using the same category semantics as `selfUnitCommonAttributes.conditions`. A CO unit bypasses only the area check.
- Range modifiers still stack, including negative modifiers. Maximum range continues to be calculated from the pre-movement state.
- All six active configuration workbooks were migrated independently: existing empty unit categories became `1`, and existing range effects received tile/weather category `1`. Skills without range effects remain unchanged. The source columns are ordered as `unitCategoryId` (`AB`), `tileCategoryId` (`AC`), `weatherCategoryId` (`AD`), and `upperOffset` (`AE`).
- Regenerate protocol code with the external `ProtoGenerator\publish.bat` before running `ConfigGenerator\publish.bat`; deploy the generated protocol DLL, runtime code, and configuration binaries together. Existing scripts also update legacy-client outputs.
- Regression tests: `node --experimental-vm-modules --test tests/co-skill-attack-range.test.mjs`.
