<!-- BEGIN UNIFIED_AGENT_GUIDELINES -->
## Shared agent baseline

This block is a shared cross-repo baseline.

**Priority order:** explicit user request > repo-specific docs in this repo > this shared block.

### Always read local context first
- Read local guidance before acting when present: `context.md`, `README.md`, architecture notes, benchmark notes, experiment notes, or existing `AGENTS.md` sections.
- If repo-specific instructions conflict with this shared block, follow the repo-specific instructions and state that you did so.

### Think before coding
- Do not make silent assumptions.
- Surface ambiguity, tradeoffs, and simpler alternatives before implementing.
- If something is unclear, stop and clarify rather than coding against a guess.

### Simplicity first
- Use the smallest correct change.
- Avoid speculative abstractions and optionality that were not requested.
- Prefer clarity and directness over cleverness.

### Surgical changes
- Change only what the request requires.
- Do not opportunistically refactor adjacent code.
- Remove only the dead code that your own edit creates.
- Mention unrelated issues separately instead of fixing them by default.

### Goal-driven execution
- Define the success condition before making changes.
- Bug fix: reproduce, then fix, then verify.
- Refactor: confirm behavior before and after.
- Feature: add or run the narrowest validation that proves it works.

### Workflow guidance for this user's repos
- Prefer reproducible scripts over manual notebook-only state.
- For research / ML repos, preserve label conventions, metric semantics, and benchmark comparability unless the task explicitly changes them.
- Keep architecture changes separate from protocol or data changes when possible.
- For costly jobs, validate on a small subset before large runs.
- Write artifacts to established output directories such as `analysis_outputs/`, `runs/`, or repo-defined output roots.

### Reporting discipline
- Report what changed, how it was validated, and where outputs were written.
- If something is only partially verified, say so explicitly.
- Include exact commands for non-trivial experiments or batch jobs when relevant.

### Safety around project assets
- Do not move or delete datasets, checkpoints, notebooks, or generated experiment outputs unless asked.
- Preserve comments and docs you do not fully understand.
<!-- END UNIFIED_AGENT_GUIDELINES -->

