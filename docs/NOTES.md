## Single-player war architecture
- Campaign and single-ranked games use a viewless, authoritative `innerWar` and a visible `outerWar`, restricted to the human players' shared team.
- Player requests, AI decisions, automatic operations, and scoring run against `innerWar`. Its team-filtered operation results update `outerWar` through the same executors used by multiplayer games.
- A shared runner lock serializes player and automatic operations across inner calculation and outer playback. Runner and inner-executor locks are released on failure; results from unloaded war pairs are discarded.
- Saves and score validation retain the full authoritative state, random seed, and operation history. Loading a save regenerates the filtered outer state.
- Single-custom and single-free games continue to use a unified war.

## CO skill attack-range conditions
- `persistent.selfUnitCommonAttributes.attackRangeOffsets` contains only `upperOffset`. Its four filters are shared with the other common attributes through `selfUnitCommonAttributes.conditions`.
- Shared conditions require a valid `coSkillAreaTypeId`, `unitCategoryId`, `tileCategoryId`, and `weatherCategoryId`. Category `1` means all types; missing, zero, or unknown unit/tile/weather categories fail server configuration validation.
- The unit, its current tile, the current weather, and the CO skill area must all match. A CO unit bypasses only the area check.
- Range modifiers still stack, including negative modifiers. Maximum range continues to be calculated from the pre-movement state.
- The `CoSkill` source now has a single attack-range column, `upperOffset` (`AA`), immediately to the right of `moveRangeOffsets.offset` (`Z`). The four former attack-range condition columns were removed.
- Migration is independent for each version, CO, and skill group. Range effects are added only to the first group skill with identical shared conditions; otherwise a new range-only skill is created and appended to that group's ID list. New IDs use the next unused number in the source skill's 100-ID block, and new rows stay with that block.
- The six-version migration reused 60 skills and created 49 skills for 109 range effects. Nine source skills that became empty were replaced by their new range-only skills, preserving `showZone`. All 2,235 skill groups retain their range totals per condition, ordered non-range effects, and zone visibility.
- The old `Persistent` field number `3` is reserved. The new nested range message uses common-attribute field number `5`; code and configuration binaries must be updated together.
- Regenerate protocol code with the external `ProtoGenerator\publish.bat` before running `ConfigGenerator\publish.bat`; deploy the generated protocol DLL, runtime code, and configuration binaries together. Existing scripts also update legacy-client outputs.
- Regression tests: `node --experimental-vm-modules --test tests/co-skill-attack-range.test.mjs`.

## Configuration/protobuf migration workflow

### Manual CO skill HP
- Both instant-skill executors compute the skill user's CO zone radius once per skill and pass it to the effects that check the CO area.
- `instantManual.unitAttributes.enemyHp` is a sibling of `selfHp` and shares `conditions`. Its `regularHpOffset` has no explicit default; a missing offset is invalid, while explicit zero leaves enemy HP unchanged. Enemy CO units must still match the skill area.
- The former `InstantManual.enemyUnitHp` tag (`2`) is reserved. Existing enemy HP effects use weather category `1` to retain their previous all-weather behavior.
- `instantManual.unitAttributes.selfHp` holds `regularHpOffset` and `costMultiplierPct`. Its sibling `conditions` filters by CO area, unit type, terrain, weather, and loaded state. Callers pass `isCoOnboard` as true only when the target carries the skill user's own CO; this bypasses only the area check. An explicit zero HP offset still rounds up to the next displayed HP value.
- The [client](../src/coSkills/utils/instantManual/Conditions.ts) and [server](../../TinyWarsGameServerCs/Twgs.Common/src/coSkills/utils/instantManual/Conditions.cs) evaluate these filters in dedicated `instantManual` modules, independently of persistent attributes.
- All seven active workbooks were migrated. Existing HP effects retain their offsets and costs; previously unrestricted unit, terrain, and weather categories use category `1`. The old `InstantManual` field `1` is reserved and `unitAttributes` uses field `20`. Deploy regenerated configuration binaries and the protocol DLL with the matching runtime code.

### Manual CO skill primary ammo
- `instantManual.unitAttributes.selfPrimaryAmmo` sits beside `enemyHp` and uses the same `conditions`. It requires an explicit `offsetPct`. Positive offsets use maximum ammo; negative offsets use current ammo. The skill user's CO still has to match the area.
- The seven active workbooks use unrestricted terrain, weather, and loaded-state filters for existing ammo effects. The former `InstantManual` field `3` is reserved; `UnitAttributes.selfPrimaryAmmo` uses field `4`. Deploy the regenerated configurations with the matching client and server code.

### Sources, consumers, and generated outputs
- Work spans three sibling repositories: `TinyWarsClientInVite`, `TinyWarsGameServerCs`, and `TinyWarsExternals`. Inspect each worktree before editing; preserve unrelated staged and unstaged changes.
- The authoritative protocol is [CommonProto.proto](../../TinyWarsExternals/utils/ProtoGenerator/protoSrc/CommonProto.proto), shared by the client, server, and configuration generator. Change this source rather than hand-editing generated schemas, accessors, DLLs, or binary configurations.
- Active workbook inputs are explicitly listed in [ConfigGenerator/index.js](../../TinyWarsExternals/utils/ConfigGenerator/index.js), not discovered from every spreadsheet in the directory. Currently they are `FullConfigA0000000`, `FullConfigB0000000`, `FullConfigB0000001`, `FullConfigB0000002`, `FullConfigB0000003`, `FullConfigC0000000`, and `FullConfigD0000000`, under [configSrc](../../TinyWarsExternals/utils/ConfigGenerator/configSrc/). Each is a complete, independent configuration; migrate each independently. Do not edit `oldConfigSrc` or Excel `~$` lock files as configuration sources.
- Generator sources are [ProtoGenerator/index.ts](../../TinyWarsExternals/utils/ProtoGenerator/index.ts) and [ConfigGenerator/index.ts](../../TinyWarsExternals/utils/ConfigGenerator/index.ts). Their batch scripts execute emitted `index.js` directly; source changes require rebuilding the corresponding JavaScript.
- Protocol generation updates [client schemas](../src/proto/schema/), [server accessors](../../TinyWarsGameServerCs/Twgs.Common/src/proto/accessors/), the external `clientDependencies\libs\ProtoSchema` files, the map-cache converter schema, and `serverDependencies\CsharpDll\CommonProto.dll`. The Vite schema output directory is recreated during generation; never put hand-written code there.
- Configuration generation writes matching binary copies to [Vite resources](../src/assets/resource/config/) and [server resources](../../TinyWarsGameServerCs/Resource/GameConfiguration/); legacy-client configuration copying is currently disabled in its source. Existing protocol scripts still write legacy-client outputs. Confirm those destinations are in scope before running them; do not silently expand the task to legacy runtime code.
- Client implementations are under [coSkills utilities](../src/coSkills/utils/persistent/) and [Unit.ts](../src/units/Unit.ts); server counterparts are under [coSkills utilities](../../TinyWarsGameServerCs/Twgs.Common/src/coSkills/utils/persistent/) and [Unit.cs](../../TinyWarsGameServerCs/Twgs.Common/src/units/Unit.cs). Trace all consumers of a changed property, not only generated getters.
- Server legality checks live in [PhCfgFullConfig.cs](../../TinyWarsGameServerCs/Twgs.Common/src/ProtoHelpers/PhCfgFullConfig.cs). [GcData](../../TinyWarsGameServerCs/Twgs.Common/src/GameConfig/GcData.cs) invokes the full validator before extracting configuration data. New or moved effects must participate in both their value checks and the enclosing "has at least one effect" check.

### Spreadsheet parsing contract
- The generator uses ExcelJS. Column A contains `##key`, `##comment`, and `##type` markers; multiple `##key` rows build each column's nested property path. Merged headers supply repeated keys through their master cells. Determine boundaries and paths from these markers instead of assuming every sheet has the same header rows.
- `##comment` rows are ignored. Data rows have an empty column-A marker, and parsing stops at the first row with no actual cells. Removing a skill must not leave an entirely empty row in the middle of the data.
- Scalar `bool` cells must contain numbers such as `0` and `1`, not Excel boolean `TRUE`/`FALSE` or strings. Integer cells require numeric int32 values. Array fields such as skill-ID lists accept comma-separated cell values; retain their order.
- Blank cells omit properties; they do not automatically mean unrestricted conditions. Filling a previously absent nested branch can create a new effect or an invalid conditions-only object. Populate defaults only for effects that already exist or are deliberately being introduced.
- Read category membership and validation semantics from the particular version and the runtime helpers. Do not assume custom category IDs mean the same thing across versions or treat missing values as category `1`.
- The existing generator only compares raw/decoded JSON lengths as an encoding sanity check. This is not a substitute for deep structural comparison, semantic equivalence, or server validation.

### Safe workbook layout changes
- Close affected workbooks before writing, and check for lock files or concurrent edits. Capture the original workbook bytes, parsed configuration, and relevant binary outputs before mutation.
- Keep related columns together. New sub-properties belong beside the existing properties of their parent, not at the far-right edge of the sheet. Use header paths to locate them; recorded column letters describe the current layout, not stable identifiers.
- ExcelJS is useful for reading and validating logical cell values. For surgical edits, ZIP/XML changes can preserve workbook features that a full rewrite might normalize or discard; use the existing generator dependencies rather than installing another spreadsheet tool unnecessarily.
- Resolve sheet XML through `xl/workbook.xml` and its relationships. Do not infer the ZIP part from sheet order or `sheetId`: the same named sheet can have a different part in different versions.
- Moving/inserting/deleting cells must keep cell references and order, column widths, row heights, merged headers, dimensions, row spans, filters and filter-column indices, defined names, conditional-formatting/data-validation ranges, and any formulas consistent. Remove collapsed merge ranges and keep header groups correctly extended over their new children.
- Move comments and their associated VML drawing anchors as well as visible cells. VML row/column coordinates are zero-based; drawing positions and sizes can also need adjustment. Inspect relationships for other dependent drawings or tables before editing.
- Validate the candidate workbook in memory before writing. Compare its entire parsed configuration with the intended result, check the exact requested column order, preserve unrelated cells/styles/comments, and compare untouched ZIP entries byte-for-byte where practical. Recheck that source files have not changed during preparation.

### CO skill splitting, merging, and deletion
- `CoBasic` defines one CO per row. `passiveSkillIds`, `powerSkillIds`, and `superPowerSkillIds` are separate ordered groups; the current group replaces the other groups rather than implicitly adding passive skills. Every referenced ID must resolve to one `CoSkill` row.
- For a merge, compare the complete conditions within the same version, CO, and group, preserving the distinction between absent values and explicit valid zero values. Confirm the runtime meaning of all filters and exemptions first; if they differ, clarify the intended behavior instead of assuming they are interchangeable.
- Reuse only the first matching skill in group order. If no match exists, create an independent skill and add its ID only to the corresponding group. Check ID uniqueness and existing block conventions; the attack-range migration used the next free ID above the existing IDs in the source's 100-ID block.
- Analyze every reference to source and target IDs before changing shared rows. A skill can be used by multiple COs or groups, including shared IDs such as `99999999`; modifying one shared target can unintentionally change groups outside the migration scope.
- Preserve aggregation semantics: combine additive offsets only when appropriate, and never assume multipliers, flags, or order-dependent effects can be added. Do not attach the same extracted effect to every matching skill.
- Preserve all unrelated effects, group ordering where behavior depends on it, and display flags such as `showZone`. If extraction leaves a source skill empty, remove or replace that row and update all references; do not leave empty skills, duplicate IDs, dangling references, or unused newly created skills.
- Plan changes for all versions first. Keep a temporary per-version source-to-target mapping so that every extracted effect has exactly one destination and can be verified before snapshots are cleaned up.

### Protocol and generation sequence
- The protocol currently uses edition `2024`, not proto3 syntax. Preserve existing wire field numbers, and reserve removed numbers instead of reusing them. A move into another message is a wire-format change even if the property name stays the same.
- The current protobufjs/protoc combination rejected quoted reserved field names during migration; numeric `reserved` declarations worked. Validate parsing with the installed toolchain rather than copying syntax from a different protobuf edition.
- Apply schema, workbook, client/server runtime, validation, and focused regression-test changes together. Generate protocol outputs before configuration binaries, and deploy code, protocol DLL, and binaries as a matched set.
- Run each batch file from its own directory. From Windows PowerShell, use `& $env:ComSpec /c publish.bat`; do not assume working-directory changes persist between separate tool calls.
- The protocol batch script does not stop reliably after an intermediate command fails, and its final exit code can still be zero. Read the full output, verify the expected schema/accessor changes, and use type-check/build results to detect stale generated files.
- If generator logic changes, rebuild its JavaScript before executing the batch. Do not hand-patch generated files to make a stale generation appear successful.

### Verification checklist
1. Compare generated, decoded configurations against the intended parsed workbook data, not just file sizes or successful generator messages.
2. Verify each corresponding binary copy is identical across the authorized client/server destinations. For layout-only changes, require byte-for-byte identity with the original binaries.
3. For skill migrations, compare every CO/group before and after: referenced-ID validity and uniqueness, effect totals keyed by the full condition tuple, ordered non-migrated effects, and `showZone` behavior. This catches accidental duplicates that per-row checks miss.
4. Run full configuration legality checks for every active version without starting the live server. A temporary console harness referencing `Twgs.Common` can parse each file with `FullConfig.Parser`, assert `getErrorCode() == NoError`, and construct `GcData`. Use cloned configurations for missing/invalid-condition and zero/empty-effect rejection cases.
5. Test actual runtime behavior for matching and nonmatching categories, CO-onboard exemptions, skill-area boundaries, positive/negative stacking, absent effects, and the affected unit call sites. Compare related attribute helpers where their semantics must agree.
6. In the Vite repository, run `npm run check` and the smallest relevant existing tests. The attack-range command is `node --experimental-vm-modules --test tests\co-skill-attack-range.test.mjs`. Application implementation imports must continue to use `src\internal.ts`.
7. In the server repository, the verified build command is `dotnet build TinyWarsGameServerCs.sln --no-restore --verbosity quiet`. Distinguish existing NuGet warnings from new compilation or validation failures; do not silently suppress failures.
8. The Node VM test loader does not handle arbitrary Vite asset URL imports such as `?url&no-inline`. If unrelated application initialization blocks a focused test, use existing isolated source/schema-loading patterns, report the limitation, and do not claim the full suite passed.
9. Update this document when the workflow or schema changes. Keep temporary migration scripts, original snapshots, and validation harnesses outside the repositories unless reusable tooling is explicitly requested; remove only task-created temporary files after successful validation. Do not update the root README or stage/commit changes unless requested.
