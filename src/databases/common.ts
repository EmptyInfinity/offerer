export class DuplicatedFieldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'duplicatedField';
  }
}
