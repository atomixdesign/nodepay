import { CustomError } from 'ts-custom-error'

export class BPOINTAPIError extends CustomError {
  public code: number

  public constructor(
    { ResponseCode, ResponseText }: { ResponseCode: number; ResponseText: string },
  ) {
    super(ResponseText)
    this.code = ResponseCode
  }
}
