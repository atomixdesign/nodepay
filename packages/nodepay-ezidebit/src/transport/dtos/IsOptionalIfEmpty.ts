import {
  ValidationOptions,
  ValidateIf,
} from 'class-validator'

export function IsOptionalIfEmpty(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_object, value) => {
    return value !== null && value !== undefined && value !== ''
  }, validationOptions)
}
