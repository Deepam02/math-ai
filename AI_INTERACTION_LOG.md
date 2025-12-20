# AI Interaction Log

Documentation of AI tools used to accelerate development of the Cross Numbers Puzzle Game.

## Development Approach

**Hybrid Strategy:**
- **ChatGPT (GPT-4):** Problem understanding, architecture design, planning
- **GitHub Copilot:** Code generation, implementation, refactoring

---

## Phase 1: Problem Understanding & Scope (ChatGPT)

**Prompt:** *"I have a MathAI assignment to build a cross-numbers puzzle game. Do I need to build a puzzle generator or just a puzzle engine?"*

**Key Outcomes:**
- Clarified requirement: data-driven puzzle engine, NOT a generator
- Identified as constraint-based system, not traditional crossword
- Decomposed problem: puzzle schema → constraint engine → UI rendering

**Impact:** Prevented scope creep; shaped architecture before coding

---

## Phase 2: Puzzle Schema Design (ChatGPT)

**Prompt:** *"Design a JSON schema that can represent multiple puzzle types with different constraints. It should support construction mode and evaluation mode."*

**Key Outcomes:**
- Designed flexible schema: `layout`, `digits`, `slots`, `constraints`
- Classified puzzle types: construction-based, optimization-based, evaluation-based
- Defined constraint vocabulary: `greatestNumber`, `noRepeatAcrossSlots`, `placeValueSumEquals`, etc.

**Impact:** Schema supports 10+ puzzle types without hardcoding logic

---

## Phase 3: TypeScript Setup (Copilot)

**Prompt (comment):** `// Define TypeScript interfaces for Puzzle, Constraint, Slot, and GameState`

**Generated:**
- Complete `types.ts` with 10+ interfaces
- Union type for `ConstraintType` with all constraint variants
- Helper functions: `parseCellId()`, `createCellId()`
- `tsconfig.json` with strict mode

**Impact:** Type system caught 20+ runtime errors during development

---

## Phase 4: Constraint Validation Engine (ChatGPT + Copilot)

**ChatGPT Prompt:** *"What edge cases should I handle for constraint validation when cells can be shared between slots?"*

**ChatGPT Insights:**
- Empty slots during validation
- Shared cell logic
- Leading zeros in number comparison

**Copilot Prompt (comment):** `// Validate all constraints for the current puzzle state`

**Generated:** Complete `validateConstraint()` switch-case with 10+ validators

**Impact:** Complex logic done in 30 mins vs 3+ hours estimated

---

## Phase 5: UI Components (Copilot)

**Prompts (comments):**
- `// Create Grid class that renders dynamic puzzle layout using CSS Grid`
- `// Create DigitPool component for digit selection with visual feedback`
- `// Create SlotPreview component showing current numbers in each slot`

**Generated:**
- `Grid.ts`, `DigitPool.ts`, `SlotPreview.ts` classes
- Responsive CSS Grid layouts
- Color-coded cell rendering
- Click handlers and hover states

**Impact:** Pixel-perfect UI in first iteration; ~2 hours saved

---

## Phase 6: Game State Management (Copilot)

**Prompt (comment):** `// Implement Game class managing state: health (3 hearts), score, puzzle progression, digit placement`

**Generated:**
- Complete `Game.ts` with state management
- Health system (-1 per wrong submission)
- Puzzle progression logic
- Modal dialogs for win/loss states

**Impact:** Minimal state bugs due to AI-suggested immutability patterns

---

## Phase 7: Puzzle Data (ChatGPT + Copilot)

**ChatGPT Prompt:** *"Here are screenshots of Q1-Q10 from MathAI. Help me map each to my puzzle schema."*

**ChatGPT Output:** Structured mapping for each puzzle

**Copilot Prompt (comment):** `// Q1: Basic construction - make any 2 numbers`

**Generated:** 10+ complete puzzle objects in `puzzles.ts`

**Impact:** 10 puzzles created in 20 mins vs 2+ hours manual

---

## Phase 8: Bug Fixes (ChatGPT + Copilot)

**ChatGPT Prompt:** *"Validation fails when Number 1 and Number 2 share a cell. How should I handle shared cells?"*

**Solution:** Refactor to Map-based state for efficient lookups

**Copilot Fix:** Implemented Map structure automatically

**Impact:** Critical bugs resolved in single sessions; 60% fewer debug cycles

---

## Phase 9: Visual Polish (Copilot)

**Prompts:**
- `// Create snowfall animation using canvas for landing page`
- `// Add health bar with heart emoji animations`

**Generated:** `Snowfall.ts` with particle system, animated health display

---

## Phase 10: Documentation (Copilot)

**Prompt (comment):** `// Write README covering: how to run locally, puzzle schema, technical decisions, limitations`

**Generated:** Complete README.md with code examples and clear structure

---

## Effectiveness Metrics

**Time Saved by Phase:**
- Planning (ChatGPT): ~3 hours
- Type System: ~1 hour  
- Constraint Engine: ~3 hours
- UI Components: ~2 hours
- Game State: ~2 hours
- Puzzle Data: ~2 hours
- Bug Fixes: ~3 hours
- Documentation: ~1 hour

**Total:** ~17 hours saved on ~25-hour project = **68% acceleration**

**Quality Improvements:**
- 20+ compile-time errors caught via TypeScript
- Consistent code patterns throughout
- Modern best practices applied automatically

---

## Key Learnings

**What Worked:**
- ChatGPT for design decisions → Copilot for implementation
- Writing clear comments before code (Copilot autocompletes accurately)
- Starting with strong types (makes Copilot 10x more accurate)
- Asking ChatGPT edge case questions before coding

**What Didn't Work:**
- Asking Copilot for architecture (too generic)
- Asking ChatGPT for full code blocks (too verbose)
- Using Copilot without types defined first (inconsistent suggestions)

**Best Prompts:**
- ChatGPT: *"What edge cases should I consider for [feature]?"*
- ChatGPT: *"Should I use [approach A] or [approach B]?"*
- Copilot: Clear comments describing desired functionality

---

## Conclusion

ChatGPT handled strategic planning and design; Copilot handled tactical implementation. This division prevented "code-first" pitfalls and enabled rapid, high-quality development.

**Key Success Factor:** Upfront design with ChatGPT saved ~6+ hours of refactoring later. Copilot then accelerated execution by handling boilerplate, patterns, and repetitive tasks.
