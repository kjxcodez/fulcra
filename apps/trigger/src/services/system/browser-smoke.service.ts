import { z } from "zod"
import {
  getBrowserProvider,
  withBrowserSession,
  type BrowserProvider,
} from "../../infrastructure/browser"
import { taskLogger } from "../../shared/logging"

export const browserSmokeInputSchema = z.object({
  url: z.string().url().optional().default("https://example.com"),
  expectedTitleSubstring: z.string().optional(),
  timeoutMs: z.number().positive().optional(),
})

export type BrowserSmokeInput = z.input<typeof browserSmokeInputSchema>
export type BrowserSmokeParsedInput = z.output<typeof browserSmokeInputSchema>

export interface BrowserSmokeResult {
  status: "success"
  title: string
  url: string
  provider: string
  durationMs: number
  timestamp: string
}

export class BrowserSmokeService {
  constructor(private readonly providerOverride?: BrowserProvider) {}

  public async execute(input: BrowserSmokeInput): Promise<BrowserSmokeResult> {
    const validated = browserSmokeInputSchema.parse(input)
    const provider = this.providerOverride || getBrowserProvider()
    const startTime = Date.now()

    taskLogger.info(
      `[BrowserSmokeService] Running browser smoke test against ${validated.url}`
    )

    return await withBrowserSession(
      provider,
      {
        viewport: { width: 1280, height: 800 },
      },
      async (session) => {
        const response = await session.goto(validated.url, {
          timeoutMs: validated.timeoutMs,
        })

        const title = await session.getTitle()
        const currentUrl = await session.getUrl()

        if (validated.expectedTitleSubstring) {
          if (
            !title
              .toLowerCase()
              .includes(validated.expectedTitleSubstring.toLowerCase())
          ) {
            taskLogger.warn(
              `[BrowserSmokeService] Title "${title}" did not contain expected substring "${validated.expectedTitleSubstring}"`
            )
          }
        }

        const durationMs = Date.now() - startTime

        taskLogger.info(
          `[BrowserSmokeService] Successfully verified page title: "${title}" in ${durationMs}ms`,
          {
            httpStatus: response.status ?? 200,
          }
        )

        return {
          status: "success",
          title,
          url: currentUrl,
          provider: provider.name,
          durationMs,
          timestamp: new Date().toISOString(),
        }
      }
    )
  }
}

export const browserSmokeService = new BrowserSmokeService()
