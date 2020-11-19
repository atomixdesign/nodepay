export class FatzebraDirectDebit {
  constructor(
    public readonly description: string,
    public readonly amount: number,
    public readonly accountName?: string,
    public readonly accountNumber?: string,
    public readonly BSBNumber?: string,
    public readonly date?: string,
    public readonly reference?: string,
    public readonly bankAccount?: string,
  ) {}
}
