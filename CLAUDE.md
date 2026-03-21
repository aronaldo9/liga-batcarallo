# Project Overview

This is a solo-maintained project.

Goals:

- simplicity
- readability
- maintainability
- fast iteration
- efficient use of Claude tokens

Avoid unnecessary complexity or over-engineering.

---

## Core Principles

1. Prefer the smallest possible change that solves the problem.
2. Do not propose architectural changes unless explicitly requested.
3. Do not introduce new dependencies without clear necessity.
4. Reuse existing patterns in the codebase.
5. Preserve existing behavior unless the user asks to modify it.
6. Do not suggest improvements outside the scope of the request.

---

## Token Efficiency Rules

- Keep explanations concise.
- Do not repeat context unnecessarily.
- Avoid long multi-step plans unless required.
- Solve tasks in a single iteration when possible.

---

## Workflow

Default approach:

1. Understand the request
2. If needed, propose a minimal plan
3. Implement
4. Stop

If the task is simple, do not create a plan. Execute directly.

---

## Accuracy Rules

- Never assume functions, APIs, or files exist without verifying.
- Always read relevant files before making changes.
- If something is unclear, ask instead of guessing.
- Do not invent libraries, functions, or configurations.
- Explicitly state uncertainty when it exists.

---

## Code Modification Policy

- Prefer small incremental edits.
- Avoid rewriting entire files.
- Do not refactor unrelated code.
- Keep diffs minimal and focused.

---

## Safety

Never:

- expose secrets
- modify environment variables
- change deployment configuration
- perform destructive operations without explicit request

---

Stop once the task is completed. Do not continue suggesting improvements.
