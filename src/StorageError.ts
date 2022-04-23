export class StorageError extends Error {
  constructor (message: string, stack?: string) {
    super(message);

    this.name = 'StorageError';

    if (stack) {
      this.stack = stack;
    }
  }
}
