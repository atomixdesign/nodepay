export interface OnceOffPayment {
  charge(...args: unknown[]): Promise<unknown>
}
