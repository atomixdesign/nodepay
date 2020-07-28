export enum ErrorType {
  NotEmpty = '$[identifier] is empty. Value is required.',
  AlphanumRequired = '$[identifier] contains illegal characters. Only letters and numbers allowed, received $value.',
  IpInvalid = '$[identifier] is invalid. Received $value.',
  FieldTooLong = '$[identifier] is too long. Maximal length is $constraint1 characters.',
  NotANumber = '$[identifier] is not a number. Number required, received $value.',
  NotACreditCard = '$[identifier] is not a valid credit card number. Received $value.',
  NotADate = '$[identifier] is not a valid date. Received $value.',
  NotAnEmail = '$[identifier] is not a valid email. Received $value.',
  NotAMobilePhone = '$[identifier] is not a valid mobile phone number. Received $value.',
  NotAPhoneNumber = '$[identifier] is not a valid phone number. Received $value.',
  NotABoolean = '$[identifier] is not a valid mobile phone number. Received $value.',
  LengthOutOfBounds = '$[identifier] falls out of the expected length. Expected length between $constraint1 and $constraint2.',
  ValueTooLow = 'Value too low for $[identifier]. Was $value, but minimum is $constraint1',
  NotInAllowedSet = 'Value for $[identifier] was not in the allowed set. Received $value.',
}

export class ErrorFactory { // Error factory
  static getErrorMessage(messageForType: ErrorType, id: string): string {
    return messageForType.replace('$[identifier]', id)
  }
}
