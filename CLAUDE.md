<!-- BEGIN UNIFIED_AGENT_GUIDELINES -->
## Shared coding-agent baseline

This block is a shared baseline for all repos. Keep repo-specific guidance above or below it.

**Priority order:** explicit user request > project-specific docs in this repo > this shared block.

### 1. Read the local context first
- Before changing code, read repo-local guidance if present: `AGENTS.md`, `context.md`, `README.md`, architecture notes, or existing `CLAUDE.md` sections.
- If project-specific rules conflict with this shared baseline, follow the project-specific rules and say so explicitly.

### 2. Think before coding
- Do not guess silently when the task is ambiguous.
- State assumptions explicitly.
- If multiple interpretations exist, present them briefly instead of choosing one invisibly.
- If a simpler or safer approach exists, say so.

### 3. Simplicity first
- Write the minimum code that solves the stated problem.
- Avoid speculative abstractions, premature configuration knobs, and future-proofing that was not requested.
- If a 200-line solution can be a clear 50-line solution, prefer the smaller one.

### 4. Surgical changes
- Touch only the code required for the request.
- Do not opportunistically reformat, rename, refactor, or rewrite adjacent code unless it is necessary.
- Remove only the dead imports/variables/functions that your own change created.
- If you spot unrelated technical debt, mention it separately instead of changing it by default.

### 5. Goal-driven execution
- Convert the task into explicit success criteria and verify them.
- Bug fix: reproduce first, then make the repro pass.
- Refactor: preserve behavior and verify before/after.
- Feature work: add or run the smallest useful validation that proves the feature works.

### 6. Repo workflow conventions for this user's projects
- Prefer reproducible scripts and commands over ad-hoc manual steps.
- When running experiments, start with the smallest validating run before large sweeps.
- For ML/research repos, do **not** silently change:
  - label conventions
  - metric definitions
  - benchmark protocol
  - dataset inclusion/exclusion rules
  - train/eval comparability assumptions
- If you change experimental protocol, call it out explicitly and separate it from architecture/code changes.

### 7. Expensive jobs and artifacts
- Before launching long or costly jobs, estimate what will run and whether a smaller validation can de-risk it first.
- Put generated outputs in repo-appropriate locations such as `analysis_outputs/`, `runs/`, or existing artifact directories.
- Do not scatter one-off files around the repo root unless the repo already uses that pattern.
- Do not move or delete datasets, checkpoints, notebooks, or generated results unless asked.

### 8. Verification and reporting
- Report exactly what was changed, how it was verified, and where outputs were written.
- Include exact commands for non-trivial runs when relevant.
- If verification is partial, say what remains unverified.

### 9. Style and comments
- Match the existing code style of the repo.
- Preserve comments you do not fully understand.
- Do not rewrite documentation or comments unless the task requires it.

**Working signal:** fewer unnecessary diffs, fewer overengineered solutions, and more explicit assumptions and verification.
<!-- END UNIFIED_AGENT_GUIDELINES -->

