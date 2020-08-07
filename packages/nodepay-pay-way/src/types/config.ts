export class PaywayConfig {
  [key: string]: string | undefined

  constructor(
    public readonly bankAccountId: string,
    public readonly merchantId: string,
    public readonly secretKey: string,
    public readonly publishableKey: string,
    public readonly apiRoot: string,
    public readonly responseType: 'json' | 'xml',
  ) {}
}
