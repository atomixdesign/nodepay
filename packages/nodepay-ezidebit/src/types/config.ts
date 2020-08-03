export class EzidebitConfig {
  [key: string]: string | undefined

  constructor(
    public readonly clientId: string,
    public readonly digitalKey: string,
    public readonly publicKey: string,
    public readonly apiRoot: string,
    public readonly nonPCIApiRoot: string,
  ) {}
}
