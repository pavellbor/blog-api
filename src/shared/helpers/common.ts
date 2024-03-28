import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

import { ValidationErrorField } from '../libs/rest/index.js';
import { ApplicationError } from '../libs/rest/types/application-error.enum.js';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V): T {
  return plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
  });
}

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return {
    errorType,
    error,
    details,
  };
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  const createMessages = (constraints: ValidationError['constraints'], children: ValidationError[]) => {
    const messages = [];

    if (constraints) {
      messages.push(...Object.values(constraints));
    }

    if (children) {
      children.forEach(({ constraints: childrenConstraints }) => {
        messages.push(...Object.values(childrenConstraints));
      });
    }

    return messages;
  };

  return errors.map(({ property, value, constraints, children }) => ({
    property,
    value,
    messages: createMessages(constraints, children),
  }));
}

export function getFullServerPath(host: string, port: string): string {
  return `http://${host}:${port}`;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
