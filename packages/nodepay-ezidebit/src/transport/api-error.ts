import { CustomError } from 'ts-custom-error'

export class EzidebitAPIError extends CustomError {
  public code: number

  public constructor(
    { Error, ErrorMessage }: { Error: number; ErrorMessage: string },
  ) {
    super(ErrorMessage)
    this.code = Error
  }
}
