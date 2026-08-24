# Performance-Reliability

## Objective

Code style rule: LOW cognitive difficulty + HIGH perf (O(1)/O(n) lookup).
Binding for write (`@frontend-dev`) + review (`@code-review`). Violation =
REJECT.

---

## Cognitive difficulty

- FLAT > nested. Depth ≤2. Deeper → extract fn.
- Early return. Guard first. Happy path flat.
- Named predicate. `const isLethal = life <= 0`. Never inline `if (life <= 0)`.
- Small fn. ≤20 lines. One job. Name = verb + noun.
- No clever. No one-liner golf, no trick ternary, no fancy reduce.
- Explicit > implicit. No hidden state, no surprise side-effect.
- One concern per fn. Layout XOR logic XOR IO.
- Obvious > clever. 3am reader must get it first pass.

## Performance (lookup)

- Lookup = Map/Set/object for LARGE-N or loop-nested lookups. NEVER
  `indexOf`/`find`/`includes` inside a loop = O(n²). REJECT. Build Map once,
  reuse.
- Bounded-small arrays (n ≤ ~10) may be scanned inline: O(n) with tiny constant
  is within norm. `new Set(arr)` build ≈ `arr.includes(x)` for small N — no win.
  Don't "fix" what's free.
- Dedupe = Set. Not `filter + indexOf`.
- Hoist lookup out of loop/render — one Map build, many reads — ONLY when N is
  large or the rebuild repeats inside a loop. Small-N per-render scan is fine.
- Static data → module const. Derived → cache ONLY if cache pays.
- `Promise.all` over sequential await. No waterfall.
- Big-O documented: O(1)/O(n) norm. O(n²) needs written justification.

## Write checklist (frontend-dev)

- [ ] Depth ≤2. Guard returns first.
- [ ] Predicates named. No inline magic condition.
- [ ] Fn ≤20 lines. One job.
- [ ] Lookup via Map/Set. Zero array-scan-in-loop. Small-N inline scan OK (n ≤
      ~10).
- [ ] Big-O stated for non-trivial fn.

## Review checklist (code-review)

- [ ] Array scan in loop for membership/key → REJECT. O(n²). Small-N inline scan
      (n ≤ ~10) OK.
- [ ] Nested >2, no guard return → REJECT.
- [ ] Inline magic predicate → REJECT. Name it.
- [ ] Lookup rebuilt per call/render → REJECT. Hoist/cache.
- [ ] Clever golf → REJECT. Boring wins.

## Reject format

```
[PERF-REL] file:line — problem. Fix: solution.
```

## Priority

Perf-reliability ≥ style. Both ≥ speed of writing. Contract = AGENTS.md +
DESIGN.md + SPEC.md first; this doc refines, never overrides.
