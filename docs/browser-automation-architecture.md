# Browser Automation Architecture

This document defines Fulcra's provider-independent browser automation architecture.

---

## 1. Architectural Philosophy

Fulcra executes browser automation for asynchronous workflows (such as external research, inspection, or future portal integrations).

### Core Principles

1. **Provider-Agnostic Abstraction**: Application tasks and domain services interact exclusively with the `BrowserSession` and `BrowserProvider` interfaces. Playwright types (`Page`, `BrowserContext`, `Browser`) and provider-specific SDKs are strictly isolated behind the `src/infrastructure/browser/` boundary.
2. **Managed Browser Infrastructure**: Fulcra does not operate, scale, or maintain self-hosted browser fleets, Kubernetes worker pods, or persistent VM instances. When running live automation, Fulcra connects via WebSocket / CDP to a managed browser provider (e.g., Browserless, Browserbase, Cloudflare Browser).
3. **Trigger.dev Execution Only**: Browser automation is inherently asynchronous, resource-intensive, and long-running. It is triggered only from background tasks in `apps/trigger`. Browser execution is **never** executed inside synchronous API HTTP request loops or from the frontend.
4. **Context Isolation & Zero Leakage**: Every execution runs within a newly created, isolated browser context. Cookies, storage state, and authentication credentials are never shared across unrelated candidate or system workflows.

---

## 2. Abstraction Hierarchy

```text
Fulcra Background Task / Service
              │
              ▼
   BrowserProvider Interface
   (createSession, close)
              │
              ▼
    BrowserSession Interface
    (goto, click, fill, type, select, waitForSelector, getText, getAttribute, screenshot, evaluate, close)
              │
              ▼
    Playwright Adapter
    (PlaywrightSession wrapping playwright-core)
              │
     ┌────────┴────────┐
     ▼                 ▼
Remote Provider     Local / Mock
(WebSocket / CDP)   (Development / CI)
```

---

## 3. Directory Layout

```text
apps/trigger/src/infrastructure/browser/
├── browser-types.ts          # Core domain interfaces (BrowserSession, BrowserProvider, options)
├── browser-errors.ts         # Machine-readable error codes & Playwright error mapper
├── browser-safety.ts         # Navigation protocol validation & URL logging sanitization
├── browser-session.ts        # PlaywrightSession implementing BrowserSession
├── browser-provider.ts       # Provider factory (createBrowserProvider, getBrowserProvider)
├── lifecycle.ts              # withBrowserSession helper for deterministic disposal
├── providers/
│   ├── remote-provider.ts    # Managed remote browser adapter (chromium.connect)
│   ├── local-provider.ts     # Local Chromium adapter for dev debugging
│   └── mock-provider.ts      # Pure in-memory provider for hermetic testing
└── index.ts                  # Public module exports
```

---

## 4. Browser Session Lifecycle & Resource Cleanup

To prevent leaked browser processes, orphan sessions, or runaway cloud compute, all browser operations should be wrapped using the `withBrowserSession` lifecycle helper:

```typescript
import {
  getBrowserProvider,
  withBrowserSession,
} from "./infrastructure/browser"

export async function scrapePublicPage(targetUrl: string) {
  const provider = getBrowserProvider()

  return await withBrowserSession(
    provider,
    { viewport: { width: 1280, height: 800 } },
    async (session) => {
      await session.goto(targetUrl)
      const title = await session.getTitle()
      const content = await session.getText("main")
      return { title, content }
    }
  )
  // Session, pages, and contexts are deterministically closed in `finally`
}
```

### Configurable Limits

| Parameter                       | Default       | Purpose                                                    |
| ------------------------------- | ------------- | ---------------------------------------------------------- |
| `BROWSER_NAVIGATION_TIMEOUT_MS` | `30000` (30s) | Maximum time allowed for initial page navigation.          |
| `BROWSER_ACTION_TIMEOUT_MS`     | `10000` (10s) | Maximum time for selectors, clicks, typing, or inspection. |

---

## 5. Error Classification & Trigger.dev Retries

Browser operations frequently encounter transient network hiccups or target site load spikes. Errors are mapped into the `BrowserError` hierarchy, which integrates directly into Trigger.dev's retry engine:

| Error Code                  | Retryable? | Classification      | Trigger Action                      |
| --------------------------- | ---------- | ------------------- | ----------------------------------- |
| `BROWSER_LAUNCH_FAILED`     | **Yes**    | Transient           | Exponential backoff retry           |
| `BROWSER_NAVIGATION_FAILED` | **Yes**    | Transient           | Exponential backoff retry           |
| `BROWSER_TIMEOUT`           | **Yes**    | Transient           | Exponential backoff retry           |
| `BROWSER_SESSION_EXPIRED`   | **Yes**    | Transient           | Exponential backoff retry           |
| `BROWSER_PROVIDER_ERROR`    | **Yes**    | Transient           | Exponential backoff retry           |
| `BROWSER_ACTION_FAILED`     | **No**     | Permanent / Domain  | Fail task immediately (do not loop) |
| `BROWSER_AUTH_REQUIRED`     | **No**     | Permanent / Domain  | Fail task (requires user action)    |
| `BROWSER_CAPTCHA_REQUIRED`  | **No**     | Manual Intervention | Fail task (human/anti-bot required) |
| `BROWSER_SAFETY_VIOLATION`  | **No**     | Permanent           | Block navigation immediately        |

---

## 6. Safety: Read-Only vs. Side-Effecting Operations

Browser actions are conceptually separated into:

### Read-Only Actions

Safe to retry unconditionally.

- `goto`, `getText`, `getAttribute`, `screenshot`, `getTitle`, `getUrl`

### Side-Effecting Actions

Can alter external state.

- `click` on submission buttons, `fill` followed by submit, file uploads, account mutations.

> **Rule**: Any future task performing a side-effecting browser operation must enforce an explicit `idempotencyKey` and pre-execution verification to prevent duplicate submissions upon task retries.

---

## 7. URL Navigation Safety & Logging Redaction

1. **Protocol Restriction**: Only `http:` and `https:` schemes are allowed. `file:`, `javascript:`, `data:`, and `ftp:` URLs throw `BrowserError.safetyViolation` before navigation.
2. **Credential & Secret Redaction**: All logged URLs have basic auth (`user:pass@`) stripped and sensitive query parameters (`token`, `auth`, `key`, `password`) replaced with `[REDACTED]`.
3. **No Sensitive Logging**: Cookies, storage state, form contents, and authorization headers are never logged.

---

## 8. Provider Replacement Strategy

To switch from one managed provider to another (e.g. from Browserless to Browserbase):

1. Update `BROWSER_PROVIDER_URL` and `BROWSER_PROVIDER_TOKEN` in `.env.local`.
2. Because the provider interface (`BrowserProvider`) is decoupled, **zero changes are required in domain services or tasks**.

---

## 9. Testing Strategy

1. **Hermetic Unit Tests** (`test/browser/*.test.ts`):
   - Test session contracts, error mapping, navigation safety, and lifecycle cleanup using `MockBrowserProvider`.
   - Run in milliseconds without network or browser downloads.
2. **Environment-Aware Integration Tests** (`test/browser/integration.test.ts`):
   - Live tests that connect to a real managed browser provider when `BROWSER_PROVIDER_URL` is supplied in the environment.
   - Automatically and cleanly skipped during offline CI or hermetic runs.
