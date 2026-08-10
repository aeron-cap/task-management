import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidDateRange', async: false })
export class IsValidDateRange implements ValidatorConstraintInterface {
  validate(dueDate: unknown, arguments_: ValidationArguments): boolean {
    const { startDate } = arguments_.object as { startDate?: unknown };

    if (typeof dueDate !== 'string' || typeof startDate !== 'string') {
      return true;
    }

    return dueDate >= startDate;
  }

  defaultMessage(): string {
    return 'dueDate cannot be earlier than startDate';
  }
}
