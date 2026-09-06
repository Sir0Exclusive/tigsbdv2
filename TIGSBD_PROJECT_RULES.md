# TIGSBD PROJECT RULES

## Purpose

This file is the lightweight routing and context-control guide for the TIGSBD + Sarongo rebuild.

Its main purpose is to prevent unnecessary rereading of large project documents and reduce Copilot context/usage while keeping the project decisions consistent.

---

# 1. DOCUMENT SYSTEM

The project has three main reference documents:

1. `TIGSBD_NEW_PLATFORM_MASTER_SPEC.md`
   - Defines WHAT the platform must be.
   - Business requirements, architecture, features, data model, security, integrations, testing, and definition of done.

2. `TIGSBD_COPILOT_MASTER_BUILD_PROMPT.md`
   - Defines HOW Copilot should build it.
   - Development rules, implementation phases, workflow, verification process, and production process.

3. `TIGSBD_STYLE_UX_MOTION_MASTER_PROMPT.md`
   - Defines HOW the product should LOOK and MOVE.
   - Visual identity, UX, responsive behavior, animation, interaction, accessibility, and visual quality.

DO NOT treat these documents as three files that must always be read together.

---

# 2. CONTEXT LOADING RULE

### Read this file first.

Then load only the document(s) relevant to the current task.

Do NOT reread all three large documents on every task unless the task genuinely requires information from all three.

Use targeted search/headings/sections whenever possible instead of loading an entire document.

---

# 3. ROUTING MATRIX

| Current task | Primary document | Secondary document |
|---|---|---|
| Database/schema | MASTER_SPEC | BUILD_PROMPT if implementation process matters |
| Authentication | MASTER_SPEC | BUILD_PROMPT |
| Store architecture | MASTER_SPEC | BUILD_PROMPT |
| Catalog/products | MASTER_SPEC | STYLE_UX for UI |
| Cart/checkout | MASTER_SPEC | STYLE_UX for UI |
| Orders | MASTER_SPEC | BUILD_PROMPT |
| Admin | MASTER_SPEC | STYLE_UX for admin UI |
| Payments | MASTER_SPEC | BUILD_PROMPT |
| Shipping | MASTER_SPEC | BUILD_PROMPT |
| Analytics/Google/Meta | MASTER_SPEC | BUILD_PROMPT |
| SEO | MASTER_SPEC | STYLE_UX |
| Performance | MASTER_SPEC | STYLE_UX |
| Frontend layout | STYLE_UX | MASTER_SPEC for required functionality |
| Product cards | STYLE_UX | MASTER_SPEC |
| Homepage | STYLE_UX | MASTER_SPEC |
| Navigation/header | STYLE_UX | MASTER_SPEC |
| Mobile UI | STYLE_UX | MASTER_SPEC |
| Animations/motion | STYLE_UX | — |
| Typography/colors | STYLE_UX | — |
| Accessibility | STYLE_UX | MASTER_SPEC |
| Build phase/process | BUILD_PROMPT | MASTER_SPEC |
| Local verification | BUILD_PROMPT | STYLE_UX when visual |
| Deployment/Vercel | BUILD_PROMPT | MASTER_SPEC |
| Testing/E2E | BUILD_PROMPT | MASTER_SPEC |
| Project workflow | BUILD_PROMPT | — |
| Business requirement | MASTER_SPEC | — |

---

# 4. DOCUMENT AUTHORITY

When information appears to conflict, use this order:

1. Explicit instruction from the user in the current conversation.
2. This `TIGSBD_PROJECT_RULES.md`.
3. `TIGSBD_NEW_PLATFORM_MASTER_SPEC.md` for product/business/architecture requirements.
4. `TIGSBD_STYLE_UX_MOTION_MASTER_PROMPT.md` for visual/UX/motion decisions.
5. `TIGSBD_COPILOT_MASTER_BUILD_PROMPT.md` for implementation workflow and process.

Security, privacy, accessibility, and platform constraints must always be respected even if an older project instruction conflicts with them.

Never silently change an established architecture decision.

If a genuine conflict is discovered, stop and ask for clarification before making a destructive or architectural change.

---

# 5. DO NOT REUSE THE OLD CODEBASE

This is a clean-slate rebuild.

The old TIGSBD project is reference material only.

Do NOT:
- copy old application code
- migrate old architectural mistakes automatically
- assume old database structure is still correct
- import old Laravel implementation patterns
- preserve broken behavior merely because it existed before

Only preserve old features or visual ideas when they are explicitly included in the new specifications or requested by the user.

---

# 6. CORE ARCHITECTURE REMINDER

TIGSBD and Sarongo are two independent storefront catalogs under one shared commerce infrastructure.

They share:
- customer identity/account
- address book
- cart
- checkout
- order system
- payment abstraction
- shipping framework
- analytics/marketing infrastructure

Products remain store-specific.

A customer can put products from both stores into one cart and complete one checkout.

A mixed cart creates one order containing line items that clearly identify their store.

Admin has one unified order center with store filters.

Store-aware roles/permissions prevent unauthorized access to another store's private catalog/settings.

---

# 7. MOCK / DEMO DATA RULE

The platform must support realistic synthetic demo/mock data for development and visual QA.

Demo records must be clearly identifiable, for example with:
- `isDemo`
- `dataSource`
- `seedBatchId`

Demo data must never be treated as real customer/business data.

The admin must eventually have a Demo/Mock Data Management area that can:
- seed/reseed demo data
- delete selected demo data
- delete all demo data
- require confirmation
- safely delete only explicitly marked demo records
- maintain audit/safety protections

The application must continue working correctly after all demo data is removed.

Use demo data to visually verify:
- both storefronts
- products
- categories
- search
- cart
- mixed-store checkout
- orders
- admin
- analytics events
- empty states

---

# 8. DEVELOPMENT WORKFLOW

Build incrementally.

For each major phase:

1. Understand the relevant requirement.
2. Inspect only the relevant project files.
3. Implement the smallest coherent phase.
4. Run lint/type checks/tests/build checks as appropriate.
5. Start the local development server.
6. Visually inspect the result when browser tooling is available.
7. Fix issues found during verification.
8. Report what was completed and verified.
9. Continue only when the phase is stable.

Do not make large unrelated changes while working on one phase.

---

# 9. CONTEXT-EFFICIENCY RULES

To reduce Copilot usage:

- Do not paste all project documents into every prompt.
- Do not reread entire documents when one section is enough.
- Search for headings, keywords, feature names, or exact requirements.
- Inspect only the files needed for the current implementation.
- Keep implementation prompts focused on one task.
- Prefer short summaries of already-established decisions.
- Do not repeatedly rediscover decisions that are already documented.
- Do not ask Copilot to "review the whole project" unless a full-project audit is actually required.
- When possible, use a small current-state file instead of rereading historical documentation.

Recommended future file:

`PROJECT_STATE.md`

This should remain short and contain only:
- current phase
- completed phases
- active task
- important recent decisions
- known issues
- next step

It should NOT become another large specification.

---

# 10. HOW TO UPDATE THE DOCUMENTS

If a permanent architecture/business requirement changes:
- update `TIGSBD_NEW_PLATFORM_MASTER_SPEC.md`
- update `PROJECT_STATE.md` if relevant

If a permanent visual/UX/motion decision changes:
- update `TIGSBD_STYLE_UX_MOTION_MASTER_PROMPT.md`
- update `PROJECT_STATE.md` if relevant

If the development workflow changes:
- update `TIGSBD_COPILOT_MASTER_BUILD_PROMPT.md`

Do not create conflicting duplicate instructions in random files.

---

# 11. CURRENT STACK DIRECTION

The new platform is intended for:

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Turso/libSQL
- Drizzle ORM or another Turso-compatible typed ORM
- Zod
- secure authentication/session architecture
- Vercel production hosting

Use abstractions where future infrastructure migration is expected, especially media/image storage.

Do not hardcode secrets.

Maintain `.env.example`.

---

# 12. LOCAL-FIRST RULE

Development happens locally first.

Before production deployment:
- the app must run locally
- major functionality must be tested locally
- responsive layouts must be checked
- important user flows must be verified
- mixed-store commerce must be verified
- demo data lifecycle must be verified

Production deployment comes after the local implementation is stable.

---

# 13. MANDATORY CROSS-STORE TEST

At minimum, the complete system must eventually prove this flow:

1. Customer enters TIGSBD.
2. Adds a TIGSBD product.
3. Switches to Sarongo.
4. Adds a Sarongo product.
5. Opens the shared cart.
6. Sees both stores represented correctly.
7. Completes one checkout.
8. One mixed-store order is created.
9. Order items retain their store identity.
10. Customer can see the order.
11. Admin sees the order in the unified order center.
12. Admin can filter All / TIGSBD / Sarongo / Mixed.
13. Store permissions remain enforced.
14. Analytics/marketing attribution remains store-aware.

This is a critical acceptance scenario.

---

# 14. QUICK COPILOT INSTRUCTION

When starting a new task, Copilot should conceptually follow:

"Read `TIGSBD_PROJECT_RULES.md` first. Then identify the minimum relevant reference document and relevant section for this task. Do not reread unrelated project documents. Inspect only the necessary code/files. Preserve established architecture decisions. Implement only the requested scope, verify locally, and report the result."

---

# 15. SIMPLE RULE TO REMEMBER

**MASTER SPEC = WHAT**

**BUILD PROMPT = HOW**

**STYLE/UX/MOTION = LOOK + FEEL**

**PROJECT RULES = WHICH ONE TO READ**

Keep context small. Keep decisions centralized. Build one verified phase at a time.
