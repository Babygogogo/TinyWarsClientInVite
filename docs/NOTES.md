## Single-player war architecture
- Campaign and single-ranked games use a viewless, authoritative `innerWar` and a visible `outerWar`, restricted to the human players' shared team.
- Player requests, AI decisions, automatic operations, and scoring run against `innerWar`. Its team-filtered operation results update `outerWar` through the same executors used by multiplayer games.
- A shared runner lock serializes player and automatic operations across inner calculation and outer playback. Runner and inner-executor locks are released on failure; results from unloaded war pairs are discarded.
- Saves and score validation retain the full authoritative state, random seed, and operation history. Loading a save regenerates the filtered outer state.
- Single-custom and single-free games continue to use a unified war.
