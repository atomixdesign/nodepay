export interface APIResponse {
  Data: Record<string, unknown>
  Error: Record<string, unknown>
  ErrorMessage?: Record<string, string>
}
