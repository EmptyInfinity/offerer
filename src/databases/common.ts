/* eslint-disable max-classes-per-file */
export class DBDuplicatedFieldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'duplicatedField';
  }
}

export class DBNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'notFoundError';
  }
}
