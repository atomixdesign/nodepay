export class BPOINTConfig{
  [key: string]: string | undefined

  constructor(
    public username: string,
    public password: string,
    public apiRoot: string,
    public merchantId?: string,
  ) {}
}
