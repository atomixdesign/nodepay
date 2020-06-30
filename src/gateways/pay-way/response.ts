export type APIResponse = {
    response?: {
        status: string
        statusText: string
    } | Record<string, unknown>
  }
