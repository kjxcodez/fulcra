import { tasks } from "@trigger.dev/sdk/v3"
import { env } from "../../config/env"
import { logger } from "../logger"

export interface DispatchOptions {
  idempotencyKey?: string
  delay?: string
  ttl?: string
}

export interface DispatchResult {
  success: boolean
  mode: "live" | "dry-run"
  handle?: {
    id: string
  }
  taskId: string
  idempotencyKey?: string
}

export class TriggerDispatcher {
  private isConfigured(): boolean {
    return Boolean(env.TRIGGER_SECRET_KEY)
  }

  public async dispatch<TPayload>(
    taskId: string,
    payload: TPayload,
    options?: DispatchOptions
  ): Promise<DispatchResult> {
    if (!this.isConfigured()) {
      logger.info(
        `[TriggerDispatcher] Offline / unconfigured: dry-run dispatch for task "${taskId}"`,
        {
          taskId,
          idempotencyKey: options?.idempotencyKey,
        }
      )
      return {
        success: true,
        mode: "dry-run",
        taskId,
        idempotencyKey: options?.idempotencyKey,
      }
    }

    try {
      logger.info(
        `[TriggerDispatcher] Dispatching task "${taskId}" to Trigger.dev`,
        {
          taskId,
          idempotencyKey: options?.idempotencyKey,
        }
      )

      const handle = await tasks.trigger(taskId, payload, {
        idempotencyKey: options?.idempotencyKey,
        delay: options?.delay,
        ttl: options?.ttl,
      })

      return {
        success: true,
        mode: "live",
        handle: {
          id: handle.id,
        },
        taskId,
        idempotencyKey: options?.idempotencyKey,
      }
    } catch (error) {
      logger.error(`[TriggerDispatcher] Failed to dispatch task "${taskId}"`, {
        taskId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }
}

export const triggerDispatcher = new TriggerDispatcher()
