# Reading Engine

The reading engine connects player-scoped IndexedDB records, adaptive placement, runtime-validated lesson data, read-aloud services, mastery, rewards, restoration, and parent reporting. UI components receive typed records and return updated `PlayerProfile` values through the repository abstraction. No raw voice recording is stored.

Core types live under `placement/types.ts`, `lessons/types/`, `speech/types/`, and `profiles/types/`. Later regions add validated lesson collections and mastery policies without changing the shared runner.
