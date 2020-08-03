export class BPOINTConfig{
  [key: string]: string | undefined

  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly apiRoot: string,
    public readonly merchantId?: string,
  ) {}
}
