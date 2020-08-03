export class PaystreamConfig{
  [key: string]: string | undefined

  constructor(
    public readonly username: string,
    public readonly apiKey: string,
    public readonly apiRoot: string,
  ) {}
}
