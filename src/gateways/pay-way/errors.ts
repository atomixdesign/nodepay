export enum ErrorType {
  NotEmpty = '$[identifier] is empty. Value is required.',
  AlphanumRequired = '$[identifier] contains illegal characters. Only letters and numbers allowed, received $value.',
  NumberRequired = '$[identifier] is not a number. Number required, received $value.',
  IpInvalid = '$[identifier] is invalid. Received $value.',
  FieldTooLong = '$[identifier] is too long. Maximal length is $constraint1 characters, but actual is $value.',
  NotACreditCard = '$[identifier] is not a valid credit card number.',
  LengthOutOfBounds = '$[identifier] falls out of the expected length. Expected length between $constraint1 and $constraint2. Was $value.',
}

export class Errors { // Error factory
  static getErrorMessage(messageForType: ErrorType, id: string): string {
    return messageForType.replace('$[identifier]', id)
  }
}
